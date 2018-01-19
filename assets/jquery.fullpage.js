$(document).ready(function() {
    if($(".home:not(.documentation)").length) {
        var section = $('.section1');
        var lastScrollTop = 0;
        var animating = false;
        var height2 = $(window).height() * 2;

        $(".btnDiscover").on("click", function(e){
            e.preventDefault();
            if(!animating) {
                animating = true;
                $("html, body").animate({
                    scrollTop: ($(".container_advantages").offset().top - $(window).height()),
                    easing: 'linear'
                }, 1000, function() {
                    setTimeout(function(){ animating = false; }, 500);
                    var st = st = $(document).scrollTop();
                    lastScrollTop = st;
                });
                section = section.next();
            }
        });

        $(".btnFeatures").on("click", function(e){
            e.preventDefault();
            scrollable = false;
            if(!animating) {
                animating = true;
                $("html, body").animate({
                    scrollTop: $(".container_advantages").offset().top,
                    easing: 'linear'
                }, 700, function() {
                    scrollable = true;
                    setTimeout(function(){ animating = false; }, 700);
                    var st = st = $(document).scrollTop();
                    lastScrollTop = st;
                });
                section = section.next();
            }
        });

        $(window).scroll(function(event) {
            if($('html').is(':animated') || $('body').is(':animated')) {
                return false;
            }

            var st = $(this).scrollTop();

            if (st > lastScrollTop){
                // downscroll code
                if(!animating) {
                    section = section.next();
                    animating = true;
                    if(st > height2) {
                        animating = false;
                        section = section.prev();
                    } else {
                        console.log("bottom");
                        if (section.length) {
                            $("html, body").animate({
                                scrollTop: section.offset().top,
                                easing: 'default'
                            }, 700, function() {
                                setTimeout(function(){ animating = false; }, 400);
                            });
                        }
                    }
                }
            } else {
                // upscroll code
                if(!animating) {
                    section = section.prev();
                    animating = true;
                    if(st > height2) {
                        animating = false;
                        section = section.next();
                    } else {
                        console.log("top");
                        if (section.length) {
                            $("html, body").animate({
                                scrollTop: section.offset().top,
                                easing: 'default'
                            }, 700, function() {
                                setTimeout(function(){ animating = false; }, 400);
                            });
                        }
                    }
                }
            }

            st = $(document).scrollTop();
            lastScrollTop = section.offset().top;
        });
    }
});