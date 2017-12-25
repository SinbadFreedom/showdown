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
               return Number(index0) > Number(index1) ? 1 : -1;
             }
  );
  return array;
});
