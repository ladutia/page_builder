/**
 * Created by Asmaa Ali on 24/09/2019.
 */
var ll_activation_builder = {

    sliderGridTwo: null,
    ll_activation_id: typeof ll_activation_id != 'undefined' ? ll_activation_id : 0,
    ll_activation_identifier_id: typeof ll_activation_identifier_id != 'undefined' ? ll_activation_identifier_id : 0,
    ll_activation_identifiers: {},
    ll_activation_identifier: {},
    activation: {},
    activation_configuration: {},
    styleInfo: {},
    ll_activation_template_id : 0,
    ll_shared_prizes : {},
    is_done_load_landing_pages: false,
    landing_pages: [],
    collected_configuration_data: [],
    init: function () {

        if(typeof is_deleted_event != 'undefined' && parseInt(is_deleted_event)){
            show_warning_message('The Event associated with this Activation has been removed. To use this Activation clone it and associate it with another Event.');
        }

        ll_combo_manager.make_combo('#button_link_to');
        ll_combo_manager.make_combo('#select_button_landing_page');
        $('#webview-success-message').hide();
        $('.webview_success_redirect').hide();
        var webview_success_action_type =  $('input[name="webview_success_action_type"]:checked').val();
        if(webview_success_action_type == 'message'){
            $('#webview-success-message').show();
        } else if(webview_success_action_type == 'redirect'){
            $('.webview_success_redirect').show();
        }
        $('input[name="webview_success_action_type"]').change( function(){
            $('#webview-success-message').hide();
            $('.webview_success_redirect').hide();
            var webview_success_action_type =  $('input[name="webview_success_action_type"]:checked').val();
            if(webview_success_action_type == 'message'){
                $('#webview-success-message').show();
                $('#webview-success-message').val($.trim($('#webview-success-message').val()) ? $('#webview-success-message').val() : 'Success!');
            } else if(webview_success_action_type == 'redirect') {
                $('.webview_success_redirect').show();
            }
        });
        ll_combo_manager.event_on_change('#button_link_to', function(){
            // $('#label_btn_link_to').html ('Web Address (URL)');
            var button_link_to = ll_combo_manager.get_selected_value('#button_link_to');

            $('#container_button_lp').hide ();
            switch (button_link_to) {
                case 'lp':
                    // $('#label_btn_link_to').html ('Landing Page URL');
                    $('#container_button_lp').show ();
                    ll_activation_builder.process_load_landing_pages(function (){
                        if (ll_activation_builder.landing_pages.length > 0) {
                            ll_combo_manager.clear_all('#select_button_landing_page');
                            ll_combo_manager.add_option('#select_button_landing_page', '', '')
                            for (var i in ll_activation_builder.landing_pages){
                                var lp = ll_activation_builder.landing_pages [i];
                                ll_combo_manager.add_option('#select_button_landing_page', lp.url, lp.name)
                            }
                        }
                    });
                    break;
            }
        });

        ll_combo_manager.event_on_change('#select_button_landing_page', function(){
            var url = ll_combo_manager.get_selected_value('#select_button_landing_page');
            if (url && url != '') {
                $('#buttonUrl').val (url);
            }
        });

        $('.activation_mode_element input[name="activation_mode"]').live('click', function () {
            var values = $(this).val().split(',');
            if($.inArray( LL_ACTIVATION_RESULT_TYPE_SCORE_ID , values ) != -1 || $.inArray( LL_ACTIVATION_RESULT_TYPE_DURATION_ID , values ) != -1){
                $('[id-form="leaderboard"]').show();
            } else {
                $('[id-form="leaderboard"]').hide();
            }
            ll_activation_builder.resizeTabs();

            if($.inArray( LL_ACTIVATION_RESULT_TYPE_PRESENTS_ID , values ) != -1){
                $('.prizes-elements').show();
                $('.activation-configuration-elements .h3.h-doneMessage').text('Done With Prize Message Title');
                $('.activation-configuration-elements .h3.h-doneSecondMessage').text('Done With Prize Message');
            } else {
                $('.prizes-elements').hide();
                $('.activation-configuration-elements .h3.h-doneMessage').text('Done Message');
                $('.activation-configuration-elements .h3.h-doneSecondMessage').text('Done Second Text');
            }
        });

        ll_combo_manager.make_combo('#ll_activation_event_station_id');
        $('.sales-shortcut,.intercom-app').hide();

        if(typeof ll_activation_id != 'undefined' && ll_activation_id){
            ll_activation_builder.ll_activation_id = ll_activation_id;
        }
        if(typeof ll_activation_identifier_id != 'undefined' && ll_activation_identifier_id){
            ll_activation_builder.ll_activation_identifier_id = ll_activation_identifier_id;
        }

        ll_combo_manager.make_combo('.custom-activation-page select');
        ll_combo_manager.event_on_change('#ll_activation_identifier_id', function () {
            var ll_activation_identifier_id = ll_combo_manager.get_selected_value($(this));
            if(parseInt(ll_activation_identifier_id) && ll_activation_identifier_id in ll_activation_builder.ll_activation_identifiers) {
                ll_activation_builder.populate_identifier(ll_activation_builder.ll_activation_identifiers[ll_activation_identifier_id]);
            } else {
                $('.activation-configuration-elements').html('');
            }
        });
        $('.screenshot_zoom').magnificPopup({
            type: 'image',
            mainClass: 'mfp-with-zoom',
            zoom: {
                enabled: true,
                duration: 300,
                easing: 'ease-in-out',
                opener: function(openerElement) {
                    return openerElement.is('img') ? openerElement : openerElement.find('img');
                }
            }
        });
        $('#max_group_plays').live('change', function(){
            var max = $(this).val() ? parseInt($(this).val()) : 0;
            if(max < 1){
                show_error_message('The number should be more than or equal 1');
                $(this).val(1);
            }
        });

        $('#max_individual_plays').live('change', function(){
            var max = $(this).val() ? parseInt($(this).val()) : 0;
            if(max < 0){
                show_error_message('The number should be more than or equal 0');
                $(this).val(1);
            }
        });

        $("body").on("click", function() {
            $(".settings-tpl.open").removeClass("open");
        });

        $('.settings-tpl > a.db-btn-white').on('click', function(e){
            e.stopPropagation();
            $(this).parent().toggleClass('open');
            return false;
        });

        $('.load-activation-templates').on('click', function(e){
            e.stopPropagation();
            var template_for = 0 ;
            var idForm = $('.tabs-pages li.selected').attr('id-form');
            switch (idForm) {
                case 'capture-screen':
                    template_for = LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN;
                    break;
                case 'leaderboard':
                    template_for = LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD;
                    break;
            }
            if(template_for) {
                ll_activation_templates.open_templates_popup(template_for, function (ll_activation_template) {
                    if(typeof ll_activation_template != 'undefined' && ll_activation_template && typeof ll_activation_template.template_data != 'undefined') {
                        ll_activation_builder.ll_activation_template_id = ll_activation_template.ll_activation_template_id;
                        switch (template_for) {
                            case LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN:
                                    ll_activation_templates.populate_capture_screen(ll_activation_template.template_data , true);
                                break;
                            case LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD:
                                    ll_activation_templates.populate_leaderboard(ll_activation_template.template_data , true);
                                break;
                        }
                    }
                });
            }
        });

        $('.save-activation-template').on('click', function(e){
            e.stopPropagation();
            var template_for = 0 ;
            var idForm = $('.tabs-pages li.selected').attr('id-form');
            switch (idForm) {
                case 'capture-screen':
                    template_for = LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN;
                    break;
                case 'leaderboard':
                    template_for = LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD;
                    break;
            }
            if(template_for) {
                ll_activation_templates.open_save_template_popup(ll_activation_builder.ll_activation_template_id , template_for, function () {
                    //ll_activation_builder.ll_activation_template_id = 0;
                });
            }
        });

        $('.reset-activation-template').on('click', function(e){
            e.stopPropagation();
            var template_for = 0 ;
            var idForm = $('.tabs-pages li.selected').attr('id-form');
            switch (idForm) {
                case 'capture-screen':
                    template_for = LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN;
                    break;
                case 'leaderboard':
                    template_for = LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD;
                    break;
            }
            if(template_for) {
                ll_activation_templates.reset_template( template_for, function () {
                    ll_activation_builder.ll_activation_template_id = 0;
                    $(".settings-tpl.open").removeClass("open");
                });
            }
        });

        $('#activation-settings').on('click', function() {
            ll_activations_manager.open(ll_activation_builder.ll_activation_id, 'edit',function(ll_activation){
                if(typeof ll_activation != 'undefined' && ll_activation){
                    $('.container_activation_name ').text(ll_activation.ll_event_activation_name);
                }
            });
        });
        $('.et-top-header-gray .et-title').each(function () {
          //  $(this).css('margin-left', -$(this).width() / 2);
        });
        $('.tabs-editor > ul li').on('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            var index = $(this).parent().find('li').index($(this));
            $(this).addClass('selected').siblings('li').removeClass('selected');
            $(this).parents('.tabs-editor').find('.wrap-tabs-content .tab-content').hide().eq(index).show();
        });
        $(".tabs-pages li").on("click", function() {
            var $this = $(this);
            var idForm = $this.attr('id-form');
            if (!$this.hasClass("selected")) {
                var index = $this
                    .parent()
                    .find("li")
                    .index($this);
                $(this)
                    .addClass("selected")
                    .siblings("li")
                    .removeClass("selected");

                $('.tab-content-page').hide();
                $('.tab-content-page[id-form='+idForm+']').show();

                $('.settings-tpl').hide();
                switch (idForm) {
                    case 'capture-screen':
                    case 'leaderboard':
                        $('.settings-tpl').show();
                        break;
                }
            }

            ll_activation_builder.ll_activation_template_id = 0;
            ll_activation_builder.closePanelRight();
        });

        ll_activation_builder.resizeColumnInit();
        ll_activation_builder.resizeColumn();
        $(window).resize(function() {
            ll_activation_builder.resizeColumn();
        });

        $('.header-activation').on('click', '.btn-exit', function (e) {
            ll_popup_manager.open('#ll_popup_manage_confirm_exit_activation');
        });

        $('#ll_popup_manage_confirm_register_exit_save_and_exit_activation').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit_activation');
            ll_activation_builder.go_to_save(function(){
                window.location.href = 'manage-activations.php';
            }, 1);
        });
        $('#ll_popup_manage_confirm_register_exit_cancel_activation').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit_activation');
        });
        $('#ll_popup_manage_confirm_register_exit_go_activation').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit_activation');
            window.location.href = 'manage-activations.php';
        });

        $('.header-activation').on('click', '.btn-save', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.fb-save-panel').click();

            $('.activation-configuration-elements .container_with_errors').removeClass('container_with_errors');
            ll_activation_builder.go_to_save(function(response){
               // var idForm = $('.activation-designer .tabs-pages li.selected').attr('id-form');
               // window.location.href = 'activation-builder.php?ll_activation_id=' + ll_activation_builder.ll_activation_id + '&step='+idForm;
                if(typeof response.ll_activation != 'undefined' && response.ll_activation){
                    var ll_activation = response.ll_activation;
                    if(typeof ll_activation.prizes != 'undefined' && ll_activation.prizes && Object.keys(ll_activation.prizes).length){
                        var field = $('.activation-configuration-elements [identifier=prizes]');
                        ll_activation_builder.populateInventory(field, ll_activation.prizes);
                    }
                    if(parseInt(EVENTS_PERMISSION) && (typeof ll_activation.event_id == 'undefined' || !parseInt(ll_activation.event_id))){
                        $('.event-field').show();
                    } else {
                        $('.event-field').hide();
                    }
                }
                show_success_message('Activation saved successfully');
                if($('.activation-configuration-elements .container_with_errors').length){
                    $('.activation-configuration-elements .container_with_errors').removeClass('container_with_errors');
                }
            }, 0);
        });

        $('.header-activation').on('click', '#activation-save-and-exit', function (e) {
            ll_activation_builder.go_to_save(function(){
                window.location.href = 'manage-activations.php';
            }, 1);
        });

        $('input[name="capture_form_before_or_after"]').change(function() {
            var $this = $(this);
            var val = $this.val();
            switch ($this.val()) {
                case LL_ACTIVATION_CAPTURE_FORM_BEFORE:
                    $('#submit_button_text').val('Play');
                break;
                case LL_ACTIVATION_CAPTURE_FORM_AFTER:
                    $('#submit_button_text').val('Submit');
                break;
            }
        });
        // ------ Setup
        /*ll_combo_manager.event_on_change('#ll_activation_event_id', function () {
            var event_id = ll_combo_manager.get_selected_value($(this));
            if(parseInt(event_id)){
                $("#form-preview-iframe").prop('src','view-form.php?ll_custID=' + customerID + '&ll_is_preview=1&id=' + event_id + '');
            }
        });*/

        $('.sc-list-image').sortable({
            handle: ".fb-btn-move",
            start: function(event, ui) {
                ui.item.startPos = ui.item.index();
            },
            stop: function(event, ui) {
                //ll_activation_builder.update_position_choise_field( $(ui.item.parents('.fb-multiple-field')) );
            }
        }).disableSelection();

        $("#is_enable_screensaver").change(function() {
            var $this = $(this);
            if($this.is(':checked')){
                $('.screensaver-elements:not(.custom)').show();
            } else {
                $('.screensaver-elements').hide();
            }
        });
        $("input[name=is_event_screensaver]").change(function() {
            var $this = $(this);
            if($this.val() == '1'){
                $('.screensaver-elements.custom').hide();
            } else {
                $('.screensaver-elements.custom').show();
            }
        });

        // ------ Capture Screen

        $(".btn-capture-screen-form-fullscreen").on("click", function() {
            var $btn = $(this);
            var $wrap = $("#capture-screen-content");
            var $parent = $btn.parent();

            $btn.toggleClass("active");

            if (!$btn.hasClass("active")) {
                $wrap.removeClass("fullscreen");
                $parent.removeClass("fullscreen");
                $(".btn-capture-screen-form--left").trigger('click');
            } else {
                $wrap.addClass("fullscreen");
                $parent.addClass("fullscreen");
            }
        });

        $(".btn-capture-screen-form--left, .btn-capture-screen-form--right").on( "click", function() {
                var $btn = $(this);
                var leftCol = $("#capture-screen-content .wrap-preview-col");
                var rightCol = $("#capture-screen-content .tool-col");
                var formBox = $("#capture-screen-content .preview-col");
                var htmlBox = $("#capture-screen-content .custom-html");
                var $btnLeft = $(".btn-capture-screen-form--left");
                var $btnRight = $(".btn-capture-screen-form--right");

                $(".form-preview").removeClass("form-preview");

                $btn.addClass("active");

                if ($btn.hasClass("btn-capture-screen-form--left")) {
                    leftCol.addClass("form-preview").append(formBox);
                    rightCol.append(htmlBox);
                    $btnRight.removeClass("active");
                } else {
                    leftCol.append(htmlBox);
                    rightCol.addClass("form-preview").append(formBox);
                    $btnLeft.removeClass("active");
                }
            }
        );
        $("#btnPreviewCaprureScreen").on("click", function() {
            var $btn = $(this);
            var $boxBtns = $(".capture-screen__btns");

            $btn.toggleClass("active");
            $boxBtns.toggleClass("active");

            if ($btn.hasClass("active")) {
                ll_activation_builder.getHTMLPreviewCaptureSreen();
                $("#previewCaprureScreen").show();
            } else {
                $("#previewCaprureScreen")
                    .hide()
                    .html("");
            }
        });

        $(".right-panel-slide__close").on("click", function(e) {
            e.stopPropagation();
            ll_activation_builder.closePanelRight();
        });

        $(".custom-html").live("click", function() {
            // + typeSlide
            $(".right-panel-slide li, .right-panel-slide .tab-content").hide().removeClass('selected');
            $(".right-panel-slide li.capture-screen, .right-panel-slide .tab-content.capture-screen").show();
            $(".right-panel-slide li.capture-screen:first, .right-panel-slide .tab-content.capture-screen:first").addClass('selected');

            $(".right-panel-slide")
                .addClass("active")
                .show()
                .animate({ right: 0 }, 300);
            //var html = "";
            //tinymce.get("capture_screen_html").setContent($(".custom-html__content").html());

            ll_activation_builder.editor_set_content('capture_screen_html_editor', $(".custom-html__content").html());
        });

        if ($(".editor-text").length) {
            var tinymceOpts = {
                autoresize_min_height: 300,
                selector: "#capture_screen_html_editor,#leaderboard_html_editor",
                plugins: [
                    "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
                    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                    "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern",
                    "autoresize"
                ],
                toolbar1:
                    "bold italic underline | link unlink image | alignleft aligncenter alignright alignjustify | bullist numlist",
                toolbar2:
                    "heading fontselect fontsizeselect | forecolor backcolor | ltr rtl | code | undo redo",
                //content_css: "js/tinymce_new/tinymce_override.css",
                menubar: false,
                gecko_spellcheck: true,
                browser_spellcheck: true,
                toolbar_items_size: "small",
                relative_urls: "false",
                theme_advanced_buttons3_add: "ltr,rtl",
                forced_root_block: "div",
                force_br_newlines: true,
                force_p_newlines: false,
                verify_html: false,
                entity_encoding: "named",
                autosave_ask_before_unload: false,
                fontsize_formats:
                    "8px 9px 10px 11px 12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 31px 32px 33px 34px 35px 36px 37px 38px 39px 40px 41px 42px 43px 44px 45px 46px 47px 48px 49px 50px 51px 52px 53px 54px 55px 56px 57px 58px 59px 60px 61px 62px 63px 64px 65px",
                external_plugins: {
                    "moxiemanager": _moxiemanager_plugin
                },
                moxiemanager_title: 'Media Manager',
                setup: function(editor) {
                    editor.addButton("heading", {
                        type: "menubutton",
                        text: "Heading",
                        icon: false,
                        menu: [
                            {
                                text: "Custom Heading 1",
                                onclick: function() {
                                    var opt = $("#bodyTable").data("json");
                                    var h1Shadow =
                                        opt.h1ShadowX +
                                        "px " +
                                        opt.h1ShadowY +
                                        "px " +
                                        opt.h1ShadowBlur +
                                        "px " +
                                        opt.h1ShadowColor;

                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        '<p class="eb-h1" style="margin-bottom: 15px; margin-top: 0; line-height: 125%;"><span style="font-size: 30px; line-height: 125%; color: ' +
                                        opt.h1Color +
                                        "; text-shadow: " +
                                        h1Shadow +
                                        '; ">' +
                                        editor.selection.getContent() +
                                        "</span></p>"
                                    );
                                }
                            },
                            {
                                text: "Custom Heading 2",
                                onclick: function() {
                                    var opt = $("#bodyTable").data("json");
                                    var h2Shadow =
                                        opt.h2ShadowX +
                                        "px " +
                                        opt.h2ShadowY +
                                        "px " +
                                        opt.h2ShadowBlur +
                                        "px " +
                                        opt.h2ShadowColor;

                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        '<p class="eb-h2" style="margin-bottom: 15px; margin-top: 0; line-height: 125%;"><span style="font-size: 20px; line-height: 125%; color: ' +
                                        opt.h2Color +
                                        "; text-shadow: " +
                                        h2Shadow +
                                        '; ">' +
                                        editor.selection.getContent() +
                                        "</span></p>"
                                    );
                                }
                            },
                            {
                                text: "Heading 1",
                                onclick: function() {
                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        '<h1 style="font-size: 26px; padding:0; margin: 0;">' +
                                        editor.selection.getContent() +
                                        "</h1>"
                                    );
                                }
                            },
                            {
                                text: "Heading 2",
                                onclick: function() {
                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        '<h2 style="font-size: 22px; padding:0; margin: 0;">' +
                                        editor.selection.getContent() +
                                        "</h2>"
                                    );
                                }
                            },
                            {
                                text: "Heading 3",
                                onclick: function() {
                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        '<h3 style="font-size: 16px; padding:0; margin: 0;">' +
                                        editor.selection.getContent() +
                                        "</h3>"
                                    );
                                }
                            },
                            {
                                text: "Heading 4",
                                onclick: function() {
                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        '<h4 style="font-size: 14px; padding:0; margin: 0;">' +
                                        editor.selection.getContent() +
                                        "</h4>"
                                    );
                                }
                            },
                            {
                                text: "Paragraph",
                                onclick: function() {
                                    editor.execCommand(
                                        "mceReplaceContent",
                                        false,
                                        "<p>" + editor.selection.getContent() + "</p>"
                                    );
                                }
                            }
                        ]
                    });
                    editor.on("change", function(e) {
                        ll_activation_builder.updateHTMLBlock(editor.id);
                    });
                    editor.on("keyup", function() {
                        ll_activation_builder.updateHTMLBlock(editor.id);
                    });
                    editor.on("ExecCommand", function() {
                        ll_activation_builder.updateHTMLBlock(editor.id);
                    });

                    /*editor.on("setContent", function() {

                    });*/
                },
                init_instance_callback: function (inst){
                    inst.is_initiatlized = true;
                },
            };
            tinymce.init( tinymceOpts);
        }

        // ------ Leaderboard

        $(".leadboard__html").live("click", function() {
            // + typeSlide
            $(".right-panel-slide li, .right-panel-slide .tab-content").hide().removeClass('selected');
            $(".right-panel-slide li.leaderboard, .right-panel-slide .tab-content.leaderboard").show();
            $(".right-panel-slide li.leaderboard:first, .right-panel-slide .tab-content.leaderboard:first").addClass('selected');

            $(".right-panel-slide")
                .addClass("active")
                .show()
                .animate({ right: 0 }, 300);

            var $html = $(".leadboard__html .leadboard__help-column").length ? "" : $(".leadboard__html").html();
            ll_activation_builder.editor_set_content('leaderboard_html_editor', $html);
        });

        $(".slide-box__head").on("click", function() {
            var $this = $(this);
            if (!$this.hasClass("opened")) {
                $this.siblings(".slide-box__content:visible").slideToggle(function() {
                    $this.siblings(".slide-box__head.opened").removeClass("opened");
                });
            } else {
            }
            $this.toggleClass("opened");
            $this.next(".slide-box__content").slideToggle();
        });

        $(".st-btn-upload-image").on("click", function() {
            var $box = $(this).parent();

           /* if ($box.hasClass("upload-logo")) {
                url = images.logo;
            } else if ($box.hasClass("upload-bg-header")) {
                url = images.header;
            } else if ($box.hasClass("upload-bg-page")) {
                url = images.page;
            } else {
                url = images.leadboard;
            }
*/
            moxman.browse({
                url: '',
                view: 'thumbs',
                title: 'Media Manager',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                //fileinfo_fields: 'path url',
                extensions:'jpg,jpeg,png,gif',
                oninsert: function(args) {
                    if(args.files[0].url){
                        var img = args.files[0];
                        if(img.canPreview){
                            ll_activation_builder.addImage($box, img.url);
                        }
                    }
                }
            });


        });

        $(".leadboard__header-logo").on("click", function(e) {
            e.preventDefault();
            moxman.browse({
                url: '',
                view: 'thumbs',
                title: 'Media Manager',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                //fileinfo_fields: 'path url',
                extensions:'jpg,jpeg,png,gif',
                oninsert: function(args) {
                    if(args.files[0].url){
                        var img = args.files[0];
                        if(img.canPreview){
                            ll_activation_builder.addImage($(".slide-box__content .upload-logo"), img.url);
                        }
                    }
                }
            });

        });

        $(".leadboard__header-logo").on("click", ".leadboard__reset-header-logo", function(e) {
            e.stopPropagation();
            ll_activation_builder.addImage($(".slide-box__content .upload-logo"), null);
        });

        $(".builder-leadboard-panels, .capture-screen-settings").on("click", ".st-unload-image__remove", function() {
            var $box = $(this).closest(".st-right__inner");
            ll_activation_builder.addImage($box, null);
        });

        $(".st-input-css").change(function() {
            var $this = $(this);
            var val = $this.val();
            var result = val.match(/\b(auto)\b|\b[0-9]{1,}(px|\u0025)?/g);

            if (result != null) {
                if (+result) $this.val(result + "px");
                else $this.val(result);
            } else {
                $this.val("");
            }
            ll_activation_builder.changeInputCss($this);
        });

        $('.touch-spin').TouchSpin({
            min: 0,
            max: 100
        });

        $(".select-type-bg").change(function() {
            var id = $(this).attr('id');
            var val = $(this).val();
            var $parent = $(this).closest(".st-bg");
            var $customBox = $parent.find(".custom-bg-box");
            var $freeImagesBox = $parent.find(".free-images-box");

            if (val === "0") {
                $customBox.show();
                $freeImagesBox.hide();
            } else if (val === "1") {
                $customBox.hide();
                $freeImagesBox.find(".search-input-free-images > .txt-field").val("");
                $freeImagesBox.show();
                ll_activation_builder.freeImages(1, "", false, $freeImagesBox);
            }
            ll_activation_builder.updateStyleInfo(id, val);
        });

        $(".search-input-free-images > .txt-field").change(function() {
            var $parent = $(this).closest(".st-bg");
            var $freeImagesBox = $parent.find(".free-images-box");
            var $input = $(this);
            var val = $.trim($input.val());

            ll_activation_builder.freeImages(1, val, false, $freeImagesBox);
        });

        $(".btn-more-free-images:not(.disabled)").on("click", function() {
            var $btn = $(this);
            var $parent = $(this).closest(".st-bg");
            var $freeImagesBox = $parent.find(".free-images-box");
            var pageCount = $btn.attr("data-page");
            var val = $.trim($freeImagesBox.find(".input-free-images").val());

            $btn.addClass("disabled");
            ll_activation_builder.freeImages(pageCount, val, true, $freeImagesBox);
        });

        $(".list-free-images").on("click", ".list-free-images__item:not(.screensaver)", function() {
            var url = $(this).attr("data-url");
            var type = $(this)
                .closest(".free-images-box")
                .attr("type-action");
            if (type === "upload-bg-page") {
                $box = $(".custom-bg-box .upload-bg-page");
            } else if (type === "upload-bg-header") {
                $box = $(".custom-bg-box .upload-bg-header");
            } else if (type === "upload-bg-capture-screen") {
                $box = $(".custom-bg-box .upload-bg-capture-screen");
            } else if (type === "upload-bg-html") {
                $box = $(".custom-bg-box .upload-bg-html");
            } else {
                $box = $(".custom-bg-box .upload-bg-leaderboard");
            }
            ll_activation_builder.addImage($box, url);
        });

        $(".activation-designer").on( "click", ".btn-preview-leaderboard", function() {
                var $btn = $(".btn-preview-leaderboard");
                $btn.toggleClass("active");

                if ($btn.hasClass("active")) {
                    ll_activation_builder.getHTMLPreviewLeaderboard();
                    $("#previewLeaderboard").show();
                } else {
                    $("#previewLeaderboard")
                        .hide()
                        .html("");
                }
        });

        $(".btn-leaderboard-fullscreen").on("click", function() {
            var $btn = $(this);
            var $wrap = $(".leadboard__columns");
            var leftRightSideForm = $(".left-right-side-form");
            var $parent = $btn.parent();


            $(".btn-leaderboard--left").trigger('click');

            $btn.toggleClass("active");

            if (!$btn.hasClass("active")) {
                $wrap.removeClass("fullscreen");
                $parent.removeClass("fullscreen");
                $('.wrap-builder-leadboard .custom-content-settings').show();
                ll_activation_builder.updateStyleInfo('leaderboardAlingment', LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT);
            } else {
                $('.wrap-builder-leadboard .custom-content-settings').hide();
                $wrap.addClass("fullscreen");
                $parent.addClass("fullscreen");
                ll_activation_builder.updateStyleInfo('leaderboardAlingment', $btn.attr('display-type'));
            }
        });

        $(".btn-leaderboard--left, .btn-leaderboard--right").on( "click", function() {
                var $btn = $(this);
                var $wrap = $(".leadboard__columns");
                var $colLeft = $(".leadboard__column-left");
                var $colRight = $(".leadboard__column-right");
                var $leaderboardCol = $(".leadboard__content");
                var $HTMLCol = $(".leadboard__html");
                var $btnLeft = $(".btn-leaderboard--left");
                var $btnRight = $(".btn-leaderboard--right");

                $btn.addClass("active");

                $('.wrap-builder-leadboard .custom-content-settings').show();

                if ($btn.hasClass("btn-leaderboard--left")) {
                    $colLeft.append($leaderboardCol);
                    $colRight.append($HTMLCol);
                    $btnRight.removeClass("active");
                    $wrap.removeClass('orderActive');
                } else {
                    $colLeft.append($HTMLCol);
                    $colRight.append($leaderboardCol);
                    $btnLeft.removeClass("active");
                    $wrap.addClass('orderActive');
                }
                ll_activation_builder.updateStyleInfo('leaderboardAlingment', $btn.attr('display-type'));
            }
        );

        //ll_activation_builder.codeBox.init();

        //  Load
        ll_activations_manager.load(ll_activation_builder.ll_activation_id, 1, function(response){
            if(typeof response.ll_activation_identifiers != 'undefined' && response.ll_activation_identifiers) {
                ll_activation_builder.ll_activation_identifiers = response.ll_activation_identifiers;
            }
            if(typeof response.ll_activation_identifier != 'undefined' && response.ll_activation_identifier) {
                ll_activation_builder.ll_activation_identifier = response.ll_activation_identifier;
                if(typeof response.ll_activation_identifier.ll_activation_identifier_configuration != 'undefined'){
                    ll_activation_builder.activation_configuration = response.ll_activation_identifier.ll_activation_identifier_configuration;
                }
            }
            if(typeof response.ll_shared_prizes != 'undefined' && response.ll_shared_prizes) {
                ll_activation_builder.ll_shared_prizes = response.ll_shared_prizes;
            }
            if(typeof response.ll_activation != 'undefined' && response.ll_activation) {
                ll_activation_builder.activation = JSON.parse(JSON.stringify(response.ll_activation));
                ll_activation_builder.populate(response.ll_activation);
                ll_activation_builder.is_builder_initiated = true;
            }

            if(parseInt(EVENTS_PERMISSION) && (typeof ll_activation_builder.activation.event_id == 'undefined' || !parseInt(ll_activation_builder.activation.event_id))){
                $('.event-field').show();
            } else {
                $('.event-field').hide();
            }
        });

        $('#add_activation_instructions').click(function(){
            ll_activations_manager.add_instructions_popup(ll_activation_builder.ll_activation_id);
            ll_activations_manager.load_activation_instructions(ll_activation_builder.ll_activation_id);
        });
    },
    add_screensaver_line: function (screenURL) {
        file_name = '';
        if(screenURL){
            file_name = screenURL.substring(screenURL.lastIndexOf('/')+1);
        }
        var html = '<div class="line-criteries t-field">' +
                    '<a href="javascript:void(0)" class="fb-btn-move"></a>' +
                    '<a href="javascript:void(0)" class="add-line-criteries btnEmailPlus"></a>' +
                    '<a href="javascript:void(0)" class="remove-line-criteries btnEmailMinus"></a>' +
                    '<div class="screensaver-img" selc="screensaver-img">' +
                    '</div>'+
                    '</div>';
        $('.sc-list-image').append(html);
        ll_activation_builder.addHTMLImage($('.screensaver-img:last'), screenURL, file_name, '');
        $('.sc-list-image .line-criteries:last .remove-line-criteries').click(function () {
            if ($('.sc-list-image .line-criteries').length > 0) {
                ll_activation_builder.addHTMLImage($(this).closest('.line-criteries ').find('.screensaver-img'));
                if ($('.sc-list-image .line-criteries').length > 1) {
                    $(this).closest('.line-criteries').remove();
                }
            }
        });
        $('.sc-list-image .line-criteries:last .add-line-criteries').click(function(){
            ll_activation_builder.add_screensaver_line('');
        });
    },
    addHTMLImage: function (parent, urlImgSource, file_name, size ) {
        var html = ll_activation_builder.getImageHTML(file_name, size, urlImgSource);
        parent.html('');
        parent.append(html);
        parent.find(('.event-bg__link-browse, .event-bg__link-replace ')).bind('click', function(){
            thisBlock = $(this);
            moxman.browse({
                view: 'thumbs',
                title: 'Media Manager',
                extensions:'jpg,jpeg,png',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                oninsert: function(args) {
                    if(args.files[0].url){
                        html = ll_activation_builder.addHTMLImage(thisBlock.closest('.' + parent.attr('selc')), args.files[0].url, args.files[0].name, args.files[0].meta.width + ' X ' + args.files[0].meta.height);
                    }
                }
            });
        });
        parent.find('.event-bg__link-remove').bind('click', function(){
            ll_activation_builder.addHTMLImage(parent);
        });
        parent.find('.event-bg__link-free-images').bind('click', function(){
            if(!$(".unsplash-right-panel").is(':visible')) {
                ll_activation_builder.freeImages(1, '', false, parent);
                $('.pb-input-free-images').val('');
                $('.pb-more-free-images').attr('data-page', 2);
                $('.tool-col .eb-inner-tool').hide();
                $('.pb-more-free-images').unbind("click");
                $('.pb-more-free-images:not(.disabled)').on('click', function () {
                    var $btn = $(this);
                    var page = $btn.attr('data-page') || 2;
                    $btn.addClass('disabled');
                    ll_activation_builder.freeImages(page, $.trim($('.pb-input-free-images').val()), true, parent);
                    $btn.attr('data-page', parseInt(page) + 1);
                });
                $('.pb-input-free-images').unbind();
                $('.pb-input-free-images').keyup(function (e) {
                    if (e.which == 13) {
                        ll_activation_builder.freeImages(1, $.trim($(this).val()), false, parent);
                    }
                });
                // $('.unsplash-right-panel').show();
                $(".unsplash-right-panel")
                    .addClass("active")
                    .show()
                    .animate({right: 0}, 300);
            }
        });
        $('#close_unsplash-right-panel').bind('click', function(){
            $('.unsplash-right-panel').hide();
        });
        return html;
    },
    getImageHTML: function (file_name, size, urlImgSource) {
        var html = '';
        var title = (typeof file_name != 'undefined' && file_name) ? file_name.substring(file_name.lastIndexOf('/')+1) : 'Upload an Image';
        title = title.length > 20 ? title.substring(0, 19) + '...' : title;
        var size = (typeof size != 'undefined' && size) ? size : '';
        var urlImg = (typeof urlImgSource != 'undefined' && urlImgSource) ? urlImgSource : LL_APP_HTTPS + '/imgs/imgs_email_builder/img_upload.jpg';
        var urlImgScr = (typeof urlImgSource != 'undefined' && urlImgSource) ? urlImgSource : '';
        var cssHide = 'style = "display: none;"';
        var cssHideBrowse = '';
        // var cssImageNone = ' pb-image__icn--none';
        var cssHideRemove = 'style = "display: none;"';

        if (typeof urlImgSource != 'undefined' && urlImgSource) {
            /*if(! size){
             $imgBlock.find('img').addClass('select_this_image');
             size = document.getElementsByClassName('select_this_image')[0].naturalWidth + ' X ' + document.getElementsByClassName('select_this_image')[0].naturalHeight
             $imgBlock.find('img').removeClass('select_this_image');
             }*/
            cssHide = '';
            cssHideRemove = '';
            cssHideBrowse = 'style = "display: none;"';
            //cssImageNone = '';
        }

        html = '<img class="pb-image__icn" src="' + urlImg + '" src-img= "' + urlImgScr + '">' +
            '<div class="pb-image__meta">' +
            '<div class="pb-image__title"><strong>' + title + '</strong></div>' +
            //'<div class="pb-image__size">' + (size ? size : '66 x 53') + '</div>' +
            '<ul class="pb-image__links clearfix">' +
            '<li ' + cssHideBrowse + '>' +
            '<a href="javascript:void(0);" class="event-bg__link-browse">Browse</a>' +
            '</li>' +
            '<li ' + cssHide + '>' +
            '<a href="javascript:void(0);" class="event-bg__link-replace">Replace</a>' +
            '</li>';

        html += '<li ' + cssHideRemove + '>' +
            '<a href="javascript:void(0);" class="event-bg__link-remove">Remove</a>' +
            '</li>' +
            '<li>' +
            '<a href="javascript:void(0);" class="event-bg__link-free-images">Unsplash</a>' +
            '</li>' +
            '</ul>' +
            '</div >';
        return html;
    },
    resizeColumn: function() {
        var widthBody = $("body").width();
        var $colRight = $(".tab-content-page[id-form=capture-screen] .tool-col");
        var defaultWidth = widthBody / 2;

        $colRight.width(defaultWidth);
        $(".tab-content-page[id-form=capture-screen] .wrap-preview-col").css({
            right: defaultWidth + "px"
        });
        resizebleMaxWidth = widthBody - 480;
        $previewColResizable.resizable("option", "maxWidth", resizebleMaxWidth);
    },
    resizeColumnInit: function() {
        var resizebleMaxWidth = $("#capture-screen-content").outerWidth() - 480;
        var startResizebleWidth = 0;
        $previewColResizable = $(".tab-content-page[id-form=capture-screen]  .wrap-preview-col").resizable({
            handles: "e",
            minWidth: 480,
            maxWidth: resizebleMaxWidth,
            start: function(event, ui) {
                startResizebleWidth = $(".tab-content-page[id-form=capture-screen]  .preview-col").outerWidth();
            },
            resize: function(event, ui) {
                var $colRight = $(".tab-content-page[id-form=capture-screen] .tool-col");
                var width =
                    $("#capture-screen-content").outerWidth() -
                    $(".tab-content-page[id-form=capture-screen]  .wrap-preview-col").outerWidth();
                $colRight.css("width", width + "px");
            },
            stop: function(event, ui) {
                $(".tab-content-page[id-form=capture-screen] .wrap-preview-col").css({
                    left: "0",
                    width: "auto",
                    right: $(".tool-col").outerWidth()
                });
            }
        });
    },
    resizeTabs: function(){
        var tabsCount = $('.activation-designer .tabs-pages li[id-form]:visible').length;
        var tabWidth = 100 / tabsCount;
        $('.activation-designer .tabs-pages li[id-form]').css('width', tabWidth+'%');
    },
    populate_identifier: function(ll_identifier){

        if(typeof ll_identifier != "undefined" && ll_identifier) {

            $('.custom-activation-page').attr('identifier', ll_identifier.ll_activation_identifier_alias);

            ll_activation_builder.draw_configuration(ll_identifier, function () {
                ll_activation_builder.add_additional_elements(ll_identifier);
            });

            if (typeof ll_identifier.force_capture_form_before_or_after != "undefined" &&  parseInt(ll_identifier.force_capture_form_before_or_after)) {
                ll_theme_manager.checkboxRadioButtons.check('input[name=capture_form_before_or_after][value='+ll_identifier.force_capture_form_before_or_after+']', true);
                $('.activation-designer:not(.no-events) .capture-before-or-after').hide();
            } else {
                $('.activation-designer:not(.no-events) .capture-before-or-after').show();
            }
            var is_accept_leaderboard = (typeof ll_identifier.is_accept_leaderboard != "undefined" && parseInt(ll_identifier.is_accept_leaderboard)) ? 1 : 0;
            var use_activation_mode = (typeof ll_identifier.use_activation_mode != "undefined" && Object.keys(ll_identifier.use_activation_mode)).length ? 1 : 0;

            if(use_activation_mode){
                $('.activation_mode_element').show();
            } else {
                if (is_accept_leaderboard) {
                    $('[id-form="leaderboard"]').show();
                } else {
                    $('[id-form="leaderboard"]').hide();
                }

            }

            $('.winners_info').html('');
            if(typeof ll_identifier.show_winners_info != "undefined" && parseInt(ll_identifier.show_winners_info)){
           /*     var _html = '';
                _html += '<div class="h3 winners_info">Total possible winners</div>';
                _html += '<div class="t-field winners_info">';
                _html += '  <input type="number" class="txt-field" id="count_of_winners" value="1">';
                _html += '</div>';*/
                /*  if(typeof ll_identifier.winner_methods != "undefined" && Object.keys(ll_identifier.winner_methods).length){
                    for(var i in ll_identifier.winner_methods){
                        _html += '<div class="t-radio">';
                        _html += ' <label>';
                        _html += '     <i class="icn-radio"></i>';
                        _html += '     <input type="radio" name="radio_winner_methods" value="' + i + '" > ' + ll_identifier.winner_methods[i] + '';
                        _html += ' </label>';
                        _html += '</div>';
                    }
                    $('.t-field.winner_methods').html(_html);
                    ll_theme_manager.checkboxRadioButtons.initiate_container('.t-field.winner_methods');
                    ll_theme_manager.checkboxRadioButtons.check('input[name=radio_winner_methods]:first', true);

                    $('.winner_methods').show();
                } else {
                    $('.winner_methods').hide();
                }*/
               // $('.winners_info').html(_html).show();
            }

            ll_activation_builder.resizeTabs();
        }
    },
    draw_configuration: function(ll_identifier, _callback){

        $('.activation-configuration-elements').html('');

        var html = '';
        if(typeof ll_identifier.ll_activation_identifier_configuration != 'undefined' && ll_identifier.ll_activation_identifier_configuration){
            for(var i in ll_identifier.ll_activation_identifier_configuration){
                var ll_identifier_configuration = ll_identifier.ll_activation_identifier_configuration[i];
                html = ll_activation_builder.configuration_item_html(ll_identifier.ll_activation_identifier_configuration[i]);
                if(typeof ll_identifier_configuration.layout != 'undefined' && ll_identifier_configuration.layout){
                    switch (ll_identifier_configuration.layout) {
                        case 'right':
                            $('.right-column .activation-configuration-elements').append(html);
                            break;
                        case 'left':
                            $('.left-column .activation-configuration-elements').append(html);
                            break;
                    }
                }
                if(typeof ll_identifier_configuration.title != 'undefined' && $.trim(ll_identifier_configuration.title)){
                    $('.activation-configuration-elements .h3.h-'+i).addClass('ll_std_tooltip').attr('title', ll_identifier_configuration.title);
                }
                if(typeof ll_identifier_configuration.isRequired != 'undefined' && parseInt(ll_identifier_configuration.isRequired)){
                    $('.activation-configuration-elements [identifier='+i+']').addClass('required');
                }
                if(typeof ll_identifier_configuration.class != 'undefined' && $.trim(ll_identifier_configuration.class)){
                    $('.activation-configuration-elements [identifier='+i+'], .activation-configuration-elements .h3.h-'+i+'').addClass(ll_identifier_configuration.class);
                }

            }
        }
        //--------------
        if(typeof ll_identifier.ll_activation_identifier_configuration != 'undefined' && ll_identifier.ll_activation_identifier_configuration){
            for(var i in ll_identifier.ll_activation_identifier_configuration){
                switch (ll_identifier.ll_activation_identifier_configuration[i].type) {
                    case 'prizes_and_inventory':
                        ll_activation_builder.addNewInventory($('.configuration-item[type="prizes_and_inventory"][identifier="'+i+'"] .inventory-prizes'));
                        break;
                    case 'objects':
                        ll_activation_builder.addNewObject($('.configuration-item[type="objects"][identifier="'+i+'"] .container-objects'), ll_identifier.ll_activation_identifier_configuration[i].object);
                        break;
                }
            }
        }
        //--------------
        ll_activation_builder.apply_configuration_actions();
        ll_activation_builder.apply_additional_actions(ll_identifier);

        if(typeof ll_identifier.ll_activation_identifier_values != 'undefined' && ll_identifier.ll_activation_identifier_values){
            ll_activation_builder.populate_configuration_data(ll_identifier.ll_activation_identifier_values, function () {
                ll_activation_builder.after_append_configuration(ll_identifier);
            });
        }
        if(typeof _callback != 'undefined' && _callback){
            _callback();
        }
    },
    configuration_item_html: function(configuration_item){
        if(typeof configuration_item != 'undefined' && configuration_item){

            var _html = '';
            switch (configuration_item.type) {
                case 'text':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <input type="text" class="txt-field">';
                    _html += '</div>';
                    break;
                case 'textarea':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <textarea class="txt-field"></textarea>';
                    _html += '</div>';
                    break;
                case 'number':
                    var length = (typeof configuration_item.length != 'undefined' && parseInt(configuration_item.length)) ? configuration_item.length : 0;
                    var min = (typeof configuration_item.min != 'undefined' && parseInt(configuration_item.min)) ? configuration_item.min : 0;
                    var max = (typeof configuration_item.max != 'undefined' && parseInt(configuration_item.max)) ? configuration_item.max : 0;
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'" >';
                    _html += '  <input type="number" class="txt-field"';
                    if(length) {
                        _html += ' pattern="/^-?\d+\.?\d*$/" onKeyPress="ll_activation_builder.chkNumberLength(this);" onKeyUp="ll_activation_builder.chkNumberLength(this);"  length="'+length+'" ';
                    }
                    if(min) {
                        _html += ' min="'+min+'" ';
                    }
                    if(max) {
                        _html += ' max="'+max+'" ';
                    }
                    _html += '  />';
                    _html += '</div>';
                    break;
                case 'color':
                    _html += '<div class="wheel-colors configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '    <div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '    <div class="wrap-color">';
                    _html += '      <div data-id="backgroundPage" style="background-color: #'+configuration_item.selected+';" class="color-box" data-color-start="'+configuration_item.selected+'"></div>';
                    _html += '    </div>';
                    _html += '</div>';
                    break;
                case 'image':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="upload-image no-files configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <input type="hidden" class="txt-field img-url">';
                    _html += '  <div class="upload-image__file"></div>';
                    _html += '  <div class="upload-image__actions">';
                    _html += '    <a href="javascript:void(0);" class="t-btn-gray">Upload Image</a>';

                    _html += '    <div class="name-file">';
                    _html += '      <i class="icn-edit-img ll_std_tooltip" title="Edit">';
                    _html += '          <svg  width="13px" height="13px" fill="#A6A6A6" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 469.336 469.336" style="enable-background:new 0 0 469.336 469.336;" xml:space="preserve"><g><g><g><path d="M347.878,151.357c-4-4.003-11.083-4.003-15.083,0L129.909,354.414c-2.427,2.429-3.531,5.87-2.99,9.258     c0.552,3.388,2.698,6.307,5.76,7.84l16.656,8.34v28.049l-51.031,14.602l-51.51-51.554l14.59-51.075h28.025l8.333,16.67     c1.531,3.065,4.448,5.213,7.833,5.765c0.573,0.094,1.146,0.135,1.708,0.135c2.802,0,5.531-1.105,7.542-3.128L317.711,136.26     c2-2.002,3.125-4.712,3.125-7.548c0-2.836-1.125-5.546-3.125-7.548l-39.229-39.263c-2-2.002-4.708-3.128-7.542-3.128h-0.021     c-2.844,0.01-5.563,1.147-7.552,3.159L45.763,301.682c-0.105,0.107-0.1,0.27-0.201,0.379c-1.095,1.183-2.009,2.549-2.487,4.208     l-18.521,64.857L0.409,455.73c-1.063,3.722-0.021,7.736,2.719,10.478c2.031,2.033,4.75,3.128,7.542,3.128     c0.979,0,1.958-0.136,2.927-0.407l84.531-24.166l64.802-18.537c0.195-0.056,0.329-0.203,0.52-0.27     c0.673-0.232,1.262-0.61,1.881-0.976c0.608-0.361,1.216-0.682,1.73-1.146c0.138-0.122,0.319-0.167,0.452-0.298l219.563-217.789     c2.01-1.991,3.146-4.712,3.156-7.558c0.01-2.836-1.115-5.557-3.125-7.569L347.878,151.357z"/><path d="M456.836,76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365,0.031l-39.073,39.461     c-4.135,4.181-4.125,10.905,0.031,15.065l108.896,108.988c2.083,2.085,4.813,3.128,7.542,3.128c2.719,0,5.427-1.032,7.51-3.096     l39.458-39.137c8.063-8.069,12.5-18.787,12.5-30.192S464.899,84.237,456.836,76.168z"/></g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
                    _html += '      </i>';
                    _html += '      <i class="icn-reset-img ll_std_tooltip" title="Reset">';
                    _html += '          <svg  width="13px" height="13px" fill="#A6A6A6" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512.011 512.011" style="enable-background:new 0 0 512.011 512.011;" xml:space="preserve"><g><g><path d="M511.136,286.255C502.08,194.863,419.84,128.015,328,128.015H192v-80c0-6.144-3.52-11.744-9.056-14.432    c-5.568-2.656-12.128-1.952-16.928,1.92l-160,128C2.208,166.575,0,171.151,0,176.015s2.208,9.44,5.984,12.512l160,128    c2.912,2.304,6.464,3.488,10.016,3.488c2.368,0,4.736-0.512,6.944-1.568c5.536-2.688,9.056-8.288,9.056-14.432v-80h139.392    c41.856,0,80,30.08,84.192,71.712c4.832,47.872-32.704,88.288-79.584,88.288H208c-8.832,0-16,7.168-16,16v64    c0,8.832,7.168,16,16,16h128C438.816,480.015,521.472,391.151,511.136,286.255z"/></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg>';
                    _html += '      </i>';
                    _html += '      <i class="icn-remove-img ll_std_tooltip" title="Remove">';
                    _html += '          <svg width="13px" height="13px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-915.000000, -620.000000)" fill="#A6A6A6"><g transform="translate(915.000000, 187.000000)"><path d="M6.17330432,433.173538 C2.85966529,433.173538 0.173538462,435.859665 0.173538462,439.173304 C0.173538462,442.486943 2.85966529,445.173538 6.17330432,445.173538 C9.48694334,445.173538 12.1735385,442.486943 12.1735385,439.173304 C12.1735385,435.859665 9.48694334,433.173538 6.17330432,433.173538 L6.17330432,433.173538 Z M8.88003602,441.230982 L8.23004578,441.880504 C8.11109944,441.999919 7.91628968,441.999919 7.79734334,441.880504 L6.17330432,440.256465 L4.54973358,441.880036 C4.43031895,441.999451 4.23597749,441.999451 4.11656285,441.879099 L3.46657261,441.230982 C3.34809456,441.111099 3.34809456,440.917695 3.46657261,440.797343 L5.09061163,439.173773 L3.4670409,437.550202 C3.34809456,437.430319 3.34809456,437.235509 3.4670409,437.117031 L4.11703114,436.467041 C4.23644578,436.34669 4.43125553,436.34669 4.55020188,436.467041 L6.17330432,438.09108 L7.79734334,436.467041 C7.91675797,436.34669 8.11156773,436.34669 8.23004578,436.467041 L8.88003602,437.116095 C8.99898236,437.235509 8.99898236,437.430319 8.88050432,437.550202 L7.25646529,439.173773 L8.88050432,440.797343 C8.99851407,440.917695 8.99851407,441.111099 8.88003602,441.230982 L8.88003602,441.230982 Z" id="Shape"></path></g></g></g></svg>';
                    _html += '      </i>';
                    //_html += '      <span></span>';
                    _html += '    </div>';
                    _html += '  </div>';
                    _html += '</div>';
                    break;
                case 'images':
                    var count = (typeof configuration_item.count != 'undefined' && parseInt(configuration_item.count)) ? configuration_item.count : 0;
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'" count="'+count+'">';
                    _html += '  <div class="upload-images">';
                    _html += '      <div class="images">';
                    _html += '      </div>';
                    _html += '   <a href="javascript:void(0);" class="t-btn-gray add-object">Add ' + configuration_item.label.slice(0, -1) + '</a>';
                    _html += '   <a href="javascript:void(0);" class="t-btn-gray add-default-objects">Add Default '+configuration_item.label+'</a>';
                    _html += '  </div>';
                    _html +='</div>';
                    break;
                case 'radio':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                         if(typeof configuration_item.values != 'undefined' && configuration_item.values){
                             for (var i in configuration_item.values){
                                 var checked = i == 0 ? 'checked' : '';
                                 var has_tooltip = (typeof configuration_item.values[i].title != 'undefined' && $.trim(configuration_item.values[i].title)) ? 1 : 0;
                                 if(has_tooltip){
                                     _html += '<div class="t-radio ll_std_tooltip" title="'+configuration_item.values[i].title+'">';
                                 } else {
                                     _html += '<div class="t-radio">';
                                 }
                                 _html += ' <label>';
                                 _html += '     <i class="icn-radio"></i>';
                                 _html += '     <input type="radio" name="radio_'+configuration_item.identifier+'" value="' + i + '" ' + checked + '> ' + configuration_item.values[i].label + '';
                                 _html += ' </label>';
                                 _html += '</div>';
                             }
                         }
                    _html +='   </div>';
                    break;
                case 'checkbox':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    var checked = configuration_item.checked == 1 ? 'checked="checked"' : '';
                    _html += '  <div class="ll-switch switch-small">';
                    _html += '  	<div class="switch">';
                    _html += '  		<input id="check_'+configuration_item.identifier+'" name="check_'+configuration_item.identifier+'"  ' + checked + ' class="cmn-toggle cmn-toggle-round" type="checkbox">';
                    _html += '  		<label for="check_'+configuration_item.identifier+'"></label>';
                    _html += '  	</div>';
                    _html += '  	<div class="ll-switch-lb"></div>';
                    _html += '  </div>';
                    _html += '</div>';
                    break;
                case 'checkboxes':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    var per_line = (typeof configuration_item.per_line != 'undefined' && configuration_item.per_line == 1) ? 'per_line' : '';
                    if(typeof configuration_item.values != 'undefined' && configuration_item.values){
                        for (var i in configuration_item.values){
                            _html += '  <div class="ll-switch switch-small '+per_line+' ">';
                            _html += '  	<div class="switch">';
                            _html += '  		<input id="check_'+configuration_item.values[i].val+'" name="check_'+configuration_item.values[i].val+'" identifier="'+configuration_item.values[i].val+'" class="cmn-toggle cmn-toggle-round" type="checkbox">';
                            _html += '  		<label for="check_'+configuration_item.values[i].val+'"></label>';
                            _html += '  	</div>';
                            if(typeof configuration_item.with_imgs != 'undefined' && configuration_item.with_imgs == 1 ){
                                _html += '  	<div class="ll-switch-icn"><img src="'+configuration_item.values[i].img+'" style="cursor:pointer" onclick=ll_activation_builder.zoom_screenshot("'+configuration_item.values[i].img+'");></div>';
                            }
                            _html += '  	<div class="ll-switch-lb">'+configuration_item.values[i].lbl+'</div>';

                            _html += '  </div>';
                        }
                    }
                    _html +='   </div>';
                    break;
                case 'select':
                    _html += '<div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '<div class="t-field configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <select class="textField">';
                         if(typeof configuration_item.values != 'undefined' && configuration_item.values){
                             for (var i in configuration_item.values){
                                 _html += '<option value="' + i + '">' + configuration_item.values[i] + '</option>';
                             }
                         }
                    _html +='       </select>';
                    _html +='   </div>';
                    break;
                case 'prizes_and_inventory':
                    _html += '<div class="prizes-inventory-box configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '  <div class="inventory-prizes no-remove">';
                    _html += '  </div>';
                    _html += '</div>';
                    break;
                case 'object':
                case 'objects':
                    _html += '<div class="objects-box configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '  <div class="container-objects no-remove">';

                    _html += '  </div>';
                    _html += '</div>';
                    break;
                case 'questions':
                    _html += '<div class="questions-box configuration-item" identifier="'+configuration_item.identifier+'" type="'+configuration_item.type+'">';
                    _html += '  <div class="h3 h-'+configuration_item.identifier+'">'+configuration_item.label+'</div>';
                    _html += '  <div class="container-questions no-remove">';
                    _html += '  </div>';
                    _html += '</div>';
                    break;
            }
            return _html;
        }
    },
    apply_configuration_actions: function(){

        // color
        $('.activation-configuration-elements .color-box').each(function () {
            var color = $(this).attr('data-color-start');
            $(this).colpick({
                colorScheme: 'dark',
                layout: 'hex',
                color: color,
                onSubmit: function (hsb, hex, rgb, el) {
                    $(el).css('background-color', '#' + hex);
                    $(el).colpickHide();
                    $(el).attr('data-color-start', hex);
                }
            }).css('background-color', '#' + color);
        });

        // image
        $('.activation-configuration-elements .upload-image .upload-image__actions .t-btn-gray, .activation-configuration-elements .upload-image .upload-image__actions .icn-edit-img').live('click', function(){
            var $box = $(this).closest('.upload-image');
            var element = $(this).closest('.upload-image').find('.img-url');
            var current_src = element.val();
            moxman.browse({
                url: current_src,
                view: 'thumbs',
                title: 'Media Manager',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                //fileinfo_fields: 'path url',
                extensions:'jpg,jpeg,png,gif',
                oninsert: function(args) {
                    if(args.files[0].url){
                        var img = args.files[0];
                        if(img.canPreview){
                            element.val(img.url);
                            ll_activation_builder.addConfigurationImage($box, img.url, img.name);
                        }
                    }
                }
            });
        });
        $('.activation-configuration-elements .upload-image .upload-image__actions .icn-remove-img').live('click', function(){
            ll_activation_builder.removeConfigurationImage($(this).closest(".upload-image"));
        });
        $('.activation-configuration-elements .upload-image .upload-image__actions .icn-reset-img').live('click', function(){
            var $box = $(this).closest(".upload-image");
            if(parseInt(ll_activation_builder.ll_activation_identifier_id) && Object.keys(ll_activation_builder.ll_activation_identifier).length) {
                var values = ll_activation_builder.ll_activation_identifier.ll_activation_identifier_values;
                if(typeof $box.attr('identifier') != 'undefined' && $box.attr('identifier') in values){
                    var img_url = $box.find('input.img-url').val();
                    if($.trim(img_url) == $.trim(values[$box.attr('identifier')]) || !$.trim(values[$box.attr('identifier')])){
                        ll_activation_builder.removeConfigurationImage($box);
                    } else {
                        ll_activation_builder.addConfigurationImage($(this).closest(".upload-image"), values[$box.attr('identifier')], '');
                    }
                }
            }
        });
        // radio checkbox
        ll_theme_manager.checkboxRadioButtons.initiate_container('.activation-configuration-elements');

        // select
       ll_combo_manager.make_combo($('.activation-configuration-elements select'));



       // prizes_and_inventory
        $(".activation-configuration-elements .prizes-inventory-box").on("click", ".add-line-inventory", function() {
            var is_shared = $(this).closest('.shared_prizes').length ? 1 : 0;
            var wrap = is_shared ? $(this).closest('.shared_prizes') : $(this).closest('.inventory-prizes');
            ll_activation_builder.addNewInventory(wrap, null , is_shared);
        });
        $(".activation-configuration-elements .prizes-inventory-box").on("click", ".remove-line-inventory", function() {
            ll_activation_builder.removeInventory($(this));
        });

        var $this = null ;
        var $line_inventory = null ;
        var $notifications_data = null ;

        $(".activation-configuration-elements .prizes-inventory-box").on("click", ".notifications-line-inventory", function() {
            $this = $(this);
            $line_inventory = $(this).closest('.line-inventory');
            $notifications_data = typeof $line_inventory.attr('notifications-data') != 'undefined' ? $.parseJSON( $line_inventory.attr('notifications-data')) : null;
            ll_activations_manager.open_prizes_notifications_popup($line_inventory.attr('prize_id'), 0, $notifications_data, function (data) {
                if(typeof data != 'undefined' && data){
                    if(typeof data.send_notification != 'undefined' && parseInt(data.send_notification)){
                        $this.addClass('item-selected');
                    } else {
                        $this.removeClass('item-selected');
                    }
                    $line_inventory.attr('notifications-data', JSON.stringify(data));
                }
            });

        });
        $('.activation-configuration-elements .browse-icn .t-btn-gray').live('click', function () {
            var img_prev = $(this).closest('.browse-icn').find('.icn-prev');
            var element = $(this).closest('.browse-icn').find('.icn-url');
            var current_src = element.val();
            moxman.browse({
                url: current_src,
                view: 'thumbs',
                title: 'Media Manager',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                //fileinfo_fields: 'path url',
                extensions:'jpg,jpeg,png,gif',
                oninsert: function(args) {
                    if(args.files[0].url){
                        var img = args.files[0];
                        if(img.canPreview){
                            element.val(img.url);
                            $(img_prev).html('<img src="'+img.url+'"/>');

                        }
                    }
                }
            });
        });
        $('.activation-configuration-elements .prizes-inventory-box .btn-star').live('click', function(){
            if($(this).hasClass('gold-star')){
                $(this).find('img').attr('src', 'imgs/vvp/svgs/grey-star.svg');
                $(this).removeClass('gold-star');
            } else {
                $(this).find('img').attr('src', 'imgs/vvp/svgs/gold-star.svg');
                $(this).addClass('gold-star');
            }
        });

        $('.activation-configuration-elements .field-prize').live('keyup', function(){
            ll_activation_builder.change_field_prize($(this));
            ll_activation_builder.apply_prizes_changes($(this).closest('.prizes-inventory-box'));
        });
        $('.activation-configuration-elements .field-prize').live('change', function(){
            ll_activation_builder.change_field_prize($(this));
            ll_activation_builder.apply_prizes_changes($(this).closest('.prizes-inventory-box'));

        });
        $('.activation-configuration-elements .custom_probability').live('keyup', function(){
            ll_activation_builder.apply_prizes_changes($(this).closest('.prizes-inventory-box'));
        });
        $('.activation-configuration-elements .custom_probability').live('change', function(){
            ll_activation_builder.apply_prizes_changes($(this).closest('.prizes-inventory-box'));
        });
        $('.activation-configuration-elements .btn-inventory-fullfilment-actions').live('click', function(e){
            e.preventDefault();
            e.stopPropagation();
            if(parseInt($(this).attr('ll_asset_id'))){
                populate_fulfillment_actions_manager ($(this));
            } else {
                show_error_message("Please add a prize and save first before adding Fulfillment Actions");
            }
        });

        // object
        $(".activation-configuration-elements .container-objects").on("click", ".add-line-object", function() {
            var identifier = $(this).closest('.configuration-item').attr('identifier');
            if(typeof identifier != 'undefined' && $.trim(identifier) && $.trim(identifier) in ll_activation_builder.activation_configuration){
                ll_activation_builder.addNewObject($(this).closest('.container-objects'), ll_activation_builder.activation_configuration[$.trim(identifier)].object);
            }
        });
        $(".activation-configuration-elements .container-objects").on("click", ".remove-line-object", function() {
            ll_activation_builder.removeObject($(this));
        });
        
        // questions
        $(".activation-configuration-elements .container-questions").on("click", ".add-line-question", function() {
            ll_activation_builder.addNewQuestion($(this).closest('.container-questions'));
        });
        $(".activation-configuration-elements .container-questions").on("click", ".remove-line-question", function() {
            ll_activation_builder.removeQuestion($(this));
        });
        $('.activation-configuration-elements .container-questions').on('click','.btn-star', function(){

            var $line_question = $(this).closest('.line-question');
            $line_question.find('.btn-star').removeClass('gold-star');
            $line_question.find('.btn-star img').attr('src', 'imgs/vvp/svgs/grey-star.svg');

            $(this).find('img').attr('src', 'imgs/vvp/svgs/gold-star.svg');
            $(this).addClass('gold-star');
        });

        //Images
        $('.activation-configuration-elements .upload-images .add-object').live('click', function () {

            var identifier = $(this).closest('.configuration-item').attr('identifier');
            var count = parseInt($(this).closest('.configuration-item').attr('count'));
            var parent = $(this).closest('.upload-images');
            var wrap = parent.find('.images');
            if(count){
                if(wrap.find('.image').length >= parseInt(count)){
                    show_error_message('Count of ' + $('.h-'+identifier).text().toLowerCase() + ' are ' + count + '. You cannot add more ' +$('.h-'+identifier).text().toLowerCase());
                    return;
                }
            }
            moxman.browse({
                url: '',
                view: 'thumbs',
                title: 'Media Manager',
                filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
                fileinfo_fields: 'url',
                extensions:'jpg,jpeg,png,gif',
                oninsert: function(args) {
                    if(args.files[0].url){
                        var img = args.files[0];
                        if(img.canPreview){
                            ll_activation_builder.addImagesItem(wrap, {imgFor: 'new', url: img.url});

                        }
                    }
                }
            });
        });
        $('.activation-configuration-elements .upload-images .add-default-objects').live('click', function () {
            var parent = $(this).closest('.upload-images');
            var wrap = parent.find('.images');
            var identifier = $(this).closest('.configuration-item').attr('identifier');
            var count = parseInt($(this).closest('.configuration-item').attr('count'));
            var ll_activation_identifier_configuration = ll_activation_builder.ll_activation_identifier.ll_activation_identifier_configuration;
            var ll_activation_identifier_alias = ll_activation_builder.ll_activation_identifier.ll_activation_identifier_alias;
            if(identifier in ll_activation_identifier_configuration){
                var configurations = ll_activation_identifier_configuration[identifier];
                for(var i in configurations.values){
                    if(!count || wrap.find('.image').length < count) {
                        ll_activation_builder.addImagesItem(wrap, configurations.values[i]);
                    }
                }

                switch (ll_activation_identifier_alias) {
                    case "WHACK_IT":
                        if(!parent.hasClass('custom-objects')){
                            wrap.find('.image[imgfor="company"]').addClass('hide');
                        }
                        break;
                }
            }
        });

        $('.activation-configuration-elements .upload-images .icn-remove-img').live('click', function () {
            $(this).closest('.image').remove();
        });

        $('.activation-configuration-elements .upload-images .btn-star').live('click', function () {
            var parent = $(this).closest('.upload-images');
            parent.find('.btn-star').removeClass('gold-star').find('img').attr('src', 'imgs/vvp/svgs/grey-star.svg');
            $(this).addClass('gold-star').find('img').attr('src', 'imgs/vvp/svgs/gold-star.svg');
        });

        apply_ll_tooltip('.activation-configuration-elements');
        /*$('.activation-configuration-elements .ll_std_tooltip:not(.tooltipstered)').tooltipster({
            theme: "ll-std-tooltip-theme",
            position: "top-left"
        });*/
    },
    apply_additional_actions: function(ll_identifier){
        if(typeof ll_identifier != 'undefined' && ll_identifier){
            switch (ll_identifier.ll_activation_identifier_alias) {
                case 'WHACK_IT':
                    $('.configuration-item[identifier=level] input[name="radio_level"]').live('click', function () {
                        switch ($(this).val()) {
                            case '1':
                            case '2':
                                $('.configuration-item[identifier=objects] .upload-images').addClass('custom-objects');
                                $('.configuration-item[identifier=objects] .image[imgfor="company"]').removeClass('hide');
                                $('.configuration-item[identifier=helpText],.h-helpText').show();
                                $('.configuration-item[identifier=helpBackgroundColor],.h-helpBackgroundColor').show();
                                $('.configuration-item[identifier=helpMessageTextColor],.h-helpMessageTextColor').show();
                                $('.configuration-item[identifier=failMessage],.h-failMessage').show();
                                $('.configuration-item[identifier=companyLogo],.h-companyLogo').hide().removeClass('required');
                                break;
                            default:
                                $('.configuration-item[identifier=objects] .upload-images').removeClass('custom-objects');
                                $('.configuration-item[identifier=objects] .image[imgfor="company"]').addClass('hide');
                                $('.configuration-item[identifier=helpText],.h-helpText').hide();
                                $('.configuration-item[identifier=helpBackgroundColor],.h-helpBackgroundColor').hide();
                                $('.configuration-item[identifier=helpMessageTextColor],.h-helpMessageTextColor').hide();
                                $('.configuration-item[identifier=failMessage],.h-failMessage').hide();
                                $('.configuration-item[identifier=companyLogo],.h-companyLogo').show().addClass('required');
                                break;
                        }
                    });

                    $('.configuration-item[identifier="showFrontWhole"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=frontWholeColor],.h-frontWholeColor').show();
                        } else {
                            $('.configuration-item[identifier=frontWholeColor],.h-frontWholeColor').hide();
                        }
                    });
                    break;
                case 'THREE_CUPS':
                    ll_combo_manager.event_on_change('.configuration-item[identifier=cup] select', function(){
                        $('.configuration-item[identifier=companyImg],.h-companyImg').hide();
                        $('.configuration-item[identifier=cupImg],.h-cupImg').hide();
                        $('.configuration-item[identifier=cupCompanyName],.h-cupCompanyName').hide();
                        $('.configuration-item[identifier=cupCompanyNameColor],.h-cupCompanyNameColor').hide();
                        switch (ll_combo_manager.get_selected_value($(this))) {
                            case '2':
                            case '3':
                                $('.configuration-item[identifier=companyImg],.h-companyImg').show();
                                $('.configuration-item[identifier=cupImg],.h-cupImg').show();
                                $('.configuration-item[identifier=cupCompanyName],.h-cupCompanyName').show();
                                $('.configuration-item[identifier=cupCompanyNameColor],.h-cupCompanyNameColor').show();
                                break;
                        }
                    });
                    break;
                case 'THREE_CARDS':

                    $('.h-companyImg1,.h-companyImg2,.h-companyImg3,.h-companyImg4,.h-companyImg5').addClass('h-custom-cards');
                    $('.configuration-item[identifier=companyImg1],.configuration-item[identifier=companyImg2],.configuration-item[identifier=companyImg3],.configuration-item[identifier=companyImg4],.configuration-item[identifier=companyImg5]').addClass('custom-cards');

                    $('.h-custom-cards,.custom-cards').hide();

                    ll_combo_manager.event_on_change('.configuration-item[identifier=cards] select', function(){
                        $('.h-custom-cards,.custom-cards').hide();
                        switch (ll_combo_manager.get_selected_value($(this))) {
                            case '1':
                                $('.h-custom-cards:first,.custom-cards:first').show();
                                break;
                            case '2':
                                ll_combo_manager.trigger_event_on_change('.configuration-item[identifier=cardsCount] select');
                                break;
                        }
                    });

                    ll_combo_manager.event_on_change('.configuration-item[identifier=cardsCount] select', function(){
                        $('.h-custom-cards,.custom-cards').hide();
                        var num_of_cards = parseInt(ll_combo_manager.get_selected_value($(this)));
                        for(var i=0 ; i < num_of_cards ; i++){
                            $('.h-custom-cards:eq('+i+'),.custom-cards:eq('+i+')').show();
                        }
                    });

                    break;
                case 'GUESS_HOW_MANY':
                    /*ll_combo_manager.event_on_change('.configuration-item[identifier=game] select', function(){
                        $('.configuration-item[identifier=quests0],.h-quests0').hide();
                        $('.configuration-item[identifier=quests1],.h-quests1').hide();
                        switch (ll_combo_manager.get_selected_value($(this))) {
                            case '0':
                                $('.configuration-item[identifier=quests0],.h-quests0').show();
                                break;
                            case '1':
                                $('.configuration-item[identifier=quests1],.h-quests1').show();
                                break;
                        }
                    });*/
                    $('.configuration-item[identifier="objs"] input[name=check_company]').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=companyImg1],.h-companyImg1').show();
                            $('.configuration-item[identifier=companyImg2],.h-companyImg2').show();
                        } else {
                            $('.configuration-item[identifier=companyImg1],.h-companyImg1').hide();
                            $('.configuration-item[identifier=companyImg2],.h-companyImg2').hide();
                        }
                    });
                    break;
                case 'TRIVIA':
                    ll_combo_manager.event_on_change('.configuration-item[identifier=game] select', function(){
                        $('.activation-configuration-elements').removeClass('trivia_basic trivia_countdown trivia_countdown_with_strikes trivia_drill');
                        $('.activation-configuration-elements').removeClass('fixed per_question survey');

                        $('.configuration-item[identifier="add_bonus"]').removeAttr('style');
                        $('.configuration-item[identifier="bonus"]').removeAttr('style');
                        $('.configuration-item[identifier="score_threshold_quests"]').removeAttr('style');

                        $('.configuration-item[identifier="add_right"]').removeAttr('style');
                        $('.configuration-item[identifier="right"]').removeAttr('style');
                        $('.configuration-item[identifier="right_threshold_quests"]').removeAttr('style');

                        var question_time = typeof ll_activation_builder.activation_configuration['question_time'] != 'undefined' ? parseInt(ll_activation_builder.activation_configuration['question_time']) : 0;
                        var game_play_time = typeof ll_activation_builder.activation_configuration['game_play_time'] != 'undefined' ? parseInt(ll_activation_builder.activation_configuration['game_play_time']) : 0;
                        var strikes = typeof ll_activation_builder.activation_configuration['strikes'] != 'undefined' ? parseInt(ll_activation_builder.activation_configuration['strikes']) : 0;
                        if(!question_time){
                            $('.configuration-item[identifier="question_time"] input').val(0);
                        }
                        if(!game_play_time){
                            $('.configuration-item[identifier="game_play_time"] input').val(0);
                        }
                        if(!strikes){
                            $('.configuration-item[identifier="strikes"] input').val(0);
                        }

                        $('.configuration-item[identifier="question_time"],.configuration-item[identifier="game_play_time"]').removeClass('required');
                        $('.configuration-item[identifier="strikes"]').removeClass('required');

                        switch (ll_combo_manager.get_selected_value($(this))) {
                            case '0':
                                $('.activation-configuration-elements').addClass('trivia_basic');
                                $('.trivia_basic').addClass($('.configuration-item[identifier=score_type] [name="radio_score_type"]:checked').val());
                                break;
                            case '1':
                                $('.activation-configuration-elements').addClass('trivia_countdown');
                                $('.configuration-item[identifier="question_time"]').addClass('required');
                                if(!question_time){
                                    $('.configuration-item[identifier="question_time"] input').val(10);
                                }
                                break;
                            case '2':
                                $('.activation-configuration-elements').addClass('trivia_countdown_with_strikes');
                                $('.configuration-item[identifier="strikes"]').addClass('required');
                                $('.configuration-item[identifier="question_time"]').addClass('required');

                                if(!question_time){
                                    $('.configuration-item[identifier="question_time"] input').val(10);
                                }
                                if(!strikes){
                                    $('.configuration-item[identifier="strikes"] input').val(3);
                                }
                                break;
                            case '3':
                                $('.activation-configuration-elements').addClass('trivia_drill');
                                $('.configuration-item[identifier="game_play_time"]').addClass('required');
                                if(!game_play_time){
                                    $('.configuration-item[identifier="game_play_time"] input').val(120);
                                }
                                break;
                        }

                        if($('.configuration-item[identifier="add_bonus"]').is(':visible')) {
                            if ($('.configuration-item[identifier="add_bonus"] input').is(':checked')) {
                                $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').show();
                            } else {
                                $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').hide();
                            }
                        }
                        if($('.configuration-item[identifier="add_right"]').is(':visible')) {
                            if ($('.configuration-item[identifier="add_right"] input').is(':checked')) {
                                $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').show();
                            } else {
                                $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').hide();
                            }
                        }

                    });

                    $('.configuration-item[identifier=score_type] input[name="radio_score_type"]').live('click', function () {
                        $('.trivia_basic').removeClass('fixed per_question survey');
                        if(ll_combo_manager.get_selected_value($('.configuration-item[identifier=game] select')) == 0) {
                            $('.trivia_basic').addClass($(this).val());
                            switch ($(this).val()) {
                                case 'survey':
                                    $('.configuration-item[identifier=add_bonus],.configuration-item[identifier=bonus]').hide();
                                    $('.configuration-item[identifier=add_right],.configuration-item[identifier=right]').hide();
                                    $('.configuration-item[identifier=score_threshold_quests],.configuration-item[identifier=right_threshold_quests]').hide();
                                    break;
                                default:
                                    $('.configuration-item[identifier=add_bonus],.configuration-item[identifier=add_right]').show();
                                    $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').hide();
                                    if($('.configuration-item[identifier="add_bonus"] input').is(':checked')){
                                        $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').show();
                                    }
                                    $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').hide();
                                    if($('.configuration-item[identifier="add_right"]').is(':visible') && $('.configuration-item[identifier="add_right"] input').is(':checked')){
                                        $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').show();
                                    }
                                    break;
                            }
                        }

                        /*if(){

                        }*/
                    });

                    $('.configuration-item[identifier="add_bonus"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').show();
                        } else {
                            $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').hide();
                        }
                    });

                    $('.configuration-item[identifier="add_right"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').show();
                        } else {
                            $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').hide();
                        }
                    });

                    break;
                case 'LUCKY_DIGITS':
                    $('.configuration-item[identifier="crackNumberLength"] input').live('click', function () {
                        $('.configuration-item[identifier=crackNumber] input').attr('length', $(this).val()).trigger('keypress');
                    });
                    $('.configuration-item[identifier="donePromptWithNoSafe"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=doneMessage],.h-doneMessage').show();
                            $('.configuration-item[identifier=doneButtonText],.h-doneButtonText').show();
                        } else {
                            $('.configuration-item[identifier=doneMessage],.h-doneMessage').hide();
                            $('.configuration-item[identifier=doneButtonText],.h-doneButtonText').hide();
                        }
                    });
                    break;
                case 'CRACK_THE_VAULT':
                    $('.configuration-item[identifier="crackNumberLength"] input').live('click', function () {
                        $('.configuration-item[identifier=crackNumber] input').attr('length', $(this).val()).trigger('keypress');
                    });
                    $('.configuration-item[identifier="showScratch"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=crackNumber],.h-crackNumber').hide();
                            $('.configuration-item[identifier=crackNumberLength],.h-crackNumberLength').hide();
                            $('.configuration-item[identifier=matchingFrequency],.h-matchingFrequency').show();
                            $('.configuration-item[identifier=rounds],.h-rounds').hide();
                        } else {
                            $('.configuration-item[identifier=crackNumber],.h-crackNumber').show();
                            $('.configuration-item[identifier=crackNumberLength],.h-crackNumberLength').show();
                            $('.configuration-item[identifier=matchingFrequency],.h-matchingFrequency').hide();
                            $('.configuration-item[identifier=rounds],.h-rounds').show();
                        }
                    });
                    break;
                case 'MEMORY_MATCH':
                    $('.configuration-item[identifier="startFaceUp"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=startFaceUpDuration],.h-startFaceUpDuration').show();
                        } else {
                            $('.configuration-item[identifier=startFaceUpDuration],.h-startFaceUpDuration').hide();
                        }
                    });
                    break;
                case 'RACING':
                    $('.configuration-item[identifier="disableUserName"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=userNameTextLabel]').hide().removeClass('required');
                            $('.h-userNameTextLabel').hide();
                        } else {
                            $('.configuration-item[identifier=userNameTextLabel]').show().addClass('required');
                            $('.h-userNameTextLabel').show();
                        }
                    });
                    $('.configuration-item[identifier="playerLabels"] input').live('click', function () {
                        if($(this).is(':checked')){
                            $('.configuration-item[identifier=playerLabelColor]').show().removeClass('required');
                            $('.h-playerLabelColor').show();
                        } else {
                            $('.configuration-item[identifier=playerLabelColor]').hide().addClass('required');
                            $('.h-playerLabelColor').hide();
                        }
                    });
                    break;
            }

            if($('.configuration-item[identifier=chkLogoBgColor]').length){
                $('.configuration-item[identifier="chkLogoBgColor"] input').live('click', function () {
                    if($(this).is(':checked')){
                        $('.configuration-item[identifier=logoBgColor],.h-logoBgColor').show();
                        $('.configuration-item[identifier=logoBorderRadius],.h-logoBorderRadius').show();
                    } else {
                        $('.configuration-item[identifier=logoBgColor],.h-logoBgColor').hide();
                        $('.configuration-item[identifier=logoBorderRadius],.h-logoBorderRadius').hide();
                    }
                });
            }
            if($('.configuration-item[identifier=chkLogoOutlineColor]').length){
                $('.configuration-item[identifier="chkLogoOutlineColor"] input').live('click', function () {
                    if($(this).is(':checked')){
                        $('.configuration-item[identifier=logoOutlineColor],.h-logoOutlineColor').show();
                        $('.configuration-item[identifier=logoBorderThickness],.h-logoBorderThickness').show();
                    } else {
                        $('.configuration-item[identifier=logoOutlineColor],.h-logoOutlineColor').hide();
                        $('.configuration-item[identifier=logoBorderThickness],.h-logoBorderThickness').hide();
                    }
                });
            }

            if($('.configuration-item[identifier=probabilityCalculationMode]').length){
                $('.configuration-item[identifier="probabilityCalculationMode"] input').live('click', function () {
                    ll_activation_builder.apply_prizes_changes($('.prizes-inventory-box'));
                    $('.prizes-inventory-box').removeClass('automatic manual');
                    switch (parseInt($(this).val())) {
                        case CUSTOM_PROBABILITY_AUTOMATIC:
                            $('.prizes-inventory-box').addClass('automatic');
                            break;
                        case CUSTOM_PROBABILITY_MANUAL:
                            $('.prizes-inventory-box').addClass('manual');
                            break;
                    }
                });
            }
        }
    },
    add_additional_elements: function(ll_identifier){

        if ($('.configuration-item[type="prizes_and_inventory"]').length) {
            var $prizes_item = $('.configuration-item[type="prizes_and_inventory"]');
            // --- Shared Prizes
            if (parseInt(SHARED_PRIZES_PERMISSION)) {
                var _html = '';
                _html += '<div class="h3">Shared Prizes <a href="javascript:void(0)" class=" ll-link ll_std_tooltip add_new_shared_prize" title="Add New Shared Prize" ><img src="imgs/svgs/icn-add-grey.svg"></a></div>';
                _html += '<div class="shared_prizes">';
                _html += '</div>';
                $prizes_item.append(_html);

                ll_activation_builder.addNewInventory($prizes_item.find('.shared_prizes'), null, 1);
                apply_ll_tooltip($prizes_item);

                $prizes_item.find('.add_new_shared_prize').click(function () {
                    ll_shared_prizes_manager.open(0, 'add', function (ll_shared_prize) {
                        if (typeof ll_shared_prize != 'undefined' && ll_shared_prize) {
                            ll_combo_manager.add_option($prizes_item.find('.select_shared_prizes'), ll_shared_prize.ll_shared_prize_id, ll_shared_prize.ll_shared_prize_name);
                            ll_activation_builder.ll_shared_prizes[ll_shared_prize.ll_shared_prize_id] = ll_shared_prize;
                        }
                    });
                });
            }
            // --- Prizes Chart
            var _html = '';
            _html += '<div class="h3">Prize Chart</div>';
            _html += '<div class="prizes_chart_div">';
            _html += '  <div class="prizes_chart">';
            _html += '  </div>';
            _html += '</div>';
            $prizes_item.append(_html);

            chart.chartPie($prizes_item.find('.prizes_chart'), null, function(data){

            });
            ll_activation_builder.apply_prizes_changes($prizes_item);

        }

        if ($('.configuration-item[identifier="borderSlices"]').length) {
            $('.configuration-item[identifier="borderSlices"]').append("<a class='ll-link' target='_blank' href='https://leadliaison.atlassian.net/wiki/spaces/LL/pages/326565889/Activations#Borders'>Click for more help</a>");
        }
    },
    change_field_prize: function($this){

        var $box = $this.closest('.prizes-inventory-box');
        var $wrap = $this.closest('.line-inventory');
        var quantity = $this.val() ? parseInt($this.val()) : 0;
        var consumed = parseInt($this.attr('consumed'));
        var prize_id = typeof $wrap.attr('prize_id') != 'undefined' ? $wrap.attr('prize_id') : 0;
        var is_shared = $($wrap).find('.select_shared_prizes').length ? 1 : 0;
        var ll_shared_prize_id = is_shared ? ll_combo_manager.get_selected_value($($wrap).find('.select_shared_prizes')) : 0;

        var isValid = true;
        if(quantity < consumed){
            window.setTimeout(function (){
                quantity = $this.val() ? parseInt($this.val()) : 0;
                if(quantity < consumed) {
                    show_warning_message('Quantity should be more than or equal ' + consumed);
                    $this.val(consumed);
                    ll_activation_builder.apply_prize_changes(quantity, consumed);
                    ll_activation_builder.apply_prizes_changes($box);
                }
            }, 1000);
            isValid = false;
        }
        if(parseInt(ll_shared_prize_id) && ll_shared_prize_id in ll_activation_builder.ll_shared_prizes){
            var ll_shared_prize = ll_activation_builder.ll_shared_prizes[ll_shared_prize_id];
            var remaining = parseInt(ll_shared_prize.ll_shared_prize_quantity) ? (parseInt(ll_shared_prize.ll_shared_prize_quantity) - parseInt(ll_shared_prize.consumed_quantity)) : 0;
            if(!prize_id && quantity > remaining){
                show_warning_message('Quantity should be less than or equal ' + remaining);
                $this.val(remaining);
                ll_activation_builder.apply_prize_changes(quantity, consumed);
                ll_activation_builder.apply_prizes_changes($box);
                isValid = false;
            }
        }
        if(isValid){
            ll_activation_builder.apply_prize_changes($wrap, quantity, consumed);
        }
    },
    apply_prize_changes: function($wrap, quantity, consumed){

        var perc = parseInt(quantity) ? parseInt(((quantity - consumed) / quantity) * 100) : 0;
        $($wrap).find('.ll-progress-line').css('width', perc + '%');
        $($wrap).find('.ll-progress-item.remaining').text('Remaining: ' + (quantity - consumed));
        $($wrap).find('.ll-progress-item.used').text('Used: ' + consumed);
        $($wrap).find('.ll-progress-perc').text(perc + '%');
        $($wrap).find('.ll-progress-line').removeClass('ll-light-green ll-red ll-orange');
        if(perc > 70){
        } else if (perc >= 35){
            $($wrap).find('.ll-progress-line').addClass('ll-light-green');
        } else {
            $($wrap).find('.ll-progress-line').addClass('ll-red');
        }
    },
    apply_prizes_changes: function($box){
        var total_quantity = 0;
        var chart_data = [] ;
        var probabilityCalculationMode = parseInt($('.configuration-item[identifier="probabilityCalculationMode"] input:checked').val());
        var quantity_container = probabilityCalculationMode == CUSTOM_PROBABILITY_MANUAL ? '.custom_probability' : '.field-prize' ;
        $($box).find(quantity_container).each(function(){
            if(parseInt($(this).val())) {
                //total_quantity += parseInt($(this).val());
                total_quantity += probabilityCalculationMode == CUSTOM_PROBABILITY_MANUAL ? parseInt($(this).val()) : (parseInt($(this).val()) - parseInt($(this).attr('consumed'))) ;
            }
        });
        $($box).find(".line-inventory").each(function(){
            var is_shared = $(this).find('.select_shared_prizes').length ? 1 : 0;
            var name = is_shared ? ll_combo_manager.get_selected_text($(this).find('.select_shared_prizes')) : $.trim($(this).find('input.field-inventory').val()) ;
            var ll_shared_prize_id = is_shared ? ll_combo_manager.get_selected_value($(this).find('.select_shared_prizes')) : 0;
            if((is_shared && ll_shared_prize_id )|| !is_shared && name){

                var quantity = $(this).find(quantity_container).val() ? parseInt($(this).find(quantity_container).val()) : 0;
                var consumed = probabilityCalculationMode == CUSTOM_PROBABILITY_AUTOMATIC ? parseInt($(this).find(".field-prize").attr('consumed')) : 0;
                var remaining = parseInt(quantity - consumed);

                var available_quantity = parseInt($(this).find('.field-prize').val());
                var consumed_quantity = parseInt($(this).find(".field-prize").attr('consumed'));
                var remaining_quantity = parseInt(available_quantity - consumed_quantity);

                $prob = 0;
                if(total_quantity && quantity) {
                    $prob = (parseFloat(remaining)  / total_quantity) * 100;
                    if(!Number.isInteger($prob)) {
                        /*if($prob.toFixed(5).split('.')[1] != '00000'){
                            console.log('if');
                            $prob = Math.round(($prob + Number.EPSILON) * 100) / 100;
                        } else {
                            $prob = ($prob.toFixed(12).match(/^-?\d*\.?0*\d{0,1}/)[0]).toString();
                            $prob = $prob < 100 ? ((($prob.length - 1) - $prob.indexOf('.')) < 12 ? $prob : 0) : $prob;
                        }*/
                        $prob = ($prob.toFixed(12).match(/^-?\d*\.?0*\d{0,2}/)[0]).toString();
                        $prob = $prob < 100 ? ((($prob.length - 1) - $prob.indexOf('.')) < 12 ? $prob : 0) : $prob;
                    }
                }

                var perc = parseInt(available_quantity) ? parseInt(((available_quantity - consumed_quantity) / available_quantity) * 100) : 0;

                $(this).find('.winner-info').text('('+$prob + '% chance)');

                var txt = perc+"% "+name;
                chart_data.push({
                    identifier: name,
                    name: txt,
                    title: name,
                    txt: txt,
                    y: remaining_quantity
                });
            }
        });

        if($box.find('.prizes_chart').length) {
            chart.addSeriesToPieChart(chart_data, $box.find('.prizes_chart'), 'Prizes');
        }
    },

    after_append_configuration:function(ll_identifier){

        switch (ll_identifier.ll_activation_identifier_alias) {
            case 'WHACK_IT':
                $('.configuration-item[identifier=level] input[name="radio_level"]:checked').click();
                if($('.configuration-item[identifier="showFrontWhole"] input').is(':checked')){
                    $('.configuration-item[identifier=frontWholeColor],.h-frontWholeColor').show();
                } else {
                    $('.configuration-item[identifier=frontWholeColor],.h-frontWholeColor').hide();
                }
                break;
            case 'THREE_CUPS':
                ll_combo_manager.trigger_event_on_change('.configuration-item[identifier=cup] select');
                break;
            case 'THREE_CARDS':
                ll_combo_manager.trigger_event_on_change('.configuration-item[identifier=cards] select');
                break;
            case 'GUESS_HOW_MANY':
                //ll_combo_manager.trigger_event_on_change('.configuration-item[identifier=game] select');
                if($('.configuration-item[identifier="objs"] input[name=check_company]').is(':checked')){
                    $('.configuration-item[identifier=companyImg1],.h-companyImg1').show();
                    $('.configuration-item[identifier=companyImg2],.h-companyImg2').show();
                } else {
                    $('.configuration-item[identifier=companyImg1],.h-companyImg1').hide();
                    $('.configuration-item[identifier=companyImg2],.h-companyImg2').hide();
                }

                break;
            case 'TRIVIA':

                $('[identifier="fixed_score"] input').addClass('ll_std_tooltip').attr('title','All correct answers will have the same score.');
                apply_ll_tooltip('[identifier="fixed_score"]');
                $('[identifier="fixed_score"] input').removeAttr('title');

                $('[identifier="bonus"] input').attr('placeholder','Bonus');
                $('[identifier="score_threshold_quests"] input').attr('placeholder','Threshold');

                $('[identifier="right"] input').attr('placeholder','Bonus');
                $('[identifier="right_threshold_quests"] input').attr('placeholder','Threshold');

                ll_combo_manager.trigger_event_on_change('.configuration-item[identifier=game] select');

                if($('.configuration-item[identifier="add_bonus"]').is(':visible')) {
                    if ($('.configuration-item[identifier="add_bonus"] input').is(':checked')) {
                        $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').show();
                    } else {
                        $('.configuration-item[identifier=bonus],.configuration-item[identifier=score_threshold_quests]').hide();
                    }
                }
                if($('.configuration-item[identifier="add_right"]').is(':visible')) {
                    if ($('.configuration-item[identifier="add_right"] input').is(':checked')) {
                        $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').show();
                    } else {
                        $('.configuration-item[identifier=right],.configuration-item[identifier=right_threshold_quests]').hide();
                    }
                }
                break;
            case 'LUCKY_DIGITS':
                if($('.configuration-item[identifier=donePromptWithNoSafe] input').is(':checked')){
                    $('.configuration-item[identifier=doneMessage],.h-doneMessage').show();
                    $('.configuration-item[identifier=doneButtonText],.h-doneButtonText').show();
                } else {
                    $('.configuration-item[identifier=doneMessage],.h-doneMessage').hide();
                    $('.configuration-item[identifier=doneButtonText],.h-doneButtonText').hide();
                }
                $('.configuration-item[identifier="crackNumberLength"] input:checked').click();
                break;
            case 'CRACK_THE_VAULT':
                $('.configuration-item[identifier="crackNumberLength"] input:checked').click();
                if($('.configuration-item[identifier="showScratch"] input').is(':checked')){
                    $('.configuration-item[identifier=crackNumber],.h-crackNumber').hide();
                    $('.configuration-item[identifier=crackNumberLength],.h-crackNumberLength').hide();
                    $('.configuration-item[identifier=matchingFrequency],.h-matchingFrequency').show();
                    $('.configuration-item[identifier=rounds],.h-rounds').hide();
                } else {
                    $('.configuration-item[identifier=crackNumber],.h-crackNumber').show();
                    $('.configuration-item[identifier=crackNumberLength],.h-crackNumberLength').show();
                    $('.configuration-item[identifier=matchingFrequency],.h-matchingFrequency').hide();
                    $('.configuration-item[identifier=rounds],.h-rounds').show();
                }
                break;
            case 'MEMORY_MATCH':
                if($('.configuration-item[identifier="startFaceUp"] input').is(':checked')){
                    $('.configuration-item[identifier=startFaceUpDuration],.h-startFaceUpDuration').show();
                } else {
                    $('.configuration-item[identifier=startFaceUpDuration],.h-startFaceUpDuration').hide();
                }
                break;
            case 'RACING':
                if($('.configuration-item[identifier="disableUserName"] input').is(':checked')){
                    $('.configuration-item[identifier=userNameTextLabel]').hide().removeClass('required');
                    $('.h-userNameTextLabel').hide();
                } else {
                    $('.configuration-item[identifier=userNameTextLabel]').show().addClass('required');
                    $('.h-userNameTextLabel').show();
                }
                if($('.configuration-item[identifier="playerLabels"] input').is(':checked')){
                    $('.configuration-item[identifier=playerLabelColor]').show().removeClass('required');
                    $('.h-playerLabelColor').show();
                } else {
                    $('.configuration-item[identifier=playerLabelColor]').hide().addClass('required');
                    $('.h-playerLabelColor').hide();
                }
                break;
        }

        if($('.configuration-item[identifier=chkLogoBgColor]').length){
            $('.configuration-item[identifier="chkLogoBgColor"] input').change();
        }
        if($('.configuration-item[identifier=chkLogoOutlineColor]').length){
            $('.configuration-item[identifier="chkLogoOutlineColor"] input').change();
        }
        if($('.configuration-item[identifier=chkLogoBgColor]').length){
            if($('.configuration-item[identifier="chkLogoBgColor"] input').is(':checked')){
                $('.configuration-item[identifier=logoBgColor],.h-logoBgColor').show();
                $('.configuration-item[identifier=logoBorderRadius],.h-logoBorderRadius').show();
            } else {
                $('.configuration-item[identifier=logoBgColor],.h-logoBgColor').hide();
                $('.configuration-item[identifier=logoBorderRadius],.h-logoBorderRadius').hide();
            }
        }
        if($('.configuration-item[identifier=chkLogoOutlineColor]').length){
            if($('.configuration-item[identifier="chkLogoOutlineColor"] input').is(':checked')){
                $('.configuration-item[identifier=logoOutlineColor],.h-logoOutlineColor').show();
                $('.configuration-item[identifier=logoBorderThickness],.h-logoBorderThickness').show();
            } else {
                $('.configuration-item[identifier=logoOutlineColor],.h-logoOutlineColor').hide();
                $('.configuration-item[identifier=logoBorderThickness],.h-logoBorderThickness').hide();
            }
        }

        if($('.configuration-item[identifier=probabilityCalculationMode]').length){
            if(!$('.h-prizes-header').length) {
                $('<div class="h1 h-prizes-header prizes-elements">Prizes</div>').insertBefore('.h-probabilityCalculationMode');
            }
            $('.configuration-item[identifier="probabilityCalculationMode"] input:checked').click();
        }

        if($('.activation_mode_element').is(':visible')){
            $('input[name=activation_mode]:checked').click();
        }
    },
    updateHTMLBlock: function(selector) {
        var html = tinymce.get(selector).getContent();
        switch (selector) {
            case 'capture_screen_html_editor':
                var $wrapHTML = $(".custom-html");
                $.trim(html).length > 72
                    ? $wrapHTML.removeClass("no-html")
                    : $wrapHTML.addClass("no-html");

                $(".custom-html__content").html(html);
                break;
            case 'leaderboard_html_editor':

                var helpHTML = '<div class="leadboard__help-column">HTML</div>';
                var $wrapHTML = $(".leadboard__html");
                $.trim(html) && html.length > 61
                    ? $wrapHTML.html(html)
                    : $wrapHTML.html(helpHTML);
                break;
        }
    },
    closePanelRight: function() {
        $(".right-panel-slide.active")
            .removeClass("active")
            .hide()
            .animate({ right: "-600px" }, 300);
    },

    addNewInventory: function($wrap, data, is_shared) {
        is_shared = typeof is_shared == 'undefined' ? 0 : parseInt(is_shared);
        var identifier = $($wrap).closest('.configuration-item').attr('identifier');
        var idx = $($wrap).find('.line-inventory').length + 1;

        var $box = $($wrap).closest('.prizes-inventory-box');

        if(typeof identifier != 'undefined' && $.trim(identifier) && $.trim(identifier) in ll_activation_builder.activation_configuration) {
            var configuration = ll_activation_builder.activation_configuration[$.trim(identifier)];
            var html = '';
            var cls = is_shared ? 'shared' : '';
            html +='<div class="line-inventory '+cls+' ">' ;
            html +=' <div class="line">';
            html +='   <div class="add-line-inventory"></div>' ;
            html +='   <div class="remove-line-inventory"></div>' ;
            html +='   <div class="actions-line-inventory event-elements"></div>' ;
            // html +='   <div class="notifications-line-inventory event-elements ll_std_tooltip" title="Notifications"><a href="javascript:void(0);"><svg width="18px" height="22px" viewBox="0 0 18 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-597.000000, -666.000000)" fill-rule="nonzero" class="svg-fill" fill="#939393"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><g id="if_lamp_622407" transform="translate(37.849315, 0.000000)"><path d="M14.3417046,2.33753247 C12.7542029,0.830155844 10.6428264,0 8.39640911,0 C3.76054041,0 0,3.57980519 0,7.98003896 C0,10.8481818 1.5593603,13.4351818 4.14629477,14.854961 L4.14629477,19.6741429 C4.14629477,20.9505844 5.20254422,21.9881818 6.52793067,21.9881818 L10.2811757,21.9881818 C11.5985549,21.9881818 12.6872848,20.9505844 12.6872848,19.6741429 L12.6872848,14.8508442 C15.2605318,13.4306494 16.8112553,10.8451558 16.8112553,7.98003896 C16.8112553,5.84837662 15.9287547,3.84450649 14.3417046,2.33753247 Z M10.2811757,20.2609091 L6.52793067,20.2609091 C6.20545355,20.2609091 5.95304266,19.9987532 5.95304266,19.6741429 L5.95304266,18.2868831 L10.8805369,18.2868831 L10.8805369,19.6741429 C10.8805369,19.9987532 10.5958372,20.2609091 10.2811757,20.2609091 Z M11.3726977,13.5712208 C11.0654274,13.7162338 10.8805369,14.0138701 10.8805369,14.3394935 L10.8805369,16.5725844 L9.34753868,16.5725844 L9.34753868,11.0790779 L11.5399177,11.0790779 C12.039374,11.0790779 12.4442635,10.6958312 12.4442635,10.2219351 C12.4442635,9.74803896 12.039374,9.36479221 11.5399177,9.36479221 L5.29995805,9.36479221 C4.80050176,9.36479221 4.39562598,9.74803896 4.39562598,10.2219351 C4.39562598,10.6958312 4.80050176,11.0790779 5.29995805,11.0790779 L7.52710331,11.0790779 L7.52710331,16.5725844 L5.95304266,16.5725844 L5.95304266,14.3433506 C5.95304266,14.0175065 5.74857902,13.7198312 5.44102126,13.5748571 C3.19994213,12.5185455 1.8026827,10.3747403 1.8026827,7.98003896 C1.8026827,4.52609091 4.76038374,1.7161039 8.39894129,1.7161039 C12.0368966,1.7161039 15.0000453,4.52609091 15.0000453,7.98003896 C15.0000589,10.3718961 13.6122849,12.5143247 11.3726977,13.5712208 Z" id="remind"></path></g></g></g></g></g></svg>/a></div>' ;
            if(is_shared){
                html += '	<select class="txt-field field-inventory select_shared_prizes" data-placeholder="--- Select Prize ---">';
                html +='        <option value="">--- Select Prize ---</option>' ;
                if(typeof ll_activation_builder.ll_shared_prizes != 'undefined' && Object.keys(ll_activation_builder.ll_shared_prizes).length){
                    for(var i in ll_activation_builder.ll_shared_prizes){
                        html +='        <option value="'+ll_activation_builder.ll_shared_prizes[i].ll_shared_prize_id+'">'+ll_activation_builder.ll_shared_prizes[i].ll_shared_prize_name+'</option>' ;
                    }
                }
                html +=' 	</select>';
            } else {
                html += '   <input type="text" class="txt-field field-inventory"> ';
            }
            html +='   <input type="number" class="txt-field txt-small field-prize ll_std_tooltip" value="0" consumed="0" placeholder="Quantity" title="Quantity">' ;
            html +='   <input type="number" class="txt-field txt-small custom_probability ll_std_tooltip" value="0" placeholder="Custom Probability" title="Custom Probability" max="1000000000">' ;
            html +='   <input type="number" class="txt-field txt-tiny bonus_spins ll_std_tooltip" value="0" placeholder="Bonus Spins" title="Bonus Spins">' ;
            html +='    <div class="ll-progress-bar">' ;
            html +='        <div class="ll-progress">' ;
            html +='            <div class="ll-progress-inner">' ;
            html +='                <div class="ll-progress-line ll-red" style="width: 0%"></div>' ;
            html +='                <div class="ll-progress-items">';
            html +='                    <div class="ll-progress-item used"></div>';
            html +='                    <div class="ll-progress-item remaining"></div>';
            html +='                </div>';
            html +='            </div>' ;
            html +='        </div>' ;
            html +='        <div class="ll-progress-perc ll_std_tooltip" title="Remaining inventory percentage">0%</div>' ;
            html +='    </div>' ;
            html +=' </div>';
            html +=' <div class="line">';
            html +='   <span class="browse-icn">' ;
            html +='      <span class="icn-prev"></span>' ;
            html +='      <input type="hidden" class="icn-url">' ;
            html +='      <a href="javascript:void(0);" class="t-btn-gray ll_std_tooltip" title="Recommended image dimensions: 222 pixels (width) x 223 pixels (height).">Upload</a>' ;
            html +='   </span>' ;
            html +='  <a href="javascript:void(0);" class="btn-star ll_std_tooltip" title ="A yellow star triggers a firework celebration."><img src="imgs/vvp/svgs/grey-star.svg"></a>' ;
            html +='  <a href="javascript:void(0);" class="notifications-line-inventory ll_std_tooltip" title ="Notifications"><svg width="18px" height="22px" viewBox="0 0 18 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-597.000000, -666.000000)" fill-rule="nonzero" class="svg-fill" fill="#939393"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><g id="if_lamp_622407" transform="translate(37.849315, 0.000000)"><path d="M14.3417046,2.33753247 C12.7542029,0.830155844 10.6428264,0 8.39640911,0 C3.76054041,0 0,3.57980519 0,7.98003896 C0,10.8481818 1.5593603,13.4351818 4.14629477,14.854961 L4.14629477,19.6741429 C4.14629477,20.9505844 5.20254422,21.9881818 6.52793067,21.9881818 L10.2811757,21.9881818 C11.5985549,21.9881818 12.6872848,20.9505844 12.6872848,19.6741429 L12.6872848,14.8508442 C15.2605318,13.4306494 16.8112553,10.8451558 16.8112553,7.98003896 C16.8112553,5.84837662 15.9287547,3.84450649 14.3417046,2.33753247 Z M10.2811757,20.2609091 L6.52793067,20.2609091 C6.20545355,20.2609091 5.95304266,19.9987532 5.95304266,19.6741429 L5.95304266,18.2868831 L10.8805369,18.2868831 L10.8805369,19.6741429 C10.8805369,19.9987532 10.5958372,20.2609091 10.2811757,20.2609091 Z M11.3726977,13.5712208 C11.0654274,13.7162338 10.8805369,14.0138701 10.8805369,14.3394935 L10.8805369,16.5725844 L9.34753868,16.5725844 L9.34753868,11.0790779 L11.5399177,11.0790779 C12.039374,11.0790779 12.4442635,10.6958312 12.4442635,10.2219351 C12.4442635,9.74803896 12.039374,9.36479221 11.5399177,9.36479221 L5.29995805,9.36479221 C4.80050176,9.36479221 4.39562598,9.74803896 4.39562598,10.2219351 C4.39562598,10.6958312 4.80050176,11.0790779 5.29995805,11.0790779 L7.52710331,11.0790779 L7.52710331,16.5725844 L5.95304266,16.5725844 L5.95304266,14.3433506 C5.95304266,14.0175065 5.74857902,13.7198312 5.44102126,13.5748571 C3.19994213,12.5185455 1.8026827,10.3747403 1.8026827,7.98003896 C1.8026827,4.52609091 4.76038374,1.7161039 8.39894129,1.7161039 C12.0368966,1.7161039 15.0000453,4.52609091 15.0000453,7.98003896 C15.0000589,10.3718961 13.6122849,12.5143247 11.3726977,13.5712208 Z" id="remind"></path></g></g></g></g></g></svg></a>' ;
            html +='  <div class="ll-switch switch-small inline ll_std_tooltip" title="When a prize is set as a Winner it will have a pick-up option on the Submissions page, a special effect will be played when the prize hits, and Actions (Winner) Fulfillment Action will be triggered. When a prize is not marked as a Winner the Actions (Not a Winner) Fulfillment Action will trigger.">';
            html +='      <div class="switch">';
            html +='          <input id="chk_'+identifier+'_'+idx+'_'+is_shared+'" name="chk_'+identifier+'_'+idx+'_'+is_shared+'" class="cmn-toggle cmn-toggle-round is_winning" type="checkbox" checked>';
            html +='          <label for="chk_'+identifier+'_'+idx+'_'+is_shared+'"></label>';
            html +='      </div>';
            html +='      <div class="ll-switch-lb">';
            html +='      Winner';
            html +='      </div>';
            html +='  </div>';
            html +=' <div class="winner-info ll_std_tooltip" title="Winning Probability"></div>';
            html +=' </div>';
            html +='</div>';

            $wrap.append(html);
            if(typeof configuration.withBonusSpins != 'undefined' && parseInt(configuration.withBonusSpins)){
                $($wrap).find('.bonus_spins_lbl,.bonus_spins').show();
            } else {
                $($wrap).find('.bonus_spins_lbl,.bonus_spins').hide();
            }
            $($wrap).find('.actions-line-inventory:last').html("<a class='btn-inventory-fullfilment-actions' href='javascript:void(0)' ll_asset_id='0' ll_asset_type='" + LL_COMPLETION_ACTIONS_ASSET_TYPE_ACTIVATION_PRIZE + "' ll_activity_type='" + LL_COMPLETION_ACTIONS_ACTIVITY_TYPE_SPECIFIC_PRIZE_WON + "'></a>");

            if(is_shared && $($wrap).find('.line-inventory:last .select_shared_prizes').length){
                ll_combo_manager.make_combo($($wrap).find('.select_shared_prizes:last'));
                ll_combo_manager.event_on_change($($wrap).find('.select_shared_prizes:last'), function(){
                    var warp_line = $(this).closest('.line-inventory');
                    var ll_shared_prize_id = ll_combo_manager.get_selected_value($(this));
                    $(warp_line).find('input.field-prize').val(0).attr('consumed', 0);
                    $(warp_line).find('.browse-icn').find('.icn-url').val('');
                    $(warp_line).find('.browse-icn').find('.icn-prev').html('');
                    $(warp_line).find('.browse-icn').find('.icn-prev').html('');
                    if(parseInt(ll_shared_prize_id) && ll_shared_prize_id in ll_activation_builder.ll_shared_prizes){
                        var ll_shared_prize = ll_activation_builder.ll_shared_prizes[ll_shared_prize_id];
                        var remaining = parseInt(ll_shared_prize.ll_shared_prize_quantity) ? (parseInt(ll_shared_prize.ll_shared_prize_quantity) - parseInt(ll_shared_prize.consumed_quantity)) : 0;
                        $(warp_line).find('input.field-prize').val(remaining).attr('consumed', 0).attr('max', remaining);
                        ll_activation_builder.apply_prizes_changes($box);
                        if($.trim(ll_shared_prize.ll_shared_prize_icon)) {
                            $(warp_line).find('.browse-icn').find('.icn-url').val(ll_shared_prize.ll_shared_prize_icon);
                            $(warp_line).find('.browse-icn').find('.icn-prev').html('<img src="' + ll_shared_prize.ll_shared_prize_icon + '"/>');
                        }
                    }
                    remaining = typeof remaining == 'undefined' ? 0 : remaining;
                    ll_activation_builder.apply_prize_changes(warp_line, remaining, 0);
                });
            }
            if (typeof data != 'undefined' && data) {
                var ll_asset_id = parseInt(data.id) ? parseInt(data.id) : 0;
                $($wrap).find('.actions-line-inventory:last .btn-inventory-fullfilment-actions').attr('ll_asset_id', ll_asset_id);

                if (typeof data.id != 'undefined' && parseInt(data.id)) {
                    $($wrap).find('.line-inventory:last').attr('prize_id', parseInt(data.id));
                }
                if (typeof data.name != 'undefined' && data.name) {
                    $($wrap).find('input.field-inventory:last').val(data.name);
                }
                if (typeof data.icon != 'undefined' && data.icon) {
                    $($wrap).find('input.icn-url:last').val(data.icon);
                    $($wrap).find('.icn-prev:last').html('<img src="' + data.icon + '"/>');
                }
                if (typeof data.is_star != 'undefined' && parseInt(data.is_star)) {
                    $($wrap).find('.btn-star:last img').attr('src', 'imgs/vvp/svgs/gold-star.svg');
                    $($wrap).find('.btn-star:last').addClass('gold-star');
                }
                if (typeof data.bonus_spins != 'undefined' && data.bonus_spins) {
                    $($wrap).find('input.bonus_spins:last').val(data.bonus_spins);
                }
                if (typeof data.custom_probability != 'undefined' && data.custom_probability) {
                    $($wrap).find('input.custom_probability:last').val(data.custom_probability);
                }
                if (typeof data.is_winning != 'undefined' && parseInt(data.is_winning)) {
                    ll_theme_manager.checkboxRadioButtons.check($($wrap).find('input.is_winning:last'), true);
                } else {
                    ll_theme_manager.checkboxRadioButtons.check($($wrap).find('input.is_winning:last'), false);
                }
                if (typeof data.ll_shared_prize_id != 'undefined' && parseInt(data.ll_shared_prize_id)) {
                    ll_combo_manager.set_selected_value('.select_shared_prizes:last', data.ll_shared_prize_id);
                }
                if (typeof data.count != 'undefined' && typeof data.consumed_quantity != 'undefined') {
                    var quantity = parseInt(data.count);
                    var consumed = parseInt(data.consumed_quantity);
                    $($wrap).find('input.field-prize:last').val(quantity).attr('min', consumed).attr('consumed', consumed);
                    ll_activation_builder.apply_prize_changes($($wrap).find('.line-inventory:last'), quantity, consumed);
                }
                if (typeof data.send_notification != 'undefined' && parseInt(data.send_notification)) {
                    $($wrap).find('.line-inventory:last .notifications-line-inventory').addClass('item-selected');
                }
                apply_ll_tooltip($($wrap).find('.line-inventory:last'));
            }
            ll_activation_builder.isRemoveInventory($wrap);
        }
    },
    isRemoveInventory: function($wrap) {
        var count = $wrap.find(".line-inventory").length;
        count > 1 ? $wrap.removeClass("no-remove") : $wrap.addClass("no-remove");
    },
    removeInventory: function($this) {
        var is_shared = $this.closest('.shared_prizes').length ? 1 : 0;
        var $wrap = is_shared ? $this.closest('.shared_prizes') : $this.closest('.inventory-prizes');
        $this.closest(".line-inventory").remove();
        ll_activation_builder.isRemoveInventory($wrap);
        ll_activation_builder.apply_prizes_changes($wrap.closest('.prizes-inventory-box') );

    },
    populateInventory: function(field, data){
        field.find('.inventory-prizes,.shared_prizes').html('');
        var is_shared = 0;
        var warp = '.inventory-prizes';
        for (var i in data){
            is_shared = parseInt(data[i].ll_shared_prize_id) ? 1 : 0 ;
            warp = is_shared ? '.shared_prizes' : '.inventory-prizes' ;
            ll_activation_builder.addNewInventory(field.find(warp), data[i], is_shared);
        }
        if(!field.find('.inventory-prizes .line-inventory').length){
            ll_activation_builder.addNewInventory(field.find('.inventory-prizes'));
        }
        if(!field.find('.shared_prizes .line-inventory').length){
            ll_activation_builder.addNewInventory(field.find('.shared_prizes'), null, 1);
        }
        ll_activation_builder.apply_prizes_changes($(field));
    },

    addNewObject: function($wrap, object, data) {

        var html = '';
        html += '<div class="line-object">' ;
        html += '   <div class="add-line-object"></div>' ;
        html += '   <div class="remove-line-object"></div>' ;
        if(typeof object != 'undefined' && object){
            for(var i in object){
                switch (object[i].type) {
                    case 'text':
                        html += '  <input type="text" class="txt-field field-object" object-identifier="'+object[i].identifier+'" placeholder="'+object[i].placeholder+'">';
                        break;
                    case 'textarea':
                        html += '  <textarea class="txt-field field-object" object-identifier="'+object[i].identifier+'"  placeholder="'+object[i].placeholder+'"></textarea>';
                        break;
                    case 'number':
                        html += '  <input type="number" class="txt-field field-object" object-identifier="'+object[i].identifier+'"  placeholder="'+object[i].placeholder+'">';
                        break;
                }
            }
        }
        html += '</div>';
        $wrap.append(html);

        if(typeof data != 'undefined' && data) {
            for(var identifier in data){
                var element = $($wrap).find('.line-object:last [object-identifier='+ identifier +']');
                if(element.length){
                    switch ($(element).prop("tagName")) {
                        case 'INPUT':
                            $(element).val(data[identifier]);
                            break;
                    }
                }
            }

        }
        ll_activation_builder.isRemoveObject($wrap);
    },
    isRemoveObject: function($wrap) {
        var count = $wrap.find(".line-object").length;
        count > 1 ? $wrap.removeClass("no-remove") : $wrap.addClass("no-remove");

        //  Width
    },
    removeObject: function($this) {
        var $wrap = $this.closest(".container-objects");
        $this.closest(".line-object").remove();
        ll_activation_builder.isRemoveObject($wrap);
    },

    addNewQuestion: function($wrap, data) {
        var html =
            '<div class="line-question">' +
            '   <div class="add-line-question"></div>' +
            '   <div class="remove-line-question"></div>' +
            '   <input type="text" class="txt-field field-question" placeholder="Question"> ' +
            '    <div class="answer-container"> '+
            '       <div class="answer-line"> '+
            '           <div class="answer-item"> '+
            '              <input type="text" class="txt-field field-answer" placeholder="Answer 1">' +
            '              <input type="text" class="txt-field field-points ll_std_tooltip" placeholder="Points" title="Each answer has its own score. Includes negative or positive scores.">' +
            '              <a href="javascript:void(0);" class="btn-star ll_std_tooltip" title ="Yellow star indicates the correct answer."><img src="imgs/vvp/svgs/grey-star.svg"></a>'+
            '           </div> '+
            '           <div class="answer-item"> '+
            '              <input type="text" class="txt-field field-answer" placeholder="Answer 2">' +
            '              <input type="text" class="txt-field field-points ll_std_tooltip" placeholder="Points" title="Each answer has its own score. Includes negative or positive scores.">' +
            '              <a href="javascript:void(0);" class="btn-star ll_std_tooltip" title ="Yellow star indicates the correct answer."><img src="imgs/vvp/svgs/grey-star.svg"></a>'+
            '           </div> '+
            '        </div> '+
            '       <div class="answer-line"> '+
            '           <div class="answer-item"> '+
            '              <input type="text" class="txt-field field-answer" placeholder="Answer 3">' +
            '              <input type="text" class="txt-field field-points ll_std_tooltip" placeholder="Points" title="Each answer has its own score. Includes negative or positive scores.">' +
            '              <a href="javascript:void(0);" class="btn-star ll_std_tooltip" title ="Yellow star indicates the correct answer."><img src="imgs/vvp/svgs/grey-star.svg"></a>'+
            '           </div> '+
            '           <div class="answer-item"> '+
            '              <input type="text" class="txt-field field-answer" placeholder="Answer 4">' +
            '              <input type="number" class="txt-field field-points ll_std_tooltip" placeholder="Points" title="Each answer has its own score. Includes negative or positive scores.">' +
            '              <a href="javascript:void(0);" class="btn-star ll_std_tooltip" title ="Yellow star indicates the correct answer."><img src="imgs/vvp/svgs/grey-star.svg"></a>'+
            '           </div> '+
            '        </div> '+
            '    </div> '+
            '   <input type="text" class="txt-field field-right-answer" placeholder="Answer"> ' +
            '   <input type="number" class="txt-field field-score ll_std_tooltip" placeholder="Score" title="Each correct answers can have a different score."> ' +
            "</div>";
        $wrap.append(html);

        $($wrap).find('.line-question:last .btn-star:eq(0) img').attr('src', 'imgs/vvp/svgs/gold-star.svg');
        $($wrap).find('.line-question:last .btn-star:eq(0)' ).addClass('gold-star');

        if(typeof data != 'undefined' && data) {

            if (typeof data.q != 'undefined' && data.q) {
                $($wrap).find('input.field-question:last').val(data.q);
            }
            if (typeof data.v != 'undefined' && Object.keys(data.v).length) {
                for(var i in data.v){
                    $($wrap).find('.line-question:last input.field-answer:eq('+i+')').val(data.v[i]);
                }
            }
            if (typeof data.p != 'undefined' && Object.keys(data.p).length) {
                for(var i in data.p){
                    $($wrap).find('.line-question:last input.field-points:eq('+i+')').val(data.p[i]);
                }
            }
            if (typeof data.r != 'undefined') {

                $($wrap).find('.line-question:last .btn-star img').attr('src', 'imgs/vvp/svgs/grey-star.svg');
                $($wrap).find('.line-question:last .btn-star' ).removeClass('gold-star');

                $($wrap).find('.line-question:last .btn-star:eq('+data.r+') img').attr('src', 'imgs/vvp/svgs/gold-star.svg');
                $($wrap).find('.line-question:last .btn-star:eq('+data.r+')' ).addClass('gold-star');
            }
            if (typeof data.a != 'undefined' && data.a) {
                $($wrap).find('input.field-right-answer:last').val(data.a);
            }
            if (typeof data.s != 'undefined' && data.s) {
                $($wrap).find('input.field-score:last').val(data.s);
            }

        }
        ll_activation_builder.isRemoveQuestion($wrap);
        apply_ll_tooltip($wrap);
    },
    isRemoveQuestion: function($wrap) {
        var count = $wrap.find(".line-question").length;
        count > 1 ? $wrap.removeClass("no-remove") : $wrap.addClass("no-remove");
    },
    removeQuestion: function($this) {
        var $wrap = $this.closest(".container-questions");
        $this.closest(".line-question").remove();
        ll_activation_builder.isRemoveQuestion($wrap);
    },

    addConfigurationImage: function($box, src, name) {
        if($.trim(src)) {
            var $img = $box.find(".upload-image__file");
            var $name = $box.find(".name-file > span");
            $img.html("<img src=" + src + " alt=''>");
           // $name.text(name);
            $box.find('.img-url').val(src);
            $box.removeClass("no-files");
        }
    },
    removeConfigurationImage: function($box) {
        var img = $box.find(".upload-image__file img");
        var $name = $box.find(".name-file > span");
        var $url = $box.find(".img-url");
        $box.addClass("no-files");
        $name.text("");
        $url.val("");
        img.remove();
    },

    addImagesItem: function ($wrap, item){
        if(typeof item != 'undefined') {
            if(item.imgFor == 'new' || !$($wrap).find('.image[imgFor='+item.imgFor+']').length) {
                var imgHtml = '';
                imgHtml += '<div class="image" imgFor="' + item.imgFor + '">';
                imgHtml += '   <div class="image__file"><img src="' + item.url + '"></div>';
                imgHtml += '   <i class="icn-remove-img">';
                imgHtml += '       <svg width="13px" height="13px" viewBox="0 0 13 13"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-915.000000, -620.000000)" fill="#A6A6A6"><g transform="translate(915.000000, 187.000000)"><path d="M6.17330432,433.173538 C2.85966529,433.173538 0.173538462,435.859665 0.173538462,439.173304 C0.173538462,442.486943 2.85966529,445.173538 6.17330432,445.173538 C9.48694334,445.173538 12.1735385,442.486943 12.1735385,439.173304 C12.1735385,435.859665 9.48694334,433.173538 6.17330432,433.173538 L6.17330432,433.173538 Z M8.88003602,441.230982 L8.23004578,441.880504 C8.11109944,441.999919 7.91628968,441.999919 7.79734334,441.880504 L6.17330432,440.256465 L4.54973358,441.880036 C4.43031895,441.999451 4.23597749,441.999451 4.11656285,441.879099 L3.46657261,441.230982 C3.34809456,441.111099 3.34809456,440.917695 3.46657261,440.797343 L5.09061163,439.173773 L3.4670409,437.550202 C3.34809456,437.430319 3.34809456,437.235509 3.4670409,437.117031 L4.11703114,436.467041 C4.23644578,436.34669 4.43125553,436.34669 4.55020188,436.467041 L6.17330432,438.09108 L7.79734334,436.467041 C7.91675797,436.34669 8.11156773,436.34669 8.23004578,436.467041 L8.88003602,437.116095 C8.99898236,437.235509 8.99898236,437.430319 8.88050432,437.550202 L7.25646529,439.173773 L8.88050432,440.797343 C8.99851407,440.917695 8.99851407,441.111099 8.88003602,441.230982 L8.88003602,441.230982 Z" id="Shape"></path></g></g></g></svg>';
                imgHtml += '   </i>';
                imgHtml += '  <a href="javascript:void(0);" class="btn-star"><img src="imgs/vvp/svgs/grey-star.svg"></a>';
                imgHtml += '</div>';
                $wrap.append(imgHtml);
            }
        }
    },
    colorBox: function() {
        $(".activation-designer .color-box").each(function() {
            var color = $(this).attr("data-color-start");
            $(this)
                .colpick({
                    colorScheme: "dark",
                    layout: "hex",
                    color: color,
                    onSubmit: function(hsb, hex, rgb, el) {
                        $(el).css("background-color", "#" + hex);
                        $(el).attr("data-color-start",  hex);
                        $(el).colpickHide();
                        ll_activation_builder.updateColorElTpl(el, hex);
                    }
                })
                .css("background-color", "#" + color);
        });
    },
    addImage: function($box, url) {
        ll_activation_builder.updateImageTpl($box, url);
    },
    getImageName: function(url) {
        var split = url.split("/");
        split = split[split.length - 1];
        return split;
    },
    updateImageTpl($box, url) {
        var type = null;
        var name = "image.jpg";
        var $boxBuilder = null;

        if ($box.hasClass("upload-logo")) {
            $boxBuilder = $(".slide-box__content .upload-logo");
            type = "upload-logo";
        } else if ($box.hasClass("upload-bg-header")) {
            $boxBuilder = $(".slide-box__content .upload-bg-header");
            type = "upload-bg-header";
        } else if ($box.hasClass("upload-bg-page")) {
            $boxBuilder = $(".slide-box__content .upload-bg-page");
            type = "upload-bg-page";
        } else if ($box.hasClass("upload-bg-capture-screen")) {
            $boxBuilder = $(".capture-screen-settings .upload-bg-capture-screen");
            type = "upload-bg-capture-screen";
        } else if ($box.hasClass("upload-bg-html")) {
            $boxBuilder = $(".slide-box__content .upload-bg-html");
            type = "upload-bg-html";
        } else {
            $boxBuilder = $(".slide-box__content .upload-bg-leaderboard");
            type = "upload-bg-leaderboard";
        }

        if (url !== null && url != 'none') name = ll_activation_builder.getImageName(url);

        var html =
            '<div class="st-unload-image"><span class="st-unload-image__title">' +
            name +
            '</span> <span class="st-unload-image__remove"></span></div>';

        $boxBuilder.find(".st-unload-image").remove();

        if (url === null || url == 'none') {
            $boxBuilder.addClass("no-files");
        } else {
            $boxBuilder.append(html);
            $boxBuilder.removeClass("no-files");
        }
        ll_activation_builder.updateTplImage(type, url);
    },
    updateTplImage: function(type, url) {
        var $box = null;
        if (type === "upload-logo") {
            $box = $(".leadboard__header-logo");
            $box.html("");
            if (url === null || url == 'none') {
                $box.addClass("no-image");
            } else {
                $box.removeClass("no-image");
                $box.append('<img src="' + url + '" alt=""/> <span class="leadboard__reset-header-logo">Reset</span>');
            }
        } else {
            if (type === "upload-bg-header") {
                $box = $(".leadboard__header");
            } else if (type === "upload-bg-page") {
                $box = $("#builder-leadboard__html");
            } else if (type === "upload-bg-capture-screen") {
                $box = $("#capture-screen-html");
            } else if (type === "upload-bg-html") {
                $box = $(".leadboard__html");
            } else {
                $box = $(".leadboard__content");
            }

            if (url === null || url == 'none') {
                $box.css("background-image", "");
            } else {
                $box.css("background-image", "url('" + url + "')");
                if (type === "upload-bg-capture-screen"){
                    $box.removeClass("no-html");
                }
            }
        }
        ll_activation_builder.updateStyleInfo(type, url);
    },

    chkNumberLength: function($input){
        var val = $input.value;
        var length = parseInt($($input).attr('length'));
        if(val.length > length){
            $($input).val(val.substring(0, length));
            return false;
        }
    },

   /* codeBox: {
        editor: null,
        init: function() {
            CodeMirror.commands.autocomplete = function(cm) {
                cm.showHint({ hint: CodeMirror.hint.anyword });
            };
            ll_activation_builder.codeBox.editor = CodeMirror.fromTextArea(
                document.getElementById("leadboard-code-editor"),
                {
                    lineNumbers: true,
                    lineWrapping: true,
                    extraKeys: { "Ctrl-Space": "autocomplete" }
                }
            );
            ll_activation_builder.codeBox.editor.on("blur", function() {
                ll_activation_builder.setCustomHTML();
            });
        },
        setHTML: function() {
            /!*var html = ll_activation_builder.codeBox.editor.getValue();*!/
        },
        getHTML: function() {
            var html =
                ll_activation_builder.codeBox.editor !== null ? ll_activation_builder.codeBox.editor.getValue() : "";
            return html;
        }
    },*/
    setCustomHTML: function() {
        var val = ll_activation_builder.codeBox.getHTML();
        var helpHTML = '<div class="leadboard__help-column">HTML</div>';
        var $box = $(".leadboard__html");

        $.trim(val) === "" ? $box.html(helpHTML) : $box.html(val);
    },
    sliderGrid: function(id, values) {
        var slider = ll_activation_builder.sliderGridTwo;

        if (typeof slider != 'undefined' && slider !== null) slider.noUiSlider.destroy();

        slider = document.getElementById(id);
        noUiSlider.create(slider, {
            start: values,
            step: 1,
            margin: 5,
            range: {
                min: [5],
                max: [100]
            }
        });
        slider.noUiSlider.on("slide", function(values, handle) {
            ll_activation_builder.setGridSizeColumns($(this.target), values);
        });
        slider.noUiSlider.on("change", function(values, handle) {
            var widthLeftCol = parseInt(values[0]);
            var widthRightCol = 100 - widthLeftCol;

            $(".leadboard__column-left").css("width", widthLeftCol + "%");
            $(".leadboard__column-right").css("width", widthRightCol + "%");

            ll_activation_builder.updateStyleInfo('leadboard_layout', values[0]);
        });
        ll_activation_builder.sliderGridTwo = slider;
    },
    setGridSizeColumns: function($box, values) {
        var $items = null;
        var $wrapItems = null;
        var value1 = parseInt(values[0]);
        var value2 = 0;

        $box.find(".st-grid-size__items").remove();
        $box.prepend('<div class="st-grid-size__items"></div>');
        $wrapItems = $box.find(".st-grid-size__items");

        for (i = 0; i <= values.length; i++) {
            $wrapItems.append('<div class="st-grid-size__item"/>');
        }

        $items = $box.find(".st-grid-size__item");
        value2 = 100 - parseInt(values[0]);
        $items
            .eq(0)
            .css("width", value1 + "%")
            .text(value1 + "%");
        $items
            .eq(1)
            .css({
                left: value1 + "%",
                width: value2 + "%"
            })
            .text(value2 + "%");
    },
    freeImages: function(page, searchValue, isMoreLoad, $box) {
        var parent = $box;
        if($box.hasClass('screensaver-img')){
            $box = $('.unsplash-right-panel');
        }
        page = page || 1;
        var url =
            "https://api.unsplash.com/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" +
            page;
        var isSearch = false;
        searchValue = $.trim(searchValue);
        var $btn = $box.find(".btn-more-free-images");
        var $list = $box.find(".list-free-images > ul");

        if (searchValue !== "") {
            isSearch = true;
            url =
                "https://api.unsplash.com/search/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" +
                page +
                "&query=" +
                searchValue;
        }

        $.getJSON(url, function(data) {
            //console.log(data);
            var items = "";

            if (isSearch) data = data.results;

            var cls = parent.hasClass('screensaver-img') ? "screensaver":"";

            $.each(data, function(key, val) {
                var imgURL = val.urls.regular;
                items +=
                    "<li class='list-free-images__item "+cls+"' id='" +
                    key +
                    "' style='background-image: url(" +
                    imgURL +
                    ")' data-url='" +
                    imgURL +
                    "'></li>";
            });

            if (isMoreLoad) $list.append(items);
            else $list.html(items);

            $btn.attr("data-page", parseInt(page) + 1);

            if(parent.hasClass('screensaver-img')) {
                $list.find('li.list-free-images__item').click(function () {
                    var selected_img_url = $(this).attr('data-url');
                    $('.unsplash-right-panel').hide();
                    ll_activation_builder.addHTMLImage(parent, selected_img_url, selected_img_url, '100 X 100');
                });
            }
        })
            .done(function() {
                //console.log("second success");
            })
            .fail(function() {
                //console.log("error");
            })
            .always(function() {
                $btn.removeClass("disabled");

                if ($list.find("li").length) $btn.show();
                else $btn.hide();
            });
        //Access Key
        //1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb
    },
    updateColorElTpl: function(el, hex) {
        var id = $(el).attr("id");
        var color = hex != 'transparent' ? "#" + hex : 'transparent';
        var styleInfo = ll_activation_builder.styleInfo;
        if( hex != 'transparent') {
            $(el).attr("data-color-start", hex);
        }

        if (id === "pageBg") {
            $("#builder-leadboard__html").css("background-color", color);
        } else if (id === "headerBg") {
            $(".leadboard__header").css("background-color", color);
        } else if (id === "titleColor") {
            $(".leadboard__header h2").css("color", color);
        } else if (id === "leaderboardBg") {
            $(".leadboard__content").css("background-color", color);
        } else if (id === "highlightedLeaderboardBg") {
            $(".leadboard__content .highlighted").find('.list-leaders__name, .list-leaders__number, .list-leaders__count').css("background-color", color);
        } else if (id === "nameLeaderColor") {
            $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number').css("color", color);
        } else if (id === "scoreLeaderColor") {
            $(".list-leaders__item:not(.highlighted) .list-leaders__count").css("color", color);
        } else if (id === "highlightedNameLeaderColor") {
            $(".list-leaders__item.highlighted").find('.list-leaders__name, .list-leaders__number').css("color", color);
        } else if (id === "highlightedScoreLeaderColor") {
            $(".list-leaders__item.highlighted .list-leaders__count").css("color", color);
        } else if (id === "captureScreenBg") {
            $("#capture-screen-html").css("background-color", color);
        } else if (id === "htmlBg") {
            $(".leadboard__html").css("background-color", color);
        } else if (id === "rowBg") {
            if(typeof styleInfo.rowCheckTransparent != 'undefined' && styleInfo.rowCheckTransparent == 0){
                if(typeof styleInfo.rowBgOpacity != 'undefined'){
                    color = ll_theme_manager.hex2rgba(color, styleInfo.rowBgOpacity);
                }
                $(".list-leaders__item:not(.highlighted)").find('.list-leaders__number, .list-leaders__name, .list-leaders__count').css("background-color", color);
            }
        } else if (id === "rowBorderColor") {
            $(".list-leaders__item").find('.list-leaders__number, .list-leaders__name, .list-leaders__count').css("border-color", color);
        }
        ll_activation_builder.updateStyleInfo(id, hex);
    },
    changeOptions: function() {
        var $title = $(".leadboard__header h2");
        var $leadersName = $(".list-leaders__item:not(.highlighted)").find(".list-leaders__number, .list-leaders__name");
        var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
        var $highlightedLeadersName = $(".list-leaders__item.highlighted").find(".list-leaders__number, .list-leaders__name");
        var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");

        $("#headerTitle").on("keyup", function() {
            var val = $.trim($(this).val());

            if (val === "") val = "TITLE";

            $title.text(val);
        });
        $("#titleTypeFace").change(function() {
            var val = $(this).val();
            $title.css("font-family", val + ", sans-serif");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#titleFontSize").change(function() {
            var val = $(this).val();
            $title.css("font-size", val + "px");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#titleFontWeight").change(function() {
            var val = $(this).val();
            $title.css("font-weight", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#titleLineHeight").change(function() {
            var val = $(this).val();
            $title.css("line-height", val + "%");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#leaderboardAlingment").change(function() {
            var val = $(this).val();
            var $wrap = $(".leadboard__columns");
            var $colLeft = $(".leadboard__column-left");
            var $colRight = $(".leadboard__column-right");
            var $leaderboardCol = $(".leadboard__content");
            var $HTMLCol = $(".leadboard__html");

            if (val === "1") {
                $colLeft.append($HTMLCol);
                $colRight.append($leaderboardCol);
            } else {
                $colLeft.append($leaderboardCol);
                $colRight.append($HTMLCol);
            }
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#leaderboardCountItem").change(function() {
            var val = $(this).val();
            var $items = $(".list-leaders__item");
            //$(".leadboard__content").attr("totalItems", val);

            if (val === "20") {
                $items.removeClass("hide");
            } else {
                $items.each(function(index) {
                    if (index > 9) $(this).addClass("hide");
                });
            }
            //ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#leaderboardHighlightedCountItem").change(function() {

            var val = parseInt($(this).val());
            var $items = $(".list-leaders__item");

            $items.removeClass('highlighted');
            ll_activation_builder.removeHighlightedStyles();
            if(val){
                $('.highlighted-styles').show();
                $items.each(function(index) {
                    if (index < val) $(this).addClass("highlighted");
                });
                ll_activation_builder.applyHighlightedStyles();
            } else {
                $('.highlighted-styles').hide();
            }
        });

        $("#DisplayFullName").change(function() {
            var $this = $(this);
            $(".list-leaders .list-leaders__item").each(function(index) {
                var fname = $(this).find('.list-leaders__name').attr('fname');
                if($this.is(':checked')){
                    $(this).find('.list-leaders__name').text(fname);
                } else {
                    var name_arr = fname.split(' ');
                    $(this).find('.list-leaders__name').text(name_arr[0]+ ' '+ name_arr[1].slice(0,1) + '.');
                }
            });
        });

        $('#rowCheckTransparent').on('change', function () {
            var val = 0;
            var styleInfo = ll_activation_builder.styleInfo;

            if($(this).is(':checked')){
                val = 1;
                
                $('.list-leaders__item:not(.highlighted)').find('.list-leaders__number, .list-leaders__name, .list-leaders__count').css('background-color', 'transparent');
                ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
            } else {
                
                ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
                ll_activation_builder.updateColorElTpl($('#rowBg'), styleInfo.rowBg);
            }
        });
        $('#rowBgOpacity').on('change', function () {
            var val = $(this).val();
            var styleInfo = ll_activation_builder.styleInfo;

            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
            ll_activation_builder.updateColorElTpl($('#rowBg'), styleInfo.rowBg);
        });
        $("#rowBorderType").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number,  .list-leaders__count');
            $leaders.css("border-style", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowBorderWidth").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number,  .list-leaders__count');
            $leaders.css("border-width", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowMarginRight").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number');
            $leaders.css("margin-right", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowMarginBottom").change(function() {
            var val = $(this).val();
            var $leadersRow = $(".list-leaders__item");
            $leadersRow.css("margin-bottom", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowPaddingLeft").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number, .list-leaders__count');
            $leaders.css("padding-left", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowPaddingRight").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number, .list-leaders__count');
            $leaders.css("padding-right", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#nameLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameTypeFace", val + ", sans-serif");
            $leadersName.css("font-family", val + ", sans-serif");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#nameLeaderFontSize").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameFontSize", val + "px");
            $leadersName.css("font-size", val + "px");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#nameLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameFontWeight", val);
            $leadersName.css("font-weight", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#nameLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameLineHeight", val + "%");
            $leadersName.css("line-height", val + "%");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#scoreLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreTypeFace", val + ", sans-serif");
            $leadersScore.css("font-family", val + ", sans-serif");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderFontSize").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontSize", val + "px");
            $leadersScore.css("font-size", val + "px");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontWeight", val);
            $leadersScore.css("font-weight", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
           //$(".leadboard__content").attr("scoreLineHeight", val + "%");
            $leadersScore.css("line-height", val + "%");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderTextAlign").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item .list-leaders__count");
            $leadersScore.css("text-align", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });

        // ---------- Highlighted
        $("#highlightedNameLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameTypeFace", val + ", sans-serif");
            $highlightedLeadersName.css("font-family", val + ", sans-serif");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedNameLeaderFontSize").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameFontSize", val + "px");
            $highlightedLeadersName.css("font-size", val + "px");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedNameLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameFontWeight", val);
            $highlightedLeadersName.css("font-weight", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedNameLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameLineHeight", val + "%");
            $highlightedLeadersName.css("line-height", val + "%");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#highlightedScoreLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");

            //$(".leadboard__content").attr("scoreTypeFace", val + ", sans-serif");
            $highlightedLeadersScore.css("font-family", val + ", sans-serif");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedScoreLeaderFontSize").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontSize", val + "px");
            $highlightedLeadersScore.css("font-size", val + "px");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedScoreLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontWeight", val);
            $highlightedLeadersScore.css("font-weight", val);
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedScoreLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");
            //$(".leadboard__content").attr("scoreLineHeight", val + "%");
            $highlightedLeadersScore.css("line-height", val + "%");
            ll_activation_builder.updateStyleInfo($(this).attr('id'), val);
        });
    },
    changeInputCss: function($this) {
        var id = $this.attr("id");
        var val = $this.val();

        if (id === "headerHeight") {
            $(".leadboard__header").css("height", val);
            $(".leadboard__columns").css("height", "calc(100% - " + val + ")");
        } else if (id === "leadersPaddingLeft") {
            $(".leadboard__content").css("padding-left", val);
        } else if (id === "leadersPaddingRight") {
            $(".leadboard__content").css("padding-right", val);
        } else if (id === "leadersPaddingTop") {
            $(".leadboard__content").css("padding-top", val);
        } else if (id === "leadersPaddingBottom") {
            $(".leadboard__content").css("padding-bottom", val);
        } else if (id === "headerPaddingLeft") {
            $(".leadboard__header").css("padding-left", val);
        } else if (id === "headerPaddingRight") {
            $(".leadboard__header").css("padding-right", val);
        } else if (id === "htmlPaddingLeft") {
            $(".leadboard__html").css("padding-left", val);
        } else if (id === "htmlPaddingRight") {
            $(".leadboard__html").css("padding-right", val);
        } else if (id === "htmlPaddingTop") {
            $(".leadboard__html").css("padding-top", val);
        } else if (id === "htmlPaddingBottom") {
            $(".leadboard__html").css("padding-bottom", val);
        } else if (id === "captureScreenPaddingLeft") {
            $("#capture-screen-html").css("padding-left", val);
        } else if (id === "captureScreenPaddingRight") {
            $("#capture-screen-html").css("padding-right", val);
        } else if (id === "captureScreenPaddingTop") {
            $("#capture-screen-html").css("padding-top", val);
        } else if (id === "captureScreenPaddingBottom") {
            $("#capture-screen-html").css("padding-bottom", val);
        }
        ll_activation_builder.updateStyleInfo(id, val);
    },
    /*
    getLeadersItems: function() {
      var maxTotal = $(".leadboard__content").attr("totalItems");
      var html = '<div class="list-leaders">';

      $(".line-inventory").each(function(index) {
        if (index < maxTotal) {
          var $item = $(this);
          var name = $.trim($item.find(".field-inventory").val());
          var quantity = $.trim($item.find(".field-prize").val());

          index = index + 1;

          if (name === "") name = "Name #" + index;
          if (quantity === "") quantity = 0;

          html +=
            '<div class="list-leaders__item">' +
            '<span class="list-leaders__name">' +
            index +
            ". " +
            name +
            '</span><span class="list-leaders__count">' +
            quantity +
            "</span></div>";
        }
      });
      html += "</div>";

      return html;
    },
    setCSSLeaderName: function() {
      var $box = $(".leadboard__content");

      $(".list-leaders__name").css({
        fontSize: $box.attr("nameFontSize"),
        fontWeight: $box.attr("nameFontWeight"),
        fontFamily: $box.attr("nameTypeFace"),
        color: $box.attr("nameColor"),
        lineHeight: $box.attr("nameLineHeight")
      });
    },
    setCSSLeaderScore: function() {
      var $box = $(".leadboard__content");

      $(".list-leaders__count").css({
        fontSize: $box.attr("scoreFontSize"),
        fontWeight: $box.attr("scoreFontWeight"),
        fontFamily: $box.attr("scoreTypeFace"),
        color: $box.attr("scoreColor"),
        lineHeight: $box.attr("scoreLineHeight")
      });
    },*/

    applyHighlightedStyles: function(){

        $(".leadboard__content .highlighted").find('.list-leaders__number, .list-leaders__name, .list-leaders__count').css("background-color", '#'+$('#highlightedLeaderboardBg').attr('data-color-start'));
        $(".leadboard__content .highlighted .list-leaders__name").css("color", '#'+$('#highlightedNameLeaderColor').attr('data-color-start'));
        $(".leadboard__content .highlighted .list-leaders__count").css("color", '#'+$('#highlightedScoreLeaderColor').attr('data-color-start'));

        $("#highlightedNameLeaderTypeFace").change();
        $("#highlightedNameLeaderFontSize").change();
        $("#highlightedNameLeaderFontWeight").change();
        $("#highlightedNameLeaderLineHeight").change();

        $("#highlightedScoreLeaderTypeFace").change();
        $("#highlightedScoreLeaderFontSize").change();
        $("#highlightedScoreLeaderFontWeight").change();
        $("#highlightedScoreLeaderLineHeight").change();
    },

    removeHighlightedStyles: function(){
        $(".leadboard__content .list-leaders__name").css("color", '#'+$('#nameLeaderColor').attr('data-color-start'));
        $(".leadboard__content .list-leaders__count").css("color", '#'+$('#scoreLeaderColor').attr('data-color-start'));

        $('#rowBgOpacity').change();

        $("#nameLeaderTypeFace").change();
        $("#nameLeaderFontSize").change();
        $("#nameLeaderFontWeight").change();
        $("#nameLeaderLineHeight").change();

        $("#scoreLeaderTypeFace").change();
        $("#scoreLeaderFontSize").change();
        $("#scoreLeaderFontWeight").change();
        $("#scoreLeaderLineHeight").change();
    },

    updateStyleInfo:function(key, val){
      ll_activation_builder.styleInfo[key] = val;
    },
    populateStyleInfo: function(styleInfo){
        if(styleInfo && Object.keys(styleInfo).length){
            //Remove
            if(typeof styleInfo['rowBg'] == 'undefined') styleInfo['rowBg'] = 'ffffff';
            if(typeof styleInfo['rowCheckTransparent'] == 'undefined') styleInfo['rowCheckTransparent'] = 1;
            if(typeof styleInfo['rowBgOpacity'] == 'undefined') styleInfo['rowBgOpacity'] = '100';
            if(typeof styleInfo['rowBorderType'] == 'undefined') styleInfo['rowBorderType'] = 'None';
            if(typeof styleInfo['rowBorderWidth'] == 'undefined') styleInfo['rowBorderWidth'] = '0';
            if(typeof styleInfo['rowBorderColor'] == 'undefined') styleInfo['rowBorderColor'] = 'ffffff';
            if(typeof styleInfo['rowMarginOuter'] == 'undefined') styleInfo['rowMarginOuter'] = '0';
            if(typeof styleInfo['rowMarginBottom'] == 'undefined') styleInfo['rowMarginBottom'] = '0';
            if(typeof styleInfo['rowPaddingLeft'] == 'undefined') styleInfo['rowPaddingLeft'] = '0';
            if(typeof styleInfo['rowPaddingRight'] == 'undefined') styleInfo['rowPaddingRight'] = '0';
            if(typeof styleInfo['scoreLeaderTextAlign'] == 'undefined') styleInfo['scoreLeaderTextAlign'] = 'left';
            //Remove
            for(var key in styleInfo){
                if($.trim(styleInfo[key]) && $.trim(styleInfo[key]) != 'undefined' && $.trim(styleInfo[key]) != 'null') {

                    if( key == 'leadboard_layout'){

                        ll_activation_builder.sliderGrid("twoGridGrid", styleInfo[key]);
                        ll_activation_builder.setGridSizeColumns($(ll_activation_builder.sliderGridTwo), [styleInfo[key]]);
                        var widthLeftCol = parseInt(styleInfo[key]);
                        var widthRightCol = 100 - widthLeftCol;
                        $(".leadboard__column-left").css("width", widthLeftCol + "%");
                        $(".leadboard__column-right").css("width", widthRightCol + "%");

                    } else if ( key == 'leaderboardAlingment'){

                        $('.display_leaderboard[display-type='+styleInfo[key]+']').trigger('click');

                    } else if( key == 'rowCheckTransparent'){
                        if(parseInt(styleInfo.rowCheckTransparent)){
                            ll_theme_manager.checkboxRadioButtons.check('#rowCheckTransparent', true);
                        } else {
                            ll_theme_manager.checkboxRadioButtons.check('#rowCheckTransparent', false);
                        }
                        $('#rowCheckTransparent').change();
                    } else if ($('#' + key).length) {
                        switch ($('#' + key).prop("tagName")) {
                            case 'INPUT':
                                $('#' + key).val(styleInfo[key]);
                                $('#' + key).trigger('change');
                                break;
                            case 'SELECT':
                                ll_combo_manager.set_selected_value($('#' + key), styleInfo[key]);
                                $('#' + key).trigger('change');
                                break;
                            case 'DIV':
                                if ($('#' + key).hasClass('color-box')) {
                                    if( styleInfo[key] == 'transparent'){
                                        $('#' + key).css("background-color", "transparent");
                                    } else {
                                        $('#' + key).css("background-color", "#" + styleInfo[key]);
                                    }
                                    ll_activation_builder.updateColorElTpl($('#' + key), styleInfo[key]);
                                }
                                break;
                        }
                    } else if ($('.' + key).length) {
                        var element = $('.' + key);
                        if (element.hasClass('upload-logo') ||
                            element.hasClass('upload-bg-page') ||
                            element.hasClass('upload-bg-header') ||
                            element.hasClass('upload-bg-capture-screen') ||
                            element.hasClass('upload-bg-html') ||
                            element.hasClass('upload-bg-leaderboard')) { // Image
                            ll_activation_builder.addImage($("." + key), styleInfo[key]);
                        }
                    }
                }
            }
        }
    },
    getHTMLPreviewLeaderboard: function() {
        var HTML = $(".builder-leadboard").html();
        //var HTMLCode = ll_activation_builder.codeBox.getHTML();
        //var HTMLlist = ll_activation_builder.getLeadersItems();
        var $preview = $("#previewLeaderboard");
        $preview
            .append(HTML)
            .find(".leadboard__help-column")
            .remove();

        //$preview.find(".leadboard__html").html(HTMLCode);
        //$preview.find(".leadboard__content").html(HTMLlist);
        //ll_activation_builder.setCSSLeaderName();
        //ll_activation_builder.setCSSLeaderScore();
    },
    getHTMLPreviewCaptureSreen: function() {
        var HTML = $(".capture-screen-content").html();
        $("#previewCaprureScreen")
            .append(HTML)
            .find(".help-box")
            .remove();
    },

    populate: function(ll_activation){
        if(typeof ll_activation != 'undefined' && ll_activation){

            //ll_combo_manager.set_selected_value('#ll_activation_event_id', ll_activation.event_id );
            //ll_combo_manager.set_selected_value('#ll_activation_identifier_id', ll_activation.ll_activation_identifier_id );
            ll_combo_manager.set_selected_value($('#ll_activation_event_station_id'), ll_activation.station_id);
            ll_theme_manager.checkboxRadioButtons.check('input[name=capture_form_before_or_after][value='+ll_activation.capture_form_before_or_after+']', true);
            ll_theme_manager.checkboxRadioButtons.check('input[name=play_restriction][value='+ll_activation.play_restriction+']', true);
            if($.trim(ll_activation.activation_mode)) {
                ll_theme_manager.checkboxRadioButtons.check('input[name=activation_mode][value="'+ll_activation.activation_mode+'"]', true);
                $('input[name="activation_mode"][value="'+ll_activation.activation_mode+'"]').click();
            }
            $('#max_individual_plays').val(ll_activation.max_individual_plays);
            $('#max_group_plays').val(ll_activation.max_group_plays);
            ll_theme_manager.checkboxRadioButtons.check('input[name=webview_success_action_type][value='+ll_activation.webview_success_action_type+']', true);
            $('#webview-success-message').val(ll_activation.webview_success_message);
            $('input[name="webview_success_redirect_url"]').val(ll_activation.webview_success_redirect_url);

            $('#submit_button_background_color').attr('data-color-start', ll_activation.submit_button_background_color);
            $('#submit_button_background_color').css('background-color', '#' + ll_activation.submit_button_background_color);

            $('#submit_button_text_color').attr('data-color-start', ll_activation.submit_button_text_color);
            $('#submit_button_text_color').css('background-color', '#' + ll_activation.submit_button_text_color);

            $('#submit_button_text').val(ll_activation.submit_button_text);

            $('.display_capture_form').removeClass('active');
            $('.display_capture_form[display-type='+ll_activation.display_capture_form+']').trigger('click');
            if($.trim(ll_activation.capture_screen_html)){
                $('#capture-screen-html').replaceWith(ll_activation.capture_screen_html);
            }
            if(parseInt(ll_activation.ll_activation_identifier_id) && Object.keys(ll_activation_builder.ll_activation_identifier).length){
                var identifier = ll_activation_builder.ll_activation_identifier;
                ll_activation_builder.populate_identifier(identifier);
                ll_activation_builder.populate_configuration_data(ll_activation.configuration_data, function () {
                    ll_activation_builder.after_append_configuration(identifier);
                });
            }

            $('.builder-leadboard-panels #headerTitle').val(ll_activation.leaderboard_title);
            $(".leadboard__header h2").text(ll_activation.leaderboard_title);

            ll_activation.leaderboard_html = $.trim(ll_activation.leaderboard_html) ? ll_activation.leaderboard_html : '';

            var helpHTML = '<div class="leadboard__help-column">HTML</div>';
            var $box = $(".leadboard__html");
             $.trim(ll_activation.leaderboard_html)  ? $box.html(ll_activation.leaderboard_html) : $box.html(helpHTML)  ;

           // $('#leadboard-code-editor').text(ll_activation.leaderboard_html);

            /*if (!$(".leadboard-code-editor .CodeMirror").length){
                ll_activation_builder.codeBox.init();

            } */
            //ll_activation_builder.codeBox.editor.setValue(ll_activation.leaderboard_html);

            ll_combo_manager.set_selected_value('#leaderboardCountItem', ll_activation.leaderboard_leaders_count );
            ll_combo_manager.set_selected_value('#leaderboardHighlightedCountItem', ll_activation.leaderboard_highlighted_leaders_count );
            $('#leaderboardCountItem').change();
            $('#leaderboardHighlightedCountItem').change();

            if(parseInt(ll_activation.leaderboard_display_full_name)){
                ll_theme_manager.checkboxRadioButtons.check('#DisplayFullName', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#DisplayFullName', false);
            }
            $('#DisplayFullName').change();

           /* if(parseInt(ll_activation.winner_method)) {
                ll_theme_manager.checkboxRadioButtons.check('input[name=radio_winner_methods][value='+ll_activation.winner_method+']', true);
            }*/
            //$('#count_of_winners').val(ll_activation.count_of_winners);

            if(typeof ll_activation.style != 'undefined' && ll_activation.style && Object.keys(ll_activation.style).length) {

                if(ll_activation.style.is_enable_screensaver == '1') {
                    ll_theme_manager.checkboxRadioButtons.check('#is_enable_screensaver', true);
                    $('.screensaver-elements').show();
                    ll_theme_manager.checkboxRadioButtons.check('[name=is_event_screensaver][value='+ll_activation.style.is_event_screensaver+']', true);
                    if(ll_activation.style.is_event_screensaver == '1') {
                        $('.screensaver-elements.custom').hide();
                    } else {
                        $('.screensaver-elements.custom').show();
                    }
                } else {
                    ll_theme_manager.checkboxRadioButtons.check('#is_enable_screensaver', false);
                    $('.screensaver-elements').hide();
                }

                if(ll_activation.style.rotation_period) {
                    $('#rotation_period').val(ll_activation.style.rotation_period);
                }
                if(ll_activation.style.is_randomize == '1') {
                    ll_theme_manager.checkboxRadioButtons.check('#is_randomize', true);
                } else {
                    ll_theme_manager.checkboxRadioButtons.check('#is_randomize', false);
                }
                $('#switch_frequency').val(ll_activation.style.switch_frequency);
                ll_combo_manager.set_selected_value('#transition_effect', ll_activation.style.transition_effect);

                if(ll_activation.style.screensaver_images) {
                    if(ll_activation.style.screensaver_images.length == 0){
                        ll_activation_builder.add_screensaver_line('');
                    } else {
                        for(var i = 0; i < ll_activation.style.screensaver_images.length; i++) {
                            ll_activation_builder.add_screensaver_line(ll_activation.style.screensaver_images[i]);
                        }
                    }
                } else {
                    ll_activation_builder.add_screensaver_line('');
                }

            }

            if(typeof ll_activation.style_info != 'undefined' && ll_activation.style_info && Object.keys(ll_activation.style_info).length){
                ll_activation_builder.styleInfo = ll_activation.style_info;
                ll_activation_builder.populateStyleInfo(ll_activation.style_info);
            }
        }
    },
    populate_configuration_data: function(configuration_data, _callback){
        if(typeof configuration_data != 'undefined' && configuration_data){
            for (var identifier in configuration_data) {
                var field = $('.activation-configuration-elements [identifier='+identifier+']');
                if(field.length && typeof field.attr('type') != 'undefined' && field.attr('type')) {
                    switch (field.attr('type')) {
                        case 'text':
                            field.find('input.txt-field').val(configuration_data[identifier]);
                            break;
                        case 'textarea':
                            field.find('textarea.txt-field').html(configuration_data[identifier]);
                            break;
                        case 'number':
                            field.find('input.txt-field').val(configuration_data[identifier]);
                            break;
                        case 'color':
                            field.find('.color-box').attr('data-color-start', configuration_data[identifier]);
                            field.find('.color-box').css('background-color', '#' + configuration_data[identifier]);
                            break;
                        case 'image':
                            if($.trim(configuration_data[identifier])){
                                ll_activation_builder.addConfigurationImage(field, configuration_data[identifier]);
                            } else {
                                ll_activation_builder.removeConfigurationImage(field);
                            }
                            break;
                        case 'images':
                            field.find('.images').html('');
                            if(Object.keys(configuration_data[identifier]).length){
                                for (var i in configuration_data[identifier]){
                                    ll_activation_builder.addImagesItem(field.find('.images'), configuration_data[identifier][i]);
                                }
                            }
                            break;
                        case 'radio':
                             ll_theme_manager.checkboxRadioButtons.check(field.find('input[name=radio_' + identifier + '][value='+configuration_data[identifier]+']'), true);
                            break;
                        case 'checkbox':
                            if(parseInt(configuration_data[identifier])){
                                ll_theme_manager.checkboxRadioButtons.check(field.find('input[name=check_' + identifier + ']'), true);
                            } else {
                                ll_theme_manager.checkboxRadioButtons.check(field.find('input[name=check_' + identifier + ']'), false);
                            }
                            break;
                        case 'checkboxes':
                            if(Object.keys(configuration_data[identifier]).length){
                                for (var i in configuration_data[identifier]){
                                    var checked = parseInt(configuration_data[identifier][i]) ? true : false;
                                    ll_theme_manager.checkboxRadioButtons.check(field.find('input[name=check_' + i + ']'), checked);
                                }
                            }
                            break;
                        case 'select':
                            ll_combo_manager.set_selected_value(field.find('select'), configuration_data[identifier]);
                            break;
                        case 'prizes_and_inventory':
                            if(Object.keys(configuration_data[identifier]).length){
                                ll_activation_builder.populateInventory(field, configuration_data[identifier]);
                            }
                            break;
                        case 'object':
                        case 'objects':
                            if(Object.keys(configuration_data[identifier]).length){
                                field.find('.container-objects').html('');
                                if($.trim(identifier) in ll_activation_builder.activation_configuration) {
                                    for (var i in configuration_data[identifier]) {
                                        ll_activation_builder.addNewObject(field.find('.container-objects'), ll_activation_builder.activation_configuration[$.trim(identifier)].object, configuration_data[identifier][i]);
                                    }
                                }
                            }
                            break;
                        case 'questions':
                            if(Object.keys(configuration_data[identifier]).length){
                                field.find('.container-questions').html('');
                                for (var i in configuration_data[identifier]){
                                    ll_activation_builder.addNewQuestion(field.find('.container-questions'), configuration_data[identifier][i]);
                                }
                            }
                            break;
                    }
                }
            }

            switch (ll_activation_builder.ll_activation_identifier.ll_activation_identifier_alias) {
                case 'WHACK_IT':
                    if(typeof configuration_data['WhackOnly'] != 'undefined'){
                        $('.configuration-item[identifier=objects] .btn-star').eq( parseInt(configuration_data['WhackOnly']) ).click();
                    } else {
                        $('.configuration-item[identifier=objects] .btn-star:first').click();
                    }
                    break;
            }
        }
        if(typeof _callback != 'undefined' && _callback){
            _callback.call();
        }
    },
    zoom_screenshot: function(src){
        $('.screenshot_zoom').css('display', 'inline-block').attr('href', src).html('<img src="'+ src +'" alt=""/>');
        $('.screenshot_zoom').trigger('click');
    },
    editor_set_content: function(_selector, _content, _enfore_clear_undo){

        _enfore_clear_undo = (typeof _enfore_clear_undo == 'undefined') ? true : _enfore_clear_undo;
        var _editor = tinymce.get(_selector);
        if(_editor && typeof _editor.is_initiatlized != 'undefined' && _editor.is_initiatlized){
            _editor.setContent(_content);
            ll_activation_builder.updateHTMLBlock(_selector);
            if(_enfore_clear_undo){
                _editor.undoManager.clear()
            }
        } else {
            window.setTimeout(function (){
                ll_activation_builder.editor_set_content(_selector, _content, _enfore_clear_undo)
            }, 100);
        }
    },
    collect_capture_html: function(){
        var capture_screen_html = $(".capture-screen-content #capture-screen-html")[0].outerHTML;
        $("#capture-screen-html-temp")
            .html(capture_screen_html)
            .find(".help-box")
            .remove();
        return capture_screen_html;
    },
    collect_clean_capture_html: function(){
        var capture_screen_html = $(".capture-screen-content #capture-screen-html")[0].outerHTML;
        $("#capture-screen-html-temp")
            .html(capture_screen_html)
            .find(".help-box")
            .remove();
        return $("#capture-screen-html-temp").html();
    },

    collect_data: function(){

        var data = {};
        data.event_id = ll_combo_manager.get_selected_value('#ll_activation_event_id');
        //data.ll_activation_identifier_id = ll_combo_manager.get_selected_value('#ll_activation_identifier_id');
        data.capture_form_before_or_after = $('input[name=capture_form_before_or_after]:checked').val();
        data.display_capture_form = $('.display_capture_form.active').attr('display-type');
        data.capture_screen_html = ll_activation_builder.collect_capture_html();
        data.capture_screen_clean_html = ll_activation_builder.collect_clean_capture_html();
        ll_activation_builder.collected_configuration_data = ll_activation_builder.collect_configuration_data();
        data.configuration_data = JSON.stringify(ll_activation_builder.collected_configuration_data);
        data.leaderboard_title = $('.builder-leadboard-panels #headerTitle').val();
        //data.leaderboard_html = ll_activation_builder.codeBox.getHTML();
        data.leaderboard_html = $(".leadboard__html .leadboard__help-column").length ? "" : $(".leadboard__html").html();
        data.leaderboard_leaders_count = ll_combo_manager.get_selected_value('#leaderboardCountItem');
        data.leaderboard_highlighted_leaders_count = ll_combo_manager.get_selected_value('#leaderboardHighlightedCountItem');
        data.leaderboard_display_full_name = $('#DisplayFullName').is(':checked') ? 1 : 0;
        data.style_info = ll_activation_builder.styleInfo;
        //data.winner_method = $('.winner_methods').is(':visible')? $('input[name=radio_winner_methods]:checked').val(): 0;
        data.count_of_winners = $('#count_of_winners').val();
        data.station_id = ll_combo_manager.get_selected_value('#ll_activation_event_station_id');
        data.submit_button_background_color = $('#submit_button_background_color').attr('data-color-start');
        data.submit_button_text_color = $('#submit_button_text_color').attr('data-color-start');
        data.submit_button_text = $('#submit_button_text').val();

        data.is_enable_screensaver = $('#is_enable_screensaver').is(':checked') ? '1' : '0';
        data.is_event_screensaver = $('input[name=is_event_screensaver]:checked').val();
        data.rotation_period = $('#rotation_period').val();
        data.is_randomize = $('#is_randomize').is(':checked') ? '1' : '0';
        data.switch_frequency = $('#switch_frequency').val();
        data.transition_effect = ll_combo_manager.get_selected_value('#transition_effect');
        data.play_restriction = $('input[name=play_restriction]:checked').val();
        data.max_individual_plays = data.play_restriction == 0 ? $('#max_individual_plays').val() : 0;
        data.max_group_plays = $('#max_group_plays').val();
        data.webview_success_action_type = $('input[name="webview_success_action_type"]:checked').val();
        data.webview_success_message = data.webview_success_action_type == 'message' ? $.trim($('#webview-success-message').val()) : '';
        data.webview_success_redirect_url = data.webview_success_action_type == 'redirect' ? $('input[name="webview_success_redirect_url"]').val() : '';
        data.activation_mode = $('.activation_mode_element').length ? $('input[name=activation_mode]:checked').val() : '';

        var screensaver_images = [];
        $('.screensaver-img .pb-image__icn').each(function () {
            screensaver_images.push( $(this).attr('src-img'));
        });
        data.screensaver_images = screensaver_images;

        return data;
    },
    collect_configuration_data: function(){
        var data = {};
        var ll_activation_identifier_id = ll_activation_builder.ll_activation_identifier_id;
        var identifier_alias = ll_activation_builder.ll_activation_identifier.ll_activation_identifier_alias;
        if(parseInt(ll_activation_identifier_id) && parseInt(ll_activation_identifier_id) in ll_activation_builder.ll_activation_identifiers) {
            var ll_activation_identifier_configuration = ll_activation_builder.ll_activation_identifier.ll_activation_identifier_configuration;
            var is_valid = [];
            $('.activation-configuration-elements [identifier]').each(function () {
                var $this = $(this);
                var identifier = $(this).attr('identifier');
                var type = $(this).attr('type');
                if(identifier in ll_activation_identifier_configuration){
                    var value = '';
                    switch (type) {
                        case 'text':
                            value = $this.find('input.txt-field').val();
                            break;
                        case 'textarea':
                            value = $this.find('textarea.txt-field').val();
                            break;
                        case 'number':
                            value = $this.find('input.txt-field').val();
                            if($this.is(':visible')) {
                                var min = typeof $this.find('input.txt-field').attr('min') != 'undefined' ? parseInt($this.find('input.txt-field').attr('min')) : 0;
                                var max = typeof $this.find('input.txt-field').attr('max') != 'undefined' ? parseInt($this.find('input.txt-field').attr('max')) : 0;
                                if (min && max) {
                                    if (parseInt(value) < min || parseInt(value) > max) {
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label + ' between ' + min + ' and ' + max);
                                    }
                                } else if (min) {
                                    if (parseInt(value) < min) {
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label + ' more than or equal ' + min);
                                    }
                                } else if (max) {
                                    if (parseInt(value) > max) {
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label + ' less than or equal ' + max);
                                    }
                                }
                            }
                            break;
                        case 'color':
                            value = $this.find('.color-box').attr('data-color-start');
                            break;
                        case 'image':
                            value = $this.find('input.img-url').val();
                            break;
                        case 'images':
                            value = [];
                            var idx = 1;
                            $this.find('.images .image').each(function () {
                                var imgFor = identifier_alias == "WHACK_IT" ? $(this).attr('imgFor') : 'img'+idx;
                                if(!$(this).hasClass('hide')) {
                                    value.push({
                                        imgFor: imgFor,
                                        url: $(this).find('.image__file img').attr('src'),
                                    });
                                    idx++;
                                }
                            });
                            break;
                        case 'radio':
                            value = $this.find('input[name=radio_'+identifier+']:checked').val();
                            break;
                        case 'checkbox':
                            value = $this.find('input[name=check_'+identifier+']').is(':checked') ? 1 : 0;
                            break;
                        case 'checkboxes':
                            value = {};
                            $this.find('input[type="checkbox"]').each(function () {
                                value[$(this).attr('identifier')] = $(this).is(':checked') ? 1 : 0;
                            });
                            break;
                        case 'select':
                            value = ll_combo_manager.get_selected_value($this.find('select'));
                            break;
                        case 'prizes_and_inventory':
                            value = [];
                            var probabilityCalculationMode = parseInt($('.configuration-item[identifier="probabilityCalculationMode"] input:checked').val());
                            $this.find('.line-inventory').each(function () {
                                var is_shared = $(this).find('.select_shared_prizes').length ? 1 : 0;
                                var ll_shared_prize_id = is_shared ? ll_combo_manager.get_selected_value($(this).find('.select_shared_prizes')) : 0;
                                var name = is_shared ? ll_combo_manager.get_selected_text($(this).find('.select_shared_prizes')) : $.trim($(this).find('input.field-inventory').val()) ;
                                var quantity = parseInt($(this).find('input.field-prize').val());
                                var consumed = parseInt($(this).find('input.field-prize').attr('consumed'));
                                var notifications_data = typeof $(this).attr('notifications-data') != 'undefined' ? $.parseJSON($(this).attr('notifications-data')) : {};
                                var custom_probability = parseInt($(this).find('input.custom_probability').val());
                                if( ((!is_shared && $.trim($(this).find('input.field-inventory').val())) || is_shared && parseInt(ll_shared_prize_id) )
                                       && $.trim($(this).find('input.icn-url').val()) && quantity >= consumed ){
                                    var prize_id = typeof $(this).attr('prize_id') != 'undefined' ? parseInt($(this).attr('prize_id')) : 0;
                                    if(probabilityCalculationMode == CUSTOM_PROBABILITY_MANUAL && custom_probability > 1000000000){
                                        //show_warning_message('Custom Probability should be less than or equal ' + 1000000000);
                                        $(this).addClass('container_with_errors');
                                    } else {
                                        value.push({
                                            id: prize_id,
                                            name: name,
                                            count: parseInt($(this).find('input.field-prize').val()),
                                            custom_probability: $(this).find('input.custom_probability').val(),
                                            bonus_spins: parseInt($(this).find('input.bonus_spins').val()),
                                            icon: $.trim($(this).find('input.icn-url').val()),
                                            is_star: $(this).find('.btn-star').hasClass('gold-star') ? 1 : 0,
                                            is_winning: $(this).find('.is_winning').is(':checked') ? 1 : 0,
                                            ll_shared_prize_id: ll_shared_prize_id,
                                            notifications_data: notifications_data
                                        });
                                    }
                                } else {
                                    $(this).addClass('container_with_errors');
                                }
                            });
                            if(value.length){
                                var prizes = $this.find('.inventory-prizes .line-inventory').length;
                                var invalid_prizes = $this.find('.inventory-prizes .line-inventory.container_with_errors').length;
                                var shared_prizes = $this.find('.shared_prizes .line-inventory').length;
                                var invalid_shared_prizes = $this.find('.shared_prizes .line-inventory.container_with_errors').length;

                                if(prizes == 1 && invalid_prizes == 1){
                                    $this.find('.inventory-prizes .line-inventory.container_with_errors').removeClass('container_with_errors');
                                }
                                if(shared_prizes == 1 && invalid_shared_prizes == 1){
                                    $this.find('.shared_prizes .line-inventory.container_with_errors').removeClass('container_with_errors');
                                }
                            }

                            break;
                        case 'object':
                        case 'objects':
                            value = [];
                            $this.find('.container-objects .line-object').each(function () {
                                var object_data = {};
                                $(this).find('.field-object').each(function () {
                                    switch ($(this).prop("tagName")) {
                                        case 'INPUT':
                                            if($.trim($(this).val())) {
                                                object_data[$(this).attr("object-identifier")] = $(this).val();
                                            } else {
                                                $(this).addClass('container_with_errors');
                                            }
                                            break;
                                    }
                                });
                                if(Object.keys(object_data).length) {
                                    value.push(object_data);
                                }
                            });
                            break;
                        case 'questions':
                            value = [];
                            var q = ''; var v = [];  var p = []; var r = 0 ;var s = 0; var a = '';
                            $this.find('.container-questions .line-question').each(function () {
                                q = $.trim($(this).find('input.field-question').val());
                                a = $.trim($(this).find('input.field-right-answer').val());
                                r = 0;
                                s = parseInt($(this).find('input.field-score').val());
                                v = []; p = [];
                                $(this).find('.answer-item').each(function (idx) {
                                    if ($.trim($(this).find('input.field-answer').val())) {
                                        v.push($.trim($(this).find('input.field-answer').val()));
                                    }
                                    if($(this).find('.btn-star').hasClass('gold-star')){
                                        r = idx;
                                    }
                                    p.push(parseInt($(this).find('input.field-points').val()));
                                });

                                if($(this).find('input.field-score').is(':visible') && !s){
                                    $(this).addClass('container_with_errors');
                                } else {
                                    var is_valid = true;
                                    var radio_score_type = $('.configuration-item[identifier=score_type] [name="radio_score_type"]:checked').val()
                                    if(!$.trim(q) || Object.keys(v).length != 4){
                                        is_valid = false;
                                    }
                                    if(!$.trim(a) && radio_score_type != 'survey'){
                                        is_valid = false;
                                    }
                                    if (is_valid) {
                                        value.push({q: q, a: a, r: r, s: s, v: v, p: p});
                                    } else {
                                        $(this).addClass('container_with_errors');
                                    }
                                }
                            });
                            break;
                    }
                    // -------------- Validation
                    if($this.hasClass('required')){
                        if(typeof value == 'undefined' || value == 'undefined' || value == null ){
                            is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label);
                        } else {
                            switch (type) {
                                case 'text':
                                case 'textarea':
                                case 'color':
                                case 'image':
                                case 'radio':
                                    if (!$.trim(value)) {
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label);
                                    }
                                    break;
                                case 'number':
                                    var min = typeof ll_activation_identifier_configuration[identifier].min != 'undefined' ? parseInt(ll_activation_identifier_configuration[identifier].min) : 0;
                                    var max = typeof ll_activation_identifier_configuration[identifier].max != 'undefined' ? parseInt(ll_activation_identifier_configuration[identifier].max) : 0;
                                    var length = typeof ll_activation_identifier_configuration[identifier].length != 'undefined' ? parseInt(ll_activation_identifier_configuration[identifier].length) : 0;

                                    if(!parseInt(value)){
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label);
                                    } else {
                                        if(min && max){
                                            if(parseInt(value) < min || parseInt(value) > max){
                                                is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label + ' between '+ min +' and '+ max);
                                            }
                                        } else if(min){
                                            if(parseInt(value) < min){
                                                is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label + ' more than or equal '+ min);
                                            }
                                        } else if(max){
                                            if(parseInt(value) > max){
                                                is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label + ' less than or equal '+ max);
                                            }
                                        }
                                    }
                                    break;
                                case 'checkbox':
                                case 'select':

                                    break;
                                case 'checkboxes':
                                    if (value == [] || !Object.keys(value).length || !(/[^0]/).exec(Object.values(value).join(""))) {
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label);
                                    }
                                    break;
                                case 'object':
                                case 'objects':
                                case 'questions':
                                    if (value == [] || !Object.keys(value).length) {
                                        is_valid[identifier] =(ll_activation_identifier_configuration[identifier].label);
                                    }
                                    break;
                                case 'prizes_and_inventory':
                                    if (value == [] || !Object.keys(value).length || Object.keys(value).length < 3) {
                                        is_valid[identifier] =(' at least three '+ll_activation_identifier_configuration[identifier].label+'. Please add more prizes.');
                                    }
                                    break;
                                case 'images':
                                    if (value == [] || !Object.keys(value).length) {
                                        is_valid[identifier] =(' at least one '+ll_activation_identifier_configuration[identifier].label.slice(0, -1)+'. Please add more images.');
                                    }
                                    break;
                            }
                        }
                    }
                    if(!(identifier in is_valid)){
                        data[identifier] = value;
                    }
                }
            });
            data['is_valid'] = is_valid;
        } else {
            return false;
        }
        data = ll_activation_builder.append_to_configuration_data(data);
        return data;
    },
    append_to_configuration_data: function(data){
        if(typeof data != 'undefined' && data) {
            if (ll_activation_builder.ll_activation_identifier) {
                switch (ll_activation_builder.ll_activation_identifier.ll_activation_identifier_alias) {
                    case 'WHACK_IT':
                        data['WhackOnly'] = 0;
                        if($('.configuration-item[identifier=level] input[name="radio_level"]:checked').val() == '2'){
                            $('.configuration-item[identifier=objects] .btn-star').each(function(index) {
                                if($(this).hasClass('gold-star')) {
                                    data['WhackOnly'] = index;
                                }
                            });
                        }
                        break;
                }
            }
        }
        return data;
    },
    validData:function(data){
        /*if(!parseInt(data.event_id)){
            show_error_message('Please select an Event');
            return false;
        }*/
        /*if(!parseInt(data.ll_activation_identifier_id)){
            show_error_message('Please choose activation');
            return false;
        }*/

        if($('.activation-configuration-elements .container_with_errors').length){
            show_error_message('An error occurred with the highlighted in red below. Please correct them before saving.');
            return false;
        }

        if($('.configuration-item[identifier="doneMessageShowFirstPrize"]').length && $('.configuration-item[identifier="showPrizesInLeft"]').length){
            var ll_shared_prizes_ids = [];
            $('.activation-configuration-elements .shared_prizes').find(".select_shared_prizes").each(function(){
               var ll_shared_prizes_id = ll_combo_manager.get_selected_value($(this));
                if(parseInt(ll_shared_prizes_id)) {
                    ll_shared_prizes_ids.push(ll_shared_prizes_id);
                }
            });
            if(Object.keys(ll_shared_prizes_ids).length != Object.keys($.unique(ll_shared_prizes_ids)).length){
                show_error_message("Identical shared prizes cannot be used. Make sure each shared prize is unique.");
                return false;
            }
        }

        if($('.configuration-item[identifier="score_threshold_quests"]').length && $('.configuration-item[identifier="score_threshold_quests"]').is(':visible')){
            if(parseInt($('.configuration-item[identifier="score_threshold_quests"] input').val()) < parseInt($('.configuration-item[identifier="score_threshold_quests"] input').attr('min'))){
                show_error_message("Bonus Score Threshold should be more than or equal " + parseInt($('.configuration-item[identifier="score_threshold_quests"] input').attr('min')));
                return false;
            }
            if(parseInt($('.configuration-item[identifier="score_threshold_quests"] input').val()) > $(".activation-configuration-elements .container-questions .line-question").length){
                show_error_message("Bonus Score Threshold should be less than or equal count of questions " + $(".activation-configuration-elements .container-questions .line-question").length);
                return false;
            }
        }

        if($('.configuration-item[identifier="right_threshold_quests"]').length && $('.configuration-item[identifier="right_threshold_quests"]').is(':visible')){
            if(parseInt($('.configuration-item[identifier="right_threshold_quests"] input').val()) < parseInt($('.configuration-item[identifier="right_threshold_quests"] input').attr('min'))){
                show_error_message("Right Threshold should be more than or equal " + parseInt($('.configuration-item[identifier="right_threshold_quests"] input').attr('min')));
                return false;
            }
            if(parseInt($('.configuration-item[identifier="right_threshold_quests"] input').val()) > $(".activation-configuration-elements .container-questions .line-question").length){
                show_error_message("Right Threshold should be less than or equal count of questions " + $(".activation-configuration-elements .container-questions .line-question").length);
                return false;
            }
        }

        if($('.configuration-item[identifier="doneMessageShowFirstPrize"]').length && $('.configuration-item[identifier="showPrizesInLeft"]').length){
            if(!$('.configuration-item[identifier="doneMessageShowFirstPrize"] input').is(':checked') && !$('.configuration-item[identifier="showPrizesInLeft"] input').is(':checked')){
                show_error_message("Enable either Display Prizes on the Left Side or Display Initial Prize Only ");
                return false;
            }
        }

        if(!ll_activation_builder.collected_configuration_data || ( typeof ll_activation_builder.collected_configuration_data.is_valid != 'undefined' && Object.keys(ll_activation_builder.collected_configuration_data.is_valid).length)){
            show_error_message('Activation requires '+ Object.values(ll_activation_builder.collected_configuration_data.is_valid).join(', '));
            return false;
        }

        var identifier = ll_activation_builder.ll_activation_identifier;
        if (typeof identifier != 'undefined' && identifier) {
            switch (identifier.ll_activation_identifier_alias) {
                case 'GUESS_WORD':
                        if(typeof configuration_data.words != 'undefined' && Object.keys(configuration_data.words).length < parseInt(configuration_data.games)){
                            show_error_message('You should add '+parseInt(configuration_data.games) + ' ' + (parseInt(configuration_data.games) == 1 ? 'word' : 'words') );
                            return false;
                        }
                    break;
                case 'MEMORY_MATCH':
                    var cardImagesLength = $('.configuration-item[identifier="cardImages"] .image').length;
                    if(cardImagesLength < 2){
                        show_error_message('You should add at least 2 cards' );
                        return false;
                    }
                    if(cardImagesLength > 40){
                        show_error_message('You cannot add more than 40 cards' );
                        return false;
                    }
                    break;
                case 'RACING':
                    var racersPhotosCount = parseInt($('.configuration-item[identifier="playersPhotos"]').attr('count'));
                    var racersPhotos = $('.configuration-item[identifier="playersPhotos"] .image').length;
                    if(racersPhotos != racersPhotosCount){
                        show_error_message('Count of Racers should be equal '+ racersPhotosCount);
                        return false;
                    }
                    break;
            }
        } else {
            show_error_message('Please choose activation');
            return false;
        }
        return true;
    },

    go_to_save: function(_callback, is_exit){
        var data = ll_activation_builder.collect_data();
        var is_valid = ll_activation_builder.validData(data);

        if(is_valid){
            if(parseInt(EVENTS_PERMISSION) && (typeof ll_activation_builder.activation.event_id == 'undefined' || !parseInt(ll_activation_builder.activation.event_id)) && parseInt(data.event_id)) {
                ll_confirm_popup_manager.open('Are you sure you want to associate your activation to this event? You will not be able to change it later.', function(){
                    ll_activation_builder.save(data, _callback, is_exit);
                });
            } else {
                ll_activation_builder.save(data, _callback, is_exit);
            }
        }
    },

    save: function(data, _callback, is_exit){

        data.action = 'save_builder_data';
        data.ll_activation_id = ll_activation_builder.ll_activation_id;
        data.is_exit = is_exit;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {

                    //show_success_message(response.message);

                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });
    },

    process_load_landing_pages: function (_callback){
        if (! ll_activation_builder.is_done_load_landing_pages) {
            ll_fade_manager.fade(true, 'load');
            var _data = {};
            _data['action'] = 'get_landing_pages';
            _data['active_only'] = 1;

            $.ajax( {
                type :"POST",
                dataType :"json",
                async :true,
                url: "ll-process.php",
                data: _data,
                cache :false,
                success : function(data) {
                    ll_fade_manager.fade(false);
                    if(data){
                        if(data.success == 1){
                            ll_activation_builder.is_done_load_landing_pages = true;
                            ll_activation_builder.landing_pages = data.landing_pages;

                            if (typeof _callback != 'undefined' && _callback) {
                                _callback.call ();
                            }
                        }
                    }
                },
                error: function(){
                    ll_fade_manager.fade(false);
                }
            });
        }
    },
};

$(document).ready(function () {

    ll_activation_builder.init();
    ll_activation_builder.resizeTabs();
    ll_activation_builder.colorBox();
    // $(".slider-box__html").on("click", function() {
    //     if (!$(".leadboard-code-editor .CodeMirror").length) ll_activation_builder.codeBox.init();
    // });

    ll_activation_builder.sliderGrid("twoGridGrid", [50]);
    ll_activation_builder.changeOptions();

});