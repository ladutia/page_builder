<?PHP
/**
 * @filename ll-prospects.php
 * @filepath /
 * @author Emad Atya <emad.atya@leadliaison.com>
 * @copyright Copyright 2011. All rights reserved
 * 
 * This page shows the LL prospects database.
 * 
 * Date Created: 17-03-2011
 * Date Modified: 08-01-2013
 * 
 * @package LL
 */
include_once 'page_settings_constants.php';
define ( 'TOP_MENU', TOP_MENU_PROSPECTS );
define ( 'LEFT_MENU', LEFT_MENU_MARKETING_LL_PROSPECTS );
define ( 'SUB_TOP_MENU', '' );
define ( 'WINDOW_TITLE', 'Prospects' );
define ( 'PAGE_TITLE', 'Prospects' );
SetHelpTileAndBody ();
if(isset($_GET['ref']) && $_GET['ref'] == 'sales'){
	define ('LL_TOP_NAV_ROOT', LL_TOP_NAV_ROOT_DEFAULT_SALES);
	define ('LL_TOP_NAV_SECONDARY', LL_TOP_NAV_SECONDARY_SALES_PROSPECTS);
}else{
	define ('LL_TOP_NAV_ROOT', LL_TOP_NAV_ROOT_DEFAULT_PROSPECTS);
}

require_once ("mysql_connect.php"); // connect to the db
include "configuration.inc";
require_once ("passport.php"); 
require_once 'DAL/app_editions.php';
require_once 'DAL/ll_automations.php';
require_once 'DAL/ll_lists.php';
require_once 'DAL/ll_campaigns.php';
require_once 'DAL/campaign_manager.php';
require_once 'DAL/ll_automations_assigned_leads.php';
require_once 'DAL/ll_lead_unique_visitors_campaigns.php';
require_once 'DAL/programs.php';
require_once 'DAL/ll_unique_visitors.php';
require_once 'DAL/fields.php';
require_once 'DAL/ll_users.php';
require_once 'DAL/ll_prospects_export_process_manager.php';
require_once 'DAL/ll_prospect_criterias.php';
require_once 'DAL/ll_lifecycle_stages_manager.php';
require_once 'LL_CRM/LL_CRM_Manager.php';
require_once 'DAL/ll_user_preferences.php';

require_once 'DAL/ll_applications.php';
require_once 'DAL/ll_customer_applications.php';

require_once 'll-common-popup-manager.php';
//SM - Add file to check on admin rights
?>
<?PHP

include_once 'Util/SetAccountConfigurationVariables.php';

$userID = $_COOKIE ["userID_ck"];
$customerID = intval ( $_COOKIE ["customerID_ck"] );
$show_prospects_type = trim($_GET['show_prospects_type']);

$search_prospect_email = trim($_GET['search_email']);
$search_prospect_name = trim($_GET['search_name']);
$search_prospect_company = trim($_GET['search_company']);
$search_prospect_criteria = intval($_GET['prospect_criteria']);

$ll_automations = ll_automations::get_all_automations_for_customer($customerID, true);
$ll_automations_ready = ll_automations::get_all_automations_for_customer($customerID, false, 0, true);
$ll_lists = ll_lists::get_all_lists_for_customer($customerID);
$ll_lists_excluding_automation_lists = ll_lists::get_all_lists_for_customer_excluding_automation_lists($customerID);
/*
$count_prospects = ll_unique_visitors::get_count_of_leads_for_customer($customerID);
$count_prospects = number_format($count_prospects, 0);
$members_name = 'Records';
if($count_prospects == 1) $members_name = 'Record';
*/
$members_name = 'Prospects';

$LL_EVENTS_ENABLED = ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$GO_TO_WEBINAR );

$PROSPECT_CRITERIA = ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$PROSPECT_CRITERIA);

$user_ll_prospect_criterias = $shared_ll_prospect_criterias = array();
if($PROSPECT_CRITERIA){
	$user_ll_prospect_criterias = ll_prospect_criterias::load_criterias($customerID, $userID, true, ll_prospect_criterias::LL_OBJECT_USING_CRITERIA_ID_GENERIC_CRITERIA, ll_prospect_criterias::LL_PROSPECT_CRITERIA_ASSET_TYPE_PROSPECT);
	$shared_ll_prospect_criterias = ll_prospect_criterias::load_criteria_shared_with_user($customerID, $userID, ll_prospect_criterias::LL_OBJECT_USING_CRITERIA_ID_GENERIC_CRITERIA, ll_prospect_criterias::LL_PROSPECT_CRITERIA_ASSET_TYPE_PROSPECT);
}

$users = ll_users::load_users_for_customer($customerID);

$ll_user_preferences = new ll_user_preferences($customerID, $userID);
$SELECT_OWNER_PROSPECTS_PAGE_INFO = $ll_user_preferences->load_user_preferences(ll_user_preferences::LL_USER_PREFERENCE_IDENTIFIER_SELECT_OWNER_PROSPECTS_PAGE_INFO);
if($search_prospect_criteria){
	$SELECT_OWNER_PROSPECTS_PAGE_INFO['owner_userID'] = 0;
}
$SELECT_FILTERS_PROSPECTS_PAGE_INFO = $ll_user_preferences->load_user_preferences(ll_user_preferences::LL_USER_PREFERENCE_IDENTIFIER_SELECT_FILTERS_PROSPECTS_PAGE_INFO);
?>
<?php include 'meta-doctype.php'; ?>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<?php
include 'meta-common.php';
include 'style-common.php';
?>
<title><?php
echo ll_private_labels_manager::get_branding_name($customerID) . ' - ' ;
echo PAGE_TITLE;
?></title>
<?php
include 'javascript_common.php';
include 'dhtmlxgrid-common-imports.php';
include 'check-export-destinations-permissions.php';
?>
<!-- Removed from here, and is added at the javascript common file incase the help prompt files were not imcluded, and if they were included, then it would include the jquery min file-->
<script src="Scripts/jQuery/jquery.json.js" type="text/javascript"></script>

<script type="text/javascript" src="js/customize-dhtmlxcombo.js"></script>

<script type="text/javascript">
search_prospect_email = '<?php echo "{$search_prospect_email}";?>';
search_prospect_name = '<?php echo "{$search_prospect_name}";?>';
search_prospect_company = '<?php echo "{$search_prospect_company}";?>';
search_prospect_criteria = '<?php echo "{$search_prospect_criteria}";?>';
CRM_INTEGRATION = <?php echo ( ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$CRM_INTEGRATION) ? 'true' : 'false' ) ;?>;
LL_EVENTS_ENABLED = <?php echo ( $LL_EVENTS_ENABLED ? 'true' : 'false' ) ;?>;
show_prospects_type = '<?php echo "{$show_prospects_type}";?>';
ll_automations = [];
<?php 
$index = 0;
foreach ($ll_automations as $ll_automation){
	echo "
	ll_automations[$index] = ['{$ll_automation['ll_automation_id']}', '" . ValiedateInput($ll_automation['automation_name']) . "'];
	";
	$index++;
}
?>
ll_automations_ready = [];
<?php 
$index = 0;
foreach ($ll_automations_ready as $ll_automation){
	echo "
	ll_automations_ready[$index] = ['{$ll_automation['ll_automation_id']}', '" . ValiedateInput($ll_automation['automation_name']) . "'];
	";
	$index++;
}
?>
ll_lists = [];
<?php 
$index = 0;
foreach ($ll_lists as $ll_list){
	echo "
	ll_lists[$index] = ['{$ll_list['ll_list_id']}', '" . ValiedateInput($ll_list['list_name']) . "'];
	";
	$index++;
}
?>
ll_lists_excluding_automation_lists = [];
<?php 
$index = 0;
foreach ($ll_lists_excluding_automation_lists as $ll_list){
	echo "
	ll_lists_excluding_automation_lists[$index] = ['{$ll_list['ll_list_id']}', '" . ValiedateInput($ll_list['list_name']) . "'];
	";
	$index++;
}
?>
_is_hide_prospect_type_column = true;
_use_elastic_search = false;
<?php if(ll_customer_applications::is_has_permission_for_application($customerID, ll_applications::$ElASTIC_SEARCH) && ELASTIC_SEARCH_URL){?>
_use_elastic_search = true;
<?php }?>
owner_userID = <?php echo $SELECT_OWNER_PROSPECTS_PAGE_INFO['owner_userID'];?>;
</script>
<script type="text/javascript" src="js/ll-prospects.js<?php include 'll-cache-validator.php';?>"></script>
<script type="text/javascript" src="js/ll-prospects-export.js<?php include 'll-cache-validator.php';?>"></script>
<script type="text/javascript" src="js/ll-export-manager.js<?php include 'll-cache-validator.php';?>"></script>
<script type="text/javascript" src="js/revenue-exprience-box.js"></script>

    <script type="text/javascript" src='js/ll-badges-manager.js<?php include 'll-cache-validator.php';?>'></script>

</head>

<body class="theme page-table close-nav-admin">
<div id="mainWrapper">
<?PHP
$GLOBALS['is-grid-head-section-on'] = 1;
include "header-very-top-menu.php";
include "header-top.php";
?>
<div class="main-page clearfix">
<?PHP
include "left-side.php";
include "right-side.php";
?>
<div class="ll-actions-top table-header-top">
	
	   <div class="t-actions-dropdown t-actions-dropdown-orange table-all-check-dropdown">
			<a href="javascript:void(0);" class="t-btn-gray t-btn t-toggle-btn t-btn-big">
				<span class="t-btn-arrow"></span>
			</a>
			<div class="t-checkbox table-all-check">
				<label><i class="icn-checkbox"></i><input type="checkbox"></label>
			</div>
			<div class="ll-actions-dropdown">
				<ul>
					<li idx="0"><a href="javascript:void(0);">Select Individual</a></li>
					<li idx="1"><a href="javascript:void(0);">Select Page</a></li>
					<li idx="2"><a href="javascript:void(0);">Select All</a></li>
				</ul>
			</div>
		</div>
		<a href="javascript:void(0)" id="" class="t-btn-gray btn-search-table t-btn-single t-btn-big">
			<i class="icn">
				<span data-svg-id="svg_icn_search_grid"></span>
			</i>
		</a>
		<a href="javascript:void(0)" id="" class="t-btn-gray btn-refresh-table t-btn-single t-btn-big">
            	<i class="icn">
            		<span data-svg-id="svg_icn_refresh_grid"></span>
            	</i>
            </a>
		<div class="t-actions-dropdown t-actions-dropdown-orange t-actions-dropdown-double">
			<a href="javascript:void(0);" class="t-btn-gray t-btn t-toggle-btn t-btn-big">
			Actions
			<span class="t-btn-arrow"></span>
			</a>
			<div class="ll-actions-dropdown">
				<ul>
					<?php if (ll_customer_applications::is_has_permission_for_application ( $customerID, ll_applications::$AUTOMATIONS )) {?>
				    	<li><a id="link_nurture" href="javascript:void(0)">Automate</a></li>
					<?php }?>
					<?php if (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session ( ll_application_sections_items::MANAGE_LISTS )) {?>
						<li><a id="link_add_to_target_list" href="javascript:void(0)">Lists</a></li>
					<?php }?>
					<li><a id="removeSelected" href="javascript:void(0)">Delete</a></li>
					<?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::BULK_ACTIONS)){?>
						<li class="select-all-action"><a id="prospects_bulk_action" href="javascript:void(0)">Bulk Actions</a></li>
					<?php }?>
				</ul>
			</div>
		</div>
    <?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::VIEW_PROSPECTS_NOT_OWNED_BY_LOGGED_IN_USER)){?>
		<div class="t-btn-big-select t-actions-dropdown t-small">
			<select class="txt-field t-small" name="select_owner" data-placeholder="Select User">
				<option value="0">All Users</option>
				<?php
					if(! empty($users)){
						foreach ($users as $user) {
							$selected = '';
							if($user->userID == $SELECT_OWNER_PROSPECTS_PAGE_INFO['owner_userID']){
								$selected = 'selected="selected"';

							}
							echo "<option value='{$user->userID}' {$selected}>" . trim ("{$user->firstName} {$user->lastName}") . "</option>";
						}
					}
				?>
			</select>
		</div>
    <?php }?>
		<div class='t-btn-big-select t-actions-dropdown wrap-select-filter'>
			<select data-placeholder="My Filters" id="select_prospect_criteria" class="txt-field filters-criteria">
				<option value=''></option>
				<option value=''>All Prospects</option>
				<optgroup label="My Filters" id="select_prospect_criteria_mine">
					<option value='my_prospects'>My Prospects</option>
					<?php 
					if($user_ll_prospect_criterias && is_array($user_ll_prospect_criterias)){
						foreach ($user_ll_prospect_criterias as $ll_prospect_criteria){
							echo "<option value='{$ll_prospect_criteria->ll_prospect_criteria_id}'>" . $ll_prospect_criteria->ll_prospect_criteria_name . "</option>";
						}
					}
					?>
				</optgroup>
				<?php if($shared_ll_prospect_criterias){?>
				<optgroup label="Shared Filters">
					<?php 
					foreach ($shared_ll_prospect_criterias as $ll_prospect_criteria){
						echo "<option value='{$ll_prospect_criteria->ll_prospect_criteria_id}'>" . $ll_prospect_criteria->ll_prospect_criteria_name . "</option>";
					}
					?>
				</optgroup>
				<?php }?>
			</select>
		</div>

        <?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::CREATE_PROSPECTS) || ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::SMART_MATCH)){?>
            <div class="t-btn-actions-dropdown ll-fr">
                <a onclick="ll_lead_manager.open_popup();" href="javascript:void(0);" class="t-btn-green t-btn btn-new-table t-btn-big new-button-no-drop">
                    New
                </a>
            </div>
        <?php }?>
	   <div class="ll-actions-small-dropdown ll-actions-small-dropdown-orange ll-big-dd ll-default-dd ll-fr">
		    <a href="javascript:void(0);" class="t-btn-gray t-toggle-btn"><i class="icn"></i></a>
			<div class="ll-actions-dropdown">
				<ul>
					<?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::EXPORT_RECORDS)){?>
						<li><a id="saveToExcel" href="javascript:void(0);">Export</a></li>
						<li><a id="exportNotes" href="javascript:void(0);">Export Notes</a></li>
						<li><a id="exportTasks" href="javascript:void(0);">Export Tasks</a></li>
					<?php }?>

					<li><a id="printableView" href="javascript:void(0);">Print</a></li>
					<li><a href="javascript:void(0);" class="show-field-table">Search</a></li>
					<li><a id="btn_showhide_columns" href="javascript:void(0);">Show/Hide Columns</a></li>
					<?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session ( ll_application_sections_items::IMPORT_PROSPECTS )){?>
						<li><a href="import-wizard-initiate.php?type=<?php echo ll_import_jobs_manager::LL_IMPORT_TYPE_PROSPECT?>">Import</a></li>
					<?php }?>
                    <li><a id="blocked-prospects" href="manage-blocked-prospects.php">Blocked Prospects</a></li>
                </ul>
			</div>
		</div>
		<a href="javascript:void(0)"  class="t-btn-gray t-btn-big" id="btn_edit_criteria" style="display: none">Edit Filter</a>

		<?php 
		if($PROSPECT_CRITERIA && ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::SETUP_PROSPECT_CRITERIA)){
		?>
		<a href="javascript:void(0)" id="btn_create_criteria" class="t-btn-gray t-btn-single ll-icn-filter t-btn-big ll-icn-time-left ll-fr ll_std_tooltip" title="Filter Prospects">
			<i class="icn">
				<img src="imgs/svg/big-funnel.svg" style="width: 100%; height: 100%; vertical-align: top;" />
			</i>
		</a>
		<?php 
		}
		?>
	<?php
		$filter_prospects_emails = ($search_prospect_criteria || intval($SELECT_FILTERS_PROSPECTS_PAGE_INFO['filter_prospects_emails'])) ? 1 : 0;
		$filter_prospects_names = ($search_prospect_criteria || intval($SELECT_FILTERS_PROSPECTS_PAGE_INFO['filter_prospects_names'])) ? 1 : 0;
		$filter_prospects_anonymous = ($search_prospect_criteria || intval($SELECT_FILTERS_PROSPECTS_PAGE_INFO['filter_prospects_anonymous'])) ? 1 : 0;
	?>

	<div class="ll-view-types-items ll-btn-group ll-btn-group-big ll-btn-group-check-all ll-btn-group-text ll-btn-group-orange ll-fr">
		<a href="javascript:void(0)" class="t-btn-gray <?php if($filter_prospects_emails){echo 'll-active';}?>" view-type-identifier="emails">Emails</a>
		<a href="javascript:void(0)" class="t-btn-gray <?php if($filter_prospects_names){echo 'll-active';}?>" view-type-identifier="names">Names </a>
		<a href="javascript:void(0)" class="t-btn-gray <?php if($filter_prospects_anonymous){echo 'll-active';}?>" view-type-identifier="anonymous">Anonymous</a>
	</div>

	</div>
</div>

<div class="main-content page-table">
	<div class="scrollbar-inner">
    	<div class="wide-grid wrap-grid <?php if($_SESSION ['USER_PREFERED_TABLE_SIZE_CLASS']){ echo $_SESSION ['USER_PREFERED_TABLE_SIZE_CLASS'];}?> clearfix" id="dhtmlx_GridWrapper">
    		<div id="grid_container" class="grid-fixed-height" style="width: 100%;overflow:hidden;"></div>
    		<div class="wrap-pag-table">	
    			<div id="pagingArea"></div>
    			<div id="recinfoArea"></div>
    		</div>
    	</div>
    </div>
</div>


<!--End of div right-content-main content-scroll--></div>

<!--End of div rightSide--></div>
<!--End of div contentBox--></div>
<!--End of div "bottomPart"-->

<?php 
$popup_options = array('selector_type' => 'prospects', 'page_manager_identifier' => 'smartpage', 'grid_identifier' => 'smartpage.grid');
ll_common_popups_manager::ll_render_popup(ll_common_popups_manager::POPUP_IDENTIFIER_LL_COLUMN_FIELD_SELECTOR, $popup_options);
ll_common_popups_manager::ll_render_popup(ll_common_popups_manager::POPUP_IDENTIFIER_NURTURE_PROSPECT);
ll_common_popups_manager::ll_render_popup(ll_common_popups_manager::POPUP_IDENTIFIER_PROSPECT_EVENTS);
ll_common_popups_manager::ll_render_popup(ll_common_popups_manager::POPUP_IDENTIFIER_SYNC_LEAD_TO_CRM);
ll_common_popups_manager::ll_render_popup(ll_common_popups_manager::POPUP_IDENTIFIER_DELETE_PROSPECT);
?>
<div class="ll-popup" id="popup_delete_prospects">
	<div class="ll-popup-head">Remove Prospects</div>
	<div class="ll-popup-content">
		<div class="form">
			<div class="t-field ll-line-field">
				Are you sure you want to Move these prospects to recycle bin?
			</div>
		</div>
	</div>
	<div class="ll-popup-footer clearfix">
        <div class="label"><label class="count_of_records"></label></div>
		<a href="javascript:void(0)" class="t-btn-gray ll-close-popup" id="btn_cancel_remove_leads">Cancel</a>
		<a href="javascript:void(0)" class="t-btn-orange ll-close-popup" id="btn_confirm_remove_leads">Confirm</a>
	</div>
</div>
<!-- 
<div id="addFavoriteAlert">
	<h3 style="margin-top: 5px" id="label_add_to">Add to Automation:</h3>
	<div class="emails" style="height: 100px">
		<div class="email">
		</div>
	</div>
	<div class="control">
		<a href="javascript:void(0)" class="btn" id="save_nurture" style="width: 100px;"><span>Save</span></a> 
		<a href="javascript:void(0)" class="btn" id="cancel_nurture" style="width: 100px;"><span>Cancel</span></a>
	</div>
</div>
-->

<!--End of div mainWrapper-->
  <?PHP
		LL_Database::mysql_close ();
		include "footer-bottom.php";
		?>
</body>
</html>
