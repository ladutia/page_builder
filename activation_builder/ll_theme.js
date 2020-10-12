(function($) {
    $.fn.hasScrollBar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);

jQuery.expr[':'].Contains = function(a, i, m) { 
    return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
};
var ll_theme_manager = {
	scroll_vertical: function(position){
		$('.scrollbar-inner').scrollTop(position);
	},
    init: function(){
        //INPUT CODE
        $(window).load(function(){
        	if($('.wrap-t-tabs').length){
        		$('.fixed-head-section-on').addClass('t-tabs-visible');
        	}
            $('.scrollbar-inner:not(.is-disable-custom-scrollbar)').each(function(){
                $(this).scrollbar({'onInit': function(){
                	correct_grid_size();
                	/*window.setInterval(function(){
                		correct_grid_size();
                	}, 300);*/
                }});
            });

            /*if ($(".nano").length && ( $('.nano-content').length || $('.main-content').length )) {
                if(!$('.nano-content').length) {
                    $('.main-content').addClass('nano-content');
                }
                var margin_top = 0;
                if ($('.wrap-t-tabs').length) {
                    margin_top = $('.wrap-t-tabs').height();
                }
                if ($('.head-gray').length && $('.head-gray').is(':visible')) {
                    margin_top = margin_top + $('.head-gray').height();
                }
                if (margin_top > 0) {
                    $('.nano-content').css('margin-top', margin_top);
                }
                $(".nano:not(.is-disable-custom-scrollbar)").nanoScroller();
            }*/

            if ( $('.nano-content').length && !$('.nano-content').hasClass('is-disable-custom-scrollbar')) {
                if($('.main-page').length) {
                    $('.main-page').addClass('nano');
                }
                if($('.nano').length) {
                    $(".nano").nanoScroller();
                    $(".nano-pane").css("display", "block");
                    $(".nano-slider").css("display", "block");
                }
            }

			if (typeof $.magnificPopup != 'undefined') {
				$('.ll_theme_screenshot_zoom').magnificPopup({
					type: 'image',
					mainClass: 'mfp-with-zoom',
					zoom: {
						enabled: true,
						duration: 300,
						easing: 'ease-in-out',
						opener: function (openerElement) {
							return openerElement.is('img') ? openerElement : openerElement.find('img');
						}
					}
				});
			}
            //$('.objbox, .content-scroll').each(function()
        	/*
            $('.content-scroll:not(.is-disable-custom-scrollbar)').each(function(){
            	$(this).mCustomScrollbar({
                    theme: 'dark-thick',
                    //scrollbarPosition: 'outside',
                    axis: 'y',
                    scrollInertia: 60,
                    callbacks:{
                        onInit:function(){
            				//because when the page contains a grid, after adding the scroll
            				window.setTimeout(function(){ correct_grid_size() }, 100);
            				window.setTimeout(function(){ correct_grid_size() }, 250);
            				window.setTimeout(function(){ correct_grid_size() }, 500);
            				window.setTimeout(function(){ correct_grid_size() }, 1000);
            				window.setTimeout(function(){ correct_grid_size() }, 2000);
                        },
                        onScroll : function(){
                        	$(this).scrollTop(this.mcs.top)
                        	$(this).trigger('scroll')
                        }
                    }
                });
            });
            */
        });
    },
    left_navigate: function(){
    	// If the "Content" menu item of the left menu has only one sub item that is linked to a page, then make the Content menu item itself as the subitem title and make its link pointing to the subitem link and remove the sub menu
		$('li.has_sub_menu[item-name=Content]').each (function (){
			if ($(this).find ('ul.sub-nav').find ('li a').length == 1) {
				var href = $(this).find ('ul.sub-nav').find ('li a').attr ('href')
				var title = $(this).find ('ul.sub-nav').find ('li a').text ()
				if (href && href != '' && href.indexOf ('javascript:void') == -1) {
					$(this).find ('ul.sub-nav').remove ();
					$(this).removeClass ('has_sub_menu');
					$(this).find ('a').attr ('href', href)
					$(this).find ('a span').html (title)
				}
			}
		})
    	
        var doc_loc = document.location.href;
        var doc_loc_uri = doc_loc.substring(doc_loc.lastIndexOf("/") + 1, doc_loc.length);
        $('.nav-admin > li > a').each(function(){
        	var _main_item = $(this)
        	var _href = _main_item.attr('href');
        	if(_href != '' && (doc_loc_uri == _href || doc_loc.indexOf(_href) != '-1')){
        		_main_item.parent().addClass('active');
        		return false;
        	} else {
                var is_found_in_subs = false;
        		_main_item.parent().find('.sub-nav > li > a').each(function(){
                	var _sub_item = $(this)
                	var _href = _sub_item.attr('href');
                	if(doc_loc_uri == _href || doc_loc.indexOf(_href) != '-1'){
                		_main_item.parent().addClass('active').addClass('selected');
                		_sub_item.parent().addClass('active');
                		_sub_item.parents('.sub-nav').show();
                		is_found_in_subs = true;
                		return false;
                	}
                })
                if(is_found_in_subs){
                	return false;
                }
        	}
        })
    },
    heightPage: function(){
        var height = $(window).height() - $('.header-white').outerHeight() - $('#footer').outerHeight() - $('#container_notify_message').outerHeight();
        $('.main-page').height(height);
    },
    nav: function(){
        $('.nav-admin > li > a').on('click', function(){
          var $nav = $(this).parents('.nav-admin');
            if(!$('#ll-fade').is(':visible')) {
                if (!$nav.hasClass('ll-on-search')) {
                    var $li = $(this).parent();
                    var $subNav = $li.find('.sub-nav');
                    $li.addClass('active').siblings('li').removeClass('active');

                    if ($subNav.length) {
                        $('body').removeClass('close-nav-admin');

                        if ($li.hasClass('selected')) {
                            $li.removeClass('selected');
                            $subNav.stop(true, true).slideUp();
                        } else {
                            $li.addClass('selected');
                            $subNav.stop(true, true).slideDown();
                            $li.siblings('li').removeClass('selected').find('.sub-nav').hide();
                        }
                        return false;
                    }
                }
            }
        });
        $('.toggle-nav-admin').on('click', function(){
        	
            ll_theme_manager.toggle_nav_admin(true);
            /*$('body').toggleClass('close-nav-admin');
            correct_grid_size()
            
            var is_collapse = $('body').hasClass('close-nav-admin');

        	var is_collapse_on_load = $(this).attr('is_collapse_on_load')
        	if(typeof is_collapse_on_load != 'undefined' && is_collapse_on_load && is_collapse_on_load == 1){
        		$(this).removeAttr('is_collapse_on_load')
        	} else {
	    		var data = new Object();
	    		data.action = 'save_left_panel_state';
	    		data.is_collapse = is_collapse ? '1' : '0';
	    		$.ajax( {
	    			type :"POST",
	    			dataType :"json",
	    			async :true,
	    			url :"ll-process.php",
	    			data :data,
	    			cache :false,
	    			success : function(response) {
	    			},
	    			error : function() {
	    			}
	    		});
        	}*/
        });
        $('.sub-nav > li > a').on('click', function(){
            var $li = $(this).parent();
            $('.sub-nav > li').removeClass('active');
            $li.addClass('active');
            $li.parents('li').addClass('selected').siblings('li').removeClass('selected');
        });

        $('.nav-admin > li > a').on('mouseenter', function(){
            var $body = $('body');
            if(!$('#ll-fade').is(':visible')) {
                if ($body.hasClass('close-nav-admin')) {
                    /*$('.toggle-nav-admin').trigger('click');*/
                    ll_theme_manager.toggle_nav_admin(false, false);
                    $body.addClass('hover-open-nav');
                }
            }
        });
        $('.wrap-nav-admin').on('mouseleave', function(e){
            var $body = $('body'); 
            
            if ( $body.hasClass('hover-open-nav') ){
                /*$('.toggle-nav-admin').trigger('click');*/
                ll_theme_manager.toggle_nav_admin(false, false);
            }
            
        });
    },
    toggle_nav_admin :function(callAjax, is_correct_grid_size){

        if(!$('#ll-fade').is(':visible')) {

            if (typeof callAjax == 'undefined') {
                callAjax = false;
            }
            if (typeof is_correct_grid_size == 'undefined') {
                is_correct_grid_size = true;
            }

            $('body').toggleClass('close-nav-admin');
            $('body').removeClass('hover-open-nav');

            if (is_correct_grid_size) {
                correct_grid_size()
            }

            var is_collapse = $('body').hasClass('close-nav-admin');

            var is_collapse_on_load = $(this).attr('is_collapse_on_load')
            if (typeof is_collapse_on_load != 'undefined' && is_collapse_on_load && is_collapse_on_load == 1) {
                $(this).removeAttr('is_collapse_on_load')
            } else if (callAjax) {
                var data = new Object();
                data.action = 'save_left_panel_state';
                data.is_collapse = is_collapse ? '1' : '0';
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    async: true,
                    url: "ll-process.php",
                    data: data,
                    cache: false,
                    success: function (response) {
                    },
                    error: function () {
                    }
                });
            }
        }
    },
    lineCriteries:{
        init: function(){
            $('.wrap-line-criteries').each(function(){
                ll_theme_manager.lineCriteries.count($(this));
            });
            ll_theme_manager.lineCriteries.remove();
            ll_theme_manager.lineCriteries.add();
            ll_theme_manager.lineCriteries.addNewField();
        },
        count: function($el){
            var $btnRemove = $el.find('.remove-line-criteries');
            if ( $btnRemove.length > 1 ){
                $el.removeClass('hide-btn-remove');
            } else {
                $el.addClass('hide-btn-remove');
            }
        },
        remove: function(){
            $('.remove-line-criteries').off('click').on('click', function(){
                var $el = $(this).parents('.wrap-line-criteries');
                $(this).parents('.line-criteries').remove();
                
                ll_theme_manager.lineCriteries.count($el);
                
                return false;
            });
        },
        add: function(){
            $('.add-line-criteries').off('click').on('click', function(){
                $(this).parents('.line-criteries').after('<div class="line-criteries">'+
                    '<a href="#" class="add-line-criteries"></a>'+
                    '<a href="#" class="remove-line-criteries"></a>'+
                    '<select style="width: 260px;">'+
                        '<option>Dropdown with search</option>'+
                        '<option>Dropdown with search</option>'+
                        '<option>Dropdown with search</option>'+
                    '</select> '+
                    '<select style="width: 200px;">'+
                        '<option>Dropdown</option>'+
                        '<option>Dropdown</option>'+
                        '<option>Dropdown</option>'+
                    '</select> '+
                    '<input type="text" class="txt-field" placeholder="Input"/> '+
                    '<a href="#" class="t-btn-green t-btn-add-small"></a>'+
                '</div>');
                
                $('select:visible').chosen();
                
                ll_theme_manager.lineCriteries.count($(this).parents('.wrap-line-criteries'));
                ll_theme_manager.lineCriteries.remove();
                ll_theme_manager.lineCriteries.add();
                ll_theme_manager.lineCriteries.addNewField();
                return false;
            });
        },
        addNewField: function(){
            $('.line-criteries .t-btn-add-small').off('click').on('click', function(){
                var $box = $(this).parents('.line-criteries');
                var $btn = $(this).detach();
                $box.append('<div class="ll-field-criteries"><input class="txt-field" placeholder="Input" type="text"> </div>');
                $btn.appendTo($box.find('div:last'));
            });      
        }
    },
    checkboxRadioButtons:{
        init: function(){
            $('.t-checkbox input[type="checkbox"]:not(.disabled), .t-radio input[type="radio"]').on('click', function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this),true);
                //Commenting this line because it is firing the change event one more time. Without it the change event fires only one.
                //When this line uncommented "manage-performance-metrics.php" changing the checkbox status at this page pings the backend twice.
                //$(this).trigger('change');
            });
            $('.t-checkbox input[type="checkbox"], .t-radio input[type="radio"]').each(function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this));
            });
        },
        initiate: function(_selector){
        	$(_selector).on('click', function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this),true);
            });
            $(_selector).each(function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this));
            });
        },
        initiate_container: function(_container_selector){
        	$(_container_selector).find('.t-checkbox input[type="checkbox"], .t-radio input[type="radio"]').on('click', function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this),true);
            });
        	$(_container_selector).find('.t-checkbox input[type="checkbox"], .t-radio input[type="radio"]').each(function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this));
            });
        },
        check: function(_selector, _checked){
        	if(typeof _checked == 'undefined'){
        		_checked = true;
        	}
        	if(_checked){
	        	$(_selector).attr('checked', 'checked');
	        	$(_selector).trigger('change');
	        	
	            var $box = $(_selector).parents('.t-checkbox, .t-radio');
                if($box.length){
                    if(!$box.hasClass('checked')){
    	                $box.addClass('checked');
    	                if ( $(_selector).attr('type') == 'radio' ){
    	                	var radio_name = $(_selector).attr('name');
    	                	if (typeof radio_name != 'undefined' && radio_name){
    		                    $('input[type="radio"][name="' + radio_name + '"]').each(function(){
    		                    	ll_theme_manager.checkboxRadioButtons.isChecked($(this));
    		                    });
    	                	}
    	                }
    	        	}
                }
        	} else {
	        	$(_selector).removeAttr('checked').trigger('change');
	            var $box = $(_selector).parents('.t-checkbox, .t-radio');
    	        if($box.length){
                	if($box.hasClass('checked')){
    	                $box.removeClass('checked');
    	        	}
                }
        	}
        },
        isChecked: function($checkbox, trigger){
            var $box = $($checkbox).parents('.t-checkbox, .t-radio');
            if ( $checkbox.is(':checked') ){
                $box.addClass('checked');
                if ( $checkbox.attr('type') == 'radio' ){
                    if(trigger){
                        $('input[type="radio"]').add(['name="'+$checkbox.attr('name')+'"']).each(function(){
                            ll_theme_manager.checkboxRadioButtons.isChecked($(this));
                        });
                    }
                }
            } else {
                $box.removeClass('checked');
            }
        }
    },
    dateRange: function(){
    	/*
        $('.ll-input-start-date').datepicker();
        $('.ll-input-end-date').datepicker();
        $('.ll-input-start-date').datepicker("setDate",new Date());
        $('.ll-input-end-date').datepicker("setDate",new Date());
        */
        $('.icn-search-date').live('click', function(){
            $(this).next('input').focus();
        });
    },
    tableSort: function(){
        $('.tablesorter').tablesorter({});
    },
    popups:function(){
        $('.ll-show-popup').on('click', function(){
            var idPopup = $(this).attr('data-show-popup');
            $('#ll-fade').fadeIn(300, function(){
                
            });
            $('#'+idPopup).fadeIn(300);
            return false;
        });
        /*
        $('.ll-close-popup').on('click', function(){
            $(this).parents('.ll-popup').hide();
            $('#ll-fade').hide();
            return false;
        });
        */
    },
    dropdownActions: function(_selector){
        _selector = typeof _selector != 'undefined' ? _selector+' ' :'';

        $(_selector+'.t-toggle-btn').on('click', function(e){
            e.stopPropagation();
            $dropdown = $(this).parent();
            
            if ( $dropdown.hasClass('ll-opened') ){
                $dropdown.removeClass('ll-opened');
            } else {
                $('.t-actions-dropdown.ll-opened').removeClass('ll-opened');
                $('.ll-actions-small-dropdown.ll-opened').removeClass('ll-opened');
                $dropdown.addClass('ll-opened');
            }
            return false;
        });
        $(_selector+'.ll-actions-dropdown li a').off('click').on('click', function(){
            $('.t-actions-dropdown.ll-opened').removeClass('ll-opened');
            $('.ll-actions-small-dropdown.ll-opened').removeClass('ll-opened');
            if( $(this).hasClass('ll-show-popup') ){
                var idPopup = $(this).attr('data-show-popup');
                $('#ll-fade').fadeIn(300);
                $('#'+idPopup).fadeIn(300);
            }
            //return false;
        });
        $('body').on('click', function(){
            $('.t-actions-dropdown.ll-opened').removeClass('ll-opened');
            $('.ll-actions-small-dropdown.ll-opened').removeClass('ll-opened');
        });
    },
    toggleBox:{
        init: function(){
            ll_theme_manager.toggleBox.toggleSlide();
            //ll_theme_manager.toggleBox.move();
            //ll_theme_manager.toggleBox.remove();
        },
        toggleSlide: function(){
            $('.toggle-slide-box .tsb-head:not(.donot_collapse)').on('click', function(){
                var $box = $(this).parents('.toggle-slide-box');
                if ($box.hasClass('opened')){
                    $box.find('.tsb-content').slideUp(function(){
                        $box.removeClass('opened');
                        ll_theme_manager.heightPage();
                    });
                } else {
                    $box.find('.tsb-content').slideDown(function(){
                        ll_theme_manager.heightPage();
                    });
                    $box.addClass('opened');
                }
                
            });
        },
        remove: function(){
            $('.t-btn-remove-box').off('click').on('click', function(){
                $(this).parents('.toggle-slide-box').remove();
                ll_theme_manager.heightPage();
                return false;
            });
        },
        move: function(){
            $('.t-btn-move-box').off('click').on('click', function(){
                return false;
            });
            $('.toggle-slide-boxs-sortable').sortable({
                cursor: 'move',
                handle: '.t-btn-move-box',
                tolerance: 'intersect',
                update: function(event, ui) {
                    letterVariant();
                }
            }).disableSelection();
        }
    },
    tabs: function(){
        $('.t-tabs li a').on('click', function(){
            var $tab = $(this).parent();
            $tab.addClass('active').siblings('li').removeClass('active');
            var index = $tab.parent().find('li').index($tab);
            $tab.parents('.wrap-t-tabs').find('.t-tabs-content').removeClass('active').eq(index).addClass('active');
            ll_theme_manager.heightPage();
            //return false;
        });
    },
    showHideElements: function(){
        $('.t-btn-show-hide-element').on('click', function(){
            var id = $(this).attr('data-elemnt-show-hide');
            $('#'+id).toggle();
            return false;
        });
    },
    searchMenu: function(){
        
        $('.search-box-left .txt-field').on('keyup', function(){
            var $nav = $('.nav-admin');
            var searchText = $(this).val();
            if(searchText == ''){
            	$('#footer-theme').show();
            } else {
            	$('#footer-theme').hide();
            }
            $nav.removeClass('ll-on-search');
            $nav.find('li').removeClass('ll-open').hide();
            $nav.find('li a:Contains("'+ searchText +'")').each(function(){
                $nav.addClass('ll-on-search');
                if (searchText != ''){
                    if ( $(this).parents('.sub-nav').length ){
                        $(this).parents('li').addClass('ll-open').show();
                    }
                    $(this).parent().show();
                } else {
                    $nav
                        .removeClass('ll-on-search')
                        .find('li').removeClass('ll-open').show();
                }
                
            });
        });
        /*
        $('.search-box-left .ll-actions-dropdown').find('li a').on('click', function(){
            var text = $(this).text();
            var $link = $('.nav-admin').find('li a:Contains("'+ text +'")');
            var $subNav = $link.parents('.sub-nav');
            
            $('.nav-admin').find('li').removeClass('selected active');
            $link.parent().addClass('active');
            
            if ( $subNav.length ){
                $subNav.parent().children('a').click();
            } else {
                $link.trigger('click');
            }
            
            $('.search-box-left').removeClass('ll-opened');
            
            return false;
        });*/
    },
    apply_scroll: function (_selector){
    	$(_selector).each(function(){
            $(this).scrollbar();
            /*
        	$(this).mCustomScrollbar({
                theme: 'dark-thick',
                axis: 'y',
                scrollInertia: 60,
                callbacks:{
                    onInit:function(){
        				//because when the page contains a grid, after adding the scroll
        				window.setTimeout(function(){ correct_grid_size() }, 100);
        				window.setTimeout(function(){ correct_grid_size() }, 250);
        				window.setTimeout(function(){ correct_grid_size() }, 500);
        				window.setTimeout(function(){ correct_grid_size() }, 1000);
        				window.setTimeout(function(){ correct_grid_size() }, 2000);
                    }
                }
            });
        	*/
        });
    },
    monitor_file_change: function(){
    	$('.t-upload-photo input[type=file]').bind('change', function(){
    		var _selected_file = $(this).val()
    		if(_selected_file == ''){
    			$(this).parents('.t-upload-photo').find('.name-file').html('No files chosen');
    		} else {
    			var _selected_file_parts = _selected_file.split("\\")
    			$(this).parents('.t-upload-photo').find('.name-file').html(_selected_file_parts[_selected_file_parts.length - 1]);
    		}
    	})
    },
    sort_cards: function($container, $cards, sortby, direction){

        switch(sortby){
            case 'name':
            	$cards.sort(function (a, b) {
            		var contentA = $(a).find('h3').text();
            		var contentB = $(b).find('h3').text();
            		if(direction == 'asc'){
            			return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0
            		} else {
            			return (contentA > contentB) ? 1 : (contentA < contentB) ? -1 : 0
            		}
            	})
            	break;
            case 'date':
            	$cards.sort(function (a, b) {
            		var contentA = parseInt( $(a).attr('date'));
            		var contentB = parseInt( $(b).attr('date'));
            		if(direction == 'asc'){
	            		return (contentA > contentB) ? 1 : (contentA < contentB) ? -1 : 0
            		} else {
	            		return (contentA < contentB) ? 1 : (contentA > contentB) ? -1 : 0
            		}
        		})
            	break;
        }
        $cards.detach().appendTo($container);
    },
    get_chart_stats:function(page, date_range, index, _callback){
         
        var data = {};
        data.page = page;
        data.action = 'get_chart_stats_settings';
        $.ajax({
           type: "POST",
           dataType: "json",
           async: true,
           url: "ll-process.php",
           data: data,
           cache: false,
           success: function(data){
                var response = data;
                if(response['success'] == 1){
                    
                    response['data']['expanded'] = 1;

                    if(response['data']['expanded'] == 1){
                        $('div.chart-stats[page='+page+']').addClass('opened');
                        $('div.chart-stats[page='+page+'] div.tsb-content').show();
                        ll_theme_manager.heightPage();
                    }
                    if(response['data']['shown'] == 1){
                        text = 'Hide Stats';
                        $('div.chart-stats[page='+page+']').show();
                        $('#btn-show-hide-chart').addClass('ll-active');
                        ll_tooltip_update('#btn-show-hide-chart','Hide Chart');
                    }

                    /*$('ul.chart-stats[page='+page+']').append('<li><a class="show-hide-chart" href="javascript:void(0)">'+text+'</a></li>').on('click', function () {
                        if($('div.chart-stats[page='+page+']').is(':hidden')){
                            $('div.chart-stats[page='+page+']').show();
                            $('.show-hide-chart').html('Hide Stats');
                        }else{
                            $('div.chart-stats[page='+page+']').hide();
                            $('.show-hide-chart').html('Show Stats');
                        }
                        ll_theme_manager.set_chart_stats(page);
                    });*/
                    if(index || (response['data']['expanded'] == 1 && response['data']['shown'] == 1)){
                        console.log("here");
                    	if(page == 'conversions-report-asset' && typeof smartpage != 'undefined'){
                    		smartpage.render_stats_chart();
                    	} else {
                            $('.layout-two-column').toggleClass('show-column');
                            if(typeof ll_grid_manager != 'undefined'){
                                ll_grid_manager.grid.setSizes();
                            }
                    		chart.chartBoxLoadData(page, date_range, index, _callback);
                    	}
                    }
                }
           }
        });
    },
    set_chart_stats:function(page){
        var shown = expanded = 1;
        if($('div.chart-stats[page='+page+']').is(':hidden')){
            shown = 0;
        }
        if(shown == 1 && expanded == 1){ chart.updateChartWrapWidth();}
        var data = {};
        data.page = page;
        data.shown = shown;
        data.expanded = expanded;
        data.action = 'set_chart_stats_settings';
        $.ajax({
           type: "POST",
           dataType: "json",
           async: true,
           url: "ll-process.php",
           data: data,
           cache: false,
           success: function(data){
                var response = data;
                if(shown == 1 && expanded == 1){
                	if(page == 'conversions-report-asset' && typeof smartpage != 'undefined'){
                		smartpage.render_stats_chart();
                	} else {
                		chart.chartBoxLoadData(page);
                	}
                }
           }
        });
    },
	zoom_screenshot: function(src){
		$('.ll_theme_screenshot_zoom').css('display', 'inline-block').attr('href', src).html('<img src="'+ src +'" alt=""/>');
		$('.ll_theme_screenshot_zoom').trigger('click');
	}
};
var ll_svgs_manager = {
	attr_identifier: 'data-svg-id',
	jXML: '',
	initiate: function(){
	    $.ajax({
	  	  url: 'imgs/images-svgs.xml?version=2018-10-08-1419',
	  	  dataType: 'text',
	  	  success: function(xml){
	  		var jXML = $($.parseXML(xml));
	  		
	  		ll_svgs_manager.jXML = jXML;
	  		$('[' + ll_svgs_manager.attr_identifier + ']').each(function(){
	  			$(this).replaceWith($(ll_svgs_manager.jXML).find('svg').filter('#'+$(this).attr(ll_svgs_manager.attr_identifier)).clone());
	  			//$(this).replaceWith(jXML.getElementById($(this).attr('data-svg-id')).cloneNode(true));
	  		});
	  		
	  	  }
	  	});
	},
	update: function(_selector){
  		$(_selector).find('[' + ll_svgs_manager.attr_identifier + ']').each(function(){
  			$(this).replaceWith($(ll_svgs_manager.jXML).find('svg').filter('#'+$(this).attr(ll_svgs_manager.attr_identifier)).clone());
  			//$(this).replaceWith(jXML.getElementById($(this).attr('data-svg-id')).cloneNode(true));
  		});
	}
};
function correct_grid_size(){
	if(typeof smartpage != 'undefined'){
		if(typeof smartpage.grid != 'undefined' && smartpage.grid){
			smartpage.grid.setSizes()
		}
		if(typeof smartpage.grid_messages != 'undefined' && smartpage.grid_messages){
			smartpage.grid_messages.setSizes()
		}
		if(typeof smartpage.grid_distributed_leads_overview != 'undefined' && smartpage.grid_distributed_leads_overview){
			smartpage.grid_distributed_leads_overview.setSizes()
		}
		if(typeof smartpage.grid_distributed_leads_details != 'undefined' && smartpage.grid_distributed_leads_details){
			smartpage.grid_distributed_leads_details.setSizes()
		}
		if(typeof smartpage.grid_memberships != 'undefined' && smartpage.grid_memberships){
			smartpage.grid_memberships.setSizes()
		}
		if(typeof smartpage.grid_statistics != 'undefined' && smartpage.grid_statistics){
			smartpage.grid_statistics.setSizes()
		}
	}

	if(typeof page != 'undefined'){
		if(typeof page.grid != 'undefined' && page.grid){
			page.grid.setSizes()
		}
	}
	if(typeof users_info_grid != 'undefined'){
		if(typeof users_info_grid.grid != 'undefined' && users_info_grid.grid){
			users_info_grid.grid.setSizes()
		}
	}
	if(typeof preview_grid != 'undefined'){
		if(typeof preview_grid.grid != 'undefined' && preview_grid.grid){
			preview_grid.grid.setSizes()
		}
	}
	if(typeof manage_favorite_rules != 'undefined'){
		if(typeof manage_favorite_rules.grid_favorite_rules != 'undefined' && manage_favorite_rules.grid_favorite_rules){
			manage_favorite_rules.grid_favorite_rules.setSizes()
		}
	}
	if(typeof manage_buy_signals_results != 'undefined'){
		if(typeof manage_buy_signals_results.grid_buy_signals_results != 'undefined' && manage_buy_signals_results.grid_buy_signals_results){
			manage_buy_signals_results.grid_buy_signals_results.setSizes()
		}
	}
	if(typeof manage_favorite_results != 'undefined'){
		if(typeof manage_favorite_results.grid_favorites_results != 'undefined' && manage_favorite_results.grid_favorites_results){
			manage_favorite_results.grid_favorites_results.setSizes()
		}
	}
	if(typeof manage_hopper != 'undefined'){
		if(typeof manage_hopper.grid != 'undefined' && manage_hopper.grid){
			manage_hopper.grid.setSizes()
		}
	}
    if(typeof sales_folders_smartpage != 'undefined') {
        if (typeof sales_folders_smartpage.grid != 'undefined' && sales_folders_smartpage.grid) {
            sales_folders_smartpage.grid.setSizes()
        }
    }
    if(typeof schedules_smartpage != 'undefined') {
        if (typeof schedules_smartpage.grid != 'undefined' && schedules_smartpage.grid) {
            schedules_smartpage.grid.setSizes()
        }
    }
    if(typeof signatures_smartpage != 'undefined') {
        if (typeof signatures_smartpage.grid != 'undefined' && signatures_smartpage.grid) {
            signatures_smartpage.grid.setSizes()
        }
    }

    if(typeof named_accounts_smartpage != 'undefined') {
        if (typeof named_accounts_smartpage.grid != 'undefined' && named_accounts_smartpage.grid) {
            named_accounts_smartpage.grid.setSizes()
        }
    }

    if(typeof events_map_table != 'undefined') {
        if (typeof events_map_table.grid != 'undefined' && events_map_table.grid) {
            events_map_table.grid.setSizes()
        }
    }

    if(typeof manager_webhook_handlers != 'undefined') {
        if (typeof manager_webhook_handlers.grid != 'undefined' && manager_webhook_handlers.grid) {
            manager_webhook_handlers.grid.setSizes()
        }
    }

    if(typeof manager_webhook_handlers_logs != 'undefined') {
        if (typeof manager_webhook_handlers_logs.grid != 'undefined' && manager_webhook_handlers_logs.grid) {
            manager_webhook_handlers_logs.grid.setSizes()
        }
    }
}
if (typeof ll_external_page_applying_theme == 'undefined' || !ll_external_page_applying_theme) {
	$(document).ready(function() {
	    ll_theme_manager.init();
	    
	    ll_theme_manager.heightPage();
	    ll_theme_manager.nav();
	    //ll_theme_manager.lineCriteries.init();
	    ll_theme_manager.checkboxRadioButtons.init();
	    ll_theme_manager.dateRange();
	    if ($('.tablesorter').length)
	        ll_theme_manager.tableSort();
	    ll_theme_manager.tableSort();
	    ll_theme_manager.popups();
	    ll_theme_manager.dropdownActions();
	    ll_theme_manager.toggleBox.init();
	    ll_theme_manager.tabs();
	    ll_theme_manager.showHideElements();
	    ll_theme_manager.searchMenu();
	    ll_theme_manager.monitor_file_change();
	    
	    $(window).resize(function(){
	        ll_theme_manager.heightPage();
	    });
	    ll_theme_manager.left_navigate();
	    ll_svgs_manager.initiate();
	});
}
function process_convert_grid_master_checkboxes(_grid){
    if(typeof _grid.is_done_processing_grid_master_checkboxes == 'undefined'){
    	_grid.is_done_processing_grid_master_checkboxes = true;
    	$(_grid.entBox).find('.hdrcell input[type=checkbox]').each(function(){
    		$(this).parent().addClass('t-checkbox');
    		$(this).addClass('ll-original-master-checkbox');
    		$(this).hide();
    		$(this).parent().append('<label><i class="icn-checkbox"></i><input type="checkbox" class="ll-custom-master-checkbox" /> </label>');
    		

    		$(this).parent().find('.ll-custom-master-checkbox').on('click', function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this),true);
                $(this).trigger('change');

                var _checked = $(this).parents('.hdrcell').find('.ll-custom-master-checkbox').attr('checked')
                
                $(this).parents('.hdrcell').find('.ll-original-master-checkbox').attr('checked', _checked)
                $(this).parents('.hdrcell').find('.ll-original-master-checkbox').trigger('click');
            });
    		$(this).parent().find('.ll-custom-checkbox').each(function(){
                ll_theme_manager.checkboxRadioButtons.isChecked($(this));
            });
    	})
    }
}