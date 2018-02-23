showdown.subParser('headers', function (text, options, globals) {
  'use strict';

  text = globals.converter._dispatch('headers.before', text, options, globals);

  var headerLevelStart = (isNaN(parseInt(options.headerLevelStart))) ? 1 : parseInt(options.headerLevelStart),
      // ghHeaderId = options.ghCompatibleHeaderId,

  // Set text-style headers:
  //	Header 1
  //	========
  //
  //	Header 2
  //	--------
  //
      setextRegexH1 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n={2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n=+[ \t]*\n+/gm,
      setextRegexH2 = (options.smoothLivePreview) ? /^(.+)[ \t]*\n-{2,}[ \t]*\n+/gm : /^(.+)[ \t]*\n-+[ \t]*\n+/gm;

  text = text.replace(setextRegexH1, function (wholeMatch, m1) {
    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        hLevel = headerLevelStart,
      /** 一级标题 ===*/
        // hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
        // hashBlock = '<div class="dsd_title_1"><a href="#top" ' + hID + '>' + spanGamut + '</a></div>';
        hashBlock = '<div' + hID + '><h3>' + spanGamut + '</h3></div>';
    // hashBlock = '<div class="dsd_title"><h1>' + spanGamut +'</h1></div>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
    // /** 这里移除一级标题, 采用pageTitle显示*/
    // console.log(wholeMatch);
    // console.log(m1);
    // return '';
  });

  text = text.replace(setextRegexH2, function (matchFound, m1) {
    var spanGamut = showdown.subParser('spanGamut')(m1, options, globals),
        hID = (options.noHeaderId) ? '' : ' id="' + headerId(m1) + '"',
        // hLevel = headerLevelStart + 1,
      /** 二级标题 ---*/
        // hashBlock = '<h' + hLevel + hID + '>' + spanGamut + '</h' + hLevel + '>';
        // hashBlock = '<h4' + hID + ' class="alert alert-success" >' + spanGamut + '</h4>';
        // hashBlock = '<div class="dsd_title_2"><a href="#top" ' + hID + '>' + spanGamut + '</a></div>';
        hashBlock = '<div' + hID + '><h4>' + spanGamut + '</h4></div>';
    return showdown.subParser('hashBlock')(hashBlock, options, globals);
  });

  // atx-style headers:
  //  # Header 1
  //  ## Header 2
  //  ## Header 2 with closing hashes ##
  //  ...
  //  ###### Header 6
  //
  var atxStyle = (options.requireSpaceBeforeHeadingText) ? /^(#{1,6})[ \t]+(.+?)[ \t]*#*\n+/gm : /^(#{1,6})[ \t]*(.+?)[ \t]*#*\n+/gm;

  text = text.replace(atxStyle, function (wholeMatch, m1, m2) {
    var hText = m2;
    if (options.customizedHeaderId) {
      hText = m2.replace(/\s?\{([^{]+?)}\s*$/, '');
    }

    var span = showdown.subParser('spanGamut')(hText, options, globals),
        // hID = (options.noHeaderId) ? '' : ' id="' + headerId(m2) + '"',
        hLevel = headerLevelStart - 1 + m1.length,
        // header = '<h' + hLevel + hID + '>' + span + '</h' + hLevel + '>';
        header = '<h' + hLevel + '>' + span + '</h' + hLevel + '>';

    return showdown.subParser('hashBlock')(header, options, globals);
  });

  function headerId (m) {
    // var title;
    //
    // // It is separate from other options to allow combining prefix and customized
    // if (options.customizedHeaderId) {
    //   var match = m.match(/\{([^{]+?)}\s*$/);
    //   if (match && match[1]) {
    //     m = match[1];
    //   }
    // }
    //
    // // Prefix id to prevent causing inadvertent pre-existing style matches.
    // if (showdown.helper.isString(options.prefixHeaderId)) {
    //   title = options.prefixHeaderId + m;
    // } else if (options.prefixHeaderId === true) {
    //   title = 'section ' + m;
    // } else {
    //   title = m;
    // }
    //
    // if (ghHeaderId) {
    //   title = title
    //     .replace(/ /g, '-')
    //     // replace previously escaped chars (&, ¨ and $)
    //     .replace(/&amp;/g, '')
    //     .replace(/¨T/g, '')
    //     .replace(/¨D/g, '')
    //     // replace rest of the chars (&~$ are repeated as they might have been escaped)
    //     // borrowed from github's redcarpet (some they should produce similar results)
    //     .replace(/[&+$,\/:;=?@"#{}|^¨~\[\]`\\*)(%.!'<>]/g, '')
    //     .toLowerCase();
    // } else {
    //   title = title
    //     .replace(/[^\w]/g, '')
    //     .toLowerCase();
    // }
    //
    // if (globals.hashLinkCounts[title]) {
    //   title = title + '-' + (globals.hashLinkCounts[title]++);
    // } else {
    //   globals.hashLinkCounts[title] = 1;
    // }
    // return title;
    return m.split(' ')[0];
  }

  text = globals.converter._dispatch('headers.after', text, options, globals);
  return text;
});
