(function(window) {
    'use strict';

    loadList();


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
            //var cnt=$('.todo-count > strong').val()
            $('.All').attr('class','selected');
            $('.todo-list').prepend('<li id="'+result.id+'">'+'<div class="view">'+'<input class="toggle" type="checkbox">'+'<label>'+todo+'</label>'+'<button class="destroy"></button>'+'</div>'+'</li>');
          //  $('.todo-count > strong').text(cnt+1);
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
 $(".todo-list").on('click', '.toggle', function() {
   


 });


  })(window);



function loadList() {
    $(document).ready(function() {
        $.ajax({
            url: '/api/todos',
            type: 'GET',
            dataType: 'json',
            success: function(result) {
                $(".todo-list").empty();
                var list = [];
                // console.log(result);
                $.each(result, function(i) {
                    var check = '';
                    var complete_check = '';
                    // console.log(i);
                    // console.log(result[i].id);
                    if (result[i].completed == 1) {
                        check = 'checked="checked"';
                        complete_check = 'class = completed';
                    }

                    list.push("<li " + complete_check + " id=" + result[i].id + ">" + "<div class='view'><input class='toggle' type='checkbox'" + check + ">\
                               <label>" + result[i].todo + "</label><button class='destroy'></button></div></li>");

                });
              //  itemLeftCount();
               $('.todo-list').html(list);

            }
        }).error(function(request, status, error) {
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

        });
    });
}
