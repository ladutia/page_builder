var pageBuilderPreview = {
    init: function (is_move_style_to_body) {
        pageBuilderPreview.bgVideoYT();
        pageBuilderPreview.sliderInit();
        pageBuilderPreview.initialize_forms();
        pageBuilderPreview.toggleMenuMobile();
        pageBuilderPreview.initModal();
        pageBuilderPreview.initPointPopup();

        if (is_move_style_to_body) {
            $html = $('body');
            var $templateDiv = $html.find('#pb-template');
            var style = $templateDiv.attr('style');
            var id = $templateDiv.attr('id');
            $html.attr('id', id).attr('style', style);
            $templateDiv.removeAttr('style').removeAttr('id');
        }
    },
    toggleMenuMobile: function () {
        $('body').on('click', '.pb-widget--mobile-toggle', function () {
            var $togggleMenu = $(this);
            var $menu = $togggleMenu.parent().find('.pb-header-items');

            $togggleMenu.toggleClass('open');

            if ($togggleMenu.hasClass('open')) {
                $menu.slideDown(); // or .show();
            } else {
                $menu.slideUp(); // or .hide();
            }
        });
    },
    initModal: function (){
        $('body').on('click', '.ll-lp-modal__btn-close', function(){
            var $modal = $(this).parents('.ll-lp-modal__fade');
            $modal.hide();
            /*if($modal.find('.ll-lp-modal > iframe').hasClass('popup_loading')){
                $modal.find('.ll-lp-modal > iframe').attr('src', '');
            }*/
        });
        $('body').on('click', 'a[modal-id]', function(e){
            e.preventDefault();
            var id = $(this).attr("modal-id");
            var $modal = $('#ll-lp-modal-' + id);

            if($modal.find('.ll-lp-modal > iframe').hasClass('popup_loading')){
                var src = null;
                if($modal.find('.ll-lp-modal > iframe').length > 0){
                    if($modal.attr('iframe-src')){
                        src = $modal.attr('iframe-src');
                    } else {
                        $modal.attr('iframe-src', $modal.find('.ll-lp-modal > iframe').attr('src'));
                    }
                }
                $modal.show().find('.ll-lp-modal > iframe').attr('src', src);
            } else {
                $modal.show();
            }
        });
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
                    console.log('here is vimeo');
                    var id = $el.attr('data-bgvideoyt');
                    console.log(id);
                    var dataProperty = "{videoURL: '" + id + "', containment: 'self', showControls: false, autoPlay: true, mute: true, startAt: 20, opacity: 1, stopMovieOnBlur: false}";
                    console.log(dataProperty);
                    var videoHTML = '<div class="pb-bg-video" data-property="' + dataProperty + '"></div>';
                    console.log(videoHTML);
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
            $sliderHorizantal.each(function (_index) {
                window['sliderHorizantalBulletsStyle_'+_index] = '';
                $(this).find('.swiper-pagination .swiper-pagination-bullet').each(function (i) {
                    window['sliderHorizantalBulletsStyle_'+_index] = $(this).parent().find('.swiper-pagination-bullet').eq(i).attr('style');
                    return false;
                });
                $(this).find('.swiper-pagination').removeClass('swiper-pagination-bullets');
                $(this).find('.swiper-pagination').html('');
                $(this).addClass('swiper-container-horizontal--init');
                sliders.push(new Swiper($(this), optHorizontal));
                $(this).find('.swiper-pagination').children().each(function (index) {
                    $(this).attr('style', window['sliderHorizantalBulletsStyle_'+_index]);
                });
                pageBuilderPreview.sliderResize();
            });
        }

        $sliderVertical = $('.swiper-container-vertical:not(.swiper-container-vertical--init)');
        if ($sliderVertical.length) {
            $sliderVertical.each(function (_index) {
                window['sliderVerticalBulletsStyle_'+_index] = [];
                $(this).find('.swiper-pagination .swiper-pagination-bullet').each(function (i) {
                    window['sliderVerticalBulletsStyle_'+_index] = $(this).parent().find('.swiper-pagination-bullet').eq(i).attr('style');
                    return false;
                });
                $(this).addClass('swiper-container-vertical--init');
                sliders.push(new Swiper($(this), optVertical));
                $(this).find('.swiper-pagination').children().each(function (index) {
                    $(this).attr('style', window['sliderVerticalBulletsStyle_'+_index]);
                });
                pageBuilderPreview.sliderResize();
            });
        }
    },
    sliderResize: function(){
        $('.pb-widget--slideshow').each(function(){
            var $slider = $(this);
            var heightDesktop = $slider.attr('heightdesktop') || $slider.height();
            var heightTablet = $slider.attr('heighttablet') || heightDesktop;
            var heightMobile = $slider.attr('heightmobile') || heightDesktop;

            if(window.matchMedia('(max-width: 767px)').matches){
                $slider.css('height', heightMobile);
                $slider.find('.pb-widget__content').css('height', heightMobile);
            } else if (window.matchMedia('(max-width: 991px)').matches){
                $slider.css('height', heightTablet + 'px');
                $slider.find('.pb-widget__content').css('height', heightTablet + 'px');
            } else{
                $slider.css('height', heightDesktop);
                $slider.find('.pb-widget__content').css('height', heightDesktop + 'px');
            }
        });
    },
    initialize_forms: function (){
        $('.ll-lp-form .ll-lp-form-btn-submit').bind ('click', function (){
            var container_form = $(this).parents ('.ll-lp-form');
            if (container_form.length > 0) {
                container_form = container_form[0];
                return pageBuilderPreview.submit_form($(this), container_form)
            }
        })
    },
    submit_form: function (btn_submit, container_form){
        var _form_id = $(container_form).attr ('data-identifier');
        var _success_message = $(container_form).attr ('data-success-message');
        var _success_redirect = $(container_form).attr ('data-redirect-url');
        var _form_id = $(container_form).attr ('data-identifier');
        //var _form_name = $(container_form).attr ('name');
        var _fullname = $(container_form).find ('.ll-lp-form-name-field').val ();
        var _email = $(container_form).find ('.ll-lp-form-email-field').val ();

        _email = !ll_is_empty(_email) ? _email : '';
        _fullname = !ll_is_empty(_fullname) ? _fullname : '';

        if(_fullname != '' || _email != ''){
            var _data_to_submit = {};
            /**
             * Form elements submitted info
             */
            _data_to_submit.action = 'lp_form_submission';
            _data_to_submit.form_name = _form_id;
            _data_to_submit.landing_page_id = landing_page_id;
            _data_to_submit.landing_page_draft_id = landing_page_draft_id;
            _data_to_submit.email = _email;
            _data_to_submit.fullname = _fullname;
            _data_to_submit.ll_is_anonymize_ip = ll_is_anonymize_ip;

            if(!ll_is_empty(_ll_hit_data)){
                _data_to_submit = _ll_track_form_submission.append_tracking_data(_data_to_submit);
            } else {
                _data_to_submit.ll_trk_no_ck = ll_dialog_manager.ll_trk_no_ck;
            }
            /**
             * Send the submitted data to LL side.
             */
            /*
             _ll_track_form_submission.process_call(AUTOMATIC_WEB_FORM_TRACKING_URL, _data_to_submit, function(){
             _ll_track_form_submission.callback_after_form_submitted(_form, _form_index);
             });
             */

            _ll_track_form_submission.ll_jQuery.getJSON( AUTOMATIC_WEB_FORM_TRACKING_URL + '?callback=?', _data_to_submit).done(function( _response_data ) {
                //console.log(_response_data);
                //console.log(_success_message);
                if(!ll_is_empty(_response_data)){
                    if(!ll_is_empty(_response_data.success)){
                        if (typeof _success_message != 'undefined' && _success_message && _success_message != '') {
                            ll_show_success_message(_success_message);
                        } else if (typeof _success_redirect != 'undefined' && _success_redirect && _success_redirect != '') {
                            window.location.href = _success_redirect;
                        } else {
                            ll_show_success_message('Success');
                        }
                        //console.log (_response_data);
                    } else {
                        ll_show_error_message(_response_data.message);
                    }
                } else {
                    ll_show_error_message("Unknown error");
                }
            });
        } else {
            //ll_show_error_message("Please enter your name or email");
        }
        return false;
    },
    initPointPopup: function(){
        $('body').on('click', '.ll-lp-point-image', function(e){
            e.preventDefault();
            e.stopPropagation();

            if($(this).hasClass('ll-lp-point-image--selected')){
                return false;
            }

            $('.ll-lp-point-image--selected').removeClass('ll-lp-point-image--selected');
            $('.ll-lp-popup-point:visible').hide();

            var idx = $(this).attr('data-idx-popup');
            var $popup = $('.ll-lp-popup-point[data-idx='+ idx +']');

            $popup.show();
            $(this).addClass('ll-lp-point-image--selected');
            pageBuilderPreview.positionPopupPoint($(this), $popup);
        });
        $('body').on('click', '.ll-lp-popup-point__close', function(e){
            e.preventDefault();
            e.stopPropagation();
            $('.ll-lp-point-image--selected').removeClass('ll-lp-point-image--selected');
            $(this).closest('.ll-lp-popup-point').hide();
        });
    },
    positionPopupPoint: function($point, $popup){
        var margin = 20;
        var widthPoint = 30;
        var $box= $('.pb-blocks');
        var heightPopup = $popup.height();
        var widthPopup = $popup.width();
        var heightBox = $box.height();
        var widthBox = $box.width();
        var offsetRight = $point.offset().left + widthPoint + margin;
        var offsetLeft = $point.offset().left - margin;
        var offsetTop = $point.offset().top;
        var offsetBottom = heightBox - offsetTop - widthPoint/2;
        var position = 'right';
        var heightContentPopup2 = $popup.find('.ll-lp-popup-point__content').outerHeight() / 2;

        if(widthBox - offsetRight > widthPopup){
            position = 'right';
            $popup.css({
                left: offsetRight + "px",
                right: 'auto',
                marginLeft: 0,
            }).attr('data-position', position);
        } else if(offsetLeft > widthPopup){
            position = 'left';
            $popup.css({
                left: offsetLeft - widthPopup + "px",
                right: 'auto',
                marginLeft: 0
            }).attr('data-position', position);
        } else{
            position = 'center';
            $popup.css({
                left: "50%",
                marginLeft: -widthPopup/2 + 'px',
                right: 'auto'
            }).attr('data-position', position);
        }

        
        var offsetY = heightContentPopup2;
        var cssTop = 0;

        if(offsetY > 50){
            if(offsetY > offsetBottom) offsetY = offsetBottom - margin;
            var cssTop = offsetTop - heightPopup + offsetY + widthPoint/2;
        } else{
            offsetY = heightPopup/2;
            if(offsetY > offsetBottom) offsetY = offsetBottom - margin;
            cssTop = offsetTop - offsetY + widthPoint/2;
        }

        if(cssTop <= 0) cssTop = 20;

        $popup.css({
            top: cssTop + 'px'
        });
        $popup.find('.ll-lp-popup-point__arrows').css({
            top: offsetTop - cssTop + 'px'
        });
    },
    resizePointPopup: function(){
        var $point = $('.ll-lp-point-image--selected');
        var $popup = $('.ll-lp-popup-point:visible');

        if($point && $point.length && $popup && $popup.length){
            $popup.css({
                left: 'auto',
                marginLeft: 0,
                right: 'auto'
            });
            pageBuilderPreview.positionPopupPoint($point, $popup);
        }
    }
}
$(function () {
    var is_move_style_to_body = true;
    if(typeof is_ll_builder_preview != 'undefined' && is_ll_builder_preview) {
        is_move_style_to_body = false;
    }
    pageBuilderPreview.init(is_move_style_to_body);
    $(window).resize(function () {
        pageBuilderPreview.bgVideoYT();
        pageBuilderPreview.sliderInit();
        pageBuilderPreview.sliderResize();
        pageBuilderPreview.resizePointPopup();
    });
});