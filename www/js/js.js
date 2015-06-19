
  var links = [];
  var xml_content = "";

    $(document).ready(function(){
      var h = $(window).height() - 50;
      var w = $(window).width() - 20;
      $("#results").css("height", h+'px');
      $("#results").css("width", w+'px');
      loadStories();
  });

    $(window).resize(function() {
      var h = $(window).height() - 50;
      var w = $(window).width() - 20;
      $("#results").css("height", h+'px');
      $("#results").css("width", w+'px');
    });

  function setXmlContent (content) {
    xml_content += content+"<br />";
  }

  function loadStories(){
    YUI().use('node', 'event', 'yql', function(Y) {

      var news_url = "http://lindaikeji.blogspot.com/";  
      var yql_query = "select * from html where url='" + news_url+ "'";
      yql_query += " and xpath='//h3[@itemprop=\"name\"]'";
      querySelector = document.getElementById("results");

      Y.YQL(yql_query, function(response) {  
        if(response.query.results){

          var count = 0;

                var content_links = response.query.results.h3;
                for (var i = 0; i < content_links.length; i++){

                  var story;
            YUI().use('node', 'event', 'yql', function(Z) {

              var link = content_links[i].a.href;
              
              var yql_query = "select * from html where url='" + link + "'";
              yql_query += " and xpath='//h2[@class=\"date-header\"] | //h3[@class=\"post-title entry-title\"] | //div[@itemprop=\"description articleBody\"]'";
              // //div[@itemprop=\"blogPost\"]

              Z.YQL(yql_query, function(response) {  
                if(response.query.results){

                  var contents = response.query.results.div;
                  var dates = response.query.results.h2;
                  var titles = response.query.results.h3;

                  //Dates
                  var story_date = "";
                  if(dates.span != undefined)
                    story_date = wrapReplace(dates.span);

                  //Titles
                  var story_title = "";
                  if(titles.content != undefined)
                    story_title = wrapReplace(titles.content);

                  // Content
                  var main_story = "";

                  if (has (contents, 'div')) {
                    var direct_cont = contents.div;
                    for (var i = 0; i < direct_cont.length; i++) {
                      if(direct_cont[i].content != undefined){
                        main_story += wrapCleanse(direct_cont[i].content, 'div');
                      }

                      if (has (direct_cont, 'span')) {
                        console.log(direct_cont.span)
                        var dcspan = direct_cont.span;
                        for (var i = 0; i < dcspan.length; i++) {

                          if(has(dcspan[i], 'span')){
                            if (dcspan[i].content != undefined) {
                              console.log(dcspan[i].content)
                            }
                          }
                        }
                      }
                    }
                  }

                  if (has (contents, 'span')) {
                    var direct_span = contents.span;
                    //console.log(direct_span);

                    if (has(direct_span, 'span')) {
                      if (has(direct_span.span, 'content')) {
                        main_story += wrapCleanse(direct_span.span.content, 'div');
                      }
                    }

                    for (var i = 0; i < direct_span.length; i++) {
                      if (direct_span[i].content != undefined) {
                        main_story += wrapCleanse(direct_span[i].content, 'div');
                      }
                      


                      if(direct_span[i].span != undefined){
                        if(direct_span[i].span.span != undefined){
                          console.log(direct_cont.span.span.content);
                        }
                      }
                    }
                  }

                  if (has (contents, 'span')) {
                    var span1 = contents.span;
                    if (span1.content != undefined) {
                      main_story += wrapCleanse(span1.content, 'div');
                    }else{
                      if (has (span1, 'span')) {
                        var span2 = span1.span
                        if (span2.content != undefined) {
                          main_story += wrapCleanse(span2.content, 'div');
                        }else{
                          if (has (span2, 'span')) {
                            var span3 = span2.span;
                            if (span3.content != undefined) {
                              main_story += wrapCleanse(span3.content, 'div');
                            }
                          }
                          else{console.log(titles.content);}
                        }
                      }
                      
                    } 
                  }
                  
                  // Content
                  if (contents.content != undefined)
                    main_story += wrapCleanse(contents.content);
                  if (contents.span != undefined){
                    var spans = contents.span;
                    for (var i = 0; i < spans.length; i++) {
                      if(spans[i].content)
                        main_story += wrapCleanse(spans[i].content, 'div');
                    }    
                  }
                    
                  if (contents.blockquote != undefined){
                    var blockquote = contents.blockquote;

                    if(typeof blockquote === 'string'){
                      main_story += wrapCleanse(blockquote, 'div');
                    }else{
                      for (var ii = 0; ii < blockquote.length; ii++) {
                        var content_c = blockquote[ii].content;
                        if(content_c != undefined)
                          main_story += wrapCleanse(content_c, 'div');

                        if(blockquote[ii].div != undefined)
                          if(blockquote[ii].div.content != undefined)
                            main_story += wrapCleanse(blockquote[ii].div.content, 'div');

                        // blockquote that has span
                        if(blockquote[ii].span != undefined){
                          var bspan = blockquote[ii].span;
                          for (var bs = 0; bs < bspan.length; bs++) {

                            
                            if(bspan[bs].span != undefined){
                              console.log(bspan[bs].span);

                              if(bspan[bs].span.content != undefined){
                                //console.log(bspan[bs].span.content);
                              }
                            }

                            if(bspan[bs].content != undefined){
                              console.log(bspan[bs].content);
                              main_story += wrapCleanse(bspan[bs].content, 'div');
                            }

                            // Remove this
                            var bsssp = bspan[bs];
                            for (var bsp = 0; bsp < bsssp.length; bsp++) {
                              if(bsssp[bsp].content != undefined){
                                
                              }
                            }
                          }
                        }
                      }
                    }    
                  }
                  
                  // Videos
                  var video_link = "";
                  if (has (contents, 'iframe'))
                    video_link = wrap(contents.iframe.src);

                  // Images
                  var img_array = [];
                  var images = "";

                  if (has(contents, 'div')) {

                    if (has(contents.div, 'span')) {
                      if (has(contents.div.span, 'span')) {
                        if (has(contents.div.span.span, 'a')) {
                          if (has(contents.div.span.span.a, 'img')) {
                            if (contents.div.span.span.a.img.src != undefined) {
                              var cdssai = contents.div.span.span.a.img.src
                              if (img_array.indexOf(cdssai) == -1){
                                images += wrap(cdssai);
                                img_array.push(cdssai);
                              }
                            }
                          }
                        }
                      }
                    }

                    var imgdivs = contents.div;

                    for (var imd = 0; imd < imgdivs.length; imd++) {
                      if(imgdivs[imd].div != undefined)
                        if(imgdivs[imd].div.a != undefined)
                          if(imgdivs[imd].div.a.img != undefined)
                            if(imgdivs[imd].div.a.img.src != undefined)
                              if (img_array.indexOf(imgdivs[imd].div.a.img.src) == -1){
                                  images += imgdivs[imd].div.a.img.src;
                                  img_array.push(imgdivs[imd].div.a.img.src);
                                }

                    }

                    ++count;
                    if (contents.div.content != undefined && typeof contents.div.content === 'string')
                      main_story += wrapCleanse(contents.div.content, 'div');

                    if(has(contents, 'div')){
                      var divss = contents.div;

                      for (var it = 0; it < divss.length; it++) {
                  
                        if(has(divss[it], 'div')){
                          if (has(divss[it].div, 'a')){
                            var n_a_links = divss[it].div.a
                            if(n_a_links != undefined)
                              for (var i1 = 0; i1 < n_a_links.length; i1++) {
                                if (has(n_a_links[i1], 'img'))
                                  if (has(n_a_links[i1].img, 'src')){
                                    if (img_array.indexOf(n_a_links[i1].img.src) == -1){
                                      images += n_a_links[i1].img.src;
                                      img_array.push(n_a_links[i1].img.src);
                                    }
                                  }
                              }
                        
                    }

                    if (has(divss[it].div, 'img'))
                      var n_i_links = divss[it].div.img
                      if(n_i_links != undefined)
                        for (var i1 = 0; i1 < n_i_links.length; i1++) {
                          if(has(n_i_links[i1], 'src'))
                            if (img_array.indexOf(n_i_links[i1].src) == -1){
                              images += n_i_links[i1].src;
                              img_array.push(n_i_links[i1].src);
                            }
                          }
                        }

                        var a_imgs = divss[it].a;
                        var img_imgs = divss[it].img;
                        if (a_imgs != undefined){
                          for (var it1 = 0; it1 < a_imgs.length; it1++) {
                            var img = a_imgs[it1].img;
                            if (img != undefined)
                              if (img.src != undefined)
                                if (img_array.indexOf(img.src) == -1) {
                                  images += img.src;
                                  img_array.push(img.src);
                                }
                          }
                        }

                        if (img_imgs != undefined){
                          for (var it1 = 0; it1 < img_imgs.length; it1++) {
                            var src = img_imgs[it1].src;
                            if (src != undefined)
                              if (img_array.indexOf(src) == -1) {
                                images += src;
                                img_array.push(src);
                              }
                          };
                        }
                  
                  if (has(divss[it], 'a'))
                    if (has(divss[it].a, 'img'))
                      if (has(divss[it].a.img, 'src'))
                        if (img_array.indexOf(divss[it].a.img.src) == -1){
                          images += divss[it].a.img.src;
                          img_array.push(divss[it].a.img.src);
                        }

                  if (has(divss[it], 'img'))
                    if(has(divss[it].img, 'src'))
                      if (img_array.indexOf(divss[it].img.src) == -1){
                              images += divss[it].img.src;
                              img_array.push(divss[it].img.src);
                            }

                          
                      }
                      
                    }

                    var image_divs = contents.div;
                    for (var l = 0; l < image_divs.length; l++) {


                      // If content has div's that has a's
                      if (has(image_divs[l], 'a')){
                        a_links = image_divs[l].a;
                        //console.log(a_links.href);
                        for (var k = 0; k < a_links.length; k++ ){
                          if(has(a_links[k], 'img'))
                            if(has(a_links[k].img, 'src'))
                              if (img_array.indexOf(a_links[k].img.src) == -1){
                                images += a_links[k].img.src;
                                img_array.push(a_links[k].img.src);
                              }
                        }
                      }

                      // If content has div's that has img's
                      if (has(image_divs[l], 'img')){
                        img_links = image_divs[l].img;
                        for (var k = 0; k < img_links; k++ ){
                          if(has(img_links[k], 'src'))
                            if (img_array.indexOf(img_links[k].src) == -1){
                              images += img_links[k].src;
                              img_array.push(img_links[k].src);
                            }
                        }
                      }
                    };
                  }
                  
                  if(has(contents, 'a')){
                    image_links = contents.a;
                    for (var k = 0; k < image_links; k++ ){
                      if(has(image_links[k], 'img'))
                        if(has(image_links[k].img, 'src'))
                          if (img_array.indexOf(image_links[k].img.src) == -1){
                            images += image_links[k].img.src;
                            img_array.push(image_links[k].img.src);
                          }
                    }
                  }

                  var all = story_date + story_title + img_array + video_link + main_story
                  
                  if (main_story.length > 5) {

                    var this_story = "<div class='section' onclick='showFullStory (\""+ story_date +"\", \""+ story_title +"\", \""+ replaceAll("'", '\'', replaceAll('"', '\"', main_story)) +"\", \""+   img_array +"\", \""+ video_link +"\")'>";
                    this_story += "<div class='title'>" + story_title + "</div>";

                    var num = 0;
                    for (var i = 0; i < img_array.length; i++) {
                      //console.log(img_array)
                      if (img_array[i] != undefined && num == 0) {
                        this_story += "<div class='story_image'>" + wrapImages(img_array[0]) + "</div>";
                        num--;
                      }
                    }
                    this_story += "<div class='story'><div class='story_content'>" + main_story + "</div></div>";
                    this_story += "</div>";
                    setXmlContent(this_story);
                    querySelector.innerHTML = xml_content;
                  }

                }else{
                  console.log("No stories");
                }
              });

            });
          }

        }else{
          console.log("No stories");
        }
      });
      setXmlContent("");
      querySelector.innerHTML = xml_content;
    });
  }

  function showFullStory (date, title, story, images, video) {
    var story = "<div class='date'>" + date +"</div>";
    story += "<div class='title'>" + title + "</div>";
    for (var i = 0; i < images.length; i++) {
      if (images[i] != undefined)
        story += "<div class='title'>" + images[i] + "</div>";
    }
    story += "<div class='video'>" + video_link + "</div>";
    story += "<div class='story'>" + main_story + "</div>";
    console.log(story);
  }

  function wrapCleanse(obj) {
    obj = replaceAll('&#39;', '\'', obj);
    obj = replaceAll('See more photos after the cut...', '', obj);
    obj = replaceAll('See the photos after the cut...', '', obj);
    return replaceAll('\n', '', obj);
  }

  function wrapReplace(obj){
    obj = replaceAll('&#39;', '\'', obj);
    return replaceAll('\n', '', obj);
  }

  function wrap (obj) {
    return obj ;
  }
  function wrapImages(obj) {
    var uniqid = randId ();
    return "<img class='image_items' src='" + obj + "' />" ;
  }

  function toggleFullImage (elem) {
    var e = document.getElementById(elem);
    if (e.style.maxHeight == "50px")
      $("#"+elem).animate({'maxHeight': '700px'}, 400);
    else
      $("#"+elem).animate({'maxHeight': '50px'}, 400);
  }



  function randId () {
    var randLetter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
    var uniqid = randLetter + Date.now() + Math.floor(Math.random() * 26);
    return uniqid;
  }

  function replaceAll(find, replace, str) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  function has (object, res) {
    return (object.hasOwnProperty(res)) ? true : false;
  }
