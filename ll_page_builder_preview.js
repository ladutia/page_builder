var pageBuilderPreview = {
    init: function () {
        pageBuilderPreview.bgVideoYT();
        pageBuilderPreview.sliderInit();
    },
    bgVideoYT: function ($html) {
        var $video = $('.pb-widget--bg-video-yt:not(.pb-bg-video-yt--init), .pb-widget--bg-video-vimeo:not(.pb-bg-video-vimeo--init)');

        if ($video.length) {
            $video.each(function () {
                var $el = $(this);

                if ($el.hasClass('pb-widget--bg-video-yt')) {
                    var id = $el.attr('data-bgvideoyt');
                    var dataProperty = "{videoURL: '" + id + "', containment: 'self', showControls: false, autoPlay: true, mute: true, startAt: 20, opacity: 1, stopMovieOnBlur: false}";
                    var videoHTML = '<div class="pb-bg-video" data-property="' + dataProperty + '"></div>';

                    if (id != '') {
                        $el.prepend(videoHTML);
                        $el.children('.pb-bg-video').YTPlayer();
                        $el.addClass('pb-bg-video-yt--init');
                    }
                } else {
                    var id = $el.attr('data-bgvideoyt');
                    var dataProperty = "{videoURL: '" + id + "', containment: 'self', showControls: false, autoPlay: true, mute: true, startAt: 20, opacity: 1, stopMovieOnBlur: false}";
                    var videoHTML = '<div class="pb-bg-video" data-property="' + dataProperty + '"></div>';

                    if (id != '') {
                        $el.prepend(videoHTML);
                        $el.children('.pb-bg-video').vimeo_player();
                        $el.addClass('pb-bg-video-vimeo--init');
                    }
                }
            });
        }
    },
    sliderInit: function () {
        var sliders = [];
        var $sliderVertical = null;
        var $sliderHorizantal = null;
        var optHorizontal = {
            spaceBetween: 0,
            slidesPerView: 1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            pagination: ".swiper-pagination",
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev"
        };
        var optVertical = {
            direction: 'vertical',
            spaceBetween: 0,
            slidesPerView: 1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            pagination: ".swiper-pagination",
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev"
        };

        $sliderHorizantal = $('.swiper-container-horizontal:not(.swiper-container-horizontal--init)');

        if ($sliderHorizantal.length) {
            $sliderHorizantal.each(function () {
                $(this).addClass('.swiper-container-horizontal--init');
                sliders.push(new Swiper($(this), optHorizontal));
            });
        }

        $sliderVertical = $('.swiper-container-vertical:not(.swiper-container-vertical--init)');

        if ($sliderVertical.length) {
            $sliderVertical.each(function () {
                $(this).addClass('.swiper-container-horizontal--init');
                sliders.push(new Swiper($(this), optVertical));
            });
        }
    }
}
$(function () {
    pageBuilderPreview.init();
    $(window).resize(function () {
        pageBuilderPreview.bgVideoYT();
        pageBuilderPreview.sliderInit();
    });
});