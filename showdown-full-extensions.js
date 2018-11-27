/**
 * showdown extension
 * 
 * see [GitHub](https://github.com/excing/showdown-extensions)
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
            return latexCodeBlocks[index].text.replace(/~D/g, '$$');
          }
        }
      },

    ];
    
  });

  var diagramSeqBlocks = [];
  var diagramFlowBlocks = [];

  /**
   * 支持时序图和流程图的编辑，语法参见：js-sequence-diagrams 和 flowchart。
   * 
   * Support for the editing of sequence diagrams and flowcharts. See the syntax: js-sequence-diagrams and flowchart.
   */
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

  /**
   * 支持 ![](https://video.mp4) 语法的视频显示。
   * 
   * Support for the syntax of video display, syntax: ![](https://video.mp4)
   */
  showdown.extension('video', function () {
    return [

      {
        type:    'output',
        regex:   '<p><img src="(.+(mp4|ogg|webm).*?)"(.+?)\\/>',
        replace: function (match, url, format, other) {
          // Check if we matched the leading \ and return nothing changed if so
          if (url === ('.' + format)) {
            return match;
          } else {
            // src="https://image.png" alt="image alt text" title="image title" width="100" height="auto"
            // var regex = /([a-z]+)="(.*?)"/g;

            // return `<video src="${url}" ${other} controls>I am sorry; your browser does not support HTML5 video in WebM with VP8/VP9 or MP4 with H.264.</video>`;
            return `<video ${other} controls><source src="${url}" type="video/${format}">I am sorry; your browser does not support HTML5 video in WebM with VP8/VP9 or MP4 with H.264.</video>`;
          }
        }
      },

    ];
    
  });

  var catalogues = [];

  /**
   * 支持 <h1> 到 <h6> 的目录显示
   * 
   * Support <h1> to <h6> catalog display
   */
  showdown.extension('catalog', function () {
    return [

      {
        type:    'output',
        regex:   '<h\\d id="(.+?)">(.*?)<\\/h(\\d)>',
        replace: function (match, id, title, level) {
          catalogues.push({'id': id, 'title': title, 'level': level});

          return match;
        }
      },

      {
        type: 'output',
        filter: function (text, globals_converter, options) {
          var catDiv = '<div class="cat">';
          var lastLevel = 0;
          var levelCount = 0;

          for (var i = 0; i < catalogues.length; i++) {
            var cat = catalogues[i];

            if (cat.level < lastLevel) {
              var count = lastLevel - cat.level;
              if (levelCount < count) {
                count = levelCount;
              }
              for (var l = 0; l < count; l++) {
                catDiv += ('</ul>');
              }
              catDiv += ('<ul>');
              levelCount ++;
              levelCount -= count;
            } else if (lastLevel < cat.level) {
              catDiv += ('<ul>');
              levelCount ++;
            }
            catDiv += ('<li><a href="#' + cat.id + '">' + cat.title + '</a></li>');

            lastLevel = cat.level;
          }

          catDiv += '</ul></div>';

          return catDiv + text;
        }
      },
    ];
    
  });

}));