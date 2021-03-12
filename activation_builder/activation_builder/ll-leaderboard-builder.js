/**
 * Created by Asmaa Ali on 31/12/2020.
 */
var ll_leaderboard_builder = {

    sliderGridTwo: {},
    ll_leaderboard_id: typeof ll_leaderboard_id != 'undefined' ? ll_leaderboard_id : 0,
    leaderboard: {},
    styleInfo: {},

    ll_activation_template_id: 0,

    ll_activations: {},
    ll_activation_have_points_factors: {},
    ll_events: {},

    is_points_factors_popup_loaded: false,
    points_factors_popup_done_callback: null,
    points_factors_popup_cancel_callback: null,

    points_factors_popup_main_asset_type: 0,
    points_factors_popup_main_asset_id: 0,

    points_factors_popup_asset_type: 0,
    points_factors_popup_asset_id: 0,

    init: function (){

        $('.sales-shortcut').hide();
        $('.intercom-launcher').hide();

        ll_combo_manager.make_combo('.custom-leaderboard-page select');

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
            ll_activation_templates.open_templates_popup(LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD, function (ll_activation_template) {
                if(typeof ll_activation_template != 'undefined' && ll_activation_template && typeof ll_activation_template.template_data != 'undefined') {
                    ll_leaderboard_builder.ll_activation_template_id = ll_activation_template.ll_activation_template_id;
                    ll_activation_templates.populate_leaderboard(ll_activation_template.template_data , true);
                }
            });
        });

        $('.save-activation-template').on('click', function(e){
            e.stopPropagation();
            ll_activation_templates.open_save_template_popup(ll_leaderboard_builder.ll_activation_template_id , LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD, function () {
                //ll_leaderboard_builder.ll_activation_template_id = 0;
            });
        });

        $('.reset-activation-template').on('click', function(e){
            e.stopPropagation();
            ll_activation_templates.reset_template( LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD, function () {
                ll_leaderboard_builder.ll_activation_template_id = 0;
                $(".settings-tpl.open").removeClass("open");
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
                    case 'leaderboard':
                        $('.settings-tpl').show();
                        break;
                }
            }

            ll_leaderboard_builder.ll_activation_template_id = 0;
            ll_leaderboard_builder.closePanelRight();
        });

        $('.header-leaderboard').on('click', '.btn-exit', function (e) {
            ll_popup_manager.open('#ll_popup_manage_confirm_exit_leaderboard');
        });

        $('#ll_popup_manage_confirm_register_exit_save_and_exit_leaderboard').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit_leaderboard');
            ll_leaderboard_builder.go_to_save(function(){
                window.location.href = 'manage-leaderboards.php';
            }, 1);
        });
        $('#ll_popup_manage_confirm_register_exit_cancel_leaderboard').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit_leaderboard');
        });
        $('#ll_popup_manage_confirm_register_exit_go_leaderboard').click(function(){
            ll_popup_manager.close('#ll_popup_manage_confirm_exit_leaderboard');
            window.location.href = 'manage-leaderboards.php';
        });

        $('.header-leaderboard').on('click', '.btn-save', function (e) {
            e.preventDefault();
            e.stopPropagation();
            $('.fb-save-panel').click();

            ll_leaderboard_builder.go_to_save(function(response){
                if(typeof response.ll_leaderboard != 'undefined' && response.ll_leaderboard){

                }
                show_success_message('Leaderboard saved successfully');
            }, 0);
        });

        $('.header-leaderboard').on('click', '#leaderboard-save-and-exit', function (e) {
            ll_leaderboard_builder.go_to_save(function(){
                window.location.href = 'manage-leaderboards.php';
            }, 1);
        });

        // Action
        $(".custom-leaderboard-page .leaderboard-points-thresholds").on("click", ".add-line-points-threshold", function() {
            ll_leaderboard_builder.addNewAction($(this).closest('.leaderboard-points-thresholds'));

        });
        $(".custom-leaderboard-page .leaderboard-points-thresholds").on("click", ".remove-line-points-threshold", function() {
            var $this = $(this);
            var $wrap = $(this).closest(".line-points-threshold");
            var points_threshold_id = typeof $wrap.attr('points_threshold_id') != 'undefined' ? parseInt($wrap.attr('points_threshold_id')) : 0;
            if(points_threshold_id){
                ll_leaderboards_manager.delete_points_threshold($wrap.attr('points_threshold_id'), function () {
                    ll_leaderboard_builder.removeAction($this);
                });
            } else {
                ll_leaderboard_builder.removeAction($this);
            }
        });
        $(".custom-leaderboard-page .leaderboard-points-thresholds").on("click", ".edit-line-points-threshold", function() {
            var $wrap = $(this).closest(".line-points-threshold");
            $wrap.addClass('edit-mode');
            $wrap.find('.field-points-threshold').removeAttr('readonly');

        });
        $(".custom-leaderboard-page .leaderboard-points-thresholds").on("click", ".save-line-points-threshold", function() {
            var $wrap = $(this).closest(".line-points-threshold");
            ll_leaderboards_manager.ll_leaderboard_id = ll_leaderboard_builder.ll_leaderboard_id;
            ll_leaderboards_manager.save_points_threshold($wrap.attr('points_threshold_id'), $wrap.find('.field-points-threshold').val(), function (points_threshold){
                if(typeof points_threshold != 'undefined' && points_threshold){
                    $wrap.attr('points_threshold_id', points_threshold.ll_leaderboard_points_threshold_id);
                    $wrap.find('.actions-line-points-threshold').attr('ll_asset_id', points_threshold.ll_leaderboard_points_threshold_id).show();
                    $wrap.removeClass('edit-mode');
                    $wrap.find('.field-points-threshold').attr('readonly','readonly');
                }
            });

        });
        $(".custom-leaderboard-page .leaderboard-points-thresholds").on("click", ".actions-line-points-threshold", function(e) {
            e.preventDefault();
            e.stopPropagation();
            if(parseInt($(this).attr('ll_asset_id'))){
                populate_fulfillment_actions_manager ($(this));
            } else {
                show_error_message("Please add a point threshold and save first before adding Fulfillment Actions");
            }
        });


        $(".custom-leaderboard-page .leaderboard-assets").on("click", ".add-line-asset", function() {
            ll_leaderboard_builder.addNewAsset($(this).closest('.leaderboard-assets').attr('asset-type'));

        });
        $(".custom-leaderboard-page .leaderboard-assets").on("click", ".remove-line-asset", function() {
            var $this = $(this);
            ll_leaderboard_builder.removeAsset($this);
        });
        $(".custom-leaderboard-page .leaderboard-assets").on("click", ".actions-line-asset", function(e) {
            e.preventDefault();
            e.stopPropagation();
            var leaderboard_assets = $(this).closest('.leaderboard-assets');
            var line_asset = $(this).closest('.line-asset');
            var ll_asset_type = leaderboard_assets.attr('asset-type');
            var ll_asset_id = ll_combo_manager.get_selected_value(line_asset.find('.ll_asset_id'));
            var lbl = 'Asset';
            switch (ll_asset_type){
                case LL_LEADERBOARD_ASSET_TYPE_ACTIVATION:
                    lbl = 'Activation';
                    break;
                case LL_LEADERBOARD_ASSET_TYPE_EVENT:
                    lbl = 'Event';
                    break;
            }
            if(parseInt(ll_asset_id) && parseInt(ll_asset_type)){
                ll_leaderboard_builder.points_factors_popup_main_asset_id = ll_asset_id;
                ll_leaderboard_builder.points_factors_popup_main_asset_type = ll_asset_type;
                ll_leaderboard_builder.open_points_factors_popup(ll_asset_type, ll_asset_id);
            } else {
                show_error_message("Please select an "+lbl+" before adding points");
            }
        });

    },

    init_content: function (){

        if(typeof ll_leaderboard_id != 'undefined' && ll_leaderboard_id){
            ll_leaderboard_builder.ll_leaderboard_id = ll_leaderboard_id;
        }

        ll_activation_templates.leaderboard_builder = ll_leaderboard_builder;

        if ($(".editor-text-leaderboard").length) {
            var tinymceOpts = {
                autoresize_min_height: 300,
                selector: "#leaderboard_html_editor",
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
                relative_urls: false,
                remove_script_host: false,
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
                        ll_leaderboard_builder.updateHTMLBlock(editor.id);
                    });
                    editor.on("blur", function(e) {
                        ll_leaderboard_builder.updateHTMLBlock(editor.id);
                    });
                    editor.on("keyup", function() {
                        ll_leaderboard_builder.updateHTMLBlock(editor.id);
                    });
                    editor.on("NodeChange", function() {
                        ll_leaderboard_builder.updateHTMLBlock(editor.id);
                    });
                    editor.on("ExecCommand", function() {
                        ll_leaderboard_builder.updateHTMLBlock(editor.id);
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

        $(".st-btn-upload-image-leaderboard").on("click", function() {
            var $box = $(this).parent();
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
                            ll_leaderboard_builder.addImage($box, img.url);
                        }
                    }
                }
            });
        });

        $('.screenshot_zoom-leaderboard').magnificPopup({
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

        $(".leadboard__html").live("click", function() {
            // typeSlide
            $(".right-panel-slide-leaderboard li, .right-panel-slide-leaderboard .tab-content").hide().removeClass('selected');
            $(".right-panel-slide-leaderboard li.leaderboard, .right-panel-slide-leaderboard .tab-content.leaderboard").show();
            $(".right-panel-slide-leaderboard li.leaderboard:first, .right-panel-slide-leaderboard .tab-content.leaderboard:first").addClass('selected');

            $(".right-panel-slide-leaderboard")
                .addClass("active")
                .show()
                .animate({ right: 0 }, 300);

            var $html = $(".leadboard__html .leadboard__help-column").length ? "" : $(".leadboard__html").html();
            ll_leaderboard_builder.editor_set_content('leaderboard_html_editor', $html);
        });

        $(".right-panel-slide__close-leaderboard").on("click", function(e) {
            e.stopPropagation();
            var right_panel = $(this).closest('.right-panel-slide-leaderboard');
            if(right_panel.find('.editor-text-leaderboard').length) {
                var _selector = 'leaderboard_html_editor';
                ll_leaderboard_builder.updateHTMLBlock(_selector);
            }
            ll_leaderboard_builder.closePanelRight();
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
                            ll_leaderboard_builder.addImage($(".slide-box__content-leaderboard .upload-logo"), img.url);
                        }
                    }
                }
            });

        });

        $(".leadboard__header-logo").on("click", ".leadboard__reset-header-logo", function(e) {
            e.stopPropagation();
            ll_leaderboard_builder.addImage($(".slide-box__content-leaderboard .upload-logo"), null);
        });

        $(".builder-leadboard-panels").on("click", ".st-unload-image__remove", function() {
            var $box = $(this).closest(".st-right__inner");
            ll_leaderboard_builder.addImage($box, null);
        });

        $(".slide-box__head-leaderboard").on("click", function() {
            var $this = $(this);
            if (!$this.hasClass("opened")) {
                $this.siblings(".slide-box__content-leaderboard:visible").slideToggle(function() {
                    $this.siblings(".slide-box__head-leaderboard.opened").removeClass("opened");
                });
            } else {
            }
            $this.toggleClass("opened");
            $this.next(".slide-box__content-leaderboard").slideToggle();
        });

        $(".st-input-css-leaderboard").change(function() {
            var $this = $(this);
            var val = $this.val();
            var result = val.match(/\b(auto)\b|\b[0-9]{1,}(px|\u0025)?/g);

            if (result != null) {
                if (+result) $this.val(result + "px");
                else $this.val(result);
            } else {
                $this.val("");
            }
            ll_leaderboard_builder.changeInputCss($this);
        });

        $(".select-type-bg-leaderboard").change(function() {
            var id = $(this).attr('id');
            var val = $(this).val();
            var $parent = $(this).closest(".st-bg");
            var $customBox = $parent.find(".custom-bg-box");
            var $freeImagesBox = $parent.find(".free-images-box-leaderboard");

            if (val === "0") {
                $customBox.show();
                $freeImagesBox.hide();
            } else if (val === "1") {
                $customBox.hide();
                $freeImagesBox.find(".btn-more-free-images-leaderboard > .txt-field").val("");
                $freeImagesBox.show();
                ll_leaderboard_builder.freeImages(1, "", false, $freeImagesBox);
            }
            ll_leaderboard_builder.updateStyleInfo(id, val);
        });

        $(".search-input-free-images-leaderboard > .txt-field").change(function() {
            var $parent = $(this).closest(".st-bg");
            var $freeImagesBox = $parent.find(".free-images-box-leaderboard");
            var $input = $(this);
            var val = $.trim($input.val());

            ll_leaderboard_builder.freeImages(1, val, false, $freeImagesBox);
        });

        $(".btn-more-free-images-leaderboard:not(.disabled)").on("click", function() {
            var $btn = $(this);
            var $parent = $(this).closest(".st-bg");
            var $freeImagesBox = $parent.find(".free-images-box-leaderboard");
            var pageCount = $btn.attr("data-page");
            var val = $.trim($freeImagesBox.find(".input-free-images-leaderboard").val());

            $btn.addClass("disabled");
            ll_leaderboard_builder.freeImages(pageCount, val, true, $freeImagesBox);
        });

        $(".list-free-images-leaderboard").on("click", ".list-free-images__item:not(.screensaver)", function() {
            var url = $(this).attr("data-url");
            var type = $(this)
                .closest(".free-images-box-leaderboard")
                .attr("type-action");
            if (type === "upload-bg-page") {
                $box = $(".custom-bg-box .upload-bg-page");
            } else if (type === "upload-bg-header") {
                $box = $(".custom-bg-box .upload-bg-header");
            } else if (type === "upload-bg-html") {
                $box = $(".custom-bg-box .upload-bg-html");
            } else {
                $box = $(".custom-bg-box .upload-bg-leaderboard");
            }
            ll_leaderboard_builder.addImage($box, url);
        });

        $("#previewLeaderboard, .leaderboard-tab").on( "click", ".btn-preview-leaderboard", function() {

            var $btn = $(".btn-preview-leaderboard");

            $btn.toggleClass("active");

            if ($btn.hasClass("active")) {
                ll_leaderboard_builder.getHTMLPreviewLeaderboard();
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
                ll_leaderboard_builder.updateStyleInfo('leaderboardAlingment', LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT);
            } else {
                $('.wrap-builder-leadboard .custom-content-settings').hide();
                $wrap.addClass("fullscreen");
                $parent.addClass("fullscreen");
                ll_leaderboard_builder.updateStyleInfo('leaderboardAlingment', $btn.attr('display-type'));
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
            ll_leaderboard_builder.updateStyleInfo('leaderboardAlingment', $btn.attr('display-type'));
        });

        ll_leaderboard_builder.colorBox();
        ll_leaderboard_builder.changeOptions();
        ll_leaderboard_builder.sliderGrid("twoGridGrid", [50]);
        ll_leaderboard_builder.sliderGrid("highlightedBgOpacity", [100]);
        ll_leaderboard_builder.sliderGrid("rowBgOpacity", [100]);

        //  Load
        ll_leaderboards_manager.load_assets = 1;
        ll_leaderboards_manager.load(ll_leaderboard_builder.ll_leaderboard_id, function(response){
            if(typeof response.ll_leaderboard != 'undefined' && response.ll_leaderboard) {
                ll_leaderboard_builder.leaderboard = JSON.parse(JSON.stringify(response.ll_leaderboard));
                ll_activation_templates.leaderboard = JSON.parse(JSON.stringify(response.ll_leaderboard));
                ll_leaderboard_builder.populate(ll_leaderboard_builder.leaderboard);
                ll_leaderboard_builder.is_builder_initiated = true;
            }
        });
    },

    editor_set_content: function(_selector, _content, _enfore_clear_undo){
        _enfore_clear_undo = (typeof _enfore_clear_undo == 'undefined') ? true : _enfore_clear_undo;
        var _editor = tinymce.get(_selector);
        if(_editor && ((typeof _editor.is_initiatlized != 'undefined' && _editor.is_initiatlized) || typeof _editor.initialized != 'undefined' && _editor.initialized)){
            _editor.setContent(_content);
            ll_leaderboard_builder.updateHTMLBlock(_selector);
            if(_enfore_clear_undo){
                _editor.undoManager.clear()
            }
        } else {
            window.setTimeout(function (){
                ll_leaderboard_builder.editor_set_content(_selector, _content, _enfore_clear_undo)
            }, 100);
        }
    },

    zoom_screenshot: function(src){
        $('.screenshot_zoom-leaderboard').css('display', 'inline-block').attr('href', src).html('<img src="'+ src +'" alt=""/>');
        $('.screenshot_zoom-leaderboard').trigger('click');
    },

    updateHTMLBlock: function(selector) {
        var html = tinymce.get(selector).getContent();
        var helpHTML = '<div class="leadboard__help-column">HTML</div>';
        var $wrapHTML = $(".leadboard__html");
        $.trim(html) && html.length > 61
            ? $wrapHTML.html(html)
            : $wrapHTML.html(helpHTML);
    },

    resizeTabs: function(){
        var tabsCount = $('.leaderboard-designer .tabs-pages li[id-form]:visible').length;
        var tabWidth = 100 / tabsCount;
        $('.leaderboard-designer .tabs-pages li[id-form]').css('width', tabWidth+'%');
    },

    colorBox: function() {
        $(".leaderboard-tab .color-box").each(function() {
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
                        ll_leaderboard_builder.updateColorElTpl(el, hex);
                    }
                })
                .css("background-color", "#" + color);
        });
    },

    updateColorElTpl: function(el, hex) {

        var id = $(el).attr("id");
        var color = hex != 'transparent' ? "#" + hex : 'transparent';
        var styleInfo = ll_leaderboard_builder.styleInfo;
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
            if(typeof styleInfo.highlightedBgOpacity != 'undefined'){
                color = ll_theme_manager.hex2rgba(color, styleInfo.highlightedBgOpacity);
            }
            $(".leadboard__content .highlighted").find('.list-leaders__name, .list-leaders__number, .list-leaders__count').css("background-color", color);
        } else if (id === "nameLeaderColor") {
            $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number').css("color", color);
        } else if (id === "scoreLeaderColor") {
            $(".list-leaders__item:not(.highlighted) .list-leaders__count").css("color", color);
        } else if (id === "highlightedNameLeaderColor") {
            $(".list-leaders__item.highlighted").find('.list-leaders__name, .list-leaders__number').css("color", color);
        } else if (id === "highlightedScoreLeaderColor") {
            $(".list-leaders__item.highlighted .list-leaders__count").css("color", color);
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
        ll_leaderboard_builder.updateStyleInfo(id, hex);
    },

    updateStyleInfo:function(key, val){
        ll_leaderboard_builder.styleInfo[key] = val;
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
            if(typeof styleInfo['rowMarginRight'] == 'undefined') styleInfo['rowMarginRight'] = '0';
            if(typeof styleInfo['rowMarginBottom'] == 'undefined') styleInfo['rowMarginBottom'] = '0';
            if(typeof styleInfo['rowPaddingLeft'] == 'undefined') styleInfo['rowPaddingLeft'] = '0';
            if(typeof styleInfo['rowPaddingRight'] == 'undefined') styleInfo['rowPaddingRight'] = '0';
            if(typeof styleInfo['scoreLeaderTextAlign'] == 'undefined') styleInfo['scoreLeaderTextAlign'] = 'left';
            //Remove
            for(var key in styleInfo){
                if($.trim(styleInfo[key]) && $.trim(styleInfo[key]) != 'undefined' && $.trim(styleInfo[key]) != 'null') {

                    if( key == 'leadboard_layout'){

                        ll_leaderboard_builder.sliderGrid("twoGridGrid", styleInfo[key]);
                        ll_leaderboard_builder.setGridSizeColumns($(ll_leaderboard_builder.sliderGridTwo["twoGridGrid"]), [styleInfo[key]]);

                        var widthLeftCol = parseInt(styleInfo[key]);
                        var widthRightCol = 100 - widthLeftCol;
                        $(".leadboard__column-left").css("width", widthLeftCol + "%");
                        $(".leadboard__column-right").css("width", widthRightCol + "%");

                    } else if ( key == 'leaderboardAlingment'){

                        $('.leaderboard-tab .display_leaderboard[display-type='+styleInfo[key]+']').trigger('click');

                    } else if( key == 'rowCheckTransparent'){
                        if(parseInt(styleInfo.rowCheckTransparent)){
                            ll_theme_manager.checkboxRadioButtons.check('.leaderboard-tab #rowCheckTransparent', true);
                        } else {
                            ll_theme_manager.checkboxRadioButtons.check('.leaderboard-tab #rowCheckTransparent', false);
                        }
                        $('.leaderboard-tab #rowCheckTransparent').change();
                    } else if( key == 'highlightedBgOpacity'){

                        ll_leaderboard_builder.sliderGrid("highlightedBgOpacity", styleInfo[key]);
                        ll_leaderboard_builder.setGridSizeColumns($(ll_leaderboard_builder.sliderGridTwo["highlightedBgOpacity"]), [styleInfo[key]]);

                    } else if( key == 'rowBgOpacity'){

                        ll_leaderboard_builder.sliderGrid("rowBgOpacity", styleInfo[key]);
                        ll_leaderboard_builder.setGridSizeColumns($(ll_leaderboard_builder.sliderGridTwo["rowBgOpacity"]), [styleInfo[key]]);

                    } else if ($('.leaderboard-tab #' + key).length) {
                        switch ($('.leaderboard-tab #' + key).prop("tagName")) {
                            case 'INPUT':
                                $('.leaderboard-tab #' + key).val(styleInfo[key]);
                                $('.leaderboard-tab #' + key).trigger('change');
                                break;
                            case 'SELECT':
                                ll_combo_manager.set_selected_value($('.leaderboard-tab #' + key), styleInfo[key]);
                                $('.leaderboard-tab #' + key).trigger('change');
                                break;
                            case 'DIV':
                                if ($('.leaderboard-tab #' + key).hasClass('color-box')) {
                                    if( styleInfo[key] == 'transparent'){
                                        $('.leaderboard-tab #' + key).css("background-color", "transparent");
                                    } else {
                                        $('.leaderboard-tab #' + key).colpickSetColor("#" + styleInfo[key], true).css("background-color", "#" + styleInfo[key]);
                                    }
                                    ll_leaderboard_builder.updateColorElTpl($('.leaderboard-tab #' + key), styleInfo[key]);
                                }
                                break;
                        }
                    } else if ($('.leaderboard-tab .' + key).length) {
                        var element = $('.' + key);
                        if (element.hasClass('upload-logo') ||
                            element.hasClass('upload-bg-page') ||
                            element.hasClass('upload-bg-header') ||
                            element.hasClass('upload-bg-html') ||
                            element.hasClass('upload-bg-leaderboard')) { // Image
                            ll_leaderboard_builder.addImage($(".leaderboard-tab ." + key), styleInfo[key]);
                        }
                    }
                }
            }
        }
    },

    getHTMLPreviewLeaderboard: function() {
        var HTML = $(".builder-leadboard").html();
        var $preview = $("#previewLeaderboard");
        $preview
            .append(HTML)
            .find(".leadboard__help-column")
            .remove();
    },

    sliderGrid: function(id, values) {
        var slider = ll_leaderboard_builder.sliderGridTwo[id];

        if (typeof slider != 'undefined' && slider !== null) slider.noUiSlider.destroy();

        var slider = document.getElementById(id);
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
            ll_leaderboard_builder.setGridSizeColumns($(this.target), values);
        });
        slider.noUiSlider.on("change", function(values, handle) {
            var widthLeftCol = parseInt(values[0]);
            var widthRightCol = 100 - widthLeftCol;

            switch (id){
                case 'twoGridGrid':
                    $(".leadboard__column-left").css("width", widthLeftCol + "%");
                    $(".leadboard__column-right").css("width", widthRightCol + "%");
                    ll_leaderboard_builder.updateStyleInfo('leadboard_layout', values[0]);
                    break;
                case 'highlightedBgOpacity':
                    var styleInfo = ll_leaderboard_builder.styleInfo;
                    ll_leaderboard_builder.updateStyleInfo(id, values[0]);
                    ll_leaderboard_builder.updateColorElTpl($('#highlightedLeaderboardBg'), styleInfo.highlightedLeaderboardBg);
                    break;
                case 'rowBgOpacity':
                    var styleInfo = ll_leaderboard_builder.styleInfo;
                    ll_leaderboard_builder.updateStyleInfo(id, values[0]);
                    ll_leaderboard_builder.updateColorElTpl($('#rowBg'), styleInfo.rowBg);
                    break;
                default:
                    break;
            }
        });
        ll_leaderboard_builder.sliderGridTwo[id] = slider;
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

    addImage: function($box, url) {
        ll_leaderboard_builder.updateImageTpl($box, url);
    },

    getImageName: function(url) {
        var split = url.split("/");
        split = split[split.length - 1];
        return split;
    },

    updateImageTpl($box, url) {
        var type = null;
        var name = "";
        var $boxBuilder = null;

        if ($box.hasClass("upload-logo")) {
            $boxBuilder = $(".slide-box__content-leaderboard .upload-logo");
            type = "upload-logo";
        } else if ($box.hasClass("upload-bg-header")) {
            $boxBuilder = $(".slide-box__content-leaderboard .upload-bg-header");
            type = "upload-bg-header";
        } else if ($box.hasClass("upload-bg-page")) {
            $boxBuilder = $(".slide-box__content-leaderboard .upload-bg-page");
            type = "upload-bg-page";
        } else if ($box.hasClass("upload-bg-html")) {
            $boxBuilder = $(".slide-box__content-leaderboard .upload-bg-html");
            type = "upload-bg-html";
        } else {
            $boxBuilder = $(".slide-box__content-leaderboard .upload-bg-leaderboard");
            type = "upload-bg-leaderboard";
        }

        if (url !== null && url != 'none') name = ll_leaderboard_builder.getImageName(url);

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
        ll_leaderboard_builder.updateTplImage(type, url);
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
            } else if (type === "upload-bg-html") {
                $box = $(".leadboard__html");
            } else {
                $box = $(".leadboard__content");
            }

            if (url === null || url == 'none') {
                $box.css("background-image", "");
            } else {
                $box.css("background-image", "url('" + url + "')");
            }
        }
        ll_leaderboard_builder.updateStyleInfo(type, url);
    },

    closePanelRight: function() {
        $(".right-panel-slide-leaderboard.active")
            .removeClass("active")
            .hide()
            .animate({ right: "-600px" }, 300);
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
        }
        ll_leaderboard_builder.updateStyleInfo(id, val);
    },

    freeImages: function(page, searchValue, isMoreLoad, $box) {
        var parent = $box;
        page = page || 1;
        var url =
            "https://api.unsplash.com/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" +
            page;
        var isSearch = false;
        searchValue = $.trim(searchValue);
        var $btn = $box.find(".btn-more-free-images-leaderboard");
        var $list = $box.find(".list-free-images-leaderboard > ul");

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

            $.each(data, function(key, val) {
                var imgURL = val.urls.regular;
                items +=
                    "<li class='list-free-images__item' id='" +
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
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#titleFontSize").change(function() {
            var val = $(this).val();
            $title.css("font-size", val + "px");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#titleFontWeight").change(function() {
            var val = $(this).val();
            $title.css("font-weight", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#titleLineHeight").change(function() {
            var val = $(this).val();
            $title.css("line-height", val + "%");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
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
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#leaderboardCountItem").change(function() {
            var val = $(this).val();
            var $items = $(".list-leaders__item");
            //$(".leadboard__content").attr("totalItems", val);

            if (val === "10") {
                $items.each(function(index) {
                    if (index > 9) $(this).addClass("hide");
                });
            } else {
                $items.removeClass("hide");
            }

            if(val === "custom"){
                $('.custom_quantity_of_leaders').show();
            } else {
                $('.custom_quantity_of_leaders').hide();
            }
            //ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#leaderboardHighlightedCountItem").change(function() {

            var val = parseInt($(this).val());
            var $items = $(".list-leaders__item");

            $items.removeClass('highlighted');
            ll_leaderboard_builder.removeHighlightedStyles();
            if(val){
                $('.highlighted-styles').show();
                $items.each(function(index) {
                    if (index < val) $(this).addClass("highlighted");
                });
                ll_leaderboard_builder.applyHighlightedStyles();
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

        $("#rowPrefix").change(function() {
            var prefix = $(this).val();
            var postfix = $("#rowPostfix").val();
            if (!ll_leaderboard_builder.is_valid_prefix_postfix()) return;

            $(".list-leaders .list-leaders__item").each(function(index) {
                var result = $(this).find('.list-leaders__count').attr('result');
                $(this).find('.list-leaders__count').text(prefix + result + postfix);
            });
        });

        $("#rowPostfix").change(function() {
            var prefix = $("#rowPrefix").val();
            var postfix = $(this).val();
            if (!ll_leaderboard_builder.is_valid_prefix_postfix()) return;

            $(".list-leaders .list-leaders__item").each(function(index) {
                var result = $(this).find('.list-leaders__count').attr('result');
                $(this).find('.list-leaders__count').text(prefix + result + postfix);
            });
        });

        $('#rowCheckTransparent').on('change', function () {
            var val = 0;
            var styleInfo = ll_leaderboard_builder.styleInfo;

            if($(this).is(':checked')){
                val = 1;

                $('.list-leaders__item:not(.highlighted)').find('.list-leaders__number, .list-leaders__name, .list-leaders__count').css('background-color', 'transparent');
                ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
            } else {

                ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
                ll_leaderboard_builder.updateColorElTpl($('#rowBg'), styleInfo.rowBg);
            }
        });
        $('#rowBgOpacity').on('change', function () {
            var val = $(this).val();
            var styleInfo = ll_leaderboard_builder.styleInfo;

            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
            ll_leaderboard_builder.updateColorElTpl($('#rowBg'), styleInfo.rowBg);
        });
        $("#rowBorderType").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number,  .list-leaders__count');
            $leaders.css("border-style", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowBorderWidth").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number,  .list-leaders__count');
            $leaders.css("border-width", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowMarginRight").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number');
            $leaders.css("margin-right", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowMarginBottom").change(function() {
            var val = $(this).val();
            var $leadersRow = $(".list-leaders__item");
            $leadersRow.css("margin-bottom", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowPaddingLeft").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number, .list-leaders__count');
            $leaders.css("padding-left", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#rowPaddingRight").change(function() {
            var val = $(this).val();
            var $leaders = $(".list-leaders__item").find('.list-leaders__name, .list-leaders__number, .list-leaders__count');
            $leaders.css("padding-right", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#nameLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameTypeFace", val + ", sans-serif");
            $leadersName.css("font-family", val + ", sans-serif");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#nameLeaderFontSize").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameFontSize", val + "px");
            $leadersName.css("font-size", val + "px");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#nameLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameFontWeight", val);
            $leadersName.css("font-weight", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#nameLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $leadersName = $(".list-leaders__item:not(.highlighted)").find('.list-leaders__name, .list-leaders__number');
            //$(".leadboard__content").attr("nameLineHeight", val + "%");
            $leadersName.css("line-height", val + "%");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#scoreLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreTypeFace", val + ", sans-serif");
            $leadersScore.css("font-family", val + ", sans-serif");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderFontSize").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontSize", val + "px");
            $leadersScore.css("font-size", val + "px");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontWeight", val);
            $leadersScore.css("font-weight", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item:not(.highlighted) .list-leaders__count");
            //$(".leadboard__content").attr("scoreLineHeight", val + "%");
            $leadersScore.css("line-height", val + "%");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#scoreLeaderTextAlign").change(function() {
            var val = $(this).val();
            var $leadersScore = $(".list-leaders__item .list-leaders__count");
            $leadersScore.css("text-align", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });

        // ---------- Highlighted
        $("#highlightedNameLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameTypeFace", val + ", sans-serif");
            $highlightedLeadersName.css("font-family", val + ", sans-serif");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedNameLeaderFontSize").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameFontSize", val + "px");
            $highlightedLeadersName.css("font-size", val + "px");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedNameLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameFontWeight", val);
            $highlightedLeadersName.css("font-weight", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedNameLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersName = $(".list-leaders__item.highlighted").find('.list-leaders__number, .list-leaders__name');
            //$(".leadboard__content").attr("nameLineHeight", val + "%");
            $highlightedLeadersName.css("line-height", val + "%");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });

        $("#highlightedScoreLeaderTypeFace").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");

            //$(".leadboard__content").attr("scoreTypeFace", val + ", sans-serif");
            $highlightedLeadersScore.css("font-family", val + ", sans-serif");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedScoreLeaderFontSize").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontSize", val + "px");
            $highlightedLeadersScore.css("font-size", val + "px");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedScoreLeaderFontWeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");
            //$(".leadboard__content").attr("scoreFontWeight", val);
            $highlightedLeadersScore.css("font-weight", val);
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
        $("#highlightedScoreLeaderLineHeight").change(function() {
            var val = $(this).val();
            var $highlightedLeadersScore = $(".list-leaders__item.highlighted .list-leaders__count");
            //$(".leadboard__content").attr("scoreLineHeight", val + "%");
            $highlightedLeadersScore.css("line-height", val + "%");
            ll_leaderboard_builder.updateStyleInfo($(this).attr('id'), val);
        });
    },

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

        ll_leaderboard_builder.updateColorElTpl($('#highlightedLeaderboardBg'), $('#highlightedLeaderboardBg').attr('data-color-start'));
    },

    removeHighlightedStyles: function(){

        // $(".leadboard__content .list-leaders__item").css("background-color", 'unset');
        $(".leadboard__content .list-leaders__name").css("color", '#'+$('#nameLeaderColor').attr('data-color-start'));
        $(".leadboard__content .list-leaders__count").css("color", '#'+$('#scoreLeaderColor').attr('data-color-start'));

        ll_leaderboard_builder.updateColorElTpl($('#rowBg'), $('#rowBg').attr('data-color-start'));

        $("#nameLeaderTypeFace").change();
        $("#nameLeaderFontSize").change();
        $("#nameLeaderFontWeight").change();
        $("#nameLeaderLineHeight").change();

        $("#scoreLeaderTypeFace").change();
        $("#scoreLeaderFontSize").change();
        $("#scoreLeaderFontWeight").change();
        $("#scoreLeaderLineHeight").change();
    },

    // ------

    addNewAction: function($wrap, data) {
        var html =
            '<div class="line-points-threshold edit-mode" points_threshold_id="0">' +
            '   <div class="add-line-points-threshold"></div>' +
            '   <div class="remove-line-points-threshold"></div>' +
            '   <input type="number" class="txt-field field-points-threshold" placeholder="Point Threshold"> ' +
            '   <a class="icn save-line-points-threshold ll_std_tooltip" title="Save"><img src="imgs/svg/icn-save.svg"></a>'+
            '   <a class="icn edit-line-points-threshold ll_std_tooltip" title="Edit"><img src="imgs/svgs/icn-edit.svg"></a>'+
            '   <a class="icn actions-line-points-threshold ll_std_tooltip" title="Actions" style="display: none;" ll_asset_id="0" ll_asset_type="' + LL_COMPLETION_ACTIONS_ASSET_TYPE_LEADERBOARD_POINTS_THRESHOLD + '" ll_activity_type="' + LL_COMPLETION_ACTIONS_ACTIVITY_TYPE_LEADERBOARD_POINTS_THRESHOLD_GET + '"><img src="imgs/svg/icn_settings.svg"></a>'+
            '</div>';
        $wrap.append(html);

        if(typeof data != 'undefined' && data) {

            var $line_points_threshold = $($wrap).find('.line-points-threshold:last');
            if (typeof data.ll_leaderboard_points_threshold_id != 'undefined' && data.ll_leaderboard_points_threshold_id) {
                $line_points_threshold.removeClass('edit-mode');
                $line_points_threshold.find('.field-points-threshold').attr('readonly','readonly');
                $line_points_threshold.attr('points_threshold_id', data.ll_leaderboard_points_threshold_id);
                $line_points_threshold.removeClass('edit-mode');
                $line_points_threshold.find('.actions-line-points-threshold').attr('ll_asset_id', data.ll_leaderboard_points_threshold_id).show();
            }
            if (typeof data.points_threshold != 'undefined' && data.points_threshold) {
                $line_points_threshold.find('.field-points-threshold').val(data.points_threshold);
            }

        }
        ll_leaderboard_builder.isRemoveAction($wrap);
        apply_ll_tooltip($wrap);
    },

    isRemoveAction: function($wrap) {
        var count = $wrap.find(".line-points-threshold").length;
        count > 1 ? $wrap.removeClass("no-remove") : $wrap.addClass("no-remove");
    },

    removeAction: function($this) {
        var $wrap = $this.closest(".leaderboard-points-thresholds");
        $this.closest(".line-points-threshold").remove();
        ll_leaderboard_builder.isRemoveAction($wrap);
    },

    // ------

    populate: function(ll_leaderboard){
        if(typeof ll_leaderboard != 'undefined' && ll_leaderboard){

            $('.builder-leadboard-panels #headerTitle').val(ll_leaderboard.ll_leaderboard_title);
            $('.builder-leadboard-panels #rowPrefix').val(ll_leaderboard.ll_leaderboard_result_prefix);
            $('.builder-leadboard-panels #rowPostfix').val(ll_leaderboard.ll_leaderboard_result_postfix);
            $('#rowPrefix').change();

            $(".leadboard__header h2").text(ll_leaderboard.ll_leaderboard_title);

            ll_leaderboard.ll_leaderboard_html = $.trim(ll_leaderboard.ll_leaderboard_html) ? ll_leaderboard.ll_leaderboard_html : '';

            var helpHTML = '<div class="leadboard__help-column">HTML</div>';
            var $box = $(".leadboard__html");
            $.trim(ll_leaderboard.ll_leaderboard_html)  ? $box.html(ll_leaderboard.ll_leaderboard_html) : $box.html(helpHTML)  ;

            if(parseInt(ll_leaderboard.ll_leaderboard_leaders_count) && ll_leaderboard.ll_leaderboard_leaders_count != '10' && ll_leaderboard.ll_leaderboard_leaders_count != '20'){
                ll_combo_manager.set_selected_value('#leaderboardCountItem', 'custom' );
                $('#customLeaderboardCountItem').val(ll_leaderboard.ll_leaderboard_leaders_count);
            } else {
                ll_combo_manager.set_selected_value('#leaderboardCountItem', ll_leaderboard.ll_leaderboard_leaders_count );
            }

            ll_combo_manager.set_selected_value('#leaderboardHighlightedCountItem', ll_leaderboard.ll_leaderboard_highlighted_leaders_count );
            ll_combo_manager.set_selected_value('#leaderboardAssignMode', ll_leaderboard.assign_mode );

            $('#leaderboardCountItem').change();
            $('#leaderboardHighlightedCountItem').change();

            if(parseInt(ll_leaderboard.ll_leaderboard_display_full_name)){
                ll_theme_manager.checkboxRadioButtons.check('#DisplayFullName', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#DisplayFullName', false);
            }
            if(parseInt(ll_leaderboard.only_consider_known_prospects)){
                ll_theme_manager.checkboxRadioButtons.check('#onlyConsiderKnownProspects', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#onlyConsiderKnownProspects', false);
            }
            $('#DisplayFullName').change();

            // --- Assets
            if(typeof ll_leaderboard.assets !='undefined' && Object.keys(ll_leaderboard.assets).length){
                for(var i in ll_leaderboard.assets){
                    ll_leaderboard_builder.addNewAsset(ll_leaderboard.assets[i].ll_asset_type, ll_leaderboard.assets[i]);
                }
            }

            $('.custom-leaderboard-page .leaderboard-assets').each(function (){
                var $asset_type = $(this).attr('asset-type');
                if($asset_type != 'undefied' && parseInt($asset_type) && $(this).find('.line-asset')){
                    ll_leaderboard_builder.addNewAsset($asset_type);
                }
            });

            // --- Points Thresholds
            if(typeof ll_leaderboard.points_thresholds !='undefined' && Object.keys(ll_leaderboard.points_thresholds).length){
                for(var points_threshold_id in ll_leaderboard.points_thresholds){
                    ll_leaderboard_builder.addNewAction($('.leaderboard-points-thresholds'), ll_leaderboard.points_thresholds[points_threshold_id]);
                }
            } else {
                ll_leaderboard_builder.addNewAction($('.leaderboard-points-thresholds'));
            }
            // --- Style
            if(typeof ll_leaderboard.ll_leaderboard_style_info != 'undefined' && ll_leaderboard.ll_leaderboard_style_info && Object.keys(ll_leaderboard.ll_leaderboard_style_info).length){
                ll_leaderboard_builder.styleInfo = ll_leaderboard.ll_leaderboard_style_info;
                ll_leaderboard_builder.populateStyleInfo(ll_leaderboard.ll_leaderboard_style_info);
            }
        }
    },

    collect_data: function(){

        var data = {};
        data.ll_leaderboard_title = $('.builder-leadboard-panels #headerTitle').val();
        data.ll_leaderboard_html = $(".leadboard__html .leadboard__help-column").length ? "" : $(".leadboard__html").html();
        data.ll_leaderboard_leaders_count = ll_combo_manager.get_selected_value('#leaderboardCountItem');
        if(data.ll_leaderboard_leaders_count == 'custom'){
            data.ll_leaderboard_leaders_count = $('#customLeaderboardCountItem').val();
        }
        data.ll_leaderboard_highlighted_leaders_count = ll_combo_manager.get_selected_value('#leaderboardHighlightedCountItem');
        data.ll_leaderboard_display_full_name = $('#DisplayFullName').is(':checked') ? 1 : 0;
        data.ll_leaderboard_result_prefix = $('.builder-leadboard-panels #rowPrefix').val();
        data.ll_leaderboard_result_postfix = $('.builder-leadboard-panels #rowPostfix').val();
        data.ll_leaderboard_style_info = ll_leaderboard_builder.styleInfo;
        data.assign_mode = ll_combo_manager.get_selected_value('#leaderboardAssignMode');
        data.only_consider_known_prospects = $('#onlyConsiderKnownProspects').is(':checked') ? 1 : 0;
        // ----- Assets
        data.assets = {};
        if($('.custom-leaderboard-page .leaderboard-assets').length){
            $('.custom-leaderboard-page .leaderboard-assets').each(function (){
                var assets = $(this);
                var asset_type = $(this).attr('asset-type');
                if(asset_type != 'undefined' && parseInt(asset_type)){
                    data.assets[asset_type] = [];
                    assets.find('.line-asset').each(function () {
                        var ll_asset_id = ll_combo_manager.get_selected_value($(this).find('.ll_asset_id'));
                        if(ll_asset_id != 'undefined' && parseInt(ll_asset_id)) {
                            data.assets[asset_type].push(ll_combo_manager.get_selected_value($(this).find('.ll_asset_id')));
                        }
                    });
                }
            });
        }

        return data;
    },

    is_valid_prefix_postfix: function() {
        var prefix = $('.builder-leadboard-panels #rowPrefix').val();
        var postfix = $('.builder-leadboard-panels #rowPostfix').val();
        var concat = prefix + postfix;
        if(concat.length > 8){
            show_error_message('Prefix and Postfix combined must be less than 9 characters, numbers, or white spaces.');
            return false;
        }
        return true;
    },

    validData:function(data){

        if(ll_combo_manager.get_selected_value('#leaderboardCountItem') == 'custom' && !parseInt(data.ll_leaderboard_leaders_count)){
            show_error_message("Please enter quantity of leaders");
            return false;
        }

        if (!ll_leaderboard_builder.is_valid_prefix_postfix()) return false;

        return true;
    },

    go_to_save: function(_callback, is_exit){
        var data = ll_leaderboard_builder.collect_data();
        var is_valid = ll_leaderboard_builder.validData(data);

        if(is_valid){
            ll_leaderboard_builder.save(data, _callback, is_exit);
        }
    },

    save: function(data, _callback, is_exit){
        data.action = 'save_builder_data';
        data.ll_leaderboard_id = ll_leaderboard_builder.ll_leaderboard_id;
        data.is_exit = is_exit;
        $.ajax({
            url: 'll-leaderboards-process.php',
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

    // ---------- Points Factors

    open_points_factors_popup: function (asset_type, asset_id, done_callback, _cancel_callback){

        ll_leaderboard_builder.points_factors_popup_done_callback = null;
        ll_leaderboard_builder.points_factors_popup_cancel_callback = null;

        if(typeof asset_id != 'undefined' && asset_id){
            ll_leaderboard_builder.points_factors_popup_asset_id = asset_id;
        }
        if(typeof asset_type != 'undefined' && asset_type){
            ll_leaderboard_builder.points_factors_popup_asset_type = asset_type;
        }
        if(typeof done_callback != 'undefined' && done_callback){
            ll_leaderboard_builder.points_factors_popup_done_callback = done_callback;
        }
        if(typeof _cancel_callback != 'undefined' && _cancel_callback){
            ll_leaderboard_builder.points_factors_popup_cancel_callback = _cancel_callback;
        }
        if(!ll_leaderboard_builder.is_points_factors_popup_loaded){

            var _html = '';
            _html += '<div class="ll-popup" id="leaderboard-points-factors-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Points';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="scrollbar-inner">';
            _html += '		    <div class="points-factors-content">';

            _html += '  	    </div>';
            _html += '  	</div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_leaderboard_points_factors_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_leaderboard_points_factors_popup">Save</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);

            $('#leaderboard-points-factors-popup .scrollbar-inner').scrollbar();

            $('#leaderboard-points-factors-popup .btn_save_leaderboard_points_factors_popup').click(function (){
                switch (parseInt(ll_leaderboard_builder.points_factors_popup_asset_type)){
                    case LL_LEADERBOARD_ASSET_TYPE_ACTIVATION:
                        ll_leaderboard_builder.save_points_info(ll_leaderboard_builder.points_factors_popup_asset_id, LL_LEADERBOARD_ASSET_TYPE_ACTIVATION, function (){
                            ll_popup_manager.close('#leaderboard-points-factors-popup');
                            if(ll_leaderboard_builder.points_factors_popup_done_callback){
                                ll_leaderboard_builder.points_factors_popup_done_callback();
                            }
                        });
                        break;
                    case LL_LEADERBOARD_ASSET_TYPE_EVENT:
                        ll_popup_manager.close('#leaderboard-points-factors-popup');
                        if(ll_leaderboard_builder.points_factors_popup_done_callback){
                            ll_leaderboard_builder.points_factors_popup_done_callback();
                        }
                        break;
                }
            });

            $('#leaderboard-points-factors-popup .btn_cancel_leaderboard_points_factors_popup').click(function (){
                ll_popup_manager.close('#leaderboard-points-factors-popup');
                if(ll_leaderboard_builder.points_factors_popup_cancel_callback){
                    ll_leaderboard_builder.points_factors_popup_cancel_callback();
                }
            });

            $('#leaderboard-points-factors-popup .points-factors-content').on('click', '.actions-activation-asset', function(e){
                e.stopPropagation();
                var activation_id = $(this).closest('.ll-line-field').attr('activation_id');
                if(parseInt(activation_id)) {
                    ll_popup_manager.close('#leaderboard-points-factors-popup');
                    ll_leaderboard_builder.open_points_factors_popup(LL_LEADERBOARD_ASSET_TYPE_ACTIVATION, activation_id, function (){
                        ll_popup_manager.close('#leaderboard-points-factors-popup');
                        ll_leaderboard_builder.open_points_factors_popup(LL_LEADERBOARD_ASSET_TYPE_EVENT, ll_leaderboard_builder.points_factors_popup_main_asset_id);
                    }, function (){
                        ll_popup_manager.close('#leaderboard-points-factors-popup');
                        ll_leaderboard_builder.open_points_factors_popup(LL_LEADERBOARD_ASSET_TYPE_EVENT, ll_leaderboard_builder.points_factors_popup_main_asset_id);
                    });
                } else {
                    show_error_message('Invalid activation');
                }
            });


            ll_leaderboard_builder.is_points_factors_popup_loaded = true;
        }

        ll_leaderboard_builder.populate_points_factors_data(asset_type, asset_id,function () {
            ll_popup_manager.open('#leaderboard-points-factors-popup');

        });
    },

    populate_points_factors_data: function (asset_type, asset_id, _callback) {

        if(typeof asset_type != 'undefined' && parseInt(asset_type) && typeof asset_id != 'undefined' && parseInt(asset_id)) {

            $('#leaderboard-points-factors-popup .points-factors-content').removeClass('points activations').html('');

            ll_leaderboard_builder.load_points_factors_data(asset_type, asset_id, function (response) {

                switch (parseInt(asset_type)){
                    case LL_LEADERBOARD_ASSET_TYPE_ACTIVATION:
                        ll_popup_manager.set_title('#leaderboard-points-factors-popup','Points');
                        $('#leaderboard-points-factors-popup .points-factors-content').addClass('points');
                        ll_leaderboard_builder.populate_points_info(asset_type, asset_id, response);
                        break;
                    case LL_LEADERBOARD_ASSET_TYPE_EVENT:
                        ll_popup_manager.set_title('#leaderboard-points-factors-popup','Activations');
                        $('#leaderboard-points-factors-popup .points-factors-content').addClass('activations');
                        ll_leaderboard_builder.populate_activations_info(asset_type, asset_id, response);
                        break;
                }

                apply_ll_tooltip($('#leaderboard-points-factors-popup'));

                if(typeof _callback != 'undefined' && _callback){
                    _callback();
                }
            });
        } else {
            show_error_message('Invalid Data');
        }
    },

    load_points_factors_data: function (asset_type, asset_id, _callback){

        var data = {};
        data.action = 'load_points_factors_data';
        data.asset_type = asset_type;
        data.asset_id = asset_id;

        $.ajax({
            url: 'll-leaderboards-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    if(typeof _callback != 'undefined' && _callback){
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

    populate_points_info: function (asset_type, asset_id, data){

        var html = '';
        if(typeof data.points_info != 'undefined' && Object.keys(data.points_info).length) {
             for (var i in data.points_info){
                 html += '<div class="t-field ll-line-field" points_info_id="'+data.points_info[i].ll_activation_result_points_info_id+'">';
                 html += '    <div class="label ll_std_tooltip" title="'+data.points_info[i].tooltip+'"><label>'+data.points_info[i].name+'</label></div>';
                 html += '    <input type="text" class="txt-field points-val" value="'+data.points_info[i].default_value+'">';
                 html += '</div>';
             }
            $('#leaderboard-points-factors-popup .points-factors-content').append(html);
            apply_ll_tooltip('#leaderboard-points-factors-popup .points-factors-content');
        }

        if(typeof data.activation_points_info != 'undefined' && Object.keys(data.activation_points_info).length) {
            for (var i in data.activation_points_info){
                $('#leaderboard-points-factors-popup .points-factors-content .t-field[points_info_id='+data.activation_points_info[i].ll_activation_result_points_info_id+'] .points-val').val(data.activation_points_info[i].data);
            }
        }
    },

    populate_activations_info: function (asset_type, asset_id, data){
        var html = '';
        $('#leaderboard-points-factors-popup .points-factors-content').html('');
        if(typeof data.ll_activations != 'undefined' && Object.keys(data.ll_activations).length) {
            for (var activation_id in data.ll_activations){
                html = '';
                html += '<div class="t-field ll-line-field" activation_id="'+activation_id+'">';
                html +='      <a class="actions-activation-asset" style="display: none;"><img src="imgs/svg/icn_settings.svg"></a>' ;
                html += '    <div class="label ll_std_tooltip" title="'+data.ll_activations[activation_id]+'"><label>'+data.ll_activations[activation_id]+'</label></div>';
                html += '</div>';

                $('#leaderboard-points-factors-popup .points-factors-content').append(html);

                var $last_element = $('#leaderboard-points-factors-popup .points-factors-content .t-field:last');
                if(activation_id in ll_leaderboard_builder.ll_activation_have_points_factors && parseInt(ll_leaderboard_builder.ll_activation_have_points_factors[activation_id])) {
                    $last_element.find('.actions-activation-asset').show();
                } else {
                    $last_element.addClass('no-settings');
                }
            }
        } else {
            $('#leaderboard-points-factors-popup .points-factors-content').html('No Activations');
        }

        apply_ll_tooltip('#leaderboard-points-factors-popup .points-factors-content');

    },

    save_points_info: function (asset_id, asset_type, _callback){

        var data = {};
        data.action = 'save_points_info';
        data.asset_id = asset_id;
        data.asset_type = asset_type;
        data.points_info = {};

        $("#leaderboard-points-factors-popup .points-factors-content .t-field").each(function() {
            var points_info_id = $(this).attr('points_info_id');
            var points_val = $(this).find('.points-val').val();
            if(parseInt(points_info_id)){
                data.points_info[points_info_id] = parseFloat(points_val) ? points_val : 0;
            }
        });
        if(!Object.keys(data.points_info).length){
            show_error_message('Invalid points');
            return;
        }
        $.ajax({
            url: 'll-leaderboards-process.php',
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

    // ------

    addNewAsset: function(asset_type, data) {

        asset_type = parseInt(asset_type);
        var $wrap = $('.leaderboard-assets[asset-type='+asset_type+']');
        var lbl = 'Asset';
        var $assets = {};
        switch (asset_type){
            case LL_LEADERBOARD_ASSET_TYPE_ACTIVATION:
                lbl = 'Activation';
                var $assets = ll_leaderboard_builder.ll_activations;
                break;
            case LL_LEADERBOARD_ASSET_TYPE_EVENT:
                lbl = 'Event';
                var $assets = ll_leaderboard_builder.ll_events;
                break;
        }

        var html = '';
        html +='<div class="t-field line-asset">' ;
        html +='   <div class="add-line-asset"></div>' ;
        html +='   <div class="remove-line-asset"></div>' ;
        html +='   <a class="actions-line-asset hide"><img src="imgs/svg/icn_settings.svg"></a>' ;
        html += '	<select class="txt-field ll_asset_id" data-placeholder="--- Select '+lbl+' ---">';
        html +='        <option value="">--- Select '+lbl+' ---</option>' ;
        html +=' 	</select>';
        html +='</div>';

        $wrap.append(html);

        var $last_element = $('.leaderboard-assets[asset-type='+asset_type+'] .line-asset:last');
        var $last_asset = $('.leaderboard-assets[asset-type='+asset_type+'] .ll_asset_id:last');

        // ---- Actions
        ll_combo_manager.make_combo($last_asset);
        ll_combo_manager.add_kv_options($last_asset, $assets);
        ll_combo_manager.event_on_change($last_asset, function (){
            var ll_asset_id = parseInt(ll_combo_manager.get_selected_value($last_asset));
            if(ll_asset_id) {
                switch (asset_type) {
                    case LL_LEADERBOARD_ASSET_TYPE_ACTIVATION:
                        if(ll_asset_id in ll_leaderboard_builder.ll_activation_have_points_factors && parseInt(ll_leaderboard_builder.ll_activation_have_points_factors[ll_asset_id])){
                            $last_element.find('.actions-line-asset').removeClass('hide');
                        } else {
                            $last_element.find('.actions-line-asset').addClass('hide');
                        }
                        break;
                    case LL_LEADERBOARD_ASSET_TYPE_EVENT:
                        $last_element.find('.actions-line-asset').removeClass('hide');
                        break;
                }
            }
        });

        if (typeof data != 'undefined' && data) {
            if (typeof data.ll_asset_id != 'undefined' && parseInt(data.ll_asset_id)) {
                ll_combo_manager.set_selected_value($last_asset, data.ll_asset_id);
                ll_combo_manager.trigger_event_on_change($last_asset);
            }
        }

        apply_ll_tooltip($last_element);

        ll_leaderboard_builder.isRemoveAsset($wrap);
    },

    isRemoveAsset: function($wrap) {
        var count = $wrap.find(".line-asset").length;
        count > 1 ? $wrap.removeClass("no-remove") : $wrap.addClass("no-remove");
    },

    removeAsset: function($this) {
        var $wrap = $this.closest('.leaderboard-assets');
        $this.closest(".line-asset").remove();
        ll_leaderboard_builder.isRemoveAsset($wrap);

    },
};

$(document).ready(function () {

    if($('.leaderboard-designer').length){
        ll_leaderboard_builder.init();
        ll_leaderboard_builder.resizeTabs();
    }
    ll_leaderboard_builder.init_content();
});