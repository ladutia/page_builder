var ll_date_picker_manager = {
	make_picker: function(_selector, _options){
		//http://xdsoft.net/jqplugins/datetimepicker/
		if(typeof _options == 'undefined' || !_options){
			_options = {};
		}
		if(typeof _options.format == 'undefined'){
			_options.format = 'Y-m-d';
		}
		if(typeof _options.minDate == 'undefined'){
			_options.minDate = 0;
		}
		if(typeof _options.scrollInput == 'undefined'){
			_options.scrollInput = false;
		}
		if(typeof _options.timepicker == 'undefined'){
			_options.timepicker = false;
			if(typeof _options.formatDate == 'undefined'){
				_options.formatDate = 'Y-m-d';
			}
		} else {
			if(typeof _options.formatTime == 'undefined'){
				_options.formatTime = 'H:i';
			}
		}
		if(typeof _options.lazyInit == 'undefined'){
			_options.lazyInit = true;
		}
		if(!_options.timepicker && typeof _options.closeOnDateSelect == 'undefined'){
			_options.closeOnDateSelect = true;
		}
		if(typeof _options.closeOnTimeSelect == 'undefined'){
			_options.closeOnDateSelect = true;
		}
		var obj = $(_selector);
		if(obj.length > 0){
			$(_selector).each(function(){
				$(this).attr('readonly', 'readonly');
				//$(this).datepicker(_options);
				var x = $(this).datetimepicker(_options);
			})
		}
	},
	get_selected_date_text: function(_selector){
		return $(_selector).val()
	},
	get_selected_date_object: function(_selector){
		return new Date($(_selector).val());
		//return $($(_selector).data('xdsoft_datetimepicker')).data('xdsoft_datetime').getCurrentTime()
		//return $(_selector).data('xdsoft_datetimepicker')
		//return $(_selector).datepicker('getDate')
	},
	event_on_change: function(_selector, _callback){
		var obj = $(_selector);
		if(obj.length > 0){
			obj.datetimepicker({
				onSelectDate: function(){
					_callback.call(this);
				}
			});
		}
	},
	set_date: function(_selector, _date){
		$(_selector).val(_date)
	}
}
var ll_combo_manager = {
	make_combo: function(_selector, _options){
		if(typeof _options == 'undefined' || !_options){
			_options = {};
		}
		if(typeof _options.search_contains == 'undefined'){
			_options.search_contains = true;
			_options.single_backstroke_delete = false
		}
		if(typeof _options.drop_down_number_of_lines == 'undefined'){
			_options.drop_down_number_of_lines = 7;
		}
		return $(_selector).chosen(_options);
	},
	make_ajax_combo: function(_selector, _ajax_chosen_options, _chosen_options, callback_after_result){
		if(typeof _chosen_options == 'undefined' || !_chosen_options){
			_chosen_options = {};
		}
		if(typeof _ajax_chosen_options == 'undefined' || !_ajax_chosen_options){
			_ajax_chosen_options = {};
		}
		if(typeof _ajax_chosen_options.type == 'undefined'){
			_ajax_chosen_options.type = 'GET';
		}
		if(typeof _ajax_chosen_options.dataType == 'undefined'){
			_ajax_chosen_options.dataType = 'json';
		}
		if(typeof _ajax_chosen_options.jsonTermKey == 'undefined'){
			_ajax_chosen_options.jsonTermKey = 'mask';
		}
		if(typeof _ajax_chosen_options.afterTypeDelay == 'undefined'){
			_ajax_chosen_options.afterTypeDelay = 500;
		}
		if(typeof callback_after_result == 'undefined' || ! callback_after_result){
			callback_after_result = function(){};
		}
		return $(_selector).ajaxChosen(_ajax_chosen_options, function (data) {
		    var results = [];
			try{
				callback_after_result(data);
			}catch (err){

			}

		    $.each(data, function (i, val) {
		        results.push({ value: val.value, text: val.text });
		    });
		    return results;
		}, _chosen_options);
	},
	update_ajax_combo: function(_selector, _ajax_chosen_options){
		if(typeof _ajax_chosen_options == 'undefined' || !_ajax_chosen_options){
			_ajax_chosen_options = {};
		}
		var options = $(_selector).data ('chosen-settings');
		if(typeof options != 'undefined' && options && Object.keys(options).length) {
			for (var i in _ajax_chosen_options) {
				options[i] = _ajax_chosen_options [i];
			}
			$(_selector).data ('chosen-settings', options);
			chosen_update($(_selector));
		}
	},
	get_selected_value: function(_selector){
		return $(_selector).val();
	},
	get_selected_text: function(_selector){
		var text = '';
		$(_selector).find(':selected').each(function(){
			if(text != ''){
				text += ';';
			}
			text += $(this).text();
		});
		return text;
	},
	get_selected_options: function(_selector){
		var options = [];
		$(_selector).find(':selected').each(function(){
			var option = {
				text : $(this).text(),
				value : $(this).val()
			};
			options.push(option);
		});
		return options;
	},
	set_selected_value: function(_selector, _val, is_ignore_case){
		if(typeof is_ignore_case == 'undefined'){
			is_ignore_case = false;
		}
		if(is_ignore_case){
			this.set_selected_case_insensitive_value(_selector, _val);
		}else{
			$(_selector).val(_val);
			chosen_update($(_selector));
		}
	},
	set_selected_case_insensitive_value: function (_selector, _val) {
		var matchingValue = $(_selector).filter(function () {
			return this.value.toLowerCase() == _val.toLowerCase();
		} ).attr('value');
		$(_selector).val(matchingValue);
		chosen_update($(_selector));
	},
	set_option_as_selected: function(_selector, option_value){
		$(_selector).find('[value="' + option_value + '"]').attr('selected', 'selected');
		chosen_update($(_selector));
	},
	update_option_text: function(_selector, option_value, option_text, is_selected){
		$(_selector).find('[value="' + option_value + '"]').text(option_text);
		is_selected = (typeof is_selected != 'undefined' && is_selected) ? true : false;
		if(is_selected){
			$(_selector).find('[value="' + option_value + '"]').attr('selected', is_selected);
		}
		chosen_update($(_selector));
	},
	// Not Working
	show_option: function(_selector, value, is_selected){
		$(_selector).find('[value="' + value + '"]').show();
		is_selected = (typeof is_selected != 'undefined' && is_selected) ? true : false;
		if(is_selected){
			$(_selector).find('[value="' + value + '"]').attr('selected', is_selected);
		}
		chosen_update($(_selector));
	},
	// Not Working
	hide_option: function(_selector, value){
		$(_selector).find('[value="' + value + '"]').hide();
		$(_selector).find('[value="' + value + '"]').attr('selected', false);
		chosen_update($(_selector));
	},
	get_selected_optgroup: function(_selector){
		return $(_selector).find(':selected').parent();
	},
	disable: function(_selector, _is_disable){
		if(_is_disable == 'undefined'){
			_is_disable = true;
		}
		if(_is_disable){
			$(_selector).attr('disabled', 'disabled');
		} else {
			$(_selector).removeAttr('disabled');
		}
		chosen_update($(_selector));
	},
	disable_option: function(_selector, option_value, _is_disable){
		if(_is_disable == 'undefined'){
			_is_disable = true;
		}
		if(_is_disable){
			$(_selector).find('[value=' + option_value + ']').attr('disabled', 'disabled');
		} else {
			$(_selector).find('[value=' + option_value + ']').removeAttr('disabled');
		}
		chosen_update($(_selector));
	},
	event_on_change: function(_selector, _callback){
		$(_selector).bind('change', function(){
			_callback.call(this);
		})
	},
	unbind_event_on_change: function (_selector) {
		$(_selector).unbind('change');
	},
	trigger_event_on_change: function(_selector){
		return $(_selector).trigger('change');
	},
	trigger_on_change: function(_selector){
		$(_selector).trigger('change')
	},
	clear_all: function(_selector, _add_empty_element){
		chosen_empty($(_selector), _add_empty_element)
	},
	remove_option: function(_selector, option_value){
		$(_selector).find('[value="' + option_value + '"]').remove();
		chosen_update($(_selector));
	},
	add_option: function(_selector, _val, _text, is_selected, tooltip){
		tooltip = (typeof tooltip == 'undefined') ? '' : tooltip;
		
		is_selected = (typeof is_selected != 'undefined' && is_selected) ? true : false;
		$(_selector).append($('<option/>', {
	        value: _val,
	        text: _text,
			tooltip: tooltip,
	        selected: is_selected
	    }));
		chosen_update($(_selector));
	},
	prepend_option: function(_selector, _val, _text, is_selected, tooltip){
		tooltip = (typeof tooltip == 'undefined') ? '' : tooltip;
		if(!ll_combo_manager.is_has_option(_selector, _val)) {
			is_selected = (typeof is_selected != 'undefined' && is_selected) ? true : false;
			$(_selector).prepend($('<option/>', {
				value: _val,
				text: _text,
				tooltip: tooltip,
				selected: is_selected
			}));
			chosen_update($(_selector));
		}
	},
	add_option_with_attributes: function(_selector, _val, _text, attributes, is_selected){
        //todo merge with add_option
		is_selected = (typeof is_selected != 'undefined' && is_selected) ? true : false;
        attributes.value = _val;
        attributes.text = _text;
        attributes.selected = is_selected;
		$(_selector).append($('<option/>', attributes ));
		chosen_update($(_selector));
	},
	is_has_option: function(_selector, _val){
		_val = _val.toString();
		if($(_selector).find('option[value="' + _val.replace(/"/g, '\\"') + '"]').length == 0){
			return false;
		}
		return true;
	},
	add_option_if_not_exist: function(_selector, _val, _text, is_selected){
		is_selected = (typeof is_selected != 'undefined' && is_selected) ? true : false;
		if(!this.is_has_option(_selector, _val)){
			$(_selector).append($('<option/>', { 
		        value: _val,
		        text: _text,
				selected: is_selected
		    }));
			chosen_update($(_selector));
		}
	},
	add_options: function(_selector, _options){
		chosen_add_options($(_selector), _options)
	},
	add_kv_options: function(_selector, _options){
		chosen_add_options($(_selector), _options, false , true, true);
	},
	get_options: function(_selector){
		return $(_selector).find('option')
	},
	refresh: function(_selector){
		chosen_update($(_selector));
	},
	
	/**
	*Sort options in select
	*/
	 sort:function(_selector_class){
		var my_options = $(_selector_class +" option");
    	my_options.sort(function(a,b) {
    		var a_text = a.text.toLowerCase();
    		var b_text = b.text.toLowerCase();

    	    if (a_text > b_text) return 1;
    	    else if (a_text < b_text) return -1;
    	    else return 0
    	});
    	$(_selector_class).empty().append(my_options);
    	chosen_update($(_selector_class));
	}
}
var ll_popup_manager = {
	set_title_text: function(popup_selector, title){
		$(popup_selector).find('.ll-popup-head .text').html(title);
	},
	set_title: function(popup_selector, title){
		$(popup_selector).find('.ll-popup-head').html(title);
	},
	get_title: function (popup_selector){
		return $(popup_selector).find('.ll-popup-head').html();
	},
	open: function(popup_selector){
		/**
		 * Emad Atya - 19-4-2016
		 * Setting the overflow of the body to be initial if its value was "hidden" caused by the getting started page.
		 */
		if($("body.starting-page").css("overflow") == 'hidden'){
			$("body.starting-page").css("overflow", "initial");
		}
		
	    $('#ll-fade').fadeIn(300, function(){
	    });
	    $(popup_selector).fadeIn(300);
	    this.center(popup_selector)
	    
	    $(window).unbind('resize', ll_popup_manager.handle_resize);
	    $(window).bind('resize', ll_popup_manager.handle_resize);
	},
	handle_resize: function(){
 	   $('.ll-popup:visible').each(function(){
 		  ll_popup_manager.center(this)
 	   })
 	  
	},
	center: function (popup_selector){
		var window_width = $(window).width()
		var selector_width = $(popup_selector).width();
		
		if(selector_width >= window_width){
			$(popup_selector).css('left', '0px')
		} else {
			var _diff = window_width - selector_width;
			var _diff_percentage = (_diff/window_width) * 100
			var _diff_percentage_half = _diff_percentage / 2
			$(popup_selector).css('right', _diff_percentage_half + '%')
			$(popup_selector).css('left', 'inherit')
		}
		
		if(!$(popup_selector).hasClass('ll-popup-enforce-top')){
			var scroll_top = $(window).scrollTop ()
			var window_height = $(window).height()
			var selector_height = $(popup_selector).height();
			
			//selector_height += 150
	
			if(selector_height >= window_height){
				$(popup_selector).css('top', '0px')
			} else {
				if(! $(popup_selector).hasClass('ll-popup-enforce-exact-center') && (window_height - selector_height) > 160){
					var offset = 150
					if ($(popup_selector).hasClass ('ll-popup-enforce-consider-scroll')) {
						offset += scroll_top;
					}
					$(popup_selector).css('top', offset + 'px')
				} else {
					var _diff = window_height - selector_height;
					var _diff_percentage = (_diff/window_height) * 100
					var _diff_percentage_half = _diff_percentage / 2
					$(popup_selector).css('top', _diff_percentage_half + '%')
				}
			}
		}
		
		 $('body').css('overflow-y','overlay');
	},
	close: function(popup_selector){
		$(popup_selector).hide();
	    $('#ll-fade').hide();
	},
	close_all: function(){
		$('.ll-popup').hide();
	    $('#ll-fade').hide();
	}
}
var ll_confirm_popup_manager = {
	
	is_popup_html_initiated: false,
	done_call_back: null,
	done_cancel_call_back: null,
	done_back_call_back: null,
	init:function() {
		
		if(!this.is_popup_html_initiated){
			this.is_popup_html_initiated = true;
			
			this.appendHtml();
			
			$('#ll_confirm_popup_cancel').bind('click', function() {
				ll_popup_manager.close('#ll_confirm_popup');
				if(ll_confirm_popup_manager.done_cancel_call_back){
					ll_confirm_popup_manager.done_cancel_call_back.call(this);
				}

			});
			$('#ll_confirm_popup_confirm').bind('click', function() {
				if(ll_confirm_popup_manager.done_call_back){
					ll_confirm_popup_manager.done_call_back.call(this);
				}
				ll_popup_manager.close('#ll_confirm_popup');
			});
			$('#ll_confirm_popup_back').bind('click', function() {
				ll_popup_manager.close('#ll_confirm_popup');
				if(ll_confirm_popup_manager.done_back_call_back){
					ll_confirm_popup_manager.done_back_call_back.call(this);
				}

			});


		}
	},
	appendHtml: function(){

		var $Html = '';

		$Html =  '<div class="ll-popup" id="ll_confirm_popup">';
		$Html += '	<div class="ll-popup-head">Confirmation</div>';
		$Html += '		<div class="ll-popup-content">';
		$Html += '			<div class="form">';
		$Html += '				<div class="t-field ll-line-field">';
		$Html += '					<div class="style-text">';
		$Html += '						Are you sure you want remove this row(s) ?';
		$Html += '					</div>';
		$Html += '				</div>';
		$Html += '			</div>';
		$Html += '		</div>';
		$Html += '		<div class="ll-popup-footer clearfix">';
		$Html += '			<div class="label"><label id="ll_confirm_popup_lbl_left"></label></div>';
		$Html += '			<a href="javascript:void(0)" id="ll_confirm_popup_cancel" class="t-btn-gray ll-close-popup">No</a>';
		$Html += '			<a href="javascript:void(0)" id="ll_confirm_popup_confirm" class="t-btn-orange ll-close-popup">Yes</a>';
		$Html += '			<a href="javascript:void(0)" id="ll_confirm_popup_back" class="t-btn-gray btn-left ll-close-popup">Back</a>';
		$Html += '		</div>';
		$Html += '	</div>';
		$Html += '</div>';

		$('body').append($Html);
	},
	setOptions:function(message,options){

		this.resetOptions();

		if(typeof message != 'undefined' && message != ''){
			$('#ll_confirm_popup .style-text').html(message);
		}

		if(typeof options != 'undefined'){
			if(typeof options.header != 'undefined' && options.header != ''){
				$('#ll_confirm_popup .ll-popup-head').html(options.header);
			}
			if(typeof options.cancel != 'undefined' && options.cancel != ''){
				$('#ll_confirm_popup #ll_confirm_popup_cancel').html(options.cancel);
			}
			if(typeof options.confirm != 'undefined' && options.confirm != ''){
				$('#ll_confirm_popup #ll_confirm_popup_confirm').html(options.confirm);
			}
			if(typeof options.show_back != 'undefined' && options.show_back){
				$('#ll_confirm_popup #ll_confirm_popup_back').show();
			}
			if(typeof options.back != 'undefined' && options.back != ''){
				$('#ll_confirm_popup #ll_confirm_popup_back').html(options.back);
			}
			if(typeof options.lbl_left != 'undefined' && options.lbl_left != ''){
				$('#ll_confirm_popup #ll_confirm_popup_lbl_left').html(options.lbl_left).show();
			}
		}
	},
	resetOptions:function(){

		$('#ll_confirm_popup .style-text').html('Are you sure you want remove this row(s) ');
		$('#ll_confirm_popup .ll-popup-head').html('Confirmation');
		$('#ll_confirm_popup #ll_confirm_popup_cancel').html('No');
		$('#ll_confirm_popup #ll_confirm_popup_confirm').html('Yes');
		$('#ll_confirm_popup #ll_confirm_popup_back').hide().html('Back');
		$('#ll_confirm_popup #ll_confirm_popup_lbl_left').html('').hide();

	},
	open: function(message,_callback,options,_cancel_callback,_back_callback){
		
		if(typeof _callback != 'undefined'){
			this.done_call_back = _callback;
		}
		if(typeof _cancel_callback != 'undefined'){
			this.done_cancel_call_back = _cancel_callback;
		}
		if(typeof _back_callback != 'undefined'){
			this.done_back_call_back = _back_callback;
		}

		this.init();

		this.setOptions(message, options);

		ll_popup_manager.open('#ll_confirm_popup');
	}

}
/*
ll_lead_owner_manager.populate_owner_settings(ll_unique_visitor_id, function(){
	page.updateGrid();
});
*/
var ll_lead_owner_manager = {
		is_popup_html_initiated: false,
		
		ll_unique_visitor_id: 0,
		done_call_back: null,
		
		initiate_popup_html: function(){
			if(!this.is_popup_html_initiated){
				this.is_popup_html_initiated = true;
				
				var _html = '';
				_html += '<div class="ll-popup" id="popup_assign_lead_owner">';
				_html += '	<div class="ll-popup-head">Owner</div>';
				_html += '	<div class="ll-popup-content">';
				_html += '		<div class="form">';
				_html += '			<div class="t-field ll-line-field">';
				_html += '				<div class="label"><label>Assign to</label></div>';
				_html += '				<select name="ll_new_owner_id" id="ll_new_owner_id" class="txt-field">';
				_html += '				</select>';
				_html += '			</div>';
				_html += '		</div>';
				_html += '	</div>';
				_html += '	<div class="ll-popup-footer clearfix">';
				_html += '		<a href="javascript:void(0)" class="t-btn-gray" id="btn_cancel_assign_lead_owner">Cancel</a>';
				_html += '		<a href="javascript:void(0)" class="t-btn-orange" id="btn_save_assign_lead_owner">Save</a>';
				_html += '	</div>';
				_html += '</div>';
				
				$('body').append(_html);
				
				ll_combo_manager.make_combo('#ll_new_owner_id');
				
				$('#btn_cancel_assign_lead_owner').bind('click', function(){
					ll_popup_manager.close('#popup_assign_lead_owner');
				})
				$('#btn_save_assign_lead_owner').bind('click', function(){
					ll_lead_owner_manager.save();
				})
			}
		},
		populate_owner_settings: function (ll_unique_visitor_id, _call_back){
			this.initiate_popup_html();

			this.ll_unique_visitor_id = ll_unique_visitor_id;
			if(typeof _call_back != 'undefined'){
				this.done_call_back = _call_back;
			} else {
				this.done_call_back = null;
			}

			var data = new Object();
			data.action = 'load_lead_owner_settings';
			data.ll_unique_visitor_id = this.ll_unique_visitor_id;
			data.is_append_list_of_users = 1;
			
			//ll_fade_manager.fade(true, 'load');
			$.ajax( {
				type :"POST",
				dataType :"json",
				async :true,
				url :"ll-process.php",
				data :data,
				cache :false,
				success : function(response) {
					//ll_fade_manager.fade(false)
			   		if(response.success == 1){
			   			var owner_userID = response.owner_userID;
					 
						fill_ll_users_dropdown ('#ll_new_owner_id', response.ll_users, owner_userID, 'Unassigned');
						/*
						 ll_combo_manager.clear_all('#ll_new_owner_id');
						 ll_combo_manager.add_option('#ll_new_owner_id', 0, 'Unassigned');
					  
						 for(var _i in response.ll_users){
						 ll_combo_manager.add_option('#ll_new_owner_id', response.ll_users[_i].userID, response.ll_users[_i].name);
						 }
						 */
						
			   			ll_combo_manager.set_selected_value('#ll_new_owner_id', owner_userID);
						ll_popup_manager.open('#popup_assign_lead_owner');
			   		}else{
			   			show_error_message(response.message);
						ll_popup_manager.close('#popup_assign_lead_owner');
			   		}
				},
				error : function() {
					//ll_fade_manager.fade(false)
		   			show_error_message("Unknown Error");
					ll_popup_manager.close('#popup_assign_lead_owner');
				}
			});
			
		},
		save: function(){
			var ll_new_owner_id = ll_combo_manager.get_selected_value('#ll_new_owner_id');

			var data = new Object();
			data.action = 'save_lead_owner';
			data.ll_unique_visitor_id = this.ll_unique_visitor_id;
			data.ll_new_owner_id = ll_new_owner_id;
			
			ll_fade_manager.fade(true, 'process');
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
			   			show_success_message(response.message);
						ll_popup_manager.close('#popup_assign_lead_owner');

						if(ll_lead_owner_manager.done_call_back){
							ll_lead_owner_manager.done_call_back.call(this);
						}
			   		}else{
			   			show_error_message(response.message);
			   		}
				},
				error : function() {
					ll_fade_manager.fade(false)
		   			show_error_message("Unknown Error");
				}
			});
		}
	}



var ll_merge_tokens_manager = {

	load_tokens: function(_callback){

		var data = {};
		data.action = 'load_ll_merge_tokens';
		$.ajax( {
			type :"POST",
			dataType :"json",
			async :true,
			url :"ll-process.php",
			data :data,
			cache :false,
			success : function(response) {
				if(response.success == 1){
					if(typeof _callback != 'undefined' && _callback){
						_callback(response);

					}
				} else {
					show_error_message(response.message);
				}
			},
			error : function() {
				show_error_message("Unknown Error");
			}
		});
	}
};

function center_messages(message_box){
	document_width = document.body.clientWidth;
	message_box_width = message_box.width();
	message_box.css("left",(document_width/2-message_box_width/2)+"px");
}
function show_success_message(__msg){
	//$('#notifyMsg').html('<div class="message"><p>' + __msg + '</p><div>');
	if (__msg != ''){
		$('.message-error').hide();
		$('.message-warning').hide();
		$('.message-success').show();
        $('.message-success > p').html(__msg);
        $('.message-success').fadeIn('slow').delay(8000).fadeOut('slow');
        center_messages($('.message-success'));
    }
}

function show_error_message(__msg){
	//$('#notifyMsg').html('<div class="error"><p>' + __msg + '</p><div>');
	if (__msg != ''){
		if(typeof ll_fade_manager != 'undefined'){
			ll_fade_manager.enforce_hide = true;
			ll_fade_manager.fade(false);
		}
		$('.message-success').hide();
		$('.message-warning').hide();
		$('.message-error').show();
        $('.message-error > p').html(__msg);
        $('.message-error').fadeIn('slow').delay(8000).fadeOut('slow');
        center_messages($('.message-error'));
    }
}

function show_warning_message(__msg){
	//$('#notifyMsg').html('<div class="warning"><p>' + __msg + '</p><div>');
	if (__msg != ''){
		$('.message-success').hide();
		$('.message-error').hide();
		$('.message-warning').show();
        $('.message-warning > p').html(__msg);
        $('.message-warning').fadeIn('slow').delay(8000).fadeOut('slow');
        center_messages($('.message-warning'));
    }
}

function remove_success_message(){
	//$('#notifyMsg').html('');
	$('.message-success > p').html('');
	$('.message-success').hide();
}

function remove_error_message(){
	//$('#notifyMsg').html('');
	$('.message-error > p').html('');
	$('.message-error').hide();
}

function remove_warning_message(){
	//$('#notifyMsg').html('');
	$('.message-warning > p').html('');
	$('.message-warning').hide();
}

function remove_all_messages(){
	/*$('#notifyMsg').html('');
	$('#notifyMsg').html('');*/
	$('.message-success > p').html('');
	$('.message-success').hide();
	$('.message-error > p').html('');
	$('.message-error').hide();
	$('.message-warning > p').html('');
	$('.message-warning').hide();
}

function ll_change_header_gray_text(_text){
	$('#container_top_gray_pre_header_text').html('');
	$('#container_top_gray_header_text').html(_text);
}
function ll_change_header_gray_pre_text(_text){
	$('#container_top_gray_pre_header_text').html(_text + ' ');
}

function fade(is_show, message){
	if(is_show){
		var height = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
		var scrollPosition = (document.body.scrollTop ? document.body.scrollTop : 
														(document.documentElement.scrollTop ? document.documentElement.scrollTop : window.pageYOffset)
							)||0;
		$('#loadingBox').css('top', height/2-100+scrollPosition)
		
		if(typeof loading_or_saving != 'undefined' && message == 'loading'){
			var _newhtml = $('#loadingBox').html().replace('Processing...', 'Loading...');
			$('#loadingBox').html(_newhtml);
		}else if(typeof loading_or_saving != 'undefined' && message == 'processing'){
			var _newhtml = $('#loadingBox').html().replace('Loading...', 'Processing...');
			$('#loadingBox').html(_newhtml);
		}else{
			var _newhtml = $('#loadingBox').html().replace('Loading...', message);
			$('#loadingBox').html(_newhtml);
		}
        $('#fade').show();
        $('#loadingBox').show();
	}else{
        $('#fade').hide();
        $('#loadingBox').hide();
	}
}

function integer(e, txtinput){
	txtinput.value = txtinput.value.replace(/[^0-9]/g, ''); 
}

function validInteger(imtVal){	 
	var intPattern = /[0-9]/;
	return intPattern.test(imtVal); 
}

function double(e, txtinput){
	txtinput.value = txtinput.value.replace(/[a-zA-Z~!@#$%&*:;,\^\(\)_ /\-+]/g, ''); 
}

function insert_text_at_cursor(el, text) {
    var val = $(el).val(), endIndex, range;
    if (typeof $(el).attr('selectionStart') != "undefined" && typeof $(el).attr('selectionEnd') != "undefined") {
        endIndex = $(el).attr('selectionEnd');
        $(el).val( val.slice(0, endIndex) + text + val.slice(endIndex) );
        $(el).attr('selectionEnd', endIndex + text.length)
        $(el).attr('selectionStart', $(el).attr('selectionEnd'))
    } else if (typeof document.selection != "undefined" && typeof document.selection.createRange != "undefined") {
    	$(el).focus();
        range = document.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    } else {
    	if(el.get(0).tagName == 'SPAN'){
    		$(el).text( $(el).text() + text )
    	} else {
    		$(el).val( $(el).val() + text )
    	}
    	
    }
}

function display_dhtmlxWindow_centered(win){
	win.setModal(true);
	win.centerOnScreen();
	var pos = win.getPosition();
	var height = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
	var scrollPosition = (document.body.scrollTop ? document.body.scrollTop : 
													(document.documentElement.scrollTop ? document.documentElement.scrollTop : window.pageYOffset)
						)||0;
	dimensions_of_win = win.getDimension();
	win.setPosition(pos[0],height/2-dimensions_of_win[1]/2+scrollPosition);	
	win.show();
}

function set_date_to_time_zone( date, timezone_offset ){
	user_date = new Date(date);
	utc = user_date.getTime() + (user_date.getTimezoneOffset() * 60000);
	new_date = new Date(utc + (3600000*timezone_offset));
	new_time = new_date.toLocaleTimeString().replace(/:\d+ /, '');
	new_result = (new_date.getMonth()+1)+"/"+new_date.getDate()+"/"+new_date.getFullYear()+" "+new_time;
	return new_result;
}

function firstToUpperCase( str ) {
	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function isValidEmailDomain(domain){
		var filter = /@([a-zA-Z0-9\-\_])+(\.[a-zA-Z0-9]{2,6}){1,2}$/;
	    if (filter.test(domain)) {
    	    return true;
	    }else{
    	    return false;
	    }
}

function isValidDomain(domain){
		var filter = /([a-zA-Z0-9\-\_])+(\.[a-zA-Z0-9]{2,16}){1,2}$/;
	    if (filter.test(domain)) {
    	    return true;
	    }else{
    	    return false;
	    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeHtml(text) {
	return text
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

function validateURL(textval) {
	var re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/;
	if (re.test(textval)) {
		return true;
	}
	
	var regex = /^(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
	if(regex .test(textval)) {
		return true;
	}
	var urlregex = new RegExp("^(http|https|ftp)\://([a-zA-Z0-9\.\-]+(\:[a-zA-Z0-9\.&amp;%\$\-]+)*@)*((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\-]+\.)*[a-zA-Z0-9\-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(\:[0-9]+)*(/($|[a-zA-Z0-9\.\,\?\'\\\+&amp;%\$#\=~_\-]+))*$");
	return urlregex.test(textval);
}
function get_valid_file_vanity_name(filename){
	filename = filename.replace(/[^\w _!.#$*,;:}{\[\])(|-]+/g, "");
	filename = filename.replace(/[ ]+/g, "_")
	return filename;
}
function is_file_image(file){
	if (file.name.match(/\.(jpg|jpeg|png|gif)$/)){
		return true;
	}
	return false;
}
function get_file_thumb(file){
	var file_parts = file.split('.');
	var ext = file_parts[file_parts.length - 1];
	ext = ext.toLowerCase();
	if(ext == 'avi' || ext == 'bmp' || ext == 'css' || ext == 'doc' || ext == 'docx' || ext == 'exe' || ext == 'html' ||
			ext == 'js' || ext == 'mp3' || ext == 'mp4' || ext == 'mpeg' || ext == 'msi' || ext == 'pdf' || ext == 'ppt' || 
				ext == 'pptx' || ext == 'psd' || ext == 'rar' || ext == 'tgz' || ext == 'txt' || ext == 'url' || ext == 'wmv' ||
					ext == 'xla' || ext == 'xls' || ext == 'xlsx' || ext == 'zip'){
		return 'imgs/file-types/' + ext + '.png'; 
	}
	return false;
}

function IsValidEmail(email) {
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regex.test(email);
}

function draw_actions_tooltip (that, _direction){
	if(typeof _direction == 'undefined' || _direction != 'left'){
		_direction = 'right';
	} else {
		_direction = 'left';
	}
    if(!that.hasClass("active")){
		actions = '';
		actions = that.next().html();
		if($('.dda-tooltip').length > 0){
			$('.dda-tooltip').find('ul').html(actions);
		}else{
			var _arrow_class = 'dda-arrow';
			if(_direction == 'left'){
				_arrow_class = 'dda-arrow-left';
			}
			_html = '<div id="dda-tooltip-1" class="dda-tooltip" style="display:none"><div class="' + _arrow_class + '"></div><div class="dda-head">Actions</div><ul>'+actions+'</ul></div>';
			$("body").append(_html);
			$('.dda-head').click(function(e){
	            e.stopPropagation();
	        });
		}
		$('.dda-btn.active').removeClass('active');
        $('.dda-tooltip').hide();
        that.addClass('active');
        
		var _left_offset = 112;
		if(_direction == 'left'){
			_left_offset = 50;
		}
		
        $('#dda-tooltip-1').css({
          top: that.offset().top + 25,
          left: that.offset().left - _left_offset
        }).show();	
    }else{
    	$('.dda-tooltip').hide();
        $('.dda-btn.active').removeClass('active');
    }
}
/*
function draw_actions_tooltip (that){
    if(!that.hasClass("active")){
		actions = '';
		actions = that.next().html();
		if($('.dda-tooltip').length > 0){
			$('.dda-tooltip').find('ul').html(actions);
		}else{
			_html = '<div id="dda-tooltip-1" class="dda-tooltip" style="display:none"><div class="dda-arrow"></div><div class="dda-head">Actions</div><ul>'+actions+'</ul></div>';
			$("body").append(_html);
			$('.dda-head').click(function(e){
	            e.stopPropagation();
	        });
		}
		$('.dda-btn.active').removeClass('active');
        $('.dda-tooltip').hide();
        that.addClass('active');
        $('#dda-tooltip-1').css({
          top: that.offset().top+25,
          left: that.offset().left-112
        }).show();	
    }else{
    	$('.dda-tooltip').hide();
        $('.dda-btn.active').removeClass('active');
    }
}
*/
function stripslashes(str) {
	str=str.replace(/\\'/g,'\'');
	str=str.replace(/\\"/g,'"');
	str=str.replace(/\\0/g,'\0');
	str=str.replace(/\\\\/g,'\\');
	return str;
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

var ll_fade_manager = {
	is_added_fade_html: false,
	enforce_show:true,
	enforce_hide:true,
	freeze_message:false,
	timeout_handlers: [],
	
	add_fade_html: function(){
		this.is_added_fade_html = true;

		//$('#fade').remove();
		var _fade_html = '';
		_fade_html += '<div id="fade"></div>';
		_fade_html += '<div id="loadingBox">';
		_fade_html += '	<img src="imgs/ajax-loader2.gif" />';
		_fade_html += '	<div>Loading...</div>';
		_fade_html += '</div>';
		
		$('body').append(_fade_html);
	},
	fade: function (is_show, fade_type, ignore_delay,freeze_message) {
		if (typeof ignore_delay == 'undefined') {
			ignore_delay = false;
		}
		ignore_delay = ignore_delay ? true : false;

		if (typeof freeze_message == 'undefined') {
			freeze_message = false;
		}
		freeze_message = freeze_message ? true : false;

		if(!this.is_added_fade_html){
			this.add_fade_html();
		}
		if (is_show && ll_fade_manager.enforce_show) {
			if (ignore_delay) {
				ll_fade_manager.show_fade(is_show, fade_type);
			} else {
				var timeout_handler = window.setTimeout(function (){
					ll_fade_manager.show_fade(is_show, fade_type);
				}, 1000);
				this.timeout_handlers.push (timeout_handler);
			}
		} else {
			if(ll_fade_manager.enforce_hide){
				if (this.timeout_handlers.length > 0) {
					for(var i in this.timeout_handlers) {
						var timeout_handler = this.timeout_handlers [i];
						if (timeout_handler) {
							window.clearTimeout(timeout_handler);
						}
					}
					this.timeout_handlers = [];
				}
				if (ignore_delay) {
					ll_fade_manager.hide_fade();
				} else {
					window.setTimeout(function () {
						ll_fade_manager.hide_fade();
					}, 1000);
				}
			}
		}
		if(freeze_message){
			ll_fade_manager.freeze_message = true;
		}
	},
	hide_fade: function(){
		$('#fade').hide();
		$('#loadingBox').hide();
		ll_fade_manager.freeze_message = false;
	},
	show_fade: function (is_show, fade_type){
		var height = document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.clientHeight;
		var scrollPosition = (document.body.scrollTop ? document.body.scrollTop :
					(document.documentElement.scrollTop ? document.documentElement.scrollTop : window.pageYOffset)
			) || 0;
		$('#loadingBox').css('top', height / 2 - 100 + scrollPosition)
		
		if (typeof fade_type == 'undefined') {
			fade_type = 'load';
		}
		var msg = '';
		switch (fade_type) {
			case 'save':
			case 'saving':
				msg = 'Saving...';
				break;
			case 'build_list':
				msg = 'One sec. Building list...';
				break;
			case 'load':
			case 'loading':
				msg = 'Loading...';
				break;
			case 'process':
			case 'processing':
				msg = 'Processing...';
				break;
			case 'delete':
				msg = 'Deleting...';
				break;
			case 'gethering_data':
				msg = 'Gathering data...<br />This might take a second.';
				break;
			default:
				msg = fade_type;
				break;
		}
		if(!ll_fade_manager.freeze_message) {
			_html = '';
			_html += '<img src="imgs/ajax-loader2.gif" />'
			_html += '<div>' + msg + '</div>'
			$('#loadingBox').html(_html);
		}
		$('#fade').show();
		$('#loadingBox').show();
	}
}
function chosen_empty(_jq_select, _add_empty_element){
	_jq_select.empty();
	if(typeof _add_empty_element != 'undefined' && _add_empty_element){
		_jq_select.append($('<option/>', { 
	        value: '',
	        text : ''
	    }));
	}
	chosen_update(_jq_select);
}
function chosen_set_selected_value(_jq_select, _val){
	$(_jq_select).val(_val)
	chosen_update(_jq_select);
	$(_jq_select).trigger('change');
}
function chosen_update(_jq_select){
	$(_jq_select).trigger("liszt:updated");
}
function select_add_options(_jq_select, _options, is_use_val_as_key, is_use_idx_as_key, add_if_not_exist){
	is_use_val_as_key = !is_empty(is_use_val_as_key);
	is_use_idx_as_key = !is_empty(is_use_idx_as_key);
	add_if_not_exist = !is_empty(add_if_not_exist);
	var val = '';
	var txt = '';
	$.each(_options, function (index, value) {
		val = (is_use_val_as_key ? value [1] : value [0]);
		txt = value [1];
		if(is_use_idx_as_key){
			val = index;
			txt = value;
		}

		var add_option = true;
		if(add_if_not_exist && $(_jq_select).find('option[value="' + val + '"]').length) {
			add_option = false;
		}
		if(add_option) {
			_jq_select.append($('<option/>', {
				value: val,
				text: txt
			}));
		}
	});
}
function chosen_add_options(_jq_select, _options, is_use_val_as_key, is_use_idx_as_key, add_if_not_exist){
	is_use_val_as_key = !is_empty(is_use_val_as_key);
	is_use_idx_as_key = !is_empty(is_use_idx_as_key);
	add_if_not_exist = !is_empty(add_if_not_exist);

	select_add_options(_jq_select, _options, is_use_val_as_key, is_use_idx_as_key, add_if_not_exist);
	chosen_update(_jq_select);
}
function select_add_standard_options(_jq_select, _options){
	for(var _i in _options){
		_jq_select.append($('<option/>', { 
	        value: _options[_i].id,
	        text : _options[_i].name
	    }));
	}
}
function chosen_add_standard_options(_jq_select, _options){
	select_add_standard_options(_jq_select, _options);
	chosen_update(_jq_select);
}
function chosen_append_options_if_not_exist(_jq_select, _options){
	$.each(_options, function (index, value) {
		if(!$(_jq_select).find('option[value="' + value [0] + '"]').length){
			_jq_select.append($('<option/>', { 
		        value: value [0],
		        text : value [1]
		    }));
		}
	});
	chosen_update(_jq_select);
}
function chosen_append_single_array_options_if_not_exist(_jq_select, _options){
	$.each(_options, function (index, value) {
		if(!$(_jq_select).find('option[value="' + value + '"]').length){
			_jq_select.append($('<option/>', { 
		        value: value,
		        text : value
		    }));
		}
	});
	chosen_update(_jq_select);
}
function sort_array (item1, item2){
	return item1[1].localeCompare(item2[1]);
}
function makeid(length) {
	if(typeof length == 'undefined' || !length){
		length = 5;
	}
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function is_empty(_var){
	return (typeof _var == 'undefined' || !_var || _var == '' || _var == 0);
}
function implode_array_with_ll_separator(_v){
	if(!is_empty(_v)){
		return _v.join(':LLSEP:');
	}
	return '';
}

function format_number(number)
{
	number += '';
	x = number.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
function format_timestamp_to_date_parts (_seconds){
	// calculate (and subtract) whole days
	var days = Math.floor(_seconds / 86400);
	_seconds -= days * 86400;

	// calculate (and subtract) whole hours
	var hours = Math.floor(_seconds / 3600) % 24;
	_seconds -= hours * 3600;

	// calculate (and subtract) whole minutes
	var minutes = Math.floor(_seconds / 60) % 60;
	_seconds -= minutes * 60;

	// what's left is seconds
	var seconds = _seconds % 60;  // in theory the modulus is not required
	
	return {
		'days': days,
		'hours': hours,
		'minutes': minutes,
		'seconds': seconds
	}
}
function isStringNumeric(num){
    return !isNaN(num)
}

function apply_ll_tooltip(_container){
	if(typeof _container == 'undefined' || !_container){
		_container = document;
	}
	if(typeof $(_container).find('.ll_std_tooltip').tooltipster != 'undefined'){
		
		
		$(_container).find('.ll_std_tooltip:not(.ll_std_click_tooltip)').each(function(){
			if(typeof $(this).attr('title') != 'undefined' && $(this).attr('title')) {

				var offsetX = offsetY = 0;
				if ($(this).attr('offsetX')) {
					offsetX = $(this).attr('offsetX');
				}
				if ($(this).attr('offsetY')) {
					offsetY = $(this).attr('offsetY');
				}
				var options = {
					/*distance:10,*/
					contentAsHTML: true,
					theme: 'll-std-tooltip-theme',
					offsetX: offsetX,
					offsetY: offsetY,
					/*minIntersection:30,
					 functionPosition: function(instance, helper, position){
					 console.log(position);
					 }*/
				};
				if($(this).hasClass('pos_bottom')){
					options.position = 'bottom';
				}
				$(this).tooltipster(options);
			}
		});

		$(_container).find('.ll_std_tooltip.ll_std_click_tooltip').each(function(){
			var offsetX = offsetY = 0;
			if($(this).attr('offsetX')){ offsetX = $(this).attr('offsetX'); }
			if($(this).attr('offsetY')){ offsetY = $(this).attr('offsetY'); }
			$(this).tooltipster({
				/*distance:10,*/
				contentAsHTML: true,
				theme: 'll-std-tooltip-theme',
				offsetX: offsetX,
				offsetY: offsetY,
				trigger: 'click'
				/*minIntersection:30,
				 functionPosition: function(instance, helper, position){
				 console.log(position);
				 }*/
			});

		});
		
		/*$(_container).find('.ll_std_tooltip').tooltipster({
			/*distance:10,
			contentAsHTML: true,
			theme: 'll-std-tooltip-theme',
			offsetX: offsetX,
		    offsetY: offsetY
			/*minIntersection:30,
			functionPosition: function(instance, helper, position){
				console.log(position);
			}
	    });*/
	}
}
function ll_tooltip_update(_selector,content){
	try{
		$(_selector).tooltipster('content', content);
	}catch(err){}
}
function ll_tooltip_hide(_selector){
	try{
		$(_selector).tooltipster('hide');
	}catch(err){}
}
function ll_tooltip_destroy (_selector){
	try{
		$(_selector).tooltipster('destr');
	}catch(err){}
}
function add_common_tooltips(){
        
    $('#btn-show-hide-chart').addClass('ll_std_tooltip').attr('title','Show Chart');
    $('.table-all-check-dropdown').addClass('ll_std_tooltip').attr('title','Select Rows');
    $('a[view-identifier=list]').addClass('ll_std_tooltip').attr('title','List View');
    $('a[view-identifier=vision]').addClass('ll_std_tooltip').attr('title','Visual View');
    $('.send-queue').addClass('ll_std_tooltip').attr('title','Send Queue');
    $('.choose-folder .t-btn-gray').addClass('ll_std_tooltip').attr('title','Select a folder to save to');
    $('.line-criteries #add_new_program').addClass('ll_std_tooltip').attr('title','New Program');
    $('.line-criteries .add_new_campaign').addClass('ll_std_tooltip').attr('title','New Campaign');
    $('.add-line-criteries.add_new_campaign').addClass('ll_std_tooltip').attr('title','New Campaign');
    $('.ll-actions-small-dropdown').addClass('ll_std_tooltip').attr('title','Options');
    $('.ll-actions-small-dropdown.ll-refersh-dd').attr('title','Refresh');
    $('.btn-search-table').addClass('ll_std_tooltip').attr('title','Search Results');
    $('.btn-refresh-table').addClass('ll_std_tooltip').attr('title','Refresh');
}

function get_user_location(_callback){
	$.get("https://api.teletext.io/api/v1/geo-ip", function(response) {
		if(typeof response != 'undefined'){
			if(typeof _callback != 'undefined'){
				_callback(response);
			}
		}
	});
}

function uniqueRandomString(len, bits){

	bits = bits || 36;
	var outStr = "", newStr;
	while (outStr.length < len)
	{
		newStr = Math.random().toString(bits).slice(2);
		outStr += newStr.slice(0, Math.min(newStr.length, (len - outStr.length)));
	}

	var timestamp = Math.floor(Date.now() /1000).toString();
	//var timestamp = new Date().valueOf();
	outStr = outStr.substring(0, (outStr.length - timestamp.length));
	outStr = outStr + timestamp;
	return outStr.toUpperCase();
}

var show_loading_alert = false;
var loading_alert_message = "Are you sure you want to leave this page?";
function handleLoadingAlert(){
	window.addEventListener("beforeunload", function (e) {
		if (show_loading_alert) {
			e.returnValue = loading_alert_message;
			return loading_alert_message;
		} /*else {
			return null;
		}*/
	});
}

$(document).ready(function() {
	/**
	 * Manage show and hide the alert notification box at the top header and the user info box.
	 */
	//$.noConflict();

	window_handle_session_timeout = null;
	try{
		window.setTimeout("check_if_still_logged_in()", check_for_login_frequency);
	}catch(err){}
	
	add_common_tooltips();
	apply_ll_tooltip();
	handleLoadingAlert();

	$('.ll_std_tooltip,.ll_std_tooltip a').bind('click', function(){
		ll_tooltip_hide('.ll_std_tooltip');      
	});
	$('.ll_std_tooltip div,.ll_std_tooltip ul li').bind('hover', function(){
		ll_tooltip_hide('.ll_std_tooltip');      
	});

	$('#headerLine li.alert').bind('click', function(e) {
		if (!$(this).hasClass('clicked')) {
			$(this).addClass('clicked');
			$('#alert_box').show();
			e.stopPropagation();
		}
	});
	$('#headerLine li.login a').bind('click', function() {
		$('#userinfo_box .head').width($('#headerLine li.login').width());
		$('#userinfo_box').show();
	});
	$('body').bind('click', function() {
		$('#headerLine li.alert').removeClass('clicked');
		$('#alert_box').hide();
	});
	$('#userinfo_box').bind('mouseleave', function() {
		$(this).hide();
	});
	
	/**
	 * Manage show/hide the recent leads box
	 */
	$('#recentLeadsHeader').bind('click', function() {
		var className = $('#recentLeads').attr('class');
		if ( className.indexOf('collapse') != -1 ) 
			className = className.replace('collapse', '');
		else
			className = className + ' collapse';
		$('#recentLeads').attr('class', className);
	});
	/*first_click_on_search_button = false;
	$('#selectedSearchType').bind('click', function(event) {
		//if (document.all) {
	//		event.originalEvent.returnValue = false;
	//		event.originalEvent.cancelBubble = true;
	//	} else {
	//		event.originalEvent.preventDefault();
	//		event.originalEvent.stopPropagation();
	//	}
		first_click_on_search_button = true;
		$('#searchType_menu').show();
	});

	$('#search_type_prospect_email, #search_type_prospect_name, #search_type_company_prospecting, #search_type_people_prospecting').bind('click', function() {
		$('#selectedSearchType').html($(this).attr('lhint'));
		$('#searchType_val').val($(this).attr('id'));
	});
	$("[name='leftButtonSearch']").bind('click', function() {
		var searchType_val = $('#searchType_val').val();
		var search_val = $('#searchField').val();
		search_val = $.trim(search_val);
		if(search_val == null || search_val == ''){
			alert('Please add a search value.');
			$('#searchField').focus();
			return
		}
		switch (searchType_val){
			case 'search_type_prospect_email':
				window.location = 'll-lead-profile.php?search=' + escape(search_val);
				break;
			case 'search_type_prospect_name':
				window.location = 'll-prospects.php?search_name=' + escape(search_val);
				break;
			case 'search_type_company_prospecting':
				window.location = 'company-news.php?cn=' + escape(search_val);
				break;
			case 'search_type_people_prospecting':
				window.location = 'buy-and-trade-contacts.php?sp_cname=' + escape(search_val);
				break;
		}
	});
	$(document.body).bind('click', function() {
		if(!first_click_on_search_button)
			$('#searchType_menu').hide();
		else
			first_click_on_search_button = false;
	});*/
	if (navigator.userAgent.indexOf("MSIE") > -1) {
	    document.body.classList.add("ie");
	    $(".content_creator_icon").css("margin-top","5px");
	}
	$('.drop_down_pressed li').click(function(){
	    if ( !$(this).hasClass('selected') ){
			$('.drop_down_pressed li').each(function(){
				if($(this).hasClass('selected')){
					$(this).removeClass('selected');
				}
			});
	        $(this).addClass('selected');
	    } else {
	        $(this).removeClass('selected');
	    }
	});
	$('.drop_down_pressed .drop_down_list div').bind('click', function(){
	    $(this).addClass('selected').siblings('div').removeClass('selected');
	    if ( $(this).find('a').hasClass('add') ){
	        $(this).find('a').removeClass('add').addClass('complete');
	    }
	    $(this).parents('li').removeClass('selected');
	});

	if(typeof $('body').live == 'function'){
		$('body').live('click', function(){
			$('.dda-btn.active').removeClass('active');
			$('.dda-tooltip').hide();
		});
		$('.dda-tooltip, .dda-head').live('click', function(e){
            e.stopPropagation();
        });
        $('.dda-tooltip li a').live('click', function(e){
            e.stopPropagation();
            $(this).parents('.dda-tooltip').hide();
            $('.dda-btn.active').removeClass('active');
        });
        
        $('.btn-manage-asset-fullfilment-actions').live('click', function(){
        	populate_fulfillment_actions_manager ($(this));
		});
	}

	if(typeof dhtmlxError != 'undefined' && dhtmlxError && typeof dhtmlxError.catchError != 'undefined'){
		dhtmlxError.catchError("LoadXML", function(type, desc, erData){
			//Zoominfo errors
			try{
	            _msg = $.parseJSON(erData[0].response);
	            if(!_msg.success && ( _msg.grid_type == 'ZIPeopleSearch' || _msg.grid_type == 'ZIcompanySearch') ){
	            	show_error_message(_msg.message);
		            ll_fade_manager.fade(false);
		            return;
	            }
	        }catch(error){}

	        //My leads page errors
	    	if(typeof page != 'undefined' && page && typeof page.clearAutorefreshTimeout != 'undefined'){
			    //data[0] - request object
			    //data[0].responseText - incorrect server side response
				page.clearAutorefreshTimeout();
				page.refreshAutorefreshTimeout();
				$("#span_loading_portion").hide();
	    	}
		});
	}
	/**
	 * Emad Atya - 03-04-2014
	 * For the pages that have datetime picker, sometimes the footer gets shifted up by few pixels because of adding the div that contains the datetime picker
	 * So, setting this timout function to hide this div after the page loads by 1 second, so the footer does not get shifted up
	 * 
	 * Update: Adding the not('.ui-datepicker-inline') part so it does not select already shown calenders like at the social-post.php
	 * Because without this part, when clicking the schedule icon the calendar was not shown and was screweing the UI.
	 */
	window.setTimeout(function(){$('.ui-datepicker').not('.ui-datepicker-inline').hide();}, 500);
	window.setTimeout(function(){$('.ui-datepicker').not('.ui-datepicker-inline').hide();}, 1000);
	window.setTimeout(function(){$('.ui-datepicker').not('.ui-datepicker-inline').hide();}, 2000);

	if(typeof jQuery != 'undefined' && typeof jQuery(window).live != 'undefined' ) {
		$('.moxman-container[aria-label="Rename"] .moxman-foot .moxman-btn.moxman-primary button').live('click', function () {
			show_warning_message('Note, moving files in the media manager will change the file path and could affect images and other content in emails, landing pages, etc.');
		});

		$('.moxman-container .moxman-menu-item.moxman-stack-layout-item.moxman-first').live('click', function () {
			show_warning_message('Note, moving files in the media manager will change the file path and could affect images and other content in emails, landing pages, etc.');
		});
	}

});
function adjust_grid_height_to_fill_page(_selector, _other_content_offset, _min_window_height){
	var min_window_height = 700;
	if(typeof _min_window_height != 'undefined'){
		min_window_height = _min_window_height;
	}
	
	var window_height = $(document).height()
	var curr_selector_height = $(_selector).height();
	
	if(window_height > min_window_height){
		var additional_height = curr_selector_height + (window_height - (min_window_height + _other_content_offset));
		if(additional_height > 0 && additional_height > curr_selector_height){
			$(_selector).height(additional_height)
		}
	}
}
function set_iframe_content (_iframe_id, _html){
	var _iframe = document.getElementById(_iframe_id).contentWindow.document
	_iframe.open()
	_iframe.clear();
	_iframe.close()
	_iframe.write(_html);
	_iframe.close()
	$('#' + _iframe_id).contents().find('a').bind('click', function(e){
        e.preventDefault();
        e.stopPropagation();
        return false;
	})
	//$('#' + _iframe_id).contents().find('a').attr('target', '_blank')
}
function strStartsWith(str, prefix) {
	str = str.toLowerCase()
	prefix = prefix.toLowerCase()
    return str.indexOf(prefix) === 0;
}
function strEndsWith(str, suffix) {
	str = str.toLowerCase()
	suffix = suffix.toLowerCase()
    return str.match(suffix+"$")==suffix;
}
function strGetBeforeChar(str, suffix){
	strLower = str.toLowerCase()
	suffixLower = suffix.toLowerCase()
	return str.substr(0, strLower.indexOf(suffixLower)); 
}
function strGetAfterChar(str, suffix){
	strLower = str.toLowerCase()
	suffixLower = suffix.toLowerCase()
	return str.substr(strLower.indexOf(suffixLower) + suffixLower.length);;
}
function strReplaceIgnoreCase(str, searchMask, replaceMask){
	var regEx = new RegExp(searchMask, "ig");
	return str.replace(regEx, replaceMask);
}
function ll_sort_items (item1, item2){
	return item1[1].localeCompare(item2[1]);
}
function string_replace_all (search, replacement, string) {
    return string.replace(new RegExp(search, 'g'), replacement);
};
function sort_select_options (selector){
	var my_options = $(selector).find("option");
	var selected = $(selector).val();

	my_options.sort(function(a,b) {
	    if (a.text > b.text) return 1;
	    if (a.text < b.text) return -1;
	    return 0
	})

	$(selector).empty().append( my_options );
	$(selector).val(selected);
}
function populate_fulfillment_actions_manager (btn){
	var ll_asset_id = $(btn).attr ('ll_asset_id');
	var ll_asset_type = $(btn).attr ('ll_asset_type');
	var ll_activity_type = $(btn).attr ('ll_activity_type');
	
	if (typeof ll_asset_type != 'undefined' && ll_asset_type && ll_asset_type > 0 && typeof ll_asset_id != 'undefined' && ll_asset_id && ll_asset_id > 0 && typeof ll_activity_type != 'undefined' && ll_activity_type && ll_activity_type > 0){
		var options = {};
		switch (ll_asset_type){
			case  COMPLETION_ACTIONS_LL_ASSET_TYPE_TRIGGER:
				 options = {
					hide_actions_apply_type: true,
					show_save_to_folder: false
				};
				break;

		}

		ll_completion_actions_manager.open({
			ll_asset_type: ll_asset_type,
			ll_asset_id: ll_asset_id,
			ll_activity_type: ll_activity_type
		}, function (data){
			show_success_message (this.message);
		},options)
	} else {
		show_error_message ("Invalid action");
	}
}
function sort_show_order (item1, item2){
	  if (item1.selection_show_order < item2.selection_show_order)
	    return -1;
	  if (item1.selection_show_order > item2.selection_show_order)
	    return 1;
	  return 0;
}
function nl2br (str, is_xhtml) {
	var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
	return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}
function br2nl(str) {
	return str.replace(/<br\s*\/?>/mg,"\n");
}
function formatNumber(_number) {
	return _number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showMyImage (file,preview_selector) {

	if (file.files && file.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			$(preview_selector).html('<img src="'+e.target.result+'"/>');
			$(preview_selector).css("background-image", "none");
		}
		reader.readAsDataURL(file.files[0]);
	}
}
function format_k_amount($amount, $currency_symbol){

	$amount = typeof $amount != 'undefined' ? parseInt($amount) : 0;
	$currency_symbol = typeof $currency_symbol != 'undefined' ? $currency_symbol : '$' ;
	if($amount > 1000){
		$amount = formatNumber(($amount /1000).toFixed(2));
		//$amount = formatNumber(Math.round(($amount /1000)/100));
		$amount = $amount+'k';
	} else {
		$amount = formatNumber($amount.toFixed(2));
		//$amount = formatNumber(Math.round(($amount)/100));
	}
	return $currency_symbol+$amount;
}
function fill_ll_users_dropdown (selector, ll_users, selected_userID, placeholder) {
	ll_combo_manager.clear_all(selector);
	
	selected_userID = typeof selected_userID != 'undefined' ? parseInt(selected_userID) : 0;
	placeholder = typeof placeholder != 'undefined' ? placeholder : 0;

	/*var users_html = '';
	if (placeholder != '') {
		users_html += '<option value="0">' + placeholder + '</option>';
	}
	
	for(var i in ll_users){
		var ll_user = ll_users[i];
		var user_info = ll_user.firstName + ' ' + ll_user.lastName;
		
		var selected = (ll_user.userID == selected_userID) ? 'selected="selected"' : '';
		users_html += '<option value="' + ll_user.userID + '" ' + selected + '>' + user_info + '</option>';
	}

	$(selector).html (users_html);
	*/
	if (placeholder != '') {
		$(selector).append('<option value="0">' + placeholder + '</option>');

	}
	$(selector).append('<optgroup label="Active" name="select_active_user_mine">');
	$(selector).append('</optgroup>');
	$(selector).append('<optgroup label="Inactive" name="select_inactive_user_mine">');
	$(selector).append('</optgroup>');

	for(var i in ll_users){
		var ll_user = ll_users[i];
		var selected = (parseInt(ll_user.userID) == parseInt(selected_userID)) ? true : false;
		if(typeof ll_user.is_active != 'undefined' && parseInt(ll_user.is_active)){
			$(selector).find('[name="select_active_user_mine"] ').append($('<option/>', {
				value:  ll_user.userID,
				text: ll_user.firstName + ' ' + ll_user.lastName,
				tooltip: '',
				selected: selected
			}));
		} else {
			$(selector).find('[name="select_inactive_user_mine"] ').append($('<option/>', {
				value:  ll_user.userID,
				text: ll_user.firstName + ' ' + ll_user.lastName,
				tooltip: '',
				selected: selected
			}));
		}
	}
	$(selector).find('[name="select_active_user_mine"]').html($(selector).find('[name="select_active_user_mine"] option').sort(function (a, b) {
		return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
	}));
	$(selector).find('[name="select_inactive_user_mine"]').html($(selector).find('[name="select_inactive_user_mine"] option').sort(function (a, b) {
		return a.text == b.text ? 0 : a.text < b.text ? -1 : 1
	}));
	//ll;_combo_manager.sort(selector);
	ll_combo_manager.refresh(selector);
	ll_combo_manager.set_selected_value(selector, selected_userID);
}