<!--
<?php
include "../configuration.inc";
require_once '../DAL/ll_dialogs_manager.php';

echo '
/* Configuration */
// Collector script location
var GRAP_IP_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/grapIP.php";' . "\n" . '
var COLLECTOR_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/track-engine-advanced.php";' . "\n" . '
var AUTOMATIC_WEB_FORM_TRACKING_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/track-activities.php";' . "\n" . '
var LL_URL_PRIVACY_SETTINGS_PROCESS = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/privacy-settings-process.php";' . "\n" . '
if (location.protocol === "https:") {
	var jQuery_LIBRARY_INCLUDE_URL = "https://d2tkczi6ecqjoh.cloudfront.net/scripts/jquery-1.9.1.min.js";' . "\n" . '
} else {
	var jQuery_LIBRARY_INCLUDE_URL = "http://cdn.leadliaison.com/scripts/jquery-1.9.1.min.js";' . "\n" . '
}
var Wistia_Shepherd_Lib_URL = "https://fast.wistia.net/static/embed_shepherd-v1.js";' . "\n" . '
var GET_PROSPECT_DATA_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/get-prospect-automatic-tracking-data.php?callback=?";' . "\n" . '

var LL_STYLESHEET_CHOSEN = "' . LL_TRACKING_SITEROOTHTTPS . 'js/chosen/chosen.css";' . "\n" . '
var LL_STYLESHEET_jQ_SCROLLBAR = "' . LL_TRACKING_SITEROOTHTTPS . 'js/jquery.scrollbar/jquery.scrollbar.css";' . "\n" . '
var LL_STYLESHEET_PRIVACY = "' . LL_TRACKING_SITEROOTHTTPS . 'CSS/ll_privacy_popup.css";' . "\n" . '
var LL_JS_CHOSEN = "' . LL_TRACKING_SITEROOTHTTPS . 'js/chosen/chosen.jquery.js";' . "\n" . '
var LL_JS_jQ_SCROLLBAR = "' . LL_TRACKING_SITEROOTHTTPS . 'js/jquery.scrollbar/jquery.scrollbar.js";' . "\n" . '

var ouibounce_LIBRARY_INCLUDE_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'js/ouibounce/source/ouibounce.js";' . "\n" . '
var LL_TRACKING_SITEROOTHTTPS = "' . LL_TRACKING_SITEROOTHTTPS . '";' . "\n" . '
var LL_PERSONALIZATION_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/llp-render-process.php?callback=?";' . "\n" . '
var ACTIVITY_URL = "' . LL_TRACKING_SITEROOTHTTPS . 'tracking_engine/trackActivity.php";' . "\n";

?>
var LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM = "<?php echo ll_dialogs_manager::LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM?>";
var LL_DIALOG_BUTTON_ACTION_CLOSE_DIALOG = "<?php echo ll_dialogs_manager::LL_DIALOG_BUTTON_ACTION_CLOSE_DIALOG?>";
var LL_DIALOG_BUTTON_ACTION_REDIRECT = "<?php echo ll_dialogs_manager::LL_DIALOG_BUTTON_ACTION_REDIRECT?>";
var LL_DIALOG_BUTTON_ACTION_RUN_JS = "<?php echo ll_dialogs_manager::LL_DIALOG_BUTTON_ACTION_RUN_JS?>";

var LL_DIALOG_ENGAGEMENT_TYPE_ON_ENTRY = "<?php echo ll_dialogs_manager::LL_DIALOG_ENGAGEMENT_TYPE_ON_ENTRY?>";
var LL_DIALOG_ENGAGEMENT_TYPE_ON_EXIT = "<?php echo ll_dialogs_manager::LL_DIALOG_ENGAGEMENT_TYPE_ON_EXIT?>";
var LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_CLICKS = "<?php echo ll_dialogs_manager::LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_CLICKS?>";
var LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_SCROLL = "<?php echo ll_dialogs_manager::LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_SCROLL?>";

var LL_DIALOG_EXIT_SENSITIVITY_LOW = "<?php echo ll_dialogs_manager::LL_DIALOG_EXIT_SENSITIVITY_LOW?>";
var LL_DIALOG_EXIT_SENSITIVITY_MEDIUM = "<?php echo ll_dialogs_manager::LL_DIALOG_EXIT_SENSITIVITY_MEDIUM?>";
var LL_DIALOG_EXIT_SENSITIVITY_HIGH = "<?php echo ll_dialogs_manager::LL_DIALOG_EXIT_SENSITIVITY_HIGH?>";

var LL_DIALOG_APPEARANCE_TYPE_OVERLAY = "<?php echo ll_dialogs_manager::LL_DIALOG_APPEARANCE_TYPE_OVERLAY?>";
var LL_DIALOG_APPEARANCE_TYPE_PUSH_OVER = "<?php echo ll_dialogs_manager::LL_DIALOG_APPEARANCE_TYPE_PUSH_OVER?>";

var LL_DIALOG_TYPE_CANVAS_ALIAS = "<?php echo ll_dialogs_manager::LL_DIALOG_TYPE_CANVAS_ALIAS?>";
var LL_DIALOG_TYPE_ZONE_ALIAS = "<?php echo ll_dialogs_manager::LL_DIALOG_TYPE_ZONE_ALIAS?>";
var LL_DIALOG_TYPE_MODAL_ALIAS = "<?php echo ll_dialogs_manager::LL_DIALOG_TYPE_MODAL_ALIAS?>";
var LL_DIALOG_TYPE_FOOTER_ALIAS = "<?php echo ll_dialogs_manager::LL_DIALOG_TYPE_FOOTER_ALIAS?>";
var LL_DIALOG_TYPE_RIBBON_ALIAS = "<?php echo ll_dialogs_manager::LL_DIALOG_TYPE_RIBBON_ALIAS?>";
var LL_DIALOG_TYPE_SLIDER_ALIAS = "<?php echo ll_dialogs_manager::LL_DIALOG_TYPE_SLIDER_ALIAS?>";
<?php
require_once 'lltc-helper-classes.js';
require_once 'lltc-privacy-manager.js';
?>

if(ll_is_empty(ll_dialog_manager)){
	var ll_dialog_manager = {
		llps: [],
		loaded_llps: [],
		clicks_count: 0,
		loaded_dialog_style: false,
		current_z_index_incrementer: 0,
		ll_trk_no_ck: 0,
		
		init: function(llps){
			//console.log(llps);
			this.collect_valid_dialogs(llps);
			if(this.llps.length > 0){
				if(!_ll_track_form_submission.is_loaded_jquery_lib){
					if(!_ll_track_form_submission.is_loading_jquery_lib){
						_ll_track_form_submission.is_loading_jquery_lib = true;
						if (_ll_track_form_submission.is_jquery_loaded()) {
							_ll_track_form_submission.ll_jQuery = jQuery;
							
							_ll_track_form_submission.is_loading_jquery_lib = false;
							_ll_track_form_submission.is_loaded_jquery_lib = true;
							window.setTimeout(function(){
								ll_dialog_manager.process_dialogs();
							}, 100);
						}else{
							_ll_track_form_submission.load_script(jQuery_LIBRARY_INCLUDE_URL, function(){
								//https://api.jquery.com/jquery.noconflict/
								_ll_track_form_submission.ll_jQuery = jQuery.noConflict( true );
								
								_ll_track_form_submission.is_loading_jquery_lib = false;
								_ll_track_form_submission.is_loaded_jquery_lib = true;
								window.setTimeout(function(){
									ll_dialog_manager.process_dialogs();
								}, 100);
							});
						}
					} else {
						window.setTimeout(function(){
							ll_dialog_manager.init();
						}, 100);
					}
				} else {
					window.setTimeout(function(){
						ll_dialog_manager.process_dialogs();
					}, 200);
				}
			}
		},
		collect_valid_dialogs: function(llps){
			this.llps = [];
			if(!ll_is_empty(llps) && typeof llps == 'object'){
				llps.forEach(function(llp) {
					if(!ll_is_empty(llp.token) && !ll_is_empty(llcustid)){
						ll_dialog_manager.llps.push(llp)
					}
				});
			}
		},
		process_dialogs: function(){
			if(typeof ll_trk_no_ck != "undefined"){
				this.ll_trk_no_ck = ll_trk_no_ck ? 1 : 0;
			}
			
			var is_has_ll_tracking_code = false;
			if(typeof ll_tracking_code != 'undefined' && !ll_is_empty(ll_tracking_code)) {
				is_has_ll_tracking_code = true;
			} else if(typeof ll_use_automatic_form_tracking != 'undefined') {
				is_has_ll_tracking_code = true;
			} else if(typeof ll_use_lazyload != 'undefined') {
				is_has_ll_tracking_code = true;
			}
			if(is_has_ll_tracking_code){
				if(ll_is_empty(ip_guid_are_loaded)){
					window.setTimeout(function(){
						ll_dialog_manager.process_dialogs();
					}, 100);
				} else {
					ll_dialog_manager.go_process_dialogs();
				}
			} else {
				ll_dialog_manager.go_process_dialogs();
			}
		},
		go_process_dialogs: function(){
			this.llps.forEach(function(llp, _index, all_llps) {
				_ll_track_form_submission.ll_jQuery.getJSON( LL_PERSONALIZATION_URL, {
					action: 'render',
					llcustid: llcustid,
					token: llp.token,
					ll_trk_no_ck: ll_dialog_manager.ll_trk_no_ck,
					ll_is_anonymize_ip: ll_is_anonymize_ip
				}).done(function( _response_data ) {
					//console.log(_response_data)
					if(!ll_is_empty(_response_data)){
						if(!ll_is_empty(_response_data.success)){
							llp.ll_personalization = _response_data.ll_personalization;
							llp.ll_dialog = _response_data.ll_dialog;
							
							ll_dialog_manager.llps[_index] = llp;
							
							if(!ll_is_empty(llp.ll_dialog.ll_dialog_html)){
								if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_ZONE_ALIAS){
									ll_dialog_manager.process_render_html(llp);
								} else {
									if(!ll_is_empty(llp.ll_dialog.ll_dialog_settings)){
										if(!ll_is_empty(llp.ll_dialog.ll_dialog_settings.engagement_type)){
											var engagement_type = llp.ll_dialog.ll_dialog_settings.engagement_type;
											var engagement_type_on_exit_sensitivity = llp.ll_dialog.ll_dialog_settings.engagement_type_on_exit_sensitivity;
											var engagement_type_on_page_click_count = llp.ll_dialog.ll_dialog_settings.engagement_type_on_page_click_count;
											var engagement_type_on_page_scroll_percentage = llp.ll_dialog.ll_dialog_settings.engagement_type_on_page_scroll_percentage;
											var loading_delay = llp.ll_dialog.ll_dialog_settings.loading_delay;
											switch(engagement_type){
												case LL_DIALOG_ENGAGEMENT_TYPE_ON_ENTRY:
													if(!ll_is_empty(loading_delay)){
														window.setTimeout(function(){
															ll_dialog_manager.process_render_html(llp);
														}, loading_delay);
													} else {
														ll_dialog_manager.process_render_html(llp);
													}
													break;
												case LL_DIALOG_ENGAGEMENT_TYPE_ON_EXIT:
													_ll_track_form_submission.load_script(ouibounce_LIBRARY_INCLUDE_URL, function(){
														var sensitivity = 20;
														if(engagement_type_on_exit_sensitivity == LL_DIALOG_EXIT_SENSITIVITY_LOW){
															sensitivity = 20;
														}else if(engagement_type_on_exit_sensitivity == LL_DIALOG_EXIT_SENSITIVITY_MEDIUM){
															sensitivity = 40;
														}else if(engagement_type_on_exit_sensitivity == LL_DIALOG_EXIT_SENSITIVITY_HIGH){
															sensitivity = 60;
														}
														ouibounce(_ll_track_form_submission.ll_jQuery('body')[0], {
															sensitivity: sensitivity,
															timer: 0,
															aggressive: true,
															callback: function() {
																ll_dialog_manager.process_render_html(llp);
															}
														});
													});
													break;
												case LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_CLICKS:
													if(!ll_is_empty(engagement_type_on_page_click_count)){
														_ll_track_form_submission.ll_jQuery(document).bind('click', function(){
															ll_dialog_manager.clicks_count++;
															if(ll_dialog_manager.clicks_count == engagement_type_on_page_click_count){
																ll_dialog_manager.process_render_html(llp);
															}
														})
													} else {
														ll_dialog_manager.process_render_html(llp);
													}
													break;
												case LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_SCROLL:
													if(!ll_is_empty(engagement_type_on_page_scroll_percentage)){
														_ll_track_form_submission.ll_jQuery(document).bind('click', function(){
															ll_dialog_manager.clicks_count++;
															if(ll_dialog_manager.clicks_count == engagement_type_on_page_scroll_percentage){
																ll_dialog_manager.process_render_html(llp);
															}
														})
														
														_ll_track_form_submission.ll_jQuery(window).scroll(function() {
															var scrollPercentShow = engagement_type_on_page_scroll_percentage; //
															
															var currY = _ll_track_form_submission.ll_jQuery(this).scrollTop();
															var postHeight = _ll_track_form_submission.ll_jQuery(this).height();
															var scrollHeight = _ll_track_form_submission.ll_jQuery(document).height();
															
															var scrollPercent = (currY / (scrollHeight - postHeight)) * 100;
									
															if ( scrollPercent >= scrollPercentShow ){
																if (typeof llp.is_loaded == 'undefined' || !llp.is_loaded) {
																	llp.is_loaded = true;
																	//console.log (llp);
																	ll_dialog_manager.process_render_html(llp);
																}
															}
															//console.log ('scrollPercent: ' + scrollPercent);
														});
													} else {
														ll_dialog_manager.process_render_html(llp);
													}
													break;
											}
										}
										
									}
									//ll_dialog_manager.process_render_html(llp);
								}
							}
						}
					}
				})
			});
		},
		process_render_html: function(llp){
			//console.log(llp);
			if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_ZONE_ALIAS){
				if(!ll_is_empty(llp.ll_dialog.ll_dialog_settings.dialog_zone_container_id)){
					_ll_track_form_submission.ll_jQuery('#' + llp.ll_dialog.ll_dialog_settings.dialog_zone_container_id).html(llp.ll_dialog.ll_dialog_html);
				}
			} else {
				var _fade_html = '';
				if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_MODAL_ALIAS || llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_CANVAS_ALIAS){
					_fade_html += '<div class="ll-fade"></div>';
				}
				var _dialog_html = '';
				_dialog_html += '<div class="container-ll-dialog" token="' + llp.ll_personalization.ll_personalization_token + '">';
				
				if(!ll_dialog_manager.loaded_dialog_style){
					ll_dialog_manager.loaded_dialog_style = true;
					var _dialog_cc = '	<link rel="stylesheet" type="text/css" href="' + LL_TRACKING_SITEROOTHTTPS + 'dialog.css"/>'
					 _dialog_cc += '	<link rel="stylesheet" type="text/css" href="' + LL_TRACKING_SITEROOTHTTPS + 'dialog-responsive.css"/>'
					_ll_track_form_submission.ll_jQuery('body').after(_dialog_cc);
				}
				_dialog_html += '	<div class="ll-message-warning">';
				_dialog_html += '		<p></p>';
				_dialog_html += '	</div>';
				_dialog_html += '	<div class="ll-message-success">';
				_dialog_html += '		<p></p>';
				_dialog_html += '	</div>';
				_dialog_html += '	<div class="ll-message-error">';
				_dialog_html += '		<p></p>';
				_dialog_html += '	</div>';
				
				_dialog_html += '	<div class="dialog-build-content clearfix">';
				_dialog_html += '		' + llp.ll_dialog.ll_dialog_html;
				_dialog_html += '	</div>';
				_dialog_html += '	' + _fade_html;
				_dialog_html += '</div>';
				_ll_track_form_submission.ll_jQuery('body').after(_dialog_html);
				
				var _dialog_container = _ll_track_form_submission.ll_jQuery('.container-ll-dialog:first');
				
				ll_dialog_manager.current_z_index_incrementer++;
				var _dialog_z_index = _ll_track_form_submission.ll_jQuery(_dialog_container).find('.builder-popup').css('z-index')
				_ll_track_form_submission.ll_jQuery(_dialog_container).find('.builder-popup').css('z-index', ll_dialog_manager.current_z_index_incrementer + _dialog_z_index + 1)
				
				//_ll_track_form_submission.ll_jQuery('.db-popup-close').unbind('click');
				_ll_track_form_submission.ll_jQuery(_dialog_container).find('.db-popup-close').bind('click', function(){
					ll_dialog_manager.close_dialog(this);
				})
				//_ll_track_form_submission.ll_jQuery('.db-btn-customize').unbind('click');
				_ll_track_form_submission.ll_jQuery(_dialog_container).find('.db-btn-customize').bind('click', function(){
					var ll_btn_action = _ll_track_form_submission.ll_jQuery(this).attr('ll-btn-action');
					if(typeof ll_btn_action == 'undefined' || (ll_btn_action != LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM && ll_btn_action != LL_DIALOG_BUTTON_ACTION_CLOSE_DIALOG && ll_btn_action != LL_DIALOG_BUTTON_ACTION_REDIRECT && ll_btn_action != LL_DIALOG_BUTTON_ACTION_RUN_JS) ){
						ll_btn_action = LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM;
					}
					switch(ll_btn_action){
						case LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM:
							ll_dialog_manager.process_submit_dialog(this)
							return false;
							break;
						case LL_DIALOG_BUTTON_ACTION_CLOSE_DIALOG:
							ll_dialog_manager.close_dialog(this);
							return false;
							break;
						case LL_DIALOG_BUTTON_ACTION_REDIRECT:
							return true;
							break;
						case LL_DIALOG_BUTTON_ACTION_RUN_JS:
							var ll_btn_js_code = _ll_track_form_submission.ll_jQuery(this).attr('ll-btn-js-code');
							if(typeof ll_btn_js_code != 'undefined' && !ll_is_empty(ll_btn_js_code)){
								try{
									eval(ll_btn_js_code);
								}catch(err){ }
							}
							return false;
							break;
					}
				})
				
				if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_RIBBON_ALIAS || llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_FOOTER_ALIAS){
					var change_count = 0;
					ll_dialog_manager.position_ribbon(llp.ll_dialog.ll_dialog_type_alias, _dialog_container, llp, change_count);
				}
			}
			this.log_dialog_view(llp);
			
			ll_page_mobile_dialog_manager.init();
		},
		close_dialog: function(_dialog_close){
			var _container_dialog = _ll_track_form_submission.ll_jQuery(_dialog_close).parents('.container-ll-dialog');
			var ll_personalization_token = _ll_track_form_submission.ll_jQuery(_container_dialog).attr('token');
			var membership_id = _ll_track_form_submission.ll_jQuery(_container_dialog).attr('membership_id');
			
			_container_dialog.remove();
			
			var selected_llp = this.get_selected_llp_by_token(ll_personalization_token);
			if(typeof membership_id != 'undefined' && membership_id > 0 && selected_llp){
				_ll_track_form_submission.ll_jQuery.getJSON( LL_PERSONALIZATION_URL, {
					action: 'dismiss_dialog',
					llcustid: llcustid,
					membership_id: membership_id,
					token: selected_llp.ll_personalization.ll_personalization_token,
					lldid: selected_llp.ll_dialog.ll_dialog_id,
					ll_trk_no_ck: ll_dialog_manager.ll_trk_no_ck,
					ll_is_anonymize_ip: ll_is_anonymize_ip
				}).done(function( _response_data ) {
					//console.log(_response_data)
				});
			}
		},
		position_ribbon: function(ll_dialog_type_alias, _dialog_container, llp, change_count){
			if ( llp.ll_dialog.ll_dialog_settings.appearance_type == LL_DIALOG_APPEARANCE_TYPE_PUSH_OVER ) {
				if(typeof _dialog_container.next_wait == 'undefined' || !_dialog_container.next_wait ){
					_dialog_container.next_wait = 300;
				} else {
					_dialog_container.next_wait = (_dialog_container.next_wait >= 1000) ? 1000 : _dialog_container.next_wait + 100;
				}
				window.setTimeout(function(){
					var _preview = _ll_track_form_submission.ll_jQuery('body');
					
					if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_RIBBON_ALIAS){
						var _popup = _ll_track_form_submission.ll_jQuery(_dialog_container).find('.db-ribbon-popup');
					} else if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_FOOTER_ALIAS){
						var _popup = _ll_track_form_submission.ll_jQuery(_dialog_container).find('.db-footer-popup');
					}
					
					var popupHeight = _popup.height();
					//console.log('Height: ' + popupHeight);
					
					if(typeof _dialog_container.initial_height == 'undefined' || !_dialog_container.initial_height ){
						_dialog_container.initial_height = popupHeight;
					}
					
					if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_RIBBON_ALIAS){
						_preview.css("padding-top", popupHeight);
					} else if(llp.ll_dialog.ll_dialog_type_alias == LL_DIALOG_TYPE_FOOTER_ALIAS){
						_preview.css("padding-bottom", popupHeight);
					}
					
					change_count++;
					if(change_count <= 20 && _dialog_container.initial_height == popupHeight){
						ll_dialog_manager.position_ribbon(ll_dialog_type_alias, _dialog_container, llp, change_count);
					}
				}, _dialog_container.next_wait);
				//console.log("Wait: " + _dialog_container.next_wait)
			}
		},
		set_dialog_visibility: function(_container_dialog, is_show){
			if(is_show){
				_ll_track_form_submission.ll_jQuery(_container_dialog).find('.dialog-build-content').show();
				_ll_track_form_submission.ll_jQuery(_container_dialog).find('.ll-fade').show();
			} else {
				_ll_track_form_submission.ll_jQuery(_container_dialog).find('.dialog-build-content').hide();
				_ll_track_form_submission.ll_jQuery(_container_dialog).find('.ll-fade').hide();
			}
		},
		log_dialog_view: function(llp){
			_ll_track_form_submission.ll_jQuery.getJSON( LL_PERSONALIZATION_URL, {
				action: 'log_view',
				llcustid: llcustid,
				token: llp.ll_personalization.ll_personalization_token,
				lldid: llp.ll_dialog.ll_dialog_id,
				ll_trk_no_ck: ll_dialog_manager.ll_trk_no_ck,
					ll_is_anonymize_ip: ll_is_anonymize_ip
			}).done(function( _response_data ) {
				//console.log(_response_data)
				var membership_id = _response_data.ll_personalization_membership_id;
				_ll_track_form_submission.ll_jQuery('div[token=' + llp.ll_personalization.ll_personalization_token + ']').attr('membership_id', membership_id);
			});
		},
		get_selected_llp_by_token: function(token){
			var selected_llp = null;
			ll_dialog_manager.llps.forEach(function(llp) {
				if(llp.token == token){
					selected_llp = llp;
				}
			});
			return selected_llp;
		},
		process_submit_dialog: function(btn_submit){
			var _container_dialog = _ll_track_form_submission.ll_jQuery(btn_submit).parents('.container-ll-dialog');
			var ll_personalization_token = _ll_track_form_submission.ll_jQuery(_container_dialog).attr('token');
			var membership_id = _ll_track_form_submission.ll_jQuery(_container_dialog).attr('membership_id');
			
			var selected_llp = this.get_selected_llp_by_token(ll_personalization_token);
			if(selected_llp){
				var ll_dialog_id = selected_llp.ll_dialog.ll_dialog_id
				var _email = _ll_track_form_submission.ll_jQuery(_container_dialog).find('.db-email-field input[type=text]').val();
				var _fullname = _ll_track_form_submission.ll_jQuery(_container_dialog).find('.db-name-field input[type=text]').val();
				
				_email = !ll_is_empty(_email) ? _email : '';
				_fullname = !ll_is_empty(_fullname) ? _fullname : '';
				
				if(_email != ''){
					var _data_to_submit = {};
					/**
					 * Form elements submitted info
					 */
					_data_to_submit.action = 'dialog_submission';
					_data_to_submit.token = ll_personalization_token;
					_data_to_submit.lldid = ll_dialog_id;
					_data_to_submit.membership_id = membership_id;
					_data_to_submit.email = _email;
					_data_to_submit.fullname = _fullname;
					_data_to_submit.ll_is_anonymize_ip = ll_is_anonymize_ip;
					
					if(!ll_is_empty(_ll_hit_data)){
						_data_to_submit = _ll_track_form_submission.append_tracking_data(_data_to_submit);
					} else {
						_data_to_submit.ll_trk_no_ck = ll_dialog_manager.ll_trk_no_ck;
					}
					/**
					 * Send the submitted data to LL side.
					 */
					/*
					_ll_track_form_submission.process_call(AUTOMATIC_WEB_FORM_TRACKING_URL, _data_to_submit, function(){
						_ll_track_form_submission.callback_after_form_submitted(_form, _form_index);
					});
					*/
					_ll_track_form_submission.ll_jQuery.getJSON( AUTOMATIC_WEB_FORM_TRACKING_URL + '?callback=?', _data_to_submit).done(function( _response_data ) {
						//console.log(_response_data);
						if(!ll_is_empty(_response_data)){
							if(!ll_is_empty(_response_data.success)){
								ll_dialog_manager.set_dialog_visibility(_container_dialog, false);
								if(!ll_is_empty(_response_data.ll_dialog.ll_dialog_settings.success_message)){
									ll_show_success_message(_response_data.ll_dialog.ll_dialog_settings.success_message)
								}
								if(!ll_is_empty(_response_data.ll_dialog.ll_dialog_settings.redirect_url)){
									window.location = _response_data.ll_dialog.ll_dialog_settings.redirect_url;
								}
							} else {
								ll_show_error_message(_response_data.message);
							}
						} else {
							ll_show_error_message("Unknown error");
						}
					});
				}
			}
		}
	}
	
	if(typeof ll_page_mobile_dialog_manager == 'undefined')
	var ll_page_mobile_dialog_manager = {
		is_done_attaching_resize_event: false,
		
		init: function(){
			ll_page_mobile_dialog_manager.position_popup_mobile();
			
			if(!this.is_done_attaching_resize_event){
				this.is_done_attaching_resize_event = true;
				_ll_track_form_submission.ll_jQuery(window).resize(function() {
					ll_page_mobile_dialog_manager.position_popup_mobile();
				});
			}
		},
		position_popup_mobile: function(){
			if (_ll_track_form_submission.ll_jQuery(window).width() < 768 ) {//|| isMobileDialog
				//console.log('responsove');
				ll_page_mobile_dialog_manager.position_popup_mobile_update();
				
			} else{
				//console.log('not responsive');
			}
		},
		position_popup_mobile_update: function(){
			var _popup = _ll_track_form_submission.ll_jQuery('.builder-popup');
			if ( !_popup.hasClass('db-ribbon-popup') && !_popup.hasClass('db-footer-popup') ){
				var heightWindow = _ll_track_form_submission.ll_jQuery(window).height();
				var widthWindow = _ll_track_form_submission.ll_jQuery(window).width();
				var heightPopup = _popup.outerHeight();
				var widthPopup = _popup.outerWidth();
				var cssPopup = '';
				
				//console.log(heightPopup+20  +' < '+ heightWindow);
				//console.log(widthPopup+20  +' < '+ widthWindow);
				
				if ( (widthPopup + 20) < widthWindow ){
					cssPopup = 'left: 50%; margin-left:' + -widthPopup/2 + 'px !important; ';
				}
				
				if ( (heightPopup + 20) < heightWindow){
					cssPopup += 'position: fixed !important; top: 50% !important; margin-top:' + -heightPopup/2 + 'px !important;';
					_popup.attr('style', cssPopup);
				} else {
					cssPopup = 'position: absolute!important; top: 0 !important; margin-top: 10px;';
					_popup.attr('style', cssPopup);
				}
			}
		}
	};
	
	if(typeof llps != 'undefined')
		ll_dialog_manager.init(llps);
}
//-->
