function isAndroidStockBrowser() {
    var t = navigator.userAgent
      , e = -1 < t.indexOf("Android") && -1 < t.indexOf("Mozilla/5.0") && -1 < t.indexOf("AppleWebKit")
      , n = new RegExp(/AppleWebKit\/([\d.]+)/)
      , i = null === n.exec(t) ? null : parseFloat(n.exec(t)[1]);
    return e && null !== i && i < 537
}
function isSupportedBrowser() {
    if (isAndroidStockBrowser())
        return !1;
    return function testWebGl(t) {
        try {
            return !(!window.WebGLRenderingContext || !t.getContext("webgl") && !t.getContext("experimental-webgl"))
        } catch (t) {
            return !1
        }
    }(document.createElement("canvas"))
}
if (!isSupportedBrowser())
    throw new Error("Browser not supported");
!function() {
    var n = /^\s*function\s+([^\(\s]*)\s*/;
    function _name() {
        var t, e;
        return this === Function || this === Function.prototype.constructor ? e = "Function" : this !== Function.prototype && (e = (t = ("" + this).match(n)) && t[1]),
        e || ""
    }
    var t = !("name"in Function.prototype && "name"in function x() {}
    )
      , e = "function" == typeof Object.defineProperty && function() {
        var e;
        try {
            Object.defineProperty(Function.prototype, "_xyz", {
                get: function() {
                    return "blah"
                },
                configurable: !0
            }),
            e = "blah" === Function.prototype._xyz,
            delete Function.prototype._xyz
        } catch (t) {
            e = !1
        }
        return e
    }()
      , i = "function" == typeof Object.prototype.__defineGetter__ && function() {
        var e;
        try {
            Function.prototype.__defineGetter__("_abc", function() {
                return "foo"
            }),
            e = "foo" === Function.prototype._abc,
            delete Function.prototype._abc
        } catch (t) {
            e = !1
        }
        return e
    }();
    Function.prototype._name = _name,
    t && (e ? Object.defineProperty(Function.prototype, "name", {
        get: function() {
            var t = _name.call(this);
            return this !== Function.prototype && Object.defineProperty(this, "name", {
                value: t,
                configurable: !0
            }),
            t
        },
        configurable: !0
    }) : i && Function.prototype.__defineGetter__("name", function() {
        var t = _name.call(this);
        return this !== Function.prototype && this.__defineGetter__("name", function() {
            return t
        }),
        t
    }))
}(),
Array.prototype.findIndex || Object.defineProperty(Array.prototype, "findIndex", {
    value: function(t) {
        if (null == this)
            throw new TypeError('"this" is null or not defined');
        var e = Object(this)
          , n = e.length >>> 0;
        if ("function" != typeof t)
            throw new TypeError("predicate must be a function");
        for (var i = arguments[1], a = 0; a < n; ) {
            var o = e[a];
            if (t.call(i, o, a, e))
                return a;
            a++
        }
        return -1
    },
    configurable: !0,
    writable: !0
});
var DOMKit = function() {
    function DOMKit() {}
    return DOMKit.addClass = function(i, t) {
        "" !== t && t.trim().split(" ").forEach(function(t) {
            if (i instanceof HTMLCollection)
                for (var e = i.length; 0 < e--; ) {
                    var n = i.item(e);
                    n && n.classList.add(t)
                }
            else
                i.classList.add(t)
        }, this)
    }
    ,
    DOMKit.removeClass = function(i, t) {
        "" !== t && t.trim().split(" ").forEach(function(t) {
            if (i instanceof HTMLCollection)
                for (var e = i.length; 0 < e--; ) {
                    var n = i.item(e);
                    n && n.classList.remove(t)
                }
            else
                i.classList.remove(t)
        }, this)
    }
    ,
    DOMKit.toggleClass = function(e, t, n) {
        var i = this;
        "" !== t && t.trim().split(" ").forEach(function(t) {
            "boolean" != typeof n && (n = !i.hasClass(e, t)),
            n ? i.addClass(e, t) : i.removeClass(e, t)
        }, this)
    }
    ,
    DOMKit.hasClass = function(t, e) {
        return "" !== e && t.classList.contains(e)
    }
    ,
    DOMKit.remove = function(t) {
        function _(t) {
            t.parentElement && t.parentElement.removeChild(t)
        }
        if (t instanceof HTMLCollection)
            for (var e = t.length; 0 < e--; ) {
                var n = t.item(e);
                n && _(n)
            }
        else
            _(t)
    }
    ,
    DOMKit.empty = function(t) {
        for (; t.hasChildNodes(); )
            t.lastChild && t.removeChild(t.lastChild)
    }
    ,
    DOMKit.insertBefore = function(t, e) {
        e.parentNode && e.parentNode.insertBefore(t, e)
    }
    ,
    DOMKit.insertAfter = function(t, e) {
        e.parentNode && e.parentNode.insertBefore(t, e.nextSibling)
    }
    ,
    DOMKit.toggleDisplayStyle = function(t, e) {
        t.style.display = e ? "" : "none"
    }
    ,
    DOMKit.findElements = function(t, e) {
        return Array.prototype.slice.call(t.querySelectorAll(e))
    }
    ,
    DOMKit.HTMLCollectionToArray = function(t) {
        return Array.prototype.slice.call(t)
    }
    ,
    DOMKit.tokenListSupports = function(t, e) {
        if (!t || !t.supports)
            return !1;
        try {
            return t.supports(e)
        } catch (t) {
            return t instanceof TypeError && console.log("The DOMTokenList doesn't have a supported tokens list"),
            !1
        }
    }
    ,
    DOMKit.isInDOM = function(t) {
        return document.body.contains(t)
    }
    ,
    DOMKit
}();
!function() {
    function ra(t) {
        this.w = t || []
    }
    ra.prototype.set = function(t) {
        this.w[t] = !0
    }
    ,
    ra.prototype.encode = function() {
        for (var t = [], e = 0; e < this.w.length; e++)
            this.w[e] && (t[Math.floor(e / 6)] ^= 1 << e % 6);
        for (e = 0; e < t.length; e++)
            t[e] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".charAt(t[e] || 0);
        return t.join("") + "~"
    }
    ;
    var i = new ra;
    function J(t) {
        i.set(t)
    }
    function ta(t, e) {
        var n = new ra(a(t));
        n.set(e),
        t.set(Ct, n.w)
    }
    function ua(t) {
        t = a(t),
        t = new ra(t);
        for (var e = i.w.slice(), n = 0; n < t.w.length; n++)
            e[n] = e[n] || t.w[n];
        return new ra(e).encode()
    }
    function wa(t) {
        return "function" == typeof t
    }
    function ya(t) {
        return null != t && -1 < (t.constructor + "").indexOf("String")
    }
    function Aa(t) {
        return t ? t.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "") : ""
    }
    function Ba(t) {
        var e = u.createElement("img");
        return e.width = 1,
        e.height = 1,
        e.src = t,
        e
    }
    function Ca() {}
    function Da(t) {
        return encodeURIComponent instanceof Function ? encodeURIComponent(t) : (J(28),
        t)
    }
    function Ea(t, e, n, i) {
        try {
            t.addEventListener ? t.addEventListener(e, n, !!i) : t.attachEvent && t.attachEvent("on" + e, n)
        } catch (t) {
            J(27)
        }
    }
    function Ga(t, e, n) {
        t && (n ? (n = "",
        e && r.test(e) && (n = ' id="' + e + '"'),
        r.test(t) && u.write("<script" + n + ' src="' + t + '"><\/script>')) : ((n = u.createElement("script")).type = "text/javascript",
        n.async = !0,
        n.src = t,
        e && (n.id = e),
        (t = u.getElementsByTagName("script")[0]).parentNode.insertBefore(n, t)))
    }
    function Ha() {
        return "https:" == u.location.protocol
    }
    function Ia(t, e) {
        var n = t.match("(?:&|#|\\?)" + Da(e).replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1") + "=([^&#]*)");
        return n && 2 == n.length ? n[1] : ""
    }
    function Ka() {
        var t = "" + u.location.hostname;
        return 0 == t.indexOf("www.") ? t.substring(4) : t
    }
    function Qa(t, e) {
        if (1 == e.length && null != e[0] && "object" == typeof e[0])
            return e[0];
        for (var n = {}, i = Math.min(t.length + 1, e.length), a = 0; a < i; a++) {
            if ("object" == typeof e[a]) {
                for (var o in e[a])
                    e[a].hasOwnProperty(o) && (n[o] = e[a][o]);
                break
            }
            a < t.length && (n[t[a]] = e[a])
        }
        return n
    }
    function Ra() {
        this.keys = [],
        this.values = {},
        this.m = {}
    }
    var a = function(t) {
        return t = t.get(Ct),
        o(t) || (t = []),
        t
    }
      , o = function(t) {
        return "[object Array]" == Object.prototype.toString.call(Object(t))
    }
      , s = function(t, e) {
        return 0 == t.indexOf(e)
    }
      , r = /^[\w\-:/.?=&%!]+$/;
    Ra.prototype.set = function(t, e, n) {
        this.keys.push(t),
        n ? this.m[":" + t] = e : this.values[":" + t] = e
    }
    ,
    Ra.prototype.get = function(t) {
        return this.m.hasOwnProperty(":" + t) ? this.m[":" + t] : this.values[":" + t]
    }
    ,
    Ra.prototype.map = function(t) {
        for (var e = 0; e < this.keys.length; e++) {
            var n = this.keys[e]
              , i = this.get(n);
            i && t(n, i)
        }
    }
    ;
    function Xa(t) {
        var e = f._gaUserPrefs;
        if (e && e.ioo && e.ioo() || t && !0 === f["ga-disable-" + t])
            return !0;
        try {
            var n = f.external;
            if (n && n._gaUserPrefs && "oo" == n._gaUserPrefs)
                return !0
        } catch (t) {}
        return !1
    }
    function Ya(t) {
        var e = []
          , n = u.cookie.split(";");
        t = new RegExp("^\\s*" + t + "=\\s*(.*?)\\s*$");
        for (var i = 0; i < n.length; i++) {
            var a = n[i].match(t);
            a && e.push(a[1])
        }
        return e
    }
    function Za(t, e, n, i, a, o) {
        if (!(a = !Xa(a) && !(p.test(u.location.hostname) || "/" == n && g.test(i))))
            return !1;
        if (e && 1200 < e.length && (e = e.substring(0, 1200),
        J(24)),
        n = t + "=" + e + "; path=" + n + "; ",
        o && (n += "expires=" + new Date((new Date).getTime() + o).toGMTString() + "; "),
        i && "none" != i && (n += "domain=" + i + ";"),
        i = u.cookie,
        u.cookie = n,
        !(i = i != u.cookie))
            t: {
                for (t = Ya(t),
                i = 0; i < t.length; i++)
                    if (e == t[i]) {
                        i = !0;
                        break t
                    }
                i = !1
            }
        return i
    }
    function $a(t) {
        return Da(t).replace(/\(/g, "%28").replace(/\)/g, "%29")
    }
    function bb() {
        return (O || Ha() ? "https:" : "http:") + "//www.google-analytics.com"
    }
    function cb(t) {
        this.name = "len",
        this.message = t + "-8192"
    }
    function db(t, e, n) {
        if (n = n || Ca,
        e.length <= 2036)
            h(t, e, n);
        else {
            if (!(e.length <= 8192))
                throw y("len", e.length),
                new cb(e.length);
            m(t, e, n) || v(t, e, n) || h(t, e, n)
        }
    }
    function ib(t) {
        var e = l.gaData = l.gaData || {};
        return e[t] = e[t] || {}
    }
    function jb() {
        this.M = []
    }
    var l = window
      , u = document
      , f = window
      , g = /^(www\.)?google(\.com?)?(\.[a-z]{2})?$/
      , p = /(^|\.)doubleclick\.net$/i
      , h = function(t, e, n) {
        var i = Ba(t + "?" + e);
        i.onload = i.onerror = function() {
            i.onload = null,
            i.onerror = null,
            n()
        }
    }
      , v = function(t, e, n) {
        var i = l.XMLHttpRequest;
        if (!i)
            return !1;
        var a = new i;
        return "withCredentials"in a && (a.open("POST", t, !0),
        a.withCredentials = !0,
        a.setRequestHeader("Content-Type", "text/plain"),
        a.onreadystatechange = function() {
            4 == a.readyState && (n(),
            a = null)
        }
        ,
        a.send(e),
        !0)
    }
      , m = function(t, e, n) {
        return !!l.navigator.sendBeacon && (!!l.navigator.sendBeacon(t, e) && (n(),
        !0))
    }
      , y = function(t, e, n) {
        1 <= 100 * Math.random() || Xa("?") || (t = ["t=error", "_e=" + t, "_v=j47", "sr=1"],
        e && t.push("_f=" + e),
        n && t.push("_m=" + Da(n.substring(0, 100))),
        t.push("aip=1"),
        t.push("z=" + w()),
        h(bb() + "/collect", t.join("&"), Ca))
    };
    function Ja(t) {
        if (100 != t.get(Zt) && La(pb(t, Ht)) % 1e4 >= 100 * qb(t, Zt))
            throw "abort"
    }
    function Ma(t) {
        if (Xa(pb(t, Ft)))
            throw "abort"
    }
    function Oa() {
        var t = u.location.protocol;
        if ("http:" != t && "https:" != t)
            throw "abort"
    }
    function Pa(i) {
        try {
            l.navigator.sendBeacon ? J(42) : l.XMLHttpRequest && "withCredentials"in new l.XMLHttpRequest && J(40)
        } catch (t) {}
        i.set(wt, ua(i), !0),
        i.set(t, qb(i, t) + 1);
        var a = [];
        C.map(function(t, e) {
            if (e.F) {
                var n = i.get(t);
                null != n && n != e.defaultValue && ("boolean" == typeof n && (n *= 1),
                a.push(e.F + "=" + Da("" + n)))
            }
        }),
        a.push("z=" + lb()),
        i.set(R, a.join("&"), !0)
    }
    function Sa(t) {
        var e = pb(t, te) || bb() + "/collect"
          , n = pb(t, _);
        if (!n && t.get(I) && (n = "beacon"),
        n) {
            var i = pb(t, R)
              , a = (a = t.get(D)) || Ca;
            "image" == n ? h(e, i, a) : "xhr" == n && v(e, i, a) || "beacon" == n && m(e, i, a) || db(e, i, a)
        } else
            db(e, pb(t, R), t.get(D));
        e = t.get(Ft),
        n = (e = ib(e)).hitcount,
        e.hitcount = n ? n + 1 : 1,
        e = t.get(Ft),
        delete ib(e).pending_experiments,
        t.set(D, Ca, !0)
    }
    function Hc(t) {
        var e;
        (l.gaData = l.gaData || {}).expId && t.set(dt, (l.gaData = l.gaData || {}).expId),
        (l.gaData = l.gaData || {}).expVar && t.set(ft, (l.gaData = l.gaData || {}).expVar);
        var n = t.get(Ft);
        if (n = ib(n).pending_experiments) {
            var i = [];
            for (e in n)
                n.hasOwnProperty(e) && n[e] && i.push(encodeURIComponent(e) + "." + encodeURIComponent(n[e]));
            e = i.join("!")
        } else
            e = void 0;
        e && t.set(gt, e, !0)
    }
    function cd() {
        if (l.navigator && "preview" == l.navigator.loadPurpose)
            throw "abort"
    }
    function yd(t) {
        var e = l.gaDevIds;
        o(e) && 0 != e.length && t.set("&did", e.join(","), !0)
    }
    function vb(t) {
        if (!t.get(Ft))
            throw "abort"
    }
    jb.prototype.add = function(t) {
        this.M.push(t)
    }
    ,
    jb.prototype.D = function(t) {
        try {
            for (var e = 0; e < this.M.length; e++) {
                var n = t.get(this.M[e]);
                n && wa(n) && n.call(l, t)
            }
        } catch (t) {}
        (e = t.get(D)) != Ca && wa(e) && (t.set(D, Ca, !0),
        setTimeout(e, 10))
    }
    ;
    function lb() {
        try {
            var t = new Uint32Array(1);
            return l.crypto.getRandomValues(t),
            2147483647 & t[0]
        } catch (t) {
            return w()
        }
    }
    var w = function() {
        return Math.round(2147483647 * Math.random())
    };
    function Ta(t) {
        var e = qb(t, mt);
        if (500 <= e && J(15),
        "transaction" != (n = pb(t, M)) && "item" != n) {
            var n = qb(t, yt)
              , i = (new Date).getTime()
              , a = qb(t, bt);
            if (0 == a && t.set(bt, i),
            0 < (a = Math.round(2 * (i - a) / 1e3)) && (n = Math.min(n + a, 20),
            t.set(bt, i)),
            n <= 0)
                throw "abort";
            t.set(yt, --n)
        }
        t.set(mt, ++e)
    }
    function mb() {
        this.data = new Ra
    }
    var C = new Ra
      , S = [];
    mb.prototype.get = function(t) {
        var e = x(t)
          , n = this.data.get(t);
        return e && null == n && (n = wa(e.defaultValue) ? e.defaultValue() : e.defaultValue),
        e && e.Z ? e.Z(this, t, n) : n
    }
    ;
    function pb(t, e) {
        var n = t.get(e);
        return null == n ? "" : "" + n
    }
    function qb(t, e) {
        var n = t.get(e);
        return null == n || "" === n ? 0 : 1 * n
    }
    mb.prototype.set = function(t, e, n) {
        if (t)
            if ("object" == typeof t)
                for (var i in t)
                    t.hasOwnProperty(i) && E(this, i, t[i], n);
            else
                E(this, t, e, n)
    }
    ;
    function sb(t, e, n, i, a) {
        this.name = t,
        this.F = e,
        this.Z = i,
        this.o = a,
        this.defaultValue = n
    }
    function wb(t, e, n, i, a) {
        return t = new sb(t,e,n,i,a),
        C.set(t.name, t),
        t.name
    }
    function xb(t, e) {
        S.push([new RegExp("^" + t + "$"), e])
    }
    function yb(t, e, n) {
        return wb(t, e, n, void 0, T)
    }
    var E = function(t, e, n, i) {
        if (null != n)
            switch (e) {
            case Ft:
                Oe.test(n)
            }
        var a = x(e);
        a && a.o ? a.o(t, e, n, i) : t.data.set(e, n, i)
    }
      , x = function(t) {
        var e = C.get(t);
        if (!e)
            for (var n = 0; n < S.length; n++) {
                var i = S[n]
                  , a = i[0].exec(t);
                if (a) {
                    e = i[1](a),
                    C.set(e.name, e);
                    break
                }
            }
        return e
    }
      , T = function() {}
      , A = ya(window.GoogleAnalyticsObject) && Aa(window.GoogleAnalyticsObject) || "ga"
      , O = !1
      , k = yb("apiVersion", "v")
      , L = yb("clientVersion", "_v");
    wb("anonymizeIp", "aip");
    var e = wb("adSenseId", "a")
      , M = wb("hitType", "t")
      , D = wb("hitCallback")
      , R = wb("hitPayload");
    wb("nonInteraction", "ni"),
    wb("currencyCode", "cu"),
    wb("dataSource", "ds");
    var I = wb("useBeacon", void 0, !1)
      , _ = wb("transport");
    wb("sessionControl", "sc", ""),
    wb("sessionGroup", "sg"),
    wb("queueTime", "qt");
    var t = wb("_s", "_s");
    wb("screenName", "cd");
    var P = wb("location", "dl", "")
      , N = wb("referrer", "dr")
      , n = wb("page", "dp", "");
    wb("hostname", "dh");
    var B = wb("language", "ul")
      , H = wb("encoding", "de");
    wb("title", "dt", function() {
        return u.title || void 0
    }),
    xb("contentGroup([0-9]+)", function(t) {
        return new sb(t[0],"cg" + t[1])
    });
    var W = wb("screenColors", "sd")
      , j = wb("screenResolution", "sr")
      , F = wb("viewportSize", "vp")
      , V = wb("javaEnabled", "je")
      , z = wb("flashVersion", "fl");
    wb("campaignId", "ci"),
    wb("campaignName", "cn"),
    wb("campaignSource", "cs"),
    wb("campaignMedium", "cm"),
    wb("campaignKeyword", "ck"),
    wb("campaignContent", "cc");
    var G = wb("eventCategory", "ec")
      , K = wb("eventAction", "ea")
      , q = wb("eventLabel", "el")
      , U = wb("eventValue", "ev")
      , $ = wb("socialNetwork", "sn")
      , Z = wb("socialAction", "sa")
      , Y = wb("socialTarget", "st")
      , Q = wb("l1", "plt")
      , tt = wb("l2", "pdt")
      , et = wb("l3", "dns")
      , nt = wb("l4", "rrt")
      , it = wb("l5", "srt")
      , at = wb("l6", "tcp")
      , ot = wb("l7", "dit")
      , rt = wb("l8", "clt")
      , st = wb("timingCategory", "utc")
      , lt = wb("timingVar", "utv")
      , ut = wb("timingLabel", "utl")
      , ct = wb("timingValue", "utt");
    wb("appName", "an"),
    wb("appVersion", "av", ""),
    wb("appId", "aid", ""),
    wb("appInstallerId", "aiid", ""),
    wb("exDescription", "exd"),
    wb("exFatal", "exf");
    var dt = wb("expId", "xid")
      , ft = wb("expVar", "xvar")
      , gt = wb("exp", "exp")
      , pt = wb("_utma", "_utma")
      , ht = wb("_utmz", "_utmz")
      , vt = wb("_utmht", "_utmht")
      , mt = wb("_hc", void 0, 0)
      , bt = wb("_ti", void 0, 0)
      , yt = wb("_to", void 0, 20);
    xb("dimension([0-9]+)", function(t) {
        return new sb(t[0],"cd" + t[1])
    }),
    xb("metric([0-9]+)", function(t) {
        return new sb(t[0],"cm" + t[1])
    }),
    wb("linkerParam", void 0, void 0, function Bc(t) {
        var e = Ic(t = t.get(Ht), 0);
        return "_ga=1." + Da(e + "." + t)
    }, T);
    var wt = wb("usage", "_u")
      , Ct = wb("_um");
    wb("forceSSL", void 0, void 0, function() {
        return O
    }, function(t, e, n) {
        J(34),
        O = !!n
    });
    var St = wb("_j1", "jid");
    xb("\\&(.*)", function(t) {
        var e = new sb(t[0],t[1])
          , a = function(n) {
            var i;
            return C.map(function(t, e) {
                e.F == n && (i = e)
            }),
            i && i.name
        }(t[0].substring(1));
        return a && (e.Z = function(t) {
            return t.get(a)
        }
        ,
        e.o = function(t, e, n, i) {
            t.set(a, n, i)
        }
        ,
        e.F = void 0),
        e
    });
    var Et = yb("_oot")
      , xt = wb("previewTask")
      , Tt = wb("checkProtocolTask")
      , At = wb("validationTask")
      , Ot = wb("checkStorageTask")
      , kt = wb("historyImportTask")
      , Lt = wb("samplerTask")
      , Mt = wb("_rlt")
      , Dt = wb("buildHitTask")
      , Rt = wb("sendHitTask")
      , It = wb("ceTask")
      , _t = wb("devIdTask")
      , Pt = wb("timingTask")
      , Nt = wb("displayFeaturesTask")
      , Bt = yb("name")
      , Ht = yb("clientId", "cid")
      , Wt = yb("clientIdTime")
      , jt = wb("userId", "uid")
      , Ft = yb("trackingId", "tid")
      , Vt = yb("cookieName", void 0, "_ga")
      , zt = yb("cookieDomain")
      , Gt = yb("cookiePath", void 0, "/")
      , Jt = yb("cookieExpires", void 0, 63072e3)
      , Kt = yb("legacyCookieDomain")
      , Xt = yb("legacyHistoryImport", void 0, !0)
      , qt = yb("storage", void 0, "cookie")
      , Ut = yb("allowLinker", void 0, !1)
      , $t = yb("allowAnchor", void 0, !0)
      , Zt = yb("sampleRate", "sf", 100)
      , Yt = yb("siteSpeedSampleRate", void 0, 1)
      , Qt = yb("alwaysSendReferrer", void 0, !1)
      , te = wb("transportUrl")
      , ne = wb("_r", "_r");
    function X(e, t, n, i) {
        t[e] = function() {
            try {
                return i && J(i),
                n.apply(this, arguments)
            } catch (t) {
                throw y("exc", e, t && t.name),
                t
            }
        }
    }
    function kd(t) {
        this.V = t,
        this.fa = void 0,
        this.$ = !1,
        this.oa = void 0,
        this.ea = 1
    }
    function ld(t, e) {
        var n;
        if (t.fa && t.$)
            return 0;
        if (t.$ = !0,
        e) {
            if (t.oa && qb(e, t.oa))
                return qb(e, t.oa);
            if (0 == e.get(Yt))
                return 0
        }
        return 0 == t.V ? 0 : (void 0 === n && (n = lb()),
        0 == n % t.V ? Math.floor(n / t.V) % t.ea + 1 : 0)
    }
    function rd(n) {
        return function(t) {
            if ("pageview" == t.get(M) && !n.I) {
                n.I = !0;
                var e = function(t) {
                    var e = Math.min(qb(t, Yt), 100);
                    return !(La(pb(t, Ht)) % 100 >= e)
                }(t);
                t = 0 < Ia(t.get(P), "gclid").length,
                (e || t) && ie(function(t) {
                    n.send(e ? "timing" : "adtiming", t)
                })
            }
        }
    }
    function vd(t) {
        if ("cookie" == pb(t, qt)) {
            var e = pb(t, Vt)
              , n = le(t)
              , i = de(pb(t, Gt))
              , a = ue(pb(t, zt))
              , o = 1e3 * qb(t, Jt)
              , r = pb(t, Ft);
            if ("auto" != a)
                Za(e, n, i, a, r, o) && (se = !0);
            else {
                var s;
                if (J(32),
                n = [],
                4 != (a = Ka().split(".")).length || (s = a[a.length - 1],
                parseInt(s, 10) != s)) {
                    for (s = a.length - 2; 0 <= s; s--)
                        n.push(a.slice(s).join("."));
                    n.push("none"),
                    s = n
                } else
                    s = ["none"];
                for (var l = 0; l < s.length; l++)
                    if (a = s[l],
                    t.data.set(zt, a),
                    n = le(t),
                    Za(e, n, i, a, r, o))
                        return void (se = !0);
                t.data.set(zt, "auto")
            }
        }
    }
    function wd(t) {
        if ("cookie" == pb(t, qt) && !se && (vd(t),
        !se))
            throw "abort"
    }
    function xd(t) {
        if (t.get(Xt)) {
            var e = pb(t, zt)
              , n = pb(t, Kt) || Ka()
              , i = Xc("__utma", n, e);
            i && (J(19),
            t.set(vt, (new Date).getTime(), !0),
            t.set(pt, i.R),
            (e = Xc("__utmz", n, e)) && i.hash == e.hash && t.set(ht, e.R))
        }
    }
    function Ad(t, e, n) {
        for (var i, a = [], o = [], r = 0; r < t.length; r++) {
            var s = t[r];
            s.H[n] == e ? a.push(s) : null == i || s.H[n] < i ? (o = [s],
            i = s.H[n]) : s.H[n] == i && o.push(s)
        }
        return 0 < a.length ? a : o
    }
    var ie = function(t) {
        var e = {};
        if (ae(e) || oe(e)) {
            var n = e[Q];
            null == n || 1 / 0 == n || isNaN(n) || (0 < n ? (re(e, et),
            re(e, at),
            re(e, it),
            re(e, tt),
            re(e, nt),
            re(e, ot),
            re(e, rt),
            t(e)) : Ea(l, "load", function() {
                ie(t)
            }, !1))
        }
    }
      , ae = function(t) {
        var e;
        if (!(e = (e = l.performance || l.webkitPerformance) && e.timing))
            return !1;
        var n = e.navigationStart;
        return 0 != n && (t[Q] = e.loadEventStart - n,
        t[et] = e.domainLookupEnd - e.domainLookupStart,
        t[at] = e.connectEnd - e.connectStart,
        t[it] = e.responseStart - e.requestStart,
        t[tt] = e.responseEnd - e.responseStart,
        t[nt] = e.fetchStart - n,
        t[ot] = e.domInteractive - n,
        t[rt] = e.domContentLoadedEventStart - n,
        !0)
    }
      , oe = function(t) {
        if (l.top != l)
            return !1;
        var e = l.external
          , n = e && e.onloadT;
        return e && !e.isValidLoadTime && (n = void 0),
        2147483648 < n && (n = void 0),
        0 < n && e.setPageReadyTime(),
        null != n && (t[Q] = n,
        !0)
    }
      , re = function(t, e) {
        var n = t[e];
        (isNaN(n) || 1 / 0 == n || n < 0) && (t[e] = void 0)
    }
      , se = !1
      , le = function(t) {
        var e = $a(pb(t, Ht))
          , n = ue(pb(t, zt)).split(".").length;
        return 1 < (t = fe(pb(t, Gt))) && (n += "-" + t),
        ["GA1", n, e].join(".")
    }
      , ue = function(t) {
        return 0 == t.indexOf(".") ? t.substr(1) : t
    }
      , de = function(t) {
        return t ? (1 < t.length && t.lastIndexOf("/") == t.length - 1 && (t = t.substr(0, t.length - 1)),
        0 != t.indexOf("/") && (t = "/" + t),
        t) : "/"
    }
      , fe = function(t) {
        return "/" == (t = de(t)) ? 1 : t.split("/").length
    };
    function Xc(t, e, n) {
        "none" == e && (e = "");
        var i = []
          , a = Ya(t);
        t = "__utma" == t ? 6 : 2;
        for (var o = 0; o < a.length; o++) {
            var r = ("" + a[o]).split(".");
            r.length >= t && i.push({
                hash: r[0],
                R: a[o],
                O: r
            })
        }
        if (0 != i.length)
            return 1 == i.length ? i[0] : Zc(e, i) || Zc(n, i) || Zc(null, i) || i[0]
    }
    function Zc(t, e) {
        var n, i;
        null == t ? n = i = 1 : (n = La(t),
        i = La(s(t, ".") ? t.substring(1) : "." + t));
        for (var a = 0; a < e.length; a++)
            if (e[a].hash == n || e[a].hash == i)
                return e[a]
    }
    var ge = new RegExp(/^https?:\/\/([^\/:]+)/)
      , pe = /(.*)([?&#])(?:_ga=[^&#]*)(?:&?)(.*)/;
    function Ic(t, e) {
        for (var n = new Date, i = (a = l.navigator).plugins || [], a = (n = [t, a.userAgent, n.getTimezoneOffset(), n.getYear(), n.getDate(), n.getHours(), n.getMinutes() + e],
        0); a < i.length; ++a)
            n.push(i[a].description);
        return La(n.join("."))
    }
    function Gd(t) {
        J(48),
        this.target = t,
        this.T = !1
    }
    Gd.prototype.ca = function(t, e) {
        if (t.tagName) {
            if ("a" == t.tagName.toLowerCase())
                return void (t.href && (t.href = he(this, t.href, e)));
            if ("form" == t.tagName.toLowerCase())
                return ve(this, t)
        }
        if ("string" == typeof t)
            return he(this, t, e)
    }
    ;
    var he = function(t, e, n) {
        (a = pe.exec(e)) && 3 <= a.length && (e = a[1] + (a[3] ? a[2] + a[3] : "")),
        t = t.target.get("linkerParam");
        var i = e.indexOf("?")
          , a = e.indexOf("#");
        return n ? e += (-1 == a ? "#" : "&") + t : (n = -1 == i ? "?" : "&",
        e = -1 == a ? e + (n + t) : e.substring(0, a) + n + t + e.substring(a)),
        e.replace(/&+_ga=/, "&_ga=")
    }
      , ve = function(t, e) {
        if (e && e.action) {
            var n = t.target.get("linkerParam").split("=")[1];
            if ("get" == e.method.toLowerCase()) {
                for (var i = e.childNodes || [], a = 0; a < i.length; a++)
                    if ("_ga" == i[a].name)
                        return void i[a].setAttribute("value", n);
                (i = u.createElement("input")).setAttribute("type", "hidden"),
                i.setAttribute("name", "_ga"),
                i.setAttribute("value", n),
                e.appendChild(i)
            } else
                "post" == e.method.toLowerCase() && (e.action = he(t, e.action))
        }
    };
    function sd(t, e) {
        if (e == u.location.hostname)
            return !1;
        for (var n = 0; n < t.length; n++)
            if (t[n]instanceof RegExp) {
                if (t[n].test(e))
                    return !0
            } else if (0 <= e.indexOf(t[n]))
                return !0;
        return !1
    }
    Gd.prototype.S = function(i, a, t) {
        function d(t) {
            try {
                var e;
                t = t || l.event;
                t: {
                    var n = t.target || t.srcElement;
                    for (t = 100; n && 0 < t; ) {
                        if (n.href && n.nodeName.match(/^a(?:rea)?$/i)) {
                            e = n;
                            break t
                        }
                        n = n.parentNode,
                        t--
                    }
                    e = {}
                }
                ("http:" == e.protocol || "https:" == e.protocol) && sd(i, e.hostname || "") && e.href && (e.href = he(o, e.href, a))
            } catch (t) {
                J(26)
            }
        }
        var o = this;
        this.T || (this.T = !0,
        Ea(u, "mousedown", d, !1),
        Ea(u, "keyup", d, !1)),
        t && Ea(u, "submit", function(t) {
            if ((t = (t = t || l.event).target || t.srcElement) && t.action) {
                var e = t.action.match(ge);
                e && sd(i, e[1]) && ve(o, t)
            }
        })
    }
    ;
    function Nd(t, e, n) {
        this.U = St,
        this.aa = e,
        (e = n) || (e = (e = pb(t, Bt)) && "t0" != e ? Ae.test(e) ? "_gat_" + $a(pb(t, Ft)) : "_gat_" + $a(e) : "_gat"),
        this.Y = e,
        ld(new kd(100), t) && (J(30),
        this.pa = !0)
    }
    function Td(t, e) {
        var n, i = t.b;
        i.get("dcLoaded") || (ta(i, 29),
        (e = e || {})[Vt] && (n = $a(e[Vt])),
        function(n, t) {
            var i = t.get(Dt);
            t.set(Dt, function(t) {
                Ee(n, t);
                var e = i(t);
                return xe(n, t),
                e
            });
            var a = t.get(Rt);
            t.set(Rt, function(t) {
                var e = a(t);
                return Te(n, t),
                e
            })
        }(n = new Nd(i,"https://stats.g.doubleclick.net/r/collect?t=dc&aip=1&_r=3&",n), i),
        i.set("dcLoaded", !0))
    }
    function Ud(t) {
        if (!t.get("dcLoaded") && "cookie" == t.get(qt)) {
            ta(t, 51);
            var e = new Nd(t);
            Ee(e, t),
            xe(e, t),
            t.get(e.U) && (t.set(ne, 1, !0),
            t.set(te, bb() + "/r/collect", !0))
        }
    }
    function Zd(t) {
        function b(t, e) {
            n.b.data.set(t, e)
        }
        function c(t, e) {
            b(t, e),
            n.filters.add(t)
        }
        var n = this;
        this.b = new mb,
        this.filters = new jb,
        b(Bt, t[Bt]),
        b(Ft, Aa(t[Ft])),
        b(Vt, t[Vt]),
        b(zt, t[zt] || Ka()),
        b(Gt, t[Gt]),
        b(Jt, t[Jt]),
        b(Kt, t[Kt]),
        b(Xt, t[Xt]),
        b(Ut, t[Ut]),
        b($t, t[$t]),
        b(Zt, t[Zt]),
        b(Yt, t[Yt]),
        b(Qt, t[Qt]),
        b(qt, t[qt]),
        b(jt, t[jt]),
        b(Wt, t[Wt]),
        b(k, 1),
        b(L, "j47"),
        c(Et, Ma),
        c(xt, cd),
        c(Tt, Oa),
        c(At, vb),
        c(Ot, wd),
        c(kt, xd),
        c(Lt, Ja),
        c(Mt, Ta),
        c(It, Hc),
        c(_t, yd),
        c(Nt, Ud),
        c(Dt, Pa),
        c(Rt, Sa),
        c(Pt, rd(this)),
        ke(this.b, t[Ht]),
        Le(this.b),
        this.b.set(e, function() {
            var t = l.gaGlobal = l.gaGlobal || {};
            return t.hid = t.hid || w()
        }()),
        function(t, e, n) {
            if (!ye) {
                var i;
                i = u.location.hash;
                var a = l.name
                  , o = /^#?gaso=([^&]*)/;
                (a = (i = (i = i && i.match(o) || a && a.match(o)) ? i[1] : Ya("GASO")[0] || "") && i.match(/^(?:!([-0-9a-z.]{1,40})!)?([-.\w]{10,1200})$/i)) && (Za("GASO", "" + i, n, e, t, 0),
                window._udo || (window._udo = e),
                window._utcp || (window._utcp = n),
                t = a[1],
                Ga("https://www.google.com/analytics/web/inpage/pub/inpage.js?" + (t ? "prefix=" + t + "&" : "") + w(), "_gasojs")),
                ye = !0
            }
        }(this.b.get(Ft), this.b.get(zt), this.b.get(Gt))
    }
    var ye, we = /^(GTM|OPT)-[A-Z0-9]+$/, Ce = /;_gaexp=[^;]*/g, Se = /;((__utma=)|([^;=]+=GAX?\d+\.))[^;]*/g, Ee = function(t, e) {
        e.get(t.U) || ("1" == Ya(t.Y)[0] ? e.set(t.U, "", !0) : e.set(t.U, "" + w(), !0))
    }, xe = function(t, e) {
        if (e.get(t.U)) {
            var n = 6e5;
            t.pa && (n /= 10),
            Za(t.Y, "1", e.get(Gt), e.get(zt), e.get(Ft), n)
        }
    }, Te = function(t, e) {
        if (e.get(t.U)) {
            function ek(t) {
                x(t).F && n.set(x(t).F, e.get(t))
            }
            var n = new Ra;
            ek(k),
            ek(L),
            ek(Ft),
            ek(Ht),
            ek(jt),
            ek(t.U),
            n.set(x(wt).F, ua(e));
            var i = t.aa;
            n.map(function(t, e) {
                i += Da(t) + "=",
                i += Da("" + e) + "&"
            }),
            i += "z=" + w(),
            Ba(i),
            e.set(t.U, "", !0)
        }
    }, Ae = /^gtm\d+$/, Oe = /^(UA|YT|MO|GP)-(\d+)-(\d+)$/, ke = function(t, e) {
        if ("cookie" == pb(t, qt)) {
            var n;
            se = !1;
            t: {
                var i = Ya(pb(t, Vt));
                if (i && !(i.length < 1)) {
                    n = [];
                    for (var a = 0; a < i.length; a++) {
                        var o, r = (o = i[a].split(".")).shift();
                        (o = ("GA1" == r || "1" == r) && 1 < o.length ? (1 == (r = o.shift().split("-")).length && (r[1] = "1"),
                        r[0] *= 1,
                        r[1] *= 1,
                        {
                            H: r,
                            s: o.join(".")
                        }) : void 0) && n.push(o)
                    }
                    if (1 == n.length) {
                        J(13),
                        n = n[0].s;
                        break t
                    }
                    if (0 != n.length) {
                        if (J(14),
                        i = ue(pb(t, zt)).split(".").length,
                        1 == (n = Ad(n, i, 0)).length) {
                            n = n[0].s;
                            break t
                        }
                        i = fe(pb(t, Gt)),
                        n = (n = Ad(n, i, 1))[0] && n[0].s;
                        break t
                    }
                    J(12)
                }
                n = void 0
            }
            n || (n = pb(t, zt),
            n = null != (n = Xc("__utma", i = pb(t, Kt) || Ka(), n)) ? (J(10),
            n.O[1] + "." + n.O[2]) : void 0),
            n && (t.data.set(Ht, n),
            se = !0)
        }
        if (n = t.get($t),
        (a = Ia(u.location[n ? "href" : "search"], "_ga")) && (t.get(Ut) ? -1 == (n = a.indexOf(".")) ? J(22) : (i = a.substring(n + 1),
        "1" != a.substring(0, n) ? J(22) : -1 == (n = i.indexOf(".")) ? J(22) : (a = i.substring(0, n)) != Ic(n = i.substring(n + 1), 0) && a != Ic(n, -1) && a != Ic(n, -2) ? J(23) : (J(11),
        t.data.set(Ht, n))) : J(21)),
        e && (J(9),
        t.data.set(Ht, Da(e))),
        !t.get(Ht))
            if (n = (n = l.gaGlobal && l.gaGlobal.vid) && -1 != n.search(/^(?:utma\.)?\d+\.\d+$/) ? n : void 0)
                J(17),
                t.data.set(Ht, n);
            else {
                for (J(8),
                i = (n = l.navigator.userAgent + (u.cookie ? u.cookie : "") + (u.referrer ? u.referrer : "")).length,
                a = l.history.length; 0 < a; )
                    n += a-- ^ i++;
                t.data.set(Ht, [w() ^ 2147483647 & La(n), Math.round((new Date).getTime() / 1e3)].join("."))
            }
        vd(t)
    }, Le = function(t) {
        var e = l.navigator
          , n = l.screen
          , i = u.location;
        if (t.set(N, function(t) {
            var e = u.referrer;
            if (/^https?:\/\//i.test(e)) {
                if (t)
                    return e;
                t = "//" + u.location.hostname;
                var n = e.indexOf(t);
                if ((5 == n || 6 == n) && ("/" == (t = e.charAt(n + t.length)) || "?" == t || "" == t || ":" == t))
                    return;
                return e
            }
        }(t.get(Qt))),
        i) {
            var a = i.pathname || "";
            "/" != a.charAt(0) && (J(31),
            a = "/" + a),
            t.set(P, i.protocol + "//" + i.hostname + a + i.search)
        }
        n && t.set(j, n.width + "x" + n.height),
        n && t.set(W, n.colorDepth + "-bit");
        n = u.documentElement;
        var o = (a = u.body) && a.clientWidth && a.clientHeight
          , r = [];
        if (n && n.clientWidth && n.clientHeight && ("CSS1Compat" === u.compatMode || !o) ? r = [n.clientWidth, n.clientHeight] : o && (r = [a.clientWidth, a.clientHeight]),
        n = r[0] <= 0 || r[1] <= 0 ? "" : r.join("x"),
        t.set(F, n),
        t.set(z, function fc() {
            var t, e, n;
            if ((n = (n = l.navigator) ? n.plugins : null) && n.length)
                for (var i = 0; i < n.length && !e; i++) {
                    var a = n[i];
                    -1 < a.name.indexOf("Shockwave Flash") && (e = a.description)
                }
            if (!e)
                try {
                    e = (t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7")).GetVariable("$version")
                } catch (t) {}
            if (!e)
                try {
                    t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"),
                    e = "WIN 6,0,21,0",
                    t.AllowScriptAccess = "always",
                    e = t.GetVariable("$version")
                } catch (t) {}
            if (!e)
                try {
                    e = (t = new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
                } catch (t) {}
            return e && (t = e.match(/[\d]+/g)) && 3 <= t.length && (e = t[0] + "." + t[1] + " r" + t[2]),
            e || void 0
        }()),
        t.set(H, u.characterSet || u.charset),
        t.set(V, e && "function" == typeof e.javaEnabled && e.javaEnabled() || !1),
        t.set(B, (e && (e.language || e.browserLanguage) || "").toLowerCase()),
        i && t.get($t) && (e = u.location.hash)) {
            for (e = e.split(/[?&#]+/),
            i = [],
            n = 0; n < e.length; ++n)
                (s(e[n], "utm_id") || s(e[n], "utm_campaign") || s(e[n], "utm_source") || s(e[n], "utm_medium") || s(e[n], "utm_term") || s(e[n], "utm_content") || s(e[n], "gclid") || s(e[n], "dclid") || s(e[n], "gclsrc")) && i.push(e[n]);
            0 < i.length && (e = "#" + i.join("&"),
            t.set(P, t.get(P) + e))
        }
    };
    Zd.prototype.get = function(t) {
        return this.b.get(t)
    }
    ,
    Zd.prototype.set = function(t, e) {
        this.b.set(t, e)
    }
    ;
    var Me = {
        pageview: [n],
        event: [G, K, q, U],
        social: [$, Z, Y],
        timing: [st, lt, ct, ut]
    };
    Zd.prototype.send = function(t) {
        var e, n;
        arguments.length < 1 || (n = "string" == typeof t ? (e = t,
        [].slice.call(arguments, 1)) : (e = t && t[M],
        arguments),
        e && ((n = Qa(Me[e] || [], n))[M] = e,
        this.b.set(n, void 0, !0),
        this.filters.D(this.b),
        this.b.data.m = {}))
    }
    ,
    Zd.prototype.ma = function(t, e) {
        var n = this;
        Ne(t, n, e) || (He(t, function() {
            Ne(t, n, e)
        }),
        Be(String(n.get(Bt)), t, void 0, e, !0))
    }
    ;
    function be(t) {
        return "prerender" != u.visibilityState && (t(),
        !0)
    }
    function ce(n) {
        if (!be(n)) {
            J(16);
            var i = !1
              , a = function() {
                if (!i && be(n)) {
                    i = !0;
                    var t = a
                      , e = u;
                    e.removeEventListener ? e.removeEventListener("visibilitychange", t, !1) : e.detachEvent && e.detachEvent("onvisibilitychange", t)
                }
            };
            Ea(u, "visibilitychange", a)
        }
    }
    function ee(t) {
        if (wa(t[0]))
            this.u = t[0];
        else {
            var e = Pe.exec(t[0]);
            if (null != e && 4 == e.length && (this.c = e[1] || "t0",
            this.K = e[2] || "",
            this.C = e[3],
            this.a = [].slice.call(t, 1),
            this.K || (this.A = "create" == this.C,
            this.i = "require" == this.C,
            this.g = "provide" == this.C,
            this.ba = "remove" == this.C),
            this.i && (3 <= this.a.length ? (this.X = this.a[1],
            this.W = this.a[2]) : this.a[1] && (ya(this.a[1]) ? this.X = this.a[1] : this.W = this.a[1]))),
            e = t[1],
            t = t[2],
            !this.C)
                throw "abort";
            if (this.i && (!ya(e) || "" == e))
                throw "abort";
            if (this.g && (!ya(e) || "" == e || !wa(t)))
                throw "abort";
            if (ud(this.c) || ud(this.K))
                throw "abort";
            if (this.g && "t0" != this.c)
                throw "abort"
        }
    }
    var De, Re, Ie, _e, Pe = /^(?:(\w+)\.)?(?:(\w+):)?(\w+)$/;
    function ud(t) {
        return 0 <= t.indexOf(".") || 0 <= t.indexOf(":")
    }
    De = new Ra,
    Ie = new Ra,
    _e = new Ra,
    Re = {
        ec: 45,
        ecommerce: 46,
        linkid: 47
    };
    function me(t, e) {
        De.set(t, e);
        for (var n = _e.get(t) || [], i = 0; i < n.length; i++)
            n[i]();
        _e.set(t, [])
    }
    var Ne = function(t, e, n) {
        e == Ve || e.get(Bt);
        var i = De.get(t);
        return !!wa(i) && (e.plugins_ = e.plugins_ || new Ra,
        e.plugins_.get(t) || e.plugins_.set(t, new i(e,n || {})),
        !0)
    }
      , Be = function(t, e, n, i, a) {
        if (!wa(De.get(e)) && !Ie.get(e)) {
            if (Re.hasOwnProperty(e) && J(Re[e]),
            we.test(e)) {
                if (J(52),
                !(t = Ve.j(t)))
                    return !0;
                i = {
                    id: e,
                    B: (n = i || {}).dataLayer || "dataLayer",
                    ia: !!t.get("anonymizeIp"),
                    na: a,
                    G: !1
                },
                t.get("&gtm") == e && (i.G = !0);
                var o = String(t.get("name"));
                "t0" != o && (i.target = o),
                Xa(String(t.get("trackingId"))) || (i.ja = String(t.get(Ht)),
                i.ka = Number(t.get(Wt)),
                t = n.palindrome ? Se : Ce,
                t = (t = u.cookie.replace(/^|(; +)/g, ";").match(t)) ? t.sort().join("").substring(1) : void 0,
                i.la = t),
                t = i.B,
                n = (new Date).getTime(),
                l[t] = l[t] || [],
                n = {
                    "gtm.start": n
                },
                a || (n.event = "gtm.js"),
                l[t].push(n),
                n = function(t) {
                    function b(t, e) {
                        e && (n += "&" + t + "=" + Da(e))
                    }
                    var n = "https://www.google-analytics.com/gtm/js?id=" + Da(t.id);
                    return "dataLayer" != t.B && b("l", t.B),
                    b("t", t.target),
                    b("cid", t.ja),
                    b("cidt", t.ka),
                    b("gac", t.la),
                    b("aip", t.ia),
                    t.na && b("m", "sync"),
                    b("cycle", t.G),
                    n
                }(i)
            }
            !n && Re.hasOwnProperty(e) ? (J(39),
            n = e + ".js") : J(43),
            n && (n && 0 <= n.indexOf("/") || (n = (O || Ha() ? "https:" : "http:") + "//www.google-analytics.com/plugins/ua/" + n),
            t = (i = je(n)).protocol,
            n = u.location.protocol,
            ("https:" == t || t == n || "http:" == t && "http:" == n) && We(i) && (Ga(i.url, void 0, a),
            Ie.set(e, !0)))
        }
    }
      , He = function(t, e) {
        var n = _e.get(t) || [];
        n.push(e),
        _e.set(t, n)
    }
      , We = function(t) {
        var e = je(u.location.href);
        return !!s(t.url, "https://www.google-analytics.com/gtm/js?id=") || !(t.query || 0 <= t.url.indexOf("?") || 0 <= t.path.indexOf("://")) && (t.host == e.host && t.port == e.port || (e = "http:" == t.protocol ? 80 : 443,
        !("www.google-analytics.com" != t.host || (t.port || e) != e || !s(t.path, "/plugins/"))))
    }
      , je = function(t) {
        function b(t) {
            var e = (t.hostname || "").split(":")[0].toLowerCase()
              , n = (t.protocol || "").toLowerCase();
            n = 1 * t.port || ("http:" == n ? 80 : "https:" == n ? 443 : "");
            return t = t.pathname || "",
            s(t, "/") || (t = "/" + t),
            [e, "" + n, t]
        }
        var e = u.createElement("a");
        e.href = u.location.href;
        var n = (e.protocol || "").toLowerCase()
          , i = b(e)
          , a = e.search || ""
          , o = n + "//" + i[0] + (i[1] ? ":" + i[1] : "");
        return s(t, "//") ? t = n + t : s(t, "/") ? t = o + t : !t || s(t, "?") ? t = o + i[2] + (t || a) : t.split("/")[0].indexOf(":") < 0 && (t = o + i[2].substring(0, i[2].lastIndexOf("/")) + "/" + t),
        e.href = t,
        n = b(e),
        {
            protocol: (e.protocol || "").toLowerCase(),
            host: n[0],
            port: n[1],
            path: n[2],
            query: e.search || "",
            url: t || ""
        }
    }
      , Fe = {
        ga: function() {
            Fe.f = []
        }
    };
    Fe.ga(),
    Fe.D = function(t) {
        var e = Fe.J.apply(Fe, arguments);
        e = Fe.f.concat(e);
        for (Fe.f = []; 0 < e.length && !Fe.v(e[0]) && (e.shift(),
        !(0 < Fe.f.length)); )
            ;
        Fe.f = Fe.f.concat(e)
    }
    ,
    Fe.J = function(t) {
        for (var e = [], n = 0; n < arguments.length; n++)
            try {
                var i = new ee(arguments[n]);
                i.g ? me(i.a[0], i.a[1]) : (i.i && (i.ha = Be(i.c, i.a[0], i.X, i.W)),
                e.push(i))
            } catch (t) {}
        return e
    }
    ,
    Fe.v = function(t) {
        try {
            if (t.u)
                t.u.call(l, Ve.j("t0"));
            else {
                var e = t.c == A ? Ve : Ve.j(t.c);
                if (t.A)
                    "t0" != t.c || Ve.create.apply(Ve, t.a);
                else if (t.ba)
                    Ve.remove(t.c);
                else if (e)
                    if (t.i) {
                        if (t.ha && (t.ha = Be(t.c, t.a[0], t.X, t.W)),
                        !Ne(t.a[0], e, t.W))
                            return !0
                    } else if (t.K) {
                        var n = t.C
                          , i = t.a
                          , a = e.plugins_.get(t.K);
                        a[n].apply(a, i)
                    } else
                        e[t.C].apply(e, t.a)
            }
        } catch (t) {}
    }
    ;
    var Ve = function(t) {
        J(1),
        Fe.D.apply(Fe, [arguments])
    };
    Ve.h = {},
    Ve.P = [],
    Ve.L = 0,
    Ve.answer = 42;
    var ze = [Ft, zt, Bt];
    Ve.create = function(t) {
        var e = Qa(ze, [].slice.call(arguments));
        e[Bt] || (e[Bt] = "t0");
        var n = "" + e[Bt];
        return Ve.h[n] ? Ve.h[n] : (e = new Zd(e),
        Ve.h[n] = e,
        Ve.P.push(e),
        e)
    }
    ,
    Ve.remove = function(t) {
        for (var e = 0; e < Ve.P.length; e++)
            if (Ve.P[e].get(Bt) == t) {
                Ve.P.splice(e, 1),
                Ve.h[t] = null;
                break
            }
    }
    ,
    Ve.j = function(t) {
        return Ve.h[t]
    }
    ,
    Ve.getAll = function() {
        return Ve.P.slice(0)
    }
    ,
    Ve.N = function() {
        "ga" != A && J(49);
        var t = l[A];
        if (!t || 42 != t.answer) {
            if (Ve.L = t && t.l,
            Ve.loaded = !0,
            X("create", e = l[A] = Ve, e.create),
            X("remove", e, e.remove),
            X("getByName", e, e.j, 5),
            X("getAll", e, e.getAll, 6),
            X("get", e = Zd.prototype, e.get, 7),
            X("set", e, e.set, 4),
            X("send", e, e.send),
            X("requireSync", e, e.ma),
            X("get", e = mb.prototype, e.get),
            X("set", e, e.set),
            !Ha() && !O) {
                t: {
                    for (var e = u.getElementsByTagName("script"), n = 0; n < e.length && n < 100; n++) {
                        var i = e[n].src;
                        if (i && 0 == i.indexOf("https://www.google-analytics.com/analytics")) {
                            J(33),
                            e = !0;
                            break t
                        }
                    }
                    e = !1
                }
                e && (O = !0)
            }
            Ha() || O || !ld(new kd(1e4)) || (J(36),
            O = !0),
            e = ((l.gaplugins = l.gaplugins || {}).Linker = Gd).prototype,
            me("linker", Gd),
            X("decorate", e, e.ca, 20),
            X("autoLink", e, e.S, 25),
            me("displayfeatures", Td),
            me("adfeatures", Td),
            t = t && t.q,
            o(t) ? Fe.D.apply(Ve, t) : J(50)
        }
    }
    ,
    Ve.da = function() {
        for (var t = Ve.getAll(), e = 0; e < t.length; e++)
            t[e].get(Bt)
    }
    ;
    var Ge = Ve.N
      , Je = l[A];
    function La(t) {
        var e, n, i = 1;
        if (t)
            for (i = 0,
            n = t.length - 1; 0 <= n; n--)
                i = 0 != (e = 266338304 & (i = (i << 6 & 268435455) + (e = t.charCodeAt(n)) + (e << 14))) ? i ^ e >> 21 : i;
        return i
    }
    Je && Je.r ? Ge() : ce(Ge),
    ce(function() {
        Fe.D(["provide", "render", Ca])
    })
}(window);
var tns = function() {
    var t = window
      , Ue = t.requestAnimationFrame || t.webkitRequestAnimationFrame || t.mozRequestAnimationFrame || t.msRequestAnimationFrame || function(t) {
        return setTimeout(t, 16)
    }
      , e = window
      , $e = e.cancelAnimationFrame || e.mozCancelAnimationFrame || function(t) {
        clearTimeout(t)
    }
    ;
    function extend(t) {
        for (var e, n, i, a = t || {}, o = 1, r = arguments.length; o < r; o++)
            if (null !== (e = arguments[o]))
                for (n in e)
                    a !== (i = e[n]) && void 0 !== i && (a[n] = i);
        return a
    }
    function checkStorageValue(t) {
        return 0 <= ["true", "false"].indexOf(t) ? JSON.parse(t) : t
    }
    function setLocalStorage(t, e, n, i) {
        if (i)
            try {
                t.setItem(e, n)
            } catch (t) {}
        return n
    }
    function getBody() {
        var t = document
          , e = t.body;
        return e || ((e = t.createElement("body")).fake = !0),
        e
    }
    var n = document.documentElement;
    function setFakeBody(t) {
        var e = "";
        return t.fake && (e = n.style.overflow,
        t.style.background = "",
        t.style.overflow = n.style.overflow = "hidden",
        n.appendChild(t)),
        e
    }
    function resetFakeBody(t, e) {
        t.fake && (t.remove(),
        n.style.overflow = e,
        n.offsetHeight)
    }
    function addCSSRule(t, e, n, i) {
        "insertRule"in t ? t.insertRule(e + "{" + n + "}", i) : t.addRule(e, n, i)
    }
    function getCssRulesLength(t) {
        return ("insertRule"in t ? t.cssRules : t.rules).length
    }
    function forEach(t, e, n) {
        for (var i = 0, a = t.length; i < a; i++)
            e.call(n, t[i], i)
    }
    var i = "classList"in document.createElement("_")
      , Ze = i ? function(t, e) {
        return t.classList.contains(e)
    }
    : function(t, e) {
        return 0 <= t.className.indexOf(e)
    }
      , Ye = i ? function(t, e) {
        Ze(t, e) || t.classList.add(e)
    }
    : function(t, e) {
        Ze(t, e) || (t.className += " " + e)
    }
      , Qe = i ? function(t, e) {
        Ze(t, e) && t.classList.remove(e)
    }
    : function(t, e) {
        Ze(t, e) && (t.className = t.className.replace(e, ""))
    }
    ;
    function hasAttr(t, e) {
        return t.hasAttribute(e)
    }
    function getAttr(t, e) {
        return t.getAttribute(e)
    }
    function isNodeList(t) {
        return void 0 !== t.item
    }
    function setAttrs(t, e) {
        if (t = isNodeList(t) || t instanceof Array ? t : [t],
        "[object Object]" === Object.prototype.toString.call(e))
            for (var n = t.length; n--; )
                for (var i in e)
                    t[n].setAttribute(i, e[i])
    }
    function removeAttrs(t, e) {
        t = isNodeList(t) || t instanceof Array ? t : [t];
        for (var n = (e = e instanceof Array ? e : [e]).length, i = t.length; i--; )
            for (var a = n; a--; )
                t[i].removeAttribute(e[a])
    }
    function arrayFromNodeList(t) {
        for (var e = [], n = 0, i = t.length; n < i; n++)
            e.push(t[n]);
        return e
    }
    function hideElement(t, e) {
        "none" !== t.style.display && (t.style.display = "none")
    }
    function showElement(t, e) {
        "none" === t.style.display && (t.style.display = "")
    }
    function isVisible(t) {
        return "none" !== window.getComputedStyle(t).display
    }
    function whichProperty(e) {
        if ("string" == typeof e) {
            var n = [e]
              , i = e.charAt(0).toUpperCase() + e.substr(1);
            ["Webkit", "Moz", "ms", "O"].forEach(function(t) {
                "ms" === t && "transform" !== e || n.push(t + i)
            }),
            e = n
        }
        for (var t = document.createElement("fakeelement"), a = (e.length,
        0); a < e.length; a++) {
            var o = e[a];
            if (void 0 !== t.style[o])
                return o
        }
        return !1
    }
    function getEndProperty(t, e) {
        var n = !1;
        return /^Webkit/.test(t) ? n = "webkit" + e + "End" : /^O/.test(t) ? n = "o" + e + "End" : t && (n = e.toLowerCase() + "end"),
        n
    }
    var a = !1;
    try {
        var o = Object.defineProperty({}, "passive", {
            get: function() {
                a = !0
            }
        });
        window.addEventListener("test", null, o)
    } catch (t) {}
    var r = !!a && {
        passive: !0
    };
    function addEvents(t, e, n) {
        for (var i in e) {
            var a = 0 <= ["touchstart", "touchmove"].indexOf(i) && !n && r;
            t.addEventListener(i, e[i], a)
        }
    }
    function removeEvents(t, e) {
        for (var n in e) {
            var i = 0 <= ["touchstart", "touchmove"].indexOf(n) && r;
            t.removeEventListener(n, e[n], i)
        }
    }
    function Events() {
        return {
            topics: {},
            on: function(t, e) {
                this.topics[t] = this.topics[t] || [],
                this.topics[t].push(e)
            },
            off: function(t, e) {
                if (this.topics[t])
                    for (var n = 0; n < this.topics[t].length; n++)
                        if (this.topics[t][n] === e) {
                            this.topics[t].splice(n, 1);
                            break
                        }
            },
            emit: function(e, n) {
                n.type = e,
                this.topics[e] && this.topics[e].forEach(function(t) {
                    t(n, e)
                })
            }
        }
    }
    Object.keys || (Object.keys = function(t) {
        var e = [];
        for (var n in t)
            Object.prototype.hasOwnProperty.call(t, n) && e.push(n);
        return e
    }
    ),
    "remove"in Element.prototype || (Element.prototype.remove = function() {
        this.parentNode && this.parentNode.removeChild(this)
    }
    );
    var tn = function(L) {
        L = extend({
            container: ".slider",
            mode: "carousel",
            axis: "horizontal",
            items: 1,
            gutter: 0,
            edgePadding: 0,
            fixedWidth: !1,
            autoWidth: !1,
            viewportMax: !1,
            slideBy: 1,
            center: !1,
            controls: !0,
            controlsPosition: "top",
            controlsText: ["prev", "next"],
            controlsContainer: !1,
            prevButton: !1,
            nextButton: !1,
            nav: !0,
            navPosition: "top",
            navContainer: !1,
            navAsThumbnails: !1,
            arrowKeys: !1,
            speed: 300,
            autoplay: !1,
            autoplayPosition: "top",
            autoplayTimeout: 5e3,
            autoplayDirection: "forward",
            autoplayText: ["start", "stop"],
            autoplayHoverPause: !1,
            autoplayButton: !1,
            autoplayButtonOutput: !0,
            autoplayResetOnVisibility: !0,
            animateIn: "tns-fadeIn",
            animateOut: "tns-fadeOut",
            animateNormal: "tns-normal",
            animateDelay: !1,
            loop: !0,
            rewind: !1,
            autoHeight: !1,
            responsive: !1,
            lazyload: !1,
            lazyloadSelector: ".tns-lazy-img",
            touch: !0,
            mouseDrag: !1,
            swipeAngle: 15,
            nested: !1,
            preventActionWhenRunning: !1,
            preventScrollOnTouch: "force",
            freezable: !0,
            onInit: !1,
            useLocalStorage: !0,
            textDirection: "ltr"
        }, L || {});
        var M = document
          , v = window
          , a = {
            ENTER: 13,
            SPACE: 32,
            LEFT: 37,
            RIGHT: 39
        }
          , e = {}
          , n = L.useLocalStorage;
        if (n) {
            var t = navigator.userAgent
              , i = new Date;
            try {
                (e = v.localStorage) ? (e.setItem(i, i),
                n = e.getItem(i) == i,
                e.removeItem(i)) : n = !1,
                n || (e = {})
            } catch (t) {
                n = !1
            }
            n && (e.tnsApp && e.tnsApp !== t && ["tC", "tPL", "tMQ", "tTf", "t3D", "tTDu", "tTDe", "tADu", "tADe", "tTE", "tAE"].forEach(function(t) {
                e.removeItem(t)
            }),
            localStorage.tnsApp = t)
        }
        var m = e.tC ? checkStorageValue(e.tC) : setLocalStorage(e, "tC", function calc() {
            var t = document
              , e = getBody()
              , n = setFakeBody(e)
              , i = t.createElement("div")
              , a = !1;
            e.appendChild(i);
            try {
                for (var o, r = "(10px * 10)", s = ["calc" + r, "-moz-calc" + r, "-webkit-calc" + r], l = 0; l < 3; l++)
                    if (o = s[l],
                    i.style.width = o,
                    100 === i.offsetWidth) {
                        a = o.replace(r, "");
                        break
                    }
            } catch (t) {}
            return e.fake ? resetFakeBody(e, n) : i.remove(),
            a
        }(), n)
          , b = e.tPL ? checkStorageValue(e.tPL) : setLocalStorage(e, "tPL", function percentageLayout() {
            var t, e = document, n = getBody(), i = setFakeBody(n), a = e.createElement("div"), o = e.createElement("div"), r = "";
            a.className = "tns-t-subp2",
            o.className = "tns-t-ct";
            for (var s = 0; s < 70; s++)
                r += "<div></div>";
            return o.innerHTML = r,
            a.appendChild(o),
            n.appendChild(a),
            t = Math.abs(a.getBoundingClientRect().left - o.children[67].getBoundingClientRect().left) < 2,
            n.fake ? resetFakeBody(n, i) : a.remove(),
            t
        }(), n)
          , D = e.tMQ ? checkStorageValue(e.tMQ) : setLocalStorage(e, "tMQ", !0, n)
          , o = e.tTf ? checkStorageValue(e.tTf) : setLocalStorage(e, "tTf", whichProperty("transform"), n)
          , r = e.t3D ? checkStorageValue(e.t3D) : setLocalStorage(e, "t3D", function has3DTransforms(t) {
            if (!t)
                return !1;
            if (!window.getComputedStyle)
                return !1;
            var e, n = document, i = getBody(), a = setFakeBody(i), o = n.createElement("p"), r = 9 < t.length ? "-" + t.slice(0, -9).toLowerCase() + "-" : "";
            return r += "transform",
            i.insertBefore(o, null),
            o.style[t] = "translate3d(1px,1px,1px)",
            e = window.getComputedStyle(o).getPropertyValue(r),
            i.fake ? resetFakeBody(i, a) : o.remove(),
            void 0 !== e && 0 < e.length && "none" !== e
        }(o), n)
          , y = e.tTDu ? checkStorageValue(e.tTDu) : setLocalStorage(e, "tTDu", whichProperty("transitionDuration"), n)
          , s = e.tTDe ? checkStorageValue(e.tTDe) : setLocalStorage(e, "tTDe", whichProperty("transitionDelay"), n)
          , w = e.tADu ? checkStorageValue(e.tADu) : setLocalStorage(e, "tADu", whichProperty("animationDuration"), n)
          , l = e.tADe ? checkStorageValue(e.tADe) : setLocalStorage(e, "tADe", whichProperty("animationDelay"), n)
          , u = e.tTE ? checkStorageValue(e.tTE) : setLocalStorage(e, "tTE", getEndProperty(y, "Transition"), n)
          , c = e.tAE ? checkStorageValue(e.tAE) : setLocalStorage(e, "tAE", getEndProperty(w, "Animation"), n)
          , d = v.console && "function" == typeof v.console.warn
          , f = ["container", "controlsContainer", "prevButton", "nextButton", "navContainer", "autoplayButton"]
          , g = {};
        if (f.forEach(function(t) {
            if ("string" == typeof L[t]) {
                var e = L[t]
                  , n = M.querySelector(e);
                if (g[t] = e,
                !n || !n.nodeName)
                    return void (d && console.warn("Can't find", L[t]));
                L[t] = n
            }
        }),
        !(L.container.children.length < 1)) {
            var R = L.responsive
              , I = L.nested
              , _ = "carousel" === L.mode;
            if (R) {
                0 in R && (L = extend(L, R[0]),
                delete R[0]);
                var p = {};
                for (var h in R) {
                    var C = R[h];
                    C = "number" == typeof C ? {
                        items: C
                    } : C,
                    p[h] = C
                }
                R = p,
                p = null
            }
            if (_ || !function updateOptions(t) {
                for (var e in t)
                    _ || ("slideBy" === e && (t[e] = "page"),
                    "edgePadding" === e && (t[e] = !1),
                    "autoHeight" === e && (t[e] = !1)),
                    "responsive" === e && updateOptions(t[e])
            }(L),
            !_) {
                L.axis = "horizontal",
                L.slideBy = "page",
                L.edgePadding = !1;
                var P = L.animateIn
                  , N = L.animateOut
                  , S = L.animateDelay
                  , B = L.animateNormal
            }
            var E, H, W = "horizontal" === L.axis, x = M.createElement("div"), j = M.createElement("div"), F = L.container, T = F.parentNode, A = F.outerHTML, V = F.children, z = V.length, G = getWindowWidth(), J = !1;
            R && setBreakpointZone(),
            _ && (F.className += " tns-vpfix");
            var O, k, K, X = L.autoWidth, q = getOption("fixedWidth"), U = getOption("edgePadding"), $ = getOption("gutter"), Z = getViewportWidth(), Y = getOption("center"), Q = X ? 1 : Math.floor(getOption("items")), tt = getOption("slideBy"), et = L.viewportMax || L.fixedWidthViewportWidth, nt = getOption("arrowKeys"), it = getOption("speed"), at = L.rewind, ot = !at && L.loop, rt = getOption("autoHeight"), st = getOption("controls"), lt = getOption("controlsText"), ut = getOption("textDirection"), ct = getOption("nav"), dt = getOption("touch"), ft = getOption("mouseDrag"), gt = getOption("autoplay"), pt = getOption("autoplayTimeout"), ht = getOption("autoplayText"), vt = getOption("autoplayHoverPause"), mt = getOption("autoplayResetOnVisibility"), bt = function createStyleSheet(t) {
                var e = document.createElement("style");
                return t && e.setAttribute("media", t),
                document.querySelector("head").appendChild(e),
                e.sheet ? e.sheet : e.styleSheet
            }(), yt = L.lazyload, wt = (L.lazyloadSelector,
            []), Ct = ot ? function getCloneCountForLoop() {
                var t = function getItemsMax() {
                    {
                        if (X || q && !et)
                            return z - 1;
                        var t = q ? "fixedWidth" : "items"
                          , e = [];
                        if ((q || L[t] < z) && e.push(L[t]),
                        R)
                            for (var n in R) {
                                var i = R[n][t];
                                i && (q || i < z) && e.push(i)
                            }
                        return e.length || e.push(0),
                        Math.ceil(q ? et / Math.min.apply(null, e) : Math.max.apply(null, e))
                    }
                }()
                  , e = _ ? Math.ceil((5 * t - z) / 2) : 4 * t - z;
                return e = Math.max(t, e),
                hasOption("edgePadding") ? e + 1 : e
            }() : 0, St = _ ? z + 2 * Ct : z + Ct, Et = !(!q && !X || ot), xt = q ? getRightBoundary() : null, Tt = !_ || !ot, At = W ? "left" : "top", Ot = "", kt = "", Lt = q ? function() {
                return Y && !ot ? z - 1 : Math.ceil(-xt / (q + $))
            }
            : X ? function() {
                for (var t = St; t--; )
                    if (O[t] > -xt)
                        return t
            }
            : function() {
                return Y && _ && !ot ? z - 1 : ot || _ ? Math.max(0, St - Math.ceil(Q)) : St - 1
            }
            , Mt = getStartIndex(getOption("startIndex")), Dt = Mt, Rt = (getCurrentSlide(),
            0), It = X ? null : Lt(), _t = L.preventActionWhenRunning, Pt = L.swipeAngle, Nt = !Pt || "?", Bt = !1, Ht = L.onInit, Wt = new Events, jt = " tns-slider tns-" + L.mode, Ft = F.id || function getSlideId() {
                var t = window.tnsId;
                return window.tnsId = t ? t + 1 : 1,
                "tns" + window.tnsId
            }(), Vt = getOption("disable"), zt = !1, Gt = L.freezable, Jt = !(!Gt || X) && getFreeze(), Kt = !1, Xt = {
                touchstart: onControlsClick,
                click: onControlsClick,
                keydown: function onControlsKeydown(t) {
                    t = getEvent(t);
                    var e = [a.LEFT, a.RIGHT].indexOf(t.keyCode);
                    if (Bt && _t)
                        return;
                    0 <= e && (0 === e ? he.disabled || onControlsClick(t, -1) : ve.disabled || onControlsClick(t, 1))
                }
            }, qt = {
                touchstart: onNavClick,
                click: onNavClick,
                keydown: function onNavKeydown(t) {
                    t = getEvent(t);
                    var e = M.activeElement;
                    if (!hasAttr(e, "data-nav"))
                        return;
                    var n = [a.LEFT, a.RIGHT, a.ENTER, a.SPACE].indexOf(t.keyCode)
                      , i = Number(getAttr(e, "data-nav"));
                    0 <= n && (0 === n ? 0 < i && setFocus(ye[i - 1]) : 1 === n ? i < Se - 1 && setFocus(ye[i + 1]) : goTo(xe = i, t))
                }
            }, Ut = {
                mouseover: function mouseoverPause() {
                    De && (stopAutoplayTimer(),
                    Re = !0)
                },
                mouseout: function mouseoutRestart() {
                    Re && (setAutoplayTimer(),
                    Re = !1)
                }
            }, $t = {
                visibilitychange: function onVisibilityChange() {
                    M.hidden ? De && (stopAutoplayTimer(),
                    _e = !0) : _e && (setAutoplayTimer(),
                    _e = !1)
                }
            }, Zt = {
                keydown: function onDocumentKeydown(t) {
                    t = getEvent(t);
                    var e = [a.LEFT, a.RIGHT].indexOf(t.keyCode);
                    0 <= e && onControlsClick(t, 0 === e ? -1 : 1)
                }
            }, Yt = {
                touchstart: onPanStart,
                touchmove: onPanMove,
                touchend: onPanEnd,
                touchcancel: onPanEnd
            }, Qt = {
                mousedown: onPanStart,
                mousemove: onPanMove,
                mouseup: onPanEnd,
                mouseleave: onPanEnd
            }, te = null, ee = hasOption("controls"), ne = hasOption("nav"), ie = !!X || L.navAsThumbnails, ae = hasOption("autoplay"), oe = hasOption("touch"), re = hasOption("mouseDrag"), se = "tns-slide-active", le = "tns-complete", ue = {
                load: function onImgLoaded(t) {
                    imgLoaded(getTarget(t))
                },
                error: function onImgFailed(t) {
                    !function imgFailed(t) {
                        Ye(t, "failed"),
                        imgCompleted(t)
                    }(getTarget(t))
                }
            }, ce = "force" === L.preventScrollOnTouch;
            if (ee)
                var de, fe, ge = L.controlsContainer, pe = L.controlsContainer ? L.controlsContainer.outerHTML : "", he = L.prevButton, ve = L.nextButton, me = L.prevButton ? L.prevButton.outerHTML : "", be = L.nextButton ? L.nextButton.outerHTML : "";
            if (ne)
                var ye, we = L.navContainer, Ce = L.navContainer ? L.navContainer.outerHTML : "", Se = X ? z : getPages(), Ee = 0, xe = -1, Te = getCurrentNavIndex(), Ae = Te, Oe = "tns-nav-active", ke = "Carousel Page ", Le = " (Current Slide)";
            if (ae)
                var Me, De, Re, Ie, _e, Pe = "forward" === L.autoplayDirection ? 1 : -1, Ne = L.autoplayButton, Be = L.autoplayButton ? L.autoplayButton.outerHTML : "", He = ["<span class='tns-visually-hidden'>", " animation</span>"];
            if (oe || re)
                var We, je, Fe = {}, Ve = {}, ze = !1, Ge = W ? function(t, e) {
                    return t.x - e.x
                }
                : function(t, e) {
                    return t.y - e.y
                }
                ;
            X || resetVariblesWhenDisable(Vt || Jt),
            o && (At = o,
            Ot = "translate",
            kt = r ? (Ot += W ? "3d(" : "3d(0px, ",
            W ? ", 0px, 0px)" : ", 0px)") : (Ot += W ? "X(" : "Y(",
            ")")),
            _ && (F.className = F.className.replace("tns-vpfix", "")),
            function initStructure() {
                hasOption("gutter");
                x.className = "tns-outer",
                j.className = "tns-inner",
                x.id = Ft + "-ow",
                j.id = Ft + "-iw",
                "" === F.id && (F.id = Ft);
                jt += b || X ? " tns-subpixel" : " tns-no-subpixel",
                jt += m ? " tns-calc" : " tns-no-calc",
                X && (jt += " tns-autowidth");
                jt += " tns-" + L.axis,
                F.className += jt,
                _ ? ((E = M.createElement("div")).id = Ft + "-mw",
                E.className = "tns-ovh",
                x.appendChild(E),
                E.appendChild(j)) : x.appendChild(j);
                if (rt) {
                    (E || j).className += " tns-ah"
                }
                if (T.insertBefore(x, F),
                j.appendChild(F),
                forEach(V, function(t, e) {
                    Ye(t, "tns-item"),
                    t.id || (t.id = Ft + "-item" + e),
                    !_ && B && Ye(t, B),
                    setAttrs(t, {
                        "aria-hidden": "true",
                        tabindex: "-1"
                    })
                }),
                Ct) {
                    for (var t = M.createDocumentFragment(), e = M.createDocumentFragment(), n = Ct; n--; ) {
                        var i = n % z
                          , a = V[i].cloneNode(!0);
                        if (removeAttrs(a, "id"),
                        e.insertBefore(a, e.firstChild),
                        _) {
                            var o = V[z - 1 - i].cloneNode(!0);
                            removeAttrs(o, "id"),
                            t.appendChild(o)
                        }
                    }
                    F.insertBefore(t, F.firstChild),
                    F.appendChild(e),
                    V = F.children
                }
            }(),
            function initSheet() {
                if (!_)
                    for (var t = Mt, e = Mt + Math.min(z, Q); t < e; t++) {
                        var n = V[t];
                        n.style.left = 100 * (t - Mt) / Q + "%",
                        Ye(n, P),
                        Qe(n, B)
                    }
                W && (b || X ? (addCSSRule(bt, "#" + Ft + " > .tns-item", "font-size:" + v.getComputedStyle(V[0]).fontSize + ";", getCssRulesLength(bt)),
                addCSSRule(bt, "#" + Ft, "font-size:0;", getCssRulesLength(bt))) : _ && forEach(V, function(t, e) {
                    t.style.marginLeft = function getSlideMarginLeft(t) {
                        return m ? m + "(" + 100 * t + "% / " + St + ")" : 100 * t / St + "%"
                    }(e)
                }));
                if (D) {
                    if (y) {
                        var i = E && L.autoHeight ? getTransitionDurationStyle(L.speed) : "";
                        addCSSRule(bt, "#" + Ft + "-mw", i, getCssRulesLength(bt))
                    }
                    i = getInnerWrapperStyles(L.edgePadding, L.gutter, L.fixedWidth, L.speed, L.autoHeight),
                    addCSSRule(bt, "#" + Ft + "-iw", i, getCssRulesLength(bt)),
                    _ && (i = W && !X ? "width:" + getContainerWidth(L.fixedWidth, L.gutter, L.items) + ";" : "",
                    y && (i += getTransitionDurationStyle(it)),
                    addCSSRule(bt, "#" + Ft, i, getCssRulesLength(bt))),
                    i = W && !X ? getSlideWidthStyle(L.fixedWidth, L.gutter, L.items) : "",
                    L.gutter && (i += getSlideGutterStyle(L.gutter)),
                    _ || (y && (i += getTransitionDurationStyle(it)),
                    w && (i += getAnimationDurationStyle(it))),
                    i && addCSSRule(bt, "#" + Ft + " > .tns-item", i, getCssRulesLength(bt))
                } else {
                    update_carousel_transition_duration(),
                    j.style.cssText = getInnerWrapperStyles(U, $, q, rt),
                    _ && W && !X && (F.style.width = getContainerWidth(q, $, Q));
                    i = W && !X ? getSlideWidthStyle(q, $, Q) : "";
                    $ && (i += getSlideGutterStyle($)),
                    i && addCSSRule(bt, "#" + Ft + " > .tns-item", i, getCssRulesLength(bt))
                }
                if (R && D)
                    for (var a in R) {
                        a = parseInt(a);
                        var o = R[a]
                          , r = (i = "",
                        "")
                          , s = ""
                          , l = ""
                          , u = ""
                          , c = X ? null : getOption("items", a)
                          , d = getOption("fixedWidth", a)
                          , f = getOption("speed", a)
                          , g = getOption("edgePadding", a)
                          , p = getOption("autoHeight", a)
                          , h = getOption("gutter", a);
                        y && E && getOption("autoHeight", a) && "speed"in o && (r = "#" + Ft + "-mw{" + getTransitionDurationStyle(f) + "}"),
                        ("edgePadding"in o || "gutter"in o) && (s = "#" + Ft + "-iw{" + getInnerWrapperStyles(g, h, d, f, p) + "}"),
                        _ && W && !X && ("fixedWidth"in o || "items"in o || q && "gutter"in o) && (l = "width:" + getContainerWidth(d, h, c) + ";"),
                        y && "speed"in o && (l += getTransitionDurationStyle(f)),
                        l = l && "#" + Ft + "{" + l + "}",
                        ("fixedWidth"in o || q && "gutter"in o || !_ && "items"in o) && (u += getSlideWidthStyle(d, h, c)),
                        "gutter"in o && (u += getSlideGutterStyle(h)),
                        !_ && "speed"in o && (y && (u += getTransitionDurationStyle(f)),
                        w && (u += getAnimationDurationStyle(f))),
                        (i = r + s + l + (u = u && "#" + Ft + " > .tns-item{" + u + "}")) && bt.insertRule("@media (min-width: " + a / 16 + "em) {" + i + "}", bt.cssRules.length)
                    }
            }(),
            initSliderTransform();
            var Je = ot ? _ ? function() {
                var t = Rt
                  , e = It;
                t += tt,
                e -= tt,
                U ? (t += 1,
                e -= 1) : q && (Z + $) % (q + $) && (e -= 1),
                Ct && (e < Mt ? Mt -= z : Mt < t && (Mt += z))
            }
            : function() {
                if (It < Mt)
                    for (; Rt + z <= Mt; )
                        Mt -= z;
                else if (Mt < Rt)
                    for (; Mt <= It - z; )
                        Mt += z
            }
            : function() {
                Mt = Math.max(Rt, Math.min(It, Mt))
            }
              , Ke = _ ? function() {
                resetDuration(F, ""),
                y || !it ? (doContainerTransform(),
                it && isVisible(F) ? (clearTimeout(te),
                te = setTimeout(onTransitionEnd, it + 100)) : onTransitionEnd()) : function jsTransform(t, e, n, i, a, o, r) {
                    var s = Math.min(o, 10)
                      , l = 0 <= a.indexOf("%") ? "%" : "px"
                      , u = (a = a.replace(l, ""),
                    Number(t.style[e].replace(n, "").replace(i, "").replace(l, "")))
                      , c = (a - u) / o * s;
                    setTimeout(function moveElement() {
                        o -= s,
                        u += c,
                        t.style[e] = n + u + l + i,
                        0 < o ? setTimeout(moveElement, s) : r()
                    }, s)
                }(F, At, Ot, kt, getContainerTransformValue(), it, onTransitionEnd),
                W || updateContentWrapperHeight()
            }
            : function() {
                wt = [];
                var t = {};
                t[u] = t[c] = onTransitionEnd,
                removeEvents(V[Dt], t),
                addEvents(V[Mt], t),
                animateSlide(Dt, P, N, !0),
                animateSlide(Mt, B, P),
                u && c && it && isVisible(F) || onTransitionEnd()
            }
              , Xe = "rtl" === ut ? -100 / St : -100
              , qe = "rtl" === ut ? 100 : 100 / St;
            return {
                version: "2.9.1",
                getInfo: info,
                events: Wt,
                goTo: goTo,
                play: function play() {
                    gt && !De && (startAutoplay(),
                    Ie = !1)
                },
                pause: function pause() {
                    De && (stopAutoplay(),
                    Ie = !0)
                },
                isOn: J,
                updateSliderHeight: updateInnerWrapperHeight,
                refresh: initSliderTransform,
                destroy: function destroy() {
                    if (bt.disabled = !0,
                    bt.ownerNode && bt.ownerNode.remove(),
                    removeEvents(v, {
                        resize: onResize
                    }),
                    nt && removeEvents(M, Zt),
                    ge && removeEvents(ge, Xt),
                    we && removeEvents(we, qt),
                    removeEvents(F, Ut),
                    removeEvents(F, $t),
                    Ne && removeEvents(Ne, {
                        click: toggleAutoplay
                    }),
                    gt && clearInterval(Me),
                    _ && u) {
                        var t = {};
                        t[u] = onTransitionEnd,
                        removeEvents(F, t)
                    }
                    dt && removeEvents(F, Yt),
                    ft && removeEvents(F, Qt);
                    var o = [A, pe, me, be, Ce, Be];
                    for (var e in f.forEach(function(t, e) {
                        var n = "container" === t ? x : L[t];
                        if ("object" == typeof n) {
                            var i = !!n.previousElementSibling && n.previousElementSibling
                              , a = n.parentNode;
                            n.outerHTML = o[e],
                            L[t] = i ? i.nextElementSibling : a.firstElementChild
                        }
                    }),
                    f = P = N = S = B = W = x = j = F = T = A = V = z = H = G = X = q = U = $ = Z = Q = tt = et = nt = it = at = ot = rt = bt = yt = O = wt = Ct = St = Et = xt = Tt = At = Ot = kt = Lt = Mt = Dt = Rt = It = Pt = Nt = Bt = Ht = Wt = jt = Ft = Vt = zt = Gt = Jt = Kt = Xt = qt = Ut = $t = Zt = Yt = Qt = ee = ne = ie = ae = oe = re = se = le = ue = k = st = lt = ge = pe = he = ve = de = fe = ct = we = Ce = ye = Se = Ee = xe = Te = Ae = Oe = ke = Le = gt = pt = Pe = ht = vt = Ne = Be = mt = He = Me = De = Re = Ie = _e = Fe = Ve = We = ze = je = Ge = dt = ft = null,
                    this)
                        "rebuild" !== e && (this[e] = null);
                    J = !1
                },
                rebuild: function() {
                    return tn(extend(L, g))
                }
            }
        }
        function resetVariblesWhenDisable(t) {
            t && (st = ct = dt = ft = nt = gt = vt = mt = !1)
        }
        function getCurrentSlide() {
            for (var t = _ ? Mt - Ct : Mt; t < 0; )
                t += z;
            return t % z + 1
        }
        function getStartIndex(t) {
            return t = t ? Math.max(0, Math.min(ot ? z - 1 : z - Q, t)) : 0,
            _ ? t + Ct : t
        }
        function getAbsIndex(t) {
            for (null == t && (t = Mt),
            _ && (t -= Ct); t < 0; )
                t += z;
            return Math.floor(t % z)
        }
        function getCurrentNavIndex() {
            var t, e = getAbsIndex();
            return t = ie ? e : q || X ? Math.ceil((e + 1) * Se / z - 1) : Math.floor(e / Q),
            !ot && _ && Mt === It && (t = Se - 1),
            t
        }
        function getWindowWidth() {
            return v.innerWidth || M.documentElement.clientWidth || M.body.clientWidth
        }
        function getInsertPosition(t) {
            return "top" === t ? "afterbegin" : "beforeend"
        }
        function getViewportWidth() {
            var t = U ? 2 * U - $ : 0;
            return function getClientWidth(t) {
                var e, n, i = M.createElement("div");
                return t.appendChild(i),
                n = (e = i.getBoundingClientRect()).right - e.left,
                i.remove(),
                n || getClientWidth(t.parentNode)
            }(T) - t
        }
        function hasOption(t) {
            if (L[t])
                return !0;
            if (R)
                for (var e in R)
                    if (R[e][t])
                        return !0;
            return !1
        }
        function getOption(t, e) {
            if (null == e && (e = G),
            "items" === t && q)
                return Math.floor((Z + $) / (q + $)) || 1;
            var n = L[t];
            if (R)
                for (var i in R)
                    e >= parseInt(i) && t in R[i] && (n = R[i][t]);
            return "slideBy" === t && "page" === n && (n = getOption("items")),
            _ || "slideBy" !== t && "items" !== t || (n = Math.floor(n)),
            n
        }
        function getInnerWrapperStyles(t, e, n, i, a) {
            var o = "";
            if (void 0 !== t) {
                var r = t;
                e && (r -= e),
                o = W ? "margin: 0 " + r + "px 0 " + t + "px;" : "margin: " + t + "px 0 " + r + "px 0;"
            } else if (e && !n) {
                var s = "-" + e + "px";
                o = "margin: 0 " + (W ? s + " 0 0" : "0 " + s + " 0") + ";"
            }
            return !_ && a && y && i && (o += getTransitionDurationStyle(i)),
            o
        }
        function getContainerWidth(t, e, n) {
            return t ? (t + e) * St + "px" : m ? m + "(" + 100 * St + "% / " + n + ")" : 100 * St / n + "%"
        }
        function getSlideWidthStyle(t, e, n) {
            var i;
            if (t)
                i = t + e + "px";
            else {
                _ || (n = Math.floor(n));
                var a = _ ? St : n;
                i = m ? m + "(100% / " + a + ")" : 100 / a + "%"
            }
            return i = "width:" + i,
            "inner" !== I ? i + ";" : i + " !important;"
        }
        function getSlideGutterStyle(t) {
            var e = "";
            !1 !== t && (e = (W ? "padding-" : "margin-") + (W ? "right" : "bottom") + ": " + t + "px;");
            return e
        }
        function getCSSPrefix(t, e) {
            var n = t.substring(0, t.length - e).toLowerCase();
            return n = n && "-" + n + "-"
        }
        function getTransitionDurationStyle(t) {
            return getCSSPrefix(y, 18) + "transition-duration:" + t / 1e3 + "s;"
        }
        function getAnimationDurationStyle(t) {
            return getCSSPrefix(w, 17) + "animation-duration:" + t / 1e3 + "s;"
        }
        function initSliderTransform() {
            if (hasOption("autoHeight") || X || !W) {
                var t = F.querySelectorAll("img");
                forEach(t, function(t) {
                    var e = t.src;
                    e && e.indexOf("data:image") < 0 ? (addEvents(t, ue),
                    t.src = "",
                    t.src = e,
                    Ye(t, "loading")) : yt || imgLoaded(t)
                }),
                Ue(function() {
                    imgsLoadedCheck(arrayFromNodeList(t), function() {
                        k = !0
                    })
                }),
                !X && W && (t = getImageArray(Mt, Math.min(Mt + Q - 1, St - 1))),
                yt ? initSliderTransformStyleCheck() : Ue(function() {
                    imgsLoadedCheck(arrayFromNodeList(t), initSliderTransformStyleCheck)
                })
            } else
                _ && doContainerTransformSilent(),
                initTools(),
                initEvents()
        }
        function initSliderTransformStyleCheck() {
            if (X) {
                var t = ot ? Mt : z - 1;
                !function stylesApplicationCheck() {
                    V[t - 1].getBoundingClientRect().right.toFixed(2) === V[t].getBoundingClientRect().left.toFixed(2) ? initSliderTransformCore() : setTimeout(function() {
                        stylesApplicationCheck()
                    }, 16)
                }()
            } else
                initSliderTransformCore()
        }
        function initSliderTransformCore() {
            W && !X || (setSlidePositions(),
            X ? (xt = getRightBoundary(),
            Gt && (Jt = getFreeze()),
            It = Lt(),
            resetVariblesWhenDisable(Vt || Jt)) : updateContentWrapperHeight()),
            _ && doContainerTransformSilent(),
            initTools(),
            initEvents()
        }
        function initTools() {
            if (updateSlideStatus(),
            x.insertAdjacentHTML("afterbegin", '<div class="tns-liveregion tns-visually-hidden" aria-live="polite" aria-atomic="true">slide <span class="current">' + getLiveRegionStr() + "</span>  of " + z + "</div>"),
            K = x.querySelector(".tns-liveregion .current"),
            ae) {
                var t = gt ? "stop" : "start";
                Ne ? setAttrs(Ne, {
                    "data-action": t
                }) : L.autoplayButtonOutput && (x.insertAdjacentHTML(getInsertPosition(L.autoplayPosition), '<button data-action="' + t + '">' + He[0] + t + He[1] + ht[0] + "</button>"),
                Ne = x.querySelector("[data-action]")),
                Ne && addEvents(Ne, {
                    click: toggleAutoplay
                }),
                gt && (startAutoplay(),
                vt && addEvents(F, Ut),
                mt && addEvents(F, $t))
            }
            if (ne) {
                if (we)
                    setAttrs(we, {
                        "aria-label": "Carousel Pagination"
                    }),
                    forEach(ye = we.children, function(t, e) {
                        setAttrs(t, {
                            "data-nav": e,
                            tabindex: "-1",
                            "aria-label": ke + (e + 1),
                            "aria-controls": Ft
                        })
                    });
                else {
                    for (var e = "", n = ie ? "" : 'style="display:none"', i = 0; i < z; i++)
                        e += '<button data-nav="' + i + '" tabindex="-1" aria-controls="' + Ft + '" ' + n + ' aria-label="' + ke + (i + 1) + '"></button>';
                    e = '<div class="tns-nav" aria-label="Carousel Pagination">' + e + "</div>",
                    x.insertAdjacentHTML(getInsertPosition(L.navPosition), e),
                    we = x.querySelector(".tns-nav"),
                    ye = we.children
                }
                if (updateNavVisibility(),
                y) {
                    var a = y.substring(0, y.length - 18).toLowerCase()
                      , o = "transition: all " + it / 1e3 + "s";
                    a && (o = "-" + a + "-" + o),
                    addCSSRule(bt, "[aria-controls^=" + Ft + "-item]", o, getCssRulesLength(bt))
                }
                setAttrs(ye[Te], {
                    "aria-label": ke + (Te + 1) + Le
                }),
                removeAttrs(ye[Te], "tabindex"),
                Ye(ye[Te], Oe),
                addEvents(we, qt)
            }
            ee && (ge || he && ve || (x.insertAdjacentHTML(getInsertPosition(L.controlsPosition), '<div class="tns-controls" aria-label="Carousel Navigation" tabindex="0"><button data-controls="prev" tabindex="-1" aria-controls="' + Ft + '">' + lt[0] + '</button><button data-controls="next" tabindex="-1" aria-controls="' + Ft + '">' + lt[1] + "</button></div>"),
            ge = x.querySelector(".tns-controls")),
            he && ve || (he = ge.children[0],
            ve = ge.children[1]),
            L.controlsContainer && setAttrs(ge, {
                "aria-label": "Carousel Navigation",
                tabindex: "0"
            }),
            (L.controlsContainer || L.prevButton && L.nextButton) && setAttrs([he, ve], {
                "aria-controls": Ft,
                tabindex: "-1"
            }),
            (L.controlsContainer || L.prevButton && L.nextButton) && (setAttrs(he, {
                "data-controls": "prev"
            }),
            setAttrs(ve, {
                "data-controls": "next"
            })),
            de = isButton(he),
            fe = isButton(ve),
            updateControlsStatus(),
            ge ? addEvents(ge, Xt) : (addEvents(he, Xt),
            addEvents(ve, Xt))),
            disableUI()
        }
        function initEvents() {
            if (_ && u) {
                var t = {};
                t[u] = onTransitionEnd,
                addEvents(F, t)
            }
            dt && addEvents(F, Yt, L.preventScrollOnTouch),
            ft && addEvents(F, Qt),
            nt && addEvents(M, Zt),
            "inner" === I ? Wt.on("outerResized", function() {
                resizeTasks(),
                Wt.emit("innerLoaded", info())
            }) : (R || q || X || rt || !W) && addEvents(v, {
                resize: onResize
            }),
            rt && ("outer" === I ? Wt.on("innerLoaded", doAutoHeight) : Vt || doAutoHeight()),
            doLazyLoad(),
            Vt ? disableSlider() : Jt && freezeSlider(),
            Wt.on("indexChanged", additionalUpdates),
            "inner" === I && Wt.emit("innerLoaded", info()),
            "function" == typeof Ht && Ht(info()),
            J = !0
        }
        function onResize(t) {
            Ue(function() {
                resizeTasks(getEvent(t))
            })
        }
        function resizeTasks(t) {
            if (J) {
                "outer" === I && Wt.emit("outerResized", info(t)),
                G = getWindowWidth();
                var e, n = H, i = !1;
                R && (setBreakpointZone(),
                (e = n !== H) && Wt.emit("newBreakpointStart", info(t)));
                var a, o, r = Q, s = Vt, l = Jt, u = nt, c = st, d = ct, f = dt, g = ft, p = gt, h = vt, v = mt, m = Mt;
                if (e) {
                    var b = q
                      , y = rt
                      , w = lt
                      , C = Y
                      , S = ht;
                    if (!D)
                        var E = $
                          , x = U
                }
                if (nt = getOption("arrowKeys"),
                st = getOption("controls"),
                ct = getOption("nav"),
                dt = getOption("touch"),
                Y = getOption("center"),
                ft = getOption("mouseDrag"),
                gt = getOption("autoplay"),
                vt = getOption("autoplayHoverPause"),
                mt = getOption("autoplayResetOnVisibility"),
                e && (Vt = getOption("disable"),
                q = getOption("fixedWidth"),
                it = getOption("speed"),
                rt = getOption("autoHeight"),
                lt = getOption("controlsText"),
                ht = getOption("autoplayText"),
                pt = getOption("autoplayTimeout"),
                D || (U = getOption("edgePadding"),
                $ = getOption("gutter"))),
                resetVariblesWhenDisable(Vt),
                Z = getViewportWidth(),
                W && !X || Vt || (setSlidePositions(),
                W || (updateContentWrapperHeight(),
                i = !0)),
                (q || X) && (xt = getRightBoundary(),
                It = Lt()),
                (e || q) && (Q = getOption("items"),
                tt = getOption("slideBy"),
                (o = Q !== r) && (q || X || (It = Lt()),
                Je())),
                e && Vt !== s && (Vt ? disableSlider() : function enableSlider() {
                    if (!zt)
                        return;
                    if (bt.disabled = !1,
                    F.className += jt,
                    doContainerTransformSilent(),
                    ot)
                        for (var t = Ct; t--; )
                            _ && showElement(V[t]),
                            showElement(V[St - t - 1]);
                    if (!_)
                        for (var e = Mt, n = Mt + z; e < n; e++) {
                            var i = V[e]
                              , a = e < Mt + Q ? P : B;
                            i.style.left = 100 * (e - Mt) / Q + "%",
                            Ye(i, a)
                        }
                    enableUI(),
                    zt = !1
                }()),
                Gt && (e || q || X) && (Jt = getFreeze()) !== l && (Jt ? (doContainerTransform(getContainerTransformValue(getStartIndex(0))),
                freezeSlider()) : (function unfreezeSlider() {
                    if (!Kt)
                        return;
                    U && D && (j.style.margin = "");
                    if (Ct)
                        for (var t = "tns-transparent", e = Ct; e--; )
                            _ && Qe(V[e], t),
                            Qe(V[St - e - 1], t);
                    enableUI(),
                    Kt = !1
                }(),
                i = !0)),
                resetVariblesWhenDisable(Vt || Jt),
                gt || (vt = mt = !1),
                nt !== u && (nt ? addEvents(M, Zt) : removeEvents(M, Zt)),
                st !== c && (st ? ge ? showElement(ge) : (he && showElement(he),
                ve && showElement(ve)) : ge ? hideElement(ge) : (he && hideElement(he),
                ve && hideElement(ve))),
                ct !== d && (ct ? showElement(we) : hideElement(we)),
                dt !== f && (dt ? addEvents(F, Yt, L.preventScrollOnTouch) : removeEvents(F, Yt)),
                ft !== g && (ft ? addEvents(F, Qt) : removeEvents(F, Qt)),
                gt !== p && (gt ? (Ne && showElement(Ne),
                De || Ie || startAutoplay()) : (Ne && hideElement(Ne),
                De && stopAutoplay())),
                vt !== h && (vt ? addEvents(F, Ut) : removeEvents(F, Ut)),
                mt !== v && (mt ? addEvents(M, $t) : removeEvents(M, $t)),
                e) {
                    if (q === b && Y === C || (i = !0),
                    rt !== y && (rt || (j.style.height = "")),
                    st && lt !== w && (he.innerHTML = lt[0],
                    ve.innerHTML = lt[1]),
                    Ne && ht !== S) {
                        var T = gt ? 1 : 0
                          , A = Ne.innerHTML
                          , O = A.length - S[T].length;
                        A.substring(O) === S[T] && (Ne.innerHTML = A.substring(0, O) + ht[T])
                    }
                } else
                    Y && (q || X) && (i = !0);
                if ((o || q && !X) && (Se = getPages(),
                updateNavVisibility()),
                (a = Mt !== m) ? (Wt.emit("indexChanged", info()),
                i = !0) : o ? a || additionalUpdates() : (q || X) && (doLazyLoad(),
                updateSlideStatus(),
                updateLiveRegion()),
                !o && _ || function updateGallerySlidePositions() {
                    for (var t = Mt + Math.min(z, Q), e = St; e--; ) {
                        var n = V[e];
                        Mt <= e && e < t ? (Ye(n, "tns-moving"),
                        n.style.left = 100 * (e - Mt) / Q + "%",
                        Ye(n, P),
                        Qe(n, B)) : n.style.left && (n.style.left = "",
                        Ye(n, B),
                        Qe(n, P)),
                        Qe(n, N)
                    }
                    setTimeout(function() {
                        forEach(V, function(t) {
                            Qe(t, "tns-moving")
                        })
                    }, 300)
                }(),
                !Vt && !Jt) {
                    if (e && !D && (rt === autoheightTem && it === speedTem || update_carousel_transition_duration(),
                    U === x && $ === E || (j.style.cssText = getInnerWrapperStyles(U, $, q, it, rt)),
                    W)) {
                        _ && (F.style.width = getContainerWidth(q, $, Q));
                        var k = getSlideWidthStyle(q, $, Q) + getSlideGutterStyle($);
                        !function removeCSSRule(t, e) {
                            "deleteRule"in t ? t.deleteRule(e) : t.removeRule(e)
                        }(bt, getCssRulesLength(bt) - 1),
                        addCSSRule(bt, "#" + Ft + " > .tns-item", k, getCssRulesLength(bt))
                    }
                    rt && doAutoHeight(),
                    i && (doContainerTransformSilent(),
                    Dt = Mt)
                }
                e && Wt.emit("newBreakpointEnd", info(t))
            }
        }
        function getFreeze() {
            if (!q && !X)
                return z <= (Y ? Q - (Q - 1) / 2 : Q);
            var t = q ? (q + $) * z : O[z]
              , e = U ? Z + 2 * U : Z + $;
            return Y && (e -= q ? (Z - q) / 2 : (Z - (O[Mt + 1] - O[Mt] - $)) / 2),
            t <= e
        }
        function setBreakpointZone() {
            for (var t in H = 0,
            R)
                (t = parseInt(t)) <= G && (H = t)
        }
        function disableUI() {
            !gt && Ne && hideElement(Ne),
            !ct && we && hideElement(we),
            st || (ge ? hideElement(ge) : (he && hideElement(he),
            ve && hideElement(ve)))
        }
        function enableUI() {
            gt && Ne && showElement(Ne),
            ct && we && showElement(we),
            st && (ge ? showElement(ge) : (he && showElement(he),
            ve && showElement(ve)))
        }
        function freezeSlider() {
            if (!Kt) {
                if (U && (j.style.margin = "0px"),
                Ct)
                    for (var t = "tns-transparent", e = Ct; e--; )
                        _ && Ye(V[e], t),
                        Ye(V[St - e - 1], t);
                disableUI(),
                Kt = !0
            }
        }
        function disableSlider() {
            if (!zt) {
                if (bt.disabled = !0,
                F.className = F.className.replace(jt.substring(1), ""),
                removeAttrs(F, ["style"]),
                ot)
                    for (var t = Ct; t--; )
                        _ && hideElement(V[t]),
                        hideElement(V[St - t - 1]);
                if (W && _ || removeAttrs(j, ["style"]),
                !_)
                    for (var e = Mt, n = Mt + z; e < n; e++) {
                        var i = V[e];
                        removeAttrs(i, ["style"]),
                        Qe(i, P),
                        Qe(i, B)
                    }
                disableUI(),
                zt = !0
            }
        }
        function updateLiveRegion() {
            var t = getLiveRegionStr();
            K.innerHTML !== t && (K.innerHTML = t)
        }
        function getLiveRegionStr() {
            var t = getVisibleSlideRange()
              , e = t[0] + 1
              , n = t[1] + 1;
            return e === n ? e + "" : e + " to " + n
        }
        function getVisibleSlideRange(t) {
            null == t && (t = getContainerTransformValue());
            var n, i, a, o = Mt;
            if (Y || U ? (X || q) && (i = -(parseFloat(t) + U),
            a = i + Z + 2 * U) : X && (i = O[Mt],
            a = i + Z),
            X)
                O.forEach(function(t, e) {
                    e < St && ((Y || U) && t <= i + .5 && (o = e),
                    .5 <= a - t && (n = e))
                });
            else {
                if (q) {
                    var e = q + $;
                    n = Y || U ? (o = Math.floor(i / e),
                    Math.ceil(a / e - 1)) : o + Math.ceil(Z / e) - 1
                } else if (Y || U) {
                    var r = Q - 1;
                    if (n = Y ? (o -= r / 2,
                    Mt + r / 2) : Mt + r,
                    U) {
                        var s = U * Q / Z;
                        o -= s,
                        n += s
                    }
                    o = Math.floor(o),
                    n = Math.ceil(n)
                } else
                    n = o + Q - 1;
                o = Math.max(o, 0),
                n = Math.min(n, St - 1)
            }
            return [o, n]
        }
        function doLazyLoad() {
            yt && !Vt && getImageArray.apply(null, getVisibleSlideRange()).forEach(function(t) {
                if (!Ze(t, le)) {
                    var e = {};
                    e[u] = function(t) {
                        t.stopPropagation()
                    }
                    ,
                    addEvents(t, e),
                    addEvents(t, ue),
                    t.src = getAttr(t, "data-src");
                    var n = getAttr(t, "data-srcset");
                    n && (t.srcset = n),
                    Ye(t, "loading")
                }
            })
        }
        function imgLoaded(t) {
            Ye(t, "loaded"),
            imgCompleted(t)
        }
        function imgCompleted(t) {
            Ye(t, "tns-complete"),
            Qe(t, "loading"),
            removeEvents(t, ue)
        }
        function getImageArray(t, e) {
            for (var n = []; t <= e; )
                forEach(V[t].querySelectorAll("img"), function(t) {
                    n.push(t)
                }),
                t++;
            return n
        }
        function doAutoHeight() {
            var t = getImageArray.apply(null, getVisibleSlideRange());
            Ue(function() {
                imgsLoadedCheck(t, updateInnerWrapperHeight)
            })
        }
        function imgsLoadedCheck(n, t) {
            return k ? t() : (n.forEach(function(t, e) {
                Ze(t, le) && n.splice(e, 1)
            }),
            n.length ? void Ue(function() {
                imgsLoadedCheck(n, t)
            }) : t())
        }
        function additionalUpdates() {
            doLazyLoad(),
            updateSlideStatus(),
            updateLiveRegion(),
            updateControlsStatus(),
            function updateNavStatus() {
                if (ct && (Te = 0 <= xe ? xe : getCurrentNavIndex(),
                xe = -1,
                Te !== Ae)) {
                    var t = ye[Ae]
                      , e = ye[Te];
                    setAttrs(t, {
                        tabindex: "-1",
                        "aria-label": ke + (Ae + 1)
                    }),
                    Qe(t, Oe),
                    setAttrs(e, {
                        "aria-label": ke + (Te + 1) + Le
                    }),
                    removeAttrs(e, "tabindex"),
                    Ye(e, Oe),
                    Ae = Te
                }
            }()
        }
        function update_carousel_transition_duration() {
            _ && rt && (E.style[y] = it / 1e3 + "s")
        }
        function getMaxSlideHeight(t, e) {
            for (var n = [], i = t, a = Math.min(t + e, St); i < a; i++)
                n.push(V[i].offsetHeight);
            return Math.max.apply(null, n)
        }
        function updateInnerWrapperHeight() {
            var t = rt ? getMaxSlideHeight(Mt, Q) : getMaxSlideHeight(Ct, z)
              , e = E || j;
            e.style.height !== t && (e.style.height = t + "px")
        }
        function setSlidePositions() {
            O = [0];
            var n = W ? "left" : "top"
              , i = W ? "right" : "bottom"
              , a = V[0].getBoundingClientRect()[n];
            forEach(V, function(t, e) {
                e && O.push(t.getBoundingClientRect()[n] - a),
                e === St - 1 && O.push(t.getBoundingClientRect()[i] - a)
            })
        }
        function updateSlideStatus() {
            var t = getVisibleSlideRange()
              , n = t[0]
              , i = t[1];
            forEach(V, function(t, e) {
                n <= e && e <= i ? hasAttr(t, "aria-hidden") && (removeAttrs(t, ["aria-hidden", "tabindex"]),
                Ye(t, se)) : hasAttr(t, "aria-hidden") || (setAttrs(t, {
                    "aria-hidden": "true",
                    tabindex: "-1"
                }),
                Qe(t, se))
            })
        }
        function getLowerCaseNodeName(t) {
            return t.nodeName.toLowerCase()
        }
        function isButton(t) {
            return "button" === getLowerCaseNodeName(t)
        }
        function isAriaDisabled(t) {
            return "true" === t.getAttribute("aria-disabled")
        }
        function disEnableElement(t, e, n) {
            t ? e.disabled = n : e.setAttribute("aria-disabled", n.toString())
        }
        function updateControlsStatus() {
            if (st && !at && !ot) {
                var t = de ? he.disabled : isAriaDisabled(he)
                  , e = fe ? ve.disabled : isAriaDisabled(ve)
                  , n = Mt <= Rt
                  , i = !at && It <= Mt;
                n && !t && disEnableElement(de, he, !0),
                !n && t && disEnableElement(de, he, !1),
                i && !e && disEnableElement(fe, ve, !0),
                !i && e && disEnableElement(fe, ve, !1)
            }
        }
        function resetDuration(t, e) {
            y && (t.style[y] = e)
        }
        function getCenterGap(t) {
            return null == t && (t = Mt),
            X ? (Z - (U ? $ : 0) - (O[t + 1] - O[t] - $)) / 2 : q ? (Z - q) / 2 : (Q - 1) / 2
        }
        function getRightBoundary() {
            var t = Z + (U ? $ : 0) - function getSliderWidth() {
                return q ? (q + $) * St : O[St]
            }();
            return Y && !ot && (t = q ? -(q + $) * (St - 1) - getCenterGap() : getCenterGap(St - 1) - O[St - 1]),
            0 < t && (t = 0),
            t
        }
        function getContainerTransformValue(t) {
            var e;
            if (null == t && (t = Mt),
            W && !X)
                if (q)
                    e = -(q + $) * t,
                    Y && (e += getCenterGap());
                else {
                    var n = o ? St : Q;
                    Y && (t -= getCenterGap()),
                    e = 100 * -t / n
                }
            else
                e = -O[t],
                Y && X && (e += getCenterGap());
            return Et && (e = Math.max(e, xt)),
            e += !W || X || q ? "px" : "%"
        }
        function doContainerTransformSilent(t) {
            resetDuration(F, "0s"),
            doContainerTransform(t)
        }
        function doContainerTransform(t) {
            null == t && (t = getContainerTransformValue()),
            "rtl" === ut && "-" === t.charAt(0) && (t = t.substr(1)),
            F.style[At] = Ot + t + kt
        }
        function animateSlide(t, e, n, i) {
            var a = t + Q;
            ot || (a = Math.min(a, St));
            for (var o = t; o < a; o++) {
                var r = V[o];
                i || (r.style.left = 100 * (o - Mt) / Q + "%"),
                S && s && (r.style[s] = r.style[l] = S * (o - t) / 1e3 + "s"),
                Qe(r, e),
                Ye(r, n),
                i && wt.push(r)
            }
        }
        function render(t, e) {
            Tt && Je(),
            Mt === Dt && !e || (Wt.emit("indexChanged", info()),
            Wt.emit("transitionStart", info()),
            rt && doAutoHeight(),
            De && t && 0 <= ["click", "keydown"].indexOf(t.type) && stopAutoplay(),
            Bt = !0,
            Ke())
        }
        function strTrans(t) {
            return t.toLowerCase().replace(/-/g, "")
        }
        function onTransitionEnd(t) {
            if (clearTimeout(te),
            te = null,
            _ || Bt) {
                if (Wt && Wt.emit("transitionEnd", info(t)),
                !_ && 0 < wt.length)
                    for (var e = 0; e < wt.length; e++) {
                        var n = wt[e];
                        n.style.left = "",
                        l && s && (n.style[l] = "",
                        n.style[s] = ""),
                        Qe(n, N),
                        Ye(n, B)
                    }
                if (!t || !_ && t.target.parentNode === F || t.target === F && strTrans(t.propertyName) === strTrans(At)) {
                    if (!Tt) {
                        var i = Mt;
                        Je(),
                        Mt !== i && Wt && (Wt.emit("indexChanged", info()),
                        doContainerTransformSilent())
                    }
                    "inner" === I && Wt.emit("innerLoaded", info()),
                    Dt = Mt
                }
                Bt = !1
            }
        }
        function goTo(t, e) {
            if (!Jt)
                if ("prev" === t)
                    onControlsClick(e, -1);
                else if ("next" === t)
                    onControlsClick(e, 1);
                else {
                    if (Bt) {
                        if (_t)
                            return;
                        onTransitionEnd()
                    }
                    var n = getAbsIndex()
                      , i = 0;
                    if ("first" === t ? i = -n : "last" === t ? i = _ ? z - Q - n : z - 1 - n : ("number" != typeof t && (t = parseInt(t)),
                    isNaN(t) || (e || (t = Math.max(0, Math.min(z - 1, t))),
                    i = t - n)),
                    !_ && i && Math.abs(i) < Q) {
                        var a = 0 < i ? 1 : -1;
                        i += Rt <= Mt + i - z ? z * a : 2 * z * a * -1
                    }
                    Mt += i,
                    _ && ot && (Mt < Rt && (Mt += z),
                    It < Mt && (Mt -= z)),
                    getAbsIndex(Mt) !== getAbsIndex(Dt) && render(e)
                }
        }
        function onControlsClick(t, e) {
            if (Bt) {
                if (_t)
                    return;
                onTransitionEnd()
            }
            var n;
            if (!e) {
                for (var i = getTarget(t = getEvent(t)); i !== ge && [he, ve].indexOf(i) < 0; )
                    i = i.parentNode;
                var a = [he, ve].indexOf(i);
                0 <= a && (n = !0,
                e = 0 === a ? -1 : 1)
            }
            if (at) {
                if (Mt === Rt && -1 === e)
                    return void goTo("last", t);
                if (Mt === It && 1 === e)
                    return void goTo("first", t)
            }
            e && (Mt += tt * e,
            X && (Mt = Math.floor(Mt)),
            render(n || t && "keydown" === t.type ? t : null))
        }
        function onNavClick(t) {
            if (Bt) {
                if (_t)
                    return;
                onTransitionEnd()
            }
            for (var e = getTarget(t = getEvent(t)); e !== we && !hasAttr(e, "data-nav"); )
                e = e.parentNode;
            if (hasAttr(e, "data-nav")) {
                var n = xe = Number(getAttr(e, "data-nav"))
                  , i = q || X ? n * z / Se : n * Q;
                goTo(ie ? n : Math.min(Math.ceil(i), z - 1), t),
                Te === n && (De && stopAutoplay(),
                xe = -1)
            }
        }
        function setAutoplayTimer() {
            Me = setInterval(function() {
                onControlsClick(null, Pe)
            }, pt),
            De = !0
        }
        function stopAutoplayTimer() {
            clearInterval(Me),
            De = !1
        }
        function updateAutoplayButton(t, e) {
            setAttrs(Ne, {
                "data-action": t
            }),
            Ne.innerHTML = He[0] + t + He[1] + e
        }
        function startAutoplay() {
            setAutoplayTimer(),
            Ne && updateAutoplayButton("stop", ht[1])
        }
        function stopAutoplay() {
            stopAutoplayTimer(),
            Ne && updateAutoplayButton("start", ht[0])
        }
        function toggleAutoplay() {
            Ie = De ? (stopAutoplay(),
            !0) : (startAutoplay(),
            !1)
        }
        function setFocus(t) {
            t.focus()
        }
        function getEvent(t) {
            return isTouchEvent(t = t || v.event) ? t.changedTouches[0] : t
        }
        function getTarget(t) {
            return t.target || v.event.srcElement
        }
        function isTouchEvent(t) {
            return 0 <= t.type.indexOf("touch")
        }
        function preventDefaultBehavior(t) {
            t.preventDefault ? t.preventDefault() : t.returnValue = !1
        }
        function getMoveDirectionExpected() {
            return function getTouchDirection(t, e) {
                var n = !1
                  , i = Math.abs(90 - Math.abs(t));
                return 90 - e <= i ? n = "horizontal" : i <= e && (n = "vertical"),
                n
            }(function toDegree(t, e) {
                return Math.atan2(t, e) * (180 / Math.PI)
            }(Ve.y - Fe.y, Ve.x - Fe.x), Pt) === L.axis
        }
        function onPanStart(t) {
            if (Bt) {
                if (_t)
                    return;
                onTransitionEnd()
            }
            gt && De && stopAutoplayTimer(),
            ze = !0,
            je && ($e(je),
            je = null);
            var e = getEvent(t);
            Wt.emit(isTouchEvent(t) ? "touchStart" : "dragStart", info(t)),
            !isTouchEvent(t) && 0 <= ["img", "a"].indexOf(getLowerCaseNodeName(getTarget(t))) && preventDefaultBehavior(t),
            Ve.x = Fe.x = e.clientX,
            Ve.y = Fe.y = e.clientY,
            _ && (We = parseFloat(F.style[At].replace(Ot, "")),
            resetDuration(F, "0s"))
        }
        function onPanMove(t) {
            if (ze) {
                var e = getEvent(t);
                Ve.x = e.clientX,
                Ve.y = e.clientY,
                _ ? je = je || Ue(function() {
                    !function panUpdate(t) {
                        if (!Nt)
                            return void (ze = !1);
                        $e(je);
                        ze && (je = Ue(function() {
                            panUpdate(t)
                        }));
                        "?" === Nt && (Nt = getMoveDirectionExpected());
                        if (Nt) {
                            !ce && isTouchEvent(t) && (ce = !0);
                            try {
                                t.type && Wt.emit(isTouchEvent(t) ? "touchMove" : "dragMove", info(t))
                            } catch (t) {}
                            var e = !1
                              , n = We
                              , i = Ge(Ve, Fe);
                            if (!W || q || X)
                                n += i,
                                n += "px";
                            else {
                                var a = o ? i * Q * 100 / ((Z + $) * St) : 100 * i / (Z + $);
                                n = Math.max(Xe, Math.min(n + a, qe)),
                                e = n === Xe || n === qe,
                                n += "%"
                            }
                            F.style[At] = Ot + n + kt,
                            e && onPanEnd(t)
                        }
                    }(t)
                }) : ("?" === Nt && (Nt = getMoveDirectionExpected()),
                Nt && (ce = !0)),
                ce && t.preventDefault()
            }
        }
        function onPanEnd(i) {
            if (ze) {
                je && ($e(je),
                je = null),
                _ && resetDuration(F, ""),
                ze = !1;
                var t = getEvent(i);
                Ve.x = t.clientX,
                Ve.y = t.clientY;
                var a = Ge(Ve, Fe);
                if (Math.abs(a)) {
                    if (!isTouchEvent(i)) {
                        var e = getTarget(i);
                        addEvents(e, {
                            click: function preventClick(t) {
                                preventDefaultBehavior(t),
                                removeEvents(e, {
                                    click: preventClick
                                })
                            }
                        })
                    }
                    _ ? je = Ue(function() {
                        if (W && !X) {
                            var t = -a * Q / (Z + $);
                            t = 0 < a ? Math.floor(t) : Math.ceil(t),
                            10 <= Math.abs(a) && ("rtl" === ut ? Mt -= t : Mt += t)
                        } else {
                            var e = -(We + a);
                            if (e <= 0)
                                Mt = Rt;
                            else if (e >= O[St - 1])
                                Mt = It;
                            else
                                for (var n = 0; n < St && e >= O[n]; )
                                    e > O[Mt = n] && a < 0 && (Mt += 1),
                                    n++
                        }
                        render(i, a),
                        Wt.emit(isTouchEvent(i) ? "touchEnd" : "dragEnd", info(i))
                    }) : Nt && onControlsClick(i, 0 < a ? -1 : 1)
                }
            }
            "auto" === L.preventScrollOnTouch && (ce = !1),
            Pt && (Nt = "?"),
            gt && !De && setAutoplayTimer()
        }
        function updateContentWrapperHeight() {
            (E || j).style.height = O[Mt + Q] - O[Mt] + "px"
        }
        function getPages() {
            var t = q ? (q + $) * z / Z : z / Q;
            return Math.min(Math.ceil(t), z)
        }
        function updateNavVisibility() {
            if (ct && !ie && Se !== Ee) {
                var t = Ee
                  , e = Se
                  , n = showElement;
                for (Se < Ee && (t = Se,
                e = Ee,
                n = hideElement); t < e; )
                    n(ye[t]),
                    t++;
                Ee = Se
            }
        }
        function info(t) {
            return {
                container: F,
                slideItems: V,
                navContainer: we,
                navItems: ye,
                controlsContainer: ge,
                hasControls: ee,
                prevButton: he,
                nextButton: ve,
                items: Q,
                slideBy: tt,
                cloneCount: Ct,
                slideCount: z,
                slideCountNew: St,
                index: Mt,
                indexCached: Dt,
                displayIndex: getCurrentSlide(),
                navCurrentIndex: Te,
                navCurrentIndexCached: Ae,
                pages: Se,
                pagesCached: Ee,
                sheet: bt,
                isOn: J,
                event: t || {}
            }
        }
        d && console.warn("No slides found in", L.container)
    };
    return tn
}();
window.matchMedia || (window.matchMedia = function() {
    "use strict";
    var e = window.styleMedia || window.media;
    if (!e) {
        var n, i = document.createElement("style"), t = document.getElementsByTagName("script")[0];
        i.type = "text/css",
        i.id = "matchmediajs-test",
        t.parentNode.insertBefore(i, t),
        n = "getComputedStyle"in window && window.getComputedStyle(i, null) || i.currentStyle,
        e = {
            matchMedium: function(t) {
                var e = "@media " + t + "{ #matchmediajs-test { width: 1px; } }";
                return i.styleSheet ? i.styleSheet.cssText = e : i.textContent = e,
                "1px" === n.width
            }
        }
    }
    return function(t) {
        return {
            matches: e.matchMedium(t || "all"),
            media: t || "all"
        }
    }
}()),
document.addEventListener("deviceready", function onDeviceReady() {
    window.plugins || (window.plugins = {}),
    window.plugins.gaPlugin || (window.plugins.gaPlugin = new GAPlugin)
}, !1),
document.addEventListener("deviceready", function onDeviceReady() {
    window.plugins || (window.plugins = {}),
    window.plugins.utilities = new Utilities
}, !1),
document.addEventListener("deviceready", function onDeviceReady() {
    window.plugins || (window.plugins = {}),
    window.plugins.revenueSDK = new RevenueSDK
}, !1);
