<?php
require_once dirname ( __FILE__ ) . '/ll_dialogs.php';
require_once dirname ( __FILE__ ) . '/ll_dialog_drafts.php';
require_once dirname ( __FILE__ ) . '/ll_dialog_themes.php';
class ll_dialogs_manager {
	const LL_DIALOG_STATUS_DRAFT = 1;
	const LL_DIALOG_STATUS_READY = 2;
	
	const LL_DIALOG_ENGAGEMENT_TYPE_ON_ENTRY = 'on_entry';
	const LL_DIALOG_ENGAGEMENT_TYPE_ON_EXIT = 'on_exit';
	const LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_CLICKS = 'on_page_clicks';
	const LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_SCROLL = 'on_page_scroll';
	
	const LL_DIALOG_EXIT_SENSITIVITY_LOW = 'low';
	const LL_DIALOG_EXIT_SENSITIVITY_MEDIUM = 'medium';
	const LL_DIALOG_EXIT_SENSITIVITY_HIGH = 'high';
	
	const LL_DIALOG_APPEARANCE_TYPE_OVERLAY = 'overlay';
	const LL_DIALOG_APPEARANCE_TYPE_PUSH_OVER = 'push_over';
	
	const LL_DIALOG_BUTTON_ACTION_SUBMIT_FORM = 'submit';
	const LL_DIALOG_BUTTON_ACTION_CLOSE_DIALOG = 'close';
	const LL_DIALOG_BUTTON_ACTION_REDIRECT = 'redirect';
	const LL_DIALOG_BUTTON_ACTION_RUN_JS = 'run_js';
	
	const LL_DIALOG_TYPE_CANVAS_ID = 1;
	const LL_DIALOG_TYPE_ZONE_ID = 2;
	const LL_DIALOG_TYPE_MODAL_ID = 3;
	const LL_DIALOG_TYPE_FOOTER_ID = 4;
	const LL_DIALOG_TYPE_RIBBON_ID = 5;
	const LL_DIALOG_TYPE_SLIDER_ID = 6;
	
	const LL_DIALOG_TYPE_CANVAS_ALIAS = 'CANVAS';
	const LL_DIALOG_TYPE_ZONE_ALIAS = 'ZONE';
	const LL_DIALOG_TYPE_MODAL_ALIAS = 'MODAL';
	const LL_DIALOG_TYPE_FOOTER_ALIAS = 'FOOTER';
	const LL_DIALOG_TYPE_RIBBON_ALIAS = 'RIBBON';
	const LL_DIALOG_TYPE_SLIDER_ALIAS = 'SLIDER';
	
	const LL_DIALOG_TYPE_CANVAS_NAME = 'Canvas';
	const LL_DIALOG_TYPE_ZONE_NAME = 'Zone';
	const LL_DIALOG_TYPE_MODAL_NAME = 'Modal';
	const LL_DIALOG_TYPE_FOOTER_NAME = 'Footer';
	const LL_DIALOG_TYPE_RIBBON_NAME = 'Ribbon';
	const LL_DIALOG_TYPE_SLIDER_NAME = 'Slider';
	
	const LL_DIALOG_CANVAS_POSITION_LEFT_TOP = 'left-top';
	const LL_DIALOG_CANVAS_POSITION_CENTER_TOP = 'center-top';
	const LL_DIALOG_CANVAS_POSITION_RIGHT_TOP = 'right-top';
	const LL_DIALOG_CANVAS_POSITION_LEFT_BOTTOM = 'left-bottom';
	const LL_DIALOG_CANVAS_POSITION_CENTER_BOTTOM = 'center-bottom';
	const LL_DIALOG_CANVAS_POSITION_RIGHT_BOTTOM = 'right-bottom';
	const LL_DIALOG_CANVAS_POSITION_LEFT_CENTER = 'center-left';
	const LL_DIALOG_CANVAS_POSITION_CENTER_CENTER = 'center-center';
	const LL_DIALOG_CANVAS_POSITION_RIGHT_CENTER = 'center-right';
	
	public static function get_status_name($ll_dialog_status) {
		switch ($ll_dialog_status) {
			case self::LL_DIALOG_STATUS_DRAFT :
				return 'Draft';
				break;
			case self::LL_DIALOG_STATUS_READY :
				return 'Ready';
				break;
		}
		return '';
	}
	
	public static function validate_engagement_type($ll_dialog_type_alias, $engagement_type, $engagement_type_on_exit_sensitivity, $engagement_type_on_page_click_count, $engagement_type_on_page_scroll_percentage) {
		if ($ll_dialog_type_alias != self::LL_DIALOG_TYPE_ZONE_ALIAS) {
			switch ($engagement_type) {
				case self::LL_DIALOG_ENGAGEMENT_TYPE_ON_ENTRY :
					return true;
					break;
				case self::LL_DIALOG_ENGAGEMENT_TYPE_ON_EXIT :
					switch ($engagement_type_on_exit_sensitivity) {
						case self::LL_DIALOG_EXIT_SENSITIVITY_LOW :
						case self::LL_DIALOG_EXIT_SENSITIVITY_MEDIUM :
						case self::LL_DIALOG_EXIT_SENSITIVITY_HIGH :
							return true;
							break;
					}
					break;
				case self::LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_CLICKS :
					if ($engagement_type_on_page_click_count) {
						return true;
					}
					break;
				case self::LL_DIALOG_ENGAGEMENT_TYPE_ON_PAGE_SCROLL :
					if ($engagement_type_on_page_scroll_percentage) {
						return true;
					}
					break;
			}
		} else {
			return true;
		}
		return false;
	}
	public static function validate_apperance_type($ll_dialog_type_alias, $appearance_type) {
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_RIBBON_ID :
			case self::LL_DIALOG_TYPE_FOOTER_ID :
				switch ($appearance_type) {
					case self::LL_DIALOG_APPEARANCE_TYPE_OVERLAY :
					case self::LL_DIALOG_APPEARANCE_TYPE_PUSH_OVER :
						return true;
						break;
				}
				break;
			default :
				return true;
				break;
		}
		return false;
	}
	public static function validate_canvas_position($ll_dialog_type_alias, $canvas_position) {
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_CANVAS_ALIAS :
				switch ($canvas_position) {
					case self::LL_DIALOG_CANVAS_POSITION_LEFT_TOP :
					case self::LL_DIALOG_CANVAS_POSITION_CENTER_TOP :
					case self::LL_DIALOG_CANVAS_POSITION_RIGHT_TOP :
					case self::LL_DIALOG_CANVAS_POSITION_LEFT_BOTTOM :
					case self::LL_DIALOG_CANVAS_POSITION_CENTER_BOTTOM :
					case self::LL_DIALOG_CANVAS_POSITION_RIGHT_BOTTOM :
					case self::LL_DIALOG_CANVAS_POSITION_LEFT_CENTER :
					case self::LL_DIALOG_CANVAS_POSITION_CENTER_CENTER :
					case self::LL_DIALOG_CANVAS_POSITION_RIGHT_CENTER :
						return true;
						break;
					default :
						$pos_parts = explode ( ':', $canvas_position );
						return ($pos_parts [0] == 'custom' && intval ( $pos_parts [1] ) && intval ( $pos_parts [2] ));
						break;
				}
				break;
			default :
				return true;
				break;
		}
	}
	public static function validate_modal_width($ll_dialog_type_alias, $ll_dialog_theme_id, $modal_width) {
		$dialog_default_settings = self::get_dialog_default_settings ( $ll_dialog_type_alias, $ll_dialog_theme_id );
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_CANVAS_ALIAS :
				return ($modal_width >= $dialog_default_settings ['modal_width_min'] && $modal_width <= $dialog_default_settings ['modal_width_max']);
				break;
			case self::LL_DIALOG_TYPE_SLIDER_ALIAS :
				return ($modal_width >= $dialog_default_settings ['modal_width_min'] && $modal_width <= $dialog_default_settings ['modal_width_max']);
				break;
			case self::LL_DIALOG_TYPE_MODAL_ALIAS :
				return ($modal_width >= $dialog_default_settings ['modal_width_min'] && $modal_width <= $dialog_default_settings ['modal_width_max']);
				break;
			default :
				return true;
				break;
		}
	}
	public static function validate_modal_height($ll_dialog_type_alias, $ll_dialog_theme_id, $modal_height) {
		$dialog_default_settings = self::get_dialog_default_settings ( $ll_dialog_type_alias, $ll_dialog_theme_id );
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_MODAL_ALIAS :
				return ($modal_height >= $dialog_default_settings ['modal_height_min'] && $modal_height <= $dialog_default_settings ['modal_height_max']);
				break;
			default :
				return true;
				break;
		}
	}
	public static function get_dialog_type_id_by_alias($ll_dialog_type_alias) {
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_CANVAS_ALIAS :
				return self::LL_DIALOG_TYPE_CANVAS_ID;
				break;
			case self::LL_DIALOG_TYPE_ZONE_ALIAS :
				return self::LL_DIALOG_TYPE_ZONE_ID;
				break;
			case self::LL_DIALOG_TYPE_MODAL_ALIAS :
				return self::LL_DIALOG_TYPE_MODAL_ID;
				break;
			case self::LL_DIALOG_TYPE_FOOTER_ALIAS :
				return self::LL_DIALOG_TYPE_FOOTER_ID;
				break;
			case self::LL_DIALOG_TYPE_RIBBON_ALIAS :
				return self::LL_DIALOG_TYPE_RIBBON_ID;
				break;
			case self::LL_DIALOG_TYPE_SLIDER_ALIAS :
				return self::LL_DIALOG_TYPE_SLIDER_ID;
				break;
		}
		return false;
	}
	public static function get_dialog_type_alias_by_id($ll_dialog_type_id) {
		switch ($ll_dialog_type_id) {
			case self::LL_DIALOG_TYPE_CANVAS_ID :
				return self::LL_DIALOG_TYPE_CANVAS_ALIAS;
				break;
			case self::LL_DIALOG_TYPE_ZONE_ID :
				return self::LL_DIALOG_TYPE_ZONE_ALIAS;
				break;
			case self::LL_DIALOG_TYPE_MODAL_ID :
				return self::LL_DIALOG_TYPE_MODAL_ALIAS;
				break;
			case self::LL_DIALOG_TYPE_FOOTER_ID :
				return self::LL_DIALOG_TYPE_FOOTER_ALIAS;
				break;
			case self::LL_DIALOG_TYPE_RIBBON_ID :
				return self::LL_DIALOG_TYPE_RIBBON_ALIAS;
				break;
			case self::LL_DIALOG_TYPE_SLIDER_ID :
				return self::LL_DIALOG_TYPE_SLIDER_ALIAS;
				break;
		}
		return false;
	}
	public static function get_dialog_type_name_by_id($ll_dialog_type_id) {
		switch ($ll_dialog_type_id) {
			case self::LL_DIALOG_TYPE_CANVAS_ID :
				return self::LL_DIALOG_TYPE_CANVAS_NAME;
				break;
			case self::LL_DIALOG_TYPE_ZONE_ID :
				return self::LL_DIALOG_TYPE_ZONE_NAME;
				break;
			case self::LL_DIALOG_TYPE_MODAL_ID :
				return self::LL_DIALOG_TYPE_MODAL_NAME;
				break;
			case self::LL_DIALOG_TYPE_FOOTER_ID :
				return self::LL_DIALOG_TYPE_FOOTER_NAME;
				break;
			case self::LL_DIALOG_TYPE_RIBBON_ID :
				return self::LL_DIALOG_TYPE_RIBBON_NAME;
				break;
			case self::LL_DIALOG_TYPE_SLIDER_ID :
				return self::LL_DIALOG_TYPE_SLIDER_NAME;
				break;
		}
		return false;
	}
	public static function get_dialog_default_settings($ll_dialog_type_alias, $ll_dialog_theme_id = 0) {
		$dialog_default_settings = array ();
		$dialog_default_settings ['loading_delay'] = 5000;
		$dialog_default_settings ['cookie_duration'] = 30;
		$dialog_default_settings ['is_do_not_show_if_manually_closed'] = 1;
		$dialog_default_settings ['is_do_not_show_if_converted'] = 1;
		$dialog_default_settings ['background_blue'] = 4;
		$dialog_default_settings ['success_message'] = 'Thanks for subscribing! We look forward to communicating with you.';
		$dialog_default_settings ['redirect_url'] = '';
		$dialog_default_settings ['engagement_type'] = self::LL_DIALOG_ENGAGEMENT_TYPE_ON_ENTRY;
		$dialog_default_settings ['engagement_type_on_exit_sensitivity'] = self::LL_DIALOG_EXIT_SENSITIVITY_LOW;
		$dialog_default_settings ['engagement_type_on_page_click_count'] = 3;
		$dialog_default_settings ['engagement_type_on_page_scroll_percentage'] = 40;
		$dialog_default_settings ['appearance_type'] = self::LL_DIALOG_APPEARANCE_TYPE_OVERLAY;
		$dialog_default_settings ['dialog_zone_container_id'] = '';
		$dialog_default_settings ['canvas_position'] = self::LL_DIALOG_CANVAS_POSITION_CENTER_CENTER;
		
		$dialog_default_settings ['ll_abstract_campaign_id'] = '0';
		$dialog_default_settings ['ll_list_ids'] = '';
		$dialog_default_settings ['ll_automation_ids'] = '';
		
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_CANVAS_ALIAS :
				//$dialog_default_settings ['modal_width_min'] = 580;
				//$dialog_default_settings ['modal_width_max'] = 840;
				$dialog_default_settings ['modal_width_min'] = 300;
				$dialog_default_settings ['modal_width_max'] = 1000;
				$dialog_default_settings ['modal_width'] = 600;
				break;
			case self::LL_DIALOG_TYPE_SLIDER_ALIAS :
				//$dialog_default_settings ['modal_width_min'] = 360;
				//$dialog_default_settings ['modal_width_max'] = 840;
				$dialog_default_settings ['modal_width_min'] = 300;
				$dialog_default_settings ['modal_width_max'] = 1000;
				$dialog_default_settings ['modal_width'] = 360;
				break;
			case self::LL_DIALOG_TYPE_MODAL_ALIAS :
				$ll_dialog_theme = new ll_dialog_themes ( $ll_dialog_theme_id, '', true );
				$dialog_default_settings ['modal_width_min'] = $ll_dialog_theme->ll_dialog_theme_default_settings ['modal_width_min'];
				$dialog_default_settings ['modal_width_max'] = $ll_dialog_theme->ll_dialog_theme_default_settings ['modal_width_max'];
				$dialog_default_settings ['modal_width'] = $ll_dialog_theme->ll_dialog_theme_default_settings ['modal_width'];
				$dialog_default_settings ['modal_height_min'] = $ll_dialog_theme->ll_dialog_theme_default_settings ['modal_height_min'];
				$dialog_default_settings ['modal_height_max'] = $ll_dialog_theme->ll_dialog_theme_default_settings ['modal_height_max'];
				$dialog_default_settings ['modal_height'] = $ll_dialog_theme->ll_dialog_theme_default_settings ['modal_height'];
				break;
		}
		
		return $dialog_default_settings;
	}
	public static function validate_dialog_settings($customerID, $ll_dialog, $ll_dialog_html, //
/*												*/	$engagement_type, $engagement_type_on_exit_sensitivity, $engagement_type_on_page_click_count, $engagement_type_on_page_scroll_percentage, //
/*												*/	$canvas_position, $appearance_type, $modal_width, $modal_height, //
/*												*/	&$ll_abstract_campaign_id, &$ll_list_ids, &$ll_automation_ids) {
		
		if (! $ll_dialog_html) {
			return array ('success' => 0, 'message' => 'Empty HTML' );
		}
		$is_valid_engagement_type = self::validate_engagement_type ( $ll_dialog->ll_dialog_type_alias, $engagement_type, $engagement_type_on_exit_sensitivity, $engagement_type_on_page_click_count, $engagement_type_on_page_scroll_percentage );
		if (! $is_valid_engagement_type) {
			return array ('success' => 0, 'message' => 'Invalid Engagement Type' );
		}
		$is_valid_canvas_position = self::validate_canvas_position ( $ll_dialog->ll_dialog_type_alias, $canvas_position );
		if (! $is_valid_canvas_position) {
			return array ('success' => 0, 'message' => 'Invalid Canvas Position' );
		}
		$is_valid_appearance_type = self::validate_apperance_type ( $ll_dialog->ll_dialog_type_alias, $appearance_type );
		if (! $is_valid_appearance_type) {
			return array ('success' => 0, 'message' => 'Invalid Appearance Type' );
		}
		$is_valid_modal_width = self::validate_modal_width ( $ll_dialog->ll_dialog_type_alias, $ll_dialog->ll_dialog_theme_id, $modal_width );
		if (! $is_valid_modal_width) {
			return array ('success' => 0, 'message' => 'Invalid Modal Width' );
		}
		$is_valid_modal_height = self::validate_modal_height ( $ll_dialog->ll_dialog_type_alias, $ll_dialog->ll_dialog_theme_id, $modal_height );
		if (! $is_valid_modal_height) {
			return array ('success' => 0, 'message' => 'Invalid Modal Height' );
		}
		if ($ll_abstract_campaign_id) {
			$is_valid_abstract_campaign = ll_abstract_campaigns::check_campaign_by_id ( $customerID, $ll_abstract_campaign_id );
			if (! $is_valid_abstract_campaign) {
				$ll_abstract_campaign_id = 0;
			}
		}
		if ($ll_list_ids) {
			$valid_ll_list_ids = array ();
			if (is_array ( $ll_list_ids )) {
				foreach ( $ll_list_ids as $ll_list_id ) {
					$ll_list_id = intval ( $ll_list_id );
					if ($ll_list_id) {
						$valid_ll_list_ids [$ll_list_id] = $ll_list_id;
					}
				}
			}
			$ll_list_ids = array_keys ( $valid_ll_list_ids );
		}
		if ($ll_automation_ids) {
			$valid_ll_automation_ids = array ();
			if (is_array ( $ll_automation_ids )) {
				foreach ( $ll_automation_ids as $ll_automation_id ) {
					$ll_automation_id = intval ( $ll_automation_id );
					if ($ll_automation_id) {
						$valid_ll_automation_ids [$ll_automation_id] = $ll_automation_id;
					}
				}
			}
			$ll_automation_ids = array_keys ( $valid_ll_automation_ids );
		}
		return array ('success' => 1 );
	}
	public static function get_dialog_default_HTML($ll_dialog_type_alias, $ll_dialog_theme_id = 0) {
		$dialog_default_html = '';
		switch ($ll_dialog_type_alias) {
			case self::LL_DIALOG_TYPE_FOOTER_ALIAS :
			case self::LL_DIALOG_TYPE_RIBBON_ALIAS :
				$dialog_default_html = self::get_dialog_default_html_footer_ribbon ( $ll_dialog_type_alias );
				break;
			case self::LL_DIALOG_TYPE_ZONE_ALIAS :
				break;
			case self::LL_DIALOG_TYPE_SLIDER_ALIAS :
				$dialog_default_html = self::get_dialog_default_html_slider ();
				break;
			case self::LL_DIALOG_TYPE_CANVAS_ALIAS :
				$dialog_default_html = self::get_dialog_default_html_canvas ();
				break;
			case self::LL_DIALOG_TYPE_MODAL_ALIAS :
				$ll_dialog_theme = new ll_dialog_themes ( $ll_dialog_theme_id, '', true );
				$dialog_default_html = $ll_dialog_theme->ll_dialog_theme_html;
				break;
		}
		return $dialog_default_html;
	}
	public static function get_dialog_default_html_footer_ribbon($ll_dialog_type_alias) {
		$ll_dialog_type_class = strtolower ( $ll_dialog_type_alias );
		$ll_dialog_type_title = ucwords ( $ll_dialog_type_class );
		$dialog_default_html = <<<EOT
<div class="builder-popup db-{$ll_dialog_type_class}-popup" data-type-popup="{$ll_dialog_type_class}">
	<a href="javascript:void(0)" class="db-popup-close"></a>
	<div class="db-popup-content">
		<div class="db-template-popup-content clearfix">
			<div class="db-left-box">
				<div class="db-popup-content-inner">
					<div class="db-outer-content" data-outer="text">
						<div class="db-outer-content-inner">
							<div class="db-clear-el">Clear</div>
							<div class="db-html-el">
								<h2>
									<span style="font-size: 18pt;"><span style="color: #fb8f04;"> {$ll_dialog_type_title} text goes here</span> </span>
								</h2>
							</div>
						</div>
					</div>
					<div class="db-outer-content" data-outer="text">
						<div class="db-outer-content-inner">
							<div class="db-clear-el">Clear</div>
							<div class="db-html-el">
								<p><span style="font-size: 12pt;">Lorem ipsum dolor sit amet, consectetur adipisicing</span></p>
								<p><span style="font-size: 12pt;"> elit, sed doeuismod tempor incididunt ut labore et</span></p>
								<p><span style="font-size: 12pt;"> dolore magna aliqua. Ut enim ad minim veniam</span></p>
							</div>
						</div>
					</div>

				</div>
			</div>
			<div class="db-right-box">
				<div class="db-popup-content-inner">
					<div class="fields-modal-popup clearfix">
						<div class="field db-name-field">
							<input type="text" class="txt_field" placeholder="Enter your name here..."/>
						</div>
						<div class="field db-email-field">
							<input type="text" class="txt_field" placeholder="Enter your email address here..."/>
						</div>
						<div class="db-outer-button">
							<a href="#" class="db-btn-customize">Sign Up</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
EOT;
		return $dialog_default_html;
	}
	public static function get_dialog_default_html_canvas() {
		$dialog_default_html = <<<EOT
<div class="builder-popup db-popup-canvas db-two-columns">
	<div class="db-popup-header">
		<a href="javascript:void(0)" class="db-popup-close"></a>
		<div class="db-outer-content" data-outer="text">
			<div class="db-outer-content-inner">
				<div class="db-clear-el">Clear</div>
				<div class="db-html-el">
					<p style="text-align: center;"><span style="font-size: 14pt;">Header text goes here</span></p>
				</div>
			</div>
		</div>
	</div>
	<div class="db-popup-content">
		<div class="db-popup-content-inner clearfix">
			<div class="db-col-1 droppable-box db-connected-sortable">
				<div class="db-outer-content" data-outer="text">
					<div class="db-outer-content-inner">
						<div class="db-html-el">
							<p><span style="font-size: 10pt;">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeuismod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</span></p>
						</div>
					</div>
					<div class="db-el-move"></div>
					<div class="db-el-delete"></div>
				</div>
			</div>
			<div class="db-col-2 droppable-box db-connected-sortable">
				<div class="db-outer-element db-outer-element-image">
					<div class="db-outer-element-inner">
						<div class="db-image-content">
							<div class="db-change-image">
								<div class="db-change-image-inner">
									<img src="https://app.leadliaison.com/dialog_builder/images/photo_icon.png">
									<p>Change Image</p>
								</div>
							</div>
							<img class="image-shown" src="https://app.leadliaison.com/dialog_builder/images/img.png" />
						</div>
					</div>
					<div class="db-el-move"></div>
					<div class="db-el-delete"></div>
				</div>
			</div>
		</div>
	</div>
	<div class="db-popup-footer clearfix">
		<div class="db-col-1 droppable-box db-connected-sortable">
			<div class="db-outer-element">
				<div class="db-outer-element-inner">
					<div class="field db-email-field">
						<input type="text" class="txt_field db-field-customize" style-font="Arial" colorBorder="cccccc" colorFont="333333" placeholder="Enter your email address here..."/>
					</div>
				</div>
				<div class="db-el-copy" data-element="field"></div>
				<div class="db-el-move"></div>
				<div class="db-el-delete"></div>
			</div>
		</div>
		<div class="db-col-2 droppable-box db-connected-sortable">
			<div class="db-outer-element">
				<div class="db-outer-element-inner">
					<a href="#" style-font="Arial" style-font-size="18px" colorBg="e89c4c" colorBorder="cc7a23" colorFont="ffffff" class="db-btn-customize">Sign Up</a>
				</div>
				<div class="db-el-copy" data-element="button"></div>
				<div class="db-el-move"></div>
				<div class="db-el-delete"></div>
			</div>
		</div>
	</div>
</div>
EOT;
		return $dialog_default_html;
	}
	public static function get_dialog_default_html_slider() {
		$dialog_default_html = <<<EOT
<div class="builder-popup db-popup-slider">
	<div class="db-popup-header">
		<a href="javascript:void(0)" class="db-popup-close"></a>
		<div class="db-outer-content" data-outer="text">
			<div class="db-outer-content-inner">
				<div class="db-clear-el">Clear</div>
				<div class="db-html-el">
					<p style="text-align: center;"><span style="font-size: 14pt;">Header text goes here</span></p>
				</div>
			</div>
		</div>
		
	</div>
	<div class="db-popup-content">
		<div class="db-popup-content-inner droppable-box db-connected-sortable">
			<div class="db-outer-content" data-outer="text">
				<div class="db-outer-content-inner">
					<div class="db-html-el">
						<p><span style="font-size: 10pt;">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed doeuismod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam</span></p>

					</div>
				</div>
				<div class="db-el-move"></div>
				<div class="db-el-delete"></div>
			</div>
		</div>
	</div>
	<div class="db-popup-footer db-connected-sortable">
		<div class="db-outer-element">
			<div class="db-outer-element-inner">
				<div class="field db-email-field">
					<input type="text"  class="txt_field db-field-customize" style-font="Arial" colorBorder="cccccc" colorFont="333333" placeholder="Enter your email address here..."/>
				</div>
			</div>
			<div class="db-el-copy" data-element="field"></div>
			<div class="db-el-move"></div>
			<div class="db-el-delete"></div>
		</div>
		
		<div class="db-outer-element">
			<div class="db-outer-element-inner">
				<div class="db-el-spacing" style="height: 10px;"></div>
			</div>
			<div class="db-el-move"></div>
			<div class="db-el-delete"></div>
		</div>
		
		<div class="db-outer-element">
			<div class="db-outer-element-inner">
				<a href="#" style-font="Arial" style-font-size="18px" colorBg="e89c4c" colorBorder="cc7a23" colorFont="ffffff" class="db-btn-customize">Sign Up</a>
			</div>
			<div class="db-el-copy" data-element="button"></div>
			<div class="db-el-move"></div>
			<div class="db-el-delete"></div>
		</div>
	</div>
</div>
EOT;
		return $dialog_default_html;
	}
}
?>