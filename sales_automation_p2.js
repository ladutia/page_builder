jQuery.expr[":"].Contains = function (a, i, m) {
  return (
    jQuery(a)
      .text()
      .toUpperCase()
      .indexOf(m[3].toUpperCase()) >= 0
  );
};
//saP2 - sales Automation Phase 2
var saP2 = {
  init: function () {
    $(".sub-item-text .text").dotdotdot({
      height: "watch",
      watch: true
    });

    $(window).resize(function () {
      saP2.heightContentTabPlan();
    });

    saP2.heightContentTabPlan();
    saP2.dragDropElements();

    /*$(".plan-list").on(
      "change",
      ".plan-list-item-head .cmn-toggle",
      function() {
        var isChecked = false;
        var $box = $(this).parents(".plan-list-item");
        var $textBox = $box.find(".sub-item-text .text");

        $(this).is(":checked")
          ? $box.removeClass("hide-left-inf")
          : $box.addClass("hide-left-inf");
      }
    );*/

    $(".plan-list").on("click", ".plan-list-item-head", function (e) {
      e.stopPropagation();
      var $box = $(this).parents(".plan-list-item");
      $box.find(".plan-list-item-content").slideToggle(function () {
        $box.toggleClass("close");
      });
    });

    $(".plan-list").on("click", ".ll-switch", function (e) {
      e.stopPropagation();
    });

    saP2.addCircleChart("chart-1", 575);
    saP2.addCircleChart("chart-2", 500);
    saP2.addCircleChart("chart-3", 100);

    $(".btn-reward").on("click", function () {
      $(this).toggleClass("ll-active");
      $(".plan-settings .wrap-charts").toggle();
    });

    $(".btn-stats").on("click", function () {
      var $this = $(this);
      var $box = $(".plan-stats");

      $this.toggleClass("ll-active");

      $this.hasClass("ll-active") ? $box.show() : $box.hide();
    });

    $(".btn-percent").on("click", function () {
      $(this).toggleClass("ll-active");
      $(".plan-list").toggleClass("show-list-tags-percent");
    });

    saP2.addActionPlanListItem();
    saP2.zoomInfo();

    $(".collapse-actions").on("click", function (e) {
      e.preventDefault();
      $(".plan-list-item:not(.close) .plan-list-item-head").trigger("click");
    });

    email_popups.init();
  },
  dragDropElements: function () {
    $(".plan-element").draggable({
      helper: "clone",
      connectToSortable: ".plan-list",
      refreshPositions: true,
      snap: true
    });

    $(".plan-list")
      .sortable({
        cursor: "move",
        handle: ".move",
        tolerance: "pointer",
        connectWith: ".plan-list",
        placeholder: "db-placeholder-element",
        beforeStop: function (event, ui) {
          if (ui.item.hasClass("plan-element")) saP2.addItemPlan(ui.item);
        }
      })
      .disableSelection();
  },
  addItemPlan: function (el) {
    var $el = $(el),
      type = $el.data("type"),
      html = null,
      id = new Date().getTime();

    html =
      '<div class="plan-list-item hide-left-inf sub-item-single plan-list-item-added">' +
      '<div class="plan-list-item-head clearfix">' +
      '<div class="ll-switch switch-small">' +
      '<div class="switch">' +
      '<input checked id="swith-item-' +
      id +
      '" name="switch-plan-action" class="cmn-toggle cmn-toggle-round" type="checkbox">' +
      '<label for="swith-item-' +
      id +
      '"></label>' +
      "</div>" +
      "</div>" +
      '<div class="icn icn-' +
      type +
      '"></div>' +
      '<div class="t">' +
      'Day <span class="day-edit">1</span> <div class="ll-actions-small-dropdown dropdown-at-after ll-actions-small-dropdown-orange ll-default-dd"> <a href="#" class="t-toggle-btn">at</a> <div class="ll-actions-dropdown"> <ul> <li> <a href="#" value="at">At</a> </li> <li> <a href="#" value="after">After</a> </li> </ul> </div> </div> <span class="time-edit">4:30 PM</span> <span class="after-time-edit"> <span class="after-text-1">2</span> <span class="after-text-2">days</span> </span>' +
      "</div>" +
      '<div class="ll-actions-small-dropdown ll-actions-small-dropdown-orange ll-default-dd ll-fr">' +
      '<a href="#" class="t-btn-gray t-toggle-btn">' +
      '<i class="icn" />' +
      "</a>" +
      '<div class="ll-actions-dropdown">' +
      "<ul>" +
      "<li>" +
      '<a href="#">Edit</a>' +
      "</li>" +
      "<li>" +
      '<a href="#" class="plan-list-item-delete">Delete</a>' +
      "</li>" +
      "<li>" +
      '<a href="#">Close</a>' +
      "</li>" +
      "<li>" +
      '<a href="#">View</a>' +
      "</li>" +
      "<li>" +
      '<a href="#">Split</a>' +
      "</li>" +
      "<li>" +
      '<a href="#">Test</a>' +
      "</li>" +
      "<li>" +
      '<a href="#">Settings</a>' +
      "</li>" +
      "<li>" +
      '<a href="#" class="plan-list-item-add-variant">Add Variant</a>' +
      "</li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="plan-list-item-content">' +
      '<div class="sub-item">' +
      '<div class="sub-item-letter">A</div>' +
      '<div class="sub-item-switch-time">' +
      '<div class="ll-switch switch-small">' +
      '<div class="switch">' +
      '<input checked id="swith-item-' +
      id +
      '-1" name="switch-plan-action" class="cmn-toggle cmn-toggle-round" type="checkbox">' +
      '<label for="swith-item-' +
      id +
      '-1"></label>' +
      "</div>" +
      "</div>" +
      '<div class="time time-edit">3:55 PM</div>' +
      "</div>" +
      '<div class="sub-item-text">' +
      '<div class="sub-item-text-inner">' +
      '<div class="h">Marketing to Applications, Students, and/or Alumni can you believe this is еhe best I have ever</div>' +
      '<div class="text">Hi %%%FirstName%%, I really wanted to reach out to you ' +
      "because I thougnt you would be a good fit for our software. There " +
      "are so many incredible things we could do together. Isn’t that the " +
      "best? I really wanted to reach out to you because I thougnt you would " +
      "be a good fit for our software. There are so many incredible things " +
      "we could do together. Isn’t that the best? I really wanted to reach " +
      "out to you because I thougnt you would be a good fit for our software. " +
      "There are so many incredible things we could do together. Isn’t that " +
      "the best? I really wanted to reach out to you because I thougnt you " +
      "would be a good fit for our software. There are so many incredible " +
      "things we could do together. Isn’t that the best?" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="ll-actions-small-dropdown ll-actions-small-dropdown-orange ll-default-dd ll-fr">' +
      '<a href="#" class="t-btn-gray t-toggle-btn">' +
      '<i class="icn" />' +
      "</a>" +
      '<div class="ll-actions-dropdown">' +
      "<ul>" +
      "<li>" +
      '<a href="#" class="plan-list-sub-item-delete">' +
      "Delete" +
      "</a>" +
      "</li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>";

    $el.replaceWith(html);
    $(".plan-list-item-added .sub-item-text .text").dotdotdot({
      height: "watch",
      watch: true
    });
    pages.dropdownActions();
    saP2.addActionPlanListItem();
    saP2.newMessage(type);
  },
  addActionPlanListItem: function () {
    $(".plan-list-item-add-variant")
      .off("click.addVariantPlanList")
      .on("click.addVariantPlanList", function (e) {
        e.preventDefault();
        saP2.addNewVariant($(this).parents(".plan-list-item"));
      });

    $(".plan-list-item-delete")
      .off("click.removeItemPlanList")
      .on("click.removeItemPlanList", function (e) {
        e.preventDefault();
        $(this)
          .parents(".plan-list-item")
          .remove();
      });

    $(".plan-list-sub-item-delete")
      .off("click.removeSubItemPlanList")
      .on("click.removeSubItemPlanList", function (e) {
        e.preventDefault();
        var $this = $(this);
        var $box = $this.parents(".plan-list-item");
        var subCount = $this
          .parents(".plan-list-item-content")
          .find(".sub-item").length;

        if (subCount > 1) {
          $this.parents(".sub-item").remove();
          saP2.updatedLetter($box);

          if (subCount == 2) $box.addClass("sub-item-single");
        }
      });

    $(".plan-list .day-edit")
      .off("click")
      .on("click", function (e) {
        e.stopPropagation();
        saP2.editDay($(this));
      });

    $(".plan-list .time-edit")
      .off("click.time-edit")
      .on("click.time-edit", function (e) {
        e.stopPropagation();
        saP2.editTime($(this));
      });

    $('.dropdown-at-after').off('mouseenter').on('mouseenter', function (e) {
      e.stopPropagation();
      var $this = $(this);

      if (!$this.hasClass('ll-opened'))
        $this.addClass('ll-opened');
    });
    $('.dropdown-at-after .ll-actions-dropdown').off('mouseleave').on('mouseleave', function () {
      var $parent = $(this).parent();

      if ($parent.hasClass('ll-opened')) {
        $parent.removeClass('ll-opened');
      }
    });
    $('.dropdown-at-after .ll-actions-dropdown li a').off('click').on('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      var $this = $(this);
      var val = $this.attr('value');
      var $dropdown = $this.parents('.dropdown-at-after');
      var $btn = $dropdown.find('.t-toggle-btn');
      var $wrapText = $this.parents('.t');

      $dropdown.removeClass('ll-opened');
      $btn.text(val);

      if (val == 'at')
        $wrapText.removeClass('show-after-time');
      else
        $wrapText.addClass('show-after-time');
    });
    $(".plan-list .after-time-edit")
      .off("click.after-time-edit")
      .on("click.after-time-editt", function (e) {
        e.stopPropagation();
        saP2.editAfterTime($(this));
      });
  },
  editDay: function ($this) {
    var day = $this.text();

    $this.html('<input type="text" class="txt-field" value="' + day + '">');
    $this
      .find(".txt-field")
      .on("click", function (e) {
        e.stopPropagation();
      })
      .focus();
    $this.find(".txt-field").on("blur", function (e) {
      saP2.addNewDayTimeItem($(this));
    });
    $this.find(".txt-field").on("keyup", function (e) {
      if (e.keyCode === 13) saP2.addNewDayTimeItem($(this));
    });
  },
  editTime: function ($this) {
    var time = $this.text();

    $this.html(
      '<div class="wrap-edit-time"><input type="text" class="txt-field" value="' +
      time +
      '"></div>'
    );

    $this
      .find(".txt-field")
      .datetimepicker({
        datepicker: false,
        format: "g:i A",
        formatTime: "g:i A",
        inline: true
      })
      .focus();
    $this.find(".txt-field").on("click", function (e) {
      e.stopPropagation();
    });
    $this.find(".txt-field").on("blur", function (e) {
      saP2.addNewDayTimeItem($(this), true);
    });
    $this.find(".txt-field").on("keyup", function (e) {
      if (e.keyCode === 13) saP2.addNewDayTimeItem($(this), true);
    });
  },
  editAfterTime: function ($this) {
    var number = $this.find('.after-text-1').text();
    var dropdownVal = $this.find('.after-text-2').text();
    $this.html(
      '<div class="wrap-edit-after-time"><input type="text" class="txt-field" value="' + number + '"><select><option value="minutes">minutes</option><option value="hours">hours</option></select><a href="#" class="t-btn-orange btn-save-after-time">Save</a></div>'
    );

    $this.find("select").chosen();
    $this.find("select").find('option[value="' + dropdownVal + '"]').attr('selected', true);
    $this.find("select").trigger('liszt:updated');

    $this.find(".wrap-edit-after-time").on("click", function (e) {
      e.stopPropagation();
    });

    $this.find('.btn-save-after-time').on('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $box = $(this).parents('.after-time-edit');
      var valNumber = parseInt($box.find('.txt-field').val());
      var valDropdown = $box.find('select').val();

      if (valNumber === "" || isNaN(valNumber)) valNumber = '10';

      $box.html('<span class="after-text-1">' + valNumber + '</span> <span class="after-text-2">' + valDropdown + '<span>');
    });
  },
  addNewDayTimeItem: function ($input, isTime) {
    var val = $input.val();

    if (isTime) {
      if (val === "") val = "00:00 AM";

      $input.datetimepicker("destroy");
    } else {
      val = parseInt(val);

      if (val === "" || isNaN(val)) val = 0;
    }

    $input.parent().html(val);
  },
  addNewVariant: function ($box) {
    var id = new Date().getTime();
    var html =
      '<div class="sub-item">' +
      '<div class="sub-item-letter">A</div>' +
      '<div class="sub-item-switch-time">' +
      '<div class="ll-switch switch-small">' +
      '<div class="switch">' +
      '<input checked id="swith-item-' +
      id +
      '-1" name="switch-plan-action" class="cmn-toggle cmn-toggle-round" type="checkbox">' +
      '<label for="swith-item-' +
      id +
      '-1"></label>' +
      "</div>" +
      "</div>" +
      '<div class="time time-edit">3:55 PM</div>' +
      "</div>" +
      '<div class="sub-item-text">' +
      '<div class="sub-item-text-inner">' +
      '<div class="h">Marketing to Applications, Students, and/or Alumni can you believe this is еhe best I have ever</div>' +
      '<div class="text">Hi %%%FirstName%%, I really wanted to reach out to you ' +
      "because I thougnt you would be a good fit for our software. There " +
      "are so many incredible things we could do together. Isn’t that the " +
      "best? I really wanted to reach out to you because I thougnt you would " +
      "be a good fit for our software. There are so many incredible things " +
      "we could do together. Isn’t that the best? I really wanted to reach " +
      "out to you because I thougnt you would be a good fit for our software. " +
      "There are so many incredible things we could do together. Isn’t that " +
      "the best? I really wanted to reach out to you because I thougnt you " +
      "would be a good fit for our software. There are so many incredible " +
      "things we could do together. Isn’t that the best?" +
      "</div>" +
      "</div>" +
      '<div class="ll-actions-small-dropdown ll-actions-small-dropdown-orange ll-default-dd ll-fr">' +
      '<a href="#" class="t-btn-gray t-toggle-btn">' +
      '<i class="icn" />' +
      "</a>" +
      '<div class="ll-actions-dropdown">' +
      "<ul>" +
      "<li>" +
      '<a href="#" class="plan-list-sub-item-delete">' +
      "Delete" +
      "</a>" +
      "</li>" +
      "</ul>" +
      "</div>" +
      "</div>" +
      "</div>";

    $box.find(".plan-list-item-content").prepend(html);
    $box.find(".sub-item-text:first .text").dotdotdot({
      height: "watch",
      watch: true
    });
    saP2.updatedLetter($box);
    $box.removeClass("hide-left-inf sub-item-single");
    pages.dropdownActions();
    saP2.addActionPlanListItem();
  },
  updatedLetter: function ($box) {
    var startCodeLetter = 65;
    $box.find(".sub-item-letter").each(function (i) {
      $(this).text(String.fromCharCode(startCodeLetter + i));
    });
  },
  heightContentTabPlan: function () {
    $(".wrap-plan-list-items").height(function () {
      var offsetBottom = 20,
        height = $("body").height() - $(this).offset().top - offsetBottom;

      if (height < 720) height = 720;

      return height;
    });
  },
  addCircleChart: function (id, goal) {
    var goal = goal || 0;

    $("#" + id).pieChart({
      barColor: "#5FAE43",
      trackColor: "#e5e5e5",
      lineCap: "butt",
      lineWidth: 23,
      size: 152,
      onStep: function (from, to, percent) {
        $(this.element)
          .find(".pie-value")
          .html(
            '<div class="percent">' +
            Math.round(percent) +
            '%<div class="goal">Goal: ' +
            goal +
            "</div></div>"
          );
      }
    });
  },
  zoomInfo: function () {
    var $panel = $(".zoom-info");

    $(".zi-start-list-items").on("click", ".item", function () {
      $(this)
        .addClass("selected")
        .siblings(".item")
        .removeClass("selected");
    });

    $(".suspects-show-more").on("click", function () {
      for (i = 0; i < 5; i++) {
        showMoreSuspects();
      }
    });

    $(".list-suspects").on("click", ".suspects-item .btn-add", function (e) {
      e.preventDefault();
      $(this).replaceWith(
        '<div class="icn-tick"> <svg width="24px" height="21px" viewBox="0 0 24 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Zoominfo-Find-Suspects" transform="translate(-1349.000000, -509.000000)" fill-rule="nonzero" fill="#6EB555"> <path d="M1372.4284,510.530665 L1370.27552,509.203791 C1369.67985,508.838049 1368.86372,508.978392 1368.46504,509.514245 L1357.91171,523.625048 L1353.06186,519.227649 C1352.5553,518.768346 1351.7298,518.768346 1351.22324,519.227649 L1349.37992,520.899 C1348.87336,521.358303 1348.87336,522.106796 1349.37992,522.570353 L1356.83761,529.33231 C1357.25505,529.710809 1357.91171,530 1358.50269,530 C1359.09368,530 1359.68936,529.664029 1360.07397,529.157945 L1372.77549,512.167995 C1373.17886,511.632142 1373.02408,510.896406 1372.4284,510.530665 Z" id="Shape"></path> </g> </g> </svg> </div>'
      );
    });

    $(".btn-full-width-panel").on("click", function () {
      $panel.toggleClass("full-width");
    });

    $(".btn-close-panel").on("click", function () {
      $panel.removeClass("full-width");
      $panel.hide().css("right", "-380px");
    });

    $(".show-zoom-info-panel").on("click", function (e) {
      e.preventDefault();
      $panel.show(1).animate(
        {
          right: 0
        },
        300
      );
    });

    $(".btn-find-suspects").on("click", function (e) {
      e.preventDefault();

      var step = parseInt($panel.attr("data-step"));
      var newStep = step + 1;

      if (step < 2) {
        $panel.attr("data-step", newStep);
        showContent(newStep);
      }
    });

    $panel.find(".zi-bottom .btn-cancel").on("click", function (e) {
      e.preventDefault();

      var step = parseInt($panel.attr("data-step"));
      var newStep = step - 1;

      if (step > 0) {
        $panel.attr("data-step", newStep);
        showContent(newStep);
      }
    });

    function showContent(step) {
      $panel.find(".zi-content").hide();

      $(".zi-bottom").removeClass("last-step");

      if (step === 0) $(".zi-content-start").show();
      else if (step === 1) $(".wrap-zi-general-search").show();
      else if (step === 2) {
        $(".zi-content-suspects").show();
        $(".zi-bottom").addClass("last-step");
      }
    }

    function showMoreSuspects() {
      $(".suspects-show-more").before(
        '<div class="suspects-item">' +
        '<div class="ava">' +
        '<img src="imgs/ava_80_1.png" />' +
        "</div>" +
        '<div class="name">Jamie' +
        "<span>Sanders</span>" +
        "</div>" +
        "<p>SEO and Co-Founder</p>" +
        "<p>Equinix Inc.</p>" +
        "<p>Porthmouth, Porthmouth 2</p>" +
        '<div class="updated">' +
        "<div>Updated</div>" +
        "<div>May 21, 2017</div>" +
        "</div>" +
        '<a href="#" class="t-btn-orange btn-add">' +
        '<i class="icn">' +
        '<svg width="18px" height="18px" viewBox="0 0 18 18" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">' +
        "<defs></defs>" +
        '<g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
        '<g id="Zoominfo-Find-Suspects" transform="translate(-1352.000000, -295.000000)" fill="#FFFFFF">' +
        '<g id="Group" transform="translate(1025.000000, 129.000000)">' +
        '<g id="Rectangle-36-+-Rectangle-2545" transform="translate(318.000000, 157.000000)">' +
        '<path d="M20.4,15.6 L20.4,10.600605 C20.4,10.0493594 19.9547189,9.6 19.4054369,9.6 L16.5945631,9.6 C16.0429687,9.6 15.6,10.0479861 15.6,10.600605 L15.6,15.6 L10.600605,15.6 C10.0493594,15.6 9.6,16.0452811 9.6,16.5945631 L9.6,19.4054369 C9.6,19.9570313 10.0479861,20.4 10.600605,20.4 L15.6,20.4 L15.6,25.399395 C15.6,25.9506406 16.0452811,26.4 16.5945631,26.4 L19.4054369,26.4 C19.9570312,26.4 20.4,25.9520139 20.4,25.399395 L20.4,20.4 L25.399395,20.4 C25.9506406,20.4 26.4,19.9547189 26.4,19.4054369 L26.4,16.5945631 C26.4,16.0429688 25.9520139,15.6 25.399395,15.6 L20.4,15.6 Z"' +
        'id="Rectangle-2545"></path>' +
        "</g>" +
        "</g>" +
        "</g>" +
        "</g>" +
        "</svg>" +
        "</i>" +
        "</a>" +
        "</div>"
      );
    }
  },
  newMessage: function (type) {
    var html = "";
    var isEmail = false;
    var htmlField =
      '<div class="t-field">' +
      '<div class="lb">Delivery:</div>' +
      '<div class="field-delivery">' +
      "Day " +
      '<span class="day-edit">1</span> ' +
      "at " +
      '<span class="time-edit">4:30 PM</span>' +
      "</div>" +
      "</div>" +
      '<div class="t-field">' +
      '<div class="lb">Additional Recepients:</div>' +
      '<div class="new-message__field-to">' +
      "<label>To:</label>" +
      '<select multiple data-placeholder=" ">' +
      "<option>Ryan Schefke</option>" +
      "<option>Emily Smith</option>" +
      "<option>Mr. Bob Sanders</option>" +
      "</select>" +
      '<div class="new-message__cc-bcc">' +
      '<a href="#" class="new-message__button-cc">Cc</a>' +
      '<a href="#" class="new-message__button-bcc">Bcc</a>' +
      "</div>" +
      "</div>" +
      '<div class="new-message__field-cc">' +
      "<label>Сс:</label>" +
      '<select multiple data-placeholder=" ">' +
      "<option>Ryan Schefke</option>" +
      "<option>Emily Smith</option>" +
      "<option>Mr. Bob Sanders</option>" +
      "</select>" +
      "</div>" +
      '<div class="new-message__field-bcc">' +
      "<label>Bcc:</label>" +
      '<select multiple data-placeholder=" ">' +
      "<option>Ryan Schefke</option>" +
      "<option>Emily Smith</option>" +
      "<option>Mr. Bob Sanders</option>" +
      "</select>" +
      "</div>" +
      "</div>" +
      '<div class="t-field">' +
      '<div class="lb">Task Priority:</div>' +
      "<select>" +
      "<option>Normal</option>" +
      "<option>High</option>" +
      "<option>Low</option>" +
      "</select>" +
      "</div>" +
      '<div class="t-field">' +
      '<div class="lb">Task Note:</div>' +
      '<textarea class="txt-field"></textarea>' +
      "</div>";

    if (type === "email" || type === "auto-email") isEmail = true;

    if (isEmail) {
      html =
        '<div class="drop-new-message-fade"></div>' +
        '<div class="drop-new-message-popup drop-new-message-popup--email">' +
        '<div class="new-message-popup-wrap">' +
        '<div class="drop-new-message">' +
        '<div class="drop-new-message__header">' +
        '<div class="drop-new-message__title">New Message</div>' +
        '<a href="javascript:void(0);" class="drop-new-message__btn-preview"></a>' +
        '<a href="javascript:void(0);" class="drop-new-message__btn-settings"></a>' +
        "</div>" +
        '<div class="drop-new-message__content">' +
        '<div class="new-message">' +
        '<div class="new-message__field-subject">' +
        '<input type="text" class="txt-field" placeholder="Subject"/>' +
        "</div>" +
        '<div class="new-message__field-message">' +
        '<textarea class="new-message__field-message-editor"></textarea>' +
        "</div>" +
        '<div class="new-message__actions">' +
        '<a href="#" class="drop-new-message__btn-cancel t-btn-gray">Cancel</a> ' +
        '<a href="#" class="drop-new-message__btn-save t-btn-orange">Save</a> ' +
        '<div class="new-message__btns-action">' +
        '<a href="javascript:void(0);" class="new-message__btn-attach ll_std_tooltip" title="Attach">' +
        '<svg width="21px" height="20px" viewBox="0 0 21 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-631.000000, -667.000000)" fill-rule="nonzero" class="svg-fill" fill="#939393"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><g id="if_attachment_2318448" transform="translate(81.493151, 10.625000) scale(1, -1) translate(-81.493151, -10.625000) translate(71.493151, 0.625000)"><path d="M5.45147824,12.3547113 C5.28210787,12.5726884 5.18999921,12.8373468 5.18999921,13.1123961 C5.18999921,13.4536704 5.33180247,13.773615 5.58704833,14.0189058 C6.06936861,14.4723385 6.88351983,14.502069 7.40935476,14.1080972 L16.154227,5.88698061 C16.6420302,5.4017313 16.9086204,4.76717452 16.9086204,4.09529086 C16.9086204,3.40207756 16.6193417,2.74619114 16.0975057,2.25560942 C15.0538338,1.27444598 13.2274078,1.27444598 12.1780637,2.25560942 L2.79636023,11.0860803 L2.80203236,11.0914127 C2.01927838,11.8272853 1.58819648,12.8084488 1.58819648,13.8536011 C1.58819648,14.8987535 2.01927838,15.8745845 2.80203236,16.6157895 C4.41858949,18.1355263 7.05045794,18.1355263 8.66701507,16.6211219 L18.4968169,7.3800554 L19.5972101,8.41454294 L9.56321166,17.8422438 L9.55753953,17.8369114 C8.47416264,18.7540859 7.10717924,19.2126731 5.73452372,19.2126731 C4.2711141,19.2126731 2.81337662,18.690097 1.70163908,17.6449446 C0.623934331,16.6317867 0.0283606514,15.2880194 0.0283606514,13.8536011 C0.0283606514,12.4885042 0.567213028,11.2033934 1.54849157,10.2062327 L1.53714731,10.1955679 L11.1287196,1.18912742 C11.9398342,0.447922438 13.0061947,0.0373268698 14.1406208,0.0373268698 C15.2977354,0.0373268698 16.3811123,0.458587258 17.197899,1.22645429 C18.0146858,1.99432133 18.4627841,3.01281163 18.4627841,4.10062327 C18.4627841,5.11911357 18.0657349,6.07894737 17.3453744,6.82548476 L17.3510465,6.83081717 L17.2262597,6.94813019 C17.2149154,6.95879501 17.2092433,6.96412742 17.197899,6.97479224 L8.61029377,15.0480609 L8.6159659,15.0533934 C8.57014345,15.0956183 8.52319607,15.1361717 8.47521372,15.1750507 L8.33235938,15.309349 L8.31682583,15.2947458 C7.7944164,15.6624994 7.17002737,15.8479224 6.54563835,15.8479224 C5.79691715,15.8479224 5.05386808,15.5813019 4.48665505,15.0480609 C3.352229,13.9815789 3.352229,12.2378809 4.48665505,11.1713989 L4.63015479,11.306304 L12.8269145,3.10954431 L13.8600444,4.14267421 L5.5497428,12.4529758 L5.45147824,12.3547113 Z" id="Attach"></path></g></g></g></g></g></svg>' +
        '<input type="file"/>' +
        "</a> " +
        '<a href="#" class="new-message__btn-trackable-peace-of-content ll_std_tooltip" title="Trackable peace of content"><svg width="18px" height="20px" viewBox="0 0 18 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-669.000000, -667.000000)" class="svg-fill" fill="#939393"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><g id="if_78_111113" transform="translate(109.342466, 1.375000)"><path d="M0,1.60412988 L0,17.6459143 C0,18.5321783 0.752820884,19.25 1.68222881,19.25 L15.7704496,19.25 C16.3507104,19.25 16.8219178,18.8008648 16.8219178,18.2475126 C16.8219178,17.6939397 16.3507104,17.2448045 15.7704496,17.2448045 L2.94384256,17.2448045 C2.4811521,17.2448045 2.10279759,16.8837308 2.10279759,16.4426734 C2.10279759,16.0018367 2.48119839,15.6407188 2.94384256,15.6407188 L15.1395964,15.6407188 C16.0689581,15.6407188 16.8219178,14.9226763 16.8219178,14.0363682 L16.8219178,1.60412988 C16.8219178,0.71791003 16.0689581,4.41410496e-05 15.1395964,4.41410496e-05 L9.25205017,4.41410496e-05 L9.25205017,7.21489869 C9.25205017,7.31907157 9.21015992,7.42320031 9.13003616,7.50349288 C8.96627077,7.65975219 8.69669202,7.65975219 8.53283405,7.50349288 C8.42345655,7.39503832 6.72873009,6.05169376 6.72873009,6.05169376 C6.72873009,6.05169376 5.03404993,7.39503832 4.92457985,7.50349288 C4.76072188,7.65975219 4.49137457,7.65975219 4.32742403,7.50349288 C4.24757799,7.42320031 4.20545631,7.31907157 4.20545631,7.21489869 L4.20545631,0 L1.68222881,0 C0.752774596,0 0,0.71791003 0,1.60412988 Z" id="book"></path></g></g></g></g></g></svg></a> ' +
        '<a href="#" class="new-message__btn-template ll_std_tooltip" title="Template"><svg width="21px" height="20px" viewBox="0 0 21 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-701.000000, -667.000000)" fill-rule="nonzero" class="svg-fill" fill="#333333"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><g id="if_document_text_add_103511" transform="translate(141.584475, 1.375000)"><g id="document_x5F_text_x5F_add"><path d="M14.7191781,8.45736719 L14.7191781,3.359125 L11.2932894,0 L0,0 L0,19.25 L14.7191781,19.25 L14.7191781,19.2145078 C17.4784107,18.9137266 19.6243442,16.622375 19.6255708,13.8359375 C19.6243442,11.0482969 17.4784107,8.75634375 14.7191781,8.45736719 Z M11.038157,1.45157031 L13.2386741,3.609375 L11.038157,3.609375 L11.038157,1.45157031 L11.038157,1.45157031 Z M1.22659817,18.046875 L1.22659817,1.20192188 L9.81278539,1.20192188 L9.81278539,4.81189844 L13.4925799,4.81189844 L13.4925799,8.45736719 C12.4180799,8.57407031 11.4368014,8.99275781 10.6395126,9.625 L2.45319635,9.625 L2.45319635,10.828125 L9.51656193,10.828125 C9.26388271,11.1986875 9.06088071,11.6035391 8.90694264,12.03125 L2.45319635,12.03125 L2.45319635,13.234375 L8.62237186,13.234375 C8.59967979,13.4322891 8.58618721,13.6320078 8.58618721,13.8359375 C8.58618721,15.5377578 9.38838242,17.0548984 10.6401259,18.046875 L1.22659817,18.046875 Z M14.105879,17.9764922 C11.7747292,17.9710781 9.88883447,16.1212734 9.88331478,13.8359375 C9.88883447,11.5493984 11.7747292,9.69959375 14.105879,9.69417969 C16.4358022,9.69959375 18.3216969,11.5493984 18.3272166,13.8359375 C18.3216969,16.1212734 16.4358022,17.9710781 14.105879,17.9764922 Z M12.2659817,7.21875 L12.2659817,8.421875 L2.45319635,8.421875 L2.45319635,7.21875 L12.2659817,7.21875 Z M17.1723744,13.234375 L17.1723744,14.4375 L14.7204047,14.4375 L14.7204047,16.84375 L13.4925799,16.84375 L13.4925799,14.4375 L11.0393836,14.4375 L11.0393836,13.234375 L13.4925799,13.234375 L13.4925799,10.828125 L14.7204047,10.828125 L14.7204047,13.234375 L17.1723744,13.234375 Z" id="Template"></path></g></g></g></g></g></g></svg></a> ' +
        '<a href="#" class="new-message__btn-snippet ll_std_tooltip" title="Snippet"><svg width="18px" height="16px" viewBox="0 0 18 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-738.000000, -669.000000)" fill-rule="nonzero" class="svg-fill" fill="#939393"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><path d="M178.732877,18.5623185 C178.73936,18.5623185 178.745791,18.5624326 178.752169,18.5626594 C178.754769,18.5624321 178.748338,18.5623185 178.732877,18.5623185 Z M185.500188,10.0387202 L185.500188,3.43731848 L179.203998,3.43731848 L179.203998,9.57570999 L182.766338,9.57570999 L182.75125,10.2777006 C182.690848,13.088006 181.521655,15.1530414 179.203998,16.4903795 L179.203998,18.4937514 C183.414392,17.8015019 185.500188,15.0242318 185.500188,10.0387202 Z M196.025916,10.0387202 L196.025916,3.43731848 L189.736907,3.43731848 L189.736907,9.57570999 L193.299247,9.57570999 L193.284159,10.2777006 C193.223875,13.0824843 192.052389,15.1475808 189.736907,16.486248 L189.736907,18.4489199 C194.190939,17.4236648 196.025916,14.9516211 196.025916,10.0387202 Z" id="snippets" transform="translate(187.379396, 10.999989) scale(-1, -1) translate(-187.379396, -10.999989) "></path></g></g></g></g></svg></a> ' +
        '<a href="#" class="new-message__btn-name ll_std_tooltip" title="Insert Merge Field"><svg width="18px" height="19px" viewBox="0 0 18 19" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-774.000000, -668.000000)" fill-rule="nonzero" class="svg-fill" fill="#939393"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><path d="M214.479452,6.325 C214.479452,5.878125 214.574368,5.34047896 214.760547,4.984375 C214.946728,4.62827193 215.132908,4.18139693 215.508919,3.82180198 C215.881279,3.46569802 216.253639,3.196875 216.720915,3.01882302 C217.18819,2.84077193 217.750381,2.75 218.403836,2.75 C219.057292,2.75 219.619482,2.84077193 220.086758,3.01882302 C220.554033,3.196875 221.021309,3.46569802 221.302404,3.82180198 C221.674765,4.090625 221.95586,4.5375 222.050776,4.984375 C222.14204,5.43125 222.328221,5.878125 222.328221,6.325 L222.328221,7.21875 C222.328221,7.665625 222.236955,8.20327193 222.050776,8.559375 C221.860945,8.91547896 221.674765,9.36235396 221.302404,9.72194802 C220.926394,10.078052 220.554033,10.256104 220.086758,10.524927 C219.619482,10.702979 219.057292,10.79375 218.403836,10.79375 C217.750381,10.79375 217.18819,10.702979 216.720915,10.524927 C216.253639,10.346875 215.786364,10.078052 215.508919,9.72194802 C215.132908,9.453125 214.946728,9.00625 214.760547,8.65014693 C214.574368,8.29055198 214.479452,7.75639693 214.479452,7.21875 L214.479452,6.325 Z M216.910745,7.21875 C216.910745,7.39680198 216.910745,7.665625 217.00201,7.84367698 C217.00201,8.02172896 217.096925,8.20327193 217.283105,8.38132302 C217.378021,8.559375 217.5642,8.65014693 217.750381,8.73742698 C217.936561,8.82819802 218.122741,8.82819802 218.403836,8.82819802 C218.684932,8.82819802 218.871112,8.82819802 219.057292,8.73742698 C219.247123,8.65014693 219.433302,8.559375 219.524568,8.38132302 C219.619482,8.20327193 219.714398,8.02172896 219.805663,7.84367698 C219.900578,7.665625 219.900578,7.48757302 219.900578,7.21875 L219.900578,6.325 C219.900578,6.14694802 219.900578,5.878125 219.805663,5.70007302 C219.805663,5.52202193 219.714398,5.34047896 219.524568,5.25319802 C219.433302,5.07514693 219.247123,4.984375 219.057292,4.89360396 C218.871112,4.80632302 218.684932,4.71555198 218.403836,4.71555198 C218.122741,4.71555198 217.936561,4.71555198 217.750381,4.80632302 C217.5642,4.984375 217.378021,5.07514693 217.283105,5.25319802 C217.096925,5.34047896 217.00201,5.52202193 217.00201,5.70007302 C216.910745,5.878125 216.910745,6.14694802 216.910745,6.325 L216.910745,7.21875 Z M219.247123,19.106323 L217.469285,18.212573 L226.34752,4.62827193 L228.125357,5.52202193 L219.247123,19.106323 Z M223.452602,16.15625 C223.452602,15.709375 223.543867,15.171729 223.730047,14.815625 C223.919878,14.36875 224.197323,14.0126469 224.478418,13.653052 C224.854429,13.296948 225.226788,13.1188969 225.694064,12.850073 C226.161339,12.58125 226.723531,12.58125 227.376986,12.58125 C228.030441,12.58125 228.592633,12.6720219 229.059908,12.850073 C229.527184,13.028125 229.994459,13.296948 230.271904,13.653052 C230.647914,14.0126469 230.834094,14.36875 231.020275,14.815625 C231.206455,15.2625 231.30137,15.709375 231.30137,16.15625 L231.30137,17.05 C231.30137,17.496875 231.206455,18.0345219 231.020275,18.390625 C230.834094,18.8375 230.647914,19.193604 230.271904,19.553198 C229.899543,19.909302 229.527184,20.087354 229.059908,20.356177 C228.592633,20.534229 228.030441,20.625 227.376986,20.625 C226.723531,20.625 226.161339,20.534229 225.694064,20.356177 C225.226788,20.178125 224.759513,19.909302 224.478418,19.553198 C224.106057,19.193604 223.919878,18.8375 223.730047,18.390625 C223.543867,17.94375 223.452602,17.496875 223.452602,17.05 L223.452602,16.15625 Z M225.78898,17.05 C225.78898,17.228052 225.78898,17.496875 225.880244,17.674927 C225.975159,17.852979 226.066425,18.0345219 226.161339,18.212573 C226.256255,18.390625 226.442435,18.4813969 226.628615,18.568677 C226.814795,18.659448 227.000976,18.659448 227.282071,18.659448 C227.563166,18.659448 227.844261,18.659448 228.030441,18.568677 C228.216622,18.4813969 228.402802,18.390625 228.497717,18.212573 C228.592633,18.0345219 228.683897,17.852979 228.778812,17.674927 C228.870078,17.496875 228.870078,17.318823 228.870078,17.05 L228.870078,16.15625 C228.870078,15.978198 228.870078,15.709375 228.778812,15.531323 C228.683897,15.3532719 228.592633,15.171729 228.497717,14.993677 C228.402802,14.815625 228.216622,14.724854 228.030441,14.637573 C227.844261,14.546802 227.658082,14.546802 227.376986,14.546802 C227.09589,14.546802 226.90971,14.546802 226.723531,14.637573 C226.5337,14.724854 226.34752,14.815625 226.256255,14.993677 C226.161339,15.171729 226.066425,15.3532719 225.975159,15.531323 C225.880244,15.709375 225.880244,15.887427 225.880244,16.15625 L225.880244,17.05 L225.78898,17.05 Z" id="Name"></path></g></g></g></g></svg></a> ' +
        '<div class="new-message__list-action-btn">' +
        '<a href="#" class="toggle-list">' +
        "<span></span><span></span><span></span>" +
        "</a>" +
        '<div class="drop-list">' +
        "<ul>" +
        '<li idx="3" class="item__btn-signature"><svg class="svg" width="27px" height="20px" viewBox="0 0 27 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="Sales-automatin" transform="translate(-808.000000, -667.000000)" fill-rule="nonzero" class="svg-fill" fill="#979797"><g id="Group-12" transform="translate(560.000000, 661.000000)"><g id="Group-33" transform="translate(0.000000, 5.000000)"><path d="M265.639093,13.7366543 C265.59523,13.9369591 265.577104,14.0203626 265.551527,14.1401271 C264.916273,17.1146775 264.959884,18.4869644 266.782524,18.9604752 C268.664729,19.4494609 274.685634,18.2461254 274.757325,16.960799 C274.80325,16.1374136 272.466817,16.8107714 270.358542,17.0901845 C269.175744,17.2469425 268.343721,17.3562879 267.76496,17.1768689 C267.47658,17.0901845 267.480991,16.7731219 267.47658,16.6343426 C267.461821,16.1699352 267.553832,15.5445392 267.76496,14.5559413 C267.789623,14.4404569 267.807033,14.3603503 267.850177,14.1633215 C268.240274,12.3850614 268.326481,11.876352 268.253731,11.2141776 C268.087443,9.7006022 266.728808,9.26609434 265.205721,10.069492 C263.676876,10.8759269 262.856833,12.3088779 262.06087,14.7859094 C261.954223,15.117793 261.591656,16.3030719 261.626674,16.1901093 C261.259058,17.3760113 261.003567,17.9966527 260.723517,18.3432217 C260.554288,18.5526478 260.520954,18.5606288 260.190612,18.4144065 C259.783988,18.2344186 260.18627,16.4111371 261.900573,11.8810104 C262.006366,11.6012683 262.048782,11.4888638 262.112057,11.3203748 C263.143613,8.57356516 263.639093,6.95942893 263.788334,5.50506558 C264.01332,3.31257094 263.241119,1.78031564 261.210913,1.43833709 C257.694604,0.846031633 254.656249,4.4351749 251.385838,11.0638612 C250.212429,13.4422049 247.134635,19.5540482 248.43982,20.074194 C249.745005,20.5943397 252.298523,14.2555183 253.434533,11.9529784 C256.219607,6.30800613 258.856708,3.19285559 260.81187,3.52219335 C261.44234,3.62839291 261.667281,4.07473702 261.541319,5.30223714 C261.415737,6.52604137 260.952568,8.03491746 259.982873,10.6170043 C259.920287,10.7836584 259.878383,10.8947079 259.773193,11.1728542 C258.644187,14.1563065 258.317012,15.093017 258.044612,16.3276329 C257.604337,18.3231142 257.825781,19.708782 259.227141,20.3290801 C260.530809,20.9061355 261.713854,20.6228905 262.522611,19.62203 C263.029888,18.9942611 263.347332,18.223123 263.794317,16.7811798 C263.763236,16.8814439 264.120713,15.7128061 264.222242,15.3968485 C264.765636,13.7058114 265.288294,12.6860161 265.96061,12.1466135 C265.904354,12.4982213 265.802175,12.9932424 265.639093,13.7366543 Z" id="Path-2"></path></g></g></g></g></svg>Change Signature</li>' +
        '<li idx="4" class="item__btn-track-opens"><svg class="svg" width="23px" height="22px" viewBox="0 0 23 22" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Add-icon-to-inline,-popout-compose,-task-manager" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-890.000000, -666.000000)"> <g id="Page-1" transform="translate(891.000000, 667.000000)" class="svg-stroke" stroke="#979797" stroke-width="1.5"> <g id="Group-28"> <path d="M20.8778935,9.85228324 C20.957807,9.93923459 20.957807,10.0717049 20.8778935,10.1584292 C19.9977097,11.1158022 15.073607,16.2377589 10.4890232,16.2377589 C5.90409892,16.2377589 0.993504324,11.1148941 0.116498919,10.1582022 C0.0368124324,10.0714778 0.0368124324,9.93946162 0.116498919,9.85251027 C0.993504324,8.89593189 5.90409892,3.77295351 10.4890232,3.77295351 C15.073607,3.77295351 19.9977097,8.89502378 20.8778935,9.85228324 Z" id="Stroke-1"></path> <path d="M16.729667,10.0053676 C16.729667,13.4474378 13.9393914,16.2377135 10.4973211,16.2377135 C7.05525081,16.2377135 4.26486162,13.4474378 4.26486162,10.0053676 C4.26486162,6.56341081 7.05525081,3.77302162 10.4973211,3.77302162 C13.9393914,3.77302162 16.729667,6.56341081 16.729667,10.0053676 Z" id="Stroke-3"></path> <path d="M13.1727211,8.01267189 C13.5865914,8.56900162 13.8315535,9.25870973 13.8315535,10.0054016 C13.8315535,11.8513584 12.3351049,13.347807 10.4890346,13.347807 C8.64319135,13.347807 7.14662919,11.8513584 7.14662919,10.0054016 C7.14662919,8.15944486 8.64319135,6.6628827 10.4890346,6.6628827" id="Stroke-5" stroke-linecap="round" transform="translate(10.489091, 10.005345) rotate(22.000000) translate(-10.489091, -10.005345) "></path> <path d="M3.17589243,4.43378378 L3.17589243,2.67432432 C3.17589243,2.61155135 3.22663297,2.56081081 3.28940595,2.56081081 L5.33264919,2.56081081" id="Stroke-11" stroke-linecap="round"></path> <path d="M17.8080454,4.43378378 L17.8080454,2.67432432 C17.8080454,2.61155135 17.7573049,2.56081081 17.6945319,2.56081081 L15.6512886,2.56081081" id="Stroke-13" stroke-linecap="round"></path> <path d="M3.17589243,15.5770649 L3.17589243,17.3365243 C3.17589243,17.3991838 3.22663297,17.4500378 3.28940595,17.4500378 L5.33264919,17.4500378" id="Stroke-15" stroke-linecap="round"></path> <path d="M17.8080454,15.5770649 L17.8080454,17.3365243 C17.8080454,17.3991838 17.7573049,17.4500378 17.6945319,17.4500378 L15.6512886,17.4500378" id="Stroke-17" stroke-linecap="round"></path> <path d="M10.5,0.5 L10.5,19.5" id="Line-2" stroke-linecap="round"></path> <path d="M18.2,10 C7.93333333,10 2.8,10 2.8,10" id="Line-2-Copy" stroke-linecap="round"></path> </g> </g> </g> </svg>Track Opens</li>' +
        '<li idx="5" class="item__btn-track-clicks"><svg class="svg" width="18px" height="21px" viewBox="0 0 18 21" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs></defs><g id="Add-icon-to-inline,-popout-compose,-task-manager" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-926.000000, -666.000000)"><g id="Group-12" transform="translate(564.000000, 661.000000)" class="svg-fill" fill="#979797" fill-rule="nonzero"><g id="Group-33" transform="translate(0.000000, 5.000000)"><g id="clicker" transform="translate(362.000000, 0.000000)"><path d="M15.7304274,6.43072113 C15.4323595,6.43072113 15.1485632,6.49217856 14.8908247,6.60260551 C14.5774913,5.82021584 13.808891,5.26555545 12.9120604,5.26555545 C12.5789174,5.26555545 12.263383,5.34216677 11.9823557,5.47841146 C11.626705,4.80090635 10.9139125,4.33695881 10.0938354,4.33695881 C9.85278249,4.33695881 9.62131486,4.37757965 9.40504172,4.45145486 L9.40504172,2.11880833 C9.40511272,0.950555743 8.44977621,0 7.27539747,0 C6.10116074,0 5.14589523,0.950555743 5.14589523,2.11880833 L5.14589523,10.5125895 L3.61210264,8.77873202 C3.17636127,8.34586399 2.64036459,8.12508025 2.06986077,8.12234413 C1.48984264,8.12234413 0.95697006,8.33947971 0.557581886,8.73439287 C-0.146619342,9.4304194 -0.185599628,10.4635498 0.450936368,11.5692926 C1.27491855,12.9997916 2.17061309,14.3486281 2.96094016,15.5388398 C3.53847321,16.4086449 4.08405521,17.2301821 4.48287536,17.9094412 C4.82872777,18.4988994 5.74678805,20.4106046 5.75616036,20.4298977 C5.87530229,20.6783233 6.12870965,20.8366674 6.40675482,20.8366674 L15.5142252,20.8366674 C15.8271326,20.8366674 16.1041127,20.6372113 16.2000369,20.3431136 C16.3698745,19.8212165 17.8600006,15.193738 17.8600006,13.4066315 L17.8600006,8.54973992 C17.8598586,7.38120671 16.9046641,6.43072113 15.7304274,6.43072113 Z M14.8562765,8.41253346 C14.8562765,8.03615451 15.1594477,7.72998524 15.5320029,7.72998524 C15.904767,7.72998524 16.2079383,8.03615451 16.2079383,8.41253346 L16.2079383,13.1777745 C16.2079383,14.3429799 15.3016289,17.4755018 14.8015217,19.07112 L6.82990089,19.07112 C6.53690036,18.4686934 5.98775076,17.3527725 5.71920176,16.8951018 C5.30840191,16.1952076 4.76273544,15.3735479 4.18509387,14.5035673 C3.42117473,13.3533676 2.55547867,12.0495325 1.7691282,10.6845738 C1.56390244,10.3279499 1.37581365,9.84715125 1.64512893,9.58104279 C1.77073044,9.45666153 1.93987103,9.39168316 2.12238682,9.38975583 C2.30051386,9.39065066 2.46805221,9.45700569 2.59644023,9.57705048 L5.32191644,12.6576723 C5.51557823,12.8767678 5.82683035,12.9540672 6.10227593,12.8518502 C6.37800016,12.7495643 6.56058561,12.4890314 6.56058561,12.198143 L6.56058561,2.10302359 C6.56058561,1.72671347 6.86382654,1.42068187 7.23659065,1.42068187 C7.60942443,1.42068187 7.91273502,1.72671347 7.91273502,2.10302359 L7.91273502,8.62226767 C7.91273502,9.00787024 8.22921182,9.32050982 8.61939156,9.32050982 C9.00957131,9.32050982 9.32604811,9.00787024 9.32604811,8.62226767 L9.32604811,6.35793667 C9.32604811,5.98183305 9.62921937,5.67587028 10.0018442,5.67587028 C10.3746083,5.67587028 10.6777795,5.98183305 10.6777795,6.35793667 L10.6777795,9.53299735 C10.6777795,9.91880642 10.9941867,10.2313083 11.3843664,10.2313083 C11.7746158,10.2313083 12.0910926,9.91887525 12.0910926,9.53299735 L12.0910926,7.26921701 C12.0910926,6.8929069 12.3942639,6.58680646 12.7668887,6.58680646 C13.1397225,6.58680646 13.4430331,6.8929069 13.4430331,7.26921701 L13.4430331,10.4444842 C13.4430331,10.8300179 13.7594402,11.1427952 14.1496896,11.1427952 C14.5400087,11.1427952 14.8564158,10.8300179 14.8564158,10.4444842 L14.8564158,8.41253346 L14.8562765,8.41253346 Z" id="Shape"></path></g></g></g></g></svg>Track Clicks</li>' +
        "</ul>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "" +
        '<div class="new-message-popup-settings">' +
        '<div class="new-message-popup__settings-content">' +
        '<div class="t-field t-field-send-as">' +
        '<div class="lb">Send As:</div>' +
        '<div><div class="t-radio checked">' +
        '<label><i class="icn-radio"></i><input checked name="radio-reply-thread" type="radio">Reply to previos email</label>' +
        "</div>" +
        '<div class="t-radio">' +
        '<label><i class="icn-radio"></i><input name="radio-reply-thread" type="radio" data-type="radio-thread">New thread</label>' +
        "</div>" +
        "</div></div>" +
        htmlField +
        "</div>" +
        "</div>" +
        "" +
        '<div class="new-message-popup-preview">' +
        '<div class="new-message-popup-preview__btns-top">' +
        '<a href="#" class="new-message-popup-preview__btn-prev"></a>' +
        '<a href="#" class="new-message-popup-preview__btn-next"></a>' +
        "</div>" +
        '<div class="new-message-popup-preview__to-from">' +
        '<div class="new-message-popup-preview__to"><strong>To:</strong> "Arthur Chin" &lt;a.chin@ucol.edu&gt;</div>' +
        '<div class="new-message-popup-preview__from"><strong>From:</strong> "Ryan Schefke" &lt;rrschefke@leadliaison&gt;</div>' +
        "</div>" +
        '<div class="new-message-popup-preview__content">' +
        '<div class="new-message-popup-preview__email-content">' +
        "</div>" +
        "</div>" +
        '<div class="new-message-popup-preview__btns-bottom">' +
        '<a href="#" class="t-btn-orange new-message-popup-preview__btn-send-me-preview">Send Me a Preview</a>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
    } else {
      html =
        '<div class="drop-new-message-fade"></div>' +
        '<div class="drop-new-message-popup drop-new-message-popup--another">' +
        '<div class="new-message-popup-wrap">' +
        '<div class="drop-new-message">' +
        '<div class="drop-new-message__header">' +
        '<div class="drop-new-message__title">New Message</div>' +
        "</div>" +
        '<div class="drop-new-message__content">' +
        '<div class="scrollbar-inner">' +
        '<div class="new-message-popup__settings-content">' +
        '<div class="t-field">' +
        '<div class="lb">Handwritten Latter:</div>' +
        '<div class="handwritten-latter">' +
        '<div class="handwritten-latter__item">' +
        "<select>" +
        "<option>My Best Letter</option>" +
        "<option>My Best Letter 1</option>" +
        "<option>My Best Letter 2</option>" +
        "</select>" +
        '<div class="handwritten-latter__preview"><svg width="21px" height="14px" viewBox="0 0 21 14" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"> <defs></defs> <g id="Email_POPUP_Reply-to-previos-email" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" transform="translate(-1005.000000, -101.000000)"> <g id="Group" transform="translate(614.000000, 91.000000)" fill="#979797"> <g id="Group-36" transform="translate(-10.000000, 0.000000)"> <g id="eye" transform="translate(401.000000, 10.000000)"> <path d="M7.88449315,7.00004795 C7.88449315,8.44214384 9.0559863,9.61368493 10.4981301,9.61368493 C11.940226,9.61368493 13.1117671,8.44214384 13.1117671,7.00004795 L13.1117671,6.97832877 C12.832774,7.26144521 12.4498836,7.43567808 12.0226918,7.43567808 C11.1817808,7.43567808 10.4981301,6.75178767 10.4981301,5.91106849 C10.4981301,5.30571233 10.8549863,4.7784589 11.3649795,4.53446575 C11.095,4.43871918 10.8031575,4.3864589 10.4981301,4.3864589 C9.0559863,4.38641096 7.88449315,5.55809589 7.88449315,7.00004795 Z M20.3689932,5.5145137 C18.7482534,3.45430822 14.8019315,0.0303493151 10.5023493,0.0303493151 C6.19869178,0.0303493151 2.24800685,3.45435616 0.627219178,5.5145137 C0.26139726,5.98504795 0.0610342466,6.49470548 0.0478972603,7.00004795 C0.0610821918,7.50543836 0.26139726,8.01509589 0.627219178,8.48553425 C2.24805479,10.5461712 6.19437671,13.9696507 10.4981301,13.9696507 C14.8018836,13.9696507 18.7482534,10.5461712 20.3689932,8.48553425 C20.7390342,8.01504795 20.9394452,7.50543836 20.9526301,7.00004795 C20.9394452,6.49470548 20.7390342,5.98504795 20.3689932,5.5145137 Z M10.4981301,11.3560137 C8.09382192,11.3560137 6.14206849,9.4045 6.14206849,7.00004795 C6.14206849,4.59554795 8.09382192,2.6439863 10.4981301,2.6439863 C12.9023904,2.6439863 14.8541438,4.59554795 14.8541438,7.00004795 C14.8540959,9.40445205 12.9023425,11.3560137 10.4981301,11.3560137 Z" id="Icon_eye"></path> </g> </g> </g> </g> </svg></div>' +
        "</div>" +
        "</div>" +
        "</div>" +
        htmlField +
        "</div>" +
        "</div>" +
        '<div class="new-message__actions">' +
        '<a href="#" class="drop-new-message__btn-cancel t-btn-gray">Cancel</a> ' +
        '<a href="#" class="drop-new-message__btn-save t-btn-orange">Save</a> ' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>";
    }

    $("body").append(html);

    if (isEmail) {
      saP2.newMessage__editor();

      $(".drop-new-message-popup .ll_std_tooltip").tooltipster({
        theme: "ll-std-tooltip-theme",
        position: "bottom",
        offsetY: 0
      });

      saP2.newMessage__popupEditorHeight(
        $(".drop-new-message-popup .new-message")
      );

      $("body")
        .off("click.settings-new-message")
        .on(
          "click.settings-new-message",
          ".drop-new-message__btn-settings",
          function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $popup = $(this).parents(".new-message-popup-wrap");

            if (!$popup.hasClass("show-settings")) {
              $(".new-message-popup-wrap")
                .removeClass("show-settings")
                .find(".new-message-popup-settings")
                .css("left", "0");
            }

            if ($popup.hasClass("show-preview")) {
              $(".new-message-popup-wrap")
                .removeClass("show-preview")
                .find(".new-message-popup-preview")
                .css("left", "0");
            }

            if ($popup.hasClass("show-settings")) {
              $popup
                .removeClass("show-settings")
                .find(".new-message-popup-settings")
                .css("left", "0");
            } else {
              $popup
                .addClass("show-settings")
                .find(".new-message-popup-settings")
                .animate(
                  {
                    left: -396 + "px"
                  },
                  300
                );
            }
          }
        );

      $("body")
        .off("click.preview-new-message")
        .on(
          "click.preview-new-message",
          ".drop-new-message__btn-preview",
          function (e) {
            e.preventDefault();
            e.stopPropagation();

            var $popup = $(this).parents(".new-message-popup-wrap");

            if (!$popup.hasClass("show-preview")) {
              $(".new-message-popup-wrap")
                .removeClass("show-preview")
                .find(".new-message-popup-preview")
                .css("left", "0");
            }

            if ($popup.hasClass("show-settings")) {
              $popup
                .removeClass("show-settings")
                .find(".new-message-popup-settings")
                .css("left", "0");
            }

            if ($popup.hasClass("show-preview")) {
              $popup
                .removeClass("show-preview")
                .find(".new-message-popup-preview")
                .css("left", "0");
            } else {
              $popup
                .addClass("show-preview")
                .find(".new-message-popup-preview")
                .animate(
                  {
                    left: -296 + "px"
                  },
                  300
                );
            }
          }
        );

      $(".t-field-send-as input").change(function () {
        var type = $(this).data("type");
        var $field = $(
          ".drop-new-message__content .new-message__field-subject"
        );

        if (type === "radio-thread") $field.show();
        else $field.hide();

        saP2.newMessage__popupEditorHeight(
          $(".drop-new-message-popup .new-message")
        );
      });
    } else {
      $(" .scrollbar-inner").scrollbar();
    }

    $(".drop-new-message-popup select").chosen();

    $(".new-message__button-cc").on("click", function () {
      var $this = $(this);

      $this.toggleClass("selected");
      $this
        .parents(".t-field")
        .find(".new-message__field-cc")
        .toggle()
        .find("select")
        .val("")
        .trigger("liszt:updated");
    });

    $(".new-message__button-bcc").on("click", function () {
      var $this = $(this);
      $this.toggleClass("selected");
      $this
        .parents(".t-field")
        .find(".new-message__field-bcc")
        .toggle()
        .find("select")
        .val("")
        .trigger("liszt:updated");
    });

    $(".new-message-popup__settings-content .day-edit")
      .off("click.day-edit")
      .on("click.day-edit", function (e) {
        e.stopPropagation();
        saP2.editDay($(this));
      });

    $(".new-message-popup__settings-content .time-edit")
      .off("click.time-edit")
      .on("click.time-edit", function (e) {
        e.stopPropagation();
        saP2.editTime($(this));
      });

    $(".drop-new-message__btn-cancel, .drop-new-message__btn-save")
      .off("click")
      .on("click", function (e) {
        e.preventDefault();
        $(".plan-list-item-added").removeClass("plan-list-item-added");
        $(".drop-new-message-fade, .drop-new-message-popup").remove();
      });
  },
  newMessage__editor: function () {
    tinymce.init({
      autoresize_min_height: 440,
      autoresize_max_height: 440,
      selector: ".new-message__field-message-editor",
      plugins:
        "image textcolor table save contextmenu link lists autoresize code",
      auto_reset_designmode: true,
      forced_root_block: "",
      force_br_newlines: true,
      force_p_newlines: false,
      toolbar_items_size: "small",
      entity_encoding: "raw",
      toolbar: [
        "styleselect | bold italic forecolor | bullist numlist | image link code"
      ],
      menubar: false,
      statusbar: false,
      style_formats: [
        {
          title: "Inline",
          items: [
            { title: "Underline", icon: "underline", format: "underline" },
            {
              title: "Strikethrough",
              icon: "strikethrough",
              format: "strikethrough"
            }
          ]
        },
        {
          title: "Alignment",
          items: [
            { title: "Left", icon: "alignleft", format: "alignleft" },
            { title: "Center", icon: "aligncenter", format: "aligncenter" },
            { title: "Right", icon: "alignright", format: "alignright" },
            { title: "Justify", icon: "alignjustify", format: "alignjustify" }
          ]
        },
        {
          title: "Font Family",
          items: [
            {
              title: "Arial",
              inline: "span",
              styles: { "font-family": "arial" }
            },
            {
              title: "Book Antiqua",
              inline: "span",
              styles: { "font-family": "book antiqua" }
            },
            {
              title: "Comic Sans MS",
              inline: "span",
              styles: { "font-family": "comic sans ms,sans-serif" }
            },
            {
              title: "Courier New",
              inline: "span",
              styles: { "font-family": "courier new,courier" }
            },
            {
              title: "Georgia",
              inline: "span",
              styles: { "font-family": "georgia,palatino" }
            },
            {
              title: "Helvetica",
              inline: "span",
              styles: { "font-family": "helvetica" }
            },
            {
              title: "Impact",
              inline: "span",
              styles: { "font-family": "impact,chicago" }
            },
            {
              title: "Open Sans",
              inline: "span",
              styles: { "font-family": "Open Sans" }
            },
            {
              title: "Symbol",
              inline: "span",
              styles: { "font-family": "symbol" }
            },
            {
              title: "Tahoma",
              inline: "span",
              styles: { "font-family": "tahoma" }
            },
            {
              title: "Terminal",
              inline: "span",
              styles: { "font-family": "terminal,monaco" }
            },
            {
              title: "Times New Roman",
              inline: "span",
              styles: { "font-family": "times new roman,times" }
            },
            {
              title: "Verdana",
              inline: "span",
              styles: { "font-family": "Verdana" }
            }
          ]
        },
        {
          title: "Font Size",
          items: [
            {
              title: "8pt",
              inline: "span",
              styles: { fontSize: "12px", "font-size": "8px" }
            },
            {
              title: "10pt",
              inline: "span",
              styles: { fontSize: "12px", "font-size": "10px" }
            },
            {
              title: "12pt",
              inline: "span",
              styles: { fontSize: "12px", "font-size": "12px" }
            },
            {
              title: "14pt",
              inline: "span",
              styles: { fontSize: "12px", "font-size": "14px" }
            },
            {
              title: "16pt",
              inline: "span",
              styles: { fontSize: "12px", "font-size": "16px" }
            }
          ]
        }
      ],
      setup: function (editor) {
        editor.on("keyup", function (e) {
          var $popup = $("#" + editor.id).parents(".new-message-popup-wrap");

          if ($popup.length) {
            $popup
              .find(".new-message-popup-preview__email-content")
              .html(editor.getContent());
          }
        });
      }
    });
  },
  newMessage__popupEditorHeight: function ($box) {
    var resizeHeight = 440;
    var heightField = 40;
    var fieldShowLength = 0;

    fieldShowLength = $box.find(".new-message__field-subject:visible").length;
    resizeHeight = resizeHeight - fieldShowLength * heightField;
    tinyMCE.DOM.setStyle(
      tinyMCE.DOM.get(
        $box.find(".new-message__field-message-editor").attr("id") + "_ifr"
      ),
      "height",
      resizeHeight + "px"
    );
  }
};

//saP2 - sales Automation Manager Folder Phase 2
var saP2ManageFolder = {
  init: function () {
    //saP2ManageFolder.addCircleChartTable($(".table-chart"));
    saP2ManageFolder.moveToFolder();

    $(".ll-btn-group .t-btn-gray").on("click", function () {
      var $this = $(this);
      var $box = $(".sales-automation-manage-folder");

      if ($this.hasClass("ll-icn-folder")) $box.removeClass("show-view-list");
      else if ($this.hasClass("ll-icn-list")) {
        $box.addClass("show-view-list");
        if ($(".grid-fixed-height").length) {
          ll_grid.grid.setSizes();
          ll_grid.heightFixedTable($(".grid-fixed-height"));
        }
      }
    });

    $(".list-folder").on("click", ".list-folder-item", function () {
      $(this)
        .addClass("selected")
        .siblings(".list-folder-item")
        .removeClass("selected");
    });

    $(".btn-percent").on("click", function () {
      $(this).toggleClass("ll-active");
      $(".view-list").toggleClass("show-list-tags-percent");
    });
  },
  moveToFolder: function () {
    $(".dropdown-move-to .dropdown-move-to-list li").on("click", function (e) {
      e.stopPropagation();
      var $this = $(this);
      var $box = $this.parents(".dropdown-move-to");

      $this
        .toggleClass("selected")
        .siblings("li")
        .removeClass("selected");

      $this.hasClass("selected")
        ? $box.addClass("show-btn")
        : $box.removeClass("show-btn");
    });

    $(".dropdown-move-to > .t-btn-gray").on("click", function (e) {
      e.stopPropagation();
      e.preventDefault();
      $(this)
        .parent()
        .toggleClass("opened");
    });

    $(".dropdown-move-to").on("click", function (e) {
      e.stopPropagation();
    });

    $("body").on("click.action-move-to-folder", function () {
      $(".dropdown-move-to.opened").removeClass("opened");
    });

    $(".dropdown-move-to .move-search .txt-field").on("keyup", function () {
      var $this = $(this);
      var val = $this.val();
      var $box = $this.parents(".dropdown-move-to");

      $box
        .removeClass("show-btn")
        .find("li.selected")
        .removeClass("selected");

      $box.find("li").hide();

      if (val !== "") {
        $box.find('li:Contains("' + val + '")').each(function () {
          $(this).show();
        });
      } else {
        $box.find("li").show();
      }
    });

    $(".search-field-folder .txt-field").on("keyup", function () {
      var val = $(this).val();
      var $box = $(".list-folder");

      $box.find(".list-folder-item").hide();

      if (val !== "") {
        $box
          .find('.list-folder-item .name:Contains("' + val + '")')
          .each(function () {
            $(this)
              .parents(".list-folder-item")
              .show();
          });
      } else {
        $box.find(".list-folder-item").show();
      }
    });

    $(".list-folder").on("dblclick", ".list-folder-item .name", function (e) {
      e.stopPropagation();
      var $this = $(this);

      var val = $this.text();

      $this.html('<input type="text" class="txt-field" value="' + val + '">');
      $this.find(".txt-field").focus();
      $this.find(".txt-field").on("click", function (e) {
        e.stopPropagation();
      });
      $this.find(".txt-field").on("blur", function (e) {
        saP2ManageFolder.editNameFolder($(this));
      });
      $this.find(".txt-field").on("keyup", function (e) {
        if (e.keyCode === 13) saP2ManageFolder.editNameFolder($(this));
      });
    });
  },
  editNameFolder: function ($input, isTime) {
    var val = $input.val();

    if (val === "") val = "Folder";

    $input.parent().html(val);
  },
  addCircleChartTable: function ($charts) {
    $charts.each(function () {
      $(this).pieChart({
        barColor: "#5FAE43",
        trackColor: "#e5e5e5",
        lineCap: "butt",
        lineWidth: 10,
        size: 60,
        onStep: function (from, to, percent) {
          $(this.element)
            .find(".pie-value")
            .html('<div class="percent">' + Math.round(percent) + "%</div>");
        }
      });
    });
  }
};

$(document).ready(function () {
  if ($(".sales-automation").length) saP2.init();
  if ($(".sales-automation-manage-folder").length) saP2ManageFolder.init();
});
