<?PHP
include_once 'page_settings_constants.php';
define ( 'VERY_TOP_MENU', VERY_TOP_MENU_LL_EMAIL_BUILDER_ADVANCED_BUILD );
define ( 'TOP_MENU', '' );
define ( 'LEFT_MENU', '' );
define ( 'SUB_TOP_MENU', '' );
define ( 'WINDOW_TITLE', 'Setup Email Campaign' );
define ( 'PAGE_TITLE', 'Setup Email Campaign' );
SetHelpTileAndBody ();

include "cachecontrol.php";
require_once ("mysql_connect.php"); // connect to the db
include "configuration.inc";
require_once ("passport.php"); // connect to the db
require_once 'DAL/customer_general_settings.php';
require_once 'DAL/ll_s3_buckets.php';
require_once 'DAL/ll_users.php';
require_once 'DAL/ll_campaigns.php';
require_once 'DAL/ll_file_uploads.php';
require_once 'webforms/DAL/customer_subdomains.php';
require_once 'webforms/DAL/landing_page.php';
require_once 'DAL/EM/ll_emails_manager.php';
require_once 'LLConnector/ConnectorService.php';
require_once 'LL_CRM/LL_CRM_Manager.php';

$userID = intval ( $_COOKIE ["userID_ck"] );
$customerID = intval ( $_COOKIE ["customerID_ck"] );

$newsletterid = intval ( $_GET ["newsletterid"] );
$templateid = intval ( $_GET ["templateid"] );
$ll_campaign_id = intval ( $_GET ["ll_campaign_id"] );
$window_lock_token = trim($_GET['window_lock_token']);
$theme_color = ll_private_labels_manager::get_branding_theme_color ($customerID);

$connector = new Connector ( $customerID, '', false );
if (!$connector->connectorUserID) {
	header ( "location: notauthorized.php" );
	exit ();
}

$ll_email_type = ll_emails_manager::LL_EMAIL_TYPE_MARKETING;
$email_object = null;
$email_newsletters = new email_newsletters();
if($newsletterid){
	$email_newsletters = new email_newsletters($connector->connectorUserID, $newsletterid);
	if(!$email_newsletters->newsletterid){
		header ('Location: message.php?Invalid Email Campaign');
		exit ();
	}
	$ll_email_type = $email_newsletters->ll_email_type;
	$ll_campaign_id = $email_object->ll_campaign_id;
	$email_object = $email_newsletters;
} else if ($templateid){
	$email_templates = new email_templates($connector->connectorUserID, $templateid);
	if(!$email_templates->templateid){
		header ('Location: message.php?Invalid Email Template');
		exit ();
	}
	$email_object = $email_templates;
	$ll_email_type = $email_object->ll_email_type;
} else if ($ll_campaign_id) {
	$email_newsletters = new email_newsletters();
	$email_newsletters->load_by_campaign_id($connector->connectorUserID, $ll_campaign_id);
	if ($email_newsletters->newsletterid) {
		header ('Location: ll-email-builder-advanced-setup.php?newsletterid=' . $email_newsletters->newsletterid);
		exit ();
	} else {
		header ('Location: message.php?Invalid Email Campaign');
		exit ();
	}
} else {
	header ('Location: message.php?Invalid Email Campaign');
	exit ();
}
if($email_newsletters && $email_newsletters->newsletterid && $email_newsletters->ll_email_build_type != ll_emails_manager::LL_EMAIL_TYPE_START_WITH_TEMPLATE_ID){
	header ('Location: ll-email-builder-setup.php?newsletterid=' . $email_newsletters->newsletterid );
	exit ();
} else if($email_templates && $email_templates->templateid && $email_templates->ll_email_build_type != ll_emails_manager::LL_EMAIL_TYPE_START_WITH_TEMPLATE_ID){
	header ('Location: ll-email-builder-setup.php?templateid=' . $email_templates->templateid );
	exit ();
}


/**
 * If no window lock token available
 * Or if there is window lock token, which is used as the lock token but for a different user
 * Then generate a window lock token, and redirect the user again.
 */
if(!$window_lock_token || ($email_object->locked_by_ll_userID && $email_object->lock_token && $window_lock_token == $email_object->lock_token && $email_object->locked_by_ll_userID != $userID ) ){
	$window_lock_token = generateRnadomToken ( 16 );
	if($email_newsletters && $email_newsletters->newsletterid){
		header ("Location: ll-email-builder-advanced-setup.php?newsletterid={$email_newsletters->newsletterid}&window_lock_token={$window_lock_token}" );
		exit ();
	} else if($email_templates && $email_templates->templateid){
		header ("Location: ll-email-builder-advanced-setup.php?templateid={$email_templates->templateid}&window_lock_token={$window_lock_token}" );
		exit ();
	}
}

$all_tokens_info = $connector->load_custom_tokens();
/*
$dynamic_contents_settings = $connector->load_dynamic_content_settings();
$dynamic_contents = ( $dynamic_contents_settings['access'] && $dynamic_contents_settings['dynamic_contents']['item'] ) ? $dynamic_contents_settings['dynamic_contents']['item'] : array();
*/

$customer_content_management_settings = customer_general_settings::load_customer_content_management_settings ( $customerID );
if ($customer_content_management_settings ['ll_s3_bucket_id']){
	$ll_s3_bucket_id = $customer_content_management_settings ['ll_s3_bucket_id'];
	$ll_s3_bucket = new ll_s3_buckets ( $ll_s3_bucket_id );
	if ($ll_s3_bucket->ll_s3_bucket_id && $ll_s3_bucket->bucket_name && $ll_s3_bucket->bucket_access_key_id && $ll_s3_bucket->bucket_secret_access_key && $ll_s3_bucket->is_active) {
		$MEDIA_MANAGER_ENABLED = true;
	} else {
		$MEDIA_MANAGER_ENABLED = false;
	}
} else {
	$MEDIA_MANAGER_ENABLED = false;
}

$ll_email_name = $email_object->name;

$supported_fonts = ll_emails_manager::load_supported_fonts ();
$supported_font_weights = ll_emails_manager::load_supported_font_weights ();
$supported_font_sizes = ll_emails_manager::load_supported_font_sizes ();
$supported_calendar_timezones = ll_emails_manager::get_calendar_timezones();

$time_zone_info = ll_users::get_user_time_zone_info($userID);

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

<!-- Code Editor-->
<link rel="stylesheet" href="js/codemirror/lib/codemirror.css">
<link rel="stylesheet" href="js/codemirror/addon/hint/show-hint.css">
<script src="js/codemirror/lib/codemirror.js"></script>
<script src="js/codemirror/addon/hint/show-hint.js"></script>
<script src="js/codemirror/addon/hint/anyword-hint.js"></script>
<script src="js/codemirror/mode/javascript/javascript.js"></script>

<link type="text/css" href="js/colpick/css/colpick.css" rel="stylesheet" />
<script src="js/jquery-1.7.1.js" type="text/javascript"></script>
<script type="text/javascript" src="js/jquery-ui-1.9.2.custom.min.js"></script>
<!--<script type="text/javascript" src="js/tinymce4/js/tinymce/tinymce.min.js<?php /*include 'll-cache-validator.php';*/?>"></script>-->
<?php
include 'javascript_common.php';
?>
<script src="js/colpick/js/colpick.js" type="text/javascript"></script>

<script src="js/jquery.bootstrap-touchspin.js" type="text/javascript"></script>

<script src="Scripts/jQuery/jquery.json.js" type="text/javascript"></script>
<!-- Removed from here, and is added at the javascript common file incase the help prompt files were not imcluded, and if they were included, then it would include the jquery min file-->


<script type="text/javascript">
var em_window_lock_token = '<?php echo $window_lock_token;?>';
var ll_email_builder_step = "setup_advanced";
var ll_email_build_type_alias = '';

var emb_ll_campaign_id = '<?php echo $ll_campaign_id;?>';
var emb_newsletterid = '<?php echo $newsletterid?>';
var emb_templateid = '<?php echo $templateid?>';
var emb_ll_email_type = '<?php echo $ll_email_type;?>';

var LL_EMAIL_TYPE_START_WITH_TEMPLATE_ALIAS = "<?php echo ll_emails_manager::LL_EMAIL_TYPE_START_WITH_TEMPLATE_ALIAS?>";
var LL_EMAIL_TYPE_START_FROM_SCRATCH_ALIAS = "<?php echo ll_emails_manager::LL_EMAIL_TYPE_START_FROM_SCRATCH_ALIAS?>";
var LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS = "<?php echo ll_emails_manager::LL_EMAIL_TYPE_START_WITH_HTML_EDITOR_ALIAS?>";
var LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS = "<?php echo ll_emails_manager::LL_EMAIL_TYPE_START_WITH_CODE_EDITOR_ALIAS?>";

//is_has_access_dynamic_contents = <?php if($dynamic_contents) echo 'true'; else echo 'false'; ?>;

MEDIA_MANAGER_ENABLED = <?php if($MEDIA_MANAGER_ENABLED) echo 'true'; else echo 'false'; ?>;
<?php if($MEDIA_MANAGER_ENABLED){?>
_moxiemanager_plugin = '<?php echo SITEROOTHTTPS ?>js/moxiemanager/plugin.min.js?v=<?php echo MOXIE_MANAGER_VERSION?>';
<?php } else { ?>
_moxiemanager_plugin = '';
<?php }?>
</script>

<?php if($MEDIA_MANAGER_ENABLED){ ?>
<script src="js/moxiemanager/js/moxman.loader.min.js?v=<?php echo MOXIE_MANAGER_VERSION?>"></script>
<?php } ?>
<script type="text/javascript" src="js/wizard-header-manager.js<?php include 'll-cache-validator.php';?>"></script>
<?php if($newsletterid){?>
    <script type="text/javascript">wizard_header_manager.asset_type = 'EMAIL';</script>
    <script type="text/javascript">wizard_header_manager.asset_id = <?php echo $newsletterid?>;</script>
<?php }elseif($templateid){?>
    <script type="text/javascript">wizard_header_manager.asset_type = 'EMAIL_TEMPLATE';</script>
    <script type="text/javascript">wizard_header_manager.asset_id = <?php echo $templateid?>;</script>
<?php }?>
<script src="js/ll-email-builder.js<?php include 'll-cache-validator.php';?>" type="text/javascript"></script>
<script src="js/ll_folders_panel.js<?php include 'll-cache-validator.php';?>" type="text/javascript"></script>
<script src="js/ll-email-builder-codeeditor.js" type="text/javascript"></script>
<script src="js/ll-email-builder-common.js<?php include 'll-cache-validator.php';?>" type="text/javascript"></script>
<script src="js/ll-custom-elements-manager.js<?php include 'll-cache-validator.php';?>" type="text/javascript"></script>

<title><?php
echo ll_private_labels_manager::get_branding_name($customerID) . ' - ' ;
echo PAGE_TITLE;
?></title>

<?php 
	echo ll_email_basic_themes::load_common_styling('designer');
?>
</head>

<body class="theme email-layout">
	<div id="mainWrapper">
		<?php 
		include 'll-email-builder-header.php';
		?>
		
		<div id="email-editor" class="email-editor <?php if($_SESSION['impersonalized_login']){?>impersonation_message<?php }?>">
			<div class="wrap-preview-col">
				<div class="resize-col"></div>
				<div class="preview-col inline-preview-col">
					<div class="eb-wrap-email-page" id="container_designer_html">
					</div>
				</div>
			</div>
			<div class="tool-col">
				
				<div class="eb-inner-tool">
					<div class="tabs-editor">
						<ul class="clearfix">
							<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
							<li><a href="javascript:void(0)"><i class="eb-icn-design"></i>Design</a></li>
						</ul>
						<div class="wrap-tabs-content">
							<div class="tab-content">
								<div class="eb-bloks-content clearfix">
									<div class="eb-block-content eb-block-text eb-show-slide-panel" data-slide-panel="box-text">
										<div class="t">Text</div>
									</div>
									<div class="eb-block-content eb-block-boxed-text eb-show-slide-panel" data-slide-panel="box-border-text">
										<div class="t">Border Text</div>
									</div>
									<div class="eb-block-content eb-block-divider eb-show-slide-panel" data-slide-panel="box-divider">
										<div class="t">Divider</div>
									</div>
									<div class="eb-block-content eb-block-image eb-show-slide-panel" data-slide-panel="box-image">
										<div class="t">Image</div>
									</div>
									<div class="eb-block-content eb-block-image-group eb-show-slide-panel" data-slide-panel="box-image-group">
										<div class="t">Image Group</div>
									</div>
									<div class="eb-block-content eb-block-image-card eb-show-slide-panel" data-slide-panel="box-image-card">
										<div class="t">Image Card</div>
									</div>
									<div class="eb-block-content eb-block-image-caption eb-show-slide-panel" data-slide-panel="box-image-caption">
										<div class="t">Image & Caption</div>
									</div>
									<div class="eb-block-content eb-block-social-share eb-show-slide-panel" data-slide-panel="box-social-share">
										<div class="t">Social Share</div>
									</div>
									<div class="eb-block-content eb-block-social-follow eb-show-slide-panel" data-slide-panel="box-social-follow">
										<div class="t">Social Follow</div>
									</div>
									<div class="eb-block-content eb-block-calendar eb-show-slide-panel" data-slide-panel="box-calendar">
                                        <div class="t">Calendar</div>
                                    </div>
									<div class="eb-block-content eb-block-button eb-show-slide-panel" data-slide-panel="box-button">
										<div class="t">Button</div>
									</div>
									<div class="eb-block-content eb-block-footer eb-show-slide-panel" data-slide-panel="box-footer">
										<div class="t">Footer</div>
									</div>
									<div class="eb-block-content eb-block-code eb-show-slide-panel" data-slide-panel="box-code">
										<div class="t">Code</div>
									</div>
									<div class="eb-block-content eb-block-video eb-show-slide-panel" data-slide-panel="box-video">
										<div class="t">Video</div>
									</div>
                                    <div class="eb-block-content eb-block-column-2 eb-show-slide-panel" data-slide-panel="column-2">
                                        <div class="t">2 Columns</div>
                                    </div>
                                    <div class="eb-block-content eb-block-column-3 eb-show-slide-panel" data-slide-panel="column-3">
                                        <div class="t">3 Columns</div>
                                    </div>
                                    <div class="eb-block-content eb-block-custom-element eb-show-slide-panel" data-slide-panel="custom-element">
                                        <div class="t">Custom Element</div>
                                    </div>
                                    <div class="eb-block-content eb-block-countdown eb-show-slide-panel" data-slide-panel="countdown">
                                        <div class="t">Countdown</div>
                                    </div>
								</div>
							</div>
							<div class="tab-content">
								<div class="eb-email-design-box">
									<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/icn_left_module.png"/>
									<div>Select Module to the Left</div>
									<div>or</div>
									<a href="javascript:void(0)" class="et-btn-white eb-show-slide-panel" data-slide-panel="page-design">Edit Page Design</a>
								</div>

							</div>
						</div>
					</div>
					<div class="wrap-panels-el">
					<div class="eb-right-panel-slide" id="eb-page-design">
						<div class="eb-panel-head">
							<span>Page Design</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="eb-slide-box-head">Page</div>
							<div class="eb-slide-box-content">
								<div class="eb-design-head">Background</div>
								<div class="eb-field">
									<label>Background Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="pageBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Top</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="pageBorderType">
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
										<div class="eb-inner-field">
											<input id="pageBorderWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="pageBorderColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Box</div>
								<div class="eb-field">
									<label>Border</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="boxBorderType">
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
										<div class="eb-inner-field">
											<input id="boxBorderWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="boxBorderColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Heading 1</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="h1Color" style="background-color: rgb(242, 242, 242);" class="color-box" data-color-start="f2f2f2"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Shadow</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label class="eb-text-center">x</label>
											<input id="h1ShadowX" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">y</label>
											<input id="h1ShadowY" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Blur</label>
											<input id="h1ShadowBlur" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="h1ShadowColor" style="background-color: #f08b21;" class="color-box" data-color-start="f08b21"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Heading 2</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="h2Color" style="background-color: rgb(242, 242, 242);" class="color-box" data-color-start="f2f2f2"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Shadow</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label class="eb-text-center">x</label>
											<input id="h2ShadowX" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">y</label>
											<input id="h2ShadowY" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Blur</label>
											<input id="h2ShadowBlur" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="h2ShadowColor" style="background-color: #f08b21;" class="color-box" data-color-start="f08b21"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Custom Fonts</div>
								<div class="eb-field">
									<div class="wrap-line-criteries custom-fonts-container-line-criteria" id="container_custom_font_references" line-identifier='font_references'>
									</div>
								</div>
								<div class="eb-design-head no-border"></div>
								<div class="eb-field">
									<div class="wrap-line-criteries custom-fonts-container-line-criteria"" id="container_custom_font_names" line-identifier='font_names'>
									</div>
								</div>
							</div>
							<div class="eb-slide-box-head" id="slide-h-preheader">Preheader</div>
							<div class="eb-slide-box-content" id="slide-c-preheader">
								<div class="eb-design-head">Style</div>
								<div class="eb-field">
									<label>Background Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="preheaderBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Top</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="preheaderBorderTopType">
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
										<div class="eb-inner-field">
											<input id="preheaderBorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="preheaderBorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Bottom</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="preheaderBorderBottomType">
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
										<div class="eb-inner-field">
											<input id="preheaderBorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="preheaderBorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Text</div>
								<div class="eb-field">
									<label>Font</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Typeface</label>
											<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="preheaderTypeFace">
												<?php 
												foreach ($supported_fonts as $supported_item){
													$selected = $supported_item['default'] ? "selected='selected'" : '';
													echo "<option standard_font='1' value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Weight</label>
											<select class="eb-w130" id="preheaderWeight">
												<?php 
												foreach ($supported_font_weights as $supported_item){
													$selected = $supported_item['default'] ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Size</label>
											<select class="eb-w70" id="preheaderSize">
												<?php 
												foreach ($supported_font_sizes as $supported_item){
													$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="preheaderColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Line Height</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="preheaderLineHeight">
												<option value="None">Not Specified</option>
												<option value="100">Normal</option>
												<option value="125">Slight</option>
												<option value="150" selected>1 1/2 Spacing</option>
												<option value="200">Double Space</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Align</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<ul class="eb-text-align clearfix" id="preheaderAlign">
												<li class="eb-t-alg-left selected"></li>
												<li class="eb-t-alg-center"></li>
												<li class="eb-t-alg-right"></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Link</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="preheaderLinkColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Font Weight</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="preheaderLinkWeight">
												<option value="0">Normal</option>
												<option value="1">Bold</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Decoration</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="preheaderLinkDecoration">
												<option value="0">None</option>
												<option value="1">Underline</option>
												<option value="2">Line-Through</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="eb-slide-box-head">Header</div>
							<div class="eb-slide-box-content">
								<div class="eb-design-head">Style</div>
								<div class="eb-field">
									<label>Background Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="headerBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Top</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="headerBorderTopType">
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
										<div class="eb-inner-field">
											<input id="headerBorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="headerBorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Bottom</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="headerBorderBottomType">
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
										<div class="eb-inner-field">
											<input id="headerBorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="headerBorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Text</div>
								<div class="eb-field">
									<label>Font</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Typeface</label>
											<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="headerTypeFace">
												<?php 
												foreach ($supported_fonts as $supported_item){
													echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Weight</label>
											<select class="eb-w130" id="headerWeight">
												<?php 
												foreach ($supported_font_weights as $supported_item){
													$selected = $supported_item['default'] ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Size</label>
											<select class="eb-w70" id="headerSize">
												<?php 
												foreach ($supported_font_sizes as $supported_item){
													$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="headerColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Line Height</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="headerLineHeight">
												<option value="None">Not Specified</option>
												<option value="100">Normal</option>
												<option value="125">Slight</option>
												<option value="150" selected>1 1/2 Spacing</option>
												<option value="200">Double Space</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Align</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<ul class="eb-text-align clearfix" id="headerAlign">
												<li class="eb-t-alg-left selected"></li>
												<li class="eb-t-alg-center"></li>
												<li class="eb-t-alg-right"></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Link</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="headerLinkColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Font Weight</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="headerLinkWeight">
												<option value="0">Normal</option>
												<option value="1">Bold</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Decoration</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="headerLinkDecoration">
												<option value="0">None</option>
												<option value="1">Underline</option>
												<option value="2">Line-Through</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="eb-slide-box-head" id="slide-h-body">Body</div>
							<div class="eb-slide-box-content" id="slide-c-body">
								<div class="eb-design-head">Style</div>
								<div class="eb-field">
									<label>Background Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="bodyBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Top</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="bodyBorderTopType">
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
										<div class="eb-inner-field">
											<input id="bodyBorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="bodyBorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Bottom</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="bodyBorderBottomType">
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
										<div class="eb-inner-field">
											<input id="bodyBorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="bodyBorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Text</div>
								<div class="eb-field">
									<label>Font</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Typeface</label>
											<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="bodyTypeFace">
												<?php 
												foreach ($supported_fonts as $supported_item){
													echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Weight</label>
											<select class="eb-w130" id="bodyWeight">
												<?php 
												foreach ($supported_font_weights as $supported_item){
													$selected = $supported_item['default'] ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Size</label>
											<select class="eb-w70" id="bodySize">
												<?php 
												foreach ($supported_font_sizes as $supported_item){
													$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="bodyColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Line Height</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="bodyLineHeight">
												<option value="None">Not Specified</option>
												<option value="100">Normal</option>
												<option value="125">Slight</option>
												<option value="150" selected>1 1/2 Spacing</option>
												<option value="200">Double Space</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Align</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<ul class="eb-text-align clearfix" id="bodyAlign">
												<li class="eb-t-alg-left selected"></li>
												<li class="eb-t-alg-center"></li>
												<li class="eb-t-alg-right"></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Link</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="bodyLinkColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Font Weight</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="bodyLinkWeight">
												<option value="0">Normal</option>
												<option value="1">Bold</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Decoration</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="bodyLinkDecoration">
												<option value="0">None</option>
												<option value="1">Underline</option>
												<option value="2">Line-Through</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="eb-slide-box-head" id="slide-h-columns">Columns</div>
							<div class="eb-slide-box-content" id="slide-c-columns">
								<div class="eb-design-head">Style</div>
								<div class="eb-field">
									<label>Background Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="columnBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Top</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="columnBorderTopType">
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
										<div class="eb-inner-field">
											<input id="columnBorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="columnBorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Bottom</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="columnBorderBottomType">
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
										<div class="eb-inner-field">
											<input id="columnBorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="columnBorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Text</div>
								<div class="eb-field">
									<label>Font</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Typeface</label>
											<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="columnTypeFace">
												<?php 
												foreach ($supported_fonts as $supported_item){
													echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Weight</label>
											<select class="eb-w130" id="columnWeight">
												<?php 
												foreach ($supported_font_weights as $supported_item){
													$selected = $supported_item['default'] ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Size</label>
											<select class="eb-w70" id="columnSize">
												<?php 
												foreach ($supported_font_sizes as $supported_item){
													$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div  id="columnColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Line Height</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="columnLineHeight">
												<option value="100">Normal</option>
												<option value="125">Slight</option>
												<option value="150">1 1/2 Spacing</option>
												<option value="200">Double Space</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Align</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<ul class="eb-text-align clearfix" id="columnAlign">
												<li class="eb-t-alg-left selected"></li>
												<li class="eb-t-alg-center"></li>
												<li class="eb-t-alg-right"></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Link</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div  id="columnLinkColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Font Weight</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="columnLinkWeight">
												<option value="0">Normal</option>
												<option value="1">Bold</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Decoration</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="columnLinkDecoration">
												<option value="0">None</option>
												<option value="1">Underline</option>
												<option value="2">Line-Through</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div class="eb-slide-box-head" id="slide-h-section-bottom">Section Bottom</div>
                            <div class="eb-slide-box-content" id="slide-c-section-bottom">
                                <div class="eb-design-head">Style</div>
                                <div class="eb-field">
                                    <label>Background Color</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <div class="wrap-color">
                                                <div id="sectionBottomBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-field">
                                    <label>Border Top</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <label>Type</label>
                                            <select class="eb-w160" id="sectionBottomBorderTopType">
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
                                        <div class="eb-inner-field">
                                            <input id="sectionBottomBorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
                                        </div>
                                        <div class="eb-inner-field">
                                            <label class="eb-text-center">Color</label>
                                            <div class="wrap-color">
                                                <div id="sectionBottomBorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-field">
                                    <label>Border Bottom</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <label>Type</label>
                                            <select class="eb-w160" id="sectionBottomBorderBottomType">
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
                                        <div class="eb-inner-field">
                                            <input id="sectionBottomBorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
                                        </div>
                                        <div class="eb-inner-field">
                                            <label class="eb-text-center">Color</label>
                                            <div class="wrap-color">
                                                <div id="sectionBottomBorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-design-head">Text</div>
                                <div class="eb-field">
                                    <label>Font</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <label>Typeface</label>
                                            <select class="eb-w130" id="sectionBottomTypeFace">
												<?php 
												foreach ($supported_fonts as $supported_item){
													echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
												}
												?>
                                            </select>
                                        </div>
                                        <div class="eb-inner-field">
                                            <label>Weight</label>
                                            <select class="eb-w130" id="sectionBottomWeight">
                                                <option value="Normal">Normal</option>
                                                <option value="Bold">Bold</option>
                                            </select>
                                        </div>
                                        <div class="eb-inner-field">
                                            <label>Size</label>
                                            <select class="eb-w70" id="sectionBottomSize">
												<?php 
												foreach ($supported_font_sizes as $supported_item){
													$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
                                            </select>
                                        </div>
                                        <div class="eb-inner-field">
                                            <div class="wrap-color">
                                                <div  id="sectionBottomColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-field">
                                    <label>Line Height</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <select class="eb-w130" id="sectionBottomLineHeight">
                                                <option value="100">Normal</option>
                                                <option value="125">Slight</option>
                                                <option value="150">1 1/2 Spacing</option>
                                                <option value="200">Double Space</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-field">
                                    <label>Text Align</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <ul class="eb-text-align clearfix" id="sectionBottomAlign">
                                                <li class="eb-t-alg-left selected"></li>
                                                <li class="eb-t-alg-center"></li>
                                                <li class="eb-t-alg-right"></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-design-head">Link</div>
                                <div class="eb-field">
                                    <label>Text Color</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <div class="wrap-color">
                                                <div  id="sectionBottomLinkColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-field">
                                    <label>Font Weight</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <select class="eb-w130" id="sectionBottomLinkWeight">
                                                <option value="0">Normal</option>
                                                <option value="1">Bold</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div class="eb-field">
                                    <label>Text Decoration</label>
                                    <div class="eb-right">
                                        <div class="eb-inner-field">
                                            <select class="eb-w130" id="sectionBottomLinkDecoration">
                                                <option value="0">None</option>
                                                <option value="1">Underline</option>
                                                <option value="2">Line-Through</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
							<div class="eb-slide-box-head">Footer</div>
							<div class="eb-slide-box-content">
								<div class="eb-design-head">Style</div>
								<div class="eb-field">
									<label>Background Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="footerBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Top</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="footerBorderTopType">
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
										<div class="eb-inner-field">
											<input id="footerBorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="footerBorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Border Bottom</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Type</label>
											<select class="eb-w160" id="footerBorderBottomType">
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
										<div class="eb-inner-field">
											<input id="footerBorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
										</div>
										<div class="eb-inner-field">
											<label class="eb-text-center">Color</label>
											<div class="wrap-color">
												<div id="footerBorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Text</div>
								<div class="eb-field">
									<label>Font</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<label>Typeface</label>
											<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="footerTypeFace">
												<?php 
												foreach ($supported_fonts as $supported_item){
													echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Weight</label>
											<select class="eb-w130" id="footerWeight">
												<?php 
												foreach ($supported_font_weights as $supported_item){
													$selected = $supported_item['default'] ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<label>Size</label>
											<select class="eb-w70" id="footerSize">
												<?php 
												foreach ($supported_font_sizes as $supported_item){
													$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
													echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
												}
												?>
											</select>
										</div>
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="footerColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Line Height</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="footerLineHeight">
												<option value="None">Not Specified</option>
												<option value="100">Normal</option>
												<option value="125">Slight</option>
												<option value="150" selected>1 1/2 Spacing</option>
												<option value="200">Double Space</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Align</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<ul class="eb-text-align clearfix" id="footerAlign">
												<li class="eb-t-alg-left selected"></li>
												<li class="eb-t-alg-center"></li>
												<li class="eb-t-alg-right"></li>
											</ul>
										</div>
									</div>
								</div>
								<div class="eb-design-head">Link</div>
								<div class="eb-field">
									<label>Text Color</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<div class="wrap-color">
												<div id="footerLinkColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
											</div>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Font Weight</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="footerLinkWeight">
												<option value="0">Normal</option>
												<option value="1">Bold</option>
											</select>
										</div>
									</div>
								</div>
								<div class="eb-field">
									<label>Text Decoration</label>
									<div class="eb-right">
										<div class="eb-inner-field">
											<select class="eb-w130" id="footerLinkDecoration">
												<option value="0">None</option>
												<option value="1">Underline</option>
												<option value="2">Line-Through</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="eb-right-panel-slide" id="eb-box-text">
						<div class="eb-panel-head">
							<span>Text</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix eb-three-tabs">
									<li class="selected eb-gray-tab"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										
										<div class="two-text-editor">
											<ul class="clearfix">
												<li class="selected"><a href="javascript:void(0)">Column 1</a></li>
												<li><a href="javascript:void(0)">Column 2</a></li>
												<li><a href="javascript:void(0)">Column 3</a></li>
											</ul>
											<div class="wrap-text-column">
												<div class="eb-text-column">
													<div class="eb-editor-text">
														<textarea id="editor-box-text"></textarea>
													</div>
												</div>
												<div class="eb-text-column">
													<div class="eb-editor-text">
														<textarea id="editor-box-text-2"></textarea>
													</div>
												</div>
												<div class="eb-text-column">
                                                    <div class="eb-editor-text">
                                                        <textarea id="editor-box-text-3"></textarea>
                                                    </div>
                                                </div>
											</div>
										</div>
									</div>
									
									<div class="tab-content eb-style-box eb-p15">
										<div class="eb-field">
											<label>Background Color <span class="eb-clear-line" data-type="bgColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="boxTextBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
													</div>
												</div>
											</div>
										</div>
										<div id="boxes-border">
											<div class="eb-field">
												<label>Border <span class="eb-clear-line" data-type="border"><span class="pr-lbl-link">Clear</span></span></label>
												<div class="eb-right">
													<div class="eb-inner-field">
														<label>Type</label>
														<select class="eb-w160" id="boxTextBorderType">
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
													<div class="eb-inner-field">
														<input id="boxTextBorderWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
													</div>
													<div class="eb-inner-field">
														<div class="wrap-color">
															<div id="boxTextBorderColor" style="background-color: rgb(242, 242, 242);" class="color-box" data-color-start="f2f2f2"></div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Font <span class="eb-clear-line" data-type="font"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="boxTextTypeFace">
														<?php 
														foreach ($supported_fonts as $supported_item){
															echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Weight</label>
													<select class="eb-w130" id="boxTextWeight">
														<?php 
														foreach ($supported_font_weights as $supported_item){
															$selected = $supported_item['default'] ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="boxTextSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="boxTextColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Line Height <span class="eb-clear-line" data-type="lineHeight"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="boxTextLineHeight">
														<option value="None" selected>Not Specified</option>
														<option value="100">Normal</option>
														<option value="125">Slight</option>
														<option value="150">1 1/2 Spacing</option>
														<option value="200">Double Space</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Text Align <span class="eb-clear-line" data-type="textAlign"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<ul class="eb-text-align clearfix" id="boxTextAlign">
														<li class="eb-t-alg-left selected"></li>
														<li class="eb-t-alg-center"></li>
														<li class="eb-t-alg-right"></li>
													</ul>
												</div>
											</div>
										</div>
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Number of Columns</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="numberColumnBoxText">
														<option value="0">1 Column</option>
														<option value="1">2 Column</option>
														<option value="2">3 Column</option>
													</select>
												</div>
											</div>
										</div>
										<div id="splitColumnBoxText" class="eb-field">
											<label>Column Split</label>
											<ul class="eb-list-layout clearfix">
												<li class="selected eb-col-type-1"></li>
												<li class="eb-col-type-2"></li>
												<li class="eb-col-type-3"></li>
												<li class="eb-col-type-4"></li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div class="eb-right-panel-slide" id="eb-box-divider">
						<div class="eb-panel-head">
							<span>Divider</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Background Color  <span class="eb-clear-line" data-type="bgColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="dividerBackgroundColor" style="background-color: rgb(255, 255, 255);" class="color-box" data-color-start="ffffff"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Border Top  <span class="eb-clear-line" data-type="border"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Type</label>
													<select class="eb-w160" id="dividerBorderType">
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
												<div class="eb-inner-field">
													<input type="text" id="dividerBorderWidth" class="txt_field touch-spin eb-field-small" value="0"/>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="dividerBorderColor" style="background-color: #999999;" class="color-box" data-color-start="999999"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Padding  <span class="eb-clear-line" data-type="borderPadding"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label class="eb-text-center">Top</label>
													<input id="dividerPaddingTop" type="text" class="txt_field divider-field eb-field-small" value="0"/>
												</div>
												<div class="eb-inner-field">
													<label class="eb-text-center">Bottom</label>
													<input id="dividerPaddingBottom" type="text" class="txt_field divider-field eb-field-small" value="0"/>
												</div>
											</div>
										</div>
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="eb-right-panel-slide" id="eb-box-image">
						<div class="eb-panel-head">
							<span>Image</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<ul class="eb-list-image">
											<li class="item-image clearfix">
												<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
												<div class="eb-image-item-meta">
													<strong class="eb-image-item-title">Upload an Image</strong>
													<div class="eb-size-img"></div>
													<ul class="eb-links-image clearfix">
														<li>
															<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>
														</li>
													</ul>
												</div>
											</li>
										</ul>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Align</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="imageAlign">
														<option value="0">Left</option>
														<option value="1">Center</option>
														<option value="2">Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Margins</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="eb-checkbox">
														<label><input type="checkbox" id="image-edge"/> Edge To Edge</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="eb-right-panel-slide" id="eb-box-image-group">
						<div class="eb-panel-head">
							<span>Image Group</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<ul class="eb-list-image eb-list-image-group">
											<li class="item-image clearfix" datasortid="0">
												<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>
												<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
												<div class="eb-image-item-meta">
													<strong class="eb-image-item-title">Upload an Image</strong>
													<ul class="eb-links-image clearfix">
														<li>
															<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>
														</li>
													</ul>
												</div>
											</li>
											<li class="item-image clearfix" datasortid="1">
												<a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>
												<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
												<div class="eb-image-item-meta">
													<strong class="eb-image-item-title">Upload an Image</strong>
													<ul class="eb-links-image clearfix">
														<li>
															<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>
														</li>
													</ul>
												</div>
											</li>
										</ul>
										<div class="eb-add-image-list">
											<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/icn_add.png"/> Add Image
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field" id="imgColumnGroup">
											<label>Image Layout</label>
											<ul class="eb-list-layout clearfix">
												<li class="selected eb-group-type-1" data-type="0" data-index="0"></li>
												<li class="eb-group-type-2" data-type="0" data-index="1"></li>
												<li class="eb-group-type-3" data-type="1" data-index="0"></li>
												<li class="eb-group-type-4" data-type="1" data-index="1"></li>
												<li class="eb-group-type-5" data-type="1" data-index="2"></li>
												<li class="eb-group-type-6" data-type="2" data-index="0"></li>
												<li class="eb-group-type-7" data-type="2" data-index="1"></li>
												<li class="eb-group-type-8" data-type="3" data-index="0"></li>
												<li class="eb-group-type-9" data-type="3" data-index="1"></li>
												<li class="eb-group-type-10" data-type="3" data-index="2"></li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="eb-right-panel-slide" id="eb-box-image-card">
						<div class="eb-panel-head">
							<span>Image Card</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix eb-three-tabs">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<ul class="eb-list-image eb-border-bottom">
											<li class="item-image clearfix">
												<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
												<div class="eb-image-item-meta">
													<strong class="eb-image-item-title">Upload an Image</strong>
													<div class="eb-size-img"></div>
													<ul class="eb-links-image clearfix">
														<li>
															<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>
														</li>
													</ul>
												</div>
											</li>
										</ul>
										<div class="eb-editor-text">
											<textarea id="editor-box-text-card"></textarea>
										</div>
									</div>
									<div class="tab-content eb-style-box">
										<div class="eb-field">
											<label>Background Color <span class="eb-clear-line" data-type="bgColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="cardBackground" style="background-color: #ffffff" class="color-box" data-color-start="ffffff"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Border <span class="eb-clear-line" data-type="border"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Type</label>
													<select class="eb-w160" id="cardBorderType">
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
												<div class="eb-inner-field">
													<input type="text" class="txt_field touch-spin eb-field-small" id="cardBorderWidth" value="0"/>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="cardBorderColor" style="background-color: rgb(242, 242, 242);" class="color-box" data-color-start="f2f2f2"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Font <span class="eb-clear-line" data-type="font"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="cardTypeFace">
														<?php 
														foreach ($supported_fonts as $supported_item){
															echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Weight</label>
													<select class="eb-w130" id="cardWeight">
														<?php 
														foreach ($supported_font_weights as $supported_item){
															$selected = $supported_item['default'] ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="cardSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="cardTextColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Line Height <span class="eb-clear-line" data-type="lineHeight"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="cardLineHeight">
														<option value="None" selected>Not Specified</option>
														<option value="100">Normal</option>
														<option value="125">Slight</option>
														<option value="150">1 1/2 Spacing</option>
														<option value="200">Double Space</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Text Align <span class="eb-clear-line" data-type="textAlign"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<ul class="eb-text-align clearfix" id="cardTextAlign">
														<li class="eb-t-alg-left selected"></li>
														<li class="eb-t-alg-center"></li>
														<li class="eb-t-alg-right"></li>
													</ul>
												</div>
											</div>
										</div>
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Caption Position</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="cardPosition">
														<option value="0">Left</option>
														<option value="1">Top</option>
														<option value="2">Right</option>
														<option value="3">Bottom</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field image-alignment-card-wrap">
											<label>Image Alignment</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="cardImgAlignment">
														<option value="0">Left</option>
														<option value="1">Center</option>
														<option value="2">Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field caption-width-card-wrap">
											<label>Caption Width</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="cardCaptionWidth">
														<option value="0">One-Third</option>
														<option value="1">Half</option>
														<option value="2">Two-Thirds</option>
														<option value="3">Three-Quarters</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Margins</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="eb-checkbox">
														<label><input type="checkbox" id="image-edge-card"/> Image Edge To Edge</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="eb-right-panel-slide" id="eb-box-image-caption">
						<div class="eb-panel-head">
							<span>Image Caption</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix eb-three-tabs">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<div class="two-caption-editor">
											<ul class="clearfix">
												<li class="selected"><a href="javascript:void(0)">Column 1</a></li>
												<li><a href="javascript:void(0)">Column 2</a></li>
											</ul>
											<div class="wrap-caption-column">
												<div class="eb-caption-column">
													<ul class="eb-list-image eb-border-bottom clearfix">
														<li class="item-image clearfix">
															<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
															<div class="eb-image-item-meta">
																<strong class="eb-image-item-title">Upload an Image</strong>
																<div class="eb-size-img"></div>
																<ul class="eb-links-image clearfix">
																	<li>
																		<a href="javascript:void(0)" class="lnk-img-browse">Browse</a>
																	</li>
																</ul>
															</div>
														</li>
													</ul>
													<div class="eb-editor-text">
														<textarea id="editor-box-text-caption"></textarea>
													</div>
												</div>
												<div class="eb-caption-column">
													<ul class="eb-list-image eb-border-bottom">
														<li class="clearfix">
															<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
															<div class="eb-image-item-meta">
																<strong class="eb-image-item-title">Upload an Image</strong>
																<ul class="eb-links-image clearfix">
																	<li>
																		<a href="javascript:void(0)">Browse</a>
																	</li>
																</ul>
															</div>
														</li>
													</ul>
													<div class="eb-editor-text">
														<textarea id="editor-box-text-caption-2"></textarea>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="tab-content eb-style-box eb-p15">
										<div class="eb-field">
											<label>Font <span class="eb-clear-line" data-type="font"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="captionTypeFace">
														<?php 
														foreach ($supported_fonts as $supported_item){
															echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Weight</label>
													<select class="eb-w130" id="captionWeight">
														<?php 
														foreach ($supported_font_weights as $supported_item){
															$selected = $supported_item['default'] ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="captionSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="captionTextColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Line Height <span class="eb-clear-line" data-type="lineHeight"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="captionLineHeight">
														<option value="None" selected>Not Specified</option>
														<option value="100">Normal</option>
														<option value="125">Slight</option>
														<option value="150">1 1/2 Spacing</option>
														<option value="200">Double Space</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Text Align <span class="eb-clear-line" data-type="textAlign"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<ul class="eb-text-align clearfix" id="captionTextAlign">
														<li class="eb-t-alg-left selected"></li>
														<li class="eb-t-alg-center"></li>
														<li class="eb-t-alg-right"></li>
													</ul>
												</div>
											</div>
										</div>
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Caption Position</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="captionPosition">
														<option value="0">Left</option>
														<option value="1">Top</option>
														<option value="2">Right</option>
														<option value="3">Bottom</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field image-alignment-caption-wrap">
											<label>Image Alignment</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="captionImgAlignment">
														<option value="0">Left</option>
														<option value="1">Center</option>
														<option value="2">Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field caption-width-caption-wrap">
											<label>Caption Width</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="captionCaptionWidth">
														<option value="0">One-Third</option>
														<option value="1">Half</option>
														<option value="2">Two-Thirds</option>
														<option value="3">Three-Quarters</option>
													</select>
												</div>
											</div>
										</div>
										<!-- 
										<div class="eb-field">
											<label>Number Of Images</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="captionNumber">
														<option value="0">1</option>
														<option value="1">2</option>
													</select>
												</div>
											</div>
										</div>
										 -->
									</div>
								</div>
							</div>
						</div>
					</div>

					<div class="eb-right-panel-slide" id="eb-box-button">
						<div class="eb-panel-head">
							<span>Button</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix eb-three-tabs">
									<li class="selected eb-gray-tab"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-style-box">
										<div class="eb-field">
											<label>Button Text</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<input id="buttonText" type="text" class="txt_field" value="Make Your Purchase"/>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Link To</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w160" id="button_link_to">
														<option value="url">Web Address</option>
														<option value="mail">Email Address</option>
														<?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$LANDING_PAGES )) {?>
														<option value="lp">Landing Page</option>
														<?php }?>
														<?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$CONTENT_MANAGEMENT )) {?>
														<option value="content">Trackable Content</option>
														<?php }?>
													</select>
												</div>
												<?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$LANDING_PAGES )) {?>
												<div class="eb-inner-field" id="container_button_lp" style="display: none">
													<select class="eb-w160" data-placeholder="Select Landing Page" id="select_button_landing_page">
														<option></option>
													</select>
												</div>
												<?php }?>
												<?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$CONTENT_MANAGEMENT )) {?>
												<div class="eb-inner-field" id="container_button_trackable_content" style="display: none">
													<select class="eb-w160" data-placeholder="Select File" id="select_button_file">
														<option></option>
													</select>
												</div>
												<?php }?>
											</div>
										</div>
										<div class="eb-field">
											<label id="label_btn_link_to">Web Address (URL)</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<input id="buttonUrl" type="text" class="txt_field" />
												</div>
											</div>
										</div>
									</div>
									<div class="tab-content eb-style-box">
										<div class="eb-field">
											<label>Background Color  <span class="eb-clear-line" data-type="bgColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="buttonBackground" style="background-color: #<?php echo $theme_color;?>;" class="color-box" data-color-start="<?php echo $theme_color;?>"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Border  <span class="eb-clear-line" data-type="border"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Type</label>
													<select class="eb-w160" id="buttonBorderType">
														<option value="None">None</option>
														<option value="Solid" selected>Solid</option>
														<option value="Dashed">Dashed</option>
														<option value="Dotted">Dotted</option>
														<option value="Double">Double</option>
														<option value="Groove">Groove</option>
														<option value="Ridge">Ridge</option>
														<option value="Inset">Inset</option>
														<option value="Outset">Outset</option>
													</select>
												</div>
												<div class="eb-inner-field">
													<input id="buttonBorderWidth" type="text" class="txt_field touch-spin eb-field-small" value="1"/>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="buttonBorderColor" style="background-color: #<?php echo $theme_color;?>;" class="color-box" data-color-start="<?php echo $theme_color;?>"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Border Radius  <span class="eb-clear-line" data-type="btnRadius"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<input id="buttonRadius" type="text" class="txt_field touch-spin eb-field-small" value="3"/>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Font  <span class="eb-clear-line" data-type="font"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="buttonTypeFace">
														<?php 
														foreach ($supported_fonts as $supported_item){
															echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Weight</label>
													<select class="eb-w130" id="buttonWeight">
														<?php 
														foreach ($supported_font_weights as $supported_item){
															$selected = $supported_item['default'] ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="buttonSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 16 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="buttonTextColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Padding  <span class="eb-clear-line" data-type="btnPadding"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<input id="buttonPadding" type="text" class="txt_field touch-spin eb-field-small" value="12"/>
												</div>
											</div>
										</div>
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Horizontal Align</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="buttonAlign">
														<option value="0">Left</option>
														<option value="1" selected>Center</option>
														<option value="2" >Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Vertical Align</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="buttonVAlign">
														<option value="0" selected>Top</option>
														<option value="1">Center</option>
														<option value="2" >Bottom</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Width</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="buttonWidth">
														<option value="0">Fit To Text</option>
														<option value="1">Full width</option>
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					
					<div class="eb-right-panel-slide" id="eb-box-social-share">
						<div class="eb-panel-head">
							<span>Social Share</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix eb-three-tabs">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<!-- 
										<div class="eb-social-network">
											<div class="eb-social-network-box" data-link="fb">
												<div class="eb-field">
													<label><input type="checkbox" id="eb-check-fb" checked/> Facebook</label>
													<input type="text" id="eb-fb-link" class="txt_field" value="https://www.facebook.com/"/>
												</div>
											</div>
											<div class="eb-social-network-box" data-link="tw">
												<div class="eb-field">
													<label><input type="checkbox" id="eb-check-tw" checked/> Twitter</label>
													<input type="text" id="eb-tw-link" class="txt_field" value="https://twitter.com/"/>
												</div>
											</div>
											<div class="eb-social-network-box" data-link="in">
												<div class="eb-field">
													<label><input type="checkbox" id="eb-check-in" checked/> Linkedin</label>
													<input type="text" id="eb-in-link" class="txt_field" value="https://www.linkedin.com/"/>
												</div>
											</div>
										</div>
										 -->
                                        <div class="eb-wrap-social-network">
                                            <div class="eb-box-social-share">
												<div class="field-calendar-email">
													<div class="t-field">
                                                        <div class="label">
                                                            <label>Event Title</label>
                                                        </div>
														<input type="text" class="txt-field field-event-title" placeholder="Event Title"/>
													</div>
													<div class="t-wrap-field-col clearfix">
														<div class="t-field-col-1">
															<div class="t-field">
																<div class="label">
																	<label>Start Date</label>
																</div>
																<input type="text" class="txt-field field-event-start" id="start-datetime-calendar-email" value=""/>
															</div>
														</div>
														<div class="t-field-col-2">
															<div class="t-field">
																<div class="label">
																	<label>End Date</label>
																</div>
																<input type="text" class="txt-field field-event-end" id="end-datetime-calendar-email" value=""/>
															</div>
														</div>
													</div>
													<div class="t-wrap-field-col clearfix">
														<div class="t-field-col-1">
															<div class="t-field calendarTimezone">
																<div class="label">
																	<label>Timezone</label>
																</div>
																<select id="calendarTimezone">
																	<?php 
																	foreach ($supported_calendar_timezones as $k => $v) {
																		$selected = (stripos($time_zone_info['description'], $k) !== false) ? "selected='selected'" : "";
																		echo "<option value='{$k}' $selected>{$v}</option>";
																	}
																	?>
																</select>
															</div>
														</div>
														<div class="t-field-col-2">
															<div class="t-field">
																<div class="label">
																	<label>Location</label>
																</div>
																<input type="text" class="txt-field field-event-location" placeholder="Location"/>
															</div>
														</div>
													</div>
													<div class="t-wrap-field-col clearfix">
														<div class="t-field-col-1">
															<div class="t-field">
																<div class="label">
																	<label>Organizer</label>
																</div>
																<input type="text" class="txt-field field-event-organizer-name" value="<?php echo trim ("{$UserAccountConfiguration_firstName} {$UserAccountConfiguration_lastName}");?>"/>
															</div>
														</div>
														<div class="t-field-col-2">
															<div class="t-field">
																<div class="label">
																	<label>Email</label>
																</div>
																<input type="text" class="txt-field field-event-organizer-email" value="<?php echo $UserAccountConfiguration_email;?>"/>
															</div>
														</div>
													</div>
													<div class="t-field">
                                                        <div class="label">
                                                            <label>Event Description</label>
                                                        </div>
														<textarea class="txt-field field-event-description" placeholder="Event Description"></textarea>
													</div>
												</div>
                                                <div class="eb-content-to-share">
                                                    <div class="t-field">
                                                        <div class="label">
                                                            <label>Content to share</label>
                                                        </div>
                                                        <select id="select-content-to-share">
                                                            <option value="0">Campaign's archive URL</option>
                                                            <option value="1">Custom URL</option>
                                                        </select>
                                                    </div>
                                                    <div class="eb-share-custom-text">
                                                        <div class="t-field">
                                                            <div class="label">
                                                                <label>Custom URL to share</label>
                                                            </div>
                                                            <input id="shareCustomLink" type="text" class="txt-field"/>
                                                        </div>
                                                        <div class="t-field">
                                                            <div class="label">
                                                                <label>Short Description</label>
                                                            </div>
                                                            <input id="shareShortDesc" type="text" class="txt-field"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ul class="eb-list-group-social">
                                                    <li class="item-social clearfix" idx="0">
                                                        <a href="javascript:void(0);" class="et-btn-white eb-btn-delete-elm"><i class="icn"></i></a>
                                                        <a href="javascript:void(0);" class="et-btn-white eb-btn-move-elm"><i class="icn"></i></a>
                                                        <div class="eb-icon-social eb-icon-0"></div>
                                                        <select class="eb-social-list">
                                                            <option value="0">Facebook</option>
                                                            <option value="1">Twitter</option>
                                                            <option value="2">LinkedIn</option>
                                                            <option value="3">Pinterest</option>
                                                            <option value="4">Forward to Friend</option>
                                                            <option value="5">YouTube</option>
                                                            <option value="6">Instagram</option>
                                                            <option value="7">Vimeo</option>
                                                            <option value="8">RSS</option>
                                                            <option value="9">Email</option>
                                                            <option value="10">Website</option>
                                                        </select>
                                                        <div class="eb-fields-social">
                                                            <div class="t-field">
                                                                <div class="label">
                                                                    <label>Facebook Page URL</label>
                                                                </div>
                                                                <input type="text" class="txt-field"/>
                                                            </div>
                                                            <div class="t-field">
                                                                <div class="label">
                                                                    <label>Line Text</label>
                                                                </div>
                                                                <input type="text" class="txt-field"/>
                                                            </div>
                                                        </div>
                                                    </li>
                                                </ul>
                                                <div class="eb-add-social-list">
                                                    <img src="imgs/imgs_email_builder/icn_add.png"> Add Another Service
                                                </div>
												<div class="wrap-btn-update-calendar-email">
													<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Update</a>
												</div>
                                            </div>
                                        </div>
									</div>
									<div class="tab-content eb-style-box">
										<div class="eb-field">
											<label>Container Background Color  <span class="eb-clear-line both" data-type="bgColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="containerSocialBackground" style="background-color: #ffffff;" class="color-box" data-color-start="fffffff"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Container Border  <span class="eb-clear-line" data-type="border"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Type</label>
													<select class="eb-w160" id="containerSocialBorderType">
														<option value="None" selected>None</option>
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
												<div class="eb-inner-field">
													<input id="containerSocialBorderWidth" type="text" class="txt_field touch-spin eb-field-small" value="0"/>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="containerSocialBorderColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
													</div>
												</div>
											</div>
										</div>
                                        <div class="eb-field">
                                            <label>Container Padding
                                                <span class="eb-clear-line" data-type="containerSocialPadding">
                                                        <span class="pr-lbl-link">Clear</span>
                                                    </span>
                                            </label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <input id="containerSocialPadding" type="text" class="txt_field touch-spin eb-field-small" value="5" />
                                                </div>
                                            </div>
                                        </div>
										<div class="eb-field">
											<label>Buttons Background Color  <span class="eb-clear-line both" data-type="bgButtonColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="btnSocialBackground" style="background-color: #fafafa;" class="color-box" data-color-start="fafafa"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Buttons Border  <span class="eb-clear-line" data-type="borderButton"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Type</label>
													<select class="eb-w160" id="btnSocialBorderType">
														<option value="None">None</option>
														<option value="Solid" selected>Solid</option>
														<option value="Dashed">Dashed</option>
														<option value="Dotted">Dotted</option>
														<option value="Double">Double</option>
														<option value="Groove">Groove</option>
														<option value="Ridge">Ridge</option>
														<option value="Inset">Inset</option>
														<option value="Outset">Outset</option>
													</select>
												</div>
												<div class="eb-inner-field">
													<input id="btnSocialBorderWidth" type="text" class="txt_field touch-spin eb-field-small" value="1"/>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="btnSocialBorderColor" style="background-color: #cccccc;" class="color-box" data-color-start="cccccc"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Buttons Border Radius <span class="eb-clear-line" data-type="btnRadius"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<input id="btnSocialBorderRadius"type="text" class="txt_field touch-spin eb-field-small" value="5"/>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Font <span class="eb-clear-line" data-type="font"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="btnSocialTypeFace">
														<?php 
														foreach ($supported_fonts as $supported_item){
															echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Weight</label>
													<select class="eb-w130" id="btnSocialWeight">
														<?php 
														foreach ($supported_font_weights as $supported_item){
															$selected = $supported_item['default'] ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="btnSocialSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 12 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="btnSocialColor" style="background-color: #505050;" class="color-box" data-color-start="505050"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Line Height <span class="eb-clear-line" data-type="lineHeight"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="btnSocialLineHeight">
														<option value="None" selected>Not Specified</option>
														<option value="100">Normal</option>
														<option value="125">Slight</option>
														<option value="150">1 1/2 Spacing</option>
														<option value="200">Double Space</option>
													</select>
												</div>
											</div>
										</div>
										<!--<div class="eb-field">
											<label>Text Align</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<ul id="btnSocialTextAlign" class="eb-text-align clearfix">
														<li class="eb-t-alg-left selected"></li>
														<li class="eb-t-alg-center"></li>
														<li class="eb-t-alg-right"></li>
													</ul>
												</div>
											</div>
										</div>-->
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Align</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="btnSocialAlign">
														<option value="0">Left</option>
														<option value="1">Center</option>
														<option value="2">Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Width</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="btnSocialWidth">
														<option value="0">Fit To Size</option>
														<option value="1">Full Width</option>
													</select>
												</div>
											</div>
										</div>
                                        <div class="eb-field" id="wrap-social-display">
                                            <label>Display</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <select class="eb-w130" id="btnSocialDisplay">
                                                        <option value="0">Icon only</option>
                                                        <option value="1">Text only</option>
                                                        <option value="2">Both icon and text</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Layout</label>
                                            <ul class="eb-wrap-layout-social iconAndTextShare clearfix">
                                                <li class="l-1"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-it-iv-r.png"/></li>
                                                <li class="l-2"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-it-ih-r.png"/></li>
                                            </ul>
                                            <ul class="eb-wrap-layout-social iconOnly clearfix">
                                                <li class="l-1"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social_i_sv_r.png"/></li>
                                                <li class="l-2"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social_i_iv_r.png"/></li>
                                                <li class="l-3"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social_i_ih_r.png"/></li>
                                                <li class="l-4"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social_i_sh_r.png"/></li>
                                            </ul>
                                            <ul class="eb-wrap-layout-social textOnly clearfix">
                                                <li class="l-1"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-t-iv-r.png"/></li>
                                                <li class="l-2"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-t-ih-r.png"/></li>
                                            </ul>
                                            <ul class="eb-wrap-layout-social iconAndText clearfix">
                                                <li class="l-1"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-it-sv-r.png"/></li>
                                                <li class="l-2"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-it-iv-r.png"/></li>
                                                <li class="l-3"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-it-ih-r.png"/></li>
                                                <li class="l-4"><img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/social-it-sh-r.png"/></li>
                                            </ul>
                                        </div>
										<div class="eb-field">
											<label>Icon Style</label>
											<ul class="eb-social-style-icon clearfix">
												<li class="clearfix selected">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/fb.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/tw.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/in.png?v=1"/>
                                                    <img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/pinterest.png?v=1"/>
                                                    <img class="eb-icn-share" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/forward.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/youtube.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/inst.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/vimeo.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/rss.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/email.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black/website.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/google.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/outlook.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/outlook_online.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/icalendar.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black/yahoo.png?v=1"/>
												</li>
												<li class="clearfix">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/fb.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/tw.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/in.png?v=1"/>
                                                    <img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/pinterest.png?v=1"/>
                                                    <img class="eb-icn-share" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/forward.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/youtube.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/inst.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/vimeo.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/rss.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/email.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/black_border/website.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black_border/google.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black_border/outlook.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black_border/outlook_online.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black_border/icalendar.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/black_border/yahoo.png?v=1"/>
												</li>
												<li class="clearfix">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/fb.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/tw.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/in.png?v=1"/>
                                                    <img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/pinterest.png?v=1"/>
                                                    <img class="eb-icn-share" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/forward.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/youtube.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/inst.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/vimeo.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/rss.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/email.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/border/website.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/border/google.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/border/outlook.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/border/outlook_online.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/border/icalendar.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/border/yahoo.png?v=1"/>
												</li>
												<li class="clearfix">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/fb.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/tw.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/in.png?v=1"/>
                                                    <img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/pinterest.png?v=1"/>
                                                    <img class="eb-icn-share" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/forward.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/youtube.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/inst.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/vimeo.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/rss.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/email.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/color/website.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/color/google.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/color/outlook.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/color/outlook_online.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/color/icalendar.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/color/yahoo.png?v=1"/>
												</li>
												<li class="clearfix">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/fb.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/tw.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/in.png?v=1"/>
                                                    <img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/pinterest.png?v=1"/>
                                                    <img class="eb-icn-share" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/forward.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/youtube.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/inst.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/vimeo.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/rss.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/email.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/gray/website.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/gray/google.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/gray/outlook.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/gray/outlook_online.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/gray/icalendar.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/gray/yahoo.png?v=1"/>
												</li>
												<li class="clearfix eb-white-style">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/fb.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/tw.png?v=1"/>
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/in.png?v=1"/>
                                                    <img src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/pinterest.png?v=1"/>
                                                    <img class="eb-icn-share" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/forward.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/youtube.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/inst.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/vimeo.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/rss.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/email.png?v=1"/>
                                                    <img class="eb-icn-follow" src="https://t1.llanalytics.com/imgs/imgs_email_builder/social_btns/white/website.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/white/google.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/white/outlook.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/white/outlook_online.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/white/icalendar.png?v=1"/>
													<img class="eb-icn-calendar" src="https://t1.llanalytics.com/imgs/imgs_email_builder/calendar_btns/white/yahoo.png?v=1"/>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="eb-right-panel-slide" id="eb-box-code">
						<div class="eb-panel-head">
							<span>Code</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="eb-box-code-editor">
								<textarea id="eb-code-editor" name="eb-code"><div class="eb-text-content">Use your own custom HTML</div></textarea>
							</div>
						</div>
					</div>
					<div class="eb-right-panel-slide" id="eb-box-video">
						<div class="eb-panel-head">
							<span>Video</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
							<!-- <a href="javascript:void(0)" class="eb-cancel-panel">Cancel</a> -->
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix eb-three-tabs">
									<li class="selected"><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<div class="eb-video-url">
											<div class="eb-field">
												<label>Video URL</label>
												<input type="text" class="txt_field" id="videoUrlThumbnail" value=""/>
												<div class="eb-field-help-video">
													We'll link the URL above to a video preview image in your email. Preview images will be generated automatically for <a href="http://youtube.com" target="_blank">YouTube</a> and <a href="http://vimeo.com" target="_blank">Vimeo</a> URLs.
													<div class="eb-error-video">Sorry, we can't generate a preview image for that URL. Please upload an image.</div>
												</div>
												
											</div>
										
											<ul class="eb-list-image" id="videoImgUpload">
												<li class="item-image clearfix">
													<img src="https://t1.llanalytics.com/imgs/imgs_email_builder/img_none.png" class="eb-image-item-icon"/>
													<div class="eb-image-item-meta">
														<strong class="eb-image-item-title">Name Image</strong>
														<div style="display: block;" class="eb-size-img">480 � 360</div>
														<ul class="eb-links-image clearfix"><li><a href="javascript:void(0)" class="lnk-img-edit">Edit</a></li></ul>
													</div>
												</li>
											</ul>
										</div>
										<div class="eb-editor-text">
											<textarea id="editor-box-text-video"></textarea>
										</div>
									</div>
									<div class="tab-content eb-style-box">
										<div class="eb-field">
											<label>Background Color  <span class="eb-clear-line" data-type="bgColor"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="videoBackground" style="background-color: #ffffff" class="color-box" data-color-start="ffffff"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Border  <span class="eb-clear-line" data-type="border"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Type</label>
													<select class="eb-w160" id="videoBorderType">
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
												<div class="eb-inner-field">
													<input type="text" class="txt_field touch-spin eb-field-small" id="videoBorderWidth" value="0"/>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="videoBorderColor" style="background-color: rgb(242, 242, 242);" class="color-box" data-color-start="f2f2f2"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Font <span class="eb-clear-line" data-type="font"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w130 dropdown-select-font-name cf-select-font-name" id="videoTypeFace">
														<?php 
														foreach ($supported_fonts as $supported_item){
															echo "<option standard_font='1' value='{$supported_item['value']}'>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Weight</label>
													<select class="eb-w130" id="videoWeight">
														<?php 
														foreach ($supported_font_weights as $supported_item){
															$selected = $supported_item['default'] ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="videoSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="videoTextColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
													</div>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Line Height <span class="eb-clear-line" data-type="lineHeight"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="videoLineHeight">
														<option value="None" selected>Not Specified</option>
														<option value="100">Normal</option>
														<option value="125">Slight</option>
														<option value="150">1 1/2 Spacing</option>
														<option value="200">Double Space</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Text Align <span class="eb-clear-line" data-type="textAlign"><span class="pr-lbl-link">Clear</span></span></label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<ul class="eb-text-align clearfix" id="videoTextAlign">
														<li class="eb-t-alg-left selected"></li>
														<li class="eb-t-alg-center"></li>
														<li class="eb-t-alg-right"></li>
													</ul>
												</div>
											</div>
										</div>
										<div class="wrap-btn-clear-all">
											<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Clear All</a>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Caption Position</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="videoPosition">
														<option value="0">Left</option>
														<option value="1">Top</option>
														<option value="2">Right</option>
														<option value="3">Bottom</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field image-alignment-video-wrap">
											<label>Image Alignment</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="videoImgAlignment">
														<option value="0">Left</option>
														<option value="1">Center</option>
														<option value="2">Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field caption-width-video-wrap">
											<label>Caption Width</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w130" id="videoCaptionWidth">
														<option value="0">One-Third</option>
														<option value="1">Half</option>
														<option value="2">Two-Thirds</option>
														<option value="3">Three-Quarters</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Margins</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<div class="eb-checkbox">
														<label><input type="checkbox" id="image-edge-video"/> Image Edge To Edge</label>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
                    <div class="eb-right-panel-slide" id="eb-column-2">
                        <div class="eb-panel-head">
                            <span>Column 2</span>
                            <a href="#" class="eb-save-panel">Save</a>
                            <a href="#" class="eb-cancel-panel">Cancel</a>
                        </div>
                        <div class="eb-panel-content">
                            <div class="tabs-editor">
                                <ul class="clearfix eb-three-tabs">
                                    <li class="selected">
                                        <a href="#">
                                            <i class="eb-icn-style"></i>Style</a>
                                    </li>
                                </ul>
                                <div class="wrap-tabs-content">
                                    <div class="tab-content eb-style-box">
                                        <div class="eb-field">
                                            <label>Background Color</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="column2Background" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Border Top</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <label>Type</label>
                                                    <select class="eb-w160" id="column2BorderTopType">
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
                                                <div class="eb-inner-field">
                                                    <input id="column2BorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0" />
                                                </div>
                                                <div class="eb-inner-field">
                                                    <label class="eb-text-center">Color</label>
                                                    <div class="wrap-color">
                                                        <div id="column2BorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Border Bottom</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <label>Type</label>
                                                    <select class="eb-w160" id="column2BorderBottomType">
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
                                                <div class="eb-inner-field">
                                                    <input id="column2BorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0" />
                                                </div>
                                                <div class="eb-inner-field">
                                                    <label class="eb-text-center">Color</label>
                                                    <div class="wrap-color">
                                                        <div id="column2BorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eb-right-panel-slide" id="eb-column-3">
                        <div class="eb-panel-head">
                            <span>Column 2</span>
                            <a href="#" class="eb-save-panel">Save</a>
                            <a href="#" class="eb-cancel-panel">Cancel</a>
                        </div>
                        <div class="eb-panel-content">
                            <div class="tabs-editor">
                                <ul class="clearfix eb-three-tabs">
                                    <li class="selected">
                                        <a href="#">
                                            <i class="eb-icn-style"></i>Style</a>
                                    </li>
                                </ul>
                                <div class="wrap-tabs-content">
                                    <div class="tab-content eb-style-box">
                                        <div class="eb-field">
                                            <label>Background Color</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="column3Background" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Border Top</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <label>Type</label>
                                                    <select class="eb-w160" id="column3BorderTopType">
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
                                                <div class="eb-inner-field">
                                                    <input id="column3BorderTopWidth" type="text" class="txt_field touch-spin eb-field-small" value="0" />
                                                </div>
                                                <div class="eb-inner-field">
                                                    <label class="eb-text-center">Color</label>
                                                    <div class="wrap-color">
                                                        <div id="column3BorderTopColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Border Bottom</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <label>Type</label>
                                                    <select class="eb-w160" id="column3BorderBottomType">
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
                                                <div class="eb-inner-field">
                                                    <input id="column3BorderBottomWidth" type="text" class="txt_field touch-spin eb-field-small" value="0" />
                                                </div>
                                                <div class="eb-inner-field">
                                                    <label class="eb-text-center">Color</label>
                                                    <div class="wrap-color">
                                                        <div id="column3BorderBottomColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="eb-right-panel-slide" id="eb-box-countdown">
						<div class="eb-panel-head">
							<span>Countdown</span>
							<a href="javascript:void(0)" class="eb-save-panel">Save & Close</a>
						</div>
						<div class="eb-panel-content">
							<div class="tabs-editor">
								<ul class="clearfix">
									<li><a href="javascript:void(0)"><i class="eb-icn-content"></i>Content</a></li>
									<li class="selected"><a href="#"><i class="eb-icn-style"></i>Style</a></li>
									<li><a href="javascript:void(0)"><i class="eb-icn-settings"></i>Settings</a></li>
								</ul>
								<div class="wrap-tabs-content">
									<div class="tab-content eb-content-box">
										<div class="eb-content-countdown">
											<div class="eb-tpl-columns">
												<div class="t-wrap-field-col clearfix">
													<div class="t-field-col-1">
														<div class="t-field">
															<div class="label"><label>Template</label></div>
															<select id="countdownTemplate">
																<option value="1" selected>Template 1</option>
																<option value="2">Template 2</option>
																<option value="3">Template 3</option>
																<option value="4">Template 4</option>
																<option value="5">Template 5</option>
																<option value="6">Template 6</option>
																<option value="7">Template 7</option>
																<option value="8">Template 8</option>
																<option value="9">Template 9</option>
															</select>
														</div>
													</div>
													<div class="t-field-col-2">
														<div class="t-field">
															<div class="label"><label>Timer Name</label></div>
															<input id="countdownName"type="text" class="txt-field" value="Untitled timer"/>
														</div>
													</div>
												</div>
												<div class="t-wrap-field-col clearfix">
													<div class="t-field-col-1">
														<div class="t-field">
															<div class="label"><label>End Date & Time</label></div>
															<input type="text" class="txt-field" id="countdown-end-date-time"/>
														</div>
													</div>
													<div class="t-field-col-2">
														<div class="t-field">
															<div class="label"><label>Timezone</label></div>
															<select id="countdowmTimezone">
																<?php 
																foreach ($supported_calendar_timezones as $k => $v) {
																	$selected = (stripos($time_zone_info['description'], $k) !== false) ? "selected='selected'" : "";
																	echo "<option value='{$k}' $selected>{$v}</option>";
																}
																?>
															</select>
														</div>
													</div>
												</div>
											</div>
											<div class="eb-tpl-columns eb-wrap-countdown-labels">
												<div class="t-wrap-field-col clearfix">
													<div class="t-field-col-1">
														<div class="t-field">
															<div class="label"><label>Labels</label></div>
															<select id="countdownLabels">
																<option selected value="0">Default</option>
																<option value="1">Custom</option>
															</select>
														</div>
													</div>
													<div class="t-field-col-2">
														<div class="t-field">
															<div class="label"><label>Labels Language</label></div>
																<select id="countdownLabelsLeng">
																<option value="ar">Arabic</option>
																<option value="bg">Bulgarian</option>
																<option value="cs">Czech</option>
																<option value="da">Danish</option>
																<option value="de">German</option>
																<option value="el">Greek</option>
																<option value="en" selected>English</option>
																<option value="es">Spanish</option>
																<option value="fa">Farsi</option>
																<option value="fi">Finnish</option>
																<option value="fr">French</option>
																<option value="he">Hebrew</option>
																<option value="hi">Hindi</option>
																<option value="hu">Hungarian</option>
																<option value="it">Italian</option>
																<option value="ja">Japanese</option>
																<option value="ko">Korean</option>
																<option value="lt">Lithuanian</option>
																<option value="nl">Dutch</option>
																<option value="no">Norwegian</option>
																<option value="pl">Polish</option>
																<option value="pt">Portuguese</option>
																<option value="ro">Romanian</option>
																<option value="ru">Russian</option>
																<option value="sk">Slovak</option>
																<option value="sv">Swedish</option>
																<option value="th">Thai</option>
																<option value="tr">Turkish</option>
																<option value="ua">Ukrainian</option>
																<option value="vi">Vietnamese</option>
																<option value="zh">Chinese</option>
															</select>
														</div>
													</div>
												</div>
												<div class="countdown-day-labels countdown-custom-labels countdown-custom-labels--hide">
													<div class="t-wrap-field-col clearfix">
														<div class="t-field-col-1">
															<div class="t-field">
																<div class="label"><label>Days</label></div>
																<input id="countdownCustomDays"type="text" class="txt-field" value="Days"/>
															</div>
														</div>
														<div class="t-field-col-2">
															<div class="t-field">
																<div class="label"><label>Hours</label></div>
																<input id="countdownCustomHours"type="text" class="txt-field" value="Hours"/>
															</div>
														</div>
													</div>
													<div class="t-wrap-field-col clearfix">
														<div class="t-field-col-1">
															<div class="t-field">
																<div class="label"><label>Minutes</label></div>
																<input id="countdownCustomMinutes"type="text" class="txt-field" value="Minutes"/>
															</div>
														</div>
														<div class="t-field-col-2">
															<div class="t-field">
																<div class="label"><label>Seconds</label></div>
																<input id="countdownCustomSeconds"type="text" class="txt-field" value="Seconds"/>
															</div>
														</div>
													</div>
												</div>
											</div>
											<div class="eb-countdown-generation">
												<a href="javascript:void(0)" class="t-btn-gray t-btn-big">Generator</a>
											</div>
										</div>
									</div>
									<div class="tab-content eb-style-box">
										<div class="eb-field">
                                            <label>Background Color Box</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="countdownBackgroundBox" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Background Color</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="countdownBackground" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
                                            <label>Primary Color</label>
                                            <div class="eb-right">
                                                <div class="eb-inner-field">
                                                    <div class="wrap-color">
                                                        <div id="countdownPrimaryColor" style="background-color: #ffffff;" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="eb-field">
											<label>Font</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<label>Typeface</label>
													<select class="eb-w160" id="countdownTypeFace">
														<option selected value="ArialUnicode">Arial</option>
														<option value="Arial_Black">Arial Black</option>
														<option value="Arsenal-Regular">Arsenal Regular</option>
														<option value="Arsenal-Bold">Arsenal Bold</option>
														<option value="ComicSansMS">Comic Sans MS</option>
														<option value="CourierNew">Courier New</option>
														<option value="CurlzMT">Curlz MT</option>
														<option value="Inter-Light">Inter Light</option>
														<option value="Inter-Regular">Inter Regular</option>
														<option value="Inter-Bold">Inter Bold</option>
														<option value="Inter-Black">Inter Black</option>
														<option value="AvenirNext">AvenirNext</option>
														<option value="Lucida-grande">Lucida-grande</option>
														<option value="MyriadApple">MyriadApple</option>
														<option value="Myriad-Pro-Bold">Myriad Pro Bold</option>
														<option value="MyriadPro-Semibold">MyriadPro Semibold</option>
														<option value="MyriadPro-Regular">MyriadPro Regular</option>
														<option value="Roboto-Black">Roboto-Black</option>
														<option value="Roboto-Bold">Roboto-Bold</option>
														<option value="Roboto-Medium">Roboto-Medium</option>
														<option value="Roboto-Regular">Roboto-Regular</option>
														<option value="Roboto-Light">Roboto-Light</option>
														<option value="Roboto-Thin">Roboto-Thin</option>
														<option value="RobotoCondensed-Bold">RobotoCondensed-Bold</option>
														<option value="RobotoCondensed-Regular">RobotoCondensed-Regular</option>
														<option value="RobotoCondensed-Light">RobotoCondensed-Light</option>
														<option value="SpicyRice">SpicyRice</option>
														<option value="BebasNeue">BebasNeue</option>
														<option value="OpenSans-ExtraBold">OpenSans-ExtraBold</option>
														<option value="OpenSans-Bold">OpenSans-Bold</option>
														<option value="OpenSans-Semibold">OpenSans-Semibold</option>
														<option value="OpenSans-Regular">OpenSans-Regular</option>
														<option value="OpenSans-Light">OpenSans-Light</option>
														<option value="bitrix_captcha">bitrix_captcha</option>
														<option value="cac_champagne-webfont">cac_champagne</option>
														<option value="ClaireHandBold">ClaireHandBold</option>
														<option value="DroidSerifBold">Droid Serif Bold</option>
														<option value="DroidSerif-Regular">Droid Serif Regular</option>
														<option value="FreeSans">FreeSans</option>
														<option value="DejaVuSansCondensed">DejaVuSansCondensed</option>
														<option value="PT_Sans-Web-Regular">PT Sans Regular</option>
														<option value="PT_Sans-Web-Bold">PT Sans Bold</option>
														<option value="Helvetica">Helvetica</option>
														<option value="HelveticaNw">Helvetica-Narrow</option>
														<option value="HelveticaNarrowBold">Helvetica-Narrow Bold</option>
														<option value="Georgia">Georgia</option>
														<option value="Gilroy-Light">Gilroy Light</option>
														<option value="Gilroy-Bold">Gilroy Bold</option>
														<option value="Gotham_Bold_Regular">Gotham Bold</option>
														<option value="gotham-medium">Gotham Medium</option>
														<option value="Impact">Impact</option>
														<option value="LucidaConsole">Lucida Console</option>
														<option value="PalatinoLinotype">Palatino Linotype</option>
														<option value="PalatinoLinotypeBold">Palatino Linotype Bold</option>
														<option value="Tahoma">Tahoma</option>
														<option value="TahomaBold">Tahoma Bold</option>
														<option value="TimesNewRoman">Times New Roman</option>
														<option value="TrebuchetMS">Trebuchet MS</option>
														<option value="Tungsten-Medium">Tungsten Medium</option>
														<option value="Tungsten-Semibold">Tungsten Semibold</option>
														<option value="Verdana">Verdana</option>
														<option value="MicrosoftSansSerif">MS Sans Serif</option>
														<option value="PTSerif">MS Serif</option>
														<option value="RADIOLAND">Radioland</option>
														<option value="BALLSONTHERAMPAGE">Balls on the rampage</option>
														<option value="HIGHSPEED">HIGHSPEED</option>
														<option value="Codystar-Regular">Codystar</option>
														<option value="digital-7">Digital Counter</option>
														<option value="Crysta">Crysta</option>
														<option value="ASTRONAU">Astronaut III</option>
														<option value="progbot">PROG.BOT</option>
														<option value="Depressionist_3_Revisited_2010">Depressionist 3 Revisited</option>
														<option value="csnpwdtNFI">csnpwdtNFI</option>
														<option value="metallord">metal lord</option>
														<option value="fightingspiritTBS">fighting spirit TBS</option>
														<option value="shloprg">Shlop rg</option>
														<option value="Almostliketheblues">Almost like the blues</option>
														<option value="FunnyKid">FunnyKid</option>
														<option value="Walkwithmenow">Walk with me now</option>
														<option value="OleoScript-Regular">Oleo Script</option>
														<option value="KaushanScript">KaushanScript</option>
														<option value="MarketingScript">Marketing Script</option>
														<option value="SpacedockStencil">Spacedock Stencil</option>
														<option value="vpssolah">VPS Son La Hoa</option>
													</select>
												</div>
												<div class="eb-inner-field">
													<label>Size</label>
													<select class="eb-w70" id="countdownFontSize">
														<?php 
														foreach ($supported_font_sizes as $supported_item){
															$selected = $supported_item['value'] == 14 ? "selected='selected'" : '';
															echo "<option value='{$supported_item['value']}' {$selected}>{$supported_item['label']}</option>";
														}
														?>
													</select>
												</div>
												<div class="eb-inner-field">
													<div class="wrap-color">
														<div id="countdownTextColor" style="background-color: #333333;" class="color-box" data-color-start="333333"></div>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div class="tab-content eb-settings-box">
										<div class="eb-field">
											<label>Align</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w160" id="countdownAlign">
														<option value="0">Left</option>
														<option selected value="1">Center</option>
														<option value="2">Right</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>Days</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w160" id="countdownIsDays">
														<option selected value="1">Show</option>
														<option value="0">Hide</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field">
											<label>After Count</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<select class="eb-w160" id="countdownAfterCount">
														<option selected value="0">Show Zeros</option>
														<option value="1">Show Expiration Message</option>
													</select>
												</div>
											</div>
										</div>
										<div class="eb-field countdown-field-after-count countdown-field-after-count--hide" class="countdownFieldAfterCount">
											<label>Expired Message</label>
											<div class="eb-right">
												<div class="eb-inner-field">
													<input id="countdownExpiredMessage"type="text" class="txt_field" value="This offer has expired"/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
                </div>
					<!--end panels-->
				</div>
			</div>
		</div>
		<?php 
		include 'll-email-builder-preview-content.php';
		include 'll-email-builder-popups.php';
		?>
		<div id="container_HTML_hidden" style="display: none;"></div>
        <div id="container_HTML_hidden_1" style="display: none;"></div>
	</div>
</body>
</html>