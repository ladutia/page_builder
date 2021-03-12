<?php
/**
 * Created by PhpStorm.
 * User: Asmaa Ali
 * Date: 03/01/2021
 * Time: 3:50 AM
 */
include_once 'page_settings_constants.php';
define ( 'VERY_TOP_MENU', VERY_TOP_MENU_LL_LEADERBOARD_BUILDER );
define ( 'TOP_MENU', '' );
define ( 'LEFT_MENU', '' );
define ( 'SUB_TOP_MENU', '' );
define ( 'WINDOW_TITLE', 'Build Leaderboard' );
define ( 'PAGE_TITLE', 'Build Leaderboard' );
SetHelpTileAndBody ();

require_once ("mysql_connect.php"); // connect to the db
include "configuration.inc";
require_once ("passport.php");
require_once ('DAL/fields.php');
require_once 'DAL/ll_customer_applications.php';
require_once 'DAL/ll_customer_security_profiles_permissions.php';
require_once 'DAL/LL_Leaderboards_Manager.php';
require_once 'DAL/LL_Activations_Manager.php';
require_once 'DAL/ll_users.php';
require_once 'DAL/ll_completion_actions_manager.php';
require_once 'webforms/DAL/form.php';

$userID = intval ( $_COOKIE ["userID_ck"] );
$customerID = intval ( $_COOKIE ["customerID_ck"] );
$tUnixDate = time (); // grab current unix timestamp from server
$datetime_now = gmdate ( "Y-m-d H:i:s", $tUnixDate ); // gets GMT time from the current time

$theme_color = ll_private_labels_manager::get_branding_theme_color ($customerID);
$theme_border_color = ll_private_labels_manager::get_branding_theme_color ($customerID, 'border');
$theme_hover_color = ll_private_labels_manager::get_branding_theme_color ($customerID, 'hover');

if(!ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$ACTIVATIONS)){
    LL_Database::mysql_close ();
    HEADER ( "location: notauthorized.php" );
    exit ();
}

$step = (!trim($_GET['step']) || trim($_GET['step']) == 'undefined') ? 'setup' : trim($_GET['step']);

$assign_modes = (new LL_Leaderboards_Manager())->load_assign_modes();

$ACTIVATIONS_PERMISSION = ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$ACTIVATIONS);
$EVENTS_PERMISSION = ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$DEVICE_FORMS) && (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::MANAGE_DEVICE_FORMS) || ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::MANAGE_DEVICE_FORMS_WITH_ACCESS));

$ll_events = $ll_activations = array();
if($ACTIVATIONS_PERMISSION) {
    $ll_activations_data = (new ll_activations())->load_all_activations($customerID, true, array('is_active' => 1), false);
    $ll_activations_data = object_2_array($ll_activations_data);
    $ll_activations = array_column($ll_activations_data, 'll_activation_name', 'll_activation_id');
    $ll_activation_have_points_factors = array_column($ll_activations_data, 'has_points_factors', 'll_activation_id');
}
if($EVENTS_PERMISSION) {
    $ll_events = form::get_device_forms_by_customer_id($customerID, $userID, true);
    $ll_events = array_column(object_2_array($ll_events), 'name', 'id');
}

$ll_leaderboard_id = 0;
$ll_leaderboard_token = trim($_GET['token']);
$ll_leaderboard = new ll_leaderboards( $customerID, 0, '', $ll_leaderboard_token );
if($ll_leaderboard->ll_leaderboard_id){
    $ll_leaderboard_id = $ll_leaderboard->ll_leaderboard_id;
} else {
    /*LL_Database::mysql_close ();
    HEADER ( "location: notauthorized.php" );
    exit ();*/
}
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
    <script type="text/javascript" src="js/ll-leaderboards-manager.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript" src="js/ll-leaderboard-builder.js<?php include 'll-cache-validator.php';?>"></script>
    <script type="text/javascript">

        ll_leaderboard_id = <?php echo $ll_leaderboard_id;?>;

        EVENTS_PERMISSION = <?php echo $EVENTS_PERMISSION ? 1 : 0; ?>;
        ACTIVATIONS_PERMISSION = <?php echo $ACTIVATIONS_PERMISSION ? 1 : 0; ?>;

        wizard_header_manager.asset_type = 'LEADERBOARD';
        wizard_header_manager.asset_id = <?php echo $ll_leaderboard_id;?>;

        var LL_APP_HTTPS = '<?php echo LL_APP_HTTPS;?>';

        LL_ACTIVATION_DISPLAY_FORM_FULL_SCREEN = '<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_FULL_SCREEN; ?>';
        LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT = '<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_SPLIT_LEFT; ?>';
        LL_ACTIVATION_DISPLAY_FORM_SPLIT_RIGHT = '<?php echo LL_Activations_Manager::LL_ACTIVATION_DISPLAY_FORM_SPLIT_RIGHT; ?>';

        LL_ACTIVATION_TEMPLATE_FOR_CAPTURE_SCREEN = '<?php echo LL_Activations_Manager::TEMPLATE_FOR_CAPTURE_SCREEN; ?>';
        LL_ACTIVATION_TEMPLATE_FOR_LEADERBOARD = '<?php echo LL_Activations_Manager::TEMPLATE_FOR_LEADERBOARD; ?>';

        LL_COMPLETION_ACTIONS_ASSET_TYPE_LEADERBOARD_POINTS_THRESHOLD = '<?php echo ll_completion_actions_manager::LL_ASSET_TYPE_LEADERBOARD_POINTS_THRESHOLD; ?>';
        LL_COMPLETION_ACTIONS_ACTIVITY_TYPE_LEADERBOARD_POINTS_THRESHOLD_GET = '<?php echo ll_completion_actions_manager::LL_ACTIVITY_TYPE_LEADERBOARD_POINTS_THRESHOLD_GET; ?>';

        LL_LEADERBOARD_ASSET_TYPE_ACTIVATION = <?php echo LL_Leaderboards_Manager::ASSET_TYPE_ACTIVATION; ?>;
        LL_LEADERBOARD_ASSET_TYPE_EVENT = <?php echo LL_Leaderboards_Manager::ASSET_TYPE_EVENT; ?>;

        ll_leaderboard_builder.ll_activations = <?php echo @json_encode($ll_activations);?>;
        ll_leaderboard_builder.ll_activation_have_points_factors = <?php echo @json_encode($ll_activation_have_points_factors);?>;
        ll_leaderboard_builder.ll_events = <?php echo @json_encode($ll_events);?>;

    </script>
    <title>
        <?php
        echo ll_private_labels_manager::get_branding_name($customerID) . ' - ' ;
        echo PAGE_TITLE;
        ?>
    </title>
</head>
<body class="theme leaderboard-designer <?php echo $body_class;?>" >
<div id="mainWrapper">
    <div class="et-top-header et-top-header-gray header-leaderboard">
        <a href="javascript:void(0);" class="db-btn-white btn-exit" id="leaderboard-exit">Exit</a>
        <div class="h-edit-text">
            <span class="t container_leaderboard_name editable_asset_name" contenteditable="true" data-text="Activation Name"><?php echo $ll_leaderboard->ll_leaderboard_name;?></span>
            <a href="javascript:void(0)" class="edit-text"></a>
        </div>
        <a href="javascript:void(0);" id="leaderboard-save-and-exit" class="db-btn-orange btn-next">Save & Exit</a>

        <a href="javascript:void(0);" class="db-btn-orange btn-save" id="leaderboard-save">Save</a>
        <a href="javascript:void(0);" class="db-btn-white btn-launch" style="display: none;">Launch</a>
        <div class="settings-tpl">
            <a href="javascript:void(0)" class="db-btn-white"><i class="icn"></i></a>
            <ul class="">
                <li><a href="javascript:void(0);" class="load-activation-templates">Load Template</a></li>
                <li><a href="javascript:void(0);" class="save-activation-template">Save Template</a></li>
                <li><a href="javascript:void(0);" class="reset-activation-template"> Reset Layout</a></li>
            </ul>
        </div>

        <div class="et-title">Global Leaderboard Designer</div>
    </div>
    <div class="tabs-pages">
        <ul class="clearfix">
            <li id-form="setup" <?php if($step == 'setup'){ echo 'class="selected"';}?> >(1) Setup</li>
            <li id-form="leaderboard" <?php if($step == 'leaderboard'){ echo 'class="selected"';}?>>(2) Leaderboard</li>
        </ul>
    </div>
    <div id="custom-leaderboard-designer-page" class="custom-leaderboard-page tabs-nav-unpin tabs-nav-parent">
        <div class="tabs-nav">
            <div class="tabs-nav__toggle-pin ll_std_tooltip" title="Unpin Menu">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#fb8f04"><path d="M16 5h.99L17 3H7v2h1v7l-2 2v2h5v6l1 1 1-1v-6h5v-2l-2-2V5z"></path><path fill="none" d="M0 0h24v24H0z"></path></svg>
            </div>
            <div class="tabs-nav__toggle"></div>
            <div class="tabs-nav__title">Create New Event</div>
            <ul>
                <li id-form="setup" <?php if($step == 'setup'){ echo 'class="selected"';}?> ><span>1</span>Setup</li>
                <li id-form="leaderboard" <?php if($step == 'leaderboard'){ echo 'class="selected"';}?>><span>2</span>Leaderboard</li>
            </ul>
        </div>
        <div class="tab-content-page setup-content" <?php if($step == 'setup'){ echo 'style="display:block"'; } else { echo 'style="display:none"'; }?> id-form="setup">
            <div class="tab-content-page__inner setup-tab columns-tab">
                <div class="left-column">
                    <div class="defautl-h ll_std_tooltip" title="Three operating modes control how your Global Leaderboard should work. Initial Points uses the first points earned from each Activation/Game played. Highest Points uses the highest points earned from each Activations/Games played. All Points uses points from every Activation/Game played, including points from playing the same Activation/Game more than once. Note, for all Leaderboard Modes the total points earned per game play is the sum of Game Points plus Prize Points.">Leaderboard Mode</div>
                    <div class="t-field">
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
                    <div class="defautl-h">Assets</div>
                        <?php if($ACTIVATIONS_PERMISSION){ ?>
                            <div class="h3">Activations</div>
                            <div class="leaderboard-assets" asset-type="<?php echo LL_Leaderboards_Manager::ASSET_TYPE_ACTIVATION;?>" >

                            </div>
                        <?php } ?>
                        <?php if($EVENTS_PERMISSION){ ?>
                            <div class="h3">Events</div>
                            <div class="leaderboard-assets" asset-type="<?php echo LL_Leaderboards_Manager::ASSET_TYPE_EVENT;?>" >
                                <div class="t-field">

                                </div>
                            </div>
                        <?php } ?>
                </div>
                <div class="right-column">
                    <div class="defautl-h">Fulfillment Actions</div>
                    <span class="hint ll_std_tooltip" title="Set one or more point thresholds below. When a player meets or exceeds the point threshold the Fulfillment Actions associated with the point threshold will trigger. Fulfillment Actions trigger the first time the player passes the threshold. They will not trigger again until the player’s points drop below the threshold then meet or exceed the threshold again. If multiple thresholds are added, then all Fulfillment Actions will trigger if all thresholds are passed at once. For example, if there’s a 10 point and 50 point threshold and the player earns 75 points to first get on the Global Leaderboard then both thresholds will trigger simultaneously.">Actions trigger when players meet or exceed the point threshold(s) below:</span>
                    <div class="leaderboard-points-thresholds">

                    </div>
                </div>
            </div>
        </div>
        <?php include 'leaderboard-tab.php'?>
    </div>
    <div class="ll-popup" id="ll_popup_manage_confirm_exit_leaderboard">
        <div class="ll-popup-head">Confirmation</div>
        <div class="ll-popup-content">
            <div class="form">
                <div class="t-field ll-line-field">
                    <div class="style-text" id="container_email_lock_status">
                        Are you sure you want to exit? Any unsaved changes will be lost!
                        <input type="hidden" id="ll_popup_manage_confirm_exit_url_leaderboard" />
                    </div>
                </div>
            </div>
        </div>
        <div class="ll-popup-footer clearfix">
            <a href="javascript:void(0)" id="ll_popup_manage_confirm_register_exit_cancel_leaderboard" class="t-btn-gray ll-close-popup t-btn-left">Cancel</a>
            <a href="javascript:void(0)" id="ll_popup_manage_confirm_register_exit_go_leaderboard" class="t-btn-gray ll-close-popup">Exit</a>
            <a href="javascript:void(0)" id="ll_popup_manage_confirm_register_exit_save_and_exit_leaderboard" class="t-btn-orange ll-close-popup">Save and Exit</a>
        </div>
    </div>
    <div id="ll-fade"></div>
    <?PHP
    LL_Database::mysql_close ();
    include "footer-bottom.php";
    ?>
    <!--<div id="leaderboard-builder-temp" style="display: none;"></div>-->
</div>
</body>
</html>