
$(document).ready(function () {
  var NUM_DOCS_PER_PAGE = 10 ;
  var SUB_DOCS_LENGTH = 333 ;
  var FULL_TEXT_LENGTH = 1111 ;

  $(".fulltext").hide();

  $("#form-search").submit(function (e) {

    e.preventDefault();
    sendRequest(0,NUM_DOCS_PER_PAGE) ;

  });

  $(".home").click(function(e) {
    $(".content").empty();
    $(".pagination").empty();
    $(".fulltext").hide();
    $("#input-search").val("");
    $("#numdocs").html("");
  })


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
      var qTime = data.responseHeader.QTime ;
      $("#numdocs").html('Khoảng ' + numdocs + ' kết quả. ('+qTime/1000+' giây)') ;

      // show pagination
      var strPagination = '<li class="pagili" id="prev_' + (currentPage - 1) +'"> <a href="#1" aria-label="Previous" ><span aria-hidden="true">&laquo;</span></a ></li>' ;
      var pagiSize = Math.floor(numdocs/10) ;
      var startPage =0;
      var endPage = pagiSize;
      
      if(pagiSize - currentPage > 9 && currentPage >4) {
        startPage = currentPage - 4
        endPage = currentPage +5 ;
      }
      
      if(currentPage <5 && pagiSize >9 ) {
        endPage = 9 ;
      }
      for(i=startPage; i<=endPage; i++) {
        strPage = String(i+1) ;
        strPagination += '<li class="pagili" id="page_'+ i +'"><a href="#">'+ strPage +'</a></li>' ;
      }

      strPagination += '<li class="pagili" id="next_'+(currentPage+1)+'"><a href="#1" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li>' ;
      $(".pagination").append(strPagination) ;
      $("#page_"+currentPage).addClass("active") ;
      // console.log(currentPage, pagiSize) ;
      if(currentPage == 0) {
        $("#prev_-1").addClass("disabled") ;
        $("#prev_-1").removeClass("pagili") ;
      }

      if(currentPage == pagiSize) {
        $("#next_" +(pagiSize+1)).addClass("disabled");
        $("#next_"+(pagiSize+1)).removeClass("pagili");
      }

      // show searched docs
      var docData = data.response.docs ;

      if(docData.length <numRows) {
        numRows = docData.length ;
      }

      
      for(i=0; i< numRows; i++) {
        doc = docData[i] ;
        id = doc.id ;
        
        // index of hightlight in content
        var index_hlight = doc.content[0].indexOf(hightlight[id].content[0].substr(0, 15)) ;
        // console.log("index:" + index_hlight) ;
        
        // evalue subContent to show view.
        var subContent ;
        if(index_hlight> SUB_DOCS_LENGTH -100 ) {
          subContent = doc.content[0].substr(0, SUB_DOCS_LENGTH -100) + "..." + hightlight[id].content[0] + "...";
        }
        else {
          var str1 = doc.content[0].substr(0, index_hlight) + hightlight[id].content[0] ;
          subContent = str1 + doc.content[0].substr(str1.length, SUB_DOCS_LENGTH- str1.length ) + "..." ;
        }
        
        idStr = id.replace(".", "_");
        listContent[idStr] = doc.content[0];
        sort_url = doc.url[0];
        if (sort_url.length > 70)
          sort_url = sort_url.substr(0, 69) + "...";
        var html = '<div><a target="_blank" href="' + doc.url[0] + ' "><span class="doc-title">'
                    + doc.title[0] + ' </span></a> <a href=#1><span class="readmore" id="'
                    + idStr + '"> Xem Trước </span></a><p><span class="target-url">'
                    + sort_url + '</span><br>' + subContent + '</p><hr></div>';

        $(".content").append(html);

      }
      
      // show read more
      $(".readmore").click(function (e) {
        id_click = e.target.id ;
        fulltext = listContent[id_click].substr(0,FULL_TEXT_LENGTH) + "..." ;
    
        margintext = $("#" + id_click).offset().top - $(".result").offset().top - $(".result").scrollTop();
        
        $(".fulltext").show();
        $(".fulltext").css("margin-top", margintext) ;
        $(".fulltext").html(fulltext) ;

      });

      $(".pagili").click(function(e) {
        var id = $(this).attr('id');
        id = parseInt(id.substr(5)) ;
        sendRequest(id*10, 10);
        
      }) ;
    });
    // console.log(listContent);
    
  }


});