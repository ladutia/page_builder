var $previewColResizable = null;
var page = {
  init: function() {
    $("select").chosen({ allow_single_deselect: false });
    $("body").on("click", function() {
      $(".settings-tpl.open").removeClass("open");
    });
    $(".step-nav-template-email").each(function() {
      $(this).css("margin-left", -$(this).width() / 2);
    });
    $(".template, .tmp-theme").on("click", function() {
      $(this)
        .addClass("selected")
        .siblings(".template, .tmp-theme")
        .removeClass("selected");
      $(".et-top-header-gray .btn-next").removeClass("btn-disabled");
    });
    $(".tabs-editor > ul li").on("click", function() {
      var index = $(this)
        .parent()
        .find("li")
        .index($(this));
      $(this)
        .addClass("selected")
        .siblings("li")
        .removeClass("selected");
      $(this)
        .parents(".tabs-editor")
        .find(".wrap-tabs-content .tab-content")
        .hide()
        .eq(index)
        .show();

      if (index == 2) {
        $("#fb-form-style-global").scrollTop(0);
      }
    });
    $(".settings-tpl > a.db-btn-white").on("click", function(e) {
      e.stopPropagation();
      $(this)
        .parent()
        .toggleClass("open");
      return false;
    });
    $(".settings-tpl > ul li a").on("click", function(e) {
      e.stopPropagation();
      $(this)
        .parents(".settings-tpl")
        .toggleClass("open");
      return false;
    });
    $("#fb-tabs-settings li a").on("click", function() {
      var index = $("#fb-tabs-settings li").index($(this).parent());

      $(".tpl-block").removeClass("selected");
      $(".fb-field-properties .fb-settings").hide();
      $(".fb-field-properties-inf").show();

      if (index == 1) {
        $('.tpl-block[data-type-el="0"]').addClass("selected");
      } else {
        page.removeFieldFormTitDesc();
      }
    });
    var resizebleMaxWidth = $("#form-editor").outerWidth() - 542;
    var startResizebleWidth = 0;

    $previewColResizable = $(".wrap-preview-col").resizable({
      handles: "e",
      minWidth: 600,

      start: function(event, ui) {
        startResizebleWidth = $(".preview-col").outerWidth();
      },
      resize: function(event, ui) {
        var $colRight = $(".tool-col");
        var width =
          $("#form-editor").outerWidth() - $(".wrap-preview-col").outerWidth();
        $colRight.css("width", width + "px");
      },
      stop: function(event, ui) {
        $(".wrap-preview-col").css({
          left: "0",
          width: "auto",
          right: $(".tool-col").outerWidth()
        });
      }
    });
    page.resizeForm();
    $(window).resize(function() {
      page.resizeForm();
    });
    $(".fb-save-panel, .fb-cancel-panel").on("click", function() {
      $(".fb-right-panel-slide.active")
        .removeClass("active")
        .animate({ left: "579px" }, 300, function() {
          $(this).hide();
          $(".wrap-panels-el").css("z-index", "-1");
          $(".tpl-block").removeClass("selected");
        });
      return false;
    });
    $(".touch-spin").TouchSpin({
      min: 0,
      max: 100
    });
    $(".txt-field-label-width, #fb-field-label-width-global").TouchSpin({
      min: 10,
      max: 50
    });
    $(".eb-block-content").on("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      page.addElements($(this), false);
    });
    if ($("#fb-show-text").is(":checked")) {
      $(".fb-show-text").show();
      $(".fb-redirect-url").hide();
    } else {
      $(".fb-show-text").hide();
      $(".fb-redirect-url").show();
    }
    $("#fb-show-text").on("click", function() {
      $(".fb-show-text").show();
      $(".fb-redirect-url").hide();
    });
    $("#fb-redirect-url").on("click", function() {
      $(".fb-show-text").hide();
      $(".fb-redirect-url").show();
    });
    tinymce.init({
      selector: "#advanced-editor",
      elements: "richEditor",
      plugins:
        "hr image pagebreak paste emoticons insertdatetime fullscreen visualblocks searchreplace preview charmap textcolor image print layer table save media contextmenu visualchars nonbreaking template link code",
      auto_reset_designmode: true,
      forced_root_block: "",
      force_br_newlines: true,
      force_p_newlines: false,
      entity_encoding: "raw",
      toolbar: [
        "styleselect | formatselect | fontselect | fontsizeselect | table | button_embed_content_tag",
        "bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify | cut copy paste | bullist numlist | outdent indent | blockquote | code",
        "undo redo | removeformat subscript superscript | hr | pagebreak | emoticons | insertdatetime | fullscreen | visualblocks | searchreplace | preview | charmap | image | media | link | unlink | print"
      ],

      menubar: false,
      resize: false,
      height: 345
    });
    $(".fb-html-icn").on("click", function() {
      var inputId = $(this).attr("data-id-box");
      $("#popup-advanced-editor").attr("data-id-box", inputId);
      tinymce.get("advanced-editor").setContent($("#" + inputId).val());
    });
    $(".fb-btn-save-advanced-editor").on("click", function() {
      var inputId = $("#popup-advanced-editor").attr("data-id-box");
      var content = tinymce.get("advanced-editor").getContent();
      $("#" + inputId).val(content);

      if (inputId == "fb-html-seaction-break") {
        var $tpl = $(".tpl-block.selected");
        $tpl.find(".fb-html").html(content);
      }
    });
    $("#fb-html-seaction-break").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var content = $(this).val();
      $tpl.find(".fb-html").html(content);
    });
  },
  resizeForm: function() {
    widthBody = $("body").width();
    var $colRight = $(".tool-col");
    if (widthBody < 1188) {
      $colRight.width("542px");
      $(".wrap-preview-col").css({
        right: 542 + "px"
      });
      resizebleMaxWidth = $("#form-editor").outerWidth() - 410;
      $previewColResizable.resizable("option", "maxWidth", resizebleMaxWidth);
    } else {
      $colRight.width("580px");
      $(".wrap-preview-col").css({
        right: 580 + "px"
      });
      resizebleMaxWidth = $("#form-editor").outerWidth() - 588;
      $previewColResizable.resizable("option", "maxWidth", resizebleMaxWidth);
    }
  },
  actionBuilderForm: function() {
    $(".fb-edit-identifier").on("click", function(e) {
      e.preventDefault();
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var $slide = $(this).parents(".fb-right-panel-slide");

      $slide.find(".fb-identifier-input").removeAttr("disabled");
      $slide.find(".fb-auto-identifier-section").hide();
      $slide.find(".fb-custom-identifier-section").show();
      opt.identifierCustom = "1";
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-cancel-edit-identifier").on("click", function(e) {
      e.preventDefault();
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var $slide = $(this).parents(".fb-right-panel-slide");

      $slide
        .find(".fb-identifier-input")
        .attr("disabled", "disabled")
        .val(opt.defaultIdentifier);
      $slide.find(".fb-auto-identifier-section").show();
      $slide.find(".fb-custom-identifier-section").hide();
      opt.identifierCustom = "0";
      opt.identifier = opt.defaultIdentifier;
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-identifier-input").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();

      opt.identifier = val;
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-radio-vertical").on("click", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      $tpl.find(".tpl-multiple-choise").removeClass("fb-inline-choise");
      opt.direction = "0";
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-radio-horizontal").on("click", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      $tpl.find(".tpl-multiple-choise").addClass("fb-inline-choise");
      opt.direction = "1";
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".fb-box-number-columns-radio").show();
      $(
        '.fb-number-columns-radio option[value="' + opt.countColumns + '"]'
      ).attr("selected", true);
      $(".fb-number-columns-radio").trigger("liszt:updated");
      page.checkRadioBoxColumn(
        opt.countColumns,
        $tpl.find(".tpl-multiple-choise")
      );
    });
    $("#fb-checked-vertical").on("click", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      $tpl.find(".tpl-checkboxes").removeClass("fb-inline-checkboxes");
      $(".fb-box-number-columns-radio").hide();
      opt.direction = "0";
      $tpl.attr("data-json", JSON.stringify(opt));
    });

    $("#fb-checked-horizontal").on("click", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      $tpl.find(".tpl-checkboxes").addClass("fb-inline-checkboxes");
      opt.direction = "1";
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".fb-box-number-columns-checkboxes").show();
      $(
        '.fb-number-columns-checkboxes option[value="' + opt.countColumns + '"]'
      ).attr("selected", true);
      $(".fb-number-columns-checkboxes").trigger("liszt:updated");
      page.checkRadioBoxColumn(opt.countColumns, $tpl.find(".tpl-checkboxes"));
    });
    $(".fb-number-columns-radio").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var value = $(this).val();

      page.checkRadioBoxColumn(value, $tpl.find(".tpl-multiple-choise"));

      opt.countColumns = value;
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-number-columns-checkboxes").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var value = $(this).val();

      page.checkRadioBoxColumn(value, $tpl.find(".tpl-checkboxes"));

      opt.countColumns = value;
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-address-street").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      $tpl.find(".fb-label-street").text(val);
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-address-street-2").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      $tpl.find(".fb-label-street-2").text(val);
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-address-city").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      $tpl.find(".fb-label-city").text(val);
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-address-state").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      $tpl.find(".fb-label-state").text(val);
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-address-zip").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      $tpl.find(".fb-label-zip").text(val);
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-address-country").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
      var optGlobal = $tplGlobal.data("json");

      $tpl.find(".fb-label-country").text(val);
      if (
        opt.labelPos == 2 ||
        (opt.labelPos == "None" && optGlobal.labelPos == 2)
      ) {
        page.labelPosition($tpl);
      }
    });
  },
  checkRadioBoxColumn: function(value, $box) {
    var classColumn = "fb-3-columns-chekboxes-radio";

    if (value == "2") {
      classColumn = "fb-2-columns-chekboxes-radio";
    } else if (value == "4") {
      classColumn = "fb-4-columns-chekboxes-radio";
    } else if (value == "5") {
      classColumn = "fb-5-columns-chekboxes-radio";
    }

    $box
      .removeClass(
        "fb-2-columns-chekboxes-radio fb-3-columns-chekboxes-radio fb-4-columns-chekboxes-radio fb-5-columns-chekboxes-radio"
      )
      .addClass(classColumn);
  },
  addFieldFormTitDesc: function() {
    if (!$(".info-form").find(".t-field").length) {
      var tit = $(".form-tit").text();
      var desc = $(".form-desc").text();
      $(".form-tit")
        .hide()
        .before(
          '<div class="t-field"><label>Form Title</label><input type="text" class="txt-field fb-input-form-tit" value="' +
            tit +
            '"/></div>'
        );
      $(".form-desc")
        .hide()
        .before(
          '<div class="t-field"><label>Form Description</label><textarea class="txt-field fb-textarea-form-desc">' +
            desc +
            "</textarea></div>"
        );
    }
  },
  removeFieldFormTitDesc: function() {
    $(".info-form")
      .find(".t-field")
      .remove();
    $(".form-tit").show();
    $(".form-desc").show();
  },
  actionsBtnBlock: function() {
    $(".eb-wrap-form-page").on("click", ".tpl-block", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var $block = $(this);
      var type = $block.data("type-el");
      var typeSlide = type;

      if (!$block.hasClass("selected")) {
        $("#fb-tabs-settings li")
          .eq(0)
          .trigger("click");
        if (!$block.hasClass("info-form")) {
          $(".wrap-panels-el").css("z-index", "1");
          page.removeFieldFormTitDesc();
        } else {
          $(".wrap-panels-el").css("z-index", "-1");
          page.addFieldFormTitDesc();
        }
        if ($(".fb-right-panel-slide.active").length) {
          $(".fb-right-panel-slide.active")
            .removeClass("active")
            .animate({ left: "589px" }, 300, function() {
              $(this).hide();
              $("#fb-slide-panel-" + typeSlide)
                .addClass("active")
                .show()
                .animate({ left: 0 }, 300);
            });
        } else {
          $("#fb-slide-panel-" + typeSlide)
            .addClass("active")
            .show()
            .animate({ left: 0 }, 300);
        }
      } else {
        if ($block.hasClass("info-form")) {
          page.addFieldFormTitDesc();
        }
      }

      $(".tpl-block").removeClass("selected");
      $block.addClass("selected");
      page.editElementTpl(type);
    });

    $(".eb-wrap-form-page").on("click", ".tpl-block-move", function(e) {
      e.preventDefault();
      e.stopPropagation();
    });
    $(".eb-wrap-form-page").on("click", ".tpl-block-edit", function(e) {
      e.preventDefault();
      if ($(this).parents(".info-form.selected").length) {
        if ($(".info-form").find(".t-field").length) {
          e.stopPropagation();
          page.removeFieldFormTitDesc();
        }
      }
    });
    $(".eb-wrap-form-page").on("click", ".tpl-block-clone", function(e) {
      e.preventDefault();
      e.stopPropagation();
      page.elementsClone($(this));
    });
    $(".eb-wrap-form-page").on("click", ".tpl-block-delete", function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (
        $(this)
          .parents(".tpl-block")
          .hasClass("selected")
      ) {
        $(".fb-right-panel-slide.active")
          .removeClass("active")
          .css({ left: "589px" })
          .hide();
        $(".wrap-panels-el").css("z-index", "-1");
      }
      $(this)
        .parents(".tpl-block")
        .remove();

      page.showHideInfBlock();
    });
  },
  dragAndDropElements: function() {
    $(".eb-block-content").draggable({
      helper: "clone",
      start: function(event, ui) {
        $(".wrap-tpl-block").addClass("tpl-placeholder");
      },
      stop: function(event, ui) {
        $(".wrap-tpl-block").removeClass("tpl-placeholder");
        $(".fb-sortable-hover").removeClass("fb-sortable-hover");
      },
      connectToSortable: ".wrap-tpl-block",
      refreshPositions: true
    });
    $(".wrap-tpl-block").sortable({
      cursor: "move",
      //handle: '.tpl-block-move',
      tolerance: "intersect",
      cancel:
        ".fb-dragenddrop-box-text, .fb-dragenddrop-box-text, .tpl-block-edit, .tpl-block-clone, .tpl-block-delete, .txt-field",
      connectWith: ".wrap-tpl-block",
      placeholder: "fb-placeholder-element",
      beforeStop: function(event, ui) {
        if (ui.item.hasClass("eb-block-content")) {
          page.addElements(ui.item, true);
        }
      },
      start: function(event, ui) {
        ui.item.parent().addClass("fb-sortable-hover");
      },
      over: function(event, ui) {
        $(".fb-sortable-hover").removeClass("fb-sortable-hover");
        $(this).addClass("fb-sortable-hover");
      },
      stop: function(event, ui) {
        ui.item.parent().removeClass("fb-sortable-hover");
        page.showHideInfBlock();
      }
    });
  },
  addElements: function($el, isDrop) {
    var $box = $(".wrap-tpl-block:first");
    var type = $el.attr("data-field-type");
    var htmlEl = "";
    var dataAll = "{}";
    var $tpl = $("#form-editor .fb-wrap-columns-form");
    var opt = $tpl.data("json");
    var posLabel = 0;
    if ($el.parents(".wrap-tpl-block").length) {
      $box = $el.parents(".wrap-tpl-block");
    }

    if (type == 1) {
      dataAll =
        '{"labelWidth":"None", "defaultIdentifier":"Text_Question", "identifierCustom":"0", "identifier":"Text_Question", "visible":"0", "labelText":"Text", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';
      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='1'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Text</span></label>" +
        '<div class="t-field ">' +
        '<div class="resizable-field size-medium">' +
        '<input type="text" class="txt-field fb-field-resize-custom"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 2) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Paragraph_Question", "defaultIdentifier":"Paragraph_Question", "visible":"0", "labelText":"Paragraph", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';
      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='2'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Paragraph</span></label>" +
        '<div class="t-field">' +
        '<div class="resizable-field">' +
        '<textarea class="txt-field fb-field-resize-custom"></textarea>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 3) {
      if (opt.labelPos == "2") {
        posLabel = 0;
      } else {
        posLabel = opt.labelPos;
      }
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Multiple_Choice_Question", "defaultIdentifier":"Multiple_Choice_Question", "visible":"0", "direction":"0", "countColumns":"3",  "labelText":"Multiple Choice", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';
      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='3'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Multiple Choice</span></label>" +
        '<div class="tpl-multiple-choise clearfix">' +
        '<div class="t-field">' +
        '<div class="t-radio">' +
        '<label><i class="icn-radio"></i><input name="radiogroup" type="radio"><span class="fb-choice">First option</span></label>' +
        "</div>" +
        "</div>" +
        '<div class="t-field">' +
        '<div class="t-radio">' +
        '<label><i class="icn-radio"></i><input name="radiogroup" type="radio"><span class="fb-choice">Second option</span></label>' +
        "</div>" +
        "</div>" +
        '<div class="t-field">' +
        '<div class="t-radio">' +
        '<label><i class="icn-radio"></i><input name="radiogroup" type="radio"><span class="fb-choice">Third option</span></label>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 4) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Name_Question", "defaultIdentifier":"Name_Question", "visible":"0", "nameFirst":"First", "nameLast":"Last", "labelText":"Name", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='4'>" +
        '<div class="tpl-block-content clearfix wrap-tpl-name">' +
        "<label><span>Name</span></label>" +
        '<div class="tpl-name clearfix">' +
        '<div class="f-line-field clearfix">' +
        '<div class="f-col-1">' +
        '<div class="t-field">' +
        '<span class="label-top">First</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        "</div>" +
        '<div class="f-col-2">' +
        '<div class="t-field">' +
        '<span class="label-top">Last</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 5) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Time_Question", "defaultIdentifier":"Time_Question", "visible":"0", "labelText":"Time", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='5'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Time</span></label>" +
        '<div class="tpl-time clearfix">' +
        '<div class="t-field">' +
        '<div class="resizable-field size-small">' +
        '<input type="text" class="txt-field fb-field-resize-custom"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 6) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Address_Question", "defaultIdentifier":"Address_Question", "visible":"0", "labelText":"Address", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "dropdownBackground":"None", "dropdownBorderColor":"None", "dropdownFont":"None", "dropdownSize":"None", "dropdownColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='6'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Address</span></label>" +
        '<div class="tpl-address clearfix">' +
        '<div class="t-field">' +
        '<span class="label-top fb-label-street">Street Address</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        '<div class="t-field">' +
        '<span class="label-top fb-label-street-2">Address Line 2</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        '<div class="f-line-field clearfix">' +
        '<div class="f-col-1">' +
        '<div class="t-field">' +
        '<span class="label-top fb-label-city">City</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        "</div>" +
        '<div class="f-col-2">' +
        '<div class="t-field">' +
        '<span class="label-top fb-label-state">State/Province/Region</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="f-line-field clearfix">' +
        '<div class="f-col-1">' +
        '<div class="t-field">' +
        '<span class="label-top fb-label-zip">Zip/Postal/Code</span>' +
        '<input type="text" class="txt-field"/>' +
        "</div>" +
        "</div>" +
        '<div class="f-col-2">' +
        '<div class="t-field">' +
        '<span class="label-top fb-label-country">Country</span>' +
        '<select class="fb-select-address-country">' +
        "<option>USA</option>" +
        "<option>USA</option>" +
        "<option>USA</option>" +
        "</select>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 7) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Price_Question", "defaultIdentifier":"Price_Question", "visible":"0", "labelText":"Price", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='7'>" +
        '<div class="tpl-block-content clearfix wrap-tpl-price">' +
        "<label><span>Price</span></label>" +
        '<div class="tpl-price clearfix">' +
        '<div class="price-type">$</div>' +
        '<div class="t-field">' +
        '<span class="label-top">Dollars</span>' +
        '<input type="text" class="txt-field txt-dollars"/>' +
        "</div>" +
        '<div class="price-separator">.</div>' +
        '<div class="t-field">' +
        '<span class="label-top">Cents</span>' +
        '<input type="text" class="txt-field txt-cents"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 8) {
      if (opt.labelPos == "2") {
        posLabel = 0;
      } else {
        posLabel = opt.labelPos;
      }
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Section_Breack_Question", "defaultIdentifier":"Section_Breack_Question", "visible":"0", "labelText":"Section Breack", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='8'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Section Breack</span></label>" +
        '<div class="t-field"><div class="fb-html"></div></div>' +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 9) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Number_Question", "defaultIdentifier":"Number_Question", "visible":"0", "labelText":"Number", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='9'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Number</span></label>" +
        '<div class="t-field">' +
        '<div class="resizable-field size-medium">' +
        '<input type="text" class="txt-field fb-field-resize-custom" value="0123456789"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 10) {
      if (opt.labelPos == "2") {
        posLabel = 0;
      } else {
        posLabel = opt.labelPos;
      }
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Checkboxes_Question", "defaultIdentifier":"Checkboxes_Question", "visible":"0", "direction":"0", "countColumns":"3", "labelText":"Checkboxes", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='10'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Checkboxes</span></label>" +
        '<div class="tpl-checkboxes clearfix">' +
        '<div class="t-field">' +
        '<div class="t-checkbox">' +
        '<label><i class="icn-checkbox"></i><input type="checkbox"><span class="fb-choice">First option</span></label>' +
        "</div>" +
        "</div>" +
        '<div class="t-field">' +
        '<div class="t-checkbox">' +
        '<label><i class="icn-checkbox"></i><input type="checkbox"><span class="fb-choice">Second option</span></label>' +
        "</div>" +
        "</div>" +
        '<div class="t-field">' +
        '<div class="t-checkbox">' +
        '<label><i class="icn-checkbox"></i><input type="checkbox"><span class="fb-choice">Third option</span></label>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 11) {
      if (opt.labelPos == "2") {
        posLabel = 0;
      } else {
        posLabel = opt.labelPos;
      }
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Drop_Down_Question", "defaultIdentifier":"Drop_Down_Question", "visible":"0", "labelText":"Drop Down", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None", "dropdownBackground":"None", "dropdownBorderColor":"None", "dropdownFont":"None", "dropdownSize":"None", "dropdownColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='11'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Drop Down</span></label>" +
        '<div class="t-field">' +
        '<div class="resizable-field size-medium">' +
        "<select>" +
        "<option>First option</option>" +
        "<option>Second option</option>" +
        "<option>Third option</option>" +
        "</select>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 12) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Date_Question", "defaultIdentifier":"Date_Question", "visible":"0", "labelText":"Date", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='12'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Date</span></label>" +
        '<div class="tpl-date">' +
        '<div class="t-field">' +
        '<span class="icn-search-date"></span>' +
        '<input class="txt-field ll-input-date" type="text"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 13) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Phone_Question", "defaultIdentifier":"Phone_Question", "visible":"0", "labelText":"Phone", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='13'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Phone</span></label>" +
        '<div class="tpl-phone">' +
        '<div class="resizable-field size-small">' +
        '<input type="text" class="txt-field fb-field-resize-custom"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 14) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Web_Site_Question", "defaultIdentifier":"Web_Site_Question", "visible":"0", "labelText":"Web Site", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='14'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Web Site</span></label>" +
        '<div class="tpl-web-site">' +
        '<div class="t-field">' +
        '<div class="resizable-field size-medium">' +
        '<input type="text" class="txt-field fb-field-resize-custom" placeholder="http://"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 15) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Email_Question", "defaultIdentifier":"Email_Question", "visible":"0", "labelText":"Email", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='15'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Email</span></label>" +
        '<div class="tpl-email">' +
        '<div class="t-field">' +
        '<div class="resizable-field size-medium">' +
        '<input type="text" class="txt-field fb-field-resize-custom" placeholder="@"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 16) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Page_Break_Question", "defaultIdentifier":"Page_Break_Question", "visible":"0", "labelText":"Page Break", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-page-break fb-add-new-el' data-type-el='16'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Page Break</span></label>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 17) {
      dataAll =
        '{"labelWidth":"None", "identifierCustom":"0", "identifier":"Calculated_Question", "defaultIdentifier":"Calculated_Question", "visible":"0", "labelText":"Calculated", "fieldLength":"None", "labelFont":"None", "labelSize":"None", "labelColor":"None", "labelPos":"None", "fieldBackground":"None", "fieldBorderStyle":"None", "fieldBorderWidth":"None", "fieldBorderColor":"None", "fieldBorderRadius":"None", "fieldFont":"None", "fieldSize":"None", "fieldColor":"None"}';

      htmlEl =
        "<div data-json='" +
        dataAll +
        "' class='tpl-block fb-add-new-el' data-type-el='17'>" +
        '<div class="tpl-block-content clearfix">' +
        "<label><span>Calculated</span></label>" +
        '<div class="tpl-calculated">' +
        '<div class="t-field">' +
        '<div class="resizable-field size-medium">' +
        '<input type="text" class="txt-field fb-field-resize-custom"/>' +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        '<div class="tpl-block-controls">' +
        '<a href="#" class="t-btn-gray tpl-block-move"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-edit"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-clone"><i></i></a>' +
        '<a href="#" class="t-btn-gray tpl-block-delete"><i></i></a>' +
        "</div>" +
        "</div>";
    } else if (type == 18) {
      $box.find(".eb-block-content").replaceWith("");
      return false;
    } else if (type == 19) {
      $box.find(".eb-block-content").replaceWith("");
      return false;
    } else if (type == 20) {
      $box.find(".eb-block-content").replaceWith("");
      return false;
    }

    if (isDrop) {
      $box.find(".eb-block-content").replaceWith(htmlEl);
    } else {
      $box.prepend(htmlEl);
    }
    $("select:visible").chosen();

    var $block = $(".wrap-tpl-block .tpl-block.fb-add-new-el");
    var bgColorForm = "trnasparent";

    opt.isTransparentFormBackground === "1"
      ? (bgColorForm = "transparent")
      : (bgColorForm = opt.formBackground);

    $block.removeClass("fb-add-new-el").css("background-color", bgColorForm);

    if (type == 5) {
      page.timeElement($block.find(".tpl-time .txt-field"));
    } else if (type == 12) {
      page.dateElement($block.find(".tpl-date .ll-input-date"));
    } else if (type == 13) {
      page.phoneElement($block.find(".tpl-phone .txt-field"));
    }

    $block
      .find(".tpl-block-content")
      .children("label")
      .css({
        "font-family": opt.labelFont + ", sans-serif",
        "font-size": opt.labelSize + "px",
        color: opt.labelColor
      });
    $block.find(".txt-field").css({
      "background-color": opt.fieldBackground,
      "border-style": opt.fieldBorderStyle.toLowerCase(),
      "border-width": opt.fieldBorderWidth + "px",
      "border-color": opt.fieldBorderColor,
      "border-radius": opt.fieldBorderRadius + "px",
      "font-family": opt.fieldFont + ", sans-serif",
      "font-size": opt.fieldSize + "px",
      color: opt.fieldColor
    });

    page.labelPosition($block);
    page.fieldSize($block);
    page.showHideInfBlock();
    page.dropDownStyleUpdate($block);
  },

  showHideInfBlock: function() {
    if ($(".wrap-tpl-block .tpl-block").length > 0) {
      $(".fb-dragenddrop-box").hide();
      $(".wrap-tpl-block").css("min-height", "0");
      $("#wrap-form-submit-button").show();
    } else {
      $("#wrap-form-submit-button").hide();
      $(".wrap-tpl-block").css("min-height", "340px");
      $(".fb-dragenddrop-box").show();
    }
    $(".wrap-tpl-block").each(function() {
      if ($(this).find(".tpl-block").length > 0) {
        $(this)
          .find(".fb-dragenddrop-box-text")
          .hide();
        if (
          $(this).parents(".fb-wrap-three-columns, .fb-wrap-two-columns").length
        ) {
          $(this).removeClass("fb-noactive-container");
        }
      } else {
        $(this)
          .find(".fb-dragenddrop-box-text")
          .show();
        if (
          $(this).parents(".fb-wrap-three-columns, .fb-wrap-two-columns").length
        ) {
          $(this).addClass("fb-noactive-container");
        }
      }
    });
    page.useCaptchaFormShowHide();
  },
  useCaptchaForm: function() {
    $("#check-use-captcha").on("click", function() {
      page.useCaptchaFormShowHide();
    });
    page.useCaptchaFormShowHide();
  },
  useCaptchaFormShowHide: function($check) {
    var $check = $("#check-use-captcha");
    if ($(".wrap-tpl-block .tpl-block").length > 0) {
      if ($check.is(":checked")) {
        $(".fb-recaptcha").show();
      } else {
        $(".fb-recaptcha").hide();
      }
    } else {
      $(".fb-recaptcha").hide();
    }
  },
  elementsClone: function($btn) {
    var $block = $btn.parents(".tpl-block");
    var type = $block.attr("data-type-el");
    var $clone = $block.clone();
    $clone.removeClass("selected").addClass("fb-clone-new");
    $block.after($clone);
    if (type == "5") {
      $(".fb-clone-new")
        .find(".txt-field")
        .timeEntry("destroy");
      page.timeElement($(".fb-clone-new").find(".txt-field"));
    }
    if (type == "12") {
      //$('.fb-clone-new').find('.txt-field').removeAttr('id').removeClass('hasDatepicker');
      page.dateElement($(".fb-clone-new").find(".txt-field"));
    }
    if (type == "13") {
      $(".fb-clone-new")
        .find(".txt-field")
        .inputmask("remove");
      page.phoneElement($(".fb-clone-new").find(".txt-field"));
    }
    if (type == "11" || type == "6") {
      var $select = $(".fb-clone-new").find("select");
      var htmlOption = $select.html();
      $(".fb-clone-new")
        .find(".chzn-container")
        .remove();
      $select.replaceWith("<select>" + htmlOption + "</select>");
      $(".fb-clone-new")
        .find("select")
        .chosen();
    }
    $(".fb-clone-new").removeClass("fb-clone-new");
  },
  dateElement: function($input) {
    $input.datetimepicker({
      timepicker: false,
      format: "d-m-Y",
      value: new Date()
    });
    $input.prev(".icn-search-date").on("click", function(e) {
      e.stopPropagation();
      e.preventDefault();
      $(this)
        .next("input")
        .trigger("focus");
    });
  },
  timeElement: function($input) {
    $input
      .timeEntry({
        spinnerSize: [0, 0, 0]
      })
      .val("12:00AM");
  },
  phoneElement: function($input) {
    $input.inputmask("mask", { mask: "(999) - 999 - 9999" });
  },
  colorBox: function() {
    $(".color-box").each(function() {
      var color = $(this).attr("data-color-start");
      $(this)
        .colpick({
          colorScheme: "dark",
          layout: "hex",
          color: color,
          onSubmit: function(hsb, hex, rgb, el) {
            $(el).css("background-color", "#" + hex);
            $(el).colpickHide();
            page.updateColorElTpl(el, hex);
          }
        })
        .css("background-color", "#" + color);
    });
  },
  resizableField: function() {
    $(".wrap-tpl-block").on("focus", ".fb-field-resize-custom", function(e) {
      $(this)
        .parents(".resizable-field")
        .resizable({
          handles: "e",
          minHeight: 30,
          minWidth: 100,
          height: "auto",
          maxWidth: "100%",
          distance: 10
        });
    });
    $(".wrap-tpl-block").on("blur", ".fb-field-resize-custom", function(e) {
      $(this)
        .parents(".resizable-field")
        .resizable("destroy");
    });
  },

  /*update elements*/
  editElementTpl: function(type) {
    var $tpl = $('.tpl-block.selected"');
    var opt = $tpl.data("json");
    var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
    var optGlobal = $tplGlobal.data("json");

    var $slide = $("#fb-slide-panel-" + type);

    if (type == 0) {
      $("#fb-tabs-settings li")
        .eq(1)
        .trigger("click");
      $("#fb-form-title").val($.trim($(".info-form .form-tit").text()));
      $("#fb-form-description").val($.trim($(".info-form .form-desc").text()));
    } else {
      $slide.find(".fb-label-text").val(opt.labelText);
      $slide
        .find('.fb-label-font option[value="' + opt.labelFont + '"]')
        .attr("selected", true);
      $slide.find(".fb-label-font").trigger("liszt:updated");
      $slide
        .find('.fb-label-size option[value="' + opt.labelSize + '"]')
        .attr("selected", true);
      $slide.find(".fb-label-size").trigger("liszt:updated");

      if (opt.labelColor == "None") {
        $slide
          .find(".fb-label-color")
          .colpickSetColor(optGlobal.labelColor, true)
          .css("background-color", optGlobal.labelColor);
      } else {
        $slide
          .find(".fb-label-color")
          .colpickSetColor(opt.labelColor, true)
          .css("background-color", opt.labelColor);
      }

      $slide
        .find('.fb-label-pos option[value="' + opt.labelPos + '"]')
        .attr("selected", true);
      $slide.find(".fb-label-pos").trigger("liszt:updated");

      if (opt.labelWidth == "None") {
        $slide.find(".txt-field-label-width").val(optGlobal.labelWidth);
      } else {
        $slide.find(".txt-field-label-width").val(opt.labelWidth);
      }

      if (opt.labelPos == 1) {
        $slide.find(".fb-field-label-width").show();
      } else {
        $slide.find(".fb-field-label-width").hide();
      }

      if (
        type == 1 ||
        type == 2 ||
        type == 4 ||
        type == 5 ||
        type == 6 ||
        type == 7 ||
        type == 9 ||
        type == 11 ||
        type == 12 ||
        type == 13 ||
        type == 14 ||
        type == 15
      ) {
        if (opt.fieldBackground == "None") {
          $slide
            .find(".fb-field-background")
            .colpickSetColor(optGlobal.fieldBackground, true)
            .css("background-color", optGlobal.fieldBackground);
        } else {
          $slide
            .find(".fb-field-background")
            .colpickSetColor(opt.fieldBackground, true)
            .css("background-color", opt.fieldBackground);
        }

        $slide
          .find(
            '.fb-field-border-type option[value="' + opt.fieldBorderStyle + '"]'
          )
          .attr("selected", true);
        $slide.find(".fb-field-border-type").trigger("liszt:updated");

        if (opt.fieldBorderWidth == "None") {
          $slide.find(".fb-field-border-width").val(optGlobal.fieldBorderWidth);
        } else {
          $slide.find(".fb-field-border-width").val(opt.fieldBorderWidth);
        }
        if (opt.fieldBorderColor == "None") {
          $slide
            .find(".fb-field-border-color")
            .colpickSetColor(optGlobal.fieldBorderColor, true)
            .css("background-color", optGlobal.fieldBorderColor);
        } else {
          $slide
            .find(".fb-field-border-color")
            .colpickSetColor(opt.fieldBorderColor, true)
            .css("background-color", opt.fieldBorderColor);
        }
        if (opt.fieldBorderRadius == "None") {
          $slide
            .find(".fb-field-border-radius")
            .val(optGlobal.fieldBorderRadius);
        } else {
          $slide.find(".fb-field-border-radius").val(opt.fieldBorderRadius);
        }

        $slide
          .find('.fb-field-font option[value="' + opt.fieldFont + '"]')
          .attr("selected", true);
        $slide.find(".fb-field-font").trigger("liszt:updated");

        $slide
          .find('.fb-field-size option[value="' + opt.fieldSize + '"]')
          .attr("selected", true);
        $slide.find(".fb-field-size").trigger("liszt:updated");

        if (opt.fieldColor == "None") {
          $slide
            .find(".fb-field-color")
            .colpickSetColor(optGlobal.fieldColor, true)
            .css("background-color", optGlobal.fieldColor);
        } else {
          $slide
            .find(".fb-field-color")
            .colpickSetColor(opt.fieldColor, true)
            .css("background-color", opt.fieldColor);
        }
      }
      if (type == 6 || type == 11) {
        if (opt.dropdownBackground == "None") {
          $slide
            .find(".fb-dropdown-background")
            .colpickSetColor(optGlobal.dropdownBackground, true)
            .css("background-color", optGlobal.dropdownBackground);
        } else {
          $slide
            .find(".fb-dropdown-background")
            .colpickSetColor(opt.dropdownBackground, true)
            .css("background-color", opt.dropdownBackground);
        }

        if (opt.dropdownBorderColor == "None") {
          $slide
            .find(".fb-dropdown-border-color")
            .colpickSetColor(optGlobal.dropdownBorderColor, true)
            .css("background-color", optGlobal.dropdownBorderColor);
        } else {
          $slide
            .find(".fb-dropdown-border-color")
            .colpickSetColor(opt.dropdownBorderColor, true)
            .css("background-color", opt.dropdownBorderColor);
        }

        $slide
          .find('.fb-dropdown-font option[value="' + opt.dropdownFont + '"]')
          .attr("selected", true);
        $slide.find(".fb-dropdown-font").trigger("liszt:updated");

        $slide
          .find('.fb-dropdown-size option[value="' + opt.dropdownSize + '"]')
          .attr("selected", true);
        $slide.find(".fb-dropdown-size").trigger("liszt:updated");

        if (opt.dropdownColor == "None") {
          $slide
            .find(".fb-dropdown-color")
            .colpickSetColor(optGlobal.dropdownColor, true)
            .css("background-color", optGlobal.dropdownColor);
        } else {
          $slide
            .find(".fb-dropdown-color")
            .colpickSetColor(opt.dropdownColor, true)
            .css("background-color", opt.dropdownColor);
        }
      }
      if (
        type == 1 ||
        type == 2 ||
        type == 4 ||
        type == 5 ||
        type == 6 ||
        type == 9 ||
        type == 11 ||
        type == 13 ||
        type == 14 ||
        type == 15 ||
        type == 17
      ) {
        $slide
          .find('.fb-field-length option[value="' + opt.fieldLength + '"]')
          .attr("selected", true);
        $slide.find(".fb-field-length").trigger("liszt:updated");
      }
      if (type == 6) {
        $("#fb-address-street").val($tpl.find(".fb-label-street").text());
        $("#fb-address-street-2").val($tpl.find(".fb-label-street-2").text());
        $("#fb-address-city").val($tpl.find(".fb-label-city").text());
        $("#fb-address-state").val($tpl.find(".fb-label-state").text());
        $("#fb-address-zip").val($tpl.find(".fb-label-zip").text());
        $("#fb-address-country").val($tpl.find(".fb-label-country").text());
      }
      if (type == 4) {
        $("#fb-field-name-first").val(opt.nameFirst);
        $("#fb-field-name-last").val(opt.nameLast);
      }
      if (type == 3) {
        page.updateMultipleChoice("radio");
        if (opt.direction == "0") {
          $("#fb-radio-vertical").attr("checked", "checked");
          pages.checkboxRadioButtons.isChecked($("#fb-radio-vertical"), true);
          $(".fb-box-number-columns-radio").hide();
        } else {
          $("#fb-radio-horizontal").attr("checked", "checked");
          pages.checkboxRadioButtons.isChecked($("#fb-radio-horizontal"), true);
          $(".fb-box-number-columns-radio").show();
          $slide
            .find(
              '.fb-number-columns-radio option[value="' +
                opt.countColumns +
                '"]'
            )
            .attr("selected", true);
          $slide.find(".fb-number-columns-radio").trigger("liszt:updated");
        }
      }
      if (type == 8) {
        $("#fb-html-seaction-break").val($tpl.find(".fb-html").html());
      }
      if (type == 10) {
        page.updateMultipleChoice("checkbox");
        if (opt.direction == "0") {
          $("#fb-checked-vertical").attr("checked", "checked");
          pages.checkboxRadioButtons.isChecked($("#fb-checked-vertical"), true);
          $(".fb-box-number-columns-checkboxes").hide();
        } else {
          $("#fb-checked-horizontal").attr("checked", "checked");
          pages.checkboxRadioButtons.isChecked(
            $("#fb-checked-horizontal"),
            true
          );
          $(".fb-box-number-columns-checkboxes").show();
          $slide
            .find(
              '.fb-number-columns-checkboxes option[value="' +
                opt.countColumns +
                '"]'
            )
            .attr("selected", true);
          $slide.find(".fb-number-columns-checkboxes").trigger("liszt:updated");
        }
      }
      if (type == 11) {
        page.updateMultipleChoice("select");
      }

      $slide
        .find(".fb-field-visible option")
        .eq(opt.visible)
        .attr("selected", true);
      $slide.find(".fb-field-visible").trigger("liszt:updated");
      if (opt.visible == "1") {
        $slide.find(".fb-set-rule-link").show();
      } else {
        $slide.find(".fb-set-rule-link").hide();
      }
      $slide.find(".fb-identifier-input").val(opt.identifier);

      if (opt.identifierCustom == "0") {
        $slide.find(".fb-identifier-input").attr("disabled", "disabled");
        $(".fb-auto-identifier-section").show();
        $(".fb-custom-identifier-section").hide();
      } else {
        $slide.find(".fb-identifier-input").removeAttr("disabled");
        $(".fb-auto-identifier-section").hide();
        $(".fb-custom-identifier-section").show();
      }
    }
  },
  multipleAction: function() {
    $(".fb-multiple-field").on("click", ".fb-btn-add", function() {
      var value = "Last option";
      if ($(this).parents(".fb-rus-сompetitors").length) {
        value = "";
      }
      var content =
        '<div class="t-field">' +
        '<a href="#" class="fb-btn-add t-btn-gray"></a> ' +
        '<a href="#" class="fb-btn-remove t-btn-gray"></a> ' +
        '<input type="text" class="txt-field" value="' +
        value +
        '"/>' +
        "</div>";
      var $btn = $(this);
      var $box = $btn.parents(".fb-multiple-field");
      var type = page.typeMultiple($box);

      $box.append(content);
      page.isCountMultipleField($box);
      page.addMultipleChoice(type);
    });
    $(".fb-multiple-field").on("click", ".fb-btn-remove", function() {
      var $btn = $(this);
      var $box = $btn.parents(".fb-multiple-field");
      var index = $box.find(".t-field").index($btn.parent());
      var type = page.typeMultiple($box);

      $btn.parent().remove();
      page.isCountMultipleField($box);
      page.removeMultipleChoice(type, index);
    });
    $(".fb-multiple-field").on("keyup", ".txt-field", function() {
      var $input = $(this);
      var val = $input.val();
      var $box = $input.parents(".fb-multiple-field");
      var index = $box.find(".t-field").index($input.parent());
      var type = page.typeMultiple($box);

      page.updateMultipleText(type, index, val);
    });
  },
  updateMultipleText: function(type, index, val) {
    var $tpl = $(".tpl-block.selected");

    if (type == "radio") {
      var $box = $tpl.find(".tpl-multiple-choise");
      $box
        .find(".fb-choice")
        .eq(index)
        .text(val);
    } else if (type == "checkbox") {
      var $box = $tpl.find(".tpl-checkboxes");
      $box
        .find(".fb-choice")
        .eq(index)
        .text(val);
    } else {
      var $select = $tpl.find(".t-field select");
      $select
        .find("option")
        .eq(index)
        .text(val);
      $select.trigger("liszt:updated");
    }
  },
  typeMultiple: function($box) {
    var type = null;

    if ($box.parents(".fb-settings").attr("id") == "fb-settings-3") {
      type = "radio";
    } else if ($box.parents(".fb-settings").attr("id") == "fb-settings-10") {
      type = "checkbox";
    } else {
      type = "select";
    }

    return type;
  },
  isCountMultipleField: function($box) {
    var countField = $box.find(".t-field").length;
    if (countField > 1) {
      $box.find(".fb-btn-remove").show();
    } else {
      $box.find(".fb-btn-remove").hide();
    }
  },
  removeMultipleChoice: function(type, index) {
    var $tpl = $(".tpl-block.selected");
    if (type == "radio") {
      var $box = $tpl.find(".tpl-multiple-choise");
      $box
        .find(".t-field")
        .eq(index)
        .remove();
    } else if (type == "checkbox") {
      var $box = $tpl.find(".tpl-checkboxes");
      $box
        .find(".t-field")
        .eq(index)
        .remove();
    } else {
      var $select = $tpl.find(".t-field select");
      $select
        .find("option")
        .eq(index)
        .remove();
      $select
        .find("option")
        .eq(0)
        .attr("selected", true);
      $select.trigger("liszt:updated");
    }
  },
  addMultipleChoice: function(type) {
    var $tpl = $(".tpl-block.selected");

    if (type == "radio") {
      var $box = $tpl.find(".tpl-multiple-choise");
      $box.append(
        '<div class="t-field"><div class="t-radio"><label><i class="icn-radio"></i><input name="radiogroup" type="radio"><span class="fb-choice">Last option</span></label></div></div>'
      );
    } else if (type == "checkbox") {
      var $box = $tpl.find(".tpl-checkboxes");
      $box.append(
        '<div class="t-field"><div class="t-checkbox"><label><i class="icn-checkbox"></i><input type="checkbox"><span class="fb-choice">Last option</span></label></div></div>'
      );
    } else {
      var $select = $tpl.find(".t-field select");
      $select
        .find("option")
        .eq(0)
        .attr("selected", true);
      $select.append("<option>Last option</option>");
      $select.trigger("liszt:updated");
    }
  },
  updateMultipleChoice: function(type) {
    var content = "";
    var $tpl = $(".tpl-block.selected");
    var text = "";

    if (type == "radio") {
      var $box = $("#fb-settings-3 .fb-multiple-field");
      $box.html("");
      $tpl.find(".fb-choice").each(function() {
        text = $(this).text();
        content =
          '<div class="t-field">' +
          '<a href="#" class="fb-btn-add t-btn-gray"></a> ' +
          '<a href="#" class="fb-btn-remove t-btn-gray"></a> ' +
          '<input type="text" class="txt-field" value="' +
          text +
          '"/>' +
          "</div>";
        $box.append(content);
      });
    } else if (type == "checkbox") {
      var $box = $("#fb-settings-10 .fb-multiple-field");
      $box.html("");
      $tpl.find(".fb-choice").each(function() {
        text = $(this).text();
        content =
          '<div class="t-field">' +
          '<a href="#" class="fb-btn-add t-btn-gray"></a> ' +
          '<a href="#" class="fb-btn-remove t-btn-gray"></a> ' +
          '<input type="text" class="txt-field" value="' +
          text +
          '"/>' +
          "</div>";
        $box.append(content);
      });
    } else {
      var $box = $("#fb-settings-11 .fb-multiple-field");
      $box.html("");
      $tpl.find(".t-field select option").each(function() {
        text = $(this).text();
        content =
          '<div class="t-field">' +
          '<a href="#" class="fb-btn-add t-btn-gray"></a> ' +
          '<a href="#" class="fb-btn-remove t-btn-gray"></a> ' +
          '<input type="text" class="txt-field" value="' +
          text +
          '"/>' +
          "</div>";
        $box.append(content);
      });
    }
  },
  updateGlobalStyle: function() {
    var $tpl = $("#form-editor .fb-wrap-columns-form");
    var opt = $tpl.data("json");

    var bgColorForm = "transparent";
    var $checkboxIsTransparentFormBackground = $(
      "#fb-form-background-transparent-global"
    );

    if (opt.isTransparentFormBackground === "1") {
      bgColorForm = "transparent";
      $checkboxIsTransparentFormBackground.attr("checked", true);
      pages.checkboxRadioButtons.isChecked(
        $checkboxIsTransparentFormBackground,
        true
      );
    } else {
      bgColorForm = opt.formBackground;
      $checkboxIsTransparentFormBackground.attr("checked", false);
      pages.checkboxRadioButtons.isChecked(
        $checkboxIsTransparentFormBackground,
        false
      );
    }

    $("#ll-form-box")
      .colpickSetColor(opt.formBackground, true)
      .css("background-color", bgColorForm);
    $("#ll-form-box")
      .colpickSetColor(opt.formTextColor, true)
      .css("color", opt.formTextColor);

    $('#fb-field-length-global option[value="' + opt.fieldLength + '"]').attr(
      "selected",
      true
    );
    $("#fb-field-length-global").trigger("liszt:updated");

    $('#fb-label-font-global option[value="' + opt.labelFont + '"]').attr(
      "selected",
      true
    );
    $("#fb-label-font-global").trigger("liszt:updated");
    $('#fb-label-size-global option[value="' + opt.labelSize + '"]').attr(
      "selected",
      true
    );
    $("#fb-label-size-global").trigger("liszt:updated");
    $("#fb-label-color-global")
      .colpickSetColor(opt.labelColor, true)
      .css("background-color", opt.labelColor);
    $('#fb-label-pos-global option[value="' + opt.labelPos + '"]').attr(
      "selected",
      true
    );
    $("#fb-label-pos-global").trigger("liszt:updated");

    $("#fb-field-label-width-global").val(opt.labelWidth);

    $("#fb-field-background-global")
      .colpickSetColor(opt.fieldBackground, true)
      .css("background-color", opt.fieldBackground);
    $(
      '#fb-field-border-type-global option[value="' +
        opt.fieldBorderStyle +
        '"]'
    ).attr("selected", true);
    $("#fb-field-border-type-global").trigger("liszt:updated");
    $("#fb-field-border-width-global").val(opt.fieldBorderWidth);
    $("#fb-field-border-color-global")
      .colpickSetColor(opt.fieldBorderColor, true)
      .css("background-color", opt.fieldBorderColor);
    $("#fb-field-border-radius-global").val(opt.fieldBorderRadius);
    $('#fb-field-font-global option[value="' + opt.fieldFont + '"]').attr(
      "selected",
      true
    );
    $("#fb-field-font-global").trigger("liszt:updated");
    $('#fb-field-size-global option[value="' + opt.fieldSize + '"]').attr(
      "selected",
      true
    );
    $("#fb-field-size-global").trigger("liszt:updated");
    $("#fb-field-color-global")
      .colpickSetColor(opt.fieldColor, true)
      .css("background-color", opt.fieldColor);

    $("#fb-dropdown-background-global")
      .colpickSetColor(opt.dropdownBackground, true)
      .css("background-color", opt.dropdownBackground);
    $("#fb-dropdown-border-color-global")
      .colpickSetColor(opt.dropdownBorderColor, true)
      .css("background-color", opt.dropdownBorderColor);
    $('#fb-dropdown-font-global option[value="' + opt.dropdownFont + '"]').attr(
      "selected",
      true
    );
    $("#fb-dropdown-font-global").trigger("liszt:updated");
    $('#fb-dropdown-size-global option[value="' + opt.fieldSize + '"]').attr(
      "selected",
      true
    );
    $("#fb-dropdown-size-global").trigger("liszt:updated");
    $("#fb-dropdown-color-global")
      .colpickSetColor(opt.fieldColor, true)
      .css("background-color", opt.dropdownColor);

    $("#fb-button-background-global")
      .colpickSetColor(opt.btnBackground, true)
      .css("background-color", opt.btnBackground);
    $(
      '#fb-button-border-type-global option[value="' + opt.btnBorderStyle + '"]'
    ).attr("selected", true);
    $("#fb-button-border-type-global").trigger("liszt:updated");
    $("#fb-button-border-width-global").val(opt.btnBoderWidth);
    $("#fb-button-border-color-global")
      .colpickSetColor(opt.btnBorderColor, true)
      .css("background-color", opt.btnBorderColor);
    $('#fb-button-font-global option[value="' + opt.btnFont + '"]').attr(
      "selected",
      true
    );
    $("#fb-button-font-global").trigger("liszt:updated");
    $('#fb-button-size-global option[value="' + opt.btnSize + '"]').attr(
      "selected",
      true
    );
    $("#fb-button-size-global").trigger("liszt:updated");
    $("#fb-button-color-global")
      .colpickSetColor(opt.btnColor, true)
      .css("background-color", opt.btnColor);
    $("#btnAlign li")
      .removeClass("selected")
      .eq(opt.btnAlign)
      .addClass("selected");
    $("#fb-button-text, #fb-button-text-2").val(
      $(".form-submit-button").text()
    );
  },
  dropDownStyleUpdate: function($block) {
    var opt = $block.data("json");
    var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
    var optGlobal = $tplGlobal.data("json");

    var dropdownBackground = opt.dropdownBackground;
    var dropdownBorderColor = opt.dropdownBorderColor;
    var dropdownFont = opt.dropdownFont;
    var dropdownSize = opt.dropdownSize;
    var dropdownColor = opt.dropdownColor;

    if (opt.dropdownBackground == "None") {
      dropdownBackground = optGlobal.dropdownBackground;
    }
    if (opt.dropdownBorderColor == "None") {
      dropdownBorderColor = optGlobal.dropdownBorderColor;
    }
    if (opt.dropdownFont == "None") {
      dropdownFont = optGlobal.dropdownFont;
    }
    if (opt.dropdownSize == "None") {
      dropdownSize = optGlobal.dropdownSize;
    }
    if (opt.dropdownColor == "None") {
      dropdownColor = optGlobal.dropdownColor;
    }

    $block
      .find(".chzn-single")
      .css({
        "background-color": dropdownBackground,
        "border-color": dropdownBorderColor,
        "font-family": dropdownFont + ", sans-serif",
        "font-size": dropdownSize + "px",
        color: dropdownColor
      })
      .find("div b")
      .css("border-top-color", dropdownColor);
  },
  labelPosition: function($tpl) {
    var opt = $tpl.data("json");
    var type = $tpl.attr("data-type-el");
    var labelText = opt.labelText;

    if (opt.labelPos == "None") {
      var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
      opt = $tplGlobal.data("json");
    }
    if (opt.labelPos != 1) {
      $tpl
        .find(
          ".fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field"
        )
        .css({
          marginLeft: 0
        });
      $tpl.find(".fb-side-label > label").css({
        width: "100%"
      });
    }
    if (opt.labelPos == 1) {
      $tpl
        .find(".tpl-block-content")
        .removeClass("fb-inside-label")
        .addClass("fb-side-label");
      if (
        type == "1" ||
        type == "2" ||
        type == "5" ||
        type == "9" ||
        type == "12" ||
        type == "13" ||
        type == "14" ||
        type == "15"
      ) {
        $tpl.find(".txt-field").attr("placeholder", "");
      }
      if (!$tplGlobal) {
        if (opt.labelWidth == "None") {
          var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
          opt = $tplGlobal.data("json");
        }
      }
      $tpl
        .find(
          ".fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field"
        )
        .css({
          marginLeft: opt.labelWidth + "%"
        });
      $tpl.find(".fb-side-label > label").css({
        width: opt.labelWidth + "%"
      });
    } else if (opt.labelPos == 2) {
      $tpl
        .find(".tpl-block-content")
        .removeClass("fb-side-label")
        .addClass("fb-inside-label");
      if (
        type == "1" ||
        type == "2" ||
        type == "5" ||
        type == "9" ||
        type == "12" ||
        type == "13" ||
        type == "14" ||
        type == "15"
      ) {
        $tpl.find(".txt-field").attr("placeholder", labelText);
      }
      if (type == "4" || type == "6" || type == "7") {
        $tpl.find(".txt-field").each(function() {
          var $el = $(this);
          var $label = $el.parents(".t-field:first").find(".label-top");
          $el.attr("placeholder", $label.text());
          $label.hide();
        });
      }
      if (type == "6" || type == "11") {
        var $select = $tpl.find("select");
        var $label = $select.prev(".label-top");
        var labelTextDropdown = "";

        if (type == "6") {
          labelTextDropdown = $label.text();
        } else {
          labelTextDropdown = labelText;
        }

        $select
          .removeClass("chzn-done")
          .removeAttr("id")
          .next()
          .remove();

        $select.replaceWith(
          '<select class="fb-select-address-country">' +
            $select.html() +
            "</select>"
        );
        $select = $tpl.find("select.fb-select-address-country");
        $select.attr("data-placeholder", labelTextDropdown);

        $select.prepend(
          $(
            '<option selected="selected" class="fb-placeholder-option"></option>'
          )
        );
        $select.chosen();
        page.dropDownStyleUpdate($tpl);
        $label.hide();
      }
    } else if (opt.labelPos == 0) {
      $tpl
        .find(".tpl-block-content")
        .removeClass("fb-side-label fb-inside-label");
      if (
        type == "1" ||
        type == "2" ||
        type == "5" ||
        type == "9" ||
        type == "12" ||
        type == "13" ||
        type == "14" ||
        type == "15"
      ) {
        $tpl.find(".txt-field").attr("placeholder", "");
      }
    }

    if (opt.labelPos != 2) {
      if (type == "4" || type == "6" || type == "7") {
        $tpl.find(".txt-field").each(function() {
          var $el = $(this);
          var $label = $el.parents(".t-field:first").find(".label-top");
          $el.attr("placeholder", "");
          $label.show();
        });
      }
      if (type == "6" || type == "11") {
        var $select = $tpl.find("select");
        var $label = $select.prev(".label-top");
        $select.find("option.fb-placeholder-option").remove();
        $select
          .removeClass("chzn-done")
          .removeAttr("id")
          .next()
          .remove();
        $select.chosen();
        page.dropDownStyleUpdate($tpl);
        $label.show();
      }
    }
  },
  fieldSize: function($tpl) {
    var type = $tpl.attr("data-type-el");

    if (
      type == 1 ||
      type == 2 ||
      type == 4 ||
      type == 5 ||
      type == 6 ||
      type == 7 ||
      type == 9 ||
      type == 11 ||
      type == 13 ||
      type == 14 ||
      type == 15 ||
      type == 17
    ) {
      var opt = $tpl.data("json");

      if (opt.fieldLength == "None") {
        var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
        opt = $tplGlobal.data("json");
      }

      if (type == 6 || type == 4) {
        if (opt.fieldLength == "small") {
          $tpl
            .find(".tpl-address, .tpl-name")
            .children(".t-field, .f-line-field")
            .removeClass("size-medium")
            .addClass("size-small");
        } else if (opt.fieldLength == "medium") {
          $tpl
            .find(".tpl-address, .tpl-name")
            .children(".t-field, .f-line-field")
            .removeClass("size-small")
            .addClass("size-medium");
        } else if (opt.fieldLength == "large") {
          $tpl
            .find(".tpl-address, .tpl-name")
            .children(".t-field, .f-line-field")
            .removeClass("size-small size-medium");
        }
      } else {
        $tpl.find(".resizable-field").css({
          width: ""
        });
        if (opt.fieldLength == "small") {
          $tpl
            .find(".resizable-field")
            .removeClass("size-medium")
            .addClass("size-small");
        } else if (opt.fieldLength == "medium") {
          $tpl
            .find(".resizable-field")
            .removeClass("size-small")
            .addClass("size-medium");
        } else if (opt.fieldLength == "large") {
          $tpl.find(".resizable-field").removeClass("size-small size-medium");
        }
      }
    }
  },
  labelWidth: function() {},
  actionStyleField: function() {
    $(".fb-label-font").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.labelFont = $(this).val();
      $tpl
        .find(".tpl-block-content")
        .children("label")
        .css("font-family", opt.labelFont + ", sans-serif");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-label-size").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.labelSize = $(this).val();
      $tpl
        .find(".tpl-block-content")
        .children("label")
        .css("font-size", opt.labelSize + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-label-pos").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var type = $tpl.attr("data-type-el");
      var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
      var optGlobal = $tplGlobal.data("json");
      var $slide = $(this).parents(".fb-form-style");

      opt.labelPos = $(this).val();

      if (opt.labelPos == 1) {
        if (opt.labelWidth == "None") {
          $slide.find(".txt-field-label-width").val(optGlobal.labelWidth);
        } else {
          $slide.find(".txt-field-label-width").val(opt.labelWidth);
        }

        $slide.find(".fb-field-label-width").show();
      } else {
        $slide.find(".fb-field-label-width").hide();
        opt.labelWidth = "None";
      }

      $tpl.attr("data-json", JSON.stringify(opt));
      page.labelPosition($tpl);
    });
    $(".fb-field-border-type").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.fieldBorderStyle = $(this).val();
      $tpl
        .find(".txt-field")
        .css("border-style", opt.fieldBorderStyle.toLowerCase());
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-field-border-width").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.fieldBorderWidth = $(this).val();
      $tpl.find(".txt-field").css("border-width", opt.fieldBorderWidth + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-field-border-radius").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.fieldBorderRadius = $(this).val();
      $tpl
        .find(".txt-field")
        .css("border-radius", opt.fieldBorderRadius + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-field-font").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.fieldFont = $(this).val();
      $tpl
        .find(".txt-field")
        .css("font-family", opt.fieldFont + ", sans-serif");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-field-size").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.fieldSize = $(this).val();
      $tpl.find(".txt-field").css("font-size", opt.fieldSize + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-dropdown-font").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.dropdownFont = $(this).val();
      $tpl
        .find(".chzn-single")
        .css("font-family", opt.dropdownFont + ", sans-serif");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-dropdown-size").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.dropdownSize = $(this).val();
      $tpl.find(".chzn-single").css("font-size", opt.dropdownSize + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-field-name-first").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.nameFirst = $(this).val();
      $(".tpl-name .t-field:first .label-top").text(opt.nameFirst);
      $tpl.attr("data-json", JSON.stringify(opt));
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-field-name-last").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.nameLast = $(this).val();
      $(".tpl-name .t-field:last .label-top").text(opt.nameLast);
      $tpl.attr("data-json", JSON.stringify(opt));
      if (opt.labelPos == 2) {
        page.labelPosition($tpl);
      }
    });
    $(".fb-label-text").on("keyup", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
      var optGlobal = $tplGlobal.data("json");

      opt.labelText = $(this).val();
      $tpl
        .find(".tpl-block-content")
        .children("label")
        .children("span")
        .text(opt.labelText);

      $tpl.attr("data-json", JSON.stringify(opt));
      if (
        opt.labelPos == 2 ||
        (opt.labelPos == "None" && optGlobal.labelPos == 2)
      ) {
        page.labelPosition($tpl);
      }
    });
    $("#fb-form-title").on("keyup", function() {
      var val = $(this).val();
      $(".info-form")
        .find(".form-tit")
        .text(val);
      $(".fb-input-form-tit").val(val);
      $(".h-edit-text span").text(val);
    });
    $("#fb-form-description").on("keyup", function() {
      var val = $(this).val();
      $(".info-form")
        .find(".form-desc")
        .text(val);
      $(".fb-textarea-form-desc").val(val);
    });
    $(".info-form").on("keyup", ".fb-input-form-tit", function() {
      var val = $(this).val();
      $(".info-form")
        .find(".form-tit")
        .text(val);
      $("#fb-form-title").val(val);
      $(".h-edit-text span").text(val);
    });
    $(".info-form").on("keyup", ".fb-textarea-form-desc", function() {
      var val = $(this).val();
      $(".info-form")
        .find(".form-desc")
        .text(val);
      $("#fb-form-description").val(val);
    });
    $(".fb-field-length").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.fieldLength = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));
      page.fieldSize($tpl);
    });

    $("#fb-field-length-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");
      opt.fieldLength = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldLength == "None") {
          page.fieldSize($tplСurrent);
        }
      });
    });
    $("#fb-label-font-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.labelFont = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.labelFont == "None") {
          $tplСurrent
            .find(".tpl-block-content")
            .children("label")
            .css("font-family", opt.labelFont + ", sans-serif");
        }
      });
    });
    $("#fb-label-size-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.labelSize = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.labelSize == "None") {
          $tplСurrent
            .find(".tpl-block-content")
            .children("label")
            .css("font-size", opt.labelSize + "px");
        }
      });
    });
    $("#fb-label-pos-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.labelPos = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));
      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.labelPos == "None") {
          page.labelPosition($tplСurrent);
        }
      });
    });
    $("#fb-field-label-width-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.labelWidth = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.labelWidth == "None") {
          $tplСurrent
            .find(
              ".fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field"
            )
            .css({
              marginLeft: opt.labelWidth + "%"
            });
          $tplСurrent.find(".fb-side-label > label").css({
            width: opt.labelWidth + "%"
          });
        }
      });
    });
    $(".txt-field-label-width").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");

      opt.labelWidth = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $tpl
        .find(
          ".fb-side-label > .tpl-email,.fb-side-label > .tpl-web-site,.fb-side-label > .tpl-date,.fb-side-label > .tpl-checkboxes,.fb-side-label > .tpl-price,.fb-side-label > .tpl-address,.fb-side-label > .tpl-time,.fb-side-label > .tpl-name,.fb-side-label > .tpl-multiple-choise,.fb-side-label > .t-field"
        )
        .css({
          marginLeft: opt.labelWidth + "%"
        });
      $tpl.find(".fb-side-label > label").css({
        width: opt.labelWidth + "%"
      });
    });
    $("#fb-field-border-type-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.fieldBorderStyle = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldBorderStyle == "None") {
          $tplСurrent
            .find(".txt-field")
            .css("border-style", opt.fieldBorderStyle.toLowerCase());
        }
      });
    });
    $("#fb-field-border-width-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.fieldBorderWidth = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldBorderWidth == "None") {
          $tplСurrent
            .find(".txt-field")
            .css("border-width", opt.fieldBorderWidth + "px");
        }
      });
    });
    $("#fb-field-border-radius-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.fieldBorderRadius = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldBorderRadius == "None") {
          $tplСurrent
            .find(".txt-field")
            .css("border-radius", opt.fieldBorderRadius + "px");
        }
      });
      console.log("text border radius");
    });
    $("#fb-field-font-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.fieldFont = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldFont == "None") {
          $tplСurrent
            .find(".txt-field")
            .css("font-family", opt.fieldFont + ", sans-serif");
        }
      });
    });
    $("#fb-field-size-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.fieldSize = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldSize == "None") {
          $tplСurrent.find(".txt-field").css("font-size", opt.fieldSize + "px");
        }
      });
    });
    $("#fb-dropdown-font-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.dropdownFont = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.dropdownFont == "None") {
          $tplСurrent
            .find(".chzn-single")
            .css("font-family", opt.dropdownFont + ", sans-serif");
        }
      });
    });
    $("#fb-dropdown-size-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.dropdownSize = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.dropdownSize == "None") {
          $tplСurrent
            .find(".chzn-single")
            .css("font-size", opt.dropdownSize + "px");
        }
      });
    });
    $("#fb-button-border-type-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.btnBorderStyle = $(this).val();
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("border-style", opt.btnBorderStyle.toLowerCase());
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-button-border-width-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.btnBoderWidth = $(this).val();
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("border-width", opt.btnBoderWidth + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-button-font-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.btnFont = $(this).val();
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("font-family", opt.btnFont + ", sans-serif");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-button-size-global").change(function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");

      opt.btnSize = $(this).val();
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("font-size", opt.btnSize + "px");
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $("#fb-button-text, #fb-button-text-2").on("keyup", function() {
      var val = $(this).val();
      var id = $(this).attr("id");

      if (id == "fb-button-text") {
        $("#fb-button-text-2").val(val);
      } else {
        $("#fb-button-text").val(val);
      }
      $(".form-submit-button").text(val);
    });
    $("#btnAlign li").on("click", function() {
      var $tpl = $("#form-editor .fb-wrap-columns-form");
      var opt = $tpl.data("json");
      var index = $(this)
        .parent()
        .children("li")
        .index($(this));
      var $box = $("#wrap-form-submit-button");
      $(this)
        .addClass("selected")
        .siblings("li")
        .removeClass("selected");

      if (index == 0) {
        $box.removeClass("fb-center-align fb-right-align");
      } else if (index == 1) {
        $box.removeClass("fb-right-align").addClass("fb-center-align");
      } else if (index == 2) {
        $box.removeClass("fb-center-align").addClass("fb-right-align");
      }

      opt.btnAlign = index;
      $tpl.attr("data-json", JSON.stringify(opt));
    });

    $("#fb-form-background-transparent-global").on("click", function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
      var optGlobal = $tplGlobal.data("json");
      var bgColor = "transparent";

      $(this).is(":checked")
        ? (optGlobal.isTransparentFormBackground = "1")
        : (optGlobal.isTransparentFormBackground = "0");

      optGlobal.isTransparentFormBackground === "1"
        ? (bgColor = "transparent")
        : (bgColor = optGlobal.formBackground);

      $("#ll-form-box").css("background-color", bgColor);
      $("#ll-form-box")
        .find(".tpl-block")
        .css("background-color", bgColor);

      $tplGlobal.attr("data-json", JSON.stringify(opt));
    });
  },
  updateColorElTpl: function(el, hex) {
    var $tpl = $(".tpl-block.selected");
    var opt = $tpl.data("json");

    var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
    var optGlobal = $tplGlobal.data("json");

    var $el = $(el);
    var id = $(el).attr("id");

    if (id == "fb-form-background-global") {
      var bgColor = "transparent";

      optGlobal.formBackground = "#" + hex;
      optGlobal.isTransparentFormBackground === "1"
        ? (bgColor = "transparent")
        : (bgColor = optGlobal.formBackground);

      $("#ll-form-box").css("background-color", bgColor);
      $("#ll-form-box")
        .find(".tpl-block")
        .css("background-color", bgColor);
      $tplGlobal.attr("data-json", JSON.stringify(opt));
    }
    if (id == "fb-form-text-color-global") {
      optGlobal.formTextColor = "#" + hex;
      $("#ll-form-box").css("color", optGlobal.formTextColor);
      $tplGlobal.attr("data-json", JSON.stringify(opt));
    } else if (id == "fb-label-color-global") {
      optGlobal.labelColor = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.labelColor == "None") {
          $tplСurrent
            .find(".tpl-block-content")
            .children("label")
            .css("color", optGlobal.labelColor);
        }
      });
    } else if (id == "fb-field-background-global") {
      optGlobal.fieldBackground = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldBackground == "None") {
          $tplСurrent
            .find(".txt-field")
            .css("background-color", optGlobal.fieldBackground);
        }
      });
    } else if (id == "fb-field-border-color-global") {
      optGlobal.fieldBorderColor = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldBorderColor == "None") {
          $tplСurrent
            .find(".txt-field")
            .css("border-color", optGlobal.fieldBorderColor);
        }
      });
    } else if (id == "fb-field-color-global") {
      optGlobal.fieldColor = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.fieldColor == "None") {
          $tplСurrent.find(".txt-field").css("color", optGlobal.fieldColor);
        }
      });
    } else if (id == "fb-dropdown-background-global") {
      optGlobal.dropdownBackground = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.dropdownBackground == "None") {
          $tplСurrent
            .find(".chzn-single")
            .css("background-color", optGlobal.dropdownBackground);
        }
      });
    } else if (id == "fb-dropdown-border-color-global") {
      optGlobal.dropdownBorderColor = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.dropdownBorderColor == "None") {
          $tplСurrent
            .find(".chzn-single")
            .css("border-color", optGlobal.dropdownBorderColor);
        }
      });
    } else if (id == "fb-dropdown-color-global") {
      optGlobal.dropdownColor = "#" + hex;
      $tplGlobal.attr("data-json", JSON.stringify(opt));

      $(".wrap-tpl-block .tpl-block").each(function() {
        var $tplСurrent = $(this);
        var optСurrent = $tplСurrent.data("json");

        if (optСurrent.dropdownColor == "None") {
          $tplСurrent
            .find(".chzn-single")
            .css("color", optGlobal.dropdownColor)
            .find("div b")
            .css("border-top-color", optGlobal.dropdownColor);
        }
      });
    } else if (id == "fb-button-background-global") {
      optGlobal.btnBackground = "#" + hex;
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("background-color", optGlobal.btnBackground);
      $tplGlobal.attr("data-json", JSON.stringify(optGlobal));
    } else if (id == "fb-button-border-color-global") {
      optGlobal.btnBorderColor = "#" + hex;
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("border-color", optGlobal.btnBorderColor);
      $tplGlobal.attr("data-json", JSON.stringify(optGlobal));
    } else if (id == "fb-button-color-global") {
      optGlobal.btnColor = "#" + hex;
      $(
        ".form-submit-button, .fb-next-page-section, .fb-prev-page-section"
      ).css("color", optGlobal.btnColor);
      $tplGlobal.attr("data-json", JSON.stringify(optGlobal));
    } else if ($el.hasClass("fb-label-color")) {
      opt.labelColor = "#" + hex;
      $tpl
        .find(".tpl-block-content")
        .children("label")
        .css("color", opt.labelColor);
      $tpl.attr("data-json", JSON.stringify(opt));
    } else if ($el.hasClass("fb-field-background")) {
      opt.fieldBackground = "#" + hex;
      $tpl.find(".txt-field").css("background-color", opt.fieldBackground);
      $tpl.attr("data-json", JSON.stringify(opt));
    } else if ($el.hasClass("fb-field-border-color")) {
      opt.fieldBorderColor = "#" + hex;
      $tpl.find(".txt-field").css("border-color", opt.fieldBorderColor);
      $tpl.attr("data-json", JSON.stringify(opt));
    } else if ($el.hasClass("fb-field-color")) {
      opt.fieldColor = "#" + hex;
      $tpl.find(".txt-field").css("color", opt.fieldColor);
      $tpl.attr("data-json", JSON.stringify(opt));
    } else if ($el.hasClass("fb-dropdown-background")) {
      opt.dropdownBackground = "#" + hex;
      $tpl.find(".chzn-single").css("background-color", opt.dropdownBackground);
      $tpl.attr("data-json", JSON.stringify(opt));
    } else if ($el.hasClass("fb-dropdown-border-color")) {
      opt.dropdownBorderColor = "#" + hex;
      $tpl.find(".chzn-single").css("border-color", opt.dropdownBorderColor);
      $tpl.attr("data-json", JSON.stringify(opt));
    } else if ($el.hasClass("fb-dropdown-color")) {
      opt.dropdownColor = "#" + hex;
      $tpl
        .find(".chzn-single")
        .css("color", opt.dropdownColor)
        .find("div b")
        .css("border-top-color", opt.dropdownColor);
      $tpl.attr("data-json", JSON.stringify(opt));
    }
  },
  setRuleAction: function() {
    $(".fb-field-visible").change(function() {
      var $tpl = $(".tpl-block.selected");
      var opt = $tpl.data("json");
      var val = $(this).val();
      var link = $(this)
        .parent()
        .next(".fb-set-rule-link");
      if (val == "0") {
        link.hide();
      } else {
        link.show();
      }
      opt.visible = $(this).val();
      $tpl.attr("data-json", JSON.stringify(opt));
    });
    $(".fb-btn-set-rule").on("click", function(e) {
      e.preventDefault();
      page.setRuleBeforeOpen();
    });
    $(".fb-set-rule").on("click", ".fb-remove-row", function(e) {
      e.stopPropagation();
      e.preventDefault();
      $(this)
        .parents(".fb-align-row")
        .remove();
      page.isRuleFieldShow();
    });
    $(".fb-btn-add-condition").on("click", function() {
      $(".fb-set-rule")
        .append(
          '<div class="fb-align-row clearfix">' +
            '<div class="fb-align-item">' +
            "<select>" +
            '<option value="AND" selected="">And</option>' +
            '<option value="OR">Or</option>' +
            "</select>" +
            "</div>" +
            '<div class="fb-align-item fb-item-select">' +
            "<select>" +
            "<option>Choose Field...</option>" +
            "</select>" +
            "</div>" +
            '<div class="fb-align-item fb-item-select">' +
            '<select class="fb-has-value">' +
            '<option value="has_value">Has a Value</option>' +
            '<option value="is_blank">Is Blank</option>' +
            '<option value="equals">Equals</option>' +
            '<option value="not_equal">Does not Equal</option>' +
            "</select>" +
            "</div>" +
            '<div class="fb-align-item fb-item-input">' +
            '<input type="text" class="txt-field"/>' +
            "</div>" +
            '<div class="fb-align-item fb-remove-row">' +
            '<a href="#" class="fb-remove-row"></a>' +
            "</div>" +
            "</div>"
        )
        .find("select:visible")
        .chosen();
    });
    $(".fb-btn-view-formula").on("click", function(e) {
      e.preventDefault();
      page.setRuleViewFormula();
    });
    $(".fb-set-rule").on("change", ".fb-has-value", function() {
      var val = $(this).val();
      var $row = $(this).parents(".fb-align-row");
      if (val == "equals" || val == "not_equal") {
        $row
          .find(".fb-item-input .txt-field")
          .val("")
          .show();
        $(".fb-set-rule").addClass("fb-align-row-large");
      } else {
        $row.find(".fb-item-input .txt-field").hide();
      }
      page.isRuleFieldShow();
    });
  },
  setRuleBeforeOpen: function() {
    $(".fb-set-rule")
      .removeClass("fb-align-row-large")
      .html(
        '<div class="fb-align-row clearfix">' +
          '<div class="fb-align-item">' +
          "<label>Choose Conditions:</label>" +
          "</div>" +
          '<div class="fb-align-item fb-item-select">' +
          "<select>" +
          "<option>Choose Field...</option>" +
          "</select>" +
          "</div>" +
          '<div class="fb-align-item fb-item-select">' +
          '<select class="fb-has-value">' +
          '<option value="has_value">Has a Value</option>' +
          '<option value="is_blank">Is Blank</option>' +
          '<option value="equals">Equals</option>' +
          '<option value="not_equal">Does not Equal</option>' +
          "</select>" +
          "</div>" +
          '<div class="fb-align-item fb-item-input">' +
          '<input type="text" class="txt-field"/>' +
          "</div>" +
          '<div class="fb-align-item fb-remove-row"></div>' +
          "</div>"
      )
      .find("select")
      .chosen();
  },
  setRuleViewFormula: function() {
    var formula = "NOTBLANK(Field_Question)";
    alert(formula);
  },
  isRuleFieldShow: function() {
    if ($(".fb-set-rule .fb-item-input .txt-field:visible").length > 0) {
      $(".fb-set-rule").addClass("fb-align-row-large");
    } else {
      $(".fb-set-rule.fb-align-row-large").removeClass("fb-align-row-large");
    }
  },
  calculatedAction: function() {
    $(".fb-expression-list")
      .children("li")
      .on("click", function(e) {
        e.preventDefault();
        var index = $(this).attr("idx");
        if (index == 0) {
          page.calculatedStartBoxAddFunction();
          $(".fb-box-add-function").animate({ left: 0 }, 150);
        } else {
          page.calculatedListField();
          $(".fb-box-add-field").animate({ left: 0 }, 150);
        }
      });
    $(".fb-wrap-field-add-function").on(
      "click",
      ".fb-expression-choose-field",
      function(e) {
        e.preventDefault();
        $(".fb-box-add-field").animate({ left: 0 }, 150);
        $(this)
          .parents(".fb-field")
          .addClass("fb-choose-field-active");
      }
    );
    $(".fb-close-block").on("click", function() {
      $(this)
        .parents(".fb-box-add-function, .fb-box-add-field")
        .animate({ left: "360px" }, 150);
    });
    $("#select-add-function").change(function() {
      var val = $(this).val();
      page.calculatedAddFieldFunction(val);
    });
    $(".fb-btn-set-expression").on("click", function(e) {
      e.preventDefault();
      page.calculatedBeforeOpen();
    });
    $(".fb-list-add-field-expression").on(
      "click",
      ".fb-btn-add-field-expression",
      function(e) {
        e.preventDefault();
      }
    );
    $(".fb-list-add-field-expression").on(
      "click",
      "li, .fb-btn-add-field-expression",
      function(e) {
        e.preventDefault();
        e.stopPropagation();
        var text = $(this)
          .find("em")
          .text();
        var $choose = $(".fb-choose-field-active");

        $(".fb-box-add-field").css({ left: "360px" });

        if ($choose.length) {
          $choose
            .removeClass("fb-choose-field-active")
            .find(".txt-field")
            .val(text);
        } else {
          page.calculatedAddExpression(text);
        }
      }
    );
    $(".fb-btn-add-expression-function").on("click", function(e) {
      e.preventDefault();
      var type = $("#select-add-function option:selected").val();
      var ex = type + "(";
      $(".fb-wrap-field-add-function .fb-wrap-field .txt-field").each(function(
        i
      ) {
        var val = $.trim($(this).val());
        if (val != "") {
          if (i != 0) {
            ex += ", ";
          }
          ex += val;
        }
      });
      ex += ")";
      page.calculatedAddExpression(ex);
      $(".fb-box-add-function").css({ left: "360px" });
    });
  },
  calculatedAddExpression: function(expression) {
    var $input = $(".fb-expression-input");
    var currentExpression = $.trim($input.val());
    var expression = currentExpression + expression;
    $input.val(expression);
  },
  calculatedBeforeOpen: function() {
    $(".fb-box-add-function, .fb-box-add-field").css({ left: "360px" });
    $(".fb-expression-input").val("");
    $(".expression-result").text("Your expression will be validated here...");
  },
  calculatedStartBoxAddFunction: function() {
    $("#select-add-function option:first").attr("selected", true);
    $("#select-add-function").trigger("liszt:updated");
    $(".fb-wrap-field-add-function .fb-wrap-field").html("");
    page.calculatedAddFieldFunction("AND");
  },
  calculatedListField: function() {
    var $el = $(".wrap-tpl-block .tpl-block");
    var countField = 0;
    var $list = $(".fb-list-add-field-expression");
    $list.html("");

    $el.each(function() {
      var $tpl = $(this);
      var type = $tpl.attr("data-type-el");
      var opt = $tpl.data("json");
      var title = opt.defaultIdentifier;

      if (type != "17") {
        countField++;

        $list.append(
          "<li>" +
            "<span>" +
            title.replace("_", " ") +
            " <em>" +
            opt.identifier +
            "</em></span>" +
            '<a href="#" class="fb-btn-add-field-expression"></a>' +
            "</li>"
        );
      }
    });
    if (countField > 0) {
      $(".fb-message-not-field-expression").hide();
    } else {
      $(".fb-message-not-field-expression").show();
    }
  },
  calculatedAddFieldFunction: function(type) {
    var masField = [];
    var $box = $(".fb-wrap-field-add-function .fb-wrap-field");
    $box.html("");
    if (
      type == "AND" ||
      type == "AVERAGE" ||
      type == "CONCATENATE" ||
      type == "MAX" ||
      type == "MIN" ||
      type == "OR"
    ) {
      masField = ["Param 1", "Param 2", "Param 3", "Param 4"];
    } else if (
      type == "CEIL" ||
      type == "FLOOR" ||
      type == "ISBLANK" ||
      type == "LENGTH" ||
      type == "LOWERCASE" ||
      type == "NOTBLANK"
    ) {
      masField = ["Value"];
    } else if (type == "CONTAINS") {
      masField = ["String", "Sub-string"];
    } else if (type == "DEVICE_IDENTIFIER" || type == "NOW") {
      masField = [];
    } else if (type == "IF") {
      masField = ["Condition", "True branch", "False branch"];
    } else if (type == "MOD") {
      masField = ["Dividend", "Divisor"];
    } else if (type == "POWER") {
      masField = ["Base", "Exponent"];
    } else if (type == "ROUND") {
      masField = ["Value", "Decimal places"];
    } else if (type == "SUBSTRING") {
      masField = ["Value", "Position", "Length"];
    } else if (
      type == "YEAR" ||
      type == "MONTH" ||
      type == "DAY" ||
      type == "HOUR" ||
      type == "MINUTE" ||
      type == "SECOND"
    ) {
      masField = ["datetime"];
    } else if (type == "DATE") {
      masField = ["year", "month", "day"];
    } else if (type == "TIME") {
      masField = ["hour", "minute", "second"];
    } else if (type == "DATETIME") {
      masField = ["year", "month", "day", "hour", "minute", "second"];
    } else if (
      type == "ADDYEARS" ||
      type == "ADDMONTHS" ||
      type == "ADDDAYS" ||
      type == "ADDHOURS" ||
      type == "ADDMINUTES" ||
      type == "ADDSECONDS"
    ) {
      masField = ["datetime", "amount"];
    } else if (type == "TIMESTAMP" || type == "GEOSTAMP") {
      masField = ["Question"];
    } else if (type == "LATITUDE" || type == "LONGITUDE") {
      masField = ["Location"];
    }
    for (var i = 0; i < masField.length; i++) {
      $box.append(
        '<div class="fb-field">' +
          "<label>" +
          masField[i] +
          '<a href="#" class="fb-expression-choose-field">choose field</a>' +
          "</label>" +
          '<input id="param' +
          i +
          '" type="text" class="txt-field"/>' +
          "</div>"
      );
    }
  },
  pageBreakInit: function() {
    var $el = $(".fb-wrap-columns-form .fb-page-break");
    var count = $el.length + 1;
    var $tplGlobal = $("#form-editor .fb-wrap-columns-form");
    var optGlobal = $tplGlobal.data("json");

    if ($el.length) {
      $("#wrap-form-submit-button").prepend(
        '<a href="#" class="t-btn-orange fb-prev-page-section">Previous</a> <a href="#" class="t-btn-orange fb-next-page-section">Next</a>'
      );
      $("#wrap-form-submit-button").prepend(
        '<div class="fb-step-text-page">Step <span>1</span> of ' +
          count +
          "</div>"
      );

      $("#wrap-form-submit-button")
        .find(".fb-next-page-section, .fb-prev-page-section")
        .css({
          "background-color": optGlobal.btnBackground,
          "border-style": optGlobal.btnBorderStyle.toLowerCase(),
          "border-width": optGlobal.btnBoderWidth + "px",
          "border-color": optGlobal.btnBorderColor,
          "font-family": optGlobal.btnFont + ", sans-serif",
          "font-size": optGlobal.btnSize + "px",
          color: optGlobal.btnColor
        });
      $el.each(function(i) {
        var $this = $(this);
        var stop = false;
        if (i == 0) {
          if ($this.prevAll(".tpl-block").length) {
            $this
              .prevAll(".tpl-block")
              .wrapAll('<div class="fb-page-step-section fb-selected"/>');
          } else {
            $this.before(
              '<div class="fb-page-step-section fb-selected"></div>'
            );
          }
        }
        if ($this.nextAll(".tpl-block").length) {
          var $all = $this.nextAll(".tpl-block").filter(function(i) {
            if (stop) {
              return false;
            }
            if ($(this).hasClass("fb-page-break")) {
              stop = true;
              return false;
            } else {
              return this;
            }
          });

          if ($all.length) {
            $all.wrapAll('<div class="fb-page-step-section"/>');
          } else {
            $this.before('<div class="fb-page-step-section"></div>');
          }
        } else {
          $this.after('<div class="fb-page-step-section"></div>');
        }
        $this.hide();
      });
    }
    $(".fb-prev-page-section").hide();
    page.pageBreakAction();
  },
  pageBreakAction: function() {
    $(".fb-prev-page-section").on("click", function(e) {
      e.preventDefault();
      var $page = $(".fb-page-step-section");
      var length = $page.length;
      var indexPage = $page.index($page.filter(".fb-selected"));

      if (indexPage > 0) {
        $page
          .filter(".fb-selected")
          .removeClass("fb-selected")
          .prevAll(".fb-page-step-section:first")
          .addClass("fb-selected");
      }
      var newIndex = $page.index($page.filter(".fb-selected"));

      if (newIndex > 0) {
        $(this).show();
      } else {
        $(this).hide();
      }
      if (newIndex + 1 == length) {
        $(".fb-next-page-section").hide();
      } else {
        $(".fb-next-page-section").show();
      }
      $(".fb-step-text-page span").text(newIndex + 1);
    });
    $(".fb-next-page-section").on("click", function(e) {
      e.preventDefault();
      var $page = $(".fb-page-step-section");
      var length = $page.length;
      var indexPage = $page.index($page.filter(".fb-selected"));

      if (indexPage + 1 < length) {
        $page
          .filter(".fb-selected")
          .removeClass("fb-selected")
          .nextAll(".fb-page-step-section:first")
          .addClass("fb-selected");
      }
      var newIndex = $page.index($page.filter(".fb-selected"));

      if (newIndex + 1 < length) {
        $(this).show();
      } else {
        $(this).hide();
      }
      if (newIndex + 1 == 1) {
        $(".fb-prev-page-section").hide();
      } else {
        $(".fb-prev-page-section").show();
      }
      $(".fb-step-text-page span").text(newIndex + 1);
    });
  },
  pageBreakDestroy: function() {
    $(".fb-page-step-section").each(function() {
      var $el = $(this)
        .children()
        .detach();
      $(this).replaceWith($el);
    });
    $(".fb-wrap-columns-form .fb-page-break").show();
    $(
      ".fb-prev-page-section, .fb-next-page-section, .fb-step-text-page"
    ).remove();
  },
  redirectCompetitors: function() {
    page.isCountMultipleField($(".fb-rus-сompetitors"));
    var $checkRedirectCompetitors = $("#check-redirect-competitors");
    var $checkRusCompetitors = $("#check-rus-competitors");

    if ($checkRedirectCompetitors.is(":checked")) {
      $(".fb-box-redirect-competitors").show();

      if ($checkRusCompetitors.is(":checked")) {
        $(".fb-rus-сompetitors").show();
      } else {
        $(".fb-rus-сompetitors").hide();
      }
    } else {
      $(".fb-box-redirect-competitors").hide();
    }

    page.redirectCompetitorsAction();
  },
  redirectCompetitorsAction: function() {
    var $checkRedirectCompetitors = $("#check-redirect-competitors");
    var $checkRusCompetitors = $("#check-rus-competitors");

    $checkRedirectCompetitors.on("click", function() {
      if ($(this).is(":checked")) {
        $(".fb-box-redirect-competitors").show();
      } else {
        $(".fb-box-redirect-competitors").hide();
      }
      if ($checkRusCompetitors.is(":checked")) {
        $checkRusCompetitors.click();
        pages.checkboxRadioButtons.isChecked($checkRusCompetitors, true);
      } else {
        $(".fb-rus-сompetitors").hide();
      }
    });
    $checkRusCompetitors.on("click", function() {
      if ($(this).is(":checked")) {
        $(".fb-rus-сompetitors").show();
      } else {
        $(".fb-rus-сompetitors").hide();
      }
      $(".fb-rus-сompetitors")
        .find(".t-field:not(:eq(0))")
        .remove();
      $(".fb-rus-сompetitors")
        .find("input")
        .val("");
      page.isCountMultipleField($(".fb-rus-сompetitors"));
    });
  },
  btnSubmitAction: function() {
    $(".form-submit-button").on("click", function(e) {
      e.preventDefault();

      $("#fb-tabs-settings li a")
        .eq(2)
        .trigger("click");
      $(".fb-right-panel-slide.active")
        .removeClass("active")
        .css({ left: "589px" })
        .hide();
      $(".wrap-panels-el").css("z-index", "-1");

      var $styleBlock = $("#fb-form-style-global");
      var destination = $("#fb-global-style-botton").offset().top;
      $styleBlock.scrollTop(destination);
    });
  }
};
$(document).ready(function() {
  page.init();
  page.actionBuilderForm();
  page.dragAndDropElements();
  page.actionsBtnBlock();
  page.showHideInfBlock();
  page.resizableField();
  page.colorBox();
  if ($(".fb-wrap-columns-form").length) {
    page.updateGlobalStyle();
  }
  page.actionStyleField();
  page.multipleAction();
  page.setRuleAction();
  page.calculatedAction();

  page.dateElement($(".tpl-date .ll-input-date"));
  page.timeElement($(".tpl-time .txt-field"));
  page.phoneElement($(".tpl-phone .txt-field"));
  $(".db-default-value-phone").inputmask("mask", {
    mask: "(999) - 999 - 9999"
  });
  page.useCaptchaForm();
  page.redirectCompetitors();
  page.btnSubmitAction();

  if (
    $(".fb-wrap-columns-form").hasClass("fb-wrap-two-columns") ||
    $(".fb-wrap-columns-form").hasClass("fb-wrap-three-columns")
  ) {
    $(".eb-block-content.el-page-break").hide();
  } else {
    /*TEST PAGE BREAK*/
    $(".btn-next").on("click", function(e) {
      e.preventDefault();
      var $btn = $(this);
      if ($btn.hasClass("selected")) {
        page.pageBreakDestroy();
        $btn.removeClass("selected");
      } else {
        $btn.addClass("selected");
        page.pageBreakInit();
      }
    });
  }
});
