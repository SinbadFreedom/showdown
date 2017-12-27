/**
 * 获取文章一级标题和二级标题
 * 一级标题====
 * 二级标题----
 * add by sinbad 20170912
 */
showdown.subParser('pageTitle', function (text, options, globals) {
  'use strict';
  text = globals.converter._dispatch('headers.before', text, options, globals);
  // Set text-style headers:
  //	Header 1
  //	========
  //
  //	Header 2
  //	--------
  //
  var array = [];
  var setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

  text.replace(setextRegexH1, function (wholeMatch, m1) {
    /** === 一级标题 */
    var header1 = showdown.subParser('spanGamut')(m1, options, globals);
    array.push(header1);
  });

  text.replace(setextRegexH2, function (matchFound, m1) {
    /** --- 二级标题 */
    var header2 = showdown.subParser('spanGamut')(m1, options, globals);
    array.push(header2);
  });

  /** 标题从小到大排序*/
  array.sort(function (a, b) {
               var index0 = a.split(" ")[0];
               var index1 = b.split(" ")[0];
               /** 校正小数1.3，1.21  的大小比较, 1.21应该在1.3的后面*/

               var arr0 = index0.split(".");
               var arr1 = index1.split(".");

               var count0 = 0;
               var count1 = 0;

               if (arr0.length === 1) {
                 count0 = Number(arr0[0]) * 100;
               } else if (arr0.length === 2) {
                 count0 = Number(arr0[0]) * 100 + Number(arr0[1]);
               }

               if (arr1.length === 1) {
                 count1 = Number(arr1[0]) * 100;
               } else if (arr1.length === 2) {
                 count1 = Number(arr1[0]) * 100 + Number(arr1[1]);
               }

               return count0 * 1000 > Number(count1) * 1000 ? 1 : -1;
             }
  );
  return array;
});
