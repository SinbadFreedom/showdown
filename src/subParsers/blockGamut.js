/**
 * These are al/l the transformations that form block-level
 * tags like paragraphs, headers, and list items.
 */
showdown.subParser('blockGamut', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('blockGamut.before', text, options, globals);

  // we parse blockquotes first so that we can have headings and hrs
  // inside blockquotes
  text = showdown.subParser('blockQuotes')(text, options, globals);

  /** 加入一级标题和二级标题*/
  /**
   <div class="dsd_title">
   <h1>附录</h1>
   </div>
   <div class="dsd_catalog">
   <a href="http://localhost/article/java/addenda/Java示例代码使用方法.html">Java示例代码使用方法</a>
   <hr>
   <a href="http://localhost/article/java/addenda/Java中@Override标签作用.html">Java中@Override标签作用</a>
   <hr>
   <a href="http://localhost/article/java/addenda/Java编码规范.html">Java编码规范</a>
   <hr>
   <a href="http://localhost/article/java/addenda/Java保留关键字.html">Java保留关键字</a>
   </div>
   */
  var pageTitleArray = showdown.subParser('pageTitle')(text, options, globals);
  var pageTitleList = '';
  if(pageTitleArray && pageTitleArray.length > 0) {
    pageTitleList += '<div>';
    // /** 文章标题*/
    // pageTitleList += '<div class="dsd_title"><h1>' + pageTitleArray[0] + '</h1></div>';
    /** 子标题*/
    if(pageTitleArray.length > 0) {
      pageTitleList += '<div class="dsd_catalog">';
      for(var i = 0; i < pageTitleArray.length; i++) {
        var id = pageTitleArray[i].split(' ')[0];
        if(id.indexOf(".") === -1) {
          /** 一级标题*/
          pageTitleList += '<a href="#' + id + '">' + pageTitleArray[i] + '</a><br>';
        } else {
          /** 二级标题*/
          pageTitleList += '<p><a href="#' + id + '">' + pageTitleArray[i] + '</a></p>';
        }
        // if(i < pageTitleArray.length -1){
        //   /** 加入横线*/
        //   pageTitleList += '<hr>';
        // }
      }
      pageTitleList += '</div>';
    }
    pageTitleList += '</div>';
  }


  text = showdown.subParser('headers')(text, options, globals);

  // Do Horizontal Rules:
  text = showdown.subParser('horizontalRule')(text, options, globals);

  text = showdown.subParser('lists')(text, options, globals);
  text = showdown.subParser('codeBlocks')(text, options, globals);
  text = showdown.subParser('tables')(text, options, globals);

  // We already ran _HashHTMLBlocks() before, in Markdown(), but that
  // was to escape raw HTML in the original Markdown source. This time,
  // we're escaping the markup we've just created, so that we don't wrap
  // <p> tags around block-level tags.
  text = showdown.subParser('hashHTMLBlocks')(text, options, globals);
  text = showdown.subParser('paragraphs')(text, options, globals);

  text = globals.converter._dispatch('blockGamut.after', text, options, globals);


  return pageTitleList + text;
});
