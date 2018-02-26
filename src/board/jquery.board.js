(function ($, window, undefined) {
  "use strict";

  function Board(elem, options) {
    this.container = elem;
    this.elem;
    this.opt = $.extend(
      true,
      {
        resize: true,
        style: {
          container: {
            "background-color": "#EEEEEE"
          },
          title: {
            height: 30
          },
          line: {
            width: 10,
            height: 10,
            "background-color": "xxx",
            border: "xxx"
          },
          row: {
            "background-color": "xxx",
            border: "xxx"
          },
          column: {
            "background-color": "xxx",
            border: "xxx"
          }
        }
      },
      options
    );

    //this.layout = this.opt.layout;
    this.scrollSize;
    this.hash = {};
    //this.scrollHeight;
    //this.clientHeight;

    this.TYPE = {
      ROW: "ROW",
      COLUMN: "COLUMN"
    };

    this.init();
    this.bindEvent();
  }

  Board.prototype.init = function () {
    var elem = $('<div class="hq-board"></div>'),
      lineStyle = this.opt.style.line,
      size;

    this.elem = elem;
    elem.appendTo(this.container);
    this.getScrollSize();
    this.container.addClass("hq-board-container").css(
      $.extend(
        {
          padding: lineStyle.height + "px " + lineStyle.width + "px"
          //height: size.height
        },
        this.opt.style.container
      )
    );
    this.load();
  };

  Board.prototype.load = function () {
    //this.opt.layout = layout;
    var size = this.calculateContainerSize();
    this.calculateSize(this.TYPE.ROW, size, this.opt.layout, false);
    this.create();
  }

  Board.prototype.destroy = function () {
    debugger;
    this.elem.remove();
    this.elem = null;
    this.opt = null;
    this.container.removeClass('hq-board-container').removeAttr('style');
    this.container = null;
  }

  Board.prototype.calculateContainerSize = function () {
    var elem = this.container,
      height = elem.height() || $(document).height(),
      //宽度变小时，会出现纵向滚动条，影响宽度的计算，应设置overflow:hidden
      width = elem.width() || $(document).width(),
      //width = elem[0].clientWidth,
      //height = elem[0].clientHeight,
      size,
      lineStyle = this.opt.style.line;

    //height = height - 2 * lineStyle.height;
    //width = width - 2 * lineStyle.width;
    //console.log('container-width:' + width);
    return {
      width: width,
      height: height
    };
  };

  Board.prototype.getSizeName = function (sizeType) {
    if (sizeType === this.TYPE.ROW) {
      return "height";
    } else {
      return "width";
    }
  };

  Board.prototype.getScrollSize = function () {
    if (!this.scrollSize) {
      var div = $(
        '<div class="hq-board-scroll-size" style="width:50px;height:50px;overflow-y:scroll;' +
        'position:absolute;top:-200px;left:-200px;"><div style="height:100px;width:100%"/>' +
        "</div>"
      );

      $("body").append(div);
      var w1 = $(div).innerWidth();
      var w2 = $("div", div).innerWidth();
      $(div).remove();

      this.scrollSize = w1 - w2;
    }

    return this.scrollSize;
  };

  Board.prototype.hasVerticalScroll = function () {
    var container = this.container[0];

    if (container.scrollHeight > container.clientHeight) {
      return true;
    }

    return false;
  };

  Board.prototype.create = function () {
    var html = [];
    html.push(this.creatItems(this.TYPE.ROW, this.opt.layout));
    this.elem.html(html.join(""));
  };

  Board.prototype.creatItems = function (itemType, items) {
    var itemSize = {},
      item,
      child,
      sizeName,
      className,
      styleSize,
      html = [];

    sizeName = this.getSizeName(itemType);

    for (var i = 0, len = items.length; i < len; i++) {
      item = items[i];
      styleSize = sizeName + ":" + item[sizeName] + "px;";
      className = "hq-board-item";

      if (this.TYPE.COLUMN === itemType) {
        className += " hq-board-item-horizontal";
      } else {
        className += " hq-board-item-vertical";
      }
      html.push(
        [
          '<div class="', className, '" style="', styleSize, '">',
          this.createItem(item),
          "</div>"
        ].join("")
      );

      if (i !== len - 1) {
        styleSize = sizeName + ":" + this.opt.style.line[sizeName] + "px;";
        className = "hq-board-line";
        if (this.TYPE.COLUMN === itemType) {
          className += " hq-board-line-horizontal";
        } else {
          className += " hq-board-line-vertical";
        }
        html.push(
          [
            '<div class="', className, '" style="', styleSize, '">',
            "</div>"
          ].join("")
        );
      }
    }

    return html.join("");
  };

  Board.prototype.createItem = function (item) {
    var html = "",
      titleHeight = this.opt.style.title.height,
      titleClass = "hq-board-canvas-title ",
      titleStyle = "",
      contentStyle = "";

    if (item.rows && item.rows.length > 0) {
      html = this.creatItems(this.TYPE.ROW, item.rows);
    } else if (item.columns && item.columns.length > 0) {
      html = this.creatItems(this.TYPE.COLUMN, item.columns);
    } else {
      if (item.title) {
        titleStyle = ' style="height:' + titleHeight + "px;line-height:" + titleHeight + 'px;"';
        contentStyle = ' style="height:' + (item.height - titleHeight) + 'px; "';
      } else {
        titleClass += "hq-board-canvas-title-hidden ";
      }
      html = [
        '<div class="hq-board-canvas" >',
        '  <p class="', titleClass, '"', titleStyle, ">",
        item.title,
        "</p>",
        '  <div class="hq-board-canvas-content" data-id="', item.id, '"', contentStyle, "></div>",
        "</div>"
      ].join("");

      this.hash[item.id] = item;
    }

    return html;
  };

  Board.prototype.getCanvasContent = function (id) {
    debugger;
    return this.elem.find('[data-id="' + id + '"]');
  }

  Board.prototype.calculateSize = function (type, containerSize, items, resize) {
    var pixelSizeTotal,
      pixelSizeSum = 0,
      itemSize = {},
      size,
      length = items.length || 0,
      sizeName,
      otherSizeName,
      item,
      itemsSizeTotal = 0,
      hasVerticalScroll,
      scrollSize = this.getScrollSize();

    //console.dir(containerSize);
    if (type === this.TYPE.ROW) {
      sizeName = "height";
      otherSizeName = "width";
      pixelSizeTotal = containerSize.height;
    } else {
      sizeName = "width";
      otherSizeName = "height";
      pixelSizeTotal = containerSize.width;
    }

    pixelSizeTotal =
      pixelSizeTotal - this.opt.style.line[sizeName] * (length - 1);

    for (var i = 0; i < length; i++) {
      item = items[i];
      size = item["_" + sizeName] || item[sizeName];
      item["_" + sizeName] = size;

      if (size === "auto") {
        item[sizeName] = "auto";
      } else if (!isNaN(size)) {
        pixelSizeSum += size;
      } else {
        size = parseInt(pixelSizeTotal * (parseInt(size) || 0) / 100);
        item[sizeName] = size;
        pixelSizeSum += size;
      }
    }

    for (i = 0; i < length; i++) {
      item = items[i];
      size = item[sizeName];
      if (size === "auto") {
        //console.log('pixelSizeTotal:' + pixelSizeTotal);
        //console.log('pixelSizeSum:' + pixelSizeSum);
        //console.log(sizeName + ':' + (pixelSizeTotal - pixelSizeSum));
        item[sizeName] = pixelSizeTotal - pixelSizeSum;
      }
      itemsSizeTotal += size;
      item[otherSizeName] = containerSize[otherSizeName];
    }

    if (resize === false) {
      hasVerticalScroll = this.hasVerticalScroll();
      if (itemsSizeTotal < pixelSizeTotal && hasVerticalScroll) {
        containerSize.width += scrollSize;
      } else if (itemsSizeTotal > pixelSizeTotal && !hasVerticalScroll) {
        containerSize.width -= scrollSize;
      }
    }

    for (i = 0; i < length; i++) {
      item = items[i];
      if (item.rows && item.rows.length > 0) {
        this.calculateSize(
          this.TYPE.ROW,
          {
            width: item.width,
            height: containerSize.height
          },
          item.rows
        );
      } else if (item.columns && item.columns.length > 0) {
        this.calculateSize(
          this.TYPE.COLUMN,
          {
            height: item.height,
            width: containerSize.width
          },
          item.columns
        );
      }
    }
  };

  Board.prototype.resizeItems = function (itemType, items, elems) {
    var size, sizeName, item, elem;

    sizeName = this.getSizeName(itemType);

    for (var i = 0, len = items.length; i < len; i++) {
      item = items[i];
      elem = elems[i];
      size = item[sizeName];
      console.log(size);
      elem.style[sizeName] = size + "px";
      this.resizeItem(item, $(elem).find(">.hq-board-item"));
    }
  };

  Board.prototype.resizeItem = function (item, elems) {
    if (item.rows && item.rows.length > 0) {
      this.resizeItems(this.TYPE.ROW, item.rows, elems);
    } else if (item.columns && item.columns.length > 0) {
      this.resizeItems(this.TYPE.COLUMN, item.columns, elems);
    } else {
    }
  };

  Board.prototype.resize = function () {
    var elem = this.elem,
      //height = elem.height() || $(document).height(),
      //width = elem.width() || $(document).width(),
      //width = elem[0].clientWidth,
      //height = elem[0].clientHeight,
      size = this.calculateContainerSize(),
      items,
      elems = this.elem.find(">.hq-board-item");

    //console.log(' ');
    //console.log('elem width-:' + elem[0].offsetWidth);
    //console.warn('elem width:' + width);
    //console.log('resize start');
    this.calculateSize(this.TYPE.ROW, size, this.opt.layout);
    ////console.log('calculateSize end');
    this.resizeItems(this.TYPE.ROW, this.opt.layout, elems);
    //console.log('resizeItems end');
    //console.log(' ');
  };

  /**
   * EVENT
   */
  Board.prototype.bindEvent = function () {
    this.bindResize();
  };

  Board.prototype.bindResize = function () {
    if (this.opt.resize) {
      $(window).bind("resize", this, this.resizeEvent);
    }
  };

  Board.prototype.resizeEvent = function (event) {
    var self = event.data;
    self.resize();
  };

  Board.prototype.unbindResize = function () {
    $(window).unbind("resize", this.resizeEvent);
  };

  /**
   * methods
   */
  var methods = {
    init: function (options, $elem) {
      var board = $elem.data("board");

      if (arguments.length === 1) {
        options = {};
        $elem = arguments[0];
      }

      if (board) {
        board.destroy();
        $elem.removeData("board");
      }
      $elem.data("board", new Board($elem, options));

      return $elem;
    },
    load: function (layout, $elem) {
      this.opt.layout = layout;
      this.load();
      return $elem;
    },
    resize: function ($elem) {
      this.resize();
      return $elem;
    },
    destroy: function ($elem) {
      this.destroy();
      $elem.removeData("board");
      return $elem;
    },
    getCanvasContent: function (id) {
      return this.getCanvasContent(id);
    }
  };

  /**
   * JQUERY API
   */
  jQuery.fn.board = function () {
    var method = arguments[0],
      arg = arguments,
      instance = this.data("board");

    if (methods[method]) {
      method = methods[method];
      arg = Array.prototype.slice.call(arguments, 1);
    } else if (typeof method === "object" || !method) {
      arg = Array.prototype.slice.call(arguments);
      method = methods.init;
    } else {
      $.error("Method " + method + " does not exist on jQuery.board");
      return this;
    }

    if (!instance && method !== methods.init) {
      $.error("jQuery.board not instance");
      return this;
    }

    arg.push(this);
    return method.apply(instance, arg);
  };
})(jQuery, window);
