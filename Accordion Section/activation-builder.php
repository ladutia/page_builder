<?php
/**
 * Created by PhpStorm.
 * User: Asmaa Ali
 * Date: 22/10/2018
 * Time: 11:24 AM
 */

include_once 'page_settings_constants.php';
define ( 'VERY_TOP_MENU', VERY_TOP_MENU_LL_ACTIVATION_BUILDER );
define ( 'TOP_MENU', '' );
define ( 'LEFT_MENU', '' );
define ( 'SUB_TOP_MENU', '' );
define ( 'WINDOW_TITLE', 'Build Activation' );
define ( 'PAGE_TITLE', 'Build Activation' );
SetHelpTileAndBody ();

require_once ("mysql_connect.php"); // connect to the db
include "configuration.inc";
require_once ("passport.php");
require_once ('DAL/fields.php');
require_once 'DAL/ll_customer_applications.php';
require_once 'DAL/ll_customer_security_profiles_permissions.php';
require_once 'DAL/ll_activations.php';
require_once 'DAL/ll_users.php';
require_once 'DAL/ll_completion_actions_manager.php';
require_once 'DAL/LL_Leaderboards_Manager.php';
require_once 'DAL/LL_Activations_Manager.php';

$userID = intval ( $_COOKIE ["userID_ck"] );
$customerID = intval ( $_COOKIE ["customerID_ck"] );
$tUnixDate = time (); // grab current unix timestamp from server
$datetime_now = gmdate ( "Y-m-d H:i:s", $tUnixDate ); // gets GMT time from the current time

$theme_color = ll_private_labels_manager::get_branding_theme_color ($customerID);
$theme_border_color = ll_private_labels_manager::get_branding_theme_color ($customerID, 'border');
$theme_hover_color = ll_private_labels_manager::get_branding_theme_color ($customerID, 'hover');

if(!ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$ACTIVATIONS )){
    LL_Database::mysql_close ();
    HEADER ( "location: notauthorized.php" );
    exit ();
}

$step = (!trim($_GET['step']) || trim($_GET['step']) == 'undefined') ? 'setup' : trim($_GET['step']);

$ll_activation_id = intval($_GET['ll_activation_id']);
$ll_activation = new ll_activations( $customerID, $ll_activation_id );
$ll_activation_identifier = new ll_activation_identifiers($ll_activation->ll_activation_identifier_id, true);
$points_info = $ll_activation_identifier->points_info;

$stations = [];
$event_webview = '';

$is_deleted_event = 0;
if($ll_activation->ll_activation_id){

    $ll_activation_identifier = new ll_activation_identifiers($ll_activation->ll_activation_identifier_id);

    $is_accept_leaderboard = $ll_activation_identifier->is_accept_leaderboard;
    $is_accept_prizes_only = ($ll_activation_identifier->leaderboard_main_result_type_id == LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_PRESENTS_ID || trim($ll_activation->activation_mode) == strval(LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_PRESENTS_ID)) ? 1 : 0;
    if($is_accept_prizes_only){
        $is_accept_leaderboard = 0;
    }

    if($ll_activation->event_id) {
        // --- Form
        $stations = form_stations::get_all_station($ll_activation->event_id);
        $event = form::get_form_by_id($customerID, $ll_activation->event_id);
        if (!$event->id) {
            /*LL_Database::mysql_close();
            HEADER("location: notauthorized.php");
            exit ();*/
            $is_deleted_event = 1;
        }
        if ($event->event_web_access_token && defined('CAPTURE_PORTAL_WEB_VIEW_BASE')) {
            $event_webview = CAPTURE_PORTAL_WEB_VIEW_BASE . "/#/event/{$event->id}/{$event->event_web_access_token}/preview";
            //$event_webview = CAPTURE_PORTAL_WEB_VIEW_BASE . "/#/activation/{$ll_activation->ll_activation_id}/{$event->event_web_access_token}/preview";
        }
    }
} else {
    LL_Database::mysql_close ();
    HEADER ( "location: notauthorized.php" );
    exit ();
}

//$ll_activation_identifiers = ll_activation_identifiers::load_all();
$ll_events = form::get_device_forms_by_customer_id($customerID, $userID, true);

$EVENTS_PERMISSION = ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$DEVICE_FORMS) && (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::MANAGE_DEVICE_FORMS) || ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::MANAGE_DEVICE_FORMS_WITH_ACCESS));
$SHARED_PRIZES_PERMISSION = ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::SHARED_PRIZES);
$MANAGE_LEADERBOARDS_PERMISSION = ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::MANAGE_LEADERBOARDS);

$assign_modes = (new LL_Leaderboards_Manager())->load_assign_modes();

$is_applicable = $ll_activation_identifier->is_accept_leaderboard;
if($ll_activation->activation_mode) {
    $is_applicable = (trim($ll_activation->activation_mode) == strval(LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_PRESENTS_ID)) ? 0 : $is_applicable;
}

$ll_guidelines = (new ll_activation_guidelines())->get_per_customer($customerID, array('is_active'=> 1));
$ll_guidelines = array_column(object_2_array($ll_guidelines), 'guideline_name', 'll_activation_guideline_id');

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
    include 'header-messages.php';
    ?>
    <link type="text/css" href="js/colpick/css/colpick.css" rel="stylesheet" />
   <!-- <link href='http://fonts.googleapis.com/css?family=Open+Sans:400italic,600italic,700italic,400,600,700' rel='stylesheet' type='text/css'>-->
    <link type="text/css" href="js/jquery-ui-1.8.5.custom/css/ui-lightness/jquery-ui-1.8.5.custom.css" rel="stylesheet" />
    <link rel="stylesheet" type="text/css" href="app_cloud.css"/>
    <link rel="stylesheet" type="text/css" href="js/bootstrap-toggle-master/css/bootstrap-toggle.min.css" />
    <link rel="stylesheet" type="text/css" href="Activations/activation_designer.css<?php include 'll-cache-validator.php';?>"/>
    <link rel="stylesheet" type="text/css" href="Activations/activation_designer_leadboard.css<?php include 'll-cache-validator.php';?>"/>

    <script type="text/javascript" src="js/jquery-1.7.1.js"></script>
    <script type="text/javascript" src="js/jquery-ui-1.9.2.custom.min.js"></script>

    <!-- Code Editor-->
    <link rel="stylesheet" href="js/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="js/codemirror/addon/hint/show-hint.css">
    <script src="js/codemirror/lib/codemirror.js"></script>
    <script src="js/codemirror/addon/hint/show-hint.js"></script>
    <script src="js/codemirror/addon/hint/anyword-hint.js"></script>
    <script src="js/codemirror/mode/javascript/javascript.js"></script>

    <?php
    $hide_support_manager = true;
    include 'javascript_common.php';
    ?>
    <script type="text/javascript" src="js/colpick/js/colpick.js"></script>
    <script type="text/javascript" src="js/jquery.bootstrap-touchspin.js"></script>
    <script src="js/bootstrap-toggle-master/js/bootstrap-toggle.min.js" type="text/javascript"></script>
    <script src="js/context_menu/src/jquery.ui.position.js" type="text/javascript"></script>
    <script src="js/context_menu/src/jquery.contextMenu.js" type="text/javascript"></script>
    <script src="Scripts/jQuery/jquery.json.js" type="text/javascript"></script>
    <script src="js/jquery.inputmask/js/inputmask.js" type="text/javascript"></script>
    <script src="js/jquery.inputmask/js/jquery.inputmask.js" type="text/javascript"></script>
    <script src="js/colpick/js/colpick.js" type="text/javascript"></script>
    <script src="js/jquery.timeentry/jquery.timeentry.js" type="text/javascript"></script>
    <script type="text/javascript" src="js/wizard-header-manager.js<?php include 'll-cache-validator.php';?>"></script>
    <script src="js/ll_folders_panel.js<?php include 'll-cache-validator.php';?>" type="text/javascript"></script>
    <script type="text/javascript" src="js/ll-activation-templates.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript" src="js/ll-chart.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript" src="js/ll-activation-builder.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript" src="js/ll-leaderboard-builder.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript" src="js/ll-shared-prizes-manager.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript" src="js/ll-activation-guidelines-manager.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript">

        ll_activation_id = <?php echo $ll_activation_id;?>;
        ll_leaderboard_id = <?php echo $ll_activation->ll_leaderboard_id;?>;
        ll_activation_identifier_id = <?php echo $ll_activation->ll_activation_identifier_id;?>;
        is_deleted_event = <?php echo $is_deleted_event;?>;

        wizard_header_manager.asset_type = 'ACTIVATION';
        wizard_header_manager.asset_id = <?php echo $ll_activation_id;?>;

        var LL_APP_HTTPS = '<?php echo LL_APP_HTTPS;?>';

        EVENTS_PERMISSION = '<?php echo $EVENTS_PERMISSION ? 1 : 0; ?>';
        SHARED_PRIZES_PERMISSION = '<?php echo $SHARED_PRIZES_PERMISSION ? 1 : 0; ?>';
        MANAGE_LEADERBOARDS_PERMISSION = '<?php echo $MANAGE_LEADERBOARDS_PERMISSION ? 1 : 0; ?>';

        LL_ACTIVATION_CAPTURE_FORM_BEFORE = '<?php echo LL_Activations_Manager::LL_ACTIVATION_CAPTURE_FORM_BEFORE; ?>';
        LL_ACTIVATION_CAPTURE_FORM_AFTER = '<?php echo LL_Activations_Manager::LL_ACTIVATION_CAPTURE_FORM_AFTER; ?>';

        LL_ACTIVATION_DISPLAY_FORM_FULL_SCREEN = '<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_FULL_SCREEN; ?>';
        LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT = '<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT; ?>';
        LL_ACTIVATION_DISPLAY_FORM_SPLIT_RIGHT = '<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_SPLIT_RIGHT; ?>';

        LL_ACTIVATION_WINNER_METHOD_RANDOM = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_RANDOM; ?>';
        LL_ACTIVATION_WINNER_METHOD_TOP_COMPANY = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_TOP_COMPANY; ?>';
        LL_ACTIVATION_WINNER_METHOD_HAND_SELECTED = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_HAND_SELECTED; ?>';
        LL_ACTIVATION_WINNER_METHOD_TOP_SCORE = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_TOP_SCORE; ?>';
        LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY; ?>';
        LL_ACTIVATION_WINNER_METHOD_DIRECT_WIN = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_DIRECT_WIN; ?>';
        LL_ACTIVATION_WINNER_METHOD_LOWEST_TIME = '<?php echo LL_Activations_Manager::LL_ACTIVATION_WINNER_METHOD_LOWEST_TIME; ?>';

        LL_COMPLETION_ACTIONS_ASSET_TYPE_ACTIVATION_PRIZE = '<?php echo ll_completion_actions_manager::LL_ASSET_TYPE_ACTIVATION_PRIZE; ?>';
        LL_COMPLETION_ACTIONS_ACTIVITY_TYPE_SPECIFIC_PRIZE_WON = '<?php echo ll_completion_actions_manager::LL_ACTIVITY_TYPE_SPECIFIC_PRIZE_WON; ?>';

        LL_COMPLETION_ACTIONS_ASSET_TYPE_LEADERBOARD_POINTS_THRESHOLD = '<?php echo ll_completion_actions_manager::LL_ASSET_TYPE_LEADERBOARD_POINTS_THRESHOLD; ?>';
        LL_COMPLETION_ACTIONS_ACTIVITY_TYPE_LEADERBOARD_POINTS_THRESHOLD_GET = '<?php echo ll_completion_actions_manager::LL_ACTIVITY_TYPE_LEADERBOARD_POINTS_THRESHOLD_GET; ?>';

        LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD = '<?php echo LL_Activations_Manager::TEMPLATE_FOR_LEADERBOARD; ?>';
        LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN = '<?php echo LL_Activations_Manager::TEMPLATE_FOR_CAPTURE_SCREEN; ?>';

        LL_ACTIVATION_RESULT_TYPE_SCORE_ID = '<?php echo LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_SCORE_ID;?>';
        LL_ACTIVATION_RESULT_TYPE_PRESENTS_ID = '<?php echo LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_PRESENTS_ID;?>';
        LL_ACTIVATION_RESULT_TYPE_DURATION_ID = '<?php echo LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_DURATION_ID;?>';
        LL_ACTIVATION_RESULT_TYPE_DONE_ID = '<?php echo LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_DONE_ID;?>';
        LL_ACTIVATION_RESULT_TYPE_RIGHT_ID = '<?php echo LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_DONE_ID;?>';
        LL_ACTIVATION_RESULT_TYPE_WINNER_ID = '<?php echo LL_Activations_Manager::LL_ACTIVATION_RESULT_TYPE_WINNER_ID;?>';

        CUSTOM_PROBABILITY_AUTOMATIC = <?php echo LL_Activations_Manager::CUSTOM_PROBABILITY_AUTOMATIC; ?>;
        CUSTOM_PROBABILITY_MANUAL = <?php echo LL_Activations_Manager::CUSTOM_PROBABILITY_MANUAL; ?>;

        ACTIVATION_GUIDLINE_ASSET_TYPE_ACTIVATION = <?php echo ll_activation_guideline_assets::ASSET_TYPE_ACTIVATION; ?>;
        ll_activation_guidelines_manager.guidelines = <?php echo @json_encode($ll_guidelines)?>;
    </script>
    <title>
        <?php
        echo ll_private_labels_manager::get_branding_name($customerID) . ' - ' ;
        echo PAGE_TITLE;
        ?>
    </title>
</head>
<body class="theme activation-designer <?php echo $body_class;?> <?php if(!$EVENTS_PERMISSION){ echo 'no-events'; }?>" >
<div id="mainWrapper">
    <div class="et-top-header et-top-header-gray header-activation">
        <a href="javascript:void(0);" class="db-btn-white btn-exit" id="activation-exit">Exit</a>
        <div class="h-edit-text">
            <span class="t container_activation_name editable_asset_name" contenteditable="true" data-text="Activation Name"><?php echo $ll_activation->ll_activation_name;?></span>
            <a href="javascript:void(0)" class="edit-text"></a>
        </div>
        <a href="javascript:void(0);" id="activation-save-and-exit" class="db-btn-orange btn-next">Save & Exit</a>

        <a href="javascript:void(0);" class="db-btn-orange btn-save" id="activation-save">Save</a>
        <a href="javascript:void(0);" class="db-btn-white btn-launch" style="display: none;">Launch</a>
        <div class="settings-tpl">
            <a href="javascript:void(0)" class="db-btn-white"><i class="icn"></i></a>
            <ul class="">
                <li><a href="javascript:void(0);" class="activation-guidelines">Guidelines</a></li>
                <li><a href="javascript:void(0);" class="activation-settings">Settings</a></li>
                <li><a href="javascript:void(0);" class="leaderboard capture-screen load-activation-templates">Load Template</a></li>
                <li><a href="javascript:void(0);" class="leaderboard capture-screen save-activation-template">Save Template</a></li>
                <li><a href="javascript:void(0);" class="leaderboard capture-screen reset-activation-template"> Reset Layout</a></li>
            </ul>
        </div>

        <a href='activation-game-portal.php?token=<?php echo $ll_activation->ll_activation_token;?>&is_preview=1&activation_preview_token=<?php echo $ll_activation->activation_preview_token;?>' class="db-btn-white btn-preview" target='_blank' id="activation_template_preview"><i class="icn"></i></a>

        <div class="et-title">Activation Designer</div>
    </div>
    <div class="tabs-pages">
        <ul class="clearfix">
            <li id-form="setup" <?php if($step == 'setup'){ echo 'class="selected"';}?> >(1) Setup</li>
            <li id-form="capture-screen"  <?php if($step == 'capture-screen'){ echo 'class="selected"';}?>>(2) Lead Capture</li>
            <li id-form="leaderboard" <?php if($step == 'leaderboard'){ echo 'class="selected"';}?>  style="display: none;">(3) Leaderboard</li>
        </ul>
    </div>
    <div id="custom-activation-designer-page" class="custom-activation-page">
        <div class="tab-content-page setup-content" <?php if($step == 'setup'){ echo 'style="display:block"'; } else { echo 'style="display:none"'; }?> id-form="setup">
            <div class="tab-content-page__inner setup-tab">
                <div class="left-column">
                    <!--<div class="defautl-h">General Configuration</div>-->
                    <div class="h3 ll_std_tooltip event-field" style="display: none"
                         title="Selecting an Event connects the Event and Activation together. This allows you to use the Event's data capture form with your Activation. ">
                        Which Event do you want to use this activation with?</div>
                    <div class="t-field event-field" style="display: none">
                        <select class="textField" id="ll_activation_event_id">
                            <option value="0">--- Select Event ---</option>
                            <?php
                            if(! empty($ll_events)){
                                foreach($ll_events as $form_id=>$form){
                                    $selected = $form_id == $ll_activation->event_id ? 'selected' : '';
                                    echo "<option value='{$form_id}' {$selected}>{$form->name}</option>";
                                }
                            }
                            ?>
                        </select>
                    </div>
                    <?php
                    if(! empty($stations)){ ?>
                    <div class="h3 event-elements">Which Station do you want to use this activation at?</div>
                        <div class="t-field event-elements">
                            <select class="textField" id="ll_activation_event_station_id">
                                <option value="0">--- Select Station ---</option>
                                <?php
                                foreach($stations as $station){
                                    echo "<option value='{$station['station_id']}'>{$station['station_name']}</option>";
                                } ?>
                            </select>
                        </div>
                    <?php }?>
                    <div class="h3 capture-before-or-after ll_std_tooltip event-elements"
                         title="Choosing before shows the lead capture form before the activation. Choosing after shows the lead capture form after the activation. It's typical to show the form before the activation to ensure you're capturing the lead. Otherwise, the lead could play the game and then choose to not fill out the form."
                         style="display: none">Show lead capture form before or after the activation?
                    </div>
                    <div class="t-field capture-before-or-after event-elements" style="display: none">
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="capture_form_before_or_after" value="<?php echo LL_Activations_Manager::LL_ACTIVATION_CAPTURE_FORM_BEFORE;?>" checked="checked" > Before
                            </label>
                        </div>
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="capture_form_before_or_after" value="<?php echo LL_Activations_Manager::LL_ACTIVATION_CAPTURE_FORM_AFTER;?>" > After
                            </label>
                        </div>
                    </div>

                    <div class="h3 skip-capture-step-field ll_std_tooltip"
                         title="Commonly used when more than one Activation/Game is associated with an Event. When enabled, if an Activation/Game capture form has already been submitted then the player will not see the capture form again on subsequent Activations/Games associated with the same Event. They will only experience the Activation/Game play.  "
                         style="display: none">Skip capture step for duplicate submissions
                    </div>
                    <div class="t-field skip-capture-step-field" style="display: none">
                        <div class="ll-switch switch-small inline">
                            <div class="switch">
                                <input id="skip_capture_step_on_duplicate_submissions" name="skip_capture_step_on_duplicate_submissions" class="cmn-toggle cmn-toggle-round" type="checkbox" >
                                <label for="skip_capture_step_on_duplicate_submissions"></label>
                            </div>
                            <div class="ll-switch-lb">
                            </div>
                        </div>
                    </div>

                    <div class="h3" style="display: none;">Which Activation do you want to use?</div>
                    <div class="t-field" style="display: none;">
                        <select class="textField" id="ll_activation_identifier_id">
                            <option value="">--- Select Activation ---</option>
                            <?php
                            /*foreach ($ll_activation_identifiers as $ll_activation_identifier){
                                echo "<option value='{$ll_activation_identifier->ll_activation_identifier_id}'>{$ll_activation_identifier->ll_activation_identifier_name}</option>";
                            }*/
                            ?>
                        </select>
                    </div>
                    <div class="h3 event-elements">Play Restrictions:</div>
                    <div class="t-field event-elements">
                        <div class="t-radio">
                            <label class="ll_std_tooltip"
                                   title="The user is allowed this many game plays across all activations associated with the Event. This total applies to any activation that has the Event Group setting enabled.">
                                <i class="icn-radio"></i>
                                <input type="radio" name="play_restriction" value="1"  > Event Group:
                            </label>
                        </div>
                        <input type="number" id="max_group_plays" class="txt-field txt-field-tiny" style="margin-left: 20px;">
                    </div>
                    <div class="t-field event-elements">
                        <div class="t-radio">
                            <label class="ll_std_tooltip"
                                   title="Limits the number of times this activation can be played. Empty or 0 is unlimited.">
                                <i class="icn-radio"></i>
                                <input type="radio" name="play_restriction" value="0" checked="checked">Individual:
                            </label>
                        </div>
                        <input type="number" id="max_individual_plays" class="txt-field txt-field-tiny" style="margin-left: 38px;">
                    </div>
                    <div class="h3 ll_std_tooltip" title="Changes the background color of the button on the lead capture screen.">Submit Button Background Color</div>
                    <div class="t-field">
                        <div class="wrap-color">
                            <div id="submit_button_background_color" style="background-color: #2BA01B;" class="color-box" data-color-start="2BA01B"></div>
                        </div>
                    </div>
                    <div class="h3 ll_std_tooltip" title="Changes the color of the text on the button shown on the lead capture screen.">Submit Button Text Color</div>
                    <div class="t-field">
                        <div class="wrap-color">
                            <div id="submit_button_text_color" style="background-color: #FFFFFF;" class="color-box" data-color-start="FFFFFF"></div>
                        </div>
                    </div>
                    <div class="h3 ll_std_tooltip" title="Text shown on the button at the bottom of the lead capture screen.">Submit Button Text</div>
                    <div class="t-field">
                        <input id="submit_button_text" type="text" class="txt-field"/>
                    </div>
                    <div class="winners_info" style="display: none;" >

                    </div>
                    <div class="h3 activation_mode_element" style="display: none;">Mode</div>
                    <div class="t-field activation_mode_element" style="display: none;">
                        <?php
                        if(count($ll_activation_identifier->use_activation_mode)){
                            $idx = 0;
                            foreach ($ll_activation_identifier->use_activation_mode as $key=>$lbl){
                                if ($lbl == "Both") $title = "Winning players receive a prize based on the prize probability configured in the Activation/Game and their score is sent to the leaderboard.";
                                if ($lbl == "Prizes") $title = "Winning players receive a prize based on the prize probability configured in the Activation/Game. Leaderboards are not used in this mode.";
                                if ($lbl == "Leaderboard") $title = "Scores are sent to the leaderboard.";
                                $checked = !$idx ? "checked" : "";
                                $idx++;
                                ?>
                                <div class="t-radio">
                                    <label>
                                        <i class="icn-radio"></i>
                                        <input name="activation_mode" value="<?php echo $key;?>" <?php echo $checked;?> type="radio"/>
                                        <span class="fb-wrap-tooltip ll_std_tooltip" title="<?php echo $title;?>"> <?php echo $lbl;?> </span>
                                    </label>
                                </div>
                                <?php
                            }
                        }
                        ?>
                    </div>
                    <div class="h3 activation_leaderboard_element_x ll_std_tooltip" title="Three operating modes control how your Global Leaderboard should work. Initial Points uses the first points earned from each Activation/Game played. Highest Points uses the highest points earned from each Activations/Games played. All Points uses points from every Activation/Game played, including points from playing the same Activation/Game more than once. Note, for all Leaderboard Modes the total points earned per game play is the sum of Game Points plus Prize Points." style="display:none" >Leaderboard Mode</div>
                    <div class="t-field activation_leaderboard_element_x" style="display:none">
                        <select id="leaderboardAssignMode" data-placeholder="--- Select Mode ---">
                            <?php
                            if($assign_modes){
                                foreach ($assign_modes as $key=>$val){
                                    echo "<option value='{$key}'>{$val}</option>";
                                }
                            }
                            ?>
                        </select>
                    </div>

                    <?php
                        if($MANAGE_LEADERBOARDS_PERMISSION) {
                            if ($points_info) {
                                foreach ($points_info as $points_info_row) {
                                    $tooltip_class = trim($points_info_row->tooltip) ? 'll_std_tooltip' : '';
                                    $tooltip = trim($points_info_row->tooltip) ? ' title="' . $points_info_row->tooltip . '"' : '';
                                    echo '<div class="h3 activation_points_element ' . $tooltip_class . '" ' . $tooltip . ' >' . $points_info_row->name . '</div>
                                          <div class="t-field activation_points_element" pointID="' . $points_info_row->ll_activation_result_points_info_id . '">
                                            <input type="number" class="txt-field activation_points_txt" value="' . $points_info_row->default_value . '"/>
                                          </div>';
                                }
                            }
                        }
                    ?>
                    <div class="activation-configuration-elements">

                    </div>
                </div>
                <div class="right-column">
                    <!--<div class="defautl-h">Game Play</div>-->
                    <div class="activation-configuration-elements">

                    </div>

                    <div class="h3 ll_std_tooltip" title="Displays a screensaver on your activation.">Screensaver</div>
                    <div class="t-field">
                        <div class="ll-switch switch-small inline">
                            <div class="switch">
                                <input id="is_enable_screensaver" name="is_enable_screensaver" class="cmn-toggle cmn-toggle-round" type="checkbox" >
                                <label for="is_enable_screensaver"></label>
                            </div>
                            <div class="ll-switch-lb">
                            </div>
                        </div>
                    </div>
                    <div class="h3 screensaver-elements"></div>
                    <div class="t-field screensaver-elements">
                        <div class="t-radio">
                            <label class="ll_std_tooltip" title="Uses the screensaver associated with your Event.">
                                <i class="icn-radio"></i>
                                <input type="radio" name="is_event_screensaver" value="1" checked="checked" > Use event screensaver
                            </label>
                        </div>
                        <div class="t-radio">
                            <label class="ll_std_tooltip" title="Uses a new screensaver (configured below).">
                                <i class="icn-radio"></i>
                                <input type="radio" name="is_event_screensaver" value="0" > Use custom screensaver
                            </label>
                        </div>
                    </div>
                    <div class="h3 screensaver-elements custom ll_std_tooltip" title="Starts the screensaver after this amount of time (in seconds).">Start after (seconds)</div>
                    <div class="t-field screensaver-elements custom">
                        <input id="rotation_period" type="number" min="10" max="600" class="txt-field"/>
                    </div>
                    <div class="h3 screensaver-elements custom ll_std_tooltip" title="Displays the screensaver images in random order.">Randomize</div>
                    <div class="t-field screensaver-elements custom">
                        <div class="ll-switch switch-small inline">
                            <div class="switch">
                                <input id="is_randomize" name="is_randomize" class="cmn-toggle cmn-toggle-round" type="checkbox" >
                                <label for="is_randomize"></label>
                            </div>
                            <div class="ll-switch-lb">
                            </div>
                        </div>
                    </div>
                    <div class="h3 screensaver-elements custom ll_std_tooltip" title="Changes the screensaver image after this amount of time (in seconds).">Change every (seconds)</div>
                    <div class="t-field screensaver-elements custom">
                        <input id="switch_frequency" type="number" class="txt-field"/>
                    </div>
                    <div class="h3 screensaver-elements custom ll_std_tooltip" title="Specifies how each image should transition from one to another within the screensaver effect.">Transition Effect</div>
                    <div class="t-field screensaver-elements custom">
                        <select class="textField" id="transition_effect">
                            <option value="slide">Slide</option>
                            <!-- <option value="coverflow">Coverflow</option>
                             <option value="cube">Cube</option>-->
                            <option value="fade">Fade</option>
                            <option value="flip">Flip</option>
                        </select>
                    </div>
                    <div class="h3 screensaver-elements custom ll_std_tooltip" title="Images you'd like to use for your screensaver.">Images</div>
                    <div class="t-field screensaver-elements custom">
                        <ul class="sc-list-image fb-multiple-field ui-sortable">

                        </ul>
                    </div>

                    <div class="h3 event-elements">Prompts</div>


                    <div class="h3 event-elements">Game Over Action:</div>
                    <div class="t-field event-elements">
                        <div class="t-radio">
                            <label class="ll_std_tooltip" title="Starts the Activation/Game over again.">
                                <i class="icn-radio"></i>
                                <input name="webview_success_action_type"
                                       value="start_over"
                                       type="radio"/>
                                <span>Start over</span>
                            </label>
                        </div>
                        <div class="t-radio">
                            <label class="ll_std_tooltip" title="Displays a modal with your message inside it inside the game.">
                                <i class="icn-radio"></i>
                                <input name="webview_success_action_type"
                                       value="message"
                                       type="radio"/>
                                <span>
                                    Thank you message
                                </span>
                            </label>
                        </div>
                        <div class="t-radio">
                            <label class="ll_std_tooltip" title="Redirects the player to another web page.">
                                <i class="icn-radio"></i>
                                <input name="webview_success_action_type"
                                       value="redirect"
                                       type="radio" />
                                <span>
                                    Redirect
                                </span>
                            </label>
                        </div>
                        <div class="t-radio leaderboard-webview-action-type" <?php echo (!$is_accept_leaderboard)? 'style="display: none;"' : ''; ?>>
                            <label class="ll_std_tooltip" title="Redirects the player to the leaderboard page.">
                                <i class="icn-radio"></i>
                                <input name="webview_success_action_type"
                                       value="display_leaderboard"
                                       type="radio" />
                                <span>
                                Display leaderboard
                            </span>
                            </label>
                        </div>

                    </div>
                    <div class="t-field event-elements">
                        <textarea id="webview-success-message" name="webview_success_message" class="txt-field"></textarea>
                        <button class="t-btn-gray custom-message" id="custom_webview_success_message">Custom Message</button>

                        <div class="webview_success_redirect " >
                            <div class="inline-field" >
                                <select id="button_link_to" style="width: 150px;">
                                    <option value="url">Web Address</option>
                                    <?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$LANDING_PAGES )) {?>
                                        <option value="lp">Landing Page</option>
                                    <?php }?>
                                </select>
                            </div>
                            <?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$LANDING_PAGES )) {?>
                                <div class="inline-field" id="container_button_lp" style="display: none">
                                    <select data-placeholder="Select Landing Page" id="select_button_landing_page" >
                                        <option></option>
                                    </select>
                                </div>
                            <?php }?>
                            <div style="margin-top: 10px;">
                                <input id="buttonUrl" name="webview_success_redirect_url"
                                       value="<?php echo $form->webview_success_redirect_url; ?>" type="text" class="txt_field"/>
                            </div>
                        </div>
                    </div>

                    <div class="h3">Inactivity Action:</div>
                    <div class="h3">Status:</div>
                    <div class="t-field">
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="builder_activation_active_status" value="<?php echo ll_activation_settings::STATUS_FOREVER;?>" checked="checked" >Forever
                            </label>
                        </div>
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="builder_activation_active_status" value="<?php echo ll_activation_settings::STATUS_DATE_RANGE;?>" >Date Range
                            </label>
                        </div>
                        <div class="t-radio inherit-from-event" <?php if(!$ll_activation->event_id){ 'style="display:none;"'; }?> >
                            <label >
                                <i class="icn-radio"></i>
                                <input type="radio" name="builder_activation_active_status" value="<?php echo ll_activation_settings::STATUS_INHERIT_FROM_EVENT;?>" >Inherit from Event
                            </label>
                        </div>
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="builder_activation_active_status" value="<?php echo ll_activation_settings::STATUS_INACTIVE;?>" >Inactive
                            </label>
                        </div>
                    </div>
                    <div class="t-field builder_active_status_date_range" style="display: none">
                        <div class="h3">Date Range:</div>
                        <input type="text" class="txt-field txt-field-medium input-date" id="builder_activation_active_start_date" placeholder="Start date" readOnly="readonly">
                        -
                        <input type="text" class="txt-field txt-field-medium input-date" id="builder_activation_active_end_date" placeholder="End date" readOnly="readonly">
                    </div>
                    <div class="h3 inactive-element" style="display: none">Inactive Action:</div>
                    <div class="t-field inactive-element" style="display: none">
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="builder_activation_inactive_action" value="<?php echo ll_activation_settings::INACTIVE_ACTION_MESSAGE;?>" checked="checked" >Message
                            </label>
                        </div>
                        <div class="t-radio">
                            <label>
                                <i class="icn-radio"></i>
                                <input type="radio" name="builder_activation_inactive_action" value="<?php echo ll_activation_settings::INACTIVE_ACTION_REDIRECT;?>" >Redirect
                            </label>
                        </div>
                    </div>
                    <div class="h3 inactive-element inactive_message" style="display: none">Message:</div>
                    <div class="t-field inactive_message inactive-element">
                        <textarea class="txt-field" id="builder_activation_inactive_message">This game is no longer available.</textarea>
                        <button class="t-btn-gray custom-message" id="custom_activation_inactive_message">Custom Message</button>
                    </div>
                    <div class="h3 inactive_redirect inactive-element" style="display: none">Redirect:</div>
                    <div class="t-field inactive_redirect inactive-element">
                        <input class="txt-field txt-field-large" id="builder_activation_inactive_redirect_url">
                    </div>

                    <div class="h3">Instructions:</div>
                    <div class="t-field event-elements">
                        <span class="hint instructions-hint">
                            You have instructions with your Activation:
                            <a id="edit_activation_instructions" class="ll_std_tooltip" title="Edit"><svg  width="13px" height="13px" fill="#A6A6A6" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 469.336 469.336" style="enable-background:new 0 0 469.336 469.336;" xml:space="preserve"><g><g><g><path d="M347.878,151.357c-4-4.003-11.083-4.003-15.083,0L129.909,354.414c-2.427,2.429-3.531,5.87-2.99,9.258     c0.552,3.388,2.698,6.307,5.76,7.84l16.656,8.34v28.049l-51.031,14.602l-51.51-51.554l14.59-51.075h28.025l8.333,16.67     c1.531,3.065,4.448,5.213,7.833,5.765c0.573,0.094,1.146,0.135,1.708,0.135c2.802,0,5.531-1.105,7.542-3.128L317.711,136.26     c2-2.002,3.125-4.712,3.125-7.548c0-2.836-1.125-5.546-3.125-7.548l-39.229-39.263c-2-2.002-4.708-3.128-7.542-3.128h-0.021     c-2.844,0.01-5.563,1.147-7.552,3.159L45.763,301.682c-0.105,0.107-0.1,0.27-0.201,0.379c-1.095,1.183-2.009,2.549-2.487,4.208     l-18.521,64.857L0.409,455.73c-1.063,3.722-0.021,7.736,2.719,10.478c2.031,2.033,4.75,3.128,7.542,3.128     c0.979,0,1.958-0.136,2.927-0.407l84.531-24.166l64.802-18.537c0.195-0.056,0.329-0.203,0.52-0.27     c0.673-0.232,1.262-0.61,1.881-0.976c0.608-0.361,1.216-0.682,1.73-1.146c0.138-0.122,0.319-0.167,0.452-0.298l219.563-217.789     c2.01-1.991,3.146-4.712,3.156-7.558c0.01-2.836-1.115-5.557-3.125-7.569L347.878,151.357z"/><path d="M456.836,76.168l-64-64.054c-16.125-16.139-44.177-16.17-60.365,0.031l-39.073,39.461     c-4.135,4.181-4.125,10.905,0.031,15.065l108.896,108.988c2.083,2.085,4.813,3.128,7.542,3.128c2.719,0,5.427-1.032,7.51-3.096     l39.458-39.137c8.063-8.069,12.5-18.787,12.5-30.192S464.899,84.237,456.836,76.168z"/></g></g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g></svg></a>
                            <a id="remove_activation_instructions" class="ll_std_tooltip" title="Remove"><svg width="13px" height="13px"><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g transform="translate(-915.000000, -620.000000)" fill="#A6A6A6"><g transform="translate(915.000000, 187.000000)"><path d="M6.17330432,433.173538 C2.85966529,433.173538 0.173538462,435.859665 0.173538462,439.173304 C0.173538462,442.486943 2.85966529,445.173538 6.17330432,445.173538 C9.48694334,445.173538 12.1735385,442.486943 12.1735385,439.173304 C12.1735385,435.859665 9.48694334,433.173538 6.17330432,433.173538 L6.17330432,433.173538 Z M8.88003602,441.230982 L8.23004578,441.880504 C8.11109944,441.999919 7.91628968,441.999919 7.79734334,441.880504 L6.17330432,440.256465 L4.54973358,441.880036 C4.43031895,441.999451 4.23597749,441.999451 4.11656285,441.879099 L3.46657261,441.230982 C3.34809456,441.111099 3.34809456,440.917695 3.46657261,440.797343 L5.09061163,439.173773 L3.4670409,437.550202 C3.34809456,437.430319 3.34809456,437.235509 3.4670409,437.117031 L4.11703114,436.467041 C4.23644578,436.34669 4.43125553,436.34669 4.55020188,436.467041 L6.17330432,438.09108 L7.79734334,436.467041 C7.91675797,436.34669 8.11156773,436.34669 8.23004578,436.467041 L8.88003602,437.116095 C8.99898236,437.235509 8.99898236,437.430319 8.88050432,437.550202 L7.25646529,439.173773 L8.88050432,440.797343 C8.99851407,440.917695 8.99851407,441.111099 8.88003602,441.230982 L8.88003602,441.230982 Z" id="Shape"></path></g></g></g></svg></a>
                        </span>
                        <a href="javascript:void(0);" class="t-btn-gray ll_std_tooltip tooltipstered" id="add_activation_instructions">Add
                            Instructions</a>
                    </div>

                    <div class="h3">Guidelines:</div>
                    <div id="builder_activation_guidelines" class="guidelines-assets-list">

                    </div>
                </div>
            </div>
        </div>
        <div class="tab-content-page capture-screen-content" <?php if($step == 'capture-screen'){ echo 'style="display:block"'; } else { echo 'style="display:none"'; }?> id-form="capture-screen">
            <div id="capture-screen-content">
                <div class="wrap-preview-col form-preview">
                    <?php if($ll_activation->event_id){?>
                        <div class="preview-col">
                            <!--<iframe id='form-preview-iframe' src='view-form.php?ll_custID=<?php /*echo $customerID;*/?>&ll_is_preview=1&id=<?php /*echo $ll_activation->event_id;*/?>' width='100%' height='100%' type='text/html' frameborder='0' allowTransparency='true' style='border: 0'></iframe>-->
                            <!--<iframe id='form-preview-iframe' src='activation-game-portal.php?token=3Tpf0otgECsnLKNI' width='100%' height='100%' type='text/html' frameborder='0' allowTransparency='true' style='border: 0'></iframe>-->

                            <?php if(trim($event_webview)){ ?>
                                <iframe id='form-preview-iframe' src='<?php echo $event_webview;?>' width='100%' height='100%' type='text/html' frameborder='0' allowTransparency='true' style='border: 0'></iframe>
                            <?php } else { ?>
                                <img src="imgs/activation-form-message.png" />
                            <?php } ?>
                        </div>
                    <?php } else {?>
                        <div class="preview-col no-html">
                            <div class="help-box">
                                <div class="help-box__text">Create a form at Form tab</div>
                            </div>
                        </div>
                    <?php }?>
                </div>
                <div class="tool-col">
                    <div id="capture-screen-html" class="custom-html no-html">
                        <div class="custom-html__content"></div>
                        <div class="help-box">
                            <div class="help-box__icn">
                                <svg width="120px" height="110px" viewBox="0 0 80 70" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
                            </div>
                            <div class="help-box__text">Click here to open HTML editor</div>
                        </div>
                    </div>
                </div>
                <div class="capture-screen__btns">
                    <div display-type="<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_FULL_SCREEN;?>" class="display_capture_form btn-capture-screen-form-fullscreen"><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>full screen</title><desc>Created with Sketch.</desc><g id="full-screen" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M8.04940029,0.237548646 C8.02069238,0.238601011 7.99206765,0.24270231 7.96375229,0.249930108 L1.54014103,0.249930108 C0.892400114,0.249930108 0.354955847,1.06396987 0.354955847,2.04507041 L0.354955847,13.9634153 C0.354955847,14.9445161 0.892400114,15.7585556 1.54014103,15.7585556 L7.95912237,15.7585556 C8.02311729,15.7745764 8.08841455,15.7745764 8.15240948,15.7585556 L14.5771781,15.7585556 C15.2249191,15.7585556 15.7623633,14.9445161 15.7623633,13.9634153 L15.7623633,2.04507041 C15.7623633,1.06396987 15.2249191,0.249930108 14.5771781,0.249930108 L8.15009481,0.249930108 C8.11682173,0.241506314 8.08313454,0.237548646 8.04940029,0.237548646 Z M1.57717807,1.43094179 L14.5771781,1.43094179 L14.5771781,14.4823843 L1.57717807,14.4823843 L1.57717807,1.43094179 Z" id="Shape" fill="#000000" fill-rule="nonzero" transform="translate(8.058660, 8.004060) rotate(-90.000000) translate(-8.058660, -8.004060) "></path><path d="M3.31791881,7.42300312 C2.99063896,7.42300312 2.72532622,7.68831586 2.72532622,8.01559571 C2.72532622,8.34287557 2.99063896,8.60818831 3.31791881,8.60818831 C3.64519866,8.60818831 3.9105114,8.34287557 3.9105114,8.01559571 C3.9105114,7.68831586 3.64519866,7.42300312 3.31791881,7.42300312 Z M5.68828918,7.42300312 C5.36100933,7.42300312 5.09569659,7.68831586 5.09569659,8.01559571 C5.09569659,8.34287557 5.36100933,8.60818831 5.68828918,8.60818831 C6.01556903,8.60818831 6.28088177,8.34287557 6.28088177,8.01559571 C6.28088177,7.68831586 6.01556903,7.42300312 5.68828918,7.42300312 Z M8.05865955,7.42300312 C7.7313797,7.42300312 7.46606696,7.68831586 7.46606696,8.01559571 C7.46606696,8.34287557 7.7313797,8.60818831 8.05865955,8.60818831 C8.3859394,8.60818831 8.65125214,8.34287557 8.65125214,8.01559571 C8.65125214,7.68831586 8.3859394,7.42300312 8.05865955,7.42300312 Z M10.4290299,7.42300312 C10.1017501,7.42300312 9.83643733,7.68831586 9.83643733,8.01559571 C9.83643733,8.34287557 10.1017501,8.60818831 10.4290299,8.60818831 C10.7563098,8.60818831 11.0216225,8.34287557 11.0216225,8.01559571 C11.0216225,7.68831586 10.7563098,7.42300312 10.4290299,7.42300312 Z M12.7994003,7.42300312 C12.4721204,7.42300312 12.2068077,7.68831586 12.2068077,8.01559571 C12.2068077,8.34287557 12.4721204,8.60818831 12.7994003,8.60818831 C13.1266801,8.60818831 13.3919929,8.34287557 13.3919929,8.01559571 C13.3919929,7.68831586 13.1266801,7.42300312 12.7994003,7.42300312 Z M15.1697707,7.42300312 C14.8424908,7.42300312 14.5771781,7.68831586 14.5771781,8.01559571 C14.5771781,8.34287557 14.8424908,8.60818831 15.1697707,8.60818831 C15.4970505,8.60818831 15.7623633,8.34287557 15.7623633,8.01559571 C15.7623633,7.68831586 15.4970505,7.42300312 15.1697707,7.42300312 Z M10.4353864,12.1637439 C10.1081066,12.1637439 9.84279385,12.4290566 9.84279385,12.7563365 C9.84279385,13.0836163 10.1081066,13.348929 10.4353864,13.348929 C10.7626663,13.348929 11.027979,13.0836163 11.027979,12.7563365 C11.027979,12.4290566 10.7626663,12.1637439 10.4353864,12.1637439 Z M10.4353864,9.79337349 C10.1081066,9.79337349 9.84279385,10.0586862 9.84279385,10.3859661 C9.84279385,10.7132459 10.1081066,10.9785587 10.4353864,10.9785587 C10.7626663,10.9785587 11.027979,10.7132459 11.027979,10.3859661 C11.027979,10.0586862 10.7626663,9.79337349 10.4353864,9.79337349 Z M10.4353864,7.42300312 C10.1081066,7.42300312 9.84279385,7.68831586 9.84279385,8.01559571 C9.84279385,8.34287557 10.1081066,8.60818831 10.4353864,8.60818831 C10.7626663,8.60818831 11.027979,8.34287557 11.027979,8.01559571 C11.027979,7.68831586 10.7626663,7.42300312 10.4353864,7.42300312 Z M10.4353864,5.05263275 C10.1081066,5.05263275 9.84279385,5.31794549 9.84279385,5.64522534 C9.84279385,5.9725052 10.1081066,6.23781794 10.4353864,6.23781794 C10.7626663,6.23781794 11.027979,5.9725052 11.027979,5.64522534 C11.027979,5.31794549 10.7626663,5.05263275 10.4353864,5.05263275 Z M10.4353864,2.68226238 C10.1081066,2.68226238 9.84279385,2.94757512 9.84279385,3.27485497 C9.84279385,3.60213483 10.1081066,3.86744757 10.4353864,3.86744757 C10.7626663,3.86744757 11.027979,3.60213483 11.027979,3.27485497 C11.027979,2.94757512 10.7626663,2.68226238 10.4353864,2.68226238 Z" id="Shape" fill="#000000" fill-rule="nonzero" transform="translate(9.243845, 9.200781) rotate(-90.000000) translate(-9.243845, -9.200781) "></path></g></svg></div>
                    <div display-type="<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT;?>" class="display_capture_form btn-capture-screen-form--left active btn-capture-screen-form"><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>split_left</title><desc>Created with Sketch.</desc><g id="split_left" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><path d="M7.99074074,0.296306752 C7.96203283,0.297260562 7.9334081,0.301361861 7.90509274,0.308589659 L1.48148148,0.308589659 C0.833740563,0.308589659 0.296296296,1.12262942 0.296296296,2.10372996 L0.296296296,7.48915087 C0.296296296,8.47025159 0.833740563,9.28429117 1.48148148,9.28429117 L7.90046281,9.28429117 C7.96445774,9.30031194 8.029755,9.30031194 8.09374993,9.28429117 L14.5185185,9.28429117 C15.1662596,9.28429117 15.7037037,8.47025159 15.7037037,7.48915087 L15.7037037,2.10372996 C15.7037037,1.12262942 15.1662596,0.308589659 14.5185185,0.308589659 L8.09143526,0.308589659 C8.05816218,0.300165865 8.02447499,0.296060459 7.99074074,0.296306752 Z M1.51851852,1.48960134 L14.5185185,1.48960134 L14.5185185,8.00811986 L1.51851852,8.00811986 L1.51851852,1.48960134 Z M0.888888889,9.78589764 C0.561609037,9.78589764 0.296296296,10.0512104 0.296296296,10.3784902 C0.296296296,10.7057701 0.561609037,10.9710828 0.888888889,10.9710828 C1.21616874,10.9710828 1.48148148,10.7057701 1.48148148,10.3784902 C1.48148148,10.0512104 1.21616874,9.78589764 0.888888889,9.78589764 Z M3.25925926,9.78589764 C2.93197941,9.78589764 2.66666667,10.0512104 2.66666667,10.3784902 C2.66666667,10.7057701 2.93197941,10.9710828 3.25925926,10.9710828 C3.58653911,10.9710828 3.85185185,10.7057701 3.85185185,10.3784902 C3.85185185,10.0512104 3.58653911,9.78589764 3.25925926,9.78589764 Z M5.62962963,9.78589764 C5.30234978,9.78589764 5.03703704,10.0512104 5.03703704,10.3784902 C5.03703704,10.7057701 5.30234978,10.9710828 5.62962963,10.9710828 C5.95690948,10.9710828 6.22222222,10.7057701 6.22222222,10.3784902 C6.22222222,10.0512104 5.95690948,9.78589764 5.62962963,9.78589764 Z M8,9.78589764 C7.67272015,9.78589764 7.40740741,10.0512104 7.40740741,10.3784902 C7.40740741,10.7057701 7.67272015,10.9710828 8,10.9710828 C8.32727985,10.9710828 8.59259259,10.7057701 8.59259259,10.3784902 C8.59259259,10.0512104 8.32727985,9.78589764 8,9.78589764 Z M10.3703704,9.78589764 C10.0430905,9.78589764 9.77777778,10.0512104 9.77777778,10.3784902 C9.77777778,10.7057701 10.0430905,10.9710828 10.3703704,10.9710828 C10.6976502,10.9710828 10.962963,10.7057701 10.962963,10.3784902 C10.962963,10.0512104 10.6976502,9.78589764 10.3703704,9.78589764 Z M12.7407407,9.78589764 C12.4134609,9.78589764 12.1481481,10.0512104 12.1481481,10.3784902 C12.1481481,10.7057701 12.4134609,10.9710828 12.7407407,10.9710828 C13.0680206,10.9710828 13.3333333,10.7057701 13.3333333,10.3784902 C13.3333333,10.0512104 13.0680206,9.78589764 12.7407407,9.78589764 Z M15.1111111,9.78589764 C14.7838313,9.78589764 14.5185185,10.0512104 14.5185185,10.3784902 C14.5185185,10.7057701 14.7838313,10.9710828 15.1111111,10.9710828 C15.438391,10.9710828 15.7037037,10.7057701 15.7037037,10.3784902 C15.7037037,10.0512104 15.438391,9.78589764 15.1111111,9.78589764 Z M0.888888889,12.156268 C0.561609037,12.156268 0.296296296,12.4215807 0.296296296,12.7488606 C0.296296296,13.0761405 0.561609037,13.3414532 0.888888889,13.3414532 C1.21616874,13.3414532 1.48148148,13.0761405 1.48148148,12.7488606 C1.48148148,12.4215807 1.21616874,12.156268 0.888888889,12.156268 Z M15.1111111,12.156268 C14.7838313,12.156268 14.5185185,12.4215807 14.5185185,12.7488606 C14.5185185,13.0761405 14.7838313,13.3414532 15.1111111,13.3414532 C15.438391,13.3414532 15.7037037,13.0761405 15.7037037,12.7488606 C15.7037037,12.4215807 15.438391,12.156268 15.1111111,12.156268 Z M0.888888889,14.5266384 C0.561609037,14.5266384 0.296296296,14.7919511 0.296296296,15.119231 C0.296296296,15.4465108 0.561609037,15.7118236 0.888888889,15.7118236 C1.21616874,15.7118236 1.48148148,15.4465108 1.48148148,15.119231 C1.48148148,14.7919511 1.21616874,14.5266384 0.888888889,14.5266384 Z M3.25925926,14.5266384 C2.93197941,14.5266384 2.66666667,14.7919511 2.66666667,15.119231 C2.66666667,15.4465108 2.93197941,15.7118236 3.25925926,15.7118236 C3.58653911,15.7118236 3.85185185,15.4465108 3.85185185,15.119231 C3.85185185,14.7919511 3.58653911,14.5266384 3.25925926,14.5266384 Z M5.62962963,14.5266384 C5.30234978,14.5266384 5.03703704,14.7919511 5.03703704,15.119231 C5.03703704,15.4465108 5.30234978,15.7118236 5.62962963,15.7118236 C5.95690948,15.7118236 6.22222222,15.4465108 6.22222222,15.119231 C6.22222222,14.7919511 5.95690948,14.5266384 5.62962963,14.5266384 Z M8,14.5266384 C7.67272015,14.5266384 7.40740741,14.7919511 7.40740741,15.119231 C7.40740741,15.4465108 7.67272015,15.7118236 8,15.7118236 C8.32727985,15.7118236 8.59259259,15.4465108 8.59259259,15.119231 C8.59259259,14.7919511 8.32727985,14.5266384 8,14.5266384 Z M10.3703704,14.5266384 C10.0430905,14.5266384 9.77777778,14.7919511 9.77777778,15.119231 C9.77777778,15.4465108 10.0430905,15.7118236 10.3703704,15.7118236 C10.6976502,15.7118236 10.962963,15.4465108 10.962963,15.119231 C10.962963,14.7919511 10.6976502,14.5266384 10.3703704,14.5266384 Z M12.7407407,14.5266384 C12.4134609,14.5266384 12.1481481,14.7919511 12.1481481,15.119231 C12.1481481,15.4465108 12.4134609,15.7118236 12.7407407,15.7118236 C13.0680206,15.7118236 13.3333333,15.4465108 13.3333333,15.119231 C13.3333333,14.7919511 13.0680206,14.5266384 12.7407407,14.5266384 Z M15.1111111,14.5266384 C14.7838313,14.5266384 14.5185185,14.7919511 14.5185185,15.119231 C14.5185185,15.4465108 14.7838313,15.7118236 15.1111111,15.7118236 C15.438391,15.7118236 15.7037037,15.4465108 15.7037037,15.119231 C15.7037037,14.7919511 15.438391,14.5266384 15.1111111,14.5266384 Z" id="Shape" fill="#000000" fill-rule="nonzero" transform="translate(8.000000, 8.004060) rotate(-90.000000) translate(-8.000000, -8.004060) "></path></g></svg></div>
                    <div display-type="<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_SPLIT_RIGHT;?>" class="display_capture_form btn-capture-screen-form--right btn-capture-screen-form"><svg width="16px" height="16px" viewBox="0 0 16 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>Split_right</title><desc>Created with Sketch.</desc><g id="Split_right" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="icons8-split_cells" transform="translate(8.296296, 8.296296) rotate(90.000000) translate(-8.296296, -8.296296) translate(0.296296, 0.296296)" fill="#000000" fill-rule="nonzero"><path d="M7.69444444,0.584483188 C7.66573654,0.585436998 7.63711181,0.589538297 7.60879644,0.596766095 L1.18518519,0.596766095 C0.537444267,0.596766095 0,1.41080585 0,2.3919064 L0,7.77732731 C0,8.75842803 0.537444267,9.57246761 1.18518519,9.57246761 L7.60416652,9.57246761 C7.66816144,9.58848838 7.7334587,9.58848838 7.79745363,9.57246761 L14.2222222,9.57246761 C14.8699633,9.57246761 15.4074074,8.75842803 15.4074074,7.77732731 L15.4074074,2.3919064 C15.4074074,1.41080585 14.8699633,0.596766095 14.2222222,0.596766095 L7.79513896,0.596766095 C7.76186588,0.588342301 7.7281787,0.584236895 7.69444444,0.584483188 Z M1.22222222,1.77777778 L14.2222222,1.77777778 L14.2222222,8.2962963 L1.22222222,8.2962963 L1.22222222,1.77777778 Z M0.592592593,10.0740741 C0.265312741,10.0740741 0,10.3393868 0,10.6666667 C0,10.9939465 0.265312741,11.2592593 0.592592593,11.2592593 C0.919872444,11.2592593 1.18518519,10.9939465 1.18518519,10.6666667 C1.18518519,10.3393868 0.919872444,10.0740741 0.592592593,10.0740741 Z M2.96296296,10.0740741 C2.63568311,10.0740741 2.37037037,10.3393868 2.37037037,10.6666667 C2.37037037,10.9939465 2.63568311,11.2592593 2.96296296,11.2592593 C3.29024281,11.2592593 3.55555556,10.9939465 3.55555556,10.6666667 C3.55555556,10.3393868 3.29024281,10.0740741 2.96296296,10.0740741 Z M5.33333333,10.0740741 C5.00605348,10.0740741 4.74074074,10.3393868 4.74074074,10.6666667 C4.74074074,10.9939465 5.00605348,11.2592593 5.33333333,11.2592593 C5.66061319,11.2592593 5.92592593,10.9939465 5.92592593,10.6666667 C5.92592593,10.3393868 5.66061319,10.0740741 5.33333333,10.0740741 Z M7.7037037,10.0740741 C7.37642385,10.0740741 7.11111111,10.3393868 7.11111111,10.6666667 C7.11111111,10.9939465 7.37642385,11.2592593 7.7037037,11.2592593 C8.03098356,11.2592593 8.2962963,10.9939465 8.2962963,10.6666667 C8.2962963,10.3393868 8.03098356,10.0740741 7.7037037,10.0740741 Z M10.0740741,10.0740741 C9.74679422,10.0740741 9.48148148,10.3393868 9.48148148,10.6666667 C9.48148148,10.9939465 9.74679422,11.2592593 10.0740741,11.2592593 C10.4013539,11.2592593 10.6666667,10.9939465 10.6666667,10.6666667 C10.6666667,10.3393868 10.4013539,10.0740741 10.0740741,10.0740741 Z M12.4444444,10.0740741 C12.1171646,10.0740741 11.8518519,10.3393868 11.8518519,10.6666667 C11.8518519,10.9939465 12.1171646,11.2592593 12.4444444,11.2592593 C12.7717243,11.2592593 13.037037,10.9939465 13.037037,10.6666667 C13.037037,10.3393868 12.7717243,10.0740741 12.4444444,10.0740741 Z M14.8148148,10.0740741 C14.487535,10.0740741 14.2222222,10.3393868 14.2222222,10.6666667 C14.2222222,10.9939465 14.487535,11.2592593 14.8148148,11.2592593 C15.1420947,11.2592593 15.4074074,10.9939465 15.4074074,10.6666667 C15.4074074,10.3393868 15.1420947,10.0740741 14.8148148,10.0740741 Z M0.592592593,12.4444444 C0.265312741,12.4444444 0,12.7097572 0,13.037037 C0,13.3643169 0.265312741,13.6296296 0.592592593,13.6296296 C0.919872444,13.6296296 1.18518519,13.3643169 1.18518519,13.037037 C1.18518519,12.7097572 0.919872444,12.4444444 0.592592593,12.4444444 Z M14.8148148,12.4444444 C14.487535,12.4444444 14.2222222,12.7097572 14.2222222,13.037037 C14.2222222,13.3643169 14.487535,13.6296296 14.8148148,13.6296296 C15.1420947,13.6296296 15.4074074,13.3643169 15.4074074,13.037037 C15.4074074,12.7097572 15.1420947,12.4444444 14.8148148,12.4444444 Z M0.592592593,14.8148148 C0.265312741,14.8148148 0,15.0801276 0,15.4074074 C0,15.7346873 0.265312741,16 0.592592593,16 C0.919872444,16 1.18518519,15.7346873 1.18518519,15.4074074 C1.18518519,15.0801276 0.919872444,14.8148148 0.592592593,14.8148148 Z M2.96296296,14.8148148 C2.63568311,14.8148148 2.37037037,15.0801276 2.37037037,15.4074074 C2.37037037,15.7346873 2.63568311,16 2.96296296,16 C3.29024281,16 3.55555556,15.7346873 3.55555556,15.4074074 C3.55555556,15.0801276 3.29024281,14.8148148 2.96296296,14.8148148 Z M5.33333333,14.8148148 C5.00605348,14.8148148 4.74074074,15.0801276 4.74074074,15.4074074 C4.74074074,15.7346873 5.00605348,16 5.33333333,16 C5.66061319,16 5.92592593,15.7346873 5.92592593,15.4074074 C5.92592593,15.0801276 5.66061319,14.8148148 5.33333333,14.8148148 Z M7.7037037,14.8148148 C7.37642385,14.8148148 7.11111111,15.0801276 7.11111111,15.4074074 C7.11111111,15.7346873 7.37642385,16 7.7037037,16 C8.03098356,16 8.2962963,15.7346873 8.2962963,15.4074074 C8.2962963,15.0801276 8.03098356,14.8148148 7.7037037,14.8148148 Z M10.0740741,14.8148148 C9.74679422,14.8148148 9.48148148,15.0801276 9.48148148,15.4074074 C9.48148148,15.7346873 9.74679422,16 10.0740741,16 C10.4013539,16 10.6666667,15.7346873 10.6666667,15.4074074 C10.6666667,15.0801276 10.4013539,14.8148148 10.0740741,14.8148148 Z M12.4444444,14.8148148 C12.1171646,14.8148148 11.8518519,15.0801276 11.8518519,15.4074074 C11.8518519,15.7346873 12.1171646,16 12.4444444,16 C12.7717243,16 13.037037,15.7346873 13.037037,15.4074074 C13.037037,15.0801276 12.7717243,14.8148148 12.4444444,14.8148148 Z M14.8148148,14.8148148 C14.487535,14.8148148 14.2222222,15.0801276 14.2222222,15.4074074 C14.2222222,15.7346873 14.487535,16 14.8148148,16 C15.1420947,16 15.4074074,15.7346873 15.4074074,15.4074074 C15.4074074,15.0801276 15.1420947,14.8148148 14.8148148,14.8148148 Z" id="Shape"></path></g></g></svg></div>
                    <div id="btnPreviewCaprureScreen" class="btn-preview-capture-screen"><svg width="20px" height="15px" viewBox="0 0 20 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><title>preview</title><desc>Created with Sketch.</desc><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Leaderboard_HTML" transform="translate(-1057.000000, -67.000000)" fill="#333333" fill-rule="nonzero"><g id="if_view_126581" transform="translate(1057.000000, 67.000000)"><path d="M10,5 C10,6.38 8.88,7.5 7.5,7.5 C7.5,8.88 8.62,10 10,10 C11.38,10 12.5,8.88 12.5,7.5 C12.5,6.12 11.38,5 10,5 Z M10,0 C4.8725,0 0,5.81 0,7.5 C0,9.19 4.8725,15 10,15 C15.1275,15 20,9.19 20,7.5 C20,5.81 15.1275,0 10,0 Z M10,12.5 C7.23875,12.5 5,10.26125 5,7.5 C5,4.73875 7.23875,2.5 10,2.5 C12.76125,2.5 15,4.73875 15,7.5 C15,10.26125 12.76125,12.5 10,12.5 Z" id="preview"></path></g></g></g></svg></div>
                </div>
            </div>
        </div>
        <?php include 'leaderboard-tab.php'?>
        <div class="right-panel-slide">
            <div class="right-panel-slide__content">
                <div class="tabs-editor">
                    <ul class="clearfix">
                        <li class="gray-tab capture-screen">
                            <a href="javascript:void(0);"><i class="eb-icn-content"></i>HTML Editor</a>
                        </li>
                        <li class="capture-screen">
                            <a href="javascript:void(0);"><i class="eb-icn-settings"></i>Settings</a>
                        </li>
                    </ul>
                    <div class="right-panel-slide__close">Save & Close</div>
                    <div class="wrap-tabs-content">
                        <div class="tab-content capture-screen">
                            <div class="editor-text">
                                <div id="capture_screen_html_editor"></div>
                            </div>
                        </div>
                        <div class="tab-content capture-screen">
                            <div class="capture-screen-settings">
                                <div class="st-field">
                                    <label>Padding</label>
                                    <div class="st-right">
                                        <div class="st-right__inner inline-box w50">
                                            <label>Left</label>
                                            <input id="captureScreenPaddingLeft" type="text" value="20px" class="txt-field st-input-css">
                                        </div>
                                        <div class="st-right__inner inline-box w50">
                                            <label>Right</label>
                                            <input id="captureScreenPaddingRight" type="text" value="20px" class="txt-field st-input-css">
                                        </div>
                                        <div class="st-right__inner inline-box w50">
                                            <label>Top</label>
                                            <input id="captureScreenPaddingTop" type="text" value="20px" class="txt-field st-input-css">
                                        </div>
                                        <div class="st-right__inner inline-box w50">
                                            <label>Bottom</label>
                                            <input id="captureScreenPaddingBottom" type="text" value="20px" class="txt-field st-input-css">
                                        </div>
                                    </div>
                                </div>
                                <div class="st-bg">
                                    <div class="st-head">Background</div>
                                    <div class="st-field">
                                        <select class="select-type-bg" id="captureScreenBgType">
                                            <option value="0">Custom</option>
                                            <option value="1">Free Images (Unsplash)</option>
                                        </select>
                                    </div>
                                    <div class="custom-bg-box">
                                        <div class="st-field">
                                            <label>Background Color</label>
                                            <div class="st-right">
                                                <div class="st-right__inner w40">
                                                    <div class="wrap-color">
                                                        <div id="captureScreenBg" style="background-color: rgb(255, 255, 255);" class="color-box" data-color-start="ffffff"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="st-field st-field--vertical">
                                            <label>Background Image</label>
                                            <div class="st-right ">
                                                <div class="st-right__inner upload-bg-capture-screen no-files">
                                                    <a href="javascript:void(0);" class="t-btn-gray st-btn-upload-image">Upload Image</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="free-images-box" type-action="upload-bg-capture-screen">
                                        <div class="search-box search-input-free-images">
                                            <input type="text" class="txt-field" placeholder="Search" />
                                            <i class="icn-search"></i>
                                        </div>
                                        <div class="list-free-images">
                                            <ul class="clearfix"></ul>
                                            <div class="btn-more-free-images t-btn-gray" data-page="2">Load more</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="unsplash-right-panel">
            <div class="title">Free Images (Unsplash)
                <a href="javascript:void(0);" class="t-btn-gray" id="close_unsplash-right-panel">Close</a></div>
            <div class="conetnt" type-action="screensaver">
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
        <div class="example-box" style='display:none;'>
            <div class="example-inner">
                <a href="imgs/hlp/bi_fold.jpg" class="screenshot_zoom">
                    <img src="imgs/hlp/bi_fold.jpg"/>
                </a>
            </div>
        </div>
    </div>
    <div class="ll-popup" id="ll_popup_manage_confirm_exit_activation">
        <div class="ll-popup-head">Confirmation</div>
        <div class="ll-popup-content">
            <div class="form">
                <div class="t-field ll-line-field">
                    <div class="style-text" id="container_email_lock_status">
                        Are you sure you want to exit? Any unsaved changes will be lost!
                        <input type="hidden" id="ll_popup_manage_confirm_exit_url_activation" />
                    </div>
                </div>
            </div>
        </div>
        <div class="ll-popup-footer clearfix">
            <a href="javascript:void(0)" id="ll_popup_manage_confirm_register_exit_cancel_activation" class="t-btn-gray ll-close-popup t-btn-left">Cancel</a>
            <a href="javascript:void(0)" id="ll_popup_manage_confirm_register_exit_go_activation" class="t-btn-gray ll-close-popup">Exit</a>
            <a href="javascript:void(0)" id="ll_popup_manage_confirm_register_exit_save_and_exit_activation" class="t-btn-orange ll-close-popup">Save and Exit</a>
        </div>
    </div>
    <div id="ll-fade"></div>
    <?PHP
    LL_Database::mysql_close ();
    include "footer-bottom.php";
    ?>

    <div id="capture-screen-html-temp" style="display: none;"></div>
    <div id="activation-builder-temp" style="display: none;"></div>
    <div class="preview-box" id="previewLeaderboard"></div>
    <div class="preview-box" id="previewCaprureScreen"></div>
</div>
</body>
</html>