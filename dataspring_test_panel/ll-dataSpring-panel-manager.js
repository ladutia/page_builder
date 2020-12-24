var dataSpring_panel_manager = {

    is_loaded: false,
    done_callback: null,
    cancel_callback: null,
    initiated_data: null,
    is_popup_criterias_loaded: false,
    ll_cognism_criterias: null,
    ll_cognism_criteria_id: 0,
    ll_cognism_criteria_name: '',
    is_popup_criteria_loaded: false,
    is_popup_add_suspects_to_rhythm_loaded: false,
    page: 1,
    people_count: 0,
    actions_callback: null,
    country_names: null,
    states_names: {
        "AL": "Alabama",
        "AK": "Alaska",
        "AZ": "Arizona",
        "AR": "Arkansas",
        "CA": "California",
        "CO": "Colorado",
        "CT": "Connecticut",
        "DE": "Delaware",
        "FL": "Florida",
        "GA": "Georgia",
        "HI": "Hawaii",
        "ID": "Idaho",
        "IL": "Illinois",
        "IN": "Indiana",
        "IA": "Iowa",
        "KS": "Kansas",
        "KY": "Kentucky",
        "LA": "Louisiana",
        "ME": "Maine",
        "MD": "Maryland",
        "MA": "Massachusetts",
        "MI": "Michigan",
        "MN": "Minnesota",
        "MS": "Mississippi",
        "MO": "Missouri",
        "MT": "Montana",
        "NE": "Nebraska",
        "NV": "Nevada",
        "NH": "New Hampshire",
        "NJ": "New Jersey",
        "NM": "New Mexico",
        "NY": "New York",
        "NC": "North Carolina",
        "ND": "North Dakota",
        "OH": "Ohio",
        "OK": "Oklahoma",
        "OR": "Oregon",
        "PA": "Pennsylvania",
        "RI": "Rhode Island",
        "SC": "South Carolina",
        "SD": "South Dakota",
        "TN": "Tennessee",
        "TX": "Texas",
        "UT": "Utah",
        "VT": "Vermont",
        "VA": "Virginia",
        "WA": "Washington",
        "WV": "West Virginia",
        "WI": "Wisconsin",
        "WY": "Wyoming"
    },

    open: function (actions_callback) {

        if (typeof actions_callback != 'undefined' && actions_callback) {
            dataSpring_panel_manager.actions_callback = actions_callback;
        }

        if (!dataSpring_panel_manager.is_loaded) {
            dataSpring_panel_manager.draw();
            // cognism_panel_manager.load_initiated_data(function(response){
            //     cognism_panel_manager.populate_initiated_data(function () {
            //
            //     });
            // });
        }
        dataSpring_panel_manager.reset();
        dataSpring_panel_manager.showContent(0);
        var $panel = $(".cognism");
        $panel.show(1).animate(
            {
                right: 0
            },
            300
        );
        $.getJSON("js/country-names-cross-ref.json", function (json) {
            dataSpring_panel_manager.country_names = json;
        });
        $('.sales-shortcut,.intercom-lightweight-app').hide();
        $('.cognism-shortcut').hide();
    },

    draw: function () {
        var _html = '';
        _html += '<div class="cognism" data-step="0">';
        _html += '  <div class="cognism-head" >';
        _html += '      <div class="t"></div>';
        _html += '      <div class="img">';
        // _html += '          <img src="imgs/new-logo.png" style="height: 40px;" alt="Cognism" />';
        _html += '          <img src="imgs/DataSpring-Logo.gif" style="height: 50px;" alt="Cognism" />';
        _html += '      </div>';
        _html += '  </div>';
        // _html += '  <div class="cognism-head" >';
        // _html += '      <div class="t">Powered by</div>';
        // _html += '      <div class="img">';
        // _html += '          <img src="imgs/svgs/cognism-logo2" style="height: 35px;" alt="Cognism" />';
        // _html += '      </div>';
        // _html += '  </div>';
        _html += '  <div class="cognism-content scrollbar-inner cognism-content-start" data-step="0">';
        _html += '      <div class="cognism-start">';
        _html += '          <div class="t"></div>';
        _html += '          <div class="cognism-start-list-items">';
        if (DATA_SPRING_INSTALLED && (SEARCH_CONTACTS_DATA_SPRING || REVEAL_CONTACTS_DATA_SPRING)) {
            _html += '              <div class="item" item-for="organizations">';
            _html += '                  <div class="icn">';
            _html += '                      <img src="imgs/sales_automation/zoominfo-organizations.svg"/>';
            _html += '                  </div>';
            _html += '                  <div class="t">Organizations</div>';
            _html += '              </div>';
        }
        if (DATA_SPRING_INSTALLED && (SEARCH_COMPANIES_DATA_SPRING || REVEAL_COMPANIES_DATA_SPRING)) {
            _html += '              <div class="item" item-for="general-search">';
            _html += '                  <div class="icn">';
            _html += '                      <img src="imgs/prospects.svg"/>';
            _html += '                  </div>';
            _html += '                  <div class="t">Prospects</div>';
            _html += '              </div>';
        }
        _html += '          </div>';
        _html += '      </div>';
        _html += '  </div>';
        // --- wrap-cognism-general-search Panel
        _html += '  <div class="cognism-content scrollbar-inner wrap-cognism-general-search" data-step="1">';
        _html += '      <div class="cognism-general-search">';
        _html += '          <div class="general-search-fields clearfix">';
        _html += '          <div class="wrap-switchs prospect-search">';
        _html += '              <div class="ll-switch switch-small">';
        _html += '                  <div class="switch-lb">Has Email</div>';
        _html += '                  <div class="switch">';
        _html += '                      <input checked id="has-email" name="has-email" class="cmn-toggle cmn-toggle-round" type="checkbox">';
        _html += '                      <label for="has-email"></label>';
        _html += '                  </div>';
        _html += '              </div>';
        _html += '              <div class="ll-switch switch-small">';
        _html += '                  <div class="switch-lb">Has Phone</div>';
        _html += '                  <div class="switch">';
        _html += '                      <input checked id="has-phone" name="has-phone" class="cmn-toggle cmn-toggle-round" type="checkbox">';
        _html += '                      <label for="has-phone"></label>';
        _html += '                  </div>';
        _html += '             </div>';
        _html += '          </div>';
        _html += dataSpring_panel_manager.draw_fields();
        _html += dataSpring_panel_manager.draw_company_fields();
        _html += '          </div>';
        _html += '      </div>';
        _html += '  </div>';
        // --- cognism-content-suspects Panel
        _html += '  <div class="cognism-content scrollbar-inner cognism-content-suspects" data-step="2">';
        _html += '      <div class="list-suspects">';
        _html += '          <div class="suspects-total"><span class="total" style="display: none;"> 0 </span> Empty search result</div>';

        _html += '      </div>';
        _html += '  </div>';
        _html += '  <div class="cognism-bottom">';
        _html += '      <a href="javascript:void(0);" class="t-btn-gray t-btn-big btn-cancel">Cancel</a>';
        //_html += '      <a href="javascript:void(0);" class="t-btn-orange t-btn-big btn-find-suspects">Find Suspects</a>';
        _html += '		<div class="t-btn-actions-dropdown criteria-actions">';
        _html += '		    <a href="javascript:void(0)" class="t-btn-orange t-btn btn-new-table t-btn-big btn-find-suspects">';
        _html += '		        Search';
        _html += '		    </a>';
        _html += '		    <div class="t-actions-dropdown new-action-table t-actions-dropdown-orange up-dropdown ll-opened">';
        _html += '		        <a href="javascript:void(0)" class="t-btn-orange t-btn t-toggle-btn t-btn-big">';
        _html += '		            <span class="t-btn-arrow"></span>';
        _html += '		        </a>';
        // _html +='		        <div class="ll-actions-dropdown">';
        // _html +='		        <ul>';
        // _html +='		            <li><a href="javascript:void(0)" class="cognism-load-criteria">Load Saved Search</a></li>';
        // _html +='		            <li><a href="javascript:void(0)" class="cognism-save-criteria">Save Search Criteria</a></li>';
        // _html +='		        </ul>';
        // _html +='		        </div>';
        _html += '		    </div>';
        _html += '		</div>';
        _html += '      <a href="javascript:void(0);" class="t-btn-orange t-btn-big btn-add-page">Add Page</a>';
        _html += '      <a href="javascript:void(0);" class="t-btn-orange t-btn-big btn-add-all">Add All</a>';
        _html += '  </div>';
        _html += '  <div class="cognism-btns">';
        _html += '      <a href="javascript:void(0);" class="t-btn-orange btn-full-width-panel">';
        _html += '          <i class="icn icn-more">';
        _html += '             <img src="imgs/sales_automation/zoominfo-more-icn.svg"/>';
        _html += '          </i>';
        _html += '      </a>';
        _html += '      <a href="javascript:void(0);" class="t-btn-orange btn-close-panel">';
        _html += '          <i class="icn icn-close">';
        _html += '              <img src="imgs/sales_automation/zoominfo-close-icn.svg"/>';
        _html += '          </i>';
        _html += '      </a>';
        _html += '  </div>';
        _html += '</div>';

        //$('.main-page').append(_html);
        if ($('.main-page').length > 0) {
            $('.main-page').append(_html)
        } else {
            $('#mainWrapper').append(_html);
        }

        dataSpring_panel_manager.apply_actions();
        apply_ll_tooltip('.cognism');
        dataSpring_panel_manager.is_loaded = true;

    },

    apply_actions: function () {

        var $panel = $(".cognism");

        ll_combo_manager.make_combo('.cognism div.auto-create select', {
            is_auto_create_option: true,
            no_results_text: 'Press enter to add new value '
        });
        ll_combo_manager.make_ajax_combo('.cognism select[name="company_technology"]', {
            url: "dataSpring-process.php?action=search_technology"
        },{
            is_auto_create_option: true,
            no_results_text: 'Press enter to add new value'
        });
        ll_combo_manager.make_combo('.cognism div:not(.auto-create) select');
        ll_theme_manager.dropdownActions(".cognism");


        $panel.find(".scrollbar-inner").scrollbar();

        $(".cognism-start-list-items").on("click", ".item", function () {
            $(this)
                .addClass("selected")
                .siblings(".item")
                .removeClass("selected");
            dataSpring_panel_manager.clear_fields();
            var item_for = $(this).attr('item-for');
            switch (item_for) {
                case 'organizations':
                    dataSpring_panel_manager.showContent(1);
                    break;
                case 'general-search':
                    dataSpring_panel_manager.showContent(1);
                    break;
            }
        });

        /* $(".suspects-show-more").on("click", function() {
             for (i = 0; i < 5; i++) {
                 cognism_panel_manager.showMoreSuspects();
             }
         });
 */
        $(".cognism .list-suspects").on("click", ".suspects-item .btn-add", function (e) {
            e.preventDefault();
            var PersonID = $(this).closest('.suspects-item').attr('PersonID');
            if (typeof PersonID != 'undefined' && PersonID) {
                ll_fade_manager.fade(true, 'Processing...');
                dataSpring_panel_manager.purchase([PersonID], 0, function (response) {
                    dataSpring_panel_manager.purchase_callback(response, function () {
                        show_success_message('Added successfully');
                        ll_fade_manager.fade(false);
                    });
                });
            } else {
                show_error_message('Invalid suspect');
            }
        });

        $(".cognism .list-suspects").on("click", ".suspects-item .btn-update", function (e) {
            e.preventDefault();
            var PersonID = $(this).closest('.suspects-item').attr('PersonID');
            if (typeof PersonID != 'undefined' && PersonID) {
                ll_fade_manager.fade(true, 'Processing...');
                dataSpring_panel_manager.purchase([PersonID], 1, function (response) {
                    dataSpring_panel_manager.purchase_callback(response, function () {
                        show_success_message('Success');
                        ll_fade_manager.fade(false);
                    });
                });
            } else {
                show_error_message('Invalid suspect');
            }
        });

        $(".cognism .list-suspects").on("click", ".suspects-item .icn-apply-action", function (e) {
            e.preventDefault();
            var $this = $(this);
            var PersonID = $(this).closest('.suspects-item').attr('PersonID');
            if (typeof PersonID != 'undefined' && PersonID) {
                ll_fade_manager.fade(true, 'Processing...');
                dataSpring_panel_manager.apply_callback_actions(PersonID, function (response) {
                    show_success_message('Success');
                    ll_fade_manager.fade(false);
                    $this.remove();
                });
            } else {
                show_error_message('Invalid suspect');
            }
        });

        $(".cognism .btn-full-width-panel").on("click", function () {
            $panel.toggleClass("full-width");
        });

        $(".cognism .btn-close-panel").on("click", function () {
            $panel.removeClass("full-width");
            $panel.hide().css("right", "-380px");
            $('.sales-shortcut,.intercom-lightweight-app').show();
            $('.cognism-shortcut').show();
        });

        /*$(".show-cognism-panel").on("click", function(e) {
            e.preventDefault();
            $panel.show(1).animate(
                {
                    right: 0
                },
                300
            );
        });*/

        $(".cognism .btn-find-suspects").on("click", function (e) {
            e.preventDefault();
            var $panel = $(".cognism");
            ll_fade_manager.fade(true, 'Searching.....');
            dataSpring_panel_manager.page = 1;
            dataSpring_panel_manager.people_count = 0;
            $panel.find('.list-suspects .suspects-item,.list-suspects .suspects-show-more').remove();
            var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
            var items_name = 'suspects';
            if (item_for == 'organizations') {
                items_name = 'company';
            }
            dataSpring_panel_manager.search_by_criteria(function (response) {
                var step = parseInt($panel.attr("data-step"));
                var newStep = step + 1;
                if (step < 2) {
                    dataSpring_panel_manager.showContent(newStep);
                }
                var totalResults = 0;
                if (typeof response.totalResults != 'undefined' && response.totalResults) {
                    totalResults = response.totalResults;
                }
                // $panel.find('.list-suspects .suspects-total').html('Showing '+ showing +' of <span class="total">'+totalResults+'</span> ' + items_name + ' found');
                if (typeof response.people != 'undefined' && response.people && Object.keys(response.people).length) {
                    dataSpring_panel_manager.people_count = Object.keys(response.people).length;
                    $panel.find('.list-suspects .suspects-total').html('Showing <span style="font-weight: bold">' + dataSpring_panel_manager.people_count + '</span> of <span class="total">' + totalResults + '</span> ' + items_name + ' found');
                    $('.cognism-bottom .btn-add-all').text('Add all (' + totalResults + ')');
                    $('.cognism-bottom .btn-add-page').text('Add (' + dataSpring_panel_manager.people_count + ')');
                    for (var i in response.people) {
                        var person = response.people[i];
                        var _html = dataSpring_panel_manager.draw_suspect(person, true);
                        $('.cognism .list-suspects').append(_html);
                        dataSpring_panel_manager.handle_icons($('.cognism .list-suspects .suspects-item:last'));
                        apply_ll_tooltip($('.cognism .list-suspects'));
                    }
                } else {
                    $panel.find('.list-suspects .suspects-total').html('<span class="total" style="display: none;"> 0 </span> Empty search result');
                    $('.cognism-bottom .btn-add-all').hide();
                    $('.cognism-bottom .btn-add-page').hide();
                }
                ll_fade_manager.fade(false);
                // Show More
                if (totalResults > dataSpring_panel_manager.people_count) {
                    $('.cognism .list-suspects').append('<div class="suspects-show-more" onclick="dataSpring_panel_manager.showMoreSuspects();">Show More</div>');
                }
            });
        });

        $(".cognism-load-criteria").on("click", function (e) {
            e.preventDefault();
            dataSpring_panel_manager.open_criterias_popup(function (ll_cognism_criteria) {
                if (typeof ll_cognism_criteria != 'undefined' && ll_cognism_criteria) {
                    dataSpring_panel_manager.ll_cognism_criteria_id = ll_cognism_criteria.ll_cognism_criteria_id;
                    dataSpring_panel_manager.ll_cognism_criteria_name = ll_cognism_criteria.ll_cognism_criteria_name;
                    if (typeof ll_cognism_criteria.fields_array != 'undefined' && ll_cognism_criteria.fields_array) {
                        dataSpring_panel_manager.populate_fields(ll_cognism_criteria.fields_array);
                    }
                }
            });
        });

        $(".cognism-save-criteria").on("click", function (e) {
            e.preventDefault();
            if (dataSpring_panel_manager.ll_cognism_criteria_id) {
                dataSpring_panel_manager.save_criteria(function () {

                });
            } else {
                dataSpring_panel_manager.open_criteria_popup(function () {

                });
            }
        });

        $panel.find(".cognism-bottom .btn-cancel").on("click", function (e) {
            e.preventDefault();
            var step = parseInt($panel.attr("data-step"));
            var newStep = step - 1;
            if (step > 0) {
                dataSpring_panel_manager.showContent(newStep);
            }
        });

        $panel.find(".cognism-bottom .btn-add-page").on("click", function (e) {
            e.preventDefault();
            dataSpring_panel_manager.purchase_per_page(function (response) {

            });

        });

        $panel.find(".cognism-bottom .btn-add-all").on("click", function (e) {
            e.preventDefault();
            $(this).attr('disabled', 'disabled');
            dataSpring_panel_manager.purchase_all(function (response) {
                show_success_message("We’re processing your request. All results will be added.");
                $('.cognism-bottom .btn-add-all').css('display', 'none');
                $(this).removeAttr('disabled');
            });
        });

        $('.cognism .show-hide-options').on('click', function (e) {
            e.preventDefault();
            var link = $(this);
            var text = link.text();
            var options = $('.cognism .advanced-search');

            if (text == 'Show advanced filters') {
                link.text('Hide advanced filters');
                options.show();
            } else {
                link.text('Show advanced filters');
                options.hide();
            }
            ll_popup_manager.center('#handwriten-letter-popup');
        });

        $('.cognism .show-hide-company-options').on('click', function (e) {
            e.preventDefault();
            var link = $(this);
            var text = link.text();
            var options = $('.cognism .company-advanced-search');

            if (text == 'Show advanced filters') {
                link.text('Hide advanced filters');
                options.show();
            } else {
                link.text('Show advanced filters');
                options.hide();
            }
            ll_popup_manager.center('#handwriten-letter-popup');
        });

        $('.cognism .clear-field').on('click', function (e) {
            var input = $(this).closest('.t-field').find('input');
            input.val('');
            var select = $(this).closest('.t-field').find('select');
            ll_combo_manager.set_selected_value(select, '');
        });
        $('.cognism .upload-values').on('click', function (e) {
            dataSpring_panel_manager.open_upload_values_popup($(this));
        });

    },

    // add_fade_html: function(){
    //     this.is_added_fade_html = true;
    //
    //     //$('#fade').remove();
    //     var _fade_html = '';
    //     _fade_html += '<div id="fade"></div>';
    //     _fade_html += '<div id="loadingBox">';
    //     _fade_html += '	<img src="imgs/ajax-loader2.gif" />';
    //     _fade_html += '	<div>Loading...</div>';
    //     _fade_html += '</div>';
    //
    //     $('body').append(_fade_html);
    // },

    showContent: function (step) {

        var $panel = $(".cognism");
        $panel.find(".cognism-content").hide();
        $(".cognism-bottom").removeClass("last-step");
        $panel.attr("data-step", step);
        switch (step) {
            case 0:
                $(".cognism-content-start").show();
                dataSpring_panel_manager.reset();
                break;
            case 1:
                //cognism_panel_manager.clear_fields();
                $panel.find('.wrap-switchs').show();
                $panel.find('.general-search-fields .col div.t-field').show();
                var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
                switch (item_for) {
                    case 'organizations':
                        $panel.find('.general-search-fields .prospect-search').hide();
                        $panel.find('.general-search-fields .company-search').show();
                        break;
                    case 'general-search':
                        $panel.find('.general-search-fields div.prospect-search').show();
                        $panel.find('.general-search-fields div.company-search').hide();
                        break;
                }
                $(".wrap-cognism-general-search").show();
                break;
            case 2:
                $(".cognism-content-suspects").show();
                $(".cognism-bottom").addClass("last-step");
                break;
        }
        dataSpring_panel_manager.showBtns(step);
    },

    showBtns: function (step) {
        var $panel = $(".cognism");
        $panel.find(".cognism-bottom .btn-cancel,.cognism-bottom .btn-add-page,.cognism-bottom .btn-add-all,.cognism-bottom .criteria-actions, .cognism-bottom, .advanced-search, .company-advanced-search").css('display', 'none');
        $panel.find('.cognism-head').show();
        $panel.css('padding-top', '100px');
        $('.sales-shortcut,.intercom-lightweight-app').hide();
        $(".cognism-bottom").removeClass("last-step");
        $('.cognism .show-hide-company-options').text('Show advanced filters');
        $('.cognism .show-hide-options').text('Show advanced filters');

        switch (step) {
            case 0:
                break;
            case 1:
                $(".cognism-bottom .btn-cancel,.cognism-bottom .criteria-actions, .cognism-bottom").show();
                break;
            case 2:
                $panel.css('padding-top', '0px');
                $panel.find('.cognism-head').hide();
                $(".cognism-bottom .btn-cancel,.cognism-bottom ,.cognism-bottom, .cognism-bottom").css('display', 'inline-block');
                $(".cognism-bottom").addClass("last-step");
                var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
                switch (item_for) {
                    case 'organizations':
                        if (REVEAL_COMPANIES_DATA_SPRING) {
                            $panel.find('.btn-add-page').show();
                            $panel.find('.btn-add-all').show();
                        }
                        break;
                    case 'general-search':
                        if (REVEAL_CONTACTS_DATA_SPRING) {
                            $panel.find('.btn-add-page').show();
                            $panel.find('.btn-add-all').show();
                        }
                        break;
                }
                break;
        }
    },

    showMoreSuspects: function () {

        dataSpring_panel_manager.page = dataSpring_panel_manager.page + 1;
        var $panel = $(".cognism");
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
        var items_name = 'suspects';
        if (item_for == 'organizations') {
            items_name = 'company';
        }
        $panel.find('.list-suspects .suspects-show-more').replaceWith('<div class="suspects-show-more-loading"><img src="imgs/ajax-loader2.gif"/></div>');
        dataSpring_panel_manager.search_by_criteria(function (response) {
            $panel.find('.list-suspects .suspects-show-more-loading').remove();
            var totalResults = 0;
            if (typeof response.totalResults != 'undefined' && response.totalResults) {
                totalResults = response.totalResults;
            }
            // $panel.find('.list-suspects .suspects-total').html('Showing '+ showing +' of <span class="total">'+totalResults+'</span> ' + items_name + ' Found');
            if (typeof response.people != 'undefined' && response.people && Object.keys(response.people).length) {
                dataSpring_panel_manager.people_count = dataSpring_panel_manager.people_count + Object.keys(response.people).length;
                $panel.find('.list-suspects .suspects-total').html('Showing  <span style="font-weight: bold">' + dataSpring_panel_manager.people_count + '</span> of <span class="total">' + totalResults + '</span> ' + items_name + ' Found');
                $('.cognism-bottom .btn-add-all').text('Add all (' + totalResults + ')');
                $('.cognism-bottom .btn-add-page').text('Add (' + dataSpring_panel_manager.people_count + ')');
                for (var i in response.people) {
                    var person = response.people[i];
                    var _html = dataSpring_panel_manager.draw_suspect(person, true);
                    $('.cognism .list-suspects').append(_html);
                    dataSpring_panel_manager.handle_icons($('.cognism .list-suspects .suspects-item:last'));
                    apply_ll_tooltip($('.cognism .list-suspects'));
                }
            } else {
                $panel.find('.list-suspects .suspects-total').html('<span class="total" style="display: none;"> 0 </span> Empty search result');
                $('.cognism-bottom .btn-add-all').hide();
                $('.cognism-bottom .btn-add-page').hide();
            }
            // Show More
            if (totalResults > dataSpring_panel_manager.people_count) {
                $('.cognism .list-suspects').append('<div class="suspects-show-more" onclick="dataSpring_panel_manager.showMoreSuspects();">Show More</div>');
            } else {
                $('.cognism .list-suspects .suspects-show-more').remove();
            }
        });
    },

    draw_fields: function () {

        var _html = '';
        _html += '<div class="col prospect-search">';

        _html += '  <div class="t-field auto-create" criteria="states">';
        _html += '      <label>State';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. Texas" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '<a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '<a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_states_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create" criteria="countries">';
        _html += '      <label>Country';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. United States" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_countries_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create" criteria="jobTitles">';
        _html += '      <label>Job Title';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '      </label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field" criteria="departments">';
        _html += '      <label>Department';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. Marketing" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>Administration<\option>';
        _html += '          <option>Customer<\option>';
        _html += '          <option>Finance<\option>';
        _html += '          <option>HR<\option>';
        _html += '          <option>IT<\option>';
        _html += '          <option>Legal<\option>';
        _html += '          <option>Marketing<\option>';
        _html += '          <option>Operations<\option>';
        _html += '          <option>R&D<\option>';
        _html += '          <option>Sales<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field" criteria="roles">';
        _html += '      <label>Role';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. VP, Manager" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>CxO<\option>';
        _html += '          <option>Director<\option>';
        _html += '          <option>Manager<\option>';
        _html += '          <option>Owner<\option>';
        _html += '          <option>Partner<\option>';
        _html += '          <option>VP<\option>';
        _html += '      </select>';
        _html += '  </div>';
        // _html += '  <div class="t-field" criteria="salaryFrom">';
        // _html += '      <label>Salary From</label>';
        // _html += '      <input type="number" class="txt-field" placeholder="Enter Salary From" />';
        // _html += '  </div>';
        // _html += '  <div class="t-field" criteria="salaryTo">';
        // _html += '      <label>Salary To</label>';
        // _html += '      <input type="number" class="txt-field" placeholder="Enter Salary To" />';
        // _html += '  </div>';
        _html += '  <div class="t-field auto-create" criteria="companyNames">';
        _html += '      <label>Company Name';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '      </label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create" criteria="companyExcludeNames">';
        _html += '      <label>Company Exclude Names';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '      </label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create" criteria="companyDomains">';
        _html += '      <label>Company Domain';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. microsoft.com, www.microsoft.com" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create" criteria="companyIndustries">';
        _html += '      <label>Company Industry';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. Marketing and Advertising, Business Services, Computer Software" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_industries_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field" criteria="companySize">';
        _html += '      <label>Company Size (Employee Range)';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Helps identify companies of a specific size." ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option value="A">1<\option>';
        _html += '          <option value="B">1 to 10<\option>';
        _html += '          <option value="C">11 to 50<\option>';
        _html += '          <option value="D">51 to 200<\option>';
        _html += '          <option value="E">201 to 500<\option>';
        _html += '          <option value="F">501 to 1000<\option>';
        _html += '          <option value="G">1001 to 5000<\option>';
        _html += '          <option value="H">5001 to 10000<\option>';
        _html += '          <option value="I">10001+<\option>';
        _html += '      </select>';
        _html += '  </div>';

        _html += '  <div class="t-field advanced-search" criteria="firstName">';
        _html += '      <label>First Name';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="text" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="lastName">';
        _html += '      <label>Last Name';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="text" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="fullName">';
        _html += '      <label>Full Name';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="text" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="alias">';
        _html += '      <label>Alias';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="text" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="email">';
        _html += '      <label>Email Address';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="text" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="emailScore">';
        _html += '      <label>Email Quality';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Email quality is our confidence in the accuracy of the information. For example, an email with \'High\' confidence will most likely be accurate. An email with \'Low\' confidence may be inaccurate due to its age and other factors." ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>High<\option>';
        _html += '          <option>Medium<\option>';
        _html += '          <option>Low<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="phoneScore">';
        _html += '      <label>Phone Quality';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Phone quality is our confidence in the accuracy of the information. For example, a phone with \'High\' confidence will most likely be accurate. A phone with \'Low\' confidence may be inaccurate due to its age and other factors." ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>High<\option>';
        _html += '          <option>Medium<\option>';
        _html += '          <option>Low<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create advanced-search" criteria="cities">';
        _html += '      <label>City';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="regions">';
        _html += '      <label>Region';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. EMEA" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>EMEA<\option>';
        _html += '          <option>AMERICAS<\option>';
        _html += '          <option>APAC<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create advanced-search" criteria="excludeJobTitles">';
        _html += '      <label>Exclude Job Titles';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="seniority">';
        _html += '      <label>Seniority';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Artificial Intelligence (AI) driven seniority insights" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>Entry-Level<\option>';
        _html += '          <option>Executive Level<\option>';
        _html += '          <option>Experienced Staff<\option>';
        _html += '          <option>Middle-Management<\option>';
        _html += '          <option>Team-Lead<\option>';
        _html += '          <option>Top-Tier Leadership<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create advanced-search" criteria="skills">';
        _html += '      <label>Skills';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. Analytics" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option>Algorithms<\option>';
        _html += '          <option>Analytics<\option>';
        _html += '          <option>Android<\option>';
        _html += '          <option>Applications<\option>';
        _html += '          <option>Blogging<\option>';
        _html += '          <option>Business<\option>';
        _html += '          <option>Business Analysis<\option>';
        _html += '          <option>Business Intelligence<\option>';
        _html += '          <option>Business Storytelling<\option>';
        _html += '          <option>Cloud Computing<\option>';
        _html += '          <option>Coaching<\option>';
        _html += '          <option>Communication<\option>';
        _html += '          <option>Computer<\option>';
        _html += '          <option>Consulting<\option>';
        _html += '          <option>Content<\option>';
        _html += '          <option>Content Management<\option>';
        _html += '          <option>Content Marketing<\option>';
        _html += '          <option>Content Strategy<\option>';
        _html += '          <option>Data Analysis<\option>';
        _html += '          <option>Data Analytics<\option>';
        _html += '          <option>Data Engineering<\option>';
        _html += '          <option>Data Mining<\option>';
        _html += '          <option>Data Science<\option>';
        _html += '          <option>Data Warehousing<\option>';
        _html += '          <option>Database Administration<\option>';
        _html += '          <option>Database Management<\option>';
        _html += '          <option>Digital Marketing<\option>';
        _html += '          <option>Digital Media<\option>';
        _html += '          <option>Economics<\option>';
        _html += '          <option>Editing<\option>';
        _html += '          <option>Event Planning<\option>';
        _html += '          <option>Executive<\option>';
        _html += '          <option>Game Development<\option>';
        _html += '          <option>Hadoop<\option>';
        _html += '          <option>Health Care<\option>';
        _html += '          <option>Hiring<\option>';
        _html += '          <option>Hospitality<\option>';
        _html += '          <option>Human Resources<\option>';
        _html += '          <option>Information Management<\option>';
        _html += '          <option>Information Security<\option>';
        _html += '          <option>Information Technology<\option>';
        _html += '          <option>Java<\option>';
        _html += '          <option>Job Specific Skills<\option>';
        _html += '          <option>Leadership<\option>';
        _html += '          <option>Legal<\option>';
        _html += '          <option>Mac<\option>';
        _html += '          <option>Management<\option>';
        _html += '          <option>Market Research<\option>';
        _html += '          <option>Marketing<\option>';
        _html += '          <option>Media Planning<\option>';
        _html += '          <option>Microsoft Office Skills<\option>';
        _html += '          <option>Mobile Apps<\option>';
        _html += '          <option>Mobile Development<\option>';
        _html += '          <option>Negotiation<\option>';
        _html += '          <option>Network and Information Security<\option>';
        _html += '          <option>Newsletters<\option>';
        _html += '          <option>Online Marketing<\option>';
        _html += '          <option>Presentation<\option>';
        _html += '          <option>Project Management<\option>';
        _html += '          <option>Public Relations<\option>';
        _html += '          <option>Recruiting<\option>';
        _html += '          <option>Relationship Management<\option>';
        _html += '          <option>Research<\option>';
        _html += '          <option>Risk Management<\option>';
        _html += '          <option>Search Engine Optimization (SEO)<\option>';
        _html += '          <option>Social Media<\option>';
        _html += '          <option>Social Media Management<\option>';
        _html += '          <option>Social Networking<\option>';
        _html += '          <option>Software<\option>';
        _html += '          <option>Software Engineering<\option>';
        _html += '          <option>Software Management<\option>';
        _html += '          <option>Strategic Planning<\option>';
        _html += '          <option>Strategy<\option>';
        _html += '          <option>Tech Skills Listed by Job<\option>';
        _html += '          <option>Tech Support<\option>';
        _html += '          <option>Technical<\option>';
        _html += '          <option>Training<\option>';
        _html += '          <option>UI / UX<\option>';
        _html += '          <option>User Testing<\option>';
        _html += '          <option>Web Content<\option>';
        _html += '          <option>Web Development<\option>';
        _html += '          <option>Web Programming<\option>';
        _html += '          <option>WordPress<\option>';
        _html += '          <option>Writing<\option>';
        _html += '          <option>iPhone<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="ageFrom">';
        _html += '      <label>Age (From)';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="ageTo">';
        _html += '      <label>Age (To)';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create advanced-search" criteria="companySites">';
        _html += '      <label>Company Website';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create advanced-search" criteria="companyExcludeDomains">';
        _html += '      <label>Exclude Company Domains';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. microsoft.com, www.microsoft.com" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="companyRevenueFrom">';
        _html += '      <label>Revenue (Minimum)';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. 100,000" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field advanced-search" criteria="companyRevenueTo">';
        _html += '      <label>Revenue (Maximum)';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. 100,000,000" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create advanced-search" criteria="companyTechnologies">';
        _html += '      <label>Company Technologies';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Technologies used in company. e.g. JIRA, Ubuntu, Oracle, WordPress" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" " name="company_technology">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '<a href="javascript:void(0);" class="show-hide-options">Show advanced filters</a>';
        _html += '</div>';

        return _html;
    },

    draw_company_fields: function () {

        var _html = '';
        _html += '<div class="col company-search">';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchNames">';
        _html += '      <label>Name';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchExcludeNames">';
        _html += '      <label>Exclude Names';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchDomains">';
        _html += '      <label>Domains';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. microsoft.com, www.microsoft.com" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create company-field" criteria="companySearchIndustries">';
        _html += '      <label>Industries';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. Marketing and Advertising, Business Services" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_industries_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create company-field" criteria="companySearchCities">';
        _html += '      <label>City';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchStates">';
        _html += '      <label>State';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. Texas" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_states_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchCountries">';
        _html += '      <label>Country';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. United States" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_countries_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field" criteria="companySearchRevenueFrom">';
        _html += '      <label>Revenue (Minimum)';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. 100,000" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field" criteria="companySearchRevenueTo">';
        _html += '      <label>Revenue (Maximum)';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. 100,000,000" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field company-field" criteria="companySearchSize">';
        _html += '      <label>Size (Employee Range)';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Helps identify companies of a specific size." ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '          <option value="A">1<\option>';
        _html += '          <option value="B">1 to 10<\option>';
        _html += '          <option value="C">11 to 50<\option>';
        _html += '          <option value="D">51 to 200<\option>';
        _html += '          <option value="E">201 to 500<\option>';
        _html += '          <option value="F">501 to 1000<\option>';
        _html += '          <option value="G">1001 to 5000<\option>';
        _html += '          <option value="H">5001 to 10000<\option>';
        _html += '          <option value="I">10001+<\option>';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchSIC">';
        _html += '      <label>SIC Code';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Standard Industrial Classification Code" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field" criteria="companySearchNAICS">';
        _html += '      <label>NAICS Code';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field company-advanced-search" criteria="companySearchSites">';
        _html += '      <label>Websites';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create company-field company-advanced-search" criteria="companySearchTechnologies">';
        _html += '      <label>Technologies';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="Technologies used in company. e.g. JIRA, Ubuntu, Oracle, WordPress" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" " name="company_technology">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-advanced-search" criteria="companySearchExcludeDomains">';
        _html += '      <label>Exclude Domains';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="e.g. microsoft.com, www.microsoft.com" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field  auto-create company-field company-advanced-search" criteria="companySearchExcludeIndustries">';
        _html += '      <label>Exclude Industries';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += dataSpring_panel_manager.get_industries_options();
        _html += '      </select>';
        _html += '  </div>';
        _html += '  <div class="t-field company-field company-advanced-search" criteria="companySearchSizeFrom">';
        _html += '      <label>Number of Employees (Minimum)';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field company-field company-advanced-search" criteria="companySearchSizeTo">';
        _html += '      <label>Number of Employees (Maximum)';
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '</label>';
        _html += '      <input type="number" class="txt-field" placeholder=" " />';
        _html += '  </div>';
        _html += '  <div class="t-field auto-create company-field company-advanced-search" criteria="companySearchISIC">';
        _html += '      <label>ISIC Code';
        _html += '          <img src="imgs/vvp/svgs/icn-info.svg" title="International Standard Industrial Classification" ' +
            'class="info_icon ll_std_tooltip ll_std_click_tooltip"/>'
        _html += '          <a href="javascript:void(0);" class="clear-field ll-link">Clear</a>';
        _html += '          <a href="javascript:void(0);" class="upload-values ll-link">Upload</a>';
        _html += '</label>';
        _html += '      <select multiple data-placeholder=" ">';
        _html += '      </select>';
        _html += '  </div>';
        _html += '<a href="javascript:void(0);" class="show-hide-company-options">Show advanced filters</a>';
        _html += '</div>';

        return _html;

    },

    get_technologies_options: function () {
        var _html = '';
        return _html;
    },

    get_industries_options: function () {
        var _html = '';
        _html += '      <option value="Accounting and Accounting Services">Accounting and Accounting Services</option>';
        _html += '      <option value="Advertising and Marketing">Advertising and Marketing</option>';
        _html += '      <option value="Aerospace and Defense">Aerospace and Defense</option>';
        _html += '      <option value="Aggregates, Concrete and Cement">Aggregates, Concrete and Cement</option>';
        _html += '      <option value="Agriculture">Agriculture</option>';
        _html += '      <option value="Agriculture General">Agriculture General</option>';
        _html += '      <option value="Airlines, Airports and Air Services">Airlines, Airports and Air Services</option>';
        _html += '      <option value="Amusement Parks, Arcades and Attractions">Amusement Parks, Arcades and Attractions</option>';
        _html += '      <option value="Animals and Livestock">Animals and Livestock</option>';
        _html += '      <option value="Apparel and Accessories Retail">Apparel and Accessories Retail</option>';
        _html += '      <option value="Appliances">Appliances</option>';
        _html += '      <option value="Architecture, Engineering and Design">Architecture, Engineering and Design</option>';
        _html += '      <option value="Auctions">Auctions</option>';
        _html += '      <option value="Automobile Parts Stores">Automobile Parts Stores</option>';
        _html += '      <option value="Automotive Service and Collision Repair">Automotive Service and Collision Repair</option>';
        _html += '      <option value="Banking">Banking</option>';
        _html += '      <option value="Batteries, Power Storage Equipment and Generators">Batteries, Power Storage Equipment and Generators</option>';
        _html += '      <option value="Biotechnology">Biotechnology</option>';
        _html += '      <option value="Boats and Submarines">Boats and Submarines</option>';
        _html += '      <option value="Broadcasting">Broadcasting</option>';
        _html += '      <option value="Brokerage">Brokerage</option>';
        _html += '      <option value="Building Materials">Building Materials</option>';
        _html += '      <option value="Business Intelligence (BI) Software">Business Intelligence (BI) Software</option>';
        _html += '      <option value="Business Services">Business Services</option>';
        _html += '      <option value="983562">Business Services General</option>';
        _html += '      <option>Cable and Satellite</option>';
        _html += '      <option>Call Centers and Business Centers</option>';
        _html += '      <option>Car and Truck Rental</option>';
        _html += '      <option>Chambers of Commerce</option>';
        _html += '      <option>Charitable Organizations and Foundations</option>';
        _html += '      <option>Chemicals</option>';
        _html += '      <option>Chemicals, Petrochemicals, Glass and Gases</option>';
        _html += '      <option>Cities, Towns and Municipalities</option>';
        _html += '      <option>Cities, Towns and Municipalities General</option>';
        _html += '      <option>Cleaning Products</option>';
        _html += '      <option>Colleges and Universities</option>';
        _html += '      <option>Commercial and Residential Construction</option>';
        _html += '      <option>Commercial Printing</option>';
        _html += '      <option>Computer Equipment and Peripherals</option>';
        _html += '      <option>Computer Networking Equipment</option>';
        _html += '      <option> Computer Storage Equipment</option>';
        _html += '      <option>Construction</option>';
        _html += '      <option>Construction General</option>';
        _html += '      <option>Consumer Electronics</option>';
        _html += '      <option>Consumer Electronics and Computers Retail</option>';
        _html += '      <option>Consumer Goods</option>';
        _html += '      <option>Consumer Services</option>';
        _html += '      <option>Consumer Services General</option>';
        _html += '      <option>Content and Collaboration Software</option>';
        _html += '      <option>Cosmetics, Beauty Supply and Personal Care Products</option>';
        _html += '      <option>Credit Cards and Transaction Processing</option>';
        _html += '      <option>Crops</option>';
        _html += '      <option>Cultural</option>';
        _html += '      <option>Cultural General</option>';
        _html += '      <option>Customer Relationship Management (CRM) Software</option>';
        _html += '      <option>Database and File Management Software</option>';
        _html += '      <option>Debt Collection</option>';
        _html += '      <option>Department Stores, Shopping Centers and Superstores</option>';
        _html += '      <option>Drug Manufacturing and Research</option>';
        _html += '      <option>Drug Stores and Pharmacies</option>';
        _html += '      <option>Education</option>';
        _html += '      <option>Education General</option>';
        _html += '      <option>Electricity, Oil and Gas</option>';
        _html += '      <option>Electronic Components</option>';
        _html += '      <option>Electronics</option>';
        _html += '      <option>Emergency Medical Transportation and Services</option>';
        _html += '      <option>Energy, Utilities and Waste Treatment</option>';
        _html += '      <option>Energy, Utilities, and Waste Treatment General</option>';
        _html += '      <option>Engineering Software</option>';
        _html += '      <option>Enterprise Resource Planning (ERP) Software</option>';
        _html += '      <option>Facilities Management and Commercial Cleaning</option>';
        _html += '      <option>Film/Video Production and Services</option>';
        _html += '      <option>Finance</option>';
        _html += '      <option>Finance General</option>';
        _html += '      <option>Financial, Legal and HR Software</option>';
        _html += '      <option>Fitness and Dance Facilities</option>';
        _html += '      <option>Flowers, Gifts and Specialty Stores</option>';
        _html += '      <option>Food and Beverages</option>';
        _html += '      <option>Food Service</option>';
        _html += '      <option>Food, Beverages and Tobacco</option>';
        _html += '      <option>Freight and Logistics Services</option>';
        _html += '      <option>Funeral Homes and Funeral Related Services</option>';
        _html += '      <option>Furniture</option>';
        _html += '      <option>Furniture</option>';
        _html += '      <option>Gambling and Gaming</option>';
        _html += '      <option>Gas Stations, Convenience and Liquor Stores</option>';
        _html += '      <option>Gases</option>';
        _html += '      <option>Glass and Clay</option>';
        _html += '      <option">Government</option>';
        _html += '      <option>Grocery Retail</option>';
        _html += '      <option>Hair Salons</option>';
        _html += '      <option>Hand, Power and Lawn-care Tools</option>';
        _html += '      <option>Health and Nutrition Products</option>';
        _html += '      <option>Healthcare</option>';
        _html += '      <option>Healthcare General</option>';
        _html += '      <option">Healthcare Software</option>';
        _html += '      <option>Home Improvement and Hardware Retail</option>';
        _html += '      <option>Hospitality</option>';
        _html += '      <option">Hospitality General</option>';
        _html += '      <option">Hospitals and Clinics</option>';
        _html += '      <option">Household Goods</option>';
        _html += '      <option">Human Resources and Staffing</option>';
        _html += '      <option">Industrial Machinery and Equipment</option>';
        _html += '      <option">Information and Document Management</option>';
        _html += '      <option>Information Collection and Delivery</option>';
        _html += '      <option">Insurance</option>';
        _html += '      <option>Internet Service Providers, Website Hosting and Internet-related Services</option>';
        _html += '      <option>Investment Banking</option>';
        _html += '      <option>Jewelry and Watch Retail</option>';
        _html += '      <option>Jewelry and Watches</option>';
        _html += '      <option>K-12 Schools</option>';
        _html += '      <option>Laundry and Dry Cleaning Services</option>';
        _html += '      <option>Law Firms and Legal Services</option>';
        _html += '      <option>Libraries</option>';
        _html += '      <option>Lodging and Resorts</option>';
        _html += '      <option>Lumber, Wood Production and Timber Operations</option>';
        _html += '      <option>Management Consulting</option>';
        _html += '      <option>Manufacturing</option>';
        _html += '      <option>Manufacturing General</option>';
        _html += '      <option>Marine Shipping and Transportation</option>';
        _html += '      <option>Media and Internet</option>';
        _html += '      <option>Media and Internet General</option>';
        _html += '      <option>Medical Devices and  Equipment</option>';
        _html += '      <option>Medical Testing and Clinical Laboratories</option>';
        _html += '      <option>Membership Organizations</option>';
        _html += '      <option>Metals and Minerals</option>';
        _html += '      <option>Metals and Mining</option>';
        _html += '      <option>Metals and Mining General</option>';
        _html += '      <option>Mining</option>';
        _html += '      <option>Miscellaneous Building Materials (Flooring, Cabinets, etc.)</option>';
        _html += '      <option>Motor Vehicle Dealers</option>';
        _html += '      <option>Motor Vehicle Parts</option>';
        _html += '      <option>Motor Vehicles</option>';
        _html += '      <option>Movie Theaters</option>';
        _html += '      <option>Multimedia and Graphic Design</option>';
        _html += '      <option>Multimedia, Games and Graphics Software</option>';
        _html += '      <option>Museums and Art Galleries</option>';
        _html += '      <option>Music and Music Related Services</option>';
        _html += '      <option>Network Security Hardware and Software</option>';
        _html += '      <option>Networking Software</option>';
        _html += '      <option>Newspapers and News Services</option>';
        _html += '      <option>Office Products Retail and Distribution</option>';
        _html += '      <option>Oil and Gas Exploration and Services</option>';
        _html += '      <option>Organizations</option>';
        _html += '      <option> Organizations General</option>';
        _html += '      <option>Other Rental Stores (Furniture, A/V, Construction and Industrial Equipment)';
        _html += '      </option>';
        _html += '      <option>Personal Computers and Peripherals</option>';
        _html += '      <option>Pet Products</option>';
        _html += '      <option>Pet Products</option>';
        _html += '      <option>Petrochemicals</option>';
        _html += '      <option>Pharmaceuticals</option>';
        _html += '      <option>Photographic and Optical Equipment</option>';
        _html += '      <option>Photography Studio</option>';
        _html += '      <option>Plastic, Packaging and Containers</option>';
        _html += '      <option>Plumbing and HVAC Equipment</option>';
        _html += '      <option>Power Conversion and Protection Equipment</option>';
        _html += '      <option>Public Safety</option>';
        _html += '      <option">Publishing</option>';
        _html += '      <option>Pulp and Paper</option>';
        _html += '      <option>Radio Stations</option>';
        _html += '      <option>Rail, Bus and Taxi</option>';
        _html += '      <option>Real Estate</option>';
        _html += '      <option>Record, Video and Book Stores</option>';
        _html += '      <option>Recreation</option>';
        _html += '      <option> Religious Organizations</option>';
        _html += '      <option>Restaurants</option>';
        _html += '      <option>Retail</option>';
        _html += '      <option>Retail General</option>';
        _html += '      <option>Retail Software</option>';
        _html += '      <option>Search Engines and Internet Portals</option>';
        _html += '      <option>Security Products and Services</option>';
        _html += '      <option>Security Software</option>';
        _html += '      <option>Semiconductor and Semiconductor Equipment</option>';
        _html += '      <option>Software</option>';
        _html += '      <option>Software and Technical Consulting</option>';
        _html += '      <option>Software Development and Design</option>';
        _html += '      <option>Software General</option>';
        _html += '      <option>Sporting and Recreational Equipment Retail</option>';
        _html += '      <option>Sporting Goods</option>';
        _html += '      <option>Sports Teams and Leagues</option>';
        _html += '      <option>Storage and System Management Software</option>';
        _html += '      <option>Supply Chain Management (SCM) Software</option>';
        _html += '      <option>Telecommunication Equipment</option>';
        _html += '      <option>Telecommunications</option>';
        _html += '      <option>Telecommunications General</option>';
        _html += '      <option>Telephony and Wireless</option>';
        _html += '      <option>Television Stations</option>';
        _html += '      <option>Test and Measurement Equipment</option>';
        _html += '      <option>Textiles and Apparel</option>';
        _html += '      <option>Tires and Rubber</option>';
        _html += '      <option>Tobacco</option>';
        _html += '      <option>Toys and Games</option>';
        _html += '      <option>Toys and Games</option>';
        _html += '      <option>Training</option>';
        _html += '      <option>Translation and Linguistic Services</option>';
        _html += '      <option>Transportation</option>';
        _html += '      <option>Transportation General</option>';
        _html += '      <option>Travel Agencies and Services</option>';
        _html += '      <option>Trucking, Moving and Storage</option>';
        _html += '      <option>Venture Capital and Private Equity</option>';
        _html += '      <option>Veterinary Care</option>';
        _html += '      <option>Video and DVD Rental</option>';
        _html += '      <option>Vitamins, Supplements, and Health Stores</option>';
        _html += '      <option>Waste Treatment, Environmental Services and Recycling</option>';
        _html += '      <option>Water and Water Treatment</option>';
        _html += '      <option>Weight and Health Management</option>';
        _html += '      <option>Wineries and Breweries</option>';
        _html += '      <option>Wire and Cable</option>';
        _html += '      <option>Zoos and National Parks</option>';
        return _html;
    },

    get_countries_options: function () {
        var _html = '';
        _html += '<option value="AFG">Afghanistan</option>';
        _html += '<option value="ALA">Åland Islands</option>';
        _html += '<option value="ALB">Albania</option>';
        _html += '<option value="DZA">Algeria</option>';
        _html += '<option value="ASM">American Samoa</option>';
        _html += '<option value="AND">Andorra</option>';
        _html += '<option value="AGO">Angola</option>';
        _html += '<option value="AIA">Anguilla</option>';
        _html += '<option value="ATA">Antarctica</option>';
        _html += '<option value="ATG">Antigua and Barbuda</option>';
        _html += '<option value="ARG">Argentina</option>';
        _html += '<option value="ARM">Armenia</option>';
        _html += '<option value="ABW">Aruba</option>';
        _html += '<option value="AUS">Australia</option>';
        _html += '<option value="AUT">Austria</option>';
        _html += '<option value="AZE">Azerbaijan</option>';
        _html += '<option value="BHS">Bahamas</option>';
        _html += '<option value="BHR">Bahrain</option>';
        _html += '<option value="BGD">Bangladesh</option>';
        _html += '<option value="BRB">Barbados</option>';
        _html += '<option value="BLR">Belarus</option>';
        _html += '<option value="BEL">Belgium</option>';
        _html += '<option value="BLZ">Belize</option>';
        _html += '<option value="BEN">Benin</option>';
        _html += '<option value="BMU">Bermuda</option>';
        _html += '<option value="BTN">Bhutan</option>';
        _html += '<option value="BOL">Bolivia, Plurinational State of</option>';
        _html += '<option value="BES">Bonaire, Sint Eustatius and Saba</option>';
        _html += '<option value="BIH">Bosnia and Herzegovina</option>';
        _html += '<option value="BWA">Botswana</option>';
        _html += '<option value="BVT">Bouvet Island</option>';
        _html += '<option value="BRA">Brazil</option>';
        _html += '<option value="IOT">British Indian Ocean Territory</option>';
        _html += '<option value="BRN">Brunei Darussalam</option>';
        _html += '<option value="BGR">Bulgaria</option>';
        _html += '<option value="BFA">Burkina Faso</option>';
        _html += '<option value="BDI">Burundi</option>';
        _html += '<option value="KHM">Cambodia</option>';
        _html += '<option value="CMR">Cameroon</option>';
        _html += '<option value="CAN">Canada</option>';
        _html += '<option value="CPV">Cape Verde</option>';
        _html += '<option value="CYM">Cayman Islands</option>';
        _html += '<option value="CAF">Central African Republic</option>';
        _html += '<option value="TCD">Chad</option>';
        _html += '<option value="CHL">Chile</option>';
        _html += '<option value="CHN">China</option>';
        _html += '<option value="CXR">Christmas Island</option>';
        _html += '<option value="CCK">Cocos (Keeling) Islands</option>';
        _html += '<option value="COL">Colombia</option>';
        _html += '<option value="COM">Comoros</option>';
        _html += '<option value="COG">Congo</option>';
        _html += '<option value="COD">Congo, the Democratic Republic of the</option>';
        _html += '<option value="COK">Cook Islands</option>';
        _html += '<option value="CRI">Costa Rica</option>';
        _html += 'option value="CIV">Côte d\'Ivoire</option>';
        _html += '<option value="HRV">Croatia</option>';
        _html += '<option value="CUB">Cuba</option>';
        _html += '<option value="CUW">Curaçao</option>';
        _html += '<option value="CYP">Cyprus</option>';
        _html += '<option value="CZE">Czech Republic</option>';
        _html += '<option value="DNK">Denmark</option>';
        _html += '<option value="DJI">Djibouti</option>';
        _html += '<option value="DMA">Dominica</option>';
        _html += '<option value="DOM">Dominican Republic</option>';
        _html += '<option value="ECU">Ecuador</option>';
        _html += '<option value="EGY">Egypt</option>';
        _html += '<option value="SLV">El Salvador</option>';
        _html += '<option value="GNQ">Equatorial Guinea</option>';
        _html += '<option value="ERI">Eritrea</option>';
        _html += '<option value="EST">Estonia</option>';
        _html += '<option value="ETH">Ethiopia</option>';
        _html += '<option value="FLK">Falkland Islands (Malvinas)</option>';
        _html += '<option value="FRO">Faroe Islands</option>';
        _html += '<option value="FJI">Fiji</option>';
        _html += '<option value="FIN">Finland</option>';
        _html += '<option value="FRA">France</option>';
        _html += '<option value="GUF">French Guiana</option>';
        _html += '<option value="PYF">French Polynesia</option>';
        _html += '<option value="ATF">French Southern Territories</option>';
        _html += '<option value="GAB">Gabon</option>';
        _html += '<option value="GMB">Gambia</option>';
        _html += '<option value="GEO">Georgia</option>';
        _html += '<option value="DEU">Germany</option>';
        _html += '<option value="GHA">Ghana</option>';
        _html += '<option value="GIB">Gibraltar</option>';
        _html += '<option value="GRC">Greece</option>';
        _html += '<option value="GRL">Greenland</option>';
        _html += '<option value="GRD">Grenada</option>';
        _html += '<option value="GLP">Guadeloupe</option>';
        _html += '<option value="GUM">Guam</option>';
        _html += '<option value="GTM">Guatemala</option>';
        _html += '<option value="GGY">Guernsey</option>';
        _html += '<option value="GIN">Guinea</option>';
        _html += '<option value="GNB">Guinea-Bissau</option>';
        _html += '<option value="GUY">Guyana</option>';
        _html += '<option value="HTI">Haiti</option>';
        _html += '<option value="HMD">Heard Island and McDonald Islands</option>';
        _html += '<option value="VAT">Holy See (Vatican City State)</option>';
        _html += '<option value="HND">Honduras</option>';
        _html += '<option value="HKG">Hong Kong</option>';
        _html += '<option value="HUN">Hungary</option>';
        _html += '<option value="ISL">Iceland</option>';
        _html += '<option value="IND">India</option>';
        _html += '<option value="IDN">Indonesia</option>';
        _html += '<option value="IRN">Iran, Islamic Republic of</option>';
        _html += '<option value="IRQ">Iraq</option>';
        _html += '<option value="IRL">Ireland</option>';
        _html += '<option value="IMN">Isle of Man</option>';
        _html += '<option value="ISR">Israel</option>';
        _html += '<option value="ITA">Italy</option>';
        _html += '<option value="JAM">Jamaica</option>';
        _html += '<option value="JPN">Japan</option>';
        _html += '<option value="JEY">Jersey</option>';
        _html += '<option value="JOR">Jordan</option>';
        _html += '<option value="KAZ">Kazakhstan</option>';
        _html += '<option value="KEN">Kenya</option>';
        _html += '<option value="KIR">Kiribati</option>';
        _html += 'option value="PRK">Korea, Democratic People\'s Republic of</option>';
        _html += '<option value="KOR">Korea, Republic of</option>';
        _html += '<option value="KWT">Kuwait</option>';
        _html += '<option value="KGZ">Kyrgyzstan</option>';
        _html += 'option value="LAO">Lao People\'s Democratic Republic</option>';
        _html += '<option value="LVA">Latvia</option>';
        _html += '<option value="LBN">Lebanon</option>';
        _html += '<option value="LSO">Lesotho</option>';
        _html += '<option value="LBR">Liberia</option>';
        _html += '<option value="LBY">Libya</option>';
        _html += '<option value="LIE">Liechtenstein</option>';
        _html += '<option value="LTU">Lithuania</option>';
        _html += '<option value="LUX">Luxembourg</option>';
        _html += '<option value="MAC">Macao</option>';
        _html += '<option value="MKD">Macedonia, the former Yugoslav Republic of</option>';
        _html += '<option value="MDG">Madagascar</option>';
        _html += '<option value="MWI">Malawi</option>';
        _html += '<option value="MYS">Malaysia</option>';
        _html += '<option value="MDV">Maldives</option>';
        _html += '<option value="MLI">Mali</option>';
        _html += '<option value="MLT">Malta</option>';
        _html += '<option value="MHL">Marshall Islands</option>';
        _html += '<option value="MTQ">Martinique</option>';
        _html += '<option value="MRT">Mauritania</option>';
        _html += '<option value="MUS">Mauritius</option>';
        _html += '<option value="MYT">Mayotte</option>';
        _html += '<option value="MEX">Mexico</option>';
        _html += '<option value="FSM">Micronesia, Federated States of</option>';
        _html += '<option value="MDA">Moldova, Republic of</option>';
        _html += '<option value="MCO">Monaco</option>';
        _html += '<option value="MNG">Mongolia</option>';
        _html += '<option value="MNE">Montenegro</option>';
        _html += '<option value="MSR">Montserrat</option>';
        _html += '<option value="MAR">Morocco</option>';
        _html += '<option value="MOZ">Mozambique</option>';
        _html += '<option value="MMR">Myanmar</option>';
        _html += '<option value="NAM">Namibia</option>';
        _html += '<option value="NRU">Nauru</option>';
        _html += '<option value="NPL">Nepal</option>';
        _html += '<option value="NLD">Netherlands</option>';
        _html += '<option value="NCL">New Caledonia</option>';
        _html += '<option value="NZL">New Zealand</option>';
        _html += '<option value="NIC">Nicaragua</option>';
        _html += '<option value="NER">Niger</option>';
        _html += '<option value="NGA">Nigeria</option>';
        _html += '<option value="NIU">Niue</option>';
        _html += '<option value="NFK">Norfolk Island</option>';
        _html += '<option value="MNP">Northern Mariana Islands</option>';
        _html += '<option value="NOR">Norway</option>';
        _html += '<option value="OMN">Oman</option>';
        _html += '<option value="PAK">Pakistan</option>';
        _html += '<option value="PLW">Palau</option>';
        _html += '<option value="PSE">Palestinian Territory, Occupied</option>';
        _html += '<option value="PAN">Panama</option>';
        _html += '<option value="PNG">Papua New Guinea</option>';
        _html += '<option value="PRY">Paraguay</option>';
        _html += '<option value="PER">Peru</option>';
        _html += '<option value="PHL">Philippines</option>';
        _html += '<option value="PCN">Pitcairn</option>';
        _html += '<option value="POL">Poland</option>';
        _html += '<option value="PRT">Portugal</option>';
        _html += '<option value="PRI">Puerto Rico</option>';
        _html += '<option value="QAT">Qatar</option>';
        _html += '<option value="REU">Réunion</option>';
        _html += '<option value="ROU">Romania</option>';
        _html += '<option value="RUS">Russian Federation</option>';
        _html += '<option value="RWA">Rwanda</option>';
        _html += '<option value="BLM">Saint Barthélemy</option>';
        _html += '<option value="SHN">Saint Helena, Ascension and Tristan da Cunha</option>';
        _html += '<option value="KNA">Saint Kitts and Nevis</option>';
        _html += '<option value="LCA">Saint Lucia</option>';
        _html += '<option value="MAF">Saint Martin (French part)</option>';
        _html += '<option value="SPM">Saint Pierre and Miquelon</option>';
        _html += '<option value="VCT">Saint Vincent and the Grenadines</option>';
        _html += '<option value="WSM">Samoa</option>';
        _html += '<option value="SMR">San Marino</option>';
        _html += '<option value="STP">Sao Tome and Principe</option>';
        _html += '<option value="SAU">Saudi Arabia</option>';
        _html += '<option value="SEN">Senegal</option>';
        _html += '<option value="SRB">Serbia</option>';
        _html += '<option value="SYC">Seychelles</option>';
        _html += '<option value="SLE">Sierra Leone</option>';
        _html += '<option value="SGP">Singapore</option>';
        _html += '<option value="SXM">Sint Maarten (Dutch part)</option>';
        _html += '<option value="SVK">Slovakia</option>';
        _html += '<option value="SVN">Slovenia</option>';
        _html += '<option value="SLB">Solomon Islands</option>';
        _html += '<option value="SOM">Somalia</option>';
        _html += '<option value="ZAF">South Africa</option>';
        _html += '<option value="SGS">South Georgia and the South Sandwich Islands</option>';
        _html += '<option value="SSD">South Sudan</option>';
        _html += '<option value="ESP">Spain</option>';
        _html += '<option value="LKA">Sri Lanka</option>';
        _html += '<option value="SDN">Sudan</option>';
        _html += '<option value="SUR">Suriname</option>';
        _html += '<option value="SJM">Svalbard and Jan Mayen</option>';
        _html += '<option value="SWZ">Swaziland</option>';
        _html += '<option value="SWE">Sweden</option>';
        _html += '<option value="CHE">Switzerland</option>';
        _html += '<option value="SYR">Syrian Arab Republic</option>';
        _html += '<option value="TWN">Taiwan, Province of China</option>';
        _html += '<option value="TJK">Tajikistan</option>';
        _html += '<option value="TZA">Tanzania, United Republic of</option>';
        _html += '<option value="THA">Thailand</option>';
        _html += '<option value="TLS">Timor-Leste</option>';
        _html += '<option value="TGO">Togo</option>';
        _html += '<option value="TKL">Tokelau</option>';
        _html += '<option value="TON">Tonga</option>';
        _html += '<option value="TTO">Trinidad and Tobago</option>';
        _html += '<option value="TUN">Tunisia</option>';
        _html += '<option value="TUR">Turkey</option>';
        _html += '<option value="TKM">Turkmenistan</option>';
        _html += '<option value="TCA">Turks and Caicos Islands</option>';
        _html += '<option value="TUV">Tuvalu</option>';
        _html += '<option value="UGA">Uganda</option>';
        _html += '<option value="UKR">Ukraine</option>';
        _html += '<option value="ARE">United Arab Emirates</option>';
        _html += '<option value="GBR">United Kingdom</option>';
        _html += '<option value="USA">United States</option>';
        _html += '<option value="UMI">United States Minor Outlying Islands</option>';
        _html += '<option value="URY">Uruguay</option>';
        _html += '<option value="UZB">Uzbekistan</option>';
        _html += '<option value="VUT">Vanuatu</option>';
        _html += '<option value="VEN">Venezuela, Bolivarian Republic of</option>';
        _html += '<option value="VNM">Viet Nam</option>';
        _html += '<option value="VGB">Virgin Islands, British</option>';
        _html += '<option value="VIR">Virgin Islands, U.S.</option>';
        _html += 'option value="WLF">Wallis and Futuna</option>';
        _html += 'option value="ESH">Western Sahara</option>';
        _html += 'option value="YEM">Yemen</option>';
        _html += 'option value="ZMB">Zambia</option>';
        _html += 'option value="ZWE">Zimbabwe</option>';
        return _html;
    },

    get_states_options: function () {
        var _html = '';
        _html += '<option value="AL">Alabama</option>';
        _html += '<option value="AK">Alaska</option>';
        _html += '<option value="AZ">Arizona</option>';
        _html += '<option value="AR">Arkansas</option>';
        _html += '<option value="CA">California</option>';
        _html += '<option value="CO">Colorado</option>';
        _html += '<option value="CT">Connecticut</option>';
        _html += '<option value="DE">Delaware</option>';
        _html += '<option value="DC">District Of Columbia</option>';
        _html += '<option value="FL">Florida</option>';
        _html += '<option value="GA">Georgia</option>';
        _html += '<option value="HI">Hawaii</option>';
        _html += '<option value="ID">Idaho</option>';
        _html += '<option value="IL">Illinois</option>';
        _html += '<option value="IN">Indiana</option>';
        _html += '<option value="IA">Iowa</option>';
        _html += '<option value="KS">Kansas</option>';
        _html += '<option value="KY">Kentucky</option>';
        _html += '<option value="LA">Louisiana</option>';
        _html += '<option value="ME">Maine</option>';
        _html += '<option value="MD">Maryland</option>';
        _html += '<option value="MA">Massachusetts</option>';
        _html += '<option value="MI">Michigan</option>';
        _html += '<option value="MN">Minnesota</option>';
        _html += '<option value="MS">Mississippi</option>';
        _html += '<option value="MO">Missouri</option>';
        _html += '<option value="MT">Montana</option>';
        _html += '<option value="NE">Nebraska</option>';
        _html += '<option value="NV">Nevada</option>';
        _html += '<option value="NH">New Hampshire</option>';
        _html += '<option value="NJ">New Jersey</option>';
        _html += '<option value="NM">New Mexico</option>';
        _html += '<option value="NY">New York</option>';
        _html += '<option value="NC">North Carolina</option>';
        _html += '<option value="ND">North Dakota</option>';
        _html += '<option value="OH">Ohio</option>';
        _html += '<option value="OK">Oklahoma</option>';
        _html += '<option value="OR">Oregon</option>';
        _html += '<option value="PA">Pennsylvania</option>';
        _html += '<option value="RI">Rhode Island</option>';
        _html += '<option value="SC">South Carolina</option>';
        _html += '<option value="SD">South Dakota</option>';
        _html += '<option value="TN">Tennessee</option>';
        _html += '<option value="TX">Texas</option>';
        _html += '<option value="UT">Utah</option>';
        _html += '<option value="VT">Vermont</option>';
        _html += '<option value="VA">Virginia</option>';
        _html += '<option value="WA">Washington</option>';
        _html += '<option value="WV">West Virginia</option>';
        _html += '<option value="WI">Wisconsin</option>';
        _html += '<option value="WY">Wyoming</option>';
        return _html;
    },

    collect_fields: function () {
        var states = ll_combo_manager.get_selected_value($('.cognism div[criteria=states] select'));
        var regions = ll_combo_manager.get_selected_value($('.cognism div[criteria=regions] select'));
        var seniority = ll_combo_manager.get_selected_value($('.cognism div[criteria=seniority] select'));
        var departments = ll_combo_manager.get_selected_value($('.cognism div[criteria=departments] select'));
        var roles = ll_combo_manager.get_selected_value($('.cognism div[criteria=roles] select'));
        var industries = ll_combo_manager.get_selected_value($('.cognism div[criteria=companyIndustries] select'));
        var emailScore = ll_combo_manager.get_selected_value($('.cognism div[criteria=emailScore] select'));
        var countries = ll_combo_manager.get_selected_value($('.cognism div[criteria=countries] select'));
        var countries_names = [];
        if (countries) {
            countries.forEach(function (country) {
                if (country) {
                    if (typeof dataSpring_panel_manager.country_names[country] !== 'undefined') {
                        countries_names = countries_names.concat(dataSpring_panel_manager.country_names[country]);
                    } else {
                        countries_names.push(country);
                    }
                }
            });
        }
        var states_names = [];
        if (states) {
            states.forEach(function (state) {
                if (state) {
                    if (typeof dataSpring_panel_manager.states_names[state] !== 'undefined') {
                        states_names.push(dataSpring_panel_manager.states_names[state])
                    }
                    states_names.push(state);
                }
            });
        }
        var sizes = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySize] select'));
        var fields_data = {
            firstName: $('.cognism div[criteria=firstName] input').val(),
            lastName: $('.cognism div[criteria=lastName] input').val(),
            fullName: $('.cognism div[criteria=fullName] input').val(),
            alias: $('.cognism div[criteria=alias] input').val(),
            email: $('.cognism div[criteria=email] input').val(),
            // emailScore : ($('.cognism div[criteria=emailScore] select').val()).filter(item => item),
            cities: ll_combo_manager.get_selected_value($('.cognism div[criteria=cities] select')),
            states: states_names,
            regions: regions ? regions.filter(item => item) : '',
            countries: countries_names,
            titles: ll_combo_manager.get_selected_value($('.cognism div[criteria=jobTitles] select')),
            excludeTitles: ll_combo_manager.get_selected_value($('.cognism div[criteria=excludeJobTitles] select')),
            seniority: seniority ? seniority.filter(item => item) : '',
            departments: departments ? departments.filter(item => item) : '',
            roles: roles ? roles.filter(item => item) : '',
            skills: ll_combo_manager.get_selected_value($('.cognism div[criteria=skills] select')),
            age: {
                from: $('.cognism div[criteria=ageFrom] input').val(),
                to: $('.cognism div[criteria=ageTo] input').val()
            },
            company: {
                names: ll_combo_manager.get_selected_value($('.cognism div[criteria=companyNames] select')),
                excludeNames: ll_combo_manager.get_selected_value($('.cognism div[criteria=companyExcludeNames] select')),
                www: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySites] select')),
                domains: ll_combo_manager.get_selected_value($('.cognism div[criteria=companyDomains] select')),
                industries: industries ? industries.filter(item => item) : '',
                excludedDomains: ll_combo_manager.get_selected_value($('.cognism div[criteria=companyExcludeDomains] select')),
                technologies: ll_combo_manager.get_selected_value($('.cognism div[criteria=companyTechnologies] select')),
                size: {
                    from: $('.cognism div[criteria=companySizeFrom] input').val(),
                    to: $('.cognism div[criteria=companySizeTo] input').val()
                },
                revenue: {
                    from: $('.cognism div[criteria=companyRevenueFrom] input').val(),
                    to: $('.cognism div[criteria=companyRevenueTo] input').val()
                },
                sizes: sizes ? sizes.filter(item => item) : '',
            }
        };
        emailScore = emailScore ? emailScore.filter(item => item) : '';
        if ($.isArray(emailScore) && emailScore.length > 0) {
            fields_data['emailScore'] = emailScore;
        } else if ($('.cognism #has-email').is(':checked')) {
            fields_data['emailScore'] = ['Low', 'Medium', 'High'];
        }

        var selectedPhoneScore = $('.cognism div[criteria=phoneScore] select').val();
        if (selectedPhoneScore.includes('Low') || selectedPhoneScore.includes('Medium') || selectedPhoneScore.includes('High')) {
            fields_data['personPhoneScore'] = {
                low: ($('.cognism div[criteria=phoneScore] select').val()).includes('Low').toString(),
                medium: ($('.cognism div[criteria=phoneScore] select').val()).includes('Medium').toString(),
                high: ($('.cognism div[criteria=phoneScore] select').val()).includes('High').toString()
            }
        }
        if ($('.cognism #has-phone').is(':checked')) {
            fields_data['personPhoneType'] = {
                'corporateHq': 'true',
                'corporateOffice': 'true',
                'mobile': 'true',
                'directDial': 'true'
            }
        }
        dataSpring_panel_manager.checkEmptyObj(fields_data);
        if (!$.isEmptyObject(fields_data)) {
            fields_data['options'] = {
                "show_contact_data": 'false'
            }
        }
        return fields_data;
    },

    collect_company_fields: function () {

        var sizes = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchSize] select'));
        var sic = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchSIC] select'));
        var isic = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchISIC] select'));
        var naics = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchNAICS] select'));
        industries = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchIndustries] select'));
        excludeIndustries = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchExcludeIndustries] select'));
        var countries = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchCountries] select'));
        var countries_names = [];
        if (countries) {
            countries.forEach(function (country) {
                if (country) {
                    if (typeof dataSpring_panel_manager.country_names[country] !== 'undefined') {
                        countries_names = countries_names.concat(dataSpring_panel_manager.country_names[country]);
                    } else {
                        countries_names.push(country);
                    }
                }
            });
        }
        var states = ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchStates] select'));
        var states_names = [];
        if (states) {
            states.forEach(function (state) {
                if (state) {
                    if (typeof dataSpring_panel_manager.states_names[state] !== 'undefined') {
                        states_names.push(dataSpring_panel_manager.states_names[state])
                    }
                    states_names.push(state);
                }
            });
        }
        var fields_data = {
            names: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchNames] select')),
            excludeNames: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchExcludeNames] select')),
            www: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchSites] select')),
            domains: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchDomains] select')),
            excludedDomains: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchExcludeDomains] select')),
            technologies: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchTechnologies] select')),
            cities: ll_combo_manager.get_selected_value($('.cognism div[criteria=companySearchCities] select')),
            states: states_names,
            countries: countries_names,
            industries: industries ? industries.filter(item => item) : '',
            excludeIndustries: excludeIndustries ? excludeIndustries.filter(item => item) : '',
            size: {
                from: $('.cognism div[criteria=companySearchSizeFrom] input').val(),
                to: $('.cognism div[criteria=companySearchSizeTo] input').val()
            },
            revenue: {
                from: $('.cognism div[criteria=companySearchRevenueFrom] input').val(),
                to: $('.cognism div[criteria=companySearchRevenueTo] input').val()
            },
            sizes: sizes ? sizes.filter(item => item) : '',
            sic: sic ? sic.filter(item => item) : '',
            isic: isic ? isic.filter(item => item) : '',
            naics: naics ? naics.filter(item => item) : '',
        };
        dataSpring_panel_manager.checkEmptyObj(fields_data);
        return fields_data;
    },

    checkEmptyObj: function (data) {
        $.each(data, function (key, value) {
            if ($.isPlainObject(value) || $.isArray(value)) {
                dataSpring_panel_manager.checkEmptyObj(value);
            }
            if (typeof value === 'undefined' || value === '' || value === null || $.isEmptyObject(value)) {
                delete data[key];
            }
        });
    },

    clear_fields: function (clear_companyDomain) {

        clear_companyDomain = (typeof clear_companyDomain != 'undefined') ? clear_companyDomain : true;

        var $panel = $(".cognism");
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');

        ll_combo_manager.set_selected_value($panel.find(".general-search-fields div.t-field:not(.companyDomain) select"), '');
        ll_combo_manager.set_selected_value($panel.find('.general-search-fields div.t-field[criteria=radiusMiles] select'), 0);
        $panel.find('input[type=text]').val('');
        ll_theme_manager.checkboxRadioButtons.check($panel.find('input[type=checkbox]'), false);

        if (clear_companyDomain) {
            ll_combo_manager.clear_all($panel.find('.general-search-fields div.company-field[criteria=companyDomain] select'));
        }
    },

    populate_fields: function (fields) {

        dataSpring_panel_manager.clear_fields(false);

        if (typeof fields.hasEmail != 'undefined' && parseInt(fields.hasEmail)) {
            ll_theme_manager.checkboxRadioButtons.check($('.cognism #has-email'), true);
        } else {
            ll_theme_manager.checkboxRadioButtons.check($('.cognism #has-email'), false);
        }
        if (typeof fields.hasPhone != 'undefined' && parseInt(fields.hasPhone)) {
            ll_theme_manager.checkboxRadioButtons.check($('.cognism #has-phone'), true);
        } else {
            ll_theme_manager.checkboxRadioButtons.check($('.cognism #has-phone'), false);
        }
        if (typeof fields.city != 'undefined' && fields.city) {
            $('.cognism div[criteria=city] input').val(fields.city);
        }
        if (typeof fields.companyDomain != 'undefined' && fields.companyDomain) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=companyDomain] select'), fields.companyDomain);
            for (var i in fields.companyDomain) {
                ll_combo_manager.add_option_if_not_exist($('.cognism div[criteria=companyDomain] select'), fields.companyDomain[i], fields.companyDomain[i], true);

            }
        }
        if (typeof fields.companyName != 'undefined' && fields.companyName) {
            $('.cognism div[criteria=companyName] input').val(fields.companyName);
        }
        if (typeof fields.country != 'undefined' && fields.country) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=country] select'), fields.country);
        }
        if (typeof fields.employees != 'undefined' && fields.employees) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=employees] select'), fields.employees);
        }
        if (typeof fields.industry != 'undefined' && fields.industry) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=industry] select'), fields.industry);
        }
        if (typeof fields.jobTitle != 'undefined' && fields.jobTitle) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=jobTitle] select'), fields.jobTitle);
        }
        if (typeof fields.level != 'undefined' && fields.level) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=level] select'), fields.level);
        }
        if (typeof fields.ranking != 'undefined' && fields.ranking) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=ranking] select'), fields.ranking);
        }
        if (typeof fields.radiusMiles != 'undefined' && fields.radiusMiles) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=radiusMiles] select'), fields.radiusMiles);
        }
        if (typeof fields.region != 'undefined' && fields.region) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=region] select'), fields.region);
        }
        if (typeof fields.revenue != 'undefined' && fields.revenue) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=revenue] select'), fields.revenue);
        }
        if (typeof fields.role != 'undefined' && fields.role) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=role] select'), fields.role);
        }
        if (typeof fields.state != 'undefined' && fields.state) {
            ll_combo_manager.set_selected_value($('.cognism div[criteria=state] select'), fields.state);
        }
        if (typeof fields.withinRadiusOfZipcode != 'undefined' && fields.withinRadiusOfZipcode) {
            $('.cognism div[criteria=withinRadiusOfZipcode] input').val(fields.withinRadiusOfZipcode);
        }
        if (typeof fields.zipcode != 'undefined' && fields.zipcode) {
            $('.cognism div[criteria=zipcode] input').val(fields.zipcode);
        }
    },

    onerror_suspect_img: function (img) {
        var $panel = $(".cognism");
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
        if (item_for == 'organizations') {
            img.attr('src', 'imgs/sales_automation/zoominfo-organizations.svg');
        } else {
            img.attr('src', 'imgs/no_ava.png');
        }
        img.closest('.ava').addClass('ava-anonumous');
    },

    draw_suspect: function (asset, by_search) {

        var _html = '';

        by_search = (typeof by_search != 'undefined' && by_search) ? by_search : false;
        var personID = (typeof asset.posted_assetID != 'undefined' && asset.posted_assetID) ? asset.posted_assetID : asset.PersonID;

        if (typeof asset.ll_unique_visitor_id != 'undefined' && asset.ll_unique_visitor_id) {
            ll_asset_id = asset.ll_unique_visitor_id;
            asset_href = 'll-lead-profile-new.php?lluvid=' + asset.ll_unique_visitor_id;
        } else {
            ll_asset_id = asset.ll_organization_id;
            asset_href = 'organization.php?orgId=' + asset.ll_organization_id;
        }

        var error_title = null;
        if (parseInt(asset.isPurchased) && parseInt(ll_asset_id)) {
            if (typeof asset.error_applying_actions != 'undefined' && asset.error_applying_actions) {
                var title = '';
                for (var action in asset.error_applying_actions) {
                    if (asset.error_applying_actions[action] && asset.error_applying_actions[action] != 'null') {
                        title += asset.error_applying_actions[action].error;
                    }
                }
                error_title = title;
            }

            var apply_actions = false;
            if (typeof asset.actions_info != 'undefined' && asset.actions_info && dataSpring_panel_manager.actions_callback && !error_title) {
                for (var action in asset.actions_info) {
                    for (var key in dataSpring_panel_manager.actions_callback) {
                        if (action == dataSpring_panel_manager.actions_callback[key]['action']) {
                            if (!parseInt(asset.actions_info[action].is_applied)) {
                                apply_actions = true;
                            }
                        }
                    }
                }
            }
        }

        var extra_class = (apply_actions || !asset.isPurchased) ? 'apply_actions' : '';

        _html += '<div class="suspects-item ' + extra_class + '" personID="' + personID + '" isPurchased="' + asset.isPurchased + '">';
        var $panel = $(".cognism");
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
        if ($.trim(asset.imageUrl)) {
            _html += '  <div class="ava">';
            _html += '      <img src="' + asset.imageUrl + '" onerror="dataSpring_panel_manager.onerror_suspect_img($(this));" />';
            _html += '  </div>';
        } else {
            _html += '  <div class="ava ava-anonumous">';
            if (item_for == 'organizations') {
                _html += '      <img src="imgs/sales_automation/zoominfo-organizations.svg"/>';
            } else {
                _html += '      <img src="imgs/no_ava.png"/>';
            }
            _html += '  </div>';

        }
        if (parseInt(asset.isPurchased) && parseInt(ll_asset_id)) {
            _html += '  <a class="ll-link name"  href="' + asset_href + '" target="_blank">';
        }
        _html += '      <div class="name">';
        if (item_for == 'organizations') {
            _html += '      <span class="f-name">' + asset.FullName + '</span> <span class="l-name"></span>';
        } else {
            _html += '        <span class="f-name">' + asset.FirstName + '</span> <span>' + asset.LastName + '</span>';
        }
        _html += '      </div>';
        if (parseInt(asset.isPurchased) && parseInt(ll_asset_id)) {
            _html += '  </a>';
            // if($.trim(asset.addedDate) && asset.addedDate != '0000-00-00'){
            //     _html += '   <span class="added-item ll_std_tooltip" title="'+asset.addedDate+'">Added</span>';
            // }
        }

        if (asset.JobTitle && !asset.isPurchased) {
            _html += '  <p>' + asset.JobTitle + '</p>';
        }
        if (asset.CompanyName) {
            _html += '  <p>' + asset.CompanyName + '.</p>';
        }
        if (asset.CompanyDomain && item_for == 'organizations') {
            _html += '  <p>' + asset.CompanyDomain + '</p>';
        }
        if (asset.Address) {
            _html += '  <p>' + asset.Address + '</p>';
        }
        if ($.trim(asset.addedDate) && asset.addedDate != '0000-00-00') {
            _html += '   <p class="added-item ll_std_tooltip" title="' + asset.addedDate + (asset.LastUpdatedDate ? ('\nUpdated : ' + asset.LastUpdatedDate) : '') + '">Added</p>';
            //_html += '   <p class="added-item ll_std_tooltip" title="'+asset.addedDate+'">Added</p>';
        }

        if (parseInt(asset.isPurchased) && parseInt(ll_asset_id) && $.trim(asset.addedDate) && asset.addedDate != '0000-00-00') {
            // _html += '  <a href="'+asset.asset_href+'" target="_blank" class="icns icn-tick ll_std_tooltip" title="'+asset.addedDate+'">';
            // _html += '      <img src="imgs/svg/icn-zoominfo-tick.svg"/>';
            // _html += '  </a>';
            if (apply_actions) {
                _html += '  <a href="javascript:void(0);" target="_blank" class="icns ll-link icn-apply-action ll_std_tooltip" title=" Add to Rhythm">';
                _html += '      <img src="imgs/svg/icn-zoominfo-apply-actions.svg"/>';
                _html += '      <img src="imgs/svg/icn-zoominfo-small-plus.svg" class="icn-apply-action-plus"/>';
                _html += '  </a>';
            }

            if (error_title) {
                _html += '<div class="icn-warning ll_std_tooltip " title="' + title + '"><img src="imgs/svg/icn-crm-warning.svg"></div>';
            }

            if (by_search) {
                _html += '  <a href="javascript:void(0);" class="icns btn-update ll_std_tooltip" title="Repurchase" style="right: 15px;">';
                _html += '      <img src="imgs/svg/refresh-cognism.svg"/>';
                _html += '  </a>';
            }

        } else if (REVEAL_COMPANIES_DATA_SPRING) {
            _html += '  <a href="javascript:void(0);" class="btn-add">';
            _html += '      <i class="icn">';
            _html += '          <img src="imgs/svg/plus-circle.svg"/>';
            _html += '      </i>';
            _html += '  </a>';
        }
        _html += '  </div>';
        _html += '</div>';
        return _html;
    },

    handle_icons: function (_html) {

        var right = 15;
        if ($(_html).find('.icns').length) {
            $(_html).find('.icns').each(function () {
                $(this).css('right', right + 'px');
                right = right + 25;
            });
        }

    },

    reset: function () {

        var $panel = $(".cognism");
        dataSpring_panel_manager.clear_fields();
        dataSpring_panel_manager.ll_cognism_criteria_id = 0;
        dataSpring_panel_manager.ll_cognism_criteria_name = '';
        dataSpring_panel_manager.page = 1;
        dataSpring_panel_manager.people_count = 0;
        $panel.find('.cognism-start-list-items .item').removeClass('selected');
    },


    populate_initiated_data: function (_callback) {

        if (dataSpring_panel_manager.initiated_data) {

            if (typeof dataSpring_panel_manager.initiated_data.country_options != 'undefined' && dataSpring_panel_manager.initiated_data.country_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=country] select', dataSpring_panel_manager.initiated_data.country_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.employee_options != 'undefined' && dataSpring_panel_manager.initiated_data.employee_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=employees] select', dataSpring_panel_manager.initiated_data.employee_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.industry_options != 'undefined' && dataSpring_panel_manager.initiated_data.industry_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=industry] select', dataSpring_panel_manager.initiated_data.industry_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.job_title_options != 'undefined' && dataSpring_panel_manager.initiated_data.job_title_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=jobTitle] select', dataSpring_panel_manager.initiated_data.job_title_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.level_options != 'undefined' && dataSpring_panel_manager.initiated_data.level_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=level] select', dataSpring_panel_manager.initiated_data.level_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.radius_miles_options != 'undefined' && dataSpring_panel_manager.initiated_data.radius_miles_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=radiusMiles] select', dataSpring_panel_manager.initiated_data.radius_miles_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.ranking_options != 'undefined' && dataSpring_panel_manager.initiated_data.ranking_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=ranking] select', dataSpring_panel_manager.initiated_data.ranking_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.region_options != 'undefined' && dataSpring_panel_manager.initiated_data.region_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=region] select', dataSpring_panel_manager.initiated_data.region_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.revenue_options != 'undefined' && dataSpring_panel_manager.initiated_data.revenue_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=revenue] select', dataSpring_panel_manager.initiated_data.revenue_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.role_options != 'undefined' && dataSpring_panel_manager.initiated_data.role_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=role] select', dataSpring_panel_manager.initiated_data.role_options);
            }
            if (typeof dataSpring_panel_manager.initiated_data.state_options != 'undefined' && dataSpring_panel_manager.initiated_data.state_options) {
                ll_combo_manager.add_kv_options('.cognism div[criteria=state] select', dataSpring_panel_manager.initiated_data.state_options);
            }

            ll_combo_manager.sort('.cognism [criteria="jobTitle"] select');
            ll_combo_manager.sort('.cognism [criteria="role"] select');
            ll_combo_manager.sort('.cognism [criteria="level"] select');
            ll_combo_manager.sort('.cognism [criteria="industry"] select');
            ll_combo_manager.sort('.cognism [criteria="state"] select');
            ll_combo_manager.sort('.cognism [criteria="country"] select');
            ll_combo_manager.sort('.cognism [criteria="region"] select');
            ll_combo_manager.sort('.cognism [criteria="ranking"] select');


            if (typeof _callback != 'undefined' && _callback) {
                _callback();
            }
        }
    },

    open_criterias_popup: function (_callback) {

        if (!dataSpring_panel_manager.is_popup_criterias_loaded) {
            var _html = '';
            _html += '<div class="ll-popup" id="cognism-criterias-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Load Search Criteria';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="form">';
            _html += '         <div class="t-field ll-line-field">';
            /*_html += '              <div class="label label-small"><label>Criteria</label></div>';*/
            _html += '			    <select class="txt-field txt-field-wider" id="ll_cognism_criteria_id" data-placeholder="Select Search Criteria">';
            _html += '			    	<option></option>';
            _html += '			    </select>';
            _html += '         </div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_zi_criterias_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_choose_zi_criterias_popup">Select</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);
            dataSpring_panel_manager.is_popup_criterias_loaded = true;

            ll_combo_manager.make_combo('#cognism-criterias-popup #ll_cognism_criteria_id');

            $('.btn_cancel_zi_criterias_popup').click(function () {
                ll_popup_manager.close('#cognism-criterias-popup');
            });

            $('.btn_choose_zi_criterias_popup').click(function () {
                var ll_cognism_criteria_id = ll_combo_manager.get_selected_value('#cognism-criterias-popup #ll_cognism_criteria_id');
                if (!ll_cognism_criteria_id) {
                    show_error_message('Choose criteria');
                    return;
                }
                if (dataSpring_panel_manager.ll_cognism_criterias && ll_cognism_criteria_id in dataSpring_panel_manager.ll_cognism_criterias) {
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(dataSpring_panel_manager.ll_cognism_criterias[ll_cognism_criteria_id]);
                    }
                    ll_popup_manager.close('#cognism-criterias-popup');
                } else {
                    show_error_message('Invalid criteria');
                }
            });

        }
        ll_combo_manager.clear_all('#cognism-criterias-popup #ll_cognism_criteria_id', true);
        dataSpring_panel_manager.load_criterias(function (response) {
            if (typeof response.cognism_criterias_array != 'undefined' && response.cognism_criterias_array) {
                ll_combo_manager.add_kv_options('#cognism-criterias-popup #ll_cognism_criteria_id', response.cognism_criterias_array);
            }
        });
        ll_popup_manager.open('#cognism-criterias-popup');
    },

    load_criterias: function (_callback) {

        var data = {};
        data.action = 'LOAD_CRITERIAS';
        $.ajax({
            url: 'dataSpring-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if (typeof response.ll_cognism_criterias != 'undefined' && response.ll_cognism_criterias) {
                        dataSpring_panel_manager.ll_cognism_criterias = response.ll_cognism_criterias;
                    }
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    open_criteria_popup: function (_callback) {

        if (!dataSpring_panel_manager.is_popup_criteria_loaded) {
            var _html = '';
            _html += '<div class="ll-popup" id="cognism-criteria-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Save Search Criteria';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content">';
            _html += '      <div class="form">';
            _html += '         <div class="t-field ll-line-field">';
            /*_html += '              <div class="label label-small"><label>Name</label></div>';*/
            _html += '              <input type="text" class="txt-field txt-field-wider" placeholder="Enter Name" id="ll_cognism_criteria_name"/>';
            _html += '         </div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_zi_criteria_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_zi_criteria_popup">Save</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);
            dataSpring_panel_manager.is_popup_criteria_loaded = true;

            $('.btn_cancel_zi_criteria_popup').click(function () {
                ll_popup_manager.close('#cognism-criteria-popup');
            });

            $('.btn_save_zi_criteria_popup').click(function () {
                var ll_cognism_criteria_name = $('#cognism-criteria-popup #ll_cognism_criteria_name').val();
                if (!ll_cognism_criteria_name) {
                    show_error_message('Please enter name');
                    return;
                }
                dataSpring_panel_manager.ll_cognism_criteria_name = ll_cognism_criteria_name;
                dataSpring_panel_manager.save_criteria(function (response) {
                    ll_popup_manager.close('#cognism-criteria-popup');
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                });
            });
        }
        $('#cognism-criteria-popup #ll_cognism_criteria_name').val('');
        ll_popup_manager.open('#cognism-criteria-popup');
    },

    save_criteria: function (_callback) {
        var data = {};
        data.action = 'SAVE_CRITERIA';
        data.ll_cognism_criteria_name = dataSpring_panel_manager.ll_cognism_criteria_name;
        data.fields = dataSpring_panel_manager.collect_fields();
        if (dataSpring_panel_manager.ll_cognism_criteria_id) {
            data.ll_cognism_criteria_id = dataSpring_panel_manager.ll_cognism_criteria_id;
        }
        $.ajax({
            url: 'dataSpring-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if (typeof response.ll_cognism_criteria != 'undefined' && response.ll_cognism_criteria) {
                        dataSpring_panel_manager.ll_cognism_criteria_id = response.ll_cognism_criteria.ll_cognism_criteria_id;
                        dataSpring_panel_manager.ll_cognism_criteria_name = response.ll_cognism_criteria.ll_cognism_criteria_name;
                    }
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                    show_success_message(response.message);
                } else {
                    show_error_message(response.message);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    search_by_criteria: function (_callback) {

        var $panel = $(".cognism");
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
        var data = {};
        if (item_for == 'organizations') {
            data.action = 'SEARCH_COMPANY';
            data.fields = dataSpring_panel_manager.collect_company_fields();
        } else {
            data.action = 'SEARCH_PROSPECT';
            data.fields = dataSpring_panel_manager.collect_fields();
        }
        data.page = dataSpring_panel_manager.page;
        if (dataSpring_panel_manager.actions_callback) {
            data.actions_callback = dataSpring_panel_manager.actions_callback;
        }
        $.ajax({
            url: 'dataSpring-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                    ll_fade_manager.fade(false);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
                ll_fade_manager.fade(false);
            }
        });
    },

    apply_callback_actions: function (personID, _callback) {

        if (dataSpring_panel_manager.actions_callback) {
            var data = {};
            data.object = 'criteria';
            data.action = 'apply_actions';
            data.personID = personID;
            data.actions_callback = dataSpring_panel_manager.actions_callback;

            $.ajax({
                url: 'll-cognism-criteria-process.php',
                data: data,
                type: 'POST',
                async: true,
                dataType: 'json',
                success: function (response) {
                    if (response.success) {
                        if (typeof _callback != 'undefined' && _callback) {
                            _callback(response);
                        }
                    } else {
                        show_error_message(response.message);
                        ll_fade_manager.fade(false);
                    }
                },
                error: function (response) {
                    show_error_message("Unknown Error");
                    ll_fade_manager.fade(false);
                }
            });
        } else {
            show_error_message('Invalid Actions');
        }
    },

    purchase: function (personIDs, is_update, _callback) {

        var $panel = $(".cognism");
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
        var data = {};
        if (item_for == 'organizations') {
            data.action = 'PURCHASE_COMPANY';
            data.companyIDs = personIDs;
        } else {
            data.action = 'PURCHASE';
            data.personIDs = personIDs;
        }

        data.is_update = is_update;
        if (dataSpring_panel_manager.actions_callback) {
            data.actions_callback = dataSpring_panel_manager.actions_callback;
        }
        $.ajax({
            url: 'dataSpring-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                    ll_fade_manager.fade(false);
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
                ll_fade_manager.fade(false);
            }
        });
    },

    purchase_per_page: function (_callback) {

        var $panel = $(".cognism");

        if ($panel.find(".list-suspects .suspects-item.apply_actions").length) {
            ll_fade_manager.fade(true, 'Processing...');
            var PersonIDs = [];
            $panel.find(".list-suspects .suspects-item.apply_actions:lt(10)").each(function () {
                var PersonID = $(this).attr('PersonID');
                if (typeof PersonID != 'undefined' && PersonID) {
                    PersonIDs.push(PersonID);
                }
            });
            if (PersonIDs.length) {
                dataSpring_panel_manager.purchase(PersonIDs, 0, function (response) {
                    dataSpring_panel_manager.purchase_callback(response, function () {
                        var people_count = $panel.find(".list-suspects .suspects-item.apply_actions").length;
                        if (people_count) {
                            dataSpring_panel_manager.purchase_per_page(function (response) {

                            });
                        } else {
                            show_success_message('Added Successfully');
                            ll_fade_manager.fade(false);
                        }
                    });
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                });
            }
        } else {
            var $panel = $(".cognism");
            var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
            if (item_for == 'organizations') {
                show_error_message('No company to add');
            } else {
                show_error_message('No suspects to add');
            }
        }
    },

    purchase_all: function (_callback) {

        var $panel = $(".cognism");

        var data = {};
        var item_for = $panel.find('.cognism-start-list-items .item.selected').attr('item-for');
        if (item_for == 'organizations') {
            data.action = 'PURCHASE_COMPANY_ALL';
            data.fields = dataSpring_panel_manager.collect_company_fields();
        } else {
            data.action = 'PURCHASE_ALL';
            data.fields = dataSpring_panel_manager.collect_fields();
        }

        data.total_count = $panel.find('.list-suspects .suspects-total span.total').text();
        if (dataSpring_panel_manager.actions_callback) {
            data.actions_callback = dataSpring_panel_manager.actions_callback;
        }
        $.ajax({
            url: 'dataSpring-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                } else {
                    show_error_message(response.message);
                    $(".cognism-bottom .btn-add-all").removeAttr('disabled');
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
                $(".cognism-bottom .btn-add-all").removeAttr('disabled');
            }
        });
    },

    purchase_callback: function (response, _callback) {

        var $panel = $(".cognism");
        var error_in_response = false;
        if (typeof response.error != 'undefined' && response.error) {
            error_in_response = true;
        }
        if (typeof response.ll_cognism_purchased_contacts != 'undefined' && response.ll_cognism_purchased_contacts) {
            for (var i in response.ll_cognism_purchased_contacts) {
                var ll_cognism_purchased_contact = response.ll_cognism_purchased_contacts[i];
                var suspects_item = $panel.find(".list-suspects .suspects-item[PersonID=" + ll_cognism_purchased_contact.posted_assetID + "]");
                if (typeof ll_cognism_purchased_contact.assetData != 'undefined' && ll_cognism_purchased_contact.assetData) {
                    var suspects_item_html = dataSpring_panel_manager.draw_suspect(ll_cognism_purchased_contact.assetData);
                    suspects_item.replaceWith(suspects_item_html);
                    suspects_item = $(".list-suspects .suspects-item[PersonID=" + ll_cognism_purchased_contact.posted_assetID + "]");
                    dataSpring_panel_manager.handle_icons(suspects_item);
                    apply_ll_tooltip(suspects_item);
                }
            }
            if (!error_in_response) {
                if (typeof _callback != 'undefined' && _callback) {
                    _callback(response);
                }
            }
        }
        if (error_in_response) {
            ll_fade_manager.fade(false);
            var error_message = '';
            if (typeof response.error_with_personID != 'undefined' && response.error_with_personID) {
                var error_with_item = $panel.find(".list-suspects .suspects-item[PersonID=" + response.error_with_personID + "]");
                if (error_with_item.length) {
                    var suspect_name = error_with_item.find('.f-name').html();
                    if (suspect_name) {
                        error_message = ' We’re unable to add ' + suspect_name + ' <br/>';
                    }
                }
            }
            if (typeof response.error_message != 'undefined' && response.error_message) {
                error_message = error_message + response.error_message;
            }
            if (error_message) {
                show_error_message(error_message);
            }

            error_with_item.find('.btn-add').replaceWith('<div class="icn-error ll_std_tooltip" title="' + response.error_message + '"><img src="imgs/svg/icon-data-spring-error.svg"/></div>');
            //error_with_item.find('.btn-add').replaceWith('<div class="icn-error ll_std_tooltip" title="'+response.error_message+'"><spain class=".error" title="'+response.error_message+'">Error</spain></div>');

            apply_ll_tooltip($panel);
        }
    },

    open_add_suspects_to_rhythm_popup: function (_callback) {

        if (!dataSpring_panel_manager.is_popup_add_suspects_to_rhythm_loaded) {
            var _html = '';
            _html += '<div class="ll-popup" id="cognism-add-suspects-to-rhythm-popup">';
            _html += '	<div class="ll-popup-head">';
            _html += '	    Add cognism Suspects to Rhythm';
            _html += '	</div>';
            _html += '	<div class="ll-popup-content">';
            _html += '		<div class="form">';
            _html += '			<div class="t-field ll-line-field ll_select_user " >';
            _html += '				<div class="label ll_std_tooltip" title="“From” is the Prospect Owner within the Rhythm. Unless otherwise specified, all emails will be sent from this user, and all Tasks assigned to this user."><label>From</label></div>';
            _html += '	            <select name="select_user" data-placeholder="Select user">';
            _html += '                  <option value="0"></option>';
            _html += '	            </select>';
            _html += '	        </div>';
            _html += '	    </div>';
            _html += '	</div>';
            _html += '	<div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_cognism-add-suspects-to-rhythm-popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_save_cognism-add-suspects-to-rhythm-popup">Continue</a>';
            _html += '	</div>';
            _html += '</div>';
            $('#mainWrapper').append(_html);
            dataSpring_panel_manager.is_popup_add_suspects_to_rhythm_loaded = true;

            apply_ll_tooltip('#cognism-add-suspects-to-rhythm-popup');

            $('.btn_cancel_cognism-add-suspects-to-rhythm-popup').click(function () {
                ll_popup_manager.close('#cognism-add-suspects-to-rhythm-popup');
            });

            $('.btn_save_cognism-add-suspects-to-rhythm-popup').click(function () {
                var communication_from_userID = ll_combo_manager.get_selected_value('#cognism-add-suspects-to-rhythm-popup select[name="select_user"]');
                if (!communication_from_userID) {
                    show_error_message('Please choose user');
                    return;
                }
                ll_popup_manager.close('#cognism-add-suspects-to-rhythm-popup');
                if (typeof _callback != 'undefined' && _callback) {
                    _callback(communication_from_userID);
                }
            });

            ll_combo_manager.add_option('#cognism-add-suspects-to-rhythm-popup select[name="select_user"]', 'owner', 'Owner', true);
            dataSpring_panel_manager.load_add_suspects_to_rhythm_initiated_data(function (response) {
                if (typeof response.ll_users != 'undefined' && Object.keys(response.ll_users).length > 0) {
                    $('#cognism-add-suspects-to-rhythm-popup select[name="select_user"]').append('<optgroup label="User" name="select_user_mine">');
                    for (var i in response.ll_users) {
                        var user = response.ll_users[i];
                        $('#cognism-add-suspects-to-rhythm-popup [name="select_user_mine"] ').append($('<option/>', {
                            value: user.userID,
                            text: user.firstName + ' ' + user.lastName,
                            tooltip: '',
                            selected: false
                        }));
                    }
                    $('#cognism-add-suspects-to-rhythm-popup select[name="select_user"]').append('</optgroup>');
                }
            });
        }

        ll_combo_manager.make_combo('#cognism-add-suspects-to-rhythm-popup select[name="select_user"]');
        ll_combo_manager.set_selected_value('#cognism-add-suspects-to-rhythm-popup select[name="select_user"]', 'owner');
        ll_popup_manager.open('#cognism-add-suspects-to-rhythm-popup');
    },

    load_add_suspects_to_rhythm_initiated_data: function (_callback) {

        var data = {};
        data.object = 'criteria';
        data.action = 'load_add_suspects_to_rhythm_initiated_data';
        $.ajax({
            url: 'll-cognism-criteria-process.php',
            data: data,
            type: 'POST',
            async: false,
            dataType: 'json'
        }).done(function (response) {
            if (response.success) {
                if (typeof _callback != 'undefined' && _callback) {
                    _callback(response);
                }
            }
        });
        /*$.ajax({
            url: 'll-cognism-criteria-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });*/
    },

    delete_process: function (ll_cognism_purchase_process_id, _callback) {

        var data = {};
        data.object = 'process';
        data.action = 'delete';
        data.ll_cognism_purchase_process_id = ll_cognism_purchase_process_id;
        $.ajax({
            url: 'll-cognism-criteria-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    show_success_message(response.message);
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },

    change_process_status: function (ll_cognism_purchase_process_id, status, _callback) {

        var data = {};
        data.object = 'process';
        data.action = 'change_status';
        data.ll_cognism_purchase_process_id = ll_cognism_purchase_process_id;
        data.status = status;
        $.ajax({
            url: 'll-cognism-criteria-process.php',
            data: data,
            type: 'POST',
            async: true,
            dataType: 'json',
            success: function (response) {
                if (response.success) {
                    show_success_message(response.message);
                    if (typeof _callback != 'undefined' && _callback) {
                        _callback(response);
                    }
                }
            },
            error: function (response) {
                show_error_message("Unknown Error");
            }
        });
    },
    open_upload_values_popup: function (select_element, _callback) {

        if (dataSpring_panel_manager.is_upload_values_popup_loaded) {
            $('#upload-values-popup').remove();
        }

        if (select_element) {
            var _html = '';
            _html += '<div class="ll-popup ll-popup-medium" id="upload-values-popup">';
            _html += '  <div class="ll-popup-head">';
            _html += '      Upload Values';
            _html += '  </div>';
            _html += '  <div class="ll-popup-content cognism-upload-values">';
            _html += '	    <div class="wrap-dropzone-contract" style="display: none;">';
            _html += '	    	<div class="dropzone-contract-fade"></div>';
            _html += '	    	<input id="select_values_file" name="file" type="file" multiple style =" display: none;" />';
            _html += '	    	<div class="dropzone-contract" id="dropzone-values">';
            _html += '	    		<a href="javascript:void(0);" class="t-btn-gray dropzone-close"></a>';
            _html += '	    		<div class="dz-default dz-message"><span>Drag &amp; Drop Files</span></div>';
            _html += '	    		</div>';
            _html += '	    </div>';
            _html += '      <div class="form">';
            _html += '          <div class="t-field ll-line-field">';
            _html += '              <div class="label"><label>Values</label></div>';
            _html += '              <textarea class="txt-field txt-field-hiegher txt-field-wide" id="values_list"></textarea> ';
            _html += '         	</div>';
            _html += '      </div>';
            _html += '  </div>';
            _html += '  <div class="ll-popup-footer clearfix">';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray t-btn-left" id="select_values_file_btn">Choose File</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-gray btn_cancel_upload_values_popup">Cancel</a>';
            _html += '      <a href="javascript:void(0);" class="t-btn-orange btn_upload_values_popup">Upload</a>';
            _html += '  </div>';
            _html += '</div>';

            $('#mainWrapper').append(_html);

            // ll_combo_manager.make_combo('#add-import-coupons-popup select');

            $('.btn_upload_values_popup').click(function () {
                if ($('#values_list').val() == '') {
                    show_error_message('Please insert values');
                    return;
                }
                var lines = $('#values_list').val().split(/\n/);
                var unique_values = lines.filter(function (item, pos, self) {
                    return self.indexOf(item) == pos;
                });
                element = select_element.closest('.t-field').find('select');
                $.each(unique_values, function (key, value) {
                    ll_combo_manager.add_option_if_not_exist(element, value, value);
                });
                ll_combo_manager.set_selected_value(element, unique_values);
                ll_popup_manager.close('#upload-values-popup');
            });
            $('#select_values_file_btn').on('click', function () {
                $('#upload-values-popup .wrap-dropzone-contract').show();
            });
            $('#select_values_file').on('change', function () {
                fileobj = document.getElementById('select_values_file').files[0];
                dataSpring_panel_manager.importFile(fileobj);
            });
            $('#dropzone-values .dropzone-close').on('click', function (e) {
                e.stopPropagation();
                e.preventDefault();
                $('.wrap-dropzone-contract').hide();
            });


            $('#dropzone-values').on('click', function (e) {
                $('#select_values_file').click();
            });
            $('#dropzone-values').on('drop', function (e) {
                e.stopPropagation();
                e.preventDefault();
                e.dataTransfer = e.originalEvent.dataTransfer;
                fileobj = e.dataTransfer.files[0];
                dataSpring_panel_manager.importFile(fileobj);
            });
            $("#dropzone-values").on("dragover", function (event) {
                event.preventDefault();
                event.stopPropagation();
            });
            $("#dropzone-values").on("dragleave", function (event) {

            });

            $('.btn_cancel_upload_values_popup').click(function () {
                ll_popup_manager.close('#upload-values-popup');
            });

            dataSpring_panel_manager.is_upload_values_popup_loaded = true;
        }
        ll_popup_manager.open('#upload-values-popup');
    },
    importFile: function (file) {
        try {
            if (file) {
                var r = new FileReader();
                r.onload = e => {
                    try {
                        var contents = $.csv.toArrays((e.target.result));
                        if (contents.length && contents[0].length >= 1) {
                            bulk_invitations_manager.addEntries(contents.slice(1));
                            csvData = contents.slice(1);
                            for (var i in csvData) {
                                $('#values_list').val($('#values_list').val() ? $('#values_list').val() + '\n' + csvData[i] : csvData[i]);
                            }
                        } else {
                            show_error_message('Invalid CSV file. Must be a CSV file type.');
                        }

                    } catch (e) {
                        show_error_message('Invalid CSV file. Must be a CSV file type.');
                    }
                };
                r.readAsBinaryString(file);
            } else {
                show_error_message("Failed to load file");
            }
            $('.wrap-dropzone-contract').hide();
        } catch (e) {
            show_error_message(e.message);
            $('.wrap-dropzone-contract').hide();
        }
    },
}

