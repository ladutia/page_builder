/**
 * Created by Asmaa Ali on 26/12/2019.
 */
var activation_leaderboard_manager = {

    activation_token: '',
    activation: null,
    chunk: 0,
    last_chunk: 0,
    show_winners: 0,
    count_of_leaders: 0,
    setIntervalID: 0,
    init: function () {

        activation_leaderboard_manager.load_by_token(function (response) {
            if (typeof response.ll_activation != 'undefined' && response.ll_activation) {
                activation_leaderboard_manager.activation = response.ll_activation;
                activation_leaderboard_manager.populate_activation();
                if(typeof response.show_winners != 'undefined' && response.show_winners){
                    activation_leaderboard_manager.show_winners = parseInt(response.show_winners);
                }
                if(typeof response.leaders != 'undefined' && response.leaders){
                    activation_leaderboard_manager.populate_leaders(response.leaders);
                    activation_leaderboard_manager.apply_leaders_style();
                }
                activation_leaderboard_manager.apply_styles();

            } else {
                show_error_message('Invalid activation');
            }
        });

        activation_leaderboard_manager.setIntervalID = setInterval(function(){
            if(activation_leaderboard_manager.show_winners){
                clearInterval(activation_leaderboard_manager.setIntervalID);
            } else {
                activation_leaderboard_manager.load_leaders(function (leaders) {
                    activation_leaderboard_manager.populate_leaders(leaders);
                    activation_leaderboard_manager.apply_leaders_style();
                });
            }
        }, 5000);
    },

    apply_actions: function () {

    },

    populate_activation: function(){
        if(typeof activation_leaderboard_manager.activation != 'undefined' && activation_leaderboard_manager.activation) {

            if(typeof activation_leaderboard_manager.activation.leaderboard_title != 'undefined' && activation_leaderboard_manager.activation.leaderboard_title){
                $('.leadboard__header-title').text(activation_leaderboard_manager.activation.leaderboard_title);
            }
            if(typeof activation_leaderboard_manager.activation.leaderboard_html != 'undefined' && activation_leaderboard_manager.activation.leaderboard_html){
                $('.leadboard__html').html(activation_leaderboard_manager.activation.leaderboard_html);
            }
        }
    },

    apply_styles: function(){

        if(typeof activation_leaderboard_manager.activation.style_info != 'undefined' && activation_leaderboard_manager.activation.style_info && Object.keys(activation_leaderboard_manager.activation.style_info).length){

            var apply_layout = true;
            for(var i in activation_leaderboard_manager.activation.style_info){
                var val = activation_leaderboard_manager.activation.style_info[i];
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
                            if(apply_layout) {
                                var widthLeftCol = parseInt(val);
                                var widthRightCol = 100 - widthLeftCol;
                                $(".leadboard__column-left").css("width", widthLeftCol + "%");
                                $(".leadboard__column-right").css("width", widthRightCol + "%");
                            }
                            break;
                        // --- Leaders
                        case 'upload-bg-leaderboard':
                            $('.leadboard__content').css('background-image', 'url(' + val + ')');
                            break;
                        case 'leaderboardBg':
                            $('.leadboard__content').css('background-color', '#' + val);
                            break;
                        case 'leaderboardAlingment':
                            var $colLeft = $(".leadboard__column-left");
                            var $colRight = $(".leadboard__column-right");
                            var $leaderboardCol = $(".leadboard__content");
                            var $HTMLCol = $(".leadboard__html");
                            switch (val) {
                                case LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT:
                                    $colLeft.append($leaderboardCol);
                                    $colRight.append($HTMLCol);
                                    break;
                                case LL_ACTIVATION_DISPLAY_FORM_SPLIT_RIGHT:
                                    $colLeft.append($HTMLCol);
                                    $colRight.append($leaderboardCol);
                                    break;
                                case LL_ACTIVATION_DISPLAY_FORM_FULL_SCREEN:
                                    $colLeft.append($leaderboardCol);
                                    $colRight.append($HTMLCol);
                                    $(".leadboard__columns").addClass('fullscreen');
                                    apply_layout = false;
                                    break;
                            }
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
                        case 'htmlBg':
                            $('.leadboard__html').css('background-color', '#' + val);
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
        }
    },

    apply_leaders_style: function(){

        if(typeof activation_leaderboard_manager.activation.style_info != 'undefined' && activation_leaderboard_manager.activation.style_info && Object.keys(activation_leaderboard_manager.activation.style_info).length) {

            var style_info = activation_leaderboard_manager.activation.style_info;

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

    populate_leaders: function(leaders){

        $('.list-leaders').html('');
        if(typeof leaders != 'undefined' && leaders && Object.keys(leaders).length) {
            activation_leaderboard_manager.count_of_leaders = Object.keys(leaders).length;
            for(var i in leaders){
                $('.list-leaders').append('<div class="list-leaders__item">' +
                                        '    <span class="list-leaders__number">' + (parseInt(i) + 1) + '.</span>' +
                                        '    <span class="list-leaders__name">' + leaders[i].name + '</span>' +
                                        '    <span class="list-leaders__count">' + leaders[i].result + '</span>' +
                                        '</div>');
            }
        }
    },

    load_by_token: function(_callback){
        if(activation_leaderboard_manager.activation_token) {
            var data = {};
            data.action = 'load_by_token';
            data.activation_token = activation_leaderboard_manager.activation_token;
            data.chunk = activation_leaderboard_manager.chunk;
            data.last_chunk = activation_leaderboard_manager.last_chunk;
            $.ajax({
                url: 'activation-leaderboard-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        if (typeof response.ll_activation != 'undefined' && response.ll_activation) {
                            if (typeof _callback != 'undefined') {
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
        } else {
            show_error_message("Invalid Token");
        }
    },

    load_leaders: function (_callback) {

        if(activation_leaderboard_manager.activation_token) {
            var data = {};
            data.action = 'load_leaders';
            data.activation_token = activation_leaderboard_manager.activation_token;
            data.last_chunk = activation_leaderboard_manager.last_chunk;
            $.ajax({
                url: 'activation-leaderboard-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        if (typeof response.leaders != 'undefined' && response.leaders && Object.keys(response.leaders).length) {
                            if (typeof _callback != 'undefined') {
                                _callback(response.leaders);
                            }
                        } else {
                            if(typeof response.chunk != 'undefined' && parseInt(response.chunk) && typeof response.show_winners != 'undefined' && parseInt(response.show_winners)){
                                window.location.href = "activation-leaderboard.php?token="+activation_leaderboard_manager.activation_token+"&chunk="+response.chunk;
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
        } else {
            show_error_message("Invalid Token");
        }
    }
};

$(document).ready(function () {

    activation_leaderboard_manager.init();

});