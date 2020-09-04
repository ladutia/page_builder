var pageBuilderPreview = {
    init: function (is_move_style_to_body) {
        pageBuilderPreview.bgVideoYT();
        pageBuilderPreview.sliderInit();
        pageBuilderPreview.initialize_forms();
        pageBuilderPreview.toggleMenuMobile();
        pageBuilderPreview.initModal();

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
                $(this).addClass('.swiper-container-horizontal--init');
                sliders.push(new Swiper($(this), optHorizontal));
                $(this).find('.swiper-pagination').children().each(function (index) {
                    $(this).attr('style', window['sliderHorizantalBulletsStyle_'+_index]);
                });
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
                $(this).addClass('.swiper-container-vertical--init');
                sliders.push(new Swiper($(this), optVertical));
                $(this).find('.swiper-pagination').children().each(function (index) {
                    $(this).attr('style', window['sliderVerticalBulletsStyle_'+_index]);
                });
            });
        }
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
    initModal: function (){
        $('body').on('click', '.ll-lp-modal__btn-close', function(){
            $(this).parents('.ll-lp-modal__fade').hide();
        });
        $('body').on('click', 'a[modal-id]', function(e){
            e.preventDefault();
            var id = $(this).attr("modal-id");
            $('#ll-lp-modal-' + id).show();
        });
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
    });
});