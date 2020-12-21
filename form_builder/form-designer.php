<?php
include_once 'page_settings_constants.php';
define('VERY_TOP_MENU', VERY_TOP_MENU_FORM_DESIGNER);
define('TOP_MENU', '');
define('LEFT_MENU', '');
define('SUB_TOP_MENU', '');
define('WINDOW_TITLE', 'Configure Form');
define('PAGE_TITLE', 'Configure Form');
SetHelpTileAndBody();

include "cachecontrol.php";
require_once("mysql_connect.php"); // connect to the db
include "configuration.inc";
require_once("passport.php"); // connect to the db
require_once "webforms/DAL/form.php";
require_once "webforms/DAL/form_elements.php";
require_once 'webforms/includes/view-functions.php';
require_once 'webforms/DAL/customer_subdomains.php';
require_once('webforms/DAL/ap_forms_payment_amount.php');
require_once('webforms/DAL/ap_forms_payment_info.php');
require_once "DAL/ll_campaigns.php";
require_once('DAL/fields.php');
require_once 'DAL/ll_abstract_campaigns.php';
require_once 'DAL/ll_layout_templates.php';
require_once 'DAL/ll_domain_lists.php';
require_once 'DAL/customer_general_settings.php';
require_once 'DAL/ll_s3_buckets.php';
require_once 'DAL/payment_gateway_accounts.php';
require_once 'DAL/payment_gateways_recurring_plans.php';
require_once 'DAL/user_general_settings.php';
require_once 'DAL/ll_lists.php';
require_once 'DAL/ll_customers_groups_for_form_devices.php';
require_once 'DAL/ll_forms_groups.php';
require_once 'DAL/ll_business_cards_requests.php';
require_once 'DAL/vanity_urls_manager.php';
require_once 'LL_CRM/LL_CRM_Manager.php';
require_once "DAL/ll_customer_regions.php";
require_once 'DAL/ll_customers_labels.php';
require_once 'DAL/ll_customers_assets_labels.php';
require_once 'DAL/ll_barcode_sets.php';
require_once 'DAL/ll_mturk_qualifications.php';
require_once 'DAL/ll_mturk_projects.php';
require_once 'DAL/LL_AudioTranscription_Manager.php';
require_once 'DAL/ll_completion_actions_manager.php';

require_once 'DAL/ll_supported_barcode_provider_types.php';
require_once 'DAL/ll_folders.php';
require_once 'll-common-popup-manager.php';
require_once 'DAL/ll_documents_set.php';
require_once 'DAL/event_form_style.php';
//$GLOBALS ['disable_including_fonts'] = true;

$userID = intval($_COOKIE ["userID_ck"]);
$customerID = intval($_COOKIE ["customerID_ck"]);

$theme_color = ll_private_labels_manager::get_branding_theme_color ($customerID);
$theme_border_color = ll_private_labels_manager::get_branding_theme_color ($customerID, 'border');
$theme_hover_color = ll_private_labels_manager::get_branding_theme_color ($customerID, 'hover');


$form_id = $_GET['form_id'] ? intval($_GET['form_id']) : 0;

$ll_mturk_languages = ll_mturk_projects::get_supported_languages();

$form_lbl = 'Form';

$user_general_settings = new user_general_settings($userID);

$tUnixTime = time();
$datetime_now = gmdate("Y-m-d H:i:s", $tUnixDate);
$current_year = intval(gmdate("Y", $tUnixTime));

$event_custom_attribute = new event_custom_attribute_settings();
$event_custom_attribute->customerID = $customerID;
$attributes = $event_custom_attribute->get_all();

/*$is_template_page = false;
$is_builder_page = true;
$form_template_id = 0;
$form_title = '';
$form_name = 'Untitled Form';
$form_description = '';
$form_submit_button_text = 'Submit';
$default_layout_template = ll_layout_templates::load_default_layout_for_customer($customerID);
$form_ll_layout_template_id = $default_layout_template->ll_layout_template_id;
$form_ll_abstract_campaign_id = 0;
$form_ll_domain_list_id = 0;
$form_success_message = 'Success! Your submission has been saved!';
$form_error_message = 'Form not submitted.';
$form_pre_submit_code = "function llf_post_submit(){\n\t\n\treturn true;\n}";
$personal_email_error_message = "Sorry, we do not accept submissions from personal email addresses. Please use a business email address to submit this " . strtolower($form_lbl) . ".";
$form_captcha = $form_ti_prefill_fields = $form_is_disable_cookies = $is_donot_accept_personal_emails = $form_resubmit_wait_count = $form_redirect_competitors_to_different_url = 0;
$form_is_resubmit_wait = 1;
$form_resubmit_wait_period = $form_success_js_code = $form_designer_html = '';
$form_prefill_fields = $form_is_apply_success_at_parent = 1;
$form_redirect = $form_competitors_redirect = 'http://';
$duplicate_submission_error_message = 'Form already submitted. Please try again shortly.';
$in_case_of_duplicate_names = form::DEVICE_FORM_INCASE_OF_DUPLCIATE_NAME_MERGE;
$is_mobile_kiosk_mode = false;
$device_owner_option = 0;
$device_owner_option_specific_userID = 0;
$assign_owner_even_if_prospect_exists = false;
$is_enable_rapid_scan_mode = false;
$form_specific_competitors_domains = array();
$form_specific_email_addresses = array();
$donot_accept_submission = false;
$instructions_content = '';
$is_enforce_instructions_initially = 0;*/
/*$is_enable_email_validation = 0;
$email_validation_timeout = 1;*/


/*/*$form = null;
if ($form_id) {
    $form = form::get_form_by_id($customerID, $form_id);
    $vanity_url = vanity_urls_manager::get_vanity_url_per_asset($customerID, $form_id, vanity_urls_manager::LL_ASSETS_WEB_FORM);
    $vanity_url_id = !empty($vanity_url) ? intval($vanity_url['customer_subdomain_id']) : 0;
}

if (!$form || !$form->id) {
    header('Location: message.php?Invalid Form');
    exit ();
} elseif ($form->webform_builder_type == form::WEB_FORM_BUILDER_TYPE_CLASSIC) {
    header('Location: manage-web-form.php?id=' . $form_id);
    exit ();
} else {
    $is_clone = false;
    if (!empty ($_GET ['clone'])) {
        $is_clone = true;
    }
    $is_new_form = false;
    if (!empty ($_GET ['nf'])) {
        $is_new_form = true;
    }
    $options_lookup = form_elements::get_form_element_options($form_id);
    $form_elements = form_elements::get_form_elements($form_id, $options_lookup);
    $next_element_id = form_elements::get_next_element_id($form_id);
    $form_type = $form->form_type;
    $is_device_form = false;
    $is_event_template = false;
    $parent_template_form_id = $form->parent_template_form_id;
    $form_users = $form_invited_users = array();
    $event_form_style = '';
    if ($form_type == form::DEVICE_HOSTED_WEB_FORM_TYPE) {
        $is_device_form = true;
        $form_lbl = 'Event';
        $customer_groups = ll_customers_groups_for_form_devices::get_customer_groups($customerID);
        $ll_forms_groups = new ll_forms_groups();
        $ll_forms_groups->ll_form_id = $form_id;
        $form_groups = $ll_forms_groups->get_form_groups();
        $form_users = ll_users::get_users_for_form($customerID, $form_id);
        $form_invited_users = ll_users::get_pending_invited_users_for_form($customerID, $form_id);
        $event_form_style = new event_form_style($form_id);
    } elseif ($form_type == form::EVENT_TEMPLATE_WEB_FORM_TYPE) {
        $is_device_form = true;
        $is_event_template = true;
        $form_lbl = 'Template';
        $event_form_style = new event_form_style($form_id);
        $form_users = array_flip(is_array($form->template_user_access) ? $form->template_user_access : []);
    }

    $archive_date = $form->archive_date;
    $event_owner = $form->event_owner;
    $event_from_date = $form->event_from_date;
    $event_to_date = $form->event_to_date;
    $list_id = $form->ll_list_id;
    $ll_lists = ll_lists::get_all_lists_for_customer($customerID, true);
    $form_name = ($form->name) ? $form->name : $form_name;
    if ($is_clone) {
        $form_name .= ' - Copy';
    }
    $form_title = $form->title;
    $form_description = $form->description;
    $form_template_id = $form->form_template_id;
    $form_submit_button_text = ($form->submit_button_text) ? $form->submit_button_text : $form_submit_button_text;
    $form_ll_layout_template_id = $form->ll_layout_template_id;
    $form_success_message = ($form->success_message) ? $form->success_message : $form_success_message;
    $form_error_message = ($form->submit_error_message) ? $form->submit_error_message : $form_error_message;
    $form_pre_submit_code = ($form->pre_submit_code) ? $form->pre_submit_code : $form_pre_submit_code;
    $form_ll_domain_list_id = $form->ll_domain_list_id;
    $form_captcha = $form->captcha;
    $device_form_mode = 'normal';
    $is_mobile_kiosk_mode = $form->is_mobile_kiosk_mode ? true : false;
    $is_mobile_quick_capture_mode = $form->is_mobile_quick_capture_mode ? true : false;
    if ($is_mobile_quick_capture_mode) {
        $device_form_mode = 'quick_capture';
    } else if ($is_mobile_kiosk_mode) {
        $device_form_mode = 'kiosk';
    }

    $device_owner_option = $form->device_owner_option;
    $device_owner_option_specific_userID = $form->device_owner_option_specific_userID;
    $assign_owner_even_if_prospect_exists = $form->assign_owner_even_if_prospect_exists ? true : false;
    $is_enable_rapid_scan_mode = $form->is_enable_rapid_scan_mode ? true : false;
    $form_prefill_fields = $form->prefill_fields;
    $form_ti_prefill_fields = $form->ti_prefill_fields;
    $form_is_disable_cookies = $form->is_disable_cookies;
    $is_donot_accept_personal_emails = $form->is_donot_accept_personal_emails;
    $personal_email_error_message = ($form->personal_email_error_message) ? $form->personal_email_error_message : $personal_email_error_message;
    $form_is_resubmit_wait = $form->is_resubmit_wait;
    $form_resubmit_wait_count = $form->resubmit_wait_count;
    $form_resubmit_wait_period = $form->resubmit_wait_period;
    $form_is_apply_success_at_parent = $form->is_apply_success_at_parent;
    $form_redirect = $form->redirect;
    $form_redirect_competitors_to_different_url = $form->redirect_competitors_to_different_url;
    $donot_accept_submission = $form->donot_accept_submission ? true : false;
    $form_competitors_redirect = $form->competitors_redirect;
    $form_success_js_code = $form->success_js_code;
    $form_specific_competitors_domains = $form->specific_competitors_domains;
    $form_specific_email_addresses = $form->form_specific_email_addresses;
    $form_designer_html = $form->form_designer_html;
    $duplicate_submission_error_message = $form->resubmit_error_message ? $form->resubmit_error_message : $duplicate_submission_error_message;
    $form_payment_gateway_account_id = $form->payment_gateway_account_id;
    $is_show_credit_card_section = false;
    $is_recurring = $is_show_recurring_div = ($form->is_recurring) ? true : false;
    $instructions_content = $form->instructions_content;
    $is_enforce_instructions_initially = $form->is_enforce_instructions_initially;

    if ($form_type == form::DEVICE_HOSTED_WEB_FORM_TYPE) {
        if (!ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::MANAGE_DEVICE_FORMS)) {
            LL_Database::mysql_close();
            HEADER("location: notauthorized.php");
            exit ();
        }
    }
    if ($form_payment_gateway_account_id) {
        if ($form_type == form::DONATION_HOSTED_WEB_FORM_TYPE || $form_type == form::PAYMENT_HOSTED_WEB_FORM_TYPE) {
            $ll_supported_payment_gateways = payment_gateway_accounts::load_payment_gateway_accounts_fo_customer($customerID, 0, true);
            if (!empty($ll_supported_payment_gateways)) {
                foreach ($ll_supported_payment_gateways as $index => $supported_payment_gateway) {
                    if ($supported_payment_gateway->is_support_recurring) {
                        $payment_gateway_account_recurring_plans = payment_gateways_recurring_plans::load_recurring_plans_for_account($supported_payment_gateway->payment_gateway_account_id, false);
                        if (!empty($payment_gateway_account_recurring_plans)) {
                            foreach ($payment_gateway_account_recurring_plans as $sub_index => $payment_gateway_account_recurring_plan) {
                                $payment_gateway_account_recurring_plan->is_selected = 1;
                                $payment_gateway_account_recurring_plans[$sub_index] = $payment_gateway_account_recurring_plan;
                            }
                            $supported_payment_gateway->recurring_plans = $payment_gateway_account_recurring_plans;
                            $ll_supported_payment_gateways [$index] = $supported_payment_gateway;
                        }
                    }
                }
            }
            $form_payment_gateway_account = new payment_gateway_accounts();
            $form_payment_gateway_account = $ll_supported_payment_gateways[$form_payment_gateway_account_id];
            if ($form_payment_gateway_account->payment_gateway_account_id) {
                if ($form_payment_gateway_account->is_onsite) {
                    $is_show_credit_card_section = true;
                }
                $selected_recurring_plans = array();
                $selected_recurring_plans = json_decode(html_entity_decode($form->selected_recurring_plans), true);

                if ($form_payment_gateway_account->is_support_recurring) {
                    if ($form_type == form::DONATION_HOSTED_WEB_FORM_TYPE) {
                        $is_show_recurring_div = true;
                    }
                    $payment_gateways_recurring_plans = payment_gateways_recurring_plans::load_ll_defined_recurring_plans_for_account($form_payment_gateway_account_id);
                    if (!empty($payment_gateways_recurring_plans)) {
                        foreach ($payment_gateways_recurring_plans as $index => $payment_gateways_recurring_plan) {
                            $payment_gateways_recurring_plan->is_selected = 1;
                            if (!empty($selected_recurring_plans)) {
                                if (!in_array($payment_gateways_recurring_plan->payment_gateway_recurring_plan_id, $selected_recurring_plans)) {
                                    $payment_gateways_recurring_plan->is_selected = 0;
                                }
                            }
                            $payment_gateways_recurring_plans[$index] = $payment_gateways_recurring_plan;
                        }
                    }
                    $payment_gateways_imported_recurring_plans = payment_gateways_recurring_plans::load_imported_plans_for_account($customerID, $form_payment_gateway_account_id);
                }
            }
        }
    }
    if ($form->ll_campaign_id) {
        $ll_campaign_info = ll_campaigns::check_campaign_by_id($customerID, $form->ll_campaign_id);
        $form_ll_abstract_campaign_id = $ll_campaign_info['ll_abstract_campaign_id'];
    }

    $ll_abstract_campaigns = ll_abstract_campaigns::get_ll_abstract_campaigns_for_customer($customerID);
    $ll_layout_templates = ll_layout_templates::load_all_templates_for_customer($customerID);
    $ll_domain_lists = ll_domain_lists::load_all_domain_lists_per_customer($customerID);

    $ll_standard_fields_result = get_ll_standard_fields_info();
    $ll_standard_fields_info = $ll_standard_fields_result ['ll_standard_fields'];
    $ll_standard_fields_labels_to_ids = $ll_standard_fields_result ['ll_standard_fields_labels_to_ids'];

    $ll_custom_fields_info = get_ll_custom_fields_info($customerID);
    $ll_standard_fields = $ll_standard_fields_result ['ll_standard_fields'];
    $fields_name = array();
    $dropdwon_fields = array();
    $text_fields = array();
    foreach ($ll_standard_fields as $ll_standard_field) {
        $fields_name ['standard_' . $ll_standard_field['llsf.ll_standard_field_id']] = $ll_standard_field['llsf.ll_standard_field_name'];
        if ($ll_standard_field['llsf.field_sub_type_id'] == ll_field_type::LL_FIELD_SUB_TYPE_DROPDOWN_ID || $ll_standard_field['llsf.field_sub_type_id'] == ll_field_type::LL_FIELD_SUB_TYPE_MULTIPLE_OPTIONS_ID) {
            $dropdwon_fields ['standard_' . $ll_standard_field['llsf.ll_standard_field_id']] = $ll_standard_field['llsf.ll_standard_field_name'];
        }
        if ($ll_standard_field['llsf.field_data_type_id'] == ll_field_type::LL_FIELD_TYPE_TEXT_ID) {
            $text_fields ['standard_' . $ll_standard_field['llsf.ll_standard_field_id']] = $ll_standard_field['llsf.ll_standard_field_name'] . ' [Standard]';
        }
    }
    foreach ($ll_custom_fields_info as $ll_custom_field) {
        $fields_name ['custom_' . $ll_custom_field['llcf.ll_custom_field_id']] = $ll_custom_field['llcf.ll_custom_field_name'];
        if ($ll_custom_field['llcf.field_sub_type_id'] == ll_field_type::LL_FIELD_SUB_TYPE_DROPDOWN_ID || $ll_custom_field['llcf.field_sub_type_id'] == ll_field_type::LL_FIELD_SUB_TYPE_MULTIPLE_OPTIONS_ID) {
            $dropdwon_fields ['custom_' . $ll_custom_field['llcf.ll_custom_field_id']] = $ll_custom_field['llcf.ll_custom_field_name'];
        }
        if ($ll_custom_field['llcf.field_data_type_id'] == ll_field_type::LL_FIELD_TYPE_TEXT_ID) {
            $text_fields ['custom_' . $ll_custom_field['llcf.ll_custom_field_id']] = $ll_custom_field['llcf.ll_custom_field_name'] . ' [Custom]';
        }
    }
    asort($fields_name);
    asort($dropdwon_fields);
    $customer_subdomains = vanity_urls_manager::get_vanity_url($customerID, vanity_urls_manager::LL_ASSETS_WEB_FORM, $form_id);
    $customer_subdomain_url = $customer_subdomains['subdomain_url'];
    $add_customerID_in_the_url = '';
    if (!$customer_subdomain_url) {
        $customer_subdomain_url = LL_APP_HTTP;
        $add_customerID_in_the_url = '&ll_custID=' . $customerID;
    }

    $customer_general_settings = customer_general_settings::load_customer_settings($customerID);

    $customer_content_management_settings = customer_general_settings::load_customer_content_management_settings($customerID);
    if ($customer_content_management_settings ['ll_s3_bucket_id']) {
        $ll_s3_bucket_id = $customer_content_management_settings ['ll_s3_bucket_id'];
        $ll_s3_bucket = new ll_s3_buckets ($ll_s3_bucket_id);
        if ($ll_s3_bucket->ll_s3_bucket_id && $ll_s3_bucket->bucket_name && $ll_s3_bucket->bucket_access_key_id && $ll_s3_bucket->bucket_secret_access_key && $ll_s3_bucket->is_active) {
            $MEDIA_MANAGER_ENABLED = true;
        } else {
            $MEDIA_MANAGER_ENABLED = false;
        }
    } else {
        $MEDIA_MANAGER_ENABLED = false;
    }

    $in_case_of_duplicate_names = $form->in_case_of_duplicate_names;

    $ll_users = ll_users::load_users_for_customer($customerID);

    if ($form_type == form::DEVICE_HOSTED_WEB_FORM_TYPE || $form_type == form::EVENT_TEMPLATE_WEB_FORM_TYPE) {
        $ll_supported_barcode_provider_types = ll_supported_barcode_provider_types::load_ll_supported_barcode_provider_types(true);
    }
    // $customer_is_enable_email_validation = customer_general_settings::is_enable_email_validation($customerID);

    $regions = ll_customer_regions::load_per_customer($customerID);

    $labels = ll_customers_labels::load_labels($customerID);
    $form_labels = ll_customers_assets_labels::load_asset_labels($customerID, ll_customers_assets_labels::LL_ASSET_TYPE_DEVICE_FORM, $form_id);

    $form_address = '';
    $street_address = $city = $state = $zipcode = $country = '';
    if ($form_type == form::DEVICE_HOSTED_WEB_FORM_TYPE || $form_type == form::EVENT_TEMPLATE_WEB_FORM_TYPE) {
        $device_form_address = form::load_ll_device_form_address($customerID, $form_id);
        if (!empty($device_form_address)) {
            $form_address = $device_form_address ? $device_form_address['address'] : '';
           // $device_form_address = $device_form_address['address_object'];
            $street_address = isset($device_form_address['street_address']) ? $device_form_address['street_address'] : '';
            $city = isset($device_form_address['city']) ? $device_form_address['city'] : '';
            $country = isset($device_form_address['country_code']) ? $device_form_address['country_code'] : '';
            $state = isset($device_form_address['state_code']) ? $device_form_address['state_code'] : '';
            $zipcode = isset($device_form_address['zipcode']) ? $device_form_address['zipcode'] : '';
            if(!trim($form_address)) {
                $form_address = user_additional_info::generate_full_address($street_address, '', $city, $state, $country, $zipcode);
            }
        }
    }

    $ll_barcode_sets = ll_barcode_sets::load_customer_barcode_set($customerID);

    $allow_user_to_sfmc_mapping = false;
    if ($is_device_form && ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$SFDC_MARKETING_CLOUD)) {
        $allow_user_to_sfmc_mapping = true;
    }

    $folder = ll_folders::get_asset_folder($customerID, $form->ll_campaign_id, ll_folders::LL_ASSET_TYPE_CAMPAIGN);

    $documents_sets = (new ll_documents_set())->get_documents_sets_for_customer($customerID);
}*/
?>
<?PHP

include_once 'Util/SetAccountConfigurationVariables.php';
?>
<?php include 'meta-doctype.php'; ?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <?php
    include 'meta-common.php';
    include 'style-common.php';
    ?>
 <!--   <script type="text/javascript">
        form_max_no_of_file_upload_elements = '<?php /*echo $customer_general_settings['form_max_no_of_file_upload_elements']*/?>';
        access_form_users = <?php /*echo json_encode(array_values(array_unique(array_merge(array_keys($form_users), array_keys($form_invited_users)))));*/?>;
        event_form_style =  <?php /*echo json_encode($event_form_style);*/?>;
        current_year = <?php /*echo $current_year;*/?>;
        form_id = <?php /*echo $form_id;*/?>;
        next_element_id = <?php /*echo $next_element_id;*/?>;
        form_type = <?php /*echo $form_type;*/?>;
        DONATION_HOSTED_WEB_FORM_TYPE = <?php /*echo form::DONATION_HOSTED_WEB_FORM_TYPE;*/?>;
        PAYMENT_HOSTED_WEB_FORM_TYPE = <?php /*echo form::PAYMENT_HOSTED_WEB_FORM_TYPE;*/?>;
        DEVICE_OWNER_OPTION_SPECIFIC_USER = <?php /*echo form::DEVICE_OWNER_OPTION_SPECIFIC_USER*/?>;
        LL_BUSINESS_CARDS_REQUEST_TYPE_EXTERNAL = <?php /*echo ll_business_cards_requests::LL_BUSINESS_CARDS_REQUEST_TYPE_EXTERNAL*/?>;
        LL_BUSINESS_CARDS_REQUEST_TYPE_INTERNAL = <?php /*echo ll_business_cards_requests::LL_BUSINESS_CARDS_REQUEST_TYPE_INTERNAL*/?>;
        LL_BUSINESS_CARDS_REQUEST_TYPE_EXPEDITED = <?php /*echo ll_business_cards_requests::LL_BUSINESS_CARDS_REQUEST_TYPE_EXPEDITED*/?>;
        var ll_supported_barcode_provider_types = [];
        <?php /*if(!empty($ll_supported_barcode_provider_types)){*/?>
        <?php /*foreach($ll_supported_barcode_provider_types as $ll_supported_barcode_provider_type){*/?>
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] = {};
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['ll_supported_barcode_provider_type_id'] = '<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id;*/?>';
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['provider_name'] = '<?php /*echo $ll_supported_barcode_provider_type->provider_name;*/?>';
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['provider_alias'] = '<?php /*echo $ll_supported_barcode_provider_type->provider_alias;*/?>';
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['is_active'] = '<?php /*echo $ll_supported_barcode_provider_type->is_active;*/?>';
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['authentication_info'] = {};
        <?php /*if(!empty($ll_supported_barcode_provider_type->authentication_info)){*/?>
        <?php /*foreach($ll_supported_barcode_provider_type->authentication_info as $key => $info){*/?>
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['authentication_info'] ['<?php /*echo $key;*/?>'] = {};
        <?php /*if(!empty($info) && is_array($info)){*/?>
        <?php /*foreach($info as $sub_key => $value){*/?>
        ll_supported_barcode_provider_types ['<?php /*echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; */?>'] ['authentication_info'] ['<?php /*echo $key;*/?>']['<?php /*echo $sub_key;*/?>'] = '<?php /*echo $value;*/?>';
        <?php /*}*/?>
        <?php /*}*/?>
        <?php /*}*/?>
        <?php /*}*/?>
        <?php /*}*/?>
        <?php /*}*/?>
        var ll_barcode_sets = [];
        <?php /*if(!empty($ll_barcode_sets)){*/?>
        <?php /*foreach($ll_barcode_sets as $ll_barcode_set){*/?>
        ll_barcode_sets.push({
            "id": "<?php /*echo $ll_barcode_set->ll_barcode_set_id;*/?>",
            "name": "<?php /*echo $ll_barcode_set->ll_barcode_set_name;*/?>"
        });
        <?php /*}*/?>
        <?php /*}*/?>
        var device_form_address = {};
        <?php /*if(($form_type == form::DEVICE_HOSTED_WEB_FORM_TYPE || $form_type == form::EVENT_TEMPLATE_WEB_FORM_TYPE) && !empty($device_form_address)){*/?>
        device_form_address = <?php /*echo json_encode($device_form_address);*/?>;
        <?php /*}*/?>
        var allow_user_to_sfmc_mapping = false;
        <?php /*if($allow_user_to_sfmc_mapping){*/?>
        allow_user_to_sfmc_mapping = true;
        <?php /*}*/?>
        var custom_css_files = [];
        <?php /*if(!empty($form->custom_css_files)){*/?>
        <?php /*foreach($form->custom_css_files as $custom_css_file){*/?>
        custom_css_files.push('<?php /*echo $custom_css_file;*/?>');
        <?php /*}*/?>
        <?php /*}*/?>
    </script>-->

    <title><?php
        echo ll_private_labels_manager::get_branding_name($customerID) . ' - ';
        echo PAGE_TITLE;
        ?></title>
    <link rel="stylesheet" type="text/css" href="CSS/forms.css"/>
    <link type="text/css" href="js/colpick/css/colpick.css" rel="stylesheet"/>
    <?php
    include 'javascript_common.php';
    include 'form-designer-common.php';
    include 'check-export-destinations-permissions.php';
    ?>
    <script type="text/javascript" src="js/jquery-ui-1.9.2.custom.min.js"></script>
    <script src="js/context_menu/src/jquery.ui.position.js" type="text/javascript"></script>
    <script src="js/context_menu/src/jquery.contextMenu.js" type="text/javascript"></script>
    <script src="js/jquery/jquery.bootstrap-touchspin.js" type="text/javascript"></script>
    <!--<script type="text/javascript" src="js/tinymce4/js/tinymce/tinymce.min.js<?php /*include 'll-cache-validator.php';*/ ?>"></script>-->
    <script src="js/jquery.inputmask/js/inputmask.js" type="text/javascript"></script>
    <script src="js/jquery.inputmask/js/jquery.inputmask.js" type="text/javascript"></script>
    <script src='https://www.google.com/recaptcha/api.js'></script>
    <script src="js/colpick/js/colpick.js" type="text/javascript"></script>
    <script src="js/jquery.timeentry/jquery.timeentry.js" type="text/javascript"></script>
    <script src="js/ll_folders_panel.js<?php include 'll-cache-validator.php'; ?>" type="text/javascript"></script>
    <!--<script type="text/javascript">
        var LL_APP_HTTPS = '<?php /*echo LL_APP_HTTPS;*/?>'
        var is_clone = 0;
        <?php
/*        if($is_clone){
        */?>
        form_clone = is_clone = 1;
        <?php
/*        }
        */?>
        var is_new_form = 0;
        <?php
/*        if($is_new_form){
        */?>
        is_new_form = 1;
        <?php
/*        }
        */?>
        var add_new_fields_to = 'bottom';
        <?php /*if($user_general_settings->form_builder_add_new_fields_mode == 2){*/?>
        add_new_fields_to = 'top';
        <?php /*}*/?>
        MEDIA_MANAGER_ENABLED = <?php /*if ($MEDIA_MANAGER_ENABLED) echo 'true'; else echo 'false'; */?>;
        <?php /*if($MEDIA_MANAGER_ENABLED){*/?>
        _moxiemanager_plugin = '<?php /*echo SITEROOTHTTPS */?>js/moxiemanager/plugin.min.js?v=<?php /*echo MOXIE_MANAGER_VERSION*/?>';
        <?php /*} else { */?>
        _moxiemanager_plugin = '';
        <?php /*}*/?>
        ll_standard_fields_info = new Array();
        ll_custom_fields_info = new Array();
        ll_standard_fields_labels_to_ids = new Array();
        <?php
/*        foreach ($ll_standard_fields_info as $ll_standard_field_id => $ll_standard_field_info) {
            echo "
			ll_standard_fields_info[$ll_standard_field_id] = new Array();
			";
            foreach ($ll_standard_field_info as $key => $value) {
                echo "
				ll_standard_fields_info[$ll_standard_field_id]['" . ValiedateInput($key) . "'] = '" . ValiedateInput($value) . "';
				";
            }
        }
        foreach ($ll_custom_fields_info as $ll_custom_field_id => $ll_custom_field_info) {
            echo "
			ll_custom_fields_info[$ll_custom_field_id] = new Array();
			";
            foreach ($ll_custom_field_info as $key => $value) {
                echo "
				ll_custom_fields_info[$ll_custom_field_id]['" . ValiedateInput($key) . "'] = '" . ValiedateInput($value) . "';
				";
            }
        }
        foreach ($ll_standard_fields_labels_to_ids as $ll_standard_field_label => $ll_standard_field_id) {
            echo "
			ll_standard_fields_labels_to_ids['$ll_standard_field_label'] = '$ll_standard_field_id';
			";
        }
        */?>
        ll_standard_fields = [];
        <?php
/*        foreach ($ll_standard_fields as $ll_standard_field_id => $field) {
            echo "
    		ll_standard_fields['{$ll_standard_field_id}'] = [];
    		ll_standard_fields['{$ll_standard_field_id}']['ll_standard_field_id'] = '{$field['llsf.ll_standard_field_id']}';
    		ll_standard_fields['{$ll_standard_field_id}']['ll_standard_field_name'] = '{$field['llsf.ll_standard_field_name']}';
    		ll_standard_fields['{$ll_standard_field_id}']['ll_standard_field_label'] = '{$field['llsf.ll_standard_field_label']}';
    		ll_standard_fields['{$ll_standard_field_id}']['field_data_type_id'] = '{$field['llsf.field_data_type_id']}';
    		ll_standard_fields['{$ll_standard_field_id}']['data_type_name'] = '{$field['fdt.data_type_name']}';
    		ll_standard_fields['{$ll_standard_field_id}']['data_type_alias'] = '{$field['fdt.data_type_alias']}';
    		";
        }
        */?>
        ll_custom_fields = [];
        <?php
/*        foreach ($ll_custom_fields_info as $ll_custom_field_id => $field) {
            echo "
    		ll_custom_fields['{$ll_custom_field_id}'] = [];
    		ll_custom_fields['{$ll_custom_field_id}']['ll_custom_field_id'] = '{$field['llcf.ll_custom_field_id']}';
    		ll_custom_fields['{$ll_custom_field_id}']['ll_custom_field_name'] = '" . ValiedateInput($field['llcf.ll_custom_field_name']) . "';
    		ll_custom_fields['{$ll_custom_field_id}']['ll_custom_field_identifier'] = '{$field['llcf.ll_custom_field_identifier']}';
    		ll_custom_fields['{$ll_custom_field_id}']['field_data_type_id'] = '{$field['llcf.field_data_type_id']}';
    		ll_custom_fields['{$ll_custom_field_id}']['data_type_name'] = '{$field['fdt.data_type_name']}';
    		ll_custom_fields['{$ll_custom_field_id}']['data_type_alias'] = '{$field['fdt.data_type_alias']}';
    		";
        }
        */?>
        ll_fields = [];
        <?php
/*        $index = 0;
        foreach ($fields_name as $field_id => $field_name) {
            echo "
    		ll_fields[$index] = ['$field_id', '" . ValiedateInput($field_name) . "'];
    		";
            $index++;
        }
        */?>
        LL_STANDARD_FIELD_WorkPhone_ID = <?php /*echo LL_STANDARD_FIELD_WorkPhone_ID*/?>;
        LL_STANDARD_FIELD_Email_ID = <?php /*echo LL_STANDARD_FIELD_Email_ID;*/?>;
        LL_STANDARD_FIELD_FirstName_ID = <?php /*echo LL_STANDARD_FIELD_FirstName_ID;*/?>;
        LL_STANDARD_FIELD_LastName_ID = <?php /*echo LL_STANDARD_FIELD_LastName_ID;*/?>;

        LL_STANDARD_FIELD_StreetAddress_ID = <?php /*echo LL_STANDARD_FIELD_StreetAddress_ID;*/?>;
        LL_STANDARD_FIELD_StreetAddress2_ID = <?php /*echo LL_STANDARD_FIELD_StreetAddress2_ID;*/?>;
        LL_STANDARD_FIELD_Zipcode_ID = <?php /*echo LL_STANDARD_FIELD_Zipcode_ID;*/?>;
        LL_STANDARD_FIELD_State_ID = <?php /*echo LL_STANDARD_FIELD_State_ID;*/?>;
        LL_STANDARD_FIELD_City_ID = <?php /*echo LL_STANDARD_FIELD_City_ID;*/?>;
        LL_STANDARD_FIELD_Country_ID = <?php /*echo LL_STANDARD_FIELD_Country_ID;*/?>;

        form_payment_gateway_account_id = <?php /*echo $form_payment_gateway_account_id;*/?>;
        <?php
/*        if(!empty($ll_supported_payment_gateways)){
        echo "var supported_payment_gateways = [];";
        foreach ($ll_supported_payment_gateways as $supported_payment_gateway) {
        */?>
        supported_payment_gateways [<?php /*echo $supported_payment_gateway->payment_gateway_account_id;*/?>] = [];
        <?php
/*        foreach ($supported_payment_gateway as $key => $value) {
        if($key != 'recurring_plans'){
        */?>
        supported_payment_gateways [<?php /*echo $supported_payment_gateway->payment_gateway_account_id;*/?>] ['<?php /*echo $key;*/?>'] = '<?php /*echo $value;*/?>';
        <?php
/*        }else{
        */?>
        supported_payment_gateways [<?php /*echo $supported_payment_gateway->payment_gateway_account_id;*/?>] ['<?php /*echo $key;*/?>'] = [];
        <?php
/*        foreach ($supported_payment_gateway->{$key} as $index => $recurring_plan_object){
        */?>
        supported_payment_gateways [<?php /*echo $supported_payment_gateway->payment_gateway_account_id;*/?>] ['<?php /*echo $key;*/?>'] ['<?php /*echo $index;*/?>'] = [];
        <?php
/*        foreach ($recurring_plan_object as $sub_key => $sub_value){
        */?>
        supported_payment_gateways [<?php /*echo $supported_payment_gateway->payment_gateway_account_id;*/?>] ['<?php /*echo $key;*/?>'] ['<?php /*echo $index;*/?>'] ['<?php /*echo $sub_key;*/?>'] = '<?php /*echo $sub_value;*/?>';
        <?php
/*        }

        if ($recurring_plan_object->is_defined_by_ll) {
            $recurring_plan_name = payment_gateways_recurring_plans::get_plan_interval_name($recurring_plan_object->payment_gateway_recurring_plan_interval);
        } else {
            $recurring_plan_name = $recurring_plan_object->name;
        }
        */?>
        supported_payment_gateways [<?php /*echo $supported_payment_gateway->payment_gateway_account_id;*/?>] ['<?php /*echo $key;*/?>'] ['<?php /*echo $index;*/?>'] ['recurring_plan_name'] = '<?php /*echo $recurring_plan_name;*/?>';
        <?php
/*        }
        }
        }
        }
        }
        */?>
        is_show_credit_card_section = <?php /*echo ($is_show_credit_card_section) ? 1 : 0;*/?>;
        is_show_recurring_div = <?php /*echo ($is_show_recurring_div) ? 1 : 0;*/?>;
        is_has_saved_html = false;
        <?php /*if($form_designer_html){*/?>
        is_has_saved_html = true;
        <?php /*}*/?>
        LL_SINGLE_FIELD_PROCESS_TYPE_MERGE = <?php /*echo form::LL_SINGLE_FIELD_PROCESS_TYPE_MERGE;*/?>;
        LL_SINGLE_FIELD_PROCESS_TYPE_OVERRIDE = <?php /*echo form::LL_SINGLE_FIELD_PROCESS_TYPE_OVERRIDE;*/?>;
        DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY = <?php /*echo form::DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY;*/?>;
        DATA_PROCESS_TYPE_OVERRIDE = <?php /*echo form::DATA_PROCESS_TYPE_OVERRIDE;*/?>;
        DATA_PROCESS_TYPE_MERGE = <?php /*echo form::DATA_PROCESS_TYPE_MERGE;*/?>;
        is_device_form = <?php /*if($is_device_form){*/?>true<?php /*}else{*/?>false<?php /*}*/?>;
        is_event_template = <?php /*if($is_event_template){*/?>true<?php /*}else{*/?>false<?php /*}*/?>;
        parent_template_form_id = <?php /*echo $parent_template_form_id;*/?>;
        archive_date = '<?php /*echo $archive_date;*/?>';
        is_recurring = <?php /*echo $form_payment_gateway_account->is_support_recurring ? 1 : 0;*/?>;
        PAYMENT_PLANS_CUSTOM = <?php /*echo form::PAYMENT_PLANS_CUSTOM;*/?>;
        PAYMENT_PLANS_GATEWAY = <?php /*echo form::PAYMENT_PLANS_GATEWAY;*/?>;
        var regions = [];
        <?php /*if(!empty($regions)){*/?>
        <?php /*foreach($regions as $region){*/?>
        regions.push({
            "id": <?php /*echo $region->ll_customer_region_id;*/?>,
            "name": "<?php /*echo $region->ll_customer_region_name;*/?>"
        });
        <?php /*}*/?>
        <?php /*}*/?>
        BADGE_TYPE_BARCODE = '<?php /*echo ll_supported_barcode_provider_types::BADGE_TYPE_BARCODE; */?>';
        BADGE_TYPE_NFC = '<?php /*echo ll_supported_barcode_provider_types::BADGE_TYPE_NFC; */?>';

        ADD_ELEMENTS_PERMISSION = <?php /*echo (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::ADD_ELEMENTS) ? 1 : 0);*/?>;
        REMOVE_ELEMENTS_PERMISSION = <?php /*echo (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::REMOVE_ELEMENTS) ? 1 : 0);*/?>;
        CHANGE_ELEMENTS_PERMISSION = <?php /*echo (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::CHANGE_ELEMENTS) ? 1 : 0);*/?>;


    </script>-->
    <script type="text/javascript" src="js/wizard-header-manager.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript">wizard_header_manager.asset_type = 'FORM';</script>
    <script type="text/javascript">wizard_header_manager.asset_id = <?php echo $form_id;?>;</script>
    <script type="text/javascript">wizard_header_manager.callback = function (form_name) {
            $('input[name="form_name"]').val(form_name);
        };</script>

    <script type="text/javascript"
            src="js/ll-data-sources-manager.js<?php include 'll-cache-validator.php'; ?>"></script>

    <script type="text/javascript"
            src="js/ll-column-field-selector-manager.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript" src="js/ll-export-manager.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript"
            src="js/ll-form-automatic-export-manager.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript" src="js/form-designer.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript" src="js/ll-documents-manager.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript"
            src="js/elements-merge-settings.js<?php include 'll-cache-validator.php'; ?>"></script>
    <script type="text/javascript" src="js/test-scan-manager.js<?php include 'll-cache-validator.php'; ?>"></script>

    <?php
    if ($is_device_form) {
        ?>
    <style>
        #wrap-form-submit-button {
            display: none;
        }
        #wrap-form-submit-button input {
            display: none;
        }
    </style>
        <?php
    }
    ?>

</head>
<body class="form-builder theme">
<div id="mainWrapper">
    <?php include 'form-designer-header.php'; ?>
    <div id="form-editor" <?php if ($_SESSION['impersonalized_login']){ ?>class="impersonation_message editor_mode"<?php } ?>>
        <div class="wrap-preview-col">
            <div class="resize-col"></div>
            <div class="preview-col">
                <div class="eb-wrap-form-page">
                    <?php if ($form_designer_html) {
                        echo $form_designer_html;
                    } elseif (!$form_template_id || $form_template_id == form::HOSTED_WEB_FORM_TEMPLATE_ONE_COLUMN) {
                        ?>
                        <div class="tpl-container ll-form-box" id="ll-form-box">
                            <div class="tpl-block info-form" data-type-el="0"
                                 <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                <div class="form-tit"><?php echo $form_title; ?></div>
                                <div class="form-desc"><?php echo $form_description; ?></div>
                                <div class="tpl-block-controls">
                                    <a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>
                                    <a href="javascript:void(0);" class="t-btn-gray tpl-block-delete form_info"><i></i></a>
                                </div>
                            </div>
                            <div class="fb-wrap-columns-form  clearfix"
                                 data-json='{"btnAlign":"0", "labelWidth":"16", "isTransparentFormBackground":"0", "formBackground":"#fff", "formTextColor":"#333333", "fieldLength":"large", "labelFont":"Open Sans", "labelSize":"14", "labelColor":"#333333", "labelPos":"0", "fieldBackground":"#ffffff", "fieldBorderStyle":"Solid", "fieldBorderWidth":"1", "fieldBorderColor":"#c9c9c9", "fieldFont":"Open Sans", "fieldSize":"13", "fieldColor":"#333333", "dropdownBackground":"#f8f8f8", "dropdownBorderColor":"#c9c9c9", "dropdownFont":"Open Sans", "dropdownSize":"13", "dropdownColor":"#333333", "btnBackground":"#<?php echo $theme_color;?>", "btnHoverBackground": "#<?php echo $theme_hover_color;?>", "btnBorderStyle":"Solid", "btnBoderWidth":"1", "btnBorderColor":"#<?php echo $theme_border_color;?>", "btnFont":"Open Sans", "btnSize":"16", "btnColor":"#ffffff"}'>
                                <div class="wrap-tpl-block">
                                </div>
                                <div id="wrap-form-submit-button" <?php if ($is_device_form){ ?>style="display:none !important;"<?php } ?>>
                                    <input type="submit"
                                           class="t-btn-orange form-submit-button form-submit-button-color"
                                           value="<?php echo $form_submit_button_text; ?>"/>
                                </div>
                                <div class="fb-dragenddrop-box">
                                    <svg width="110px" height="100px" viewBox="0 0 80 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="Page-Content-elements" transform="translate(-406.000000, -97.000000)" fill="#FF982B" fill-rule="nonzero" class="svg-fill">
                                                <g id="Right-Side-2" transform="translate(7.000000, 49.000000)">
                                                    <g id="Image" transform="translate(20.000000, 20.055006)">
                                                        <path d="M453,44.0374036 L412.335111,44.0374036 L412.335111,32.4294135 C412.335111,29.8933953 411.722397,29.671496 409.353592,31.7278034 L381.537384,55.8744427 C381.354147,56.0335068 381.354266,56.118977 381.537384,56.2779384 L409.353592,80.4245777 C411.724523,82.4827309 412.335111,82.2620709 412.335111,79.7229676 L412.335111,68.1166118 L453,68.1166118 C453.883656,68.1166118 454.6,67.4002674 454.6,66.5166119 L454.6,45.6374035 C454.6,44.753748 453.883656,44.0374036 453,44.0374036 Z M414.73511,41.6374037 L453,41.6374037 C455.209139,41.6374037 457,43.4282646 457,45.6374035 L457,66.5166119 C457,68.7257508 455.209139,70.5166117 453,70.5166117 L414.73511,70.5166117 L414.73511,79.7229676 C414.73511,84.4457293 411.620631,85.5706726 407.780299,82.2369648 L379.964091,58.0903255 C378.682667,56.9779495 378.674612,55.1814239 379.964091,54.0620556 L407.780299,29.9154163 C411.621335,26.581097 414.73511,27.7135225 414.73511,32.4294135 L414.73511,41.6374037 Z" id="Rectangle-154" transform="translate(418.000000, 56.077008) scale(-1, 1) translate(-418.000000, -56.077008) "></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <div>Click the buttons on the right or drag and</div>
                                    <div>drop them to the canvas to build your form</div>
                                </div>
                            </div>
                        </div>
                        <?php
                    } elseif ($form_template_id == form::HOSTED_WEB_FORM_TEMPLATE_TWO_COLUMN) {
                        ?>
                        <div class="tpl-container" id="ll-form-box">
                            <div class="tpl-block info-form" data-type-el="0"
                                 <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                <div class="form-tit"><?php echo $form_title; ?></div>
                                <div class="form-desc"><?php echo $form_description; ?></div>
                                <div class="tpl-block-controls">
                                    <a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>
                                </div>
                            </div>
                            <div class="fb-wrap-columns-form fb-wrap-two-columns clearfix"
                                 data-json='{"btnAlign":"0", "labelWidth":"16", "formBackground":"#fff", "formTextColor":"#333333", "fieldLength":"large", "labelFont":"Open Sans", "labelSize":"14", "labelColor":"#333333", "labelPos":"0", "fieldBackground":"#ffffff", "fieldBorderStyle":"Solid", "fieldBorderWidth":"1", "fieldBorderColor":"#c9c9c9", "fieldFont":"Open Sans", "fieldSize":"13", "fieldColor":"#333333", "dropdownBackground":"#f8f8f8", "dropdownBorderColor":"#c9c9c9", "dropdownFont":"Open Sans", "dropdownSize":"13", "dropdownColor":"#333333", "btnBackground":"#<?php echo $theme_color;?>", "btnHoverBackground": "#<?php echo $theme_hover_color;?>","btnBorderStyle":"Solid", "btnBoderWidth":"1", "btnBorderColor":"#<?php echo $theme_border_color;?>", "btnFont":"Open Sans", "btnSize":"16", "btnColor":"#ffffff"}'>
                                <div class="wrap-tpl-block tpl-column-1">
                                    <div class="fb-dragenddrop-box-text">
                                        Drop Content Blocks Here
                                    </div>
                                </div>
                                <div class="tpl-column-2 wrap-tpl-block">
                                    <div class="fb-dragenddrop-box-text">
                                        Drop Content Blocks Here
                                    </div>
                                </div>
                                <div id="wrap-form-submit-button" <?php if ($is_device_form){ ?>style="display:none !important;"<?php } ?>>
                                    <input type="submit"
                                           class="t-btn-orange form-submit-button form-submit-button-color"
                                           value="<?php echo $form_submit_button_text; ?>"/>
                                </div>
                                <div class="fb-dragenddrop-box">
                                    <svg width="110px" height="100px" viewBox="0 0 80 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="Page-Content-elements" transform="translate(-406.000000, -97.000000)" fill="#FF982B" fill-rule="nonzero" class="svg-fill">
                                                <g id="Right-Side-2" transform="translate(7.000000, 49.000000)">
                                                    <g id="Image" transform="translate(20.000000, 20.055006)">
                                                        <path d="M453,44.0374036 L412.335111,44.0374036 L412.335111,32.4294135 C412.335111,29.8933953 411.722397,29.671496 409.353592,31.7278034 L381.537384,55.8744427 C381.354147,56.0335068 381.354266,56.118977 381.537384,56.2779384 L409.353592,80.4245777 C411.724523,82.4827309 412.335111,82.2620709 412.335111,79.7229676 L412.335111,68.1166118 L453,68.1166118 C453.883656,68.1166118 454.6,67.4002674 454.6,66.5166119 L454.6,45.6374035 C454.6,44.753748 453.883656,44.0374036 453,44.0374036 Z M414.73511,41.6374037 L453,41.6374037 C455.209139,41.6374037 457,43.4282646 457,45.6374035 L457,66.5166119 C457,68.7257508 455.209139,70.5166117 453,70.5166117 L414.73511,70.5166117 L414.73511,79.7229676 C414.73511,84.4457293 411.620631,85.5706726 407.780299,82.2369648 L379.964091,58.0903255 C378.682667,56.9779495 378.674612,55.1814239 379.964091,54.0620556 L407.780299,29.9154163 C411.621335,26.581097 414.73511,27.7135225 414.73511,32.4294135 L414.73511,41.6374037 Z" id="Rectangle-154" transform="translate(418.000000, 56.077008) scale(-1, 1) translate(-418.000000, -56.077008) "></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <div>Click the buttons on the right or Drag and</div>
                                    <div>Drop it to add fields to your form</div>
                                </div>
                            </div>
                        </div>
                        <?php
                    } elseif ($form_template_id == form::HOSTED_WEB_FORM_TEMPLATE_THREE_COLUMN) {
                        ?>
                        <div class="tpl-container" id="ll-form-box">
                            <div class="tpl-block info-form" data-type-el="0"
                                 <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                <div class="form-tit"><?php echo $form_title; ?></div>
                                <div class="form-desc"><?php echo $form_description; ?></div>
                                <div class="tpl-block-controls">
                                    <a href="javascript:void(0);" class="t-btn-gray tpl-block-edit"><i></i></a>
                                </div>
                            </div>
                            <div class="fb-wrap-columns-form fb-wrap-three-columns clearfix"
                                 data-json='{"btnAlign":"0", "labelWidth":"16", "formBackground":"#fff", "formTextColor":"#333333", "fieldLength":"large", "labelFont":"Open Sans", "labelSize":"14", "labelColor":"#333333", "labelPos":"0", "fieldBackground":"#ffffff", "fieldBorderStyle":"Solid", "fieldBorderWidth":"1", "fieldBorderColor":"#c9c9c9", "fieldFont":"Open Sans", "fieldSize":"13", "fieldColor":"#333333", "dropdownBackground":"#f8f8f8", "dropdownBorderColor":"#c9c9c9", "dropdownFont":"Open Sans", "dropdownSize":"13", "dropdownColor":"#333333", "btnBackground":"#<?php echo $theme_color;?>", "btnHoverBackground": "#<?php echo $theme_hover_color;?>", "btnBorderStyle":"Solid", "btnBoderWidth":"1", "btnBorderColor":"#<?php echo $theme_border_color;?>", "btnFont":"Open Sans", "btnSize":"16", "btnColor":"#ffffff"}'>
                                <div class="wrap-tpl-block tpl-column-2">
                                    <div class="fb-dragenddrop-box-text">
                                        Drop Content Blocks Here
                                    </div>
                                </div>
                                <div class="tpl-column-2 wrap-tpl-block">
                                    <div class="fb-dragenddrop-box-text">
                                        Drop Content Blocks Here
                                    </div>
                                </div>
                                <div class="tpl-column-3 wrap-tpl-block">
                                    <div class="fb-dragenddrop-box-text">
                                        Drop Content Blocks Here
                                    </div>
                                </div>
                                <div id="wrap-form-submit-button" <?php if ($is_device_form){ ?>style="display:none !important;"<?php } ?>>
                                    <input type="submit"
                                           class="t-btn-orange form-submit-button form-submit-button-color"
                                           value="<?php echo $form_submit_button_text; ?>"/>
                                </div>
                                <div class="fb-dragenddrop-box">
                                    <svg width="110px" height="100px" viewBox="0 0 80 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                        <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                            <g id="Page-Content-elements" transform="translate(-406.000000, -97.000000)" fill="#FF982B" fill-rule="nonzero" class="svg-fill">
                                                <g id="Right-Side-2" transform="translate(7.000000, 49.000000)">
                                                    <g id="Image" transform="translate(20.000000, 20.055006)">
                                                        <path d="M453,44.0374036 L412.335111,44.0374036 L412.335111,32.4294135 C412.335111,29.8933953 411.722397,29.671496 409.353592,31.7278034 L381.537384,55.8744427 C381.354147,56.0335068 381.354266,56.118977 381.537384,56.2779384 L409.353592,80.4245777 C411.724523,82.4827309 412.335111,82.2620709 412.335111,79.7229676 L412.335111,68.1166118 L453,68.1166118 C453.883656,68.1166118 454.6,67.4002674 454.6,66.5166119 L454.6,45.6374035 C454.6,44.753748 453.883656,44.0374036 453,44.0374036 Z M414.73511,41.6374037 L453,41.6374037 C455.209139,41.6374037 457,43.4282646 457,45.6374035 L457,66.5166119 C457,68.7257508 455.209139,70.5166117 453,70.5166117 L414.73511,70.5166117 L414.73511,79.7229676 C414.73511,84.4457293 411.620631,85.5706726 407.780299,82.2369648 L379.964091,58.0903255 C378.682667,56.9779495 378.674612,55.1814239 379.964091,54.0620556 L407.780299,29.9154163 C411.621335,26.581097 414.73511,27.7135225 414.73511,32.4294135 L414.73511,41.6374037 Z" id="Rectangle-154" transform="translate(418.000000, 56.077008) scale(-1, 1) translate(-418.000000, -56.077008) "></path>
                                                    </g>
                                                </g>
                                            </g>
                                        </g>
                                    </svg>
                                    <div>Click the buttons on the right or Drag and</div>
                                    <div>Drop it to add fields to your form</div>
                                </div>
                            </div>
                        </div>
                        <?php
                    } ?>
                </div>
            </div>
        </div>

        <div class="tool-col">
            <div class="eb-inner-tool">
                <div class="tabs-editor">
                    <ul class="clearfix eb-three-tabs" id="fb-tabs-settings">
                        <li class="selected"><a href="javascript:void(0);"><i class="icn-add-field"></i>Fields</a></li>
                        <li><a href="javascript:void(0);"><i class="icn-form-properties"></i>Properties</a></li>
                        <li><a href="javascript:void(0);"><i class="icn-form-style"></i>Style</a></li>
                    </ul>
                    <div class="wrap-tabs-content">
                        <div class="tab-content">
                            <div class="eb-bloks-content clearfix">
                                <div class="eb-block-content el-name" data-field-type="name" data-element-name="Name">
                                    <div class="t">Name</div>
                                </div>
                                <div class="eb-block-content el-email" data-field-type="email" data-element-name="Email">
                                    <div class="t">Email</div>
                                </div>
                                <div class="eb-block-content el-company" data-field-type="text" data-field-sub-type="company">
                                    <div class="t">Company</div>
                                </div>
                                <div class="eb-block-content el-job-title" data-field-type="text" data-field-sub-type="job_title">
                                    <div class="t">Job Title</div>
                                </div>
                                <div class="eb-block-content el-phone" data-field-type="phone"
                                     data-element-name="Phone">
                                    <div class="t">Phone</div>
                                </div>
                                <div class="eb-block-content el-address" data-field-type="address"
                                     data-element-name="Address">
                                    <div class="t">Address</div>
                                </div>
                                <?php if($is_device_form){?>
                                    <?php //if(LL_GLOBAL_CONF_SERVER_IDENTIFIER != LL_GLOBAL_CONF_SERVER_PRODUCTION){?>
                                    <div class="eb-block-content el-barcode" data-field-type="barcode"
                                         data-element-name="Badge Scanner">
                                        <div class="t">Scanner</div>
                                    </div>
                                    <?php //}?>
                                    <div class="eb-block-content el-business-card" data-field-type="business_card"
                                         data-element-name="Business Card">
                                        <div class="t">Business Card</div>
                                    </div>
                                <?php }?>
                                <div class="eb-block-content el-single-line-text" data-field-type="text"
                                     data-element-name="Single Line Text">
                                    <div class="t">Single Line Text</div>
                                </div>
                                <div class="eb-block-content el-number" data-field-type="number"
                                     data-element-name="Number">
                                    <div class="t">Number</div>
                                </div>
                                <div class="eb-block-content el-text" data-field-type="paragraph"
                                     data-element-name="Paragraph Text">
                                    <div class="t">Paragraph Text</div>
                                </div>
                                <div class="eb-block-content el-checkboxes" data-field-type="checkboxes"
                                     data-element-name="Checkboxes">
                                    <div class="t">Checkboxes</div>
                                </div>
                                <div class="eb-block-content el-multiple" data-field-type="multiple_choices"
                                     data-element-name="Radio Buttons">
                                    <div class="t">Radio Buttons</div>
                                </div>
                                <div class="eb-block-content el-dropdown" data-field-type="drop_down"
                                     data-element-name="Drop Down">
                                    <div class="t">Drop Down</div>
                                </div>
                                <?php if (!$is_device_form || LL_GLOBAL_CONF_SERVER_IDENTIFIER != LL_GLOBAL_CONF_SERVER_PRODUCTION) { ?>
                                    <div class="eb-block-content el-boolean" data-field-type="boolean"
                                         data-element-name="Boolean">
                                        <div class="t">Boolean</div>
                                    </div>
                                <?php } ?>
                                <div class="eb-block-content el-date" data-field-type="date" data-element-name="Date">
                                    <div class="t">Date</div>
                                </div>
                                <div class="eb-block-content el-time" data-field-type="time" data-element-name="Time">
                                    <div class="t">Time</div>
                                </div>
                                <div class="eb-block-content el-datetime" data-field-type="datetime" data-element-name="Datetime">
                                    <div class="t">Datetime</div>
                                </div>
                                <div class="eb-block-content el-web-site" data-field-type="website"
                                     data-element-name="Web Site">
                                    <div class="t">Web Site</div>
                                </div>
                                <div class="eb-block-content el-price" data-field-type="price"
                                     data-element-name="Price">
                                    <div class="t">Price</div>
                                </div>
                                <div class="eb-block-content el-section-break" data-field-type="section_break"
                                     data-element-name="Custom Content">
                                    <div class="t">Custom Content</div>
                                </div>
                                <div class="eb-block-content el-credit-card" data-field-type="credit_card"
                                     data-element-name="Credit Card" style="display: none;">
                                    <div class="t">Credit Card</div>
                                </div>
                                <div class="eb-block-content el-recurring" data-field-type="recurring"
                                     data-element-name="Recurring" style="display: none;">
                                    <div class="t">Recurring</div>
                                </div>
                                <?php if ($form_template_id == form::HOSTED_WEB_FORM_TEMPLATE_ONE_COLUMN && !$is_device_form) { ?>
                                    <div class="eb-block-content el-page-break" data-field-type="page_break"
                                         data-element-name="Page Break">
                                        <div class="t">Page Break</div>
                                    </div>
                                <?php } ?>
                                <div class="eb-block-content el-documents" data-field-type="documents"
                                     data-element-name="Documents">
                                    <div class="t">Documents</div>
                                </div>
                                <?php if ($is_device_form) { ?>
                                    <div class="eb-block-content el-image" data-field-type="image"
                                         data-element-name="Image">
                                        <div class="t">Image Capture</div>
                                    </div>
                                    <div class="eb-block-content el-signature" data-field-type="signature"
                                         data-element-name="Signature">
                                        <div class="t">Signature</div>
                                    </div>
                                    <div class="eb-block-content el-audio" data-field-type="audio"
                                         data-element-name="Audio Recorder">
                                        <div class="t">Audio Recorder</div>
                                    </div>
                                    <div class="eb-block-content el-column-separator" data-field-type="column_separator"
                                         data-element-name="Column Separator">
                                        <div class="t">Column Separator</div>
                                    </div>
                                    <div class="eb-block-content el-section-block" data-field-type="section_block">
                                        <div class="t">Section</div>
                                    </div>
                                <?php if(ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$ACTIVATIONS ) ){ ?>
                                    <div class="eb-block-content el-activation" data-field-type="activation"
                                         data-element-name="Activation">
                                        <div class="t">Activation</div>
                                    </div>
                                <?php }  ?>
                                <?php } else { ?>
                                    <div class="eb-block-content el-upload-file" data-field-type="file_upload">
                                        <div class="t">File Upload</div>
                                    </div>
                                <?php }  ?>
                                <!-- <div class="eb-block-content el-calculated" data-field-type="calculated" data-element-name="Calculated">
                                        <div class="t">Calculated</div>
                                    </div>
                                    <div class="eb-block-content el-image" data-field-type="image" data-element-name="Image">
                                        <div class="t">Image</div>
                                    </div>
                                    <div class="eb-block-content el-signature" data-field-type="signature" data-element-name="Signature">
                                        <div class="t">Signature</div>
                                    </div>
                                    <div class="eb-block-content el-business-card" data-field-type="business_card" data-element-name="Business Card">
                                        <div class="t">Business Card</div>
                                    </div> -->
                            </div>
                        </div>

                        <div class="tab-content fb-form-properties">
                            <div id="fb-settings-0" class="fb-settings">
                                <div class="fb-field">
                                    <label><span class="fb-wrap-tooltip"><?php echo $form_lbl; ?>  Name <span
                                                    class="fb-tooltip">The name identifying your <?php echo strtolower($form_lbl); ?>.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="text" id="fb-form-name" name="form_name" class="txt-field"
                                                   value="<?php echo $form_name; ?>"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field fb-multiple-field"
                                     <?php if (!$is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label class="pr-lbl-icn-selected"> <?php echo $form_lbl; ?> Access
                                        <a href="javascript:void(0)" class="fb-btn-add t-btn-gray add_new_user" style="float: right;" title="Add"></a>
                                        <a href="javascript:void(0);" class="fb-reminder-icn ll_std_tooltip <?php if($notify_reminder_to_invites){ echo 'selected'; }?>" title="Reminder" style="float: right;">
                                            <svg width="18px" height="22px" viewBox="0 0 18 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                                <defs></defs>
                                                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                                    <g id="Sales-automatin" transform="translate(-597.000000, -666.000000)" fill-rule="nonzero" class="svg-fill" fill="#939393">
                                                        <g id="Group-12" transform="translate(560.000000, 661.000000)">
                                                            <g id="Group-33" transform="translate(0.000000, 5.000000)">
                                                                <g id="if_lamp_622407" transform="translate(37.849315, 0.000000)">
                                                                    <path d="M14.3417046,2.33753247 C12.7542029,0.830155844 10.6428264,0 8.39640911,0 C3.76054041,0 0,3.57980519 0,7.98003896 C0,10.8481818 1.5593603,13.4351818 4.14629477,14.854961 L4.14629477,19.6741429 C4.14629477,20.9505844 5.20254422,21.9881818 6.52793067,21.9881818 L10.2811757,21.9881818 C11.5985549,21.9881818 12.6872848,20.9505844 12.6872848,19.6741429 L12.6872848,14.8508442 C15.2605318,13.4306494 16.8112553,10.8451558 16.8112553,7.98003896 C16.8112553,5.84837662 15.9287547,3.84450649 14.3417046,2.33753247 Z M10.2811757,20.2609091 L6.52793067,20.2609091 C6.20545355,20.2609091 5.95304266,19.9987532 5.95304266,19.6741429 L5.95304266,18.2868831 L10.8805369,18.2868831 L10.8805369,19.6741429 C10.8805369,19.9987532 10.5958372,20.2609091 10.2811757,20.2609091 Z M11.3726977,13.5712208 C11.0654274,13.7162338 10.8805369,14.0138701 10.8805369,14.3394935 L10.8805369,16.5725844 L9.34753868,16.5725844 L9.34753868,11.0790779 L11.5399177,11.0790779 C12.039374,11.0790779 12.4442635,10.6958312 12.4442635,10.2219351 C12.4442635,9.74803896 12.039374,9.36479221 11.5399177,9.36479221 L5.29995805,9.36479221 C4.80050176,9.36479221 4.39562598,9.74803896 4.39562598,10.2219351 C4.39562598,10.6958312 4.80050176,11.0790779 5.29995805,11.0790779 L7.52710331,11.0790779 L7.52710331,16.5725844 L5.95304266,16.5725844 L5.95304266,14.3433506 C5.95304266,14.0175065 5.74857902,13.7198312 5.44102126,13.5748571 C3.19994213,12.5185455 1.8026827,10.3747403 1.8026827,7.98003896 C1.8026827,4.52609091 4.76038374,1.7161039 8.39894129,1.7161039 C12.0368966,1.7161039 15.0000453,4.52609091 15.0000453,7.98003896 C15.0000589,10.3718961 13.6122849,12.5143247 11.3726977,13.5712208 Z" id="remind"></path>
                                                                </g>
                                                            </g>
                                                        </g>
                                                    </g>
                                                </g>
                                            </svg>
                                        </a>
                                    </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select multiple name="device_forms_users">
                                                <option value=""></option>
                                                <?php
                                                foreach ($ll_users as $ll_user) {
                                                    $selected = '';
                                                    if (array_key_exists($ll_user->userID, $form_users) || array_key_exists($ll_user->userID, $form_invited_users)) {
                                                        $selected = 'selected="selected"';
                                                    }
                                                    ?>
                                                    <option value="<?php echo $ll_user->userID; ?>" <?php echo $selected; ?>><?php echo $ll_user->firstName . ' ' . $ll_user->lastName . (($ll_user->email) ? (' | ' . $ll_user->email) : ''); ?></option>
                                                    <?php
                                                }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field fb-reminder-info" <?php if (!$is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label> Reminder </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="text" class="txt-field txt-field-medium" name="reminder_to_invites_period" id="reminder_to_invites_period" value="<?php echo $reminder_to_invites_period; ?>"/>
                                            <select name="reminder_to_invites_period_type" class="txt-field-small">
                                                <option value="d" <?php echo $reminder_to_invites_period_type == 'd'? "selected='selected'" : ""?> >Days</option>
                                                <option value="w" <?php echo $reminder_to_invites_period_type == 'w'? "selected='selected'" : ""?> >Weeks</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field fb-reminder-info" <?php if (!$is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label> Message </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <textarea class="txt-field" name="reminder_to_invites_message" id="reminder_to_invites_message"><?php echo $reminder_to_invites_message; ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip"><?php echo $form_lbl; ?>  Title <span
                                                    class="fb-tooltip">The title of your <?php echo strtolower($form_lbl); ?> displayed to the user when they see your <?php echo strtolower($form_lbl); ?>.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="text" class="txt-field" name="form_title" id="fb-form-title"
                                                   value="<?php echo $form_title; ?>"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label><span class="fb-wrap-tooltip">Description <span class="fb-tooltip">The description of your <?php echo strtolower($form_lbl); ?> displayed to the user when they see your <?php echo strtolower($form_lbl); ?>.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <textarea class="txt-field" name="form_description"
                                                      id="fb-form-description"><?php echo $form_description; ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="plan_type"
                                     <?php if (!$form_payment_gateway_account->is_support_recurring || $form_type != form::PAYMENT_HOSTED_WEB_FORM_TYPE){ ?>style="display: none;"<?php } ?>>
                                    <label>Plan Type</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap fd-form-checkboxes">
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label><i class="icn-radio"></i><input type="radio"
                                                                                               name="plan_type"
                                                                                               value="0"
                                                                                               <?php if (!$form->plan_type){ ?>checked="checked"<?php } ?>>None</label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label><i class="icn-radio"></i><input type="radio"
                                                                                               name="plan_type"
                                                                                               value="<?php echo form::PAYMENT_PLANS_CUSTOM; ?>"
                                                                                               <?php if ($form->plan_type == form::PAYMENT_PLANS_CUSTOM){ ?>checked="checked"<?php } ?>>Custom</label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label><i class="icn-radio"></i><input type="radio"
                                                                                               name="plan_type"
                                                                                               value="<?php echo form::PAYMENT_PLANS_GATEWAY; ?>"
                                                                                               <?php if ($form->plan_type == form::PAYMENT_PLANS_GATEWAY){ ?>checked="checked"<?php } ?>>Gateway</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="gateway_payment_plans"
                                     <?php if ($form->plan_type != form::PAYMENT_PLANS_GATEWAY || !$form_payment_gateway_account->is_support_recurring || $form_type != form::PAYMENT_HOSTED_WEB_FORM_TYPE){ ?>style="display: none;"<?php } ?>>
                                    <label>Payment Plan</label>
                                    <div class="fb-right">
                                        <select>
                                            <option value="0">-- Select a Payment Plan --</option>
                                            <?php if (!empty($payment_gateways_imported_recurring_plans)) { ?>
                                                <?php foreach ($payment_gateways_imported_recurring_plans as $payment_gateways_imported_recurring_plan) { ?>
                                                    <?php
                                                    $selected = '';
                                                    if ($form->imported_plan_id == $payment_gateways_imported_recurring_plan->payment_gateway_recurring_plan_id) {
                                                        $selected = 'selected="selected"';
                                                    }
                                                    ?>
                                                    <option value="<?php echo $payment_gateways_imported_recurring_plan->payment_gateway_recurring_plan_id; ?>" <?php echo $selected; ?>><?php echo $payment_gateways_imported_recurring_plan->name; ?></option>
                                                <?php } ?>
                                            <?php } ?>
                                        </select>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="pmv"
                                     <?php if ($form->plan_type != form::PAYMENT_PLANS_GATEWAY){ ?>style="display: none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Plan Multiplier Value (PMV)<span
                                                    class="fb-tooltip">Your payment plan amount will be multiplied by the Plan Multiplier Value (PMV). For example, if your payment plan is $10, and your PMV is 2, the amount charged will be $20.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="number" min="1" step="1" class="txt-field" name="pmv"
                                                   value="<?php echo $form->pmv; ?>"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="amount"
                                     <?php if ($form_type != form::PAYMENT_HOSTED_WEB_FORM_TYPE || $form->plan_type == form::PAYMENT_PLANS_GATEWAY){ ?>style="display: none;"<?php } ?>>
                                    <label>Amount</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="number" class="txt-field" name="amount"
                                                   value="<?php echo $form->payment_form_amount; ?>"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="payment_recurring"
                                     <?php if ($form->plan_type != form::PAYMENT_PLANS_CUSTOM || !$form_payment_gateway_account->is_support_recurring || $form_type != form::PAYMENT_HOSTED_WEB_FORM_TYPE){ ?>style="display: none;"<?php } ?>>
                                    <label>Recurring Frequency</label>
                                    <div class="fb-right">
                                        <select>
                                            <option value="0" selected="selected">One Time Payment</option>
                                            <?php if (!empty($payment_gateways_recurring_plans)) {
                                                foreach ($payment_gateways_recurring_plans as $index => $payment_gateways_recurring_plan) {
                                                    $interval_name = payment_gateways_recurring_plans::get_plan_interval_name($payment_gateways_recurring_plan->payment_gateway_recurring_plan_interval);
                                                    $selected = '';
                                                    if ($form->payment_recurring_frequency == $payment_gateways_recurring_plan->payment_gateway_recurring_plan_id) {
                                                        $selected = 'selected="selected"';
                                                    }
                                                    ?>
                                                    <option value="<?php echo $payment_gateways_recurring_plan->payment_gateway_recurring_plan_id; ?>" <?php echo $selected; ?>><?php echo $interval_name; ?></option>
                                                    <?php
                                                }
                                            } ?>
                                        </select>
                                    </div>
                                </div>
                                <div class="fb-field" id="payment_recurring_title"
                                     <?php if ($form->plan_type != form::PAYMENT_PLANS_CUSTOM || !$form_payment_gateway_account->is_support_recurring || $form_type != form::PAYMENT_HOSTED_WEB_FORM_TYPE){ ?>style="display: none;"<?php } ?>>
                                    <label>Frequency Title</label>
                                    <div class="fb-right">
                                        <input type="text" class="txt-field" name="recurring_frequency_title"
                                               value="<?php echo $form->recurring_frequency_title ?>"/>
                                    </div>
                                </div>
                                <div class="fb-field" <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Layout Template <span class="fb-tooltip">The Layout Template associated with the <?php echo strtolower($form_lbl); ?>.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select id="layout_templates" data-placeholder="Select Template">
                                                <option value=""></option>
                                                <?php if (!empty($ll_layout_templates)) {
                                                    foreach ($ll_layout_templates as $ll_layout_template) {
                                                        $selected = '';
                                                        if ($ll_layout_template->ll_layout_template_id == $form_ll_layout_template_id) {
                                                            $selected = 'selected="selected"';
                                                        }
                                                        echo "<option value='" . $ll_layout_template->ll_layout_template_id . "' " . $selected . ">" . ValiedateInput($ll_layout_template->ll_layout_template_name) . "</option>";
                                                    }
                                                } ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field">
                                    <label><span class="fb-wrap-tooltip">Campaign <span class="fb-tooltip">The Lead Liaison Campaign associated with the <?php echo strtolower($form_lbl); ?>.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select id="campaigns" data-placeholder="Select Campaign">
                                                <option value="0">--- Select Campaign ---</option>
                                                <?php if (!empty($ll_abstract_campaigns)) {
                                                    foreach ($ll_abstract_campaigns as $ll_abstract_campaign) {
                                                        $selected = '';
                                                        if ($ll_abstract_campaign['ll_abstract_campaign_id'] == $form_ll_abstract_campaign_id) {
                                                            $selected = 'selected="selected"';
                                                        }
                                                        echo "<option value='" . $ll_abstract_campaign['ll_abstract_campaign_id'] . "' " . $selected . ">" . stripslashes(ValiedateInput($ll_abstract_campaign['abstract_campaign_name'])) . "</option>";
                                                    }
                                                } ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label>Vanity URL</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select data-placeholder="Select Vanity URL" id="web-form-vanity-url-id">
                                                <option value="">Select Vanity URL</option>
                                                <?php
                                                $all_customer_subdomains = customer_subdomains::get_customer_subdomains($customerID);
                                                foreach ($all_customer_subdomains as $customer_subdomain) {
                                                    $customer_subdomain_id = intval($customer_subdomain ['customer_subdomain_id']);
                                                    $sd = ($customer_subdomain['is_ssl'] ? 'https://' : 'http://') . $customer_subdomain ['subdomain'];
                                                    $selected = '';
                                                    if ($customer_subdomain ['customer_subdomain_id'] == $vanity_url_id)
                                                        $selected = " selected='selected' ";
                                                    echo "<option value='{$customer_subdomain_id}' {$selected}>{$sd}</option>";
                                                }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="form_event_date"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display:none;"<?php } ?>>
                                    <label>Event Date</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="text" class="txt-field event_date" name="event_from_date"
                                                   placeholder="Start date"
                                                   value="<?php echo($event_from_date == '0000-00-00' ? '' : $event_from_date); ?>">
                                            - <input type="text" class="txt-field event_date" name="event_to_date"
                                                     placeholder="End date"
                                                     value="<?php echo($event_from_date == '0000-00-00' ? '' : $event_to_date); ?>">
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="form_archive_date"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display:none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Archive Date <span class="fb-tooltip">Archive Date.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="text" class="txt-field" name="form_archive_date"
                                                   value="<?php echo $archive_date; ?>" readonly="readonly">
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="ll_lists"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display:none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">List <span
                                                    class="fb-tooltip">List.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select name="ll_lists" data-placeholder="Select a list">
                                                <option value="0">--- Select List ---</option>
                                                <?php
                                                if (!empty($ll_lists)) {
                                                    foreach ($ll_lists as $ll_list) {
                                                        $selected = '';
                                                        if ($ll_list['ll_list_id'] == $list_id) {
                                                            $selected = 'selected="selected"';
                                                        }
                                                        ?>
                                                        <option value="<?php echo $ll_list['ll_list_id']; ?>" <?php echo $selected; ?>><?php echo $ll_list['list_name']; ?></option>
                                                        <?php
                                                    }
                                                }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="event_owner"
                                     <?php if (!$is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label><?php echo $form_lbl; ?> Owner</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select name="event_owner" data-placeholder="Select user">
                                                <option value="">--- Select Owner ---</option>
                                                <?php if (!empty($ll_users)) { ?>
                                                    <?php foreach ($ll_users as $ll_user_ID => $ll_user) { ?>
                                                        <?php
                                                        $selected = '';
                                                        if ($event_owner == $ll_user_ID) {
                                                            $selected = 'selected="selected"';
                                                        }
                                                        ?>
                                                        <option value="<?php echo $ll_user_ID; ?>" <?php echo $selected; ?>><?php echo trim("{$ll_user->firstName} {$ll_user->lastName}"); ?></option>
                                                    <?php } ?>
                                                <?php } ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field" id="event_owner"
                                     <?php if (!$is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label>Labels</label>
                                    <select multiple name="labels" data-placeholder="Add labels">
                                        <option value=""></option>
                                        <?php if (!empty($labels)) { ?>
                                            <?php
                                            $existing_values = "";
                                            foreach ($labels as $label) {
                                                $selected = '';
                                                if (array_key_exists($label->ll_customer_label_id, $form_labels)) {
                                                    if ($existing_values) {
                                                        $existing_values .= ',';
                                                    }
                                                    $existing_values .= $label->label;
                                                    $selected = ' selected="selected"';
                                                }
                                                ?>
                                                <option<?php echo $selected; ?>><?php echo $label->label; ?></option>
                                            <?php } ?>
                                        <?php } ?>
                                    </select>
                                    <input type="hidden" name="selected_labels" value="<?php echo $existing_values; ?>"
                                           existing_values="<?php echo $existing_values; ?>"/>
                                </div>
                                <div class="fb-field" id="event_owner" <?php if (!$is_device_form || $is_event_template){ ?>style="display:none;"<?php } ?>>
                                    <label>Address
                                        <a href="javascript:void(0)" id="fb_switch_device_form_address_details" class="ll_std_tooltip" title="Edit"><img src="imgs/svg/icn-edit.svg"></a>
                                        <a href="javascript:void(0)" id="fb_clear_device_form_address_details" class="ll_std_tooltip" title="Clear"><img src="imgs/svg/icn-clear.svg"></a>

                                    </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="t-field">
                                                <input type="text" class="txt-field" name="device_form_address" id="fb-device-form-address" <?php if($form_address){ echo 'disabled'; } ?> value="<?php echo $form_address; ?>"/>
                                                <input type="text" class="txt-field device_form_address_details" placeholder="Street Address" id="fb-device_form_street_address" value="<?php echo $street_address; ?>" style="display: none;"/>
                                            </div>
                                            <div class="device_form_address_details" style="display: none;">
                                               <!-- <div class="t-field ll-fields-two-style">
                                                    <input type="text" class="txt-field" placeholder="Street Address" id="fb-device_form_street_address" value="<?php /*echo $street_address; */?>" />
                                                </div>-->
                                                <div class="t-field ll-fields-two-style">
                                                    <input type="text" class="txt-field choice_text" placeholder="City" id="fb-device_form_city" value="<?php echo $city; ?>" />
                                                    <input type="text" class="txt-field choice_text" placeholder="State Code" id="fb-device_form_state" value="<?php echo $state; ?>" />
                                                </div>
                                                <div class="t-field ll-fields-two-style">
                                                    <input type="text" class="txt-field choice_text" placeholder="Zip" id="fb-device_form_zip" value="<?php echo $zipcode; ?>" />
                                                    <select id="fb-device_form_country" class="choice_text" data-placeholder="Select Country">
                                                        <option value="">Select Country</option>
                                                        <?php
                                                        $ll_countries = array ();
                                                        $ll_countries = get_ll_countries ();
                                                        if(! empty($ll_countries)){
                                                            foreach ($ll_countries as $ll_country_code =>$ll_country_name){
                                                                $selected = strtoupper($ll_country_code) == strtoupper($country) ? 'selected' : '' ;
                                                                echo '<option value="'.strtoupper($ll_country_code).'" '.$selected.'>'.$ll_country_name.'</option>';
                                                            }
                                                        }
                                                        ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <?php if ($form_type == form::DONATION_HOSTED_WEB_FORM_TYPE || $form_type == form::PAYMENT_HOSTED_WEB_FORM_TYPE) { ?>
                                    <div class="fb-field">
                                        <label><span class="fb-wrap-tooltip">Payment Account <span class="fb-tooltip">Payment account used to receive payments.</span></span></label>
                                        <div class="fb-right">
                                            <div class="eb-inner-field">
                                                <select id="payment_accounts" data-placeholder="Select Payment Account">
                                                    <option value=""></option>
                                                    <?php if (!empty($ll_supported_payment_gateways)) {
                                                        foreach ($ll_supported_payment_gateways as $ll_supported_payment_gateway) {
                                                            $selected = '';
                                                            if ($ll_supported_payment_gateway->payment_gateway_account_id == $form_payment_gateway_account_id) {
                                                                $selected = 'selected="selected"';
                                                            }
                                                            echo "<option value='" . $ll_supported_payment_gateway->payment_gateway_account_id . "' " . $selected . ">" . ValiedateInput($ll_supported_payment_gateway->payment_gateway_account_name) . "</option>";
                                                        }
                                                    } ?>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                <?php } ?>
                                <div class="fb-field clearfix">
                                    <label></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap fd-form-checkboxes">
                                                <div class="t-field"
                                                     <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input id="check-use-captcha"
                                                                                                  type="checkbox"
                                                                                                  name="form_captcha"
                                                                                                  <?php if ($form_captcha){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Use CAPTCHA<span
                                                                        class="fb-tooltip">Uses Google reCAPTCHA. Enter your key into reCAPTCHA Connector.</span></span></label>
                                                    </div>
                                                </div>
                                                <div class="t-field"
                                                     <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                                  name="form_prefill_fields"
                                                                                                  <?php if ($form_prefill_fields){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Pre-Fill Fields<span
                                                                        class="fb-tooltip">Pre-fill <?php echo strtolower($form_lbl); ?> fields with lead info if it exists in a cookie on the visitors machine.</span></span></label>

                                                    </div>
                                                </div>
                                                <div class="t-field"
                                                     <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                                  name="form_ti_prefill_fields"
                                                                                                  <?php if ($form_ti_prefill_fields){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Pre-Fill with Lead Tracking<span
                                                                        class="fb-tooltip">Uses GeoIP tracking and business intelligence information to pre-fill city, state, phone, company and other information not collected from a CRM or the prospect.</span></span></label>

                                                    </div>
                                                </div>
                                                <div class="t-field"
                                                     <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                                  name="form_is_disable_cookies"
                                                                                                  <?php if ($form_is_disable_cookies){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Kiosk/Data Entry Mode<span
                                                                        class="fb-tooltip">Does not cookie browser as submitted prospect.</span></span></label>

                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-checkbox">
                                                        <label>
                                                            <i class="icn-checkbox"></i>
                                                            <input type="checkbox" name="is_donot_accept_personal_emails" <?php if ($is_donot_accept_personal_emails){ ?>checked="checked"<?php } ?>>
                                                            <span class="fb-wrap-tooltip">
                                                                No Personal Email Addresses
                                                                <span class="fb-tooltip">
                                                                    <?php if(! $is_device_form){?>
                                                                        Do not accept submissions from personal email addresses, Lead must use business email to submit.
                                                                    <?php } else {?>
                                                                        When a user submits the form using a personal email address the system will reject the submission. Transcription requests will not be rejected.
                                                                    <?php }?>
                                                                </span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field clearfix" id="personal_email_error_message" <?php if (!$is_donot_accept_personal_emails){ ?>style="display: none;"<?php } ?>>
                                        <label>
                                        <span class="fb-wrap-tooltip">
                                            Error Message
                                            <span class="fb-tooltip">
                                                <?php if(!$is_device_form){?>
                                                    This message will be displayed when visitors submit the web <?php echo strtolower($form_lbl); ?> using a personal email address.
												<?php } else {?>
                                                    This message will be displayed when a personal email address (@yahoo.com, @gmail.com, etc.) is used to submit the form.
												<?php }?>
                                            </span>
                                        </span>
                                        </label>
                                        <div class="fb-right">
                                            <div class="eb-inner-field">
                                            <textarea class="txt-field" id="fb-html-show-text"
                                                      name="personal_email_error_message"><?php echo $personal_email_error_message; ?></textarea>
                                            </div>
                                        </div>
                                    </div>
									<?php if(!$is_device_form){?>
                                        <div class="fb-field clearfix xyz">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap fd-form-checkboxes">
                                                        <div class="t-field"
															 <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            name="form_resubmit_wait_enable" type="checkbox"
																			<?php if ($form_is_resubmit_wait){ ?>checked="checked"<?php } ?>><span
                                                                            class="fb-wrap-tooltip">Disable Resubmission for<span
                                                                                class="fb-tooltip">Disable subsequent submissions for a period of time. Use 0 or leave this setting empty to disable this feature.</span></span></label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field" id="form_resubmit_wait"
															 <?php if ($is_device_form || !$form_is_resubmit_wait){ ?>style="display:none;"<?php } ?>>
                                                            <input type="text" class="txt-field" name="form_resubmit_wait_count"
                                                                   value="<?php echo $form_resubmit_wait_count; ?>"/>
                                                            <select id="form_resubmit_wait_period">
                                                                <option value="minute"
																		<?php if ($form_resubmit_wait_period == 'minute'){ ?>selected="selected"<?php } ?>>
                                                                    Minutes
                                                                </option>
                                                                <option value="hour"
																		<?php if ($form_resubmit_wait_period == 'hour'){ ?>selected="selected"<?php } ?>>
                                                                    Hours
                                                                </option>
                                                                <option value="day"
																		<?php if ($form_resubmit_wait_period == 'day'){ ?>selected="selected"<?php } ?>>
                                                                    Days
                                                                </option>
                                                            </select>
                                                        </div>
														<?php if ($form_type == form::DONATION_HOSTED_WEB_FORM_TYPE) { ?>
                                                            <div class="t-field" id="recurring_checkbox_div">
                                                                <div class="t-checkbox">
                                                                    <label><i class="icn-checkbox"></i><input
                                                                                name="is_recurring" type="checkbox"
																				<?php if ($is_recurring){ ?>checked="checked"<?php } ?>/><span
                                                                                class="fb-wrap-tooltip">Recurring<span
                                                                                    class="fb-tooltip">Gives the user the option to make their payment a recurring payment based on the frequency selected.</span></span></label>
                                                                </div>
                                                            </div>
														<?php } ?>
														<?php //if($customer_is_enable_email_validation){?>
                                                        <!-- <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input name="is_enable_email_validation" type="checkbox" <?php //if($is_enable_email_validation){?>checked="checked"<?php // }?>><span class="fb-wrap-tooltip">Enable Email Validation<!--<span class="fb-tooltip">Disable subsequent submissions for a period of time. Use 0 or leave this setting empty to disable this feature.</span>--></span></label>
                                                        <!--  </div>
                                                        </div>
                                                        <div class="t-field" id="email_validation_timeout_div" <?php //if(!$is_enable_email_validation){?>style="display:none;"<?php //}?>>
                                                            <label>Timeout</label><input type="text" class="txt-field" name="email_validation_timeout" value="<?php //echo $email_validation_timeout;?>"/>
                                                        </div> -->
														<?php //}?>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php } ?>
                                <div class="fb-field clearfix"
                                     style="<?php if (!$is_device_form || $is_event_template) { ?>display: none;<?php } ?>">
                                    <label>Instructions</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field field-color-transparent">
                                            <a href="javascript:void(0);" class="t-btn-gray ll_std_tooltip"
                                               id="instructions_content_popup"
                                               title='Display on initial open: Opens the instructions each time a user taps on a capture <?php echo strtolower($form_lbl); ?> for the first time. To see instructions after the initial tap, users can select "Instructions" from the <?php echo strtolower($form_lbl); ?> menu on the mobile device.'>Add
                                                Instructions</a>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display:none;"<?php } ?>>
                                    <label>Mode</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="t-field">
                                                <div class="t-radio">
                                                    <label><i class="icn-radio"></i><input name="device_form_mode"
                                                                                           value="normal" type="radio"
                                                                                           <?php if ($device_form_mode == "normal"){ ?>checked="checked"<?php } ?>>
                                                        <span class="fb-wrap-tooltip">Normal<span
                                                                    class="fb-tooltip fb-pull-right">Mobile user will need to tap on the form and select Capture from the menu for each new capture.</span></span></label>
                                                </div>
                                            </div>
                                            <div class="t-field">
                                                <div class="t-radio">
                                                    <label><i class="icn-radio"></i><input name="device_form_mode"
                                                                                           value="quick_capture"
                                                                                           type="radio"
                                                                                           <?php if ($device_form_mode == "quick_capture"){ ?>checked="checked"<?php } ?>>
                                                        <span class="fb-wrap-tooltip">Quick Capture<span
                                                                    class="fb-tooltip fb-pull-right">Mobile user will see the form after each successive submission. Different from Kiosk Mode, no password will be necessary to exit the form (capture screen).</span></span></label>
                                                </div>
                                            </div>
                                            <div class="t-field">
                                                <div class="t-radio">
                                                    <label><i class="icn-radio"></i><input name="device_form_mode"
                                                                                           value="kiosk" type="radio"
                                                                                           <?php if ($device_form_mode == "kiosk"){ ?>checked="checked"<?php } ?>>
                                                        <span class="fb-wrap-tooltip">Kiosk<span
                                                                    class="fb-tooltip fb-pull-right">Mobile user will see the form after each successive submission. A password will be required to exist the form (capture screen).</span></span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="element_rapid_scan" style="display: none;">
                                    <label class="ll_std_tooltip"
                                           title="Duplicate Management settings (such as Reject, Edit, etc.) will be ignored on the device when using Rapid Scan. All submissions will be accepted as new submissions.">Rapid
                                        Scan</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="ll-switch switch-small">
                                                <div class="switch ll_std_tooltip"
                                                     title="Duplicate Management settings (such as Reject, Edit, etc.) will be ignored on the device when using Rapid Scan. All submissions will be accepted as new submissions.">
                                                    <input id="is_enable_rapid_scan_mode"
                                                           name="is_enable_rapid_scan_mode"
                                                           class="cmn-toggle cmn-toggle-round" type="checkbox"
                                                           <?php if ($is_enable_rapid_scan_mode){ ?>checked="checked"<?php } ?>/>
                                                    <label for="is_enable_rapid_scan_mode"></label>
                                                </div>
                                                <div class="ll-switch-lb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="recurring_plans"
                                     <?php if ($form_type != form::DONATION_HOSTED_WEB_FORM_TYPE || !$is_recurring){ ?>style="display: none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Recurring Plans <span
                                                    class="fb-tooltip"></span></span></label>
                                    <div class="fb-right">
                                        <?php
                                        if (!empty($ll_supported_payment_gateways)) {
                                            foreach ($ll_supported_payment_gateways as $ll_supported_payment_gateway) {
                                                if ($ll_supported_payment_gateway->is_support_recurring && !empty($ll_supported_payment_gateway->recurring_plans)) {
                                                    ?>
                                                    <div class="accounts_selected_plans"
                                                         data-src-account-id="<?php echo $ll_supported_payment_gateway->payment_gateway_account_id; ?>"
                                                         <?php if ($form_payment_gateway_account_id != $ll_supported_payment_gateway->payment_gateway_account_id){ ?>style="display: none;"<?php } ?>>
                                                        <?php
                                                        foreach ($ll_supported_payment_gateway->recurring_plans as $recurring_plan) {
                                                            ?>
                                                            <div class="t-field">
                                                                <div class="t-checkbox">
                                                                    <label><i class="icn-checkbox"></i><input
                                                                                type="checkbox" class="recurring_plan"
                                                                                data-plan-id="<?php echo $recurring_plan->payment_gateway_recurring_plan_id; ?>"
                                                                                name="<?php echo payment_gateways_recurring_plans::get_plan_interval_name($recurring_plan->payment_gateway_recurring_plan_interval); ?>"
                                                                                <?php if ($payment_gateways_recurring_plans[$recurring_plan->payment_gateway_recurring_plan_id]->is_selected || (empty($payment_gateways_recurring_plans) && $recurring_plan->is_selected) || $form_payment_gateway_account_id != $ll_supported_payment_gateway->payment_gateway_account_id){ ?>checked="checked"<?php } ?>/><?php echo payment_gateways_recurring_plans::get_plan_interval_name($recurring_plan->payment_gateway_recurring_plan_interval); ?>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <?php
                                                        }
                                                        ?>
                                                    </div>
                                                    <?php
                                                }
                                            }
                                        }
                                        ?>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="duplicate_submission_error_message"
                                     <?php if ($is_device_form || !$form_is_resubmit_wait){ ?>style="display:none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Duplicate Submission Error Message <span
                                                    class="fb-tooltip">This message will be displayed if the user submits the same <?php echo strtolower($form_lbl); ?> again, within the Resubmission Period.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <textarea class="txt-field" id="fb-html-show-text"
                                                      name="duplicate_submission_error_message"><?php echo $duplicate_submission_error_message; ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix"
                                     <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Submit Button Text <span class="fb-tooltip">This text will be displayed on the <?php echo strtolower($form_lbl); ?> submit button.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <input type="text" id="fb-button-text-2" name="form_submit_button_text"
                                                   value="<?php echo $form_submit_button_text; ?>" class="txt-field"/>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix"
                                     <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                    <label>Success Message</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap fb-success-message">
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label><i class="icn-radio"></i><input name="success_message"
                                                                                               value="text"
                                                                                               id="fb-show-text"
                                                                                               type="radio"
                                                                                               <?php if (!$form_redirect){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Show Text<span
                                                                        class="fb-tooltip">This message will be displayed after your users have successfully submitted an entry.</span></span></label>
                                                        <span class="fb-html-icn"></span>
                                                    </div>
                                                    <div class="t-radio">
                                                        <label><i class="icn-radio"></i><input name="success_message"
                                                                                               value="url"
                                                                                               id="fb-redirect-url"
                                                                                               type="radio"
                                                                                               <?php if ($form_redirect){ ?>checked="checked"<?php } ?>>
                                                            <span class="fb-wrap-tooltip">Redirect URL<span
                                                                        class="fb-tooltip fb-pull-right">After your users have successfully submitted an entry, you can redirect them to another website/URL of your choice.</span></span></label>
                                                    </div>
                                                </div>
                                                <div class="t-field fb-show-text">
                                                    <textarea class="txt-field" id="form_success_message"
                                                              name="form_success_message"><?php echo $form_success_message; ?></textarea>
                                                </div>
                                                <div class="t-field fb-redirect-url">
                                                    <input class="txt-field" id="form_redirect" name="form_redirect"
                                                           value="<?php echo $form_redirect ?>"/>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                                  name="form_is_apply_success_at_parent"
                                                                                                  <?php if ($form_is_apply_success_at_parent){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Load in Parent Page<span
                                                                        class="fb-tooltip">When checked, Success Message/Redirect URL content will appear in the parent page of an embedded <?php echo strtolower($form_lbl); ?>. When unchecked, Success Message/Redirect URL will load within the embedded <?php echo strtolower($form_lbl); ?>. This feature applies to embedded forms only (iframed).</span></span></label>

                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input
                                                                    id="check-redirect-competitors"
                                                                    name="form_redirect_competitors_to_different_url"
                                                                    type="checkbox"
                                                                    <?php if ($form_redirect_competitors_to_different_url){ ?>checked="checked"<?php } ?>>Redirect
                                                            Domains to this URL</label>
                                                    </div>
                                                </div>
                                                <div class="t-field fb-box-redirect-competitors"
                                                     <?php if (!$form_redirect_competitors_to_different_url){ ?>style="display: none"<?php } ?>>
                                                    <div class="t-field form_competitors_redirect_field">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i><input
                                                                        name="donot_accept_submission" type="checkbox"
                                                                        <?php if ($donot_accept_submission){ ?>checked="checked"<?php } ?>/>Do
                                                                Not Accept Submission</label>
                                                        </div>
                                                    </div>
                                                    <div class="t-field form_competitors_redirect_field">
                                                        <input class="txt-field"
                                                               value="<?php echo $form_competitors_redirect; ?>"
                                                               id="form_competitors_redirect"
                                                               name="form_competitors_redirect"/>
                                                    </div>
                                                    <div class="t-field form_competitors_redirect_field">
                                                        <div class="fb-inner-field">
                                                            <label>Domain List</label>
                                                            <select id="domains" data-placeholder="Select Domain List">
                                                                <option value=""></option>
                                                                <?php if (!empty($ll_domain_lists)) {
                                                                    foreach ($ll_domain_lists as $ll_domain_list) {
                                                                        $selected = '';
                                                                        if ($ll_domain_list->ll_domain_list_id == $form_ll_domain_list_id) {
                                                                            $selected = 'selected="selected"';
                                                                        }
                                                                        echo "<option value='" . $ll_domain_list->ll_domain_list_id . "' " . $selected . ">" . ValiedateInput($ll_domain_list->list_name) . "</option>";
                                                                    }
                                                                } ?>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div class="t-field form_competitors_redirect_field">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i><input
                                                                        id="check-rus-competitors" type="checkbox"
                                                                        name="form_specific_competitors_domains"
                                                                        <?php if ($form_specific_competitors_domains){ ?>checked="checked"<?php } ?>>Redirect
                                                                these Email Domains</label>
                                                        </div>
                                                    </div>
                                                    <div class="fb-multiple-field fb-rus-competitors"
                                                         <?php if (empty($form_specific_competitors_domains)){ ?>style="display: none;"<?php } ?>>
                                                        <?php if (empty($form_specific_competitors_domains)) { ?>
                                                            <div class="t-field">
                                                                <a href="javascript:void(0);"
                                                                   class="fb-btn-add t-btn-gray add_competitor_domain"></a>
                                                                <a href="javascript:void(0);"
                                                                   class="fb-btn-remove t-btn-gray remove_competitor_domain"></a>
                                                                <input class="txt-field" type="text" name="competitor"/>
                                                            </div>
                                                        <?php } else { ?>
                                                            <?php foreach ($form_specific_competitors_domains as $form_specific_competitors_domain) { ?>
                                                                <div class="t-field">
                                                                    <a href="javascript:void(0);"
                                                                       class="fb-btn-add t-btn-gray add_competitor_domain"></a>
                                                                    <a href="javascript:void(0);"
                                                                       class="fb-btn-remove t-btn-gray remove_competitor_domain"></a>
                                                                    <input class="txt-field" type="text"
                                                                           name="competitor"
                                                                           value="<?php echo $form_specific_competitors_domain; ?>"/>
                                                                </div>
                                                            <?php } ?>
                                                        <?php } ?>
                                                    </div>
                                                    <div class="t-field form_competitors_redirect_field">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                                      name="form_specific_email_addresses"
                                                                                                      <?php if ($form_specific_email_addresses){ ?>checked="checked"<?php } ?>>Redirect
                                                                these Email Addresses</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="fb-multiple-field fb-box-redirect-competitors fb-rus-email-addresses"
                                                     <?php if (!$form_redirect_competitors_to_different_url || empty($form_specific_email_addresses)){ ?>style="display: none;"<?php } ?>>
                                                    <?php if (empty($form_specific_email_addresses)) { ?>
                                                        <div class="t-field">
                                                            <a href="javascript:void(0);"
                                                               class="fb-btn-add t-btn-gray add_specific_email_address"></a>
                                                            <a href="javascript:void(0);"
                                                               class="fb-btn-remove t-btn-gray remove_specific_email_address"></a>
                                                            <input class="txt-field" type="text"
                                                                   name="specific_email_address"/>
                                                        </div>
                                                    <?php } else { ?>
                                                        <?php foreach ($form_specific_email_addresses as $form_specific_email_address) { ?>
                                                            <div class="t-field">
                                                                <a href="javascript:void(0);"
                                                                   class="fb-btn-add t-btn-gray add_specific_email_address"></a>
                                                                <a href="javascript:void(0);"
                                                                   class="fb-btn-remove t-btn-gray remove_specific_email_address"></a>
                                                                <input class="txt-field" type="text"
                                                                       name="specific_email_address"
                                                                       value="<?php echo $form_specific_email_address; ?>"/>
                                                            </div>
                                                        <?php } ?>
                                                    <?php } ?>
                                                </div>
                                                <div class="t-field fb-field-to-insert">
                                                    <select id="fb-field-to-insert">
                                                        <option>Select Field to Insert</option>
                                                    </select>
                                                    <a href="javascript:void(0);" class="t-btn-gray"
                                                       id="fb_insert_fields">Insert Field</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix"
                                     <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Success Code <span class="fb-tooltip">Insert tracking code here. For example, if you're running a Google Pay Per Click (PPC) campaign and want to use Google's Tracking Code to track keyword effectiveness paste the JavaScript tracking code here. The tracking code will be embedded into the page the visitor is sent to after the <?php echo strtolower($form_lbl); ?> is successfully submitted.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <textarea class="txt-field"
                                                      name="form_success_js_code"><?php echo $form_success_js_code; ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix"
                                     <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                    <label><span class="fb-wrap-tooltip">Post Submission Java <br/>Script Code <span
                                                    class="fb-tooltip">Insert JavaScript code here to be called when the <?php echo strtolower($form_lbl); ?> is submitted. For example, you can set the 'll_custom_redirect_url' hidden field to change the redirect URL after submission.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <textarea class="txt-field"
                                                      name="form_pre_submit_code"><?php echo $form_pre_submit_code; ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix <?php if (!$is_device_form) { ?>last-field<?php } ?>"
                                     <?php if ($is_device_form){ ?>style="display: none;"<?php } ?> id="error_message_container">
                                    <label><span class="fb-wrap-tooltip">Error Message <span
                                                    class="fb-tooltip fb-pos-top">This message will be displayed after your users have unsuccessfully submitted an entry.</span></span></label>
                                    <div class="fb-right">
                                        <div class="fb-right">
                                            <textarea class="txt-field"
                                                      name="form_submit_error_message"><?php echo $form_error_message; ?></textarea>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="validate_fields_by_page_container" style="display: none;">
                                    <label>Check required fields by page</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="ll-switch switch-small">
                                                <div class="switch ll_std_tooltip">
                                                    <input id="is_validate_fields_by_page"
                                                           name="is_validate_fields_by_page"
                                                           class="cmn-toggle cmn-toggle-round" type="checkbox"
                                                           <?php if ($form->is_validate_fields_by_page){ ?>checked="checked"<?php } ?>/>
                                                    <label for="is_validate_fields_by_page"></label>
                                                </div>
                                                <div class="ll-switch-lb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix"
                                     style="<?php if (!$is_device_form || $is_event_template) { ?>display: none;<?php } ?>">
                                    <label>Prospect Owner</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap">
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="device_owner_option"
                                                                   value="<?php echo form::DEVICE_OWNER_OPTION_DEVICE_USER; ?>"
                                                                   type="radio"
                                                                   <?php if ($device_owner_option == form::DEVICE_OWNER_OPTION_DEVICE_USER){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Device User
                                                                    <span class="fb-tooltip">
                                                                        Assigns the record to the user associated with the device. If no user is associated with the device, no owner will be assigned.
                                                                    </span>
                                                                </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="device_owner_option"
                                                                   value="<?php echo form::DEVICE_OWNER_OPTION_SPECIFIC_USER; ?>"
                                                                   type="radio"
                                                                   <?php if ($device_owner_option == form::DEVICE_OWNER_OPTION_SPECIFIC_USER){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Specific User
                                                                    <span class="fb-tooltip">
                                                                        Assigns the record to a specified user.
                                                                    </span>
                                                                </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field" id="device_owner_option_specific_user_container"
                                                     <?php if ($device_owner_option != form::DEVICE_OWNER_OPTION_SPECIFIC_USER){ ?>style="display: none;"<?php } ?>>
                                                    <label></label>
                                                    <select name="device_owner_option_specific_user"
                                                            data-placeholder="Select User">
                                                        <option value=""></option>
                                                        <?php if (!empty($ll_users)) { ?>
                                                            <?php foreach ($ll_users as $ll_user_ID => $ll_user) { ?>
                                                                <?php
                                                                $selected = '';
                                                                if ($device_owner_option_specific_userID == $ll_user_ID) {
                                                                    $selected = 'selected="selected"';
                                                                }
                                                                ?>
                                                                <option value="<?php echo $ll_user_ID; ?>" <?php echo $selected; ?>><?php echo trim("{$ll_user->firstName} {$ll_user->lastName}"); ?></option>
                                                            <?php } ?>
                                                        <?php } ?>
                                                    </select>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="device_owner_option"
                                                                   value="<?php echo form::DEVICE_OWNER_OPTION_DEFAULT_OWNER; ?>"
                                                                   type="radio"
                                                                   <?php if ($device_owner_option == form::DEVICE_OWNER_OPTION_DEFAULT_OWNER){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Default Owner
                                                                    <span class="fb-tooltip">
                                                                        Assigns the record to a user according to the default distribution settings in the application.
                                                                    </span>
                                                                </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="device_owner_option"
                                                                   value="<?php echo form::DEVICE_OWNER_OPTION_LEAVE_UNASSIGNED; ?>"
                                                                   type="radio"
                                                                   <?php if ($device_owner_option == form::DEVICE_OWNER_OPTION_LEAVE_UNASSIGNED){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Leave Unassigned
                                                                    <span class="fb-tooltip">
                                                                        Don't assign the record to a user.
                                                                    </span>
                                                                </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field" style="margin-top: 30px;">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i>
                                                            <input type="checkbox"
                                                                   name="assign_owner_even_if_prospect_exists"
                                                                   <?php if ($assign_owner_even_if_prospect_exists){ ?>checked="checked"<?php } ?> />
                                                            Override existing Prospect Owner
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix" id="event_localization" <?php if(!$is_device_form || !$customer_general_settings['localization_mode']) { echo 'style="display: none; "'; }?>>
                                    <label>Localization</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="ll-switch switch-small">
                                                <div class="switch ll_std_tooltip">
                                                    <input id="is_localized"
                                                           name="is_localized"
                                                           class="cmn-toggle cmn-toggle-round" type="checkbox"
                                                           <?php if ($is_localized){ ?>checked="checked"<?php } ?>/>
                                                    <label for="is_localized"></label>
                                                </div>
                                                <div class="ll-switch-lb"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-design-head"
                                     <?php if (!$is_device_form || empty($attributes)){ ?>style="display: none;"<?php } ?>>
                                    Event Attributes
                                </div>
                                <div class="fb-field clearfix"  <?php if(!$is_device_form || empty($attributes)) { echo 'style="display: none; "'; }?>>
<!--                                    <label></label>-->
                                    <div>
                                        <div  id="custom_attributes_container">

                                        </div>
                                    </div>
                                </div>
                                <div class="fb-design-head"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display: none;"<?php } ?>>
                                    Web View
                                </div>
                                <div class="fb-field clearfix"
                                     style="<?php if (!$is_device_form || $is_event_template) { ?>display: none;<?php } ?>">
                                    <label>Success Action</label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap">
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="webview_success_action_type"
                                                                   value="start_over"
                                                                   type="radio"
                                                                   <?php if ($form->webview_success_action_type == 'start_over'){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Start over
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="webview_success_action_type"
                                                                   value="message"
                                                                   type="radio"
                                                                   <?php if ($form->webview_success_action_type == 'message'){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Thank you message
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <textarea id="webview-success-message" name="webview_success_message"
                                                            class="txt-field"><?php echo $form->webview_success_message; ?></textarea>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i>
                                                            <input name="webview_success_action_type"
                                                                   value="redirect"
                                                                   type="radio"
                                                                   <?php if ($form->webview_success_action_type == 'redirect'){ ?>checked="checked"<?php } ?>/>
                                                            <span class="fb-wrap-tooltip">
                                                                    Redirect
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field webview_success_redirect">
                                                    <select class="eb-w160" id="button_link_to">
                                                        <option value="url">Web Address</option>
                                                        <?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$LANDING_PAGES )) {?>
                                                            <option value="lp">Landing Page</option>
                                                        <?php }?>
                                                    </select>
                                                </div>
                                                <?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$LANDING_PAGES )) {?>
                                                    <div class="t-field" id="container_button_lp" style="display: none">
                                                        <select class="eb-w160" data-placeholder="Select Landing Page" id="select_button_landing_page">
                                                            <option></option>
                                                        </select>
                                                    </div>
                                                <?php }?>
                                                <!--<div class="t-field webview_success_redirect">
                                                    <label id="label_btn_link_to">Web Address (URL)</label>
                                                </div>-->
                                                <div class="t-field webview_success_redirect">
                                                    <input id="buttonUrl" name="webview_success_redirect_url"
                                                           value="<?php echo $form->webview_success_redirect_url; ?>" type="text" class="txt-field" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-design-head"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display: none;"<?php } ?>>
                                    Duplicate Management
                                </div>
                                <div class="fb-field clearfix"
                                     <?php if (!$is_device_form || $is_event_template){ ?>style="display: none;"<?php } ?>>
                                    <label class="ll_std_tooltip">
                                        Unique Identifier
                                    </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap">
                                                <div class="t-field" id="unique_id_barcode_div">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input
                                                                    type="checkbox" name="unique_id_barcode"
                                                                    <?php if ($unique_id_barcode == 1){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Barcode ID</span></label>

                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input
                                                                    type="checkbox" name="unique_id_email"
                                                                    <?php if ($unique_id_email == 1){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Email</span></label>

                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i><input
                                                                    type="checkbox" name="unique_id_name"
                                                                    <?php if ($unique_id_name == 1){ ?>checked="checked"<?php } ?>><span
                                                                    class="fb-wrap-tooltip">Name</span></label>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix"
                                     style="<?php if (!$is_device_form || $is_event_template) { ?>display: none;<?php } ?>">
                                    <label><span class="fb-wrap-tooltip">Unique Identifier Action<span class="fb-tooltip">Action the device should take when a duplicate record is submitted.</span></span></label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap">
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i><input
                                                                    name="is_reject_duplicate_submissions" value="0"
                                                                    type="radio"
                                                                    <?php if ($form->is_reject_duplicate_submissions == 0){ ?>checked="checked"<?php } ?>>
                                                                        <span class="fb-wrap-tooltip">Accept<span class="fb-tooltip">Accept - the system will create a duplicate submission for the same Prospect. This could result in a different number of total submissions vs total unique Prospects.</span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i><input
                                                                    name="is_reject_duplicate_submissions" value="1"
                                                                    type="radio"
                                                                    <?php if ($form->is_reject_duplicate_submissions == 1){ ?>checked="checked"<?php } ?>>
                                                                        <span class="fb-wrap-tooltip"> Reject <span class="fb-tooltip">Reject - the system will reject the duplicate, leaving the submission Blocked on the user's device.</span></span>
                                                        </label>
                                                    </div>
                                                    <div class="t-checkbox" id = "show_reject_prompt_div" <?php if ($form->is_reject_duplicate_submissions != 1){ ?>style="display:none;"<?php } ?>>
                                                        <label><i class="icn-checkbox"></i>
                                                            <input type="checkbox"
                                                                   name="show_reject_prompt"
                                                                   <?php if ($form->show_reject_prompt){ ?>checked="checked"<?php } ?> />
                                                            <span class="fb-wrap-tooltip"> Show Prompt <span class="fb-tooltip">A prompt will be shown when the user taps Submit if an existing submission with the same email address for the same event is on the local device. A prompt will not be shown if there are submissions that have not been synced to the device. For example, if the user does not have permission to see other user's submissions. In both instances, the duplicate records will be rejected and show on the device as Blocked. </span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label>
                                                            <i class="icn-radio"></i><input
                                                                    name="is_reject_duplicate_submissions" value="2"
                                                                    type="radio"
                                                                    <?php if ($form->is_reject_duplicate_submissions == 2){ ?>checked="checked"<?php } ?>>
                                                            <span class="fb-wrap-tooltip"> Edit <span class="fb-tooltip">Edit - the app will open the previous submission and give the user the option to edit.</span></span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <div class="t-field">
                                                    <div class="t-radio">
                                                        <label class="ll_std_tooltip"
                                                               title="Specify the action to take when merging duplicate submission records together. Merge settings are on the submission record at the field-level. Any changes to the submission record will update the Prospect record based on field mappings. Merge options are to override values if they exist or to update values only if they are empty.">
                                                            <i class="icn-radio"></i><input
                                                                    name="is_reject_duplicate_submissions" value="3"
                                                                    type="radio"
                                                                    <?php if ($form->is_reject_duplicate_submissions == 3){ ?>checked="checked"<?php } ?>>
                                                            <span class="fb-wrap-tooltip"> Merge <span class="fb-tooltip">Merge - the system will merge duplicate submissions with the first submission. Click settings to determine field-level settings (overwrite, ignore, update if empty.)</span></span>
                                                        </label>
                                                    </div>
                                                    (<a href="javascript:void(0);" id="merge_settings">Settings</a>)
                                                </div>
                                                <?php if(ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$ACTIVATIONS )){ ?>
                                                <div class="t-field" style="margin-top: 30px;">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i>
                                                            <input type="checkbox"
                                                                   name="ignore_submission_from_activation" <?php if ($ignore_submissions_from_activations == 1){ ?>checked="checked"<?php } ?>"/>
                                                            <span
                                                                class="fb-wrap-tooltip">Ignore submissions from activations
                                                                <span class="fb-tooltip">When this option is turned on duplicate submissions captured with your Activation will be ignored.<br><br>
                                                                If a lead was already captured with your Activation and a new submission is captured using any other method besides Activation then the duplicate action will be to accept the lead.<br><br>
                                                                If a new lead is captured via your Activation and another submission was already captured using your Activation, and your duplicate action is "Reject", "Edit" or "Merge", then the system will "Merge" the record. However, if the duplicate action is "Accept" then the duplicate submission will be accepted.
                                                                </span>
                                                            </span>
                                                        </label>
                                                    </div>
                                                </div>
                                                <?php } ?>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="fb-field clearfix"
                                     <?php if (!$is_device_form){ ?>style="display: none;"<?php } ?>>
                                    <label class="ll_std_tooltip" title="Duplicate submissions from the same IP address will be denied. IP address is used as the unique identifier.">
                                        IP Security
                                    </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <div class="fb-checkboxes-wrap">
                                                <div class="t-field">
                                                    <div class="t-checkbox">
                                                        <label><i class="icn-checkbox"></i>
                                                            <input type="checkbox" name="is_block_submissions_from_duplicate_ip"
                                                                    <?php if ($form->is_block_submissions_from_duplicate_ip == 1){ ?>checked="checked"<?php } ?>>
                                                            <span class="ll_std_tooltip">Block submissions from duplicate IP addresses</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="fb-field fb-multiple-field"  style="padding-bottom: 120px;
                                     <?php if (!$is_device_form){ ?> display:none;<?php } ?>">
                                    <label class="pr-lbl-icn-selected ll_std_tooltip" title="Submissions from all sources except for transcriptions will be denied if the lead is not already on the pre-approval list(s). Email address is used as the unique identifier. ">
                                        Pre-approval List(s)
                                    </label>
                                    <div class="fb-right">
                                        <div class="eb-inner-field">
                                            <select multiple name="approved_submissions_lists">
                                                <option value=""></option>
                                                <?php
                                                if (!empty($ll_lists)) {
                                                    foreach ($ll_lists as $ll_list) {
                                                        $selected = '';
                                                        if (in_array($ll_list['ll_list_id'], $form->approved_submissions_lists)) {
                                                            $selected = 'selected="selected"';
                                                        }
                                                        ?>
                                                        <option value="<?php echo $ll_list['ll_list_id']; ?>" <?php echo $selected; ?>><?php echo $ll_list['list_name']; ?></option>
                                                        <?php
                                                    }
                                                }
                                                ?>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            </div>
                        </div>

                        <div class="tab-content fb-form-style" id="fb-form-style-global">
                            <?php if (!$is_device_form){ ?>
                                <div class="fb-design-head">Designer</div>
                                <div class="fb-field clearfix">
                                    <label title="Changes the color of the background (canvas) only in the <?php echo strtolower($form_lbl); ?> designer/builder. This setting will not apply to your published <?php echo strtolower($form_lbl); ?>."
                                           class="ll_std_tooltip">Canvas Color</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field field-color-transparent">
                                            <div class="wrap-color">
                                                <div id="fb-form-designer-canvas-color-global"
                                                     style="background-color: #ffffff;" class="color-box"
                                                     data-color-start="ffffff"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-design-head"><?php echo $form_lbl; ?> Style</div>
                                <div class="fb-field clearfix">
                                    <label>Background</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field field-color-transparent">
                                            <div class="wrap-color">
                                                <div id="fb-form-background-global" style="background-color: #ffffff;"
                                                     class="color-box" data-color-start="ffffff"></div>
                                            </div>
                                            <div class="t-checkbox check-bg-transparent">
                                                <label><i class="icn-checkbox"></i><input
                                                            id="fb-form-background-transparent-global"
                                                            type="checkbox"><span
                                                            class="fb-wrap-tooltip">Transparent</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>Text Color</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-form-text-color-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>No Left Padding</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="t-checkbox inline form-centered">
                                                <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                          name="left_align_form"><span
                                                            class="fb-wrap-tooltip"></span></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>No Top/Bottom Padding</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="t-checkbox inline form-centered">
                                                <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                          name="top_align_form"><span
                                                            class="fb-wrap-tooltip"></span></label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix ll_std_tooltip"
                                     title="By default, the <?php echo strtolower($form_lbl); ?> fields and buttons are responsive when the surrounding container (i.e. iframe) becomes less than 767px. This is by design for better call to action support on mobile phones and tablets. Turning this setting on will turn off mobile responsiveness on the <?php echo strtolower($form_lbl); ?> fields and buttons and keep them the same size as what's in the designer, across all screen sizes.">
                                    <label>Disable Responsiveness</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="t-checkbox inline form-centered">
                                                <label><i class="icn-checkbox"></i><input type="checkbox"
                                                                                          name="use_fixed_button_width">
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-design-head">Label Style</div>
                                <div class="fb-field clearfix">
                                    <label>Font</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label>Typeface</label>
                                            <select class="fb-w130 cf-select-font-name" id="fb-label-font-global">
                                                <option standard_font='1' value="Open Sans">None</option>
                                                <option standard_font='1' value="Arial">Arial</option>
                                                <option standard_font='1' value="Comic Sans MS">Comic Sans MS</option>
                                                <option standard_font='1' value="Courier New">Courier New</option>
                                                <option standard_font='1' value="Georgia">Georgia</option>
                                                <option standard_font='1' value="Lucida Sans Unicode">Lucida</option>
                                                <option standard_font='1' value="Tahoma">Tahoma</option>
                                                <option standard_font='1' value="Times New Roman">Times New Roman
                                                </option>
                                                <option standard_font='1' value="Trebuchet MS">Trebuchet MS</option>
                                                <option standard_font='1' value="Verdana">Verdana</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <label>Size</label>
                                            <select class="fb-w70" id="fb-label-size-global">
                                                <option value="9">9px</option>
                                                <option value="10">10px</option>
                                                <option value="11">11px</option>
                                                <option value="12">12px</option>
                                                <option value="13">13px</option>
                                                <option value="14" selected>14px</option>
                                                <option value="16">16px</option>
                                                <option value="18">18px</option>
                                                <option value="20">20px</option>
                                                <option value="22">22px</option>
                                                <option value="24">24px</option>
                                                <option value="26">26px</option>
                                                <option value="28">28px</option>
                                                <option value="30">30px</option>
                                                <option value="36">36px</option>
                                                <option value="48">48px</option>
                                                <option value="64">64px</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-label-color-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>Position</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <select class="fb-w160" id="fb-label-pos-global">
                                                <option value="0">Top</option>
                                                <option value="1">Side</option>
                                                <option value="2">Inside</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field fb-field-label-width-global">
                                            <label>Padding</label>
                                            <input id="fb-field-label-width-global" type="text" class="txt_field"
                                                   value="16"/>
                                            <span class="fb-per-label-width">%</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="fb-design-head">Custom Fonts</div>
                                <div class="fb-field clearfix">
                                    <div class="wrap-line-criteries custom-fonts-container-line-criteria"
                                         id="container_custom_font_references" line-identifier='font_references'>
                                    </div>
                                </div>
                                <div class="eb-design-head no-border"></div>
                                <div class="fb-field clearfix">
                                    <div class="wrap-line-criteries custom-fonts-container-line-criteria"
                                         id="container_custom_font_names" line-identifier='font_names'>
                                    </div>
                                </div>

                                <div class="fb-design-head">Custom CSS</div>
                                <div class="fb-field clearfix">
                                    <div class="wrap-line-criteries custom-css-container-line-criteria">
                                    </div>
                                </div>

                                <div class="fb-design-head">Field Style</div>
                                <div class="fb-field clearfix">
                                    <label>Background</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-field-background-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label class="ll_std_tooltip"
                                           title="Small sets the field width to 25% of the <?php echo strtolower($form_lbl); ?> container (excludes external padding). Medium is 50%. Large is 100%.">Field
                                        Size</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <select id="fb-field-length-global">
                                                <option value="small">Small</option>
                                                <option selected value="medium">Medium</option>
                                                <option value="large">Large</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field">
                                    <label>Border</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label>Type</label>
                                            <select class="fb-w160" id="fb-field-border-type-global">
                                                <option value="">None</option>
                                                <option value="Solid">Solid</option>
                                                <option value="Dashed">Dashed</option>
                                                <option value="Dotted">Dotted</option>
                                                <option value="Double">Double</option>
                                                <option value="Groove">Groove</option>
                                                <option value="Ridge">Ridge</option>
                                                <option value="Inset">Inset</option>
                                                <option value="Outset">Outset</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <input id="fb-field-border-width-global" type="text"
                                                   class="txt_field touch-spin fb-field-small" value="0"/>
                                        </div>
                                        <div class="fb-inner-field">
                                            <label class="eb-text-center">Color</label>
                                            <div class="wrap-color">
                                                <div id="fb-field-border-color-global"
                                                     style="background-color: #ffffff;" class="color-box"
                                                     data-color-start="ffffff"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field">
                                    <label>Border Radius</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="input-group bootstrap-touchspin">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-default bootstrap-touchspin-down"
                                                            type="button">-</button>
                                                </span>
                                                <span class="input-group-addon bootstrap-touchspin-prefix"
                                                      style="display: none;"></span>
                                                <input type="text" name="global_field_border_radius"
                                                       class="txt_field touch-spin fb-field-small form-control"
                                                       value="4" style="display: block;">
                                                <span class="input-group-addon bootstrap-touchspin-postfix"
                                                      style="display: none;"></span>
                                                <span class="input-group-btn"><button
                                                            class="btn btn-default bootstrap-touchspin-up"
                                                            type="button">+</button></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>Font</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label>Typeface</label>
                                            <select class="fb-w130 cf-select-font-name" id="fb-field-font-global">
                                                <option standard_font='1' value="Open Sans">None</option>
                                                <option standard_font='1' value="Arial">Arial</option>
                                                <option standard_font='1' value="Comic Sans MS">Comic Sans MS</option>
                                                <option standard_font='1' value="Courier New">Courier New</option>
                                                <option standard_font='1' value="Georgia">Georgia</option>
                                                <option standard_font='1' value="Lucida Sans Unicode">Lucida</option>
                                                <option standard_font='1' value="Tahoma">Tahoma</option>
                                                <option standard_font='1' value="Times New Roman">Times New Roman
                                                </option>
                                                <option standard_font='1' value="Trebuchet MS">Trebuchet MS</option>
                                                <option standard_font='1' value="Verdana">Verdana</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <label>Size</label>
                                            <select class="fb-w70" id="fb-field-size-global">
                                                <option value="9">9px</option>
                                                <option value="10">10px</option>
                                                <option value="11">11px</option>
                                                <option value="12">12px</option>
                                                <option value="13">13px</option>
                                                <option value="14" selected>14px</option>
                                                <option value="16">16px</option>
                                                <option value="18">18px</option>
                                                <option value="20">20px</option>
                                                <option value="22">22px</option>
                                                <option value="24">24px</option>
                                                <option value="26">26px</option>
                                                <option value="28">28px</option>
                                                <option value="30">30px</option>
                                                <option value="36">36px</option>
                                                <option value="48">48px</option>
                                                <option value="64">64px</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-field-color-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-design-head">Drop Down Style</div>
                                <div class="fb-field clearfix">
                                    <label>Background</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-dropdown-background-global"
                                                     style="background-color: #333333;" class="color-box"
                                                     data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field">
                                    <label>Border Color</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label class="eb-text-center">Color</label>
                                            <div class="wrap-color">
                                                <div id="fb-dropdown-border-color-global"
                                                     style="background-color: #ffffff;" class="color-box"
                                                     data-color-start="ffffff"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field">
                                    <label>Border Radius</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <div class="input-group bootstrap-touchspin">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-default bootstrap-touchspin-down"
                                                            type="button">-</button>
                                                </span>
                                                <span class="input-group-addon bootstrap-touchspin-prefix"
                                                      style="display: none;"></span>
                                                <input type="text" name="global_dropdown_border_radius"
                                                       class="txt_field touch-spin fb-field-small form-control"
                                                       value="4" style="display: block;">
                                                <span class="input-group-addon bootstrap-touchspin-postfix"
                                                      style="display: none;"></span>
                                                <span class="input-group-btn"><button
                                                            class="btn btn-default bootstrap-touchspin-up"
                                                            type="button">+</button></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>Font</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label>Typeface</label>
                                            <select class="fb-w130 cf-select-font-name" id="fb-dropdown-font-global">
                                                <option standard_font='1' value="Open Sans">None</option>
                                                <option standard_font='1' value="Arial">Arial</option>
                                                <option standard_font='1' value="Comic Sans MS">Comic Sans MS</option>
                                                <option standard_font='1' value="Courier New">Courier New</option>
                                                <option standard_font='1' value="Georgia">Georgia</option>
                                                <option standard_font='1' value="Lucida Sans Unicode">Lucida</option>
                                                <option standard_font='1' value="Tahoma">Tahoma</option>
                                                <option standard_font='1' value="Times New Roman">Times New Roman
                                                </option>
                                                <option standard_font='1' value="Trebuchet MS">Trebuchet MS</option>
                                                <option standard_font='1' value="Verdana">Verdana</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <label>Size</label>
                                            <select class="fb-w70" id="fb-dropdown-size-global">
                                                <option value="9">9px</option>
                                                <option value="10">10px</option>
                                                <option value="11">11px</option>
                                                <option value="12">12px</option>
                                                <option value="13">13px</option>
                                                <option value="14" selected>14px</option>
                                                <option value="16">16px</option>
                                                <option value="18">18px</option>
                                                <option value="20">20px</option>
                                                <option value="22">22px</option>
                                                <option value="24">24px</option>
                                                <option value="26">26px</option>
                                                <option value="28">28px</option>
                                                <option value="30">30px</option>
                                                <option value="36">36px</option>
                                                <option value="48">48px</option>
                                                <option value="64">64px</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-dropdown-color-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="fb-global-style-title-description" class="fb-design-head">Title/Description
                                    Style
                                </div>
                                <div class="fb-field clearfix">
                                    <label>Title</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label>Typeface</label>
                                            <select class="fb-w130 cf-select-font-name" id="fb-title-font-global">
                                                <option standard_font='1' value="Open Sans">None</option>
                                                <option standard_font='1' value="Arial">Arial</option>
                                                <option standard_font='1' value="Comic Sans MS">Comic Sans MS</option>
                                                <option standard_font='1' value="Courier New">Courier New</option>
                                                <option standard_font='1' value="Georgia">Georgia</option>
                                                <option standard_font='1' value="Lucida Sans Unicode">Lucida</option>
                                                <option standard_font='1' value="Tahoma">Tahoma</option>
                                                <option standard_font='1' value="Times New Roman">Times New Roman
                                                </option>
                                                <option standard_font='1' value="Trebuchet MS">Trebuchet MS</option>
                                                <option standard_font='1' value="Verdana">Verdana</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <label>Size</label>
                                            <select class="fb-w70" id="fb-title-size-global">
                                                <option value="9">9px</option>
                                                <option value="10">10px</option>
                                                <option value="11">11px</option>
                                                <option value="12">12px</option>
                                                <option value="13">13px</option>
                                                <option value="14">14px</option>
                                                <option value="16">16px</option>
                                                <option value="18">18px</option>
                                                <option value="20">20px</option>
                                                <option value="22">22px</option>
                                                <option value="24">24px</option>
                                                <option value="26">26px</option>
                                                <option value="28">28px</option>
                                                <option value="30" selected>30px</option>
                                                <option value="36">36px</option>
                                                <option value="48">48px</option>
                                                <option value="64">64px</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-title-color-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="fb-field clearfix">
                                    <label>Description</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <label>Typeface</label>
                                            <select class="fb-w130 cf-select-font-name" id="fb-description-font-global">
                                                <option standard_font='1' value="Open Sans">None</option>
                                                <option standard_font='1' value="Arial">Arial</option>
                                                <option standard_font='1' value="Comic Sans MS">Comic Sans MS</option>
                                                <option standard_font='1' value="Courier New">Courier New</option>
                                                <option standard_font='1' value="Georgia">Georgia</option>
                                                <option standard_font='1' value="Lucida Sans Unicode">Lucida</option>
                                                <option standard_font='1' value="Tahoma">Tahoma</option>
                                                <option standard_font='1' value="Times New Roman">Times New Roman
                                                </option>
                                                <option standard_font='1' value="Trebuchet MS">Trebuchet MS</option>
                                                <option standard_font='1' value="Verdana">Verdana</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <label>Size</label>
                                            <select class="fb-w70" id="fb-description-size-global">
                                                <option value="9">9px</option>
                                                <option value="10">10px</option>
                                                <option value="11">11px</option>
                                                <option value="12">12px</option>
                                                <option value="13">13px</option>
                                                <option value="14" selected>14px</option>
                                                <option value="16">16px</option>
                                                <option value="18">18px</option>
                                                <option value="20" selected>20px</option>
                                                <option value="22">22px</option>
                                                <option value="24">24px</option>
                                                <option value="26">26px</option>
                                                <option value="28">28px</option>
                                                <option value="30">30px</option>
                                                <option value="36">36px</option>
                                                <option value="48">48px</option>
                                                <option value="64">64px</option>
                                            </select>
                                        </div>
                                        <div class="fb-inner-field">
                                            <div class="wrap-color">
                                                <div id="fb-description-color-global" style="background-color: #333333;"
                                                     class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="fb-global-style-botton" class="fb-design-head"
                                     <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>Button Style
                                </div>
                                <div <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <div class="fb-field clearfix">
                                        <label>Background</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <div class="wrap-color">
                                                    <div id="fb-button-background-global"
                                                         style="background-color: #<?php echo $theme_color;?>;" class="color-box"
                                                         data-color-start="<?php echo $theme_color;?>"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field">
                                        <label>Hover Background</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <div class="wrap-color">
                                                    <div id="fb-button-hover-background-global"
                                                         style="background-color: #<?php echo $theme_hover_color;?>;" class="color-box"
                                                         data-color-start="<?php echo $theme_hover_color;?>"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field">
                                        <label>Border</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <label>Type</label>
                                                <select class="fb-w160" id="fb-button-border-type-global">
                                                    <option value="">None</option>
                                                    <option value="Solid">Solid</option>
                                                    <option value="Dashed">Dashed</option>
                                                    <option value="Dotted">Dotted</option>
                                                    <option value="Double">Double</option>
                                                    <option value="Groove">Groove</option>
                                                    <option value="Ridge">Ridge</option>
                                                    <option value="Inset">Inset</option>
                                                    <option value="Outset">Outset</option>
                                                </select>
                                            </div>
                                            <div class="fb-inner-field">
                                                <input id="fb-button-border-width-global" type="text"
                                                       class="txt_field touch-spin fb-field-small" value="0"/>
                                            </div>
                                            <div class="fb-inner-field">
                                                <label class="eb-text-center">Color</label>
                                                <div class="wrap-color">
                                                    <div id="fb-button-border-color-global"
                                                         style="background-color: #ffffff;" class="color-box"
                                                         data-color-start="ffffff"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field">
                                        <label>Border Radius</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <div class="input-group bootstrap-touchspin">
                                                <span class="input-group-btn">
                                                    <button class="btn btn-default bootstrap-touchspin-down"
                                                            type="button">-</button>
                                                </span>
                                                    <span class="input-group-addon bootstrap-touchspin-prefix"
                                                          style="display: none;"></span>
                                                    <input type="text" name="button_border_radius"
                                                           class="txt_field touch-spin fb-field-small form-control"
                                                           value="4" style="display: block;">
                                                    <span class="input-group-addon bootstrap-touchspin-postfix"
                                                          style="display: none;"></span>
                                                    <span class="input-group-btn"><button
                                                                class="btn btn-default bootstrap-touchspin-up"
                                                                type="button">+</button></span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field clearfix">
                                        <label>Font</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <label>Typeface</label>
                                                <select class="fb-w130" id="fb-button-font-global">
                                                    <option value="Open Sans">None</option>
                                                    <option value="Arial">Arial</option>
                                                    <option value="Comic Sans MS">Comic Sans MS</option>
                                                    <option value="Courier New">Courier New</option>
                                                    <option value="Georgia">Georgia</option>
                                                    <option value="Lucida Sans Unicode">Lucida</option>
                                                    <option value="Tahoma">Tahoma</option>
                                                    <option value="Times New Roman">Times New Roman</option>
                                                    <option value="Trebuchet MS">Trebuchet MS</option>
                                                    <option value="Verdana">Verdana</option>
                                                </select>
                                            </div>
                                            <div class="fb-inner-field">
                                                <label>Size</label>
                                                <select class="fb-w70" id="fb-button-size-global">
                                                    <option value="9">9px</option>
                                                    <option value="10">10px</option>
                                                    <option value="11">11px</option>
                                                    <option value="12">12px</option>
                                                    <option value="13">13px</option>
                                                    <option value="14" selected>14px</option>
                                                    <option value="16">16px</option>
                                                    <option value="18">18px</option>
                                                    <option value="20">20px</option>
                                                    <option value="22">22px</option>
                                                    <option value="24">24px</option>
                                                    <option value="26">26px</option>
                                                    <option value="28">28px</option>
                                                    <option value="30">30px</option>
                                                    <option value="36">36px</option>
                                                    <option value="48">48px</option>
                                                    <option value="64">64px</option>
                                                </select>
                                            </div>
                                            <div class="fb-inner-field">
                                                <div class="wrap-color">
                                                    <div id="fb-button-color-global" style="background-color: #333333;"
                                                         class="color-box" data-color-start="333333"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field clearfix">
                                        <label>Button Align</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <ul class="fb-button-align clearfix" id="btnAlign">
                                                    <li class="fb-t-alg-left selected"></li>
                                                    <li class="fb-t-alg-center"></li>
                                                    <li class="fb-t-alg-right"></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="previous-button-text-container" class="fb-field clearfix"
                                         style="display: none;">
                                        <label>Previous Button Text</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <input type="text" class="txt-field" id="fb-previous-button-text"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="next-button-text-container" class="fb-field clearfix"
                                         style="display: none;">
                                        <label>Next Button Text</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <input type="text" class="txt-field" id="fb-next-button-text"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="fb-field clearfix last-field">
                                        <label>Button Text</label>
                                        <div class="fb-right">
                                            <div class="fb-inner-field">
                                                <input type="text" class="txt-field" id="fb-button-text"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <?php } else { ?>
                            <div class="fb-field clearfix"></div>
                            <div class="fb-field clearfix">
                                <label>Cover Image</label>
                                <div class="fb-right">
                                    <ul class="cover-image pb-list-image" selc="cover-image">

                                    </ul>
                                </div>
                            </div>
                            <div class="fb-field clearfix">
                                <label>Cover Font Color</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="wrap-color">
                                            <div id="event_text_color" class="color-box"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix">
                                <label>Form Label Color</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="wrap-color">
                                            <div id="elements_label_color" class="color-box"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix">
                                <label>Form Background Color</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="wrap-color">
                                            <div id="capture_background_color" class="color-box"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix">
                                <label>Form Background Image</label>
                                <div class="fb-right">
                                    <ul class="pb-list-image capture-background-image" selc="capture-background-image" style="margin-top: 20px;">

                                    </ul>
                                </div>
                            </div>
                            <div class="fb-field clearfix">
                                <label>Field Background</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="ll-switch switch-small">
                                            <div class="switch">
                                                <input id="has_field_background" name="has_field_background"
                                                       class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                <label for="has_field_background"></label>
                                            </div>
                                            <div class="ll-switch-lb"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix" id="capture_field_background_div">
                                <label></label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="wrap-color">
                                            <div id="capture_field_background" class="color-box"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix" id="element_background_mode_div">
                                <label></label>
                                <div class="fb-right" style="top: -12px;">
                                    <div class="eb-inner-field">
                                        <div class="fb-checkboxes-wrap">
                                            <div class="t-field">
                                                <div class="t-radio">
                                                    <label><i class="icn-radio"></i>
                                                        <input name="element_background_mode" value="full_element" type="radio" checked="checked">
                                                        <span class="fb-wrap-tooltip">Full background</span></label>
                                                </div>
                                            </div>
                                            <div class="t-field">
                                                <div class="t-radio">
                                                    <label><i class="icn-radio"></i>
                                                        <input name="element_background_mode" value="input_only" type="radio">
                                                        <span class="fb-wrap-tooltip">Field-only background</span></label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix" id="element_background_opacity_div">
                                <label>Opacity</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <input type="number" class="txt-field" name="element_background_opacity" value="0" step="0.1" min="0.0" max="1.0">
                                    </div>
                                </div>
                            </div>
                                <div class="fb-field clearfix">
                                    <label>Theme</label>
                                    <div class="fb-right">
                                        <div class="fb-inner-field">
                                            <select id="theme" class="" data-placeholder="Select Theme">
                                                <option value="">--- Default Theme ---</option>
                                                <option value="black">Black</option>
                                                <option value="blue">Blue</option>
                                                <option value="dark-purple">Dark Purple</option>
                                                <option value="green">Green</option>
                                                <option value="red">Red</option>
                                                <option value="silver">Silver</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            <?php if ( $list_id ){ ?>
                            <div class="fb-design-head">Search List Button</div>
                            <div class="fb-field clearfix" id="">
                                <label>Use Theme Style</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="ll-switch switch-small">
                                            <div class="switch">
                                                <input id="is_use_theme_style_search_list" name="is_use_theme_style_search_list"
                                                       class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                <label for="is_use_theme_style_search_list"></label>
                                            </div>
                                            <div class="ll-switch-lb"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix element-style_search_list">
                                <label>Background Color</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="wrap-color">
                                            <div id="element_background_color_search_list" class="color-box"
                                                 call-back="1"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <?php } ?>
                            <div class="fb-field clearfix element-style_search_list">
                                <label>Text Color</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="wrap-color">
                                            <div id="element_text_color_search_list" class="color-box"
                                                 call-back="1"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-design-head">Event Buttons</div>
                            <div class="fb-field clearfix">
                                <label>Buttons Menu</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="ll-switch switch-small">
                                            <div class="switch">
                                                <input id="has_event_buttons_menu" name="has_event_buttons_menu"
                                                       class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                <label for="has_event_buttons_menu"></label>
                                            </div>
                                            <div class="ll-switch-lb"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix" id="buttons-menu-field">
                                <label></label>
                                <div class="fb-right">
                                    <div class="fb-inner-field fb-multiple-field ui-sortable" id="buttons-menu-div">

                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix">
                                <label>Floating Buttons</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="ll-switch switch-small">
                                            <div class="switch">
                                                <input id="has_event_floating_buttons" name="has_event_floating_buttons"
                                                       class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                <label for="has_event_floating_buttons"></label>
                                            </div>
                                            <div class="ll-switch-lb"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix" id="floating-buttons-field">
                                <label></label>
                                <div class="fb-right">
                                    <div class="fb-inner-field fb-multiple-field ui-sortable" id="floating-buttons-div">

                                    </div>
                                </div>
                            </div>
                            <div class="fb-design-head">Screensaver</div>
                            <div class="fb-field clearfix">
                                <label>Enable</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="ll-switch switch-small">
                                            <div class="switch">
                                                <input id="is_enable_screensaver" name="is_enable_screensaver"
                                                       class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                <label for="is_enable_screensaver"></label>
                                            </div>
                                            <div class="ll-switch-lb"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix screensaver_options">
                                <label>Start after (seconds)</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <input type="number" id="rotation_period_value" min="10" max="600"
                                               class="txt-field"/>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix screensaver_options">
                                <label>Randomize</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <div class="ll-switch switch-small">
                                            <div class="switch">
                                                <input id="is_randomize" name="is_randomize"
                                                       class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                <label for="is_randomize"></label>
                                            </div>
                                            <div class="ll-switch-lb"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix screensaver_options">
                                <label>Change every (seconds)</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <input type="number" id="switch_frequency" class="txt-field"/>
                                    </div>
                                </div>
                            </div>
                            <!--On iPad Pro 3rd generation the screensaver have problems with the “Cube” and “Coverflow” effects as:
                            1) Cube: Zooms and crashes
                            2) Coverflow: Zooms some images and messes up some-->
                            <div class="fb-field clearfix screensaver_options">
                                <label>Transition Effect</label>
                                <div class="fb-right">
                                    <div class="fb-inner-field">
                                        <select id="transition_effect">
                                            <option value="slide">Slide</option>
                                           <!-- <option value="coverflow">Coverflow</option>
                                            <option value="cube">Cube</option>-->
                                            <option value="fade">Fade</option>
                                            <option value="flip">Flip</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="fb-field clearfix screensaver_options">
                                <label>Images</label>
                                <div class="fb-right">
                                    <ul class="sc-list-image fb-multiple-field ui-sortable">

                                    </ul>
                                </div>
                            </div>

                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>
            <!--end panels-->
            <div class="wrap-panels-el">
                <div class="fb-right-panel-slide">
                    <div class="fb-panel-head">
                        <span id="element_name"></span>
                        <a href="javascript:void(0);" class="fb-save-panel">Save & Close</a>
                    </div>
                    <div class="fb-panel-content">
                        <div class="tabs-editor">
                            <ul class="clearfix">
                                <li class="selected"><a href="javascript:void(0);"><i class="icn-form-properties"></i>Settings</a>
                                </li>
                                <li id="field_style_tab" <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                    <a href="javascript:void(0);"><i class="icn-form-style"></i>Style</a></li>
                            </ul>
                            <div class="wrap-tabs-content">
                                <div class="tab-content">
                                    <div class="fb-settings">
                                        <div class="fb-field" id="element_field_label">
                                            <label><span class="fb-wrap-tooltip">Field Label <span class="fb-tooltip">Field Label is one or two words placed directly above the field.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-checkbox ll_std_tooltip" id="label-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>"
                                                         title="Hiding the Field Label removes the label from the device form while keeping the label in an exported spreadsheet column header and for use within Visibility Rules." >
                                                        <label><i class="icn-eye"></i>
                                                            <input class="is-label-visible" type="checkbox" checked>
                                                        </label>
                                                    </div>
                                                    <input type="text" class="txt-field fb-label-text" value="Text"/>
                                                </div>
                                            </div>
                                        </div>
                                        <?php if(! $is_device_form){?>
                                            <div class="fb-field" id="element_field_placeholder">
                                                <label>Field Placeholder</label>
                                                <div class="fb-right">
                                                    <div class="eb-inner-field">
                                                        <input type="text" class="txt-field fb-placeholder-text" value=""/>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php }?>
                                        <div class="fb-field" id="element_field_description">
                                            <label>Description</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <textarea class="txt-field field-description"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_boolean_field_description">
                                            <label>Description</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <textarea class="txt-field boolean-field-description"></textarea>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_boolean_mode">
                                            <label>Mode</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-radio-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="boolean_mode"
                                                                                                       checked="checked"
                                                                                                       value="1"><span
                                                                            class="fb-wrap-tooltip">Normal<span
                                                                                class="fb-tooltip">Normal: checked box equals TRUE</span></span></label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="boolean_mode"
                                                                                                       value="2"><span
                                                                            class="fb-wrap-tooltip">Reverse<span
                                                                                class="fb-tooltip">Reverse: checked box equals FALSE</span></span></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_boolean_default_value">
                                            <label>Default Value</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-radio-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="default_value"
                                                                                                       value="1">Checked</label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="default_value"
                                                                                                       value="0">Unchecked</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_expression">
                                            <label>Expression</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-link">
                                                    <a href="javascript:void(0);"
                                                       class="ll-show-popup fb-btn-set-expression"
                                                       data-show-popup="popup-set-expression">Set Expression</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_currency_format">
                                            <label>Currency Format</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select id="currency_format">
                                                        <option value="dollar">&#36; Dollars</option>
                                                        <option value="euro">&#8364; Euros</option>
                                                        <option value="pound">&#163; Pounds</option>
                                                        <option value="yen">&#165; Yen</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field fb-columns-box clearfix" id="element_name_field_hint">
                                            <label>Field Hints</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field fb-wrap-field-name">
                                                    <div class="t-field">
                                                        <span class="label-top">First</span>
                                                        <input type="text" id="fb-field-name-first" class="txt-field"
                                                               value="First"/>
                                                    </div>
                                                    <div class="t-field">
                                                        <span class="label-top">Last</span>
                                                        <input type="text" id="fb-field-name-last" class="txt-field"
                                                               value="Last"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field fb-columns-box clearfix" id="element_address_field_hint">
                                            <label>Field Hints</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-field">
                                                        <span class="label-top" <?php if ($is_device_form){ ?>style="margin-left: 42px;"<?php } ?>>Street</span>
                                                        <div class="t-checkbox ll_std_tooltip" id="fb-address-street-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>">
                                                            <label><i class="icn-eye"></i>
                                                                <input class="is-fb-address-street-visible" type="checkbox" checked>
                                                            </label>
                                                        </div>
                                                        <input type="text" class="txt-field" id="fb-address-street"/>
                                                    </div>
                                                    <div class="t-field">
                                                        <span class="label-top" <?php if ($is_device_form ){ ?>style="margin-left: 42px;"<?php } ?>>Street 2</span>
                                                        <div class="t-checkbox ll_std_tooltip" id="fb-address-street-2-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>">
                                                            <label><i class="icn-eye"></i>
                                                                <input class="is-fb-address-street-2-visible" type="checkbox" checked>
                                                            </label>
                                                        </div>
                                                        <input type="text" class="txt-field" id="fb-address-street-2"/>
                                                    </div>
                                                    <div class="t-field">
                                                        <span class="label-top" <?php if ($is_device_form){ ?>style="margin-left: 42px;"<?php } ?> >City</span>
                                                        <div class="t-checkbox ll_std_tooltip" id="fb-address-city-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>">
                                                            <label><i class="icn-eye"></i>
                                                                <input class="is-fb-address-city-visible" type="checkbox" checked>
                                                            </label>
                                                        </div>
                                                        <input type="text" class="txt-field" id="fb-address-city"/>
                                                    </div>
                                                    <div class="t-field">
                                                        <span class="label-top" <?php if ($is_device_form){ ?>style="margin-left: 42px;"<?php } ?>>State</span>
                                                        <div class="t-checkbox ll_std_tooltip" id="fb-address-state-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>">
                                                            <label><i class="icn-eye"></i>
                                                                <input class="is-fb-address-state-visible" type="checkbox" checked>
                                                            </label>
                                                        </div>
                                                        <input type="text" class="txt-field" id="fb-address-state"/>
                                                    </div>
                                                    <div class="t-field">
                                                        <span class="label-top" <?php if ($is_device_form){ ?>style="margin-left: 42px;"<?php } ?>>Zip</span>
                                                        <div class="t-checkbox ll_std_tooltip" id="fb-address-zip-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>">
                                                            <label><i class="icn-eye"></i>
                                                                <input class="is-fb-address-zip-visible" type="checkbox" checked>
                                                            </label>
                                                        </div>
                                                        <input type="text" class="txt-field" id="fb-address-zip"/>
                                                    </div>
                                                    <div class="t-field">
                                                        <span class="label-top" <?php if ($is_device_form ){ ?>style="margin-left: 42px;"<?php } ?>>Country</span>
                                                        <div class="t-checkbox ll_std_tooltip" id="fb-address-country-visibility" style="margin: 7px; <?php if (!$is_device_form){ ?>display:none;<?php } ?>">
                                                            <label><i class="icn-eye"></i>
                                                                <input class="is-fb-address-country-visible" type="checkbox" checked>
                                                            </label>
                                                        </div>
                                                        <input type="text" class="txt-field" id="fb-address-country"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_field_size">
                                            <label class="ll_std_tooltip"
                                                   title="Small sets the field width to 25% of the <?php echo strtolower($form_lbl); ?> container (excludes external padding). Medium is 50%. Large is 100%.">Field
                                                Size</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select class="fb-field-length">
                                                        <option value="small">Small</option>
                                                        <option selected value="medium">Medium</option>
                                                        <option value="large">Large</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_choices">
                                            <label>
                                                <span class="fb-wrap-tooltip">Choices <span class="fb-tooltip">Use the plus and minus buttons to add and delete choices. Click on the star to make a choice the default selection.</span></span>
                                                <a href="javascript:void(0)" id="edit_element_choices"
                                                   class="ll_std_tooltip" title="Edit"><img src="imgs/svg/icn-edit.svg"></a>
                                                <a href="javascript:void(0)" id="clear_element_choices"
                                                   class="ll_std_tooltip" title="Clear"><img
                                                            src="imgs/svg/icn-clear.svg"></a>
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-multiple-field" id="choices" data-src-type="">

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_choices_display">
                                            <label>Display</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="choices-display"
                                                                            id="fb-radio-classic" value="classic"
                                                                            type="radio"><span class="fb-wrap-tooltip">Classic</span></label>

                                                            </div>
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="choices-display"
                                                                            id="fb-radio-survey" value="survey"
                                                                            type="radio"><span class="fb-wrap-tooltip">Survey</span></label>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="choices-hint-left">
                                            <label>Left Hint</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field fb-choise-hint-left-text" value="NOT AT ALL LIKELY"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="choices-hint-right">
                                            <label>Right Hint</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field fb-choise-hint-right-text" value="EXTREMELY LIKELY"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="amount_title">
                                            <label>Amount Title</label>
                                            <div class="fb-right">
                                                <input class="txt-field" type="text" name="amount_title"/>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_choices_data_source">
                                            <label>
                                                <span class="fb-wrap-tooltip">Data Source</span>
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-field">
                                                        <select class="fb-field-data-source">
                                                            <option value="">Select Data Source</option>
                                                            <?php
                                                            foreach ($dropdwon_fields AS $drop_field_id => $drop_field_name) {
                                                                echo "<option value='{$drop_field_id}'>{$drop_field_name}</option>";
                                                            }
                                                            ?>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix " id="element_documents_sets">
                                            <label>
                                                <span class="fb-wrap-tooltip ">Document Group</span>
                                            </label>
                                            <div class="fb-right">
                                                <div class="t-field fb-multiple-field">
                                                    <a href="javascript:void(0)" id="add_element_documents_choices" class="fb-btn-add t-btn-gray ll_std_tooltip" title="Add"></a>
                                                    <a href="javascript:void(0)" id="edit_element_documents_choices" class="fb-btn-edit t-btn-gray ll_std_tooltip" title="Edit"></a>
                                                    <a href="javascript:void(0)" id="FA_actions_element_documents_choices" class="fb-btn-settings t-btn-gray ll_std_tooltip" title="Actions" ll_asset_id='0' ll_asset_type='<?php echo ll_completion_actions_manager::LL_ASSET_TYPE_DOCUMENT_GROUP;?>' ll_activity_type='<?php echo ll_completion_actions_manager::LL_ACTIVITY_TYPE_ADDED_TO_DOCUMENT_GROUP;?>'></a>
                                                    <select id="document_set" data-placeholder="Select Document Group">
                                                        <option value=""></option>
                                                        <?php
                                                        foreach ($documents_sets AS $ll_documents_set_id => $set_data) {
                                                            echo "<option value='{$ll_documents_set_id}'>{$set_data['name']}</option>";
                                                        }
                                                        ?>
                                                    </select>
                                                    <!-- <div class="line-criteries ">
                                                                <a href="javascript:void(0)" class="add-line-criteries add_new_document_set"></a>
                                                            </div>-->
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix " id="element_activation">
                                            <label>
                                                <span class="fb-wrap-tooltip ">Activation</span>
                                            </label>
                                            <div class="fb-right">
                                                <div class="t-field fb-multiple-field">
                                                    <select id="ll_activation_id" data-placeholder="Select Activation">
                                                        <option value=""></option>
                                                        <?php
                                                        foreach ($ll_activations as $ll_activation) {
                                                            echo "<option value='{$ll_activation->ll_activation_id}'>{$ll_activation->ll_activation_name}</option>";
                                                        }
                                                        ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_phone_format">
                                            <label><span class="fb-wrap-tooltip">Phone Format <span class="fb-tooltip">You can choose between American and International Phone Formats</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select id="phone_format">
                                                        <option value="formatted">(###) ### - ####</option>
                                                        <option value="international">International</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field clearfix" id="element_rules">
                                            <label>Rules</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field" id="container_element_required">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="field_is_required"><span
                                                                            class="fb-wrap-tooltip">Required<span
                                                                                class="fb-tooltip">Ensures this field is filled out. A message will be displayed to the visitor if they fail to fill out the field.</span></span></label>

                                                            </div>
                                                        </div>
                                                        <div class="t-field"
                                                             <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="field_is_always_display"><span
                                                                            class="fb-wrap-tooltip">Always Display<span
                                                                                class="fb-tooltip">Ensures this field is always displayed.</span></span></label>

                                                            </div>
                                                        </div>
                                                        <div class="t-field"
                                                             <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox" name="field_is_conditional"><span
                                                                            class="fb-wrap-tooltip">Progressive Profiling<span
                                                                                class="fb-tooltip">If the system already has this information for the visitor then this field will not be displayed. Consecutive conditional fields are displayed in order with only one conditional field displayed at a time.</span></span></label>

                                                            </div>
                                                        </div>
                                                        <div class="t-field" id="rule_donot_prefill"
                                                             <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="field_is_donot_prefill"><span
                                                                            class="fb-wrap-tooltip">Do not Pre-Fill<span
                                                                                class="fb-tooltip">Selecting do not pre-fill option will not pre-fill this field, and this field only, with previously saved data.</span></span></label>

                                                            </div>
                                                        </div>
                                                        <div class="t-field" id="rule_hidden">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox" name="field_is_hidden"><span
                                                                            class="fb-wrap-tooltip">Hidden<span
                                                                                class="fb-tooltip">Ensures this field is rendered to the <?php echo strtolower($form_lbl); ?> but always hidden.</span></span></label>

                                                            </div>
                                                        </div>
														<?php /*if(ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$ACTIVATIONS )){ */?><!--
                                                            <div class="t-field" id="rule_activations" <?php /*if (!$is_device_form && !$is_event_template){ */?>style="display: none;"<?php /*} */?> >
                                                                <div class="t-checkbox">
                                                                    <label><i class="icn-checkbox"></i><input
                                                                                type="checkbox" name="field_is_activation"><span
                                                                                class="fb-wrap-tooltip">Activations</span></label>

                                                                </div>
                                                            </div>
                                                        --><?php /*} */?>
                                                        <div class="t-field" id="rule_translate"
                                                             <?php if (!$is_device_form || !$customer_general_settings['localization_mode'] || !$is_localized){ ?>style="display: none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="field_is_translate"><span
                                                                            class="fb-wrap-tooltip">Translate</span></label>

                                                            </div>
                                                        </div>
                                                        <div class="t-field" id="rule_retry_playing" style="display: none;">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="retry_playing"><span
                                                                            class="fb-wrap-tooltip">Replay
                                                                        <span class="fb-tooltip">Enabling this setting allows the game to be replayed. If disabled then the button will be disabled in the form after the game is played.</span></span></label>

                                                            </div>
                                                        </div>
                                                        <div class="t-field" id="element_sort_alphabetic"
                                                             <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label class="main_label"><i
                                                                            class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="is_sort_alphabetically">Sort</label>
                                                                <span class="select_order_direction">
                                                                            <select name="sort_order"
                                                                                    class="txt-field txt-field-small">
                                                                                <option value="asc">Ascending</option>
                                                                                <option value="des">Descending</option>
                                                                            </select>
                                                                        </span>
                                                            </div>
                                                        </div>


                                                        <div
                                                            <?php if (!$is_device_form){ ?>style="display: none;"<?php } ?>
                                                            id="element_accept_invalid_barcode"
                                                            class="t-field ll_std_tooltip"
                                                            title="If a QR/barcode is scanned and the lead retrieval web service returns invalid results then the submission will be held in the internal portal for subsequent processing.">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="accept_invalid_barcode"
                                                                           id="accept_invalid_barcode" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Accept invalid barcodes</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div style="display: none;"
                                                             id="element_post_show_reconciliation" class="t-field">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="post_show_reconciliation"
                                                                           id="post_show_reconciliation" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Post-Show Reconciliation</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div style="display: none;"
                                                             id="element_forward_submission_to_portal" class="t-field">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="forward_submission_to_portal"
                                                                           id="forward_submission_to_portal" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Send to Capture Portal</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <?php if(ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$ACTIVATIONS )){ ?>
                                        <div class="fb-field clearfix"  id="display_setting"
                                             <?php if (!$is_device_form && !$is_event_template){ ?>style="display:none;"<?php } ?>>
                                            <label>Display</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-field">
                                                        <div class="t-radio">
                                                            <label><i class="icn-radio"></i><input name="display_mode"
                                                                                                   value="0" type="radio">
                                                                <span class="fb-wrap-tooltip">Event Form</span></label>
                                                        </div>
                                                    </div>
                                                    <div class="t-field">
                                                        <div class="t-radio">
                                                            <label><i class="icn-radio"></i><input name="display_mode"
                                                                                                   value="2"
                                                                                                   type="radio">
                                                                <span class="fb-wrap-tooltip">Activation Form</span></label>
                                                        </div>
                                                    </div>
                                                    <div class="t-field">
                                                        <div class="t-radio">
                                                            <label><i class="icn-radio"></i><input name="display_mode"
                                                                                                   value="1" type="radio">
                                                                <span class="fb-wrap-tooltip">Both</span></label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <?php }?>
                                        <?php if ($is_event_template) { ?>
                                            <div class="fb-field clearfix" id="element_permissions">
                                                <label>Permissions</label>
                                                <div class="fb-right">
                                                    <div class="eb-inner-field">
                                                        <div class="fb-checkboxes-wrap">
                                                            <div class="t-field" id="edit_permission">
                                                                <div class="t-checkbox">
                                                                    <label>
                                                                        <i class="icn-checkbox"></i>
                                                                        <input type="checkbox" name="has_edit_permission">Edit
                                                                    </label>
                                                                </div>
                                                            </div>
                                                            <div class="t-field" id="delete_permission">
                                                                <div class="t-checkbox">
                                                                    <label>
                                                                        <i class="icn-checkbox"></i>
                                                                        <input type="checkbox" name="has_delete_permission">Delete
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        <?php }?>
                                        <div class="fb-field clearfix" id="business_card_element_options">
                                            <label>Capture Options</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field"
                                                             <?php if ($is_device_form && LL_GLOBAL_CONF_SERVER_IDENTIFIER == LL_GLOBAL_CONF_SERVER_PRODUCTION){ ?>style="display:none;"<?php } ?>>
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="is_scan_cards_and_prefill_form"><span>Scan Cards and Pre-Fill <?php echo $form_lbl; ?> </span></label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="is_enable_transcription"><span>Enable Transcription</span></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="transcription_options">
                                            <label>Portal</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field" style="display: none;">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="transcription_type"
                                                                                                       value="<?php echo ll_business_cards_requests::LL_BUSINESS_CARDS_REQUEST_TYPE_EXTERNAL; ?>"><span
                                                                            class="fb-wrap-tooltip">Lead Liaison Transcription Service<span
                                                                                class="fb-tooltip">Have cards transcribed by Lead Liaison for a small fee per card. Submissions are held in private capture portal for Lead Liaison’s Professional Services Team to transcribe. Once transcribed, <?php echo strtolower($form_lbl); ?> submission is completed. Transcriptions usually happen within a 24 hour period.</span></span></label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="transcription_type"
                                                                                                       value="<?php echo ll_business_cards_requests::LL_BUSINESS_CARDS_REQUEST_TYPE_INTERNAL; ?>"><span
                                                                            class="fb-wrap-tooltip">Capture Portal<span
                                                                                class="fb-tooltip">Submissions held inside the platform for you or our Operations Team to transcribe.</span></span></label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input type="radio"
                                                                                                       name="transcription_type"
                                                                                                       value="<?php echo ll_business_cards_requests::LL_BUSINESS_CARDS_REQUEST_TYPE_EXPEDITED; ?>"><span
                                                                            class="fb-wrap-tooltip">Expedited Transcription<span
                                                                                class="fb-tooltip">Cards will be transcribed by Lead Liaison’s workforce for a small fee. Once transcribed, a <?php echo strtolower($form_lbl); ?> submission is complete. Transcriptions usually happen within 15-25 minutes after submission.</span></span></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="expedited_transcription_options">
                                            <label><span class="fb-wrap-tooltip">Localization<span class="fb-tooltip">We will identify resources who understand the local language, resulting in higher transcription accuracy. Note that non-english localizations delay transcription turnaround.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select name="transcription_expedited_localization"
                                                            id="transcription_expedited_localization">
                                                        <?php
                                                        foreach ($ll_mturk_languages as $ll_mturk_language) {
                                                            echo "<option value='$ll_mturk_language'>" . ucwords($ll_mturk_language) . "</option>";
                                                        }
                                                        ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="transcription_notes">
                                            <label>Transcription Notes</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field field-color-transparent">
                                                    <a href="javascript:void(0);" class="t-btn-gray ll_std_tooltip"
                                                       id="transcription_notes_popup">Add Transcription Notes</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="required_field_hint_container"
                                             style="display:none;">
                                            <label>Required Field Hint</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field" name="required_field_hint"
                                                           value="*"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_default_country">
                                            <label><span class="fb-wrap-tooltip">Default Country <span
                                                            class="fb-tooltip">By setting this value, the country field will be prepopulated with the selection you make.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select id="default_country">
                                                        <option value=""></option>
                                                        <optgroup label="North America">
                                                            <option value="Antigua and Barbuda">Antigua and Barbuda
                                                            </option>
                                                            <option value="Bahamas">Bahamas</option>
                                                            <option value="Barbados">Barbados</option>
                                                            <option value="Belize">Belize</option>
                                                            <option value="Canada">Canada</option>
                                                            <option value="Costa Rica">Costa Rica</option>
                                                            <option value="Cuba">Cuba</option>
                                                            <option value="Dominica">Dominica</option>
                                                            <option value="Dominican Republic">Dominican Republic
                                                            </option>
                                                            <option value="El Salvador">El Salvador</option>
                                                            <option value="Grenada">Grenada</option>
                                                            <option value="Guatemala">Guatemala</option>
                                                            <option value="Haiti">Haiti</option>
                                                            <option value="Honduras">Honduras</option>
                                                            <option value="Jamaica">Jamaica</option>
                                                            <option value="Mexico">Mexico</option>
                                                            <option value="Nicaragua">Nicaragua</option>
                                                            <option value="Panama">Panama</option>
                                                            <option value="Puerto Rico">Puerto Rico</option>
                                                            <option value="Saint Kitts and Nevis">Saint Kitts and
                                                                Nevis
                                                            </option>
                                                            <option value="Saint Lucia">Saint Lucia</option>
                                                            <option value="Saint Vincent and the Grenadines">Saint
                                                                Vincent and
                                                                the Grenadines
                                                            </option>
                                                            <option value="Trinidad and Tobago">Trinidad and Tobago
                                                            </option>
                                                            <option value="United States">United States</option>
                                                        </optgroup>

                                                        <optgroup label="South America">
                                                            <option value="Argentina">Argentina</option>
                                                            <option value="Bolivia">Bolivia</option>
                                                            <option value="Brazil">Brazil</option>
                                                            <option value="Chile">Chile</option>
                                                            <option value="Columbia">Columbia</option>
                                                            <option value="Ecuador">Ecuador</option>
                                                            <option value="Guyana">Guyana</option>
                                                            <option value="Paraguay">Paraguay</option>
                                                            <option value="Peru">Peru</option>
                                                            <option value="Suriname">Suriname</option>
                                                            <option value="Uruguay">Uruguay</option>
                                                            <option value="Venezuela">Venezuela</option>
                                                        </optgroup>

                                                        <optgroup label="Europe">
                                                            <option value="Albania">Albania</option>
                                                            <option value="Andorra">Andorra</option>
                                                            <option value="Armenia">Armenia</option>
                                                            <option value="Austria">Austria</option>
                                                            <option value="Azerbaijan">Azerbaijan</option>
                                                            <option value="Belarus">Belarus</option>
                                                            <option value="Belgium">Belgium</option>
                                                            <option value="Bosnia and Herzegovina">Bosnia and
                                                                Herzegovina
                                                            </option>
                                                            <option value="Bulgaria">Bulgaria</option>
                                                            <option value="Croatia">Croatia</option>
                                                            <option value="Cyprus">Cyprus</option>
                                                            <option value="Czech Republic">Czech Republic</option>
                                                            <option value="Denmark">Denmark</option>
                                                            <option value="Estonia">Estonia</option>
                                                            <option value="Finland">Finland</option>
                                                            <option value="France">France</option>
                                                            <option value="Georgia">Georgia</option>
                                                            <option value="Germany">Germany</option>
                                                            <option value="Greece">Greece</option>
                                                            <option value="Hungary">Hungary</option>
                                                            <option value="Iceland">Iceland</option>
                                                            <option value="Ireland">Ireland</option>
                                                            <option value="Italy">Italy</option>
                                                            <option value="Latvia">Latvia</option>
                                                            <option value="Liechtenstein">Liechtenstein</option>
                                                            <option value="Lithuania">Lithuania</option>
                                                            <option value="Luxembourg">Luxembourg</option>
                                                            <option value="Macedonia">Macedonia</option>
                                                            <option value="Malta">Malta</option>
                                                            <option value="Moldova">Moldova</option>
                                                            <option value="Monaco">Monaco</option>
                                                            <option value="Montenegro">Montenegro</option>
                                                            <option value="Netherlands">Netherlands</option>
                                                            <option value="Norway">Norway</option>
                                                            <option value="Poland">Poland</option>
                                                            <option value="Portugal">Portugal</option>
                                                            <option value="Romania">Romania</option>
                                                            <option value="San Marino">San Marino</option>
                                                            <option value="Serbia">Serbia</option>
                                                            <option value="Slovakia">Slovakia</option>
                                                            <option value="Slovenia">Slovenia</option>
                                                            <option value="Spain">Spain</option>
                                                            <option value="Sweden">Sweden</option>
                                                            <option value="Switzerland">Switzerland</option>
                                                            <option value="Ukraine">Ukraine</option>
                                                            <option value="United Kingdom">United Kingdom</option>
                                                            <option value="Vatican City">Vatican City</option>
                                                        </optgroup>

                                                        <optgroup label="Asia">
                                                            <option value="Afghanistan">Afghanistan</option>
                                                            <option value="Bahrain">Bahrain</option>
                                                            <option value="Bangladesh">Bangladesh</option>
                                                            <option value="Bhutan">Bhutan</option>
                                                            <option value="Brunei Darussalam">Brunei Darussalam</option>
                                                            <option value="Myanmar">Myanmar</option>
                                                            <option value="Cambodia">Cambodia</option>
                                                            <option value="China">China</option>
                                                            <option value="East Timor">East Timor</option>
                                                            <option value="Hong Kong">Hong Kong</option>
                                                            <option value="India">India</option>
                                                            <option value="Indonesia">Indonesia</option>
                                                            <option value="Iran">Iran</option>
                                                            <option value="Iraq">Iraq</option>
                                                            <option value="Israel">Israel</option>
                                                            <option value="Japan">Japan</option>
                                                            <option value="Jordan">Jordan</option>
                                                            <option value="Kazakhstan">Kazakhstan</option>
                                                            <option value="North Korea">North Korea</option>
                                                            <option value="South Korea">South Korea</option>
                                                            <option value="Kuwait">Kuwait</option>
                                                            <option value="Kyrgyzstan">Kyrgyzstan</option>
                                                            <option value="Laos">Laos</option>
                                                            <option value="Lebanon">Lebanon</option>
                                                            <option value="Malaysia">Malaysia</option>
                                                            <option value="Maldives">Maldives</option>
                                                            <option value="Mongolia">Mongolia</option>
                                                            <option value="Nepal">Nepal</option>
                                                            <option value="Oman">Oman</option>
                                                            <option value="Pakistan">Pakistan</option>
                                                            <option value="Philippines">Philippines</option>
                                                            <option value="Qatar">Qatar</option>
                                                            <option value="Russia">Russia</option>
                                                            <option value="Saudi Arabia">Saudi Arabia</option>
                                                            <option value="Singapore">Singapore</option>
                                                            <option value="Sri Lanka">Sri Lanka</option>
                                                            <option value="Syria">Syria</option>
                                                            <option value="Taiwan">Taiwan</option>
                                                            <option value="Tajikistan">Tajikistan</option>
                                                            <option value="Thailand">Thailand</option>
                                                            <option value="Turkey">Turkey</option>
                                                            <option value="Turkmenistan">Turkmenistan</option>
                                                            <option value="United Arab Emirates">United Arab Emirates
                                                            </option>
                                                            <option value="Uzbekistan">Uzbekistan</option>
                                                            <option value="Vietnam">Vietnam</option>
                                                            <option value="Yemen">Yemen</option>
                                                        </optgroup>

                                                        <optgroup label="Oceania">
                                                            <option value="Australia">Australia</option>
                                                            <option value="Fiji">Fiji</option>
                                                            <option value="Kiribati">Kiribati</option>
                                                            <option value="Marshall Islands">Marshall Islands</option>
                                                            <option value="Micronesia">Micronesia</option>
                                                            <option value="Nauru">Nauru</option>
                                                            <option value="New Zealand">New Zealand</option>
                                                            <option value="Palau">Palau</option>
                                                            <option value="Papua New Guinea">Papua New Guinea</option>
                                                            <option value="Samoa">Samoa</option>
                                                            <option value="Solomon Islands">Solomon Islands</option>
                                                            <option value="Tonga">Tonga</option>
                                                            <option value="Tuvalu">Tuvalu</option>
                                                            <option value="Vanuatu">Vanuatu</option>
                                                        </optgroup>

                                                        <optgroup label="Africa">
                                                            <option value="Algeria">Algeria</option>
                                                            <option value="Angola">Angola</option>
                                                            <option value="Benin">Benin</option>
                                                            <option value="Botswana">Botswana</option>
                                                            <option value="Burkina Faso">Burkina Faso</option>
                                                            <option value="Burundi">Burundi</option>
                                                            <option value="Cameroon">Cameroon</option>
                                                            <option value="Cape Verde">Cape Verde</option>
                                                            <option value="Central African Republic">Central African
                                                                Republic
                                                            </option>
                                                            <option value="Chad">Chad</option>
                                                            <option value="Comoros">Comoros</option>
                                                            <option value="Congo">Congo</option>
                                                            <option value="Djibouti">Djibouti</option>
                                                            <option value="Egypt">Egypt</option>
                                                            <option value="Equatorial Guinea">Equatorial Guinea</option>
                                                            <option value="Eritrea">Eritrea</option>
                                                            <option value="Ethiopia">Ethiopia</option>
                                                            <option value="Gabon">Gabon</option>
                                                            <option value="Gambia">Gambia</option>
                                                            <option value="Ghana">Ghana</option>
                                                            <option value="Guinea">Guinea</option>
                                                            <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                            <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                                                            <option value="Kenya">Kenya</option>
                                                            <option value="Lesotho">Lesotho</option>
                                                            <option value="Liberia">Liberia</option>
                                                            <option value="Libya">Libya</option>
                                                            <option value="Madagascar">Madagascar</option>
                                                            <option value="Malawi">Malawi</option>
                                                            <option value="Mali">Mali</option>
                                                            <option value="Mauritania">Mauritania</option>
                                                            <option value="Mauritius">Mauritius</option>
                                                            <option value="Morocco">Morocco</option>
                                                            <option value="Mozambique">Mozambique</option>
                                                            <option value="Namibia">Namibia</option>
                                                            <option value="Niger">Niger</option>
                                                            <option value="Nigeria">Nigeria</option>
                                                            <option value="Rwanda">Rwanda</option>
                                                            <option value="Sao Tome and Principe">Sao Tome and
                                                                Principe
                                                            </option>
                                                            <option value="Senegal">Senegal</option>
                                                            <option value="Seychelles">Seychelles</option>
                                                            <option value="Sierra Leone">Sierra Leone</option>
                                                            <option value="Somalia">Somalia</option>
                                                            <option value="South Africa">South Africa</option>
                                                            <option value="Sudan">Sudan</option>
                                                            <option value="Swaziland">Swaziland</option>
                                                            <option value="United Republic of Tanzania">Tanzania
                                                            </option>
                                                            <option value="Togo">Togo</option>
                                                            <option value="Tunisia">Tunisia</option>
                                                            <option value="Uganda">Uganda</option>
                                                            <option value="Zambia">Zambia</option>
                                                            <option value="Zimbabwe">Zimbabwe</option>
                                                        </optgroup>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_default_value">
                                            <label><span class="fb-wrap-tooltip">Default Value <span class="fb-tooltip">By setting this value, the field will be prepopulated with the text you enter.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field" name="field_default_value"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_randomize"
                                             <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                            <label>Randomize</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="multiple-randomize" type="radio"
                                                                            value="static"><span
                                                                            class="fb-wrap-tooltip">Static Order<span
                                                                                class="fb-tooltip">This is the default option. Options will always be displayed in the order you have created them.</span></span></label>

                                                            </div>
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="multiple-randomize" type="radio"
                                                                            value="random"><span
                                                                            class="fb-wrap-tooltip">Random Order<span
                                                                                class="fb-tooltip fb-pull-right">Choose this if you would like the options to be shuffled around each time someone views your <?php echo strtolower($form_lbl); ?>.</span></span></label>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_field_items_direction"
                                             <?php if ($is_device_form){ ?>style="display: none;"<?php } ?>>
                                            <label id="title">Field Items Direction</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="multiple-direction"
                                                                            id="fb-radio-vertical" value="vertical"
                                                                            type="radio"><span class="fb-wrap-tooltip">Vertical<span
                                                                                class="fb-tooltip">This is the default option. Options will always be displayed vertically.</span></span></label>

                                                            </div>
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="multiple-direction"
                                                                            id="fb-radio-horizontal" value="horizontal"
                                                                            type="radio"><span
                                                                            class="fb-wrap-tooltip"><span
                                                                                id="horizontal_title">Horizontal</span><span
                                                                                class="fb-tooltip fb-pull-right">Choose this if you would like the options to be displayed horizontally.</span></span></label>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix fb-box-number-columns-radio"
                                             id="element_number_columns">
                                            <label>Number Columns</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="field">
                                                        <select class="fb-number-columns-choices">
                                                            <option value="2" selected>Column 2</option>
                                                            <option value="3">Column 3</option>
                                                            <option value="4">Column 4</option>
                                                            <option value="5">Column 5</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_field_error_message">
                                            <label><span class="fb-wrap-tooltip">Field Error Message <span
                                                            class="fb-tooltip">This error message will be shown if the submitted field information is not valid.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field" name="field_error_message"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_invalid_file_error_message">
                                            <label><span>Invalid File Error Message</span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field" name="invalid_file_error_message"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_badge_type">
                                            <label>Scan Type</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select name="badge_type">
                                                        <option value="<?php echo ll_supported_barcode_provider_types::BADGE_TYPE_BARCODE; ?>"
                                                                selected="selected">Barcode
                                                        </option>
                                                        <option value="<?php echo ll_supported_barcode_provider_types::BADGE_TYPE_NFC; ?>">
                                                            NFC
                                                        </option>
                                                        <option value="<?php echo ll_supported_barcode_provider_types::BADGE_TYPE_ID; ?>">
                                                            ID
                                                        </option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="insert_badge_elements_div" style="padding-top: 0px;">
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <a href="javascript:void(0);"  id="insert_badge_elements">Insert related form fields</a>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_barcode_provider_types">
                                            <label>Scan Provider</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select name="barcode_provider_types"
                                                            data-placeholder="Select a provider">
                                                        <?php if (!empty($ll_supported_barcode_provider_types)) {
                                                            foreach ($ll_supported_barcode_provider_types as $ll_supported_barcode_provider_type) {
                                                                if ($ll_supported_barcode_provider_type->provider_alias == ll_supported_barcode_provider_types::$lead_liaison['alias']) {
                                                                    if (!ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::BADGES)) {
                                                                        continue;
                                                                    }
                                                                }
                                                                if ($ll_supported_barcode_provider_type->badge_type == ll_supported_barcode_provider_types::BADGE_TYPE_BARCODE) { ?>
                                                                    <option value="<?php echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; ?>"><?php echo $ll_supported_barcode_provider_type->provider_name; ?></option>
                                                                <?php
                                                                } ?>
                                                                <?php
                                                            }
                                                        }
                                                        ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_nfc_provider_types">
                                            <label>NFC Provider</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select name="nfc_provider_types"
                                                            data-placeholder="Select a provider">
                                                        <?php if (!empty($ll_supported_barcode_provider_types)) {
                                                            foreach ($ll_supported_barcode_provider_types as $ll_supported_barcode_provider_type) {
                                                                if ($ll_supported_barcode_provider_type->provider_alias == ll_supported_barcode_provider_types::$lead_liaison['alias']) {
                                                                    if (!ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::BADGES)) {
                                                                        continue;
                                                                    }
                                                                }
                                                                if ($ll_supported_barcode_provider_type->badge_type == ll_supported_barcode_provider_types::BADGE_TYPE_NFC) { ?>
                                                                    <option value="<?php echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; ?>"><?php echo $ll_supported_barcode_provider_type->provider_name; ?></option>
                                                                <?php
                                                                }?>
                                                                <?php
                                                            }
                                                        }
                                                        ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_id_provider_types">
                                            <label>ID Provider</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select name="id_provider_types"
                                                            data-placeholder="Select a provider">
                                                        <?php if (!empty($ll_supported_barcode_provider_types)) {
                                                            foreach ($ll_supported_barcode_provider_types as $ll_supported_barcode_provider_type) {
                                                                if ($ll_supported_barcode_provider_type->provider_alias == ll_supported_barcode_provider_types::$lead_liaison['alias']) {
                                                                    if (!ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::BADGES)) {
                                                                        continue;
                                                                    }
                                                                }
                                                                if ($ll_supported_barcode_provider_type->badge_type == ll_supported_barcode_provider_types::BADGE_TYPE_ID) { ?>
                                                                    <option value="<?php echo $ll_supported_barcode_provider_type->ll_supported_barcode_provider_type_id; ?>"><?php echo $ll_supported_barcode_provider_type->provider_name; ?></option>
                                                                <?php
                                                                }?>
                                                                <?php
                                                            }
                                                        }
                                                        ?>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="element_barcode_provider_type_authentication_info">

                                        </div>
                                        <div class="fb-field" id="element_barcode_type">
                                            <label>Barcode Type</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <select name="barcode_type">
                                                        <option value="" selected="selected">Default</option>
                                                        <option value="AZTEC">AZTEC</option>
                                                        <option value="CODABAR">CODABAR</option>
                                                        <option value="CODE_39">CODE 39</option>
                                                        <option value="CODE_93">CODE 93</option>
                                                        <option value="CODE_128">CODE 128</option>
                                                        <option value="DATA_MATRIX">DATA MATRIX</option>
                                                        <option value="EAN_8">EAN 8</option>
                                                        <option value="EAN_13">EAN 13</option>
                                                        <option value="ITF">ITF</option>
                                                        <option value="MSI">MSI</option>
                                                        <option value="PDF_417">PDF 417</option>
                                                        <option value="QR_CODE">QR CODE</option>
                                                        <option value="UPC_A">UPC A</option>
                                                        <option value="UPC_E">UPC E</option>
                                                        <option value="RSS14">RSS14</option>
                                                        <option value="RSS_EXPANDED">RSS EXPANDED</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <!--<div class="fb-field" id="insert_badge_elements_div">
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <a href="javascript:void(0);" class="t-btn-gray ll_std_tooltip tooltipstered" id="insert_badge_elements">Insert related form fields</a>
                                                </div>
                                            </div>
                                        </div>-->
                                        <div class="fb-field clearfix" id="element_is_edit_duplicates_after_scan"
                                             style="display: block;">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="is_edit_duplicates_after_scan"
                                                                           id="is_edit_duplicates_after_scan" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Edit duplicates after scan</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_age_verification">
                                            <label>Age Verification</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="is_enable_age_verification"
                                                                           id="is_enable_age_verification" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Age verification</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field age-verification">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <label style="padding-left: 0px;">
                                                        Show warning notification for people:
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field age-verification">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-checkbox">
                                                        <label>
                                                            <i class="icn-checkbox"></i>
                                                            <input name="is_enable_under_age_verification"
                                                                   id="is_enable_under_age_verification" value="1"
                                                                   type="checkbox"/>
                                                            <span>Younger than</span>
                                                        </label>
                                                    </div>
                                                    <input type="number" class="txt-field txt-field-tiny" name="verified-under-age" style="margin-left: 10px;"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field clearfix" id="under_age_verification_message_div">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <textarea class="txt-field" id="under_age_verification_message"></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field age-verification">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-checkbox">
                                                        <label>
                                                            <i class="icn-checkbox"></i>
                                                            <input name="is_enable_over_age_verification"
                                                                   id="is_enable_over_age_verification" value="1"
                                                                   type="checkbox"/>
                                                            <span>Older than</span>
                                                        </label>
                                                    </div>
                                                    <input type="number" class="txt-field txt-field-tiny" name="verified-over-age" style="margin-left: 28px;"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field clearfix" id="over_age_verification_message_div">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <textarea class="txt-field" id="over_age_verification_message"></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field age-verification">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-checkbox">
                                                        <label>
                                                            <i class="icn-checkbox"></i>
                                                            <input name="is_enable_age_range_verification"
                                                                   id="is_enable_age_range_verification" value="1"
                                                                   type="checkbox"/>
                                                            <span>Between</span>
                                                        </label>
                                                    </div>
                                                    <input type="number" class="txt-field txt-field-tiny" name="start-verified-age" style="margin-left: 40px;"/>
                                                    <span style="margin-left: 5px;">and</span>
                                                    <input type="number" class="txt-field txt-field-tiny" name="end-verified-age" style="margin-left: 5px;"/>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field clearfix" id="age_range_verification_message_div">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <textarea class="txt-field" id="age_range_verification_message"></textarea>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field age-verification">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-checkbox">
                                                        <label>
                                                            <i class="icn-checkbox"></i>
                                                            <input name="is_show_option_to_proceed"
                                                                   id="is_show_option_to_proceed" value="1"
                                                                   type="checkbox" checked/>
                                                            <span>Give option to proceed</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="fb-field clearfix fb-wrap-identifier" id="element_identifier" <?php if ($is_device_form){ ?>style="display: none;"<?php } ?> >
                                            <label>Identifier</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="eb-inner-field">
                                                        <div class="t-field">
                                                            <input type="text" disabled
                                                                   class="txt-field fb-identifier-input"
                                                                   value="Calculated_Question"/>
                                                        </div>
                                                        <div class="t-field fb-auto-identifier-section">
                                                            <a href="javascript:void(0);" class="fb-edit-identifier">use
                                                                custom identifier</a>
                                                        </div>
                                                        <div class="t-field fb-custom-identifier-section">
                                                            <a href="javascript:void(0);"
                                                               class="fb-cancel-edit-identifier">generate identifier
                                                                automatically</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix fb-wrap-visible" id="element_visible">
                                            <label>Visible</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-field">
                                                        <select class="fb-field-visible">
                                                            <option value="0">Always</option>
                                                            <option selected value="1">Only When...</option>
                                                        </select>
                                                    </div>
                                                    <div class="t-field fb-set-rule-link">
                                                        <a href="javascript:void(0);" class="fb-btn-set-rule">Set
                                                            Rule</a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_collapse_content">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            type="checkbox"
                                                                            name="collapse_content"><span>Collapse content</span></label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="container_element_css_class"
                                             <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                            <label><span class="fb-wrap-tooltip">Container CSS Class <span
                                                            class="fb-tooltip">CSS Class sets the CSS class that will be used on this <?php echo strtolower($form_lbl); ?> field container. Use this option to add your own custom styling to the field. The CSS class should be defined in your Layout Template. The CSS code can be embedded into your Layout Template or referenced in a file, which can be hosted in your Media Manager or on your own server.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field"
                                                           name="container_field_css_class"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="element_css_class"
                                             <?php if ($is_device_form){ ?>style="display:none;"<?php } ?>>
                                            <label><span class="fb-wrap-tooltip">CSS Class <span class="fb-tooltip">CSS Class sets the CSS class that will be used on this <?php echo strtolower($form_lbl); ?> field. Use this option to add your own custom styling to the field. The CSS class should be defined in your Layout Template. The CSS code can be embedded into your Layout Template or referenced in a file, which can be hosted in your Media Manager or on your own server.</span></span></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field" name="field_css_class"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field element_load_from_url">
                                            <label>
                                                        <span class="fb-wrap-tooltip">
                                                            Load from URL Param
                                                            <span class="fb-tooltip">
                                                                If set, the default value for the <?php echo strtolower($form_lbl); ?> field will be loaded from the query string parameter in the URL of the page containing the <?php echo strtolower($form_lbl); ?>. The value in this field should be the parameter name of the query string you'd like to use. For example, if the URL is http://domain.com/page.html?product=iMac&day=today, and the value you want to use to pre-fill the <?php echo strtolower($form_lbl); ?> field is iMac, then the parameter name would be product.
                                                                <br/><br/>If the value exists in the iframe URL it will be used. Otherwise, the value will be retrieved from the parent page URL.
                                                                <br/><br/>Both the Index and Param options may be used together. First, the system will look for the value in the query string parameter. If not found, the system will try to find the value from the index.
                                                            </span>
                                                        </span>
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="text" class="txt-field" name="element_url_parameter"
                                                           id="element_url_parameter"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field element_load_from_url">
                                            <label>
                                                        <span class="fb-wrap-tooltip">
                                                            Load from URL Index
                                                            <span class="fb-tooltip">
                                                                Enter a number to have the system use the value at this URL index level. If set, the default value for the <?php echo strtolower($form_lbl); ?> field will be loaded from the index level specified here in the URL of the page containing the <?php echo strtolower($form_lbl); ?>. The index level starts after the domain. For example, if the URL is http://www.domain.com/products/iPhone, domain.com is the domain, and products is at index level 1 and iPhone is at index level 2.
                                                            </span>
                                                        </span>
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <input type="number" class="txt-field" name="element_url_index"
                                                           id="element_url_index" min="0" max="100"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field" id="section_break_content">
                                            <a href="javascript:void(0);" class="t-btn-gray"
                                               id="section_break_content_popup">Add Custom Content</a>
                                        </div>
                                        <!-- <div class="fb-field clearfix" id="element_guidelines_for_user">
                                                    <label><span class="fb-wrap-tooltip">Guidelines for User <span class="fb-html-icn fb-html-icn-section-break ll-show-popup"  data-id-box="fb-html-seaction-break" data-show-popup="popup-advanced-editor"></span> <span class="fb-tooltip">This text will be displayed to your users while they're filling out the field. If you're using HTML code the <?php echo strtolower($form_lbl); ?> designer will not render the code properly. Preview the <?php echo strtolower($form_lbl); ?> to see how the HTML will be rendered in a browser.</span></span></label>
                                                    <div class="fb-right">
                                                        <div class="eb-inner-field">
                                                            <textarea class="txt-field" name="field_guidelines"></textarea>
                                                        </div>
                                                    </div>
                                                </div> -->
                                        <div class="fb-field clearfix" id="element_is_filled_from_barcode"
                                             style="display: none;">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label><i class="icn-checkbox"></i><input
                                                                            name="is_filled_from_barcode"
                                                                            type="checkbox">Filled from Barcode</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_common_map_rules">
                                            <label>Map Rules</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-map-rules">
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side.</span></span></span>
                                                            <select class="mapping_fields" id="common_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option value="0"></option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_name_map_rules">
                                            <label>Map Rules</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-map-rules">
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map First Name to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'First'.</span></span></span>
                                                            <select class="mapping_fields" id="first_name_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option value="0"></option>
                                                            </select>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Last Name to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Last'.</span></span></span>
                                                            <select class="mapping_fields" id="last_name_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option value="0"></option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_address_map_rules">
                                            <label>Map Rules</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-map-rules">
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Street Address to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Street Address'.</span></span></span>
                                                            <select class="mapping_fields" id="address1_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option></option>
                                                            </select>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Address Line 2 to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Address Line 2'.</span></span></span>
                                                            <select class="mapping_fields" id="address2_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option></option>
                                                            </select>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map City to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'City'.</span></span></span>
                                                            <select class="mapping_fields" id="city_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option></option>
                                                            </select>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map State / Province / Region to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'State / Province / Region'.</span></span></span>
                                                            <select class="mapping_fields" id="state_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option></option>
                                                            </select>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Zip / Postal Code to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Zip / Postal Code'.</span></span></span>
                                                            <select class="mapping_fields" id="zipcode_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option></option>
                                                            </select>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Country to Lead Liaison Field <span
                                                                            class="fb-tooltip">Select which Lead Liaison field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Country'.</span></span></span>
                                                            <select class="mapping_fields" id="country_mapping_field"
                                                                    data-placeholder="Select Field">
                                                                <option></option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_sfmc_map_rules">
                                            <label class="ll_std_tooltip"
                                                   title="Salesforce.com Marketing Cloud Data Extension mapping. In Marketing Cloud, enter the value from the Name column in your Data Extension. The value from the form will be pushed to this field in the Data Extension.">
                                                DE Mapping
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-field">
                                                        <input type="text" class="txt-field" name="sfmc_mapping_field"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_name_sfmc_map_rules">
                                            <label class="ll_std_tooltip"
                                                   title="Salesforce.com Marketing Cloud Data Extension mapping. In Marketing Cloud, enter the value from the Name column in your Data Extension. The value from the form will be pushed to this field in the Data Extension.">
                                                DE Mapping
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-map-rules">
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map First Name to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'First'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="first_name_sfmc_mapping_field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Last Name to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Last'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="last_name_sfmc_mapping_field"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_address_sfmc_map_rules">
                                            <label class="ll_std_tooltip"
                                                   title="Salesforce.com Marketing Cloud Data Extension mapping. In Marketing Cloud, enter the value from the Name column in your Data Extension. The value from the form will be pushed to this field in the Data Extension.">
                                                DE Mapping
                                            </label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-map-rules">
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Street Address to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Street Address'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="address1_sfmc_mapping_field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Address Line 2 to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Address Line 2'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="address2_sfmc_mapping_field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map City to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'City'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="city_sfmc_mapping_field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map State / Province / Region to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'State / Province / Region'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="state_sfmc_mapping_field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Zip / Postal Code to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC field to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Zip / Postal Code'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="zipcode_sfmc_mapping_field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <span class="label-top"><span class="fb-wrap-tooltip">Map Country to SFMC Field <span
                                                                            class="fb-tooltip">Select which SFMC to map to the <?php echo strtolower($form_lbl); ?> field at the left side with label 'Country'.</span></span></span>
                                                            <input type="text" class="txt-field"
                                                                   name="country_sfmc_mapping_field"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_override_if_empty">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="override_if_empty"
                                                                           id="override_if_empty" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Update if empty</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_process_data_type">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label>
                                                                    <i class="icn-radio"></i>
                                                                    <input name="process_data_type"
                                                                           value="<?php echo form::DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY; ?>"
                                                                           type="radio"/>
                                                                    <span>Update if empty</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label>
                                                                    <i class="icn-radio"></i>
                                                                    <input name="process_data_type"
                                                                           value="<?php echo form::DATA_PROCESS_TYPE_OVERRIDE; ?>"
                                                                           type="radio"/>
                                                                    <span>Override</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label>
                                                                    <i class="icn-radio"></i>
                                                                    <input name="process_data_type"
                                                                           value="<?php echo form::DATA_PROCESS_TYPE_MERGE; ?>"
                                                                           type="radio"/>
                                                                    <span>Merge</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix"
                                             id="element_ll_single_field_process_type_container"
                                             style="display: none; margin-top: -45px;">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="element_ll_single_field_process_type"
                                                                            id="element_ll_single_field_process_type_merge"
                                                                            value="<?php echo form::LL_SINGLE_FIELD_PROCESS_TYPE_MERGE; ?>"
                                                                            type="radio" checked="checked"><span
                                                                            class="fb-wrap-tooltip">Merge<span
                                                                                class="fb-tooltip">The submitted data will be merged with the existing Prospect data.</span></span></label>

                                                            </div>
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="element_ll_single_field_process_type"
                                                                            id="element_ll_single_field_process_type_override"
                                                                            value="<?php echo form::LL_SINGLE_FIELD_PROCESS_TYPE_OVERRIDE; ?>"
                                                                            type="radio"><span class="fb-wrap-tooltip">Override<span
                                                                                class="fb-tooltip fb-pull-right">The submitted data will override the existing Prospect data.</span></span></label>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_audio_transcription"
                                             style="display: block;">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-checkbox">
                                                                <label>
                                                                    <i class="icn-checkbox"></i>
                                                                    <input name="enable_audio_transcription"
                                                                           id="enable_audio_transcription" value="1"
                                                                           type="checkbox"/>
                                                                    <span>Transcribe Audio</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix" id="element_audio_transcription_type"
                                             style="display: none;">
                                            <label>Transcription Type</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio ll_std_tooltip"
                                                                 title="The recording is run through advanced transcription software. This software is more accurate than most speech to text programs found on mobile devices. Unlike those programs, it is not trying to transcribe in real time, and as a result is significantly better at proper grammar and punctuation. Most transcriptions will take 5-10 minutes, but may take longer depending on the length of the recording. Use this option for single-person recordings and general note taking.">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="audio_transcription_type"
                                                                            value="<?php echo LL_AudioTranscription_Manager::STANDARD_TYPE; ?>"
                                                                            type="radio"
                                                                            checked="checked">Standard</label>
                                                            </div>
                                                            <div class="t-radio ll_std_tooltip"
                                                                 title="The recording is transcribed by a dedicated transcription specialist. Because a human is transcribing the audio, they can ensure the transcription has completely accurate grammar and punctuation. They can also identify multiple people, so this option is great for recording full conversations in addition to longer notes. Use this option for the best accuracy, multi-person conversations, or situations with extreme background noise.">
                                                                <label><i class="icn-radio"></i><input
                                                                            name="audio_transcription_type"
                                                                            value="<?php echo LL_AudioTranscription_Manager::PREMIUM_TYPE; ?>"
                                                                            type="radio">Premium</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix element_audio_transcription_options"
                                             style="display: none;">
                                            <label>Update Field</label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="t-field">
                                                        <select id="audio_transcription_update_field"
                                                                data-placeholder="--- Select Field ---">
                                                            <option value="">--- Select Field ---</option>
                                                            <?php
                                                            foreach ($text_fields as $field_id => $field_name) {
                                                                echo '<option value="' . $field_id . '">' . $field_name . '</option>';
                                                            }
                                                            ?>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix"
                                             id="audio_transcription_update_field_process_type" style="display: none;">
                                            <label></label>
                                            <div class="fb-right">
                                                <div class="eb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label>
                                                                    <i class="icn-radio"></i>
                                                                    <input name="update_field_process_type"
                                                                           value="<?php echo form::DATA_PROCESS_TYPE_OVERRIDE_IF_EMPTY; ?>"
                                                                           type="radio"/>
                                                                    <span>Update if empty</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label>
                                                                    <i class="icn-radio"></i>
                                                                    <input name="update_field_process_type"
                                                                           value="<?php echo form::DATA_PROCESS_TYPE_OVERRIDE; ?>"
                                                                           type="radio"/>
                                                                    <span>Override</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label>
                                                                    <i class="icn-radio"></i>
                                                                    <input name="update_field_process_type"
                                                                           value="<?php echo form::DATA_PROCESS_TYPE_MERGE; ?>"
                                                                           type="radio" checked="checked"/>
                                                                    <span>Merge</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-content fb-form-style">
                                    <?php if (!$is_device_form) { ?>
                                        <div id="element_label_style">
                                            <div class="fb-design-head">Label Style</div>
                                            <div class="fb-field clearfix">
                                                <label>Font</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-label-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70  fb-label-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;" class="color-box fb-label-color" data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix" id="element_lable_style_position">
                                                <label>Position</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <select class="fb-w160 fb-label-pos">
                                                            <option value="None">None</option>
                                                            <option value="0">Top</option>
                                                            <option value="1">Side</option>
                                                            <option value="2">Inside</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field fb-field-label-width">
                                                        <label>Padding</label>
                                                        <input type="text" class="txt_field txt-field-label-width"
                                                               value="16"/>
                                                        <span class="fb-per-label-width">%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="element_sub_labels_style" style="display: none;">
                                            <div class="fb-design-head">Sub Label Style</div>
                                            <div class="fb-field clearfix">
                                                <label>Font</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-sub-label-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70  fb-sub-label-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #666666;"
                                                                 class="color-box fb-sub-label-color"
                                                                 data-color-start="666666"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="element_required_field_hint_style" style="display: none;">
                                            <div class="fb-design-head">Required Field Hint</div>
                                            <div class="fb-field clearfix">
                                                <label>Font</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-required-field-hint-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans" selected>None
                                                            </option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70  fb-required-field-hint-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #968e8e;"
                                                                 class="color-box fb-required-field-hint-color"
                                                                 data-color-start="968e8e"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="element_choices_style">
                                            <div class="fb-design-head not_first_child_fb_design">Choices Style</div>
                                            <div class="fb-field clearfix">
                                                <label>Font</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-choice-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70  fb-choice-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-choice-color"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="element_choices_survey_style">
                                            <div class="fb-field clearfix">
                                                <label>Background Color</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #ffffff;"
                                                                 class="color-box fb-choice-survey-bg-color"
                                                                 data-color-start="ffffff"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Border Color</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #c9c9c9;"
                                                                 class="color-box fb-choice-survey-border-color"
                                                                 data-color-start="c9c9c9"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Selected Background Color</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #c9c9c9;"
                                                                 class="color-box fb-choice-survey-selected-bg-color"
                                                                 data-color-start="c9c9c9"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Selected Border Color</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #c9c9c9;"
                                                                 class="color-box fb-choice-survey-selected-border-color"
                                                                 data-color-start="c9c9c9"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Selected Font Color</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-choice-survey-selected-font-color"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-design-head not_first_child_fb_design">Hints Style</div>
                                            <div class="fb-field clearfix">
                                                <label>Left Hint</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-choice-hint-left-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70 fb-choice-hint-left-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-choice-hint-left-color"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Right Hint</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-choice-hint-right-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70  fb-choice-hint-right-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-choice-hint-right-color"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="element_field_style">
                                            <div class="fb-design-head not_first_child_fb_design">Field Style</div>
                                            <div class="fb-field clearfix">
                                                <label>Background</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-field-background"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field">
                                                <label>Border Radius</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="input-group bootstrap-touchspin">
                                                                    <span class="input-group-btn">
                                                                        <button class="btn btn-default bootstrap-touchspin-down"
                                                                                type="button">-</button>
                                                                    </span>
                                                            <span class="input-group-addon bootstrap-touchspin-prefix"
                                                                  style="display: none;"></span>
                                                            <input type="text" name="field_border_radius"
                                                                   class="txt_field touch-spin fb-field-small form-control"
                                                                   value="4" style="display: block;">
                                                            <span class="input-group-addon bootstrap-touchspin-postfix"
                                                                  style="display: none;"></span>
                                                            <span class="input-group-btn"><button
                                                                        class="btn btn-default bootstrap-touchspin-up"
                                                                        type="button">+</button></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field">
                                                <label>Border</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Type</label>
                                                        <select class="fb-w160 fb-field-border-type">
                                                            <option value="None">None</option>
                                                            <option value="Solid">Solid</option>
                                                            <option value="Dashed">Dashed</option>
                                                            <option value="Dotted">Dotted</option>
                                                            <option value="Double">Double</option>
                                                            <option value="Groove">Groove</option>
                                                            <option value="Ridge">Ridge</option>
                                                            <option value="Inset">Inset</option>
                                                            <option value="Outset">Outset</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <input id="" type="text"
                                                               class="txt_field touch-spin fb-field-border-width fb-field-small"
                                                               value="0"/>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label class="eb-text-center">Color</label>
                                                        <div class="wrap-color">
                                                            <div style="background-color: #ffffff;"
                                                                 class="color-box fb-field-border-color"
                                                                 data-color-start="ffffff"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Font</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-field-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70 fb-field-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-field-color"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div id="drop_down_custom_style">
                                            <div class="fb-design-head not_first_child_fb_design">Drop Down Style</div>
                                            <div class="fb-field clearfix">
                                                <label>Background</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-dropdown-background"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field">
                                                <label>Border Color</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label class="eb-text-center">Color</label>
                                                        <div class="wrap-color">
                                                            <div style="background-color: #ffffff;"
                                                                 class="color-box fb-dropdown-border-color"
                                                                 data-color-start="ffffff"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field">
                                                <label>Border Radius</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <div class="input-group bootstrap-touchspin">
                                                                <span class="input-group-btn">
                                                                    <button class="btn btn-default bootstrap-touchspin-down"
                                                                            type="button">-</button>
                                                                </span>
                                                            <span class="input-group-addon bootstrap-touchspin-prefix"
                                                                  style="display: none;"></span>
                                                            <input type="text" name="dropdown_border_radius"
                                                                   class="txt_field touch-spin fb-field-small form-control"
                                                                   value="4" style="display: block;">
                                                            <span class="input-group-addon bootstrap-touchspin-postfix"
                                                                  style="display: none;"></span>
                                                            <span class="input-group-btn"><button
                                                                        class="btn btn-default bootstrap-touchspin-up"
                                                                        type="button">+</button></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="fb-field clearfix">
                                                <label>Font</label>
                                                <div class="fb-right">
                                                    <div class="fb-inner-field">
                                                        <label>Typeface</label>
                                                        <select class="fb-w130 fb-dropdown-font cf-select-font-name">
                                                            <option standard_font='1' value="Open Sans">None</option>
                                                            <option standard_font='1' value="Arial">Arial</option>
                                                            <option standard_font='1' value="Comic Sans MS">Comic Sans
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Courier New">Courier New
                                                            </option>
                                                            <option standard_font='1' value="Georgia">Georgia</option>
                                                            <option standard_font='1' value="Lucida Sans Unicode">
                                                                Lucida
                                                            </option>
                                                            <option standard_font='1' value="Tahoma">Tahoma</option>
                                                            <option standard_font='1' value="Times New Roman">Times New
                                                                Roman
                                                            </option>
                                                            <option standard_font='1' value="Trebuchet MS">Trebuchet
                                                                MS
                                                            </option>
                                                            <option standard_font='1' value="Verdana">Verdana</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <label>Size</label>
                                                        <select class="fb-w70 fb-dropdown-size">
                                                            <option value="None">None</option>
                                                            <option value="9">9px</option>
                                                            <option value="10">10px</option>
                                                            <option value="11">11px</option>
                                                            <option value="12">12px</option>
                                                            <option value="13">13px</option>
                                                            <option value="14" selected>14px</option>
                                                            <option value="16">16px</option>
                                                            <option value="18">18px</option>
                                                            <option value="20">20px</option>
                                                            <option value="22">22px</option>
                                                            <option value="24">24px</option>
                                                            <option value="26">26px</option>
                                                            <option value="28">28px</option>
                                                            <option value="30">30px</option>
                                                            <option value="36">36px</option>
                                                            <option value="48">48px</option>
                                                            <option value="64">64px</option>
                                                        </select>
                                                    </div>
                                                    <div class="fb-inner-field">
                                                        <div class="wrap-color">
                                                            <div style="background-color: #333333;"
                                                                 class="color-box fb-dropdown-color"
                                                                 data-color-start="333333"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php } else { ?>
                                        <div class="fb-design-head options-style" style="display: none">Options View</div>
                                        <div class="fb-field clearfix options-style" style="display: none">
                                            <label>Underline</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i>
                                                                <input type="checkbox"
                                                                       name="options_underline">
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix options-style" style="display: none">
                                            <label>Full width text</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i>
                                                                <input type="checkbox"
                                                                       name="options_full_width_text">
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix options-style" style="display: none">
                                            <label>Italicize</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i>
                                                                <input type="checkbox"
                                                                       name="options_italicize">
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix options-style" style="display: none">
                                            <label>Use theme color</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-checkbox">
                                                            <label><i class="icn-checkbox"></i>
                                                                <input type="checkbox" id="options_use_theme_color"
                                                                       name="options_use_theme_color">
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix use-theme-style" style="display: none">
                                            <label>Use Theme Style</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="ll-switch switch-small">
                                                        <div class="switch">
                                                            <input id="is_use_theme_style" name="is_use_theme_style"
                                                                   class="cmn-toggle cmn-toggle-round" type="checkbox"/>
                                                            <label for="is_use_theme_style"></label>
                                                        </div>
                                                        <div class="ll-switch-lb"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix element-style">
                                            <label>Background Color</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="element_background_color" class="color-box"
                                                             call-back="1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix element-style" id="style_text_color">
                                            <label>Text Color</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="element_text_color" class="color-box"
                                                             call-back="1"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="fb-field clearfix options-style options-style-vertical-alignment" style="display: none">
                                            <label class="ll_std_tooltip"
                                                   title="Moves the circle to the top, middle, or bottom relative to the text. When using top and bottom users will need to select the circle to pick an option. In other words, tapping on the text will only select the option when middle is selected for this setting.">
                                                Vertical alignment</label>
                                            <div class="fb-right">
                                                <div class="fb-inner-field">
                                                    <div class="fb-checkboxes-wrap">
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input name="options_vertical_alignment"
                                                                                                       value="top"
                                                                                                       type="radio">
                                                                    <span class="fb-wrap-tooltip">Top
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input name="options_vertical_alignment"
                                                                                                       value="middle"
                                                                                                       type="radio">
                                                                    <span class="fb-wrap-tooltip">Middle
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="t-radio">
                                                                <label><i class="icn-radio"></i><input name="options_vertical_alignment"
                                                                                                       value="bottom"
                                                                                                       type="radio">
                                                                    <span class="fb-wrap-tooltip">Bottom
                                                                    </span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    <?php } ?>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="unsplash-right-panel">
                <div class="title">Free Images (Unsplash)
                    <a href="javascript:void(0);" class="t-btn-gray" id="close_unsplash-right-panel">Close</a></div>
                <div class="conetnt">
                    <div class="search-box field" id="pb-search-input-free">
                        <input type="text" class="txt-field pb-input-free-images" placeholder="Search">
                        <i class="icn-search"></i>
                    </div>
                    <div class="list-free-images">
                        <ul>

                        </ul>
                        <div class="pb-more-free-images t-btn-gray">Load more</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div id="preview-panel" class="form-editor form-layout-preview preview_mode" style="display: none;">
        <div class="wrap-preview-col ui-resizable" style="right: 926.5px;">
            <div class="resize-col"></div>
            <div class="preview-col">
                <iframe class="eb-wrap-email-page" id="iframe_preview_preview_container" src=""></iframe>
            </div>
            <div class="ui-resizable-handle ui-resizable-e"></div></div>
        <div class="tool-col" style="width: 926.5px;">
            <div class="eb-inner-tool">
                <div class="mobile-preview-wrap">
                    <div class="mobile-preview-inner">
                        <div class="mobile-preview">
                            <div class="mp-content">
                                <iframe id="mobile-preview-content" class="preview-frame" src=""></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="form_html_temp"></div>
<div class="ll-popup" id="popup-advanced-editor">
    <div class="ll-popup-head">Advanced Editor</div>
    <div class="ll-popup-content">
        <textarea id="advanced-editor"></textarea>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0);" class="t-btn-gray ll-close-popup" id="close_advanced_editor_popup">Cancel</a>
        <a href="javascript:void(0);" class="t-btn-orange ll-close-popup fb-btn-save-advanced-editor">Save</a>
    </div>
</div>
<div class="ll-popup" id="ll_popup_manage_form_settings">
    <div class="ll-popup-head">Settings</div>
    <div class="ll-popup-content">
        <div class="form">
            <?php
            if ($is_device_form) {
                ?>
                <!--<div class="t-field ll-line-field">
                        <div class="label"><label>Archive Date</label></div>
                        <input type="text" name="device_forms_archive_date" value="<?php /*echo $archive_date;*/
                ?>" readonly="readonly" class="txt-field"/>
                    </div>-->
                <?php
            }
            ?>
            <?php
            //if($is_device_form && ! empty($customer_groups) && count($customer_groups) > 1){
            if ($is_device_form) {
                ?>
                <div class="t-field ll-line-field" style="display: none;">
                    <div class="label"><label>Group(s)</label></div>
                    <select multiple name="device_forms_groups">
                        <option value=""></option>
                        <?php
                        foreach ($customer_groups as $customer_group) {
                            $selected = '';
                            if (array_key_exists($customer_group->ll_customer_group_id, $form_groups)) {
                                $selected = 'selected="selected"';
                            }
                            ?>
                            <option value="<?php echo $customer_group->ll_customer_group_id; ?>" <?php echo $selected; ?>><?php echo $customer_group->group_name; ?></option>
                            <?php
                        }
                        ?>
                    </select>
                </div>
                <?php
            }
            ?>
            <div class="t-field ll-line-field">
                <div class="label"><label>Save To</label></div>
                <div class="choose-folder" data-id="<?php echo $folder['folderID']; ?>">
                    <input type="text" class="txt-field choose-path" value="<?php echo $folder['folderPath']; ?>"
                           readonly/>
                    <a href="javascript:void(0)" class="t-btn-gray">Choose</a>
                </div>
            </div>
            <div class="t-field ll-line-field">
                <?php
                if ($is_device_form && !empty($customer_groups) && count($customer_groups) > 1) {
                    ?>
                    <div class="label"><label></label></div>
                    <?php
                }
                ?>
                <div class="ll-switch switch-small">
                    <div class="switch">
                        <input id="add_new_fields_to" name="add_new_fields_to" class="cmn-toggle cmn-toggle-round"
                               type="checkbox"/>
                        <label for="add_new_fields_to"></label>
                    </div>
                    <div class="ll-switch-lb">Add new fields to the top of the form</div>
                </div>
            </div>
        </div>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0)" id="ll_popup_manage_manage_form_settings_cancel" class="t-btn-gray ll-close-popup">Cancel</a>
        <a href="javascript:void(0)" id="ll_popup_manage_manage_form_settings_save" class="t-btn-orange ll-close-popup">Save</a>
    </div>
</div>

<div class="ll-popup" id="ll_popup_add_station">
    <div class="ll-popup-head">
        Stations
    </div>
    <div class="ll-popup-content">
        <div class="form lines fb-multiple-field ui-sortable">

        </div>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0);" class="t-btn-green btn-sort-station-popup" style="float: left;">Sort</a>
        <a href="javascript:void(0);" class="t-btn-gray btn-cancel-add-station-popup">Cancel</a>
        <a href="javascript:void(0);" class="t-btn-orange btn-save-add-station-popup">Save</a>
    </div>
</div>

<div class="ll-popup" id="ll_popup_manage_confirm_exit">
    <div class="ll-popup-head">Confirmation</div>
    <div class="ll-popup-content">
        <div class="form">
            <div class="t-field ll-line-field">
                <div class="style-text" id="container_email_lock_status">
                    Are you sure you want to exit? Any unsaved changes will be lost!
                    <input type="hidden" id="ll_popup_manage_confirm_exit_url"/>
                </div>
            </div>
        </div>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0)" id="ll_popup_manage_confirm_exit_cancel"
           class="t-btn-gray ll-close-popup t-btn-left">Cancel</a>
        <a href="javascript:void(0)" id="ll_popup_manage_confirm_exit_go" class="t-btn-gray ll-close-popup">Exit</a>
        <a href="javascript:void(0)" id="ll_popup_manage_confirm_exit_save_and_exit"
           class="t-btn-orange ll-close-popup">Save and Exit</a>
    </div>
</div>
<div class="ll-popup ll-popup-wide" id="set_visible_rules_popup">
    <div class="ll-popup-head">Conditions</div>
    <div class="ll-popup-content">
        <div id="rows">
            <div class="fb-align-row clearfix">
                <div class="fb-align-item">
                    <label>Choose Conditions:</label>
                </div>
                <div class="fb-align-item fb-item-select">
                    <select class="fb-choose-form-field" data-placeholder="Choose Field...">
                    </select>
                </div>
                <div class="fb-align-item fb-item-select">
                    <select class="fb-has-value" data-placeholder="Choose Condition...">
                        <option value="0"></option>
                        <option value="has_value">Has a Value</option>
                        <option value="is_blank">Is Blank</option>
                        <option value="contains">Contains</option>
                        <option value="doesnot_contain">Does not Contain</option>
                        <option value="equals">Equals</option>
                        <option value="not_equal">Does not Equal</option>
                    </select>
                </div>
                <div class="fb-align-item fb-item-input">

                </div>
                <div class="fb-align-item fb-import-data-source t-actions-dropdown t-actions-dropdown-orange">
                    <a href="javascript:void(0);" class="icon"></a>
                    <div class="ll-actions-dropdown">
                        <ul class="parent">
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <a href="javascript:void(0)" class="t-btn-gray fb-btn-add-condition">Add Condition</a>
        <div class="default_value_when_matching_conditions">
            <div class="form">
                <div class="t-field ll-line-field">
                    <div class="label label-left label-very-wide"><label>Default value when conditions match</label>
                    </div>
                    <div class="t-radio inline">
                        <label><i class="icn-radio"></i><input type="radio"
                                                               name="default_value_when_matching_conditions" value="1">Checked</label>
                    </div>
                    <div class="t-radio inline">
                        <label><i class="icn-radio"></i><input type="radio"
                                                               name="default_value_when_matching_conditions" value="0">Unchecked</label>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0)" id="cancel_set_visible_rules_popup" class="t-btn-gray ll-close-popup">Cancel</a>
        <a href="javascript:void(0)" id="save_element_visible_rules" class="t-btn-orange ll-close-popup">Save</a>
    </div>
</div>
<div class="ll-popup" id="ll_popup_edit_element_choices">
    <div class="ll-popup-head">Enter Choices</div>
    <div class="ll-popup-content">
        <div class="form">
            <div class="t-field ll-line-field">
                <div class="label"><label>Choices</label></div>
                <textarea class='txt-field' id="textarea_edit_element_choices"></textarea>
                <span class="hint popup-hint">Enter separate values on a new line</span>
            </div>
        </div>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0)" id="ll_popup_edit_element_choices_cancel"
           class="t-btn-gray ll-close-popup">Cancel</a>
        <a href="javascript:void(0)" id="ll_popup_edit_element_choices_save" class="t-btn-orange">Save</a>
    </div>
</div>
<div class="ll-popup" id="popup-instructions-editor">
    <div class="ll-popup-head">Instructions</div>
    <div class="ll-popup-content">
        <div class="t-field ll-line-field">
                <textarea id="instructions-editor">
                 <?php if ($instructions_content) {
                     //echo $instructions_content;
                 } ?>
                </textarea>
        </div>
        <div class="t-field ll-line-field">
            <div class="ll-switch switch-small">
                <div class="switch">
                    <input id="is_enforce_instructions_initially" name="is_enforce_instructions_initially"
                           class="cmn-toggle cmn-toggle-round" type="checkbox"
                        <?php
                        if ($is_enforce_instructions_initially) {
                            echo 'checked="checked"';
                        }
                        ?>
                    />
                    <label for="is_enforce_instructions_initially"></label>
                </div>
                <div class="ll-switch-lb">Display on initial open</div>
            </div>
        </div>
        <div class="t-field ll-line-field">
            <div class="ll-switch switch-small">
                <div class="switch">
                    <input id="is_instructions_webview" name="is_instructions_webview"
                           class="cmn-toggle cmn-toggle-round" type="checkbox"
                        <?php
                        if ($is_instructions_webview) {
                            echo 'checked="checked"';
                        }
                        ?>
                    />
                    <label for="is_instructions_webview"></label>
                </div>
                <div class="ll-switch-lb">Show in webview</div>
            </div>
        </div>
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0);" class="t-btn-gray ll-close-popup" id="close_instructions_editor_popup">Cancel</a>
        <a href="javascript:void(0);" class="t-btn-orange ll-close-popup" id="fb-btn-save-instructions-editor">Save</a>
    </div>
</div>
<div class="ll-popup" id="popup-transcription-notes-editor">
    <div class="ll-popup-head">Transcription Notes</div>
    <div class="ll-popup-content">
        <div class="t-field ll-line-field">
                <textarea id="transcription-notes-editor">
                </textarea>
        </div>
        <!--<div class="t-field ll-line-field">
                <div class="ll-switch switch-small">
                    <div class="switch">
                        <input id="is_enforce_instructions_initially" name="is_enforce_instructions_initially" class="cmn-toggle cmn-toggle-round" type="checkbox"
                            <?php
        /*                            if($is_enforce_instructions_initially) { echo 'checked="checked"' ;}
                            */ ?>
                        />
                        <label for="is_enforce_instructions_initially"></label>
                    </div>
                    <div class="ll-switch-lb">Display on initial open</div>
                </div>
            </div>-->
    </div>
    <div class="ll-popup-footer clearfix">
        <a href="javascript:void(0);" class="t-btn-gray ll-close-popup" id="close_transcription_notes_editor_popup">Cancel</a>
        <a href="javascript:void(0);" class="t-btn-orange ll-close-popup" id="fb-btn-save-transcription-notes-editor">Add</a>
    </div>
</div>

<?php
$popup_options = array('selector_type' => 'prospects', 'page_manager_identifier' => 'smartpage', 'grid_identifier' => '');
ll_common_popups_manager::ll_render_popup(ll_common_popups_manager::POPUP_IDENTIFIER_LL_COLUMN_FIELD_SELECTOR, $popup_options);
?>
<?PHP
include 'folder-managment-panel.php';
LL_Database::mysql_close();
include "footer-bottom.php";
?>
</body>
</html>