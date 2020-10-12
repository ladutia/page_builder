/**
 * Created by Asmaa Ali on 24/11/2019.
 */
var ll_activations_manager = {

    is_popup_loaded: false,
    ll_activation_id: 0,
    done_callback: null,
    cancel_callback: null,

    is_winners_popup_loaded: false,
    winners_popup_ll_activation_id: 0,
    ignored_winners: [],
    refreshed_winners: [],

    is_announce_winners_popup_loaded: false,
    is_instructions_popup_loaded: false,
    announce_winners_popup_ll_activation_id: 0,
    ll_identifiers: {},

    is_prizes_notifications_popup_loaded: false,

    has_events_permission: 0,

    mode: 'add',

    open: function (ll_activation_id, mode, done_callback, cancel_callback){

        ll_activations_manager.ll_activation_id = 0;
        ll_activations_manager.done_callback = null;
        ll_activations_manager.cancel_callback = null;
        ll_activations_manager.mode = 'add';

        if(typeof ll_activation_id != 'undefined' && ll_activation_id){
            ll_activations_manager.ll_activation_id = ll_activation_id;
        }
        if(typeof mode != 'undefined' && mode){
            ll_activations_manager.mode = mode;
        }
        if(typeof done_callback != 'undefined' && done_callback){
            ll_activations_manager.done_callback = done_callback;
        }
        if(typeof cancel_callback != 'undefined' && cancel_callback){
            ll_activations_manager.cancel_callback = cancel_callback;
        }

        ll_activations_manager.draw_popup(function (response) {

            if(typeof response != 'undefined' && typeof response.ll_activation != 'undefined' && response.ll_activation) {
                ll_activations_manager.populate(response.ll_activation);
            }
            $('#ll-activation-popup .event-field').hide();
            if(ll_activations_manager.ll_activation_id){

                switch (ll_activations_manager.mode) {
                    case 'edit':
                        $('#ll-activation-popup .event-field').hide();
                        $('#ll-activation-popup .btn_save_activation_popup').text('Save');
                        ll_popup_manager.set_title('#ll-activation-popup', 'Settings');
                        break;
                    case 'clone':
                        if(ll_activations_manager.has_events_permission) {
                            $('#ll-activation-popup .event-field').show();
                        }
                        $('#ll-activation-popup .btn_save_activation_popup').text('Clone');
                        ll_popup_manager.set_title('#ll-activation-popup', 'Clone');
                        break;
                }

            } else {
                if(ll_activations_manager.has_events_permission){
                    $('#ll-activation-popup .event-field').show();
                }
                $('#ll-activation-popup .btn_save_activation_popup').text('Continue');
                ll_popup_manager.set_title('#ll-activation-popup', 'New Activation');
                ll_popup_manager.open('#ll-activation-popup');
            }
            ll_popup_manager.open('#ll-activation-popup');
        });
    },

    draw_popup: function (_callback){

        if(! ll_activations_manager.is_popup_loaded){
            var _html = '';
            _html += '<div class="ll-popup" id="ll-activation-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      New Activation';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="form">';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Name</label></div>';
            _html += '              <input type="text" class="txt-field" id="ll_activation_name">';
            _html += '          </div>';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Description</label></div>';
            _html += '              <textarea class="txt-field" id="ll_activation_desc"></textarea> ';
            _html += '         	</div>';
            _html += '          <div class="t-field ll-line-field event-field" style="display: none;">';
            _html += '              <div class="label label-small"><label>Event</label></div>';
            _html += '              <select id="ll_activation_event_id">';
            _html += '                  <option value="0">--- Select Event ---</option>';
            _html += '              </select>';
            _html += '          </div>';
            _html += '          <div class="t-field ll-line-field activation_identifier">';
            _html += '              <div class="label label-small"><label>Activation</label></div>';
            _html += '              <select id="ll_activation_identifier_id">';
            _html += '                  <option value="0">--- Select Activation ---</option>';
            _html += '              </select>';
            _html += '              <span id="ll_activation_identifier_img">';

            _html += '              </span>';
            _html += '          </div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_activation_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_activation_popup">Continue</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);

            ll_activations_manager.apply_actions();
            ll_activations_manager.is_popup_loaded = true;
            apply_ll_tooltip('#ll-activation-popup');

            ll_activations_manager.initiate(ll_activations_manager.ll_activation_id, function (response) {

                if(typeof response.has_events_permission != 'undefined' && response.has_events_permission){
                    ll_activations_manager.has_events_permission = parseInt(response.has_events_permission);
                }
                if(typeof response.ll_events != 'undefined' && response.ll_events){
                    ll_combo_manager.add_kv_options('#ll-activation-popup #ll_activation_event_id',  response.ll_events);
                }
                if(typeof response.ll_activation_identifiers != 'undefined' && response.ll_activation_identifiers){
                    ll_combo_manager.add_kv_options('#ll-activation-popup #ll_activation_identifier_id',  response.ll_activation_identifiers);
                    ll_combo_manager.sort('#ll-activation-popup #ll_activation_identifier_id');
                    ll_combo_manager.set_selected_value('#ll-activation-popup #ll_activation_identifier_id','');

                }
                if(typeof response.ll_identifiers != 'undefined' && response.ll_identifiers){
                    ll_activations_manager.ll_identifiers = response.ll_identifiers;
                }
                if(typeof _callback != 'undefined' && _callback){
                    _callback(response);
                }
            });

        } else {
            ll_activations_manager.reset();
            if(ll_activations_manager.ll_activation_id){
                ll_activations_manager.load(ll_activations_manager.ll_activation_id, 0,function (response) {
                    if(typeof _callback != 'undefined' && _callback){
                        _callback(response);
                    }
                });
            } else {
                if(typeof _callback != 'undefined' && _callback){
                    _callback();
                }
            }
        }
    },

    reset:function(){
        $('#ll-activation-popup .activation_identifier').show();
        $('#ll-activation-popup #ll_activation_name').val('');
        $('#ll-activation-popup #ll_activation_desc').val('');
        ll_combo_manager.set_selected_value('#ll-activation-popup #ll_activation_event_id', '0');
        ll_combo_manager.set_selected_value('#ll-activation-popup #ll_activation_identifier_id', '0');
        $('#ll-activation-popup #ll_activation_identifier_img').html('');
        $('#ll-activation-popup .btn_save_activation_popup').text('Save');

    },

    apply_actions: function (){

        ll_combo_manager.make_combo('#ll-activation-popup select');
        ll_combo_manager.event_on_change('#ll-activation-popup #ll_activation_identifier_id', function(){
            $('#ll-activation-popup #ll_activation_identifier_img').html('');
            var ll_activation_identifier_id = ll_combo_manager.get_selected_value($(this));
            if(parseInt(ll_activation_identifier_id) && ll_activation_identifier_id in ll_activations_manager.ll_identifiers){
                var ll_identifier = ll_activations_manager.ll_identifiers[ll_activation_identifier_id];
                if(typeof ll_identifier.background_image != 'undefined' && $.trim(ll_identifier.background_image)){
                    $('#ll-activation-popup #ll_activation_identifier_img').html('<img src="'+ll_identifier.background_image+'"/>');
                }
            }
        });

        $('.btn_cancel_activation_popup').click(function (){
            ll_activations_manager.ll_activation_id = 0;
            ll_popup_manager.close('#ll-activation-popup');
        });

        $('.btn_save_activation_popup').click(function (){
            ll_activations_manager.save();
        });
    },

    populate: function (ll_activation){
        if(typeof ll_activation != 'undefined'){
            $('#ll-activation-popup #ll_activation_name').val(ll_activation.ll_activation_name);
            $('#ll-activation-popup #ll_activation_desc').val(ll_activation.ll_activation_desc);
            ll_combo_manager.set_selected_value('#ll-activation-popup #ll_activation_event_id', ll_activation.event_id);
            ll_combo_manager.set_selected_value('#ll-activation-popup #ll_activation_identifier_id', ll_activation.ll_activation_identifier_id);
            ll_combo_manager.trigger_event_on_change('#ll-activation-popup #ll_activation_identifier_id');
            $('#ll-activation-popup .activation_identifier').hide();
            if(ll_activations_manager.mode == 'clone'){
                $('#ll-activation-popup #ll_activation_name').val(ll_activation.ll_activation_name + ' - Clone');
                ll_combo_manager.set_selected_value('#ll-activation-popup #ll_activation_event_id', '');
            }
        }
    },

    initiate: function(ll_activation_id,_callback){

        var data = {};
        data.action = 'initiate';
        data.ll_activation_id = ll_activation_id;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof _callback !='undefined'){
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    load:function(ll_activation_id, load_identifiers, _callback){

        var data = {};
        data.action = 'load';
        data.ll_activation_id = ll_activation_id;
        data.load_identifiers = load_identifiers;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof response.ll_activation != 'undefined' && response.ll_activation){
                        if(typeof _callback !='undefined'){
                            _callback(response);
                        }
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    collect_data: function(){
        var data = {};
        var ll_activation_name = $.trim($('#ll-activation-popup #ll_activation_name').val());
        if(!ll_activation_name){
            show_error_message('Name is required');
            return;
        }
        data.ll_activation_name = ll_activation_name;
        data.ll_activation_desc = $.trim($('#ll-activation-popup #ll_activation_desc').val());
        data.event_id = ll_combo_manager.get_selected_value('#ll-activation-popup #ll_activation_event_id');
        data.ll_activation_identifier_id = ll_combo_manager.get_selected_value('#ll-activation-popup #ll_activation_identifier_id');
     /*   if(!parseInt(data.event_id)){
            show_error_message('Please select an Event');
            return;
        }*/
        if(!parseInt(data.ll_activation_identifier_id)){
            show_error_message('Please select activation');
            return;
        }
        return data;
    },

    save: function (){

        var data = ll_activations_manager.collect_data();
        if(!data){
            return;
        }

        data.action = 'save';
        data.mode = ll_activations_manager.mode;
        if(ll_activations_manager.ll_activation_id){
            data.ll_activation_id = ll_activations_manager.ll_activation_id;
        }
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    show_success_message(response.message);
                    ll_popup_manager.close('#ll-activation-popup');
                    if(typeof response.ll_activation != 'undefined' && response.ll_activation) {
                        if (ll_activations_manager.done_callback) {
                            ll_activations_manager.done_callback(response.ll_activation);
                        } else {
                            window.location = 'activation-builder.php?ll_activation_id='+ response.ll_activation.ll_activation_id;
                        }
                    }
                    ll_activations_manager.reset();
                    ll_activations_manager.ll_activation_id = 0;
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });

    },

    delete: function (itemlist,_callback){

        var confirm_message = "Are you sure you want to delete "+( itemlist.length > 1 ? "these activations" :"this activation")+"?";
        ll_confirm_popup_manager.open(confirm_message,function(){
            var data = {};
            data.action = 'delete';
            data.itemlist = itemlist;
            $.ajax({
                url: 'll-activations-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    ll_fade_manager.fade(false);
                    if (response.success) {
                        if(typeof _callback != 'undefined'){
                            _callback.call();
                        }
                    } else {
                        show_error_message(response.message);
                    }
                },
                error: function (response) {
                    ll_fade_manager.fade(false);
                    show_error_message("Unknown Error");
                }
            });
        });
    },

    is_active: function(ll_activation_id,is_active,_callback){
        var data = {};
        data.action = 'is_active';
        data.is_active = is_active;
        data.ll_activation_id = ll_activation_id;

        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    if(typeof _callback != 'undefined'){
                        _callback.call();
                    }
                } else {
                    show_error_message(response.message);

                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });
    },

    pick_prize: function(ll_activation_submit_prizes_id, is_picked_up, _callback){
        var data = {};
        data.action = 'pick_prize';
        data.is_picked_up = is_picked_up;
        data.ll_activation_submit_prizes_id = ll_activation_submit_prizes_id;

        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    if(typeof _callback != 'undefined'){
                        _callback.call();
                    }
                } else {
                    show_error_message(response.message);

                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });
    },

    archive_prospects: function(ll_activation_id, _callback){

        ll_confirm_popup_manager.open('Are you sure you want to reset the leaderboard?' , function () {
            var data = {};
            data.action = 'archive_prospects';
            data.ll_activation_id = ll_activation_id;

            $.ajax({
                url: 'll-activations-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    ll_fade_manager.fade(false);
                    if (response.success) {
                        if (typeof _callback != 'undefined') {
                            _callback.call();
                        }
                    } else {
                        show_error_message(response.message);

                    }
                },
                error: function (response) {
                    ll_fade_manager.fade(false);
                    show_error_message("Unknown Error");
                }
            });
        });

    },

    archive_prospect: function(ll_activation_id, prospect_id, _callback){

        var data = {};
        data.action = 'archive_prospect';
        data.ll_activation_id = ll_activation_id;
        data.prospect_id = prospect_id;

        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    if(typeof _callback != 'undefined'){
                        _callback.call();
                    }
                } else {
                    show_error_message(response.message);

                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });
    },

    unarchive_prospect: function(ll_activation_id, ll_activation_submission_results_id, _callback){

        var data = {};
        data.action = 'unarchive_prospect';
        data.ll_activation_id = ll_activation_id;
        data.ll_activation_submission_results_id = ll_activation_submission_results_id;

        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    if(typeof _callback != 'undefined'){
                        _callback.call();
                    }
                } else {
                    show_error_message(response.message);

                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });
    },

    clone: function(){
        var data = ll_activations_manager.collect_data();
        data.action = 'clone';
        data.ll_activation_id = ll_activations_manager.ll_activation_id;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                ll_fade_manager.fade(false);
                if (response.success) {
                    ll_popup_manager.close('#ll-activation-popup');
                    show_success_message(response.message);
                    ll_popup_manager.close('#ll-activation-popup');
                    if(typeof response.ll_activation != 'undefined' && response.ll_activation) {
                        if (ll_activations_manager.done_callback) {
                            ll_activations_manager.done_callback(response.ll_activation);
                        }
                    }
                    ll_activations_manager.reset();
                    ll_activations_manager.ll_activation_id = 0;
                } else {
                    show_error_message(response.message);

                }
            },
            error: function (response) {
                ll_fade_manager.fade(false);
                show_error_message("Unknown Error");
            }
        });
    },

    open_winners_popup: function (ll_activation_id, _callback){

        ll_activations_manager.ignored_winners = [];
        ll_activations_manager.refreshed_winners = [];
        ll_activations_manager.winners_popup_ll_activation_id = 0;

        if(typeof ll_activation_id != 'undefined' && parseInt(ll_activation_id)) {

            ll_activations_manager.winners_popup_ll_activation_id = ll_activation_id;

            if (!ll_activations_manager.is_winners_popup_loaded) {
                var _html = '';
                _html += '<div class="ll-popup setup1-mode" id="ll-winners-popup">';
                _html += '  <div class="ll-popup-head">';
                _html += '      Enter Total Winners';
                _html += '  </div>';
                _html += '  <div class="ll-popup-content">';
                _html += '      <div class="form">';
                _html += '          <div class="t-field ll-line-field setup1-container">';
                _html += '             <input type="number" class="txt-field" id="count_of_winners" value="1" max="5">';
                _html += '          </div>';
                _html += '          <div class="t-field ll-line-field winner_method setup2-container">';
                _html += '          </div>';
                _html += '          <div class="t-field ll-line-field winners_list setup2-container">';
                _html += '          </div>';
                _html += '      </div>';
                _html += '  </div>';
                _html += '  <div class="ll-popup-footer clearfix">';
				_html += '      <a href="javascript:void(0);" class="t-btn-gray t-btn-left btn_activation_drawing_actions"';
				_html += '      ll_asset_id=""';
				_html += '      ll_asset_type="' + ll_completion_actions_manager.LL_ASSET_TYPE_ACTIVATION + '"';
				_html += '      ll_activity_type="' + ll_completion_actions_manager.LL_ACTIVITY_TYPE_ACTIVATION_SUBMISSION_WINNER + '"';
				_html += '      >Actions</a>';
                _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_winners_popup">Cancel</a>';
                _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_winners_popup">Confirm</a>';
                _html += '      <a href="javascript:void(0);" class="t-btn-orange load-winners">Load Winners</a>';
                _html += '  </div>';
                _html += '</div>';
	
                $('#mainWrapper').append(_html);

                if (!ll_activations_manager.is_winners_popup_loaded) {

                    $('.btn_cancel_winners_popup').click(function () {
                        ll_popup_manager.close('#ll-winners-popup');
                    });

                    $('.btn_save_winners_popup').click(function () {
                        if($("#ll-winners-popup").hasClass('setup1-mode')){

                            if(!parseInt($('#count_of_winners').val())){
                                show_error_message('You should enter count of winners');
                                return;
                            }
                            if(parseInt($('#count_of_winners').val()) > 5){
                                show_error_message('No more than five winners are allowed.');
                                return;
                            }

                            $("#ll-winners-popup").removeClass('setup1-mode').addClass('setup2-mode');
                            ll_popup_manager.set_title("#ll-winners-popup", 'Winners');
                            if($('#ll-winners-popup .winner_method .t-radio').length > 1){
                                $('#ll-winners-popup .winner_method').show();
                                $('#ll-winners-popup .btn_save_winners_popup').hide();
                                $('#ll-winners-popup .load-winners').show();
                                ll_popup_manager.set_title("#ll-winners-popup", 'Drawing Method');
                            } else {
                                $('#ll-winners-popup .winner_method').hide();
                                $('#ll-winners-popup .load-winners').hide().click();
                            }
                        } else {
                            ll_activations_manager.save_winners(ll_activations_manager.winners_popup_ll_activation_id, function (response) {
                                ll_popup_manager.close('#ll-winners-popup');
                                if(typeof _callback != 'undefined' && _callback){
                                    _callback();
                                }
                            });
                        }
                    });

                    $('#ll-winners-popup input[name="radio_winner_methods"]').live('change', function () {
                        if($("#ll-winners-popup").hasClass('setup2-mode')) {
                            ll_activations_manager.ignored_winners = [];
                            $('#ll-winners-popup .btn_save_winners_popup').hide();
                            $('#ll-winners-popup .load-winners').show();
                            $('#ll-winners-popup .winners_list .ll-line-field').remove();
                            ll_combo_manager.set_selected_value('#specific_company','');
                            if ($(this).val() == LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY) {
                                $('#ll-winners-popup #span_specific_company').show();
                            } else {
                                $('#ll-winners-popup #span_specific_company').hide();
                            }
                        }
                    });

                    $('#ll-winners-popup .load-winners').click(function () {
                        var count_of_winners = $('#ll-winners-popup #count_of_winners').val();
                        var winner_method = $('#ll-winners-popup .winner_method input[name=radio_winner_methods]:checked').val();
                        if(parseInt(count_of_winners)){

                            if(winner_method == LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY){
                                var specific_company = ll_combo_manager.get_selected_value('#specific_company');
                                if(!$.trim(specific_company)){
                                    show_error_message('Please select company!');
                                    return;
                                }
                            }
                            switch (winner_method) {
                                case LL_ACTIVATION_WINNER_METHOD_HAND_SELECTED:
                                case LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY:
                                    ll_activations_manager.populate_winners(winner_method, []);
                                    break;
                                default:
                                    ll_activations_manager.load_winners('load_winners', ll_activations_manager.winners_popup_ll_activation_id, count_of_winners, [], function (response) {
                                        if (typeof response.winners != 'undefined' && response.winners && Object.keys(response.winners).length) {
                                            ll_activations_manager.populate_winners(winner_method, response.winners);
                                        } else {
                                            show_error_message('There are no more winners to suggest');
                                        }
                                    });
                                    break;
                            }
                        }
                    });

                    $('#ll-winners-popup .ignore-winner').live('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var ll_field = $(this).closest('.ll-line-field');
                        var prospect_id = ll_field.attr('prospect_id');
                        if(parseInt(prospect_id)){
                            ll_activations_manager.ignored_winners.push(parseInt(prospect_id));
                            ll_field.find('.txt-field').val('');
                            ll_field.attr('prospect_id', 0);
                            ll_field.find('span.score').html('');
                        }
                    });

                    $('#ll-winners-popup .refresh-winner').live('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        var ll_field = $(this).closest('.ll-line-field');
                        ll_activations_manager.refreshed_winners.push(parseInt($(ll_field).attr('prospect_id')));
                        var except_ids =$.merge( $.makeArray( ll_activations_manager.ignored_winners ) , $.makeArray( ll_activations_manager.refreshed_winners ));
                        $('#ll-winners-popup .winners_list .ll-line-field[prospect_id]').each(function(){
                            if(parseInt($(this).attr('prospect_id'))){
                                except_ids.push(parseInt($(this).attr('prospect_id')));
                            }
                        });
                        ll_activations_manager.load_winners('load_winners', ll_activations_manager.winners_popup_ll_activation_id, 1, except_ids,function (response) {
                            if(typeof response.winners != 'undefined' && response.winners && Object.keys(response.winners ).length) {
                                for(var winner_id in response.winners) {
                                    ll_field.attr('prospect_id', response.winners[winner_id].id);
                                    ll_field.find('.txt-field').val(response.winners[winner_id].name);
                                    ll_field.find('span.score').html(' | '+response.winners[winner_id].score);
                                }
                                $('#ll-winners-popup .winners_list').append(_html);
                            } else {
                                show_error_message('There are no more winners to announce!');
                            }
                        });
                    });

                    ll_activations_manager.is_winners_popup_loaded = true;
                }
				$('#ll-winners-popup .btn_activation_drawing_actions').bind('click', function (){
					ll_popup_manager.close('#ll-winners-popup');
					
					ll_completion_actions_manager.open({
						ll_asset_type: $(this).attr ('ll_asset_type'),
						ll_asset_id: $(this).attr ('ll_asset_id'),
						ll_activity_type: $(this).attr ('ll_activity_type')
					}, function(){
						ll_popup_manager.open('#ll-winners-popup');
                        }, {}, function (){
							ll_popup_manager.open('#ll-winners-popup');
						}
                    );
                });
			}

            $("#ll-winners-popup").addClass('setup1-mode').removeClass('setup2-mode');
            $('#count_of_winners').val(1);
            $('#ll-winners-popup .winner_method').hide();
            $('#ll-winners-popup .load-winners').hide();
            $('#ll-winners-popup .winners_list').html('');
            $('#ll-winners-popup .btn_save_winners_popup').show();
            $('#ll-winners-popup .btn_activation_drawing_actions').attr('ll_asset_id', ll_activation_id);
            ll_popup_manager.set_title("#ll-winners-popup", 'Enter Total Winners');

            ll_activations_manager.load_winners('initiate_winners', ll_activations_manager.winners_popup_ll_activation_id, 0, [],function (response) {
                if(typeof response != 'undefined' && response){
                    if(typeof response.ll_activation != 'undefined' && response.ll_activation && typeof response.ll_activation_identifier != 'undefined' && response.ll_activation_identifier) {
                        if(typeof response.ll_activation_identifier.winner_methods != 'undefined' && Object.keys(response.ll_activation_identifier.winner_methods).length){
                            var winner_methods = response.ll_activation_identifier.winner_methods;
                            $('#ll-winners-popup .winner_method .ll-line-field').remove();
                            $('#ll-winners-popup .winner_method .t-radio').remove();
                            $('#ll-winners-popup #span_specific_company').remove();
                            var _html = '';
                            for(var i in winner_methods){
                                _html = '<div class="t-field ll-line-field"></div><div class="t-radio inline"><label><i class="icn-radio"></i><input type="radio" name="radio_winner_methods" value="'+i+'"> '+winner_methods[i]+'</label></div>';
                                if(parseInt(i) == parseInt(LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY)){
                                    _html += '     <span id="span_specific_company" style="display: none;">';
                                    _html += '      <select id="specific_company" class="txt-field-small-combo" data-placeholder="--- Select Company ---">';
                                    _html += '          <option value="">--- Select Company ---</option>';
                                    _html += '      </select>';
                                    _html += '     </span>';
                                }
                                _html += '</div>';

                                $('#ll-winners-popup .winner_method').append(_html);
                            }
                            ll_theme_manager.checkboxRadioButtons.initiate_container('#ll-winners-popup .winner_method');
                            ll_theme_manager.checkboxRadioButtons.check('#ll-winners-popup .winner_method input[name=radio_winner_methods]:first', true);

                            if($('#ll-winners-popup #span_specific_company').length){
                                /*ll_combo_manager.make_ajax_combo('#ll-winners-popup #specific_company', {
                                    url: "ll-activations-process.php?action=search_in_submitted_companies&ll_activation_id="+ ll_activations_manager.winners_popup_ll_activation_id
                                });*/
                                ll_combo_manager.make_combo('#ll-winners-popup #specific_company');
                                ll_combo_manager.clear_all('#ll-winners-popup #specific_company',true);
                                ll_combo_manager.add_option('#ll-winners-popup #specific_company','', '--- Select Company ---');
                                if(typeof response.companies != 'undefined' && response.companies){
                                    ll_combo_manager.add_kv_options('#ll-winners-popup #specific_company',response.companies);
                                }
                                ll_combo_manager.event_on_change('#ll-winners-popup #specific_company', function () {
                                    ll_activations_manager.ignored_winners = [];
                                    $('#ll-winners-popup .btn_save_winners_popup').hide();
                                    $('#ll-winners-popup .load-winners').show();
                                    $('#ll-winners-popup .winners_list .ll-line-field').remove();
                                });
                            }
                        }
                        ll_popup_manager.open('#ll-winners-popup');
                    }
                }
            });
        } else {
            show_error_message('Invalid activation');
        }
    },

    load_winners: function (action, ll_activation_id, count, except_arr, _callback){

        var data = {};
        data.action = action;
        data.ll_activation_id = ll_activation_id;
        if(action == 'load_winners'){
            data.winner_method = $('#ll-winners-popup .winner_method input[name=radio_winner_methods]:checked').val();
            data.count_of_winners = count;
            data.except_ids = except_arr;
            if(data.winner_method == LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY){
                data.company =ll_combo_manager.get_selected_value('#ll-winners-popup #specific_company');
            }
        }
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    save_winners: function (ll_activation_id, _callback){

        var data = {};
        data.action = 'save_winners';
        data.ll_activation_id = ll_activations_manager.winners_popup_ll_activation_id;
        data.winner_method = $('#ll-winners-popup .winner_method input[name=radio_winner_methods]:checked').val();
        data.count_of_winners = $('#ll-winners-popup #count_of_winners').val();
        data.winners_ids = [];
        $('#ll-winners-popup .winners_list .ll-line-field[prospect_id]').each(function(){
            var $this = $(this);
            switch (data.winner_method) {
                case LL_ACTIVATION_WINNER_METHOD_RANDOM:
                case LL_ACTIVATION_WINNER_METHOD_TOP_COMPANY:
                case LL_ACTIVATION_WINNER_METHOD_TOP_SCORE:
                case LL_ACTIVATION_WINNER_METHOD_LOWEST_TIME:
                    if(parseInt($this.attr('prospect_id'))){
                        data.winners_ids.push(parseInt($this.attr('prospect_id')));
                    }
                    break;
                case LL_ACTIVATION_WINNER_METHOD_HAND_SELECTED:
                    var prospect_id = ll_combo_manager.get_selected_value($this.find('select'));
                    if(typeof prospect_id != 'undefined' && parseInt(prospect_id)){
                        data.winners_ids.push(prospect_id);
                    }
                    break;
                case LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY:
                    var prospect_id = ll_combo_manager.get_selected_value($this.find('select'));
                    if(typeof prospect_id != 'undefined' && parseInt(prospect_id)){
                        data.winners_ids.push(prospect_id);
                    }
                    break;
            }
        });

        if(!data.count_of_winners || !data.winners_ids.length){
            show_error_message(' You should choose winners to announce');
            return;
        }
        var message = 'Are you sure you are ready to announce the winner(s)?';
        if(Object.keys(data.winners_ids).length < parseInt(data.count_of_winners)){
            message = 'You entered '+ data.count_of_winners +' possible winner(s) but selected only ' + Object.keys(data.winners_ids).length + ' winner(s). Are you sure you want to continue?';
        }
        ll_popup_manager.close('#ll-winners-popup');
        ll_confirm_popup_manager.open(message , function () {
            $.ajax({
                url: 'll-activations-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        if(typeof _callback != 'undefined' && _callback) {
                            _callback(response);
                        }
                    } else {
                        show_error_message(response.message);
                    }
                },
                error: function (response) {
                    show_error_message("Unknown Error");
                }
            });
        });
    },

    populate_winners: function(winner_method, winners){

        $('#ll-winners-popup .load-winners').hide();
        $('#ll-winners-popup .btn_save_winners_popup').show();
        $('#ll-winners-popup .winners_list .ll-line-field').remove();
        var _html = '';
        switch (winner_method) {
            case LL_ACTIVATION_WINNER_METHOD_RANDOM:
            case LL_ACTIVATION_WINNER_METHOD_TOP_COMPANY:
            case LL_ACTIVATION_WINNER_METHOD_TOP_SCORE:
            case LL_ACTIVATION_WINNER_METHOD_LOWEST_TIME:
                if(typeof winners != 'undefined' && Object.keys(winners).length) {
                    var count = 1;
                    for (var winner_id in winners) {
                        _html += ' <div class="t-field ll-line-field" prospect_id="' + winners[winner_id].id + '">';
                        switch (winner_method) {
                            case LL_ACTIVATION_WINNER_METHOD_TOP_SCORE:
                                _html += '     <div class="label label-left"><label>Winner ' + count + '<span class="score"> | ' + parseInt(winners[winner_id].score) + '</span></label></div>';
                                break;
                            case LL_ACTIVATION_WINNER_METHOD_LOWEST_TIME:
                                _html += '     <div class="label label-left"><label>Winner ' + count + '<span class="score"> | ' + parseInt(winners[winner_id].score) + '</span></label></div>';
                                break;
                            default:
                                _html += '     <div class="label label-left"><label>Winner ' + count + '</label></div>';
                                break;
                        }

                        _html += '     <input type="text" class="txt-field" readonly value="' + winners[winner_id].name + '"> ';
                        _html += '     <a href="javascript:void(0)" class="ignore-winner ll_std_tooltip" title="Ignore"><img src="imgs/svg/delete-gray.svg"></a>';
                        _html += '     <a href="javascript:void(0)" class="refresh-winner ll_std_tooltip" title="Refresh"><img src="imgs/svg/refresh-gray.svg"></a>';
                        _html += '  </div>';
                        count++;
                    }
                    $('#ll-winners-popup .winners_list').append(_html);
                }
                break;
            case LL_ACTIVATION_WINNER_METHOD_HAND_SELECTED:
                var count_of_winners = parseInt($('#ll-winners-popup #count_of_winners').val());
                for(var i= 0; i < count_of_winners ; i++) {
                    _html = '';
                    _html += ' <div class="t-field ll-line-field" prospect_id="0">';
                    _html += '     <div class="label label-left"><label>Winner '+(i+1)+'</label></div>';
                    _html += '     <select>';
                    _html += '         <option value="0">--- Select Winner ---</option>';
                    _html += '     </select>';
                    _html += '  </div>';
                    $('#ll-winners-popup .winners_list').append(_html);
                    ll_combo_manager.make_ajax_combo('#ll-winners-popup .winners_list select:last', {
                        url: "ll-activations-process.php?action=search_in_winners&text=name_and_email&ll_activation_id="+ ll_activations_manager.winners_popup_ll_activation_id
                    });
                }
                break;
            case LL_ACTIVATION_WINNER_METHOD_SPECIFIC_COMPANY:
                var count_of_winners = parseInt($('#ll-winners-popup #count_of_winners').val());
                ll_activations_manager.load_winners('load_winners', ll_activations_manager.winners_popup_ll_activation_id, count_of_winners, [],function (response) {
                    if(typeof response.winners != 'undefined' && response.winners && Object.keys(response.winners ).length) {
                        var winners_arr = {};
                        for(var winner_id in response.winners) {
                            winners_arr[response.winners[winner_id].id] = response.winners[winner_id].name;
                        }
                        var specific_company = ll_combo_manager.get_selected_value('#specific_company');
                        for(var i= 0; i < count_of_winners ; i++) {
                            _html = '';
                            _html += ' <div class="t-field ll-line-field" prospect_id="0">';
                            _html += '     <div class="label label-left"><label>Winner '+(i+1)+'</label></div>';
                            _html += '     <select>';
                            _html += '         <option value="">--- Select Winner ---</option>';
                            _html += '     </select>';
                            _html += '  </div>';
                            $('#ll-winners-popup .winners_list').append(_html);

                            ll_combo_manager.make_combo('#ll-winners-popup .winners_list select:last');
                            ll_combo_manager.add_kv_options('#ll-winners-popup .winners_list select:last',winners_arr);

                            /*ll_combo_manager.make_ajax_combo('#ll-winners-popup .winners_list select:last', {
                                url: "ll-activations-process.php?action=search_in_winners&text=name_and_email&ll_activation_id="+ ll_activations_manager.winners_popup_ll_activation_id + "&company="+ specific_company
                            });*/
                        }
                    } else {
                        show_error_message('There are no more winners to announce!');
                    }
                });
                break;
        }
        apply_ll_tooltip('#ll-winners-popup .winners_list');

    },

    open_announce_winners_popup: function (ll_activation_id, _callback){

        ll_activations_manager.announce_winners_popup_ll_activation_id = 0;

        if(typeof ll_activation_id != 'undefined' && parseInt(ll_activation_id)) {

            ll_activations_manager.announce_winners_popup_ll_activation_id = ll_activation_id;

            if (!ll_activations_manager.is_announce_winners_popup_loaded) {
                var _html = '';
                _html += '<div class="ll-popup" id="ll-announce-winners-popup">';
                _html += '  <div class="ll-popup-head">';
                _html += '      Select Your View';
                _html += '  </div>';
                _html += '  <div class="ll-popup-content">';
                _html += '      <div class="form">';
				_html += '          <div class="t-field ll-line-field li-leaderboard_mode">';
				//_html += '              <label style="margin-right: 6px;">Mode</label>';
				_html += '             <div class="t-radio">';
				_html += '                   <label><i class="icn-radio"></i>';
				_html += '                       <input name="leaderboard_mode" value="leaderboard" type="radio" checked>';
				_html += '                       <span class="fb-wrap-tooltip">Leaderboard</span>';
				_html += '                   </label>';
				_html += '             </div>';
				_html += '            <div class="t-radio">';
				_html += '                    <label><i class="icn-radio"></i>';
				_html += '                       <input name="leaderboard_mode" value="winners" type="radio">';
				_html += '                       <span class="fb-wrap-tooltip">People selected from drawing</span>';
				_html += '                   </label>';
				_html += '             </div>';
				_html += '          </div>';
				_html += '          <div class="t-field ll-line-field container_leaderboard_winners_segment" style="display: none;">';
				_html += '             <div class="label label-auto"><label>Segment</label></div>';
				_html += '              <select id="chunk_numbers">';
				_html += '                  <option value="0">--- Select Segment ---</option>';
				_html += '              </select>';
				_html += '          </div>';
                _html += '      </div>';
                _html += '  </div>';
                _html += '  <div class="ll-popup-footer clearfix">';
                _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_announce_winners_popup">Cancel</a>';
                _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_leaderboard_launch" target="_blank">Launch</a>';
                _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_announce_winners_popup">Launch</a>';
                _html += '  </div>';
                _html += '</div>';

                $('#mainWrapper').append(_html);

                ll_combo_manager.make_combo('#ll-announce-winners-popup select');
                ll_theme_manager.checkboxRadioButtons.initiate_container('#ll-announce-winners-popup');
	
				$('#ll-announce-winners-popup input[name="leaderboard_mode"]').bind('change', function () {
					$('#ll-announce-winners-popup .container_leaderboard_winners_segment').hide ();
					$('#ll-announce-winners-popup .btn_leaderboard_launch').hide ();
					$('#ll-announce-winners-popup .btn_save_announce_winners_popup').hide ();

					var leaderboard_mode = $('#ll-announce-winners-popup input[name="leaderboard_mode"]:checked').val ();
					if (leaderboard_mode == 'leaderboard') {
						$('#ll-announce-winners-popup .btn_leaderboard_launch').show ();
                    } else if (leaderboard_mode == 'winners') {
						$('#ll-announce-winners-popup .container_leaderboard_winners_segment').show ();
						$('#ll-announce-winners-popup .btn_save_announce_winners_popup').show ();
                    }
				});
				$('#ll-announce-winners-popup input[name="leaderboard_mode"]').trigger('change');

                $('.btn_cancel_announce_winners_popup').click(function () {
                    ll_popup_manager.close('#ll-announce-winners-popup');
                });

                $('.btn_leaderboard_launch').click(function () {
					ll_popup_manager.close('#ll-announce-winners-popup');
					return true;
				});
                $('.btn_save_announce_winners_popup').click(function () {
                    ll_activations_manager.announce_winners(ll_activations_manager.announce_winners_popup_ll_activation_id, function (response) {
                        if(typeof response.url != 'undefined' && response.url){
                            window.open(response.url, '_blank');

                        }
                        ll_popup_manager.close('#ll-announce-winners-popup');
                    });
                });

                ll_activations_manager.is_announce_winners_popup_loaded = true;
            }
            $('#ll-announce-winners-popup .li-leaderboard_mode').show();
            $('#ll-announce-winners-popup .container_leaderboard_winners_segment').hide();
            ll_combo_manager.clear_all('#ll-announce-winners-popup #chunk_numbers');
            ll_activations_manager.load_announce_winners (ll_activations_manager.announce_winners_popup_ll_activation_id,function (response) {
                ll_combo_manager.add_option('#ll-announce-winners-popup #chunk_numbers', 0, '--- Select Segment ---');
                if(typeof response != 'undefined' && response){
                    if(typeof response.add_all_option != 'undefined' && parseInt(response.add_all_option)){
                        ll_combo_manager.add_option('#ll-announce-winners-popup #chunk_numbers', 'all', 'All');
                    }
                    if(typeof response.chunk_numbers != 'undefined' && response.chunk_numbers){
                        ll_combo_manager.add_kv_options('#ll-announce-winners-popup #chunk_numbers', response.chunk_numbers);
                    }

                    if(typeof response.ll_activation_identifier != 'undefined' && response.ll_activation_identifier){

                        if(!parseInt(response.ll_activation_identifier.is_accept_leaderboard)){
                            $('#ll-announce-winners-popup .li-leaderboard_mode').hide();
                            $('#ll-announce-winners-popup .container_leaderboard_winners_segment').show();
                        }
                    }

					$('#ll-announce-winners-popup .btn_leaderboard_launch').attr ('href', 'activation-leaderboard.php?token=' + response.ll_activation.ll_activation_token);
                    ll_popup_manager.open('#ll-announce-winners-popup');
                }
            });
        } else {
            show_error_message('Invalid activation');
        }
    },

    load_announce_winners: function (ll_activation_id, _callback){

        var data = {};
        data.action = 'load_announce_winners_data';
        data.ll_activation_id = ll_activation_id;
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    announce_winners: function (ll_activation_id, _callback){

        var data = {};
        data.action = 'announce_winners';
        data.ll_activation_id = ll_activations_manager.announce_winners_popup_ll_activation_id;
        data.chunk_number = ll_combo_manager.get_selected_value('#ll-announce-winners-popup #chunk_numbers');
        if(!parseInt(data.chunk_number) && data.chunk_number != 'all') {
            show_error_message("Please select segment");
            return;
        }
        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    add_instructions_popup: function (ll_activation_id, _callback) {
            if (!ll_activations_manager.is_instructions_popup_loaded) {
                var html = '<div class="ll-popup" id="popup-activation-instructions-editor">' +
                    '    <div class="ll-popup-head">Instructions</div>' +
                    '    <div class="ll-popup-content">' +
                    '        <div class="t-field ll-line-field">' +
                    '                <textarea id="activation-instructions-editor">' +
                    '                </textarea>' +
                    '        </div>' +
                    '        <div class="t-field ll-line-field">' +
                    '            <label style="margin-right: 20px;"> Mobile: </label>' +
                    '            <div class="t-radio">' +
                    '                    <label><i class="icn-radio"></i>' +
                    '                       <input name="instructions_mobile_mode" value="0" type="radio">' +
                    '                       <span class="fb-wrap-tooltip">Never display</span>' +
                    '                   </label>' +
                    '             </div>' +
                    '            <div class="t-radio">' +
                    '                    <label><i class="icn-radio"></i>' +
                    '                       <input name="instructions_mobile_mode" value="1" type="radio" checked>' +
                    '                       <span class="fb-wrap-tooltip">Display once</span>' +
                    '                   </label>' +
                    '             </div>' +
                    '            <div class="t-radio">' +
                    '                    <label><i class="icn-radio"></i>' +
                    '                       <input name="instructions_mobile_mode" value="2" type="radio">' +
                    '                       <span class="fb-wrap-tooltip">Always Display</span>' +
                    '                   </label>' +
                    '             </div>' +
                    '         </div>' +
                    '        <div class="t-field ll-line-field">' +
                    '            <label style="margin-right: 6px;"> Webview: </label>' +
                    '            <div class="t-radio">' +
                    '                    <label><i class="icn-radio"></i>' +
                    '                       <input name="instructions_webview_mode" value="0" type="radio">' +
                    '                       <span class="fb-wrap-tooltip">Never display</span>' +
                    '                   </label>' +
                    '             </div>' +
                    '            <div class="t-radio">' +
                    '                    <label><i class="icn-radio"></i>' +
                    '                       <input name="instructions_webview_mode" value="2" type="radio">' +
                    '                       <span class="fb-wrap-tooltip">Always Display</span>' +
                    '                   </label>' +
                    '             </div>' +
                    '         </div>' +
                    '    </div>' +
                    '    <div class="ll-popup-footer clearfix">' +
                    '        <a href="javascript:void(0);" class="t-btn-gray ll-close-popup" id="close_activation_instructions_editor_popup">Cancel</a>' +
                    '        <a href="javascript:void(0);" class="t-btn-orange ll-close-popup" id="fb-btn-save-activation-instructions-editor">Save</a>' +
                    '    </div>' +
                    '</div>';
                $('#mainWrapper').append(html);
                tinyMCE.init({
                    entity_encoding: "UTF-8",
                    elements: "richEditor",
                    selector: '#activation-instructions-editor',
                    //theme : "advanced",
                    plugins: "hr image lists pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
                    auto_reset_designmode: true,
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
                    moxiemanager_title: 'Instructions',
                    autosave_ask_before_unload: false,
                    height: 250,
                    setup: function (ed) {
                        ed.on('init', function (e) {

                        });
                    }
                });
                ll_theme_manager.checkboxRadioButtons.initiate_container('#popup-activation-instructions-editor');
                $('#close_activation_instructions_editor_popup').click(function () {
                    ll_popup_manager.close('#popup-activation-instructions-editor');
                });

                $('#fb-btn-save-activation-instructions-editor').click(function () {
                    ll_activations_manager.save_activation_instructions(ll_activation_id);
                });
                ll_activations_manager.is_instructions_popup_loaded = true;
            } else {
                tinyMCE.get('activation-instructions-editor').setContent('');
                ll_theme_manager.checkboxRadioButtons.check('input[name="instructions_mobile_mode"][value="1"]', true);
                ll_theme_manager.checkboxRadioButtons.check('input[name="instructions_webview_mode"][value="1"]', true);
            }
    },

    load_activation_instructions: function(ll_activation_id, _callback){
        var data = {};
        data.action = 'load_activation_instructions';
        data.ll_activation_id = ll_activation_id;
        $.ajax( {
            type :"POST",
            url : "ll-activations-process.php",
            data :data,
            cache :false,
            success : function(response) {
                if (response.success != 1) {
                    show_error_message(response.message);
                } else {
                    if(typeof response.instructions_mobile_mode != 'undefined'){
                        ll_theme_manager.checkboxRadioButtons.check('input[name="instructions_mobile_mode"][value="' + response.instructions_mobile_mode + '"]', true);
                    }
                    if(typeof response.instructions_webview_mode != 'undefined'){
                        ll_theme_manager.checkboxRadioButtons.check('input[name="instructions_webview_mode"][value="' + response.instructions_webview_mode + '"]', true);
                    }
                    if(typeof response.instructions_content != 'undefined' && response.instructions_content){
                        tinyMCE.get('activation-instructions-editor').setContent(response.instructions_content);
                    }
                    ll_popup_manager.open('#popup-activation-instructions-editor');
                    if(typeof _callback != 'undefined' && _callback){
                        _callback();
                    }
                }
            },
            error : function() {
                show_error_message('Connection Error!');
                return false;
            }
        });
    },

    save_activation_instructions: function(ll_activation_id, _callback){
        var data = {};
        data.ll_activation_id = ll_activation_id;
        data.instructions_content = tinyMCE.get('activation-instructions-editor').getContent();
        data.instructions_mobile_mode = $('input[name="instructions_mobile_mode"]:checked').val();
        data.instructions_webview_mode = $('input[name="instructions_webview_mode"]:checked').val();
        data.action = 'save_activation_instructions';
        $.ajax( {
            type :"POST",
            url : "ll-activations-process.php",
            data :data,
            cache :false,
            success : function(response) {
                if (response.success != 1) {
                    show_error_message(response.message);
                } else {
                    show_success_message(response.message);
                    ll_popup_manager.close('#popup-activation-instructions-editor');
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

    reset_play_counter: function(ll_activation_id, _callback){

        ll_confirm_popup_manager.open('Are you sure you want to reset play counter?' , function () {
            var data = {};
            data.action = 'reset_play_counter';
            data.ll_activation_id = ll_activation_id;

            $.ajax({
                url: 'll-activations-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    ll_fade_manager.fade(false);
                    if (response.success) {
                        if (typeof _callback != 'undefined') {
                            _callback.call();
                        }
                    } else {
                        show_error_message(response.message);

                    }
                },
                error: function (response) {
                    ll_fade_manager.fade(false);
                    show_error_message("Unknown Error");
                }
            });
        });

    },

    open_prizes_notifications_popup: function (ll_prize_id, is_shared, $notifications_data, done_callback, cancel_callback){

        is_shared = typeof is_shared == 'undefined' ? 0 : is_shared;

        if (!ll_activations_manager.is_prizes_notifications_popup_loaded) {

            var _html = '';
            _html += '<div class="ll-popup" id="ll-prizes-notifications-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Notifications';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="form">';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Activate</label></div>';
            _html += '              <div class="ll-switch switch-small">';
            _html += '                  <div class="switch">';
            _html += '                      <input id="send_prize_notification" name="send_prize_notification" class="cmn-toggle cmn-toggle-round" type="checkbox">';
            _html += '                      <label for="send_prize_notification"></label>';
            _html += '                  </div>';
            _html += '                  <div class="ll-switch-lb"></div>';
            _html += '              </div>';
            _html += '          </div>';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Threshold</label></div>';
            _html += '              <input type="text" class="txt-field" id="prize_notification_threshold">';
            _html += '          </div>';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Send Alert to:</label></div>';
            _html += '          </div>';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Users</label></div>';
            _html += '              <select id="prize_notification_to_users" multiple data-placeholder="--- Select Users ---">';
            _html += '                  <option value="">--- Select Users ---</option>';
            _html += '              </select>';
            _html += '          </div>';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label label-small"><label>Teams</label></div>';
            _html += '              <select id="prize_notification_to_teams" multiple data-placeholder="--- Select Teams ---">';
            _html += '                  <option value="">--- Select Teams ---</option>';
            _html += '              </select>';
            _html += '          </div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_prizes_notifications_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_prizes_notifications_popup">Save</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);

            ll_combo_manager.make_combo('#ll-prizes-notifications-popup select');
            ll_theme_manager.checkboxRadioButtons.initiate_container('#ll-prizes-notifications-popup');

            $('.btn_cancel_prizes_notifications_popup').click(function () {
                ll_popup_manager.close('#ll-prizes-notifications-popup');
            });

            $('.btn_save_prizes_notifications_popup').click(function () {

                var data = {};
                data.send_notification = $('input[name=send_prize_notification]').is(':checked') ? 1 : 0;
                data.notification_threshold = parseInt($('#prize_notification_threshold').val());
                data.notification_to_users = ll_combo_manager.get_selected_value('#prize_notification_to_users');
                data.notification_to_teams = ll_combo_manager.get_selected_value('#prize_notification_to_teams');
                data.notification_to_users = data.notification_to_users ? data.notification_to_users : [];
                data.notification_to_teams = data.notification_to_teams ? data.notification_to_teams : [];

                if(data.send_notification){
                    if(!data.notification_threshold){
                        show_error_message('Please enter threshold');
                        return;
                    }

                    if(!Object.keys(data.notification_to_users).length && !Object.keys(data.notification_to_teams).length){
                        show_error_message('Please users or emails');
                        return;
                    }
                }

                if(typeof done_callback != 'undefined' && done_callback){
                    done_callback(data);
                    ll_popup_manager.close('#ll-prizes-notifications-popup');
                }
            });

            ll_activations_manager.is_prizes_notifications_popup_loaded = true;
        }

        ll_theme_manager.checkboxRadioButtons.check('input[name=send_prize_notification]', false);
        $('#prize_notification_threshold').val(0);
        ll_combo_manager.set_selected_value('#prize_notification_to_users', '');
        ll_combo_manager.set_selected_value('#prize_notification_to_teams', '');

        ll_activations_manager.load_prizes_notifications_data(ll_prize_id, is_shared, function (response) {

            ll_combo_manager.clear_all('#prize_notification_to_users');
            if(typeof response.ll_users != "undefined" && Object.keys(response.ll_users).length){
                fill_ll_users_dropdown ('#prize_notification_to_users', response.ll_users, '', '--- Select Users ---');
            }
            ll_combo_manager.clear_all('#prize_notification_to_teams');
            ll_combo_manager.add_option('#prize_notification_to_teams', '', '--- Select Teams ---');
            if(typeof response.ll_teams != "undefined" && Object.keys(response.ll_teams).length){
                ll_combo_manager.add_kv_options('#prize_notification_to_teams', response.ll_teams);
            }

            if(typeof $notifications_data != 'undefined' && $notifications_data && Object.keys($notifications_data).length){
                response.notification_data = $notifications_data;
            }

            if(typeof response.notification_data != "undefined" && Object.keys(response.notification_data).length){

                if(typeof response.notification_data.send_notification != 'undefined' && parseInt(response.notification_data.send_notification)){
                    ll_theme_manager.checkboxRadioButtons.check('input[name=send_prize_notification]', true);
                }
                if(typeof response.notification_data.notification_threshold != 'undefined' && parseInt(response.notification_data.notification_threshold)){
                    $('#prize_notification_threshold').val(response.notification_data.notification_threshold);
                }
                if(typeof response.notification_data.notification_to_users != 'undefined' && response.notification_data.notification_to_users && Object.keys(response.notification_data.notification_to_users).length){
                    ll_combo_manager.set_selected_value('#prize_notification_to_users', response.notification_data.notification_to_users);
                }
                if(typeof response.notification_data.notification_to_teams != 'undefined' && response.notification_data.notification_to_teams && Object.keys(response.notification_data.notification_to_teams).length){
                    ll_combo_manager.set_selected_value('#prize_notification_to_teams', response.notification_data.notification_to_teams);
                }
            }
            ll_popup_manager.open('#ll-prizes-notifications-popup');
        });
    },

    load_prizes_notifications_data: function(ll_prize_id, is_shared, _callback){

        var data = {};
        data.action = 'load_prizes_notifications_data';
        data.ll_prize_id = ll_prize_id;
        data.is_shared = is_shared;

        $.ajax({
            url: 'll-activations-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if(typeof _callback !='undefined'){
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

};