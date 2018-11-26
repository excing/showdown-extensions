/**
 * you will need:
 * 1. showdown
 * 2. prismjs
 * 3. raphael
 * 4. underscore
 * 5. js-sequence-diagrams
 * 6. flowchart
 * 7. MathJax(optional)
 * 
 * recommend cdn:
 * 1. showdown, raphael, underscore, js-sequence-diagrams:
 *      https://cdn.jsdelivr.net/combine/npm/showdown@1.5.0,npm/raphael@2.2.7,npm/underscore@1.9.1,npm/js-sequence-diagrams@1000000.0.6
 * 2. prismjs:
 *      https://cdn.jsdelivr.net/combine/npm/prismjs@9000.0.1,npm/prismjs@9000.0.1/components/prism-java.min.js,npm/prismjs@9000.0.1/components/prism-javascript.min.js,npm/prismjs@9000.0.1/components/prism-go.min.js,npm/prismjs@9000.0.1/components/prism-powershell.min.js,npm/prismjs@9000.0.1/components/prism-python.min.js,npm/prismjs@9000.0.1/components/prism-sql.min.js
 * 3. flowchart:
 *      https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.11.3/flowchart.min.js
 * 4. MathJax(optional):
 *      https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_CHTML&latest
 * 
 * 
 * @param {div} container 
 * @param {string} md 
 * @param {string} mathJaxCDN optional
 */
function markdownToHtml(container, md, mathJaxCDN='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_CHTML&latest') {

  // markdown to transform Html
  var converter = new showdown.Converter({disableForced4SpacesIndentedSublists: 'true', tasklists: 'true', tables: 'true', extensions: ['mathjax', 'diagrams', 'video']}),
      html      = converter.makeHtml(md);

  container.innerHTML = html;

  var diagramOptions = {
      'theme': 'simple',
      stroke: "#000",
      'line-width': 2,
      "font-size": 16,
      "font-family": "Andale Mono, monospace",
      "font-stretch": "normal",
  }; 

  var flows = document.getElementsByClassName("flow");
  for (var i = 0; i < flows.length; i++) {
      var flow = flows[i];
      try {
          var chart = flowchart.parse(flow.innerText);
          flow.innerText = '';
          chart.drawSVG(flow.id, diagramOptions);
      } catch (exception_var_1) {
          console.log('chart.drawSVG err: ' + exception_var_1);
      }
  }

  var seqes = document.getElementsByClassName("seq");
  for (var i = 0; i < seqes.length; i++) {
      var seq = seqes[i];
      try {
          var diagram = Diagram.parse(seq.innerText);
          seq.innerText = '';
          diagram.drawSVG(seq.id, diagramOptions);
      } catch (exception_var_2) {
          console.log('Diagram.drawSVG err: ' + exception_var_2);
      }
  }

  var re = new RegExp('(\\$\\$|\\$)(.+?)\\1', 'g');
  var reArray = re.exec(container.innerText);

  if (null != reArray) {
    // load MathJax and LaTeX (TeX, MathML, AsciiMath) text transform to Html element
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src  = mathJaxCDN;
    try {
        document.getElementsByTagName("head")[0].appendChild(script);
    } catch (exception_var_3) {
        console.log('load MathJax err: ' + exception_var_3);
    }
  }

  try {
      // highlight code
      Prism.highlightAll();
  } catch (exception_var_4) {
      console.log('Prism.highlightAll err: ' + exception_var_4);
  }
}

/**
 * showdown extension
 * 
 * latex and diagram(seq and flow) support
 * 
 * 数学公式 LaTex 和 示意图（时序图和流程）的 showdown 扩展支持
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

}));