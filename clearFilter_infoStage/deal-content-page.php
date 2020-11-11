<div class="top-deal-content container-profile">
	<div class="box-content user-box">
		<div class="dropdown-action-custom">
			<a href="javascript:void(0)" class="t-btn-gray">
				<i class="icn clearfix">
					<span></span>
				</i>
			</a>
			<div class="drop-list">
				<ul>
					<!--<li data-idx="btn_deal_apply_action" btn-action="trash">
						<a href="javascript:void (0)" class="pr-lbl-link-on-hover">Trash</a>
					</li>-->
                    <li data-idx="btn_deal_apply_action" btn-action="delete">
                        <a href="javascript:void (0)" class="pr-lbl-link-on-hover">Delete</a>
                    </li>
					<li data-idx="btn_deal_apply_action" btn-action="re_open">
                        <a href="javascript:void (0)" class="pr-lbl-link-on-hover">Reopen</a>
					</li>
					<li data-idx="btn_deal_apply_action" btn-action="win">
                        <a href="javascript:void (0)" class="pr-lbl-link-on-hover">Close - Won</a>
					</li>
					<li data-idx="btn_deal_apply_action" btn-action="lose">
                        <a href="javascript:void (0)" class="pr-lbl-link-on-hover">Close - Lost</a>
					</li>
					<?php if (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session ( ll_application_sections_items::MERGE_DEALS )) {?>
						<li data-idx="btn_deal_apply_action" btn-action="merge">
							<a href="javascript:void (0)" class="pr-lbl-link-on-hover" data-idx="ignore" btn-action="ignore">Merge</a>
						</li>
					<?php } ?>
				</ul>
			</div>
		</div>
		<div class="wrap-status-and-reopen">
			<div class="closed">
				<div class="status won">Won</div>
				<div class="status lost">Lost</div>
				<a href="javascript:void(0);" class="t-btn-gray btn-reopen">Reopen</a>
			</div>
			<div class="not_closed">
				<a href="javascript:void(0);" class="t-btn-green close_and_won">WON</a>
				<a href="javascript:void(0);" class="t-btn-red close_and_lost">LOST</a>
			</div>
		</div>
		<a href="javascript:void(0)" class="ava">
			<img id="record_picture" src="imgs/vvp/no_ava.png"/>
		</a>
		<div class="title editable_field no-small-ava" id="container_record_info_Name">
			<div class="t container-box-edit-field" data-identifier="Name" id="edit-title">
				<div class="t-inner record_info_data"></div>
				<div class="t-field edit_field_mode">
                    <span data-field-identifier="<?php echo ll_deal_fields::STANDARD_FIELD_Name_ID; ?>">
                        <input type="text" class="txt-field change_field_data field-val" name="edit_field_name"/>
                    </span>
					<a href="javascript:void(0);" class="save_field_changes"><img src="imgs/vvp/svgs/check.svg" /></a>
					<a href="javascript:void(0);" class="cancel_field_changes"><img src="imgs/vvp/svgs/cancel.svg" /></a>
				</div>
			</div>
		</div>
		<div class="inf-box no-small-ava">
			<div class="line-inf editable_field edit-amount-user" id="container_record_info_Amount">
				<span class="h-gray">Amount:</span>
				<span class="t container-box-edit-field" data-identifier="Amount">
					<span class="t-inner record_info_data"></span>
					<span id="amountFieldUser" class="amount-field-user edit_field_mode">
					    <span data-field-identifier="<?php echo ll_deal_fields::STANDARD_FIELD_Amount_ID; ?>">
                            <input type="number" step="0.01" class="txt-field change_field_data field-val" name="edit_field_amount"/>
                        </span>
    					<a href="javascript:void(0);" class="save_field_changes"><img src="imgs/vvp/svgs/check.svg" /></a>
    					<a href="javascript:void(0);" class="cancel_field_changes"><img src="imgs/vvp/svgs/cancel.svg" /></a>
					</span>
				</span>
			</div>
			<div class="line-inf editable_field edit-probability-user" id="container_record_info_Probability">
				<span class="h-gray">Probability:</span>
				<span class="t container-box-edit-field" data-identifier="Probability">
					<span class="t-inner record_info_data"></span>
					<span id="probabilityFieldUser" class="probability-field-user edit_field_mode">
					    <span data-field-identifier="<?php echo ll_deal_fields::STANDARD_FIELD_Probability_ID; ?>">
                            <input type="number" min="0" max="100" class="txt-field change_field_data field-val" name="edit_field_probability"/>
                        </span>
    					<a href="javascript:void(0);" class="save_field_changes"><img src="imgs/vvp/svgs/check.svg" /></a>
    					<a href="javascript:void(0);" class="cancel_field_changes"><img src="imgs/vvp/svgs/cancel.svg" /></a>
					</span>
				</span>
			</div>
			<div class="line-inf editable_field edit-close-date-user" id="container_record_info_ExpectedCloseDate">
				<span class="h-gray">Expected Close Date:</span>
				<span class="t container-box-edit-field" data-identifier="ExpectedCloseDate">
					<span class="t-inner record_info_data"></span>
					<span id="closeDateFieldUser" class="close-date-field-user edit_field_mode">
						<span class="wrap-input-date-single">
							<span data-field-identifier="<?php echo ll_deal_fields::STANDARD_FIELD_ExpectedCloseDate_ID; ?>">
                                <input type="text" class="txt-field ll-input-date-single change_field_data field-val" name="edit_field_ExpectedCloseDate"/>
                            </span>
        					<a href="javascript:void(0);" class="save_field_changes"><img src="imgs/vvp/svgs/check.svg" /></a>
        					<a href="javascript:void(0);" class="cancel_field_changes"><img src="imgs/vvp/svgs/cancel.svg" /></a>
						</span>
					</span>
				</span>
			</div>
			<div class="line-inf edit-name-user" id="container_record_info_lead_owner">
    			<span class="h-gray">Owner:</span>
    			<span class="t container-box-edit-field" data-identifier="owner">
    				<span class="t-inner">
    					<a href="javascript:void(0);" class="ava-small"><img src="imgs/vvp/no_ava.png" id="owner_picture" onerror="$(this).attr('src', 'imgs/vvp/no_ava.png');"/></a>
    					<span class="t-name record_info_data">&nbsp;</span>
    				</span>
    				<span id="field-name-user" class="field-name-user edit_field_mode">
    					<select id="field-name-user-select" class="change_field_data" style="width: 160px;">
    					</select>
    					<a href="javascript:void(0);" class="save_field_changes"><img src="imgs/vvp/svgs/check.svg" /></a>
    					<a href="javascript:void(0);" class="cancel_field_changes"><img src="imgs/vvp/svgs/cancel.svg" /></a>
    				</span>
    			</span>
    		</div>
			<div class="line-inf deal_pipeline">
				<label>Pipeline: </label>
				<span id="pipeline_name"></span>
			</div>
		</div>
	</div>
	<div class="box-content deal-stage">
		<div id="stages"></div>
	</div>
</div>
<div class="column-row  container-profile">
    <div class="left-col-inner">
		<div class="wrap-sidebar-boxs">
			<?php
                $expect_object_type_ids = array();
				foreach($ll_user_preference_data_sidebar_order AS $box ){
                    if (stripos ( $box['boxfor'], 'object_' ) !== false) {
                        $ll_object_type_id = intval ( str_ireplace ( 'object_', '', $box['boxfor'] ) );
                        include 'crm-objects-widget.php';
                        $expect_object_type_ids[] = $ll_object_type_id;
                    } else {
                        switch ($box['boxfor']) {
                            case 'details':
                                echo '<div class="sidebar-box details-box main_details_box" box-for="details">
                                            <a href="javascript:void(0)" class="t-btn-gray settings-gray-box details_button">
                                                <i class="icn">
                                                   <img src="imgs/vvp/svgs/settings.svg" />
                                                </i>
                                            </a>
                                            <div class="title">Details</div>
                                            <div class="wrap-line-tr box-edit-details main">
                                            </div>
                                        </div>';
                                break;
                            case 'prospect':
                                echo '<div class="sidebar-box details-box prospect_details_box" box-for="prospect">
                                            <a href="javascript:void(0)" class="t-btn-gray details settings-gray-box prospect_details_button">
                                                <i class="icn">
                                                    <img src="imgs/vvp/svgs/settings.svg" />
                                                </i>
                                            </a>
                                            <div class="title">Prospect</div>
                                            <div class="details">
                                                <div class="prospect-user">
                                                    <a href="javascript:void(0)" class="ava"><img class="asset_picture" src="imgs/vvp/no_ava.png"/></a>
                                                    <a href="javascript:void(0)" class="asset_name"></a>
                                                    <div class="change_prospect" style="display: none;">
                                                        <select name="change_prospect" class="txt-field" data-placeholder="Select a prospect" style="width: 160px;">
                                                        </select>
                                                        <a href="javascript:void(0);" class="save_field_changes"><img src="imgs/vvp/svgs/check.svg" /></a>
                                                        <a href="javascript:void(0);" class="cancel_field_changes"><img src="imgs/vvp/svgs/cancel.svg" /></a>
                                                    </div>
                                                </div>
                                                <div class="inf-phone mobile_phone">
                                                    <i class="icn-phone pr-lbl-icn-svg">
                                                        <span data-svg-id="svg_phone"></span>
                                                    </i>
                                                    <strong>M:</strong>
                                                    <div class="edit-link box-details-field" data-field-identifier="standard_' . LL_STANDARD_FIELD_MobilePhone_ID . '">
                                                         <div class="edit-link-text">
                                                            <a href="javascript:void(0);" class="ll-open-inbound-call-popup record_data"></a>
                                                            <div class="pencil">
                                                                <img src="imgs/vvp/svgs/pencil.svg"/>
                                                            </div>
                                                         </div>
                                                         <div class="field-edit">
                                                            <input class="txt-field field-val" type="text">
                                                            <a href="javascript:void(0);" class="save_field_changes ll_std_tooltip"><img src="imgs/vvp/svgs/check.svg"></a>
                                                            <a href="javascript:void(0);" class="cancel_field_changes ll_std_tooltip"><img src="imgs/vvp/svgs/cancel.svg"></a>
                                                         </div>
                                                    </div>
                                                </div>
                                                <div class="inf-phone work_phone">
                                                    <i class="icn-phone pr-lbl-icn-svg">
                                                        <span data-svg-id="svg_phone"></span>
                                                    </i>
                                                    <strong>W:</strong>
                                                    <div class="edit-link box-details-field" data-field-identifier="standard_' . LL_STANDARD_FIELD_WorkPhone_ID . '">
                                                         <div class="edit-link-text">
                                                            <a href="javascript:void(0);" class="ll-open-inbound-call-popup record_data"></a>
                                                            <div class="pencil">
                                                                <img src="imgs/vvp/svgs/pencil.svg"/>
                                                            </div>
                                                         </div>
                                                         <div class="field-edit">
                                                            <input class="txt-field field-val" type="text">
                                                            <a href="javascript:void(0);" class="save_field_changes ll_std_tooltip"><img src="imgs/vvp/svgs/check.svg"></a>
                                                            <a href="javascript:void(0);" class="cancel_field_changes ll_std_tooltip"><img src="imgs/vvp/svgs/cancel.svg"></a>
                                                         </div>
                                                    </div>
                                                </div>
                                                <div class="inf-email">
                                                    <i class="icn-email pr-lbl-icn-svg">
                                                        <span data-svg-id="svg_email"></span>
                                                    </i>
                                                    <strong>W:</strong>
                                                    <div class="edit-link box-details-field" data-field-identifier="standard_' . LL_STANDARD_FIELD_Email_ID . '">
                                                         <div class="edit-link-text">
                                                            <a href="javascript:void(0);" class="record_data"></a>
                                                            <div class="pencil">
                                                                <img src="imgs/vvp/svgs/pencil.svg"/>
                                                            </div>
                                                         </div>
                                                         <div class="field-edit">
                                                            <input class="txt-field field-val" type="text">
                                                            <a href="javascript:void(0);" class="save_field_changes ll_std_tooltip"><img src="imgs/vvp/svgs/check.svg"></a>
                                                            <a href="javascript:void(0);" class="cancel_field_changes ll_std_tooltip"><img src="imgs/vvp/svgs/cancel.svg"></a>
                                                         </div>
                                                    </div>
                                                </div>
                                                <div class="inf-social-list"></div>
                                                <div class="wrap-line-tr box-edit-details custom"></div>
                                                <div class="wrap-line-tr box-edit-details main"></div>
                                            </div>
                                            <div class="btns-box add_new">
                                                <a href="javascript:void(0);" class="t-btn-gray link_object_to_prospect_button">Assign to Prospect</a>
                                            </div>
                                        </div>';
                                break;
                            case 'organizations':
                                if (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::CRM_ORGANIZATIONS)) {
                                    include 'crm-organization-widget.php';
                                }
                                break;
                            case 'attachments':
                                echo '<div class="sidebar-box attachments-box" box-for="attachments">
                                            <div class="title">Attachments</div>
                                            <div id="container_attachements_box">
        
                                            </div>
                                            <div class="btns-box">
                                                <a href="javascript:void(0)" class="t-btn-gray btn-add-file btn-add-file-attachement">Add File</a>
                                                <a href="javascript:void(0)" class="t-btn-gray btn-view-all btn-view-all-attachements">View All</a>
                                                <a href="javascript:void(0);" class="t-btn-gray btn-view-less btn-view-less-attachements">View Less</a>
                                            </div>
                                        </div>';
                                break;
                            case 'contracts':
                                echo '<div class="sidebar-box contracts-box" box-for="contracts">
                                            <div class="title">Contracts</div>
                                            <div id="contracts">
        
                                            </div>
                                            <div class="btns-box">';
                                if (ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::CRM_CONTRACTS)) {
                                    echo '	<a href="javascript:void(0);" class="t-btn-gray btn-add-contract">Add Contract</a>';
                                }
                                echo '		<a href="javascript:void(0);" class="t-btn-gray btn-view-all">View All</a>
                                                <a href="javascript:void(0);" class="t-btn-gray btn-view-less">View Less</a>
                                            </div>
                                        </div>';
                                break;
                            case 'products':
                                echo '<div class="sidebar-box products-box" box-for="products">
                                            <div class="title">Products <span class="product_warning_amount_icon ll_std_tooltip" title="Product total does not equal the Deal amount. Edit Products to update."><img src="imgs/warning.svg" /></span></div>
                                            <div id="products_summary" class="gray-box" style="display: none;">
        
                                            </div>
                                            <div class="btns-box">';
                                echo '		<a href="javascript:void(0);" class="t-btn-gray btn-attach-product">Add Products</a>';
                                echo '	</div>
                                        </div>';
                                break;
                        }
                    }
				}
                // -- objects
                $ll_object_type_id = 0;
                include 'crm-objects-widget.php';
			?>
		</div>
	</div>
	<div class="column-col-2">
		<div class="right-col-inner">
			<div class="box-content box-content-actions">
				<a href="javascript:void(0)" class="t-btn-gray btn-toggle-actions">
					<i class="icn-show">
						<img src="imgs/svg/icn-timeline-show.svg"/>
					</i>
					<i class="icn-hide">
						<img src="imgs/svg/icn-timeline-hide.svg"/>
					</i>
				</a>
				<div class="tabs-actions">
					<ul class="pr-lbl-icn-selected">
						<li>
							<a href="javascript:void(0)">
								<i class="icn icn-add-note">
									<span data-svg-id="icn-add-note"></span>
								</i>
								Add Note
							</a>
						</li>
						<?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::CRM_TASKS_Owner)){?>
							<li class="">
								<a href="javascript:void(0)">
									<i class="icn icn-add-task">
										<span data-svg-id="icn-add-task"></span>
									</i>
									Add Task
								</a>
							</li>
						<?php }?>
						<li>
							<a href="javascript:void(0)">
								<i class="icn icn-attach-files">
									<span data-svg-id="icn-attach-files"></span>
								</i>
								Attach Files
							</a>
						</li>
					</ul>
				</div>
				<div class="wrap-tabs-content-actions">
					<div class="tab-content-action">
						<?php include 'crm-note-form.php'; ?>
					</div>
					<?php if(ll_customer_security_profiles_permissions::is_has_permission_as_user_from_session(ll_application_sections_items::CRM_TASKS_Owner)){?>
						<div class="tab-content-action">
							<?php include 'crm-task-form.php';?>
						</div>
					<?php }?>
					<div class="tab-content-action">
						<div class="wrap-dropzone-attach-files">
							<div class="attach-files-preview">
								
							</div>
							<form action="ll-crm-process.php" enctype="multipart/form-data" class=" dropzone-attach-files" id="dropzone-attach-files">
                                <input name="ll_asset_type" value="<?php echo LL_CRM_Manager::LL_ASSET_TYPE_DEAL; ?>" type="hidden" />
                                <input name="ll_asset_id" value="<?php echo $deal_id; ?>" type="hidden" />
                                <input name="object" value="attachement" type="hidden" />
                                <input name="action" value="upload" type="hidden" />
                                <div class="dz-default dz-message"><span>Drag & Drop Files</span></div>
								<div class="fallback">
                                    <!-- MAX_FILE_SIZE must precede the file input field -->
                                    <input type="hidden" name="MAX_FILE_SIZE" value="<?php echo ll_assets_attachements::ATTACHEMENT_LIMIT_MB; ?>" />
									<input name="file" type="file" multiple />
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
			<div class="box-content timelines-msg">
                <div class="h">
                    Timeline
                </div>
                <div class="timelines-actions" style="display: none;">
                    <!--
					<select>
						<option>Past</option>
						<option>Future</option>
					</select>
					-->
					<?php include 'timeline-actions.php';?>
                    <a href="javascript:void(0);" class="timeline-filter-icn ll_std_tooltip" title="Filter"><img src="imgs/svg/icn-funnel.svg"/></a>
                    <a href="javascript:void(0);" class="timeline-export-icn ll_std_tooltip" title="Export"><img src="imgs/svg/icn-export.svg"/></a>
                </div>
                <div class="wrap-tl-msg" id="container_timeline_scheduled_activities" is_scheduled_activities="1">
                </div>
                <div class="wrap-tl-msg" id="container_timeline_activities" is_scheduled_activities="0">
                </div>
                <div class="wrap-btn-action-timelines">
                    <a href="javascript:void(0);" class="t-btn-orange btn-show-more-timelines t-btn-big" style="display: none;">Show more</a>
                </div>
			</div>
		</div>
	</div>
</div>