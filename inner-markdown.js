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
 * @param {array} extensions optional, If you include `mathjax`, it means support for MathJax and load MathJax.js
 */
function innerMarkdownToContainer(container, md, extensions, mathJaxCDN='https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-AMS_CHTML&latest') {
	if (null == extensions) return;

  // markdown to transform Html
  var converter = new showdown.Converter({'disableForced4SpacesIndentedSublists': 'true', 'tasklists': 'true', 'tables': 'true', 'extensions': extensions}),
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

  if (extensions.includes('mathjax') && null != reArray) {
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
