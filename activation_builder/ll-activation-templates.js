/**
 * Created by Asmaa Ali on 06/02/2020.
 */
var ll_activation_templates = {

    ll_activation_template_id: 0,
    is_templates_popup_loaded: false,
    is_save_template_popup_loaded: false,
    templates: {},
    activation: {},

 /*   leaderboard_styles: ll_activation_templates.default_leaderboard_styles(),
    capture_screen_styles: ll_activation_templates.default_capture_screen_styles(),*/

    // --- Leaderboard

    default_leaderboard_styles: function(){

        var style = {};
        style['upload-bg-page'] = 'none';
        style['pageBg'] = 'transparent';
        style['headerBg'] = 'transparent';
        style['headerHeight'] = '100';
        style['headerPaddingLeft'] = '20';
        style['headerPaddingRight'] = '20';
        style['upload-bg-header'] = 'none';
        style['pageBgType'] = '0';
        style['headerBgType'] = '0';
        style['titleColor'] = '333333';
        style['titleTypeFace'] = 'Arial';
        style['titleFontWeight'] = 'Bold';
        style['titleFontSize'] = '20';
        style['titleLineHeight'] = '150';
        style['upload-logo'] = 'none';
        style['leadboard_layout'] = '50';
        style['upload-bg-leaderboard'] = 'none';
        style['leaderboardBg'] = 'transparent';
        style['leaderboardAlingment'] = LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT;
        style['leadersPaddingLeft'] = '20';
        style['leadersPaddingRight'] = '20';
        style['leadersPaddingTop'] = '20';
        style['leadersPaddingBottom'] = '20';
        style['upload-bg-html'] = 'none';
        style['htmlPaddingLeft'] = '20';
        style['htmlPaddingRight'] = '20';
        style['htmlPaddingTop'] = '20';
        style['htmlPaddingBottom'] = '20';
        style['nameLeaderColor'] = '000000';
        style['nameLeaderTypeFace'] = 'Arial';
        style['nameLeaderFontWeight'] = 'Normal';
        style['nameLeaderFontSize'] = '30';
        style['nameLeaderLineHeight'] = '150';
        style['scoreLeaderColor'] = '000000';
        style['scoreLeaderTypeFace'] = 'Arial';
        style['scoreLeaderFontWeight'] = 'Normal';
        style['scoreLeaderFontSize'] = '30';
        style['scoreLeaderLineHeight'] = '150';
        style['scoreLeaderTextAlign'] = '150';
        style['highlightedLeaderboardBg'] = 'transparent';
        style['highlightedNameLeaderColor'] = '000000';
        style['highlightedNameLeaderTypeFace'] = 'Arial';
        style['highlightedNameLeaderFontWeight'] = 'Bold';
        style['highlightedNameLeaderFontSize'] = '30';
        style['highlightenameLeaderLineHeight'] = '150';
        style['highlightedScoreLeaderColor'] = '000000';
        style['highlightedScoreLeaderTypeFace'] = 'Arial';
        style['highlightedScoreLeaderFontWeight'] = 'Bold';
        style['highlightedScoreLeaderFontSize'] = '30';
        style['highlightedscoreLeaderLineHeight'] = '150';
        style['leadersBgType'] = '0';
        style['htmlBgType'] = '0';
        slyle['rowBg'] = 'ffffff';
        style['rowCheckTransparent'] = 1;
        style['rowBgOpacity'] = '100';
        style['rowBorderType'] = 'None';
        style['rowBorderWidth'] = '0';
        style['rowBorderColor'] = 'ffffff';
        style['rowMarginOuter'] = '0';
        style['rowMarginBottom'] = '0';
        style['rowPaddingLeft'] = '0';
        style['rowPaddingRight'] = '0';

        return style;
    },

    collect_leaderboard: function () {

        var leaderboard = {};
        leaderboard.leaderboard_title = $('.leadboard__header-title').text();
        leaderboard.leaderboard_html = $(".leadboard__html").html();
        leaderboard.leaderboard_leaders_count = ll_combo_manager.get_selected_value('#leaderboardCountItem');
        leaderboard.leaderboard_highlighted_leaders_count = ll_combo_manager.get_selected_value('#leaderboardHighlightedCountItem');
        leaderboard.leaderboard_display_full_name = $('#DisplayFullName').is(':checked') ? 1 : 0;
        leaderboard.style_info = ll_activation_templates.collect_leaderboard_styles();
        return leaderboard;
    },

    collect_leaderboard_styles: function () {

        /*styles['upload-bg-page'] = $('#builder-leadboard__html').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*!/, '');
        styles['pageBg'] = ll_activation_templates.getBackgroundColor($('#builder-leadboard__html'));
        // --- Header
        styles['headerBg'] = ll_activation_templates.getBackgroundColor($('.leadboard__header'));
        styles['headerHeight'] = $('.leadboard__header').css('height');
        styles['headerPaddingLeft'] = $('.leadboard__header').css('padding-left');
        styles['headerPaddingRight'] = $('.leadboard__header').css('padding-right');
        styles['upload-bg-header'] = $('.leadboard__header').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*!/, '');
        styles['titleColor'] = ll_activation_templates.rgb2hex($('.leadboard__header-title').css('color'));
        styles['titleTypeFace'] = $('.leadboard__header-title').css('font-family');
        styles['titleFontWeight'] = $('.leadboard__header-title').css('font-weight');
        styles['titleFontSize'] = $('.leadboard__header-title').css('font-size');
        // --- Logo
        styles['upload-logo'] = $('.leadboard__header-logo img').length ? $('.leadboard__header-logo img').attr('src') : '';
        // --- Layout
        styles['leadboard_layout'] = $(".leadboard__column-left").width() / $('.leadboard__column-left').parent().width() * 100;
        // --- Leaders
        styles['upload-bg-leaderboard'] = Math.round($('.leadboard__content').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*!/, '')).toFixed(2);
        styles['leaderboardBg'] = ll_activation_templates.getBackgroundColor($('.leadboard__content'));
        styles['leaderboardAlingment'] = $(".leadboard__column-left .leadboard__html").length ? 1 : 0;;
        styles['leadersPaddingLeft'] = $('.leadboard__content').css('padding-left');
        styles['leadersPaddingRight'] = $('.leadboard__content').css('padding-right');
        styles['leadersPaddingTop'] = $('.leadboard__content').css('padding-top');
        styles['leadersPaddingBottom'] = $('.leadboard__content').css('padding-bottom');
        // --- Html
        styles['upload-bg-html'] = $('.leadboard__html').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*!/, '');
        styles['htmlPaddingLeft'] = $('.leadboard__html').css('padding-left');
        styles['htmlPaddingRight'] = $('.leadboard__html').css('padding-right');
        styles['htmlPaddingTop'] = $('.leadboard__html').css('padding-top');
        styles['htmlPaddingBottom'] = $('.leadboard__html').css('padding-bottom');*/

        var styles = ll_activation_templates.default_leaderboard_styles();
        for(var i in styles){
            if(typeof ll_activation_builder.styleInfo[i] != 'undefined') {
                styles[i] = ll_activation_builder.styleInfo[i];
            }
        }
        return styles;
    },

    populate_leaderboard: function (leaderboard, apply_to_builder) {
        apply_to_builder = typeof apply_to_builder != 'undefined' ? apply_to_builder :  false;

        if(typeof leaderboard != 'undefined' &&  leaderboard){

            if(typeof leaderboard.leaderboard_title != 'undefined'){
                $(".leadboard__header h2").text(leaderboard.leaderboard_title);
                if(apply_to_builder) {
                    $('.builder-leadboard-panels #headerTitle').val(leaderboard.leaderboard_title);
                }
            }
            if(typeof leaderboard.leaderboard_html != 'undefined'){
                leaderboard.leaderboard_html = $.trim(leaderboard.leaderboard_html) ? leaderboard.leaderboard_html : '';
                var helpHTML = '<div class="leadboard__help-column">HTML</div>';
                var $box = $(".leadboard__html");
                $.trim(leaderboard.leaderboard_html)  ? $box.html(leaderboard.leaderboard_html) : $box.html(helpHTML)  ;
                if(apply_to_builder) {
                    //$('#leadboard-code-editor').text(leaderboard.leaderboard_html);
                    //ll_activation_builder.codeBox.editor.setValue(leaderboard.leaderboard_html);
                }
            }
            if(typeof leaderboard.leaderboard_leaders_count != 'undefined' &&  leaderboard.leaderboard_leaders_count){
                ll_combo_manager.set_selected_value('#leaderboardCountItem', leaderboard.leaderboard_leaders_count );
                $('#leaderboardCountItem').change();
            }
            if(typeof leaderboard.leaderboard_highlighted_leaders_count != 'undefined' &&  leaderboard.leaderboard_highlighted_leaders_count){
                ll_combo_manager.set_selected_value('#leaderboardHighlightedCountItem', leaderboard.leaderboard_highlighted_leaders_count );
                $('#leaderboardHighlightedCountItem').change();
            }
            if(parseInt(leaderboard.leaderboard_display_full_name)){
                ll_theme_manager.checkboxRadioButtons.check('#DisplayFullName', true);
            } else {
                ll_theme_manager.checkboxRadioButtons.check('#DisplayFullName', false);
            }
            $('#DisplayFullName').change();

            if(typeof leaderboard.style_info != 'undefined' &&  leaderboard.style_info){
                if(apply_to_builder && typeof ll_activation_builder != 'undefined') {
                    ll_activation_builder.populateStyleInfo(leaderboard.style_info);
                } else {
                    ll_activation_templates.populate_leaderboard_styles(leaderboard.style_info);
                }
            }
        }
    },

    populate_leaderboard_styles: function(style_info){

        if(typeof style_info != 'undefined' && style_info && Object.keys(style_info).length){

            for(var i in style_info){
                var val = style_info[i];
                if($.trim(val) || parseInt(val)) {
                    switch (i) {
                        // --- Page
                        case 'upload-bg-page':
                            $('#builder-leadboard__html').css('background-image', 'url(' + val + ')');
                            break;
                        case 'pageBg':
                            $('#builder-leadboard__html').css('background-color', '#' + val);
                            break;
                        // --- Header
                        case 'headerBg':
                            $('.leadboard__header').css('background-color', '#' + val);
                            break;
                        case 'headerHeight':
                            $('.leadboard__header').css('height', val);
                            break;
                        case 'headerPaddingLeft':
                            $('.leadboard__header').css('padding-left', val);
                            break;
                        case 'headerPaddingRight':
                            $('.leadboard__header').css('padding-right', val);
                            break;
                        case 'upload-bg-header':
                            $('.leadboard__header').css('background-image', 'url(' + val + ')');
                            break;
                        case 'titleColor':
                            $('.leadboard__header-title').css('color', '#' + val);
                            break;
                        case 'titleTypeFace':
                            $('.leadboard__header-title').css('font-family', val + ", sans-serif");
                            break;
                        case 'titleFontWeight':
                            $('.leadboard__header-title').css('font-weight', val);
                            break;
                        case 'titleFontSize':
                            $('.leadboard__header-title').css('font-size', val + 'px');
                            break;
                        // --- Logo
                        case 'upload-logo':
                            $('.leadboard__header-logo').html('<img src="' + val + '" alt="">');
                            break;
                        // --- Layout
                        case 'leadboard_layout':
                            var widthLeftCol = parseInt(val);
                            var widthRightCol = 100 - widthLeftCol;
                            $(".leadboard__column-left").css("width", widthLeftCol + "%");
                            $(".leadboard__column-right").css("width", widthRightCol + "%");
                            break;
                        // --- Leaders
                        case 'upload-bg-leaderboard':
                            $('.leadboard__content').css('background-image', 'url(' + val + ')');
                            break;
                        case 'leaderboardBg':
                            $('.leadboard__content').css('background-color', '#' + val);
                            break;
                        case 'leaderboardAlingment':
                            $('.display_leaderboard[display-type='+val+']').trigger('click');
                            break;
                        case 'leadersPaddingLeft':
                            $('.leadboard__content').css('padding-left', val);
                            break;
                        case 'leadersPaddingRight':
                            $('.leadboard__content').css('padding-right', val);
                            break;
                        case 'leadersPaddingTop':
                            $('.leadboard__content').css('padding-top', val);
                            break;
                        case 'leadersPaddingBottom':
                            $('.leadboard__content').css('padding-bottom', val);
                            break;
                        // --- Html
                        case 'upload-bg-html':
                            $('.leadboard__html').css('background-image', 'url(' + val + ')');
                            break;
                        case 'htmlPaddingLeft':
                            $('.leadboard__html').css('padding-left', val);
                            break;
                        case 'htmlPaddingRight':
                            $('.leadboard__html').css('padding-right', val);
                            break;
                        case 'htmlPaddingTop':
                            $('.leadboard__html').css('padding-top', val);
                            break;
                        case 'htmlPaddingBottom':
                            $('.leadboard__html').css('padding-bottom', val);
                            break;
                    }
                }
            }

            ll_activation_templates.apply_leaders_style(style_info);
        }
    },
    
    apply_leaders_style: function(style_info){

        if(typeof style_info != 'undefined' && style_info && Object.keys(style_info).length) {
            // --- Row
            if(typeof style_info.rowBg != 'undefined' && style_info.rowBg){
                if(typeof style_info.rowCheckTransparent != 'undefined'){
                    if(style_info.rowCheckTransparent == 0){
                        var rgba = null;

                        if(typeof style_info.rowBgOpacity != 'undefined')
                            rgba = ll_theme_manager.hex2rgba('#' + style_info.rowBg, style_info.rowBgOpacity);
                        else
                            rgba = ll_theme_manager.hex2rgba('#' + style_info.rowBg, 100);

                        $('.list-leaders__number, .list-leaders__name, .list-leaders__count').css('background-color',  rgba);
                    }
                }
            }
            if(typeof style_info.rowBorderType != 'undefined' && style_info.rowBorderType){
                $('.list-leaders__number, .list-leaders__name, .list-leaders__count').css('border-style',  style_info.rowBorderType);
            }
            if(typeof style_info.rowBorderColor != 'undefined' && style_info.rowBorderColor){
                $('.list-leaders__number, .list-leaders__name, .list-leaders__count').css('border-color',  '#' + style_info.rowBorderColor);
            }
            if(typeof style_info.rowBorderWidth != 'undefined' && style_info.rowBorderWidth){
                $('.list-leaders__number, .list-leaders__name, .list-leaders__count').css('border-width',  style_info.rowBorderWidth + 'px');
            }
            if(typeof style_info.rowMarginBottom != 'undefined' && style_info.rowMarginBottom){
                $('.list-leaders__item').css('margin-bottom',  style_info.rowMarginBottom + 'px');
            }
            if(typeof style_info.rowMarginOuter != 'undefined' && style_info.rowMarginOuter){
                $('.list-leaders__number, .list-leaders__name').css('margin-right',  style_info.rowMarginOuter + 'px');
            }
            if(typeof style_info.rowPaddingLeft != 'undefined' && style_info.rowPaddingLeft){
                $('.list-leaders__name, .list-leaders__count').css('padding-left',  style_info.rowPaddingLeft + 'px');
            }
            if(typeof style_info.rowPaddingRight != 'undefined' && style_info.rowPaddingRight){
                $('.list-leaders__name, .list-leaders__count').css('padding-right',  style_info.rowPaddingRight + 'px');
            }
            // --- Name and Numbers
            if(typeof style_info.nameLeaderColor != 'undefined' && style_info.nameLeaderColor){
                $('.list-leaders__name, .list-leaders__number').css('color',  '#' + style_info.nameLeaderColor);
            }
            if(typeof style_info.nameLeaderTypeFace != 'undefined' && style_info.nameLeaderTypeFace){
                $('.list-leaders__name, .list-leaders__number').css('font-family',  style_info.nameLeaderTypeFace + ", sans-serif");
            }
            if(typeof style_info.nameLeaderFontWeight != 'undefined' && style_info.nameLeaderFontWeight){
                $('.list-leaders__name, .list-leaders__number').css('font-weight',  style_info.nameLeaderFontWeight);
            }
            if(typeof style_info.nameLeaderFontSize != 'undefined' && style_info.nameLeaderFontSize){
                $('.list-leaders__name, .list-leaders__number').css('font-size',  style_info.nameLeaderFontSize + 'px');
            }
            // --- Score
            if(typeof style_info.scoreLeaderColor != 'undefined' && style_info.scoreLeaderColor){
                $('.list-leaders__count').css('color',  '#' + style_info.scoreLeaderColor);
            }
            if(typeof style_info.scoreLeaderTypeFace != 'undefined' && style_info.scoreLeaderTypeFace){
                $('.list-leaders__count').css('font-family',  style_info.scoreLeaderTypeFace + ", sans-serif");
            }
            if(typeof style_info.scoreLeaderFontWeight != 'undefined' && style_info.scoreLeaderFontWeight){
                $('.list-leaders__count').css('font-weight',  style_info.scoreLeaderFontWeight);
            }
            if(typeof style_info.scoreLeaderFontSize != 'undefined' && style_info.scoreLeaderFontSize){
                $('.list-leaders__count').css('font-size',  style_info.scoreLeaderFontSize + 'px');
            }
            if(typeof style_info.scoreLeaderTextAlign != 'undefined' && style_info.scoreLeaderFontSize){
                $('.list-leaders__count').css('text-align',  style_info.scoreLeaderTextAlign);
            }

            // ------------ Highlighted

            if(typeof activation_leaderboard_manager.activation.leaderboard_highlighted_leaders_count != 'undefined' && parseInt(activation_leaderboard_manager.activation.leaderboard_highlighted_leaders_count )) {

                var highlighted_count = parseInt(activation_leaderboard_manager.activation.leaderboard_highlighted_leaders_count) ;

                $('.list-leaders__item').each(function(index) {
                    if (index < highlighted_count) $(this).addClass("highlighted");
                });

                if (typeof style_info.highlightedLeaderboardBg != 'undefined' && style_info.highlightedLeaderboardBg) {
                    $('.highlighted').css('background-color', '#' + style_info.highlightedLeaderboardBg);
                }

                // --- Name and Number
                if (typeof style_info.highlightedNameLeaderColor != 'undefined' && style_info.highlightedNameLeaderColor) {
                    $('.highlighted').find('.list-leaders__name, .list-leaders__number').css('color', '#' + style_info.highlightedNameLeaderColor);
                }
                if (typeof style_info.highlightedNameLeaderTypeFace != 'undefined' && style_info.highlightedNameLeaderTypeFace) {
                    $('.highlighted').find('.list-leaders__name, .list-leaders__number').css('font-family', style_info.highlightedNameLeaderTypeFace + ", sans-serif");
                }
                if (typeof style_info.highlightedNameLeaderFontWeight != 'undefined' && style_info.highlightedNameLeaderFontWeight) {
                    $('.highlighted').find('.list-leaders__name, .list-leaders__number').css('font-weight', style_info.highlightedNameLeaderFontWeight);
                }
                if (typeof style_info.highlightedNameLeaderFontSize != 'undefined' && style_info.highlightedNameLeaderFontSize) {
                    $('.highlighted').find('.list-leaders__name, .list-leaders__number').css('font-size', style_info.highlightedNameLeaderFontSize + 'px');
                }
                // --- Score
                if (typeof style_info.highlightedScoreLeaderColor != 'undefined' && style_info.highlightedScoreLeaderColor) {
                    $('.highlighted .list-leaders__count').css('color', '#' + style_info.highlightedScoreLeaderColor);
                }
                if (typeof style_info.highlightedScoreLeaderTypeFace != 'undefined' && style_info.highlightedScoreLeaderTypeFace) {
                    $('.highlighted .list-leaders__count').css('font-family', style_info.highlightedScoreLeaderTypeFace + ", sans-serif");
                }
                if (typeof style_info.highlightedScoreLeaderFontWeight != 'undefined' && style_info.highlightedScoreLeaderFontWeight) {
                    $('.highlighted .list-leaders__count').css('font-weight', style_info.highlightedScoreLeaderFontWeight);
                }
                if (typeof style_info.highlightedScoreLeaderFontSize != 'undefined' && style_info.highlightedScoreLeaderFontSize) {
                    $('.highlighted .list-leaders__count').css('font-size', style_info.highlightedScoreLeaderFontSize + 'px');
                }
            }

        }
    },

    // --- Capture Screen

    default_capture_screen_styles: function(){

        var style = {};
        style['upload-bg-capture-screen'] = 'none';
        style['captureScreenBg'] = 'transparent';
        style['captureScreenPaddingLeft'] = '20';
        style['captureScreenPaddingRight'] = '20';
        style['captureScreenPaddingTop'] = '20';
        style['captureScreenPaddingBottom'] = '20';
        style['captureScreenBgType'] = '0';
        return style;
    },

    collect_capture_screen: function(){

        var capture_screen = {};
        var capture_screen_html = $(".capture-screen-content #capture-screen-html")[0].outerHTML;
        $("#capture-screen-html-temp")
            .html(capture_screen_html)
            .find(".help-box")
            .remove();
        capture_screen.capture_screen_html = capture_screen_html;
        capture_screen.style_info = ll_activation_templates.collect_capture_screen_styles();
        return capture_screen;
    },

    collect_capture_screen_styles: function(){

        /*styles['upload-bg-capture-screen'] = $('#capture-screen-html').css('background-image').replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*!/, '');
        styles['captureScreenBg'] = ll_activation_templates.getBackgroundColor($('#capture-screen-html'));
        styles['captureScreenPaddingLeft'] = $('#capture-screen-html').css('padding-left');
        styles['captureScreenPaddingRight'] = $('#capture-screen-html').css('padding-right');
        styles['captureScreenPaddingTop'] = $('#capture-screen-html').css('padding-top');
        styles['captureScreenPaddingBottom'] = $('#capture-screen-html').css('padding-bottom');*/

        var styles = ll_activation_templates.default_capture_screen_styles();
        for(var i in styles){
            if(typeof ll_activation_builder.styleInfo[i] != 'undefined') {
                styles[i] = ll_activation_builder.styleInfo[i];
            }
        }
        return styles;
    },

    populate_capture_screen: function (capture_screen, apply_to_builder) {

        apply_to_builder = typeof apply_to_builder != 'undefined' ? apply_to_builder :  false;
        if(typeof capture_screen != 'undefined' &&  capture_screen){

            var capture_screen_html = '<div id="capture-screen-html" class="custom-html no-html">' +
                                 '           <div class="custom-html__content"></div>' +
                                 '           <div class="help-box">' +
                                 '               <div class="help-box__icn"><svg width="120px" height="110px" viewBox="0 0 80 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Page-Content-elements" transform="translate(-406.000000, -97.000000)" fill="#FF982B" fill-rule="nonzero" class="svg-fill"><g id="Right-Side-2" transform="translate(7.000000, 49.000000)"><g id="Image" transform="translate(20.000000, 20.055006)"><path d="M453,44.0374036 L412.335111,44.0374036 L412.335111,32.4294135 C412.335111,29.8933953 411.722397,29.671496 409.353592,31.7278034 L381.537384,55.8744427 C381.354147,56.0335068 381.354266,56.118977 381.537384,56.2779384 L409.353592,80.4245777 C411.724523,82.4827309 412.335111,82.2620709 412.335111,79.7229676 L412.335111,68.1166118 L453,68.1166118 C453.883656,68.1166118 454.6,67.4002674 454.6,66.5166119 L454.6,45.6374035 C454.6,44.753748 453.883656,44.0374036 453,44.0374036 Z M414.73511,41.6374037 L453,41.6374037 C455.209139,41.6374037 457,43.4282646 457,45.6374035 L457,66.5166119 C457,68.7257508 455.209139,70.5166117 453,70.5166117 L414.73511,70.5166117 L414.73511,79.7229676 C414.73511,84.4457293 411.620631,85.5706726 407.780299,82.2369648 L379.964091,58.0903255 C378.682667,56.9779495 378.674612,55.1814239 379.964091,54.0620556 L407.780299,29.9154163 C411.621335,26.581097 414.73511,27.7135225 414.73511,32.4294135 L414.73511,41.6374037 Z" id="Rectangle-154" transform="translate(418.000000, 56.077008) scale(-1, 1) translate(-418.000000, -56.077008) "></path></g></g></g></g></svg></div>' +
                                 '               <div class="help-box__text">Click here to open HTML editor</div>' +
                                 '           </div>' +
                                 '       </div>';
            if(typeof capture_screen.capture_screen_html != 'undefined' && $.trim(capture_screen.capture_screen_html)){
                capture_screen_html = capture_screen.capture_screen_html;
            }
            $('#capture-screen-html').replaceWith(capture_screen_html);
            if(typeof capture_screen.style_info != 'undefined' &&  capture_screen.style_info){
                if(apply_to_builder && typeof ll_activation_builder != 'undefined') {
                    ll_activation_builder.populateStyleInfo(capture_screen.style_info);
                }
            }
        }
    },

    // -------
    rgb2hex: function (orig){
        if(orig != 'undefined' && orig) {
            var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
            return (rgb && rgb.length === 4) ? "" +
                ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
                ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
        }
    },

    getBackgroundColor: function (element){
        var bgColor = "";
        if(element != 'undefined' && element) {
            bgColor = element.css("background-color");
            if (bgColor != "rgba(0, 0, 0, 0)" && bgColor != "transparent") {
                bgColor = ll_activation_templates.rgb2hex(bgColor);
            }
        }
        return bgColor;
    },

    // -------------- templates

    load: function(template_id){

        var data = {};
        data.action = 'load_template';
        data.ll_activation_template_id = template_id;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof response.ll_activation_template != 'undefined' && response.ll_activation_template){
                        if(typeof _callback !='undefined'){
                            _callback(response);
                        }
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    load_templates: function(template_for, _callback){

        var data = {};
        data.action = 'load_templates';
        data.template_for = template_for;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof response.ll_activation_templates != 'undefined' && response.ll_activation_templates){
                        if(typeof _callback !='undefined'){
                            _callback(response);
                        }
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    save: function (ll_activation_template_id , template_for, _callback) {

        var data = {};
        data.action = 'save_template';
        data.ll_activation_template_id = ll_activation_template_id;
        data.template_for = template_for;
        data.ll_activation_template_name = $('#ll_activation_template_name').val();
        if(!$.trim(data.ll_activation_template_name)){
            show_error_message('Please enter name!');
            return;
        }
        data.template_data = {};
        switch (template_for) {
            case LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN:
                data.template_data = ll_activation_templates.collect_capture_screen();
                break;
            case LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD:
                data.template_data = ll_activation_templates.collect_leaderboard();
                break;
        }
        data.template_data = JSON.stringify(data.template_data);

        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof response.ll_activation_template != 'undefined' && response.ll_activation_template){
                        show_success_message(response.message);
                        ll_popup_manager.close('#ll-save-activation-template-popup');
                        if(typeof _callback !='undefined'){
                            _callback(response);
                        }
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    populate: function () {

    },

    open_templates_popup: function (template_for, _callback){

        if(! ll_activation_templates.is_templates_popup_loaded){
            var _html = '';
            _html += '<div class="ll-popup" id="ll-activation-templates-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Templates';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="form">';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <select name="ll_activation_templates" class="txt-field txt-field-large" data-placeholder="Select Template">';
            _html += '              </select>';
            _html += '          </div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_activation_templates_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_apply_activation_templates_popup">Apply</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);

            if(!ll_activation_templates.is_templates_popup_loaded) {

                ll_combo_manager.make_combo('#ll-activation-templates-popup select[name="ll_activation_templates"]');

                $('.btn_cancel_activation_templates_popup').click(function () {
                    ll_popup_manager.close('#ll-activation-templates-popup');
                });

                $('.btn_apply_activation_templates_popup').click(function () {

                    var ll_activation_template_id = ll_combo_manager.get_selected_value('#ll-activation-templates-popup select[name="ll_activation_templates"]');
                    if(!parseInt(ll_activation_template_id)){
                        show_error_message('Please select template to apply');
                        return;
                    }
                    if(Object.keys(ll_activation_templates.templates).length && ll_activation_template_id in ll_activation_templates.templates){
                        if (typeof _callback != 'undefined' && _callback) {
                            _callback(ll_activation_templates.templates[ll_activation_template_id]);
                            ll_popup_manager.close('#ll-activation-templates-popup');
                        }
                    } else {
                        show_error_message('invalid template');
                        return;
                    }

                });

                ll_activation_templates.is_templates_popup_loaded = true;
            }
        }
        ll_activation_templates.load_templates(template_for, function (response) {
            if (typeof response.ll_activation_templates_list != 'undefined' && response.ll_activation_templates_list) {
                ll_combo_manager.clear_all('#ll-activation-templates-popup select[name="ll_activation_templates"]');
                ll_combo_manager.add_option('#ll-activation-templates-popup select[name="ll_activation_templates"]', 0, '--- Select Template ---');
                ll_combo_manager.add_kv_options('#ll-activation-templates-popup select[name="ll_activation_templates"]', response.ll_activation_templates_list);
                ll_combo_manager.sort('#ll-activation-templates-popup select[name="ll_activation_templates"]');
                ll_combo_manager.set_selected_value('#ll-activation-templates-popup select[name="ll_activation_templates"]', '');
            }

            if (typeof response.ll_activation_templates != 'undefined' && Object.keys(response.ll_activation_templates).length) {
                ll_activation_templates.templates = response.ll_activation_templates;
                ll_popup_manager.open('#ll-activation-templates-popup');
            } else {
                show_error_message('There are not saved templates');
            }

        });
    },

    open_save_template_popup: function (ll_activation_template_id , template_for, _callback){

        ll_activation_templates.ll_activation_template_id = ll_activation_template_id;
        if(!ll_activation_templates.is_save_template_popup_loaded){
            var _html = '';
            _html += '<div class="ll-popup" id="ll-save-activation-template-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Save Template';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="form">';
            _html += '          <div class="t-field ll-line-field save-mode-li">';
            _html += '              <div class="label"><label></label></div>';
            _html += '              <div class="t-radio inline">';
            _html += '					<label>';
            _html += '						<i class="icn-radio"></i>';
            _html += '						<input type="radio" name="save_mode" value="overwrite"/> Overwrite';
            _html += '					</label>';
            _html += '				</div>';
            _html += '              <div class="t-radio inline">';
            _html += '					<label>';
            _html += '						<i class="icn-radio"></i>';
            _html += '						<input type="radio" name="save_mode" value="new" checked="checked" /> New';
            _html += '					</label>';
            _html += '				</div>';
            _html += '			</div>';
            _html += '          <div class="t-field ll-line-field new-template-li">';
            _html += '              <div class="label"><label>Name</label></div>';
            _html += '              <input class="txt-field" id="ll_activation_template_name"/>';
            _html += '          </div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_save_activation_template_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_activation_template_popup">Save</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);

            ll_theme_manager.checkboxRadioButtons.initiate_container('#ll-save-activation-template-popup');

            $('#ll-save-activation-template-popup [name=save_mode]').change(function (){
                if($(this).val() == 'new'){
                   // $('#ll-save-activation-template-popup .new-template-li').show();
                } else {
                   // $('#ll-save-activation-template-popup .new-template-li').hide();
                }
            });

            $('.btn_cancel_save_activation_template_popup').click(function () {
                ll_popup_manager.close('#ll-save-activation-template-popup');
            });

            $('.btn_save_activation_template_popup').click(function () {

                if($('#ll-save-activation-template-popup [name=save_mode]:checked').val() == 'new'){
                    ll_activation_templates.ll_activation_template_id = 0;
                }
                ll_activation_templates.save(ll_activation_templates.ll_activation_template_id , template_for, _callback);
            });

            ll_activation_templates.is_save_template_popup_loaded = true;
        }

        $('#ll_activation_template_name').val('');

        var selected_save_mode = 'new';
        if(parseInt(ll_activation_templates.ll_activation_template_id)){
            selected_save_mode = 'overwrite';
            $('#ll-save-activation-template-popup .save-mode-li').show();
            if(Object.keys(ll_activation_templates.templates).length && ll_activation_templates.ll_activation_template_id in ll_activation_templates.templates){
                $('#ll_activation_template_name').val(ll_activation_templates.templates[ll_activation_templates.ll_activation_template_id].ll_activation_template_name);
            }
        } else {
            $('#ll-save-activation-template-popup .save-mode-li').hide();
        }

        ll_theme_manager.checkboxRadioButtons.check('#ll-save-activation-template-popup [name=save_mode][value='+selected_save_mode+']', true);
        //$('#ll-save-activation-template-popup [name=save_mode][value='+selected_save_mode+']').trigger('change');

        ll_popup_manager.open('#ll-save-activation-template-popup');

    },

    reset_template: function (template_for, _callback) {

        var style_info = {};
        switch (template_for) {
            case LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN:
                style_info = ll_activation_templates.default_capture_screen_styles();
                break;
            case LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD:
                style_info = ll_activation_templates.default_leaderboard_styles();
                break;
        }
        ll_activation_builder.populateStyleInfo(style_info);

        if(typeof ll_activation_builder.activation != 'undefined'){
            switch (template_for) {
                case LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN:
                    ll_activation_templates.populate_capture_screen(ll_activation_builder.activation, true);
                    break;
                case LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD:
                    ll_activation_templates.populate_leaderboard(ll_activation_builder.activation, true);
                    break;
            }
        }

        show_success_message('Template reset');
        if (typeof _callback != 'undefined' && _callback) {
            _callback();
        }
    },

};