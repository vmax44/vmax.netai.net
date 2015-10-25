(function() {
    var _jQuery = window.jQuery,
        _$ = window.$;
    var jQuery = window.jQuery = window.$ = function(selector, context) {
        return new jQuery.fn.init(selector, context)
    };
    var quickExpr = /^[^<]*(<(.|\s)+>)[^>]*$|^#(\w+)$/,
        isSimple = /^.[^:#\[\.]*$/,
        undefined;
    jQuery.fn = jQuery.prototype = {
        init: function(selector, context) {
            selector = selector || document;
            if (selector.nodeType) {
                this[0] = selector;
                this.length = 1;
                return this
            }
            if (typeof selector == "string") {
                var match = quickExpr.exec(selector);
                if (match && (match[1] || !context)) {
                    if (match[1]) {
                        selector = jQuery.clean([match[1]], context)
                    } else {
                        var elem = document.getElementById(match[3]);
                        if (elem) {
                            if (elem.id != match[3]) {
                                return jQuery().find(selector)
                            }
                            return jQuery(elem)
                        }
                        selector = []
                    }
                } else {
                    return jQuery(context).find(selector)
                }
            } else {
                if (jQuery.isFunction(selector)) {
                    return jQuery(document)[jQuery.fn.ready ? "ready" : "load"](selector)
                }
            }
            return this.setArray(jQuery.makeArray(selector))
        },
        jquery: "1.2.6",
        size: function() {
            return this.length
        },
        length: 0,
        get: function(num) {
            return num == undefined ? jQuery.makeArray(this) : this[num]
        },
        pushStack: function(elems) {
            var ret = jQuery(elems);
            ret.prevObject = this;
            return ret
        },
        setArray: function(elems) {
            this.length = 0;
            Array.prototype.push.apply(this, elems);
            return this
        },
        each: function(callback, args) {
            return jQuery.each(this, callback, args)
        },
        index: function(elem) {
            var ret = -1;
            return jQuery.inArray(elem && elem.jquery ? elem[0] : elem, this)
        },
        attr: function(name, value, type) {
            var options = name;
            if (name.constructor == String) {
                if (value === undefined) {
                    return this[0] && jQuery[type || "attr"](this[0], name)
                } else {
                    options = {};
                    options[name] = value
                }
            }
            return this.each(function(i) {
                for (name in options) {
                    jQuery.attr(type ? this.style : this, name, jQuery.prop(this, options[name], type, i, name))
                }
            })
        },
        css: function(key, value) {
            if ((key == "width" || key == "height") && parseFloat(value) < 0) {
                value = undefined
            }
            return this.attr(key, value, "curCSS")
        },
        text: function(text) {
            if (typeof text != "object" && text != null) {
                return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text))
            }
            var ret = "";
            jQuery.each(text || this, function() {
                jQuery.each(this.childNodes, function() {
                    if (this.nodeType != 8) {
                        ret += this.nodeType != 1 ? this.nodeValue : jQuery.fn.text([this])
                    }
                })
            });
            return ret
        },
        wrapAll: function(html) {
            if (this[0]) {
                jQuery(html, this[0].ownerDocument).clone().insertBefore(this[0]).map(function() {
                    var elem = this;
                    while (elem.firstChild) {
                        elem = elem.firstChild
                    }
                    return elem
                }).append(this)
            }
            return this
        },
        wrapInner: function(html) {
            return this.each(function() {
                jQuery(this).contents().wrapAll(html)
            })
        },
        wrap: function(html) {
            return this.each(function() {
                jQuery(this).wrapAll(html)
            })
        },
        append: function() {
            return this.domManip(arguments, true, false, function(elem) {
                if (this.nodeType == 1) {
                    this.appendChild(elem)
                }
            })
        },
        prepend: function() {
            return this.domManip(arguments, true, true, function(elem) {
                if (this.nodeType == 1) {
                    this.insertBefore(elem, this.firstChild)
                }
            })
        },
        before: function() {
            return this.domManip(arguments, false, false, function(elem) {
                this.parentNode.insertBefore(elem, this)
            })
        },
        after: function() {
            return this.domManip(arguments, false, true, function(elem) {
                this.parentNode.insertBefore(elem, this.nextSibling)
            })
        },
        end: function() {
            return this.prevObject || jQuery([])
        },
        find: function(selector) {
            var elems = jQuery.map(this, function(elem) {
                return jQuery.find(selector, elem)
            });
            return this.pushStack(/[^+>] [^+>]/.test(selector) || selector.indexOf("..") > -1 ? jQuery.unique(elems) : elems)
        },
        clone: function(events) {
            var ret = this.map(function() {
                if (jQuery.browser.msie && !jQuery.isXMLDoc(this)) {
                    var clone = this.cloneNode(true),
                        container = document.createElement("div");
                    container.appendChild(clone);
                    return jQuery.clean([container.innerHTML])[0]
                } else {
                    return this.cloneNode(true)
                }
            });
            var clone = ret.find("*").andSelf().each(function() {
                if (this[expando] != undefined) {
                    this[expando] = null
                }
            });
            if (events === true) {
                this.find("*").andSelf().each(function(i) {
                    if (this.nodeType == 3) {
                        return
                    }
                    var events = jQuery.data(this, "events");
                    for (var type in events) {
                        for (var handler in events[type]) {
                            jQuery.event.add(clone[i], type, events[type][handler], events[type][handler].data)
                        }
                    }
                })
            }
            return ret
        },
        filter: function(selector) {
            return this.pushStack(jQuery.isFunction(selector) && jQuery.grep(this, function(elem, i) {
                return selector.call(elem, i)
            }) || jQuery.multiFilter(selector, this))
        },
        not: function(selector) {
            if (selector.constructor == String) {
                if (isSimple.test(selector)) {
                    return this.pushStack(jQuery.multiFilter(selector, this, true))
                } else {
                    selector = jQuery.multiFilter(selector, this)
                }
            }
            var isArrayLike = selector.length && selector[selector.length - 1] !== undefined && !selector.nodeType;
            return this.filter(function() {
                return isArrayLike ? jQuery.inArray(this, selector) < 0 : this != selector
            })
        },
        add: function(selector) {
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(), typeof selector == "string" ? jQuery(selector) : jQuery.makeArray(selector))))
        },
        is: function(selector) {
            return !!selector && jQuery.multiFilter(selector, this).length > 0
        },
        hasClass: function(selector) {
            return this.is("." + selector)
        },
        val: function(value) {
            if (value == undefined) {
                if (this.length) {
                    var elem = this[0];
                    if (jQuery.nodeName(elem, "select")) {
                        var index = elem.selectedIndex,
                            values = [],
                            options = elem.options,
                            one = elem.type == "select-one";
                        if (index < 0) {
                            return null
                        }
                        for (var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++) {
                            var option = options[i];
                            if (option.selected) {
                                value = jQuery.browser.msie && !option.attributes.value.specified ? option.text : option.value;
                                if (one) {
                                    return value
                                }
                                values.push(value)
                            }
                        }
                        return values
                    } else {
                        return (this[0].value || "").replace(/\r/g, "")
                    }
                }
                return undefined
            }
            if (value.constructor == Number) {
                value += ""
            }
            return this.each(function() {
                if (this.nodeType != 1) {
                    return
                }
                if (value.constructor == Array && /radio|checkbox/.test(this.type)) {
                    this.checked = (jQuery.inArray(this.value, value) >= 0 || jQuery.inArray(this.name, value) >= 0)
                } else {
                    if (jQuery.nodeName(this, "select")) {
                        var values = jQuery.makeArray(value);
                        jQuery("option", this).each(function() {
                            this.selected = (jQuery.inArray(this.value, values) >= 0 || jQuery.inArray(this.text, values) >= 0)
                        });
                        if (!values.length) {
                            this.selectedIndex = -1
                        }
                    } else {
                        this.value = value
                    }
                }
            })
        },
        html: function(value) {
            return value == undefined ? (this[0] ? this[0].innerHTML : null) : this.empty().append(value)
        },
        replaceWith: function(value) {
            return this.after(value).remove()
        },
        eq: function(i) {
            return this.slice(i, i + 1)
        },
        slice: function() {
            return this.pushStack(Array.prototype.slice.apply(this, arguments))
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem)
            }))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        },
        data: function(key, value) {
            var parts = key.split(".");
            parts[1] = parts[1] ? "." + parts[1] : "";
            if (value === undefined) {
                var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);
                if (data === undefined && this.length) {
                    data = jQuery.data(this[0], key)
                }
                return data === undefined && parts[1] ? this.data(parts[0]) : data
            } else {
                return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
                    jQuery.data(this, key, value)
                })
            }
        },
        removeData: function(key) {
            return this.each(function() {
                jQuery.removeData(this, key)
            })
        },
        domManip: function(args, table, reverse, callback) {
            var clone = this.length > 1,
                elems;
            return this.each(function() {
                if (!elems) {
                    elems = jQuery.clean(args, this.ownerDocument);
                    if (reverse) {
                        elems.reverse()
                    }
                }
                var obj = this;
                if (table && jQuery.nodeName(this, "table") && jQuery.nodeName(elems[0], "tr")) {
                    obj = this.getElementsByTagName("tbody")[0] || this.appendChild(this.ownerDocument.createElement("tbody"))
                }
                var scripts = jQuery([]);
                jQuery.each(elems, function() {
                    var elem = clone ? jQuery(this).clone(true)[0] : this;
                    if (jQuery.nodeName(elem, "script")) {
                        scripts = scripts.add(elem)
                    } else {
                        if (elem.nodeType == 1) {
                            scripts = scripts.add(jQuery("script", elem).remove())
                        }
                        callback.call(obj, elem)
                    }
                });
                scripts.each(evalScript)
            })
        }
    };
    jQuery.fn.init.prototype = jQuery.fn;

    function evalScript(i, elem) {
        if (elem.src) {
            jQuery.ajax({
                url: elem.src,
                async: false,
                dataType: "script"
            })
        } else {
            jQuery.globalEval(elem.text || elem.textContent || elem.innerHTML || "")
        }
        if (elem.parentNode) {
            elem.parentNode.removeChild(elem)
        }
    }

    function _q_get_today() {
        var _date = new Date();
        return _date.getUTCFullYear() + "" + _date.getUTCMonth() + "" + _date.getUTCDate()
    }

    function now() {
        return +new Date
    }
    jQuery.extend = jQuery.fn.extend = function() {
        var target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false,
            options;
        if (target.constructor == Boolean) {
            deep = target;
            target = arguments[1] || {};
            i = 2
        }
        if (typeof target != "object" && typeof target != "function") {
            target = {}
        }
        if (length == i) {
            target = this;
            --i
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (var name in options) {
                    var src = target[name],
                        copy = options[name];
                    if (target === copy) {
                        continue
                    }
                    if (deep && copy && typeof copy == "object" && !copy.nodeType) {
                        target[name] = jQuery.extend(deep, src || (copy.length != null ? [] : {}), copy)
                    } else {
                        if (copy !== undefined) {
                            target[name] = copy
                        }
                    }
                }
            }
        }
        return target
    };
    var expando = "jQuery" + now(),
        uuid = 0,
        windowData = {},
        exclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
        defaultView = document.defaultView || {};
    jQuery.extend({
        noConflict: function(deep) {
            window.$ = _$;
            if (deep) {
                window.jQuery = _jQuery
            }
            return jQuery
        },
        isFunction: function(fn) {
            return !!fn && typeof fn != "string" && !fn.nodeName && fn.constructor != Array && /^[\s[]?function/.test(fn + "")
        },
        isXMLDoc: function(elem) {
            return elem.documentElement && !elem.body || elem.tagName && elem.ownerDocument && !elem.ownerDocument.body
        },
        globalEval: function(data) {
            data = jQuery.trim(data);
            if (data) {
                var head = document.getElementsByTagName("head")[0] || document.documentElement,
                    script = document.createElement("script");
                script.type = "text/javascript";
                if (jQuery.browser.msie) {
                    script.text = data
                } else {
                    script.appendChild(document.createTextNode(data))
                }
                head.insertBefore(script, head.firstChild);
                head.removeChild(script)
            }
        },
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toUpperCase() == name.toUpperCase()
        },
        cache: {},
        data: function(elem, name, data) {
            elem = elem == window ? windowData : elem;
            var id = elem[expando];
            if (!id) {
                id = elem[expando] = ++uuid
            }
            if (name && !jQuery.cache[id]) {
                jQuery.cache[id] = {}
            }
            if (data !== undefined) {
                jQuery.cache[id][name] = data
            }
            return name ? jQuery.cache[id][name] : id
        },
        removeData: function(elem, name) {
            elem = elem == window ? windowData : elem;
            var id = elem[expando];
            if (name) {
                if (jQuery.cache[id]) {
                    delete jQuery.cache[id][name];
                    name = "";
                    for (name in jQuery.cache[id]) {
                        break
                    }
                    if (!name) {
                        jQuery.removeData(elem)
                    }
                }
            } else {
                try {
                    delete elem[expando]
                } catch (e) {
                    if (elem.removeAttribute) {
                        elem.removeAttribute(expando)
                    }
                }
                delete jQuery.cache[id]
            }
        },
        each: function(object, callback, args) {
            var name, i = 0,
                length = object.length;
            if (args) {
                if (length == undefined) {
                    for (name in object) {
                        if (callback.apply(object[name], args) === false) {
                            break
                        }
                    }
                } else {
                    for (; i < length;) {
                        if (callback.apply(object[i++], args) === false) {
                            break
                        }
                    }
                }
            } else {
                if (length == undefined) {
                    for (name in object) {
                        if (callback.call(object[name], name, object[name]) === false) {
                            break
                        }
                    }
                } else {
                    for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) {}
                }
            }
            return object
        },
        prop: function(elem, value, type, i, name) {
            if (jQuery.isFunction(value)) {
                value = value.call(elem, i)
            }
            return value && value.constructor == Number && type == "curCSS" && !exclude.test(name) ? value + "px" : value
        },
        className: {
            add: function(elem, classNames) {
                jQuery.each((classNames || "").split(/\s+/), function(i, className) {
                    if (elem.nodeType == 1 && !jQuery.className.has(elem.className, className)) {
                        elem.className += (elem.className ? " " : "") + className
                    }
                })
            },
            remove: function(elem, classNames) {
                if (elem.nodeType == 1) {
                    elem.className = classNames != undefined ? jQuery.grep(elem.className.split(/\s+/), function(className) {
                        return !jQuery.className.has(classNames, className)
                    }).join(" ") : ""
                }
            },
            has: function(elem, className) {
                return jQuery.inArray(className, (elem.className || elem).toString().split(/\s+/)) > -1
            }
        },
        swap: function(elem, options, callback) {
            var old = {};
            for (var name in options) {
                old[name] = elem.style[name];
                elem.style[name] = options[name]
            }
            callback.call(elem);
            for (var name in options) {
                elem.style[name] = old[name]
            }
        },
        css: function(elem, name, force) {
            if (name == "width" || name == "height") {
                var val, props = {
                        position: "absolute",
                        visibility: "hidden",
                        display: "block"
                    },
                    which = name == "width" ? ["Left", "Right"] : ["Top", "Bottom"];

                function getWH() {
                    val = name == "width" ? elem.offsetWidth : elem.offsetHeight;
                    var padding = 0,
                        border = 0;
                    jQuery.each(which, function() {
                        padding += parseFloat(jQuery.curCSS(elem, "padding" + this, true)) || 0;
                        border += parseFloat(jQuery.curCSS(elem, "border" + this + "Width", true)) || 0
                    });
                    val -= Math.round(padding + border)
                }
                if (jQuery(elem).is(":visible")) {
                    getWH()
                } else {
                    jQuery.swap(elem, props, getWH)
                }
                return Math.max(0, val)
            }
            return jQuery.curCSS(elem, name, force)
        },
        curCSS: function(elem, name, force) {
            var ret, style = elem.style;

            function color(elem) {
                if (!jQuery.browser.safari) {
                    return false
                }
                var ret = defaultView.getComputedStyle(elem, null);
                return !ret || ret.getPropertyValue("color") == ""
            }
            if (name == "opacity" && jQuery.browser.msie) {
                ret = jQuery.attr(style, "opacity");
                return ret == "" ? "1" : ret
            }
            if (jQuery.browser.opera && name == "display") {
                var save = style.outline;
                style.outline = "0 solid black";
                style.outline = save
            }
            if (name.match(/float/i)) {
                name = styleFloat
            }
            if (!force && style && style[name]) {
                ret = style[name]
            } else {
                if (defaultView.getComputedStyle) {
                    if (name.match(/float/i)) {
                        name = "float"
                    }
                    name = name.replace(/([A-Z])/g, "-$1").toLowerCase();
                    var computedStyle = defaultView.getComputedStyle(elem, null);
                    if (computedStyle && !color(elem)) {
                        ret = computedStyle.getPropertyValue(name)
                    } else {
                        var swap = [],
                            stack = [],
                            a = elem,
                            i = 0;
                        for (; a && color(a); a = a.parentNode) {
                            stack.unshift(a)
                        }
                        for (; i < stack.length; i++) {
                            if (color(stack[i])) {
                                swap[i] = stack[i].style.display;
                                stack[i].style.display = "block"
                            }
                        }
                        ret = name == "display" && swap[stack.length - 1] != null ? "none" : (computedStyle && computedStyle.getPropertyValue(name)) || "";
                        for (i = 0; i < swap.length; i++) {
                            if (swap[i] != null) {
                                stack[i].style.display = swap[i]
                            }
                        }
                    }
                    if (name == "opacity" && ret == "") {
                        ret = "1"
                    }
                } else {
                    if (elem.currentStyle) {
                        var camelCase = name.replace(/\-(\w)/g, function(all, letter) {
                            return letter.toUpperCase()
                        });
                        ret = elem.currentStyle[name] || elem.currentStyle[camelCase];
                        if (!/^\d+(px)?$/i.test(ret) && /^\d/.test(ret)) {
                            var left = style.left,
                                rsLeft = elem.runtimeStyle.left;
                            elem.runtimeStyle.left = elem.currentStyle.left;
                            style.left = ret || 0;
                            ret = style.pixelLeft + "px";
                            style.left = left;
                            elem.runtimeStyle.left = rsLeft
                        }
                    }
                }
            }
            return ret
        },
        clean: function(elems, context) {
            var ret = [];
            context = context || document;
            if (typeof context.createElement == "undefined") {
                context = context.ownerDocument || context[0] && context[0].ownerDocument || document
            }
            jQuery.each(elems, function(i, elem) {
                if (!elem) {
                    return
                }
                if (elem.constructor == Number) {
                    elem += ""
                }
                if (typeof elem == "string") {
                    elem = elem.replace(/(<(\w+)[^>]*?)\/>/g, function(all, front, tag) {
                        return tag.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? all : front + "></" + tag + ">"
                    });
                    var tags = jQuery.trim(elem).toLowerCase(),
                        div = context.createElement("div");
                    var wrap = !tags.indexOf("<opt") && [1, "<select multiple='multiple'>", "</select>"] || !tags.indexOf("<leg") && [1, "<fieldset>", "</fieldset>"] || tags.match(/^<(thead|tbody|tfoot|colg|cap)/) && [1, "<table>", "</table>"] || !tags.indexOf("<tr") && [2, "<table><tbody>", "</tbody></table>"] || (!tags.indexOf("<td") || !tags.indexOf("<th")) && [3, "<table><tbody><tr>", "</tr></tbody></table>"] || !tags.indexOf("<col") && [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"] || jQuery.browser.msie && [1, "div<div>", "</div>"] || [0, "", ""];
                    div.innerHTML = wrap[1] + elem + wrap[2];
                    while (wrap[0]--) {
                        div = div.lastChild
                    }
                    if (jQuery.browser.msie) {
                        var tbody = !tags.indexOf("<table") && tags.indexOf("<tbody") < 0 ? div.firstChild && div.firstChild.childNodes : wrap[1] == "<table>" && tags.indexOf("<tbody") < 0 ? div.childNodes : [];
                        for (var j = tbody.length - 1; j >= 0; --j) {
                            if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
                                tbody[j].parentNode.removeChild(tbody[j])
                            }
                        }
                        if (/^\s/.test(elem)) {
                            div.insertBefore(context.createTextNode(elem.match(/^\s*/)[0]), div.firstChild)
                        }
                    }
                    elem = jQuery.makeArray(div.childNodes)
                }
                if (elem.length === 0 && (!jQuery.nodeName(elem, "form") && !jQuery.nodeName(elem, "select"))) {
                    return
                }
                if (elem[0] == undefined || jQuery.nodeName(elem, "form") || elem.options) {
                    ret.push(elem)
                } else {
                    ret = jQuery.merge(ret, elem)
                }
            });
            return ret
        },
        attr: function(elem, name, value) {
            if (!elem || elem.nodeType == 3 || elem.nodeType == 8) {
                return undefined
            }
            var notxml = !jQuery.isXMLDoc(elem),
                set = value !== undefined,
                msie = jQuery.browser.msie;
            name = notxml && jQuery.props[name] || name;
            if (elem.tagName) {
                var special = /href|src|style/.test(name);
                if (name == "selected" && jQuery.browser.safari) {
                    elem.parentNode.selectedIndex
                }
                if (name in elem && notxml && !special) {
                    if (set) {
                        if (name == "type" && jQuery.nodeName(elem, "input") && elem.parentNode) {
                            throw "type property can't be changed"
                        }
                        elem[name] = value
                    }
                    if (jQuery.nodeName(elem, "form") && elem.getAttributeNode(name)) {
                        return elem.getAttributeNode(name).nodeValue
                    }
                    return elem[name]
                }
                if (msie && notxml && name == "style") {
                    return jQuery.attr(elem.style, "cssText", value)
                }
                if (set) {
                    elem.setAttribute(name, "" + value)
                }
                var attr = msie && notxml && special ? elem.getAttribute(name, 2) : elem.getAttribute(name);
                return attr === null ? undefined : attr
            }
            if (msie && name == "opacity") {
                if (set) {
                    elem.zoom = 1;
                    elem.filter = (elem.filter || "").replace(/alpha\([^)]*\)/, "") + (parseInt(value) + "" == "NaN" ? "" : "alpha(opacity=" + value * 100 + ")")
                }
                return elem.filter && elem.filter.indexOf("opacity=") >= 0 ? (parseFloat(elem.filter.match(/opacity=([^)]*)/)[1]) / 100) + "" : ""
            }
            name = name.replace(/-([a-z])/ig, function(all, letter) {
                return letter.toUpperCase()
            });
            if (set) {
                elem[name] = value
            }
            return elem[name]
        },
        trim: function(text) {
            return (text || "").replace(/^\s+|\s+$/g, "")
        },
        makeArray: function(array) {
            var ret = [];
            if (array != null) {
                var i = array.length;
                if (i == null || array.split || array.setInterval || array.call) {
                    ret[0] = array
                } else {
                    while (i) {
                        ret[--i] = array[i]
                    }
                }
            }
            return ret
        },
        inArray: function(elem, array) {
            for (var i = 0, length = array.length; i < length; i++) {
                if (array[i] === elem) {
                    return i
                }
            }
            return -1
        },
        merge: function(first, second) {
            var i = 0,
                elem, pos = first.length;
            if (jQuery.browser.msie) {
                while (elem = second[i++]) {
                    if (elem.nodeType != 8) {
                        first[pos++] = elem
                    }
                }
            } else {
                while (elem = second[i++]) {
                    first[pos++] = elem
                }
            }
            return first
        },
        unique: function(array) {
            var ret = [],
                done = {};
            try {
                for (var i = 0, length = array.length; i < length; i++) {
                    var id = jQuery.data(array[i]);
                    if (!done[id]) {
                        done[id] = true;
                        ret.push(array[i])
                    }
                }
            } catch (e) {
                ret = array
            }
            return ret
        },
        grep: function(elems, callback, inv) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                if (!inv != !callback(elems[i], i)) {
                    ret.push(elems[i])
                }
            }
            return ret
        },
        map: function(elems, callback) {
            var ret = [];
            for (var i = 0, length = elems.length; i < length; i++) {
                var value = callback(elems[i], i);
                if (value != null) {
                    ret[ret.length] = value
                }
            }
            return ret.concat.apply([], ret)
        }
    });
    var userAgent = navigator.userAgent.toLowerCase();
    jQuery.browser = {
        version: (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1],
        safari: /webkit/.test(userAgent),
        opera: /opera/.test(userAgent),
        msie: /msie/.test(userAgent) && !/opera/.test(userAgent),
        mozilla: /mozilla/.test(userAgent) && !/(compatible|webkit)/.test(userAgent)
    };
    var styleFloat = jQuery.browser.msie ? "styleFloat" : "cssFloat";
    jQuery.extend({
        boxModel: !jQuery.browser.msie || document.compatMode == "CSS1Compat",
        props: {
            "for": "htmlFor",
            "class": "className",
            "float": styleFloat,
            cssFloat: styleFloat,
            styleFloat: styleFloat,
            readonly: "readOnly",
            maxlength: "maxLength",
            cellspacing: "cellSpacing"
        }
    });
    jQuery.each({
        parent: function(elem) {
            return elem.parentNode
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode")
        },
        next: function(elem) {
            return jQuery.nth(elem, 2, "nextSibling")
        },
        prev: function(elem) {
            return jQuery.nth(elem, 2, "previousSibling")
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling")
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling")
        },
        siblings: function(elem) {
            return jQuery.sibling(elem.parentNode.firstChild, elem)
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild)
        },
        contents: function(elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes)
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(selector) {
            var ret = jQuery.map(this, fn);
            if (selector && typeof selector == "string") {
                ret = jQuery.multiFilter(selector, ret)
            }
            return this.pushStack(jQuery.unique(ret))
        }
    });
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function() {
            var args = arguments;
            return this.each(function() {
                for (var i = 0, length = args.length; i < length; i++) {
                    jQuery(args[i])[original](this)
                }
            })
        }
    });
    jQuery.each({
        removeAttr: function(name) {
            jQuery.attr(this, name, "");
            if (this.nodeType == 1) {
                this.removeAttribute(name)
            }
        },
        addClass: function(classNames) {
            jQuery.className.add(this, classNames)
        },
        removeClass: function(classNames) {
            jQuery.className.remove(this, classNames)
        },
        toggleClass: function(classNames) {
            jQuery.className[jQuery.className.has(this, classNames) ? "remove" : "add"](this, classNames)
        },
        remove: function(selector) {
            if (!selector || jQuery.filter(selector, [this]).r.length) {
                jQuery("*", this).add(this).each(function() {
                    jQuery.event.remove(this);
                    jQuery.removeData(this)
                });
                if (this.parentNode) {
                    this.parentNode.removeChild(this)
                }
            }
        },
        empty: function() {
            jQuery(">*", this).remove();
            while (this.firstChild) {
                this.removeChild(this.firstChild)
            }
        }
    }, function(name, fn) {
        jQuery.fn[name] = function() {
            return this.each(fn, arguments)
        }
    });
    jQuery.each(["Height", "Width"], function(i, name) {
        var type = name.toLowerCase();
        jQuery.fn[type] = function(size) {
            return this[0] == window ? jQuery.browser.opera && document.body["client" + name] || jQuery.browser.safari && window["inner" + name] || document.compatMode == "CSS1Compat" && document.documentElement["client" + name] || document.body["client" + name] : this[0] == document ? Math.max(Math.max(document.body["scroll" + name], document.documentElement["scroll" + name]), Math.max(document.body["offset" + name], document.documentElement["offset" + name])) : size == undefined ? (this.length ? jQuery.css(this[0], type) : null) : this.css(type, size.constructor == String ? size : size + "px")
        }
    });

    function num(elem, prop) {
        return elem[0] && parseInt(jQuery.curCSS(elem[0], prop, true), 10) || 0
    }
    var chars = jQuery.browser.safari && parseInt(jQuery.browser.version) < 417 ? "(?:[\\w*_-]|\\\\.)" : "(?:[\\w\u0128-\uFFFF*_-]|\\\\.)",
        quickChild = new RegExp("^>\\s*(" + chars + "+)"),
        quickID = new RegExp("^(" + chars + "+)(#)(" + chars + "+)"),
        quickClass = new RegExp("^([#.]?)(" + chars + "*)");
    jQuery.extend({
        expr: {
            "": function(a, i, m) {
                return m[2] == "*" || jQuery.nodeName(a, m[2])
            },
            "#": function(a, i, m) {
                return a.getAttribute("id") == m[2]
            },
            ":": {
                lt: function(a, i, m) {
                    return i < m[3] - 0
                },
                gt: function(a, i, m) {
                    return i > m[3] - 0
                },
                nth: function(a, i, m) {
                    return m[3] - 0 == i
                },
                eq: function(a, i, m) {
                    return m[3] - 0 == i
                },
                first: function(a, i) {
                    return i == 0
                },
                last: function(a, i, m, r) {
                    return i == r.length - 1
                },
                even: function(a, i) {
                    return i % 2 == 0
                },
                odd: function(a, i) {
                    return i % 2
                },
                "first-child": function(a) {
                    return a.parentNode.getElementsByTagName("*")[0] == a
                },
                "last-child": function(a) {
                    return jQuery.nth(a.parentNode.lastChild, 1, "previousSibling") == a
                },
                "only-child": function(a) {
                    return !jQuery.nth(a.parentNode.lastChild, 2, "previousSibling")
                },
                parent: function(a) {
                    return a.firstChild
                },
                empty: function(a) {
                    return !a.firstChild
                },
                contains: function(a, i, m) {
                    return (a.textContent || a.innerText || jQuery(a).text() || "").indexOf(m[3]) >= 0
                },
                visible: function(a) {
                    return "hidden" != a.type && jQuery.css(a, "display") != "none" && jQuery.css(a, "visibility") != "hidden"
                },
                hidden: function(a) {
                    return "hidden" == a.type || jQuery.css(a, "display") == "none" || jQuery.css(a, "visibility") == "hidden"
                },
                enabled: function(a) {
                    return !a.disabled
                },
                disabled: function(a) {
                    return a.disabled
                },
                checked: function(a) {
                    return a.checked
                },
                selected: function(a) {
                    return a.selected || jQuery.attr(a, "selected")
                },
                text: function(a) {
                    return "text" == a.type
                },
                radio: function(a) {
                    return "radio" == a.type
                },
                checkbox: function(a) {
                    return "checkbox" == a.type
                },
                file: function(a) {
                    return "file" == a.type
                },
                password: function(a) {
                    return "password" == a.type
                },
                submit: function(a) {
                    return "submit" == a.type
                },
                image: function(a) {
                    return "image" == a.type
                },
                reset: function(a) {
                    return "reset" == a.type
                },
                button: function(a) {
                    return "button" == a.type || jQuery.nodeName(a, "button")
                },
                input: function(a) {
                    return /input|select|textarea|button/i.test(a.nodeName)
                },
                has: function(a, i, m) {
                    return jQuery.find(m[3], a).length
                },
                header: function(a) {
                    return /h\d/i.test(a.nodeName)
                },
                animated: function(a) {
                    return jQuery.grep(jQuery.timers, function(fn) {
                        return a == fn.elem
                    }).length
                }
            }
        },
        parse: [/^(\[) *@?([\w-]+) *([!*$^~=]*) *('?"?)(.*?)\4 *\]/, /^(:)([\w-]+)\("?'?(.*?(\(.*?\))?[^(]*?)"?'?\)/, new RegExp("^([:.#]*)(" + chars + "+)")],
        multiFilter: function(expr, elems, not) {
            var old, cur = [];
            while (expr && expr != old) {
                old = expr;
                var f = jQuery.filter(expr, elems, not);
                expr = f.t.replace(/^\s*,\s*/, "");
                cur = not ? elems = f.r : jQuery.merge(cur, f.r)
            }
            return cur
        },
        find: function(t, context) {
            if (typeof t != "string") {
                return [t]
            }
            if (context && context.nodeType != 1 && context.nodeType != 9) {
                return []
            }
            context = context || document;
            var ret = [context],
                done = [],
                last, nodeName;
            while (t && last != t) {
                var r = [];
                last = t;
                t = jQuery.trim(t);
                var foundToken = false,
                    re = quickChild,
                    m = re.exec(t);
                if (m) {
                    nodeName = m[1].toUpperCase();
                    for (var i = 0; ret[i]; i++) {
                        for (var c = ret[i].firstChild; c; c = c.nextSibling) {
                            if (c.nodeType == 1 && (nodeName == "*" || c.nodeName.toUpperCase() == nodeName)) {
                                r.push(c)
                            }
                        }
                    }
                    ret = r;
                    t = t.replace(re, "");
                    if (t.indexOf(" ") == 0) {
                        continue
                    }
                    foundToken = true
                } else {
                    re = /^([>+~])\s*(\w*)/i;
                    if ((m = re.exec(t)) != null) {
                        r = [];
                        var merge = {};
                        nodeName = m[2].toUpperCase();
                        m = m[1];
                        for (var j = 0, rl = ret.length; j < rl; j++) {
                            var n = m == "~" || m == "+" ? ret[j].nextSibling : ret[j].firstChild;
                            for (; n; n = n.nextSibling) {
                                if (n.nodeType == 1) {
                                    var id = jQuery.data(n);
                                    if (m == "~" && merge[id]) {
                                        break
                                    }
                                    if (!nodeName || n.nodeName.toUpperCase() == nodeName) {
                                        if (m == "~") {
                                            merge[id] = true
                                        }
                                        r.push(n)
                                    }
                                    if (m == "+") {
                                        break
                                    }
                                }
                            }
                        }
                        ret = r;
                        t = jQuery.trim(t.replace(re, ""));
                        foundToken = true
                    }
                }
                if (t && !foundToken) {
                    if (!t.indexOf(",")) {
                        if (context == ret[0]) {
                            ret.shift()
                        }
                        done = jQuery.merge(done, ret);
                        r = ret = [context];
                        t = " " + t.substr(1, t.length)
                    } else {
                        var re2 = quickID;
                        var m = re2.exec(t);
                        if (m) {
                            m = [0, m[2], m[3], m[1]]
                        } else {
                            re2 = quickClass;
                            m = re2.exec(t)
                        }
                        m[2] = m[2].replace(/\\/g, "");
                        var elem = ret[ret.length - 1];
                        if (m[1] == "#" && elem && elem.getElementById && !jQuery.isXMLDoc(elem)) {
                            var oid = elem.getElementById(m[2]);
                            if ((jQuery.browser.msie || jQuery.browser.opera) && oid && typeof oid.id == "string" && oid.id != m[2]) {
                                oid = jQuery('[@id="' + m[2] + '"]', elem)[0]
                            }
                            ret = r = oid && (!m[3] || jQuery.nodeName(oid, m[3])) ? [oid] : []
                        } else {
                            for (var i = 0; ret[i]; i++) {
                                var tag = m[1] == "#" && m[3] ? m[3] : m[1] != "" || m[0] == "" ? "*" : m[2];
                                if (tag == "*" && ret[i].nodeName.toLowerCase() == "object") {
                                    tag = "param"
                                }
                                r = jQuery.merge(r, ret[i].getElementsByTagName(tag))
                            }
                            if (m[1] == ".") {
                                r = jQuery.classFilter(r, m[2])
                            }
                            if (m[1] == "#") {
                                var tmp = [];
                                for (var i = 0; r[i]; i++) {
                                    if (r[i].getAttribute("id") == m[2]) {
                                        tmp = [r[i]];
                                        break
                                    }
                                }
                                r = tmp
                            }
                            ret = r
                        }
                        t = t.replace(re2, "")
                    }
                }
                if (t) {
                    var val = jQuery.filter(t, r);
                    ret = r = val.r;
                    t = jQuery.trim(val.t)
                }
            }
            if (t) {
                ret = []
            }
            if (ret && context == ret[0]) {
                ret.shift()
            }
            done = jQuery.merge(done, ret);
            return done
        },
        classFilter: function(r, m, not) {
            m = " " + m + " ";
            var tmp = [];
            for (var i = 0; r[i]; i++) {
                var pass = (" " + r[i].className + " ").indexOf(m) >= 0;
                if (!not && pass || not && !pass) {
                    tmp.push(r[i])
                }
            }
            return tmp
        },
        filter: function(t, r, not) {
            var last;
            while (t && t != last) {
                last = t;
                var p = jQuery.parse,
                    m;
                for (var i = 0; p[i]; i++) {
                    m = p[i].exec(t);
                    if (m) {
                        t = t.substring(m[0].length);
                        m[2] = m[2].replace(/\\/g, "");
                        break
                    }
                }
                if (!m) {
                    break
                }
                if (m[1] == ":" && m[2] == "not") {
                    r = isSimple.test(m[3]) ? jQuery.filter(m[3], r, true).r : jQuery(r).not(m[3])
                } else {
                    if (m[1] == ".") {
                        r = jQuery.classFilter(r, m[2], not)
                    } else {
                        if (m[1] == "[") {
                            var tmp = [],
                                type = m[3];
                            for (var i = 0, rl = r.length; i < rl; i++) {
                                var a = r[i],
                                    z = a[jQuery.props[m[2]] || m[2]];
                                if (z == null || /href|src|selected/.test(m[2])) {
                                    z = jQuery.attr(a, m[2]) || ""
                                }
                                if ((type == "" && !!z || type == "=" && z == m[5] || type == "!=" && z != m[5] || type == "^=" && z && !z.indexOf(m[5]) || type == "$=" && z.substr(z.length - m[5].length) == m[5] || (type == "*=" || type == "~=") && z.indexOf(m[5]) >= 0) ^ not) {
                                    tmp.push(a)
                                }
                            }
                            r = tmp
                        } else {
                            if (m[1] == ":" && m[2] == "nth-child") {
                                var merge = {},
                                    tmp = [],
                                    test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(m[3] == "even" && "2n" || m[3] == "odd" && "2n+1" || !/\D/.test(m[3]) && "0n+" + m[3] || m[3]),
                                    first = (test[1] + (test[2] || 1)) - 0,
                                    last = test[3] - 0;
                                for (var i = 0, rl = r.length; i < rl; i++) {
                                    var node = r[i],
                                        parentNode = node.parentNode,
                                        id = jQuery.data(parentNode);
                                    if (!merge[id]) {
                                        var c = 1;
                                        for (var n = parentNode.firstChild; n; n = n.nextSibling) {
                                            if (n.nodeType == 1) {
                                                n.nodeIndex = c++
                                            }
                                        }
                                        merge[id] = true
                                    }
                                    var add = false;
                                    if (first == 0) {
                                        if (node.nodeIndex == last) {
                                            add = true
                                        }
                                    } else {
                                        if ((node.nodeIndex - last) % first == 0 && (node.nodeIndex - last) / first >= 0) {
                                            add = true
                                        }
                                    }
                                    if (add ^ not) {
                                        tmp.push(node)
                                    }
                                }
                                r = tmp
                            } else {
                                var fn = jQuery.expr[m[1]];
                                if (typeof fn == "object") {
                                    fn = fn[m[2]]
                                }
                                if (typeof fn == "string") {
                                    fn = eval("false||function(a,i){return " + fn + ";}")
                                }
                                r = jQuery.grep(r, function(elem, i) {
                                    return fn(elem, i, m, r)
                                }, not)
                            }
                        }
                    }
                }
            }
            return {
                r: r,
                t: t
            }
        },
        dir: function(elem, dir) {
            var matched = [],
                cur = elem[dir];
            while (cur && cur != document) {
                if (cur.nodeType == 1) {
                    matched.push(cur)
                }
                cur = cur[dir]
            }
            return matched
        },
        nth: function(cur, result, dir, elem) {
            result = result || 1;
            var num = 0;
            for (; cur; cur = cur[dir]) {
                if (cur.nodeType == 1 && ++num == result) {
                    break
                }
            }
            return cur
        },
        sibling: function(n, elem) {
            var r = [];
            for (; n; n = n.nextSibling) {
                if (n.nodeType == 1 && n != elem) {
                    r.push(n)
                }
            }
            return r
        }
    });
    jQuery.event = {
        add: function(elem, types, handler, data) {
            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return
            }
            if (jQuery.browser.msie && elem.setInterval) {
                elem = window
            }
            if (!handler.guid) {
                handler.guid = this.guid++
            }
            if (data != undefined) {
                var fn = handler;
                handler = this.proxy(fn, function() {
                    return fn.apply(this, arguments)
                });
                handler.data = data
            }
            var events = jQuery.data(elem, "events") || jQuery.data(elem, "events", {}),
                handle = jQuery.data(elem, "handle") || jQuery.data(elem, "handle", function() {
                    if (typeof jQuery != "undefined" && !jQuery.event.triggered) {
                        return jQuery.event.handle.apply(arguments.callee.elem, arguments)
                    }
                });
            handle.elem = elem;
            jQuery.each(types.split(/\s+/), function(index, type) {
                var parts = type.split(".");
                type = parts[0];
                handler.type = parts[1];
                var handlers = events[type];
                if (!handlers) {
                    handlers = events[type] = {};
                    if (!jQuery.event.special[type] || jQuery.event.special[type].setup.call(elem) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, handle, false)
                        } else {
                            if (elem.attachEvent) {
                                elem.attachEvent("on" + type, handle)
                            }
                        }
                    }
                }
                handlers[handler.guid] = handler;
                jQuery.event.global[type] = true
            });
            elem = null
        },
        guid: 1,
        global: {},
        remove: function(elem, types, handler) {
            if (elem.nodeType == 3 || elem.nodeType == 8) {
                return
            }
            var events = jQuery.data(elem, "events"),
                ret, index;
            if (events) {
                if (types == undefined || (typeof types == "string" && types.charAt(0) == ".")) {
                    for (var type in events) {
                        this.remove(elem, type + (types || ""))
                    }
                } else {
                    if (types.type) {
                        handler = types.handler;
                        types = types.type
                    }
                    jQuery.each(types.split(/\s+/), function(index, type) {
                        var parts = type.split(".");
                        type = parts[0];
                        if (events[type]) {
                            if (handler) {
                                delete events[type][handler.guid]
                            } else {
                                for (handler in events[type]) {
                                    if (!parts[1] || events[type][handler].type == parts[1]) {
                                        delete events[type][handler]
                                    }
                                }
                            }
                            for (ret in events[type]) {
                                break
                            }
                            if (!ret) {
                                if (!jQuery.event.special[type] || jQuery.event.special[type].teardown.call(elem) === false) {
                                    if (elem.removeEventListener) {
                                        elem.removeEventListener(type, jQuery.data(elem, "handle"), false)
                                    } else {
                                        if (elem.detachEvent) {
                                            elem.detachEvent("on" + type, jQuery.data(elem, "handle"))
                                        }
                                    }
                                }
                                ret = null;
                                delete events[type]
                            }
                        }
                    })
                }
                for (ret in events) {
                    break
                }
                if (!ret) {
                    var handle = jQuery.data(elem, "handle");
                    if (handle) {
                        handle.elem = null
                    }
                    jQuery.removeData(elem, "events");
                    jQuery.removeData(elem, "handle")
                }
            }
        },
        trigger: function(type, data, elem, donative, extra) {
            data = jQuery.makeArray(data);
            if (type.indexOf("!") >= 0) {
                type = type.slice(0, -1);
                var exclusive = true
            }
            if (!elem) {
                if (this.global[type]) {
                    jQuery("*").add([window, document]).trigger(type, data)
                }
            } else {
                if (elem.nodeType == 3 || elem.nodeType == 8) {
                    return undefined
                }
                var val, ret, fn = jQuery.isFunction(elem[type] || null),
                    event = !data[0] || !data[0].preventDefault;
                if (event) {
                    data.unshift({
                        type: type,
                        target: elem,
                        preventDefault: function() {},
                        stopPropagation: function() {},
                        timeStamp: now()
                    });
                    data[0][expando] = true
                }
                data[0].type = type;
                if (exclusive) {
                    data[0].exclusive = true
                }
                var handle = jQuery.data(elem, "handle");
                if (handle) {
                    val = handle.apply(elem, data)
                }
                if ((!fn || (jQuery.nodeName(elem, "a") && type == "click")) && elem["on" + type] && elem["on" + type].apply(elem, data) === false) {
                    val = false
                }
                if (event) {
                    data.shift()
                }
                if (extra && jQuery.isFunction(extra)) {
                    ret = extra.apply(elem, val == null ? data : data.concat(val));
                    if (ret !== undefined) {
                        val = ret
                    }
                }
                if (fn && donative !== false && val !== false && !(jQuery.nodeName(elem, "a") && type == "click")) {
                    this.triggered = true;
                    try {
                        elem[type]()
                    } catch (e) {}
                }
                this.triggered = false
            }
            return val
        },
        handle: function(event) {
            var val, ret, namespace, all, handlers;
            event = arguments[0] = jQuery.event.fix(event || window.event);
            namespace = event.type.split(".");
            event.type = namespace[0];
            namespace = namespace[1];
            all = !namespace && !event.exclusive;
            handlers = (jQuery.data(this, "events") || {})[event.type];
            for (var j in handlers) {
                var handler = handlers[j];
                if (all || handler.type == namespace) {
                    event.handler = handler;
                    event.data = handler.data;
                    ret = handler.apply(this, arguments);
                    if (val !== false) {
                        val = ret
                    }
                    if (ret === false) {
                        event.preventDefault();
                        event.stopPropagation()
                    }
                }
            }
            return val
        },
        fix: function(event) {
            if (event[expando] == true) {
                return event
            }
            var originalEvent = event;
            event = {
                originalEvent: originalEvent
            };
            var props = "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode metaKey newValue originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target timeStamp toElement type view wheelDelta which".split(" ");
            for (var i = props.length; i; i--) {
                event[props[i]] = originalEvent[props[i]]
            }
            event[expando] = true;
            event.preventDefault = function() {
                if (originalEvent.preventDefault) {
                    originalEvent.preventDefault()
                }
                originalEvent.returnValue = false
            };
            event.stopPropagation = function() {
                if (originalEvent.stopPropagation) {
                    originalEvent.stopPropagation()
                }
                originalEvent.cancelBubble = true
            };
            event.timeStamp = event.timeStamp || now();
            if (!event.target) {
                event.target = event.srcElement || document
            }
            if (event.target.nodeType == 3) {
                event.target = event.target.parentNode
            }
            if (!event.relatedTarget && event.fromElement) {
                event.relatedTarget = event.fromElement == event.target ? event.toElement : event.fromElement
            }
            if (event.pageX == null && event.clientX != null) {
                var doc = document.documentElement,
                    body = document.body;
                event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
                event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0)
            }
            if (!event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode)) {
                event.which = event.charCode || event.keyCode
            }
            if (!event.metaKey && event.ctrlKey) {
                event.metaKey = event.ctrlKey
            }
            if (!event.which && event.button) {
                event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)))
            }
            return event
        },
        proxy: function(fn, proxy) {
            proxy.guid = fn.guid = fn.guid || proxy.guid || this.guid++;
            return proxy
        },
        special: {
            ready: {
                setup: function() {
                    bindReady();
                    return
                },
                teardown: function() {
                    return
                }
            },
            mouseenter: {
                setup: function() {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).bind("mouseover", jQuery.event.special.mouseenter.handler);
                    return true
                },
                teardown: function() {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).unbind("mouseover", jQuery.event.special.mouseenter.handler);
                    return true
                },
                handler: function(event) {
                    if (withinElement(event, this)) {
                        return true
                    }
                    event.type = "mouseenter";
                    return jQuery.event.handle.apply(this, arguments)
                }
            },
            mouseleave: {
                setup: function() {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).bind("mouseout", jQuery.event.special.mouseleave.handler);
                    return true
                },
                teardown: function() {
                    if (jQuery.browser.msie) {
                        return false
                    }
                    jQuery(this).unbind("mouseout", jQuery.event.special.mouseleave.handler);
                    return true
                },
                handler: function(event) {
                    if (withinElement(event, this)) {
                        return true
                    }
                    event.type = "mouseleave";
                    return jQuery.event.handle.apply(this, arguments)
                }
            }
        }
    };
    jQuery.fn.extend({
        bind: function(type, data, fn) {
            return type == "unload" ? this.one(type, data, fn) : this.each(function() {
                jQuery.event.add(this, type, fn || data, fn && data)
            })
        },
        one: function(type, data, fn) {
            var one = jQuery.event.proxy(fn || data, function(event) {
                jQuery(this).unbind(event, one);
                return (fn || data).apply(this, arguments)
            });
            return this.each(function() {
                jQuery.event.add(this, type, one, fn && data)
            })
        },
        unbind: function(type, fn) {
            return this.each(function() {
                jQuery.event.remove(this, type, fn)
            })
        },
        trigger: function(type, data, fn) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this, true, fn)
            })
        },
        triggerHandler: function(type, data, fn) {
            return this[0] && jQuery.event.trigger(type, data, this[0], false, fn)
        },
        toggle: function(fn) {
            var args = arguments,
                i = 1;
            while (i < args.length) {
                jQuery.event.proxy(fn, args[i++])
            }
            return this.click(jQuery.event.proxy(fn, function(event) {
                this.lastToggle = (this.lastToggle || 0) % i;
                event.preventDefault();
                return args[this.lastToggle++].apply(this, arguments) || false
            }))
        },
        hover: function(fnOver, fnOut) {
            return this.bind("mouseenter", fnOver).bind("mouseleave", fnOut)
        },
        ready: function(fn) {
            bindReady();
            if (jQuery.isReady) {
                fn.call(document, jQuery)
            } else {
                jQuery.readyList.push(function() {
                    return fn.call(this, jQuery)
                })
            }
            return this
        }
    });
    jQuery.extend({
        isReady: false,
        readyList: [],
        ready: function() {
            if (!jQuery.isReady) {
                jQuery.isReady = true;
                if (jQuery.readyList) {
                    jQuery.each(jQuery.readyList, function() {
                        this.call(document)
                    });
                    jQuery.readyList = null
                }
                jQuery(document).triggerHandler("ready")
            }
        }
    });
    var readyBound = false;

    function bindReady() {
        if (readyBound) {
            return
        }
        readyBound = true;
        if (document.addEventListener && !jQuery.browser.opera) {
            document.addEventListener("DOMContentLoaded", jQuery.ready, false)
        }
        if (jQuery.browser.msie && window == top) {
            (function() {
                if (jQuery.isReady) {
                    return
                }
                try {
                    document.documentElement.doScroll("left")
                } catch (error) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                jQuery.ready()
            })()
        }
        if (jQuery.browser.opera) {
            document.addEventListener("DOMContentLoaded", function() {
                if (jQuery.isReady) {
                    return
                }
                for (var i = 0; i < document.styleSheets.length; i++) {
                    if (document.styleSheets[i].disabled) {
                        setTimeout(arguments.callee, 0);
                        return
                    }
                }
                jQuery.ready()
            }, false)
        }
        if (jQuery.browser.safari) {
            var numStyles;
            (function() {
                if (jQuery.isReady) {
                    return
                }
                if (document.readyState != "loaded" && document.readyState != "complete") {
                    setTimeout(arguments.callee, 0);
                    return
                }
                if (numStyles === undefined) {
                    numStyles = jQuery("style, link[rel=stylesheet]").length
                }
                if (document.styleSheets.length != numStyles) {
                    setTimeout(arguments.callee, 0);
                    return
                }
                jQuery.ready()
            })()
        }
        jQuery.event.add(window, "load", jQuery.ready)
    }
    jQuery.each(("blur,focus,load,resize,scroll,unload,click,dblclick,mousedown,mouseup,mousemove,mouseover,mouseout,change,select,submit,keydown,keypress,keyup,error").split(","), function(i, name) {
        jQuery.fn[name] = function(fn) {
            return fn ? this.bind(name, fn) : this.trigger(name)
        }
    });
    var withinElement = function(event, elem) {
        var parent = event.relatedTarget;
        while (parent && parent != elem) {
            try {
                parent = parent.parentNode
            } catch (error) {
                parent = elem
            }
        }
        return parent == elem
    };
    jQuery(window).bind("unload", function() {
        jQuery("*").add(document).unbind()
    });
    jQuery.fn.extend({
        _load: jQuery.fn.load,
        load: function(url, params, callback) {
            if (typeof url != "string") {
                return this._load(url)
            }
            var off = url.indexOf(" ");
            if (off >= 0) {
                var selector = url.slice(off, url.length);
                url = url.slice(0, off)
            }
            callback = callback || function() {};
            var type = "GET";
            if (params) {
                if (jQuery.isFunction(params)) {
                    callback = params;
                    params = null
                } else {
                    params = jQuery.param(params);
                    type = "POST"
                }
            }
            var self = this;
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params,
                complete: function(res, status) {
                    if (status == "success" || status == "notmodified") {
                        self.html(selector ? jQuery("<div/>").append(res.responseText.replace(/<script(.|\s)*?\/script>/g, "")).find(selector) : res.responseText)
                    }
                    self.each(callback, [res.responseText, status, res])
                }
            });
            return this
        },
        serialize: function() {
            return jQuery.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return jQuery.nodeName(this, "form") ? jQuery.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || /select|textarea/i.test(this.nodeName) || /text|hidden|password/i.test(this.type))
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : val.constructor == Array ? jQuery.map(val, function(val, i) {
                    return {
                        name: elem.name,
                        value: val
                    }
                }) : {
                    name: elem.name,
                    value: val
                }
            }).get()
        }
    });
    jQuery.each("ajaxStart,ajaxStop,ajaxComplete,ajaxError,ajaxSuccess,ajaxSend".split(","), function(i, o) {
        jQuery.fn[o] = function(f) {
            return this.bind(o, f)
        }
    });
    var jsc = _q_get_today();
    jQuery.extend({
        get: function(url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                callback = data;
                data = null
            }
            return jQuery.ajax({
                type: "GET",
                url: url,
                data: data,
                success: callback,
                dataType: type
            })
        },
        getScript: function(url, callback) {
            return jQuery.get(url, null, callback, "script")
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json")
        },
        post: function(url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                callback = data;
                data = {}
            }
            return jQuery.ajax({
                type: "POST",
                url: url,
                data: data,
                success: callback,
                dataType: type
            })
        },
        ajaxSetup: function(settings) {
            jQuery.extend(jQuery.ajaxSettings, settings)
        },
        ajaxSettings: {
            url: location.href,
            global: true,
            type: "GET",
            timeout: 0,
            contentType: "application/x-www-form-urlencoded",
            processData: true,
            async: true,
            data: null,
            username: null,
            password: null,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                script: "text/javascript, application/javascript",
                json: "application/json, text/javascript",
                text: "text/plain",
                _default: "*/*"
            }
        },
        lastModified: {},
        ajax: function(s) {
            s = jQuery.extend(true, s, jQuery.extend(true, {}, jQuery.ajaxSettings, s));
            var jsonp, jsre = /=\?(&|$)/g,
                status, data, type = s.type.toUpperCase();
            if (s.data && s.processData && typeof s.data != "string") {
                s.data = jQuery.param(s.data)
            }
            if (s.dataType == "jsonp") {
                if (type == "GET") {
                    if (!s.url.match(jsre)) {
                        s.url += (s.url.match(/\?/) ? "&" : "?") + (s.jsonp || "callback") + "=?"
                    }
                } else {
                    if (!s.data || !s.data.match(jsre)) {
                        s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?"
                    }
                }
                s.dataType = "json"
            }
            if (s.dataType == "json" && (s.data && s.data.match(jsre) || s.url.match(jsre))) {
                jsonp = "jsonp" + jsc++;
                if (s.data) {
                    s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1")
                }
                s.url = s.url.replace(jsre, "=" + jsonp + "$1");
                s.dataType = "script";
                window[jsonp] = function(tmp) {
                    data = tmp;
                    success();
                    complete();
                    window[jsonp] = undefined;
                    try {
                        delete window[jsonp]
                    } catch (e) {}
                    if (head) {
                        head.removeChild(script)
                    }
                }
            }
            if (s.dataType == "script" && s.cache == null) {
                s.cache = false
            }
            if (s.cache === false && type == "GET") {
                var ts = now();
                var ret = s.url.replace(/(\?|&)_=.*?(&|$)/, "$1_=" + ts + "$2");
                s.url = ret + ((ret == s.url) ? (s.url.match(/\?/) ? "&" : "?") + "_=" + ts : "")
            }
            if (s.data && type == "GET") {
                s.url += (s.url.match(/\?/) ? "&" : "?") + s.data;
                s.data = null
            }
            if (s.global && !jQuery.active++) {
                jQuery.event.trigger("ajaxStart")
            }
            var remote = /^(?:\w+:)?\/\/([^\/?#]+)/;
            if (s.dataType == "script" && type == "GET" && remote.test(s.url) && remote.exec(s.url)[1] != location.host) {
                var head = document.getElementsByTagName("head")[0];
                var script = document.createElement("script");
                script.src = s.url;
                if (s.scriptCharset) {
                    script.charset = s.scriptCharset
                }
                if (!jsonp) {
                    var done = false;
                    script.onload = script.onreadystatechange = function() {
                        if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
                            done = true;
                            success();
                            complete();
                            head.removeChild(script)
                        }
                    }
                }
                head.appendChild(script);
                return undefined
            }
            var requestDone = false;
            var xhr = window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
            if (s.username) {
                xhr.open(type, s.url, s.async, s.username, s.password)
            } else {
                xhr.open(type, s.url, s.async)
            }
            try {
                if (s.data) {
                    xhr.setRequestHeader("Content-Type", s.contentType)
                }
                if (s.ifModified) {
                    xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url] || "Thu, 01 Jan 1970 00:00:00 GMT")
                }
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                xhr.setRequestHeader("Accept", s.dataType && s.accepts[s.dataType] ? s.accepts[s.dataType] + ", */*" : s.accepts._default)
            } catch (e) {}
            if (s.beforeSend && s.beforeSend(xhr, s) === false) {
                s.global && jQuery.active--;
                xhr.abort();
                return false
            }
            if (s.global) {
                jQuery.event.trigger("ajaxSend", [xhr, s])
            }
            var onreadystatechange = function(isTimeout) {
                if (!requestDone && xhr && (xhr.readyState == 4 || isTimeout == "timeout")) {
                    requestDone = true;
                    if (ival) {
                        clearInterval(ival);
                        ival = null
                    }
                    status = isTimeout == "timeout" && "timeout" || !jQuery.httpSuccess(xhr) && "error" || s.ifModified && jQuery.httpNotModified(xhr, s.url) && "notmodified" || "success";
                    if (status == "success") {
                        try {
                            data = jQuery.httpData(xhr, s.dataType, s.dataFilter)
                        } catch (e) {
                            status = "parsererror"
                        }
                    }
                    if (status == "success") {
                        var modRes;
                        try {
                            modRes = xhr.getResponseHeader("Last-Modified")
                        } catch (e) {}
                        if (s.ifModified && modRes) {
                            jQuery.lastModified[s.url] = modRes
                        }
                        if (!jsonp) {
                            success()
                        }
                    } else {
                        jQuery.handleError(s, xhr, status)
                    }
                    complete();
                    if (s.async) {
                        xhr = null
                    }
                }
            };
            if (s.async) {
                var ival = setInterval(onreadystatechange, 13);
                if (s.timeout > 0) {
                    setTimeout(function() {
                        if (xhr) {
                            xhr.abort();
                            if (!requestDone) {
                                onreadystatechange("timeout")
                            }
                        }
                    }, s.timeout)
                }
            }
            try {
                xhr.send(s.data)
            } catch (e) {
                jQuery.handleError(s, xhr, null, e)
            }
            if (!s.async) {
                onreadystatechange()
            }

            function success() {
                if (s.success) {
                    s.success(data, status)
                }
                if (s.global) {
                    jQuery.event.trigger("ajaxSuccess", [xhr, s])
                }
            }

            function complete() {
                if (s.complete) {
                    s.complete(xhr, status)
                }
                if (s.global) {
                    jQuery.event.trigger("ajaxComplete", [xhr, s])
                }
                if (s.global && !--jQuery.active) {
                    jQuery.event.trigger("ajaxStop")
                }
            }
            return xhr
        },
        handleError: function(s, xhr, status, e) {
            if (s.error) {
                s.error(xhr, status, e)
            }
            if (s.global) {
                jQuery.event.trigger("ajaxError", [xhr, s, e])
            }
        },
        active: 0,
        httpSuccess: function(xhr) {
            try {
                return !xhr.status && location.protocol == "file:" || (xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || xhr.status == 1223 || jQuery.browser.safari && xhr.status == undefined
            } catch (e) {}
            return false
        },
        httpNotModified: function(xhr, url) {
            try {
                var xhrRes = xhr.getResponseHeader("Last-Modified");
                return xhr.status == 304 || xhrRes == jQuery.lastModified[url] || jQuery.browser.safari && xhr.status == undefined
            } catch (e) {}
            return false
        },
        httpData: function(xhr, type, filter) {
            var ct = xhr.getResponseHeader("content-type"),
                xml = type == "xml" || !type && ct && ct.indexOf("xml") >= 0,
                data = xml ? xhr.responseXML : xhr.responseText;
            if (xml && data.documentElement.tagName == "parsererror") {
                throw "parsererror"
            }
            if (filter) {
                data = filter(data, type)
            }
            if (type == "script") {
                jQuery.globalEval(data)
            }
            if (type == "json") {
                data = eval("(" + data + ")")
            }
            return data
        },
        param: function(a) {
            var s = [];
            if (a.constructor == Array || a.jquery) {
                jQuery.each(a, function() {
                    s.push(encodeURIComponent(this.name) + "=" + encodeURIComponent(this.value))
                })
            } else {
                for (var j in a) {
                    if (a[j] && a[j].constructor == Array) {
                        jQuery.each(a[j], function() {
                            s.push(encodeURIComponent(j) + "=" + encodeURIComponent(this))
                        })
                    } else {
                        s.push(encodeURIComponent(j) + "=" + encodeURIComponent(jQuery.isFunction(a[j]) ? a[j]() : a[j]))
                    }
                }
            }
            return s.join("&").replace(/%20/g, "+")
        }
    });
    jQuery.fn.extend({
        show: function(speed, callback) {
            return speed ? this.animate({
                height: "show",
                width: "show",
                opacity: "show"
            }, speed, callback) : this.filter(":hidden").each(function() {
                this.style.display = this.oldblock || "";
                if (jQuery.css(this, "display") == "none") {
                    var elem = jQuery("<" + this.tagName + " />").appendTo("body");
                    this.style.display = elem.css("display");
                    if (this.style.display == "none") {
                        this.style.display = "block"
                    }
                    elem.remove()
                }
            }).end()
        },
        hide: function(speed, callback) {
            return speed ? this.animate({
                height: "hide",
                width: "hide",
                opacity: "hide"
            }, speed, callback) : this.filter(":visible").each(function() {
                this.oldblock = this.oldblock || jQuery.css(this, "display");
                this.style.display = "none"
            }).end()
        },
        _toggle: jQuery.fn.toggle,
        toggle: function(fn, fn2) {
            return jQuery.isFunction(fn) && jQuery.isFunction(fn2) ? this._toggle.apply(this, arguments) : fn ? this.animate({
                height: "toggle",
                width: "toggle",
                opacity: "toggle"
            }, fn, fn2) : this.each(function() {
                jQuery(this)[jQuery(this).is(":hidden") ? "show" : "hide"]()
            })
        },
        slideDown: function(speed, callback) {
            return this.animate({
                height: "show"
            }, speed, callback)
        },
        slideUp: function(speed, callback) {
            return this.animate({
                height: "hide"
            }, speed, callback)
        },
        slideToggle: function(speed, callback) {
            return this.animate({
                height: "toggle"
            }, speed, callback)
        },
        fadeIn: function(speed, callback) {
            return this.animate({
                opacity: "show"
            }, speed, callback)
        },
        fadeOut: function(speed, callback) {
            return this.animate({
                opacity: "hide"
            }, speed, callback)
        },
        fadeTo: function(speed, to, callback) {
            return this.animate({
                opacity: to
            }, speed, callback)
        },
        animate: function(prop, speed, easing, callback) {
            var optall = jQuery.speed(speed, easing, callback);
            return this[optall.queue === false ? "each" : "queue"](function() {
                if (this.nodeType != 1) {
                    return false
                }
                var opt = jQuery.extend({}, optall),
                    p, hidden = jQuery(this).is(":hidden"),
                    self = this;
                for (p in prop) {
                    if (prop[p] == "hide" && hidden || prop[p] == "show" && !hidden) {
                        return opt.complete.call(this)
                    }
                    if (p == "height" || p == "width") {
                        opt.display = jQuery.css(this, "display");
                        opt.overflow = this.style.overflow
                    }
                }
                if (opt.overflow != null) {
                    this.style.overflow = "hidden"
                }
                opt.curAnim = jQuery.extend({}, prop);
                jQuery.each(prop, function(name, val) {
                    var e = new jQuery.fx(self, opt, name);
                    if (/toggle|show|hide/.test(val)) {
                        e[val == "toggle" ? hidden ? "show" : "hide" : val](prop)
                    } else {
                        var parts = val.toString().match(/^([+-]=)?([\d+-.]+)(.*)$/),
                            start = e.cur(true) || 0;
                        if (parts) {
                            var end = parseFloat(parts[2]),
                                unit = parts[3] || "px";
                            if (unit != "px") {
                                self.style[name] = (end || 1) + unit;
                                start = ((end || 1) / e.cur(true)) * start;
                                self.style[name] = start + unit
                            }
                            if (parts[1]) {
                                end = ((parts[1] == "-=" ? -1 : 1) * end) + start
                            }
                            e.custom(start, end, unit)
                        } else {
                            e.custom(start, val, "")
                        }
                    }
                });
                return true
            })
        },
        queue: function(type, fn) {
            if (jQuery.isFunction(type) || (type && type.constructor == Array)) {
                fn = type;
                type = "fx"
            }
            if (!type || (typeof type == "string" && !fn)) {
                return queue(this[0], type)
            }
            return this.each(function() {
                if (fn.constructor == Array) {
                    queue(this, type, fn)
                } else {
                    queue(this, type).push(fn);
                    if (queue(this, type).length == 1) {
                        fn.call(this)
                    }
                }
            })
        },
        stop: function(clearQueue, gotoEnd) {
            var timers = jQuery.timers;
            if (clearQueue) {
                this.queue([])
            }
            this.each(function() {
                for (var i = timers.length - 1; i >= 0; i--) {
                    if (timers[i].elem == this) {
                        if (gotoEnd) {
                            timers[i](true)
                        }
                        timers.splice(i, 1)
                    }
                }
            });
            if (!gotoEnd) {
                this.dequeue()
            }
            return this
        }
    });
    var queue = function(elem, type, array) {
        if (elem) {
            type = type || "fx";
            var q = jQuery.data(elem, type + "queue");
            if (!q || array) {
                q = jQuery.data(elem, type + "queue", jQuery.makeArray(array))
            }
        }
        return q
    };
    jQuery.fn.dequeue = function(type) {
        type = type || "fx";
        return this.each(function() {
            var q = queue(this, type);
            q.shift();
            if (q.length) {
                q[0].call(this)
            }
        })
    };
    jQuery.extend({
        speed: function(speed, easing, fn) {
            var opt = speed && speed.constructor == Object ? speed : {
                complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
                duration: speed,
                easing: fn && easing || easing && easing.constructor != Function && easing
            };
            opt.duration = (opt.duration && opt.duration.constructor == Number ? opt.duration : jQuery.fx.speeds[opt.duration]) || jQuery.fx.speeds.def;
            opt.old = opt.complete;
            opt.complete = function() {
                if (opt.queue !== false) {
                    jQuery(this).dequeue()
                }
                if (jQuery.isFunction(opt.old)) {
                    opt.old.call(this)
                }
            };
            return opt
        },
        easing: {
            linear: function(p, n, firstNum, diff) {
                return firstNum + diff * p
            },
            swing: function(p, n, firstNum, diff) {
                return ((-Math.cos(p * Math.PI) / 2) + 0.5) * diff + firstNum
            }
        },
        timers: [],
        timerId: null,
        fx: function(elem, options, prop) {
            this.options = options;
            this.elem = elem;
            this.prop = prop;
            if (!options.orig) {
                options.orig = {}
            }
        }
    });
    jQuery.fx.prototype = {
        update: function() {
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this)
            }(jQuery.fx.step[this.prop] || jQuery.fx.step._default)(this);
            if (this.prop == "height" || this.prop == "width") {
                this.elem.style.display = "block"
            }
        },
        cur: function(force) {
            if (this.elem[this.prop] != null && this.elem.style[this.prop] == null) {
                return this.elem[this.prop]
            }
            var r = parseFloat(jQuery.css(this.elem, this.prop, force));
            return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0
        },
        custom: function(from, to, unit) {
            this.startTime = now();
            this.start = from;
            this.end = to;
            this.unit = unit || this.unit || "px";
            this.now = this.start;
            this.pos = this.state = 0;
            this.update();
            var self = this;

            function t(gotoEnd) {
                return self.step(gotoEnd)
            }
            t.elem = this.elem;
            jQuery.timers.push(t);
            if (jQuery.timerId == null) {
                jQuery.timerId = setInterval(function() {
                    var timers = jQuery.timers;
                    for (var i = 0; i < timers.length; i++) {
                        if (!timers[i]()) {
                            timers.splice(i--, 1)
                        }
                    }
                    if (!timers.length) {
                        clearInterval(jQuery.timerId);
                        jQuery.timerId = null
                    }
                }, 13)
            }
        },
        show: function() {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.show = true;
            this.custom(0, this.cur());
            if (this.prop == "width" || this.prop == "height") {
                this.elem.style[this.prop] = "1px"
            }
            jQuery(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = jQuery.attr(this.elem.style, this.prop);
            this.options.hide = true;
            this.custom(this.cur(), 0)
        },
        step: function(gotoEnd) {
            var t = now();
            if (gotoEnd || t > this.options.duration + this.startTime) {
                this.now = this.end;
                this.pos = this.state = 1;
                this.update();
                this.options.curAnim[this.prop] = true;
                var done = true;
                for (var i in this.options.curAnim) {
                    if (this.options.curAnim[i] !== true) {
                        done = false
                    }
                }
                if (done) {
                    if (this.options.display != null) {
                        this.elem.style.overflow = this.options.overflow;
                        this.elem.style.display = this.options.display;
                        if (jQuery.css(this.elem, "display") == "none") {
                            this.elem.style.display = "block"
                        }
                    }
                    if (this.options.hide) {
                        this.elem.style.display = "none"
                    }
                    if (this.options.hide || this.options.show) {
                        for (var p in this.options.curAnim) {
                            jQuery.attr(this.elem.style, p, this.options.orig[p])
                        }
                    }
                }
                if (done) {
                    this.options.complete.call(this.elem)
                }
                return false
            } else {
                var n = t - this.startTime;
                this.state = n / this.options.duration;
                this.pos = jQuery.easing[this.options.easing || (jQuery.easing.swing ? "swing" : "linear")](this.state, n, 0, 1, this.options.duration);
                this.now = this.start + ((this.end - this.start) * this.pos);
                this.update()
            }
            return true
        }
    };
    jQuery.extend(jQuery.fx, {
        speeds: {
            slow: 600,
            fast: 200,
            def: 400
        },
        step: {
            scrollLeft: function(fx) {
                fx.elem.scrollLeft = fx.now
            },
            scrollTop: function(fx) {
                fx.elem.scrollTop = fx.now
            },
            opacity: function(fx) {
                jQuery.attr(fx.elem.style, "opacity", fx.now)
            },
            _default: function(fx) {
                fx.elem.style[fx.prop] = fx.now + fx.unit
            }
        }
    });
    jQuery.fn.offset = function() {
        var left = 0,
            top = 0,
            elem = this[0],
            results;
        if (elem) {
            with(jQuery.browser) {
                var parent = elem.parentNode,
                    offsetChild = elem,
                    offsetParent = elem.offsetParent,
                    doc = elem.ownerDocument,
                    safari2 = safari && parseInt(version) < 522 && !/adobeair/i.test(userAgent),
                    css = jQuery.curCSS,
                    fixed = css(elem, "position") == "fixed";
                if (elem.getBoundingClientRect) {
                    var box = elem.getBoundingClientRect();
                    add(box.left + Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft), box.top + Math.max(doc.documentElement.scrollTop, doc.body.scrollTop));
                    add(-doc.documentElement.clientLeft, -doc.documentElement.clientTop)
                } else {
                    add(elem.offsetLeft, elem.offsetTop);
                    while (offsetParent) {
                        add(offsetParent.offsetLeft, offsetParent.offsetTop);
                        if (mozilla && !/^t(able|d|h)$/i.test(offsetParent.tagName) || safari && !safari2) {
                            border(offsetParent)
                        }
                        if (!fixed && css(offsetParent, "position") == "fixed") {
                            fixed = true
                        }
                        offsetChild = /^body$/i.test(offsetParent.tagName) ? offsetChild : offsetParent;
                        offsetParent = offsetParent.offsetParent
                    }
                    while (parent && parent.tagName && !/^body|html$/i.test(parent.tagName)) {
                        if (!/^inline|table.*$/i.test(css(parent, "display"))) {
                            add(-parent.scrollLeft, -parent.scrollTop)
                        }
                        if (mozilla && css(parent, "overflow") != "visible") {
                            border(parent)
                        }
                        parent = parent.parentNode
                    }
                    if ((safari2 && (fixed || css(offsetChild, "position") == "absolute")) || (mozilla && css(offsetChild, "position") != "absolute")) {
                        add(-doc.body.offsetLeft, -doc.body.offsetTop)
                    }
                    if (fixed) {
                        add(Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft), Math.max(doc.documentElement.scrollTop, doc.body.scrollTop))
                    }
                }
                results = {
                    top: top,
                    left: left
                }
            }
        }

        function border(elem) {
            add(jQuery.curCSS(elem, "borderLeftWidth", true), jQuery.curCSS(elem, "borderTopWidth", true))
        }

        function add(l, t) {
            left += parseInt(l, 10) || 0;
            top += parseInt(t, 10) || 0
        }
        return results
    };
    jQuery.fn.extend({
        position: function() {
            var left = 0,
                top = 0,
                results;
            if (this[0]) {
                var offsetParent = this.offsetParent(),
                    offset = this.offset(),
                    parentOffset = /^body|html$/i.test(offsetParent[0].tagName) ? {
                        top: 0,
                        left: 0
                    } : offsetParent.offset();
                offset.top -= num(this, "marginTop");
                offset.left -= num(this, "marginLeft");
                parentOffset.top += num(offsetParent, "borderTopWidth");
                parentOffset.left += num(offsetParent, "borderLeftWidth");
                results = {
                    top: offset.top - parentOffset.top,
                    left: offset.left - parentOffset.left
                }
            }
            return results
        },
        offsetParent: function() {
            var offsetParent = this[0].offsetParent;
            while (offsetParent && (!/^body|html$/i.test(offsetParent.tagName) && jQuery.css(offsetParent, "position") == "static")) {
                offsetParent = offsetParent.offsetParent
            }
            return jQuery(offsetParent)
        }
    });
    jQuery.each(["Left", "Top"], function(i, name) {
        var method = "scroll" + name;
        jQuery.fn[method] = function(val) {
            if (!this[0]) {
                return
            }
            return val != undefined ? this.each(function() {
                this == window || this == document ? window.scrollTo(!i ? val : jQuery(window).scrollLeft(), i ? val : jQuery(window).scrollTop()) : this[method] = val
            }) : this[0] == window || this[0] == document ? self[i ? "pageYOffset" : "pageXOffset"] || jQuery.boxModel && document.documentElement[method] || document.body[method] : this[0][method]
        }
    });
    jQuery.each(["Height", "Width"], function(i, name) {
        var tl = i ? "Left" : "Top",
            br = i ? "Right" : "Bottom";
        jQuery.fn["inner" + name] = function() {
            return this[name.toLowerCase()]() + num(this, "padding" + tl) + num(this, "padding" + br)
        };
        jQuery.fn["outer" + name] = function(margin) {
            return this["inner" + name]() + num(this, "border" + tl + "Width") + num(this, "border" + br + "Width") + (margin ? num(this, "margin" + tl) + num(this, "margin" + br) : 0)
        }
    })
})();
jQuery.cachedScript = function(b, a) {
    a = jQuery.extend(a || {}, {
        dataType: "script",
        cache: true,
        url: b
    });
    return jQuery.ajax(a)
};
var $j = jQuery.noConflict();

function setSCookie(c, d, e) {
    if (e) {
        var b = new Date();
        b.setTime(b.getTime() + (e * 24 * 60 * 60 * 1000));
        var a = "; expires=" + b.toGMTString()
    } else {
        var a = ""
    }
    document.cookie = c + "=" + d + a + "; path=/; domain=.qantas.com.au"
}

function readSCookie(b) {
    var e = b + "=";
    var a = document.cookie.split(";");
    for (var d = 0; d < a.length; d++) {
        var f = a[d];
        while (f.charAt(0) == " ") {
            f = f.substring(1, f.length)
        }
        if (f.indexOf(e) == 0) {
            return f.substring(e.length, f.length)
        }
    }
    return null
}

function eraseSCookie(a) {
    setSCookie(a, "", -1)
}

function getCookieValue(a) {
    cks = document.cookie;
    i = cks.indexOf(a);
    if (i == -1) {
        return null
    }
    start = i + a.length + 1;
    end = cks.indexOf(";", start);
    if (end == -1) {
        end = cks.length
    }
    return unescape(cks.substring(start, end))
}

function readCookieValue(b) {
    var e = b + "=";
    var a = document.cookie.split(";");
    for (var d = 0; d < a.length; d++) {
        var f = a[d];
        while (f.charAt(0) == " ") {
            f = f.substring(1, f.length)
        }
        if (f.indexOf(e) == 0) {
            return f.substring(e.length, f.length)
        }
    }
    return ""
}

function setCookie(b, a) {
    setExpireCookieWithPath(b, a, "/")
}

function setExpireCookieWithPath(f, b, d, e) {
    if (d) {} else {
        d = "/"
    }
    var a = "";
    if (e) {
        var c = new Date();
        c.setTime(c.getTime() + (e * 24 * 60 * 60 * 1000));
        a = "; expires=" + c.toGMTString()
    } else {
        a = ""
    }
    briansUniqueStringName = f + "=" + escape(b) + a + "; path=" + d;
    document.cookie = briansUniqueStringName
}

function setUCCookieWithPathExpire(e, b, d) {
    if (d) {} else {
        d = "/"
    }
    var c = new Date();
    c.setTime(c.getTime() + (180 * (24 * 60 * 60)));
    var a = "; expires=" + c.toGMTString();
    briansUniqueStringName = e + "=" + b + a + "; path=" + d;
    document.cookie = briansUniqueStringName
}

function setExpireCookie(c, a, b) {
    setExpireCookieWithPath(c, a, "", b)
}

function eraseCookie(b) {
    var a = getCookieValue(b);
    setExpireCookie(b, a, -1)
}

function setContextCookie(e, r) {
    if (getCookieValue(e) == null) {
        setExpireCookieWithPath(e, r, "/", 180)
    } else {
        var o = getCookieValue(e).split("/"),
            q = r.split("/"),
            m = [],
            l = [],
            c = [],
            a = [],
            b = [];
        var d = o.length,
            s = "";
        for (var h = 0; h < q.length; h++) {
            m[h] = q[h].substring(q[h].indexOf("-") + 1, q[h].lastIndexOf("-"));
            l[h] = q[h].substring(q[h].lastIndexOf("-") + 1);
            for (var g = 0; g < d; g++) {
                c[g] = o[g].substring(o[g].indexOf("-") + 1, o[g].lastIndexOf("-"));
                a[g] = o[g].substring(o[g].lastIndexOf("-") + 1);
                if (c[g] == m[h]) {
                    o[g] = "qualifier-" + c[g] + "-" + l[h]
                } else {
                    for (var f = 0; f < d; f++) {
                        s += c[f]
                    }
                    if (!(s.indexOf(m[h]) > -1)) {
                        o[o.length] = "qualifier-" + m[h] + "-" + l[h]
                    }
                }
            }
        }
        var p = "";
        for (var h = 0; h < o.length; h++) {
            sep = (h == o.length - 1) ? "" : "/";
            p += o[h] + sep
        }
        setExpireCookieWithPath(e, p, "/", 180)
    }
}

function getContextCookieValue(g, c) {
    var a = "",
        f = getCookieValue(g);
    if (null != f) {
        var d = f.indexOf(c);
        if (d != -1) {
            var e = f.indexOf("-", d);
            var b = f.indexOf("/", e);
            if (b == -1) {
                a = f.substring(e + 1)
            } else {
                a = f.substring(e + 1, b)
            }
        }
    } else {
        if ("custtype" == c) {
            a = "qf2leisure"
        } else {
            if ("region" == c) {
                a = "au"
            }
        }
    }
    return a
}

function setContextCookieValue(h, c, b) {
    var g = getCookieValue(h),
        f = "",
        d = g.indexOf(c);
    if (d != -1) {
        var e = g.indexOf("-", d);
        var a = g.indexOf("/", e);
        f = g.substring(0, e + 1) + b;
        if (a != -1) {
            f = f + g.substring(a)
        }
        setContextCookie(h, f)
    }
}

function getCookieArray(b) {
    if ((document.cookie.indexOf(b)) != -1) {
        var a = getCookieValue(b);
        nameValueTupleArray = a.split("|");
        return nameValueTupleArray
    }
}

function addOrUpdateUCCookie(j, d) {
    if (d == "") {
        return
    }
    var b = "|";
    var e = "#";
    var a = getCookieValue("usercontext");
    var h = a.split(b);
    var k = "";
    var l = false;
    for (var g = 0; g < h.length; g++) {
        var c = h[g];
        var f = c.split(e);
        if (j != f[0]) {
            k = k + h[g] + b
        } else {
            k = k + j + e + d + b;
            l = true
        }
    }
    if (!l) {
        k = k + j + e + d + b
    }
    if (k.length > 1) {
        if (k.substring(k.length - 1) == b) {
            k = k.substring(0, (k.length - 1))
        }
        setUCCookieWithPathExpire("usercontext", k, "/")
    }
}

function set3PartyUCCookie() {
    var a = getCookieValue("usercontext");
    if (a != null) {
        var b = new Date();
        b.setTime(b.getTime() + (180 * 24 * 60 * 60 * 1000));
        var c = "3_uc=" + a + "; expires=" + b.toGMTString() + "; path=/; domain=.qantas.com.au";
        document.cookie = c
    }
}
$j(document).ready(set3PartyUCCookie);

function updateOptionList(d, c) {
    var b = false;
    for (var a = 0; a < d.options.length; ++a) {
        if (d.options[a].value == c) {
            d.selectedIndex = a;
            b = true;
            break
        }
    }
    if (b == false && c == "") {
        d.selectedIndex = 0
    }
}

function UserContextNameValue(a, b) {
    this.name = a;
    this.value = b
}

function UserContextInfo() {
    this.LAST_DEPARTURE_AIRPORT_CODE_PARAMETER_NAME = "dep";
    this.LAST_ARRIVAL_AIRPORT_CODE_PARAMETER_NAME = "arr";
    this.LAST_TRAVEL_DATE_PARAMETER_NAME = "tvldate";
    this.LAST_TRAVEL_DATE_PATTERN = "yyyyMMdd";
    this.LAST_TRAVEL_COUNTRY_NAME = "country";
    this.LAST_TRAVEL_REGION_NAME = "region";
    this.LAST_TRAVEL_LOCALE_NAME = "locale";
    this.LAST_QH_CITY_CODE_PARAMETER_NAME = "qhc";
    this.LAST_QH_REGION_CODE_PARAMETER_NAME = "qhr";
    this.LAST_CAR_PICKUP_AIRPORT_CODE_PARAMETER_NAME = "pickup";
    this.LAST_CAR_DROPOFF_AIRPORT_CODE_PARAMETER_NAME = "dropoff";
    this.NAME_VALUE_PAIR_TUPLE_SEPARATOR = "|";
    this.NAME_VALUE_PAIR_SEPARATOR = "#";
    this.nameValuePairsArray = new Array();
    var c = new Array();
    this.car_nameValuePairsArray = new Array();
    var f = new Array();
    var b;
    if ((document.cookie.indexOf("usercontext=")) != -1) {
        b = getCookieValue("usercontext")
    } else {
        b = "locale#en|country#au|region#AU|dep#SYD"
    }
    c = b.split(this.NAME_VALUE_PAIR_TUPLE_SEPARATOR);
    for (var d = 0; d < c.length; d++) {
        var e = new Array();
        var e = c[d].split(this.NAME_VALUE_PAIR_SEPARATOR);
        var a = new UserContextNameValue(e[0], e[1]);
        this.nameValuePairsArray[d] = (a)
    }
}
UserContextInfo.prototype.getLastDepartureAirport = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_DEPARTURE_AIRPORT_CODE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastArrivalAirport = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_ARRIVAL_AIRPORT_CODE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastTravelDate = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_TRAVEL_DATE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastQHCity = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_QH_CITY_CODE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastQHRegion = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_QH_REGION_CODE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getCarLastPickUpAirport = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_CAR_PICKUP_AIRPORT_CODE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getCarLastDropOffAirport = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_CAR_DROPOFF_AIRPORT_CODE_PARAMETER_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastCountry = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_TRAVEL_COUNTRY_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastRegion = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_TRAVEL_REGION_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getLastLocale = function() {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == this.LAST_TRAVEL_LOCALE_NAME) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getValue = function(c) {
    var b;
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        if (this.nameValuePairsArray[a].name == c) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
UserContextInfo.prototype.getABNStatus = function() {
    var b = "";
    var c = "";
    for (var a = 0; a < this.nameValuePairsArray.length; a++) {
        c = this.nameValuePairsArray[a].name;
        if (c.toLowerCase() == ("abn")) {
            b = this.nameValuePairsArray[a].value;
            break
        }
    }
    return b
};
var requiredVersion = 9;
var actualVersion = 0;
var hasRightVersion = false;
var jsVersion = 1.1;
var flashEnabled = false;
var isIE = (navigator.appVersion.indexOf("MSIE") != -1) ? true : false;
var isWin = (navigator.appVersion.toLowerCase().indexOf("win") != -1) ? true : false;
var isHTTPS = (document.URL.indexOf("https:") == 0);

function detectFlash() {
    if (navigator.mimeTypes && navigator.mimeTypes["application/x-shockwave-flash"] && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin && navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin.description) {
        flashEnabled = navigator.mimeTypes["application/x-shockwave-flash"].enabledPlugin;
        if (flashEnabled.description.charAt(17) != ".") {
            actualVersion = parseInt(flashEnabled.description.substring(16, 18))
        } else {
            actualVersion = parseInt(flashEnabled.description.charAt(16))
        }
    } else {
        if (isIE) {
            eval('try {var xObj = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");if (xObj)	flashEnabled = true; xObj = null; } catch (e)	{}');
            eval('for (var version = 10; version > 0; version--) { try { var flash = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + version); actualVersion = version; break; } catch (e) { } }')
        }
    }
    if (navigator.userAgent.indexOf("WebTV") != -1) {
        actualVersion = 4
    }
    if (actualVersion >= requiredVersion) {
        hasRightVersion = true
    } else {
        hasRightVersion = false
    }
}

function assembleFlash(g, f, h, k, e, a, l, c) {
    var b = "";
    if (g != "") {
        var j = "";
        if (e != "") {
            if (g.indexOf("?") == -1) {
                j = g + "?theLink=" + e
            } else {
                j = g + "&theLink=" + e
            }
            if (a != "") {
                j += "&theTarget=" + a
            }
        } else {
            j = g
        }
        if (l != "") {
            j += l
        }
        var m = isHTTPS ? "https" : "http";
        var d = "transparent";
        if (c != "" && c != undefined && c != null) {
            d = c
        }
        b = '<OBJECT class="nfw" id="myFlashObj" CLASSID="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" WIDTH="' + f + '" HEIGHT="' + h + '" ';
        if (k != "") {
            b += 'align="' + k + '" '
        }
        b += 'CODEBASE="' + m + '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab"><PARAM id="moomoo" NAME="MOVIE" VALUE="' + j + '"><PARAM NAME="PLAY" VALUE="true"><PARAM NAME="LOOP" VALUE="true"><PARAM NAME="QUALITY" VALUE="high"><PARAM NAME="MENU" VALUE="false"><PARAM NAME="scale" VALUE="exactfit"><param name="allowScriptAccess" value="always"><PARAM NAME="wmode" VALUE="' + d + '"><EMBED id="myFlashObj" SRC="' + j + '" WIDTH="' + f + '" HEIGHT="' + h + '" ';
        if (k != "") {
            b += 'align="' + k + '" '
        }
        b += 'PLAY="true" wmode="' + d + '" LOOP="true" QUALITY="high" scale="exactfit" MENU="false" TYPE="application/x-shockwave-flash" PLUGINSPAGE="' + m + '://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" allowScriptAccess="always"></EMBED></OBJECT>'
    }
    return b
}

function writeSimpleFlash(c, b, e, d, f, j, a, k, g) {
    detectFlash();
    if (hasRightVersion) {
        if (j) {
            var h = document.getElementById(j);
            h.innerHTML = assembleFlash(c, b, e, "", "", "", f, a)
        } else {
            document.write(assembleFlash(c, b, e, "", "", "", f, a))
        }
    } else {
        if (k) {
            window.location = g
        } else {
            if (j) {
                var h = document.getElementById(j);
                h.innerHTML = d
            } else {
                document.write(d)
            }
        }
    }
}

function writeFlash(g, f, h, l, c, j, q, m, b, o, r, e, a) {
    detectFlash();
    var p = "";
    if (b != "") {
        p += m;
        if (a.toString().toLowerCase().indexOf("popup") == -1) {
            p += ' <a href="' + c + '" target="' + a + '" class="nfw">'
        } else {
            p += ' <a class="nfw" href="javascript:void(null)" onClick="javascript:window.open(\'' + c + "','win0','width=" + r + ",height=" + e + ",location=1,status=1,menubar=1,toolbar=1,resizable=1, scrollbars=yes').focus()\">"
        }
        p += b;
        p += "</a> " + o
    }
    var k = assembleFlash(g, f, h, l, c, a, "");
    var n = "";
    if (j != "") {
        if (a.toString().toLowerCase().indexOf("popup") == -1) {
            n = ' <a class="nfw" href="' + c + '" target="' + a + '"><img class="nfw" src="' + j + '" '
        } else {
            n = '<a class="nfw" href="javascript:void(null)" onClick="javascript:window.open(\'' + c + "','win0','width=" + r + ",height=" + e + ',location=1,status=1,menubar=1,toolbar=1,resizable=1, scrollbars=yes\').focus()"><img class="nfw" src="' + j + '" '
        }
        if (l != "") {
            n += 'style="float:' + l + ';" '
        }
        n += 'alt="' + q + '" /></a>'
    }
    var d = "";
    if (hasRightVersion && g != "") {
        if (l == "") {
            d = k
        }
        if (l.toLowerCase() == "left" || l.toLowerCase() == "right" || l.toLowerCase() == "top") {
            d += k + "<br>" + p
        }
        if (l.toLowerCase() == "bottom") {
            d += p + "<br>" + k
        }
        if (l.toLowerCase() == "text only" || l.toLowerCase() == "image only") {
            d += k
        }
    } else {
        if (l == "") {
            d = n
        }
        if (l.toLowerCase() == "text only") {
            d += p
        }
        if (l.toLowerCase() == "image only") {
            d += n
        }
        if (l.toLowerCase() == "left" || l.toLowerCase() == "right" || l.toLowerCase() == "top") {
            d += n + "<br>" + p
        }
        if (l.toLowerCase() == "bottom") {
            d += p + "<br>" + n
        }
    }
    document.write(d)
}

function writeFlashSecure(c, v, h, s, y, a, m, t, l, o, w, b, n, q, f) {
    detectFlash();
    var j = "";
    if (y != "" && y.substring(0, 4) == "http") {
        j = y
    } else {
        if (y != "" && y.indexOf("/") == 0) {
            if (a == "true") {
                j = "https://" + m + y
            } else {
                if (a == "false") {
                    j = "http://" + m + y
                } else {
                    j = y
                }
            }
        } else {
            if (a == "true") {
                j = "https://" + y
            } else {
                j = "http://" + y
            }
        }
    }
    if (f != null && f.toString().toLowerCase() != "popup") {
        f = ""
    }
    var d = s;
    if (s.toLowerCase() == "l") {
        d = "left"
    } else {
        if (s.toLowerCase() == "r") {
            d = "right"
        } else {
            if (s.toLowerCase() == "t") {
                d = "top"
            } else {
                if (s.toLowerCase() == "b") {
                    d = "bottom"
                } else {
                    if (s.toLowerCase() == "to") {
                        d = "text only"
                    } else {
                        if (s.toLowerCase() == "io") {
                            d = "image only"
                        }
                    }
                }
            }
        }
    }
    var e = "";
    var k = "";
    if (f.toString().toLowerCase().indexOf("popup") == -1) {
        k += ' <a class="nfw" href="' + j + '" target="' + f + '">';
        e += ' <a class="nfw" style="position: static !important;" href="' + j + '" target="' + f + '">'
    } else {
        k += ' <a class="nfw" href="' + j + '" target="_blank">';
        e += ' <a class="nfw" style="position: static !important;" href="' + j + '" target="_blank">'
    }
    var x = false;
    if (w.toLowerCase().indexOf("*new*") > -1) {
        w = w.replace("*new*", "", "gi");
        w = jQuery.trim(w);
        x = true
    }
    if (x) {
        k += '<img class="promo_new" src="/img/_red08/common/new-corner-diagonal.gif" alt="NEW" />'
    }
    k += '<span class="promoContent">';
    k += '<span class="title">' + w + "</span>";
    k += '<span class="content">' + o + "</span>";
    k += "</span></a>";
    var p = assembleFlash(c, v, h, d, j, f, "");
    var g = "";
    if (t != "") {
        if (f.toString().toLowerCase().indexOf("popup") == -1) {
            g = ' <img class="nfw" src="' + t + '" '
        } else {
            g = '<img class="nfw" src="' + t + '" '
        }
        if (l != null && l != "") {
            g += 'alt="' + l + '"'
        }
        g += " />"
    }
    var r = "";
    if (hasRightVersion && c != "") {
        if (d.toLowerCase() == "left" || d.toLowerCase() == "right" || d.toLowerCase() == "top") {
            r += k + p
        } else {
            if (d.toLowerCase() == "bottom") {
                r += k + p
            } else {
                r = p
            }
        }
    } else {
        if (d == "") {
            r = g
        }
        if (d.toLowerCase() == "text only") {
            r += k
        }
        if (d.toLowerCase() == "image only") {
            r += e + g + "</a>"
        }
        if (d.toLowerCase() == "left" || d.toLowerCase() == "right" || d.toLowerCase() == "top") {
            r += k + g
        }
        if (d.toLowerCase() == "bottom") {
            r += k + g
        }
    }
    document.write(r)
}

function toggleFlashAltContent(e, d, h, g, c, f) {
    detectFlash();
    var a = document.getElementById(e);
    var b = document.getElementById(d);
    if (hasRightVersion) {
        a.className = "visible";
        b.className = "hidden";
        if (h) {
            a.innerHTML = assembleFlash(h, g, c, "", "", "", f)
        }
    } else {
        a.className = "hidden";
        b.className = "visible"
    }
}

function toggleContent(d, c) {
    detectFlash();
    var a = document.getElementById(d);
    var b = document.getElementById(c);
    if (hasRightVersion) {
        a.className = "visible";
        b.className = "hidden"
    } else {
        a.className = "hidden";
        b.className = "visible"
    }
}

function getParameters(a) {
    var e = (a.indexOf("?") > -1) ? a.split("?")[1].split("&") : a.split("&");
    var c = {};
    for (var b = 0; b < e.length; b++) {
        var d = e[b].split("=");
        c[unescape(d[0])] = unescape(d[1])
    }
    return c
}
var $Qantas_Promo_OLD = {
    setup: {
        customCities: null,
        urlParams: null,
        checkInDate: null,
        checkOutDate: null,
        arrivalPort: null,
        departurePort: null,
        products: {
            hotels: {
                ready: false,
                domain: "//hotel.qantas.com.au"
            },
            activities: {
                ready: false,
                domain: "//m.viator.com/IATA_API/iata_pricedfrom.php?PUID=11631&type=product"
            },
            transfers: {
                ready: false,
                domain: "//m.viator.com/IATA_API/iata_pricedfrom.php?PUID=11789&type=transfer"
            },
            events: {
                ready: false,
                domain: "//qantasboxoffice.com.au"
            }
        }
    },
    init: function(b) {
        var a = this.setup;
        validSegment = this.getSegment(a.urlParams.arrDate.split(","), a.urlParams.arr.split(","));
        a.checkOutDate = validSegment[0].substring(0, 4) + "-" + validSegment[0].substring(4, 6) + "-" + (parseFloat(validSegment[0].substring(6, 8)) + 1);
        a.checkInDate = validSegment[0].substring(0, 4) + "-" + validSegment[0].substring(4, 6) + "-" + validSegment[0].substring(6, 8);
        a.arrivalPort = (validSegment[1].toUpperCase().indexOf(",") > -1) ? validSegment[1].toUpperCase().split(",")[0] : validSegment[1].toUpperCase();
        switch (b) {
            case "hotels":
                this.getFeedHotel();
                break;
            default:
                this.getFeed(b);
                break
        }
    },
    getSegment: function(d, e) {
        var b = 0;
        var c;
        if (d.length > 1) {
            var a = 0;
            jQuery.each(d, function(f) {
                if (d.length - 1 != f) {
                    var g = parseFloat(d[f + 1]) - parseFloat(d[f]);
                    if (g > a) {
                        a = g;
                        c = [d[f], e[f]]
                    }
                }
            })
        } else {
            c = [d[0], e[0]]
        }
        return c
    },
    setDOM: function(a) {
        return '<span id="_qantas_' + a + '_promo"></span>'
    },
    getCustomCity: function(d) {
        var a = this.setup.customCities;
        var c = d;
        for (var b = 0; b < a.length; b++) {
            if (a[b][0].indexOf(c) != -1) {
                c = a[b][1]
            }
        }
        return c
    },
    getFeed: function(b) {
        var a = this.setup;
        var d = "";
        var c = this.getCustomCity(a.arrivalPort);
        if (b == "events") {
            a.products[b].ready = window.setInterval(function() {
                if (jQuery("#_qantas_" + b + "_promo").length) {
                    a.products[b].ready = clearInterval(a.products[b].ready);
                    url = "http://qantasboxoffice.com.au";
                    msg = 'Book shows and events before you go so you don&#39;t miss out.<strong style="font-size: 17px !important"> </strong>';
                    img = "http://www.qantas.com.au/img/icons/redesign/events-myb.gif";
                    $Qantas_Promo_OLD.generateHTML(b, url, msg, img)
                }
            }, 100);
            window.setTimeout(function() {
                window.clearInterval(a.products[b].ready)
            }, 7000)
        } else {
            if (b == "activities" || b == "transfers") {
                d = "&iatacode=" + c + "&jsonp=?"
            }
            jQuery.ajax({
                type: "GET",
                url: a.products[b].domain + d,
                dataType: "jsonp",
                crossDomain: true,
                timeout: 5000,
                success: function(e) {
                    a.products[b].ready = window.setInterval(function() {
                        if (jQuery("#_qantas_" + b + "_promo").length) {
                            var f, g;
                            a.products[b].ready = clearInterval(a.products[b].ready);
                            if (b == "activities") {
                                if (parseInt(e.success)) {
                                    f = e.product.ProductListURL.replace("www.partner.viator.com", "activities.qantas.com.au");
                                    g = "Don&#039;t miss out on activities and experiences in " + e.product.City + ' and book before you go from <strong style="font-size: 17px !important">$' + Math.ceil(e.product.PricedFrom) + "</strong> " + e.product.currency + " per person."
                                } else {
                                    f = "http://activities.qantas.com.au";
                                    g = 'Don&#039;t miss out on activities and experiences at your destination.<strong style="font-size: 17px !important"> </strong>'
                                }
                                img = "http://www.qantas.com.au/img/icons/redesign/activities-myb.gif"
                            } else {
                                if (b == "transfers") {
                                    if (e.errordesc == "") {
                                        f = e.product.ProductListURL.replace("www.partner.viator.com", "transfers.qantas.com.au");
                                        g = "Book your " + e.product.City + ' airport transfer before you go from <strong style="font-size: 17px !important">$' + Math.ceil(e.product.PricedFrom) + "</strong> " + e.product.currency + " per person."
                                    } else {
                                        f = "http://transfers.qantas.com.au";
                                        g = 'Book your airport transfer before you go.<strong style="font-size: 17px !important"> </strong>'
                                    }
                                    img = "http://www.qantas.com.au/img/icons/redesign/transfers-myb.gif"
                                }
                            }
                            $Qantas_Promo_OLD.generateHTML(b, f, g, img)
                        }
                    }, 100);
                    window.setTimeout(function() {
                        window.clearInterval(a.products[b].ready)
                    }, 7000)
                },
                error: function(e) {
                    if (b == "activities") {
                        url = "http://activities.qantas.com.au";
                        msg = 'Don&#039;t miss out on activities and experiences at your destination.<strong style="font-size: 17px !important"> </strong>';
                        img = "http://www.qantas.com.au/img/icons/redesign/activities-myb.gif"
                    } else {
                        if (b == "transfers") {
                            url = "http://transfers.qantas.com.au";
                            msg = 'Book your airport transfer before you go.<strong style="font-size: 17px !important"> </strong>';
                            img = "http://www.qantas.com.au/img/icons/redesign/transfers-myb.gif"
                        } else {
                            if (b == "events") {
                                url = "http://qantasboxoffice.com.au";
                                msg = 'Book shows and events before you go so you don&#39;t miss out.<strong style="font-size: 17px !important"> </strong>';
                                img = "http://www.qantas.com.au/img/icons/redesign/events-myb.gif"
                            }
                        }
                    }
                    $Qantas_Promo_OLD.generateHTML(b, url, msg, img)
                }
            })
        }
    },
    getFeedHotel: function() {
        var a = this.setup;
        jQuery.ajax({
            url: "//www.qantas.com.au/static/hotels/cities.js",
            cache: true,
            dataType: "script",
            success: function() {
                var c = [];
                jQuery.each(_qantas_hotels_cities.cities, function(f, g) {
                    c.push(this.code)
                });
                var e = (_qantas_hotels_cities.cities[jQuery.inArray(a.arrivalPort, c)]) ? _qantas_hotels_cities.cities[jQuery.inArray(a.arrivalPort, c)] : null;
                if (e) {
                    a.products.hotels.ready = window.setInterval(function() {
                        if (jQuery("#_qantas_hotels_promo").length) {
                            a.products.hotels.ready = clearInterval(a.products.hotels.ready);
                            jQuery("#_qantas_hotels_promo").parent().remove()
                        }
                    }, 200);
                    window.setTimeout(function() {
                        window.clearInterval(a.products.hotels.ready)
                    }, 6000);
                    var d = (jQuery('input[name="PREF_AIR_FREQ_LEVEL_1_1"]').length > 0) ? "&tierCode=" + jQuery('input[name="PREF_AIR_FREQ_LEVEL_1_1"]').val() : "";
                    var b = '<style type="text/css" media="print">#hotelPanel{ display: none; }</style><iframe frameborder="0" scrolling="no" src="https://hotel.qantas.com.au/embedded_search/list?adults=2&checkIn=' + a.checkInDate + "&checkOut=" + a.checkOutDate + "&location=" + e.string + "&sortBy=deals&sortDir=asc" + d + '" width="100%" height="425"><a href="//hotel.qantas.com.au/embedded_search/list?adults=2&checkIn=' + a.checkInDate + "&checkOut=" + a.checkOutDate + "&location=" + e.string + "&sortBy=deals&sortDir=asc" + d + '">Your exclusive hotel offers.</a></iframe>';
                    if (jQuery("#hotelPanel").length > 0) {
                        jQuery("#hotelPanel").css("border", "1px solid #dedede").html(b)
                    } else {
                        jQuery("#tripOffer").after('<div id="hotelPanel">' + b + "</div>")
                    }
                } else {
                    a.products.hotels.ready = window.setInterval(function() {
                        if (jQuery("#_qantas_hotels_promo").length) {
                            a.products.hotels.ready = clearInterval(a.products.hotels.ready);
                            var f = "//hotel.qantas.com.au";
                            var g = "Find trusted hotels at your destination.";
                            $Qantas_Promo_OLD.generateHTML("hotels", f, g, "http://www.qantas.com.au/img/icons/redesign/hotel-myb.gif")
                        }
                    }, 400)
                }
            }
        })
    },
    generateHTML: function(f, c, g, b) {
        var e = this.setup;
        var a = jQuery("#_qantas_" + f + "_promo");
        var d = "";
        if (jQuery("div").hasClass("tripOffer-container")) {
            d = '<img src="' + b + '" /><p><var>' + g + '</var></p><input type="button" class="btn btn-auto-width" value="View Options" onclick="window.location.href=\'' + c + "'\" />";
            a.html(d)
        } else {
            d = '<a style="zoom:1; position: relative !important; padding: 5px 0 11px 60px !important; display: block !important; background: transparent url(' + b + ') top left no-repeat !important; color: #000 !important; text-decoration: none !important;" href="' + c + '" target="_blank">' + g + '<span style="display: block !important; position: absolute !important; top: 0 !important; right: 3px !important; color: #990000 !important; border: 1px solid #cdcdcd !important; padding: 6px 8px !important; background-color: #fff !important; font-weight: bold !important; font-size: 11px !important;">View Options</span></a>';
            a.html(d).children("a").hover(function() {
                jQuery(this).children("span").css({
                    color: "#fff",
                    "background-color": "#990000",
                    border: "1px solid #660000"
                })
            }, function() {
                jQuery(this).children("span").css({
                    color: "#990000",
                    "background-color": "#fff",
                    border: "1px solid #cdcdcd"
                })
            })
        }
    }
};

function getFlashSecureHTMLThirdParties(c, t, g, r, w, a, l, s, k, n, v, b, m, p, e) {
    $Qantas_Promo_OLD.setup.urlParams = getParameters(c);
    _Qantas_Viator_Cities = [
        ["LHR", "LON"],
        ["LGW", "LON"],
        ["LGA", "NYC"],
        ["JFK", "NYC"],
        ["EWR", "NYC"]
    ];
    if (c.indexOf("/hotelPm/dom/") > -1 || c.indexOf("/hotelPm/int/") > -1) {
        $Qantas_Promo_OLD.init("hotels");
        return $Qantas_Promo_OLD.setDOM("hotels")
    } else {
        if (c.indexOf("etravel_pm_isango_954x35.swf") > -1) {
            $Qantas_Promo_OLD.setup.customCities = _Qantas_Viator_Cities;
            $Qantas_Promo_OLD.init("activities");
            return $Qantas_Promo_OLD.setDOM("activities")
        } else {
            if (c.indexOf("etravel_pm_isango_transfers_954x35.swf") > -1) {
                $Qantas_Promo_OLD.setup.customCities = _Qantas_Viator_Cities;
                $Qantas_Promo_OLD.init("transfers");
                return $Qantas_Promo_OLD.setDOM("transfers")
            } else {
                if (c.indexOf("etravel_pm_showbiz_954x35.swf") > -1) {
                    $Qantas_Promo_OLD.init("events");
                    return $Qantas_Promo_OLD.setDOM("events")
                } else {
                    detectFlash();
                    var h = "";
                    e = "blank";
                    if (w != "" && w.substring(0, 4) == "http") {
                        h = w
                    } else {
                        if (w != "" && w.indexOf("/") == 0) {
                            if (a == "true") {
                                h = "https://" + l + w
                            } else {
                                if (a == "false") {
                                    h = "http://" + l + w
                                } else {
                                    h = w
                                }
                            }
                        } else {
                            if (a == "true") {
                                h = "https://" + w
                            } else {
                                h = "http://" + w
                            }
                        }
                    }
                    var d = r;
                    if (r.toLowerCase() == "l") {
                        d = "left"
                    } else {
                        if (r.toLowerCase() == "r") {
                            d = "right"
                        } else {
                            if (r.toLowerCase() == "t") {
                                d = "top"
                            } else {
                                if (r.toLowerCase() == "b") {
                                    d = "bottom"
                                } else {
                                    if (r.toLowerCase() == "to") {
                                        d = "text only"
                                    } else {
                                        if (r.toLowerCase() == "io") {
                                            d = "image only"
                                        }
                                    }
                                }
                            }
                        }
                    }
                    var j = "";
                    if (v != "") {
                        j += n;
                        j += ' <a href="' + h + '" target="' + e + '" class="nfw">';
                        j += v;
                        j += "</a> " + b
                    }
                    if (c != "" && c.indexOf("/") == 0) {
                        if (isHTTPS) {
                            c = "https://" + l + c
                        } else {
                            c = "http://" + l + c
                        }
                    }
                    var o = assembleFlash(c, t, g, d, h, e, "");
                    var f = "";
                    if (s != "") {
                        if (s != "" && s.indexOf("/") == 0) {
                            if (isHTTPS) {
                                s = "https://" + l + s
                            } else {
                                s = "http://" + l + s
                            }
                        }
                        f = '<a href="' + h + '" target="' + e + '" class="nfw"><img class="nfw" src="' + s + '" ';
                        if (d.toLowerCase() == "left" || d.toLowerCase() == "right" || d.toLowerCase() == "top" || d.toLowerCase() == "bottom") {
                            f += 'style="float:' + d + ';" '
                        }
                        if (k != "" && k != "") {
                            f += 'alt="' + k + '"'
                        }
                        f += " /></a>"
                    }
                    var q = "";
                    if (hasRightVersion && c != "") {
                        if (d.toLowerCase() == "left" || d.toLowerCase() == "right" || d.toLowerCase() == "top") {
                            q += o + "<br>" + j
                        } else {
                            if (d.toLowerCase() == "bottom") {
                                q += j + "<br>" + o
                            } else {
                                q = o
                            }
                        }
                    } else {
                        if (d == "") {
                            q = f
                        }
                        if (d.toLowerCase() == "text only") {
                            q += j
                        }
                        if (d.toLowerCase() == "image only") {
                            q += f
                        }
                        if (d.toLowerCase() == "left" || d.toLowerCase() == "right" || d.toLowerCase() == "top") {
                            q += f + "<br>" + j
                        }
                        if (d.toLowerCase() == "bottom") {
                            q += j + "<br>" + f
                        }
                    }
                    return q
                }
            }
        }
    }
}

function assemblePortletFlash(g, f, h, l, e, a, m, c, k) {
    var b = "";
    if (g != "") {
        var j = "";
        var n = isHTTPS ? "https" : "http";
        var d = "opaque";
        if (e != "") {
            j = g + "?theLink=" + e;
            if (a != "") {
                j += "&theTarget=" + a
            }
        } else {
            j = g
        }
        if (m != "") {
            j += m
        }
        if (c != "" && c != undefined && c != null) {
            d = c
        }
        b = '<object class="nfw" id="myFlashObj" width="' + f + '" height="' + h + '" codebase="' + n + '://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab">';
        b += '<param name="quality" value="high" />';
        b += '<param name="movie" value="' + j + '" />';
        b += '<param name="menu" value="false" />';
        b += '<param name="allowScriptAccess" value="always" />';
        b += '<param name="scale" value="exactfit" />';
        b += '<param name="wmode" value="' + d + '" />';
        b += '<param name="flashvars" value="' + k + '" />';
        b += '<embed src="' + j + '" id="myFlashObj" width="' + f + '" height="' + h + '" wmode="' + d + '" flashvars="' + k + '" pluginspage="' + n + '://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" quality="high" scale="exactfit" menu="false" allowScriptAccess="always" type="application/x-shockwave-flash"></embed></object>'
    }
    return b
}

function writePortletFlash(h, g, b, c, f, a, d, e) {
    detectFlash();
    if (hasRightVersion) {
        if (a) {
            $j("#" + a).html(assemblePortletFlash(h, g, b, "", "", "", f, d, e))
        } else {
            document.write(assemblePortletFlash(h, g, b, "", "", "", f, d, e))
        }
    } else {
        if (a) {
            $j("#" + a).html(unescape(c))
        } else {
            document.write(unescape(c))
        }
    }
}
var standardAltContent = '<h3>Flash Player required</h3><p>To view and use this application you need <a href="http://get.adobe.com/flashplayer/" target="_blank"> Flash ' + requiredVersion.toString() + '.0</a> or higher.</p><p>You can download this software for free at <a href="http://get.adobe.com/flashplayer/" target="_blank">adobe.com</a></p>';
var ua = navigator.userAgent;
var isDevice = {
    mobile: ua.match(/(Mobile|mobile)/),
    iphone: ua.match(/(iPhone|iPod)/),
    ipad: ua.match(/iPad/),
    blackberry: ua.match(/BlackBerry/),
    android: ua.match(/Android/)
};
if (!("indexOf" in Array.prototype)) {
    Array.prototype.indexOf = function(b, a) {
        if (a === undefined) {
            a = 0
        }
        if (a < 0) {
            a += this.length
        }
        if (a < 0) {
            a = 0
        }
        for (var c = this.length; a < c; a++) {
            if (a in this && this[a] === b) {
                return a
            }
        }
        return -1
    }
}
Array.prototype.findItemIndexInArrays = function(a) {
    for (var b = 0; b < this.length; b++) {
        if (this[b].indexOf(a) > -1) {
            return b
        }
    }
    return -1
};
var u = {
    r: {
        l: window.location.href,
        pn: window.location.pathname,
        p: window.location.protocol,
        h: window.location.hash,
        hn: window.location.hostname
    },
    mobile: [
        ["Flight Status", "/travel/airlines/flight-status/global/en", "http://www.qantas.com.au/mobile-travel/airlines/flight-status/global/en"],
        ["Timetable", "/travel/airlines/timetable/global/en", "http://www.qantas.com.au/mobile-travel/airlines/timetable/global/en"],
        ["Domestic Check-in", "/travel/airlines/domestic-mobile-checkin/global/en", "http://www.qantas.com.au/mobile-travel/airlines/domestic-checkin/global/en"],
        ["Book Flight", "/travel/airlines/flight-search/global/en", "http://www.qantas.com.au/mobile-travel/airlines/book-flight/global/en"],
        ["Book Hotel", "/travel/airlines/hotels/global/en", "http://www.qantas.com.au/mobile-travel/airlines/hotels/global/en"]
    ]
};
var standardAltContent = '<h3>Flash Player required</h3><p>To view and use this application you need <a href="http://get.adobe.com/flashplayer/" target="_blank"> Flash ' + requiredVersion.toString() + '.0</a> or higher.</p><p>You can download this software for free at <a href="http://get.adobe.com/flashplayer/" target="_blank">adobe.com</a></p>';
var defaultHTTPPrefix = "http://" + u.r.hn;
var defaultHTTPSPrefix = "https://" + u.r.hn;
var ucG = new UserContextInfo();
var hasC = navigator.cookieEnabled;
var hasUC = (getCookieValue("usercontext") != null && getCookieValue("usercontext") != "undefined" && getCookieValue("usercontext") != "");
var eventCheck = (isDevice.iphone || isDevice.ipad) ? "touchstart" : "click";
var ffobj = false;
var isiPad = isDevice.ipad;
var mobileURL = u.mobile.findItemIndexInArrays(u.r.pn);
try {
    if (parent.location.href == location.href && isDevice.mobile && (isDevice.iphone || isDevice.blackberry || isDevice.android) && mobileURL != -1) {
        if (getCookieValue("visited")) {
            var cValue = getCookieValue("visited");
            if (cValue == "m0") {
                window.location.href = u.mobile[mobileURL][2]
            } else {
                if (cValue == "m1") {
                    window.location.href = encodeURI("/static/detect.html?title=" + u.mobile[mobileURL][0] + "&link=" + u.mobile[mobileURL][2])
                } else {
                    if (cValue == "s1") {
                        setExpireCookieWithPath("visited", "", u.r.pn, 0)
                    }
                }
            }
        } else {
            window.location.href = encodeURI("/static/detect.html?title=" + u.mobile[mobileURL][0] + "&link=" + u.mobile[mobileURL][2])
        }
    }
} catch (exception) {}

function commhttps(a) {
    window.location.href = "https://" + window.location.hostname + a
}

function submitHeaderClick(a) {
    window.location.href = "http://" + window.location.hostname + a
}

function initPromotions() {
    if (hasUC) {
        var a = ucG.getLastCountry().toLowerCase();
        var f = ucG.getLastRegion().toLowerCase();
        var j = ucG.getLastLocale().toLowerCase()
    } else {
        var a = "au";
        var f = "au";
        var j = "en"
    }
    if (!($j.trim($j("div.sidePanel").html()).length > 10) && !($j("div").hasClass("homepagePromotionsWrapper"))) {
        if (j != "ko") {
            promoFallback(a, f, j)
        }
    }
    try {
        var c = _p;
        var b = "";
        var l = "";
        try {
            var d = _viewAll;
            if (d != null || d != "") {
                if (d == "true") {
                    var h = _regionCodeViewAll;
                    var m = ucG.getLastRegion();
                    var k = ucG.getLastCountry();
                    try {
                        b = h.exclusions[m].contains(k);
                        if (b == true) {
                            b = ""
                        } else {
                            b = undefined
                        }
                    } catch (g) {
                        b = undefined
                    }
                    if (b == undefined) {
                        try {
                            b = h.viewAll[m][k].promoURL;
                            l = h.viewAll[m][k].label
                        } catch (g) {
                            b = undefined
                        }
                    }
                    if (b == undefined) {
                        b = h.viewAll[m].ALL.promoURL;
                        l = h.viewAll[m].ALL.label
                    }
                    if (b == undefined) {
                        b = ""
                    }
                }
            }
        } catch (g) {
            b = ""
        }
        var n = "";
        if (b != "") {
            n = '<a class="viewAllPromotions" href=' + b + ">> " + l + " </a>"
        } else {
            n = ""
        }
        $j.ajax({
            url: "/csp/do/" + ((window.location.protocol == "http:") ? "dyn" : "dyns") + "/displayPromotion?" + _p,
            timeout: 5000,
            dataType: "json",
            error: function() {
                promoFallback(a, f, j)
            },
            success: function(p) {
                var o = $j("div").hasClass("homepagePromotionsWrapper");
                var e = '<div id="promotions" class="promotions"><div class="promotionsBody"><div>';
                var q = null;
                detectFlash();
                $j.each(p.pj, function() {
                    var y = this;
                    var s = false;
                    var w = y.copy.t1;
                    if (w.toLowerCase().indexOf("*new*") > -1) {
                        w = w.replace("*new*", "", "gi");
                        w = jQuery.trim(w);
                        s = true
                    }
                    if (y.img.length > 2) {
                        var v = (y.link.indexOf("REGION_CODE") > -1) ? y.link.replace(/REGION_CODE/g, f) : y.link;
                        var t = (y.img.indexOf("REGION_CODE") > -1) ? y.img.replace(/REGION_CODE/g, f) : y.img;
                        var x = "";
                        if (v.indexOf("/hotels/global/en") > -1) {
                            e += '<div id="dyn-hotel-promo" class="promotion">'
                        } else {
                            e += '<div class="promotion">'
                        }
                        if (y.flash.length > 0 && hasRightVersion) {
                            e += '<object width="' + y.width + '" height="' + y.height + '" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" id="myFlashObj" class="nfw"><param value="' + y.flash + "?regionCode=" + y.user.region + "&amp;countryCode=" + y.user.country + "&amp;departureAirportCode=" + y.user.departure + "&amp;arrivalAirportCode=" + y.user.arrival + "&amp;departureDate=" + ucG.getLastTravelDate() + "&amp;locale=" + y.user.locale + "&amp;ffMember=false&amp;ffTierStatusCode=" + y.user.fftier + "&amp;serverName=" + y.server.name + "&amp;serverPort=" + y.server.port + "&amp;scheme=" + y.server.scheme + "&amp;theLink=" + v + '" name="movie" /><param value="true" name="play" /><param value="true" name="loop" /><param value="high" name="quality" /><param value="false" name="menu" /><param value="exactfit" name="scale" /><param value="always" name="allowScriptAccess" /><param value="transparent" name="wmode" /><embed width="' + y.width + '" height="' + y.height + '" allowscriptaccess="always" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" type="application/x-shockwave-flash" menu="false" scale="exactfit" quality="high" loop="true" wmode="transparent" play="true" src="' + y.flash + "?regionCode=" + y.user.region + "&amp;countryCode=" + y.user.country + "&amp;departureAirportCode=" + y.user.departure + "&amp;arrivalAirportCode=" + y.user.arrival + "&amp;departureDate=" + ucG.getLastTravelDate() + "&amp;locale=" + y.user.locale + "&amp;ffMember=false&amp;ffTierStatusCode=" + y.user.fftier + "&amp;serverName=" + y.server.name + "&amp;serverPort=" + y.server.port + "&amp;scheme=" + y.server.scheme + "&amp;theLink=" + v + '"></object></div>'
                        } else {
                            var r = "";
                            if (y.target == "popup") {
                                r = r + 'target="_blank"'
                            }
                            if (y.copy.t2 == "") {
                                e += "<a " + r + ' href="' + v + '" class="nfw"><span class="promoContent"><span class="hidden">' + w + '</span></span></a><img alt="' + w + '" src="' + t + '" class="nfw" />'
                            } else {
                                e += "<a " + r + ' href="' + v + '" class="nfw">' + ((s) ? '<img class="promo_new" src="/img/_red08/common/new-corner-diagonal.gif" alt="NEW" />' : "") + '<span class="promoContent"><span class="title">' + w + '</span><span class="content">' + y.copy.t2 + '</span></span></a><img alt="' + w + '" src="' + t + '" class="nfw" />'
                            }
                        }
                        e += "</div>"
                    }
                });
                e += "</div></div><div>" + n + "</div></div>";
                if (e.indexOf('class="promotion"') > -1) {
                    if (o) {
                        $j("div.homepagePromotionsWrapper").append(e)
                    } else {
                        $j("div.sidePanel").append(e);
                        $j("div.promotionsBody").css({
                            position: "static",
                            left: "auto"
                        })
                    }
                    setTimeout("loadPromotionEffects()", 350)
                } else {
                    promoFallback(a, f, j)
                }
            }
        })
    } catch (g) {
        promoFallback(a, f, j)
    }
}

function promoFallback(a, c, b) {
    if (!$j("dl").hasClass("menu-c")) {
        if ($j("div").hasClass("homepagePromotionsWrapper")) {
            $j.ajax({
                url: "/js/content/promo-fallback.js",
                timeout: 5000,
                dataType: "json",
                success: function(e) {
                    var d = '<div id="promotions" class="promotions"><div class="promotionsBody"><div class="clearit">';
                    var g = {};
                    var f = "en";
                    if (a == "au") {
                        g = e.en.au
                    } else {
                        if (a != "au" && b == "en") {
                            g = e.en["int"]
                        } else {
                            if (b == "zh") {
                                if (a == "cn") {
                                    g = e.zh_cn;
                                    f = "zh_CN"
                                } else {
                                    g = e.zh_tw;
                                    f = "zh_TW"
                                }
                            } else {
                                g = e[b];
                                f = b
                            }
                        }
                    }
                    $j.each(g, function(k) {
                        var l = this;
                        var j = "";
                        var h = "";
                        if (b == "en") {
                            j = l.url.replace(/REGION_CODE/g, c);
                            h = l.img.replace(/REGION_CODE/g, c)
                        } else {
                            j = e.dyn[k].url.replace(/LANGUAGE_CODE_EXT/g, b).replace(/REGION_CODE/g, c).replace(/COUNTRY_CODE/g, a).replace(/LANGUAGE_CODE/g, f);
                            h = e.dyn[k].img.replace(/LANGUAGE_CODE/g, b)
                        }
                        d += '<div class="promotion"><a href="' + j + '" class="nfw"><span class="promoContent"><span class="title">' + l.title + '</span><span class="content">' + l.text + '</span></span></a><img alt="' + l.title + '" src="' + h + '" class="nfw"></div>'
                    });
                    d += "</div></div></div>";
                    if ($j("div").hasClass("homepagePromotionsWrapper")) {
                        $j("div.homepagePromotionsWrapper").append(d)
                    } else {
                        $j("div.sidePanel").append(d);
                        $j("div.promotionsBody").css({
                            position: "relative",
                            left: "auto"
                        })
                    }
                    setTimeout("loadPromotionEffects()", 500)
                }
            })
        } else {
            if ($j("div.sidePanel").length > 0) {
                $j("div.main").addClass("roo")
            }
        }
    }
}

function loadPromotionEffects() {
    if ($j("div").hasClass("homepagePromotionsWrapper")) {
        loadHPScroller()
    }
    setTimeout("renderPromotions()", 500)
}

function renderPromotions() {
    var e = $j("div.promotion img.nfw"),
        d = e.length,
        b = 0;
    var f = $j("div.promotion object"),
        a = f.length,
        c = 0;
    f.each(function(g) {
        var h = $j(this);
        promoEffects(g, h.height(), h.width(), h)
    });
    e.each(function(g) {
        var h = $j(this);
        if (e[g].complete) {
            promoEffects(g, h.height(), h.width(), e);
            b++
        } else {
            e.load(function() {
                promoEffects(g, h.height(), h.width(), e);
                b++
            })
        }
    })
}

function promoEffects(d, f, c, e) {
    var a = $j(e[d]);
    var b = (a.height() - 10) - a.parent().find("span.title").height();
    a.prev("a").children("span").filter(".promoContent").css({
        top: b + "px",
        opacity: "0.9",
        width: c,
        height: f
    });
    a.prev("a").hover(function() {
        $j(this).children("span").filter(".promoContent").animate({
            top: b - ($j(this).children("span").filter(".promoContent").children(".content").height() + 10)
        })
    }, function() {
        $j(this).children("span").filter(".promoContent").animate({
            top: b
        })
    })
}

function loadDynamicPromos() {
    if ($j("#dyn-hotel-promo").length > 0) {
        var b = $j("#dyn-hotel-promo");
        var e = b.find("a").attr("href");
        var d = "au:bookings:promo:domestic-hotels:lang:en";
        if (e.indexOf("int_cam") > -1) {
            d = e.split("int_cam=")[1].split("&")[0]
        }
        var h = (ucG.getLastArrivalAirport()) ? ucG.getLastArrivalAirport() : "";
        if (h.length == 3) {
            var j = ucG.getLastArrivalAirport();
            var f = [
                ["AYQ", "uluru", "Ayers Rock (Uluru)"],
                ["SYD", "sydney", "Sydney"],
                ["MCY", "sunshinecoast", "Sunshine Coast"],
                ["MEL", "melbourne", "Melbourne"],
                ["TSV", "townsville", "Townsville"],
                ["ROK", "rockhampton", "Rockhampton"],
                ["PER", "perth", "Perth"],
                ["MKY", "mackay", "Mackay"],
                ["LST", "launceston", "Launceston"],
                ["KGI", "kalgoorlie", "Kalgoorlie"],
                ["OOL", "goldcoast", "Gold Coast"],
                ["DRW", "darwin", "Darwin"],
                ["CFS", "coffsharbour", "Coffs Harbour"],
                ["HBA", "hobart", "Hobart"],
                ["HTI", "hamiltonisland", "Hamilton Island"],
                ["CNS", "cairns", "Cairns"],
                ["ASP", "alicesprings", "Alice Springs"],
                ["ADL", "adelaide", "Adelaide"],
                ["CBR", "canberra", "Canberra"],
                ["BME", "broome", "Broome"],
                ["BNE", "brisbane", "Brisbane"]
            ];
            var a = false;
            for (i = 0; i < f.length; i++) {
                if ($j.inArray(j, f[i]) > -1) {
                    a = f[i]
                }
            }
            if (a) {
                var c = new Date();
                c.setDate(c.getDate());
                var k = new Date();
                k.setDate(k.getDate() + 1);
                c = c.getFullYear() + "-" + (c.getMonth() + 1) + "-" + c.getDate();
                k = k.getFullYear() + "-" + (k.getMonth() + 1) + "-" + k.getDate();
                b.prepend('<div class="pleasewait"></div>');
                var g = "//hotel.qantas.com.au/api/v1/search.json?destination=" + j + "&checkIn=" + c + "&checkOut=" + k + "&callback=?";
                $j.ajax({
                    type: "GET",
                    dataType: "jsonp",
                    crossDomain: true,
                    timeout: 5000,
                    url: g,
                    success: function(p) {
                        b.children(".pleasewait").fadeOut(500);
                        var m = (p.results.length > 0);
                        if (m) {
                            b.addClass("dyn");
                            var l = false;
                            var r = 999999;
                            $j.each(p.results, function() {
                                if (this.lowest_average_nightly_cost < r && this.lowest_average_nightly_cost > 80) {
                                    l = this;
                                    r = l.lowest_average_nightly_cost
                                }
                            });
                            var o = l.suburb;
                            var n = r;
                            var q = "/img/160x70/generic.jpg";
                            if (a) {
                                o = a[2];
                                q = "/img/160x70/" + a[1] + ".jpg"
                            }
                            b.html('<a href="//hotel.qantas.com.au/search/list?location=' + j + "&int_cam=" + d + '"><span class="dyn-hotel-title">' + o + ' hotels</span><img src="' + q + '" alt="" /><span class="dyn-hotel-price">From <strong>$' + n + "</strong><small>per room per night</small></span></a>").height(140)
                        } else {
                            b.children(".pleasewait").fadeOut()
                        }
                    },
                    error: function() {
                        b.children(".pleasewait").fadeOut(500)
                    }
                })
            } else {
                b.children(".pleasewait").fadeOut()
            }
        }
    }
}

function gotoDes() {
    var a = $j(this).prev().children("option:selected").val();
    if (a != "" && a != "undefined" && ((a.indexOf("--") == -1) || (a.indexOf("-") == -1 && a.indexOf("select") == -1))) {
        window.location.href = $j(this).prev().children("option:selected").val()
    }
}

function mandatoryCheck() {
    if ($j(this).attr("checked")) {
        $j(this).prev().filter(".mandatoryNote").fadeOut()
    } else {
        $j(this).prev().filter(".mandatoryNote").fadeIn()
    }
}

function loadMandatoryCheck() {
    $j(this).attr("checked", false);
    $j(this).before('<div class="mandatoryNote"><span class="arr_notice"></span><div class="mandatoryNoteTxt">' + $j(this).attr("title") + "</div></div>")
}

function resetMargin() {
    var a = $j(this).children()[0];
    $j(a).css("margin-top", "0");
    if (($j(a).hasClass("left")) || ($j(a).hasClass("right"))) {
        $j($j(this).children()[1]).css("margin-top", "0")
    }
}

function setItemWidth() {
    if ($j(this).siblings().length > 0) {
        var a = Math.floor(100 / ($j(this).siblings().length + 1));
        $j(this).width(a + "%")
    }
}

function layoutTweaks() {
    if ($j("div").hasClass("index")) {
        var c = $j("div.index");
        $j("div:nth-child(3n)", c).addClass("three");
        c.each(function(f) {
            var e = 0;
            var d = $j("div.panelContent", $j(this));
            d.each(function() {
                var h = $j(this);
                var g = h.height() + h.children("form").height() + h.children("ul").height() + h.children("a.btn").height();
                if (g > e) {
                    e = g
                }
            });
            d.height(e + 30)
        })
    }
    if ($j("table.basic tbody").length > 0) {
        $j("table.basic tbody").each(function() {
            var g = $j(this);
            var d = g.children("tr");
            d.removeClass("alt");
            if (g.parent().find("thead").length > 0) {
                if (d.length > 2) {
                    if (g.find("td").filter("[rowspan]").length > 0) {
                        var j = false;
                        var h = 0;
                        var f = 1;
                        var e = 0;
                        $j.each(d, function() {
                            var k = $j(this);
                            e = k.children().filter("[rowspan]");
                            if (parseInt(e.attr("rowspan")) > 1) {
                                h = parseInt(e.attr("rowspan"))
                            }
                            if (j) {
                                k.addClass("alt")
                            }
                            if (f < h) {
                                f++
                            } else {
                                h = 0;
                                f = 1;
                                e = 0;
                                j = (j) ? false : true
                            }
                        })
                    } else {
                        d.filter(":odd").addClass("alt")
                    }
                }
            } else {
                g.parent().removeClass("basic").addClass("layout")
            }
            d.filter(":last-child").addClass("last")
        })
    }
    if ($j("span", "#main").hasClass("dropdown") || $j("div", "#main").hasClass("dropdown")) {
        var a = $j(".dropdown");
        a.click(function() {
            var d = $j(this);
            if (d.hasClass("active")) {
                d.removeClass("active")
            } else {
                a.removeClass("active");
                d.addClass("active");
                setTimeout(function() {
                    $j("body").bind("click", function(f) {
                        if (f.target.className !== "dropdown") {
                            d.removeClass("active");
                            setTimeout(function() {
                                $j("body").unbind("click")
                            }, 200)
                        }
                    })
                }, 300)
            }
        })
    }
    if ($j("a", "#main").hasClass("cta")) {
        $j("a.cta", "#main").wrapInner("<span></span>")
    }
    $j(".linkCollection").children().each(setItemWidth);
    if ($j.browser.version.substr(0, 3) <= "7.0" && $j.browser.msie) {
        $j("span").each(function(d) {
            if (($j(this).html().indexOf("*") > -1) && ($j(this).html().length < 2)) {
                $j(this).css({
                    "font-weight": "normal",
                    color: "#c10000",
                    "font-size": "11px"
                })
            }
        })
    }
    $j(".inputError").wrapInner("<span></span>");
    if ($j("div").hasClass("hasToggleTabs")) {
        initToggleTabs()
    }
    if ($j("a").hasClass("QAPP")) {
        $j("a.QAPP").each(function() {
            var k = $j(this);
            if (k.attr("id") == "book-hotel") {
                $j.ajax({
                    url: "/js/app/hotel/init.js",
                    cache: true,
                    dataType: "script",
                    success: function() {
                        var m = getParameters(k.attr("href"));
                        if (m.daysTillCheckIn) {
                            $hotel.form.setup.daysTillCheckIn = parseFloat(m.daysTillCheckIn)
                        }
                        if (m.daysTillCheckOut) {
                            $hotel.form.setup.daysTillCheckOut = parseFloat(m.daysTillCheckOut)
                        }
                        if (m.location) {
                            $hotel.form.setup.location = m.location
                        }
                        $hotel.form.setup.title = k.text();
                        $hotel.form.setup.dom = "#book-hotel";
                        $hotel.form.init()
                    }
                })
            } else {
                var f = k.parent(),
                    l = k.text(),
                    j = "",
                    d = "static",
                    h = k.attr("href"),
                    g = k.attr("id");
                if (k.hasClass("right")) {
                    d = "right"
                }
                if (k.hasClass("left")) {
                    d = "left"
                }
                if (h.indexOf("/flight-search/") > -1) {
                    h = h.replace("/flight-search/", "/flight-search-v1/")
                }
                h += ((h.indexOf("?") == -1) ? "?" : "&") + "showHeader=0&showMenu=0&showFooter=0&showSidePanel=0&showPageConfigCss=0&useSkin=qapps/" + g + "/" + ((d == "static") ? d : "float") + "&showPromotions=0";
                var e = "#" + g + "-" + d;
                j += '<div id="' + g + "-" + d + '" class="QAPP"><iframe src="' + h + '" frameborder="0" scrolling="no">' + f.html() + "</iframe></div>";
                f.html(j);
                $j(e).children("iframe").load(function() {
                    $j(this).contents().find("form h2").html(l)
                })
            }
        })
    }
    if ($j("#upgrade-points-qapp").length) {
        $j.ajax({
            url: "/js/fflyer/upgradecalculator/init.js",
            cache: true,
            dataType: "script"
        })
    }
    if ($j("a.travelinsider-qapp").length) {
        $j.ajax({
            url: "/js/content/ti.js",
            cache: true,
            dataType: "script"
        })
    }
    if ($j("a.deals-qapp").length) {
        $j.ajax({
            url: "/js/content/flight-deals.js",
            cache: true,
            dataType: "script"
        })
    }
    if ($j("a.hotel-deals-qapp").length) {
        $j.ajax({
            url: "/js/content/hotel-deals.js",
            cache: true,
            dataType: "script"
        })
    }
    if ($j("div.promoslot").length) {
        $j.ajax({
            url: "/js/utils/jquery.promoslot.js",
            cache: true,
            dataType: "script",
            success: function() {
                jQuery("div.promoslot").promoslot({
                    data: {
                        css: "/styles/app/promo/common.css"
                    }
                })
            }
        })
    }
    if (window.location.href.indexOf("/travel/airlines/home/") > 0 || $j("div.menu-a td").hasClass("active")) {
        if (!($j("div.menu-a td.active ul").length > 0) && location.href.indexOf("/fflyer/") == -1) {
            $j("div.header_nav").height("auto")
        }
    } else {
        if ($j("body").hasClass("popup") || $j("#noMenuPage").length > 0) {
            $j("div.header_nav").height("auto")
        } else {
            $j("div.header_nav").height(115)
        }
    }
    var b = $j("dl").filter(".menu-c").children("dd");
    $j.each(b, function() {
        var g = $j(this),
            f = g.children("a"),
            e = null,
            d = g.next().children("a");
        if (g.hasClass("haschild")) {
            e = g.children("ul");
            e.addClass("hidden");
            f.find("i").addClass("fa-angle-down");
            f.attr("href", "javascript:void(0)").click(function() {
                if (f.hasClass("active")) {
                    f.removeClass("active");
                    e.addClass("hidden");
                    d.addClass("next");
                    f.find("i").removeClass("fa-angle-up");
                    f.find("i").addClass("fa-angle-down")
                } else {
                    f.addClass("active");
                    e.removeClass("hidden");
                    d.removeClass("next");
                    f.find("i").removeClass("fa-angle-down");
                    f.find("i").addClass("fa-angle-up")
                }
            });
            if (f.hasClass("active")) {
                e.removeClass("hidden");
                f.find("i").removeClass("fa-angle-down");
                f.find("i").addClass("fa-angle-up")
            }
        }
        if (f.hasClass("active") && !g.hasClass("haschild")) {
            d.addClass("next")
        } else {
            f.hover(function() {
                if (!(g.hasClass("haschild") && f.hasClass("active"))) {
                    d.addClass("next")
                }
            }, function() {
                d.removeClass("next")
            })
        }
    });
    $j("#queryForm").submit(function() {
        if (document.queryForm.w.value != "Search" && document.queryForm.w.value != "") {
            window.parent.location.href = "http://qantas.resultspage.com.au/search?p=" + document.forms.queryForm.p.value + "&ts=" + document.forms.queryForm.ts.value + "&w=" + document.forms.queryForm.w.value
        }
        return false
    }).find('input[type="text"]').bind("focus", function() {
        $j(this).siblings("label").addClass("hidden")
    }).bind("blur", function() {
        var d = $j(this);
        if (d.val() == "") {
            d.siblings("label").removeClass("hidden")
        }
    });
    $j("a.backtotop").parent().addClass("btt").removeClass("right")
}

function initToggleTabs() {
    var b = document.location.href;
    var a = "";
    $j("div.hasToggleTabs").each(function() {
        var c = $j(this);
        var e = c.children("ul").children("li");
        c.children("div").each(function() {
            var f = $j(this);
            f.attr("id", "tab-" + f.attr("id")).hide()
        });
        var d = c.children("div");
        a = c.children("div:eq(0)").attr("id");
        e.click(function() {
            var g = $j(this);
            var f = g.children("span").children("a");
            if (!(g.hasClass("active")) && f.attr("href").charAt(0) == "#") {
                loadToggleTab(d, e, f.attr("class"))
            }
        });
        if (b.indexOf("#") > -1) {
            if ($j("#tab-" + b.split("#")[1], c).length > 0) {
                a = "tab-" + document.location.href.split("#")[1]
            }
        }
        loadToggleTab(d, e, a);
        if (b.indexOf("#") > -1) {
            if ("tab-" + b.split("#")[1] == a) {
                window.scrollTo(0, $j("#" + a).offset().top - 50)
            }
        }
    })
}

function loadToggleTab(a, e, d) {
    var b = $j("#" + d);
    var c = document.location.href;
    a.hide();
    e.removeClass("active");
    b.show();
    $j("a." + d, e).parent().parent().addClass("active");
    return false
}

function resizeIframe(b, a) {
    $j("#" + b).height(a)
}

function qInit() {
    if (!hasC) {
        $j("div.wrapper").prepend('<div id="noCookiesAlert">No cookie in browser.</div>')
    }
    layoutTweaks();
    skipLinks();
    initPromotions();
    $j(".gotoDes").click(gotoDes);
    $j("input[type=checkbox]").filter(".mandatoryCheck").each(loadMandatoryCheck);
    $j("input[type=checkbox]").filter(".mandatoryCheck").click(mandatoryCheck);
    try {
        if (getCookieValue("fflogin") != null && getCookieValue("fflogin") != "" && getCookieValue("fflogin") != "undefined" && ($j("#hpDyn").length == 0 && !(location.href.indexOf("showHeader=0") > -1) && !$j("body").hasClass("popup"))) {
            $j.ajax({
                type: "POST",
                url: "/travel/resources/jsp/ffl_header.jsp",
                data: {
                    ffKey: getCookieValue("fflogin").split("#")[1]
                },
                success: function(b) {
                    if (b.success == "true") {
                        if (typeof hideLinks == "undefined") {
                            hideLinks = ""
                        }
                        if ((location.href.indexOf("hideLinks=1") > -1) || (hideLinks != null && hideLinks == "1")) {
                            $j("div.header").append('<div id="ff-details" class="clearit"><a id="details-name" target="_top" href="' + b.yalink + '">' + b.title.charAt(0).toUpperCase() + b.title.slice(1, b.title.length).toLowerCase() + " " + b.initial + " " + b.surname + " (" + b.no + ')</a><span id="details-tier">' + b.status + '</span><div  class="dotBox"></div><span id="details-points">' + b.points + " points</span></div>")
                        } else {
                            $j("div.header").append('<div id="ff-details" class="clearit"><a id="details-name" target="_top" href="' + b.yalink + '">' + b.title.charAt(0).toUpperCase() + b.title.slice(1, b.title.length).toLowerCase() + " " + b.initial + " " + b.surname + " (" + b.no + ')</a><span id="details-tier">' + b.status + '</span><div  class="dotBox"></div><span id="details-points">' + b.points + ' points</span><div  class="dotBox"></div><a id="details-logout" href="' + b.logout + '" target="_top">Logout</a></div>')
                        }
                        if (location.href.indexOf("fflyer") >= 0) {
                            setTimeout("fflyerRedirect()", 25.1 * 60 * 1000)
                        }
                        ffobj = {
                            param: b.param,
                            nolink: b.nolink,
                            yalink: b.yalink,
                            logout: b.logout,
                            no: b.no,
                            title: b.title,
                            initial: b.initial,
                            surname: b.surname,
                            tier: b.tier,
                            isPOne: b.isPOne,
                            status: b.status,
                            points: b.points
                        }
                    }
                },
                dataType: "json"
            })
        }
    } catch (a) {}
    teamSiteContentRemover()
}
$j(document).ready(qInit);

function fflyerRedirect() {
    location.href = defaultHTTPPrefix + "/fflyer/dyn/program/welcome"
}

function replaceAll(d, b, c) {
    var a = d.indexOf(b);
    while (a != -1) {
        d = d.replace(b, c);
        a = d.indexOf(b)
    }
    return d
}

function teamSiteContentRemover() {
    try {
        var a = $j("div.flightSpecialsAbove").html();
        a = replaceAll(a, "&lt;", "<");
        a = replaceAll(a, "&gt;", ">");
        $j("div.flightSpecialsAbove").html(a)
    } catch (b) {}
}
$j(document).ready(function() {
    var a = $j("#nl_email");
    if ((a.val() == null) || (a.val() == "")) {
        $j("#subscribe label").show()
    }
    a.bind("click focus", function() {
        $j(this).prev().hide();
        $j(this).addClass("focusEMail")
    });
    a.bind("blur", function() {
        $j(this).removeClass("focusEMail");
        if (($j(this).val() == null) || ($j(this).val() == "")) {
            $j(this).prev().show()
        } else {
            $j(this).prev().hide()
        }
    });
    $j("#subscribe label").bind("click", function() {
        $j(this).blur();
        $j(this).next().focus()
    });
    $j("#subscribe label").bind("mouseenter", function() {
        $j(this).next().addClass("hoverEmail")
    }).bind("mouseleave", function() {
        $j(this).next().removeClass("hoverEmail")
    })
});
$j(document).ready(function() {
    $j("div.menu-b").find("span.description").each(function() {
        if ($j(this).find("._qantas_menu_loggedin").length) {
            $j(this).find("div._qantas_menu_loggedout").show();
            $j(this).find("div._qantas_menu_loggedin").hide()
        }
    });
    $j(".menu-b").each(function(k, j) {
        var m = $j(j).find(".menu-ULb > div").length;
        var d = [];
        var o = 4;
        $j(j).find(".menu-ULb > div").each(function() {
            d.push($j(this))
        });
        $j(j).find(".functional").each(function() {
            o = 3
        });
        var g = "";
        var l = Math.floor((d.length) / o);
        var e = (d.length) % o;
        var f = [];
        var c = 0;
        for (h = 1; h <= o; h++) {
            c += l;
            if (e >= h) {
                c += 1
            }
            f.push(c - 1)
        }
        var n = 0;
        g += '<div class="menuCol">';
        for (var h = 0; h < d.length; h++) {
            $j(d[h]).addClass("_qantas_menu_b_item");
            g += $j("<div />").append($j(d[h]).clone()).html();
            if ((f[n] == h)) {
                g += "</div>" + ((h == d.length - 1) ? "" : '<div class="menuCol">');
                n++
            }
        }
        $j(this).find(".menu-ULb").html(g)
    });
    $j(".menu-ULb").each(function() {
        var e = $j(this).find(".menuCol").eq(0).find("div._qantas_menu_b_item").length;
        for (var d = 0; d < e; d++) {
            var c = 0;
            $j(this).find(".menuCol").each(function() {
                var f = $j(this).find("div._qantas_menu_b_item").eq(d);
                if (c < $j(f).height()) {
                    c = $j(f).height()
                }
            });
            $j(this).find(".menuCol").each(function() {
                $j(this).find("div._qantas_menu_b_item").eq(d).height(c)
            })
        }
    });
    $j("#footer").find('img[name="s_i_qantascom"]').remove();
    var a = (window.location != window.parent.location) ? true : false;
    if ($j(".header_nav").find("table td").length > 0) {
        if ((a == false) && (!($j("div.header_nav").attr("id") == "noMenuPage")) && ((aMenuText != "") || (aMenuText != null))) {
            if (getParameterByName("loungeCategory") != "qcLounge") {
                loadBreadCrumb(aMenuText, bMenuText, cMenuText, dMenuText)
            } else {
                breadCrumbExceptions()
            }
        }
    }
    var b = $j("div.footer-block").find("div#tweet").html();
    if ((b != null) && (b != "")) {
        tweetFeed()
    }
});

function breadCrumbExceptions() {
    var a = '<div id="breadCrumb"><ul class="crumb-list clearit"><li><a href="/travel/airlines/home/detect-context"><span>Home</span></a></li><li><i class="fa fa-angle-right"></i><a href="/fflyer/dyn/program/welcome"><span>Frequent Flyer<i></i></span></a></li><li> <i class="fa fa-angle-right"></i>  <a href="/travel/airlines/qantas-club/global/en">The Qantas Club</a></li><li><i class="fa fa-angle-right"></i> <a href="javascript:void(0)" class="c-Menu  last-crumb">Qantas Club Lounges</a></li></ul></div>';
    $j("#breadCrumb").remove();
    $j(".header_nav").after(a)
}

function getParameterByName(a) {
    a = a.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var c = new RegExp("[\\?&]" + a + "=([^&#]*)"),
        b = c.exec(location.search);
    return b == null ? "" : decodeURIComponent(b[1].replace(/\+/g, " "))
}

function loadBreadCrumb(f, e, d, c) {
    var a = "";
    var b = '<a href="/travel/airlines/home/detect-context"><span>' + home_title + "</span></a>";
    $j("div.menu-a table td").each(function(g) {
        if ($j(this).find("a:first").text() != null) {
            if ($j(this).find("a:first").text() == f) {
                a = a + '<li><i class="fa fa-angle-right"></i><a href="' + $j(this).find("a:first").attr("href") + '">' + $j(this).find("a:first").text() + "</a></li>";
                if (e != null && e != "") {
                    $j(this).find("._qantas_menu_b_item").each(function(h) {
                        if ($j("> a", this).text() == e) {
                            a = a + '<li> <i class="fa fa-angle-right"></i>  <a href="' + $j(this).find("a:first").attr("href") + '">' + $j(this).find("a:first").text() + "</a></li>"
                        }
                    })
                }
            }
        }
    });
    if (d != null && d != "") {
        $j("div.sidePanel dl.menu-c dd").each(function(g) {
            d = d.replace(/&#(\d+);/g, function(h, j) {
                return String.fromCharCode(j)
            });
            if ($j(this).find("a:first").text() == d) {
                if ($j(this).find("a:first").attr("href") == "javascript:void(0)") {
                    a = a + '<li><i class="fa fa-angle-right"></i> <a class="c-Menu disabled-link" href="' + $j(this).find("a:first").attr("href") + '">' + $j(this).find("a:first").text() + "</a></li>"
                } else {
                    a = a + '<li><i class="fa fa-angle-right"></i> <a class="c-Menu " href="' + $j(this).find("a:first").attr("href") + '">' + $j(this).find("a:first").text() + "</a></li>"
                }
            }
        })
    }
    if (c != null && c != "") {
        $j("ul.menu-d li").each(function(g) {
            c = c.replace(/&#(\d+);/g, function(h, j) {
                return String.fromCharCode(j)
            }).replace(/&amp;/g, function(l, k) {
                return "&"
            });
            if ($j(this).find("a:first").text() == c) {
                a = a + '<li> <i class="fa fa-angle-right"></i> <a class="d-Menu" href="' + $j(this).find("a:first").attr("href") + '">' + $j(this).find("a:first").text() + "</a></li>";
                return false
            }
        })
    }
    if ((a == "") || (a == null)) {
        $j("#breadCrumb").remove()
    } else {
        $j(".header_nav").after('<div id="breadCrumb"><ul class="crumb-list clearit"><li>' + b + a + "</ul></div>");
        $j("#breadCrumb").find("ul.crumb-list").find("a:last").addClass("last-crumb").attr("href", "javascript:void(0)")
    }
}

function tweetFeed() {
    var b = "";
    if (ucG.getLastCountry() == undefined) {
        b = "AU"
    } else {
        b = ucG.getLastCountry().toUpperCase()
    }
    if (b == "US") {
        var a = "/js/thirdparty/tweeterFeedUS.js"
    }
    if (b == "AU") {
        var a = "/js/thirdparty/tweeterFeedAW.js"
    }
    if (a != undefined) {
        $j.ajax({
            type: "GET",
            dataType: "json",
            timeout: 10000,
            url: a,
            success: function(c) {
                if (c.success == true) {
                    tweetLength = c.result.tweetList.length;
                    if (tweetLength > 0) {
                        var q = "";
                        var p = "";
                        for (var t = 0; t < tweetLength; t++) {
                            tDate = c.result.tweetList[t].tweetDate;
                            var k = c.result.tweetList[t].tweetText;
                            var j = "http://t.co/";
                            var h = "https://t.co/";
                            if (((k.indexOf(j)) != -1) || ((k.indexOf(h)) != -1)) {
                                if ((k.indexOf(j)) != -1) {
                                    var e = k.indexOf(j)
                                }
                                if ((k.indexOf(h)) != -1) {
                                    var e = k.indexOf(h)
                                }
                                if ((k.indexOf(" ", e)) != -1) {
                                    var r = k.indexOf(" ", e)
                                } else {
                                    var r = k.length
                                }
                                var n = k.length;
                                var g = k.substring(e, r);
                                String.prototype.splice = function(C, d, B) {
                                    return (this.slice(0, C) + '<a href="' + g + '" >' + this.slice(C, d) + "</a>" + this.slice(d, B))
                                };
                                var o = k.splice(e, r, n)
                            } else {
                                var o = c.result.tweetList[t].tweetText
                            }
                            var l = new Date(tDate.toString());
                            if (b == "US") {
                                var A = l.getTime() + (l.getTimezoneOffset() * 60000) - (1440 * 60000)
                            }
                            if (b == "AU") {
                                var A = l.getTime() + (l.getTimezoneOffset() * 60000) - (300 * 60000)
                            }
                            var w = new Date(A);
                            var x = w.getDate();
                            var y = w.getMonth() + 1;
                            var m = w.getFullYear();
                            m = m.toString().slice(2);
                            var f = new Array(7);
                            f[0] = "Sun";
                            f[1] = "Mon";
                            f[2] = "Tue";
                            f[3] = "Wed";
                            f[4] = "Thu";
                            f[5] = "Fri";
                            f[6] = "Sat";
                            var z = f[w.getDay()];
                            Date.prototype.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                            Date.prototype.getMonthName = function() {
                                return this.monthNames[this.getMonth()]
                            };
                            Date.prototype.getShortMonthName = function() {
                                return this.getMonthName().substr(0, 3)
                            };
                            var v = w.getShortMonthName();
                            var s = "" + z + ",  " + x + " " + v + " " + m + "";
                            q += '<li class="feeds" id="feeds' + t + '"><p class="feed_content">' + o + "</p></li>";
                            p += '<span class="feed_time">&mdash; <a id="tw" href="https://twitter.com/Qantas" target="_blank">@Qantas</a> on ' + s + "</span>"
                        }
                        $j(".twitter-slider ul").append(q);
                        $j(".twitter_feed").html('<div class="feedTimeDiv">' + p + "</div>");
                        slider();
                        tweetSlider()
                    } else {
                        $j("div.footer-block").find("div#tweet").hide()
                    }
                } else {
                    $j("div.footer-block").find("div#tweet").hide()
                }
            },
            error: function() {
                $j("div.footer-block").find("div#tweet").hide()
            }
        })
    }
}
var gal_interval = 7000;

function slider() {
    $j(".twitter-slider ul li:first").hide().insertAfter($j(".twitter-slider ul li:last")).fadeIn(500, function() {
        window.setTimeout(slider, gal_interval)
    });
    $j(".feed_content a").each(function(c) {
        var b = new RegExp("/" + window.location.host + "/");
        if (!b.test(this.href)) {
            $j(this).click(function(a) {
                a.preventDefault();
                a.stopPropagation();
                window.open(this.href, "_blank")
            })
        }
    })
}

function tweetSlider() {
    $j(".feedTimeDiv span:first").hide().insertAfter($j(".feedTimeDiv span:last")).fadeIn(500, function() {
        window.setTimeout(tweetSlider, gal_interval)
    })
}

function loggedin() {
    $j(document).ready(function() {
        $j("div.menu-b").find("span.description").each(function() {
            if ($j(this).find("._qantas_menu_loggedin").length) {
                $j(this).find("div._qantas_menu_loggedout").hide();
                $j(this).find("div._qantas_menu_loggedin").show()
            } else {
                $j(this).find("div._qantas_menu_loggedout").show()
            }
        })
    })
}
$j(document).ready(function() {
    $j(".menu-a td").each(function(a) {
        if ($j(this).find("div.menu-b").length <= 0) {
            $j(this).find("a").addClass("no-bmenu")
        }
    });
    $j("input#sli_search_1").bind("click", function() {
        $j("form#queryForm").css("border", "1px solid #AAA")
    });
    $j("input#sli_search_1").bind("blur", function() {
        $j("form#queryForm").css("border", "1px solid #CCC")
    })
});
$j(document).ready(function() {
    $j("#nl_email").focus(function() {
        if ($j(this).hasClass("errorMail")) {
            $j(this).val("");
            $j(this).css({
                "font-weight": "normal"
            });
            $j(this).removeClass("errorMail");
            $j(this).next("span.fa").remove()
        }
    })
});

function validateSubscribe() {
    var c = new Array();
    c.en = "Enter an email address";
    c.es = "Ingrese un correo electr\u00F3nico";
    c.ja = "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044";
    c.fr = "Saisir une adresse e-mail";
    c.de = "Email-Adresse ung\u00FCltig";
    c.zh = "\u8F93\u5165\u7535\u5B50\u90AE\u4EF6\u5730\u5740";
    var a = document.getElementById("nl_email").value;
    if (ucG.getLastRegion() == undefined) {
        Language = "en"
    } else {
        Language = ucG.getLastLocale()
    }
    if (ucG.getLastCountry() == undefined) {
        Country = "AU"
    } else {
        Country = ucG.getLastCountry()
    }
    if (a == null || a == "") {
        $j("#nl_email").addClass("errorMail");
        $j('<span class="fa fa-warning"></span>').insertAfter("#nl_email");
        $j("#subscribe label").hide();
        var d = document.getElementById("nl_email");
        if (Language == "en") {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "Enter an email address"
        }
        if (Language == "fr") {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "Saisir une adresse e-mail"
        }
        if (Language == "de") {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "Email-Adresse ung\u00FCltig"
        }
        if ((Language == "zh") && ((Country == "HK") || (Country == "TW"))) {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "\u8F38\u5165\u96FB\u5B50\u90F5\u4EF6\u5730\u5740"
        }
        if ((Language == "zh") && (Country == "CN")) {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "\u8F93\u5165\u7535\u5B50\u90AE\u4EF6\u5730\u5740"
        }
        if (Language == "es") {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "Ingrese un correo electr\u00F3nico"
        }
        if (Language == "ja") {
            document.getElementById("nl_email").value = "";
            d.value = d.value + "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044"
        }
        return false
    }
    var b = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (b.test(a) == false) {
        $j("#nl_email").addClass("errorMail");
        $j('<span class="fa fa-warning"></span>').insertAfter("#nl_email");
        var d = document.getElementById("nl_email");
        $j("#nl_email").css({
            "font-family": "'ProximaNova-Semibold','HelveticaNeue','Helvetica Neue',Helvetica,Arial,sans-serif"
        });
        if ((a != c[Language])) {
            if (Language == "en") {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "Enter a valid email address"
            }
            if (Language == "fr") {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "Saisir une adresse e-mail valide"
            }
            if (Language == "de") {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "Email-Adresse ung\u00FCltig"
            }
            if ((Language == "zh") && ((Country == "HK") || (Country == "TW"))) {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "\u8ACB\u8F38\u5165\u6709\u6548\u7684\u96FB\u5B50\u90F5\u4EF6\u5730\u5740"
            }
            if (Language == "zh" && (Country == "CN")) {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7535\u5B50\u90AE\u4EF6\u5730\u5740"
            }
            if (Language == "es") {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "Ingrese correo electr\u00F3nico v\u00E1lidoe"
            }
            if (Language == "ja") {
                document.getElementById("nl_email").value = "";
                d.value = d.value + "\u30E1\u30FC\u30EB\u30A2\u30C9\u30EC\u30B9\u3092\u3054\u78BA\u8A8D\u304F\u3060\u3055\u3044\u3002"
            }
        }
        return false
    }
}
$j(document).ready(function() {
    $j("#footer #subscribe form").attr("target", "_top");
    $j("form#lateLoginForm input").each(function() {
        if (($j(this).val() == "") || ($j(this).val() == null)) {
            $j(this).prev("label").show()
        } else {
            $j(this).prev("label").hide()
        }
    });
    $j("form#lateLoginForm input").bind("click", function() {
        $j(this).prev("label").hide()
    });
    $j("form#lateLoginForm input").bind("blur", function() {
        if (($j(this).val() == "") || ($j(this).val() == null)) {
            $j(this).prev("label").show()
        } else {
            $j(this).prev("label").hide()
        }
    });
    $j("form#lateLoginForm label").bind("click", function() {
        $j(this).next("input").focus()
    })
});
$j(document).ready(function() {
    var b = "";
    if (ucG.getLastCountry() == undefined) {
        b = "AU"
    } else {
        b = ucG.getLastCountry()
    }
    $j("#fb").click(function() {
        window.open("http://www.facebook.com/qantas")
    });
    $j("#tweet").find("#tw").click(function() {
        if (b == "US") {
            window.open("http://twitter.com/QantasUSA")
        }
        if (b == "AU") {
            window.open("http://twitter.com/Qantas")
        }
    });
    $j("#abt-qantas").find("#tw").click(function() {
        if (b == "US") {
            window.open("http://twitter.com/QantasUSA")
        } else {
            window.open("http://twitter.com/Qantas")
        }
    });
    $j("#in").click(function() {
        window.open("http://www.linkedin.com/company/qantas")
    });
    $j("#yt").click(function() {
        window.open("http://www.youtube.com/qantas")
    });
    $j("#ig").click(function() {
        window.open("http://instagram.com/Qantas")
    });
    $j("#gp").click(function() {
        window.open("https://plus.google.com/+Qantas")
    });

    function a(f, g) {
        g = Math.pow(10, g);
        var c = ["k", "m", "b", "t"];
        for (var e = c.length - 1; e >= 0; e--) {
            var d = Math.pow(10, (e + 1) * 3);
            if (d <= f) {
                f = Math.round(f * g / d) / g;
                if ((f == 1000) && (e < c.length - 1)) {
                    f = 1;
                    e++
                }
                if (f > 9) {
                    var f = Math.floor(f)
                }
                f += c[e] + "&nbsp;";
                break
            }
        }
        return f
    }
    $j.ajax({
        type: "GET",
        dataType: "json",
        url: "/js/social/social.js",
        success: function(e) {
            var f = a(e.social.facebook.likes, 1);
            var j = a(e.social.youtube.subscriberCount, 1);
            var d = a(e.social.instagram.followers, 1);
            var c = a(e.social.linkedIn.followers, 1);
            var g = a(e.social.googleplus.followers, 1);
            if (b == "US") {
                var h = a(e.social.twitter[0].followers, 1)
            } else {
                var h = a(e.social.twitter[1].followers, 1)
            }
            $j("#fb").prepend(f);
            $j("#abt-qantas").find("#tw").prepend(h);
            $j("#ig").prepend(d);
            $j("#yt").prepend(j);
            $j("#in").prepend(c);
            $j("#gp").prepend(g)
        },
        error: function() {}
    })
});

function skipLinks() {
    var a;
    a = '<div class="skiplinks""><a href="#main" class="skipToContent">Skip navigation</a>';
    if (window.location.href.indexOf("/travel/airlines/home/") > 0) {
        a += '<a class="skipToContent" id="skipToBook" href="#intForm">Click here to go to Booking Form</a><a class="skipToContent" id="skiptoFF" href="#fflyer-login">Click here to access Frequent Flyer login form, Manage your booking and online checkin forms</a><a class="skipToContent" id="skiptoHCP" href="#main">Click here to access HCP leadins</a></div>'
    } else {
        if (window.location.href.indexOf("/airlines/flight-search/") > 0) {
            a += '<a class="skipToContent" id="skipToBook" href="#intForm">Click here to go to Booking Form</a>'
        } else {
            if (window.location.href.indexOf("/travel/airlines/multi-city-flight-search/") > 0) {
                a += '<a class="skipToContent" id="skipToBook" href="#intMultiCityForm">Click here to go to Booking Form</a>'
            } else {
                a += '<a id="" class="skipToContent" href="#main">Skip navigation</a>'
            }
        }
    }
    a += "</div>";
    $j(".header_nav").prepend(a)
}
$j(document).ready(function() {
    var d = false,
        a, c;
    try {
        d = (window.self !== window.top)
    } catch (b) {
        d = true
    }
    if (!d) {
        showIE8MEssage();
        goToTop = '<a class="gotoTop" href="#top"><i></i>Go to top</a>';
        $j("body:first").not("iframe").prepend(goToTop);
        if ($j("a.backtotop").parent("p").length > 0) {
            $j("a.backtotop").parent().remove()
        } else {
            $j("a.backtotop").remove()
        }
        c = $j(".gotoTop");
        if (c.height() > 80) {
            $j(window).scroll(function() {
                if ($j(this).scrollTop() > 100) {
                    $j(".gotoTop").fadeIn()
                } else {
                    $j(".gotoTop").fadeOut()
                }
            });
            $j(".gotoTop").click(function() {
                $j("html, body").animate({
                    scrollTop: 0
                }, 500);
                return false
            })
        } else {
            $j(".gotoTop").remove()
        }
    }
});
$j(document).ready(function() {
    $j("ul.linkList li a").click(function() {
        var a = $j(this).attr("href");
        scrollToAnchor(a)
    })
});

function scrollToAnchor(b) {
    var a = $j(b);
    $j("html, body").animate({
        scrollTop: a.offset().top
    }, 500);
    return false
}
$j(document).ready(function() {
    var e = $j("div.teamsite_r2").length;
    if (e > 0) {
        var a = $j("div.teamsite_r2").find("h2:visible").not(".hidden").length;
        for (var b = 0; b < a; b++) {
            var d = $j("div.teamsite_r2").find("h2:visible").not(".hidden").eq(b).is(":empty");
            var c = $j("div.teamsite_r2").find("h2:visible").not(".hidden").eq(b).find("span").is(":empty");
            if (!d) {
                if (!c) {
                    $j("div.teamsite_r2").find("h2:visible").not(".hidden").eq(b).addClass("first");
                    break
                }
            }
        }
    } else {
        var a = $j("h2:visible").not(".hidden").length;
        for (var b = 0; b < a; b++) {
            var d = $j("h2:visible").not(".hidden").eq(b).is(":empty");
            var c = $j("h2:visible").not(".hidden").eq(b).find("span").is(":empty");
            if (!d) {
                if (!c) {
                    $j("h2:visible").not(".hidden").eq(b).addClass("first");
                    break
                }
            }
        }
    }
    $j("div.tabcontent").each(function() {
        var g = $j(this).find("h2").not(".hidden").filter(":first").is(":empty");
        var f = $j(this).find("h2").not(".hidden").filter(":first").find("span").is(":empty");
        if (!g) {
            if (!f) {
                $j(this).find("h2").not(".hidden").filter(":first").addClass("first")
            }
        }
    })
});

function showIE8MEssage() {
    var b = (window.attachEvent && !window.addEventListener) ? true : false;
    if (b) {
        var a = document.createElement("link");
        a.type = "text/css";
        a.href = "/styles/components/alertMessages.css";
        a.rel = "stylesheet";
        document.getElementsByTagName("head")[0].appendChild(a);
        var c = "<div id='upgrade-alert'><div class='qa-icon qa-icon_close'><ul><li>Please upgrade your web browser for an enhanced experience, it will only take a minute. <a href='http://browsehappy.com' target='_blank'>Upgrade my browser</a></li></ul><i class='qa-icon qa-icon_close pull-right'></i></div>";
        $j(".header_nav").before(c);
        $j(".wrapper").addClass("IEmsg");
        $j("#upgrade-alert i").bind("click", function() {
            $j("#upgrade-alert").hide();
            $j(".wrapper").removeClass("IEmsg")
        })
    }
};