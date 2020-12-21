STANDARD_FONTS = ["Open Sans","Arial","Comic Sans MS","Courier New","Georgia","Lucida Sans Unicode","Tahoma","Times New Roman","Trebuchet MS","Verdana"];

var init_page = {
	log: function (){
		console.log ('here');
	},
    init_controls: function (){
        jQuery_LL_Embedded('.tpl-block.sort_alphabetically_asc').each(function () {
            var items = '';
            if(jQuery_LL_Embedded(this).find('select').length > 0){
                items = jQuery_LL_Embedded(this).find('option');
                items.sort(function(a,b) {
                    var a_text = a.text.toLowerCase();
                    var b_text = b.text.toLowerCase();
                    if (a_text > b_text) return 1;
                    else if (a_text < b_text) return -1;
                    else return 0
                });
            } else if (jQuery_LL_Embedded(this).find('.tpl-multiple-choise').length > 0){
                items = jQuery_LL_Embedded(this).find('.tpl-multiple-choise').find('.t-field');
                items.sort(function(a,b) {
                    var a_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(a).text()).toLowerCase();
                    var b_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(b).text()).toLowerCase();
                    if (a_text > b_text) return 1;
                    else if (a_text < b_text) return -1;
                    else return 0
                });
            } else if (jQuery_LL_Embedded(this).find('.tpl-checkboxes').length > 0){
                items = jQuery_LL_Embedded(this).find('.tpl-checkboxes').find('.t-field');
                items.sort(function(a,b) {
                    var a_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(a).text()).toLowerCase();
                    var b_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(b).text()).toLowerCase();
                    if (a_text > b_text) return 1;
                    else if (a_text < b_text) return -1;
                    else return 0
                });
            }
            jQuery_LL_Embedded(this).find('select').empty().append(items);
            jQuery_LL_Embedded(this).find('.tpl-multiple-choise').empty().append(items);
            jQuery_LL_Embedded(this).find('.tpl-checkboxes').empty().append(items);
            jQuery_LL_Embedded(this).removeClass('sort_alphabetically_asc');
        });
        jQuery_LL_Embedded('.tpl-block.sort_alphabetically_des').each(function () {
            console.log("here 1");
            var items = '';
            if(jQuery_LL_Embedded(this).find('select').length > 0){
                items = jQuery_LL_Embedded(this).find('option');
                items.sort(function(a,b) {
                    var a_text = a.text.toLowerCase();
                    var b_text = b.text.toLowerCase();
                    if (a_text > b_text) return -1;
                    else if (a_text < b_text) return 1;
                    else return 0
                });
            } else if (jQuery_LL_Embedded(this).find('.tpl-multiple-choise').length > 0){
                items = jQuery_LL_Embedded(this).find('.tpl-multiple-choise').find('.t-field');
                console.log(items);
                items.sort(function(a,b) {
                    var a_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(a).text()).toLowerCase();
                    var b_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(b).text()).toLowerCase();
                    if (a_text > b_text) return -1;
                    else if (a_text < b_text) return 1;
                    else return 0
                });
                console.log(items);
            } else if (jQuery_LL_Embedded(this).find('.tpl-checkboxes').length > 0){
                items = jQuery_LL_Embedded(this).find('.tpl-checkboxes').find('.t-field');
                items.sort(function(a,b) {
                    var a_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(a).text()).toLowerCase();
                    var b_text = jQuery_LL_Embedded.trim(jQuery_LL_Embedded(b).text()).toLowerCase();
                    if (a_text > b_text) return -1;
                    else if (a_text < b_text) return 1;
                    else return 0
                });
            }
            jQuery_LL_Embedded(this).find('select').empty().append(items);
            jQuery_LL_Embedded(this).find('.tpl-multiple-choise').empty().append(items);
            jQuery_LL_Embedded(this).find('.tpl-checkboxes').empty().append(items);
            jQuery_LL_Embedded(this).removeClass('sort_alphabetically_des');
        });
		
        init_page.checkboxRadioButtons.init();
		
        jQuery_LL_Embedded('.tpl-block select').chosen();
        jQuery_LL_Embedded('.tpl-block').each(function(){
                var select = jQuery_LL_Embedded(this).find('select');

                dropdownBackground = select.css('background-color');
                dropdownBorderColor = select.css('border-color');
                dropdownBorderRadius = select.css('border-radius');
                dropdownFont = select.css('font-family');
                dropdownSize = select.css('font-size');
                dropdownColor = select.css('color');
                
                jQuery_LL_Embedded(this).find('.chzn-single').css({
                    'background': dropdownBackground,
                    'border-color': dropdownBorderColor,
                    'border-radius': dropdownBorderRadius,
                    '-webkit-border-radius': dropdownBorderRadius,
                    '-moz-border-radius': dropdownBorderRadius,
                    'font-size': dropdownSize,
                    'color': dropdownColor,
                    'font-family': dropdownFont + ', sans-serif'
                }).find('div b').css('border-top-color', dropdownColor);
                jQuery_LL_Embedded(this).find('.chzn-drop').css({
                    'background': dropdownBackground,
                    'border-color': dropdownBorderColor,
                    'font-size': dropdownSize,
                    'color': dropdownColor
                }).find('div b').css('border-top-color', dropdownColor);

                if(jQuery_LL_Embedded.inArray(dropdownFont, STANDARD_FONTS)== -1){
                    jQuery_LL_Embedded(this).find('.chzn-single').css({
                        'font-family': dropdownFont
                    });
                    jQuery_LL_Embedded(this).find('.chzn-drop').css({
                        'font-family': dropdownFont
                    });
                } else {
                    jQuery_LL_Embedded(this).find('.chzn-single').css({
                        'font-family': dropdownFont + ', sans-serif'
                    });
                    jQuery_LL_Embedded(this).find('.chzn-drop').css({
                        'font-family': dropdownFont + ', sans-serif'
                    });
                }
                /*
                 * For Firefox
                 */
                jQuery_LL_Embedded(this).find('.chzn-single').css({
                    'border-bottom-left-radius': select.css('borderBottomLeftRadius'),
                    'border-bottom-right-radius': select.css('borderBottomRightRadius'),
                    'border-top-left-radius': select.css('borderTopLeftRadius'),
                    'border-top-right-radius': select.css('borderTopRightRadius')
                });

                /*
                 * For Firefox
                 */
                jQuery_LL_Embedded(this).find('.chzn-single').css({
                    'border-bottom-color': select.css('borderBottomColor'),
                    'border-right-color': select.css('borderRightColor'),
                    'border-top-color': select.css('borderTopColor'),
                    'border-left-color': select.css('borderLeftColor')
                });
        });
        jQuery_LL_Embedded('.icn-search-date').on('click', function(){
            jQuery_LL_Embedded(this).parent().find('input').focus();
        });
        if(jQuery_LL_Embedded('.tpl-block[data-type-el="page_break"]').length > 0){
            init_page.pageBreakInit();
        }
        if(jQuery_LL_Embedded('.tpl-block[data-type-el="file_upload"]').length > 0){
            init_page.init_file_upload_elements();
        }

        jQuery_LL_Embedded('input[type="number"]').each(function () {
            jQuery_LL_Embedded(this).on('keypress', function (e) {
                if (e.which != 8 && e.which != 0 && e.which < 48 || e.which > 57)
                {
                    e.preventDefault();
                }
            })
        });
    },
    init_file_upload_elements: function (){
	    jQuery_LL_Embedded('form').attr('enctype', 'multipart/form-data');
        var div = document.createElement('div');
	    if((('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window){
            jQuery_LL_Embedded('.tpl-block[data-type-el="file_upload"]').each(function () {
                jQuery_LL_Embedded(this).find('.fb-upload-file-box').on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                }).on('dragover dragenter', function() {
                    jQuery_LL_Embedded(this).addClass('is-dragover');
                }).on('dragleave dragend drop', function() {
                    jQuery_LL_Embedded(this).removeClass('is-dragover');
                }).on('drop', function(e) {
                    var droppedFiles = e.originalEvent.dataTransfer.files;
                    if (droppedFiles) {
                        if(init_page.validate_file(droppedFiles[0])){
                            jQuery_LL_Embedded(this).find('input[type="file"]').prop('files', droppedFiles);
                            var file_name = droppedFiles[0].name;
                            jQuery_LL_Embedded(this).find('label span.field_description').hide();
                            jQuery_LL_Embedded(this).find('label.file_name').remove();
                            jQuery_LL_Embedded('<label class="file_name"><span>' + file_name + ' &nbsp;<a href="javascript:void(0);" class="delete_file"><img src="'+ll_app_root+'imgs/vvp/svgs/cancel.svg" /></a></span></label>').insertAfter(jQuery_LL_Embedded(this).find('label span.field_description'));
                            jQuery_LL_Embedded(this).find('a.delete_file').on('click', function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('input[type="file"]').val('');
                                jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label span.field_description').show();
                                jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label.file_name').remove();
                            });
                        } else {
                            show_error_message(jQuery_LL_Embedded(this).closest('.tpl-block').attr('data-invalid-file-error-message'));
                        }
                    }
                });
            });
        }
        jQuery_LL_Embedded('.tpl-block[data-type-el="file_upload"]').each(function () {
            jQuery_LL_Embedded(this).find('.fb-upload-file-box').on('dblclick', function(e) {
                e.preventDefault();
                e.stopPropagation();
                jQuery_LL_Embedded(this).find('input[type="file"]').trigger('click');
            });
            jQuery_LL_Embedded(this).find('.fb-upload-file-box input[type="file"]').on('change', function(e) {
                e.preventDefault();
                e.stopPropagation();
                if(init_page.validate_file(e.target.files[0])){
                    jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label span.field_description').hide();
                    jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label.file_name').remove();
                    jQuery_LL_Embedded('<label class="file_name"><span>' + e.target.files[0].name + ' &nbsp;<a href="javascript:void(0);" class="delete_file"><img src="'+ll_app_root+'imgs/vvp/svgs/cancel.svg" /></a></span></label>').insertAfter(jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label span.field_description'));
                    jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('a.delete_file').on('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('input[type="file"]').val('');
                        jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label span.field_description').show();
                        jQuery_LL_Embedded(this).closest('.fb-upload-file-box').find('label.file_name').remove();
                    });
                } else {
                    show_error_message(jQuery_LL_Embedded(this).closest('.tpl-block').attr('data-invalid-file-error-message'));
                }
            });
        });
    },
    validate_file: function (file){
        if(file.type == 'application/pdf' || file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif'){
            if(file.size > 0){
                return true;
            }
        }
        return false;
    },
    checkboxRadioButtons:{
        init: function(){
            jQuery_LL_Embedded('.t-checkbox input[type="checkbox"]:not(.disabled), .t-radio input[type="radio"]').on('click', function(){
                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this),true);
                //Commenting this line because it is firing the change event one more time. Without it the change event fires only one.
                //When this line uncommented "manage-performance-metrics.php" changing the checkbox status at this page pings the backend twice.
                //jQuery_LL_Embedded(this).trigger('change');
            });
            jQuery_LL_Embedded('.t-checkbox input[type="checkbox"], .t-radio input[type="radio"]').each(function(){
                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this));
            });
        },
        initiate: function(_selector){
            jQuery_LL_Embedded(_selector).on('click', function(){
                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this),true);
            });
            jQuery_LL_Embedded(_selector).each(function(){
                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this));
            });
        },
        initiate_container: function(_container_selector){
            jQuery_LL_Embedded(_container_selector).find('.t-checkbox input[type="checkbox"], .t-radio input[type="radio"]').on('click', function(){
                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this),true);
            });
            jQuery_LL_Embedded(_container_selector).find('.t-checkbox input[type="checkbox"], .t-radio input[type="radio"]').each(function(){
                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this));
            });
        },
        check: function(_selector, _checked){
            if(typeof _checked == 'undefined'){
                _checked = true;
            }
            if(_checked){
                jQuery_LL_Embedded(_selector).attr('checked', 'checked');
                jQuery_LL_Embedded(_selector).trigger('change');
                
                var $box = jQuery_LL_Embedded(_selector).parents('.t-checkbox, .t-radio');
                if(!$box.hasClass('checked')){
                    $box.addClass('checked').parent().addClass('parent-checked');
                    if ( jQuery_LL_Embedded(_selector).attr('type') == 'radio' ){
                        var radio_name = jQuery_LL_Embedded(_selector).attr('name');
                        if (typeof radio_name != 'undefined' && radio_name){
                            jQuery_LL_Embedded('input[type="radio"][name="' + radio_name + '"]').each(function(){
                                init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this));
                            });
                        }
                    }
                }
            } else {
                jQuery_LL_Embedded(_selector).removeAttr('checked').trigger('change');
                var $box = jQuery_LL_Embedded(_selector).parents('.t-checkbox, .t-radio');
                if($box.hasClass('checked')){
                    $box.removeClass('checked').parent().removeClass('parent-checked');
                }
            }
        },
        isChecked: function($checkbox, trigger){
            var $box = jQuery_LL_Embedded($checkbox).parents('.t-checkbox, .t-radio');
            if ( $checkbox.is(':checked') ){
                $box.addClass('checked').parent().addClass('parent-checked');
                if ( $checkbox.attr('type') == 'radio' ){
                    if(trigger){
                        jQuery_LL_Embedded('input[type="radio"]').add(['name="'+$checkbox.attr('name')+'"']).each(function(){
                            init_page.checkboxRadioButtons.isChecked(jQuery_LL_Embedded(this));
                        });
                    }
                }
            } else {
                $box.removeClass('checked').parent().removeClass('parent-checked');
            }
        }
    },
    pageBreakInit: function(){
    	init_page.pageBreakDestroy();
        var $el = jQuery_LL_Embedded('.fb-wrap-columns-form .fb-page-break');
        var count = $el.length + 1;
        var next_button_text = 'Next';
        var prev_button_text = 'Previous';
        if(jQuery_LL_Embedded('.form-submit-button').attr('data-next-button-text')){
        	next_button_text = jQuery_LL_Embedded('.form-submit-button').attr('data-next-button-text');
        	jQuery_LL_Embedded('.form-submit-button').removeAttr('data-next-button-text');
        }
        if(jQuery_LL_Embedded('.form-submit-button').attr('data-prev-button-text')){
        	prev_button_text = jQuery_LL_Embedded('.form-submit-button').attr('data-prev-button-text');
        	jQuery_LL_Embedded('.form-submit-button').removeAttr('data-prev-button-text');
        }
        jQuery_LL_Embedded('#wrap-form-submit-button').prepend('<a href="javascript:void(0);" class="t-btn-orange fb-prev-page-section">'+prev_button_text+'</a> <a href="javascript:void(0);" class="t-btn-orange fb-next-page-section">'+next_button_text+'</a>');
        jQuery_LL_Embedded('#wrap-form-submit-button').prepend('<div class="fb-step-text-page">Step <span>1</span> of '+count+'</div>');
		
		jQuery_LL_Embedded('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
			'background-color': jQuery_LL_Embedded('.form-submit-button').css('background-color'),
            'border-style': jQuery_LL_Embedded('.form-submit-button').css('border-style'),
            'border-width': jQuery_LL_Embedded('.form-submit-button').css('border-width'),
            'border-color': jQuery_LL_Embedded('.form-submit-button').css('border-color'),
            'border-radius': jQuery_LL_Embedded('.form-submit-button').css('border-radius'),
            '-webkit-border-radius': jQuery_LL_Embedded('.form-submit-button').css('border-radius'),
            '-moz-border-radius': jQuery_LL_Embedded('.form-submit-button').css('border-radius'),
            'font-family': jQuery_LL_Embedded('.form-submit-button').css('font-family'),
            'font-size': jQuery_LL_Embedded('.form-submit-button').css('font-size')
		});

        /*
         * For Firefox
         */
        jQuery_LL_Embedded('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
            'border-bottom-left-radius': jQuery_LL_Embedded('.form-submit-button').css('borderBottomLeftRadius'),
            'border-bottom-right-radius': jQuery_LL_Embedded('.form-submit-button').css('borderBottomRightRadius'),
            'border-top-left-radius': jQuery_LL_Embedded('.form-submit-button').css('borderTopLeftRadius'),
            'border-top-right-radius': jQuery_LL_Embedded('.form-submit-button').css('borderTopRightRadius')
		});

        /*
         * For Firefox
         */
        jQuery_LL_Embedded('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
            'border-bottom-style': jQuery_LL_Embedded('.form-submit-button').css('borderBottomStyle'),
            'border-right-style': jQuery_LL_Embedded('.form-submit-button').css('borderRightStyle'),
            'border-top-style': jQuery_LL_Embedded('.form-submit-button').css('borderTopStyle'),
            'border-left-style': jQuery_LL_Embedded('.form-submit-button').css('borderLeftStyle')
        });

        /*
         * For Firefox
         */
        jQuery_LL_Embedded('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
            'border-bottom-width': jQuery_LL_Embedded('.form-submit-button').css('borderBottomWidth'),
            'border-right-width': jQuery_LL_Embedded('.form-submit-button').css('borderRightWidth'),
            'border-top-width': jQuery_LL_Embedded('.form-submit-button').css('borderTopWidth'),
            'border-left-width': jQuery_LL_Embedded('.form-submit-button').css('borderLeftWidth')
        });

        /*
         * For Firefox
         */
        jQuery_LL_Embedded('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
            'border-bottom-color': jQuery_LL_Embedded('.form-submit-button').css('borderBottomColor'),
            'border-right-color': jQuery_LL_Embedded('.form-submit-button').css('borderRightColor'),
            'border-top-color': jQuery_LL_Embedded('.form-submit-button').css('borderTopColor'),
            'border-left-color': jQuery_LL_Embedded('.form-submit-button').css('borderLeftColor')
        });

        if(jQuery_LL_Embedded('.form-submit-button').hasClass('fixed_width_submit_button')){
            jQuery_LL_Embedded('.fb-next-page-section').addClass('fixed_width_submit_button');
            jQuery_LL_Embedded('.fb-prev-page-section').addClass('fixed_width_submit_button');
        }

        var cssText = document.getElementsByClassName('fb-next-page-section')[0].style.cssText;
        jQuery_LL_Embedded('.fb-next-page-section').css("cssText", cssText + "color: "+jQuery_LL_Embedded('.form-submit-button').css('color')+" !important;");

        var cssText = document.getElementsByClassName('fb-prev-page-section')[0].style.cssText;
        jQuery_LL_Embedded('.fb-prev-page-section').css("cssText", cssText + "color: "+jQuery_LL_Embedded('.form-submit-button').css('color')+" !important;");

        var color = '';
        jQuery_LL_Embedded('.wrap-tpl-block .tpl-block').each(function(){
            var tpl = jQuery_LL_Embedded(this);
            if(color && color != tpl.find('.tpl-block-content').children('label').css('color')){
                color = '';
                return false;
            }
            color = tpl.find('.tpl-block-content').children('label').css('color');
        });

        if(color){
            jQuery_LL_Embedded('.fb-step-text-page').css('color', color);
        }

        if($el.length){
            $el.each(function(i){
                var $this = jQuery_LL_Embedded(this);
                var stop = false;
                if ( i == 0){
                    if($this.prevAll('.tpl-block').length){
                    	(Array.prototype.reverse.call($this.prevAll('.tpl-block'))).wrapAll('<div class="fb-page-step-section fb-selected"/>');
                    } else {
                        $this.before('<div class="fb-page-step-section fb-selected"></div>');
                    }
                }
                if($this.nextAll('.tpl-block').length){
                    var $all = $this.nextAll('.tpl-block').filter(function(i){
                        if(stop){
                            return false;
                        }
                        if( jQuery_LL_Embedded(this).hasClass('fb-page-break') ){
                            stop = true;
                            return false;
                        } else {
                            return this;
                        }
						
                    });
					
					if ($all.length){
						$all.wrapAll('<div class="fb-page-step-section"/>');
					} else {
						$this.before('<div class="fb-page-step-section"></div>');
					}
                } else {
                    $this.after('<div class="fb-page-step-section"></div>');
                }
                $this.hide();
            });
        }
        init_page.show_submit_button_if_last_wizard_page();
        jQuery_LL_Embedded('.fb-prev-page-section').hide();
        init_page.pageBreakAction();
        jQuery_LL_Embedded('.fb-page-step-section').each(function (page_index) {
            var page = jQuery_LL_Embedded(this);
            var stop = false;
            page.find('.element_error_message_container').each(function () {
                if(jQuery_LL_Embedded(this).text() != ''){
                    if(! page.hasClass('fb-selected')){
                        for(var i = 1; i <= page_index ; i++){
                            jQuery_LL_Embedded('.fb-next-page-section').trigger('click');
                        }
                    }
                    stop = true;
                    return false;
                }
            });
            if(stop){
                return false;
            }
        });
    },
    show_submit_button_if_last_wizard_page: function (){
    	jQuery_LL_Embedded('.form-submit-button').hide();
    	jQuery_LL_Embedded('.fb-page-step-section').each(function(index){
    		if(jQuery_LL_Embedded(this).hasClass('fb-selected') && index == jQuery_LL_Embedded('.fb-wrap-columns-form .fb-page-break').length){
    			jQuery_LL_Embedded('.form-submit-button').show();
    		}
    	});
    },
    pageBreakAction: function(){
        jQuery_LL_Embedded('.fb-prev-page-section').on('click', function(e){
            e.preventDefault();
            var $page = jQuery_LL_Embedded('.fb-page-step-section');
            var length = $page.length;
            var indexPage = $page.index($page.filter('.fb-selected'));

            /*if(is_validate_fields_by_page && ! init_page.validate_current_page()){
                return false;
            }*/

            if (indexPage > 0) {
                $page.filter('.fb-selected').removeClass('fb-selected').prevAll('.fb-page-step-section:first').addClass('fb-selected');
            }
            var newIndex = $page.index($page.filter('.fb-selected'));

            if (newIndex > 0) {
                jQuery_LL_Embedded(this).show();
            } else {
                jQuery_LL_Embedded(this).hide();
            }
            if (newIndex + 1 == length) {
                jQuery_LL_Embedded('.fb-next-page-section').hide();
            } else {
                jQuery_LL_Embedded('.fb-next-page-section').css('display', 'inline-block');
            }
            jQuery_LL_Embedded('.fb-step-text-page span').text(newIndex + 1);
            init_page.show_submit_button_if_last_wizard_page();
        });
        jQuery_LL_Embedded('.fb-next-page-section').on('click', function(e){
            e.preventDefault();
            var $page = jQuery_LL_Embedded('.wrap-tpl-block .fb-page-step-section');
            var length = $page.length;
            var indexPage = $page.index($page.filter('.fb-selected'));

            if(is_validate_fields_by_page && ! init_page.validate_current_page()){
                return false;
            }

            if (indexPage + 1 < length) {
                $page.filter('.fb-selected').removeClass('fb-selected').nextAll('.fb-page-step-section:first').addClass('fb-selected');
            }
            var newIndex = $page.index($page.filter('.fb-selected'));

            if (newIndex + 1 < length) {
                jQuery_LL_Embedded(this).show();
            } else {
                jQuery_LL_Embedded(this).hide();
            }
            if (newIndex + 1 == 1) {
                jQuery_LL_Embedded('.fb-prev-page-section').hide();
            } else {
                jQuery_LL_Embedded('.fb-prev-page-section').css('display', 'inline-block');
            }
            jQuery_LL_Embedded('.fb-step-text-page span').text(newIndex + 1);
            init_page.show_submit_button_if_last_wizard_page();
        });
    },
    pageBreakDestroy: function(){
        jQuery_LL_Embedded('.fb-page-step-section').each(function(){
            var $el = jQuery_LL_Embedded(this).children().detach();
            jQuery_LL_Embedded(this).replaceWith($el);
        });
        jQuery_LL_Embedded('.fb-wrap-columns-form .fb-page-break').show();
        jQuery_LL_Embedded('.form-submit-button').show();
    },
    validate_current_page: function () {
        var is_valid = true;
        jQuery_LL_Embedded('.fb-page-step-section.fb-selected').find('.tpl-block').each(function () {
            var block = jQuery_LL_Embedded(this);
            if(! block.hasClass('hide_element_for_not_matching_conditions') && block.find('.required_astrisk').length > 0){
                if(block.find('input[type="text"].txt-field').length > 0){
                    if(! block.find('input[type="text"].txt-field').val()){
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field. Please enter a value.').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                } else if(block.find('input[type="number"].txt-field').length > 0){
                    if(! block.find('input[type="number"].txt-field').val()){
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field. Please enter a value.').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                } else if(block.find('input[type="file"]').length > 0) {
                    if (!block.find('input[type="file"]').val()) {
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field. Please upload a file.').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                } else if (block.find('textarea').length > 0){
                    if(! block.find('textarea').val()){
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field. Please enter a value.').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                } else if (block.find('input[type="radio"]').length > 0){
                    if(block.find('input[type="radio"]:checked').length > 0){
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    } else {
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field. Please enter a value.').show();
                        is_valid = false;
                    }
                }  else if (block.find('input[type="checkbox"]').length > 0){
                    if(block.find('input[type="checkbox"]:checked').length > 0){
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    } else {
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field. Please enter a value.').show();
                        is_valid = false;
                    }
                } else if (block.find('select').length > 0){
                    if(! block.find('select').val()){
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Required field').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                }
            }
            if(block.attr('data-type-el') == 'email'){
                if(block.find('input[type="text"].txt-field').val()) {
                    if (!isEmail(block.find('input[type="text"].txt-field').val())) {
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('Invalid email address').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                } else {
                    if(is_valid){
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                }
            }
            if(block.attr('data-type-el') == 'number'){
                if(block.find('input').val()) {
                    if(isNaN(block.find('input').val())){
                        block.find('.tpl-block-content').addClass('show_error_class');
                        block.find('.element_error_message_container').html('This field must be a number.').show();
                        is_valid = false;
                    } else {
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                } else {
                    if(is_valid){
                        block.find('.tpl-block-content').removeClass('show_error_class');
                        block.find('.element_error_message_container').html('').hide();
                    }
                }
            }
        });
        return is_valid;
    }
}

function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function center_messages(message_box, trials){
	if (typeof trials == 'undefined') {
		trials = 0;
	}
	document_width = document.body.clientWidth;
	message_box_width = message_box.width();
	
	var left = 0;
	if (document_width > message_box_width) {
		left = (document_width/2-message_box_width/2);
	}
	message_box.css("left", left+"px");
	
	if (trials < 3) {
		trials++;
		center_messages(message_box, trials)
	}
}
function show_success_message(__msg){
	//jQuery_LL_Embedded('#notifyMsg').html('<div class="message"><p>' + __msg + '</p><div>');
	if (__msg != ''){
		jQuery_LL_Embedded('.message-error').hide();
		jQuery_LL_Embedded('.message-warning').hide();
		jQuery_LL_Embedded('.message-success').show();
        jQuery_LL_Embedded('.message-success > p:not(.p_close)').html(__msg);
        jQuery_LL_Embedded('.message-success').fadeIn('slow').delay(8000).fadeOut('slow');
        center_messages(jQuery_LL_Embedded('.message-success'));
    }
}

function show_error_message(__msg){
	//jQuery_LL_Embedded('#notifyMsg').html('<div class="error"><p>' + __msg + '</p><div>');
	if (__msg != ''){
		jQuery_LL_Embedded('.message-success').hide();
		jQuery_LL_Embedded('.message-warning').hide();
		jQuery_LL_Embedded('.message-error').show();
        jQuery_LL_Embedded('.message-error > p:not(.p_close)').html(__msg);
        jQuery_LL_Embedded('.message-error').fadeIn('slow').delay(8000).fadeOut('slow');
        center_messages(jQuery_LL_Embedded('.message-error'));
    }
}

function show_warning_message(__msg){
	//jQuery_LL_Embedded('#notifyMsg').html('<div class="warning"><p>' + __msg + '</p><div>');
	if (__msg != ''){
		jQuery_LL_Embedded('.message-success').hide();
		jQuery_LL_Embedded('.message-error').hide();
		jQuery_LL_Embedded('.message-warning').show();
        jQuery_LL_Embedded('.message-warning > p:not(.p_close)').html(__msg);
        jQuery_LL_Embedded('.message-warning').fadeIn('slow').delay(8000).fadeOut('slow');
        center_messages(jQuery_LL_Embedded('.message-warning'));
    }
}

function remove_success_message(){
	//jQuery_LL_Embedded('#notifyMsg').html('');
	jQuery_LL_Embedded('.message-success > p').html('');
	jQuery_LL_Embedded('.message-success').hide();
}

function remove_error_message(){
	//jQuery_LL_Embedded('#notifyMsg').html('');
	jQuery_LL_Embedded('.message-error > p').html('');
	jQuery_LL_Embedded('.message-error').hide();
}

function remove_warning_message(){
	//jQuery_LL_Embedded('#notifyMsg').html('');
	jQuery_LL_Embedded('.message-warning > p').html('');
	jQuery_LL_Embedded('.message-warning').hide();
}

function remove_all_messages(){
	/*jQuery_LL_Embedded('#notifyMsg').html('');
	jQuery_LL_Embedded('#notifyMsg').html('');*/
	jQuery_LL_Embedded('.message-success > p').html('');
	jQuery_LL_Embedded('.message-success').hide();
	jQuery_LL_Embedded('.message-error > p').html('');
	jQuery_LL_Embedded('.message-error').hide();
	jQuery_LL_Embedded('.message-warning > p').html('');
	jQuery_LL_Embedded('.message-warning').hide();
}


function ll_apply_field_rules (element) {
	jQuery_LL_Embedded("[visible_conditions]").each (function (){
		//Commenting this column because it was preventing having mapped fields with visibility rules to work.
		//if(! parseInt(jQuery_LL_Embedded(this).attr("donot_apply_conditions_if_db_value"))){
			var visible_conditions = jQuery_LL_Embedded(this).attr ("visible_conditions");
			var rules = jQuery_LL_Embedded.parseJSON (visible_conditions);
			var is_matching_rules = true;
			if (typeof rules != "undefined" && rules) {
				for (var i in rules) {
					var rule = rules [i]
					var is_valid_condition = ll_validate_field_rule (rule);
					
					if (typeof rule.operator != "undefined" && rule.operator == "OR") {
						is_matching_rules = (is_valid_condition || is_matching_rules);
					} else {
						is_matching_rules = (is_valid_condition && is_matching_rules);
					}
				}
			}
			if (is_matching_rules) {
				jQuery_LL_Embedded(this).removeClass("hide_element_for_not_matching_conditions");
				if (jQuery_LL_Embedded(this).attr ("data-type-el") == "boolean" && jQuery_LL_Embedded(this).find ("input[type=checkbox]").length > 0){
					var checkbox = jQuery_LL_Embedded(this).find ("input[type=checkbox]");
					if(jQuery_LL_Embedded(this).attr("default_value_when_matching_conditions") == 1){
						if (! checkbox.is(":checked")) {
							init_page.checkboxRadioButtons.check(checkbox, true);
						}
					}else{
						if ( checkbox.is(":checked")) {
							init_page.checkboxRadioButtons.check(checkbox, false);
						}
					}
				}
			} else {
				jQuery_LL_Embedded(this).addClass("hide_element_for_not_matching_conditions");
			}
		//}
	});
}
var operatos = {"equals": "==", "not_equal": "!=", "": "==", "has_value": "!="};
function ll_validate_field_rule(rule) {
	var type = jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").attr("type");
	if(! type){
		type = jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"[]\"]").attr("type");
	}
	var is_checked = "";
	var extra_name = "";
	if(type == "checkbox" || type == "radio"){
		if(type == "checkbox"){
			extra_name = "[]";
		}
		is_checked = ":checked";
	}
	var _return = false;
	if (typeof rule.value == "string") {
		rule.value = [rule.value];
	}
	switch(rule.condition){
		case "equals":
			if(extra_name){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]").length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).length > 0){
						jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).each(function(){
							if(rule.value.length > 0){
								for(var i in rule.value){
									var value = rule.value[i];
									if(jQuery_LL_Embedded(this).val() == value){
										_return = true;
										break;
									}
								}
								if(_return){
									return false;
								}
							}
						});
					}else{
						_return = false;
					}
				}else{
					_return = false;
				}
			}else{
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").length > 0){
                    if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).length > 0){
                        if(rule.value.length > 0){
                            for(var i in rule.value){
                                var value = rule.value[i];
                                if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).val() == value){
                                    _return = true;
                                    break;
                                }
                            }
                        }
                    }else{
                        _return = false;
                    }
				}else{
					_return = false;
				}
			}
			break;
		case "not_equal":
			if(extra_name){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]").length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).length > 0){
						jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).each(function(){
							_return = true;
							if(rule.value.length > 0){
								for(var i in rule.value){
									var value = rule.value[i];
									if(jQuery_LL_Embedded(this).val() == value){
										_return = false;
										break;
									}
								}
								if(! _return){
									return false;
								}
							}
						});
					}else{
						_return = true;
					}
				}else{
					_return = true;
				}
			}else{
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").length > 0){
                    if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).length > 0){
                        _return = true;
                        if(rule.value.length > 0){
                            for(var i in rule.value){
                                var value = rule.value[i];
                                if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).val() == value){
                                    _return = false;
                                    break;
                                }
                            }
                        }
                    }else{
                        _return = true;
                    }
				}else{
					_return = true;
				}
			}
			break;
		case "is_blank":
			if(extra_name){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]").length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).length > 0){
						jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).each(function(){
							if(jQuery_LL_Embedded(this).val() == ""){
								_return = true;
								return false;
							}
						});
					}else{
						_return = true;
					}
				}else{
					_return = true;
				}
			}else{
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).length > 0 ){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).val() == ""){
						_return = true;
					}
				}else{
					_return = true;
				}
			}
			break;
		case "has_value":
			if(extra_name){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]").length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).length > 0){
						jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).each(function(){
							if(jQuery_LL_Embedded(this).val() != ""){
								_return = true;
								return false;
							}
						});
					}else{
						_return = false;
					}
				}else{
					_return = false;
				}
			}else{
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]"+is_checked).val() != ""){
						_return = true;
					}
				}else{
					_return = true;
				}
			}
			break;
		case "contains":
			if(extra_name){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]").length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).length > 0){
						jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).each(function(){
							if(rule.value.length > 0){
								for(var i in rule.value){
									var value = rule.value[i];
									if(jQuery_LL_Embedded(this).val().indexOf(value) !== -1){
										_return = true;
										break;
									}
								}
								if(_return){
									return false;
								}
							}
						});
					}else{
						_return = false;
					}
				}else{
					_return = false;
				}
			}else{
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").length > 0) {
					if (jQuery_LL_Embedded("[name=\"element_" + rule.field_identifier + "\"]" + is_checked).length > 0) {
						if (rule.value.length > 0) {
							for (var i in rule.value) {
								var value = rule.value[i];
								if (jQuery_LL_Embedded("[name=\"element_" + rule.field_identifier + "\"]" + is_checked).val().indexOf(value) !== -1) {
									_return = true;
									break;
								}
							}
						}
					} else {
						_return = false;
					}
				} else {
					_return = false;
                }
			}
			break;
		case "doesnot_contain":
			if(extra_name){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]").length > 0){
					if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).length > 0){
						jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+extra_name+"\"]"+is_checked).each(function(){
							_return = true;
							if(rule.value.length > 0){
								for(var i in rule.value){
									var value = rule.value[i];
									if(jQuery_LL_Embedded(this).val().indexOf(value) !== -1){
										_return = false;
										break;
									}
								}
								if(! _return){
									return false;
								}
							}
						});
					}else{
						_return = true;
					}
				}else{
					_return = true;
				}
			}else{
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").length > 0) {
					if (jQuery_LL_Embedded("[name=\"element_" + rule.field_identifier + "\"]" + is_checked).length > 0) {
						_return = true;
						if (rule.value.length > 0) {
							for (var i in rule.value) {
								var value = rule.value[i];
								if (jQuery_LL_Embedded("[name=\"element_" + rule.field_identifier + "\"]" + is_checked).val().indexOf(value) !== -1) {
									_return = false;
									break;
								}
							}
						}
					} else {
						_return = true;
					}
				} else {
					_return = true;
                }
			}
			break;
		case "check":
			if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").length > 0){
				if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").is(":checked")){
					_return = true;
				}
			}else{
				_return = true;
			}
			break;
		case "doesnot_check":
			if(jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").length > 0){
				if(! jQuery_LL_Embedded("[name=\"element_"+rule.field_identifier+"\"]").is(":checked")){
					_return = true;
				}
			}else{
				_return = true;
			}
			break;
	}
	return _return;
}

function process_on_form_submit_return(){
	var hidden_elements_ids = [];
	jQuery_LL_Embedded(".hide_element_for_not_matching_conditions").each(function(){
		hidden_elements_ids.push(jQuery_LL_Embedded(this).data("element-id"));
	});
	if(hidden_elements_ids.length > 0){
		jQuery_LL_Embedded("<input type='hidden' value='" + hidden_elements_ids + "' name='hidden_elements' />").insertBefore("#wrap-form-submit-button");
	}
	
	var return_val = true;
	if(typeof llf_post_submit == "function"){
		try{
			return_val = llf_post_submit();
		} catch(err){}
	}
	return return_val;
}

function process_on_form_submit(){
	var return_val = process_on_form_submit_return();
	if (return_val) {
		//jQuery_LL_Embedded(".form-submit-button").unbind("click");
		jQuery_LL_Embedded(".form-submit-button").attr("disabled", true);
	}

	return return_val;
}

function process_on_js_form_submit(){
	var return_val = process_on_form_submit_return();
	if (return_val) {
		//jQuery_LL_Embedded(".form-submit-button").unbind("click");
		jQuery_LL_Embedded(".form-submit-button").attr("disabled", true);
	}
	
	if (return_val) {
		var form = jQuery_LL_Embedded('#form_' + form_params.form_id);
		var formData = jQuery_LL_Embedded(form).serialize();
		formData = formData + '&ll_custID=' + form_params.llcustid + '&id=' + form_params.form_id
			+ '&form_token=' + form_params.form_token+ '&form_submitted=1';
		
		var url = LL_TRACKING_SITEROOTHTTPS + 'view-js-form.php?callback=?';
		
		var jqxhr = jQuery_LL_Embedded.getJSON( url, formData).done(function( data ) {
			
			try{
				if (jQuery_LL_Embedded("#ll_form_holder_" + form_params.form_id).find('.ll-datetimepicker').length > 0) {
					jQuery_LL_Embedded("#ll_form_holder_" + form_params.form_id).find('.ll-datetimepicker').datetimepicker('destroy')
				}
			} catch(err){}
			jQuery_LL_Embedded("#ll_form_holder_" + form_params.form_id).empty().html(data.form);
			
			var currentScript = window.llform.loaded_scripts [form_params.form_token];
			llform.complete_render (currentScript, data);
		});
	}
	return false;
}

$(document).ready(function(){
	if (typeof window.ll_is_js_form != 'undefined' && window.ll_is_js_form) {
		if (typeof window.jQuery_LL_Embedded == 'undefined' || !window.jQuery_LL_Embedded) {
			console.log('jQuery_LL_Embedded noConflict')
			window.jQuery_LL_Embedded = $.noConflict(false);
			
			if (typeof jQuery_original != 'undefined' && jQuery_original) {
				$ = jQuery_original;
				jQuery = jQuery_original;
			}
		}
	} else {
		if (typeof $ != 'undefined') {
			window.jQuery_LL_Embedded = $;
		}
	}
	init_page.init_controls();
	
	jQuery_LL_Embedded("input[type=text], input[type=radio], input[type=checkbox], textarea, select").each(function(){
		jQuery_LL_Embedded(this).bind ("change", function (){
			var element = jQuery_LL_Embedded(this);
			ll_apply_field_rules (element);
		});
	});
	ll_apply_field_rules ();
	
	if (typeof ll_elements_inputmask != 'undefined' && ll_elements_inputmask) {
		for (var i in ll_elements_inputmask) {
			jQuery_LL_Embedded('input[name="' + ll_elements_inputmask[i] + '"]').inputmask("mask", {"mask": "(999) 999 - 9999"});
		}
	}
	if (typeof ll_elements_timeEntry != 'undefined' && ll_elements_timeEntry) {
		for (var i in ll_elements_timeEntry) {
			if (typeof ll_app_root == 'undefined' || !ll_app_root) {
				ll_app_root = '';
			}
			jQuery_LL_Embedded('input[name="' + ll_elements_timeEntry[i] + '"]').timeEntry({
				spinnerSize: [0,0,0],
				spinnerImage: ll_app_root + '/js/jquery.timeentry/spinnerDefault.png'
			}).val(ll_elements_timeEntry_values[i]);
		}
	}
	if (typeof ll_elements_datepicker != 'undefined' && ll_elements_datepicker) {
		for (var i in ll_elements_datepicker) {
			jQuery_LL_Embedded('input[name="' + ll_elements_datepicker[i] + '"]').addClass('ll-datetimepicker').datetimepicker({timepicker:false, format:"m/d/Y", value: ll_elements_datepicker_values[i]});
		}
	}
	if (typeof ll_elements_datetimepicker != 'undefined' && ll_elements_datetimepicker) {
		for (var i in ll_elements_datetimepicker) {
			jQuery_LL_Embedded('input[name="' + ll_elements_datetimepicker[i] + '"]').addClass('ll-datetimepicker').datetimepicker({timepicker: true, format:"m/d/Y h:iA", value: ll_elements_datetimepicker_values[i]})
		}
	}
	if (typeof submission_custom_error != 'undefined' && submission_custom_error) {
		show_error_message (submission_custom_error);
	}
});
