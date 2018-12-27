var ll_dialog_draft = {
	ll_dialog_draft_html: '',
	modal_width: '',
	modal_height: '',
	loading_delay: '',
	cookie_duration: '',
	is_do_not_show_if_manually_closed: '1',
	is_do_not_show_if_converted: '1',
	background_blue: '',
	success_message: '',
	redirect_url: '',
	dialog_zone_container_id: '',
	engagement_type: '',
	engagement_type_on_exit_sensitivity: '',
	engagement_type_on_page_click_count: '',
	engagement_type_on_page_scroll_percentage: '',
	appearance_type: '',
	canvas_position: '',
	ll_abstract_campaign_id: 0,
	ll_list_ids: [],
	ll_automation_ids: []
}
var page = {
	ll_dialog_id: 0,
	ll_dialog_draft: '',
	ll_dialog_draft_last: '',
	ll_dialog_type_alias: '',
	ll_dialog_theme_id: 0,
	auto_save_mode: true,
	is_resizing_element: false,

	is_done_initiating_html_editor: false,
	
	ll_abstract_campaigns: [],
	ll_automations: [],
	//ll_automations_ready: [],
	ll_lists: [],
	//ll_lists_excluding_automation_lists: [],
	folderID: 0,
	folderPath: '',
	ll_abstract_campaign_id: 0,
	init: function(){
		this.ll_dialog_id = ll_dialog_id;
		this.ll_dialog_type_alias = ll_dialog_type_alias;
		this.folderID = folderID;
		this.folderPath = folderPath;
		this.ll_abstract_campaign_id = abstract_campaign_id;
		$('select').chosen({
			search_contains: true,
			single_backstroke_delete: false
		});
		
		$('body').on('click', function(e){
			var $target = $(e.target);
			if ( !$target.hasClass('colpick') && !$target.parents('.colpick').length && !$target.parents('.right-panel-folders').length){
				$('.selected-elements').removeClass('selected-elements');
				$('.db-slide-content.active').removeClass('active').animate({left: '-305px'},200);
			}
			if ( !$target.hasClass('db-btn-preview') && !$target.parents('.db-preview').length ){
				$('.db-preview.selected').removeClass('selected');
			}
		});
		$('.left-sidebar-settings').on('click', function(e){
			e.stopPropagation();
		});
		$('.step-nav-db').each(function(){
			$(this).css('margin-left',-$(this).width()/2);
		});
		$('.db-btn-preview').on('click', function(){
			$(this).parent().toggleClass('selected');
		});
		$('.db-btn-go-preview').on('click', function(){
			$(this).parents('.db-preview').removeClass('selected');
		});
		$('.ds-slide-head').on('click', function(e){
			e.stopPropagation();
			var panel = $(this).attr('data-slide');
			if (panel == 'settings' && ($('.builder-popup').hasClass('db-modal-popup')) ){
				page.heightPopupUpdate();
			}
			$('.db-slide-' + panel).addClass('active').animate({left: 0},300);
			return false;
		});
		$('.close-slide-panel, .save-slide-panel').on('click', function(){
			$(this).parents('.db-slide-content').removeClass('active').animate({left: '-305px'},300);
			$('.selected-elements').removeClass('selected-elements');
		});
		$('.db-popup-upload-image .db-btn-cancel').on('click', function(){
			$('.db-popup-upload-image').hide();
		});
		$('.db-popup-upload-image .db-btn-cancel').on('click', function(){
			$('.db-popup-upload-image').hide();
		});

		$('.choose-folder .t-btn-gray').on('click', function(e){
			e.preventDefault();
			var FolderID = $(this).closest('.choose-folder').attr('data-id');
			ll_folders_panel.open(FolderID);
		});
		

		/*$('#is_enable_email_validation').on('click', function(){
			if ($(this).is(':checked')) {
				$('.email_validation_timeout_div').show();
			} else {
				$('.email_validation_timeout_div').hide();
			}
		});*/

		$('#input_video_url').bind('change', function(){
			$('.db-container-video iframe').attr('src', $(this).val())
		})
		
		$('.txt_field').live('click', function(e){
			e.stopPropagation();
			var $field = $(this);
			return page.field_click($field);
		})
		
		$('.db-social-btn a').live('click', function(e){
			e.stopPropagation();
			$('.db-slide-social-network').addClass('active').animate({left: 0},300);
			return false;
		})
		
		$('.db-change-image').live('click', function(){
			page.set_auto_save_mode_status(false);
			page.container_selected_image = $(this).parent()
			moxman.browse({
				view: 'thumbs',
				title: 'Media Manager',
				filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
				filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
				fileinfo_fields: 'url',
				//fileinfo_fields: 'path url',
				/*disabled_tools: 'upload,create,manage,filter',*/
				oninsert: function(args) {
					if(args.files[0].url){
						if(!page.container_selected_image.find('img.image-shown').length){
							page.container_selected_image.removeClass('db-none-image')
							page.container_selected_image.append('<img class="image-shown" />')
						}
						page.container_selected_image.find('img.image-shown').attr('src', args.files[0].url)
					}
					page.set_auto_save_mode_status(true);
				}		
			});
		})
		$('.db-btn-change-dialog-background').bind('click', function(){
			moxman.browse({
				view: 'thumbs',
				title: 'Media Manager',
				filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
				filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
				fileinfo_fields: 'url',
				//fileinfo_fields: 'path url',
				/*disabled_tools: 'upload,create,manage,filter',*/
				oninsert: function(args) {
					if(args.files[0].url){
						if ($('.db-theme-7').length){
							$('.db-template-popup-content').css('background-image', "url('" + args.files[0].url + "')")
						} else {
							$('.db-blur').css('background-image', "url('" + args.files[0].url + "')")
						}
					}
				}		
			});
		})
		if ( !$('.db-modal-popup').length ){
			tinymce.init({
				selector: ".editor-text-popup textarea",
				plugins: [
						"advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
						"searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
						"table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
				],
				toolbar1: "newdocument fullpage | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | styleselect formatselect fontselect fontsizeselect",
				toolbar2: "cut copy paste | searchreplace | bullist numlist | outdent indent blockquote | undo redo | link unlink anchor image media code | insertdatetime preview | forecolor backcolor",
				toolbar3: "table | hr removeformat | subscript superscript | charmap emoticons | print fullscreen | ltr rtl | spellchecker | visualchars visualblocks nonbreaking template pagebreak restoredraft",
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
			    //fontsize_formats: '1pt 2pt 3pt 4pt 5pt 6pt 7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt 31pt 32pt 33pt 34pt 35pt 36pt 37pt 38pt 39pt 40pt 41pt 42pt 43pt 44pt 45pt 46pt 47pt 48pt 49pt 50pt 51pt 52pt 53pt 54pt 55pt 56pt 57pt 58pt 59pt 60pt 61pt 62pt 63pt 64pt',
				fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
				
				menubar: false,
				toolbar_items_size: 'small',
				
				autosave_ask_before_unload: false,

				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',

				style_formats: [
						{title: 'Bold text', inline: 'b'},
						{title: 'Example 1', inline: 'span', classes: 'example1'},
						{title: 'Example 2', inline: 'span', classes: 'example2'},
						{title: 'Table styles'},
						{title: 'Table row 1', selector: 'tr', classes: 'tablerow1'}
				],

				templates: [
						{title: 'Test template 1', content: 'Test 1'},
						{title: 'Test template 2', content: 'Test 2'}
				],
				setup : function(editor) {
					editor.on('init', function(e) {
						page.is_done_initiating_html_editor = true;
					});
				}
			});
		} else {
			tinymce.init({
				selector: ".editor-text-popup textarea",
				plugins: [
					"advlist autolink lists link image charmap print preview anchor",
					"searchreplace visualblocks code fullscreen",
					"insertdatetime media table contextmenu paste"
				],

			    //fontsize_formats: '1pt 2pt 3pt 4pt 5pt 6pt 7pt 8pt 9pt 10pt 11pt 12pt 13pt 14pt 15pt 16pt 17pt 18pt 19pt 20pt 21pt 22pt 23pt 24pt 25pt 26pt 27pt 28pt 29pt 30pt 31pt 32pt 33pt 34pt 35pt 36pt 37pt 38pt 39pt 40pt 41pt 42pt 43pt 44pt 45pt 46pt 47pt 48pt 49pt 50pt 51pt 52pt 53pt 54pt 55pt 56pt 57pt 58pt 59pt 60pt 61pt 62pt 63pt 64pt',
				fontsize_formats: "8px 10px 12px 14px 18px 24px 36px",
				
				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',
				setup : function(editor) {
					editor.on('init', function(e) {
						page.is_done_initiating_html_editor = true;
					});
				},
				
				toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable"
			});
		}
		/*$('.h-edit-text span').keydown(function(e) {
			// trap the return key being pressed
			if (e.keyCode === 13) {
				// insert 2 br tags (if only one br tag is inserted the cursor won't go to the next line)
				//document.execCommand('insertHTML', false, '<br><br>');
				$('.db-dialog-name-inner span').blur();
				// prevent the default behaviour of return key pressed
				return false;
			}
		});*/
		$('.btn-save-content').on('click', function(e){
			e.stopPropagation();
			var $activeContentBlock = $('.db-outer-content.selected');
			//tinymce.activeEditor.save();
			var content = tinymce.activeEditor.getContent();
			tinymce.activeEditor.setContent('');
			$activeContentBlock.find('.db-html-el').html(content);
			$activeContentBlock.removeClass('selected');
			$('.editor-text-popup').hide();
			if ($('.db-ribbon-popup').length){
				page.heightContentFooterAndRibbonPopup();
				page.ribbonAppearance();
			}
			if ($('.db-footer-popup').length){
				page.heightContentFooterAndRibbonPopup();
			}
			if ($('.db-modal-popup').length){
				page.positionPopupModal();
			}
			if ($('.db-theme-9').length){
				page.videoTheme9();
			}
			if ($('.db-theme-5').length){
				$('.db-theme-5 .db-wrap-vertical-content').height('204px');
				page.heightColTheme5();
				page.positionPopupModal();
			}
			if ( $('.db-popup-canvas').length ){
				page.isPositionCustomPopup();
			}
			
			page.set_auto_save_mode_status(true);
			return false;
		});
		$('.btn-cancel-content').on('click', function(e){
			e.stopPropagation();
			tinymce.activeEditor.save();
			$('.db-outer-content').removeClass('selected');
			$('.editor-text-popup').hide();
			
			page.set_auto_save_mode_status(true);
			return false;
		});
		$('.db-clear-el').on('click', function(e){
			e.stopPropagation();
			$(this).parent().find('.db-html-el').html('');
			if ( $('.builder-popup').hasClass('db-modal-popup') ){
				page.positionPopupModal();
			}
			if ( $('.builder-popup').hasClass('db-theme-9') ){
				$('.db-container-video').css('padding-bottom','200px');
				$('.db-theme-9 .db-wrap-vertical-content').height('200px');
				page.videoTheme9();
				page.positionPopupModal();
			}
			if ( $('.builder-popup').hasClass('db-theme-5') ){
				$('.db-theme-5 .db-wrap-vertical-content').height('204px');
				page.heightColTheme5();
				page.positionPopupModal();
			}
			return false;
		});
		$('#db-number-columns input:radio').on('click', function(){
			page.numberColumns();
		});
		$('.db-close-popup-style input:radio').on('click', function(){
			page.styleClosePopup();
		});
		$('.db-marker-popup-style input:radio, .db-marker-popup-style input:checkbox').on('click', function(){
			page.styleMarkersPopup();
		});
		$('.db-btn-go-preview').on('click', function(){
			var val = $(this).prev('input').val();
			var $btn = $('.db-btn-preview');
			if( val != ''){
				$btn.addClass('db-loading-preview');
				$('.db-preview-site').html('<iframe src="'+val+'" scrolling="no" style="height: 100%; width: 100%;"></iframe>');
				$('.db-preview-site iframe').off('load').on('load', function() {
					 $btn.removeClass('db-loading-preview');
				});
			}
			return false;
		});
		/**
		 * *****************************************************************************
		 * *****************************************************************************
		 */
		$('.container_dialog_type').bind('click', function(){
			var ll_dialog_type_alias = $(this).attr('ll_dialog_type_alias');
			if(typeof ll_dialog_type_alias != 'undefined' && ll_dialog_type_alias != ''){
				$('.container_dialog_types').find('div.box').each(function(){
					$(this).removeClass('selected');
				})
				$(this).find('div.box').addClass('selected');
				if(ll_dialog_type_alias == LL_DIALOG_TYPE_MODAL_ALIAS){
					$('.container_dialog_types').hide();
					$('.ll_dialog_wizard_btn_next').hide();
					$('.container_dialog_themes').show();
					$('.container_dialog_themes').find('li.container_theme_type a.box').each(function(){
						$(this).removeClass('selected');
					})
				} else {
					page.goto_dialog_setup_page(ll_dialog_type_alias, 0);
					$('.ll_dialog_wizard_btn_next').trigger("click");
				}
			} else {
				show_error_message("Please Select Valid Dialog Type");
			}
		})
		$('.container_theme_type').bind('click', function(){
			if(page.ll_dialog_id == 0){
				var ll_dialog_theme_id = $(this).attr('ll_dialog_theme_id');
				if(typeof ll_dialog_theme_id != 'undefined' && ll_dialog_theme_id != ''){
					$('.container_dialog_themes').find('li.container_theme_type a.box').each(function(){
						$(this).removeClass('selected');
					})
					$(this).find('a.box').addClass('selected');
					page.goto_dialog_setup_page(LL_DIALOG_TYPE_MODAL_ALIAS, ll_dialog_theme_id);
					$('.ll_dialog_wizard_btn_next').trigger("click");
				} else {
					show_error_message("Please Select Valid Modal Theme");
				}
			}
		})
		$('.ll_dialog_wizard_btn_back').bind('click', function(){
			if(page.ll_dialog_id == 0 && $('.container_theme_type').is(":visible")){
				$('.container_dialog_themes').hide();
				$('.container_dialog_types').show();
				$('.ll_dialog_wizard_btn_next').hide();
			} else if (page.ll_dialog_id == 0) {
				window.location = 'll-engagements-dialogs.php';
			} else {
	    		page.set_auto_save_mode_status(false);
				$('#ll_popup_manage_confirm_exit #ll_popup_manage_confirm_exit_url').val('ll-engagements-dialogs.php')
				ll_popup_manager.open('#ll_popup_manage_confirm_exit')
				return false;
				//window.location = 'll-engagements-dialogs.php';
			}
		})
		$('#ll_popup_manage_confirm_exit_cancel').bind('click', function(){
    		page.set_auto_save_mode_status(true);
			ll_popup_manager.close('#ll_popup_manage_confirm_exit')
		})
		$('#ll_popup_manage_confirm_exit_go').bind('click', function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit')
			var _redirect_href = $('#ll_popup_manage_confirm_exit #ll_popup_manage_confirm_exit_url').val()
			window.location = _redirect_href;
		})
		$('#ll_popup_manage_confirm_exit_save_and_exit').bind('click', function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit')
			var _redirect_href = $('#ll_popup_manage_confirm_exit #ll_popup_manage_confirm_exit_url').val()
			page.next(_redirect_href);
		})
		$('.ll_dialog_wizard_btn_next').bind('click', function(){
			page.next();
		})
		
		if(this.ll_dialog_id > 0) {
			$(window).bind('keydown', function(event) {
			    if (event.ctrlKey || event.metaKey) {
			        switch (String.fromCharCode(event.which).toLowerCase()) {
			        case 's':
			            event.preventDefault();
					    page.go_start_auto_save_draft_mode();
					    return false;
			            break;
			        }
			    }
			});
			
			this.load_dialog(this.ll_dialog_id);
		}
		
		$('#input_save_to_folder').attr('data-id',this.folderID);
		$('#input_save_to_folder .choose-path').val(this.folderPath);
	},
	pre_init: function(){
		page.heightContent();
		
		page.changeInputSettings();
		page.changeTextFieldsAndButtons();
		page.changeButtons();
		page.changeFields();
		page.spacing();
		page.spacingV();
		page.selectChangeFont();
		page.selectChangeFontSize();
		page.selectChangeButtonAction();
		page.dragAndDropElements();
		page.removeElement();
		page.copyElement();
		//page.styleClosePopup();
		//page.styleMarkersPopup();
		page.effectsPopup();
		page.engagementPopupInit();
		
		if ($('.db-ribbon-popup').length){
			page.ribbonAppearanceInit();
			page.heightContentFooterAndRibbonPopup();
		}
		if ($('.db-footer-popup').length){
			page.heightContentFooterAndRibbonPopup();
		}
		if ( $('.db-modal-popup').length ){
			page.positionPopupModal();
			page.socialNetworkInit();
			page.typeModalSizeInit();
			page.heightTheme3();
			page.heightTheme6();
			page.heightTheme5();
			page.heightColTheme5();
			page.videoTheme9();
			if( $('.db-blur').length )
				page.blurPopupInit();
		}
		if ( $('.db-popup-canvas').length ){
			page.positionPopupCanvasInit();
			//page.numberColumns();
		}
		if ( $('.db-modal-popup').length){
			page.heightPopupUpdate();
		}
		page.editText();
		$(window).resize(function(){
			page.heightContent();
		});
	},
	load_dialog: function(ll_dialog_id){
		ll_fade_manager.fade(true, 'load');
		
		var _data = {};
		_data['ll_dialog_id'] = ll_dialog_id;
		_data['action'] = 'load';
		
		$.ajax( {
			type :"POST",
			dataType :"json",
			async :true,
			url: "ll-dialog-process.php",
			data: $.toJSON(_data),
			cache :false,
			success : function(data) {
				ll_fade_manager.fade(false);
				if(data){
					if(data.success == 1){
						var ll_dialog = data.ll_dialog;
						var ll_dialog_settings = data.ll_dialog_settings;
						var ll_dialog_html = data.ll_dialog_html;

						page.ll_abstract_campaigns = data.ll_abstract_campaigns;
						page.ll_automations = data.ll_automations;
						page.ll_lists = data.ll_lists;
						
						page.initial_fill_lists();
						
						if(!ll_dialog_settings.ll_abstract_campaign_id ||ll_dialog_settings.ll_abstract_campaign_id == 0){
							ll_dialog_settings.ll_abstract_campaign_id = page.ll_abstract_campaign_id;
						}
						
						page.render_dialog_with_settings(ll_dialog, ll_dialog_html, ll_dialog_settings);
						
						page.render_contrlos_settings_from_html();

						page.initialize_color_picker();

						page.pre_init();
						
						page.ll_dialog_draft_last = page.collect_ll_dialog_draft();
						page.start_auto_save_draft_mode();
					} else {
						show_error_message(data.message);
					}
				} else {
					show_error_message("Invalid response");
				}
			},
			error: function(){
				ll_fade_manager.fade(false);
				show_error_message("Connection error");
			}
		});
	},
	initial_fill_lists: function(){
		chosen_add_standard_options($('#input_ll_abstract_campaign_id'), page.ll_abstract_campaigns);
		chosen_add_standard_options($('#input_ll_automation_ids'), page.ll_automations);
		chosen_add_standard_options($('#input_ll_list_ids'), page.ll_lists);
	},
	render_dialog_with_settings: function(ll_dialog, ll_dialog_html, ll_dialog_settings){
		$('.editable_asset_name').text(ll_dialog.ll_dialog_name);

		if(typeof ll_dialog_html != undefined)
			this.set_dialog_html(ll_dialog_html)

		if(typeof ll_dialog_settings.modal_width != undefined)
			$('#input_modal_width').val(ll_dialog_settings.modal_width)
		if(typeof ll_dialog_settings.modal_height != undefined)
			$('#input_modal_height').val(ll_dialog_settings.modal_height)
		if(typeof ll_dialog_settings.loading_delay != undefined)
			$('#input_loading_delay').val(ll_dialog_settings.loading_delay)
		if(typeof ll_dialog_settings.cookie_duration != undefined)
			$('#input_cookie_duration').val(ll_dialog_settings.cookie_duration)
		if(typeof ll_dialog_settings.is_do_not_show_if_manually_closed != undefined && ll_dialog_settings.is_do_not_show_if_manually_closed == '0')
			$('.is-dismiss-after-close input:checkbox').attr('checked', false);
		if(typeof ll_dialog_settings.is_do_not_show_if_converted != undefined && ll_dialog_settings.is_do_not_show_if_converted == '0')
			$('.is-dismiss-after-conversion input:checkbox').attr('checked', false);
		if(typeof ll_dialog_settings.background_blue != undefined)
			$('#input_background_blue').val(ll_dialog_settings.background_blue)
		if(typeof ll_dialog_settings.success_message != undefined)
			$('#input_success_message').val(ll_dialog_settings.success_message)
		if(typeof ll_dialog_settings.redirect_url != undefined)
			$('#input_redirect_url').val(ll_dialog_settings.redirect_url)
		if(typeof ll_dialog_settings.dialog_zone_container_id != undefined)
			$('#input_dialog_zone_container_id').val(ll_dialog_settings.dialog_zone_container_id);

		if(typeof ll_dialog_settings.engagement_type != undefined)
			chosen_set_selected_value('#input_engagement_type', ll_dialog_settings.engagement_type);
		if(typeof ll_dialog_settings.engagement_type_on_exit_sensitivity != undefined)
			chosen_set_selected_value('#input_engagement_type_on_exit_sensitivity', ll_dialog_settings.engagement_type_on_exit_sensitivity);

		if(typeof ll_dialog_settings.ll_abstract_campaign_id != undefined && ll_dialog_settings.ll_abstract_campaign_id)
			chosen_set_selected_value('#input_ll_abstract_campaign_id', ll_dialog_settings.ll_abstract_campaign_id);
		if(typeof ll_dialog_settings.ll_list_ids != undefined && ll_dialog_settings.ll_list_ids)
			chosen_set_selected_value('#input_ll_list_ids', ll_dialog_settings.ll_list_ids);
		if(typeof ll_dialog_settings.ll_automation_ids != undefined && ll_dialog_settings.ll_automation_ids)
			chosen_set_selected_value('#input_ll_automation_ids', ll_dialog_settings.ll_automation_ids);

		if(typeof ll_dialog_settings.engagement_type_on_page_click_count != undefined)
			$('#input_engagement_type_on_page_click_count').val(ll_dialog_settings.engagement_type_on_page_click_count)

			if(typeof ll_dialog_settings.engagement_type_on_page_scroll_percentage != undefined)
				$('#input_engagement_type_on_page_scroll_percentage').val(ll_dialog_settings.engagement_type_on_page_scroll_percentage)
		
		if(typeof ll_dialog_settings.appearance_type != undefined)
			$("input[name=input_appearance_type][value=" + ll_dialog_settings.appearance_type + "]").prop('checked', true);

		if(typeof ll_dialog_settings.canvas_position != undefined && ll_dialog_settings.canvas_position){
			if(ll_dialog_settings.canvas_position.indexOf('custom') != -1){
				$('#checkbox-custom-position').attr('checked', true);
				var $posPopup = $('#db-position-popup');
				canvas_position_parts = ll_dialog_settings.canvas_position.split(":");
				if(typeof canvas_position_parts[1] != undefined)
					$('.db-pos-left').val(canvas_position_parts[1])
				if(typeof canvas_position_parts[2] != undefined)
					$('.db-pos-top').val(canvas_position_parts[2])
			} else {
				$('#db-position-popup').attr('data-position', ll_dialog_settings.canvas_position)
				$('.region-pos').removeClass('selected')
				$('.region-pos.' + ll_dialog_settings.canvas_position).addClass('selected')
			}
			page.isPositionCustomPopup();
		}
		
		var _video_url = $('.db-container-video iframe').attr('src');
		$('#input_video_url').val(_video_url)
		
		if($('.db-popup-close').hasClass('db-close-black')){
			$('.db-close-popup-style input:radio[name=db-close-popup][value=black]').attr('checked', true)
		}
		if($('.db-modal-popup ul').hasClass('db-marker-black')){
			$('.db-marker-popup-style input:radio[name=db-marker-popup][value=black]').attr('checked', true)
		}
		if($('.db-modal-popup ul').hasClass('db-marker-none')){
			$('.db-marker-popup-style input:checkbox').attr('checked', false)
		}
		
		if(!$('.db-popup-canvas').hasClass('db-two-columns')){
			$('#db-number-columns input:radio.db-column-1').attr('checked', true)
		}
		if(typeof ll_dialog_settings.ll_folder != undefined){
			$('#input_save_to_folder').attr('data-id',ll_dialog_settings.ll_folder.folderID);
			$('#input_save_to_folder .choose-path').val(ll_dialog_settings.ll_folder.folderPath);
		}
	},
	render_contrlos_settings_from_html: function(){
		var $popup = $('.builder-popup');

		if($('.fields-modal-popup').hasClass("db-show-field-name")){
			$('#show-name-field input').attr('checked', 'checked');
			$('.container-field-name-settings').show();
		} else {
			$('.container-field-name-settings').hide();
		}
		$('input[data-changing="name-placeholder"').val($popup.find('.db-name-field .txt_field').attr('placeholder'));
		$('input[data-changing="email-placeholder"').val($popup.find('.db-email-field .txt_field').attr('placeholder'));

		$('input[data-changing="button-text"').val($popup.find('.db-btn-customize').text());
		$('input[data-changing="button-url"').val($popup.find('.db-btn-customize').attr('href'));

		/*if ($popup.hasClass('db-modal-popup')){
			var fontSize = $popup.find('.selected-elements .db-btn-customize').css('font-size');
			chosen_set_selected_value('.select-font-size[data-style=font-size-button]', fontSize);
			
			var font = $popup.find('.selected-elements .db-btn-customize').css('font-family');
			chosen_set_selected_value('.select-font[data-style=font-button]', font);
		} else {*/
			var fontSize = $popup.find('.db-btn-customize').css('font-size');
			chosen_set_selected_value('.select-font-size[data-style=font-size-button]', fontSize);
			
			var font = $popup.find('.db-btn-customize').css('font-family');
			chosen_set_selected_value('.select-font[data-style=font-button]', font);
		/*}*/
		var font = $popup.find('.selected-elements .db-field-customize').css('font-family');
		chosen_set_selected_value('.select-font[data-style=font-field]', font);
		var font = $popup.find('.db-name-field .txt_field').css('font-family');
		chosen_set_selected_value('.select-font[data-style=name-font-field]', font);
		var font = $popup.find('.db-email-field .txt_field').css('font-family');
		chosen_set_selected_value('.select-font[data-style=email-font-field]', font);
		
		
		$('.color-box[data-style=header]').css('background-color', $popup.find('.db-popup-header').css('background-color'))
		$('.color-box[data-style=header]').attr('data-color-start', $popup.find('.db-popup-header').css('background-color'))

		$('.color-box[data-style=body]').css('background-color', $popup.find('.db-popup-content').css('background-color'))
		$('.color-box[data-style=body]').attr('data-color-start', $popup.find('.db-popup-content').css('background-color'))

		$('.color-box[data-style=footer]').css('background-color', $popup.find('.db-popup-footer').css('background-color'))
		$('.color-box[data-style=footer]').attr('data-color-start', $popup.find('.db-popup-footer').css('background-color'))

		$('.color-box[data-style=button-font-color]').css('color', $popup.find('.db-btn-customize').css('color'))
		$('.color-box[data-style=button-font-color]').attr('data-color-start', $popup.find('.db-btn-customize').css('color'))

		$('.color-box[data-style=button-background-color]').css('background-color', $popup.find('.db-btn-customize').css('background-color'))
		$('.color-box[data-style=button-background-color]').attr('data-color-start', $popup.find('.db-btn-customize').css('background-color'))

		$('.color-box[data-style=button-border-color]').css('border-color', $popup.find('.db-btn-customize').css('border-color'))
		$('.color-box[data-style=button-border-color]').attr('data-color-start', $popup.find('.db-btn-customize').css('border-color'))
/*
		$('.color-box[data-style=field-font-color]').css('background-color', $popup.find('.selected-elements .db-field-customize').css('background-color'))
		$('.color-box[data-style=field-font-color]').attr('data-color-start', $popup.find('.selected-elements .db-field-customize').css('background-color'))

		$('.color-box[data-style=field-border-color]').css('background-color', $popup.find('.selected-elements .db-field-customize').css('background-color'))
		$('.color-box[data-style=field-border-color]').attr('data-color-start', $popup.find('.selected-elements .db-field-customize').css('background-color'))
*/
		$('.color-box[data-style=name-border-color]').css('border-color', $popup.find('.db-name-field .txt_field').css('border-color'))
		$('.color-box[data-style=name-border-color]').attr('data-color-start', $popup.find('.db-name-field .txt_field').css('border-color'))
		
		$('.color-box[data-style=name-font-color]').css('color', $popup.find('.db-name-field .txt_field').css('color'))
		$('.color-box[data-style=name-font-color]').attr('data-color-start', $popup.find('.db-name-field .txt_field').css('color'))

		$('.color-box[data-style=email-border-color]').css('border-color', $popup.find('.db-email-field .txt_field').css('border-color'))
		$('.color-box[data-style=email-border-color]').attr('data-color-start', $popup.find('.db-email-field .txt_field').css('border-color'))

		$('.color-box[data-style=email-font-color]').css('color', $popup.find('.db-email-field .txt_field').css('color'))
		$('.color-box[data-style=email-font-color]').attr('data-color-start', $popup.find('.db-email-field .txt_field').css('color'))
		
		if(!$('.db-social-link.db-fb').is(":visible")){
			$('.db-social-network-box[data-link=fb] input[type=checkbox]').removeAttr('checked')
		}
		$('.db-social-network-box[data-link=fb] input.txt_field').val($('.db-social-link.db-fb').attr('href'))
		if(!$('.db-social-link.db-tw').is(":visible")){
			$('.db-social-network-box[data-link=tw] input[type=checkbox]').removeAttr('checked')
		}
		$('.db-social-network-box[data-link=tw] input.txt_field').val($('.db-social-link.db-tw').attr('href'))
		if(!$('.db-social-link.db-in').is(":visible")){
			$('.db-social-network-box[data-link=in] input[type=checkbox]').removeAttr('checked')
		}
		$('.db-social-network-box[data-link=in] input.txt_field').val($('.db-social-link.db-in').attr('href'))
		if(!$('.db-social-link.db-gg').is(":visible")){
			$('.db-social-network-box[data-link=gg] input[type=checkbox]').removeAttr('checked')
		}
		$('.db-social-network-box[data-link=gg] input.txt_field').val($('.db-social-link.db-gg').attr('href'))

		page.setPopupEffect();
		
	},
	set_auto_save_mode_status: function(_status){
		this.auto_save_mode = _status;
	},
	is_auto_save_mode_enabled: function(){
		return this.auto_save_mode;
	},
	get_dialog_html: function(){
		if(this.ll_dialog_type_alias == LL_DIALOG_TYPE_ZONE_ALIAS){
			try {
				return tinymce.activeEditor.getContent();
			} catch (e){
				return '';
			};
		} else {
			var current_html = $.trim($('.container_ll_dialog_html').html());
			
			$('#container_HTML_hidden').html(current_html);
			$('#container_HTML_hidden .db-el-spacing-h').removeClass('ui-resizable');
			$('#container_HTML_hidden .db-el-spacing-v').removeClass('ui-resizable');
			$('#container_HTML_hidden .ui-resizable-handle').remove();
			$('#container_HTML_hidden').find('.selected-elements').each(function(){
				$(this).removeClass('selected-elements');
			})
			var current_html = $('#container_HTML_hidden').html();
			$('#container_HTML_hidden').html('');
			/*do {
				current_html = current_html.replace(' selected-elements', '')
			} while(current_html.indexOf(' selected-elements') != -1);
			current_html = current_html.replace('selected-elements', '')*/
			return current_html;
		}
	},
	set_fialog_html_content: function(_html){
		if(page.is_done_initiating_html_editor){
			tinymce.activeEditor.setContent(_html);
		} else {
			setTimeout(function() {
				page.set_fialog_html_content(_html);
			}, 100);
		}
	},
	set_dialog_html: function(_html){
		if(this.ll_dialog_type_alias == LL_DIALOG_TYPE_ZONE_ALIAS){
			page.set_fialog_html_content(_html);
		} else {
			$('.container_ll_dialog_html').html(_html);
		}
	},
	collect_ll_dialog_draft: function(){
		var _ll_dialog_draft = {}

		_ll_dialog_draft.ll_dialog_draft_html = $.trim(this.get_dialog_html());
		_ll_dialog_draft.modal_width = $('#input_modal_width').val()
		_ll_dialog_draft.modal_height = $('#input_modal_height').val()
		_ll_dialog_draft.loading_delay = $('#input_loading_delay').val()
		_ll_dialog_draft.cookie_duration = $('#input_cookie_duration').val()
		_ll_dialog_draft.is_do_not_show_if_manually_closed = $('.is-dismiss-after-close input:checkbox').is(':checked') ? '1' : '0';
		_ll_dialog_draft.is_do_not_show_if_converted = $('.is-dismiss-after-conversion input:checkbox').is(':checked') ? '1' : '0';
		_ll_dialog_draft.background_blue = $('#input_background_blue').val()
		_ll_dialog_draft.success_message = $('#input_success_message').val()
		_ll_dialog_draft.redirect_url = $('#input_redirect_url').val()
		_ll_dialog_draft.folder_id = $('#input_save_to_folder').attr('data-id')
		_ll_dialog_draft.dialog_zone_container_id = $('#input_dialog_zone_container_id').val()
		_ll_dialog_draft.engagement_type = $('#input_engagement_type').val()
		_ll_dialog_draft.engagement_type_on_exit_sensitivity = $('#input_engagement_type_on_exit_sensitivity').val()
		_ll_dialog_draft.engagement_type_on_page_click_count = $('#input_engagement_type_on_page_click_count').val()
		_ll_dialog_draft.engagement_type_on_page_scroll_percentage = $('#input_engagement_type_on_page_scroll_percentage').val()
		_ll_dialog_draft.appearance_type = $('input[name=input_appearance_type]:checked').val()
		_ll_dialog_draft.ll_abstract_campaign_id = $('#input_ll_abstract_campaign_id').val()
		_ll_dialog_draft.ll_list_ids = $('#input_ll_list_ids').val()
		_ll_dialog_draft.ll_automation_ids = $('#input_ll_automation_ids').val()
		
		_ll_dialog_draft.ll_list_ids = _ll_dialog_draft.ll_list_ids ? _ll_dialog_draft.ll_list_ids : '';
		_ll_dialog_draft.ll_automation_ids = _ll_dialog_draft.ll_automation_ids ? _ll_dialog_draft.ll_automation_ids : '';
		
		//@todo grap the custom positon...
		var checkbox = $('#checkbox-custom-position');
		var $posPopup = $('#db-position-popup');
		if ( checkbox.is(':checked') ) {
			var posLeft = $posPopup.find('.db-pos-left').val();
			var posTop = $posPopup.find('.db-pos-top').val();
			_ll_dialog_draft.canvas_position = 'custom:' + posLeft + ':' + posTop;
		} else{
			_ll_dialog_draft.canvas_position = $posPopup.attr('data-position');
		}
		
		return _ll_dialog_draft;
	},
	compare_ll_dialogs: function(_d1, _d2){
		return (
				_d1.ll_dialog_draft_html == _d2.ll_dialog_draft_html && 
				_d1.modal_width == _d2.modal_width && 
				_d1.modal_height == _d2.modal_height && 
				_d1.loading_delay == _d2.loading_delay && 
				_d1.cookie_duration == _d2.cookie_duration && 
				_d1.is_do_not_show_if_manually_closed == _d2.is_do_not_show_if_manually_closed && 
				_d1.is_do_not_show_if_converted == _d2.is_do_not_show_if_converted && 
				_d1.background_blue == _d2.background_blue && 
				_d1.success_message == _d2.success_message && 
				_d1.redirect_url == _d2.redirect_url && 
				_d1.dialog_zone_container_id == _d2.dialog_zone_container_id && 
				_d1.engagement_type == _d2.engagement_type && 
				_d1.engagement_type_on_exit_sensitivity == _d2.engagement_type_on_exit_sensitivity && 
				_d1.engagement_type_on_page_click_count == _d2.engagement_type_on_page_click_count && 
				_d1.engagement_type_on_page_scroll_percentage == _d2.engagement_type_on_page_scroll_percentage && 
				_d1.appearance_type == _d2.appearance_type && 
				_d1.canvas_position == _d2.canvas_position && 
				_d1.ll_abstract_campaign_id == _d2.ll_abstract_campaign_id && 
				_d1.ll_list_ids.toString() == _d2.ll_list_ids.toString() && 
				_d1.ll_automation_ids.toString() == _d2.ll_automation_ids.toString()
			);
	},
	start_auto_save_draft_mode: function(){
		//if(this.ll_dialog_type_alias == LL_DIALOG_TYPE_MODAL_ALIAS) return false;
		if(this.is_auto_save_mode_enabled()){
			this.go_start_auto_save_draft_mode();
		}
		setTimeout(function() {
			page.start_auto_save_draft_mode();
		}, 15000);
	},
	go_start_auto_save_draft_mode: function(){
		var current_ll_dialog_draft = this.collect_ll_dialog_draft();
		if(!this.compare_ll_dialogs(current_ll_dialog_draft, this.ll_dialog_draft_last)){
			this.ll_dialog_draft_last = current_ll_dialog_draft;

			page.set_saving_button_visibility(true);
			
			var _data = {};
			_data['ll_dialog_id'] = this.ll_dialog_id;
			_data['ll_dialog_draft'] = this.ll_dialog_draft_last;
			_data['action'] = 'save_draft';
			
			$.ajax( {
				type :"POST",
				dataType :"json",
				async :true,
				url: "ll-dialog-process.php",
				data: $.toJSON(_data),
				cache :false,
				success : function(data) {
					page.set_saving_button_visibility(false);
					if(data){
						if(data.success == 1){
						} else {
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
		}
	},
	process_save: function(_redirect_href){
    	if(typeof _redirect_href == 'undefined' || !_redirect_href){
    		_redirect_href = '';
    	}
		var ll_dialog_name = $.trim($('.editable_asset_name').text());
		if(ll_dialog_name != ''){
			page.set_auto_save_mode_status(false);
			var current_ll_dialog_draft = this.collect_ll_dialog_draft();
	
			this.ll_dialog_draft_last = current_ll_dialog_draft;

			ll_fade_manager.fade(true, 'save');
			page.set_saving_button_visibility(true);
			
			var _data = {};
			_data['ll_dialog_id'] = this.ll_dialog_id;
			_data['ll_dialog_name'] = ll_dialog_name;
			_data['ll_dialog_draft'] = this.ll_dialog_draft_last;
			/*_data['is_enable_email_validation'] = $('#is_enable_email_validation').is(':checked') ? '1' : '0';
			_data['email_validation_timeout'] = $('#email_validation_timeout').val();*/
			_data['action'] = 'save';
			
			$.ajax( {
				type :"POST",
				dataType :"json",
				async :true,
				url: "ll-dialog-process.php",
				data: $.toJSON(_data),
				cache :false,
				success : function(data) {
					ll_fade_manager.fade(false);
					page.set_saving_button_visibility(false);
					if(data){
						if(data.success == 1){
							if (_redirect_href != ''){
								window.location = _redirect_href;
							} else {
								window.location = 'll-dialog-ready.php?ll_dialog_id=' + page.ll_dialog_id + '&ll_dialog_draft_id=' + data.ll_dialog_draft_id + '&ll_dialog_window_id=' + ll_dialog_window_id;
							}
						} else {
							show_error_message(data.message);
							page.set_auto_save_mode_status(false);
						}
					} else {
						show_error_message("Invalid response");
						page.set_auto_save_mode_status(false);
					}
				},
				error: function(){
					ll_fade_manager.fade(false);
					show_error_message("Connection error");
					page.set_saving_button_visibility(false);
					page.set_auto_save_mode_status(false);
				}
			});
		} else {
			show_error_message("Please Add Dialog Name");
			$('.editable_asset_name').focus();
		}
	},
	set_saving_button_visibility: function(is_show){
		if(is_show){
			$('.btn-saving').show();
		} else {
			$('.btn-saving').hide();
		}
	},
	goto_dialog_setup_page: function(ll_dialog_type_alias, ll_dialog_theme_id){
		//$('.ll_dialog_wizard_btn_next').show();
		page.ll_dialog_type_alias = ll_dialog_type_alias;
		page.ll_dialog_theme_id = ll_dialog_theme_id;
	},
	next: function(_redirect_href){
    	if(typeof _redirect_href == 'undefined' || !_redirect_href){
    		_redirect_href = '';
    	}
		if(page.ll_dialog_id == 0){
			// Configure page
			if(page.ll_dialog_type_alias != ''){
				if(page.ll_dialog_type_alias != LL_DIALOG_TYPE_MODAL_ALIAS || page.ll_dialog_theme_id != 0){
					var ll_dialog_name = $.trim($('.editable_asset_name').text());
					if(ll_dialog_name != ''){
						//ll_fade_manager.fade(true, 'Initializing');
						var _data = {};
						_data['ll_dialog_name'] = ll_dialog_name;
						_data['ll_dialog_type_alias'] = page.ll_dialog_type_alias;
						_data['ll_dialog_theme_id'] = page.ll_dialog_theme_id;
						_data['ll_dialog_window_id'] = ll_dialog_window_id;
						_data['folder_id'] = page.folderID;
						_data['abstract_campaign_id'] = abstract_campaign_id;
						_data['action'] = 'initiate';
						
						$.ajax( {
							type :"POST",
							dataType :"json",
							async :true,
							url: "ll-dialog-process.php",
							data: $.toJSON(_data),
							cache :false,
							success : function(data) {
								//ll_fade_manager.fade(false);
								if(data){
									if(data.success == 1){
										//show_success_message(data.message);
										window.location = 'll-dialog-setup.php?ll_dialog_id=' + data.ll_dialog_id + '&ll_dialog_window_id=' + ll_dialog_window_id+'&abstract_campaign_id=' + abstract_campaign_id;
									} else {
										show_error_message(data.message);
									}
								} else {
									//show_error_message("Invalid response");
								}
							},
							error: function(){
								//show_error_message("Connection error");
								//ll_fade_manager.fade(false);
							}
						});
					} else {
						show_error_message("Please Add Dialog Name");
						$('.editable_asset_name').focus();
					}
				} else {
					show_error_message("Please Select Valid Modal Theme");
				}
			} else {
				show_error_message("Please Select Valid Dialog Type");
			}
		} else {
			//Setup page
			page.process_save(_redirect_href);
		}
	},
	editText: function(){
		$('.db-outer-content-inner').off('click').on('click', function(){
			page.set_auto_save_mode_status(false);
			$('.db-outer-content').removeClass('selected');
			var $content = $(this).parent();
			var content = $(this).find('.db-html-el').html();
			var pos = $content.position();
			var posOffset = $content.offset();
			$content.addClass('selected');
			tinymce.activeEditor.setContent(content);
			var offsetPosTop = 0;
			var offsetPosLeft = 0;
			
			if( posOffset.top + $('.editor-text-popup').height() > $('body').height()){
				offsetPosTop = $('.editor-text-popup').outerHeight()-$(this).outerHeight();
			}
			if( posOffset.left + $('.editor-text-popup').width() > $('body').width()){
				offsetPosLeft = $('.editor-text-popup').outerWidth()-$(this).outerWidth();
			}
			if ($('.builder-popup').hasClass('db-popup-slider') ){
				$('.editor-text-popup').css({
                    top: 100,
                    left: 120
				}).show();
			} else {
				$('.editor-text-popup').css({
                    top: 100,
                    left: 120
				}).show();
			}
		});
	},
	selectChangeFont: function(){
		$('.select-font').change(function() {
			var type = $(this).attr('data-style');
			var $el = null;
			var font = $(this).val();
			var $popup = $('.builder-popup');
			if( type =='font-button'){
				if($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').css('font-family',font).attr('style-font',font);
				} else {
					$popup.find('.db-btn-customize').css('font-family',font).attr('style-font',font);
				}
			} else if( type =='font-field'){
				$popup.find('.selected-elements .db-field-customize').css('font-family',font).attr('style-font',font);
			} else if( type =='name-font-field'){
				$popup.find('.db-name-field .txt_field').css('font-family',font).attr('style-font',font);
			} else if( type =='email-font-field'){
				$popup.find('.db-email-field .txt_field').css('font-family',font).attr('style-font',font);
			}
		});
	},
	selectChangeFontSize: function(){
		$('.select-font-size').change(function() {
			var type = $(this).attr('data-style');
			var $el = null;
			var fontSize = $(this).val();
			var $popup = $('.builder-popup');
			if( type =='font-size-button'){
				if($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').css('font-size',fontSize).attr('style-font-size',fontSize);
				} else {
					$popup.find('.db-btn-customize').css('font-size',fontSize).attr('style-font-size',fontSize);
				}
			}
		});
	},
	selectChangeButtonAction: function(){
		$('input[name=chkbox_button_open_in_new_tab]').change(function() {
			var $popup = $('.builder-popup');
			if ($(this).is(':checked')) {
				if ($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').attr('target', '_blank');
				} else{
					$popup.find('.db-btn-customize').attr('target', '_blank');
				}
			} else {
				if ($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').removeAttr('target');
				} else{
					$popup.find('.db-btn-customize').removeAttr('target');
				}
			}
		});
		$('.select-button-action').change(function() {
			$('.container-button-distination-url').hide();
			$('.container-button-js-code').hide();
			var btn_action = $(this).val();
			var $popup = $('.builder-popup');
			if($popup.find('.selected-elements .db-btn-customize').length > 0){
				$popup.find('.selected-elements .db-btn-customize').attr('ll-btn-action',btn_action);
			} else {
				$popup.find('.db-btn-customize').attr('ll-btn-action',btn_action);
			}
			if(btn_action == LL_DIALOG_BUTTON_ACTION_REDIRECT){
				$('.container-button-distination-url').show();
			} else {
				if ($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').removeAttr('target');
				} else {
					$popup.find('.db-btn-customize').removeAttr('target');
				}
				$('input[name=chkbox_button_open_in_new_tab]').removeAttr ('checked')
				if (btn_action == LL_DIALOG_BUTTON_ACTION_RUN_JS){
					$('.container-button-js-code').show();
				}
			}
		});
	},
	changeButtons: function(){
		$('.db-btn-customize').off('click').on('click', function(e){
			e.stopPropagation();
			var $btn = $(this);
			
			if ( !$(this).parent().hasClass('selected-elements') ){
				
				$('.selected-elements').removeClass('selected-elements');
				$(this).parent().addClass('selected-elements');
				
				$('#db-btn-text').val($(this).text());
				$('#db-btn-url').val($(this).attr('href'));
				$('#button-font-color').colpickSetColor('#'+$btn.attr('colorFont'),true).css('background-color', '#'+$btn.attr('colorFont'));
				$('#button-border-color').colpickSetColor('#'+$btn.attr('colorBorder'),true).css('background-color', '#'+$btn.attr('colorBorder'));
				$('#button-bg-color').colpickSetColor('#'+$btn.attr('colorBg'),true).css('background-color', '#'+$btn.attr('colorBg'));

				$('#db-btn-js-code').val($(this).attr('ll-btn-js-code'));
				
				//$("#db-btn-font :contains('"+$btn.attr('style-font')+"')").attr("selected", "selected");
				$("#db-btn-font").val($btn.attr('style-font'));
				$('#db-btn-font').trigger("liszt:updated");
				
				//$("#db-btn-font-size :contains('"+$btn.attr('style-font-size')+"')").attr("selected", "selected");
				$('#db-btn-font-size').val($btn.attr('style-font-size'));
				$('#db-btn-font-size').trigger("liszt:updated");

				$('input[name=chkbox_button_open_in_new_tab]').removeAttr ('checked')
				var ll_btn_action = $btn.attr('ll-btn-action')
				if(ll_btn_action == LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM || ll_btn_action == LL_DIALOG_BUTTON_ACTION_CLOSE_DIALOG ||
						ll_btn_action == LL_DIALOG_BUTTON_ACTION_REDIRECT || ll_btn_action == LL_DIALOG_BUTTON_ACTION_RUN_JS){
					$(".select-button-action").val(ll_btn_action);
					if (ll_btn_action == LL_DIALOG_BUTTON_ACTION_REDIRECT && $btn.attr ('target') == '_blank') {
						$('input[name=chkbox_button_open_in_new_tab]').attr ('checked', 'checked')
					}
				} else {
					$(".select-button-action").val(LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM);
				}
				$(".select-button-action").trigger('change')
				$('.select-button-action').trigger("liszt:updated");
				
				if ( !$('.db-slide-button').hasClass('active') ){
					$('.db-slide-content.active').removeClass('active').css('left','-305px');
				}
				$('.db-slide-button').addClass('active').animate({left: 0},300);
			}
			return false;
		});
	},
	changeTextFieldsAndButtons: function(){
		$('.field-customizer').keyup(function() {
			var val = $(this).val();
			var $popup = $('.builder-popup');
			var type = $(this).attr('data-changing');
			if (type == 'name-placeholder'){
				$popup.find('.db-name-field .txt_field').attr('placeholder',val);
			} else if (type == 'email-placeholder'){
				$popup.find('.db-email-field .txt_field').attr('placeholder',val);
			} else if (type == 'field-placeholder'){
				if($popup.find('.selected-elements .txt_field').length > 0){
					$popup.find('.selected-elements .txt_field').attr('placeholder',val);
				} else {
					$popup.find('.txt_field').attr('placeholder',val);
				}
			} else if (type == 'button-text'){
				if($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').text(val);
				} else {
					$popup.find('.db-btn-customize').text(val);
				}
			} else if (type == 'button-url'){
				if ($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').attr('href',val);
				} else{
					$popup.find('.db-btn-customize').attr('href',val);
				}
			} else if (type == 'button-js-code'){
				if ($popup.find('.selected-elements .db-btn-customize').length > 0){
					$popup.find('.selected-elements .db-btn-customize').attr('ll-btn-js-code',val);
				} else{
					$popup.find('.db-btn-customize').attr('ll-btn-js-code',val);
				}
			}
		});
	},
	changeFields: function(){
		$('.db-field-customize').off('click').on('click', function(e){
			e.stopPropagation();
			var $field = $(this);
			return page.field_click($field);
		});
	},
	field_click: function($field){
		if ( !$($field).parent().parent().hasClass('selected-elements') ){
			$('#field-placeholder').val($($field).attr('placeholder'));
			$('#field-font-color').colpickSetColor('#'+$field.attr('colorFont'),true).css('background-color', '#'+$field.attr('colorFont'));
			$('#field-border-color').colpickSetColor('#'+$field.attr('colorBorder'),true).css('background-color', '#'+$field.attr('colorBorder'));
			$("#db-field-font :contains('"+$field.attr('style-font')+"')").attr("selected", "selected");
			$('#db-field-font').trigger("liszt:updated");
			if ( !$('.db-slide-fields').hasClass('active') ){
				$('.db-slide-fields.active').removeClass('active').css('left','-305px');
			}
			$('.db-slide-fields').addClass('active').animate({left: 0},300);
		}
		$('.selected-elements').removeClass('selected-elements');
		$($field).parent().parent().addClass('selected-elements');
		return false;
	},
	typeModalSizeInit: function(){
		$('.modal-size-fields .divider-field').on('click', function(){
			$(this).toggleClass('db-unlock-size');
		});
	},
	typeModalSize: function(){
		var $this = $('.modal-size-fields .divider-field');
		if ( $this.hasClass('db-unlock-size') ) {
		   return false;
		} else{
		   return true;
		}
	},
	updateModalSize: function(width, height){
		var minWidth = 580;
		var maxWidth = 840;
		var minHeight = 300;
		var maxHeight = 415;
		var w = maxWidth - minWidth;
		var h = maxHeight - minHeight;
		var w2 = width - minWidth;
		var h2 = height - minHeight;
		if (width){
			height = ( (w2 * h) / w ) + minHeight;
			height = Math.floor(height);
			$('.size-height-popup-modal').val(height);
		} else {
			width = ( (h2 * w) / h ) + minWidth;
			width = Math.floor(width);
			$('.size-width-popup-modal').val(width);
		}
		var $popup = $('.builder-popup');
		$popup.css({
			width: width
		});
		var heightFields = $('.fields-modal-popup').outerHeight();
		if ( $popup.hasClass('db-theme-4')||  $popup.hasClass('db-theme-5') ||  $popup.hasClass('db-theme-9') ||  $popup.hasClass('db-theme-7') ||  $popup.hasClass('db-theme-3') ){
			heightFields = 0;
		}
		var newHeight = height-$('.db-popup-footer').outerHeight()-$('.db-popup-header').outerHeight()-heightFields;
		$('.builder-popup .db-popup-content-inner').css({
			minHeight: newHeight 
		});
		if ( $popup.hasClass('db-theme-3')){
		   page.heightTheme3(height);
		}
		if ( $popup.hasClass('db-theme-6')){
		   page.heightTheme6(height);
		}
		if ( $popup.hasClass('db-theme-5')){
		   page.heightTheme5(height);
		}
		if ( $popup.hasClass('db-theme-9')){
			page.videoTheme9(newHeight);
		}
		page.positionPopupModal();
	},
	heightTheme3: function(h){
		var height = h-120;
		$('.db-theme-3 .db-wrap-content-inner').height(height);
	},
	heightTheme6: function(h){
		var height = h-93;
		$('.db-theme-6 .db-wrap-content-inner').height(height);
	},
	heightTheme5: function(h){
		var height = h;
		$('.db-theme-5 .db-popup-content-inner').css('minHeight', height);
	},
	heightColTheme5: function(height){
		if (height){
			height = height-96;
			$('.db-theme-5 .db-wrap-vertical-content').height(height);
		} else {
			$('.db-theme-5 .db-wrap-vertical-content').height($('.db-popup-content-inner').height());
		}
		$('.db-theme-5 .db-vertical-content').css('width','auto');
		$('.db-theme-5 .db-vertical-content').css('width', $('.td-left-col-popup').width());
	},
	changeInputSettings: function(){
		$('.size-width-popup-modal').TouchSpin({
				min: 580,
				max: 840
		});
		$('.size-width-popup-modal').on('change', function () {
			var $popup = $('.builder-popup');
			var value = $(this).val();
			if (value == null || value < 580 )
				value = 580;
			if (value == null || value > 840 )
				value = 840;
			$('.builder-popup').css({
				width: value,
				marginLeft: -value/2
			});
			$(this).val(value);
			if ( page.typeModalSize() ){
				page.updateModalSize(value, false);
			}
			if ( $popup.hasClass('db-theme-5')){
				page.heightColTheme5();
			}
			if ( $popup.hasClass('db-theme-9')){
				page.videoTheme9();
			}
		});
	$('.size-height-popup-modal').TouchSpin({
			min: 300,
			max: 415,
		});
		$('.size-height-popup-modal').on('change', function () {
			var value = $(this).val();
			var $popup = $('.builder-popup');
			if (value == null || value < 300 )
				value = 300;
			if (value == null || value > 415 )
				value = 415;
			var heightFields = $('.fields-modal-popup').outerHeight();
			if ( $popup.hasClass('db-theme-4') ||  $popup.hasClass('db-theme-5') ||  $popup.hasClass('db-theme-9') ||  $popup.hasClass('db-theme-7') ||  $popup.hasClass('db-theme-3') ){
				heightFields = 0;
			}
			var newHeight = value-$('.db-popup-footer').outerHeight()-heightFields-$('.db-popup-header').outerHeight();
			$($popup).find('.db-popup-content-inner').css({
			   minHeight:  newHeight
			});
			$(this).val(value);
			if ( page.typeModalSize() ){
				page.updateModalSize(false, value);
			}
			if ( $popup.hasClass('db-theme-3')){
				page.heightTheme3(value);
			}
			if ( $popup.hasClass('db-theme-6')){
				page.heightTheme6(value);
			}
			if ( $popup.hasClass('db-theme-5')){
				page.heightTheme5(value);
				page.heightColTheme5(value);
			}
			if ( $popup.hasClass('db-theme-9')){
				page.videoTheme9(newHeight);
			}
			page.positionPopupModal();
		});	
		
		$('.size-width-popup-slider').TouchSpin({
				min: 360,
				max: 840
		});
		$('.size-width-popup-slider').on('change', function () {
			var value = $(this).val();
			if (value == null || value < 360 )
				value = 360;
			if (value == null || value > 840 )
				value = 840;
			$('.builder-popup').css({
				width: value,
			});
			$(this).val(value);
		});
		$('.size-width-popup-canvas').TouchSpin({
				min: 580,
				max: 840
		});
		$('.size-width-popup-canvas').on('change', function () {
			var value = $(this).val();
			if (value == null || value < 580 )
				value = 580;
			if (value == null || value > 840 )
				value = 840;
			$('.builder-popup').css({
				width: value,
				marginLeft: -value/2
			});
			$(this).val(value);
			page.isPositionCustomPopup();
		});
		$('.color-box').each(function(){
			var color =  $(this).attr('data-color-start');
			$(this).colpick({
				colorScheme:'dark',
				layout:'hex',
				color: color,
				onSubmit:function(hsb,hex,rgb,el) {
					$(el).css('background-color', '#'+hex);
					$(el).colpickHide();
					var type = $(el).attr('data-style');
					var $popup = $('.builder-popup');
					if (type == 'header'){
						$popup.find('.db-popup-header').css('background-color','#'+hex);
					} else if (type == 'body'){
						if( $popup.hasClass('db-theme-3') ){
							$popup.find('.db-blur-color').css('background-color','#'+hex);
						} else{
							$popup.find('.db-popup-content').css('background-color','#'+hex);
						}
					} else if (type == 'footer'){
						$popup.find('.db-popup-footer').css('background-color','#'+hex);
					} else if (type == 'button-font-color'){
						$popup.find('.selected-elements, .fields-modal-popup').find('.db-btn-customize').css('color','#'+hex).attr('colorFont', hex);
					} else if (type == 'button-background-color'){
						$popup.find('.selected-elements, .fields-modal-popup').find('.db-btn-customize').css('background-color','#'+hex).attr('colorBg', hex);;
					} else if (type == 'button-border-color'){
						$popup.find('.selected-elements, .fields-modal-popup').find('.db-btn-customize').css('border-color','#'+hex).attr('colorBorder', hex);;
					} else if (type == 'field-font-color'){
						$popup.find('.selected-elements .db-field-customize').css('color','#'+hex).attr('colorFont', hex);
					} else if (type == 'field-border-color'){
						$popup.find('.selected-elements .db-field-customize').css('border-color','#'+hex).attr('colorBorder', hex);;
					} else if (type == 'name-border-color'){
						$popup.find('.db-name-field .txt_field').css('border-color','#'+hex);
					} else if (type == 'name-font-color'){
						$popup.find('.db-name-field .txt_field').css('color','#'+hex);
					} else if (type == 'email-border-color'){
						$popup.find('.db-email-field .txt_field').css('border-color','#'+hex);
					} else if (type == 'email-font-color'){
						$popup.find('.db-email-field .txt_field').css('color','#'+hex);
					}
					
				}
			}).css('background-color', '#'+color);
		});
		$('#show-name-field').on('click', function() {
			page.isCheckedNameField();
		});
	},
	initialize_color_picker: function(){
		$('.color-box').each(function(){
			var color =  $(this).attr('data-color-start');
			$(this).colpick({
				colorScheme:'dark',
				layout:'hex',
				color: color,
				onSubmit:function(hsb,hex,rgb,el) {
					$(el).css('background-color', '#'+hex);
					$(el).colpickHide();
					var type = $(el).attr('data-style');
					var $popup = $('.builder-popup');
					if (type == 'header'){
						$popup.find('.db-popup-header').css('background-color','#'+hex);
					} else if (type == 'body'){
						if( $popup.hasClass('db-theme-3') ){
							$popup.find('.db-blur-color').css('background-color','#'+hex);
						} else{
							$popup.find('.db-popup-content').css('background-color','#'+hex);
						}
					} else if (type == 'footer'){
						$popup.find('.db-popup-footer').css('background-color','#'+hex);
					} else if (type == 'button-font-color'){
						$popup.find('.selected-elements, .fields-modal-popup').find('.db-btn-customize').css('color','#'+hex).attr('colorFont', hex);
					} else if (type == 'button-background-color'){
						$popup.find('.selected-elements, .fields-modal-popup').find('.db-btn-customize').css('background-color','#'+hex).attr('colorBg', hex);;
					} else if (type == 'button-border-color'){
						$popup.find('.selected-elements, .fields-modal-popup').find('.db-btn-customize').css('border-color','#'+hex).attr('colorBorder', hex);;
					} else if (type == 'field-font-color'){
						$popup.find('.selected-elements .db-field-customize').css('color','#'+hex).attr('colorFont', hex);
					} else if (type == 'field-border-color'){
						$popup.find('.selected-elements .db-field-customize').css('border-color','#'+hex).attr('colorBorder', hex);;
					} else if (type == 'name-border-color'){
						$popup.find('.db-name-field .txt_field').css('border-color','#'+hex);
					} else if (type == 'name-font-color'){
						$popup.find('.db-name-field .txt_field').css('color','#'+hex);
					} else if (type == 'email-border-color'){
						$popup.find('.db-email-field .txt_field').css('border-color','#'+hex);
					} else if (type == 'email-font-color'){
						$popup.find('.db-email-field .txt_field').css('color','#'+hex);
					}
					
				}
			}).css('background-color', '#'+color);
		});
	},
	dragAndDropElements: function(){
		$( ".element-drag" ).draggable({
			helper: 'clone',
			revert: 'invalid',
			connectToSortable: ".db-connected-sortable",
			start: function(event, ui) {
				page.set_auto_save_mode_status(false);
			},
			stop: function(event, ui) {
				page.set_auto_save_mode_status(true);
			}
		});
		$('.db-popup-slider .db-popup-footer, .droppable-box').sortable({
			cursor: 'move',
			handle: '.db-el-move',
			tolerance: 'intersect',
			connectWith: '.db-connected-sortable',
			placeholder:'db-placeholder-element',
			beforeStop: function(event, ui) {
				page.addElement(ui);
			},
			start: function(event, ui) {
				page.set_auto_save_mode_status(false);
			},
			stop: function(event, ui) {
				page.set_auto_save_mode_status(true);
			}
		}).disableSelection();
	},
	spacing: function(){
		$('.db-el-spacing-h').resizable({
			minHeight:5,
			maxHeight:200,
			resize: function(event, ui) {
				ui.helper.find('.ui-resizable-s').text(ui.helper.height() +'px');
			},
			start: function(event, ui){
				page.is_resizing_element = true;
			},
			stop: function(event, ui){
				page.is_resizing_element = false;
			}
		});
		$('.db-el-spacing').on('mouseenter', function(){
			$(this).find('.ui-resizable-s').text($(this).height() +'px');
			$(this).off('mouseenter');
		});
	},
	spacingV: function(){
		$('.db-el-spacing-v').resizable({
			minHeight:10,
			maxHeight:200,
			minWidth: 10,
			resize: function(event, ui) {
				ui.helper.find('.ui-resizable-s').text(ui.helper.height() +'px');
				ui.helper.find('.ui-resizable-e').text(ui.helper.width() +'px');
			},
			start: function(event, ui){
				page.is_resizing_element = true;
			},
			stop: function(event, ui){
				page.is_resizing_element = false;
			}
		});
		$('.db-el-spacing').on('mouseenter', function(){
			$(this).find('.ui-resizable-s').text($(this).height() +'px');
			$(this).find('.ui-resizable-e').text($(this).width() +'px');
			$(this).off('mouseenter');
		});
	},
	addElement: function(ui){
		if (ui.item.hasClass('element-drag')){
			var type = ui.item.attr('data-element');
			var elementDrag = '';
			if (type == 'field'){
				elementDrag = '<div class="field"><input type="text" class="txt_field db-field-customize" style-font="Arial" colorBorder="cccccc" colorFont="333333" placeholder="Enter text"/></div>';
			} else if (type == 'button'){
				elementDrag = '<a href="#" class="db-btn-customize" style-font="Arial" style-font-size="18px" colorBg="e89c4c" colorBorder="cc7a23" colorFont="ffffff">Button</a>';
			} else if (type == 'text'){
				elementDrag = '<p><span style="font-size: 14px;">Enter text here</span></p>';
			} else if (type == 'spacing'){
				elementDrag = '<div class="db-el-spacing db-el-spacing-h"></div>';
			} else if (type == 'spacingV'){
				elementDrag = '<div class="db-el-spacing db-el-spacing-v"></div>';
			} else if (type == 'divider'){
			   elementDrag = '<div class="db-divider"></div>';
			} else if (type == 'image'){
			   elementDrag = '<div class="db-image-content db-none-image">'+
									'<div class="db-change-image">'+
										'<div class="db-change-image-inner">'+
											'<img src="dialog_builder/images/photo_icon_gray.png">'+
											'<p>Change Image</p>'+
										'</div>'+
									'</div>'+
								'</div>';
			}
			if (type == 'text'){
				var content =   '<div class="db-outer-content" data-outer="text">'+
									'<div class="db-outer-content-inner">'+
										'<div class="db-html-el">'+
											elementDrag+
										'</div>'+
									'</div>'+
									'<div class="db-el-move"></div>'+
									'<div class="db-el-delete"></div>'+
								'</div>';
				$(ui.item).replaceWith(content);					
				page.editText();
			} else if (type == 'image'){
				var content =   '<div class="db-outer-element db-outer-element-image">'+
								'<div class="db-outer-element-inner">'+
									elementDrag +
								'</div>'+
								'<div class="db-el-move"></div>'+
								'<div class="db-el-delete"></div>'+
							'</div>';
					$(ui.item).replaceWith(content);
			}  else if (type == 'spacingV'){
				var content =   '<div class="db-outer-element db-outer-element-spacingV">'+
								'<div class="db-outer-element-inner">'+
									elementDrag +
								'</div>'+
								'<div class="db-action-spacing">'+
								'<div class="db-el-move"></div>'+
								'<div class="db-el-delete"></div>'+
								'</div>'+
							'</div>';
					$(ui.item).replaceWith(content);
			} else if (type == 'button'){
				var content =   '<div class="db-outer-element">'+
								'<div class="db-outer-element-inner">'+
									elementDrag +
								'</div>'+
								'<div class="db-el-copy" data-element="button"></div>'+
								'<div class="db-el-move"></div>'+
								'<div class="db-el-delete"></div>'+
							'</div>';
					$(ui.item).replaceWith(content);
			} else if (type == 'field'){
				var content =   '<div class="db-outer-element">'+
								'<div class="db-outer-element-inner">'+
									elementDrag +
								'</div>'+
								'<div class="db-el-copy" data-element="field"></div>'+
								'<div class="db-el-move"></div>'+
								'<div class="db-el-delete"></div>'+
							'</div>';
					$(ui.item).replaceWith(content);
			} else {
				var content =   '<div class="db-outer-element">'+
								'<div class="db-outer-element-inner">'+
									elementDrag +
								'</div>'+
								'<div class="db-el-move"></div>'+
								'<div class="db-el-delete"></div>'+
							'</div>';
					$(ui.item).replaceWith(content);
			}
			$('.element-drag.ui-draggable-dragging').remove();
			if (type == 'field'){
				page.copyElement();
				page.changeFields();
			} else if (type == 'button'){
			   page.changeButtons();
			   page.copyElement();
			}
			else if (type == 'spacing'){
				page.spacing();
			}else if (type == 'spacingV'){
				page.spacingV();
			}
			page.removeElement();
			if ( $('.db-popup-canvas').length ){
				page.isPositionCustomPopup();
			}
		}
	},
	removeElement: function(){
		$('.db-el-delete').off('click').on('click', function(){
			$(this).parents('.db-outer-element, .db-outer-content').remove();
			if ( $('.db-popup-canvas').length ){
				page.isPositionCustomPopup();
			}
		});
	},
	copyElement: function(){
		$('.db-el-copy').off('click').on('click', function(){
			var $el = $(this).parents('.db-outer-element');
			var type = $(this).attr('data-element');
			$el.after($el.clone());
			if (type == 'field'){
				page.copyElement();
				page.changeFields();
			} else if (type == 'button'){
			   page.changeButtons();
			   page.copyElement();
			}
			page.removeElement();
		});
	},
	isCheckedNameField: function(){
		var $this = $('#show-name-field input');
		var $fields = $('.fields-modal-popup');
		if ( $this.is(':checked') ) {
			$fields.addClass('db-show-field-name');
			$('.container-field-name-settings').show();
		} else {
			$fields.removeClass('db-show-field-name');
			$('.container-field-name-settings').hide();
		}
		if ( $('.builder-popup').hasClass('db-theme-9') ){
			$('.db-container-video').css('padding-bottom','200px');
			$('.db-theme-9 .db-wrap-vertical-content').height('200px');
			page.videoTheme9();
			page.positionPopupModal();
		}
		if ( $('.builder-popup').hasClass('db-theme-5') ){
			$('.db-theme-5 .db-wrap-vertical-content').height('204px');
			page.heightColTheme5();
			page.positionPopupModal();
		}
	},
	heightContent: function(){
		if(!page.is_resizing_element){
			var height = $('body').height() - 50;
			if($('.info-msg').length){
				height = height - $('.info-msg').height()
			}
			$('.dialog-build-content').css('height',height);
		}
	},
	heightContentFooterAndRibbonPopup: function(){
		var height = $('.db-ribbon-popup, .db-footer-popup').find('.db-left-box').outerHeight();
		if (height < 136){
			height = 135;
		}
		$('.db-right-box .db-popup-content-inner').css({minHeight: height});
	},
	numberColumns: function(el, text){
		var $this = $('#db-number-columns input.db-column-2:radio:checked');
		var $fields = $('.db-popup-canvas');
		if ( $this.is(':checked') ) {
			$fields.addClass('db-two-columns');
		} else{
			$fields.removeClass('db-two-columns');
		}
		page.heightPopupUpdate();
	},
	heightPopupUpdate: function(){
		var $popup = $('.builder-popup');
		var heightPopup = $popup.outerHeight();
		if (heightPopup > 415){
			heightPopup = 415;
		}
		if ($popup.hasClass('db-modal-popup')){
			$('.size-height-popup-modal').val(heightPopup);
		}
	},
	styleClosePopup: function(){
		var $this = $('.db-close-popup-style .db-close-black input:radio:checked');
		var $btn = $('.db-popup-close');
		if ( $this.is(':checked') ) {
			$btn.addClass('db-close-black');
		} else{
			$btn.removeClass('db-close-black');
		}
		page.heightPopupUpdate();
	},
	styleMarkersPopup: function(){
		$checkbox = $('.db-marker-popup-style input:checkbox');
		var $list = $('.db-modal-popup ul');
		if ( $checkbox.is(':checked') ) {
			$list.removeClass('db-marker-none');
			var $this = $('.db-marker-popup-style .db-marker-black input:radio:checked');
			if ( $this.is(':checked') ) {
				$list.addClass('db-marker-black');
			} else{
				$list.removeClass('db-marker-black');
			}
		} else {
			$list.addClass('db-marker-none');
		}
	},
	positionPopupModal: function(){
		var $popup = $('.builder-popup');
		$popup.css({
			marginLeft: -$popup.outerWidth()/2,
			marginTop: -$popup.outerHeight()/2
		});
	},
	positionPopupCanvasInit: function(){
		var $posPopup = $('#db-position-popup');
		$posPopup.find('.region-pos').on('click', function(){
			var $region = $(this);
			$region.addClass('selected').siblings('.region-pos').removeClass('selected');
			if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_LEFT_TOP) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_LEFT_TOP);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_CENTER_TOP) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_CENTER_TOP);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_RIGHT_TOP) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_RIGHT_TOP);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_LEFT_CENTER) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_LEFT_CENTER);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_CENTER_CENTER) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_CENTER_CENTER);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_RIGHT_CENTER) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_RIGHT_CENTER);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_LEFT_BOTTOM) ){
				$posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_LEFT_BOTTOM);
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_CENTER_BOTTOM) ){
			   $posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_CENTER_BOTTOM); 
			} else if ( $region.hasClass(LL_DIALOG_CANVAS_POSITION_RIGHT_BOTTOM) ){
			   $posPopup.attr('data-position',LL_DIALOG_CANVAS_POSITION_RIGHT_BOTTOM); 
			}
			page.isPositionCustomPopup();
		});
		$('#checkbox-custom-position').on('click', function(){
			page.isPositionCustomPopup();
		});
		$posPopup.find('.db-pos-left, .db-pos-top').spinner({
			min: 0,
			change: function( event, ui ) {
				page.isPositionCustomPopup();
			}
		});
		page.isPositionCustomPopup();
	},
	isPositionCustomPopup: function(){
		var $this = $('#checkbox-custom-position');
		var $posPopup = $('#db-position-popup');
		if ( $this.is(':checked') ) {
			$posPopup.addClass('db-costom-ppostion-on');
			page.positionPopupCanvas(true);
		} else{
			$posPopup.removeClass('db-costom-ppostion-on');
			page.positionPopupCanvas(false);
		}
	},
	positionPopupCanvas: function(isCustom){
		var $posPopup = $('#db-position-popup');
		var $popup = $('.builder-popup.db-popup-canvas');
		var $wrapPopup = $popup.closest('.db-wrap-modal-popup');
		
		var cssClass = 'db-pos-left-top db-pos-center-top db-pos-right-top db-pos-left-center db-pos-center-center db-pos-right-center db-pos-left-bottom db-pos-center-bottom db-pos-right-bottom';
		
		$wrapPopup.removeClass(cssClass);
		
		if (isCustom){
			var posLeft = $posPopup.find('.db-pos-left').val();
			var posTop = $posPopup.find('.db-pos-top').val();
			var wrapBoxPaddingLeft = 15;
			var wrapBoxPaddingTop = 15;
			
			$wrapPopup.addClass('db-pos-left-top');
			$popup.css({
				marginLeft: (posLeft - wrapBoxPaddingLeft) +"px",
				marginTop: (posTop - wrapBoxPaddingTop) +"px"
			});
		} else {
			var position = $posPopup.attr('data-position');
			
			$popup.css({
				marginLeft: '',
				marginTop: ''
			});
			
			if ( position == LL_DIALOG_CANVAS_POSITION_LEFT_TOP ){
				$wrapPopup.addClass('db-pos-left-top');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_CENTER_TOP ){
				$wrapPopup.addClass('db-pos-center-top');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_RIGHT_TOP ){
				$wrapPopup.addClass('db-pos-right-top');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_LEFT_CENTER ){
				$wrapPopup.addClass('db-pos-left-center');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_CENTER_CENTER ){
				$wrapPopup.addClass('db-pos-center-center');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_RIGHT_CENTER ){
				$wrapPopup.addClass('db-pos-right-center');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_LEFT_BOTTOM ){
				$wrapPopup.addClass('db-pos-left-bottom');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_CENTER_BOTTOM ){
				$wrapPopup.addClass('db-pos-center-bottom');
			} else if ( position == LL_DIALOG_CANVAS_POSITION_RIGHT_BOTTOM ){
				$wrapPopup.addClass('db-pos-right-bottom');
			}
		}
		
	},
	socialNetworkInit: function(){
		$('.db-social-network-box').find('input[type="checkbox"]').on('click', function(){
			page.socialNetwork($(this).parents('.db-social-network-box'));
		});
		$('.db-social-network-box').find('input[type="text"]').keyup(function(){
			page.socialNetwork($(this).parents('.db-social-network-box'));
		});
		page.socialNetwork();
	},
	socialNetwork: function($link){
		if (!$link){
			$link = $('.db-social-network-box');
		}
		
		$link.each(function(){
			var $box = $(this);
			var $check = $box.find('input[type="checkbox"]');
			var val = '#';
			var type = $box.attr('data-link');
			if ( $check.is(':checked') ) {
				val = $(this).find('input[type="text"]').val();
				if (type == 'fb'){
					$('.db-social-link.db-'+type+'').show().attr('href', val);
				} else if (type == 'tw'){
					$('.db-social-link.db-'+type+'').show().attr('href', val);
				} else if (type == 'in'){
					$('.db-social-link.db-'+type+'').show().attr('href', val);
				} else if (type == 'gg'){
					$('.db-social-link.db-'+type+'').show().attr('href', val);
				}
			} else{
				$('.db-social-link.db-'+type+'').hide();
			}
		});
	},
	effectsPopup: function(){
		$('.db-effect-select').change(function() {
			var effect = $(this).val();
			$('.builder-popup').removeClass('slideDown slideUp slideLeft slideRight fadeIn bounce stretchLeft pullUp pullDown pulse hatch');
			$('.builder-popup').addClass(effect);
			if( effect == 'pulse' ){
				setTimeout(function() { $('.builder-popup').removeClass('pulse'); }, 1200);
			}
		});
	},
	setPopupEffect: function(){
		if($('.builder-popup').length){
			var classList = $('.builder-popup').attr('class').split(/\s+/);
			for (var i = 0 in classList) {
				var $className = classList[i];
				if(ll_combo_manager.is_has_option('.db-effect-select',$className)){
					ll_combo_manager.set_selected_value('.db-effect-select',$className);
					break;
				}
			};
		}
	},
	engagementPopupInit: function(){
		$('#input_engagement_type').change(function() {
			page.engagementPopup();
		});
		page.engagementPopup();
	},
	engagementPopup: function(){
		var engagement_type = $('#input_engagement_type').val();
		$('#container_engagement_type_on_exit_sensitivity').hide();
		$('#container_engagement_type_on_page_click_count').hide();
		$('#container_engagement_type_on_page_scroll_percentage').hide();
		if(engagement_type == LL_DIALOG_ENGAGEMENT_TYPE_ON_EXIT){
			$('#container_engagement_type_on_exit_sensitivity').show();
		} else if (engagement_type == LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_CLICKS){
			$('#container_engagement_type_on_page_click_count').show();
		} else if (engagement_type == LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_SCROLL){
			$('#container_engagement_type_on_page_scroll_percentage').show();
		}
	},
	ribbonAppearanceInit: function(){
		$('#dialog-appearance input').on('click', function(){
			page.ribbonAppearance();
		});
		page.ribbonAppearance();
	},
	ribbonAppearance: function(){
		var input_appearance_type = $('input[name=input_appearance_type]:checked').val();
		var $preview = $('.db-preview-site');
		var popupHeight = $('.db-ribbon-popup').height();
		if ( input_appearance_type == LL_DIALOG_APPEARANCE_TYPE_PUSH_OVER ) {
			$preview.css({
				top: popupHeight
			});
		} else{
			$preview.css({
				top: 0
			});
		}
	},
	videoTheme9: function(height){
		if (height){
			height = height - 50;
			$('.db-container-video').css('padding-bottom',height);
			$('.db-theme-9 .db-wrap-vertical-content').height(height);
		} else {
			$('.db-container-video').css('padding-bottom',$('.db-popup-content-inner').height());
			$('.db-theme-9 .db-wrap-vertical-content').height($('.db-popup-content-inner').height());
		}
		$('.db-theme-9 .db-vertical-content').css('width','auto');
		$('.db-theme-9 .db-vertical-content').css('width', $('.db-content-col-2').width());
	},
	blurPopupInit: function(){
		$('.change-size-blur-popup').TouchSpin({
			min: 0,
			max: 100
		});
		$('.change-size-blur-popup').on('change', function () {
			var blur = $(this).val();
			$('.db-blur').css({
				'filter': 'blur('+blur+'px)',
				'-webkit-filter': 'blur('+blur+'px)',
				'-moz-filter': 'blur('+blur+'px)',
				'-o-filter': 'blur('+blur+'px)',
				'-ms-filter': 'blur('+blur+'px)'
			});
		});
	},
};
$(document).ready(function() {
	page.init();
});