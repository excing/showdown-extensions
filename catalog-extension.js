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