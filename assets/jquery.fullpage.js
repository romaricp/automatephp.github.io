$(document).ready(function() {
    if($(".home:not(.documentation)").length) {
        $(".btnDiscover").on("click", function(e){
          $("html, body").animate({scrollTop: ($(window).scrollTop() + 2)});
        });

        $('a[href^="#"]').click(function(){
            var the_id = $(this).attr("href");
            if (the_id === '#') {
                return;
            }
            $('html, body').animate({
                scrollTop:$(the_id).offset().top
            }, 'slow');

            return false;
        });
    }
});
