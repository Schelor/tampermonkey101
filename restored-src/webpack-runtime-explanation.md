# Webpack 运行时代码解析

## 概述
这段代码是 webpack 打包后生成的运行时代码，负责在浏览器中管理和加载模块。

## 核心组件

### 1. 模块加载器 (`__webpack_require__`)
```javascript
function __webpack_require__(moduleId) {
    // 检查缓存
    if (moduleCache[moduleId]) return moduleCache[moduleId].exports;

    // 创建模块对象
    var module = moduleCache[moduleId] = { id: moduleId, exports: {} };

    // 执行模块
    modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

    return module.exports;
}
```

### 2. 主要功能函数

| 函数 | 原始名 | 功能描述 |
|------|--------|----------|
| `__webpack_require__.O` | `r.O` | 处理延迟加载的模块，管理依赖关系 |
| `__webpack_require__.n` | `r.n` | 创建ES模块的命名空间包装器 |
| `__webpack_require__.t` | `r.t` | 创建模块的命名空间对象 |
| `__webpack_require__.d` | `r.d` | 定义模块导出的属性 |
| `__webpack_require__.r` | `r.r` | 标记对象为ES模块 |
| `__webpack_require__.e` | `r.e` | 异步加载模块（返回Promise） |
| `__webpack_require__.g` | `r.g` | 获取全局对象 |
| `__webpack_require__.o` | `r.o` | 检查对象属性 |

### 3. 变量映射

| 还原后变量名 | 原始变量 | 用途 |
|-------------|----------|------|
| `modules` | `a` | 存储所有模块函数 |
| `moduleCache` | `i` | 模块缓存对象 |
| `deferredModules` | `e` | 延迟加载模块队列 |
| `getProto` | `n` | 获取对象原型的函数 |
| `installedChunks` | `t` | 已安装chunk的状态 |

### 4. Chunk 加载机制
- 使用 JSONP 方式加载代码块
- 通过 `webpackJsonpCallback` 处理新加载的模块
- 维护 `installedChunks` 状态跟踪已加载的chunk

### 5. 启动流程
```javascript
// 最后两行代码启动应用
var result = __webpack_require__.O(undefined, [736], () => __webpack_require__(91920));
result = __webpack_require__.O(result);
```
- 依赖chunk 736
- 入口模块ID为 91920
- 使用延迟加载机制确保依赖就绪后再执行

## 关键特性
1. **模块缓存**: 避免重复执行模块代码
2. **延迟加载**: 支持代码分割和按需加载
3. **ES模块兼容**: 处理ES6模块和CommonJS模块的互操作
4. **Chunk管理**: 支持代码分割后的chunk加载和依赖管理
5. **全局兼容**: 在不同环境下获取正确的全局对象
