/**
 * Support for writing math formulas using LaTex synta
 */
(function (extension) {
  'use strict';

  if (typeof showdown !== 'undefined') {
    // global (browser or nodejs global)
    extension(showdown);
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(['showdown'], extension);
  } else if (typeof exports === 'object') {
    // Node, CommonJS-like
    module.exports = extension(require('showdown'));
  } else {
    // showdown was not found so we throw
    throw Error('Could not find showdown library');
  }

}(function (showdown) {
  'use strict';

  var latexCodeBlocks = [];

  /**
   * 支持数学公式的编辑，语法参照 LaTeX。
   * 
   * Support editing of mathematical formulas, syntax reference LaTeX.
   */
  showdown.extension('mathjax', function () {
    return [
      {
        type:    'lang',
        regex:   '(?:^|\\n)~D~D(.*)\\n([\\s\\S]*?)\\n~D~D',
        replace: function (match, leadingSlash, codeblock) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            return '\n\n~Z' + (latexCodeBlocks.push({text: match.substring(1), codeblock: codeblock}) - 1) + 'Z\n\n';
          }
        }
      },

      {
        type:    'lang',
        regex:   '~D([^`\\f\\n\\r]+?)~D',
        replace: function (match, leadingSlash, codeblock) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            return '~Z' + (latexCodeBlocks.push({text: match, codeblock: codeblock}) - 1) + 'Z';
          }
        }
      },

      {
        type:    'output',
        regex:   '~(Z)(\\d+)\\1',
        replace: function (match, leadingSlash, index) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            index = Number(index);
            var code = latexCodeBlocks[index].text;
            return code.replace(/~D/g, '$$');
          }
        }
      },

      // 清除缓存
      // clear cache
      {
        type: 'output',
        filter: function (text, globals_converter, options) {
          latexCodeBlocks = [];

          return text;
        }
      },

    ];
  });

}));