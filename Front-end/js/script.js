
$(document).ready(function () {

  var listContent = {} ;
  $(".fulltext").hide();

  $("#form-search").submit(function (e) {

    e.preventDefault();
    sendRequest(0,10) ;

  });



  function sendRequest (startRow, numRows) {
    var currentPage = Math.floor(startRow/numRows) ;
    $(".content").empty();
    $(".pagination").empty() ;
    $(".fulltext").hide();
    var listContent = {} ;
    
    var form_search = $("#input-search").val();
    var url = 'http://localhost:8983/solr/IT4853/select?hl.fl=content&hl=on'
              + '&rows='  + numRows 
              + '&start=' + startRow 
              + '&q=content:"' + form_search 
              + '"&wt=json&json.wrf=callback'; 
    
    $.ajax({
      url: url,
      crossDomain: true,
      dataType: 'jsonp',
      jsonpCallback: 'callback'
    }).done(function (data) {
      var i;
      console.log(data) ;
      var hightlight = data.highlighting ;
      
      // show number result
      var numdocs = data.response.numFound ;
      var strNumdocs = "Khoảng " + numdocs + " kết quả." ;
      $("#numdocs").html(strNumdocs) ;

      // show pagination
      var strPagination = '<li> <a href="#" aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a ></li>' ;
      var pagiSize = Math.floor(numdocs/10) ;
      if(pagiSize - currentPage > 9) {
        pagiSize = currentPage +9 ;
      }
      for(i=currentPage; i<=pagiSize; i++) {
        strPage = String(i+1) ;
        strPagination += '<li class="pagili" id="page_'+ i +'"><a href="#">'+ strPage +'</a></li>' ;
      }

      strPagination += '<li><a href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>' ;
      $(".pagination").append(strPagination) ;
      $("#page_"+currentPage).addClass("active") ;

      // show data
      var docData = data.response.docs ;

      if(docData.length <numRows) {
        numRows = docData.length ;
      }

      
      for(i=0; i< numRows; i++) {
        doc = docData[i] ;
        id = doc.id ;
        content = doc.content[0].substr(0, 130) + "...";
        if (hightlight[id].content[0] != "") {
          content += hightlight[id].content[0] + "...";
        }
        idStr = id.replace(".", "_");
        listContent[idStr] = doc.content[0];
        sort_url = doc.url[0];
        if (sort_url.length > 70)
          sort_url = sort_url.substr(0, 69) + "...";
        // content += "..." + docs.content[0].substr(-60) ;
        var html = '<div><a target="_blank" href="' + doc.url[0] + ' "><span class="doc-title">'
          + doc.title[0] + ' </span></a> <a href=#"' + idStr + '"><span class="readmore" id="'
          + idStr + '"> Xem Trước </span></a><p><span class="target-url">'
          + sort_url + '</span><br>' + content + '</p><hr></div>';

        $(".content").append(html);

      }
      
      // show read more
      $(".readmore").click(function (e) {
        id_click = e.target.id ;
        fulltext = listContent[id_click].substr(0,1000) + "..." ;
    
        margintext = $("#" + id_click).offset().top - $(".result").offset().top - $(".result").scrollTop();
        
        $(".fulltext").show();
        $(".fulltext").css("margin-top", margintext) ;
        $(".fulltext").html(fulltext) ;

      });
    });
    // console.log(listContent);
    
  }


});