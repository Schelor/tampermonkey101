
// ==UserScript==
// @name         my-userscript Dev
// @namespace    my-userscript
// @version      0.0.0
// @include      *
// @run-at       document-end
// ==/UserScript==
(function () {
  'use strict';

  function styleInject(css, ref) {
    if ( ref === void 0 ) ref = {};
    var insertAt = ref.insertAt;

    if (!css || typeof document === 'undefined') { return; }

    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';

    if (insertAt === 'top') {
      if (head.firstChild) {
        head.insertBefore(style, head.firstChild);
      } else {
        head.appendChild(style);
      }
    } else {
      head.appendChild(style);
    }

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  }

  var css_248z$1 = ".global-module_container__-tGDM {\n  font-size: 16px;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 999;\n  min-width: 15em;\n  max-width: 100%;\n  background-color: #fff;\n  border: 1px solid #eee;\n  border-radius: 4px;\n  padding: 1em;\n  text-align: center;\n}\n\n.global-module_logo__RzTo1 {\n  width: 48px;\n  height: 48px;\n}\n\n.global-module_check__1s-U5 {\n  color: green;\n  vertical-align: middle;\n  margin-right: 0.5em;\n}\n\n.global-module_supports__XdEcd {\n  text-align: left;\n  width: auto;\n  line-height: 2;\n}\n\n.global-module_button__EeOr9 {\n  padding: 0.2em 2em;\n  border-radius: 2px;\n  text-align: center;\n  background-color: #000;\n  color: #fff;\n  display: inline-block;\n  cursor: pointer;\n}\n\n.global-module_hide__63gRn {\n  display: none;\n}\n";
  var style = {"container":"global-module_container__-tGDM","logo":"global-module_logo__RzTo1","check":"global-module_check__1s-U5","supports":"global-module_supports__XdEcd","button":"global-module_button__EeOr9","hide":"global-module_hide__63gRn"};
  styleInject(css_248z$1);

  var img = "data:image/svg+xml,%3csvg role='img' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3e %3ctitle%3eTampermonkey%3c/title%3e %3cpath d='M5.955.002C3-.071.275 2.386.043 5.335c-.069 3.32-.011 6.646-.03 9.969.06 1.87-.276 3.873.715 5.573 1.083 2.076 3.456 3.288 5.77 3.105 4.003-.011 8.008.022 12.011-.017 2.953-.156 5.478-2.815 5.482-5.772-.007-4.235.023-8.473-.015-12.708C23.82 2.533 21.16.007 18.205.003c-4.083-.005-8.167 0-12.25-.002zm.447 12.683c2.333-.046 4.506 1.805 4.83 4.116.412 2.287-1.056 4.716-3.274 5.411-2.187.783-4.825-.268-5.874-2.341-1.137-2.039-.52-4.827 1.37-6.197a4.896 4.896 0 012.948-.99zm11.245 0c2.333-.046 4.505 1.805 4.829 4.116.413 2.287-1.056 4.716-3.273 5.411-2.188.783-4.825-.268-5.875-2.341-1.136-2.039-.52-4.827 1.37-6.197a4.896 4.896 0 012.949-.99z' /%3e%3c/svg%3e";

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  var check$1 = function (it) {
    return it && it.Math == Math && it;
  };

  // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
  var global$c =
    // eslint-disable-next-line es/no-global-this -- safe
    check$1(typeof globalThis == 'object' && globalThis) ||
    check$1(typeof window == 'object' && window) ||
    // eslint-disable-next-line no-restricted-globals -- safe
    check$1(typeof self == 'object' && self) ||
    check$1(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
    // eslint-disable-next-line no-new-func -- fallback
    (function () { return this; })() || Function('return this')();

  var objectGetOwnPropertyDescriptor = {};

  var fails$8 = function (exec) {
    try {
      return !!exec();
    } catch (error) {
      return true;
    }
  };

  var fails$7 = fails$8;

  // Detect IE8's incomplete defineProperty implementation
  var descriptors = !fails$7(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- required for testing
    return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
  });

  var objectPropertyIsEnumerable = {};

  var $propertyIsEnumerable = {}.propertyIsEnumerable;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getOwnPropertyDescriptor$1 = Object.getOwnPropertyDescriptor;

  // Nashorn ~ JDK8 bug
  var NASHORN_BUG = getOwnPropertyDescriptor$1 && !$propertyIsEnumerable.call({ 1: 2 }, 1);

  // `Object.prototype.propertyIsEnumerable` method implementation
  // https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
  objectPropertyIsEnumerable.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
    var descriptor = getOwnPropertyDescriptor$1(this, V);
    return !!descriptor && descriptor.enumerable;
  } : $propertyIsEnumerable;

  var createPropertyDescriptor$2 = function (bitmap, value) {
    return {
      enumerable: !(bitmap & 1),
      configurable: !(bitmap & 2),
      writable: !(bitmap & 4),
      value: value
    };
  };

  var toString = {}.toString;

  var classofRaw = function (it) {
    return toString.call(it).slice(8, -1);
  };

  var fails$6 = fails$8;
  var classof = classofRaw;

  var split = ''.split;

  // fallback for non-array-like ES3 and non-enumerable old V8 strings
  var indexedObject = fails$6(function () {
    // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
    // eslint-disable-next-line no-prototype-builtins -- safe
    return !Object('z').propertyIsEnumerable(0);
  }) ? function (it) {
    return classof(it) == 'String' ? split.call(it, '') : Object(it);
  } : Object;

  // `RequireObjectCoercible` abstract operation
  // https://tc39.es/ecma262/#sec-requireobjectcoercible
  var requireObjectCoercible$2 = function (it) {
    if (it == undefined) throw TypeError("Can't call method on " + it);
    return it;
  };

  // toObject with fallback for non-array-like ES3 strings
  var IndexedObject = indexedObject;
  var requireObjectCoercible$1 = requireObjectCoercible$2;

  var toIndexedObject$3 = function (it) {
    return IndexedObject(requireObjectCoercible$1(it));
  };

  // `IsCallable` abstract operation
  // https://tc39.es/ecma262/#sec-iscallable
  var isCallable$c = function (argument) {
    return typeof argument === 'function';
  };

  var isCallable$b = isCallable$c;

  var isObject$5 = function (it) {
    return typeof it === 'object' ? it !== null : isCallable$b(it);
  };

  var global$b = global$c;
  var isCallable$a = isCallable$c;

  var aFunction = function (argument) {
    return isCallable$a(argument) ? argument : undefined;
  };

  var getBuiltIn$4 = function (namespace, method) {
    return arguments.length < 2 ? aFunction(global$b[namespace]) : global$b[namespace] && global$b[namespace][method];
  };

  var getBuiltIn$3 = getBuiltIn$4;

  var engineUserAgent = getBuiltIn$3('navigator', 'userAgent') || '';

  var global$a = global$c;
  var userAgent = engineUserAgent;

  var process = global$a.process;
  var Deno = global$a.Deno;
  var versions = process && process.versions || Deno && Deno.version;
  var v8 = versions && versions.v8;
  var match, version;

  if (v8) {
    match = v8.split('.');
    version = match[0] < 4 ? 1 : match[0] + match[1];
  } else if (userAgent) {
    match = userAgent.match(/Edge\/(\d+)/);
    if (!match || match[1] >= 74) {
      match = userAgent.match(/Chrome\/(\d+)/);
      if (match) version = match[1];
    }
  }

  var engineV8Version = version && +version;

  /* eslint-disable es/no-symbol -- required for testing */

  var V8_VERSION = engineV8Version;
  var fails$5 = fails$8;

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
  var nativeSymbol = !!Object.getOwnPropertySymbols && !fails$5(function () {
    var symbol = Symbol();
    // Chrome 38 Symbol has incorrect toString conversion
    // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
    return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
      // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
      !Symbol.sham && V8_VERSION && V8_VERSION < 41;
  });

  /* eslint-disable es/no-symbol -- required for testing */

  var NATIVE_SYMBOL$1 = nativeSymbol;

  var useSymbolAsUid = NATIVE_SYMBOL$1
    && !Symbol.sham
    && typeof Symbol.iterator == 'symbol';

  var isCallable$9 = isCallable$c;
  var getBuiltIn$2 = getBuiltIn$4;
  var USE_SYMBOL_AS_UID$1 = useSymbolAsUid;

  var isSymbol$2 = USE_SYMBOL_AS_UID$1 ? function (it) {
    return typeof it == 'symbol';
  } : function (it) {
    var $Symbol = getBuiltIn$2('Symbol');
    return isCallable$9($Symbol) && Object(it) instanceof $Symbol;
  };

  var tryToString$1 = function (argument) {
    try {
      return String(argument);
    } catch (error) {
      return 'Object';
    }
  };

  var isCallable$8 = isCallable$c;
  var tryToString = tryToString$1;

  // `Assert: IsCallable(argument) is true`
  var aCallable$3 = function (argument) {
    if (isCallable$8(argument)) return argument;
    throw TypeError(tryToString(argument) + ' is not a function');
  };

  var aCallable$2 = aCallable$3;

  // `GetMethod` abstract operation
  // https://tc39.es/ecma262/#sec-getmethod
  var getMethod$3 = function (V, P) {
    var func = V[P];
    return func == null ? undefined : aCallable$2(func);
  };

  var isCallable$7 = isCallable$c;
  var isObject$4 = isObject$5;

  // `OrdinaryToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-ordinarytoprimitive
  var ordinaryToPrimitive$1 = function (input, pref) {
    var fn, val;
    if (pref === 'string' && isCallable$7(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
    if (isCallable$7(fn = input.valueOf) && !isObject$4(val = fn.call(input))) return val;
    if (pref !== 'string' && isCallable$7(fn = input.toString) && !isObject$4(val = fn.call(input))) return val;
    throw TypeError("Can't convert object to primitive value");
  };

  var shared$3 = {exports: {}};

  var global$9 = global$c;

  var setGlobal$3 = function (key, value) {
    try {
      // eslint-disable-next-line es/no-object-defineproperty -- safe
      Object.defineProperty(global$9, key, { value: value, configurable: true, writable: true });
    } catch (error) {
      global$9[key] = value;
    } return value;
  };

  var global$8 = global$c;
  var setGlobal$2 = setGlobal$3;

  var SHARED = '__core-js_shared__';
  var store$3 = global$8[SHARED] || setGlobal$2(SHARED, {});

  var sharedStore = store$3;

  var store$2 = sharedStore;

  (shared$3.exports = function (key, value) {
    return store$2[key] || (store$2[key] = value !== undefined ? value : {});
  })('versions', []).push({
    version: '3.18.3',
    mode: 'global',
    copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
  });

  var requireObjectCoercible = requireObjectCoercible$2;

  // `ToObject` abstract operation
  // https://tc39.es/ecma262/#sec-toobject
  var toObject$2 = function (argument) {
    return Object(requireObjectCoercible(argument));
  };

  var toObject$1 = toObject$2;

  var hasOwnProperty = {}.hasOwnProperty;

  // `HasOwnProperty` abstract operation
  // https://tc39.es/ecma262/#sec-hasownproperty
  var hasOwnProperty_1 = Object.hasOwn || function hasOwn(it, key) {
    return hasOwnProperty.call(toObject$1(it), key);
  };

  var id = 0;
  var postfix = Math.random();

  var uid$2 = function (key) {
    return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
  };

  var global$7 = global$c;
  var shared$2 = shared$3.exports;
  var hasOwn$8 = hasOwnProperty_1;
  var uid$1 = uid$2;
  var NATIVE_SYMBOL = nativeSymbol;
  var USE_SYMBOL_AS_UID = useSymbolAsUid;

  var WellKnownSymbolsStore = shared$2('wks');
  var Symbol$1 = global$7.Symbol;
  var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid$1;

  var wellKnownSymbol$4 = function (name) {
    if (!hasOwn$8(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
      if (NATIVE_SYMBOL && hasOwn$8(Symbol$1, name)) {
        WellKnownSymbolsStore[name] = Symbol$1[name];
      } else {
        WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
      }
    } return WellKnownSymbolsStore[name];
  };

  var isObject$3 = isObject$5;
  var isSymbol$1 = isSymbol$2;
  var getMethod$2 = getMethod$3;
  var ordinaryToPrimitive = ordinaryToPrimitive$1;
  var wellKnownSymbol$3 = wellKnownSymbol$4;

  var TO_PRIMITIVE = wellKnownSymbol$3('toPrimitive');

  // `ToPrimitive` abstract operation
  // https://tc39.es/ecma262/#sec-toprimitive
  var toPrimitive$1 = function (input, pref) {
    if (!isObject$3(input) || isSymbol$1(input)) return input;
    var exoticToPrim = getMethod$2(input, TO_PRIMITIVE);
    var result;
    if (exoticToPrim) {
      if (pref === undefined) pref = 'default';
      result = exoticToPrim.call(input, pref);
      if (!isObject$3(result) || isSymbol$1(result)) return result;
      throw TypeError("Can't convert object to primitive value");
    }
    if (pref === undefined) pref = 'number';
    return ordinaryToPrimitive(input, pref);
  };

  var toPrimitive = toPrimitive$1;
  var isSymbol = isSymbol$2;

  // `ToPropertyKey` abstract operation
  // https://tc39.es/ecma262/#sec-topropertykey
  var toPropertyKey$2 = function (argument) {
    var key = toPrimitive(argument, 'string');
    return isSymbol(key) ? key : String(key);
  };

  var global$6 = global$c;
  var isObject$2 = isObject$5;

  var document$1 = global$6.document;
  // typeof document.createElement is 'object' in old IE
  var EXISTS$1 = isObject$2(document$1) && isObject$2(document$1.createElement);

  var documentCreateElement$1 = function (it) {
    return EXISTS$1 ? document$1.createElement(it) : {};
  };

  var DESCRIPTORS$5 = descriptors;
  var fails$4 = fails$8;
  var createElement = documentCreateElement$1;

  // Thank's IE8 for his funny defineProperty
  var ie8DomDefine = !DESCRIPTORS$5 && !fails$4(function () {
    // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
    return Object.defineProperty(createElement('div'), 'a', {
      get: function () { return 7; }
    }).a != 7;
  });

  var DESCRIPTORS$4 = descriptors;
  var propertyIsEnumerableModule = objectPropertyIsEnumerable;
  var createPropertyDescriptor$1 = createPropertyDescriptor$2;
  var toIndexedObject$2 = toIndexedObject$3;
  var toPropertyKey$1 = toPropertyKey$2;
  var hasOwn$7 = hasOwnProperty_1;
  var IE8_DOM_DEFINE$1 = ie8DomDefine;

  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
  objectGetOwnPropertyDescriptor.f = DESCRIPTORS$4 ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
    O = toIndexedObject$2(O);
    P = toPropertyKey$1(P);
    if (IE8_DOM_DEFINE$1) try {
      return $getOwnPropertyDescriptor(O, P);
    } catch (error) { /* empty */ }
    if (hasOwn$7(O, P)) return createPropertyDescriptor$1(!propertyIsEnumerableModule.f.call(O, P), O[P]);
  };

  var objectDefineProperty = {};

  var isObject$1 = isObject$5;

  // `Assert: Type(argument) is Object`
  var anObject$8 = function (argument) {
    if (isObject$1(argument)) return argument;
    throw TypeError(String(argument) + ' is not an object');
  };

  var DESCRIPTORS$3 = descriptors;
  var IE8_DOM_DEFINE = ie8DomDefine;
  var anObject$7 = anObject$8;
  var toPropertyKey = toPropertyKey$2;

  // eslint-disable-next-line es/no-object-defineproperty -- safe
  var $defineProperty = Object.defineProperty;

  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  objectDefineProperty.f = DESCRIPTORS$3 ? $defineProperty : function defineProperty(O, P, Attributes) {
    anObject$7(O);
    P = toPropertyKey(P);
    anObject$7(Attributes);
    if (IE8_DOM_DEFINE) try {
      return $defineProperty(O, P, Attributes);
    } catch (error) { /* empty */ }
    if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
    if ('value' in Attributes) O[P] = Attributes.value;
    return O;
  };

  var DESCRIPTORS$2 = descriptors;
  var definePropertyModule$2 = objectDefineProperty;
  var createPropertyDescriptor = createPropertyDescriptor$2;

  var createNonEnumerableProperty$5 = DESCRIPTORS$2 ? function (object, key, value) {
    return definePropertyModule$2.f(object, key, createPropertyDescriptor(1, value));
  } : function (object, key, value) {
    object[key] = value;
    return object;
  };

  var redefine$3 = {exports: {}};

  var isCallable$6 = isCallable$c;
  var store$1 = sharedStore;

  var functionToString = Function.toString;

  // this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
  if (!isCallable$6(store$1.inspectSource)) {
    store$1.inspectSource = function (it) {
      return functionToString.call(it);
    };
  }

  var inspectSource$2 = store$1.inspectSource;

  var global$5 = global$c;
  var isCallable$5 = isCallable$c;
  var inspectSource$1 = inspectSource$2;

  var WeakMap$1 = global$5.WeakMap;

  var nativeWeakMap = isCallable$5(WeakMap$1) && /native code/.test(inspectSource$1(WeakMap$1));

  var shared$1 = shared$3.exports;
  var uid = uid$2;

  var keys = shared$1('keys');

  var sharedKey$3 = function (key) {
    return keys[key] || (keys[key] = uid(key));
  };

  var hiddenKeys$4 = {};

  var NATIVE_WEAK_MAP = nativeWeakMap;
  var global$4 = global$c;
  var isObject = isObject$5;
  var createNonEnumerableProperty$4 = createNonEnumerableProperty$5;
  var hasOwn$6 = hasOwnProperty_1;
  var shared = sharedStore;
  var sharedKey$2 = sharedKey$3;
  var hiddenKeys$3 = hiddenKeys$4;

  var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
  var WeakMap = global$4.WeakMap;
  var set, get, has;

  var enforce = function (it) {
    return has(it) ? get(it) : set(it, {});
  };

  var getterFor = function (TYPE) {
    return function (it) {
      var state;
      if (!isObject(it) || (state = get(it)).type !== TYPE) {
        throw TypeError('Incompatible receiver, ' + TYPE + ' required');
      } return state;
    };
  };

  if (NATIVE_WEAK_MAP || shared.state) {
    var store = shared.state || (shared.state = new WeakMap());
    var wmget = store.get;
    var wmhas = store.has;
    var wmset = store.set;
    set = function (it, metadata) {
      if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      wmset.call(store, it, metadata);
      return metadata;
    };
    get = function (it) {
      return wmget.call(store, it) || {};
    };
    has = function (it) {
      return wmhas.call(store, it);
    };
  } else {
    var STATE = sharedKey$2('state');
    hiddenKeys$3[STATE] = true;
    set = function (it, metadata) {
      if (hasOwn$6(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
      metadata.facade = it;
      createNonEnumerableProperty$4(it, STATE, metadata);
      return metadata;
    };
    get = function (it) {
      return hasOwn$6(it, STATE) ? it[STATE] : {};
    };
    has = function (it) {
      return hasOwn$6(it, STATE);
    };
  }

  var internalState = {
    set: set,
    get: get,
    has: has,
    enforce: enforce,
    getterFor: getterFor
  };

  var DESCRIPTORS$1 = descriptors;
  var hasOwn$5 = hasOwnProperty_1;

  var FunctionPrototype = Function.prototype;
  // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
  var getDescriptor = DESCRIPTORS$1 && Object.getOwnPropertyDescriptor;

  var EXISTS = hasOwn$5(FunctionPrototype, 'name');
  // additional protection from minified / mangled / dropped function names
  var PROPER = EXISTS && (function something() { /* empty */ }).name === 'something';
  var CONFIGURABLE = EXISTS && (!DESCRIPTORS$1 || (DESCRIPTORS$1 && getDescriptor(FunctionPrototype, 'name').configurable));

  var functionName = {
    EXISTS: EXISTS,
    PROPER: PROPER,
    CONFIGURABLE: CONFIGURABLE
  };

  var global$3 = global$c;
  var isCallable$4 = isCallable$c;
  var hasOwn$4 = hasOwnProperty_1;
  var createNonEnumerableProperty$3 = createNonEnumerableProperty$5;
  var setGlobal$1 = setGlobal$3;
  var inspectSource = inspectSource$2;
  var InternalStateModule$1 = internalState;
  var CONFIGURABLE_FUNCTION_NAME = functionName.CONFIGURABLE;

  var getInternalState$1 = InternalStateModule$1.get;
  var enforceInternalState = InternalStateModule$1.enforce;
  var TEMPLATE = String(String).split('String');

  (redefine$3.exports = function (O, key, value, options) {
    var unsafe = options ? !!options.unsafe : false;
    var simple = options ? !!options.enumerable : false;
    var noTargetGet = options ? !!options.noTargetGet : false;
    var name = options && options.name !== undefined ? options.name : key;
    var state;
    if (isCallable$4(value)) {
      if (String(name).slice(0, 7) === 'Symbol(') {
        name = '[' + String(name).replace(/^Symbol\(([^)]*)\)/, '$1') + ']';
      }
      if (!hasOwn$4(value, 'name') || (CONFIGURABLE_FUNCTION_NAME && value.name !== name)) {
        createNonEnumerableProperty$3(value, 'name', name);
      }
      state = enforceInternalState(value);
      if (!state.source) {
        state.source = TEMPLATE.join(typeof name == 'string' ? name : '');
      }
    }
    if (O === global$3) {
      if (simple) O[key] = value;
      else setGlobal$1(key, value);
      return;
    } else if (!unsafe) {
      delete O[key];
    } else if (!noTargetGet && O[key]) {
      simple = true;
    }
    if (simple) O[key] = value;
    else createNonEnumerableProperty$3(O, key, value);
  // add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
  })(Function.prototype, 'toString', function toString() {
    return isCallable$4(this) && getInternalState$1(this).source || inspectSource(this);
  });

  var objectGetOwnPropertyNames = {};

  var ceil = Math.ceil;
  var floor = Math.floor;

  // `ToIntegerOrInfinity` abstract operation
  // https://tc39.es/ecma262/#sec-tointegerorinfinity
  var toIntegerOrInfinity$2 = function (argument) {
    var number = +argument;
    // eslint-disable-next-line no-self-compare -- safe
    return number !== number || number === 0 ? 0 : (number > 0 ? floor : ceil)(number);
  };

  var toIntegerOrInfinity$1 = toIntegerOrInfinity$2;

  var max = Math.max;
  var min$1 = Math.min;

  // Helper for a popular repeating case of the spec:
  // Let integer be ? ToInteger(index).
  // If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
  var toAbsoluteIndex$1 = function (index, length) {
    var integer = toIntegerOrInfinity$1(index);
    return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
  };

  var toIntegerOrInfinity = toIntegerOrInfinity$2;

  var min = Math.min;

  // `ToLength` abstract operation
  // https://tc39.es/ecma262/#sec-tolength
  var toLength$1 = function (argument) {
    return argument > 0 ? min(toIntegerOrInfinity(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
  };

  var toLength = toLength$1;

  // `LengthOfArrayLike` abstract operation
  // https://tc39.es/ecma262/#sec-lengthofarraylike
  var lengthOfArrayLike$1 = function (obj) {
    return toLength(obj.length);
  };

  var toIndexedObject$1 = toIndexedObject$3;
  var toAbsoluteIndex = toAbsoluteIndex$1;
  var lengthOfArrayLike = lengthOfArrayLike$1;

  // `Array.prototype.{ indexOf, includes }` methods implementation
  var createMethod = function (IS_INCLUDES) {
    return function ($this, el, fromIndex) {
      var O = toIndexedObject$1($this);
      var length = lengthOfArrayLike(O);
      var index = toAbsoluteIndex(fromIndex, length);
      var value;
      // Array#includes uses SameValueZero equality algorithm
      // eslint-disable-next-line no-self-compare -- NaN check
      if (IS_INCLUDES && el != el) while (length > index) {
        value = O[index++];
        // eslint-disable-next-line no-self-compare -- NaN check
        if (value != value) return true;
      // Array#indexOf ignores holes, Array#includes - not
      } else for (;length > index; index++) {
        if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
      } return !IS_INCLUDES && -1;
    };
  };

  var arrayIncludes = {
    // `Array.prototype.includes` method
    // https://tc39.es/ecma262/#sec-array.prototype.includes
    includes: createMethod(true),
    // `Array.prototype.indexOf` method
    // https://tc39.es/ecma262/#sec-array.prototype.indexof
    indexOf: createMethod(false)
  };

  var hasOwn$3 = hasOwnProperty_1;
  var toIndexedObject = toIndexedObject$3;
  var indexOf = arrayIncludes.indexOf;
  var hiddenKeys$2 = hiddenKeys$4;

  var objectKeysInternal = function (object, names) {
    var O = toIndexedObject(object);
    var i = 0;
    var result = [];
    var key;
    for (key in O) !hasOwn$3(hiddenKeys$2, key) && hasOwn$3(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while (names.length > i) if (hasOwn$3(O, key = names[i++])) {
      ~indexOf(result, key) || result.push(key);
    }
    return result;
  };

  // IE8- don't enum bug keys
  var enumBugKeys$3 = [
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf'
  ];

  var internalObjectKeys$1 = objectKeysInternal;
  var enumBugKeys$2 = enumBugKeys$3;

  var hiddenKeys$1 = enumBugKeys$2.concat('length', 'prototype');

  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  // eslint-disable-next-line es/no-object-getownpropertynames -- safe
  objectGetOwnPropertyNames.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
    return internalObjectKeys$1(O, hiddenKeys$1);
  };

  var objectGetOwnPropertySymbols = {};

  // eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
  objectGetOwnPropertySymbols.f = Object.getOwnPropertySymbols;

  var getBuiltIn$1 = getBuiltIn$4;
  var getOwnPropertyNamesModule = objectGetOwnPropertyNames;
  var getOwnPropertySymbolsModule = objectGetOwnPropertySymbols;
  var anObject$6 = anObject$8;

  // all object keys, includes non-enumerable and symbols
  var ownKeys$1 = getBuiltIn$1('Reflect', 'ownKeys') || function ownKeys(it) {
    var keys = getOwnPropertyNamesModule.f(anObject$6(it));
    var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
    return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
  };

  var hasOwn$2 = hasOwnProperty_1;
  var ownKeys = ownKeys$1;
  var getOwnPropertyDescriptorModule = objectGetOwnPropertyDescriptor;
  var definePropertyModule$1 = objectDefineProperty;

  var copyConstructorProperties$1 = function (target, source) {
    var keys = ownKeys(source);
    var defineProperty = definePropertyModule$1.f;
    var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (!hasOwn$2(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
    }
  };

  var fails$3 = fails$8;
  var isCallable$3 = isCallable$c;

  var replacement = /#|\.prototype\./;

  var isForced$1 = function (feature, detection) {
    var value = data[normalize(feature)];
    return value == POLYFILL ? true
      : value == NATIVE ? false
      : isCallable$3(detection) ? fails$3(detection)
      : !!detection;
  };

  var normalize = isForced$1.normalize = function (string) {
    return String(string).replace(replacement, '.').toLowerCase();
  };

  var data = isForced$1.data = {};
  var NATIVE = isForced$1.NATIVE = 'N';
  var POLYFILL = isForced$1.POLYFILL = 'P';

  var isForced_1 = isForced$1;

  var global$2 = global$c;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  var createNonEnumerableProperty$2 = createNonEnumerableProperty$5;
  var redefine$2 = redefine$3.exports;
  var setGlobal = setGlobal$3;
  var copyConstructorProperties = copyConstructorProperties$1;
  var isForced = isForced_1;

  /*
    options.target      - name of the target object
    options.global      - target is the global object
    options.stat        - export as static methods of target
    options.proto       - export as prototype methods of target
    options.real        - real prototype method for the `pure` version
    options.forced      - export even if the native feature is available
    options.bind        - bind methods to the target, required for the `pure` version
    options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
    options.unsafe      - use the simple assignment of property instead of delete + defineProperty
    options.sham        - add a flag to not completely full polyfills
    options.enumerable  - export as enumerable property
    options.noTargetGet - prevent calling a getter on target
    options.name        - the .name of the function if it does not match the key
  */
  var _export = function (options, source) {
    var TARGET = options.target;
    var GLOBAL = options.global;
    var STATIC = options.stat;
    var FORCED, target, key, targetProperty, sourceProperty, descriptor;
    if (GLOBAL) {
      target = global$2;
    } else if (STATIC) {
      target = global$2[TARGET] || setGlobal(TARGET, {});
    } else {
      target = (global$2[TARGET] || {}).prototype;
    }
    if (target) for (key in source) {
      sourceProperty = source[key];
      if (options.noTargetGet) {
        descriptor = getOwnPropertyDescriptor(target, key);
        targetProperty = descriptor && descriptor.value;
      } else targetProperty = target[key];
      FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
      // contained in target
      if (!FORCED && targetProperty !== undefined) {
        if (typeof sourceProperty === typeof targetProperty) continue;
        copyConstructorProperties(sourceProperty, targetProperty);
      }
      // add a flag to not completely full polyfills
      if (options.sham || (targetProperty && targetProperty.sham)) {
        createNonEnumerableProperty$2(sourceProperty, 'sham', true);
      }
      // extend global
      redefine$2(target, key, sourceProperty, options);
    }
  };

  var anInstance$1 = function (it, Constructor, name) {
    if (it instanceof Constructor) return it;
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  };

  var internalObjectKeys = objectKeysInternal;
  var enumBugKeys$1 = enumBugKeys$3;

  // `Object.keys` method
  // https://tc39.es/ecma262/#sec-object.keys
  // eslint-disable-next-line es/no-object-keys -- safe
  var objectKeys$1 = Object.keys || function keys(O) {
    return internalObjectKeys(O, enumBugKeys$1);
  };

  var DESCRIPTORS = descriptors;
  var definePropertyModule = objectDefineProperty;
  var anObject$5 = anObject$8;
  var objectKeys = objectKeys$1;

  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  // eslint-disable-next-line es/no-object-defineproperties -- safe
  var objectDefineProperties = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
    anObject$5(O);
    var keys = objectKeys(Properties);
    var length = keys.length;
    var index = 0;
    var key;
    while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
    return O;
  };

  var getBuiltIn = getBuiltIn$4;

  var html$1 = getBuiltIn('document', 'documentElement');

  /* global ActiveXObject -- old IE, WSH */

  var anObject$4 = anObject$8;
  var defineProperties = objectDefineProperties;
  var enumBugKeys = enumBugKeys$3;
  var hiddenKeys = hiddenKeys$4;
  var html = html$1;
  var documentCreateElement = documentCreateElement$1;
  var sharedKey$1 = sharedKey$3;

  var GT = '>';
  var LT = '<';
  var PROTOTYPE = 'prototype';
  var SCRIPT = 'script';
  var IE_PROTO$1 = sharedKey$1('IE_PROTO');

  var EmptyConstructor = function () { /* empty */ };

  var scriptTag = function (content) {
    return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
  };

  // Create object with fake `null` prototype: use ActiveX Object with cleared prototype
  var NullProtoObjectViaActiveX = function (activeXDocument) {
    activeXDocument.write(scriptTag(''));
    activeXDocument.close();
    var temp = activeXDocument.parentWindow.Object;
    activeXDocument = null; // avoid memory leak
    return temp;
  };

  // Create object with fake `null` prototype: use iframe Object with cleared prototype
  var NullProtoObjectViaIFrame = function () {
    // Thrash, waste and sodomy: IE GC bug
    var iframe = documentCreateElement('iframe');
    var JS = 'java' + SCRIPT + ':';
    var iframeDocument;
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  };

  // Check for document.domain and active x support
  // No need to use active x approach when document.domain is not set
  // see https://github.com/es-shims/es5-shim/issues/150
  // variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
  // avoid IE GC bug
  var activeXDocument;
  var NullProtoObject = function () {
    try {
      activeXDocument = new ActiveXObject('htmlfile');
    } catch (error) { /* ignore */ }
    NullProtoObject = typeof document != 'undefined'
      ? document.domain && activeXDocument
        ? NullProtoObjectViaActiveX(activeXDocument) // old IE
        : NullProtoObjectViaIFrame()
      : NullProtoObjectViaActiveX(activeXDocument); // WSH
    var length = enumBugKeys.length;
    while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
    return NullProtoObject();
  };

  hiddenKeys[IE_PROTO$1] = true;

  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  var objectCreate = Object.create || function create(O, Properties) {
    var result;
    if (O !== null) {
      EmptyConstructor[PROTOTYPE] = anObject$4(O);
      result = new EmptyConstructor();
      EmptyConstructor[PROTOTYPE] = null;
      // add "__proto__" for Object.getPrototypeOf polyfill
      result[IE_PROTO$1] = O;
    } else result = NullProtoObject();
    return Properties === undefined ? result : defineProperties(result, Properties);
  };

  var fails$2 = fails$8;

  var correctPrototypeGetter = !fails$2(function () {
    function F() { /* empty */ }
    F.prototype.constructor = null;
    // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
    return Object.getPrototypeOf(new F()) !== F.prototype;
  });

  var hasOwn$1 = hasOwnProperty_1;
  var isCallable$2 = isCallable$c;
  var toObject = toObject$2;
  var sharedKey = sharedKey$3;
  var CORRECT_PROTOTYPE_GETTER = correctPrototypeGetter;

  var IE_PROTO = sharedKey('IE_PROTO');
  var ObjectPrototype = Object.prototype;

  // `Object.getPrototypeOf` method
  // https://tc39.es/ecma262/#sec-object.getprototypeof
  // eslint-disable-next-line es/no-object-getprototypeof -- safe
  var objectGetPrototypeOf = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
    var object = toObject(O);
    if (hasOwn$1(object, IE_PROTO)) return object[IE_PROTO];
    var constructor = object.constructor;
    if (isCallable$2(constructor) && object instanceof constructor) {
      return constructor.prototype;
    } return object instanceof Object ? ObjectPrototype : null;
  };

  var fails$1 = fails$8;
  var isCallable$1 = isCallable$c;
  var getPrototypeOf = objectGetPrototypeOf;
  var redefine$1 = redefine$3.exports;
  var wellKnownSymbol$2 = wellKnownSymbol$4;

  var ITERATOR = wellKnownSymbol$2('iterator');
  var BUGGY_SAFARI_ITERATORS = false;

  // `%IteratorPrototype%` object
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-object
  var IteratorPrototype$2, PrototypeOfArrayIteratorPrototype, arrayIterator;

  /* eslint-disable es/no-array-prototype-keys -- safe */
  if ([].keys) {
    arrayIterator = [].keys();
    // Safari 8 has buggy iterators w/o `next`
    if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
    else {
      PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
      if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype$2 = PrototypeOfArrayIteratorPrototype;
    }
  }

  var NEW_ITERATOR_PROTOTYPE = IteratorPrototype$2 == undefined || fails$1(function () {
    var test = {};
    // FF44- legacy iterators case
    return IteratorPrototype$2[ITERATOR].call(test) !== test;
  });

  if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype$2 = {};

  // `%IteratorPrototype%[@@iterator]()` method
  // https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
  if (!isCallable$1(IteratorPrototype$2[ITERATOR])) {
    redefine$1(IteratorPrototype$2, ITERATOR, function () {
      return this;
    });
  }

  var iteratorsCore = {
    IteratorPrototype: IteratorPrototype$2,
    BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $$1 = _export;
  var global$1 = global$c;
  var anInstance = anInstance$1;
  var isCallable = isCallable$c;
  var createNonEnumerableProperty$1 = createNonEnumerableProperty$5;
  var fails = fails$8;
  var hasOwn = hasOwnProperty_1;
  var wellKnownSymbol$1 = wellKnownSymbol$4;
  var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;

  var TO_STRING_TAG$1 = wellKnownSymbol$1('toStringTag');

  var NativeIterator = global$1.Iterator;

  // FF56- have non-standard global helper `Iterator`
  var FORCED = !isCallable(NativeIterator)
    || NativeIterator.prototype !== IteratorPrototype$1
    // FF44- non-standard `Iterator` passes previous tests
    || !fails(function () { NativeIterator({}); });

  var IteratorConstructor = function Iterator() {
    anInstance(this, IteratorConstructor);
  };

  if (!hasOwn(IteratorPrototype$1, TO_STRING_TAG$1)) {
    createNonEnumerableProperty$1(IteratorPrototype$1, TO_STRING_TAG$1, 'Iterator');
  }

  if (FORCED || !hasOwn(IteratorPrototype$1, 'constructor') || IteratorPrototype$1.constructor === Object) {
    createNonEnumerableProperty$1(IteratorPrototype$1, 'constructor', IteratorConstructor);
  }

  IteratorConstructor.prototype = IteratorPrototype$1;

  $$1({ global: true, forced: FORCED }, {
    Iterator: IteratorConstructor
  });

  var redefine = redefine$3.exports;

  var redefineAll$1 = function (target, src, options) {
    for (var key in src) redefine(target, key, src[key], options);
    return target;
  };

  var aCallable$1 = aCallable$3;
  var anObject$3 = anObject$8;
  var create = objectCreate;
  var createNonEnumerableProperty = createNonEnumerableProperty$5;
  var redefineAll = redefineAll$1;
  var wellKnownSymbol = wellKnownSymbol$4;
  var InternalStateModule = internalState;
  var getMethod$1 = getMethod$3;
  var IteratorPrototype = iteratorsCore.IteratorPrototype;

  var setInternalState = InternalStateModule.set;
  var getInternalState = InternalStateModule.get;

  var TO_STRING_TAG = wellKnownSymbol('toStringTag');

  var iteratorCreateProxy = function (nextHandler, IS_ITERATOR) {
    var IteratorProxy = function Iterator(state) {
      state.next = aCallable$1(state.iterator.next);
      state.done = false;
      state.ignoreArg = !IS_ITERATOR;
      setInternalState(this, state);
    };

    IteratorProxy.prototype = redefineAll(create(IteratorPrototype), {
      next: function next(arg) {
        var state = getInternalState(this);
        var args = arguments.length ? [state.ignoreArg ? undefined : arg] : IS_ITERATOR ? [] : [undefined];
        state.ignoreArg = false;
        var result = state.done ? undefined : nextHandler.call(state, args);
        return { done: state.done, value: result };
      },
      'return': function (value) {
        var state = getInternalState(this);
        var iterator = state.iterator;
        state.done = true;
        var $$return = getMethod$1(iterator, 'return');
        return { done: true, value: $$return ? anObject$3($$return.call(iterator, value)).value : value };
      },
      'throw': function (value) {
        var state = getInternalState(this);
        var iterator = state.iterator;
        state.done = true;
        var $$throw = getMethod$1(iterator, 'throw');
        if ($$throw) return $$throw.call(iterator, value);
        throw value;
      }
    });

    if (!IS_ITERATOR) {
      createNonEnumerableProperty(IteratorProxy.prototype, TO_STRING_TAG, 'Generator');
    }

    return IteratorProxy;
  };

  var anObject$2 = anObject$8;
  var getMethod = getMethod$3;

  var iteratorClose$1 = function (iterator, kind, value) {
    var innerResult, innerError;
    anObject$2(iterator);
    try {
      innerResult = getMethod(iterator, 'return');
      if (!innerResult) {
        if (kind === 'throw') throw value;
        return value;
      }
      innerResult = innerResult.call(iterator);
    } catch (error) {
      innerError = true;
      innerResult = error;
    }
    if (kind === 'throw') throw value;
    if (innerError) throw innerResult;
    anObject$2(innerResult);
    return value;
  };

  var anObject$1 = anObject$8;
  var iteratorClose = iteratorClose$1;

  // call something on iterator step with safe closing on error
  var callWithSafeIterationClosing$1 = function (iterator, fn, value, ENTRIES) {
    try {
      return ENTRIES ? fn(anObject$1(value)[0], value[1]) : fn(value);
    } catch (error) {
      iteratorClose(iterator, 'throw', error);
    }
  };

  // https://github.com/tc39/proposal-iterator-helpers
  var $ = _export;
  var aCallable = aCallable$3;
  var anObject = anObject$8;
  var createIteratorProxy = iteratorCreateProxy;
  var callWithSafeIterationClosing = callWithSafeIterationClosing$1;

  var IteratorProxy = createIteratorProxy(function (args) {
    var iterator = this.iterator;
    var result = anObject(this.next.apply(iterator, args));
    var done = this.done = !!result.done;
    if (!done) return callWithSafeIterationClosing(iterator, this.mapper, result.value);
  });

  $({ target: 'Iterator', proto: true, real: true }, {
    map: function map(mapper) {
      return new IteratorProxy({
        iterator: anObject(this),
        mapper: aCallable(mapper)
      });
    }
  });

  var check = "<symbol id=\"icon-check\" viewBox=\"1 1 15.6 11.9\"><path d=\"M16.3 4l-8.6 8.6c-.2.2-.4.3-.7.3-.3 0-.5-.1-.7-.3l-5-5C1.1 7.5 1 7.2 1 7c0-.3.1-.5.3-.7l1.4-1.4c.2-.2.4-.3.7-.3.3 0 .5.1.7.3l3 3 6.6-6.6c0-.2.3-.3.5-.3.3 0 .5.1.7.3l1.4 1.4c.2.2.3.4.3.7 0 .2-.1.4-.3.6\"/></symbol>";

  var css_248z = ".sprite-module_icon__ljZO0 {\n  width: 1em;\n  height: 1em;\n  fill: currentColor;\n  overflow: hidden;\n  display: inline-block;\n}\n";
  var iconStyle = {"icon":"sprite-module_icon__ljZO0"};
  styleInject(css_248z);

  const icons = {
    check
  };
  const iconIds = Object.fromEntries(Object.entries(icons).map(([name, value]) => [name, value.match(/<symbol id="([^"]+)"/)?.[1]]));
  const xmlns = 'http://www.w3.org/2000/svg';
  const xlink = 'http://www.w3.org/1999/xlink';
  const svgSpriteElement = document.createElementNS(xmlns, 'svg');
  svgSpriteElement.setAttribute('aria-hidden', 'true');
  svgSpriteElement.setAttribute('style', 'position: absolute; width: 0; height: 0; overflow: hidden;');
  svgSpriteElement.setAttribute('version', '1.1');
  svgSpriteElement.setAttribute('xmlns', xmlns);
  svgSpriteElement.setAttribute('xmlns:xlink', xlink);
  svgSpriteElement.innerHTML = ['<defs>', ...Object.values(icons), '</defs>'].join('');
  document.body.appendChild(svgSpriteElement);
  const renderIcon = (iconId, ...classList) => {
    const svgElement = document.createElementNS(xmlns, 'svg');
    const useElement = document.createElementNS(xmlns, 'use');
    svgElement.classList.add(iconStyle.icon, ...classList);
    useElement.setAttributeNS(xlink, 'href', `#${iconIds[iconId]}`);
    svgElement.appendChild(useElement);
    return svgElement;
  };

  var title$1 = "开始开发你的脚本吧～";
  var zhJSON = {
  	title: title$1,
  	"support-es": "支持 ESNext",
  	"support-css": "支持 CSS Modules（如果需要 scss，安装 node-sass 即可使用）",
  	"support-static": "支持静态资源（图片和SVG）",
  	"support-svg-sprite": "支持 SVG 雪碧图",
  	"support-locale": "支持国际化",
  	"support-plugin": "内部由 rollup 支撑，可以通过插件做扩展",
  	"got-it": "了解了"
  };

  var title = "Start create awesome userscript";
  var enJSON = {
  	title: title,
  	"support-es": "Support ESNext",
  	"support-css": "Support CSS Modules (Install node-sass package to enable scss)",
  	"support-static": "Support static resources(image, svg)",
  	"support-svg-sprite": "Support SVG Sprite",
  	"support-locale": "Support locale languages",
  	"support-plugin": "Build with Rollup, you can add external plugins",
  	"got-it": "Got It"
  };

  let localeMessage = {};
  const setLocale = lang => {
    localeMessage = lang === 'zh-CN' ? zhJSON : enJSON;
  };
  setLocale(navigator.language ?? navigator.languages?.[0]);
  function t (key) {
    return localeMessage[key] ?? '';
  }

  const container = document.createElement('div');
  container.classList.add(style.container);
  const imgEl = document.createElement('img');
  imgEl.setAttribute('src', img);
  imgEl.classList.add(style.logo);
  container.appendChild(imgEl);
  const mainEl = document.createElement('main');
  mainEl.innerHTML = `<h1>${t('title').toUpperCase()}</h1>` + `<ul class=${style.supports}>
  ${['support-es', 'support-css', 'support-static', 'support-svg-sprite', 'support-locale', 'support-plugin'].map(key => `<li>${renderIcon('check', style.check).outerHTML}${t(key)}</li>`).join('\n')}
  </ul>
  `;
  container.appendChild(mainEl);
  const getItButton = document.createElement('div');
  getItButton.textContent = t('got-it');
  getItButton.classList.add(style.button);
  container.appendChild(getItButton);
  getItButton.addEventListener('click', () => {
    container.classList.add(style.hide);
  });
  document.body.appendChild(container);

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5kZXYudXNlci5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWluamVjdC9kaXN0L3N0eWxlLWluamVjdC5lcy5qcyIsIi4uL3NyYy9pbWFnZXMvdGFtcGVybW9ua2V5LnN2ZyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZmFpbHMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVzY3JpcHRvcnMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWNhbGxhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtYnVpbHQtaW4uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24uanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91c2Utc3ltYm9sLWFzLXVpZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1zeW1ib2wuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdHJ5LXRvLXN0cmluZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLWNhbGxhYmxlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1tZXRob2QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NldC1nbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1vYmplY3QuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy91aWQuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJpbWl0aXZlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pZTgtZG9tLWRlZmluZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FuLW9iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtd2Vhay1tYXAuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2hhcmVkLWtleS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1uYW1lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZGVmaW5lLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWludGVnZXItb3ItaW5maW5pdHkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tbGVuZ3RoLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2xlbmd0aC1vZi1hcnJheS1saWtlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1rZXlzLWludGVybmFsLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VudW0tYnVnLWtleXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vd24ta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3B5LWNvbnN0cnVjdG9yLXByb3BlcnRpZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtZm9yY2VkLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2V4cG9ydC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hbi1pbnN0YW5jZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3Qta2V5cy5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaHRtbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtY3JlYXRlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcnJlY3QtcHJvdG90eXBlLWdldHRlci5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LXByb3RvdHlwZS1vZi5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRvcnMtY29yZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXNuZXh0Lml0ZXJhdG9yLmNvbnN0cnVjdG9yLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZGVmaW5lLWFsbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRvci1jcmVhdGUtcHJveHkuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXRlcmF0b3ItY2xvc2UuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2FsbC13aXRoLXNhZmUtaXRlcmF0aW9uLWNsb3NpbmcuanMiLCIuLi9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzbmV4dC5pdGVyYXRvci5tYXAuanMiLCIuLi9zcmMvc3ZnL3Nwcml0ZS50cyIsIi4uL3NyYy9sb2NhbGVzL2luZGV4LnRzIiwiLi4vc3JjL21haW4udHMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc3R5bGVJbmplY3QoY3NzLCByZWYpIHtcbiAgaWYgKCByZWYgPT09IHZvaWQgMCApIHJlZiA9IHt9O1xuICB2YXIgaW5zZXJ0QXQgPSByZWYuaW5zZXJ0QXQ7XG5cbiAgaWYgKCFjc3MgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJykgeyByZXR1cm47IH1cblxuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG5cbiAgaWYgKGluc2VydEF0ID09PSAndG9wJykge1xuICAgIGlmIChoZWFkLmZpcnN0Q2hpbGQpIHtcbiAgICAgIGhlYWQuaW5zZXJ0QmVmb3JlKHN0eWxlLCBoZWFkLmZpcnN0Q2hpbGQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIH1cblxuICBpZiAoc3R5bGUuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlLnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzdHlsZUluamVjdDtcbiIsInZhciBpbWcgPSBcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM2Nzdmcgcm9sZT0naW1nJyB2aWV3Qm94PScwIDAgMjQgMjQnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM2UgJTNjdGl0bGUlM2VUYW1wZXJtb25rZXklM2MvdGl0bGUlM2UgJTNjcGF0aCBkPSdNNS45NTUuMDAyQzMtLjA3MS4yNzUgMi4zODYuMDQzIDUuMzM1Yy0uMDY5IDMuMzItLjAxMSA2LjY0Ni0uMDMgOS45NjkuMDYgMS44Ny0uMjc2IDMuODczLjcxNSA1LjU3MyAxLjA4MyAyLjA3NiAzLjQ1NiAzLjI4OCA1Ljc3IDMuMTA1IDQuMDAzLS4wMTEgOC4wMDguMDIyIDEyLjAxMS0uMDE3IDIuOTUzLS4xNTYgNS40NzgtMi44MTUgNS40ODItNS43NzItLjAwNy00LjIzNS4wMjMtOC40NzMtLjAxNS0xMi43MDhDMjMuODIgMi41MzMgMjEuMTYuMDA3IDE4LjIwNS4wMDNjLTQuMDgzLS4wMDUtOC4xNjcgMC0xMi4yNS0uMDAyem0uNDQ3IDEyLjY4M2MyLjMzMy0uMDQ2IDQuNTA2IDEuODA1IDQuODMgNC4xMTYuNDEyIDIuMjg3LTEuMDU2IDQuNzE2LTMuMjc0IDUuNDExLTIuMTg3Ljc4My00LjgyNS0uMjY4LTUuODc0LTIuMzQxLTEuMTM3LTIuMDM5LS41Mi00LjgyNyAxLjM3LTYuMTk3YTQuODk2IDQuODk2IDAgMDEyLjk0OC0uOTl6bTExLjI0NSAwYzIuMzMzLS4wNDYgNC41MDUgMS44MDUgNC44MjkgNC4xMTYuNDEzIDIuMjg3LTEuMDU2IDQuNzE2LTMuMjczIDUuNDExLTIuMTg4Ljc4My00LjgyNS0uMjY4LTUuODc1LTIuMzQxLTEuMTM2LTIuMDM5LS41Mi00LjgyNyAxLjM3LTYuMTk3YTQuODk2IDQuODk2IDAgMDEyLjk0OS0uOTl6JyAvJTNlJTNjL3N2ZyUzZVwiO1xuICBleHBvcnQgZGVmYXVsdCBpbWc7IiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZ2xvYmFsLXRoaXMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAtLSBzYWZlXG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMgLS0gZmFsbGJhY2tcbiAgKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pKCkgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gRGV0ZWN0IElFOCdzIGluY29tcGxldGUgZGVmaW5lUHJvcGVydHkgaW1wbGVtZW50YXRpb25cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAxLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KVsxXSAhPSA3O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gTmFzaG9ybiB+IEpESzggYnVnXG52YXIgTkFTSE9STl9CVUcgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgJiYgISRwcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHsgMTogMiB9LCAxKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGVgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnByb3BlcnR5aXNlbnVtZXJhYmxlXG5leHBvcnRzLmYgPSBOQVNIT1JOX0JVRyA/IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKFYpIHtcbiAgdmFyIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGhpcywgVik7XG4gIHJldHVybiAhIWRlc2NyaXB0b3IgJiYgZGVzY3JpcHRvci5lbnVtZXJhYmxlO1xufSA6ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbnZhciBzcGxpdCA9ICcnLnNwbGl0O1xuXG4vLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xubW9kdWxlLmV4cG9ydHMgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHRocm93cyBhbiBlcnJvciBpbiByaGlubywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3JoaW5vL2lzc3Vlcy8zNDZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiAhT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCk7XG59KSA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY2xhc3NvZihpdCkgPT0gJ1N0cmluZycgPyBzcGxpdC5jYWxsKGl0LCAnJykgOiBPYmplY3QoaXQpO1xufSA6IE9iamVjdDtcbiIsIi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIEluZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5kZXhlZC1vYmplY3QnKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSW5kZXhlZE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGl0KSk7XG59O1xuIiwiLy8gYElzQ2FsbGFibGVgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc2NhbGxhYmxlXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gdHlwZW9mIGFyZ3VtZW50ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsInZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiBpc0NhbGxhYmxlKGl0KTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcblxudmFyIGFGdW5jdGlvbiA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gaXNDYWxsYWJsZShhcmd1bWVudCkgPyBhcmd1bWVudCA6IHVuZGVmaW5lZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWVzcGFjZSwgbWV0aG9kKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoIDwgMiA/IGFGdW5jdGlvbihnbG9iYWxbbmFtZXNwYWNlXSkgOiBnbG9iYWxbbmFtZXNwYWNlXSAmJiBnbG9iYWxbbmFtZXNwYWNlXVttZXRob2RdO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ25hdmlnYXRvcicsICd1c2VyQWdlbnQnKSB8fCAnJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgRGVubyA9IGdsb2JhbC5EZW5vO1xudmFyIHZlcnNpb25zID0gcHJvY2VzcyAmJiBwcm9jZXNzLnZlcnNpb25zIHx8IERlbm8gJiYgRGVuby52ZXJzaW9uO1xudmFyIHY4ID0gdmVyc2lvbnMgJiYgdmVyc2lvbnMudjg7XG52YXIgbWF0Y2gsIHZlcnNpb247XG5cbmlmICh2OCkge1xuICBtYXRjaCA9IHY4LnNwbGl0KCcuJyk7XG4gIHZlcnNpb24gPSBtYXRjaFswXSA8IDQgPyAxIDogbWF0Y2hbMF0gKyBtYXRjaFsxXTtcbn0gZWxzZSBpZiAodXNlckFnZW50KSB7XG4gIG1hdGNoID0gdXNlckFnZW50Lm1hdGNoKC9FZGdlXFwvKFxcZCspLyk7XG4gIGlmICghbWF0Y2ggfHwgbWF0Y2hbMV0gPj0gNzQpIHtcbiAgICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvQ2hyb21lXFwvKFxcZCspLyk7XG4gICAgaWYgKG1hdGNoKSB2ZXJzaW9uID0gbWF0Y2hbMV07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2ZXJzaW9uICYmICt2ZXJzaW9uO1xuIiwiLyogZXNsaW50LWRpc2FibGUgZXMvbm8tc3ltYm9sIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgVjhfVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbicpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlzeW1ib2xzIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG5tb2R1bGUuZXhwb3J0cyA9ICEhT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgc3ltYm9sID0gU3ltYm9sKCk7XG4gIC8vIENocm9tZSAzOCBTeW1ib2wgaGFzIGluY29ycmVjdCB0b1N0cmluZyBjb252ZXJzaW9uXG4gIC8vIGBnZXQtb3duLXByb3BlcnR5LXN5bWJvbHNgIHBvbHlmaWxsIHN5bWJvbHMgY29udmVydGVkIHRvIG9iamVjdCBhcmUgbm90IFN5bWJvbCBpbnN0YW5jZXNcbiAgcmV0dXJuICFTdHJpbmcoc3ltYm9sKSB8fCAhKE9iamVjdChzeW1ib2wpIGluc3RhbmNlb2YgU3ltYm9sKSB8fFxuICAgIC8vIENocm9tZSAzOC00MCBzeW1ib2xzIGFyZSBub3QgaW5oZXJpdGVkIGZyb20gRE9NIGNvbGxlY3Rpb25zIHByb3RvdHlwZXMgdG8gaW5zdGFuY2VzXG4gICAgIVN5bWJvbC5zaGFtICYmIFY4X1ZFUlNJT04gJiYgVjhfVkVSU0lPTiA8IDQxO1xufSk7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBlcy9uby1zeW1ib2wgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmcgKi9cbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfU1lNQk9MXG4gICYmICFTeW1ib2wuc2hhbVxuICAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnO1xuIiwidmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIFVTRV9TWU1CT0xfQVNfVUlEID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVVNFX1NZTUJPTF9BU19VSUQgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyICRTeW1ib2wgPSBnZXRCdWlsdEluKCdTeW1ib2wnKTtcbiAgcmV0dXJuIGlzQ2FsbGFibGUoJFN5bWJvbCkgJiYgT2JqZWN0KGl0KSBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gU3RyaW5nKGFyZ3VtZW50KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZXR1cm4gJ09iamVjdCc7XG4gIH1cbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHRyeVRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RyeS10by1zdHJpbmcnKTtcblxuLy8gYEFzc2VydDogSXNDYWxsYWJsZShhcmd1bWVudCkgaXMgdHJ1ZWBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIGlmIChpc0NhbGxhYmxlKGFyZ3VtZW50KSkgcmV0dXJuIGFyZ3VtZW50O1xuICB0aHJvdyBUeXBlRXJyb3IodHJ5VG9TdHJpbmcoYXJndW1lbnQpICsgJyBpcyBub3QgYSBmdW5jdGlvbicpO1xufTtcbiIsInZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xuXG4vLyBgR2V0TWV0aG9kYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0bWV0aG9kXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChWLCBQKSB7XG4gIHZhciBmdW5jID0gVltQXTtcbiAgcmV0dXJuIGZ1bmMgPT0gbnVsbCA/IHVuZGVmaW5lZCA6IGFDYWxsYWJsZShmdW5jKTtcbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG4vLyBgT3JkaW5hcnlUb1ByaW1pdGl2ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9yZGluYXJ5dG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAocHJlZiA9PT0gJ3N0cmluZycgJiYgaXNDYWxsYWJsZShmbiA9IGlucHV0LnRvU3RyaW5nKSAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpbnB1dCkpKSByZXR1cm4gdmFsO1xuICBpZiAoaXNDYWxsYWJsZShmbiA9IGlucHV0LnZhbHVlT2YpICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChwcmVmICE9PSAnc3RyaW5nJyAmJiBpc0NhbGxhYmxlKGZuID0gaW5wdXQudG9TdHJpbmcpICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBnbG9iYWxba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG5cbnZhciBTSEFSRUQgPSAnX19jb3JlLWpzX3NoYXJlZF9fJztcbnZhciBzdG9yZSA9IGdsb2JhbFtTSEFSRURdIHx8IHNldEdsb2JhbChTSEFSRUQsIHt9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yZTtcbiIsInZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcbnZhciBzdG9yZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQtc3RvcmUnKTtcblxuKG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIHN0b3JlW2tleV0gfHwgKHN0b3JlW2tleV0gPSB2YWx1ZSAhPT0gdW5kZWZpbmVkID8gdmFsdWUgOiB7fSk7XG59KSgndmVyc2lvbnMnLCBbXSkucHVzaCh7XG4gIHZlcnNpb246ICczLjE4LjMnLFxuICBtb2RlOiBJU19QVVJFID8gJ3B1cmUnIDogJ2dsb2JhbCcsXG4gIGNvcHlyaWdodDogJ8KpIDIwMjEgRGVuaXMgUHVzaGthcmV2ICh6bG9pcm9jay5ydSknXG59KTtcbiIsInZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xuXG4vLyBgVG9PYmplY3RgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b29iamVjdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIE9iamVjdChyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KSk7XG59O1xuIiwidmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xuXG52YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gYEhhc093blByb3BlcnR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtaGFzb3ducHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0Lmhhc093biB8fCBmdW5jdGlvbiBoYXNPd24oaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbCh0b09iamVjdChpdCksIGtleSk7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBwb3N0Zml4ID0gTWF0aC5yYW5kb20oKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcgKyBTdHJpbmcoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSkgKyAnKV8nICsgKCsraWQgKyBwb3N0Zml4KS50b1N0cmluZygzNik7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkJyk7XG52YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG52YXIgTkFUSVZFX1NZTUJPTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtc3ltYm9sJyk7XG52YXIgVVNFX1NZTUJPTF9BU19VSUQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdXNlLXN5bWJvbC1hcy11aWQnKTtcblxudmFyIFdlbGxLbm93blN5bWJvbHNTdG9yZSA9IHNoYXJlZCgnd2tzJyk7XG52YXIgU3ltYm9sID0gZ2xvYmFsLlN5bWJvbDtcbnZhciBjcmVhdGVXZWxsS25vd25TeW1ib2wgPSBVU0VfU1lNQk9MX0FTX1VJRCA/IFN5bWJvbCA6IFN5bWJvbCAmJiBTeW1ib2wud2l0aG91dFNldHRlciB8fCB1aWQ7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgaWYgKCFoYXNPd24oV2VsbEtub3duU3ltYm9sc1N0b3JlLCBuYW1lKSB8fCAhKE5BVElWRV9TWU1CT0wgfHwgdHlwZW9mIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9PSAnc3RyaW5nJykpIHtcbiAgICBpZiAoTkFUSVZFX1NZTUJPTCAmJiBoYXNPd24oU3ltYm9sLCBuYW1lKSkge1xuICAgICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gU3ltYm9sW25hbWVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPSBjcmVhdGVXZWxsS25vd25TeW1ib2woJ1N5bWJvbC4nICsgbmFtZSk7XG4gICAgfVxuICB9IHJldHVybiBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV07XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGlzU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXN5bWJvbCcpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG52YXIgb3JkaW5hcnlUb1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1BSSU1JVElWRSA9IHdlbGxLbm93blN5bWJvbCgndG9QcmltaXRpdmUnKTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpIHx8IGlzU3ltYm9sKGlucHV0KSkgcmV0dXJuIGlucHV0O1xuICB2YXIgZXhvdGljVG9QcmltID0gZ2V0TWV0aG9kKGlucHV0LCBUT19QUklNSVRJVkUpO1xuICB2YXIgcmVzdWx0O1xuICBpZiAoZXhvdGljVG9QcmltKSB7XG4gICAgaWYgKHByZWYgPT09IHVuZGVmaW5lZCkgcHJlZiA9ICdkZWZhdWx0JztcbiAgICByZXN1bHQgPSBleG90aWNUb1ByaW0uY2FsbChpbnB1dCwgcHJlZik7XG4gICAgaWYgKCFpc09iamVjdChyZXN1bHQpIHx8IGlzU3ltYm9sKHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xuICB9XG4gIGlmIChwcmVmID09PSB1bmRlZmluZWQpIHByZWYgPSAnbnVtYmVyJztcbiAgcmV0dXJuIG9yZGluYXJ5VG9QcmltaXRpdmUoaW5wdXQsIHByZWYpO1xufTtcbiIsInZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcblxuLy8gYFRvUHJvcGVydHlLZXlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b3Byb3BlcnR5a2V5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIga2V5ID0gdG9QcmltaXRpdmUoYXJndW1lbnQsICdzdHJpbmcnKTtcbiAgcmV0dXJuIGlzU3ltYm9sKGtleSkgPyBrZXkgOiBTdHJpbmcoa2V5KTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG52YXIgZG9jdW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBFWElTVFMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBFWElTVFMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudCcpO1xuXG4vLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFERVNDUklQVE9SUyAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHJlcXVpZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShjcmVhdGVFbGVtZW50KCdkaXYnKSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9XG4gIH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG4vLyBgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcmAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3JcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0luZGV4ZWRPYmplY3QoTyk7XG4gIFAgPSB0b1Byb3BlcnR5S2V5KFApO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhc093bihPLCBQKSkgcmV0dXJuIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcighcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbi8vIGBBc3NlcnQ6IFR5cGUoYXJndW1lbnQpIGlzIE9iamVjdGBcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIGlmIChpc09iamVjdChhcmd1bWVudCkpIHJldHVybiBhcmd1bWVudDtcbiAgdGhyb3cgVHlwZUVycm9yKFN0cmluZyhhcmd1bWVudCkgKyAnIGlzIG5vdCBhbiBvYmplY3QnKTtcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pZTgtZG9tLWRlZmluZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIHRvUHJvcGVydHlLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5Jyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gc2FmZVxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuZXhwb3J0cy5mID0gREVTQ1JJUFRPUlMgPyAkZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gJGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnRvU3RyaW5nO1xuXG4vLyB0aGlzIGhlbHBlciBicm9rZW4gaW4gYGNvcmUtanNAMy40LjEtMy40LjRgLCBzbyB3ZSBjYW4ndCB1c2UgYHNoYXJlZGAgaGVscGVyXG5pZiAoIWlzQ2FsbGFibGUoc3RvcmUuaW5zcGVjdFNvdXJjZSkpIHtcbiAgc3RvcmUuaW5zcGVjdFNvdXJjZSA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBmdW5jdGlvblRvU3RyaW5nLmNhbGwoaXQpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JlLmluc3BlY3RTb3VyY2U7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG5cbnZhciBXZWFrTWFwID0gZ2xvYmFsLldlYWtNYXA7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNDYWxsYWJsZShXZWFrTWFwKSAmJiAvbmF0aXZlIGNvZGUvLnRlc3QoaW5zcGVjdFNvdXJjZShXZWFrTWFwKSk7XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZCcpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcblxudmFyIGtleXMgPSBzaGFyZWQoJ2tleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBrZXlzW2tleV0gfHwgKGtleXNba2V5XSA9IHVpZChrZXkpKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwidmFyIE5BVElWRV9XRUFLX01BUCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtd2Vhay1tYXAnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgc2hhcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xudmFyIHNoYXJlZEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQta2V5Jyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oaWRkZW4ta2V5cycpO1xuXG52YXIgT0JKRUNUX0FMUkVBRFlfSU5JVElBTElaRUQgPSAnT2JqZWN0IGFscmVhZHkgaW5pdGlhbGl6ZWQnO1xudmFyIFdlYWtNYXAgPSBnbG9iYWwuV2Vha01hcDtcbnZhciBzZXQsIGdldCwgaGFzO1xuXG52YXIgZW5mb3JjZSA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaGFzKGl0KSA/IGdldChpdCkgOiBzZXQoaXQsIHt9KTtcbn07XG5cbnZhciBnZXR0ZXJGb3IgPSBmdW5jdGlvbiAoVFlQRSkge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0KSB7XG4gICAgdmFyIHN0YXRlO1xuICAgIGlmICghaXNPYmplY3QoaXQpIHx8IChzdGF0ZSA9IGdldChpdCkpLnR5cGUgIT09IFRZUEUpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQnKTtcbiAgICB9IHJldHVybiBzdGF0ZTtcbiAgfTtcbn07XG5cbmlmIChOQVRJVkVfV0VBS19NQVAgfHwgc2hhcmVkLnN0YXRlKSB7XG4gIHZhciBzdG9yZSA9IHNoYXJlZC5zdGF0ZSB8fCAoc2hhcmVkLnN0YXRlID0gbmV3IFdlYWtNYXAoKSk7XG4gIHZhciB3bWdldCA9IHN0b3JlLmdldDtcbiAgdmFyIHdtaGFzID0gc3RvcmUuaGFzO1xuICB2YXIgd21zZXQgPSBzdG9yZS5zZXQ7XG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICBpZiAod21oYXMuY2FsbChzdG9yZSwgaXQpKSB0aHJvdyBuZXcgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICB3bXNldC5jYWxsKHN0b3JlLCBpdCwgbWV0YWRhdGEpO1xuICAgIHJldHVybiBtZXRhZGF0YTtcbiAgfTtcbiAgZ2V0ID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtZ2V0LmNhbGwoc3RvcmUsIGl0KSB8fCB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIHdtaGFzLmNhbGwoc3RvcmUsIGl0KTtcbiAgfTtcbn0gZWxzZSB7XG4gIHZhciBTVEFURSA9IHNoYXJlZEtleSgnc3RhdGUnKTtcbiAgaGlkZGVuS2V5c1tTVEFURV0gPSB0cnVlO1xuICBzZXQgPSBmdW5jdGlvbiAoaXQsIG1ldGFkYXRhKSB7XG4gICAgaWYgKGhhc093bihpdCwgU1RBVEUpKSB0aHJvdyBuZXcgVHlwZUVycm9yKE9CSkVDVF9BTFJFQURZX0lOSVRJQUxJWkVEKTtcbiAgICBtZXRhZGF0YS5mYWNhZGUgPSBpdDtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoaXQsIFNUQVRFLCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gaGFzT3duKGl0LCBTVEFURSkgPyBpdFtTVEFURV0gOiB7fTtcbiAgfTtcbiAgaGFzID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGhhc093bihpdCwgU1RBVEUpO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXQsXG4gIGdldDogZ2V0LFxuICBoYXM6IGhhcyxcbiAgZW5mb3JjZTogZW5mb3JjZSxcbiAgZ2V0dGVyRm9yOiBnZXR0ZXJGb3Jcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5ZGVzY3JpcHRvciAtLSBzYWZlXG52YXIgZ2V0RGVzY3JpcHRvciA9IERFU0NSSVBUT1JTICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbnZhciBFWElTVFMgPSBoYXNPd24oRnVuY3Rpb25Qcm90b3R5cGUsICduYW1lJyk7XG4vLyBhZGRpdGlvbmFsIHByb3RlY3Rpb24gZnJvbSBtaW5pZmllZCAvIG1hbmdsZWQgLyBkcm9wcGVkIGZ1bmN0aW9uIG5hbWVzXG52YXIgUFJPUEVSID0gRVhJU1RTICYmIChmdW5jdGlvbiBzb21ldGhpbmcoKSB7IC8qIGVtcHR5ICovIH0pLm5hbWUgPT09ICdzb21ldGhpbmcnO1xudmFyIENPTkZJR1VSQUJMRSA9IEVYSVNUUyAmJiAoIURFU0NSSVBUT1JTIHx8IChERVNDUklQVE9SUyAmJiBnZXREZXNjcmlwdG9yKEZ1bmN0aW9uUHJvdG90eXBlLCAnbmFtZScpLmNvbmZpZ3VyYWJsZSkpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgRVhJU1RTOiBFWElTVFMsXG4gIFBST1BFUjogUFJPUEVSLFxuICBDT05GSUdVUkFCTEU6IENPTkZJR1VSQUJMRVxufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHNldEdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIEludGVybmFsU3RhdGVNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKTtcbnZhciBDT05GSUdVUkFCTEVfRlVOQ1RJT05fTkFNRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1uYW1lJykuQ09ORklHVVJBQkxFO1xuXG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdW5zYWZlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy51bnNhZmUgOiBmYWxzZTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuZW51bWVyYWJsZSA6IGZhbHNlO1xuICB2YXIgbm9UYXJnZXRHZXQgPSBvcHRpb25zID8gISFvcHRpb25zLm5vVGFyZ2V0R2V0IDogZmFsc2U7XG4gIHZhciBuYW1lID0gb3B0aW9ucyAmJiBvcHRpb25zLm5hbWUgIT09IHVuZGVmaW5lZCA/IG9wdGlvbnMubmFtZSA6IGtleTtcbiAgdmFyIHN0YXRlO1xuICBpZiAoaXNDYWxsYWJsZSh2YWx1ZSkpIHtcbiAgICBpZiAoU3RyaW5nKG5hbWUpLnNsaWNlKDAsIDcpID09PSAnU3ltYm9sKCcpIHtcbiAgICAgIG5hbWUgPSAnWycgKyBTdHJpbmcobmFtZSkucmVwbGFjZSgvXlN5bWJvbFxcKChbXildKilcXCkvLCAnJDEnKSArICddJztcbiAgICB9XG4gICAgaWYgKCFoYXNPd24odmFsdWUsICduYW1lJykgfHwgKENPTkZJR1VSQUJMRV9GVU5DVElPTl9OQU1FICYmIHZhbHVlLm5hbWUgIT09IG5hbWUpKSB7XG4gICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkodmFsdWUsICduYW1lJywgbmFtZSk7XG4gICAgfVxuICAgIHN0YXRlID0gZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpO1xuICAgIGlmICghc3RhdGUuc291cmNlKSB7XG4gICAgICBzdGF0ZS5zb3VyY2UgPSBURU1QTEFURS5qb2luKHR5cGVvZiBuYW1lID09ICdzdHJpbmcnID8gbmFtZSA6ICcnKTtcbiAgICB9XG4gIH1cbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIGlmIChzaW1wbGUpIE9ba2V5XSA9IHZhbHVlO1xuICAgIGVsc2Ugc2V0R2xvYmFsKGtleSwgdmFsdWUpO1xuICAgIHJldHVybjtcbiAgfSBlbHNlIGlmICghdW5zYWZlKSB7XG4gICAgZGVsZXRlIE9ba2V5XTtcbiAgfSBlbHNlIGlmICghbm9UYXJnZXRHZXQgJiYgT1trZXldKSB7XG4gICAgc2ltcGxlID0gdHJ1ZTtcbiAgfVxuICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgZWxzZSBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoTywga2V5LCB2YWx1ZSk7XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiBpc0NhbGxhYmxlKHRoaXMpICYmIGdldEludGVybmFsU3RhdGUodGhpcykuc291cmNlIHx8IGluc3BlY3RTb3VyY2UodGhpcyk7XG59KTtcbiIsInZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuLy8gYFRvSW50ZWdlck9ySW5maW5pdHlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b2ludGVnZXJvcmluZmluaXR5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIgbnVtYmVyID0gK2FyZ3VtZW50O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIHNhZmVcbiAgcmV0dXJuIG51bWJlciAhPT0gbnVtYmVyIHx8IG51bWJlciA9PT0gMCA/IDAgOiAobnVtYmVyID4gMCA/IGZsb29yIDogY2VpbCkobnVtYmVyKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyT3JJbmZpbml0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5Jyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gSGVscGVyIGZvciBhIHBvcHVsYXIgcmVwZWF0aW5nIGNhc2Ugb2YgdGhlIHNwZWM6XG4vLyBMZXQgaW50ZWdlciBiZSA/IFRvSW50ZWdlcihpbmRleCkuXG4vLyBJZiBpbnRlZ2VyIDwgMCwgbGV0IHJlc3VsdCBiZSBtYXgoKGxlbmd0aCArIGludGVnZXIpLCAwKTsgZWxzZSBsZXQgcmVzdWx0IGJlIG1pbihpbnRlZ2VyLCBsZW5ndGgpLlxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICB2YXIgaW50ZWdlciA9IHRvSW50ZWdlck9ySW5maW5pdHkoaW5kZXgpO1xuICByZXR1cm4gaW50ZWdlciA8IDAgPyBtYXgoaW50ZWdlciArIGxlbmd0aCwgMCkgOiBtaW4oaW50ZWdlciwgbGVuZ3RoKTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyT3JJbmZpbml0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyLW9yLWluZmluaXR5Jyk7XG5cbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gYFRvTGVuZ3RoYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyT3JJbmZpbml0eShhcmd1bWVudCksIDB4MUZGRkZGRkZGRkZGRkYpIDogMDsgLy8gMiAqKiA1MyAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsInZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcblxuLy8gYExlbmd0aE9mQXJyYXlMaWtlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbGVuZ3Rob2ZhcnJheWxpa2Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdG9MZW5ndGgob2JqLmxlbmd0aCk7XG59O1xuIiwidmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIGxlbmd0aE9mQXJyYXlMaWtlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2xlbmd0aC1vZi1hcnJheS1saWtlJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUueyBpbmRleE9mLCBpbmNsdWRlcyB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IGxlbmd0aE9mQXJyYXlMaWtlKE8pO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICBpZiAoKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pICYmIE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogY3JlYXRlTWV0aG9kKHRydWUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmRleG9mXG4gIGluZGV4T2Y6IGNyZWF0ZU1ldGhvZChmYWxzZSlcbn07XG4iLCJ2YXIgaGFzT3duID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcy1vd24tcHJvcGVydHknKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciBpbmRleE9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWluY2x1ZGVzJykuaW5kZXhPZjtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0luZGV4ZWRPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pICFoYXNPd24oaGlkZGVuS2V5cywga2V5KSAmJiBoYXNPd24oTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzT3duKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyBJRTgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gW1xuICAnY29uc3RydWN0b3InLFxuICAnaGFzT3duUHJvcGVydHknLFxuICAnaXNQcm90b3R5cGVPZicsXG4gICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsXG4gICd0b0xvY2FsZVN0cmluZycsXG4gICd0b1N0cmluZycsXG4gICd2YWx1ZU9mJ1xuXTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbnZhciBoaWRkZW5LZXlzID0gZW51bUJ1Z0tleXMuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbi8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5nZXRvd25wcm9wZXJ0eW5hbWVzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5bmFtZXMgLS0gc2FmZVxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiBpbnRlcm5hbE9iamVjdEtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eXN5bWJvbHMgLS0gc2FmZVxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4vLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnb3duS2V5cycpIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSkgOiBrZXlzO1xufTtcbiIsInZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIG93bktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb3duLWtleXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcbiAgdmFyIGtleXMgPSBvd25LZXlzKHNvdXJjZSk7XG4gIHZhciBkZWZpbmVQcm9wZXJ0eSA9IGRlZmluZVByb3BlcnR5TW9kdWxlLmY7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUuZjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKCFoYXNPd24odGFyZ2V0LCBrZXkpKSBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gIH1cbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBpc0NhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWNhbGxhYmxlJyk7XG5cbnZhciByZXBsYWNlbWVudCA9IC8jfFxcLnByb3RvdHlwZVxcLi87XG5cbnZhciBpc0ZvcmNlZCA9IGZ1bmN0aW9uIChmZWF0dXJlLCBkZXRlY3Rpb24pIHtcbiAgdmFyIHZhbHVlID0gZGF0YVtub3JtYWxpemUoZmVhdHVyZSldO1xuICByZXR1cm4gdmFsdWUgPT0gUE9MWUZJTEwgPyB0cnVlXG4gICAgOiB2YWx1ZSA9PSBOQVRJVkUgPyBmYWxzZVxuICAgIDogaXNDYWxsYWJsZShkZXRlY3Rpb24pID8gZmFpbHMoZGV0ZWN0aW9uKVxuICAgIDogISFkZXRlY3Rpb247XG59O1xuXG52YXIgbm9ybWFsaXplID0gaXNGb3JjZWQubm9ybWFsaXplID0gZnVuY3Rpb24gKHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cmluZykucmVwbGFjZShyZXBsYWNlbWVudCwgJy4nKS50b0xvd2VyQ2FzZSgpO1xufTtcblxudmFyIGRhdGEgPSBpc0ZvcmNlZC5kYXRhID0ge307XG52YXIgTkFUSVZFID0gaXNGb3JjZWQuTkFUSVZFID0gJ04nO1xudmFyIFBPTFlGSUxMID0gaXNGb3JjZWQuUE9MWUZJTEwgPSAnUCc7XG5cbm1vZHVsZS5leHBvcnRzID0gaXNGb3JjZWQ7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJykuZjtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMubm9UYXJnZXRHZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4gIG9wdGlvbnMubmFtZSAgICAgICAgLSB0aGUgLm5hbWUgb2YgdGhlIGZ1bmN0aW9uIGlmIGl0IGRvZXMgbm90IG1hdGNoIHRoZSBrZXlcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcHRpb25zLCBzb3VyY2UpIHtcbiAgdmFyIFRBUkdFVCA9IG9wdGlvbnMudGFyZ2V0O1xuICB2YXIgR0xPQkFMID0gb3B0aW9ucy5nbG9iYWw7XG4gIHZhciBTVEFUSUMgPSBvcHRpb25zLnN0YXQ7XG4gIHZhciBGT1JDRUQsIHRhcmdldCwga2V5LCB0YXJnZXRQcm9wZXJ0eSwgc291cmNlUHJvcGVydHksIGRlc2NyaXB0b3I7XG4gIGlmIChHTE9CQUwpIHtcbiAgICB0YXJnZXQgPSBnbG9iYWw7XG4gIH0gZWxzZSBpZiAoU1RBVElDKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsW1RBUkdFVF0gfHwgc2V0R2xvYmFsKFRBUkdFVCwge30pO1xuICB9IGVsc2Uge1xuICAgIHRhcmdldCA9IChnbG9iYWxbVEFSR0VUXSB8fCB7fSkucHJvdG90eXBlO1xuICB9XG4gIGlmICh0YXJnZXQpIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIHNvdXJjZVByb3BlcnR5ID0gc291cmNlW2tleV07XG4gICAgaWYgKG9wdGlvbnMubm9UYXJnZXRHZXQpIHtcbiAgICAgIGRlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBrZXkpO1xuICAgICAgdGFyZ2V0UHJvcGVydHkgPSBkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWU7XG4gICAgfSBlbHNlIHRhcmdldFByb3BlcnR5ID0gdGFyZ2V0W2tleV07XG4gICAgRk9SQ0VEID0gaXNGb3JjZWQoR0xPQkFMID8ga2V5IDogVEFSR0VUICsgKFNUQVRJQyA/ICcuJyA6ICcjJykgKyBrZXksIG9wdGlvbnMuZm9yY2VkKTtcbiAgICAvLyBjb250YWluZWQgaW4gdGFyZ2V0XG4gICAgaWYgKCFGT1JDRUQgJiYgdGFyZ2V0UHJvcGVydHkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBzb3VyY2VQcm9wZXJ0eSA9PT0gdHlwZW9mIHRhcmdldFByb3BlcnR5KSBjb250aW51ZTtcbiAgICAgIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMoc291cmNlUHJvcGVydHksIHRhcmdldFByb3BlcnR5KTtcbiAgICB9XG4gICAgLy8gYWRkIGEgZmxhZyB0byBub3QgY29tcGxldGVseSBmdWxsIHBvbHlmaWxsc1xuICAgIGlmIChvcHRpb25zLnNoYW0gfHwgKHRhcmdldFByb3BlcnR5ICYmIHRhcmdldFByb3BlcnR5LnNoYW0pKSB7XG4gICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoc291cmNlUHJvcGVydHksICdzaGFtJywgdHJ1ZSk7XG4gICAgfVxuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICByZWRlZmluZSh0YXJnZXQsIGtleSwgc291cmNlUHJvcGVydHksIG9wdGlvbnMpO1xuICB9XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lKSB7XG4gIGlmIChpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSByZXR1cm4gaXQ7XG4gIHRocm93IFR5cGVFcnJvcignSW5jb3JyZWN0ICcgKyAobmFtZSA/IG5hbWUgKyAnICcgOiAnJykgKyAnaW52b2NhdGlvbicpO1xufTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbi8vIGBPYmplY3Qua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5rZXlzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWtleXMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMnKTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydGllcyAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gb2JqZWN0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIGRlZmluZVByb3BlcnR5TW9kdWxlLmYoTywga2V5ID0ga2V5c1tpbmRleCsrXSwgUHJvcGVydGllc1trZXldKTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGdldEJ1aWx0SW4gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2V0LWJ1aWx0LWluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0QnVpbHRJbignZG9jdW1lbnQnLCAnZG9jdW1lbnRFbGVtZW50Jyk7XG4iLCIvKiBnbG9iYWwgQWN0aXZlWE9iamVjdCAtLSBvbGQgSUUsIFdTSCAqL1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGRlZmluZVByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0aWVzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW51bS1idWcta2V5cycpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2h0bWwnKTtcbnZhciBkb2N1bWVudENyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZG9jdW1lbnQtY3JlYXRlLWVsZW1lbnQnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xuXG52YXIgR1QgPSAnPic7XG52YXIgTFQgPSAnPCc7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG52YXIgU0NSSVBUID0gJ3NjcmlwdCc7XG52YXIgSUVfUFJPVE8gPSBzaGFyZWRLZXkoJ0lFX1BST1RPJyk7XG5cbnZhciBFbXB0eUNvbnN0cnVjdG9yID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuXG52YXIgc2NyaXB0VGFnID0gZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAgcmV0dXJuIExUICsgU0NSSVBUICsgR1QgKyBjb250ZW50ICsgTFQgKyAnLycgKyBTQ1JJUFQgKyBHVDtcbn07XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBBY3RpdmVYIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWCA9IGZ1bmN0aW9uIChhY3RpdmVYRG9jdW1lbnQpIHtcbiAgYWN0aXZlWERvY3VtZW50LndyaXRlKHNjcmlwdFRhZygnJykpO1xuICBhY3RpdmVYRG9jdW1lbnQuY2xvc2UoKTtcbiAgdmFyIHRlbXAgPSBhY3RpdmVYRG9jdW1lbnQucGFyZW50V2luZG93Lk9iamVjdDtcbiAgYWN0aXZlWERvY3VtZW50ID0gbnVsbDsgLy8gYXZvaWQgbWVtb3J5IGxlYWtcbiAgcmV0dXJuIHRlbXA7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgTnVsbFByb3RvT2JqZWN0VmlhSUZyYW1lID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gZG9jdW1lbnRDcmVhdGVFbGVtZW50KCdpZnJhbWUnKTtcbiAgdmFyIEpTID0gJ2phdmEnICsgU0NSSVBUICsgJzonO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICBodG1sLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy80NzVcbiAgaWZyYW1lLnNyYyA9IFN0cmluZyhKUyk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUoc2NyaXB0VGFnKCdkb2N1bWVudC5GPU9iamVjdCcpKTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgcmV0dXJuIGlmcmFtZURvY3VtZW50LkY7XG59O1xuXG4vLyBDaGVjayBmb3IgZG9jdW1lbnQuZG9tYWluIGFuZCBhY3RpdmUgeCBzdXBwb3J0XG4vLyBObyBuZWVkIHRvIHVzZSBhY3RpdmUgeCBhcHByb2FjaCB3aGVuIGRvY3VtZW50LmRvbWFpbiBpcyBub3Qgc2V0XG4vLyBzZWUgaHR0cHM6Ly9naXRodWIuY29tL2VzLXNoaW1zL2VzNS1zaGltL2lzc3Vlcy8xNTBcbi8vIHZhcmlhdGlvbiBvZiBodHRwczovL2dpdGh1Yi5jb20va2l0Y2FtYnJpZGdlL2VzNS1zaGltL2NvbW1pdC80ZjczOGFjMDY2MzQ2XG4vLyBhdm9pZCBJRSBHQyBidWdcbnZhciBhY3RpdmVYRG9jdW1lbnQ7XG52YXIgTnVsbFByb3RvT2JqZWN0ID0gZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIGFjdGl2ZVhEb2N1bWVudCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdodG1sZmlsZScpO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBpZ25vcmUgKi8gfVxuICBOdWxsUHJvdG9PYmplY3QgPSB0eXBlb2YgZG9jdW1lbnQgIT0gJ3VuZGVmaW5lZCdcbiAgICA/IGRvY3VtZW50LmRvbWFpbiAmJiBhY3RpdmVYRG9jdW1lbnRcbiAgICAgID8gTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpIC8vIG9sZCBJRVxuICAgICAgOiBOdWxsUHJvdG9PYmplY3RWaWFJRnJhbWUoKVxuICAgIDogTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpOyAvLyBXU0hcbiAgdmFyIGxlbmd0aCA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSBkZWxldGUgTnVsbFByb3RvT2JqZWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbbGVuZ3RoXV07XG4gIHJldHVybiBOdWxsUHJvdG9PYmplY3QoKTtcbn07XG5cbmhpZGRlbktleXNbSUVfUFJPVE9dID0gdHJ1ZTtcblxuLy8gYE9iamVjdC5jcmVhdGVgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eUNvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHlDb25zdHJ1Y3RvcigpO1xuICAgIEVtcHR5Q29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gTnVsbFByb3RvT2JqZWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gRigpIHsgLyogZW1wdHkgKi8gfVxuICBGLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IG51bGw7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0cHJvdG90eXBlb2YgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5nZXRQcm90b3R5cGVPZihuZXcgRigpKSAhPT0gRi5wcm90b3R5cGU7XG59KTtcbiIsInZhciBoYXNPd24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzLW93bi1wcm9wZXJ0eScpO1xudmFyIGlzQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtY2FsbGFibGUnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIENPUlJFQ1RfUFJPVE9UWVBFX0dFVFRFUiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXInKTtcblxudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8vIGBPYmplY3QuZ2V0UHJvdG90eXBlT2ZgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0cHJvdG90eXBlb2Zcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0cHJvdG90eXBlb2YgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBDT1JSRUNUX1BST1RPVFlQRV9HRVRURVIgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiAoTykge1xuICB2YXIgb2JqZWN0ID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXNPd24ob2JqZWN0LCBJRV9QUk9UTykpIHJldHVybiBvYmplY3RbSUVfUFJPVE9dO1xuICB2YXIgY29uc3RydWN0b3IgPSBvYmplY3QuY29uc3RydWN0b3I7XG4gIGlmIChpc0NhbGxhYmxlKGNvbnN0cnVjdG9yKSAmJiBvYmplY3QgaW5zdGFuY2VvZiBjb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBjb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIG9iamVjdCBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvdHlwZSA6IG51bGw7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtY3JlYXRlJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1lfU0FGQVJJX0lURVJBVE9SUyA9IGZhbHNlO1xuXG4vLyBgJUl0ZXJhdG9yUHJvdG90eXBlJWAgb2JqZWN0XG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVpdGVyYXRvcnByb3RvdHlwZSUtb2JqZWN0XG52YXIgSXRlcmF0b3JQcm90b3R5cGUsIFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSwgYXJyYXlJdGVyYXRvcjtcblxuLyogZXNsaW50LWRpc2FibGUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWtleXMgLS0gc2FmZSAqL1xuaWYgKFtdLmtleXMpIHtcbiAgYXJyYXlJdGVyYXRvciA9IFtdLmtleXMoKTtcbiAgLy8gU2FmYXJpIDggaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gIGlmICghKCduZXh0JyBpbiBhcnJheUl0ZXJhdG9yKSkgQlVHR1lfU0FGQVJJX0lURVJBVE9SUyA9IHRydWU7XG4gIGVsc2Uge1xuICAgIFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKGdldFByb3RvdHlwZU9mKGFycmF5SXRlcmF0b3IpKTtcbiAgICBpZiAoUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKSBJdGVyYXRvclByb3RvdHlwZSA9IFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxufVxuXG52YXIgTkVXX0lURVJBVE9SX1BST1RPVFlQRSA9IEl0ZXJhdG9yUHJvdG90eXBlID09IHVuZGVmaW5lZCB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciB0ZXN0ID0ge307XG4gIC8vIEZGNDQtIGxlZ2FjeSBpdGVyYXRvcnMgY2FzZVxuICByZXR1cm4gSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdLmNhbGwodGVzdCkgIT09IHRlc3Q7XG59KTtcblxuaWYgKE5FV19JVEVSQVRPUl9QUk9UT1RZUEUpIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5lbHNlIGlmIChJU19QVVJFKSBJdGVyYXRvclByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG5cbi8vIGAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0laXRlcmF0b3Jwcm90b3R5cGUlLUBAaXRlcmF0b3JcbmlmICghaXNDYWxsYWJsZShJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0pKSB7XG4gIHJlZGVmaW5lKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9KTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIEl0ZXJhdG9yUHJvdG90eXBlOiBJdGVyYXRvclByb3RvdHlwZSxcbiAgQlVHR1lfU0FGQVJJX0lURVJBVE9SUzogQlVHR1lfU0FGQVJJX0lURVJBVE9SU1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLWl0ZXJhdG9yLWhlbHBlcnNcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLWluc3RhbmNlJyk7XG52YXIgaXNDYWxsYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1jYWxsYWJsZScpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGhhc093biA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMtb3duLXByb3BlcnR5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzLWNvcmUnKS5JdGVyYXRvclByb3RvdHlwZTtcbnZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG5cbnZhciBOYXRpdmVJdGVyYXRvciA9IGdsb2JhbC5JdGVyYXRvcjtcblxuLy8gRkY1Ni0gaGF2ZSBub24tc3RhbmRhcmQgZ2xvYmFsIGhlbHBlciBgSXRlcmF0b3JgXG52YXIgRk9SQ0VEID0gSVNfUFVSRVxuICB8fCAhaXNDYWxsYWJsZShOYXRpdmVJdGVyYXRvcilcbiAgfHwgTmF0aXZlSXRlcmF0b3IucHJvdG90eXBlICE9PSBJdGVyYXRvclByb3RvdHlwZVxuICAvLyBGRjQ0LSBub24tc3RhbmRhcmQgYEl0ZXJhdG9yYCBwYXNzZXMgcHJldmlvdXMgdGVzdHNcbiAgfHwgIWZhaWxzKGZ1bmN0aW9uICgpIHsgTmF0aXZlSXRlcmF0b3Ioe30pOyB9KTtcblxudmFyIEl0ZXJhdG9yQ29uc3RydWN0b3IgPSBmdW5jdGlvbiBJdGVyYXRvcigpIHtcbiAgYW5JbnN0YW5jZSh0aGlzLCBJdGVyYXRvckNvbnN0cnVjdG9yKTtcbn07XG5cbmlmICghaGFzT3duKEl0ZXJhdG9yUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHKSkge1xuICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoSXRlcmF0b3JQcm90b3R5cGUsIFRPX1NUUklOR19UQUcsICdJdGVyYXRvcicpO1xufVxuXG5pZiAoRk9SQ0VEIHx8ICFoYXNPd24oSXRlcmF0b3JQcm90b3R5cGUsICdjb25zdHJ1Y3RvcicpIHx8IEl0ZXJhdG9yUHJvdG90eXBlLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEl0ZXJhdG9yUHJvdG90eXBlLCAnY29uc3RydWN0b3InLCBJdGVyYXRvckNvbnN0cnVjdG9yKTtcbn1cblxuSXRlcmF0b3JDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBJdGVyYXRvclByb3RvdHlwZTtcblxuJCh7IGdsb2JhbDogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICBJdGVyYXRvcjogSXRlcmF0b3JDb25zdHJ1Y3RvclxufSk7XG4iLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIG9wdGlvbnMpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYUNhbGxhYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtY2FsbGFibGUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZS1hbGwnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJbnRlcm5hbFN0YXRlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlJyk7XG52YXIgZ2V0TWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1tZXRob2QnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvcnMtY29yZScpLkl0ZXJhdG9yUHJvdG90eXBlO1xuXG52YXIgc2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuc2V0O1xudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldDtcblxudmFyIFRPX1NUUklOR19UQUcgPSB3ZWxsS25vd25TeW1ib2woJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5leHRIYW5kbGVyLCBJU19JVEVSQVRPUikge1xuICB2YXIgSXRlcmF0b3JQcm94eSA9IGZ1bmN0aW9uIEl0ZXJhdG9yKHN0YXRlKSB7XG4gICAgc3RhdGUubmV4dCA9IGFDYWxsYWJsZShzdGF0ZS5pdGVyYXRvci5uZXh0KTtcbiAgICBzdGF0ZS5kb25lID0gZmFsc2U7XG4gICAgc3RhdGUuaWdub3JlQXJnID0gIUlTX0lURVJBVE9SO1xuICAgIHNldEludGVybmFsU3RhdGUodGhpcywgc3RhdGUpO1xuICB9O1xuXG4gIEl0ZXJhdG9yUHJveHkucHJvdG90eXBlID0gcmVkZWZpbmVBbGwoY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlKSwge1xuICAgIG5leHQ6IGZ1bmN0aW9uIG5leHQoYXJnKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoID8gW3N0YXRlLmlnbm9yZUFyZyA/IHVuZGVmaW5lZCA6IGFyZ10gOiBJU19JVEVSQVRPUiA/IFtdIDogW3VuZGVmaW5lZF07XG4gICAgICBzdGF0ZS5pZ25vcmVBcmcgPSBmYWxzZTtcbiAgICAgIHZhciByZXN1bHQgPSBzdGF0ZS5kb25lID8gdW5kZWZpbmVkIDogbmV4dEhhbmRsZXIuY2FsbChzdGF0ZSwgYXJncyk7XG4gICAgICByZXR1cm4geyBkb25lOiBzdGF0ZS5kb25lLCB2YWx1ZTogcmVzdWx0IH07XG4gICAgfSxcbiAgICAncmV0dXJuJzogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgdmFyIGl0ZXJhdG9yID0gc3RhdGUuaXRlcmF0b3I7XG4gICAgICBzdGF0ZS5kb25lID0gdHJ1ZTtcbiAgICAgIHZhciAkJHJldHVybiA9IGdldE1ldGhvZChpdGVyYXRvciwgJ3JldHVybicpO1xuICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6ICQkcmV0dXJuID8gYW5PYmplY3QoJCRyZXR1cm4uY2FsbChpdGVyYXRvciwgdmFsdWUpKS52YWx1ZSA6IHZhbHVlIH07XG4gICAgfSxcbiAgICAndGhyb3cnOiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBzdGF0ZS5pdGVyYXRvcjtcbiAgICAgIHN0YXRlLmRvbmUgPSB0cnVlO1xuICAgICAgdmFyICQkdGhyb3cgPSBnZXRNZXRob2QoaXRlcmF0b3IsICd0aHJvdycpO1xuICAgICAgaWYgKCQkdGhyb3cpIHJldHVybiAkJHRocm93LmNhbGwoaXRlcmF0b3IsIHZhbHVlKTtcbiAgICAgIHRocm93IHZhbHVlO1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKCFJU19JVEVSQVRPUikge1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShJdGVyYXRvclByb3h5LnByb3RvdHlwZSwgVE9fU1RSSU5HX1RBRywgJ0dlbmVyYXRvcicpO1xuICB9XG5cbiAgcmV0dXJuIEl0ZXJhdG9yUHJveHk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGdldE1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtbWV0aG9kJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBraW5kLCB2YWx1ZSkge1xuICB2YXIgaW5uZXJSZXN1bHQsIGlubmVyRXJyb3I7XG4gIGFuT2JqZWN0KGl0ZXJhdG9yKTtcbiAgdHJ5IHtcbiAgICBpbm5lclJlc3VsdCA9IGdldE1ldGhvZChpdGVyYXRvciwgJ3JldHVybicpO1xuICAgIGlmICghaW5uZXJSZXN1bHQpIHtcbiAgICAgIGlmIChraW5kID09PSAndGhyb3cnKSB0aHJvdyB2YWx1ZTtcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gICAgaW5uZXJSZXN1bHQgPSBpbm5lclJlc3VsdC5jYWxsKGl0ZXJhdG9yKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpbm5lckVycm9yID0gdHJ1ZTtcbiAgICBpbm5lclJlc3VsdCA9IGVycm9yO1xuICB9XG4gIGlmIChraW5kID09PSAndGhyb3cnKSB0aHJvdyB2YWx1ZTtcbiAgaWYgKGlubmVyRXJyb3IpIHRocm93IGlubmVyUmVzdWx0O1xuICBhbk9iamVjdChpbm5lclJlc3VsdCk7XG4gIHJldHVybiB2YWx1ZTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgaXRlcmF0b3JDbG9zZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvci1jbG9zZScpO1xuXG4vLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBFTlRSSUVTKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEVOVFJJRVMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCAndGhyb3cnLCBlcnJvcik7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1pdGVyYXRvci1oZWxwZXJzXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBhQ2FsbGFibGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1jYWxsYWJsZScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGNyZWF0ZUl0ZXJhdG9yUHJveHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3ItY3JlYXRlLXByb3h5Jyk7XG52YXIgY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jYWxsLXdpdGgtc2FmZS1pdGVyYXRpb24tY2xvc2luZycpO1xuXG52YXIgSXRlcmF0b3JQcm94eSA9IGNyZWF0ZUl0ZXJhdG9yUHJveHkoZnVuY3Rpb24gKGFyZ3MpIHtcbiAgdmFyIGl0ZXJhdG9yID0gdGhpcy5pdGVyYXRvcjtcbiAgdmFyIHJlc3VsdCA9IGFuT2JqZWN0KHRoaXMubmV4dC5hcHBseShpdGVyYXRvciwgYXJncykpO1xuICB2YXIgZG9uZSA9IHRoaXMuZG9uZSA9ICEhcmVzdWx0LmRvbmU7XG4gIGlmICghZG9uZSkgcmV0dXJuIGNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmcoaXRlcmF0b3IsIHRoaXMubWFwcGVyLCByZXN1bHQudmFsdWUpO1xufSk7XG5cbiQoeyB0YXJnZXQ6ICdJdGVyYXRvcicsIHByb3RvOiB0cnVlLCByZWFsOiB0cnVlIH0sIHtcbiAgbWFwOiBmdW5jdGlvbiBtYXAobWFwcGVyKSB7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvclByb3h5KHtcbiAgICAgIGl0ZXJhdG9yOiBhbk9iamVjdCh0aGlzKSxcbiAgICAgIG1hcHBlcjogYUNhbGxhYmxlKG1hcHBlcilcbiAgICB9KTtcbiAgfVxufSk7XG4iLCJpbXBvcnQgY2hlY2sgZnJvbSAnLi9jaGVjay5zdmcnXG5pbXBvcnQgaWNvblN0eWxlIGZyb20gJy4vc3ByaXRlLm1vZHVsZS5jc3MnXG5cbmNvbnN0IGljb25zID0ge1xuICBjaGVja1xufVxuXG5jb25zdCBpY29uSWRzID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuICBPYmplY3QuZW50cmllcyhpY29ucykubWFwKChbbmFtZSwgdmFsdWVdKSA9PiBbbmFtZSwgdmFsdWUubWF0Y2goLzxzeW1ib2wgaWQ9XCIoW15cIl0rKVwiLyk/LlsxXV0pXG4pXG5cbmNvbnN0IHhtbG5zID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xuY29uc3QgeGxpbmsgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluaydcbmNvbnN0IHN2Z1Nwcml0ZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICdzdmcnKVxuc3ZnU3ByaXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKVxuc3ZnU3ByaXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ3Bvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6IDA7IGhlaWdodDogMDsgb3ZlcmZsb3c6IGhpZGRlbjsnKVxuc3ZnU3ByaXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3ZlcnNpb24nLCAnMS4xJylcbnN2Z1Nwcml0ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCd4bWxucycsIHhtbG5zKVxuc3ZnU3ByaXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3htbG5zOnhsaW5rJywgeGxpbmspXG5zdmdTcHJpdGVFbGVtZW50LmlubmVySFRNTCA9IFsnPGRlZnM+JywgLi4uT2JqZWN0LnZhbHVlcyhpY29ucyksICc8L2RlZnM+J10uam9pbignJylcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoc3ZnU3ByaXRlRWxlbWVudClcblxuZXhwb3J0IGNvbnN0IHJlbmRlckljb24gPSAoaWNvbklkOiBzdHJpbmcsIC4uLmNsYXNzTGlzdDogc3RyaW5nW10pID0+IHtcbiAgY29uc3Qgc3ZnRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyh4bWxucywgJ3N2ZycpXG4gIGNvbnN0IHVzZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoeG1sbnMsICd1c2UnKVxuICBzdmdFbGVtZW50LmNsYXNzTGlzdC5hZGQoaWNvblN0eWxlLmljb24sIC4uLmNsYXNzTGlzdClcbiAgdXNlRWxlbWVudC5zZXRBdHRyaWJ1dGVOUyh4bGluaywgJ2hyZWYnLCBgIyR7aWNvbklkc1tpY29uSWRdfWApXG4gIHN2Z0VsZW1lbnQuYXBwZW5kQ2hpbGQodXNlRWxlbWVudClcbiAgcmV0dXJuIHN2Z0VsZW1lbnRcbn1cbiIsImltcG9ydCB6aEpTT04gZnJvbSAnLi96aC1DTi5qc29uJ1xuaW1wb3J0IGVuSlNPTiBmcm9tICcuL2VuLmpzb24nXG5cbmxldCBsb2NhbGVNZXNzYWdlOiB7XG4gIFtfOiBzdHJpbmddOiBzdHJpbmdcbn0gPSB7fVxuXG5jb25zdCBzZXRMb2NhbGUgPSAobGFuZzogc3RyaW5nKSA9PiB7XG4gIGxvY2FsZU1lc3NhZ2UgPSBsYW5nID09PSAnemgtQ04nID8gemhKU09OIDogZW5KU09OXG59XG5cbnNldExvY2FsZShuYXZpZ2F0b3IubGFuZ3VhZ2UgPz8gbmF2aWdhdG9yLmxhbmd1YWdlcz8uWzBdKVxuXG5leHBvcnQgeyBzZXRMb2NhbGUgfVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAoa2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gbG9jYWxlTWVzc2FnZVtrZXldID8/ICcnXG59XG4iLCJpbXBvcnQgc3R5bGUgZnJvbSAnLi9zdHlsZXMvZ2xvYmFsLm1vZHVsZS5jc3MnXG5pbXBvcnQgbG9nbyBmcm9tICcuL2ltYWdlcy90YW1wZXJtb25rZXkuc3ZnJ1xuaW1wb3J0IHsgcmVuZGVySWNvbiB9IGZyb20gJy4vc3ZnL3Nwcml0ZSdcbmltcG9ydCB0IGZyb20gJy4vbG9jYWxlcydcblxuY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JylcbmNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKHN0eWxlLmNvbnRhaW5lcilcblxuY29uc3QgaW1nRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKVxuaW1nRWwuc2V0QXR0cmlidXRlKCdzcmMnLCBsb2dvKVxuaW1nRWwuY2xhc3NMaXN0LmFkZChzdHlsZS5sb2dvKVxuY29udGFpbmVyLmFwcGVuZENoaWxkKGltZ0VsKVxuXG5jb25zdCBtYWluRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdtYWluJylcbm1haW5FbC5pbm5lckhUTUwgPVxuICBgPGgxPiR7dCgndGl0bGUnKS50b1VwcGVyQ2FzZSgpfTwvaDE+YCArXG4gIGA8dWwgY2xhc3M9JHtzdHlsZS5zdXBwb3J0c30+XG4gICR7W1xuICAgICdzdXBwb3J0LWVzJyxcbiAgICAnc3VwcG9ydC1jc3MnLFxuICAgICdzdXBwb3J0LXN0YXRpYycsXG4gICAgJ3N1cHBvcnQtc3ZnLXNwcml0ZScsXG4gICAgJ3N1cHBvcnQtbG9jYWxlJyxcbiAgICAnc3VwcG9ydC1wbHVnaW4nXG4gIF1cbiAgICAubWFwKChrZXkpID0+IGA8bGk+JHtyZW5kZXJJY29uKCdjaGVjaycsIHN0eWxlLmNoZWNrKS5vdXRlckhUTUx9JHt0KGtleSl9PC9saT5gKVxuICAgIC5qb2luKCdcXG4nKX1cbiAgPC91bD5cbiAgYFxuY29udGFpbmVyLmFwcGVuZENoaWxkKG1haW5FbClcblxuY29uc3QgZ2V0SXRCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuZ2V0SXRCdXR0b24udGV4dENvbnRlbnQgPSB0KCdnb3QtaXQnKVxuZ2V0SXRCdXR0b24uY2xhc3NMaXN0LmFkZChzdHlsZS5idXR0b24pXG5jb250YWluZXIuYXBwZW5kQ2hpbGQoZ2V0SXRCdXR0b24pXG5nZXRJdEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoc3R5bGUuaGlkZSlcbn0pXG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyKVxuIl0sIm5hbWVzIjpbImNoZWNrIiwiZ2xvYmFsIiwiZmFpbHMiLCJyZXF1aXJlJCQwIiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yIiwicmVxdWlyZSQkMSIsInJlcXVpcmVPYmplY3RDb2VyY2libGUiLCJ0b0luZGV4ZWRPYmplY3QiLCJpc0NhbGxhYmxlIiwiaXNPYmplY3QiLCJnZXRCdWlsdEluIiwiTkFUSVZFX1NZTUJPTCIsIlVTRV9TWU1CT0xfQVNfVUlEIiwicmVxdWlyZSQkMiIsImlzU3ltYm9sIiwidHJ5VG9TdHJpbmciLCJhQ2FsbGFibGUiLCJnZXRNZXRob2QiLCJvcmRpbmFyeVRvUHJpbWl0aXZlIiwic2V0R2xvYmFsIiwic3RvcmUiLCJzaGFyZWRNb2R1bGUiLCJ0b09iamVjdCIsInVpZCIsInNoYXJlZCIsImhhc093biIsInJlcXVpcmUkJDMiLCJyZXF1aXJlJCQ0IiwicmVxdWlyZSQkNSIsIlN5bWJvbCIsIndlbGxLbm93blN5bWJvbCIsInRvUHJpbWl0aXZlIiwidG9Qcm9wZXJ0eUtleSIsImRvY3VtZW50IiwiRVhJU1RTIiwiZG9jdW1lbnRDcmVhdGVFbGVtZW50IiwiREVTQ1JJUFRPUlMiLCJJRThfRE9NX0RFRklORSIsInJlcXVpcmUkJDYiLCJhbk9iamVjdCIsImRlZmluZVByb3BlcnR5TW9kdWxlIiwiY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5IiwiaW5zcGVjdFNvdXJjZSIsIldlYWtNYXAiLCJzaGFyZWRLZXkiLCJoaWRkZW5LZXlzIiwicmVxdWlyZSQkNyIsIkludGVybmFsU3RhdGVNb2R1bGUiLCJnZXRJbnRlcm5hbFN0YXRlIiwicmVkZWZpbmVNb2R1bGUiLCJ0b0ludGVnZXJPckluZmluaXR5IiwibWluIiwidG9BYnNvbHV0ZUluZGV4IiwidG9MZW5ndGgiLCJsZW5ndGhPZkFycmF5TGlrZSIsImVudW1CdWdLZXlzIiwiaW50ZXJuYWxPYmplY3RLZXlzIiwib3duS2V5cyIsImNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMiLCJpc0ZvcmNlZCIsInJlZGVmaW5lIiwiYW5JbnN0YW5jZSIsIm9iamVjdEtleXMiLCJodG1sIiwiSUVfUFJPVE8iLCJJdGVyYXRvclByb3RvdHlwZSIsIiQiLCJyZXF1aXJlJCQ4IiwiVE9fU1RSSU5HX1RBRyIsInJlZGVmaW5lQWxsIiwiaXRlcmF0b3JDbG9zZSIsImNhbGxXaXRoU2FmZUl0ZXJhdGlvbkNsb3NpbmciLCJpY29ucyIsImljb25JZHMiLCJPYmplY3QiLCJmcm9tRW50cmllcyIsImVudHJpZXMiLCJtYXAiLCJuYW1lIiwidmFsdWUiLCJtYXRjaCIsInhtbG5zIiwieGxpbmsiLCJzdmdTcHJpdGVFbGVtZW50IiwiY3JlYXRlRWxlbWVudE5TIiwic2V0QXR0cmlidXRlIiwiaW5uZXJIVE1MIiwidmFsdWVzIiwiam9pbiIsImJvZHkiLCJhcHBlbmRDaGlsZCIsInJlbmRlckljb24iLCJpY29uSWQiLCJjbGFzc0xpc3QiLCJzdmdFbGVtZW50IiwidXNlRWxlbWVudCIsImFkZCIsImljb25TdHlsZSIsImljb24iLCJzZXRBdHRyaWJ1dGVOUyIsImxvY2FsZU1lc3NhZ2UiLCJzZXRMb2NhbGUiLCJsYW5nIiwiemhKU09OIiwiZW5KU09OIiwibmF2aWdhdG9yIiwibGFuZ3VhZ2UiLCJsYW5ndWFnZXMiLCJrZXkiLCJjb250YWluZXIiLCJjcmVhdGVFbGVtZW50Iiwic3R5bGUiLCJpbWdFbCIsImxvZ28iLCJtYWluRWwiLCJ0IiwidG9VcHBlckNhc2UiLCJzdXBwb3J0cyIsIm91dGVySFRNTCIsImdldEl0QnV0dG9uIiwidGV4dENvbnRlbnQiLCJidXR0b24iLCJhZGRFdmVudExpc3RlbmVyIiwiaGlkZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7RUFBQSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFO0VBQy9CLEVBQUUsS0FBSyxHQUFHLEtBQUssS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztFQUNqQyxFQUFFLElBQUksUUFBUSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDOUI7RUFDQSxFQUFFLElBQUksQ0FBQyxHQUFHLElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFLEVBQUUsT0FBTyxFQUFFO0FBQzFEO0VBQ0EsRUFBRSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxJQUFJLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztFQUN2RSxFQUFFLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7RUFDOUMsRUFBRSxLQUFLLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztBQUMxQjtFQUNBLEVBQUUsSUFBSSxRQUFRLEtBQUssS0FBSyxFQUFFO0VBQzFCLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxFQUFFO0VBQ3pCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQ2hELEtBQUssTUFBTTtFQUNYLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztFQUM5QixLQUFLO0VBQ0wsR0FBRyxNQUFNO0VBQ1QsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQzVCLEdBQUc7QUFDSDtFQUNBLEVBQUUsSUFBSSxL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
