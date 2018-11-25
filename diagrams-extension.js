/**
 * Support for text format sequence diagrams and flowcharts
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

  var diagramSeqBlocks = [];
  var diagramFlowBlocks = [];

  showdown.extension('diagrams', function () {
    return [
      {
        type:    'lang',
        regex:   '(?:^|\\n)```seq(.*)\\n([\\s\\S]*?)\\n```',
        replace: function (match, leadingSlash, codeblock) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            return '\n\n~X' + (diagramSeqBlocks.push({text: match.substring(1), codeblock: codeblock}) - 1) + 'X\n\n';
          }
        }
      },

      {
        type:    'lang',
        regex:   '(?:^|\\n)```flow(.*)\\n([\\s\\S]*?)\\n```',
        replace: function (match, leadingSlash, codeblock) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            return '~Y' + (diagramFlowBlocks.push({text: match, codeblock: codeblock}) - 1) + 'Y';
          }
        }
      },

      {
        type:    'output',
        regex:   '~(X|Y)(\\d+)\\1',
        replace: function (match, leadingSlash, index) {
          // Check if we matched the leading \ and return nothing changed if so
          if (leadingSlash === '\\') {
            return match;
          } else {
            if ('X' == match.charAt(1)) {
              return '<div style="white-space: pre" class="diagram seq", id="diagram_seq_' + index + '">' + diagramSeqBlocks[index].codeblock + '</div>';
            } else {
              return '<div style="white-space: pre" class="diagram flow", id="diagram_flow_' + index + '">' + diagramFlowBlocks[index].codeblock + '</div>';
            }
          }
        }
      },

    ];
    
  });
}));