
$(document).ready(function () {


  $("#form-search ").submit(function (e) {
    
    e.preventDefault();
    $(".content").empty();
    form_search = $("#input-search").val();
    var url = 'http://localhost:8983/solr/IT4853/select?hl.fl=content&hl=on&q=content:"' + form_search + '"&wt=json&json.wrf=callback'; 

    $.ajax({
      url: url,
      crossDomain: true,
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {
      console.log(data)
      hightlight = data.highlighting ;
      // console.log(hightlight)

      $.each(data.response.docs, function (a,v) {
        // console.log(v);
        id = v.id
        content = v.content[0].substr(0,120) + "..." ;
        if(hightlight[id].content[0] != "") {
          content += hightlight[id].content[0] + "..." ;
        }
        // content += "..." + v.content[0].substr(-60) ;
        var html = '<a target=_blank href="' + v.url[0] + '"><div><span>' + v.title[0] + '</span></a><p>' + content + '</p></div>';
        
        html = html.replace(/<em>/g,"<b>");
        html = html.replace(/<\/em>/g,"</b>");
        $(".content").append(html);
      });
    });

  });


});