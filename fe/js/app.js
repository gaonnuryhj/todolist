(function(window) {
    'use strict';

loadList(0);

///////할 일 등록
$(".new-todo").keypress(function(event){
  if(event.keyCode == 13){
    var todo=$('.new-todo').val();
    if(!todo){
      alert("할일을 입력해주세요");
    }
    else{
      $.ajax({
          url: "/api/todos",
          type: "POST",
          dataType:'json',
          data: JSON.stringify({'todo':todo}),
          contentType: "application/json; charset=UTF-8",
          success:function(result){
            var now_filter=$('.filters > li > a.selected').attr('id');
            var filter_id;
            if(now_filter=="All" ){
              filter_id=0;
            }
            else if (now_filter=="Active") {
              filter_id=2;
            }
            else if (now_filter=="Completed") {
              filter_id=1;
            }
          //  $('.All').attr('class','selected');

          //  $('.todo-list').prepend('<li id="'+result.id+'">'+'<div class="view">'+'<input class="toggle" type="checkbox">'+'<label>'+todo+'</label>'+'<button class="destroy"></button>'+'</div>'+'</li>');
            loadList(filter_id);
          },
          error : function(request, status, error ) {
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
          },
      });
      $('.new-todo').val("");
    }
  }
});


//////할일 완료 체크

$('.todo-list').on("click", ".toggle", function(){
//  alert("test");
  var id=$(this).closest('li').attr('id');
  var now_filter=$('.filters > li > a.selected').attr('id');
  var filter_id;
  var check=$(this).prop("checked");
  if(now_filter=="All" ){
    filter_id=0;
  }
  else if (now_filter=="Active") {
    filter_id=2;
  }
  else if (now_filter=="Completed") {
    filter_id=1;
  }
    if(check){
      $.ajax({
          url:'./api/todos/'+id,
          type:'PUT',
          contentType: "application/json; charset=UTF-8",
          data:JSON.stringify({"completed":1}),
          dataType:'json',
          success : function(result){
            $(this).closest('li').addClass("completed");
            loadList(filter_id);
          }
        });
    }

    //체크했던 거 취소하기
    else{
      $.ajax({
          url:'./api/todos/'+id,
          type:'PUT',
          contentType: "application/json; charset=UTF-8",
          data:JSON.stringify({"completed":0}),
          dataType:'json',
          success : function(result){
            $(this).closest('li').removeClass("completed");
            loadList(filter_id);
          }
        });
    }

   });

///////삭제하기

$('.todo-list').on("click", ".destroy", function(){
      var id=$(this).closest('li').attr('id');
      var now_filter=$('.filters > li > a.selected').attr('id');
      var filter_id;
      if(now_filter=="All" ){
        filter_id=0;
      }
      else if (now_filter=="Active") {
        filter_id=2;
      }
      else if (now_filter=="Completed") {
        filter_id=1;
      }
      $.ajax({
        url:'./api/todos/'+id,
        type:'DELETE',
        contentType: "application/json; charset=UTF-8",
        dataType:'json',
        success : function(result){
          $('.filters > li > a.selected').removeClass();
          $('#All').attr('class', 'selected');
          loadList(0);
        }
      });

    });


////////////claer completed

$('.clear-completed').on("click", function(){
  $('.todo-list li').filter(function(index){
      $.ajax({
                 url:'./api/todos/completed',
                 type:'DELETE',
                 contentType: "application/json; charset=UTF-8",
                 dataType:'json',
                 success : function(result){
                   loadList(0);
                 }
               });
                 $(this).remove();


    });
    });





 ////////filter 적용
$("#All").on('click', function() {
    $('.filters > li > a.selected').removeClass();
    $('#All').attr('class', 'selected');
    loadList(0);
  });
$("#Active").on('click', function() {
    $('.filters > li > a.selected').removeClass();
    $('#Active').attr('class', 'selected');

    loadList(2);
  });
$("#Completed").on('click', function() {
    $('.filters > li > a.selected').removeClass();
    $('#Completed').attr('class', 'selected');
    loadList(1);
  });





  })(window);

  function loadList(filter) {
      $(document).ready(function() {
          $.ajax({
              url: '/api/todos',
              type: 'GET',
              dataType: 'json',
              success: function(result) {
                  $(".todo-list").empty();
                  var list = [];
                  var cnt=0;
                  $.each(result, function(i) {
                      var check = '';
                      var complete_check = '';

                      if(filter==0){
                        cnt++;
                      if (result[i].completed == 1) {
                          check = 'checked="checked"';
                          complete_check = 'class = completed';
                      }

                      list.push("<li " + complete_check + " id=" + result[i].id + ">" + "<div class='view'><input class='toggle' type='checkbox'" + check + ">\
                                 <label>" + result[i].todo + "</label><button class='destroy'></button></div></li>");
                        $('.todo-count > strong').text(cnt);
                      }
                      else if(filter==1){

                      if (result[i].completed == 1) {
                          cnt++;
                          check = 'checked="checked"';
                          complete_check = 'class = completed';

                         list.push("<li " + complete_check + " id=" + result[i].id + ">" + "<div class='view'><input class='toggle' type='checkbox'" + check + ">\
                                  <label>" + result[i].todo + "</label><button class='destroy'></button></div></li>");
                      }
                      $('.todo-count > strong').text(cnt);
                      }

                      else if(filter==2){

                      if (result[i].completed == 0) {
                          cnt++;
                         list.push("<li  id=" + result[i].id + ">" + "<div class='view'><input class='toggle' type='checkbox'>\
                                  <label>" + result[i].todo + "</label><button class='destroy'></button></div></li>");
                      }
                        $('.todo-count > strong').text(cnt);
                      }



                  });
                  //반대로 출력하기 ( 최신것을 제일 위로!)
                  for (var i = result.length; i >0; i--) {
                    $('.todo-list').append(list[i]);
                }

              }
          }).error(function(request, status, error) {
            alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

          });
      });
  }
