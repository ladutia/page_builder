var page = {
	back_button_action_identifier: '',
	ll_email_builder_step: '',
	htmlCss: '',

    is_done_load_landing_pages: false,
    is_done_load_files: false,
    landing_pages: [],
    files: [],
    
    default_calendar_timezone: '',
	
	is_initiating_email: false,
	is_page_ready: false,
	
	UnsubLinkPlaceholder: "Unsubscribe me from this list",
	
	QR_Generate_CheckIn_URL: LL_EM_ROOT + "/qr.php?type=autocheckin&rtoken=",
	QR_Generate_Badge_URL: LL_EM_ROOT + "/qr.php?type=badge&rtoken=",
	
	html_edit_manual: false,
	
	generated_play_images: [],
	
	is_first_save: true,
	email_object: null,
	lock_token: '',
	window_lock_token: '',
	email_object_settings: null,
	
	ll_email_build_type_alias: '',

	active_html_editor: null,
	ll_draft_last: null,
	auto_save_mode: true,
	
	ll_campaign_id: 0,
	is_template: 0,
	newsletterid: 0,
	templateid: 0,
	ll_email_basic_theme_id: 0,
	ll_email_type: 1,
	
	is_save_and_close_after_update_event: false,
	
    init: function(){
    	if(typeof ll_email_builder_step != 'undefined')
    		this.ll_email_builder_step = ll_email_builder_step;
    	if(typeof emb_ll_campaign_id != 'undefined')
    		this.ll_campaign_id = emb_ll_campaign_id;
    	if(typeof emb_is_template != 'undefined')
    		this.is_template = emb_is_template;
    	if(typeof ll_email_build_type_alias != 'undefined')
    		this.ll_email_build_type_alias = ll_email_build_type_alias;
    	if(typeof emb_newsletterid != 'undefined')
    		this.newsletterid = emb_newsletterid;
    	if(typeof emb_templateid != 'undefined')
    		this.templateid = emb_templateid;
    	if(typeof emb_templateid != 'undefined')
    		this.templateid = emb_templateid;
    	if(typeof emb_ll_email_basic_theme_id != 'undefined')
    		this.ll_email_basic_theme_id = emb_ll_email_basic_theme_id;
    	if(typeof em_window_lock_token != 'undefined')
    		this.window_lock_token = em_window_lock_token;
    	if(typeof emb_ll_email_type != 'undefined')
    		this.ll_email_type = emb_ll_email_type;

		ll_combo_manager.make_combo('#select_send_email_preview', {
			is_auto_create_option: true,
			no_results_text: 'Press enter to add new email'
		});
		ll_combo_manager.make_combo('select');
		

		page.default_calendar_timezone = ll_combo_manager.get_selected_value('.field-calendar-email #calendarTimezone');
		
        $('body').on('click', function(){
            $('.settings-tpl.open').removeClass('open');
        });
		$('.step-nav-db').each(function(){
			$(this).css('margin-left',-$(this).width()/2);
		});
        $('.et-tabs > ul li').on('click', function(e){
            e.preventDefault();
            var index = $(this).parent().find('li').index($(this));
            $(this).addClass('active').siblings('li').removeClass('active');
            $(this).parents('.et-tabs').find('.et-tab-content').hide().eq(index).show();
            $('.template, .tmp-theme').removeClass('selected');
            $('.ll_wizard_btn_next').addClass('btn-disabled');
			console.log('click tab');
			var height = $('#mainWrapper').outerHeight() - $('.et-top-header').outerHeight() - $('.et-tabs ul').outerHeight() - 35;
			if($('.info-msg').length){
				height = height - $('.info-msg').height()
			}
			$('.et-tab-content .scrollbar-inner').height(height);
        });
        $('.template, .tmp-theme').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
            $(this).addClass('selected').siblings('.template, .tmp-theme').removeClass('selected');
            //$('.ll_wizard_btn_next').removeClass('btn-disabled');
            page.next();
        });
        $('.btn-sort-records').on('click', function(){
            var $template = $(this).parents('.et-tab-content').find('.wrap-tmp-themes'),
        	$templateli = $template.children('.tmp-theme');
            
            var sortby = $(this).attr('sortby');
            var direction = $(this).attr('direction');

            ll_theme_manager.sort_cards($template, $templateli, sortby, direction);
        });
        $('.btn-preview-theme').bind('click', function(e){
			e.preventDefault();
			e.stopPropagation();
        	var ll_email_basic_theme_id = $(this).parents('.template').attr('ll_email_basic_theme_id');
        	window.open('ll-email-builder-preview.php?themeid=' + ll_email_basic_theme_id + '&ll_email_type=' + page.ll_email_type,'_blank');
        })
        $('.btn-preview-template').bind('click', function(e){
			e.preventDefault();
			e.stopPropagation();
        	var templateid = $(this).parents('.tmp-theme').attr('templateid');
        	window.open('ll-email-builder-preview.php?templateid=' + templateid,'_blank');
        })
        $('.btn-preview-email-campaign').bind('click', function(e){
			e.preventDefault();
			e.stopPropagation();
        	var newsletterid = $(this).parents('.tmp-theme').attr('newsletterid');
        	window.open('ll-email-builder-preview.php?newsletterid=' + newsletterid,'_blank');
        })
        $('.tabs-editor > ul li').on('click', function(e){
            e.preventDefault();
            var index = $(this).parent().find('li').index($(this));
            $(this).addClass('selected').siblings('li').removeClass('selected');
            $(this).parents('.tabs-editor').find('.wrap-tabs-content .tab-content').hide().eq(index).show();
            
            if (index == 0){
				page.resizeTinymce();
			}
            
			var _html = '';
            if (page.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS || page.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS) {
				if (page.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS) {
					_html = page.editor_get_content('eb-editor-html')
				} else if (page.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS) {
					_html = pagePreview.editorEmail.getValue();
				}
				page.set_content({
					html: _html,
					is_preview: false,
					is_html: false,
					is_editor: true
				});
			}
        });
       /* $('.settings-tpl > a.et-btn-white').on('click', function(e){
            e.stopPropagation();
            $(this).parent().toggleClass('open');
            return false;
        });
        $('.settings-tpl > ul li a').on('click', function(e){
            e.stopPropagation();
            $(this).parents('.settings-tpl').toggleClass('open');
            return false;
        });*/
        $('.btn-import-file-email').bind('click', function(){
    		var url = $.trim($('#import_from_url').val());
    		if(url != ''){
    			ll_fade_manager.fade(true);
    			var _data = {};
    			_data['url'] = url;
    			_data['action'] = 'import_from_url';
    			
    			$.ajax( {
    				type :"POST",
    				dataType :"json",
    				async :true,
    				url: "manage-ll-layout-template-process.php",
    				data: $.toJSON(_data),
    				cache :false,
    				success : function(data) {
    					ll_fade_manager.fade(false);
    					if(data){
    						if(data.success == 1){
    							if(typeof data.html != 'undefined' && data.html != null && data.html){
    				                page.set_content({
    				        			html: data.html,
    				        			is_preview: true,
    				        			is_html: true,
    				        			is_editor: true,
    				        			enfore_clear_undo: false
    				        		});
    							}
    						} else {
    							show_error_message(data.message);
    						}
    					} else {
    						show_error_message("Invalid response");
    					}
    				},
    				error: function(){
    					show_error_message("Connection error");
    					ll_fade_manager.fade(false);
    				}
    			});
    		} else {
    			$('#import_from_url').focus();
    			show_error_message("URL Required");
    		}
        })
        $('.searh-themes .txt_field').on('keyup change', function(){
            var $list = $(this).parents('.panel-sort-search').next('.wrap-tmp-themes');
            var searchText = $(this).val();
            
            if (searchText == ''){
                $list.find('.tmp-theme').show();
            } else{
                $list.find('.tmp-theme').hide();
            }
            
            $list.find('.tmp-theme h3:Contains("'+ searchText +'")').each(function(){
                    $(this).parents('.tmp-theme').show();
            });
        });
        $('.eb-slide-box-head').on('click', function(){
            var $this = $(this);
            if ( !$this.hasClass('eb-opened') ){
                $this.siblings('.eb-slide-box-content:visible').slideToggle(function(){
                    $this.siblings('.eb-slide-box-head.eb-opened').removeClass('eb-opened');
                });
            } else {
                
            }
            $this.toggleClass('eb-opened');
            $this.next('.eb-slide-box-content').slideToggle();
            
            return false;
        });
        
        $('.eb-show-slide-panel').on('click', function(e){
            e.stopPropagation();
            var panel = $(this).attr('data-slide-panel');
            if (panel == 'box-border-text'){
                panel = 'box-text';
            }
            if (panel == 'page-design'){
                $('.wrap-panels-el').css('z-index','1');
                $('#eb-' + panel).addClass('active').show().animate({left: 0},300);
                page.updatePageDesignOptions();
            }
            return false;
        });
        $('.eb-save-panel, .eb-cancel-panel').on('click', function(){
			if ($('.tpl-block.tpl-selected').attr ('data-type') == 'box-calendar') {
				page.is_save_and_close_after_update_event = true;
				$('.wrap-btn-update-calendar-email').trigger('click');
			} else {
				//page.updateElementTpl();
				page.save_panel_and_close ($(this));
			}
            return false;
        });
        if ( $('.eb-editor-text').length ){
            tinymce.init(tinymceOpts);
        }
        $('.eb-list-image').on('click','.lnk-img-browse', function(e){
            e.preventDefault();
            var indexImage = $(this).parents('.item-image').index();
            
            page.browseImage($(this), indexImage);
        });
        $('.eb-list-image').on('click','.lnk-img-remove', function(e){
            e.preventDefault();
            var indexImage = $(this).parents('.item-image').index();
            page.removeImage($(this), indexImage);
        });
        $('.eb-list-image').on('click','.lnk-img-edit', function(e){
            e.preventDefault();
            
            var indexImage = $(this).parents('.item-image').index();
            page.browseImage($(this), indexImage);
        });
        $('.eb-list-image').on('click','.lnk-img-edit-image', function(e){
            e.preventDefault();
            
            var indexImage = $(this).parents('.item-image').index();
            page.editImage($(this), indexImage);
        });
        $('.eb-list-image').on('click','.lnk-img-alt', function(e){
            e.preventDefault();
    		
            var $el = $(this)
            var indexImage = $($el).parents('.item-image').index();
            //page.browseImage($(this), indexImage);

            var $tpl = $('.tpl-block.tpl-selected') || $tpl;
            var $boxImg = $tpl.find('.ebImageContent').eq(indexImage);
            var alt = $boxImg.find('img').attr('alt')
            
            $('#ll_popup_edit_image_alt input[name=ll_image_alt_text]').val(alt)
            
    		$('#ll_popup_edit_image_alt #ll_popup_edit_image_alt_cancel').unbind('click').bind('click', function(){
    			ll_popup_manager.close('#ll_popup_edit_image_alt')
    		})
    		$('#ll_popup_edit_image_alt #ll_popup_edit_image_alt_save').unbind('click').bind('click', function(){
    			var alt = $('#ll_popup_edit_image_alt input[name=ll_image_alt_text]').val()
    			$boxImg.find('img').attr('alt', alt)
    			ll_popup_manager.close('#ll_popup_edit_image_alt')
    		})
    		
			ll_popup_manager.open('#ll_popup_edit_image_alt')
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
        $('.eb-list-image').on('click','.lnk-img-link', function(e){
            e.preventDefault();
    		
            var $el = $(this)
            var indexImage = $($el).parents('.item-image').index();
            //page.browseImage($(this), indexImage);

            var $tpl = $('.tpl-block.tpl-selected') || $tpl;
            var $boxImg = $tpl.find('.ebImageContent').eq(indexImage);
            
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
    		})
    		
			ll_popup_manager.open('#ll_popup_edit_image_link')
        });

		ll_combo_manager.event_on_change('#select_insert_ll_field_category', function(){
			var select_insert_ll_field_category = ll_combo_manager.get_selected_value('#select_insert_ll_field_category');
			$('.container_select_ll_fields').hide();
			$('.container_ll_fields_' + select_insert_ll_field_category).show();
		});
		ll_combo_manager.trigger_event_on_change('#select_insert_ll_field_category');

		ll_combo_manager.event_on_change('#select_insert_ll_condition_field_category', function(){
			var select_insert_ll_condition_field_category = ll_combo_manager.get_selected_value('#select_insert_ll_condition_field_category');
			$('.container_select_ll_condition_fields').hide();
			$('#container_ll_condition_fields_' + select_insert_ll_condition_field_category).show();
		});
		ll_combo_manager.trigger_event_on_change('#select_insert_ll_condition_field_category');
		
        var resizebleMaxWidth = $('#email-editor').outerWidth()-448;
        var startResizebleWidth = 0;
        
        var $previewColResizables = [];
        $('.wrap-preview-col').each(function(){
        	$previewColResizables [$previewColResizables.length] = $(this).resizable({
                handles: 'e',
                minWidth: 630,
                maxWidth: resizebleMaxWidth,
                start: function(event, ui) {
                    startResizebleWidth = $(this).find('.preview-col').outerWidth();
                },
                resize: function(event, ui) {
                    var $colRight = $(this).parent().find('.tool-col');
                    var width = $('#email-editor').outerWidth() - $(this).parent().find('.wrap-preview-col').outerWidth();
                    $colRight.css('width', width + 'px');
                },
                stop: function(event, ui) {
                	$(this).parent().find('.wrap-preview-col').css({
                        left: '0',
                        width: 'auto',
                        right: $(this).parent().find('.tool-col').outerWidth()
                    });
                }
            });
        })
        
        $(window).resize(function(){
           resizebleMaxWidth = $('#email-editor').outerWidth()-448;
           for(var _i in $previewColResizables){
        	   $previewColResizables[_i].resizable('option', 'maxWidth', resizebleMaxWidth);
           }
        });
        $('.tpl-btn-hide-show-border').on('click', function(e){
            e.preventDefault();
            $('#container_designer_html').toggleClass('tpl-show-border-box');
            if ( $('#container_designer_html').hasClass('tpl-show-border-box') ){
                $(this).text('Hide Dashed Border');
            } else {
                $(this).text('Show Dashed Border');
            }
        });
        $('#videoUrlThumbnail').bind('change', function(){
            var link = $(this).val();
            page.updateVideoImg(link);
        });
        
        /*$('span.span_ll_email_name_update').keypress(function(e){
        	if (e.which == 13) {
        		$("span.span_ll_email_name_update").blur ();
        		return false;
        	}
        	return true;
		}).on('focus', function() {
        	if($(this).hasClass('ellipsis')) {
        		$(this).removeClass('ellipsis')
        	}
            $(this).data('before', $(this).html());
            return $(this);
        }).on('blur', function() {
        	if(!$(this).hasClass('ellipsis')) {
        		$(this).addClass('ellipsis')
        	}
        	// keyup paste
            if ($(this).data('before') !== $(this).html()) {
            	$(this).data('before', $(this).html());
            	$(this).trigger('change');
            }
            return $(this);
        });
        $('span.span_ll_email_name_update').bind ('change', function (){
        	var _name = $.trim ($(this).text())
			page.save_email_settings(true, _name);
        })*/
		$('.eb-clear-line span').on('click', function(e){
			e.preventDefault();
			var type = $(this).parent().attr('data-type');
			page.clearStyleAll(type);
		});
		$('.wrap-btn-clear-all > a').on('click', function(e){
			e.preventDefault();
			$(this).parents('.eb-style-box').find('.eb-clear-line span').trigger('click');
		});
		$('.wrap-btn-update-calendar-email').bind ('click', function (){
	        var event = {};
			event.title = $.trim ( $('.field-calendar-email .field-event-title').val() );
			event.start = $.trim ( $('.field-calendar-email .field-event-start').val() );
			event.end = $.trim ( $('.field-calendar-email .field-event-end').val() );
			event.timezone = $.trim ( ll_combo_manager.get_selected_value('.field-calendar-email #calendarTimezone') );
			event.location = $.trim ( $('.field-calendar-email .field-event-location').val() );
			event.organizer_name = $.trim ( $('.field-calendar-email .field-event-organizer-name').val() );
			event.organizer_email = $.trim ( $('.field-calendar-email .field-event-organizer-email').val() );
			event.description = $.trim ( $('.field-calendar-email .field-event-description').val() );
            
			if (event.title && event.title != '') {
				if (event.start && event.start != '') {
					if (event.end && event.end != '') {
						if (event.timezone && event.timezone != '') {
							if (event.location && event.location != '') {
								if (event.organizer_name && event.organizer_name != '') {
							        var $tpl = $('.tpl-block.tpl-selected');
							        var opt = $tpl.data('json');
							        opt.event = event;
						            $tpl.attr('data-json', JSON.stringify( opt ));
						            
						            page.set_calendar_control_urls ();
						            if (page.is_save_and_close_after_update_event) {
										page.is_save_and_close_after_update_event = false;
										page.save_panel_and_close ($(this));
									}
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
			page.is_save_and_close_after_update_event = false;
		})
		ll_date_picker_manager.make_picker ('#start-datetime-calendar-email', {
			timepicker: true,
			minDate: false,
			format: 'Y-m-d H:i:00',
			//format: 'm/d/Y h:iA',
			formatTime:'h:i A',
			step: 5
		});
		ll_date_picker_manager.make_picker ('#end-datetime-calendar-email', {
			timepicker: true,
			minDate: false,
			format: 'Y-m-d H:i:00',
			//format: 'm/d/Y h:iA',
			formatTime:'h:i A',
			step: 5
		});
		//ll_date_picker_manager.event_on_change('#start-datetime-calendar-email', function () {
		$('#start-datetime-calendar-email').bind ('change', function (){
			var startDate = ll_date_picker_manager.get_selected_date_text('#start-datetime-calendar-email');
			var endDate = ll_date_picker_manager.get_selected_date_text('#end-datetime-calendar-email');
			if(startDate) {
				startDate = new Date(startDate);
				if(endDate){
					endDate = new Date(endDate);
					if (endDate <= startDate) {
						startDate.setHours(startDate.getHours() + 1);
						startDate = startDate.format('yyyy-mm-dd HH:MM:00');
						ll_date_picker_manager.set_date('#end-datetime-calendar-email',startDate);
					}
				} else {
					startDate.setHours(startDate.getHours() + 1);
					startDate = startDate.format('yyyy-mm-dd HH:MM:00');
					ll_date_picker_manager.set_date('#end-datetime-calendar-email',startDate);
				}
			}
		});
		/*
		$('#start-datetime-calendar-email, #end-datetime-calendar-email').datetimepicker({
            timepicker:true,
            format:'m/d/Y H:i:s',
            value: new Date()
        });
		 */
		/**
		 * *****************************************************************************
		 * *****************************************************************************
		 */
        $('.ll_wizard_btn_back').bind('click', function(e){
        	switch(page.back_button_action_identifier){
	        	case 'select_email_type':
					page.back_button_action_identifier = '';
					$('.container_email_type').each(function(){
						$(this).removeClass('selected');
					})
					$('.container_email_types').show();
					$('.container_editor_types').hide();
					page.process_wizard_buttons_visibility();
	        		return false;
	        		break;
        	}
        	return true;
        })
		$('.container_email_type').bind('click', function(){
			var ll_email_type_alias = $(this).attr('ll_email_type_alias');
			if(typeof ll_email_type_alias != 'undefined' && ll_email_type_alias != ''){
				$('.container_email_type').each(function(){
					$(this).removeClass('selected');
				})
				if(ll_email_type_alias == LL_EMAIL_TYPE_START_FROM_SCRATCH_ALIAS){
					$('.container_email_types').hide();
					$('.container_editor_types').show();
					page.back_button_action_identifier = 'select_email_type';
				} else {
					$(this).addClass('selected');
					if(ll_email_type_alias != LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS && ll_email_type_alias != LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS ){
						page.back_button_action_identifier = '';
					}
                    //$('.ll_wizard_btn_next').trigger('click');
                    page.next();
				}
			} else {
				show_error_message("Please Select Valid Email Type");
			}
			page.process_wizard_buttons_visibility();
		})
		$('.ll_wizard_btn_next').bind('click', function(){
			if(!$(this).hasClass('btn-disabled')){
				page.next();
			}
		})
		$('.btn-exit-preview').bind('click', function(){
			page.end_preview();
		})
		$('.btn-preview-email').bind('click', function(){
			page.set_preview_content();
		})
		$('.btn-manage-email-attachements').bind('click', function(){
		})
		$('#ll_popup_email_insert_token_cancel').bind('click', function(){
			ll_popup_manager.close('#ll_popup_email_insert_token')
		})
		$('#ll_popup_email_insert_token_save').bind('click', function(){
			//@todo InsertLink
			var select_insert_ll_field_category = ll_combo_manager.get_selected_value('#select_insert_ll_field_category');
			if(select_insert_ll_field_category != ''){
				var ll_field_parent = ll_combo_manager.get_selected_value('.container_ll_fields_' + select_insert_ll_field_category + ' select.ll-field-parents');
				var insert_ll_field = ll_combo_manager.get_selected_value('.container_ll_fields_' + select_insert_ll_field_category + ' select.ll-field-tokens');
				if(typeof insert_ll_field != 'undefined' && insert_ll_field != ''){
					if (select_insert_ll_field_category == 'registration_system') {
						if(typeof ll_field_parent != 'undefined' && ll_field_parent != ''){
							insert_ll_field = insert_ll_field.replace ('.tokenname.', '.' + ll_field_parent + '.');
							
							page.InsertLink(insert_ll_field)
							ll_popup_manager.close('#ll_popup_email_insert_token')
						} else {
							show_error_message ('Please Select Registration System');
						}
					} else if (select_insert_ll_field_category == 'documentation_fields' || select_insert_ll_field_category == 'documentation_fields_last_submission') {
						var tkn_identnfier = 'documents_set';
						if (select_insert_ll_field_category == 'documentation_fields_last_submission') {
							tkn_identnfier = 'documents_set_last_submission';
						}
						
						var document_token = insert_ll_field;
						var insert = '';
						insert += '{% if ( ___' + tkn_identnfier + ' and ___' + insert_ll_field + '___ ) %}\n';
						insert += '<div>Here are the docs you requested:</div>';
						insert += '<div>';
						insert += '<ul>';
						insert += '{% for document in ___' + insert_ll_field + '___ %}\n';
						insert += '<li> <a href="{{ document.url }}">{{ document.name }}</a></li>\n';
						insert += '{% endfor %}';
						insert += '</ul>\n';
						insert += '</div>';
						insert += '{% endif %}';
						page.InsertLink(insert);
						ll_popup_manager.close('#ll_popup_email_insert_token');
					} else {
						page.InsertLink(insert_ll_field)
						ll_popup_manager.close('#ll_popup_email_insert_token')
					}
				} else {
					show_error_message ('Please Select Field');
				}
			} else {
				show_error_message ('Please Select Field Category');
			}
		})
		$('#ll_popup_email_insert_condition_cancel').bind('click', function(){
			ll_popup_manager.close('#ll_popup_email_insert_condition')
		})
		$('#ll_popup_email_insert_condition_save').bind('click', function(){

			var select_ll_condition_if_type = ll_combo_manager.get_selected_value('#select_ll_condition_if_type');
			var select_ll_condition_operator = ll_combo_manager.get_selected_value('#select_ll_condition_operator');
			var select_insert_ll_condition_field_category = ll_combo_manager.get_selected_value('#select_insert_ll_condition_field_category');
			var select_ll_condition_field = ll_combo_manager.get_selected_value('#container_ll_condition_fields_' + select_insert_ll_condition_field_category +' select');
			var select_ll_condition_value = ll_combo_manager.get_selected_value('#select_ll_condition_value');
			select_ll_condition_value = select_ll_condition_value.replace(/\\/g, '\\\\');
			select_ll_condition_value = select_ll_condition_value.replace(/'/g, '\\\'');
			select_ll_condition_value = select_ll_condition_value.replace(/"/g, '\\\"');
			var is_else_if = $('#add_if_else').is (':checked') ? 1 : 0;
			var ignore_case = $('#case-sensitive').is (':checked') ? 0 : 1;

			if(typeof select_ll_condition_if_type != 'undefined' && typeof select_ll_condition_field != 'undefined' &&  typeof select_ll_condition_operator != 'undefined' &&
				select_ll_condition_if_type != '' && select_ll_condition_field != '' &&  select_ll_condition_operator != ''){
				var common_condition_part =  '{% '+select_ll_condition_if_type + ' ( ___' + select_ll_condition_field + '___ ' ;
				if(select_ll_condition_operator == ' ' || select_ll_condition_operator == '== false'){
					page.addIfCondition(common_condition_part + select_ll_condition_operator +  ' ) %}' , is_else_if);
				} else if(typeof select_ll_condition_value != 'undefined' && select_ll_condition_value != '' ) {
					if (select_ll_condition_operator == 'matches') {
						page.addIfCondition(common_condition_part + select_ll_condition_operator + ' \'/.*' + select_ll_condition_value + '.*/' + (ignore_case  ? 'i' : '') + '\' ) %}', is_else_if);
					}
					else if (ignore_case && isNaN(select_ll_condition_value)) {
						page.addIfCondition(common_condition_part +'|lower '+ select_ll_condition_operator + ' \'' + select_ll_condition_value + '\'|lower ) %}', is_else_if);
					} else if (isNaN(select_ll_condition_value) ){
						page.addIfCondition(common_condition_part + select_ll_condition_operator + ' \'' + select_ll_condition_value + '\' ) %}', is_else_if);
					} else {
						page.addIfCondition(common_condition_part + select_ll_condition_operator + ' ' + select_ll_condition_value + ' ) %}', is_else_if);
					}
				}else {
					show_error_message ('Please Add Condition Value');
				}
			} else {
				show_error_message ('Please Select Condition Fields');
			}
		})

		$('#add_if_else').change(function () {
			if($('#add_if_else').is (':checked')) {
				$('#container-else-if-condition').show();
			} else {
				$('#container-else-if-condition').hide();
			}
		});

		$('#select_ll_condition_operator').change(function () {
			var select_ll_condition_operator = ll_combo_manager.get_selected_value('#select_ll_condition_operator');
			if(select_ll_condition_operator == ' ' || select_ll_condition_operator == '== false') {
				$('#select_ll_condition_value').hide();
			} else {
				$('#select_ll_condition_value').show();
			}
            if(select_ll_condition_operator == ' ' || select_ll_condition_operator == '== false' ||
                select_ll_condition_operator == '<' || select_ll_condition_operator == '>' ||
                select_ll_condition_operator == '>=' || select_ll_condition_operator == '<=') {
                $('#ignore-case-div').hide();
            } else {
                $('#ignore-case-div').show();
            }
		})
		/*
		$('#ll_popup_email_insert_dynamic_content_tag_cancel').bind('click', function(){
			ll_popup_manager.close('#ll_popup_email_insert_dynamic_content_tag')
		})
		$('#ll_popup_email_insert_dynamic_content_tag_save').bind('click', function(){
			//@todo InsertLink
			var insert_dynamic_content_tag = ll_combo_manager.get_selected_value('#select_insert_dynamic_content_tag');
			if(typeof insert_dynamic_content_tag != 'undefined' && insert_dynamic_content_tag != ''){
				page.InsertLink(insert_dynamic_content_tag)
				ll_popup_manager.close('#ll_popup_email_insert_dynamic_content_tag')
			} else {
				show_error_message ('Please Select Dynamic Content Tag');
			}
		})
		*/
		$('.btn-save-as-template').bind('click', function(){
			ll_popup_manager.open('#ll_popup_save_as_template')
		})
		$('#ll_popup_save_as_template_cancel').bind('click', function(){
			ll_popup_manager.close('#ll_popup_save_as_template')
		})
		$('#ll_popup_save_as_template_save').bind('click', function(){
			page.save_as_template();
		})
		$('.btn-send-preview-email').bind('click', function(){
			$('#container_is_preview_with_mail_merge').hide ();
			if (page.newsletterid > 0) {
				$('#container_is_preview_with_mail_merge').show ();
			}
			ll_popup_manager.open('#ll_popup_send_email_preview')
		})
		$('#ll_popup_send_email_preview_cancel').bind('click', function(){
			ll_popup_manager.close('#ll_popup_send_email_preview')
		})
		$('#ll_popup_send_email_preview_save').bind('click', function(){
			page.send_email_preview();
		})
		$('.btn-email-plain-text').bind('click', function(){
			if(page.email_object.is_auto_save_textbody == 0){
				$('#ll_popup_plain_text_import_from_html').show();
			}
			$('textarea[name=ll_email_textbody]').val(page.email_object.textbody)
			ll_popup_manager.open('#ll_popup_plain_text')
		})
		$('#ll_popup_plain_text_cancel').bind('click', function(){
			ll_popup_manager.close('#ll_popup_plain_text')
		})
		$('#ll_popup_plain_text_import_from_html').bind('click', function(){
			var ll_draft = page.collect_ll_draft()
			$('textarea[name=ll_email_textbody]').val(ll_draft.textbody)
		})
		$('#ll_popup_plain_text_save').bind('click', function(){
			if(page.email_object.is_auto_save_textbody == 0){
				page.save_plain_text();
			} else {
                ll_confirm_popup_manager.open('We will not automatically save the plain-text version of your email if you make any edits. Are you sure you want to save these changes?', function(){
                    page.save_plain_text();
                });
            }
		})
		
		$('#ll_popup_manage_email_lock_unlock').bind('click', function(){
			page.unlock_other_and_lock_to_me();
		})
		
		$('.btn_unlock_and_exit_build').bind('click', function(){
    		page.set_auto_save_mode_status(false);
			var _redirect_href = $(this).attr('href')
			if($(this).hasClass('disable-prompt')){
				page.next(_redirect_href);
				return false;
			} else {
				$('#ll_popup_manage_confirm_exit #ll_popup_manage_confirm_exit_url').val(_redirect_href)
				ll_popup_manager.open('#ll_popup_manage_confirm_exit')
				return false;
			}
		})
		$('#ll_popup_manage_confirm_exit_cancel').bind('click', function(){
    		page.set_auto_save_mode_status(true);
			ll_popup_manager.close('#ll_popup_manage_confirm_exit')
		})
		$('#ll_popup_manage_confirm_exit_go').bind('click', function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit')
			var _redirect_href = $('#ll_popup_manage_confirm_exit #ll_popup_manage_confirm_exit_url').val()
			page.unlock_email(_redirect_href);
		})
		$('#ll_popup_manage_confirm_exit_save_and_exit').bind('click', function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit')
			var _redirect_href = $('#ll_popup_manage_confirm_exit #ll_popup_manage_confirm_exit_url').val()
			page.next(_redirect_href);
		})

		if(typeof _moxiemanager_plugin != 'undefined'){
			tinyMCE.init({
				entity_encoding : "UTF-8",
				elements : "richEditor",
				selector: '#advanced-editor-if-condition',
				//theme : "advanced",
				plugins: "hr image lists pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
				auto_reset_designmode:true,
				resize: false,
				toolbar: [
					"bold italic underline | link unlink image | alignleft aligncenter alignright alignjustify | bullist numlist"
				],
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
				menubar: false,
				statusbar: false,
				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',
				autosave_ask_before_unload: false,
				height : 200,
				setup : function(ed) {
					ed.on('init', function(e) {

					});
				}
			});
			tinyMCE.init({
				entity_encoding : "UTF-8",
				elements : "richEditor",
				selector: '#advanced-editor-else-if-condition',
				//theme : "advanced",
				plugins: "hr image lists pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
				auto_reset_designmode:true,
				resize: false,
				toolbar: [
					"bold italic underline | link unlink image | alignleft aligncenter alignright alignjustify | bullist numlist"
				],
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
				menubar: false,
				statusbar: false,
				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',
				autosave_ask_before_unload: false,
				height : 200,
				setup : function(ed) {
					ed.on('init', function(e) {

					});
				}
			});
		}

		this.process_wizard_buttons_visibility();
		
		this.process_load();
    },
    process_complete_init: function(){
        $('.touch-spin').TouchSpin({
            min: 0,
            max: 100
        });
        $('.divider-field').TouchSpin({
            min: 0,
            max: 1000
        });
        
        page.colorBox();
        page.dragAndDropElements();
        page.actionsBtnBlock();
        page.isElements();
        page.updateIndividualElTpl();
        page.sortableImages();
        page.addImagesList();
        page.socialIconAction();
        page.sortableSocial();
        
        if ( $('.eb-box-code-editor').length ){
            page.codeBox.init();
        }
        
        if( $('.wrap-layout').length ){
            page.heightWrapLayout();
            $(window).resize(function(){
                page.heightWrapLayout();
            });
        }
        page.heightBodyTable();
    	page.titleEmailLength();
        $(window).resize(function(){
            page.heightBodyTable();
            page.updateColWidth1150();
    		page.titleEmailLength();
        });
        page.updateColWidth1150();
        page.updatePageDesign();
        
        page.initiate_import_area()

    	switch(this.ll_email_builder_step){
	    	case 'setup_advanced':
	    		/*$('.email-builder-container-line-criteria .add-line-criteries').live ('click', function (){
	    			var line_identifier = $(this).parents ('.email-builder-container-line-criteria').attr ('line-identifier')
	    			if (line_identifier == 'font_references'){
		    			page.add_font_reference_line('', true);
	    			} else if (line_identifier == 'font_names') {
		    			page.add_font_name_line('', true);
	    			}
	    		})
	    		$('.email-builder-container-line-criteria .remove-line-criteries').live ('click', function (){
	    			var container = $(this).parents ('.email-builder-container-line-criteria');
	    			$(this).parents ('.line-criteries').remove();
	    			page.update_line_info (container);
	    		})
	    		$('.email-builder-container-line-criteria input[type=text]').live ('change', function (){
	    			var val = $(this).val()
	    			if (val.indexOf ('"') != -1 || val.indexOf ("'") != -1) {
		    			val = val.replace (/'/g, '').replace (/"/g, '')
		    			$(this).val(val)
	    			}
	    			var container = $(this).parents ('.email-builder-container-line-criteria');
	    			page.update_line_info (container);
	    		})*/

	            custom_fonts_manager.load_fonts('#bodyTable');

              /*  var $tpl = $('#bodyTable');
	            var font_references = $tpl.data('font-references');
	            var font_names = $tpl.data('font-names');
	            if (typeof font_references != 'undefined') {
	            	for (var i in font_references) {
	    	    		this.add_font_reference_line (font_references [i], true);
	            	}
	            }
	            if (typeof font_names != 'undefined') {
	            	for (var i in font_names) {
	    	    		this.add_font_name_line (font_names [i], true);
	            	}
	            }

    			var container = $('[line-identifier=font_references].email-builder-container-line-criteria');
    			page.update_line_info (container);
    			var container = $('[line-identifier=font_names].email-builder-container-line-criteria');
    			page.update_line_info (container);

	    		this.add_font_reference_line ('', false);
	    		this.add_font_name_line ('', false);*/
	    		break;
    	}
    },
   /* update_line_info: function (container){
		var line_identifier = $(container).attr ('line-identifier')
		var collection = [];
		$(container).find('input[type=text]').each (function(){
			var item = $.trim($(this).val());
			if (item != '' && collection.indexOf (item) == -1) {
				collection.push ( item );
			}
		})
		
        var $tpl = $('#bodyTable');
		if (line_identifier == 'font_references'){
            $tpl.attr('data-font-references', JSON.stringify( collection ));
		} else if (line_identifier == 'font_names') {
            $tpl.attr('data-font-names', JSON.stringify( collection ));
		}
		this.apply_line_items(line_identifier, collection);
    },
    apply_line_items: function (line_identifier, items){
        var $tpl = $('#bodyTable');
    	if (line_identifier == 'font_references'){
			for (var i in items) {
				var item = items [i];
				if (item != '') {
		    		if ($('head').find ('link[custom-font-resource=1][href="' + item + '"]').length == 0) {
		    			$('head').append('<link rel="stylesheet" href="' + item + '" type="text/css" custom-font-resource="1" />');
		    		}
				}
			}
			$('head').find ('link[custom-font-resource=1]').each (function (){
    			var href = $(this).attr ('href');
				if (href && href != '' && items.indexOf (href) == -1) {
					$(this).remove ();
				}
    		})
		} else if (line_identifier == 'font_names') {
			$('.dropdown-select-font-name').each (function (){
				for (var i in items) {
					var item = items [i];
					if (item != '') {
						ll_combo_manager.add_option_if_not_exist($(this), item, item);
					}
				}
				$(this).find ('option').each (function (){
					var standard_font = $(this).attr ('standard_font');
					if (typeof standard_font == 'undefined' || standard_font != 1) {
						var font = $.trim ($(this).val ());
						if (font && font != '' && items.indexOf (font) == -1) {
							$(this).remove ();
						}
					}
				})
				ll_combo_manager.refresh($(this));
			})
		}
    },
	add_font_reference_line: function(_value, allow_remove){
		var _html = '';
		_html += '<div class="line-criteries">';
		_html += '<a href="javascript:void(0)" class="add-line-criteries"></a>';
		if(allow_remove){
			_html += '<a href="javascript:void(0)" class="remove-line-criteries"></a>';
		}
		_html += '<input type="text" class="txt-field txt-field-wide" placeholder="Enter reference URL" value="' + _value + '" />';
		_html += '</div>';
		$('#container_custom_font_references').append(_html);
	},
	add_font_name_line: function(_value, allow_remove){
		var _html = '';
		_html += '<div class="line-criteries">';
		_html += '<a href="javascript:void(0)" class="add-line-criteries"></a>';
		if(allow_remove){
			_html += '<a href="javascript:void(0)" class="remove-line-criteries"></a>';
		}
		_html += '<input type="text" class="txt-field txt-field-wide" placeholder="Enter font name" value="' + _value + '" />';
		_html += '</div>';
		$('#container_custom_font_names').append(_html);
	},*/
    process_load: function(){
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
	    	case 'setup_advanced':
	    	case 'preview':
				var _data = {};
				_data['newsletterid'] = page.newsletterid;
				_data['templateid'] = page.templateid;
				_data['ll_email_basic_theme_id'] = page.ll_email_basic_theme_id;
				_data['ll_email_type'] = page.ll_email_type;
				_data['window_lock_token'] = page.window_lock_token;
				_data['action'] = 'load';

				ll_fade_manager.fade(true, 'load');
				$.ajax( {
					type :"POST",
					dataType :"json",
					async :true,
					url: "ll-email-builder-process.php",
					data: $.toJSON(_data),
					cache :false,
					success : function(data) {
						setTimeout(function() {
							ll_fade_manager.fade(false);
						}, 500);
						if(data){
							if(data.success == 1){
								page.email_object = data.email_object;
                                if(typeof email_common != 'undefined'){
                                    email_common.newsletterid = page.email_object.newsletterid;
                                    email_common.templateid = page.email_object.templateid;
                                }
								if(page.ll_email_builder_step == 'preview' || page.email_object.is_locked != 1){
									setTimeout(function() {
										page.complete_load();
									}, 100);
								} else {
									page.prompt_as_locked();
								}
							} else {
								page.newsletterid = 0;
								page.templateid = 0;
                                if(typeof email_common != 'undefined'){
                                    email_common.newsletterid = 0;
                                    email_common.templateid = 0;
                                }
								show_error_message(data.message);
							}
						} else {
							page.newsletterid = 0;
							page.templateid = 0;
                            if(typeof email_common != 'undefined'){
                                email_common.newsletterid = 0;
                                email_common.templateid = 0;
                            }
							show_error_message("Invalid response");
						}
					},
					error: function(){
						page.newsletterid = 0;
						page.templateid = 0;
                        if(typeof email_common != 'undefined'){
                            email_common.newsletterid = 0;
                            email_common.templateid = 0;
                        }
						show_error_message("Connection error");
						ll_fade_manager.fade(false);
					}
				});
	    		break;
    	}
    },
    complete_load: function(){
    	if(!this.check_is_page_ready()){
			setTimeout(function() {
				page.complete_load();
			}, 100);
    	} else {
			var _html = (page.ll_email_builder_step == 'setup_advanced') ? page.email_object.htmlbody_designer : page.email_object.htmlbody;
			
            page.set_content({
    			html: _html,
    			is_preview: true,
    			is_html: true,
    			is_editor: true
    		});

			page.ll_draft_last = page.collect_ll_draft();
			
			if(page.ll_email_builder_step == 'setup_native' || page.ll_email_builder_step == 'setup_advanced'){
				page.process_mark_as_locked();
			}

			page.process_complete_init();
    	}
    },
    process_mark_as_locked: function(){
		var _data = {};
		_data['newsletterid'] = this.newsletterid;
		_data['templateid'] = this.templateid;
		_data['window_lock_token'] = page.window_lock_token;
		_data['action'] = 'mark_as_locked';

		$.ajax( {
			type :"POST",
			dataType :"json",
			async :true,
			url: "ll-email-builder-process.php",
			data: $.toJSON(_data),
			cache :false,
			success : function(data) {
				if(data){
					if(data.success == 1){
						page.lock_token = data.lock_token;
                        
			            page.start_auto_save_draft_mode();
					} else {
						show_error_message(data.message);
					}
				} else {
					show_error_message("Unknown error");
				}
			},
			error: function(){
				ll_fade_manager.fade(false);
				show_error_message("Unknown error");
			}
		});
    },
	save_panel_and_close: function ($btn){
		$('.eb-right-panel-slide.active').removeClass('active').animate({left: '579px'}, 300, function(){
			$(this).hide();
			$('.wrap-panels-el').css('z-index','-1');
		});
		page.tplCode.removeTplCode();
		page.updateElementTpl($btn);
		page.go_auto_save_draft_mode_setup('save_draft');
	},
    prompt_as_locked: function(){
    	var lock_message = '';
    	var object_type = '';
    	if(page.newsletterid){
        	var object_type = 'Email Campaign';
        	$('#ll_popup_manage_email_lock_exit').attr('href', 'll-emails.php');
    	} else {
        	var object_type = 'Email Template';
        	$('#ll_popup_manage_email_lock_exit').attr('href', 'll-email-templates.php');
    	}
		ll_popup_manager.set_title('#ll_popup_manage_email_lock', object_type + ' Locked');
		
    	$('#container_email_lock_status').html(page.email_object.lock_message);
    	
		ll_popup_manager.open('#ll_popup_manage_email_lock')
    },
    unlock_other_and_lock_to_me: function(){
		page.complete_load();
		ll_popup_manager.close('#ll_popup_manage_email_lock')
    },
    unlock_email: function(_redirect_href){
    	_redirect_href = (typeof _redirect_href != 'undefined' && _redirect_href) ? _redirect_href : false;
    	
		var _data = {};
		_data['newsletterid'] = this.newsletterid;
		_data['templateid'] = this.templateid;
		_data['lock_token'] = page.lock_token;
		_data['action'] = 'unlock_edit';

		$.ajax( {
			type :"POST",
			dataType :"json",
			async :true,
			url: "ll-email-builder-process.php",
			data: $.toJSON(_data),
			cache :false,
			success : function(data) {
				if(_redirect_href){
					window.location = _redirect_href;
				}
			},
			error: function(){
				show_error_message("Unknown error");
			}
		});
    },
    check_is_page_ready: function(){
    	if(!this.is_page_ready){
	    	switch(this.ll_email_builder_step){
		    	case 'setup_native':
		    		if(this.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS){
			    		var _editor = tinymce.get('eb-editor-html')
						if(_editor && typeof _editor.is_initiatlized != 'undefined' && _editor.is_initiatlized){
				    		this.is_page_ready = true;
			    		}
			    	} else {
			    		this.is_page_ready = true;
			    	}
		    		break;
		    	default:
		    		this.is_page_ready = true;
		    		break;
			}
    	}
    	return this.is_page_ready;
    },
	start_auto_save_draft_mode: function(){
		var wait_period = 20000;
		if(this.is_auto_save_mode_enabled()){
			this.go_auto_save_draft_mode();
		} else {
			wait_period = 2000;
		}
		setTimeout(function() {
			page.start_auto_save_draft_mode();
		}, wait_period);
	},
	go_auto_save_draft_mode: function(){
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
	    	case 'setup_advanced':
		    	this.go_auto_save_draft_mode_setup('save_draft');
	    		break;
		}
	},
	collect_ll_draft: function(){
		var ll_draft = {};
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
	    		ll_draft = this.collect_ll_draft_setup_native();
	    		break;
	    	case 'setup_advanced':
	    		ll_draft = this.collect_ll_draft_setup_advanced();
	    		break;
	    	case 'preview':
	    		return null;
	    		break;
	    	default:
	    		show_error_message('Invalid collect_ll_draft Action');
	    		return null;
	    		break;
		}
    	/**
    	 * Emad Atya - June 29th 2016
    	 * Issue reported by FIU that emails are getting messed on outlook,
    	 * by checking we found that the tinyMCE editor is adding a space between the <!--[if, so this code is to replace it. 
    	 */
    	while (ll_draft.htmlbody.indexOf ('<!-- [if') > -1){
        	ll_draft.htmlbody = ll_draft.htmlbody.replace ('<!-- [if', '<!--[if')
    	}
    	ll_draft.htmlCss = page.htmlCss;
    	return ll_draft;
	},
	compare_ll_drafts: function(d1, d2){
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
		    	return this.compare_ll_drafts_setup_native(d1, d2);
	    		break;
	    	case 'setup_advanced':
		    	return this.compare_ll_drafts_setup_advanced(d1, d2);
	    		break;
	    	case 'preview':
	    		//
	    		break;
	    	default:
	    		show_error_message('Invalid compare_ll_drafts Action');
	    		return true;
	    		break;
		}
	},
	collect_ll_draft_setup_native: function(){
		var _ll_draft = {};
		if(this.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS){
			_ll_draft.htmlbody = $.trim(page.editor_get_content('eb-editor-html'));
			_ll_draft.textbody = $.trim(tinymce.get('eb-editor-html').getBody().textContent);
		} else if(this.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS) {
			_ll_draft.htmlbody = pagePreview.editorEmail.getValue();
			$('#container_HTML_hidden').html(_ll_draft.htmlbody)
			_ll_draft.textbody = $('#container_HTML_hidden').text()
		}
		_ll_draft.textbody = this.clean_textbody(_ll_draft.textbody);
		return _ll_draft;
	},
	collect_ll_draft_setup_advanced: function(){
		var _ll_draft = {};
		//@todo collect draft
		var _full_html = $('#container_designer_html').html();
		var _clean_html = page.set_and_clean_html(_full_html);
		var _clean_text = $('#container_HTML_hidden').text()

		_ll_draft.htmlbody_designer = _full_html;
		_ll_draft.htmlbody = _clean_html;
		_ll_draft.textbody = _clean_text;

		_ll_draft.textbody = this.clean_textbody(_ll_draft.textbody);

		var additional_resources = '';
		$('head').find ('link[custom-font-resource=1]').each (function (){
			additional_resources += ('\n' + this.outerHTML);
		})
    	_ll_draft.additional_resources = additional_resources;
		
		return _ll_draft;
	},
	clean_textbody: function(_textbody){
		return $.trim(_textbody.replace(/	/g,'').replace(/\n\s*\n/g, '\n\n'))
	},
	
	font_families: [],
	
	set_and_clean_html: function(_full_html){
		$('#container_HTML_hidden').html(_full_html)
		
		var preheader = $('#container_HTML_hidden').find('#tpl-preheader').data('json')
		var header = $('#container_HTML_hidden').find('#tpl-header').data('json')
		var body = $('#container_HTML_hidden').find('#tpl-body').data('json')
		var footer = $('#container_HTML_hidden').find('#tpl-footer').data('json')
		
		if (preheader && typeof preheader.linkColor != 'undefined' && preheader.linkColor) {
			var colorLinkPreheader = preheader.linkColor;
			$('#container_HTML_hidden').find('#tpl-preheader .tpl-block-content a').each(function(){
				if (this.style.color == ''){
					this.style.color = colorLinkPreheader;
				}
			});
		}
		if (header && typeof header.linkColor != 'undefined' && header.linkColor) {
			var colorLinkHeader = header.linkColor;
			$('#container_HTML_hidden').find('#tpl-header .tpl-block-content a').each(function(){
				if (this.style.color == ''){
					this.style.color = colorLinkHeader;
				}
			});
		}
		if (body && typeof body.linkColor != 'undefined' && body.linkColor) {
			var colorLinkBody = body.linkColor;
			$('#container_HTML_hidden').find('#tpl-body .tpl-block-content a').each(function(){
				if (this.style.color == ''){
					this.style.color = colorLinkBody;
				}
			});
		}
		if (footer && typeof footer.linkColor != 'undefined' && footer.linkColor) {
			var colorLinkFooter = footer.linkColor;
			$('#container_HTML_hidden').find('#tpl-footer .tpl-block-content a').each(function(){
				if (this.style.color == ''){
					this.style.color = colorLinkFooter;
				}
			});
		}
		
		$('#container_HTML_hidden').find('.tpl-block-controls, .cont-drop-image, .et-btn-white, .eb-show-code-tpl-block').remove();
		
		/*
		 * Emad Atya - 25-1-2016
		 * Removing the eb-dragenddrop-box-text (with their parents if empty), so it gets cleaned from the code because for some cases it was adding some spacing.
		 */
		$('#container_HTML_hidden').find('.eb-dragenddrop-box-text').each(function(){
			var found_non_empty_container = false;
			
			container = this;
			do {
				var parent = $(container).parent()
				var parent_childs = parent.children()
				if(parent_childs.length > 1){
					$(container).remove();
					found_non_empty_container = true;
				} else {
					container = parent;
				}
			} while (!found_non_empty_container);
		});
		//Clean HTML comments...
		$('#container_HTML_hidden').find('*').contents().each(function() {
		    if(this.nodeType === Node.COMMENT_NODE) {
		    	if(this.textContent.indexOf('[if gte mso 9]') == -1 && this.textContent.indexOf('[if mso]') == -1 && this.textContent.indexOf('[endif]') == -1 ){
		    		$(this).remove();
		    	}
		    }
		});
		$('#container_HTML_hidden').find('[data-type=box-social-follow], [data-type=box-social-share]').each(function() {
		      $(this).removeAttr('data-type');
		});
		$('#container_HTML_hidden').find('img').each(function(){
			var src = $(this).attr('src');
			if(!src || (src.indexOf('http://') == -1 && src.indexOf('https://') == -1)){
				$(this).remove();
			} else {
				$(this).removeAttr('img-thump-src');
				$(this).removeAttr('img-src');
				
				if($(this).parents('a').length > 0) {
					$(this).parents('a').css ('text-decoration', 'none');
				}
			}
		})
		$('#container_HTML_hidden').find('[data-json]').each(function(){
			$(this).removeAttr('data-json');
		})
		$('#container_HTML_hidden').find('[data-font-references]').each(function(){
			$(this).removeAttr('data-font-references');
		})
		$('#container_HTML_hidden').find('[data-font-names]').each(function(){
			$(this).removeAttr('data-font-names');
		})
		$('#container_HTML_hidden').find('.tpl-selected').removeClass('tpl-selected')
		
		/*
		 * Emad Atya - 25-01-2015
		 * Cleaning the white spaces from the style attribute, because when sending the email we wrap the HTML every 75 character at the nearest white space
		 * and this was breaking the style attribute for properties like the background-color: rgb(5, 10, 15)
		 */
		$('#container_HTML_hidden').find('[style]').each(function(){
			var _clean_style = $(this).attr('style')
			_clean_style = _clean_style.replace(/: /g, ':');
			_clean_style = _clean_style.replace(/, /g, ',');
			_clean_style = _clean_style.replace(/; /g, ';');
			$(this).attr('style', _clean_style);
		})
		
		/**
		 * Emad Atya - Oct 9th 2017
		 * Cleaning the font-family style from any single/double quotes since it was breaking the style on some email clients.
		 * https://basecamp.com/1770551/projects/238725/messages/36192647#comment_566528876
		 */
		/*
		this.font_families = [];
		$('#container_HTML_hidden [style*="font-family"]').each (function (){
			var _font_family = $(this).css ('font-family')
			if (_font_family && (_font_family.indexOf ("'") != -1 || _font_family.indexOf ('"') != -1)) {
				if (_font_family.indexOf (_font_family) != -1) {
					page.font_families.push(_font_family);
				}
			}
		});
		*/
		$('#container_HTML_hidden grammarly-extension').remove();

		var _clean_html = $('#container_HTML_hidden').html();
		_clean_html = _clean_html.replace(/></g, '>\n<');
		/**
		 * Emad Atya - Aug 30th 2017
		 * Cleaning the \n from between the close of a tag with the close of span tag because was applying the span styling to the following white space.
		 * http://help.leadliaison.com/watch/cbjToTlRlV
		 * https://basecamp.com/1770551/projects/238725/messages/36192647#comment_555873550
		 */
		_clean_html = _clean_html.replace(/\/a>\n<\/span/g, '/a></span');
		/*
		if (page.font_families.length > 0) {
			for (var i in page.font_families) {
				var _font_family = page.font_families [i];
				_font_family2 = _font_family.replace(/["]/g, "&quot;")
				
				_font_family_clean = _font_family.replace(/["]/g, "'")
				
				var re1 = new RegExp(_font_family, 'g');
				_clean_html = _clean_html.replace(re1, _font_family_clean);
				
				var re2 = new RegExp(_font_family2, 'g');
				_clean_html = _clean_html.replace(re2, _font_family_clean);
			}
		}
		*/
		return _clean_html;
	},
	compare_ll_drafts_setup_native: function(_d1, _d2){
		return (
				_d1.htmlbody == _d2.htmlbody && 
				_d1.textbody == _d2.textbody
			);
	},
	compare_ll_drafts_setup_advanced: function(_d1, _d2){
		return (
				_d1.htmlbody == _d2.htmlbody && 
				_d1.htmlbody_designer == _d2.htmlbody_designer && 
				_d1.textbody == _d2.textbody
			);
	},
	go_auto_save_draft_mode_setup: function(_action, _redirect_href){
    	if(typeof _redirect_href == 'undefined' || !_redirect_href){
    		_redirect_href = '';
    	}
		var current_ll_draft = this.collect_ll_draft();
		if(current_ll_draft.htmlbody &&
				(_action == 'save' ||
						(page.ll_email_builder_step == 'setup_advanced' && page.is_first_save) ||
							!this.compare_ll_drafts(current_ll_draft, this.ll_draft_last)
					)
			){
			
			this.is_first_save = false;
			
			this.ll_draft_last = current_ll_draft;

			page.set_saving_button_visibility(true);
			
			var _data = {};
			_data['newsletterid'] = this.newsletterid;
			_data['templateid'] = this.templateid;
			_data['ll_draft'] = this.ll_draft_last;
			_data['lock_token'] = this.lock_token;
			_data['action'] = _action;
			
			$.ajax( {
				type :"POST",
				dataType :"json",
				async :true,
				url: "ll-email-builder-process.php",
				data: $.toJSON(_data),
				cache :false,
				success : function(data) {
					page.set_saving_button_visibility(false);
					if(data){
						if(data.success == 1){
							if(_action == 'save'){
								//window.location.reload();
								if (_redirect_href != ''){
									window.location = _redirect_href;
								} else if(page.newsletterid > 0){
									window.location = 'll-email-builder-test.php?newsletterid=' + page.newsletterid;
								} else if (page.templateid > 0){
									window.location = 'll-email-templates.php';
								}
							} else {
								page.email_object.is_auto_save_textbody = data.email_object.is_auto_save_textbody;
								if(page.email_object.is_auto_save_textbody == 1){
									page.email_object.textbody = page.ll_draft_last.textbody
								}
							}
						} else {
							if(typeof data.show_error_message != 'undefined' && data.show_error_message == 1){
								show_error_message(data.message);
							}
							//show_error_message(data.message);
						}
					} else {
						//show_error_message("Invalid response");
					}
				},
				error: function(){
					//show_error_message("Connection error");
					page.set_saving_button_visibility(false);
				}
			});
		} else if (_action == 'save' && !current_ll_draft.htmlbody){
			show_error_message("Please add email content");
		}
	},
	save_as_template: function(){
		var ll_email_template_name = $.trim($('input[name=ll_email_template_name]').val());
		if(ll_email_template_name != ''){
			var ll_draft = this.collect_ll_draft();

			var _data = {};
			_data['newsletterid'] = this.newsletterid;
			_data['ll_email_template_name'] = ll_email_template_name;
			_data['ll_draft'] = ll_draft;
			_data['action'] = 'save_as_template';

			ll_fade_manager.fade(true, 'save');
			$.ajax( {
				type :"POST",
				dataType :"json",
				async :true,
				url: "ll-email-builder-process.php",
				data: $.toJSON(_data),
				cache :false,
				success : function(data) {
					ll_fade_manager.fade(false);
					if(data){
						if(data.success == 1){
							show_success_message(data.message);
							ll_popup_manager.close('#ll_popup_save_as_template')
						} else {
							show_error_message(data.message);
						}
					} else {
						show_error_message("Unknown error");
					}
				},
				error: function(){
					ll_fade_manager.fade(false);
					show_error_message("Unknown error");
				}
			});
			
		} else {
			show_error_message('Please enter template name');
		}
	},
	send_email_preview: function(){
		var select_send_email_preview = ll_combo_manager.get_selected_value('#select_send_email_preview');
		if(select_send_email_preview && select_send_email_preview.length > 0){
			var send_email_preview = [];
			$.each(select_send_email_preview, function (index, _email) {
				if(IsValidEmail(_email)){
					send_email_preview [send_email_preview.length] = _email;
				}
            });
			if(send_email_preview.length > 0){
				var ll_draft = this.collect_ll_draft();
				
				var _data = {};
				_data['newsletterid'] = this.newsletterid;
				_data['templateid'] = this.templateid;
				_data['ll_draft'] = ll_draft;
				_data['selected_emails'] = send_email_preview;
				_data['is_preview_with_mail_merge'] = $('#ll_popup_send_email_preview input[type="checkbox"][name=is_preview_with_mail_merge]').is(':checked') ? 1 : 0;
				_data['action'] = 'send_preview';
	
				ll_fade_manager.fade(true, 'process');
				$.ajax( {
					type :"POST",
					dataType :"json",
					async :true,
					url: "ll-email-builder-process.php",
					data: $.toJSON(_data),
					cache :false,
					success : function(data) {
						ll_fade_manager.fade(false);
						if(data){
							if(data.success == 1){
								show_success_message(data.message);
								ll_popup_manager.close('#ll_popup_send_email_preview')
							} else {
								show_error_message(data.message);
							}
						} else {
							show_error_message("Unknown error");
						}
					},
					error: function(){
						ll_fade_manager.fade(false);
						show_error_message("Unknown error");
					}
				});
			} else {
				show_error_message('Please add a valid email address');
			}
		} else {
			show_error_message('Please enter email address');
		}
	},
	save_plain_text: function (){
		var ll_email_textbody = $('textarea[name=ll_email_textbody]').val();
		if(ll_email_textbody != ''){
			var _data = {};
			_data['newsletterid'] = this.newsletterid;
			_data['templateid'] = this.templateid;
			_data['templateid'] = this.templateid;
			_data['textbody'] = ll_email_textbody;
			_data['lock_token'] = this.lock_token;
			_data['action'] = 'save_textbody';

			ll_fade_manager.fade(true, 'save');
			$.ajax( {
				type :"POST",
				dataType :"json",
				async :true,
				url: "ll-email-builder-process.php",
				data: $.toJSON(_data),
				cache :false,
				success : function(data) {
					ll_fade_manager.fade(false);
					if(data){
						if(data.success == 1){
							page.email_object.textbody = ll_email_textbody;
							page.email_object.is_auto_save_textbody = 0;
							show_success_message(data.message);
							ll_popup_manager.close('#ll_popup_plain_text')
						} else {
							show_error_message(data.message);
						}
					} else {
						show_error_message("Unknown error");
					}
				},
				error: function(){
					ll_fade_manager.fade(false);
					show_error_message("Unknown error");
				}
			});
		} else {
			show_error_message('Please enter template plain-text content');
		}
	},
	set_saving_button_visibility: function(is_show){
		if(is_show){
			$('.btn-saving').show();
		} else {
			$('.btn-saving').hide();
		}
	},
	set_auto_save_mode_status: function(_status){
		this.auto_save_mode = _status;
	},
	is_auto_save_mode_enabled: function(){
		return this.auto_save_mode;
	},
	set_content: function(params){
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
		    	this.set_native_content(params);
	    		break;
	    	case 'setup_advanced':
		    	this.set_advanced_content(params);
	    		break;
	    	case 'preview':
	    		this.set_preview_content();
	    		break;
	    	default:
	    		show_error_message('Invalid set_content Action');
	    		break;
		}
	},
	set_preview_content: function(){
		_html = '';
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
	    		var _draft = page.collect_ll_draft();
	    		_html = _draft.htmlbody;
	    		page.go_set_preview_content(_html);
	    		break;
	    	case 'setup_advanced':
	    		var _draft = page.collect_ll_draft();
				var _data = {};
				_data['newsletterid'] = this.newsletterid;
				_data['templateid'] = this.templateid;
				_data['ll_draft'] = _draft;
				_data['action'] = 'prepare_preview';
	
				ll_fade_manager.fade(true, 'process');
				$.ajax( {
					type :"POST",
					dataType :"json",
					async :true,
					url: "ll-email-builder-process.php",
					data: $.toJSON(_data),
					cache :false,
					success : function(data) {
						ll_fade_manager.fade(false);
						if(data){
							if(data.success == 1){
					    		page.go_set_preview_content(data.htmlbody);
							} else {
								show_error_message(data.message);
							}
						} else {
							show_error_message("Unknown error");
						}
					},
					error: function(){
						ll_fade_manager.fade(false);
						show_error_message("Unknown error");
					}
				});
	    		break;
	    	case 'preview':
	    		_full_html = page.email_object.htmlbody;
	    		_html = page.set_and_clean_html(_full_html);
	    		page.go_set_preview_content(_html);
	    		break;
	    	default:
	    		show_error_message('Invalid set_preview_content Action');
	    		break;
		}
	},
	go_set_preview_content: function(_html){
		set_iframe_content('iframe_preview_preview_container', _html);
		set_iframe_content('mobile-preview-content', _html);

		$('#email-editor').hide();
		$('#email-editor-preview').show();
		
		$('.btn-exit-preview').show();
		$('#none-preview-controls').hide();
	},
	end_preview: function(){
    	switch(this.ll_email_builder_step){
	    	case 'setup_native':
	    	case 'setup_advanced':
	    		$('#email-editor').show();
	    		$('#email-editor-preview').hide();

	    		if(this.ll_email_builder_step == 'setup_native'){
		    		if(this.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS) {
		    			pagePreview.editorEmailBox.height();
		    		}
	    		}
	    		
	    		$('.btn-exit-preview').hide();
	    		$('#none-preview-controls').show();
	    		break;
	    	case 'preview':
				window.close()
				window.location = 'll-emails.php';
	    		break;
	    	default:
	    		show_error_message('Invalid end_preview Action');
	    		break;
		}
	},
    set_native_content: function(params){
    	if(params.is_preview){
    		set_iframe_content('iframe_preview_container', params.html);
    	}
		if(this.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS){
	    	if(params.is_html){
	        	_enfore_clear_undo = (typeof params.enfore_clear_undo == 'undefined') ? true : params.enfore_clear_undo;
	            page.editor_set_content('eb-editor-html', params.html, _enfore_clear_undo);
	    	}
			page.resizeTinymce();
		}
		if(this.ll_email_build_type_alias == LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS) {
	    	if(params.is_editor){
	            pagePreview.editorEmail.setValue(params.html);
	    	}
		}
    },
    set_advanced_content: function(params){
    	$('#container_designer_html').append(params.html)
    	$('#container_designer_html').find('.eb-show-code-tpl-block').remove();
		$('#container_designer_html').find('.tpl-selected').removeClass('tpl-selected')
    	//@todo set advanced content
    },
    process_wizard_buttons_visibility: function(){
    	$('.ll_wizard_btn_back').hide();
    	$('.ll_wizard_btn_next').hide();
    	switch(this.ll_email_builder_step){
	    	case 'initiate':
	        	$('.ll_wizard_btn_back').show();
	        	
	    		if($('.container_email_type.selected').length > 0){
	    	    	//$('.ll_wizard_btn_next').show();
	    		}
	    		break;
	    	case 'setup_native':
    	    	$('.ll_wizard_btn_next').show();
	    		break;
	    	case 'select_template':
				var href = 'll-email-builder-configure.php?ll_campaign_id=' + page.ll_campaign_id + '&is_template=' + page.is_template;
				if(typeof template_name != 'undefined' && template_name){
					href += '&template_name='+template_name;
				}
				if(typeof type != 'undefined' && type){
					href += '&type='+type;
				}
	        	$('.ll_wizard_btn_back').show().attr('href', href);
	        	//$('.ll_wizard_btn_next').show().addClass('btn-disabled');
	    		break;
	    	case 'setup_advanced':
    	    	$('.ll_wizard_btn_next').show();
	    		break;
	    	case 'preview':
	    		//
	    		break;
	    	default:
	    		//show_error_message('Invalid process_wizard_buttons_visibility Action');
	    		break;
		}
    },
    next: function(_redirect_href){
    	if(typeof _redirect_href == 'undefined' || !_redirect_href){
    		_redirect_href = '';
    	}
    	switch(this.ll_email_builder_step){
	    	case 'initiate':
	    		this.next_initiate();
	    		break;
	    	case 'setup_native':
	    	case 'setup_advanced':
	    		this.next_setup(_redirect_href);
	    		break;
	    	case 'select_template':
	    		this.next_select_template();
	    		break;
	    	case 'preview':
	    		//
	    		break;
	    	default:
	    		show_error_message('Invalid next Action');
	    		break;
    	}
    },
    next_initiate: function(){
    	if (!this.is_initiating_email) {
    		console.log ('initiating: ' + this.is_initiating_email);
			this.is_initiating_email = true;
			if ($('.container_email_type.selected').length > 0) {
				var ll_email_type_alias = $('.container_email_type.selected').attr('ll_email_type_alias');
				if (ll_email_type_alias == LL_EMAIL_TYPE_START_WITH_TEMPLATE_ALIAS) {
					var href = 'll-email-builder-select-template.php?ll_campaign_id=' + page.ll_campaign_id + '&is_template=' + page.is_template;
					if (typeof template_name != 'undefined' && template_name) {
						href += '&template_name=' + template_name;
					}
					if (typeof type != 'undefined' && type) {
						href += '&type=' + type;
					}
					window.location = href;
					return;
				} else if (ll_email_type_alias == LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS || ll_email_type_alias == LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS) {
					var ll_email_name = $.trim($('.editable_asset_name').text());
					if (ll_email_name != '') {
						var _data = {};
						_data['ll_email_name'] = ll_email_name;
						_data['ll_email_type_alias'] = ll_email_type_alias;
						_data['ll_campaign_id'] = page.ll_campaign_id;
						_data['is_template'] = page.is_template;
						_data['ll_email_description'] = $('#input_email_desc').val();
						_data['ll_email_subject'] = $('#input_email_subject').val();
						_data['ll_create_email_type'] = $('#input_create_email_type').val();
						_data['ll_email_is_active'] = $('#input_email_is_active').val();
						_data['ll_email_is_archive'] = $('#input_email_is_archive').val();
						_data['action'] = 'initiate';
					
						$.ajax({
							type: "POST",
							dataType: "json",
							async: true,
							url: "ll-email-builder-process.php",
							data: $.toJSON(_data),
							cache: false,
							success: function (data) {
								if (data) {
									if (data.success == 1) {
										window.location = 'll-email-builder-setup.php?newsletterid=' + data.newsletterid + '&templateid=' + data.templateid;
									} else {
										page.is_initiating_email = false;
										show_error_message(data.message);
									}
								} else {
									page.is_initiating_email = false;
									show_error_message("Invalid response");
								}
							},
							error: function () {
								page.is_initiating_email = false;
								show_error_message("Connection error");
								ll_fade_manager.fade(false);
							}
						});
						return;
					} else {
						show_error_message("Please Add Email Name");
						$('.editable_asset_name').focus();
					}
				} else {
					show_error_message('Invalid Email type');
				}
			} else {
				show_error_message('Please select Email type');
			}
			this.is_initiating_email = false;
		}
    },
    next_setup: function (_redirect_href){
    	if(typeof _redirect_href == 'undefined' || !_redirect_href){
    		_redirect_href = '';
    	}
    	this.go_auto_save_draft_mode_setup('save', _redirect_href);
    },
    next_select_template: function(){
    	if (!this.is_initiating_email) {
			this.is_initiating_email = true;
			var _selected_basic_template = $('.start-with-templates.selected');
			if (_selected_basic_template.length > 0) {
				var ll_email_basic_theme_alias = $(_selected_basic_template).attr('ll_email_basic_theme_alias')
				var templateid = $(_selected_basic_template).attr('templateid')
				var newsletterid = $(_selected_basic_template).attr('newsletterid')
				var ll_email_type_alias = LL_EMAIL_TYPE_START_WITH_TEMPLATE_ALIAS;
			
				var ll_email_name = $.trim($('.editable_asset_name').text());
				if (ll_email_name != '') {
					var _data = {};
					_data['ll_email_name'] = ll_email_name;
					_data['ll_email_type_alias'] = ll_email_type_alias;
					_data['ll_campaign_id'] = page.ll_campaign_id;
					_data['is_template'] = page.is_template;
					_data['ll_email_description'] = $('#input_email_desc').val();
					_data['ll_email_subject'] = $('#input_email_subject').val();
					_data['ll_create_email_type'] = $('#input_create_email_type').val();
					_data['ll_email_is_active'] = $('#input_email_is_active').val();
					_data['ll_email_is_archive'] = $('#input_email_is_archive').val();
					_data['ll_email_basic_theme_alias'] = ll_email_basic_theme_alias;
					_data['templateid'] = templateid;
					_data['newsletterid'] = newsletterid;
					_data['action'] = 'initiate';
				
					$.ajax({
						type: "POST",
						dataType: "json",
						async: true,
						url: "ll-email-builder-process.php",
						data: $.toJSON(_data),
						cache: false,
						success: function (data) {
							if (data) {
								if (data.success == 1) {
									window.location = 'll-email-builder-advanced-setup.php?newsletterid=' + data.newsletterid + '&templateid=' + data.templateid;
								} else {
									page.is_initiating_email = false;
									show_error_message(data.message);
								}
							} else {
								page.is_initiating_email = false;
								show_error_message("Invalid response");
							}
						},
						error: function () {
							page.is_initiating_email = false;
							show_error_message("Connection error");
							ll_fade_manager.fade(false);
						}
					});
					return;
				} else {
					show_error_message("Please Add Email Name");
					$('.editable_asset_name').focus();
				}
			} else {
				show_error_message('Please select Template');
			}
			this.is_initiating_email = false;
		}
    },
    colorBox: function(){
        $('.color-box').each(function(){
            var color =  $(this).attr('data-color-start');
            $(this).colpick({
                colorScheme:'dark',
                layout:'hex',
                color: color,
                onSubmit:function(hsb,hex,rgb,el) {
                    $(el).css('background-color', '#'+hex);
                    $(el).colpickHide();
                    page.updateColorElTpl(el,hex);
                    
                }
            }).css('background-color', '#'+color);
        });
    },
    InsertLink: function(placeholder, contentarea, editorname) {
		var placeholder_splitted = placeholder.split ('.');
		if (placeholder_splitted [0] == 'registration_system') {
			if (typeof placeholder_splitted [2] != 'undefined' && placeholder_splitted [2] != '') {
				var event_token = placeholder_splitted [1]
				switch (placeholder_splitted [2]) {
					case 'name':
					case 'description':
					case 'start_date':
					case 'end_date':
					case 'badge':
					case 'checkin_url':
					case 'status':
						placeholder = '%%' + placeholder + '%%';
						break;
					case 'checkin_qr':
						placeholder = '<img src="' + page.QR_Generate_CheckIn_URL + '%%' + placeholder + '%%&etoken='+ event_token +'" />';
						break;
					case 'badge_qr':
						placeholder = '<img src="' + page.QR_Generate_Badge_URL + '%%' + placeholder + '%%&etoken='+ event_token +'" />';
						break;
					default:
						placeholder = '%%' + placeholder + '%%';
						break;
				}
			} else {
				placeholder = '%%' + placeholder + '%%';
			}
		} else if(!placeholder_splitted [0].includes('documents_set') && !placeholder_splitted [0].includes('documents_set_last_submission')){
			placeholder = '%%' + placeholder + '%%';
		}
		
    	// set the default for the editor name.
    	/*
    	if (!editorname || editorname == undefined)
    	{
    		editorname = 'myDevEditControl';
    	}
    	*/
    	//placeholder = '%%' + placeholder + '%%';
    	/*
    	if (contentarea == 'TextContent' || !UsingWYSIWYG) {
    		if (contentarea == 'html') {
    			contentarea = editorname + '_html';
    		}


    		id = document.getElementById(contentarea);
    		insertAtCursor(id, placeholder);

    		return;
    	}
    	*/
    	if (placeholder == '%%unsubscribelink%%') {
    		placeholder = "<a href='http://%%unsubscribelink%%/'>" + page.UnsubLinkPlaceholder + "</a>";
    	}

    	modcheck_regex = new RegExp("%%modifydetails_(.*?)%%", "i");
    	modcheck = modcheck_regex.exec(placeholder);
    	if (modcheck) {
    		placeholder = "<a href='http://%%modifydetails_" + modcheck[1] + "%%/'>" + placeholder + "</a>";
    	}

    	modcheck_regex = new RegExp("%%sendfriend_(.*?)%%", "i");
    	modcheck = modcheck_regex.exec(placeholder);
    	if (modcheck) {
    		placeholder = "<a href='http://%%sendfriend_" + modcheck[1] + "%%/'>" + placeholder + "</a>";
    	}

		//tinyMCE.activeEditor.execCommand('mceInsertContent', false, placeholder);
    	page.active_html_editor.execCommand('mceInsertContent', false, placeholder);
		/*
    	page.active_html_editor
    	Application.WYSIWYGEditor.insertText(placeholder);
    	*/
    },
    codeBox:{
        editor: null,
        init: function(){
            CodeMirror.commands.autocomplete = function(cm) {
                cm.showHint({hint: CodeMirror.hint.anyword});
            }

            page.codeBox.editor = CodeMirror.fromTextArea(document.getElementById("eb-code-editor"), {
    			lineNumbers: true,
    			mode: "text/html",
    			matchBrackets: true,
    			extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
    			foldGutter: true,
    			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    			extraKeys: {
    				"F11": function(cm) {
    					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    				},
    				"Esc": function(cm) {
    					if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    				},
    				"Ctrl-Space": "autocomplete"
    			},
    			lineWrapping: true
    		});
            /*
            page.codeBox.editor = CodeMirror.fromTextArea(document.getElementById("eb-code-editor"), {
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {"Ctrl-Space": "autocomplete"}
            });
            */
            $('#eb-box-code').hide();
        }
    },
    heightWrapLayout: function(){
        //$('.wrap-layout-inner').height($('body').height()-110);
    },
    dragAndDropElements: function(){
		var $scrollBox = $('.eb-inner-tool > .tabs-editor .wrap-tabs-content');
		var scrollTop = 0;
        $( ".eb-block-content" ).draggable({
            helper: 'clone',
            start: function(event, ui) {
        		page.set_auto_save_mode_status(false);
                $('.tpl-container').addClass('tpl-placeholder');
				scrollTop = $scrollBox.scrollTop();
				$scrollBox.css('overflow', 'visible');
	
				if( scrollTop > 0 ){
					$scrollBox.css('marginTop', -scrollTop);
					$(ui.helper).css('margin-top', scrollTop);
				}
            },
            stop: function(event, ui) {
                $('.tpl-container').removeClass('tpl-placeholder');
                $('.eb-sortable-hover').removeClass('eb-sortable-hover');
				$scrollBox.css({
					"overflow-y": "auto",
					marginTop: 0
				});
				page.set_auto_save_mode_status(true);
			},
            connectToSortable: ".tpl-container",
            refreshPositions: true
        });
		$('.tpl-container').each(function(){
			page.sortableElements($(this));
		});
	},
	sortableElements: function($tpl){
		$tpl.sortable({
            cursor: 'move',
            handle: '',
            tolerance: 'pointer',
            cancel: '.eb-dragenddrop-box, .eb-show-code-tpl-block, .eb-dragenddrop-box-text',
            connectWith: '.tpl-container',
            placeholder:'db-placeholder-element',
            beforeStop: function(event, ui) {
                page.addElementTpl(ui);
            },
            start:  function(event, ui) {
        		page.set_auto_save_mode_status(false);
                ui.item.parent().addClass('eb-sortable-hover');
            },
            over:  function(event, ui) {
                $('.eb-sortable-hover').removeClass('eb-sortable-hover');
                $(this).addClass('eb-sortable-hover');
            },
            stop:  function(event, ui) {
                ui.item.parent().removeClass('eb-sortable-hover');
                page.isElements();
        		page.set_auto_save_mode_status(true);
            },
            receive: function(event, ui) {
                if ( ui.item.attr('data-type') == 'box-image-group' ){
                    page.updateWidthGroupColumn(ui.item);
                }
                if ( ui.item.hasClass('eb-block-image-group') ){
                    page.updateWidthGroupColumn($('.tpl-block.tpl-selected'));
                }
                
                if ( ui.item.attr('data-type') == 'box-text' || ui.item.attr('data-type') == 'box-border-text' || ui.item.attr('data-type') == 'box-footer'){
                    page.updateColumnTextTpl(ui.item);
                }
                if ( ui.item.hasClass('eb-block-text') || ui.item.hasClass('eb-block-boxed-text') || ui.item.hasClass('eb-block-footer') ){
                    page.updateColumnTextTpl($('.tpl-block.tpl-selected'));
                }
                
                if ( ui.item.attr('data-type') == 'box-image-card' || ui.item.attr('data-type') == 'box-image-caption' || ui.item.attr('data-type') == 'box-video'){
                    page.captionWidthImg(ui.item);
                }
                if ( ui.item.hasClass('eb-block-image-card') || ui.item.hasClass('eb-block-image-caption') || ui.item.hasClass('eb-block-video') ){
                    page.captionWidthImg($('.tpl-block.tpl-selected'));
                }
                
                if ( ui.item.attr('data-type') == 'box-image' ){
                    page.updateWidthImgs(ui.item);
                }
                
                if ( ui.item.hasClass('eb-show-slide-panel') ){
                    $('.tpl-block.tpl-selected').removeClass('tpl-selected');
                }
            }
        }).disableSelection();
    },
    isElements: function(){
        $('.tpl-container').each(function(){
            var countEl = $(this).find('.tpl-block').length;
            var $el = $(this).find('.eb-dragenddrop-box-text');

            if (countEl > 0){
                $el.hide();
                $(this).removeClass('eb-noactive-container');
            } else {
                $el.show();
                $(this).addClass('eb-noactive-container');
            }
        });
        
    },
    addElementTpl: function(ui){
		console.log(ui.item)
        if (ui.item.hasClass('eb-block-content')){

            var $item = ui.item;
            var elementDrag = null;
            var type = '';
            var content = '';
            var dataAll = '';
            if ( $item.hasClass('eb-block-text') || $item.hasClass('eb-block-boxed-text') || $item.hasClass('eb-block-footer') ){
                var isBoxes = false;
                var padding = 'padding-left:18px; padding-right: 18px; padding-top: 9px; padding-bottom: 9px;';
                if ( $item.hasClass('eb-block-boxed-text') ){
                    type = 'box-border-text';
                    isBoxes = true;
                    padding = 'padding-left:18px; padding-right: 18px; padding-top: 18px; padding-bottom: 18px;';
                } else if( $item.hasClass('eb-block-footer') ){
                    type = 'box-footer';
                    isBoxes = true;
                    padding = 'padding-left:18px; padding-right: 18px; padding-top: 18px; padding-bottom: 18px;';
                } else {
                    type = 'box-text';
                }
                if( $item.hasClass('eb-block-footer') ){
                    dataAll = '{"fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "boxesIs": '+isBoxes+', "boxesBackgroundColor": "#f2f2f2", "boxesBorderType": "Solid", "boxesBorderWidth": 1, "boxesBorderColor": "#c9c9c9", "color": "#333333", "lineHeight": "None", "textAlign": "None", "columnSplit": 0, "columnSplitType": 0}';
                    elementDrag = '<table style="min-width: 100%;" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebTextBlock ebTextBlockFooter">'+
                                    '<tbody class="ebTextBlockOuter">'+
                                        '<tr>'+
                                        	'<td valign="top" class="ebTextBlockInner">'+
                                            	'<table style="min-width: 100%; background-color: rgb(242, 242, 242);" align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebTextContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                        	"<td valign='top' class='ebTextContent' style='border-style: solid; border-width: 1px; border-color: rgb(201, 201, 201);"+padding+"'>"+
                                                                'Copyright %%currentyear%% %%companyname%%, All rights reserved.<br><br>Our mailling address is <span style="color: #1f69ad;"><a href="#">%%companyaddress%%</a></span>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
                } else {
	                dataAll = '{"fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "boxesIs": '+isBoxes+', "boxesBackgroundColor": "#ffffff", "boxesBorderType": "None", "boxesBorderWidth": 0, "boxesBorderColor": "#999999", "color": "#333333", "lineHeight": "None", "textAlign": "None", "columnSplit": 0, "columnSplitType": 0}';
	
	                elementDrag = '<table style="min-width: 100%;" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebTextBlock">'+
	                                    '<tbody class="ebTextBlockOuter">'+
	                                        '<tr>'+
	                                            '<td valign="top" class="ebTextBlockInner">'+
	                                                '<table style="min-width: 100%;" align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebTextContentContainer">'+
	                                                    '<tbody>'+
	                                                        '<tr>'+
	                                                            "<td valign='top' class='ebTextContent' style='border: 0;"+padding+"'>"+
	                                                                'This is a Text Block. Use this to provide text...'+
	                                                            '</td>'+
	                                                        '</tr>'+
	                                                    '</tbody>'+
	                                                '</table>'+
	                                            '</td>'+
	                                        '</tr>'+
	                                    '</tbody>'+
	                                '</table>';
                }
            } else if ( $item.hasClass('eb-block-divider') ){
                type = 'box-divider';
                dataAll = '{"backgroundColor": "#ffffff", "borderType": "Solid", "borderWidth": 1, "borderColor":"#999999", "paddingTop":"18", "paddingBottom":"18"}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebDividerBlock" style="background-color: #ffffff;">'+
                                    '<tbody>'+
                                        '<tr>'+
                                            '<td valign="top" class="ebDividerBlockInner" style="padding: 18px 0;">'+
                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebDividerContent" style="border-top-width: 1px; border-top-style: solid; border-top-color: #999999;">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else if( $item.hasClass('eb-block-image') ){
                type = 'box-image';
                dataAll = '{"align":0, "margins":0}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageBlock">'+
                                    '<tbody class="ebImageBlockOuter">'+
                                        '<tr>'+
                                           '<td valign="top" class="ebImageBlockInner" style="padding: 9px;">'+
                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" align="left" class="ebImageContent" style="padding: 0 9px;">'+
                                                                '<div class="eb-upload-image">'+
                                                                    '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                                    //'<p class="cont-drop-image">Drop an Image here</p>'+
                                                                    //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                                '</div>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else if($item.hasClass('eb-block-image-group')){
                type = 'box-image-group';
                dataAll = '{"count": 2, "layout": 0, "layoutIndex": 0}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageBlock">'+
                                    '<tbody class="ebImageBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" class="ebImageBlockInner" style="padding: 9px;">'+
                                                '<table align="left" dataSortId="0" style="width: 282px;" border="0" cellpadding="0" cellspacing="0" width="282px" class="ebImageContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" class="ebImageContent" style="padding: 0 0 0 9px;">'+
                                                                '<div class="eb-upload-image">'+
                                                                    '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                                    //'<p class="cont-drop-image">Drop an Image here</p>'+
                                                                    //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                                '</div>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                                '<table align="right" dataSortId="1" style="width: 282px;" border="0" cellpadding="0" cellspacing="0" width="282px" class="ebImageContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" class="ebImageContent" style="padding: 0 9px 0 0;">'+
                                                                '<div class="eb-upload-image">'+
                                                                    '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                                    //'<p class="cont-drop-image">Drop an Image here</p>'+
                                                                    //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                                '</div>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else if( $item.hasClass('eb-block-image-card') ){
                type = 'box-image-card';
                dataAll = '{"backgroundColor": "#ffffff", "borderType": "None", "borderWidth": "0", "borderColor":"#999999", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign": "None", "position": "3", "imgAlignment": "0", "margins": "0", "captionWidth":"0"}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageBlock">'+
                                    '<tbody class="ebImageBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" class="ebImageCardBlockInner" style="padding: 9px 18px 0;">'+
                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" class="ebImageContent" style="">'+
                                                                '<div class="eb-upload-image">'+
                                                                    '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                                    //'<p class="cont-drop-image">Drop an Image here</p>'+
                                                                    //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                                '</div>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td valign="top" class="ebTextContent" style="padding: 9px 18px;">'+
                                                'Your text caption goes here'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else if( $item.hasClass('eb-block-image-caption') ){
                type = 'box-image-caption';
                dataAll = '{"fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign": "None", "position": "3", "imgAlignment": "0", "number": "0", "captionWidth":"0"}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageBlock">'+
                                    '<tbody class="ebImageBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" class="ebImageCardBlockInner" style="padding: 9px 18px 0;">'+
                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" class="ebImageContent" style="">'+
                                                                '<div class="eb-upload-image">'+
                                                                    '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                                    //'<p class="cont-drop-image">Drop an Image here</p>'+
                                                                    //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                                '</div>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td valign="top" class="ebTextContent" style="padding: 9px 18px;">'+
                                                ' Your text caption goes here. You can change the position of the caption and set styles in the block\'s settings tab.'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else if( $item.hasClass('eb-block-social-share') || $item.hasClass('eb-block-social-follow') || $item.hasClass('eb-block-calendar') ){
            	var contentToShare = 1;
            	var _additional_social_link_part = '';
                if ( $item.hasClass('eb-block-social-share') ){
                	_additional_social_link_part = '%%webversion_url_encoded%%';
                	type = 'box-social-share';
                    var masSocialText = ['Share','Tweet','+1','Share'];
                    var masSocialLink = ['http://www.facebook.com/sharer/sharer.php?u=','http://twitter.com/intent/tweet?text=','https://plus.google.com/share?url=','http://www.linkedin.com/shareArticle?url='];
					dataAll = '{"containerBackground":"#ffffff", "containerPadding":"0", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#fafafa", "btnBorderType":"Solid", "btnBorderWidth":"1", "btnBorderColor":"#cccccc", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"None", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "layout": "1", "contentToShare":"'+contentToShare+'", "shareCustomUrl":"0", "shareLink":"", "shareDesc":""}';
					elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebShareBlock">'+
	                                    '<tbody class="ebShareBlockOuter">'+
	                                        '<tr>'+
	                                            '<td valign="top" class="ebShareBlockInner" style="padding: 0px;">'+
	                                                '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebShareContent">'+
	                                                    '<tbody>'+
	                                                        '<tr>'+
	                                                            '<td valign="top" align="left" class="ebShareContentInner"  style="padding: 0 9px;">'+
	                                                                '<table width="auto" border="0" cellpadding="0" cellspacing="0">'+
	                                                                    '<tbody>'+
	                                                                        '<tr>'+
	                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-top: 9px; padding-right: 9px; padding-left: 9px">'+
	                                                                            
		                                                                            '<!--[if mso]>'+
		                                                                            '<table align="center" border="0" cellspacing="0" cellpadding="0">'+
		                                                                            	'<tr>'+
	                                                                                    '<![endif]-->'+
	
	                                                                                    '<!--[if mso]>'+
		                                                                            		'<td align="center" valign="top">'+
		                                                                            '<![endif]-->'+
		                                                                                
		                                                                            '<table data-type-social="0" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                    '<tbody>'+
	                                                                                        '<tr>'+
	                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
	                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: rgb(250, 250, 250); border: 1px solid #cccccc; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                                    '<tbody>'+
	                                                                                                        '<tr>'+
	                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
	                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
	                                                                                                                    '<tbody>'+
	                                                                                                                        '<tr>'+
	                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
	                                                                                                                            '<a href="'+masSocialLink[0]+_additional_social_link_part+'" target="_blank"><img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/fb.png" style="display:block;" class="" height="28" width="28"></a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '<td class="mcnShareTextContent" style="padding-left:5px;" align="left" valign="middle">'+
	                                                                                                                            '<a href="'+masSocialLink[0]+_additional_social_link_part+'" style="color: rgb(80, 80, 80); font-size: 12px; font-weight: normal; line-height: 100%; text-align: center; text-decoration: none;" target="">'+masSocialText[0]+'</a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '</tr>'+
	                                                                                                                    '</tbody>'+
	                                                                                                                '</table>'+
	                                                                                                           '</td>'+
	                                                                                                        '</tr>'+
	                                                                                                    '<tbody>'+
	                                                                                                '</table>'+
	                                                                                            '</td>'+
	                                                                                        '</tr>'+
	                                                                                    '</tbody>'+
	                                                                                '</table>'+
	
		                                                                            '<!--[if mso]>'+
				                                                                            '</td>'+
	                                                                                '<![endif]-->'+
	
	                                                                                '<!--[if mso]>'+
				                                                                            '<td align="center" valign="top">'+
		                                                                            '<![endif]-->'+
	                                                                                
	                                                                                
	                                                                                '<table data-type-social="1" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                    '<tbody>'+
	                                                                                        '<tr>'+
	                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
	                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: rgb(250, 250, 250); border: 1px solid #cccccc; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                                    '<tbody>'+
	                                                                                                        '<tr>'+
	                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
	                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
	                                                                                                                    '<tbody>'+
	                                                                                                                        '<tr>'+
	                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
	                                                                                                                            '<a href="'+masSocialLink[1]+_additional_social_link_part+'" target="_blank"><img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/tw.png" style="display:block;" class="" height="28" width="28"></a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '<td class="mcnShareTextContent" style="padding-left:5px;" align="left" valign="middle">'+
	                                                                                                                            '<a href="'+masSocialLink[1]+_additional_social_link_part+'" style="color: rgb(80, 80, 80); font-size: 12px; font-weight: normal; line-height: 100%; text-align: center; text-decoration: none;" target="">'+masSocialText[1]+'</a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '</tr>'+
	                                                                                                                    '</tbody>'+
	                                                                                                                '</table>'+
	                                                                                                            '</td>'+
	                                                                                                        '</tr>'+
	                                                                                                    '<tbody>'+
	                                                                                                '</table>'+
	                                                                                            '</td>'+
	                                                                                        '</tr>'+
	                                                                                    '</tbody>'+
	                                                                                '</table>'+
	
		                                                                            '<!--[if mso]>'+
				                                                                            '</td>'+
	                                                                                '<![endif]-->'+
	
	                                                                                '<!--[if mso]>'+
				                                                                            '<td align="center" valign="top">'+
		                                                                            '<![endif]-->'+
	                                                                                
	                                                                               '<table data-type-social="3" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                    '<tbody>'+
	                                                                                        '<tr>'+
	                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
	                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: rgb(250, 250, 250); border: 1px solid #cccccc; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                                    '<tbody>'+
	                                                                                                        '<tr>'+
	                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
	                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
	                                                                                                                    '<tbody>'+
	                                                                                                                        '<tr>'+
	                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
	                                                                                                                            '<a href="'+masSocialLink[3]+_additional_social_link_part+'" target="_blank"><img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/in.png" style="display:block;" class="" height="28" width="28"></a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '<td class="mcnShareTextContent" style="padding-left:5px;" align="left" valign="middle">'+
	                                                                                                                            '<a href="'+masSocialLink[3]+_additional_social_link_part+'" style="color: rgb(80, 80, 80); font-size: 12px; font-weight: normal; line-height: 100%; text-align: center; text-decoration: none;" target="">'+masSocialText[3]+'</a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '</tr>'+
	                                                                                                                    '</tbody>'+
	                                                                                                                '</table>'+
	                                                                                                            '</td>'+
	                                                                                                        '</tr>'+
	                                                                                                    '<tbody>'+
	                                                                                                '</table>'+
	                                                                                            '</td>'+
	                                                                                        '</tr>'+
	                                                                                    '</tbody>'+
	                                                                                '</table>'+
		
		                                                                            '<!--[if mso]>'+
		                                                                            		'</td>'+
	                                                                                '<![endif]-->'+
	
	                                                                                '<!--[if mso]>'+
		                                                                            		'<td align="center" valign="top">'+
		                                                                            '<![endif]-->'+
		                                                                                
	                                                                                '<table data-type-social="2" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                    '<tbody>'+
	                                                                                        '<tr>'+
	                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 0">'+
	                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: rgb(250, 250, 250); border: 1px solid #cccccc; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
	                                                                                                    '<tbody>'+
	                                                                                                        '<tr>'+
	                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
	                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
	                                                                                                                    '<tbody>'+
	                                                                                                                        '<tr>'+
	                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
	                                                                                                                            '<a href="'+masSocialLink[2]+_additional_social_link_part+'" target="_blank"><img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/gg.png" style="display:block;" class="" height="28" width="28"></a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '<td class="mcnShareTextContent" style="padding-left:5px;" align="left" valign="middle">'+
	                                                                                                                            '<a href="'+masSocialLink[2]+_additional_social_link_part+'" style="color: rgb(80, 80, 80); font-size: 12px; font-weight: normal; line-height: 100%; text-align: center; text-decoration: none;" target="">'+masSocialText[2]+'</a>'+
	                                                                                                                        '</td>'+
	                                                                                                                        '</tr>'+
	                                                                                                                    '</tbody>'+
	                                                                                                                '</table>'+
	                                                                                                            '</td>'+
	                                                                                                        '</tr>'+
	                                                                                                    '<tbody>'+
	                                                                                                '</table>'+
	                                                                                            '</td>'+
	                                                                                        '</tr>'+
	                                                                                    '</tbody>'+
	                                                                                '</table>'+
	                                                                            	
	                                                                                
		                                                                            '<!--[if mso]>'+
		                                                                                	'</td>'+
	                                                                                    '<![endif]-->'+
	
	                                                                                '<!--[if mso]>'+
		                                                                                '</tr>'+
		                                                                            '</table>'+
		                                                                            '<![endif]-->'+
	                                                                                
	                                                                                
	                                                                            '</td>'+
	                                                                        '</tr>'+
	                                                                    '</tbody>'+
	                                                                '</table>'+
	                                                            '</td>'+
	                                                        '</tr>'+
	                                                    '</tbody>'+
	                                                '</table>'+
	                                            '</td>'+
	                                        '</tr>'+
	                                    '</tbody>'+
	                                '</table>';
                } else if ($item.hasClass('eb-block-social-follow')) {
                    type = 'box-social-follow';
                    contentToShare = 0;
                    var masSocialText = ['Facebook','Twitter','Google Plus','LinkedIn'];
                    var masSocialLink = ['http://www.facebook.com/','http://www.twitter.com/','http://plus.google.com/','http://www.linkedin.com/'];
					dataAll = '{"containerBackground":"#ffffff", "containerPadding":"0", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#ffffff", "btnBorderType":"None", "btnBorderWidth":"0", "btnBorderColor":"#ffffff", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"None", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "display":"0", "layout": "2", "contentToShare":"'+contentToShare+'", "shareCustomUrl":"0", "shareLink":"", "shareDesc":""}';
					elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebShareBlock">'+
                                    '<tbody class="ebShareBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" class="ebShareBlockInner" style="padding: 0px;">'+
                                                '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebShareContent">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" align="left" class="ebShareContentInner"  style="padding: 0 9px;">'+
                                                                '<table width="auto"  border="0" cellpadding="0" cellspacing="0">'+
                                                                    '<tbody>'+
                                                                        '<tr>'+
                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-top: 9px; padding-right: 9px; padding-left: 9px">'+
                                                                                    
                                                                                    '<!--[if mso]>'+
                                                                                    '<table align="center" border="0" cellspacing="0" cellpadding="0">'+
                                                                                    '<tr>'+
                                                                                    '<![endif]-->'+

                                                                                    '<!--[if mso]>'+
                                                                                    '<td align="center" valign="top">'+
                                                                                    '<![endif]-->'+
                                                                                        
                                                                                    '<table data-type-social="0" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[0]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/fb.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                           '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                
                                                                                '<!--[if mso]>'+
                                                                                '</td>'+
                                                                                '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '<td align="center" valign="top">'+
                                                                                '<![endif]-->'+
                                                                                
                                                                                
                                                                                '<table data-type-social="1" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[1]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/tw.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                            '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                
                                                                                '<!--[if mso]>'+
                                                                                '</td>'+
                                                                                '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '<td align="center" valign="top">'+
                                                                                '<![endif]-->'+
                                                                                
                                                                               '<table data-type-social="3" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[3]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/in.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                            '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                
                                                                                '<!--[if mso]>'+
                                                                                '</td>'+
                                                                                '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '<td align="center" valign="top">'+
                                                                                '<![endif]-->'+
                                                                                
                                                                                '<table data-type-social="2" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 0">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[2]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/gg.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                            '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                
                                                                                
                                                                                '<!--[if mso]>'+
                                                                                    '</td>'+
                                                                                    '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '</tr>'+
                                                                                '</table>'+
                                                                                '<![endif]-->'+
                                                                                
                                                                                
                                                                            '</td>'+
                                                                        '</tr>'+
                                                                    '</tbody>'+
                                                                '</table>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else {
					type = 'box-calendar';
                    contentToShare = 0;
                    var masSocialText = ['Google','Outlook','Yahoo!'];
                    var masSocialLink = ['#','#','#'];
					dataAll = '{"containerBackground":"#ffffff", "containerPadding":"0", "containerBorderType":"None", "containerBorderWidth":"0", "containerBorderColor":"#ffffff", "btnBackground":"#ffffff", "btnBorderType":"None", "btnBorderWidth":"0", "btnBorderColor":"#ffffff", "btnBorderRadius":"5", "fontTypeFace": "Arial", "fontWeight":"None", "fontSize":"12", "color":"#505050", "lineHeight":"None","align": "0", "width":"1","styleIcon":"0", "display":"0", "layout": "2", "contentToShare":"'+contentToShare+'", "shareCustomUrl":"0", "shareLink":"", "shareDesc":""}';
					elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebShareBlock">'+
                                    '<tbody class="ebShareBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" class="ebShareBlockInner" style="padding: 0px;">'+
                                                '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebShareContent">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" align="left" class="ebShareContentInner"  style="padding: 0 9px;">'+
                                                                '<table width="auto"  border="0" cellpadding="0" cellspacing="0">'+
                                                                    '<tbody>'+
                                                                        '<tr>'+
                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-top: 9px; padding-right: 9px; padding-left: 9px">'+
                                                                                    
                                                                                    '<!--[if mso]>'+
                                                                                    '<table align="center" border="0" cellspacing="0" cellpadding="0">'+
                                                                                    '<tr>'+
                                                                                    '<![endif]-->'+

                                                                                    '<!--[if mso]>'+
                                                                                    '<td align="center" valign="top">'+
                                                                                    '<![endif]-->'+
                                                                                        
                                                                                    '<table data-type-social="12" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[0]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/google.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                           '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                
                                                                                '<!--[if mso]>'+
                                                                                '</td>'+
                                                                                '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '<td align="center" valign="top">'+
                                                                                '<![endif]-->'+
                                                                                
                                                                                
                                                                                '<table data-type-social="13" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[1]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/outlook.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                            '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                
                                                                                '<!--[if mso]>'+
                                                                                '</td>'+
                                                                                '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '<td align="center" valign="top">'+
                                                                                '<![endif]-->'+
                                                                                
                                                                               '<table data-type-social="16" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                    '<tbody>'+
                                                                                        '<tr>'+
                                                                                            '<td valign="top" class="ebShareContentItemContainer" style="padding-bottom: 9px; padding-right: 9px">'+
                                                                                                '<table class="ebShareContentItem" style="border-collapse: separate; background-color: #ffffff; border: 0; border-radius: 5px;" align="left" border="0" cellpadding="0" cellspacing="0">'+
                                                                                                    '<tbody>'+
                                                                                                        '<tr>'+
                                                                                                            '<td style="padding-top:5px; padding-right:9px; padding-bottom:5px; padding-left:9px;" align="left" valign="middle">'+
                                                                                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="">'+
                                                                                                                    '<tbody>'+
                                                                                                                        '<tr>'+
                                                                                                                        '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+
                                                                                                                            '<a href="'+masSocialLink[2]+'" target="_blank"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/yahoo.png" style="display:block;" class="" height="28" width="28"></a>'+
                                                                                                                        '</td>'+
                                                                                                                        '</tr>'+
                                                                                                                    '</tbody>'+
                                                                                                                '</table>'+
                                                                                                            '</td>'+
                                                                                                        '</tr>'+
                                                                                                    '<tbody>'+
                                                                                                '</table>'+
                                                                                            '</td>'+
                                                                                        '</tr>'+
                                                                                    '</tbody>'+
                                                                                '</table>'+
                                                                                '<!--[if mso]>'+
                                                                                '</td>'+
                                                                                '<![endif]-->'+

                                                                                '<!--[if mso]>'+
                                                                                '</tr>'+
                                                                                '</table>'+
                                                                                '<![endif]-->'+
                                                                            '</td>'+
                                                                        '</tr>'+
                                                                    '</tbody>'+
                                                                '</table>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
				}
            } else if ($item.hasClass('eb-block-column-2')){
				type="column-2";
				dataAll = '{"backgroundColor": "#ffffff", "borderTopType": "None", "borderTopWidth": "0", "borderTopColor": "#ffffff", "borderBottomType": "None", "borderBottomWidth": "0", "borderBottomColor": "#ffffff"}';
				elementDrag = '<div class="template-column-2 clearfix"> <!--[if gte mso 9]> <table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;"> <tr> <td align="center" valign="top" width="300" style="width:300px;"> <![endif]--> <table class="column-wrapper" align="left" border="0" cellpadding="0" cellspacing="0" width="300"> <tbody> <tr> <td class="column-container tpl-container tpl-left-column"> <div class="eb-dragenddrop-box-text"> Drop Content Blocks Here </div> <div class="tpl-block" data-type="box-text" data-json="{&quot;fontTypeFace&quot;: &quot;None&quot;, &quot;fontWeight&quot;: &quot;None&quot;, &quot;fontSize&quot;: &quot;None&quot;, &quot;boxesIs&quot;: false, &quot;boxesBackgroundColor&quot;: &quot;#ffffff&quot;, &quot;boxesBorderType&quot;: &quot;None&quot;, &quot;boxesBorderWidth&quot;: 0, &quot;boxesBorderColor&quot;: &quot;#999999&quot;, &quot;color&quot;: &quot;#333333&quot;, &quot;lineHeight&quot;: &quot;None&quot;, &quot;textAlign&quot;: &quot;None&quot;, &quot;columnSplit&quot;: 0, &quot;columnSplitType&quot;: 0}"> <div class="tpl-block-content"> <table class="ebTextBlock" border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody class="ebTextBlockOuter"> <tr> <td class="ebTextBlockInner" valign="top"> <table class="ebTextContentContainer" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td class="ebTextContent" style="border: 0;padding-left:18px; padding-right: 18px; padding-top: 9px; padding-bottom: 9px;" valign="top"> <p class="eb-h2" style="margin-bottom: 15px; margin-top: 0;"> <span style="font-size: 20px; line-height: 23px; color: #333333; text-shadow: 0px 0px 0px #ffffff;">Left Column</span> </p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&acute;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> <div class="tpl-block-controls"> <a href="#" class="et-btn-white tpl-block-code"> <i></i> <span class="tpl-tooltip-btn">Code</span> </a> <a href="#" class="et-btn-white tpl-block-clone"> <i></i> <span class="tpl-tooltip-btn">Clone</span> </a> <a href="#" class="et-btn-white tpl-block-delete"> <i></i> <span class="tpl-tooltip-btn">Delete</span> </a> </div> </div> </td> </tr> </tbody> </table> <!--[if gte mso 9]> </td> <td align="center" valign="top" width="300" style="width:300px;"> <![endif]--> <table class="column-wrapper" align="right" border="0" cellpadding="0" cellspacing="0" width="300"> <tbody> <tr> <td class="column-container tpl-container tpl-right-column"> <div class="eb-dragenddrop-box-text"> Drop Content Blocks Here </div> <div class="tpl-block" data-type="box-text" data-json="{&quot;fontTypeFace&quot;: &quot;None&quot;, &quot;fontWeight&quot;: &quot;None&quot;, &quot;fontSize&quot;: &quot;None&quot;, &quot;boxesIs&quot;: false, &quot;boxesBackgroundColor&quot;: &quot;#ffffff&quot;, &quot;boxesBorderType&quot;: &quot;None&quot;, &quot;boxesBorderWidth&quot;: 0, &quot;boxesBorderColor&quot;: &quot;#999999&quot;, &quot;color&quot;: &quot;#333333&quot;, &quot;lineHeight&quot;: &quot;None&quot;, &quot;textAlign&quot;: &quot;None&quot;, &quot;columnSplit&quot;: 0, &quot;columnSplitType&quot;: 0}"> <div class="tpl-block-content"> <table class="ebTextBlock" border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody class="ebTextBlockOuter"> <tr> <td class="ebTextBlockInner" valign="top"> <table class="ebTextContentContainer" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"> <tbody> <tr> <td class="ebTextContent" style="border: 0;padding-left:18px; padding-right: 18px; padding-top: 9px; padding-bottom: 9px;" valign="top"> <p class="eb-h2" style="margin-bottom: 15px; margin-top: 0;"> <span style="font-size: 20px; line-height: 23px; color: #333333; text-shadow: 0px 0px 0px #ffffff;">Right Column</span> </p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&acute;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book </td> </tr> </tbody> </table> </td> </tr> </tbody> </table> </div> <div class="tpl-block-controls"> <a href="#" class="et-btn-white tpl-block-code"> <i></i> <span class="tpl-tooltip-btn">Code</span> </a> <a href="#" class="et-btn-white tpl-block-clone"> <i></i> <span class="tpl-tooltip-btn">Clone</span> </a> <a href="#" class="et-btn-white tpl-block-delete"> <i></i> <span class="tpl-tooltip-btn">Delete</span> </a> </div> </div> </td> </tr> </tbody> </table> <!--[if gte mso 9]> </td> </tr> </table> <![endif]--> </div>';
			} else if ($item.hasClass('eb-block-column-3')) {
				type = "column-3";
				dataAll = '{"backgroundColor": "#ffffff", "borderTopType": "None", "borderTopWidth": "0", "borderTopColor": "#ffffff", "borderBottomType": "None", "borderBottomWidth": "0", "borderBottomColor": "#ffffff"}';
				elementDrag = '<div class="template-column-3 clearfix"><!--[if gte mso 9]><table align="center" border="0" cellspacing="0" cellpadding="0" width="600" style="width:600px;"><tr><td align="center" valign="top" width="200" style="width:200px;"><![endif]--><table class="column-wrapper" align="left" border="0" cellpadding="0" cellspacing="0" width="200"><tbody><tr><td class="column-container tpl-container tpl-column-1"><div class="eb-dragenddrop-box-text">Drop Content Blocks Here</div><div class="tpl-block" data-type="box-text" data-json="{&quot;fontTypeFace&quot;: &quot;None&quot;, &quot;fontWeight&quot;: &quot;None&quot;, &quot;fontSize&quot;: &quot;None&quot;, &quot;boxesIs&quot;: false, &quot;boxesBackgroundColor&quot;: &quot;#ffffff&quot;, &quot;boxesBorderType&quot;: &quot;None&quot;, &quot;boxesBorderWidth&quot;: 0, &quot;boxesBorderColor&quot;: &quot;#999999&quot;, &quot;color&quot;: &quot;#333333&quot;, &quot;lineHeight&quot;: &quot;None&quot;, &quot;textAlign&quot;: &quot;None&quot;, &quot;columnSplit&quot;: 0, &quot;columnSplitType&quot;: 0}"><div class="tpl-block-content"><table class="ebTextBlock" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody class="ebTextBlockOuter"><tr><td class="ebTextBlockInner" valign="top"><table class="ebTextContentContainer" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ebTextContent" style="border: 0;padding-left:18px; padding-right: 18px; padding-top: 9px; padding-bottom: 9px;" valign="top"><p class="eb-h2" style="margin-bottom: 15px; margin-top: 0;"><span style="font-size: 20px; line-height: 23px; color: #333333; text-shadow: 0px 0px 0px #ffffff;">Left Column</span></p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&acute;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</td></tr></tbody></table></td></tr></tbody></table></div><div class="tpl-block-controls"><a href="#" class="et-btn-white tpl-block-code"><i></i><span class="tpl-tooltip-btn">Code</span></a> <a href="#" class="et-btn-white tpl-block-clone"><i></i><span class="tpl-tooltip-btn">Clone</span></a> <a href="#" class="et-btn-white tpl-block-delete"><i></i><span class="tpl-tooltip-btn">Delete</span></a></div></div></td></tr></tbody></table><!--[if gte mso 9]></td><td align="center" valign="top" width="200" style="width:200px;"><![endif]--><table class="column-wrapper" align="left" border="0" cellpadding="0" cellspacing="0" width="200"><tbody><tr><td class="column-container tpl-container tpl-column-2"><div class="eb-dragenddrop-box-text">Drop Content Blocks Here</div><div class="tpl-block" data-type="box-text" data-json="{&quot;fontTypeFace&quot;: &quot;None&quot;, &quot;fontWeight&quot;: &quot;None&quot;, &quot;fontSize&quot;: &quot;None&quot;, &quot;boxesIs&quot;: false, &quot;boxesBackgroundColor&quot;: &quot;#ffffff&quot;, &quot;boxesBorderType&quot;: &quot;None&quot;, &quot;boxesBorderWidth&quot;: 0, &quot;boxesBorderColor&quot;: &quot;#999999&quot;, &quot;color&quot;: &quot;#333333&quot;, &quot;lineHeight&quot;: &quot;None&quot;, &quot;textAlign&quot;: &quot;None&quot;, &quot;columnSplit&quot;: 0, &quot;columnSplitType&quot;: 0}"><div class="tpl-block-content"><table class="ebTextBlock" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody class="ebTextBlockOuter"><tr><td class="ebTextBlockInner" valign="top"><table class="ebTextContentContainer" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ebTextContent" style="border: 0;padding-left:18px; padding-right: 18px; padding-top: 9px; padding-bottom: 9px;" valign="top"><p class="eb-h2" style="margin-bottom: 15px; margin-top: 0;"><span style="font-size: 20px; line-height: 23px; color: #333333; text-shadow: 0px 0px 0px #ffffff;">Center Column</span></p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&acute;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</td></tr></tbody></table></td></tr></tbody></table></div><div class="tpl-block-controls"><a href="#" class="et-btn-white tpl-block-code"><i></i><span class="tpl-tooltip-btn">Code</span></a> <a href="#" class="et-btn-white tpl-block-clone"><i></i><span class="tpl-tooltip-btn">Clone</span></a> <a href="#" class="et-btn-white tpl-block-delete"><i></i><span class="tpl-tooltip-btn">Delete</span></a></div></div></td></tr></tbody></table><!--[if gte mso 9]></td><td align="center" valign="top" width="200" style="width:200px;"><![endif]--><table class="column-wrapper" align="left" border="0" cellpadding="0" cellspacing="0" width="200"><tbody><tr><td class="column-container tpl-container tpl-column-3"><div class="eb-dragenddrop-box-text">Drop Content Blocks Here</div><div class="tpl-block" data-type="box-text" data-json="{&quot;fontTypeFace&quot;: &quot;None&quot;, &quot;fontWeight&quot;: &quot;None&quot;, &quot;fontSize&quot;: &quot;None&quot;, &quot;boxesIs&quot;: false, &quot;boxesBackgroundColor&quot;: &quot;#ffffff&quot;, &quot;boxesBorderType&quot;: &quot;None&quot;, &quot;boxesBorderWidth&quot;: 0, &quot;boxesBorderColor&quot;: &quot;#999999&quot;, &quot;color&quot;: &quot;#333333&quot;, &quot;lineHeight&quot;: &quot;None&quot;, &quot;textAlign&quot;: &quot;None&quot;, &quot;columnSplit&quot;: 0, &quot;columnSplitType&quot;: 0}"><div class="tpl-block-content"><table class="ebTextBlock" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody class="ebTextBlockOuter"><tr><td class="ebTextBlockInner" valign="top"><table class="ebTextContentContainer" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ebTextContent" style="border: 0;padding-left:18px; padding-right: 18px; padding-top: 9px; padding-bottom: 9px;" valign="top"><p class="eb-h2" style="margin-bottom: 15px; margin-top: 0;"><span style="font-size: 20px; line-height: 23px; color: #333333; text-shadow: 0px 0px 0px #ffffff;">Right Column</span></p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry&acute;s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book</td></tr></tbody></table></td></tr></tbody></table></div><div class="tpl-block-controls"><a href="#" class="et-btn-white tpl-block-code"><i></i><span class="tpl-tooltip-btn">Code</span></a> <a href="#" class="et-btn-white tpl-block-clone"><i></i><span class="tpl-tooltip-btn">Clone</span></a> <a href="#" class="et-btn-white tpl-block-delete"><i></i><span class="tpl-tooltip-btn">Delete</span></a></div></div></td></tr></tbody></table><!--[if gte mso 9]></td></tr></table><![endif]--></div>';
			} else if( $item.hasClass('eb-block-button') ){
                type = 'box-button';
                dataAll = '{"buttonText":"Make Your Purchase", "url":"", "backgroundColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "fontTypeFace": "Arial", "fontWeight": "Bold", "fontSize": "16", "color":"#ffffff", "borderWidth":1, "borderColor":"#'+LL_INSTANCE_DEFAULT_THEME_COLOR+'", "borderType":"Solid", "radius":"3", "padding":"12", "align": 1, "width":0, "vAlign":"0"}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebButtonBlock">'+
                                    '<tbody class="ebButtonBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" align="center" class="ebButtonBlockInner" style="padding: 0 18px 18px;">'+
                                                '<table style="border-collapse: separate !important; border: 1px solid #'+LL_INSTANCE_DEFAULT_THEME_COLOR+'; border-radius: 3px; background-color: #'+LL_INSTANCE_DEFAULT_THEME_COLOR+';" border="0" cellpadding="0" cellspacing="0" class="ebButtonContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" align="center" style="font-size: 16px; padding: 12px; font-family: Arial,sans-serif;" class="ebButtonContent">'+
                                                                '<a class="ebButton" title="Make Your Purchase" href="javascript:void(0)" target="_blank" style="font-family: Arial,sans-serif; font-weight: bold; letter-spacing: normal; line-height: 100%; text-align: center; text-decoration: none; color: rgb(255, 255, 255);">Make Your Purchase</a>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            } else if( $item.hasClass('eb-block-code') ){
                type = 'box-code';
                dataAll = '{}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebTextBlock ebTextBlockCode">'+
					                '<tbody class="ebTextBlockOuter">'+
					                    '<tr>'+
					                        '<td valign="top" class="ebTextBlockInner" style="padding: 9px 18px;">'+
					                            '<div class="eb-text">Use your own custom HTML</div>'+
					                        '</td>'+
					                    '</tr>'+
					                '</tbody>'+
					           '</table>';
            } else if( $item.hasClass('eb-block-video') ){
                type = 'box-video';
                dataAll = '{"backgroundColor": "#ffffff", "borderType": "None", "borderWidth": "0", "borderColor":"#999999", "fontTypeFace": "None", "fontWeight": "None", "fontSize": "None", "color":"#333333", "lineHeight": "None", "textAlign": "None", "position": "3", "imgAlignment": "0", "margins": "0", "captionWidth":"0","urlVideo":""}';
                elementDrag = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageBlock">'+
                                    '<tbody class="ebImageBlockOuter">'+
                                        '<tr>'+
                                            '<td valign="top" class="ebImageCardBlockInner" style="padding: 9px 18px 0;">'+
                                                '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageContentContainer">'+
                                                    '<tbody>'+
                                                        '<tr>'+
                                                            '<td valign="top" class="ebImageContent" style="">'+
                                                                '<div class="eb-upload-image">'+
                                                                    '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                                    '<p>Add Video URL in editor</p>'+
                                                                    //'<p>Add Video URL in editor, drop a preview image here</p>'+
                                                                    //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                                '</div>'+
                                                            '</td>'+
                                                        '</tr>'+
                                                    '</tbody>'+
                                                '</table>'+
                                            '</td>'+
                                        '</tr>'+
                                        '<tr>'+
                                            '<td valign="top" class="ebTextContent" style="padding: 9px 18px;">'+
                                                'Your text caption goes here'+
                                            '</td>'+
                                        '</tr>'+
                                    '</tbody>'+
                                '</table>';
            }
            
            content =   "<div class='tpl-block tpl-selected tpl-adding' data-type='"+type+"' data-json='"+dataAll+"'>"+
                                '<div class="tpl-block-content">'
                                    +elementDrag+
                                '</div>'+
                                '<div class="tpl-block-controls">'+
                                    '<a href="javascript:void(0)" class="et-btn-white tpl-block-code"><i></i><span class="tpl-tooltip-btn">Code</span></a>'+
                                    ' <a href="javascript:void(0)" class="et-btn-white tpl-block-clone"><i></i><span class="tpl-tooltip-btn">Clone</span></a>'+
                                    ' <a href="javascript:void(0)" class="et-btn-white tpl-block-delete"><i></i><span class="tpl-tooltip-btn">Delete</span></a>'+
                                '</div>'+
                            '</div>';
                    
            $(ui.item).replaceWith(content);

			if ($item.hasClass('eb-block-column-2') || $item.hasClass('eb-block-column-3')){
				page.sortableElements($('.tpl-block.tpl-adding .tpl-container'));
			}

			$('.tpl-block.tpl-adding').removeClass('tpl-adding');

            $('.eb-block-content.ui-draggable-dragging').remove();
            
            page.isElements();
        }
    },
    editor_set_content: function(_selector, _content, _enfore_clear_undo){
    	_enfore_clear_undo = (typeof _enfore_clear_undo == 'undefined') ? true : _enfore_clear_undo;
    	var _editor = tinymce.get(_selector);
    	if(_editor && typeof _editor.is_initiatlized != 'undefined' && _editor.is_initiatlized){
    		/*
    		while (_content.indexOf ('<br />&nbsp;<br />') != -1) {
    			_content = _content.replace ('<br />&nbsp;<br />', '<br /><br />')
    		}
    		while (_content.indexOf ('<br>&nbsp;<br>') != -1) {
    			_content = _content.replace ('<br>&nbsp;<br>', '<br><br>')
    		}
    		console.log ('editor_set_content - before : ' + _content)
    		_content = string_replace_all ('<br />&nbsp;', '<br /><br />', _content);
    		_content = string_replace_all ('<br>&nbsp;', '<br><br>', _content);
    		console.log ('editor_set_content - after : ' + _content)
    		*/
    		
        	_editor.setContent(_content);
            if(_enfore_clear_undo){
            	_editor.undoManager.clear()
            }
    	} else {
    		window.setTimeout(function (){
    			page.editor_set_content(_selector, _content, _enfore_clear_undo)
			}, 100);
		}
    },
    editor_get_content: function(_selector){
    	var _editor = tinymce.get(_selector);
    	if(_editor){
        	var _content = _editor.getContent();
        	/*
    		while (_content.indexOf ('<br /><br />') != -1) {
    			_content = _content.replace ('<br /><br />', '<br />&nbsp;<br />')
    		}
    		while (_content.indexOf ('<br><br>') != -1) {
    			_content = _content.replace ('<br><br>', '<br>&nbsp;<br>')
    		}
    		console.log ('editor_get_content - before : ' + _content)
        	_content = string_replace_all ('<br /><br />', '<br />&nbsp;', _content);
        	_content = string_replace_all ('<br><br>', '<br>&nbsp;', _content);
    		console.log ('editor_get_content - after : ' + _content)
    		*/
        	
        	return _content;
    	}
    	return '';
    },
    addColumnTextTpl: function(count){
        var $tpl = $('.tpl-block.tpl-selected');
		var countColumn = count || 0;

		if ( countColumn == 2 ){
			if ( $tpl.find('.ebTextBlockInner > .ebTextContentContainer').length != 2 ){
				$tpl.find('.ebTextBlockInner').append( $tpl.find('.ebTextBlockInner > .ebTextContentContainer:first').clone() );
				$tpl.find('.ebTextContent').eq(1).html('This is a Text Block. Use this to provide text...');
				tinymce.get('editor-box-text-2').setContent($tpl.find('.ebTextContent').eq(1).html());
			}
		} else if ( countColumn == 3 ){
			if ( $tpl.find('.ebTextBlockInner > .ebTextContentContainer').length != 2 ){
				$tpl.find('.ebTextBlockInner').append( $tpl.find('.ebTextBlockInner > .ebTextContentContainer:first').clone() );
				$tpl.find('.ebTextContent').eq(1).html('This is a Text Block. Use this to provide text...');
				tinymce.get('editor-box-text-2').setContent($tpl.find('.ebTextContent').eq(1).html());
			}
			$tpl.find('.ebTextBlockInner').append( $tpl.find('.ebTextBlockInner > .ebTextContentContainer:first').clone() );
			$tpl.find('.ebTextContent').eq(2).html('This is a Text Block. Use this to provide text...');
			tinymce.get('editor-box-text-3').setContent($tpl.find('.ebTextContent').eq(2).html());
		}
		
        page.updateColumnTextTpl();
    },
    removeColumnTextTpl: function(countColumn){
        var $tpl = $('.tpl-block.tpl-selected');
        var $col = $tpl.find('.ebTextBlockInner .ebTextContentContainer');
		var masCol = [];
		$col.each(function(){
			masCol.push($(this).html());
		});

		if (countColumn == 2){
			$col.eq(2).remove();
		} else if ( countColumn == 3 ){
			
		} else {
			$tpl.find('.ebTextBlockInner').html('').html('<table class="ebTextContentContainer" style="" width="" cellspacing="0" cellpadding="0" border="0" align="left">' + masCol[0] + '</table>');
			
			$col = $tpl.find('.ebTextBlockInner .ebTextContentContainer');
	        $col.eq(0).css({
				'width':'100%',
				'min-width': '100%'
			}).attr('align','left').attr('width','100%');
	        $col.eq(1).remove();
			$col.eq(2).remove();
		}
    },
    updateColumnTextTpl: function(tpl){
        var $tpl = tpl || $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var $col = null;
        if (typeof opt == 'undefined' || !opt || typeof opt.columnSplit == 'undefined' || opt.columnSplit == 0)
            return false;
        
        var widthColumn = 291;
        var widthColumn_1 = 382;
        var widthColumn_2 = 196;
		var widthColumn_3 = 191;

		if ( $tpl.parents('#template-columns').length || $tpl.parents('.template-column-2').length){
            var widthColumn = 141;
            var widthColumn_1 = 180;
            var widthColumn_2 = 102;
        }  else if ( $tpl.parents('#tpl-left-sidebar').length || $tpl.parents('#tpl-right-sidebar').length || $tpl.parents('#template-columns-three').length || $tpl.parents('.template-column-3').length){
            var widthColumn = 91;
            var widthColumn_1 = 106;
            var widthColumn_2 = 76;
        } else if ( ($tpl.parents('#template-left-sidebar').length && $tpl.parents('#tpl-body').length) ||  ($tpl.parents('#template-right-sidebar').length && $tpl.parents('#tpl-body').length)){
            var widthColumn = 191;
            var widthColumn_1 = 230;
            var widthColumn_2 = 152;
        }
        
        $col = $tpl.find('.ebTextBlockInner .ebTextContentContainer');
		
		var masCol = [];
		$col.each(function(){
			masCol.push($(this).html());
		});
		
		$tpl.find('.ebTextBlockInner').html('').html('<table class="ebTextContentContainer" style="" width="" cellspacing="0" cellpadding="0" border="0" align="left">' + masCol[0] + '</table> <table class="ebTextContentContainer" style="" width="" cellspacing="0" cellpadding="0" border="0" align="left">' + masCol[1] + '</table>');
		if (masCol.length == 3){
			$tpl.find('.ebTextBlockInner').append('<table class="ebTextContentContainer" style="" width="" cellspacing="0" cellpadding="0" border="0" align="left">' + masCol[2] + '</table>');
		}
		$col = $tpl.find('.ebTextBlockInner .ebTextContentContainer');
		
        if ( opt.columnSplitType == 0){
            $col.css({
				'width': widthColumn + 9 + 'px',
				'min-width': widthColumn + 'px'
			}).attr('width',widthColumn + 'px');
        } else if ( opt.columnSplitType == 1){
            $col.eq(0).css({
				'width': widthColumn_1 + 9 + 'px',
				'min-width': widthColumn_1 + 'px',
			}).attr('width',widthColumn_1 + 'px');
            $col.eq(1).css({
				'width': widthColumn_2 + 9 + 'px',
				'min-width': widthColumn_2 + 'px'
			}).attr('width',widthColumn_2 + 'px');
        } else if ( opt.columnSplitType == 2){
            $col.eq(0).css({
				'width': widthColumn_2 + 9 + 'px',
				'min-width': widthColumn_2 + 'px'
			}).attr('width',widthColumn_2 + 'px');
            $col.eq(1).css('width',widthColumn_1 + 9 + 'px').attr('width',widthColumn_1 + 'px');
			
        } else if ( opt.columnSplitType == 3){
			$col.css({
				'width': widthColumn_3 + 9 + 'px',
				'min-width': widthColumn_3 + 'px'
			}).attr('width',widthColumn_3 + 'px');
		}
	
		var tableTemplateStart = '<!--[if gte mso 9]><table align="left" border="0" cellspacing="0" cellpadding="0" width="100%" style="width:100%;"><tr><![endif]-->';
		var tableTemplateEnd = '<!--[if gte mso 9]></tr></table><![endif]-->';
	
		if ( opt.columnSplitType == 0){
			$col.eq(0).before(tableTemplateStart + '<!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn+'"><![endif]-->');
			$col.eq(0).after('<!--[if gte mso 9]></td><![endif]--><!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn+'"><![endif]-->');
			$col.eq(1).after(tableTemplateEnd);
		} else if ( opt.columnSplitType == 1){
			$col.eq(0).before(tableTemplateStart + '<!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_1+'"><![endif]-->');
			$col.eq(0).after('<!--[if gte mso 9]></td><![endif]--><!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_2+'"><![endif]-->');
			$col.eq(1).after(tableTemplateEnd);
		} else if ( opt.columnSplitType == 2){
			$col.eq(0).before(tableTemplateStart + '<!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_2+'"><![endif]-->');
			$col.eq(0).after('<!--[if gte mso 9]></td><![endif]--><!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_1+'"><![endif]-->');
			$col.eq(1).after(tableTemplateEnd);
		} else if( opt.columnSplitType == 3){
			$col.eq(0).before(tableTemplateStart + '<!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_3+'"><![endif]-->');
			$col.eq(0).after('<!--[if gte mso 9]></td><![endif]--><!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_3+'"><![endif]-->');
			$col.eq(1).after('<!--[if gte mso 9]></td><![endif]--><!--[if gte mso 9]><td align="center" valign="top" width="'+widthColumn_3+'"><![endif]-->');
			$col.eq(2).after(tableTemplateEnd);
		}
		if(opt.columnSplit == 2){
			$col.eq(2).after('<!--[if gte mso 9]></td><![endif]-->');
		} else{
			$col.eq(1).after('<!--[if gte mso 9]></td><![endif]-->');
		}
    },
    actionsBtnBlock: function(){
        $('#templateContainer').on('click','.tpl-block', function(e){
            e.preventDefault();
            e.stopPropagation();
            var $block = $(this);
            var type = $block.data('type');
            var typeSlide = type;
            
            if ( type == 'box-border-text' ){
                typeSlide = 'box-text';
                $('#eb-' + typeSlide).find('.eb-panel-head > span').text('Border Text');
            } else if( type == 'box-text' ){
                $('#eb-' + typeSlide).find('.eb-panel-head > span').text('Text');
            } else if( type == 'box-footer' ){
                typeSlide = 'box-text';
                $('#eb-' + typeSlide).find('.eb-panel-head > span').text('Footer');
            } else if( type == 'box-social-share' ){
                typeSlide = 'box-social-share';
                $('#eb-' + typeSlide).find('.eb-panel-head > span').text('Social Share');
            } else if( type == 'box-social-follow' ){
                typeSlide = 'box-social-share';
                $('#eb-' + typeSlide).find('.eb-panel-head > span').text('Social Follow');
            } else if( type == 'box-calendar' ){
                typeSlide = 'box-social-share';
                $('#eb-' + typeSlide).find('.eb-panel-head > span').text('Calendar');
            }
            
            if ( !$block.hasClass('tpl-selected') ){
                $('.wrap-panels-el').css('z-index','1');
                $('#eb-' + typeSlide).find('.tabs-editor > ul li').removeClass('selected').eq(0).addClass('selected');
                $('#eb-' + typeSlide).find('.tabs-editor .wrap-tabs-content > div.tab-content').hide().eq(0).show();                   
                
                if( $('.eb-right-panel-slide.active').length ){
                    $('.eb-right-panel-slide.active').removeClass('active').animate({left: '589px'}, 300,function(){
                        $(this).hide();
                        $('#eb-' + typeSlide).addClass('active').show().animate({left: 0},300);
                    });
                } else{
                    $('#eb-' + typeSlide).addClass('active').show().animate({left: 0},300);
                } 
            }
            
            $('.tpl-block').removeClass('tpl-selected');
            $block.addClass('tpl-selected');
            page.editElementTpl(type);
            page.tplCode.removeTplCode();
            
        });
        
        $('#templateContainer').on('click','.tpl-block-move', function(e){
            e.preventDefault();
            e.stopPropagation();
            page.tplCode.removeTplCode();
        });
        $('#templateContainer').on('click','.tpl-block-edit', function(e){
            e.preventDefault();
            page.tplCode.removeTplCode();
        });
        $('#templateContainer').on('click','.tpl-block-clone', function(e){
            e.preventDefault();
            e.stopPropagation();
            page.elementsClone($(this));
            page.tplCode.removeTplCode();
        });
        $('#templateContainer').on('click','.tpl-block-delete', function(e){
            e.preventDefault();
            e.stopPropagation();
            $(this).closest('.tpl-block').remove();
            $('.eb-right-panel-slide.active').removeClass('active').css({left: '589px'}).hide();
            $('.wrap-panels-el').css('z-index','-1');
            page.isElements();
            page.tplCode.removeTplCode();
        });
        $('#templateContainer').on('click','.eb-upload-image .et-btn-white', function(e){
            e.preventDefault();
            e.stopPropagation();
        });
        $('#templateContainer').on('click','.tpl-block-code', function(e){
            e.preventDefault();
            e.stopPropagation();
            var $tpl = $(this).parents('.tpl-block');
            $tpl.addClass('tpl-selected').siblings('.tpl-block').removeClass('tpl-selected');
            $('.eb-right-panel-slide.active').removeClass('active').css({left: '589px'}).hide();
            $('.wrap-panels-el').css('z-index','-1');
            page.tplCode.removeTplCode();
            page.tplCode.tplCodeAdd($tpl);
            page.tplCode.tplCodeAction();
        });
    },
    tplCode:{
        editor: null,
        tplBox: null, 
        tplCodeAction: function(){
            $('.eb-close-code-tpl').off('click').on('click', function(e){
                e.preventDefault();
                page.tplCode.tplCodeSave($(this));
            });
        },
        tplCodeSave: function($link){
            var html = page.tplCode.editor.getValue();
            page.tplCode.tplBox.removeClass('tpl-selected');
            page.tplCode.tplBox.find('.tpl-block-content').html(html);
            page.tplCode.removeTplCode();
        },
        removeTplCode: function(){
            $('.eb-show-code-tpl-block').remove();
        },
        tplCodeAdd: function($tpl){
            var codeHtml = $tpl.find('.tpl-block-content').html();
            page.tplCode.tplBox = $tpl;
            $tpl.after('<div class="eb-show-code-tpl-block"><a href="javascript:void(0)" class="eb-close-code-tpl">Save & Close</a><div class="eb-code-html"><textarea id="eb-code-html" name="eb-code">'+codeHtml+'</textarea></div></div>');

            CodeMirror.commands.autocomplete = function(cm) {
                cm.showHint({hint: CodeMirror.hint.anyword});
            }
            page.tplCode.editor = CodeMirror.fromTextArea(document.getElementById("eb-code-html"), {
    			lineNumbers: true,
    			mode: "text/html",
    			matchBrackets: true,
    			extraKeys: {"Ctrl-Q": function(cm){ cm.foldCode(cm.getCursor()); }},
    			foldGutter: true,
    			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    			extraKeys: {
    				"F11": function(cm) {
    					cm.setOption("fullScreen", !cm.getOption("fullScreen"));
    				},
    				"Esc": function(cm) {
    					if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
    				},
    				"Ctrl-Space": "autocomplete"
    			},
    			lineWrapping: true
    		});
            /*
            page.tplCode.editor = CodeMirror.fromTextArea(document.getElementById("eb-code-html"),  {
                lineNumbers: true,
                lineWrapping: true,
                extraKeys: {"Ctrl-Space": "autocomplete"}
            });
            */
        }
    },
    updateColumnEditor:function(opt){
        var $columnEditor = $('.two-text-editor');
		var $ul = $columnEditor.find('ul');
		
        if ( opt.columnSplit == 0){
            $ul.hide();
        } else {
            $columnEditor.find('ul').show();
			if ( opt.columnSplit == 1 ){
				$ul.find('li').show().eq(2).hide();
			} else if ( opt.columnSplit == 2 ){
				$ul.find('li').show();
			}
        }
        
        $ul.find('li').removeClass('selected').eq(0).addClass('selected');

        $columnEditor.find('.eb-text-column').hide().eq(0).show();
    },
    editElementTpl: function(type){
    	
        var $box = $('.tpl-block.tpl-selected');
        var opt = $box.data('json');
        var $slide = null;
        
        if ( type == 'box-text' ||  type == 'box-border-text' ||  type == 'box-footer'){
            $slide =  $('#eb-' + type);
            var $split = $('#splitColumnBoxText');

        	this.html_edit_manual = true;
            page.editor_set_content('editor-box-text', $box.find('.ebTextContent').eq(0).html());

    		ll_combo_manager.set_selected_value('#numberColumnBoxText', opt.columnSplit);
    		ll_combo_manager.trigger_event_on_change('#numberColumnBoxText');
            $tpls = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
			if( $tpls.length || $box.parents('.template-column-2').length || $box.parents('.template-column-3').length){
				//$('#numberColumnBoxText option').eq(2).attr('disabled','disabled').hide();
			}
            $("#numberColumnBoxText").trigger('liszt:updated');
            
            if ( opt.columnSplit == 1){
                $split.show();
                $split.find('li').removeClass('selected').eq(opt.columnSplitType).addClass('selected');

            	this.html_edit_manual = true;
                page.editor_set_content('editor-box-text-2', $box.find('.ebTextContent').eq(1).html());
            } else if ( opt.columnSplit == 2){
                $split.show();
				$split.find('li').removeClass('selected').eq(opt.columnSplitType).addClass('selected');

		    	this.html_edit_manual = true;
                page.editor_set_content('editor-box-text-2', $box.find('.ebTextContent').eq(1).html());
            	this.html_edit_manual = true;
                page.editor_set_content('editor-box-text-3', $box.find('.ebTextContent').eq(2).html());
                //tinymce.get('editor-box-text-2').setContent($box.find('.ebTextContent').eq(1).html());
                //tinymce.get('editor-box-text-3').setContent($box.find('.ebTextContent').eq(2).html());
            } else {
                $split.hide();
            }
            page.updateColumnEditor(opt);
    		ll_combo_manager.set_selected_value('#boxTextTypeFace', opt.fontTypeFace);
    		ll_combo_manager.set_selected_value('#boxTextWeight', opt.fontWeight);
    		ll_combo_manager.set_selected_value('#boxTextSize', opt.fontSize);
    		ll_combo_manager.set_selected_value('#boxTextLineHeight', opt.lineHeight);
            
            $('#boxTextAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
            
            $('#boxTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#boxTextBackground').colpickSetColor(opt.boxesBackgroundColor, true).css('background-color', opt.boxesBackgroundColor);
            if (opt.boxesIs){
                $('#boxTextBorderColor').colpickSetColor(opt.boxesBorderColor, true).css('background-color', opt.boxesBorderColor);
                $('#boxTextBorderWidth').val(opt.boxesBorderWidth);
        		ll_combo_manager.set_selected_value('#boxTextBorderType', opt.boxesBorderType);
                
                $('#boxes-border').show();
            } else {
                $('#boxes-border').hide();
            }
        } else if( type == 'box-divider' ){
            $('#dividerBackgroundColor').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#dividerBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#dividerBorderWidth').val(opt.borderWidth);
    		ll_combo_manager.set_selected_value('#dividerBorderType', opt.borderType);
            $('#dividerPaddingTop').val(opt.paddingTop);
            $('#dividerPaddingBottom').val(opt.paddingBottom);
        } else if(type == 'box-image-card'){
            page.editor_set_content('editor-box-text-card', $box.find('.ebTextContent').html());
            $('#cardBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#cardBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#cardBorderWidth').val(opt.borderWidth);
    		ll_combo_manager.set_selected_value('#cardBorderType', opt.borderType);
            
    		ll_combo_manager.set_selected_value('#cardTypeFace', opt.fontTypeFace);
    		ll_combo_manager.set_selected_value('#cardWeight', opt.fontWeight);
    		ll_combo_manager.set_selected_value('#cardSize', opt.fontSize);
            $('#cardTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            
    		ll_combo_manager.set_selected_value('#cardLineHeight', opt.lineHeight);
            
            $('#cardTextAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
            
    		ll_combo_manager.set_selected_value('#cardPosition', opt.position);
    		
            page.optionsDropdownImage();
            page.updateImageEdge($('#image-edge-card'));
            page.startCountImgOne();
            
        } else if(type == 'box-image-caption'){
            
            page.editor_set_content('editor-box-text-caption', $box.find('.ebTextContent').eq(0).html());
            
            if ( opt.number == 1){
                page.editor_set_content('editor-box-text-caption-2', $box.find('.ebTextContent').eq(1).html());
            }
             
            page.updateColumnEditorCaption(opt);
            
    		ll_combo_manager.set_selected_value('#captionTypeFace', opt.fontTypeFace);
    		ll_combo_manager.set_selected_value('#captionWeight', opt.fontWeight);
    		ll_combo_manager.set_selected_value('#captionSize', opt.fontSize);
            $('#captionTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            
    		ll_combo_manager.set_selected_value('#captionLineHeight', opt.lineHeight);
            
            $('#captionTextAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
            
    		ll_combo_manager.set_selected_value('#captionPosition', opt.position);
            
    		ll_combo_manager.set_selected_value('#captionNumber', opt.number);
    		
            page.optionsDropdownImage();
            page.startCountImgOne();
            
        } else if(type == 'box-button'){
            $('#buttonText').val(opt.buttonText);
            $('#buttonBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#buttonBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#buttonTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            $('#buttonBorderWidth').val(opt.borderWidth);
    		ll_combo_manager.set_selected_value('#buttonBorderType', opt.borderType);
            $('#buttonRadius').val(opt.radius);
            $('#buttonPadding').val(opt.padding);
            if (opt.url.indexOf ('mailto:') != -1) {
        		ll_combo_manager.set_selected_value('#button_link_to', 'mail');
                $('#buttonUrl').val(opt.url.replace ('mailto:', ''));
            } else {
        		ll_combo_manager.set_selected_value('#button_link_to', 'url');
                $('#buttonUrl').val(opt.url);
            }
            ll_combo_manager.trigger_event_on_change('#button_link_to');
            
    		ll_combo_manager.set_selected_value('#buttonTypeFace', opt.fontTypeFace);
    		ll_combo_manager.set_selected_value('#buttonWeight', opt.fontWeight);
    		ll_combo_manager.set_selected_value('#buttonSize', opt.fontSize);
    		ll_combo_manager.set_selected_value('#buttonAlign', opt.align);
    		ll_combo_manager.set_selected_value('#buttonVAlign', opt.vAlign);
    		ll_combo_manager.set_selected_value('#buttonWidth', opt.width);
            
        } else if ( type == 'box-image' ){
    		ll_combo_manager.set_selected_value('#imageAlign', opt.align);
            page.updateImageEdge($('#image-edge'));
            page.startCountImgOne();
            
        } else if ( type == 'box-image-group' ){
            page.startLayoutImagesGroup();
            page.startCountImgs();
        } else if ( type == 'box-social-share' || type == 'box-social-follow' || type == 'box-calendar'){
        	
            $('#containerSocialBackground').colpickSetColor(opt.containerBackground, true).css('background-color', opt.containerBackground);
    		ll_combo_manager.set_selected_value('#containerSocialBorderType', opt.containerBorderType);
            $('#containerSocialBorderWidth').val(opt.containerBorderWidth);
            $('#containerSocialBorderColor').colpickSetColor(opt.containerBorderColor, true).css('background-color', opt.containerBorderColor);
			$('#containerSocialPadding').val(opt.containerPadding);

            $('#btnSocialBackground').colpickSetColor(opt.btnBackground, true).css('background-color', opt.btnBackground);
    		ll_combo_manager.set_selected_value('#btnSocialBorderType', opt.btnBorderType);
            $('#btnSocialBorderWidth').val(opt.btnBorderWidth);
            $('#btnSocialBorderColor').colpickSetColor(opt.btnBorderColor, true).css('background-color', opt.btnBorderColor);
            
            $('#btnSocialBorderRadius').val(opt.btnBorderRadius);
            
    		ll_combo_manager.set_selected_value('#btnSocialTypeFace', opt.fontTypeFace);
    		ll_combo_manager.set_selected_value('#btnSocialWeight', opt.fontWeight);
    		ll_combo_manager.set_selected_value('#btnSocialSize', opt.fontSize);
            $('#btnSocialColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            
    		ll_combo_manager.set_selected_value('#btnSocialLineHeight', opt.lineHeight);
            
    		ll_combo_manager.set_selected_value('#btnSocialAlign', opt.align);
    		ll_combo_manager.set_selected_value('#btnSocialWidth', opt.width);
    		
            if( type == 'box-social-follow' || type == 'box-calendar' ){
                $('#wrap-social-display').show();
        		ll_combo_manager.set_selected_value('#btnSocialDisplay', opt.display);
            } else {
                $('#wrap-social-display').hide();
            }
            
            if (type == 'box-calendar') {
    			var event = {
					organizer_name: $.trim (ll_logedin_user_firstname + ' ' + ll_logedin_user_lastname),
					organizer_email: $.trim (ll_logedin_user_email),
					start: '',
					end: '',
					timezone: page.default_calendar_timezone,
					location: '',
					description: ''
    			};
            	if (typeof opt.event != 'undefined' && opt.event) {
            		event = opt.event;
            	}
                	
    			$('.field-calendar-email .field-event-title').val(event.title);
    			$('.field-calendar-email .field-event-start').val(event.start);
    			$('.field-calendar-email .field-event-end').val(event.end);
    			ll_combo_manager.set_selected_value('.field-calendar-email #calendarTimezone', event.timezone);
    			$('.field-calendar-email .field-event-location').val(event.location);
    			$('.field-calendar-email .field-event-organizer-name').val(event.organizer_name);
    			$('.field-calendar-email .field-event-organizer-email').val(event.organizer_email);
    			$('.field-calendar-email .field-event-description').val(event.description);
            }
    		
            $('.eb-social-style-icon li').eq(opt.styleIcon).addClass('selected').siblings('li').removeClass('selected');

    		ll_combo_manager.set_selected_value('#select-content-to-share', opt.shareCustomUrl);
            
    		$('.eb-social-style-icon').find('li img').show();
			$('.wrap-btn-update-calendar-email, .field-calendar-email').hide();
            if(opt.contentToShare == '1'){

                //$('.eb-social-style-icon').find('.eb-icn-share').show();
                $('.eb-social-style-icon').find('.eb-icn-follow').hide();
				$('.eb-social-style-icon').find('.eb-icn-calendar').hide();
                if(opt.shareCustomUrl == '1'){
                    $('.eb-share-custom-text').show();
                    if(opt.shareLink != '%%webversion_url_encoded%%'){
                    	$('#shareCustomLink').val(opt.shareLink);
                    }
                    $('#shareShortDesc').val(opt.shareDesc);
                } else{
                    $('.eb-share-custom-text').hide();
                }
            } else{
                $('.eb-content-to-share').hide();
				if(type == 'box-calendar'){
					$('.eb-social-style-icon').find('li img').hide();
					$('.eb-social-style-icon').find('.eb-icn-calendar').show();
					$('.wrap-btn-update-calendar-email, .field-calendar-email').show();
				} else{
					$('.eb-social-style-icon').find('.eb-icn-share').hide();
					//$('.eb-social-style-icon').find('.eb-icn-follow').show();
					$('.eb-social-style-icon').find('.eb-icn-calendar').hide();
				}
            }
            if (opt.display){
                $('.eb-wrap-layout-social').hide();
                if( opt.display == '0' ){
                    $('.eb-wrap-layout-social.iconOnly').show().find('li').removeClass('selected').eq(opt.layout).addClass('selected');
                } else if( opt.display == '1' ){
                    $('.eb-wrap-layout-social.textOnly').show().find('li').removeClass('selected').eq(opt.layout).addClass('selected');
                } else {
                    $('.eb-wrap-layout-social.iconAndText').show().find('li').removeClass('selected').eq(opt.layout).addClass('selected');
                }
            } else {
                $('.eb-wrap-layout-social').hide();
                $('.eb-wrap-layout-social.iconAndTextShare').show().find('li').removeClass('selected').eq(opt.layout).addClass('selected');
            }
            
            page.updateSocialGroupHtml();
            page.countGroupSocial();
            /*
            var $lnk = $box.find('.mcnShareTextContent a');
            $('#eb-fb-link').val($lnk.eq(0).attr('href'));
            $('#eb-tw-link').val($lnk.eq(1).attr('href'));
            $('#eb-in-link').val($lnk.eq(2).attr('href'));
            $('#eb-gg-link').val($lnk.eq(3).attr('href'));
            
            if (opt.lnk1 == 1){
                $('#eb-check-fb').prop('checked', true);
            } else {
                $('#eb-check-fb').prop('checked', false);
            }
            if (opt.lnk2 == 1){
                $('#eb-check-tw').prop('checked', true);
            } else {
                $('#eb-check-tw').prop('checked', false);
            }
            if (opt.lnk3 == 1){
                $('#eb-check-in').prop('checked', true);
            } else {
                $('#eb-check-in').prop('checked', false);
            }
            if (opt.lnk4 == 1){
                $('#eb-check-gg').prop('checked', true);
            } else {
                $('#eb-check-gg').prop('checked', false);
            }
            */
        } else if ( type == 'box-code' ){
            var html = $box.find('.ebTextBlockInner').html();
            page.codeBox.editor.setValue(html);
        } else if(type == 'box-video'){
            page.editor_set_content('editor-box-text-video', $box.find('.ebTextContent').html());
            $('#videoBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#videoBorderColor').colpickSetColor(opt.borderColor, true).css('background-color', opt.borderColor);
            $('#videoBorderWidth').val(opt.borderWidth);
    		ll_combo_manager.set_selected_value('#videoBorderType', opt.borderType);

    		ll_combo_manager.set_selected_value('#videoTypeFace', opt.fontTypeFace);
    		ll_combo_manager.set_selected_value('#videoWeight', opt.fontWeight);
    		ll_combo_manager.set_selected_value('#videoSize', opt.fontSize);
            $('#videoTextColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
            
    		ll_combo_manager.set_selected_value('#videoLineHeight', opt.lineHeight);
            
            $('#videoTextAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
            
    		ll_combo_manager.set_selected_value('#videoPosition', opt.position);
            page.optionsDropdownImage();
            page.updateImageEdge($('#image-edge-video'));
            page.startCountImgOne();
            page.startVideoImg();
		} else if(type == 'column-2'){
			$('#column2Background').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
			$('#column2BorderTopType option[value="'+opt.borderTopType+'"]').attr('selected', true);
			$("#column2BorderTopType").trigger('liszt:updated');
			$('#column2BorderTopWidth').val(opt.borderTopWidth);
			$('#column2BorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
			$('#column2BorderBottomType option[value="'+opt.borderBottomType+'"]').attr('selected', true);
			$("#column2BorderBottomType").trigger('liszt:updated');
			$('#column2BorderBottomWidth').val(opt.borderBottomWidth);
			$('#column2BorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);
		} else if(type == 'column-3'){
			$('#column3Background').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
			$('#column3BorderTopType option[value="'+opt.borderTopType+'"]').attr('selected', true);
			$("#column3BorderTopType").trigger('liszt:updated');
			$('#column3BorderTopWidth').val(opt.borderTopWidth);
			$('#column3BorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
			$('#column3BorderBottomType option[value="'+opt.borderBottomType+'"]').attr('selected', true);
			$("#column3BorderBottomType").trigger('liszt:updated');
			$('#column3BorderBottomWidth').val(opt.borderBottomWidth);
			$('#column3BorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);
		}
		if( $('.wrap-tabs-content:visible').find('.eb-editor-text').length ){
			page.resizeTinymce();
		}
    },
    updateElementTpl: function($btn){
    	if(page.ll_email_builder_step == 'setup_native'){
    		var _html = page.editor_get_content('eb-editor-html')
            page.set_content({
    			html: _html,
    			is_preview: true,
    			is_html: false,
    			is_editor: false
    		});
    	} else {
	        var $tpl = $('.tpl-block.tpl-selected');
	        if ($tpl.length > 0){
		        var opt = $tpl.data('json');
		        var type;
		        var $tplType = $tpl.attr('data-type');
		        
		        if($btn){
		            type = $btn.parents('.eb-right-panel-slide').attr('id');
		        } else{
		            type = $('.eb-right-panel-slide.active').attr('id');
		        }
		        
		        if (typeof type != 'undefined' && type){
			        if ($tplType == 'box-border-text' || $tplType == 'box-footer'){
			            $tplType = 'box-text';
			        }
			        
			        if ( type.substr(3) ==  $tplType){
			            console.log('Update TPL: ' + $tplType);
			            
			            if ($tplType == 'box-text' || $tplType == 'box-border-text'|| $tplType == 'box-footer'){
			                $tpl.find('.ebTextContent').eq(0).html(page.editor_get_content('editor-box-text'));
			                if(opt.columnSplit == 1){
			                    $tpl.find('.ebTextContent').eq(1).html(page.editor_get_content('editor-box-text-2'));
			                } else if(opt.columnSplit == 2){
								$tpl.find('.ebTextContent').eq(1).html(tinymce.get('editor-box-text-2').getContent());
								$tpl.find('.ebTextContent').eq(2).html(tinymce.get('editor-box-text-3').getContent());
							}
			            } else if ( $tplType == 'box-image-card'){
			                $tpl.find('.ebTextContent').eq(0).html(page.editor_get_content('editor-box-text-card'));
			            } else if ( $tplType == 'box-image-caption'){
			                $tpl.find('.ebTextContent').eq(0).html(page.editor_get_content('editor-box-text-caption'));
			                
			                if ( opt.number == 1 ){
			                    $tpl.find('.ebTextContent').eq(1).html(page.editor_get_content('editor-box-text-caption-2'));
			                }
			            } else if ( $tplType == 'box-code'){
			                var html = page.codeBox.editor.getValue();
			                $tpl.find('.ebTextBlockInner').html(html);
			            } else if ( $tplType == 'box-video'){
			                $tpl.find('.ebTextContent').eq(0).html(page.editor_get_content('editor-box-text-video'));
			            }
			            
			        } else if ( type.substr(3) == 'page-design' )  {
			            console.log('Page Design Update');
			        } else {
			            console.log('Error TPL UPDATE');
			        }
			        if($btn){
			            $tpl.removeClass('tpl-selected');
			        }
		        }
	        }
    	}
    },
    updatePageDesign: function(){
        var $tpl = $('#bodyTable');
        var opt = $tpl.data('json');
        if(!opt){
            return false;
        }
        $tpl.css({
            backgroundColor: opt.backgroundColor,
            borderTopStyle: opt.borderTopType,
            borderTopWidth: opt.borderTopWidth + 'px',
            borderTopColor: opt.borderTopColor
        });
        
        /*preheader*/
        
        $tpl = $('#tpl-preheader');
        if( $tpl.length ){
            $('#slide-h-preheader').show();
            opt = $tpl.data('json');

            var preheaderAlign = opt.textAlign;

            if ( preheaderAlign == '0' ){
                preheaderAlign = 'left';
            } else if( preheaderAlign == '1'){
                preheaderAlign = 'center';
            } else if( preheaderAlign == '2'){
                preheaderAlign = 'right';
            }
            $('#tpl-preheader').css({
                backgroundColor: opt.backgroundColor,
                borderTopStyle: opt.borderTopType,
                borderTopWidth: opt.borderTopWidth + 'px',
                borderTopColor: opt.borderTopColor,
                borderBottomStyle: opt.borderBottomType,
                borderBottomWidth: opt.borderBottomWidth + 'px',
                borderBottomColor: opt.borderBottomColor,
                fontFamily: opt.fontTypeFace,
                fontSize: opt.fontSize + 'px',
                fontWeight: opt.fontWeight,
                color: opt.color,
                //lineHeight: opt.lineHeight + '%',
                textAlign: preheaderAlign
            });
            page.updateInlineCss('preheader');
        } else {
            $('#slide-h-preheader, #slide-c-preheader').hide();
        }
        /*header*/
        $tpl = $('#tpl-header');
        opt = $tpl.data('json');
        
        var headerAlign = opt.textAlign;
        
        if ( headerAlign == '0' ){
            headerAlign = 'left';
        } else if( headerAlign == '1'){
            headerAlign = 'center';
        } else if( headerAlign == '2'){
            headerAlign = 'right';
        }
        $('#tpl-header').css({
            backgroundColor: opt.backgroundColor,
            borderTopStyle: opt.borderTopType,
            borderTopWidth: opt.borderTopWidth + 'px',
            borderTopColor: opt.borderTopColor,
            borderBottomStyle: opt.borderBottomType,
            borderBottomWidth: opt.borderBottomWidth + 'px',
            borderBottomColor: opt.borderBottomColor,
            fontFamily: opt.fontTypeFace,
            fontSize: opt.fontSize + 'px',
            fontWeight: opt.fontWeight,
            color: opt.color,
            //lineHeight: opt.lineHeight + '%',
            textAlign: headerAlign
        });
        page.updateInlineCss('header');
        
        /*body*/
        $tpl = $('#tpl-body');
        if( $tpl.length ){
            $('#slide-h-body').show();
            opt = $tpl.data('json');

            var bodyAlign = opt.textAlign;

            if ( bodyAlign == '0' ){
                bodyAlign = 'left';
            } else if( bodyAlign == '1'){
                bodyAlign = 'center';
            } else if( bodyAlign == '2'){
                bodyAlign = 'right';
            }
            $('#tpl-body').css({
                backgroundColor: opt.backgroundColor,
                borderTopStyle: opt.borderTopType,
                borderTopWidth: opt.borderTopWidth + 'px',
                borderTopColor: opt.borderTopColor,
                borderBottomStyle: opt.borderBottomType,
                borderBottomWidth: opt.borderBottomWidth + 'px',
                borderBottomColor: opt.borderBottomColor,
                fontFamily: opt.fontTypeFace,
                fontSize: opt.fontSize + 'px',
                fontWeight: opt.fontWeight,
                color: opt.color,
                //lineHeight: opt.lineHeight + '%',
                textAlign: bodyAlign
            });
			
			if( $('#template-right-sidebar, #template-left-sidebar').length ){
				$('#template-right-sidebar, #template-left-sidebar').children('.column-wrapper').find('td:first').css('background-color', opt.backgroundColor);
			}
			
            page.updateInlineCss('body');
        } else {
            $('#slide-h-body, #slide-c-body').hide();
        }
        /*Columns*/
        $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
        if( $tpl.length ){
            $('#slide-h-columns').show();
            if ( $tpl.attr('id') == 'tpl-right-sidebar' || $tpl.attr('id') == 'tpl-left-sidebar' ){
                $('#slide-h-columns').text('Sidebar');
            } else{
                $('#slide-h-columns').text('Columns');
            }
            opt = $tpl.data('json');

            var bodyAlign = opt.textAlign;

            if ( bodyAlign == '0' ){
                bodyAlign = 'left';
            } else if( bodyAlign == '1'){
                bodyAlign = 'center';
            } else if( bodyAlign == '2'){
                bodyAlign = 'right';
            }
            $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar').css({
                backgroundColor: opt.backgroundColor,
                borderTopStyle: opt.borderTopType,
                borderTopWidth: opt.borderTopWidth + 'px',
                borderTopColor: opt.borderTopColor,
                borderBottomStyle: opt.borderBottomType,
                borderBottomWidth: opt.borderBottomWidth + 'px',
                borderBottomColor: opt.borderBottomColor,
                fontFamily: opt.fontTypeFace,
                fontSize: opt.fontSize + 'px',
                fontWeight: opt.fontWeight,
                color: opt.color,
                //lineHeight: opt.lineHeight + '%',
                textAlign: bodyAlign
            });
            page.updateInlineCss('columns');
        } else{
            $('#slide-h-columns, #slide-c-columns').hide();
        }

        /*Section Bottom*/
        $tpl = $('#tpl-section-bottom');
        if( $tpl.length ){
            $('#slide-h-section-bottom').show();
            opt = $tpl.data('json');

            var bodyAlign = opt.textAlign;

            if ( bodyAlign == '0' ){
                bodyAlign = 'left';
            } else if( bodyAlign == '1'){
                bodyAlign = 'center';
            } else if( bodyAlign == '2'){
                bodyAlign = 'right';
            }
            $('#tpl-section-bottom').css({
                backgroundColor: opt.backgroundColor,
                borderTopStyle: opt.borderTopType,
                borderTopWidth: opt.borderTopWidth + 'px',
                borderTopColor: opt.borderTopColor,
                borderBottomStyle: opt.borderBottomType,
                borderBottomWidth: opt.borderBottomWidth + 'px',
                borderBottomColor: opt.borderBottomColor,
                fontFamily: opt.fontTypeFace,
                fontSize: opt.fontSize + 'px',
                fontWeight: opt.fontWeight,
                color: opt.color,
                /*REMOVE JS CODE h1-h4*/ //lineHeight: opt.lineHeight + '%',
                textAlign: bodyAlign
            });
            page.updateInlineCss('sectionBottom');
        } else {
            $('#slide-h-section-bottom, #slide-c-section-bottom').hide();
        }
        /*footer*/
        $tpl = $('#tpl-footer');
        opt = $tpl.data('json');
        
        var footerAlign = opt.textAlign;
        
        if ( footerAlign == '0' ){
            footerAlign = 'left';
        } else if( footerAlign == '1'){
            footerAlign = 'center';
        } else if( footerAlign == '2'){
            footerAlign = 'right';
        }
        $('#tpl-footer').css({
            backgroundColor: opt.backgroundColor,
            borderTopStyle: opt.borderTopType,
            borderTopWidth: opt.borderTopWidth + 'px',
            borderTopColor: opt.borderTopColor,
            borderBottomStyle: opt.borderBottomType,
            borderBottomWidth: opt.borderBottomWidth + 'px',
            borderBottomColor: opt.borderBottomColor,
            fontFamily: opt.fontTypeFace,
            fontSize: opt.fontSize + 'px',
            fontWeight: opt.fontWeight,
            color: opt.color,
            //lineHeight: opt.lineHeight + '%',
            textAlign: footerAlign
        });
        page.updateInlineCss('footer');
    },
    updateInlineCss: function(box){
        var sheets = document.styleSheets;
        var css = null;
        var cssLink = null;
        var cssBox = null;
        var htmlCss = '';
        for (var i in sheets) {
            if(sheets[i].ownerNode){
                if( sheets[i].ownerNode.id === 'stylesheet_email_builder' ){
                    css = sheets[i].cssRules;
                }
            } 
        }
        
        var $tpl = null;
        if (box == 'preheader'){
            $tpl = $('#tpl-preheader');
            cssBox = css[0];
            cssLink = css[1];
        } else if (box == 'header'){
            $tpl = $('#tpl-header');
            cssBox = css[2];
            cssLink = css[3];
        } else if (box == 'body'){
            $tpl = $('#tpl-body');
            cssBox = css[4];
            cssLink = css[5];
        } else if ( box == 'footer'){
            $tpl = $('#tpl-footer');
            cssBox = css[6];
            cssLink = css[7];
        } else if (box == 'columns'){
            $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            cssBox = css[8];
            cssLink = css[9];
        } else if (box == 'sectionBottom'){
            $tpl = $('#tpl-section-bottom');
            cssBox = css[10];
            cssLink = css[11];
        }
        if ( $tpl != null){
            var opt = $tpl.data('json');
            var linkWeight = 'normal';
            var linkDecoration = 'none';
            var textAlign = 'left';
            
            if (opt.linkWeight == '1'){
                linkWeight = 'bold';
            }

            if( opt.linkDecoration == '1' ){
                linkDecoration = 'underline';
            } else if ( opt.linkDecoration == '2'){
                linkDecoration = 'line-through';
            }
            
            if( opt.textAlign == '1' ){
                textAlign = 'center';
            } else if ( opt.textAlign == '2'){
                textAlign = 'right';
            }
            
            cssLink.style.color = opt.linkColor;
            cssLink.style.fontWeight = linkWeight;
            cssLink.style.textDecoration = linkDecoration;
            
            cssBox.style.color = opt.color;
            cssBox.style.lineHeight = opt.lineHeight + '%';
            cssBox.style.fontSize = opt.fontSize + 'px';
            cssBox.style.fontFamily = opt.fontTypeFace.replace (/'/g, '');
            cssBox.style.fontWeight = opt.fontWeight;
            cssBox.style.textAlign = textAlign;
            
            //htmlCss = '<style id="stylesheet_email_builder">';
            htmlCss = '<style id="ll_email_additional_inline_css">\n';
            for (var i = 0; i < css.length; i++) {
                htmlCss += css[i].cssText + '\n';
            }
            htmlCss += '</style>';
            
            page.htmlCss = htmlCss;
            //console.log(htmlCss); //-  htmlCss - add code style email in template.html
        }
    },
	updateLinkStyle: function(){
		var colorLinkPreheader = $('#tpl-preheader').data('json').linkColor;
		var colorLinkHeader = $('#tpl-header').data('json').linkColor;
		var colorLinkBody = $('#tpl-body').data('json').linkColor;
		var colorLinkSectionBottom = $('#tpl-body').data('json').linkColor;
		var colorLinkFooter = $('#tpl-footer').data('json').linkColor;
		
		$('#tpl-preheader .tpl-block-content a').each(function(){
			if (this.style.color == ''){
				this.style.color = colorLinkPreheader;
			}
		});
		
		$('#tpl-header .tpl-block-content a').each(function(){
			if (this.style.color == ''){
				this.style.color = colorLinkHeader;
			}
		});
		
		$('#tpl-body .tpl-block-content a').each(function(){
			if (this.style.color == ''){
				this.style.color = colorLinkBody;
			}
		});
		
		$('#tpl-footer .tpl-block-content a').each(function(){
			if (this.style.color == ''){
				this.style.color = colorLinkFooter;
			}
		});
		$('#tpl-section-bottom .tpl-block-content a').each(function(){
			if (this.style.color == ''){
				this.style.color = colorLinkSectionBottom;
			}
		});
	},
    updatePageDesignOptions: function(){
        var $tpl = $('#bodyTable');
        var opt = $tpl.data('json');
        
        $('#pageBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
		ll_combo_manager.set_selected_value('#pageBorderType', opt.borderTopType);
        $('#pageBorderWidth').val(opt.borderTopWidth);
        $('#pageBorderColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
        
		ll_combo_manager.set_selected_value('#boxBorderType', opt.boxBorderType);
        $('#boxBorderWidth').val(opt.boxBorderWidth);
        $('#boxBorderColor').colpickSetColor(opt.boxBorderColor, true).css('background-color', opt.boxBorderColor);
        
        $('#h1Color').colpickSetColor(opt.h1Color, true).css('background-color', opt.h1Color);
        $('#h2Color').colpickSetColor(opt.h2Color, true).css('background-color', opt.h2Color);
        
        $('#h1ShadowColor').colpickSetColor(opt.h1ShadowColor, true).css('background-color', opt.h1ShadowColor);
        $('#h2ShadowColor').colpickSetColor(opt.h2ShadowColor, true).css('background-color', opt.h2ShadowColor);
        
        $('#h1ShadowX').val(opt.h1ShadowX);
        $('#h1ShadowY').val(opt.h1ShadowY);
        $('#h1ShadowBlur').val(opt.h1ShadowBlur);
        $('#h2ShadowX').val(opt.h2ShadowX);
        $('#h2ShadowY').val(opt.h2ShadowY);
        $('#h2ShadowBlur').val(opt.h2ShadowBlur);
        
        $tpl = $('#tpl-preheader');
        if( $tpl.length ){
	        opt = $tpl.data('json');
	        
	        $('#preheaderBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
			ll_combo_manager.set_selected_value('#preheaderBorderTopType', opt.borderTopType);
	        $('#preheaderBorderTopWidth').val(opt.borderTopWidth);
	        $('#preheaderBorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
			ll_combo_manager.set_selected_value('#preheaderBorderBottomType', opt.borderBottomType);
	        $('#preheaderBorderBottomWidth').val(opt.borderBottomWidth);
	        $('#preheaderBorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);
	        
			ll_combo_manager.set_selected_value('#preheaderTypeFace', opt.fontTypeFace);
			ll_combo_manager.set_selected_value('#preheaderWeight', opt.fontWeight);
			ll_combo_manager.set_selected_value('#preheaderSize', opt.fontSize);
	        $('#preheaderColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
			ll_combo_manager.set_selected_value('#preheaderLineHeight', opt.lineHeight);
	        $('#preheaderAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
	        
	        $('#preheaderLinkColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
			ll_combo_manager.set_selected_value('#preheaderLinkWeight', opt.linkWeight);
			ll_combo_manager.set_selected_value('#preheaderLinkDecoration', opt.linkDecoration);
	        }
        $tpl = $('#tpl-header');
        opt = $tpl.data('json');
        
        $('#headerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
		ll_combo_manager.set_selected_value('#headerBorderTopType', opt.borderTopType);
        $('#headerBorderTopWidth').val(opt.borderTopWidth);
        $('#headerBorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
		ll_combo_manager.set_selected_value('#headerBorderBottomType', opt.borderBottomType);
        $('#headerBorderBottomWidth').val(opt.borderBottomWidth);
        $('#headerBorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);
        
		ll_combo_manager.set_selected_value('#headerTypeFace', opt.fontTypeFace);
		ll_combo_manager.set_selected_value('#headerWeight', opt.fontWeight);
		ll_combo_manager.set_selected_value('#headerSize', opt.fontSize);
        $('#headerColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
		ll_combo_manager.set_selected_value('#headerLineHeight', opt.lineHeight);
        $('#headerAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
        
        $('#headerLinkColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
		ll_combo_manager.set_selected_value('#headerLinkWeight', opt.linkWeight);
		ll_combo_manager.set_selected_value('#headerLinkDecoration', opt.linkDecoration);
        
        $tpl = $('#tpl-body');
        if( $tpl.length ){
	        opt = $tpl.data('json');
	        
	        $('#bodyBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
			ll_combo_manager.set_selected_value('#bodyBorderTopType', opt.borderTopType);
	        $('#bodyBorderTopWidth').val(opt.borderTopWidth);
	        $('#bodyBorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
			ll_combo_manager.set_selected_value('#bodyBorderBottomType', opt.borderBottomType);
	        $('#bodyBorderBottomWidth').val(opt.borderBottomWidth);
	        $('#bodyBorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);
	        
			ll_combo_manager.set_selected_value('#bodyTypeFace', opt.fontTypeFace);
			ll_combo_manager.set_selected_value('#bodyWeight', opt.fontWeight);
			ll_combo_manager.set_selected_value('#bodySize', opt.fontSize);
	        $('#bodyColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
			ll_combo_manager.set_selected_value('#bodyLineHeight', opt.lineHeight);
	        $('#bodyAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
	        
	        $('#bodyLinkColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
			ll_combo_manager.set_selected_value('#bodyLinkWeight', opt.linkWeight);
			ll_combo_manager.set_selected_value('#bodyLinkDecoration', opt.linkDecoration);
        }
        $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
        if( $tpl.length ){
            opt = $tpl.data('json');

            $('#columnBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
			ll_combo_manager.set_selected_value('#columnBorderTopType', opt.borderTopType);
            $('#columnBorderTopWidth').val(opt.borderTopWidth);
            $('#columnBorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
			ll_combo_manager.set_selected_value('#columnBorderBottomType', opt.borderBottomType);
            $('#columnBorderBottomWidth').val(opt.borderBottomWidth);
            $('#columnBorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);

			ll_combo_manager.set_selected_value('#columnTypeFace', opt.fontTypeFace);
			ll_combo_manager.set_selected_value('#columnWeight', opt.fontWeight);
			ll_combo_manager.set_selected_value('#columnSize', opt.fontSize);
            $('#columnColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
			ll_combo_manager.set_selected_value('#columnLineHeight', opt.lineHeight);
            $('#columnAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');

            $('#columnLinkColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
			ll_combo_manager.set_selected_value('#columnLinkWeight', opt.linkWeight);
			ll_combo_manager.set_selected_value('#columnLinkDecoration', opt.linkDecoration);
        }
		$tpl = $('#tpl-section-bottom');
        if( $tpl.length ){
            opt = $tpl.data('json');

            $('#sectionBottomBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
            $('#sectionBottomBorderTopType option[value="'+opt.borderTopType+'"]').attr('selected', true);
            $("#sectionBottomBorderTopType").trigger('liszt:updated');
            $('#sectionBottomBorderTopWidth').val(opt.borderTopWidth);
            $('#sectionBottomBorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
            $('#sectionBottomBorderBottomType option[value="'+opt.borderBottomType+'"]').attr('selected', true);
            $("#sectionBottomBorderBottomType").trigger('liszt:updated');
            $('#sectionBottomBorderBottomWidth').val(opt.borderBottomWidth);
            $('#sectionBottomBorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);

            $('#sectionBottomTypeFace option[value="'+opt.fontTypeFace+'"]').attr('selected', true);
            $("#sectionBottomTypeFace").trigger('liszt:updated');
            $('#sectionBottomWeight option[value="'+opt.fontWeight+'"]').attr('selected', true);
            $("#sectionBottomWeight").trigger('liszt:updated');
            $('#sectionBottomSize option[value="'+opt.fontSize+'"]').attr('selected', true);
            $("#sectionBottomSize").trigger('liszt:updated');
            $('#sectionBottomColor').colpickSetColor(opt.color, true).css('background-color', '#' + opt.color);
            $('#sectionBottomLineHeight option[value="'+opt.lineHeight+'"]').attr('selected', true);
            $("#sectionBottomLineHeight").trigger('liszt:updated');
            $('#sectionBottomAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');

            $('#sectionBottomLinkColor').colpickSetColor(opt.linkColor, true).css('background-color', '#' + opt.linkColor);
            $('#sectionBottomLinkWeight option[value="'+opt.linkWeight+'"]').attr('selected', true);
            $("#sectionBottomLinkWeight").trigger('liszt:updated');
            $('#sectionBottomLinkDecoration option[value="'+opt.linkDecoration+'"]').attr('selected', true);
            $("#sectionBottomLinkDecoration").trigger('liszt:updated');
        }
		
		
        $tpl = $('#tpl-footer');
        opt = $tpl.data('json');
        
        $('#footerBackground').colpickSetColor(opt.backgroundColor, true).css('background-color', opt.backgroundColor);
		ll_combo_manager.set_selected_value('#footerBorderTopType', opt.borderTopType);
        $('#footerBorderTopWidth').val(opt.borderTopWidth);
        $('#footerBorderTopColor').colpickSetColor(opt.borderTopColor, true).css('background-color', opt.borderTopColor);
		ll_combo_manager.set_selected_value('#footerBorderBottomType', opt.borderBottomType);
        $('#footerBorderBottomWidth').val(opt.borderBottomWidth);
        $('#footerBorderBottomColor').colpickSetColor(opt.borderBottomColor, true).css('background-color', opt.borderBottomColor);
        
		ll_combo_manager.set_selected_value('#footerTypeFace', opt.fontTypeFace);
		ll_combo_manager.set_selected_value('#footerWeight', opt.fontWeight);
		ll_combo_manager.set_selected_value('#footerSize', opt.fontSize);
        $('#footerColor').colpickSetColor(opt.color, true).css('background-color', opt.color);
		ll_combo_manager.set_selected_value('#footerLineHeight', opt.lineHeight);
        $('#footerAlign li').removeClass('selected').eq(opt.textAlign).addClass('selected');
        
        $('#footerLinkColor').colpickSetColor(opt.linkColor, true).css('background-color', opt.linkColor);
		ll_combo_manager.set_selected_value('#footerLinkWeight', opt.linkWeight);
		ll_combo_manager.set_selected_value('#footerLinkDecoration', opt.linkDecoration);
    },
    update_font_family: function (_item_selector, _selected_font, _font_drop_down){
        if(_selected_font == "None" || _selected_font == ''){
            $tpl.find('.ebTextContent').css('font-family','');
        } else {
        	if (typeof _font_drop_down != 'undefined' && _font_drop_down && $(_font_drop_down).length == 1) {
        		var standard_font = $(_font_drop_down).find('option[value="' + _selected_font + '"]').attr ('standard_font');
        		if (typeof standard_font != 'undefined' && standard_font && standard_font == 1) {
        			if (_selected_font.indexOf ("'") == -1) {
                		_selected_font = "'" + _selected_font + "'"
                	}
            		_selected_font = _selected_font + ', sans-serif'
        		}
        	} else if (_selected_font.indexOf (',') == -1) {
        		_selected_font = _selected_font + ', sans-serif'
        	}
        	_selected_font = _selected_font.replace (/'/g, '')
            $(_item_selector).css('font-family',_selected_font);
        }
    },
    updateIndividualElTpl: function(){
        var $tpl = null;
        var opt = null;
        
        function updateInfElTpl(){
            $tpl = $('.tpl-block.tpl-selected');
            opt = $tpl.data('json');
        }
        
        /*Text Box or Text Border Box or Footer Box*/
        $('#boxTextTypeFace').change(function(){
            updateInfElTpl();
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl.find('.ebTextContent'), opt.fontTypeFace, $(this));
            /*
            if(opt.fontTypeFace == "None"){
                $tpl.find('.ebTextContent').css('font-family','');
            } else {
                $tpl.find('.ebTextContent').css('font-family',opt.fontTypeFace + ', sans-serif');
            }
            */
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#boxTextWeight').change(function(){
            updateInfElTpl();
            
            opt.fontWeight = $(this).val();
            $tpl.find('.ebTextContent').css('font-weight',opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#boxTextSize').change(function(){
            updateInfElTpl();
            
            opt.fontSize = $(this).val();
            $tpl.find('.ebTextContent').css('font-size',opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#boxTextLineHeight').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            
            opt.lineHeight = val;
            if (val == 'None'){
                $tpl.find('.ebTextContent').css('line-height','normal');
            }else{
                $tpl.find('.ebTextContent').css('line-height',opt.lineHeight + '%');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#boxTextAlign li').on('click', function(){
            updateInfElTpl();
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.find('.ebTextContent').css('text-align','left');
            } else if(index == 1){
                $tpl.find('.ebTextContent').css('text-align','center');
            } else if (index == 2){
                $tpl.find('.ebTextContent').css('text-align','right');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#boxTextBorderWidth').on('change', function () {
            updateInfElTpl();
            
            opt.boxesBorderWidth = $(this).val();
            $tpl.find('.ebTextContentContainer .ebTextContent').css('border-width',opt.boxesBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#boxTextBorderType').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.boxesBorderType = val;
            if (val == 'None'){
                $tpl.find('.ebTextContentContainer .ebTextContent').css('border-style','');
            } else{
                $tpl.find('.ebTextContentContainer .ebTextContent').css('border-style',opt.boxesBorderType.toLowerCase());
            }
            $tpl.find('.ebTextContentContainer .ebTextContent').css('border-color',opt.boxesBorderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('.two-text-editor ul li a, .two-caption-editor ul li a').on('click', function(e){
            e.preventDefault();
            updateInfElTpl();
   
            var $li = $(this).parent();
            var $box = $li.parents('.two-text-editor, .two-caption-editor');
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            $box.find('.eb-text-column, .eb-caption-column').hide().eq(index).show();

			page.resizeTinymce();
        });
        
        $('#numberColumnBoxText').change(function(){
            updateInfElTpl();
            
            var $split = $('#splitColumnBoxText');
            var val = $(this).val();

            if ( val == 1){
                $split.show();
				$split.find('.eb-list-layout li').show().eq(3).hide();
                $('#splitColumnBoxText ul li').eq(0).addClass('selected').siblings('li').removeClass('selected');
            } else if ( val == 2){
				$split.show();
				$split.find('.eb-list-layout li').hide().eq(3).show();
                $('#splitColumnBoxText ul li').eq(3).addClass('selected').siblings('li').removeClass('selected');
            } else {
                $split.hide();
            }
            if (opt.columnSplit != val){
                
                opt.columnSplit = val;
                opt.columnSplitType = 0;
                $tpl.attr('data-json', JSON.stringify( opt ));

                if ( val == 1){
                    page.removeColumnTextTpl(2);
					page.addColumnTextTpl(2);
                } else if ( val == 2){
					opt.columnSplitType = 3;
					$tpl.attr('data-json', JSON.stringify( opt ));
                    page.addColumnTextTpl(3);
				} else {
                    page.removeColumnTextTpl(1);
                }
                
                //@todo check this...
                opt.columnSplit = val;
                opt.columnSplitType = 0;
                $tpl.attr('data-json', JSON.stringify( opt ));
                page.updateColumnEditor(opt);
            }
        });
        $('#splitColumnBoxText ul li').on('click', function(){
            updateInfElTpl();
            
            $(this).addClass('selected').siblings('li').removeClass('selected');
            var index = $(this).index();
            
            opt.columnSplitType = index;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.updateColumnTextTpl();
        });
        

        /*Divider*/
        $('#dividerBorderType').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.borderType = val;
            if (val == 'None'){
                $tpl.find('.ebDividerContent').css('border-top-style','');
            } else{
                $tpl.find('.ebDividerContent').css('border-top-style',opt.borderType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#dividerBorderWidth').change(function(){
            updateInfElTpl();
            opt.borderWidth = $(this).val();
            $tpl.find('.ebDividerContent').css('border-top-width', opt.borderWidth + "px");
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#dividerPaddingTop').change(function(){
            updateInfElTpl();
            
            opt.paddingTop = $(this).val();
            $tpl.find('.ebDividerBlockInner').css('padding-top', opt.paddingTop + "px");
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#dividerPaddingBottom').change(function(){
            updateInfElTpl();
            opt.paddingBottom = $(this).val();
            $tpl.find('.ebDividerBlockInner').css('padding-bottom', opt.paddingBottom + "px");
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Buttons*/
		ll_combo_manager.event_on_change('#button_link_to', function(){
            updateInfElTpl();
            
            $('#label_btn_link_to').html ('Web Address (URL)');
			var button_link_to = ll_combo_manager.get_selected_value('#button_link_to');
			
			$('#container_button_lp').hide ();
			$('#container_button_trackable_content').hide ();
			switch (button_link_to) {
				case 'url':
					$('#buttonUrl').trigger ('change')
					break;
				case 'mail':
		            $('#label_btn_link_to').html ('Email Address');
					$('#buttonUrl').trigger ('change')
					break;
				case 'lp':
		            $('#label_btn_link_to').html ('Landing Page URL');
					$('#container_button_lp').show ();
		            page.process_load_landing_pages(function (){
		            	if (page.landing_pages.length > 0) {
		            		ll_combo_manager.clear_all('#select_button_landing_page');
	            			ll_combo_manager.add_option('#select_button_landing_page', '', '')
		            		for (var i in page.landing_pages){
		            			var lp = page.landing_pages [i];
		            			ll_combo_manager.add_option('#select_button_landing_page', lp.url, lp.name)
		            		}
		            	}
		            });
					break;
				case 'content':
		            $('#label_btn_link_to').html ('Content URL');
					$('#container_button_trackable_content').show ();

		            page.process_load_files(function (){
		            	if (page.files.length > 0) {
		            		ll_combo_manager.clear_all('#select_button_file');
	            			ll_combo_manager.add_option('#select_button_file', '', '')
		            		for (var i in page.files){
		            			var file = page.files [i];
		            			ll_combo_manager.add_option('#select_button_file', file.url, file.name)
		            		}
		            	}
		            });
					break;
			}
		});
		ll_combo_manager.event_on_change('#select_button_landing_page', function(){
            updateInfElTpl();
            
			var url = ll_combo_manager.get_selected_value('#select_button_landing_page');
			if (url && url != '') {
				$('#buttonUrl').val (url)
				$('#buttonUrl').trigger ('change')
			}
		});
		ll_combo_manager.event_on_change('#select_button_file', function(){
            updateInfElTpl();
            
			var url = ll_combo_manager.get_selected_value('#select_button_file');
			if (url && url != '') {
				$('#buttonUrl').val (url)
				$('#buttonUrl').trigger ('change')
			}
		});
        $('#buttonText').on('keyup change', function(){
            updateInfElTpl();
            opt.buttonText = $(this).val();
            $tpl.find('.ebButton').text(opt.buttonText);
            $tpl.find('.ebButton').attr('alt', opt.buttonText);
            $tpl.find('.ebButton').attr('title', opt.buttonText);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonUrl').on('keyup change', function(){
            updateInfElTpl();
			var button_link_to = ll_combo_manager.get_selected_value('#button_link_to');
			if (button_link_to == 'mail') {
	            opt.url = 'mailto:' + $(this).val();
			} else {
	            opt.url = $(this).val();
			}
            $tpl.find('.ebButton').attr('href',opt.url);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonTypeFace').change(function(){
            updateInfElTpl();
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl.find('.ebButtonContent'), opt.fontTypeFace, $(this));
            page.update_font_family ($tpl.find('.ebButtonContent .ebButton'), opt.fontTypeFace, $(this));
            /*
            if(opt.fontTypeFace == "None"){
                $tpl.find('.ebButtonContent').css('font-family','');
                $tpl.find('.ebButtonContent .ebButton').css('font-family','');
            } else{
                $tpl.find('.ebButtonContent').css('font-family',opt.fontTypeFace + ', sans-serif');
                $tpl.find('.ebButtonContent .ebButton').css('font-family',opt.fontTypeFace + ', sans-serif');
            }
            */
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonWeight').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.fontWeight = val;
            if (val == 'None'){
                $tpl.find('.ebButton').css('font-weight','');
            } else{
                $tpl.find('.ebButton').css('font-weight',opt.fontWeight);
            }
            
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonSize').change(function(){
            updateInfElTpl();
            opt.fontSize = $(this).val();
            $tpl.find('.ebButtonContent').css('font-size',opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonBorderWidth').on('change', function () {
            updateInfElTpl();
            opt.borderWidth = $(this).val();
            $tpl.find('.ebButtonContentContainer').css('border-width',opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonBorderType').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.boxesBorderType = val;
            if (val == 'None'){
                $tpl.find('.ebButtonContentContainer').css('border-style','');
            } else{
                $tpl.find('.ebButtonContentContainer').css('border-style',opt.boxesBorderType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonRadius').on('change', function () {
            updateInfElTpl();
            opt.radius = $(this).val();
            $tpl.find('.ebButtonContentContainer').css('border-radius',opt.radius + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonPadding').on('change', function () {
            updateInfElTpl();
            opt.padding = $(this).val();
            $tpl.find('.ebButtonContent').css('padding',opt.padding + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonAlign').on('change', function () {
            updateInfElTpl();
            var val = $(this).val();
            var $el = $tpl.find('.ebButtonBlockInner');
            opt.align = val;
            if (val == 0){
                $el.attr('align','left').find('td').attr('align','left');
            } else if ( val == 1 ){
                $el.attr('align','center').find('td').attr('align','center');
            } else{
                $el.attr('align','right').find('td').attr('align','right');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonVAlign').on('change', function () {
            updateInfElTpl();
            var val = $(this).val();
            var $el = $tpl.find('.ebButtonBlockInner');
            opt.vAlign = val;
            
            if (val == 0){
                $el.css('padding','0 18px 18px');
            } else if ( val == 1 ){
                $el.css('padding','9px 18px');
            } else{
                $el.css('padding','18px 18px 0');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#buttonWidth').on('change', function () {
            updateInfElTpl();
            var val = $(this).val();
            var $el = $tpl.find('.ebButtonContentContainer');
            opt.width = val;
            if (val == 0){
                $el.attr('width','');
            } else if ( val == 1 ){
                $el.attr('width','100%');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Image*/
        $('#imageAlign').on('change', function () {
            updateInfElTpl();
            var val = $(this).val();
            var $el = $tpl.find('.ebImageContent');
            opt.align = val;
            if (val == 0){
                $el.css('text-align','left').attr('align','left').find('img').attr('align','left');
            } else if ( val == 1 ){
                $el.css('text-align','center').attr('align','center').find('img').attr('align','center');
            } else{
                $el.css('text-align','right').attr('align','right').find('img').attr('align','right');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Image Group*/
        $('#imgColumnGroup .eb-list-layout li').on('click', function(){
            var $tpl = $('.tpl-block.tpl-selected');
            var opt = $tpl.data('json');
            opt.layoutIndex = $(this).attr('data-index');
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.positionImagesGroup(opt.layoutIndex);
            $(this).addClass('selected').siblings('li').removeClass('selected');
            page.updateWidthImgs();
        });
        
        /*Image Card*/
        $('#cardTypeFace, #videoTypeFace').change(function(){
            updateInfElTpl();
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl.find('.ebTextContent'), opt.fontTypeFace, $(this));
            /*
            if(opt.fontTypeFace == "None"){
                $tpl.find('.ebTextContent').css('font-family','');
            } else{
                $tpl.find('.ebTextContent').css('font-family',opt.fontTypeFace + ', sans-serif');
            }
            */
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardWeight, #videoWeight').change(function(){
            updateInfElTpl();
            
            opt.fontWeight = $(this).val();
            $tpl.find('.ebTextContent').css('font-weight',opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardSize, #videoSize').change(function(){
            updateInfElTpl();
            
            opt.fontSize = $(this).val();
            $tpl.find('.ebTextContent').css('font-size',opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardLineHeight, #videoLineHeight').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            
            opt.lineHeight = val;
            if (val == 'None'){
                $tpl.find('.ebTextContent').css('line-height','normal');
            }else{
                $tpl.find('.ebTextContent').css('line-height',opt.lineHeight + '%');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardTextAlign li, #videoTextAlign li').on('click', function(){
            updateInfElTpl();
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.find('.ebTextContent').css('text-align','left');
            } else if(index == 1){
                $tpl.find('.ebTextContent').css('text-align','center');
            } else if (index == 2){
                $tpl.find('.ebTextContent').css('text-align','right');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardBorderWidth, #videoBorderWidth').on('change', function () {
            updateInfElTpl();
            
            opt.borderWidth = $(this).val();
            $tpl.find('.ebImageBlock').css('border-width',opt.borderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardBorderType, #videoBorderType').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.borderType = val;
            if (val == 'None'){
                $tpl.find('.ebImageBlock').css('border-style','');
            } else{
                $tpl.find('.ebImageBlock').css('border-style',opt.borderType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#cardPosition').change(function(){
            updateInfElTpl();
            opt.position = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.captionPosition(opt.position);
            page.updateImageEdge($('#image-edge-card'));
            page.updateWidthImgs();
        });
        $('#videoPosition').change(function(){
            updateInfElTpl();
            opt.position = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.captionPosition(opt.position);
            page.updateImageEdge($('#image-edge-video'));
            page.updateWidthImgs();
        });
        $('#cardImgAlignment, #videoImgAlignment').change(function(){
            updateInfElTpl();
            opt.imgAlignment = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.alignmentImg();
        });
        $('#cardCaptionWidth, #videoCaptionWidth').change(function(){
            updateInfElTpl();
            opt.captionWidth = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
           page.captionWidthImg();
           page.updateWidthImgs();
        });
        
        $('#image-edge, #image-edge-card, #image-edge-video').change(function(){
            page.isImageEdge($(this));
        });
        /*Image Caption*/
        $('#captionTypeFace').change(function(){
            updateInfElTpl();
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl.find('.ebTextContent'), opt.fontTypeFace, $(this));
            /*
            if(opt.fontTypeFace == "None"){
                $tpl.find('.ebTextContent').css('font-family','');
            } else{
                $tpl.find('.ebTextContent').css('font-family',opt.fontTypeFace + ', sans-serif');
            }
            */
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#captionWeight').change(function(){
            updateInfElTpl();
            
            opt.fontWeight = $(this).val();
            $tpl.find('.ebTextContent').css('font-weight',opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#captionSize').change(function(){
            updateInfElTpl();
            
            opt.fontSize = $(this).val();
            $tpl.find('.ebTextContent').css('font-size',opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#captionLineHeight').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            
            opt.lineHeight = val;
            if (val == 'None'){
                $tpl.find('.ebTextContent').css('line-height','normal');
            }else{
                $tpl.find('.ebTextContent').css('line-height',opt.lineHeight + '%');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#captionTextAlign li').on('click', function(){
            updateInfElTpl();
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.find('.ebTextContent').css('text-align','left');
            } else if(index == 1){
                $tpl.find('.ebTextContent').css('text-align','center');
            } else if (index == 2){
                $tpl.find('.ebTextContent').css('text-align','right');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#captionPosition').change(function(){
            updateInfElTpl();
            opt.position = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.captionPosition(opt.position);
            page.updateWidthImgs();
        });
        $('#captionImgAlignment').change(function(){
            updateInfElTpl();
            opt.imgAlignment = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.alignmentImg();
        });
        $('#captionCaptionWidth').change(function(){
            updateInfElTpl();
            opt.captionWidth = $(this).val();
            $tpl.attr('data-json', JSON.stringify( opt ));
           page.captionWidthImg();
           page.updateWidthImgs();
        });
        $('#captionNumber').change(function(){
            updateInfElTpl();
            
            var val = $(this).val();
            
            if ( val == 1){
                page.addColumnCaptionTpl();
            } else {
                page.removeColumnCaptionTpl();
            }
            
            opt.number = val;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.updateColumnEditorCaption(opt);
        });
        
        $('#pageBorderWidth').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            opt.borderTopWidth = $(this).val();
            $tpl.css('borderTopWidth',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#pageBorderType').change(function(){
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            opt.borderTopType = $(this).val();
            $tpl.css('borderTopStyle',opt.borderTopType);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#boxBorderWidth').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            opt.boxBorderWidth = $(this).val();
            $('#templateContainerWrap').css('borderWidth',opt.boxBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
			( opt.boxBorderType != 'None' ) ? page.callCaptionWidthImg() : null;
        });
        $('#boxBorderType').change(function(){
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            opt.boxBorderType = $(this).val();
            $('#templateContainerWrap').css('borderStyle',opt.boxBorderType);
            $tpl.attr('data-json', JSON.stringify( opt ));
			page.callCaptionWidthImg();
        });
        
        /*Social*/
        
        $('#containerSocialBorderType').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.containerBorderType = val;
            if (val == 'None'){
                $tpl.find('.ebShareContent').css('border-style','');
            } else{
                $tpl.find('.ebShareContent').css('border-style',opt.containerBorderType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#containerSocialBorderWidth').on('change', function () {
            updateInfElTpl();
            
            opt.containerBorderWidth = $(this).val();
            $tpl.find('.ebShareContent').css('border-width',opt.containerBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
		$('#containerSocialPadding').on('change', function () {
			updateInfElTpl();

			opt.containerPadding = $(this).val();
			$tpl.find('.ebShareBlockInner').css('padding',opt.containerPadding + 'px');
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
        $('#btnSocialBorderType').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            opt.btnBorderType = val;
            if (val == 'None'){
                $tpl.find('.ebShareContentItem').css('border-style','');
            } else{
                $tpl.find('.ebShareContentItem').css('border-style',opt.btnBorderType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialBorderWidth').on('change', function () {
            updateInfElTpl();
            
            opt.btnBorderWidth = $(this).val();
            $tpl.find('.ebShareContentItem').css('border-width',opt.btnBorderWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialBorderRadius').on('change', function () {
            updateInfElTpl();
            
            opt.btnBorderRadius = $(this).val();
            $tpl.find('.ebShareContentItem').css('border-radius',opt.btnBorderRadius + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialTypeFace').change(function(){
            updateInfElTpl();
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl.find('.mcnShareTextContent'), opt.fontTypeFace, $(this));
            /*
            if(opt.fontTypeFace == "None"){
                 $tpl.find('.mcnShareTextContent > a').css('font-family','');
            } else{
                 $tpl.find('.mcnShareTextContent > a').css('font-family',opt.fontTypeFace + ', sans-serif');
            }
            */
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialWeight').change(function(){
            updateInfElTpl();
            
            opt.fontWeight = $(this).val();
            $tpl.find('.mcnShareTextContent > a').css('font-weight',opt.fontWeight);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialSize').change(function(){
            updateInfElTpl();
            
            opt.fontSize = $(this).val();
            $tpl.find('.mcnShareTextContent > a').css('font-size',opt.fontSize + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialLineHeight').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            
            opt.lineHeight = val;
            if (val == 'None'){
                $tpl.find('.mcnShareTextContent > a').css('line-height','normal');
            }else{
                $tpl.find('.mcnShareTextContent > a').css('line-height',opt.lineHeight + '%');
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#btnSocialAlign').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            
            if ( val == 0){
                $tpl.find('.ebShareBlockInner').attr('align','left');
                $tpl.find('.ebShareContentInner').attr('align','left').children('table').css({
                    display: 'inline-table',
                    verticalAlign: 'top'
                });
            } else if( val == 1){
                $tpl.find('.ebShareBlockInner').attr('align','center');
                $tpl.find('.ebShareContentInner').attr('align','center').children('table').css({
                    display: 'inline-table',
                    verticalAlign: 'top'
                });
            } else {
                $tpl.find('.ebShareBlockInner').attr('align','right');
                $tpl.find('.ebShareContentInner').attr('align','right').children('table').css({
                    display: 'inline-table',
                    verticalAlign: 'top'
                });
            }
            opt.align = val;
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialWidth').change(function(){
            updateInfElTpl();
            var val = $(this).val();

            if ( val == 0){
                if( opt.layout == '0' || opt.layout == '1'){
                    $tpl.find('.ebShareContent').attr('width','0').css('width','0');
                } else {
                    $tpl.find('.ebShareContent').attr('width','auto').css('width','auto');
                }
            } else {
                $tpl.find('.ebShareContent').attr('width','100%').css('width','100%');
            }
            opt.width = val;
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#btnSocialDisplay').change(function(){
            updateInfElTpl();
            var val = $(this).val();
            var displayOld = opt.display;
            var eqIndex = 0;
            
            opt.display = val;
            $tpl.attr('data-json', JSON.stringify( opt ));

            $('.eb-wrap-layout-social').hide();
            if( opt.display == '0' ){
                if (displayOld == '2' || displayOld == '0'){
                    eqIndex = opt.layout;
                } else {
                    if (opt.layout == '1'){
                        eqIndex = 2;
                    } else {
                        eqIndex = 1;
                    }
                }
                $('.eb-wrap-layout-social.iconOnly').show().find('li').eq(eqIndex).trigger('click');
            } else if( opt.display == '1' ){
                if (opt.layout == '2' || opt.layout == '3'){
                    eqIndex = 1;
                }
                $('.eb-wrap-layout-social.textOnly').show().find('li').eq(eqIndex).trigger('click');
            } else {
                if (displayOld == '2' || displayOld == '0'){
                    eqIndex = opt.layout;
                } else {
                    if (opt.layout == '1'){
                        eqIndex = 2;
                    } else {
                        eqIndex = 1;
                    }
                }
                $('.eb-wrap-layout-social.iconAndText').show().find('li').eq(eqIndex).trigger('click');
            }
        });
        $('.eb-social-style-icon li').on('click', function(){
            updateInfElTpl();
            var index = $(this).index();
            var $li = $(this);
            $li.addClass('selected').siblings('li').removeClass('selected');
            var colors = ['black','black_border','border','color','gray','white'];
            
            
            $tpl.find('.mcnShareIconContent > a').each(function(i){
                var src = $(this).find('img').attr('src');
                src = src.split('/'+colors[opt.styleIcon]+'/').join('/'+colors[index]+'/');
                $(this).find('img').attr('src', src);
            });
            
            opt.styleIcon = index;
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        /*
        $('#eb-fb-link').on('keyup',function(){
            updateInfElTpl();
            var val = $(this).val();
            $tpl.find('.mcnShareIconContent:eq(0), .mcnShareTextContent:eq(0)').find('a').attr('href',val);
        });
        $('#eb-tw-link').on('keyup',function(){
            updateInfElTpl();
            var val = $(this).val();
            $tpl.find('.mcnShareIconContent:eq(1), .mcnShareTextContent:eq(1)').find('a').attr('href',val);
        });
        $('#eb-in-link').on('keyup',function(){
            updateInfElTpl();
            var val = $(this).val();
            $tpl.find('.mcnShareIconContent:eq(2), .mcnShareTextContent:eq(2)').find('a').attr('href',val);
        });
        $('#eb-gg-link').on('keyup',function(){
            updateInfElTpl();
            var val = $(this).val();
            $tpl.find('.mcnShareIconContent:eq(3), .mcnShareTextContent:eq(3)').find('a').attr('href',val);
        });
        
        $('#eb-check-fb').on('click', function(){
            updateInfElTpl();
            var val = $(this).is(':checked');
                
            if (val){
                $tpl.find('.ebShareContentItemContainer > table:eq(0)').show();
                opt.lnk1 = 1;
            } else {
                $tpl.find('.ebShareContentItemContainer > table:eq(0)').hide();
                opt.lnk1 = 0;
            }
            
            $tpl.attr('data-json', JSON.stringify( opt ));
			page.updateSocialHtmlBtn();
        });
        $('#eb-check-tw').on('click', function(){
            updateInfElTpl();
            var val = $(this).is(':checked');
                
            if (val){
                $tpl.find('.ebShareContentItemContainer > table:eq(1)').show();
                opt.lnk2 = 1;
            } else {
                $tpl.find('.ebShareContentItemContainer > table:eq(1)').hide();
                opt.lnk2 = 0;
            }
            
            $tpl.attr('data-json', JSON.stringify( opt ));
			page.updateSocialHtmlBtn();
        });
        $('#eb-check-in').on('click', function(){
            updateInfElTpl();
            var val = $(this).is(':checked');
                
            if (val){
                $tpl.find('.ebShareContentItemContainer > table:eq(2)').show();
                opt.lnk3 = 1;
            } else {
                $tpl.find('.ebShareContentItemContainer > table:eq(2)').hide();
                opt.lnk3 = 0;
            }
            
            $tpl.attr('data-json', JSON.stringify( opt ));
			page.updateSocialHtmlBtn();
        });
        $('#eb-check-gg').on('click', function(){
            updateInfElTpl();
            var val = $(this).is(':checked');
                
            if (val){
                $tpl.find('.ebShareContentItemContainer > table:eq(3)').show();
                opt.lnk4 = 1;
            } else {
                $tpl.find('.ebShareContentItemContainer > table:eq(3)').hide();
                opt.lnk4 = 0;
            }
            
            $tpl.attr('data-json', JSON.stringify( opt ));
			page.updateSocialHtmlBtn();
        });
        */
        $('#h1ShadowX').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            
            opt.h1ShadowX = $(this).val();
            var h1Shadow = opt.h1ShadowX + 'px ' + opt.h1ShadowY + 'px ' + opt.h1ShadowBlur + 'px ' + opt.h1ShadowColor;
            $('.eb-h1> span').css('text-shadow',h1Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#h1ShadowY').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            
            opt.h1ShadowY = $(this).val();
            var h1Shadow = opt.h1ShadowX + 'px ' + opt.h1ShadowY + 'px ' + opt.h1ShadowBlur + 'px ' + opt.h1ShadowColor;
            $('.eb-h1> span').css('text-shadow',h1Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#h1ShadowBlur').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            
            opt.h1ShadowBlur = $(this).val();
            var h1Shadow = opt.h1ShadowX + 'px ' + opt.h1ShadowY + 'px ' + opt.h1ShadowBlur + 'px ' + opt.h1ShadowColor;
            $('.eb-h1> span').css('text-shadow',h1Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#h2ShadowX').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            
            opt.h2ShadowX = $(this).val();
            var h2Shadow = opt.h2ShadowX + 'px ' + opt.h2ShadowY + 'px ' + opt.h2ShadowBlur + 'px ' + opt.h2ShadowColor;
            $('.eb-h2> span').css('text-shadow',h2Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#h2ShadowY').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            
            opt.h2ShadowY = $(this).val();
            var h2Shadow = opt.h2ShadowX + 'px ' + opt.h2ShadowY + 'px ' + opt.h2ShadowBlur + 'px ' + opt.h2ShadowColor;
            $('.eb-h2> span').css('text-shadow',h2Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#h2ShadowBlur').on('change', function () {
            var $tpl = $('#bodyTable');
            var opt = $tpl.data('json');
            
            opt.h2ShadowBlur = $(this).val();
            var h2Shadow = opt.h2ShadowX + 'px ' + opt.h2ShadowY + 'px ' + opt.h2ShadowBlur + 'px ' + opt.h2ShadowColor;
            $('.eb-h2> span').css('text-shadow',h2Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Preheader*/
        $('#preheaderBorderTopType').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderTopType = val;
            if (val == 'None'){
                $tpl.css('border-top-style','');
            } else{
                $tpl.css('border-top-style',opt.borderTopType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderBorderTopWidth').on('change', function () {
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            
            opt.borderTopWidth = $(this).val();
            $tpl.css('border-top-width',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderBorderBottomType').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderBottomType = val;
            if (val == 'None'){
                $tpl.css('border-bottom-style','');
            } else{
                $tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderBorderBottomWidth').on('change', function () {
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            
            opt.borderBottomWidth = $(this).val();
            $tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderTypeFace').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl, opt.fontTypeFace, $(this));
            /*
            $tpl.css('font-family',opt.fontTypeFace + ', sans-serif');
            */
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderWeight').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight',opt.fontWeight);
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderSize').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            
            opt.fontSize = $(this).val();
            $tpl.css('font-size',opt.fontSize + 'px');
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderLineHeight').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.lineHeight = val;
            /*
            if (val == 'None'){
                $tpl.css('line-height','normal');
            }else{
                $tpl.css('line-height',opt.lineHeight + '%');
            }
            */
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderAlign li').on('click', function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.css('text-align','left');
            } else if(index == 1){
                $tpl.css('text-align','center');
            } else if (index == 2){
                $tpl.css('text-align','right');
            }
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#preheaderLinkWeight').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            
            opt.linkWeight = $(this).val();
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#preheaderLinkDecoration').change(function(){
            var $tpl = $('#tpl-preheader');
            var opt = $tpl.data('json');
            opt.linkDecoration = $(this).val();
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Header box*/
        $('#headerBorderTopType').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderTopType = val;
            if (val == 'None'){
                $tpl.css('border-top-style','');
            } else{
                $tpl.css('border-top-style',opt.borderTopType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerBorderTopWidth').on('change', function () {
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            
            opt.borderTopWidth = $(this).val();
            $tpl.css('border-top-width',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerBorderBottomType').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderBottomType = val;
            if (val == 'None'){
                $tpl.css('border-bottom-style','');
            } else{
                $tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerBorderBottomWidth').on('change', function () {
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            
            opt.borderBottomWidth = $(this).val();
            $tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerTypeFace').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl, opt.fontTypeFace, $(this));
            /*
            $tpl.css('font-family',opt.fontTypeFace + ', sans-serif');
            */
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerWeight').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight',opt.fontWeight);
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerSize').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            
            opt.fontSize = $(this).val();
            $tpl.css('font-size',opt.fontSize + 'px');
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerLineHeight').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.lineHeight = val;
            /*
            if (val == 'None'){
                $tpl.css('line-height','normal');
            }else{
                $tpl.css('line-height',opt.lineHeight + '%');
            }
            */
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerAlign li').on('click', function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.css('text-align','left');
            } else if(index == 1){
                $tpl.css('text-align','center');
            } else if (index == 2){
                $tpl.css('text-align','right');
            }
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#headerLinkWeight').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            
            opt.linkWeight = $(this).val();
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#headerLinkDecoration').change(function(){
            var $tpl = $('#tpl-header');
            var opt = $tpl.data('json');
            opt.linkDecoration = $(this).val();
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Body box*/
        $('#bodyBorderTopType').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderTopType = val;
            if (val == 'None'){
                $tpl.css('border-top-style','');
            } else{
                $tpl.css('border-top-style',opt.borderTopType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyBorderTopWidth').on('change', function () {
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            
            opt.borderTopWidth = $(this).val();
            $tpl.css('border-top-width',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyBorderBottomType').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderBottomType = val;
            if (val == 'None'){
                $tpl.css('border-bottom-style','');
            } else{
                $tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyBorderBottomWidth').on('change', function () {
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            
            opt.borderBottomWidth = $(this).val();
            $tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyTypeFace').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl, opt.fontTypeFace, $(this));
            /*
            $tpl.css('font-family',opt.fontTypeFace + ', sans-serif');
            */
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyWeight').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight',opt.fontWeight);
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodySize').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            
            opt.fontSize = $(this).val();
            $tpl.css('font-size',opt.fontSize + 'px');
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyLineHeight').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.lineHeight = val;
            /*
            if (val == 'None'){
                $tpl.css('line-height','normal');
            }else{
                $tpl.css('line-height',opt.lineHeight + '%');
            }
            */
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyAlign li').on('click', function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.css('text-align','left');
            } else if(index == 1){
                $tpl.css('text-align','center');
            } else if (index == 2){
                $tpl.css('text-align','right');
            }
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#bodyLinkWeight').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            
            opt.linkWeight = $(this).val();
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#bodyLinkDecoration').change(function(){
            var $tpl = $('#tpl-body');
            var opt = $tpl.data('json');
            opt.linkDecoration = $(this).val();
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        /*Column box*/
        $('#columnBorderTopType').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderTopType = val;
            if (val == 'None'){
                $tpl.css('border-top-style','');
            } else{
                $tpl.css('border-top-style',opt.borderTopType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnBorderTopWidth').on('change', function () {
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            
            opt.borderTopWidth = $(this).val();
            $tpl.css('border-top-width',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnBorderBottomType').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderBottomType = val;
            if (val == 'None'){
                $tpl.css('border-bottom-style','');
            } else{
                $tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnBorderBottomWidth').on('change', function () {
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            
            opt.borderBottomWidth = $(this).val();
            $tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnTypeFace').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl, opt.fontTypeFace, $(this));
            /*
            $tpl.css('font-family',opt.fontTypeFace + ', sans-serif');
            */
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnWeight').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight',opt.fontWeight);
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnSize').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            
            opt.fontSize = $(this).val();
            $tpl.css('font-size',opt.fontSize + 'px');
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnLineHeight').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.lineHeight = val;
			/*REMOVE JS CODE h1-h4*/
            /*if (val == 'None'){
                $tpl.css('line-height','normal');
            }else{
                $tpl.css('line-height',opt.lineHeight + '%');
            }*/
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnAlign li').on('click', function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.css('text-align','left');
            } else if(index == 1){
                $tpl.css('text-align','center');
            } else if (index == 2){
                $tpl.css('text-align','right');
            }
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#columnLinkWeight').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            
            opt.linkWeight = $(this).val();
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#columnLinkDecoration').change(function(){
            var $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            var opt = $tpl.data('json');
            opt.linkDecoration = $(this).val();
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
		/*Section Bottom*/
        $('#sectionBottomBorderTopType').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderTopType = val;
            if (val == 'None'){
                $tpl.css('border-top-style','');
            } else{
                $tpl.css('border-top-style',opt.borderTopType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomBorderTopWidth').on('change', function () {
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            
            opt.borderTopWidth = $(this).val();
            $tpl.css('border-top-width',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomBorderBottomType').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderBottomType = val;
            if (val == 'None'){
                $tpl.css('border-bottom-style','');
            } else{
                $tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomBorderBottomWidth').on('change', function () {
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            
            opt.borderBottomWidth = $(this).val();
            $tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomTypeFace').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            
            opt.fontTypeFace = $(this).val();
            $tpl.css('font-family',opt.fontTypeFace + ', sans-serif');
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomWeight').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight',opt.fontWeight);
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomSize').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            
            opt.fontSize = $(this).val();
            $tpl.css('font-size',opt.fontSize + 'px');
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomLineHeight').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.lineHeight = val;
			/*REMOVE JS CODE h1-h4*/
            /*if (val == 'None'){
                $tpl.css('line-height','normal');
            }else{
                $tpl.css('line-height',opt.lineHeight + '%');
            }*/
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomAlign li').on('click', function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.css('text-align','left');
            } else if(index == 1){
                $tpl.css('text-align','center');
            } else if (index == 2){
                $tpl.css('text-align','right');
            }
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#sectionBottomLinkWeight').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            
            opt.linkWeight = $(this).val();
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#sectionBottomLinkDecoration').change(function(){
            var $tpl = $('#tpl-section-bottom');
            var opt = $tpl.data('json');
            opt.linkDecoration = $(this).val();
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        /*Footer box*/
        $('#footerBorderTopType').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderTopType = val;
            if (val == 'None'){
                $tpl.css('border-top-style','');
            } else{
                $tpl.css('border-top-style',opt.borderTopType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerBorderTopWidth').on('change', function () {
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            
            opt.borderTopWidth = $(this).val();
            $tpl.css('border-top-width',opt.borderTopWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerBorderBottomType').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.borderBottomType = val;
            if (val == 'None'){
                $tpl.css('border-bottom-style','');
            } else{
                $tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
            }
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerBorderBottomWidth').on('change', function () {
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            
            opt.borderBottomWidth = $(this).val();
            $tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerTypeFace').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            
            opt.fontTypeFace = $(this).val();
            page.update_font_family ($tpl, opt.fontTypeFace, $(this));
            /*
            $tpl.css('font-family',opt.fontTypeFace + ', sans-serif');
            */
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerWeight').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            
            opt.fontWeight = $(this).val();
            $tpl.css('font-weight',opt.fontWeight);
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerSize').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            
            opt.fontSize = $(this).val();
            $tpl.css('font-size',opt.fontSize + 'px');
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerLineHeight').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            var val = $(this).val();
            
            opt.lineHeight = val;
            if (val == 'None'){
                $tpl.css('line-height','normal');
            }else{
                $tpl.css('line-height',opt.lineHeight + '%');
            }
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerAlign li').on('click', function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            var $li = $(this);
            var index = $li.index();
            $li.addClass('selected').siblings('li').removeClass('selected');
            opt.textAlign = index;
            if (index == 0){
                $tpl.css('text-align','left');
            } else if(index == 1){
                $tpl.css('text-align','center');
            } else if (index == 2){
                $tpl.css('text-align','right');
            }
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        
        $('#footerLinkWeight').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            
            opt.linkWeight = $(this).val();
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });
        $('#footerLinkDecoration').change(function(){
            var $tpl = $('#tpl-footer');
            var opt = $tpl.data('json');
            opt.linkDecoration = $(this).val();
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        });

		//Columns 2-3
		$('#column2BorderTopType').change(function(){
			updateInfElTpl();
			var val = $(this).val();

			opt.borderTopType = val;
			if (val == 'None'){
				$tpl.css('border-top-style','');
			} else{
				$tpl.css('border-top-style',opt.borderTopType.toLowerCase());
			}
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column2BorderTopWidth').on('change', function () {
			updateInfElTpl();
			opt.borderTopWidth = $(this).val();
			$tpl.css('border-top-width',opt.borderTopWidth + 'px');
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column2BorderBottomType').change(function(){
			updateInfElTpl();
			var val = $(this).val();

			opt.borderBottomType = val;
			if (val == 'None'){
				$tpl.css('border-bottom-style','');
			} else{
				$tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
			}
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column2BorderBottomWidth').on('change', function () {
			updateInfElTpl();
			opt.borderBottomWidth = $(this).val();
			$tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column3BorderTopType').change(function(){
			updateInfElTpl();
			var val = $(this).val();

			opt.borderTopType = val;
			if (val == 'None'){
				$tpl.css('border-top-style','');
			} else{
				$tpl.css('border-top-style',opt.borderTopType.toLowerCase());
			}
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column3BorderTopWidth').on('change', function () {
			updateInfElTpl();
			opt.borderTopWidth = $(this).val();
			$tpl.css('border-top-width',opt.borderTopWidth + 'px');
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column3BorderBottomType').change(function(){
			updateInfElTpl();
			var val = $(this).val();

			opt.borderBottomType = val;
			if (val == 'None'){
				$tpl.css('border-bottom-style','');
			} else{
				$tpl.css('border-bottom-style',opt.borderBottomType.toLowerCase());
			}
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
		$('#column3BorderBottomWidth').on('change', function () {
			updateInfElTpl();
			opt.borderBottomWidth = $(this).val();
			$tpl.css('border-bottom-width',opt.borderBottomWidth + 'px');
			$tpl.attr('data-json', JSON.stringify( opt ));
		});
    },
	elementsClone: function($btn){
		var $block = $btn.closest('.tpl-block');
		var type = $block.attr('data-type');
		var isColumns = type === "column-2" || type === "column-3";
		var $clone = $block.clone();
		$block.after($clone);
		if(isColumns) page.sortableElements($clone.find('.tpl-container'));
	},
    updateColorElTpl: function(el, hex){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var id = $(el).attr('id');
        
        if( id == 'boxTextColor' ){
            opt.color = '#' + hex;
            $tpl.find('.ebTextContent').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'boxTextBackground'){
            opt.boxesBackgroundColor = '#' + hex;
            $tpl.find('.ebTextContentContainer').css('background-color', opt.boxesBackgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'boxTextBorderColor'){
            opt.boxesBorderColor = '#' + hex;
            $tpl.find('.ebTextContentContainer .ebTextContent').css('border-color', opt.boxesBorderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'dividerBackgroundColor'){
            opt.backgroundColor = '#' + hex;
            $tpl.find('.ebDividerBlock').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'dividerBorderColor'){
            opt.borderColor = '#' + hex;
            $tpl.find('.ebDividerContent').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'buttonBackground' ){
            opt.backgroundColor = '#' + hex;
            $tpl.find('.ebButtonContentContainer').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'buttonBorderColor' ){
            opt.borderColor = '#' + hex;
            $tpl.find('.ebButtonContentContainer').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'buttonTextColor' ){
            opt.color = '#' + hex;
            $tpl.find('.ebButton').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'cardBackground'){
            opt.backgroundColor = '#' + hex;
            $tpl.find('.ebImageBlock').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'cardBorderColor'){
            opt.borderColor = '#' + hex;
            $tpl.find('.ebImageBlock').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'cardTextColor'){
            opt.color = '#' + hex;
            $tpl.find('.ebImageBlock .ebTextContent').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'videoBackground'){
            opt.backgroundColor = '#' + hex;
            $tpl.find('.ebImageBlock').css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'videoBorderColor'){
            opt.borderColor = '#' + hex;
            $tpl.find('.ebImageBlock').css('border-color', opt.borderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'videoTextColor'){
            opt.color = '#' + hex;
            $tpl.find('.ebTextContent').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'captionTextColor'){
            opt.color = '#' + hex;
            $tpl.find('.ebTextContent').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'pageBackground'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
            $tpl.css('backgroundColor', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if( id == 'pageBorderColor'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('borderTopColor', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if( id == 'boxBorderColor'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.boxBorderColor = '#' + hex;
            $('#templateContainerWrap').css('borderColor', opt.boxBorderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'containerSocialBackground'){
            opt.containerBackground = '#' + hex;
            $tpl.find('.ebShareContent').css('background-color', opt.containerBackground);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'containerSocialBorderColor'){
            opt.containerBorderColor = '#' + hex;
            $tpl.find('.ebShareContent').css('border-color', opt.containerBorderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'btnSocialBackground'){
            opt.btnBackground = '#' + hex;
            $tpl.find('.ebShareContentItem').css('background-color', opt.btnBackground);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'btnSocialBorderColor'){
            opt.btnBorderColor = '#' + hex;
            $tpl.find('.ebShareContentItem').css('border-color', opt.btnBorderColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'btnSocialColor'){
            opt.color = '#' + hex;
            $tpl.find('.mcnShareTextContent > a').css('color', opt.color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'h1Color'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.h1Color = '#' + hex;
            $('.eb-h1 > span').css('color', opt.h1Color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if (id == 'h2Color'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.h2Color = '#' + hex;
            $('.eb-h2 > span').css('color', opt.h2Color);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'h1ShadowColor'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.h1ShadowColor = '#' + hex;
            var h1Shadow = opt.h1ShadowX + 'px ' + opt.h1ShadowY + 'px ' + opt.h1ShadowBlur + 'px ' + opt.h1ShadowColor;
            $('.eb-h1> span').css('text-shadow',h1Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'h2ShadowColor'){
            $tpl = $('#bodyTable');
            opt = $tpl.data('json');
            opt.h2ShadowColor = '#' + hex;
            var h2Shadow = opt.h2ShadowX + 'px ' + opt.h2ShadowY + 'px ' + opt.h2ShadowBlur + 'px ' + opt.h2ShadowColor;
            $('.eb-h2> span').css('text-shadow',h2Shadow);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'preheaderBackground'){
            $tpl = $('#tpl-preheader');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'preheaderBorderTopColor'){
            $tpl = $('#tpl-preheader');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('border-top-color', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'preheaderBorderBottomColor'){
            $tpl = $('#tpl-preheader');
            opt = $tpl.data('json');
            opt.borderBottomColor = '#' + hex;
            $tpl.css('border-bottom-color', opt.borderBottomColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'preheaderColor'){
            $tpl = $('#tpl-preheader');
            opt = $tpl.data('json');
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'preheaderLinkColor'){
            $tpl = $('#tpl-preheader');
            opt = $tpl.data('json');
            opt.linkColor = '#' + hex;
            page.updateInlineCss('preheader');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'headerBackground'){
            $tpl = $('#tpl-header');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'headerBorderTopColor'){
            $tpl = $('#tpl-header');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('border-top-color', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'headerBorderBottomColor'){
            $tpl = $('#tpl-header');
            opt = $tpl.data('json');
            opt.borderBottomColor = '#' + hex;
            $tpl.css('border-bottom-color', opt.borderBottomColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'headerColor'){
            $tpl = $('#tpl-header');
            opt = $tpl.data('json');
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'headerLinkColor'){
            $tpl = $('#tpl-header');
            opt = $tpl.data('json');
            opt.linkColor = '#' + hex;
            page.updateInlineCss('header');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'bodyBackground'){
            $tpl = $('#tpl-body');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
			if( $('#template-right-sidebar, #template-left-sidebar').length ){
				$('#template-right-sidebar, #template-left-sidebar').children('.column-wrapper').find('td:first').css('background-color', opt.backgroundColor);
			}
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'bodyBorderTopColor'){
            $tpl = $('#tpl-body');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('border-top-color', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'bodyBorderBottomColor'){
            $tpl = $('#tpl-body');
            opt = $tpl.data('json');
            opt.borderBottomColor = '#' + hex;
            $tpl.css('border-bottom-color', opt.borderBottomColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'bodyColor'){
            $tpl = $('#tpl-body');
            opt = $tpl.data('json');
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'bodyLinkColor'){
            $tpl = $('#tpl-body');
            opt = $tpl.data('json');
            opt.linkColor = '#' + hex;
            page.updateInlineCss('body');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'columnBackground'){
            $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'columnBorderTopColor'){
            $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('border-top-color', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'columnBorderBottomColor'){
            $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            opt = $tpl.data('json');
            opt.borderBottomColor = '#' + hex;
            $tpl.css('border-bottom-color', opt.borderBottomColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'columnColor'){
            $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            opt = $tpl.data('json');
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'columnLinkColor'){
            $tpl = $('#template-columns, #template-columns-three, #tpl-right-sidebar, #tpl-left-sidebar');
            opt = $tpl.data('json');
            opt.linkColor = '#' + hex;
            page.updateInlineCss('columns');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'sectionBottomBackground'){
            $tpl = $('#tpl-section-bottom');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'sectionBottomBorderTopColor'){
            $tpl = $('#tpl-section-bottom');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('border-top-color', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'sectionBottomBorderBottomColor'){
            $tpl = $('#tpl-section-bottom');
            opt = $tpl.data('json');
            opt.borderBottomColor = '#' + hex;
            $tpl.css('border-bottom-color', opt.borderBottomColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'sectionBottomColor'){
            $tpl = $('#tpl-section-bottom');
            opt = $tpl.data('json');
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'sectionBottomLinkColor'){
            $tpl = $('#tpl-section-bottom');
            opt = $tpl.data('json');
            opt.linkColor = '#' + hex;
            page.updateInlineCss('sectionBottom');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'footerBackground'){
            $tpl = $('#tpl-footer');
            opt = $tpl.data('json');
            opt.backgroundColor = '#' + hex;
            $tpl.css('background-color', opt.backgroundColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'footerBorderTopColor'){
            $tpl = $('#tpl-footer');
            opt = $tpl.data('json');
            opt.borderTopColor = '#' + hex;
            $tpl.css('border-top-color', opt.borderTopColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'footerBorderBottomColor'){
            $tpl = $('#tpl-footer');
            opt = $tpl.data('json');
            opt.borderBottomColor = '#' + hex;
            $tpl.css('border-bottom-color', opt.borderBottomColor);
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'footerColor'){
            $tpl = $('#tpl-footer');
            opt = $tpl.data('json');
            opt.color = '#' + hex;
            $tpl.css('color', opt.color);
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'footerLinkColor'){
            $tpl = $('#tpl-footer');
            opt = $tpl.data('json');
            opt.linkColor = '#' + hex;
            page.updateInlineCss('footer');
            $tpl.attr('data-json', JSON.stringify( opt ));
        } else if ( id == 'column2Background'){
			opt.backgroundColor = '#' + hex;
			$tpl.css('background-color', opt.backgroundColor);
			$tpl.attr('data-json', JSON.stringify( opt ));
		} else if ( id == 'column2BorderTopColor'){
			opt.borderTopColor = '#' + hex;
			$tpl.css('border-top-color', opt.borderTopColor);
			$tpl.attr('data-json', JSON.stringify( opt ));
		} else if ( id == 'column2BorderBottomColor'){
			opt.borderBottomColor = '#' + hex;
			$tpl.css('border-bottom-color', opt.borderBottomColor);
			$tpl.attr('data-json', JSON.stringify( opt ));
		} else if ( id == 'column3Background'){
			opt.backgroundColor = '#' + hex;
			$tpl.css('background-color', opt.backgroundColor);
			$tpl.attr('data-json', JSON.stringify( opt ));
		} else if ( id == 'column3BorderTopColor'){
			opt.borderTopColor = '#' + hex;
			$tpl.css('border-top-color', opt.borderTopColor);
			$tpl.attr('data-json', JSON.stringify( opt ));
		} else if ( id == 'column3BorderBottomColor') {
			opt.borderBottomColor = '#' + hex;
			$tpl.css('border-bottom-color', opt.borderBottomColor);
			$tpl.attr('data-json', JSON.stringify(opt));
		}
    },
    heightBodyTable: function(){
        //$('#bodyTable').css('height',$('#container_designer_html').height());
        //$('#bodyTable').css('height',$('.eb-wrap))............; //remove line
        $('.eb-wrap-email-page').height($('body').height() - 50);
    },
    updateColWidth1150: function(){
        var width = $('body').width();
        var width_half = width * 0.5;
        if ( width < 1151 ){
            $('.wrap-preview-col').css('right', '440px');
            $('.tool-col').width(440);
        } else {
            $('.wrap-preview-col').css('right', width_half + 'px');
            $('.tool-col').width(width_half);
        }
    },
    browseImage: function($el, indexImage, urlImage, $tpl, titleImage){
		page.set_auto_save_mode_status(false);
		
        var $tpl = $('.tpl-block.tpl-selected') || $tpl;
        var $boxImg = $tpl.find('.ebImageContent').eq(indexImage);
        var current_src = $boxImg.find('img').attr('img-src')
		//page.container_selected_image = $(this).parent()
		moxman.browse({
			url: current_src,
			view: 'thumbs',
			title: 'Media Manager',
			extensions:'jpg,jpeg,png,gif',
			filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
			filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
			fileinfo_fields: 'url',
			//fileinfo_fields: 'path url',
			/*disabled_tools: 'upload,create,manage,filter',*/
			oninsert: function(args) {
				if(args.files[0].url){
					var img = args.files[0];
					if(img.canPreview){
						page.processInsertImage(img, $el, indexImage, urlImage, $tpl, titleImage);
					}
				}
				page.set_auto_save_mode_status(true);
			}		
		});
    },
    editImage: function($el, indexImage, urlImage, $tpl, titleImage){
    	try {
    		page.set_auto_save_mode_status(false);
    		
            var $tpl = $('.tpl-block.tpl-selected') || $tpl;
            var $boxImg = $tpl.find('.ebImageContent').eq(indexImage);
            var current_src = $boxImg.find('img').attr('img-src')
            if(typeof current_src != 'undefined'){
        		//page.container_selected_image = $(this).parent()
        		moxman.edit({
        			path: current_src,
        			title: 'Media Manager',
        			/*disabled_tools: 'upload,create,manage,filter',*/
        			onsave: function(args) {
        				if(args.file.url){
        					var img = args.file;
        					if(img.canPreview){
        						page.processInsertImage(img, $el, indexImage, urlImage, $tpl, titleImage);
        					}
        				}
        				page.set_auto_save_mode_status(true);
        			}		
        		});
            } else {
    			//page.browseImage($el, indexImage, urlImage, $tpl, titleImage);
            }
    	}
    	catch(err) {
			//page.browseImage($el, indexImage, urlImage, $tpl, titleImage);
    	}
    },
    process_load_landing_pages: function (_callback){
    	if (! this.is_done_load_landing_pages) {
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
							page.is_done_load_landing_pages = true;
							page.landing_pages = data.landing_pages;
							
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
    process_load_files: function (_callback){
    	if (! this.is_done_load_files) {
			ll_fade_manager.fade(true, 'load');
			var _data = {};
			_data['action'] = 'get_trackable_content';
			
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
							page.is_done_load_files = true;
							page.files = data.files;
							
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
    processInsertImage: function(img, $el, indexImage, urlImage, $tpl, titleImage){
		urlImageClean = img.url;
		urlImage = img.url + '?v=' + Math.random();
		var thumpurl = img.thumbnailUrl + '?v=' + Math.random();
        //var widthImg = 500;
        //var heightImg = 259;
        var widthImg = img.meta.width;
        var heightImg = img.meta.height;
		var titleImage = (typeof img.nameWithoutExtension != 'undefined') ? img.nameWithoutExtension : img.name;
		
        var $tpl = $('.tpl-block.tpl-selected') || $tpl;
        var $li = $el.parents('.item-image');
        var $box = $el.parents('.eb-list-image');
        var maxWidth = widthImg + 'px';
        var $boxImg = $tpl.find('.ebImageContent').eq(indexImage);
        var boxImgWidth = $boxImg.width();
        
        $li.find('.eb-image-item-icon').attr('src', thumpurl);
        
        $li.find('.eb-image-item-title').text(titleImage);
        $li.find('.eb-size-img').show().text(widthImg + ' × '+ heightImg);
        
        var _img_links = '';
    	_img_links += '<li><a href="javascript:void(0)" class="lnk-img-edit">Replace</a></li>';
    	_img_links += '<li><a href="javascript:void(0)" class="lnk-img-edit-image">Edit</a></li>';
    	_img_links += '<li><a href="javascript:void(0)" class="lnk-img-link">Link</a></li>';
    	_img_links += '<li><a href="javascript:void(0)" class="lnk-img-alt">Alt</a></li>';
        if ( $box.children('li').length == 2 ){
        } else {
        	_img_links += '<li><a href="javascript:void(0)" class="lnk-img-remove">Remove</a></li>';
        }
        $li.find('.eb-links-image').html(_img_links);
        /*
        if ( $box.children('li').length == 2 ){
            $li.find('.eb-links-image').html('<li><a href="javascript:void(0)" class="lnk-img-edit">Edit</a></li>');
        } else{
           $li.find('.eb-links-image').html('<li><a href="javascript:void(0)" class="lnk-img-edit">Edit</a></li><li><a href="javascript:void(0)" class="lnk-img-remove">Remove</a></li>');
        }
        */
        if( boxImgWidth < widthImg){
            widthImg = boxImgWidth;
            heightImg = '';
        }
        
        var _original_alt = $boxImg.find('img').attr('alt')
        
        var img_html = '<img alt="" style="margin:0; vertical-align:top; max-width: '+maxWidth +'" ';
        img_html += '		width="'+widthImg+'" ';
        //img_html += '		height="'+heightImg+'" ';
        img_html += '		class="eb-img-upload" ';
        img_html += '		img-thump-src="' + thumpurl + '"';
        img_html += '		img-name="' + titleImage + '"';
        img_html += '		img-src="' + urlImageClean + '"';
        img_html += '		src="'+urlImage+'" />';
        $boxImg.html(img_html)
        $boxImg.find('img').load (function(){
        	var _rel_width = $(this).prop('naturalWidth');
        	var _rel_height = $(this).prop('naturalHeight');
            $li.find('.eb-size-img').show().text(_rel_width + ' × '+ _rel_height);

            if( boxImgWidth > _rel_width){
	            $(this).width (_rel_width)
	            $(this).height (_rel_height)
				$(this).css('max-width', _rel_width + 'px');
				$(this).attr('width', _rel_width);
            }
        })
        
        if(typeof _original_alt == 'undefined' || _original_alt == ''){
        	_original_alt = titleImage;
        }
    	$boxImg.find('img').attr('alt', _original_alt)
    },
    removeImage: function($el, indexImage){
        var $tpl = $('.tpl-block.tpl-selected');
        var $box = $el.parents('.eb-list-image');
        var $li = $($el).parents('.item-image');
        var index = null;
        
        index = $li.index();
        page.uploadImageHtml(index);
        if ( $box.hasClass('eb-list-image-group') ){
            
            $li.remove();
            $tpl.find('.ebImageContentContainer').eq(index).remove();
            page.countImagesGroup();
            page.resetIdSort();
        } else {
            $li.find('.eb-image-item-title').text('Upload an Image');
            $li.find('.eb-size-img').hide().text('');
            $li.find('.eb-image-item-icon').replaceWith('<img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>');
            $li.find('.eb-links-image').html('<li><a href="javascript:void(0)" class="lnk-img-browse">Browse</a></li>');
        }
        
    },
    updateWidthImgs: function(tpl){
        var $tpl = (tpl && tpl.length > 0) ? tpl : $('.tpl-block.tpl-selected');
        $tpl.find('.ebImageContent').find('img').attr('width', 0);
        $tpl.find('.ebImageContent').each(function(){
            var $box = $(this);
            var $img = $box.find('img').eq(0);
            var maxWidth = 0;
            var boxWidth = 0;
            var widthImg = 0;
            
            $img.attr('width', 0);
            
            if ($img.length){
                
                maxWidth = parseInt($img.css('max-width'));
                boxWidth = $box.width();
                
                if( boxWidth > maxWidth ){
                    widthImg  = maxWidth;
                } else {
                    widthImg  = boxWidth;
                }
                if ( !$img.parent('.eb-upload-image').length ){
                    $img.attr('width', widthImg);
                } else {
                    $img.attr('width', '');
                }
            }
        });
    },
    uploadImageHtml: function(index){
        var $tpl = $('.tpl-block.tpl-selected');
        var html = '<div class="eb-upload-image">'+
                        '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                        //'<p class="cont-drop-image">Drop an Image here</p>'+
                        //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                    '</div>';
        $tpl.find('.ebImageContent').eq(index).html(html);

        if ( $tpl.attr('data-type') == 'box-image-caption' || $tpl.attr('data-type') == 'box-image-card' || $tpl.attr('data-type') == 'box-video'){
            page.captionWidthImg();
        }
    },
    addImageHtml: function(url){
        
    },
    addImagesList: function(){
        $('.eb-add-image-list').on('click', function(e){
            e.preventDefault();
            var sortId = $('.eb-list-image-group').children('li').length;
            var html = '<li class="item-image clearfix" datasortid="'+ sortId +'">'+
                            '<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>'+
                            '<img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon">'+
                            '<div class="eb-image-item-meta">'+
                                '<strong class="eb-image-item-title">Upload an Image</strong>'+
                                '<ul class="eb-links-image clearfix">'+
                                    '<li>'+
                                        '<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>'+
                                    '</li>'+
                                '</ul>'+
                            '</div>'+
                        '</li>';
            $('.eb-list-image-group').append(html);
            var indexImage = $('.eb-list-image-group > li').length - 1;
            page.addWrapImageBox();
            page.uploadImageHtml(indexImage);
            page.countImagesGroup();
            page.updateWidthImgs();
        });
    },
    countImagesGroup: function(){
        var $links = $('.eb-list-image-group .eb-links-image');
        var countImage = $('.eb-list-image-group > li').length;
        var $btn = $('.eb-add-image-list');
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');

        var _img_links = '';
    	//_img_links += '<li><a href="javascript:void(0)" class="lnk-img-edit">Replace</a></li>';
    	//_img_links += '<li><a href="javascript:void(0)" class="lnk-img-edit-image">Edit</a></li>';
    	//_img_links += '<li><a href="javascript:void(0)" class="lnk-img-link">Link</a></li>';
    	//_img_links += '<li><a href="javascript:void(0)" class="lnk-img-alt">Alt</a></li>';
        _img_links += '<li><a href="javascript:void(0)" class="lnk-img-remove">Remove</a></li>';
        
        if (countImage > 4){
            $btn.hide();
        } else {
            $btn.show();
        }
        $links.find('.lnk-img-remove').parent().remove();
        if (countImage > 2){
            $links.append(_img_links);
        }
        
        opt.count = countImage;
        $tpl.attr('data-json', JSON.stringify( opt ));
        page.layoutImagesGroup(opt.count);
        page.positionImagesGroup();
    },
    addWrapImageBox: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var sortId = $tpl.find('.ebImageContentContainer').length;
        var html = '<table datasortid="'+sortId+'" class="ebImageContentContainer" align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td class="ebImageContent" style="padding: 0 9px;" valign="top"></td></tr></tbody></table>';
        
        $tpl.find('.ebImageBlockInner:last').append(html);
    },
    updateWidthGroupColumn: function(el){
        page.positionImagesGroup(false, false, el);
        page.updateWidthImgs(el);
    },
    positionImagesGroup: function(layoutIndex, sortImages, tpl){
        var masGroupHtml = [];
        var $tpl = (tpl && tpl.length > 0) ? tpl : $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var $box = $tpl.find('.ebImageBlockOuter');
        sortImages = sortImages || false;
        if (sortImages){
            var masSortable = [];
            var masGroupHtmlNew = [];
            $('.eb-list-image-group > li').each(function(){
                masSortable.push($(this).attr('datasortid'));
            });
            $tpl.find('.ebImageContentContainer').each(function(i){
                 masGroupHtml.push($(this));
            });
            if ( masGroupHtml.length == masSortable.length ) {
                for(i = 0; i < masSortable.length; i++){
                    masGroupHtmlNew[i] = masGroupHtml[masSortable[i]];
                }
            }
            masGroupHtml = masGroupHtmlNew;
        } else {
            $tpl.find('.ebImageContentContainer').each(function(i){
                 masGroupHtml.push($(this));
            }); 
        }
        if (layoutIndex != false){
            opt.layoutIndex = layoutIndex || 0;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.startLayoutImagesGroup();
        }
        var htmlTr = '<tr><td class="ebImageBlockInner" style="padding: 9px;" valign="top"></td></tr>';
        var htmlEnd = '';
        var widthColumnImg = '282px';

		if ( $tpl.parents('#template-columns').length || $tpl.parents('.template-column-2').length){
            widthColumnImg = '132px';
            page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'));
		} else if ( $tpl.parents('#tpl-left-sidebar').length || $tpl.parents('#tpl-right-sidebar').length || $tpl.parents('#template-columns-three').length || $tpl.parents('.template-column-3').length ){
            widthColumnImg = '82px';
            var widthUploadImg = '62px';
        } else if ( ($tpl.parents('#template-left-sidebar').length && $tpl.parents('#tpl-body').length) || ($tpl.parents('#template-right-sidebar').length && $tpl.parents('#tpl-body').length) ){
            widthColumnImg = '182px';
            page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'));
        } else {
            page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'));
        }
        
        $box.html('');
        if (opt){
	        if (opt.layout == 0 && opt.layoutIndex == 0){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[0].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px 0 0');
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'), widthUploadImg);
	            }
	        } else if ( opt.layout == 0 && opt.layoutIndex == 1 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[0].css('width','100%').attr('width','100%').attr('align','left'));
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[1].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px');
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'));
	            }
	        } else if ( opt.layout == 1 && opt.layoutIndex == 0 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[0].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 9px');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[2].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 9px 0 0');
	
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($(masGroupHtml[0]).find('.ebImageContent'));
	                page.updateWidthBoxUploadImage($(masGroupHtml[1]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[2]).find('.ebImageContent'), widthUploadImg);
	            }
	        } else if ( opt.layout == 1 && opt.layoutIndex == 1 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[0].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[2].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 9px');
	
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($(masGroupHtml[2]).find('.ebImageContent'));
	                page.updateWidthBoxUploadImage($(masGroupHtml[0]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[1]).find('.ebImageContent'), widthUploadImg);
	            }
	        } else if ( opt.layout == 1 && opt.layoutIndex == 2 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[0].css('width','100%').attr('width','100%').attr('align','left'));
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[1].css('width','100%').attr('width','100%').attr('align','left'));
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[2].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px');
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 9px');
	            
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'));
	            }
	        } else if ( opt.layout == 2 && opt.layoutIndex == 0 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[0].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[2].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[3].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[3]).find('.ebImageContent').css('padding','0 9px 0 0');
	            
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($box.find('td').find('.ebImageContent'), widthUploadImg);
	            }
	        } else if ( opt.layout == 2 && opt.layoutIndex == 1 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[0].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 9px');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[2].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[3].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[3]).find('.ebImageContent').css('padding','0 9px');
	
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($(masGroupHtml[0]).find('.ebImageContent'));
	                page.updateWidthBoxUploadImage($(masGroupHtml[1]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[2]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[3]).find('.ebImageContent'));
	            }
	        } else if ( opt.layout == 3 && opt.layoutIndex == 0 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[0].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 9px');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[2].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[3].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[4].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[3]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[4]).find('.ebImageContent').css('padding','0 9px 0 0');
	
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($(masGroupHtml[0]).find('.ebImageContent'));
	                page.updateWidthBoxUploadImage($(masGroupHtml[1]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[2]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[3]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[4]).find('.ebImageContent'), widthUploadImg);
	            }
	        } else if ( opt.layout == 3 && opt.layoutIndex == 1){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[0].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[2].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 9px');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[3].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[4].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[3]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[4]).find('.ebImageContent').css('padding','0 9px 0 0');
	
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($(masGroupHtml[0]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[1]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[2]).find('.ebImageContent'));
	                page.updateWidthBoxUploadImage($(masGroupHtml[3]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[4]).find('.ebImageContent'), widthUploadImg);
	            }
	        } else if ( opt.layout == 3 && opt.layoutIndex == 2 ){
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[0].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[1].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[0]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[1]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first')
	                    .append(masGroupHtml[2].css('width','282px').attr('width','282px').attr('align','left'))
	                    .append(masGroupHtml[3].css('width','282px').attr('width','282px').attr('align','right'));
	            $(masGroupHtml[2]).find('.ebImageContent').css('padding','0 0 0 9px');
	            $(masGroupHtml[3]).find('.ebImageContent').css('padding','0 9px 0 0');
	            $box.append(htmlTr);
	            $box.find('tr:last > td:first').append(masGroupHtml[4].css('width','100%').attr('width','100%').attr('align','left'));
	            $(masGroupHtml[4]).find('.ebImageContent').css('padding','0 9px');
	
	            if (widthUploadImg){
	                page.updateWidthBoxUploadImage($(masGroupHtml[0]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[1]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[2]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[3]).find('.ebImageContent'), widthUploadImg);
	                page.updateWidthBoxUploadImage($(masGroupHtml[4]).find('.ebImageContent'));
	            }
	        }
	    }
    },
    startLayoutImagesGroup: function(){
       var $tpl = $('.tpl-block.tpl-selected');
       var opt = $tpl.data('json');
       $('.eb-list-layout li').removeClass('selected').hide();
       $('.eb-list-layout li[data-type="'+opt.layout+'"]').show().eq(opt.layoutIndex).addClass('selected');
    },
    layoutImagesGroup: function(count){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        if( count == 2){
            opt.layout = 0;
        } else if( count == 3 ){
            opt.layout = 1;
        } else if( count == 4 ){
            opt.layout = 2;
        } else {
            opt.layout = 3;
        }
        $tpl.attr('data-json', JSON.stringify( opt ));
    },
    startCountImgs: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var linkRemove = '';
        var urlImage = '';
        
        $('.eb-list-image-group').html('');
        if (opt.count > 2){
            linkRemove = '<li><a href="javascript:void(0)" class="lnk-img-remove">Remove</a></li>';
        }
        var html = '';
        for(i = 0; i < opt.count; i++){
            var $img = $tpl.find('.ebImageContent').eq(i).find('img');
            if($img.length){
                var big_img_src = $img.attr('src');
            	var thmlurl = $img.attr('img-thump-src')
            	var img_clean_source = $img.attr('img-src')
            	if(typeof thmlurl == 'undefined' || !thmlurl){
            		thmlurl = big_img_src
            	}
            	var img_name = $img.attr('img-name')
            	if(typeof img_name == 'undefined' || !img_name){
            		img_name = 'Upload an Image'
            	}
                html = '<li class="item-image clearfix" datasortid="'+i+'">'+
                            '<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>'+
                            '<img alt="" src="'+thmlurl+'" class="eb-image-item-icon">'+
                            '<div class="eb-image-item-meta">'+
                                '<strong class="eb-image-item-title">' + img_name + '</strong>'+
                                '<div style="display: block;" class="eb-size-img">' + $($img).prop('naturalWidth') + ' × ' + $($img).prop('naturalHeight') + '</div>'+
                                '<ul class="eb-links-image clearfix">'+
                                

                                ((	this.isTestImage(big_img_src)) ? 
                                		(
                                            '<li><a href="javascript:void(0)" class="lnk-img-browse">Browse</a></li>'
                                	) : (
                                            '<li><a href="javascript:void(0)" class="lnk-img-edit">Replace</a></li>'+
                                            ( (typeof img_clean_source != 'undefined') ? '<li><a href="javascript:void(0)" class="lnk-img-edit-image">Edit</a></li>' : '')+
                                            '<li><a href="javascript:void(0)" class="lnk-img-link">Link</a></li>'+
                                            '<li><a href="javascript:void(0)" class="lnk-img-alt">Alt</a></li>'+
                                            '<li><a href="javascript:void(0)" class="lnk-img-remove">Remove</a></li>'
                                	)
                                )+
                                    linkRemove +
                                '</ul>'+
                            '</div>'+
                        '</li>';
            } else{
                urlImage = 'imgs/imgs_email_builder/img_none.png';
                html = '<li class="item-image clearfix" datasortid="'+i+'">'+
                            '<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>'+
                            '<img alt="" src="'+urlImage+'" class="eb-image-item-icon">'+
                            '<div class="eb-image-item-meta">'+
                                '<strong class="eb-image-item-title">Upload an Image</strong>'+
                                '<ul class="eb-links-image clearfix">'+
                                    '<li>'+
                                        '<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>'+
                                    '</li>'+
                                    linkRemove +
                                '</ul>'+
                            '</div>'+
                        '</li>';
            }
            
            $('.eb-list-image-group').append(html);
        }
        var countImage = $('.eb-list-image-group > li').length;
        var $btn = $('.eb-add-image-list');
        if (countImage > 4){
            $btn.hide();
        } else {
            $btn.show();
        }
    },
    isTestImage: function(big_img_src){
    	return (	big_img_src.indexOf('imgs/imgs_email_builder/img_none.png') != -1 || 
        		big_img_src.indexOf('imgs/imgs_email_builder/img_upload.png') != -1 || 
        		big_img_src.indexOf('imgs/imgs_email_builder/img_none.jpg') != -1 || 
        			big_img_src.indexOf('imgs/imgs_email_builder/img_upload.jpg') != -1);
    },
    startCountImgOne: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var type = $tpl.attr('data-type');
        var html = '';
        
        if ( $tpl.find('.ebImageContent').find('img').length ){
            var $img = $tpl.find('.ebImageContent').find('img');
            var big_img_src = $img.attr('src');
        	var thmlurl = $img.attr('img-thump-src')
        	var img_clean_source = $img.attr('img-src')
        	if(typeof thmlurl == 'undefined' || !thmlurl){
        		thmlurl = big_img_src
        	}
        	var img_name = $img.attr('img-name')
        	if(typeof img_name == 'undefined' || !img_name){
        		img_name = 'Upload an Image'
        	}
            html = '<li class="item-image clearfix">'+
                        '<img alt="" src="' + thmlurl + '" class="eb-image-item-icon">'+
                        '<div class="eb-image-item-meta">'+
                            '<strong class="eb-image-item-title">' + img_name + '</strong>'+
                            '<div style="display: block;" class="eb-size-img">' + $img.prop('naturalWidth') + ' × ' + $img.prop('naturalHeight') + '</div>'+
                            '<ul class="eb-links-image clearfix">'+
                            ((	this.isTestImage(big_img_src)) ? 
                            		(
                                        '<li><a href="javascript:void(0)" class="lnk-img-browse">Browse</a></li>'
                            	) : (
                                        '<li><a href="javascript:void(0)" class="lnk-img-edit">Replace</a></li>'+
                                        ( (typeof img_clean_source != 'undefined') ? '<li><a href="javascript:void(0)" class="lnk-img-edit-image">Edit</a></li>' : '')+
                                        '<li><a href="javascript:void(0)" class="lnk-img-link">Link</a></li>'+
                                        '<li><a href="javascript:void(0)" class="lnk-img-alt">Alt</a></li>'+
                                        '<li><a href="javascript:void(0)" class="lnk-img-remove">Remove</a></li>'
                            	)
                            )+
                            '</ul>'+
                        '</div>'+
                    '</li>';
        } else {
            html = '<li class="item-image clearfix">'+
                        '<img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon">'+
                        '<div class="eb-image-item-meta">'+
                            '<strong class="eb-image-item-title">Upload an Image</strong>'+
                            '<div class="eb-size-img"></div>'+
                            '<ul class="eb-links-image clearfix">'+
                                '<li>'+
                                    '<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>'+
                                '</li>'+
                            '</ul>'+
                        '</div>'+
                    '</li>';
        }
        if ( type == 'box-image' ){
            $('#eb-box-image').find('.eb-list-image').html('').append(html);
        } else if ( type == 'box-image-card'){
            $('#eb-box-image-card').find('.eb-list-image').html('').append(html);
        } else{
            $('#eb-box-image-caption').find('.eb-list-image').html('').append(html);
        }
        
    },
    sortableImages: function(){
      $('.eb-list-image-group').sortable({
            cursor: 'move',
            handle: '.eb-btn-move-elm',
            tolerance: 'intersect',
            stop: function(event, ui) {
                page.updatePositionImgs();
            }
        }).disableSelection();
    },
    updatePositionImgs: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var sortImages = true;
        page.positionImagesGroup(opt.layoutIndex, sortImages);
        page.resetIdSort();
        page.updateWidthImgs();
    },
    resetIdSort: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        $('.eb-list-image-group > li').each(function(i){
            $(this).attr('datasortid', i);
        });
        $tpl.find('.ebImageContentContainer').each(function(i){
            $(this).attr('datasortid', i);
        });
    },
    captionPosition: function(ofNumberSelect){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var imgContent = [];
        var textContent = [];
        var $outer = $tpl.find('.ebImageBlockOuter');
        var content = '';
        var content2 = '';
        var ofNumberSelect = ofNumberSelect || false;
        $tpl.find('.ebTextContent').each(function(){
            textContent.push($(this).html());
        });
        $tpl.find('.ebImageCardBlockInner').each(function(){
            imgContent.push($(this).html());
        });
        if( opt.position == 0 ){
            //left
            content = '<tr><td>';
            content += '<table class="ebTableImg" align="right" border="0" cellpadding="0" cellspacing="0" width="69%"><tbody><tr><td class="ebImageCardBlockInner" style="padding: 9px 18px 9px 0;" valign="top">'+imgContent[0]+'</td></tr></tbody></table>';
            content += '<table class="ebTableText" align="left" border="0" cellpadding="0" cellspacing="0" width="31%"><tbody><tr><td class="ebTextContent" style="padding: 9px 0 9px 18px;" valign="top">'+textContent[0]+'</td></tr></tbody></table>';
            content += '</td></tr>';
            if ( opt.number == 1 ){
                content2 = '<tr><td>';
                content2 += '<table class="ebTableText" align="left" border="0" cellpadding="0" cellspacing="0" width="31%"><tbody><tr><td class="ebTextContent" style="padding: 9px 9px 9px 18px;" valign="top">'+textContent[1]+'</td></tr></tbody></table>';
                content2 += '<table class="ebTableImg" align="right" border="0" cellpadding="0" cellspacing="0" width="69%"><tbody><tr><td class="ebImageCardBlockInner" style="padding: 9px 18px 9px 0;" valign="top">'+imgContent[1]+'</td></tr></tbody></table>';
                content2 += '</td></tr>';
            }
            
        } else if ( opt.position == 1 ){
            //top
            content = '<tr>';
            content += '<td class="ebTextContent" style="padding: 9px 18px 9px;" valign="top">'+textContent[0]+'</td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td class="ebImageCardBlockInner" style="padding: 0 18px 9px;" valign="top">'+imgContent[0]+'</td>';
            content += '</tr>';
            
            if ( opt.number == 1 ){
                content2 = '<tr>';
                content2 += '<td class="ebTextContent" style="padding: 9px 18px 9px;" valign="top">'+textContent[1]+'</td>';
                content2 += '</tr>';
                content2 += '<tr>';
                content2 += '<td class="ebImageCardBlockInner" style="padding: 0 18px 9px;" valign="top">'+imgContent[1]+'</td>';
                content2 += '</tr>';
            }
            
        } else if ( opt.position == 2 ){
            //right
            content = '<tr><td>';
            content += '<table class="ebTableImg" align="left" border="0" cellpadding="0" cellspacing="0" width="69%"><tbody><tr><td class="ebImageCardBlockInner" style="padding: 9px 0 9px 18px;" valign="top">'+imgContent[0]+'</td></tr></tbody></table>';
            content += '<table class="ebTableText" align="right" border="0" cellpadding="0" cellspacing="0" width="31%"><tbody><tr><td class="ebTextContent" style="padding: 9px 18px 9px 0;" valign="top">'+textContent[0]+'</td></tr></tbody></table>';
            content += '</td></tr>';
            
            if ( opt.number == 1 ){
                content2 = '<tr><td>';
                content2 += '<table class="ebTableImg" align="left" border="0" cellpadding="0" cellspacing="0" width="69%"><tbody><tr><td class="ebImageCardBlockInner" style="padding: 9px 0 9px 18px;" valign="top">'+imgContent[1]+'</td></tr></tbody></table>';
                content2 += '<table class="ebTableText" align="right" border="0" cellpadding="0" cellspacing="0" width="31%"><tbody><tr><td class="ebTextContent" style="padding: 9px 18px 9px 9px;" valign="top">'+textContent[1]+'</td></tr></tbody></table>';
                content2 += '</td></tr>';
            }
            
        } else if ( opt.position == 3 ){
            //bottom
            content = '<tr>';
            content += '<td class="ebImageCardBlockInner" style="padding: 9px 18px 0;" valign="top">'+imgContent[0]+'</td>';
            content += '</tr>';
            content += '<tr>';
            content += '<td class="ebTextContent" style="padding: 9px 18px 9px;" valign="top">'+textContent[0]+'</td>';
            content += '</tr>';
            
            if ( opt.number == 1 ){
                content2 = '<tr>';
                content2 += '<td class="ebImageCardBlockInner" style="padding: 9px 18px 0;" valign="top">'+imgContent[1]+'</td>';
                content2 += '</tr>';
                content2 += '<tr>';
                content2 += '<td class="ebTextContent" style="padding: 9px 18px 9px;" valign="top">'+textContent[1]+'</td>';
                content2 += '</tr>';
            }
        }
        
        $outer.eq(0).html(content);
        if ( opt.number == 1 ){
             $outer.eq(1).html(content2);
        }
        if(ofNumberSelect){
            page.optionsDropdownImage();
        } else {
            page.optionsDropdownImage(true);
        }
        page.updateStyleCaptionImage();
    },
	callCaptionWidthImg: function(){
		$('#bodyTable').find('.tpl-block').each(function(){
			var $tpl = $(this);
			if ( $tpl.attr('data-type') == 'box-image-card' || $tpl.attr('data-type') == 'box-image-caption' || $tpl.attr('data-type') == 'box-video'){
				page.captionWidthImg($tpl);
			}
		});
	},
    captionWidthImg: function(tpl){
        var $tpl = (tpl && tpl.length > 0) ? tpl : $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var $box = '';

		var optPage = $('#bodyTable').data('json');
		var padding = 0;

		( typeof optPage != 'undefined' && typeof optPage.boxBorderType != 'undefined' && optPage.boxBorderType && optPage.boxBorderType != 'None' ) ? padding = optPage.boxBorderWidth : padding = 0;

		( typeof opt != 'undefined' && typeof opt.boxBorderType != 'undefined' && opt.boxBorderType && opt.boxBorderType != 'None' ) ? padding = opt.boxBorderWidth : padding = 0;

		var widthColumn_0_1 = 198 - padding + 'px';
		var widthColumn_0_2 = 393 - padding + 'px';
		var widthColumn_1_1 = 291 - padding + 'px';
		var widthColumn_1_2 = 300 - padding + 'px';
		var widthColumn_2_1 = 393 - padding + 'px';
		var widthColumn_2_2 = 198 - padding + 'px';
		var widthColumn_3_1 = 424 - (padding * 2) + 'px';
		var widthColumn_3_2 = 167 + 'px';
        var widthUploadImg_0 = '100%';
        var widthUploadImg_1 = '100%';
        var widthUploadImg_2 = '100%';
        var widthUploadImg_3 = '100%';

		if ( $tpl.parents('#template-columns').length  || $tpl.parents('.template-column-2').length){
            widthColumn_0_1 = '99px';
            widthColumn_0_2 = '192px';
            widthColumn_1_1 = '141px';
            widthColumn_1_2 = '150px';
            widthColumn_2_1 = '192px';
            widthColumn_2_2 = '99px';      
            widthColumn_3_1 = '208px';
            widthColumn_3_2 = '83px';
            widthUploadImg_2 = '61px';
            widthUploadImg_3 = '45px';
		} else if ( $tpl.parents('#tpl-left-sidebar').length || $tpl.parents('#tpl-right-sidebar').length || $tpl.parents('#template-columns-three').length  || $tpl.parents('.template-column-3').length){
            widthColumn_0_1 = '91px';
            widthColumn_0_2 = '100px';
            widthColumn_1_1 = '91px';
            widthColumn_1_2 = '100px';
            widthColumn_2_1 = '111px';
            widthColumn_2_2 = '80px';      
            widthColumn_3_1 = '111px';
            widthColumn_3_2 = '80px';
            widthUploadImg_0 = '72px';
            widthUploadImg_1 = '72px';
            widthUploadImg_2 = '52px';
            widthUploadImg_3 = '52px';
        } else if ( ($tpl.parents('#template-left-sidebar').length && $tpl.parents('#tpl-body').length) || ($tpl.parents('#template-right-sidebar').length && $tpl.parents('#tpl-body').length) ){
            widthColumn_0_1 = '125px';
            widthColumn_0_2 = '256px';
            widthColumn_1_1 = '191px';
            widthColumn_1_2 = '200px';
            widthColumn_2_1 = '256px';
            widthColumn_2_2 = '125px';      
            widthColumn_3_1 = '284px';
            widthColumn_3_2 = '98px';
            widthUploadImg_2 = '87px';
            widthUploadImg_3 = '60px';
        }

        $tpl.find('.ebImageBlockOuter').each(function(){
            $box = $(this).find('td:first');
            if( opt.position == 0 || opt.position == 2){
                if ( opt.captionWidth == 0 ){
                    $box.find('.ebTableText').attr('width',widthColumn_0_1).css('width',widthColumn_0_1);
                    $box.find('.ebTableImg').attr('width',widthColumn_0_2).css('width',widthColumn_0_2);
                    page.updateWidthBoxUploadImage($box.find('.ebTableImg'), widthUploadImg_0);
                } else if ( opt.captionWidth == 1 ){
                    $box.find('.ebTableText').attr('width',widthColumn_1_1).css('width',widthColumn_1_1);
                    $box.find('.ebTableImg').attr('width',widthColumn_1_2).css('width',widthColumn_1_2);
                    page.updateWidthBoxUploadImage($box.find('.ebTableImg'), widthUploadImg_1);
                } else if ( opt.captionWidth == 2 ){
                    $box.find('.ebTableText').attr('width',widthColumn_2_1).css('width',widthColumn_2_1);
                    $box.find('.ebTableImg').attr('width',widthColumn_2_2).css('width',widthColumn_2_2);
                    page.updateWidthBoxUploadImage($box.find('.ebTableImg'), widthUploadImg_2);
                } else {
                    $box.find('.ebTableText').attr('width',widthColumn_3_1).css('width',widthColumn_3_1);
                    $box.find('.ebTableImg').attr('width',widthColumn_3_2).css('width',widthColumn_3_2);
                    page.updateWidthBoxUploadImage($box.find('.ebTableImg'), widthUploadImg_3);
                }
            } else {
                page.updateWidthBoxUploadImage($(this).find('td').find('.ebImageContent'));
            }
        });
        page.updateWidthImgs();
    },
    updateWidthBoxUploadImage: function($el, width){
        var maxWidth = width || '100%';
        $el.find('.eb-upload-image').css('max-width',maxWidth);
    },
    alignmentImg: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var $box = $tpl.find('.ebImageContent');
        if( opt.imgAlignment == 0 ){
            $box.css('text-align','left');
        } else if( opt.imgAlignment == 1 ){
            $box.css('text-align','center');
        }  else {
            $box.css('text-align','right');
        }    
    },
    isImageEdge:function($check){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        
        if( $check.is(':checked') ){
            opt.margins = 1;
        } else {
            opt.margins = 0;
        }
        $tpl.attr('data-json', JSON.stringify( opt ));
        page.updateImageEdge($check);

        if ( $tpl.attr('data-type') == 'box-image-card' || $tpl.attr('data-type') == 'box-image-caption' || $tpl.attr('data-type') == 'box-video'){
            page.captionWidthImg($tpl);
        }
        if ( $tpl.attr('data-type') == 'box-image' ){
            page.updateWidthImgs($tpl);
        }
    },
    updateImageEdge: function($check){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        if( $check.is(':checked') ){
            if( opt.margins == 0){
                $check.click();
            }    
        } else {
            if( opt.margins == 1){
                $check.click();
            }    
        }
        if ( $check.attr('id') == 'image-edge' ){
            if( opt.margins == 1 ){
                $tpl.find('.ebImageBlockInner').css('padding','0').addClass('ll-image-edge');
                $tpl.find('.ebImageContent').css('padding','0').addClass('ll-image-edge');
            } else {
                $tpl.find('.ebImageBlockInner').css('padding','9px').removeClass('ll-image-edge');
                $tpl.find('.ebImageContent').css('padding','0 9px').removeClass('ll-image-edge');
            }
        } else {
            if( opt.margins == 1 ){
                $tpl.find('.ebImageCardBlockInner').css('padding','0');
            } else {
                if( opt.position == 0 ){
                    $tpl.find('.ebImageCardBlockInner').css('padding', '9px 18px 9px 0');
                } else if( opt.position == 1 ){
                    $tpl.find('.ebImageCardBlockInner').css('padding', '0 18px 9px 18px');
                } else if( opt.position == 2 ){
                    $tpl.find('.ebImageCardBlockInner').css('padding', '9px 0 9px 18px');
                } else if( opt.position == 3 ){
                    $tpl.find('.ebImageCardBlockInner').css('padding', '9px 18px 0');
                }
            }
        }
        
    },
    optionsDropdownImage: function(start){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var start = start || false;
        var $tplType = $tpl.attr('data-type');
        
        if( opt.position == 0 || opt.position == 2){
            if ( $tplType == 'box-image-card'){
                $('.caption-width-card-wrap').show();
                //$('.image-alignment-card-wrap').hide();
            } else if ( $tplType == 'box-video'){
                $('.caption-width-video-wrap').show();
                $('.image-alignment-video-wrap').hide();
            } else{
                $('.caption-width-caption-wrap').show();
                //$('.image-alignment-caption-wrap').hide();
            }
        } else {
            if ( $tplType == 'box-image-card'){
                $('.caption-width-card-wrap').hide();
                //$('.image-alignment-card-wrap').show();
            } else if ( $tplType == 'box-video'){
                $('.caption-width-video-wrap').hide();
                $('.image-alignment-video-wrap').show();
            } else{
                $('.caption-width-caption-wrap').hide();
                //$('.image-alignment-caption-wrap').show();
            }  
        }
        if (start){
            opt.imgAlignment = 0;
            opt.captionWidth = 0;
        }
        page.alignmentImg();
        page.captionWidthImg();
        if ( $tplType == 'box-image-card' ){
    		ll_combo_manager.set_selected_value('#cardImgAlignment', opt.imgAlignment);
    		ll_combo_manager.set_selected_value('#cardCaptionWidth', opt.captionWidth);
        } else if ( $tplType == 'box-video' ){
    		ll_combo_manager.set_selected_value('#videoImgAlignment', opt.imgAlignment);
    		ll_combo_manager.set_selected_value('#videoCaptionWidth', opt.captionWidth);
        }  else {
    		ll_combo_manager.set_selected_value('#captionImgAlignment', opt.imgAlignment);
    		ll_combo_manager.set_selected_value('#captionCaptionWidth', opt.captionWidth);
        } 
    },
    updateColumnEditorCaption:function(opt){
        var $columnEditor = $('.two-caption-editor');
        if ( opt.number == 0){
            $columnEditor.children('ul').hide();
        } else {
            $columnEditor.children('ul').show();
            page.captionPosition(true);
        }
        $columnEditor.children('ul').find('li').removeClass('selected').eq(0).addClass('selected');
        $columnEditor.find('.eb-caption-column').hide().eq(0).show();
    },
    addColumnCaptionTpl: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        if ( $tpl.find('.ebImageBlock').length == 1 ){
            var html = '<table border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageBlock">'+
                            '<tbody class="ebImageBlockOuter">'+
                                '<tr>'+
                                    '<td valign="top" class="ebImageCardBlockInner" style="padding: 18px 18px 0;">'+
                                        '<table align="left" border="0" cellpadding="0" cellspacing="0" width="100%" class="ebImageContentContainer">'+
                                            '<tbody>'+
                                                '<tr>'+
                                                    '<td valign="top" class="ebImageContent" style="">'+
                                                        '<div class="eb-upload-image">'+
                                                            '<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>'+
                                                            //'<p class="cont-drop-image">Drop an Image here</p>'+
                                                            //'<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>'+
                                                        '</div>'+
                                                    '</td>'+
                                                '</tr>'+
                                            '</tbody>'+
                                        '</table>'+
                                    '</td>'+
                                '</tr>'+
                                '<tr>'+
                                    '<td valign="top" class="ebTextContent" style="padding: 9px 18px;">'+
                                        'Your text caption goes here'+
                                    '</td>'+
                                '</tr>'+
                            '</tbody>'+
                        '</table>';
            $tpl.find('.tpl-block-content').append(html);
            $tpl.find('.ebTextContent').eq(1).html('Your text caption goes here. You can change the position of the caption and set styles in the block\'s settings tab 2.');
            page.editor_set_content('editor-box-text-caption-2', $tpl.find('.ebTextContent').eq(1).html());
        }
    },
    updateStyleCaptionImage: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var textAlign = '';
        var textAlignImage = '';
        
        if (opt.textAlign == 0){
            textAlign = 'left';
        } else if(opt.textAlign == 1){
            textAlign = 'center';
        } else if (opt.textAlign == 2){
            textAlign = 'right';
        }
        if (opt.imgAlignment == 0){
            textAlignImage = 'left';
        } else if(opt.imgAlignment == 1){
            textAlignImage = 'center';
        } else if (opt.imgAlignment == 2){
            textAlignImage = 'right';
        }
        var fontTypeFace = '';
        if(opt.fontTypeFace != 'None'){
            fontTypeFace = opt.fontTypeFace
        }
        
        $tpl.find('.ebTextContent').css({
            fontFamily: fontTypeFace,
            fontWeight: opt.fontWeight,
            fontSize: opt.fontSize + 'px',
            color: opt.color,
            lineHeight: opt.lineHeight + '%',
            textAlign: textAlign
        });
        $tpl.find('.ebImageContent').css({
            textAlign: textAlignImage
        });
    },
    removeColumnCaptionTpl: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var $col = $tpl.find('.ebImageBlock');
        $col.eq(1).remove();
    },
    updateVideoImg: function(link){
        var indexStart;
        var videoId;
        var titleImg = 'Upload an Image';
        var sizeWidthImg = 0;
        
        if (link.indexOf('vimeo.com/') != '-1'){
            
            indexStart = link.lastIndexOf('/') + 1;
            videoId = link.substr(indexStart);
            $.ajax({
                type:'GET',
                url: 'http://vimeo.com/api/v2/video/' + videoId + '.json',
                jsonp: 'callback',
                dataType: 'json',
                success: function(data){
                    var thumbnailSrc = data[0].thumbnail_large;
                    
                    page.addVideoImg(thumbnailSrc, titleImg);
                },
                error: function(){
                    page.addVideoImg();
                }
            });
            
        } else if (link.indexOf('youtube.com/watch?v=') != '-1'){
            
            indexStart = link.lastIndexOf('watch?v=') + 8;
            videoId = link.substr(indexStart);
            var thumbnailSrc;
            
            if (videoId != ''){
                thumbnailSrc = "http://img.youtube.com/vi/"+videoId+"/maxresdefault.jpg";
                
            }
            
            page.addVideoImg(thumbnailSrc, titleImg);
            
        } else {
            page.addVideoImg();
        }
    },
    addVideoImg: function(thumbnailSrc, titleImg){
    	var thumbnailSrc = (typeof thumbnailSrc == 'undefined') ? false : thumbnailSrc;
    	//https://www.youtube.com/watch?v=33wKeh0RVO8
    	//https://ll-localhost.s3.amazonaws.com/file-uploads/customers/11238/videos/play14534029514947.jpg
        var link = $('#videoUrlThumbnail').val();
        var $box = $('#videoImgUpload');
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        
        if(thumbnailSrc){
            if(typeof page.generated_play_images[thumbnailSrc] == 'undefined'){
            	page.generated_play_images[thumbnailSrc] = thumbnailSrc;
            	
    			ll_fade_manager.fade(true, 'process');
    			var _data = {};
    			_data['action'] = 'add_play_icon_to_image';
    			_data['source_image_url'] = thumbnailSrc;
    			
    			$.ajax( {
    				type :"POST",
    				dataType :"json",
    				async :true,
    				url: "ll-email-builder-process.php",
    				data: $.toJSON(_data),
    				cache :false,
    				success : function(data) {
    					ll_fade_manager.fade(false);
    					if(data){
    						if(data.success == 1){
    			            	page.generated_play_images[thumbnailSrc] = data.url;
    							thumbnailSrc = data.url;
    						}
    					}
    					page.append_video_img($tpl, $box, link, thumbnailSrc);
    				},
    				error: function(){
    					ll_fade_manager.fade(false);
    					page.append_video_img($tpl, $box, link, thumbnailSrc);
    				}
    			});
            } else {
				page.append_video_img($tpl, $box, link, page.generated_play_images[thumbnailSrc]);
            }
        } else {
            $box.hide();
            $box.find('.eb-image-item-title').text(titleImg);
            if(link != ''){
                $('.eb-error-video').show();
            } else {
                $('.eb-error-video').hide();  
            }
            var _html = '';
            _html += '<div class="eb-upload-image">';
            _html += '		<img alt="" class="eb-img-upload" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_upload.jpg"/>';
            //_html += '	<p>Add Video URL in editor, drop a preview image here</p>';
            _html += '		<p>Add Video URL in editor</p>';
            //_html += '	<a href="javascript:void(0)" class="et-btn-white btn-browse-img">Browse</a>';
            _html += '</div>';
            $tpl.find('.ebImageContent').html(_html);
            page.captionWidthImg();
        }
        opt.urlVideo = link; 
        $tpl.attr('data-json', JSON.stringify( opt ));
    },
    append_video_img: function($tpl, $box, link, thumbnailSrc){
        var img = new Image();
        img.src = thumbnailSrc;
        img.onload = function() {
            $box.find('.eb-image-item-icon').replaceWith('<img alt="" src="'+thumbnailSrc+'" class="eb-image-item-icon">');
            $box.find('.eb-image-item-title').text('Thumbnail Video');

            $box.show();
            $('.eb-error-video').hide();
            $tpl.find('.ebImageContent').html('<a href="'+link+'" ><img alt="" style="vertical-align:top; margin:0; max-width: '+img.width+'px" class="eb-img-upload" src="'+thumbnailSrc+'"  width="'+$tpl.find('.ebImageContent').width()+'"/></a>')
            page.updateWidthImgs();
            $box.find('.eb-size-img').text($(img).prop('naturalWidth')+ ' × ' + $(img).prop('naturalHeight'));
        }
    },
    startVideoImg: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var type = $tpl.attr('data-type');
        var $videoImgUpload = $('#videoImgUpload');
        var html = '';
        var $img = $tpl.find('.ebImageContent').find('img').eq(0);
        var sizeImg = '640 × 360';
        
        $('#videoUrlThumbnail').val(opt.urlVideo);
        
        if ( $img.length ){
            $videoImgUpload.show();
            $videoImgUpload.find('.eb-image-item-icon').replaceWith('<img alt="" src="'+$img.attr('src')+'" class="eb-image-item-icon">');
            $videoImgUpload.find('.eb-image-item-title').text('Thumbnail Video');
            
            var img = new Image();
            img.src = $img.attr('src');
            img.onload = function() {
                $videoImgUpload.find('.eb-size-img').text($(img).prop('naturalWidth')+ ' × ' + $(img).prop('naturalHeight'));
            }
            
        } else {
            $videoImgUpload.hide();
            $videoImgUpload.find('.eb-image-item-icon').replaceWith('<img alt="" src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon">');
        }
        $('.eb-error-video').hide();
        $('#eb-box-image-card').find('.eb-list-image').html('').append(html);
    },
    initiate_import_area: function (){
	    if( $('.eb-upload-import-image').length ){
	        var myDropzone = new Dropzone('#my-awesome-dropzone', { 
	            url: "/",
	            uploadMultiple: false,
	            previewsContainer: false,
	        });

	        myDropzone.on("addedfile", function (file) {
	            var reader = new FileReader();
	            reader.readAsText(file, "UTF-8");
	            reader.onload = function (evt) {
	                page.set_content({
	        			html: evt.target.result,
	        			is_preview: true,
	        			is_html: true,
	        			is_editor: true,
	        			enfore_clear_undo: false
	        		});
	               $('.tabs-editor').find('li').eq(0).trigger('click');
	            }
	        }).on("dragenter", function (file) {
	            $('.eb-upload-import-image').addClass('eb-hover');
	        }).on("dragleave", function (file) {
	            $('.eb-upload-import-image').removeClass('eb-hover');
	        });
	        
	        $('.uii-inner').on('click', function(e){
	            e.preventDefault();
	            $("#my-awesome-dropzone").click();
	        });
	        $('.btn-upload-img').on('click', function(e){
	            e.preventDefault();
	        });
	    }
    },
    socialIconAction: function(){
        $('.eb-add-social-list').on('click', function(){
            var $tpl = $('.tpl-block.tpl-selected');
            var optionsShare = '';
            var optionsFollow = '';
			var optionsSocial = '';
			var optionsCalendar = '';
            var isCalendar = false;
			var indexIcon = 0;
			var labelDefault = 'Facebook Page URL';
			var urlDefault = 'https://www.facebook.com/';
			var textDefault = 'Facebook';
            
            if ( $tpl.attr('data-type') == 'box-social-follow' ){
                optionsFollow = '<option value="6">YouTube</option>'+
                                '<option value="7">Instagram</option>'+
                                '<option value="8">Vimeo</option>'+
                                '<option value="9">RSS</option>'+
                                '<option value="10">Email</option>'+
                                '<option value="11">Website</option>';
            } else if ( $tpl.attr('data-type') == 'box-calendar' ){
				isCalendar = true;
				indexIcon = 12;
				labelDefault = 'Google Calendar URL';
				urlDefault = '#';
				textDefault = 'Google Calendar';
                optionsCalendar = '<option value="12">Google</option>'+
                                '<option value="13">Outlook</option>'+
                                '<option value="14">Outlook Online</option>'+
                                '<option value="15">iCalendar</option>'+
                                '<option value="16">Yahoo!</option>';
            } else {
                optionsShare = '<option value="5">Forward to Friend</option>';
            }

			if ( !isCalendar ){
				optionsSocial = '<option value="0">Facebook</option>'+
								'<option value="1">Twitter</option>'+
								'<option value="2">Google +1</option>'+
								'<option value="3">LinkedIn</option>'+
								'<option value="4">Pinterest</option>';
			}
			
            $('.eb-list-group-social').append('<li class="item-social clearfix" idx="0"  datasortid="'+$('.eb-list-group-social').children('li').length+'">'+
                                '<a href="javascript:void(0);" class="et-btn-white eb-btn-delete-elm"><i class="icn"></i></a>'+
                                '<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>'+
                                '<div class="eb-icon-social eb-icon-'+indexIcon+'"></div> '+
                                '<select class="eb-social-list">'+
                                	optionsSocial+
                                    optionsShare+
                                    optionsFollow+
									optionsCalendar+
                                '</select>'+
                                '<div class="eb-fields-social">'+
                                    '<div class="t-field">'+
                                        '<div class="label">'+
                                        '<label>'+labelDefault+'</label>'+
                                        '</div>'+
                                        '<input type="text" class="txt-field eb-field-social-link" value="'+urlDefault+'"/>'+
                                    '</div>'+
                                    '<div class="t-field">'+
                                        '<div class="label">'+
                                            '<label>Line Text</label>'+
                                        '</div>'+
                                        '<input type="text" class="txt-field eb-field-social-text" value="'+textDefault+'"/>'+
                                    '</div>'+
                                '</div>'+
                            '</li>');
            		ll_combo_manager.make_combo('.eb-list-group-social select:visible');
                    
                    page.countGroupSocial();
                    page.isSocialFollowLink();
                    page.updateSocialHtml(true);
        });
        $('.eb-list-group-social').on('click', '.eb-btn-delete-elm', function(){
            $(this).parents('li').remove();
            
            page.updateSocialHtml();
            $('.eb-list-group-social').children('li').each(function(i){
                $(this).attr('datasortid', i);
            });
            page.countGroupSocial();
        });
        
        $('.eb-list-group-social').on('keyup change', '.eb-field-social-link', function(){ 
            var $tpl = $('.tpl-block.tpl-selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $table = $tpl.find('.ebShareContentItemContainer:first').children('table').eq( $li.attr('datasortid') );
            var val = $(this).val();
            
            if(val == ''){
                val = 'http://';
            }
            $table.find('.mcnShareTextContent, .mcnShareIconContent').find('a').attr('href',val);
        });
        $('.eb-list-group-social').on('keyup change', '.eb-field-social-text', function(){ 
            var $tpl = $('.tpl-block.tpl-selected');
            var $li = $(this).parents('li');
            var typeIcon = $li.attr('idx');
            var $table = $tpl.find('.ebShareContentItemContainer:first').children('table').eq( $li.attr('datasortid') );
            var val = $(this).val();
            var masDefaultFollowText = ['Facebook','Twitter','Google Plus','LinkedIn','Pinterest','Forward to Friend','YouTube','Instagram','Vimeo','RSS','Email','Website','Google Calendar','Outlook','Outlook Online','iCalendar','Yahoo! Calendar'];
            
            if(val == ''){
                val = masDefaultFollowText[typeIcon];
            }
            $table.find('.mcnShareTextContent a').text(val);
        });
        $('#select-content-to-share').change(function(){
            var val = $(this).val();
            var $tpl = $('.tpl-block.tpl-selected');
            var opt = $tpl.data('json');
            
            if( parseInt(val) ){
                if(opt.shareLink != '%%webversion_url_encoded%%'){
                	$('#shareCustomLink').val(opt.shareLink);
                }
                $('#shareShortDesc').val(opt.shareDesc);
                $('.eb-share-custom-text').show();
            } else {
                $('.eb-share-custom-text').hide();
                opt.shareLink = '%%webversion_url_encoded%%';
            }
            
            opt.shareCustomUrl = val;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.updateSocialShareLink();
        });
        $('#shareCustomLink').bind ('keyup change', function(){
            var val = $(this).val();
            var $tpl = $('.tpl-block.tpl-selected');
            var opt = $tpl.data('json');
            
            opt.shareLink = val;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.updateSocialShareLink();
        });
        $('#shareShortDesc').bind ('keyup change', function(){
            var val = $(this).val();
            var $tpl = $('.tpl-block.tpl-selected');
            var opt = $tpl.data('json');
            
            opt.shareDesc = val;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.updateSocialShareLink();
        });
        $('.eb-wrap-layout-social li').on('click', function(){
            var index = $(this).parent().find('li').index($(this));
            var $tpl = $('.tpl-block.tpl-selected');
            var opt = $tpl.data('json');
            var $table = $tpl.find('.ebShareContentItemContainer:first').children('table');
            
            $(this).addClass('selected').siblings('li').removeClass('selected');

            if (opt.display){
                if( index == 0  || index == 3 ){
                    $table.find('.mcnShareIconContent img').width('48px').height('48px').attr('width','48px').attr('height','48px');
                } else {
                    $table.find('.mcnShareIconContent img').width('28px').height('28px').attr('width','28px').attr('height','28px');
                }
            } else {
                $table.find('.mcnShareIconContent img').width('28px').height('28px').attr('width','28px').attr('height','28px');
            }
            
            opt.layout = index;
            $tpl.attr('data-json', JSON.stringify( opt ));
            page.updateSocialHtml();
            if (opt.display){
                page.updateDisplayOption();
            }
        });
        $('.eb-list-group-social').on('change', '.eb-social-list', function(){
            var val = $(this).val();
            page.addNewSocialService(val, $(this));
        });
    },
    countGroupSocial: function(){
        var $box = $('.eb-list-group-social');
        var $tpl = $('.tpl-block.tpl-selected');
        var $btn = $('.eb-add-social-list');
        
        if( $box.children('li').length > 1){
            $box.removeClass('eb-one-item');
        } else {
            $box.addClass('eb-one-item');
        }
        if ( $tpl.attr('data-type') == 'box-social-follow' ){
            if ($box.children('li').length < 11){
                $btn.show();
            } else{
                $btn.hide();
            }
        } else if ( $tpl.attr('data-type') == 'box-calendar' ){
            if ($box.children('li').length < 5){
                $btn.show();
            } else{
                $btn.hide();
            }
        } else{
            if ($box.children('li').length < 6){
                $btn.show();
            } else{
                $btn.hide();
            }
        }
        
    },
    isSocialFollowLink: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var $box = $('.eb-list-group-social').find('.eb-fields-social');

        if ( $tpl.attr('data-type') == 'box-social-follow' /*|| $tpl.attr('data-type') == 'box-calendar'*/){
            $box.show();
        } else {
            $box.hide();
        }
    },
    addNewSocialService: function(val, $el){
        var $tpl = $('.tpl-block.tpl-selected');
        var $li = $el.parent();
        var $table = $tpl.find('.ebShareContentItemContainer:first').children('table').eq( $li.attr('datasortid') );
        var masIcon = ['fb.png','tw.png','gg.png','in.png','pinterest.png','forward.png','youtube.png','inst.png','vimeo.png','rss.png','email.png','website.png','google.png','outlook.png','outlook_online.png','icalendar.png','yahoo.png'];
        var masTextLabel =['Facebook Page URL','Twitter URL or Username','Google Plus Profile URL','LinkedIn Profile URL','Pinterest Board URL','Friend Profile URL','YouTube Channel URL','Instagram Profile URL','Vimeo URL','RSS URL','Email Address','Page URL','Google Calendar','Outlook','Outlook Online','iCalendar','Yahoo! Calendar'];
        var masDefaultFollowText = ['Facebook','Twitter','Google Plus','LinkedIn','Pinterest','Forward to Friend','YouTube','Instagram','Vimeo','RSS','Email','Website','Google Calendar','Outlook','Outlook Online','iCalendar','Yahoo! Calendar'];
        var masDefaultShareText = ['Share','Tweet','+1','Share','Pin','Forward'];
        var masDefaultShareUrl = ['http://www.facebook.com/sharer/sharer.php?u=','http://twitter.com/intent/tweet?text=','https://plus.google.com/share?url=','http://www.linkedin.com/shareArticle?url=','https://www.pinterest.com/pin/find/?url=','mailto:?body='];
        var masDefaultFollowUrl = ['http://www.facebook.com/','http://www.twitter.com/','http://plus.google.com/','http://www.linkedin.com/','http://www.pinterest.com/','','http://www.youtube.com/','http://instagram.com/','https://vimeo.com/','http://www.yourfeedurl.com/','mailto:your@email.com','http://www.yourwebsite.com/','#','#','#','#','#','#','#','#'];
        var $boxFields = $li.find('.eb-fields-social');

        $li.find('.eb-icon-social').removeClass('eb-icon-0 eb-icon-1 eb-icon-2 eb-icon-3 eb-icon-4 eb-icon-5 eb-icon-6 eb-icon-7 eb-icon-8 eb-icon-9 eb-icon-10 eb-icon-11 eb-icon-12 eb-icon-13 eb-icon-14 eb-icon-15 eb-icon-16').addClass('eb-icon-'+val);
        $li.attr('idx', val);
        $table.attr('data-type-social',val);
        if ( $tpl.attr('data-type') == 'box-social-follow' || $tpl.attr('data-type') == 'box-calendar'){
            $boxFields.find('.t-field:first label').text(masTextLabel[val]);
            $boxFields.find('.t-field:first .txt-field').val(masDefaultFollowUrl[val]);
            $boxFields.find('.t-field:last .txt-field').val(masDefaultFollowText[val]);

            $table.find('.mcnShareTextContent a').text(masDefaultFollowText[val]).attr('href',masDefaultFollowUrl[val]);
            $table.find('.mcnShareIconContent a').attr('href',masDefaultFollowUrl[val]);
        } else {
            $boxFields.find('.t-field:last .txt-field').val(masDefaultShareText[val]);
            $table.find('.mcnShareTextContent a').text(masDefaultShareText[val]);
            page.updateSocialShareLink($li.attr('datasortid'));
        }
        var src = $table.find('.mcnShareIconContent').find('img').attr('src');
        $table.find('.mcnShareIconContent').find('img').attr('src', src.slice(0, src.lastIndexOf('/'))+'/'+masIcon[val]);
    },
    updateSocialShareLink: function(pos){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var $table = $tpl.find('.ebShareContentItemContainer:first').children('table');
        var masDefaultShareUrl = ['http://www.facebook.com/sharer/sharer.php?u=','http://twitter.com/intent/tweet?text=','https://plus.google.com/share?url=','http://www.linkedin.com/shareArticle?url=','https://www.pinterest.com/pin/find/?url=','mailto:?body='];
        var href = '';
        var customLink = '';
        var customDesc = '';
        if(opt.shareCustomUrl == '1'){
            customLink = opt.shareLink;
            customDesc = opt.shareDesc;
        } else {
            customLink = '%%webversion_url_encoded%%';
        }
        if (pos) {
            $table = $table.eq(pos);
        }
        $table.each(function(){
            var type = $(this).attr('data-type-social');
            if (type == '0'){
                href = masDefaultShareUrl[0] + customLink
            } else if (type == '1'){
                if(opt.shareCustomUrl == '1'){
                    href = masDefaultShareUrl[1] + customDesc + ': ' + customLink
                } else {
                    href = masDefaultShareUrl[1];
                }
                
            } else if (type == '2'){
                href = masDefaultShareUrl[2] + customLink
            } else if (type == '3'){
                href = masDefaultShareUrl[3] + customLink + '&mini=true&title=' + customDesc;
            } else if (type == '4'){
                href = masDefaultShareUrl[4] + customLink;
            } else if (type == '5'){
                href = masDefaultShareUrl[5] + customLink;
            }
            $(this).find('a').attr('href', href);
        });
    },
    sortableSocial: function(){
        $('.eb-list-group-social').sortable({
            cursor: 'move',
            handle: '.eb-btn-move-elm',
            tolerance: 'intersect',
            stop: function(event, ui) {
                page.updateSocialHtml();
                $('.eb-list-group-social').children('li').each(function(i){
                    $(this).attr('datasortid',i);
                });
            }
        });
    },
    updateSocialGroupHtml: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var $el = $tpl.find('.ebShareContentItemContainer:first').children('table');
        var optionsFollow = '';
        var optionsShare = '';
		var optionsSocial = '';
		var optionsCalendar = '';
        var isFollow =  false;
		var isCalendar =  false;
        var masDefaultFollowText = ['Facebook','Twitter','Google Plus','LinkedIn','Pinterest','Forward to Friend','YouTube','Instagram','Vimeo','RSS','Email','Website','Google Calendar','Outlook','Outlook Online','iCalendar','Yahoo! Calendar'];
        
        
        if ( $tpl.attr('data-type') == 'box-social-follow' ){
            isFollow = true;
            optionsFollow = '<option value="6">YouTube</option>'+
                            '<option value="7">Instagram</option>'+
                            '<option value="8">Vimeo</option>'+
                            '<option value="9">RSS</option>'+
                            '<option value="10">Email</option>'+
                            '<option value="11">Website</option>';
        } else if ( $tpl.attr('data-type') == 'box-calendar' ){
			isCalendar = true;
			optionsCalendar = '<option value="12">Google</option>'+
                            '<option value="13">Outlook</option>'+
                            '<option value="14">Outlook Online</option>'+
                            '<option value="15">iCalendar</option>'+
                            '<option value="16">Yahoo!</option>';
        } else {
            optionsShare = '<option value="5">Forward to Friend</option>';
        }
		
		if( !isCalendar ){
			optionsSocial = '<option value="0">Facebook</option>'+
							'<option value="1">Twitter</option>'+
							'<option value="2">Google +1</option>'+
							'<option value="3">LinkedIn</option>'+
							'<option value="4">Pinterest</option>';
		}
		
        $('.eb-list-group-social li').remove();
        
        $el.each(function(i){
            var $btn = $(this);
            var type = $btn.attr('data-type-social');
            var $url = $btn.find('.mcnShareIconContent a');
            var $text = $btn.find('.mcnShareTextContent a');
            var link = '';
            var text = '';
            var masTextLabel =['Facebook Page URL','Twitter URL or Username','Google Plus Profile URL','LinkedIn Profile URL','Pinterest Board URL','Friend Profile URL','YouTube Channel URL','Instagram Profile URL','Vimeo URL','RSS URL','Email Address','Page URL', 'Google Calendar URL', 'Outlook URL', 'Outlook Online URL', 'iCalendar URL', 'Yahoo! Calendar URL'];
            
            if($url.length){
                link = $url.attr('href');
                var text = masDefaultFollowText[$btn.attr('data-type-social')];
            }
            if($text.length){
                link = $text.attr('href');
                text = $text.text();
            }           
            $('.eb-list-group-social').append('<li class="item-social clearfix" idx="'+type+'" datasortid="'+i+'">'+
                                    '<a href="javascript:void(0);" class="et-btn-white eb-btn-delete-elm"><i class="icn"></i></a>'+
                                    '<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>'+
                                    '<div class="eb-icon-social eb-icon-'+type+'"></div> '+
                                    '<select class="eb-social-list">'+
                                    	optionsSocial+
                                        optionsShare+
                                        optionsFollow+
										optionsCalendar+
                                    '</select>'+
                                    '<div class="eb-fields-social">'+
                                        '<div class="t-field">'+
                                            '<div class="label">'+
                                                '<label>'+masTextLabel[type]+'</label>'+
                                            '</div>'+
                                            '<input type="text" class="txt-field eb-field-social-link" value="'+link+'"/>'+
                                        '</div>'+
                                        '<div class="t-field">'+
                                            '<div class="label">'+
                                                '<label>Line Text</label>'+
                                            '</div>'+
                                            '<input type="text" class="txt-field eb-field-social-text" value="'+text+'"/>'+
                                        '</div>'+
                                    '</div>'+
                                '</li>');
                        var $chosen = $('.eb-list-group-social select:last');
                		ll_combo_manager.make_combo($chosen);
                		ll_combo_manager.set_selected_value($chosen, type);
                        if(isFollow /*|| isCalendar*/ ){
                            $('.eb-list-group-social .eb-fields-social').show();
                        }
            });
        
    },
    updateDisplayOption: function(){
        var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
        var $el = $tpl.find('.ebShareContentItemContainer:first').children('table');
        var masIcon = ['fb.png','tw.png','gg.png','in.png','pinterest.png','forward.png','youtube.png','inst.png','vimeo.png','rss.png','email.png','website.png','google.png','outlook.png','outlook_online.png','icalendar.png','yahoo.png'];
        var masDefaultFollowText = ['Facebook','Twitter','Google Plus','LinkedIn','Pinterest','Forward to Friend','YouTube','Instagram','Vimeo','RSS','Email','Website','Google Calendar','Outlook','Outlook Online','iCalendar','Yahoo! Calendar'];
        var link = '';
        var imgSrc = '';
        var id = '';
        var text = '';
        var btnIconHtml = false;
        var btnTextHtml = false;
        var htmlBtn = '';
        
        $el.each(function(i){
            var $this = $(this);
            var $btn = $this.find('table:last > tbody');
            id = $this.attr('data-type-social');
            
            if ( $btn.find('.mcnShareIconContent').length && !$btn.find('.mcnShareTextContent').length ){
                link = $btn.find('.mcnShareIconContent > a').attr('href');
                imgSrc = $btn.find('.mcnShareIconContent > a > img').attr('src');
                text = $('.eb-list-group-social > li').eq(i).find('.eb-field-social-text').val();
                if ($.trim(text) == ''){
                    text = masDefaultFollowText[id];
                }
                btnIconHtml = $btn.find('.mcnShareIconContent').parent().html();
                btnTextHtml = '<td class="mcnShareTextContent" style="padding-left:5px;" align="left" valign="middle"><a href="'+link+'" style="color: rgb(80, 80, 80); font-size: 12px; font-weight: normal; line-height: 100%; text-align: center; text-decoration: none;" target="">'+text+'</a></td>';
                
            } else if ( !$btn.find('.mcnShareIconContent').length && $btn.find('.mcnShareTextContent').length ){
                link = $btn.find('.mcnShareTextContent > a').attr('href');
                text = $btn.find('.mcnShareTextContent > a').text();
                var src = $('.eb-social-style-icon > li.selected img:visible:first').attr('src');
                imgSrc = src.slice(0, src.lastIndexOf('/')) + '/' + masIcon[id];
                btnTextHtml = $btn.find('.mcnShareTextContent').parent().html();
                btnIconHtml = '<td class="mcnShareIconContent" align="center" valign="middle" width="28"><a href="'+link+'" target="_blank"><img src="'+imgSrc+'" style="display: block; width: 28px; height: 28px;" class="" width="28" height="28"></a></td>';
            } else {
                btnIconHtml = '<td class="mcnShareIconContent" align="center" valign="middle" width="28">'+$btn.find('.mcnShareIconContent').html()+'</td>';
                btnTextHtml = '<td class="mcnShareTextContent" style="padding-left:5px;" align="left" valign="middle">'+$btn.find('.mcnShareTextContent').html()+'</td>';
            }
            
            $btn.html('');
            htmlBtn = '<tr>';
            
            if (opt.display == '0'){
                htmlBtn += btnIconHtml;
                htmlBtn += '</tr>';
                $btn.html(htmlBtn);
            } else if (opt.display == '1'){
                htmlBtn += btnTextHtml;
                htmlBtn += '</tr>';
                $btn.html(htmlBtn);
            } else {
                if (opt.layout == '0' || opt.layout == '3'){
                    htmlBtn += btnIconHtml;
                    htmlBtn += '</tr>';
                    htmlBtn += '</tr>';
                    htmlBtn += btnTextHtml;
                } else {
                    htmlBtn += btnIconHtml;
                    htmlBtn += btnTextHtml;
                }
                htmlBtn += '</tr>';
                $btn.html(htmlBtn);
            }
            if (opt.display == '2' && opt.layout == '0'){
                $btn.parent().attr('width','100%');
                $el.find('.ebShareContentItem').attr('width','100%');
            } else {
                $btn.parent().attr('width','');
                $el.find('.ebShareContentItem').attr('width','');
            }
            if (opt.display == '2' && (opt.layout == '0' || opt.layout == '3') ){
                $btn.find('.mcnShareTextContent').css({
                    'padding-left': '0px',
                    'text-align': 'center'
                });
                $tpl.find('.mcnShareIconContent').css('padding-bottom','5px');
            } else {
                $btn.find('.mcnShareTextContent').css({
                    'padding-left': '5px',
                    'text-align': 'left'
                });
                $tpl.find('.mcnShareIconContent').css('padding-bottom','0px');
                if ( opt.display == '1' ){
                    $btn.find('.mcnShareTextContent').css({
                        'padding-left': '0px'
                    });
                }
            }
            if ( opt.display == '1' || opt.display == '2' ){
                var $a = $btn.find('.mcnShareTextContent a');
                var lineHeight = opt.lineHeight;
                page.update_font_family ($a, opt.fontTypeFace);
                $a.css({
                    //'font-family': opt.fontTypeFace + ', sans-serif',
                    'font-size': opt.fontSize + 'px',
                    'color': opt.color,
                    'font-weight': opt.fontWeight
                });
                if (lineHeight == 'None'){
                    $a.css('line-height','normal');
                }else{
                    $a.css('line-height',opt.lineHeight + '%');
                }
            }
        });
    },
    updateSocialHtml: function(isAddNew){
        var $tpl = $('.tpl-block.tpl-selected');
        var $el = $tpl.find('.ebShareContentItemContainer:first');
        var $table = $el.children('table');
        var html = '';
        var isFollow = false;
        var opt = $tpl.data('json');
        var masLinkImage = ['',''];
        var count = $('.eb-list-group-social').children('li').length;
        var widthTable = '';
        var isVertical = false;

        if ( opt.display == '0'  || opt.display == '2'){
            if ( opt.layout == '0' || opt.layout == '1' ){
                isVertical = true;
            }
        } else {
            if ( opt.layout == '0'){
                isVertical = true;
            }
        }

        if ( isVertical ){
            //console.log('ver');
            widthTable = '100%';
        }  else{
            //console.log('goriz');
            html = '<!--[if mso]>'+
                    '<table align="center" border="0" cellspacing="0" cellpadding="0">'+
                    '<tr>'+
                    '<![endif]-->';
        }
        $('.eb-list-group-social').children('li').each(function(i){
            var $li = $(this);
            var type = $li.attr('idx');
            var index = $li.attr('datasortid');
            if ( !isVertical ){
                html +='<!--[if mso]>'+
                    '<td align="center" valign="top">'+
                    '<![endif]-->';
            }
            if(isAddNew && count-1 == i){
                html += '<table data-type-social="0" width="'+widthTable+'" align="left" border="0" cellpadding="0" cellspacing="0">' + $table.eq(0).html() +'</table>';    
            } else {
               html += '<table data-type-social="'+$table.eq(index).attr('data-type-social')+'" width="'+widthTable+'" align="left" border="0" cellpadding="0" cellspacing="0">' + $table.eq(index).html() +'</table>';
            }
            if ( !isVertical ){
                html +='<!--[if mso]>'+
                '</td>'+
                '<![endif]-->';
            }        
                    
        });
        if ( !isVertical ){
            html +='<!--[if mso]>'+
            '</tr>'+
            '</table>'+
            '<![endif]-->';
        } 
        $el.html(html);
        $el.find('.ebShareContentItemContainer').each(function(i){
            if ( !isVertical ){
                $(this).css('padding-right','9px');
                if(opt.width =='1'){
                    $tpl.find('.ebShareContent').attr('width','100%').css('width','100%');
                } else {
                    $tpl.find('.ebShareContent').attr('width','auto').css('width','auto');
                }
                $tpl.find('.ebShareContent').find('table:first').attr('width','auto').css('width','auto');
            } else {
                $(this).css('padding-right','0');
                if(opt.width =='1'){
                    $tpl.find('.ebShareContent').attr('width','100%').css('width','100%');
                } else {
                    $tpl.find('.ebShareContent').attr('width','28px').css('width','28px');
                }
                $tpl.find('.ebShareContent').find('table:first').attr('width','28px').css('width','28px');
            }
            
            if(isAddNew && count-1 == i){
                $(this).css('padding-right','0px');
                if( $tpl.attr('data-type') == 'box-social-follow' ){
                    $(this).find('.mcnShareTextContent a').text('Facebook').attr('href','https://www.facebook.com/');
                    $(this).find('.mcnShareIconContent a').attr('href','https://www.facebook.com/');
                } else if( $tpl.attr('data-type') == 'box-calendar' ){
                    $(this).find('.mcnShareTextContent a').text('Google Calendar').attr('href','#');
                    $(this).find('.mcnShareIconContent a').attr('href','#');
                } else {
                    $(this).find('.mcnShareTextContent a').text('Share').attr('href','http://www.facebook.com/sharer/sharer.php?u=%%webversion_url_encoded%%');
                    $(this).find('.mcnShareIconContent a').attr('href','http://www.facebook.com/sharer/sharer.php?u=%%webversion_url_encoded%%');
                }
                var src= $(this).find('.mcnShareIconContent a img').attr('src');
                if( $tpl.attr('data-type') == 'box-calendar' ){
					$(this).find('.mcnShareIconContent a').find('img').attr('src', src.slice(0, src.lastIndexOf('/'))+'/google.png');
				} else{
					$(this).find('.mcnShareIconContent a').find('img').attr('src', src.slice(0, src.lastIndexOf('/'))+'/fb.png');
				}
            }
        });
    },
	updateSocialHtmlBtn: function(){
		var $tpl = $('.tpl-block.tpl-selected');
        var opt = $tpl.data('json');
		var newHtml = '';
		var $htmlWrap = $tpl.find('.ebShareContentItemContainer:first');

		newHtml = '<!--[if mso]>'+
					'<table align="center" border="0" cellspacing="0" cellpadding="0">'+
					'<tr>'+
					'<![endif]-->';

		$htmlWrap.children('table').each(function(i){
			var isHide = false;
			var displayed = '';
			if ( i == 0 ){
				if (opt.lnk1 == '0') {
					isHide = true;
					displayed = 'display: none;';
				}
			} else if( i == 1 ){
				if (opt.lnk2 == '0') {
					isHide = true;
					displayed = 'display: none;';
				}
			} else if( i == 2 ){
				if (opt.lnk3 == '0') {
					isHide = true;
					displayed = 'display: none;';
				}
			} else if( i == 3 ){
				if (opt.lnk4 == '0') {
					isHide = true;
					displayed = 'display: none;';
				}
			}
			
			newHtml += '<!--[if mso]>'+
					'<td align="center" valign="top">'+
					'<![endif]-->';	
					
			if (isHide){
				newHtml += '<!--[if !mso 9]><!-->';
			}		
			newHtml += '<table align="left" style="'+displayed+'"border="0" cellpadding="0" cellspacing="0">';
			newHtml += $(this).html();
			newHtml += '</table>'
			if (isHide){
				newHtml += '<!--<![endif]-->';
			}

			newHtml +='<!--[if mso]>'+
				'</td>'+
				'<![endif]-->';
		});
		newHtml +='<!--[if mso]>'+
		'</tr>'+
		'</table>'+
		'<![endif]-->';
		
		$htmlWrap.html(newHtml);
	},
	resizeTinymce: function(){
		try {
			var $box = $('.wrap-tabs-content:visible').find('.eb-editor-text');
			if ( tinymce && $box.length ){
				var id = $box .find('iframe').attr('id');
				var newId = id.replace('_ifr','');
				var fullHeight = $(window).height();
				var heightEditor = fullHeight - $box.find('iframe').offset().top - $('#footer').outerHeight();
				
				var tnmce_obj = tinymce.get(newId);
				if(typeof tnmce_obj != 'undefined' && tnmce_obj){
					tinymce.get(newId).settings.autoresize_max_height = heightEditor;
					tinymce.get(newId).settings.autoresize_min_height = heightEditor;
					tinymce.get(newId).settings.height = heightEditor;
					$('#' + id).height(heightEditor);
					tinymce.get(newId).getBody().focus();
				}
			}
		}catch (exc){}
	},
	set_calendar_control_urls: function (){
		var $tpl = $('.tpl-block.tpl-selected');
		var opt = $tpl.data('json');
		if (typeof opt != 'undefined' && opt && typeof opt.event != 'undefined' && opt.event) {
			var event = opt.event;
			$tpl.find ('.ebShareContentItem a img').each (function (){
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
					event_url = page.generate_add_to_calendar_url (event, event_type);
					$(this).parents ('table').eq(1).find('a').attr ('href', event_url);
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
	clearStyleAll: function(type){
		var $tpl = $('.tpl-block.tpl-selected');
		var opt = $tpl.data('json');
		var typeTpl = $tpl.attr('data-type');
		
		if ( type == 'bgColor' ){
			if ( typeTpl == 'box-text' ||  typeTpl == 'box-border-text' || typeTpl == 'box-footer' ){
				$('#boxTextBackground').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				$tpl.find('.ebTextContentContainer').css('background-color','');
				opt.boxesBackgroundColor = '#ffffff';
			} else if ( typeTpl == 'box-divider' ){
				$('#dividerBackgroundColor').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				$tpl.find('.ebDividerBlock').css('background-color','#ffffff');
				opt.backgroundColor = '#ffffff';
			} else if ( typeTpl == 'box-image-card' ){
				$('#cardBackground').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				$tpl.find('.ebImageBlock').css('background-color','#ffffff');
				opt.backgroundColor = '#ffffff';
			} else if ( typeTpl == 'box-video' ){
				$('#videoBackground').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				$tpl.find('.ebImageBlock').css('background-color','#ffffff');
				opt.backgroundColor = '#ffffff';
			} else if ( typeTpl == 'box-social-share' || typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#containerSocialBackground').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				$tpl.find('.ebShareContent').css('background-color','#ffffff');
				opt.containerBackground = '#ffffff';
			} else if ( typeTpl == 'box-button' ){
				$('#buttonBackground').colpickSetColor(LL_INSTANCE_DEFAULT_THEME_COLOR, true).css('background-color', '#'+LL_INSTANCE_DEFAULT_THEME_COLOR);
				$tpl.find('.ebButtonContentContainer').css('background-color','#'+LL_INSTANCE_DEFAULT_THEME_COLOR);
				opt.backgroundColor = '#'+LL_INSTANCE_DEFAULT_THEME_COLOR;
			}
			
		} else if ( type == 'bgButtonColor' ){
			if ( typeTpl == 'box-social-share'){
				$('#btnSocialBackground').colpickSetColor('fafafa', true).css('background-color', '#fafafa');
				$tpl.find('.ebShareContentItem').css('background-color','');
				opt.btnBackground = '#fafafa';
			} else if ( typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#btnSocialBackground').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				$tpl.find('.ebShareContentItem').css('background-color','');
				opt.btnBackground = '#ffffff';
			}
		} else if ( type == 'font' ){
			if ( typeTpl == 'box-text' ||  typeTpl == 'box-border-text' || typeTpl == 'box-footer' ){
				$('#boxTextTypeFace option[value="None"]').attr('selected', true);
				$("#boxTextTypeFace").trigger('liszt:updated');
				
				$('#boxTextWeight option[value="None"]').attr('selected', true);
				$("#boxTextWeight").trigger('liszt:updated');
				
				$('#boxTextSize option[value="None"]').attr('selected', true);
				$("#boxTextSize").trigger('liszt:updated');

				$('#boxTextColor').colpickSetColor('333333', true).css('background-color', '#333333');
				
				opt.color = '#333333';
				opt.fontTypeFace = 'None';
				opt.fontWeight = 'None';
				opt.fontSize = 'None';
				
				$tpl.find('.ebTextContent').css({
					color: '',
					fontSize: '',
					fontWeight: '',
					fontFamily: ''
				});
			} else if ( typeTpl == 'box-image-card' ){
				$('#cardTypeFace option[value="None"]').attr('selected', true);
				$("#cardTypeFace").trigger('liszt:updated');
				
				$('#cardWeight option[value="None"]').attr('selected', true);
				$("#cardWeight").trigger('liszt:updated');
				
				$('#cardSize option[value="None"]').attr('selected', true);
				$("#cardSize").trigger('liszt:updated');

				$('#cardTextColor').colpickSetColor('333333', true).css('background-color', '#333333');
				
				opt.color = '#333333';
				opt.fontTypeFace = 'None';
				opt.fontWeight = 'None';
				opt.fontSize = 'None';
				
				$tpl.find('.ebTextContent').css({
					color: '',
					fontSize: '',
					fontWeight: '',
					fontFamily: ''
				});
			} else if ( typeTpl == 'box-image-caption'){
				$('#captionTypeFace option[value="None"]').attr('selected', true);
				$("#captionTypeFace").trigger('liszt:updated');
				
				$('#captionWeight option[value="None"]').attr('selected', true);
				$("#captionWeight").trigger('liszt:updated');
				
				$('#captionSize option[value="None"]').attr('selected', true);
				$("#captionSize").trigger('liszt:updated');

				$('#captionTextColor').colpickSetColor('333333', true).css('background-color', '#333333');
				
				opt.color = '#333333';
				opt.fontTypeFace = 'None';
				opt.fontWeight = 'None';
				opt.fontSize = 'None';
				
				$tpl.find('.ebTextContent').css({
					color: '',
					fontSize: '',
					fontWeight: '',
					fontFamily: ''
				});
			} else if ( typeTpl == 'box-video' ){
				$('#videoTypeFace option[value="None"]').attr('selected', true);
				$("#videoTypeFace").trigger('liszt:updated');
				
				$('#videoWeight option[value="None"]').attr('selected', true);
				$("#videoWeight").trigger('liszt:updated');
				
				$('#videoSize option[value="None"]').attr('selected', true);
				$("#videoSize").trigger('liszt:updated');

				$('#videoTextColor').colpickSetColor('333333', true).css('background-color', '#333333');
				
				opt.color = '#333333';
				opt.fontTypeFace = 'None';
				opt.fontWeight = 'None';
				opt.fontSize = 'None';
				
				$tpl.find('.ebTextContent').css({
					color: '',
					fontSize: '',
					fontWeight: '',
					fontFamily: ''
				});
			} else if ( typeTpl == 'box-social-share' || typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#btnSocialTypeFace option[value="Arial"]').attr('selected', true);
				$("#btnSocialTypeFace").trigger('liszt:updated');
				
				$('#btnSocialWeight option[value="None"]').attr('selected', true);
				$("#btnSocialWeight").trigger('liszt:updated');
				
				$('#btnSocialSize option[value="12"]').attr('selected', true);
				$("#btnSocialSize").trigger('liszt:updated');

				$('#btnSocialColor').colpickSetColor('505050', true).css('background-color', '#505050');
				
				opt.color = '#505050';
				opt.fontTypeFace = 'Arial';
				opt.fontWeight = 'None';
				opt.fontSize = '12';
				
				$tpl.find('.mcnShareTextContent > a').css({
					color: '#505050',
					fontSize: '12px',
					fontWeight: 'Normal',
					fontFamily: 'Arial, sans-serif'
				});
			} else if ( typeTpl == 'box-button' ){
				$('#buttonTypeFace option[value="Arial"]').attr('selected', true);
				$("#buttonTypeFace").trigger('liszt:updated');
				
				$('#buttonWeight option[value="Bold"]').attr('selected', true);
				$("#buttonWeight").trigger('liszt:updated');
				
				$('#buttonSize option[value="16"]').attr('selected', true);
				$("#buttonSize").trigger('liszt:updated');

				$('#buttonTextColor').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				
				opt.color = '#ffffff';
				opt.fontTypeFace = 'Arial';
				opt.fontWeight = 'Bold';
				opt.fontSize = '16';
				
				$tpl.find('.ebButtonContent, .ebButton').css({
					color: '#ffffff',
					fontSize: '16px',
					fontWeight: 'Bold',
					fontFamily: 'Arial, sans-serif'
				});
			}
			
			
		} else if ( type == 'lineHeight'){
			if ( typeTpl == 'box-text' ||  typeTpl == 'box-border-text' || typeTpl == 'box-footer' ){
				$('#boxTextLineHeight option[value="None"]').attr('selected', true);
				$("#boxTextLineHeight").trigger('liszt:updated');
				
				opt.lineHeight = 'None';
				
				$tpl.find('.ebTextContent').css({
					lineHeight: '',
				});
			} else if ( typeTpl == 'box-image-card' ){
				$('#cardLineHeight option[value="None"]').attr('selected', true);
				$("#cardLineHeight").trigger('liszt:updated');
				
				opt.lineHeight = 'None';
				
				$tpl.find('.ebTextContent').css({
					lineHeight: '',
				});
			} else if ( typeTpl == 'box-image-caption'){
				$('#captionLineHeight option[value="None"]').attr('selected', true);
				$("#captionLineHeight").trigger('liszt:updated');
				
				opt.lineHeight = 'None';
				
				$tpl.find('.ebTextContent').css({
					lineHeight: '',
				});
			} else if ( typeTpl == 'box-video' ){
				$('#videoLineHeight option[value="None"]').attr('selected', true);
				$("#videoLineHeight").trigger('liszt:updated');
				
				opt.lineHeight = 'None';
				
				$tpl.find('.ebTextContent').css({
					lineHeight: '',
				});
			} else if ( typeTpl == 'box-social-share' || typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#btnSocialLineHeight option[value="None"]').attr('selected', true);
				$("#btnSocialLineHeight").trigger('liszt:updated');
				
				opt.lineHeight = '100';
				
				$tpl.find('.mcnShareTextContent > a').css({
					lineHeight: 'normal',
				});
			}
			
			
		} else if ( type == 'textAlign'){
			if ( typeTpl == 'box-text' ||  typeTpl == 'box-border-text' || typeTpl == 'box-footer' ){
				$('#boxTextAlign').find('li.selected').removeClass('selected');
				
				opt.textAlign = 'None';
				
				$tpl.find('.ebTextContent').css({
					textAlign: '',
				});
			} else if ( typeTpl == 'box-image-card' ){
				$('#cardTextAlign').find('li.selected').removeClass('selected');
				
				opt.textAlign = 'None';
				
				$tpl.find('.ebTextContent').css({
					textAlign: '',
				});
			} else if ( typeTpl == 'box-image-caption'){
				$('#captionTextAlign').find('li.selected').removeClass('selected');
				
				opt.textAlign = 'None';
				
				$tpl.find('.ebTextContent').css({
					textAlign: '',
				});
			} else if ( typeTpl == 'box-video' ){
				$('#videoTextAlign').find('li.selected').removeClass('selected');
				
				opt.textAlign = 'None';
				
				$tpl.find('.ebTextContent').css({
					textAlign: '',
				});
			}
			
			
		} else if ( type == 'border' ){
			if ( typeTpl == 'box-border-text' || typeTpl == 'box-footer' ){
				$('#boxTextBorderType option[value="None"]').attr('selected', true);
				$("#boxTextBorderType").trigger('liszt:updated');
				
				$('#boxTextBorderWidth').val('0');
				
				$('#boxTextBorderColor').colpickSetColor('999999', true).css('background-color', '#999999');
				
				opt.boxesBorderType = 'None';
				opt.boxesBorderWidth = '0';
				opt.boxesBorderColor = '#999999';
				
				$tpl.find('.ebTextContent').css({
					border: '',
				});
			} else if ( typeTpl == 'box-divider' ){
				$('#dividerBorderType option[value="Solid"]').attr('selected', true);
				$("#dividerBorderType").trigger('liszt:updated');
				
				$('#dividerBorderWidth').val('1');
				
				$('#dividerBorderColor').colpickSetColor('999999', true).css('background-color', '#999999');

				opt.borderType = 'Solid';
				opt.borderWidth = '1';
				opt.borderColor = '#999999'; 

				$tpl.find('.ebDividerContent').css({
					borderTopWidth: '1px',
					borderTopStyle: 'solid', 
					borderTopColor: '#999999',
				});
			} else if ( typeTpl == 'box-image-card' ){
				$('#cardBorderType option[value="None"]').attr('selected', true);
				$("#cardBorderType").trigger('liszt:updated');
				
				$('#cardBorderWidth').val('0');
				
				$('#cardBorderColor').colpickSetColor('999999', true).css('background-color', '#999999');
				
				opt.borderType = 'None';
				opt.borderWidth = '0';
				opt.borderColor = '#999999';
				
				$tpl.find('.ebImageBlock').css({
					border: '',
				});
			} else if ( typeTpl == 'box-video' ){
				$('#videoBorderType option[value="None"]').attr('selected', true);
				$("#videoBorderType").trigger('liszt:updated');
				
				$('#videoBorderWidth').val('0');
				
				$('#videoBorderColor').colpickSetColor('999999', true).css('background-color', '#999999');
				
				opt.borderType = 'None';
				opt.borderWidth = '0';
				opt.borderColor = '#999999';
				
				$tpl.find('.ebImageBlock').css({
					border: '',
				});
			} else if ( typeTpl == 'box-social-share' || typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#containerSocialBorderType option[value="None"]').attr('selected', true);
				$("#containerSocialBorderType").trigger('liszt:updated');
				
				$('#containerSocialBorderWidth').val('0');
				
				$('#containerSocialBorderColor').colpickSetColor('ffffff', true).css('background-color', '#ffffff');
				
				opt.containerBorderType = 'None';
				opt.containerBorderWidth = '0';
				opt.containerBorderColor = '#ffffff';
				
				$tpl.find('.ebShareContent').css({
					border: '',
				});
			} else if ( typeTpl == 'box-button' ){
				$('#buttonBorderType option[value="Solid"]').attr('selected', true);
				$("#buttonBorderType").trigger('liszt:updated');
				
				$('#buttonBorderWidth').val('1');
				
				$('#buttonBorderColor').colpickSetColor(LL_INSTANCE_DEFAULT_THEME_COLOR, true).css('background-color', '#'+LL_INSTANCE_DEFAULT_THEME_COLOR);
				
				opt.borderType = 'Solid';
				opt.borderWidth = '1';
				opt.borderColor = '#'+LL_INSTANCE_DEFAULT_THEME_COLOR;
				
				$tpl.find('.ebButtonContentContainer').css({
					border: '1px solid #'+LL_INSTANCE_DEFAULT_THEME_COLOR,
				});
			}
		} else if ( type == 'borderButton' ){
			
			if ( typeTpl == 'box-social-share'){
				$('#btnSocialBorderType option[value="Solid"]').attr('selected', true);
				$("#btnSocialBorderType").trigger('liszt:updated');
				
				$('#btnSocialBorderWidth').val('1');
				
				$('#btnSocialBorderColor').colpickSetColor('cccccc', true).css('background-color', '#cccccc');
				
				opt.btnBorderType = 'Solid';
				opt.btnBorderWidth = '1';
				opt.btnBorderColor = '#cccccc';
				
				$tpl.find('.ebShareContentItem').css({
					border: '1px solid #cccccc',
				});
			} else if ( typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#btnSocialBorderType option[value="None"]').attr('selected', true);
				$("#btnSocialBorderType").trigger('liszt:updated');
				
				$('#btnSocialBorderWidth').val('0');
				
				$('#btnSocialBorderColor').colpickSetColor('cccccc', true).css('background-color', '#cccccc');
				
				opt.btnBorderType = 'None';
				opt.btnBorderWidth = '0';
				opt.btnBorderColor = '#ffffff';
				
				$tpl.find('.ebShareContentItem').css({
					border: '',
				});
			}
		} else if ( type == 'borderPadding' ){
			
			$('#dividerBorderColor').colpickSetColor('999999', true).css('background-color', '#999999');
				
			$('#dividerPaddingTop').val('18');
			$('#dividerBorderWidth').val('18');
			
			opt.paddingTop = '18';
			opt.dividerPaddingBottom = '18'; 
			
			$tpl.find('.ebDividerBlockInner').css({
				padding: '18px 0',
			});
		} else if ( type == 'btnPadding' ){
			$('#buttonPadding').val('12');
			
			opt.padding = '12';
			
			$tpl.find('.ebButtonContent').css({
				padding: '12px',
			});
		} else if ( type == 'btnRadius' ){
			
			if ( typeTpl == 'box-social-share' || typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#btnSocialBorderRadius').val('5');
				opt.btnBorderRadius = '5'; 
				
				$tpl.find('.ebShareContentItem').css({
					borderRadius: '5px',
				});
			} else if ( typeTpl == 'box-button' ){
				$('#buttonRadius').val('3');
				opt.radius = '3'; 
				
				$tpl.find('.ebButtonContentContainer').css({
					borderRadius: '3px',
				});
			}
		} else if ( type == 'containerSocialPadding' ){

			if ( typeTpl == 'box-social-share' || typeTpl == 'box-social-follow' || typeTpl == 'box-calendar'){
				$('#containerSocialPadding').val('0');
				opt.containerPadding = '0';

				$tpl.find('.ebShareBlockInner').css({
					padding: '0px',
				});
			}
		}
		
		$tpl.attr('data-json', JSON.stringify( opt ));
	},
	titleEmailLength: function(){
		var $box = $('.et-top-header .h-edit-text');
		
		if ( $box.length && $('.step-nav-db, .step-nav-template-email').length ){
			var maxWidth = $('.step-nav-db, .step-nav-template-email').offset().left - $box.offset().left;
			
			$box.css('width', maxWidth-22);
			$box.find('.t').css('width', maxWidth-22);
			$box.css('max-width', 'none');
			$box.find('.t').css('max-width', 'none');
		}
	} ,

	addIfCondition: function (conditionStart, withElse) {
		var condition_content = tinymce.get('advanced-editor-if-condition').getContent() === '' ? '<div> </div>' : tinymce.get('advanced-editor-if-condition').getContent();
		var condition =  conditionStart + condition_content ;
		if (withElse) {
			var condition_else_content = tinymce.get('advanced-editor-else-if-condition').getContent() === '' ? '<div> </div>' : tinymce.get('advanced-editor-else-if-condition').getContent();
			condition = condition + '{% else %} ' + condition_else_content;
		}
		condition = condition + '{% endif %}';
		page.active_html_editor.execCommand('mceInsertContent', false, condition);
		ll_popup_manager.close('#ll_popup_email_insert_condition');
	}
};

var tinymceOpts = {
    autoresize_min_height: 300,
    selector: "#editor-box-text, #editor-box-text-2, #editor-box-text-3, #editor-box-text-card, #editor-box-text-caption, #editor-box-text-caption-2, #editor-box-text-video, #eb-editor-html",
    plugins: [
            "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
            "contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern",
            "autoresize"
    ],
    toolbar1: "bold italic underline | link unlink image | alignleft aligncenter alignright alignjustify | bullist numlist | cfbutton | ccbutton | dcbutton ",
    toolbar2: "heading fontselect fontsizeselect | forecolor backcolor | ltr rtl | code | undo redo removeformat",
    //content_css: "js/tinymce4.6/tinymce_override.css", // At the bottom added this only for advanced editor because it was disabling the scroll bar within the editor
    menubar: false,
	gecko_spellcheck:true,
	browser_spellcheck: true,
	toolbar_items_size: 'medium',
    relative_urls : 'false', 
    theme_advanced_buttons3_add : "ltr,rtl",
	forced_root_block : "div",  // old "&nbsp;"
    force_br_newlines : true,
    force_p_newlines : false,
    remove_trailing_brs: false,
	contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
    //fontsize_formats: '1pt 2pt 3pt 4pt 5pt 6pt 7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt 31pt 32pt 33pt 34pt 35pt 36pt 37pt 38pt 39pt 40pt 41pt 42pt 43pt 44pt 45pt 46pt 47pt 48pt 49pt 50pt 51pt 52pt 53pt 54pt 55pt 56pt 57pt 58pt 59pt 60pt 61pt 62pt 63pt 64pt',
	//fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
	fontsize_formats: "8px 10px 12px 14px 16px 18px 20px 22px 24px 26px 30px 36px",
	
    entity_encoding : "raw",
    setup: function(editor) {
        editor.addButton('heading', {
            type: 'menubutton',
            text: 'Heading',
            icon: false,
            menu: [
                   {text: 'Custom Heading 1', onclick: function() {
                           var opt = $('#bodyTable').data('json');
                           var h1Shadow = opt.h1ShadowX + 'px ' + opt.h1ShadowY + 'px ' + opt.h1ShadowBlur + 'px ' + opt.h1ShadowColor;
                           editor.execCommand('mceReplaceContent', false, '<p class="eb-h1" style="margin-bottom: 15px; margin-top: 0; line-height: 125%;"><span style="font-size: 30px; line-height: 125%; color: '+opt.h1Color+'; text-shadow: '+h1Shadow+'; ">'+editor.selection.getContent()+'</span></p>');
                   }},
                   {text: 'Custom Heading 2', onclick: function() {
                           var opt = $('#bodyTable').data('json');
                           var h2Shadow = opt.h2ShadowX + 'px ' + opt.h2ShadowY + 'px ' + opt.h2ShadowBlur + 'px ' + opt.h2ShadowColor;
                           editor.execCommand('mceReplaceContent', false, '<p class="eb-h2" style="margin-bottom: 15px; margin-top: 0; line-height: 125%;"><span style="font-size: 20px; line-height: 125%; color: '+opt.h2Color+'; text-shadow: '+h2Shadow+'; ">'+editor.selection.getContent()+'</span></p>');
                   }},
                   {text: 'Heading 1', onclick: function() {
                       editor.execCommand('mceReplaceContent', false, '<h1 style="font-size: 26px; padding:0; margin: 0;">'+editor.selection.getContent()+'</h1>');
                   }},
                   {text: 'Heading 2', onclick: function() {
                       editor.execCommand('mceReplaceContent', false, '<h2 style="font-size: 22px; padding:0; margin: 0;">'+editor.selection.getContent()+'</h2>');
                   }},
                   {text: 'Heading 3', onclick: function() {
                       editor.execCommand('mceReplaceContent', false, '<h3 style="font-size: 16px; padding:0; margin: 0;">'+editor.selection.getContent()+'</h3>');
                   }},
                   {text: 'Heading 4', onclick: function() {
                       editor.execCommand('mceReplaceContent', false, '<h4 style="font-size: 14px; padding:0; margin: 0;">'+editor.selection.getContent()+'</h4>');
                   }},
                   {text: 'Paragraph', onclick: function() {
                       editor.execCommand('mceReplaceContent', false, '<p>'+editor.selection.getContent()+'</p>');
                   }}
               ]
        });
		// Add a custom field button
        editor.addButton('cfbutton', {
			title : 'Fields',
            text: 'Fields',
			onclick : function() {
				//javascript: ShowCustomFields('html', 'myDevEditControl', '%%PAGE%%'); return false;
				page.active_html_editor = editor;
				ll_popup_manager.open('#ll_popup_email_insert_token')
			}
		});
		editor.addButton('ccbutton', {
			title : 'Conditions',
			text: 'Conditions',
			onclick : function() {
				//javascript: ShowCustomFields('html', 'myDevEditControl', '%%PAGE%%'); return false;
				page.active_html_editor = editor;
				ll_combo_manager.set_selected_value('#container_ll_condition_fields_'+ll_combo_manager.get_selected_value('#select_insert_ll_condition_field_category')+' select', '');
				ll_combo_manager.set_selected_value('#select_ll_condition_value', '');
				$('#add_if_else').prop("checked", false);
				$('#case-sensitive').prop("checked", true);
				$('#container-else-if-condition').hide();
				tinymce.get('advanced-editor-if-condition').setContent('');
				tinymce.get('advanced-editor-else-if-condition').setContent('');
				ll_popup_manager.open('#ll_popup_email_insert_condition');
			}
		});
        /*
        if(typeof is_has_access_dynamic_contents != 'undefined' && is_has_access_dynamic_contents){
    		// Add a custom field button
            editor.addButton('dcbutton', {
    			title : 'Dynamic',
                text: 'Dynamic',
    			onclick : function() {
    				//javascript: ShowCustomFields('html', 'myDevEditControl', '%%PAGE%%'); return false;
    				page.active_html_editor = editor;
    				ll_popup_manager.open('#ll_popup_email_insert_dynamic_content_tag')
    			}
    		});
        }
        */
        editor.on("change", function(e){
            page.tplCode.removeTplCode();
            page.updateElementTpl();
        });
	
		editor.on("ExecCommand", function(){
			page.tplCode.removeTplCode();
			page.updateElementTpl();
		});
        editor.on("setcontent", function(e){
        	if (!page.html_edit_manual) {
	            page.tplCode.removeTplCode();
	            page.updateElementTpl();
				$("#eb-editor-html_ifr").contents().find("html, body").css('cssText', 'height: auto !important');
        	}
        	page.html_edit_manual = false;
        });
        editor.on("keyup", function(){
            page.tplCode.removeTplCode();
            page.updateElementTpl();
        });
		editor.on('init', function(e) {
			//console.log('init event', e);
			//console.log('editor', editor);
			setTimeout(function(){
				page.resizeTinymce();
			}, 100)
			$(window).resize(function(){
				page.resizeTinymce();
			});
			
			/**
			 * EA - Jan12-2020
			 * Had to add this since the init_instance_callback was not being called on firefox
			 */
			setTimeout(function(){
				editor.is_initiatlized = true;
			}, 2000)
		});
    },
	
	init_instance_callback: function (inst){
		inst.is_initiatlized = true;
		$('.email-editor .mce-i-image').parents('.mce-btn').unbind('click');
		$('.email-editor .mce-i-image').parents('.mce-btn').bind('click',function(){
			var $box = $('.tpl-block.tpl-selected');
			var type = $box.attr('data-type');
			switch (type){
				case 'box-text':
				case 'box-border-text':
					show_warning_message('Images added from the WYSIWYG editor should not exceed 564px. To ensure mobile responsiveness, use the Image, Image Group, Image Card, and Image & Caption elements for images.');
					break;
				case 'box-image-card':
				case 'box-image-caption':
					show_warning_message('Images added from the WYSIWYG editor should not exceed 564px. To ensure mobile responsiveness, use the "Upload an Image" section of this element.');
					break;

			}
		});
	},
	/* //file_browser_callback
	file_picker_callback:function(callback, value, meta){
		if (meta.filetype == 'image') {
			show_warning_message('Images added in text elements should not exceed 564px. To ensure mobile responsiveness, use the Image, Image Group, Image Card, and Image & Caption elements for images.');
			callback();
		}
	},*/

	autosave_ask_before_unload: false,
	external_plugins: {
		"moxiemanager": _moxiemanager_plugin
	},
	moxiemanager_title: 'Media Manager',
	/*spellchecker_rpc_url: 'spellchecker.php',
	browser_spellcheck : true,*/
};
if (page.ll_email_builder_step == 'setup_advanced') {
	tinymceOpts.content_css = "js/tinymce4.6/tinymce_override.css";
}

$(document).ready(function() {
    page.init();
	var height = $('#mainWrapper').outerHeight() - $('.et-top-header').outerHeight() - $('.et-tabs ul').outerHeight() - 35;
	if($('.info-msg').length){
		height = height - $('.info-msg').height()
	}
	$('.et-tab-content .scrollbar-inner').height(height);

});

