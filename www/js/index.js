
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        getStories();
    }
};

function getStories(){
  var image_url = 'avatar.jpg'; 
  YUI().use('node', 'event', 'yql', function(Y) {
    var stories = "<div class='stories'>";
      var news_url = "http://lindaikeji.blogspot.com/";  
      var yql_query = "select * from html where url='" + news_url+ "'";
      yql_query += " and xpath='//h3[@itemprop=\"name\"] | //div[@itemprop=\"description articleBody\"]'"; 


      Y.YQL(yql_query, function(response) {  
        if(response.query.results){  
          var no_stories = response.query.results.div.length;  
          var titles = response.query.results.h3;
          var contents = response.query.results.div;

          var otherimages = [];
          var all_titles = [];
          var title_text = "Post Title";
          var content_text = "Post Details";
          var link_to_story = "Error: Link to full story not retrieved!";
          var video = null;

          for (var i = 0; i < contents.length; i++) {
              if(titles[i].hasOwnProperty('a')){
                  if(all_titles.indexOf(titles[i].a.content) == -1){

                      all_titles.push(titles[i].a.content);
                      title_text = replaceAll('\n', '', replaceAll('&#39;', '\'', titles[i].a.content));

                      var divContents = contents[i].div;
                      for (var j = 0; j < divContents.length; j++) {
                          if (divContents[j].hasOwnProperty('img')) {
                              var images = divContents[j].img;
                              console.log(images);
                              //image_url = images[0].src;
                              console.log(title_text);
                          }
                          else if (divContents[j].hasOwnProperty('a')) {
                  if (divContents[j].a.hasOwnProperty('img'))
                    image_url = divContents[j].a.img.src;
                  //else
                  //image_url = divContents[j].a.href
                          }
                      }

                      content_text = getContent(contents[i]);

                      if(titles[i].hasOwnProperty('a'))
                          link_to_story = titles[i].a.href;

                      if(contents[i].hasOwnProperty('iframe'))
                          video = contents[i].iframe.src;
                      
                      stories += "<div class='row' onclick='showStory(\"" + link_to_story + "\")' style='height:60px;margin-bottom: 10px;background:whitesmoke;box-shadow: 0px 0px 1px 1px #CBC;'>";
                stories += "<div class='col-xs-3 col-sm-2 col-md-1' style='padding:0px;'>";
                          stories += "<img src='" + image_url + "' class='title-avatar' style='height:60px;' />";
                stories += "</div>";
                        stories += "<div class='col-sm-10 col-xs-9 col-md-11 text' style='height:60px !important;'>";
                          stories += "<div class='title' style='font-weight:bold;'>"+ title_text + "</div>";
                          stories += "<div class='content_desc'>"+ replaceAll('Photo: ', '', content_text) + "</div>";
                          if (video != null)
                              stories += "<div class='video-link'>Video Link: <a href='"+ video +"' target='_blank'>Video Link</a></div>";
                        stories += "</div>";
              stories += "</div>";
                  }
                  else{
                      console.log('Recurring Stories: ' + titles[i].a.content);
                  }
              }
          };  
          
        } else{  
          stories += "Sorry, could not find any headlines for the category " + story + ". Please try another one.";  
        }  
        stories += "</div>";  
        Y.one('#results').append(stories);  
        stories = "";  
      });    
  });
}  
function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}
function checkAvailablity (obj, child) {
    return (obj.hasOwnProperty(child));
}
function getContent (contentVar) {
    if(contentVar.hasOwnProperty('content'))
        var content = contentVar.content;

    else if(contentVar.hasOwnProperty('div')) {
        var content = "Error Fetching content. Click to view full story";
        var divs = contentVar.div;
        if(divs[0].hasOwnProperty('a')){
      if(divs[0].a.hasOwnProperty('img'))
              content = '<img class="inline-images" src='+contentVar.div[0].a.img.src+' />';
      else
        content = contentVar.div[0].a.href;
        }else if(divs[0].hasOwnProperty('div')){
      if(divs[0].div.hasOwnProperty('div') && contentVar.div[0].div.div[1] != undefined){
            content = contentVar.div[0].div.div[1]
            image_url = contentVar.div[0].div.div[0].a.img.src;
      }
        }
        if (divs[1].hasOwnProperty('span')) {
      if (divs[1].span.hasOwnProperty('span')) {
        if (divs[1].span.span.hasOwnProperty('span')) {
          var text = contentVar.div[1].span.span.span.content
          text = (text == undefined || text == 'undefined')? '' : text;
          if (divs[1].span.span.hasOwnProperty('a')){
            if (divs[1].span.span.a.hasOwnProperty('img'))
              content = text+'<br /><img class="inline-images" src='+contentVar.div[0].span.span.a.img.src+' />';
            else
              content = text+'<br /><img class="inline-images" src='+contentVar.div[0].span.span.a.href+' />';
          }
          else
            content = text;
        }
      }
            
        }

    }else if(contentVar.hasOwnProperty('span')) {
        var content = contentVar.span.span.content;

    }else{
        var content = "Error Fetching content. Click to view full story";
    }
    if(content != undefined && content != "undefined") 
          return replaceAll('&#39;', '\'', replaceAll('See more photos after the cut...', '', replaceAll('\n', '', content)));
    else
      return "Error Fetching Story";
}

