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

  var needCat = false;
  var catalogues = [];

  /**
   * 支持 <h1> 到 <h6> 的目录显示
   * 
   * Support <h1> to <h6> catalog display
   */
  showdown.extension('catalog', function () {
    return [

      {
        type:    'lang',
        regex:   '\\n(\\[TOC\\])\\n',
        replace: function (match) {
          needCat = true;

          return '[[[TOC]]]]]';
        }
      },

      {
        type:    'output',
        regex:   '<h\\d id="(.+?)">(.*?)<\\/h(\\d)>',
        replace: function (match, id, title, level) {
          if (needCat) {
            var title_ahref_reg = /(.*?)<a .*>(.*?)<\/a>(.*)/g;
            var title_ahref_reg_match = title_ahref_reg.exec(title);
            if (null !== title_ahref_reg_match) {
              title = title_ahref_reg_match[1] + ' ' + title_ahref_reg_match[2] + ' ' + title_ahref_reg_match[3];
            }
            catalogues.push({'id': id, 'title': title, 'level': level});
          }

          return match;
        }
      },

      {
        type: 'output',
        filter: function (text, globals_converter, options) {
          if (catalogues.length <= 0) return text;

          var catDiv = '<div class="cat" id="toc_catalog">';
          var lastLevel = 0;
          var levelCount = 0;

          for (var i = 0; i < catalogues.length; i++) {
            var cat = catalogues[i];

            if (cat.level < lastLevel) {
              var count = lastLevel - cat.level;
              if (levelCount <= count) {
                count = levelCount - 1;
              }
              for (var l = 0; l < count; l++) {
                catDiv += ('</ul>');
              }
              levelCount -= count;
            } else if (lastLevel < cat.level) {
              catDiv += ('<ul>');
              levelCount ++;
            }
            catDiv += ('<li><a href="#' + cat.id + '">' + cat.title + '</a></li>');

            lastLevel = cat.level;
          }

          catDiv += '</ul></div>';

          // 清除缓存
          // clear cache
          needCat = false;
          catalogues = [];

          return text.replace(/\[\[\[TOC\]\]\]\]\]/g, catDiv);
        }
      },
    ];
    
  });

}));