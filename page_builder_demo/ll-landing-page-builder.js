/**
 * Created by noha azab on 8/1/2018.
 */

var LandingPageBuilder = {

    landing_page_id: landing_page_id,
    main_variant_landing_page_draft_id: main_variant_landing_page_draft_id,
    is_settings_popup_loaded: false,
    is_custom_forms_popup_loaded: false,
    is_activations_popup_loaded: false,
    cashed_custom_forms: {},
    cached_activations: {},
    form_id: 0,
    landing_page: null,
    current_variant_id: main_variant_landing_page_draft_id,
    is_custom_forms_loaded_first: false,

    init: function () {
        $('#exit_and_donot_save').click(function(){
            ll_popup_manager.open('#ll_popup_manage_confirm_exit');
        });

        $('#ll_popup_manage_confirm_exit_cancel').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit');
        });

        $('#ll_popup_manage_confirm_exit_go').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit');
            window.location.href = 'manage-landing-pages.php';
        });

        $('#ll_popup_manage_confirm_exit_save_and_exit').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit');
            LandingPageBuilder.save(true);
        });

        $('body').on('click', function(){
            $('.settings-tpl.open').removeClass('open');
        });

        $('.settings-tpl > a.db-btn-white').on('click', function(e){
            e.stopPropagation();
            $(this).parent().toggleClass('open');
            return false;
        });

        $('.page_settings').click(function () {
            LandingPageBuilder.open_settings_popup();
        });

        $('.publish_page').click(function (){
            LandingPageBuilder.save(false, true);
        });

        $('.unpublish_page').click(function (){
            LandingPageBuilder.publish_page(0);
        });

        $('.add_meta_data').click(function () {
            LandingPageBuilder.add_meta_data_box();
        });

        $('.save_page').click(function () {
            if (pageBuilder.isNewHistory()){
                pageBuilder.updateHistory();
            }
            LandingPageBuilder.save(false);
        });

        $('textarea[name="js_tracking_code"]').keyup(function (){
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            var current_variant = json.variants[LandingPageBuilder.current_variant_id];
            current_variant.js_tracking_code = $(this).val();
            sessionStorage.setItem('pbHistory', JSON.stringify(json));
        });

        $('textarea[name="custom_meta_data"]').keyup(function (){
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            var current_variant = json.variants[LandingPageBuilder.current_variant_id];
            current_variant.edit_head_html = $(this).val();
            sessionStorage.setItem('pbHistory', JSON.stringify(json));
        });

        $('input.meta_data[name="title"]').change(function (){
            LandingPageBuilder.update_history_meta_data();
        });

        $('textarea.meta_data[name="description"]').change(function (){
            LandingPageBuilder.update_history_meta_data();
        });

        this.load_landing_page_info(function (response) {
            if(typeof response.landing_page != 'undefined'){
                LandingPageBuilder.landing_page = response.landing_page;
            }
            if(typeof response.landing_page_drafts != 'undefined'){
                var json = {};
                json.variants = {};
                sessionStorage.setItem('pbHistory', JSON.stringify(json));
                if(Object.keys(response.landing_page_drafts).length > 0){
                    for(var i in response.landing_page_drafts){
                        var landing_page_draft = response.landing_page_drafts[i];
                        pageBuilder.setVariantHistory(landing_page_draft);
                        if(landing_page_draft.landing_page_draft_id == LandingPageBuilder.main_variant_landing_page_draft_id){
                            LandingPageBuilder.populate_draft_data(landing_page_draft);
                        }
                    }
                }
            }
        });

        if($('.pb-versions__btns .t-btn:not(.pb-btn-add-new-version)').length == 10){
            pageBuilder.disabledBtnNewVersion($('.pb-btn-add-new-version'));
        }
    },

    load_landing_page_info: function (callback) {
        var data = {};
        data.action = 'LOAD_LANDING_PAGE_INFO';
        data.landing_page_id = this.landing_page_id;
        $.ajax({
        	url: 'landing-page-builder-process.php',
        	data: data,
        	type: 'POST',
        	success: function (response) {
                if(response.success == 1){
                    callback(response);
                } else {
                    ll_fade_manager.fade(false);
                }
        	},
        	error: function () {
                ll_fade_manager.fade(false);
        	}
        });
    },

    populate_draft_settings: function (landing_page_draft){
        $('input.meta_data[name="title"]').val('');
        $('textarea.meta_data[name="description"]').val('');
        $('.pb-list-group-social.custom_meta_data').html('');
        var $favicon_box = $('.upload_page_favicon').closest('.favicon_upload_contianer');
        $favicon_box.find('.pb-unload-favicon .pb-unload-favicon__title').text('');
        $favicon_box.find('.pb-unload-favicon').hide();
        $('.upload_page_favicon').show();
        var $cover_image_box = $('.upload_page_cover').closest('.cover_upload_contianer');
        $cover_image_box.find('.pb-unload-cover .pb-unload-cover__title').text('');
        $cover_image_box.find('.pb-unload-cover').hide();
        $('.upload_page_cover').show();
        if(typeof landing_page_draft.meta_data != 'undefined' && Object.keys(landing_page_draft.meta_data).length > 0){
            for (var i in landing_page_draft.meta_data){
                var meta_data_item = landing_page_draft.meta_data[i];
                switch(meta_data_item.meta_data_name){
                    case 'title':
                        if(meta_data_item.meta_data_value){
                            $('input.meta_data[name="title"]').val(meta_data_item.meta_data_value);
                        }
                        break;
                    case 'description':
                        if(meta_data_item.meta_data_value){
                            $('textarea.meta_data[name="description"]').val(meta_data_item.meta_data_value);
                        }
                        break;
                    case 'favicon':
                        if(meta_data_item.meta_data_value){
                            var $tpl = $('#pb-template');
                            var opt = $tpl.data('json');
                            opt.favicon = meta_data_item.meta_data_value;
                            $tpl.attr('data-json', JSON.stringify(opt));
                            var fileName = pageBuilder.getBgImageName(meta_data_item.meta_data_value);
                            var $box = $('.upload_page_favicon').closest('.favicon_upload_contianer');
                            $box.find('.pb-unload-favicon .pb-unload-favicon__title').text(fileName);
                            $box.find('.pb-unload-favicon .pb-unload-favicon__title').attr('favicon_url', meta_data_item.meta_data_value);
                            $box.find('.pb-unload-favicon').show();
                            $('.upload_page_favicon').hide();
                        }
                        break;
                    case 'cover':
                        if(meta_data_item.meta_data_value){
                            var $tpl = $('#pb-template');
                            var opt = $tpl.data('json');
                            opt.cover = meta_data_item.meta_data_value;
                            $tpl.attr('data-json', JSON.stringify(opt));
                            var fileName = pageBuilder.getBgImageName(meta_data_item.meta_data_value);
                            var $box = $('.upload_page_cover').closest('.cover_upload_contianer');
                            $box.find('.pb-unload-cover .pb-unload-cover__title').text(fileName);
                            $box.find('.pb-unload-cover .pb-unload-cover__title').attr('cover_url', meta_data_item.meta_data_value);
                            $box.find('.pb-unload-cover').show();
                            $('.upload_page_cover').hide();
                        }
                        break;
                    default:
                        this.add_meta_data_box(meta_data_item);
                }
            }
        }

        $('textarea[name="custom_meta_data"]').val('');
        if(typeof landing_page_draft.edit_head_html != 'undefined' && landing_page_draft.edit_head_html){
            $('textarea[name="custom_meta_data"]').val(landing_page_draft.edit_head_html);
        }

        $('textarea[name="js_tracking_code"]').val('');
        if(typeof landing_page_draft.js_tracking_code != 'undefined' && landing_page_draft.js_tracking_code){
            $('textarea[name="js_tracking_code"]').val(landing_page_draft.js_tracking_code);
        }

        this.form_id = 0;
        if(typeof landing_page_draft.form_id != 'undefined' && landing_page_draft.form_id != 0){
            this.form_id = landing_page_draft.form_id;
        } else if($('.pb-widget--custom-form').length > 0){
            this.form_id = $('.pb-widget--custom-form').attr('data-form-id');
        }

        if(this.form_id){
            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
            json.variants[LandingPageBuilder.current_variant_id].form_id = this.form_id;
            sessionStorage.setItem('pbHistory', JSON.stringify(json));
            this.load_custom_form(this.form_id);
        }

        $('.custom-fonts-container-line-criteria').html('');
        custom_fonts_manager.load_fonts('#pb-template');

        if(! this.is_custom_forms_loaded_first){
            $('.custom-fonts-container-line-criteria input[type=text]').live('change', function (){
                pageBuilder.setNewActionHistory();
                if (pageBuilder.isNewHistory())
                    pageBuilder.updateHistory();
            });
            this.is_custom_forms_loaded_first = true;
        }

    },

    populate_draft_data: function (landing_page_draft){
        if(typeof landing_page_draft.advanced_builder_html != 'undefined' && landing_page_draft.advanced_builder_html){
            //$('.pb-editor__column-left #pb-template').replaceWith(landing_page_draft.advanced_builder_html);
            if (landing_page_draft.advanced_builder_html.indexOf ('pb-template') != -1) {
                document.getElementById('pb-template').outerHTML = landing_page_draft.advanced_builder_html;
            } else {
                document.getElementById('pb-template').innerHTML = landing_page_draft.advanced_builder_html;
            }
            pageBuilder.initEditorInline();
        }

        this.populate_draft_settings(landing_page_draft);

        $('.pb-widget:not(.pb-widget--svg):not(.pb-widget--icon):not(.pb-widget--field):not(.pb-widget--video):not(.pb-widget--button):not(.pb-widget--code)').each(function (){
            pageBuilder.dropFreeImages($(this));
        });
        pageBuilder.globalBackGroundSetFreeImages();
        pageBuilder.dragableElements();
        pageBuilder.draggableFreeImages();
        pageBuilder.colorBox();
        pageBuilder.updateIndividualOptions();
        pageBuilder.sortableImageGroup();
        pageBuilder.codeBox.init();
        pageBuilder.videoBox.init();
        pageBuilder.socialIconAction();
        pageBuilder.sortableSocial();
        pageBuilder.widgetTree();
        pageBuilder.responsiveMedia();
        pageBuilder.navItemInit();
        pageBuilder.initMoreEvents();

        ll_fade_manager.fade(false);
    },

    open_custom_forms_popup: function (){
        if(! this.is_custom_forms_popup_loaded){
            this.draw_custom_forms_popup();
            this.is_custom_forms_popup_loaded = true;
        }

        if(Object.keys(this.cashed_custom_forms).length == 0) {
            this.load_custom_forms(function () {
                ll_popup_manager.open('#custom_forms_popup');
            });
        } else {
            ll_combo_manager.set_selected_value('#custom_forms_popup select[name="custom_forms"]', 0);
            ll_popup_manager.open('#custom_forms_popup');
        }
    },

    draw_custom_forms_popup: function () {
        var _html = '';
        _html += '<div class="ll-popup" id="custom_forms_popup">';
        _html += '  <div class="ll-popup-head">';
        _html += '      Custom Forms';
        _html += '  </div>';
        _html += '  <div class="ll-popup-content">';
        _html += '      <div class="form">';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <select class="txt-field txt-field-wide" name="custom_forms" data-placeholder="Select form"></select>';
        _html += '          </div>';
        _html += '      </div>';
        _html += '  </div>';
        _html += '  <div class="ll-popup-footer clearfix">';
        _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_custom_forms_popup">Cancel</a>';
        _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_add_custom_form">Add</a>';
        _html += '  </div>';
        _html += '</div>';

        $('#builderWrapper').append(_html);
        this.apply_custom_forms_popup_actions();
    },

    apply_custom_forms_popup_actions: function () {
        ll_combo_manager.make_combo('#custom_forms_popup select[name="custom_forms"]');

        $('#custom_forms_popup .btn_cancel_custom_forms_popup').click(function () {
            ll_popup_manager.close('#custom_forms_popup');
        });

        $('#custom_forms_popup .btn_add_custom_form').click(function () {
            var selected_form_id = ll_combo_manager.get_selected_value('#custom_forms_popup select[name="custom_forms"]');
            if(selected_form_id != 0){
                if(!$('#pb-template .pb-widget[data-type="custom-form"]').length) {
                    LandingPageBuilder.form_id = selected_form_id;
                    var dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
                    var form_html = "<div class='pb-widget pb-widget--init pb-widget--custom-form' data-type='custom-form' data-form-id='" + selected_form_id + "' data-json='" + dataJson + "'>"
                        + '<div class="pb-widget__content">'
                        + '</div>'
                        + pageBuilder.getWidgetHTMLPlaceholder()
                        + pageBuilder.getWidgetHTMLLabel('custom-form')
                        + pageBuilder.getWidgetHTMLBtnRemove()
                        + '</div>';
                    pageBuilder.current_custom_form_element.replaceWith(form_html);
                    pageBuilder.initActionsElements('custom-form');
                    pageBuilder.showHideHelpDragDropBox($('.pb-blocks'));
                    LandingPageBuilder.load_custom_form(selected_form_id, function (form_id) {
                        var json = JSON.parse(sessionStorage.getItem('pbHistory'));
                        json.variants[LandingPageBuilder.current_variant_id].form_id = form_id;
                        sessionStorage.setItem('pbHistory', JSON.stringify(json));
                        pageBuilder.setNewActionHistory();
                        if (pageBuilder.isNewHistory()) {
                            pageBuilder.updateHistory();
                        }
                    });
                    ll_popup_manager.close('#custom_forms_popup');
                } else {
                    show_error_message("Only one form may be added to your pagesss");
                }
            } else {
                show_error_message('Select a form to add');
            }
        });
    },

    load_custom_forms: function (callback) {
        var data = {};
        data.action = 'LOAD_CUSTOM_FORMS';
        ll_fade_manager.fade(true, 'load');
        $.ajax({
            url: 'landing-page-builder-process.php',
            data: data,
            type: 'POST',
            success: function (response) {
                ll_fade_manager.fade(false);
                if(response.success == 1){
                    if(typeof response.custom_forms != 'undefined'){
                        LandingPageBuilder.cashed_custom_forms = response.custom_forms;
                        LandingPageBuilder.populate_custom_forms_dropdown();
                    }
                    callback();
                }
            },
            error: function () {
                ll_fade_manager.fade(false);
            }
        });
    },

    populate_custom_forms_dropdown: function () {
        ll_combo_manager.clear_all('#custom_forms_popup select[name="custom_forms"]');
        ll_combo_manager.add_option('#custom_forms_popup select[name="custom_forms"]', 0, '');
        if(Object.keys(this.cashed_custom_forms).length > 0){
            for (var i in this.cashed_custom_forms){
                var form = this.cashed_custom_forms[i];
                ll_combo_manager.add_option('#custom_forms_popup select[name="custom_forms"]', form.id, form.name);
            }
        }
    },

    load_custom_form: function(selected_form_id, callback){
        if(typeof callback == 'undefined'){
            callback = function(){};
        }
        ll_fade_manager.fade(true, 'load');
        $.ajax({
            type: "GET",
            async: true,
            url: "web-form-render-html.php?ll_preview=1&id=" + selected_form_id,
            cache: false,
            success: function(html){
                ll_fade_manager.fade(false);
                if(html.indexOf('Error') == 0){
                    show_error_message(html);
                }else{
                    callback(selected_form_id);
                    $('.pb-widget--custom-form .pb-widget__content').html(html);
                    init_page.init_controls();
                    $('.pb-widget--custom-form .pb-widget__content #notifyMsg').remove();
                    $('.pb-widget--custom-form .pb-widget__content link[data-sub-rel="custom_css_file"]').remove();
                    if($('.pb-widget--custom-form').closest('.pb-layout-grid__cell').length > 0){
                        pageBuilder.showHideHelpDragDropCell($('.pb-widget--custom-form').closest('.pb-layout-grid__cell'));
                    }
                }
            },
            error: function(er){
                ll_fade_manager.fade(false);
                show_error_message('Connection error');
            }
        });
    },

    open_settings_popup: function (){
        if(! this.is_settings_popup_loaded){
            this.draw_settings_popup();
            this.is_settings_popup_loaded = true;
        }
        this.load_settings_popup_data(function () {
            ll_popup_manager.open('#landing_page_settings_popup');
        });
    },

    draw_settings_popup: function () {
        var _html = '';
        _html += '<div class="ll-popup" id="landing_page_settings_popup">';
        _html += '  <div class="ll-popup-head">';
        _html += '      Settings';
        _html += '  </div>';
        _html += '  <div class="ll-popup-content">';
        _html += '      <div class="form">';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <div class="label"><label>Name</label></div>';
        _html += '              <input type="text" class="txt-field" name="page_name" />';
        _html += '          </div>';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <div class="label"><label>Vanity URL</label></div>';
        _html += '              <select name="vanity_url" data-placeholder="Select Vanity URL">';
        _html += '              </select>';
        _html += '          </div>';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <div class="label"><label>Vanity Name</label></div>';
        _html += '              <input type="text" class="txt-field" name="vanity_name" />';
        _html += '          </div>';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <div class="label"><label>Page URL</label></div>';
        _html += '              <span name="page_url"></span>';
        _html += '          </div>';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <div class="label"><label>Campaign</label></div>';
        _html += '              <select name="abstract_campaign" data-placeholder="Select Campaign">';
        _html += '              </select>';
        _html += '          </div>';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <div class="label"><label>Description</label></div>';
        _html += '              <textarea type="text" class="txt-field" name="page_description"></textarea>';
        _html += '          </div>';
        _html += '      </div>';
        _html += '  </div>';
        _html += '  <div class="ll-popup-footer clearfix">';
        _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_landing_page_settings_popup">Cancel</a>';
        _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_landing_page_settings">Save</a>';
        _html += '  </div>';
        _html += '</div>';

        $('#builderWrapper').append(_html);
        this.apply_actions();
    },

    apply_actions: function () {
        ll_combo_manager.make_combo('#landing_page_settings_popup select[name="vanity_url"]');
        ll_combo_manager.event_on_change('#landing_page_settings_popup select[name="vanity_url"]', function () {
            $('#landing_page_settings_popup span[name="page_url"]').html(ll_combo_manager.get_selected_text('#landing_page_settings_popup select[name="vanity_url"]') + '/' + $('#landing_page_settings_popup input[name="vanity_name"]').val());
        });
        ll_combo_manager.make_combo('#landing_page_settings_popup select[name="abstract_campaign"]');

        $('#landing_page_settings_popup input[name="vanity_name"]').keyup(function () {
            var selected_vanity_url = ll_combo_manager.get_selected_text('#landing_page_settings_popup select[name="vanity_url"]');
            if(! selected_vanity_url){
                selected_vanity_url = "[Set primary domain <a target='_blank' href='manage-domains-configurations.php'>here</a>]";
            }
            $('#landing_page_settings_popup span[name="page_url"]').html(ll_combo_manager.get_selected_text('#landing_page_settings_popup select[name="vanity_url"]') + '/' + $(this).val());
        });

        $('#landing_page_settings_popup .btn_cancel_landing_page_settings_popup').click(function () {
            ll_popup_manager.close('#landing_page_settings_popup');
        });

        $('#landing_page_settings_popup .btn_save_landing_page_settings').click(function () {
            LandingPageBuilder.save_settings();
        });
    },

    load_settings_popup_data: function (callback) {
        var data = {};
        data.action = 'LOAD_SETTINGS_POPUP_INFO';
        data.landing_page_id = this.landing_page_id;
        $.ajax({
        	url: 'landing-page-builder-process.php',
        	data: data,
        	type: 'POST',
        	success: function (response) {
                if(response.success == 1){
                    LandingPageBuilder.populate_settings_popup_data(response);
                    callback();
                }
        	},
        	error: function () {

        	}
        });
    },

    populate_settings_popup_data: function (response) {
        if(typeof response.ll_abstract_campaigns != 'undefined'){
            if(Object.keys(response.ll_abstract_campaigns).length > 0){
                ll_combo_manager.clear_all('#landing_page_settings_popup select[name="abstract_campaign"]');
                ll_combo_manager.add_option('#landing_page_settings_popup select[name="abstract_campaign"]', '0', '');
                for(var i in response.ll_abstract_campaigns){
                    var campaign = response.ll_abstract_campaigns[i];
                    ll_combo_manager.add_option('#landing_page_settings_popup select[name="abstract_campaign"]', campaign.ll_abstract_campaign_id, campaign.abstract_campaign_name);
                }
            }
        }

        if(typeof response.customer_subdomains != 'undefined'){
            if(response.customer_subdomains.length > 0){
                ll_combo_manager.clear_all('#landing_page_settings_popup select[name="vanity_url"]');
                ll_combo_manager.add_option('#landing_page_settings_popup select[name="vanity_url"]', '0', '');
                for(var i in response.customer_subdomains){
                    var subdomain = response.customer_subdomains[i];
                    if(subdomain.is_ssl == 1){
                        subdomain.subdomain = 'https://' + subdomain.subdomain;
                    } else {
                        subdomain.subdomain = 'http://' + subdomain.subdomain;
                    }
                    var is_selected = false;
                    if(subdomain.is_primary == 1){
                        is_selected = true;
                    }
                    ll_combo_manager.add_option('#landing_page_settings_popup select[name="vanity_url"]', subdomain.customer_subdomain_id, subdomain.subdomain, is_selected);
                }
            }
        }

        if(typeof response.landing_page != 'undefined'){
            $('#landing_page_settings_popup input[name="page_name"]').val(response.landing_page.landing_page_name);
            $('#landing_page_settings_popup textarea[name="page_description"]').val(response.landing_page.landing_page_description);
            $('#landing_page_settings_popup input[name="vanity_name"]').val(response.landing_page.landing_page_custom_url);
            ll_combo_manager.set_selected_value('#landing_page_settings_popup select[name="vanity_url"]', response.vanity_url.customer_subdomain_id);
            ll_combo_manager.trigger_event_on_change('#landing_page_settings_popup select[name="vanity_url"]');
            if(typeof response.landing_page.ll_campaign != 'undefined' && response.landing_page.ll_campaign.ll_abstract_campaign_id){
                ll_combo_manager.set_selected_value('#landing_page_settings_popup select[name="abstract_campaign"]', response.landing_page.ll_campaign.ll_abstract_campaign_id);
            }
        }
    },

    collect_landing_page_settings: function () {
        var settings = {};
        settings.page_name = $('#landing_page_settings_popup input[name="page_name"]').val();
        if(! settings.page_name){
            show_error_message('Name required');
            return false;
        }
        settings.vanity_url_id = ll_combo_manager.get_selected_value('#landing_page_settings_popup select[name="vanity_url"]');
        settings.vanity_name = $('#landing_page_settings_popup input[name="vanity_name"]').val();
        if(! settings.vanity_name){
            show_error_message('Vanity name required');
            return false;
        }
        if(! settings.vanity_name.match(/^[a-zA-Z0-9\_\-]+$/)){
            show_error_message('Only capital and small letters, numbers, underscore and dash characters allowed for the Vanity name');
            $('#landing_page_settings_popup input[name="vanity_name"]').focus();
            return false;
        }
        settings.ll_abstract_campaign_id = ll_combo_manager.get_selected_value('#landing_page_settings_popup select[name="abstract_campaign"]');
        settings.page_description = $('#landing_page_settings_popup textarea[name="page_description"]').val();
        return settings;
    },

    save_settings: function () {
        var data = {};
        data.action = 'SAVE_LANDING_PAGE_SETTINGS';
        data.landing_page_id = this.landing_page_id;
        data.settings = this.collect_landing_page_settings();
        if(data.settings){
            $.ajax({
                url: 'landing-page-builder-process.php',
                data: data,
                type: 'POST',
                success: function (response) {
                    if(response.success == 1){
                        show_success_message(response.message);
                        ll_popup_manager.close('#landing_page_settings_popup');
                        if(typeof response.landing_page != 'undefined'){
                            if(response.landing_page.landing_page_custom_url && response.landing_page.is_published == 0){
                                $('.publish_page').show();
                            } else if (response.landing_page.landing_page_custom_url && response.landing_page.is_published == 1){
                                $('.unpublish_page').show();
                            }
                        }
                    } else {
                        show_error_message(response.message);
                    }
                },
                error: function () {
                    show_error_message("Connection error");
                }
            });
        }
    },

    add_meta_data_box: function (meta_data_object) {
        var _html = '';
        _html += '<li class="pb-list-group-social__item">';
        _html += '    <div class="pb-item__line">';
        _html += '      <a href="javascript:void(0);" class="t-btn-gray pb-item__btn-move">';
        _html += '        <i class="icn"></i>';
        _html += '      </a>';
        _html += '      <a href="javascript:void(0);" class="t-btn-gray pb-item__btn-remove">';
        _html += '        <i class="icn"></i>';
        _html += '      </a>';
        _html += '      <select class="pb-social-list meta_data_names">';
        _html += '          <option value="author">Author</option>';
        _html += '          <option value="category">Category</option>';
        _html += '          <option value="coverage">Coverage</option>';
        _html += '          <option value="copyright">Copyright</option>';
        _html += '          <option value="directory">Directory</option>';
        _html += '          <option value="distribution">Distribution</option>';
        _html += '          <option value="language">Language</option>';
        _html += '          <option value="keywords">Keywords</option>';
        _html += '          <option value="subject">Subject</option>';
        _html += '          <option value="robots">Robots</option>';
        _html += '          <option value="revised">Revised</option>';
        _html += '          <option value="abstract">Abstract</option>';
        _html += '          <option value="topic">Topic</option>';
        _html += '          <option value="summary">Summary</option>';
        _html += '          <option value="Classification">Classification</option>';
        _html += '          <option value="designer">Designer</option>';
        _html += '          <option value="reply-to">Reply-to</option>';
        _html += '          <option value="owner">Owner</option>';
        _html += '          <option value="url">URL</option>';
        _html += '          <option value="identifier-URL">Identifier-URL</option>';
        _html += '          <option value="rating">Rating</option>';
        _html += '          <option value="revisit-after">Revisit-after</option>';
        _html += '      </select>';
        _html += '    </div>';
        _html += '    <div class="pb-list-group-social__fields">';
        _html += '      <div class="pb-field pb-field--vertical">';
        _html += '          <label>Value</label>';
        _html += '          <div class="pb-right">';
        _html += '              <div class="pb-right__inner wFull">';
        _html += '                  <input type="text" class="txt-field" name="content"/>';
        _html += '              </div>';
        _html += '          </div>';
        _html += '      </div>';
        _html += '    </div>';
        _html += '</li>';
        $('.pb-list-group-social.custom_meta_data').append(_html);
        $('.pb-list-group-social.custom_meta_data .pb-list-group-social__item:last .pb-list-group-social__fields').show();
        $('.pb-list-group-social.custom_meta_data .pb-list-group-social__item:last input[name="content"]').on('keyup', function () {
            LandingPageBuilder.update_history_meta_data();
        });
        ll_combo_manager.make_combo('.pb-list-group-social.custom_meta_data .pb-list-group-social__item:last select');
        ll_combo_manager.event_on_change('.pb-list-group-social.custom_meta_data .pb-list-group-social__item:last select', function (){
            LandingPageBuilder.update_history_meta_data();
        });
        if(meta_data_object){
            ll_combo_manager.set_selected_value('.pb-list-group-social.custom_meta_data .pb-list-group-social__item:last select', meta_data_object.meta_data_name);
            $('.pb-list-group-social.custom_meta_data .pb-list-group-social__item:last input[name="content"]').val(meta_data_object.meta_data_value);
        }
    },

    update_history_meta_data: function () {
        var json = JSON.parse(sessionStorage.getItem('pbHistory'));
        var current_variant = json.variants[LandingPageBuilder.current_variant_id];
        current_variant.meta_data = {};

        current_variant.meta_data.title = {"meta_data_name": "title", "meta_data_value": $('input.meta_data[name="title"]').val()};
        current_variant.meta_data.description = {"meta_data_name": "description", "meta_data_value": $('textarea.meta_data[name="description"]').val()};

        $('.pb-list-group-social.custom_meta_data .pb-list-group-social__item').each(function () {
            var selected_meta_data_name = ll_combo_manager.get_selected_value($(this).find('select'));
            current_variant.meta_data[selected_meta_data_name] = {"meta_data_name": selected_meta_data_name, "meta_data_value": $(this).find('input[name="content"]').val()};
        });

        current_variant.meta_data.cover = {"meta_data_name": "cover", "meta_data_value": $('.pb-unload-cover .pb-unload-cover__title').attr('cover_url')};
        current_variant.meta_data.favicon = {"meta_data_name": "favicon", "meta_data_value": $('.pb-unload-favicon .pb-unload-favicon__title').attr('favicon_url')};

        sessionStorage.setItem('pbHistory', JSON.stringify(json));
    },

    prepare_builder_html_for_save: function (builder_html) {
        //$('body').append('<div class="temp_to_clean" style="display: none;">'+builder_html+'</div>');
        /*
         * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
         */
        let body = document.getElementsByTagName('body')[0];
        let elChild = document.createElement('div');
        elChild.className = 'temp_to_clean';
        elChild.innerHTML = builder_html;
        body.appendChild(elChild);

        $('.temp_to_clean [id^="mce_"]').each(function(){
            pageBuilder.disabledEditorInline($(this), $(this).attr('id'));
        });
        $('.temp_to_clean .pb-widget--selected').removeClass('pb-widget--selected');
        $('.temp_to_clean .ui-droppable').removeClass('ui-droppable');
        $('.temp_to_clean .ui-sortable').removeClass('ui-sortable');
        $('.temp_to_clean grammarly-extension').remove();
        if($('.temp_to_clean .pb-widget--custom-form').length > 0){
            $('.temp_to_clean .pb-widget--custom-form .pb-widget__content').html(LANDING_PAGE_PATTERN_MAGIC_FORM_HERE);
        }
        $('.temp_to_clean').find('.mce-content-body').removeAttr('id');
        $('.temp_to_clean').find('#pb-template').css('max-width', '');
        //builder_html = $('.temp_to_clean').html();
        /*
         * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
         */
        builder_html = document.getElementsByClassName('temp_to_clean')[0].innerHTML;
        $('.temp_to_clean').remove();
        return builder_html;
    },

    prepare_clean_draft_html_for_save: function (builder_html) {
        //$('body').append('<div class="temp_to_clean" style="display: none;">'+builder_html+'</div>');
        /*
        * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
        */
        let body = document.getElementsByTagName('body')[0];
        let elChild = document.createElement('div');
        elChild.className = 'temp_to_clean';
        elChild.innerHTML = builder_html;
        body.appendChild(elChild);

        $('.temp_to_clean .pb-widget--selected').removeClass('pb-widget--selected');
        $('.temp_to_clean .ui-droppable').removeClass('ui-droppable');
        $('.temp_to_clean .ui-sortable').removeClass('ui-sortable');
        //$('.pb-widget--bg-video-loading').removeClass('pb-widget--bg-video-loading');
        $('.temp_to_clean [contenteditable]').removeAttr('contenteditable');
        if($('.temp_to_clean .pb-widget--custom-form').length > 0){
            $('.temp_to_clean .pb-widget--custom-form .pb-widget__content').html(LANDING_PAGE_PATTERN_MAGIC_FORM_START + '<br>' + LANDING_PAGE_PATTERN_MAGIC_FORM_HERE + '<br>' + LANDING_PAGE_PATTERN_MAGIC_FORM_END);
        }
        $('.temp_to_clean').find('.mce-content-body').removeAttr('id');
        var is_continue = true;
        $('.temp_to_clean').find('.pb-widget[data-type="vertical-form"]').each(function () {
            var identifier = $(this).find('.ll-lp-form').attr('data-identifier');
            if($('.temp_to_clean').find('[data-identifier="'+identifier+'"]').length > 1){
                is_continue = false;
                show_error_message('Duplicate Vertical Forms identifier');
            }
        });
        $('.temp_to_clean').find('.pb-widget[data-type="horizontal-form"]').each(function () {
            var identifier = $(this).find('.ll-lp-form').attr('data-identifier');
            if($('.temp_to_clean').find('[data-identifier="'+identifier+'"]').length > 1){
                is_continue = false;
                show_error_message('Duplicate Horizontal Forms identifier');
            }
        });
        $('.temp_to_clean').find('.pb-widget[data-type="field"]').each(function () {
            var opt = $(this).data('json');
            if(typeof opt.field_hide != 'undefined' && opt.field_hide == 1){
                $(this).find('input').hide();
            } else {
                $(this).find('input').show();
            }
        });
        $('.temp_to_clean').find('.fade_div').remove();
        $('.temp_to_clean').find('.pb-widget__btn-settings').remove();
        $('.temp_to_clean').find('.activation_iframe.activation_iframe_builder').removeClass('activation_iframe_builder');
        pageBuilder.resetStyleHTML($('.temp_to_clean'), false);
        $('.temp_to_clean').find('#pb-template').css('max-width', '');
        if(typeof $('.temp_to_clean').find('#pb-template').attr('data-font-references') != 'undefined' && $('.temp_to_clean').find('#pb-template').attr('data-font-references')){
            var custom_fonts_files = JSON.parse($('.temp_to_clean').find('#pb-template').attr('data-font-references'));
            if(custom_fonts_files){
                for (var i in custom_fonts_files){
                    var font_file = custom_fonts_files[i];
                    if(font_file){
                        $('.temp_to_clean').find('#pb-template').prepend('<link href="'+font_file+'" rel="stylesheet" />');
                    }
                }
            }
            $('.temp_to_clean').find('#pb-template').removeAttr('data-font-references');
        }
        //builder_html = $('.temp_to_clean').html();
        /*
         * Noha Azab: we replaced the above code line by the below code line, because jquery strips the script tag from the html.
         */
        builder_html = document.getElementsByClassName('temp_to_clean')[0].innerHTML;
        $('.temp_to_clean').remove();
        if(is_continue){
            return builder_html;
        }
        return is_continue;
    },

    collect_landing_page_draft_info: function () {
        var info = {};
        info.form_id = this.form_id;
        info.js_tracking_code = $('textarea[name="js_tracking_code"]').val();
        info.edit_head_html = $('textarea[name="custom_meta_data"]').val();
        info.meta_data = {};
        info.meta_data.title = $('input.meta_data[name="title"]').val();
        info.meta_data.description = $('textarea.meta_data[name="description"]').val();
        var opt = $('#pb-template').data('json');
        if(typeof opt.favicon != 'undefined'){
            info.meta_data.favicon = opt.favicon;
        }
        if(typeof opt.cover != 'undefined'){
            info.meta_data.cover = opt.cover;
        }
        $('.custom_meta_data .pb-list-group-social__item').each(function () {
            info.meta_data[ll_combo_manager.get_selected_value($(this).find('select'))] = $(this).find('input[name="content"]').val();
        });
        info.draft_clean_html = this.prepare_clean_draft_html_for_save();
        if(info.draft_clean_html === false){
            return false;
        }
        info.builder_html = this.prepare_builder_html_for_save();
        return info;
    },

    collect_landing_page_drafts: function () {
        var drafts = [];
        var _history = JSON.parse(sessionStorage.getItem('pbHistory'));
        var variants = _history.variants;
        if(Object.keys(variants).length > 0){
            for (var i in variants){
                var variant = variants[i];
                variant.advanced_builder_html = this.prepare_builder_html_for_save(variant.versions[variant.pbCurrentHistory - 1]);
                variant.html = this.prepare_clean_draft_html_for_save(variant.versions[variant.pbCurrentHistory - 1]);

				var post_variant = Object.assign({}, variant);
				post_variant.versions = [];
                drafts.push(post_variant);
                
                //drafts.push(variant);
            }
        }
        return drafts;
    },
    
    save: function (is_exit, is_published) {
        if(typeof is_exit == 'undefined'){
            is_exit = false;
        }
        if(typeof is_published == 'undefined'){
            is_published = 0;
        }
        var data = {};
        data.action = 'SAVE_LANDING_PAGE_DRAFT';
        data.landing_page_id = this.landing_page_id;
        data.landing_page_name = $('.landing_page_name').text();
        data.landing_page_drafts = this.collect_landing_page_drafts();
        if(data.landing_page_draft_info !== false){
            if(is_exit){
                data.is_exit = 1;
            }
            if(is_published){
                data.is_published = 1;
            }
            var is_continue = false;
            var fade_message = '';
            if(is_published){
                message = 'Are you sure you want to publish this draft?';
                ll_confirm_popup_manager.open(message, function(){
                    ll_fade_manager.fade(true, 'Saving and Publishing...');
                    $.ajax({
                        url: 'landing-page-builder-process.php',
                        data: data,
                        type: 'POST',
                        success: function (response) {
                            ll_fade_manager.fade(false);
                            if(response.success == 1){
                                if(is_exit){
                                    window.location.href = 'manage-landing-pages.php';
                                }else{
                                    $('.publish_page').hide();
                                    $('.unpublish_page').show();
                                    show_success_message(response.message);
                                    if(typeof response.new_variants != 'undefined' && Object.keys(response.new_variants).length > 0){
                                        for(var i in response.new_variants){
                                            var json = JSON.parse(sessionStorage.getItem('pbHistory'));
                                            delete(json.variants[i]);
                                            sessionStorage.setItem('pbHistory', JSON.stringify(json));
                                            pageBuilder.setVariantHistory(response.new_variants[i]);
                                            if(LandingPageBuilder.current_variant_id == i){
                                                LandingPageBuilder.current_variant_id = response.new_variants[i].landing_page_draft_id;
                                            }
                                            $('.pb-versions__btns .t-btn[data-draft-id="'+i+'"]').attr('data-draft-id', response.new_variants[i].landing_page_draft_id);
                                            if(LandingPageBuilder.main_variant_landing_page_draft_id == i){
                                                LandingPageBuilder.main_variant_landing_page_draft_id = response.new_variants[i].landing_page_draft_id;
                                            }
                                        }
                                    }
                                }
                            } else {
                                show_error_message(response.message);
                            }
                        },
                        error: function () {
                            ll_fade_manager.fade(false);
                            show_error_message("Connection error");
                        }
                    });
                });
            }else {
                ll_fade_manager.fade(true, 'save');
                $.ajax({
                    url: 'landing-page-builder-process.php',
                    data: data,
                    type: 'POST',
                    success: function (response) {
                        ll_fade_manager.fade(false);
                        if(response.success == 1){
                            if(is_exit){
                                window.location.href = 'manage-landing-pages.php';
                            }else{
                                show_success_message(response.message);
                                if(typeof response.new_variants != 'undefined' && Object.keys(response.new_variants).length > 0){
                                    for(var i in response.new_variants){
                                        var json = JSON.parse(sessionStorage.getItem('pbHistory'));
                                        delete(json.variants[i]);
                                        sessionStorage.setItem('pbHistory', JSON.stringify(json));
                                        pageBuilder.setVariantHistory(response.new_variants[i]);
                                        if(LandingPageBuilder.current_variant_id == i){
                                            LandingPageBuilder.current_variant_id = response.new_variants[i].landing_page_draft_id;
                                        }
                                        $('.pb-versions__btns .t-btn[data-draft-id="'+i+'"]').attr('data-draft-id', response.new_variants[i].landing_page_draft_id);
                                        if(LandingPageBuilder.main_variant_landing_page_draft_id == i){
                                            LandingPageBuilder.main_variant_landing_page_draft_id = response.new_variants[i].landing_page_draft_id;
                                        }
                                    }
                                }
                            }
                        } else {
                            show_error_message(response.message);
                        }
                    },
                    error: function () {
                        ll_fade_manager.fade(false);
                        show_error_message("Connection error");
                    }
                });
            }
        }
    },

    publish_page: function (is_published) {
        var message = '';
        if(is_published == 1){
            message = 'Are you sure you want to publish this page?';
        } else {
            message = 'Are you sure you want to unpublish this page?';
        }
        ll_confirm_popup_manager.open(message, function(){
            var data = {};
            data.action = 'PUBLISH_LANDING_PAGE';
            data.landing_page_id = LandingPageBuilder.landing_page_id;
            data.landing_page_draft_id = LandingPageBuilder.landing_page_draft_id;
            data.is_published = is_published;
            $.ajax({
                url: 'landing-page-builder-process.php',
                data: data,
                type: 'POST',
                success: function (response) {
                    ll_fade_manager.fade(false);
                    if(response.success == 1){
                        show_success_message(response.message);
                        if(is_published == 1){
                            $('.publish_page').hide();
                            $('.unpublish_page').show();
                        } else {
                            $('.unpublish_page').hide();
                            $('.publish_page').show();
                        }
                    } else {
                        show_error_message(response.message);
                    }
                },
                error: function () {
                    ll_fade_manager.fade(false);
                    show_error_message("Connection error");
                }
            });
        });
    },

    open_activations_popup: function () {
        if (!this.is_activations_popup_loaded) {
            this.draw_activations_popup();
            this.is_activations_popup_loaded = true;
        }

        if(Object.keys(this.cached_activations).length == 0) {
            this.load_activations(function () {
                LandingPageBuilder.populate_activations_dropdown();
                ll_popup_manager.open('#activations_popup');
            });
        } else {
            ll_combo_manager.set_selected_value('#activations_popup select[name="activations"]', 0);
            ll_popup_manager.open('#activations_popup');
        }
    },

    draw_activations_popup: function () {
        var _html = '';
        _html += '<div class="ll-popup" id="activations_popup">';
        _html += ' <div class="ll-popup-head">';
        _html += '      Activations';
        _html += '  </div>';
        _html += ' <div class="ll-popup-content">';
        _html += '      <div class="form">';
        _html += '          <div class="t-field ll-line-field">';
        _html += '              <select class="txt-field txt-field-wide" name="activations" data-placeholder="Select activation"></select>';
        _html += '          </div>';
        _html += '      </div>';
        _html += '  </div>';
        _html += ' <div class="ll-popup-footer clearfix">';
        _html += '      <a href="javascript:void(0)" class="t-btn-gray btn_cancel">Cancel</a>';
        _html += '      <a href="javascript:void(0)" class="t-btn-orange btn_save">Save</a>';
        _html += '  </div>';
        _html += '</div>';

        $('#builderWrapper').append(_html);
        this.apply_activations_popup_actions();
    },

    apply_activations_popup_actions: function () {
        ll_combo_manager.make_combo('#activations_popup select[name="activations"]');

        $('#activations_popup .btn_cancel').click(function () {
            ll_popup_manager.close('#activations_popup');
        });

        $('#activations_popup .btn_save').click(function () {
            var selected_activation_id = ll_combo_manager.get_selected_value('#activations_popup select[name="activations"]');
            if(selected_activation_id != 0){
                var selected_activation = LandingPageBuilder.cached_activations[selected_activation_id];
                var dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
                var _html = "<div class='pb-widget pb-widget--init pb-widget--activation' data-type='activation' data-activation-id='"+selected_activation_id+"' data-json='" + dataJson + "'>"
                    +'<div class="pb-widget__content">'
                    +'<iframe src="'+selected_activation.webview_submit_url+'" class="activation_iframe activation_iframe_builder"></iframe>'
                    +'<div class="fade_div"></div>'
                    +'</div>'
                    +pageBuilder.getWidgetHTMLPlaceholder()
                    +pageBuilder.getWidgetHTMLLabel('activation')
                    +pageBuilder.getWidgetHTMLBtnRemove()
                    +'</div>';
                ll_popup_manager.close('#activations_popup');
                pageBuilder.current_activation_element.replaceWith(_html);
                pageBuilder.initActionsElements('activation');
                pageBuilder.showHideHelpDragDropBox($('.pb-blocks'));
                pageBuilder.setNewActionHistory();
                if (pageBuilder.isNewHistory()) {
                    pageBuilder.updateHistory();
                }
            } else {
                show_error_message('Select an activation to add');
            }
        });
    },

    load_activations: function (callback) {
        if(typeof callback == 'undefined'){
            callback = function () {};
        }
        var data = {};
        data.action = 'LOAD_ACTIVATIONS';
        ll_fade_manager.fade(true, 'load');
        $.ajax({
            url: 'landing-page-builder-process.php',
        	data: data,
        	type: 'POST',
        	success: function (response) {
                ll_fade_manager.fade(false);
                if(response.success == 1){
                    if(typeof response.activations != 'undefined'){
                        LandingPageBuilder.cached_activations = response.activations;
                    }
                    callback();
                }
            },
            error: function () {
                ll_fade_manager.fade(false);
            }
        });
    },

    populate_activations_dropdown: function () {
        ll_combo_manager.clear_all('#activations_popup select[name="activations"]');
        ll_combo_manager.add_option('#activations_popup select[name="activations"]', 0, '');
        if(Object.keys(this.cached_activations).length > 0){
            for (var i in this.cached_activations){
                var activation = this.cached_activations[i];
                ll_combo_manager.add_option('#activations_popup select[name="activations"]', activation.ll_activation_id, activation.ll_activation_name);
            }
        }
    }
};

$(document).ready(function () {
    LandingPageBuilder.init();
});