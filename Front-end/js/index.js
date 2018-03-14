
$(document).ready(function () {
  $("#random").on("click", function () {
    window.open("https://en.wikipedia.org/wiki/Special:Random");
  });
  $("#btn-search").on("click", function () {
    form_search = $("#form-search").val();
    $(".content").empty();
    $.ajax({
      url: 'http://localhost:8983/solr/IT4853/select?df=content&q=' + form_search
    }).done(function (data) {
      console.log(data)
      $.each(data.response.docs, function (a, v) {
        console.log(v.url[0]);
        var html = '<a target=_blank href="' + v.url[0] + '"><div><span>' + v.title[0] + '</span></a><p>' + v.content[0] + '</p></div>';
        $(".content").append(html);
      });
    });
  });
});