(function(o) {
    function j(a) {
        return a instanceof daum.maps.LatLng ? a.toCoords() : a
    }

    function p(a) {
        if (a instanceof daum.maps.LatLngBounds) {
            var b = a.getSouthWest(),
                a = a.getNorthEast();
            return new daum.maps.CoordsBounds(j(b), j(a))
        }
        return a
    }

    function k(a) {
        this.hoverable = void 0 === a.hoverable || a.hoverable;
        this.clickable = void 0 === a.clickable || a.clickable;
        this.disableClickZoom = a.disableClickZoom || l;
        this.gridSize = a.gridSize || 60;
        this.minClusterSize = a.minClusterSize || 2;
        this.averageCenter = a.averageCenter || l;
        this.minLevel =
            a.minLevel || 0;
        this.styles = a.styles || k.DEFAULT_STYLES;
        this.texts = a.texts || k.DEFAULT_TEXTS;
        this.calculator = a.calculator || k.DEFAULT_CALCULATOR
    }

    function g(a) {
        this._clusterer = a;
        this._bounds = m;
        this._markers = [];
        var b = this._map = a.getMap();
        this._proj = b.getProjection();
        this._model = a.getModel();
        this._hoverable = this._model.hoverable;
        this._clickable = this._model.clickable;
        var d = this._content = document.createElement("div");
        this._clickable && (d.style.cursor = "pointer");
        this._clusterMarker = new daum.maps.CustomOverlay({
            map: b,
            clickable: this._clickable
        });
        a = [];
        this._hoverable && (a = ["mouseout", "mouseover"]);
        this._clickable && (a = a.concat(["click", "dblclick", "contextmenu"]));
        a = a.map(function(a) {
            return h.listen(d, a, this._eventHandler(a), this)
        }, this);
        a.push(h.listen(d, "mousedown", function(a) {
            a.preventDefault && a.preventDefault();
            a.returnValue = l
        }));
        this._eventIds = a
    }

    function c(a) {
        daum.maps.AbstractOverlay.call(this);
        a = a || {};
        this._model = new k(a);
        this._clusters = [];
        this._markers = a.markers || [];
        (a = a.map) && this.setMap(a)
    }
    Function.prototype.bind ||
        (Function.prototype.bind = function(a) {
            if ("function" !== typeof this) throw new TypeError("Error");
            var b = Array.prototype.slice.call(arguments, 1),
                d = this,
                e = function() {},
                f = function() {
                    return d.apply(this instanceof e ? this : a, b.concat(Array.prototype.slice.call(arguments)))
                };
            e.prototype = this.prototype;
            f.prototype = new e;
            return f
        });
    Array.prototype.indexOf || (Array.prototype.indexOf = function(a, b) {
        var d;
        if (this == null) throw new TypeError('"this" is null or not defined');
        var e = Object(this),
            f = e.length >>> 0;
        if (f === 0) return -1;
        d = +b || 0;
        Math.abs(d) === Infinity && (d = 0);
        if (d >= f) return -1;
        for (d = Math.max(d >= 0 ? d : f - Math.abs(d), 0); d < f;) {
            if (d in e && e[d] === a) return d;
            d++
        }
        return -1
    });
    Array.prototype.map || (Array.prototype.map = function(a, b) {
        var d, e, f;
        if (this == null) throw new TypeError(" this is null or not defined");
        var c = Object(this),
            i = c.length >>> 0;
        if (typeof a !== "function") throw new TypeError(a + " is not a function");
        arguments.length > 1 && (d = b);
        e = Array(i);
        for (f = 0; f < i;) {
            var g;
            if (f in c) {
                g = c[f];
                g = a.call(d, g, f, c);
                e[f] = g
            }
            f++
        }
        return e
    });
    Array.prototype.filter ||
        (Array.prototype.filter = function(a, b) {
            if (!(typeof a === "Function" || typeof a === "function") || !this) throw new TypeError;
            var d = this.length >>> 0,
                e = Array(d),
                f = 0,
                c = -1;
            if (b === void 0)
                for (; ++c !== d;) c in this && a(this[c], c, this) && (e[f++] = this[c]);
            else
                for (; ++c !== d;) c in this && a.call(b, this[c], c, this) && (e[f++] = this[c]);
            e.length = f;
            return e
        });
    var n;
    n = o;
    n = n.daum = n.daum || {};
    n = n.maps = n.maps || {};
    var q = !!n.apikey,
        r = Math.abs,
        l = !1,
        m = null,
        s = ("https:" == o.location.protocol ? "https:" : "http:") + "//" + (daum.maps.TUNNELING ? "ssl.daumcdn.net" :
            "i1.daumcdn.net") + "/localimg/localimages/07/mapjsapi/cluster.png",
        h = {
            _POOL: {},
            _ID: 0
        };
    o.EVENT = h;
    h._proxy = function() {
        function a(b) {
            b = b || o.event;
            if (!b.target) b.target = b.srcElement;
            return a.func.call(a.scope || a.target, b)
        }
        return a
    };
    h.listen = function(a, b, d, e) {
        var c = h._proxy();
        c.target = a;
        c.type = b;
        c.func = d;
        c.scope = e;
        a.addEventListener ? a.addEventListener(b, c, false) : a.attachEvent("on" + b, c);
        a = h._ID++;
        h._POOL[a] = c;
        return a
    };
    h.unlisten = function(a) {
        var b = h._POOL[a];
        if (b) {
            b.target.removeEventListener ? b.target.removeEventListener(b.type,
                b, false) : b.target.detachEvent("on" + b.type, b);
            delete h._POOL[a]
        }
    };
    k.prototype.getExtendedBounds = function(a, b) {
        var d = a.pointFromCoords(b.getSouthWest()),
            e = a.pointFromCoords(b.getNorthEast()),
            c = this.gridSize;
        d.x = d.x - c;
        d.y = d.y + c;
        e.x = e.x + c;
        e.y = e.y - c;
        return new daum.maps.CoordsBounds(j(a.coordsFromPoint(d)), j(a.coordsFromPoint(e)))
    };
    k.prototype._getIndexFromCalc = function(a) {
        var b = this.calculator;
        if (typeof b === "function") return b(a);
        for (var d = 0, e = null; e = b[d];) {
            if (a < e) break;
            d++
        }
        return d
    };
    k.prototype.getStyle =
        function(a) {
            var a = this._getIndexFromCalc(a),
                b = this.styles;
            return b[Math.min(a, b.length - 1)]
        };
    k.prototype.getText = function(a) {
        var b = this.texts;
        if (typeof b === "function") return b(a);
        a = this._getIndexFromCalc(a);
        return b[Math.min(a, b.length - 1)]
    };
    k.DEFAULT_STYLES = [52, 56, 66, 78, 90].map(function(a, b) {
        return {
            width: a + "px",
            height: a + "px",
            lineHeight: b + a + "px",
            fontSize: b * 2 + 14 + "px",
            background: "url(" + s + ")",
            backgroundPosition: "0 " + -90 * b + "px",
            textAlign: "center",
            fontWeight: "bold"
        }
    });
    k.DEFAULT_TEXTS = function(a) {
        return a
    };
    k.DEFAULT_CALCULATOR = function(a) {
        for (var b = -1; a != 0;) {
            a = a / 10 | 0;
            b++
        }
        return b
    };
    g.ALIAS = {
        mouseout: "out",
        mouseover: "over",
        contextmenu: "rightclick"
    };
    g.prototype._eventHandler = function(a) {
        var b = "cluster" + (g.ALIAS[a] || a);
        return function() {
            a === "click" && this._clusterClick();
            daum.maps.event.trigger(this._clusterer, b, this)
        }
    };
    g.prototype._clusterClick = function() {
        if (!this._model.disableClickZoom) {
            var a = this._map,
                b = j(a.getCenter()),
                d = p(a.getBounds()),
                e = j(this.getCenter()),
                c = p(this.getBounds()),
                g = d.getNorthEast().getY() -
                b.getY(),
                i = c.getNorthEast().getY() - e.getY(),
                b = d.getNorthEast().getX() - b.getX(),
                e = c.getNorthEast().getX() - e.getX();
            if (g >> 1 > i && b >> 1 > e) a.setBounds(this.getBounds(), 0);
            else {
                a.setLevel(a.getLevel() - 1);
                a.setCenter(this.getCenter())
            }
        }
    };
    g.prototype._isAlreadyAdded = function(a) {
        return this._markers.indexOf(a) != -1
    };
    g.prototype.isInBounds = function(a) {
        return this._bounds.contain(j(a.getPosition()))
    };
    g.prototype.add = function(a) {
        if (!this._isAlreadyAdded(a)) {
            var b = this._markers,
                d = j(a.getPosition());
            if (this._center) {
                if (this._model.averageCenter) {
                    var c =
                        b.length + 1;
                    this._center = new daum.maps.Coords((this._center.getX() * (c - 1) + d.getX()) / c, (this._center.getY() * (c - 1) + d.getY()) / c);
                    this._updateBounds(this._center)
                }
            } else {
                this._center = d;
                this._updateBounds(d)
            }
            a.isAdded = true;
            b.push(a);
            d = b.length;
            c = this._model.minClusterSize;
            if (d < c) a.setMap(this._map);
            else if (d == c)
                for (a = 0; d = b[a]; a++) d.setMap(m);
            else a.setMap(m);
            this._updateIcon()
        }
    };
    g.prototype._updateBounds = function(a) {
        this._bounds = this._model.getExtendedBounds(this._proj, new daum.maps.CoordsBounds(a, a))
    };
    g.prototype._updateIcon =
        function() {
            var a = this._map,
                b = this._model,
                d = this._markers,
                c = this._clusterMarker,
                f = a.getLevel(),
                g = b.minLevel,
                i = d.length;
            if (g && f < g)
                for (b = 0; c = d[b]; b++) c.setMap(a);
            else if (i < b.minClusterSize) c.setVisible(l);
            else {
                c.setPosition(this._center);
                c.setVisible(true);
                var a = b.getStyle(i),
                    h;
                for (h in a) this._content.style[h] = a[h];
                c.setContent(this._content);
                this._content.innerHTML = b.getText(i)
            }
        };
    g.prototype.remove = function() {
        for (var a = m;
            (a = this._eventIds.pop()) !== void 0;) h.unlisten(a);
        this._clusterMarker.setMap(m);
        this._markers.length = 0;
        this._content = this._clusterMarker = m
    };
    g.prototype.getCenter = function() {
        var a;
        a = this._center;
        a = q ? a.toLatLng() : a;
        return a
    };
    g.prototype.getBounds = function() {
        var a;
        a = this._bounds;
        a = q ? new daum.maps.LatLngBounds(a.getSouthWest().toLatLng(), a.getNorthEast().toLatLng()) : a;
        return a
    };
    g.prototype.getSize = function() {
        return this._markers.length
    };
    g.prototype.getMarkers = function() {
        return this._markers
    };
    g.prototype.getClusterMarker = function() {
        return this._clusterMarker
    };
    c.prototype = new daum.maps.AbstractOverlay;
    c.prototype.onAdd = function() {
        var a = this.getMap();
        daum.maps.event.addListener(a, "zoom_changed", this._resetViewport.bind(this));
        daum.maps.event.addListener(a, "idle", this._createClusters.bind(this));
        this._createClusters()
    };
    c.prototype._indexOfMarkers = function(a) {
        return this._markers.indexOf(a)
    };
    c.prototype.addMarker = function(a, b) {
        if (this._indexOfMarkers(a) >= 0) return l;
        a.isAdded = l;
        a instanceof daum.maps.Marker && a.getDraggable() && daum.maps.event.addListener(a, "dragend", function() {
            a.isAdded = l;
            this.redraw()
        }.bind(this));
        this._markers.push(a);
        b || this._createClusters()
    };
    c.prototype.addMarkers = function(a, b) {
        for (var c = 0, e; e = a[c]; c++) this.addMarker(e, true);
        b || this._createClusters()
    };
    c.prototype._removeMarker = function(a) {
        var b = this._indexOfMarkers(a);
        if (b < 0) return l;
        a.setMap(m);
        this._markers.splice(b, 1)[0].isAdded = l;
        return true
    };
    c.prototype.removeMarker = function(a, b) {
        var c = this._removeMarker(a, true);
        !b && c && this.redraw()
    };
    c.prototype.removeMarkers = function(a, b) {
        for (var c = l, e = 0, f; f = a[e]; e++) c = this._removeMarker(f, true) ||
            c;
        !b && c && this.redraw()
    };
    c.prototype.redraw = function() {
        this._resetViewport();
        this._createClusters()
    };
    c.prototype.clear = function() {
        this._resetViewport(true);
        this._markers = []
    };
    c.prototype._resetViewport = function(a) {
        for (var b = 0, c; c = this._clusters[b]; b++) c.remove();
        for (b = 0; c = this._markers[b]; b++) {
            c.isAdded = l;
            a && c.setMap(m)
        }
        this._clusters.length = 0;
        this._clusters = []
    };
    c.prototype._createClusters = function() {
        if (this.getMap()) {
            var a, b, c = this._markers,
                e = this.getMap();
            a = this.getProjection();
            b = p(e.getBounds());
            var f = this._model.getExtendedBounds(a, b),
                g = this._model.minClusterSize,
                i = this._model.minLevel <= e.getLevel();
            for (a = 0; b = c[a]; a++) !b.isAdded && f.contain(j(b.getPosition())) && (i ? this._addToClosestCluster(b) : b.setMap(e));
            i && daum.maps.event.trigger(this, "clustered", this._clusters.filter(function(a) {
                return a.getMarkers().length >= g
            }))
        }
    };
    c.prototype._addToClosestCluster = function(a) {
        for (var b = j(a.getPosition()), c = m, e = Infinity, f = 0, h; h = this._clusters[f]; f++) {
            var i = j(h.getCenter()),
                i = r(b.getX() - i.getX()) + r(b.getY() -
                    i.getY());
            if (e > i) {
                e = i;
                c = h
            }
        }
        if (c && c.isInBounds(a)) c.add(a);
        else {
            b = new g(this);
            b.add(a);
            this._clusters.push(b)
        }
    };
    c.prototype.getModel = function() {
        return this._model
    };
    c.prototype.getGridSize = function() {
        return this._model.gridSize
    };
    c.prototype.setGridSize = function(a) {
        this._model.gridSize = a
    };
    c.prototype.getMinClusterSize = function() {
        return this._model.minClusterSize
    };
    c.prototype.setMinClusterSize = function(a) {
        this._model.minClusterSize = a
    };
    c.prototype.getAverageCenter = function() {
        return this._model.averageCenter
    };
    c.prototype.setAverageCenter = function(a) {
        this._model.averageCenter = a
    };
    c.prototype.getMinLevel = function() {
        return this._model.minLevel
    };
    c.prototype.setMinLevel = function(a) {
        this._model.minLevel = a
    };
    c.prototype.getStyles = function() {
        return this._model.styles
    };
    c.prototype.setStyles = function(a) {
        this._model.styles = a
    };
    c.prototype.getTexts = function() {
        return this._model.texts
    };
    c.prototype.setTexts = function(a) {
        this._model.texts = a
    };
    c.prototype.getCalculator = function() {
        return this._model.calculator
    };
    c.prototype.setCalculator =
        function(a) {
            this._model.calculator = a
        };
    c.prototype.getMarkers = function() {
        return this._markers
    };
    n.MarkerClusterer = c
})(window);