$( document ).ready(function() {
  var move = 0;
  window.setInterval(function () {
    move ++
   $(".images").fadeOut('fast', function(){
      if (move == 3) {
        $("#img_index_center0"+move).addClass('hide')
        $("#img_index_center01").removeClass('hide')
        $(".index-ff").removeClass("bg0"+move).addClass("bg01");
        move = 0;
      }else{
        $("#img_index_center0"+move).addClass('hide')
        $("#img_index_center0"+(move+1)).removeClass('hide')
        $(".index-ff").removeClass("bg0"+move).addClass("bg0"+(move+1));
        
      }
      $(this).fadeIn('slow');
    });
    
  },5000);
});