// Webpack Runtime 还原代码
// 这是webpack打包后的运行时代码，用于模块加载和管理

// 全局变量声明
var modules = {}; // 存储所有模块的对象 (对应原代码中的 a)
var moduleCache = {}; // 模块缓存 (对应原代码中的 i)
var deferredModules = []; // 延迟加载的模块队列 (对应原代码中的 e)
var getProto; // 获取原型的函数 (对应原代码中的 n)
var installedChunks; // 已安装的chunk状态 (对应原代码中的 t)

// 主要的模块加载函数 (对应原代码中的 r)
function __webpack_require__(moduleId) {
    // 检查模块是否已经在缓存中
    var cachedModule = moduleCache[moduleId];
    if (cachedModule !== undefined) {
        return cachedModule.exports;
    }

    // 创建新的模块对象并放入缓存
    var module = moduleCache[moduleId] = {
        id: moduleId,
        exports: {}
    };

    // 执行模块函数
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    // 返回模块的导出
    return module.exports;
}

// 将模块对象赋值给 __webpack_require__.m
__webpack_require__.m = modules;

// 初始化延迟模块数组
deferredModules = [];

// 处理延迟加载的模块 (对应原代码中的 r.O)
__webpack_require__.O = function(result, chunkIds, fn, priority) {
    if (!chunkIds) {
        // 如果没有指定chunkIds，处理所有延迟的模块
        var notFulfilled = Infinity;
        for (var i = 0; i < deferredModules.length; i++) {
            var [chunkIds, fn, priority] = deferredModules[i];
            var fulfilled = true;

            for (var j = 0; j < chunkIds.length; j++) {
                if ((priority & 1 === 0 || notFulfilled >= priority) &&
                    Object.keys(__webpack_require__.O).every(key => __webpack_require__.O[key](chunkIds[j]))) {
                    chunkIds.splice(j--, 1);
                } else {
                    fulfilled = false;
                    if (priority < notFulfilled) notFulfilled = priority;
                }
            }

            if (fulfilled) {
                deferredModules.splice(i--, 1);
                var r = fn();
                if (r !== undefined) result = r;
            }
        }
        return result;
    }

    // 添加新的延迟模块
    priority = priority || 0;
    for (var i = deferredModules.length; i > 0 && deferredModules[i - 1][2] > priority; i--) {
        deferredModules[i] = deferredModules[i - 1];
    }
    deferredModules[i] = [chunkIds, fn, priority];
};

// 创建命名空间对象 (对应原代码中的 r.n)
__webpack_require__.n = function(module) {
    var getter = module && module.__esModule ?
        function() { return module['default']; } :
        function() { return module; };
    __webpack_require__.d(getter, { a: getter });
    return getter;
};

// 获取对象原型的函数
getProto = Object.getPrototypeOf ?
    function(obj) { return Object.getPrototypeOf(obj); } :
    function(obj) { return obj.__proto__; };

// 创建模块的命名空间 (对应原代码中的 r.t)
__webpack_require__.t = function(value, mode) {
    if (mode & 1) value = this(value);
    if (mode & 8) return value;

    if (typeof value === 'object' && value) {
        if ((mode & 4) && value.__esModule) return value;
        if ((mode & 16) && typeof value.then === 'function') return value;
    }

    var ns = Object.create(null);
    __webpack_require__.r(ns);

    var def = {};
    installedChunks = installedChunks || [null, getProto({}), getProto([]), getProto(getProto)];

    for (var current = mode & 2 && value;
         typeof current == 'object' && !~installedChunks.indexOf(current);
         current = getProto(current)) {
        Object.getOwnPropertyNames(current).forEach(key => {
            def[key] = function() { return value[key]; };
        });
    }

    def['default'] = function() { return value; };
    __webpack_require__.d(ns, def);
    return ns;
};

// 定义属性到exports对象 (对应原代码中的 r.d)
__webpack_require__.d = function(exports, definition) {
    for (var key in definition) {
        if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
            Object.defineProperty(exports, key, {
                enumerable: true,
                get: definition[key]
            });
        }
    }
};

// 异步加载模块 (对应原代码中的 r.e)
__webpack_require__.e = function() {
    return Promise.resolve();
};

// 获取全局对象 (对应原代码中的 r.g)
__webpack_require__.g = (function() {
    if (typeof globalThis === 'object') return globalThis;
    try {
        return this || new Function('return this')();
    } catch (e) {
        if (typeof window === 'object') return window;
    }
})();

// 检查对象是否有指定属性 (对应原代码中的 r.o)
__webpack_require__.o = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
};

// 标记模块为ES模块 (对应原代码中的 r.r)
__webpack_require__.r = function(exports) {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
    }
    Object.defineProperty(exports, '__esModule', { value: true });
};

// 立即执行函数 - 处理chunk加载
(function() {
    // 设置基础URI
    __webpack_require__.b = document.baseURI || self.location.href;

    // 已安装的chunk状态 (0表示已安装)
    var installedChunks = { 179: 0 };

    // 检查chunk是否已安装
    __webpack_require__.O.j = function(chunkId) {
        return installedChunks[chunkId] === 0;
    };

    // chunk加载回调函数
    var webpackJsonpCallback = function(parentChunkLoadingFunction, data) {
        var [chunkIds, moreModules, runtime] = data;
        var moduleId, chunkId, i = 0;

        if (chunkIds.some(id => installedChunks[id] !== 0)) {
            // 安装新模块
            for (moduleId in moreModules) {
                if (__webpack_require__.o(moreModules, moduleId)) {
                    __webpack_require__.m[moduleId] = moreModules[moduleId];
                }
            }
            if (runtime) var result = runtime(__webpack_require__);
        }

        if (parentChunkLoadingFunction) parentChunkLoadingFunction(data);

        // 标记chunk为已安装
        for (; i < chunkIds.length; i++) {
            chunkId = chunkIds[i];
            if (__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
                installedChunks[chunkId][0]();
            }
            installedChunks[chunkId] = 0;
        }

        return __webpack_require__.O(result);
    };

    // 设置全局的webpackChunk数组
    var chunkLoadingGlobal = self.webpackChunkapp_entry = self.webpackChunkapp_entry || [];
    chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
})();

// 设置nonce (内容安全策略)
__webpack_require__.nc = undefined;

// 启动应用 - 加载入口模块
var result = __webpack_require__.O(undefined, [736], function() {
    return __webpack_require__(91920);
});
result = __webpack_require__.O(result);
