jQuery.expr[':'].Contains = function(a, i, m) { 
	return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
};
var deal_management = {
    init: function(){
        $('body').on('click', function(e){
			if ( !$(e.target).parent().hasClass('dropdown-action-custom') && !$(e.target).parents('.dropdown-action-custom').length ){
				$('.dropdown-action-custom.open').removeClass('open');
			}

			if ( $('.show-edit-owner').length ){
				deal_management.updateOwnerDeal($('#deal-owner-select'));
			}
			
		});
		$('.slide-task .sld-head').on('click', function(){
			var $box = $(this).parent();
			$box.find('.sld-content').slideToggle(function(){
				$box.toggleClass('open');
			});
		});
    },
	dropDownActionCustom: function(){
		$('#deal-actions > a').on('click', function(e){
			e.preventDefault();
			$(this).parents('.dropdown-action-custom').toggleClass('open');
		});
		$('#deal-actions .drop-list > ul li').on('click', function(e){
			e.preventDefault();
			e.stopPropagation();
			var idx = $(this).attr('idx');
			
			if ( idx == '0' ){
				deal_management.sortableDeal('task');
			} else if ( idx == '1' ){
				deal_management.sortableDeal('amount');
			} else if ( idx == '2' ){
				deal_management.sortableDeal('date');
			} else if ( idx == '3' ){
				$('.wrap-deals-content').toggleClass('show-date');
				if ( $('.wrap-deals-content').hasClass('show-date') ){
					$(this).text('Hide Close Date');
				} else{
					$(this).text('Show Close Date');
				}
			} else if ( idx == '5' ){
				$('.pipeline-power').addClass('open').show().animate({
						right: '0px'
					}, 500);
				}
			$(this).parents('.dropdown-action-custom').removeClass('open');
		});
	},
	pipilenePower:{
		init: function(){
			this.automationTabInit();
			this.textEditor();
			$('.close-pipeline').on('click', function(e){
				e.preventDefault();
				$('.pipeline-power').animate({
					right: '-521px'
				}, 500, function(){
					$('.pipeline-power').removeClass('open').hide();
				});
			});
			$('.tabs-pipeline > ul > li a').on('click', function(e){
				e.preventDefault();
				var $tabs = $(this).parents('.tabs-pipeline');
				var index = $(this).parents('ul').find('li').index($(this).parent());
				
				$(this).parent().addClass('selected').siblings('li').removeClass('selected');
				$tabs.find('.tab-content').removeClass('selected').eq(index).addClass('selected');
			});
		},
		automationTabInit: function(){
			var self = this;
			$('.pipeline-power').on('click', '.automation-box .add-line', function(e){
				e.preventDefault();
				$(this).parent().after('<div class="automation-box">'+
										'<select>'+
											'<option>Automation #1</option>'+
											'<option>Automation #2</option>'+
											'<option>Automation #3</option>'+
										'</select>'+
										'<a href="#" class="add-line"></a>'+
										'<a href="#" class="remove-line"></a>'+
									'</div>');
				$('.wrap-automation').find('select:visible').chosen();
				self.automationIsRemove();
			});
			$('.pipeline-power').on('click', '.automation-box .remove-line:not(.disabled)', function(e){
				e.preventDefault();
				$(this).parent().remove();
				self.automationIsRemove();
			});
		},
		automationIsRemove: function(){
			var $box = $('.wrap-automation');
			var count = $('.wrap-automation .automation-box').length;
			
			if (count > 1){
				$box.find('.remove-line').removeClass('disabled');
			} else {
				$box.find('.remove-line').addClass('disabled');
			}
		},
		textEditor: function(){
			tinymce.init({
				autoresize_min_height: 120,
				autoresize_max_height: 300,
				selector: "#pipeline-editor-content, #pipeline-editor-notifications",
				plugins: "image textcolor table save contextmenu link autoresize",
				auto_reset_designmode:true,
				forced_root_block : "", 
				force_br_newlines : true,
				force_p_newlines : false,
				toolbar_items_size: 'small',
				entity_encoding : "raw",
				toolbar: [
						"styleselect | bold italic underline strikethrough | forecolor | bullist numlist",
				],
				theme_advanced_resizing : true,
				theme_advanced_statusbar_location : 'bottom',
				theme_advanced_resize_horizontal : false, 
				menubar: false,
				statusbar: false,
				autoresize_bottom_margin : 0
			});
		}
	},
	heightDeal: function(){
		var height = $('body').outerHeight() - $('.wrap-deals-header').offset().top;// - $('.drop-deal:visible').outerHeight();
		var heightHead = $('.wrap-deals-header').outerHeight();
		$('.wrap-deals-content .col:first .col-content').css('min-height', height - heightHead - $('.drop-deal:visible').outerHeight());
		$('.deals-scroll').css('height', height); //+ parseInt($('.wrap-deals').find('.scroll-content').css('margin-bottom')) * (-1)
	},
	widgetsDealSortable: function(){
		$(".wrap-widget-deal").sortable('destroy');
		$(".wrap-widget-deal, .deal-trash, .deal-lost, .deal-won").sortable({
			revert: "valid",
			placeholder: "li-placeholder",
			items: "li:not(.ui-disabled)",
			tolerance: "pointer",
			scroll: true,
			appendTo: '.main-content',
			connectWith: ".wrap-widget-deal, .deal-trash, .deal-lost, .deal-won",
			deactivate: function(event, ui) {
				
			},
			start: function(event, ui) {
				if ( $('.wrap-deals-content').hasClass('small-deals') ){
					ui.helper.css({
						width: $(".wrap-widget-deal").width()/2
					});
				}
				$('.wrap-deals-content').addClass('sort-start-deal');
				deal_management.heightDeal();
			},
			stop: function(event, ui) {
				$('.wrap-deals-content').removeClass('sort-start-deal');
				deal_management.heightDeal();
				deal_management.updateColumnDeal();
			},
		});
	},

	dealDrop: function(){
		$('.drop-deal').find('.deal-trash, .deal-lost, .deal-won, .wrap-widget-deal').droppable({
			hoverClass: 'selected',
			drop: function( event, ui ) {
				var $box = $(this);
				
				if ( $box.hasClass('deal-trash') ){
					console.log('TRASH')
				} else if ( $box.hasClass('deal-lost') ){
					console.log('LOST')
				} else {
					console.log('WON')
				}
				
				setTimeout(function(){
					$('.wrap-widget-deal').removeClass('hide-placeholder');
				}, 1000);
				
				ui.draggable.remove();
				$('.wrap-deals-content').removeClass('sort-start-deal');
				deal_management.heightDeal();
				deal_management.updateColumnDeal();
			},
			over: function(event, ui) {
				ui.draggable.addClass('selected');
				$('.wrap-widget-deal').addClass('hide-placeholder');
			},
			out: function(event, ui) {
				$('.wrap-widget-deal').removeClass('hide-placeholder');
				if ( !$('.deal-trash, .deal-lost, .deal-won').hasClass('selected') ){
					ui.draggable.removeClass('selected');
				}
			}
		});
	},
	updateColumnDeal: function(){
		var allTotal = 0;
		var countDeal = 0;
		var $boxCountDeal = $('.count-deals');
		var $boxTotalDeal = $('.all-total-deals');
		
		if ( $('.deal-mng-table').length ){
			var $table = $('.deal-mng-table');
			
			$table.find('.amount').each(function(){
				countDeal++;
				var str = $(this).find('.t-edit').text();
				allTotal +=  Number(str.replace(/\D+/g,""));
			});
		} else{
			$('.wrap-deals-content .col').each(function(){
				var $col = $(this);
				var index = $col.parent().find('.col').index($col);
				var $box = $col.find('.deal-box');
				var count = $box.length;
				var $totalBox = $('.wrap-deals-header').find('.col').eq(index).find('.t-total');
				var total = 0;
				
				countDeal += count;
				
				if (count > 0){
					$('.wrap-deals-header').find('.col').eq(index).find('.col-head .count').text('('+ count +')');
					$box.each(function(){
						var str = $(this).find('.amount').text();
						total +=  Number(str.replace(/\D+/g,""));
					});
					$totalBox.removeClass('hide').text('$' + total);
				} else {
					$col.find('.col-head .count').text('');
					$totalBox.addClass('hide');
				}
				allTotal += total;
			});
		}
		
		
		
		$boxCountDeal.text(countDeal);
		$boxTotalDeal.text(allTotal);
		
	},
	sortableDeal: function(sort){
		$('.col-content').each(function(){
			var $elements = $(this).find('.wrap-widget-deal li');
			var $target = $(this).find('.wrap-widget-deal');
			
			$elements.sort(function (a, b) {
				if (sort == 'task'){
					var an = $(a).find('.title > a').text(),
						bn = $(b).find('.title > a').text();
				} else if (sort == 'amount'){
					var an = Number($(a).find('.amount .t-edit').text().replace(/\D+/g,"")),
						bn = Number($(b).find('.amount .t-edit').text().replace(/\D+/g,""));
				} else if (sort == 'date') {
					var an = $(a).find('.date .t-edit').text(),
						bn = $(b).find('.date .t-edit').text();
				}

				if (an && bn) {
					if (sort == 'amount'){
						if (an < bn) return -1;
						if (an > bn) return 1;
					} else {
						return an.toUpperCase().localeCompare(bn.toUpperCase());
					}
				}
				return 0;
			});
			
			$elements.detach().appendTo($target);
		});	
	},
	editAmountDeal: function(){
		$('.deal-management').on('click', '.deal-box .amount .t-edit, .deal-mng-table .amount .t-edit', function(e){
			var $this = $(this);
			var amount = $this.text();
			var html = '<div class="t-field-edit"><input type="text" class="txt-field" value="'+amount+'"/></div>';
			
			$this.hide();
			$this.parent().append(html);
			$this.parent().find('input').focus();
		});
		$('.deal-management').on('blur', '.deal-box .amount .t-field-edit input, .deal-mng-table .amount .t-field-edit input', function(e){
			var $this = $(this);
			var $box = $this.parents('.amount');
			var amount = $this.val();
			
			if (amount == '') amount = '$0';

			$box.find('.t-field-edit').remove();
			$box.find('.t-edit').text(amount).show();
			deal_management.updateColumnDeal();
		});
		$('.deal-management').on('keyup', '.deal-box .amount .t-field-edit input, .deal-mng-table .amount .t-field-edit input', function(e){
			if(e.keyCode == 13){
				$(this).trigger('blur');
			}
		});
	},
	editDateDeal: function(){
		$('.deal-management').on('click', '.deal-box .date .t-edit, .deal-mng-table .date .t-edit', function(e){
			var $this = $(this);
			var date = $this.text();
			var html = '<div class="t-field-edit"><input type="text" class="txt-field" value="'+date+'"/></div>';
			
			$this.hide();
			$this.parent().append(html);
			$this.parent().find('input').datetimepicker({
				timepicker:false,
				format:'m/d/Y',
				onClose:  function(dateText, $input){
					var $box = $($input).parents('.date');
					dateText = $box.find('.t-field-edit .txt-field').val();
					$box.find('.t-field-edit').remove();
					$box.find('.t-edit').text(dateText);
					$box.find('.t-edit').show();
				}
			}).focus();
		});
	},
	showMoreTableDeals: function(){
		$('.table-show-more > a').on('click', function(){
			var obj = {
			  "0": "",
			  "1": "",
			  "2": "",
			  "3": "",
			  "4": ""
			}
			$.each(obj, function( index, value ) {
			  var content = '<tr>'+
								'<td>'+
									'<div class="user-box">'+
										'<a href="#" class="ava"><img src="imgs/ava_50_1.png"/></a>'+
										'<span class="name"><a href="#">Jamie Sanders</a></span>'+
									'</div>'+
								'</td>'+
								'<td><a href="#" target="_blank">Motorola</a></td>'+
								'<td><a href="#" target="_blank">LMA Annual Subscription</a></td>'+
								'<td class="txt-right">'+
									'<span class="green-t">'+
										'<span class="amount"><span class="t-edit">$5700</span></span>'+
									'</span>'+
								'</td>'+
								'<td class="txt-right">Research</td>'+
								'<td class="txt-right"><span class="red-t"><span class="date"><span class="t-edit">03/04/2016</span></span></span></td>'+
							'</tr>';
				$('.deal-mng-table').find('tbody').append(content);
			});
			
		});
	},
	hideHint: function(){
		setTimeout(function(){
			$('.tooltip-help').fadeOut('slow');
		}, 4000);

		$('.tooltip-help-close').on('click', function(e){
			e.stopPropagation();
			e.preventDefault();
			$('.tooltip-help').fadeOut('slow');
		});
	},
	editNameDeal: function(){
		$('.edit-name-deal .pencil').on('click', function(){
			var $this = $(this).prev('a');
			var $wrap = $this.parents('.edit-name-deal');
			var val = $this.text();
			var html = '<div class="t-field-edit"><input type="text" class="txt-field" value="'+val+'"/></div>';
			
			$wrap.parents('.title').addClass('show-edit-field');
			$wrap.append(html);
			$wrap.find('.txt-field').focus();
		});
		$('.edit-name-deal').on('blur', '.txt-field', function(){
			var $el = $(this);
			var val = $el.val();
			var $wrap = $el.parents('.edit-name-deal');

			$wrap.find('.t-field-edit').remove();
			$wrap.parents('.title').removeClass('show-edit-field');
			$wrap.find('a').text(val);
		});
		$('.edit-name-deal').on('keyup', '.txt-field', function(e){
			if(e.keyCode == 13){
				$(this).trigger('blur');
			}
		});
	},
	editOwnerDeal: function(){
		$('.deal-management').on('click', '.deal-box .name .t-edit-owner,', function(e){
			e.preventDefault();
			e.stopPropagation();
			var $this = $(this);
			var amount = $this.text();
			var html = '<div class="wrap-select"><select id="deal-owner-select"><option>Chris Eklund</option><option>Name 2</option><option>Name 3</option></select></div>';
			
			$this.hide();
			$this.parent().append(html);
			$this.parent().addClass('show-edit-owner').find('select').chosen();
			$('#deal-owner-select').change(function(){
				deal_management.updateOwnerDeal( $('#deal-owner-select') );
			});
		});
		$('.deal-management').on('click', '.show-edit-owner', function(e){
			e.stopPropagation();
		});
	},

	updateOwnerDeal: function($el){
		var val = $el.val();
		var $wrap = $el.parents('.show-edit-owner');
		$wrap.find('.wrap-select').remove();
		$wrap.find('.t-edit-owner').show().text(val);
		$wrap.removeClass('show-edit-owner');
		console.log(val);
	},
	setCountColumnDeals: function(){
		var $box = $('.wrap-deals');
		var $boxContent = $('.wrap-deals-content');
		var count = $boxContent.find('.col').length;

		$box.removeClass('deals-2 deals-3 deals-4 deals-5 deals-6 deals-7 deals-8 deals-9 deals-10');

		if (count > 9)
			$box.addClass('deals-more');
		else
			$box.addClass('deals-' + count);
	},
	setSmallDealsFull: function(){
		var $box = $('.wrap-deals-content');
		var $boxs = $('.wrap-deals');
		var countDealsColumn = $box.find('.col').length;

		var queryMaxWidth1149 = Modernizr.mq('(max-width: 1149px)');
		var queryMaxWidth1399 = Modernizr.mq('(max-width: 1399px)');
		var queryMaxWidth1649 = Modernizr.mq('(max-width: 1649px)');

		if (countDealsColumn > 5 && queryMaxWidth1399) {
		   	$boxs.addClass('small-deals-full');
		} else if (countDealsColumn > 7 && queryMaxWidth1649) {
			$boxs.addClass('small-deals-full');
		} else if (countDealsColumn > 8) {
			$boxs.addClass('small-deals-full');
		} else if (queryMaxWidth1149){
			$boxs.addClass('small-deals-full');
		} else {
			$boxs.removeClass('small-deals-full');
		}
		deal_management.heightDeal();
	},
	scrollLoadDeals: function(){
		$('.deals-scroll').scroll(function(){
 
			var position = $('.deals-scroll').scrollTop();
			var bottom = $('.wrap-deals-content').height() + $('.wrap-deals-header').height() - $('.deals-scroll').height();

			if( position == bottom ){
				var row = Number($('.wrap-deals-content').attr('data-row'));
				var allcount = Number($('.wrap-deals-content').attr('data-row-all'));
				var rowperpage = 10;
				var $loading = $('.loading-more-deals');
				
				row = row + rowperpage;

				if(row <= allcount){
					$('.wrap-deals-content').attr('data-row', row);
					$loading.show();
					/*$.ajax({
						url: '',
						type: 'post',
						data: {row:row},
						success: function(response){
							response = '<li class="widget-deal clearfix"><div class="deal-box"><div class="line-red"></div><a href="#" class="btn-task ll-show-popup" data-show-popup="popup-deal-mng-add-tasks">Today</a><div class="title"><div class="edit-name-deal"><a href="#" target="_blank">LMA Annual Subscription</a><div class="pencil"><svg width="12px" height="13px" viewBox="0 0 12 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Account-page" transform="translate(-1045.000000, -950.000000)" fill="#333333"><g id="Group-31" transform="translate(417.000000, 771.000000)"><g id="Group" transform="translate(23.000000, 81.000000)"><g id="Line-text" transform="translate(0.000000, 81.523810)"><g id="Group-2" transform="translate(564.000000, 10.000000)"><g id="Group-21"><g id="Group-22" transform="translate(34.000000, 0.000000)"><g id="edit" transform="translate(6.933333, 6.933333)"><path d="M2.36629304,7.88602956 L1.75635836,9.96388429 L2.1694882,10.3770141 L4.16020661,9.79273193 L9.07842963,4.87894815 L9.73767407,5.53819259 L4.58557722,10.5671759 L4.58936463,10.5800801 L1.06171031,11.6154579 L0.291916192,11.8413949 L0.51787972,11.0716085 L1.5532575,7.54440361 L1.57270403,7.55011196 L6.63918025,2.44014815 L7.22832099,3.02839012 L2.36629304,7.88602956 L2.36629304,7.88602956 Z M2.77493827,8.46277531 L3.49260247,8.62365432 L3.59596049,9.28334815 L8.53647407,4.3473284 L7.71590123,3.52585679 L2.77493827,8.46277531 L2.77493827,8.46277531 Z M10.1857086,5.04611852 L7.08721481,1.94762469 L7.79634074,1.28298765 L10.8943852,4.38148148 L10.1857086,5.04611852 L10.1857086,5.04611852 Z M11.2619802,3.84132346 L8.29290864,0.871802469 L8.74858272,0.411185185 C9.15392593,0.00584197531 9.8149679,0.00898765432 10.2248049,0.419274074 L11.7100148,1.90403457 C12.1198519,2.31432099 12.1234469,2.97536296 11.7181037,3.38070617 L11.2619802,3.84132346 L11.2619802,3.84132346 Z" id="Combined-Shape"></path></g></g></g></g></g></g></g></g></g></svg></div></div></div><div class="inf"><a href="#" class="ava"><img src="imgs/ava_70.png"/></a><div class="inf-content"><div class="amount"><span class="t-edit">$5700</span></div><div class="date"><span class="t-edit">12/21/2015</span></div><div class="company"><a href="#" target="_blank">Motorola</a></div><div class="name"><span class="t-edit-owner">Chris Eklund</span></div></div></div></div></li>';
							$(".wrap-widget-deal:last").append(response).show().fadeIn("slow");
						}
					});*/

					setTimeout(function(){
						var response = '<li class="widget-deal clearfix widget-deal--loading"><div class="deal-box"><div class="line-red"></div><a href="#" class="btn-task ll-show-popup" data-show-popup="popup-deal-mng-add-tasks">Today</a><div class="title"><div class="edit-name-deal"><a href="#" target="_blank">LMA Annual Subscription</a><div class="pencil"><svg width="12px" height="13px" viewBox="0 0 12 13" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Account-page" transform="translate(-1045.000000, -950.000000)" fill="#333333"><g id="Group-31" transform="translate(417.000000, 771.000000)"><g id="Group" transform="translate(23.000000, 81.000000)"><g id="Line-text" transform="translate(0.000000, 81.523810)"><g id="Group-2" transform="translate(564.000000, 10.000000)"><g id="Group-21"><g id="Group-22" transform="translate(34.000000, 0.000000)"><g id="edit" transform="translate(6.933333, 6.933333)"><path d="M2.36629304,7.88602956 L1.75635836,9.96388429 L2.1694882,10.3770141 L4.16020661,9.79273193 L9.07842963,4.87894815 L9.73767407,5.53819259 L4.58557722,10.5671759 L4.58936463,10.5800801 L1.06171031,11.6154579 L0.291916192,11.8413949 L0.51787972,11.0716085 L1.5532575,7.54440361 L1.57270403,7.55011196 L6.63918025,2.44014815 L7.22832099,3.02839012 L2.36629304,7.88602956 L2.36629304,7.88602956 Z M2.77493827,8.46277531 L3.49260247,8.62365432 L3.59596049,9.28334815 L8.53647407,4.3473284 L7.71590123,3.52585679 L2.77493827,8.46277531 L2.77493827,8.46277531 Z M10.1857086,5.04611852 L7.08721481,1.94762469 L7.79634074,1.28298765 L10.8943852,4.38148148 L10.1857086,5.04611852 L10.1857086,5.04611852 Z M11.2619802,3.84132346 L8.29290864,0.871802469 L8.74858272,0.411185185 C9.15392593,0.00584197531 9.8149679,0.00898765432 10.2248049,0.419274074 L11.7100148,1.90403457 C12.1198519,2.31432099 12.1234469,2.97536296 11.7181037,3.38070617 L11.2619802,3.84132346 L11.2619802,3.84132346 Z" id="Combined-Shape"></path></g></g></g></g></g></g></g></g></g></svg></div></div></div><div class="inf"><a href="#" class="ava"><img src="imgs/ava_70.png"/></a><div class="inf-content"><div class="amount"><span class="t-edit">$5700</span></div><div class="date"><span class="t-edit">12/21/2015</span></div><div class="company"><a href="#" target="_blank">Motorola</a></div><div class="name"><span class="t-edit-owner">Chris Eklund</span></div></div></div></div></li>';
						

						$('.loading-more-deals').hide();

						for (var i = 0; i < 10; i++){
							$(".wrap-widget-deal").eq(3).append(response);
							$('.widget-deal--loading').animate({'opacity': '1'}, 2500, function(){
								$(this).removeClass('widget-deal--loading');
							});
							
						}

					}, 600);	
				}
			}

	 	});
	}
};
$(document).ready(function() {
    deal_management.init();
	deal_management.dropDownActionCustom();
	deal_management.pipilenePower.init();
	if( $('.wrap-deals-content').length )
		deal_management.heightDeal();
	deal_management.widgetsDealSortable();
	deal_management.dealDrop();
	deal_management.updateColumnDeal();
	deal_management.editAmountDeal();
	deal_management.editDateDeal();
	deal_management.showMoreTableDeals();
	
	$(window).resize(function(){
		if( $('.wrap-deals-content').length )
			deal_management.setSmallDealsFull();
	});

	if ($('.scrollbar-inner.individual-scroll').length){
        $('.scrollbar-inner.individual-scroll').scrollbar({
        	"showArrows": true,
        	"scrollx": "advanced",
        	"scrolly": "advanced"
        });
    }

    deal_management.hideHint();
    deal_management.editNameDeal();
    deal_management.editOwnerDeal();
    deal_management.setCountColumnDeals();
    deal_management.setSmallDealsFull();
    deal_management.scrollLoadDeals();
});