var images = {
  logo: "./imgs/logo_new.png",
  header: "https://images.unsplash.com/photo-1575573578796-a757fb7f0fb7",
  page: "https://images.unsplash.com/photo-1575572535918-870652ed0c93",
  leadboard: "https://images.unsplash.com/photo-1575572535918-870652ed0c93"
};
var tinymceOpts = {
  autoresize_min_height: 300,
  selector: "#editor-html",
  plugins: [
    "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
    "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
    "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern",
    "autoresize"
  ],
  toolbar1:
    "bold italic underline | link unlink image | alignleft aligncenter alignright alignjustify | bullist numlist",
  toolbar2:
    "heading fontselect fontsizeselect | forecolor backcolor | ltr rtl | code | undo redo",
  content_css: "js/tinymce_new/tinymce_override.css",
  menubar: false,
  gecko_spellcheck: true,
  browser_spellcheck: true,
  toolbar_items_size: "small",
  relative_urls: "false",
  theme_advanced_buttons3_add: "ltr,rtl",
  forced_root_block: "div",
  force_br_newlines: true,
  force_p_newlines: false,
  verify_html: false,
  entity_encoding: "named",
  fontsize_formats:
    "8px 9px 10px 11px 12px 13px 14px 15px 16px 17px 18px 19px 20px 21px 22px 23px 24px 25px 26px 27px 28px 29px 30px 31px 32px 33px 34px 35px 36px 37px 38px 39px 40px 41px 42px 43px 44px 45px 46px 47px 48px 49px 50px 51px 52px 53px 54px 55px 56px 57px 58px 59px 60px 61px 62px 63px 64px 65px 66px 67px 68px 69px 70px 71px 72px 73px 74px 75px 76px 77px 78px 79px 80px 81px 82px 83px 84px 85px 86px 87px 88px 89px 90px 91px 92px 93px 94px 95px 96px 97px 98px 99px 100px 110px 120px 130px 140px 150px",
  setup: function(editor) {
    editor.addButton("heading", {
      type: "menubutton",
      text: "Heading",
      icon: false,
      menu: [
        {
          text: "Custom Heading 1",
          onclick: function() {
            var opt = $("#bodyTable").data("json");
            var h1Shadow =
              opt.h1ShadowX +
              "px " +
              opt.h1ShadowY +
              "px " +
              opt.h1ShadowBlur +
              "px " +
              opt.h1ShadowColor;

            editor.execCommand(
              "mceReplaceContent",
              false,
              '<p class="eb-h1" style="margin-bottom: 15px; margin-top: 0; line-height: 125%;"><span style="font-size: 30px; line-height: 125%; color: ' +
                opt.h1Color +
                "; text-shadow: " +
                h1Shadow +
                '; ">' +
                editor.selection.getContent() +
                "</span></p>"
            );
          }
        },
        {
          text: "Custom Heading 2",
          onclick: function() {
            var opt = $("#bodyTable").data("json");
            var h2Shadow =
              opt.h2ShadowX +
              "px " +
              opt.h2ShadowY +
              "px " +
              opt.h2ShadowBlur +
              "px " +
              opt.h2ShadowColor;

            editor.execCommand(
              "mceReplaceContent",
              false,
              '<p class="eb-h2" style="margin-bottom: 15px; margin-top: 0; line-height: 125%;"><span style="font-size: 20px; line-height: 125%; color: ' +
                opt.h2Color +
                "; text-shadow: " +
                h2Shadow +
                '; ">' +
                editor.selection.getContent() +
                "</span></p>"
            );
          }
        },
        {
          text: "Heading 1",
          onclick: function() {
            editor.execCommand(
              "mceReplaceContent",
              false,
              '<h1 style="font-size: 26px; padding:0; margin: 0;">' +
                editor.selection.getContent() +
                "</h1>"
            );
          }
        },
        {
          text: "Heading 2",
          onclick: function() {
            editor.execCommand(
              "mceReplaceContent",
              false,
              '<h2 style="font-size: 22px; padding:0; margin: 0;">' +
                editor.selection.getContent() +
                "</h2>"
            );
          }
        },
        {
          text: "Heading 3",
          onclick: function() {
            editor.execCommand(
              "mceReplaceContent",
              false,
              '<h3 style="font-size: 16px; padding:0; margin: 0;">' +
                editor.selection.getContent() +
                "</h3>"
            );
          }
        },
        {
          text: "Heading 4",
          onclick: function() {
            editor.execCommand(
              "mceReplaceContent",
              false,
              '<h4 style="font-size: 14px; padding:0; margin: 0;">' +
                editor.selection.getContent() +
                "</h4>"
            );
          }
        },
        {
          text: "Paragraph",
          onclick: function() {
            editor.execCommand(
              "mceReplaceContent",
              false,
              "<p>" + editor.selection.getContent() + "</p>"
            );
          }
        }
      ]
    });
    editor.on("change", function(e) {
      page.updateHTMLBlock();
    });
    editor.on("keyup", function() {
      page.updateHTMLBlock();
    });
    editor.on("ExecCommand", function() {
      page.updateHTMLBlock();
    });

    editor.on("setContent", function() {
      /*$("#eb-editor-html_ifr")
        .contents()
        .find("html, body")
        .css("cssText", "height: auto !important");
        */
    });
  }
};
var page = {
  sliderGridTwo: null,
  init: function() {
    $(".tabs-pages li").on("click", function() {
      var $this = $(this);

      if (!$this.hasClass("selected")) {
        var index = $this
          .parent()
          .find("li")
          .index($this);
        $(this)
          .addClass("selected")
          .siblings("li")
          .removeClass("selected");

        $(".tab-content-page")
          .hide()
          .eq(index)
          .show();
      }
      page.closePanelRight();
    });
    $(".tabs-editor > ul li").on("click", function(e) {
      e.preventDefault();
      var $this = $(this);
      var index = $this
        .parent()
        .find("li")
        .index($this);
      $this
        .addClass("selected")
        .siblings("li")
        .removeClass("selected");
      $this
        .parents(".tabs-editor")
        .find(".wrap-tabs-content .tab-content")
        .hide()
        .eq(index)
        .show();
    });

    $(".slide-box__head").on("click", function() {
      var $this = $(this);
      if (!$this.hasClass("opened")) {
        $this.siblings(".slide-box__content:visible").slideToggle(function() {
          $this.siblings(".slide-box__head.opened").removeClass("opened");
        });
      } else {
      }
      $this.toggleClass("opened");
      $this.next(".slide-box__content").slideToggle();
    });
    $(".btn-capture-screen-form-fullscreen").on("click", function() {
      var $btn = $(this);
      var $wrap = $("#capture-screen-content");
      var leftRightSideForm = $(".left-right-side-form");
      var $parent = $btn.parent();

      $btn.toggleClass("active");

      if (!$btn.hasClass("active")) {
        $wrap.removeClass("fullscreen");
        leftRightSideForm.show();
        $parent.removeClass("fullscreen");
      } else {
        $wrap.addClass("fullscreen");
        leftRightSideForm.hide();
        $parent.addClass("fullscreen");
      }
    });

    $(".btn-capture-screen-form--left, .btn-capture-screen-form--right").on(
      "click",
      function() {
        var $btn = $(this);
        var leftCol = $("#capture-screen-content .wrap-preview-col");
        var rightCol = $("#capture-screen-content .tool-col");
        var formBox = $("#capture-screen-content .preview-col");
        var htmlBox = $("#capture-screen-content .custom-html");
        var $btnLeft = $(".btn-capture-screen-form--left");
        var $btnRight = $(".btn-capture-screen-form--right");

        $(".form-preview").removeClass("form-preview");

        $btn.addClass("active");

        if ($btn.hasClass("btn-capture-screen-form--left")) {
          leftCol.addClass("form-preview").append(formBox);
          rightCol.append(htmlBox);
          $btnRight.removeClass("active");
        } else {
          leftCol.append(htmlBox);
          rightCol.addClass("form-preview").append(formBox);
          $btnLeft.removeClass("active");
        }
      }
    );

    $("#selectTypeActivation").change(function() {
      var val = $(this).val();
      var $spinToWin = $(".spin-to-win-box");
      var $pickWinner = $(".pick-winner-box");
      var $whackMole = $(".whack-mole-box");

      $spinToWin.addClass("hide");
      $pickWinner.addClass("hide");
      $whackMole.addClass("hide");

      if (val === "1") {
        $pickWinner.removeClass("hide");
      } else if (val === "2") {
        $whackMole.removeClass("hide");
      } else {
        $spinToWin.removeClass("hide");
      }
    });
    $(".inventory-prizes").on("click", ".add-line-inventory", function() {
      page.addNewInventory($(this));
    });
    $(".inventory-prizes").on("click", ".remove-line-inventory", function() {
      page.removeInventory($(this));
    });
    $(".st-btn-upload-image").on("click", function() {
      var $box = $(this).parent();

      if ($box.hasClass("upload-logo")) {
        url = images.logo;
      } else if ($box.hasClass("upload-bg-header")) {
        url = images.header;
      } else if ($box.hasClass("upload-bg-page")) {
        url = images.page;
      } else {
        url = images.leadboard;
      }

      page.addImage($box, url);
    });
    $(".leadboard__header-logo").on("click", function(e) {
      e.preventDefault();
      page.addImage($(".upload-image.upload-logo"), images.logo);
    });
    $(".builder-leadboard-panels, .capture-screen-settings").on(
      "click",
      ".st-unload-image__remove",
      function() {
        var $box = $(this).closest(".st-right__inner");
        page.addImage($box, null);
      }
    );
    $(".whack-mole-box .btn-add-custom").on("click", function() {
      page.whackMoleAddNewCharacter($(this).closest(".whack-mole-box"));
    });

    $(".whack-mole-box").on("click", ".custom-whack-mole__remove", function() {
      page.whackMoleRemoveCharacter($(this).closest(".custom-whack-mole"));
    });

    $(".right-panel-slide__close").on("click", function(e) {
      e.stopPropagation();
      page.closePanelRight();
    });

    if ($(".editor-text").length) {
      tinymce.init(tinymceOpts);
    }

    $(".custom-html").on("click", function() {
      $(".right-panel-slide")
        .addClass("active")
        .show()
        .animate({ right: 0 }, 300);
      var html = "";
      tinymce.get("editor-html").setContent($(".custom-html__content").html());
    });
    $(".st-input-css").change(function() {
      var $this = $(this);
      var val = $this.val();
      var result = val.match(/\b(auto)\b|\b[0-9]{1,}(px|\u0025)?/g);

      if (result != null) {
        if (+result) $this.val(result + "px");
        else $this.val(result);
      } else {
        $this.val("");
      }
      page.changeInputCss($this);
    });
    $(".select-type-bg").change(function() {
      var val = $(this).val();
      var $parent = $(this).closest(".st-bg");
      var $customBox = $parent.find(".custom-bg-box");
      var $freeImagesBox = $parent.find(".free-images-box");

      if (val === "0") {
        $customBox.show();
        $freeImagesBox.hide();
      } else if (val === "1") {
        $customBox.hide();
        $freeImagesBox.find(".search-input-free-images > .txt-field").val("");
        $freeImagesBox.show();
        page.freeImages(1, "", false, $freeImagesBox);
      }
    });

    $(".search-input-free-images > .txt-field").change(function() {
      var $parent = $(this).closest(".st-bg");
      var $freeImagesBox = $parent.find(".free-images-box");
      var $input = $(this);
      var val = $.trim($input.val());

      page.freeImages(1, val, false, $freeImagesBox);
    });

    $(".btn-more-free-images:not(.disabled)").on("click", function() {
      var $btn = $(this);
      var $parent = $(this).closest(".st-bg");
      var $freeImagesBox = $parent.find(".free-images-box");
      var pageCount = $btn.attr("data-page");
      var val = $.trim($freeImagesBox.find(".input-free-images").val());

      $btn.addClass("disabled");
      page.freeImages(pageCount, val, true, $freeImagesBox);
    });

    $(".list-free-images").on("click", ".list-free-images__item", function() {
      var url = $(this).attr("data-url");
      var type = $(this)
        .closest(".free-images-box")
        .attr("type-action");

      if (type === "upload-bg-page") {
        $box = $(".custom-bg-box .upload-bg-page");
      } else if (type === "upload-bg-header") {
        $box = $(".custom-bg-box .upload-bg-header");
      } else if (type === "upload-bg-capture-screen") {
        $box = $(".custom-bg-box .upload-bg-capture-screen");
      } else if (type === "upload-bg-html") {
        $box = $(".custom-bg-box .upload-bg-html");
      } else {
        $box = $(".custom-bg-box .upload-bg-leaderboard");
      }

      page.addImage($box, url);
    });
    $("#btnPreviewCaprureScreen").on("click", function() {
      var $btn = $(this);
      var $boxBtns = $(".capture-screen__btns");

      $btn.toggleClass("active");
      $boxBtns.toggleClass("active");

      if ($btn.hasClass("active")) {
        page.getHTMLPreviewCaptureSreen();
        $("#previewCaprureScreen").show();
      } else {
        $("#previewCaprureScreen")
          .hide()
          .html("");
      }
    });
    $(".activation-designer").on(
      "click",
      ".btn-preview-leaderboard",
      function() {
        var $btn = $(".btn-preview-leaderboard");
        $btn.toggleClass("active");

        if ($btn.hasClass("active")) {
          page.getHTMLPreviewLeaderboard();
          $("#previewLeaderboard").show();
        } else {
          $("#previewLeaderboard")
            .hide()
            .html("");
        }
      }
    );
  },
  updateHTMLBlock: function() {
    var html = tinymce.get("editor-html").getContent();
    var $wrapHTML = $(".custom-html");

    $.trim(html).length > 72
      ? $wrapHTML.removeClass("no-html")
      : $wrapHTML.addClass("no-html");

    $(".custom-html__content").html(html);
  },
  closePanelRight: function() {
    $(".right-panel-slide.active")
      .removeClass("active")
      .hide()
      .animate({ right: "-600px" }, 300);
  },
  addNewInventory: function($this) {
    var $box = $this.closest(".line-inventory");
    var html =
      '<div class="line-inventory">' +
      '<div class="add-line-inventory"></div>' +
      '<div class="remove-line-inventory"></div>' +
      '<input type="text" class="txt-field field-inventory"> ' +
      '<span class="label-prize">Quantity:</span> ' +
      '<input type="number" class="txt-field field-prize">' +
      "</div>";
    $box.after(html);
    page.isRemoveInventory($this.closest(".inventory-prizes"));
  },
  isRemoveInventory: function($wrap) {
    var count = $wrap.find(".line-inventory").length;
    count > 1 ? $wrap.removeClass("no-remove") : $wrap.addClass("no-remove");
  },
  removeInventory: function($this) {
    var $wrap = $this.closest(".inventory-prizes");
    $this.closest(".line-inventory").remove();
    page.isRemoveInventory($wrap);
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
  addImage: function($box, url) {
    page.updateImageTpl($box, url);
  },
  getImageName: function(url) {
    var split = url.split("/");
    split = split[split.length - 1];
    return split;
  },
  updateImageTpl($box, url) {
    var type = null;
    var name = "image.jpg";
    var $boxBuilder = null;

    if ($box.hasClass("upload-logo")) {
      $boxBuilder = $(".slide-box__content .upload-logo");
      type = "upload-logo";
    } else if ($box.hasClass("upload-bg-header")) {
      $boxBuilder = $(".slide-box__content .upload-bg-header");
      type = "upload-bg-header";
    } else if ($box.hasClass("upload-bg-page")) {
      $boxBuilder = $(".slide-box__content .upload-bg-page");
      type = "upload-bg-page";
    } else if ($box.hasClass("upload-bg-capture-screen")) {
      $boxBuilder = $(".capture-screen-settings .upload-bg-capture-screen");
      type = "upload-bg-capture-screen";
    } else if ($box.hasClass("upload-bg-html")) {
      $boxBuilder = $(".slide-box__content .upload-bg-html");
      type = "upload-bg-html";
    } else {
      $boxBuilder = $(".slide-box__content .upload-bg-leaderboard");
      type = "upload-leaderboard";
    }

    if (url !== null) name = page.getImageName(url);

    var html =
      '<div class="st-unload-image"><span class="st-unload-image__title">' +
      name +
      '</span> <span class="st-unload-image__remove"></span></div>';

    $boxBuilder.find(".st-unload-image").remove();

    if (url === null) {
      $boxBuilder.addClass("no-files");
    } else {
      $boxBuilder.append(html);
      $boxBuilder.removeClass("no-files");
    }

    page.updateTplImage(type, url);
  },
  updateTplImage: function(type, url) {
    var $box = null;
    if (type === "upload-logo") {
      $box = $(".leadboard__header-logo");
      $box.find("img").remove();
      if (url === null) {
        $box.addClass("no-image");
      } else {
        $box.removeClass("no-image");
        $box.append('<img src="' + url + '" alt=""/>');
      }
    } else {
      if (type === "upload-bg-header") {
        $box = $(".leadboard__header");
      } else if (type === "upload-bg-page") {
        $box = $("#builder-leadboard__html");
      } else if (type === "upload-bg-capture-screen") {
        $box = $("#capture-screen-html");
      } else if (type === "upload-bg-html") {
        $box = $(".leadboard__html");
      } else {
        $box = $(".leadboard__content");
      }

      if (url === null) {
        $box.css("background-image", "");
      } else {
        $box.css("background-image", "url('" + url + "')");
      }
    }
  },
  whackMoleAddNewCharacter: function($wrap) {
    var html =
      '<div class="custom-whack-mole">' +
      '<div class="t-radio">' +
      '<label><i class="icn-radio"></i><input type="radio" name="whackMolyCustom"/></label>' +
      "</div> " +
      "<select>" +
      "<option>Custom #1</option>" +
      "<option>Custom #2</option>" +
      "<option>Custom #3</option>" +
      "</select>" +
      ' <div class="custom-whack-mole__remove">' +
      '<img src="imgs/table_icons/delete-action.svg" class="svg-table-delete">' +
      "</div>" +
      "</div";
    $wrap.append(html);
    $wrap.find("select:visible").chosen();
  },
  whackMoleRemoveCharacter: function($box) {
    $box.remove();
  },
  codeBox: {
    editor: null,
    init: function() {
      CodeMirror.commands.autocomplete = function(cm) {
        cm.showHint({ hint: CodeMirror.hint.anyword });
      };
      page.codeBox.editor = CodeMirror.fromTextArea(
        document.getElementById("leadboard-code-editor"),
        {
          lineNumbers: true,
          lineWrapping: true,
          extraKeys: { "Ctrl-Space": "autocomplete" }
        }
      );
      page.codeBox.editor.on("blur", function() {
        page.setCustomHTML();
      });
    },
    setHTML: function() {
      /*var html = page.codeBox.editor.getValue();*/
    },
    getHTML: function() {
      var html =
        page.codeBox.editor !== null ? page.codeBox.editor.getValue() : "";
      return html;
    }
  },
  setCustomHTML: function() {
    var val = page.codeBox.getHTML();
    var helpHTML = '<div class="leadboard__help-column">HTML</div>';
    var $box = $(".leadboard__html");

    $.trim(val) === "" ? $box.html(helpHTML) : $box.html(val);
  },
  sliderGrid: function(id, values) {
    var slider = page.sliderGridTwo;

    if (slider !== null) slider.noUiSlider.destroy();

    slider = document.getElementById(id);
    noUiSlider.create(slider, {
      start: values,
      step: 1,
      margin: 5,
      range: {
        min: [5],
        max: [95]
      }
    });
    slider.noUiSlider.on("slide", function(values, handle) {
      page.setGridSizeColumns($(this.target), values);
    });
    slider.noUiSlider.on("change", function(values, handle) {
      var widthLeftCol = parseInt(values[0]);
      var widthRightCol = 100 - widthLeftCol;

      $(".leadboard__column-left").css("width", widthLeftCol + "%");
      $(".leadboard__column-right").css("width", widthRightCol + "%");
    });
    page.sliderGridTwo = slider;
  },
  setGridSizeColumns: function($box, values) {
    var $items = null;
    var $wrapItems = null;
    var value1 = parseInt(values[0]);
    var value2 = 0;

    $box.find(".st-grid-size__items").remove();
    $box.prepend('<div class="st-grid-size__items"></div>');
    $wrapItems = $box.find(".st-grid-size__items");

    for (i = 0; i <= values.length; i++) {
      $wrapItems.append('<div class="st-grid-size__item"/>');
    }

    $items = $box.find(".st-grid-size__item");
    value2 = 100 - parseInt(values[0]);
    $items
      .eq(0)
      .css("width", value1 + "%")
      .text(value1 + "%");
    $items
      .eq(1)
      .css({
        left: value1 + "%",
        width: value2 + "%"
      })
      .text(value2 + "%");
  },
  freeImages: function(page, searchValue, isMoreLoad, $box) {
    page = page || 1;
    var url =
      "https://api.unsplash.com/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" +
      page;
    var isSearch = false;
    searchValue = $.trim(searchValue);
    var $btn = $box.find(".btn-more-free-images");
    var $list = $box.find(".list-free-images > ul");

    if (searchValue !== "") {
      isSearch = true;
      url =
        "https://api.unsplash.com/search/photos/?client_id=1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb&page=" +
        page +
        "&query=" +
        searchValue;
    }

    $.getJSON(url, function(data) {
      //console.log(data);
      var items = "";

      if (isSearch) data = data.results;

      $.each(data, function(key, val) {
        var imgURL = val.urls.regular;
        items +=
          "<li class='list-free-images__item' id='" +
          key +
          "' style='background-image: url(" +
          imgURL +
          ")' data-url='" +
          imgURL +
          "'></li>";
      });

      if (isMoreLoad) $list.append(items);
      else $list.html(items);

      $btn.attr("data-page", parseInt(page) + 1);
    })
      .done(function() {
        //console.log("second success");
      })
      .fail(function() {
        //console.log("error");
      })
      .always(function() {
        $btn.removeClass("disabled");

        if ($list.find("li").length) $btn.show();
        else $btn.hide();
      });
    //Access Key
    //1e9048d4a18ea07ba6ced84697b0aeb76a91a90dca8a9b1079d0bac1de76e8bb
  },
  updateColorElTpl: function(el, hex) {
    var id = $(el).attr("id");
    var color = "#" + hex;

    if (id === "pageBg") {
      $("#builder-leadboard__html").css("background-color", color);
    } else if (id === "headerBg") {
      $(".leadboard__header").css("background-color", color);
    } else if (id === "titleColor") {
      $(".leadboard__header h2").css("color", color);
    } else if (id === "leaderboardBg") {
      $(".leadboard__content").css("background-color", color);
    } else if (id === "nameLeaderColor") {
      $(".leadboard__content").attr("nameColor", color);
      $(".list-leaders__name").css("color", color);
    } else if (id === "scoreLeaderColor") {
      $(".leadboard__content").attr("scoreColor", color);
      $(".list-leaders__count").css("color", color);
    } else if (id === "captureScreenBg") {
      $("#capture-screen-html").css("background-color", color);
    } else if (id === "htmlBg") {
      $(".leadboard__html").css("background-color", color);
    }
  },
  changeOptions: function() {
    var $title = $(".leadboard__header h2");
    var $leadersName = $(".list-leaders__name");
    var $leadersScore = $(".list-leaders__count");

    $("#headerTitle").on("keyup", function() {
      var val = $.trim($(this).val());

      if (val === "") val = "TITLE";

      $title.text(val);
    });
    $("#titleTypeFace").change(function() {
      var val = $(this).val();
      $title.css("font-family", val + ", sans-serif");
    });
    $("#titleFontSize").change(function() {
      var val = $(this).val();
      $title.css("font-size", val + "px");
    });
    $("#titleFontWeight").change(function() {
      var val = $(this).val();
      $title.css("font-weight", val);
    });
    $("#titleLineHeight").change(function() {
      var val = $(this).val();
      $title.css("line-height", val + "%");
    });

    $("#leaderboardAlingment").change(function() {
      var val = $(this).val();
      var $wrap = $(".leadboard__columns");
      var $colLeft = $(".leadboard__column-left");
      var $colRight = $(".leadboard__column-right");
      var $leaderboardCol = $(".leadboard__content");
      var $HTMLCol = $(".leadboard__html");

      if (val === "1") {
        $colLeft.append($HTMLCol);
        $colRight.append($leaderboardCol);
      } else {
        $colLeft.append($leaderboardCol);
        $colRight.append($HTMLCol);
      }
    });

    $("#leaderboardCountItem").change(function() {
      var val = $(this).val();
      var $items = $(".list-leaders__item");
      $(".leadboard__content").attr("totalItems", val);

      if (val === "20") {
        $items.removeClass("hide");
      } else {
        $items.each(function(index) {
          if (index > 9) $(this).addClass("hide");
        });
      }
    });

    $("#nameLeaderTypeFace").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("nameTypeFace", val + ", sans-serif");
      $leadersName.css("font-family", val + ", sans-serif");
    });
    $("#nameLeaderFontSize").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("nameFontSize", val + "px");
      $leadersName.css("font-size", val + "px");
    });
    $("#nameLeaderFontWeight").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("nameFontWeight", val);
      $leadersName.css("font-weight", val);
    });
    $("#nameLeaderLineHeight").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("nameLineHeight", val + "%");
      $leadersName.css("line-height", val + "%");
    });

    $("#scoreLeaderTypeFace").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("scoreTypeFace", val + ", sans-serif");
      $leadersScore.css("font-family", val + ", sans-serif");
    });
    $("#scoreLeaderFontSize").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("scoreFontSize", val + "px");
      $leadersScore.css("font-size", val + "px");
    });
    $("#scoreLeaderFontWeight").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("scoreFontWeight", val);
      $leadersScore.css("font-weight", val);
    });
    $("#scoreLeaderLineHeight").change(function() {
      var val = $(this).val();
      $(".leadboard__content").attr("scoreLineHeight", val + "%");
      $leadersScore.css("line-height", val + "%");
    });
  },
  changeInputCss: function($this) {
    var id = $this.attr("id");
    var val = $this.val();

    if (id === "headerHeight") {
      $(".leadboard__header").css("height", val);
      $(".leadboard__columns").css("height", "calc(100% - " + val + ")");
    } else if (id === "leadersPaddingLeft") {
      $(".leadboard__content").css("padding-left", val);
    } else if (id === "leadersPaddingRight") {
      $(".leadboard__content").css("padding-right", val);
    } else if (id === "leadersPaddingTop") {
      $(".leadboard__content").css("padding-top", val);
    } else if (id === "leadersPaddingBottom") {
      $(".leadboard__content").css("padding-bottom", val);
    } else if (id === "headerPaddingLeft") {
      $(".leadboard__header").css("padding-left", val);
    } else if (id === "headerPaddingRight") {
      $(".leadboard__header").css("padding-right", val);
    } else if (id === "htmlPaddingLeft") {
      $(".leadboard__html").css("padding-left", val);
    } else if (id === "htmlPaddingRight") {
      $(".leadboard__html").css("padding-right", val);
    } else if (id === "htmlPaddingTop") {
      $(".leadboard__html").css("padding-top", val);
    } else if (id === "htmlPaddingBottom") {
      $(".leadboard__html").css("padding-bottom", val);
    } else if (id === "captureScreenPaddingLeft") {
      $("#capture-screen-html").css("padding-left", val);
    } else if (id === "captureScreenPaddingRight") {
      $("#capture-screen-html").css("padding-right", val);
    } else if (id === "captureScreenPaddingTop") {
      $("#capture-screen-html").css("padding-top", val);
    } else if (id === "captureScreenPaddingBottom") {
      $("#capture-screen-html").css("padding-bottom", val);
    }
  },
  /*
  getLeadersItems: function() {
    var maxTotal = $(".leadboard__content").attr("totalItems");
    var html = '<div class="list-leaders">';

    $(".line-inventory").each(function(index) {
      if (index < maxTotal) {
        var $item = $(this);
        var name = $.trim($item.find(".field-inventory").val());
        var quantity = $.trim($item.find(".field-prize").val());

        index = index + 1;

        if (name === "") name = "Name #" + index;
        if (quantity === "") quantity = 0;

        html +=
          '<div class="list-leaders__item">' +
          '<span class="list-leaders__name">' +
          index +
          ". " +
          name +
          '</span><span class="list-leaders__count">' +
          quantity +
          "</span></div>";
      }
    });
    html += "</div>";

    return html;
  },
  setCSSLeaderName: function() {
    var $box = $(".leadboard__content");

    $(".list-leaders__name").css({
      fontSize: $box.attr("nameFontSize"),
      fontWeight: $box.attr("nameFontWeight"),
      fontFamily: $box.attr("nameTypeFace"),
      color: $box.attr("nameColor"),
      lineHeight: $box.attr("nameLineHeight")
    });
  },
  setCSSLeaderScore: function() {
    var $box = $(".leadboard__content");

    $(".list-leaders__count").css({
      fontSize: $box.attr("scoreFontSize"),
      fontWeight: $box.attr("scoreFontWeight"),
      fontFamily: $box.attr("scoreTypeFace"),
      color: $box.attr("scoreColor"),
      lineHeight: $box.attr("scoreLineHeight")
    });
  },*/
  getHTMLPreviewLeaderboard: function() {
    var HTML = $(".builder-leadboard").html();
    //var HTMLCode = page.codeBox.getHTML();
    //var HTMLlist = page.getLeadersItems();
    var $preview = $("#previewLeaderboard");
    $preview
      .append(HTML)
      .find(".leadboard__help-column")
      .remove();

    //$preview.find(".leadboard__html").html(HTMLCode);
    //$preview.find(".leadboard__content").html(HTMLlist);
    //page.setCSSLeaderName();
    //page.setCSSLeaderScore();
  },
  getHTMLPreviewCaptureSreen: function() {
    var HTML = $(".capture-screen-content").html();
    $("#previewCaprureScreen")
      .append(HTML)
      .find(".help-box")
      .remove();
  }
};
$(document).ready(function() {
  page.init();
  page.colorBox();
  $(".slider-box__html").on("click", function() {
    if (!$(".leadboard-code-editor .CodeMirror").length) page.codeBox.init();
  });
  page.sliderGrid("twoGridGrid", [50]);
  page.changeOptions();
});
