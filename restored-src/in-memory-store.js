// 还原后的内存存储模块代码 (模块ID: 78017)
"use strict";

// TypeScript风格的__importDefault辅助函数
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

// 设置模块为ES模块
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryStore = void 0;

// 导入依赖模块
const defaultSettings = require('./default-settings'); // 对应 n(22869)
const cloneDeep = __importDefault(require('./clone-deep')); // 对应 n(89138)
const persistentData = require('./persistent-data'); // 对应 n(33386)
const localDb = require('./local-db'); // 对应 n(84582)

/**
 * 内存存储管理类
 * 用于管理应用程序的各种设置和数据状态
 * 实现单例模式，提供统一的数据访问接口
 */
class InMemoryStore {
    static _instance;
    entries;
    isInitialized;
    localDb;

    constructor() {
        // 初始化默认状态
        this.entries = this.getDefaultState();
        this.isInitialized = false;
        this.localDb = localDb.LocalDb.instance;
    }

    /**
     * 获取默认状态配置
     * @returns {Object} 冻结的默认状态对象
     */
    getDefaultState() {
        return Object.freeze({
            // 交易员设置
            traderSettings: cloneDeep.default(defaultSettings.defaultSettings),

            // 交易员数据
            traderData: cloneDeep.default(defaultSettings.defaultTraderData),

            // 增强器数据
            enhancerData: cloneDeep.default(defaultSettings.defaultEnhancerData),

            // 增强器设置
            enhancerSettings: cloneDeep.default(defaultSettings.defaultEnhancerSetting),

            // 快捷键设置
            shortCutKeySettings: cloneDeep.default(defaultSettings.defaultShortcutKeySetting),

            // 杂项数据
            miscData: {
                isBetaMessageShown: true,                    // 是否已显示Beta消息
                isEnhancerTourAutoPlayed: false,            // 增强器导览是否自动播放
                isTraderTourAutoPlayed: false,              // 交易员导览是否自动播放
                isTraderDisclaimerShown: false,             // 交易员免责声明是否已显示
                isAutobuyCheapestPopupDisabled: false,      // 自动购买最便宜弹窗是否禁用
                isDisableFeedbackPopup: false               // 反馈弹窗是否禁用
            },

            // 评级搜索球员列表
            ratingSearchPlayers: [],

            // 阵容构建器设置
            squadBuilderSettings: cloneDeep.default(defaultSettings.defaultSquadBuilderSetting),

            // SBC求解器数据点（按角色分组）
            solverDataPointsPerPersona: cloneDeep.default(defaultSettings.defaultSBCSolverDataPoints)
        });
    }

    /**
     * 获取单例实例
     * @returns {InMemoryStore} 单例实例
     */
    static get instance() {
        if (!this._instance) {
            this._instance = new InMemoryStore();
        }
        return this._instance;
    }

    /**
     * 异步初始化存储
     * 从本地数据库加载持久化数据
     */
    async init() {
        if (this.isInitialized) {
            return;
        }

        // 并行更新所有持久化数据
        const updatePromises = persistentData.presistentData.map(key =>
            this.updateSettingsFromDb(key)
        );

        await Promise.all(updatePromises);
        this.isInitialized = true;
    }

    /**
     * 从数据库更新特定设置
     * @param {string} key - 设置键名
     */
    async updateSettingsFromDb(key) {
        const data = await this.localDb.get(key);

        if (!data) {
            return;
        }

        if (key === "solverDataPointsPerPersona") {
            // 特殊处理求解器数据点：清理2天前的数据
            const dataPoints = data;
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - 2);
            const cutoffTimestamp = +cutoffDate;

            // 过滤每个数据点，只保留2天内的数据
            for (const dataPoint of dataPoints) {
                dataPoint.points = dataPoint.points.filter(point => point > cutoffTimestamp);
            }

            Object.assign(this.entries[key], dataPoints);
        } else {
            // 普通数据直接合并
            Object.assign(this.entries[key], data);
        }
    }

    /**
     * 检查存储是否已初始化
     * @throws {Error} 如果未初始化则抛出错误
     */
    checkState() {
        if (!this.isInitialized) {
            throw new Error("Not initialized");
        }
    }

    /**
     * 检查是否存在指定键的数据
     * @param {string} key - 数据键名
     * @returns {boolean} 是否存在
     */
    has(key) {
        this.checkState();
        return !!this.entries[key];
    }

    /**
     * 获取指定键的数据
     * @param {string} key - 数据键名
     * @returns {any} 数据值
     */
    get(key) {
        this.checkState();
        return this.entries[key];
    }

    /**
     * 获取指定键的默认值
     * @param {string} key - 数据键名
     * @returns {any} 默认值
     */
    getDefault(key) {
        this.checkState();
        return this.getDefaultState()[key];
    }

    /**
     * 更新阵容构建器设置
     * @param {Object} settings - 新的设置对象
     */
    updateSquadBuilderSetting(settings) {
        Object.assign(this.entries.squadBuilderSettings, settings);
    }

    /**
     * 更新交易员设置
     * @param {string} category - 设置类别
     * @param {Object} settings - 新的设置对象
     */
    updateTraderSetting(category, settings) {
        Object.assign(this.entries.traderSettings[category], settings);
    }
}

// 导出InMemoryStore类
exports.InMemoryStore = InMemoryStore;
