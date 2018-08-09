/*jQuery.expr[':'].Contains = function(a, i, m) { 
		return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase()) >= 0; 
	};*/
var pageBuilderCreate = {
	init: function () {
		pageBuilderCreate.searchPage();

		$('.list-pages').on('dblclick', '.item__title', function (e) {
			var $item = $(this).parents('.item');

			if (!$item.hasClass('item--edit'))
				$(this).siblings('.item__edit').trigger('click');
		});
		$('.list-pages').on('click', '.item__edit', function (e) {
			e.preventDefault();
			var $item = $(this).parents('.item');
			var $title = $item.find('.item__title');
			var val = $title.text();

			if (!$item.hasClass('item--edit')) {
				$item.addClass('item--edit');
				$title.html('<input type="text" data-default-title="' + val + '" class="txt-field" value="' + val + '"/>');
				$title.find('.txt-field').focus();

				$('.list-pages .item__title .txt-field').change(function () {
					pageBuilderCreate.editTitle($(this));
				});
				$('.list-pages .item__title .txt-field').on('blur', function () {
					pageBuilderCreate.editTitle($(this));
				});

			}
		});
		$('.list-pages').on('click', '.item__remove', function (e) {
			e.preventDefault();
			$(this).parents('.item').remove();
		});
	},
	searchPage: function () {
		$(".pb-search-page .txt-field").on("keyup", function () {
			var searchText = $(this).val();
			var $list = $('.list-pages .item:not(.item--new-page)');

			if (searchText != "") {
				$list.hide();
				$list.find('.item__title:Contains("' + searchText + '")').each(function () {
					$(this).parents('.item').show();
				});
			} else {
				$list.show();
			}

		});
	},
	editTitle: function ($this) {
		var val = $.trim($this.val());

		if (val === '')
			val = $this.attr('data-default-title');

		$this.parents('.item').removeClass('item--edit');
		$this.parent().html(val);
	}
}
$(document).ready(function () {
	pageBuilderCreate.init();
});