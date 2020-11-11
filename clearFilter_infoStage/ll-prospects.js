/**
 * @filename ll-prospects.js
 * @filepath js/
 * @author Emad Atya <emad.atya@leadliaison.com>
 * @copyright Copyright 2011. All rights reserved
 * 
 * This file manages the JS for the ll-prospects.php page grids.
 * 
 * Date Created: 17-03-2011
 * Date Modified: 01-07-2013
 * 
 * @link ll-prospects.php
 * @link ll-memberships.php
 * @package LL
 */
data_url = 'll-prospects-data.php?';
export_process_url = 'll-prospects-export-process.php?';
$(document).ready( function() {
	if(typeof rhythm_id == 'undefined'){
		smartpage.init();
	}
});

var smartpage = {
	is_first_create_date_sort: true,
	additional_url_info: '',
	prospect_criteria: '',
	filters: {},
	filtering: {index: null, direct:null},
	first_grid_load: true,
	dhxWins: null,
	columns_array_selected: [],
	init: function() {
		ll_date_picker_manager.make_picker('#ll_prospects_dateFrom', {
			minDate: false
		});
		ll_date_picker_manager.make_picker('#ll_prospects_dateTo', {
			minDate: false
		});
		$('#btn_ll_prospects_filter_Go').bind('click', function(){
			smartpage.updateGrid();
		})
		
		ll_combo_manager.make_combo('#select_prospect_criteria');
		ll_combo_manager.event_on_change('#select_prospect_criteria', function(){
			prospect_criteria = ll_combo_manager.get_selected_value('#select_prospect_criteria')
			
			$('#btn_edit_criteria').hide();
			var select_prospect_criteria_optgroup = ll_combo_manager.get_selected_optgroup('#select_prospect_criteria').attr('id')
			if(typeof select_prospect_criteria_optgroup != 'undefined' && select_prospect_criteria_optgroup == 'select_prospect_criteria_mine'){
				if(isStringNumeric(prospect_criteria)){
					$('#btn_edit_criteria').show();
				}
			}
			
			smartpage.apply_prospect_criteria(prospect_criteria);
		})
		$('.t-btn-big-select').show();
		
		this.initiate_grid ();
		
		/*
		window.dhx_globalImgPath="js/dhtmlx/dhtmlxCombo/codebase/imgs/";
		this.dhxWins = new dhtmlXWindows();
		this.dhxWins.attachEvent('onClose', function(win) {
			if(typeof done_assign_owner_success != 'undefined' && done_assign_owner_success){
				smartpage.updateGrid();
			}
			win.setModal(false);
			win.hide();
			return false;
		});
		*/
		$('#printableView').bind('click', function() {
			smartpage.grid.setColumnHidden(smartpage.grid.getColIndexById('prospect_url'), false);
			smartpage.grid.printView();
			smartpage.grid.setColumnHidden(smartpage.grid.getColIndexById('prospect_url'), true);
		});

		$('#saveToExcel').bind('click', function(){
			ll_export_manager.export_data_type = ll_export_manager.EXPORT_PROSPECT_DATA;
			ll_export_manager.open_export_type_popup();
		});

		$('#exportNotes').bind('click', function(){
			ll_export_manager.export_data_type = ll_export_manager.EXPORT_NOTES;
			ll_export_manager.open_export_notes_popup();
		});
		$('#exportTasks').bind('click', function(){
			ll_export_manager.export_data_type = ll_export_manager.EXPORT_TASKS;
			ll_export_manager.open_export_tasks_popup();
		});

		$('#btn_showhide_columns').bind('click', function(){
			ll_column_field_selector_manager.launch_selector('column_show');
		});

		$('#btn_create_criteria').bind('click', function(){
			ll_prospect_criteria_manager.asset_type = LL_PROSPECT_CRITERIA_ASSET_TYPE_PROSPECT;
			ll_prospect_criteria_manager.open(0, function(){
				if(typeof this.is_on_the_fly == 'undefined' || !this.is_on_the_fly){
		   			ll_combo_manager.add_option('#select_prospect_criteria #select_prospect_criteria_mine', this.ll_prospect_criteria_id, this.ll_prospect_criteria_name);
		   			ll_combo_manager.set_selected_value('#select_prospect_criteria', this.ll_prospect_criteria_id);
		   			ll_combo_manager.trigger_event_on_change('#select_prospect_criteria')
				}
				smartpage.apply_prospect_criteria(this.ll_prospect_criteria_id);
			}, {
				allow_on_the_fly_mode: true,
				ignore_hide_fade_when_done: true,
				popup_title: 'Filter Prospects',
				first_box_header_label: 'Match Prospects that meet ALL of these conditions'
			});
		});
		$('#btn_edit_criteria').bind('click', function(){
			ll_prospect_criteria_manager.open(smartpage.prospect_criteria, function(){
				smartpage.updateGrid();
			});
		});
		
		$('#removeSelected').click(function(){

			var assets_ids = [];
			smartpage.grid.forEachRow(function (id) {
				var cell = smartpage.grid.cells(id, 0);
				if (cell.getValue() == 1) {
					assets_ids.push(id);
				}
			});
			if(!assets_ids.length){
				show_error_message('Please select a row to remove!');
				return false;
			}
			if(assets_ids.length){
				var count_of_records = assets_ids.length;
				var count_of_records_txt = parseInt(count_of_records) > 1 ? "Applies to " + count_of_records + " records" : "Applies to " + count_of_records + " record";
			}
			$('#popup_delete_prospects .count_of_records').text( count_of_records_txt );
			ll_popup_manager.open('#popup_delete_prospects');
		});
		$('#prospects_bulk_action').click(function(){
			ll_bulk_actions_manager.add_for_prospects(smartpage.grid,$(this));
		});

		$('#btn_confirm_remove_leads').bind('click', function(){
			itemlist = '';
			firstRow = true;
			smartpage.grid.forEachRow(function (id) {
				var cell = smartpage.grid.cells(id, 0);
				if (cell.getValue() == 1) {
					if (firstRow){
						itemlist = id;
					}else{
						itemlist = itemlist + ', ' + id;
					}
					firstRow = false;
				}
			});
			if(itemlist != ''){
				smartpage.delete_prospects(itemlist);
			} else {
				show_error_message('Please select a row to remove!');
			}
		});

		$('#btn_cancel_remove_leads').bind('click', function(){
			ll_popup_manager.close('#popup_delete_prospects');
		});

		narture_manager.process_popups_features();

		ll_combo_manager.make_combo('select[name="select_owner"]');
		ll_combo_manager.event_on_change('select[name="select_owner"]', function () {
			owner_userID = ll_combo_manager.get_selected_value('select[name="select_owner"]');
			var data = {};
			data.user_preferences_data = {};
			data.user_preferences_data.owner_userID = owner_userID;
			ll_user_preferences_manager.update_user_preferences('SELECT_OWNER_PROSPECTS_PAGE', data, function(){

			});
			smartpage.updateGrid();
		});

		$('.ll-view-types-items .t-btn-gray').on('click', function(e){
			e.preventDefault();
			$('.page-table #dhtmlx_GridWrapper').removeClass('grid-selected-all');
			var $group = $(this).parents('.ll-btn-group');
			if($(this).hasClass('ll-active')){
				if($group.find('.t-btn-gray.ll-active').length > 1){
					$(this).toggleClass('ll-active');
				}
			} else {
				$(this).toggleClass('ll-active');
			}
			smartpage.updateGrid();

			var data = {};
			data.user_preferences_data = {};
			data.user_preferences_data.filter_prospects_emails = ($('.ll-view-types-items a[view-type-identifier=emails]').hasClass('ll-active'))? 1 : 0;
			data.user_preferences_data.filter_prospects_names = ($('.ll-view-types-items a[view-type-identifier=names]').hasClass('ll-active'))? 1 : 0;;
			data.user_preferences_data.filter_prospects_anonymous = ($('.ll-view-types-items a[view-type-identifier=anonymous]').hasClass('ll-active'))? 1 : 0;;
			ll_user_preferences_manager.update_user_preferences('SELECT_FILTERS_PROSPECTS_PAGE', data, function(){

			});
		});
	},
	initiate_grid: function (){
		var data = new Object();
		data.action = 'load_column_field_settings';
		data.selector_type = 'prospects';
		
		ll_fade_manager.fade(true, 'load');
		$.ajax( {
			type :"POST",
			dataType :"json",
			async :true,
			url :"ll-process.php",
			data :data,
			cache :false,
			success : function(response) {
				ll_fade_manager.fade(false)
		   		if(response.success == 1){
		   			smartpage.columns_array = response.columns_array;
		   			smartpage.columns_array_selected = [];
		   			for (var i in response.columns_array) {
		   				if (response.columns_array[i].is_selected == 1) {
		   					smartpage.columns_array_selected.push (response.columns_array[i]);
		   				}
		   			}
		   			smartpage.columns_array_selected = smartpage.columns_array_selected.sort (sort_show_order);
		   			
		   			smartpage.go_initiate_grid ();
		   		}else{
		   			show_error_message(response.message);
		   		}
			},
			error : function() {
				ll_fade_manager.fade(false)
	   			show_error_message("Unknown Error");
			}
		});
	},
	go_initiate_grid: function (){
		adjust_grid_height_to_fill_page('#grid_container', 100);

		var is_show_memberships_activity_date_column = false;
		var memberships_activity_date_label = '';
		if(typeof ll_prospect_memberships_activity_date_label != 'undefined'){
			memberships_activity_date_label = ll_prospect_memberships_activity_date_label;
			is_show_memberships_activity_date_column = true;
		}
		
		this.grid = new dhtmlXGridObject('grid_container');
		
		//this.grid.setHeader('&nbsp;,Name,Type,Owner,Company,'+memberships_activity_date_label+',Date Created,Email,Contacts,&nbsp;');
		//this.grid.setHeader('&nbsp;,Actions,CRM,Type,Lead Owner,Name,' + memberships_activity_date_label + ',Title,Company,Email,Created,Phone,Score,Activities,Original Lead Source,First Touch Program,First Touch Campaign,Prospect URL');

		var column_key_prospect_name = 'standard_18';
		var column_key_prospect_company = 'standard_22';
		var column_key_prospect_email = 'standard_21';
		this.grid._in_header_txt_search=function(tag,index,data){
			var _val = '';

			var column_index_prospect_name = smartpage.grid.getColIndexById(column_key_prospect_name)
			var column_index_prospect_company = smartpage.grid.getColIndexById(column_key_prospect_company)
			var column_index_prospect_email = smartpage.grid.getColIndexById(column_key_prospect_email)
			
			if (index == column_index_prospect_name) {
				if(typeof search_prospect_name != 'undefined' && search_prospect_name != ''){
					_val = search_prospect_name;
					smartpage.filters[index] = search_prospect_name;
				}
			} else if (index == column_index_prospect_name) {
				if(typeof search_prospect_company != 'undefined' && search_prospect_company != ''){
					_val = search_prospect_company;
					smartpage.filters[index] = search_prospect_company;
				}
			} else if (index == column_index_prospect_name) {
				if(typeof search_prospect_email != 'undefined' && search_prospect_email != ''){
					_val = search_prospect_email;
					smartpage.filters[index] = search_prospect_email;
				}
			}
			if(typeof _use_elastic_search != 'undefined' && _use_elastic_search && (index == column_index_prospect_name || index == column_index_prospect_email)){
				tag.innerHTML='<input type="text" class="ll_std_tooltip" title="For faster search please use the advanced search feature at the top of this page" onkeypress="smartpage.applyTxtFilter(this, \''+index+'\')" style="width:85%;" value="' + _val + '" />';
			}else {
				tag.innerHTML='<input type="text" onkeypress="smartpage.applyTxtFilter(this, \''+index+'\')" style="width:85%;" value="' + _val + '" />';
			}
		}
		this.grid._in_header_crm_filter = function(tag,index,data){
        	tag.innerHTML='	<select onchange="smartpage.applySelectFilter(this, \''+index+'\')" style="width:85%;">'
   						+'		<option value="">&nbsp;</option>'
   						+'		<option value="synced">Yes</option>'
   						+'		<option value="unsynced">No</option>'
   						+'	</select>';
		}
		this.grid._in_header_boolean_filter = function(tag,index,data){
        	tag.innerHTML='	<select onchange="smartpage.applySelectFilter(this, \''+index+'\')" style="width:85%;">'
   						+'		<option value="">&nbsp;</option>'
   						+'		<option value="1">Yes</option>'
   						+'		<option value="0">No</option>'
   						+'	</select>';
		}
		this.grid._in_header_type_filter = function(tag,index,data){
        	tag.innerHTML='	<select onchange="smartpage.applySelectFilter(this, \''+index+'\')" style="width:85%;">'
   						+'		<option value="all">All</option>'
   						+'		<option value="known" ' + ( (typeof show_prospects_type == 'undefined' || show_prospects_type == 'known' || (show_prospects_type != 'all' && show_prospects_type != 'unknown' ) ) ? 'selected="selected"' : '' ) + '>Known</option>'
   						+'		<option value="unknown" ' + ( (typeof show_prospects_type != 'undefined' && show_prospects_type == 'unknown' ) ? 'selected="selected"' : '' ) + '>Unknown</option>'
   						+'	</select>';

			var column_index_prospect_type = smartpage.grid.getColIndexById('type')
			if (typeof column_index_prospect_type != 'undefined') {
	        	if(typeof show_prospects_type == 'undefined' || show_prospects_type == 'known' || (show_prospects_type != 'all' && show_prospects_type != 'unknown' )){
	        		smartpage.filters[column_index_prospect_type] = 'known';
	        	} else if (typeof show_prospects_type != 'undefined' && show_prospects_type == 'unknown' ){
	        		smartpage.filters[column_index_prospect_type] = 'unknown';
	        	}
			}
		}

		ll_grid_manager.first_column_percentage_width = 4;
		ll_grid_manager.second_column_percentage_width = 6;
		
		//Select, Type, Contacts, Actions, Memberships Date
		//Actions, Name, then Contacts.
		smartpage.grid_header_col_title = '&nbsp;,&nbsp;,Type';
		smartpage.grid_header_col_id = 'select,actions,type';
		smartpage.grid_header_filtering = '#master_checkbox,&nbsp;,#type_filter';
		smartpage.grid_header_width = '30,100,100';
		smartpage.grid_header_widthP = ll_grid_manager.first_column_percentage_width + ',' + ll_grid_manager.second_column_percentage_width + ',8';
		smartpage.grid_header_sort = 'na,na,server';
		smartpage.grid_header_align = 'left,right,left';
		smartpage.grid_header_col_type = 'ch,ro,ro';

		if(typeof is_put_info_column != 'undefined' && is_put_info_column){
			smartpage.grid_header_col_title += ',Info';
			smartpage.grid_header_col_id += ',info';
			smartpage.grid_header_filtering += ',&nbsp;';
			smartpage.grid_header_width += ',25';
			smartpage.grid_header_widthP += ',25';
			smartpage.grid_header_sort += ',na';
			smartpage.grid_header_align += ',left';
			smartpage.grid_header_col_type += ',ro';
		}

		var col_width = 15;
		if (smartpage.columns_array_selected.length <= 5){
			if (is_show_memberships_activity_date_column) {
				col_width = 84 / (smartpage.columns_array_selected.length + 1);
			} else {
				col_width = 84 / (smartpage.columns_array_selected.length);
			}
		}
		var is_found_name_column = false;
		for (var i in smartpage.columns_array_selected) {
			var item = smartpage.columns_array_selected [i];
			
			if (item.key == column_key_prospect_name) {
				this.append_column_info (item, col_width);
			}
		}
		smartpage.grid_header_col_title += ',Contacts,' + memberships_activity_date_label;
		smartpage.grid_header_col_id += ',contacts,memberships_activity_date';
		smartpage.grid_header_filtering += ',&nbsp;,&nbsp;';
		smartpage.grid_header_width += ',100,200';
		smartpage.grid_header_widthP += ',8,14';
		smartpage.grid_header_sort += ',na,server';
		smartpage.grid_header_align += ',left,left';
		smartpage.grid_header_col_type += ',ro,ro';
		for (var i in smartpage.columns_array_selected) {
			var item = smartpage.columns_array_selected [i];

			if (item.key != column_key_prospect_name) {
				this.append_column_info (item, col_width);
			}
		}
		this.grid.setHeader(smartpage.grid_header_col_title);
		this.grid.attachHeader(smartpage.grid_header_filtering);
		this.grid.setColumnIds(smartpage.grid_header_col_id);
		this.grid.setColAlign(smartpage.grid_header_align);
		this.grid.setColTypes(smartpage.grid_header_col_type);
		this.grid.setColSorting(smartpage.grid_header_sort);
		//this.grid.setInitWidths(smartpage.grid_header_width);
		this.grid.setInitWidthsP(smartpage.grid_header_widthP);
		//this.grid.enableDragAndDrop(false);
		//this.grid.enableDragOrder(false);
		//this.grid.enableColumnMove(false);

		// Asmaa 23-5-2018 Move column make change on key for filter ex.For Email Col standard_21 to standard_5
		this.grid.attachEvent("onBeforeCMove",function(sInd,tInd){
			//return confirm("Allow move column "+sInd+" to position "+tInd); // return true to allow moving, false - to prohibit it
			return false;
		});

		/*
		//this.grid.attachHeader("#master_checkbox,&nbsp;,#boolean_filter,#type_filter,#txt_search,#txt_search,&nbsp;,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search,#txt_search");
		this.grid.attachHeader("#master_checkbox,#txt_search,#type_filter,#txt_search,#txt_search,&nbsp;,&nbsp;,#txt_search,&nbsp;,&nbsp;");
		//this.grid.setColumnIds('select,actions,crm,type,owner,name,memberships_activity_date,title,company,email,created,phone,score,activities,lead_source,program,campaign,prospect_url');
		this.grid.setColumnIds('select,name,type,owner,company,memberships_activity_date,date_created,email,contacts,actions');
		this.grid.setColAlign('left,left,left,left,left,left,left,left,left,right');
		this.grid.setColTypes('ch,ro,ro,ro,ro,ro,ro,ro,ro,ro');
		//this.grid.setColSorting("na,server,server,server,na,server,server,na,na");
		this.grid.setColSorting("na,server,server,server,server,server,server,server,na,na");
		*/
		this.grid.enablePaging(true, DHTMLXGRIDS_MAX_ROWS_PER_PAGE, 10, 'pagingArea', true, 'infoArea');
		this.grid.setPagingSkin("bricks");

		this.grid.attachEvent("onXLS", function() {
			//if(smartpage.first_grid_load){
				ll_fade_manager.fade(true, 'load');
			//}
		});
		this.grid.attachEvent("onXLE", function() {

			//if(smartpage.first_grid_load){
				ll_fade_manager.fade(false);
				smartpage.first_grid_load = false;
			//}
			var _is_single= false;
			var records_count = smartpage.grid.getRowsNum();
			records_count = format_number(records_count);
			$('span.count').text(records_count);
			if (records_count == 1) {
				_is_single = true;
			}	
			if(typeof show_prospects_type != 'undefined' && show_prospects_type == 'all'){
				if(_is_single){
					show_prospects_type_header_name = 'Person';
				}else{
					show_prospects_type_header_name = 'People';
				}
			} else if(typeof mailable_only != 'undefined' && mailable_only == 1){
				show_prospects_type_header_name = 'Active Prospect';
				if(!_is_single){
					show_prospects_type_header_name+='s';
				}
			}else{
				show_prospects_type_header_name = 'Prospect';
				if(!_is_single){
					show_prospects_type_header_name+='s';
				}
			}
			$('span.count_type').text(show_prospects_type_header_name);
			if(typeof ll_campaign_header_name != 'undefined' && ll_campaign_header_name){
				show_prospects_type_header_name+= ll_campaign_header_name;
			}
			if(typeof ll_campaign_name_txt != 'undefined' && ll_campaign_name_txt){
				show_prospects_type_header_name+= ll_campaign_name_txt;
			}
			
			ll_change_header_gray_text( records_count + ' ' +show_prospects_type_header_name );
			ll_grid_manager.process_rows_actions();
			apply_ll_tooltip($('.userlinkerror'));

		});
		
		this.grid.attachEvent("onBeforeSorting",function (ind,gridObj,direct){
			if (smartpage.is_first_create_date_sort) {
				var col_id = smartpage.grid.getColumnId (ind);
				if (col_id == 'standard_2') { // Getting the sort by create date to sort descending by default first.
					direct = 'des';
					smartpage.is_first_create_date_sort = false;
				}
			}
			smartpage.filtering.index = ind;
			smartpage.filtering.direct = direct;
			smartpage.updateGrid();
			return false;
		});
		
		//this.grid.setInitWidthsP("4,6,6,6,10,14,12,12,14,15,9,10,6,6,15,15,15,20");
		/*
		ll_grid_manager.first_column_percentage_width = 4;
		ll_grid_manager.second_column_percentage_width = 16;
		this.grid.setInitWidthsP(ll_grid_manager.first_column_percentage_width+","+ll_grid_manager.second_column_percentage_width+",0,13,15,10,12,15,10,14");
		*/
		if(typeof search_prospect_criteria != 'undefined' && search_prospect_criteria){
			this.prospect_criteria = search_prospect_criteria;
		}
		ll_grid_manager.on_check_callback = function(){
			var checkedRowsCount = smartpage.grid.getCheckedRows(0).split(',').length;
			if(checkedRowsCount > 1){
				$('a#link_nurture').text('Add to Automation');
				$('a#link_add_to_target_list').text('Add to Lists');
			} else {
				$('a#link_nurture').text('Automate');
				$('a#link_add_to_target_list').text('Lists');
			}
		}

		ll_grid_manager.init_grid(this.grid);

		apply_ll_tooltip('#grid_container .table-row');
		
		//To remove the click event from the filtering row, because it re-sort the grid.
		this.grid.hdr.rows[2].onclick=function(e){ (e||event).cancelBubble=true; }

		this.build_additiona_url_info();

		/**
		 * Moved the "setColumnHidden" to after loading the grid,
		 * Because when called before it it caused and issue on IE that the column data is hidden however the column header is not hidden.
		 */
		/*if(_is_hide_prospect_type_column){
			this.grid.setColumnHidden(this.grid.getColIndexById('type'), true);
		}*/
		this.grid.setColumnHidden(this.grid.getColIndexById('type'), true);
		/*this.grid.setColumnHidden(this.grid.getColIndexById('prospect_url'), true);
		if(!CRM_INTEGRATION){
			this.grid.setColumnHidden(this.grid.getColIndexById('crm'), true);
		}*/
		/*
		if(!LL_EVENTS_ENABLED){
			this.grid.setColumnHidden(this.grid.getColIndexById('actions'), true);
			this.grid.setColWidth(this.grid.getColIndexById('company'),18);
			this.grid.setColWidth(this.grid.getColIndexById('owner'),18);
			this.grid.setColWidth(this.grid.getColIndexById('email'),18);
			this.grid.setColWidth(this.grid.getColIndexById('contacts'),13);
		}
		*/
		
		//this.grid.setColWidth(this.grid.getColIndexById('contacts'),100);
		//this.grid.setColWidth(this.grid.getColIndexById('contacts'),8);
		
		if(!is_show_memberships_activity_date_column){
			this.grid.setColumnHidden(this.grid.getColIndexById('memberships_activity_date'), true);
		} else {
			this.filtering.index = this.grid.getColIndexById('memberships_activity_date');
			this.filtering.direct = 'des';
		}
		/*else {
			this.grid.moveColumn(this.grid.getColIndexById('memberships_activity_date'), 6);
		}*/

		/*loading from xml*/
		//this.grid.loadXML(data_url);
		this.updateGrid();
	},
	append_column_info: function (item, col_width){
		this.grid_header_col_title += ',' + item.label;
		this.grid_header_col_id += ',' + item.key;
		if (typeof item.data_type_alias != 'undefined') {
			if (item.key == 'tags') {
				this.grid_header_filtering += ',' + '&nbsp;';
			}else if (item.data_type_alias == 'string' || item.data_type_alias == 'multipicklist') {
				this.grid_header_filtering += ',' + '#txt_search';
			} else if (item.data_type_alias == 'boolean') {
				this.grid_header_filtering += ',' + '#boolean_filter';
			} else {
				this.grid_header_filtering += ',' + '&nbsp;';
			}
		} else {
			this.grid_header_filtering += ',' + '&nbsp;';
		}
		this.grid_header_width += ',' + '200';
		this.grid_header_widthP += ',' + col_width;
		if (item.key == 'tags') {
			this.grid_header_sort += ',' + 'na';
		} else {
			this.grid_header_sort += ',' + 'server';
		}
		this.grid_header_align += ',' + 'left';
		this.grid_header_col_type += ',' + 'ro';
	},
	delete_prospects : function(itemlist){
		var data = {
			action :'delete_prospects',
			itemlist: itemlist
		};
		$.ajax({
			type :"POST",
			dataType :"json",
			async :true,
			url: "ll-lead-profile-process-remove-lead.php",
			data: data,
			cache :false,
			success : function(data) {
				if(data){
					if(data['success'] == 1){
						show_success_message(data.message);
						smartpage.updateGrid();
					} else {
						show_error_message(data.message);
					}
				} else {
					show_error_message("Invalid response");
				}
				ll_popup_manager.close('#popup_delete_prospects');
			},
			error: function(){
				show_error_message("Connection error");
			}
		});
	},
	apply_prospect_criteria: function(prospect_criteria){
		smartpage.first_grid_load = true
		ll_fade_manager.fade(true, 'load');
		
		smartpage.prospect_criteria = prospect_criteria
		smartpage.updateGrid();
	},
	sort_items: function (item1, item2){
		return item1[1].localeCompare(item2[1]);
	},

	updateGrid: function(_is_enforce_same_page) {
		//ll_fade_manager.fade(true, 'load');
		if (typeof _is_enforce_same_page == 'undefined') {
			_is_enforce_same_page = false;
		}
		if (_is_enforce_same_page) {
			//var currentPage = smartpage.grid.currentPage ;
			//if(currentPage > 1){
				ll_grid_manager.updateGridPerPage(smartpage.grid);
				return;
			//}
		}
		smartpage.grid.clearAll();
		var url = this.build_url(data_url);
		smartpage.grid.load(url);
	},
	applySelectFilter: function(element, index) {
		this.filters[index] = $(element).val();
		this.updateGrid();
	},
	applyTxtFilter: function(element, index) {
		clearTimeout(this.timeout);
		this.timeout = setTimeout(function() {
			smartpage.filters[index] = $(element).val();
			smartpage.updateGrid();
		}, 500);
	},
	changeVisCol: function(element, id) {
		this.grid.setColumnHidden(this.grid.getColIndexById(id),!$(element).is(':checked'));
	},
	showAssignLeadOwnerWin: function(ll_unique_visitor_id) {
		ll_lead_owner_manager.populate_owner_settings(ll_unique_visitor_id, function(){
			smartpage.updateGrid();
		});
	},
	close_manage_events_win: function(){
		this.manage_events_win.setModal(false);
		this.manage_events_win.hide();
	},
	delete_prospect: function(ll_unique_visitor_id){
		ll_reset_delete_lead_manager.initiate_popup_html(ll_unique_visitor_id , function (){
			smartpage.updateGrid(true);
		});
	}
};
