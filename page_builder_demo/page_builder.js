/**
 * Emad Atya - Dec 23rd 2018
 * https://github.com/ReactTraining/history/issues/42
 * Local Storage sometimes run out of storage or does not work in private browsing for Safari, so solution is to use the code below to store the local storage in memory.
 */
(function () {
    function isSupported() {
        var item = 'localStoragePollyfill';
        try {
            localStorage.setItem(item, item);
            localStorage.removeItem(item);
            return true;
        } catch (e) {
            return false;
        }
    }

    if (!isSupported()) {
        try {
            Storage.prototype._data = {};

            Storage.prototype.setItem = function (id, val) {
                return this._data[id] = String(val);
            };
            Storage.prototype.getItem = function (id) {
                return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
            },
                Storage.prototype.removeItem = function (id) {
                    return delete this._data[id];
                },
                Storage.prototype.clear = function () {
                    return this._data = {};
                }
        } catch (e) {
            console.error('localStorage pollyfill error: ', e);
        }
    }
}());
var pageBuilder = {

    sliderGridThree: null,
    sliderGridTwo: null,
    sliderGridUneven: null,
    sliderImgCaptionOneGrid: null,
    sliderTextColumnsWithImgGrid: null,
    sliderImgCaptionTwoGrid: null,
    sliderTwoTextColumnsGrid: null,
    sliderColumnsCaptionGrid: null,
    iframePreviewContent: null,
    current_custom_form_element: null,
    current_activation_element: null,
    default_calendar_timezone: '',
    current_hovering_variant_id: 0,

    maxVersionsHTML: 10,
    startCharCode: 65,
    endCharCode: 90,    //Z

    init: function () {
        pageBuilder.default_calendar_timezone = ll_combo_manager.get_selected_value('select#pb-calendarTimezone');
        $('body').on('keyup', function (e) {
            if (e.keyCode === 46) {
                pageBuilder.removeWidget($('.pb-widget--selected:not(.ui-widget-disabled)'));
            }
        });
        $('body').on('click', function(){
            $('.pb-widget__btn-settings.open').removeClass('open');
        });
        $('select.dropdownLibrary').show();
        ll_combo_manager.make_combo('select.dropdownLibrary');
        ll_combo_manager.make_combo('select:not([name="keywords"], .dropdownLibrary)');
        ll_combo_manager.make_combo('select[name="keywords"]', {
            is_auto_create_option: true,
            no_results_text: 'Press enter to add new keyword'
        });

        ll_combo_manager.event_on_change('select#btnLinkTo', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.btnLinkto = ll_combo_manager.get_selected_value('select#btnLinkTo');
            var url = opt.url;
            $('label.btn_text').text('Web Address (URL)');
            if (opt.btnLinkto == 'email') {
                url = 'mailto:' + opt.url;
                $('label.btn_text').text('Email Address');
                opt.btnView = "same";
                $('#button_view').hide();
            } else{
                $('#button_view').show();
            }

            ll_combo_manager.set_selected_value('select#btnView', opt.btnView);
            ll_combo_manager.trigger_event_on_change('select#btnView');

            $tpl.find('.pb-btn').attr('href', url);

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        ll_combo_manager.event_on_change('select#btnView', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var $btn = $tpl.find('.pb-btn');
            var $fieldUrl =  $('#button_url');
            var $settings = $('.pb-settings-panel:visible');

            opt.btnView = ll_combo_manager.get_selected_value('select#btnView');

            if(opt.btnView == "same"){
                $btn.attr('target', "_self");
                $fieldUrl.show();
                $settings.find('.pb-modal-settings').hide();
            }

            if(opt.btnView == "tab"){
                $btn.attr('target', "_blank");
                $fieldUrl.show();
                $settings.find('.pb-modal-settings').hide();
            }

            if(opt.btnView == "modal"){
                $btn.attr('target', "_self");
                $fieldUrl.hide();
                pageBuilder.initModalLinkTo($btn);
                $settings.find('.pb-modal-settings').show();
                ll_combo_manager.set_selected_value('#pb-panel__button select.pb-modal-content', opt.modalView);
                ll_combo_manager.trigger_event_on_change('#pb-panel__button select.pb-modal-content');

                opt.modalPosition = opt.modalPosition || 'middle';
                ll_combo_manager.set_selected_value('#pb-panel__button select.pb-modal-position', opt.modalPosition);
                ll_combo_manager.trigger_event_on_change('#pb-panel__button select.pb-modal-position');
                opt.modalWidth = opt.modalWidth || 500;
                opt.modalHeight = opt.modalHeight || 300;
                opt.modalBgOpacity = opt.modalBgOpacity || 50;
                $('#pb-panel__button .modalBgOpacity').val(opt.modalBgOpacity);
                $('#pb-panel__button .modalWidth').val(opt.modalWidth);
                $('#pb-panel__button .modalHeight').val(opt.modalHeight);
            } else{
                pageBuilder.destroyModalLinkTo($btn);
                pageBuilder.resetModalLinkTo($tpl, opt);
            }

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        ll_combo_manager.event_on_change('select#iconLinkTo', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.iconLinkto = ll_combo_manager.get_selected_value('select#iconLinkTo');
            var url = opt.url;
            $('label.icon_text').text('Web Address (URL)');

            if (opt.iconLinkto == 'email') {
                url = 'mailto:' + opt.url;
                $('label.icon_text').text('Email Address');
                opt.iconView = "same";
                $('#icon_view').hide();
                $("#icon_url").show();
            } else if(opt.iconLinkto == 'none'){
                opt.iconView = "same";
                $('#icon_view').hide();
                $("#icon_url").hide();
            } else{
                $('#icon_view').show();
                $("#icon_url").show();
            }

            ll_combo_manager.set_selected_value('select#iconView', opt.iconView);
            ll_combo_manager.trigger_event_on_change('select#iconView');

            pageBuilder.checkIsLinkTo($tpl, opt);

            $tpl.find('a').attr('href', url);

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        ll_combo_manager.event_on_change('select#iconView', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var $link = $tpl.find('a');
            var $fieldUrl =  $('#icon_url');
            var $settings = $('.pb-settings-panel:visible');

            opt.iconView = ll_combo_manager.get_selected_value('select#iconView');

            if(opt.iconView == "same"){
                $link.attr('target', "_self");
                $settings.find('.pb-modal-settings').hide();
                if(opt.iconLinkto !== "none") $fieldUrl.show();
            }

            if(opt.iconView == "tab"){
                $link.attr('target', "_blank");
                $settings.find('.pb-modal-settings').hide();
                if(opt.iconLinkto !== "none") $fieldUrl.show();
            }

            if(opt.iconView == "modal"){
                $link.attr('target', "_self");
                $fieldUrl.hide();
                pageBuilder.initModalLinkTo($link);
                $settings.find('.pb-modal-settings').show();
                ll_combo_manager.set_selected_value('#pb-panel__icon select.pb-modal-content', opt.modalView);
                ll_combo_manager.trigger_event_on_change('#pb-panel__icon select.pb-modal-content');

                opt.modalPosition = opt.modalPosition || 'middle';
                ll_combo_manager.set_selected_value('#pb-panel__icon select.pb-modal-position', opt.modalPosition);
                ll_combo_manager.trigger_event_on_change('#pb-panel__icon select.pb-modal-position');
                opt.modalWidth = opt.modalWidth || 500;
                opt.modalHeight = opt.modalHeight || 300;
                opt.modalBgOpacity = opt.modalBgOpacity || 50;
                $('#pb-panel__icon .modalBgOpacity').val(opt.modalBgOpacity);
                $('#pb-panel__icon .modalWidth').val(opt.modalWidth);
                $('#pb-panel__icon .modalHeight').val(opt.modalHeight);
            } else{
                pageBuilder.destroyModalLinkTo($link);
                pageBuilder.resetModalLinkTo($tpl, opt);
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        ll_combo_manager.event_on_change('select#imageLinkTo', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.imageLinkto = ll_combo_manager.get_selected_value('select#imageLinkTo');
            var url = opt.url;
            $('label.image_text').text('Web Address (URL)');

            if (opt.imageLinkto == 'email') {
                url = 'mailto:' + opt.url;
                $('label.image_text').text('Email Address');

                opt.imageView = "same";
                $('#image_view').hide();
                $("#image_url").show();
            } else if(opt.imageLinkto == 'none'){
                opt.imageView = "same";
                $('#image_view').hide();
                $("#image_url").hide();
            } else{
                $('#image_view').show();
                $("#image_url").show();
            }

            ll_combo_manager.set_selected_value('select#imageView', opt.imageView);
            ll_combo_manager.trigger_event_on_change('select#imageView');

            pageBuilder.checkIsLinkTo($tpl, opt);

            $tpl.find('a').attr('href', url);

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        ll_combo_manager.event_on_change('select#imageView', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var $link = $tpl.find('a');
            var $fieldUrl =  $('#image_url');
            var $settings = $('#pb-panel__image');

            opt.imageView = ll_combo_manager.get_selected_value('select#imageView');

            if(opt.imageView == "same"){
                $link.attr('target', "_self");
                $settings.find('.pb-modal-settings').hide();
                if(opt.imageLinkto !== "none") $fieldUrl.show();
            }

            if(opt.imageView == "tab"){
                $link.attr('target', "_blank");
                $settings.find('.pb-modal-settings').hide();
                if(opt.imageLinkto !== "none") $fieldUrl.show();
            }

            if(opt.imageView == "modal"){
                $link.attr('target', "_self");
                $fieldUrl.hide();
                pageBuilder.initModalLinkTo($link);
                $settings.find('.pb-modal-settings').show();
                ll_combo_manager.set_selected_value('#pb-panel__image select.pb-modal-content', opt.modalView);
                ll_combo_manager.trigger_event_on_change('#pb-panel__image select.pb-modal-content');

                opt.modalPosition = opt.modalPosition || 'middle';
                ll_combo_manager.set_selected_value('#pb-panel__image select.pb-modal-position', opt.modalPosition);
                ll_combo_manager.trigger_event_on_change('#pb-panel__image select.pb-modal-position');

                opt.modalWidth = opt.modalWidth || 500;
                opt.modalHeight = opt.modalHeight || 300;
                opt.modalBgOpacity = opt.modalBgOpacity || 50;
                $('#pb-panel__image .modalBgOpacity').val(opt.modalBgOpacity);
                $('#pb-panel__image .modalWidth').val(opt.modalWidth);
                $('#pb-panel__image .modalHeight').val(opt.modalHeight);
            } else{
                pageBuilder.destroyModalLinkTo($link);
                pageBuilder.resetModalLinkTo($tpl, opt);
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        pageBuilder.initEditor('.pb-modal-html');

        ll_combo_manager.event_on_change('select.pb-modal-content', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var $settings = $('.pb-settings-panel:visible');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');
            var idEditor = $settings.find('.pb-modal-html').attr('id');
            var editor = tinyMCE.get(idEditor);
            var content = '';

            opt.modalView = ll_combo_manager.get_selected_value('.pb-settings-panel:visible select.pb-modal-content');

            if(opt.modalView == "html"){
                content = pageBuilder.getContentModal();
                $settings.find('.pb-field-modal-iframe-url').hide();
                $settings.find('.pb-field-modal-iframe-loading').hide();
                $settings.find('.pb-field-modal-html').show();
                editor.setContent(content);
                pageBuilder.setContentModal(content);
            } else{
                editor.setContent('');
                pageBuilder.setContentModal('');
                $settings.find('.pb-field-modal-html').hide();
                $settings.find('.pb-field-modal-iframe-url').show().find('.pb-modal-iframe-url').val(opt.modalIFrameUrl);
                $settings.find('.pb-field-modal-iframe-loading').show();
                if(typeof opt.modalIFrameLoading == 'undefined'){
                    opt.modalIFrameLoading = 'popup';
                }
                ll_combo_manager.set_selected_value('.pb-settings-panel:visible .pb-field-modal-iframe-loading select', opt.modalIFrameLoading);
                ll_combo_manager.event_on_change('.pb-settings-panel:visible .pb-field-modal-iframe-loading select');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        ll_combo_manager.event_on_change('select.pb-modal-position', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');

            opt.modalPosition = ll_combo_manager.get_selected_value('.pb-settings-panel:visible select.pb-modal-position');
            pageBuilder.setModalPosition(id, opt.modalPosition);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('.modalBgOpacity').on('change', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');

            opt.modalBgOpacity = $(this).val();
            $('#ll-lp-modal-' + id).css('background-color', 'rgba(0,0,0, '+ opt.modalBgOpacity/100 +')');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('.modalWidth').on('change', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');

            opt.modalWidth = $(this).val();
            $('#ll-lp-modal-' + id).find('.ll-lp-modal').css('max-width', opt.modalWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('.modalHeight').on('change', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');

            opt.modalHeight = $(this).val();
            $('#ll-lp-modal-' + id).find('.ll-lp-modal').css('height', opt.modalHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('.pb-modal-iframe-url').on('change', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');
            var $modal = $('#ll-lp-modal-' + id);

            opt.modalIFrameUrl = $(this).val();

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();

            pageBuilder.refreshModalIframeOptions(opt.modalIFrameLoading, opt.modalIFrameUrl, $modal);
        });

        ll_combo_manager.event_on_change('.pb-field-modal-iframe-loading select', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var id = $tpl.find('.pb-widget__content a').attr('modal-id');
            var $modal = $('#ll-lp-modal-' + id);

            opt.modalIFrameLoading = ll_combo_manager.get_selected_value('.pb-settings-panel:visible .pb-field-modal-iframe-loading select');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();

            pageBuilder.refreshModalIframeOptions(opt.modalIFrameLoading, opt.modalIFrameUrl, $modal);
        })

        $('.pb-tabs__item').on('click', function () {
            var $this = $(this);
            var index = $this.parent().find('.pb-tabs__item').index($this);

            $this.addClass('pb-tabs__item--selected').siblings('.pb-tabs__item').removeClass('pb-tabs__item--selected');
            $this.parents('.pb-tabs').find('.pb-tabs__content').removeClass('pb-tabs__content--selected').eq(index).addClass('pb-tabs__content--selected');
        });
        $('body').on('click', '#pb-template a', function (e) {
            e.preventDefault();
        });
        $('.accordion-panel__title').on('click', function () {
            var $panel = $(this).parent();
            $panel.toggleClass('accordion-panel--open');
            $panel.find('.accordion-panel__content').slideToggle(700, function () {
                $(this).css('overflow', '');
            });
        });
        $('.pb-settings-panel__savecancel').on('click', function (e) {
            e.preventDefault();
            pageBuilder.hidePanelSettings();
            pageBuilder.removeSelectedWidget();

            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('.pb-btn-save-global').on('click', function (e) {
            e.preventDefault();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

        $('.pb-tabs-panel__tab').on('click', function () {
            var $this = $(this);
            var $box = $this.parents('.pb-wrap-tabs-panel');
            var index = $this.parent().find('.pb-tabs-panel__tab').index($this);

            $this.addClass('pb-tabs-panel__tab--selected').siblings('.pb-tabs-panel__tab').removeClass('pb-tabs-panel__tab--selected');
            $box.find('.pb-tabs-panel__content').hide().eq(index).show();
        });

        $('.pb-list-image').on('click', '.pb-image__link-browse', function () {
            var that = $(this);
            pageBuilder.openUploader(function(file){
                pageBuilder.insertImage(that.parents('.pb-image__item'), true, file);
                pageBuilder.setNewActionHistory();
            });
        });

        $('.pb-list-image').on('click', '.pb-image__link-free-image', function () {
            $('.pb-settings-panel:visible .pb-settings-panel__savecancel').trigger('click');
            $('.pb-editor__column-right > .pb-tabs > .pb-tabs__items > .pb-tabs__item--content').trigger('click');
            ll_combo_manager.set_selected_value('select.dropdownLibrary', '2');
            ll_combo_manager.trigger_event_on_change('select.dropdownLibrary');
        });

        $('.global-bk-image__link-free-image').on('click', function () {
            $('.pb-editor__column-right > .pb-tabs > .pb-tabs__items > .pb-tabs__item--content').trigger('click');
            ll_combo_manager.set_selected_value('select.dropdownLibrary', '2');
            ll_combo_manager.trigger_event_on_change('select.dropdownLibrary');
        });

        $('.pb-image__link-free-image').on('click', function () {
            $('.pb-settings-panel:visible .pb-settings-panel__savecancel').trigger('click');
            $('.pb-editor__column-right > .pb-tabs > .pb-tabs__items > .pb-tabs__item--content').trigger('click');
            ll_combo_manager.set_selected_value('select.dropdownLibrary', '2');
            ll_combo_manager.trigger_event_on_change('select.dropdownLibrary');
        });

        $('textarea.success_message').on('keyup', function(){
            var $tpl = $('.pb-widget--selected');
            $tpl.find('.ll-lp-form').attr('data-success-message', $(this).val());
        });

        $('input.redirect_url').on('keyup', function(){
            var $tpl = $('.pb-widget--selected');
            $tpl.find('.ll-lp-form').attr('data-redirect-url', $(this).val());
        });

        $('input[name="field_hide"]').on('change', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            opt.field_hide = 0;
            if($(this).is(':checked')){
                opt.field_hide = 1;
            }
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('.pb-list-image--slideshow').on('click', '.pb-image__item', function () {
            $(this).addClass('pb-image__item--selected').siblings('.pb-image__item').removeClass('pb-image__item--selected');
            pageBuilder.setActiveSlideInSlideshow($(this));
        });

        $('.pb-list-image').on('click', '.pb-image__link-replace', function (e) {
            var that = $(this);
            pageBuilder.openUploader(function (file) {
                pageBuilder.insertImage(that.parents('.pb-image__item'), true, file);
                pageBuilder.setNewActionHistory();
            });
        });

        $('.pb-list-image').on('click', '.pb-image__link-edit', function (e) {
            var indexImage = $(this).parents('.pb-image__item').index();
            pageBuilder.editImage($(this).parents('.pb-image__item'), indexImage);
        });

        $('.pb-list-image').on('click','.pb-image__link-alt', function(e){
            e.preventDefault();

            var $el = $(this)
            var indexImage = $($el).parents('.pb-image__item').index();

            var $tpl = $('.pb-widget--selected');
            var $boxImg = $tpl.find('.pb-load-image').eq(indexImage);
            if(! $tpl.find('.pb-load-image').hasClass('pb-load-image--bg')){
                var alt = $boxImg.find('img').attr('alt')
            }

            $('#ll_popup_edit_image_alt input[name=ll_image_alt_text]').val(alt);

            $('#ll_popup_edit_image_alt #ll_popup_edit_image_alt_cancel').unbind('click').bind('click', function(){
                ll_popup_manager.close('#ll_popup_edit_image_alt');
            });
            $('#ll_popup_edit_image_alt #ll_popup_edit_image_alt_save').unbind('click').bind('click', function(){
                var alt = $('#ll_popup_edit_image_alt input[name=ll_image_alt_text]').val();
                $boxImg.find('img').attr('alt', alt);
                ll_popup_manager.close('#ll_popup_edit_image_alt');
                pageBuilder.setNewActionHistory();
            });

            ll_popup_manager.open('#ll_popup_edit_image_alt');
        });

        ll_combo_manager.event_on_change('#ll_image_link_type', function(){
            var ll_image_link_type = ll_combo_manager.get_selected_value('#ll_image_link_type');
            $('#ll_popup_edit_image_link .lnk-url').hide();
            $('#ll_popup_edit_image_link .lnk-email').hide();
            if(ll_image_link_type == 'email'){
                $('#ll_popup_edit_image_link .lnk-email').show();
            } else {
                $('#ll_popup_edit_image_link .lnk-url').show();
            }
        });

        $('.pb-list-image').on('click','.pb-image__link-link', function(e){
            e.preventDefault();

            var $el = $(this)
            var indexImage = $($el).parents('.pb-image__item').index();
            var $tpl = $('.pb-widget--selected');
            var $boxImg = $tpl.find('.pb-load-image').eq(indexImage);

            var ll_image_link_type = 'url';
            var ll_image_link_url = ll_image_link_email = ll_image_link_subject = ll_image_link_body = '';
            var ll_image_link_open_in_new_window = true;
            if($boxImg.find('a').length > 0){
                $link = $boxImg.find('a');
                var _href = $link.attr('href')
                var _target = $link.attr('target')
                _href = (typeof _href != 'undefined') ? _href : '';
                if(strStartsWith(_href, 'mailto:')){
                    ll_image_link_type = 'email'
                    _href = strReplaceIgnoreCase(_href, 'mailto:', '')
                    if (_href.indexOf('?') != '-1'){
                        ll_image_link_email = strGetBeforeChar(_href, '?')
                        _href = strGetAfterChar(_href, ll_image_link_email + '?');
                        var _href_parts = _href.split('&')
                        for(var _i in _href_parts){
                            var _href_part = _href_parts[_i]
                            if(strStartsWith(_href_part, 'subject=')){
                                ll_image_link_subject = decodeURI ( strReplaceIgnoreCase(_href_part, 'subject=', '') )
                            } else if (strStartsWith(_href_part, 'body=')){
                                ll_image_link_body = decodeURI ( strReplaceIgnoreCase(_href_part, 'body=', '') )
                            }
                        }
                    } else {
                        ll_image_link_email = _href;
                    }
                } else {
                    ll_image_link_url = _href
                    ll_image_link_open_in_new_window = (typeof _target == 'undefined' || _target == '_blank')
                }
            }
            ll_combo_manager.set_selected_value('#ll_image_link_type', ll_image_link_type);
            ll_combo_manager.trigger_event_on_change('#ll_image_link_type');
            ll_theme_manager.checkboxRadioButtons.check('input[type=checkbox][name=ll_image_link_open_in_new_window]', ll_image_link_open_in_new_window)
            $('#ll_popup_edit_image_link input[name=ll_image_link_url]').val(ll_image_link_url)
            $('#ll_popup_edit_image_link input[name=ll_image_link_email]').val(ll_image_link_email)
            $('#ll_popup_edit_image_link input[name=ll_image_link_subject]').val(ll_image_link_subject)
            $('#ll_popup_edit_image_link textarea[name=ll_image_link_body]').val(ll_image_link_body)

            $('#ll_popup_edit_image_link #ll_popup_edit_image_link_cancel').unbind('click').bind('click', function(){
                ll_popup_manager.close('#ll_popup_edit_image_link')
            })
            $('#ll_popup_edit_image_link #ll_popup_edit_image_link_remove_link').unbind('click').bind('click', function(){
                if($boxImg.find('a').length > 0){
                    var _img_html = $boxImg.find('a').html()
                    $boxImg.html(_img_html);
                }
                ll_popup_manager.close('#ll_popup_edit_image_link')
            })
            $('#ll_popup_edit_image_link #ll_popup_edit_image_link_save').unbind('click').bind('click', function(){
                var _img_html = '';
                if($boxImg.find('a').length > 0){
                    var _img_html = $boxImg.find('a').html()
                } else {
                    var _img_html = $boxImg.html()
                }

                var ll_image_link_type = ll_combo_manager.get_selected_value('#ll_image_link_type');
                if(ll_image_link_type == 'email'){
                    $('#ll_popup_edit_image_link .lnk-email').show();
                    var ll_image_link_email = $.trim($('#ll_popup_edit_image_link input[name=ll_image_link_email]').val())
                    var ll_image_link_subject = $.trim($('#ll_popup_edit_image_link input[name=ll_image_link_subject]').val())
                    var ll_image_link_body = $.trim($('#ll_popup_edit_image_link textarea[name=ll_image_link_body]').val())
                    if(ll_image_link_email != '' && IsValidEmail(ll_image_link_email)){
                        var _href = 'mailto:' + ll_image_link_email;
                        var _separator = '?';
                        if(ll_image_link_subject != ''){
                            _href += _separator + 'subject=' + encodeURI(ll_image_link_subject);
                            _separator = '&'
                        }
                        if(ll_image_link_body != ''){
                            _href += _separator + 'body=' + encodeURI(ll_image_link_body);
                            _separator = '&'
                        }

                        $boxImg.html('<a></a>');
                        $boxImg.find('a').attr('href', _href)
                        $boxImg.find('a').html(_img_html)
                        ll_popup_manager.close('#ll_popup_edit_image_link')
                    } else {
                        show_error_message("Please enter valid Email");
                        return false;
                    }
                } else {
                    var ll_image_link_url = $.trim($('#ll_popup_edit_image_link input[name=ll_image_link_url]').val())
                    if(ll_image_link_url != '' && validateURL(ll_image_link_url)){
                        var ll_image_link_open_in_new_window = $('input[type=checkbox][name=ll_image_link_open_in_new_window]').is(':checked')
                        var _target = '';
                        if(ll_image_link_open_in_new_window){
                            _target = '_blank';
                        } else {
                            _target = '_self';
                        }
                        $boxImg.html('<a></a>');
                        $boxImg.find('a').attr('href', ll_image_link_url)
                        $boxImg.find('a').attr('target', _target)
                        $boxImg.find('a').html(_img_html)
                        ll_popup_manager.close('#ll_popup_edit_image_link')
                    } else {
                        show_error_message("Please enter valid URL");
                        return false;
                    }
                }
                pageBuilder.setNewActionHistory();
            })

            ll_popup_manager.open('#ll_popup_edit_image_link')
        });

        $('.upload_page_favicon').click(function () {
            var that = $(this);
            pageBuilder.openUploader(function (url) {
                var $tpl = $('#pb-template');
                var opt = $tpl.data('json');
                opt.favicon = url;
                $tpl.attr('data-json', JSON.stringify(opt));
                var fileName = pageBuilder.getBgImageName(url.url);
                var $box = that.closest('.favicon_upload_contianer');
                $box.find('.pb-unload-favicon .pb-unload-favicon__title').text(fileName);
                $box.find('.pb-unload-favicon .pb-unload-favicon__title').attr('favicon_url', url.url);
                $box.find('.pb-unload-favicon').show();
                that.hide();
                LandingPageBuilder.update_history_meta_data();
            });
        });

        $('.upload_page_cover').click(function () {
            var that = $(this);
            pageBuilder.openUploader(function (url) {
                var $tpl = $('#pb-template');
                var opt = $tpl.data('json');
                opt.cover = url;
                $tpl.attr('data-json', JSON.stringify(opt));
                var fileName = pageBuilder.getBgImageName(url.url);
                var $box = that.closest('.cover_upload_contianer');
                $box.find('.pb-unload-cover .pb-unload-cover__title').text(fileName);
                $box.find('.pb-unload-cover .pb-unload-cover__title').attr('cover_url', url.url);
                $box.find('.pb-unload-cover').show();
                that.hide();
                LandingPageBuilder.update_history_meta_data();
            });
        });

        /*$('#pb-panel__svg .pb-tabs-panel__tab--content').click(function () {
            pageBuilder.svgBox.setEditorHTML();
        });*/

        $('#pb-panel__svg .pb-tabs-panel__tab--settings').click(function () {
            //pageBuilder.svgBox.setHTML();
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var fill = $tpl.find('.pb-svg-box .pb-load-svg').find('svg').attr('fill');
            if(typeof fill == 'undefined'){
                $tpl.find('.pb-svg-box .pb-load-svg').find('svg').find('*').each(function(){
                    fill = $(this).attr('fill');
                    if(typeof fill != 'undefined' && fill && fill != 'none'){
                        return false;
                    }
                });
            }
            if(typeof fill == 'undefined'){
                fill = '#ffffff';
            }
            opt.fillColor = fill;
            $('#svgFillColor').colpickSetColor(opt.fillColor, true).css('background-color', opt.fillColor);
            var stroke = $tpl.find('.pb-svg-box .pb-load-svg').find('svg').attr('stroke');
            if(typeof stroke == 'undefined'){
                $tpl.find('.pb-svg-box .pb-load-svg').find('svg').find('*').each(function(){
                    stroke = $(this).attr('stroke');
                    if(typeof stroke != 'undefined' && stroke && stroke != 'none'){
                        return false;
                    }
                });
            }
            if(typeof stroke == 'undefined'){
                stroke = '#ffffff';
            }
            opt.strokeColor = stroke;
            $('#svgStrokeColor').colpickSetColor(opt.strokeColor, true).css('background-color', opt.strokeColor);
            //pageBuilder.svgBox.setEditorHTML();
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('.pb-list-image').on('click', '.pb-image__link-remove', function (e) {
            e.stopPropagation();
            var $item = $(this).parents('.pb-image__item');
            var isSelected = false;

            if ($item.hasClass('pb-image__item--selected'))
                isSelected = true;

            pageBuilder.removeImage($item);

            if (isSelected)
                $('.pb-list-image--slideshow:visible').find('.pb-image__item:first').trigger('click');
            else
                pageBuilder.setNewActionHistory();
        });

        $('.pb-add-image-group').on('click', function () {
            pageBuilder.addImageListGroup();
            pageBuilder.setNewActionHistory();
        });

        $('.pb-add-slide').on('click', function () {
            pageBuilder.addImageListSlideshow();
            pageBuilder.setNewActionHistory();
        });

        $('.pb-btn-upload-svg').on('click', function () {
            pageBuilder.openUploader(function (){

            }, true);
        });

        $('.pb-unload-svg__remove').on('click', function () {
            pageBuilder.removeIcnSvg($(this));
            pageBuilder.setNewActionHistory();
        });

        $('.background_transparent').on('change', function () {
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            opt.background_transparent = 0;
            if($(this).is(':checked')){
                opt.background_transparent = 1;
                $tpl.css('background-color', 'transparent');
            } else {
                pageBuilder.updateColorElTpl($('div.color-box#dividerBackground'), opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('.touch-spin-svg').TouchSpin({
            min: 0,
            max: 1000
        });
        $('.touch-spin-auto').TouchSpin({
            min: 0,
            max: 2000
        });
        $('.touch-spin').TouchSpin({
            min: 0,
            max: 100
        });
        $('.touch-spin-slideshow-height').TouchSpin({
            min: 150,
            max: 600
        });
        $('.touch-spin-slideshow-width').TouchSpin({
            min: 10,
            max: 100
        });
        $('.pb-input-css').change(function () {
            var $this = $(this);
            var val = $this.val();
            var result = val.match(/\b(auto)\b|\b[0-9]{1,}(px|\u0025)?/g);

            if (result != null) {
                if (+result)
                    $this.val(result + 'px');
                else
                    $this.val(result);
            }
            else {
                $this.val('');
            }

        });
        pageBuilder.sliderGrid('imgCaptionOneGrid', ['50']);
        pageBuilder.sliderGrid('textColumnsWithImgGrid', ['50']);
        pageBuilder.sliderGrid('imgCaptionTwoGrid', ['50']);
        pageBuilder.sliderGrid('twoTextColumnsGrid', ['50']);
        pageBuilder.sliderGrid('columnsCaptionGrid', ['50']);

        ll_combo_manager.event_on_change('#gridNumberColumnsTwo', function () {
            var $this = $(this);
            pageBuilder.numberColumns($this.attr('id'), $this.val());
            pageBuilder.updateColumnsContent($this.attr('id'), $this.val());
            pageBuilder.setNewActionHistory();
        });

        ll_combo_manager.event_on_change('#gridNumberColumnsThree', function () {
            var $this = $(this);
            pageBuilder.numberColumns($this.attr('id'), $this.val());
            pageBuilder.updateColumnsContent($this.attr('id'), $this.val());
            pageBuilder.setNewActionHistory();
        });

        ll_combo_manager.event_on_change('#gridNumberColumnsUneven', function () {
            var $this = $(this);
            pageBuilder.numberColumns($this.attr('id'), $this.val());
            pageBuilder.updateColumnsContent($this.attr('id'), $this.val());
            pageBuilder.setNewActionHistory();
        });

        $('.pb-btn-upload-bg-image').on('click', function () {
            var $btn = $(this);
            var $box = $btn.closest('.pb-box-btn-upload-bg-image');
            pageBuilder.openUploader(function(url){
                if ($box.hasClass('pb-box-btn-upload-bg-image--global')){
                    pageBuilder.addBgImage($box, true, url);
                }else{
                    pageBuilder.addBgImage($box, false, url);
                }
                pageBuilder.setNewActionHistory();
            });
        });

        $('.pb-unload-favicon__remove').on('click', function () {
            var $tpl = $('#pb-template');
            var opt = $tpl.data('json');
            opt.favicon = '';
            $tpl.attr('data-json', JSON.stringify(opt));
            var $box = $(this).closest('.favicon_upload_contianer');
            $box.find('.pb-unload-favicon').hide();
            $box.find('.upload_page_favicon').show();
            $box.find('.pb-unload-favicon .pb-unload-favicon__title').text('');
            $box.find('.pb-unload-favicon .pb-unload-favicon__title').attr('favicon_url', '');
            LandingPageBuilder.update_history_meta_data();
        });

        $('.pb-unload-cover__remove').on('click', function () {
            var $tpl = $('#pb-template');
            var opt = $tpl.data('json');
            opt.cover = '';
            $tpl.attr('data-json', JSON.stringify(opt));
            var $box = $(this).closest('.cover_upload_contianer');
            $box.find('.pb-unload-cover').hide();
            $box.find('.upload_page_cover').show();
            $box.find('.pb-unload-cover .pb-unload-cover__title').text('');
            $box.find('.pb-unload-cover .pb-unload-cover__title').attr('cover_url', '');
            LandingPageBuilder.update_history_meta_data();
        });

        $('.pb-unload-bg-image__remove').on('click', function () {
            var $btn = $(this);
            var $box = $btn.closest('.pb-box-btn-upload-bg-image');

            if ($box.hasClass('pb-box-btn-upload-bg-image--global')) {
                pageBuilder.removeBgImage($box, true);
            }else {
                pageBuilder.removeBgImage($box);
            }
            pageBuilder.setNewActionHistory();
        });
        $('body').on('click', '.pb-blocks .pb-widget', function (e) {
            e.stopPropagation();
            pageBuilder.selectWidget($(this));
        });
        $('body').on('dblclick', '.pb-blocks .pb-editable', function (e) {
            pageBuilder.showHideEditorInline($(this));
        });
        $('body').on('click', '.pb-blocks .pb-widget__btn-remove', function (e) {
            e.stopPropagation();
            pageBuilder.removeWidget($('.pb-widget--selected'));
        });
        $('body').on('click', '.pb-blocks .pb-widget__btn-clone', function (e) {
            e.stopPropagation();
            pageBuilder.cloneWidget($('.pb-widget--selected'));
        });
        $('body').on('click', '.pb-blocks .pb-widget__btn-settings', function (e) {
            e.stopPropagation();
            $(this).toggleClass('open');
            return false;
        });
        $('body').on('click', '.pb-blocks .save-as-custom-elements', function (e) {
            e.stopPropagation();

            var $widget = $(this).closest('.pb-widget');
            if(!$('.temp_to_clean_widget').length) {
                let body = document.getElementsByTagName('body')[0];
                let elChild = document.createElement('div');
                elChild.className = 'temp_to_clean_widget';
                elChild.innerHTML = $(this).closest('.pb-widget')[0].outerHTML;
                body.appendChild(elChild);
            }
            var type = $widget.attr('data-type');
            $('.temp_to_clean_widget .pb-widget').removeClass('pb-widget--selected');

            $('.temp_to_clean_widget .pb-widget').removeClass('pb-widget--selected ui-droppable').removeAttr('data-idx data-name').addClass('pb-widget--init');
            $('.temp_to_clean_widget .pb-widget').find('.ui-droppable').removeClass('ui-droppable');
            $('.temp_to_clean_widget .pb-widget').find('.ui-sortable').removeClass('ui-sortable');
            $('.temp_to_clean_widget .pb-widget').find('.pb-editable').removeClass('mce-content-body').removeAttr('id contenteditable');
            $('.temp_to_clean_widget .pb-widget').find('.pb-widget').removeAttr('data-idx data-name').addClass('pb-widget--init');

            $('.temp_to_clean_widget .pb-widget').find('.pb-widget__shadow-label').each(function(){
                var $el = $(this);
                var text = $el.text();
                var newLabelText = text.substr(0, text.indexOf(" #"));
                $el.text(newLabelText);
            });

            if (type === 'container' || type === 'two-column-grid' || type === 'three-column-grid' || type === 'uneven-grid' || type === 'vertical-form' || type === 'horizontal-form')
                pageBuilder.dragDropColumns();

            ll_custom_elements_manager.open(0,CUSTOM_ELEMENT_FOR_LANDING_PAGE, $('.temp_to_clean_widget').html());
            $('.temp_to_clean_widget').remove();
            return false;
        });

        $('.search-results-list-icon').on('click', function (e) {
            e.preventDefault();
        });

        ll_combo_manager.event_on_change('select.dropdownLibrary', function () {
            var val = ll_combo_manager.get_selected_value('select.dropdownLibrary');
            var $elements = $('.list-elements');
            var $icons = $('.list-free-icons');
            var $freeImages = $('.list-free-images');
            var $readyMade = $('.list-ready-made');
            var $content = $('.pb-tabs__content--content');
            var $input = $('#pb-search-input-free > .txt-field');

            if (val === '0') {
                $elements.hide();
                $freeImages.hide();
                $icons.hide();
                $readyMade.show();
                $content.removeClass('pb-tabs__content--content-search');
            } else if (val === '1') {
                $elements.hide();
                $freeImages.hide();
                $readyMade.hide();
                $icons.show().find('li').show();
                $content.addClass('pb-tabs__content--content-search');
                $input.removeClass('pb-input-free-icons pb-input-free-images').val('');
                $input.addClass('pb-input-free-icons');
            } else if (val === '2') {
                $elements.hide();
                $readyMade.hide();
                $icons.hide();
                $freeImages.show();
                $content.addClass('pb-tabs__content--content-search');
                $input.removeClass('pb-input-free-icons pb-input-free-images').val('');
                $input.addClass('pb-input-free-images');
                pageBuilder.freeImages(1, '', false);
            } else {
                $freeImages.hide();
                $readyMade.hide();
                $icons.hide();
                $elements.show();
                $content.removeClass('pb-tabs__content--content-search');
            }
        });

        $('#pb-search-input-free > .txt-field').change(function () {
            var $list = $('.list-free-icons > ul');
            var $input = $(this);
            var val = $.trim($input.val());

            if ($input.hasClass('pb-input-free-images')) {
                $list = $('.list-free-images > ul');
                pageBuilder.freeImages(1, val, false);
            } else {
                if (val === "") {
                    $list.find('li').show();
                } else {
                    $list.find('li').hide();
                    $list.find('li .text:Contains("' + val + '")').each(function () {
                        $(this).parents('.dib').show();
                    });
                }
            }
        });

        $('.pb-more-free-images:not(.disabled)').on('click', function () {
            var $btn = $(this);
            var page = $btn.attr('data-page');

            $btn.addClass('disabled');
            pageBuilder.freeImages(page, $.trim($('.pb-input-free-images').val()), true);
        });

        $('.widget-tree__h').on('click', function () {
            $('.pb-editor__column-right').toggleClass('pb-widget-tree--close');
        });

        $('.pb-top-header__title-center-text').on('keypress', function (e) {
            if (e.which == 13) {
                $(this).blur();
                return false;
            }
        });

        $('.pb-top-header__title-center-text').on('blur', function (e) {
            var $this = $(this);
            var val = $.trim($this.text());
            if (val === '')
                $this.text($this.attr('data-text'));
        });

        $('#pbBtnPreview:not(.disabled)').on('click', function (e) {
            e.preventDefault();
            pageBuilder.previewBox();
        });


        $('#ll_popup_insert_token_cancel').bind('click', function(){
            ll_popup_manager.close('#ll_popup_insert_token')
        })
        $('#ll_popup_insert_token_save').bind('click', function(){
            var insert_ll_field = ll_combo_manager.get_selected_value('#ll_popup_insert_token #select_insert_ll_field');
            if(typeof insert_ll_field != 'undefined' && insert_ll_field != ''){
                pageBuilder.InsertToken(insert_ll_field)
                ll_popup_manager.close('#ll_popup_insert_token')
            } else {
                show_error_message ('Please Select Field');
            }
        })

        /*$('#pb-preview-box__iframe').on("load", function () {
            pageBuilder.iframePreviewContent = $("#pb-preview-box__iframe").contents();
            $('#pbBtnPreview').removeClass('disabled');
        });*/
        pageBuilder.addIframePreview();

        /*$('.pb-blocks').on('dblclick.uploadBackground', function (e) {
            e.stopPropagation();
            pageBuilder.openUploader();
        });*/

        /*$('.pb-blocks').on('dblclick.uploadBackgroundWidget', '.pb-widget', function (e) {
            e.stopPropagation();
            var $el = $(this);

            if (!$el.hasClass('pb-widget--button') && !$el.hasClass('pb-widget--video') && !$el.hasClass('pb-widget--video'))
                pageBuilder.openUploader();
        });*/

    },
    InsertToken: function(placeholder) {
        placeholder = '%%' + placeholder + '%%';
        pageBuilder.active_html_editor.execCommand('mceInsertContent', false, placeholder);
    },
    initMoreEvents: function () {
        $('.pb-widget:not(.pb-widget--svg):not(.pb-widget--icon):not(.pb-widget--field):not(.pb-widget--video):not(.pb-widget--button):not(.pb-widget--code)').each(function (){
            pageBuilder.dropFreeImages($(this));
        });
        pageBuilder.globalBackGroundSetFreeImages();
        pageBuilder.updateInlineCss('button');
        pageBuilder.updateInlineCss('link');
        $('.pb-widget, .pb-load-image').removeClass('.ui-droppable');
        //pageBuilder.dropFreeImages();
        $(".pb-layout-grid__cell.ui-sortable, .pb-container-grid.ui-sortable, .pb-form-grid.ui-sortable").removeClass('ui-sortable');
        pageBuilder.dragDropElements();
        pageBuilder.initGlobalOptions();
        pageBuilder.openUploaderInit();
        pageBuilder.loadImage();
        pageBuilder.loadSvg();
        pageBuilder.widgetTreeLoad();
        if ($('.pb-editable').length > 0) {
            pageBuilder.initEditorInline();
        }
    },
    globalBackGroundSetFreeImages: function(){
        $('#pb-template').droppable(
            { accept: '.list-free-images > ul > li', hoverClass: 'pb-widget--drop-free-image', greedy: true },
            {
                drop: function (event, ui) {
                    var url = $(ui.helper).attr('data-url');
                    var $tpl = $('#pb-template');
                    var opt = $tpl.data('json');
                    opt.backgroundImageUrl = url;
                    $tpl.css('background-image', 'url("' + opt.backgroundImageUrl + '")');
                    $tpl.attr('data-json', JSON.stringify(opt));
                    $('.pb-widget--drop-free-image').removeClass('pb-widget--drop-free-image');
                    $('.pb-box-btn-upload-bg-image--global').removeClass('pb-box-btn-upload-bg-image--none');
                    $('.pb-box-btn-upload-bg-image--global').find('.pb-unload-bg-image__title').text(url);
                    pageBuilder.updateHistory();
                }
            }
        );
    },
    dropFreeImages: function ($el) {
        var $el = $el || $('#pb-template, .pb-widget:not(.pb-widget--svg):not(.pb-widget--icon):not(.pb-widget--field):not(.pb-widget--video):not(.pb-widget--button):not(.pb-widget--code)');
        $el.each(function () {
            var type = $el.data('type');
            /*$el.find('.pb-load-image').droppable(
             { accept: '.list-free-images > ul > li', hoverClass: 'pb-widget--drop-free-image', greedy: true },
             {
             drop: function (event, ui) {
             var url = $(ui.helper).attr('data-url');
             if (type != 'slideshow' && type != 'vertical-slideshow') {
             $imgBoxTpl = $(this);
             $imgBoxTpl.find('img.pb-img').attr('src', url);
             $imgBoxTpl.removeClass('pb-load-image--none');
             $imgBoxTpl.removeAttr('image-inserted-by-media-manager');
             $('.pb-widget--drop-free-image').removeClass('pb-widget--drop-free-image');
             pageBuilder.updateHistory();
             }
             }
             });*/
            $el.add($el.find('.pb-load-image')).droppable(
                { accept: '.list-free-images > ul > li', hoverClass: 'pb-widget--drop-free-image', greedy: true },
                {
                    drop: function (event, ui) {
                        var url = $(ui.helper).attr('data-url');
                        if ($(this).hasClass('pb-load-image')) {

                            if (type != 'slideshow' && type != 'vertical-slideshow') {
                                $imgBoxTpl = $(this);
                                $imgBoxTpl.find('img.pb-img').attr('src', url);
                                $imgBoxTpl.removeClass('pb-load-image--none');
                                $imgBoxTpl.removeAttr('image-inserted-by-media-manager');
                            }
                        } else {
                            var $tpl = $el;
                            var opt = $tpl.data('json');
                            opt.backgroundImageUrl = url;
                            if ($tpl.hasClass('pb-widget--calendar') || $tpl.hasClass('pb-widget--social-share') || $tpl.hasClass('pb-widget--social-follow')) {
                                $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', 'url("' + opt.backgroundImageUrl + '")');
                            } else if ($tpl.hasClass('pb-widget--nav-item')) {
                                $tpl.css('background-image', 'url("' + opt.backgroundImageUrl + '")');
                            } else {
                                $tpl.css('background-image', 'url("' + opt.backgroundImageUrl + '")');
                            }
                            $tpl.attr('data-json', JSON.stringify(opt));
                        }
                        $('.pb-widget--drop-free-image').removeClass('pb-widget--drop-free-image');
                        pageBuilder.updateHistory();
                    }
                });
        });
        /*$el.droppable(
         { accept: '.list-free-images > ul > li', hoverClass: 'pb-widget--drop-free-image', greedy: true, },
         {
         drop: function (event, ui) {
         var url = $(ui.helper).attr('data-url');
         pageBuilder.addBgImage(false, false, url, $(this));
         pageBuilder.updateHistory();
         }
         });*/
    },
    draggableFreeImages: function () {
        $('.list-free-images > ul > li:not(.ui-draggable)').draggable({
            helper: 'clone',
            appendTo: '.page-builder-editor',
            refreshPositions: true
        });
    },
    dragableElements: function () {
        $(".list-elements__item, .list-free-icons .dib, .list-ready-made__item").draggable({
            helper: 'clone',
            appendTo: '.page-builder-editor',
            start: function (event, ui) {

            },
            stop: function (event, ui) {
                $('.pb-sortable-hover').removeClass('pb-sortable-hover');
            },
            connectToSortable: ".pb-blocks, .pb-layout-grid__cell, .pb-container-grid, .pb-form-grid",
            refreshPositions: true
        });
    },
    dragDropElements: function () {
        var currentlyScrolling = false;
        var SCROLL_AREA_HEIGHT = 70;
        $('.pb-blocks').sortable({
            cursor: 'move',
            appendTo: 'body',
            tolerance: 'pointer',
            cancel: '.pb-helper-drag-drop, .ui-widget-disabled',
            connectWith: '.pb-blocks, .pb-layout-grid__cell, .pb-container-grid, .pb-form-grid',
            placeholder: 'pb-placeholder-element',
            helper: 'clone',
            opacity: '.5',
            beforeStop: function (event, ui) {
                pageBuilder.addElement($(ui.item));
            },
            start: function (event, ui) {
                $(this).addClass('pb-blocks--start-sortable');
                ui.item.parent().addClass('pb-sortable-hover');
            },
            over: function (event, ui) {
                $('.pb-sortable-hover').removeClass('pb-sortable-hover');
                $(this).addClass('pb-sortable-hover');
            },
            out: function (event, ui) {
                $('.pb-sortable-hover').removeClass('pb-sortable-hover');
            },
            stop: function (event, ui) {
                pageBuilder.dragDropColumns();
            },
            receive: function (event, ui) {

            },
            update: function (event, ui) {
                if (!$(ui.item).hasClass('list-elements__item')) {
                    pageBuilder.widgetTreeMove($(ui.item));
                }
                var $this = $(this);
                $this.removeClass('pb-sortable-hover');
                pageBuilder.showHideHelpDragDropBox($this);
                $this.removeClass('pb-blocks--start-sortable');

                var type = pageBuilder.getTypeElement($(ui.item));
                //if(type != 'custom-form'){
                pageBuilder.updateHistory();
                //}
            },
            change: function () {

            },
            sort: function (event, ui) {
                if (currentlyScrolling) {
                    return;
                }
                var windowHeight = $(window).height();
                var mouseYPosition = event.clientY;
                if (mouseYPosition < SCROLL_AREA_HEIGHT) {
                    currentlyScrolling = true;

                    $('.pb-blocks').animate({
                        scrollTop: "-=" + windowHeight / 2 + "px"
                    }, 400, function () {
                        currentlyScrolling = false;
                    });
                } else if (mouseYPosition > (windowHeight - SCROLL_AREA_HEIGHT)) {
                    currentlyScrolling = true;
                    $('.pb-blocks').animate({
                        scrollTop: "+=" + windowHeight / 2 + "px"
                    }, 400, function () {
                        currentlyScrolling = false;
                    });

                }
            }
        });
        pageBuilder.dragDropColumns();
    },
    dragDropColumns: function () {
        $(".pb-layout-grid__cell.ui-sortable, .pb-container-grid.ui-sortable, .pb-form-grid.ui-sortable").sortable('destroy');
        $(".pb-layout-grid__cell, .pb-container-grid, .pb-form-grid").sortable({
            cursor: 'move',
            appendTo: 'body',
            tolerance: 'pointer',
            cancel: '.pb-helper-drag-drop, .ui-widget-disabled',
            connectWith: '.pb-blocks, .pb-layout-grid__cell, .pb-container-grid, .pb-form-grid',
            placeholder: 'pb-placeholder-element',
            helper: 'clone',
            opacity: '.5',
            beforeStop: function (event, ui) {
                pageBuilder.addElement($(ui.item));
            },
            start: function (event, ui) {
                $(this).addClass('pb-blocks--start-sortable');
                ui.item.parent().addClass('pb-sortable-hover');
            },
            over: function (event, ui) {
                $('.pb-sortable-hover').removeClass('pb-sortable-hover');
                $(this).addClass('pb-sortable-hover');
            },
            out: function (event, ui) {
                $('.pb-sortable-hover').removeClass('pb-sortable-hover');
            },
            stop: function (event, ui) {
                var $this = $(this);
                $this.removeClass('pb-sortable-hover');
                pageBuilder.showHideHelpDragDropCell($this);
                $this.removeClass('pb-blocks--start-sortable');
                pageBuilder.dragDropColumns();
            },
            receive: function (event, ui) {
                var $this = $(this);
                pageBuilder.showHideHelpDragDropCell($this);
            },
            update: function (event, ui) {
                if (!$(ui.item).hasClass('list-elements__item')) {
                    pageBuilder.widgetTreeMove($(ui.item));
                }
                pageBuilder.updateHistory();
            }
        });
    },
    widgetTree: function () {
        $('.list-widgets').nestedSortable({
            handle: 'div',
            items: 'li',
            revert: 250,
            helper: 'clone',
            placeholder: 'ui-sortable-placeholder',
            cancel: '.ui-item-widget-disabled',
            toleranceElement: '> div',
            forcePlaceholderSize: true,
            expandOnHover: 700,
            startCollapsed: false,
            isTree: true,
            update: function (event, ui) {
                pageBuilder.widgetTreeMove($(ui.item), true);
                pageBuilder.updateHistory();
            },
        });
        $('.list-widgets').on('click', '.list-widgets__item:not(.mjs-nestedSortable-leaf) > .item__div > .item__collapse', function (e) {
            e.stopPropagation();
            $(this).toggleClass('item__collapse--close');
            $(this).closest('.list-widgets__item').children('ol').slideToggle();
        });
        $('.list-widgets').on('click', '.list-widgets__item', function (e) {
            e.stopPropagation();
            var $li = $(this);
            if (!$li.hasClass('list-widgets__item--hide-true') && !$li.parents('.list-widgets__item--hide-true').length) {
                var idx = $li.attr('data-idx');
                var type = $li.attr('data-type');
                var classType = type;
                if (type === 'vertical-slideshow')
                    classType = 'slideshow';
                $('.list-widgets__item--selected').removeClass('selected');
                $li.addClass('list-widgets__item--selected');
                $('.pb-widget--' + classType + '[data-idx="' + idx + '"]').trigger('click');
            }
        });
        $('.list-widgets').on('click', '.item__delete:not(.item__delete--none)', function (e) {
            e.stopPropagation();
            pageBuilder.removeWidget($(this).closest('.list-widgets__item'));
        });
        $('.list-widgets').on('click', '.item__show-hide', function (e) {
            e.stopPropagation();
            pageBuilder.showHideWidget($(this).parents('.list-widgets__item:first'));
        });
        $('.list-widgets').on('dblclick', '.item__content', function (e) {
            e.stopPropagation();
            e.preventDefault();
            pageBuilder.setNameWidget($(this).closest('.list-widgets__item'));
        });
        pageBuilder.widgetTreeLoad();
    },
    widgetTreeLoad: function () {
        var $widgets = $('#pb-template').find('.pb-widget');
        $('.list-widgets').html('');
        if ($widgets.length) {
            $widgets.each(function () {
                var $el = $(this);
                pageBuilder.addItemTree($el.attr('data-type'), $el.attr('data-idx'), $el.parents('.pb-widget:first, .pb-blocks:first'));
            });
        }
        pageBuilder.widgetTreeIsElements($widgets);
    },
    widgetTreeIsElements: function ($el) {
        var $content = $('.widget-tree__content');

        if ($el.length)
            $content.addClass('widget-tree__content--active');
        else
            $content.removeClass('widget-tree__content--active');
    },
    widgetTreeIsElementsParent: function ($parent) {
        if ($parent.length) {
            if ($parent.children('ol').children('li').length)
                $parent.removeClass('mjs-nestedSortable-leaf');
            else
                $parent.addClass('mjs-nestedSortable-leaf');
        }
    },
    addItemTree: function (type, idx, $parent) {
        var classType = type;

        if (type === 'vertical-slideshow')
            classType = 'slideshow';

        var $list = $('.list-widgets');
        var isNestedList = "mjs-nestedSortable-no-nesting";
        var $ol = null;
        var index = 0;
        var $widget = $('.pb-widget--' + classType + '[data-idx="' + idx + '"]');
        var widget_hidden = false;
        if($widget.hasClass('pb-widget--hide')){
            widget_hidden = true;
        }
        var $parentWidget = $widget.parent();
        var isDeleteitem = ($widget.hasClass('pb-widget--no-remove')) ? ' item__delete--none' : '';
        var isDisabled = ($widget.hasClass('ui-widget-disabled')) ? ' ui-item-widget-disabled' : '';

        if ($parentWidget.hasClass('pb-layout-grid__cell'))
            index = $parentWidget.parent().children('.pb-layout-grid__cell').children('.pb-widget').index($widget);
        else
            index = $parentWidget.children('.pb-widget').index($widget);

        if (type === 'nav-items' || type === 'container' || type === "two-column-grid" || type === "three-column-grid" || type === "uneven-grid" || type === "vertical-form" || type === "horizontal-form" || type === "custom-form" || type === "activation")
            isNestedList = '';

        var html = '<li class="list-widgets__item mjs-nestedSortable-leaf ' + isNestedList + ' list-widgets__item--' + classType + isDisabled + (widget_hidden ? ' list-widgets__item--hide-true' : '') + '" data-type="' + type + '" data-idx="' + idx + '">' +
            '<div class="item__div">' +
            '<div class="item__content">' + $widget.attr("data-name") + '</div>' +
            '<div class="item__collapse"></div>' +
            '<div class="item__show-hide"></div>' +
            '<div class="item__delete' + isDeleteitem + '"></div>' +
            '</div>' +
            '</li>';
        if ($parent.hasClass('pb-widget')) {
            $list = $('.list-widgets__item--' + $parent.attr('data-type') + '[data-idx="' + $parent.attr('data-idx') + '"]');

            if (!$list.children('ol').length) {
                $list.append('<ol></ol>');
            }
            $ol = $list.children('ol');
            if (index === 0) {
                $ol.prepend(html);
            } else {
                $ol.children('li').eq(index - 1).after(html);
            }

        } else {
            if (index === 0) {
                $list.prepend(html);
            } else {
                $list.children('li').eq(index - 1).after(html);
            }

        }
        $list.removeClass('mjs-nestedSortable-leaf');
    },
    widgetTreeMove: function ($el, isWidgetTreeElement) {
        var type = $el.attr('data-type');

        if (type === 'vertical-slideshow')
            type = 'slideshow';

        var idx = $el.attr('data-idx');
        var $widget = $('.pb-widget--' + type + '[data-idx="' + idx + '"]');
        var $widgetTreeItem = $('.list-widgets__item--' + type + '[data-idx="' + idx + '"]');
        var $helper = null;
        var $parent = null;
        var pos = 0;
        var $beforeItem = null;
        var $parentOld = null;

        if (isWidgetTreeElement) {
            $parentOld = $widget.parent();
            $widget = $widget.detach();
            pos = $el.parent().children('li').index($widgetTreeItem);
            if (pos === 0) {
                $parent = $el.parents('.list-widgets__item:first');

                if (!$parent.length) {
                    $helper = $('.pb-blocks');
                } else {
                    $helper = $('.pb-widget--' + $parent.attr('data-type') + '[data-idx="' + $parent.attr('data-idx') + '"]');

                    if ($parent.attr('data-type') === 'container') {
                        $helper = $helper.children('.pb-container-grid');
                    } else if ($parent.attr('data-type') === 'vertical-form' || $parent.attr('data-type') === 'horizontal-form' || $parent.attr('data-type') === 'custom-form') {
                        $helper = $helper.children('.pb-form-grid');
                    } else if ($parent.attr('data-type') === 'two-column-grid' || $parent.attr('data-type') === 'three-column-grid' || $parent.attr('data-type') === 'uneven-grid') {
                        $helper = $helper.children('.pb-layout-grid').children('.pb-layout-grid__cell:first');
                    }
                }

                $helper.prepend($widget);
            } else {
                $beforeItem = $el.prev('li');
                var beforeType = $beforeItem.attr('data-type');
                if (beforeType === 'vertical-slideshow')
                    beforeType = 'slideshow';
                $helper = $('.pb-widget--' + beforeType + '[data-idx="' + $beforeItem.attr('data-idx') + '"]');
                $helper.after($widget);
            }
            pageBuilder.showHideHelpDragDropCell($parentOld);
            pageBuilder.showHideHelpDragDropCell($widget.parent());
        } else {
            $parentOld = $widgetTreeItem.parents('.list-widgets__item:first');
            $widgetTreeItem = $widgetTreeItem.detach();
            $parent = $widget.parent();
            if ($parent.hasClass('pb-layout-grid__cell'))
                pos = $parent.parent().children('.pb-layout-grid__cell').children('.pb-widget').index($widget);
            else
                pos = $parent.children('.pb-widget').index($widget);

            $parent = $widget.parents('.pb-widget:first');

            if (!$parent.length) {
                $helper = $('.list-widgets');
            } else {
                $helper = $('.list-widgets__item--' + $parent.attr('data-type') + '[data-idx="' + $parent.attr('data-idx') + '"]');

                if (!$helper.children('ol').length && $helper.hasClass('list-widgets__item')) {
                    $helper.append('<ol></ol>');
                }

                $helper = $helper.children('ol');
            }

            if (pos === 0)
                $helper.prepend($widgetTreeItem);
            else
                $helper.children('li').eq(pos - 1).after($widgetTreeItem);

            pageBuilder.widgetTreeIsElementsParent($parentOld);
            pageBuilder.widgetTreeIsElementsParent($widgetTreeItem.parents('.list-widgets__item:first'));
        }
    },
    getHTMLElement: function (type, $el) {
        var html = '';
        var dataJson = '{}';
        var type2 = $el.attr('data-type2');

        if (type === 'container' && !type2) {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"10px", "paddingRight":"10px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1, "isDesktop":"true", "isTablet": "true", "isMobile":"true"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--container' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'two-column-grid') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "width":"90%", "minHeight":"0","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "gridSize1": "50", "gridSize2": "50", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--two-column-grid' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-layout-grid pb-layout-grid--2 pb-clearfix">' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'three-column-grid') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "radius":"0", "width":"90%", "minHeight":"0","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "gridSize1": "33", "gridSize2": "34", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--three-column-grid' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-layout-grid pb-layout-grid--3 pb-clearfix">' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'uneven-grid') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "width":"90%", "minHeight":"0","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "gridSize1": "60", "gridSize2": "20", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--uneven-grid' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-layout-grid pb-layout-grid--uneven pb-clearfix">' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '<div class="pb-layout-grid__cell">' + pageBuilder.getWidgetHTMLHelper() + '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'text') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--text' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'image') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "textAlign":"0", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--image' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'image-group') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "count":"2", "layout":"0", "layoutIndex":"0", "width":"100%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--image-group' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-wrap-image-group--0-0 pb-clearfix">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'svg') {
            dataJson = '{"width":"80", "height":"80", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"0", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--svg' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg pb-load-svg--none"></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'video') {
            html = '<div class="pb-widget pb-widget--init pb-widget--video" data-type="' + type + '">' +
                '<div class="pb-widget__content pb-video-box">' +
                '<iframe type="text/html" width="720" height="405" src="https://www.youtube.com/embed/bSXQ5Etde2o?rel=0" frameborder="0" allowfullscreen></iframe>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'text-column-with-image') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"2", "position":"2", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--text-column-with-image' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-text-column-with-image pb-clearfix">' +
                '<div class="pb-column-1">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0" class="pb-img"></div>' +
                '<div class="pb-editable">' +
                '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '<div class="pb-column-2">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '<div class="pb-editable">' +
                '<h2 style="font-size: 30px;  line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'image-caption-1') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"1", "position":"2", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--image-caption-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-image-caption-1 pb-clearfix">' +
                '<div class="pb-column-1">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '</div>' +
                '<div class="pb-column-2">' +
                '<div class="pb-editable">' +
                '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'image-caption-2') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"1", "position":"0", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--image-caption-2' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-image-caption-2 pb-clearfix">' +
                '<div class="pb-column-1">' +
                '<div class="pb-editable">' +
                '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '<div class="pb-column-2">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'two-text-columns') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"0", "position":"0", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--two-text-columns' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-two-text-columns pb-clearfix">' +
                '<div class="pb-editable">' +
                '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '</div>' +
                '<div class="pb-column-1">' +
                '<div class="pb-editable">' +
                '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h4>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '<div class="pb-column-2">' +
                '<div class="pb-editable">' +
                '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h4>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'columns-caption') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"2", "position":"0", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--columns-caption' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-columns-caption">' +
                '<div class="pb-editable pb-columns-caption__top-text">' +
                '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h2>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '<div class="pb-wrap-columns pb-clearfix">' +
                '<div class="pb-column-1">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '<div class="pb-editable">' +
                '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h4>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '<div class="pb-column-2">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '<div class="pb-editable">' +
                '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">Some Header</h4>' +
                '<div>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'button') {
            dataJson = '{"buttonText":"Make Your Purchase","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"None","borderColor":"None","borderType":"None","radius":"None","paddingX":"None","paddingY":"None", "width":"100%","maxWidth":"250px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"15px", "paddingBottom":"15px"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--button' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn">Make Your Purchase</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'divider') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"","borderWidth":1,"borderColor":"#cccccc","borderType":"Solid", "width":"100%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"15px", "paddingBottom":"15px"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--divider' data-type='" + type + "' data-json='" + dataJson + "' style='padding-top: 15px; padding-bottom: 15px; background-color: #ffffff;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-divider" style="border-top-color: #cccccc; border-top-width: 1px; border-top-style: solid;"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'code') {
            dataJson = '';
            html = "<div class='pb-widget pb-widget--init pb-widget--code pb-widget--code-none' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content"><div class="pb-code-box"></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'social-share') {
            dataJson = '{"containerBackground":"#ffffff", "backgroundImageUrl":"", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#fafafa", "btnBorderType":"Solid", "btnBorderWidth":"1", "btnBorderColor":"#cccccc", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"Normal", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "layout": "1", "contentToShare":"1", "shareCustomUrl":"0", "shareLink":"%%webversion_url_encoded%%", "shareDesc":"", "backgroundColor": "#ffffff", "background_transparent": 1}';
            var masSocialText = ['Share', 'Tweet', 'Share'];
            var masSocialLink = ['http://www.facebook.com/sharer/sharer.php?u=', 'http://twitter.com/intent/tweet?text=', 'http://www.linkedin.com/shareArticle?url='];

            html = "<div class='pb-widget pb-widget--init pb-widget--social-share' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-social-btns pb-social-btns--share">' +
                '<div class="pb-social-btns__table"><div class="pb-social-btns__row">' +
                '<div class="pb-wrap-social-btn" data-type-social="0"><a href="' + masSocialLink[0] + "%%webversion_url_encoded%%" + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/black/fb.png" alt=""/></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[0] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="1"><a href="' + masSocialLink[1] + "%%webversion_url_encoded%%" + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/black/tw.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[1] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="2"><a href="' + masSocialLink[2] + "%%webversion_url_encoded%%" + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/black/in.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[2] + '</span>' +
                '</a></div>' +
                '</div></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'social-follow') {
            dataJson = '{"containerBackground":"#ffffff", "backgroundImageUrl":"", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#ffffff", "btnBorderType":"None", "btnBorderWidth":"0", "btnBorderColor":"#ffffff", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"Normal", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "display":"0", "layout": "2", "contentToShare":"0", "shareCustomUrl":"0", "shareLink":"", "shareDesc":"", "backgroundColor": "#ffffff", "background_transparent": 1}';
            var masSocialText = ['Facebook', 'Twitter', 'LinkedIn'];
            var masSocialLink = ['http://www.facebook.com/', 'http://www.twitter.com/', 'http://www.linkedin.com/'];

            html = "<div class='pb-widget pb-widget--init pb-widget--social-follow' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-social-btns pb-social-btns--icn-only pb-social-btns--follow" style="background: #fffff; border-color: #ffffff;">' +
                '<div class="pb-social-btns__table"><div class="pb-social-btns__row">' +
                '<div class="pb-wrap-social-btn" data-type-social="0"><a href="' + masSocialLink[0] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/black/fb.png" alt=""/></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[0] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="1"><a href="' + masSocialLink[1] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/black/tw.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[1] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="2"><a href="' + masSocialLink[2] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/black/in.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[2] + '</span>' +
                '</a></div>' +
                '</div></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'calendar') {
            dataJson = '{"containerBackground":"#ffffff", "backgroundImageUrl":"", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#ffffff", "btnBorderType":"None", "btnBorderWidth":"0", "btnBorderColor":"#ffffff", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"Normal", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "display":"0", "layout": "2", "contentToShare":"0", "shareCustomUrl":"0", "shareLink":"", "shareDesc":"", "backgroundColor": "#ffffff", "background_transparent": 1}';
            var masSocialText = ['Google Calendar', 'Outlook', 'Yahoo! Calendar'];
            var masSocialLink = ['#', '#', '#'];

            html = "<div class='pb-widget pb-widget--init pb-widget--calendar' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-social-btns pb-social-btns--icn-only pb-social-btns--calendar">' +
                '<div class="pb-social-btns__table"><div class="pb-social-btns__row">' +
                '<div class="pb-wrap-social-btn" data-type-social="11"><a href="' + masSocialLink[0] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/calendar_btns/black/google.png" alt=""/></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[0] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="12"><a href="' + masSocialLink[1] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/calendar_btns/black/outlook.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[1] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="15"><a href="' + masSocialLink[2] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/calendar_btns/black/yahoo.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[2] + '</span>' +
                '</a></div>' +
                '</div></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'slideshow') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "count":"2", "borderType":"None", "borderWidth":"0", "borderColor":"#333333", "arrowsColor":"#333333", "dotsColor":"#FF982B", "isArrow":"true", "isDots":"true", "height":"300", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--slideshow' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="swiper-container swiper-container-horizontal">' +
                '<div class="swiper-wrapper">' +
                '<div class="swiper-slide swiper-slide--active"><div class="pb-load-image pb-load-image--bg pb-load-image--none"></div></div>' +
                '<div class="swiper-slide"><div class="pb-load-image pb-load-image--bg pb-load-image--none"></div></div>' +
                '</div>' +
                '<div class="swiper-pagination swiper-pagination-bullets"><span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span><span class="swiper-pagination-bullet"></span></div>' +
                '<div class="swiper-button-prev"><svg fill="#333333" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve"> <g> <g> <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12 C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084 c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864 l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>' +
                '<div class="swiper-button-next"><svg fill="#333333" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve"> <g> <g> <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12 c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028 c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265 c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'vertical-slideshow') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "count":"2", "borderType":"None", "borderWidth":"0", "borderColor":"#333333", "arrowsColor":"#333333", "dotsColor":"#FF982B", "isArrow":"true", "isDots":"true", "height":"300", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--slideshow' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="swiper-container swiper-container-vertical">' +
                '<div class="swiper-wrapper">' +
                '<div class="swiper-slide swiper-slide--active"><div class="pb-load-image pb-load-image--bg pb-load-image--none"></div></div>' +
                '<div class="swiper-slide"><div class="pb-load-image pb-load-image--bg pb-load-image--none"></div></div>' +
                '</div>' +
                '<div class="swiper-pagination swiper-pagination-bullets"><span class="swiper-pagination-bullet swiper-pagination-bullet-active"></span><span class="swiper-pagination-bullet"></span></div>' +
                '<div class="swiper-button-prev"><svg fill="#333333" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492 492" style="enable-background:new 0 0 492 492;" xml:space="preserve"> <g> <g> <path d="M198.608,246.104L382.664,62.04c5.068-5.056,7.856-11.816,7.856-19.024c0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12 C361.476,2.792,354.712,0,347.504,0s-13.964,2.792-19.028,7.864L109.328,227.008c-5.084,5.08-7.868,11.868-7.848,19.084 c-0.02,7.248,2.76,14.028,7.848,19.112l218.944,218.932c5.064,5.072,11.82,7.864,19.032,7.864c7.208,0,13.964-2.792,19.032-7.864 l16.124-16.12c10.492-10.492,10.492-27.572,0-38.06L198.608,246.104z"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>' +
                '<div class="swiper-button-next"><svg fill="#333333" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 492.004 492.004" style="enable-background:new 0 0 492.004 492.004;" xml:space="preserve"> <g> <g> <path d="M382.678,226.804L163.73,7.86C158.666,2.792,151.906,0,144.698,0s-13.968,2.792-19.032,7.86l-16.124,16.12 c-10.492,10.504-10.492,27.576,0,38.064L293.398,245.9l-184.06,184.06c-5.064,5.068-7.86,11.824-7.86,19.028 c0,7.212,2.796,13.968,7.86,19.04l16.124,16.116c5.068,5.068,11.824,7.86,19.032,7.86s13.968-2.792,19.032-7.86L382.678,265 c5.076-5.084,7.864-11.872,7.848-19.088C390.542,238.668,387.754,231.884,382.678,226.804z"/> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

        } else if (type === 'vertical-form') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "borderType":"None", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "borderWidth":"0", "borderColor":"#333333", "width":"100%", "radius":"0", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"35px", "paddingBottom":"50px", "background_transparent":1}';
            var dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "30", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto", "maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonBtn = '{"buttonText":"Subscribe Now","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"1","borderColor":"##CC7A23","borderType":"Solid","radius":"None","paddingX":"10","paddingY":"9", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField = '{"placeholder":"Your name", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"name", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField2 = '{"placeholder":"Your email address", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"email", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"275px", "minHeight":"0","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var identifier = this.generate_identifier('vertical-form', 'vertical_form_');
            html = "<div class='pb-widget pb-widget--init pb-widget--vertical-form' data-type='" + type + "' data-json='" + dataJson + "' style='padding-top: 35px; padding-bottom: 50px;'>" +
                '<div class="pb-widget__content pb-form-grid pb-form-contains-widget">' +
                pageBuilder.getWidgetHTMLHelper() +
                pageBuilder.getWidgetHTMLBtnRemove() +

                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "'  style='font-weight: bold; line-height: 125%; font-size: 30px; text-align: center;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Get News in Your Email</div>' +
                '<div><br/></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +


                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' style='width: 275px;' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid ll-lp-form" data-success-message="Thanks for subscribing! We look forward to communicating with you." data-redirect-url="" data-identifier="'+identifier+'">' +


                "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="text" class="pb-txt-field ll-lp-form-name-field" placeholder="Your name"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField2 + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="email" class="pb-txt-field ll-lp-form-email-field" placeholder="Your email address"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--button form-button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 100%; padding: 0;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn pb-btn--full-width ll-lp-form-btn-submit" style="padding: 9px 10px; border-width: 1px; border-color: #CC7A23; border-style: solid;">Subscribe Now</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +


                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

        } else if (type === 'horizontal-form') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "borderType":"None", "borderWidth":"0", "borderColor":"#333333", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "width":"100%", "radius":"0", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"35px", "paddingBottom":"50px", "background_transparent":1}';
            var dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "30", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto", "maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonBtn = '{"buttonText":"Subscribe Now","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"1","borderColor":"##CC7A23","borderType":"Solid","radius":"None","paddingX":"10","paddingY":"9", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField = '{"placeholder":"Your name", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"name", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField2 = '{"placeholder":"Your email address", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"email", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonGrid = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "radius":"0", "width":"90%", "minHeight":"0", "gridSize1": "33", "gridSize2": "34","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';

            var htmlField_1 = "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="text" class="pb-txt-field ll-lp-form-name-field" placeholder="Your name"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

            var htmlField_2 = "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField2 + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="email" class="pb-txt-field ll-lp-form-email-field" placeholder="Your email address"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

            var htmlBtton = "<div class='pb-widget pb-widget--init pb-widget--button form-button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 100%; padding: 0;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn pb-btn--full-width ll-lp-form-btn-submit" style="padding: 9px 10px; border-width: 1px; border-color: #CC7A23; border-style: solid;">Subscribe Now</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

            var identifier = this.generate_identifier('horizontal-form', 'horizontal_form_');
            html = "<div class='pb-widget pb-widget--init pb-widget--horizontal-form' data-type='" + type + "' data-json='" + dataJson + "' style='padding-top: 35px; padding-bottom: 50px;'>" +
                '<div class="pb-widget__content pb-form-grid pb-form-contains-widget">' +
                pageBuilder.getWidgetHTMLHelper() +
                pageBuilder.getWidgetHTMLBtnRemove() +

                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='font-weight: bold; line-height: 125%; font-size: 30px; text-align: center;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Get News in Your Email</div>' +
                '<div><br/></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--three-column-grid' data-type='three-column-grid' data-json='" + dataJsonGrid + "'>" +
                '<div class="pb-layout-grid pb-layout-grid--3 pb-clearfix ll-lp-form" data-success-message="Thanks for subscribing! We look forward to communicating with you." data-redirect-url="" data-identifier="'+identifier+'">' +
                '<div class="pb-layout-grid__cell pb-cell-contains-widget">' + pageBuilder.getWidgetHTMLHelper() + htmlField_1 + '</div>' +
                '<div class="pb-layout-grid__cell pb-cell-contains-widget">' + pageBuilder.getWidgetHTMLHelper() + htmlField_2 + '</div>' +
                '<div class="pb-layout-grid__cell pb-cell-contains-widget">' + pageBuilder.getWidgetHTMLHelper() + htmlBtton + '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('three-column-grid') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        }else if (type === 'icon') {
            var icnHTML = $el.find('.search-results-list-icon').html();
            dataJson = '{"color":"#333333", "height":"auto", "width":"80px", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--icon' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' + icnHTML + '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-1') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"15px", "marginTop":"0", "marginBottom":"0"}';
            //dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0, "marginBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonBtn = '{"buttonText":"Let&#39;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //SVG
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--logo pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSVG + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 15px; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)"  class="pb-svg-fill" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-header-items--right pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                //Button
                "<div class='pb-widget ui-widget-disabled pb-widget--init pb-widget--button pb-widget--button-inline' data-type='button' data-json='" + dataJsonBtn + "' style='margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: auto; padding: 0; max-width: 160px; width: auto;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn" style="padding: 10px 20px; border-width: 0;">Let&#39;s Go!</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Button
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-2') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "24", "color":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "lineHeight": "150", "textAlign":"None", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"2px", "marginBottom":"2px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonBtn = '{"buttonText":"Let&#39;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding:10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "' style=''>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //Text
                "<div class='pb-widget pb-widget--no-remove pb-widget--logo pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='margin-bottom: 2px; margin-top: 2px; font-size: 24px; line-height: 150%; color: #"+LL_INSTANCE_DEFAULT_THEME_COLOR+"; font-weight: bold;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Text Logo</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END TExt
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-header-items--right pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                //Button
                "<div class='pb-widget ui-widget-disabled pb-widget--init pb-widget--button pb-widget--button-inline' data-type='button' data-json='" + dataJsonBtn + "' style='margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: auto; padding: 0; max-width: 160px; width: auto;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn" style="padding: 10px 20px; border-width: 0;">Let&#39;s Go!</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Button
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-3') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding:10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--logo pb-widget--logo-right pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSVG + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)"  class="pb-svg-fill" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-header-items--left pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-4') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-5') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "' style='text-align: center;'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-6') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"2", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding:10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "' style='text-align: right;'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'header-7') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"15px", "marginTop":"0", "marginBottom":"0"}';
            //dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0, "marginBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "strokeColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonBtn = '{"buttonText":"Let&#39;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px", "background_transparent":1}';
            dataImageJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "textAlign":"0", "width":"200px","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent":1}';
            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-7' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "' style='    min-height: 53px;'>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //SVG
                //END SVG
                "<div class='pb-widget pb-widget--init pb-widget--image' data-type='image' data-json='" + dataImageJson + "' style='width: 200px; float: left; height: 52px;'>" +
                '<div class="pb-widget__content" style="height: 53px;">' +
                '<div class="pb-load-image pb-load-image--none" style="background-size: 70px; min-height: 50px; height: 52px; border: none; background-position: 50%;"><img src="" class="pb-img"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('image') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-header-items--right pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Three</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-item') +
                '</a>' +
                //Button
                "<div class='pb-widget ui-widget-disabled pb-widget--init pb-widget--button pb-widget--button-inline' data-type='button' data-json='" + dataJsonBtn + "' style='margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: auto; padding: 0; max-width: 160px; width: auto;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn" style="padding: 10px 20px; border-width: 0;">Let&#39;s Go!</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Button
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'footer-7') {
            dataJson = '{"backgroundColor": "#e1e1e1", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"110px", "paddingBottom":"120px", "background_transparent": 0}';
            dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "36", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent" :1}';
            dataJsonText2 = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "20", "color":"#636363", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"20px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "background_transparent" :1}';
            dataJsonBtn = '{"buttonText":"hello@info.com","url":"mailto:hello@info.com","backgroundColor":"#ffffff", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"Bold","fontSize":"16","color":"#333333","borderWidth":"0","borderColor":"#ffffff","borderType":"Solid","radius":"4","paddingX":"30","paddingY":"15", "width":"100%","maxWidth":"200px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"35px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='background-color: rgb(225, 225, 225);'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding: 110px 15px 120px;">' +
                //Text
                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='font-size: 36px; margin-top: 0; line-height: 125%; text-align: center; font-weight: bold; color: #333333;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Questions?</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Text
                //Text
                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText2 + "' style='margin-top: 20px; font-size: 20px; line-height: 125%; text-align: center; color: #636363;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Have any questions or just want to say hi?</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Text
                //Button
                "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 200px; margin-top: 35px;'>" +
                '<div class="pb-widget__content" style="padding: 0;">' +
                '<a href="mailto:hello@info.com" class="pb-btn" style="color: #333333; background-color: #ffffff;font-size: 16px; font-weight: bold; border-width: 0; border-color: #ffffff; border-style: solid; padding: 15px 30px;">hello@info.com</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>'+
                //End Button
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'footer-1') {
            html = '<div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;15px&quot;,&quot;paddingBottom&quot;:&quot;20px&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:0}" style="display: block; width: 100%; max-width: 100%; padding-top: 15px; padding-bottom: 20px; padding-left: 15px; background-color: rgb(255, 255, 255);"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="margin-top: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: left;"><div class="pb-widget__content"><div class="pb-editable"><div>Text Logo<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; line-height: 1.5; color: rgb(51, 51, 51); text-align: left;"><div class="pb-widget__content"><div class="pb-editable"><div>PO Box 1016<br>Allen, Texas 75013-0017<br>United States<br><br>info@business.com<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget pb-blocks--start-sortable"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;2&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: right; margin-top: 0px;"><div class="pb-widget__content" style="padding-right: 15px;"><div class="pb-editable"><div>Follow Us!<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--social-follow" data-type="social-follow" data-json="{&quot;containerBackground&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;containerBorderType&quot;:&quot;None&quot;,&quot;containerBorderWidth&quot;:&quot;0&quot;,&quot;containerBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBackground&quot;:&quot;#ffffff&quot;,&quot;btnBorderType&quot;:&quot;None&quot;,&quot;btnBorderWidth&quot;:&quot;0&quot;,&quot;btnBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBorderRadius&quot;:&quot;5&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;color&quot;:&quot;#505050&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;align&quot;:&quot;2&quot;,&quot;width&quot;:&quot;1&quot;,&quot;styleIcon&quot;:4,&quot;display&quot;:&quot;0&quot;,&quot;layout&quot;:&quot;2&quot;,&quot;contentToShare&quot;:&quot;0&quot;,&quot;shareCustomUrl&quot;:&quot;0&quot;,&quot;shareLink&quot;:&quot;&quot;,&quot;shareDesc&quot;:&quot;&quot;,&quot;background_transparent&quot;:1}" style="text-align: right;"><div class="pb-widget__content"><div class="pb-social-btns pb-social-btns--icn-only pb-social-btns--follow" style="background: #fffff; border-color: #ffffff;"><div class="pb-social-btns__table"><div class="pb-social-btns__row"><div class="pb-wrap-social-btn" data-type-social="0"><a href="http://www.facebook.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/gray/fb.png" alt=""></span><span class="pb-social-btn__text">Facebook</span></a></div><div class="pb-wrap-social-btn" data-type-social="1"><a href="http://www.twitter.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/gray/tw.png" alt=""></span><span class="pb-social-btn__text">Twitter</span></a></div><div class="pb-wrap-social-btn" data-type-social="2"><a href="http://www.linkedin.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/gray/in.png" alt=""></span><span class="pb-social-btn__text">LinkedIn</span></a></div></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Social Follow</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'footer-2') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;25px&quot;,&quot;paddingBottom&quot;:&quot;30px&quot;,&quot;background_transparent&quot;:0}" style="background-color: rgb(255, 255, 255); padding-bottom: 30px; padding-top: 25px;"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 1000px;"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;600px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:20,&quot;gridSize2&quot;:20,&quot;numberColumns&quot;:5,&quot;gridSize3&quot;:20,&quot;gridSize4&quot;:20,&quot;background_transparent&quot;:1}" style="width: 100%; max-width: 600px;"><div class="pb-layout-grid pb-clearfix pb-layout-grid--5"><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Help</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Blog</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>About</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Privacy</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Terms</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="display: block; text-align: center; font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; color: rgb(51, 51, 51); margin-top: 15px;"><div class="pb-widget__content" style="padding-top: 0px;"><div class="pb-editable"><div>© 2017 yourcompany<br>All Rights Reserved<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'footer-5') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#232222&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;70px&quot;,&quot;paddingBottom&quot;:&quot;70px&quot;,&quot;background_transparent&quot;:0}" style="background-color: rgb(35, 34, 34); padding-top: 70px; padding-bottom: 70px;"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;: &quot;#ffffff&quot;, &quot;backgroundImageUrl&quot;:&quot;&quot;, &quot;borderWidth&quot;:&quot;0&quot;, &quot;borderColor&quot;:&quot;#ffffff&quot;, &quot;borderType&quot;:&quot;None&quot;, &quot;width&quot;:&quot;90%&quot;, &quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;, &quot;marginLeft&quot;:&quot;auto&quot;, &quot;marginRight&quot;:&quot;auto&quot;, &quot;marginTop&quot;:&quot;0&quot;, &quot;marginBottom&quot;:&quot;0&quot;, &quot;paddingLeft&quot;:&quot;0&quot;, &quot;paddingRight&quot;:&quot;0&quot;, &quot;paddingTop&quot;:&quot;0&quot;, &quot;paddingBottom&quot;:&quot;0&quot;, &quot;gridSize1&quot;: &quot;50&quot;, &quot;gridSize2&quot;: &quot;50&quot;,&quot;background_transparent&quot;:1}" style="display: block;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--container" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;'+LL_APP_HTTPS+'/imgs/page_builder/footers/bg/footer_5.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;200&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/footers/bg/footer_5.jpg&quot;);"><div class="pb-widget__content pb-container-grid" style="min-height: 200px;"></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;5%&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="display: block;"><div class="pb-widget__content pb-container-grid" style="padding-left: 5%;"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="margin-top: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; line-height: 1.5; color: rgb(255, 255, 255); text-align: left; display: block;"><div class="pb-widget__content" style="padding-left: 15px;"><div class="pb-editable"><div>Follow Us!<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;10px&quot;,&quot;marginBottom&quot;:&quot;3px&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1,&quot;background_transparent&quot;:1}" style="color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; line-height: 1.5; text-align: left; margin-top: 10px; display: block; margin-bottom: 3px;"><div class="pb-widget__content" style="padding-left: 15px;"><div class="pb-editable"><div>Provide you accurate and live campaign. Scale your infastructure with our simple service. Provide you accurate and live campaign.<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--social-follow" data-type="social-follow" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;containerBorderType&quot;:&quot;None&quot;,&quot;containerBorderWidth&quot;:&quot;0&quot;,&quot;containerBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBackground&quot;:&quot;#ffffff&quot;,&quot;btnBorderType&quot;:&quot;None&quot;,&quot;btnBorderWidth&quot;:&quot;0&quot;,&quot;btnBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBorderRadius&quot;:&quot;5&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;color&quot;:&quot;#505050&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;align&quot;:&quot;0&quot;,&quot;width&quot;:&quot;1&quot;,&quot;styleIcon&quot;:5,&quot;display&quot;:&quot;0&quot;,&quot;layout&quot;:2,&quot;contentToShare&quot;:&quot;0&quot;,&quot;shareCustomUrl&quot;:&quot;0&quot;,&quot;shareLink&quot;:&quot;&quot;,&quot;shareDesc&quot;:&quot;&quot;,&quot;background_transparent&quot;:1}"><div class="pb-widget__content"><div class="pb-social-btns pb-social-btns--follow pb-social-btns--icn-only" style="background: #fffff; border-color: #ffffff;"><div class="pb-social-btns__table"><div class="pb-social-btns__row"><div class="pb-wrap-social-btn" data-type-social="0"><a href="http://www.facebook.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/white/fb.png" alt=""></span><span class="pb-social-btn__text">Facebook</span></a></div><div class="pb-wrap-social-btn" data-type-social="1"><a href="http://www.twitter.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/white/tw.png" alt=""></span><span class="pb-social-btn__text">Twitter</span></a></div><div class="pb-wrap-social-btn" data-type-social="2"><a href="http://www.linkedin.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/white/in.png" alt=""></span><span class="pb-social-btn__text">LinkedIn</span></a></div></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Social Follow</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;2px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; color: rgb(255, 255, 255); text-align: left; margin-top: 2px;"><div class="pb-widget__content" style="padding-left: 15px;"><div class="pb-editable"><div>info@business.com<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'footer-6') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/footers/bg/footer_6.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;90px&quot;,&quot;paddingBottom&quot;:&quot;50px&quot;,&quot;background_transparent&quot;:1}" style="background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/footers/bg/footer_6.jpg&quot;); padding: 90px 15px 50px;"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="margin-top: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.5; margin-bottom: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Contact Us</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;15px&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-weight: normal; font-family: Arial, sans-serif; font-size: 20px; text-align: center; color: rgb(255, 255, 255); margin-bottom: 15px; margin-top: 15px;"><div class="pb-widget__content"><div class="pb-editable"><div>Have any questions or just want to say hi?</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--social-follow" data-type="social-follow" data-json="{&quot;containerBackground&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;containerBorderType&quot;:&quot;None&quot;,&quot;containerBorderWidth&quot;:&quot;0&quot;,&quot;containerBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBackground&quot;:&quot;#ffffff&quot;,&quot;btnBorderType&quot;:&quot;None&quot;,&quot;btnBorderWidth&quot;:&quot;0&quot;,&quot;btnBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBorderRadius&quot;:&quot;5&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;color&quot;:&quot;#505050&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;align&quot;:&quot;1&quot;,&quot;width&quot;:&quot;1&quot;,&quot;styleIcon&quot;:5,&quot;display&quot;:&quot;0&quot;,&quot;layout&quot;:3,&quot;contentToShare&quot;:&quot;0&quot;,&quot;shareCustomUrl&quot;:&quot;0&quot;,&quot;shareLink&quot;:&quot;&quot;,&quot;shareDesc&quot;:&quot;&quot;,&quot;background_transparent&quot;:1}" style="text-align: center;"><div class="pb-widget__content"><div class="pb-social-btns pb-social-btns--follow pb-social-btns--icn-large pb-social-btns--icn-only" style="background: #fffff; border-color: #ffffff;"><div class="pb-social-btns__table"><div class="pb-social-btns__row"><div class="pb-wrap-social-btn" data-type-social="0" style="/*! margin-left: 0; */"><a href="http://www.facebook.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/white/fb.png" alt=""></span><span class="pb-social-btn__text">Facebook</span></a></div><div class="pb-wrap-social-btn" data-type-social="1"><a href="http://www.twitter.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/white/tw.png" alt=""></span><span class="pb-social-btn__text">Twitter</span></a></div><div class="pb-wrap-social-btn" data-type-social="2"><a href="http://www.linkedin.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="'+LL_APP_HTTPS+'/imgs/imgs_email_builder/social_btns/white/in.png" alt=""></span><span class="pb-social-btn__text">LinkedIn</span></a></div></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Social Follow</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; color: rgb(255, 255, 255); text-align: center; display: block; margin-top: 50px;"><div class="pb-widget__content"><div class="pb-editable"><div>Write us: yourcompany@gmail.com<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-1') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_1.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;190px&quot;,&quot;paddingBottom&quot;:&quot;230px&quot;,&quot;background_transparent&quot;:1}" style="padding: 190px 15px 230px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_1.jpg&quot;);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;36&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 515px; font-family: Arial, sans-serif; font-weight: bold; font-size: 36px; color: rgb(255, 255, 255); text-align: left; line-height: 1.25; margin-top: 40px; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Service for medium business</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;30px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: left; max-width: 515px; line-height: 1.5; margin-top: 30px; display: block; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Provide you accurate and live campaign. Scale your infrastructure with our simple service. Provide you accurate and live campaign.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;30px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:1}" style="max-width: 330px; margin-left: 0px; margin-right: 0px; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 30px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-2') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_2.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;210px&quot;,&quot;paddingBottom&quot;:&quot;180px&quot;,&quot;background_transparent&quot;:1}" style="padding: 210px 15px 180px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_2.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;510px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 510px; margin-right: 0px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 515px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: left; line-height: 1.25; margin-top: 0px; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Service for&nbsp;small and medium business</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: left; max-width: 515px; line-height: 1.5; margin-top: 40px; display: block; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Provide you accurate and live campaign. Scale your infrastructure with our simple service.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;60px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:1}" style="max-width: 330px; margin-left: 0px; margin-right: 0px; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 60px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-3') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_3.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;260px&quot;,&quot;paddingBottom&quot;:&quot;260px&quot;,&quot;background_transparent&quot;:1}" style="padding-top: 260px; padding-bottom: 260px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_3.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;200&quot;,&quot;height&quot;:&quot;200&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 200px; height: 200px;"><div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-4') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_4.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;245px&quot;,&quot;paddingBottom&quot;:&quot;190px&quot;,&quot;background_transparent&quot;:1}" style="padding: 245px 15px 190px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_4.jpg&quot;);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;780px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 780px; line-height: 1.25; margin-top: 0px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Help Finding Information Online</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;60px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 60px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>The Best Answers</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;70px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:1}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 70px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-5') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_5.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;240px&quot;,&quot;paddingBottom&quot;:&quot;155px&quot;,&quot;background_transparent&quot;:1}" style="padding: 240px 15px 155px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_5.jpg&quot;);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Travelagent India</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;780px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;35px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 780px; line-height: 1.25; margin-top: 35px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>The diseases most commonly seen in travellers are diarrhoea, malaria (if you travel in a malaria-infested area), accidents (when travelling by automobile or swimming), would infections and sexually transmitted diseases.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;45px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:1}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 45px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-6') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_6.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;110px&quot;,&quot;paddingBottom&quot;:&quot;205px&quot;,&quot;background_transparent&quot;:1}" style="padding-top: 110px; padding-left: 15px; padding-right: 15px; padding-bottom: 205px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_6.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;150&quot;,&quot;height&quot;:&quot;150&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 150px; height: 150px;"><div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;30&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;860px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;65px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 30px; color: rgb(255, 255, 255); text-align: center; max-width: 860px; line-height: 1.25; margin-top: 65px;"><div class="pb-widget__content"><div class="pb-editable"><div>Some days a motivational quote can provide a quick pick-me-up for employees and even management.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#5ba7ff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;None&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#5ba7ff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;50&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;12&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;170px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;70px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 170px; margin-top: 70px; display: block; padding: 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(91, 167, 255); border-color: rgb(91, 167, 255); border-radius: 50px; font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; padding-top: 12px; padding-bottom: 12px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-7') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_7.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;100px&quot;,&quot;paddingBottom&quot;:&quot;170px&quot;,&quot;background_transparent&quot;:1}" style="padding: 100px 15px 170px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_7.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;165&quot;,&quot;height&quot;:&quot;165&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 165px; height: 165px;"><div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;75px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 75px;"><div class="pb-widget__content"><div class="pb-editable"><div>Mind Power The Ultimate Success Formula</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;685px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;20px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 685px; line-height: 1.5; margin-top: 20px;"><div class="pb-widget__content"><div class="pb-editable"><div>Some days a motivational quote can provide a quick pick-me-up for employees and even management.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-8') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_8.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;150px&quot;,&quot;paddingBottom&quot;:&quot;115px&quot;,&quot;background_transparent&quot;:1}" style="padding: 150px 15px 115px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_8.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="text-align: center; color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>FROM THIS MOMENT ON</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;680px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;45px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 680px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 45px;"><div class="pb-widget__content"><div class="pb-editable"><div>Bryce Canyon A Stumming Us Travel Destination</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;880px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;30px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 880px; line-height: 1.5; margin-top: 30px;"><div class="pb-widget__content"><div class="pb-editable"><div>One of the best ways to make a great vacation quickly horrible is to choose the wrong accommodations for your tip. There is nothing quite as bad as spending a greate day of vacation + only to come back to a less-grate place to stay for the night.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--image" data-type="image" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;52px&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;65px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="width: 52px; display: block; margin-top: 65px;"><div class="pb-widget__content"><div class="pb-load-image"><img src="'+LL_APP_HTTPS+'/imgs/page_builder/play_btn_big.png" class="pb-img"></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Image</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-9') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_9.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;285px&quot;,&quot;paddingBottom&quot;:&quot;220px&quot;,&quot;background_transparent&quot;:1}" style="padding: 285px 15px 220px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_9.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Cooking For One</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;685px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 685px; line-height: 1.5; margin-top: 40px;"><div class="pb-widget__content"><div class="pb-editable"><div>When it comes to cooking there are few tools that are more versatile in the kitchen than he microwave. This device offers so many functions when it comes to cooking that most people never bother to utilize.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-10') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_10.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;250px&quot;,&quot;paddingBottom&quot;:&quot;160px&quot;,&quot;background_transparent&quot;:1}" style="padding: 250px 15px 160px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_10.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--image" data-type="image" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;90px&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="width: 90px; display: block; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-load-image"><img src="'+LL_APP_HTTPS+'/imgs/page_builder/play_btn_big.png" class="pb-img"></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Image</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 1000px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 50px;"><div class="pb-widget__content"><div class="pb-editable"><div>Help Finding Information Online</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;890px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;25px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 890px; line-height: 1.5; margin-top: 25px;"><div class="pb-widget__content"><div class="pb-editable"><div>Okay, you&#39;ve decided you ti make money with Affiliate Marketing. So, you join some affiliate programs and start submitting free ads to newsletters and free advertising classifieds sites. You&#39;re going to make BIG money now - right?</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-11') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_11.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;490px&quot;,&quot;paddingBottom&quot;:&quot;80px&quot;,&quot;background_transparent&quot;:1}" style="padding: 490px 15px 80px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_11.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 1000px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>From Wetlands To Canals And Dams Amsterdam Is Alive</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;890px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 890px; line-height: 1.5; margin-top: 15px;"><div class="pb-widget__content"><div class="pb-editable"><div>Five Tips Fot Low Cost Holidays</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-12') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_12.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;225px&quot;,&quot;paddingBottom&quot;:&quot;260px&quot;,&quot;background_transparent&quot;:1}" style="padding: 225px 15px 260px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_12.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Popular Uses Of The Internet</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--divider" data-type="divider" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;2&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;Solid&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;300px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;45px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 300px; margin-top: 45px;"><div class="pb-widget__content" style="padding-top: 0px; padding-bottom: 0px; background-color: rgb(255, 255, 255);"><div class="pb-divider" style="border-color: rgb(255, 255, 255); border-top-width: 2px; border-top-style: solid;"></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Divider</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;850px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;45px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 850px; line-height: 1.5; margin-top: 45px;"><div class="pb-widget__content"><div class="pb-editable"><div>According to the research firm Frost &amp; Sullivan, the estimated size of the North American used test and measurement equipment market was $446.4 million in 2004 and is estimated to grow to $654.5 million by 2011.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-13') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_13.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;200px&quot;,&quot;paddingBottom&quot;:&quot;200px&quot;,&quot;background_transparent&quot;:1}" style="padding: 200px 15px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_13.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;84&quot;,&quot;height&quot;:&quot;84&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 84px; height: 84px;"><div class="pb-widget__content pb-svg-box"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;75px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 75px;"><div class="pb-widget__content"><div class="pb-editable"><div>Cheap Romantic Vacations</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;700px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 700px; line-height: 1.5; margin-top: 50px;"><div class="pb-widget__content"><div class="pb-editable"><div>Admit it. Before you took that first cruise, your thoughts about cruise ships and cruise vacations consisted of flashbacks to Love Boat re-runs.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-14') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_14.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;220px&quot;,&quot;paddingBottom&quot;:&quot;210px&quot;,&quot;background_transparent&quot;:1}" style="padding: 220px 15px 210px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_14.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="text-align: center; color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>From This Moment On</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;680px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 680px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 40px;"><div class="pb-widget__content"><div class="pb-editable"><div>Motivational Quotes For Business</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;840px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;25px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 840px; line-height: 1.5; margin-top: 25px;"><div class="pb-widget__content"><div class="pb-editable"><div>Many people feel that there is a limited amount of abundance, wealth, or chances to succeed in life. Furthermore, there is a solid belief that if one person succeeds, another must fail.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-15') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_15.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;60px&quot;,&quot;paddingBottom&quot;:&quot;60px&quot;,&quot;background_transparent&quot;:1}" style="padding: 60px 15px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_15.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;600px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;10px&quot;,&quot;paddingRight&quot;:&quot;10px&quot;,&quot;paddingTop&quot;:&quot;70px&quot;,&quot;paddingBottom&quot;:&quot;50px&quot;,&quot;background_transparent&quot;:0}" style="max-width: 600px; background-color: rgb(255, 255, 255); padding: 70px 10px 50px;"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="text-align: center; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>SKIN TEXTURE CHANGES</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;36&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;480px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;75px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 480px; font-family: Arial, sans-serif; font-weight: bold; font-size: 36px; color: rgb(51, 51, 51); text-align: center; line-height: 1.25; margin-top: 75px;"><div class="pb-widget__content"><div class="pb-editable"><div>The 6 Step Non Surgical Facial Rejuvenation Program</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;480px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;70px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(51, 51, 51); text-align: center; max-width: 480px; line-height: 1.5; margin-top: 70px;"><div class="pb-widget__content"><div class="pb-editable"><div>How di we change from that radiant 16 year old width smooth glowing fresh skin to the 40 someting who is beginning to see her mother looking back at her in the mirror to the 65 year old. Let&#39;s review and clearly understand what these changes are that we must look for, recognize and then take steps to correct.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-16') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_16.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;105px&quot;,&quot;paddingBottom&quot;:&quot;210px&quot;,&quot;background_transparent&quot;:1}" style="max-width: 100%; padding: 105px 15px 210px; background-image: url(&quot;'+LL_APP_HTTPS+'/imgs/page_builder/covers/bg/cover_16.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="text-align: center; color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>CHEAP ROMANTIC VACATIONS</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;185px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 1000px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 185px;"><div class="pb-widget__content"><div class="pb-editable"><div>Life Advice Looking Through A Window</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;870px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 870px; line-height: 1.5; margin-top: 50px; display: block;"><div class="pb-widget__content"><div class="pb-editable"><div>Thinking about overseas adventure travel? Have you put any thought into the best places to go when it comes to overseas adventure travel? wilderness so don&#39;t forget them when you are packing fot your overseas adventure travel.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-17') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-widget--bg-video-loading pb-widget--bg-video-yt pb-container-contains-widget" data-type="container" data-bgVideoYT="bSXQ5Etde2o" data-json="{&quot;bgVideoYT&quot;:&quot;bSXQ5Etde2o&quot;,&quot;backgroundColor&quot;:&quot;#333333&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;245px&quot;,&quot;paddingBottom&quot;:&quot;175px&quot;,&quot;background_transparent&quot;:0}" style="padding: 245px 15px 175px; background-color: rgb(51, 51, 51);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Background Video<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;580px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 580px; line-height: 1.25; margin-top: 50px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>To add background video just simply paste the video link in widget background properties.<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;25px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:1}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 25px;"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small"><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-18') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-widget--bg-video-loading pb-widget--bg-video-vimeo pb-container-contains-widget" data-type="container" data-bgVideoYT="199167955" data-json="{&quot;bgVideoYT&quot;:&quot;199167955&quot;,&quot;backgroundColor&quot;:&quot;#333333&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;245px&quot;,&quot;paddingBottom&quot;:&quot;175px&quot;,&quot;background_transparent&quot;:0}" style="padding: 245px 15px 175px; background-color: rgb(51, 51, 51);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Background Video<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;580px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;background_transparent&quot;:1}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 580px; line-height: 1.25; margin-top: 50px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>To add background video just simply paste the video link in widget background properties.<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;25px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;,&quot;background_transparent&quot;:1}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 25px;"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small"><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&#39;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&#39;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        }
        return html;
    },
    addElement: function ($el) {
        var type = pageBuilder.getTypeElement($el);
        if (!$el.hasClass('pb-widget')) {
            console.log(type);
            switch(type){
                case 'custom-form':
                    pageBuilder.current_custom_form_element = $el;
                    if(LandingPageBuilder.form_id && $('.pb-widget--custom-form').length == 0){
                        LandingPageBuilder.form_id = 0;
                    }
                    if(! LandingPageBuilder.form_id && !$('#pb-template .pb-widget[data-type="custom-form"]').length){
                        $el.hide();
                        LandingPageBuilder.open_custom_forms_popup();
                    } else {
                        show_error_message("Only one form may be added to your page");
                        pageBuilder.current_custom_form_element.replaceWith('');
                    }
                    break;
                case 'activation':
                    pageBuilder.current_activation_element = $el;
                    $el.hide();
                    LandingPageBuilder.open_activations_popup();
                    break;
                case 'custom-element':
                    pageBuilder.current_custom_element_element = $el;
                    pageBuilder.current_custom_element_element.hide();
                    ll_custom_elements_manager.open_custom_elements_popup(CUSTOM_ELEMENT_FOR_LANDING_PAGE, function (ll_custom_element) {
                        if(typeof ll_custom_element != 'undefined' && ll_custom_element){
                            var $widget = $(ll_custom_element.ll_custom_element_html);
                            var type = $widget.attr('data-type');
                            if((type == 'custom-form' || $widget.find('[data-type="custom-form"]').length) && $('#pb-template .pb-widget[data-type="custom-form"]').length ){
                                show_error_message('Only one form allowed per landing page. This Custom Element contains a form. Either remove the form in this Custom Element or on the landing page and try again.');
                            } else {
                                pageBuilder.current_custom_element_element.replaceWith(ll_custom_element.ll_custom_element_html);
                                pageBuilder.initActionsElements(type);
                                pageBuilder.showHideHelpDragDropBox($('.pb-blocks'));
                                pageBuilder.setNewActionHistory();
                                if (pageBuilder.isNewHistory()) {
                                    pageBuilder.updateHistory();
                                }
                            }
                        } else {
                            show_error_message('Invalid Custom Element');
                            //$(pageBuilder.current_custom_element_element).remove();
                        }
                    }, function () {
                        $(pageBuilder.current_custom_element_element).remove();
                    });
                    break;
                default:
                    $el.replaceWith(pageBuilder.getHTMLElement(type, $el));
                    pageBuilder.initActionsElements(type);
            }
        }
    },

    initActionsElements: function (type) {
        var $el = $('.pb-widget--init');
        $el.each(function () {
            var $this = $(this);
            var idx = pageBuilder.getIdxWidget($this);
            var type = $this.attr('data-type');
            pageBuilder.addIdxWidget($this, idx);
            pageBuilder.addNameWidget($this);
            pageBuilder.addItemTree($this.attr('data-type'), $this.attr('data-idx'), $this.parents('.pb-widget:first, .pb-blocks:first'));
            pageBuilder.widgetTreeIsElements($('.list-widgets > li'));
            if (type === 'image' || type === 'image-group' || type === 'text-column-with-image' || type === 'image-caption-1' || type === 'image-caption-2' || type === 'slideshow'){
                pageBuilder.loadImage();
            }
            if (type === 'text' || type === 'text-column-with-image' || type === 'image-caption-1' || type === 'image-caption-2' || type === 'two-text-columns' || type === 'columns-caption' || type === 'vertical-form' || type === 'horizontal-form') {
                pageBuilder.initEditorInline();
            }
            if (type !== 'svg' && type !== 'field' && type !== 'video' && type !== 'button' && type !== 'code' && type !== 'icon'){
                pageBuilder.dropFreeImages($this);
            }
        });
        $('.pb-widget--init').removeClass('pb-widget--init');
    },
    getIdxWidget: function ($el) {
        var type = $el.attr('data-type');
        if (type === 'vertical-slideshow')
            type = 'slideshow';
        var $elements = null;
        var massIdx = [];
        var isIdx = false;
        var idx = 1;

        $elements = $('.pb-widget--' + type + '[data-idx]');

        if ($elements.length) {
            $elements.each(function () {
                massIdx.push($(this).attr('data-idx'));
            });
            for (var i = 0; i <= massIdx.length; i++) {
                isIdx = massIdx.indexOf(i + 1 + '') != -1;

                if (!isIdx) {
                    idx = i + 1;
                    break;
                }
            }
        }

        return idx;
    },
    addIdxWidget: function ($el, idx) {
        var $text = $el.attr('data-idx', idx).children('.pb-widget__shadow-label:first');
        $text.text($text.text() + ' #' + idx);
    },
    getWidgetHTMLPlaceholder: function () {
        return '<div class="pb-widget__placeholder"></div>';
    },
    getWidgetHTMLHelper: function () {
        return '<div class="pb-helper-drag-drop pb-helper-drag-drop--small">' +
            '<div class="pb-helper-drag-drop__inner">' +
            '<div class="pb-helper-drag-drop__text">Drop your elements here</div>' +
            '</div>' +
            '</div>';
    },
    colorBox: function () {
        $('.color-box').each(function () {
            var color = $(this).attr('data-color-start');
            $(this).colpick({
                colorScheme: 'dark',
                layout: 'hex',
                color: color,
                onSubmit: function (hsb, hex, rgb, el) {
                    console.log(hex);
                    $(el).css('background-color', '#' + hex);
                    $(el).colpickHide();
                    pageBuilder.updateColorElTpl(el, hex);
                }
            }).css('background-color', '#' + color);
        });
    },
    getTypeElement: function ($el) {
        return $el.data('type');
    },
    getWidgetHTMLLabel: function (type, isOnlyText) {
        var labelText = 'Element';
        if (type === 'container') {
            labelText = 'Container';
        } else if (type === 'two-column-grid') {
            labelText = 'Two column grid';
        } else if (type === 'three-column-grid') {
            labelText = 'Three column grid';
        } else if (type === 'uneven-grid') {
            labelText = 'Uneven grid';
        } else if (type === 'text') {
            labelText = 'Text';
        } else if (type === 'image') {
            labelText = 'Image';
        } else if (type === 'image-group') {
            labelText = 'Image Group';
        } else if (type === 'divider') {
            labelText = 'Divider';
        } else if (type === 'svg') {
            labelText = 'SVG';
        } else if (type === 'video') {
            labelText = 'Video';
        } else if (type === 'text-column-with-image') {
            labelText = 'Text Column with Image';
        } else if (type === 'text-column-with-image') {
            labelText = 'Text Column with Image';
        } else if (type === 'image-caption-1') {
            labelText = 'Image Caption';
        } else if (type === 'image-caption-2') {
            labelText = 'Image Caption';
        } else if (type === 'button') {
            labelText = 'Button';
        } else if (type === 'code') {
            labelText = 'Code';
        } else if (type === 'social-share') {
            labelText = 'Social Share';
        } else if (type === 'social-follow') {
            labelText = 'Social Follow';
        } else if (type === 'calendar') {
            labelText = 'Calendar';
        } else if (type === 'slideshow') {
            labelText = 'Slideshow';
        } else if (type === 'vertical-slideshow') {
            labelText = 'Vertical Slideshow';
        } else if (type === 'vertical-form') {
            labelText = 'Vertical Form';
        } else if (type === 'horizontal-form') {
            labelText = 'Horizontal Form';
        } else if (type === 'custom-form') {
            labelText = 'Custom Form';
        } else if (type === 'activation') {
            labelText = 'Activation';
        } else if (type === 'field') {
            labelText = 'Field';
        } else if (type === 'icon') {
            labelText = 'Icon';
        } else if (type === 'nav-items') {
            labelText = 'Nav Items';
        } else if (type === 'nav-item') {
            labelText = 'Item';
        }

        if (isOnlyText)
            return labelText;
        else
            return '<div class="pb-widget__shadow-label">' + labelText + '</div>';
    },
    getWidgetHTMLBtnRemove: function () {
        return '<div class="pb-widget__btn-remove"></div>';
    },
    selectWidget: function ($widget) {
        if (!$widget.hasClass('pb-widget--selected')) {
            pageBuilder.removeSelectedWidget();
            pageBuilder.hidePanelSettings();
            $widget.addClass('pb-widget--selected');
            var type = $widget.attr('data-type');
            var idx = $widget.attr('data-idx');
            var classType = type;
            if (type === 'vertical-slideshow')
                classType = 'slideshow';
            $('.list-widgets__item--selected').removeClass('list-widgets__item--selected');
            $('.list-widgets__item--' + classType + '[data-idx="' + idx + '"]').addClass('list-widgets__item--selected');
            pageBuilder.openPanelSettings($widget);
            pageBuilder.setIndividualOptions($widget);
            pageBuilder.resetActionHistory();
            if(type != 'custom-form'){
                pageBuilder.addBtnClone($widget);
                pageBuilder.appendBtnSettings($widget);
            }
        }
    },
    removeSelectedWidget: function () {
        var $widget = $('.pb-widget--selected');
        var type = $widget.data('type');

        if (type === 'video') {
            pageBuilder.videoBox.setHTML();
        } else if (type === 'code') {
            pageBuilder.codeBox.setHTML();
        } /*else if (type === 'svg') {
            pageBuilder.svgBox.setHTML();
        }*/

        $widget.removeClass('pb-widget--selected');
        $('.list-widgets__item--selected').removeClass('list-widgets__item--selected');

        if (pageBuilder.isNewHistory())
            pageBuilder.updateHistory();
    },
    addBtnClone: function($widget){
        if($widget.children('.pb-widget__btn-clone').length > 0 ){
            if($widget.children('.pb-widget__btn-clone').hasClass('pb-widget__btn-clone_icn')){
                return false;
            } else {
                $widget.children('.pb-widget__btn-clone').addClass('pb-widget__btn-clone_icn')
            }
        }

        $widget.append('<div class="pb-widget__btn-clone pb-widget__btn-clone_icn"></div>');
    },
    appendBtnSettings: function ($widget) {

        if($widget.children('.pb-widget__btn-settings').length > 0 ){
            if($widget.children('.pb-widget__btn-settings').hasClass('pb-widget__btn-settings_icn')){
                return false;
            } else {
                $widget.children('.pb-widget__btn-settings').addClass('pb-widget__btn-settings_icn')
            }
        }

        var _html = '';
        _html += '<div class="pb-widget__btn-settings pb-widget__btn-settings_icn">';
        _html += '	<a href="javascript:void(0);" > <i class="icn"></i></a>';
        _html += '	<ul class="pb-widget__btn-settings-ul">';
        _html += '		<li><a href="javascript:void(0);" class="save-as-custom-elements">Save as Custom Element</a></li>';
        _html += '	</ul>';
        _html += '</div>';

        $($widget).append(_html);
    },
    showHideWidget: function ($el) {
        var type = $el.attr('data-type');
        var idx = $el.attr('data-idx');
        var classType = type;
        if (type === 'vertical-slideshow')
            classType = 'slideshow';
        var $widget = $('.pb-widget--' + classType + '[data-idx="' + idx + '"]');
        $el.toggleClass('list-widgets__item--hide-true');
        $widget.toggleClass('pb-widget--hide');
        if ($widget.hasClass('pb-widget--hide')) {
            pageBuilder.removeSelectedWidget();
            pageBuilder.hidePanelSettings();
            $('.list-widgets__item--selected').removeClass('list-widgets__item--selected');
        }
        pageBuilder.updateHistory();
    },
    lineHeightInEm: function (lineHeight) {
        var em = 1.5;
        if (lineHeight === 100)
            em = 1;
        else if (lineHeight == 125)
            em = 1.25;
        else if (lineHeight == 150)
            em = 1.5;
        else if (lineHeight == 200)
            em = 2;
        return em;
    },
    hidePanelSettings: function () {
        $('.pb-settings-panel:visible').hide();
        pageBuilder.showHideBtnsHistory();
    },
    openPanelSettings: function ($widget) {
        var type = pageBuilder.getTypeElement($widget);
        var $box = $('#pb-panel__' + type);

        if (type === 'social-share' || type === 'social-follow' || type === 'calendar') {
            $box = $('#pb-panel__' + 'social-calendar-btns');
            $box.find('.pb-settings-panel__header-text').text(pageBuilder.getWidgetHTMLLabel(type, true));
        }

        if (type === 'vertical-slideshow' || type === 'slideshow') {
            $box = $('#pb-panel__slideshow');
            $box.find('.pb-settings-panel__header-text').text(pageBuilder.getWidgetHTMLLabel(type, true));
        }

        if (type === 'horizontal-form' || type === 'vertical-form') {
            $box = $('#pb-panel__' + 'vertical-form');
            $box.find('.pb-settings-panel__header-text').text(pageBuilder.getWidgetHTMLLabel(type, true));
        }

        if(type === 'custom-form'){
            $box = $('#pb-panel__' + 'custom-form');
            $box.find('.pb-settings-panel__header-text').text(pageBuilder.getWidgetHTMLLabel(type, true));
        }

        if(type == 'nav-item'){
            $box = $('#pb-panel__nav-item');
            if($('#pb-template').css('max-width') == '100%' || parseInt($('#pb-template').css('max-width')) > 480){
                $box.find('.pb-btn-open-menu').hide();
            } else {
                $box.find('.pb-btn-open-menu').show();
            }
        }

        if(type == 'nav-items'){
            $box = $('#pb-panel__nav-items');
            if($('#pb-template').css('max-width') == '100%' || parseInt($('#pb-template').css('max-width')) > 480){
                $box.find('.pb-btn-open-menu').hide();
            } else {
                $box.find('.pb-btn-open-menu').show();
            }
        }

        $box.find('.pb-tabs-panel__tab:first').trigger('click');
        $box.show();
        pageBuilder.showHideBtnsHistory();
    },
    cloneWidget: function ($widget){
        var $clone = $widget.clone();
        var type = $clone.attr('data-type');

        if($widget.find('[data-type="custom-form"]').length == 0){
            $clone.removeClass('pb-widget--selected ui-droppable').removeAttr('data-idx data-name').addClass('pb-widget--init');
            $clone.find('.ui-droppable').removeClass('ui-droppable');
            $clone.find('.ui-sortable').removeClass('ui-sortable');
            $clone.find('.pb-editable').removeClass('mce-content-body').removeAttr('id contenteditable');
            $clone.find('.pb-widget').removeAttr('data-idx data-name').addClass('pb-widget--init');

            $clone.find('.pb-widget__shadow-label').each(function(){
                var $el = $(this);
                var text = $el.text();
                var newLabelText = text.substr(0, text.indexOf(" #"));

                $el.text(newLabelText);
            });

            //clone Modal
            $clone.find('.pb-widget__content a[modal-id]').each(function(){
                var idModal = $(this).attr('modal-id');
                var newIdModal = new Date().valueOf();
                var $cloneModal = $('#ll-lp-modal-' + idModal).clone();

                $cloneModal.attr('id', 'll-lp-modal-' + newIdModal);
                $(this).attr('modal-id', newIdModal);
                $('#pb-template').append($cloneModal);
            });

            $widget.after($clone);
            pageBuilder.initActionsElements(type);

            if (type === 'container' || type === 'two-column-grid' || type === 'three-column-grid' || type === 'uneven-grid' || type === 'vertical-form' || type === 'horizontal-form')
                pageBuilder.dragDropColumns();
        } else {
            show_error_message('Unable to clone container. Only one form allowed per landing page.');
        }
    },
    removeWidget: function ($el) {
        var type = $el.attr('data-type');
        var idx = $el.attr('data-idx');
        var classType = type;
        if (type === 'vertical-slideshow')
            classType = 'slideshow';

        if ($el.hasClass('pb-widget--no-remove'))
            return false;

        if ($el.hasClass('list-widgets__item') && type === 'nav-item')
            $el = $('.pb-widget--' + classType + '[data-idx="' + idx + '"]');

        if ($el.hasClass('pb-header-items__item')) {
            if (!$el.siblings('.pb-header-items__item').length)
                return false;
            else
                pageBuilder.isNavItem($el);
        }

        if(type == 'custom-form'){
            LandingPageBuilder.form_id = 0;
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            json.variants[LandingPageBuilder.current_variant_id].form_id = 0;
            sessionStorage.setItem('pbHistory', JSON.stringify(json));
        }

        var $widget = $('.pb-widget--' + classType + '[data-idx="' + idx + '"]');
        var isSelected = ($widget.hasClass('pb-widget--selected')) ? true : false;
        var $widgetTreeItem = $('.list-widgets__item--' + classType + '[data-idx="' + idx + '"]');
        var $parentWidgetTreeItem = $widgetTreeItem.parents('.list-widgets__item:first');
        var $parent = $widget.parent();

        if ($widget.length) {
            //remove modal
            $widget.find('.pb-widget__content a[modal-id]').each(function(){
                $('#ll-lp-modal-' + $(this).attr('modal-id')).remove();
            });

            $widget.remove();
            $widgetTreeItem.remove();

            if ($parent.hasClass('pb-layout-grid__cell') || $parent.hasClass('pb-container-grid') || $parent.hasClass('pb-form-grid'))
                pageBuilder.showHideHelpDragDropCell($parent);
            else
                pageBuilder.showHideHelpDragDropBox($parent);

            pageBuilder.widgetTreeIsElementsParent($parentWidgetTreeItem);
            pageBuilder.widgetTreeIsElements($('.list-widgets > li'));

            //if (isSelected)
            pageBuilder.hidePanelSettings();
        }
        $('.pb-editor__column-right > .pb-tabs > .pb-tabs__items > .pb-tabs__item--content').trigger('click');
        pageBuilder.updateHistory();
    },
    showHideHelpDragDropCell: function ($box) {
        var $parent = $box.parent();

        if ($box.children('.pb-widget').length > 0) {
            if ($box.hasClass('pb-container-grid'))
                $parent.addClass('pb-container-contains-widget');
            else if ($box.hasClass('pb-form-grid'))
                $box.addClass('pb-form-contains-widget');
            else
                $box.addClass('pb-cell-contains-widget');
        }
        else {
            if ($box.hasClass('pb-container-grid'))
                $parent.removeClass('pb-container-contains-widget');
            else if ($box.hasClass('pb-form-grid'))
                $box.removeClass('pb-form-contains-widget');
            else
                $box.removeClass('pb-cell-contains-widget');
        }
    },
    showHideHelpDragDropBox: function ($box) {
        var $helpBox = $box.children('.pb-helper-drag-drop');

        if ($box.children('.pb-widget').length > 0)
            $helpBox.hide();
        else
            $helpBox.css('display', '');
    },
    initEditor: function (el){
        tinymce.init({
            selector: el,
            mode : "exact",
            plugins: [
                "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern",
                "autoresize"
            ],
            menubar: false,
            toolbar: 'heading | fontsizeselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link unlink | cfbutton',
            browser_spellcheck: true,
            fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
            toolbar_items_size: 'small',
            forced_root_block: "div",
            force_br_newlines: true,
            force_p_newlines: false,
            autosave_ask_before_unload: false,
            autoresize_bottom_margin: 0,
            min_height: 250,
            height: 250,
            autoresize_min_height: 250,
            autoresize_max_height: 250,
            statusbar: false,
            setup: function (editor) {
                editor.addButton('heading', {
                    type: 'menubutton',
                    text: 'Heading',
                    icon: false,
                    menu: [
                        {
                            text: 'Heading 1', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h1 style="font-size: 36px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h1>');
                            }
                        },
                        {
                            text: 'Heading 2', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h2>');
                            }
                        },
                        {
                            text: 'Heading 3', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h3 style="font-size: 24px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h3>');
                            }
                        },
                        {
                            text: 'Heading 4', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h4>');
                            }
                        },
                        {
                            text: 'Heading 5', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h5 style="font-size: 14px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h5>');
                            }
                        },
                        {
                            text: 'Heading 6', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h6 style="font-size: 13px; line-height: 125%; padding:0; margin: 0;">' + editor.selection.getContent() + '</h6>');
                            }
                        },
                        {
                            text: 'Paragraph', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<p>' + editor.selection.getContent() + '</p>');
                            }
                        }
                    ]
                });
                editor.addButton('cfbutton', {
                    title : 'Fields',
                    text: 'Fields',
                    onclick : function() {
                        pageBuilder.active_html_editor = editor;
                        ll_popup_manager.open('#ll_popup_insert_token')
                    }
                });
                editor.on('blur', function (e) {
                    pageBuilder.setNewActionHistory();
                });
                editor.on('change', function (e) {
                    pageBuilder.setContentModal(editor.getContent());
                    pageBuilder.setNewActionHistory();
                });
            },
            init_instance_callback: function (editor){
                editor.is_initiatlized = true;
            }
        });
    },
    initEditorInline: function () {
        tinymce.init({
            selector: '.pb-editable',
            inline: true,
            plugins: [
                "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern",
                "autoresize"
            ],
            menubar: false,
            toolbar: 'heading | fontsizeselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link unlink | cfbutton',
            browser_spellcheck: true,
            fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
            toolbar_items_size: 'small',
            forced_root_block: "div",
            force_br_newlines: true,
            force_p_newlines: false,
            autosave_ask_before_unload: false,
            setup: function (editor) {
                editor.addButton('heading', {
                    type: 'menubutton',
                    text: 'Heading',
                    icon: false,
                    menu: [
                        {
                            text: 'Heading 1', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h1 style="font-size: 36px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h1>');
                            }
                        },
                        {
                            text: 'Heading 2', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h2>');
                            }
                        },
                        {
                            text: 'Heading 3', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h3 style="font-size: 24px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h3>');
                            }
                        },
                        {
                            text: 'Heading 4', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h4>');
                            }
                        },
                        {
                            text: 'Heading 5', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h5 style="font-size: 14px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h5>');
                            }
                        },
                        {
                            text: 'Heading 6', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<h6 style="font-size: 13px; line-height: 125%; padding:0; margin: 0;">' + editor.selection.getContent() + '</h6>');
                            }
                        },
                        {
                            text: 'Paragraph', onclick: function () {
                                editor.execCommand('mceInsertTemplate', false, '<p>' + editor.selection.getContent() + '</p>');
                            }
                        }
                    ]
                });
                // Add a custom field button
                editor.addButton('cfbutton', {
                    title : 'Fields',
                    text: 'Fields',
                    onclick : function() {
                        //javascript: ShowCustomFields('html', 'myDevEditControl', '%%PAGE%%'); return false;
                        pageBuilder.active_html_editor = editor;
                        ll_popup_manager.open('#ll_popup_insert_token')
                    }
                });
                editor.on('init', function (e) {
                    tinymce.get(editor.id).hide();
                });
                editor.on('blur', function (e) {
                    pageBuilder.disabledEditorInline($('#' + e.target.id), editor.id);
                    if (editor.changeHistory) {
                        editor.changeHistory = false;
                        pageBuilder.updateHistory();
                    }
                });
                editor.on('change', function (e) {
                    editor.changeHistory = true;
                });
            },
            init_instance_callback: function (editor){
                editor.is_initiatlized = true;
            }
        });
    },
    showHideEditorInline: function ($editor) {
        var $box = $editor.parents('.pb-widget');
        var idEditor = $editor.attr('id');
        var editor = tinymce.get(idEditor)

        if (typeof editor != 'undefined' && editor && typeof editor.is_initiatlized != 'undefined' && editor.is_initiatlized) {
            if (!$box.hasClass('ui-widget-disabled')) {
                $box.addClass('ui-widget-disabled');
                tinymce.get(idEditor).show();
                tinymce.get(idEditor).focus();
            }
        }
    },
    disabledEditorInline: function ($editor, idEditor) {
        var $box = $editor.parents('.pb-widget');
        $box.removeClass('ui-widget-disabled');
        tinymce.get(idEditor).hide();

    },
    initGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        if (!opt) return false;

        $tpl.css({
            backgroundColor: opt.backgroundColor,
            backgroundImahe: 'url("' + opt.backgroundImageUrl + '")',
            fontSize: opt.fontSize + 'px',
            lineHeight: pageBuilder.lineHeightInEm(opt.lineHeight),
            color: opt.color,
            fontWeight: opt.fontWeight,
        });

        if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
            $tpl.css({
                fontFamily: opt.fontTypeFace
            });
        } else {
            $tpl.css({
                fontFamily: opt.fontTypeFace + ', sans-serif'
            });
        }

        pageBuilder.setGlobalOptions();
        pageBuilder.updateGlobalOptions();
    },
    setGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        /*Background Box */
        $('#templateBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);

        if (opt.backgroundImageUrl === '') {
            $(".pb-box-btn-upload-bg-image--global").addClass('pb-box-btn-upload-bg-image--none');
        } else {
            $(".pb-box-btn-upload-bg-image--global").removeClass('pb-box-btn-upload-bg-image--none');
            $(".pb-box-btn-upload-bg-image--global").find('.pb-unload-bg-image__title').text(pageBuilder.getBgImageName(opt.backgroundImageUrl));
        }
        /*Text*/
        ll_combo_manager.set_selected_value('#templateTypeFace', opt.fontTypeFace);
        ll_combo_manager.set_selected_value('#templateFontWeight', opt.fontWeight);
        ll_combo_manager.set_selected_value('#templateFontSize', opt.fontSize);
        ll_combo_manager.set_selected_value('#templateLineHeight', opt.lineHeight);

        $('#templateColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

        /*Button*/
        $('#btnGlobalBackground').colpickSetColor(opt.btnBackgroundColor, true).css('background-color', opt.btnBackgroundColor);

        ll_combo_manager.set_selected_value('#btnGlobalBorderType', opt.btnBorderType);
        $('#btnGlobalBorderWidth').val(opt.btnBorderWidth);
        $('#btnGlobalBorderColor').colpickSetColor(opt.btnBorderColor, true).css('background-color', opt.btnBorderColor);
        $('#btnGlobalBorderRadius').val(opt.btnBorderRadius);

        ll_combo_manager.set_selected_value('#btnGlobalTypeFace', opt.btnfontTypeFace);
        ll_combo_manager.set_selected_value('#btnGlobalWeight', opt.btnFontWeight);
        ll_combo_manager.set_selected_value('#btnGlobalSize', opt.btnFontSize);

        $('#btnGlobalTextColor').colpickSetColor(opt.btnColor, true).css('background-color', opt.btnColor);

        $('#btnGlobalPaddingX').val(opt.btnPaddingX);
        $('#btnGlobalPaddingY').val(opt.btnPaddingY);

        /*Link*/
        $('#linkGlobalColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
        ll_combo_manager.set_selected_value('#linkGlobalWeight', opt.linkWeight);
        ll_combo_manager.set_selected_value('#linkGlobalTextDecoration', opt.linkTextDecoration);
    },
    updateInlineCss: function (box) {
        var sheets = document.styleSheets;
        var css = null;
        var cssBox = null;
        var htmlCss = '';
        var $tpl = null;
        var opt = null;

        if (box === "button") {
            for (var i in sheets) {
                if (sheets[i].ownerNode) {
                    if (sheets[i].ownerNode.id === 'stylesheet_pbGlobalBtnCss') {
                        css = sheets[i].cssRules;
                    }
                }
            }

            $tpl = $('#pb-template');
            opt = $tpl.data('json');
            var btnWeight = 'normal';
            cssBox = css[0];

            if (opt.btnFontWeight == '1') btnWeight = 'bold';

            cssBox.style.backgroundColor = opt.btnBackgroundColor;
            cssBox.style.borderWidth = opt.btnBorderWidth + 'px';
            cssBox.style.borderStyle = opt.btnBorderType;
            cssBox.style.borderColor = opt.btnBorderColor;
            cssBox.style.fontSize = opt.btnFontSize + 'px';
            cssBox.style.fontWeight = opt.btnFontWeight;
            cssBox.style.color = opt.btnColor;
            cssBox.style.padding = opt.btnPaddingY + 'px ' + opt.btnPaddingX + 'px';
            cssBox.style.borderRadius = opt.btnBorderRadius + "px";

            if($.inArray(opt.btnfontTypeFace, STANDARD_FONTS)== -1){
                cssBox.style.fontFamily = opt.btnfontTypeFace;
            } else {
                cssBox.style.fontFamily = opt.btnfontTypeFace + ', sans-serif';
            }

            htmlCss = '<style id="stylesheet_pbGlobalBtnCss">';
            for (var i = 0; i < css.length; i++) {
                htmlCss += css[i].cssText;
            }
            htmlCss += '</style>';
            $('#stylesheet_pbGlobalBtnCss').replaceWith(htmlCss);
        } else if (box === "link") {
            for (var i in sheets) {
                if (sheets[i].ownerNode) {
                    if (sheets[i].ownerNode.id === 'stylesheet_pbGlobalLinkCss') {
                        css = sheets[i].cssRules;
                    }
                }
            }

            $tpl = $('#pb-template');
            opt = $tpl.data('json');
            var linkWeight = 'normal';
            var textDecoration = 'none';
            cssBox = css[0];

            if (opt.linkWeight == 'Bold') linkWeight = 'bold';

            if (opt.linkTextDecoration === '1')
                textDecoration = 'underline';
            else if (opt.linkTextDecoration === '2')
                textDecoration = 'line-through';

            cssBox.style.color = opt.linkColor;
            cssBox.style.fontWeight = linkWeight;
            cssBox.style.textDecoration = textDecoration;

            htmlCss = '<style id="stylesheet_pbGlobalLinkCss">';
            for (var i = 0; i < css.length; i++) {
                htmlCss += css[i].cssText;
            }
            htmlCss += '</style>';
            $('#stylesheet_pbGlobalLinkCss').replaceWith(htmlCss);
        }
    },
    setIndividualOptions: function ($widget) {
        var opt = $widget.data('json');
        var type = $widget.data('type');
        var $tplGlobal = $('#pb-template');
        var optGlobal = $tplGlobal.data('json');

        if (type === 'text') {
            $('#textBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#textTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#textFontWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#textFontSize', opt.fontSize);
            ll_combo_manager.set_selected_value('#textLineHeight', opt.lineHeight);
            $('#textColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#textAlign').find('li').removeClass('pb-text-align--selected');
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__text .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__text .background_transparent', false);
            }
            if (opt.textAlign != "None")
                $('#textAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');
            setSettingCssWidget($('#pb-panel__text'));
            setSettingsBackgroundImage($('#pb-panel__text'));
            setSettingsResponsive($("#pb-panel__text"));
        } else if (type === 'image') {
            $('#imageBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#imageAlign').find('li').removeClass('pb-text-align--selected').eq(opt.textAlign).addClass('pb-text-align--selected');
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image .background_transparent', false);
            }
            pageBuilder.setOptionsImage();

            $('#imageUrl').val(opt.url);
            ll_combo_manager.set_selected_value('select#imageLinkTo', opt.imageLinkto);
            ll_combo_manager.trigger_event_on_change('select#imageLinkTo');

            /*if (opt.iconLinkto == "url"){
                $('#image_view').show();
                ll_combo_manager.set_selected_value('select#imageView', opt.imageView);
                ll_combo_manager.trigger_event_on_change('select#imageView');
            }*/

            setSettingCssWidget($('#pb-panel__image'));
            setSettingsResponsive($("#pb-panel__image"));
        } else if (type === 'image-group') {
            $('#imageGroupBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            pageBuilder.setOptionsLayoutImageGroup();
            pageBuilder.setOptionsImageGroup();
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image-group .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image-group .background_transparent', false);
            }
            setSettingCssWidget($('#pb-panel__image-group'));
            setSettingsBackgroundImage($('#pb-panel__image-group'));
            setSettingsResponsive($("#pb-panel__image-group"));
        } else if (type === 'svg') {
            var html = $widget.find('.pb-load-svg').html();
            //pageBuilder.svgBox.editor.setValue(html);

            $('#svgWidth').val(opt.width);
            $('#svgHeight').val(opt.height);
            $('#svgFillColor').colpickSetColor(opt.fillColor, true).css('background-color', opt.fillColor);
            $('#svgStrokeColor').colpickSetColor(opt.strokeColor, true).css('background-color', opt.strokeColor);

            if (opt.count !== '0') {
                $('.pb-box-btn-upload-svg').removeClass('pb-box-btn-upload-svg--none');
            }else {
                $('.pb-box-btn-upload-svg').addClass('pb-box-btn-upload-svg--none');
            }
            console.log(opt.svg_file_name);
            $('.pb-unload-svg__title').text(opt.svg_file_name);

            setSettingCssWidget($('#pb-panel__svg'));
            setSettingsResponsive($("#pb-panel__svg"));
        } else if (type === 'code') {
            //var html = $widget.find('.pb-code-box').html();
            /*
             * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
             */
            var html = document.getElementsByClassName('pb-widget--selected')[0].getElementsByClassName('pb-code-box')[0].innerHTML;
            pageBuilder.codeBox.editor.setValue(html);
        } else if (type === 'video') {
            var html = $widget.find('.pb-video-box').html();
            pageBuilder.videoBox.editor.setValue(html);
        } else if (type === 'divider') {
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__divider .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__divider .background_transparent', false);
            }
            $('#dividerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);

            ll_combo_manager.set_selected_value('#dividerBorderType', opt.borderType);

            $('#dividerBorderWidth').val(opt.borderWidth);
            $('#dividerBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            setSettingCssWidget($('#pb-panel__divider'));
            setSettingsBackgroundImage($('#pb-panel__divider'));
            setSettingsResponsive($("#pb-panel__divider"));
        } else if (type === 'social-share' || type === 'social-follow' || type === 'calendar') {
            if(typeof opt.containerBackground != 'undefined' && opt.containerBackground){
                $('#socialContainerBackground').colpickSetColor(opt.containerBackground, true).css('background-color', opt.containerBackground);
            }
            if (typeof opt.backgroundColor != 'undefined' && opt.backgroundColor){
                $('#socialContainerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            }
            ll_combo_manager.set_selected_value('#socialContainerBorderType', opt.containerBorderType);
            $('#socialContainerBorderWidth').val(opt.containerBorderWidth);
            $('#socialContainerBorderColor').colpickSetColor(opt.containerBorderColor, true).css('background-color', opt.containerBorderColor);
            $('#socialButtonBackground').colpickSetColor(opt.btnBackground, true).css('background-color', opt.btnBackground);
            ll_combo_manager.set_selected_value('#socialButtonBorderType', opt.btnBorderType);
            $('#socialButtonBorderWidth').val(opt.btnBorderWidth);
            $('#socialButtonBorderColor').colpickSetColor(opt.btnBorderColor, true).css('background-color', opt.btnBorderColor);
            $('#socialButtonBorderRadius').val(opt.btnBorderRadius);
            ll_combo_manager.set_selected_value('#socialButtonTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#socialButtonWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#socialButtonSize', opt.fontSize);
            $('#socialButtonTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            ll_combo_manager.set_selected_value('#socialButtonLineHeight', opt.lineHeight);
            ll_combo_manager.set_selected_value('#socialBtnAlign', opt.align);
            ll_combo_manager.set_selected_value('#socialBtnWidth', opt.width);

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__social-calendar-btns .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__social-calendar-btns .background_transparent', false);
            }

            if (type == 'social-follow' || type == 'calendar') {
                $('.pb-field--social-btn-display').show();
                ll_combo_manager.set_selected_value('#socialBtnDisplay', opt.display);
                $('.pb-list-group-social:not(.custom_meta_data) .pb-list-group-social__fields').hide();
            } else {
                $('.pb-field--social-btn-display').hide();
                $('.pb-list-group-social:not(.custom_meta_data) .pb-list-group-social__fields').show();
            }

            $('.pb-social-style-icn li').eq(opt.styleIcon).addClass('pb-social-style-icn__item--selected').siblings('li').removeClass('pb-social-style-icn__item--selected');

            ll_combo_manager.set_selected_value('#pb-select-content-to-share', opt.shareCustomUrl);

            $('.pb-social-style-icn').find('li img').show();
            $('.pb-wrap-btn-update-calendar-email, .pb-calendar-fields').hide();

            if (opt.contentToShare == '1') {
                $('.pb-content-to-share').show();
                $('.pb-social-style-icn').find('.pb-icn-follow').hide();
                $('.pb-social-style-icn').find('.pb-icn-calendar').hide();
                if (opt.shareCustomUrl == '1') {
                    $('.pb-content-to-share__custom').show();
                    if(opt.shareLink != '%%webversion_url_encoded%%'){
                        $('#shareCustomLink').val(opt.shareLink);
                    }
                    $('#shareShortDesc').val(opt.shareDesc);
                } else {
                    $('.pb-content-to-share__custom').hide();
                }
            } else {
                $('.pb-content-to-share').hide();
                if (type == 'calendar') {
                    $('.pb-social-style-icn').find('li img').hide();
                    $('.pb-social-style-icn').find('.pb-icn-calendar').show();
                    $('.pb-wrap-btn-update-calendar-email, .pb-calendar-fields').show();
                    var event = {
                        organizer_name: $.trim (ll_logedin_user_firstname + ' ' + ll_logedin_user_lastname),
                        organizer_email: $.trim (ll_logedin_user_email),
                        start: '',
                        end: '',
                        timezone: pageBuilder.default_calendar_timezone,
                        location: '',
                        description: ''
                    };
                    if (typeof opt.event != 'undefined' && opt.event) {
                        event = opt.event;
                    }

                    $('input[name="calendar_event_title"]').val(event.title);
                    $('input[name="calendar_event_start_date"]').val(event.start);
                    $('input[name="calendar_event_end_date"]').val(event.end);
                    ll_combo_manager.set_selected_value('select#pb-calendarTimezone', event.timezone);
                    $('input[name="calendar_event_location"]').val(event.location);
                    $('input[name="calendar_event_organizer"]').val(event.organizer_name);
                    $('input[name="calendar_event_email"]').val(event.organizer_email);
                    $('textarea[name="calendar_event_description"]').val(event.description);
                } else {
                    $('.pb-social-style-icn').find('.pb-icn-share').hide();
                    $('.pb-social-style-icn').find('.pb-icn-calendar').hide();
                }
            }
            if (opt.display) {
                $('.pb-layout-social').hide();
                if (opt.display == '0') {
                    $('.pb-layout-social--icn-only').show().find('li').removeClass('pb-layout-social__item--selected').eq(opt.layout).addClass('pb-layout-social__item--selected');
                } else if (opt.display == '1') {
                    $('.pb-layout-social--text-only').show().find('li').removeClass('pb-layout-social__item--selected').eq(opt.layout).addClass('pb-layout-social__item--selected');
                } else {
                    $('.pb-layout-social--icn-text').show().find('li').removeClass('pb-layout-social__item--selected').eq(opt.layout).addClass('pb-layout-social__item--selected');
                }
            } else {
                $('.pb-layout-social').hide();
                $('.pb-layout-social--icn-text-share').show().find('li').removeClass('pb-layout-social__item--selected').eq(opt.layout).addClass('pb-layout-social__item--selected');
            }

            pageBuilder.updateSocialGroupHtml();
            pageBuilder.countGroupSocial();
            setSettingsBackgroundImage($('#pb-panel__social-calendar-btns'));
            setSettingsResponsive($("#pb-panel__social-calendar-btns"));
        } else if (type === 'button') {
            if($widget.hasClass('form-button')){
                $('#button_link_to').hide();
                $('#button_url').hide();
                $('#button_view').hide();
            } else {
                $('#button_link_to').show();
                $('#button_url').show();
                $('#button_view').show();
            }
            var backgroundColor = opt.backgroundColor;
            var borderWidth = opt.borderWidth;
            var borderColor = opt.borderColor;
            var radius = opt.radius;
            var color = opt.color;
            var paddingX = opt.paddingX;
            var paddingY = opt.paddingY;

            if (backgroundColor === "None")
                backgroundColor = optGlobal.btnBackgroundColor;
            if (borderWidth === "None")
                borderWidth = optGlobal.btnBorderWidth;
            if (borderColor === "None")
                borderColor = optGlobal.btnBorderColor;
            if (radius === "None")
                radius = optGlobal.btnBorderRadius;
            if (color === "None")
                color = optGlobal.btnColor;
            if (paddingX === "None")
                paddingX = optGlobal.btnPaddingX;
            if (paddingY === "None")
                paddingY = optGlobal.btnPaddingY;

            $('#btnBackground').colpickSetColor(backgroundColor, true).css('background-color', backgroundColor);
            ll_combo_manager.set_selected_value('#btnBorderType', opt.borderType);
            $('#btnBorderWidth').val(borderWidth);
            $('#btnBorderColor').colpickSetColor(borderColor, true).css('background-color', borderColor);
            $('#btnBorderRadius').val(radius);

            ll_combo_manager.set_selected_value('#btnTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#btnWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#btnSize', opt.fontSize);
            $('#btnTextColor').colpickSetColor(color, true).css('background-color', color);
            $('#btnPaddingX').val(paddingX);
            $('#btnPaddingY').val(paddingY);

            var init_combo = $('select#btnLinkTo').attr('init-combo');
            if (typeof init_combo == 'undefined' || !init_combo) {
                $('select#btnLinkTo').attr('init-combo', 1)
                /*
                ll_combo_manager.make_combo('select#btnLinkTo');
                ll_combo_manager.event_on_change('select#btnLinkTo', function () {
                    console.log('changed');
                    var $tpl = $('.pb-widget--selected');
                    var opt = $tpl.data('json');

                    opt.btnLinkto = ll_combo_manager.get_selected_value('select#btnLinkTo');
                    var url = opt.url;
                    $('label.btn_text').text('Web Address (URL)');
                    if (opt.btnLinkto == 'email') {
                        url = 'mailto:' + opt.url;
                        $('label.btn_text').text('Email Address');
                    }
                    $tpl.find('.pb-btn').attr('href', url);

                    $tpl.attr('data-json', JSON.stringify(opt));
                });
                */
            }

            $('#btnText').val(opt.buttonText);
            $('#btnUrl').val(opt.url);
            ll_combo_manager.set_selected_value('select#btnLinkTo', opt.btnLinkto);
            ll_combo_manager.trigger_event_on_change('select#btnLinkTo');

            setSettingCssWidget($('#pb-panel__button'));
            setSettingsResponsive($("#pb-panel__button"));
            return false;
            //setSettingsBackgroundImage($('#pb-panel__button'));
        } else if (type === 'image-caption-1') {
            pageBuilder.addHTMLImageColumnsList();

            $('#imgCaptionOneBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#imgCaptionOneTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#imgCaptionOneTypeFace").trigger('liszt:updated');

            $('#imgCaptionOneFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#imgCaptionOneFontWeight").trigger('liszt:updated');

            $('#imgCaptionOneFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#imgCaptionOneFontSize").trigger('liszt:updated');

            $('#imgCaptionOneLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#imgCaptionOneLineHeight").trigger('liszt:updated');

            $('#imgCaptionOneColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

            $('#imgCaptionOneAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#imgCaptionOneAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            $('#imgCaptionOneCaptionPosition option[value="' + opt.position + '"]').attr('selected', true);
            $("#imgCaptionOneCaptionPosition").trigger('liszt:updated');

            $('#imgCaptionOneImgAlign option[value="' + opt.imgAlign + '"]').attr('selected', true);
            $("#imgCaptionOneImgAlign").trigger('liszt:updated');

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image-caption-1 .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image-caption-1 .background_transparent', false);
            }

            pageBuilder.sliderImgCaptionOneGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#imgCaptionOneGrid'), [opt.gridSize1]);
            setSettingCssWidget($('#pb-panel__image-caption-1'));
            setSettingsBackgroundImage($('#pb-panel__image-caption-1'));
            setSettingsResponsive($("#pb-panel__image-caption-1"));
        } else if (type === 'image-caption-2') {
            pageBuilder.addHTMLImageColumnsList();

            $('#imgCaptionTwoBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#imgCaptionTwoTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#imgCaptionTwoTypeFace").trigger('liszt:updated');

            $('#imgCaptionTwoFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#imgCaptionTwoFontWeight").trigger('liszt:updated');

            $('#imgCaptionTwoFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#imgCaptionTwoFontSize").trigger('liszt:updated');

            $('#imgCaptionTwoLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#imgCaptionTwoLineHeight").trigger('liszt:updated');

            $('#imgCaptionTwoColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

            $('#imgCaptionTwoAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#imgCaptionTwoAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            $('#imgCaptionTwoCaptionPosition option[value="' + opt.position + '"]').attr('selected', true);
            $("#imgCaptionTwoCaptionPosition").trigger('liszt:updated');

            $('#imgCaptionTwoImgAlign option[value="' + opt.imgAlign + '"]').attr('selected', true);
            $("#imgCaptionTwoImgAlign").trigger('liszt:updated');

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image-caption-2 .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__image-caption-2 .background_transparent', false);
            }

            pageBuilder.sliderImgCaptionTwoGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#imgCaptionTwoGrid'), [opt.gridSize1]);
            pageBuilder.showHideGridSizeColumns();
            setSettingCssWidget($('#pb-panel__image-caption-2'));
            setSettingsBackgroundImage($('#pb-panel__image-caption-2'));
            setSettingsResponsive($("#pb-panel__image-caption-2"));
        } else if (type === 'text-column-with-image') {
            pageBuilder.addHTMLImageColumnsList();

            $('#textColumnsWithImgBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#textColumnsWithImgTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#textColumnsWithImgTypeFace").trigger('liszt:updated');

            $('#textColumnsWithImgFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#textColumnsWithImgFontWeight").trigger('liszt:updated');

            $('#textColumnsWithImgFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#textColumnsWithImgFontSize").trigger('liszt:updated');

            $('#textColumnsWithImgLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#textColumnsWithImgLineHeight").trigger('liszt:updated');

            $('#textColumnsWithImgColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

            $('#textColumnsWithImgAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#textColumnsWithImgAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            $('#textColumnsWithImgImgAlign option[value="' + opt.imgAlign + '"]').attr('selected', true);
            $("#textColumnsWithImgImgAlign").trigger('liszt:updated');

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__text-column-with-image .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__text-column-with-image .background_transparent', false);
            }

            pageBuilder.sliderTextColumnsWithImgGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#textColumnsWithImgGrid'), [opt.gridSize1]);
            pageBuilder.showHideGridSizeColumns();
            setSettingCssWidget($('#pb-panel__text-column-with-image'));
            setSettingsBackgroundImage($('#pb-panel__text-column-with-image'));
            setSettingsResponsive($("#pb-panel__text-column-with-image"));
        } else if (type === 'two-text-columns') {
            $('#twoTextColumnsBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#twoTextColumnsTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#twoTextColumnsTypeFace").trigger('liszt:updated');

            $('#twoTextColumnsFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#twoTextColumnsFontWeight").trigger('liszt:updated');

            $('#twoTextColumnsFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#twoTextColumnsFontSize").trigger('liszt:updated');

            $('#twoTextColumnsLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#twoTextColumnsTwoLineHeight").trigger('liszt:updated');

            $('#twoTextColumnsColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

            $('#twoTextColumnsAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#twoTextColumnsAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__two-text-columns .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__two-text-columns .background_transparent', false);
            }

            pageBuilder.sliderTwoTextColumnsGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#twoTextColumnsGrid'), [opt.gridSize1]);
            setSettingCssWidget($('#pb-panel__two-text-columns'));
            setSettingsBackgroundImage($('#pb-panel__two-text-columns'));
            setSettingsResponsive($("#pb-panel__two-text-columns"));
        } else if (type === 'columns-caption') {
            pageBuilder.addHTMLImageColumnsList();

            $('#columnsCaptionBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#columnsCaptionTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#columnsCaptionTypeFace").trigger('liszt:updated');

            $('#columnsCaptionFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#columnsCaptionFontWeight").trigger('liszt:updated');

            $('#columnsCaptionFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#columnsCaptionFontSize").trigger('liszt:updated');

            $('#columnsCaptionLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#columnsCaptionLineHeight").trigger('liszt:updated');

            $('#columnsCaptionColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

            $('#columnsCaptionAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#columnsCaptionAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            $('#columnsCaptionImgAlign option[value="' + opt.imgAlign + '"]').attr('selected', true);
            $("#columnsCaptionImgAlign").trigger('liszt:updated');

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__columns-caption .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__columns-caption .background_transparent', false);
            }

            pageBuilder.sliderColumnsCaptionGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#columnsCaptionGrid'), [opt.gridSize1]);
            pageBuilder.showHideGridSizeColumns();
            setSettingCssWidget($('#pb-panel__columns-caption'));
            setSettingsBackgroundImage($('#pb-panel__columns-caption'));
            setSettingsResponsive($("#pb-panel__columns-caption"));
        } else if (type === 'slideshow' || type === 'vertical-slideshow') {
            pageBuilder.addHTMLImageGroupList(true);
            $('.pb-list-image--slideshow .pb-image__item:first').trigger('click');
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__slideshow .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__slideshow .background_transparent', false);
            }
            $('#slideshowBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#slideshowBorderType', opt.borderType);
            $("#slideshowBorderWidth").val(opt.borderWidth);
            $('#slideshowBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#slideshowArrowsColor').colpickSetColor(opt.arrowsColor, true).css('background-color', opt.arrowsColor);
            $('#slideshowDotsColor').colpickSetColor(opt.dotsColor, true).css('background-color', opt.dotsColor);

            var isHeightNumber = opt.height.match(/\b(auto)\b|\b[0-9]{1,}(px|\u0025)?/g);

            if (isHeightNumber != null) {
                if (+isHeightNumber) opt.height = opt.height;
            }

            opt.heightTablet = opt.heightTablet || '';
            opt.heightMobile = opt.heightMobile || '';

            $widget.attr('heightdesktop', opt.height);

            $('#slideshowHeight').val(opt.height);
            $('#slideshowHeightTablet').val(opt.heightTablet)
            $('#slideshowHeightMobile').val(opt.heightMobile);

            opt.mode = opt.mode || 'cover';
            opt.positionImage = opt.positionImage || 'centerCenter';

            $('#slideshowMode option[value="' + opt.mode + '"]').attr('selected', true);
            $("#slideshowMode").trigger('liszt:updated');

            $('#slideshowPositionImage option[value="' + opt.positionImage + '"]').attr('selected', true);
            $("#slideshowPositionImage").trigger('liszt:updated');

            setSettingCssWidget($('#pb-panel__slideshow'));
            setSettingsBackgroundImage($('#pb-panel__slideshow'));
            setSettingsResponsive($("#pb-panel__slideshow"));
        } else if (type === 'two-column-grid') {
            var sliderValues = [];

            if (opt.numberColumns === undefined) {
                opt.numberColumns = 2;
                sliderValues = [opt.gridSize1];
            } else {
                sliderValues = pageBuilder.getSliderValues(opt);
            }

            $('#gridNumberColumnsTwo option[value="' + opt.numberColumns + '"]').attr('selected', true);
            $("#gridNumberColumnsTwo").trigger('liszt:updated');
            pageBuilder.sliderGrid('twoGridGrid', sliderValues);
            pageBuilder.setGridSizeColumns($('#twoGridGrid'), sliderValues);
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__two-column-grid .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__two-column-grid .background_transparent', false);
            }
            $('#twoGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#twoGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#twoGridBorderType").trigger('liszt:updated');
            $('#twoGridBorderWidth').val(opt.borderWidth);
            $('#twoGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#twoGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__two-column-grid'));
            setSettingsBackgroundImage($('#pb-panel__two-column-grid'));
            setSettingsResponsive($("#pb-panel__two-column-grid"));
        } else if (type === 'three-column-grid') {
            var sliderValues = [];

            if (opt.numberColumns === undefined) {
                opt.numberColumns = 3;
                sliderValues = [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)];
            } else {
                sliderValues = pageBuilder.getSliderValues(opt);
            }

            $('#gridNumberColumnsThree option[value="' + opt.numberColumns + '"]').attr('selected', true);
            $("#gridNumberColumnsThree").trigger('liszt:updated');
            pageBuilder.sliderGrid('threeGridGrid', sliderValues);
            pageBuilder.setGridSizeColumns($('#threeGridGrid'), sliderValues);
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__three-column-grid .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__three-column-grid .background_transparent', false);
            }
            $('#threeGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#threeGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#threeGridBorderType").trigger('liszt:updated');
            $('#threeGridBorderWidth').val(opt.borderWidth);
            $('#threeGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#threeGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__three-column-grid'));
            setSettingsBackgroundImage($('#pb-panel__three-column-grid'));
            setSettingsResponsive($("#pb-panel__three-column-grid"));
        } else if (type === 'uneven-grid') {
            var sliderValues = [];

            if (opt.numberColumns === undefined) {
                opt.numberColumns = 3;
                sliderValues = [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)];
            } else {
                sliderValues = pageBuilder.getSliderValues(opt);
            }

            $('#gridNumberColumnsUneven option[value="' + opt.numberColumns + '"]').attr('selected', true);
            $("#gridNumberColumnsUneven").trigger('liszt:updated');
            pageBuilder.sliderGrid('unevenGridGrid', sliderValues);
            pageBuilder.setGridSizeColumns($('#unevenGridGrid'), sliderValues);
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__uneven-grid .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__uneven-grid .background_transparent', false);
            }
            $('#unevenGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#unevenGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#unevenGridBorderType").trigger('liszt:updated');
            $('#unevenGridBorderWidth').val(opt.borderWidth);
            $('#unevenGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#unevenGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__uneven-grid'));
            setSettingsBackgroundImage($('#pb-panel__uneven-grid'))
            setSettingsResponsive($("#pb-panel__uneven-grid"));
        } else if (type === 'container') {
            $('#containerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            if (opt.bgVideoYT) {
                $('.pb-bg-video-yt').show().find('#bgVideoYT').val(opt.bgVideoYT);
                if ($widget.hasClass('pb-widget--bg-video-yt')){
                    $('#bgVideoYT').attr('data-default-id', 'bSXQ5Etde2o');
                    $('.pb-bg-video-yt > label').text('Background Video (YouTube Video ID)');
                } else{
                    $('#bgVideoYT').attr('data-default-id', '199167955');
                    $('.pb-bg-video-yt > label').text('Background Video (Vimeo Video ID)');
                }
            } else {
                $('.pb-bg-video-yt').hide();
            }
            ll_combo_manager.set_selected_value('#containerBorderType', opt.borderType);
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__container .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__container .background_transparent', false);
            }
            $('#containerBorderWidth').val(opt.borderWidth);
            $('#containerBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#containerBorderRadius').val(opt.borderRadius);
            $('#containerMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__container'));
            setSettingsBackgroundImage($('#pb-panel__container'));
            setSettingsResponsive($("#pb-panel__container"));
        } else if (type === 'field') {
            if(typeof opt.field_hide != 'undefined' && opt.field_hide == 1){
                $('input[name="field_hide"]').prop('checked', true);
            } else {
                $('input[name="field_hide"]').prop('checked', false);
            }
            $('#fieldPlaceholder').val(opt.placeholder);
            $('#fieldBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#fieldBorderType', opt.borderType);
            $('#fieldBorderWidth').val(opt.borderWidth);
            $('#fieldBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#fieldBorderRadius').val(opt.radius);
            ll_combo_manager.set_selected_value('#fieldTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#fieldFontSize', opt.fontSize);
            $('#fieldTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#fieldPaddingX').val(opt.paddingX);
            $('#fieldPaddingY').val(opt.paddingY);
            ll_combo_manager.set_selected_value('#fieldType', opt.type);
            setSettingCssWidget($('#pb-panel__field'));
            setSettingsResponsive($("#pb-panel__field"));
        } else if (type === 'vertical-form' || type === 'horizontal-form') {
            $('textarea.success_message').val($widget.find('.ll-lp-form').attr('data-success-message'));
            $('input.redirect_url').val($widget.find('.ll-lp-form').attr('data-redirect-url'));
            $('input.form_identifier').val($widget.find('.ll-lp-form').attr('data-identifier'));
            if(! $('input.form_identifier').hasClass('tooltipstered')){
                $('input.form_identifier').attr('title', $widget.find('.ll-lp-form').attr('data-identifier'));
                $('input.form_identifier').addClass('ll_std_tooltip');
                apply_ll_tooltip('#pb-panel__vertical-form #form_identifier');
            } else {
                ll_tooltip_update('#pb-panel__vertical-form #form_identifier input.form_identifier', $widget.find('.ll-lp-form').attr('data-identifier'));
            }
            $('#formBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#formBorderType', opt.borderType);
            $('#formBorderWidth').val(opt.borderWidth);
            $('#formBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#formBorderRadius').val(opt.radius);

            ll_combo_manager.set_selected_value('#formTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#formFontWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#formFontSize', opt.fontSize);
            ll_combo_manager.set_selected_value('#formLineHeight', opt.lineHeight);

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__vertical-form .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__vertical-form .background_transparent', false);
            }

            $('#formColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#formAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#formAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');
            setSettingCssWidget($('#pb-panel__text'));

            setSettingCssWidget($('#pb-panel__vertical-form'));
            setSettingsBackgroundImage($('#pb-panel__vertical-form'));
            setSettingsResponsive($("#pb-panel__vertical-form"));
        } else if (type === 'custom-form'){
            /*$('#formBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#formBorderType', opt.borderType);
            $('#formBorderWidth').val(opt.borderWidth);
            $('#formBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#formBorderRadius').val(opt.radius);

            ll_combo_manager.set_selected_value('#formTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#formFontWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#formFontSize', opt.fontSize);
            ll_combo_manager.set_selected_value('#formLineHeight', opt.lineHeight);

            $('#formColor').colpickSetColor(opt.color, true).css('background-color', opt.backgroundColor);
            $('#formAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#formAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');*/
            setSettingCssWidget($('#pb-panel__text'));
            setSettingCssWidget($('#pb-panel__custom-form'));
            setSettingsBackgroundImage($('#pb-panel__custom-form'));
            setSettingsResponsive($("#pb-panel__custom-form"));
        } else if (type === 'activation'){
            setSettingCssWidget($('#pb-panel__text'));
            setSettingCssWidget($('#pb-panel__activation'));
            setSettingsBackgroundImage($('#pb-panel__activation'));
            setSettingsResponsive($("#pb-panel__activation"));
        }else if (type === 'icon') {
            $('#iconColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#iconHeight').val(opt.height);

            $('#iconUrl').val(opt.url);
            ll_combo_manager.set_selected_value('select#iconLinkTo', opt.iconLinkto);
            ll_combo_manager.trigger_event_on_change('select#iconLinkTo');

            setSettingCssWidget($('#pb-panel__icon'));
            setSettingsResponsive($("#pb-panel__icon"));
        } else if (type === 'nav-items') {
            $('#itemsBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#itemsTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#itemsFontWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#itemsFontSize', opt.fontSize);
            ll_combo_manager.set_selected_value('#itemsLineHeight', opt.lineHeight);
            $('#itemsColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#itemsAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#itemsAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            if ($widget.hasClass('pb-header-items--mobile-show'))
                $('.pb-btn-open-menu').text('Close Menu');
            else
                $('.pb-btn-open-menu').text('Open Menu');

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__nav-items .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__nav-items .background_transparent', false);
            }

            setSettingCssWidget($('#pb-panel__nav-items'));
            setSettingsBackgroundImage($('#pb-panel__nav-items'));
            setSettingsResponsive($("#pb-panel__nav-items"));
        } else if (type === 'nav-item') {
            $('#itemBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            ll_combo_manager.set_selected_value('#itemTypeFace', opt.fontTypeFace);
            ll_combo_manager.set_selected_value('#itemFontWeight', opt.fontWeight);
            ll_combo_manager.set_selected_value('#itemFontSize', opt.fontSize);
            ll_combo_manager.set_selected_value('#itemLineHeight', opt.lineHeight);
            $('#itemColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#itemAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#itemAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            if ($widget.parents('.pb-header-items').hasClass('pb-header-items--mobile-show'))
                $('.pb-btn-open-menu').text('Close Menu');
            else
                $('.pb-btn-open-menu').text('Open Menu');

            $('.pb-field-item-name').val($widget.find('.pb-header-items__item-text').text());
            $('.pb-field-item-link').val($widget.attr('href'));

            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 1){
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__nav-item .background_transparent', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#pb-panel__nav-item .background_transparent', false);
            }

            setSettingCssWidget($('#pb-panel__nav-item'));
            setSettingsBackgroundImage($('#pb-panel__nav-item'));
            setSettingsResponsive($("#pb-panel__nav-item"));
        }
        function setSettingCssWidget($panel) {
            $panel.find('.pb-widget-width').val(opt.width);
            $panel.find('.pb-widget-max-width').val(opt.maxWidth);
            $panel.find('.pb-widget-margin-left').val(opt.marginLeft);
            $panel.find('.pb-widget-margin-right').val(opt.marginRight);
            $panel.find('.pb-widget-margin-top').val(opt.marginTop);
            $panel.find('.pb-widget-margin-bottom').val(opt.marginBottom);
            $panel.find('.pb-widget-padding-left').val(opt.paddingLeft);
            $panel.find('.pb-widget-padding-right').val(opt.paddingRight);
            $panel.find('.pb-widget-padding-top').val(opt.paddingTop);
            $panel.find('.pb-widget-padding-bottom').val(opt.paddingBottom);
        }
        function setSettingsBackgroundImage($panel) {
            if (opt.backgroundImageUrl === '') {
                $panel.find(".pb-box-btn-upload-bg-image").addClass('pb-box-btn-upload-bg-image--none');
            } else {
                $panel.find(".pb-box-btn-upload-bg-image").removeClass('pb-box-btn-upload-bg-image--none');
                $panel.find(".pb-box-btn-upload-bg-image").find('.pb-unload-bg-image__title').text(pageBuilder.getBgImageName(opt.backgroundImageUrl));
            }
        }
        function setSettingsResponsive ($panel){
            if (opt.isDesktop == true || opt.isDesktop == "true" || opt.isDesktop === undefined)
                $panel.find('.switch-isDesktop').val('on').attr('checked', true);
            else
                $panel.find('.switch-isDesktop').val('off').removeAttr('checked');

            if (opt.isTablet == true || opt.isTablet == "true" || opt.isTablet === undefined)
                $panel.find('.switch-isTablet').val('on').attr('checked', true);
            else
                $panel.find('.switch-isTablet').val('off').removeAttr('checked');

            if (opt.isMobile == true || opt.isMobile == "true" || opt.isMobile === undefined)
                $panel.find('.switch-isMobile').val('on').attr('checked', true);
            else
                $panel.find('.switch-isMobile').val('off').removeAttr('checked');

        }
    },
    get_no_of_elements: function(type){
        return $('div.pb-widget[data-type="'+type+'"]').length;
    },
    generate_identifier: function (type, identifier_base){
        var identifier = '';
        var initial_identifier_index = this.get_no_of_elements(type) + 1;
        identifier = identifier_base + initial_identifier_index;
        if($('#'+identifier).length != 0){
            for(var i = initial_identifier_index+1 ; i < 1000; i++){
                if($('#'+identifier_base+i).length == 0){
                    identifier = identifier_base + i;
                    break;
                }
            }
        }
        return identifier;
    },
    set_calendar_control_urls: function (){
        var $tpl  = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        if (typeof opt != 'undefined' && opt && typeof opt.event != 'undefined' && opt.event) {
            var event = opt.event;
            $tpl.find ('.pb-wrap-social-btn a img').each (function (){
                var event_type = '';

                var $img_src = $(this).attr ('src');
                if ($img_src.indexOf ('google.png') != -1) {
                    event_type = 'google';
                } else if ($img_src.indexOf ('outlook.png') != -1) {
                    event_type = 'outlook';
                } else if ($img_src.indexOf ('yahoo.png') != -1) {
                    event_type = 'yahoo';
                } else if ($img_src.indexOf ('icalendar.png') != -1) {
                    event_type = 'ical';
                } else if ($img_src.indexOf ('outlook_online.png') != -1) {
                    event_type = 'outlookonline';
                }
                if (event_type != '') {
                    var event_url = pageBuilder.generate_add_to_calendar_url (event, event_type);
                    console.log(event_url);
                    $(this).closest('a').attr ('href', event_url);
                }
            })
        }
    },
    generate_add_to_calendar_url: function (event, url_type){
        var url = 'http://addtocalendar.com/atc/' + url_type + '?f=m';
        if (typeof event.start != 'undefined' && event.start) {
            url += '&e[0][date_start]=' + event.start
        }
        if (typeof event.end != 'undefined' && event.end) {
            url += '&e[0][date_end]=' + event.end
        }
        if (typeof event.timezone != 'undefined' && event.timezone) {
            url += '&e[0][timezone]=' + event.timezone
        }
        if (typeof event.title != 'undefined' && event.title) {
            url += '&e[0][title]=' + event.title
        }
        if (typeof event.description != 'undefined' && event.description) {
            url += '&e[0][description]=' + encodeURIComponent ( event.description )
        }
        if (typeof event.location != 'undefined' && event.location) {
            url += '&e[0][location]=' + event.location
        }
        if (typeof event.organizer_name != 'undefined' && event.organizer_name) {
            url += '&e[0][organizer]=' + event.organizer_name
        }
        if (typeof event.organizer_email != 'undefined' && event.organizer_email) {
            url += '&e[0][organizer_email]=' + event.organizer_email
        }
        url += '&e[0][privacy]=public';
        return url;
    },
    updateIndividualOptions: function () {
        var $tpl = null;
        var opt = null;
        var type = null;

        function getTplOpt() {
            $tpl = $('.pb-widget--selected');
            opt = $tpl.data('json');
        }

        //Align
        $('.pb-text-align li').on('click', function () {
            getTplOpt();
            var $el = $(this);
            var index = $el.data('indx') + '';
            var cssOption = '';
            var $box = $el.parent();

            $el.addClass('pb-text-align--selected').siblings('li').removeClass('pb-text-align--selected');

            if (index === '1')
                cssOption = 'center';
            else if (index === '2')
                cssOption = 'right';
            else
                cssOption = 'left';

            opt.textAlign = index;
            $tpl.css('text-align', cssOption);

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //Text ||  Image & Caption 1 ||  Image & Caption 2 ||  Text Columns with Image ||  2 Text Columns || Columns Caption || Form
        $('#textTypeFace, #imgCaptionOneTypeFace, #imgCaptionTwoTypeFace, #textColumnsWithImgTypeFace, #twoTextColumnsTypeFace, #columnsCaptionTypeFace, #formTypeFace, #itemsTypeFace, #itemTypeFace').change(function () {
            getTplOpt();
            opt.fontTypeFace = $(this).val();

            if (opt.fontTypeFace === 'None') {
                $tpl.css('font-family', '');
            } else {
                if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                    $tpl.css('font-family', opt.fontTypeFace );
                } else {
                    $tpl.css('font-family', opt.fontTypeFace + ', sans-serif');
                }
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#textFontWeight, #imgCaptionOneFontWeight, #imgCaptionTwoFontWeight, #textColumnsWithImgFontWeight, #twoTextColumnsFontWeight, #columnsCaptionFontWeight, #formFontWeight, #itemsFontWeight, #itemFontWeight').change(function () {
            getTplOpt();
            opt.fontWeight = $(this).val();

            if (opt.fontWeight === 'None')
                $tpl.css('font-weight', '');
            else
                $tpl.css('font-weight', opt.fontWeight);

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#textFontSize, #imgCaptionOneFontSize, #imgCaptionTwoFontSize, #textColumnsWithImgFontSize, #twoTextColumnsFontSize, #columnsCaptionFontSize, #formFontSize, #itemsFontSize, #itemFontSize').change(function () {
            getTplOpt();
            opt.fontSize = $(this).val();

            if (opt.fontSize === 'None')
                $tpl.css('font-size', '');
            else
                $tpl.css('font-size', opt.fontSize + 'px');

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        /*$('#imgCaptionOneLineHeight, #imgCaptionTwoLineHeight, #textColumnsWithImgLineHeight, #twoTextColumnsLineHeight, #columnsCaptionLineHeight, #formLineHeight, #itemsLineHeight, #itemLineHeight').change(function () {
            getTplOpt();
            opt.lineHeight = $(this).val();

            if (opt.lineHeight === 'None')
                $tpl.css('line-height', '');
            else
                $tpl.css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });*/

        ll_combo_manager.event_on_change('select.lineHeight', function(){
            getTplOpt();
            opt.lineHeight = ll_combo_manager.get_selected_value($(this));

            if (opt.lineHeight === 'None') {
                $tpl.css('line-height', '');
            } else {
                $tpl.css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));
                $tpl.find('.pb-editable').css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));
            }

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        ll_combo_manager.event_on_change('select.GlobalLineHeight', function(){
            var $tplGlobal = $('#pb-template');
            var optGlobal = $tplGlobal.data('json');
            optGlobal.lineHeight = ll_combo_manager.get_selected_value('select.GlobalLineHeight');

            if (optGlobal.lineHeight === 'None') {
                $tplGlobal.css('line-height', '');
            } else {
                $tplGlobal.css('line-height', pageBuilder.lineHeightInEm(optGlobal.lineHeight));
                $tplGlobal.find('.pb-editable').css('line-height', pageBuilder.lineHeightInEm(optGlobal.lineHeight));
            }

            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

        //Image
        $('#imageUrl').on('keyup change', function () {
            getTplOpt();
            opt.url = $.trim($(this).val());

            if (opt.url === '') {
                opt.url = '';
                $tpl.find('a').attr('href', '#');
            } else {
                var url = opt.url;
                if(opt.imageLinkto == 'email'){
                    url = 'mailto:'+opt.url;
                }
                $tpl.find('a').attr('href', url);
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //Image Group
        $('#pbImgColumnGroup .pb-image-layout li').on('click', function () {
            getTplOpt();
            opt.layoutIndex = $(this).attr('data-index');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.positionImagesGroup(opt.layoutIndex);
            $(this).addClass('pb-image-layout__item--selected').siblings('li').removeClass('pb-image-layout__item--selected');
            pageBuilder.setNewActionHistory();
        });

        //SVG
        $('#svgWidth').change(function () {
            getTplOpt();
            opt.width = $(this).val();
            $tpl.css('width', opt.width + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#svgHeight').change(function () {
            getTplOpt();
            opt.height = $(this).val();
            $tpl.css('height', opt.height + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //Divider
        $('#dividerBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.find('.pb-divider').css('border-top-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#dividerBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.find('.pb-divider').css('border-top-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //Soacial Buttons + Calendar
        $('#socialBtnAlign').change(function () {
            getTplOpt();

            var val = $(this).val();

            if (val == 0) {
                $tpl.css('text-align', 'left');
            } else if (val == 1) {
                $tpl.css('text-align', 'center');
            } else {
                $tpl.css('text-align', 'right');
            }

            opt.align = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialBtnWidth').change(function () {
            getTplOpt();
            var val = $(this).val();
            var $box = $tpl.find('.pb-social-btns');

            if (val == 0)
                $box.css('display', 'inline-block');
            else
                $box.css('display', '');

            opt.width = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#socialBtnDisplay').change(function () {
            getTplOpt();
            var val = $(this).val();
            var displayOld = opt.display;
            var eqIndex = 0;

            opt.display = val;
            $tpl.attr('data-json', JSON.stringify(opt));

            $('.pb-layout-social').hide();
            if (opt.display == '0') {
                if (displayOld == '2' || displayOld == '0') {
                    eqIndex = opt.layout;
                } else {
                    if (opt.layout == '1') {
                        eqIndex = 2;
                    } else {
                        eqIndex = 1;
                    }
                }
                $('.pb-layout-social--icn-only').show().find('li').eq(eqIndex).trigger('click');
            } else if (opt.display == '1') {
                if (opt.layout == '2' || opt.layout == '3') {
                    eqIndex = 1;
                }
                $('.pb-layout-social--text-only').show().find('li').eq(eqIndex).trigger('click');
            } else {
                if (displayOld == '2' || displayOld == '0') {
                    eqIndex = opt.layout;
                } else {
                    if (opt.layout == '1') {
                        eqIndex = 2;
                    } else {
                        eqIndex = 1;
                    }
                }
                $('.pb-layout-social--icn-text').show().find('li').eq(eqIndex).trigger('click');
            }
            pageBuilder.setNewActionHistory();
        });

        $('.pb-social-style-icn li').on('click', function () {
            getTplOpt();
            var index = $(this).index();
            var $li = $(this);
            var colors = ['black', 'black_border', 'border', 'color', 'gray', 'white'];

            $li.addClass('pb-social-style-icn__item--selected').siblings('li').removeClass('pb-social-style-icn__item--selected');

            $tpl.find('.pb-social-btn__icn').each(function (i) {
                var $img = $(this).find('img');
                var src = $img.attr('src');
                src = src.split('/' + colors[opt.styleIcon] + '/').join('/' + colors[index] + '/');
                $img.attr('src', src);
            });

            opt.styleIcon = index;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialContainerBorderType').change(function () {
            getTplOpt();
            var val = $(this).val();
            opt.containerBorderType = val;

            if (val == 'None') {
                $tpl.find('.pb-social-btns').css('border-style', '');
            } else {
                $tpl.find('.pb-social-btns').css('border-style', opt.containerBorderType.toLowerCase());
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialContainerBorderWidth').on('change', function () {
            getTplOpt();

            opt.containerBorderWidth = $(this).val();
            $tpl.find('.pb-social-btns').css('border-width', opt.containerBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonBorderType').change(function () {
            getTplOpt();
            var val = $(this).val();

            opt.btnBorderType = val;

            if (val == 'None') {
                $tpl.find('.pb-social-btn').css('border-style', '');
            } else {
                $tpl.find('.pb-social-btn').css('border-style', opt.btnBorderType.toLowerCase());
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonBorderWidth').on('change', function () {
            getTplOpt();

            opt.btnBorderWidth = $(this).val();
            $tpl.find('.pb-social-btn').css('border-width', opt.btnBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonBorderRadius').on('change', function () {
            getTplOpt();

            opt.btnBorderRadius = $(this).val();
            $tpl.find('.pb-social-btn').css('border-radius', opt.btnBorderRadius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonTypeFace').change(function () {
            getTplOpt();

            opt.fontTypeFace = $(this).val();

            if (opt.fontTypeFace == "None") {
                $tpl.find('.pb-social-btn').css('font-family', '');
            } else {
                if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                    $tpl.find('.pb-social-btn').css('font-family', opt.fontTypeFace);
                } else {
                    $tpl.find('.pb-social-btn').css('font-family', opt.fontTypeFace + ', sans-serif');
                }
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonWeight').change(function () {
            getTplOpt();

            opt.fontWeight = $(this).val();
            $tpl.find('.pb-social-btn').css('font-weight', opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonSize').change(function () {
            getTplOpt();

            opt.fontSize = $(this).val();
            $tpl.find('.pb-social-btn').css('font-size', opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#socialButtonLineHeight').change(function () {
            getTplOpt();
            var val = $(this).val();

            opt.lineHeight = val;

            if (val == 'None') {
                $tpl.find('.pb-social-btn .pb-social-btn__text').css('line-height', 'normal');
            } else {
                $tpl.find('.pb-social-btn .pb-social-btn__text').css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //Button
        $('#btnBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();

            if (opt.borderType === 'None')
                $tpl.find('.pb-btn').css('border-style', '');
            else
                $tpl.find('.pb-btn').css('border-style', opt.borderType);

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();

            if (opt.borderWidth === '') {
                $tpl.find('.pb-btn').css('border-width', '');
                opt.borderWidth = 'None';
            } else {
                $tpl.find('.pb-btn').css('border-width', opt.borderWidth + 'px');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();

            if (opt.radius === '') {
                $tpl.find('.pb-btn').css('border-radius', '');
                opt.radius = 'None';
            } else {
                $tpl.find('.pb-btn').css('border-radius', opt.radius + 'px');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnTypeFace').change(function () {
            getTplOpt();
            opt.fontTypeFace = $(this).val();

            if (opt.fontTypeFace === 'None') {
                $tpl.find('.pb-btn').css('font-family', '');
            } else {
                if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                    $tpl.find('.pb-btn').css('font-family', opt.fontTypeFace);
                } else {
                    $tpl.find('.pb-btn').css('font-family', opt.fontTypeFace + ', sans-serif');
                }
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnWeight').change(function () {
            getTplOpt();
            opt.fontWeight = $(this).val();

            if (opt.fontWeight === 'None')
                $tpl.find('.pb-btn').css('font-weight', '');
            else
                $tpl.find('.pb-btn').css('font-weight', opt.fontWeight);

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnSize').change(function () {
            getTplOpt();
            opt.fontSize = $(this).val();

            if (opt.fontSize === 'None')
                $tpl.find('.pb-btn').css('font-size', '');
            else
                $tpl.find('.pb-btn').css('font-size', opt.fontSize + 'px');

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnPaddingX').change(function () {
            getTplOpt();
            opt.paddingX = $(this).val();

            if (opt.paddingX === '') {
                $tpl.find('.pb-btn')
                    .css('padding-left', '')
                    .css('padding-right', '');
                opt.paddingX = 'None';
            } else {
                $tpl.find('.pb-btn')
                    .css('padding-left', opt.paddingX + 'px')
                    .css('padding-right', opt.paddingX + 'px');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnPaddingY').change(function () {
            getTplOpt();
            opt.paddingY = $(this).val();

            if (opt.paddingY === '') {
                $tpl.find('.pb-btn')
                    .css('padding-top', '')
                    .css('padding-bottom', '');
                opt.paddingY = 'None';
            } else {
                $tpl.find('.pb-btn')
                    .css('padding-top', opt.paddingY + 'px')
                    .css('padding-bottom', opt.paddingY + 'px');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnText').on('keyup change', function () {
            getTplOpt();
            opt.buttonText = $.trim($(this).val());

            if (opt.buttonText === '') opt.buttonText = 'Make Your Purchase';

            $tpl.find('.pb-btn').text(opt.buttonText);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnUrl').on('keyup change', function () {
            getTplOpt();
            opt.url = $.trim($(this).val());

            if (opt.url === '') {
                opt.url = '';
                $tpl.find('.pb-btn').attr('href', '#');
            } else {
                var url = opt.url;
                if(opt.btnLinkto == 'email'){
                    url = 'mailto:'+opt.url;
                }
                $tpl.find('.pb-btn').attr('href', url);
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //Image & Caption 1
        $('#imgCaptionOneCaptionPosition, #imgCaptionTwoCaptionPosition').change(function () {
            getTplOpt();
            opt.position = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.captionPosition();
            pageBuilder.showHideGridSizeColumns();
            pageBuilder.setNewActionHistory();
        });

        $('#imgCaptionOneImgAlign, #imgCaptionTwoImgAlign, #textColumnsWithImgImgAlign, #twoTextColumnsImgAlign, #columnsCaptionImgAlign').change(function () {
            getTplOpt();
            opt.imgAlign = $(this).val();
            $tpl.find('.pb-load-image').css('text-align', opt.imgAlign);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //slideshow

        $('#slideshowBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#slideshowBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#slideshowHeight').change(function () {
            getTplOpt();
            opt.height = $(this).val();
            $tpl.css('height', opt.height + 'px');
            $tpl.find('.pb-widget__content').css('height', opt.height + 'px');
            $tpl.attr('heightdesktop', opt.height);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#slideshowHeightTablet').change(function () {
            getTplOpt();
            opt.heightTablet = $(this).val();
            $tpl.attr('heighttablet', opt.heightTablet);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#slideshowHeightMobile').change(function () {
            getTplOpt();
            opt.heightMobile = $(this).val();
            $tpl.attr('heightmobile', opt.heightMobile);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#slideshowMode').change(function () {
            getTplOpt();
            opt.mode = $(this).val();

            $tpl.removeClass('coverSize autoSize containSize');
            $tpl.addClass(opt.mode + 'Size');

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#slideshowPositionImage').change(function () {
            getTplOpt();
            opt.positionImage = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            $tpl.removeClass('leftTop leftCenter leftBottom rightTop rightCenter rightBottom centerTop centerCenter centerBottom');
            $tpl.addClass(opt.positionImage);
            pageBuilder.setNewActionHistory();
        });
        //Container
        $('#containerBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#containerBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#containerBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();
            $tpl.css('border-radius', opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#containerMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-container-grid').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        //Grid
        $('#twoGridBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#twoGridBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#twoGridMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        //Three Grid
        $('#threeGridBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#threeGridBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#threeGridMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        // Uneven Grid
        $('#unevenGridBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#unevenGridBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#unevenGridMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        //form
        $('#formBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#formBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#formBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();
            $tpl.css('border-radius', opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        //field
        $('#fieldBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.find('.pb-txt-field').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.find('.pb-txt-field').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();
            $tpl.find('.pb-txt-field').css('border-radius', opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldTypeFace').change(function () {
            getTplOpt();
            opt.fontTypeFace = $(this).val();

            if (opt.fontTypeFace === 'None') {
                $tpl.find('.pb-txt-field').css('font-family', '');
            } else {
                if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                    $tpl.find('.pb-txt-field').css('font-family', opt.fontTypeFace);
                } else {
                    $tpl.find('.pb-txt-field').css('font-family', opt.fontTypeFace + ', sans-serif');
                }
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldFontSize').change(function () {
            getTplOpt();
            opt.fontSize = $(this).val();

            if (opt.fontSize === 'None')
                $tpl.find('.pb-txt-field').css('font-size', '');
            else
                $tpl.find('.pb-txt-field').css('font-size', opt.fontSize + 'px');

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldPaddingX').change(function () {
            getTplOpt();
            opt.paddingX = $(this).val();

            if (opt.paddingX === '') {
                $tpl.find('.pb-txt-field')
                    .css('padding-left', '')
                    .css('padding-right', '');
                opt.paddingX = 'None';
            } else {
                $tpl.find('.pb-txt-field')
                    .css('padding-left', opt.paddingX + 'px')
                    .css('padding-right', opt.paddingX + 'px');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldPaddingY').change(function () {
            getTplOpt();
            opt.paddingY = $(this).val();

            if (opt.paddingY === '') {
                $tpl.find('.pb-txt-field')
                    .css('padding-top', '')
                    .css('padding-bottom', '');
                opt.paddingY = 'None';
            } else {
                $tpl.find('.pb-txt-field')
                    .css('padding-top', opt.paddingY + 'px')
                    .css('padding-bottom', opt.paddingY + 'px');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldPlaceholder').on('keyup  change', function () {
            getTplOpt();
            opt.placeholder = $.trim($(this).val());

            $tpl.find('.pb-txt-field').attr('placeholder', opt.placeholder);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#fieldType').change(function () {
            getTplOpt();
            opt.type = $(this).val();

            $tpl.find('.pb-txt-field').each(function () {
                $('<input class="pb-txt-field" placeholder="' + opt.placeholder + '" type="' + opt.type + '" />').attr({ name: this.name, value: this.value }).insertBefore(this);
            }).remove();

            var fontFamily = '';

            if (opt.fontTypeFace !== 'None') {
                if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                    fontFamily = opt.fontTypeFace ;
                } else {
                    fontFamily = opt.fontTypeFace + ', sans-serif';
                }
            }

            $tpl.find('.pb-txt-field').css({
                backgroundColor: opt.backgroundColor,
                borderStyle: opt.borderType,
                borderWidth: opt.borderWidth + 'px',
                borderColor: opt.borderColor,
                borderRadius: opt.borderRadius + 'px',
                color: opt.color,
                fontFamily: fontFamily,
                fontSize: opt.fontSize + 'px',
                padding: opt.paddingY + 'px ' + opt.paddingX + 'px',
                width: opt.width + '%'
            });

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-width').change(function () {
            getTplOpt();
            opt.width = $(this).val();
            $tpl.css('width', opt.width);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-max-width').change(function () {
            getTplOpt();
            opt.maxWidth = $(this).val();
            $tpl.css('max-width', opt.maxWidth);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-margin-left').change(function () {
            getTplOpt();
            opt.marginLeft = $(this).val();
            $tpl.css('margin-left', opt.marginLeft);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-margin-right').change(function () {
            getTplOpt();
            opt.marginRight = $(this).val();
            $tpl.css('margin-right', opt.marginRight);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-margin-top').change(function () {
            getTplOpt();
            opt.marginTop = $(this).val();
            $tpl.css('margin-top', opt.marginTop);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-margin-bottom').change(function () {
            getTplOpt();
            opt.marginBottom = $(this).val();
            $tpl.css('margin-bottom', opt.marginBottom);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-padding-left').change(function () {
            getTplOpt();
            opt.paddingLeft = $(this).val();

            $tpl.css('padding-left', opt.paddingLeft);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-padding-right').change(function () {
            getTplOpt();
            opt.paddingRight = $(this).val();

            $tpl.css('padding-right', opt.paddingRight);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-padding-top').change(function () {
            getTplOpt();
            opt.paddingTop = $(this).val();

            $tpl.css('padding-top', opt.paddingTop);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-widget-padding-bottom').change(function () {
            getTplOpt();
            opt.paddingBottom = $(this).val();

            $tpl.css('padding-bottom', opt.paddingBottom);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        //ICON
        $('#iconHeight').change(function () {
            getTplOpt();
            opt.height = $(this).val();
            $tpl.css('height', opt.height);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#iconUrl').on('keyup change', function () {
            getTplOpt();
            opt.url = $.trim($(this).val());

            if (opt.url === '') {
                opt.url = '';
                $tpl.find('a').attr('href', '#');
            } else {
                var url = opt.url;
                if(opt.iconLinkto == 'email'){
                    url = 'mailto:'+opt.url;
                }
                $tpl.find('a').attr('href', url);
            }

            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        //BGVIDEO YT
        $('#bgVideoYT').change(function () {
            getTplOpt();
            var $input = $(this);
            var val = $.trim($input.val());

            if(val == ''){
                val = $input.attr('data-default-id');
                $input.val(val);
            }

            opt.bgVideoYT = val;
            $tpl.attr('data-bgvideoyt', opt.bgVideoYT);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        //RESPONSIVE
        $('.switch-isDesktop').change(function(){
            getTplOpt();
            var val = $(this).prop('checked');

            val ? $tpl.removeClass('hideBlockDesktop') : $tpl.addClass('hideBlockDesktop');

            opt.isDesktop = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.switch-isTablet').change(function(){
            getTplOpt();
            var val = $(this).prop('checked');

            val ? $tpl.removeClass('hideBlockTablet') : $tpl.addClass('hideBlockTablet');

            opt.isTablet = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('.switch-isMobile').change(function(){
            getTplOpt();
            var val = $(this).prop('checked');

            val ? $tpl.removeClass('hideBlockMobile') : $tpl.addClass('hideBlockMobile');

            opt.isMobile = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
    },
    updateGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        $('#templateTypeFace').change(function () {
            opt.fontTypeFace = $(this).val();
            if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                $tpl.css('font-family', opt.fontTypeFace);
            } else {
                $tpl.css('font-family', opt.fontTypeFace + ', sans-serif');
            }
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

        $('#templateFontWeight').change(function () {
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight', opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

        $('#templateFontSize').change(function () {
            opt.fontSize = $(this).val();
            $tpl.css('font-size', opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

        $('#templateLineHeight').change(function () {
            opt.lineHeight = $(this).val();
            $tpl.css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

        $('#btnGlobalBorderType').change(function () {
            opt.btnBorderType = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#btnGlobalBorderWidth').change(function () {
            opt.btnBorderWidth = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#btnGlobalBorderRadius').change(function () {
            opt.btnBorderRadius = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#btnGlobalTypeFace').change(function () {
            opt.btnfontTypeFace = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        ll_combo_manager.event_on_change('#btnGlobalWeight', function () {
            opt.btnFontWeight = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#btnGlobalSize').change(function () {
            opt.btnFontSize = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#btnGlobalPaddingX').change(function () {
            opt.btnPaddingX = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#btnGlobalPaddingY').change(function () {
            opt.btnPaddingY = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#linkGlobalWeight').change(function () {
            opt.linkWeight = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('link');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#linkGlobalTextDecoration').change(function () {
            opt.linkTextDecoration = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('link');
            pageBuilder.setNewActionHistory();
            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });

    },
    updateColorElTpl: function (el, hex) {
        var $tpl = $('.pb-widget--selected');
        var $tplGlobal = $('#pb-template');
        var opt = $tpl.data('json');
        var optGlobal = $tplGlobal.data('json');
        var id = $(el).attr('id');

        if (id == 'templateBackground') {
            optGlobal.backgroundColor = '#' + hex;
            $tplGlobal.css('background-color', optGlobal.backgroundColor);
            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
        } else if (id == 'templateColor') {
            optGlobal.color = '#' + hex;
            $tplGlobal.css('color', optGlobal.color);
            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
        } else if(id == 'textColumnsWithImgBackground') {
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'imgCaptionOneBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'imgCaptionTwoBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoTextColumnsBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'columnsCaptionBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        }  else if (id == 'textBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'imageBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        }  else if (id == 'imageGroupBackground'){
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'itemsBackground' || id == 'itemBackground') {
            opt.backgroundColor = '#' + hex;
            if (typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0) {
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'textColor' || id == 'imgCaptionOneColor' || id == 'imgCaptionTwoColor' || id == 'textColumnsWithImgColor' || id == 'twoTextColumnsColor' || id == 'columnsCaptionColor' || id == 'formColor' || id == 'itemsColor' || id == 'itemColor') {
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'svgFillColor') {
            opt.fillColor = '#' + hex;
            if ($tpl.find('.pb-load-svg svg').find('.pb-svg-fill').length) {
                $tpl.find('.pb-load-svg svg').find('.pb-svg-fill').attr('fill', opt.fillColor);
            }else {
                $tpl.find('.pb-load-svg svg').attr('fill', opt.fillColor);
            }
            //pageBuilder.svgBox.setEditorHTML();
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'svgStrokeColor') {
            opt.strokeColor = '#' + hex;
            if ($tpl.find('.pb-load-svg svg').find('.pb-svg-stroke').length) {
                $tpl.find('.pb-load-svg svg').find('.pb-svg-stroke').attr('stroke', opt.strokeColor);
            }else {
                $tpl.find('.pb-load-svg svg').attr('stroke', opt.strokeColor);
            }
            //pageBuilder.svgBox.setEditorHTML();
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'dividerBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'dividerBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.find('.pb-divider').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'socialContainerBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'socialContainerBorderColor') {
            opt.containerBorderColor = '#' + hex;
            $tpl.find('.pb-social-btns').css('border-color', opt.containerBorderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'socialButtonBackground') {
            opt.btnBackground = '#' + hex;
            $tpl.find('.pb-social-btn').css('background-color', opt.btnBackground);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'socialButtonBorderColor') {
            opt.btnBorderColor = '#' + hex;
            $tpl.find('.pb-social-btn').css('border-color', opt.btnBorderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'socialButtonTextColor') {
            opt.color = '#' + hex;
            $tpl.find('.pb-social-btn').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'btnGlobalBackground') {
            optGlobal.btnBackgroundColor = '#' + hex;
            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('button');
        } else if (id == 'btnGlobalBorderColor') {
            optGlobal.btnBorderColor = '#' + hex;
            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('button');
        } else if (id == 'btnGlobalTextColor') {
            optGlobal.btnColor = '#' + hex;
            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('button');
        } else if (id == 'btnBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.find('.pb-btn').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'btnBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.find('.pb-btn').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'btnTextColor') {
            opt.color = '#' + hex;
            $tpl.find('.pb-btn').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'linkGlobalColor') {
            optGlobal.linkColor = '#' + hex;
            $tplGlobal.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('link');
        } else if (id == 'slideshowBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'slideshowBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'slideshowArrowsColor') {
            opt.arrowsColor = '#' + hex;
            $tpl.find('.swiper-button-prev, .swiper-button-next').find('svg').attr('fill', opt.arrowsColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'slideshowDotsColor') {
            opt.dotsColor = '#' + hex;
            $tpl.find('.swiper-pagination-bullet').css('background-color', opt.dotsColor);;
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'containerBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'containerBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoGridBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'threeGridBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'threeGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'unevenGridBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'unevenGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'formBackground') {
            opt.backgroundColor = '#' + hex;
            if(typeof opt.background_transparent == 'undefined' || opt.background_transparent == 0){
                $tpl.css('background-color', opt.backgroundColor);
            }
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'formBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'fieldBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.find('.pb-txt-field').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'fieldBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.find('.pb-txt-field').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'fieldTextColor') {
            opt.color = '#' + hex;
            $tpl.find('.pb-txt-field').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'iconColor') {
            opt.color = '#' + hex;
            $tpl.find('svg path').css('fill', opt.color);
            $tpl.attr('data-json', JSON.stringify(opt));
        }

        pageBuilder.setNewActionHistory();

        if (pageBuilder.isNewHistory())
            pageBuilder.updateHistory();
    },
    setOptionsImageGroup: function () {
        pageBuilder.addHTMLImageGroupList();
    },
    setOptionsLayoutImageGroup: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        $('.pb-image-layout li').removeClass('pb-image-layout__item--selected').hide();
        $('.pb-image-layout li[data-type="' + opt.layout + '"]').show().eq(opt.layoutIndex).addClass('pb-image-layout__item--selected');
    },
    loadImage: function () {
        $('.pb-blocks').off('dblclick.loadImage').on('dblclick.loadImage', '.pb-load-image', function (e) {
            e.stopPropagation();
            var that = $(this);
            pageBuilder.openUploader(function (file) {
                pageBuilder.insertImage(that, false, file);
                pageBuilder.setNewActionHistory();
            });
        });
    },
    loadSvg: function () {
        $('.pb-blocks').on('dblclick', '.pb-load-svg', function () {
            pageBuilder.openUploader(function (){

            }, true);
        });
    },
    insertImage: function ($box, isBrowse, file) {
        var src = file.url + '?v=' + Math.random();
        var $tpl = $('.pb-widget--selected');
        var $list = $('.pb-list-image:visible');
        var indexImg = 0;
        var $imgBoxTpl = null;
        var $imgBoxPanel = null;

        if (isBrowse)
            indexImg = $box.closest('.pb-list-image').find('.pb-image__item').index($box);
        else
            indexImg = $box.closest('.pb-widget__content').find('.pb-load-image').index($box);

        $imgBoxTpl = $tpl.find('.pb-load-image').eq(indexImg);

        if ($imgBoxTpl.hasClass('pb-load-image--bg')) {
            $imgBoxTpl.css('background-image', 'url("' + src + '")');
            $imgBoxTpl.attr('img-src', src);
        } else {
            $imgBoxTpl.find('img.pb-img').attr('src', src);
        }

        $imgBoxTpl.attr('image-inserted-by-media-manager', 1);
        $imgBoxTpl.removeClass('pb-load-image--none');

        if ($list) {
            $imgBoxPanel = $list.find('.pb-image__item').eq(indexImg);
            $imgBoxPanel.find('.pb-image__icn, .pb-image__meta').remove();
            $imgBoxPanel.append(pageBuilder.addHTMLImage($tpl, indexImg, true, file.name, file.meta.width + ' X ' + file.meta.height));
        }
    },
    removeImage: function ($box) {
        var $tpl = $('.pb-widget--selected');
        var indexImg = $box.closest('.pb-list-image').find('.pb-image__item').index($box);
        var $list = $('.pb-list-image:visible');
        var $imgBoxTpl = null;
        var $imgBoxPanel = null;

        $imgBoxTpl = $tpl.find('.pb-load-image').eq(indexImg);

        if ($list) {
            $imgBoxPanel = $list.find('.pb-image__item').eq(indexImg);

            if (($list.hasClass('pb-list-image--group') || $list.hasClass('pb-list-image--slideshow')) && $list.find('.pb-image__item').length > 2) {
                $list.find('.pb-image__item').eq(indexImg).remove();

                if ($list.hasClass('pb-list-image--slideshow')) {
                    $imgBoxTpl.parent().remove();
                } else {
                    $imgBoxTpl.remove();
                }

            } else {
                if ($imgBoxTpl.hasClass('pb-load-image--bg')) {
                    $imgBoxTpl.css('background-image', '');
                } else {
                    $imgBoxTpl.find('img.pb-img').attr('src', '');
                }
                $imgBoxTpl.addClass('pb-load-image--none');
                $imgBoxTpl.removeAttr('image-inserted-by-media-manager');
                $imgBoxPanel.find('.pb-image__icn, .pb-image__meta').remove();
                $imgBoxPanel.append(pageBuilder.addHTMLImage($tpl, indexImg, false));
            }
        }

        if ($list.hasClass('pb-list-image--group')) {
            pageBuilder.setCountImageGroup();
            pageBuilder.setSortIdImageGroup();
        }
        if ($list.hasClass('pb-list-image--slideshow')) {
            pageBuilder.setCountImageListSlideshow();
            pageBuilder.setSortIdImageGroup();
        }
    },
    addHTMLImage: function ($tpl, index, isLinkRemove, file_name, size) {
        var type = $tpl.data('type');
        var html = '';
        var title = (typeof file_name != 'undefined' && file_name) ? file_name : 'Upload an Image';
        var size = (typeof size != 'undefined' && size) ? size : '';
        var $imgBlock = $tpl.find('.pb-load-image').eq(index);
        var urlImg = LL_APP_HTTPS+'/imgs/imgs_email_builder/img_upload.jpg';
        var cssHide = 'pb-image__link--hide';
        var cssHideBrowse = '';
        var cssImageNone = ' pb-image__icn--none';
        var cssHideRemove = 'pb-image__link--hide';

        if (!$imgBlock.hasClass('pb-load-image--none')) {
            if ($imgBlock.hasClass('pb-load-image--bg')) {
                urlImg = $imgBlock.css('background-image');
                urlImg = urlImg.substring(5, urlImg.length - 2);
            } else {
                urlImg = $imgBlock.find('img').attr('src');
                if(! size){
                    $imgBlock.find('img').addClass('select_this_image');
                    size = document.getElementsByClassName('select_this_image')[0].naturalWidth + ' X ' + document.getElementsByClassName('select_this_image')[0].naturalHeight
                    $imgBlock.find('img').removeClass('select_this_image');
                }
            }

            cssHide = '';
            cssHideRemove = '';
            cssHideBrowse = 'pb-image__link--hide';
            cssImageNone = '';
        }

        if (isLinkRemove) cssHideRemove = '';

        if(! $imgBlock.attr('image-inserted-by-media-manager')){
            cssHide = 'pb-image__link--hide';
        }

        html = '<img class="pb-image__icn' + cssImageNone + '" src="' + urlImg + '">' +
            '<div class="pb-image__meta">' +
            '<strong class="pb-image__title">' + title + '</strong>' +
            '<div class="pb-image__size">' + (size ? size : '66 x 53') + '</div>' +
            '<ul class="pb-image__links clearfix">' +
            '<li class="' + cssHideBrowse + '">' +
            '<a href="javascript:void(0);" class="pb-image__link-browse browse_media_manager">Browse</a>' +
            '</li>' +
            '<li class="' + cssHideBrowse + '">' +
            '<a href="javascript:void(0);" class="pb-image__link-free-image">Unsplash</a>' +
            '</li>' +
            '<li class="' + cssHide + '">' +
            '<a href="javascript:void(0);" class="pb-image__link-replace">Replace</a>' +
            '</li>' +
            '<li class="' + cssHide + '">' +
            '<a href="javascript:void(0);" class="pb-image__link-edit">Edit</a>' +
            '</li>';
        if(type == 'image'){
            html += '<li class="' + cssHide + '">' +
                '<a href="javascript:void(0);" class="pb-image__link-link">Link</a>' +
                '</li>' +
                '<li class="' + cssHide + '">' +
                '<a href="javascript:void(0);" class="pb-image__link-alt">Alt</a>' +
                '</li>';
        }
        html += '<li class="' + cssHideRemove + '">' +
            '<a href="javascript:void(0);" class="pb-image__link-remove">Remove</a>' +
            '</li>' +
            '</ul>' +
            '</div >';
        return html;
    },
    setOptionsImage: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var html = '';
        var htmlImage = '';

        $('.pb-list-image').html('');
        htmlImage = pageBuilder.addHTMLImage($tpl, 0, false);

        html = '<li class="pb-image__item clearfix">' +
            '<i class="icn"></i>' +
            '</a>' +
            htmlImage +
            '</li>';
        $('.pb-list-image:visible').append(html);
    },
    addHTMLImageGroupList: function (isSlider) {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var linkRemove = false;
        var html = '';
        var $list = $('.pb-list-image--group');

        if (isSlider)
            $list = $('.pb-list-image--slideshow');

        $list.html('');

        if (opt.count > 2) linkRemove = true;

        for (i = 0; i < opt.count; i++) {
            var $imgs = $tpl.find('.pb-load-image');

            if ($imgs.length) {
                var htmlImage = pageBuilder.addHTMLImage($tpl, i, linkRemove);

                html = '<li class="pb-image__item clearfix" datasortid="' + i + '">' +
                    '<a href="javascript:void(0);" class="t-btn-gray pb-image__btn-move">' +
                    '<i class="icn"></i>' +
                    '</a>' +
                    htmlImage +
                    '</li>';
            }

            $list.append(html);
        }

        if (!isSlider)
            pageBuilder.showHideBtnAddImageGroup();
    },
    addImageListGroup: function () {
        var $tpl = $('.pb-widget--selected');
        var $list = $('.pb-list-image--group');
        var index = $list.find('.pb-image__item').length;
        var html = '';
        var linkRemove = false;
        var htmlImage = '';

        if (index > 1) linkRemove = true;

        $tpl.find('.pb-widget__content').append('<div class="pb-load-image pb-load-image--none"><img src="//:0" class="pb-img"></div>');
        htmlImage = pageBuilder.addHTMLImage($tpl, index, linkRemove);
        html = '<li class="pb-image__item clearfix" datasortid="' + index + '">' +
            '<a href="javascript:void(0);" class="t-btn-gray pb-image__btn-move">' +
            '<i class="icn"></i>' +
            '</a>' +
            htmlImage +
            '</li>';

        $list.append(html);
        pageBuilder.setCountImageGroup();

        $tpl.find('.pb-widget__content .pb-load-image:last').sortable({
            cursor: 'move',
            handle: '.pb-image__btn-move',
            tolerance: 'intersect',
            stop: function (event, ui) {
                pageBuilder.moveItemImageGroup(ui.item);
                pageBuilder.setCountImageGroup();
                pageBuilder.setSortIdImageGroup();
            }
        }).disableSelection();
        this.dropFreeImages();
    },
    setCountImageGroup: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $list = $('.pb-list-image--group');
        var $items = $list.find('.pb-image__item');
        var $links = $items.find('.pb-image__link-remove');
        var countImg = $items.length;

        if (countImg > 2) {
            $links.parent().removeClass('pb-image__link--hide');
        } else {
            $items.each(function () {
                if ($(this).find('.pb-image__icn').hasClass('pb-image__icn--none'))
                    $(this).find('.pb-image__link-remove').parent().addClass('pb-image__link--hide');
            });
        }

        pageBuilder.showHideBtnAddImageGroup();

        opt.count = countImg;
        $tpl.attr('data-json', JSON.stringify(opt));

        pageBuilder.setLayoutImagesGroup(opt.count);
        pageBuilder.positionImagesGroup();
    },
    setLayoutImagesGroup: function (count) {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');

        if (count == 2) {
            opt.layout = 0;
        } else if (count == 3) {
            opt.layout = 1;
        } else if (count == 4) {
            opt.layout = 2;
        } else {
            opt.layout = 3;
        }

        $tpl.attr('data-json', JSON.stringify(opt));
    },
    setSortIdImageGroup: function () {
        $('.pb-list-image--group:visible, .pb-list-image--slideshow:visible').find('.pb-image__item').each(function (i) {
            $(this).attr('datasortid', i);
        });
    },
    sortableImageGroup: function () {
        $('.pb-list-image--group').sortable({
            cursor: 'move',
            handle: '.pb-image__btn-move',
            tolerance: 'intersect',
            stop: function (event, ui) {
                pageBuilder.moveItemImageGroup(ui.item);
                pageBuilder.setCountImageGroup();
                pageBuilder.setSortIdImageGroup();
                pageBuilder.setNewActionHistory();
            }
        }).disableSelection();
    },
    positionImagesGroup: function (layoutIndex, sortImages) {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $wrapList = $tpl.find('.pb-widget__content');

        if (layoutIndex !== false) {
            opt.layoutIndex = layoutIndex || 0;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setOptionsLayoutImageGroup();
        }

        $wrapList.removeClass('pb-wrap-image-group--0-0 pb-wrap-image-group--0-1 pb-wrap-image-group--1-0 pb-wrap-image-group--1-1 pb-wrap-image-group--1-2 pb-wrap-image-group--2-0 pb-wrap-image-group--2-1 pb-wrap-image-group--3-0 pb-wrap-image-group--3-1 pb-wrap-image-group--3-2');

        if (opt.layout == 0 && opt.layoutIndex == 0) {
            $wrapList.addClass('pb-wrap-image-group--0-0');
        } else if (opt.layout == 0 && opt.layoutIndex == 1) {
            $wrapList.addClass('pb-wrap-image-group--0-1');
        } else if (opt.layout == 1 && opt.layoutIndex == 0) {
            $wrapList.addClass('pb-wrap-image-group--1-0');
        } else if (opt.layout == 1 && opt.layoutIndex == 1) {
            $wrapList.addClass('pb-wrap-image-group--1-1');
        } else if (opt.layout == 1 && opt.layoutIndex == 2) {
            $wrapList.addClass('pb-wrap-image-group--1-2');
        } else if (opt.layout == 2 && opt.layoutIndex == 0) {
            $wrapList.addClass('pb-wrap-image-group--2-0');
        } else if (opt.layout == 2 && opt.layoutIndex == 1) {
            $wrapList.addClass('pb-wrap-image-group--2-1');
        } else if (opt.layout == 3 && opt.layoutIndex == 0) {
            $wrapList.addClass('pb-wrap-image-group--3-0');
        } else if (opt.layout == 3 && opt.layoutIndex == 1) {
            $wrapList.addClass('pb-wrap-image-group--3-1');
        } else if (opt.layout == 3 && opt.layoutIndex == 2) {
            $wrapList.addClass('pb-wrap-image-group--3-2');
        }
    },
    moveItemImageGroup: function ($box) {
        var sortId = $box.attr('datasortid');
        var index = $box.closest('.pb-list-image--group').find('.pb-image__item').index($box);
        var $tpl = $('.pb-widget--selected');
        var $wrapList = $tpl.find('.pb-widget__content');
        var $detach = $wrapList.find('.pb-load-image').eq(sortId).detach();

        if (index === 0)
            $wrapList.prepend($detach);
        else
            $wrapList.find('.pb-load-image').eq(index - 1).after($detach);
    },
    showHideBtnAddImageGroup: function () {
        var $btn = $('.pb-add-image-group');

        if ($('.pb-list-image--group > .pb-image__item').length > 4)
            $btn.hide();
        else
            $btn.show();
    },
    codeBox: {
        editor: null,
        init: function () {
            CodeMirror.commands.autocomplete = function (cm) {
                cm.showHint({ hint: CodeMirror.hint.anyword });
            }
            pageBuilder.codeBox.editor = CodeMirror.fromTextArea(document.getElementById("pb-code-editor"), {
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: { "Ctrl-Space": "autocomplete" }
            });
        },
        setHTML: function () {
            var html = pageBuilder.codeBox.editor.getValue();
            var $tpl = $('.pb-widget--selected');

            //$tpl.find('.pb-code-box').html(html);
            /*
             * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
             */
            document.getElementsByClassName('pb-widget--selected')[0].getElementsByClassName('pb-code-box')[0].innerHTML = html;

            if (html === '')
                $tpl.addClass('pb-widget--code-none');
            else
                $tpl.removeClass('pb-widget--code-none');

            pageBuilder.setNewActionHistory();
        }
    },
    /*svgBox: {
        editor: null,
        init: function () {
            pageBuilder.svgBox.editor = CodeMirror.fromTextArea(document.getElementById("pb-svg-editor"), {
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: { "Ctrl-Space": "autocomplete" }
            });
            window.setTimeout(function() {
                pageBuilder.svgBox.editor.refresh();
            }, 10);
        },
        setHTML: function () {
            var html = pageBuilder.svgBox.editor.getValue();
            var $tpl = $('.pb-widget--selected');
            if (html === '') {
                $tpl.addClass('pb-widget--svg-none');
                $tpl.find('.pb-svg-box .pb-load-svg').addClass('pb-load-svg--none');
            } else {
                $tpl.removeClass('pb-widget--svg-none');
                $tpl.find('.pb-svg-box .pb-load-svg').removeClass('pb-load-svg--none');
            }
            $tpl.find('.pb-svg-box .pb-load-svg').html(html);
        },
        setEditorHTML: function (){
            var $tpl = $('.pb-widget--selected');
            var html = $tpl.find('.pb-svg-box .pb-load-svg').html();
            pageBuilder.svgBox.editor.setValue(html);
        }
    },*/
    videoBox: {
        editor: null,
        init: function () {
            /*CodeMirror.commands.autocomplete = function (cm) {
                cm.showHint({ hint: CodeMirror.hint.anyword });
            }*/
            pageBuilder.videoBox.editor = CodeMirror.fromTextArea(document.getElementById("pb-video-editor"), {
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: { "Ctrl-Space": "autocomplete" }
            });
        },
        setHTML: function () {
            var html = pageBuilder.videoBox.editor.getValue();
            var $tpl = $('.pb-widget--selected');

            if (html === '') {
                $tpl.addClass('pb-widget--video-none');
                html = '<iframe type="text/html" width="720" height="405" src="https://www.youtube.com/embed/bSXQ5Etde2o?rel=0" frameborder="0" allowfullscreen></iframe>';
            } else {
                $tpl.removeClass('pb-widget--video-none');
            }
            $tpl.find('.pb-video-box').html(html);

            pageBuilder.setNewActionHistory();
        }
    },
    updateSocialGroupHtml: function () {
        var $tpl = $('.pb-widget--selected');
        var $el = $tpl.find('.pb-wrap-social-btn');
        var optionsFollow = '';
        var optionsShare = '';
        var optionsSocial = '';
        var optionsCalendar = '';
        var isFollow = false;
        var isCalendar = false;
        var masDefaultFollowText = ['Facebook', 'Twitter', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];

        if ($tpl.attr('data-type') == 'social-follow') {
            isFollow = true;
            optionsFollow = '<option value="5">YouTube</option>' +
                '<option value="6">Instagram</option>' +
                '<option value="7">Vimeo</option>' +
                '<option value="8">RSS</option>' +
                '<option value="9">Email</option>' +
                '<option value="10">Website</option>';
        } else if ($tpl.attr('data-type') == 'calendar') {
            isCalendar = true;
            optionsCalendar = '<option value="11">Google</option>' +
                '<option value="12">Outlook</option>' +
                '<option value="13">Outlook Online</option>' +
                '<option value="14">iCalendar</option>' +
                '<option value="15">Yahoo!</option>';
        } else {
            optionsShare = '<option value="4">Forward to Friend</option>';
        }

        if (!isCalendar) {
            optionsSocial = '<option value="0">Facebook</option>' +
                '<option value="1">Twitter</option>' +
                '<option value="2">LinkedIn</option>' +
                '<option value="3">Pinterest</option>';
        }
        $('.pb-list-group-social:not(.custom_meta_data) li').remove();

        $el.each(function (i) {
            var $btn = $(this);
            var type = $btn.attr('data-type-social');
            var $text = $btn.find('.pb-social-btn__text');
            var link = '';
            var text = '';
            var masTextLabel = ['Facebook Page URL', 'Twitter URL or Username', 'LinkedIn Profile URL', 'Pinterest Board URL', 'Friend Profile URL', 'YouTube Channel URL', 'Instagram Profile URL', 'Vimeo URL', 'RSS URL', 'Email Address', 'Page URL', 'Google Calendar URL', 'Outlook URL', 'Outlook Online URL', 'iCalendar URL', 'Yahoo! Calendar URL'];

            if ($btn.length) {
                link = $btn.find('.pb-social-btn').attr('href');
                text = masDefaultFollowText[$btn.attr('data-type-social')];
            }

            $('.pb-list-group-social:not(.custom_meta_data)').append(
                '<li class="pb-list-group-social__item" idx="' + type + '" datasortid="' + i + '">' +
                '<div class="pb-item__line">' +
                '<a href="javascript:void(0);" class="t-btn-gray pb-item__btn-move">' +
                '<i class="icn"></i>' +
                '</a>' +
                '<a href="javascript:void(0);" class="t-btn-gray pb-item__btn-remove">' +
                '<i class="icn"></i>' +
                '</a>' +
                '<div class="pb-item__icon pb-item__icon--' + type + '"></div>' +
                '<select class="pb-social-list">' +
                optionsSocial +
                optionsShare +
                optionsFollow +
                optionsCalendar +
                '</select>' +
                '</div>' +
                '<div class="pb-list-group-social__fields">' +
                '<div class="pb-field pb-field--vertical">' +
                '<label>' + masTextLabel[type] + '</label>' +
                '<div class="pb-right">' +
                '<div class="pb-right__inner wFull">' +
                '<input type="text" class="txt-field pb-field-social-link" value="' + link + '" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="pb-field pb-field--vertical">' +
                '<label>Line Text</label>' +
                '<div class="pb-right">' +
                '<div class="pb-right__inner wFull">' +
                '<input type="text" class="txt-field pb-field-social-text" value="' + $text.text() + '" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>');

            /*ll_combo_manager.make_combo('.pb-list-group-social select:visible');
            ll_combo_manager.set_selected_value('.pb-list-group-social select:visible', type);*/

            var $chosen = $('.pb-list-group-social select:visible');
            $chosen.chosen();

            $chosen.find('option[value="' + type + '"]').attr('selected', true);
            $chosen.trigger('liszt:updated');

            if (isFollow) $('.pb-list-group-social .pb-list-group-social__fields').show();
        });

    },
    countGroupSocial: function () {
        var $tpl = $('.pb-widget--selected');
        var $box = $('.pb-list-group-social');
        var $btn = $('.pb-add-social-list');
        var type = $tpl.attr('data-type');

        if ($box.children('li').length > 1)
            $box.removeClass('pb-list-group-social--one-item');
        else
            $box.addClass('pb-list-group-social--one-item');

        if (type === 'social-follow') {
            if ($box.children('li').length < 10)
                $btn.show();
            else
                $btn.hide();
        } else if (type == 'calendar') {
            if ($box.children('li').length < 5)
                $btn.show();
            else
                $btn.hide();
        } else {
            if ($box.children('li').length < 5)
                $btn.show();
            else
                $btn.hide();
        }
    },
    socialIconAction: function () {
        $('.pb-add-social-list').on('click', function () {
            var $tpl = $('.pb-widget--selected');
            var optionsShare = '';
            var optionsFollow = '';
            var optionsSocial = '';
            var optionsCalendar = '';
            var isCalendar = false;
            var indexIcon = 0;
            var labelDefault = 'Facebook Page URL';
            var urlDefault = 'https://www.facebook.com/';
            var textDefault = 'Facebook';
            var type = $tpl.attr('data-type');
            var isFollow = false;

            if (type === 'social-follow') {
                isFollow = true;
                optionsFollow = '<option value="5">YouTube</option>' +
                    '<option value="6">Instagram</option>' +
                    '<option value="7">Vimeo</option>' +
                    '<option value="8">RSS</option>' +
                    '<option value="9">Email</option>' +
                    '<option value="10">Website</option>';
            } else if (type === 'calendar') {
                isCalendar = true;
                indexIcon = 11;
                labelDefault = 'Google Calendar URL';
                urlDefault = '#';
                textDefault = 'Google Calendar';
                optionsCalendar = '<option value="11">Google</option>' +
                    '<option value="12">Outlook</option>' +
                    '<option value="13">Outlook Online</option>' +
                    '<option value="14">iCalendar</option>' +
                    '<option value="15">Yahoo!</option>';
            } else {
                optionsShare = '<option value="4">Forward to Friend</option>';
            }

            if (!isCalendar) {
                optionsSocial = '<option value="0">Facebook</option>' +
                    '<option value="1">Twitter</option>' +
                    '<option value="2">LinkedIn</option>' +
                    '<option value="3">Pinterest</option>';
            }

            $('.pb-list-group-social:not(.custom_meta_data)').append(
                '<li class="pb-list-group-social__item" idx="' + type + '" datasortid="' + $('.pb-list-group-social').children('li').length + '">' +
                '<div class="pb-item__line">' +
                '<a href="javascript:void(0);" class="t-btn-gray pb-item__btn-move">' +
                '<i class="icn"></i>' +
                '</a>' +
                '<a href="javascript:void(0);" class="t-btn-gray pb-item__btn-remove">' +
                '<i class="icn"></i>' +
                '</a>' +
                '<div class="pb-item__icon pb-item__icon--' + indexIcon + '"></div>' +
                '<select class="pb-social-list">' +
                optionsSocial +
                optionsShare +
                optionsFollow +
                optionsCalendar +
                '</select>' +
                '</div>' +
                '<div class="pb-list-group-social__fields">' +
                '<div class="pb-field pb-field--vertical">' +
                '<label>' + labelDefault + '</label>' +
                '<div class="pb-right">' +
                '<div class="pb-right__inner wFull">' +
                '<input type="text" class="txt-field pb-field-social-link" value="' + urlDefault + '" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="pb-field pb-field--vertical">' +
                '<label>Line Text</label>' +
                '<div class="pb-right">' +
                '<div class="pb-right__inner wFull">' +
                '<input type="text" class="txt-field pb-field-social-text" value="' + textDefault + '" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>');

            ll_combo_manager.make_combo('.pb-list-group-social select:visible');

            if (isFollow) $('.pb-list-group-social .pb-list-group-social__fields').show();

            pageBuilder.countGroupSocial();
            pageBuilder.updateSocialHtml(true);
            pageBuilder.setNewActionHistory();
        });
        $('.pb-list-group-social:not(.custom_meta_data)').on('click', '.pb-item__btn-remove', function () {
            $(this).parents('li').remove();
            pageBuilder.updateSocialHtml();
            $('.pb-list-group-social:not(.custom_meta_data)').children('li').each(function (i) {
                $(this).attr('datasortid', i);
            });
            pageBuilder.countGroupSocial();
            pageBuilder.setNewActionHistory();
        });
        $('.pb-list-group-social.custom_meta_data').on('click', '.pb-item__btn-remove', function () {
            $(this).parents('li').remove();
            LandingPageBuilder.update_history_meta_data();
        });

        $('.pb-list-group-social').on('keyup  change', '.pb-field-social-link', function () {
            var $tpl = $('.pb-widget--selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $btn = $tpl.find('.pb-social-btn').eq($li.attr('datasortid'));
            var val = $(this).val();

            if (val == '') val = 'http://';

            $btn.attr('href', val);
            pageBuilder.setNewActionHistory();
        });
        $('.pb-list-group-social').on('keyup  change', '.pb-field-social-text', function () {
            var $tpl = $('.pb-widget--selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $btn = $tpl.find('.pb-social-btn').eq($li.attr('datasortid'));
            var val = $(this).val();
            var masDefaultFollowText = ['Facebook', 'Twitter', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];

            if (val == '') val = masDefaultFollowText[typeIcon];

            $btn.find('.pb-social-btn__text').text(val);
            pageBuilder.setNewActionHistory();
        });
        ll_combo_manager.event_on_change('#pb-select-content-to-share', function(){
            var val = ll_combo_manager.get_selected_value('#pb-select-content-to-share');
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            if( parseInt(val) ){
                if(opt.shareLink != '%%webversion_url_encoded%%'){
                    $('#shareCustomLink').val(opt.shareLink);
                }
                $('#shareShortDesc').val(opt.shareDesc);
                $('.pb-content-to-share__custom').show();
            } else {
                $('.pb-content-to-share__custom').hide();
                opt.shareLink = '%%webversion_url_encoded%%';
            }

            opt.shareCustomUrl = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateSocialShareLink();
            pageBuilder.setNewActionHistory();
        });
        $('#shareCustomLink').keyup(function () {
            var val = $(this).val();
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.shareLink = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateSocialShareLink();
            pageBuilder.setNewActionHistory();
        });
        $('#shareShortDesc').keyup(function () {
            var val = $(this).val();
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.shareDesc = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateSocialShareLink();
            pageBuilder.setNewActionHistory();
        });
        $('.pb-wrap-btn-update-calendar-email').bind ('click', function (){
            var event = {};
            event.title = $.trim ( $('input[name="calendar_event_title"]').val() );
            event.start = $.trim ( $('input[name="calendar_event_start_date"]').val() );
            event.end = $.trim ( $('input[name="calendar_event_end_date"]').val() );
            event.timezone = $.trim ( ll_combo_manager.get_selected_value('select#pb-calendarTimezone') );
            event.location = $.trim ( $('input[name="calendar_event_location"]').val() );
            event.organizer_name = $.trim ( $('input[name="calendar_event_organizer"]').val() );
            event.organizer_email = $.trim ( $('input[name="calendar_event_email"]').val() );
            event.description = $.trim ( $('textarea[name="calendar_event_description"]').val() );

            if (event.title && event.title != '') {
                if (event.start && event.start != '') {
                    if (event.end && event.end != '') {
                        if (event.timezone && event.timezone != '') {
                            if (event.location && event.location != '') {
                                if (event.organizer_name && event.organizer_name != '') {
                                    var $tpl  = $('.pb-widget--selected');
                                    var opt = $tpl.data('json');
                                    opt.event = event;
                                    $tpl.attr('data-json', JSON.stringify( opt ));

                                    pageBuilder.set_calendar_control_urls ();
                                } else {
                                    show_error_message ('Please enter event organizer');
                                    $('.field-calendar-email .field-event-organizer-name').focus()
                                }
                            } else {
                                show_error_message ('Please enter event location');
                                $('.field-calendar-email .field-event-location').focus()
                            }
                        } else {
                            show_error_message ('Please enter event timezone');
                        }
                    } else {
                        show_error_message ('Please enter event end date');
                        $('.field-calendar-email .field-event-end').focus()
                    }
                } else {
                    show_error_message ('Please enter event start date');
                    $('.field-calendar-email .field-event-start').focus()
                }
            } else {
                show_error_message ('Please enter event title');
                $('.field-calendar-email .field-event-title').focus()
            }
        })
        ll_date_picker_manager.make_picker ('input[name="calendar_event_start_date"]', {
            timepicker: true,
            minDate: false,
            format: 'Y-m-d H:i:00',
            //format: 'm/d/Y h:iA',
            formatTime:'h:i A',
            step: 5
        });
        ll_date_picker_manager.make_picker ('input[name="calendar_event_end_date"]', {
            timepicker: true,
            minDate: false,
            format: 'Y-m-d H:i:00',
            //format: 'm/d/Y h:iA',
            formatTime:'h:i A',
            step: 5
        });
        $('input[name="calendar_event_start_date"]').bind ('change', function (){
            var startDate = ll_date_picker_manager.get_selected_date_text('input[name="calendar_event_start_date"]');
            var endDate = ll_date_picker_manager.get_selected_date_text('input[name="calendar_event_end_date"]');
            if(startDate) {
                startDate = new Date(startDate);
                if(endDate){
                    endDate = new Date(endDate);
                    if (endDate <= startDate) {
                        startDate.setHours(startDate.getHours() + 1);
                        startDate = startDate.format('yyyy-mm-dd HH:MM:00');
                        ll_date_picker_manager.set_date('input[name="calendar_event_end_date"]',startDate);
                    }
                } else {
                    startDate.setHours(startDate.getHours() + 1);
                    startDate = startDate.format('yyyy-mm-dd HH:MM:00');
                    ll_date_picker_manager.set_date('input[name="calendar_event_end_date"]',startDate);
                }
            }
        });
        $('.pb-layout-social li').on('click', function () {
            var index = $(this).parent().find('li').index($(this));
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');
            var $containerBtns = $tpl.find('.pb-social-btns');

            $(this).addClass('pb-layout-social__item--selected').siblings('li').removeClass('pb-layout-social__item--selected');

            if (opt.display) {
                if (index == 0 || index == 3) {
                    $containerBtns.addClass('pb-social-btns--icn-large');
                } else {
                    $containerBtns.removeClass('pb-social-btns--icn-large');
                }
            } else {
                $containerBtns.removeClass('pb-social-btns--icn-large');
            }

            opt.layout = index;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateSocialHtml();

            if (opt.display) pageBuilder.updateDisplayOption();

            pageBuilder.setNewActionHistory();
        });
        /*ll_combo_manager.event_on_change('.pb-social-list', function () {

        });*/
        $('.pb-list-group-social').on('change', '.pb-social-list:not(.meta_data_names)', function () {
            var val = $(this).val();
            pageBuilder.addNewSocialService(val, $(this));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-list-group-social').on('change', '.pb-social-list.meta_data_names', function (e) {
            e.stopPropagation();
        });
    },
    sortableSocial: function () {
        $('.pb-list-group-social').sortable({
            cursor: 'move',
            handle: '.pb-item__btn-move',
            tolerance: 'intersect',
            stop: function (event, ui) {
                pageBuilder.updateSocialHtml();
                $('.pb-list-group-social').children('li').each(function (i) {
                    $(this).attr('datasortid', i);
                });
                pageBuilder.setNewActionHistory();
            }
        });
    },
    updateSocialHtml: function (isAddNew) {
        if(typeof isAddNew == 'undefined'){
            isAddNew = false;
        }
        var $tpl = $('.pb-widget--selected');
        var $conatinerBtns = $tpl.find('.pb-social-btns');
        var $btns = $conatinerBtns.find('.pb-wrap-social-btn');
        var html = '';
        var opt = $tpl.data('json');
        var count = $('.pb-list-group-social:not(.custom_meta_data)').children('li').length;
        console.log(count);
        var isVertical = false;

        if (opt.display == '0' || opt.display == '2') {
            if (opt.layout == '0' || opt.layout == '1') isVertical = true;
        } else {
            if (opt.layout == '0') isVertical = true;
        }

        if (isVertical)
            $conatinerBtns.addClass('pb-social-btns--vertical');
        else
            $conatinerBtns.removeClass('pb-social-btns--vertical');

        html = '<div class="pb-social-btns__table"><div class="pb-social-btns__row">';

        $('.pb-list-group-social:not(.custom_meta_data)').children('li').each(function (i) {
            var $li = $(this);
            var type = $li.attr('idx');
            var index = $li.attr('datasortid');

            if (isAddNew && count - 1 == i) {
                html += '<div class="pb-wrap-social-btn" data-type-social="0">' + $btns.eq(0).html() + '</div>';
            } else {
                html += '<div class="pb-wrap-social-btn" data-type-social="' + $btns.eq(index).attr('data-type-social') + '">' + $btns.eq(index).html() + '</div>';
            }

        });

        html += '</div></div>';

        $conatinerBtns.html(html);
        $conatinerBtns.find('.pb-wrap-social-btn').each(function (i) {
            var $this = $(this);
            var $btnText = $this.find('.pb-social-btn__text');
            var $btn = $this.find('.pb-social-btn');
            var $btnIcn = $this.find('.pb-social-btn__icn img');
            var src = '';

            if (isAddNew && count - 1 == i) {
                if ($tpl.attr('data-type') === 'social-follow') {
                    $btnText.text('Facebook');
                    $btn.attr('href', 'https://www.facebook.com/');
                } else if ($tpl.attr('data-type') === 'calendar') {
                    $btnText.text('Google Calendar');
                    $btn.attr('href', '#');
                } else {
                    $btnText.text('Share');
                    $btn.attr('href', 'http://www.facebook.com/sharer/sharer.php?u=%%webversion_url_encoded%%');
                    pageBuilder.updateSocialShareLink();
                }

                src = $btnIcn.attr('src');

                if ($tpl.attr('data-type') === 'calendar') {
                    $btnIcn.find('img').attr('src', src.slice(0, src.lastIndexOf('/')) + '/google.png');
                } else {
                    $btnIcn.find('img').attr('src', src.slice(0, src.lastIndexOf('/')) + '/fb.png');
                }
            }
        });
    },
    addNewSocialService: function (val, $el) {
        var $tpl = $('.pb-widget--selected');
        var type = $tpl.attr('data-type');
        var $li = $el.closest('.pb-list-group-social__item');
        var $containerBtn = $tpl.find('.pb-wrap-social-btn').eq($li.attr('datasortid'));
        var masIcon = ['fb.png', 'tw.png', 'in.png', 'pinterest.png', 'forward.png', 'youtube.png', 'inst.png', 'vimeo.png', 'rss.png', 'email.png', 'website.png', 'google.png', 'outlook.png', 'outlook_online.png', 'icalendar.png', 'yahoo.png'];
        var masTextLabel = ['Facebook Page URL', 'Twitter URL or Username', 'LinkedIn Profile URL', 'Pinterest Board URL', 'Friend Profile URL', 'YouTube Channel URL', 'Instagram Profile URL', 'Vimeo URL', 'RSS URL', 'Email Address', 'Page URL', 'Google Calendar URL', 'Outlook URL', 'Outlook Online URL', 'iCalendar URL', 'Yahoo! Calendar URL'];
        var masDefaultFollowText = ['Facebook', 'Twitter', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];
        var masDefaultShareText = ['Share', 'Tweet', 'Share', 'Pin', 'Forward'];
        var masDefaultShareUrl = ['http://www.facebook.com/sharer/sharer.php?u=', 'http://twitter.com/intent/tweet?text=', 'http://www.linkedin.com/shareArticle?url=', 'https://www.pinterest.com/pin/find/?url=', 'mailto:?body='];
        var masDefaultFollowUrl = ['http://www.facebook.com/', 'http://www.twitter.com/', 'http://www.linkedin.com/', 'http://www.pinterest.com/', '', 'http://www.youtube.com/', 'http://instagram.com/', 'https://vimeo.com/', 'http://www.yourfeedurl.com/', 'your@email.com', 'http://www.yourwebsite.com/', '#', '#', '#', '#', '#'];
        var $boxFields = $li.find('.pb-list-group-social__fields');
        var $btnText = $containerBtn.find('.pb-social-btn__text');
        var $btnUrl = $containerBtn.find('.pb-social-btn');
        var $btnIcn = $containerBtn.find('.pb-social-btn__icn');
        var src = '';

        $li.find('.pb-item__icon').removeClass('pb-item__icon--0 pb-item__icon--1 pb-item__icon--2 pb-item__icon--3 pb-item__icon--4 pb-item__icon--5 pb-item__icon--6 pb-item__icon--7 pb-item__icon--8 pb-item__icon--9 pb-item__icon--10 pb-item__icon--11 pb-item__icon--12 pb-item__icon--13 pb-item__icon--14 pb-item__icon--15 pb-item__icon--16').addClass('pb-item__icon--' + val);
        $li.attr('idx', val);
        $containerBtn.attr('data-type-social', val);

        if (type == 'social-follow' || type == 'calendar') {
            $boxFields.find('.pb-field:first > label').text(masTextLabel[val]);
            $boxFields.find('.pb-field:first .txt-field').val(masDefaultFollowUrl[val]);
            $boxFields.find('.pb-field:last .txt-field').val(masDefaultFollowText[val]);
            $btnText.text(masDefaultFollowText[val]);
            $btnUrl.attr('href', masDefaultFollowUrl[val]);
        } else {
            $boxFields.find('.pb-field:last .txt-field').val(masDefaultShareText[val]);
            $btnText.text(masDefaultShareText[val]);
            pageBuilder.updateSocialShareLink($li.attr('datasortid'));
        }

        src = $btnIcn.find('img').attr('src');

        $btnIcn.find('img').attr('src', src.slice(0, src.lastIndexOf('/')) + '/' + masIcon[val]);
    },
    updateSocialShareLink: function (pos) {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $containerBtn = $tpl.find('.pb-wrap-social-btn');
        var masDefaultShareUrl = ['http://www.facebook.com/sharer/sharer.php?u=', 'http://twitter.com/intent/tweet?text=', 'http://www.linkedin.com/shareArticle?url=', 'https://www.pinterest.com/pin/find/?url=', 'mailto:?body='];
        var href = '';
        var customLink = '';
        var customDesc = '';

        if (opt.shareCustomUrl == '1') {
            customLink = opt.shareLink;
            customDesc = opt.shareDesc;
        } else {
            customLink = '%%webversion_url_encoded%%';
        }

        if (pos) $containerBtn = $containerBtn.eq(pos);

        $containerBtn.each(function () {
            var $this = $(this);
            var type = $this.attr('data-type-social');

            if (type == '0') {
                href = masDefaultShareUrl[0] + customLink
            } else if (type == '1') {
                if (opt.shareCustomUrl == '1') {
                    href = masDefaultShareUrl[1] + customDesc + ': ' + customLink
                } else {
                    href = masDefaultShareUrl[1];
                }

            } else if (type == '2') {
                href = masDefaultShareUrl[2] + customLink
            } else if (type == '3') {
                href = masDefaultShareUrl[3] + customLink + '&mini=true&title=' + customDesc;
            } else if (type == '4') {
                href = masDefaultShareUrl[4] + customLink;
            } else if (type == '5') {
                href = masDefaultShareUrl[5] + customLink;
            }

            $this.find('.pb-social-btn').attr('href', href);
        });
    },
    updateDisplayOption: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $conatinerBtns = $tpl.find('.pb-social-btns');
        var $containerBtn = $tpl.find('.pb-wrap-social-btn');
        var masIcon = ['fb.png', 'tw.png', 'in.png', 'pinterest.png', 'forward.png', 'youtube.png', 'inst.png', 'vimeo.png', 'rss.png', 'email.png', 'website.png', 'google.png', 'outlook.png', 'outlook_online.png', 'icalendar.png', 'yahoo.png'];
        var masDefaultFollowText = ['Facebook', 'Twitter', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];
        var link = '';
        var imgSrc = '';
        var id = '';
        var text = '';
        var btnIconHtml = false;
        var btnTextHtml = false;
        var htmlBtn = '';

        $containerBtn.each(function (i) {
            var $this = $(this);
            var $btn = $this.find('.pb-social-btn');
            id = $this.attr('data-type-social');

            $conatinerBtns.removeClass('pb-social-btns--icn-only pb-social-btns--text-only');
            if (opt.display == '0') {
                $conatinerBtns.addClass('pb-social-btns--icn-only');
            } else if (opt.display == '1') {
                $conatinerBtns.addClass('pb-social-btns--text-only');
            }
            if (opt.display == '1' || opt.display == '2') {
                var $btn = $this.find('.pb-social-btn');
                var lineHeight = opt.lineHeight;

                $btn.css({
                    'font-size': opt.fontSize + 'px',
                    'color': opt.color,
                    'font-weight': opt.fontWeight
                });
                if($.inArray(opt.fontTypeFace, STANDARD_FONTS)== -1){
                    $btn.css({
                        'font-family': opt.fontTypeFace
                    });
                } else {
                    $btn.css({
                        'font-family': opt.fontTypeFace + ', sans-serif'
                    });
                }

                if (lineHeight == 'None')
                    $btn.css('line-height', 'normal');
                else
                    $btn.css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));
            }
        });
    },
    addHTMLImageColumnsList: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var html = '';
        var $list = $('.pb-list-image--columns:visible');

        $list.html('');

        for (i = 0; i < opt.count; i++) {
            var $imgs = $tpl.find('.pb-load-image').eq(i).children('img');

            if ($imgs.length) {
                var htmlImage = pageBuilder.addHTMLImage($tpl, i);

                html = '<li class="pb-image__item clearfix">' +
                    '<i class="icn"></i>' +
                    '</a>' +
                    htmlImage +
                    '</li>';
            }
            $list.append(html);
        }
    },
    captionPosition: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var imgContent = '';
        var textContent = '';
        var $col1 = $tpl.find('.pb-column-1');
        var $col2 = $tpl.find('.pb-column-2');
        var $boxContent = $tpl.find('.pb-widget__content');

        textContent = $tpl.find('.pb-editable').detach();
        imgContent = $tpl.find('.pb-load-image').detach();

        if (opt.position == 0 || opt.position == 1) {
            $col1.append(textContent);
            $col2.append(imgContent)
        } else if (opt.position == 2 || opt.position == 3) {
            $col1.append(imgContent);
            $col2.append(textContent)
        }

        if (opt.position == 1 || opt.position == 3)
            $boxContent.addClass('pb-widget__content--none-columns');
        else
            $boxContent.removeClass('pb-widget__content--none-columns');
    },
    setGridSizeColumns: function ($box, values) {
        var $items = null;
        var $wrapItems = null;
        var value1 = parseInt(values[0]);
        var value2 = 0;
        var value3 = 0;
        var value4 = 0;
        var value5 = 0;

        $box.find('.pb-grid-size__items').remove();
        $box.prepend('<div class="pb-grid-size__items"></div>');
        $wrapItems = $box.find('.pb-grid-size__items');
        console.log(values);
        for (i = 0; i <= values.length; i++) {
            $wrapItems.append('<div class="pb-grid-size__item"/>');
        }

        $items = $box.find('.pb-grid-size__item');

        if (values.length == 1) {
            value2 = 100 - parseInt(values[0]);
            $items.eq(0).css('width', value1 + '%').text(value1 + '%');
            $items.eq(1).css({
                'left': value1 + '%',
                'width': value2 + '%'
            }).text(value2 + '%');
        } else if (values.length == 2) {
            value3 = 100 - parseInt(values[1]);
            value2 = parseInt(values[1]) - parseInt(values[0]);

            $items.eq(0).css('width', value1 + '%').text(value1 + '%');
            $items.eq(1).css({
                'left': value1 + '%',
                'width': value2 + '%'
            }).text(value2 + '%');
            $items.eq(2).css({
                'left': (value1 + value2) + '%',
                'width': value3 + '%'
            }).text(value3 + '%');
        } else if (values.length == 3) {
            value4 = 100 - parseInt(values[2]);
            value3 = parseInt(values[2]) - parseInt(values[1]);
            value2 = parseInt(values[1]) - parseInt(values[0]);

            $items.eq(0).css('width', value1 + '%').text(value1 + '%');
            $items.eq(1).css({
                'left': value1 + '%',
                'width': value2 + '%'
            }).text(value2 + '%');
            $items.eq(2).css({
                'left': (value1 + value2) + '%',
                'width': value3 + '%'
            }).text(value3 + '%');
            $items.eq(3).css({
                'left': (value1 + value2 + value3) + '%',
                'width': value4 + '%'
            }).text(value4 + '%');

        } else if (values.length == 4) {
            value5 = 100 - parseInt(values[3]);
            value4 = parseInt(values[3]) - parseInt(values[2]);
            value3 = parseInt(values[2]) - parseInt(values[1]);
            value2 = parseInt(values[1]) - parseInt(values[0]);

            $items.eq(0).css('width', value1 + '%').text(value1 + '%');
            $items.eq(1).css({
                'left': value1 + '%',
                'width': value2 + '%'
            }).text(value2 + '%');
            $items.eq(2).css({
                'left': (value1 + value2) + '%',
                'width': value3 + '%'
            }).text(value3 + '%');
            $items.eq(3).css({
                'left': (value1 + value2 + value3) + '%',
                'width': value4 + '%'
            }).text(value4 + '%');
            $items.eq(4).css({
                'left': (value1 + value2 + value3 + value4) + '%',
                'width': value5 + '%'
            }).text(value5 + '%');
        }
    },
    setJSonGridColumns: function (values) {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');

        opt.numberColumns = values.length + 1;
        opt.gridSize1 = parseInt(values[0]);
        opt.gridSize2 = 0;
        opt.gridSize3 = 0;
        opt.gridSize4 = 0;

        if (values.length > 1)
            opt.gridSize2 = parseInt(values[1]) - parseInt(values[0]);
        if (values.length > 2)
            opt.gridSize3 = parseInt(values[2]) - parseInt(values[1]);
        if (values.length > 3)
            opt.gridSize4 = parseInt(values[3]) - parseInt(values[2]);

        $tpl.attr('data-json', JSON.stringify(opt));
    },
    setWidthGridColumns: function ($el, values) {
        var $tpl = $('.pb-widget--selected');
        var margin = 1;
        var width_1 = 0;
        var width_2 = 0;
        var width_3 = 0;
        var width_4 = 0;
        var width_5 = 0;
        var id = $el.attr('id');
        var $grids = null;

        if (id == 'threeGridGrid' || id == 'unevenGridGrid' || id === 'twoGridGrid') {
            $grids = $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell');
            if (values.length == 1) {
                margin = 0.5;
                width_1 = values[0] - margin;
                width_2 = 100 - values[0] - margin;
                $grids.eq(0).css('width', width_1 + '%');
                $grids.eq(1).css('width', width_2 + '%');

            } else if (values.length == 2) {
                margin = 0.666667;
                width_1 = values[0] - margin;
                width_2 = parseInt(values[1]) - parseInt(values[0]) - margin;
                width_3 = 100 - parseInt(values[1]) - margin;

                $grids.eq(0).css('width', width_1 + '%');
                $grids.eq(1).css('width', width_2 + '%');
                $grids.eq(2).css('width', width_3 + '%');
            } else if (values.length == 3) {
                margin = 0.75;
                width_1 = values[0] - margin;
                width_2 = parseInt(values[1]) - parseInt(values[0]) - margin;
                width_3 = parseInt(values[2]) - parseInt(values[1]) - margin;
                width_4 = 100 - parseInt(values[2]) - margin;

                $grids.eq(0).css('width', width_1 + '%');
                $grids.eq(1).css('width', width_2 + '%');
                $grids.eq(2).css('width', width_3 + '%');
                $grids.eq(3).css('width', width_4 + '%');
            } else if (values.length == 4) {
                margin = 0.80;
                width_1 = values[0] - margin;
                width_2 = parseInt(values[1]) - parseInt(values[0]) - margin;
                width_3 = parseInt(values[2]) - parseInt(values[1]) - margin;
                width_4 = parseInt(values[3]) - parseInt(values[2]) - margin;
                width_5 = 100 - parseInt(values[3]) - margin;

                $grids.eq(0).css('width', width_1 + '%');
                $grids.eq(1).css('width', width_2 + '%');
                $grids.eq(2).css('width', width_3 + '%');
                $grids.eq(3).css('width', width_4 + '%');
                $grids.eq(4).css('width', width_5 + '%');
            }
        } else if (id === 'imgCaptionOneGrid' || id === 'textColumnsWithImgGrid' || id === 'imgCaptionTwoGrid' || id === 'twoTextColumnsGrid' || id === 'columnsCaptionGrid') {
            var margin = 1;
            width_1 = values[0] - margin;
            width_2 = 100 - values[0] - margin;
            $tpl.find('.pb-column-1').css('width', width_1 + '%');
            $tpl.find('.pb-column-2').css('width', width_2 + '%');

        }
    },
    showHideGridSizeColumns: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');

        var $box = $('.pb-settings-panel__content:visible .pb-field-grid-size-columns');

        if (opt.position === '1' || opt.position === '3')
            $box.hide();
        else
            $box.show();
    },
    addImageListSlideshow: function () {
        var $tpl = $('.pb-widget--selected');
        var $list = $('.pb-list-image--slideshow');
        var $items = $list.find('.pb-image__item');
        var index = $items.length;
        var html = '';
        var linkRemove = false;
        var htmlImage = '';

        if (index > 1) linkRemove = true;

        $tpl.find('.swiper-wrapper').append('<div class="swiper-slide"><div class="pb-load-image pb-load-image--bg pb-load-image--none"></div></div>');
        htmlImage = pageBuilder.addHTMLImage($tpl, index, linkRemove);
        html = '<li class="pb-image__item clearfix" datasortid="' + index + '">' +
            '<i class="icn"></i>' +
            '</a>' +
            htmlImage +
            '</li>';

        $list.append(html);
        pageBuilder.setCountImageListSlideshow();
    },
    setCountImageListSlideshow: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $list = $('.pb-list-image--slideshow');
        var $items = $list.find('.pb-image__item');
        var $links = $items.find('.pb-image__link-remove');
        var countImg = $items.length;

        if (countImg > 2) {
            $links.parent().removeClass('pb-image__link--hide');
        } else {
            $items.each(function () {
                if ($(this).find('.pb-image__icn').hasClass('pb-image__icn--none'))
                    $(this).find('.pb-image__link-remove').parent().addClass('pb-image__link--hide');
            });
        }

        opt.count = countImg;
        $tpl.attr('data-json', JSON.stringify(opt));
    },
    setActiveSlideInSlideshow: function ($item) {
        var $tpl = $('.pb-widget--selected');
        var index = $item.attr('datasortid');

        $tpl.find('.swiper-slide').eq(index).addClass('swiper-slide--active').siblings('.swiper-slide').removeClass('swiper-slide--active');
    },
    addIcnSvg: function ($btn) {
        var $box = $btn.closest('.pb-box-btn-upload-svg');
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var html = '<svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)"  class="pb-svg-fill" fill="#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg>';

        $box.removeClass('pb-box-btn-upload-svg--none');
        $tpl.addClass('pb-widget--svg-on').find('.pb-load-svg').removeClass('pb-load-svg--none').html(html);
        opt.count = '1';
        opt.fillColor = "#"+LL_INSTANCE_DEFAULT_THEME_COLOR;
        opt.strokeColor = "#"+LL_INSTANCE_DEFAULT_THEME_COLOR;
        $('#svgFillColor').colpickSetColor(opt.fillColor, true).css('background-color', opt.fillColor);
        $('#svgStrokeColor').colpickSetColor(opt.strokeColor, true).css('background-color', opt.strokeColor);
        $tpl.attr('data-json', JSON.stringify(opt));
        pageBuilder.getColorSvg();
    },
    removeIcnSvg: function ($btn) {
        var $box = $btn.closest('.pb-box-btn-upload-svg');
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');

        $box.addClass('pb-box-btn-upload-svg--none');
        $tpl.removeClass('pb-widget--svg-on').find('.pb-load-svg').addClass('pb-load-svg--none').html('');
        opt.count = '0';
        $tpl.attr('data-json', JSON.stringify(opt));
    },
    getColorSvg: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $svg = $tpl.find('.pb-load-svg svg');

        $svg.attr('fill', opt.fillColor);
        $svg.attr('stroke', opt.strokeColor);
    },
    addBgImage: function ($box, isGlobal, url, $tpl) {
        var $tpl = $tpl ? $tpl : $('.pb-widget--selected');
        var opt = null;
        var url = url ? url.url : "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0";
        var fileName = 'image.jpeg';

        if (isGlobal)
            $tpl = $('#pb-template');

        opt = $tpl.data('json');
        opt.backgroundImageUrl = url;

        if (isGlobal) {
            $tpl.css('background-image', 'url("' + opt.backgroundImageUrl + '")');
        } else {
            if ($tpl.hasClass('pb-widget--calendar') || $tpl.hasClass('pb-widget--social-share') || $tpl.hasClass('pb-widget--social-follow')) {
                $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', 'url("' + opt.backgroundImageUrl + '")');
            } else if ($tpl.hasClass('pb-widget--nav-item')) {
                $tpl.css('background-image', 'url("' + opt.backgroundImageUrl + '")');
            } else {
                //$tpl.children('.pb-widget__content, .pb-layout-grid').css('background-image', 'url("' + opt.backgroundImageUrl + '")');
                $tpl.css('background-image', 'url("' + opt.backgroundImageUrl + '")');
            }
        }

        $tpl.attr('data-json', JSON.stringify(opt));
        fileName = pageBuilder.getBgImageName(opt.backgroundImageUrl);

        if ($box) {
            $box.removeClass('pb-box-btn-upload-bg-image--none');
            $box.find('.pb-unload-bg-image__title').text(fileName);
        }
    },
    getBgImageName: function (url) {
        var split = url.split('/');
        split = split[split.length - 1];
        return split;
    },
    removeBgImage: function ($box, isGlobal) {
        var $tpl = $('.pb-widget--selected');
        var opt = null;

        if (isGlobal)
            var $tpl = $('#pb-template');

        opt = $tpl.data('json');
        opt.backgroundImageUrl = '';

        /*if (isGlobal) {
            console.log('case 1');
            $tpl.css('background-image', '');
        } else if ($tpl.hasClass('pb-widget--nav-item')) {
            console.log('case 2');
            $tpl.css('background-image', '');
        } else {
            console.log('case 3');
            $tpl.children('.pb-widget__content, .pb-layout-grid, .pb-social-btns').css('background-image', '');
            $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', '');
        }*/

        if ($tpl.hasClass('pb-widget--calendar') || $tpl.hasClass('pb-widget--social-share') || $tpl.hasClass('pb-widget--social-follow')) {
            $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', '');
        } else {
            $tpl.css('background-image', '');
        }

        $tpl.attr('data-json', JSON.stringify(opt));
        $box.addClass('pb-box-btn-upload-bg-image--none');
    },
    responsiveMedia: function () {
        $('#switch-preview').val('off').removeAttr('checked');
        $('#switch-preview').change(function () {
            var $toggle = $(this);
            var val = $toggle.val();
            var $box = $('.pb-editor__column-left');
            var $panel = $box.find('.pb-media-screen');

            if (val === 'off') {
                $toggle.val('on');
                $('#pbBtnPreview').hide();
                $panel.removeClass('pb-media-screen--hide');
                $box.addClass('init-media-screen');
                $box.animate({ paddingTop: '30px' }, { duration: 400 });
                $panel.animate({ top: '0' }, { duration: 400, queue: false });
                pageBuilder.responsiveMediaResize($('.pb-editor__column-left .pb-media-screen'));
            } else {
                $toggle.val('off');
                $box.removeClass('init-media-screen');
                $('#pbBtnPreview').show();
                $box.animate({ paddingTop: '0' }, { duration: 400 });
                $panel.animate({ top: '-30px' }, {
                    duration: 400,
                    queue: false,
                    complete: function () {
                        $panel.addClass('pb-media-screen--hide');
                        $panel.find('.pb-media-screen__item--1024').trigger('click');
                        $('.pb-blocks').css('max-width', '');
                    }
                });
            }
        });
        $('.pb-media-screen__item').on('click', function (e) {
            var $item = $(this);
            var data_media = media = $item.attr('data-media');
            var $parent = $item.closest('.pb-editor__column-left, .pb-preview-box');

            $item.addClass('pb-media-screen__item--selected').siblings('.pb-media-screen__item').removeClass('pb-media-screen__item--selected');

            (media === '1920') ? media = '100%' : media = media + 'px';

            if ($parent.hasClass('pb-preview-box'))
                $parent.find('.pb-preview-box__inner').css('width', media);
            else
                $parent.find('.pb-blocks').css('max-width', media);

            if($('#pb-panel__nav-item').is(':visible')){
                if(data_media > 480){
                    $('#pb-panel__nav-item').find('.pb-btn-open-menu').hide();
                } else {
                    $('#pb-panel__nav-item').find('.pb-btn-open-menu').show();
                }
            }

            if($('#pb-panel__nav-items').is(':visible')){
                if(data_media > 480){
                    $('#pb-panel__nav-items').find('.pb-btn-open-menu').hide();
                } else {
                    $('#pb-panel__nav-items').find('.pb-btn-open-menu').show();
                }
            }
        });
        $('.pb-media-screen__item').hover(function (e) {
            var $curentEtem = $(this);
            var $parent = $curentEtem.closest('.pb-editor__column-left, .pb-preview-box');
            var $selectedItem = $parent.find('.pb-media-screen__item--selected');
            var selectedMedia = parseInt($selectedItem.attr('data-media'));
            var currentMedia = parseInt($curentEtem.attr('data-media'));

            $curentEtem.siblings('.pb-media-screen__item').addClass('pb-media-screen__item--disabled-icn');

            if (currentMedia > selectedMedia)
                $selectedItem.addClass('pb-media-screen__item--hover');
        }, function () {
            var $parent = $(this).closest('.pb-editor__column-left, .pb-preview-box');
            $parent.find('.pb-media-screen__item--hover').removeClass('pb-media-screen__item--hover');
            $parent.find('.pb-media-screen__item--disabled-icn').removeClass('pb-media-screen__item--disabled-icn');
        });

        $(window).resize(function () {
            $('.pb-media-screen').each(function () {
                if ($(this).is(":visible"))
                    pageBuilder.responsiveMediaResize($(this));
            });
        });
    },
    responsiveMediaUpdate: function () {
        var val = $('#switch-preview').val();
        if (val == 'on') {
            $('.pb-editor__column-left .pb-media-screen').find('.pb-media-screen__item--selected').trigger('click');
        } else {
            $('.pb-blocks').css('max-width', '');
        }
    },
    responsiveMediaResize: function ($box) {
        var currentWidth = $('body').outerWidth();
        var selectedSize = parseInt($box.find('.pb-media-screen__item--selected').attr('data-media'));

        if (currentWidth > 1480)
            currentWidth = 1920;
        else if (currentWidth > 1245 && currentWidth < 1481)
            currentWidth = 1024;
        else if (currentWidth > 950 && currentWidth < 1246)
            currentWidth = 768;
        else if (currentWidth > 790 && currentWidth < 951)
            currentWidth = 480;
        else
            currentWidth = 320;

        if (currentWidth <= selectedSize)
            $box.find('.pb-media-screen__item--full').trigger('click');
    },
    freeImages: function (page, searchValue, isMoreLoad) {
        page = page || 1;
        var url = "https://api.unsplash.com/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" + page;
        var isSearch = false;
        searchValue = $.trim(searchValue);
        var $btn = $('.pb-more-free-images');
        var $list = $('.list-free-images > ul');

        if (searchValue !== '') {
            isSearch = true;
            url = "https://api.unsplash.com/search/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" + page + "&query=" + searchValue;
        }

        $.getJSON(url, function (data) {
            //console.log(data);
            var items = '';

            if (isSearch)
                data = data.results;

            $.each(data, function (key, val) {
                var imgURL = val.urls.regular;
                items += "<li class='list-free-images__item' id='" + key + "' style='background-image: url(" + imgURL + ")' data-url='" + imgURL + "'></li>";
            });

            if (isMoreLoad)
                $list.append(items);
            else
                $list.html(items);

            $btn.attr('data-page', parseInt(page) + 1);
        }).done(function () {
            //console.log("second success");
        }).fail(function () {
            //console.log("error");
        }).always(function () {
            //console.log("complete");
            $btn.removeClass('disabled');
            pageBuilder.draggableFreeImages();

            if ($list.find('li').length)
                $btn.show();
            else
                $btn.hide();

        });
        //Access Key
        //1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb
    },
    navItemInit: function () {
        $('.pb-field-item-name').on('keyup', function () {
            var val = $.trim($(this).val());
            var $widget = $('.pb-widget--selected');

            $widget.find('.pb-header-items__item-text').text(val);
            pageBuilder.setNewActionHistory();
        });

        $('.pb-field-item-link').on('keyup', function () {
            var val = $.trim($(this).val());
            var $widget = $('.pb-widget--selected');

            $widget.attr('href', val);
            pageBuilder.setNewActionHistory();
        });

        $('.pb-btn-add-menu-item').on('click', function () {
            var $widget = $('.pb-widget--selected');
            var $clone = '';

            if ($widget.hasClass('pb-header-items')) {
                $widget = $widget.find('.pb-header-items__item:last');
                $clone = $widget.clone();
                $widget.after($clone);
            } else {
                $clone = $widget.clone();
                $widget.after($clone);
                $widget.removeClass('pb-widget--selected');
            }
            $clone.removeAttr('data-idx').addClass('pb-widget--init').find('.pb-widget__shadow-label').text('Item');
            pageBuilder.initActionsElements();
            pageBuilder.isNavItem($clone, true);
            pageBuilder.setNewActionHistory();
        });

        $('.pb-btn-delete-menu-item:not(.disabled)').on('click', function () {
            var $widget = $('.pb-widget--selected');
            var $item = '';

            if ($widget.hasClass('pb-header-items'))
                $item = $widget.find('.pb-header-items__item:last');
            else
                $item = $widget;

            pageBuilder.removeWidget($item);
            pageBuilder.setNewActionHistory();
        });

        $('.pb-btn-open-menu').on('click', function () {
            var $widget = $('.pb-widget--selected');
            var $box = $widget.closest('.pb-header-items');
            var $btn = $(this);

            if ($box.hasClass('pb-header-items--mobile-show')) {
                $box.removeClass('pb-header-items--mobile-show');
                $btn.text('Show Menu');
            } else {
                $box.addClass('pb-header-items--mobile-show');
                $btn.text('Close Menu');
            }
            pageBuilder.setNewActionHistory();
        });
    },
    isNavItem: function ($widget, isAdd) {
        var $item = '';
        var count = 0;

        if ($widget.hasClass('pb-header-items'))
            $item = $widget.find('.pb-header-items__item:last');
        else
            $item = $widget;

        var count = $widget.siblings('.pb-header-items__item').length;

        if (isAdd)
            count += count;

        if (count > 1)
            $('.pb-btn-delete-menu-item').removeClass('disabled');
        else
            $('.pb-btn-delete-menu-item').addClass('disabled');
    },
    addNameWidget: function ($widget) {
        $widget.attr('data-name', $widget.children('.pb-widget__shadow-label:first').text());
    },
    setNameWidget: function ($el) {
        var $title = $el.find('.item__div .item__content:first');
        var val = $title.text();
        if (!$el.hasClass('list-widgets__item--edit')) {
            if ($el.hasClass('ui-item-widget-disabled'))
                $el.addClass('ui-item-widget-disabled--true');
            $el.addClass('ui-item-widget-disabled');
            $el.addClass('list-widgets__item--edit');
            $title.html('<input type="text" data-default-title="' + val + '" class="txt-field" value="' + val + '"/>');
            $title.find('.txt-field').focus();
            $title.find('.txt-field').change(function () {
                pageBuilder.editNameWidget($(this));
            });
            $title.find('.txt-field').on('blur', function () {
                pageBuilder.editNameWidget($(this));
                pageBuilder.setNewActionHistory();
            });
        }
    },
    editNameWidget: function ($this) {
        var val = $.trim($this.val());
        var $closest = $this.closest('.list-widgets__item');
        var idx = $closest.attr('data-idx');
        var type = $closest.attr('data-type');
        var classType = type;
        if (type === 'vertical-slideshow')
            classType = 'slideshow';
        if (val === '')
            val = $this.attr('data-default-title');
        $closest.removeClass('list-widgets__item--edit');
        if (!$closest.hasClass('ui-item-widget-disabled--true'))
            $closest.removeClass('ui-item-widget-disabled');
        $('.pb-widget--' + classType + '[data-idx="' + idx + '"]').attr('data-name', val).children('.pb-widget__shadow-label').text(val);
        $this.parent().html(val);
    },
    sliderGrid: function (id, values) {
        var slider = null;

        if (id === 'twoGridGrid') {
            slider = pageBuilder.sliderGridTwo;
        } else if (id === 'threeGridGrid') {
            slider = pageBuilder.sliderGridThree;
        } else if (id === 'unevenGridGrid') {
            slider = pageBuilder.sliderGridUneven;
        }

        if (slider !== null)
            slider.noUiSlider.destroy();

        slider = document.getElementById(id);
        noUiSlider.create(slider, {
            start: values,
            step: 1,
            margin: 5,
            range: {
                'min': [5],
                'max': [95]
            }
        });
        slider.noUiSlider.on('slide', function (values, handle) {
            pageBuilder.setGridSizeColumns($(this.target), values);
        });
        slider.noUiSlider.on('change', function (values, handle) {
            pageBuilder.setJSonGridColumns(values);
            pageBuilder.setWidthGridColumns($(this.target), values);
        });

        if (id === 'twoGridGrid') {
            pageBuilder.sliderGridTwo = slider;
        } else if (id === 'threeGridGrid') {
            pageBuilder.sliderGridThree = slider;
        } else if (id === 'unevenGridGrid') {
            pageBuilder.sliderGridUneven = slider;
        } else if (id === 'imgCaptionOneGrid') {
            pageBuilder.sliderImgCaptionOneGrid = slider;
        } else if (id === 'textColumnsWithImgGrid') {
            pageBuilder.sliderTextColumnsWithImgGrid = slider;
        } else if (id === 'imgCaptionTwoGrid') {
            pageBuilder.sliderImgCaptionTwoGrid = slider;
        } else if (id === 'twoTextColumnsGrid') {
            pageBuilder.sliderTwoTextColumnsGrid = slider;
        } else if (id === 'columnsCaptionGrid') {
            pageBuilder.sliderColumnsCaptionGrid = slider;
        }
    },
    numberColumns: function (id, val) {
        var start = [33, 66];
        var sliderId = null;

        if (val === '2') {
            start = [50];
        } else if (val === '3') {
            start = [33, 66];
        } else if (val === '4') {
            start = [25, 50, 75];
        } else if (val === '5') {
            start = [20, 40, 60, 80];
        }

        if (id === 'gridNumberColumnsTwo') {
            sliderId = 'twoGridGrid';
        } else if (id === 'gridNumberColumnsThree') {
            sliderId = 'threeGridGrid';
        } else {
            sliderId = 'unevenGridGrid';
        }
        pageBuilder.sliderGrid(sliderId, start);
        pageBuilder.setGridSizeColumns($('#' + sliderId), start);
        pageBuilder.setJSonGridColumns(start);
    },
    updateColumnsContent: function (id, numberColumns) {
        var $tpl = $('.pb-widget--selected');
        var content = [];
        var values = null;
        var $wrapGrid = $tpl.children('.pb-layout-grid');
        var numberColumns = null;
        var curentColumns = 0;

        if (id === 'gridNumberColumnsTwo') {
            sliderId = 'twoGridGrid';
            values = pageBuilder.sliderGridTwo.noUiSlider.get();
        } else if (id === 'gridNumberColumnsThree') {
            sliderId = 'threeGridGrid';
            values = pageBuilder.sliderGridThree.noUiSlider.get();
        } else {
            sliderId = 'unevenGridGrid';
            values = pageBuilder.sliderGridUneven.noUiSlider.get();
        }

        if (!Array.isArray(values)) {
            var oldValues = values;
            var values = [oldValues];
        }

        numberColumns = values.length + 1;
        var numberContent = 0;

        $wrapGrid.children('.pb-layout-grid__cell').each(function () {
            var $contentHTML = $(this).children('.pb-widget');

            if ($contentHTML.length) {
                content[numberContent] = $contentHTML.detach();
                numberContent++;
            }
        });

        $wrapGrid.children('.pb-layout-grid__cell').remove();
        $wrapGrid.removeClass('pb-layout-grid--2 pb-layout-grid--3 pb-layout-grid--4 pb-layout-grid--5 pb-layout-grid--uneven');
        $wrapGrid.addClass('pb-layout-grid--' + numberColumns);

        for (i = 0; i <= values.length; i++) {
            $wrapGrid.append('<div class="pb-layout-grid__cell"><div class="pb-helper-drag-drop pb-helper-drag-drop--small"><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div></div>');
        }

        for (i = 0; i < content.length; i++) {
            var mas = content[i];

            if (numberColumns == i) {
                numberColumns += numberColumns;
                curentColumns = 0;
            }

            for (j = 0; j < mas.length; j++) {
                $wrapGrid.children('.pb-layout-grid__cell').eq(curentColumns).addClass('pb-cell-contains-widget').append(mas[j]);
            }

            curentColumns++;
        }
        pageBuilder.setWidthGridColumns($('#' + sliderId), values);
        pageBuilder.dragDropColumns();
    },
    getSliderValues: function(opt) {
        var values = [];

        if (opt.numberColumns == '2') {
            values = [opt.gridSize1];
        } else if (opt.numberColumns == '3') {
            values = [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)];
        } else if (opt.numberColumns == '4') {
            values = [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2), parseInt(opt.gridSize1) + parseInt(opt.gridSize2) + parseInt(opt.gridSize3)];
        } else if (opt.numberColumns == '5') {
            values = [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2), parseInt(opt.gridSize1) + parseInt(opt.gridSize2) + parseInt(opt.gridSize3), parseInt(opt.gridSize1) + parseInt(opt.gridSize2) + parseInt(opt.gridSize3) + parseInt(opt.gridSize4)];
        }

        return values;
    },
    previewBox: function () {
        var $btn = $('#pbBtnPreview');
        var $box = $('.pb-preview-box');
        var $html = $('.wrap-pb-template').html();

        if ($btn.hasClass('ll-active')) {
            $('.btn-settings').show();
            $('.wrap-btn-history').show();
            $('.pb-versions').show();
            $('#preview_switch').show();
            $btn.removeClass('ll-active');
            $box.hide();
            pageBuilder.addIframePreview();//pageBuilder.iframePreviewContent.find("body").html('');
        } else {
            $('.btn-settings').hide();
            $('.wrap-btn-history').hide();
            $('.pb-versions').hide();
            $('#preview_switch').hide();
            $btn.addClass('ll-active');
            $box.show();
            $('.pb-preview-box .pb-media-screen .pb-media-screen__item--full').trigger('click');
            pageBuilder.iframePreviewContent.find("body").html($html);
            pageBuilder.iframePreviewContent.find("a").each(function () {
                $(this).attr('href', 'javascript:void(0);');
            });
            pageBuilder.resetStyleHTML(pageBuilder.iframePreviewContent.find("body"), true);
        }
    },
    addIframePreview: function () {
        $('.pb-preview-box').find('.pb-preview-box__inner').html('');
        $('.pb-preview-box').find('.pb-preview-box__inner').html('<iframe src="page_builder_preview.php" id="pb-preview-box__iframe" class="pb-preview-box__iframe"></iframe>');
        $('#pb-preview-box__iframe').off('load').on("load", function () {
            pageBuilder.iframePreviewContent = $("#pb-preview-box__iframe").contents();
            $('#pbBtnPreview').removeClass('disabled');
        });
    },
    resetStyleHTML: function ($html, is_move_style_to_body) {
        $html.find('.ui-sortable').removeClass('ui-sortable');
        $html.find('.ui-droppable').removeClass('ui-droppable');
        $html.find('.pb-widget--selected').removeClass('pb-widget--selected');
        $html.find('.pb-widget__btn-settings').hide();
        $html.find('.pb-widget, .pb-blocks').removeAttr('data-type data-json data-idx data-name');
        $html.find('[data-eqcss-0-0]').removeAttr('data-eqcss-0-0');
        $html.find('[data-eqcss-read]').removeAttr('data-eqcss-read');
        $html.find('.mce-content-body').removeAttr('id contenteditable').removeClass('mce-content-body');
        $html.find('.pb-widget__placeholder, .pb-widget__shadow-label, .pb-helper-drag-drop').remove();

        if (is_move_style_to_body) {
            //$html = $('body');
            var $templateDiv = $html.find('#pb-template');
            var style = $templateDiv.attr('style');
            var id = $templateDiv.attr('id');
            $html.attr('id', id).attr('style', style);
            $templateDiv.removeAttr('style').removeAttr('id');
        }
    },
    openUploaderInit: function(){
        $('.pb-btn-upload-image-computer').on('click', function(){
            $(this).val('');
        });
        $('.pb-btn-upload-image-computer').on('change', function(){
            var val = $(this).val();
            var file = document.getElementsByClassName('pb-btn-upload-image-computer')[0].files[0];
            var file_reader = new FileReader();
            file_reader.onload = function(e) {
                var contents = e.target.result;
                var $tpl = $('.pb-widget--selected');
                var opt = $tpl.data('json');
                if (contents === '') {
                    $tpl.addClass('pb-widget--svg-none');
                    $tpl.find('.pb-svg-box .pb-load-svg').addClass('pb-load-svg--none');
                } else {
                    $tpl.removeClass('pb-widget--svg-none');
                    $tpl.find('.pb-svg-box .pb-load-svg').removeClass('pb-load-svg--none');
                }
                $tpl.find('.pb-svg-box .pb-load-svg').html(contents);
                $('.pb-box-btn-upload-svg').removeClass('pb-box-btn-upload-svg--none');
                $('.pb-unload-svg__title').text(file.name);
                opt.svg_file_name = file.name;
                opt.count = '1';
                var fill = $tpl.find('.pb-svg-box .pb-load-svg').find('svg').attr('fill');
                if(typeof fill == 'undefined'){
                    $tpl.find('.pb-svg-box .pb-load-svg').find('svg').find('*').each(function(){
                        fill = $(this).attr('fill');
                        if(typeof fill != 'undefined' && fill && fill != 'none'){
                            return false;
                        }
                    });
                }
                if(typeof fill == 'undefined'){
                    fill = '#ffffff';
                }
                opt.fillColor = fill;
                $('#svgFillColor').colpickSetColor(opt.fillColor, true).css('background-color', opt.fillColor);
                var stroke = $tpl.find('.pb-svg-box .pb-load-svg').find('svg').attr('stroke');
                if(typeof stroke == 'undefined'){
                    $tpl.find('.pb-svg-box .pb-load-svg').find('svg').find('*').each(function(){
                        stroke = $(this).attr('stroke');
                        if(typeof stroke != 'undefined' && stroke && stroke != 'none'){
                            return false;
                        }
                    });
                }
                if(typeof stroke == 'undefined'){
                    stroke = '#ffffff';
                }
                opt.strokeColor = stroke;
                $('#svgStrokeColor').colpickSetColor(opt.strokeColor, true).css('background-color', opt.strokeColor);
                $tpl.attr('data-json', JSON.stringify(opt));
            }
            file_reader.readAsText(file);
            pageBuilder.setNewActionHistory();
        });
    },
    openUploader: function(onInsertCallback, inforce_browser_browse){
        if(typeof inforce_browser_browse == 'undefined'){
            inforce_browser_browse = false;
        }
        if(_moxiemanager_plugin && ! inforce_browser_browse){
            moxman.browse({
                view: 'thumbs',
                title: 'Media Manager',
                extensions:'jpg,jpeg,png,gif',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                //fileinfo_fields: 'path url',
                oninsert: function(args) {
                    if(args.files[0].url){
                        onInsertCallback(args.files[0]);
                    }
                }
            });
        } else {
            $('.pb-btn-upload-image-computer').trigger('click');
        }
    },
    editImage: function($el, indexImage, urlImage, $tpl, titleImage){
        var $tpl = $tpl ? $tpl : $('.pb-widget--selected');
        var $boxImg = $tpl.find('.pb-load-image').eq(indexImage);
        if($tpl.find('.pb-load-image').hasClass('pb-load-image--bg')){
            var current_src = $boxImg.attr('img-src');
        } else {
            var current_src = $boxImg.find('img').attr('src');
        }
        if(current_src.indexOf('?') !== -1){
            current_src = current_src.substring(0, current_src.indexOf('?'));
        }
        if(typeof current_src != 'undefined'){
            moxman.edit({
                path: current_src,
                title: 'Media Manager',
                onsave: function(args) {
                    if(args.file.url){
                        var img = args.file;
                        if(img.canPreview){
                            var urlImage = img.url + '?v=' + Math.random();
                            pageBuilder.insertImage($el, true, img);
                            pageBuilder.setNewActionHistory();
                        }
                    }
                }
            });
        } else {
        }
    },
    eventsHistory: function () {
        $('.pb-btn-prev-history').on('click', function (e) {
            e.preventDefault();
            if (!$(this).hasClass('disabled')) {
                var json = JSON.parse(sessionStorage.getItem('pbHistory'));
                json.variants[LandingPageBuilder.current_variant_id].pbCurrentHistory = ((pageBuilder.getCurrentHistory() - 1) >= 1) ? (pageBuilder.getCurrentHistory() - 1) : 1;
                sessionStorage.setItem('pbHistory', JSON.stringify(json));
                pageBuilder.addHTMLHistory();
            }
        });
        $('.pb-btn-next-history').on('click', function (e) {
            e.preventDefault();
            if (!$(this).hasClass('disabled')) {
                var json = JSON.parse(sessionStorage.getItem('pbHistory'));
                json.variants[LandingPageBuilder.current_variant_id].pbCurrentHistory = pageBuilder.getCurrentHistory() + 1;
                sessionStorage.setItem('pbHistory', JSON.stringify(json));
                pageBuilder.addHTMLHistory();
            }
        });
    },
    getCurrentHistory: function () {
        var json = JSON.parse(sessionStorage.getItem('pbHistory'));
        return json.variants[LandingPageBuilder.current_variant_id].pbCurrentHistory;
    },
    setHistoryHTML: function (variant_id) {
        var _history = JSON.parse(sessionStorage.getItem('pbHistory'));
        var currentHistory = _history.variants[variant_id].pbCurrentHistory;
        _history.variants[variant_id].versions = (_history.variants[variant_id].versions).slice(0, currentHistory);
        if((_history.variants[variant_id].versions).length > 20) {
            _history.variants[variant_id].versions = _history.variants[variant_id].versions.slice((_history.variants[variant_id].versions).length - 20)
        }
        //(_history.variants[variant_id].versions).push($('.wrap-pb-template').html());
        /*
         * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
         */
        (_history.variants[variant_id].versions).push(document.getElementsByClassName('wrap-pb-template')[0].innerHTML);
        _history.variants[variant_id].pbCurrentHistory = (_history.variants[variant_id].versions).length;
        sessionStorage.setItem('pbHistory', JSON.stringify(_history));
        pageBuilder.showHideBtnsHistory();
    },
    updateHistory: function () {
        pageBuilder.setHistoryHTML(LandingPageBuilder.current_variant_id);
        pageBuilder.resetActionHistory();
    },
    addHTMLHistory: function () {
        var currentHistory = pageBuilder.getCurrentHistory();
        var _history = JSON.parse(sessionStorage.getItem('pbHistory'));
        var version_html = _history.variants[LandingPageBuilder.current_variant_id].versions[currentHistory - 1];
        if(version_html){
            //$('.wrap-pb-template').html(version_html);
            /*
            * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
            */
            document.getElementsByClassName('wrap-pb-template')[0].innerHTML = version_html;
            $('.wrap-pb-template').find('.pb-widget--selected').removeClass('pb-widget--selected');
            $('.wrap-pb-template').find('.mce-content-body').removeAttr('id contenteditable').removeClass('mce-content-body');
            if(_history.variants[LandingPageBuilder.current_variant_id].form_id){

            }
            LandingPageBuilder.populate_draft_settings(_history.variants[LandingPageBuilder.current_variant_id]);
            pageBuilder.responsiveMediaUpdate();
            pageBuilder.initMoreEvents();
        } else {
            $('.wrap-pb-template #pb-template .pb-widget').remove()
            $('.pb-helper-drag-drop').show();
        }
        pageBuilder.showHideBtnsHistory();
    },
    showHideBtnsHistory: function () {
        var currentHistory = pageBuilder.getCurrentHistory();
        var _history = JSON.parse(sessionStorage.getItem('pbHistory'));
        var length = _history.variants[LandingPageBuilder.current_variant_id].versions.length;
        var $btnPrev = $('.pb-btn-prev-history');
        var $btnNext = $('.pb-btn-next-history');
        if (!$('.pb-settings-panel:visible').length) {
            if (currentHistory > 1) {
                $btnPrev.removeClass('disabled');
            } else {
                $btnPrev.addClass('disabled');
            }
            if (currentHistory < length) {
                $btnNext.removeClass('disabled');
            } else {
                $btnNext.addClass('disabled');
            }
        } else {
            $btnNext.addClass('disabled');
            $btnPrev.addClass('disabled');
        }
    },
    setVariantHistory: function (variant) {
        var json = JSON.parse(sessionStorage.getItem('pbHistory'));
        if(! json){
            json = {};
            json.variants = {};
        }
        json.variants[variant.landing_page_draft_id] = variant;
        json.variants[variant.landing_page_draft_id].versions = [];
        json.variants[variant.landing_page_draft_id].versions [0] = variant.advanced_builder_html;
        json.variants[variant.landing_page_draft_id].pbCurrentHistory = 1;
        json.variants[variant.landing_page_draft_id].is_deleted = 0;
        json.variants[variant.landing_page_draft_id].is_main_variant = 0;
        if(variant.landing_page_draft_id == LandingPageBuilder.main_variant_landing_page_draft_id){
            json.variants[variant.landing_page_draft_id].is_main_variant = 1;
        }
        pageBuilder.initMoreEvents();
        sessionStorage.setItem('pbHistory', JSON.stringify(json));
    },
    setNewActionHistory: function () {
        $('.wrap-pb-template').attr('isActionsHistory', "true");
    },
    resetActionHistory: function () {
        $('.wrap-pb-template').attr('isActionsHistory', false);
    },
    isNewHistory: function () {
        var isNewHistory = false;
        if ($('.wrap-pb-template').attr('isActionsHistory') == "true")
            isNewHistory = true;
        return isNewHistory;
    },
    addNewVariant: function (source_variant_id){
        var json = JSON.parse(sessionStorage.getItem('pbHistory'));
        var source_variant = json.variants[source_variant_id];
        var new_variant = source_variant;
        var variants_ids = Object.keys(json.variants);
        var max_new_id = 1;
        for(var i in variants_ids){
            var variant_id = variants_ids[i];
            if(variant_id.indexOf('new_') !== -1){
                var variant_id = parseInt(variant_id.replace('new_', ''));
                if(max_new_id <= variant_id){
                    max_new_id = ++variant_id;
                }
            }
        }
        new_variant.landing_page_draft_id = 'new_'+max_new_id;
        new_variant.is_active_variant = 0;
        new_variant.advanced_builder_html = json.variants[source_variant_id].versions[json.variants[source_variant_id].pbCurrentHistory-1];
        LandingPageBuilder.current_variant_id = new_variant.landing_page_draft_id;
        var new_variant_letter = pageBuilder.addNewBtnVersionHTML($('.pb-btn-add-new-version'), new_variant.landing_page_draft_id);
        new_variant.variant_draft_name = new_variant_letter;
        $('.pb-versions__btns .t-btn[data-draft-id="'+new_variant.landing_page_draft_id+'"]').addClass('selected').siblings('.t-btn').removeClass('selected');
        pageBuilder.setVariantHistory(new_variant);
        pageBuilder.addHTMLHistory();
    },
    versionsHTML: function () {
        $('body').on('click.dropdown-versions', function () {
            pageBuilder.hideDropdownForVersionsHTML();
        });
        $('.pb-versions__btns').on('click', '.t-btn', function (e) {
            e.preventDefault();
            e.stopPropagation();
            pageBuilder.hidePanelSettings();
            if (pageBuilder.isNewHistory()) {
                pageBuilder.updateHistory();
            }
            var $btn = $(this);
            if ($btn.hasClass('pb-btn-add-new-version')) {
                pageBuilder.addNewVariant(LandingPageBuilder.main_variant_landing_page_draft_id);
                pageBuilder.hideDropdownForVersionsHTML();
            } else {
                $btn.addClass('selected').siblings('.t-btn').removeClass('selected');
                LandingPageBuilder.current_variant_id = $btn.attr('data-draft-id');
                pageBuilder.addHTMLHistory();
                var _history = JSON.parse(sessionStorage.getItem('pbHistory'));
                var variant_object = _history.variants[LandingPageBuilder.current_variant_id];
                LandingPageBuilder.populate_draft_settings(variant_object);
            }
        });
        $('.pb-versions__btns').on('mouseenter', '.t-btn:not(.pb-btn-add-new-version)', function () {
            var $btn = $(this);
            pageBuilder.hideDropdownForVersionsHTML();
            pageBuilder.showDropdownForVersionsHTML($btn);
        });
        $('.pb-versions__btns').on('mouseenter', '.t-btn.pb-btn-add-new-version', function () {
            var $btn = $(this);
            pageBuilder.hideDropdownForVersionsHTML();
            pageBuilder.showDropDownForStartinWith($btn);
        });
        $('.pb-versions__dropdown').on('mouseleave', function () {
            pageBuilder.hideDropdownForVersionsHTML();
        });
        $('.pb-variants__dropdown').on('mouseleave', function () {
            pageBuilder.hideDropdownForVersionsHTML();
        });
        $('.pb-version__delete').on('click', function () {
            var delete_button = $(this);
            ll_confirm_popup_manager.open('Are you sure you want to delete this variant?', function() {
                var $btn = delete_button.parents('.pb-versions').find('.open-dropdown');
                pageBuilder.removeVersionHTML($btn);
                var current_hovering_variant_id = pageBuilder.current_hovering_variant_id;
                var json = JSON.parse(sessionStorage.getItem('pbHistory'));
                if (current_hovering_variant_id.indexOf('new_') !== -1) {
                    delete(json.variants[current_hovering_variant_id]);
                } else {
                    json.variants[current_hovering_variant_id].is_deleted = 1;
                }
                sessionStorage.setItem('pbHistory', JSON.stringify(json));
                if (pageBuilder.isNewHistory()) {
                    pageBuilder.updateHistory();
                }
                LandingPageBuilder.current_variant_id = LandingPageBuilder.main_variant_landing_page_draft_id;
                $('.pb-versions__btns .t-btn[data-draft-id="' + LandingPageBuilder.main_variant_landing_page_draft_id + '"]').trigger('click');
                pageBuilder.current_hovering_variant_id = 0;
            }, {}, function (){
                pageBuilder.current_hovering_variant_id = 0;
            });
        });
        $('.pb-version__activate').on('click', function () {
            //put activation green icon
            var current_hovering_variant_id = pageBuilder.current_hovering_variant_id;
            var variant_button = $('.pb-versions__btns .t-btn[data-draft-id="'+current_hovering_variant_id+'"]');
            variant_button.addClass('live-true');

            //update history
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            json.variants[current_hovering_variant_id].is_active_variant = 1;
            sessionStorage.setItem('pbHistory', JSON.stringify(json));

            //hide this
            $(this).hide();

            //show deactivate
            $('.pb-version__deactivate').show();
            pageBuilder.current_hovering_variant_id = 0;
        });
        $('.pb-version__deactivate').on('click', function () {
            //remove activation green icon
            var current_hovering_variant_id = pageBuilder.current_hovering_variant_id;
            var variant_button = $('.pb-versions__btns .t-btn[data-draft-id="'+current_hovering_variant_id+'"]');
            variant_button.removeClass('live-true');

            //update history
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            json.variants[current_hovering_variant_id].is_active_variant = 0;
            sessionStorage.setItem('pbHistory', JSON.stringify(json));

            //hide this
            $(this).hide();

            //show activate
            $('.pb-version__activate').show();
            pageBuilder.current_hovering_variant_id = 0;
        });
        $('.pb-version__set_as_main').on('click', function () {
            var current_hovering_variant_id = pageBuilder.current_hovering_variant_id;
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            json.variants[current_hovering_variant_id].is_main_variant = 1;
            json.variants[current_hovering_variant_id].is_active_variant = 1;
            json.variants[LandingPageBuilder.main_variant_landing_page_draft_id].is_main_variant = 0;
            sessionStorage.setItem('pbHistory', JSON.stringify(json));
            var variant_button = $('.pb-versions__btns .t-btn[data-draft-id="'+current_hovering_variant_id+'"]');
            variant_button.addClass('live-true');
            LandingPageBuilder.main_variant_landing_page_draft_id = current_hovering_variant_id;
            pageBuilder.hideDropdownForVersionsHTML();
            pageBuilder.current_hovering_variant_id = 0;
        });
        $('.pb-variants__dropdown-list').on('click', '.pb-variant', function (e) {
            pageBuilder.hidePanelSettings();
            if (pageBuilder.isNewHistory()) {
                pageBuilder.updateHistory();
            }
            var source_variant_id = $(this).attr('data-draft-id');
            pageBuilder.addNewVariant(source_variant_id);
        });
    },
    showDropdownForVersionsHTML: function($btn) {
        var $dropdown = $btn.parents('.pb-versions').find('.pb-versions__dropdown');
        var current_hovering_variant_id = $btn.attr('data-draft-id');
        if(current_hovering_variant_id != LandingPageBuilder.main_variant_landing_page_draft_id){
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            var btn_variant_object = json.variants[current_hovering_variant_id];
            if(current_hovering_variant_id == LandingPageBuilder.main_variant_landing_page_draft_id){
                $dropdown.find('.pb-version__delete').hide();
            } else {
                $dropdown.find('.pb-version__delete').show();
            }
            if(btn_variant_object.is_active_variant == 1){
                $dropdown.find('.pb-version__activate').hide();
                $dropdown.find('.pb-version__deactivate').show();
            } else {
                $dropdown.find('.pb-version__activate').show();
                $dropdown.find('.pb-version__deactivate').hide();
            }
            pageBuilder.current_hovering_variant_id = $btn.attr('data-draft-id');
            $btn.addClass('open-dropdown').siblings('.t-btn').removeClass('open-dropdown');
            var posLeft = $btn.position().left;
            $dropdown.css('left', posLeft + 'px').show();
        } else {
            pageBuilder.hideDropdownForVersionsHTML();
        }
    },

    showDropDownForStartinWith: function ($btn){
        if($('.pb-versions__btns .t-btn:not(.pb-btn-add-new-version)').length < 10){
            var posLeft = $btn.position().left;
            var $dropdown = $btn.parents('.pb-versions').find('.pb-variants__dropdown');
            var $list = $dropdown.find('.pb-variants__dropdown-list');
            $list.html('');
            $('.pb-versions__btns .t-btn:not(.pb-btn-add-new-version)').each(function (){
                $list.append('<li><a href="javascript:void(0);" class="pb-variant" data-draft-id="'+$(this).attr("data-draft-id")+'">'+($.trim($(this).text())).toUpperCase()+'</a></li>');
            });
            $btn.addClass('open-dropdown').siblings('.t-btn').removeClass('open-dropdown');
            $dropdown.css('left', posLeft + 'px').show();
        } else {
            this.hideDropdownForVersionsHTML();
        }
    },

    hideDropdownForVersionsHTML: function () {
        $('.open-dropdown').removeClass('.open-dropdown');
        $('.pb-versions__dropdown').hide();
        $('.pb-variants__dropdown').hide();
    },

    addNewBtnVersionHTML: function ($btn, draft_id) {
        var letter = pageBuilder.generateLetter($btn);
        var countCurrentBtns = pageBuilder.getCountCurrentBtns($btn);
        if (countCurrentBtns < pageBuilder.maxVersionsHTML && $.trim($btn.parent().find('.t-btn:not(.pb-btn-add-new-version):last').html()).toUpperCase().charCodeAt(0) < pageBuilder.endCharCode) {
            $btn.before('<a href="javascript:void(0);" class="t-btn t-btn-gray" data-draft-id="'+draft_id+'">' + String.fromCharCode(letter) + '</a>');
        }
        pageBuilder.isLockedBtn($btn);
        return (String.fromCharCode(letter)).toLowerCase();
    },

    isLockedBtn: function ($btn) {
        if (pageBuilder.getCountCurrentBtns($btn) >= pageBuilder.maxVersionsHTML || $.trim($btn.parent().find('.t-btn:not(.pb-btn-add-new-version):last').html()).toUpperCase().charCodeAt(0) >= pageBuilder.endCharCode) {
            pageBuilder.disabledBtnNewVersion($btn);
        } else {
            pageBuilder.enabledBtnNewVersion($btn);
        }
    },

    getCountCurrentBtns: function ($btn) {
        return $btn.parent().find('.t-btn:not(.pb-btn-add-new-version)').length;
    },

    generateLetter: function ($btn) {
        /*
        var countCurrentBtns = pageBuilder.getCountCurrentBtns($btn);
        return pageBuilder.startCharCode + countCurrentBtns;
        */
        var currentCharCode = $.trim($btn.parent().find('.t-btn:not(.pb-btn-add-new-version):last').html()).toUpperCase().charCodeAt(0);
        if (currentCharCode < pageBuilder.startCharCode) {
            currentCharCode = pageBuilder.startCharCode;
        }
        return currentCharCode + 1;
    },

    refreshAllLetters: function ($btns) {
        $btns.each(function (i) {
            $(this).text(String.fromCharCode(pageBuilder.startCharCode + i));
        });
    },

    removeVersionHTML: function ($btn) {
        var isSelected = false;
        var $box = $btn.parents('.pb-versions');
        var countBtns = pageBuilder.getCountCurrentBtns($btn);
        if ($btn.hasClass('selected')) {
            isSelected = true;
        }
        if (countBtns > 1) {
            $btn.remove();
            if (isSelected) {
                $box.find('.t-btn:first').addClass('selected');
            }
            //pageBuilder.refreshAllLetters($box.find('.t-btn:not(.pb-btn-add-new-version)'));
            pageBuilder.isLockedBtn($box.find('.pb-btn-add-new-version'));
        }
    },

    disabledBtnNewVersion: function ($btn) {
        $btn.addClass('disabled');
    },

    enabledBtnNewVersion: function ($btn) {
        $btn.removeClass('disabled');
    },

    checkIsLinkTo: function ($tpl, opt){
        var $link = $tpl.find(".pb-widget__content a");
        var html = "";
        var $boxContent = $tpl.find('.pb-widget__content');

        if(opt.imageLinkto) $boxContent = $boxContent.find('.pb-load-image');

        if(opt.iconLinkto == "none" || opt.imageLinkto == "none"){
            if($link.length){
                html = $link.html();
                $link.parent().html(html);
            }
        } else{
            if(!$link.length){
                html = $boxContent.html();
                if(!opt.url) opt.url = "";
                $boxContent.html("<a href='" + opt.url +"'>" + html + "</a>");
            }
        }
    },

    initModalLinkTo: function ($btn){
        if($btn.attr("modal-id")) return false;
        var id = new Date().valueOf();
        var $template = $('#pb-template');

        $btn.attr("modal-id", id);

        var htmlModal = "<div class='ll-lp-modal__fade' id='ll-lp-modal-" + id + "'><div class='ll-lp-modal__table'><div class='ll-lp-modal__table-cell'><div class='ll-lp-modal'><div class='ll-lp-modal__btn-close'></div><div class='ll-lp-modal__content'></div></div></div></div></div>";
        $template.append(htmlModal);
    },

    destroyModalLinkTo: function ($btn){
        if(!$btn.attr("modal-id")) return false;
        var id = $btn.attr("modal-id");

        $('#pb-template').find('#ll-lp-modal-' + id).remove();
        $btn.removeAttr("modal-id");
    },

    resetModalLinkTo: function ($tpl, opt){
        opt.modalView = "html";
        opt.modalWidth = 500;
        opt.modalHeight = 300;
        opt.modalIFrameUrl = "";
        $tpl.attr('data-json', JSON.stringify(opt));
    },

    getContentModal: function(val){
        var $tpl = $('.pb-widget--selected');
        var id = $tpl.find('.pb-widget__content a').attr('modal-id');
        var html = $('#ll-lp-modal-' + id).find('.ll-lp-modal__content').html();

        return html;
    },

    setContentModal: function(val){
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var id = $tpl.find('.pb-widget__content a').attr('modal-id');
        var $modal = $('#ll-lp-modal-' + id);

        $modal.find('.ll-lp-modal__content').html(val);

        if(opt.modalView == "iframe"){
            if($modal.find('iframe').length){
                if(typeof opt.modalIFrameLoading == 'undefined' || opt.modalIFrameLoading == 'page'){
                    $modal.find('iframe').attr('src', opt.modalIFrameUrl);
                } else {
                    $modal.attr('iframe-src', opt.modalIFrameUrl);
                }
            } else{
                if(typeof opt.modalIFrameLoading == 'undefined' || opt.modalIFrameLoading == 'page'){
                    $modal.find('.ll-lp-modal').prepend("<iframe onload='this.contentWindow.focus()' class='page_loading' src='" + opt.modalIFrameUrl + "'></iframe>");
                } else {
                    $modal.find('.ll-lp-modal').prepend("<iframe onload='this.contentWindow.focus()' class='popup_loading'></iframe>");
                }
            }
        } else{
            $modal.removeAttr('iframe-src');
            $modal.find('.ll-lp-modal > iframe').remove();
        }
    },

    refreshModalIframeOptions: function (modalIFrameLoading, modalIFrameUrl, $modal){
        $modal.find('.ll-lp-modal > iframe').removeClass('page_loading').removeClass('popup_loading');
        $modal.removeAttr('iframe-src');
        $modal.find('.ll-lp-modal > iframe').removeAttr('src');
        if(typeof modalIFrameLoading == 'undefined' || modalIFrameLoading == 'page'){
            $modal.find('.ll-lp-modal > iframe').attr('src', modalIFrameUrl);
            $modal.find('.ll-lp-modal > iframe').addClass('page_loading')
        } else {
            console.log("hehhehe")
            $modal.attr('iframe-src', modalIFrameUrl);
            $modal.find('.ll-lp-modal > iframe').addClass('popup_loading')
        }
    },

    setModalPosition: function(id, position){
        var $modal = $('#ll-lp-modal-' + id);

        $modal.removeClass('ll-lp-modal--pos-top ll-lp-modal--pos-bottom');

        if(position == "top"){
            $modal.addClass('ll-lp-modal--pos-top');
        } else if(position == "bottom"){
            $modal.addClass('ll-lp-modal--pos-bottom');
        }
    }
};
$(document).ready(function () {
    pageBuilder.init();
    pageBuilder.versionsHTML();
    var _supportsLocalStorage = !!window.localStorage
        && $.isFunction(localStorage.getItem)
        && $.isFunction(localStorage.setItem)
        && $.isFunction(localStorage.removeItem);
    if (_supportsLocalStorage) {
        sessionStorage.clear();
        pageBuilder.eventsHistory();
    } else {
        $('.wrap-btn-history').addClass('wrap-btn-history--hide');
    }
});