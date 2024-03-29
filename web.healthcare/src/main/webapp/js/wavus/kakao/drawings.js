(function(window) {
    function slice(a, b) {
        if (!a) return [];
        if ("string" == typeof a) return a.split(RegExp());
        try {
            return Array.prototype.slice.call(a, b || 0)
        } catch (c) {}
        for (var d = [], e = a.length, f = b || 0; f < e; ++f) d[f] = a[f];
        return d
    }
    Function.prototype.bind || (Function.prototype.bind = function(a) {
        var b = this,
            c = slice(arguments, 1);
        return function() {
            return b.apply(a, c.concat(slice(arguments)))
        }
    });
    Array.prototype.map || (Array.prototype.map = function(a, b) {
        for (var c = this.length >>> 0, d = Array(c), e = 0; e < c; e++) e in this && (d[e] = a.call(b, this[e], e, this));
        return d
    });
    Array.prototype.forEach || (Array.prototype.forEach = function(a, b) {
        for (var c = this.length >>> 0, d = 0; d < c; d++) d in this && a.call(b, this[d], d, this)
    });
    Array.prototype.filter || (Array.prototype.filter = function(a, b) {
        for (var c = this.length >>> 0, d = [], e = 0; e < c; e++)
            if (e in this) {
                var f = this[e];
                a.call(b, f, e, this) && d.push(f)
            } return d
    });
    Array.prototype.some || (Array.prototype.some = function(a, b) {
        for (var c = 0, d = this.length >>> 0; c < d; c++)
            if (c in this && a.call(b, this[c], c, this)) return true;
        return false
    });
    Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
        var c = this.length >>> 0,
            b = Number(b) || 0,
            b = b < 0 ? Math.ceil(b) : Math.floor(b);
        for (b < 0 && (b = b + c); b < c; b++)
            if (b in this && this[b] === a) return b;
        return -1
    });
    var OPEN = !!daum.maps.apikey,
        TO_LATLNG = function(a) {
            a instanceof daum.maps.Coords && (a = a.toLatLng());
            return a
        },
        TO_COORDS = function(a) {
            a instanceof daum.maps.LatLng && (a = a.toCoords());
            return a
        },
        GET_COORDS = function(a) {
            return TO_COORDS(a[OPEN ? "latLng" : "coords"])
        },
        TO_XY = function(a) {
            var b;
            OPEN ? (a = TO_LATLNG(a), b = a.getLng(), a = a.getLat()) : (b = a.getX(), a = a.getY());
            return {
                x: b,
                y: a
            }
        },
        GET_COORD_SYSTEM = function() {
            return OPEN ? "wgs84" : "wcongnamul"
        };
    var drawing = {
            count: 0
        },
        SECURE = "https:" == window.location.protocol,
        PROTOCOL = SECURE ? "https:" : "http:";
    drawing.inherits = function(a, b) {
        function c() {}
        c.prototype = b.prototype;
        a.prototype = new c;
        a.prototype.constructor = a;
        a.super_ = b.prototype
    };
    drawing.implement = function(a, b) {
        var c = b.prototype,
            d = a.prototype;
        for (method in c) b.super_.hasOwnProperty(method) || (d[method] = c[method])
    };
    drawing.merge = function(a, b) {
        for (var c in b) b.hasOwnProperty(c) && (a[c] = b[c]);
        return a
    };
    drawing.css = {};
    drawing.css.set = function(a, b) {
        var c = a.style,
            d;
        for (d in b) b.hasOwnProperty(d) && (c[d] = b[d])
    };
    drawing.event = {};
    drawing.event.proxy_ = function() {
        function a(b) {
            b = b || window.event;
            b.target || (b.target = b.srcElement);
            return a.func.call(a.scope || a.target, b)
        }
        return a
    };
    drawing.event.POOL_ = [];
    drawing.event.listen = function(a, b, c, d) {
        var e = drawing.event.proxy_();
        e.target = a;
        e.type = b;
        e.func = c;
        e.scope = d;
        a.addEventListener ? a.addEventListener(b, e, !1) : a.attachEvent("on" + b, e);
        a = drawing.event.POOL_.length;
        drawing.event.POOL_[a] = e;
        return a
    };
    drawing.event.unlisten = function(a) {
        var b = drawing.event.POOL_[a];
        b && (b.target.removeEventListener ? b.target.removeEventListener(b.type, b, !1) : b.target.detachEvent("on" + b.type, b), delete drawing.event.POOL_[a])
    };
    drawing.url = {};
    drawing.url.LOCAL_IMG = PROTOCOL + "//i1.daumcdn.net/localimg/localimages/07/2012/";
    var Default = {
        clickable: !0,
        removable: !1,
        draggable: !1,
        editable: !1,
        zIndex: 0,
        strokeWeight: 3,
        strokeColor: "#F10000",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#F10000",
        fillOpacity: 0
    };

    function EventLinker() {
        this._eventHandlers = {}
    }
    EventLinker.prototype.addListener = function(a, b, c) {
        var d = this._eventHandlers;
        (d[a] = d[a] || []).push({
            callback: b,
            object: c || null
        })
    };
    EventLinker.prototype.removeListener = function(a, b, c) {
        for (var c = c || null, a = this._eventHandlers[a], d = 0, e = 0, f = a.length; e < f; ++e) {
            var g = a[e];
            if (g.callback !== b || g.object !== c) a[d] = g, ++d
        }
        a.length = d
    };
    EventLinker.prototype._dispatchEvent = function(a, b) {
        var c;
        (c = this._eventHandlers[a]) && c.forEach(function(a) {
            a.callback.call(a.object || this, b)
        }, this)
    };
    EventLinker.prototype.dispose = function() {
        this._eventHandlers = {}
    };

    function Observable(a) {
        this.observer_ = [];
        a && a.onLoad && (this.loadHandler_ = a.onLoad)
    }
    Observable.prototype.loadHandler_ = Function();
    Observable.prototype.notify = function(a) {
        this.observer_.forEach(function(b) {
            b(a)
        })
    };
    Observable.prototype.clear = function() {
        var a = this.observer_;
        a[0] && this.loadHandler_(!1);
        a.length = 0
    };
    Observable.prototype.add = function(a, b) {
        var c = this.observer_;
        c[0] || this.loadHandler_(!0);
        if (b) {
            var d = a,
                a = d.bind(b);
            a.__func__ = d;
            a.__scope__ = b
        }
        c.push(a)
    };
    Observable.prototype.remove = function(a, b) {
        for (var c = this.observer_, d = 0, e; e = c[d]; ++d)
            if (e === a || e.__func__ === a && e.__scope__ === b) {
                c.splice(d, 1);
                c[0] || this.loadHandler_(!1);
                break
            }
    };

    function HistoryStorage(a) {
        this._stack = [HistoryStorage.NOTHING];
        this._cursor = 1;
        this._overflown = !1;
        this._stackSize = a || 20
    }
    HistoryStorage.NOTHING = null;
    HistoryStorage.prototype.push = function(a) {
        this._updateStack();
        this._stack.push(a);
        this._moveCursorForward()
    };
    HistoryStorage.prototype.pop = function() {
        this._moveCursorBack();
        return this._stack[this._cursor - 1]
    };
    HistoryStorage.prototype.restore = function() {
        this._moveCursorForward();
        return this._stack[this._cursor - 1]
    };
    HistoryStorage.prototype._updateStack = function() {
        this._stack.splice(this._cursor);
        this._stack.length > this._stackSize && (this._stack.shift(), this._moveCursorBack(), this._overflown = !0)
    };
    HistoryStorage.prototype._moveCursorBack = function() {
        this._cursor = Math.max(this._cursor - 1, 1)
    };
    HistoryStorage.prototype._moveCursorForward = function() {
        this._cursor = Math.min(this._cursor + 1, this._stack.length)
    };
    HistoryStorage.prototype.undoable = function() {
        return 0 < this._stack.length && 1 < this._cursor
    };
    HistoryStorage.prototype.redoable = function() {
        return this._stack.length > this._cursor
    };
    HistoryStorage.prototype.isOverflown = function() {
        return this._overflown
    };

    function UIDraggable(a) {
        function b(a) {
            a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
        }
        var c = a.target,
            d = a.map,
            e = a.callbacks || {},
            f = 4,
            g = !1,
            h = !1;
        (c.setMap ? daum.maps.event.addListener : drawing.event.listen)(c, "mousedown", function(a) {
            function l(a) {
                a = GET_COORDS(a);
                0 == i && 0 == j && (i = a.getX(), j = a.getY());
                var b = i - a.getX(),
                    d = j - a.getY();
                if (k && (Math.abs(b) > f || Math.abs(d) > f))(e.dragstart || Boolean)(), h = !0, k = !1;
                k || (daum.maps.event.preventMap(), (e.drag || Boolean)({
                    target: c,
                    dx: b,
                    dy: d
                }), i = a.getX(), j = a.getY())
            }

            function m() {
                drawing.event.unlisten(n);
                daum.maps.event.removeListener(d, "mousemove", l);
                daum.maps.event.removeListener(d, "mouseup", m);
                (e[k ? "dragcancel" : "dragend"] || Boolean)();
                h = !1
            }
            if (!h && !g) {
                daum.maps.event.preventMap();
                var n = drawing.event.listen(document, "mousedown", b);
                b(a);
                var i = 0,
                    j = 0,
                    k = !0;
                daum.maps.event.addListener(d, "mousemove", l);
                daum.maps.event.addListener(d, "mouseup", m)
            }
        });
        return {
            preventDrag: function(a) {
                g = a
            }
        }
    };
    var ComponentFactory = {
        createMarkerImage: function(a) {
            if (!a) return null;
            if (!a.src) return new daum.maps.MarkerImage(PROTOCOL + "//i1.daumcdn.net/dmaps/apis/n_local_blit_04.png", new daum.maps.Size(31, 35), new daum.maps.Point(13, 34), "poly", "16,0,20,2,24,6,26,10,26,16,23,22,17,25,14,35,13,35,9,25,6,24,2,20,0,16,0,10,2,6,6,2,10,0");
            var b = {
                shape: a.shape,
                coords: a.coords
            };
            "number" == typeof a.offsetX && (b.offset = new daum.maps.Point(a.offsetX, a.offsetY));
            a.spriteWidth && (b.spriteSize = new daum.maps.Size(a.spriteWidth,
                a.spriteHeight), b.spriteOrigin = new daum.maps.Point(a.spriteOriginX, a.spriteOriginY));
            return new daum.maps.MarkerImage(a.src, new daum.maps.Size(a.width, a.height), b)
        },
        createCloseButton: function(a, b) {
            return new daum.maps.Marker({
                clickable: !0,
                zIndex: 1,
                image: new daum.maps.MarkerImage(drawing.url.LOCAL_IMG + "attach/pc_img/ico_marker3_150318.png", new daum.maps.Size(18, 18), new daum.maps.Point(a || 18, b || 18))
            })
        },
        createDefaultTooltip: function(a, b) {
            b = b || {};
            return new DefaultTooltip({
                map: a,
                clickable: !0,
                zIndex: b.zIndex,
                offsetX: b.offsetX,
                offsetY: b.offsetY,
                type: b.type,
                defaultContent: b.defaultContent
            })
        },
        createGuideTooltip: function(a) {
            return new GuideTooltip({
                map: a,
                zIndex: 2
            })
        },
        createVertex: function(a, b, c) {
            var d = document.createElement("div"),
                e = !1,
                a = a || "#555555",
                b = b || 1,
                c = c || "solid";
            drawing.event.listen(d, "mouseover", function() {
                e || (d.style.backgroundColor = "#aaaaaa")
            });
            drawing.event.listen(d, "mouseout", function() {
                e || (d.style.backgroundColor = "#ffffff")
            });
            drawing.event.listen(document, "mousedown", function() {
                e = !0
            });
            drawing.event.listen(document,
                "mouseup",
                function() {
                    e = !1;
                    d.style.backgroundColor = "#ffffff"
                });
            d.style.cssText = "width:7px; height:7px; background-color:#ffffff; border:1px " + c + " " + a + "; cursor:pointer;";
            d.style.opacity = b.toString();
            d.style.filter = "alpha(opacity=" + (100 * b).toString() + ")";
            return new daum.maps.Billboard({
                clickable: !0,
                content: d,
                zIndex: 1
            })
        },
        createVertices: function(a, b, c) {
            var d = [],
                e = /^#((\d|[a-f]|[A-F]){6})/;
            for (e.test(b) && (b = b.replace(e, function(a, b) {
                    for (var c = "#", d = 0; 3 > d; d++) var e = b.substr(2 * d, 2),
                        e = parseInt("0x" + e) - 119,
                        c = c + (0 > e ? "00" : e).toString(16);
                    return c
                })); a--;) e = ComponentFactory.createVertex(b, c), d.push(e);
            return d
        }
    };

    function DefaultTooltip(a) {
        daum.maps.Billboard.call(this, a);
        this.onRemoveMarker = new Observable;
        this.onHide = new Observable;
        this.onEdit = new Observable;
        var b = this._content = new DefaultContent({
            offsetX: a.offsetX,
            offsetY: a.offsetY,
            text: a.defaultContent || "",
            type: DefaultContent.EDIT
        });
        b.onClose.add(this.removeMarker, this);
        b.onLabel.add(this.setLabel, this);
        b.onChangeMode.add(this._notifyEditMode, this);
        this.setContent(b.getElement());
        b.focusAndSelect();
        this._label = a.defaultContent
    }
    drawing.inherits(DefaultTooltip, daum.maps.Billboard);
    DefaultTooltip.prototype._notifyEditMode = function(a) {
        a == DefaultContent.EDIT && this.onEdit.notify()
    };
    DefaultTooltip.prototype.removeMarker = function() {
        this.setMap(null);
        this.onRemoveMarker.notify()
    };
    DefaultTooltip.prototype.setLabel = function(a) {
        (this._label = a) || this.onHide.notify()
    };
    DefaultTooltip.prototype.getLabel = function() {
        return this._label
    };
    DefaultTooltip.prototype.setActive = function(a) {
        this.setVisible(a);
        a && !this._label && (this._content.setMode(DefaultTooltip.EDIT), this._content.focusAndSelect())
    };
    DefaultTooltip.prototype.setMode = function(a) {
        this._content.setMode(a)
    };
    DefaultTooltip.prototype.preventEvent = function(a) {
        this._content.preventChangingMode(a)
    };

    function DefaultContent(a) {
        this.onClose = new Observable;
        this.onLabel = new Observable;
        this.onChangeMode = new Observable;
        this._prevented = !1;
        var b = a.type || DefaultContent.EDIT,
            c = this._wrap = document.createElement("div");
        c.style.position = "absolute";
        c.style.whiteSpace = "nowrap";
        var d = a.offsetX,
            e = a.offsetY;
        c.style.left = ("number" == typeof d ? d : 17) + "px";
        c.style.top = ("number" == typeof e ? e : -28) + "px";
        d = document.createElement("span");
        d.style.display = "inline-block";
        d.style.width = "8px";
        d.style.height = "21px";
        d.style.overflow =
            "hidden";
        d.style.background = "no-repeat 0 0 url(" + drawing.url.LOCAL_IMG + "attach/pc_img/ico_marker1_150318.png)";
        c.appendChild(d);
        var f = document.createElement("span");
        f.style.display = "inline-block";
        f.style.height = "23px";
        f.style.verticalAlign = "top";
        f.style.font = "12px/12px Dotum, \ub3cb\uc6c0, sans-serif";
        f.style.fontWeight = "bold";
        f.style.verticalAlign = "top";
        f.style.background = "repeat-x url(" + drawing.url.LOCAL_IMG + "attach/pc_img/edit_line.png)";
        f.style.letterSpacing = "-1px";
        d = this._label = document.createElement("span");
        d.style.position = "relative";
        d.style.top = "6px";
        d.style.padding = "0";
        d.style.cursor = "pointer";
        var g = this._input = document.createElement("input");
        g.title = "\ub0b4\uc6a9\uc744 \uc785\ub825\ud558\uc138\uc694.";
        g.style.position = "relative";
        g.style.letterSpacing = "-1px";
        g.style.top = "2px";
        g.style.border = "0";
        g.style.outline = "0";
        g.style.margin = "0";
        g.style.padding = "0";
        g.style.height = "15px";
        g.style.width = "82px";
        e = this._confirm = document.createElement("input");
        e.value = "\ud655\uc778";
        e.title = "\ud655\uc778";
        e.type = "submit";
        e.style.position = "relative";
        e.style.verticalAlign = "top";
        e.style.right = "-8px";
        e.style.border = "0";
        e.style.outline = "0";
        e.style.margin = "0";
        e.style.padding = "0";
        e.style.textIndent = "-9999px";
        e.style.background = "no-repeat -160px 0 url(" + drawing.url.LOCAL_IMG + "attach/pc_img/btn_comm_150409.png)";
        e.style.width = "23px";
        e.style.height = "21px";
        e.style.overflow = "hidden";
        var h = document.createElement("form");
        h.appendChild(g);
        h.appendChild(e);
        f.appendChild(d);
        f.appendChild(h);
        c.appendChild(f);
        f = document.createElement("span");
        f.style.display = "inline-block";
        f.style.width = "8px";
        f.style.height = "21px";
        f.style.overflow = "hidden";
        f.style.background = "no-repeat -25px 0 url(" + drawing.url.LOCAL_IMG + "attach/pc_img/ico_marker1_150318.png)";
        c.appendChild(f);
        drawing.event.listen(d, "click", this._clickEdit, this);
        drawing.event.listen(e, "click", this._clickConfirm, this);
        drawing.event.listen(h, "submit", this._clickConfirm, this);
        this._input.value = a.text || "";
        this._setMode(b)
    }
    DefaultContent.NORMAL = "normal";
    DefaultContent.EDIT = "edit";
    DefaultContent.prototype._clickEdit = function() {
        this._prevented || (daum.maps.event.preventMap(), this._setMode(DefaultContent.EDIT), this._focusAndSelect())
    };
    DefaultContent.prototype._clickClose = function() {
        this.onClose.notify()
    };
    DefaultContent.prototype._clickConfirm = function(a) {
        a = a || window.event;
        a.preventDefault ? (a.stopPropagation(), a.preventDefault()) : (a.returnValue = !1, a.cancelBubble = !0);
        this._setMode(DefaultContent.NORMAL);
        return !1
    };
    DefaultContent.prototype._setMode = function(a) {
        this._mode != a && (this._mode = a, a == DefaultContent.NORMAL ? (this._label.style.display = "inline-block", this._input.style.display = "none", this._confirm.style.display = "none", this._setTitle(this._input.value)) : (this._label.style.display = "none", this._input.style.display = "inline-block", this._confirm.style.display = "inline-block"), this.onChangeMode.notify(a))
    };
    DefaultContent.prototype._focusAndSelect = function() {
        this._input.focus();
        this._input.select()
    };
    DefaultContent.prototype._setTitle = function(a) {
        this._label.innerHTML = "";
        this._label.appendChild(document.createTextNode(a));
        this.onLabel.notify(a)
    };
    DefaultContent.prototype.getElement = function() {
        return this._wrap
    };
    DefaultContent.prototype.focusAndSelect = function() {
        this._focusAndSelect()
    };
    DefaultContent.prototype.setMode = function(a) {
        this._setMode(a)
    };
    DefaultContent.prototype.preventChangingMode = function(a) {
        this._prevented = a
    };

    function GuideTooltip(a) {
        daum.maps.Billboard.call(this, a);
        a = this._wrap = document.createElement("div");
        a.style.cssText = "-webkit-user-select:none;position:absolute;left: 15px;top:-10px;letter-spacing:-1px;background-color:#555555;opacity:0.9;filter:alpha(opacity=90);border-radius:4px;-webkit-border-radius:4px;-moz-border-radius:4px;-o-border-radius:4px;padding:3px 5px;text-align:center;color:#ffffff;";
        var b = this._text = document.createElement("p");
        b.style.cssText = "font:11px/14px Dotum, \ub3cb\uc6c0, sans-serif;vertical-align:top;margin:0;";
        a.appendChild(b);
        this.setContent(a);
        this.setVisible(!1);
        a = this.getMap();
        this.MAP_RIGHT = (this._proj = a.getProjection()).pointFromCoords(a.getBounds().getNorthEast()).x
    }
    drawing.inherits(GuideTooltip, daum.maps.Billboard);
    GuideTooltip.prototype._setPosition = daum.maps.Billboard.prototype.setPosition;
    GuideTooltip.prototype._updatePosition = function() {
        var a = this._wrap;
        this._proj.pointFromCoords(this.getPosition()).x + 150 > this.MAP_RIGHT ? (a.style.left = "auto", a.style.right = "15px") : (a.style.left = "15px", a.style.right = "auto")
    };
    GuideTooltip.prototype._overlayType = "";
    GuideTooltip.prototype.setPosition = function(a) {
        this._setPosition(a);
        this._updatePosition()
    };
    GuideTooltip.prototype.setOverlayType = function(a) {
        this._overlayType = a
    };
    GuideTooltip.prototype.setGuide = function(a) {
        this._setGuideText(a)
    };
    GuideTooltip.TYPE_MAP = {
        marker: "\ud540",
        polyline: "\uc120",
        polygon: "\ub2e4\uac01\ud615",
        arrow: "\ud654\uc0b4\ud45c",
        circle: "\uc6d0",
        ellipse: "\uc6d0",
        rectangle: "\uc0ac\uac01\ud615"
    };
    GuideTooltip.GUIDE_TEXT = {
        CLICK_AND_START: ["\ud074\ub9ad\ud558\uc5ec", "", "\uadf8\ub9ac\uae30\ub97c \uc2dc\uc791\ud569\ub2c8\ub2e4."],
        CLICK_AND_CONTINUE: ["\ud074\ub9ad\ud558\uc5ec", "", "\uadf8\ub9ac\uae30\ub97c \uacc4\uc18d\ud569\ub2c8\ub2e4."],
        CLICK_AND_DONE: ["\ud074\ub9ad\ud558\uba74", "", "\uadf8\ub9ac\uae30\ub97c \ub9c8\uce69\ub2c8\ub2e4."],
        ENDS_CLICK_AND_DONE: ["\ub9c8\uc9c0\ub9c9 \uc9c0\uc810\uc744 \ud55c \ubc88 \ub354 \ud074\ub9ad\ud558\uba74", "", "\uadf8\ub9ac\uae30\ub97c \ub9c8\uce69\ub2c8\ub2e4."],
        CLICK_AND_ADD: ["\ud074\ub9ad\ud558\uba74", "", "\ucd94\uac00\ud569\ub2c8\ub2e4."],
        DRAG_AND_DROP: ["\ub04c\uc5b4\uc11c", "", "\uc774\ub3d9\ud569\ub2c8\ub2e4."],
        EDIT: ["\uc774 \uacf3\uc744 \ub04c\uc5b4\uc11c", "", "\uc218\uc815\ud569\ub2c8\ub2e4."],
        ADD: ["\uc774 \uacf3\uc744 \ub04c\uc5b4\uc11c", "", "\ucd94\uac00\ud569\ub2c8\ub2e4."]
    };
    GuideTooltip.prototype._setGuideText = function(a) {
        var b = GuideTooltip.GUIDE_TEXT[a],
            c = GuideTooltip.TYPE_MAP[this._overlayType],
            d = "<br>",
            d = "CLICK_AND_ADD" == a || "DRAG_AND_DROP" == a ? d + this._appendSuffix(c) : "ADD" == a || "EDIT" == a ? d + this._appendSuffix(c) : d + c;
        b[1] = d;
        this._text.innerHTML = b.join(" ")
    };
    GuideTooltip.prototype._appendSuffix = function(a) {
        if (!a) return a;
        var b = a.charCodeAt(a.length - 1) - 44032;
        return a + (0 == b % 28 ? "\ub97c" : "\uc744")
    };

    function ExtendsMarker(a) {
        daum.maps.Marker.call(this, a);
        this.onRemove = new Observable;
        this.onDrag = new Observable;
        this.onHover = new Observable;
        this.onEdit = new Observable;
        this.onChangeState = new Observable;
        this.onImageIndexChange = new Observable;
        this._isLocked = !1;
        this._index = a.index;
        this._clickable = a.clickable;
        this._imageIndex = a.imageIndex;
        this._image = a.image || this.getImage();
        this._hoverImage = a.hoverImage;
        this._dragImage = a.dragImage;
        this._tooltipOptions = a.tooltipOptions || {};
        this._closerOptions = a.closerOptions || {};
        this._order = drawing.count++
    }
    drawing.inherits(ExtendsMarker, daum.maps.Marker);
    ExtendsMarker.prototype._click = function() {
        this._setTooltipVisible(!this._tooltipVisible);
        this.onEdit.notify(this)
    };
    ExtendsMarker.prototype._remove = function() {
        this._isLocked || (this._tooltip && this._tooltip.setMap(null), this._closeButton && this._closeButton.setMap(null), this.setMap(null), this.onRemove.notify(this._index))
    };
    ExtendsMarker.prototype._dragstart = function() {
        this._dragImage && this.setImage(this._dragImage);
        this._setTooltipVisible(!1);
        this.onDrag.notify(!0);
        this._dragging = !0
    };
    ExtendsMarker.prototype._drag = function(a) {
        var b = TO_COORDS(this.getPosition()),
            a = new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy);
        this.setPosition(a);
        this._closeButton && this._closeButton.setPosition(a)
    };
    ExtendsMarker.prototype._dragend = function() {
        this.setImage(this._image);
        this._setTooltipVisible(!0);
        this.onDrag.notify(!1);
        this._dragging = !1;
        this.onChangeState.notify()
    };
    ExtendsMarker.prototype._setTooltipVisible = function(a) {
        this._tooltip && (this._tooltipVisible = a, this._tooltip.setPosition(this.getPosition()), this._tooltip.setActive(a))
    };
    ExtendsMarker.prototype._updateCloseButtonPosition = function() {
        this._closeButton.setPosition(this.getPosition())
    };
    ExtendsMarker.prototype.setTooltipVisible = function() {};
    ExtendsMarker.prototype.unpick = function() {
        this._tooltip && this._tooltip.setMode(DefaultContent.NORMAL)
    };
    ExtendsMarker.prototype.setRemovable = function(a) {
        if (a) {
            var a = this._image.getOffset(),
                b = this._closerOptions.offsetX,
                c = this._closerOptions.offsetY,
                d = this._closeButton = ComponentFactory.createCloseButton(a.x + ("number" == typeof b ? -b : 21), a.y + ("number" == typeof c ? -c : 5));
            d.setMap(this.getMap());
            daum.maps.event.addListener(this, "mouseover", function() {
                d.setZIndex(9999)
            });
            daum.maps.event.addListener(this, "mouseout", function() {
                d.setZIndex(1)
            });
            daum.maps.event.addListener(d, "click", this.remove.bind(this));
            this._updateCloseButtonPosition()
        }
    };
    ExtendsMarker.prototype.getOrder = function() {
        return this._order
    };
    ExtendsMarker.prototype.setDraggable = function(a) {
        if (this._draggable = a) this._markerDraggable = UIDraggable({
            target: this,
            map: this.getMap(),
            callbacks: {
                dragstart: this._dragstart.bind(this),
                drag: this._drag.bind(this),
                dragend: this._dragend.bind(this),
                dragcancel: this._click.bind(this)
            }
        }), daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this))
    };
    ExtendsMarker.prototype.preventEvent = function(a) {
        this._markerDraggable && this._markerDraggable.preventDrag(a);
        this._tooltip && this._tooltip.preventEvent(a)
    };
    ExtendsMarker.prototype.getDraggable = function() {
        return this._draggable
    };
    ExtendsMarker.prototype.getEditable = function() {
        return !!this._tooltip
    };
    ExtendsMarker.prototype.setHoverable = function() {
        this._hoverImage && (daum.maps.event.addListener(this, "mouseover", function() {
            !this._dragging && this.setImage(this._hoverImage)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            !this._dragging && this.setImage(this._image)
        }.bind(this)))
    };
    ExtendsMarker.prototype.setMarkerImage = function(a, b) {
        a ? (this.setImage(a), this._image = a, this._imageIndex = b) : this.setImage(this._image)
    };
    ExtendsMarker.prototype.remove = function() {
        this._remove();
        this.onChangeState.notify()
    };
    ExtendsMarker.prototype.removeWithoutNotify = function() {
        this._remove()
    };
    ExtendsMarker.prototype.setIndex = function(a) {
        this._index = a
    };
    ExtendsMarker.prototype.getIndex = function() {
        return this._index
    };
    ExtendsMarker.prototype.setImageIndex = function(a) {
        this.onImageIndexChange.notify(a);
        this.onChangeState.notify()
    };
    ExtendsMarker.prototype.getImageIndex = function() {
        return this._imageIndex
    };
    ExtendsMarker.prototype.createTooltip = function(a) {
        this._tooltip && this._tooltip.getMap(null);
        a.zIndex = this.getZIndex();
        a = this._tooltip = ComponentFactory.createDefaultTooltip(this.getMap(), a);
        a.onRemoveMarker.add(this.remove, this);
        a.onHide.add(function() {
            this._setTooltipVisible(!1)
        }, this);
        a.onEdit.add(function() {
            this.onEdit.notify(this)
        }, this);
        this._setTooltipVisible(!0)
    };
    ExtendsMarker.prototype.getTooltip = function() {
        return this._tooltip
    };

    function ExtendsPolyline(a) {
        daum.maps.Polyline.call(this, a);
        this.onRemove = new Observable;
        this.onDrag = new Observable;
        this.onEdit = new Observable;
        this.onVertexHover = new Observable;
        this.onVertexAdderHover = new Observable;
        this.onHover = new Observable;
        this.onChangeState = new Observable;
        this._isLocked = !1;
        this._timeoutId = 0;
        this._isDraggingVertex = this._vertexVisible = !1;
        this._index = a.index;
        this._strokeWeight = a.strokeWeight;
        this._strokeOpacity = a.strokeOpacity;
        this._strokeColor = a.strokeColor;
        this._strokeStyle = a.strokeStyle;
        this._order = drawing.count++
    }
    drawing.inherits(ExtendsPolyline, daum.maps.Polyline);
    ExtendsPolyline.prototype._remove = function() {
        this._isLocked || (this._closeButton && this._closeButton.setMap(null), this._vertices && (this._vertices.forEach(function(a) {
            a.setMap(null)
        }), this._vertexAdders.forEach(function(a) {
            a.setMap(null)
        }), daum.maps.event.removeListener(this, "click", this._clickHandler), daum.maps.event.removeListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.removeListener(this, "mouseout", this._mouseoutHandler)), this.setMap(null), this.onRemove.notify(this._index))
    };
    ExtendsPolyline.prototype._dragstart = function() {
        this.onDrag.notify(!0)
    };
    ExtendsPolyline.prototype._drag = function(a) {
        var b = this.getPath().map(function(b) {
            b = TO_COORDS(b);
            return new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy)
        });
        this.setPath(b);
        this._closeButton && (b = TO_COORDS(this._closeButton.getPosition()), this._closeButton.setPosition(new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy)));
        this._vertices && (this._vertices.forEach(function(b) {
            var d = TO_COORDS(b.getPosition());
            b.setPosition(new daum.maps.Coords(d.getX() - a.dx, d.getY() - a.dy))
        }), this._vertexAdders.forEach(function(b) {
            var d =
                TO_COORDS(b.getPosition());
            b.setPosition(new daum.maps.Coords(d.getX() - a.dx, d.getY() - a.dy))
        }))
    };
    ExtendsPolyline.prototype._dragend = function() {
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsPolyline.prototype._dragstartVertex = function() {
        this._closeButton && this._closeButton.setVisible(!1);
        this._setVertexAddersVisible(!1);
        this._isDraggingVertex = !0
    };
    ExtendsPolyline.prototype._dragVertex = function(a, b) {
        var c = this.getPath(),
            d = this._vertices[a],
            e = TO_COORDS(d.getPosition()),
            e = new daum.maps.Coords(e.getX() - b.dx, e.getY() - b.dy);
        d.setPosition(e);
        c[a] = e;
        this.setPath(c)
    };
    ExtendsPolyline.prototype._dragendVertex = function() {
        this._closeButton && (this._closeButton.setVisible(!0), this._updateCloseButtonPosition());
        this._setVertexAddersVisible(!0);
        this._updateVertexAddersPosition();
        this._isDraggingVertex = !1;
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsPolyline.prototype._dragstartVertexAdder = function(a) {
        this._closeButton && this._closeButton.setVisible(!1);
        var b = [];
        this.getPath().forEach(function(c, d) {
            b.push(c);
            d == a && b.push(this._vertexAdders[d].getPosition())
        }, this);
        this.setPath(b);
        this._vertices.forEach(function(a) {
            a.setMap(null)
        });
        this._vertexAdders.forEach(function(a) {
            a.setMap(null)
        });
        this._createVertices();
        this._createVertexAdders();
        this._setVertexAddersVisible(!1);
        this._isDraggingVertex = !0
    };
    ExtendsPolyline.prototype._hover = function() {
        clearTimeout(this._timeoutId)
    };
    ExtendsPolyline.prototype._out = function() {
        this._timeoutId = setTimeout(function() {
            !this._vertexVisible && !this._isDraggingVertex && (this._setVerticesVisible(!1), this._setVertexAddersVisible(!1))
        }.bind(this), 100)
    };
    ExtendsPolyline.prototype._updateCloseButtonPosition = function() {
        var a = this.getPath();
        this._closeButton.setPosition(a[a.length - 1])
    };
    ExtendsPolyline.prototype._updateVertexAddersPosition = function() {
        var a = this.getPath(),
            b = a.slice();
        this._closed && b.push(a[0]);
        this._vertexAdders.forEach(function(a, d) {
            var e = TO_COORDS(b[d]),
                f = TO_COORDS(b[d + 1]),
                e = new daum.maps.Coords((e.getX() + f.getX()) / 2, (e.getY() + f.getY()) / 2);
            a.setPosition(e);
            a.setMap(this.getMap())
        }, this)
    };
    ExtendsPolyline.prototype._setVertexVisible = function(a) {
        this._vertexVisible = a;
        this._editable && (this._setVerticesVisible(a), this._setVertexAddersVisible(a))
    };
    ExtendsPolyline.prototype._setVerticesVisible = function(a) {
        this._vertices && this._vertices.forEach(function(b) {
            b.setVisible(a)
        }, this)
    };
    ExtendsPolyline.prototype._setVertexAddersVisible = function(a) {
        this._vertexAdders.forEach(function(b) {
            b.setVisible(a)
        }, this)
    };
    ExtendsPolyline.prototype._createVertices = function() {
        var a = this.getPath();
        this._vertices = ComponentFactory.createVertices(a.length, this._strokeColor);
        this._vertices.forEach(function(b, c) {
            var d = b.getContent();
            drawing.event.listen(d, "mousedown", function() {
                this.onDrag.notify(!0)
            }.bind(this));
            drawing.event.listen(d, "mouseover", function() {
                this._hover();
                this.onVertexHover.notify(b.getPosition())
            }.bind(this));
            drawing.event.listen(d, "mouseout", function() {
                this._out();
                this.onVertexHover.notify(null)
            }.bind(this));
            this._vertexDraggable = UIDraggable({
                target: d,
                map: this.getMap(),
                callbacks: {
                    dragstart: this._dragstartVertex.bind(this),
                    drag: this._dragVertex.bind(this, c),
                    dragend: this._dragendVertex.bind(this)
                }
            });
            b.setPosition(TO_COORDS(a[c]));
            b.setMap(this.getMap())
        }, this)
    };
    ExtendsPolyline.prototype._createVertexAdders = function() {
        var a = this.getPath(),
            b = a.slice().map(TO_COORDS);
        this._closed && b.push(TO_COORDS(a[0]));
        this._vertexAdders = ComponentFactory.createVertices(b.length - 1, this._strokeColor, 0.5);
        this._vertexAdders.forEach(function(a, d) {
            var e = a.getContent();
            drawing.event.listen(e, "mousedown", function() {
                this.onDrag.notify(!0)
            }.bind(this));
            drawing.event.listen(e, "mouseover", function() {
                this._hover();
                this.onVertexAdderHover.notify(a.getPosition())
            }.bind(this));
            drawing.event.listen(e,
                "mouseout",
                function() {
                    this._out();
                    this.onVertexAdderHover.notify(null)
                }.bind(this));
            this._adderDraggable = UIDraggable({
                target: e,
                map: this.getMap(),
                callbacks: {
                    dragstart: this._dragstartVertexAdder.bind(this, d),
                    drag: this._dragVertex.bind(this, d + 1),
                    dragend: this._dragendVertex.bind(this)
                }
            });
            var e = b[d],
                f = b[d + 1],
                e = new daum.maps.Coords((e.getX() + f.getX()) / 2, (e.getY() + f.getY()) / 2);
            a.setPosition(e);
            a.setMap(this.getMap())
        }, this)
    };
    ExtendsPolyline.prototype.setRemovable = function(a) {
        if (a) {
            var b = this._closeButton = ComponentFactory.createCloseButton();
            b.setMap(this.getMap());
            daum.maps.event.addListener(this, "mouseover", function() {
                b.setZIndex(9999)
            });
            daum.maps.event.addListener(this, "mouseout", function() {
                b.setZIndex(1)
            });
            daum.maps.event.addListener(b, "click", this.remove.bind(this));
            this._updateCloseButtonPosition()
        }
    };
    ExtendsPolyline.prototype.setDraggable = function(a) {
        if (this._draggable = a) this._figureDraggable = UIDraggable({
            target: this,
            map: this.getMap(),
            callbacks: {
                dragstart: this._dragstart.bind(this),
                drag: this._drag.bind(this),
                dragend: this._dragend.bind(this)
            }
        }), daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this))
    };
    ExtendsPolyline.prototype.setEditable = function(a) {
        if (this._editable = a) this._createVertices(), this._createVertexAdders(), this._clickHandler = function() {
                this._isLocked || (this._draggable || daum.maps.event.preventMap(), this._setVertexVisible(!0), this.onEdit.notify(this))
            }.bind(this), this._mouseoverHandler = function() {
                this._isLocked || (this._hover(), this._isDraggingVertex || (this._setVerticesVisible(!0), this._setVertexAddersVisible(!0)))
            }.bind(this), this._mouseoutHandler = function() {
                this._isLocked || this._out()
            }.bind(this),
            daum.maps.event.addListener(this, "click", this._clickHandler), daum.maps.event.addListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.addListener(this, "mouseout", this._mouseoutHandler)
    };
    ExtendsPolyline.prototype.unpick = function() {
        this._setVertexVisible(!1)
    };
    ExtendsPolyline.prototype.setHoverable = function(a) {
        a && (daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this)))
    };
    ExtendsPolyline.prototype.setVertexVisible = function(a) {
        this._setVertexVisible(a)
    };
    ExtendsPolyline.prototype.preventEvent = function(a) {
        this._isLocked = a;
        this._figureDraggable && this._figureDraggable.preventDrag(a);
        this._vertexDraggable && this._vertexDraggable.preventDrag(a);
        this._adderDraggable && this._adderDraggable.preventDrag(a)
    };
    ExtendsPolyline.prototype.getOrder = function() {
        return this._order
    };
    ExtendsPolyline.prototype.getDraggable = function() {
        return this._draggable
    };
    ExtendsPolyline.prototype.getEditable = function() {
        return this._editable
    };
    ExtendsPolyline.prototype.getVertices = function() {
        return this._vertices
    };
    ExtendsPolyline.prototype.remove = function() {
        this._remove();
        this.onChangeState.notify()
    };
    ExtendsPolyline.prototype.removeWithoutNotify = function() {
        this._remove()
    };
    ExtendsPolyline.prototype.setIndex = function(a) {
        this._index = a
    };
    ExtendsPolyline.prototype.getIndex = function() {
        return this._index
    };
    ExtendsPolyline.prototype.getStrokeWeight = function() {
        return this._strokeWeight
    };
    ExtendsPolyline.prototype.getStrokeColor = function() {
        return this._strokeColor
    };
    ExtendsPolyline.prototype.getStrokeOpacity = function() {
        return this._strokeOpacity
    };
    ExtendsPolyline.prototype.getStrokeStyle = function() {
        return this._strokeStyle
    };

    function ExtendsPolygon(a) {
        daum.maps.Polygon.call(this, a);
        this.onRemove = new Observable;
        this.onDrag = new Observable;
        this.onEdit = new Observable;
        this.onVertexHover = new Observable;
        this.onVertexAdderHover = new Observable;
        this.onHover = new Observable;
        this.onChangeState = new Observable;
        this._isLocked = !1;
        this._timeoutId = 0;
        this._closed = !0;
        this._isDraggingVertex = this._vertexVisible = !1;
        this._index = a.index;
        this._strokeWeight = a.strokeWeight;
        this._strokeOpacity = a.strokeOpacity;
        this._strokeColor = a.strokeColor;
        this._strokeStyle =
            a.strokeStyle;
        this._fillColor = a.fillColor;
        this._fillOpacity = a.fillOpacity;
        this._order = drawing.count++
    }
    drawing.inherits(ExtendsPolygon, daum.maps.Polygon);
    drawing.implement(ExtendsPolygon, ExtendsPolyline);
    ExtendsPolygon.prototype.getFillColor = function() {
        return this._fillColor
    };
    ExtendsPolygon.prototype.getFillOpacity = function() {
        return this._fillOpacity
    };

    function ExtendsRectangle(a) {
        daum.maps.Rectangle.call(this, a);
        this.onRemove = new Observable;
        this.onDrag = new Observable;
        this.onEdit = new Observable;
        this.onVertexHover = new Observable;
        this.onHover = new Observable;
        this.onChangeState = new Observable;
        this._isLocked = !1;
        this._timeoutId = 0;
        this._isDraggingVertex = this._vertexVisible = !1;
        this._index = a.index;
        this._strokeWeight = a.strokeWeight;
        this._strokeOpacity = a.strokeOpacity;
        this._strokeColor = a.strokeColor;
        this._strokeStyle = a.strokeStyle;
        this._fillColor = a.fillColor;
        this._fillOpacity = a.fillOpacity;
        this._order = drawing.count++
    }
    drawing.inherits(ExtendsRectangle, daum.maps.Rectangle);
    ExtendsRectangle.prototype._remove = function() {
        this._isLocked || (this._closeButton && this._closeButton.setMap(null), this._vertices && (this._vertices.forEach(function(a) {
            a.setMap(null)
        }), daum.maps.event.removeListener(this, "click", this._clickHandler), daum.maps.event.removeListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.removeListener(this, "mouseout", this._mouseoutHandler)), this.setMap(null), this.onRemove.notify(this._index))
    };
    ExtendsRectangle.prototype._dragstart = function() {
        this.onDrag.notify(!0)
    };
    ExtendsRectangle.prototype._drag = function(a) {
        var b = this.getBounds(),
            c = TO_COORDS(b.getSouthWest()),
            b = TO_COORDS(b.getNorthEast()),
            c = new daum.maps.CoordsBounds(new daum.maps.Coords(c.getX() - a.dx, c.getY() - a.dy), new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy));
        this.setBounds(c);
        this._closeButton && (c = TO_COORDS(this._closeButton.getPosition()), this._closeButton.setPosition(new daum.maps.Coords(c.getX() - a.dx, c.getY() - a.dy)));
        this._vertices && this._vertices.forEach(function(b) {
            var c = TO_COORDS(b.getPosition());
            b.setPosition(new daum.maps.Coords(c.getX() - a.dx, c.getY() - a.dy))
        })
    };
    ExtendsRectangle.prototype._dragend = function() {
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsRectangle.prototype._dragstartVertex = function(a) {
        this._closeButton && this._closeButton.setVisible(!1);
        this._vertices.forEach(function(b, c) {
            b.setVisible(c == a)
        });
        this._isDraggingVertex = !0
    };
    ExtendsRectangle.prototype._dragVertex = function(a, b) {
        var c = this._vertices,
            d = c[a],
            e = c[(a + 2) % 4],
            c = TO_COORDS(d.getPosition()),
            c = new daum.maps.Coords(c.getX() - b.dx, c.getY() - b.dy),
            e = TO_COORDS(e.getPosition()),
            e = new daum.maps.CoordsBounds(c, e);
        this.setBounds(e);
        d.setPosition(c)
    };
    ExtendsRectangle.prototype._dragInterVertex = function(a, b) {
        var c = this._vertices,
            d = c[a],
            e = c[(a - 2) % 4 + 4],
            f = TO_COORDS(d.getPosition()),
            f = new daum.maps.Coords(f.getX() - (a % 2 ? b.dx : 0), f.getY() - (a % 2 ? 0 : b.dy)),
            e = TO_COORDS(e.getPosition());
        d.setPosition(f);
        var d = TO_COORDS(c[(a - 1) % 4 + 4].getPosition()),
            g = TO_COORDS(c[(a - 3) % 4 + 4].getPosition()),
            c = new daum.maps.Coords(a % 2 ? f.getX() : d.getX(), a % 2 ? d.getY() : f.getY()),
            d = new daum.maps.Coords(a % 2 ? f.getX() : g.getX(), a % 2 ? g.getY() : f.getY()),
            f = new daum.maps.CoordsBounds(f, e);
        f.extend(c).extend(d);
        this.setBounds(f)
    };
    ExtendsRectangle.prototype._dragendVertex = function() {
        this._closeButton && (this._closeButton.setVisible(!0), this._updateCloseButtonPosition());
        this._setVerticesVisible(!0);
        this._updateVerticesPosition();
        this._isDraggingVertex = !1;
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsRectangle.prototype._hover = function() {
        clearTimeout(this._timeoutId)
    };
    ExtendsRectangle.prototype._out = function() {
        this._timeoutId = setTimeout(function() {
            !this._vertexVisible && !this._isDraggingVertex && this._setVerticesVisible(!1)
        }.bind(this), 100)
    };
    ExtendsRectangle.prototype._updateCloseButtonPosition = function() {
        var a = this.getBounds(),
            b = TO_COORDS(a.getSouthWest()),
            a = TO_COORDS(a.getNorthEast());
        this._closeButton.setPosition(new daum.maps.Coords(b.getX(), a.getY()))
    };
    ExtendsRectangle.prototype._updateVerticesPosition = function() {
        var a = this.getBounds(),
            b = TO_COORDS(a.getSouthWest()),
            c = TO_COORDS(a.getNorthEast()),
            a = b.getX(),
            d = c.getX(),
            c = c.getY(),
            b = b.getY(),
            e = [new daum.maps.Coords(a, c), new daum.maps.Coords(d, c), new daum.maps.Coords(d, b), new daum.maps.Coords(a, b), new daum.maps.Coords((a + d) / 2, c), new daum.maps.Coords(d, (c + b) / 2), new daum.maps.Coords((a + d) / 2, b), new daum.maps.Coords(a, (c + b) / 2)];
        this._vertices.forEach(function(a, b) {
            a.setPosition(e[b])
        })
    };
    ExtendsRectangle.prototype._setVertexVisible = function(a) {
        this._vertexVisible = a;
        this._setVerticesVisible(a)
    };
    ExtendsRectangle.prototype._setVerticesVisible = function(a) {
        this._vertices && this._vertices.forEach(function(b) {
            b.setVisible(a)
        }, this)
    };
    ExtendsRectangle.prototype.setRemovable = function(a) {
        if (a) {
            var b = this._closeButton = ComponentFactory.createCloseButton();
            b.setMap(this.getMap());
            daum.maps.event.addListener(this, "mouseover", function() {
                b.setZIndex(9999)
            });
            daum.maps.event.addListener(this, "mouseout", function() {
                b.setZIndex(1)
            });
            daum.maps.event.addListener(b, "click", this.remove.bind(this));
            this._updateCloseButtonPosition()
        }
    };
    ExtendsRectangle.prototype.setDraggable = function(a) {
        if (this._draggable = a) this._figureDraggable = UIDraggable({
            target: this,
            map: this.getMap(),
            callbacks: {
                dragstart: this._dragstart.bind(this),
                drag: this._drag.bind(this),
                dragend: this._dragend.bind(this)
            }
        })
    };
    ExtendsRectangle.prototype.setEditable = function(a) {
        if (this._editable = a) this._vertices = ComponentFactory.createVertices(8, this._strokeColor), this._updateVerticesPosition(), this._vertices.forEach(function(a, c) {
            var d = a.getContent();
            drawing.event.listen(d, "mousedown", function() {
                this.onDrag.notify(!0)
            }.bind(this));
            drawing.event.listen(d, "mouseover", function() {
                this._hover();
                this.onVertexHover.notify(a.getPosition())
            }.bind(this));
            drawing.event.listen(d, "mouseout", function() {
                this._out();
                this.onVertexHover.notify(null)
            }.bind(this));
            var e = c / 4 | 0 ? this._dragInterVertex.bind(this, c) : this._dragVertex.bind(this, c);
            this._vertexDraggable = UIDraggable({
                target: d,
                map: this.getMap(),
                callbacks: {
                    dragstart: this._dragstartVertex.bind(this, c),
                    drag: e,
                    dragend: this._dragendVertex.bind(this)
                }
            });
            a.setMap(this.getMap())
        }, this), this._clickHandler = function() {
            this._isLocked || (this._draggable || daum.maps.event.preventMap(), this._setVertexVisible(!0), this.onEdit.notify(this))
        }.bind(this), this._mouseoverHandler = function() {
            this._isLocked || (this._hover(), this._isDraggingVertex ||
                this._setVerticesVisible(!0))
        }.bind(this), this._mouseoutHandler = function() {
            this._isLocked || this._out()
        }.bind(this), daum.maps.event.addListener(this, "click", this._clickHandler), daum.maps.event.addListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.addListener(this, "mouseout", this._mouseoutHandler)
    };
    ExtendsRectangle.prototype.setHoverable = function(a) {
        a && (daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this)))
    };
    ExtendsRectangle.prototype.select = function() {
        this._setVertexVisible(!0)
    };
    ExtendsRectangle.prototype.unpick = function() {
        this._setVertexVisible(!1)
    };
    ExtendsRectangle.prototype.setVertexVisible = function(a) {
        this._setVertexVisible(a)
    };
    ExtendsRectangle.prototype.preventEvent = function(a) {
        this._isLocked = a;
        this._figureDraggable && this._figureDraggable.preventDrag(a);
        this._vertexDraggable && this._vertexDraggable.preventDrag(a)
    };
    ExtendsRectangle.prototype.getOrder = function() {
        return this._order
    };
    ExtendsRectangle.prototype.getDraggable = function() {
        return this._draggable
    };
    ExtendsRectangle.prototype.getEditable = function() {
        return this._editable
    };
    ExtendsRectangle.prototype.getVertices = function() {
        return this._vertices
    };
    ExtendsRectangle.prototype.remove = function() {
        this._remove();
        this.onChangeState.notify()
    };
    ExtendsRectangle.prototype.removeWithoutNotify = function() {
        this._remove()
    };
    ExtendsRectangle.prototype.setIndex = function(a) {
        this._index = a
    };
    ExtendsRectangle.prototype.getIndex = function() {
        return this._index
    };
    ExtendsRectangle.prototype.getStrokeWeight = function() {
        return this._strokeWeight
    };
    ExtendsRectangle.prototype.getStrokeColor = function() {
        return this._strokeColor
    };
    ExtendsRectangle.prototype.getStrokeOpacity = function() {
        return this._strokeOpacity
    };
    ExtendsRectangle.prototype.getStrokeStyle = function() {
        return this._strokeStyle
    };
    ExtendsRectangle.prototype.getFillColor = function() {
        return this._fillColor
    };
    ExtendsRectangle.prototype.getFillOpacity = function() {
        return this._fillOpacity
    };

    function ExtendsCircle(a) {
        daum.maps.Circle.call(this, a);
        this.onRemove = new Observable;
        this.onDrag = new Observable;
        this.onEdit = new Observable;
        this.onVertexHover = new Observable;
        this.onHover = new Observable;
        this.onChangeState = new Observable;
        this._isLocked = !1;
        this._timeoutId = 0;
        this._isDraggingVertex = this._vertexVisible = !1;
        this._index = a.index;
        this._strokeWeight = a.strokeWeight;
        this._strokeOpacity = a.strokeOpacity;
        this._strokeColor = a.strokeColor;
        this._strokeStyle = a.strokeStyle;
        this._fillColor = a.fillColor;
        this._fillOpacity =
            a.fillOpacity;
        this._order = drawing.count++
    }
    drawing.inherits(ExtendsCircle, daum.maps.Circle);
    ExtendsCircle.prototype._remove = function() {
        this._isLocked || (this._closeButton && this._closeButton.setMap(null), this._vertices && (this._vertices.forEach(function(a) {
            a.setMap(null)
        }), daum.maps.event.removeListener(this, "click", this._clickHandler), daum.maps.event.removeListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.removeListener(this, "mouseout", this._mouseoutHandler)), this.setMap(null), this.onRemove.notify(this._index))
    };
    ExtendsCircle.prototype._dragstart = function() {
        this.onDrag.notify(!0)
    };
    ExtendsCircle.prototype._drag = function(a) {
        var b = TO_COORDS(this.getPosition()),
            b = new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy);
        this.setPosition(b);
        this._closeButton && (b = TO_COORDS(this._closeButton.getPosition()), this._closeButton.setPosition(new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy)));
        this._vertices && this._vertices.forEach(function(b) {
            var d = TO_COORDS(b.getPosition());
            b.setPosition(new daum.maps.Coords(d.getX() - a.dx, d.getY() - a.dy))
        })
    };
    ExtendsCircle.prototype._dragend = function() {
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsCircle.prototype._dragstartVertex = function(a) {
        this._closeButton && this._closeButton.setVisible(!1);
        this._vertices.forEach(function(b, c) {
            b.setVisible(c == a)
        });
        this._isDraggingVertex = !0
    };
    ExtendsCircle.prototype._dragVertex = function(a, b) {
        var c = TO_COORDS(this.getPosition()),
            d = this._vertices,
            e = d[a],
            f = TO_COORDS(e.getPosition()),
            f = new daum.maps.Coords(f.getX() - b.dx, f.getY() - b.dy),
            g = a % 2 ? "getX" : "getY",
            f = c[g]() - f[g]();
        this.setRadius(0.4 * Math.abs(f));
        g = c.getX();
        c = c.getY();
        e.setPosition(new daum.maps.Coords(a % 2 ? g - f : g, a % 2 ? c : c - f));
        d[(a + 2) % 4].setPosition(new daum.maps.Coords(a % 2 ? g + f : g, a % 2 ? c : c + f));
        d[(a + 1) % 4].setPosition(new daum.maps.Coords(a % 2 ? g : g + f, a % 2 ? c + f : c));
        d[(a + 3) % 4].setPosition(new daum.maps.Coords(a %
            2 ? g : g - f, a % 2 ? c - f : c))
    };
    ExtendsCircle.prototype._dragendVertex = function() {
        this._closeButton && (this._closeButton.setVisible(!0), this._updateCloseButtonPosition());
        this._setVerticesVisible(!0);
        this._updateVerticesPosition();
        this._isDraggingVertex = !1;
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsCircle.prototype._hover = function() {
        clearTimeout(this._timeoutId)
    };
    ExtendsCircle.prototype._out = function() {
        this._timeoutId = setTimeout(function() {
            !this._vertexVisible && !this._isDraggingVertex && this._setVerticesVisible(!1)
        }.bind(this), 100)
    };
    ExtendsCircle.prototype._updateCloseButtonPosition = function() {
        this.getBounds().getSouthWest();
        var a = TO_COORDS(this.getPosition()),
            b = 2.5 * this.getRadius(),
            b = Math.sin(Math.PI / 4) * b;
        this._closeButton.setPosition(new daum.maps.Coords(-b + a.getX(), b + a.getY()))
    };
    ExtendsCircle.prototype._updateVerticesPosition = function() {
        var a = 2.5 * this.getRadius(),
            b = TO_COORDS(this.getPosition()),
            c = b.getX(),
            b = b.getY(),
            d = [new daum.maps.Coords(c, b + a), new daum.maps.Coords(c + a, b), new daum.maps.Coords(c, b - a), new daum.maps.Coords(c - a, b)];
        this._vertices.forEach(function(a, b) {
            a.setPosition(d[b])
        })
    };
    ExtendsCircle.prototype._setVertexVisible = function(a) {
        this._vertexVisible = a;
        this._editable && this._setVerticesVisible(a)
    };
    ExtendsCircle.prototype._setVerticesVisible = function(a) {
        this._vertices && this._vertices.forEach(function(b) {
            b.setVisible(a)
        }, this)
    };
    ExtendsCircle.prototype.setRemovable = function(a) {
        if (a) {
            var b = this._closeButton = ComponentFactory.createCloseButton();
            b.setMap(this.getMap());
            daum.maps.event.addListener(this, "mouseover", function() {
                b.setZIndex(9999)
            });
            daum.maps.event.addListener(this, "mouseout", function() {
                b.setZIndex(1)
            });
            daum.maps.event.addListener(b, "click", this.remove.bind(this));
            this._updateCloseButtonPosition()
        }
    };
    ExtendsCircle.prototype.setDraggable = function(a) {
        if (this._draggable = a) this._figureDraggable = UIDraggable({
            target: this,
            map: this.getMap(),
            callbacks: {
                dragstart: this._dragstart.bind(this),
                drag: this._drag.bind(this),
                dragend: this._dragend.bind(this)
            }
        }), daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this))
    };
    ExtendsCircle.prototype.setEditable = function(a) {
        if (this._editable = a) this._vertices = ComponentFactory.createVertices(4, this._strokeColor), this._updateVerticesPosition(), this._vertices.forEach(function(a, c) {
                var d = a.getContent();
                drawing.event.listen(d, "mousedown", function() {
                    this.onDrag.notify(!0)
                }.bind(this));
                drawing.event.listen(d, "mouseover", function() {
                    this._hover();
                    this.onVertexHover.notify(a.getPosition())
                }.bind(this));
                drawing.event.listen(d, "mouseout", function() {
                    this._out();
                    this.onVertexHover.notify(null)
                }.bind(this));
                this._vertexDraggable = UIDraggable({
                    target: d,
                    map: this.getMap(),
                    callbacks: {
                        dragstart: this._dragstartVertex.bind(this, c),
                        drag: this._dragVertex.bind(this, c),
                        dragend: this._dragendVertex.bind(this)
                    }
                });
                a.setMap(this.getMap())
            }, this), this._clickHandler = function() {
                this._isLocked || (this._draggable || daum.maps.event.preventMap(), this._setVertexVisible(!0), this.onEdit.notify(this))
            }.bind(this), this._mouseoverHandler = function() {
                this._isLocked || (this._hover(), this._isDraggingVertex || this._setVerticesVisible(!0))
            }.bind(this),
            this._mouseoutHandler = function() {
                this._isLocked || this._out()
            }.bind(this), daum.maps.event.addListener(this, "click", this._clickHandler), daum.maps.event.addListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.addListener(this, "mouseout", this._mouseoutHandler)
    };
    ExtendsCircle.prototype.setHoverable = function(a) {
        a && (daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this)))
    };
    ExtendsCircle.prototype.unpick = function() {
        this._setVertexVisible(!1)
    };
    ExtendsCircle.prototype.setVertexVisible = function(a) {
        this._setVertexVisible(a)
    };
    ExtendsCircle.prototype.preventEvent = function(a) {
        this._isLocked = a;
        this._figureDraggable && this._figureDraggable.preventDrag(a);
        this._vertexDraggable && this._vertexDraggable.preventDrag(a)
    };
    ExtendsCircle.prototype.getOrder = function() {
        return this._order
    };
    ExtendsCircle.prototype.getDraggable = function() {
        return this._draggable
    };
    ExtendsCircle.prototype.getEditable = function() {
        return this._editable
    };
    ExtendsCircle.prototype.getVertices = function() {
        return this._vertices
    };
    ExtendsCircle.prototype.remove = function() {
        this._remove();
        this.onChangeState.notify()
    };
    ExtendsCircle.prototype.removeWithoutNotify = function() {
        this._remove()
    };
    ExtendsCircle.prototype.setIndex = function(a) {
        this._index = a
    };
    ExtendsCircle.prototype.getIndex = function() {
        return this._index
    };
    ExtendsCircle.prototype.getStrokeWeight = function() {
        return this._strokeWeight
    };
    ExtendsCircle.prototype.getStrokeColor = function() {
        return this._strokeColor
    };
    ExtendsCircle.prototype.getStrokeOpacity = function() {
        return this._strokeOpacity
    };
    ExtendsCircle.prototype.getStrokeStyle = function() {
        return this._strokeStyle
    };
    ExtendsCircle.prototype.getFillColor = function() {
        return this._fillColor
    };
    ExtendsCircle.prototype.getFillOpacity = function() {
        return this._fillOpacity
    };

    function ExtendsEllipse(a) {
        daum.maps.Ellipse.call(this, a);
        this.onRemove = new Observable;
        this.onDrag = new Observable;
        this.onEdit = new Observable;
        this.onVertexHover = new Observable;
        this.onHover = new Observable;
        this.onChangeState = new Observable;
        this._isLocked = !1;
        this._timeoutId = 0;
        this._isDraggingVertex = this._vertexVisible = !1;
        this._index = a.index;
        this._strokeWeight = a.strokeWeight;
        this._strokeOpacity = a.strokeOpacity;
        this._strokeColor = a.strokeColor;
        this._strokeStyle = a.strokeStyle;
        this._fillColor = a.fillColor;
        this._fillOpacity = a.fillOpacity;
        this._order = drawing.count++
    }
    drawing.inherits(ExtendsEllipse, daum.maps.Ellipse);
    ExtendsEllipse.prototype._remove = function() {
        this._isLocked || (this._closeButton && this._closeButton.setMap(null), this._vertices && (this._vertices.forEach(function(a) {
            a.setMap(null)
        }), daum.maps.event.removeListener(this, "click", this._clickHandler), daum.maps.event.removeListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.removeListener(this, "mouseout", this._mouseoutHandler)), this.setMap(null), this.onRemove.notify(this._index))
    };
    ExtendsEllipse.prototype._dragstart = function() {
        this.onDrag.notify(!0)
    };
    ExtendsEllipse.prototype._drag = function(a) {
        var b = TO_COORDS(this.getPosition()),
            b = new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy);
        this.setPosition(b);
        this._closeButton && (b = TO_COORDS(this._closeButton.getPosition()), this._closeButton.setPosition(new daum.maps.Coords(b.getX() - a.dx, b.getY() - a.dy)));
        this._vertices && this._vertices.forEach(function(b) {
            var d = TO_COORDS(b.getPosition());
            b.setPosition(new daum.maps.Coords(d.getX() - a.dx, d.getY() - a.dy))
        })
    };
    ExtendsEllipse.prototype._dragend = function() {
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsEllipse.prototype._dragstartVertex = function(a) {
        this._closeButton && this._closeButton.setVisible(!1);
        this._vertices.forEach(function(b, c) {
            b.setVisible(c == a)
        });
        this._isDraggingVertex = !0
    };
    ExtendsEllipse.prototype._dragVertex = function(a, b) {
        var c = TO_COORDS(this.getPosition()),
            d = this._vertices,
            e = d[a],
            f = d[(a + 2) % 4],
            d = TO_COORDS(e.getPosition()),
            g = new daum.maps.Coords(d.getX() - b.dx, d.getY() - b.dy),
            f = TO_COORDS(f.getPosition());
        e.setPosition(g);
        this.setPosition(new daum.maps.Coords((g.getX() + f.getX()) / 2, (g.getY() + f.getY()) / 2));
        this.getRadius();
        e = c.getX() - d.getX() + b.dx / 2;
        c = c.getY() - d.getY() + b.dy / 2;
        this.setRadius(0.4 * Math.abs(e), 0.4 * Math.abs(c))
    };
    ExtendsEllipse.prototype._dragInterVertex = function(a, b) {
        var c = TO_COORDS(this.getPosition()),
            d = this._vertices,
            e = d[a],
            f = d[(a + 2) % 4],
            d = TO_COORDS(e.getPosition()),
            g = new daum.maps.Coords(d.getX() - (a % 2 ? b.dx : 0), d.getY() - (a % 2 ? 0 : b.dy)),
            f = TO_COORDS(f.getPosition());
        e.setPosition(g);
        this.setPosition(new daum.maps.Coords(a % 2 ? (g.getX() + f.getX()) / 2 : c.getX(), a % 2 ? c.getY() : (g.getY() + f.getY()) / 2));
        g = this.getRadius();
        e = a % 2 ? c.getX() - d.getX() + b.dx / 2 : 2.5 * g.rx;
        c = a % 2 ? 2.5 * g.ry : c.getY() - d.getY() + b.dy / 2;
        this.setRadius(0.4 * Math.abs(e),
            0.4 * Math.abs(c))
    };
    ExtendsEllipse.prototype._dragendVertex = function() {
        this._closeButton && (this._closeButton.setVisible(!0), this._updateCloseButtonPosition());
        this._setVerticesVisible(!0);
        this._updateVerticesPosition();
        this._isDraggingVertex = !1;
        this.onDrag.notify(!1);
        this.onChangeState.notify()
    };
    ExtendsEllipse.prototype._hover = function() {
        clearTimeout(this._timeoutId)
    };
    ExtendsEllipse.prototype._out = function() {
        this._timeoutId = setTimeout(function() {
            !this._vertexVisible && !this._isDraggingVertex && this._setVerticesVisible(!1)
        }.bind(this), 100)
    };
    ExtendsEllipse.prototype._updateCloseButtonPosition = function() {
        var a = TO_COORDS(this.getBounds().getSouthWest()),
            b = a.getX(),
            a = a.getY(),
            c = this.getRadius(),
            d = 2.5 * c.rx,
            c = 2.5 * c.ry,
            e = Math.atan2(c, -d);
        this._closeButton.setPosition(new daum.maps.Coords(d * Math.cos(e) + b + d, c * Math.sin(e) + a + c))
    };
    ExtendsEllipse.prototype._updateVerticesPosition = function() {
        var a = this.getBounds(),
            b = TO_COORDS(a.getSouthWest()),
            c = TO_COORDS(a.getNorthEast()),
            a = b.getX(),
            d = c.getX(),
            c = c.getY(),
            b = b.getY(),
            e = [new daum.maps.Coords(a, c), new daum.maps.Coords(d, c), new daum.maps.Coords(d, b), new daum.maps.Coords(a, b), new daum.maps.Coords((a + d) / 2, c), new daum.maps.Coords(d, (c + b) / 2), new daum.maps.Coords((a + d) / 2, b), new daum.maps.Coords(a, (c + b) / 2)];
        this._vertices.forEach(function(a, b) {
            a.setPosition(e[b])
        })
    };
    ExtendsEllipse.prototype._setVertexVisible = function(a) {
        this._vertexVisible = a;
        this._editable && this._setVerticesVisible(a)
    };
    ExtendsEllipse.prototype._setVerticesVisible = function(a) {
        this._vertices && this._vertices.forEach(function(b) {
            b.setVisible(a)
        }, this)
    };
    ExtendsEllipse.prototype.setRemovable = function(a) {
        if (a) {
            var b = this._closeButton = ComponentFactory.createCloseButton();
            b.setMap(this.getMap());
            daum.maps.event.addListener(this, "mouseover", function() {
                b.setZIndex(9999)
            });
            daum.maps.event.addListener(this, "mouseout", function() {
                b.setZIndex(1)
            });
            daum.maps.event.addListener(b, "click", this.remove.bind(this));
            this._updateCloseButtonPosition()
        }
    };
    ExtendsEllipse.prototype.preventEvent = function(a) {
        this._isLocked = a;
        this._figureDraggable && this._figureDraggable.preventDrag(a);
        this._vertexDraggable && this._vertexDraggable.preventDrag(a)
    };
    ExtendsEllipse.prototype.setDraggable = function(a) {
        if (this._draggable = a) this._figureDraggable = UIDraggable({
            target: this,
            map: this.getMap(),
            callbacks: {
                dragstart: this._dragstart.bind(this),
                drag: this._drag.bind(this),
                dragend: this._dragend.bind(this)
            }
        }), daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this))
    };
    ExtendsEllipse.prototype.setEditable = function(a) {
        if (this._editable = a) this._vertices = ComponentFactory.createVertices(8, this._strokeColor), this._updateVerticesPosition(), this._vertices.forEach(function(a, c) {
            var d = a.getContent();
            drawing.event.listen(d, "mousedown", function() {
                this.onDrag.notify(!0)
            }.bind(this));
            drawing.event.listen(d, "mouseover", function() {
                this._hover();
                this.onVertexHover.notify(a.getPosition())
            }.bind(this));
            drawing.event.listen(d, "mouseout", function() {
                this._out();
                this.onVertexHover.notify(null)
            }.bind(this));
            var e = c / 4 | 0 ? this._dragInterVertex.bind(this, c) : this._dragVertex.bind(this, c);
            this._vertexDraggable = UIDraggable({
                target: d,
                map: this.getMap(),
                callbacks: {
                    dragstart: this._dragstartVertex.bind(this, c),
                    drag: e,
                    dragend: this._dragendVertex.bind(this)
                }
            });
            a.setMap(this.getMap())
        }, this), this._clickHandler = function() {
            this._isLocked || (this._draggable || daum.maps.event.preventMap(), this._setVertexVisible(!0), this.onEdit.notify(this))
        }.bind(this), this._mouseoverHandler = function() {
            this._isLocked || (this._hover(), this._isDraggingVertex ||
                this._setVerticesVisible(!0))
        }.bind(this), this._mouseoutHandler = function() {
            this._isLocked || this._out()
        }.bind(this), daum.maps.event.addListener(this, "click", this._clickHandler), daum.maps.event.addListener(this, "mouseover", this._mouseoverHandler), daum.maps.event.addListener(this, "mouseout", this._mouseoutHandler)
    };
    ExtendsEllipse.prototype.setHoverable = function(a) {
        a && (daum.maps.event.addListener(this, "mouseover", function() {
            this._isLocked || this.onHover.notify(!0)
        }.bind(this)), daum.maps.event.addListener(this, "mouseout", function() {
            this._isLocked || this.onHover.notify(!1)
        }.bind(this)))
    };
    ExtendsEllipse.prototype.unpick = function() {
        this._setVertexVisible(!1)
    };
    ExtendsEllipse.prototype.setVertexVisible = function(a) {
        this._setVertexVisible(a)
    };
    ExtendsEllipse.prototype.getOrder = function() {
        return this._order
    };
    ExtendsEllipse.prototype.getDraggable = function() {
        return this._draggable
    };
    ExtendsEllipse.prototype.getEditable = function() {
        return this._editable
    };
    ExtendsEllipse.prototype.getVertices = function() {
        return this._vertices
    };
    ExtendsEllipse.prototype.remove = function() {
        this._remove();
        this.onChangeState.notify()
    };
    ExtendsEllipse.prototype.removeWithoutNotify = function() {
        this._remove()
    };
    ExtendsEllipse.prototype.setIndex = function(a) {
        this._index = a
    };
    ExtendsEllipse.prototype.getIndex = function() {
        return this._index
    };
    ExtendsEllipse.prototype.getStrokeWeight = function() {
        return this._strokeWeight
    };
    ExtendsEllipse.prototype.getStrokeColor = function() {
        return this._strokeColor
    };
    ExtendsEllipse.prototype.getStrokeOpacity = function() {
        return this._strokeOpacity
    };
    ExtendsEllipse.prototype.getStrokeStyle = function() {
        return this._strokeStyle
    };
    ExtendsEllipse.prototype.getFillColor = function() {
        return this._fillColor
    };
    ExtendsEllipse.prototype.getFillOpacity = function() {
        return this._fillOpacity
    };

    function ToolButton(a) {
        EventLinker.call(this);
        this._type = a.type;
        this._createElement(a.isLast);
        drawing.event.listen(this._element, "click", this._click, this);
        drawing.event.listen(this._element, "mouseover", this._mouseOver, this);
        drawing.event.listen(this._element, "mouseout", this._mouseOut, this)
    }
    drawing.inherits(ToolButton, EventLinker);
    ToolButton.HD = 1 < window.devicePixelRatio;
    ToolButton.BG_BASE_URL = PROTOCOL + "//i1.daumcdn.net/localimg/localimages/07/mapjsapi/";
    ToolButton.BG_URL = ToolButton.HD ? ToolButton.BG_BASE_URL + "2x/toolbox.png" : ToolButton.BG_BASE_URL + "toolbox.png";
    ToolButton.BG_POSITION = {
        MARKER: "0 -180px",
        POLYLINE: "0 0",
        ARROW: "0 -150px",
        CIRCLE: "0 -29px",
        ELLIPSE: "0 -119px",
        RECTANGLE: "0 -60px",
        POLYGON: "0 -90px"
    };
    ToolButton.BG_POSITION_ON = {
        MARKER: "-30px -180px",
        POLYLINE: "-30px 0",
        ARROW: "-30px -150px",
        CIRCLE: "-30px -29px",
        ELLIPSE: "-30px -119px",
        RECTANGLE: "-30px -60px",
        POLYGON: "-30px -90px"
    };
    ToolButton.prototype._createElement = function(a) {
        var b = this._element = document.createElement("a"),
            c = this._tool = document.createElement("span"),
            d = this._type.toUpperCase();
        b.href = "javascript:void(0)";
        b.style.cssText = "float:left;" + (a ? "" : "border-right:1px solid #b3b3b1;");
        c.style.cssText = "display:block;width:20px;height:" + ("MARKER" === d ? "28px" : "20px") + ";margin:" + ("MARKER" === d ? "3px 7px 3px 7px" : "7px") + (a ? ";margin-right:8px" : "") + ";background-image:url(" + ToolButton.BG_URL + ");background-position:" + ToolButton.BG_POSITION[d] +
            (ToolButton.HD ? ";background-size:50px 208px" : ";");
        this.selected(!1);
        b.appendChild(c)
    };
    ToolButton.prototype.getElement = function() {
        return this._element
    };
    ToolButton.prototype.selected = function(a) {
        var b = this._type.toUpperCase();
        this._tool.style.backgroundPosition = a ? ToolButton.BG_POSITION_ON[b] : ToolButton.BG_POSITION[b]
    };
    ToolButton.prototype._click = function() {
        this._dispatchEvent("click", this._type)
    };
    ToolButton.prototype._mouseOver = function() {
        this._element.style.backgroundColor = "#ddd"
    };
    ToolButton.prototype._mouseOut = function() {
        this._element.style.backgroundColor = "transparent"
    };
    ToolButton.prototype.getType = function() {
        return this._type
    };

    function Toolbox(a) {
        a = a || {};
        this._tool = [];
        this._selected = null;
        this._setDrawingManager(a.drawingManager || null)
    }
    Toolbox.prototype._createElement = function(a) {
        var b = this._element = document.createElement("div"),
            c = a.length;
        b.style.cssText = "display:absolute;width:" + 35 * c + "px;height:34px;overflow:hidden;background-color:#fff;padding:0;margin:0;list-style:none;" + ("ActiveXObject" in window && !window.HTMLCanvasElement ? "border: 1px solid #b3b3b1;" : "box-shadow: 0 1px 2px #999;border-radius: 3px;");
        a.forEach(function(a, e) {
            var f = new ToolButton({
                type: a,
                isLast: e === c - 1
            });
            b.appendChild(f.getElement());
            f.addListener("click", this._clicked,
                this);
            this._tool.push(f)
        }, this)
    };
    Toolbox.prototype._setDrawingManager = function(a) {
        this._manager != a && (this._manager && (this._manager.removeListener("drawend", this._drawEndHandler), this._manager.removeListener("cancel", this._cancelHandler), this._manager.removeListener("select", this._selectHandler)), a && (!this._element && this._createElement(a.getModes()), a.addListener("drawend", this._drawEndHandler, this), a.addListener("cancel", this._cancelHandler, this), a.addListener("select", this._selectHandler, this)), this._manager = a)
    };
    Toolbox.prototype.getElement = function() {
        return this._element
    };
    Toolbox.prototype._drawEndHandler = function(a) {
        this._selectToolbutton(!1, a.overlayType)
    };
    Toolbox.prototype._cancelHandler = function(a) {
        a = a.overlayType;
        this._selected && this._selectToolbutton(!1, a)
    };
    Toolbox.prototype._selectHandler = function(a) {
        this._selectToolbutton(!0, a.overlayType)
    };
    Toolbox.prototype._selectToolbutton = function(a, b) {
        this._tool.forEach(function(c) {
            c.getType() === b ? (c.selected(a), this._selected = a ? b : null) : c.selected(!1)
        }, this)
    };
    Toolbox.prototype._clicked = function(a) {
        var b = this._selected === a;
        this._manager && (b ? this._manager.cancel() : this._manager.select(a))
    };

    function PolylineController(a, b, c) {
        EventLinker.call(this);
        this.onCursorChange = new Observable;
        this._map = a;
        this._guideTooltip = c;
        this._figures = [];
        this._index = 0;
        this._setOptions(b);
        a = this._startVertex = ComponentFactory.createVertex();
        this._setOnVertex(a, "start");
        a = this._endVertex = ComponentFactory.createVertex();
        this._setOnVertex(a, "end")
    }
    drawing.inherits(PolylineController, EventLinker);
    PolylineController.prototype._setOnVertex = function(a, b) {
        var c = a.getContent();
        drawing.event.listen(c, "click", this._done.bind(this, b));
        drawing.event.listen(c, "dblclick", this._done.bind(this, b))
    };
    PolylineController.prototype._select = function() {
        var a = this._map;
        this.onCursorChange.notify("crosshair");
        this._startHandler = this._start.bind(this);
        daum.maps.event.addListener(a, "click", this._startHandler);
        this._dispatchEvent("select")
    };
    PolylineController.prototype._setOptions = function(a) {
        this._draggable = a.draggable || Default.draggable;
        this._removable = a.removable || Default.removable;
        this._editable = a.editable || Default.editable;
        this._zIndex = a.zIndex || Default.zIndex;
        this._strokeWeight = a.strokeWeight || Default.strokeWeight;
        this._strokeColor = a.strokeColor || Default.strokeColor;
        this._strokeOpacity = a.strokeOpacity || Default.strokeOpacity;
        this._strokeStyle = a.strokeStyle || Default.strokeStyle;
        this._fillColor = a.fillColor || Default.fillColor;
        this._fillOpacity =
            a.fillOpacity || Default.fillOpacity;
        this._hintStrokeOpacity = a.hintStrokeOpacity || 0.5 * Default.strokeOpacity;
        this._hintStrokeStyle = a.hintStrokeStyle || Default.strokeStyle;
        this._hintFillOpacity = a.hintFillOpacity || Default.fillOpacity
    };
    PolylineController.prototype._start = function(a) {
        var b = this._map,
            c = this._startCoords = this._endCoords = GET_COORDS(a),
            d = this._startVertex,
            e = this._endVertex;
        d.setPosition(c);
        e.setPosition(c);
        d.setMap(b);
        e.setMap(b);
        this._path = [c];
        this._closed && (this._hintArea = new daum.maps.Polygon({
            map: b,
            path: this._path,
            strokeOpacity: 0,
            fillColor: this._fillColor,
            fillOpacity: this._hintFillOpacity || this._fillOpacity
        }));
        this._track = new daum.maps.Polyline({
            map: b,
            path: this._path,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            startArrow: this._hasStartArrow
        });
        this._hint = new daum.maps.Polyline({
            map: b,
            path: [c],
            strokeWeight: this._strokeWeight,
            strokeColor: this._strokeColor,
            strokeOpacity: this._hintStrokeOpacity || this._strokeOpacity,
            strokeStyle: this._hintStrokeStyle || this._strokeStyle,
            endArrow: this._hasEndArrow
        });
        daum.maps.event.removeListener(b, "click", this._startHandler);
        this._startHandler = null;
        this._drawHandler = this._draw.bind(this);
        this._drawHintHandler = this._drawHint.bind(this);
        daum.maps.event.addListener(b, "click", this._drawHandler);
        daum.maps.event.addListener(b, "mousemove", this._drawHintHandler);
        this._dispatchEvent("drawstart", {
            coords: c,
            point: a.point
        })
    };
    PolylineController.prototype._drawHint = function(a) {
        var b = GET_COORDS(a);
        this._closed && this._hintArea.setPath(this._path.concat(b));
        this._hint.setPath([this._endCoords, b]);
        this._dispatchEvent("draw", {
            coords: b,
            point: a.point
        })
    };
    PolylineController.prototype._draw = function(a) {
        daum.maps.event.preventMap();
        var b = GET_COORDS(a);
        this._path.push(b);
        this._track.setPath(this._path);
        this._endVertex.setPosition(b);
        this._endCoords = b;
        this._endPoint = a.point;
        this._dispatchEvent("drawnext", {
            coords: b,
            point: a.point
        })
    };
    PolylineController.prototype._done = function(a) {
        daum.maps.event.preventMap();
        if (!this._isDone) {
            this._isDone = !0;
            setTimeout(function() {
                this._isDone = !1
            }.bind(this), 0);
            var b = this._startVertex,
                c = this._endVertex;
            if (b.getPosition() == c.getPosition()) this._cancel();
            else {
                "start" == a && !this._closed && this._path.push(this._path[0]);
                this._track.setMap(null);
                this._hint.setMap(null);
                this._hint = this._track = null;
                this._closed && (this._hintArea.setMap(null), this._hintArea = null);
                b.setMap(null);
                c.setMap(null);
                var d = this._map,
                    e = new(this._closed ? ExtendsPolygon : ExtendsPolyline)({
                        map: d,
                        index: this._index,
                        path: this._path,
                        removable: this._removable,
                        draggable: this._draggable,
                        strokeWeight: this._strokeWeight,
                        strokeOpacity: this._strokeOpacity,
                        strokeColor: this._strokeColor,
                        strokeStyle: this._strokeStyle,
                        fillColor: this._fillColor,
                        fillOpacity: this._fillOpacity,
                        startArrow: this._hasStartArrow,
                        endArrow: this._hasEndArrow
                    });
                e.onRemove.add(this._remove, this);
                e.setRemovable(this._removable);
                e.setDraggable(this._draggable);
                e.setEditable(this._editable);
                e.setHoverable(this._draggable || this._editable);
                this._figures.push(e);
                this._index++;
                daum.maps.event.removeListener(d, "click", this._drawHandler);
                daum.maps.event.removeListener(d, "mousemove", this._drawHintHandler);
                this._drawHintHandler = this._drawHandler = null;
                d = d.getProjection();
                a = "start" == a ? b.getPosition() : c.getPosition();
                b = d.pointFromCoords(a);
                this._dispatchEvent("drawend", {
                    coords: a,
                    point: b,
                    target: e
                });
                this.onCursorChange.notify(null)
            }
        }
    };
    PolylineController.prototype._cancel = function() {
        var a = this._map;
        this._track && (this._track.setMap(null), this._hint.setMap(null), this._hint = this._track = null, this._closed && (this._hintArea.setMap(null), this._hintArea = null), this._startVertex.setMap(null), this._endVertex.setMap(null));
        this._startHandler && (daum.maps.event.removeListener(a, "click", this._startHandler), this._startHandler = null);
        this._drawHandler && (daum.maps.event.removeListener(a, "click", this._drawHandler), daum.maps.event.removeListener(a, "mousemove",
            this._drawHintHandler), this._drawHintHandler = this._drawHandler = null);
        this.onCursorChange.notify(null);
        this._dispatchEvent("cancel")
    };
    PolylineController.prototype._remove = function(a) {
        this._figures.forEach(function(b, c) {
            if (b == a || c == a) this._figures.splice(c, 1), this._figures.forEach(function(a, b) {
                a.setIndex(b)
            }), this._index--
        }, this);
        this._dispatchEvent("remove")
    };
    PolylineController.prototype.select = function() {
        this._select()
    };
    PolylineController.prototype.cancel = function() {
        this._cancel()
    };
    PolylineController.prototype.remove = function(a) {
        this._figures.forEach(function(b, c) {
            (b == a || c == a) && b.remove()
        }, this)
    };
    PolylineController.prototype.setStyle = function(a, b) {
        this["_" + a] = b
    };
    PolylineController.prototype.get = function(a) {
        return this["_" + a]
    };
    PolylineController.prototype.getObjects = function() {
        return this._figures
    };
    PolylineController.prototype.getData = function() {
        var a = this._hasEndArrow ? "arrow" : this._closed ? "polygon" : "polyline",
            b = [];
        this._figures.forEach(function(c) {
            var d = c.getPath().map(TO_XY),
                d = {
                    type: a,
                    points: d,
                    coordinate: GET_COORD_SYSTEM(),
                    options: {
                        strokeColor: c.getStrokeColor(),
                        strokeWeight: c.getStrokeWeight(),
                        strokeStyle: c.getStrokeStyle(),
                        strokeOpacity: c.getStrokeOpacity()
                    }
                };
            this._closed && (d.options.fillColor = c.getFillColor(), d.options.fillOpacity = c.getFillOpacity());
            this._hasStartArrow && (d.options.startArrow = !0);
            this._hasEndArrow && (d.options.endArrow = !0);
            b.push(d)
        }, this);
        return b
    };
    PolylineController.prototype.getState = function() {
        var a = this.getData();
        this._figures.forEach(function(b, c) {
            drawing.merge(a[c], {
                order: b.getOrder(),
                removable: this._removable,
                draggable: this._draggable,
                editable: this._editable
            })
        }, this);
        return a
    };
    PolylineController.prototype.clear = function(a) {
        this._cancel();
        for (var b = this._figures.length - 1; 0 <= b; b--) a ? this._figures[b].removeWithoutNotify() : this._figures[b].remove();
        this._index = 0;
        this._figures = [];
        this._figures.length = 0
    };
    PolylineController.prototype.put = function(a, b) {
        var c = {
            map: this._map,
            index: this._index++,
            path: a,
            removable: this._removable,
            draggable: this._draggable,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            fillColor: this._fillColor,
            fillOpacity: this._fillOpacity,
            startArrow: this._hasStartArrow,
            endArrow: this._hasEndArrow
        };
        drawing.merge(c, b);
        c = new(this._closed ? ExtendsPolygon : ExtendsPolyline)(c);
        c.onRemove.add(this._remove, this);
        c.setRemovable(this._removable);
        c.setDraggable(this._draggable);
        c.setEditable(this._editable);
        c.setHoverable(this._draggable || this._editable);
        c.setVertexVisible(!1);
        this._figures.push(c);
        this._dispatchEvent("put", {
            target: c
        })
    };

    function PolygonController(a, b) {
        PolylineController.call(this, a, b)
    }
    drawing.inherits(PolygonController, PolylineController);
    PolygonController.prototype._closed = !0;

    function ArrowController(a, b) {
        PolylineController.call(this, a, b);
        this._hasStartArrow = b.startArrow
    }
    drawing.inherits(ArrowController, PolylineController);
    ArrowController.prototype._hasEndArrow = !0;

    function CircleController(a, b) {
        EventLinker.call(this);
        this.onCursorChange = new Observable;
        this._map = a;
        this._figures = [];
        this._index = 0;
        this._setOptions(b)
    }
    drawing.inherits(CircleController, EventLinker);
    CircleController.prototype._setOptions = function(a) {
        this._draggable = a.draggable || Default.draggable;
        this._removable = a.removable || Default.removable;
        this._editable = a.editable || Default.editable;
        this._zIndex = a.zIndex || Default.zIndex;
        this._strokeWeight = a.strokeWeight || Default.strokeWeight;
        this._strokeColor = a.strokeColor || Default.strokeColor;
        this._strokeOpacity = a.strokeOpacity || Default.strokeOpacity;
        this._strokeStyle = a.strokeStyle || Default.strokeStyle;
        this._fillColor = a.fillColor || Default.fillColor;
        this._fillOpacity =
            a.fillOpacity || Default.fillOpacity
    };
    CircleController.prototype._select = function() {
        var a = this._map;
        this.onCursorChange.notify("crosshair");
        this._startHandler = this._start.bind(this);
        daum.maps.event.addListener(a, "click", this._startHandler);
        this._dispatchEvent("select")
    };
    CircleController.prototype._start = function(a) {
        var b = this._map,
            c = this._startCoords = GET_COORDS(a);
        this._circle = new(this._isOval ? ExtendsEllipse : ExtendsCircle)({
            map: b,
            index: this._index,
            center: c,
            radius: 0,
            rx: 0,
            ry: 0,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            fillColor: this._fillColor,
            fillOpacity: this._fillOpacity
        });
        daum.maps.event.removeListener(b, "click", this._startHandler);
        this._startHandler = null;
        this._drawHandler = this._draw.bind(this);
        this._doneHandler = this._done.bind(this);
        daum.maps.event.addListener(b, "click", this._doneHandler);
        daum.maps.event.addListener(b, "mousemove", this._drawHandler);
        this._dispatchEvent("drawstart", {
            coords: c,
            point: a.point
        })
    };
    CircleController.prototype._draw = function(a) {
        var b = this._startCoords,
            c = GET_COORDS(a),
            d = (b.getX() - c.getX()) / 2.5,
            b = (b.getY() - c.getY()) / 2.5;
        this._circle.setRadius(Math.sqrt(Math.pow(d, 2) + Math.pow(b, 2)));
        this._dispatchEvent("draw", {
            coords: c,
            point: a.point
        })
    };
    CircleController.prototype._done = function(a) {
        var b = this._map,
            c = this._circle;
        c.onRemove.add(this._remove, this);
        c.setRemovable(this._removable);
        c.setDraggable(this._draggable);
        c.setEditable(this._editable);
        c.setHoverable(this._draggable || this._editable);
        c.setVertexVisible(!0);
        this._figures.push(c);
        this._circle = null;
        this._index++;
        daum.maps.event.removeListener(b, "click", this._doneHandler);
        daum.maps.event.removeListener(b, "mousemove", this._drawHandler);
        this._drawHandler = this._doneHandler = null;
        this._dispatchEvent("drawend", {
            coords: GET_COORDS(a),
            point: a.point,
            target: c
        });
        this.onCursorChange.notify(null)
    };
    CircleController.prototype._cancel = function() {
        var a = this._map;
        this._circle && (this._circle.setMap(null), this._circle = null);
        this._startHandler && (daum.maps.event.removeListener(a, "click", this._startHandler), this._startHandler = null);
        this._drawHandler && (daum.maps.event.removeListener(a, "mousemove", this._drawHandler), daum.maps.event.removeListener(a, "click", this._doneHandler), this._doneHandler = this._drawHandler = null);
        this.onCursorChange.notify(null);
        this._dispatchEvent("cancel")
    };
    CircleController.prototype._remove = function(a) {
        this._figures.forEach(function(b, c) {
            if (b == a || c == a) b.setMap(null), this._figures.splice(c, 1), this._figures.forEach(function(a, b) {
                a.setIndex(b)
            }), this._index--
        }, this);
        this._dispatchEvent("remove")
    };
    CircleController.prototype.select = function() {
        this._select()
    };
    CircleController.prototype.cancel = function() {
        this._cancel()
    };
    CircleController.prototype.remove = function(a) {
        this._remove(a)
    };
    CircleController.prototype.setStyle = function(a, b) {
        this["_" + a] = b
    };
    CircleController.prototype.get = function(a) {
        return this["_" + a]
    };
    CircleController.prototype.getObjects = function() {
        return this._figures
    };
    CircleController.prototype.getData = function() {
        var a = [];
        this._figures.forEach(function(b) {
            var c = b.getBounds(),
                d = TO_XY(c.getSouthWest()),
                e = TO_XY(c.getNorthEast()),
                f = TO_XY(b.getPosition()),
                c = b.getRadius(),
                b = {
                    type: this._isOval ? "ellipse" : "circle",
                    sPoint: d,
                    ePoint: e,
                    center: f,
                    coordinate: GET_COORD_SYSTEM(),
                    options: {
                        strokeColor: b.getStrokeColor(),
                        strokeWeight: b.getStrokeWeight(),
                        strokeStyle: b.getStrokeStyle(),
                        strokeOpacity: b.getStrokeOpacity(),
                        fillColor: b.getFillColor(),
                        fillOpacity: b.getFillOpacity()
                    }
                };
            this._isOval ?
                (b.rx = c.rx, b.ry = c.ry) : b.radius = c;
            a.push(b)
        }, this);
        return a
    };
    CircleController.prototype.getState = function() {
        var a = this.getData();
        this._figures.forEach(function(b, c) {
            drawing.merge(a[c], {
                order: b.getOrder(),
                removable: this._removable,
                draggable: this._draggable,
                editable: this._editable
            })
        }, this);
        return a
    };
    CircleController.prototype.clear = function(a) {
        this._cancel();
        for (var b = this._figures.length - 1; 0 <= b; b--) a ? this._figures[b].removeWithoutNotify() : this._figures[b].remove();
        this._index = 0;
        this._figures = [];
        this._figures.length = 0
    };
    CircleController.prototype.put = function(a, b, c) {
        a = {
            map: this._map,
            index: this._index++,
            center: a,
            radius: b,
            rx: 0,
            ry: 0,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            fillColor: this._fillColor,
            fillOpacity: this._fillOpacity
        };
        drawing.merge(a, c);
        c = new ExtendsCircle(a);
        c.onRemove.add(this._remove, this);
        c.setRemovable(this._removable);
        c.setDraggable(this._draggable);
        c.setEditable(this._editable);
        c.setHoverable(this._draggable || this._editable);
        c.setVertexVisible(!1);
        this._figures.push(c);
        this._dispatchEvent("put", {
            target: c
        })
    };

    function EllipseController(a, b) {
        CircleController.call(this, a, b)
    }
    drawing.inherits(EllipseController, CircleController);
    EllipseController.prototype._isOval = !0;
    EllipseController.prototype._draw = function(a) {
        var b = this._circle.getProjection(),
            c = this._startCoords,
            d = GET_COORDS(a),
            e = b.pointFromCoords(c),
            f = b.pointFromCoords(d),
            b = Math.abs(e.x - f.x) / 2,
            e = Math.abs(e.y - f.y) / 2,
            f = Math.pow(2, this._map.getLevel() - 3),
            c = new daum.maps.Coords((c.getX() + d.getX()) / 2, (c.getY() + d.getY()) / 2);
        this._circle.setPosition(c);
        this._circle.setRadius(b * f, e * f);
        this._dispatchEvent("draw", {
            coords: d,
            point: a.point
        })
    };
    EllipseController.prototype.put = function(a, b, c, d) {
        var e;
        a instanceof daum.maps.CoordsBounds || a instanceof daum.maps.LatLngBounds ? (e = TO_COORDS(a.getSouthWest()), a = TO_COORDS(a.getNorthEast()), b = Math.abs(e.getX() - a.getX()) / 5, c = Math.abs(e.getY() - a.getY()) / 5, e = new daum.maps.Coords((e.getX() + a.getX()) / 2, (e.getY() + a.getY()) / 2)) : e = a;
        b = {
            map: this._map,
            index: this._index++,
            center: e,
            rx: b,
            ry: c,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            fillColor: this._fillColor,
            fillOpacity: this._fillOpacity
        };
        drawing.merge(b, d);
        d = new ExtendsEllipse(b);
        d.onRemove.add(this._remove, this);
        d.setRemovable(this._removable);
        d.setDraggable(this._draggable);
        d.setEditable(this._editable);
        d.setHoverable(this._draggable || this._editable);
        d.setVertexVisible(!1);
        this._figures.push(d);
        this._dispatchEvent("put", {
            target: d
        })
    };

    function RectangleController(a, b) {
        EventLinker.call(this);
        this.onCursorChange = new Observable;
        this._map = a;
        this._figures = [];
        this._index = 0;
        this._setOptions(b)
    }
    drawing.inherits(RectangleController, EventLinker);
    RectangleController.prototype._setOptions = function(a) {
        this._draggable = a.draggable || Default.draggable;
        this._removable = a.removable || Default.removable;
        this._editable = a.editable || Default.editable;
        this._zIndex = a.zIndex || Default.zIndex;
        this._strokeWeight = a.strokeWeight || Default.strokeWeight;
        this._strokeColor = a.strokeColor || Default.strokeColor;
        this._strokeOpacity = a.strokeOpacity || Default.strokeOpacity;
        this._strokeStyle = a.strokeStyle || Default.strokeStyle;
        this._fillColor = a.fillColor || Default.fillColor;
        this._fillOpacity =
            a.fillOpacity || Default.fillOpacity
    };
    RectangleController.prototype._select = function() {
        var a = this._map;
        this.onCursorChange.notify("crosshair");
        this._startHandler = this._start.bind(this);
        daum.maps.event.addListener(a, "click", this._startHandler);
        this._dispatchEvent("select")
    };
    RectangleController.prototype._start = function(a) {
        var b = this._startCoords = GET_COORDS(a);
        this._rect = new ExtendsRectangle({
            map: this._map,
            index: this._index,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            fillColor: this._fillColor,
            fillOpacity: this._fillOpacity
        });
        daum.maps.event.removeListener(this._map, "click", this._startHandler);
        this._startHandler = null;
        this._drawHandler = this._draw.bind(this);
        this._doneHandler = this._done.bind(this);
        daum.maps.event.addListener(this._map, "mousemove", this._drawHandler);
        daum.maps.event.addListener(this._map, "click", this._doneHandler);
        this._dispatchEvent("drawstart", {
            coords: b,
            point: a.point
        })
    };
    RectangleController.prototype._draw = function(a) {
        var b = GET_COORDS(a);
        this._rect.setBounds(new daum.maps.CoordsBounds(this._startCoords, b));
        this._dispatchEvent("draw", {
            coords: b,
            point: a.point
        })
    };
    RectangleController.prototype._done = function(a) {
        var b = this._map,
            c = this._rect;
        c.onRemove.add(this._remove, this);
        c.setRemovable(this._removable, c.getBounds().getNorthEast());
        c.setDraggable(this._draggable);
        c.setEditable(this._editable);
        c.setHoverable(this._draggable || this._editable);
        this._figures.push(c);
        this._rect = null;
        this._index++;
        daum.maps.event.removeListener(b, "mousemove", this._drawHandler);
        daum.maps.event.removeListener(b, "click", this._doneHandler);
        this._doneHandler = this._drawHandler = null;
        this.onCursorChange.notify(null);
        this._dispatchEvent("drawend", {
            coords: GET_COORDS(a),
            point: a.point,
            target: c
        })
    };
    RectangleController.prototype._cancel = function() {
        var a = this._map;
        this._rect && (this._rect.setMap(null), this._rect = null);
        this._startHandler && (daum.maps.event.removeListener(a, "click", this._startHandler), this._startHandler = null);
        this._drawHandler && (daum.maps.event.removeListener(a, "mousemove", this._drawHandler), daum.maps.event.removeListener(a, "click", this._doneHandler), this._doneHandler = this._drawHandler = null);
        this.onCursorChange.notify(null);
        this._dispatchEvent("cancel")
    };
    RectangleController.prototype._remove = function(a) {
        this._figures.forEach(function(b, c) {
            if (b == a || c == a) b.setMap(null), this._figures.splice(c, 1), this._figures.forEach(function(a, b) {
                a.setIndex(b)
            }), this._index--
        }, this);
        this._dispatchEvent("remove")
    };
    RectangleController.prototype.select = function() {
        this._select()
    };
    RectangleController.prototype.cancel = function() {
        this._cancel()
    };
    RectangleController.prototype.remove = function(a) {
        this._remove(a)
    };
    RectangleController.prototype.setStyle = function(a, b) {
        this["_" + a] = b
    };
    RectangleController.prototype.get = function(a) {
        return this["_" + a]
    };
    RectangleController.prototype.getObjects = function() {
        return this._figures
    };
    RectangleController.prototype.getData = function() {
        var a = [];
        this._figures.forEach(function(b) {
            var c = b.getBounds(),
                d = TO_XY(c.getSouthWest()),
                c = TO_XY(c.getNorthEast()),
                b = {
                    type: "rectangle",
                    sPoint: d,
                    ePoint: c,
                    coordinate: GET_COORD_SYSTEM(),
                    options: {
                        strokeColor: b.getStrokeColor(),
                        strokeWeight: b.getStrokeWeight(),
                        strokeStyle: b.getStrokeStyle(),
                        strokeOpacity: b.getStrokeOpacity(),
                        fillColor: b.getFillColor(),
                        fillOpacity: b.getFillOpacity()
                    }
                };
            a.push(b)
        }, this);
        return a
    };
    RectangleController.prototype.getState = function() {
        var a = this.getData();
        this._figures.forEach(function(b, c) {
            drawing.merge(a[c], {
                order: b.getOrder(),
                removable: this._removable,
                draggable: this._draggable,
                editable: this._editable
            })
        }, this);
        return a
    };
    RectangleController.prototype.clear = function(a) {
        this._cancel();
        for (var b = this._figures.length - 1; 0 <= b; b--) a ? this._figures[b].removeWithoutNotify() : this._figures[b].remove();
        this._index = 0;
        this._figures = [];
        this._figures.length = 0
    };
    RectangleController.prototype.put = function(a, b) {
        var c = {
            map: this._map,
            index: this._index++,
            bounds: a,
            strokeWeight: this._strokeWeight,
            strokeOpacity: this._strokeOpacity,
            strokeColor: this._strokeColor,
            strokeStyle: this._strokeStyle,
            fillColor: this._fillColor,
            fillOpacity: this._fillOpacity
        };
        drawing.merge(c, b);
        c = new ExtendsRectangle(c);
        c.onRemove.add(this._remove, this);
        c.setRemovable(this._removable, a.getNorthEast());
        c.setDraggable(this._draggable);
        c.setEditable(this._editable);
        c.setHoverable(this._draggable ||
            this._editable);
        c.setVertexVisible(!1);
        this._figures.push(c);
        this._dispatchEvent("put", {
            target: c
        })
    };

    function MarkerController(a, b) {
        EventLinker.call(this);
        this.onCursorChange = new Observable;
        this._map = a;
        this._markers = [];
        this._selected = null;
        this._index = 0;
        this._doneHandler = this._done.bind(this);
        this._moveHandler = this._move.bind(this);
        this._enterHandler = this._enter.bind(this);
        this._leaveHandler = this._leave.bind(this);
        this._setOptions(b)
    }
    drawing.inherits(MarkerController, EventLinker);
    MarkerController.prototype._setOptions = function(a) {
        this._draggable = a.draggable || Default.draggable;
        this._clickable = a.clickable || Default.clickable;
        this._removable = a.removable || Default.removable;
        this._zIndex = a.zIndex || Default.zIndex;
        this._tooltipOptions = a.tooltipOptions;
        this._closerOptions = a.closerOptions;
        this._markerImages = a.markerImages || []
    };
    MarkerController.prototype._select = function(a) {
        var b = this._map,
            c = this._markerImages[a],
            d = null,
            e = null,
            f = null;
        c && (d = ComponentFactory.createMarkerImage(c), e = ComponentFactory.createMarkerImage(c.hoverImage), f = ComponentFactory.createMarkerImage(c.dragImage));
        a = this._selected = new ExtendsMarker({
            clickable: !1,
            index: this._index,
            zIndex: this._zIndex,
            tooltipOptions: this._tooltipOptions,
            closerOptions: this._closerOptions,
            imageIndex: a,
            image: d,
            hoverImage: e,
            dragImage: f
        });
        a.setMap(b);
        f && a.setImage(f);
        daum.maps.event.addListener(b,
            "click", this._doneHandler);
        daum.maps.event.addListener(b, "mousemove", this._moveHandler);
        daum.maps.event.addListener(b, "mouseover", this._enterHandler);
        daum.maps.event.addListener(b, "mouseout", this._leaveHandler);
        this._dispatchEvent("select")
    };
    MarkerController.prototype.OFFSET_Y = 10;
    MarkerController.prototype._move = function(a) {
        var b = GET_COORDS(a),
            c = this._selected.getProjection(),
            d = c.containerPointFromCoords(b);
        d.y -= this.OFFSET_Y;
        this._selected.setPosition(c.coordsFromContainerPoint(d));
        this._dispatchEvent("draw", {
            coords: b,
            point: a.point
        })
    };
    MarkerController.prototype._done = function(a) {
        var b = this._map,
            c = this._selected;
        c.setMarkerImage(null);
        c.onRemove.add(this._remove, this);
        c.setRemovable(this._removable);
        c.setDraggable(this._draggable);
        c.setHoverable();
        c.setClickable(!0);
        c.onImageIndexChange.add(this._changeMarkerIndex.bind(this, c), this);
        this._tooltipOptions && c.createTooltip(this._tooltipOptions);
        this._markers.push(c);
        this._selected = null;
        this._index++;
        daum.maps.event.removeListener(b, "click", this._doneHandler);
        daum.maps.event.removeListener(b,
            "mousemove", this._moveHandler);
        daum.maps.event.removeListener(b, "mouseover", this._enterHandler);
        daum.maps.event.removeListener(b, "mouseout", this._leaveHandler);
        this._dispatchEvent("drawend", {
            coords: GET_COORDS(a),
            point: a.point,
            target: c
        });
        this.onCursorChange.notify(null)
    };
    MarkerController.prototype._enter = function() {
        this._selected.setVisible(!0)
    };
    MarkerController.prototype._leave = function() {
        this._selected.setVisible(!1)
    };
    MarkerController.prototype._cancel = function() {
        var a = this._map;
        this._selected && (this._selected.setMap(null), this._selected = null, daum.maps.event.removeListener(a, "click", this._doneHandler), daum.maps.event.removeListener(a, "mousemove", this._moveHandler), daum.maps.event.removeListener(a, "mouseover", this._enterHandler), daum.maps.event.removeListener(a, "mouseout", this._leaveHandler));
        this.onCursorChange.notify(null);
        this._dispatchEvent("cancel")
    };
    MarkerController.prototype._remove = function(a) {
        var b;
        this._markers.forEach(function(c, d) {
            if (c == a || d == a) b = c, c.setMap(null), this._markers.splice(d, 1), this._markers.forEach(function(a, b) {
                a.setIndex(b)
            }), this._index--
        }, this);
        this._dispatchEvent("remove", {
            target: b
        })
    };
    MarkerController.prototype.select = function(a) {
        this.onCursorChange.notify("url(" + PROTOCOL + "//i1.daumcdn.net/localimg/localimages/07/2012/img/invisible.png), url(" + PROTOCOL + "//i1.daumcdn.net/localimg/localimages/07/2012/img/invisible.cur), none");
        this._select(a || 0)
    };
    MarkerController.prototype.cancel = function() {
        this._cancel()
    };
    MarkerController.prototype.remove = function(a) {
        this._remove(a)
    };
    MarkerController.prototype.getObjects = function() {
        return this._markers
    };
    MarkerController.prototype.getData = function() {
        var a = [];
        this._markers.forEach(function(b) {
            var c = b.getImageIndex(),
                d = b.getPosition(),
                d = TO_XY(d),
                b = {
                    type: "marker",
                    x: d.x,
                    y: d.y,
                    coordinate: GET_COORD_SYSTEM(),
                    zIndex: this._zIndex,
                    icon: this._markerImages[c],
                    content: b.getTooltip() ? b.getTooltip().getLabel() : ""
                };
            a.push(b)
        }, this);
        return a
    };
    MarkerController.prototype.getState = function() {
        var a = this.getData();
        this._markers.forEach(function(b, c) {
            drawing.merge(a[c], {
                order: b.getOrder(),
                imageIndex: b.getImageIndex(),
                removable: this._removable,
                draggable: this._draggable,
                clickable: this._clickable
            })
        }, this);
        return a
    };
    MarkerController.prototype._changeMarkerIndex = function(a, b) {
        var c = this._markerImages[b];
        c ? (c = ComponentFactory.createMarkerImage(c), a.setMarkerImage(c, b)) : a.setMarkerImage(null)
    };
    MarkerController.prototype.clear = function(a) {
        this._cancel();
        for (var b = this._markers.length - 1; 0 <= b; b--) a ? this._markers[b].removeWithoutNotify() : this._markers[b].remove();
        this._index = 0;
        this._markers = [];
        this._markers.length = 0
    };
    MarkerController.prototype.put = function(a, b, c) {
        var d = this._markerImages[b],
            e = null,
            f = null,
            g = null;
        d && (e = ComponentFactory.createMarkerImage(d), f = ComponentFactory.createMarkerImage(d.hoverImage), g = ComponentFactory.createMarkerImage(d.dragImage));
        a = new ExtendsMarker({
            map: this._map,
            clickable: this._clickable,
            index: this._index++,
            zIndex: this._zIndex,
            imageIndex: b,
            position: a,
            image: e,
            hoverImage: f,
            dragImage: g
        });
        a.onRemove.add(this._remove, this);
        a.setRemovable(this._removable);
        a.setDraggable(this._draggable);
        a.setHoverable();
        a.onImageIndexChange.add(this._changeMarkerIndex.bind(this, a), this);
        this._tooltipOptions && (c && (this._tooltipOptions.defaultContent = c), a.createTooltip(this._tooltipOptions), a.unpick());
        this._markers.push(a);
        this._dispatchEvent("put", {
            target: a
        })
    };

    function GuideTooltipManager(a, b) {
        this._map = a;
        this._drawingManager = b;
        this._moveHandler = this._move.bind(this);
        this._overHandler = this._over.bind(this);
        this._outHandler = this._out.bind(this);
        this._selectHandler = this._select.bind(this);
        this._cancelHandler = this._cancel.bind(this);
        this._drawstartHandler = this._drawstart.bind(this);
        this._drawnextHandler = this._drawnext.bind(this);
        this._drawendHandler = this._drawend.bind(this);
        this._dispatchDragGuideHandler = this._dispatchDragGuide.bind(this);
        this._hoverHandler =
            this._hover.bind(this);
        this._enterHandler = this._enter.bind(this);
        this._leaveHandler = this._leave.bind(this);
        this._dispatchEditGuideHandler = this._dispatchEditGuide.bind(this);
        this._isHover = this._selected = !1;
        this._drawGuideTooltip = ComponentFactory.createGuideTooltip(a);
        this._dragGuideTooltip = ComponentFactory.createGuideTooltip(a);
        this._editGuideTooltip = ComponentFactory.createGuideTooltip(a)
    }
    GuideTooltipManager.prototype.setActive = function(a, b) {
        -1 < b.indexOf("draw") && this._setDrawGuide(a); - 1 < b.indexOf("drag") && this._setDragGuide(a); - 1 < b.indexOf("edit") && this._setEditGuide(a)
    };
    GuideTooltipManager.prototype._move = function(a) {
        this._selected && (a = GET_COORDS(a), this._drawGuideTooltip.setPosition(a))
    };
    GuideTooltipManager.prototype._over = function() {
        this._selected && this._drawGuideTooltip.setVisible(!0)
    };
    GuideTooltipManager.prototype._out = function() {
        this._selected && this._drawGuideTooltip.setVisible(!1)
    };
    GuideTooltipManager.prototype._select = function(a) {
        this._selected = !0;
        this._drawGuideTooltip.setOverlayType(a.overlayType);
        this._drawGuideTooltip.setGuide("marker" == a.overlayType ? "CLICK_AND_ADD" : "CLICK_AND_START")
    };
    GuideTooltipManager.prototype._cancel = function() {
        this._selected = !1;
        this._drawGuideTooltip.setVisible(!1)
    };
    GuideTooltipManager.prototype._drawstart = function(a) {
        this._drawGuideTooltip.setVisible(!0);
        var b = "";
        switch (a.overlayType) {
            case "polyline":
            case "polygon":
            case "arrow":
                b = "CLICK_AND_CONTINUE";
                break;
            case "rectangle":
            case "circle":
            case "ellipse":
                b = "CLICK_AND_DONE"
        }
        this._drawGuideTooltip.setGuide(b)
    };
    GuideTooltipManager.prototype._drawnext = function() {
        this._drawGuideTooltip.setGuide("ENDS_CLICK_AND_DONE")
    };
    GuideTooltipManager.prototype._drawend = function() {
        this._selected = !1;
        this._drawGuideTooltip.setVisible(!1)
    };
    GuideTooltipManager.prototype._dispatchDragGuide = function(a) {
        this._setDragGuideAt(a, !0)
    };
    GuideTooltipManager.prototype._hover = function(a) {
        if (!this._selected || this._isHover) a = GET_COORDS(a), this._dragGuideTooltip.setPosition(a)
    };
    GuideTooltipManager.prototype._enter = function() {
        !this._selected && !this._isDrag && (this._isHover = !0, this._dragGuideTooltip.setVisible(!0))
    };
    GuideTooltipManager.prototype._leave = function() {
        this._selected || (this._dragGuideTooltip.setVisible(!1), this._isHover = !1)
    };
    GuideTooltipManager.prototype._dispatchEditGuide = function(a) {
        "marker" !== a.overlayType && this._setEditGuideAt(a, !0)
    };
    GuideTooltipManager.prototype._setEditGuidePosition = function(a) {
        !this._selected && this._isHoverVertex && this._editGuideTooltip.setPosition(a)
    };
    GuideTooltipManager.prototype._showEditGuide = function() {
        !this._selected && !this._isDrag && (this._editGuideTooltip.setVisible(!0), this._isHoverVertex = !0)
    };
    GuideTooltipManager.prototype._hideEditGuide = function() {
        this._selected || (this._editGuideTooltip.setVisible(!1), this._isHoverVertex = !1)
    };
    GuideTooltipManager.prototype._setDrawGuide = function(a) {
        if (this._drawGuideActive != a) {
            var b = (this._drawGuideActive = a) ? "addListener" : "removeListener";
            daum.maps.event[b](this._map, "mousemove", this._moveHandler);
            daum.maps.event[b](this._map, "mouseover", this._overHandler);
            daum.maps.event[b](this._map, "mouseout", this._outHandler);
            this._drawingManager[b]("select", this._selectHandler);
            this._drawingManager[b]("drawstart", this._drawstartHandler);
            this._drawingManager[b]("drawnext", this._drawnextHandler);
            this._drawingManager[b]("drawend",
                this._drawendHandler);
            this._drawingManager[b]("cancel", this._cancelHandler);
            this._drawGuideTooltip.setMap(a ? this._map : null)
        }
    };
    GuideTooltipManager.prototype._setDragGuide = function(a) {
        if (this._dragGuideActive != a) {
            this._dragGuideActive = a;
            var b = this._drawingManager.getData();
            this._drawingManager.getModes().forEach(function(c) {
                b[c].forEach(function(b) {
                    this._setDragGuideAt({
                        target: b,
                        overlayType: c
                    }, a)
                }, this)
            }, this);
            var c = a ? "addListener" : "removeListener";
            this._drawingManager[c]("drawend", this._dispatchDragGuideHandler);
            this._drawingManager[c]("put", this._dispatchDragGuideHandler);
            this._dragGuideTooltip.setMap(a ? this._map : null)
        }
    };
    GuideTooltipManager.prototype._setDragGuideAt = function(a, b) {
        var c = a.target,
            d = a.overlayType;
        if (c.getDraggable()) {
            var e = b ? "addListener" : "removeListener";
            daum.maps.event[e](this._map, "mousemove", this._hoverHandler);
            daum.maps.event[e](c, "mouseover", this._enterHandler);
            daum.maps.event[e](c, "mouseout", this._leaveHandler);
            b ? c.onHover.add(function() {
                this._dragGuideTooltip.setOverlayType(d);
                this._dragGuideTooltip.setGuide("DRAG_AND_DROP")
            }.bind(this)) : c.onHover.clear();
            b ? c.onDrag.add(function(a) {
                this._isDrag =
                    a;
                this._leave()
            }.bind(this)) : c.onDrag.clear()
        }
    };
    GuideTooltipManager.prototype._setEditGuide = function(a) {
        if (this._editGuideActive != a) {
            this._editGuideActive = a;
            var b = this._drawingManager.getData();
            this._drawingManager.getGraphicsModes().forEach(function(c) {
                b[c].forEach(function(b) {
                    this._setEditGuideAt({
                        target: b,
                        overlayType: c
                    }, a)
                }, this)
            }, this);
            var c = a ? "addListener" : "removeListener";
            this._drawingManager[c]("drawend", this._dispatchEditGuideHandler);
            this._drawingManager[c]("put", this._dispatchEditGuideHandler);
            this._editGuideTooltip.setMap(a ? this._map :
                null)
        }
    };
    GuideTooltipManager.prototype._setEditGuideAt = function(a, b) {
        var c = a.target,
            d = a.overlayType;
        if (c.getEditable()) {
            var e = this._editGuideTooltip;
            c.getVertices();
            b ? c.onVertexHover.add(function(a) {
                a ? (this._showEditGuide(), e.setOverlayType(d), e.setGuide("EDIT"), this._setEditGuidePosition(a)) : this._hideEditGuide()
            }.bind(this)) : c.onVertexHover.clear();
            c.onVertexAdderHover && (b ? c.onVertexAdderHover.add(function(a) {
                    a ? (this._showEditGuide(), e.setOverlayType(d), e.setGuide("EDIT"), this._setEditGuidePosition(a)) : this._hideEditGuide()
                }.bind(this)) :
                c.onVertexAdderHover.clear());
            b ? c.onDrag.add(function(a) {
                this._isDrag = a;
                this._hideEditGuide()
            }.bind(this)) : c.onDrag.clear()
        }
    };
    GuideTooltipManager.prototype.setDrawGuide = function(a) {
        this._setDrawGuide(a)
    };
    GuideTooltipManager.prototype.setDragGuide = function(a) {
        this._setDragGuide(a)
    };
    GuideTooltipManager.prototype.setEditGuide = function(a) {
        this._setEditGuide(a)
    };

    function DrawingManager(a) {
        EventLinker.call(this);
        this._controllers = {};
        this._options = a;
        this._map = a.map;
        var b = a.drawingMode || [];
        if (!b.length) {
            var c = daum.maps.drawing.OverlayType;
            for (key in c) b.push(c[key])
        }
        this._modes = b;
        this._cursorStyle = null;
        this._graphics = b.filter(function(a) {
            return a != daum.maps.drawing.OverlayType.MARKER
        });
        this._bindEvent();
        a.guideTooltip && this.setGuideTooltip(!0, a.guideTooltip);
        this._historyStroage = new HistoryStorage
    }
    drawing.inherits(DrawingManager, EventLinker);
    DrawingManager.CONTROLLER_OF = {
        marker: MarkerController,
        polyline: PolylineController,
        polygon: PolygonController,
        arrow: ArrowController,
        rectangle: RectangleController,
        circle: CircleController,
        ellipse: EllipseController
    };
    DrawingManager.prototype._bindEvent = function() {
        var a = this._options,
            b = this._map,
            c = this._controllers;
        this._modes.forEach(function(d) {
            var e = c[d] = new DrawingManager.CONTROLLER_OF[d](b, a[d + "Options"] || {});
            "select drawstart draw drawnext drawend cancel remove put".split(" ").forEach(function(a) {
                e.addListener(a, function(b) {
                    b = b || {};
                    b.overlayType = d;
                    this._dispatchEvent(a, b)
                }, this)
            }, this);
            e.onCursorChange.add(function(a) {
                this._cursorStyle = a;
                b.setCursor(a)
            }, this);
            e.addListener("select", this._unpickAll, this);
            e.addListener("drawend", this._drawendHandler, this);
            e.addListener("put", this._putHandler, this)
        }, this);
        daum.maps.event.addListener(b, "click", this._unpickAll.bind(this))
    };
    DrawingManager.prototype._unpickAll = function() {
        this._pickTarget(null)
    };
    DrawingManager.prototype._drawendHandler = function(a) {
        var b = a.overlayType,
            a = a.target;
        this._map === a.getMap() && (this._pickTarget(a), b != daum.maps.drawing.OverlayType.MARKER && a.setVertexVisible(!0), this._manageEditable(a), this._manageDraggable(a), this._manageRemovable(a), this._manageStateChanged(a), this._preventEventForDrawing(a), this._mode = "", this._handleChangedState())
    };
    DrawingManager.prototype._putHandler = function(a) {
        a = a.target;
        this._manageEditable(a);
        this._manageDraggable(a);
        this._manageRemovable(a);
        this._manageStateChanged(a);
        this._preventEventForDrawing(a)
    };
    DrawingManager.prototype._manageEditable = function(a) {
        a.getEditable() && (a.onEdit.add(this._pickTarget, this), a.getDraggable() || a.onHover.add(function(a) {
            this._map.setCursor(a ? "pointer" : this._cursorStyle)
        }, this))
    };
    DrawingManager.prototype._manageDraggable = function(a) {
        a.getDraggable() && a.onHover.add(function(a) {
            this._map.setCursor(a ? "move" : this._cursorStyle)
        }, this)
    };
    DrawingManager.prototype._manageRemovable = function(a) {
        a.onRemove.add(function() {
            this._map.setCursor(this._cursorStyle)
        }, this)
    };
    DrawingManager.prototype._manageStateChanged = function(a) {
        a.onChangeState.add(this._handleChangedState, this)
    };
    DrawingManager.prototype._preventEventForDrawing = function(a) {
        this.addListener("select", function() {
            a.preventEvent(!0)
        });
        this.addListener("drawend", function() {
            a.preventEvent(!1)
        });
        this.addListener("cancel", function() {
            a.preventEvent(!1)
        })
    };
    DrawingManager.prototype._pickTarget = function(a) {
        var b = this._pickedObject;
        b != a && (b && b.getMap() && b.unpick(), this._pickedObject = a)
    };
    DrawingManager.prototype._drawTarget = function(a) {
        var b = a.type,
            c = this._controllers[b],
            d = a.options,
            e, f;
        switch (b) {
            case daum.maps.drawing.OverlayType.MARKER:
                b = a.x;
                e = a.y;
                d = a.imageIndex;
                f = a.content;
                b = "wcongnamul" == a.coordinate ? new daum.maps.Coords(b, e) : new daum.maps.LatLng(e, b);
                c.put(b, d, f);
                break;
            case daum.maps.drawing.OverlayType.RECTANGLE:
                b = a.sPoint;
                e = a.ePoint;
                b = "wcongnamul" == a.coordinate ? new daum.maps.CoordsBounds(new daum.maps.Coords(b.x, b.y), new daum.maps.Coords(e.x, e.y)) : new daum.maps.LatLngBounds(new daum.maps.LatLng(b.y,
                    b.x), new daum.maps.LatLng(e.y, e.x));
                c.put(b, d);
                break;
            case daum.maps.drawing.OverlayType.CIRCLE:
                b = a.center.x;
                e = a.center.y;
                b = "wcongnamul" == a.coordinate ? new daum.maps.Coords(b, e) : new daum.maps.LatLng(e, b);
                e = a.radius;
                c.put(b, e, d);
                break;
            case daum.maps.drawing.OverlayType.ELLIPSE:
                b = a.center.x;
                e = a.center.y;
                b = "wcongnamul" == a.coordinate ? new daum.maps.Coords(b, e) : new daum.maps.LatLng(e, b);
                e = a.rx;
                f = a.ry;
                c.put(b, e, f, d);
                break;
            case daum.maps.drawing.OverlayType.POLYLINE:
            case daum.maps.drawing.OverlayType.POLYGON:
            case daum.maps.drawing.OverlayType.ARROW:
                b =
                    a.points.map(function(b) {
                        return "wcongnamul" == a.coordinate ? new daum.maps.Coords(b.x, b.y) : new daum.maps.LatLng(b.y, b.x)
                    }), c.put(b, d)
        }
    };
    DrawingManager.prototype._handleChangedState = function() {
        this._historyStroage.push(this.getState());
        this._dispatchEvent("state_changed")
    };
    DrawingManager.prototype.setGuideTooltip = function(a, b) {
        this._guideTooltipManager || (this._guideTooltipManager = new GuideTooltipManager(this._map, this));
        var b = b || ["draw", "drag", "edit"],
            c = [];
        b instanceof Array ? c = b : c.push(b);
        this._guideTooltipManager.setActive(a, c)
    };
    DrawingManager.prototype.setStyle = function(a, b, c) {
        this._controllers[a].setStyle(b, c)
    };
    DrawingManager.prototype.setStrokeWeight = function(a) {
        this._graphics.forEach(function(b) {
            this.setStyle(b, "strokeWeight", a)
        }, this)
    };
    DrawingManager.prototype.setStrokeColor = function(a) {
        this._graphics.forEach(function(b) {
            this.setStyle(b, "strokeColor", a)
        }, this)
    };
    DrawingManager.prototype.setStrokeOpacity = function() {
        this._graphics.forEach(function(a) {
            this.setStyle(a, "strokeOpacity", hex)
        }, this)
    };
    DrawingManager.prototype.setFillColor = function(a) {
        this._graphics.forEach(function(b) {
            b != daum.maps.drawing.OverlayType.POLYLINE && b != daum.maps.drawing.OverlayType.ARROW && this.setStyle(b, "fillColor", a)
        }, this)
    };
    DrawingManager.prototype.setFillOpacity = function(a) {
        this._graphics.forEach(function(b) {
            b != daum.maps.drawing.OverlayType.POLYLINE && b != daum.maps.drawing.OverlayType.ARROW && this.setStyle(b, "fillOpacity", a)
        }, this)
    };
    DrawingManager.prototype.select = function(a, b) {
        var c = this._mode;
        this._controllers[c] && this._controllers[c].cancel();
        this._controllers[a].select(b);
        this._mode = a
    };
    DrawingManager.prototype.selected = function() {
        return !!this._mode
    };
    DrawingManager.prototype.remove = function(a) {
        a.remove()
    };
    DrawingManager.prototype.put = function(a) {
        var b = this._controllers[a],
            c = slice(arguments, 1);
        b.put.apply(b, c);
        this._handleChangedState()
    };
    DrawingManager.prototype.cancel = function() {
        var a = this._mode;
        this._controllers[a] && this._controllers[a].cancel();
        this._mode = ""
    };
    DrawingManager.prototype.getData = function(a) {
        var b = this._modes;
        a && a instanceof Array && (b = b.filter(function(b) {
            return a.some(function(a) {
                return a == b
            })
        }));
        var c = {};
        b.forEach(function(a) {
            c[a] = this._controllers[a].getData()
        }, this);
        return c
    };
    DrawingManager.prototype.getState = function() {
        var a = {};
        this._modes.forEach(function(b) {
            a[b] = this._controllers[b].getState()
        }, this);
        return a
    };
    DrawingManager.prototype.setState = function(a) {
        var b = [],
            c;
        for (c in a) b = b.concat(a[c]);
        b.sort(function(a, b) {
            return a.order - b.order
        });
        b.forEach(this._drawTarget, this);
        this._dispatchEvent("state_changed")
    };
    DrawingManager.prototype.clear = function(a) {
        var b = this._modes;
        a && a instanceof Array && (b = b.filter(function(b) {
            return a.some(function(a) {
                return a == b
            })
        }));
        b.forEach(function(a) {
            this._controllers[a].clear(!0);
            event = {};
            event.overlayType = a
        }, this);
        this._dispatchEvent("clear");
        this._handleChangedState()
    };
    DrawingManager.prototype.getModes = function() {
        return this._modes
    };
    DrawingManager.prototype.getGraphicsModes = function() {
        return this._graphics
    };
    DrawingManager.prototype.getOverlays = function(a) {
        var b = this._modes,
            c = this._controllers,
            d = {};
        a && a instanceof Array && (b = b.filter(function(b) {
            return a.some(function(a) {
                return a == b
            })
        }));
        b.forEach(function(a) {
            d[a] = c[a].getObjects()
        }, this);
        return d
    };
    DrawingManager.prototype.undo = function() {
        if (this._historyStroage.undoable()) {
            this._modes.forEach(function(a) {
                this._controllers[a].clear(!0)
            }, this);
            var a = this._historyStroage.pop() || {};
            this.setState(a)
        }
    };
    DrawingManager.prototype.redo = function() {
        if (this._historyStroage.redoable()) {
            this._modes.forEach(function(a) {
                this._controllers[a].clear(!0)
            }, this);
            var a = this._historyStroage.restore();
            this.setState(a)
        }
    };
    DrawingManager.prototype.undoable = function() {
        return this._historyStroage.undoable()
    };
    DrawingManager.prototype.redoable = function() {
        return this._historyStroage.redoable()
    };
    var w = window,
        w = w.daum = w.daum || {},
        w = w.maps = w.maps || {};
    w.Drawing = w.drawing = {
        OverlayType: {
            MARKER: "marker",
            RECTANGLE: "rectangle",
            CIRCLE: "circle",
            ELLIPSE: "ellipse",
            POLYLINE: "polyline",
            POLYGON: "polygon",
            ARROW: "arrow"
        },
        DrawingManager: DrawingManager,
        Toolbox: Toolbox
    };
})(this);