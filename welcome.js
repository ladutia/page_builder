jQuery.expr[':'].Contains = function(a, i, m) { 
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
	};
var ws = {
    init: function(){
		$('.toggle-show-hide-logo').change(function() {
			var $toggle = $(this);
			var $box = $('.unsb-logo');
			
			if ( $toggle.prop('checked') ){
				$box.show();
			} else{
				$box.hide();
			}
		});
		
		if( $('.ws-slider-visitors').length )
			ws.initSlider($('.ws-slider-visitors'));

		/*if( $('.ws-slider-visitors').length ){
			$('.ws-slider-visitors').bxSlider({        
	            infiniteLoop: true,    
	            pager: false,
	            useCSS: true,
	            slideMargin: 20,
	            infiniteLoop: true,
	            minSlides: 10,
	            maxSlides: 10,
	            moveSlides: 5,
	            slideWidth: 80,
			});
		}*/

		$('.er-events-checkboxes').on('change', 'input', function () {
            var $this = $(this);
            var idx = $this.attr('idx');

            if ($this.prop('checked'))
                ws.showEvent(idx);
            else
                ws.hideEvent(idx);

            ws.countEvent();
        });

        ws.countEvent();
		
	},
	countEvent: function(){
		var count = $('.list-inf-events .list-inf-item:visible').length;

        $('.list-inf-events').removeClass('list-count-events-1 list-count-events-2 list-count-events-3 list-count-events-4 list-count-events-5 list-count-events-6 list-count-events-7 list-count-events-8 list-count-events-more')
    	
    	if(count < 9)
    		$('.list-inf-events').addClass('list-count-events-' + count);
    	else
    		$('.list-inf-events').addClass('list-count-events-more');
	},
	showEvent: function(idx){
		$('.list-inf-events').find('.list-inf-item[idx="' + idx + '"]').show();
	},
	hideEvent: function(idx){
		$('.list-inf-events').find('.list-inf-item[idx="' + idx + '"]').hide();
	},
	updateCharts: function($box){
        if( $box.length ){
            $box.find('div[data-highcharts-chart]').each(function(){
                $(this).highcharts().reflow();
            });
        }
    },
	videoSearchInit: function(){
		$('.ws-video-search .txt-field').on('keyup', function(){
			ws.videoSearch();
		});
		$('.ws-list-video .btn-load-more-video').on('click', function(e){
			e.preventDefault();
			ws.showMoreVideo();
			ws.showMoreVideo();
			ws.showMoreVideo();
			ws.showMoreVideo();
			ws.showMoreVideo();
			ws.showMoreVideo();
		});
		ws.videoSearch();
		$('.ws-video-back').on('click', function(){
			$('.ws-list-video').hide();
			$('.ws-one-video').show();
			$('.ws-video-search .t-field .txt-field').val('');
			$('.ws-filter-video option:eq(0)').attr('selected', true);
            $('.ws-filter-video').trigger('liszt:updated');
		});
	},
	videoSearch: function(){
		var countShowVideo = 0;
		var $fieldSearch = $('.ws-video-search .txt-field');
		var val = $fieldSearch.val();
		
		$('.ws-list-video-items').find('.ws-wrap-mini-box').hide();
		if ( val != '' ){
			$('.ws-list-video-items').find('.mini_box_gray .header h3:Contains("'+ val +'")').each(function(){
				$(this).parents('.ws-wrap-mini-box').show();
				countShowVideo++;
			});
		}
		ws.videoStatus(countShowVideo);
	},
	videoStatus: function(count){
		if ( count > 0 ){
			$('.ws-one-video').hide();
			$('.ws-list-video').show();
		} else{
			$('.ws-list-video').hide();
			//$('.ws-one-video').show();
		}
	},
	showMoreVideo: function(){
		var videoHtml = '<div class="ws-wrap-mini-box">'+
							'<div class="mini_box_gray">'+
								'<div class="header">'+
									'<h3>Adding Email Authentication</h3>'+
								'</div>'+
								'<div class="main main_video">'+
									'<div>'+
										'<img src="imgs/thumbnail_img.jpg"/>'+
									'</div>'+
									'<div class="support_portal_video_description">'+
										'Add a SPF and DKIM record into your domain\'s DNS for email authentication and improved delivery.'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
		
		
		$('.ws-list-video-items').append(videoHtml);
	},
	blocksToggleInit: function(){
		$('.ws-show-hide-toggle-block').change(function() {
			var $toggle = $(this);
			var id = $toggle.attr('data-id-block');
			var $box = $('.wrap-ws-block-toggle[data-id="'+id+'"]');
		
			if ( $toggle.prop('checked') ){
				$box.removeClass('hide');
			} else{
				$box.addClass('hide');
			}
			
			ws.typePositionBlocksToggle();
		});
		ws.typePositionBlocksToggle();
	},
	typePositionBlocksToggle: function(){
		var $wrapBox = $('.wrap-ws-blocks-toggle');
		var $box = $wrapBox.find('.wrap-ws-block-toggle');
		var $boxVisible = $box.filter(':not(.hide)');
		var countShow = $boxVisible.length;
		
		$wrapBox.removeClass('wrap-ws-blocks-toggle-1 wrap-ws-blocks-toggle-2 wrap-ws-blocks-toggle-3 wrap-ws-blocks-toggle-4 wrap-ws-blocks-toggle-5');
		$box.removeClass('ws-block-toggle100x50 ws-block-toggle33x100');
		
		if ( countShow == 1){
			$wrapBox.addClass('wrap-ws-blocks-toggle-1');
		} else if ( countShow == 2 ){
			$wrapBox.addClass('wrap-ws-blocks-toggle-2');
		} else if ( countShow == 3 ){
			$wrapBox.addClass('wrap-ws-blocks-toggle-3');
			$boxVisible.eq(2).addClass('ws-block-toggle100x50');
		} else if ( countShow == 4 ){
			$wrapBox.addClass('wrap-ws-blocks-toggle-4');
		} else if ( countShow == 5 ){
			$wrapBox.addClass('wrap-ws-blocks-toggle-5');
			$boxVisible.eq(2).addClass('ws-block-toggle33x100');
		} else if ( countShow == 6 ){
			
		}
		ws.colorBlocksToggle(countShow);
	},
	colorBlocksToggle: function(count){
		var color = '#FF982B';
		var $box = $('.wrap-ws-blocks-toggle .wrap-ws-block-toggle');
		var $boxVisible = $box.filter(':not(.hide)');
		
		$box.find('.svg-fill').attr('fill','#b9b9b9');
		
		if ( count == 1){
			$boxVisible.eq(0).find('.svg-fill').attr('fill',color);
		} else if ( count == 2 ){
			$boxVisible.eq(0).find('.svg-fill').attr('fill',color);
		} else if ( count == 3 ){
			$boxVisible.eq(0).find('.svg-fill').attr('fill',color);
			$boxVisible.eq(2).find('.svg-fill').attr('fill',color);
		} else if ( count == 4 ){
			$boxVisible.eq(0).find('.svg-fill').attr('fill',color);
			$boxVisible.eq(3).find('.svg-fill').attr('fill',color);
		} else if ( count == 5 ){
			$boxVisible.eq(0).find('.svg-fill').attr('fill',color);
			$boxVisible.eq(4).find('.svg-fill').attr('fill',color);
		} else if ( count == 6 ){
			$boxVisible.eq(0).find('.svg-fill').attr('fill',color);
			$boxVisible.eq(2).find('.svg-fill').attr('fill',color);
			$boxVisible.eq(4).find('.svg-fill').attr('fill',color);
		}
	},
	wsDropdown: function(){
		$('.welcome-page').on('click', '.ws-settings-box-toggle', function(e){
			e.stopPropagation();
			
			var $el = $(this);
			var $dropdown = $el.parents('.ws-settings-box');
			
			if( $dropdown.hasClass('open') ){
				$dropdown.removeClass('open');
				
			} else{
				$('.ws-settings-box.open').removeClass('open');
				$dropdown.addClass('open');
			}
		});
		$('body').on('click', function(e){
			if ( !$(e.target).hasClass('ws-settings-box') && !$(e.target).parents('.ws-settings-box').length ){
				$('.ws-settings-box.open').removeClass('open');
			}
		});
		$('.welcome-page').on('click', '.ws-settings-box-dropdown li a', function(e){
			e.stopPropagation();
			e.preventDefault();
			
			var $item = $(this);
			var $dropdown = $item.parents('.ws-settings-box');
			$dropdown.removeClass('open');
			
			var $box = $item.parents('.ws-white-box');
			
			if ( $item.hasClass('ws-remove-block') ){
				ws.removeBox($box);
			} else if ( $item.hasClass('ws-clone-block') ){
				ws.cloneBox($box);
			}
		});
	},
	addNewBlock: function(){
		$('.ws-add-new-block .drop-list a').on('click', function(e){
			e.preventDefault();
			var idx = $(this).parent().attr('idx');
			var html = '';
			var $li = $(this).parent();
			
			if (idx == 0){
				html = '<div class="ws-layout ws-layout-top clearfix ws-adding-new-block">'+
							'<div class="ws-layout-100">'+
								'<div class="ws-white-box ws-white-box-slider-visitors" data-id-box="0">'+
									'<div class="ws-white-box-h">'+
										'<span class="ws-white-box-h-title">'+
											'Most Recent Visitors'+
										'</span>'+
										'<div class="ws-settings-box ws-settings-box-text">'+
											'<div class="ws-settings-box-toggle">'+
												'<svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
													'<defs></defs>'+
													'<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
														'<g id="Welcome-screen-1" transform="translate(-590.000000, -1370.000000)" fill="#6C6C6C">'+
															'<g id="Group-17" transform="translate(76.000000, 1357.000000)">'+
																'<path d="M529,28 L516,28 C514.895,28 514,27.105 514,26 L514,15 C514,13.896 514.895,13 516,13 L529,13 C530.105,13 531,13.896 531,15 L531,26 C531,27.105 530.105,28 529,28 L529,28 Z M529,16 C529,15.448 528.552,15 528,15 L517,15 C516.448,15 516,15.448 516,16 L516,25 C516,25.552 516.448,26 517,26 L528,26 C528.552,26 529,25.552 529,25 L529,16 L529,16 Z M525,21 L524,21 L524,22 L523,22 L523,23 L522,23 L522,22 L521,22 L521,21 L520,21 L520,20 L519,20 L519,19 L526,19 L526,20 L525,20 L525,21 L525,21 Z" id="Imported-Layers-5"></path>'+
															'</g>'+
														'</g>'+
													'</g>'+
												'</svg>'+
											'</div>'+
											'<div class="ws-settings-box-dropdown">'+
												'<ul>'+
													'<li><a href="#" class="ws-clone-block">Clone</a></li>'+
													'<li class="ws-arrow-left">'+
														'<a href="#">Item</a>'+
														'<ul>'+
															'<li><a href="#">Item 2.1</a></li>'+
															'<li><a href="#">Item 2.2</a></li>'+
															'<li><a href="#">Item 2.3</a></li>'+
															'<li><a href="#">Item 2.4</a></li>'+
														'</ul>'+
													'</li>'+
													'<li><a href="#" class="ws-remove-block">Remove</a></li>'+
												'</ul>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="ws-white-box-c">'+
										'<div class="wrap-ws-slider-visitors">'+
										ws.sliderHtml() +
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
				
				$('.welcome-page').prepend(html);
				ws.initSlider( $('.ws-adding-new-block').find('.ws-slider-visitors') );
			} else if ( idx == 1){
				html = '<div class="ws-layout-50 ws-adding-new-block">'+
							'<div class="ws-white-box" data-id-box="1">'+
								'<div class="ws-white-box-h pl-35">'+
									'<div class="ws-settings-box ws-settings-box-text ws-settings-box-left ws-settings-box-icon-2">'+
										'<div class="ws-settings-box-toggle">'+	
										'</div>'+
										'<div class="ws-settings-box-dropdown">'+
											'<ul>'+
												'<li><a href="#">Email</a></li>'+
												'<li><a href="#">Forms</a></li>'+
												'<li><a href="#">Landing Pages</a></li>'+
												'<li><a href="#">Surveys</a></li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
									'<span class="ws-white-box-h-title">'+
										'Emails'+
									'</span>'+
									'<div class="ws-settings-box ws-settings-box-text">'+
										'<div class="ws-settings-box-toggle">'+
											'<svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
												'<defs></defs>'+
												'<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
													'<g id="Welcome-screen-1" transform="translate(-590.000000, -1370.000000)" fill="#6C6C6C">'+
														'<g id="Group-17" transform="translate(76.000000, 1357.000000)">'+
															'<path d="M529,28 L516,28 C514.895,28 514,27.105 514,26 L514,15 C514,13.896 514.895,13 516,13 L529,13 C530.105,13 531,13.896 531,15 L531,26 C531,27.105 530.105,28 529,28 L529,28 Z M529,16 C529,15.448 528.552,15 528,15 L517,15 C516.448,15 516,15.448 516,16 L516,25 C516,25.552 516.448,26 517,26 L528,26 C528.552,26 529,25.552 529,25 L529,16 L529,16 Z M525,21 L524,21 L524,22 L523,22 L523,23 L522,23 L522,22 L521,22 L521,21 L520,21 L520,20 L519,20 L519,19 L526,19 L526,20 L525,20 L525,21 L525,21 Z" id="Imported-Layers-5"></path>'+
														'</g>'+
													'</g>'+
												'</g>'+
											'</svg>'+
										'</div>'+
										'<div class="ws-settings-box-dropdown">'+
											'<ul>'+
												'<li><a href="#" class="ws-clone-block">Clone</a></li>'+
												'<li class="ws-arrow-left">'+
													'<a href="#">Item</a>'+
													'<ul>'+
														'<li><a href="#">Item 2.1</a></li>'+
														'<li><a href="#">Item 2.2</a></li>'+
														'<li><a href="#">Item 2.3</a></li>'+
														'<li><a href="#">Item 2.4</a></li>'+
													'</ul>'+
												'</li>'+
												'<li><a href="#" class="ws-remove-block">Remove</a></li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="ws-white-box-c">'+
									'<div class="ws-chart-box"></div>'+
								'</div>'+
							'</div>'+
						'</div>';
						
						var $wrap = $('.welcome-page .ws-layout-2:first');
						$wrap.prepend(html);
						ws.addChart1( $('.ws-adding-new-block').find('.ws-chart-box') );
						ws.updatePositionBox();
			} else if ( idx == 2){
				html = '<div class="ws-layout ws-layout-4 clearfix"><div class="ws-layout-100 ws-adding-new-block">'+
							'<div class="ws-white-box" data-id-box="1">'+
								'<div class="ws-white-box-h">'+
									'<span class="ws-white-box-h-title">'+
										'Conversion Chart'+
									'</span>'+
									'<div class="ws-settings-box ws-settings-box-text">'+
										'<div class="ws-settings-box-toggle">'+
											'<svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
												'<defs></defs>'+
												'<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
													'<g id="Welcome-screen-1" transform="translate(-590.000000, -1370.000000)" fill="#6C6C6C">'+
														'<g id="Group-17" transform="translate(76.000000, 1357.000000)">'+
															'<path d="M529,28 L516,28 C514.895,28 514,27.105 514,26 L514,15 C514,13.896 514.895,13 516,13 L529,13 C530.105,13 531,13.896 531,15 L531,26 C531,27.105 530.105,28 529,28 L529,28 Z M529,16 C529,15.448 528.552,15 528,15 L517,15 C516.448,15 516,15.448 516,16 L516,25 C516,25.552 516.448,26 517,26 L528,26 C528.552,26 529,25.552 529,25 L529,16 L529,16 Z M525,21 L524,21 L524,22 L523,22 L523,23 L522,23 L522,22 L521,22 L521,21 L520,21 L520,20 L519,20 L519,19 L526,19 L526,20 L525,20 L525,21 L525,21 Z" id="Imported-Layers-5"></path>'+
														'</g>'+
													'</g>'+
												'</g>'+
											'</svg>'+
										'</div>'+
										'<div class="ws-settings-box-dropdown">'+
											'<ul>'+
												'<li><a href="#" class="ws-clone-block">Clone</a></li>'+
												'<li class="ws-arrow-left">'+
													'<a href="#">Item</a>'+
													'<ul>'+
														'<li><a href="#">Item 2.1</a></li>'+
														'<li><a href="#">Item 2.2</a></li>'+
														'<li><a href="#">Item 2.3</a></li>'+
														'<li><a href="#">Item 2.4</a></li>'+
													'</ul>'+
												'</li>'+
												'<li><a href="#" class="ws-remove-block">Remove</a></li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="ws-white-box-c">'+
									'<div class="ws-chart-box"></div>'+
								'</div>'+
							'</div>'+
						'</div></div>';
						
						var $wrap = $('.welcome-page .ws-layout-3:last');
						
						$wrap.after(html);
						
						ws.addChart1( $('.ws-adding-new-block').find('.ws-chart-box') );
			} else if ( idx == 3 ){
				$li.hide();
				html = '<div class="ws-layout-50 ws-adding-new-block">'+
							'<div class="ws-white-box" data-id-box="3">'+
								'<div class="ws-white-box-h">'+
									'<span class="ws-white-box-h-title">'+
										'Recent Email Campaign'+
									'</span>'+
									'<div class="ws-settings-box ws-settings-box-text">'+
										'<div class="ws-settings-box-toggle">'+
											'<svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
												'<defs></defs>'+
												'<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
													'<g id="Welcome-screen-1" transform="translate(-590.000000, -1370.000000)" fill="#6C6C6C">'+
														'<g id="Group-17" transform="translate(76.000000, 1357.000000)">'+
															'<path d="M529,28 L516,28 C514.895,28 514,27.105 514,26 L514,15 C514,13.896 514.895,13 516,13 L529,13 C530.105,13 531,13.896 531,15 L531,26 C531,27.105 530.105,28 529,28 L529,28 Z M529,16 C529,15.448 528.552,15 528,15 L517,15 C516.448,15 516,15.448 516,16 L516,25 C516,25.552 516.448,26 517,26 L528,26 C528.552,26 529,25.552 529,25 L529,16 L529,16 Z M525,21 L524,21 L524,22 L523,22 L523,23 L522,23 L522,22 L521,22 L521,21 L520,21 L520,20 L519,20 L519,19 L526,19 L526,20 L525,20 L525,21 L525,21 Z" id="Imported-Layers-5"></path>'+
														'</g>'+
													'</g>'+
												'</g>'+
											'</svg>'+
										'</div>'+
										'<div class="ws-settings-box-dropdown">'+
											'<ul>'+
												'<li><a href="#" class="ws-remove-block">Remove</a></li>'+
											'</ul>'+
										'</div>'+
									'</div>'+
								'</div>'+
								'<div class="ws-white-box-c">'+
									'<div class="rec">'+
										'<div class="rec-no">'+
											'<div class="rec-no-icon">'+
												'<svg width="63px" height="63px" viewBox="0 0 63 63" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+
													'<defs></defs>'+
													'<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">'+
														'<g id="Welcome-screen-1" transform="translate(-313.000000, -1464.000000)" fill="#CCCCCC">'+
															'<g id="1476799788_line-62" transform="translate(313.000000, 1464.000000)">'+
																'<g id="Слой_1">'+
																	'<g id="Group">'+
																		'<path d="M62.75,61.5 L62.75,21.5 L62.75,21.5 L62.75,21.5 L62.75,21.45 L62.75,21.25 C62.75,21.2 62.75,21.15 62.7,21.15 C62.7,21.1 62.7,21.05 62.65,21.05 C62.6,21 62.6,20.95 62.55,20.85 L62.55,20.8 L62.55,20.8 C62.5,20.75 62.45,20.65 62.4,20.6 C62.35,20.55 62.35,20.55 62.3,20.5 C62.25,20.45 62.25,20.45 62.2,20.4 C62.15,20.4 62.1,20.35 62.1,20.35 C62.05,20.35 62.05,20.3 62,20.3 C61.95,20.3 61.9,20.25 61.85,20.25 C61.8,20.25 61.8,20.25 61.75,20.2 L61.5,20.2 L61.5,20.2 L57.75,20.2 L57.75,1.5 C57.75,0.8 57.2,0.25 56.5,0.25 L6.5,0.25 C5.8,0.25 5.25,0.8 5.25,1.5 L5.25,20.25 L1.5,20.25 L1.5,20.25 L1.25,20.25 C1.2,20.25 1.2,20.25 1.15,20.3 C1.1,20.3 1.05,20.3 1,20.35 C0.95,20.35 0.95,20.4 0.9,20.4 C0.85,20.4 0.8,20.45 0.8,20.45 C0.75,20.45 0.75,20.5 0.7,20.5 L0.6,20.6 C0.55,20.65 0.5,20.7 0.45,20.8 L0.45,20.8 L0.45,20.85 C0.4,20.9 0.4,20.95 0.35,21.05 C0.35,21.1 0.35,21.15 0.3,21.15 C0.3,21.2 0.25,21.25 0.25,21.25 L0.25,21.45 L0.25,21.5 L0.25,21.5 L0.25,21.5 L0.25,61.5 C0.25,62.2 0.8,62.75 1.5,62.75 L61.5,62.75 C61.6,62.75 61.7,62.75 61.8,62.7 L61.85,62.7 C61.9,62.7 62,62.65 62.05,62.65 C62.1,62.65 62.1,62.6 62.15,62.6 C62.2,62.55 62.25,62.55 62.3,62.5 L62.35,62.45 L62.55,62.25 L62.55,62.25 L62.55,62.2 C62.6,62.15 62.6,62.1 62.65,62 C62.65,61.95 62.65,61.9 62.7,61.9 C62.7,61.85 62.75,61.8 62.75,61.8 L62.75,61.6 C62.75,61.55 62.75,61.5 62.75,61.5 L62.75,61.5 L62.75,61.5 L62.75,61.5 Z M33.75,41.5 L60.25,23.85 L60.25,59.2 L33.75,41.5 L33.75,41.5 Z M7.75,2.75 L55.25,2.75 L55.25,24.15 L31.5,40 L7.75,24.15 L7.75,2.75 L7.75,2.75 Z M2.75,23.85 L57.35,60.25 L2.75,60.25 L2.75,23.85 Z M19,10.75 L44,10.75 C44.7,10.75 45.25,10.2 45.25,9.5 C45.25,8.8 44.7,8.25 44,8.25 L19,8.25 C18.3,8.25 17.75,8.8 17.75,9.5 C17.75,10.2 18.3,10.75 19,10.75 Z M19,20.75 L44,20.75 C44.7,20.75 45.25,20.2 45.25,19.5 C45.25,18.8 44.7,18.25 44,18.25 L19,18.25 C18.3,18.25 17.75,18.8 17.75,19.5 C17.75,20.2 18.3,20.75 19,20.75 Z" id="Combined-Shape"></path>'+
																	'</g>'+
																'</g>'+
															'</g>'+
														'</g>'+
													'</g>'+
												'</svg>'+
											'</div>'+
											'<div class="rec-no-text">No rect campaign</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
						
						var $wrap = $('.welcome-page .ws-layout-5');

						$wrap.show();
						$wrap.prepend(html);
						
			} else if ( idx == 4 ){
				$li.hide();
				html = '<div class="ws-layout-50 ws-adding-new-block">'+
								'<div class="ws-white-box" data-id-box="4">'+
									'<div class="ws-white-box-h">'+
										'<span class="ws-white-box-h-title">'+
											'Upcoming Campaigns'+
										'</span>'+
										'<div class="ws-settings-box ws-settings-box-text">'+
											'<div class="ws-settings-box-toggle">'+
												'<svg width="17px" height="15px" viewBox="0 0 17 15" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Welcome-screen-1" transform="translate(-590.000000, -1370.000000)" fill="#6C6C6C"> <g id="Group-17" transform="translate(76.000000, 1357.000000)"> <path d="M529,28 L516,28 C514.895,28 514,27.105 514,26 L514,15 C514,13.896 514.895,13 516,13 L529,13 C530.105,13 531,13.896 531,15 L531,26 C531,27.105 530.105,28 529,28 L529,28 Z M529,16 C529,15.448 528.552,15 528,15 L517,15 C516.448,15 516,15.448 516,16 L516,25 C516,25.552 516.448,26 517,26 L528,26 C528.552,26 529,25.552 529,25 L529,16 L529,16 Z M525,21 L524,21 L524,22 L523,22 L523,23 L522,23 L522,22 L521,22 L521,21 L520,21 L520,20 L519,20 L519,19 L526,19 L526,20 L525,20 L525,21 L525,21 Z" id="Imported-Layers-5"></path> </g> </g> </g> </svg>'+
											'</div>'+
											'<div class="ws-settings-box-dropdown">'+
												'<ul>'+
													'<li><a href="#" class="ws-remove-block">Remove</a></li>'+
												'</ul>'+
											'</div>'+
										'</div>'+
									'</div>'+
									'<div class="ws-white-box-c">'+
										'<div class="upcoming-campaign">'+
											'<div class="upcoming-campaign-item upcoming-campaign-item-none">'+
												'<div class="upcoming-campaign-item-icn upcoming-campaign-item-icn-automation">'+
													'<svg width="38px" height="38px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Welcome-screen-1" transform="translate(-659.000000, -1438.000000)" fill="#6C6C6C"> <g id="Group-25" transform="translate(640.000000, 1357.000000)"> <g id="Group-26" transform="translate(19.000000, 81.000000)"> <g id="Group-18"> <g id="settings"> <path d="M19,11.4153846 C14.8184615,11.4153846 11.4153846,14.8184615 11.4153846,19 C11.4153846,23.1815385 14.8184615,26.5846154 19,26.5846154 C23.1815385,26.5846154 26.5846154,23.1815385 26.5846154,19 C26.5846154,14.8184615 23.1815385,11.4153846 19,11.4153846 L19,11.4153846 Z M18.9646154,22.1969231 C17.2015385,22.1969231 15.7676923,20.7646154 15.7676923,19.0015385 C15.7676923,17.2369231 17.2015385,15.8061538 18.9646154,15.8061538 C20.7276923,15.8061538 22.1584615,17.2369231 22.1584615,19.0015385 C22.1584615,20.7646154 20.7276923,22.1969231 18.9646154,22.1969231 L18.9646154,22.1969231 Z M37.5153846,21.2784615 L37.5153846,16.6492308 L32.0061538,15.7492308 C31.68,14.4430769 31.1676923,13.2169231 30.4938462,12.0938462 L33.7046154,7.51692308 L30.4307692,4.24615385 L25.9123077,7.49384615 C24.7861538,6.81230769 23.5523077,6.29230769 22.2369231,5.96461538 L21.2769231,0.483076923 L16.6476923,0.483076923 L15.7553846,5.94769231 C14.4415385,6.27076923 13.2,6.78307692 12.0707692,7.46153846 L7.56615385,4.24307692 L4.29230769,7.51538462 L7.46153846,12.0461538 C6.77692308,13.18 6.25538462,14.42 5.92461538,15.7430769 L0.484615385,16.6492308 L0.484615385,21.2784615 L5.91846154,22.2415385 C6.24615385,23.5615385 6.76769231,24.8015385 7.45538462,25.9369231 L4.24307692,30.4292308 L7.51538462,33.7046154 L12.0523077,30.5276923 C13.1846154,31.2076923 14.4230769,31.7246154 15.7384615,32.0492308 L16.6492308,37.5169231 L21.2784615,37.5169231 L22.2507692,32.0353846 C23.56,31.7046154 24.7938462,31.1830769 25.9169231,30.5 L30.4861538,33.7061538 L33.7584615,30.4307692 L30.4984615,25.9030769 C31.1723077,24.78 31.6846154,23.5523077 32.0076923,22.2461538 L37.5153846,21.2784615 L37.5153846,21.2784615 Z M19,29.0384615 C13.4553846,29.0384615 8.96153846,24.5430769 8.96153846,19 C8.96153846,13.4569231 13.4553846,8.96153846 19,8.96153846 C24.5446154,8.96153846 29.0384615,13.4553846 29.0384615,19 C29.0384615,24.5446154 24.5446154,29.0384615 19,29.0384615 L19,29.0384615 Z" id="Combined-Shape"></path> </g> </g> </g> </g> </g> </g> </svg>'+
												'</div>'+
												'<div class="upcoming-campaign-item-title">'+
													'<span>No schedule automations</span>'+
												'</div>'+
											'</div>'+
										'</div>'+
										'<div class="upcoming-campaign">'+
											'<div class="upcoming-campaign-item upcoming-campaign-item-none">'+
												'<div class="upcoming-campaign-item-icn upcoming-campaign-item-icn-emails">'+
													'<svg width="35px" height="26px" viewBox="0 0 35 26" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Welcome-screen-1" transform="translate(-661.000000, -1512.000000)" fill="#6C6C6C"> <g id="Group-25" transform="translate(640.000000, 1357.000000)"> <g id="Group-26" transform="translate(18.000000, 81.000000)"> <g id="Group-19" transform="translate(3.000000, 74.000000)"> <g id="message_outline"> <g id="Layer_1"> <path d="M32.0833333,2.88888889 L32.0833333,23.1111111 L2.91666667,23.1111111 L2.91666667,2.88888889 L32.0833333,2.88888889 L32.0833333,2.88888889 Z M35,0 L0,0 L0,26 L35,26 L35,0 L35,0 L35,0 Z M2.92602304,9.28090587 L16.86196,16.1687095 L17.5,16.4840593 L18.13804,16.1687095 L32.099569,9.26825705 L32.0948311,6.05876384 L17.5140154,13.2784233 L2.93572294,6.07313702 L2.92602304,9.28090587 Z" id="Combined-Shape"></path> </g> </g> </g> </g> </g> </g> </g> </svg>'+
												'</div>'+
												'<div class="upcoming-campaign-item-title">'+
													'<span>No schedule emails</span>'+
												'</div>'+
											'</div>'+
										'</div>'+
										'<div class="upcoming-campaign">'+
											'<div class="upcoming-campaign-item upcoming-campaign-item-none">'+
												'<div class="upcoming-campaign-item-icn upcoming-campaign-item-icn-social-posts">'+
													'<svg width="39px" height="38px" viewBox="0 0 39 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Welcome-screen-1" transform="translate(-658.000000, -1579.000000)" fill="#6C6C6C"> <g id="Group-25" transform="translate(640.000000, 1357.000000)"> <g id="Group-26" transform="translate(19.000000, 81.000000)"> <g id="Group-20" transform="translate(2.000000, 143.000000)"> <g id="delete_message"> <g id="Layer_1"> <path d="M-0.597265306,14.936625 C-0.597265306,19.4464439 1.40830078,23.6592774 4.8804489,26.7311105 L4.37436735,25.6076667 C4.37436735,27.5429366 3.56367781,29.1364232 2.11005875,30.5732824 C1.45781982,31.2180013 -0.459012241,32.6898053 -0.355725462,32.5980561 L-2.4223137,34.4337987 L0.243154874,35.1659292 C4.6530436,36.3772037 11.0173751,34.0385445 14.9305243,30.6733821 L13.9524898,29.5360833 L13.6674676,31.0087552 C14.9103465,31.2493031 16.1653062,31.37325 17.4246531,31.37325 C27.345547,31.37325 35.4465714,24.0493757 35.4465714,14.936625 C35.4465714,5.82292266 27.346069,-1.5 17.4246531,-1.5 C7.50369994,-1.5 -0.597265306,5.82312857 -0.597265306,14.936625 Z M32.4465714,14.936625 C32.4465714,22.3212649 25.7523988,28.37325 17.4246531,28.37325 C16.3595831,28.37325 15.2952857,28.268134 14.237512,28.0634115 L13.5248342,27.9254792 L12.9744553,28.3987846 C9.74303829,31.1776827 4.31351378,33.1728345 1.03774309,32.2730708 L0.64044898,33.7195 L1.63662342,34.8409439 C1.7274786,34.7602376 2.6422202,34.0713762 2.57687656,34.1215491 C3.19031461,33.6505321 3.71011958,33.2099233 4.21904364,32.7068669 C6.19777912,30.7509457 7.37436735,28.4382508 7.37436735,25.6076667 L7.37436735,24.9319566 L6.86828579,24.4842228 C4.02338347,21.9673183 2.40273469,18.5630308 2.40273469,14.936625 C2.40273469,7.55130927 9.09679252,1.5 17.4246531,1.5 C25.7529593,1.5 32.4465714,7.55108192 32.4465714,14.936625 Z" id="Shape"></path> </g> </g> </g> </g> </g> </g> </g> </svg>'+
												'</div>'+
												'<div class="upcoming-campaign-item-title">'+
													'<span>No schedule social posts</span>'+
												'</div>'+
											'</div>'+
										'</div>'+
									'</div>'+
								'</div>'+
							'</div>'+
						'</div>';
						
						var $wrap = $('.welcome-page .ws-layout-5');
						
						$wrap.show();
						$wrap.append(html);	
			}
			$('.ws-adding-new-block').removeClass('ws-adding-new-block');
		});
	},
	removeBox: function($box){
		var idBox = $box.attr('data-id-box');
		var $wrap = $box.parents('.ws-layout');
		$box.parents('.ws-layout-50, .ws-layout-100').remove();
		
		if( idBox == '3' || idBox == '4' ){
			ws.updateDropdownAddNewBox(idBox, true);
			if ( !$wrap.find('.ws-layout-50').length ){
				$wrap.hide();
			}
		}
		if ( $wrap.hasClass('ws-layout-2') ){
			ws.updatePositionBox();
		}
		if ( !$wrap.hasClass('ws-layout-5') ){
			ws.removeWrapperBox($wrap);
		}
	},
	updateDropdownAddNewBox: function(idBox, isShow){
		var $item = $('.ws-add-new-block .ws-item-' + idBox);
		
		if( idBox == '3' || idBox == '4'){
			if ( isShow )
				$item.show();
			else
				$item.hide();
		}
	},
	updatePositionBox: function(){
		var $wrap = $('.welcome-page .ws-layout-2');
		var length = $wrap.length;
		
		$wrap.each(function(i){
			var $this = $(this);
			var $box = $this.find('.ws-layout-50, .ws-layout-100');
			var countBox = $box.length;
			
			if ( countBox == 1 ){
				var nextWrap = $wrap.eq(i+1);
				if( nextWrap.length  ){
					
					var $clone = $(nextWrap[0]).find('.ws-layout-50').eq(0).detach();
					$this.append($clone);
					ws.removeWrapperBox($(nextWrap[0]));
				}
			} else if ( countBox == 3 ){
				var nextWrap = $wrap.eq(i+1);
				if( nextWrap.length  ){
					var $clone = $this.find('.ws-layout-50').eq(2).detach();
					$(nextWrap[0]).prepend($clone);
				} else{
					var $clone = $this.find('.ws-layout-50').eq(2).detach();
					$this.after('<div class="ws-layout ws-layout-2 clearfix"></div>');
					$this.next('div').prepend($clone);
				}
			}
		});
	},	
	removeWrapperBox: function($wrap){
		if ( !$wrap.find('.ws-layout-50, .ws-layout-100').length ){
			$wrap.remove();
		}
	},
	cloneBox: function($box){
		var id = $box.attr('data-id-box');
		var $wrap = $box.parents('.ws-layout');
		
		if( $box.parent().hasClass('ws-layout-100') ){
			$wrap.after($box.parent().parent().clone().addClass('ws-block-cloned'));
		} else{
			$box.parent().after($box.parent().clone().addClass('ws-block-cloned'));
			if(  $wrap.hasClass('ws-layout-2') )
				ws.updatePositionBox();
		}
		
		var $newBlock = $('.ws-block-cloned');
		
		if( id == 0 ){
			var htmlCode = ws.sliderHtml();
			var $wrapSlider = $newBlock.find('.wrap-ws-slider-visitors');
			
			$wrapSlider.html(htmlCode);
			ws.initSlider($wrapSlider.find('.ws-slider-visitors'));
		} else if (id == 1 || id == 2){
			$newBlock.find('.ws-chart-box').replaceWith('<div class="ws-chart-box"></div>');
			ws.addChart1($newBlock.find('.ws-chart-box'));
		}
		
		$newBlock.removeClass('ws-block-cloned');
	},
	sliderHtml: function(){
		var htmlCode = '<ul class="ws-slider-visitors"><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_1.png"/></a><div class="ws-slider-visitors-ava-fire"><svg width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="path-1" cx="11.5" cy="11.5" r="11.5"></circle><mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="23" height="23" fill="white"><use xlink:href="#path-1"></use></mask></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Welcome-screen-1" transform="translate(-893.000000, -252.000000)"><g id="Group-14" transform="translate(893.000000, 252.000000)"><g id="Group-16"><use id="Oval-10" stroke="#FB8F04" mask="url(#mask-2)" stroke-width="2" fill="#FFFFFF" xlink:href="#path-1"></use><path d="M16.2257112,9.49889334 C15.9361682,9.07871578 15.3066708,8.52030136 14.8279769,8.12316328 C14.7310317,8.04350136 14.629347,8.04506336 14.5655786,8.08333232 C14.4324405,8.15088875 14.4694951,8.26921012 14.4694951,8.26921012 L14.4617395,8.26491463 C14.7193983,8.69915017 14.8857132,9.20055165 14.9042405,9.85346697 C14.9085492,10.2084311 14.8839897,10.4567888 14.883128,10.4614748 C14.873218,10.5157543 14.8620155,10.5633952 14.8512438,10.6059597 C14.8184978,10.7504445 14.6013406,11.1764796 14.2932703,11.0593297 C13.9852,10.9425703 13.9666727,10.4950578 13.9666727,10.4950578 C13.9666727,10.4950578 13.9640875,10.4962293 13.9623641,10.4962293 C13.7258178,8.01030889 12.4612216,6.53773493 11.4913388,5.76532674 C11.490477,5.76454574 11.4891844,5.76337424 11.4883227,5.76259324 C11.4878918,5.76220274 11.4865992,5.76142174 11.4853066,5.76025024 C11.0962332,5.45175557 10.7580022,5.25533427 10.5524784,5.14872788 C10.5296424,5.13818439 10.5059447,5.1276409 10.475784,5.11006842 C10.4266651,5.08117145 10.3883179,5.06789447 10.3465237,5.05032199 C10.3473855,5.05071249 10.3473855,5.05149348 10.3473855,5.05149348 C10.3198099,5.038607 10.2913727,5.02845401 10.2629354,5.01634852 C10.078955,4.96558357 9.98804194,5.04095 9.94280085,5.1338889 C9.94107738,5.14169889 9.90445363,5.3283577 10.0470708,5.7055803 C10.0475017,5.7059708 10.0470708,5.7059708 10.0475017,5.7063613 C10.440022,6.67089529 10.9182849,8.37776901 10.4167551,10.2072596 C10.3223951,10.5122398 10.0164792,10.735996 9.89109674,10.735996 C9.44730318,10.7769985 9.24221024,10.4817808 9.16120714,10.311523 C9.14698851,10.275597 9.12932294,10.2420141 9.11682779,10.2029641 C9.11682779,10.2017926 9.11510432,10.1963256 9.11510432,10.1963256 C8.84925905,9.33683601 9.1749949,8.05092085 9.40292383,7.3335731 C9.5558818,6.80288415 8.83719476,7.3339636 8.83719476,7.3339636 L8.83460955,7.3355256 L8.83460955,7.3355256 C8.693285,7.44330349 8.54118876,7.56552986 8.38090604,7.70064272 L8.3800443,7.69556622 C8.17753656,7.86348105 7.90996783,8.0966093 7.63464347,8.36332052 C7.48556331,8.50780537 5.50012572,10.4880288 6.11928236,13.1922385 C6.71431042,15.3778647 8.88286672,17 11.4779819,17 C14.2924086,17 16.610045,15.093581 16.9599095,12.6291381 C16.9732664,12.5295607 16.9853307,12.4307643 16.9909319,12.3323584 C16.9935171,12.3011184 16.9943789,12.2690974 16.9961024,12.2362955 C17.0443595,11.1026752 16.636328,10.1553232 16.2257112,9.49889334 L16.2257112,9.49889334 Z" id="Fire-off" fill="#FB8F04"></path></g></g></g></g></svg></div></div><div class="ws-slider-visitors-t"><a href="#">Michael Thompson</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_2.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Barry Longnameeeee</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_3.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Jame Sanders</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_4.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Bob Salazar</a></div></li><li><div class="ws-slider-visitors-ava ava-anonumous"><a href="#"></a></div><div class="ws-slider-visitors-t"><a href="#">Anonumous</a></div></li><li><div class="ws-slider-visitors-ava no-ava"><a href="#">SS</a></div><div class="ws-slider-visitors-t"><a href="#">Susie Sanches</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_1.png"/></a><div class="ws-slider-visitors-ava-fire"><svg width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="path-1" cx="11.5" cy="11.5" r="11.5"></circle><mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="23" height="23" fill="white"><use xlink:href="#path-1"></use></mask></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Welcome-screen-1" transform="translate(-893.000000, -252.000000)"><g id="Group-14" transform="translate(893.000000, 252.000000)"><g id="Group-16"><use id="Oval-10" stroke="#FB8F04" mask="url(#mask-2)" stroke-width="2" fill="#FFFFFF" xlink:href="#path-1"></use><path d="M16.2257112,9.49889334 C15.9361682,9.07871578 15.3066708,8.52030136 14.8279769,8.12316328 C14.7310317,8.04350136 14.629347,8.04506336 14.5655786,8.08333232 C14.4324405,8.15088875 14.4694951,8.26921012 14.4694951,8.26921012 L14.4617395,8.26491463 C14.7193983,8.69915017 14.8857132,9.20055165 14.9042405,9.85346697 C14.9085492,10.2084311 14.8839897,10.4567888 14.883128,10.4614748 C14.873218,10.5157543 14.8620155,10.5633952 14.8512438,10.6059597 C14.8184978,10.7504445 14.6013406,11.1764796 14.2932703,11.0593297 C13.9852,10.9425703 13.9666727,10.4950578 13.9666727,10.4950578 C13.9666727,10.4950578 13.9640875,10.4962293 13.9623641,10.4962293 C13.7258178,8.01030889 12.4612216,6.53773493 11.4913388,5.76532674 C11.490477,5.76454574 11.4891844,5.76337424 11.4883227,5.76259324 C11.4878918,5.76220274 11.4865992,5.76142174 11.4853066,5.76025024 C11.0962332,5.45175557 10.7580022,5.25533427 10.5524784,5.14872788 C10.5296424,5.13818439 10.5059447,5.1276409 10.475784,5.11006842 C10.4266651,5.08117145 10.3883179,5.06789447 10.3465237,5.05032199 C10.3473855,5.05071249 10.3473855,5.05149348 10.3473855,5.05149348 C10.3198099,5.038607 10.2913727,5.02845401 10.2629354,5.01634852 C10.078955,4.96558357 9.98804194,5.04095 9.94280085,5.1338889 C9.94107738,5.14169889 9.90445363,5.3283577 10.0470708,5.7055803 C10.0475017,5.7059708 10.0470708,5.7059708 10.0475017,5.7063613 C10.440022,6.67089529 10.9182849,8.37776901 10.4167551,10.2072596 C10.3223951,10.5122398 10.0164792,10.735996 9.89109674,10.735996 C9.44730318,10.7769985 9.24221024,10.4817808 9.16120714,10.311523 C9.14698851,10.275597 9.12932294,10.2420141 9.11682779,10.2029641 C9.11682779,10.2017926 9.11510432,10.1963256 9.11510432,10.1963256 C8.84925905,9.33683601 9.1749949,8.05092085 9.40292383,7.3335731 C9.5558818,6.80288415 8.83719476,7.3339636 8.83719476,7.3339636 L8.83460955,7.3355256 L8.83460955,7.3355256 C8.693285,7.44330349 8.54118876,7.56552986 8.38090604,7.70064272 L8.3800443,7.69556622 C8.17753656,7.86348105 7.90996783,8.0966093 7.63464347,8.36332052 C7.48556331,8.50780537 5.50012572,10.4880288 6.11928236,13.1922385 C6.71431042,15.3778647 8.88286672,17 11.4779819,17 C14.2924086,17 16.610045,15.093581 16.9599095,12.6291381 C16.9732664,12.5295607 16.9853307,12.4307643 16.9909319,12.3323584 C16.9935171,12.3011184 16.9943789,12.2690974 16.9961024,12.2362955 C17.0443595,11.1026752 16.636328,10.1553232 16.2257112,9.49889334 L16.2257112,9.49889334 Z" id="Fire-off" fill="#FB8F04"></path></g></g></g></g></svg></div></div><div class="ws-slider-visitors-t"><a href="#">Michael Thompson</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_2.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Barry Longnameeeee</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_3.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Jame Sanders</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_4.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Bob Salazar</a></div></li><li><div class="ws-slider-visitors-ava ava-anonumous"><a href="#"></a></div><div class="ws-slider-visitors-t"><a href="#">Anonumous</a></div></li><li><div class="ws-slider-visitors-ava no-ava"><a href="#">SS</a></div><div class="ws-slider-visitors-t"><a href="#">Susie Sanches</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_1.png"/></a><div class="ws-slider-visitors-ava-fire"><svg width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="path-1" cx="11.5" cy="11.5" r="11.5"></circle><mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="23" height="23" fill="white"><use xlink:href="#path-1"></use></mask></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Welcome-screen-1" transform="translate(-893.000000, -252.000000)"><g id="Group-14" transform="translate(893.000000, 252.000000)"><g id="Group-16"><use id="Oval-10" stroke="#FB8F04" mask="url(#mask-2)" stroke-width="2" fill="#FFFFFF" xlink:href="#path-1"></use><path d="M16.2257112,9.49889334 C15.9361682,9.07871578 15.3066708,8.52030136 14.8279769,8.12316328 C14.7310317,8.04350136 14.629347,8.04506336 14.5655786,8.08333232 C14.4324405,8.15088875 14.4694951,8.26921012 14.4694951,8.26921012 L14.4617395,8.26491463 C14.7193983,8.69915017 14.8857132,9.20055165 14.9042405,9.85346697 C14.9085492,10.2084311 14.8839897,10.4567888 14.883128,10.4614748 C14.873218,10.5157543 14.8620155,10.5633952 14.8512438,10.6059597 C14.8184978,10.7504445 14.6013406,11.1764796 14.2932703,11.0593297 C13.9852,10.9425703 13.9666727,10.4950578 13.9666727,10.4950578 C13.9666727,10.4950578 13.9640875,10.4962293 13.9623641,10.4962293 C13.7258178,8.01030889 12.4612216,6.53773493 11.4913388,5.76532674 C11.490477,5.76454574 11.4891844,5.76337424 11.4883227,5.76259324 C11.4878918,5.76220274 11.4865992,5.76142174 11.4853066,5.76025024 C11.0962332,5.45175557 10.7580022,5.25533427 10.5524784,5.14872788 C10.5296424,5.13818439 10.5059447,5.1276409 10.475784,5.11006842 C10.4266651,5.08117145 10.3883179,5.06789447 10.3465237,5.05032199 C10.3473855,5.05071249 10.3473855,5.05149348 10.3473855,5.05149348 C10.3198099,5.038607 10.2913727,5.02845401 10.2629354,5.01634852 C10.078955,4.96558357 9.98804194,5.04095 9.94280085,5.1338889 C9.94107738,5.14169889 9.90445363,5.3283577 10.0470708,5.7055803 C10.0475017,5.7059708 10.0470708,5.7059708 10.0475017,5.7063613 C10.440022,6.67089529 10.9182849,8.37776901 10.4167551,10.2072596 C10.3223951,10.5122398 10.0164792,10.735996 9.89109674,10.735996 C9.44730318,10.7769985 9.24221024,10.4817808 9.16120714,10.311523 C9.14698851,10.275597 9.12932294,10.2420141 9.11682779,10.2029641 C9.11682779,10.2017926 9.11510432,10.1963256 9.11510432,10.1963256 C8.84925905,9.33683601 9.1749949,8.05092085 9.40292383,7.3335731 C9.5558818,6.80288415 8.83719476,7.3339636 8.83719476,7.3339636 L8.83460955,7.3355256 L8.83460955,7.3355256 C8.693285,7.44330349 8.54118876,7.56552986 8.38090604,7.70064272 L8.3800443,7.69556622 C8.17753656,7.86348105 7.90996783,8.0966093 7.63464347,8.36332052 C7.48556331,8.50780537 5.50012572,10.4880288 6.11928236,13.1922385 C6.71431042,15.3778647 8.88286672,17 11.4779819,17 C14.2924086,17 16.610045,15.093581 16.9599095,12.6291381 C16.9732664,12.5295607 16.9853307,12.4307643 16.9909319,12.3323584 C16.9935171,12.3011184 16.9943789,12.2690974 16.9961024,12.2362955 C17.0443595,11.1026752 16.636328,10.1553232 16.2257112,9.49889334 L16.2257112,9.49889334 Z" id="Fire-off" fill="#FB8F04"></path></g></g></g></g></svg></div></div><div class="ws-slider-visitors-t"><a href="#">Michael Thompson</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_2.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Barry Longnameeeee</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_3.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Jame Sanders</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_4.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Bob Salazar</a></div></li><li><div class="ws-slider-visitors-ava ava-anonumous"><a href="#"></a></div><div class="ws-slider-visitors-t"><a href="#">Anonumous</a></div></li><li><div class="ws-slider-visitors-ava no-ava"><a href="#">SS</a></div><div class="ws-slider-visitors-t"><a href="#">Susie Sanches</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_1.png"/></a><div class="ws-slider-visitors-ava-fire"><svg width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="path-1" cx="11.5" cy="11.5" r="11.5"></circle><mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="23" height="23" fill="white"><use xlink:href="#path-1"></use></mask></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Welcome-screen-1" transform="translate(-893.000000, -252.000000)"><g id="Group-14" transform="translate(893.000000, 252.000000)"><g id="Group-16"><use id="Oval-10" stroke="#FB8F04" mask="url(#mask-2)" stroke-width="2" fill="#FFFFFF" xlink:href="#path-1"></use><path d="M16.2257112,9.49889334 C15.9361682,9.07871578 15.3066708,8.52030136 14.8279769,8.12316328 C14.7310317,8.04350136 14.629347,8.04506336 14.5655786,8.08333232 C14.4324405,8.15088875 14.4694951,8.26921012 14.4694951,8.26921012 L14.4617395,8.26491463 C14.7193983,8.69915017 14.8857132,9.20055165 14.9042405,9.85346697 C14.9085492,10.2084311 14.8839897,10.4567888 14.883128,10.4614748 C14.873218,10.5157543 14.8620155,10.5633952 14.8512438,10.6059597 C14.8184978,10.7504445 14.6013406,11.1764796 14.2932703,11.0593297 C13.9852,10.9425703 13.9666727,10.4950578 13.9666727,10.4950578 C13.9666727,10.4950578 13.9640875,10.4962293 13.9623641,10.4962293 C13.7258178,8.01030889 12.4612216,6.53773493 11.4913388,5.76532674 C11.490477,5.76454574 11.4891844,5.76337424 11.4883227,5.76259324 C11.4878918,5.76220274 11.4865992,5.76142174 11.4853066,5.76025024 C11.0962332,5.45175557 10.7580022,5.25533427 10.5524784,5.14872788 C10.5296424,5.13818439 10.5059447,5.1276409 10.475784,5.11006842 C10.4266651,5.08117145 10.3883179,5.06789447 10.3465237,5.05032199 C10.3473855,5.05071249 10.3473855,5.05149348 10.3473855,5.05149348 C10.3198099,5.038607 10.2913727,5.02845401 10.2629354,5.01634852 C10.078955,4.96558357 9.98804194,5.04095 9.94280085,5.1338889 C9.94107738,5.14169889 9.90445363,5.3283577 10.0470708,5.7055803 C10.0475017,5.7059708 10.0470708,5.7059708 10.0475017,5.7063613 C10.440022,6.67089529 10.9182849,8.37776901 10.4167551,10.2072596 C10.3223951,10.5122398 10.0164792,10.735996 9.89109674,10.735996 C9.44730318,10.7769985 9.24221024,10.4817808 9.16120714,10.311523 C9.14698851,10.275597 9.12932294,10.2420141 9.11682779,10.2029641 C9.11682779,10.2017926 9.11510432,10.1963256 9.11510432,10.1963256 C8.84925905,9.33683601 9.1749949,8.05092085 9.40292383,7.3335731 C9.5558818,6.80288415 8.83719476,7.3339636 8.83719476,7.3339636 L8.83460955,7.3355256 L8.83460955,7.3355256 C8.693285,7.44330349 8.54118876,7.56552986 8.38090604,7.70064272 L8.3800443,7.69556622 C8.17753656,7.86348105 7.90996783,8.0966093 7.63464347,8.36332052 C7.48556331,8.50780537 5.50012572,10.4880288 6.11928236,13.1922385 C6.71431042,15.3778647 8.88286672,17 11.4779819,17 C14.2924086,17 16.610045,15.093581 16.9599095,12.6291381 C16.9732664,12.5295607 16.9853307,12.4307643 16.9909319,12.3323584 C16.9935171,12.3011184 16.9943789,12.2690974 16.9961024,12.2362955 C17.0443595,11.1026752 16.636328,10.1553232 16.2257112,9.49889334 L16.2257112,9.49889334 Z" id="Fire-off" fill="#FB8F04"></path></g></g></g></g></svg></div></div><div class="ws-slider-visitors-t"><a href="#">Michael Thompson</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_2.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Barry Longnameeeee</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_3.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Jame Sanders</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_4.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Bob Salazar</a></div></li><li><div class="ws-slider-visitors-ava ava-anonumous"><a href="#"></a></div><div class="ws-slider-visitors-t"><a href="#">Anonumous</a></div></li><li><div class="ws-slider-visitors-ava no-ava"><a href="#">SS</a></div><div class="ws-slider-visitors-t"><a href="#">Susie Sanches</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_1.png"/></a><div class="ws-slider-visitors-ava-fire"><svg width="23px" height="23px" viewBox="0 0 23 23" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><circle id="path-1" cx="11.5" cy="11.5" r="11.5"></circle><mask id="mask-2" maskContentUnits="userSpaceOnUse" maskUnits="objectBoundingBox" x="0" y="0" width="23" height="23" fill="white"><use xlink:href="#path-1"></use></mask></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Welcome-screen-1" transform="translate(-893.000000, -252.000000)"><g id="Group-14" transform="translate(893.000000, 252.000000)"><g id="Group-16"><use id="Oval-10" stroke="#FB8F04" mask="url(#mask-2)" stroke-width="2" fill="#FFFFFF" xlink:href="#path-1"></use><path d="M16.2257112,9.49889334 C15.9361682,9.07871578 15.3066708,8.52030136 14.8279769,8.12316328 C14.7310317,8.04350136 14.629347,8.04506336 14.5655786,8.08333232 C14.4324405,8.15088875 14.4694951,8.26921012 14.4694951,8.26921012 L14.4617395,8.26491463 C14.7193983,8.69915017 14.8857132,9.20055165 14.9042405,9.85346697 C14.9085492,10.2084311 14.8839897,10.4567888 14.883128,10.4614748 C14.873218,10.5157543 14.8620155,10.5633952 14.8512438,10.6059597 C14.8184978,10.7504445 14.6013406,11.1764796 14.2932703,11.0593297 C13.9852,10.9425703 13.9666727,10.4950578 13.9666727,10.4950578 C13.9666727,10.4950578 13.9640875,10.4962293 13.9623641,10.4962293 C13.7258178,8.01030889 12.4612216,6.53773493 11.4913388,5.76532674 C11.490477,5.76454574 11.4891844,5.76337424 11.4883227,5.76259324 C11.4878918,5.76220274 11.4865992,5.76142174 11.4853066,5.76025024 C11.0962332,5.45175557 10.7580022,5.25533427 10.5524784,5.14872788 C10.5296424,5.13818439 10.5059447,5.1276409 10.475784,5.11006842 C10.4266651,5.08117145 10.3883179,5.06789447 10.3465237,5.05032199 C10.3473855,5.05071249 10.3473855,5.05149348 10.3473855,5.05149348 C10.3198099,5.038607 10.2913727,5.02845401 10.2629354,5.01634852 C10.078955,4.96558357 9.98804194,5.04095 9.94280085,5.1338889 C9.94107738,5.14169889 9.90445363,5.3283577 10.0470708,5.7055803 C10.0475017,5.7059708 10.0470708,5.7059708 10.0475017,5.7063613 C10.440022,6.67089529 10.9182849,8.37776901 10.4167551,10.2072596 C10.3223951,10.5122398 10.0164792,10.735996 9.89109674,10.735996 C9.44730318,10.7769985 9.24221024,10.4817808 9.16120714,10.311523 C9.14698851,10.275597 9.12932294,10.2420141 9.11682779,10.2029641 C9.11682779,10.2017926 9.11510432,10.1963256 9.11510432,10.1963256 C8.84925905,9.33683601 9.1749949,8.05092085 9.40292383,7.3335731 C9.5558818,6.80288415 8.83719476,7.3339636 8.83719476,7.3339636 L8.83460955,7.3355256 L8.83460955,7.3355256 C8.693285,7.44330349 8.54118876,7.56552986 8.38090604,7.70064272 L8.3800443,7.69556622 C8.17753656,7.86348105 7.90996783,8.0966093 7.63464347,8.36332052 C7.48556331,8.50780537 5.50012572,10.4880288 6.11928236,13.1922385 C6.71431042,15.3778647 8.88286672,17 11.4779819,17 C14.2924086,17 16.610045,15.093581 16.9599095,12.6291381 C16.9732664,12.5295607 16.9853307,12.4307643 16.9909319,12.3323584 C16.9935171,12.3011184 16.9943789,12.2690974 16.9961024,12.2362955 C17.0443595,11.1026752 16.636328,10.1553232 16.2257112,9.49889334 L16.2257112,9.49889334 Z" id="Fire-off" fill="#FB8F04"></path></g></g></g></g></svg></div></div><div class="ws-slider-visitors-t"><a href="#">Michael Thompson</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_2.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Barry Longnameeeee</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_3.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Jame Sanders</a></div></li><li><div class="ws-slider-visitors-ava"><a href="#"><img src="imgs/ava_80_4.png"/></a></div><div class="ws-slider-visitors-t"><a href="#">Bob Salazar</a></div></li><li><div class="ws-slider-visitors-ava ava-anonumous"><a href="#"></a></div><div class="ws-slider-visitors-t"><a href="#">Anonumous</a></div></li><li><div class="ws-slider-visitors-ava no-ava"><a href="#">SS</a></div><div class="ws-slider-visitors-t"><a href="#">Susie Sanches</a></div></li></ul>';
		return htmlCode;
	},
	initSlider: function($slider){
		$slider.bxSlider({
		  slideWidth: 80,
		  minSlides: 5,
		  maxSlides: 30,
		  slideMargin: 20,
		  moveSlides: 5,
		  pager: false,
		});
	},
	addChart1: function($box){
		var options = {
			chart: {
				marginTop: 10,
				height: 272,
				style: {
					fontFamily: '"Open Sans", Arial, Helvetica, sans-serif',
					fontSize: '14px'
				}
			},
			credits: {
				enabled: false
			},
			title: {
				text: '',
			},
			xAxis: {
				categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
				tickColor: '#d8d8d8',
				lineColor: '#d8d8d8',
				tickWidth: 1,
				labels: {
					style: {
						fontSize: '13px',
						color: '#333333'
					}
				}
			},
			yAxis: {
				title: {
					text: ''
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#d8d8d8'
				}],
				labels: {
					style: {
						fontSize: '13px',
						color: '#333333'
					}
				}
			},
			tooltip: {
				valueSuffix: ''
			},
			series: [{
				showInLegend: false,
				name: 'Email',
				data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
			}, {
				showInLegend: false,
				name: 'Forms',
				data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
			}, {
				showInLegend: false,
				name: 'Landing Page',
				data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
			}, {
				showInLegend: false,
				name: 'Surveys',
				data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
			}]
		};
		$box.highcharts(options);
	},
	addChart2: function($box){
		var options = {
			chart: {
				type: 'bar',
				marginTop: 10,
				height: 245,
				style: {
					fontFamily: '"Open Sans", Arial, Helvetica, sans-serif',
					fontSize: '14px'
				}
			},
			credits: {
				enabled: false
			},
			title: {
				text: '', 
			},
			xAxis: {
				categories: ['Opens', 'Clicks', 'Unsubscribes', 'Bounces'],
				tickColor: '#d8d8d8',
				lineColor: '#d8d8d8',
				tickWidth: 1,
				labels: {
					style: {
						fontSize: '13px',
						color: '#333333'
					}
				}
			},
			yAxis: {
				min: 0,
				 title: {
					text: ''
				},
				plotLines: [{
					value: 0,
					width: 1,
					color: '#d8d8d8'
				}],
				labels: {
					style: {
						fontSize: '13px',
						color: '#333333'
					}
				}
			},
			plotOptions: {
				series: {
					stacking: 'normal'
				}
			},
			series: [{
				showInLegend: false,
				name: 'Total',
				data: [8, 0, 0, 0]
			}, {
				showInLegend: false,
				name: 'Total',
				data: [0, 9, 0, 0]
			}, {
				showInLegend: false,
				name: 'Total',
				data: [0, 0, 9, 0]
			}, {
				showInLegend: false,
				name: 'Total',
				data: [0, 0, 0, 7]
			}]
		};
		$box.highcharts(options);
	}
}
$(document).ready(function() {
    ws.init();
	ws.wsDropdown();
	$(window).resize(function(){
        ws.updateCharts( $('.ws-white-box-c') );
    });
    $('.toggle-nav-admin').on('click', function(){
        ws.updateCharts( $('.ws-white-box-c') );
    });
	ws.videoSearchInit();
	ws.blocksToggleInit();
	ws.addNewBlock();
	
	//Charts
	ws.addChart1($('.ws-chart-box').eq(0));
	ws.addChart1($('.ws-chart-box').eq(1));
	ws.addChart2($('#ws-chart-3'));
});