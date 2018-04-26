
$(document).ready(function () {

  var listContent = {} ;
  $(".fulltext").hide();
  $("#form-search ").submit(function (e) {

    e.preventDefault();
    
    $(".content").empty();
    $(".fulltext").hide();
    listContent = {} ;
    
    form_search = $("#input-search").val();
    var url = 'http://localhost:8983/solr/IT4853/select?hl.fl=content&hl=on&rows=1000&start=0&q=content:"' + form_search + '"&wt=json&json.wrf=callback'; 
    
    $.ajax({
      url: url,
      crossDomain: true,
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {
      console.log(data) ;
      hightlight = data.highlighting ;
      
      // console.log(hightlight)
      numdocs = data.response.docs.length ;
      numdocs = "Khoảng " + numdocs + " kết quả." ;
      $("#numdocs").html(numdocs) ;
      $.each(data.response.docs, function (a,v) {
        // console.log(v);
        id = v.id
        content = v.content[0].substr(0,130) + "..." ;
        if(hightlight[id].content[0] != "") {
          content += hightlight[id].content[0] + "..." ;
        }
        idStr = id.replace(".", "_") ;
        listContent[idStr] = v.content[0] ;
        
        sort_url = v.url[0] ;
        if(sort_url.length >70)
        sort_url = sort_url.substr(0,69) + "..." ;
        // content += "..." + v.content[0].substr(-60) ;
        var html = '<div><a target="_blank" href="' + v.url[0] + ' "><span class="doc-title">' 
                    + v.title[0] + ' </span></a> <a href=#"'+idStr+'"><span class="readmore" id="'
                    + idStr+ '"> Xem Trước </span></a><p><span class="target-url">' 
                    + sort_url + '</span><br>' + content + '</p><hr></div>';
        
        $(".content").append(html);
      });
      
      $(".readmore").click(function (e) {
        id_click = e.target.id ;
        fulltext = listContent[id_click].substr(0,1000) + "..." ;
    
        margintext = $("#" + id_click).offset().top - $(".result").offset().top - $(".result").scrollTop();
        
        $(".fulltext").show();
        $(".fulltext").css("margin-top", margintext) ;
        $(".fulltext").html(fulltext) ;

      });
    });
    console.log(listContent);

  });


});