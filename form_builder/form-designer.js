var $previewColResizable = null;
if(typeof form_type == 'undefined'){
	form_type = '';
	DONATION_HOSTED_WEB_FORM_TYPE = 0;
	PAYMENT_HOSTED_WEB_FORM_TYPE = 0;
}
if(typeof form_payment_gateway_account_id == 'undefined'){
	form_payment_gateway_account_id = 0;
}
if(typeof add_new_fields_to == 'undefined'){
	add_new_fields_to = 'bottom';
}
if(typeof archive_date == 'undefined'){
	archive_date = '';
}

var formBuilderpage = {
	used_mapped_fields: {},
	active_element: '',
	current_element_type: '',
	currencies: {"dollar": "&#36;", "euro": "&#8364;", "pound": "&#163;", "yen": "&#165;"},
	element_current_id: next_element_id,
	is_content_section_break: false,
	selected_payment_account: '',
	is_wizard: false,
	wizard_no_of_pages: 0,
	add_new_fields_to: add_new_fields_to,
	is_google_maps_script_loaded: false,
	device_form_address: device_form_address,
	form_lbl: is_device_form ? 'Event' : 'Form',
	device_form_address_autocomplete: '',
	elements_transcription_notes: {},
	parent_template_form_elements: {},
	is_done_load_landing_pages: false,
	landing_pages: [],
	form_elements: {},
	init: function(){
		$('.age-verification').hide();
		$('#under_age_verification_messages_div').hide();
		$('#over_age_verification_messages_div').hide();
		$('#age_range_verification_message_div').hide();
		$('input[name="is_enable_age_verification"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_enable_age_verification = $(this).is(':checked');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$('.age-verification').hide();
			if($(this).is(':checked')){
				$('.age-verification').show();
			} else {
				ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_under_age_verification"]', false);
				ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_over_age_verification"]', false);
				ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_age_range_verification"]', false);
			}
		});
		$('input[name="is_enable_under_age_verification"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_enable_under_age_verification = $(this).is(':checked');
			$('#under_age_verification_message_div').hide();
			if($(this).is(':checked')){
				$('#under_age_verification_message_div').show();
				opt.under_age_verification_message = opt.under_age_verification_message ? opt.under_age_verification_message :'{first_name} is underage at {age} years old. He/she does not turn {verified_under_age} for another {days_until_verified_age} days.';
				opt.verified_under_age = opt.verified_under_age ? opt.verified_under_age : '';
			} else {
				opt.under_age_verification_message = '';
				opt.verified_under_age = '';
			}
			$('#under_age_verification_message').val(opt.under_age_verification_message);
			$('input[name="verified-under-age"]').val(opt.verified_under_age);
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="is_enable_over_age_verification"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_enable_over_age_verification = $(this).is(':checked');
			$('#over_age_verification_message_div').hide();
			if($(this).is(':checked')){
				$('#over_age_verification_message_div').show();
				opt.over_age_verification_message = opt.over_age_verification_message ? opt.over_age_verification_message : '{first_name} is overage at {age} years old. He/she turned {verified_over_age} {days_over_verified_age} days ago.';
				opt.verified_over_age = opt.verified_over_age ? opt.verified_over_age : '';
			} else {
				opt.over_age_verification_message = '';
				opt.verified_over_age = '';
			}
			$('#over_age_verification_message').val(opt.over_age_verification_message);
			$('input[name="verified-over-age"]').val(opt.verified_over_age);
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="is_enable_age_range_verification"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_enable_age_range_verification = $(this).is(':checked');
			$('#age_range_verification_message_div').hide();
			if($(this).is(':checked')){
				$('#age_range_verification_message_div').show();
				opt.age_range_verification_message = opt.age_range_verification_message ? opt.age_range_verification_message : '{first_name} is between {start_verified_age} and {end_verified_age}. He/she is {age} years old.';
				opt.start_verified_age = opt.start_verified_age? opt.start_verified_age : '';
				opt.end_verified_age = opt.end_verified_age ? opt.end_verified_age : '';
			} else {
				opt.age_range_verification_message = '';
				opt.start_verified_age = '';
				opt.end_verified_age = '';
			}
			$('#age_range_verification_message').val(opt.age_range_verification_message);
			$('input[name="start-verified-age"]').val(opt.start_verified_age);
			$('input[name="end-verified-age"]').val(opt.end_verified_age);
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('#under_age_verification_message').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.under_age_verification_message = $('#under_age_verification_message').val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('#over_age_verification_message').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.over_age_verification_message = $('#over_age_verification_message').val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('#age_range_verification_message').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.age_range_verification_message = $('#age_range_verification_message').val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="verified-under-age"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.verified_under_age = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="verified-over-age"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.verified_over_age = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="start-verified-age"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.start_verified_age = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="end-verified-age"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.end_verified_age = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="is_show_option_to_proceed"]').change( function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_show_option_to_proceed = $(this).is(':checked');
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		ll_combo_manager.make_combo('#button_link_to');
		ll_combo_manager.make_combo('#select_button_landing_page');
		$('#webview-success-message').hide();
		$('.webview_success_redirect').hide();
		var webview_success_action_type =  $('input[name="webview_success_action_type"]:checked').val();
		if(webview_success_action_type == 'message'){
			$('#webview-success-message').show();
		} else if(webview_success_action_type == 'redirect'){
			$('.webview_success_redirect').show();
		}
		$('input[name="webview_success_action_type"]').change( function(){
			$('#webview-success-message').hide();
			$('.webview_success_redirect').hide();
			var webview_success_action_type =  $('input[name="webview_success_action_type"]:checked').val();
			if(webview_success_action_type == 'message'){
				$('#webview-success-message').show();
				$('#webview-success-message').val($.trim($('#webview-success-message').val()) ? $('#webview-success-message').val() : 'Success!');
			} else if(webview_success_action_type == 'redirect') {
				$('.webview_success_redirect').show();
			}
		});
		ll_combo_manager.event_on_change('#button_link_to', function(){

			// $('#label_btn_link_to').html ('Web Address (URL)');
			var button_link_to = ll_combo_manager.get_selected_value('#button_link_to');

			$('#container_button_lp').hide ();
			switch (button_link_to) {
				case 'lp':
					// $('#label_btn_link_to').html ('Landing Page URL');
					$('#container_button_lp').show ();
					formBuilderpage.process_load_landing_pages(function (){
						if (formBuilderpage.landing_pages.length > 0) {
							ll_combo_manager.clear_all('#select_button_landing_page');
							ll_combo_manager.add_option('#select_button_landing_page', '', '');
							for (var i in formBuilderpage.landing_pages){
								var lp = formBuilderpage.landing_pages [i];
								ll_combo_manager.add_option('#select_button_landing_page', lp.url, lp.name)
							}
						}
					});
					break;
			}
		});

		ll_combo_manager.event_on_change('#select_button_landing_page', function(){
			var url = ll_combo_manager.get_selected_value('#select_button_landing_page');
			if (url && url != '') {
				$('#buttonUrl').val (url);
			}
		});

		$('#unique_id_barcode_div').hide();
		if(formBuilderpage.get_no_of_elements('barcode') > 0){
			$('#unique_id_barcode_div').show();
		}
		$('input[name="is_reject_duplicate_submissions"]').change(function() {
			if($('input[name="is_reject_duplicate_submissions"]:checked').val() == 1){
				$('#show_reject_prompt_div').show();
			}else{
				$('#show_reject_prompt_div').hide();
			}
		});
		$('#insert_badge_elements').click(function(){
			var badge_type = ll_combo_manager.get_selected_value('select[name="badge_type"]');
			if(badge_type == BADGE_TYPE_BARCODE && ll_combo_manager.get_selected_value('select[name="barcode_provider_types"]') > 0){
				formBuilderpage.get_provider_elements(ll_combo_manager.get_selected_value('select[name="barcode_provider_types"]'));
			} else if(badge_type == BADGE_TYPE_ID && ll_combo_manager.get_selected_value('select[name="id_provider_types"]') > 0){
				formBuilderpage.get_provider_elements(ll_combo_manager.get_selected_value('select[name="id_provider_types"]'));
			} else if(badge_type == BADGE_TYPE_NFC && ll_combo_manager.get_selected_value('select[name="nfc_provider_types"]') > 0){
				formBuilderpage.get_provider_elements(ll_combo_manager.get_selected_value('select[name="nfc_provider_types"]'));
			}else {
				show_error_message('Please select a provider.');
				return false;
			}
		});
		ll_combo_manager.make_combo('#theme');
		$('#capture_field_background_div').hide();
		$('#element_background_mode_div').hide();
		$('#element_background_opacity_div').hide();
		$('#has_field_background').change(function() {
			if($('#has_field_background').is(':checked')){
				$('#capture_field_background_div').show();
				$('#element_background_mode_div').show();
				$('#element_background_opacity_div').show();
			}else {
				$('#capture_field_background_div').hide();
				$('#element_background_mode_div').hide();
				$('#element_background_opacity_div').hide();
			}
		});
		
		$('#has_event_buttons_menu').change(function() {
			if($('#has_event_buttons_menu').is(':checked')){
				$('#buttons-menu-div').html('');
				formBuilderpage.add_default_buttons('#buttons-menu-div', 'checked');
				$('#buttons-menu-field').show();
			} else {
				$('#buttons-menu-field').hide();
			}
		});
		
		$('#has_event_floating_buttons').change(function() {
			if($('#has_event_floating_buttons').is(':checked')){
				$('#floating-buttons-div').html('');
				formBuilderpage.add_default_buttons('#floating-buttons-div', '');
				$('#floating-buttons-field').show();
			} else {
				$('#floating-buttons-field').hide();
			}
		});
		
		$(".fb-label-align").change(function() {
			var $tpl = $(".tpl-block.selected");
			var opt = $tpl.data("json");
			var align = "center";
			
			opt.labelAlign = $(this).val();
			
			if (opt.labelAlign == 0) {
				align = "left";
			} else if (opt.labelAlign == 2) {
				align = "right";
			}
			
			$tpl
				.children(".tpl-block-content")
				.children(".fb-section-box")
				.children("label")
				.css("text-align", align);
			$tpl.attr("data-json", JSON.stringify(opt));
		});
		ll_combo_manager.make_combo('select[name="sort_order"]');
		ll_combo_manager.event_on_change('select[name="sort_order"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.sortAlphabeticOrderDirection = ll_combo_manager.get_selected_value('select[name="sort_order"]');
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		ll_combo_manager.make_combo('select[name="device_owner_option_specific_user"]');
		ll_combo_manager.make_combo('select[name="badge_type"]');
		ll_combo_manager.make_combo('select[name="barcode_type"]');
		ll_combo_manager.event_on_change('select[name="badge_type"]', function (){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.badge_type = ll_combo_manager.get_selected_value('select[name="badge_type"]');
			opt.barcode_provider_type_id = 0;
			opt.barcode_provider_authentication_info = {};
			ll_combo_manager.set_selected_value('select[name="barcode_provider_types"]', 0);
			ll_combo_manager.set_selected_value('select[name="nfc_provider_types"]', 0);
			ll_combo_manager.set_selected_value('select[name="id_provider_types"]', 0);
			$('.element_barcode_provider_type_authentication_info').html('');
			$('#element_barcode_provider_types').hide();
			$('#element_barcode_type').hide();
			$('#element_nfc_provider_types').hide();
			$('#element_id_provider_types').hide();
			$('#element_age_verification').hide();
			$('#insert_badge_elements_div').hide();
			$('#insert_badge_elements_div').hide();
			if(opt.badge_type == BADGE_TYPE_BARCODE){
				$('#element_barcode_provider_types').show();
				$('#element_barcode_type').show();
				$('#insert_badge_elements_div').show();
				ll_combo_manager.set_selected_value('select[name="barcode_type"]', '');
			} else if(opt.badge_type == BADGE_TYPE_NFC){
				$('#element_nfc_provider_types').show();
				$('#insert_badge_elements_div').show();
			} else if(opt.badge_type == BADGE_TYPE_ID){
				$('#element_id_provider_types').show();
				$('#element_age_verification').show();
				$('#element_barcode_type').show();
				$('#insert_badge_elements_div').show();
				ll_combo_manager.set_selected_value('select[name="barcode_type"]', 'PDF_417');
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		ll_combo_manager.make_combo('select[name="barcode_provider_types"]');
		ll_combo_manager.make_combo('select[name="nfc_provider_types"]');
		ll_combo_manager.make_combo('select[name="id_provider_types"]');
		ll_combo_manager.add_option_if_not_exist('select[name="barcode_provider_types"]', '0', '-- Select Provider --');
		ll_combo_manager.add_option_if_not_exist('select[name="nfc_provider_types"]', '0', '-- Select Provider --');
		ll_combo_manager.add_option_if_not_exist('select[name="id_provider_types"]', '0', '-- Select Provider --');
		ll_combo_manager.sort('select[name="barcode_provider_types"]');
		ll_combo_manager.sort('select[name="nfc_provider_types"]');
		ll_combo_manager.sort('select[name="id_provider_types"]');
		ll_combo_manager.set_selected_value('select[name="barcode_provider_types"]', '0');
		ll_combo_manager.set_selected_value('select[name="nfc_provider_types"]', '0');
		ll_combo_manager.set_selected_value('select[name="id_provider_types"]', '0');
		ll_combo_manager.event_on_change('select[name="barcode_provider_types"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(opt.barcode_provider_type_id != ll_combo_manager.get_selected_value('select[name="barcode_provider_types"]')){
				opt.barcode_provider_type_id = ll_combo_manager.get_selected_value('select[name="barcode_provider_types"]');
				opt.barcode_provider_authentication_info = {};
				formBuilderpage.set_elemenet_data($tpl, opt);
				formBuilderpage.draw_barcode_provider_type_authentication_info(opt.barcode_provider_type_id);
			}
		});
		ll_combo_manager.event_on_change('select[name="barcode_type"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.barcode_type = ll_combo_manager.get_selected_value('select[name="barcode_type"]');
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		ll_combo_manager.event_on_change('select[name="nfc_provider_types"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(opt.barcode_provider_type_id != ll_combo_manager.get_selected_value('select[name="nfc_provider_types"]')){
				opt.barcode_provider_type_id = ll_combo_manager.get_selected_value('select[name="nfc_provider_types"]');
				opt.barcode_provider_authentication_info = {};
				formBuilderpage.set_elemenet_data($tpl, opt);
				formBuilderpage.draw_barcode_provider_type_authentication_info(opt.barcode_provider_type_id);
			}
		});

		ll_combo_manager.event_on_change('select[name="id_provider_types"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(opt.barcode_provider_type_id != ll_combo_manager.get_selected_value('select[name="id_provider_types"]')){
				opt.barcode_provider_type_id = ll_combo_manager.get_selected_value('select[name="id_provider_types"]');
				opt.barcode_provider_authentication_info = {};
				formBuilderpage.set_elemenet_data($tpl, opt);
				formBuilderpage.draw_barcode_provider_type_authentication_info(opt.barcode_provider_type_id);
			}
		});
		
		ll_combo_manager.make_combo('select[name="transcription_expedited_localization"]');
		ll_combo_manager.event_on_change('select[name="transcription_expedited_localization"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = ll_combo_manager.get_selected_value('select[name="transcription_expedited_localization"]');
			opt.transcription_expedited_localization = val;
			formBuilderpage.set_elemenet_data($tpl, opt);
			if(val !='english'){
				show_warning_message('Transcription turnaround for this localization will take longer, typically 1 to 3 days. <a href="https://leadliaison.atlassian.net/wiki/spaces/LL/pages/18931801/Lead+Capture+Management#LeadCaptureManagement-Localization.1">Click here</a> for more information.');
			}
		});
		ll_combo_manager.event_on_change('select[id="document_set"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.ll_documents_set_id = ll_combo_manager.get_selected_value('#document_set');
			formBuilderpage.set_elemenet_data($tpl, opt);
			if(opt.ll_documents_set_id) {
				$('#edit_element_documents_choices,#FA_actions_element_documents_choices').show();
			}
		});
		ll_combo_manager.event_on_change('select[id="ll_activation_id"]', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.ll_activation_id = ll_combo_manager.get_selected_value('#ll_activation_id');
			formBuilderpage.set_elemenet_data($tpl, opt);

		});
		$('input[name="accept_invalid_barcode"]').change(function (){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.accept_invalid_barcode = 0;
			if($(this).is(':checked')){
				opt.accept_invalid_barcode = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="post_show_reconciliation"]').change(function (){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.post_show_reconciliation = 0;
			if($(this).is(':checked')){
				opt.post_show_reconciliation = 1;
				//ll_theme_manager.checkboxRadioButtons.check('input[name="field_is_activation"]', false);
				// $('#rule_activations').hide();
				ll_theme_manager.checkboxRadioButtons.check('input[name="display_mode"][value=0]', true);
				$('#display_setting').hide();
			} else {
				// ll_theme_manager.checkboxRadioButtons.check('input[name="field_is_activation"]', true);
				// $('#rule_activations').show();
				//ll_theme_manager.checkboxRadioButtons.check('input[name="display_mode"][value=1]', true);
				$('#display_setting').show();
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="is_localized"]').change(function (){
			$('#rule_translate').hide();
			if($(this).is(':checked')){
				$('#rule_translate').show();
			}
		});
		$('input[name="forward_submission_to_portal"]').change(function (){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.forward_submission_to_portal = 0;
			if($(this).is(':checked')){
				opt.forward_submission_to_portal = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="is_filled_from_barcode"]').change(function (){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_filled_from_barcode = 0;
			if($(this).is(':checked')){
				opt.is_filled_from_barcode = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="collapse_content"]').change(function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.collapse_content = 0;
			if($(this).is(':checked')){
				opt.collapse_content = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="device_owner_option"]').change(function (){
			if($('input[name="device_owner_option"]:checked').val() == DEVICE_OWNER_OPTION_SPECIFIC_USER){
				$('#device_owner_option_specific_user_container').show();
			}else{
				$('#device_owner_option_specific_user_container').hide();
			}
		});
		//ll_combo_manager.make_combo('select[name="device_forms_groups"]');
		ll_combo_manager.make_combo('select[name="device_forms_users"]');
		ll_combo_manager.make_combo('select[name="approved_submissions_lists"]');
		$('.wrap-tpl-block .tpl-block .required_astrisk').each(function(){
			if($(this).html() == '%%ASTRISK%%'){
				$(this).html(" *")
			}
		});
		$('.wrap-tpl-block .tpl-block').each(function(){
			var opt = $(this).data('json');
			if(typeof opt.isRequired != 'undefined' && opt.isRequired == 1){
				if($(this).find('.tpl-block-content label .required_astrisk').length <= 0){
					$("<span class='required_astrisk'></span>").insertAfter($(this).find('.tpl-block-content label span').first());
				}
			}
		});
		
		$('input[name="is_edit_duplicates_after_scan"]').change(function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_edit_duplicates_after_scan = 0;
			if($(this).is(':checked')){
				opt.is_edit_duplicates_after_scan = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		try{
			formBuilderpage.device_form_address_autocomplete = new google.maps.places.Autocomplete($('#fb-device-form-address')[0], {types: ['geocode']});
			(formBuilderpage.device_form_address_autocomplete).addListener('place_changed', formBuilderpage.auto_fill_device_form_address_fields);
		} catch (e){}
		
		formBuilderpage.pageBreakAction();
		if($('.fb-page-break').length > 0){
			if($('.fb-page-step-section').length > 0){
				$('#inline_wizard_switch').show();
			}else{
				$('#inline_wizard_switch').show();
				$('#inline_wizard_switch').text('Wizard');
			}
			formBuilderpage.is_wizard = true;
			$('#previous-button-text-container').show();
			$('#next-button-text-container').show();
			formBuilderpage.wizard_no_of_pages = $('.fb-wrap-columns-form .fb-page-break').length + 1;
		}
		formBuilderpage.check_empty_title_and_description();
		ll_date_picker_manager.make_picker('input[name="form_archive_date"],input[name=device_forms_archive_date]', {
			minDate: false,
			/*timepicker: true,*/
			format: 'Y-m-d'
		});
		ll_date_picker_manager.set_date('input[name="form_archive_date"]', archive_date);
		ll_combo_manager.make_combo('select[name="ll_lists"]');
		$('input#element_url_parameter').keyup(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.urlParameter = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('input#element_url_index').keyup(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.urlIndex = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('#inline_wizard_switch').click(function(){
			if($(this).text() == 'Inline'){
				$(this).text('Wizard');
				formBuilderpage.pageBreakDestroy(false);
			}else if($(this).text() == 'Wizard'){
				$(this).text('Inline');
				formBuilderpage.pageBreakInit();
			}
		});
		$('input[name="global_field_border_radius"]').keyup(function () {
			var that_value = $(this).val();
			$('.tpl-block:not(.info-form)').each(function () {
				$(this).find('input').css('border-radius', that_value+'px');
				$(this).find('input').css('-webkit-border-radius', that_value+'px');
				$(this).find('input').css('-moz-border-radius', that_value+'px');
				$(this).find('textarea').css('border-radius', that_value+'px');
				$(this).find('textarea').css('-webkit-border-radius', that_value+'px');
				$(this).find('textarea').css('-moz-border-radius', that_value+'px');
				var opt = $(this).data('json');
				opt.fieldBorderRadius = that_value;
				formBuilderpage.set_elemenet_data($(this), opt);
			});
			var form = $('.fb-wrap-columns-form');
			var globalopt = form.data('json');
			globalopt.fieldBorderRadius = $(this).val();
			formBuilderpage.set_elemenet_data(form, globalopt);
		});
		$('input[name="global_dropdown_border_radius"]').keyup(function () {
			var that_value = $(this).val();
			$('.tpl-block:not(.info-form)').each(function () {
				//small fix to get border radius to work on Chrome MAC
				$(this).find('select').css('-webkit-appearance', 'none');
				
				$(this).find('select').css('border-radius', that_value+'px');
				$(this).find('select').css('-webkit-border-radius', that_value+'px');
				$(this).find('select').css('-moz-border-radius', that_value+'px');
				$(this).find('.chzn-container').find('a').css('border-radius', that_value+'px');
				$(this).find('.chzn-container').find('a').css('-webkit-border-radius', that_value+'px');
				$(this).find('.chzn-container').find('a').css('-moz-border-radius', that_value+'px');
				var opt = $(this).data('json');
				opt.dropdownBorderRadius = that_value;
				formBuilderpage.set_elemenet_data($(this), opt);
			});
			var form = $('.fb-wrap-columns-form');
			var globalopt = form.data('json');
			globalopt.dropdownBorderRadius = $(this).val();
			formBuilderpage.set_elemenet_data(form, globalopt);
		});
		$('input[name="dropdown_border_radius"]').keyup(function () {
			var $tpl = $('.tpl-block.selected');
			//small fix to get border radius to work on Chrome MAC
			$tpl.find('select').css('-webkit-appearance', 'none');
			
			$tpl.find('select').css('border-radius', $(this).val()+'px');
			$tpl.find('select').css('-webkit-border-radius', $(this).val()+'px');
			$tpl.find('select').css('-moz-border-radius', $(this).val()+'px');
			$tpl.find('.chzn-container').find('a').css('border-radius', $(this).val()+'px');
			$tpl.find('.chzn-container').find('a').css('-webkit-border-radius', $(this).val()+'px');
			$tpl.find('.chzn-container').find('a').css('-moz-border-radius', $(this).val()+'px');
			var opt = $tpl.data('json');
			opt.dropdownBorderRadius = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="field_border_radius"]').keyup(function () {
			var $tpl = $('.tpl-block.selected');
			$tpl.find('input').css('border-radius', $(this).val()+'px');
			$tpl.find('input').css('-webkit-border-radius', $(this).val()+'px');
			$tpl.find('input').css('-moz-border-radius', $(this).val()+'px');
			$tpl.find('textarea').css('border-radius', $(this).val()+'px');
			$tpl.find('textarea').css('-webkit-border-radius', $(this).val()+'px');
			$tpl.find('textarea').css('-moz-border-radius', $(this).val()+'px');
			var opt = $tpl.data('json');
			opt.fieldBorderRadius = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('.wrap-tpl-block .tpl-block').each(function(){
			var $opt = $(this).data('json');
			if(typeof $opt.mappingFieldIds != 'undefined'){
				var mapping = $opt.mappingFieldIds;
				var element_identifier = $opt.identifier;
				if(mapping){
					for(i in mapping){
						formBuilderpage.used_mapped_fields;
						if(typeof formBuilderpage.used_mapped_fields [element_identifier] == 'undefined'){
							formBuilderpage.used_mapped_fields [element_identifier] = {};
						}
						//formBuilderpage.used_mapped_fields [element_identifier] [i] = mapping[i];
					}
				}
			}
		});
		ll_combo_manager.make_combo('#fb-title-font-global');
		ll_combo_manager.event_on_change('#fb-title-font-global', function(){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.titleFont = ll_combo_manager.get_selected_value('#fb-title-font-global');
			formBuilderpage.set_elemenet_data(form, opt);
			$('.form-tit').css('font-family', opt.titleFont);
		});
		ll_combo_manager.make_combo('#fb-title-size-global');
		ll_combo_manager.event_on_change('#fb-title-size-global', function(){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.titleSize = ll_combo_manager.get_selected_value('#fb-title-size-global');
			formBuilderpage.set_elemenet_data(form, opt);
			$('.form-tit').css('font-size', opt.titleSize + 'px');
		});
		ll_combo_manager.make_combo('#fb-description-font-global');
		ll_combo_manager.event_on_change('#fb-description-font-global', function(){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.descriptionFont = ll_combo_manager.get_selected_value('#fb-description-font-global');
			formBuilderpage.set_elemenet_data(form, opt);
			$('.form-desc').css('font-family', opt.descriptionFont);
		});
		ll_combo_manager.make_combo('#fb-description-size-global');
		ll_combo_manager.event_on_change('#fb-description-size-global', function(){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.descriptionSize = ll_combo_manager.get_selected_value('#fb-description-size-global');
			formBuilderpage.set_elemenet_data(form, opt);
			$('.form-desc').css('font-size', opt.descriptionSize + 'px');
		});
		$('input[name="element_ll_single_field_process_type"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.llSingleFieldProcessType = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('input[name="is_scan_cards_and_prefill_form"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_scan_cards_and_prefill_form = 0;
			if($(this).is(':checked')){
				opt.is_scan_cards_and_prefill_form = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="is_enable_transcription"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.is_enable_transcription = 0;
			$('#transcription_options,#expedited_transcription_options,#transcription_notes').hide();
			if($(this).is(':checked')){
				opt.is_enable_transcription = 1;
				$('#transcription_options,#transcription_notes').show();
				if(parseInt($('input[name="transcription_type"]:checked').val()) == LL_BUSINESS_CARDS_REQUEST_TYPE_EXPEDITED){
					$('#expedited_transcription_options').show();
				}
				// ll_theme_manager.checkboxRadioButtons.check('input[name="field_is_activation"]', false);
				// $('#rule_activations').hide();
				 ll_theme_manager.checkboxRadioButtons.check('input[name="display_mode"][value=0]', true);
				$('#display_setting').hide();
			} else {
				// ll_theme_manager.checkboxRadioButtons.check('input[name="field_is_activation"]', true);
				// ll_theme_manager.checkboxRadioButtons.check('input[name="display_mode"][value=1]', true);
				// $('#rule_activations').show();
				$('#display_setting').show();
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="transcription_type"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.transcription_type = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			if(parseInt(opt.transcription_type) == LL_BUSINESS_CARDS_REQUEST_TYPE_EXPEDITED){
				$('#expedited_transcription_options').show();
			} else {
				$('#expedited_transcription_options').hide();
			}
		});
		$('input[name="enable_audio_transcription"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.enable_audio_transcription = 0;
			$('#element_audio_transcription_type,.element_audio_transcription_options,#audio_transcription_update_field_process_type').hide();
			if($(this).is(':checked')){
				opt.enable_audio_transcription = 1;
				if(parseInt(AUDIO_PREMIUM_TRANSCRIPTION_PERMISSION)){
					$('#element_audio_transcription_type').show();
				} else {
					opt.audio_transcription_type = LL_AUDIO_TRANSCRIPTION_TYPE_STANDARD;
				}
				ll_combo_manager.set_selected_value('#audio_transcription_update_field', '');
				$('.element_audio_transcription_options').show();
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		$('input[name="audio_transcription_type"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.audio_transcription_type = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		ll_combo_manager.make_combo('#audio_transcription_update_field');
		ll_combo_manager.event_on_change('#audio_transcription_update_field', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.audio_transcription_update_field = ll_combo_manager.get_selected_value('#audio_transcription_update_field');
			formBuilderpage.set_elemenet_data($tpl, opt);
			if(opt.audio_transcription_update_field){
				$('#audio_transcription_update_field_process_type').show();
			} else {
				$('#audio_transcription_update_field_process_type').hide();
			}
		});
		$('input[name="update_field_process_type"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.audio_transcription_update_field_process_type = $('input[name="update_field_process_type"]:checked').val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		if(form_payment_gateway_account_id && (form_type == DONATION_HOSTED_WEB_FORM_TYPE || form_type == PAYMENT_HOSTED_WEB_FORM_TYPE)){
			formBuilderpage.selected_payment_account = supported_payment_gateways [form_payment_gateway_account_id];
			$('#recurring_checkbox_div').hide();
			if(formBuilderpage.selected_payment_account.is_support_recurring == 1){
				$('#recurring_checkbox_div').show();
			}
			ll_combo_manager.make_combo('#payment_recurring select');
			ll_combo_manager.event_on_change('#payment_recurring select', function(){
				var interval_name = ll_combo_manager.get_selected_text($(this));
				var interval_id = ll_combo_manager.get_selected_value($(this));
				if(interval_id == '0'){
					interval_name = '';
				}
				$('input[name="recurring_frequency_title"]').val(interval_name);
				$('input[name="recurring_frequency_title"]').trigger('change');
				var form = $('.fb-wrap-columns-form');
				var opt = form.data('json');
				opt.recurring_frequency = interval_id;
				formBuilderpage.set_elemenet_data(form, opt);
			});
			$('input[name="recurring_frequency_title"]').on('change keyup', function () {
				$('.payment_info span.recurring_frequency').text($(this).val());
				var form = $('.fb-wrap-columns-form');
				var opt = form.data('json');
				opt.recurring_frequency_title = $(this).val();
				formBuilderpage.set_elemenet_data(form, opt);
			});
			$('input[name="plan_type"]').change(function () {
				var selected_value = $('input[name="plan_type"]:checked').val();
				$('#payment_recurring').hide();
				$('#payment_recurring_title').hide();
				$('#gateway_payment_plans').hide();
				ll_combo_manager.set_selected_value('#gateway_payment_plans select', 0);
				ll_combo_manager.set_selected_value('#payment_recurring select', 0);
				$('input[name="recurring_frequency_title"]').val('');
				$('.payment_info span.recurring_frequency').text('');
				$('div[data-type-el="multiple_choices"]').each(function (){
					var opt = $(this).data('json');
					if(typeof opt.custom_type != 'undefined' && opt.custom_type){
						opt.choices[1].option_name = '';
						opt.choices[1].option_value = '';
						opt.choices[1].extra_text = '';
						formBuilderpage.set_elemenet_data($(this), opt);
					}
				});
				$('#amount').show();
				$('#pmv').hide();
				if(selected_value == PAYMENT_PLANS_CUSTOM){ // Custom Plan
					$('#payment_recurring').show();
					$('#payment_recurring_title').show();
					$('#gateway_payment_plans').hide();
					ll_combo_manager.set_selected_value('#payment_recurring select', 0);
					$('input[name="recurring_frequency_title"]').val('');
				}else if(selected_value == PAYMENT_PLANS_GATEWAY){ // Gateway Plans
					$('#payment_recurring').hide();
					$('#payment_recurring_title').hide();
					$('#gateway_payment_plans').show();
					ll_combo_manager.set_selected_value('#gateway_payment_plans select', 0);
					$('#pmv').show();
					$('#amount').hide();
				}
				var form = $('.fb-wrap-columns-form');
				var opt = form.data('json');
				opt.plan_type = $(this).val();
				formBuilderpage.set_elemenet_data(form, opt);
			});
			ll_combo_manager.make_combo('#gateway_payment_plans select');
			ll_combo_manager.make_combo('#payment_accounts');
			ll_combo_manager.event_on_change('#payment_accounts', function(){
				var selected_payment_account_id = ll_combo_manager.get_selected_value('#payment_accounts');
				var selected_payment_account = formBuilderpage.selected_payment_account = supported_payment_gateways [selected_payment_account_id];
				$('#recurring_checkbox_div').hide();
				$('#recurring_plans').hide();
				$('.accounts_selected_plans').hide();
				$('#Credit_Card_Question').hide();
				$('#Recurring_Question').hide();
				$('#plan_type').hide();
				$('#payment_recurring').hide();
				$('#gateway_payment_plans').hide();
				$('#payment_recurring_title').hide();
				if(selected_payment_account.is_support_recurring == 1){
					if(form_type == DONATION_HOSTED_WEB_FORM_TYPE){
						$('#recurring_checkbox_div').show();
						$('.accounts_selected_plans[data-src-account-id="'+selected_payment_account_id+'"]').show();
						$('.accounts_selected_plans[data-src-account-id="'+selected_payment_account_id+'"]').find('input.recurring_plan').each(function(){
							ll_theme_manager.checkboxRadioButtons.check($(this), true);
						});
						$('#recurring_plan').html('');
						var recurring_plans = formBuilderpage.selected_payment_account.recurring_plans;
						var html = '';
						for (i in recurring_plans) {
							html += '<option value="'+recurring_plans[i].recurring_plan_name+'">'+recurring_plans[i].recurring_plan_name+'</option>';
						}
						$('#recurring_plan').html(html);
						ll_combo_manager.refresh('#recurring_plan');
						ll_combo_manager.sort('#recurring_plan');
						ll_theme_manager.checkboxRadioButtons.check($('input[name="is_recurring"]'),false);
					}else{
						$('#plan_type').show();
						$('#payment_recurring').show();
						$('#payment_recurring_title').show();
						ll_combo_manager.clear_all('#payment_recurring select');
						var recurring_plans = formBuilderpage.selected_payment_account.recurring_plans;
						ll_combo_manager.add_option('#payment_recurring select', '0', 'One Time Payment', true);
						ll_combo_manager.trigger_event_on_change('#payment_recurring select');
						for (i in recurring_plans) {
							ll_combo_manager.add_option('#payment_recurring select', recurring_plans[i].payment_gateway_recurring_plan_id, recurring_plans[i].recurring_plan_name);
						}
					}
				}
				if(selected_payment_account.is_onsite == 1){
					if($('#Credit_Card_Question').length <= 0){
						formBuilderpage.addElements($('.eb-block-content[data-field-type="credit_card"]'), false, true, true);
					}else{
						$('#Credit_Card_Question').show();
					}
				}
			});
			$('input[name="is_recurring"]').change(function(){
				$('#Recurring_Question').remove();
				$('#recurring_plans').hide();
				if($(this).is(':checked')){
					formBuilderpage.addElements($('.eb-block-content[data-field-type="recurring"]'), false, true, true);
					ll_combo_manager.make_combo('select[name="recurring_interval"]');
					$('#recurring_plans').show();
				}
			});
			if(! is_has_saved_html){
				formBuilderpage.addElements($('.eb-block-content[data-field-type="email"]'), false, true, true);
			}
			if(is_show_credit_card_section && ! is_has_saved_html){
				formBuilderpage.addElements($('.eb-block-content[data-field-type="credit_card"]'), false, true, true);
			}
			$('input.recurring_plan').change(function(){
				if(!$(this).is(':checked')){
					$('select[name="recurring_interval"] option[value="'+$(this).attr('name')+'"]').remove();
				}else{
					$('select[name="recurring_interval"]').append('<option name="'+$(this).attr('name')+'">'+$(this).attr('name')+'</option>');
				}
				ll_combo_manager.refresh('select[name="recurring_interval"]');
				ll_combo_manager.sort('select[name="recurring_interval"]');
			});
			var is_donationForm = false;
			var is_paymentForm = false;
			if(form_type == DONATION_HOSTED_WEB_FORM_TYPE){
				is_donationForm = true;
			}else if(form_type == PAYMENT_HOSTED_WEB_FORM_TYPE){
				is_paymentForm = true;
			}
			if(! is_has_saved_html){
				formBuilderpage.addElements($('.eb-block-content[data-field-type="multiple_choices"]'), false, is_donationForm, is_paymentForm);
				$amount_tpl = $('.wrap-tpl-block .tpl-block:last');
				$amount_opt = $amount_tpl.data('json');
				var choices = $amount_opt.choices;
				if(form_type == DONATION_HOSTED_WEB_FORM_TYPE){
					
				}else if(form_type == PAYMENT_HOSTED_WEB_FORM_TYPE){
					choices = {};
					choices[1] = {};
					choices[1].is_default = 0;
					choices[1].option_name = '';
					choices[1].token = '';
					choices[1].type = 'radio';
				}
				$amount_opt.choices = choices;
				$amount_opt.labelText = 'Amount';
				$amount_tpl.attr('data-json', JSON.stringify( $amount_opt ));
				$amount_tpl.find('.tpl-block-content').children('label').children('span').text($amount_opt.labelText);
			}
		}
		ll_combo_manager.make_combo('.wrap-tpl-block .tpl-block select');
		$('.wrap-tpl-block .tpl-block').each(function(){
			formBuilderpage.dropDownStyleUpdate($(this));
		});
		$('.form-template .template').on('click', function(){
			$(this).addClass('selected').siblings('.template').removeClass('selected');
			//$('.et-top-header-gray .btn-next').removeClass('btn-disabled');
			formBuilderpage.initiate_form();
		});
		$('.form-builder .tabs-editor > ul li').on('click', function(){
			var index = $(this).parent().find('li').index($(this));
			$(this).addClass('selected').siblings('li').removeClass('selected');
			$(this).parents('.tabs-editor').find('.wrap-tabs-content .tab-content').hide().eq(index).show();
			if (  index == 2 ){
				if($('.tpl-container').hasClass('left-align-form-fields')){
					ll_theme_manager.checkboxRadioButtons.check('input[name="left_align_form"]', true);
				}else{
					ll_theme_manager.checkboxRadioButtons.check('input[name="left_align_form"]', false);
				}
				if($('.tpl-container').hasClass('top-align-form-fields')){
					ll_theme_manager.checkboxRadioButtons.check('input[name="top_align_form"]', true);
				}else{
					ll_theme_manager.checkboxRadioButtons.check('input[name="top_align_form"]', false);
				}
				if($('#wrap-form-submit-button input').hasClass('fixed_width_submit_button') || $('#ll-form-box').hasClass ('disable-responsivenss')){
					ll_theme_manager.checkboxRadioButtons.check('input[name="use_fixed_button_width"]', true);
				}else{
					ll_theme_manager.checkboxRadioButtons.check('input[name="use_fixed_button_width"]', false);
				}
				$('#fb-form-style-global').scrollTop(0);
			}
		});
		$('.tpl-block[data-type-el="phone"]').each(function(){
			$opt = $(this).data('json');
			if($opt.phoneFormat == 'formatted'){
				formBuilderpage.phoneElement($(this).find('.txt-field'));
			}else{
				$(this).find('.txt-field').inputmask('remove');
			}
		});
		$('.tpl-block[data-type-el="date"]').each(function(){
			formBuilderpage.dateElement($(this).find('.txt-field'));
		});
		$('.tpl-block[data-type-el="time"]').each(function(){
			formBuilderpage.timeElement($(this).find('.txt-field'));
		});
		ll_combo_manager.make_combo('.fb-choice-font');
		ll_combo_manager.event_on_change('.fb-choice-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.choicesFont = ll_combo_manager.get_selected_value('.fb-choice-font');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.fb-choice').css('font-family', opt.choicesFont);
		});
		ll_combo_manager.make_combo('.fb-choice-size');
		ll_combo_manager.event_on_change('.fb-choice-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.choicesSize = ll_combo_manager.get_selected_value('.fb-choice-size');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.fb-choice').css('font-size', opt.choicesSize  + 'px');
		});
		ll_combo_manager.make_combo('.fb-choice-hint-left-font');
		ll_combo_manager.event_on_change('.fb-choice-hint-left-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.choicesHintLeftFont = ll_combo_manager.get_selected_value('.fb-choice-hint-left-font');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.tpl-choices__label-left').css('font-family', opt.choicesHintLeftFont);
		});
		ll_combo_manager.make_combo('.fb-choice-hint-right-font');
		ll_combo_manager.event_on_change('.fb-choice-hint-right-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.choicesHintRightFont = ll_combo_manager.get_selected_value('.fb-choice-hint-right-font');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.tpl-choices__label-right').css('font-family', opt.choicesHintRightFont);
		});
		ll_combo_manager.make_combo('.fb-choice-hint-left-size');
		ll_combo_manager.event_on_change('.fb-choice-hint-left-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.choicesHintLeftSize = ll_combo_manager.get_selected_value('.fb-choice-hint-left-size');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.tpl-choices__label-left').css('font-size', opt.choicesHintLeftSize  + 'px');
		});
		ll_combo_manager.make_combo('.fb-choice-hint-right-size');
		ll_combo_manager.event_on_change('.fb-choice-hint-right-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.choicesHintRightSize = ll_combo_manager.get_selected_value('.fb-choice-hint-right-size');
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.tpl-choices__label-right').css('font-size', opt.choicesHintRightSize  + 'px');
		});
		ll_combo_manager.make_combo('#form_resubmit_wait_period');
		ll_combo_manager.make_combo('#fb-label-font-global');
		ll_combo_manager.event_on_change('#fb-label-font-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.labelFont = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				
				if($.inArray(opt.labelFont, STANDARD_FONTS)== -1){
					$tplСurrent.find('.tpl-block-content').children('label').css('font-family', opt.labelFont);
				} else {
					$tplСurrent.find('.tpl-block-content').children('label').css('font-family', opt.labelFont + ', sans-serif');
				}
			});
		});
		ll_combo_manager.make_combo('#fb-label-size-global');
		ll_combo_manager.event_on_change('#fb-label-size-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.labelSize = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				
				$tplСurrent.find('.tpl-block-content').children('label').css('font-size',opt.labelSize + 'px');
			});
		});
		ll_combo_manager.make_combo('#fb-label-pos-global');
		ll_combo_manager.event_on_change('#fb-label-pos-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.labelPos = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				
				formBuilderpage.labelPosition($tplСurrent);
			});
		});
		ll_combo_manager.make_combo('#fb-field-length-global');
		ll_combo_manager.event_on_change('#fb-field-length-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			var field_length_value = opt.fieldLength = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldLength = field_length_value;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				formBuilderpage.fieldSize($tplСurrent);
			});
		});
		ll_combo_manager.make_combo('#fb-field-size-global');
		ll_combo_manager.event_on_change('#fb-field-size-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			var field_size = opt.fieldSize = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldSize = field_size;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.txt-field').css('font-size',opt.fieldSize + 'px');
			});
		});
		ll_combo_manager.make_combo('.eb-inner-field #layout_templates');
		ll_combo_manager.make_combo('.eb-inner-field #campaigns');
		ll_combo_manager.make_combo('.eb-inner-field #web-form-vanity-url-id');
		ll_combo_manager.make_combo('#fb-field-to-insert');
		/*if(typeof ll_fields != 'undefined'){
		 ll_combo_manager.add_options('#fb-field-to-insert', ll_fields);
		 }*/
		ll_merge_tokens_manager.load_tokens(function(response){
			if(typeof response.ll_merge_tokens_by_identifiers != 'undefined' && response.ll_merge_tokens_by_identifiers){
				ll_combo_manager.clear_all('#fb-field-to-insert', true);
				ll_combo_manager.add_kv_options('#fb-field-to-insert', response.ll_merge_tokens_by_identifiers, true);
			}
		});
		ll_combo_manager.make_combo('#fb-field-border-type-global');
		ll_combo_manager.event_on_change('#fb-field-border-type-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			var field_border_style = opt.fieldBorderStyle = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldBorderStyle = field_border_style;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.txt-field').css('border-style',opt.fieldBorderStyle.toLowerCase());
			});
			
		});
		ll_combo_manager.make_combo('#fb-field-font-global');
		ll_combo_manager.event_on_change('#fb-field-font-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			var field_font_family = opt.fieldFont = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldFont = field_font_family;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				if($.inArray(optСurrent.fieldFont, STANDARD_FONTS)== -1){
					$tplСurrent.find('.txt-field').css('font-family',optСurrent.fieldFont);
				} else {
					$tplСurrent.find('.txt-field').css('font-family',optСurrent.fieldFont + ', sans-serif');
				}
			});
		});
		ll_combo_manager.make_combo('#fb-dropdown-size-global');
		ll_combo_manager.event_on_change('#fb-dropdown-size-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			var dropdown_size = opt.dropdownSize = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.dropdownSize = dropdown_size;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.chzn-single').css('font-size',opt.dropdownSize + 'px');
				$tplСurrent.find('.chzn-drop').css('font-size',opt.dropdownSize + 'px');
				$tplСurrent.find('select').css('font-size',opt.dropdownSize + 'px');
			});
		});
		ll_combo_manager.make_combo('#fb-button-border-type-global');
		ll_combo_manager.event_on_change('#fb-button-border-type-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.btnBorderStyle = $(this).val();
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('border-style',opt.btnBorderStyle.toLowerCase());
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('#fb-button-font-global');
		ll_combo_manager.event_on_change('#fb-button-font-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.btnFont = $(this).val();
			if($.inArray(opt.btnFont, STANDARD_FONTS)== -1){
				$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('font-family',opt.btnFont);
			} else {
				$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('font-family',opt.btnFont + ', sans-serif');
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('#fb-button-size-global');
		ll_combo_manager.event_on_change('#fb-button-size-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.btnSize = $(this).val();
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('font-size',opt.btnSize + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('#fb-dropdown-font-global');
		ll_combo_manager.event_on_change('#fb-dropdown-font-global', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			var dropdown_font = opt.dropdownFont = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.dropdownFont = dropdown_font;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				if($.inArray(opt.dropdownFont, STANDARD_FONTS)== -1){
					$tplСurrent.find('.chzn-single').css('font-family',opt.dropdownFont);
					$tplСurrent.find('.chzn-drop').css('font-family',opt.dropdownFont);
					$tplСurrent.find('select').css('font-family',opt.dropdownFont);
				} else {
					$tplСurrent.find('.chzn-single').css('font-family',opt.dropdownFont + ', sans-serif');
					$tplСurrent.find('.chzn-drop').css('font-family',opt.dropdownFont + ', sans-serif');
					$tplСurrent.find('select').css('font-family',opt.dropdownFont + ', sans-serif');
				}
			});
		});
		ll_combo_manager.make_combo('#domains');
		ll_combo_manager.make_combo('.fb-field-length');
		ll_combo_manager.make_combo('.fb-field-visible');
		ll_combo_manager.make_combo('.fb-field-data-source');
		ll_combo_manager.make_combo('#document_set');
		ll_combo_manager.make_combo('#ll_activation_id');
		ll_combo_manager.event_on_change('.fb-field-visible', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			var link = $(this).parent().next('.fb-set-rule-link');
			if ( val == '0' ){
				link.hide();
				$tpl.attr('visible_conditions','');
			} else {
				link.show();
			}
			opt.visible = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.mapping_fields');
		ll_combo_manager.event_on_change('#common_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'common');
			formBuilderpage.actions_when_mapping('common');
		});
		ll_combo_manager.event_on_change('#first_name_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'fname');
			formBuilderpage.refresh_selectors({'#element_name_map_rules select#last_name_mapping_field': 'lname'}, 'name');
			formBuilderpage.actions_when_mapping('name');
		});
		ll_combo_manager.event_on_change('#last_name_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'lname');
			formBuilderpage.refresh_selectors({'#element_name_map_rules select#first_name_mapping_field': 'fname'}, 'name');
			formBuilderpage.actions_when_mapping('name');
		});
		ll_combo_manager.event_on_change('#address1_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'address1');
			formBuilderpage.refresh_selectors({'#address2_mapping_field': 'address2', '#city_mapping_field': 'city', '#state_mapping_field': 'state', '#zipcode_mapping_field': 'zipcode', '#country_mapping_field': 'country'}, 'address');
			formBuilderpage.actions_when_mapping('address');
		});
		ll_combo_manager.event_on_change('#address2_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'address2');
			formBuilderpage.refresh_selectors({'#address1_mapping_field': 'address1', '#city_mapping_field': 'city', '#state_mapping_field': 'state', '#zipcode_mapping_field': 'zipcode', '#country_mapping_field': 'country'}, 'address');
			formBuilderpage.actions_when_mapping('address');
		});
		ll_combo_manager.event_on_change('#city_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'city');
			formBuilderpage.refresh_selectors({'#address1_mapping_field': 'address1', '#address2_mapping_field': 'address2', '#state_mapping_field': 'state', '#zipcode_mapping_field': 'zipcode', '#country_mapping_field': 'country'}, 'address');
			formBuilderpage.actions_when_mapping('address');
		});
		ll_combo_manager.event_on_change('#state_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'state');
			formBuilderpage.refresh_selectors({'#address1_mapping_field': 'address1', '#address2_mapping_field': 'address2', '#city_mapping_field': 'city', '#zipcode_mapping_field': 'zipcode', '#country_mapping_field': 'country'}, 'address');
			formBuilderpage.actions_when_mapping('address');
		});
		ll_combo_manager.event_on_change('#zipcode_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'zipcode');
			formBuilderpage.refresh_selectors({'#address1_mapping_field': 'address1', '#address2_mapping_field': 'address2', '#city_mapping_field': 'city', '#state_mapping_field': 'state', '#country_mapping_field': 'country'}, 'address');
			formBuilderpage.actions_when_mapping('address');
		});
		ll_combo_manager.event_on_change('#country_mapping_field', function(){
			formBuilderpage.assign_mapping_field_to_form_field($(this), 'country');
			formBuilderpage.refresh_selectors({'#address1_mapping_field': 'address1', '#address2_mapping_field': 'address2', '#city_mapping_field': 'city', '#state_mapping_field': 'state', '#zipcode_mapping_field': 'zipcode'}, 'address');
			formBuilderpage.actions_when_mapping('address');
		});
		ll_combo_manager.make_combo('#phone_format');
		ll_combo_manager.event_on_change('#phone_format', function(){
			if(ll_combo_manager.get_selected_value('#phone_format') == 'international'){
				$('.tpl-block.selected').find('.txt-field').inputmask('remove');
			}else if(ll_combo_manager.get_selected_value('#phone_format') == 'formatted'){
				formBuilderpage.phoneElement($('.tpl-block.selected').find('.txt-field'));
			}
			formBuilderpage.change_field_data_json('phoneFormat', '', ll_combo_manager.get_selected_value('#phone_format'));
		});
		ll_combo_manager.make_combo('#default_country');
		ll_combo_manager.event_on_change('#default_country', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.defaultValue = ll_combo_manager.get_selected_value('#default_country');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('#currency_format');
		ll_combo_manager.event_on_change('#currency_format', function(){
			var selected_currency = ll_combo_manager.get_selected_value('#currency_format');
			$('.tpl-block.selected .price-type').html(formBuilderpage.currencies[selected_currency]);
			formBuilderpage.change_field_data_json('currency', '', selected_currency);
		});
		ll_combo_manager.make_combo('.fb-number-columns-choices');
		ll_combo_manager.make_combo('.fb-label-font');
		ll_combo_manager.event_on_change('.fb-label-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.labelFont = $(this).val();
			if($.inArray(opt.labelFont, STANDARD_FONTS)== -1){
				$tpl.find('.tpl-block-content').children('label').css('font-family',opt.labelFont);
			} else {
				$tpl.find('.tpl-block-content').children('label').css('font-family',opt.labelFont + ', sans-serif');
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-sub-label-font');
		ll_combo_manager.event_on_change('.fb-sub-label-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.subLabelFont = $(this).val();
			if($.inArray(opt.subLabelFont, STANDARD_FONTS)== -1){
				$tpl.find('.tpl-block-content').find('span.label-top').css('font-family',opt.subLabelFont);
			} else {
				$tpl.find('.tpl-block-content').find('span.label-top').css('font-family',opt.subLabelFont + ', sans-serif');
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-required-field-hint-font');
		ll_combo_manager.event_on_change('.fb-required-field-hint-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.requiredFieldFont = ll_combo_manager.get_selected_value('.fb-required-field-hint-font');
			if($.inArray(opt.requiredFieldFont, STANDARD_FONTS)== -1){
				$tpl.find('.tpl-block-content').find('.required_astrisk').css('font-family', opt.requiredFieldFont);
			} else {
				$tpl.find('.tpl-block-content').find('.required_astrisk').css('font-family', opt.requiredFieldFont + ', sans-serif');
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		ll_combo_manager.make_combo('.fb-required-field-hint-size');
		ll_combo_manager.event_on_change('.fb-required-field-hint-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.requiredFieldSize = ll_combo_manager.get_selected_value('.fb-required-field-hint-size');
			$tpl.find('.tpl-block-content').find('.required_astrisk').css('font-size', opt.requiredFieldSize + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-label-size');
		ll_combo_manager.make_combo('.fb-sub-label-size');
		ll_combo_manager.event_on_change('.fb-sub-label-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.subLabelSize = $(this).val();
			$tpl.find('.tpl-block-content').find('span.label-top').css('font-size',opt.subLabelSize + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-label-pos');
		ll_combo_manager.event_on_change('.fb-label-pos', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var type = $tpl.attr('data-type-el');
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
			var optGlobal = $tplGlobal.data('json');
			var $slide = $(this).parents('.fb-form-style');
			
			opt.labelPos = $(this).val();
			
			if ( opt.labelPos == 1){
				if ( opt.labelWidth == 'None'){
					$slide.find('.txt-field-label-width').val(optGlobal.labelWidth);
				} else {
					$slide.find('.txt-field-label-width').val(opt.labelWidth);
				}
				
				$slide.find('.fb-field-label-width').show();
			} else {
				$slide.find('.fb-field-label-width').hide();
				opt.labelWidth = 'None';
			}

			if(opt.labelPos == 2){
				$('#element_field_placeholder').hide();
			} else {
				$('#element_field_placeholder').show();
			}
			
			formBuilderpage.set_elemenet_data($tpl, opt);
			formBuilderpage.labelPosition($tpl);
		});
		ll_combo_manager.make_combo('.fb-field-border-type');
		ll_combo_manager.make_combo('.fb-field-font');
		ll_combo_manager.event_on_change('.fb-field-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.fieldFont = $(this).val();
			if($.inArray(opt.fieldFont, STANDARD_FONTS)== -1){
				$tpl.find('.txt-field').css('font-family', opt.fieldFont);
			} else {
				$tpl.find('.txt-field').css('font-family', opt.fieldFont + ', sans-serif');
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-field-size');
		ll_combo_manager.event_on_change('.fb-field-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.fieldSize = $(this).val();
			$tpl.find('.txt-field').css('font-size',opt.fieldSize + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-dropdown-font');
		ll_combo_manager.event_on_change('.fb-dropdown-font', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.dropdownFont = $(this).val();
			if($.inArray(opt.dropdownFont, STANDARD_FONTS)== -1){
				$tpl.find('.chzn-single').css('font-family',opt.dropdownFont);
				$tpl.find('.chzn-drop').css('font-family',opt.dropdownFont);
				$tpl.find('select').css('font-family',opt.dropdownFont);
			} else {
				$tpl.find('.chzn-single').css('font-family',opt.dropdownFont + ', sans-serif');
				$tpl.find('.chzn-drop').css('font-family',opt.dropdownFont + ', sans-serif');
				$tpl.find('select').css('font-family',opt.dropdownFont + ', sans-serif');
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		ll_combo_manager.make_combo('.fb-dropdown-size');
		ll_combo_manager.event_on_change('.fb-dropdown-size', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.dropdownSize = $(this).val();
			$tpl.find('.chzn-single').css('font-size',opt.dropdownSize + 'px');
			$tpl.find('.chzn-drop').css('font-size',opt.dropdownSize + 'px');
			$tpl.find('select').css('font-size',opt.dropdownSize + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		ll_combo_manager.make_combo('select[name="reminder_to_invites_period_type"]');
		
		$('body').on('click', function(){
			$('.settings-tpl.open').removeClass('open');
		});
		$('input[name="top_align_form"]').change(function(){
			if($(this).is(':checked')){
				$('.tpl-container').addClass('top-align-form-fields');
			}else{
				$('.tpl-container').removeClass('top-align-form-fields');
			}
		});
		$('input[name="left_align_form"]').change(function(){
			if($(this).is(':checked')){
				$('.tpl-container').addClass('left-align-form-fields');
			}else{
				$('.tpl-container').removeClass('left-align-form-fields');
			}
		});
		$('.settings-tpl > a.db-btn-white').on('click', function(e){
			e.stopPropagation();
			$(this).parent().toggleClass('open');
			return false;
		});
		$('.tpl-btn-hide-show-border').on('click', function(e){
			e.preventDefault();
			$('.eb-wrap-form-page').toggleClass('hide_border');
			if (! $('.eb-wrap-form-page').hasClass('hide_border') ){
				$(this).text('Hide Dashed Border');
			} else {
				$(this).text('Show Dashed Border');
			}
		});
		$('.tpl-btn-hide-show-border').trigger('click');
		$('.settings-tpl > ul li a').on('click', function(e){
			e.stopPropagation();
			$(this).parents('.settings-tpl').toggleClass('open');
		});
		$('#fb-tabs-settings li a').on('click', function(){
			var index = $('#fb-tabs-settings li').index($(this).parent());
			
			$('.tpl-block').removeClass('selected');
			$('.fb-field-properties .fb-settings').hide();
			$('.fb-field-properties-inf').show();
			
			if ( index == 1 ){
				$('.tpl-block[data-type-el="0"]').addClass('selected');
			} else {
				formBuilderpage.removeFieldFormTitDesc();
			}
		});
		
		$('.fb-save-panel').on('click', function(){
			$('.fb-right-panel-slide.active').removeClass('active').animate({left: '579px'}, 300, function(){
				$(this).hide();
				$('.wrap-panels-el').css('z-index','-1');
				$('.tpl-block').removeClass('selected');
			});
			formBuilderpage.active_element = '';
		});
		
		$('.touch-spin').TouchSpin({
			min: 0,
			max: 100
		});
		
		$('.txt-field-label-width, #fb-field-label-width-global').TouchSpin({
			min: 10,
			max: 50
		});
		
		$('.eb-block-content').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			formBuilderpage.addElements($(this), false, false, false);
		});
		
		if ( $('#fb-show-text').is(':checked') ){
			$('.fb-show-text').show();
			$('.fb-redirect-url').hide();
		} else {
			$('.fb-show-text').hide();
			$('.fb-redirect-url').show();
		}
		
		$('#fb-show-text').on('click', function(){
			$('.fb-show-text').show();
			$('.fb-redirect-url').hide();
		});
		
		$('#fb-redirect-url').on('click', function(){
			$('.fb-show-text').hide();
			$('.fb-redirect-url').show();
		});
		if(typeof _moxiemanager_plugin != 'undefined'){
			tinyMCE.init({
				entity_encoding : "UTF-8",
				elements : "richEditor",
				selector: '#advanced-editor',
				//theme : "advanced",
				plugins: "hr image lists pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
				auto_reset_designmode:true,
				resize: false,
				toolbar: [
					"styleselect | bold italic forecolor | bullist numlist | image link code paste"
				],
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
				menubar: false,
				statusbar: false,
				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',
				
				height : 345,
				setup : function(ed) {
					ed.on('init', function(e) {
						
					});
				}
			});
			tinyMCE.init({
				entity_encoding : "UTF-8",
				elements : "richEditor",
				selector: '#instructions-editor',
				//theme : "advanced",
				plugins: "hr image lists pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
				auto_reset_designmode:true,
				resize: false,
				toolbar: [
					"styleselect | bold italic forecolor | bullist numlist | image link code paste"
				],
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
				menubar: false,
				statusbar: false,
				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',
				
				height : 250,
				setup : function(ed) {
					ed.on('init', function(e) {
						
					});
				}
			});
			tinyMCE.init({
				entity_encoding : "UTF-8",
				elements : "richEditor",
				selector: '#transcription-notes-editor',
				//theme : "advanced",
				plugins: "hr image lists pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
				auto_reset_designmode:true,
				resize: false,
				toolbar: [
					"styleselect | bold italic forecolor | bullist numlist | image link code paste"
				],
				contextmenu: "link image inserttable | cut copy paste pastetext |cell row column deletetable",
				menubar: false,
				statusbar: false,
				external_plugins: {
					"moxiemanager": _moxiemanager_plugin
				},
				moxiemanager_title: 'Media Manager',
				
				height : 250,
				setup : function(ed) {
					ed.on('init', function(e) {
						
					});
				}
			});
		}
		
		$('#section_break_content_popup').click(function(){
			tinymce.get('advanced-editor').setContent($('#'+formBuilderpage.active_element).find('#section_break_html_content').html());
			formBuilderpage.is_content_section_break = true;
			ll_popup_manager.open('#popup-advanced-editor');
		});
		$('#instructions_content_popup').click(function(){
			formBuilderpage.load_form_instructions(function(form){
				if(typeof form != 'undefined' && form ){
					var instructions_content = form.instructions_content ? form.instructions_content : '';
					tinyMCE.get('instructions-editor').setContent(instructions_content);
					ll_theme_manager.checkboxRadioButtons.check('input#is_enforce_instructions_initially', false);
					ll_theme_manager.checkboxRadioButtons.check('input#is_instructions_webview', false);
					if(parseInt(form.is_enforce_instructions_initially)){
						ll_theme_manager.checkboxRadioButtons.check('input#is_enforce_instructions_initially', true);
					}
					if(parseInt(form.is_instructions_webview)){
						ll_theme_manager.checkboxRadioButtons.check('input#is_instructions_webview', true);
					}
					ll_popup_manager.open('#popup-instructions-editor');
				}
			});
		});
		$('#transcription_notes_popup').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof formBuilderpage.elements_transcription_notes[opt.element_id]  != 'undefined'){
				tinyMCE.get('transcription-notes-editor').setContent(formBuilderpage.elements_transcription_notes[opt.element_id]);
			} else {
				tinyMCE.get('transcription-notes-editor').setContent('');
			}
			ll_popup_manager.open('#popup-transcription-notes-editor');
		});
		$('.fb-html-icn').on('click', function(){
			tinymce.get('advanced-editor').setContent($('textarea[name="form_success_message"]').val());
			ll_popup_manager.open('#popup-advanced-editor');
		});
		$('#close_advanced_editor_popup').click(function(){
			formBuilderpage.is_content_section_break = false;
			ll_popup_manager.close('#popup-advanced-editor');
		});
		$('.fb-btn-save-advanced-editor').on('click', function(){
			var _html = tinyMCE.get('advanced-editor').getContent();
			if(! formBuilderpage.is_content_section_break){
				$('textarea[name="form_success_message"]').val(_html);
				$('textarea[name="form_success_message"]').trigger('change');
				$('textarea[name="form_success_message"]').trigger('blur');
			}else{
				$('#'+formBuilderpage.active_element).find('#section_break_html_content').html(_html);
			}
			ll_popup_manager.close('#popup-advanced-editor');
		});
		$('#close_instructions_editor_popup').click(function(){
			ll_popup_manager.close('#popup-instructions-editor');
		});
		$('#fb-btn-save-instructions-editor').on('click', function(){
			formBuilderpage.save_form_instructions(function() {
				ll_popup_manager.close('#popup-instructions-editor');
			});
		});
		$('#close_transcription_notes_editor_popup').click(function(){
			ll_popup_manager.close('#popup-transcription-notes-editor');
		});
		$('#fb-btn-save-transcription-notes-editor').on('click', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			formBuilderpage.elements_transcription_notes[opt.element_id] = tinyMCE.get('transcription-notes-editor').getContent();
			ll_popup_manager.close('#popup-transcription-notes-editor');
		});
		/*$('#fb-html-seaction-break').on('keyup', function(){
		 var $tpl = $('.tpl-block.selected');
		 var content = $(this).val();
		 $tpl.find('.fb-html').html(content);
		 });*/
		
		var resizebleMaxWidth = $('#form-editor').outerWidth()-542;
		var startResizebleWidth = 0;
		
		$previewColResizable = $('.form-builder .wrap-preview-col').resizable({
			handles: 'e',
			minWidth: 600,
			maxWidth: resizebleMaxWidth,
			start: function(event, ui) {
				startResizebleWidth = $('.preview-col').outerWidth();
			},
			resize: function(event, ui) {
				var $colRight = $('.tool-col');
				var width = $('#form-editor').outerWidth() - $('.form-builder .wrap-preview-col').outerWidth();
				$colRight.css('width', width + 'px');
			},
			stop: function(event, ui) {
				$('.form-builder .wrap-preview-col').css({
					left: '0',
					width: 'auto',
					right: $('.tool-col').outerWidth()
				});
			}
		});
		formBuilderpage.resizeForm();
		$(window).resize(function(){
			formBuilderpage.resizeForm();
		});
		
		$('input[name="is_donot_accept_personal_emails"]').change(function(){
			if($(this).is(':checked')){
				$('#personal_email_error_message').show();
			}else{
				$('#personal_email_error_message').hide();
			}
		});
		$('input[name="form_specific_competitors_domains"]').change(function(){
			if($(this).is(':checked')){
				$('.fb-rus-competitors').show();
			}else{
				$('.fb-rus-competitors').hide();
			}
		});
		$('input[name="form_specific_email_addresses"]').change(function(){
			if($(this).is(':checked')){
				$('.fb-rus-email-addresses').show();
			}else{
				$('.fb-rus-email-addresses').hide();
			}
		});
		$('input[name="form_redirect_competitors_to_different_url"]').change(function(){
			if($(this).is(':checked')){
				$('.fb-box-redirect-competitors').show();
			}else{
				$('.fb-box-redirect-competitors').hide();
			}
		});
		$('input[name="form_resubmit_wait_enable"]').change(function(){
			if($(this).is(':checked')){
				$('#form_resubmit_wait').show();
				$('#duplicate_submission_error_message').show();
			}else{
				$('#form_resubmit_wait').hide();
				$('#duplicate_submission_error_message').hide();
			}
		});
		$('.add_competitor_domain').live('click', function(){
			$('.fb-rus-competitors').append('<div class="t-field">'
				+'	<a href="javascript:void(0);" class="fb-btn-add t-btn-gray add_competitor_domain"></a>'
				+'	<a href="javascript:void(0);" class="fb-btn-remove t-btn-gray remove_competitor_domain"></a>'
				+'	<input class="txt-field" type="text" name="competitor"/>'
				+'</div>');
		});
		$('.remove_competitor_domain').live('click', function(){
			if($('.fb-rus-competitors .t-field').length > 1){
				$(this).parent().remove();
			}
		});
		$('.add_specific_email_address').live('click', function(){
			$('.fb-rus-email-addresses').append('<div class="t-field">'
				+'	<a href="javascript:void(0);" class="fb-btn-add t-btn-gray add_specific_email_address"></a>'
				+'	<a href="javascript:void(0);" class="fb-btn-remove t-btn-gray remove_specific_email_address"></a>'
				+'	<input class="txt-field" type="text" name="specific_email_address"/>'
				+'</div>');
		});
		$('.remove_specific_email_address').live('click', function(){
			if($('.fb-rus-email-addresses .t-field').length > 1){
				$(this).parent().remove();
			}
		});
		var focused_element = 'form_success_message';
		$('#form_success_message').focus(function(){
			focused_element = 'form_success_message';
		});
		$('#form_redirect').focus(function(){
			focused_element = 'form_redirect';
		});
		$('#form_competitors_redirect').focus(function(){
			focused_element = 'form_competitors_redirect';
		});
		$('#fb_insert_fields').click(function() {
			var _selected_field = ll_combo_manager.get_selected_value('#fb-field-to-insert');
			if(typeof _selected_field != 'undefined' && _selected_field != null && _selected_field != ''){
				var _field_name = _selected_field;
				/*if(_selected_field.indexOf('standard') == 0){
				 var ll_standard_field_id = _selected_field.replace('standard_', '');
				 var ll_field = ll_standard_fields[ll_standard_field_id];
				 _field_name = ll_field['ll_standard_field_label'];
				 } else if(_selected_field.indexOf('custom') == 0){
				 var ll_custom_field_id = _selected_field.replace('custom_', '');
				 var ll_field = ll_custom_fields[ll_custom_field_id];
				 _field_name = ll_field['ll_custom_field_identifier'];
				 }*/
				if(_field_name != ''){
					var element = $('#'+focused_element);
					insert_text_at_cursor(element, '%%' + _field_name + '%%');
				}
			}
		});
		$('#to_designer_page').click(function(){
			formBuilderpage.initiate_form();
		});
		$('#save_form_elements').click(function(){
			$('.fb-save-panel').click();
			formBuilderpage.save_form(false);
		});
		$('#exit_and_donot_save').click(function(){
			ll_popup_manager.open('#ll_popup_manage_confirm_exit');
		});
		$('#save_form_elements_and_exit, #ll_popup_manage_confirm_exit_save_and_exit').click(function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit');
			formBuilderpage.save_form(true);
		});
		$('#ll_popup_manage_confirm_exit_cancel').click(function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit');
		});
		$('#ll_popup_manage_confirm_exit_go').click(function(){
			ll_popup_manager.close('#ll_popup_manage_confirm_exit');
			
			if(is_event_template){
				window.location.href = 'manage-templates.php';
			} else if(is_device_form){
				window.location.href = 'manage-events.php';
			} else {
				window.location.href = 'manage-web-forms.php';
			}
		});
		$('input[name="use_fixed_button_width"]').change(function(){
			if($(this).is(':checked')){
				$('#ll-form-box').addClass ('disable-responsivenss');
				$('#wrap-form-submit-button input').addClass('fixed_width_submit_button');
				$('#wrap-form-submit-button .fb-prev-page-section').addClass('fixed_width_submit_button');
				$('#wrap-form-submit-button .fb-next-page-section').addClass('fixed_width_submit_button');
			}else{
				$('#ll-form-box').removeClass ('disable-responsivenss');
				$('#wrap-form-submit-button input').removeClass('fixed_width_submit_button');
				$('#wrap-form-submit-button .fb-prev-page-section').removeClass('fixed_width_submit_button');
				$('#wrap-form-submit-button .fb-next-page-section').removeClass('fixed_width_submit_button');
			}
		});
		$('input[name="field_is_required"]').change(function(){
			var value = 0;
			$('.tpl-block.selected .element_properties_letters:first').show();
			$('.tpl-block.selected .element_properties_letters:first .required_element').hide();
			if($(this).is(':checked')){
				value = 1;
				if($('.tpl-block.selected .element_properties_letters:first').length <= 0){
					$('.tpl-block.selected').prepend('<span class="element_properties_letters"> [<span class="conditions_letters"><span class="required_element" style="display: none;"> r </span><span class="always_display_element" style="display: none;"> a </span><span class="conditional_element" style="display: none;"> c </span><span class="hidden_element"  style="display: none;"> h </span></span>] </span><br>');
				}
				$('.tpl-block.selected .element_properties_letters:first .required_element').show();
				$('#required_field_hint_container').show();
				$('#element_required_field_hint_style').show();
				if($('.tpl-block.selected').find('.tpl-block-content label .required_astrisk').length <= 0){
					$("<span class='required_astrisk'> *</span>").insertAfter($('.tpl-block.selected').find('.tpl-block-content label span').first());
					$('#required_field_hint_container input[name="required_field_hint"]').val("*");
					ll_combo_manager.set_selected_value('.fb-required-field-hint-font', 'Open Sans');
					ll_combo_manager.set_selected_value('.fb-required-field-hint-size', '14');
				}
			}else{
				$('#required_field_hint_container').hide();
				$('#element_required_field_hint_style').hide();
				$('.tpl-block.selected').find('.required_astrisk').remove();
			}
			formBuilderpage.change_field_data_json ('isRequired', '', value);
			if(value == 0){
				formBuilderpage.hide_conditions_letters_brackets();
			}
		});
		$('#required_field_hint_container input[name="required_field_hint"]').keyup(function(){
			$('.tpl-block.selected').find('.tpl-block-content label .required_astrisk').html(" "+$(this).val());
		});
		$('input[name="field_is_always_display"]').change(function(){
			var value = 0;
			$('.tpl-block.selected .element_properties_letters:first').show();
			$('.tpl-block.selected .element_properties_letters:first .always_display_element').hide();
			if($(this).is(':checked')){
				value = 1;
				if($('.tpl-block.selected .element_properties_letters:first').length <= 0){
					$('.tpl-block.selected').prepend('<span class="element_properties_letters"> [<span class="conditions_letters"><span class="required_element" style="display: none;"> r </span><span class="always_display_element" style="display: none;"> a </span><span class="conditional_element" style="display: none;"> c </span><span class="hidden_element"  style="display: none;"> h </span></span>] </span><br>');
				}
				$('.tpl-block.selected .element_properties_letters:first .always_display_element').show();
			}
			formBuilderpage.change_field_data_json ('isAlwaysDisplay', '', value);
			if(value == 0){
				formBuilderpage.hide_conditions_letters_brackets();
			}
		});
		$('input[name="field_is_conditional"]').change(function(){
			var value = 0;
			$('.tpl-block.selected .element_properties_letters:first').show();
			$('.tpl-block.selected .element_properties_letters:first .conditional_element').hide();
			if($(this).is(':checked')){
				value = 1;
				if($('.tpl-block.selected .element_properties_letters:first').length <= 0){
					$('.tpl-block.selected').prepend('<span class="element_properties_letters"> [<span class="conditions_letters"><span class="required_element" style="display: none;"> r </span><span class="always_display_element" style="display: none;"> a </span><span class="conditional_element" style="display: none;"> c </span><span class="hidden_element"  style="display: none;"> h </span></span>] </span><br>');
				}
				$('.tpl-block.selected .element_properties_letters:first .conditional_element').show();
			}
			formBuilderpage.change_field_data_json ('isConditional', '', value);
			if(value == 0){
				formBuilderpage.hide_conditions_letters_brackets();
			}
		});
		$('input[name="field_is_donot_prefill"]').change(function(){
			var value = 0;
			if($(this).is(':checked')){
				value = 1;
			}
			formBuilderpage.change_field_data_json ('isDonotPrefilled', '', value);
		});
		$('input[name="field_is_translate"]').change(function(){
			var value = 0;
			if($(this).is(':checked')){
				value = 1;
			}
			formBuilderpage.change_field_data_json ('isTranslate', '', value);
		});
		$('input[name="retry_playing"]').change(function(){
			var value = 0;
			if($(this).is(':checked')){
				value = 1;
			}
			formBuilderpage.change_field_data_json ('isRetryPlaying', '', value);
		});
		$('input[name="field_is_hidden"]').change(function(){
			var value = 0;
			$('.tpl-block.selected .element_properties_letters:first').show();
			$('.tpl-block.selected .element_properties_letters:first .hidden_element').hide();
			if($(this).is(':checked')){
				value = 1;
				if($('.tpl-block.selected .element_properties_letters:first').length <= 0){
					$('.tpl-block.selected').prepend('<span class="element_properties_letters"> [<span class="conditions_letters"><span class="required_element" style="display: none;"> r </span><span class="always_display_element" style="display: none;"> a </span><span class="conditional_element" style="display: none;"> c </span><span class="hidden_element"  style="display: none;"> h </span></span>] </span><br>');
				}
				$('.tpl-block.selected .element_properties_letters:first .hidden_element').show();
			}
			formBuilderpage.change_field_data_json ('isHidden', '', value);
			if(value == 0){
				formBuilderpage.hide_conditions_letters_brackets();
			}
		});
		/*$('input[name="field_is_activation"]').change(function(){
			var value = 0;
			if($(this).is(':checked')){
				value = 1;
			}
			formBuilderpage.change_field_data_json ('isActivation', '', value);
		});*/
		$('input[name="display_mode"]').change(function(){
			//$(this).find(':checked').val()
			formBuilderpage.change_field_data_json ('displayMode', '', $('input[name="display_mode"]:checked').val());
		});
		$('.icn-search-date').on('click', function(){
			$(this).parent().find('input').focus();
		});
		$('input[name="field_default_value"]').keyup(function(){
			formBuilderpage.change_field_data_json ('defaultValue', '', $(this).val());
		});
		$('input[name="field_error_message"]').keyup(function(){
			formBuilderpage.change_field_data_json ('fieldErrorMessage', '', $(this).val());
		});
		$('input[name="invalid_file_error_message"]').keyup(function(){
			$('.tpl-block.selected').attr('data-invalid-file-error-message', $(this).val());
			formBuilderpage.change_field_data_json ('invalidFileErrorMessage', '', $(this).val());
		});
		$('input[name="container_field_css_class"]').keyup(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(formBuilderpage.old_keyup_value){
				$tpl.removeClass(formBuilderpage.old_keyup_value);
			}
			$tpl.addClass($(this).val());
			formBuilderpage.change_field_data_json ('containerCssClass', '', $(this).val());
			formBuilderpage.old_keyup_value = $(this).val();
		});
		$('input[name="field_css_class"]').keyup(function(){
			var $tpl = $('.tpl-block.selected');
			if(formBuilderpage.old_keyup_value){
				$tpl.find('input').removeClass(formBuilderpage.old_keyup_value);
				$tpl.find('select').removeClass(formBuilderpage.old_keyup_value);
				$tpl.find('textarea').removeClass(formBuilderpage.old_keyup_value);
			}
			$tpl.find('input').addClass($(this).val());
			$tpl.find('select').addClass($(this).val());
			$tpl.find('textarea').addClass($(this).val());
			formBuilderpage.change_field_data_json ('cssClass', '', $(this).val());
			formBuilderpage.old_keyup_value = $(this).val();
		});
		$('textarea[name="field_guidelines"]').keyup(function(){
			formBuilderpage.change_field_data_json ('guidelines', '', $(this).val());
		});
		$('input[name="multiple-randomize"]').change(function(){
			formBuilderpage.change_field_data_json ('randomize', '', $(this).val());
		});
		$('input[name="multiple-direction"]').change(function(){
			var $tpl = $('.tpl-block.selected');
			formBuilderpage.change_field_data_json ('fieldItemsDirection', '', $(this).val());
			if($(this).val() == 'vertical'){
				$('.fb-box-number-columns-radio').hide();
				$tpl.find('.tpl-choices').removeClass('fb-inline-checkboxes');
			}else if($(this).val() == 'horizontal'){
				$('.fb-box-number-columns-radio').show();
				$tpl.find('.tpl-choices').addClass('fb-inline-checkboxes');
				formBuilderpage.checkRadioBoxColumn(ll_combo_manager.get_selected_value('.fb-number-columns-choices'), $tpl.find('.tpl-choices'));
			}
		});

		$('input[name="choices-display"]').change(function(){
			var $tpl = $('.tpl-block.selected');

			formBuilderpage.change_field_data_json ('display', '', $(this).val());
			if($(this).val() == 'classic'){
				$tpl.removeClass('tpl-choices--survey');
				$('#element_choices_survey_style').hide();
				$('#choices-hint-left').hide();
				$('#choices-hint-right').hide();
				$tpl.find('.tpl-choices').find('.tpl-choices__labels, style.choices-survey-css').remove();
			}else if($(this).val() == 'survey'){
				$tpl.addClass('tpl-choices--survey');
				$('#element_choices_survey_style').show();
				$('#choices-hint-left').show();
				$('#choices-hint-right').show();
				if(!$tpl.find('.tpl-choices').find('.tpl-choices__labels').length){
					$tpl.find('.tpl-choices').prepend('<div class="tpl-choices__labels clearfix"><div class="tpl-choices__label-left">NOT AT ALL LIKELY</div><div class="tpl-choices__label-right">EXTREMELY LIKELY</div></div>');
				}
				if(!$tpl.find('.tpl-choices').find('style.choices-survey-css').length){
					formBuilderpage.updateChoicesStyleInline($tpl);
				}
			}
		});
		
		
		$('input[name="has_edit_permission"]').change(function(){
			var value = 0;
			if($(this).is(':checked')){
				value = 1;
			}
			formBuilderpage.change_field_data_json ('hasEditPermission', '', value);
		});
		$('input[name="has_delete_permission"]').change(function(){
			var value = 0;
			if($(this).is(':checked')){
				value = 1;
			}
			formBuilderpage.change_field_data_json ('hasDeletePermission', '', value);
		});
		custom_fonts_manager.load_fonts('#form-editor .fb-wrap-columns-form');
		
		if(custom_css_files.length > 0){
			for (var i in custom_css_files){
				var is_allow_remove = true;
				if(i == 0){
					is_allow_remove = false;
				}
				custom_css_manager.add_css_file_input_row(is_allow_remove, custom_css_files[i]);
			}
		} else {
			custom_css_manager.add_css_file_input_row(false);
		}
		
		formBuilderpage.actionBuilderForm();
		formBuilderpage.dragAndDropElements();
		formBuilderpage.actionsBtnBlock();
		formBuilderpage.showHideInfBlock();
		formBuilderpage.resizableField();
		formBuilderpage.colorBox();
		formBuilderpage.actionStyleField();
		formBuilderpage.multipleAction();
		formBuilderpage.btnSubmitAction();
		formBuilderpage.setRuleAction();
		formBuilderpage.elementChoices();
		formBuilderpage.documentElementChoices();
		if($('.fb-wrap-columns-form').length){
			formBuilderpage.updateGlobalStyle();
		}
		$('#manage_form_settings').click(function(){
			if(formBuilderpage.add_new_fields_to == 'bottom'){
				ll_theme_manager.checkboxRadioButtons.check('#add_new_fields_to', false);
			}else if (formBuilderpage.add_new_fields_to == 'top'){
				ll_theme_manager.checkboxRadioButtons.check('#add_new_fields_to', true);
			}
			ll_popup_manager.open('#ll_popup_manage_form_settings');
		});
		$('.btn-manage-asset-fullfilment-actions').click(function(){
			populate_fulfillment_actions_manager ($(this));
		});
		ll_theme_manager.checkboxRadioButtons.check('#is_enable_screensaver', false);
		$('.screensaver_options').hide();
		
		$('#is_enable_screensaver').click(function(){
			if($('#is_enable_screensaver').is(':checked')){
				$('.screensaver_options').show();
			}else {
				$('.screensaver_options').hide();
			}
		});
		
		ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style', true);
		$('.element-style').hide();
		
		$('#is_use_theme_style').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.no_gocapture_style = 1;
			
			if($('#is_use_theme_style').is(':checked')){
				opt.no_gocapture_style = 1;
				$('.element-style').hide();
			}else {
				opt.no_gocapture_style = 0;
				$('.element-style').show();
			}
			opt.element_background_color = formBuilderpage.rgb2hex($('#element_background_color').css( "background-color" ));
			opt.element_text_color = formBuilderpage.rgb2hex($('#element_text_color').css( "background-color" ));
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('#options_use_theme_color').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');

			if($('#options_use_theme_color').is(':checked')){
				$('#style_text_color').hide();
				opt.element_text_color = '';
			}else {
				$('#style_text_color').show();
				opt.element_text_color = formBuilderpage.rgb2hex($('#element_text_color').css( "background-color" ));
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="options_underline"]').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.element_underline = $(this).is(':checked');
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="options_full_width_text"]').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.element_full_width_text = $(this).is(':checked');
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="options_italicize"]').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.element_italicize = $(this).is(':checked');
			formBuilderpage.set_elemenet_data($tpl, opt);
		});

		$('input[name="options_vertical_alignment"]').click(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.element_vertical_alignment = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style_search_list', true);
		$('.element-style_search_list').hide();
		
		$('#is_use_theme_style_search_list').click(function(){
			
			if($('#is_use_theme_style_search_list').is(':checked')){
				$('.element-style_search_list').hide();
			}else {
				$('.element-style_search_list').show();
			}
			/*opt.element_background_color = formBuilderpage.rgb2hex($('#element_background_color').css( "background-color" ));
			 opt.element_text_color = formBuilderpage.rgb2hex($('#element_text_color').css( "background-color" ));*/
		});
		
		$('#merge_settings').click(function(){
			elements_merge_settings.open();
		});
		
		$('#ll_popup_manage_manage_form_settings_cancel').click(function(){
			ll_popup_manager.close('#ll_popup_manage_form_settings');
		});
		$('#ll_popup_manage_manage_form_settings_save').click(function(){
			var new_user_setting = 1;
			formBuilderpage.add_new_fields_to = 'bottom';
			if($('#add_new_fields_to').is(':checked')){
				formBuilderpage.add_new_fields_to = 'top';
				new_user_setting = 2;
			}
			ll_popup_manager.close('#ll_popup_manage_form_settings');
			var data = {};
			data.action = 'CHANGE_FORM_BUILDER_ADD_NEW_FIELDS_MODE';
			data.form_builder_add_new_fields_mode = new_user_setting;
			if($('select[name="device_forms_groups"]').length > 0){
				data.form_id = form_id;
				data.form_groups = ll_combo_manager.get_selected_value('select[name="device_forms_groups"]');
			}
			data.folder_id = $('#ll_popup_manage_form_settings .choose-folder').attr('data-id');
			/*var archive_date = ll_date_picker_manager.get_selected_date_text('input[name="device_forms_archive_date"]');
			 data.archive_date = archive_date;*/
			$.ajax( {
				type :"POST",
				url : "form-designer-processes.php",
				data : data,
				cache :false,
				success : function(response) {
					/*ll_date_picker_manager.set_date('input[name="form_archive_date"],input[name=device_forms_archive_date]', archive_date);*/
					if(typeof response.folderID != 'undefined' && typeof response.folderPath != 'undefined' ){
						$('#ll_popup_manage_form_settings .choose-folder').attr('data-id', response.folderID );
						$('#ll_popup_manage_form_settings .choose-path').val(response.folderPath);
					}
					return true;
				},
				error : function() {
					return false;
				}
			});
		});
		
		$('#add_station').click(function(){
			formBuilderpage.station_to_be_deleted = [];
			formBuilderpage.get_stations();
			ll_popup_manager.open('#ll_popup_add_station');
		});
		
		$('.btn-sort-station-popup').click(function(){
			formBuilderpage.order_stations();
		});
		
		$('.btn-cancel-add-station-popup').click(function(){
			ll_popup_manager.close('#ll_popup_add_station');
		});
		$('.btn-save-add-station-popup').click(function(){
			if(formBuilderpage.station_to_be_deleted.length > 0) {
				formBuilderpage.delete_station(formBuilderpage.station_to_be_deleted);
			}
			
			var stations = [];
			var order = 1;
			$('.lines .line-criteries input').each(function (){
				var station_id = $(this).parents('.line-criteries').attr('station_id');
				var station_name = $.trim($(this).val());
				if (station_name != '') {
					stations.push ({
						id: station_id,
						name: station_name,
						order: order
					});
					order++;
				}
			});
			formBuilderpage.add_station(stations);
			
			ll_popup_manager.close('#ll_popup_add_station');
		});
		
		/*$('input[name="is_enable_email_validation"]').on('click', function(){
		 if ($(this).is(':checked')) {
		 $('#email_validation_timeout_div').show();
		 } else {
		 $('#email_validation_timeout_div').hide();
		 }
		 });*/
		var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		var optGlobal = $tplGlobal.data('json');
		if (optGlobal) {
			if (typeof optGlobal.recurring_frequency != 'undefined' && optGlobal.recurring_frequency) {
				ll_combo_manager.set_selected_value('#payment_recurring select', optGlobal.recurring_frequency);
			}
			if (typeof optGlobal.recurring_frequency_title != 'undefined' && optGlobal.recurring_frequency_title) {
				$('input[name="recurring_frequency_title"]').val(optGlobal.recurring_frequency_title);
			}
			
			if (typeof optGlobal.designerCanvasColor != 'undefined' && optGlobal.designerCanvasColor) {
				$('.eb-wrap-form-page').css('background-color', optGlobal.designerCanvasColor);
				$('#fb-form-designer-canvas-color-global').colpickSetColor(optGlobal.designerCanvasColor, true).css('background-color', optGlobal.designerCanvasColor);
			}
		}
		$('#element_boolean_default_value input[name="default_value"]').change(function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.defaultValue = $('#element_boolean_default_value input[name="default_value"]:checked').val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		formBuilderpage.get_transcription_notes();
		formBuilderpage.triggerChangeInForm();
		
		if(is_device_form && parent_template_form_id){
			formBuilderpage.get_parent_template_data();
		}
		
		if(is_device_form) {
			$('#event_text_color').colpickSetColor('#FFFFFF', true).css('background-color', '#FFFFFF');
			$('#elements_label_color').colpickSetColor('#000000', true).css('background-color', '#000000');
			$('#element_text_color').colpickSetColor('#FFFFFF', true).css('background-color', '#FFFFFF');
			$('#element_background_color').colpickSetColor('#000000', true).css('background-color', '#000000');
			$('#capture_background_color').colpickSetColor('#FFFFFF', true).css('background-color', '#FFFFFF');
			$('#element_text_color_search_list').colpickSetColor('#FFFFFF', true).css('background-color', '#FFFFFF');
			$('#element_background_color_search_list').colpickSetColor('#000000', true).css('background-color', '#000000');
			formBuilderpage.addHTMLImage($('.cover-image'));
			formBuilderpage.addHTMLImage($('.capture-background-image'));
			formBuilderpage.get_event_style();
			formBuilderpage.load_custom_attributes();
		}
		
		$("#ll-form-box").on(
			{
				mouseover: function(e) {
					e.stopPropagation();
					$(this).parents(".tpl-block").addClass("hide-controls");
				},
				mouseout: function(e) {
					e.stopPropagation();
					$(this).parents(".tpl-block").removeClass("hide-controls");
				}
			},
			".tpl-block"
		);
		
		formBuilderpage.dragAndDropElements();
		ll_combo_manager.make_combo('#transition_effect');
		ll_combo_manager.make_combo('#fb-device_form_country');
		
		$('#fb_switch_device_form_address_details').live('click', function() {
			if($('.fb-form-properties .device_form_address_details').is(":visible")){
				$('.fb-form-properties .device_form_address_details').hide();
				$('.fb-form-properties #fb-device-form-address').show();
			} else {
				$('.fb-form-properties .device_form_address_details').show();
				$('.fb-form-properties #fb-device-form-address').hide();
			}
		});
		$('#fb_clear_device_form_address_details').live('click', function() {
			$('.fb-form-properties #fb-device-form-address').val('');
			$('.fb-form-properties #fb-device_form_street_address').val('');
			$('.fb-form-properties #fb-device_form_city').val('');
			$('.fb-form-properties #fb-device_form_state').val('');
			$('.fb-form-properties #fb-device_form_zip').val('');
			ll_combo_manager.set_selected_value('.fb-form-properties #fb-device_form_country','');
			$('.fb-form-properties #fb-device-form-address').attr('disabled',false);
			$('#fb_clear_device_form_address_details').hide();
		});
		
		$('.fb-reminder-icn').on('click', function(){
			$(this).toggleClass('selected');
			if($(this).hasClass('selected')){
				$('.fb-reminder-info').show();
			} else {
				$('.fb-reminder-info').hide();
			}
		});
		if($('.fb-reminder-icn').hasClass('selected')){
			$('.fb-reminder-info').show();
		} else {
			$('.fb-reminder-info').hide();
		}

		if(! is_device_form && this.get_no_of_elements('page_break') > 0){
			$('#validate_fields_by_page_container').show();
			$('#error_message_container.last-field').removeClass('last-field');
			$('#validate_fields_by_page_container').addClass('last-field');
			this.pageBreakDestroy();
		}

		$('#preview_event').click(function (){
			var data = {};
			data.action = 'GENERATE_PREVIEW_LINK';
			data.form_id = form_id;
			$.ajax({
				url: 'form-designer-processes.php',
				data: data,
				type: 'POST',
				success: function (response) {
					if(response.success == 1){
						$('.editor_mode').hide();
						$('.preview_mode').show();
						$('#iframe_preview_preview_container').attr('src', response.preview_url);
						$('#mobile-preview-content').attr('src', response.preview_url);
					}
				}
			});
		});

		$('#exit_preview').click(function(){
			$('.editor_mode').show();
			$('.preview_mode').hide();
			$('#iframe_preview_preview_container').attr('src', '');
			$('#mobile-preview-content').attr('src', '');
		});
	},
	station_to_be_deleted: {},
	add_station_line: function (stationName, stationId) {
		var value = '';
		if(stationName != ''){
			value = 'value="' + stationName + '"';
		}
		var html = '<div class="line-criteries t-field">' +
			'<a href="javascript:void(0)" class="add-line-criteries btnEmailPlus"></a>' +
			'<a href="javascript:void(0)" class="remove-line-criteries btnEmailMinus"></a>' +
			'<input type="text" class="txt-field" ' + value + '/>'+
			'<a href="javascript:void(0)" class="fb-btn-move"></a>' +
			'</div>';
		$('#ll_popup_add_station .lines').append(html);
		var line_container = '#ll_popup_add_station .lines .line-criteries:last';
		$(line_container).attr ('station_id', stationId);
		$('.line-criteries:last .remove-line-criteries').click(function () {
			if ($('#ll_popup_add_station .lines .line-criteries').length > 0) {
				if ($(this).closest('.line-criteries').find('input').val() != '') {
					var station_id = $(this).closest('.line-criteries').find('input').parents('.line-criteries').attr('station_id');
					formBuilderpage.station_to_be_deleted.push(station_id);
					$(this).closest('.line-criteries').find('input').val('');
					$(this).closest('.line-criteries').find('input').parents('.line-criteries').attr('station_id', '');
				}
				if ($('#ll_popup_add_station .lines .line-criteries').length > 1) {
					$(this).closest('.line-criteries').remove();
				}
			}
		});
		$('#ll_popup_add_station .line-criteries:last .add-line-criteries').click(function(){
			formBuilderpage.add_station_line('', '');
		});
	},
	hide_conditions_letters_brackets: function(){
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		if(opt.isRequired == 0 && opt.isAlwaysDisplay == 0 && opt.isConditional == 0 && opt.isHidden == 0){
			$tpl.find('.element_properties_letters:first').next().hide();
			$tpl.find('.element_properties_letters:first').hide();
		}
	},
	resizeForm: function(){
		widthBody = $('body').width();
		var $colRight = $('.form-builder .tool-col');
		if (widthBody < 1188){
			$colRight.width('542px');
			$('.form-builder .wrap-preview-col').css({
				right: 542 + 'px'
			});
			resizebleMaxWidth = $('#form-editor').outerWidth()-410;
			$previewColResizable.resizable('option', 'maxWidth', resizebleMaxWidth);
		} else{
			$colRight.width('580px');
			$('.form-builder .wrap-preview-col').css({
				right: 580 + 'px'
			});
			resizebleMaxWidth = $('#form-editor').outerWidth()-588;
			$previewColResizable.resizable('option', 'maxWidth', resizebleMaxWidth);
		}
	},
	change_field_data_json: function(property, subproperty, value){
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		if(subproperty != ''){
			opt[property][subproperty] = value;
		}else{
			opt[property] = value;
		}
		formBuilderpage.set_elemenet_data($tpl, opt)
	},
	refresh_selectors: function(selectors, field_type){
		for (i in selectors){
			sub_identifier = selectors[i];
			var selector_mapping_field = ll_combo_manager.get_selected_value(i);
			var datatype_aliases = formBuilderpage.get_datatype_aliases_array_for_field(field_type);
			formBuilderpage.fill_mapping_rules_fields(i, datatype_aliases, formBuilderpage.active_element, sub_identifier, selector_mapping_field);
		}
	},
	assign_mapping_field_to_form_field: function(selector, select_type){
		if(typeof formBuilderpage.used_mapped_fields [formBuilderpage.active_element] == 'undefined'){
			formBuilderpage.used_mapped_fields [formBuilderpage.active_element] = {};
		}
		var selected_field_value = ll_combo_manager.get_selected_value(selector);
		formBuilderpage.used_mapped_fields [formBuilderpage.active_element] [select_type] = selected_field_value;
		if(selected_field_value.indexOf('Standard') == 0){
			var ll_standard_field_id = selected_field_value.replace('Standard_', '');
			var ll_field = ll_standard_fields[ll_standard_field_id];
		}else if(selected_field_value.indexOf('Custom') == 0){
			var ll_custom_field_id = selected_field_value.replace('Custom_', '');
			var ll_field = ll_custom_fields[ll_custom_field_id];
		}
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		$tpl.attr('donot_apply_conditions_if_db_value', '0');
		if(typeof ll_field != 'undefined'){
			var selected_field_datatype_alias = ll_field['data_type_alias'];
			if(selected_field_datatype_alias == 'multipicklist'){
				opt.llSingleFieldProcessType = LL_SINGLE_FIELD_PROCESS_TYPE_MERGE;
				$('#element_ll_single_field_process_type_container').show();
				ll_theme_manager.checkboxRadioButtons.check($('input[name="element_ll_single_field_process_type"][value="'+LL_SINGLE_FIELD_PROCESS_TYPE_MERGE+'"]'), true);
				$('#element_common_map_rules').css('padding-bottom', '0px');
				$('#element_sfmc_map_rules').css('padding-bottom', '0px');
			}else{
				opt.llSingleFieldProcessType = '';
				$('#element_ll_single_field_process_type_container').hide();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
			}
			$tpl.attr('donot_apply_conditions_if_db_value', '1');
		}
		opt.mappingFieldIds[select_type] = formBuilderpage.used_mapped_fields [formBuilderpage.active_element][select_type];
		formBuilderpage.used_mapped_fields [formBuilderpage.active_element] = {};
		formBuilderpage.set_elemenet_data($tpl, opt);
	},
	actions_when_mapping: function (select_type) {
		$('#element_override_if_empty').hide();
		$('#element_process_data_type').hide();
		switch(select_type){
			case 'common':
				var selected_field_value = ll_combo_manager.get_selected_value('#common_mapping_field');
				var $tpl = $('.tpl-block.selected');
				if(selected_field_value != 0 && selected_field_value != 'Standard_'+LL_STANDARD_FIELD_Email_ID && $tpl){
					if(selected_field_value.indexOf('Standard') == 0){
						var ll_standard_field_id = selected_field_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(selected_field_value.indexOf('Custom') == 0){
						var ll_custom_field_id = selected_field_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_common_map_rules').css('padding-bottom', '0px');
								$('#element_sfmc_map_rules').css('padding-bottom', '0px');
								$('#element_common_map_rules').css('margin-bottom', '0px');
								$('#element_sfmc_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_common_map_rules').css('padding-bottom', '0px');
								$('#element_sfmc_map_rules').css('padding-bottom', '0px');
								$('#element_common_map_rules').css('margin-bottom', '0px');
								$('#element_sfmc_map_rules').css('margin-bottom', '0px');
							}
						}
					}
				}
				break;
			case 'name':
				var fname_selected_field_value = ll_combo_manager.get_selected_value('#first_name_mapping_field');
				var lname_selected_field_value = ll_combo_manager.get_selected_value('#last_name_mapping_field');
				if(fname_selected_field_value != 0 || lname_selected_field_value != 0){
					if(fname_selected_field_value.indexOf('Standard') == 0){
						var ll_standard_field_id = fname_selected_field_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(fname_selected_field_value.indexOf('Custom') == 0){
						var ll_custom_field_id = fname_selected_field_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_name_map_rules').css('padding-bottom', '0px');
								$('#element_name_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_name_map_rules').css('padding-bottom', '0px');
								$('#element_name_map_rules').css('margin-bottom', '0px');
							}
						}
					}
					if(lname_selected_field_value.indexOf('Standard') == 0){
						var ll_standard_field_id = lname_selected_field_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(lname_selected_field_value.indexOf('Custom') == 0){
						var ll_custom_field_id = lname_selected_field_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_name_map_rules').css('padding-bottom', '0px');
								$('#element_name_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_name_map_rules').css('padding-bottom', '0px');
								$('#element_name_map_rules').css('margin-bottom', '0px');
							}
						}
					}
				}
				break;
			case 'address':
				var address1_field_selected_value = ll_combo_manager.get_selected_value('#address1_mapping_field');
				var address2_field_selected_value = ll_combo_manager.get_selected_value('#address2_mapping_field');
				var city_field_selected_value = ll_combo_manager.get_selected_value('#city_mapping_field');
				var state_field_selected_value = ll_combo_manager.get_selected_value('#state_mapping_field');
				var zipcode_field_selected_value = ll_combo_manager.get_selected_value('#zipcode_mapping_field');
				var country_field_selected_value = ll_combo_manager.get_selected_value('#country_mapping_field');
				if(address1_field_selected_value != 0 || address2_field_selected_value != 0 || city_field_selected_value != 0 || state_field_selected_value != 0 || zipcode_field_selected_value != 0 || country_field_selected_value != 0){
					if(address1_field_selected_value.indexOf('Standard') == 0){
						var ll_standard_field_id = address1_field_selected_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(address1_field_selected_value.indexOf('Custom') == 0){
						var ll_custom_field_id = address1_field_selected_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							}
						}
					}
					if(address2_field_selected_value.indexOf('Standard') == 0){
						var ll_standard_field_id = address2_field_selected_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(address2_field_selected_value.indexOf('Custom') == 0){
						var ll_custom_field_id = address2_field_selected_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							}
						}
					}
					if(city_field_selected_value.indexOf('Standard') == 0){
						var ll_standard_field_id = city_field_selected_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(city_field_selected_value.indexOf('Custom') == 0){
						var ll_custom_field_id = city_field_selected_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							}
						}
					}
					if(state_field_selected_value.indexOf('Standard') == 0){
						var ll_standard_field_id = state_field_selected_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(state_field_selected_value.indexOf('Custom') == 0){
						var ll_custom_field_id = state_field_selected_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							}
						}
					}
					if(zipcode_field_selected_value.indexOf('Standard') == 0){
						var ll_standard_field_id = zipcode_field_selected_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(zipcode_field_selected_value.indexOf('Custom') == 0){
						var ll_custom_field_id = zipcode_field_selected_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							}
						}
					}
					if(country_field_selected_value.indexOf('Standard') == 0){
						var ll_standard_field_id = country_field_selected_value.replace('Standard_', '');
						var ll_field = ll_standard_fields[ll_standard_field_id];
					}else if(country_field_selected_value.indexOf('Custom') == 0){
						var ll_custom_field_id = country_field_selected_value.replace('Custom_', '');
						var ll_field = ll_custom_fields[ll_custom_field_id];
					}
					if(typeof ll_field != 'undefined'){
						var selected_field_datatype_alias = ll_field['data_type_alias'];
						if(selected_field_datatype_alias != 'multipicklist'){
							if(selected_field_datatype_alias == 'text'){
								$('#element_process_data_type').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							} else {
								$('#element_override_if_empty').show();
								$('#element_address_map_rules').css('padding-bottom', '0px');
								$('#element_address_map_rules').css('margin-bottom', '0px');
							}
						}
					}
				}
				break;
		}
	},
	get_ll_valid_standard_fields_to_map_to: function(datatype_aliases, element_ll_field_identifier, sub_identifier){
		var valid_standard_fields_to_map_to = [];
		if(datatype_aliases[0] != undefined){
			for(var ll_standard_field_id in ll_standard_fields_info){
				var ll_standard_field = ll_standard_fields_info[ll_standard_field_id];
				
				for(var i in datatype_aliases){
					if(typeof datatype_aliases[i] != 'function'){
						if(datatype_aliases[i] == ll_standard_field['fdt.data_type_alias'] || datatype_aliases[i] == ll_standard_field['data_sub_type_alias']){
							if(!formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+ll_standard_field_id, element_ll_field_identifier, sub_identifier)){
								valid_standard_fields_to_map_to[ll_standard_field_id] = ll_standard_field;
							}
						}
					}
				}
			}
		}
		return valid_standard_fields_to_map_to;
	},
	get_ll_valid_custom_fields_to_map_to: function(datatype_aliases, element_ll_field_identifier, sub_identifier){
		var valid_custom_fields_to_map_to = [];
		if(datatype_aliases[0] != undefined){
			for(var ll_custom_field_id in ll_custom_fields_info){
				var ll_custom_field = ll_custom_fields_info[ll_custom_field_id];
				
				for(var i in datatype_aliases){
					if(typeof datatype_aliases[i] != 'function'){
						if(datatype_aliases[i] == ll_custom_field['fdt.data_type_alias'] || datatype_aliases[i] == ll_custom_field['data_sub_type_alias']){
							if(!formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Custom_'+ll_custom_field_id, element_ll_field_identifier, sub_identifier)){
								valid_custom_fields_to_map_to[ll_custom_field_id] = ll_custom_field;
							}
						}
					}
				}
			}
		}
		return valid_custom_fields_to_map_to;
	},
	check_if_another_form_field_mapped_to_the_same_ll_field: function(ll_field_id, element_ll_field_identifier, sub_identifier){
		if(formBuilderpage.used_mapped_fields){
			for (i in formBuilderpage.used_mapped_fields){
				var elements_fields = formBuilderpage.used_mapped_fields[i];
				for(j in elements_fields){
					if(i != element_ll_field_identifier){
						if(elements_fields[j] == ll_field_id){
							return true;
						}
					}else{
						if(sub_identifier && j != sub_identifier){
							if(elements_fields[j] == ll_field_id){
								return true;
							}
						}
					}
				}
			}
		}
		return false;
	},
	fill_mapping_rules_fields: function(selector, datatype_aliases, element_ll_field_identifier, sub_identifier, assign_with_value){
		valid_standard_fields_to_map_to = formBuilderpage.get_ll_valid_standard_fields_to_map_to(datatype_aliases, element_ll_field_identifier, sub_identifier);
		valid_custom_fields_to_map_to = formBuilderpage.get_ll_valid_custom_fields_to_map_to(datatype_aliases, element_ll_field_identifier, sub_identifier);
		var fields = [];
		var index = 0;
		fields[index++] = ['', ''];
		for(var ll_standard_field_id in valid_standard_fields_to_map_to){
			if(typeof valid_standard_fields_to_map_to[ll_standard_field_id] != 'function'){
				var ll_standard_field = valid_standard_fields_to_map_to[ll_standard_field_id];
				fields[index++] = ['Standard_' + ll_standard_field_id, ll_standard_field['llsf.ll_standard_field_name'] + ' [Standard]'];
			}
		}
		for(var ll_custom_field_id in valid_custom_fields_to_map_to){
			if(typeof valid_custom_fields_to_map_to[ll_custom_field_id] != 'function'){
				var ll_custom_field = valid_custom_fields_to_map_to[ll_custom_field_id];
				fields[index++] = ['Custom_' + ll_custom_field_id, ll_custom_field['llcf.ll_custom_field_name'] + ' [Custom]'];
			}
		}
		fields = fields.sort(formBuilderpage.sort_items);
		index = 0;
		fields[index] = [0, 'Unmapped'];
		ll_combo_manager.clear_all(selector);
		ll_combo_manager.add_options(selector, fields);
		ll_combo_manager.refresh(selector);
		if(typeof assign_with_value != 'undefined'){
			ll_combo_manager.set_selected_value(selector, assign_with_value);
		}
	},
	sort_items:function (item1, item2){
		return item1[1].localeCompare(item2[1]);
	},
	addFieldFormTitDesc: function(){
		if( !$('.info-form').find('.t-field').length ){
			var tit = $('input[name="form_title"]').val();
			var desc = $('textarea[name="form_description"]').val();
			$('.form-tit').hide().before('<div class="t-field"><label>'+formBuilderpage.form_lbl+' Title</label><input type="text" class="txt-field fb-input-form-tit" value="'+tit+'"/></div>');
			$('.form-desc').hide().before('<div class="t-field"><label>'+formBuilderpage.form_lbl+' Description</label><textarea class="txt-field fb-textarea-form-desc">'+desc+'</textarea></div>');
		}
	},
	removeFieldFormTitDesc: function(){
		$('.info-form').find('.t-field').remove();
		$('.form-tit').show();
		$('.form-desc').show();
	},
	actionBuilderForm: function(){
		$('.fb-edit-identifier').on('click', function(e){
			e.preventDefault();
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $slide = $(this).parents('.fb-right-panel-slide');
			
			$slide.find('.fb-identifier-input').removeAttr('disabled');
			$slide.find('.fb-auto-identifier-section').hide();
			$slide.find('.fb-custom-identifier-section').show();
			opt.identifierCustom = '1';
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('.fb-cancel-edit-identifier').on('click', function(e){
			e.preventDefault();
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $slide = $(this).parents('.fb-right-panel-slide');
			
			$slide.find('.fb-identifier-input').attr('disabled', 'disabled').val(opt.defaultIdentifier);
			$slide.find('.fb-auto-identifier-section').show();
			$slide.find('.fb-custom-identifier-section').hide();
			opt.identifierCustom = '0';
			opt.identifier = opt.defaultIdentifier;
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.attr('id', opt.defaultIdentifier);
		});
		$('.fb-identifier-input').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var val = $(this).val();
			$tpl.attr('id', val);
			formBuilderpage.change_field_data_json ('identifier', '', val);
		});
		ll_combo_manager.event_on_change('.fb-number-columns-choices', function(){
			var $tpl = $('.tpl-block.selected');
			var value = ll_combo_manager.get_selected_value('.fb-number-columns-choices');
			formBuilderpage.checkRadioBoxColumn(value, $tpl.find('.tpl-choices'));
			formBuilderpage.change_field_data_json ('numberColumns', '', value);
		});
		ll_combo_manager.event_on_change('.fb-field-data-source', function(){
			var $tpl = $('.tpl-block.selected');
			var value = ll_combo_manager.get_selected_value('.fb-field-data-source');
			formBuilderpage.change_field_data_json ('choicesDataSource', '', value);
		});
		$('#fb-address-street').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			$tpl.find('.fb-label-street').text(val);
			if( opt.labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.change_field_data_json ('hints', 'streetAddress1', val);
		});
		$('#fb-address-street-2').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			$tpl.find('.fb-label-street-2').text(val);
			if( opt.labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.change_field_data_json ('hints', 'streetAddress2', val);
		});
		$('#fb-address-city').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			$tpl.find('.fb-label-city').text(val);
			if( opt.labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.change_field_data_json ('hints', 'city', val);
		});
		$('#fb-address-state').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			$tpl.find('.fb-label-state').text(val);
			if( opt.labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.change_field_data_json ('hints', 'state', val);
		});
		$('#fb-address-zip').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			$tpl.find('.fb-label-zip').text(val);
			if( opt.labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.change_field_data_json ('hints', 'zipcode', val);
		});
		$('#fb-address-country').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
			var optGlobal = $tplGlobal.data('json');
			
			$tpl.find('.fb-label-country').text(val);
			if( opt.labelPos == 2 || ( opt.labelPos == 'None' && optGlobal.labelPos == 2 ) ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.change_field_data_json ('hints', 'country', val);
		});
		$('.is-fb-address-street-visible').on('change', function(){
			// var $tpl = $('.tpl-block.selected');
			// var opt = $tpl.data('json');
			var val = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.change_field_data_json ('hints', 'streetAddress1Visible', val);
		});
		$('.is-fb-address-street-2-visible').on('change', function(){
			var val = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.change_field_data_json ('hints', 'streetAddress2Visible', val);
		});
		$('.is-fb-address-city-visible').on('change', function(){
			var val = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.change_field_data_json ('hints', 'cityVisible', val);
		});
		$('.is-fb-address-state-visible').on('change', function(){
			var val = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.change_field_data_json ('hints', 'stateVisible', val);
		});
		$('.is-fb-address-zip-visible').on('change', function(){
			var val = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.change_field_data_json ('hints', 'zipcodeVisible', val);
		});
		$('.is-fb-address-country-visible').on('change', function(){
			var val = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.change_field_data_json ('hints', 'countryVisible', val);
		});
	},
	dragAndDropElements: function(){
		$(".eb-block-content:not(.ui-draggable)").draggable({
			helper: 'clone',
			start: function(event, ui) {
				$(".no-drop-element").removeClass("no-drop-element");
				$(".wrap-tpl-block, .wrap-tpl-block-section").addClass(
					"tpl-placeholder"
				);
			},
			stop: function(event, ui) {
				$(".wrap-tpl-block, .wrap-tpl-block-section").removeClass(
					"tpl-placeholder"
				);
				$('.fb-sortable-hover').removeClass('fb-sortable-hover');
			},
			connectToSortable: ".wrap-tpl-block, .wrap-tpl-block-section",
			refreshPositions: true
		});
		$(".wrap-tpl-block, .wrap-tpl-block-section").sortable({
			cursor: 'move',
			//handle: '.tpl-block-move',
			tolerance: 'intersect',
			cancel:".fb-dragenddrop-box, .fb-dragenddrop-box-text, .fb-dragenddrop-box-text, .tpl-block-edit, .tpl-block-clone, .tpl-block-delete, .txt-field",
			connectWith: ".wrap-tpl-block, .wrap-tpl-block-section",
			placeholder:'fb-placeholder-element',
			//items: '.tpl-block',
			beforeStop: function(event, ui) {
				var $this = $(this);
				if(( is_device_form || is_event_template ) && !ADD_ELEMENTS_PERMISSION){
					show_error_message(' You do not have permission to add Elements.');
					ui.item.remove();
					return;
				}
				if (ui.item.hasClass('eb-block-content')){
					if (!ui.item.hasClass("el-section-block")) {
						formBuilderpage.addElements(ui.item, true, false, false);
					} else {
						if (!$this.hasClass("wrap-tpl-block-section")) {
							formBuilderpage.addElements(ui.item, true, false, false);
						} else {
							ui.item.remove();
							$(".fb-sortable-hover").removeClass("fb-sortable-hover");
						}
					}
				}
			},
			start:  function(event, ui) {
				ui.item.parent().addClass('fb-sortable-hover');
			},
			over:  function(event, ui) {
				var $this = $(this);
				$('.fb-sortable-hover').removeClass('fb-sortable-hover');
				$this.addClass("fb-sortable-hover");
				if (
					(ui.item.hasClass("el-section-block") || ui.item.hasClass("fb-section")) &&
					$this.hasClass("wrap-tpl-block-section")
				) {
					$this.addClass("no-drop-element");
				}
			},
			stop:  function(event, ui) {
				ui.item.parent().removeClass('fb-sortable-hover');
				$(".no-drop-element").removeClass("no-drop-element");
				formBuilderpage.showHideInfBlock();
			},
			receive: function(event, ui) {
				ui.sender.parents(".tpl-block").removeClass("hide-controls");
				if (
					$(this).hasClass("wrap-tpl-block-section") &&
					!$(ui.sender).hasClass("eb-block-content") && $(ui.item).hasClass('fb-section')
				) {
					// console.log('stop');
					$(ui.sender).sortable("cancel");
					$(".no-drop-element").removeClass("no-drop-element");
					$(".fb-sortable-hover").removeClass("fb-sortable-hover");
				}
			}
		});
	},
	get_no_of_elements: function(type){
		return $('div.tpl-block[data-type-el="'+type+'"]').length;
	},
	generate_identifier: function (type, identifier_base){
		var identifier = '';
		var initial_identifier_index = this.get_no_of_elements(type) + 1;
		identifier = identifier_base + initial_identifier_index;
		if($('#'+identifier).length != 0){
			for(var i = initial_identifier_index+1 ; i < 1000; i++){
				if($('#'+identifier_base+i).length == 0){
					identifier = identifier_base + i;
					break;
				}
			}
		}
		return identifier;
	},
	addElements: function($el, isDrop, is_donation_form, is_payment_form, mappingFieldIds, label){
		
		if(( is_device_form || is_event_template ) && !ADD_ELEMENTS_PERMISSION){
			show_error_message(' You do not have permission to add Elements.');
			//$el.remove();
			return;
		}
		if(typeof is_donation_form == 'undefined'){
			is_donation_form = false;
		}
		var $box = $('.wrap-tpl-block:first');
		var type = $el.attr('data-field-type');
		var sub_type = $el.attr('data-field-sub-type');
		var htmlEl = '';
		var dataAll = '{}';
		var $tpl = $('#form-editor .fb-wrap-columns-form');
		var opt = $tpl.data('json');
		var posLabel = 0;
		if ($el.parents('.wrap-tpl-block').length){
			$box = $el.parents('.wrap-tpl-block');
		}
		var identifier = '';
		var field_global_style = 'background-color: ' + opt.fieldBackground + '; border-style:' + opt.fieldBorderStyle + '; border-radius:' + opt.fieldBorderRadius + 'px; -webkit-border-radius:' + opt.fieldBorderRadius + 'px; -moz-border-radius:' + opt.fieldBorderRadius + 'px; border-width:' + opt.fieldBorderWidth + '; border-color: ' + opt.fieldBorderColor + '; font-size: ' + opt.fieldSize + '; color:' + opt.fieldColor + '; font-family: ' + opt.fieldFont;
		var dropdown_global_style = 'background-color: ' + opt.dropdownBackground + '; border-color: ' + opt.dropdownBorderColor + '; border-radius: ' + opt.dropdownBorderRadius + 'px; -webkit-border-radius: ' + opt.dropdownBorderRadius + 'px; -moz-border-radius: ' + opt.dropdownBorderRadius + 'px; font-size: ' + opt.dropdownSize + 'px; color: ' + opt.dropdownColor + '; font-family: ' + opt.dropdownFont;
		var element_merge_type = DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY;
		if (type == 'text' && sub_type == 'company'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			var identifier_base = 'Company_Question_';
			identifier = this.generate_identifier('company', identifier_base);
			var company_mapping_field = {};
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Company_ID, identifier, '')){
				company_mapping_field = {"common": "Standard_"+LL_STANDARD_FIELD_Company_ID}
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": company_mapping_field, "labelWidth":"None", "defaultIdentifier":identifier, "identifierCustom":"0", "identifier":identifier, "visible":"0", "labelText":"Company", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='text' data-sub-type-el='company'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Company</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="t-field ">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" name="%%EN%%" class="txt-field fb-field-resize-custom" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'text' && sub_type == 'job_title'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			var identifier_base = 'Job_Title_Question_';
			identifier = this.generate_identifier('job_title', identifier_base);
			var job_title_mapping_field = {};
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_JobTitle_ID, identifier, '')){
				job_title_mapping_field = {"common": "Standard_"+LL_STANDARD_FIELD_JobTitle_ID}
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": job_title_mapping_field, "labelWidth":"None", "defaultIdentifier":identifier, "identifierCustom":"0", "identifier":identifier, "visible":"0", "labelText":"Job Title", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='text' data-sub-type-el='job_title'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Job Title</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="t-field ">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" name="%%EN%%" class="txt-field fb-field-resize-custom" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'text'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			var identifier_base = 'Text_Question_';
			identifier = this.generate_identifier('text', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "defaultIdentifier":identifier, "identifierCustom":"0", "identifier":identifier, "visible":"0", "labelText":"Text", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='text'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Text</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="t-field ">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" name="%%EN%%" class="txt-field fb-field-resize-custom" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'paragraph'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			var identifier_base = 'Paragraph_Question_';
			identifier = this.generate_identifier('paragraph', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier":identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Paragraph", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='paragraph'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Paragraph</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="t-field">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<textarea name="%%EN%%" class="txt-field fb-field-resize-custom" style="'+field_global_style+'"></textarea>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'multiple_choices'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			if (opt.labelPos == '2'){
				posLabel = 0;
			} else {
				posLabel = opt.labelPos;
			}
			var identifier_base = 'Radio_Buttons_Question_';
			identifier = this.generate_identifier('multiple_choices', identifier_base);
			custom_type = '';
			var choices_json = {"1": {"option_name": "First Option", "option_value": "First Option", "is_default": 0, "token": "", "type": "radio"}, "2": {"option_name": "Second Option", "option_value": "Second Option", "is_default": 0, "token": "", "type": "radio"}, "3": {"option_name": "Third Option", "option_value": "Third Option", "is_default": 0, "token": "", "type": "radio"}};
			if(is_payment_form || is_donation_form){
				identifier = 'Amount_Question';
				custom_type = "amount";
				choices_json = {"1": {"option_name": "$5", "option_value": "5", "is_default": 0, "token": "", "type": "radio"}, "2": {"option_name": "$10", "option_value": "10", "is_default": 0, "token": "", "type": "radio"}, "3": {"option_name": "$15", "option_value": "15","is_default": 0, "token": "", "type": "radio"}, "4": {"option_name": "$20", "option_value": "20", "is_default": 0, "token": "", "type": "radio"}};
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "custom_type": custom_type, "display": "classic", "choicesBgColor": "#ffffff", "choicesBorderColor": "#c9c9c9", "choicesSelectedBgColor": "#c9c9c9", "choicesSelectedBorderColor": "#c9c9c9", "choicesSelectedFontColor": "#333333", "choicesHintLeft": "NOT AT ALL LIKELY", "choicesHintLeftColor": "#333333", "choicesHintLeftSize": "14", "choicesHintLeftFont": "Open Sans", "choicesHintRight": "EXTREMELY LIKELY", "choicesHintRightColor": "#333333", "choicesHintRightSize": "14", "choicesHintRightFont": "Open Sans", "fieldItemsDirection": "vertical", "numberColumns": "1", "randomize": "static", "choices": choices_json, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "choicesColor": "#333333", "choicesSize": "14", "choicesFont": "Open Sans", "labelText":"Radio Buttons", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", 'llSingleFieldProcessType': '', "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='multiple_choices'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Radio Buttons</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-multiple-choise clearfix tpl-choices">';
			if(is_donation_form){
				htmlEl +=           '<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="5"><span class="fb-choice">$5</span></label>'+
					'</div>'+
					'</div>'+
					'<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="10"><span class="fb-choice">$10</span></label>'+
					'</div>'+
					'</div>'+
					'<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="15"><span class="fb-choice">$15</span></label>'+
					'</div>'+
					'</div>'+
					'<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="20"><span class="fb-choice">$20</span></label>'+
					'</div>'+
					'</div>'+
					'<div class="t-field" id="custom_amount" is_custom="1">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio" style="top: 7px;"></i><input type="radio" name="amount" value="custom"><span class="fb-choice" style="margin-right: 5px;">Custom</span><input type="text" class="txt-field" name="custom_amount" style="display: inline; width: 80px;"></label>'+
					'</div>'+
					'</div>';
			}else if (is_payment_form){
				htmlEl +=           '<div class="t-field">'+
					'<div class="payment_info"><span class="amount"></span> <span class="recurring_frequency"></span></div>'+
					'</div>';
			}else{
				htmlEl +=          	'<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="First Option"><span class="fb-choice">First Option</span></label>'+
					'</div>'+
					'</div>'+
					'<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="Second Option"><span class="fb-choice">Second Option</span></label>'+
					'</div>'+
					'</div>'+
					'<div class="t-field">'+
					'<div class="t-radio">'+
					'<label><i class="icn-radio"></i><input type="radio" value="Third Option"><span class="fb-choice">Third Option</span></label>'+
					'</div>'+
					'</div>';
			}
			htmlEl +=   		'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit" ';
			if(is_donation_form){
				htmlEl += 'form-type="donation"';
			}else if(is_payment_form){
				htmlEl += 'form-type="payment"';
			}
			htmlEl +=            '><i></i></a>';
			if(! is_payment_form && ! is_donation_form){
				htmlEl +='<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>';
			}
			htmlEl +=           '</div>'+
				'</div>';
		} else if (type == 'name'){
			var identifier_base = 'Name_Question_';
			identifier = this.generate_identifier('name', identifier_base);
			var name_mapping_field = {};
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_FirstName_ID, identifier, '')){
				name_mapping_field.fname = "Standard_"+LL_STANDARD_FIELD_FirstName_ID
			}
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_LastName_ID, identifier, '')){
				name_mapping_field.lname = "Standard_"+LL_STANDARD_FIELD_LastName_ID
			}
			var nameFirst = "First";
			var nameLast = "Last";
			if(is_device_form){
				nameFirst = "First Name";
				nameLast = "Last Name";
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": name_mapping_field, "labelWidth":"None", "identifierCustom":"0", "identifier":identifier, "defaultIdentifier": identifier, "visible":"0", "hints": {"nameFirst":nameFirst, "nameLast":nameLast}, "labelText":"Name", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "subLabelFont": opt.subLabelFont, "subLabelSize": opt.subLabelSize, "subLabelColor": opt.subLabelColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='name'>"+
				'<div class="tpl-block-content clearfix wrap-tpl-name %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Name</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-name clearfix size-'+opt.fieldLength+'">'+
				'<div class="f-line-field clearfix">'+
				'<div class="f-col-1">'+
				'<div class="t-field">'+
				'<span class="label-top">' + nameFirst + '</span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV1%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'<div class="f-col-2">'+
				'<div class="t-field">'+
				'<span class="label-top">' + nameLast +' </span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV2%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
			/*formBuilderpage.used_mapped_fields [identifier] = [];
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_FirstName_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['fname'] = "Standard_"+LL_STANDARD_FIELD_FirstName_ID;
			 }
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_LastName_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['lname'] = "Standard_"+LL_STANDARD_FIELD_LastName_ID;
			 }*/
		} else if (type == 'time'){
			var identifier_base = 'Time_Question_';
			identifier = this.generate_identifier('time', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Time", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='time'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Time</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-time clearfix">'+
				'<div class="t-field">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" class="txt-field fb-field-resize-custom" name="%%EN%%" %%EV%% style="'+field_global_style+'" autocomplete="off"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'address'){
			var identifier_base = 'Address_Question_';
			identifier = this.generate_identifier('address', identifier_base);
			var address_mapping_field = {};
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_StreetAddress_ID, identifier, '')){
				address_mapping_field.address1 = "Standard_"+LL_STANDARD_FIELD_StreetAddress_ID;
			}
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_StreetAddress2_ID, identifier, '')){
				address_mapping_field.address2 = "Standard_"+LL_STANDARD_FIELD_StreetAddress2_ID;
			}
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_City_ID, identifier, '')){
				address_mapping_field.city = "Standard_"+LL_STANDARD_FIELD_City_ID;
			}
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_State_ID, identifier, '')){
				address_mapping_field.state = "Standard_"+LL_STANDARD_FIELD_State_ID;
			}
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Zipcode_ID, identifier, '')){
				address_mapping_field.zipcode = "Standard_"+LL_STANDARD_FIELD_Zipcode_ID;
			}
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Country_ID, identifier, '')){
				address_mapping_field.country = "Standard_"+LL_STANDARD_FIELD_Country_ID;
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": address_mapping_field, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Address", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "dropdownBackground": opt.dropdownBackground, "dropdownBorderColor": opt.dropdownBorderColor, "dropdownBorderRadius": opt.dropdownBorderRadius, "dropdownFont": opt.dropdownFont, "dropdownSize": opt.dropdownSize, "dropdownColor": opt.dropdownColor, "subLabelFont": opt.subLabelFont, "subLabelSize": opt.subLabelSize, "subLabelColor": opt.subLabelColor, "hints": {"streetAddress1": "Street Address", "streetAddress2": "Address Line 2", "city": "City", "state": "State / Province / Region", "zipcode": "Zip / Postal Code", "country": "Country"}, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='address'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Address</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-address clearfix" style="min-height: 238px;">'+
				'<div class="t-field size-'+opt.fieldLength+'">'+
				'<span class="label-top fb-label-street">Street Address</span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV1%% style="'+field_global_style+'"/>'+
				'</div>'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-street-2">Address Line 2</span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV2%% style="'+field_global_style+'"/>'+
				'</div>'+
				'<div class="f-line-field clearfix">'+
				'<div class="f-col-1">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-city">City</span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV3%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'<div class="f-col-2">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-state">State / Province / Region</span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV4%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="f-line-field clearfix">'+
				'<div class="f-col-1">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-zip">Zip/Postal/Code</span>'+
				'<input type="text" class="txt-field" name="%%EN%%_%%index%%" %%EV5%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'<div class="f-col-2">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-country">Country</span>'+
				'<select class="fb-select-address-country" name="%%EN%%_%%index%%" style="'+dropdown_global_style+'">'+
				'<option>USA</option>'+
				'</select>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
			/* formBuilderpage.used_mapped_fields [identifier] = [];
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_StreetAddress_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['address1'] = "Standard_"+LL_STANDARD_FIELD_StreetAddress_ID;
			 }
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_StreetAddress2_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['address2'] = "Standard_"+LL_STANDARD_FIELD_StreetAddress2_ID;
			 }
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_City_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['city'] = "Standard_"+LL_STANDARD_FIELD_City_ID;
			 }
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_State_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['state'] = "Standard_"+LL_STANDARD_FIELD_State_ID;
			 }
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Zipcode_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['zipcode'] = "Standard_"+LL_STANDARD_FIELD_Zipcode_ID;
			 }
			 if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Country_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier]['country'] = "Standard_"+LL_STANDARD_FIELD_Country_ID;
			 }*/
		} else if (type == 'price'){
			var identifier_base = 'Price_Question_';
			identifier = this.generate_identifier('price', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "currency": "dollar", "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Price", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "subLabelFont": opt.subLabelFont, "subLabelSize": opt.subLabelSize, "subLabelColor": opt.subLabelColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='price'>"+
				'<div class="tpl-block-content clearfix wrap-tpl-price %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Price</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-price clearfix">'+
				'<div class="price-type" style="margin-left: -5px;">&#36;</div>'+
				'<div class="t-field size-'+opt.fieldLength+'">'+
				'<span class="label-top">Dollars</span>'+
				'<input type="text" class="txt-field txt-dollars" name="%%EN%%_%%index%%" %%EV1%% style="'+field_global_style+'"/>'+
				'</div>'+
				'<div class="price-separator">.</div>'+
				'<div class="t-field size-'+opt.fieldLength+'">'+
				'<span class="label-top">Cents</span>'+
				'<input type="text" class="txt-field txt-cents" name="%%EN%%_%%index%%" %%EV2%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'file_upload'){
			if(formBuilderpage.get_no_of_elements('file_upload') < form_max_no_of_file_upload_elements) {
				var identifier_base = 'File_Upload_Question_';
				identifier = this.generate_identifier('section_break', identifier_base);
				dataAll = {
					"element_id": formBuilderpage.element_current_id,
					"identifierCustom": "0",
					"identifier": identifier,
					"defaultIdentifier": identifier,
					"visible": "0",
					"mappingFieldIds": {},
					"labelText": "File Upload",
					"fieldLength": "None",
					"labelFont": "None",
					"labelSize": "None",
					"labelColor": "None",
					"FieldDescription": "Upload your File Here",
					"invalidFileErrorMessage": "Invalid File",
					"hasEditPermission":1,
					"hasDeletePermission":1
				};
				
				htmlEl = "<div data-element-id='" + formBuilderpage.element_current_id + "' data-json='" + JSON.stringify(dataAll) + "' id='" + identifier + "' class='tpl-block fb-upload-file fb-add-new-el' data-type-el='file_upload' data-invalid-file-error-message='Invalid File'>" +
					'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">' +
					'<label><span>File Upload</span></label>'+
					'<div class="element_error_message_container">' +
					'%%ERROR_MESSAGE%%' +
					'</div>' +
					'<div class="fb-upload-file-box">' +
					'<label><span class="field_description">Upload your File Here</span></label>' +
					'<input type="file" name="file_upload" />' +
					'</div>' +
					'</div>' +
					'<div class="tpl-block-controls">' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>' +
					'</div>' +
					'</div>';
			} else {
				show_error_message('You can insert only ' + form_max_no_of_file_upload_elements + ' File Upload element' + (form_max_no_of_file_upload_elements > 1 ? 's' : ''));
			}
		}else if (type == 'section_break'){
			if (opt.labelPos == '2'){
				posLabel = 0;
			} else {
				posLabel = opt.labelPos;
			}
			var identifier_base = 'Custom_Content_Question_';
			identifier = this.generate_identifier('section_break', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Custom Content", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor": "None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='section_break' style='min-height: 35px;'>"+
				'<div class="tpl-block-content clearfix">'+
				'<label><span>Custom Content</span></label>'+
				'<div class="t-field"><div class="fb-html"></div></div>'+
				'<div id="section_break_html_content"></div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'number'){
			var identifier_base = 'Number_Question_';
			identifier = this.generate_identifier('number', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Number", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='number'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Number</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="t-field">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="number" name="%%EN%%" class="txt-field fb-field-resize-custom" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'checkboxes'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			if (opt.labelPos == '2'){
				posLabel = 0;
			} else {
				posLabel = opt.labelPos;
			}
			var identifier_base = 'Checkboxes_Question_';
			identifier = this.generate_identifier('checkboxes', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, display: "classic", "choicesBgColor": "#ffffff", "choicesBorderColor": "#c9c9c9", "choicesSelectedBgColor": "#c9c9c9", "choicesSelectedBorderColor": "#c9c9c9", "choicesSelectedFontColor": "#333333", "choicesHintLeft": "NOT AT ALL LIKELY", "choicesHintLeftColor": "#333333", "choicesHintLeftSize": "14", "choicesHintLeftFont": "Open Sans", "choicesHintRight": "EXTREMELY LIKELY", "choicesHintRightColor": "#333333", "choicesHintRightSize": "14", "choicesHintRightFont": "Open Sans", "fieldItemsDirection": "vertical", "numberColumns": "1", "choices": {"1": {"option_name": "First Option", "option_value": "First Option", "is_default": 0, "token": "", "type": "checkbox"}, "2": {"option_name": "Second Option", "option_value": "Second Option", "is_default": 0, "token": "", "type": "checkbox"}, "3": {"option_name": "Third Option", "option_value": "Third Option", "is_default": 0, "token": "", "type": "checkbox"}},"isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Checkboxes", "fieldLength":"medium", "labelFont":"None", "choicesColor": "#333333", "choicesSize": "14", "choicesFont": "Open Sans", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='checkboxes'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Checkboxes</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-checkboxes clearfix tpl-choices">'+
				'<div class="t-field">'+
				'<div class="t-checkbox">'+
				'<label><i class="icn-checkbox"></i><input type="checkbox" value="First Option"><span class="fb-choice">First Option</span></label>'+
				'</div>'+
				'</div>'+
				'<div class="t-field">'+
				'<div class="t-checkbox">'+
				'<label><i class="icn-checkbox"></i><input type="checkbox" value="Second Option"><span class="fb-choice">Second Option</span></label>'+
				'</div>'+
				'</div>'+
				'<div class="t-field">'+
				'<div class="t-checkbox">'+
				'<label><i class="icn-checkbox"></i><input type="checkbox" value="Third Option"><span class="fb-choice">Third Option</span></label>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'drop_down'){
			if (opt.labelPos == '2'){
				posLabel = 0;
			} else {
				posLabel = opt.labelPos;
			}
			var identifier_base = 'Drop_Down_Question_';
			identifier = this.generate_identifier('drop_down', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "choices": {"1": {"option_name": "First Option", "option_value": "First Option", "is_default": 0, "token": ""}, "2": {"option_name": "Second Option", "option_value": "Second Option", "is_default": 0, "token": ""}, "3": {"option_name": "Third Option", "option_value": "Third Option", "is_default": 0, "token": ""}}, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Drop Down", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "dropdownBackground": opt.dropdownBackground, "dropdownBorderColor": opt.dropdownBorderColor, "dropdownBorderRadius": opt.dropdownBorderRadius, "dropdownFont": opt.dropdownFont, "dropdownSize": opt.dropdownSize, "dropdownColor": opt.dropdownColor, 'llSingleFieldProcessType': '', "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='drop_down'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Drop Down</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="t-field">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<select name="%%EN%%" style="'+dropdown_global_style+'">'+
				'<option value="First Option">First Option</option>'+
				'<option value="Second Option">Second Option</option>'+
				'<option value="Third Option">Third Option</option>'+
				'</select>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'documents'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			var identifier_base = 'Documents_Question_';
			identifier = this.generate_identifier('documents', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Documents", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='" + formBuilderpage.element_current_id + "' id='" + identifier + "' data-json='" + JSON.stringify(dataAll) + "' class='tpl-block fb-add-new-el' data-type-el='documents'>" +
					 '<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">' +
					 '<label><span>Documents</span></label>' +
					 '<div class="element_error_message_container">' +
					 '%%ERROR_MESSAGE%%' +
					 '</div>' ;
				if(!is_device_form) {
					htmlEl += '<div class="tpl-checkboxes clearfix tpl-choices">' +
						'<div class="t-field">' +
						'<div class="t-checkbox">' +
						'<label><i class="icn-checkbox"></i><input type="checkbox" value="Document 1"><span class="fb-choice">Document 1</span></label>' +
						'</div>' +
						'</div>' +
						'<div class="t-field">' +
						'<div class="t-checkbox">' +
						'<label><i class="icn-checkbox"></i><input type="checkbox" value="Document 2"><span class="fb-choice">Document 2</span></label>' +
						'</div>' +
						'</div>' +
						'<div class="t-field">' +
						'<div class="t-checkbox">' +
						'<label><i class="icn-checkbox"></i><input type="checkbox" value="Document 3"><span class="fb-choice">Document 3</span></label>' +
						'</div>' +
						'</div>' +
						'</div>' +
						'</div>';
				} else {
					htmlEl += '<div class="t-field">' +
						'<img src="imgs/imgs_form_builder/documents-grey.svg" style="width: 90px;">' +
						'</div>' +
						'</div>' ;
				}
				htmlEl += 	'<div class="tpl-block-controls">'+
							'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
							'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
							'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
							'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
							'</div>'+
							'</div>';

		}else if (type == 'activation'){
			element_merge_type = DATA_PROCESS_TYPE_MERGE;
			var identifier_base = 'Activation_Question_';
			identifier = this.generate_identifier('activation', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Activation", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='" + formBuilderpage.element_current_id + "' id='" + identifier + "' data-json='" + JSON.stringify(dataAll) + "' class='tpl-block fb-add-new-el' data-type-el='activation'>" +
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">' +
				'<label><span>Activation</span></label>' +
				'<div class="element_error_message_container">' +
				'%%ERROR_MESSAGE%%' +
				'</div>' ;
			htmlEl += '<div class="t-field">' +
				'<img src="imgs/imgs_form_builder/activation.svg" style="width: 90px;">' +
				'</div>' +
				'</div>' ;
			htmlEl += 	'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';

		}else if (type == 'column_separator'){
			if(formBuilderpage.get_no_of_elements('column_separator') == 0) {
				var identifier_base = 'Column_Separator_Question_';
				identifier = this.generate_identifier('column_separator', identifier_base);
				dataAll = {
					"element_id": formBuilderpage.element_current_id,
					"isRequired": 0,
					"isAlwaysDisplay": 0,
					"isConditional": 0,
					"isDonotPrefilled": 0,
					"isHidden": 0,
					"displayMode": 0,
					"defaultValue": "",
					"fieldErrorMessage": "",
					"cssClass": "",
					"containerCssClass": "",
					"guidelines": "",
					"mappingFieldIds": {},
					"labelWidth": "None",
					"identifierCustom": "0",
					"identifier": identifier,
					"defaultIdentifier": identifier,
					"visible": "0",
					"labelText": "Column Separator",
					"fieldLength": opt.fieldLength,
					"labelFont": "None",
					"labelSize": "None",
					"labelColor": "None",
					"labelPos": "None",
					"fieldBackground": "None",
					"fieldBorderStyle": "None",
					"fieldBorderWidth": "None",
					"fieldBorderColor": "None",
					"fieldFont": "None",
					"fieldSize": "None",
					"fieldColor": "None",
					"mergeType": element_merge_type,
					"hasEditPermission":1,
					"hasDeletePermission":1
				};
				htmlEl = "<div data-element-id='" + formBuilderpage.element_current_id + "' id='" + identifier + "' data-json='" + JSON.stringify(dataAll) + "' class='tpl-block fb-add-new-el' data-type-el='column_separator'>" +
					'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">' +
					'<label><span>Column Separator</span></label>' +
					'<div class="element_error_message_container">' +
					'%%ERROR_MESSAGE%%' +
					'</div>' +
					'<div class="t-field">'+
					'<img src="imgs/imgs_form_builder/col-separator-gray.svg" style="width: 90px;">'+
					'</div>'+
					'</div>' +
					'<div class="tpl-block-controls">' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>' +
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>' +
					'</div>' +
					'</div>';
			} else{
				show_error_message('Only one Column Separator is allowed.');
			}
		} else if (type == 'section_block') {
			var identifier_base = 'Section_Question_';
			identifier = this.generate_identifier('section_block', identifier_base);
			var letter = formBuilderpage.getIdLabel($(".fb-section-box"));
			var label = "Section " + letter.text;
			var idLetter = letter.id;
			
			dataAll = '{"element_id": "'+formBuilderpage.element_current_id+'", "identifierCustom":"0", "identifier":"'+identifier+'", "defaultIdentifier":"Section", "visible":"0", "labelText":"' + label + '", "fieldLength":"None", "labelFont":"None", "labelSize":"20", "labelColor":"None", "labelAlign":"1"}';
			
			htmlEl =
				"<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='" + dataAll + "' class='tpl-block fb-section fb-add-new-el' data-type-el='section_block'>" +
				'<span class="element_properties_letters" style="display: none;"> [<span class="conditions_letters"><span class="required_element" style="display: none;"> r </span><span class="always_display_element" style="display: none;"> a </span><span class="conditional_element" style="display: none;"> c </span><span class="hidden_element" style="display: none;"> h </span></span>] </span>'+
				'<br/>' +
				'<div class="tpl-block-content clearfix">' +
				'<div class="fb-section-box" id-letter="' +
				idLetter +
				'">' +
				"<label><span>" +
				label +
				"</span></label>" +
				'<div class="wrap-tpl-block-section">' +
				'<div class="fb-dragenddrop-box">Drop your element here</div>' +
				"</div>" +
				"</div>" +
				"</div>" +
				'<div class="tpl-block-controls">' +
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>' +
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>' +
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>' +
				"</div>" +
				"</div>";
		}else if (type == 'date'){
			var identifier_base = 'Date_Question_';
			identifier = this.generate_identifier('date', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Date", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='date'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Date</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-date">'+
				'<div class="t-field">'+
				'<span class="icn-search-date"></span>'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input class="txt-field ll-input-date" type="text" name="%%EN%%" %%EV%% style="'+field_global_style+'" autocomplete="off"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'datetime'){
			var identifier_base = 'Date_Question_';
			identifier = this.generate_identifier('datetime', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Datetime", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='datetime'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Datetime</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-date">'+
				'<div class="t-field">'+
				'<span class="icn-search-date"></span>'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input class="txt-field ll-input-date" type="text" name="%%EN%%" %%EV%% style="'+field_global_style+'" autocomplete="off"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'phone'){
			var identifier_base = 'Phone_Question_';
			identifier = this.generate_identifier('phone', identifier_base);
			var phone_mapping_field = {};
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_WorkPhone_ID, identifier, '')){
				phone_mapping_field = {"common": "Standard_"+LL_STANDARD_FIELD_WorkPhone_ID}
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "phoneFormat": "", "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": phone_mapping_field, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Phone", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='phone'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Phone</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-phone">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" class="txt-field fb-field-resize-custom" name="%%EN%%" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
			/*if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_WorkPhone_ID, identifier, '')){
			 formBuilderpage.used_mapped_fields [identifier] = [];
			 formBuilderpage.used_mapped_fields [identifier]['common'] = "Standard_"+LL_STANDARD_FIELD_WorkPhone_ID;
			 }*/
		} else if (type == 'website'){
			var identifier_base = 'Web_Site_Question_';
			identifier = this.generate_identifier('website', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Web Site", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='website'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Web Site</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-web-site">'+
				'<div class="t-field">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" name="%%EN%%" class="txt-field fb-field-resize-custom" placeholder="http://" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'email'){
			var identifier_base = 'Email_Question_';
			identifier = this.generate_identifier('email', identifier_base);
			var email_mapping_field = {};
			if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Email_ID, identifier, '')){
				email_mapping_field = {"common": "Standard_"+LL_STANDARD_FIELD_Email_ID}
			}
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": email_mapping_field, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Email", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground": opt.fieldBackground, "fieldBorderStyle": opt.fieldBorderStyle, "fieldBorderWidth": opt.fieldBorderWidth, "fieldBorderColor": opt.fieldBorderColor, "fieldFont": opt.fieldFont, "fieldSize": opt.fieldSize, "fieldColor": opt.fieldColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='email'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Email</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-email">'+
				'<div class="t-field">'+
				'<div class="resizable-field size-'+opt.fieldLength+'">'+
				'<input type="text" name="%%EN%%" class="txt-field fb-field-resize-custom" placeholder="@" %%EV%% style="'+field_global_style+'"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit" ';
			if(is_donation_form){
				htmlEl += 'form-type="donation"';
			}
			htmlEl +=      '><i></i></a>';
			if(! is_donation_form){
				htmlEl +=  	'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>';
			}
			
			htmlEl +=  	'</div>'+
				'</div>';
			/*if(! formBuilderpage.check_if_another_form_field_mapped_to_the_same_ll_field('Standard_'+LL_STANDARD_FIELD_Email_ID, 'element_'+formBuilderpage.element_current_id, '')){
			 formBuilderpage.used_mapped_fields [identifier] = [];
			 formBuilderpage.used_mapped_fields [identifier]['common'] = "Standard_"+LL_STANDARD_FIELD_Email_ID;
			 }*/
		} else if (type == 'page_break'){
			if(formBuilderpage.wizard_no_of_pages < 50){
				var identifier_base = 'Page_Break_Question_';
				identifier = this.generate_identifier('page_break', identifier_base);
				dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Page Break", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
				htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-page-break fb-add-new-el' data-type-el='page_break'>"+
					'<div class="tpl-block-content clearfix">'+
					'<label><span>Page Break</span></label>'+
					'</div>'+
					'<div class="tpl-block-controls">'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
					'</div>'+
					'</div>';
			}else{
				show_error_message('Max number of steps is 50');
			}
		} else if (type == 'calculated'){
			var identifier_base = 'Calculated_Question_';
			identifier = this.generate_identifier('calculated', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Calculated", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='calculated'>"+
				'<div class="tpl-block-content clearfix">'+
				'<label><span>Calculated</span></label>'+
				'<div class="tpl-calculated">'+
				'<div class="t-field">'+
				'<div class="resizable-field size-medium">'+
				'<input type="text" name="%%EN%%" class="txt-field fb-field-resize-custom" %%EV%% />'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'image'){
			var identifier_base = 'Image_Question_';
			identifier = this.generate_identifier('image', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Image Capture", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='image'>"+
				'<div class="tpl-block-content clearfix">'+
				'<label><span>Image Capture</span></label>'+
				'<div class="t-field">'+
				'<img src="imgs/imgs_email_builder/img_none.png">'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'signature'){
			var identifier_base = 'Signature_Question_';
			identifier = this.generate_identifier('signature', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Signature", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='signature'>"+
				'<div class="tpl-block-content clearfix">'+
				'<label><span>Signature</span></label>'+
				'<div class="t-field">'+
				'<img src="imgs/imgs_email_builder/img_none.png">'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'business_card'){
			if(formBuilderpage.get_no_of_elements('business_card') == 0){
				var identifier_base = 'Business_Card_Question_';
				identifier = this.generate_identifier('business_card', identifier_base);
				dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Business Card", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "is_scan_cards_and_prefill_form": 0, "is_enable_transcription": 0, "transcription_type": 1, "transcription_expedited_localization": 'english', "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
				htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='business_card'>"+
					'<div class="tpl-block-content clearfix">'+
					'<label><span>Business Card</span></label>'+
					'<div class="t-field">'+
					'<img src="imgs/imgs_email_builder/img_none.png">'+
					'</div>'+
					'</div>'+
					'<div class="tpl-block-controls">'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
					'</div>'+
					'</div>';
			}else{
				show_error_message('You can insert only one Business Card element');
			}
		} else if (type == 'barcode'){
			if(formBuilderpage.get_no_of_elements('barcode') == 0){
				var identifier_base = 'Barcode_Question_';
				identifier = this.generate_identifier('barcode', identifier_base);
				dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 1, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Scanner", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "is_scan_cards_and_prefill_form": 0, "is_enable_transcription": 0, "transcription_type": 1, "transcription_expedited_localization": 'english', "accept_invalid_barcode": 1, "barcode_type": '', "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
				htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='barcode'>"+
					'<div class="tpl-block-content clearfix">'+
					'<label><span>Scanner</span></label>'+
					'<div class="t-field">'+
					'<img src="imgs/imgs_email_builder/barcode-placeholder.png" style="width: 90px;">'+
					'</div>'+
					'</div>'+
					'<div class="tpl-block-controls">'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
					'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
					'</div>'+
					'</div>';
				$('#unique_id_barcode_div').show();
			}else{
				show_error_message('You can insert only one Scanner element');
			}
		} else if (type == 'audio'){
			var identifier_base = 'Audio_Question_';
			identifier = this.generate_identifier('audio', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Audio Recorder", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "enable_audio_transcription": 0, "audio_transcription_type": LL_AUDIO_TRANSCRIPTION_TYPE_STANDARD, "audio_transcription_update_field": "", "audio_transcription_update_field_process_type": DATA_PROCESS_TYPE_MERGE, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='audio'>"+
				'<div class="tpl-block-content clearfix">'+
				'<label><span>Audio Recorder</span></label>'+
				'<div class="t-field">'+
				'<img src="imgs/imgs_form_builder/audio-grey.svg" style="width: 90px;">'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'boolean'){
			var identifier_base = 'Boolean_Question_';
			identifier = this.generate_identifier('boolean', identifier_base);
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "0", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": identifier, "defaultIdentifier": identifier, "visible":"0", "labelText":"Boolean", "fieldLength":"medium", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "booleanFieldDescription": "Boolean field description", "booleanMode": 1, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='"+identifier+"' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='boolean'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Boolean</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-checkboxes clearfix tpl-choices">'+
				'<div class="t-field">'+
				'<div class="t-checkbox">'+
				'<label><i class="icn-checkbox"></i><input type="checkbox" value="1" %%CHECKED%%><span class="fb-choice boolean_field_description">Boolean field description</span></label>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-clone"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-delete"><i></i></a>'+
				'</div>'+
				'</div>';
		}else if (type == 'credit_card'){
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": "Credit_Card_Question", "defaultIdentifier": "Credit_Card_Question", "visible":"0", "labelText":"Credit Card", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "subLabelFont": opt.subLabelFont, "subLabelSize": opt.subLabelSize, "subLabelColor": opt.subLabelColor, "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='Credit_Card_Question' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='credit_card'>"+
				'<div class="tpl-block-content clearfix %%SHOW_ERROR_CLASS%%">'+
				'<label><span>Credit Card</span></label>'+
				'<div class="element_error_message_container">'+
				'%%ERROR_MESSAGE%%'+
				'</div>'+
				'<div class="tpl-credit-card">'+
				'<div class="t-field">'+
				'<span class="label-top">Credit Card Number</span>'+
				'<div class="resizable-field">'+
				'<input type="text" name="credit_card_number" id="credit_card_number" class="txt-field fb-field-resize-custom" />'+
				'</div>'+
				'</div>'+
				'<div class="f-line-field clearfix">'+
				'<div class="f-col-1">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-month">MM</span>'+
				'<select id="credit_card_month" name="expiration_month_credit_card">';
			for (i=1; i <= 12; i++) {
				if(i <= 9){
					i = '0' + i;
				}
				htmlEl += '<option>'+i+'</option>';
			}
			htmlEl += 					'</select>'+
				'</div>'+
				'</div>'+
				'<div class="f-col-2">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-year">YY</span>'+
				'<select id="credit_card_year" name="expiration_year_credit_card">';
			for (i=current_year; i <= current_year+20; i++) {
				if(i <= 9){
					i = '0' + i;
				}
				htmlEl += '<option>'+i+'</option>';
			}
			htmlEl += 					    '</select>'+
				'</div>'+
				'</div>'+
				'<div class="f-col-3">'+
				'<div class="t-field">'+
				'<span class="label-top fb-label-year">CVV</span>'+
				'<input type="text" name="credit_card_cvv" id="credit_card_cvv" class="txt-field" style="width: 100%"/>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'</div>'+
				'</div>';
		} else if (type == 'recurring'){
			dataAll = {"element_id": formBuilderpage.element_current_id, "isRequired": 0, "isAlwaysDisplay": 0, "isConditional": 0, "isDonotPrefilled": 0, "isHidden": 0, "displayMode": 0, "defaultValue": "", "fieldErrorMessage": "", "cssClass": "", "containerCssClass": "", "guidelines": "", "mappingFieldIds": {}, "labelWidth":"None", "identifierCustom":"0", "identifier": "Recurring_Question", "defaultIdentifier": "Recurring_Question", "visible":"0", "labelText":"Recurring", "fieldLength": opt.fieldLength, "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "mergeType": element_merge_type, "hasEditPermission":1,"hasDeletePermission":1};
			htmlEl = "<div data-element-id='"+formBuilderpage.element_current_id+"' id='Recurring_Question' data-json='"+JSON.stringify(dataAll)+"' class='tpl-block fb-add-new-el' data-type-el='recurring'>"+
				'<div class="tpl-block-content clearfix">'+
				'<div class="tpl-recurring" style="display: table; width: 100%">'+
				'<div class="t-field" style="display: table-cell; width: 14%; vertical-align: middle;padding-right: 2%;">'+
				'<div class="t-checkbox">'+
				'<label><i class="icn-checkbox"></i><input type="checkbox" id="is_recurring" name="is_recurring" value="1"><span class="fb-choice">Recurring</span></label>'+
				'</div>'+
				'</div>'+
				'<div id="recurring_plans_div">'+
				'<select id="recurring_plan" name="recurring_interval">';
			var recurring_plans = formBuilderpage.selected_payment_account.recurring_plans;
			for (i in recurring_plans) {
				htmlEl += '<option value="'+recurring_plans[i].payment_gateway_recurring_plan_id+'">'+recurring_plans[i].recurring_plan_name+'</option>';
			}
			htmlEl += 					    '</select>'+
				'</div>'+
				'</div>'+
				'</div>'+
				'<div class="tpl-block-controls">'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-move"><i></i></a>'+
				'<a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>'+
				'</div>'+
				'</div>';
		}

		if (isDrop){
			if(htmlEl){
				$box.find('.eb-block-content').replaceWith(htmlEl);
			}else{
				$box.find('.eb-block-content').remove();
			}
		} else {
			if(type == 'page_break'){
				$box.append(htmlEl);
			}else{
				if(formBuilderpage.is_wizard){
					if (formBuilderpage.add_new_fields_to == 'top'){
						$box.find('.fb-page-step-section.fb-selected').prepend(htmlEl);
					}else if (formBuilderpage.add_new_fields_to == 'bottom'){
						$box.find('.fb-page-step-section.fb-selected').append(htmlEl);
					}
				}else{
					if (formBuilderpage.add_new_fields_to == 'top'){
						$box.prepend(htmlEl);
					}else if (formBuilderpage.add_new_fields_to == 'bottom'){
						$box.append(htmlEl);
					}
				}
			}
		}
		//ll_combo_manager.make_combo('select:visible');

		var $block = $('.wrap-tpl-block .tpl-block.fb-add-new-el');
		if($block.length > 0){
			var bgColorForm = "trnasparent";
			if(!is_device_form) {
				( opt.isTransparentFormBackground === "1" ) ? bgColorForm = 'transparent' :  bgColorForm = opt.formBackground;
			}
			$block.removeClass('fb-add-new-el').css('background-color', bgColorForm);
			
			if (type == 'time'){
				formBuilderpage.timeElement($block.find('.tpl-time .txt-field'));
			} else if (type == 'datetime'){
				formBuilderpage.datetimeElement($block.find('.tpl-date .ll-input-date'));
			} else if (type == 'date'){
				formBuilderpage.dateElement($block.find('.tpl-date .ll-input-date'));
			} else if (type == 'phone'){
				formBuilderpage.phoneElement($block.find('.tpl-phone .txt-field'));
			} else if (type == 'page_break'){
				formBuilderpage.pageBreakInit();
			}
			
			$block.find('.tpl-block-content').children('label').css({
				'font-size': opt.labelSize + 'px',
				'color': opt.labelColor
			});
			
			if($.inArray(opt.labelFont, STANDARD_FONTS)== -1){
				$block.find('.tpl-block-content').children('label').css({
					'font-family': opt.labelFont
				});
			} else {
				$block.find('.tpl-block-content').children('label').css({
					'font-family': opt.labelFont + ', sans-serif'
				});
			}
			$block.find('.txt-field').css({
				'background-color': opt.fieldBackground,
				'border-style': opt.fieldBorderStyle.toLowerCase(),
				'border-width': opt.fieldBorderWidth + 'px',
				'border-color': opt.fieldBorderColor,
				'border-radius': opt.fieldBorderRadius + 'px',
				'-webkit-border-radius': opt.fieldBorderRadius + 'px',
				'-moz-border-radius': opt.fieldBorderRadius + 'px',
				'font-size': opt.fieldSize + 'px',
				'color': opt.fieldColor
			});
			if($.inArray(opt.fieldFont, STANDARD_FONTS)== -1){
				$block.find('.txt-field').css({
					'font-family': opt.fieldFont
				});
			} else {
				$block.find('.txt-field').css({
					'font-family': opt.fieldFont + ', sans-serif'
				});
			}
			
			formBuilderpage.labelPosition($block);
			formBuilderpage.fieldSize($block);
			formBuilderpage.showHideInfBlock();
			formBuilderpage.dropDownStyleUpdate($block);
			formBuilderpage.dragAndDropElements();
			formBuilderpage.element_current_id++;
			if (type == 'drop_down' || type == 'address'){
				ll_combo_manager.make_combo('.wrap-tpl-block .tpl-block:first select');
			}
			formBuilderpage.triggerChangeInForm();
			if(typeof mappingFieldIds != 'undefined' && mappingFieldIds ){
				var options = $block.data('json');
				options.mappingFieldIds = {"common": mappingFieldIds };
				formBuilderpage.set_elemenet_data($block, options);
			}
			if(typeof label != 'undefined' && label ){
				$block
					.find(".tpl-block-content")
					.children("label")
					.children("span:not(.required_astrisk)")
					.text(label);
				var options = $block.data('json');
				options.labelText = label;
				formBuilderpage.set_elemenet_data($block, options);
			}
		}
	},
	getIdLabel: function($el) {
		var idLetters = [];
		var idLetter = 0;
		var letter = "";
		
		$el.each(function() {
			idLetters.push($(this).attr("id-letter"));
		});
		
		for (i = 0; i < 26; i++) {
			if (idLetters.indexOf(i + "") === -1) {
				idLetter = i;
				break;
			}
		}
		
		letter = String.fromCharCode(65 + idLetter);
		
		return { text: letter, id: idLetter };
	},
	showHideInfBlock: function(){
		var $form = $(".fb-wrap-columns-form");
		var $wrapperColumn = $form.children(".wrap-tpl-block");
		var $dragenddropFirst = $form.children(".fb-dragenddrop-box");
		var $btn = $("#wrap-form-submit-button");
		var $wraperSection = $(".fb-section-box").children(".wrap-tpl-block-section");
		
		if ($wrapperColumn.children(".tpl-block").length > 0) {
			$dragenddropFirst.hide();
			$form.addClass('hide_border');
			$wrapperColumn.css("min-height", "0");
			if(!is_device_form) {
				$btn.show();
			}else{
				$btn.hide();
			}
		} else {
			$btn.hide();
			$wrapperColumn.css("min-height", "340px");
			$dragenddropFirst.show();
			$form.removeClass('hide_border');
		}
		$wrapperColumn.each(function() {
			var $wrap = $(this);
			
			if ($wrap.find(".tpl-block").length > 0) {
				$wrap.find(".fb-dragenddrop-box-text").hide();
				if ($wrap.parents('.fb-wrap-three-columns, .fb-wrap-two-columns').length ){
					$wrap.removeClass('fb-noactive-container');
				}
				
			} else {
				$wrap.find('.fb-dragenddrop-box-text').show();
				if ( $wrap.parents('.fb-wrap-three-columns, .fb-wrap-two-columns').length ){
					$wrap.addClass('fb-noactive-container');
				}
			}
		});
		$wraperSection.each(function() {
			var $wrap = $(this);
			var $dragenddrop = $wrap.children(".fb-dragenddrop-box");
			
			$wrap.children(".tpl-block").length > 0
				? $dragenddrop.hide()
				: $dragenddrop.show();
		});
	},
	elementsClone: function($btn){
		if(( is_device_form || is_event_template ) && !ADD_ELEMENTS_PERMISSION){
			show_error_message(' You do not have permission to add Elements.');
			return;
		}
		var $block = $btn.closest('.tpl-block');
		var type = $block.attr('data-type-el');
		var $clone = $block.clone();
		$clone.removeClass('selected').addClass('fb-clone-new');
		var Type = type.charAt(0).toUpperCase() + type.slice(1);
		if(type == 'section_break'){
			Type = 'Custom_Content';
		}
		var identifier_base = Type+'_Question_';
		var identifier = this.generate_identifier(type, identifier_base);
		$clone.attr('id', identifier);
		cloned_properties = $clone.data('json');
		cloned_properties.element_id = formBuilderpage.element_current_id;
		cloned_properties.defaultIdentifier = identifier;
		cloned_properties.identifier = identifier;
		cloned_properties.mappingFieldIds = {};
		//$clone.attr('data-json', JSON.stringify( cloned_properties ));
		formBuilderpage.set_elemenet_data($clone, cloned_properties);
		$clone.attr('data-element-id', formBuilderpage.element_current_id);
		$block.after($clone);
		if ( type == 'time' ){
			$('.fb-clone-new').find('.txt-field').timeEntry('destroy');
			formBuilderpage.timeElement($('.fb-clone-new').find('.txt-field'));
		}
		if ( type == 'date' ){
			//$('.fb-clone-new').find('.txt-field').removeAttr('id').removeClass('hasDatepicker');
			formBuilderpage.dateElement($('.fb-clone-new').find('.txt-field'));
		}
		if ( type == 'phone' ){
			$('.fb-clone-new').find('.txt-field').inputmask('remove');
			formBuilderpage.phoneElement($('.fb-clone-new').find('.txt-field'));
		}
		if ( type == 'drop_down' || type == 'address'){
			var $select = $('.fb-clone-new').find('select');
			$select.removeClass('chzn-done');
			$select.show();
			$select.removeAttr('id');
			$('.fb-clone-new .chzn-container').remove();
			$('.fb-clone-new .fb-select-address-country').text('%%COUNTRIES%%');
			ll_combo_manager.make_combo('.fb-clone-new select');
			formBuilderpage.dropDownStyleUpdate($block);
		}
		if (type == "section_block") {
			$(".fb-clone-new").find(".wrap-tpl-block").removeClass("ui-sortable");
			formBuilderpage.dragAndDropElements();
		}
		
		$('.fb-clone-new').removeClass('fb-clone-new');
		
		formBuilderpage.element_current_id++;
		
	},
	datetimeElement: function ($input){
		$input.datetimepicker({
			format:'m-d-Y h:i:s'
		});
		$input.prev('.icn-search-date').on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).next('input').trigger('focus');
		});
	},
	dateElement: function($input){
		$input.datetimepicker({
			timepicker:false,
			format:'m-d-Y'
		});
		$input.prev('.icn-search-date').on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			$(this).next('input').trigger('focus');
		});
	},
	timeElement: function($input){
		$input.timeEntry({
			spinnerSize: [0,0,0]
		});
	},
	phoneElement: function($input){
		$input.inputmask('mask', {'mask': '(999) 999 - 9999'});
	},
	colorBox: function(){
		$('.form-builder .color-box').each(function(){
			var color =  $(this).attr('data-color-start');
			var callBack = $(this).attr('call-back');
			var id = $(this).attr('id');
			$(this).colpick({
				colorScheme:'dark',
				layout:'hex',
				color: color,
				onSubmit:function(hsb,hex,rgb,el) {
					$(el).css('background-color', '#'+hex);
					$(el).colpickHide();
					formBuilderpage.updateColorElTpl(el, hex);
					if(typeof callBack != 'undefined') {
						var $tpl = $('.tpl-block.selected');
						var opt = $tpl.data('json');
						opt.element_background_color = formBuilderpage.rgb2hex($('#element_background_color').css("background-color"));
						opt.element_text_color = formBuilderpage.rgb2hex($('#element_text_color').css( "background-color" ));
						formBuilderpage.set_elemenet_data($tpl, opt);
					}
				}
			}).css('background-color', '#'+color);
		});
	},
	resizableField: function(){
		$('.wrap-tpl-block').on('focus', '.fb-field-resize-custom', function(e){
			var that = $(this);
			$(this).parents('.resizable-field').resizable({
				handles: "e",
				minHeight: 30,
				minWidth: 100,
				height: 'auto',
				maxWidth: '100%',
				distance: 10
			});
		});
		$('.wrap-tpl-block').on('blur', '.fb-field-resize-custom', function(e){
			$(this).parents('.resizable-field').resizable( "destroy" );
		});
	},
	get_datatype_aliases_array_for_field: function(field_type){
		var datatype_aliases = [];
		switch(field_type){
			case 'paragraph':
			case 'image':
			case 'business_card':
			case 'barcode':
			case 'audio':
				datatype_aliases[0] = 'text';
				break;
			case 'multiple_choices':
			case 'text':
			case 'calculated':
			case 'checkboxes':
			case 'drop_down':
			case 'phone':
			case 'website':
			case 'email':
				datatype_aliases[0] = 'boolean';
				datatype_aliases[1] = 'string';
				datatype_aliases[2] = 'multipicklist';
				break;
			case 'time':
				datatype_aliases[0] = 'string';
				datatype_aliases[1] = 'time'; //sub type
				break;
			case 'number':
				datatype_aliases[0] = 'number';
				datatype_aliases[1] = 'decimal';
				datatype_aliases[2] = 'multipicklist';
				break;
			case 'price':
				datatype_aliases[0] = 'decimal';
				datatype_aliases[1] = 'multipicklist';
				break;
			case 'date':
				datatype_aliases[0] = 'date';
				datatype_aliases[1] = 'datetime';
				datatype_aliases[2] = 'multipicklist';
				break;
			case 'datetime':
				datatype_aliases[0] = 'date';
				datatype_aliases[1] = 'datetime';
				break;
			case 'image':
			case 'signature':
			case 'business_card':
				datatype_aliases[0] = 'string';
				break;
			case 'name':
			case 'address':
				datatype_aliases[0] = 'string';
				break;
			case 'section_break':
				
				break;
			case 'boolean':
				datatype_aliases[0] = 'boolean';
				break;
			case 'file_upload':
				datatype_aliases[0] = 'string';
				datatype_aliases[1] = 'text';
				break;
			default:
				//show_error_message('Invalid field');
				return;
				break;
		}
		return datatype_aliases;
	},
	/*update elements*/
	editElementTpl: function(type, element_id, formType){
		// console.log(type);
		//$('#field_style_tab').removeClass('selected');
		
		$('.fb-panel-content .tabs-editor > ul li:nth-child(1)').click();
		formBuilderpage.active_element = element_id;
		formBuilderpage.current_element_type = type;
		var $tpl  = $('.tpl-block.selected');
		var sub_type = $tpl.attr('data-sub-type-el');
		var opt = $tpl.data('json');
		var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		var optGlobal = $tplGlobal.data('json');
		
		var $slide = $('.fb-right-panel-slide');
		$('.fb-panel-content .fb-settings .fb-field').hide();
		$slide.find('#element_field_label').show();
		$slide.find('#element_field_placeholder').hide();
		$slide.find('#element_rules').show();
		$slide.find('#rule_donot_prefill').show();
		$slide.find('#rule_hidden').show();
		$slide.find('#amount_title').hide();
		$slide.find('#rule_retry_playing').hide();
		$slide.find('#element_invalid_file_error_message').hide();
		if(!is_device_form){$slide.find('#element_field_error_message').show();}
		if(is_event_template){$slide.find('#element_permissions').show();}
		
		$slide.find('#element_visible').show();
		$slide.find('#business_card_element_options').hide();
		$slide.find('#label-visibility').hide();
		if(!is_device_form){
			$slide.find('#element_css_class').show();
			$slide.find('#container_element_css_class').show();
			$('.element_load_from_url').show();
			$slide.find('#element_identifier').show();
		}
		$slide.find('#element_is_filled_from_barcode').hide();
		$slide.find('.element_barcode_provider_type_authentication_info').html('');
		$('.options-style').hide();
		$('.use-theme-style').hide();
		if(is_device_form){
			$('#field_style_tab').hide();
			if(formBuilderpage.get_no_of_elements('barcode') > 0 && type != 'barcode' && type != 'business_card' && type != 'signature' && type != 'audio' && type != 'documents' && type != 'section_block' && type != 'column_separator'){
				$slide.find('#element_is_filled_from_barcode').show();
			}
			$slide.find('#label-visibility').show();
		}
		//$slide.find('#element_guidelines_for_user').show();
		$('#section_break_content').hide();
		$('#element_collapse_content').hide();
		ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style', true);
		$('.element-style').hide();
		$slide.find('#element_common_map_rules').show();
		if(allow_user_to_sfmc_mapping){
			$('#element_sfmc_map_rules').show();
		}
		$('#element_field_style').show();
		$('#drop_down_custom_style').hide();
		$('#element_sub_labels_style').hide();
		$('#element_field_description').hide();
		$('#element_boolean_field_description').hide();
		$('#element_boolean_mode').hide();
		$('#element_boolean_default_value').hide();
		$('#drop_down_custom_style').css('padding-bottom', '0');
		$('#element_choices_style').hide();
		$('#element_choices_display').hide();
		$('#element_choices_survey_style').hide();
		$('#choices-hint-left').hide();
		$('#choices-hint-right').hide();
		$('#element_sort_alphabetic').hide();
		$slide.find('#element_badge_type').hide();
		$slide.find('#element_barcode_provider_types').hide();
		$slide.find('#element_barcode_type').hide();
		$slide.find('#insert_badge_elements_div').hide();
		$slide.find('#element_nfc_provider_types').hide();
		$slide.find('#element_id_provider_types').hide();
		$slide.find('#element_age_verification').hide();
		$slide.find('#element_accept_invalid_barcode').hide();
		$slide.find('#element_post_show_reconciliation').hide();
		$slide.find('#element_forward_submission_to_portal').hide();
		ll_combo_manager.set_selected_value('#document_set', 0);
		$slide.find('#container_element_required').show();
		$slide.find('#element_audio_transcription').hide();
		$slide.find('#element_audio_transcription_type').hide();
		$('#element_lable_style_position').show();
		ll_combo_manager.remove_option('.fb-label-pos', "2");
		ll_combo_manager.add_option('.fb-label-pos', "2", "Inside");
		ll_combo_manager.refresh('.fb-label-pos');
		$('#element_ll_single_field_process_type_container').hide();
		if(is_device_form){
			// $slide.find('#rule_activations').show();
			$slide.find('#display_setting').show();
		}
		var datatype_aliases = formBuilderpage.get_datatype_aliases_array_for_field(type);
		$('.fb-settings #element_field_label .fb-wrap-tooltip .fb-tooltip').text('Field Label is one or two words placed directly above the field.');
		switch(type){
			case 'text':
				if(sub_type == 'company'){
					$slide.find('#element_name').text('Company');
				} else if(sub_type == 'job_title') {
					$slide.find('#element_name').text('Job Title');
				} else {
					$slide.find('#element_name').text('Single Line Text');
				}
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_default_value').show();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'number':
				$slide.find('#element_name').text('Number');
				if(!is_device_form){$slide.find('#element_field_size').show()}
				$slide.find('#element_default_value').show();
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'paragraph':
				$slide.find('#element_name').text('Paragraph Text');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_default_value').show();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'checkboxes':
				$slide.find('#element_name').text('Checkboxes');
				$slide.find('#element_choices,#element_choices_data_source').show();
				if(! is_device_form) {
					$slide.find('#element_field_items_direction').show();
					$slide.find('#element_sort_alphabetic').show();
				}
				if(is_device_form){
					$slide.find('#element_field_items_direction label#title').text('Field Items Display');
					$slide.find('#element_field_items_direction span#horizontal_title').text('Compact');
					$('#field_style_tab').show();
					$('.options-style').show();
				}
				$('#element_choices_style').show();

				if (typeof opt.display != 'undefined'){
					$('#element_choices_display').show();
				}
				
				ll_combo_manager.remove_option('.fb-label-pos', "2");
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				$('#element_field_style').hide();
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'multiple_choices':
				$slide.find('#element_choices').show();
				if(opt.defaultIdentifier == 'Amount_Question'){
					$slide.find('#element_choices').hide();
					$slide.find('#element_name').text('Amount');
					$slide.find('#amount_title').show();
					if(is_recurring && formType == 'payment'){
						if(typeof optGlobal.recurring_frequency != 'undefined' && optGlobal.recurring_frequency){
							ll_combo_manager.set_selected_value('#payment_recurring select', optGlobal.recurring_frequency);
						}
						if(typeof optGlobal.recurring_frequency_title != 'undefined' && optGlobal.recurring_frequency_title){
							$('input[name="recurring_frequency_title"]').val(optGlobal.recurring_frequency_title);
						}
					}
					if(typeof opt.amount_title != 'undefined' && opt.amount_title){
						$('input[name="amount_title"]').val(opt.amount_title);
					}
				}else{
					$slide.find('#element_name').text('Radio Buttons');
				}
				$slide.find('#element_choices_data_source').show();
				if(formType != 'donation'){
					if(! allow_user_to_sfmc_mapping){
						$('#element_common_map_rules').css('padding-bottom', '200px');
					} else {
						$('#element_sfmc_map_rules').css('padding-bottom', '200px');
					}
				}else{
					$slide.find('#element_common_map_rules').hide();
					$slide.find('#element_rules').hide();
				}
				if(! is_device_form) {
					$slide.find('#element_randomize').show();
					$slide.find('#element_field_items_direction').show();
					$slide.find('#element_sort_alphabetic').show();
				}
				if(is_device_form){
					$slide.find('#element_field_items_direction label#title').text('Field Items Display');
					$slide.find('#element_field_items_direction span#horizontal_title').text('Compact');
					$('#field_style_tab').show();
					$('.options-style').show();
					$('.options-style-vertical-alignment').hide();
				}
				$('#element_choices_style').show();

				if (typeof opt.display != 'undefined'){
					$('#element_choices_display').show();
					$slide.find('.fb-choise-hint-left-text').val(opt.choicesHintLeft);
					$slide.find('.fb-choise-hint-right-text').val(opt.choicesHintRight);
				}

				ll_combo_manager.remove_option('.fb-label-pos',"2");
				$('#element_field_style').hide();
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'drop_down':
				$slide.find('#element_name').text('Drop Down');
				$slide.find('#element_choices,#element_choices_data_source').show();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				$('#drop_down_custom_style').show();
				$('#element_field_style').hide();
				if(! is_device_form){
					$slide.find('#element_field_size').show();
					$slide.find('#element_sort_alphabetic').show();
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'documents':
				$('.fb-settings #element_field_label .fb-wrap-tooltip .fb-tooltip').text("This label will not be used in the lead capture form on your mobile device. It's intended to be used in the form builder to help you separate multiple Document Groups.");
				$slide.find('#element_name').text('Documents');
				$slide.find('#element_documents_sets').show();
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_common_map_rules').hide();
				if(typeof opt.ll_documents_set_id != 'undefined' && opt.ll_documents_set_id > 0){
					ll_combo_manager.set_selected_value('#document_set', opt.ll_documents_set_id );
					// when delete document_set there will be an old opt.ll_documents_set_id
					opt.ll_documents_set_id = ll_combo_manager.get_selected_value('#document_set');
					if(opt.ll_documents_set_id) {
						$slide.find('#edit_element_documents_choices,#FA_actions_element_documents_choices').show();
					}
				}
				$('#field_style_tab').show();
				$('.use-theme-style').show();
				if(! is_device_form){
					$('.use-theme-style').hide();
					$('#element_field_style').hide();
					$('#element_choices_style').show();
				}
				$('#label-visibility').hide();
				break;
			case 'activation':
				$slide.find('#element_name').text('Activation');
				$slide.find('#element_activation').show();
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_common_map_rules').hide();
				if(typeof opt.ll_activation_id != 'undefined' && opt.ll_activation_id > 0){
					ll_combo_manager.set_selected_value('#ll_activation_id', opt.ll_activation_id );
					// when delete ll_activation_id there will be an old opt.ll_activation_id
					opt.ll_activation_id = ll_combo_manager.get_selected_value('#ll_activation_id');
				}
				$('#field_style_tab').show();
				$('.use-theme-style').show();
				$('#display_setting').hide();
				$('#label-visibility').hide();
				$('#rule_retry_playing').show();
				break;
			case 'column_separator':
				$slide.find('#element_name').text('Column Separator');
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#container_element_required').hide();
				$slide.find('#element_visible').hide();
				$slide.find('#element_rules').hide();
				break;
			case 'section_block':
				$slide.find('#element_name').text('Section');
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#container_element_required').hide();
				$slide.find('#element_collapse_content').show();
				$slide.find('#element_identifier').hide();
				if(typeof opt.labelAlign != 'undefined' && opt.labelAlign){
					$slide.find('.fb-label-align option[value="' + opt.labelAlign + '"]').attr("selected", true);
					$slide.find(".fb-label-align").trigger("liszt:updated");
				}
				$('#field_style_tab').show();
				$('.use-theme-style').show();
				break;
			case 'name':
				$slide.find('#element_name').text('Name');
				$slide.find('#element_name_field_hint').show();
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_name_map_rules').show();
				if(allow_user_to_sfmc_mapping){
					$slide.find('#element_name_sfmc_map_rules').show();
				}
				$('#element_sub_labels_style').show();
				$('#element_name_map_rules').css('padding-bottom', '50px');
				formBuilderpage.fill_mapping_rules_fields('#element_name_map_rules select#first_name_mapping_field', datatype_aliases, element_id, 'fname');
				formBuilderpage.fill_mapping_rules_fields('#element_name_map_rules select#last_name_mapping_field', datatype_aliases, element_id, 'lname');
				break;
			case 'date':
				$slide.find('#element_name').text('Date');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'datetime':
				$slide.find('#element_name').text('Datetime');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'time':
				$slide.find('#element_name').text('Time');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'phone':
				$slide.find('#element_name').text('Phone');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_phone_format').show();
				$slide.find('#element_default_value').show();
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				if(is_device_form){
					//ll_combo_manager.set_selected_value('#phone_format', 'international');
					$slide.find('#element_phone_format').hide();
				} else {
					ll_combo_manager.set_selected_value('#phone_format', 'formatted');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'address':
				$slide.find('#element_name').text('Address');
				$slide.find('#element_address_field_hint').show();
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_default_country').show();
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$('#element_sub_labels_style').show();
				$slide.find('#element_address_map_rules').show();
				$('#element_address_map_rules').css('padding-bottom', '50px');
				$('#drop_down_custom_style').show();
				$('#drop_down_custom_style').css('padding-bottom', '50px');
				if(allow_user_to_sfmc_mapping){
					$slide.find('#element_address_sfmc_map_rules').show();
				}
				formBuilderpage.fill_mapping_rules_fields('#element_address_map_rules select#address1_mapping_field', datatype_aliases, element_id);
				formBuilderpage.fill_mapping_rules_fields('#element_address_map_rules select#address2_mapping_field', datatype_aliases, element_id);
				formBuilderpage.fill_mapping_rules_fields('#element_address_map_rules select#city_mapping_field', datatype_aliases, element_id);
				formBuilderpage.fill_mapping_rules_fields('#element_address_map_rules select#state_mapping_field', datatype_aliases, element_id);
				formBuilderpage.fill_mapping_rules_fields('#element_address_map_rules select#zipcode_mapping_field', datatype_aliases, element_id);
				formBuilderpage.fill_mapping_rules_fields('#element_address_map_rules select#country_mapping_field', datatype_aliases, element_id);
				break;
			case 'website':
				$slide.find('#element_name').text('Web Site');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_default_value').show();
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'price':
				$slide.find('#element_name').text('Price');
				$slide.find('#element_currency_format').show();
				$('#element_sub_labels_style').show();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'email':
				$slide.find('#element_name').text('Email');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_default_value').show();
				if(typeof opt.labelPos != 'undefined'){
					if(opt.labelPos != 2){
						$slide.find('#element_field_placeholder').show();
					}
				} else {
					$slide.find('#element_field_placeholder').show();
				}
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'file_upload':
				$slide.find('#element_name').text('File Upload');
				$slide.find('#element_field_description').show();
				$('.element_load_from_url').hide();
				$('#element_field_style').hide();
				$('#element_lable_style_position').hide();
				$('#element_required_field_hint_style').hide();
				$slide.find('#element_invalid_file_error_message').show();
				$slide.find('#element_common_map_rules').hide();
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'section_break':
				$slide.find('#element_name').text('Custom Content');
				$slide.find('#element_rules').hide();
				$slide.find('#element_field_error_message').hide();
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$('#element_field_style').hide();
				$('#section_break_content').show();
				if(is_device_form){
					$('#element_collapse_content').show();
				}
				break;
			case 'page_break':
				$slide.find('#element_name').text('Page Break');
				$slide.find('#element_rules').hide();
				$slide.find('#element_field_error_message').hide();
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$('#element_field_style').hide();
				break;
			case 'calculated':
				$slide.find('#element_name').text('Calculated');
				if(!is_device_form){$slide.find('#element_field_size').show();}
				$slide.find('#element_default_value').show();
				$slide.find('#element_expression').show();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '200px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '200px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'credit_card':
				$slide.find('#element_name').text('Credit Card');
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_rules').hide();
				$slide.find('#element_field_size').show();
				$('#element_sub_labels_style').show();
				break;
			case 'recurring':
				$slide.find('#element_name').text('Recurring');
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_rules').hide();
				break;
			case 'image':
				$slide.find('#element_name').text('Image Capture');
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'signature':
				$slide.find('#element_name').text('Signature');
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'business_card':
				$slide.find('#element_name').text('Business Card');
				$slide.find('#element_common_map_rules').hide();
				$slide.find('#element_sfmc_map_rules').hide();
				$slide.find('#element_identifier').hide();
				//$slide.find('#element_visible').hide();
				$slide.find('#element_field_error_message').hide();
				$slide.find('#business_card_element_options').show();
				$slide.find('#rule_donot_prefill').hide();
				$slide.find('#rule_hidden').hide();
				
				if(typeof opt.is_scan_cards_and_prefill_form != 'undefined'){
					if(opt.is_scan_cards_and_prefill_form == 1){
						ll_theme_manager.checkboxRadioButtons.check($('input[name="is_scan_cards_and_prefill_form"]'), true);
					}else{
						ll_theme_manager.checkboxRadioButtons.check($('input[name="is_scan_cards_and_prefill_form"]'), false);
					}
				}
				
				if(typeof opt.is_enable_transcription != 'undefined'){
					if(opt.is_enable_transcription == 1){
						ll_theme_manager.checkboxRadioButtons.check($('input[name="is_enable_transcription"]'), true);
						$('#transcription_options,#transcription_notes').show();
						// ll_theme_manager.checkboxRadioButtons.check('input[name="field_is_activation"]', false);
						// $('#rule_activations').hide();
						ll_theme_manager.checkboxRadioButtons.check('input[name="display_mode"][value=0]', true);
						$('#display_setting').hide();
					}else{
						ll_theme_manager.checkboxRadioButtons.check($('input[name="is_enable_transcription"]'), false);
						$('#transcription_options,#expedited_transcription_options,#transcription_notes').hide();
						//ll_theme_manager.checkboxRadioButtons.check('input[name="field_is_activation"]', true);
						// $('#rule_activations').show();
						$('#display_setting').show();
					}
				}
				
				if(typeof opt.transcription_type != 'undefined'){
					if(opt.transcription_type == 1 || opt.transcription_type == 2 || opt.transcription_type == 3 || opt.transcription_type == 4){
						ll_theme_manager.checkboxRadioButtons.check($('input[name="transcription_type"][value="' + opt.transcription_type + '"]'), true);
						if(typeof opt.is_enable_transcription != 'undefined' && opt.is_enable_transcription == 1 && opt.transcription_type == LL_BUSINESS_CARDS_REQUEST_TYPE_EXPEDITED){
							$('#expedited_transcription_options').show();
						} else {
							$('#expedited_transcription_options').hide();
						}
					}
				}
				/*if(typeof opt.transcription_notes != 'undefined'){
				 tinyMCE.get('transcription-notes-editor').setContent(opt.transcription_notes);
				 }*/
				
				if(typeof opt.transcription_expedited_localization != 'undefined'){
					ll_combo_manager.set_selected_value('select[name="transcription_expedited_localization"]', opt.transcription_expedited_localization);
					
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'barcode':
				$slide.find('#element_name').text('Scanner');
				$slide.find('#element_badge_type').show();
				if(typeof opt.badge_type != 'undefined'){
					ll_combo_manager.set_selected_value('select[name="badge_type"]', opt.badge_type);
					if(opt.badge_type == BADGE_TYPE_BARCODE){
						$('#element_barcode_provider_types').show();
						$('#element_barcode_type').show();
						$('#insert_badge_elements_div').show();
					} else if(opt.badge_type == BADGE_TYPE_NFC){
						$('#element_nfc_provider_types').show();
						$('#insert_badge_elements_div').show();
					} else if(opt.badge_type == BADGE_TYPE_ID){
						$('#element_id_provider_types').show();
						$('#element_age_verification').show();
						$('#element_barcode_type').show();
						$('#insert_badge_elements_div').show();
						ll_combo_manager.set_selected_value('select[name="barcode_type"]', 'PDF_417');
					}
				} else {
					$('#element_barcode_provider_types').show();
					$('#element_barcode_type').show();
					$('#insert_badge_elements_div').show();
				}
				$slide.find('#container_element_required').hide();
				$slide.find('#element_accept_invalid_barcode').show();
				$slide.find('#element_post_show_reconciliation').show();
				$slide.find('#element_forward_submission_to_portal').show();
				$slide.find('#element_is_edit_duplicates_after_scan').show();
				if(typeof opt.barcode_provider_type_id != 'undefined' && opt.barcode_provider_type_id){
					if(typeof opt.badge_type == 'undefined' || opt.badge_type == BADGE_TYPE_BARCODE){
						ll_combo_manager.set_selected_value('select[name="barcode_provider_types"]', opt.barcode_provider_type_id);
						ll_combo_manager.trigger_event_on_change('select[name="barcode_provider_types"]');
					} else if (opt.badge_type == BADGE_TYPE_NFC){
						ll_combo_manager.set_selected_value('select[name="nfc_provider_types"]', opt.barcode_provider_type_id);
						ll_combo_manager.trigger_event_on_change('select[name="nfc_provider_types"]');
					} else if (opt.badge_type == BADGE_TYPE_ID){
						ll_combo_manager.set_selected_value('select[name="id_provider_types"]', opt.barcode_provider_type_id);
						ll_combo_manager.trigger_event_on_change('select[name="id_provider_types"]');
					}
				}
				if(typeof opt.barcode_type != 'undefined' && opt.barcode_type){
					ll_combo_manager.set_selected_value('select[name="barcode_type"]', opt.barcode_type);
				}
				if(typeof opt.is_enable_age_verification != 'undefined' && opt.is_enable_age_verification){
					ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_age_verification"]', true);
				}
				if(typeof opt.is_enable_under_age_verification != 'undefined' && opt.is_enable_under_age_verification){
					ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_under_age_verification"]', true);
				}
				if(typeof opt.is_enable_over_age_verification != 'undefined' && opt.is_enable_over_age_verification){
					ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_over_age_verification"]', true);
				}
				`if(typeof opt.is_enable_age_range_verification != 'undefined' && opt.is_enable_age_range_verification){
					ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_age_range_verification"]', true);
				}`;
				if(typeof opt.is_show_option_to_proceed != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('input[name="is_show_option_to_proceed"]', opt.is_show_option_to_proceed);
				}
				if(typeof opt.accept_invalid_barcode != 'undefined' && opt.accept_invalid_barcode == 1){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="accept_invalid_barcode"]'), true);
				}else{
					ll_theme_manager.checkboxRadioButtons.check($('input[name="accept_invalid_barcode"]'), false);
				}
				if(typeof opt.post_show_reconciliation != 'undefined' && opt.post_show_reconciliation == 1){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="post_show_reconciliation"]'), true);
					// $slide.find('#rule_activations').hide();
					$slide.find('#display_setting').hide();
				}else{
					ll_theme_manager.checkboxRadioButtons.check($('input[name="post_show_reconciliation"]'), false);
					// $slide.find('#rule_activations').show();
					$slide.find('#display_setting').show();
				}
				
				if(typeof opt.forward_submission_to_portal != 'undefined' && opt.forward_submission_to_portal == 1){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="forward_submission_to_portal"]'), true);
				}else{
					ll_theme_manager.checkboxRadioButtons.check($('input[name="forward_submission_to_portal"]'), false);
				}
				
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				$('#field_style_tab').show();
				$('.use-theme-style').show();
				break;
			case 'boolean':
				$slide.find('#element_name').text('Boolean');
				$slide.find('#element_boolean_field_description').show();
				$slide.find('#element_boolean_mode').show();
				$slide.find('#element_boolean_default_value').show();
				if(! allow_user_to_sfmc_mapping){
					$('#element_common_map_rules').css('padding-bottom', '100px');
				} else {
					$('#element_sfmc_map_rules').css('padding-bottom', '100px');
				}
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
			case 'audio':
				$slide.find('#element_name').text('Audio Recorder');
				$slide.find('#element_audio_transcription').show();
				//$slide.find('#element_audio_transcription_type').show();
				if(typeof opt.enable_audio_transcription != 'undefined'){
					
					if(opt.enable_audio_transcription == 1){
						ll_theme_manager.checkboxRadioButtons.check($('input[name="enable_audio_transcription"]'), true);
						$('.element_audio_transcription_options').show();
						if(parseInt(AUDIO_PREMIUM_TRANSCRIPTION_PERMISSION)){
							$('#element_audio_transcription_type').show();
						}
						ll_combo_manager.set_selected_value('#audio_transcription_update_field', '');
						if(opt.audio_transcription_update_field){
							ll_combo_manager.set_selected_value('#audio_transcription_update_field', opt.audio_transcription_update_field);
							$('#audio_transcription_update_field_process_type').show();
						}
					} else {
						ll_theme_manager.checkboxRadioButtons.check($('input[name="enable_audio_transcription"]'), false);
						$('#element_audio_transcription_type, .element_audio_transcription_options, #audio_transcription_update_field_process_type').hide();
					}
					// console.log(opt.audio_transcription_update_field_process_type);
					if(typeof opt.audio_transcription_update_field_process_type != 'undefined'){
						ll_theme_manager.checkboxRadioButtons.check($('input[name="update_field_process_type"][value="' + opt.audio_transcription_update_field_process_type + '"]'), true);
					}
				}
				if(typeof opt.audio_transcription_type != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="audio_transcription_type"][value="' + opt.audio_transcription_type + '"]'), true);
				}
				
				formBuilderpage.fill_mapping_rules_fields('#element_common_map_rules select', datatype_aliases, element_id, '');
				break;
		}
		if(is_device_form){
			$slide.find('#rule_donot_prefill').hide();
		}
		if (type == 0){
			$('#fb-tabs-settings li').eq(1).trigger('click');
			$('#fb-form-title').val($.trim( $('.info-form .form-tit').text() ));
			$('#fb-form-description').val($.trim( $('.info-form .form-desc').text() ));
		} else {
			$slide.find('.fb-label-text').val(opt.labelText);

			if(typeof opt.labelIsVisible != 'undefined'){
				ll_theme_manager.checkboxRadioButtons.check('.is-label-visible', opt.labelIsVisible ? true : false);
			} else {
				ll_theme_manager.checkboxRadioButtons.check('.is-label-visible',true);
			}
			
			$('#element_sfmc_map_rules input[name="sfmc_mapping_field"]').val('');
			if(allow_user_to_sfmc_mapping && typeof opt.sfmc_mapping_field != 'undefined' && opt.sfmc_mapping_field.common){
				$('#element_sfmc_map_rules input[name="sfmc_mapping_field"]').val(opt.sfmc_mapping_field.common);
			}

			$slide.find('#element_field_placeholder').find('input.fb-placeholder-text').val('');
			if(typeof opt.fieldPlaceholder != 'undefined' && opt.fieldPlaceholder){
				$slide.find('#element_field_placeholder').find('input.fb-placeholder-text').val(opt.fieldPlaceholder);
			}
			
			if(typeof opt.is_edit_duplicates_after_scan != 'undefined' && opt.is_edit_duplicates_after_scan == 1){
				ll_theme_manager.checkboxRadioButtons.check($('input[name="is_edit_duplicates_after_scan"]'), true);
			} else {
				ll_theme_manager.checkboxRadioButtons.check($('input[name="is_edit_duplicates_after_scan"]'), false);
			}
			
			if(typeof opt.booleanFieldDescription != 'undefined' && opt.booleanFieldDescription){
				$slide.find('.boolean-field-description').val(opt.booleanFieldDescription);
			}
			
			if(typeof opt.FieldDescription != 'undefined' && opt.FieldDescription){
				$slide.find('.field-description').val(opt.FieldDescription);
			}
			
			if(typeof opt.booleanMode != 'undefined' && opt.booleanMode){
				$slide.find('input[name="boolean_mode"][value="'+opt.booleanMode+'"]').prop('checked', 'checked');
				ll_theme_manager.checkboxRadioButtons.check($('input[name="boolean_mode"][value="'+opt.booleanMode+'"]'), true);
				if(typeof opt.defaultValue != 'undefined'){
					$slide.find('#element_boolean_default_value input[name="default_value"][value="'+opt.defaultValue+'"]').prop('checked', 'checked');
					ll_theme_manager.checkboxRadioButtons.check($('#element_boolean_default_value input[name="default_value"][value="'+opt.defaultValue+'"]'), true);
				}
			}
			
			if(typeof opt.collapse_content != 'undefined'){
				if(opt.collapse_content == 1){
					ll_theme_manager.checkboxRadioButtons.check($('#element_collapse_content input[name="collapse_content"]'), true);
				} else {
					ll_theme_manager.checkboxRadioButtons.check($('#element_collapse_content input[name="collapse_content"]'), false);
				}
			} else {
				if(type == 'section_block'){
					ll_theme_manager.checkboxRadioButtons.check($('#element_collapse_content input[name="collapse_content"]'), true);
				} else {
					ll_theme_manager.checkboxRadioButtons.check($('#element_collapse_content input[name="collapse_content"]'), false);
				}
			}
			
			$('#element_text_color').colpickSetColor('#FFFFFF', true).css('background-color', '#FFFFFF');
			$('#element_background_color').colpickSetColor('#000000', true).css('background-color', '#000000');
			if(typeof opt.no_gocapture_style != 'undefined'){
				if(opt.no_gocapture_style == 1){
					ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style', true);
					$('.element-style').hide();
				} else {
					ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style', false);
					if(typeof opt.element_text_color != 'undefined' && opt.element_text_color != ''){
						$('#element_text_color').colpickSetColor(opt.element_text_color, true).css('background-color', opt.element_text_color);
					}
					if(typeof opt.element_background_color != 'undefined' && opt.element_background_color != ''){
						$('#element_background_color').colpickSetColor(opt.element_background_color, true).css('background-color', opt.element_background_color);
					}
						$('.element-style').show();
					}
			} else {
				ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style', true);
				$('.element-style').hide();
			}
			
			if(typeof opt.barcode_provider_type_id != 'undefined'){
				formBuilderpage.draw_barcode_provider_type_authentication_info(opt.barcode_provider_type_id);
				if(typeof opt.barcode_provider_authentication_info != 'undefined' && Object.keys(opt.barcode_provider_authentication_info).length > 0){
					for(var i in opt.barcode_provider_authentication_info){
						$('input[name="'+i+'"]').val(opt.barcode_provider_authentication_info[i]);
						ll_combo_manager.set_selected_value('.element_barcode_provider_type_authentication_info select[name="'+i+'"]', opt.barcode_provider_authentication_info[i]);
					}
				}
			}
			
			if(typeof opt.overrideIfEmpty != 'undefined' && opt.overrideIfEmpty){
				ll_theme_manager.checkboxRadioButtons.check($('#element_override_if_empty input[name="override_if_empty"]'), true);
			}else{
				ll_theme_manager.checkboxRadioButtons.check($('#element_override_if_empty input[name="override_if_empty"]'), false);
			}
			
			if(typeof opt.dataProcessType != 'undefined' && opt.dataProcessType){
				ll_theme_manager.checkboxRadioButtons.check($('#element_process_data_type input[name="process_data_type"][value="'+opt.dataProcessType+'"]'), true);
			} else {
				if(datatype_aliases && datatype_aliases.length > 0){
					for(var i in datatype_aliases){
						var datatype_alias = datatype_aliases[i];
						if(datatype_alias == 'text'){
							if(typeof opt.overrideIfEmpty != 'undefined' && opt.overrideIfEmpty){
								ll_theme_manager.checkboxRadioButtons.check($('#element_process_data_type input[name="process_data_type"][value="'+DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY+'"]'), true);
							} else {
								ll_theme_manager.checkboxRadioButtons.check($('#element_process_data_type input[name="process_data_type"][value="'+DATA_PROCESS_TYPE_OVERRIDE+'"]'), true);
							}
							break;
						}
					}
				}
			}
			
			if(typeof opt.isSortAlphabetically != 'undefined' && opt.isSortAlphabetically == 1){
				ll_theme_manager.checkboxRadioButtons.check($('#element_sort_alphabetic input[name="is_sort_alphabetically"]'), true);
			}else{
				ll_theme_manager.checkboxRadioButtons.check($('#element_sort_alphabetic input[name="is_sort_alphabetically"]'), false);
			}
			
			ll_combo_manager.set_selected_value('select[name="sort_order"]', 'asc');
			if(typeof opt.sortAlphabeticOrderDirection != 'undefined' && opt.sortAlphabeticOrderDirection){
				ll_combo_manager.set_selected_value('select[name="sort_order"]', opt.sortAlphabeticOrderDirection);
			}
			
			$slide.find('.fb-label-font option[value="'+opt.labelFont+'"]').attr('selected', true);
			$slide.find(".fb-label-font").trigger('liszt:updated');
			$slide.find('.fb-label-size option[value="'+opt.labelSize+'"]').attr('selected', true);
			$slide.find(".fb-label-size").trigger('liszt:updated');
			
			if(opt.subLabelFont != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-sub-label-font', opt.subLabelFont);
			}
			
			if(opt.subLabelSize != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-sub-label-size', opt.subLabelSize);
			}
			
			if(typeof opt.choicesSize != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-choice-size', opt.choicesSize);
			}
			
			if(typeof opt.choicesFont != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-choice-font', opt.choicesFont);
			}

			if(typeof opt.choicesHintLeftSize != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-choice-hint-left-size', opt.choicesHintLeftSize);
			}
			
			if(typeof opt.choicesHintLeftFont != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-choice-hint-left-font', opt.choicesHintLeftFont);
			}

			if(typeof opt.choicesHintRightSize != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-choice-hint-right-size', opt.choicesHintRightSize);
			}
			
			if(typeof opt.choicesHintRightFont != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-choice-hint-right-font', opt.choicesHintRightFont);
			}
			
			$('input#element_url_parameter').val('');
			if(typeof opt.urlParameter != 'undefined'){
				$('input#element_url_parameter').val(opt.urlParameter);
			}
			
			$('input#element_url_index').val('');
			if(typeof opt.urlIndex != 'undefined'){
				$('input#element_url_index').val(opt.urlIndex);
			}
			
			if (typeof opt.labelColor == 'undefined' || opt.labelColor == 'None'){
				$slide.find('.fb-label-color').colpickSetColor(optGlobal.labelColor, true).css('background-color', optGlobal.labelColor);
			} else {
				$slide.find('.fb-label-color').colpickSetColor(opt.labelColor, true).css('background-color', opt.labelColor);
			}
			
			if(typeof opt.subLabelColor != 'undefined'){
				$slide.find('.fb-sub-label-color').colpickSetColor(opt.subLabelColor, true).css('background-color', opt.subLabelColor);
			}else{
				$slide.find('.fb-sub-label-color').colpickSetColor('#666666', true).css('background-color', '#666666');
			}
			
			if(typeof opt.requiredFieldHintColor != 'undefined'){
				$slide.find('.fb-required-field-hint-color').colpickSetColor(opt.requiredFieldHintColor, true).css('background-color', opt.requiredFieldHintColor);
			}else{
				$slide.find('.fb-required-field-hint-color').colpickSetColor('#968e8e', true).css('background-color', '#968e8e');
			}
			
			if (typeof opt.choicesColor != 'undefined'){
				$slide.find('.fb-choice-color').colpickSetColor(opt.choicesColor, true).css('background-color', opt.choicesColor);
			}

			if (typeof opt.choicesHintLeftColor != 'undefined'){
				$slide.find('.fb-choice-hint-left-color').colpickSetColor(opt.choicesColor, true).css('background-color', opt.choicesHintLeftColor);
			}

			if (typeof opt.choicesHintRightColor != 'undefined'){
				$slide.find('.fb-choice-hint-right-color').colpickSetColor(opt.choicesColor, true).css('background-color', opt.choicesHintRightColor);
			}

			if (typeof opt.choicesBgColor != 'undefined'){
				$slide.find('.fb-choice-survey-bg-color').colpickSetColor(opt.choicesBgColor, true).css('background-color', opt.choicesBgColor);
			}

			if (typeof opt.choicesBorderColor != 'undefined'){
				$slide.find('.fb-choice-survey-border-color').colpickSetColor(opt.choicesBorderColor, true).css('background-color', opt.choicesBorderColor);
			}

			if (typeof opt.choicesSelectedBgColor != 'undefined'){
				$slide.find('.fb-choice-survey-selected-bg-color').colpickSetColor(opt.choicesSelectedBgColor, true).css('background-color', opt.choicesSelectedBgColor);
			}

			if (typeof opt.choicesSelectedBorderColor != 'undefined'){
				$slide.find('.fb-choice-survey-selected-border-color').colpickSetColor(opt.choicesSelectedBorderColor, true).css('background-color', opt.choicesSelectedBorderColor);
			}

			if (typeof opt.choicesSelectedFontColor != 'undefined'){
				$slide.find('.fb-choice-survey-selected-font-color').colpickSetColor(opt.choicesSelectedFontColor, true).css('background-color', opt.choicesSelectedFontColor);
			}
			
			$slide.find('.fb-label-pos option[value="'+opt.labelPos+'"]').attr('selected', true);
			$slide.find(".fb-label-pos").trigger('liszt:updated');
			
			
			if ( opt.labelWidth == "None" ){
				$slide.find('.txt-field-label-width').val(optGlobal.labelWidth);
			} else {
				$slide.find('.txt-field-label-width').val(opt.labelWidth);
			}
			
			if ( opt.labelPos == 1 ){
				$slide.find('.fb-field-label-width').show();
			} else {
				$slide.find('.fb-field-label-width').hide();
			}
			
			if(typeof opt.is_filled_from_barcode != 'undefined' && opt.is_filled_from_barcode == 1){
				ll_theme_manager.checkboxRadioButtons.check($('input[name="is_filled_from_barcode"]'), true);
			}else{
				ll_theme_manager.checkboxRadioButtons.check($('input[name="is_filled_from_barcode"]'), false);
			}
			
			if (type == 'text' || type == 'paragraph' || type == 'name' || type == 'time' || type == 'address' || type == 'price' || type == 'number'  || type == 'drop_down' || type == 'date' || type == 'phone' || type == 'website' || type == 'email'){
				
				if (opt.fieldBackground == 'None'){
					$slide.find('.fb-field-background').colpickSetColor(optGlobal.fieldBackground, true).css('background-color', optGlobal.fieldBackground);
				} else {
					$slide.find('.fb-field-background').colpickSetColor(opt.fieldBackground, true).css('background-color', opt.fieldBackground);
				}
				
				$slide.find('.fb-field-border-type option[value="'+opt.fieldBorderStyle+'"]').attr('selected', true);
				$slide.find(".fb-field-border-type").trigger('liszt:updated');
				
				if (opt.fieldBorderWidth == 'None'){
					$slide.find(".fb-field-border-width").val(optGlobal.fieldBorderWidth);
				} else {
					$slide.find(".fb-field-border-width").val(opt.fieldBorderWidth);
				}
				if (opt.fieldBorderColor == 'None'){
					$slide.find('.fb-field-border-color').colpickSetColor(optGlobal.fieldBorderColor, true).css('background-color', optGlobal.fieldBorderColor);
				} else {
					$slide.find('.fb-field-border-color').colpickSetColor(opt.fieldBorderColor, true).css('background-color', opt.fieldBorderColor);
				}
				
				$slide.find('input[name="field_border_radius"]').val('4');
				if(typeof opt.fieldBorderRadius != 'undefined' && opt.fieldBorderRadius){
					$slide.find('input[name="field_border_radius"]').val(opt.fieldBorderRadius);
				}else if(typeof optGlobal.fieldBorderRadius != 'undefined' && optGlobal.fieldBorderRadius){
					$slide.find('input[name="field_border_radius"]').val(optGlobal.fieldBorderRadius);
				}
				
				$slide.find('.fb-field-font option[value="'+opt.fieldFont+'"]').attr('selected', true);
				$slide.find(".fb-field-font").trigger('liszt:updated');
				
				$slide.find('.fb-field-size option[value="'+opt.fieldSize+'"]').attr('selected', true);
				$slide.find(".fb-field-size").trigger('liszt:updated');
				
				if (opt.fieldColor == 'None'){
					$slide.find('.fb-field-color').colpickSetColor(optGlobal.fieldColor, true).css('background-color', optGlobal.fieldColor);
				} else {
					$slide.find('.fb-field-color').colpickSetColor(opt.fieldColor, true).css('background-color', opt.fieldColor);
				}
			}
			if (type == 'address' || type == 'drop_down'){
				
				if (opt.dropdownBackground == 'None'){
					$slide.find('.fb-dropdown-background').colpickSetColor(optGlobal.dropdownBackground, true).css('background-color', optGlobal.dropdownBackground);
				} else {
					$slide.find('.fb-dropdown-background').colpickSetColor(opt.dropdownBackground, true).css('background-color', opt.dropdownBackground);
				}
				
				if (opt.dropdownBorderColor == 'None'){
					$slide.find('.fb-dropdown-border-color').colpickSetColor(optGlobal.dropdownBorderColor, true).css('background-color', optGlobal.dropdownBorderColor);
				} else {
					$slide.find('.fb-dropdown-border-color').colpickSetColor(opt.dropdownBorderColor, true).css('background-color', opt.dropdownBorderColor);
				}
				
				$slide.find('.fb-dropdown-font option[value="'+opt.dropdownFont+'"]').attr('selected', true);
				$slide.find(".fb-dropdown-font").trigger('liszt:updated');
				
				$slide.find('.fb-dropdown-size option[value="'+opt.dropdownSize+'"]').attr('selected', true);
				$slide.find(".fb-dropdown-size").trigger('liszt:updated');
				
				if (opt.dropdownColor == 'None'){
					$slide.find('.fb-dropdown-color').colpickSetColor(optGlobal.dropdownColor, true).css('background-color', optGlobal.dropdownColor);
				} else {
					$slide.find('.fb-dropdown-color').colpickSetColor(opt.dropdownColor, true).css('background-color', opt.dropdownColor);
				}
				
				$slide.find('input[name="dropdown_border_radius"]').val('4');
				if(typeof opt.dropdownBorderRadius != 'undefined' && opt.dropdownBorderRadius){
					$slide.find('input[name="dropdown_border_radius"]').val(opt.dropdownBorderRadius);
				}else if(typeof optGlobal.dropdownBorderRadius != 'undefined' && optGlobal.dropdownBorderRadius){
					$slide.find('input[name="dropdown_border_radius"]').val(optGlobal.dropdownBorderRadius);
				}
				
				ll_combo_manager.set_selected_value('#default_country', opt.defaultValue);
			}
			if (typeof opt.fieldLength != 'undefined'){
				ll_combo_manager.set_selected_value('.fb-field-length', opt.fieldLength);
			}
			if(type != 'name' && type != 'address'){
				if(typeof opt.mappingFieldIds != 'undefined' && opt.mappingFieldIds && typeof opt.mappingFieldIds.common != 'undefined'){
					ll_combo_manager.set_selected_value('#common_mapping_field', opt.mappingFieldIds.common);
					if(typeof opt.llSingleFieldProcessType != 'undefined' && opt.llSingleFieldProcessType){
						$('#element_ll_single_field_process_type_container').show();
						ll_theme_manager.checkboxRadioButtons.check($('input[name="element_ll_single_field_process_type"][value="'+opt.llSingleFieldProcessType+'"]'), true);
						$('#element_common_map_rules').css('padding-bottom', '0px');
						$('#element_sfmc_map_rules').css('padding-bottom', '0px');
					}
				}else{
					ll_combo_manager.set_selected_value('#common_mapping_field', 0);
				}
				formBuilderpage.actions_when_mapping('common');
			}
			if(type == 'phone'){
				if(!$.trim(opt.phoneFormat)){
					if(is_device_form){
						opt.phoneFormat = 'international';
					} else {
						opt.phoneFormat = 'formatted';
					}
				}
				ll_combo_manager.set_selected_value('#phone_format', opt.phoneFormat);
				if(opt.phoneFormat == 'formatted'){
					formBuilderpage.phoneElement($tpl.find('input'));
				} else {
					$('.tpl-block.selected').find('.txt-field').inputmask('remove');
				}
			}
			if(type == 'address'){
				$('#fb-address-street').val(opt.hints.streetAddress1);
				$('#fb-address-street-2').val(opt.hints.streetAddress2);
				$('#fb-address-city').val(opt.hints.city);
				$('#fb-address-state').val(opt.hints.state);
				$('#fb-address-zip').val(opt.hints.zipcode);
				$('#fb-address-country').val(opt.hints.country);
				if(typeof opt.hints.streetAddress1Visible != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('.is-fb-address-street-visible', opt.hints.streetAddress1Visible ? true : false);
				}
				if(typeof opt.hints.streetAddress2Visible != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('.is-fb-address-street-2-visible', opt.hints.streetAddress2Visible ? true : false);
				}
				if(typeof opt.hints.cityVisible != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('.is-fb-address-city-visible', opt.hints.cityVisible ? true : false);
				}
				if(typeof opt.hints.stateVisible != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('.is-fb-address-state-visible', opt.hints.stateVisible ? true : false);
				}
				if(typeof opt.hints.zipcodeVisible != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('.is-fb-address-zip-visible', opt.hints.zipcodeVisible ? true : false);
				}
				if(typeof opt.hints.countryVisible != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check('.is-fb-address-country-visible', opt.hints.countryVisible ? true : false);
				}
				if(typeof opt.mappingFieldIds.address1 != 'undefined'){
					ll_combo_manager.set_selected_value('#address1_mapping_field', opt.mappingFieldIds.address1);
				}
				if(typeof opt.mappingFieldIds.address2 != 'undefined'){
					ll_combo_manager.set_selected_value('#address2_mapping_field', opt.mappingFieldIds.address2);
				}
				if(typeof opt.mappingFieldIds.city != 'undefined'){
					ll_combo_manager.set_selected_value('#city_mapping_field', opt.mappingFieldIds.city);
				}
				if(typeof opt.mappingFieldIds.state != 'undefined'){
					ll_combo_manager.set_selected_value('#state_mapping_field', opt.mappingFieldIds.state);
				}
				if(typeof opt.mappingFieldIds.zipcode != 'undefined'){
					ll_combo_manager.set_selected_value('#zipcode_mapping_field', opt.mappingFieldIds.zipcode);
				}
				if(typeof opt.mappingFieldIds.country != 'undefined'){
					ll_combo_manager.set_selected_value('#country_mapping_field', opt.mappingFieldIds.country);
				}
				formBuilderpage.actions_when_mapping('address');
				if(allow_user_to_sfmc_mapping){
					if(typeof opt.sfmc_mapping_field != 'undefined'){
						if(opt.sfmc_mapping_field.address1){
							$('#element_address_sfmc_map_rules input[name="address1_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.address1);
						}
						if(opt.sfmc_mapping_field.address2){
							$('#element_address_sfmc_map_rules input[name="address2_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.address2);
						}
						if(opt.sfmc_mapping_field.city){
							$('#element_address_sfmc_map_rules input[name="city_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.city);
						}
						if(opt.sfmc_mapping_field.state){
							$('#element_address_sfmc_map_rules input[name="state_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.state);
						}
						if(opt.sfmc_mapping_field.zipcode){
							$('#element_address_sfmc_map_rules input[name="zipcode_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.zipcode);
						}
						if(opt.sfmc_mapping_field.country){
							$('#element_address_sfmc_map_rules input[name="country_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.country);
						}
					}
				}
			}
			if (type == 'name'){
				$('#fb-field-name-first').val(opt.hints.nameFirst);
				$('#fb-field-name-last').val(opt.hints.nameLast);
				if(typeof opt.mappingFieldIds.fname != 'undefined'){
					ll_combo_manager.set_selected_value('#first_name_mapping_field', opt.mappingFieldIds.fname);
				}
				if(typeof opt.mappingFieldIds.lname != 'undefined'){
					ll_combo_manager.set_selected_value('#last_name_mapping_field', opt.mappingFieldIds.lname);
				}
				formBuilderpage.actions_when_mapping('name');
				if(allow_user_to_sfmc_mapping){
					if(typeof opt.sfmc_mapping_field != 'undefined'){
						if(opt.sfmc_mapping_field.first_name){
							$('#element_name_sfmc_map_rules input[name="first_name_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.first_name);
						}
						if(opt.sfmc_mapping_field.last_name){
							$('#element_name_sfmc_map_rules input[name="last_name_sfmc_mapping_field"]').val(opt.sfmc_mapping_field.last_name);
						}
					}
				}
			}
			if (type == 'section_break'){
				$('#fb-html-seaction-break').val( $tpl.find('.fb-html').html() );
			}
			if (type == 'checkboxes' || type == 'multiple_choices'){
				if( opt.fieldItemsDirection == 'vertical'){
					$('.fb-box-number-columns-radio').hide();
				}else if(opt.fieldItemsDirection == 'horizontal') {
					$('.fb-box-number-columns-radio').show();
				}

				if (typeof opt.display != 'undefined'){
					if(opt.display == "classic"){
						$('#element_choices_survey_style').hide();
						$('#choices-hint-left').hide();
						$('#choices-hint-right').hide();
					} else{
						$('#element_choices_survey_style').show();
						$('#choices-hint-left').show();
						$('#choices-hint-right').show();
					}
					ll_theme_manager.checkboxRadioButtons.check($('input[name="choices-display"][value="'+opt.display+'"]'),true);
				}
				
				ll_combo_manager.set_selected_value('.fb-number-columns-choices', opt.numberColumns);
				ll_theme_manager.checkboxRadioButtons.check($('input[name="multiple-direction"][value="'+opt.fieldItemsDirection+'"]'),true);
				if(type == 'multiple_choices'){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="multiple-randomize"][value="'+opt.randomize+'"]'),true);
				}
				ll_theme_manager.checkboxRadioButtons.check($('input[name="options_underline"]'), false);
				ll_theme_manager.checkboxRadioButtons.check($('input[name="options_full_width_text"]'), true);
				ll_theme_manager.checkboxRadioButtons.check($('input[name="options_italicize"]'), false);
				ll_theme_manager.checkboxRadioButtons.check($('input[name="options_vertical_alignment"][value="middle"]'), true);
				ll_theme_manager.checkboxRadioButtons.check($('#options_use_theme_color'), true);
				if(typeof opt.element_text_color != 'undefined' && opt.element_text_color != ''){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="options_use_theme_color"]'), false);
					$('#element_text_color').colpickSetColor(opt.element_text_color, true).css('background-color', opt.element_text_color);
					$('#style_text_color').show();
				} else {
					ll_theme_manager.checkboxRadioButtons.check($('input[name="options_use_theme_color"]'), true);
					$('#style_text_color').hide();
				}
				if(typeof opt.element_underline != 'undefined'){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="options_underline"]'), opt.element_underline);
				}
				if(typeof opt.element_full_width_text != 'undefined' ){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="options_full_width_text"]'), opt.element_full_width_text);
				}
				if(typeof opt.element_italicize != 'undefined' ){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="options_italicize"]'), opt.element_italicize);
				}
				if(typeof opt.element_vertical_alignment != 'undefined' && opt.element_vertical_alignment != ''){
					ll_theme_manager.checkboxRadioButtons.check($('input[name="options_vertical_alignment"][value="'+opt.element_vertical_alignment+'"]'), true);
				}
			}
			
			$slide.find('.fb-field-visible option').eq(opt.visible).attr('selected', true);
			$slide.find(".fb-field-visible").trigger('liszt:updated');
			if (opt.visible == '1'){
				$slide.find('.fb-set-rule-link').show();
			} else {
				$slide.find('.fb-set-rule-link').hide();
			}
			
			$slide.find('.fb-identifier-input').val(opt.identifier);
			
			if ( opt.identifierCustom == '0'){
				$slide.find('.fb-identifier-input').attr('disabled','disabled');
				$('.fb-auto-identifier-section').show();
				$('.fb-custom-identifier-section').hide();
			} else {
				$slide.find('.fb-identifier-input').removeAttr('disabled');
				$('.fb-auto-identifier-section').hide();
				$('.fb-custom-identifier-section').show();
			}
			var field_is_required = false;
			$('#required_field_hint_container').hide();
			$('#element_required_field_hint_style').hide();
			if(opt.isRequired == 1){
				field_is_required = true;
				$('#required_field_hint_container').show();
				$('#element_required_field_hint_style').show();
				if(typeof opt.requiredFieldFont == 'undefined'){
					opt.requiredFieldFont = 'Open Sans';
				}
				if(typeof opt.requiredFieldSize == 'undefined'){
					opt.requiredFieldSize = '14';
				}
				ll_combo_manager.set_selected_value('.fb-required-field-hint-font', opt.requiredFieldFont);
				ll_combo_manager.set_selected_value('.fb-required-field-hint-size', opt.requiredFieldSize);
				$('#required_field_hint_container input[name="required_field_hint"]').val($.trim($('.tpl-block.selected').find('.tpl-block-content label .required_astrisk').html()));
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_required"]'), field_is_required);
			
			var field_is_always_display = false;
			if(opt.isAlwaysDisplay == 1){
				field_is_always_display = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_always_display"]'), field_is_always_display);
			
			var field_is_conditional = false;
			if(opt.isConditional == 1){
				field_is_conditional = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_conditional"]'), field_is_conditional);
			
			var field_is_donot_prefill = false;
			if(opt.isDonotPrefilled == 1){
				field_is_donot_prefill = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_donot_prefill"]'), field_is_donot_prefill);
			
			var field_is_hidden = false;
			if(opt.isHidden == 1){
				field_is_hidden = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_hidden"]'), field_is_hidden);
			
			/*var field_is_activation = false;
			if(opt.isActivation == 1){
				field_is_activation = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_activation"]'), field_is_activation);*/

			var field_display_mode = 0;
			if(typeof opt.displayMode !== 'undefined'){
				field_display_mode = opt.displayMode
			} else if(typeof opt.isActivation !== 'undefined'){
				field_display_mode = opt.isActivation;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="display_mode"][value='+ field_display_mode +']'), true);

			var field_is_translate = true;
			if(opt.isTranslate == 0){
				field_is_translate = false;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="field_is_translate"]'), field_is_translate);

			var retry_playing = false;
			if(opt.isRetryPlaying == 1){
				retry_playing = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="retry_playing"]'), retry_playing);
			
			var has_edit_permission = false;
			if(typeof opt.hasEditPermission == 'undefined' || opt.hasEditPermission == 1){
				has_edit_permission = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="has_edit_permission"]'), has_edit_permission);
			
			var has_delete_permission = false;
			if(typeof opt.hasDeletePermission == 'undefined' || opt.hasDeletePermission == 1){
				has_delete_permission = true;
			}
			ll_theme_manager.checkboxRadioButtons.check($('input[name="has_delete_permission"]'), has_delete_permission);
			
			$('input[name="field_default_value"]').val(opt.defaultValue);
			
			$('input[name="field_error_message"]').val(opt.fieldErrorMessage);
			
			if(typeof opt.invalidFileErrorMessage != 'undefined' && opt.invalidFileErrorMessage){
				$('input[name="invalid_file_error_message"]').val(opt.invalidFileErrorMessage);
			} else {
				$('input[name="invalid_file_error_message"]').val('');
			}
			
			$('input[name="field_css_class"]').val(opt.cssClass);
			$('input[name="container_field_css_class"]').val(opt.containerCssClass);
			
			$('textarea[name="field_guidelines"]').val(opt.guidelines);
			
			if(typeof opt.choices != 'undefined'){
				var _choices_html = '';
				// console.log(opt.choices);
				for (i in opt.choices){
					var choice = choice_value = opt.choices[i].option_name;
					if(typeof opt.choices[i].option_value != 'undefined'){
						choice_value = opt.choices[i].option_value;
					}
					var is_default = opt.choices[i].is_default;
					var star_class_name = 'fb-btn-nonstar';
					var is_custom = 0;
					if(is_default == 1){
						star_class_name = 'fb-btn-star';
					}
					_choices_html += '<div class="t-field">';
					if(formType != 'payment'){
						if(typeof opt.choices[i].is_custom != 'undefined' && opt.choices[i].is_custom){
							choices_html += '<a href="javascript:void(0);" class="fb-btn-move" title="Move"></a> ' +
								'<a href="javascript:void(0);" class="add-custom-amount t-btn-gray" title="Add" style="margin-left: 27px;"></a> '+
								'<a href="javascript:void(0);" class="remove-custom-amount t-btn-gray" title="Remove"></a> ';
						}else{
							_choices_html += '<a href="javascript:void(0);" class="fb-btn-move" title="Move"></a> ' +
								'<a href="javascript:void(0);" class="'+star_class_name+' t-btn-gray" title="Default"></a>' +
								'<a href="javascript:void(0);" class="fb-btn-add t-btn-gray" title="Add"></a> '+
								'<a href="javascript:void(0);" class="fb-btn-remove t-btn-gray" title="Remove"></a> ';
						}
						$('#element_choices .fb-wrap-tooltip').text('Choices');
					}else{
						$('#element_choices .fb-wrap-tooltip').text('Amount');
					}
					_choices_html += '<input ';
					var custom_type = '';
					if(typeof opt.custom_type != 'undefined' && opt.custom_type){
						custom_type = opt.custom_type;
					}
					if(typeof opt.choices[i].is_custom != 'undefined' && opt.choices[i].is_custom){
						is_custom = 1;
						_choices_html += ' data-is-custom="1" ';
					}
					if(custom_type == 'amount' && is_custom == 0){
						var extra_text = '';
						if(typeof opt.choices[i].extra_text != 'undefined' && opt.choices[i].extra_text){
							extra_text = opt.choices[i].extra_text;
						}
						var __value = opt.choices[i].option_name;
						if(typeof opt.choices[i].option_value != 'undefined'){
							__value = opt.choices[i].option_value;
						}
						var __extra = opt.choices[i].option_name;
						if(opt.choices[i].extra_text && opt.choices[i].extra_text != opt.choices[i].option_name){
							__extra = '$' + opt.choices[i].option_name + ' ' + opt.choices[i].extra_text;
						}
						_choices_html += ' placeholder="Amount" class="txt-field choice_value" value="'+__value+'" type="number" min="1"';
						_choices_html += 'style="width: 92px !important;';
						_choices_html += ' margin-right: 7px;"/> <input type="text" placeholder="Title" class="txt-field choice_extra_text" value="'+__extra+'"';
						if(formType != 'payment') {
							_choices_html += ' style="width: 197px;"/>';
						}else{
							_choices_html += ' style="width: 198px;"/>';
						}
					}else if (custom_type == 'amount' && is_custom == 1){
						_choices_html += ' class="txt-field choice_text" last-value="'+choice+'" value="'+choice+'" type="text"/>';
					}else{
						_choices_html += ' placeholder="Label" class="txt-field choice_text" last-value="'+choice+'" value="'+choice+'" type="text"/> <input class="txt-field choice_value" type="text" placeholder="Value" value="'+choice_value+'"/>';
					}
					_choices_html += '</div>';
				}
				$('#element_choices #choices').html(_choices_html);
				if(Object.keys(opt.choices).length == 1){
					$('#element_choices #choices .fb-btn-remove').hide();
				}
				$('#choices').attr('data-src-type', type);
			}
			ll_combo_manager.set_selected_value('.fb-field-data-source','');
			if(typeof opt.choicesDataSource != 'undefined' && opt.choicesDataSource){
				ll_combo_manager.set_selected_value('.fb-field-data-source',opt.choicesDataSource);
			}
			
			if(type == 'price'){
				ll_combo_manager.set_selected_value('#currency_format', opt.currency);
			}
		}
	},
	multipleAction: function(){
		$('#choices').on('click', '.fb-btn-add', function(){
			var value = "Last Option";
			if ( $(this).parents('.fb-rus-competitors').length ){
				value = '';
			}
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var custom_type = '';
			if(typeof opt.custom_type != 'undefined' && opt.custom_type){
				custom_type = opt.custom_type;
				value = '';
			}
			var content = '<div class="t-field">'+
				'<a href="javascript:void(0);" class="fb-btn-move" title="Move"></a> ' +
				'<a href="javascript:void(0);" class="fb-btn-nonstar t-btn-gray" title="Default"></a>' +
				'<a href="javascript:void(0);" class="fb-btn-add t-btn-gray" title="Add"></a> '+
				'<a href="javascript:void(0);" class="fb-btn-remove t-btn-gray" title="Remove"></a> '+
				'<input class="txt-field choice_text" last-value="" ';
			if(custom_type == 'amount'){
				content += ' type="number" min="1" style="width: 92px !important; margin-right: 7px;" placeholder="Amount"/> <input type="text" class="txt-field choice_extra_text" style="width: 197px !important;" placeholder="Title"/>';
			}else{
				content += ' placeholder="Label" type="text"/> <input class="txt-field choice_value" type="text" placeholder="Value"/>';
			}
			content +=    '</div>';
			var $btn = $(this);
			var $box = $btn.parents('#choices');
			var type = formBuilderpage.current_element_type;
			$box.append(content);
			formBuilderpage.isCountMultipleField($box);
			formBuilderpage.addMultipleChoice(type);
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').on('click', '.add-custom-amount', function(){
			if($('#custom_amount').hasClass('hide_custom_amount')){
				$('#custom_amount').show();
				$('#custom_amount').removeClass('hide_custom_amount');
			}
		});
		$('#choices').on('click', '.remove-custom-amount',function(){
			if(!$('#custom_amount').hasClass('hide_custom_amount')){
				$('#custom_amount').hide();
				$('#custom_amount').addClass('hide_custom_amount');
			}
		});
		$('#choices').on('click', '.fb-btn-nonstar', function(){
			var $tpl = $('.tpl-block.selected');
			var element_type = $tpl.data('type-el');
			if(element_type != 'checkboxes'){
				$('#choices .fb-btn-star').each(function(){
					$(this).removeClass('fb-btn-star');
					$(this).addClass('fb-btn-nonstar');
				});
			}
			$(this).addClass('fb-btn-star');
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').on('click', '.fb-btn-star', function(){
			$(this).removeClass('fb-btn-star');
			$(this).addClass('fb-btn-nonstar');
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').on('click', '.fb-btn-remove', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $btn = $(this);
			var $box = $btn.parents('#choices');
			var type = formBuilderpage.current_element_type;
			var index = $box.find('.t-field').index($btn.parent());
			$btn.parent().remove();
			formBuilderpage.isCountMultipleField($box);
			formBuilderpage.removeMultipleChoice(type, index);
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').on('keyup change', '.choice_text', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $input = $(this);
			var val = $input.val();
			var $box = $input.parents('#choices');
			var type = formBuilderpage.current_element_type;
			var index = $box.find('.t-field').index($input.parent());
			if( type == 'drop_down' ){
				if(typeof opt.labelPos != 'undefined' && opt.labelPos == 2){
					index += 1;
				}
			}
			$tpl.find('.t-field').eq(index).show();
			if($(this).attr('last-value') ==  $(this).parent().find('.choice_value').val()){
				$(this).parent().find('.choice_value').val(val);
				$(this).parent().find('.choice_value').trigger ('change');
			}
			$(this).attr('last-value', val);
			formBuilderpage.updateMultipleText($input, type, index, val);
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').on('keyup change', '.choice_value', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $input = $(this);
			var val = $input.val();
			var $box = $input.parents('#choices');
			var type = formBuilderpage.current_element_type;
			var index = $box.find('.t-field').index($input.parent());
			if( type == 'drop_down' ){
				if(typeof opt.labelPos != 'undefined' && opt.labelPos == 2){
					index += 1;
				}
			}
			formBuilderpage.updateMultipleValue($input, type, index, val);
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').on('keyup change', '.choice_extra_text', function(){
			var $tpl = $('.tpl-block.selected');
			var $input = $(this);
			var val = $input.val();
			if(form_type == PAYMENT_HOSTED_WEB_FORM_TYPE){
				$tpl.find('span.amount').text(val);
			}
			var $box = $input.parents('#choices');
			var index = $box.find('.t-field').index($input.parent());
			var type = formBuilderpage.current_element_type;
			formBuilderpage.updateMultipleText($input, type, index, val);
			formBuilderpage.update_choices_json_field();
		});
		$('#choices').sortable({
			handle: ".fb-btn-move",
			start: function(event, ui) {
				ui.item.startPos = ui.item.index();
			},
			stop: function(event, ui) {
				//console.log("Start position: " + ui.item.startPos);
				//console.log("New position: " + ui.item.index());
				formBuilderpage.update_position_choise_field( $(ui.item.parents('.fb-multiple-field')) );
			}
		}).disableSelection();
		$('#ll_popup_add_station .lines').sortable({
			handle: ".fb-btn-move",
			start: function(event, ui) {
				ui.item.startPos = ui.item.index();
			},
			stop: function(event, ui) {
				//console.log("Start position: " + ui.item.startPos);
				//console.log("New position: " + ui.item.index());
				formBuilderpage.update_position_choise_field( $(ui.item.parents('.fb-multiple-field')) );
			}
		}).disableSelection();
		$('.sc-list-image').sortable({
			handle: ".fb-btn-move",
			start: function(event, ui) {
				ui.item.startPos = ui.item.index();
			},
			stop: function(event, ui) {
				formBuilderpage.update_position_choise_field( $(ui.item.parents('.fb-multiple-field')) );
			}
		}).disableSelection();
		$('#buttons-menu-div').sortable({
			handle: ".fb-btn-move",
			start: function(event, ui) {
				ui.item.startPos = ui.item.index();
			},
			stop: function(event, ui) {
				formBuilderpage.update_position_choise_field( $(ui.item.parents('.fb-multiple-field')) );
			}
		}).disableSelection();
		$('#floating-buttons-div').sortable({
			handle: ".fb-btn-move",
			start: function(event, ui) {
				ui.item.startPos = ui.item.index();
			},
			stop: function(event, ui) {
				formBuilderpage.update_position_choise_field( $(ui.item.parents('.fb-multiple-field')) );
			}
		}).disableSelection();
	},
	update_position_choise_field: function($wrap){
		$wrap.find('input').trigger('change');
	},
	update_choices_json_field: function(){
		var choices = {};
		var index = 1;
		$('#element_choices #choices .t-field').each(function(){
			choices[index] = {};
			choices[index]['is_valid'] = 1;
			choices[index]['option_name'] = $(this).find('input.choice_text').val();
			choices[index]['option_value'] = $(this).find('input.choice_value').val() ? $(this).find('input.choice_value').val() : choices[index]['option_name'];
			if($(this).find('.fb-btn-star').length > 0){
				choices[index]['is_default'] = 1;
			}else if($(this).find('.fb-btn-nonstar').length > 0){
				choices[index]['is_default'] = 0;
			}
			choices[index]['option_name'] = $(this).find('input.choice_text').val();
			if($(this).find('input.choice_text').attr('data-is-custom')){
				choices[index]['is_custom'] = 1;
			}
			if($(this).find('input.choice_extra_text').length > 0){
				choices[index]['option_name'] = choices[index]['extra_text'] = $(this).find('input.choice_extra_text').val();
			}
			var type = $('#element_choices #choices').attr('data-src-type');
			switch(type){
				case 'multiple_choices':
					choices[index]['type'] = "radio";
					break;
				case 'checkboxes':
					choices[index]['type'] = "checkbox";
					break;
			}
			choices[index]['token'] = '';
			index++;
		});
		formBuilderpage.change_field_data_json ('choices', '', choices);
	},
	updateMultipleValue: function($input, type, index, val){
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		if( type == 'multiple_choices' ){
			var $box = $tpl.find('.tpl-multiple-choise');
			$box.find('.fb-choice').eq(index).parent().find('input').attr("value", val);
		} else if(  type == 'checkboxes' ){
			var $box = $tpl.find('.tpl-checkboxes');
			$box.find('.fb-choice').eq(index).parent().find('input').attr("value", val);
		} else{
			var $select = $tpl.find('.t-field select');
			$select.find('option').eq(index).attr("value", val);
			$select.trigger('liszt:updated');
		}
	},
	updateMultipleText: function($input, type, index, val){
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		var custom_type = '';
		if(typeof opt.custom_type != 'undefined' && opt.custom_type){
			custom_type = opt.custom_type;
		}
		if( type == 'multiple_choices' ){
			if(custom_type == 'amount' && !$input.attr('data-is-custom')){
				//val = '$' + val;
			}
			var $box = $tpl.find('.tpl-multiple-choise');
			$box.find('.fb-choice').eq(index).text(val);
		} else if(  type == 'checkboxes' ){
			var $box = $tpl.find('.tpl-checkboxes');
			$box.find('.fb-choice').eq(index).text(val);
		} else{
			var $select = $tpl.find('.t-field select');
			$select.find('option').eq(index).text(val);
			$select.trigger('liszt:updated');
		}
	},
	isCountMultipleField: function($box){
		var countField = $box.find('.t-field').find('.fb-btn-remove').length;
		if( countField > 1 ){
			$box.find('.fb-btn-remove, .fb-btn-move').show();
			$box.find('.t-btn-gray:first').css('margin-left', '0');
			$box.find('.t-btn-gray:first').css('margin-right', '3px');
		} else {
			$box.find('.fb-btn-remove, .fb-btn-move').hide();
			$box.find('.t-btn-gray:first').css('margin-left', '27px');
			$box.find('.t-btn-gray:first').css('margin-right', '6px');
		}
	},
	removeMultipleChoice: function(type, index){
		var $tpl = $('.tpl-block.selected');
		if( type == 'multiple_choices' ){
			var $box = $tpl.find('.tpl-multiple-choise');
			$box.find('.t-field').eq(index).remove();
		} else if(  type == 'checkboxes' ){
			var $box = $tpl.find('.tpl-checkboxes');
			$box.find('.t-field').eq(index).remove();
		} else{
			var labelPos = '';
			var opt = $tpl.data('json');
			if (! opt || opt.labelPos == 'None') {
				var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
				optGlobal = $tplGlobal.data('json');
				labelPos = optGlobal.labelPos;
			} else {
				labelPos = opt.labelPos;
			}
			// Increment the index by one so it considers the empty option added to the beginning of the drop down when the label position is inside.
			if (labelPos == "2"){
				index ++;
			}
			
			var $select = $tpl.find('.t-field select');
			$select.find('option').eq(index).remove();
			$select.find('option').eq(0).attr('selected', true);
			$select.trigger('liszt:updated');
		}
	},
	addMultipleChoice: function(type){
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		var custom_type = '';
		if(typeof opt.custom_type != 'undefined'){
			custom_type = opt.custom_type;
		}
		var last_option_name = '';
		var last_option_value = '';
		var last_option_html = formBuilderpage.getMultipleChoice($tpl);
		if( type == 'multiple_choices' ){
			var $box = $tpl.find('.tpl-multiple-choise');
			if(custom_type == 'amount'){
				last_option_name = '$';
				$('<div class="t-field" style="display: none;"><div class="t-radio"><label><i class="icn-radio"></i><input name="radiogroup" type="radio" value="'+last_option_value+'"><span class="fb-choice">'+last_option_name+'</span></label></div></div>').insertBefore($box.find('.t-field input[name="custom_amount"]').parents('.t-field'));
			}else{
				//$box.append('<div class="t-field" style="display: none;"><div class="t-radio"><label><i class="icn-radio"></i><input name="radiogroup" type="radio" value="'+last_option_value+'"><span class="fb-choice">'+last_option_name+'</span></label></div></div>');
				if(last_option_html){
					$box.append(last_option_html);
					$box.find('.t-field:last').hide();
					$box.find('.t-field:last input').val(last_option_value);
					$box.find('.t-field:last input').attr('name','radiogroup');
					$box.find('.t-field:last span').text(last_option_name);
				} else{
					$box.append('<div class="t-field" style="display: none;"><div class="t-radio"><label><i class="icn-radio"></i><input name="radiogroup" type="radio" value="'+last_option_value+'"><span class="fb-choice">'+last_option_name+'</span></label></div></div>');
				}
				
			}
		} else if(  type == 'checkboxes' ){
			var $box = $tpl.find('.tpl-checkboxes');
			//$box.append('<div class="t-field" style="display: none;"><div class="t-checkbox"><label><i class="icn-checkbox"></i><input type="checkbox" value="'+last_option_value+'"><span class="fb-choice">'+last_option_name+'</span></label></div></div>');
			
			if(last_option_html){
				$box.append(last_option_html);
				$box.find('.t-field:last').hide();
				$box.find('.t-field:last input').val(last_option_value);
				$box.find('.t-field:last input').removeAttr('nmae');
				$box.find('.t-field:last span').text(last_option_name);
			}else{
				$box.append('<div class="t-field" style="display: none;"><div class="t-checkbox"><label><i class="icn-checkbox"></i><input type="checkbox" value="'+last_option_value+'"><span class="fb-choice">'+last_option_name+'</span></label></div></div>');
			}
		} else{
			var $select = $tpl.find('.t-field select');
			$select.find('option').eq(0).attr('selected', true);
			$select.append('<option value="'+last_option_value+'">'+last_option_name+'</option>');
			$select.trigger('liszt:updated');
		}
	},
	updateGlobalStyle: function(){
		var $tpl = $('#form-editor .fb-wrap-columns-form');
		var opt = $tpl.data('json');
		var bgColorForm = 'transparent';
		var $checkboxIsTransparentFormBackground = $('#fb-form-background-transparent-global');
		
		if ( opt.isTransparentFormBackground === "1" ){
			bgColorForm = 'transparent';
			$checkboxIsTransparentFormBackground.attr('checked', true);
			ll_theme_manager.checkboxRadioButtons.isChecked($checkboxIsTransparentFormBackground, true);
		} else{
			bgColorForm = opt.formBackground;
			$checkboxIsTransparentFormBackground.attr('checked', false);
			ll_theme_manager.checkboxRadioButtons.isChecked($checkboxIsTransparentFormBackground, false);
		}
		
		$('#ll-form-box').colpickSetColor(opt.formBackground, true).css('background-color', bgColorForm);
		$('#ll-form-box').colpickSetColor(opt.formTextColor, true).css('color', opt.formTextColor);
		
		$('#fb-form-background-global').colpickSetColor(opt.formBackground, true).css('background-color', opt.formBackground);
		$('#fb-form-text-color-global').colpickSetColor(opt.formTextColor, true).css('background-color', opt.formTextColor);
		
		ll_combo_manager.set_selected_value('#fb-field-length-global', opt.fieldLength);
		
		ll_combo_manager.set_selected_value('#fb-label-font-global', opt.labelFont);
		
		ll_combo_manager.set_selected_value('#fb-label-size-global', opt.labelSize);
		
		$('#fb-label-color-global').colpickSetColor(opt.labelColor, true).css('background-color', opt.labelColor);
		
		ll_combo_manager.set_selected_value('#fb-label-pos-global', opt.labelPos);
		
		$('#fb-field-label-width-global').val(opt.labelWidth);
		
		$('#fb-field-background-global').colpickSetColor(opt.fieldBackground, true).css('background-color', opt.fieldBackground);
		
		ll_combo_manager.set_selected_value('#fb-field-background-global', opt.fieldBorderStyle);
		
		ll_combo_manager.set_selected_value('#fb-field-border-type-global', opt.fieldBorderStyle);
		
		$("#fb-field-border-width-global").val(opt.fieldBorderWidth);
		$('#fb-field-border-color-global').colpickSetColor(opt.fieldBorderColor, true).css('background-color', opt.fieldBorderColor);
		
		ll_combo_manager.set_selected_value('#fb-field-font-global', opt.fieldFont);
		
		ll_combo_manager.set_selected_value('#fb-field-size-global', opt.fieldSize);
		$('#fb-field-color-global').colpickSetColor(opt.fieldColor, true).css('background-color', opt.fieldColor);
		
		$('#fb-dropdown-background-global').colpickSetColor(opt.dropdownBackground, true).css('background-color', opt.dropdownBackground);
		$('#fb-dropdown-border-color-global').colpickSetColor(opt.dropdownBorderColor, true).css('background-color', opt.dropdownBorderColor);
		
		ll_combo_manager.set_selected_value('#fb-dropdown-font-global', opt.dropdownFont);
		
		ll_combo_manager.set_selected_value('#fb-dropdown-size-global', opt.dropdownSize);
		
		$('#fb-dropdown-color-global').colpickSetColor(opt.fieldColor, true).css('background-color', opt.dropdownColor);
		
		$('#fb-button-background-global').colpickSetColor(opt.btnBackground, true).css('background-color', opt.btnBackground);
		$('#fb-button-hover-background-global').colpickSetColor(opt.btnHoverBackground, true).css('background-color', opt.btnHoverBackground);
		$('#fb-button-border-type-global option[value="'+opt.btnBorderStyle+'"]').attr('selected', true);
		$("#fb-button-border-type-global").trigger('liszt:updated');
		$("#fb-button-border-width-global").val(opt.btnBoderWidth);
		$('#fb-button-border-color-global').colpickSetColor(opt.btnBorderColor, true).css('background-color', opt.btnBorderColor);
		$('#fb-button-font-global option[value="'+opt.btnFont+'"]').attr('selected', true);
		$("#fb-button-font-global").trigger('liszt:updated');
		$('#fb-button-size-global option[value="'+opt.btnSize+'"]').attr('selected', true);
		$('input[name="button_border_radius"]').val(opt.btnBorderRadius);
		$("#fb-button-size-global").trigger('liszt:updated');
		$('#fb-button-color-global').colpickSetColor(opt.btnColor, true).css('background-color', opt.btnColor);
		$('#btnAlign li').removeClass('selected').eq(opt.btnAlign).addClass('selected');
		$('#fb-button-text, #fb-button-text-2').val($('.form-submit-button').val());
		$('#fb-next-button-text').val($('.fb-next-page-section').text());
		$('#fb-previous-button-text').val($('.fb-prev-page-section').text());
		
		if(typeof opt.titleFont != 'undefined'){
			ll_combo_manager.set_selected_value('#fb-title-font-global', opt.titleFont);
		}
		if(typeof opt.titleSize != 'undefined'){
			ll_combo_manager.set_selected_value('#fb-title-size-global', opt.titleSize);
		}
		if(typeof opt.titleColor != 'undefined'){
			$('#fb-title-color-global').colpickSetColor(opt.titleColor, true).css('background-color', opt.titleColor);
		}
		if(typeof opt.descriptionFont != 'undefined'){
			ll_combo_manager.set_selected_value('#fb-description-font-global', opt.descriptionFont);
		}
		if(typeof opt.descriptionSize != 'undefined'){
			ll_combo_manager.set_selected_value('#fb-description-size-global', opt.descriptionSize);
		}
		if(typeof opt.descriptionColor != 'undefined'){
			$('#fb-description-color-global').colpickSetColor(opt.descriptionColor, true).css('background-color', opt.descriptionColor);
		}
		$('input[name="global_field_border_radius"]').val('4');
		if(typeof opt.fieldBorderRadius != 'undefined'){
			$('input[name="global_field_border_radius"]').val(opt.fieldBorderRadius);
		}
		$('input[name="global_dropdown_border_radius"]').val('4');
		if(typeof opt.dropdownBorderRadius != 'undefined'){
			$('input[name="global_dropdown_border_radius"]').val(opt.dropdownBorderRadius);
		}
	},
	dropDownStyleUpdate: function($block){
		var opt = $block.data('json');
		var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		var	optGlobal = $tplGlobal.data('json');
		
		var dropdownBackground = opt.dropdownBackground;
		var dropdownBorderColor = opt.dropdownBorderColor;
		var dropdownFont = opt.dropdownFont;
		var dropdownSize = opt.dropdownSize;
		var dropdownColor = opt.dropdownColor;
		var dropdownBorderRadius = '4';
		if(typeof opt.dropdownBorderRadius != 'undefined'){
			dropdownBorderRadius = opt.dropdownBorderRadius;
		}
		
		if (opt.dropdownBackground == "None"){
			dropdownBackground = optGlobal.dropdownBackground;
		}
		if (opt.dropdownBorderColor == "None"){
			dropdownBorderColor = optGlobal.dropdownBorderColor;
		}
		if (opt.dropdownFont == "None"){
			dropdownFont = optGlobal.dropdownFont;
		}
		if (opt.dropdownSize == "None"){
			dropdownSize = optGlobal.dropdownSize;
		}
		if (opt.dropdownColor == "None"){
			dropdownColor = optGlobal.dropdownColor;
		}
		if (opt.dropdownBorderRadius == "None" && typeof optGlobal.dropdownBorderRadius != 'undefined'){
			dropdownBorderRadius = optGlobal.dropdownBorderRadius;
		}
		$block.find('.chzn-single').css({
			'background-color': dropdownBackground,
			'border-color': dropdownBorderColor,
			'border-radius': dropdownBorderRadius+'px',
			'-webkit-border-radius': dropdownBorderRadius+'px',
			'-moz-border-radius': dropdownBorderRadius+'px',
			'font-size': dropdownSize + 'px',
			'color': dropdownColor,
			'font-family': dropdownFont
		}).find('div b').css('border-top-color', dropdownColor);
		
		$block.find('.chzn-drop').css({
			'background-color': dropdownBackground,
			'border-color': dropdownBorderColor,
			'font-size': dropdownSize + 'px',
			'color': dropdownColor,
			'font-family': dropdownFont
		}).find('div b').css('border-top-color', dropdownColor);
	},
	labelPosition: function($tpl){
		var opt = $tpl.data('json');
		var type = $tpl.attr('data-type-el');
		var labelText = opt.labelText;
		var fieldPlaceholder = opt.fieldPlaceholder;

		if (opt.labelPos == "None"){
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
			opt = $tplGlobal.data('json');
		}
		if (opt.labelPos != 1){
			$tpl.find('.fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field, .fb-side-label > .tpl-phone').css({
				marginLeft: 0
			});
			$tpl.find('.fb-side-label > label').css({
				width: '100%'
			});
		}
		if (opt.labelPos == 1){
			$tpl.find('.tpl-block-content').removeClass('fb-inside-label').addClass('fb-side-label');
			if ( type == 'text' || type == 'paragraph' || type == 'time' || type == 'number' || type == 'date' || type == 'phone' || type == 'website' || type == 'email'){
				$tpl.find('.txt-field').attr('placeholder', '');
			}
			if (!$tplGlobal){
				if (opt.labelWidth == "None"){
					var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
					opt = $tplGlobal.data('json');
				}
			}
			$tpl.find('.fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field, .fb-side-label > .tpl-phone').css({
				marginLeft: opt.labelWidth + '%'
			});
			$tpl.find('.fb-side-label > label').css({
				width: opt.labelWidth + '%'
			});
		} else if (opt.labelPos == 2){
			$tpl.find('.tpl-block-content').removeClass('fb-side-label').addClass('fb-inside-label');
			if ( type == 'text' || type == 'paragraph' || type == 'time' || type == 'number' || type == 'date' || type == 'phone' || type == 'website' || type == 'email' || type == 'boolean' ){
				$tpl.find('.txt-field').attr('placeholder', labelText);
			}
			if ( type == 'name' || type == 'address' || type == 'price' ){
				$tpl.find('.txt-field').each(function(){
					var $el = $(this);
					var $label = $el.parents('.t-field:first').find('.label-top');
					$el.attr('placeholder', $label.text());
					$label.hide();
				});
			}
			if ( type == 'address' || type == 'drop_down'){
				var $select = $tpl.find('select');
				var $label = $select.prev('.label-top');
				var labelTextDropdown = '';
				
				$select.removeClass('chzn-done').removeAttr('id').next().remove();
				var cssText = $select.attr('style');
				var font_family = $select.css('font-family');
				
				if ( type == 'address' ){
					labelTextDropdown = $label.text();
					$select.replaceWith('<select class="fb-select-address-country" style="'+cssText+'">' + $select.html() + '</select>');
				} else {
					labelTextDropdown = labelText;
					$select.replaceWith('<select style="'+cssText+'">' + $select.html() + '</select>');
					
				}
				$select = $tpl.find('select');
				$select.attr('data-placeholder', labelTextDropdown);
				$select.css('font-family', font_family);
				$select.prepend($('<option value="0" selected="selected" class="fb-placeholder-option"></option>'));
				
				ll_combo_manager.make_combo($select);
				formBuilderpage.dropDownStyleUpdate($tpl);
				$label.hide();
			}
			
		} else if (opt.labelPos == 0){
			if(opt.labelText){
				$tpl.find('.tpl-block-content').children('label').show();
			}
			$tpl.find('.tpl-block-content').removeClass('fb-side-label fb-inside-label');
			if ( type == 'text' || type == 'paragraph' || type == 'time' || type == 'number' || type == 'date' || type == 'phone' || type == 'website' || type == 'email' ){
				$tpl.find('.txt-field').attr('placeholder', '');
			}
		}else{
			if(opt.labelText){
				$tpl.find('.tpl-block-content').children('label').show();
			}
		}
		
		if (opt.labelPos != 2){
			if ( type == 'name' || type == 'address' || type == 'price' ){
				$tpl.find('.txt-field').each(function(){
					var $el = $(this);
					var $label = $el.parents('.t-field:first').find('.label-top');
					$el.attr('placeholder', '');
					$label.show();
				});
			}
			if ( type == 'address' || type == 'drop_down'){
				
				var $select = $tpl.find('select');
				var $label = $select.prev('.label-top');
				$select.find('option.fb-placeholder-option').remove();
				$select.removeClass('chzn-done').removeAttr('id').next().remove();
				ll_combo_manager.make_combo($select);
				formBuilderpage.dropDownStyleUpdate($tpl);
				$label.show();
			}
			if(typeof fieldPlaceholder != 'undefined' && fieldPlaceholder){
				$tpl.find('.txt-field').attr('placeholder', fieldPlaceholder);
			}
		}
	},
	fieldSize: function($tpl){
		var type = $tpl.attr('data-type-el');
		
		if (type == 'text' || type == 'paragraph' || type == 'name' || type == 'time' || type == 'address' || type == 'price' || type == 'number' || type == 'drop_down' || type == 'phone' || type == 'website' || type == 'email' || type == 'calculated' || type == 'date' || type == 'credit_card' || type == 'recurring' || type == 'datetime'){
			
			var opt = $tpl.data('json');
			
			if (opt.fieldLength == 'None'){
				var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
				opt = $tplGlobal.data('json');
			}
			
			if ( type == 'address' || type == 'name' || type == 'price'){
				if ( opt.fieldLength == 'small' ){
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').removeClass('size-medium');
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').removeClass('size-large');
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').addClass('size-small');
				} else if ( opt.fieldLength == 'medium' ){
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').removeClass('size-small');
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').removeClass('size-large');
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').addClass('size-medium');
				} else if ( opt.fieldLength == 'large' ){
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').removeClass('size-small');
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').removeClass('size-medium');
					$tpl.find('.tpl-address, .tpl-name, .tpl-price').children('.t-field, .f-line-field').addClass('size-large');
				}
			} else {
				$tpl.find('.resizable-field').css({
					width: ''
				});
				if ( opt.fieldLength == 'small' ){
					$tpl.find('.resizable-field').removeClass('size-medium');
					$tpl.find('.resizable-field').removeClass('size-large');
					$tpl.find('.resizable-field').addClass('size-small');
				} else if ( opt.fieldLength == 'medium' ){
					$tpl.find('.resizable-field').removeClass('size-small');
					$tpl.find('.resizable-field').removeClass('size-large');
					$tpl.find('.resizable-field').addClass('size-medium');
				} else if ( opt.fieldLength == 'large' ){
					$tpl.find('.resizable-field').removeClass('size-small');
					$tpl.find('.resizable-field').removeClass('size-medium');
					$tpl.find('.resizable-field').addClass('size-large');
				}
				if(type == 'date' || type == 'datetime'){
					if ( opt.fieldLength == 'small' ){
						$tpl.find('.icn-search-date').removeClass('size-medium');
						$tpl.find('.icn-search-date').removeClass('size-large');
						$tpl.find('.icn-search-date').addClass('size-small');
					} else if ( opt.fieldLength == 'medium' ){
						$tpl.find('.icn-search-date').removeClass('size-small');
						$tpl.find('.icn-search-date').removeClass('size-large');
						$tpl.find('.icn-search-date').addClass('size-medium');
					} else if ( opt.fieldLength == 'large' ){
						$tpl.find('.icn-search-date').removeClass('size-small');
						$tpl.find('.icn-search-date').removeClass('size-medium');
						$tpl.find('.icn-search-date').addClass('size-large');
					}
				}
				if(type == 'credit_card'){
					if ( opt.fieldLength == 'small' ){
						$tpl.find('.f-line-field').css('width', '25.9%');
						$tpl.find('.tpl-credit-card').removeClass('size-medium');
						$tpl.find('.tpl-credit-card').removeClass('size-large');
						$tpl.find('.tpl-credit-card').addClass('size-small');
					} else if ( opt.fieldLength == 'medium' ){
						$tpl.find('.f-line-field').css('width', '53%');
						$tpl.find('.tpl-credit-card').removeClass('size-small');
						$tpl.find('.tpl-credit-card').removeClass('size-large');
						$tpl.find('.tpl-credit-card').addClass('size-medium');
					} else if ( opt.fieldLength == 'large' ){
						$tpl.find('.f-line-field').css('width', '108%');
						$tpl.find('.tpl-credit-card').removeClass('size-small');
						$tpl.find('.tpl-credit-card').removeClass('size-medium');
						$tpl.find('.tpl-credit-card').addClass('size-large');
					}
				}
				if(type == 'recurring'){
					window.setTimeout(function(){
						var container = document.getElementById('recurring_plans_div');
						var cssText = container.getElementsByClassName('chzn-container')[0].style.cssText;
						$tpl.find('.tpl-recurring').removeClass('size-small');
						$tpl.find('.tpl-recurring').removeClass('size-medium');
						$tpl.find('.tpl-recurring').removeClass('size-large');
						if ( opt.fieldLength == 'small' ){
							$tpl.find('.tpl-recurring').addClass('size-small');
							$tpl.find('#recurring_plans_div .chzn-container').css("cssText", cssText + "width: 13% !important;");
						} else if ( opt.fieldLength == 'medium' ){
							$tpl.find('.tpl-recurring').addClass('size-medium');
							$tpl.find('#recurring_plans_div .chzn-container').css("cssText", cssText + "width: 41.69% !important;");
						} else if ( opt.fieldLength == 'large' ){
							$tpl.find('.tpl-recurring').addClass('size-large');
							$tpl.find('#recurring_plans_div .chzn-container').css("cssText", cssText + "width: 100% !important;");
						}
					}, 200);
				}
			}
		}
		
	},
	labelWidth: function(){
		
		
	},
	actionStyleField: function(){
		$('.fb-label-font').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.labelFont = $(this).val();
			if($tpl.hasClass("fb-upload-file")){
				$tpl.children(".tpl-block-content").find("label:first").css("font-family", opt.labelFont + ", sans-serif");
			} else if ($tpl.hasClass("fb-section")) {
				$tpl
					.children(".tpl-block-content")
					.children(".fb-section-box")
					.children("label")
					.css("font-family", opt.labelFont + ", sans-serif");
			} else {
				$tpl
					.find(".tpl-block-content")
					.children("label")
					.css("font-family", opt.labelFont + ", sans-serif");
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('.fb-label-size').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.labelSize = $(this).val();
			if($tpl.hasClass("fb-upload-file")){
				$tpl.children(".tpl-block-content").find("label:first").css("font-size", opt.labelSize + "px");
			} else if ($tpl.hasClass("fb-section")) {
				$tpl
					.children(".tpl-block-content")
					.children(".fb-section-box")
					.children("label")
					.css("font-size", opt.labelSize + "px");
			} else {
				$tpl
					.find(".tpl-block-content")
					.children("label")
					.css("font-size", opt.labelSize + "px");
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		$('.fb-field-border-type').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.fieldBorderStyle = $(this).val();
			$tpl.find('.txt-field').css('border-style',opt.fieldBorderStyle.toLowerCase());
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('.fb-field-border-width').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.fieldBorderWidth = $(this).val();
			$tpl.find('.txt-field').css('border-width',opt.fieldBorderWidth + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		$('#fb-field-name-first').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			var labelPos = '';
			var opt = $tpl.data('json');
			if (! opt || opt.labelPos == 'None') {
				var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
				optGlobal = $tplGlobal.data('json');
				labelPos = optGlobal.labelPos;
			} else {
				labelPos = opt.labelPos;
			}
			
			opt.hints.nameFirst = $(this).val();
			$tpl.find('.tpl-name .t-field:first .label-top').text(opt.hints.nameFirst);
			formBuilderpage.set_elemenet_data($tpl, opt);
			if( labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.align_field_without_hints($tpl, opt);
		});
		$('#fb-field-name-last').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			var labelPos = '';
			var opt = $tpl.data('json');
			if (! opt || opt.labelPos == 'None') {
				var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
				optGlobal = $tplGlobal.data('json');
				labelPos = optGlobal.labelPos;
			} else {
				labelPos = opt.labelPos;
			}
			
			opt.hints.nameLast = $(this).val();
			$tpl.find('.tpl-name .t-field:last .label-top').text(opt.hints.nameLast);
			formBuilderpage.set_elemenet_data($tpl, opt);
			if( labelPos == 2 ){
				formBuilderpage.labelPosition($tpl);
			}
			formBuilderpage.align_field_without_hints($tpl, opt);
		});
		$('.fb-placeholder-text').on('keyup change', function (){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');

			if(opt.labelPos != 2){
				opt.fieldPlaceholder = $(this).val();
				$tpl.find('.tpl-block-content').find('input[type="text"]').attr('placeholder', opt.fieldPlaceholder);
				formBuilderpage.set_elemenet_data($tpl, opt);
			}
		});
		$('.fb-label-text').on('keyup change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
			var optGlobal = $tplGlobal.data('json');
			
			opt.labelText = $(this).val();
			if(opt.labelText){
				if(formBuilderpage.current_element_type == 'recurring'){
					$tpl.find('.tpl-block-content').find('.fb-choice').text(opt.labelText);
				}else{
					if(opt.labelPos != 2){
						$tpl.find('.tpl-block-content').children('label').show();
					}
					if(formBuilderpage.current_element_type == 'section_break' && !opt.labelIsVisible){
						$tpl.find('.tpl-block-content').children('label').hide();
					}
					if($tpl.hasClass("fb-upload-file")){
						$tpl.children(".tpl-block-content").find("label:first span:first").text(opt.labelText);
					}else if ($tpl.hasClass("fb-section")) {
						$tpl
							.children(".tpl-block-content")
							.children(".fb-section-box")
							.children("label")
							.show();
						$tpl
							.children(".tpl-block-content")
							.children(".fb-section-box")
							.children("label")
							.text(opt.labelText);
					} else {
						$tpl
							.find(".tpl-block-content")
							.children("label")
							.children("span:not(.required_astrisk)")
							.text(opt.labelText);
					}
				}
			}else{
				if(opt.labelPos != 2){
					if($tpl.hasClass("fb-upload-file")){
						$tpl.children(".tpl-block-content").find("label:first").hide();
					} else if ($tpl.hasClass("fb-section")) {
						$tpl.children(".tpl-block-content").children(".fb-section-box").children("label").hide();
					} else {
						$tpl.find('.tpl-block-content').children('label').hide();
					}
				}
			}
			
			formBuilderpage.set_elemenet_data($tpl, opt);
			if( opt.labelPos == 2 || ( opt.labelPos == 'None' && optGlobal.labelPos == 2 ) ){
				formBuilderpage.labelPosition($tpl);
			}
		});
		$('.is-label-visible').on('change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.labelIsVisible = $(this).is(':checked') ? 1 : 0;
			formBuilderpage.set_elemenet_data($tpl, opt);
			if(formBuilderpage.current_element_type == 'section_break' ){
				opt.labelIsVisible && opt.labelText ? $tpl.find('.tpl-block-content').children('label').show() :
					$tpl.find('.tpl-block-content').children('label').hide();
			}
		});
		
		$('.boolean-field-description').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.booleanFieldDescription = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.tpl-block-content').find('span.boolean_field_description').text(opt.booleanFieldDescription);
		});
		
		$('.field-description').on('keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.FieldDescription = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			$tpl.find('.tpl-block-content').find('span.field_description').text(opt.FieldDescription);
		});
		
		$('input[name="sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.common = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="first_name_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.first_name = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="last_name_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.last_name = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="address1_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.address1 = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="address2_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.address2 = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="city_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.city = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="state_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.state = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="zipcode_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.zipcode = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="country_sfmc_mapping_field"]').on('change keyup', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if(typeof opt.sfmc_mapping_field == 'undefined'){
				opt.sfmc_mapping_field = {};
			}
			opt.sfmc_mapping_field.country = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="boolean_mode"]').on('change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.booleanMode = 1;
			if($('input[name="boolean_mode"][value="2"]').is(':checked')){
				opt.booleanMode = 2;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="is_sort_alphabetically"]').on('change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.isSortAlphabetically = 0;
			$('span.select_order_direction').hide();
			if($('input[name="is_sort_alphabetically"]').is(':checked')){
				opt.isSortAlphabetically = 1;
				$('span.select_order_direction').css('display', 'inline-block');
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="override_if_empty"]').on('change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.overrideIfEmpty = 0;
			if($(this).is(':checked')){
				opt.overrideIfEmpty = 1;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		
		$('input[name="process_data_type"]').on('change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			if($('input[name="process_data_type"][value="'+DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY+'"]').is(':checked')){
				opt.dataProcessType = DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY;
			} else if ($('input[name="process_data_type"][value="'+DATA_PROCESS_TYPE_OVERRIDE+'"]').is(':checked')) {
				opt.dataProcessType = DATA_PROCESS_TYPE_OVERRIDE;
			} else if ($('input[name="process_data_type"][value="'+DATA_PROCESS_TYPE_MERGE+'"]').is(':checked')){
				opt.dataProcessType = DATA_PROCESS_TYPE_MERGE;
			}
			formBuilderpage.set_elemenet_data($tpl, opt);
		});
		/*$('#pmv input').on('keyup', function(){
		 $(this).val(parseInt($(this).val()));
		 
		 var $tpl = $('.tpl-block.selected');
		 var opt = $tpl.data('json');
		 opt.pmv = $(this).val();
		 formBuilderpage.set_elemenet_data($tpl, opt);
		 
		 var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		 var optGlobal = $tplGlobal.data('json');
		 optGlobal.pmv = $(this).val();
		 formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
		 });*/
		$('#amount input').on('keyup', function () {
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.amount = $(this).val();
			formBuilderpage.set_elemenet_data(form, opt);
		});
		$('#amount_title input').on('keyup', function () {
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			opt.amount_title = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			$('.payment_info span.amount').text($(this).val());
		});
		$('#fb-form-title').keyup(function(){
			var val = $(this).val();
			$('.info-form').find('.form-tit').text(val);
			$('.fb-input-form-tit').val(val);
			formBuilderpage.check_empty_title_and_description();
		});
		$('#fb-form-name').keyup(function(){
			var val = $(this).val();
			$('.h-edit-text span').text(val);
		});
		$('#fb-form-description').on('keyup', function(){
			var val = $(this).val();
			$('.info-form').find('.form-desc').text(val);
			$('.fb-textarea-form-desc').val(val);
			formBuilderpage.check_empty_title_and_description();
		});
		$('.info-form').on('keyup', '.fb-input-form-tit', function(){
			var val = $(this).val();
			$('.info-form').find('.form-tit').text(val);
			$('#fb-form-title').val(val);
		});
		
		$('.info-form').on('keyup', '.fb-textarea-form-desc', function(){
			var val = $(this).val();
			$('.info-form').find('.form-desc').text(val);
			$('#fb-form-description').val(val);
		});
		
		ll_combo_manager.event_on_change('.fb-field-length', function(){
			formBuilderpage.change_field_data_json('fieldLength', '', $(this).val());
			var $tpl = $('.tpl-block.selected');
			formBuilderpage.fieldSize($tpl);
		});
		
		$('#fb-field-label-width-global').change(function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.labelWidth = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				
				if (optСurrent.labelWidth == 'None'){
					$tplСurrent.find('.fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field').css({
						marginLeft: opt.labelWidth + '%'
					});
					$tplСurrent.find('.fb-side-label > label').css({
						width: opt.labelWidth + '%'
					});
				}
			});
		});
		$('.txt-field-label-width').change(function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			
			opt.labelWidth = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$tpl.find('.fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field').css({
				marginLeft: opt.labelWidth + '%'
			});
			$tpl.find('.fb-side-label > label').css({
				width: opt.labelWidth + '%'
			});
		});
		
		$('#fb-field-border-width-global').change(function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			var field_border_width = opt.fieldBorderWidth = $(this).val();
			formBuilderpage.set_elemenet_data($tpl, opt);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldBorderWidth = field_border_width;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.txt-field').css('border-width',opt.fieldBorderWidth + 'px');
			});
		});
		
		$('#fb-button-border-width-global').change(function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.btnBoderWidth = $(this).val();
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('border-width',opt.btnBoderWidth + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		$('input[name="button_border_radius"]').keyup(function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			
			opt.btnBorderRadius = $(this).val();
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('border-radius',opt.btnBorderRadius + 'px');
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('-webkit-border-radius',opt.btnBorderRadius + 'px');
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('-moz-border-radius',opt.btnBorderRadius + 'px');
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		$('#fb-button-text, #fb-button-text-2').on('keyup', function(){
			var val = $(this).val();
			var id = $(this).attr('id');
			
			if ( id == 'fb-button-text'){
				$('#fb-button-text-2').val(val);
			} else {
				$('#fb-button-text').val(val);
			}
			$('.form-submit-button').val(val);
		});
		$('#fb-next-button-text').on('keyup', function(){
			$('.fb-next-page-section').text($(this).val());
			$('.form-submit-button').attr('data-next-button-text', $(this).val());
		});
		$('#fb-previous-button-text').on('keyup', function(){
			$('.fb-prev-page-section').text($(this).val());
			$('.form-submit-button').attr('data-prev-button-text', $(this).val());
		});
		$('#btnAlign li').on('click', function(){
			var $tpl = $('#form-editor .fb-wrap-columns-form');
			var opt = $tpl.data('json');
			var index = $(this).parent().children('li').index($(this));
			var $box = $('#wrap-form-submit-button');
			$(this).addClass('selected').siblings('li').removeClass('selected');
			
			if (index == 0){
				$box.removeClass('fb-center-align fb-right-align');
			} else if (index == 1){
				$box.removeClass('fb-right-align').addClass('fb-center-align');
			} else if (index == 2){
				$box.removeClass('fb-center-align').addClass('fb-right-align');
			}
			
			opt.btnAlign = index;
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		
		$('#fb-form-background-transparent-global').on('click', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
			var optGlobal = $tplGlobal.data('json');
			var bgColor = 'transparent';
			
			( $(this).is(':checked') ) ? optGlobal.isTransparentFormBackground = "1" : optGlobal.isTransparentFormBackground = "0";
			
			( optGlobal.isTransparentFormBackground === "1" ) ? bgColor = 'transparent' :  bgColor = optGlobal.formBackground;
			
			$('#ll-form-box').css('background-color', bgColor);
			$('#ll-form-box').find('.tpl-block').css('background-color', bgColor);
			
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		});
		
		$(".fb-label-align").change(function() {
			var $tpl = $(".tpl-block.selected");
			var opt = $tpl.data("json");
			var align = "center";
			
			opt.labelAlign = $(this).val();
			
			if (opt.labelAlign == 0) {
				align = "left";
			} else if (opt.labelAlign == 2) {
				align = "right";
			}
			
			$tpl
				.children(".tpl-block-content")
				.children(".fb-section-box")
				.children("label")
				.css("text-align", align);
			$tpl.attr("data-json", JSON.stringify(opt));
		});
		$('.fb-choise-hint-left-text').on('keyup change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			
			opt.choicesHintLeft = val;
			$tpl.find('.tpl-choices__label-left').text(val);
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
		$('.fb-choise-hint-right-text').on('keyup change', function(){
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var val = $(this).val();
			
			opt.choicesHintRight = val;
			$tpl.find('.tpl-choices__label-right').text(val);
			formBuilderpage.set_elemenet_data($tpl, opt)
		});
	},
	align_field_without_hints: function($tpl, opt){
		if(! opt.hints.nameFirst && ! opt.hints.nameLast){
			$tpl.addClass('hide_hints');
		}else{
			$tpl.removeClass('hide_hints');
		}
	},
	updateColorElTpl: function(el, hex){
		var $tpl = $('.tpl-block.selected');
		var opt = $tpl.data('json');
		
		var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		var optGlobal = $tplGlobal.data('json');
		
		var $el = $(el);
		var id = $(el).attr('id');
		
		console.log($el.hasClass('fb-label-color'));
		
		if( id == 'fb-form-background-global' ){
			var bgColor = 'transparent';
			
			optGlobal.formBackground = '#' + hex;
			( optGlobal.isTransparentFormBackground === "1" ) ? bgColor = 'transparent' :  bgColor = optGlobal.formBackground;
			
			$('#ll-form-box').css('background-color', bgColor);
			$('#ll-form-box').find('.tpl-block').css('background-color', bgColor);
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		} if(id == 'fb-form-designer-canvas-color-global'){
			$('.eb-wrap-form-page').css('background-color', '#' + hex);
			optGlobal.designerCanvasColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
		}if( id == 'fb-form-text-color-global' ){
			optGlobal.formTextColor = '#' + hex;
			$('.info-form').css('color', optGlobal.formTextColor);
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		} else if ( id == 'fb-label-color-global'){
			optGlobal.labelColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				
				$tplСurrent.find('.tpl-block-content').children('label').css('color', optGlobal.labelColor);
				
			});
			$('.fb-step-text-page').css('color', optGlobal.labelColor);
			
		} else if ($el.hasClass('fb-required-field-hint-color')){
			opt.requiredFieldHintColor = '#' + hex;
			$tpl.find('.tpl-block-content').find('span.required_astrisk').css('color', opt.requiredFieldHintColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		}else if ($el.hasClass('fb-sub-label-color')){
			opt.subLabelColor = '#' + hex;
			$tpl.find('.tpl-block-content').find('span.label-top').css('color', opt.subLabelColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if ( id == 'fb-field-background-global'){
			var field_background = optGlobal.fieldBackground = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldBackground = field_background;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.txt-field').css('background-color', field_background);
			});
		} else if ( id == 'fb-field-border-color-global'){
			var field_border_color = optGlobal.fieldBorderColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldBorderColor = field_border_color;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.txt-field').css('border-color', optGlobal.fieldBorderColor);
			});
		} else if ( id == 'fb-field-color-global'){
			var field_color = optGlobal.fieldColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.fieldColor = field_color;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.txt-field').css('color', optGlobal.fieldColor);
			});
		} else if ( id == 'fb-dropdown-background-global'){
			var dropdown_background = optGlobal.dropdownBackground = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.dropdownBackground = dropdown_background;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.chzn-single').css('background-color', optGlobal.dropdownBackground);
				$tplСurrent.find('.chzn-drop').css('background-color', optGlobal.dropdownBackground);
				$tplСurrent.find('select').css('background-color', optGlobal.dropdownBackground);
			});
		} else if ( id == 'fb-dropdown-border-color-global'){
			var dropdown_border_color = optGlobal.dropdownBorderColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.dropdownBorderColor = dropdown_border_color;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.chzn-single').css('border-color', optGlobal.dropdownBorderColor);
				$tplСurrent.find('.chzn-drop').css('border-color', optGlobal.dropdownBorderColor);
				$tplСurrent.find('select').css('border-color', optGlobal.dropdownBorderColor);
			});
		} else if ( id == 'fb-dropdown-color-global'){
			var dropdown_color = optGlobal.dropdownColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal);
			
			$('.wrap-tpl-block .tpl-block').each(function(){
				var $tplСurrent = $(this);
				var optСurrent = $tplСurrent.data('json');
				optСurrent.dropdownColor = dropdown_color;
				formBuilderpage.set_elemenet_data($tplСurrent, optСurrent);
				$tplСurrent.find('.chzn-single').css('color', optGlobal.dropdownColor).find('div b').css('border-top-color', optGlobal.dropdownColor);
				$tplСurrent.find('.chzn-drop').css('color', optGlobal.dropdownColor).find('div b').css('border-top-color', optGlobal.dropdownColor);
				$tplСurrent.find('select').css('color', optGlobal.dropdownColor).find('div b').css('border-top-color', optGlobal.dropdownColor);
			});
		} else if ( id == 'fb-title-color-global'){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.titleColor = '#' + hex;
			formBuilderpage.set_elemenet_data(form, opt);
			$('.form-tit').css('color', opt.titleColor);
		} else if ( id == 'fb-description-color-global'){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			opt.descriptionColor = '#' + hex;
			formBuilderpage.set_elemenet_data(form, opt);
			$('.form-desc').css('color', opt.descriptionColor);
		} else if ( id == 'fb-button-background-global'){
			optGlobal.btnBackground = '#' + hex;
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('background-color',optGlobal.btnBackground);
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		} else if ( id == 'fb-button-hover-background-global'){
			optGlobal.btnHoverBackground = '#' + hex;
			$('.form-submit-button').parent().find('style').remove();
			$('.form-submit-button').parent().append("<style>input[type='submit'].t-btn-orange:hover,.fb-wrap-columns-form .t-btn-orange:hover{background-color: " + optGlobal.btnHoverBackground + " !important;}</style>");
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		} else if ( id == 'fb-button-border-color-global'){
			optGlobal.btnBorderColor = '#' + hex;
			$('.form-submit-button, .fb-next-page-section, .fb-prev-page-section').css('border-color',optGlobal.btnBorderColor);
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		} else if ( id == 'fb-button-color-global'){
			optGlobal.btnColor = '#' + hex;
			var color = '#' + hex;
			cssText = document.getElementsByClassName('form-submit-button-color')[0].style.cssText;
			$('.form-submit-button-color').css("cssText", cssText + "color: "+color+" !important;");
			cssText = document.getElementsByClassName('fb-next-page-section')[0].style.cssText;
			$('.fb-next-page-section').css("cssText", cssText + "color: "+color+" !important;");
			cssText = document.getElementsByClassName('fb-prev-page-section')[0].style.cssText;
			$('.fb-prev-page-section').css("cssText", cssText + "color: "+color+" !important;");
			formBuilderpage.set_elemenet_data($tplGlobal, optGlobal)
		} else if( $el.hasClass('fb-label-color') ){
			opt.labelColor = '#' + hex;
			if ($tpl.hasClass("fb-upload-file")) {
				$tpl.children(".tpl-block-content").find("label:first").css("color", opt.labelColor);
			} else if ($tpl.hasClass("fb-section")) {
				$tpl
					.children(".tpl-block-content")
					.children(".fb-section-box")
					.children("label")
					.css("color", opt.labelColor);
			} else {
				$tpl
					.find(".tpl-block-content")
					.children("label")
					.css("color", opt.labelColor);
			}
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if( $el.hasClass('fb-choice-color') ){
			opt.choicesColor = '#' + hex;
			$tpl.find('.tpl-block-content').find('.fb-choice').css('color', opt.choicesColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if( $el.hasClass('fb-choice-hint-left-color') ){
			opt.choicesHintLeftColor = '#' + hex;
			$tpl.find('.tpl-block-content').find('.tpl-choices__label-left').css('color', opt.choicesHintLeftColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if( $el.hasClass('fb-choice-hint-right-color') ){
			opt.choicesHintRightColor = '#' + hex;
			$tpl.find('.tpl-block-content').find('.tpl-choices__label-right').css('color', opt.choicesHintRightColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if( $el.hasClass('fb-choice-survey-bg-color') ){
			opt.choicesBgColor = '#' + hex;
			$tpl.find('.tpl-choices .t-field label').css('background-color', opt.choicesBgColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if( $el.hasClass('fb-choice-survey-border-color') ){
			opt.choicesBorderColor = '#' + hex;
			$tpl.find('.tpl-choices .t-field label').css('border-color', opt.choicesBorderColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if( $el.hasClass('fb-choice-survey-selected-bg-color') ){
			opt.choicesSelectedBgColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tpl, opt)
			formBuilderpage.updateChoicesStyleInline($tpl, opt);
		} else if( $el.hasClass('fb-choice-survey-selected-border-color') ){
			opt.choicesSelectedBorderColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tpl, opt)
			formBuilderpage.updateChoicesStyleInline($tpl, opt);
		} else if( $el.hasClass('fb-choice-survey-selected-font-color') ){
			opt.choicesSelectedFontColor = '#' + hex;
			formBuilderpage.set_elemenet_data($tpl, opt)
			formBuilderpage.updateChoicesStyleInline($tpl, opt);
		} else if ( $el.hasClass('fb-field-background') ) {
			opt.fieldBackground = '#' + hex;
			$tpl.find('.txt-field').css('background-color', opt.fieldBackground);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if ( $el.hasClass('fb-field-border-color') ) {
			opt.fieldBorderColor = '#' + hex;
			$tpl.find('.txt-field').css('border-color', opt.fieldBorderColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if ( $el.hasClass('fb-field-color') ) {
			opt.fieldColor = '#' + hex;
			$tpl.find('.txt-field').css('color', opt.fieldColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if ( $el.hasClass('fb-dropdown-background') ) {
			opt.dropdownBackground = '#' + hex;
			$tpl.find('select').css('background-color', opt.dropdownBackground);
			$tpl.find('.chzn-single').css('background-color', opt.dropdownBackground);
			$tpl.find('.chzn-drop').css('background-color', opt.dropdownBackground);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if ( $el.hasClass('fb-dropdown-border-color') ) {
			opt.dropdownBorderColor = '#' + hex;
			$tpl.find('select').css('border-color', opt.dropdownBorderColor);
			$tpl.find('.chzn-single').css('border-color', opt.dropdownBorderColor);
			$tpl.find('.chzn-drop').css('border-color', opt.dropdownBorderColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		} else if ( $el.hasClass('fb-dropdown-color') ) {
			opt.dropdownColor = '#' + hex;
			$tpl.find('select').css('color', opt.dropdownColor).find('div b').css('border-top-color', opt.dropdownColor);
			$tpl.find('.chzn-single').css('color', opt.dropdownColor).find('div b').css('border-top-color', opt.dropdownColor);
			$tpl.find('.chzn-drop').css('color', opt.dropdownColor).find('div b').css('border-top-color', opt.dropdownColor);
			formBuilderpage.set_elemenet_data($tpl, opt)
		}
	},
	check_empty_title_and_description: function(){
		if(!is_device_form) {
			if ($('#fb-form-description').val() == '' && $('#fb-form-title').val() == '') {
				$('.info-form').hide();
			} else {
				$('.info-form').show();
			}
		} else {
			$('.info-form').hide();
		}
	},
	setRuleAction: function(){
		$('.fb-btn-set-rule').on('click', function(e){
			e.preventDefault();
			//ll_fade_manager.fade(true, 'load', true);
			$('.fb-import-data-source').hide();
			ll_combo_manager.make_combo('.fb-align-row:first select');
			formBuilderpage.rulesActions('.fb-align-row:first .fb-has-value', '.fb-align-row:first .fb-choose-form-field');
			var $tpl = $('.tpl-block.selected');
			var opt = $tpl.data('json');
			var visible_conditions = $.parseJSON($tpl.attr('visible_conditions'));
			$('.fb-align-row').slice(1).remove();
			$('.fb-align-row').find('.fb-import-data-source .icon').unbind('click');
			$('.fb-align-row').find('.fb-import-data-source .icon').bind('click', function (e) {
				e.stopPropagation();
				var that = $(this);
				formBuilderpage.draw_data_sources_dropdown($(this).parent(), function(){
					that.parent().toggleClass('ll-opened');
				});
			});
			ll_combo_manager.set_selected_value('.fb-align-row:first select', '');
			$('.fb-align-row:first .fb-item-input').hide();
			$('.fb-align-row:first .fb-item-input').html('');
			if(visible_conditions){
				for(var i in visible_conditions){
					var condition = visible_conditions[i];
					if(i > 1){
						if($('div.tpl-block[data-element-id="'+condition.field_identifier+'"]')){
							$('.fb-btn-add-condition').trigger('click');
							ll_combo_manager.set_selected_value('.fb-align-row:last .conditions_operator', condition.operator);
							ll_combo_manager.set_selected_value('.fb-align-row:last .fb-choose-form-field', condition.field_identifier);
							ll_combo_manager.trigger_on_change('.fb-align-row:last .fb-choose-form-field');
							ll_combo_manager.set_selected_value('.fb-align-row:last .fb-has-value', condition.condition);
							ll_combo_manager.trigger_on_change('.fb-align-row:last .fb-has-value');
							if(condition.value && (condition.condition == 'equals' || condition.condition == 'not_equal' || condition.condition == 'contains' || condition.condition == 'doesnot_contain')){
								if($('.fb-align-row:last .fb-item-input').find('select').length > 0){
									if (typeof condition.value == 'string') {
										condition.value = [condition.value];
									}
									if(condition.value.length > 0){
										for(var j in condition.value){
											var value = condition.value[j];
											if($('.fb-align-row:last .fb-item-input').find('select option[value="'+value+'"]').length > 0){
												ll_combo_manager.set_selected_value($('.fb-align-row:last .fb-item-input').find('select'), value);
											}else{
												ll_combo_manager.add_option($('.fb-align-row:last .fb-item-input').find('select'), value, value, true);
											}
										}
										ll_combo_manager.set_selected_value($('.fb-align-row:last .fb-item-input').find('select'), condition.value);
									}
								}
							}
						}
					}else if(i == 1){
						if($('div.tpl-block[data-element-id="'+condition.field_identifier+'"]')) {
							ll_combo_manager.set_selected_value('.fb-align-row:first .conditions_operator', condition.operator);
							ll_combo_manager.set_selected_value('.fb-align-row:first .fb-choose-form-field', condition.field_identifier);
							ll_combo_manager.trigger_on_change('.fb-align-row:first .fb-choose-form-field');
							ll_combo_manager.set_selected_value('.fb-align-row:first .fb-has-value', condition.condition);
							ll_combo_manager.trigger_on_change('.fb-align-row:first .fb-has-value');
							if (condition.condition == 'equals' || condition.condition == 'not_equal' || condition.condition == 'contains' || condition.condition == 'doesnot_contain') {
								if ($('.fb-align-row:first .fb-item-input').find('select').length > 0) {
									if (typeof condition.value == 'string') {
										condition.value = [condition.value];
									}
									if (typeof condition.value != 'undefined' && condition.value && typeof condition.value.length != 'undefined' && condition.value.length > 0) {
										for (var j in condition.value) {
											var value = condition.value[j];
											if ($('.fb-align-row:first .fb-item-input').find('select option[value="' + value + '"]').length > 0) {
												ll_combo_manager.set_selected_value($('.fb-align-row:first .fb-item-input').find('select'), value);
											} else {
												ll_combo_manager.add_option($('.fb-align-row:last .fb-item-input').find('select'), value, value, true);
											}
										}
										ll_combo_manager.set_selected_value($('.fb-align-row:last .fb-item-input').find('select'), condition.value);
									}
								}
							}
						}
					}
				}
			}
			$('.default_value_when_matching_conditions').hide();
			if($tpl.attr('data-type-el') == 'boolean'){
				$('.default_value_when_matching_conditions').show();
				ll_theme_manager.checkboxRadioButtons.check($('.default_value_when_matching_conditions input[name="default_value_when_matching_conditions"][value="'+($tpl.attr('default_value_when_matching_conditions') ? $tpl.attr('default_value_when_matching_conditions') : 0) +'"]'), true);
			}
			ll_popup_manager.open('#set_visible_rules_popup');
			//ll_fade_manager.fade(false);
		});
		$('.fb-btn-add-condition').on('click', function(){
			$('#set_visible_rules_popup #rows').append('<div class="fb-align-row clearfix">'+
				'<div class="fb-align-item">'+
				'<select class="conditions_operator">'+
				'<option value="AND" selected="">And</option>'+
				'<option value="OR">Or</option>'+
				'</select>'+
				'</div>'+
				'<div class="fb-align-item fb-item-select">'+
				'<select class="fb-choose-form-field" data-placeholder="Choose Field...">'+
				'</select>'+
				'</div>'+
				'<div class="fb-align-item fb-item-select">'+
				'<select class="fb-has-value" data-placeholder="Choose Condition...">'+
				'<option value="0"></option>'+
				'<option value="has_value">Has a Value</option>'+
				'<option value="is_blank">Is Blank</option>'+
				'<option value="contains">Contains</option>'+
				'<option value="doesnot_contain">Does not Contain</option>'+
				'<option value="equals">Equals</option>'+
				'<option value="not_equal">Does not Equal</option>'+
				'</select>'+
				'</div>'+
				'<div class="fb-align-item fb-item-input">'+
				'<select multiple></select>'+
				'</div>'+
				'<div class="fb-align-item fb-remove-row">'+
				'<a href="javascript:void(0);" class="fb-remove-row-button"></a>'+
				'</div>'+
				'<div class="fb-align-item fb-import-data-source t-actions-dropdown t-actions-dropdown-orange">'+
				'<a href="javascript:void(0);" class="icon"></a>'+
				'<div class="ll-actions-dropdown">'+
				'<ul class="parent">'+
				'</ul>'+
				'</div>'+
				'</div>'+
				'</div>');
			ll_combo_manager.make_combo('#set_visible_rules_popup #rows .fb-align-row:last select');
			formBuilderpage.rulesActions('.fb-align-row:last .fb-has-value', '.fb-align-row:last .fb-choose-form-field');
			$('.fb-align-row:last').find('.fb-import-data-source .icon').on('click', function (e) {
				e.stopPropagation();
				var that = $(this);
				formBuilderpage.draw_data_sources_dropdown($(this).parent(), function(){
					that.parent().toggleClass('ll-opened');
				});
			});
			$('.fb-align-row:last .fb-remove-row-button').on('click', function(e){
				e.stopPropagation();
				e.preventDefault();
				$(this).parents('.fb-align-row').remove();
			});
		});
		$('.fb-btn-view-formula').on('click', function(e){
			e.preventDefault();
			formBuilderpage.setRuleViewFormula();
		});
		$('#cancel_set_visible_rules_popup').click(function(){
			ll_popup_manager.close('#set_visible_rules_popup');
		});
		$('#save_element_visible_rules').click(function(){
			var rows = {};
			var index = 0;
			var error = 0;
			$('.fb-align-row').each(function(){
				index++;
				var operator = ll_combo_manager.get_selected_value($(this).find('.conditions_operator'));
				var field_identifier = ll_combo_manager.get_selected_value($(this).find('.fb-choose-form-field'));
				var condition = ll_combo_manager.get_selected_value($(this).find('.fb-has-value'));
				if(parseInt(field_identifier)) {
					var value = '';
					if ($(this).find('.fb-item-input .txt-field').length > 0) {
						value = $(this).find('.fb-item-input .txt-field').val();
					} else if ($(this).find('.fb-item-input select').length > 0) {
						switch (condition) {
							case 'equals':
							case 'not_equal':
							case 'contains':
							case 'doesnot_contain':
								value = ll_combo_manager.get_selected_value($(this).find('.fb-item-input select'));
								if(!value){
									show_error_message('Please Add Condition Value.');
									error = 1;
									return;
								}
								break;
						}
						
					}
					var row = {"operator": operator, "field_identifier": field_identifier, "condition": condition};
					if (value) {
						row.value = value;
					}
					rows[index] = row;
				}
			});
			if(!error) {
				var $tpl = $('.tpl-block.selected');
				$tpl.attr('visible_conditions', JSON.stringify(rows));
				$tpl.attr('default_value_when_matching_conditions', $('.default_value_when_matching_conditions input[name="default_value_when_matching_conditions"]:checked').val());
				
				ll_popup_manager.close('#set_visible_rules_popup');
			}
		});
	},
	draw_data_sources_dropdown: function  (container, callback){
		container.find('ul.parent').html('');
		if(Object.keys(ll_data_sources_manager.cached_data_sources_names).length > 0){
			container.find('ul.parent').html('');
			for(var i in ll_data_sources_manager.cached_data_sources_names){
				var _html = '';
				_html += '<li data-source-identifier="'+i+'">';
				_html += '	<a href="javascript:void(0);">';
				_html += 		ll_data_sources_manager.cached_data_sources_names[i];
				_html += '	</a>';
				_html += '</li>';
				container.find('ul.parent').append(_html);
			}
			container.find('ul li').on('click', function (e){
				e.stopPropagation();
				if($(this).attr('data-source-identifier') == 'countries_of_region' && typeof $(this).attr('data-region-id') == 'undefined'){
					var ul_parent = $(this).parent();
					$(this).parent().html('');
					for(var j in regions){
						var _html = '';
						_html += '<li data-source-identifier="countries_of_region" data-region-id="'+regions[j]['id']+'">';
						_html += '	<a href="javascript:void(0);">';
						_html += regions[j]['name'];
						_html += '	</a>';
						_html += '</li>';
						ul_parent.append(_html);
					}
					container.find('ul li').on('click', function (e){
						$('body').click();
						var _select = container.closest('.fb-align-row').find('.fb-item-input select');
						ll_data_sources_manager.get_data_source($(this).attr('data-source-identifier'), $(this).attr('data-region-id'), function (data_source, _select) {
							if (Object.keys(data_source).length > 0) {
								for (var i in data_source) {
									ll_combo_manager.add_option_if_not_exist(_select, data_source[i].option_value, data_source[i].option_label);
								}
							}
						}, _select);
					});
				}else{
					$('body').click();
					var _select = container.closest('.fb-align-row').find('.fb-item-input select');
					ll_data_sources_manager.get_data_source($(this).attr('data-source-identifier'), $(this).attr('data-region-id'), function (data_source, _select) {
						if(Object.keys(data_source).length > 0){
							for(var i in data_source){
								ll_combo_manager.add_option_if_not_exist(_select, data_source[i].option_value, data_source[i].option_label);
							}
						}
					}, _select);
				}
			});
			callback();
		}else{
			ll_data_sources_manager.get_data_sources_names(true, function () {
				container.find('ul.parent').html('');
				for(var i in ll_data_sources_manager.cached_data_sources_names){
					var _html = '';
					_html += '<li data-source-identifier="'+i+'">';
					_html += '	<a href="javascript:void(0);">';
					_html += 		ll_data_sources_manager.cached_data_sources_names[i];
					_html += '	</a>';
					_html += '</li>';
					container.find('ul.parent').append(_html);
				}
				container.find('ul li').on('click', function (e){
					e.stopPropagation();
					if($(this).attr('data-source-identifier') == 'countries_of_region' && typeof $(this).attr('data-region-id') == 'undefined'){
						var ul_parent = $(this).parent();
						$(this).parent().html('');
						for(var j in regions){
							var _html = '';
							_html += '<li data-source-identifier="countries_of_region" data-region-id="'+regions[j]['id']+'">';
							_html += '	<a href="javascript:void(0);">';
							_html += regions[j]['name'];
							_html += '	</a>';
							_html += '</li>';
							ul_parent.append(_html);
						}
						container.find('ul li').on('click', function (e){
							$('body').click();
							var _select = container.closest('.fb-align-row').find('.fb-item-input select');
							ll_data_sources_manager.get_data_source($(this).attr('data-source-identifier'), $(this).attr('data-region-id'), function (data_source, _select) {
								if (Object.keys(data_source).length > 0) {
									for (var i in data_source) {
										ll_combo_manager.add_option_if_not_exist(_select, data_source[i].option_value, data_source[i].option_label);
									}
								}
							}, _select);
						});
					}else {
						$('body').click();
						var _select = container.closest('.fb-align-row').find('.fb-item-input select');
						ll_data_sources_manager.get_data_source($(this).attr('data-source-identifier'), $(this).attr('data-region-id'), function (data_source, _select) {
							if (Object.keys(data_source).length > 0) {
								for (var i in data_source) {
									ll_combo_manager.add_option_if_not_exist(_select, data_source[i].option_value, data_source[i].option_label);
								}
							}
						}, _select);
					}
				});
				callback();
			});
		}
	},
	handleChangeFieldAndOperator: function ($row, _fields_selector, val){
		if ( val == 'equals' || val == 'not_equal' || val == 'contains' || val == 'doesnot_contain'){
			$row.find('.fb-item-input').show();
			var selected_field_id = ll_combo_manager.get_selected_value(_fields_selector);
			var element_json = $('div[data-element-id="'+selected_field_id+'"]').data('json');
			if(val != 'has_value' && val != 'is_blank' && val != 'check' && val != 'doesnot_check'){
				if(typeof element_json != 'undefined' && typeof element_json.choicesDataSource != 'undefined' && element_json.choicesDataSource){
					var fieldsSelector = $(_fields_selector);
					var _select = fieldsSelector.parents('.fb-align-row').find('.fb-item-input select');
					ll_data_sources_manager.get_data_source(element_json.choicesDataSource, 0, function (data_source, _select) {
						if(Object.keys(data_source).length > 0){
							for(var i in data_source){
								ll_combo_manager.add_option_if_not_exist(_select, data_source[i].option_value, data_source[i].option_label);
							}
						}
					}, _select);
				}
			}
			var choices = formBuilderpage.getChoicesOfSelectedField(selected_field_id);
			if(choices){
				$row.find('.fb-import-data-source').show();
			}
			$row.removeClass('fb-align-row-large');
		} else {
			$row.find('.fb-item-input').hide();
			$row.find('.fb-import-data-source').hide();
			$row.addClass('fb-align-row-large');
		}
	},
	rulesActions: function (_conditions_selector, _fields_selector){
		ll_combo_manager.event_on_change(_conditions_selector, function(){
			var val = ll_combo_manager.get_selected_value($(this));
			var $row = $(this).parents('.fb-align-row');
			formBuilderpage.handleChangeFieldAndOperator($row, _fields_selector, val);
		});
		var other_fields = [];
		other_fields [0] = [];
		other_fields [0][0] = 0;
		other_fields [0][1] = '';
		var index = 1;
		$('.tpl-block').not('.info-form').not('.selected').each(function(){
			if($(this).data('type-el') != 'price'&& $(this).data('type-el') != 'page_break'&& $(this).data('type-el') != 'section_break' && $(this).data('type-el') != 'section_block' && $(this).data('type-el') != 'column_separator'){
				var opt = $(this).data('json');

				if($(this).data('type-el') == 'name'){
					var field = [];
					field [0] = opt.element_id+"_1";
					field [1] = opt.labelText+"."+opt.hints.nameFirst;
					other_fields [index] = field;
					index++;

					var field = [];
					field [0] = opt.element_id+"_2";
					field [1] = opt.labelText+"."+opt.hints.nameLast;
					other_fields [index] = field;
					index++;
				} else if ($(this).data('type-el') == 'address'){
					var field = [];
					field [0] = opt.element_id+"_1";
					field [1] = opt.labelText+"."+opt.hints.streetAddress1;
					other_fields [index] = field;
					index++;

					var field = [];
					field [0] = opt.element_id+"_2";
					field [1] = opt.labelText+"."+opt.hints.streetAddress2;
					other_fields [index] = field;
					index++;

					var field = [];
					field [0] = opt.element_id+"_3";
					field [1] = opt.labelText+"."+opt.hints.city;
					other_fields [index] = field;
					index++;

					var field = [];
					field [0] = opt.element_id+"_4";
					field [1] = opt.labelText+"."+opt.hints.state;
					other_fields [index] = field;
					index++;

					var field = [];
					field [0] = opt.element_id+"_5";
					field [1] = opt.labelText+"."+opt.hints.zipcode;
					other_fields [index] = field;
					index++;

					var field = [];
					field [0] = opt.element_id+"_6";
					field [1] = opt.labelText+"."+opt.hints.country;
					other_fields [index] = field;
					index++;
				} else {
					if($(this).data('type-el') != 'address' && $(this).data('type-el') != 'name') {
						var field = [];
						field [0] = opt.element_id;
						field [1] = opt.labelText;
						other_fields [index] = field;
						index++;
					}
				}
			}
		});
		ll_combo_manager.clear_all(_fields_selector);
		ll_combo_manager.add_options(_fields_selector, other_fields);
		ll_combo_manager.event_on_change(_fields_selector, function(){
			var parent = $(this).parents('.fb-align-row');
			var selected_field_id = ll_combo_manager.get_selected_value($(this));
			var choices = formBuilderpage.getChoicesOfSelectedField(selected_field_id);
			if(choices){
				var options = '';
				for(var j in choices){
					options += '<option value="'+choices[j]['option_value']+'">'+choices[j]['option_name']+'</option>';
				}
				parent.find('.fb-item-input').html('<select multiple>'+options+'</select>');
				ll_combo_manager.make_combo(parent.find('.fb-item-input select'), {
					is_auto_create_option: true,
					no_results_text: 'Press enter to add new value'
				});
			}else{
				parent.find('.fb-item-input').html('<select multiple></select>');
				ll_combo_manager.make_combo(parent.find('.fb-item-input select'), {
					is_auto_create_option: true,
					no_results_text: 'Press enter to add new value'
				});
			}
			if($('.tpl-block[data-element-id="'+selected_field_id+'"]').data('type-el') == 'boolean'){
				ll_combo_manager.clear_all(parent.find('.fb-has-value'));
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'check', 'Checked');
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'doesnot_check', 'Not Checked');
				formBuilderpage.handleChangeFieldAndOperator(parent, _fields_selector, 'check');
			}else{
				ll_combo_manager.clear_all(parent.find('.fb-has-value'));
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'has_value', 'Has a Value');
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'is_blank', 'Is Blank');
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'contains', 'Contains');
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'doesnot_contain', 'Does not Contain');
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'equals', 'Equals');
				ll_combo_manager.add_option_if_not_exist(parent.find('.fb-has-value'), 'not_equal', 'Does not Equal');
				formBuilderpage.handleChangeFieldAndOperator(parent, _fields_selector, 'has_value');
			}
		});
	},
	getChoicesOfSelectedField: function(id){
		var choices = '';
		$('.tpl-block').not('.info-form').each(function(){
			var opt = $(this).data('json');
			var element_id = opt.element_id;
			if(element_id == parseInt(id)){
				choices = opt.choices;
				return false;
			}
		});
		return choices;
	},
	setRuleBeforeOpen: function(){
		$('.fb-set-rule').html('<div class="fb-align-row clearfix">'+
			'<div class="fb-align-item">'+
			'<label>Choose Conditions:</label>'+
			'</div>'+
			'<div class="fb-align-item fb-item-select">'+
			'<select>'+
			'<option>Choose Field...</option>'+
			'</select>'+
			'</div>'+
			'<div class="fb-align-item fb-item-select">'+
			'<select class="fb-has-value">'+
			'<option value="has_value">Has a Value</option>'+
			'<option value="is_blank">Is Blank</option>'+
			'<option value="contains">Contains</option>'+
			'<option value="doesnot_contain">Does not Contain</option>'+
			'<option value="equals">Equals</option>'+
			'<option value="not_equal">Does not Equal</option>'+
			'</select>'+
			'</div>'+
			'<div class="fb-align-item fb-item-input">'+
			'<select multiple></select>'+
			'</div>'+
			'<div class="fb-align-item fb-remove-row"></div>'+
			'<div class="fb-align-item fb-import-data-source t-actions-dropdown t-actions-dropdown-orange">'+
			'<a href="javascript:void(0);" class="icon"></a>'+
			'<div class="ll-actions-dropdown">'+
			'<ul class="parent">'+
			'</ul>'+
			'</div>'+
			'</div>'+
			'</div>');
		ll_combo_manager.make_combo('.fb-set-rule .fb-align-row:last select', {
			is_auto_create_option: true,
			no_results_text: 'Press enter to add new value'
		});
	},
	setRuleViewFormula: function(){
		var formula = 'NOTBLANK(Field_Question)';
		alert(formula);
	},
	isRuleFieldShow: function(){
		if( $('.fb-set-rule .fb-item-input .txt-field:visible').length > 0){
			$('.fb-set-rule').toggleClass('fb-align-row-large');
		} else {
			$('.fb-set-rule.fb-align-row-large').toggleClass('fb-align-row-large');
		}
	},
	calculatedAction: function(){
		$('.fb-expression-list').children('li').on('click', function(e){
			e.preventDefault();
			var index = $(this).attr('idx');
			if ( index == 0 ){
				formBuilderpage.calculatedStartBoxAddFunction();
				$('.fb-box-add-function').animate({left: 0}, 150);
			} else {
				formBuilderpage.calculatedListField();
				$('.fb-box-add-field').animate({left: 0}, 150);
			}
		});
		$('.fb-wrap-field-add-function').on('click', '.fb-expression-choose-field', function(e){
			e.preventDefault();
			$('.fb-box-add-field').animate({left: 0}, 150);
			$(this).parents('.fb-field').addClass('fb-choose-field-active');
		});
		$('.fb-close-block').on('click', function(){
			$(this).parents('.fb-box-add-function, .fb-box-add-field').animate({left: '360px'}, 150);
		});
		$('#select-add-function').change(function(){
			var val = $(this).val();
			formBuilderpage.calculatedAddFieldFunction(val);
		});
		$('.fb-btn-set-expression').on('click', function(e){
			e.preventDefault();
			formBuilderpage.calculatedBeforeOpen();
		});
		$('.fb-list-add-field-expression').on('click', '.fb-btn-add-field-expression', function(e){
			e.preventDefault();
		});
		$('.fb-list-add-field-expression').on('click', 'li, .fb-btn-add-field-expression', function(e){
			e.preventDefault();
			e.stopPropagation();
			var text = $(this).find('em').text();
			var $choose = $('.fb-choose-field-active');
			
			$('.fb-box-add-field').css({left: '360px'});
			
			if ( $choose.length ){
				$choose.removeClass('fb-choose-field-active').find('.txt-field').val(text);
			} else {
				formBuilderpage.calculatedAddExpression(text);
			}
		});
		$('.fb-btn-add-expression-function').on('click', function(e){
			e.preventDefault();
			var type = $('#select-add-function option:selected').val();
			var ex = type+'(';
			$('.fb-wrap-field-add-function .fb-wrap-field .txt-field').each(function(i){
				var val = $.trim( $(this).val() );
				if( val != '' ){
					if ( i != 0){
						ex += ', ';
					}
					ex += val;
				}
			});
			ex +=')';
			formBuilderpage.calculatedAddExpression(ex);
			$('.fb-box-add-function').css({left: '360px'});
		});
	},
	calculatedAddExpression: function(expression){
		var $input = $('.fb-expression-input');
		var currentExpression = $.trim($input.val());
		var expression = currentExpression + expression;
		$input.val(expression);
	},
	calculatedBeforeOpen: function(){
		$('.fb-box-add-function, .fb-box-add-field').css({left: '360px'});
		$('.fb-expression-input').val('');
		$('.expression-result').text('Your expression will be validated here...');
	},
	calculatedStartBoxAddFunction:function(){
		$('#select-add-function option:first').attr('selected', true);
		$('#select-add-function').trigger('liszt:updated');
		$('.fb-wrap-field-add-function .fb-wrap-field').html('');
		formBuilderpage.calculatedAddFieldFunction('AND');
	},
	calculatedListField:function(){
		var $el = $('.wrap-tpl-block .tpl-block');
		var countField = 0;
		var $list = $('.fb-list-add-field-expression');
		$list.html('');
		
		$el.each(function(){
			var $tpl = $(this);
			var type = $tpl.attr('data-type-el');
			var opt = $tpl.data('json');
			var title = opt.defaultIdentifier;
			
			if( type != 'calculated'){
				countField++;
				$list.append('<li>'+
					'<span>'+title.replace("_", " ")+' <em>'+opt.identifier+'</em></span>'+
					'<a href="javascript:void(0);" class="fb-btn-add-field-expression"></a>'+
					'</li>');
			}
		});
		if (countField > 0){
			$('.fb-message-not-field-expression').hide();
		} else {
			$('.fb-message-not-field-expression').show();
		}
	},
	calculatedAddFieldFunction: function(type){
		var masField = [];
		var $box = $('.fb-wrap-field-add-function .fb-wrap-field');
		$box.html('');
		if ( type == 'AND' || type == 'AVERAGE' || type == 'CONCATENATE' || type == 'MAX' || type == 'MIN' || type == 'OR'){
			masField = ['Param 1', 'Param 2', 'Param 3', 'Param 4'];
		} else if ( type == 'CEIL' || type == 'FLOOR' || type == 'ISBLANK' || type == 'LENGTH' || type == 'LOWERCASE'
			|| type == 'NOTBLANK'){
			masField = ['Value'];
		} else if ( type == 'CONTAINS' ){
			masField = ['String', 'Sub-string'];
		} else if ( type == 'DEVICE_IDENTIFIER' || type == 'NOW'){
			masField = [];
		} else if ( type == 'IF'){
			masField = ['Condition', 'True branch', 'False branch'];
		} else if ( type == 'MOD' ){
			masField = ['Dividend', 'Divisor'];
		} else if ( type == 'POWER' ){
			masField = ['Base', 'Exponent'];
		} else if ( type == 'ROUND' ){
			masField = ['Value', 'Decimal places'];
		} else if ( type == 'SUBSTRING'){
			masField = ['Value', 'Position', 'Length'];
		} else if (type == 'YEAR' || type == 'MONTH' || type == 'DAY' || type == 'HOUR' || type == 'MINUTE' || type == 'SECOND'){
			masField = ['datetime'];
		} else if ( type == 'DATE'){
			masField = ['year', 'month', 'day'];
		} else if ( type == 'TIME'){
			masField = ['hour', 'minute', 'second'];
		} else if ( type == 'DATETIME'){
			masField = ['year', 'month', 'day', 'hour', 'minute', 'second'];
		} else if ( type == 'ADDYEARS' || type == 'ADDMONTHS' || type == 'ADDDAYS' || type == 'ADDHOURS' || type == 'ADDMINUTES' || type == 'ADDSECONDS'){
			masField = ['datetime', 'amount'];
		} else if ( type == 'TIMESTAMP' || type == 'GEOSTAMP'){
			masField = ['Question'];
		} else if ( type == 'LATITUDE' || type == 'LONGITUDE'){
			masField = ['Location'];
		}
		for( var i = 0; i < masField.length; i++){
			
			$box.append('<div class="fb-field">'+
				'<label>'+
				masField[i]+
				'<a href="javascript:void(0);" class="fb-expression-choose-field">choose field</a>'+
				'</label>'+
				'<input id="param'+i+'" type="text" class="txt-field"/>'+
				'</div>');
		}
	},
	pageBreakInit: function(){
		formBuilderpage.pageBreakDestroy(false);
		formBuilderpage.is_wizard = true;
		$('#previous-button-text-container').show();
		$('#next-button-text-container').show();
		var $el = $('.fb-wrap-columns-form .fb-page-break');
		var count = $el.length + 1;
		formBuilderpage.wizard_no_of_pages = count;
		var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		var optGlobal = $tplGlobal.data('json');
		
		if($el.length){
			$('#wrap-form-submit-button').prepend('<a href="javascript:void(0);" class="t-btn-orange fb-prev-page-section">Previous</a> <a href="javascript:void(0);" class="t-btn-orange fb-next-page-section">Next</a>');
			$('#wrap-form-submit-button').prepend('<div class="fb-step-text-page">Step <span>1</span> of '+count+'</div>');
			
			$('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
				'background-color': optGlobal.btnBackground,
				'border-style': optGlobal.btnBorderStyle.toLowerCase(),
				'border-width': optGlobal.btnBoderWidth + 'px',
				'border-color': optGlobal.btnBorderColor,
				'border-radius': optGlobal.btnBorderRadius + 'px',
				'-webkit-border-radius': optGlobal.btnBorderRadius + 'px',
				'-moz-border-radius': optGlobal.btnBorderRadius + 'px',
				'font-size': optGlobal.btnSize + 'px',
				'color': optGlobal.btnColor
			});
			if($.inArray(optGlobal.btnFont, STANDARD_FONTS)== -1){
				$('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
					'font-family': optGlobal.btnFont
				});
			} else {
				$('#wrap-form-submit-button').find('.fb-next-page-section, .fb-prev-page-section').css({
					'font-family': optGlobal.btnFont + ', sans-serif'
				});
			}
			$el.each(function(i){
				var $this = $(this);
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
						if( $(this).hasClass('fb-page-break') ){
							stop = true;
							return false;
						} else {
							return this;
						}
						
					});
					
					if ($all.length){
						$all.wrapAll('<div class="fb-page-step-section"/>');
					} else {
						$this.after('<div class="fb-page-step-section"></div>');
					}
				} else {
					$this.after('<div class="fb-page-step-section"></div>');
				}
				$this.hide();
			});
		}
		formBuilderpage.show_submit_button_if_last_wizard_page();
		$('.fb-prev-page-section').hide();
		formBuilderpage.pageBreakAction();
		$('#inline_wizard_switch').show();
		$('#inline_wizard_switch').text('Inline');
	},
	show_submit_button_if_last_wizard_page: function (){
		$('.form-submit-button').hide();
		$('.fb-page-step-section').each(function(index){
			if($(this).hasClass('fb-selected') && index == $('.fb-wrap-columns-form .fb-page-break').length){
				$('.form-submit-button').show();
			}
		});
	},
	pageBreakAction: function(){
		$('.fb-prev-page-section').on('click', function(e){
			e.preventDefault();
			var $page = $('.fb-page-step-section');
			var length = $page.length;
			var indexPage = $page.index($page.filter('.fb-selected'));
			
			if(indexPage > 0){
				$page.filter('.fb-selected').removeClass('fb-selected').prevAll('.fb-page-step-section:first').addClass('fb-selected');
			}
			var newIndex = $page.index($page.filter('.fb-selected'));
			
			if(newIndex > 0){
				$(this).show();
			} else{
				$(this).hide();
			}
			if( newIndex+1 == length ){
				$('.fb-next-page-section').hide();
			} else{
				$('.fb-next-page-section').show();
			}
			$('.fb-step-text-page span').text(newIndex+1);
			formBuilderpage.show_submit_button_if_last_wizard_page();
		});
		$('.fb-next-page-section').on('click', function(e){
			e.preventDefault();
			var $page = $('.wrap-tpl-block .fb-page-step-section');
			var length = $page.length;
			var indexPage = $page.index($page.filter('.fb-selected'));
			
			if(indexPage+1 < length){
				$page.filter('.fb-selected').removeClass('fb-selected').nextAll('.fb-page-step-section:first').addClass('fb-selected');
			}
			var newIndex = $page.index($page.filter('.fb-selected'));
			
			if(newIndex+1 < length){
				$(this).show();
			} else{
				$(this).hide();
			}
			if( newIndex+1 == 1 ){
				$('.fb-prev-page-section').hide();
			} else{
				$('.fb-prev-page-section').show();
			}
			$('.fb-step-text-page span').text(newIndex+1);
			formBuilderpage.show_submit_button_if_last_wizard_page();
		});
	},
	pageBreakDestroy: function(is_temp){
		var parent = '';
		if(is_temp){
			parent = '#form_html_temp ';
		}
		formBuilderpage.is_wizard = false;
		$(parent+'.fb-page-step-section').each(function(){
			var $el = $(this).children().detach();
			$(this).replaceWith($el);
		});
		$(parent+'.fb-wrap-columns-form .fb-page-break').show();
		$(parent+'.fb-prev-page-section, '+parent+'.fb-next-page-section, '+parent+'.fb-step-text-page').remove();
		$(parent+'.form-submit-button').show();
		if(parent == ''){
			$('#inline_wizard_switch').show();
			$('#inline_wizard_switch').text('Wizard');
		}
	},
	redirectCompetitors: function(){
		formBuilderpage.isCountMultipleField( $('.fb-rus-competitors') );
		var $checkRedirectCompetitors = $('#check-redirect-competitors');
		var $checkRusCompetitors = $('#check-rus-competitors');
		
		if ( $checkRedirectCompetitors.is(':checked') ){
			$('.fb-box-redirect-competitors').show();
			
			if ( $checkRusCompetitors.is(':checked') ){
				$('.fb-rus-competitors').show();
			} else{
				$('.fb-rus-competitors').hide();
			}
		} else {
			$('.fb-box-redirect-competitors').hide();
		}
		
		formBuilderpage.redirectCompetitorsAction();
	},
	redirectCompetitorsAction: function(){
		var $checkRedirectCompetitors = $('#check-redirect-competitors');
		var $checkRusCompetitors = $('#check-rus-competitors');
		
		$checkRedirectCompetitors.on('click', function(){
			if ( $(this).is(':checked') ){
				$('.fb-box-redirect-competitors').show();
			} else {
				$('.fb-box-redirect-competitors').hide();
			}
			if ( $checkRusCompetitors.is(':checked') ){
				$checkRusCompetitors.click();
				ll_theme_manager.checkboxRadioButtons.isChecked($checkRusCompetitors,true);
			} else {
				$('.fb-rus-competitors').hide();
			}
		});
		$checkRusCompetitors.on('click', function(){
			if ( $(this).is(':checked') ){
				$('.fb-rus-competitors').show();
			} else{
				$('.fb-rus-competitors').hide();
			}
			$('.fb-rus-competitors').find('.t-field:not(:eq(0))').remove();
			$('.fb-rus-competitors').find('input').val('');
			formBuilderpage.isCountMultipleField( $('.fb-rus-competitors') );
			
		});
	},
	btnSubmitAction:function(){
		$('.form-submit-button').on('click', function(e){
			e.preventDefault();
			
			$('#fb-tabs-settings li a').eq(2).trigger('click');
			$('.fb-right-panel-slide.active').removeClass('active').css({left: '589px'}).hide();
			$('.wrap-panels-el').css('z-index','-1');
			
			var $styleBlock = $('#fb-form-style-global');
			var destination = $('#fb-global-style-botton').offset().top;
			$styleBlock.scrollTop(destination);
		});
	},
	actionsBtnBlock: function(){
		$('.add_new_user').click(function(){
			ll_device_invitation_manager.open_popup('on_the_fly', function (user) {
				(left_side_popups_helper.on_the_fly_created_users).push(user.userID);
				ll_combo_manager.add_option(' select[name="device_forms_users"]', user.userID, user.firstName + ' ' + user.lastName);
				var already_selected_users = ll_combo_manager.get_selected_value(' select[name="device_forms_users"]');
				if(already_selected_users){
					already_selected_users.push(user.userID);
				} else {
					already_selected_users = [user.userID];
				}
				ll_combo_manager.set_selected_value(' select[name="device_forms_users"]', already_selected_users);
			}, function () {
			}, form_id);
		});
		$('.eb-wrap-form-page').on('click','.tpl-block', function(e){
			e.preventDefault();
			e.stopPropagation();
			var $block = $(this);
			var type = $block.data('type-el');
			var element_id = $block.attr('id');
			var typeSlide = type;
			
			var has_edit_permission = true;
			var edit_default_value_only = false;
			if(parseInt($block.attr('data-element-id')) < parseInt(next_element_id)) {
				if ((is_device_form || is_event_template) && !CHANGE_ELEMENTS_PERMISSION) {
					has_edit_permission = false;
				}
				if (!formBuilderpage.chk_element_action_permission($block, 'EDIT')) {
					has_edit_permission = false;
				}
				if(!has_edit_permission && formBuilderpage.chk_edit_default_permission($block)){
					has_edit_permission = true;
					edit_default_value_only = true;
				}
			}
			if(!has_edit_permission){
				show_error_message(' You do not have permission to edit Elements.');
				return;
			}
			
			if ( !$block.hasClass('selected') ){
				$('#fb-tabs-settings li').eq(0).trigger('click');
				if( !$block.hasClass('info-form') ){
					$('.wrap-panels-el').css('z-index','1');
					formBuilderpage.removeFieldFormTitDesc();
				} else {
					$('.wrap-panels-el').css('z-index','-1');
					formBuilderpage.addFieldFormTitDesc();
				}
				if( $('.fb-right-panel-slide.active').length ){
					$('.fb-right-panel-slide.active').removeClass('active').animate({left: '589px'}, 300,function(){
						$(this).hide();
						$('.fb-right-panel-slide').addClass('active').show().animate({left: 0},300);
					});
				} else{
					$('.fb-right-panel-slide').addClass('active').show().animate({left: 0},300);
				}
			} else {
				if( $block.hasClass('info-form') ){
					formBuilderpage.addFieldFormTitDesc();
				}
			}
			
			$('.tpl-block').removeClass('selected');
			$block.addClass('selected');
			var formType = 'normal';
			if($(this).find('.tpl-block-edit').attr('form-type') == 'donation'){
				formType = 'donation';
			}else if($(this).find('.tpl-block-edit').attr('form-type') == 'payment'){
				formType = 'payment';
			}
			formBuilderpage.editElementTpl(type, element_id, formType);
			if(edit_default_value_only){
				var $slide = $('.fb-right-panel-slide');
				$('.fb-panel-content .fb-settings .fb-field').hide();
				$slide.find('#element_default_value').show();
			}
		});
		
		$('.info-form').click(function(){
			$('.form-builder .tabs-editor > ul li:nth-child(2)').click();
		});
		
		$('.eb-wrap-form-page').on('click','.tpl-block-move', function(e){
			e.preventDefault();
			e.stopPropagation();
		});
		$('.eb-wrap-form-page').on('click','.tpl-block-edit', function(e){
			e.preventDefault();
			if ( $(this).parents('.info-form.selected').length){
				if( $('.info-form').find('.t-field').length ){
					e.stopPropagation();
					formBuilderpage.removeFieldFormTitDesc();
					formBuilderpage.check_empty_title_and_description();
				}
			}
		});
		$('.eb-wrap-form-page').on('click','.tpl-block-clone', function(e){
			e.preventDefault();
			e.stopPropagation();
			formBuilderpage.elementsClone($(this));
		});
		$('.eb-wrap-form-page').on('click','.tpl-block-delete', function(e){
			e.preventDefault();
			e.stopPropagation();
			var $block = $(this).closest(".tpl-block");
			var $parent = $block.parents(".tpl-block");
			if(parseInt($block.attr('data-element-id')) < parseInt(next_element_id)) {
				if ((is_device_form || is_event_template) && !REMOVE_ELEMENTS_PERMISSION) {
					show_error_message(' You do not have permission to remove Elements.');
					return;
				}
				if (!formBuilderpage.chk_element_action_permission($block, 'DELETE')) {
					show_error_message(' You do not have permission to remove Elements.');
					return;
				}
			}
			
			if(! $(this).hasClass('form_info')){
				if($block.hasClass("selected") || $block.find(".tpl-block.selected").length){
					$('.fb-right-panel-slide.active').removeClass('active').css({left: '589px'}).hide();
					$('.wrap-panels-el').css('z-index','-1');
				}
				delete formBuilderpage.used_mapped_fields [$(this).parents('.tpl-block').attr('id')];
				$parent.removeClass("hide-controls");
				$block.remove();
				
				formBuilderpage.showHideInfBlock();
				
				if($('.eb-wrap-form-page .fb-page-break').length <= 0){
					formBuilderpage.pageBreakDestroy(false);
					$('#inline_wizard_switch').hide();
					$('#inline_wizard_switch').text('Inline');
					$('#previous-button-text-container').hide();
					$('#next-button-text-container').hide();
				}
			}else{
				$('.info-form').hide();
				$('#fb-form-title').val('');
				$('.form-desc').text('');
				$('.form-tit').text('');
				$('#fb-form-description').val('');
			}
			formBuilderpage.triggerChangeInForm();
		});
	},
	checkRadioBoxColumn: function(value, $box){
		// console.log(value);
		var classColumn = 'fb-3-columns-chekboxes-radio';
		
		if (value == '2'){
			classColumn = 'fb-2-columns-chekboxes-radio';
		} else if( value == '4' ){
			classColumn = 'fb-4-columns-chekboxes-radio';
		} else if( value == '5' ){
			classColumn = 'fb-5-columns-chekboxes-radio';
		}
		
		$box.removeClass('fb-2-columns-chekboxes-radio fb-3-columns-chekboxes-radio fb-4-columns-chekboxes-radio fb-5-columns-chekboxes-radio').addClass(classColumn);
	},
	clean_form_html: function (){
		var form_html = $('.eb-wrap-form-page').html();
		$('#form_html_temp').html(form_html);
		formBuilderpage.pageBreakDestroy(true);
		$('#form_html_temp .tpl-block-controls').remove();
		$('#form_html_temp .fb-dragenddrop-box').remove();
		$('#form_html_temp .fb-dragenddrop-box-text').remove();
		$('#form_html_temp .fb-wrap-columns-form').removeAttr('data-json');
		
		$('#form_html_temp .fb-wrap-columns-form').removeAttr('data-font-names');
		$('#form_html_temp .tpl-block').removeAttr('data-json');
		$('#form_html_temp .tpl-block.selected').removeClass('selected');
		$('<form_open_tag></form_open_tag>').insertBefore('#form_html_temp .wrap-tpl-block');
		$('<form_close_tag></form_close_tag>').insertAfter('#form_html_temp #wrap-form-submit-button');
		//$('<captcha_if_required></captcha_if_required>').insertBefore('#form_html_temp .wrap-tpl-block div:last-child');
		
		// Emad Atya - Support Ticket SUPPORT !VLJ-638-22911
		// In multi column forms, the reCaptcha control was getting added multiple times, so fixing it to only add the reCaptcha tag to the first column in the form.
		$('#form_html_temp .wrap-tpl-block:first').append('<captcha_if_required></captcha_if_required>');
		
		$('#form_html_temp .wrap-tpl-block .tpl-block').each(function(){
			var token = $(this).attr('data-src-token');
			$(this).replaceWith(' %%'+token+'%% ');
		});
		if($('#form_html_temp .fb-wrap-columns-form').attr('data-font-references')){
			var custom_fonts_files = JSON.parse($('#form_html_temp .fb-wrap-columns-form').attr('data-font-references'));
			if(custom_fonts_files){
				for (var i in custom_fonts_files){
					var font_file = custom_fonts_files[i];
					if(font_file){
						$('#form_html_temp').prepend('<link href="'+font_file+'" rel="stylesheet" />');
					}
				}
			}
			$('#form_html_temp .fb-wrap-columns-form').removeAttr('data-font-references');
		}
		
		return $('#form_html_temp').html();
	},
	freeImages: function (page, searchValue, isMoreLoad, parent) {
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
			
			// console.log(data);
			$.each(data, function (key, val) {
				var imgURL = val.urls.regular;
				items += "<li class='list-free-images__item' id='" + key + "' style='background-image: url(" + imgURL + ")' data-url='" + imgURL + "'></li>";
			});
			
			if (isMoreLoad)
				$list.append(items);
			else
				$list.html(items);
			
			$list.find('li.list-free-images__item').click(function() {
				var selected_img_url = $(this).attr('data-url');
				$('.tool-col .eb-inner-tool').show();
				$('.unsplash-right-panel').hide();
				formBuilderpage.addHTMLImage(parent, selected_img_url, selected_img_url, '100 X 100');
			});
		}).done(function () {
			
		}).fail(function () {
			
		}).always(function () {
			$btn.removeClass('disabled');
			
			if ($list.find('li').length)
				$btn.show();
			else
				$btn.hide();
			
		});
		//Access Key
		//1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb
	},
	draw_barcode_provider_type_authentication_info: function (barcode_provider_type_id) {
		if(barcode_provider_type_id){
			var barcode_provider_type = ll_supported_barcode_provider_types[barcode_provider_type_id];
			if(barcode_provider_type){
				var authentication_info = barcode_provider_type['authentication_info'];
				$('.element_barcode_provider_type_authentication_info').html('');
				var _html = '';
				_html += '<div class="fb-field element_barcode_provider_type_authentication_field" style="padding-top: 0px;" data-provider-type-id="'+barcode_provider_type_id+'">';
				_html += '	<label class="ll_std_tooltip" title="'+ tooltip +'" ></label>';
				_html += '	<div class="fb-right">';
				_html += '		<div class="eb-inner-field">';
				_html += '			<a href="javascript:void(0);"  id="test_barcode_btn">Test scan</a>';
				_html += '		</div>';
				_html += '	</div>';
				_html += '</div>';
				$('.element_barcode_provider_type_authentication_info').append(_html);
				if(Object.keys(authentication_info).length > 0){
					var api_call_snooze = {
						"label" : 'API Call Snooze',
						"field_type": 'number',
						"placeholder": '',
						"value_type": 'number',
						"required": '',
						"tooltip": 'Some providers do not allow more than one scan (API call) to their web service within a specified time period. Use this feature to capture leads without any time constraints. We\'ll queue the calls on our backend, and snooze consecutive calls based on the number of seconds you specify in this field.'
					};
					authentication_info['api_call_snooze'] = api_call_snooze;
					ll_supported_barcode_provider_types[barcode_provider_type_id]['api_call_snooze'] = api_call_snooze;
					for (var i in authentication_info){
						var info = authentication_info[i];
						var tooltip = '';
						if(typeof info['tooltip'] != 'undefined' && info['tooltip']){
							tooltip = info['tooltip'];
						}
						var _html = '';
						_html += '<div class="fb-field element_barcode_provider_type_authentication_field" data-provider-type-id="'+barcode_provider_type_id+'">';
						_html += '	<label class="ll_std_tooltip" title="'+ tooltip +'" >'+info['label']+'</label>';
						_html += '	<div class="fb-right">';
						_html += '		<div class="eb-inner-field">';
						switch(info['field_type']){
							case 'text':
								_html += '	<input type="text" class="txt-field barcode_provider_authentication_info" name="'+i+'" value=""/>';
								break;
							case 'select':
								_html += '	<select class="txt-field barcode_provider_authentication_info" name="'+i+'"></select>';
								break;
							case 'number':
								_html += '	<input type="number" class="txt-field barcode_provider_authentication_info" name="'+i+'" value=""/>';
								break;
						}
						_html += '		</div>';
						_html += '	</div>';
						_html += '</div>';
						$('.element_barcode_provider_type_authentication_info').append(_html);
						ll_combo_manager.make_combo('.element_barcode_provider_type_authentication_info select');
						ll_combo_manager.add_option('.element_barcode_provider_type_authentication_info select[name="'+i+'"]', '0', info['placeholder']);
						if(ll_barcode_sets.length > 0){
							for(var j in ll_barcode_sets){
								var ll_barcode_set = ll_barcode_sets[j];
								ll_combo_manager.add_option('.element_barcode_provider_type_authentication_info select[name="'+i+'"]', ll_barcode_set.id, ll_barcode_set.name);
							}
						}
					}
					apply_ll_tooltip('.element_barcode_provider_type_authentication_info');
					$('.barcode_provider_authentication_info').unbind('change keypress');
					$('.barcode_provider_authentication_info').bind('change keypress', function(){
						var $tpl = $('.tpl-block.selected');
						var opt = $tpl.data('json');
						if(typeof opt.barcode_provider_authentication_info == 'undefined'){
							opt.barcode_provider_authentication_info = {};
						}
						opt.barcode_provider_authentication_info[$(this).attr('name')] = $(this).val();
						formBuilderpage.set_elemenet_data($tpl, opt);
					});
				}

				$('#test_barcode_btn').click(function(){
					auth_data = [];
					var $tpl = $('.tpl-block.selected');
					var opt = $tpl.data('json');
					if(typeof opt.barcode_provider_authentication_info !== 'undefined'){
						auth_data = opt.barcode_provider_authentication_info ;
					}
					$('#textarea_edit_element_choices').val('');
					test_scan_manager.open(barcode_provider_type_id, auth_data);
				});
			}
		}
	},
	get_form_properties: function (){
		var form_properties = {};
		var form_name = $('input[name="form_name"]').val();
		if(! form_name){
			show_error_message(''+formBuilderpage.form_lbl+' name required');
			return false;
		}
		form_properties.form_name = form_name;
		form_properties.form_title = $('input[name="form_title"]').val();
		form_properties.form_description = $('textarea[name="form_description"]').val();
		form_properties.ll_layout_template_id = ll_combo_manager.get_selected_value('#layout_templates');
		form_properties.ll_abstract_campaign_id = ll_combo_manager.get_selected_value('#campaigns');
		form_properties.vanity_url_id = ll_combo_manager.get_selected_value('#web-form-vanity-url-id');
		form_properties.form_submit_button_text = $('input[name="form_submit_button_text"]').val();
		form_properties.form_frame_height = $('.tpl-container').height();
		
		form_properties.form_redirect = '';
		if($('input[name="success_message"]:checked').val() == 'text'){
			form_properties.form_success_message = $('textarea[name="form_success_message"]').val();
		}else if($('input[name="success_message"]:checked').val() == 'url'){
			form_properties.form_redirect = $('input[name="form_redirect"]').val();
		}
		
		form_properties.form_redirect_competitors_to_different_url = 0;
		form_properties.ll_domain_list_id = 0;
		form_properties.donot_accept_submission = 0;
		if($('input[name="form_redirect_competitors_to_different_url"]').is(':checked')){
			if($('input[name="form_competitors_redirect"]').val() == ''){
				show_error_message('Please enter redirect URL');
				$('ul#fb-tabs-settings li').eq(1).click();
				$('input[name="form_competitors_redirect"]').focus();
				return false;
			}
			form_properties.form_redirect_competitors_to_different_url = 1;
			form_properties.form_competitors_redirect = $('input[name="form_competitors_redirect"]').val();
			form_properties.ll_domain_list_id = ll_combo_manager.get_selected_value('#domains');
			if($('input[name="donot_accept_submission"]').is(':checked')){
				form_properties.donot_accept_submission = 1;
			}
		}
		form_properties.form_specific_competitors_domains = [];
		if($('input[name="form_specific_competitors_domains"]').is(':checked')){
			var competitors = [];
			$('input[name="competitor"]').each(function(){
				competitors.push($(this).val());
			});
			if(competitors.length == 0){
				show_error_message('Please add at least one valid competitor email domain');
				return false;
			}else{
				form_properties.form_specific_competitors_domains = competitors;
			}
		}
		form_properties.form_specific_email_addresses = [];
		if($('input[name="form_specific_email_addresses"]').is(':checked')){
			var email_addresses = [];
			$('input[name="specific_email_address"]').each(function(){
				email_addresses.push($(this).val());
			});
			if(email_addresses.length == 0){
				show_error_message('Please add at least one valid email address');
				return false;
			}else{
				form_properties.form_specific_email_addresses = email_addresses;
			}
		}
		
		form_properties.form_success_js_code = $('textarea[name="form_success_js_code"]').val();
		form_properties.form_pre_submit_code = $('textarea[name="form_pre_submit_code"]').val();
		form_properties.form_submit_error_message = $('textarea[name="form_submit_error_message"]').val();
		form_properties.archive_date = ll_date_picker_manager.get_selected_date_text('input[name="form_archive_date"]');
		form_properties.event_from_date = ll_date_picker_manager.get_selected_date_text('input[name="event_from_date"]');
		form_properties.event_to_date = ll_date_picker_manager.get_selected_date_text('input[name="event_to_date"]');
		form_properties.event_owner = ll_combo_manager.get_selected_value('select[name="event_owner"]');
		form_properties.labels = $('input[name="selected_labels"]').val();
		form_properties.ll_list_id = ll_combo_manager.get_selected_value('select[name="ll_lists"]');
		form_properties.device_form_address_txt = $('input[name="device_form_address"]').val();
		//formBuilderpage.device_form_address = ll_google_address_manager.address;
		if($('.fb-form-properties .device_form_address_details').is(":visible")) {
			formBuilderpage.device_form_address.city = $('.fb-form-properties #fb-device_form_city').val();
			formBuilderpage.device_form_address.state_code = $('.fb-form-properties #fb-device_form_state').val();
			formBuilderpage.device_form_address.zipcode = $('.fb-form-properties #fb-device_form_zip').val();
			formBuilderpage.device_form_address.country = '';
			formBuilderpage.device_form_address.country_code = ll_combo_manager.get_selected_value('.fb-form-properties #fb-device_form_country');
			if(formBuilderpage.device_form_address.country_code){
				formBuilderpage.device_form_address.country = ll_combo_manager.get_selected_text('.fb-form-properties #fb-device_form_country');
			}
			formBuilderpage.device_form_address.address_line1 = $('.fb-form-properties #fb-device_form_street_address').val();
			formBuilderpage.device_form_address.street_address = $('.fb-form-properties #fb-device_form_street_address').val();
			formBuilderpage.device_form_address.address = '';
		}
		
		form_properties.device_form_address = formBuilderpage.device_form_address;
		
		var style = {};
		style.background_img = $('.cover-image .pb-image__icn').attr('src-img');
		style.capture_background_img = $('.capture-background-image .pb-image__icn').attr('src-img');
		style.event_text_color = formBuilderpage.rgb2hex($('#event_text_color').css( "background-color" ));
		style.elements_label_color = formBuilderpage.rgb2hex($('#elements_label_color').css( "background-color" ));
		style.capture_background_color = formBuilderpage.rgb2hex($('#capture_background_color').css( "background-color" ));
		style.is_enable_screensaver = $('#is_enable_screensaver').is(':checked') ? '1' : '0';
		style.rotation_period = $('#rotation_period_value').val();
		style.is_randomize = $('#is_randomize').is(':checked') ? '1' : '0';
		style.switch_frequency = $('#switch_frequency').val();
		style.transition_effect = ll_combo_manager.get_selected_value('#transition_effect');
		style.element_background_color = '';
		if($('input[name="has_field_background"]').is(':checked')){
			style.element_background_color = formBuilderpage.rgb2hex($('#capture_field_background').css( "background-color" ));
			style.element_background_mode = $('input[name="element_background_mode"]:checked').val();
			style.element_background_opacity = $('input[name="element_background_opacity"]').val();
			if(style.element_background_opacity < 0 || style.element_background_opacity > 1 ){
				show_error_message('Opacity should be between 0.0 to 1.0 ');
				return false;
			}
		}
		var screensaver_images = [];
		$('.screensaver-img .pb-image__icn').each(function () {
			screensaver_images.push( $(this).attr('src-img'));
		});
		style.screensaver_images = screensaver_images;
		style.has_buttons_menu = $('#has_event_buttons_menu').is(':checked') ? 1 : 0;
		style.has_floating_buttons = $('#has_event_floating_buttons').is(':checked') ? 1 : 0;
		var buttons_menu = [];
		var floating_buttons = [];
		if(style.has_buttons_menu){
			var order = 1;
			var no_selection = 1;
			$('#buttons-menu-div input').each(function () {
				var show = $(this).is(':checked') ? 1 : 0;
				var label = $(this).parent('label').text();
				var type = $(this).attr('button-type');
				if(type != 'scan' || (type == 'scan' && (formBuilderpage.get_no_of_elements('barcode') > 0 || formBuilderpage.get_no_of_elements('business_card') > 0))) {
					buttons_menu.push({"type": type, "show": show, "label": label, "order": order });
					order++;
				}
				if(show){
					no_selection = 0;
				}
			});
		}
		style.buttons_menu = buttons_menu;
		if(no_selection){
			style.has_buttons_menu = 0;
		}
		if(style.has_floating_buttons){
			var order = 1;
			var no_selection = 1;
			$('#floating-buttons-div input').each(function () {
				var show = $(this).is(':checked') ? 1 : 0;
				var label = $(this).parent('label').text();
				var type = $(this).attr('button-type');
				if(type != 'scan' || (type == 'scan' && (formBuilderpage.get_no_of_elements('barcode') > 0 || formBuilderpage.get_no_of_elements('business_card') > 0))) {
					floating_buttons.push({"type": type, "show": show, "label": label, "order": order });
					order++;
				}
				if(show){
					no_selection = 0;
				}
			});
		}
		style.floating_buttons = floating_buttons;
		if(no_selection){
			style.has_floating_buttons = 0;
		}
		style.theme = ll_combo_manager.get_selected_value('#theme');
		style.search_list_background_color = '';
		style.search_list_text_color = '';
		if(! ($('#is_use_theme_style_search_list').is(':checked')) && ll_combo_manager.get_selected_value('select[name="ll_lists"]') != 0){
			style.search_list_background_color = formBuilderpage.rgb2hex($('#element_background_color_search_list').css( "background-color" ));
			style.search_list_text_color = formBuilderpage.rgb2hex($('#element_text_color_search_list').css( "background-color" ));
		}
		form_properties.event_style = style;
		if(left_side_popups_helper.attr_to_be_deleted.length > 0) {
			form_properties.attr_to_be_deleted = left_side_popups_helper.attr_to_be_deleted;
		}
		form_properties.custom_attributes = left_side_popups_helper.collect_custom_attributes('#custom_attributes_container');
		if(form_properties.custom_attributes === false ){
			show_error_message('Duplicate custom attributes');
			return false;
		}
		new_users_event_access = ll_combo_manager.get_selected_value('select[name="device_forms_users"]');
		if(new_users_event_access == null || typeof new_users_event_access == 'undefined') {
			new_users_event_access = {};
		}
		if(access_form_users == null || typeof access_form_users == 'undefined') {
			access_form_users = {};
		}
		form_properties.users_event_access_add = $.grep(new_users_event_access, function(el){return $.inArray(parseInt(el), access_form_users) == -1});
		form_properties.users_event_access_delete = $.grep(access_form_users, function(el){return $.inArray(String(el), new_users_event_access) == -1});
		form_properties.on_the_fly_created_users = left_side_popups_helper.on_the_fly_created_users;
		form_properties.template_user_access = new_users_event_access;
		
		form_properties.form_captcha = 0;
		if($('input[name="form_captcha"]').is(':checked')){
			form_properties.form_captcha = 1;
		}
		
		form_properties.form_prefill_fields = 0;
		if($('input[name="form_prefill_fields"]').is(':checked')){
			form_properties.form_prefill_fields = 1;
		}
		
		form_properties.form_ti_prefill_fields = 0;
		if($('input[name="form_ti_prefill_fields"]').is(':checked')){
			form_properties.form_ti_prefill_fields = 1;
		}
		
		form_properties.form_is_disable_cookies = 0;
		if($('input[name="form_is_disable_cookies"]').is(':checked')){
			form_properties.form_is_disable_cookies = 1;
		}
		
		form_properties.is_donot_accept_personal_emails = 0;
		if($('input[name="is_donot_accept_personal_emails"]').is(':checked')){
			form_properties.is_donot_accept_personal_emails = 1;
			form_properties.personal_email_error_message = $('textarea[name="personal_email_error_message"]').val();
		}
		
		form_properties.is_mobile_kiosk_mode = 0;
		form_properties.is_mobile_quick_capture_mode = 0;
		switch ($('input[name="device_form_mode"]:checked').val()){
			case 'normal':
				break;
			case 'quick_capture':
				form_properties.is_mobile_kiosk_mode = 1;
				form_properties.is_mobile_quick_capture_mode = 1;
				break;
			case 'kiosk':
				form_properties.is_mobile_kiosk_mode = 1;
				break;
		}
		
		form_properties.device_owner_option = $('input[name="device_owner_option"]:checked').val();
		form_properties.device_owner_option_specific_userID = 0;
		if(form_properties.device_owner_option == DEVICE_OWNER_OPTION_SPECIFIC_USER){
			form_properties.device_owner_option_specific_userID = ll_combo_manager.get_selected_value('select[name="device_owner_option_specific_user"]');
		}
		form_properties.assign_owner_even_if_prospect_exists = 0;
		if($('input[name="assign_owner_even_if_prospect_exists"]').is(':checked')){
			form_properties.assign_owner_even_if_prospect_exists = 1;
		}
		form_properties.is_enable_rapid_scan_mode = 0;
		if($('input[name="is_enable_rapid_scan_mode"]').is(':checked')){
			form_properties.is_enable_rapid_scan_mode = 1;
		}
		form_properties.is_localized = 0;
		if($('input[name="is_localized"]').is(':checked')){
			form_properties.is_localized = 1;
		}
		
		form_properties.form_is_resubmit_wait = 0;
		form_properties.form_resubmit_wait_count = 1;
		form_properties.form_resubmit_wait_period = 'minute';
		if($('input[name="form_resubmit_wait_enable"]').is(':checked')){
			form_properties.form_is_resubmit_wait = 1;
			form_properties.form_resubmit_wait_count = $('input[name="form_resubmit_wait_count"]').val();
			form_properties.form_resubmit_wait_period = ll_combo_manager.get_selected_value('#form_resubmit_wait_period');
			form_properties.form_resubmit_error_message = $('textarea[name="duplicate_submission_error_message"]').val();
		}
		
		/*form_properties.is_enable_email_validation = 0;
		 form_properties.email_validation_timeout = 1;
		 if($('input[name="is_enable_email_validation"]').is(':checked')){
		 form_properties.is_enable_email_validation = 1;
		 form_properties.email_validation_timeout = $('input[name="email_validation_timeout"]').val();
		 }*/
		
		form_properties.form_is_apply_success_at_parent = 0;
		if($('input[name="form_is_apply_success_at_parent"]').is(':checked')){
			form_properties.form_is_apply_success_at_parent = 1;
		}
		
		if(form_type == DONATION_HOSTED_WEB_FORM_TYPE || form_type == PAYMENT_HOSTED_WEB_FORM_TYPE){
			form_properties.payment_gateway_account_id = ll_combo_manager.get_selected_value('#payment_accounts');
			form_properties.is_recurring = 0;
			form_properties.selected_recurring_plans = {};
			if($('input[name="is_recurring"]').is(':checked')){
				form_properties.is_recurring = 1;
				$('.accounts_selected_plans[data-src-account-id='+form_properties.payment_gateway_account_id+'] .recurring_plan').each(function(index){
					if($(this).is(':checked')){
						form_properties.selected_recurring_plans[index] = $(this).attr('data-plan-id');
					}
				});
			}
			if(! form_properties.payment_gateway_account_id){
				show_error_message('Payment Account required!');
				return false;
			}
		}
		if(form_type == PAYMENT_HOSTED_WEB_FORM_TYPE){
			var form = $('.fb-wrap-columns-form');
			var opt = form.data('json');
			if(typeof opt.amount != 'undefined'){
				form_properties.payment_form_amount = opt.amount;
			}
			if(typeof opt.recurring_frequency != 'undefined'){
				form_properties.payment_recurring_frequency = opt.recurring_frequency;
			}
			if(typeof opt.recurring_frequency_title != 'undefined'){
				form_properties.recurring_frequency_title = opt.recurring_frequency_title;
			}
			form_properties.plan_type = $('input[name="plan_type"]:checked').val();
			form_properties.imported_plan_id = ll_combo_manager.get_selected_value('#gateway_payment_plans select');
			form_properties.pmv = $('#pmv input').val();
		}
		if(is_device_form){
			form_properties.unique_id_name = $('input[name="unique_id_name"]').is(':checked') ? 1 : 0;
			form_properties.unique_id_barcode = $('input[name="unique_id_barcode"]').is(':checked') ? 1 : 0;
			form_properties.unique_id_email = $('input[name="unique_id_email"]').is(':checked') ? 1 : 0;
			form_properties.ignore_submissions_from_activations = $('input[name="ignore_submission_from_activation"]').is(':checked') ? 1 : 0;
			form_properties.is_block_submissions_from_duplicate_ip = $('input[name="is_block_submissions_from_duplicate_ip"]').is(':checked') ? 1 : 0;
			form_properties.approved_submissions_lists = ll_combo_manager.get_selected_value('select[name="approved_submissions_lists"]');

			/*form_properties.is_has_instructions = 0;
			 form_properties.instructions_content = tinyMCE.get('instructions-editor').getContent();
			 form_properties.is_enforce_instructions_initially = $('input#is_enforce_instructions_initially').is(':checked') ? 1 : 0;
			 if($.trim(form_properties.instructions_content)){
			 form_properties.is_has_instructions = 1;
			 }*/
			
			/*form_properties.is_reject_duplicate_submissions = 0;
			 if($('input[name="is_reject_duplicate_submissions"]').is(':checked')){
			 form_properties.is_reject_duplicate_submissions = 1;
			 }*/
			form_properties.is_reject_duplicate_submissions = $('input[name="is_reject_duplicate_submissions"]:checked').val();
			form_properties.show_reject_prompt = $('input[name="show_reject_prompt"]').is(':checked') ? 1 : 0;
			form_properties.webview_success_action_type = $('input[name="webview_success_action_type"]:checked').val();
			form_properties.webview_success_message = form_properties.webview_success_action_type == 'message' ? $.trim($('#webview-success-message').val()) : '';
			form_properties.webview_success_redirect_url = form_properties.webview_success_action_type == 'redirect' ? $('input[name="webview_success_redirect_url"]').val() : '';
			if((form_properties.webview_success_action_type == 'message' && $.trim($('#webview-success-message').val()) == '')
				|| (form_properties.webview_success_action_type == 'redirect'  && $('input[name="webview_success_redirect_url"]').val() == '' )){
				show_error_message('Please set message or link under the web access success Action');
				return false;
			}
		}
		form_properties.custom_css_files = custom_css_manager.collect_css_files();
		
		form_properties.notify_reminder_to_invites = $('.fb-reminder-icn').hasClass('selected') ? 1 : 0;
		form_properties.reminder_to_invites_period = $('input[name="reminder_to_invites_period"]').val();
		form_properties.reminder_to_invites_period_type = ll_combo_manager.get_selected_value('select[name="reminder_to_invites_period_type"]');
		form_properties.reminder_to_invites_message = $('#reminder_to_invites_message').val();

		if(! is_device_form && this.get_no_of_elements('page_break') > 0){
			form_properties.is_validate_fields_by_page = 0;
			if($('#validate_fields_by_page_container input[name="is_validate_fields_by_page"]').is(':checked')){
				form_properties.is_validate_fields_by_page = 1;
			}
		}
		return form_properties;
	},
	clean_element_html: function(_html, opt, element_type){
		$('#form_html_temp').html(_html);
		$('#form_html_temp .tpl-block-controls').remove();
		$('#form_html_temp .fb-dragenddrop-box').remove();
		$('#form_html_temp .fb-wrap-columns-form').removeAttr('data-json');
		$('#form_html_temp .tpl-block').removeAttr('data-json');
		$('#form_html_temp .tpl-block.selected').removeClass('selected');
		$('#form_html_temp grammarly-extension').remove();
		if(typeof opt.choices != 'undefined'){
			for(i in opt.choices){
				if(opt.choices[i].token != ''){
					$('#form_html_temp .tpl-block input').eq(0).replaceWith(' %%'+opt.choices[i].token+'%% ');
					if(! $('#form_html_temp .tpl-block option').eq(0).hasClass('fb-placeholder-option')){
						$('#form_html_temp .tpl-block option').eq(0).replaceWith(' %%'+opt.choices[i].token+'%% ');
					}
				}
			}
			/*if(opt.defaultIdentifier != 'Amount_Question'){
			 $('#form_html_temp .tpl-block .t-field input').parents('.t-field').remove();
			 $('#form_html_temp .tpl-block .t-field option').parents('.t-field').remove();
			 }*/
		}
		if(typeof opt.choicesDataSource != 'undefined' && opt.choicesDataSource ){
			
			switch(element_type){
				case 'checkboxes':
				case 'multiple_choices':
					$("#form_html_temp .t-field:last" ).after('<span class="choicesDataSource"></span>');
					$('#form_html_temp .choicesDataSource').replaceWith('%%CHOICESDATASOURCE%%');
					break;
				case 'drop_down':
					/*$("#form_html_temp select option:last" ).after('<option class="choicesDataSource"></option>');
					 $('#form_html_temp .choicesDataSource').replaceWith('%%CHOICESDATASOURCE%%');*/
					break;
			}
		}
		if(!is_device_form && element_type == 'documents') {
			$("#form_html_temp .t-field:first").before('%%STARTOPTIONS%%');
			$("#form_html_temp .t-field:last").after('%%ENDOPTIONS%% ');
		}
		switch(element_type){
			case 'paragraph':
				$('#form_html_temp .tpl-block textarea').text('%%ev%%=""');
				var name = $('#form_html_temp .tpl-block textarea').attr("name");
				if(! name || name.toLowerCase() != '%%en%%'){
					$('#form_html_temp .tpl-block textarea').attr("name", "%%EN%%");
				}
				break;
			case 'address':
				$('#form_html_temp .tpl-block select').removeClass('chzn-done');
				$('#form_html_temp .tpl-block select').show();
				$('#form_html_temp .tpl-block select').removeAttr('id');
				$('#form_html_temp .tpl-block .chzn-container').remove();
				$('#form_html_temp .fb-select-address-country').text('%%COUNTRIES%%');
			case 'name':
			case 'price':
				var name = $('#form_html_temp .tpl-block input').attr("name");
				if(! name || name.toLowerCase() != '%%en%%_%%index%%'){
					$('#form_html_temp .tpl-block input').attr("name", "%%EN%%_%%INDEX%%");
				}
				break;
			case 'drop_down':
				var name = $('#form_html_temp .tpl-block select').attr("name");
				if(! name || name.toLowerCase() != '%%en%%'){
					$('#form_html_temp .tpl-block select').attr("name", "%%EN%%");
				}
			case 'credit_card':
			case 'recurring':
				$('#form_html_temp .tpl-block select').removeClass('chzn-done');
				$('#form_html_temp .tpl-block select').show();
				$('#form_html_temp .tpl-block select').removeAttr('id');
				$('#form_html_temp .tpl-block .chzn-container').remove();
				break;
			case 'time':
				$('#form_html_temp .tpl-block input').timeEntry('destroy');
			default:
				var name = $('#form_html_temp .tpl-block input').attr("name");
				if(! name || name.toLowerCase() != '%%en%%'){
					$('#form_html_temp .tpl-block input').attr("name", "%%EN%%");
				}
		}
		
		$('#form_html_temp .tpl-block .element_properties_letters').next().remove();
		$('#form_html_temp .tpl-block .element_properties_letters').remove();
		return $('#form_html_temp').html();
	},
	collect_elements: function(){
		var elements = {};
		var index = 1;
		var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
		var optGlobal = $tplGlobal.data('json');
		var is_error = false;
		$('.eb-wrap-form-page .fb-wrap-columns-form .tpl-block').each(function(i){
			var element = {};
			var choices = {};
			var element_properties = $(this).data('json');
			element.element_id = element_properties.element_id;
			element.parent_element_id = 0;
			if($(this).parents('.tpl-block[data-type-el="section_block"]').length > 0){
				element.parent_element_id = $(this).closest('.tpl-block[data-type-el="section_block"]').attr('data-element-id');
			}
			element.element_title = element_properties.labelText;
			element.label_is_visible = element_properties.labelIsVisible;
			//element.element_guidelines = element_properties.guidelines;
			element.element_field_error_message = element_properties.fieldErrorMessage;
			element.element_field_css_class = element_properties.cssClass;
			element.element_size = element_properties.fieldSize;
			element.element_is_required = element_properties.isRequired;
			element.element_is_always_display = element_properties.isAlwaysDisplay;
			element.element_is_conditional = element_properties.isConditional;
			element.element_is_not_prefilled = element_properties.isDonotPrefilled;
			element.element_is_hidden = element_properties.isHidden;
			// element.element_is_activation = element_properties.isActivation;
			element.element_display_mode = element_properties.displayMode;
			element.is_translate = element_properties.isTranslate;
			element.is_retry_playing = element_properties.isRetryPlaying;
			element.element_type = $(this).data('type-el');
			element.element_position = index;
			element.element_default_value = element_properties.defaultValue;
			element.element_hints_info = {};
			element.submission_process_data_type = element_properties.mergeType;
			element.no_gocapture_style = element_properties.no_gocapture_style;
			element.has_edit_permission = element_properties.hasEditPermission;
			element.has_delete_permission = element_properties.hasDeletePermission;
			element.gocapture_style = element_properties.no_gocapture_style ? '' : JSON.stringify({"background_color": element_properties.element_background_color , "text_color": element_properties.element_text_color});
			if(element.element_type == 'name'){
				element.element_hints_info.hint_simple_name_first_name = element_properties.hints.nameFirst;
				element.element_hints_info.hint_simple_name_last_name = element_properties.hints.nameLast;
			}else if(element.element_type == 'address'){
				element.element_hints_info.hint_address_street = element_properties.hints.streetAddress1;
				element.element_hints_info.hint_address_street2 = element_properties.hints.streetAddress2;
				element.element_hints_info.hint_address_city = element_properties.hints.city;
				element.element_hints_info.hint_address_state = element_properties.hints.state;
				element.element_hints_info.hint_address_zip = element_properties.hints.zipcode;
				element.element_hints_info.hint_address_country = element_properties.hints.country;
				element.element_hints_info.hint_address_street_visible = element_properties.hints.streetAddress1Visible;
				element.element_hints_info.hint_address_street2_visible = element_properties.hints.streetAddress2Visible;
				element.element_hints_info.hint_address_city_visible = element_properties.hints.cityVisible;
				element.element_hints_info.hint_address_state_visible = element_properties.hints.stateVisible;
				element.element_hints_info.hint_address_zip_visible = element_properties.hints.zipcodeVisible;
				element.element_hints_info.hint_address_country_visible = element_properties.hints.countryVisible;
			}else if(element.element_type == 'phone'){
				element.phone_format_type = element_properties.phoneFormat;
			}
			if(element.element_type == 'checkboxes' || element.element_type == 'multiple_choices'){
				element.element_direction = element_properties.fieldItemsDirection;
				element.element_no_of_vertical_columns = element_properties.numberColumns;
				if(element.element_type == 'multiple_choices'){
					element.element_constraint = '';
					if(element_properties.randomize == 'random'){
						element.element_constraint = 'random';
					}
					if(typeof element_properties.custom_type != 'undefined' && element_properties.custom_type == 'amount'){
						element.element_type = 'amount';
					}
				}
				element.no_gocapture_style = 0;
				element.gocapture_style =  JSON.stringify({
					"underline" : typeof element_properties.element_underline != 'undefined' ? element_properties.element_underline : false,
					"full_width_text": typeof element_properties.element_full_width_text != 'undefined' ? element_properties.element_full_width_text : true,
					"italicize": typeof element_properties.element_italicize != 'undefined' ? element_properties.element_italicize : false,
					"vertical_alignment": typeof element_properties.element_vertical_alignment != 'undefined' ? element_properties.element_vertical_alignment : 'middle',
					"background_color": "" ,
					"text_color": element_properties.element_text_color});
			}
			if(element.element_type == 'checkboxes' || element.element_type == 'multiple_choices' || element.element_type == 'drop_down' || element.element_type == 'amount'){
				var choices = element_properties.choices;
				for (j in choices){
					//if(choices[j].option_name != ""){
					if(element.element_type == 'checkboxes' || element.element_type == 'multiple_choices' || element.element_type == 'amount'){
						choices[j].token = 'option_' + formBuilderpage.generate_token();
						if(typeof choices[j].option_value != 'undefined'){
							choices[j].html = '<input type="'+choices[j].type+'" name="%%EN%%" value="'+choices[j].option_value+'" ';
						}else{
							choices[j].html = '<input type="'+choices[j].type+'" name="%%EN%%" value="'+choices[j].option_name+'" ';
						}
						if(element_properties.cssClass){
							choices[j].html += 'class="'+element_properties.cssClass+'" ';
						}
						choices[j].html += '>';
					}
					/*}else{
					 delete choices[j];
					 }*/
				}
				if(element.element_type == 'drop_down'){
					$(this).find('select option').each (function (){
						if(! $(this).hasClass('fb-placeholder-option')){
							for (j in choices) {
								//if (choices[j].option_name && choices[j].option_value) {
								if ($.trim ($(this).text ().toLowerCase ()) == $.trim(choices[j].option_name.toLowerCase ())) {
									choices[j].token = 'option_' + formBuilderpage.generate_token();
									if (typeof choices[j].option_value != 'undefined') {
										choices[j].html = '<option value="' + choices[j].option_value + '">%%EOV%%</option>';
									} else {
										choices[j].html = '<option value="' + choices[j].option_name + '">%%EOV%%</option>';
									}
								}
								//}
							}
						}
					});
				}
				element.options = choices;
				
				if(element.element_type == 'checkboxes' || element.element_type == 'multiple_choices' || element.element_type == 'drop_down'){
					var element_data_source = element_properties.choicesDataSource;
					element.element_data_source = element_data_source;
				}
			}
			if(element.element_type == 'name' || element.element_type == 'price'){
				element.element_total_child = 2;
			}else if(element.element_type == 'address'){
				element.element_total_child = 6;
			}
			if(element.element_type == 'documents') {
				element.ll_documents_set_id  = element_properties.ll_documents_set_id;
				if (typeof element.ll_documents_set_id === 'undefined' || element.ll_documents_set_id === '' || element.ll_documents_set_id == 0) {
					show_error_message("No Document Group selected. Check the settings on your Document element");
					is_error = true;
					return false;
				}
			}
			if(element.element_type == 'activation') {
				element.ll_activation_id  = element_properties.ll_activation_id;
				if ((typeof element.ll_activation_id === 'undefined' || element.ll_activation_id === '' || element.ll_activation_id == 0 || ll_activations_ids.indexOf(parseInt(element.ll_activation_id)) == -1)
					&& ! is_event_template) {
					show_error_message("No Activation selected. Check the settings on your Activation element.");
					is_error = true;
					return false;
				}
			}
			if(element.element_type == 'column_separator') {
				if (index == 1) {
					show_error_message("The Column Separator cannot be the first element in the form. Please change the position of the Column Separator.");
					is_error = true;
					return false;
				} else if (index == ($('.eb-wrap-form-page .fb-wrap-columns-form .tpl-block').length)){
					show_error_message("The Column Separator cannot be the last element in the form. Please change the position of the Column Separator.");
					is_error = true;
					return false;
				}else if(element.parent_element_id){
					show_error_message('Column Separator cannot be added within a Section element. Please try another location in the form.');
					is_error = true;
					return false;
				}
			}
			if(element.element_type == 'section_block') {
				if(element.parent_element_id){
					show_error_message('Sections cannot be added within a Section.');
					is_error = true;
					return false;
				}
			}
			element.element_token = 'element_' + formBuilderpage.generate_token();
			$(this).attr('data-src-token', element.element_token);
			$(this).css('cssText', '');
			
			var formBackground = 'transparent';
			if(!is_device_form) {
				( optGlobal.isTransparentFormBackground === '1' ) ? formBackground = 'transparent' : formBackground = optGlobal.formBackground;
			}
			$(this).css('background-color', formBackground);//optGlobal.formBackground
			
			$('.fb-wrap-columns-form .fb-page-break').hide();
			var _element_html = $(this)[0].outerHTML;
			element.element_html = formBuilderpage.clean_element_html(_element_html, element_properties, element.element_type);
			element.mapping_rules = element_properties.mappingFieldIds;
			if(typeof element_properties.llSingleFieldProcessType != 'undefined'){
				element.mapping_rules.ll_single_field_process_type = element_properties.llSingleFieldProcessType;
			}
			if(typeof element_properties.urlParameter != 'undefined'){
				element.element_field_url_parameter = element_properties.urlParameter;
			}
			if(typeof element_properties.urlIndex != 'undefined'){
				element.element_field_url_index = element_properties.urlIndex;
			}
			if(typeof element_properties.is_scan_cards_and_prefill_form != 'undefined'){
				element.is_scan_cards_and_prefill_form = element_properties.is_scan_cards_and_prefill_form;
			}
			if(typeof element_properties.is_enable_transcription != 'undefined'){
				element.is_enable_transcription = element_properties.is_enable_transcription;
			}
			if(typeof element_properties.transcription_type != 'undefined'){
				element.transcription_type = element_properties.transcription_type;
			}
			if(typeof element_properties.transcription_expedited_localization  != 'undefined'){
				element.transcription_expedited_localization  = element_properties.transcription_expedited_localization ;
			}
			/*if(typeof element_properties.transcription_notes  != 'undefined'){
			 element.transcription_notes  = element_properties.transcription_notes ;
			 }*/
			
			if(element.element_type == 'checkboxes' || element.element_type == 'multiple_choices' || (!is_device_form && element.element_type == 'documents' )){
				var optionHtml = formBuilderpage.getMultipleChoice($(this));
				element.element_option_html = optionHtml;
			}
			
			element.barcode_provider_type_id = 0;
			if(element.element_type == 'barcode') {
				if (typeof element_properties.barcode_provider_type_id != 'undefined') {
					if (element_properties.barcode_provider_type_id != 0) {
						element.barcode_provider_type_id = element_properties.barcode_provider_type_id;
						element.barcode_type = element_properties.barcode_type;
						element.authentication_info = element_properties.barcode_provider_authentication_info;
						if(typeof element_properties.is_enable_age_verification != 'undefined'){
							if(element_properties.is_enable_age_verification && !element_properties.is_enable_under_age_verification && !element_properties.is_enable_over_age_verification && !element_properties.is_enable_age_range_verification ){
								show_error_message("Select at least one age verification method");
								is_error = true;
								return false;
							}

							if( element_properties.is_enable_age_verification &&
								((element_properties.is_enable_under_age_verification && (! element_properties.verified_under_age || !element_properties.under_age_verification_message ))
								|| (element_properties.is_enable_over_age_verification && (! element_properties.verified_over_age || !element_properties.over_age_verification_message )
								|| (element_properties.is_enable_age_range_verification && (! element_properties.start_verified_age || ! element_properties.end_verified_age || !element_properties.age_range_verification_message ))))){
								show_error_message("Please set age and/or message under the age verification settings");
								is_error = true;
								return false;
							}

							element.age_verification = JSON.stringify({
								"is_enable_age_verification" : element_properties.is_enable_age_verification,
								"is_enable_under_age_verification": element_properties.is_enable_under_age_verification ? element_properties.is_enable_under_age_verification : false,
								"verified_under_age": element_properties.verified_under_age ? parseInt(element_properties.verified_under_age) : 0,
								"under_age_verification_message": element_properties.under_age_verification_message ? element_properties.under_age_verification_message : '',
								"is_enable_over_age_verification": element_properties.is_enable_over_age_verification ? element_properties.is_enable_over_age_verification : false,
								"verified_over_age": element_properties.verified_over_age ? parseInt(element_properties.verified_over_age) : 0,
								"over_age_verification_message": element_properties.over_age_verification_message ? element_properties.over_age_verification_message : '',
								"is_enable_age_range_verification": element_properties.is_enable_age_range_verification ? element_properties.is_enable_age_range_verification : false,
								"start_verified_age": element_properties.start_verified_age ? parseInt(element_properties.start_verified_age) : 0,
								"end_verified_age": element_properties.end_verified_age ? parseInt(element_properties.end_verified_age) : 0,
								"age_range_verification_message": element_properties.age_range_verification_message ? element_properties.age_range_verification_message : '',
								"is_show_option_to_proceed": (typeof element_properties.is_show_option_to_proceed != 'undefined') ? element_properties.is_show_option_to_proceed : true
							});
						}
						if (Object.keys(ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info']).length > 0) {
							for (var j in ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info']) {
								switch(ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info'][j]['value_type']){
									case 'text':
										if (!element.authentication_info[j] && ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info'][j]['required'] == 'true') {
											show_error_message(ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info'][j]['label'] + " required");
											is_error = true;
											return false;
										}
										break;
									case 'number':
										if (parseInt(element.authentication_info[j]) == 0 && ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info'][j]['required'] == 'true') {
											show_error_message(ll_supported_barcode_provider_types[element.barcode_provider_type_id]['authentication_info'][j]['label'] + " required");
											is_error = true;
											return false;
										}
										if(j == 'api_call_snooze' && element.authentication_info[j] && (isNaN(element.authentication_info[j]) || parseInt(element.authentication_info[j]) > 30 || parseInt(element.authentication_info[j]) < 0)) {
											show_error_message("API Call Snooze should be between 0 and 30");
											is_error = true;
											return false;
										}
										break;
								}
							}
							if (is_error) {
								return false;
							}
						}
					} else {
						if(!element_properties.post_show_reconciliation) {
							if (typeof element_properties.badge_type == 'undefined' || element_properties.badge_type == BADGE_TYPE_BARCODE) {
								show_error_message("Barcode Provider required");
							} else if (element_properties.badge_type == BADGE_TYPE_NFC) {
								show_error_message("NFC Provider required");
							} else if(element_properties.badge_type == BADGE_TYPE_ID){
								show_error_message("ID Provider required");
							}
							is_error = true;
							return false;
						}
					}
				} else {
					if(!element_properties.post_show_reconciliation) {
						if (typeof element_properties.badge_type == 'undefined' || element_properties.badge_type == BADGE_TYPE_BARCODE) {
							show_error_message("Barcode Provider required");
						} else if (element_properties.badge_type == BADGE_TYPE_NFC) {
							show_error_message("NFC Provider required");
						} else if(element_properties.badge_type == BADGE_TYPE_ID){
							show_error_message("ID Provider required");
						}
						is_error = true;
						return false;
					}
				}
				
				element.accept_invalid_barcode = 0;
				if(typeof element_properties.accept_invalid_barcode != 'undefined' && element_properties.accept_invalid_barcode == '1'){
					element.accept_invalid_barcode = 1;
				}
				element.post_show_reconciliation = 0;
				if(typeof element_properties.post_show_reconciliation != 'undefined' && element_properties.post_show_reconciliation == '1'){
					element.post_show_reconciliation = 1;
				}
				if(element.element_type == 'barcode' && element.post_show_reconciliation) {
					// element.element_is_activation = 0;
					element.element_display_mode = 0;
				}
				element.forward_submission_to_portal = 0;
				if(typeof element_properties.forward_submission_to_portal != 'undefined' && element_properties.forward_submission_to_portal == '1'){
					element.forward_submission_to_portal = 1;
				}
			}
			
			element.is_filled_from_barcode = 0;
			if(typeof element_properties.is_filled_from_barcode != 'undefined' && element_properties.is_filled_from_barcode == '1'){
				element.is_filled_from_barcode = 1;
			}
			
			element.visible_conditions = '';
			if($(this).attr('visible_conditions')){
				element.visible_conditions = JSON.parse($(this).attr('visible_conditions'));
			}
			
			if(element.element_type == 'boolean'){
				element.boolean_mode = element_properties.booleanMode;
				element.element_description = element_properties.booleanFieldDescription;
			}
			
			element.override_if_empty = 0;
			if(typeof element_properties.overrideIfEmpty != 'undefined' && element_properties.overrideIfEmpty){
				element.override_if_empty = 1;
			}
			
			if(typeof element_properties.dataProcessType != 'undefined' && element_properties.dataProcessType){
				element.process_data_type = element_properties.dataProcessType;
			}
			
			element.is_sort_alphabetically = 0;
			if(typeof element_properties.isSortAlphabetically != 'undefined' && element_properties.isSortAlphabetically == 1){
				element.is_sort_alphabetically = 1;
			}
			
			element.choices_sorting_direction = 'asc';
			if(typeof element_properties.sortAlphabeticOrderDirection != 'undefined' && element_properties.sortAlphabeticOrderDirection){
				element.choices_sorting_direction = element_properties.sortAlphabeticOrderDirection;
			}
			
			if((element.element_type == 'section_break' || element.element_type == 'section_block')  && typeof element_properties.collapse_content != 'undefined'){
				element.collapse_content = 0;
				if(element_properties.collapse_content == 1){
					element.collapse_content = 1;
				}
			}
			
			element.sfmc_mapping_field = '';
			if(typeof element_properties.sfmc_mapping_field != 'undefined' && element_properties.sfmc_mapping_field){
				element.sfmc_mapping_field = element_properties.sfmc_mapping_field;
			}
			
			if(element.element_type == 'audio'){
				element.enable_audio_transcription = 0;
				element.audio_transcription_type = LL_AUDIO_TRANSCRIPTION_TYPE_STANDARD;
				if(typeof element_properties.enable_audio_transcription != 'undefined' && element_properties.enable_audio_transcription == 1){
					element.enable_audio_transcription = 1;
					if(typeof element_properties.audio_transcription_type != 'undefined'){
						element.audio_transcription_type = element_properties.audio_transcription_type;
					}
					if(typeof element_properties.audio_transcription_update_field != 'undefined'){
						element.audio_transcription_update_field = element_properties.audio_transcription_update_field;
					}
					// console.log();
					if(typeof element_properties.audio_transcription_update_field_process_type != 'undefined'){
						element.audio_transcription_update_field_process_type = element_properties.audio_transcription_update_field_process_type;
					}
				}
			}
			
			element.is_edit_duplicates_after_scan = 0;
			if(typeof element_properties.is_edit_duplicates_after_scan != 'undefined' && element_properties.is_edit_duplicates_after_scan == 1){
				element.is_edit_duplicates_after_scan = 1;
			}
			
			elements[index] = element;
			index++;
		});
		if(is_error){
			return false;
		}
		return elements;
	},
	set_elemenet_data: function (element, options){
		if (options && options.choices && typeof options.choices != 'undefined') {
			for (var i in options.choices) {
				if (typeof options.choices [i].html != 'undefined' &&  options.choices [i].html) {
					options.choices [i].html = '';
				}
			}
		}
		$(element).attr('data-json', JSON.stringify( options ));
		formBuilderpage.triggerChangeInForm();
	},
	generate_token: function(){
		return Math.random().toString(36).substr(2);
	},
	elementChoices: function(){
		
		if((formBuilderpage.active_element.toLowerCase()).indexOf('amount') !== -1){
			$('#edit_element_choices,#clear_element_choices,#element_choices_data_source').hide();
		} else {
			$('#edit_element_choices,#clear_element_choices,#element_choices_data_source').show();
		}
		
		$('#edit_element_choices').click(function(){
			$('#textarea_edit_element_choices').val('');
			ll_popup_manager.open('#ll_popup_edit_element_choices');
		});
		
		$('#clear_element_choices').click(function(){
			formBuilderpage.removeAllElementChoices();
			var $box = $('#choices');
			formBuilderpage.addElementChoices('First Option',$box);
		});
		$('#ll_popup_edit_element_choices_cancel').click(function(){
			ll_popup_manager.close('#ll_popup_edit_element_choices');
		});
		$('#ll_popup_edit_element_choices_save').click(function(){
			
			if($('#textarea_edit_element_choices').val()){
				var items = $('#textarea_edit_element_choices').val().replace(/\r\n/g,"\n").split("\n");
				if(items.length){
					var choicesItems = [];
					$.each(items, function(i, e) {
						if ($.inArray(e, choicesItems) == -1) choicesItems.push(e);
					});
					var $box = $('#choices');
					for(var i in choicesItems){
						var item_value = choicesItems[i];
						if(item_value){
							formBuilderpage.addElementChoices(item_value,$box);
						}
					}
					ll_popup_manager.close('#ll_popup_edit_element_choices');
				} else {
					show_error_message('Invalid choices');
				}
			} else {
				show_error_message('Enter choices');
			}
		});
	},
	documentElementChoices :function(){
		$('#edit_element_documents_choices,#FA_actions_element_documents_choices').hide();
		if(ll_combo_manager.get_selected_value('#document_set') > 0) {
			$('#edit_element_documents_choices,#FA_actions_element_documents_choices').show();
		}
		$('#add_element_documents_choices').click(function(){
			ll_documents_manager.open(0, '', function(response){
				ll_combo_manager.add_option('#document_set', response.ll_documents_set_id, response.set_name);
				ll_combo_manager.set_selected_value('#document_set',response.ll_documents_set_id);
				$('#document_set').trigger('change');
				$('#edit_element_documents_choices,#FA_actions_element_documents_choices').show();
			});
		});
		$('#edit_element_documents_choices').click(function(){
			ll_documents_manager.open(ll_combo_manager.get_selected_value('#document_set') , ll_combo_manager.get_selected_text('#document_set'), function(response){
				ll_combo_manager.remove_option('#document_set', response.ll_documents_set_id);
				ll_combo_manager.add_option('#document_set', response.ll_documents_set_id, response.set_name);
				ll_combo_manager.set_selected_value('#document_set',response.ll_documents_set_id);
				$('#edit_element_documents_choices,#FA_actions_element_documents_choices').show();
			});
		});
		$('#FA_actions_element_documents_choices').click(function(){
			var ll_document_set_id = parseInt(ll_combo_manager.get_selected_value('#document_set'));
			$('#FA_actions_element_documents_choices').attr('ll_asset_id', 0);
			if(parseInt(ll_combo_manager.get_selected_value('#document_set'))){
				$('#FA_actions_element_documents_choices').attr('ll_asset_id', ll_document_set_id);
				populate_fulfillment_actions_manager ($(this));
			}
		});
	},
	removeAllElementChoices :function(){
		
		$('#choices .t-field').remove();
		var type = formBuilderpage.current_element_type;
		var $tpl = $('.tpl-block.selected');
		if( type == 'multiple_choices' ){
			var $box = $tpl.find('.tpl-multiple-choise');
			$box.find('.t-field').remove();
		} else if(  type == 'checkboxes' ){
			var $box = $tpl.find('.tpl-checkboxes');
			$box.find('.t-field').remove();
		} else{
			var $select = $tpl.find('.t-field select');
			$select.find('option').remove();
			$select.trigger('liszt:updated');
		}
		formBuilderpage.update_choices_json_field();
	},
	addElementChoices:function(item_value,$box){
		if(item_value){
			if(!$box.find('.choice_text[value="'+item_value+'"]').length){
				var type = formBuilderpage.current_element_type;
				var content = '<div class="t-field">'+
					'	<a href="javascript:void(0);" class="fb-btn-move" title="Move"></a> ' +
					'	<a href="javascript:void(0);" class="fb-btn-nonstar t-btn-gray" title="Default"></a>' +
					'	<a href="javascript:void(0);" class="fb-btn-add t-btn-gray" title="Add"></a> '+
					'	<a href="javascript:void(0);" class="fb-btn-remove t-btn-gray" title="Remove"></a> '+
					'	<input class="txt-field choice_text" placeholder="Label" type="text" last-value="'+item_value+'" value="'+item_value+'"/>' +
					' <input class="txt-field choice_value" type="text" placeholder="Value" value="'+item_value+'"/>';
				'</div>';
				
				$box.append(content);
				
				formBuilderpage.isCountMultipleField($box);
				formBuilderpage.addMultipleChoice(type);
				formBuilderpage.update_choices_json_field();
				$box.find('.choice_text:last').trigger ('change');
			}
		}
		
	},
	getMultipleChoice:function($tpl){
		if($tpl.find('div.t-field:last').length) {
			$('body').append('<div id="choiceHtmlTemp"></div>');
			$('#choiceHtmlTemp').html($tpl.find('div.t-field:last')[0].outerHTML);
			$('#choiceHtmlTemp').find('input').val('%%OPTIONVALUE%%');
			$('#choiceHtmlTemp').find('input').attr('name', '%%OPTIONID%%');
			$('#choiceHtmlTemp').find('span').text('%%OPTIONTEXT%%');
			var choiceHtmlTemp = $('#choiceHtmlTemp').html();
			$('#choiceHtmlTemp').remove();
			return choiceHtmlTemp;
		} else{
			return false;
		}
	},
	initiate_form: function(){
		var selected_template_id = $('div.template.selected').attr('data-template-id');
		if(! selected_template_id){
			show_error_message("Please select template");
			return false;
		}
		var form_name = $('.h-edit-text span').text();
		if(! form_name){
			show_error_message("'+formBuilderpage.form_lbl+' name required");
			return false;
		}
		var data = {};
		data.action = 'INITIATE_FORM';
		data.ll_campaign_id = ll_campaign_id;
		data.vanity_url_id = vanity_url_id;
		data.selected_template_id = selected_template_id;
		data.form_name = form_name;
		if(typeof payment_account_id != 'undefined'){
			data.payment_account_id = payment_account_id;
		}
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					if(typeof response.form_id != 'undefined' && response.form_id){
						window.location = "form-designer.php?form_id="+response.form_id;
					}else{
						show_error_message('Unknown Error!');
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	save_form: function(is_exit, _callback){
		if(form_type == DEVICE_HOSTED_WEB_FORM_TYPE && $('#is_enable_screensaver').is(':checked') &&
			($('#rotation_period_value').val() < 10 ||  $('#rotation_period_value').val() > 600) ) {
			show_error_message('Screensaver start time should be between 10 and 600 seconds');
			return false;
		}
		if(form_type == PAYMENT_HOSTED_WEB_FORM_TYPE){
			amount_opt = $('#Amount_Question').data('json');
			var $tplGlobal = $('#form-editor .fb-wrap-columns-form');
			var optGlobal = $tplGlobal.data('json');
			if(optGlobal && typeof optGlobal.plan_type != 'undefined' && optGlobal.plan_type == PAYMENT_PLANS_GATEWAY){
				//amount is not required
			}else{
				if(! optGlobal.amount){
					show_error_message('Amount is required');
					$('ul#fb-tabs-settings li').eq(1).click();
					$('input[name="amount"]').focus();
					return false;
				}
			}
		}
		if(formBuilderpage.is_wizard){
			if($('#inline_wizard_switch').text() == 'Wizard'){
				formBuilderpage.pageBreakInit();
			}
			var stop_saving = false;
			$('.fb-page-step-section').each(function(){
				if($(this).find('.tpl-block').length <= 0){
					stop_saving = true;
					show_error_message('This step does not have any fields. Please add at least one field.');
					$('.fb-page-step-section.fb-selected').removeClass('fb-selected');
					$(this).addClass('fb-selected');
					var length = $('.fb-page-step-section').length;
					var newIndex = $('.fb-page-step-section').index($('.fb-page-step-section').filter('.fb-selected'));
					if( newIndex+1 == 1 ){
						$('.fb-prev-page-section').hide();
					} else{
						$('.fb-prev-page-section').show();
					}
					if( newIndex+1 == length ){
						$('.fb-next-page-section').hide();
					} else{
						$('.fb-next-page-section').show();
					}
					$('.fb-step-text-page span').text(newIndex+1);
					formBuilderpage.show_submit_button_if_last_wizard_page();
					return false;
				}
			});
			if($('#inline_wizard_switch').text() == 'Wizard'){
				formBuilderpage.pageBreakDestroy(false);
			}
			if(stop_saving){
				return false;
			}
		}
		formBuilderpage.removeFieldFormTitDesc();
		var data = {};
		data.form_id = form_id;
		data.action = 'SAVE_FORM';
		data.form_properties = formBuilderpage.get_form_properties();
		data.elements_transcription_notes = formBuilderpage.elements_transcription_notes;
		if(! data.form_properties){
			return false;
		}
		data.elements = formBuilderpage.collect_elements();
		if(data.elements != false){
			var confirmation = false;
			if(is_device_form){
				for(var i in data.elements ){
					// console.log(data.elements[i]);
					// console.log(data.elements[i].element_id);
					// console.log(next_element_id);
					if(data.elements[i].element_type == 'business_card'  && !parseInt(data.elements[i].is_enable_transcription) && data.elements[i].element_id >= next_element_id){
						confirmation = 'You have added a business card element but have not enabled transcription. The app will not capture contact data from the card and will only store its image with the submission. Are you sure you want to proceed?';
					}
				}
			}
			if(confirmation){
				ll_confirm_popup_manager.open(confirmation, function(){
					formBuilderpage.do_save_form(data, is_exit, _callback);
				});
			} else {
				formBuilderpage.do_save_form(data, is_exit, _callback);
			}
		}
	},
	do_save_form: function(data, is_exit, _callback){

		$('.tpl-block').find('.txt-field').inputmask('remove');
		$('.tpl-block.selected').removeClass('selected');
		$('.tpl-block input').timeEntry('destroy');
		var _html_designer = $('.eb-wrap-form-page').html();
		$('#form_html_temp').html(_html_designer);
		$('#form_html_temp .tpl-block select').removeClass('chzn-done');
		$('#form_html_temp grammarly-extension').remove();
		$('#form_html_temp .tpl-block select').show();
		$('#form_html_temp .tpl-block select').removeAttr('id');
		$('#form_html_temp .tpl-block .chzn-container').remove();
		data.form_properties.form_designer_html = $('#form_html_temp').html();
		$('#form_html_temp').html ('');
		data.form_properties.form_html_to_render = formBuilderpage.clean_form_html();
		data.is_exit = 0;
		data.clone = is_clone;
		if(is_exit){
			data.is_exit = 1;
		}
		if(is_new_form){
			data.is_new_form = 1;
		}
		ll_fade_manager.fade(true, 'save');
		// console.log(data);
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				ll_fade_manager.fade(false);
				if(response.success == 1){
					if(typeof _callback != 'undefined' && _callback){
						_callback(response);
					} else {
						if (is_clone == 1) {
							is_clone = 0;
							window.location.href = 'form-designer.php?form_id=' + response.form_id;
						}
						if (is_exit) {
							if (is_event_template) {
								window.location.href = 'manage-templates.php';
							} else if (is_device_form) {
								window.location.href = 'manage-events.php';
							} else {
								window.location.href = 'manage-web-forms.php';
							}
						} else {
							show_success_message(response.message);
							window.location.href = window.location.href;
						}
					}
					
				}else{
					show_error_message(response.message);
				}
			},
			error : function() {
				ll_fade_manager.fade(false);
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	load_form_instructions: function(_callback){
		var data = {};
		data.action = 'LOAD_FORM_INSTRUCTIONS';
		data.form_id = form_id;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					if(typeof response.form != 'undefined' && response.form){
						if(typeof _callback != 'undefined' && _callback){
							_callback(response.form );
						}
					} else{
						show_error_message('Unknown Error!');
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	save_form_instructions: function(_callback){
		var data = {};
		data.is_has_instructions = 0;
		data.instructions_content = tinyMCE.get('instructions-editor').getContent();
		data.is_enforce_instructions_initially = $('input#is_enforce_instructions_initially').is(':checked') ? 1 : 0;
		data.is_instructions_webview = $('input#is_instructions_webview').is(':checked') ? 1 : 0;
		if($.trim(data.instructions_content)){
			data.is_has_instructions = 1;
		}
		data.action = 'SAVE_FORM_INSTRUCTIONS';
		data.form_id = form_id;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					show_success_message(response.message);
					if(typeof _callback != 'undefined' && _callback){
						_callback(response.instructions_content);
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	
	get_transcription_notes: function(){
		var data = {};
		data.action = 'GET_TRANSCRIPTION_NOTES';
		data.form_id = form_id;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					if(typeof response.transcription_notes != 'undefined' && response.transcription_notes){
						formBuilderpage.elements_transcription_notes[response.element_id] = response.transcription_notes;
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	get_provider_elements: function(barcode_provider_type_id){
		var data = {};
		data.action = 'GET_PROVIDER_ELEMENTS';
		data.barcode_provider_type_id = barcode_provider_type_id;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					if(typeof response.fields != 'undefined' && response.fields){
						formBuilderpage.handle_insert_badge_elements(response.fields);
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	handle_insert_badge_elements: function(badge_fields){
		for(var badge_field of badge_fields){
			var field_exist = false;
			if(typeof badge_field.ll_standard_field_id != 'undefined' && badge_field.ll_standard_field_id ) {
				$('div.tpl-block[data-type-el="' + badge_field.data_field_type + '"]').each( function(){
					var options = $(this).data('json');
					if(typeof options.mappingFieldIds != 'undefined' && options.mappingFieldIds.common == 'Standard_' + badge_field.ll_standard_field_id) {
						field_exist = true;
					}
				});
			} else if(formBuilderpage.get_no_of_elements(badge_field.data_field_type) > 0) {
				field_exist = true;
			}

			if(!field_exist){
				var element = '.eb-block-content[data-field-type="' + badge_field.data_field_type + '"]';
				if(typeof badge_field.data_field_sub_type != 'undefined' && badge_field.data_field_sub_type){
					element = '.eb-block-content[data-field-type="' + badge_field.data_field_type + '"][data-field-sub-type="' + badge_field.data_field_sub_type + '"]';
				}
				if(typeof badge_field.data_element_name != 'undefined' && badge_field.data_element_name){
					element += '[data-element-name="' + badge_field.data_element_name + '"]';
				}
				var mapping_fields_id = badge_field.ll_standard_field_id ? 'Standard_' + badge_field.ll_standard_field_id : '';
				formBuilderpage.addElements($(element), false, false, false , mapping_fields_id, badge_field.data_field_label ? badge_field.data_field_label :'');
			}

		}
	},
	get_parent_template_data: function(){
		var data = {};
		data.action = 'GET_PARENT_TEMPLATE_ELEMENTS';
		data.form_id = form_id;
		data.parent_template_form_id = parent_template_form_id;
		ll_fade_manager.fade(true, 'Loading', true);
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				ll_fade_manager.fade(false);
				if (response.success != 1) {
					//show_error_message(response.message);
				} else {
					if(typeof response.form_elements != 'undefined' && response.form_elements){
						formBuilderpage.form_elements = response.form_elements;
					}
					if(typeof response.parent_template_form_elements != 'undefined' && response.parent_template_form_elements){
						formBuilderpage.parent_template_form_elements = response.parent_template_form_elements;
					}
				}
			},
			error : function() {
				ll_fade_manager.fade(false);
				//show_error_message('Connection Error!');
				return false;
			}
		});
	},
	chk_element_action_permission: function($block, action){
		if(is_device_form && parent_template_form_id){
			if (typeof $block.attr('data-element-id') != 'undefined' && parseInt($block.attr('data-element-id')) && Object.keys(formBuilderpage.form_elements).length) {
				var element_id = parseInt($block.attr('data-element-id'));
				if (element_id in formBuilderpage.form_elements) {
					var element_data = formBuilderpage.form_elements[element_id];
					if (typeof element_data.parent_form_template_element_id != 'undefined' && parseInt(element_data.parent_form_template_element_id) && Object.keys(formBuilderpage.parent_template_form_elements).length) {
						if (element_data.parent_form_template_element_id in formBuilderpage.parent_template_form_elements) {
							var has_permission = 0;
							switch (action) {
								case 'EDIT':
									has_permission = parseInt(formBuilderpage.parent_template_form_elements[element_data.parent_form_template_element_id].has_edit_permission);
									break;
								case 'DELETE':
									has_permission = parseInt(formBuilderpage.parent_template_form_elements[element_data.parent_form_template_element_id].has_delete_permission);
									break;
							}
							if(!has_permission){
								return false;
							}
						}
					}
				}
			}
		}
		return true;
	},
	chk_edit_default_permission : function($block){
		var type = $block.data('type-el');
		switch (type) {
			case 'text':
			case 'number':
			case 'paragraph':
			case 'phone':
			case 'website':
			case 'email':
			case 'calculated':
				if(EDIT_DEFAULT_PERMISSION){
					return true;
				}
				break;
		}
		return false;
	},
	get_event_style: function(){
		if(typeof event_form_style != 'undefined' && event_form_style){
			if(event_form_style.background_img){
				formBuilderpage.addHTMLImage($('.cover-image'), event_form_style.background_img, event_form_style.background_img);
			}
			if(event_form_style.event_text_color) {
				$('#event_text_color').colpickSetColor(event_form_style.event_text_color, true).css('background-color', event_form_style.event_text_color);
			}
			if(event_form_style.elements_label_color) {
				$('#elements_label_color').colpickSetColor(event_form_style.elements_label_color, true).css('background-color', event_form_style.elements_label_color);
			}
			if(event_form_style.capture_background_color){
				$('#capture_background_color').colpickSetColor(event_form_style.capture_background_color, true).css('background-color', event_form_style.capture_background_color);
			}
			if(event_form_style.capture_background_img){
				formBuilderpage.addHTMLImage($('.capture-background-image'), event_form_style.capture_background_img, event_form_style.capture_background_img);
			}
			if(event_form_style.is_enable_screensaver == '1') {
				ll_theme_manager.checkboxRadioButtons.check('#is_enable_screensaver', event_form_style.is_enable_screensaver);
				$('.screensaver_options').show();
			}
			if(event_form_style.rotation_period) {
				$('#rotation_period_value').val(event_form_style.rotation_period);
			}
			if(event_form_style.is_randomize == '1') {
				ll_theme_manager.checkboxRadioButtons.check('#is_randomize', event_form_style.is_randomize);
			}
			if(event_form_style.switch_frequency) {
				$('#switch_frequency').val(event_form_style.switch_frequency);
			}
			if(event_form_style.transition_effect) {
				ll_combo_manager.set_selected_value('#transition_effect', event_form_style.transition_effect);
			}
			if(event_form_style.screensaver_images) {
				if(event_form_style.screensaver_images.length == 0){
					formBuilderpage.add_screensaver_line('');
				} else {
					for(var i = 0; i < event_form_style.screensaver_images.length; i++) {
						formBuilderpage.add_screensaver_line(event_form_style.screensaver_images[i]);
					}
				}
			} else {
				formBuilderpage.add_screensaver_line('');
			}
			if(typeof event_form_style.has_buttons_menu != 'undefined' && event_form_style.has_buttons_menu == 1) {
				ll_theme_manager.checkboxRadioButtons.check('#has_event_buttons_menu', true);
				if(event_form_style.buttons_menu) {
					$('#buttons-menu-div').html('');
					var buttons = JSON.parse(event_form_style.buttons_menu);
					for(var key in buttons){
						button = buttons[key];
						formBuilderpage.add_button_line(button.label, '#buttons-menu-div', button.show == '1' ? 'checked' : '', button.type );
					}
				} else {
					$('#buttons-menu-div').html('');
					formBuilderpage.add_default_buttons('#buttons-menu-div', 'checked');
				}
				$('#buttons-menu-field').show();
			}else{
				ll_theme_manager.checkboxRadioButtons.check('#has_event_buttons_menu', false);
				$('#buttons-menu-field').hide();
			}
			
			if(typeof event_form_style.has_floating_buttons != 'undefined' && event_form_style.has_floating_buttons == 1) {
				ll_theme_manager.checkboxRadioButtons.check('#has_event_floating_buttons', true);
				if(event_form_style.floating_buttons) {
					$('#floating-buttons-div').html('');
					var buttons = JSON.parse(event_form_style.floating_buttons);
					for(var key in buttons){
						button = buttons[key];
						formBuilderpage.add_button_line(button.label, '#floating-buttons-div', button.show == '1' ? 'checked' : '' , button.type);
					}
				} else {
					$('#floating-buttons-div').html('');
					formBuilderpage.add_default_buttons('#floating-buttons-div', '');
				}
				$('#floating-buttons-field').show();
			}else{
				ll_theme_manager.checkboxRadioButtons.check('#has_event_floating_buttons', false);
				$('#floating-buttons-field').hide();
			}
			
			if(typeof event_form_style.element_background_color != 'undefined' && event_form_style.element_background_color !=  ''){
				ll_theme_manager.checkboxRadioButtons.check('#has_field_background', true);
				$('#capture_field_background').colpickSetColor(event_form_style.element_background_color, true).css('background-color', event_form_style.element_background_color);
				if(event_form_style.element_background_mode != 'undefined' && event_form_style.element_background_mode != null  &&  event_form_style.element_background_mode !=''){
					ll_theme_manager.checkboxRadioButtons.check('input[name="element_background_mode"][value="'+event_form_style.element_background_mode+'"]', true);
				}
				if(event_form_style.element_background_opacity != 'undefined'){
					$('input[name="element_background_opacity"]').val(event_form_style.element_background_opacity/100);
				}
				$('#capture_field_background_div').show();
				$('#element_background_mode_div').show();
				$('#element_background_opacity_div').show();
			} else {
				ll_theme_manager.checkboxRadioButtons.check('#has_field_background', false);
				$('#capture_field_background_div').hide();
				$('#element_background_mode_div').hide();
				$('#element_background_opacity_div').hide();
			}
			if(event_form_style.theme != 'undefined'){
				ll_combo_manager.set_selected_value('#theme',event_form_style.theme);
			}
			ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style_search_list', true);
			$('.element-style_search_list').hide();
			if(typeof event_form_style.search_list_background_color != 'undefined' &&
				typeof event_form_style.search_list_text_color != 'undefined' &&
				event_form_style.search_list_background_color &&
				event_form_style.search_list_text_color){
				ll_theme_manager.checkboxRadioButtons.check('#is_use_theme_style_search_list', false);
				$('#element_text_color_search_list').colpickSetColor(event_form_style.search_list_text_color, true).css('background-color', event_form_style.search_list_text_color);
				$('#element_background_color_search_list').colpickSetColor(event_form_style.search_list_background_color, true).css('background-color', event_form_style.search_list_background_color);
				$('.element-style_search_list').show();
			}
		}
	},
	triggerChangeInForm: function(){
		var show_rapid_scan_element = false;
		if(is_device_form){
			if(formBuilderpage.get_no_of_elements('barcode')){
				var show_rapid_scan_element = true;
				formBuilderpage.add_button_line('Scan', '#buttons-menu-div', 'checked' , 'scan');
				formBuilderpage.add_button_line('Scan', '#floating-buttons-div', '' , 'scan');
			}
			if(!show_rapid_scan_element && formBuilderpage.get_no_of_elements('business_card')){
				var $tpl = $('div.tpl-block[data-type-el="business_card"]');
				var opt = $tpl.data('json');
				if(typeof opt.is_enable_transcription != 'undefined' && parseInt(opt.is_enable_transcription)){
					var show_rapid_scan_element = true;
				}
				formBuilderpage.add_button_line('Scan', '#buttons-menu-div', 'checked' , 'scan');
				formBuilderpage.add_button_line('Scan', '#floating-buttons-div', '' , 'scan');
			}
		} else {
			if(this.get_no_of_elements('page_break') > 0){
				$('#validate_fields_by_page_container').show();
				$('#error_message_container.last-field').removeClass('last-field');
				$('#validate_fields_by_page_container').addClass('last-field');
			} else {
				$('#validate_fields_by_page_container').hide();
				$('#validate_fields_by_page_container.last-field').removeClass('last-field');
				$('#error_message_container').addClass('last-field');
			}
		}
		if(show_rapid_scan_element){
			$('#element_rapid_scan').show();
		} else {
			$('#element_rapid_scan').hide();
			ll_theme_manager.checkboxRadioButtons.check('input[name="is_enable_rapid_scan_mode"]', false);
		}
	},
	add_station: function(stations){
		var data = {};
		data.action = 'ADD_STATION';
		data.form_id = form_id;
		data.stations = stations;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					show_success_message(response.message);
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	delete_station: function(stations){
		var data = {};
		data.action = 'DELETE_STATION';
		data.form_id = form_id;
		data.stations = stations;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	get_stations: function(){
		var data = {};
		data.action = 'LOAD_STATIONS';
		data.form_id = form_id;
		$.ajax( {
			type :"POST",
			url : "form-designer-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					show_error_message(response.message);
				} else {
					$('#ll_popup_add_station .lines').html('');
					if(response.stations.length == 0 ){
						formBuilderpage.add_station_line('');
					}
					for(var i in response.stations ){
						formBuilderpage.add_station_line(response.stations[i].station_name, response.stations[i].station_id);
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},
	
	order_stations: function(){
		
		sorted_lines = $('.lines .line-criteries').sort(function(a, b) {
			return String.prototype.localeCompare.call($(a).find('input').val().toLowerCase(), $(b).find('input').val().toLowerCase());
		});
		// console.log(sorted_lines);
		$('#ll_popup_add_station .lines').html('');
		$('#ll_popup_add_station .lines').append(sorted_lines);
		$('#ll_popup_add_station .line-criteries .remove-line-criteries').click(function () {
			if ($('#ll_popup_add_station .lines .line-criteries').length > 0) {
				if ($(this).closest('.line-criteries').find('input').val() != '') {
					var station_id = $(this).closest('.line-criteries').find('input').parents('.line-criteries').attr('station_id');
					formBuilderpage.station_to_be_deleted.push(station_id);
					$(this).closest('.line-criteries').find('input').val('');
					$(this).closest('.line-criteries').find('input').parents('.line-criteries').attr('station_id', '');
				}
				if ($('#ll_popup_add_station .lines .line-criteries').length > 1) {
					$(this).closest('.line-criteries').remove();
				}
			}
		});
		$('.line-criteries .add-line-criteries').click(function(){
			formBuilderpage.add_station_line('', '');
		});
		
	},
	
	getImageHTML: function (file_name, size, urlImgSource) {
		var html = '';
		var title = (typeof file_name != 'undefined' && file_name) ? file_name.substring(file_name.lastIndexOf('/')+1) : 'Upload an Image';
		title = title.length > 20 ? title.substring(0, 19) + '...' : title;
		var size = (typeof size != 'undefined' && size) ? size : '';
		var urlImg = (typeof urlImgSource != 'undefined' && urlImgSource) ? urlImgSource : LL_APP_HTTPS + '/imgs/imgs_email_builder/img_upload.jpg';
		var urlImgScr = (typeof urlImgSource != 'undefined' && urlImgSource) ? urlImgSource : '';
		var cssHide = 'style = "display: none;"';
		var cssHideBrowse = '';
		// var cssImageNone = ' pb-image__icn--none';
		var cssHideRemove = 'style = "display: none;"';
		
		if (typeof urlImgSource != 'undefined' && urlImgSource) {
			/*if(! size){
			 $imgBlock.find('img').addClass('select_this_image');
			 size = document.getElementsByClassName('select_this_image')[0].naturalWidth + ' X ' + document.getElementsByClassName('select_this_image')[0].naturalHeight
			 $imgBlock.find('img').removeClass('select_this_image');
			 }*/
			cssHide = '';
			cssHideRemove = '';
			cssHideBrowse = 'style = "display: none;"';
			//cssImageNone = '';
		}
		
		html = '<img class="pb-image__icn" src="' + urlImg + '" src-img= "' + urlImgScr + '">' +
			'<div class="pb-image__meta">' +
			'<div class="pb-image__title"><strong>' + title + '</strong></div>' +
			//'<div class="pb-image__size">' + (size ? size : '66 x 53') + '</div>' +
			'<ul class="pb-image__links clearfix">' +
			'<li ' + cssHideBrowse + '>' +
			'<a href="javascript:void(0);" class="event-bg__link-browse">Browse</a>' +
			'</li>' +
			'<li ' + cssHide + '>' +
			'<a href="javascript:void(0);" class="event-bg__link-replace">Replace</a>' +
			'</li>';
		
		html += '<li ' + cssHideRemove + '>' +
			'<a href="javascript:void(0);" class="event-bg__link-remove">Remove</a>' +
			'</li>' +
			'<li>' +
			'<a href="javascript:void(0);" class="event-bg__link-free-images">Unsplash</a>' +
			'</li>' +
			'</ul>' +
			'</div >';
		return html;
	},
	addHTMLImage: function (parent, urlImgSource, file_name, size ) {
		var html = formBuilderpage.getImageHTML(file_name, size, urlImgSource);
		parent.html('');
		parent.append(html);
		parent.find(('.event-bg__link-browse, .event-bg__link-replace ')).bind('click', function(){
			thisBlock = $(this);
			moxman.browse({
				view: 'thumbs',
				title: 'Media Manager',
				extensions:'jpg,jpeg,png',
				filelist_context_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
				filelist_manage_menu: 'cut copy paste | view edit rename download addfavorite | zip unzip | remove fileinfo',
				fileinfo_fields: 'url',
				oninsert: function(args) {
					if(args.files[0].url){
						html = formBuilderpage.addHTMLImage(thisBlock.closest('.' + parent.attr('selc')), args.files[0].url, args.files[0].name, args.files[0].meta.width + ' X ' + args.files[0].meta.height);
					}
				}
			});
		});
		parent.find('.event-bg__link-remove').bind('click', function(){
			formBuilderpage.addHTMLImage(parent);
		});
		parent.find('.event-bg__link-free-images').bind('click', function(){
			formBuilderpage.freeImages(1, '', false, parent);
			$('.pb-input-free-images').val('');
			$('.pb-more-free-images').attr('data-page', 2 );
			$('.tool-col .eb-inner-tool').hide();
			$('.pb-more-free-images').unbind( "click" );
			$('.pb-more-free-images:not(.disabled)').on('click', function () {
				var $btn = $(this);
				var page = $btn.attr('data-page') || 2;
				$btn.addClass('disabled');
				formBuilderpage.freeImages(page, $.trim($('.pb-input-free-images').val()), true, parent);
				$btn.attr('data-page', parseInt(page) + 1 );
			});
			$('.pb-input-free-images').unbind();
			$('.pb-input-free-images').keyup(function (e) {
				if(e.which == 13){
					formBuilderpage.freeImages(1, $.trim($(this).val()), false, parent);
				}
			});
			$('.unsplash-right-panel').show();
		});
		$('#close_unsplash-right-panel').bind('click', function(){
			$('.tool-col .eb-inner-tool').show();
			$('.unsplash-right-panel').hide();
		});
		return html;
	},
	
	rgb2hex: function (orig){
		if(orig != 'undefined' && orig) {
			var rgb = orig.replace(/\s/g, '').match(/^rgba?\((\d+),(\d+),(\d+)/i);
			return (rgb && rgb.length === 4) ? "#" +
				("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
				("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : orig;
		}
	},
	add_screensaver_line: function (screenURL) {
		file_name = '';
		if(screenURL){
			file_name = screenURL.substring(screenURL.lastIndexOf('/')+1);
		}
		var html = '<div class="line-criteries t-field">' +
			'<a href="javascript:void(0)" class="fb-btn-move"></a>' +
			'<a href="javascript:void(0)" class="add-line-criteries btnEmailPlus"></a>' +
			'<a href="javascript:void(0)" class="remove-line-criteries btnEmailMinus"></a>' +
			'<div class="screensaver-img" selc="screensaver-img">' +
			'</div>'+
			'</div>';
		$('.sc-list-image').append(html);
		formBuilderpage.addHTMLImage($('.screensaver-img:last'), screenURL, file_name, '');
		$('.sc-list-image .line-criteries:last .remove-line-criteries').click(function () {
			if ($('.sc-list-image .line-criteries').length > 0) {
				formBuilderpage.addHTMLImage($(this).closest('.line-criteries ').find('.screensaver-img'));
				if ($('.sc-list-image .line-criteries').length > 1) {
					$(this).closest('.line-criteries').remove();
				}
			}
		});
		$('.sc-list-image .line-criteries:last .add-line-criteries').click(function(){
			formBuilderpage.add_screensaver_line('');
		});
	},
	add_button_line: function (buttonName, divName, checked, buttonType) {
		//to avoid adding scan button twice
		$is_there_scan = $(divName + ' input[button-type = "scan"]').length;
		$is_first_scan_element = (formBuilderpage.get_no_of_elements('barcode')  > 0) || (formBuilderpage.get_no_of_elements('business_card') > 0);
		if(buttonType != 'scan' ||
			(buttonType == 'scan' && $is_first_scan_element && ! $is_there_scan)) {
			var html = '<div class="t-field"><div class="t-checkbox inline">' +
				'<label style="display: inline-block"><i class="icn-checkbox" style="top: 8px;"></i><input type="checkbox" name="button_submit" button-type = "' + buttonType+ '" ' + checked + '><span class="fb-wrap-tooltip"></span>'+ buttonName +'</label>' +
				'<a href="javascript:void(0)" class="fb-btn-move" style="vertical-align: middle; margin: 5px;"></a>' +
				'</div></div>' ;
			$(divName).append(html);
			ll_theme_manager.checkboxRadioButtons.initiate_container(divName);
			
		}
	},
	add_default_buttons: function (divName, checked) {
		var html = '<div class="t-field"> <div class="t-checkbox inline ">' +
			'<label style="display: inline-block"><i class="icn-checkbox" style="top: 8px;"></i><input type="checkbox" name="button_submit" button-type = "submit" ' + checked+ '><span class="fb-wrap-tooltip"></span>Submit</label>' +
			'<a href="javascript:void(0)" class="fb-btn-move" style="vertical-align: middle; margin: 5px;"></a>' +
			'</div></div>' +
			
			'<div class="t-field"><div class="t-checkbox inline ">' +
			'<label style="display: inline-block"><i class="icn-checkbox" style="top: 8px;"></i><input type="checkbox" name="button_submit" button-type = "reset" ' + checked+ '><span class="fb-wrap-tooltip"></span>Reset</label>' +
			'<a href="javascript:void(0)" class="fb-btn-move" style="vertical-align: middle; margin: 5px;"></a>' +
			'</div></div>' +
			
			'<div class="t-field"><div class="t-checkbox inline ">' +
			'<label style="display: inline-block"><i class="icn-checkbox" style="top: 8px;"></i><input type="checkbox" name="button_submit" button-type = "recall" ' + checked+ '><span class="fb-wrap-tooltip"></span>Recall</label>' +
			'<a href="javascript:void(0)" class="fb-btn-move" style="vertical-align: middle; margin: 5px;"></a>' +
			'</div></div>' +
			
			'<div class="t-field"><div class="t-checkbox inline ">' +
			'<label style="display: inline-block"><i class="icn-checkbox" style="top: 8px;"></i><input type="checkbox" name="button_submit" button-type = "leads" ' + checked+ '><span class="fb-wrap-tooltip"></span>Leads</label>' +
			'<a href="javascript:void(0)" class="fb-btn-move" style="vertical-align: middle; margin: 5px;"></a>' +
			'</div></div>';
		if(formBuilderpage.get_no_of_elements('barcode') > 0 || formBuilderpage.get_no_of_elements('business_card') > 0 ){
			html += '<div class="t-field"><div class="t-checkbox inline ">' +
				'<label style="display: inline-block"><i class="icn-checkbox" style="top: 8px;"></i><input type="checkbox" name="button_submit" button-type = "scan" ' + checked+ '><span class="fb-wrap-tooltip"></span>Scan</label>' +
				'<a href="javascript:void(0)" class="fb-btn-move" style="vertical-align: middle; margin: 5px;"></a>' +
				'</div></div>';
		}
		$(divName).append(html);
		ll_theme_manager.checkboxRadioButtons.initiate_container(divName);
	},
	auto_fill_device_form_address_fields: function (){
		var place = (formBuilderpage.device_form_address_autocomplete).getPlace();
		if(typeof place != 'undefined'){
			var street_address = '';
			if(typeof place.address_components != 'undefined'){
				formBuilderpage.device_form_address = {
					address_found: true,
					country: '',
					country_code: '',
					state: '',
					state_code: '',
					city: '',
					zipcode: '',
					address_line1: '',
					street_address: '',
					address: ''
				};
				for(i in place.address_components){
					component = place.address_components[i];
					switch(component.types[0]){
						case 'locality':
							$('.fb-form-properties #fb-device_form_city').val(component.long_name);
							formBuilderpage.device_form_address.city = component.long_name;
							break;
						case 'administrative_area_level_1':
							$('.fb-form-properties #fb-device_form_state').val(component.short_name.toUpperCase());
							formBuilderpage.device_form_address.state = component.long_name;
							formBuilderpage.device_form_address.state_code = component.short_name.toUpperCase();
							break;
						case 'route':
							if(street_address){
								street_address += ' ' +component.long_name;
							}else{
								street_address = component.long_name;
							}
							break;
						case 'street_number':
							if(street_address){
								street_address = component.long_name + ' ' +street_address;
							}else{
								street_address = component.long_name;
							}
							break;
						case 'postal_code':
							$('.fb-form-properties #fb-device_form_zip').val(component.long_name);
							formBuilderpage.device_form_address.zipcode = component.long_name;
							break;
						case 'country':
							ll_combo_manager.set_selected_value('.fb-form-properties #fb-device_form_country',component.short_name);
							formBuilderpage.device_form_address.country = component.long_name;
							formBuilderpage.device_form_address.country_code = component.short_name.toUpperCase();
							break;
					}
					if(street_address){
						$('.fb-form-properties #fb-device_form_street_address').val(street_address);
					}
					formBuilderpage.device_form_address.address_line1 = street_address;
					formBuilderpage.device_form_address.street_address = street_address;
					formBuilderpage.device_form_address.address = $('.fb-form-properties #fb-device-form-address').val();
				}
				$('#fb_clear_device_form_address_details').show();
				$('.fb-form-properties #fb-device-form-address').attr('disabled',true);
			}
		}
	},
	load_custom_attributes: function(){
		var data = {};
		data.event_id = form_id;
		data.action = 'LOAD_EVENT_CUSTOM_ATTRIBUTES';
		$.ajax( {
			type :"POST",
			url : "event-custom-attributes-processes.php",
			data :data,
			cache :false,
			success : function(response) {
				if (response.success != 1) {
					//show_error_message(response.message);
				} else {
					//gocapture_settings.fields_data_types = response.fields_types;
					$('#custom_attributes_container').html('');
					if(response.attributes.length == 0 ){
						left_side_popups_helper.add_attribute_line('#custom_attributes_container', response.attributes_settings,'');
					}
					for(var i in response.attributes ){
						left_side_popups_helper.add_attribute_line('#custom_attributes_container', response.attributes_settings, response.attributes[i].attribute_id, response.attributes[i].event_custom_attribute_id,
							response.attributes[i].field_data_type_id, response.attributes[i].value);
					}
				}
			},
			error : function() {
				show_error_message('Connection Error!');
				return false;
			}
		});
	},

	process_load_landing_pages: function (_callback){
		if (! formBuilderpage.is_done_load_landing_pages) {
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
							formBuilderpage.is_done_load_landing_pages = true;
							formBuilderpage.landing_pages = data.landing_pages;

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

	updateChoicesStyleInline: function($tpl, opt){
		var id = $tpl.attr('id');
		var opt = opt || $tpl.data('json');
		var css = '#'+id+' .t-field label:hover, #'+id+' .t-field .checked label {background-color: '+opt.choicesSelectedBgColor+'!important; border-color: '+opt.choicesSelectedBorderColor+'!important;} #'+id+' .t-field label:hover .fb-choice, #'+id+' .t-field .checked label .fb-choice {color: '+opt.choicesSelectedFontColor+'!important;}';

		if($tpl.find('.choices-survey-css').length){
			$tpl.find('.choices-survey-css').html(css);
		} else{
			$tpl.find('.tpl-choices').prepend('<style class="choices-survey-css" id="'+id+'_survey-css">'+css+'</style>');
		}
	}
	
	/*get_custom_attributes: function(parent){
	 var attributes = [];
	 $(parent + ' .line-criteries').each(function (){
	 var attr_id = $(this).attr('attr_id');
	 var event_custom_attribute_id = ll_combo_manager.get_selected_value($(this).find('select[name="select_attribute"]'));
	 var attr_value = $.trim(($(this).find($('.attr_value')).val()));
	 if ( event_custom_attribute_id > 0) {
	 attributes.push ({
	 id: attr_id,
	 event_custom_attribute_id: event_custom_attribute_id,
	 value: attr_value
	 });
	 }
	 });
	 return attributes;
	 },*/
};

$(document).ready(function(){
	formBuilderpage.init();
});