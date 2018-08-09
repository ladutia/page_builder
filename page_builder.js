var pageBuilder = {
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
            $(this).parents('.pb-settings-panel').hide();
            pageBuilder.removeSelectedWidget();
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

            if (isSelected) $('.pb-list-image--slideshow:visible').find('.pb-image__item:first').trigger('click');
        });

        $('.pb-add-image-group').on('click', function () {
            pageBuilder.addImageListGroup();
        });

        $('.pb-add-slide').on('click', function () {
            pageBuilder.addImageListSlideshow();
        });

        $('.pb-btn-upload-svg').on('click', function () {
            pageBuilder.addIcnSvg($(this));
        });
        $('.pb-unload-svg__remove').on('click', function () {
            pageBuilder.removeIcnSvg($(this));
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
        $('.pb-grid-size:not(.pb-grid-size--three)').slider({
            range: false,
            min: 5,
            max: 95,
            value: 50,
            slide: function (event, ui) {
                pageBuilder.setGridSizeColumns($(ui.handle).closest('.pb-grid-size'), [ui.value]);
            },
            stop: function (event, ui) {
                pageBuilder.setJSonGridColumns([ui.value]);
                pageBuilder.setWidthGridColumns($(this), [ui.value]);
            }
        });
        $('.pb-grid-size--three').slider({
            range: true,
            min: 5,
            max: 95,
            values: [33, 33],
            slide: function (event, ui) {
                pageBuilder.setGridSizeColumns($(ui.handle).closest('.pb-grid-size'), ui.values);
            },
            stop: function (event, ui) {
                pageBuilder.setJSonGridColumns(ui.values);
                pageBuilder.setWidthGridColumns($(this), ui.values);
            }
        });

        $('.pb-btn-upload-bg-image').on('click', function () {
            var $btn = $(this);
            var $box = $btn.closest('.pb-box-btn-upload-bg-image');
            if ($box.hasClass('pb-box-btn-upload-bg-image--global'))
                pageBuilder.addBgImage($box, true);
            else
                pageBuilder.addBgImage($box);
        });

        $('.pb-unload-bg-image__remove').on('click', function () {
            var $btn = $(this);
            var $box = $btn.closest('.pb-box-btn-upload-bg-image');

            if ($box.hasClass('pb-box-btn-upload-bg-image--global'))
                pageBuilder.removeBgImage($box, true);
            else
                pageBuilder.removeBgImage($box);
        });
        $('.pb-blocks').on('click', '.pb-widget', function (e) {
            e.stopPropagation();
            pageBuilder.selectWidget($(this));
        });
        $('.pb-blocks').on('dblclick', '.pb-editable', function (e) {
            pageBuilder.showHideEditorInline($(this));
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

        pageBuilder.updateInlineCss('button');
        pageBuilder.updateInlineCss('link');
        pageBuilder.dragDropElements();
        pageBuilder.dropFreeImages();
        pageBuilder.draggableFreeImages();
        pageBuilder.colorBox();
        pageBuilder.initGlobalOptions();
        pageBuilder.updateIndividualOptions();
        pageBuilder.loadImage();
        pageBuilder.sortableImageGroup();
        pageBuilder.codeBox.init();
        pageBuilder.videoBox.init();
        pageBuilder.socialIconAction();
        pageBuilder.sortableSocial();
        pageBuilder.widgetTree();
        pageBuilder.responsiveMedia();
        pageBuilder.navItemInit();
    },
    dropFreeImages: function ($el) {
        var $el = $el || $('.pb-widget:not(.pb-widget--svg):not(.pb-widget--icon):not(.pb-widget--field):not(.pb-widget--video):not(.pb-widget--button):not(.pb-widget--code)');
        $el.droppable(
            { accept: '.list-free-images > ul > li', hoverClass: 'pb-widget--drop-free-image', greedy: true, },
            {
                drop: function (event, ui) {
                    var url = $(ui.helper).attr('data-url');
                    pageBuilder.addBgImage(false, false, url, $(this));
                }
            });
    },
    draggableFreeImages: function () {
        $('.list-free-images > ul > li:not(.ui-draggable)').draggable({
            helper: 'clone',
            appendTo: '.page-builder-editor',
            refreshPositions: true
        });
    },
    dragDropElements: function () {
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
        $('.pb-blocks').sortable({
            containment: 'document',
            cursor: 'move',
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
                pageBuilder.showHideHelpDragDropBox($this);
                $this.removeClass('pb-blocks--start-sortable');
                pageBuilder.dragDropColumns();
            },
            receive: function (event, ui) {

            },
            update: function (event, ui) {
                if (!$(ui.item).hasClass('list-elements__item'))
                    pageBuilder.widgetTreeMove($(ui.item));
            }
        });
        pageBuilder.dragDropColumns();
    },
    dragDropColumns: function () {
        $(".pb-layout-grid__cell.ui-sortable, .pb-container-grid.ui-sortable, .pb-form-grid.ui-sortable").sortable('destroy');
        $(".pb-layout-grid__cell, .pb-container-grid, .pb-form-grid").sortable({
            containment: 'document',
            cursor: 'move',
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
                if (!$(ui.item).hasClass('list-elements__item'))
                    pageBuilder.widgetTreeMove($(ui.item));
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
            var idx = $li.attr('data-idx');
            var type = $li.attr('data-type');

            $('.pb-widget--' + type + '[data-idx="' + idx + '"]').trigger('click');
            console.log('click');
        });
        $('.list-widgets').on('click', '.item__delete:not(.item__delete--none)', function (e) {
            e.stopPropagation();
            pageBuilder.removeWidget($(this).closest('.list-widgets__item'));
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
            '<div class="item__content">' + pageBuilder.getWidgetHTMLLabel(type, true) + ' #' + idx + '</div>' +
            '<div class="item__collapse"></div>' +
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
        console.log(type2);
        console.log('type: ' + type);
        if (type === 'container' && !type2) {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--container' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid">' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
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
                '</div>';
        } else if (type === 'image') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "textAlign":"0", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--image' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-load-image pb-load-image--none"><img src="//:0"/ class="pb-img"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
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
                '</div>';
        } else if (type === 'svg') {
            dataJson = '{"width":"80", "height":"80", "fillColor":"#333333", "strokeColor":"#333333", "count":"0", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--svg' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg pb-load-svg--none"></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'video') {
            html = '<div class="pb-widget pb-widget--init pb-widget--video" data-type="' + type + '">' +
                '<div class="pb-widget__content pb-video-box">' +
                '<iframe type="text/html" width="720" height="405" src="https://www.youtube.com/embed/bSXQ5Etde2o?rel=0" frameborder="0" allowfullscreen></iframe>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
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
                '</div>';
        } else if (type === 'button') {
            dataJson = '{"buttonText":"Make Your Purchase","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"None","borderColor":"None","borderType":"None","radius":"None","paddingX":"None","paddingY":"None", "width":"100%","maxWidth":"250px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"15px", "paddingBottom":"15px"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--button' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' +
                '<a href="javascript:void(0);" class="pb-btn">Make Your Purchase</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'divider') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"","borderWidth":1,"borderColor":"#cccccc","borderType":"Solid", "width":"100%","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"15px", "paddingBottom":"15px"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--divider' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content" style="padding-top: 18px; padding-bottom: 18px; background-color: #ffffff;">' +
                '<div class="pb-divider" style="border-top-color: #cccccc; border-top-width: 1px; border-top-style: solid;"></div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'code') {
            dataJson = '';
            html = "<div class='pb-widget pb-widget--init pb-widget--code pb-widget--code-none' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content"><div class="pb-code-box"></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
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
                '</div>';

        } else if (type === 'vertical-form') {
            dataJson = '{"backgroundColor":"#ffffff", "backgroundImageUrl":"", "borderType":"None", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"None", "borderWidth":"0", "borderColor":"#333333", "width":"100%", "radius":"0", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"35px", "paddingBottom":"50px"}';
            var dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "30", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto", "maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"15px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonBtn = '{"buttonText":"Subscribe Now","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"1","borderColor":"##CC7A23","borderType":"Solid","radius":"None","paddingX":"10","paddingY":"9", "width":"100%","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField = '{"placeholder":"Your name", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"text", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonField2 = '{"placeholder":"Your email address", "backgroundColor":"#ffffff", "borderType":"Solid", "borderWidth":"1", "borderColor":"#c9c9c9","fontTypeFace": "None", "fontSize": "16", "color":"#333333", "radius":"4", "width":"100%", "paddingX":"10", "paddingY":"8", "type":"email", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            var dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"275px", "minHeight":"0","maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--vertical-form' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-form-grid pb-form-contains-widget" style="padding-top: 35px; padding-bottom: 50px;">' +
                pageBuilder.getWidgetHTMLHelper() +

                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "'  style='font-weight: bold; line-height: 125%; font-size: 30px; text-align: center;'>" +
                '<div class="pb-widget__content">' +
                '<div class=" pb-editable">' +
                '<div>Get News in Your Email</div>' +
                '<div><br/></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                '</div>' +


                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' style='width: 275px;' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid">' +


                "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="text" class="pb-txt-field" placeholder="Your name"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField2 + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="email" class="pb-txt-field" placeholder="Your email address"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 100%;'>" +
                '<div class="pb-widget__content" style="padding: 0; max-width: 100%;">' +
                '<a href="javascript:void(0);" class="pb-btn pb-btn--full-width" style="padding: 9px 10px; border-width: 1px; border-color: #CC7A23; border-style: solid;">Subscribe Now</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                '</div>' +

                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                '</div>' +


                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
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
                '</div>';

            var htmlField_2 = "<div class='pb-widget pb-widget--init pb-widget--field' data-type='field' data-json='" + dataJsonField2 + "'>" +
                '<div class="pb-widget__content">' +
                '<input type="email" class="pb-txt-field" placeholder="Your email address"/>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('field') +
                '</div>';

            var htmlBtton = "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 100%;'>" +
                '<div class="pb-widget__content" style="padding: 0;">' +
                '<a href="javascript:void(0);" class="pb-btn pb-btn--full-width" style="padding: 9px 10px; border-width: 1px; border-color: #CC7A23; border-style: solid;">Subscribe Now</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                '</div>';

            html = "<div class='pb-widget pb-widget--init pb-widget--horizontal-form' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-form-grid pb-form-contains-widget" style="padding-top: 35px; padding-bottom: 50px;">' +
                pageBuilder.getWidgetHTMLHelper() +

                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='font-weight: bold; line-height: 125%; font-size: 30px; text-align: center;'>" +
                '<div class="pb-widget__content">' +
                '<div class=" pb-editable">' +
                '<div>Get News in Your Email</div>' +
                '<div><br/></div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                '</div>' +

                "<div class='pb-widget pb-widget--init pb-widget--three-column-grid' data-type='three-column-grid' data-json='" + dataJsonGrid + "'>" +
                '<div class="pb-layout-grid pb-layout-grid--3 pb-clearfix">' +
                '<div class="pb-layout-grid__cell pb-cell-contains-widget">' + pageBuilder.getWidgetHTMLHelper() + htmlField_1 + '</div>' +
                '<div class="pb-layout-grid__cell pb-cell-contains-widget">' + pageBuilder.getWidgetHTMLHelper() + htmlField_2 + '</div>' +
                '<div class="pb-layout-grid__cell pb-cell-contains-widget">' + pageBuilder.getWidgetHTMLHelper() + htmlBtton + '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('three-column-grid') +
                '</div>' +

                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'icon') {
            var icnHTML = $el.find('.search-results-list-icon').html();
            dataJson = '{"color":"#333333", "height":"auto", "width":"80px", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            html = "<div class='pb-widget pb-widget--init pb-widget--icon' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content">' + icnHTML + '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'header-1') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"15px", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonBtn = '{"buttonText":"Let&acute;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding-left: 15px; padding-right: 15px;">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "' style=''>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //SVG
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--logo pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSVG + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 15px; margin-top: 10px; margin-bottom: 10px;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M489,255.9c0-0.2,0-0.5,0-0.7c0-1.6,0-3.2-0.1-4.7c0-0.9-0.1-1.8-0.1-2.8  c0-0.9-0.1-1.8-0.1-2.7c-0.1-1.1-0.1-2.2-0.2-3.3c0-0.7-0.1-1.4-0.1-2.1c-0.1-1.2-0.2-2.4-0.3-3.6c0-0.5-0.1-1.1-0.1-1.6  c-0.1-1.3-0.3-2.6-0.4-4c0-0.3-0.1-0.7-0.1-1C474.3,113.2,375.7,22.9,256,22.9S37.7,113.2,24.5,229.5c0,0.3-0.1,0.7-0.1,1  c-0.1,1.3-0.3,2.6-0.4,4c-0.1,0.5-0.1,1.1-0.1,1.6c-0.1,1.2-0.2,2.4-0.3,3.6c0,0.7-0.1,1.4-0.1,2.1c-0.1,1.1-0.1,2.2-0.2,3.3  c0,0.9-0.1,1.8-0.1,2.7c0,0.9-0.1,1.8-0.1,2.8c0,1.6-0.1,3.2-0.1,4.7c0,0.2,0,0.5,0,0.7c0,0,0,0,0,0.1s0,0,0,0.1c0,0.2,0,0.5,0,0.7  c0,1.6,0,3.2,0.1,4.7c0,0.9,0.1,1.8,0.1,2.8c0,0.9,0.1,1.8,0.1,2.7c0.1,1.1,0.1,2.2,0.2,3.3c0,0.7,0.1,1.4,0.1,2.1  c0.1,1.2,0.2,2.4,0.3,3.6c0,0.5,0.1,1.1,0.1,1.6c0.1,1.3,0.3,2.6,0.4,4c0,0.3,0.1,0.7,0.1,1C37.7,398.8,136.3,489.1,256,489.1  s218.3-90.3,231.5-206.5c0-0.3,0.1-0.7,0.1-1c0.1-1.3,0.3-2.6,0.4-4c0.1-0.5,0.1-1.1,0.1-1.6c0.1-1.2,0.2-2.4,0.3-3.6  c0-0.7,0.1-1.4,0.1-2.1c0.1-1.1,0.1-2.2,0.2-3.3c0-0.9,0.1-1.8,0.1-2.7c0-0.9,0.1-1.8,0.1-2.8c0-1.6,0.1-3.2,0.1-4.7  c0-0.2,0-0.5,0-0.7C489,256,489,256,489,255.9C489,256,489,256,489,255.9z" id="XMLID_199_"/><polygon fill="#ffffff" class="st1" id="XMLID_198_" points="256,119.4 300.4,209.3 399.6,223.8 327.8,293.8 344.8,392.6 256,345.9 167.2,392.6   184.2,293.8 112.4,223.8 211.6,209.3 "/></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                '</div>' +
                //END SVG
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
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
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Tree</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                //Button
                "<div class='pb-widget ui-widget-disabled pb-widget--init pb-widget--button pb-widget--button-inline' data-type='button' data-json='" + dataJsonBtn + "' style='margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: auto; padding: 0; max-width: 160px; width: auto;'>" +
                '<div class="pb-widget__content" style="padding: 0;">' +
                '<a href="javascript:void(0);" class="pb-btn" style="padding: 10px 20px; border-width: 0;">Let&acute;s Go!</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
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
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'header-2') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "24", "color":"#fb8f04", "lineHeight": "150", "textAlign":"None", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"12px", "marginBottom":"12px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonBtn = '{"buttonText":"Let&acute;s Go!","url":"","backgroundColor":"None", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"None","fontSize":"None","color":"None","borderWidth":"0","borderColor":"None","borderType":"None","radius":"None","paddingX":"20","paddingY":"10", "width":"auto","maxWidth":"160px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding-left: 15px; padding-right: 15px;">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "' style=''>" +
                '<div class="pb-widget__content pb-container-grid clearfix">' +
                //Text
                "<div class='pb-widget pb-widget--no-remove pb-widget--logo ui-widget-disabled pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='margin-bottom: 12px; margin-top: 12px; font-size: 24px; line-height: 150%; color: #fb8f04; font-weight: bold;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Text Logo</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
                '</div>' +
                //END TExt
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
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
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Tree</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                //Button
                "<div class='pb-widget ui-widget-disabled pb-widget--init pb-widget--button pb-widget--button-inline' data-type='button' data-json='" + dataJsonBtn + "' style='margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: auto; padding: 0; max-width: 160px; width: auto;'>" +
                '<div class="pb-widget__content" style="padding: 0;">' +
                '<a href="javascript:void(0);" class="pb-btn" style="padding: 10px 20px; border-width: 0;">Let&acute;s Go!</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
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
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'header-3') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"60", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSVG = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding-left: 15px; padding-right: 15px;">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 60px">' +
                //SVG
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--logo pb-widget--logo-right pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSVG + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M489,255.9c0-0.2,0-0.5,0-0.7c0-1.6,0-3.2-0.1-4.7c0-0.9-0.1-1.8-0.1-2.8  c0-0.9-0.1-1.8-0.1-2.7c-0.1-1.1-0.1-2.2-0.2-3.3c0-0.7-0.1-1.4-0.1-2.1c-0.1-1.2-0.2-2.4-0.3-3.6c0-0.5-0.1-1.1-0.1-1.6  c-0.1-1.3-0.3-2.6-0.4-4c0-0.3-0.1-0.7-0.1-1C474.3,113.2,375.7,22.9,256,22.9S37.7,113.2,24.5,229.5c0,0.3-0.1,0.7-0.1,1  c-0.1,1.3-0.3,2.6-0.4,4c-0.1,0.5-0.1,1.1-0.1,1.6c-0.1,1.2-0.2,2.4-0.3,3.6c0,0.7-0.1,1.4-0.1,2.1c-0.1,1.1-0.1,2.2-0.2,3.3  c0,0.9-0.1,1.8-0.1,2.7c0,0.9-0.1,1.8-0.1,2.8c0,1.6-0.1,3.2-0.1,4.7c0,0.2,0,0.5,0,0.7c0,0,0,0,0,0.1s0,0,0,0.1c0,0.2,0,0.5,0,0.7  c0,1.6,0,3.2,0.1,4.7c0,0.9,0.1,1.8,0.1,2.8c0,0.9,0.1,1.8,0.1,2.7c0.1,1.1,0.1,2.2,0.2,3.3c0,0.7,0.1,1.4,0.1,2.1  c0.1,1.2,0.2,2.4,0.3,3.6c0,0.5,0.1,1.1,0.1,1.6c0.1,1.3,0.3,2.6,0.4,4c0,0.3,0.1,0.7,0.1,1C37.7,398.8,136.3,489.1,256,489.1  s218.3-90.3,231.5-206.5c0-0.3,0.1-0.7,0.1-1c0.1-1.3,0.3-2.6,0.4-4c0.1-0.5,0.1-1.1,0.1-1.6c0.1-1.2,0.2-2.4,0.3-3.6  c0-0.7,0.1-1.4,0.1-2.1c0.1-1.1,0.1-2.2,0.2-3.3c0-0.9,0.1-1.8,0.1-2.7c0-0.9,0.1-1.8,0.1-2.8c0-1.6,0.1-3.2,0.1-4.7  c0-0.2,0-0.5,0-0.7C489,256,489,256,489,255.9C489,256,489,256,489,255.9z" id="XMLID_199_"/><polygon fill="#ffffff" class="st1" id="XMLID_198_" points="256,119.4 300.4,209.3 399.6,223.8 327.8,293.8 344.8,392.6 256,345.9 167.2,392.6   184.2,293.8 112.4,223.8 211.6,209.3 "/></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                '</div>' +
                //END SVG
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-header-items--left pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Tree</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'header-4') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"60", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"0", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding-left: 15px; padding-right: 15px;">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 60px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Tree</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'header-5') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"60", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding-left: 15px; padding-right: 15px;">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 60px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "' style='text-align: center;'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Tree</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'header-6') {
            dataJson = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonContainer = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"100%", "minHeight":"60", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonSvgToggle = '{"width":"40", "height":"40", "fillColor":"#fb8f04", "strokeColor":"#fb8f04", "count":"1", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px"}';
            dataJsonItems = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Normal", "fontSize": "16", "color":"#333333", "lineHeight": "125", "textAlign":"2", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"10px", "marginBottom":"10px", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonItem = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"0", "marginRight":"0", "marginTop":"0", "marginBottom":"0", "paddingLeft":"20px", "paddingRight":"20px", "paddingTop":"10px", "paddingBottom":"10px"}';

            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding-left: 15px; padding-right: 15px;">' +
                //Container
                "<div class='pb-widget pb-widget--init pb-widget--container pb-container-contains-widget' data-type='container' data-json='" + dataJsonContainer + "'>" +
                '<div class="pb-widget__content pb-container-grid clearfix" style="min-height: 60px">' +
                //SVG Toggle
                "<div class='pb-widget pb-widget--no-remove ui-widget-disabled pb-widget--init pb-widget--mobile-toggle pb-widget--mobile-toggle-left pb-widget--svg pb-widget--svg-on' data-type='svg' data-json='" + dataJsonSvgToggle + "' style='width: 40px; height: 40px; margin-left: 0; margin-right: 0; margin-top: 10px; margin-bottom: 10px;'>" +
                '<div class="pb-widget__content"><div class="pb-load-svg"><svg fill="#fb8f04" height="512px" id="Layer_1" style="enable-background:new 0 0 512 512;" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M417.4,224H94.6C77.7,224,64,238.3,64,256c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,238.3,434.3,224,417.4,224z"/><path d="M417.4,96H94.6C77.7,96,64,110.3,64,128c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,110.3,434.3,96,417.4,96z"/><path d="M417.4,352H94.6C77.7,352,64,366.3,64,384c0,17.7,13.7,32,30.6,32h322.8c16.9,0,30.6-14.3,30.6-32   C448,366.3,434.3,352,417.4,352z"/></g></svg></div></div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('svg') +
                '</div>' +
                //END SVG Toggle
                //Items
                "<div class='pb-header-items pb-widget pb-widget--init pb-widget--no-remove pb-widget--nav-items ui-widget-disabled' data-type='nav-items' data-json='" + dataJsonItems + "' style='text-align: right;'>" +
                '<div class="pb-widget__content">' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item One</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Two</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                "<a href='#' class='pb-header-items__item pb-widget pb-widget--nav-item pb-widget--init ui-widget-disabled' data-type='nav-item' data-json='" + dataJsonItem + "'>" +
                '<span class="pb-header-items__item-text">Item Tree</span>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                '</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('nav-items') +
                '</div>' +
                //End Items
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('container') +
                '</div>' +
                //End Container
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>';
        } else if (type === 'container' && type2 === 'footer-7') {
            dataJson = '{"backgroundColor": "#e1e1e1", "backgroundImageUrl":"", "borderWidth":"0", "borderColor":"#ffffff", "borderType":"None", "borderRadius":"0", "width":"auto", "minHeight":"0", "maxWidth":"100%", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"15px", "paddingRight":"15px", "paddingTop":"110px", "paddingBottom":"120px"}';
            dataJsonText = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "Bold", "fontSize": "36", "color":"#333333", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"0", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonText2 = '{"backgroundColor": "#ffffff", "backgroundImageUrl":"", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "20", "color":"#636363", "lineHeight": "125", "textAlign":"1", "width":"auto","maxWidth":"1000px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"20px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
            dataJsonBtn = '{"buttonText":"hello@info.com","url":"mailto:hello@info.com","backgroundColor":"#ffffff", "backgroundImageUrl":"","fontTypeFace":"None","fontWeight":"Bold","fontSize":"16","color":"#333333","borderWidth":"0","borderColor":"#ffffff","borderType":"Solid","radius":"4","paddingX":"30","paddingY":"15", "width":"100%","maxWidth":"200px", "marginLeft":"auto", "marginRight":"auto", "marginTop":"35px", "marginBottom":"0", "paddingLeft":"0", "paddingRight":"0", "paddingTop":"0", "paddingBottom":"0"}';
                
            html = "<div class='pb-widget pb-widget--init pb-widget--container pb-widget--header-mode pb-container-contains-widget' data-type2='header-1' data-type='" + type + "' data-json='" + dataJson + "'>" +
                '<div class="pb-widget__content pb-container-grid" style="padding: 110px 15px 120px; background-color: rgb(225, 225, 225);">' +
                //Text
                "<div class='pb-widget pb-widget--init pb-widget--text' data-type='text' data-json='" + dataJsonText + "' style='font-size: 36px; margin-top: 0; line-height: 125%; text-align: center; font-weight: bold; color: #333333;'>" +
                '<div class="pb-widget__content">' +
                '<div class="pb-editable">' +
                '<div>Questions?</div>' +
                '</div>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('text') +
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
                '</div>' +
                //End Text
                //Button
                "<div class='pb-widget pb-widget--init pb-widget--button' data-type='button' data-json='" + dataJsonBtn + "' style='max-width: 200px; margin-top: 35px;'>" +
                '<div class="pb-widget__content" style="padding: 0;">' +
                '<a href="mailto:hello@info.com" class="pb-btn" style="color: #333333; background-color: #ffffff;font-size: 16px; font-weight: bold; border-width: 0; border-color: #ffffff; border-style: solid; padding: 15px 30px;">hello@info.com</a>' +
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel(type) +
                '</div>'+
                //End Button
                '</div>' +
                pageBuilder.getWidgetHTMLPlaceholder() +
                pageBuilder.getWidgetHTMLLabel('button') +
                '</div>';
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
            if (type === 'image' || type === 'image-group' || type === 'text-column-with-image' || type === 'image-caption-1' || type === 'image-caption-2' || type === 'slideshow')
                pageBuilder.loadImage();
            if (type === 'text' || type === 'text-column-with-image' || type === 'image-caption-1' || type === 'image-caption-2' || type === 'two-text-columns' || type === 'columns-caption' || type === 'vertical-form')
                pageBuilder.initEditorInline();

            $el.each(function () {
                var $this = $(this);
                var idx = pageBuilder.getIdxWidget($this);
                var type = $this.attr('data-type');
                pageBuilder.addIdxWidget($this, idx);
                pageBuilder.addItemTree($this.attr('data-type'), $this.attr('data-idx'), $this.parents('.pb-widget:first, .pb-blocks:first'));
                pageBuilder.widgetTreeIsElements($('.list-widgets > li'));

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
    selectWidget: function ($widget) {
        if (!$widget.hasClass('pb-widget--selected')) {
            pageBuilder.removeSelectedWidget();
            pageBuilder.hidePanelSettings();
            $widget.addClass('pb-widget--selected');
            pageBuilder.openPanelSettings($widget);
            pageBuilder.setIndividualOptions($widget);
        }
    },
    removeSelectedWidget: function () {
        var $widget = $('.pb-widget--selected')
        var type = $widget.data('type');

        if (type === 'video') {
            pageBuilder.videoBox.setHTML();
        } else if (type === 'code') {
            pageBuilder.codeBox.setHTML();
        }

        $widget.removeClass('pb-widget--selected');
    },
    hidePanelSettings: function () {
        $('.pb-settings-panel:visible').hide();
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
                });
                editor.on('blur', function (e) {
                    pageBuilder.disabledEditorInline($('#' + e.target.id), editor.id);
                });
            }
        });
    },
    showHideEditorInline: function ($editor) {
        //console.log($editor);
        var $box = $editor.parents('.pb-widget');
        var idEditor = $editor.attr('id');

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
    initGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        if (!opt) return false;

        $tpl.css({
            backgroundColor: opt.backgroundColor,
            backgroundImahe: 'url(' + opt.backgroundImageUrl + ')',
            fontFamily: opt.fontTypeFace + ', sans-serif',
            fontSize: opt.fontSize + 'px',
            lineHeight: opt.lineHeight + '%',
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
            setSettingsBackgroundImage($('#pb-panel__image'));
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

            $('#imgCaptionOneGrid').slider("option", "value", opt.gridSize1);
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

            $('#imgCaptionTwoGrid').slider("option", "value", opt.gridSize1);
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

            $('#textColumnsWithImgGrid').slider("option", "value", opt.gridSize1);
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

            $('#twoTextColumnsGrid').slider("option", "value", opt.gridSize1);
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

            $('#columnsCaptionGrid').slider("option", "value", opt.gridSize1);
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
            $('#twoGridGrid').slider("option", "values", [opt.gridSize1]);
            pageBuilder.setGridSizeColumns($('#twoGridGrid'), [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)]);
            $('#twoGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#twoGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#twoGridBorderType").trigger('liszt:updated');
            $('#twoGridBorderWidth').val(opt.borderWidth);
            $('#twoGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#twoGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__two-column-grid'));
            setSettingsBackgroundImage($('#pb-panel__two-column-grid'));
        } else if (type === 'three-column-grid') {
            $('#threeGridGrid').slider("option", "values", [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)]);
            pageBuilder.setGridSizeColumns($('#threeGridGrid'), [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)]);
            $('#threeGridBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#threeGridBorderType option[value="' + opt.borderType + '"]').attr('selected', true);
            $("#threeGridBorderType").trigger('liszt:updated');
            $('#threeGridBorderWidth').val(opt.borderWidth);
            $('#threeGridBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#threeGridMinHeight').val(opt.minHeight);
            setSettingCssWidget($('#pb-panel__three-column-grid'));
            setSettingsBackgroundImage($('#pb-panel__three-column-grid'));
        } else if (type === 'uneven-grid') {
            $('#unevenGridGrid').slider("option", "values", [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)]);
            pageBuilder.setGridSizeColumns($('#unevenGridGrid'), [opt.gridSize1, parseInt(opt.gridSize1) + parseInt(opt.gridSize2)]);
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
        });

        $('#textFontWeight, #imgCaptionOneFontWeight, #imgCaptionTwoFontWeight, #textColumnsWithImgFontWeight, #twoTextColumnsFontWeight, #columnsCaptionFontWeight, #formFontWeight, #itemsFontWeight, #itemFontWeight').change(function () {
            getTplOpt();
            opt.fontWeight = $(this).val();

            if (opt.fontWeight === 'None')
                $tpl.css('font-weight', '');
            else
                $tpl.css('font-weight', opt.fontWeight);

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('#textFontSize, #imgCaptionOneFontSize, #imgCaptionTwoFontSize, #textColumnsWithImgFontSize, #twoTextColumnsFontSize, #columnsCaptionFontSize, #formFontSize, #itemsFontSize, #itemFontSize').change(function () {
            getTplOpt();
            opt.fontSize = $(this).val();

            if (opt.fontSize === 'None')
                $tpl.css('font-size', '');
            else
                $tpl.css('font-size', opt.fontSize + 'px');

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('#textLineHeight, #imgCaptionOneLineHeight, #imgCaptionTwoLineHeight, #textColumnsWithImgLineHeight, #twoTextColumnsLineHeight, #columnsCaptionLineHeight, #formLineHeight, #itemsLineHeight, #itemLineHeight').change(function () {
            getTplOpt();
            opt.lineHeight = $(this).val();

            if (opt.lineHeight === 'None')
                $tpl.css('line-height', '');
            else
                $tpl.css('line-height', opt.lineHeight + '%');

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        //Image Group
        $('#pbImgColumnGroup .pb-image-layout li').on('click', function () {
            getTplOpt();
            opt.layoutIndex = $(this).attr('data-index');
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.positionImagesGroup(opt.layoutIndex);
            $(this).addClass('pb-image-layout__item--selected').siblings('li').removeClass('pb-image-layout__item--selected');
        });

        //SVG
        $('#svgWidth').change(function () {
            getTplOpt();
            opt.width = $(this).val();
            $tpl.css('width', opt.width + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#svgHeight').change(function () {
            getTplOpt();
            opt.height = $(this).val();
            $tpl.css('height', opt.height + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        //Divider
        $('#dividerBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.find('.pb-divider').css('border-top-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#dividerBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.find('.pb-divider').css('border-top-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('#socialContainerBorderWidth').on('change', function () {
            getTplOpt();

            opt.containerBorderWidth = $(this).val();
            $tpl.find('.pb-social-btns').css('border-width', opt.containerBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('#socialButtonBorderWidth').on('change', function () {
            getTplOpt();

            opt.btnBorderWidth = $(this).val();
            $tpl.find('.pb-social-btn').css('border-width', opt.btnBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#socialButtonBorderRadius').on('change', function () {
            getTplOpt();

            opt.btnBorderRadius = $(this).val();
            $tpl.find('.pb-social-btn').css('border-radius', opt.btnBorderRadius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('#socialButtonWeight').change(function () {
            getTplOpt();

            opt.fontWeight = $(this).val();
            $tpl.find('.pb-social-btn').css('font-weight', opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#socialButtonSize').change(function () {
            getTplOpt();

            opt.fontSize = $(this).val();
            $tpl.find('.pb-social-btn').css('font-size', opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#socialButtonLineHeight').change(function () {
            getTplOpt();
            var val = $(this).val();

            opt.lineHeight = val;

            if (val == 'None') {
                $tpl.find('.pb-social-btn .pb-social-btn__text').css('line-height', 'normal');
            } else {
                $tpl.find('.pb-social-btn .pb-social-btn__text').css('line-height', opt.lineHeight + '%');
            }

            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('#btnTypeFace').change(function () {
            getTplOpt();
            opt.fontTypeFace = $(this).val();

            if (opt.fontTypeFace === 'None')
                $tpl.find('.pb-btn').css('font-family', '');
            else
                $tpl.find('.pb-btn').css('font-family', opt.fontTypeFace + ', sans-serif');

            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#btnWeight').change(function () {
            getTplOpt();
            opt.fontWeight = $(this).val();

            if (opt.fontWeight === 'None')
                $tpl.find('.pb-btn').css('font-weight', '');
            else
                $tpl.find('.pb-btn').css('font-weight', opt.fontWeight);

            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#btnSize').change(function () {
            getTplOpt();
            opt.fontSize = $(this).val();

            if (opt.fontSize === 'None')
                $tpl.find('.pb-btn').css('font-size', '');
            else
                $tpl.find('.pb-btn').css('font-size', opt.fontSize + 'px');

            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('#btnText').on('keyup', function () {
            getTplOpt();
            opt.buttonText = $.trim($(this).val());

            if (opt.buttonText === '') opt.buttonText = 'Make Your Purchase';

            $tpl.find('.pb-btn').text(opt.buttonText);
            $tpl.attr('data-json', JSON.stringify(opt));
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
        });

        //Image & Caption 1
        $('#imgCaptionOneCaptionPosition, #imgCaptionTwoCaptionPosition').change(function () {
            getTplOpt();
            opt.position = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.captionPosition();
            pageBuilder.showHideGridSizeColumns();
        });

        $('#imgCaptionOneImgAlign, #imgCaptionTwoImgAlign, #textColumnsWithImgImgAlign, #twoTextColumnsImgAlign, #columnsCaptionImgAlign').change(function () {
            getTplOpt();
            opt.imgAlign = $(this).val();
            $tpl.find('.pb-load-image').css('text-align', opt.imgAlign);
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        //slideshow

        $('#slideshowBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.find('.pb-widget__content').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#slideshowBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.find('.pb-widget__content').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#slideshowHeight').change(function () {
            getTplOpt();
            opt.height = $(this).val();
            $tpl.find('.pb-widget__content').css('height', opt.height + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        //Container
        $('#containerBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.children('.pb-container-grid').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#containerBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.children('.pb-container-grid').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#containerBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();
            $tpl.children('.pb-container-grid').css('border-radius', opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#containerMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-container-grid').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        //Grid
        $('#twoGridBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.children('.pb-layout-grid').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#twoGridBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.children('.pb-layout-grid').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#twoGridMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        //Three Grid
        $('#threeGridBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.children('.pb-layout-grid').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#threeGridBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.children('.pb-layout-grid').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#threeGridMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        // Uneven Grid
        $('#unevenGridBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.children('.pb-layout-grid').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#unevenGridBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.children('.pb-layout-grid').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#unevenGridMinHeight').change(function () {
            getTplOpt();
            opt.minHeight = $(this).val();
            $tpl.children('.pb-layout-grid').children('.pb-layout-grid__cell').css('min-height', opt.minHeight + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        //form
        $('#formBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#formBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#formBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();
            $tpl.css('border-radius', opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        //field
        $('#fieldBorderType').change(function () {
            getTplOpt();
            opt.borderType = $(this).val();
            $tpl.find('.pb-txt-field').css('border-style', opt.borderType);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#fieldBorderWidth').change(function () {
            getTplOpt();
            opt.borderWidth = $(this).val();
            $tpl.find('.pb-txt-field').css('border-width', opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#fieldBorderRadius').change(function () {
            getTplOpt();
            opt.radius = $(this).val();
            $tpl.find('.pb-txt-field').css('border-radius', opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#fieldTypeFace').change(function () {
            getTplOpt();
            opt.fontTypeFace = $(this).val();

            if (opt.fontTypeFace === 'None')
                $tpl.find('.pb-txt-field').css('font-family', '');
            else
                $tpl.find('.pb-txt-field').css('font-family', opt.fontTypeFace + ', sans-serif');

            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('#fieldFontSize').change(function () {
            getTplOpt();
            opt.fontSize = $(this).val();

            if (opt.fontSize === 'None')
                $tpl.find('.pb-txt-field').css('font-size', '');
            else
                $tpl.find('.pb-txt-field').css('font-size', opt.fontSize + 'px');

            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('#fieldPlaceholder').on('keyup', function () {
            getTplOpt();
            opt.placeholder = $.trim($(this).val());

            $tpl.find('.pb-txt-field').attr('placeholder', opt.placeholder);
            $tpl.attr('data-json', JSON.stringify(opt));
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
        });
        $('.pb-widget-width').change(function () {
            getTplOpt();
            opt.width = $(this).val();
            $tpl.css('width', opt.width);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-max-width').change(function () {
            getTplOpt();
            opt.maxWidth = $(this).val();
            $tpl.css('max-width', opt.maxWidth);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-margin-left').change(function () {
            getTplOpt();
            opt.marginLeft = $(this).val();
            $tpl.css('margin-left', opt.marginLeft);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-margin-right').change(function () {
            getTplOpt();
            opt.marginRight = $(this).val();
            $tpl.css('margin-right', opt.marginRight);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-margin-top').change(function () {
            getTplOpt();
            opt.marginTop = $(this).val();
            $tpl.css('margin-top', opt.marginTop);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-margin-bottom').change(function () {
            getTplOpt();
            opt.marginBottom = $(this).val();
            $tpl.css('margin-bottom', opt.marginBottom);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-padding-left').change(function () {
            getTplOpt();
            opt.paddingLeft = $(this).val();

            if ($tpl.hasClass('pb-widget--nav-item'))
                $tpl.css('padding-left', opt.paddingLeft);
            else
                $tpl.children('.pb-widget__content, .pb-layout-grid').css('padding-left', opt.paddingLeft);

            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-padding-right').change(function () {
            getTplOpt();
            opt.paddingRight = $(this).val();

            if ($tpl.hasClass('pb-widget--nav-item'))
                $tpl.css('padding-right', opt.paddingRight);
            else
                $tpl.children('.pb-widget__content, .pb-layout-grid').css('padding-right', opt.paddingRight);

            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-padding-top').change(function () {
            getTplOpt();
            opt.paddingTop = $(this).val();

            if ($tpl.hasClass('pb-widget--nav-item'))
                $tpl.css('padding-top', opt.paddingTop);
            else
                $tpl.children('.pb-widget__content, .pb-layout-grid').css('padding-top', opt.paddingTop);

            $tpl.attr('data-json', JSON.stringify(opt));
        });
        $('.pb-widget-padding-bottom').change(function () {
            getTplOpt();
            opt.paddingBottom = $(this).val();

            if ($tpl.hasClass('pb-widget--nav-item'))
                $tpl.css('padding-bottom', opt.paddingBottom);
            else
                $tpl.children('.pb-widget__content, .pb-layout-grid').css('padding-bottom', opt.paddingBottom);

            $tpl.attr('data-json', JSON.stringify(opt));
        });

        //ICON
        $('#iconHeight').change(function () {
            getTplOpt();
            opt.height = $(this).val();
            $tpl.css('height', opt.height);
            $tpl.attr('data-json', JSON.stringify(opt));
        });
    },
    updateGlobalOptions: function () {
        var $tpl = $('#pb-template');
        var opt = $tpl.data('json');

        $('#templateTypeFace').change(function () {
            opt.fontTypeFace = $(this).val();
            $tpl.css('font-family', opt.fontTypeFace + ', sans-serif');
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('#templateFontWeight').change(function () {
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight', opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('#templateFontSize').change(function () {
            opt.fontSize = $(this).val();
            $tpl.css('font-size', opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('#templateLineHeight').change(function () {
            opt.lineHeight = $(this).val();
            $tpl.css('line-height', opt.lineHeight + '%');
            $tpl.attr('data-json', JSON.stringify(opt));
        });

        $('#btnGlobalBorderType').change(function () {
            opt.btnBorderType = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalBorderWidth').change(function () {
            opt.btnBorderWidth = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalBorderRadius').change(function () {
            opt.btnBorderRadius = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalTypeFace').change(function () {
            opt.btnfontTypeFace = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalWeight').change(function () {
            opt.btnFontWeight = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalSize').change(function () {
            opt.btnFontSize = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalPaddingX').change(function () {
            opt.btnPaddingX = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#btnGlobalPaddingY').change(function () {
            opt.btnPaddingY = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('button');
        });
        $('#linkGlobalWeight').change(function () {
            opt.linkWeight = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('link');
        });
        $('#linkGlobalTextDecoration').change(function () {
            opt.linkTextDecoration = $(this).val();
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateInlineCss('link');
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
            $tpl.find('.pb-load-svg svg').attr('fill', opt.fillColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'svgStrokeColor') {
            opt.strokeColor = '#' + hex;
            $tpl.find('.pb-load-svg svg').attr('stroke', opt.strokeColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'dividerBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.find('.pb-widget__content').css('background-color', opt.backgroundColor);
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
            $tpl.find('.pb-widget__content').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'slideshowBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.find('.pb-widget__content').css('border-color', opt.borderColor);
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
            $tpl.children('.pb-container-grid').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'containerBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.children('.pb-container-grid').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoGridBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.children('.pb-layout-grid').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'twoGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.children('.pb-layout-grid').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'threeGridBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.children('.pb-layout-grid').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'threeGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.children('.pb-layout-grid').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'unevenGridBackground') {
            opt.backgroundColor = '#' + hex;
            $tpl.children('.pb-layout-grid').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify(opt));
        } else if (id == 'unevenGridBorderColor') {
            opt.borderColor = '#' + hex;
            $tpl.children('.pb-layout-grid').css('border-color', opt.borderColor);
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
        $('.pb-blocks').on('dblclick', '.pb-load-image', function () {
            pageBuilder.insertImage($(this), false, null);
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
        });
        $('.pb-list-group-social').on('click', '.pb-item__btn-remove', function () {
            $(this).parents('li').remove();
            pageBuilder.updateSocialHtml();
            $('.pb-list-group-social').children('li').each(function (i) {
                $(this).attr('datasortid', i);
            });
            pageBuilder.countGroupSocial();
        });

        $('.pb-list-group-social').on('keyup', '.pb-field-social-link', function () {
            var $tpl = $('.pb-widget--selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $btn = $tpl.find('.pb-social-btn').eq($li.attr('datasortid'));
            var val = $(this).val();

            if (val == '') val = 'http://';

            $btn.attr('href', val);
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
        });
        $('#shareCustomLink').keyup(function () {
            var val = $(this).val();
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.shareLink = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateSocialShareLink();
        });
        $('#shareShortDesc').keyup(function () {
            var val = $(this).val();
            var $tpl = $('.pb-widget--selected');
            var opt = $tpl.data('json');

            opt.shareDesc = val;
            $tpl.attr('data-json', JSON.stringify(opt));
            pageBuilder.updateSocialShareLink();
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
        });
        $('.pb-list-group-social').on('change', '.pb-social-list', function () {
            var val = $(this).val();
            pageBuilder.addNewSocialService(val, $(this));
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
                    $btn.css('line-height', opt.lineHeight + '%');
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
        var $items = $box.find('.pb-grid-size__item');
        var value1 = parseInt(values[0]);
        var value2 = 0;
        var value3 = 0;

        if (values.length == 1) {
            value2 = 100 - parseInt(values[0]);
            $items.eq(0).css('width', value1 + '%').text(value1 + '%');
            $items.eq(1).css({
                'left': value1 + '%',
                'width': value2 + '%'
            }).text(value2 + '%');
        } else {
            value3 = 100 - parseInt(values[0]) - (parseInt(values[1]) - parseInt(values[0]));
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

            if (value2 < 5) {
                $items.eq(1).addClass('pb-grid-size__item--error');
                if (value1 > value3) {
                    $items.eq(0).addClass('pb-grid-size__item--error');
                } else if (value1 < value3) {
                    $items.eq(2).addClass('pb-grid-size__item--error');
                } else {
                    $items.addClass('pb-grid-size__item--error');
                }

            } else {
                $items.removeClass('pb-grid-size__item--error');
            }
        }

    },
    setJSonGridColumns: function (values) {
        var $tpl = $('.pb-widget--selected');
        var opt = $tpl.data('json');

        opt.gridSize1 = values[0];
        if (values.length > 1)
            opt.gridSize2 = values[1] - values[0];
        $tpl.attr('data-json', JSON.stringify(opt));
    },
    setWidthGridColumns: function ($el, values) {
        var $tpl = $('.pb-widget--selected');
        var margin = 1;
        var width_1 = 0;
        var width_2 = 0;
        var width_3 = 0;
        var id = $el.attr('id');
        var $grids = null;

        if (id == 'threeGridGrid' || id == 'unevenGridGrid') {
            width_1 = values[0] - margin;
            width_2 = parseInt(values[1]) - parseInt(values[0]);
            width_3 = 100 - parseInt(values[0]) - (parseInt(values[1]) - parseInt(values[0])) - margin;

            $grids = $tpl.find('.pb-layout-grid__cell');
            $grids.eq(0).css('width', width_1 + '%');
            $grids.eq(1).css('width', width_2 + '%');
            $grids.eq(2).css('width', width_3 + '%');

        } else if (id === 'imgCaptionOneGrid' || id === 'textColumnsWithImgGrid' || id === 'imgCaptionTwoGrid' || id === 'twoTextColumnsGrid' || id === 'columnsCaptionGrid') {
            width_1 = values[0] - margin;
            width_2 = 100 - values[0] - margin;
            $tpl.find('.pb-column-1').css('width', width_1 + '%');
            $tpl.find('.pb-column-2').css('width', width_2 + '%');

        } else if (id === 'twoGridGrid') {
            margin = 0.5;
            width_1 = values[0] - margin;
            width_2 = 100 - values[0] - margin;
            $grids = $tpl.find('.pb-layout-grid__cell');
            $grids.eq(0).css('width', width_1 + '%');
            $grids.eq(1).css('width', width_2 + '%');
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
        var html = '<svg version="1.1" id="" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="550.801px" height="550.801px" viewBox="0 0 550.801 550.801" style="enable-background:new 0 0 550.801 550.801;" xml:space="preserve"> <g> <g> <path d="M475.095,131.992c-0.032-2.526-0.844-5.021-2.579-6.993L366.324,3.694c-0.031-0.034-0.062-0.045-0.084-0.076 c-0.633-0.707-1.371-1.29-2.151-1.804c-0.232-0.15-0.464-0.285-0.707-0.422c-0.675-0.366-1.382-0.67-2.13-0.892 c-0.201-0.058-0.38-0.14-0.58-0.192C359.87,0.114,359.037,0,358.193,0H97.2C85.292,0,75.6,9.693,75.6,21.601v507.6 c0,11.913,9.692,21.601,21.6,21.601H453.6c11.908,0,21.601-9.688,21.601-21.601V133.202 C475.2,132.796,475.137,132.398,475.095,131.992z M141.782,524.232c-14.963,0-29.742-3.892-37.125-7.973l6.022-24.49 c7.977,4.082,20.219,8.163,32.854,8.163c13.608,0,20.801-5.632,20.801-14.186c0-8.163-6.223-12.83-21.969-18.468 c-21.766-7.577-35.952-19.627-35.952-38.675c0-22.359,18.658-39.467,49.56-39.467c14.776,0,25.663,3.111,33.434,6.613 l-6.605,23.909c-5.255-2.531-14.575-6.223-27.411-6.223c-12.825,0-19.045,5.833-19.045,12.636c0,8.363,7.383,12.055,24.3,18.473 c23.129,8.554,34.014,20.604,34.014,39.061C194.653,505.575,177.747,524.232,141.782,524.232z M280.188,522.292h-34.597 l-41.984-131.013h32.463l15.936,55.397c4.472,15.551,8.554,30.517,11.665,46.844h0.577c3.299-15.747,7.381-31.293,11.853-46.254 l16.722-55.982h31.493L280.188,522.292z M446.196,516.26c-9.134,3.111-26.431,7.393-43.728,7.393 c-23.91,0-41.207-6.032-53.262-17.687c-12.055-11.274-18.657-28.382-18.468-47.625c0.2-43.542,31.884-68.423,74.841-68.423 c16.906,0,29.932,3.302,36.339,6.413l-6.217,23.725c-7.193-3.111-16.126-5.643-30.513-5.643 c-24.689,0-43.348,13.996-43.348,42.378c0,27.021,16.907,42.957,41.207,42.957c6.803,0,12.25-0.785,14.576-1.945v-27.401h-20.208 v-23.129h48.779V516.26z M453.6,366.752H97.2V21.601h250.192v109.954c0,0-0.717,11.362,14.271,11.362c14.992,0,91.937,0,91.937,0 V366.752z"/> <g> <path d="M181.646,228.67v-4.517h-10.16l-12.105-4.515v-4.179h-8.646c-0.253-0.269-0.49-0.557-0.707-0.852l0.047-10.716 c0.48-0.588,1.071-1.073,1.767-1.458v1.039h10.892v-0.941c2.408,0.994,4.282,2.555,5.632,4.693l-0.05,10.892h10.887v-2.7 l10.012-1.355v1.613h10.887v-10.892h-2.523c-2.331-9.292-7.425-16.999-15.156-22.929c-5.832-4.469-12.448-7.225-19.688-8.21 v-2.41h-10.892v2.288c-0.061,0-0.113,0.006-0.179,0.011c-5.189,0.559-10.362,2.497-15.356,5.753 c-6.805,4.39-11.541,10.46-14.062,18.035c-0.709,2.118-1.226,4.255-1.534,6.389h-2.421v10.892h2.389 c0.744,5.685,2.732,10.945,5.933,15.665c3.344,4.946,7.723,8.867,13.025,11.667v4.235h10.392l12.037,4.374v4.472h6.705v10.064 h0.158c-0.741,0.968-1.685,1.714-2.837,2.257v-0.949h-10.895v1.453c-1.205-0.34-2.226-0.81-3.059-1.416 c-1.242-0.881-2.247-2.299-3.006-4.245h0.485v-10.89h-10.893v3.062l-10.46,1.305v-1.466h-10.897v10.89h3.375 c2.312,10.668,7.459,18.857,15.314,24.369c5.537,3.881,11.968,6.19,19.132,6.871v2.31h10.897v-2.441l1.416-0.169l0.593-0.169 c6.544-1.092,12.437-3.744,17.508-7.889c5.091-4.166,8.791-9.445,10.971-15.673c0.823-2.305,1.437-4.72,1.827-7.204h2.144v-10.89 h-2.122C196.857,243.146,191.226,234.576,181.646,228.67z M166.092,289.349v-1.604h-10.895v1.888 c-5.79-0.706-10.913-2.609-15.256-5.663c-5.957-4.214-10.054-10.562-12.227-18.884h0.556v-2.602l10.46-1.306v1.016h3.349 c1.835,6.257,5.339,10.259,10.502,11.944c0.844,0.237,1.714,0.448,2.616,0.619v2.531h10.895v-2.79 c5.131-1.215,8.701-4.427,10.455-9.413h3.267v-10.89h-3.288c-0.772-2.014-1.959-3.771-3.57-5.26v-4.962h-9.347l-12.923-4.817 v-3.874h-9.342c-3.741-2.239-6.874-5.231-9.323-8.936c-2.394-3.602-3.944-7.538-4.641-11.744h1.962v-10.892h-1.793 c0.242-1.464,0.593-2.88,1.041-4.225c1.846-5.529,5.163-10.091,9.867-13.547c3.968-2.922,8.461-4.771,13.386-5.509v1.69h10.892 v-1.674c5.717,0.865,10.961,3.132,15.639,6.755c6.062,4.654,10.038,10.428,12.089,17.576h-1.247v2.484l-10.012,1.39v-1.432 h-3.494c-2.339-6.178-6.687-10.099-12.97-11.701v-2.938h-10.893v2.7c-4.569,1.118-7.729,3.989-9.263,8.435h-3.396v10.893h3.37 c1.092,3.267,3.08,5.848,5.935,7.699v4.044h9.748l12.517,4.667v4.026h8.385c7.016,4.672,11.119,10.969,12.469,19.156h-1.938 v10.89h1.954c-0.29,1.714-0.733,3.354-1.332,4.915c-3.955,10.815-11.818,17.133-24.139,19.338 C166.137,289.344,166.116,289.344,166.092,289.349z"/> <path d="M313.095,185.631v-10.893h-10.89v1.833h-10.299v-0.412l17.613-15.828h7.129v-10.465h-10.468v8.019l-18.757,16.849h-6.418 v5.766l-12.108,10.876h-8.385v10.465h10.465v-6.89l9.373-8.424l-26.114,68.391l-24.408-70.247v-9.938h-10.897v1.832h-10.304 v-1.832h-10.895v10.892h3.829l34.602,99.731v10.378h10.892v-1.682h12.744v1.682h10.897v-8.184l-0.087-0.48l38.741-101.435h3.744 V185.631z M243.087,284.851l-34.446-99.296v-2.207h10.302v2.284h4.137l25.608,74.121v10.827h11.042v-10.893h-0.158l28.284-74.055 h4.051v-2.284h10.304v1.896l-37.897,99.607h-4.503v2.441h-12.743v-2.441H243.087z"/> <path d="M436.777,239.62v-10.893h-11.042v2.286H379.74v-2.286h-11.043v10.893h1.83v10.46h-1.83v11.042h11.043v-1.98h16.247 c-4.709,4.608-10.172,7.472-16.553,8.669v-1.563h-10.89v1.717c-7.104-0.949-13.168-3.921-18.452-9.039 c-5.252-5.089-8.385-10.974-9.513-17.93h1.339v-11.042h-1.529c1.055-7.09,4.177-13.134,9.503-18.41 c5.331-5.292,11.454-8.358,18.652-9.323v1.717h10.89v-1.458c4.978,0.88,9.561,2.895,13.663,6.009v5.666h11.043v-1.961 l15.34,0.114v1.854h11.043v-10.893h-4.82c-5.094-8.372-11.844-15.227-20.081-20.4c-7.974-5.007-16.77-7.984-26.188-8.846v-2.624 h-10.896v2.573c-14.887,1.065-27.844,7.001-38.549,17.653c-10.705,10.655-16.717,23.538-17.877,38.33h-2.594v11.042h2.626 c1.35,14.7,7.456,27.454,18.161,37.964c10.695,10.499,23.541,16.343,38.228,17.407v2.278h10.89v-2.352 c9.165-0.938,17.74-3.855,25.555-8.69v8.295h10.896v-2.136h9.851v2.136h11.043v-10.89h-2.278l0.137-45.384h2.151V239.62z M368.545,287.745v1.825c-12.904-1.039-24.179-6.238-33.528-15.462c-9.34-9.205-14.739-20.34-16.058-33.123h1.455v-11.042h-1.498 c1.15-12.891,6.477-24.155,15.879-33.513c9.413-9.363,20.751-14.676,33.75-15.81v1.803h10.89v-1.606 c7.899,0.839,15.356,3.391,22.19,7.61c7.077,4.358,12.931,10.109,17.434,17.112h-14.918v-2.284h-6.935 c-5.189-4.039-11.153-6.594-17.771-7.614v-2.756h-10.89v2.502c-9.023,1.02-16.875,4.823-23.377,11.33 c-6.503,6.5-10.347,14.305-11.454,23.225h-2.685v11.042h2.716c1.202,8.835,5.126,16.498,11.687,22.81 c6.539,6.292,14.301,9.98,23.113,10.982v2.352h10.89v-2.584c9.661-1.387,17.782-5.896,24.194-13.429h5.548v-11.042h-10.9v2.442 h-18.547v-2.442h-2.431v-10.46h2.431v-1.83h46v1.83h2.115c-0.021,3.726-0.068,11.264-0.127,22.615v22.768h-1.982v1.982h-9.851 v-12.661h-10.896v5.289c-7.72,5.506-16.295,8.817-25.555,9.861v-1.729h-10.89V287.745z"/> </g> </g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>';

        $box.removeClass('pb-box-btn-upload-svg--none');
        $tpl.addClass('pb-widget--svg-on').find('.pb-load-svg').removeClass('pb-load-svg--none').html(html);
        opt.count = '1';
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

        if (isGlobal) {
            $tpl.css('background-image', 'url(' + opt.backgroundImageUrl + ')');
        } else {
            if ($tpl.hasClass('pb-widget--calendar') || $tpl.hasClass('pb-widget--social-share') || $tpl.hasClass('pb-widget--social-follow')) {
                $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', 'url(' + opt.backgroundImageUrl + ')');
            } else if ($tpl.hasClass('pb-widget--nav-item')) {
                $tpl.css('background-image', 'url(' + opt.backgroundImageUrl + ')');
            } else {
                $tpl.children('.pb-widget__content, .pb-layout-grid').css('background-image', 'url(' + opt.backgroundImageUrl + ')');
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

        if (isGlobal) {
            $tpl.css('background-image', '');
        } else if ($tpl.hasClass('pb-widget--nav-item')) {
            $tpl.css('background-image', '');
        } else {
            $tpl.children('.pb-widget__content, .pb-layout-grid, .pb-social-btns').css('background-image', '');
            $tpl.children('.pb-widget__content').children('.pb-social-btns').css('background-image', '');
        }


        $tpl.attr('data-json', JSON.stringify(opt));
        $box.addClass('pb-box-btn-upload-bg-image--none');
    },
    responsiveMedia: function () {
        $('#switch-preview').change(function () {
            var $toggle = $(this);
            var val = $toggle.val();
            var $box = $('.pb-editor__column-left');
            var $panel = $('.pb-media-screen');

            if (val === 'off') {
                $toggle.val('on');
                $panel.removeClass('pb-media-screen--hide');
                $box.animate({ paddingTop: '30px' }, { duration: 400 });
                $panel.animate({ top: '0' }, { duration: 400, queue: false });
                pageBuilder.responsiveMediaResize();
            } else {
                $toggle.val('off');
                $box.animate({ paddingTop: '0' }, { duration: 400 });
                $panel.animate({ top: '-30px' }, {
                    duration: 400,
                    queue: false,
                    complete: function () {
                        $panel.addClass('pb-media-screen--hide');
                        $('.pb-media-screen__item--1024').trigger('click');
                        $('.pb-blocks').css('max-width', '');
                    }
                });
            }
        });
        $('.pb-media-screen__item').on('click', function (e) {
            var $item = $(this);
            var media = $item.attr('data-media');

            $item.addClass('pb-media-screen__item--selected').siblings('.pb-media-screen__item').removeClass('pb-media-screen__item--selected');

            (media === '1920') ? media = '100%' : media = media + 'px';

            $('.pb-blocks').css('max-width', media);
        });
        $('.pb-media-screen__item').hover(function (e) {
            var $selectedItem = $('.pb-media-screen__item--selected');
            var selectedMedia = parseInt($selectedItem.attr('data-media'));
            var $curentEtem = $(this);
            var currentMedia = parseInt($curentEtem.attr('data-media'));

            $curentEtem.siblings('.pb-media-screen__item').addClass('pb-media-screen__item--disabled-icn');

            if (currentMedia > selectedMedia)
                $selectedItem.addClass('pb-media-screen__item--hover');
        }, function () {
            $('.pb-media-screen__item--hover').removeClass('pb-media-screen__item--hover');
            $('.pb-media-screen__item--disabled-icn').removeClass('pb-media-screen__item--disabled-icn');
        });

        $(window).resize(function () {
            if (!$('.pb-media-screen').hasClass('pb-media-screen--hide'))
                pageBuilder.responsiveMediaResize();
        });
    },
    responsiveMediaResize: function () {
        var currentWidth = $('body').outerWidth();
        var selectedSize = parseInt($('.pb-media-screen__item--selected').attr('data-media'));

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
            $('.pb-media-screen__item--full').trigger('click');
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
        });

        $('.pb-field-item-link').on('keyup', function () {
            var val = $.trim($(this).val());
            var $widget = $('.pb-widget--selected');

            $widget.attr('href', val);
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
            $clone.removeAttr('data-idx').addClass('pb-widget--init');
            pageBuilder.initActionsElements();
            pageBuilder.isNavItem($clone, true);
        });

        $('.pb-btn-delete-menu-item:not(.disabled)').on('click', function () {
            var $widget = $('.pb-widget--selected');
            var $item = '';

            if ($widget.hasClass('pb-header-items'))
                $item = $widget.find('.pb-header-items__item:last');
            else
                $item = $widget;

            pageBuilder.removeWidget($item);
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
    }
}

$(function () {
    pageBuilder.init();
});