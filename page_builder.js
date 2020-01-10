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
    init: function () {
        $('body').on('keyup', function (e) {
            if (e.keyCode === 46) {
                pageBuilder.removeWidget($('.pb-widget--selected'));
            }
        });
        $('.pb-tabs__item').on('click', function () {
            var $this = $(this);
            var index = $this.parent().find('.pb-tabs__item').index($this);

            $this.addClass('pb-tabs__item--selected').siblings('.pb-tabs__item').removeClass('pb-tabs__item--selected');
            $this.parents('.pb-tabs').find('.pb-tabs__content').removeClass('pb-tabs__content--selected').eq(index).addClass('pb-tabs__content--selected');

            if (pageBuilder.isNewHistory())
                pageBuilder.updateHistory();
        });
        $('#pb-template').on('click', 'a', function (e) {
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
            pageBuilder.insertImage($(this).parents('.pb-image__item'), true, null);
            pageBuilder.setNewActionHistory();
        });

        $('.pb-list-image--slideshow').on('click', '.pb-image__item', function () {
            $(this).addClass('pb-image__item--selected').siblings('.pb-image__item').removeClass('pb-image__item--selected');
            pageBuilder.setActiveSlideInSlideshow($(this));
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
            pageBuilder.addIcnSvg($(this));
            pageBuilder.setNewActionHistory();
        });
        $('.pb-unload-svg__remove').on('click', function () {
            pageBuilder.removeIcnSvg($(this));
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

        $('#gridNumberColumnsTwo').on('change', function () {
            var $this = $(this);
            pageBuilder.numberColumns($this.attr('id'), $this.val());
            pageBuilder.updateColumnsContent($this.attr('id'), $this.val());
            pageBuilder.setNewActionHistory();
        });

        $('#gridNumberColumnsThree').on('change', function () {
            var $this = $(this);
            pageBuilder.numberColumns($this.attr('id'), $this.val());
            pageBuilder.updateColumnsContent($this.attr('id'), $this.val());
            pageBuilder.setNewActionHistory();
        });

        $('#gridNumberColumnsUneven').on('change', function () {
            var $this = $(this);
            pageBuilder.numberColumns($this.attr('id'), $this.val());
            pageBuilder.updateColumnsContent($this.attr('id'), $this.val());
            pageBuilder.setNewActionHistory();
        });

        $('.pb-btn-upload-bg-image').on('click', function () {
            var $btn = $(this);
            var $box = $btn.closest('.pb-box-btn-upload-bg-image');
            if ($box.hasClass('pb-box-btn-upload-bg-image--global'))
                pageBuilder.addBgImage($box, true);
            else
                pageBuilder.addBgImage($box);

            pageBuilder.setNewActionHistory();
        });

        $('.pb-unload-bg-image__remove').on('click', function () {
            var $btn = $(this);
            var $box = $btn.closest('.pb-box-btn-upload-bg-image');

            if ($box.hasClass('pb-box-btn-upload-bg-image--global'))
                pageBuilder.removeBgImage($box, true);
            else
                pageBuilder.removeBgImage($box);

            pageBuilder.setNewActionHistory();
        });
        $('body').on('click', '.pb-blocks .pb-widget', function (e) {
            e.stopPropagation();
            pageBuilder.selectWidget($(this));
        });
        $('body').on('dblclick', '.pb-blocks .pb-editable', function (e) {
            e.stopPropagation();
            pageBuilder.showHideEditorInline($(this));
        });
        $('body').on('click', '.pb-blocks .pb-widget__btn-remove', function (e) {
            e.stopPropagation();
            pageBuilder.removeWidget($('.pb-widget--selected'));
        });
        $('.search-results-list-icon').on('click', function (e) {
            e.preventDefault();
        });

        $('#dropdownLibrary').change(function () {
            var val = $(this).val();
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

        /*$('#pb-preview-box__iframe').on("load", function () {
            pageBuilder.iframePreviewContent = $("#pb-preview-box__iframe").contents();
            $('#pbBtnPreview').removeClass('disabled');
        });*/
        pageBuilder.addIframePreview();

        $('body').on('dblclick.uploadBackground', '.pb-blocks', function (e) {
            e.stopPropagation();
            pageBuilder.openUploader();
        });

        $('body').on('dblclick.uploadBackgroundWidget', '.pb-blocks .pb-widget', function (e) {
            e.stopPropagation();
            var $el = $(this);

            if (!$el.hasClass('pb-widget--button') && !$el.hasClass('pb-widget--video') && !$el.hasClass('pb-widget--video'))
                pageBuilder.openUploader();
        });

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
    },
    initMoreEvents: function () {
        pageBuilder.updateInlineCss('button');
        pageBuilder.updateInlineCss('link');

        $('.pb-widget, .pb-load-image').removeClass('.ui-droppable');
        pageBuilder.dropFreeImages();

        $(".pb-layout-grid__cell.ui-sortable, .pb-container-grid.ui-sortable, .pb-form-grid.ui-sortable").removeClass('ui-sortable');
        pageBuilder.dragDropElements();

        pageBuilder.initGlobalOptions();
        pageBuilder.openUploaderInit();
        pageBuilder.loadImage();
        pageBuilder.loadSvg();
        pageBuilder.widgetTreeLoad();

        if ($('.pb-editable').length > 0)
            pageBuilder.initEditorInline();
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
            scroll: true,
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
                
                console.log('stop def');
            },
            receive: function (event, ui) {
                console.log('receive');
            },
            update: function (event, ui) {
                if (!$(ui.item).hasClass('list-elements__item'))
                    pageBuilder.widgetTreeMove($(ui.item));

                var $this = $(this);
                $this.removeClass('pb-sortable-hover');
                pageBuilder.showHideHelpDragDropBox($this);
                $this.removeClass('pb-blocks--start-sortable');
                pageBuilder.updateHistory();
                console.log('update');
            },
            change: function () {
                console.log('change');
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
                console.log('stop container');
            },
            receive: function (event, ui) {
                var $this = $(this);
                pageBuilder.showHideHelpDragDropCell($this);
            },
            update: function (event, ui) {
                if (!$(ui.item).hasClass('list-elements__item'))
                    pageBuilder.widgetTreeMove($(ui.item));

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
        var $parentWidget = $widget.parent();
        var isDeleteitem = ($widget.hasClass('pb-widget--no-remove')) ? ' item__delete--none' : '';
        var isDisabled = ($widget.hasClass('ui-widget-disabled')) ? ' ui-item-widget-disabled' : '';

        if ($parentWidget.hasClass('pb-layout-grid__cell'))
            index = $parentWidget.parent().children('.pb-layout-grid__cell').children('.pb-widget').index($widget);
        else
            index = $parentWidget.children('.pb-widget').index($widget);

        if (type === 'nav-items' || type === 'container' || type === "two-column-grid" || type === "three-column-grid" || type === "uneven-grid" || type === "vertical-form" || type === "horizontal-form")
            isNestedList = '';

        var html = '<li class="list-widgets__item mjs-nestedSortable-leaf ' + isNestedList + ' list-widgets__item--' + classType + isDisabled + '" data-type="' + type + '" data-idx="' + idx + '">' +
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
                    } else if ($parent.attr('data-type') === 'vertical-form' || $parent.attr('data-type') === 'horizontal-form') {
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"10px", "paddingRight":"10px", "paddingTop":"10px", "paddingBottom":"10px"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--container' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'two-column-grid') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "width":"90%", "minHeight":"0","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "gridSize1": "50", "gridSize2": "50"}';
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "radius":"0", "width":"90%", "minHeight":"0","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "gridSize1": "33", "gridSize2": "34"}';
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "width":"90%", "minHeight":"0","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0", "gridSize1": "60", "gridSize2": "20"}';
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
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
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "textAlign":"0", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--image' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'image-group') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "count":"2", "layout":"0", "layoutIndex":"0", "width":"100%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
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
            dataJson = '{"width":"80", "height":"80", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"0", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--svg' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg pb-load-svg--none"></div></div>' +
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"2", "position":"2", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--text-column-with-image' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-text-column-with-image pb-clearfix">' +
                '<div class="pb-column-1">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"1", "position":"2", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px"}';
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"1", "position":"0", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px"}';
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"0", "position":"0", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px"}';
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
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "count":"2", "position":"0", "imgAlign":"left", "gridSize1": "50", "gridSize2": "50", "width":"90%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"30px", "paddingBottom":"30px"}';
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
            dataJson = '{"containerBackground":"#ffffff", "backgroundImageUrl":"", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#fafafa", "btnBorderType":"Solid", "btnBorderWidth":"1", "btnBorderColor":"#cccccc", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"Normal", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "layout": "1", "contentToShare":"1", "shareCustomUrl":"0", "shareLink":"", "shareDesc":""}';
            var masSocialText = ['Share', 'Tweet', 'Share', '+1'];
            var masSocialLink = ['http://www.facebook.com/sharer/sharer.php?u=', 'http://twitter.com/intent/tweet?text=', 'http://www.linkedin.com/shareArticle?url=', 'https://plus.google.com/share?url='];

            html = "<div class='pb-widget pb-widget--init pb-widget--social-share' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-social-btns pb-social-btns--share">' +
                '<div class="pb-social-btns__table"><div class="pb-social-btns__row">' +
                '<div class="pb-wrap-social-btn" data-type-social="0"><a href="' + masSocialLink[0] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/fb.png" alt=""/></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[0] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="1"><a href="' + masSocialLink[1] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/tw.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[1] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="3"><a href="' + masSocialLink[2] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/in.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[2] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="2"><a href="' + masSocialLink[3] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/gg.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[3] + '</span>' +
                '</a></div>' +
                '</div></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'social-follow') {
            dataJson = '{"containerBackground":"#ffffff", "backgroundImageUrl":"", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#ffffff", "btnBorderType":"None", "btnBorderWidth":"0", "btnBorderColor":"#ffffff", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"Normal", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "display":"0", "layout": "2", "contentToShare":"0", "shareCustomUrl":"0", "shareLink":"", "shareDesc":""}';
            var masSocialText = ['Facebook', 'Twitter', 'LinkedIn', 'Google Plus'];
            var masSocialLink = ['http://www.facebook.com/', 'http://www.twitter.com/', 'http://www.linkedin.com/', 'http://plus.google.com/'];

            html = "<div class='pb-widget pb-widget--init pb-widget--social-follow' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-social-btns pb-social-btns--icn-only pb-social-btns--follow" style="background: #fffff; border-color: #ffffff;">' +
                '<div class="pb-social-btns__table"><div class="pb-social-btns__row">' +
                '<div class="pb-wrap-social-btn" data-type-social="0"><a href="' + masSocialLink[0] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/fb.png" alt=""/></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[0] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="1"><a href="' + masSocialLink[1] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/tw.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[1] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="3"><a href="' + masSocialLink[2] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/in.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[2] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="2"><a href="' + masSocialLink[3] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/black/gg.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[3] + '</span>' +
                '</a></div>' +
                '</div></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'calendar') {
            dataJson = '{"containerBackground":"#ffffff", "backgroundImageUrl":"", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#ffffff", "btnBorderType":"None", "btnBorderWidth":"0", "btnBorderColor":"#ffffff", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"Normal", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "display":"0", "layout": "2", "contentToShare":"0", "shareCustomUrl":"0", "shareLink":"", "shareDesc":""}';
            var masSocialText = ['Google Calendar', 'Outlook', 'Yahoo! Calendar'];
            var masSocialLink = ['#', '#', '#'];

            html = "<div class='pb-widget pb-widget--init pb-widget--calendar' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-social-btns pb-social-btns--icn-only pb-social-btns--calendar">' +
                '<div class="pb-social-btns__table"><div class="pb-social-btns__row">' +
                '<div class="pb-wrap-social-btn" data-type-social="12"><a href="' + masSocialLink[0] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/calendar_btns/black/google.png" alt=""/></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[0] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="13"><a href="' + masSocialLink[1] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/calendar_btns/black/outlook.png" alt=""></span>' +
                '<span class="pb-social-btn__text">' + masSocialText[1] + '</span>' +
                '</a></div>' +
                '<div class="pb-wrap-social-btn" data-type-social="16"><a href="' + masSocialLink[2] + '" class="pb-social-btn">' +
                '<span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/calendar_btns/black/yahoo.png" alt=""></span>' +
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
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "count":"2", "borderType":"None", "borderWidth":"0", "borderColor":"#333333", "arrowsColor":"#333333", "dotsColor":"#FF982B", "isArrow":"true", "isDots":"true", "height":"300", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
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
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "count":"2", "borderType":"None", "borderWidth":"0", "borderColor":"#333333", "arrowsColor":"#333333", "dotsColor":"#FF982B", "isArrow":"true", "isDots":"true", "height":"300", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
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
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "borderType":"None", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "borderWidth":"0", "borderColor":"#333333", "width":"100%", "radius":"0", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"35px", "paddingBottom":"50px"}';
            var dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "30", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto", "maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonBtn = '{"buttonText":"Subscribe Now","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"1","borderColor":"##CC7A23","borderType":"Solid","radius":"None","paddingX":"10","paddingY":"9", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField = '{"placeholder":"Your name", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"text", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField2 = '{"placeholder":"Your email address", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"email", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"275px", "minHeight":"0","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
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
                '<div class="pb-widget__content pb-container-grid">' +


                "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="text" class="pb-txt-field" placeholder="Your name"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField2 + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="email" class="pb-txt-field" placeholder="Your email address"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 100%; padding: 0;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn pb-btn--full-width" style="padding: 9px 10px; border-width: 1px; border-color: #CC7A23; border-style: solid;">Subscribe Now</a>' +
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
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "borderType":"None", "borderWidth":"0", "borderColor":"#333333", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "width":"100%", "radius":"0", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"35px", "paddingBottom":"50px"}';
            var dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "30", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto", "maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonBtn = '{"buttonText":"Subscribe Now","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"1","borderColor":"##CC7A23","borderType":"Solid","radius":"None","paddingX":"10","paddingY":"9", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField = '{"placeholder":"Your name", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"text", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField2 = '{"placeholder":"Your email address", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"email", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonGrid = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "radius":"0", "width":"90%", "minHeight":"0", "gridSize1": "33", "gridSize2": "34","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';

            var htmlField_1 = "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="text" class="pb-txt-field" placeholder="Your name"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

            var htmlField_2 = "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField2 + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="email" class="pb-txt-field" placeholder="Your email address"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

            var htmlBtton = "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 100%; padding: 0;'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn pb-btn--full-width" style="padding: 9px 10px; border-width: 1px; border-color: #CC7A23; border-style: solid;">Subscribe Now</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';

            html = "<div class='pb-widget pb-widget--init pb-widget--horizontal-form' data-type='" + type + "' data-json='" + dataJson + "' style='padding-top: 35px; padding-bottom: 50px;'>" +
                '<div class="pb-widget__content pb-form-grid pb-form-contains-widget">' +
                pageBuilder.getWidgetHTMLHelper() +
                pageBuilder.getWidgetHTMLBtnRemove() +

                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='font-weight: bold; line-height: 125%; font-size: 30px; text-align: center;'>" +
                '<div class="pb-widget__content">' +
                '<div class=" pb-editable">' +
                '<div>Get News in Your Email</div>' +
                '<div><br/></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--three-column-grid' data-type='three-column-grid' data-json='" + dataJsonGrid + "'>" +
                '<div class="pb-layout-grid pb-layout-grid--3 pb-clearfix">' +
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
        } else if (type === 'icon') {
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
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"15px", "marginTop":"0", "marginBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0, "marginBottom":"0"}';
            dataJsonBtn = '{"buttonText":"Let&#39;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //SVG
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--logo pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSVG + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 15px; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)"  class="pb-svg-fill" fill="#fb8f04" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
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
                '<span class="pb-header-items__item-text">Item Tree</span>' +
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
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "24", "color":"#fb8f04", "lineHeight": "150", "textAlign":"None", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"2px", "marginBottom":"2px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonBtn = '{"buttonText":"Let&#39;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding:10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "' style=''>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //Text
                "<div class='pb-widget pb-widget--no-remove pb-widget--logo ui-widget-disabled pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='margin-bottom: 2px; margin-top: 2px; font-size: 24px; line-height: 150%; color: #fb8f04; font-weight: bold;'>" +
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
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
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
                '<span class="pb-header-items__item-text">Item Tree</span>' +
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
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding:10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--logo pb-widget--logo-right pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSVG + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)"  class="pb-svg-fill" fill="#fb8f04" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //END SVG
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
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
                '<span class="pb-header-items__item-text">Item Tree</span>' +
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
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
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
                '<span class="pb-header-items__item-text">Item Tree</span>' +
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
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
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
                '<span class="pb-header-items__item-text">Item Tree</span>' +
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
                '</div>';
        } else if (type === 'container' && type2 === 'header-6') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"10px", "paddingBottom":"10px"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"40", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"2", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding:10px 15px;'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 40px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 0; margin-bottom: 0;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
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
                '<span class="pb-header-items__item-text">Item Tree</span>' +
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
        } else if (type === 'container' && type2 === 'footer-7') {
            dataJson = '{"backgroundColor": "#e1e1e1", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"110px", "paddingBottom":"120px"}';
            dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "36", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonText2 = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "20", "color":"#636363", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"20px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonBtn = '{"buttonText":"hello@info.com","url":"mailto:hello@info.com","backgroundColor":"#ffffff", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"Bold","fontSize":"16","color":"#333333","borderWidth":"0","borderColor":"#ffffff","borderType":"Solid","radius":"4","paddingX":"30","paddingY":"15", "width":"100%","maxWidth":"200px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"35px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "' style='padding: 110px 15px 120px; background-color: rgb(225, 225, 225);'>" +
                '<div class="pb-widget__content pb-container-grid">' +
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
                "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 200px; margin-top: 35px; padding: 0;'>" +
                '<div class="pb-widget__content">' +
                '<a href="mailto:hello@info.com" class="pb-btn" style="color: #333333; background-color: #ffffff;font-size: 16px; font-weight: bold; border-width: 0; border-color: #ffffff; border-style: solid; padding: 15px 30px;">hello@info.com</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>' +
                //End Button
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                pageBuilder.getWidgetHTMLBtnRemove() +
                '</div>';
        } else if (type === 'container' && type2 === 'footer-1') {
            html = '<div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;15px&quot;,&quot;paddingBottom&quot;:&quot;20px&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="display: block; width: 100%; max-width: 100%; padding-top: 15px; padding-bottom: 20px; padding-left: 15px; background-color: rgb(255, 255, 255);"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-top: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: left;"><div class="pb-widget__content"><div class="pb-editable"><div>Text Logo<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; line-height: 1.5; color: rgb(51, 51, 51); text-align: left;"><div class="pb-widget__content"><div class="pb-editable"><div>PO Box 1016<br>Allen, Texas 75013-0017<br>United States<br><br>info@business.com<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget pb-blocks--start-sortable"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;2&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: right; margin-top: 0px;"><div class="pb-widget__content" style="padding-right: 15px;"><div class="pb-editable"><div>Follow Us!<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--social-follow" data-type="social-follow" data-json="{&quot;containerBackground&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;containerBorderType&quot;:&quot;None&quot;,&quot;containerBorderWidth&quot;:&quot;0&quot;,&quot;containerBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBackground&quot;:&quot;#ffffff&quot;,&quot;btnBorderType&quot;:&quot;None&quot;,&quot;btnBorderWidth&quot;:&quot;0&quot;,&quot;btnBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBorderRadius&quot;:&quot;5&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;color&quot;:&quot;#505050&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;align&quot;:&quot;2&quot;,&quot;width&quot;:&quot;1&quot;,&quot;styleIcon&quot;:4,&quot;display&quot;:&quot;0&quot;,&quot;layout&quot;:&quot;2&quot;,&quot;contentToShare&quot;:&quot;0&quot;,&quot;shareCustomUrl&quot;:&quot;0&quot;,&quot;shareLink&quot;:&quot;&quot;,&quot;shareDesc&quot;:&quot;&quot;}" style="text-align: right;"><div class="pb-widget__content"><div class="pb-social-btns pb-social-btns--icn-only pb-social-btns--follow" style="background: #fffff; border-color: #ffffff;"><div class="pb-social-btns__table"><div class="pb-social-btns__row"><div class="pb-wrap-social-btn" data-type-social="0"><a href="http://www.facebook.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/gray/fb.png" alt=""></span><span class="pb-social-btn__text">Facebook</span></a></div><div class="pb-wrap-social-btn" data-type-social="1"><a href="http://www.twitter.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/gray/tw.png" alt=""></span><span class="pb-social-btn__text">Twitter</span></a></div><div class="pb-wrap-social-btn" data-type-social="3"><a href="http://www.linkedin.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/gray/in.png" alt=""></span><span class="pb-social-btn__text">LinkedIn</span></a></div></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Social Follow</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'footer-2') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;25px&quot;,&quot;paddingBottom&quot;:&quot;30px&quot;}" style="background-color: rgb(255, 255, 255); padding-bottom: 30px; padding-top: 25px;"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 1000px;"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;600px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:20,&quot;gridSize2&quot;:20,&quot;numberColumns&quot;:5,&quot;gridSize3&quot;:20,&quot;gridSize4&quot;:20}" style="width: 100%; max-width: 600px;"><div class="pb-layout-grid pb-clearfix pb-layout-grid--5"><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Help</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Blog</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>About</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Privacy</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style="width: 19.2%;"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 18px; line-height: 1.5; color: rgb(51, 51, 51); text-align: center;"><div class="pb-widget__content"><div class="pb-editable"><div>Terms</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="display: block; text-align: center; font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; color: rgb(51, 51, 51); margin-top: 15px;"><div class="pb-widget__content" style="padding-top: 0px;"><div class="pb-editable"><div>© 2017 yourcompany<br>All Rights Reserved<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'footer-5') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#232222&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;70px&quot;,&quot;paddingBottom&quot;:&quot;70px&quot;}" style="background-color: rgb(35, 34, 34); padding-top: 70px; padding-bottom: 70px;"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;: &quot;#ffffff&quot;, &quot;backgroundImageUrl&quot;:&quot;&quot;, &quot;borderWidth&quot;:&quot;0&quot;, &quot;borderColor&quot;:&quot;#ffffff&quot;, &quot;borderType&quot;:&quot;None&quot;, &quot;width&quot;:&quot;90%&quot;, &quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;, &quot;marginLeft&quot;:&quot;auto&quot;, &quot;marginRight&quot;:&quot;auto&quot;, &quot;marginTop&quot;:&quot;0&quot;, &quot;marginBottom&quot;:&quot;0&quot;, &quot;paddingLeft&quot;:&quot;0&quot;, &quot;paddingRight&quot;:&quot;0&quot;, &quot;paddingTop&quot;:&quot;0&quot;, &quot;paddingBottom&quot;:&quot;0&quot;, &quot;gridSize1&quot;: &quot;50&quot;, &quot;gridSize2&quot;: &quot;50&quot;}" style="display: block;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--container" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/footers/bg/footer_5.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;200&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="background-image: url(&quot;imgs/page_builder/footers/bg/footer_5.jpg&quot;);"><div class="pb-widget__content pb-container-grid" style="min-height: 200px;"></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;5%&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="display: block;"><div class="pb-widget__content pb-container-grid" style="padding-left: 5%;"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-top: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; line-height: 1.5; color: rgb(255, 255, 255); text-align: left; display: block;"><div class="pb-widget__content" style="padding-left: 15px;"><div class="pb-editable"><div>Follow Us!<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;10px&quot;,&quot;marginBottom&quot;:&quot;3px&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; line-height: 1.5; text-align: left; margin-top: 10px; display: block; margin-bottom: 3px;"><div class="pb-widget__content" style="padding-left: 15px;"><div class="pb-editable"><div>Provide you accurate and live campaign. Scale your infastructure with our simple service. Provide you accurate and live campaign.<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--social-follow" data-type="social-follow" data-json="{&quot;containerBackground&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;containerBorderType&quot;:&quot;None&quot;,&quot;containerBorderWidth&quot;:&quot;0&quot;,&quot;containerBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBackground&quot;:&quot;#ffffff&quot;,&quot;btnBorderType&quot;:&quot;None&quot;,&quot;btnBorderWidth&quot;:&quot;0&quot;,&quot;btnBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBorderRadius&quot;:&quot;5&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;color&quot;:&quot;#505050&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;align&quot;:&quot;0&quot;,&quot;width&quot;:&quot;1&quot;,&quot;styleIcon&quot;:5,&quot;display&quot;:&quot;0&quot;,&quot;layout&quot;:2,&quot;contentToShare&quot;:&quot;0&quot;,&quot;shareCustomUrl&quot;:&quot;0&quot;,&quot;shareLink&quot;:&quot;&quot;,&quot;shareDesc&quot;:&quot;&quot;}"><div class="pb-widget__content"><div class="pb-social-btns pb-social-btns--follow pb-social-btns--icn-only" style="background: #fffff; border-color: #ffffff;"><div class="pb-social-btns__table"><div class="pb-social-btns__row"><div class="pb-wrap-social-btn" data-type-social="0"><a href="http://www.facebook.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/white/fb.png" alt=""></span><span class="pb-social-btn__text">Facebook</span></a></div><div class="pb-wrap-social-btn" data-type-social="1"><a href="http://www.twitter.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/white/tw.png" alt=""></span><span class="pb-social-btn__text">Twitter</span></a></div><div class="pb-wrap-social-btn" data-type-social="3"><a href="http://www.linkedin.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/white/in.png" alt=""></span><span class="pb-social-btn__text">LinkedIn</span></a></div></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Social Follow</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;2px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; color: rgb(255, 255, 255); text-align: left; margin-top: 2px;"><div class="pb-widget__content" style="padding-left: 15px;"><div class="pb-editable"><div>info@business.com<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'footer-6') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/footers/bg/footer_6.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;90px&quot;,&quot;paddingBottom&quot;:&quot;50px&quot;}" style="background-image: url(&quot;imgs/page_builder/footers/bg/footer_6.jpg&quot;); padding: 90px 15px 50px;"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-top: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.5; margin-bottom: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Contact Us</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;15px&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-weight: normal; font-family: Arial, sans-serif; font-size: 20px; text-align: center; color: rgb(255, 255, 255); margin-bottom: 15px; margin-top: 15px;"><div class="pb-widget__content"><div class="pb-editable"><div>Have any questions or just want to say hi?</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--social-follow" data-type="social-follow" data-json="{&quot;containerBackground&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;containerBorderType&quot;:&quot;None&quot;,&quot;containerBorderWidth&quot;:&quot;0&quot;,&quot;containerBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBackground&quot;:&quot;#ffffff&quot;,&quot;btnBorderType&quot;:&quot;None&quot;,&quot;btnBorderWidth&quot;:&quot;0&quot;,&quot;btnBorderColor&quot;:&quot;#ffffff&quot;,&quot;btnBorderRadius&quot;:&quot;5&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;12&quot;,&quot;color&quot;:&quot;#505050&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;align&quot;:&quot;1&quot;,&quot;width&quot;:&quot;1&quot;,&quot;styleIcon&quot;:5,&quot;display&quot;:&quot;0&quot;,&quot;layout&quot;:3,&quot;contentToShare&quot;:&quot;0&quot;,&quot;shareCustomUrl&quot;:&quot;0&quot;,&quot;shareLink&quot;:&quot;&quot;,&quot;shareDesc&quot;:&quot;&quot;}" style="text-align: center;"><div class="pb-widget__content"><div class="pb-social-btns pb-social-btns--follow pb-social-btns--icn-large pb-social-btns--icn-only" style="background: #fffff; border-color: #ffffff;"><div class="pb-social-btns__table"><div class="pb-social-btns__row"><div class="pb-wrap-social-btn" data-type-social="0" style="/*! margin-left: 0; */"><a href="http://www.facebook.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/white/fb.png" alt=""></span><span class="pb-social-btn__text">Facebook</span></a></div><div class="pb-wrap-social-btn" data-type-social="1"><a href="http://www.twitter.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/white/tw.png" alt=""></span><span class="pb-social-btn__text">Twitter</span></a></div><div class="pb-wrap-social-btn" data-type-social="3"><a href="http://www.linkedin.com/" class="pb-social-btn"><span class="pb-social-btn__icn"><img src="imgs/imgs_email_builder/social_btns/white/in.png" alt=""></span><span class="pb-social-btn__text">LinkedIn</span></a></div></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Social Follow</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;14&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;None&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 14px; color: rgb(255, 255, 255); text-align: center; display: block; margin-top: 50px;"><div class="pb-widget__content"><div class="pb-editable"><div>Write us: yourcompany@gmail.com<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-1') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_1.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;190px&quot;,&quot;paddingBottom&quot;:&quot;230px&quot;}" style="padding: 190px 15px 230px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_1.jpg&quot;);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;36&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 515px; font-family: Arial, sans-serif; font-weight: bold; font-size: 36px; color: rgb(255, 255, 255); text-align: left; line-height: 1.25; margin-top: 40px; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Service for medium business</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;30px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: left; max-width: 515px; line-height: 1.5; margin-top: 30px; display: block; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Provide you accurate and live campaign. Scale your infrastructure with our simple service. Provide you accurate and live campaign.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;30px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="max-width: 330px; margin-left: 0px; margin-right: 0px; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 30px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&prime;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&prime;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-2') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_2.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;210px&quot;,&quot;paddingBottom&quot;:&quot;180px&quot;}" style="padding: 210px 15px 180px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_2.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;510px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 510px; margin-right: 0px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 515px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: left; line-height: 1.25; margin-top: 0px; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Service for&nbsp;small and medium business</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;515px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: left; max-width: 515px; line-height: 1.5; margin-top: 40px; display: block; margin-left: 0px; margin-right: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Provide you accurate and live campaign. Scale your infrastructure with our simple service.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;60px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="max-width: 330px; margin-left: 0px; margin-right: 0px; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 60px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&prime;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&prime;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-3') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_3.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;260px&quot;,&quot;paddingBottom&quot;:&quot;260px&quot;}" style="padding-top: 260px; padding-bottom: 260px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_3.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;200&quot;,&quot;height&quot;:&quot;200&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 200px; height: 200px;"><div class="pb-widget__content"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fb8f04" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-4') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_4.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;245px&quot;,&quot;paddingBottom&quot;:&quot;190px&quot;}" style="padding: 245px 15px 190px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_4.jpg&quot;);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;780px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 780px; line-height: 1.25; margin-top: 0px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Help Finding Information Online</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;60px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 60px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>The Best Answers</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;70px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 70px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&prime;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&prime;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-5') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_5.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;240px&quot;,&quot;paddingBottom&quot;:&quot;155px&quot;}" style="padding: 240px 15px 155px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_5.jpg&quot;);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Travelagent India</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;780px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;35px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 780px; line-height: 1.25; margin-top: 35px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>The diseases most commonly seen in travellers are diarrhoea, malaria (if you travel in a malaria-infested area), accidents (when travelling by automobile or swimming), would infections and sexually transmitted diseases.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;45px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 45px;"><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&prime;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let&prime;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-6') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_6.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;110px&quot;,&quot;paddingBottom&quot;:&quot;205px&quot;}" style="padding-top: 110px; padding-left: 15px; padding-right: 15px; padding-bottom: 205px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_6.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;150&quot;,&quot;height&quot;:&quot;150&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 150px; height: 150px;"><div class="pb-widget__content"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fb8f04" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;30&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;860px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;65px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 30px; color: rgb(255, 255, 255); text-align: center; max-width: 860px; line-height: 1.25; margin-top: 65px;"><div class="pb-widget__content"><div class="pb-editable"><div>Some days a motivational quote can provide a quick pick-me-up for employees and even management.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let&prime;s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#5ba7ff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;18&quot;,&quot;color&quot;:&quot;None&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#5ba7ff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;50&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;12&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;170px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;70px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 170px; margin-top: 70px; display: block; padding: 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(91, 167, 255); border-color: rgb(91, 167, 255); border-radius: 50px; font-family: Arial, sans-serif; font-weight: bold; font-size: 18px; padding-top: 12px; padding-bottom: 12px;">Let&prime;s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-7') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_7.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;100px&quot;,&quot;paddingBottom&quot;:&quot;170px&quot;}" style="padding: 100px 15px 170px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_7.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;165&quot;,&quot;height&quot;:&quot;165&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 165px; height: 165px;"><div class="pb-widget__content"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fb8f04" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;75px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 75px;"><div class="pb-widget__content"><div class="pb-editable"><div>Mind Power The Ultimate Success Formula</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;685px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;20px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 685px; line-height: 1.5; margin-top: 20px;"><div class="pb-widget__content"><div class="pb-editable"><div>Some days a motivational quote can provide a quick pick-me-up for employees and even management.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-8') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_8.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;150px&quot;,&quot;paddingBottom&quot;:&quot;115px&quot;}" style="padding: 150px 15px 115px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_8.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="text-align: center; color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>FROM THIS MOMENT ON</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;680px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;45px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 680px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 45px;"><div class="pb-widget__content"><div class="pb-editable"><div>Bryce Canyon A Stumming Us Travel Destination</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;880px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;30px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 880px; line-height: 1.5; margin-top: 30px;"><div class="pb-widget__content"><div class="pb-editable"><div>One of the best ways to make a great vacation quickly horrible is to choose the wrong accommodations for your tip. There is nothing quite as bad as spending a greate day of vacation + only to come back to a less-grate place to stay for the night.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--image" data-type="image" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;52px&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;65px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="width: 52px; display: block; margin-top: 65px;"><div class="pb-widget__content"><div class="pb-load-image"><img src="imgs/page_builder/play_btn_big.png" class="pb-img"></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Image</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-9') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_9.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;285px&quot;,&quot;paddingBottom&quot;:&quot;220px&quot;}" style="padding: 285px 15px 220px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_9.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Cooking For One</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;685px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 685px; line-height: 1.5; margin-top: 40px;"><div class="pb-widget__content"><div class="pb-editable"><div>When it comes to cooking there are few tools that are more versatile in the kitchen than he microwave. This device offers so many functions when it comes to cooking that most people never bother to utilize.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-10') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_10.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;250px&quot;,&quot;paddingBottom&quot;:&quot;160px&quot;}" style="padding: 250px 15px 160px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_10.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--image" data-type="image" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;textAlign&quot;:&quot;0&quot;,&quot;width&quot;:&quot;90px&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="width: 90px; display: block; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-load-image"><img src="imgs/page_builder/play_btn_big.png" class="pb-img"></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Image</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 1000px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 50px;"><div class="pb-widget__content"><div class="pb-editable"><div>Help Finding Information Online</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;890px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;25px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 890px; line-height: 1.5; margin-top: 25px;"><div class="pb-widget__content"><div class="pb-editable"><div>Okay, you&prime;ve decided you ti make money with Affiliate Marketing. So, you join some affiliate programs and start submitting free ads to newsletters and free advertising classifieds sites. You&prime;re going to make BIG money now - right?</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-11') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_11.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;490px&quot;,&quot;paddingBottom&quot;:&quot;80px&quot;}" style="padding: 490px 15px 80px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_11.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 1000px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>From Wetlands To Canals And Dams Amsterdam Is Alive</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;890px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;15px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 890px; line-height: 1.5; margin-top: 15px;"><div class="pb-widget__content"><div class="pb-editable"><div>Five Tips Fot Low Cost Holidays</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-12') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_12.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;225px&quot;,&quot;paddingBottom&quot;:&quot;260px&quot;}" style="padding: 225px 15px 260px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_12.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>Popular Uses Of The Internet</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--divider" data-type="divider" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;2&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;Solid&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;300px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;45px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 300px; margin-top: 45px;"><div class="pb-widget__content" style="padding-top: 0px; padding-bottom: 0px; background-color: rgb(255, 255, 255);"><div class="pb-divider" style="border-color: rgb(255, 255, 255); border-top-width: 2px; border-top-style: solid;"></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Divider</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;850px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;45px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 850px; line-height: 1.5; margin-top: 45px;"><div class="pb-widget__content"><div class="pb-editable"><div>According to the research firm Frost &amp; Sullivan, the estimated size of the North American used test and measurement equipment market was $446.4 million in 2004 and is estimated to grow to $654.5 million by 2011.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-13') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_13.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;200px&quot;,&quot;paddingBottom&quot;:&quot;200px&quot;}" style="padding: 200px 15px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_13.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--svg pb-widget--svg-on" data-type="svg" data-json="{&quot;width&quot;:&quot;84&quot;,&quot;height&quot;:&quot;84&quot;,&quot;fillColor&quot;:&quot;#ffffff&quot;,&quot;strokeColor&quot;:&quot;#ffffff&quot;,&quot;count&quot;:&quot;1&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;}" style="width: 84px; height: 84px;"><div class="pb-widget__content"><div class="pb-load-svg"><svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#fb8f04" stroke="#ffffff"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)" class="pb-svg-fill" fill="#ffffff" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">SVG</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;75px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 75px;"><div class="pb-widget__content"><div class="pb-editable"><div>Cheap Romantic Vacations</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;700px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 700px; line-height: 1.5; margin-top: 50px;"><div class="pb-widget__content"><div class="pb-editable"><div>Admit it. Before you took that first cruise, your thoughts about cruise ships and cruise vacations consisted of flashbacks to Love Boat re-runs.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-14') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_14.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;220px&quot;,&quot;paddingBottom&quot;:&quot;210px&quot;}" style="padding: 220px 15px 210px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_14.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="text-align: center; color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>From This Moment On</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;680px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;40px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 680px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 40px;"><div class="pb-widget__content"><div class="pb-editable"><div>Motivational Quotes For Business</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;840px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;25px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 840px; line-height: 1.5; margin-top: 25px;"><div class="pb-widget__content"><div class="pb-editable"><div>Many people feel that there is a limited amount of abundance, wealth, or chances to succeed in life. Furthermore, there is a solid belief that if one person succeeds, another must fail.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-15') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_15.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;60px&quot;,&quot;paddingBottom&quot;:&quot;60px&quot;}" style="padding: 60px 15px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_15.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;600px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;10px&quot;,&quot;paddingRight&quot;:&quot;10px&quot;,&quot;paddingTop&quot;:&quot;70px&quot;,&quot;paddingBottom&quot;:&quot;50px&quot;}" style="max-width: 600px; background-color: rgb(255, 255, 255); padding: 70px 10px 50px;"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="text-align: center; color: rgb(51, 51, 51); font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>SKIN TEXTURE CHANGES</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;36&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;480px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;75px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 480px; font-family: Arial, sans-serif; font-weight: bold; font-size: 36px; color: rgb(51, 51, 51); text-align: center; line-height: 1.25; margin-top: 75px;"><div class="pb-widget__content"><div class="pb-editable"><div>The 6 Step Non Surgical Facial Rejuvenation Program</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;480px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;70px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(51, 51, 51); text-align: center; max-width: 480px; line-height: 1.5; margin-top: 70px;"><div class="pb-widget__content"><div class="pb-editable"><div>How di we change from that radiant 16 year old width smooth glowing fresh skin to the 40 someting who is beginning to see her mother looking back at her in the mirror to the 65 year old. Let&prime;s review and clearly understand what these changes are that we must look for, recognize and then take steps to correct.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-16') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;imgs/page_builder/covers/bg/cover_16.jpg&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;105px&quot;,&quot;paddingBottom&quot;:&quot;210px&quot;}" style="max-width: 100%; padding: 105px 15px 210px; background-image: url(&quot;imgs/page_builder/covers/bg/cover_16.jpg&quot;);"><div class="pb-widget__content pb-container-grid"><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="text-align: center; color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; line-height: 1.5; margin-top: 0px;"><div class="pb-widget__content"><div class="pb-editable"><div>CHEAP ROMANTIC VACATIONS</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;1000px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;185px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 1000px; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 185px;"><div class="pb-widget__content"><div class="pb-editable"><div>Life Advice Looking Through A Window</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;20&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;150&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;870px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 20px; color: rgb(255, 255, 255); text-align: center; max-width: 870px; line-height: 1.5; margin-top: 50px; display: block;"><div class="pb-widget__content"><div class="pb-editable"><div>Thinking about overseas adventure travel? Have you put any thought into the best places to go when it comes to overseas adventure travel? wilderness so don&prime;t forget them when you are packing fot your overseas adventure travel.</div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-17') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-widget--bg-video-loading pb-widget--bg-video-yt pb-container-contains-widget" data-type="container" data-bgVideoYT="bSXQ5Etde2o" data-json="{&quot;bgVideoYT&quot;:&quot;bSXQ5Etde2o&quot;,&quot;backgroundColor&quot;:&quot;#333333&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;245px&quot;,&quot;paddingBottom&quot;:&quot;175px&quot;}" style="padding: 245px 15px 175px; background-color: rgb(51, 51, 51);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Background Video<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;580px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 580px; line-height: 1.25; margin-top: 50px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>To add background video just simply paste the video link in widget background properties.<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;25px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 25px;"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small"><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let′s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let′s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        } else if (type === 'container' && type2 === 'cover-18') {
            html = '<div class="pb-widget pb-widget--init pb-widget--container pb-widget--bg-video-loading pb-widget--bg-video-vimeo pb-container-contains-widget" data-type="container" data-bgVideoYT="199167955" data-json="{&quot;bgVideoYT&quot;:&quot;199167955&quot;,&quot;backgroundColor&quot;:&quot;#333333&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;15px&quot;,&quot;paddingRight&quot;:&quot;15px&quot;,&quot;paddingTop&quot;:&quot;245px&quot;,&quot;paddingBottom&quot;:&quot;175px&quot;}" style="padding: 245px 15px 175px; background-color: rgb(51, 51, 51);"><div class="pb-widget__content pb-container-grid pb-blocks--start-sortable"><div class="pb-widget pb-widget--init pb-widget--container pb-container-contains-widget" data-type="container" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;borderRadius&quot;:&quot;0&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;960px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 960px;"><div class="pb-widget__content pb-container-grid" style=""><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;48&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="max-width: 100%; font-family: Arial, sans-serif; font-weight: bold; font-size: 48px; color: rgb(255, 255, 255); text-align: center; line-height: 1.25; margin-top: 0px; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>Background Video<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--text" data-type="text" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Normal&quot;,&quot;fontSize&quot;:&quot;24&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;lineHeight&quot;:&quot;125&quot;,&quot;textAlign&quot;:&quot;1&quot;,&quot;width&quot;:&quot;auto&quot;,&quot;maxWidth&quot;:&quot;580px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;50px&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="font-family: Arial, sans-serif; font-weight: normal; font-size: 24px; color: rgb(255, 255, 255); text-align: center; max-width: 580px; line-height: 1.25; margin-top: 50px; display: block; margin-left: auto; margin-right: auto;"><div class="pb-widget__content"><div class="pb-editable"><div>To add background video just simply paste the video link in widget background properties.<br></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Text</div><div class="pb-widget__btn-remove"></div></div><div class="pb-widget pb-widget--init pb-widget--two-column-grid" data-type="two-column-grid" data-json="{&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;borderWidth&quot;:&quot;0&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;minHeight&quot;:&quot;0&quot;,&quot;maxWidth&quot;:&quot;330px&quot;,&quot;marginLeft&quot;:&quot;auto&quot;,&quot;marginRight&quot;:&quot;auto&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;25px&quot;,&quot;paddingBottom&quot;:&quot;0&quot;,&quot;gridSize1&quot;:&quot;50&quot;,&quot;gridSize2&quot;:&quot;50&quot;}" style="max-width: 330px; margin-left: auto; margin-right: auto; width: 100%; margin-top: 0px;"><div class="pb-layout-grid pb-layout-grid--2 pb-clearfix" style="padding-top: 25px;"><div class="pb-layout-grid__cell pb-cell-contains-widget"><div class="pb-helper-drag-drop pb-helper-drag-drop--small"><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;Let′s Go!&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;None&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#ffffff&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;None&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;0&quot;,&quot;paddingRight&quot;:&quot;4px&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 4px 0px 0px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="border-radius: 0px; font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(255, 255, 255); padding-top: 13px; padding-bottom: 13px;">Let′s Go!</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-layout-grid__cell pb-cell-contains-widget" style=""><div class="pb-helper-drag-drop pb-helper-drag-drop--small" style=""><div class="pb-helper-drag-drop__inner"><div class="pb-helper-drag-drop__text">Drop your elements here</div></div></div><div class="pb-widget pb-widget--init pb-widget--button" data-type="button" data-json="{&quot;buttonText&quot;:&quot;How It Works&quot;,&quot;url&quot;:&quot;&quot;,&quot;backgroundColor&quot;:&quot;#ffffff&quot;,&quot;backgroundImageUrl&quot;:&quot;&quot;,&quot;fontTypeFace&quot;:&quot;Arial&quot;,&quot;fontWeight&quot;:&quot;Bold&quot;,&quot;fontSize&quot;:&quot;16&quot;,&quot;color&quot;:&quot;#333333&quot;,&quot;borderWidth&quot;:&quot;None&quot;,&quot;borderColor&quot;:&quot;#ffffff&quot;,&quot;borderType&quot;:&quot;None&quot;,&quot;radius&quot;:&quot;0&quot;,&quot;paddingX&quot;:&quot;None&quot;,&quot;paddingY&quot;:&quot;13&quot;,&quot;width&quot;:&quot;100%&quot;,&quot;maxWidth&quot;:&quot;100%&quot;,&quot;marginLeft&quot;:&quot;0&quot;,&quot;marginRight&quot;:&quot;0&quot;,&quot;marginTop&quot;:&quot;0&quot;,&quot;marginBottom&quot;:&quot;0&quot;,&quot;paddingLeft&quot;:&quot;4px&quot;,&quot;paddingRight&quot;:&quot;0&quot;,&quot;paddingTop&quot;:&quot;0&quot;,&quot;paddingBottom&quot;:&quot;0&quot;}" style="margin-left: 0px; margin-right: 0px; max-width: 100%; padding: 0px 0px 0px 4px;"><div class="pb-widget__content"><a href="javascript:void(0);" class="pb-btn" style="background-color: rgb(255, 255, 255); border-color: rgb(255, 255, 255); font-family: Arial, sans-serif; font-weight: bold; font-size: 16px; color: rgb(51, 51, 51); border-radius: 0px; padding-top: 13px; padding-bottom: 13px;">How It Works</a></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Button</div><div class="pb-widget__btn-remove"></div></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Two column grid</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div></div><div class="pb-widget__placeholder"></div><div class="pb-widget__shadow-label">Container</div><div class="pb-widget__btn-remove"></div></div>';
        }
        return html;
    },
    addElement: function ($el) {
        var type = pageBuilder.getTypeElement($el);

        if (!$el.hasClass('pb-widget')) {
            $el.replaceWith(pageBuilder.getHTMLElement(type, $el));
            pageBuilder.initActionsElements(type);
        }
    },

    initActionsElements: function (type) {
        var $el = $('.pb-widget--init');
        //console.log('init Actions: ' + type);
        if ($el.length) {
            $el.each(function () {
                var $this = $(this);
                var idx = pageBuilder.getIdxWidget($this);
                var type = $this.attr('data-type');
                pageBuilder.addIdxWidget($this, idx);
                pageBuilder.addNameWidget($this);
                pageBuilder.addItemTree($this.attr('data-type'), $this.attr('data-idx'), $this.parents('.pb-widget:first, .pb-blocks:first'));
                pageBuilder.widgetTreeIsElements($('.list-widgets > li'));

                if (type === 'image' || type === 'image-group' || type === 'text-column-with-image' || type === 'image-caption-1' || type === 'image-caption-2' || type === 'slideshow')
                    pageBuilder.loadImage();

                if (type === 'text' || type === 'text-column-with-image' || type === 'image-caption-1' || type === 'image-caption-2' || type === 'two-text-columns' || type === 'columns-caption' || type === 'vertical-form')
                    pageBuilder.initEditorInline();

                if (type !== 'svg' & type !== 'field' & type !== 'video' & type !== 'button' & type !== 'code' & type !== 'icon')
                    pageBuilder.dropFreeImages($this);
            });
            $('.pb-widget--init').removeClass('pb-widget--init');
        }
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
        }
    },
    removeSelectedWidget: function () {
        var $widget = $('.pb-widget--selected');
        var type = $widget.data('type');

        if (type === 'video') {
            pageBuilder.videoBox.setHTML();
        } else if (type === 'code') {
            pageBuilder.codeBox.setHTML();
        }

        $widget.removeClass('pb-widget--selected');
        $('.list-widgets__item--selected').removeClass('list-widgets__item--selected');

        if (pageBuilder.isNewHistory())
            pageBuilder.updateHistory();
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

        $box.find('.pb-tabs-panel__tab:first').trigger('click');
        $box.show();
        pageBuilder.showHideBtnsHistory();
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

        var $widget = $('.pb-widget--' + classType + '[data-idx="' + idx + '"]');
        var isSelected = ($widget.hasClass('pb-widget--selected')) ? true : false;
        var $widgetTreeItem = $('.list-widgets__item--' + classType + '[data-idx="' + idx + '"]');
        var $parentWidgetTreeItem = $widgetTreeItem.parents('.list-widgets__item:first');
        var $parent = $widget.parent();

        if ($widget.length) {
            $widget.remove();
            $widgetTreeItem.remove();

            if ($parent.hasClass('pb-layout-grid__cell') || $parent.hasClass('pb-container-grid') || $parent.hasClass('pb-form-grid'))
                pageBuilder.showHideHelpDragDropCell($parent);
            else
                pageBuilder.showHideHelpDragDropBox($parent);

            pageBuilder.widgetTreeIsElementsParent($parentWidgetTreeItem);
            pageBuilder.widgetTreeIsElements($('.list-widgets > li'));

            if (isSelected)
                pageBuilder.hidePanelSettings();
        }

        $('.pb-editor__column-right > .pb-tabs > .pb-tabs__items > .pb-tabs__item--content').trigger('click');

        pageBuilder.updateHistory();
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
            toolbar: 'heading | fontsizeselect | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | link unlink',
            browser_spellcheck: true,
            fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
            toolbar_items_size: 'small',
            forced_root_block: "div",
            force_br_newlines: true,
            force_p_newlines: false,
            setup: function (editor) {
                editor.addButton('heading', {
                    type: 'menubutton',
                    text: 'Heading',
                    icon: false,
                    menu: [
                        {
                            text: 'Heading 1', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<h1 style="font-size: 36px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h1>');
                            }
                        },
                        {
                            text: 'Heading 2', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<h2 style="font-size: 30px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h2>');
                            }
                        },
                        {
                            text: 'Heading 3', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<h3 style="font-size: 24px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h3>');
                            }
                        },
                        {
                            text: 'Heading 4', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<h4 style="font-size: 18px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h4>');
                            }
                        },
                        {
                            text: 'Heading 5', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<h5 style="font-size: 14px; line-height: 125%; padding:0; margin: 0 0 15px 0;">' + editor.selection.getContent() + '</h5>');
                            }
                        },
                        {
                            text: 'Heading 6', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<h6 style="font-size: 13px; line-height: 125%; padding:0; margin: 0;">' + editor.selection.getContent() + '</h6>');
                            }
                        },
                        {
                            text: 'Paragraph', onclick: function () {
                                editor.execCommand('mceInsertRawHTML', false, '<p>' + editor.selection.getContent() + '</p>');
                            }
                        }
                    ]
                });
                editor.on('init', function (e) {
                    tinymce.get(editor.id).hide();
                    editor.changeHistory = false;
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

            }
        });
    },
    showHideEditorInline: function ($editor) {
        //console.log($editor);
        var $box = $editor.parents('.pb-widget');
        var idEditor = $editor.attr('id');
        console.log(idEditor);
        if (!$box.hasClass('ui-widget-disabled')) {
            $box.addClass('ui-widget-disabled');
            tinymce.get(idEditor).show();
            tinymce.get(idEditor).focus();
        }
    },
    disabledEditorInline: function ($editor, idEditor) {
        var $box = $editor.parents('.pb-widget');
        $box.removeClass('ui-widget-disabled');
        tinymce.get(idEditor).hide();

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
    initGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        if (!opt) return false;

        $tpl.css({
            backgroundColor: opt.backgroundColor,
            backgroundImahe: 'url(' + opt.backgroundImageUrl + ')',
            fontFamily: opt.fontTypeFace + ', sans-serif',
            fontSize: opt.fontSize + 'px',
            lineHeight: pageBuilder.lineHeightInEm(opt.lineHeight),
            color: opt.color,
            fontWeight: opt.fontWeight,
        });

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
        $('#templateTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
        $("#templateTypeFace").trigger('liszt:updated');

        $('#templateFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
        $("#templateFontWeight").trigger('liszt:updated');

        $('#templateFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
        $("#templateFontSize").trigger('liszt:updated');

        $('#templateLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
        $("#templateLineHeight").trigger('liszt:updated');

        $('#templateColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

        /*Button*/
        $('#btnGlobalBackground').colpickSetColor(opt.btnBackgroundColor, true).css('background-color', opt.btnBackgroundColor);

        $('#btnGlobalBorderType option[value="' + opt.btnBorderType + '"]').attr('selected', true);
        $("#btnGlobalBorderType").trigger('liszt:updated');
        $('#btnGlobalBorderWidth').val(opt.btnBorderWidth);
        $('#btnGlobalBorderColor').colpickSetColor(opt.btnBorderColor, true).css('background-color', opt.btnBorderColor);
        $('#btnGlobalBorderRadius').val(opt.btnBorderRadius);

        $('#btnGlobalTypeFace option[value="' + opt.btnfontTypeFace + '"]').attr('selected', true);
        $("#btnGlobalTypeFace").trigger('liszt:updated');
        $('#btnGlobalWeight option[value="' + opt.btnFontWeight + '"]').attr('selected', true);
        $("#btnGlobalWeight").trigger('liszt:updated');
        $('#btnGlobalSize option[value="' + opt.btnFontSize + '"]').attr('selected', true);
        $("#btnGlobalSize").trigger('liszt:updated');
        $('#btnGlobalTextColor').colpickSetColor(opt.btnColor, true).css('background-color', opt.btnColor);

        $('#btnGlobalPaddingX').val(opt.btnPaddingX);
        $('#btnGlobalPaddingY').val(opt.btnPaddingY);

        /*Link*/
        $('#linkGlobalColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
        $('#linkGlobalWeight option[value="' + opt.linkWeight + '"]').attr('selected', true);
        $("#linkGlobalWeight").trigger('liszt:updated');
        $('#linkGlobalTextDecoration option[value="' + opt.linkTextDecoration + '"]').attr('selected', true);
        $("#linkGlobalTextDecoration").trigger('liszt:updated');
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
            cssBox.style.fontFamily = opt.btnfontTypeFace + ', sans-serif';
            cssBox.style.fontSize = opt.btnFontSize + 'px';
            cssBox.style.fontWeight = btnWeight;
            cssBox.style.color = opt.btnColor;
            cssBox.style.padding = opt.btnPaddingY + 'px ' + opt.btnPaddingX + 'px';
            cssBox.style.borderRadius = opt.btnBorderRadius + "px";

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
            //console.log(htmlCss); //-  htmlCss - add code style email in template.html
        }
    },
    setIndividualOptions: function ($widget) {
        var opt = $widget.data('json');
        var type = $widget.data('type');
        var $tplGlobal = $('#pb-template');
        var optGlobal = $tplGlobal.data('json');

        if (type === 'text') {
            $('#textBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#textTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#textTypeFace").trigger('liszt:updated');
            $('#textFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#textFontWeight").trigger('liszt:updated');
            $('#textFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#textFontSize").trigger('liszt:updated');
            $('#textLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#textLineHeight").trigger('liszt:updated');
            $('#textColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#textAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#textAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');
            setSettingCssWidget($('#pb-panel__text'));
            setSettingsBackgroundImage($('#pb-panel__text'));
        } else if (type === 'image') {
            $('#imageBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#imageAlign').find('li').removeClass('pb-text-align--selected').eq(opt.textAlign).addClass('pb-text-align--selected');
            pageBuilder.setOptionsImage();
            setSettingCssWidget($('#pb-panel__image'));
        } else if (type === 'image-group') {
            $('#imageGroupBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            pageBuilder.setOptionsLayoutImageGroup();
            pageBuilder.setOptionsImageGroup();
            setSettingCssWidget($('#pb-panel__image-group'));
            setSettingsBackgroundImage($('#pb-panel__image-group'));
        } else if (type === 'svg') {
            $('#svgWidth').val(opt.width);
            $('#svgHeight').val(opt.height);
            $('#svgFillColor').colpickSetColor(opt.fillColor, true).css('background-color', opt.fillColor);
            $('#svgStrokeColor').colpickSetColor(opt.strokeColor, true).css('background-color', opt.strokeColor);

            if (opt.count !== '0')
                $('.pb-box-btn-upload-svg').removeClass('pb-box-btn-upload-svg--none');
            else
                $('.pb-box-btn-upload-svg').addClass('pb-box-btn-upload-svg--none');

            setSettingCssWidget($('#pb-panel__svg'));
        } else if (type === 'code') {
            var html = $widget.find('.pb-code-box').html();
            pageBuilder.codeBox.editor.setValue(html);
        } else if (type === 'video') {
            var html = $widget.find('.pb-video-box').html();
            pageBuilder.videoBox.editor.setValue(html);
        } else if (type === 'divider') {
            $('#dividerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);

            $('#dividerBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#dividerBorderType").trigger('liszt:updated');

            $('#dividerBorderWidth').val(opt.borderWidth);
            $('#dividerBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            setSettingCssWidget($('#pb-panel__divider'));
            setSettingsBackgroundImage($('#pb-panel__divider'));
        } else if (type === 'social-share' || type === 'social-follow' || type === 'calendar') {
            $('#socialContainerBackground').colpickSetColor(opt.containerBackground, true).css('background-color', opt.containerBackground);
            $('#socialContainerBorderType option[value="' + opt.containerBorderType + '"]').attr('selected', true);
            $("#socialContainerBorderType").trigger('liszt:updated');
            $('#socialContainerBorderWidth').val(opt.containerBorderWidth);
            $('#socialContainerBorderColor').colpickSetColor(opt.containerBorderColor, true).css('background-color', opt.containerBorderColor);

            $('#socialButtonBackground').colpickSetColor(opt.btnBackground, true).css('background-color', opt.btnBackground);
            $('#socialButtonBorderType option[value="' + opt.btnBorderType + '"]').attr('selected', true);
            $("#socialButtonBorderType").trigger('liszt:updated');
            $('#socialButtonBorderWidth').val(opt.btnBorderWidth);
            $('#socialButtonBorderColor').colpickSetColor(opt.btnBorderColor, true).css('background-color', opt.btnBorderColor);

            $('#socialButtonBorderRadius').val(opt.btnBorderRadius);

            $('#socialButtonTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#socialButtonTypeFace").trigger('liszt:updated');
            $('#socialButtonWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#socialButtonWeight").trigger('liszt:updated');
            $('#socialButtonSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#socialButtonSize").trigger('liszt:updated');
            $('#socialButtonTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);

            $('#socialButtonLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#socialButtonLineHeight").trigger('liszt:updated');

            $('#socialBtnAlign option[value="' + opt.align + '"]').attr('selected', true);
            $("#socialBtnAlign").trigger('liszt:updated');
            $('#socialBtnWidth option[value="' + opt.width + '"]').attr('selected', true);
            $("#socialBtnWidth").trigger('liszt:updated');

            if (type == 'social-follow' || type == 'calendar') {
                $('.pb-field--social-btn-display').show();
                $('#socialBtnDisplay option[value="' + opt.display + '"]').attr('selected', true);
                $("#socialBtnDisplay").trigger('liszt:updated');
                $('.pb-list-group-social__fields').hide();
            } else {
                $('.pb-field--social-btn-display').hide();
                $('.pb-list-group-social__fields').show();
            }

            $('.pb-social-style-icn li').eq(opt.styleIcon).addClass('pb-social-style-icn__item--selected').siblings('li').removeClass('pb-social-style-icn__item--selected');

            $('#pb-select-content-to-share option[value="' + opt.shareCustomUrl + '"]').attr('selected', true);
            $("#pb-select-content-to-share").trigger('liszt:updated');

            $('.pb-social-style-icn').find('li img').show();
            $('.pb-wrap-btn-update-calendar-email, .pb-calendar-fields').hide();

            if (opt.contentToShare == '1') {
                $('.pb-content-to-share').show();
                $('.pb-social-style-icn').find('.pb-icn-follow').hide();
                $('.pb-social-style-icn').find('.pb-icn-calendar').hide();
                if (opt.shareCustomUrl == '1') {
                    $('.pb-content-to-share__custom').show();
                    $('#shareCustomLink').val(opt.shareLink);
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
        } else if (type === 'button') {
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

            $('#btnBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#btnBorderType").trigger('liszt:updated');
            $('#btnBorderWidth').val(borderWidth);
            $('#btnBorderColor').colpickSetColor(borderColor, true).css('background-color', borderColor);
            $('#btnBorderRadius').val(radius);

            $('#btnTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#btnTypeFace").trigger('liszt:updated');
            $('#btnWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#btnWeight").trigger('liszt:updated');
            $('#btnSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#btnSize").trigger('liszt:updated');
            $('#btnTextColor').colpickSetColor(color, true).css('background-color', color);
            $('#btnPaddingX').val(paddingX);
            $('#btnPaddingY').val(paddingY);

            $('#btnText').val(opt.buttonText);
            $('#btnUrl').val(opt.url);
            setSettingCssWidget($('#pb-panel__button'));
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

            pageBuilder.sliderImgCaptionOneGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#imgCaptionOneGrid'), [opt.gridSize1]);
            setSettingCssWidget($('#pb-panel__image-caption-1'));
            setSettingsBackgroundImage($('#pb-panel__image-caption-1'));
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

            pageBuilder.sliderImgCaptionTwoGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#imgCaptionTwoGrid'), [opt.gridSize1]);
            pageBuilder.showHideGridSizeColumns();
            setSettingCssWidget($('#pb-panel__image-caption-2'));
            setSettingsBackgroundImage($('#pb-panel__image-caption-2'));
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

            pageBuilder.sliderTextColumnsWithImgGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#textColumnsWithImgGrid'), [opt.gridSize1]);
            pageBuilder.showHideGridSizeColumns();
            setSettingCssWidget($('#pb-panel__text-column-with-image'));
            setSettingsBackgroundImage($('#pb-panel__text-column-with-image'));
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

            pageBuilder.sliderTwoTextColumnsGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#twoTextColumnsGrid'), [opt.gridSize1]);
            setSettingCssWidget($('#pb-panel__two-text-columns'));
            setSettingsBackgroundImage($('#pb-panel__two-text-columns'));
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

            pageBuilder.sliderColumnsCaptionGrid.noUiSlider.set(opt.gridSize1);
            pageBuilder.setGridSizeColumns($('#columnsCaptionGrid'), [opt.gridSize1]);
            pageBuilder.showHideGridSizeColumns();
            setSettingCssWidget($('#pb-panel__columns-caption'));
            setSettingsBackgroundImage($('#pb-panel__columns-caption'));
        } else if (type === 'slideshow' || type === 'vertical-slideshow') {
            pageBuilder.addHTMLImageGroupList(true);
            $('.pb-list-image--slideshow .pb-image__item:first').trigger('click');

            $('#slideshowBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#slideshowBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#slideshowBorderType").trigger('liszt:updated');
            $("#slideshowBorderWidth").val(opt.borderWidth);
            $('#slideshowBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#slideshowArrowsColor').colpickSetColor(opt.arrowsColor, true).css('background-color', opt.arrowsColor);
            $('#slideshowDotsColor').colpickSetColor(opt.dotsColor, true).css('background-color', opt.dotsColor);
            $('#slideshowHeight').val(opt.height)
            setSettingCssWidget($('#pb-panel__slideshow'));
            setSettingsBackgroundImage($('#pb-panel__slideshow'));
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
            $('#twoGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#twoGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#twoGridBorderType").trigger('liszt:updated');
            $('#twoGridBorderWidth').val(opt.borderWidth);
            $('#twoGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#twoGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__two-column-grid'));
            setSettingsBackgroundImage($('#pb-panel__two-column-grid'));
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
            $('#threeGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#threeGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#threeGridBorderType").trigger('liszt:updated');
            $('#threeGridBorderWidth').val(opt.borderWidth);
            $('#threeGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#threeGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__three-column-grid'));
            setSettingsBackgroundImage($('#pb-panel__three-column-grid'));
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
            $('#unevenGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#unevenGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#unevenGridBorderType").trigger('liszt:updated');
            $('#unevenGridBorderWidth').val(opt.borderWidth);
            $('#unevenGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#unevenGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__uneven-grid'));
            setSettingsBackgroundImage($('#pb-panel__uneven-grid'));
        } else if (type === 'container') {
            $('#containerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);

            if (opt.bgVideoYT) {
                $('.pb-bg-video-yt').show().find('#bgVideoYT').val(opt.bgVideoYT);
                if ($widget.hasClass('pb-widget--bg-video-yt')) {
                    $('#bgVideoYT').attr('data-default-id', 'bSXQ5Etde2o');
                    $('.pb-bg-video-yt > label').text('Background Video (YouTube Video ID)');
                } else {
                    $('#bgVideoYT').attr('data-default-id', '199167955');
                    $('.pb-bg-video-yt > label').text('Background Video (Vimeo Video ID)');
                }
            } else {
                $('.pb-bg-video-yt').hide();
            }

            $('#containerBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#containerBorderType").trigger('liszt:updated');
            $('#containerBorderWidth').val(opt.borderWidth);
            $('#containerBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#containerBorderRadius').val(opt.borderRadius);
            $('#containerMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__container'));
            setSettingsBackgroundImage($('#pb-panel__container'));
        } else if (type === 'field') {
            $('#fieldPlaceholder').val(opt.placeholder);
            $('#fieldBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#fieldBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#fieldBorderType").trigger('liszt:updated');
            $('#fieldBorderWidth').val(opt.borderWidth);
            $('#fieldBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#fieldBorderRadius').val(opt.radius);
            $('#fieldTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#fieldTypeFace").trigger('liszt:updated');
            $('#fieldFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#fieldFontSize").trigger('liszt:updated');
            $('#fieldTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#fieldPaddingX').val(opt.paddingX);
            $('#fieldPaddingY').val(opt.paddingY);
            $('#fieldType option[value="' + opt.type + '"]').attr('selected', true);
            $("#fieldType").trigger('liszt:updated');
            setSettingCssWidget($('#pb-panel__field'));
        } else if (type === 'vertical-form' || type === 'horizontal-form') {
            $('#formBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#formBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#formBorderType").trigger('liszt:updated');
            $('#formBorderWidth').val(opt.borderWidth);
            $('#formBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#formBorderRadius').val(opt.radius);


            $('#formTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#formTypeFace").trigger('liszt:updated');
            $('#formFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#formFontWeight").trigger('liszt:updated');
            $('#formFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#formFontSize").trigger('liszt:updated');
            $('#formLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#formLineHeight").trigger('liszt:updated');
            $('#formColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#formAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#formAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');
            setSettingCssWidget($('#pb-panel__text'));

            setSettingCssWidget($('#pb-panel__vertical-form'));
            setSettingsBackgroundImage($('#pb-panel__vertical-form'));
        } else if (type === 'icon') {
            $('#iconColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#iconHeight').val(opt.height);
            setSettingCssWidget($('#pb-panel__icon'));
        } else if (type === 'nav-items') {
            $('#itemsBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#itemsTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#itemsTypeFace").trigger('liszt:updated');
            $('#itemsFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#itemsFontWeight").trigger('liszt:updated');
            $('#itemsFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#itemsFontSize").trigger('liszt:updated');
            $('#itemsLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#itemsLineHeight").trigger('liszt:updated');
            $('#itemsColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#itemsAlign').find('li').removeClass('pb-text-align--selected');
            if (opt.textAlign != "None")
                $('#itemsAlign').find('li').eq(opt.textAlign).addClass('pb-text-align--selected');

            if ($widget.hasClass('pb-header-items--mobile-show'))
                $('.pb-btn-open-menu').text('Close Menu');
            else
                $('.pb-btn-open-menu').text('Open Menu');

            setSettingCssWidget($('#pb-panel__nav-items'));
            setSettingsBackgroundImage($('#pb-panel__nav-items'));
        } else if (type === 'nav-item') {
            $('#itemBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#itemTypeFace option[value="' + opt.fontTypeFace + '"]').attr('selected', true);
            $("#itemTypeFace").trigger('liszt:updated');
            $('#itemFontWeight option[value="' + opt.fontWeight + '"]').attr('selected', true);
            $("#itemFontWeight").trigger('liszt:updated');
            $('#itemFontSize option[value="' + opt.fontSize + '"]').attr('selected', true);
            $("#itemFontSize").trigger('liszt:updated');
            $('#itemLineHeight option[value="' + opt.lineHeight + '"]').attr('selected', true);
            $("#itemLineHeight").trigger('liszt:updated');
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

            setSettingCssWidget($('#pb-panel__nav-item'));
            setSettingsBackgroundImage($('#pb-panel__nav-item'));
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

            if (opt.fontTypeFace === 'None')
                $tpl.css('font-family', '');
            else
                $tpl.css('font-family', opt.fontTypeFace + ', sans-serif');

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

        $('#textLineHeight, #imgCaptionOneLineHeight, #imgCaptionTwoLineHeight, #textColumnsWithImgLineHeight, #twoTextColumnsLineHeight, #columnsCaptionLineHeight, #formLineHeight, #itemsLineHeight, #itemLineHeight').change(function () {
            getTplOpt();
            opt.lineHeight = $(this).val();

            if (opt.lineHeight === 'None')
                $tpl.css('line-height', '');
            else
                $tpl.css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));

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
                $tpl.find('.pb-social-btn').css('font-family', opt.fontTypeFace + ', sans-serif');
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

            if (opt.fontTypeFace === 'None')
                $tpl.find('.pb-btn').css('font-family', '');
            else
                $tpl.find('.pb-btn').css('font-family', opt.fontTypeFace + ', sans-serif');

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
        $('#btnText').on('keyup', function () {
            getTplOpt();
            opt.buttonText = $.trim($(this).val());

            if (opt.buttonText === '') opt.buttonText = 'Make Your Purchase';

            $tpl.find('.pb-btn').text(opt.buttonText);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
        $('#btnUrl').on('keyup', function () {
            getTplOpt();
            opt.url = $.trim($(this).val());

            if (opt.url === '') {
                opt.url = '';
                $tpl.find('.pb-btn').attr('href', '#');
            } else {
                $tpl.find('.pb-btn').attr('href', opt.url);
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
            $tpl.attr('data-json', JSON.stringify(opt));
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

            if (opt.fontTypeFace === 'None')
                $tpl.find('.pb-txt-field').css('font-family', '');
            else
                $tpl.find('.pb-txt-field').css('font-family', opt.fontTypeFace + ', sans-serif');

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
        $('#fieldPlaceholder').on('keyup', function () {
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

            if (opt.fontTypeFace !== 'None')
                fontFamily = opt.fontTypeFace + ', sans-serif';

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
        //BGVIDEO YT
        $('#bgVideoYT').change(function () {
            getTplOpt();
            var $input = $(this);
            var val = $.trim($input.val());

            if (val == '') {
                val = $input.attr('data-default-id');
                $input.val(val);
            }

            opt.bgVideoYT = val;
            $tpl.attr('data-bgvideoyt', opt.bgVideoYT);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });
    },
    updateGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        $('#templateTypeFace').change(function () {
            opt.fontTypeFace = $(this).val();
            $tpl.css('font-family', opt.fontTypeFace + ', sans-serif');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#templateFontWeight').change(function () {
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight', opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#templateFontSize').change(function () {
            opt.fontSize = $(this).val();
            $tpl.css('font-size', opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#templateLineHeight').change(function () {
            opt.lineHeight = $(this).val();
            $tpl.css('line-height', pageBuilder.lineHeightInEm(opt.lineHeight));
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.setNewActionHistory();
        });

        $('#btnGlobalBorderType').change(function () {
            opt.btnBorderType = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalBorderWidth').change(function () {
            opt.btnBorderWidth = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalBorderRadius').change(function () {
            opt.btnBorderRadius = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalTypeFace').change(function () {
            opt.btnfontTypeFace = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalWeight').change(function () {
            opt.btnFontWeight = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalSize').change(function () {
            opt.btnFontSize = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalPaddingX').change(function () {
            opt.btnPaddingX = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#btnGlobalPaddingY').change(function () {
            opt.btnPaddingY = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
            pageBuilder.setNewActionHistory();
        });
        $('#linkGlobalWeight').change(function () {
            opt.linkWeight = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('link');
            pageBuilder.setNewActionHistory();
        });
        $('#linkGlobalTextDecoration').change(function () {
            opt.linkTextDecoration = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('link');
            pageBuilder.setNewActionHistory();
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
        } else if (id == 'textBackground' || id == 'imageBackground' || id == 'imageGroupBackground' || id == 'imgCaptionOneBackground' || id == 'imgCaptionTwoBackground' || id == 'textColumnsWithImgBackground' || id == 'twoTextColumnsBackground' || id == 'columnsCaptionBackground' || id == 'itemsBackground' || id == 'itemBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'textColor' || id == 'imgCaptionOneColor' || id == 'imgCaptionTwoColor' || id == 'textColumnsWithImgColor' || id == 'twoTextColumnsColor' || id == 'columnsCaptionColor' || id == 'formColor' || id == 'itemsColor' || id == 'itemColor') {
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'svgFillColor') {
            opt.fillColor = '#' + hex;
            if ($tpl.find('.pb-load-svg svg').find('.pb-svg-fill').length)
                $tpl.find('.pb-load-svg svg').find('.pb-svg-fill').attr('fill', opt.fillColor);
            else
                $tpl.find('.pb-load-svg svg').attr('fill', opt.fillColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'svgStrokeColor') {
            opt.strokeColor = '#' + hex;
            if ($tpl.find('.pb-load-svg svg').find('.pb-svg-stroke').length)
                $tpl.find('.pb-load-svg svg').find('.pb-svg-stroke').attr('stroke', opt.strokeColor);
            else
                $tpl.find('.pb-load-svg svg').attr('stroke', opt.strokeColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'dividerBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'dividerBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.find('.pb-divider').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'socialContainerBackground') {
            opt.containerBackground = '#' + hex;
            $tpl.find('.pb-social-btns').css('background-color', opt.containerBackground);
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
            $tpl.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('button');
        } else if (id == 'btnGlobalBorderColor') {
            optGlobal.btnBorderColor = '#' + hex;
            $tpl.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('button');
        } else if (id == 'btnGlobalTextColor') {
            optGlobal.btnColor = '#' + hex;
            $tpl.attr('data-json', JSON.stringify(optGlobal));
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
            $tpl.attr('data-json', JSON.stringify(optGlobal));
            pageBuilder.updateInlineCss('link');
        } else if (id == 'slideshowBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
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
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'containerBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoGridBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'threeGridBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'threeGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'unevenGridBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'unevenGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'formBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
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
            pageBuilder.openUploader();
            //pageBuilder.insertImage($(this), false, null);
        });
    },
    insertImage: function ($box, isBrowse, urlImage) {
        var src = 'https://s3.amazonaws.com/ll-demo-001/media-manager-file-uploads/customers/11295/root/professionalservices.jpg' || urlImage;
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
        } else {
            $imgBoxTpl.find('img.pb-img').attr('src', src);
        }

        $imgBoxTpl.removeClass('pb-load-image--none');

        if ($list) {
            $imgBoxPanel = $list.find('.pb-image__item').eq(indexImg);
            $imgBoxPanel.find('.pb-image__icn, .pb-image__meta').remove();
            $imgBoxPanel.append(pageBuilder.addHTMLImage($tpl, indexImg, true));
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
                if ($imgBoxTpl.hasClass('pb-load-image--bg'))
                    $imgBoxTpl.css('background-image', '');
                else
                    $imgBoxTpl.find('img.pb-img').attr('src', '');
                $imgBoxTpl.addClass('pb-load-image--none');
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
    addHTMLImage: function ($tpl, index, isLinkRemove) {
        var html = '';
        var title = 'Upload an Image';
        var size = '66 x 53';
        var $imgBlock = $tpl.find('.pb-load-image').eq(index);
        var urlImg = 'imgs/imgs_email_builder/img_upload.jpg';
        var cssHide = 'pb-image__link--hide';
        var cssHideBrowse = '';
        var cssImageNone = ' pb-image__icn--none';
        var cssHideRemove = 'pb-image__link--hide';

        if (!$imgBlock.hasClass('pb-load-image--none')) {
            if ($imgBlock.hasClass('pb-load-image--bg')) {
                urlImg = $imgBlock.css('background-image');
                urlImg = urlImg.substring(5, urlImg.length - 2);
            }
            else {
                urlImg = $imgBlock.find('img').attr('src');
            }

            cssHide = '';
            cssHideRemove = '';
            cssHideBrowse = 'pb-image__link--hide';
            title = 'Title Image';
            size = '665 x 242';
            cssImageNone = '';
        }

        if (isLinkRemove) cssHideRemove = '';

        html = '<img class="pb-image__icn' + cssImageNone + '" src="' + urlImg + '">' +
            '<div class="pb-image__meta">' +
            '<strong class="pb-image__title">' + title + '</strong>' +
            '<div class="pb-image__size">' + size + '</div>' +
            '<ul class="pb-image__links clearfix">' +
            '<li class="' + cssHideBrowse + '">' +
            '<a href="#" class="pb-image__link-browse">Browse</a>' +
            '</li>' +
            '<li class="' + cssHide + '">' +
            '<a href="#" class="pb-image__link-replace">Replace</a>' +
            '</li>' +
            '<li class="' + cssHide + '">' +
            '<a href="#" class="pb-image__link-edit">Edit</a>' +
            '</li>' +
            '<li class="' + cssHide + '">' +
            '<a href="#" class="pb-image__link-link">Link</a>' +
            '</li>' +
            '<li class="' + cssHide + '">' +
            '<a href="#" class="pb-image__link-alt">Alt</a>' +
            '</li>' +
            '<li class="' + cssHideRemove + '">' +
            '<a href="#" class="pb-image__link-remove">Remove</a>' +
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

            $tpl.find('.pb-code-box').html(html);

            if (html === '')
                $tpl.addClass('pb-widget--code-none')
            else
                $tpl.removeClass('pb-widget--code-none');
        }
    },
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
        var masDefaultFollowText = ['Facebook', 'Twitter', 'Google Plus', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];

        if ($tpl.attr('data-type') == 'social-follow') {
            isFollow = true;
            optionsFollow = '<option value="6">YouTube</option>' +
                '<option value="7">Instagram</option>' +
                '<option value="8">Vimeo</option>' +
                '<option value="9">RSS</option>' +
                '<option value="10">Email</option>' +
                '<option value="11">Website</option>';
        } else if ($tpl.attr('data-type') == 'calendar') {
            isCalendar = true;
            optionsCalendar = '<option value="12">Google</option>' +
                '<option value="13">Outlook</option>' +
                '<option value="14">Outlook Online</option>' +
                '<option value="15">iCalendar</option>' +
                '<option value="16">Yahoo!</option>';
        } else {
            optionsShare = '<option value="5">Forward to Friend</option>';
        }

        if (!isCalendar) {
            optionsSocial = '<option value="0">Facebook</option>' +
                '<option value="1">Twitter</option>' +
                '<option value="2">Google +1</option>' +
                '<option value="3">LinkedIn</option>' +
                '<option value="4">Pinterest</option>';
        }
        $('.pb-list-group-social li').remove();

        $el.each(function (i) {
            var $btn = $(this);
            var type = $btn.attr('data-type-social');
            var $text = $btn.find('.pb-social-btn__text');
            var link = '';
            var text = '';
            var masTextLabel = ['Facebook Page URL', 'Twitter URL or Username', 'Google Plus Profile URL', 'LinkedIn Profile URL', 'Pinterest Board URL', 'Friend Profile URL', 'YouTube Channel URL', 'Instagram Profile URL', 'Vimeo URL', 'RSS URL', 'Email Address', 'Page URL', 'Google Calendar URL', 'Outlook URL', 'Outlook Online URL', 'iCalendar URL', 'Yahoo! Calendar URL'];

            if ($btn.length) {
                link = $btn.find('.pb-social-btn').attr('href');
                text = masDefaultFollowText[$btn.attr('data-type-social')];
            }

            $('.pb-list-group-social').append(
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
                '<input type="text" class="txt-field pb-field-social-text" value="' + text + '" />' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</li>');

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
            if ($box.children('li').length < 11)
                $btn.show();
            else
                $btn.hide();
        } else if (type == 'calendar') {
            if ($box.children('li').length < 5)
                $btn.show();
            else
                $btn.hide();
        } else {
            if ($box.children('li').length < 6)
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
                optionsFollow = '<option value="6">YouTube</option>' +
                    '<option value="7">Instagram</option>' +
                    '<option value="8">Vimeo</option>' +
                    '<option value="9">RSS</option>' +
                    '<option value="10">Email</option>' +
                    '<option value="11">Website</option>';
            } else if (type === 'calendar') {
                isCalendar = true;
                indexIcon = 12;
                labelDefault = 'Google Calendar URL';
                urlDefault = '#';
                textDefault = 'Google Calendar';
                optionsCalendar = '<option value="12">Google</option>' +
                    '<option value="13">Outlook</option>' +
                    '<option value="14">Outlook Online</option>' +
                    '<option value="15">iCalendar</option>' +
                    '<option value="16">Yahoo!</option>';
            } else {
                optionsShare = '<option value="5">Forward to Friend</option>';
            }

            if (!isCalendar) {
                optionsSocial = '<option value="0">Facebook</option>' +
                    '<option value="1">Twitter</option>' +
                    '<option value="2">Google +1</option>' +
                    '<option value="3">LinkedIn</option>' +
                    '<option value="4">Pinterest</option>';
            }

            $('.pb-list-group-social').append(
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

            $('.pb-list-group-social select:visible').chosen();

            if (isFollow) $('.pb-list-group-social .pb-list-group-social__fields').show();

            pageBuilder.countGroupSocial();
            pageBuilder.updateSocialHtml(true);
            pageBuilder.setNewActionHistory();
        });
        $('.pb-list-group-social').on('click', '.pb-item__btn-remove', function () {
            $(this).parents('li').remove();
            pageBuilder.updateSocialHtml();
            $('.pb-list-group-social').children('li').each(function (i) {
                $(this).attr('datasortid', i);
            });
            pageBuilder.countGroupSocial();
            pageBuilder.setNewActionHistory();
        });

        $('.pb-list-group-social').on('keyup', '.pb-field-social-link', function () {
            var $tpl = $('.pb-widget--selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $btn = $tpl.find('.pb-social-btn').eq($li.attr('datasortid'));
            var val = $(this).val();

            if (val == '') val = 'http://';

            $btn.attr('href', val);
            pageBuilder.setNewActionHistory();
        });
        $('.eb-list-group-social').on('keyup', '.pb-field-social-text', function () {
            var $tpl = $('.pb-widget--selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $btn = $tpl.find('.pb-social-btn').eq($li.attr('datasortid'));
            var val = $(this).val();
            var masDefaultFollowText = ['Facebook', 'Twitter', 'Google Plus', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];

            if (val == '') val = masDefaultFollowText[typeIcon];

            $btn.text(val);
            pageBuilder.setNewActionHistory();
        });
        $('#pb-select-content-to-share').change(function () {
            var val = $(this).val();
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            if (parseInt(val)) {
                $('#shareCustomLink').val(opt.shareLink);
                $('#shareShortDesc').val(opt.shareDesc);
                $('.pb-content-to-share__custom').show();
            } else {
                $('.pb-content-to-share__custom').hide();
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
        $('.pb-list-group-social').on('change', '.pb-social-list', function () {
            var val = $(this).val();
            pageBuilder.addNewSocialService(val, $(this));
            pageBuilder.setNewActionHistory();
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
        var $tpl = $('.pb-widget--selected');
        var $conatinerBtns = $tpl.find('.pb-social-btns');
        var $btns = $conatinerBtns.find('.pb-wrap-social-btn');
        var html = '';
        var opt = $tpl.data('json');
        var count = $('.pb-list-group-social').children('li').length;
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

        $('.pb-list-group-social').children('li').each(function (i) {
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
                    $btn.attr('href', 'https://www.facebook.com/');
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
        var masIcon = ['fb.png', 'tw.png', 'gg.png', 'in.png', 'pinterest.png', 'forward.png', 'youtube.png', 'inst.png', 'vimeo.png', 'rss.png', 'email.png', 'website.png', 'google.png', 'outlook.png', 'outlook_online.png', 'icalendar.png', 'yahoo.png'];
        var masTextLabel = ['Facebook Page URL', 'Twitter URL or Username', 'Google Plus Profile URL', 'LinkedIn Profile URL', 'Pinterest Board URL', 'Friend Profile URL', 'YouTube Channel URL', 'Instagram Profile URL', 'Vimeo URL', 'RSS URL', 'Email Address', 'Page URL', 'Google Calendar URL', 'Outlook URL', 'Outlook Online URL', 'iCalendar URL', 'Yahoo! Calendar URL'];
        var masDefaultFollowText = ['Facebook', 'Twitter', 'Google Plus', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];
        var masDefaultShareText = ['Share', 'Tweet', '+1', 'Share', 'Pin', 'Forward'];
        var masDefaultShareUrl = ['http://www.facebook.com/sharer/sharer.php?u=', 'http://twitter.com/intent/tweet?text=', 'https://plus.google.com/share?url=', 'http://www.linkedin.com/shareArticle?url=', 'https://www.pinterest.com/pin/find/?url='];
        var masDefaultFollowUrl = ['http://www.facebook.com/', 'http://www.twitter.com/', 'http://plus.google.com/', 'http://www.linkedin.com/', 'http://www.pinterest.com/', '', 'http://www.youtube.com/', 'http://instagram.com/', 'https://vimeo.com/', 'http://www.yourfeedurl.com/', 'your@email.com', 'http://www.yourwebsite.com/', '#', '#', '#', '#', '#'];
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
        var masDefaultShareUrl = ['http://www.facebook.com/sharer/sharer.php?u=', 'http://twitter.com/intent/tweet?text=', 'https://plus.google.com/share?url=', 'http://www.linkedin.com/shareArticle?url=', 'https://www.pinterest.com/pin/find/?url=', '#'];
        var href = '';
        var customLink = '';
        var customDesc = '';

        if (opt.shareCustomUrl == '1') {
            customLink = opt.shareLink;
            customDesc = opt.shareDesc;
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
                href = masDefaultShareUrl[5];
            }

            $this.find('.pb-social-btn').attr('href', href);
        });
    },
    updateDisplayOption: function () {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var $conatinerBtns = $tpl.find('.pb-social-btns');
        var $containerBtn = $tpl.find('.pb-wrap-social-btn');
        var masIcon = ['fb.png', 'tw.png', 'gg.png', 'in.png', 'pinterest.png', 'forward.png', 'youtube.png', 'inst.png', 'vimeo.png', 'rss.png', 'email.png', 'website.png', 'google.png', 'outlook.png', 'outlook_online.png', 'icalendar.png', 'yahoo.png'];
        var masDefaultFollowText = ['Facebook', 'Twitter', 'Google Plus', 'LinkedIn', 'Pinterest', 'Forward to Friend', 'YouTube', 'Instagram', 'Vimeo', 'RSS', 'Email', 'Website', 'Google Calendar', 'Outlook', 'Outlook Online', 'iCalendar', 'Yahoo! Calendar'];
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
                    'font-family': opt.fontTypeFace + ', sans-serif',
                    'font-size': opt.fontSize + 'px',
                    'color': opt.color,
                    'font-weight': opt.fontWeight
                });

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
    loadSvg: function () {
        $('.pb-blocks').off('dblclick.loadSVG').on('dblclick.loadSVG', '.pb-load-svg', function (e) {
            e.stopPropagation();
            pageBuilder.openUploader();
            //$('.pb-btn-upload-svg').trigger('click');
        });
    },
    addIcnSvg: function ($btn) {
        var $box = $btn.closest('.pb-box-btn-upload-svg');
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');
        var html = '<svg width="84px" height="84px" viewBox="0 0 84 84" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Cover-with-title,-subtitle-and-logo" transform="translate(-558.000000, -203.000000)"  class="pb-svg-fill" fill="#fb8f04" fill-rule="nonzero"> <g id="Group" transform="translate(558.000000, 203.000000)"> <path d="M42,83.8534652 C18.8849695,83.8534652 0.146534832,65.1150305 0.146534832,42 C0.146534832,18.8849695 18.8849695,0.146534832 42,0.146534832 C65.1150305,0.146534832 83.8534652,18.8849695 83.8534652,42 C83.8534652,65.1150305 65.1150305,83.8534652 42,83.8534652 Z M42,80.1465348 C63.0677494,80.1465348 80.1465348,63.0677494 80.1465348,42 C80.1465348,20.9322506 63.0677494,3.85346517 42,3.85346517 C20.9322506,3.85346517 3.85346517,20.9322506 3.85346517,42 C3.85346517,63.0677494 20.9322506,80.1465348 42,80.1465348 Z M41.9746252,21.6923077 C41.8481455,21.6989846 41.7216675,21.7123402 41.6018442,21.7457265 C41.0626434,21.8525641 40.6099807,22.2064632 40.3769921,22.707265 L34.8385306,34.0320513 L22.2704832,35.9017094 C21.6514008,36.0152239 21.1388273,36.4626068 20.9524367,37.0702462 C20.7593881,37.6778855 20.9191514,38.3389419 21.3651578,38.7863248 L30.3651578,47.6538462 L28.2882347,60.1538462 C28.1817258,60.7881949 28.4346853,61.4358974 28.9539152,61.8231846 C29.4731468,62.2037932 30.1654545,62.2638889 30.7379388,61.9700855 L41.9213708,56.0405983 L53.1048028,61.9700855 C53.6772888,62.2638889 54.3695965,62.2037932 54.8888264,61.8231846 C55.408058,61.4358974 55.6610158,60.7881949 55.5545069,60.1538462 L53.4775838,47.6538462 L62.4775838,38.7863248 C62.9235902,38.3389419 63.0833535,37.6778855 62.8903066,37.0702462 C62.703916,36.4626068 62.1913408,36.0152239 61.5722584,35.9017094 L49.004211,34.0320513 L43.4657495,22.707265 C43.1994773,22.1129812 42.626993,21.7190171 41.9746252,21.6923077 Z M41.9213708,27.3547009 L46.3947436,36.3824786 C46.647703,36.8766034 47.126993,37.217147 47.6728501,37.2905983 L57.63143,38.7863248 L50.4420809,45.8376068 C50.0293598,46.2182154 49.8296548,46.7791128 49.9095365,47.3333333 L51.6136785,57.3226496 L42.7201874,52.6217949 C42.2209266,52.3547009 41.621815,52.3547009 41.1225542,52.6217949 L32.2290631,57.3226496 L33.9332051,47.3333333 C34.0130868,46.7791128 33.8133835,46.2182154 33.4006607,45.8376068 L26.2113116,38.7863248 L36.1698915,37.2905983 C36.7157504,37.217147 37.1950403,36.8766034 37.447998,36.3824786 L41.9213708,27.3547009 Z" id="Combined-Shape"></path> </g> </g> </g> </svg>';

        $box.removeClass('pb-box-btn-upload-svg--none');
        $tpl.addClass('pb-widget--svg-on').find('.pb-load-svg').removeClass('pb-load-svg--none').html(html);
        opt.count = '1';
        opt.fillColor = "#fb8f04";
        opt.strokeColor = "#fb8f04";
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
        var $tpl = $tpl || $('.pb-widget--selected');
        var opt = null;
        var url = url || "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0";
        var fileName = 'image.jpeg';

        if (isGlobal)
            var $tpl = $('#pb-template');

        opt = $tpl.data('json');

        opt.backgroundImageUrl = url;

        if ($tpl.hasClass('pb-widget--calendar') || $tpl.hasClass('pb-widget--social-share') || $tpl.hasClass('pb-widget--social-follow')) {
            $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', 'url(' + opt.backgroundImageUrl + ')');
        } else if ($tpl.hasClass('pb-widget--image')) {
            $tpl.find('.pb-load-image').removeClass('pb-load-image--none').find('img').attr('src', url);
            return false;
        } else {
            $tpl.css('background-image', 'url(' + opt.backgroundImageUrl + ')');
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
                $panel.removeClass('pb-media-screen--hide');
                $box.animate({ paddingTop: '30px' }, { duration: 400 });
                $panel.animate({ top: '0' }, { duration: 400, queue: false });
                pageBuilder.responsiveMediaResize($('.pb-editor__column-left .pb-media-screen'));
            } else {
                $toggle.val('off');
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
            var media = $item.attr('data-media');
            var $parent = $item.closest('.pb-editor__column-left, .pb-preview-box');

            $item.addClass('pb-media-screen__item--selected').siblings('.pb-media-screen__item').removeClass('pb-media-screen__item--selected');

            (media === '1920') ? media = '100%' : media = media + 'px';

            if ($parent.hasClass('pb-preview-box'))
                $parent.find('.pb-preview-box__inner').css('width', media);
            else
                $parent.find('.pb-blocks').css('max-width', media);
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
    getSliderValues(opt) {
        var values = [];

        if (opt.numberColumns == '2') {
            values = opt.gridSize1;
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
            $btn.removeClass('ll-active');
            $box.hide();
            pageBuilder.addIframePreview();
            //pageBuilder.iframePreviewContent.find("body").html('');
        } else {
            $btn.addClass('ll-active');
            $box.show();
            $('.pb-preview-box .pb-media-screen .pb-media-screen__item--full').trigger('click');
            pageBuilder.iframePreviewContent.find("body").html($html);
            pageBuilder.resetStyleHTML(pageBuilder.iframePreviewContent.find("body"));
        }
    },
    addIframePreview: function () {
        $('.pb-preview-box').find('.pb-preview-box__inner').html('');
        $('.pb-preview-box').find('.pb-preview-box__inner').html('<iframe src="page_builder_preview.html" id="pb-preview-box__iframe" class="pb-preview-box__iframe"></iframe>');
        $('#pb-preview-box__iframe').off('load').on("load", function () {
            pageBuilder.iframePreviewContent = $("#pb-preview-box__iframe").contents();
            $('#pbBtnPreview').removeClass('disabled');
        });
    },
    resetStyleHTML: function ($html) {
        $html.find('.ui-sortable').removeClass('ui-sortable');
        $html.find('.ui-droppable').removeClass('ui-droppable');
        $html.find('.pb-widget--selected').removeClass('pb-widget--selected');
        $html.find('.pb-widget, .pb-blocks').removeAttr('data-type data-json data-idx data-name');
        $html.find('[data-eqcss-0-0]').removeAttr('data-eqcss-0-0');
        $html.find('[data-eqcss-read]').removeAttr('data-eqcss-read');
        $html.find('.mce-content-body').removeAttr('id contenteditable').removeClass('mce-content-body');
        $html.find('.pb-widget__placeholder, .pb-widget__shadow-label, .pb-helper-drag-drop').remove();

        //$html = $('body');
        var $templateDiv = $html.find('#pb-template');
        var style = $templateDiv.attr('style');
        var id = $templateDiv.attr('id');
        $html.attr('id', id).attr('style', style);
        $templateDiv.removeAttr('style').removeAttr('id');
    },
    openUploaderInit: function () {
        $('.pb-btn-upload-image-computer').find('input').on('click', function () {
            $(this).val('');
        });
        $('.pb-btn-upload-image-computer').find('input').on('change', function () {
            var val = $(this).val();
        });
    },
    openUploader: function () {
        $('.pb-btn-upload-image-computer').find('input').trigger('click');
    },
    eventsHistory: function () {
        if (sessionStorage.getItem('pbHistory') == null)
            pageBuilder.initHistory();
        else
            pageBuilder.addHTMLHistory();

        $('.pb-btn-prev-history').on('click', function (e) {
            e.preventDefault();

            if (!$(this).hasClass('disabled')) {
                sessionStorage.setItem('pbCurrentHistory', pageBuilder.getCurrentHistory() - 1);
                pageBuilder.addHTMLHistory();
            }
        });

        $('.pb-btn-next-history').on('click', function (e) {
            e.preventDefault();

            if (!$(this).hasClass('disabled')) {
                sessionStorage.setItem('pbCurrentHistory', pageBuilder.getCurrentHistory() + 1);
                pageBuilder.addHTMLHistory();
            }
        });
    },
    getCurrentHistory: function () {
        return parseInt(sessionStorage.getItem("pbCurrentHistory"));
    },
    setHistoryHTML: function (currentHistory) {
        var currentHistory = pageBuilder.getCurrentHistory();
        var history = JSON.parse(sessionStorage.getItem('pbHistory'));

        history['0'] = history['0'].slice(0, currentHistory);
        history['0'].push($('.wrap-pb-template').html());

        sessionStorage.setItem('pbHistory', JSON.stringify(history));
        sessionStorage.setItem('pbCurrentHistory', history['0'].length);
        pageBuilder.showHideBtnsHistory();
    },
    updateHistory: function () {
        pageBuilder.setHistoryHTML(pageBuilder.getCurrentHistory());
        pageBuilder.resetActionHistory();
    },
    addHTMLHistory: function () {
        var currentHistory = pageBuilder.getCurrentHistory();
        var history = JSON.parse(sessionStorage.getItem('pbHistory'));

        $('.wrap-pb-template').html(history[0][currentHistory - 1]);
        $('.wrap-pb-template').find('.pb-widget--selected').removeClass('pb-widget--selected');
        $('.wrap-pb-template').find('.mce-content-body').removeAttr('id contenteditable').removeClass('mce-content-body');
        pageBuilder.responsiveMediaUpdate();
        pageBuilder.initMoreEvents();
        pageBuilder.showHideBtnsHistory();
    },
    showHideBtnsHistory: function () {
        var currentHistory = pageBuilder.getCurrentHistory();
        var history = JSON.parse(sessionStorage.getItem('pbHistory'));
        var length = history['0'].length;
        var $btnPrev = $('.pb-btn-prev-history');
        var $btnNext = $('.pb-btn-next-history');

        if (!$('.pb-settings-panel:visible').length) {
            if (currentHistory > 1)
                $btnPrev.removeClass('disabled');
            else
                $btnPrev.addClass('disabled');

            if (currentHistory < length)
                $btnNext.removeClass('disabled');
            else
                $btnNext.addClass('disabled');
        } else {
            $btnNext.addClass('disabled');
            $btnPrev.addClass('disabled');
        }

    },
    initHistory: function () {
        var json = {
            0: []
        };
        pageBuilder.initMoreEvents();
        sessionStorage.setItem('pbHistory', JSON.stringify(json));
        sessionStorage.setItem('pbCurrentHistory', 1);
        pageBuilder.setHistoryHTML();
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
    versionsHTML: function () {
        var maxVersionsHTML = 10;
        var startCharCode = 65;

        $('body').on('click.dropdown-versions', function () {
            hideDropdownForVersionsHTML();
        });
        $('.pb-versions__btns').on('click', '.t-btn', function (e) {
            e.preventDefault();
            var $btn = $(this);

            if ($btn.hasClass('pb-btn-add-new-version')) {
                if (!$btn.hasClass('disabled'))
                    addNewBtnVersionHTML($btn);
            } else {
                e.stopPropagation();
                $btn.addClass('selected').siblings('.t-btn').removeClass('selected');
            }
        });

        $('.pb-versions__btns').on('mouseenter', '.t-btn:not(.pb-btn-add-new-version)', function () {
            var $btn = $(this);
            showDropdownForVersionsHTML($btn);
        });

        $('.pb-versions__dropdown').on('mouseleave', function () {
            hideDropdownForVersionsHTML();
        });

        $('.pb-version__delete').on('click', function () {
            var $btn = $(this).parents('.pb-versions').find('.open-dropdown');
            removeVersionHTML($btn);
        });

        function showDropdownForVersionsHTML($btn) {
            var posLeft = $btn.position().left;
            var $dropdown = $btn.parents('.pb-versions').find('.pb-versions__dropdown');

            $btn.addClass('open-dropdown').siblings('.t-btn').removeClass('open-dropdown');
            $dropdown.css('left', posLeft + 'px').show();
        }

        function hideDropdownForVersionsHTML() {
            $('.open-dropdown').removeClass('.open-dropdown');
            $('.pb-versions__dropdown').hide();
        }

        function addNewBtnVersionHTML($btn) {
            var letter = generateLetter($btn);
            var countCurrentBtns = getCountCurrentBtns($btn);

            if (countCurrentBtns < maxVersionsHTML) {
                $btn.before('<a href="#" class="t-btn t-btn-gray">' + String.fromCharCode(letter) + '</a>');
            }

            isLockedBtn($btn);
        }

        function isLockedBtn($btn) {
            if (getCountCurrentBtns($btn) >= maxVersionsHTML)
                disabledBtnNewVersion($btn);
            else
                enabledBtnNewVersion($btn);
        }

        function getCountCurrentBtns($btn) {
            return $btn.parent().find('.t-btn:not(.pb-btn-add-new-version)').length;
        }

        function generateLetter($btn) {
            var countCurrentBtns = getCountCurrentBtns($btn);

            return startCharCode + countCurrentBtns;
        }

        function refreshAllLetters($btns) {
            $btns.each(function (i) {
                $(this).text(String.fromCharCode(startCharCode + i));
            });
        }

        function removeVersionHTML($btn) {
            var isSelected = false;
            var $box = $btn.parents('.pb-versions');
            var countBtns = getCountCurrentBtns($btn);

            if ($btn.hasClass('selected'))
                isSelected = true;

            if (countBtns > 1) {
                $btn.remove();

                if (isSelected)
                    $box.find('.t-btn:first').addClass('selected');

                refreshAllLetters($box.find('.t-btn:not(.pb-btn-add-new-version)'));
                isLockedBtn($box.find('.pb-btn-add-new-version'));
            }
        }

        function disabledBtnNewVersion($btn) {
            $btn.addClass('disabled');
        }

        function enabledBtnNewVersion($btn) {
            $btn.removeClass('disabled');
        }
    }
}

$(function () {
    pageBuilder.init();
    pageBuilder.versionsHTML();

    var _supportsLocalStorage = !!window.localStorage
        && $.isFunction(localStorage.getItem)
        && $.isFunction(localStorage.setItem)
        && $.isFunction(localStorage.removeItem);

    if (_supportsLocalStorage) {
        pageBuilder.eventsHistory();
    } else {
        pageBuilder.initMoreEvents();
        $('.wrap-btn-history').addClass('wrap-btn-history--hide');
    }
});