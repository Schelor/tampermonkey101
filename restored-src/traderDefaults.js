/**
 * 交易员默认设置和数据结构模块
 * 包含FIFA Ultimate Team自动交易功能的所有默认配置
 */

// 导入依赖的枚举类型
import { ExternalNotificationType } from './ExternalNotificationType'; // 假设从91317模块导入
import { TraderLogType } from './TraderLogType'; // 假设从55199模块导入

/**
 * 交易员默认设置
 * 包含购买、出售、搜索、通知等各个方面的配置
 */
export const defaultSettings = Object.seal({
  // 购买设置
  buySetting: Object.seal({
    buyPrice: 0,                        // 购买价格
    bidPrice: 0,                        // 竞价价格
    noOfCards: 10,                      // 卡片数量
    buyPricePercentage: 95,             // 购买价格百分比
    buyPriceSteps: 0,                   // 购买价格步长
    searchResultThreshold: 21,          // 搜索结果阈值
    bidExactPrice: false,               // 精确竞价
    findBuyPrice: false,                // 查找购买价格
    findBidPrice: false,                // 查找竞价价格
    skipGoalKeeper: false,              // 跳过门将
    skipBasicChemistry: false,          // 跳过基础化学
    skipClubPlayers: false,             // 跳过俱乐部球员
    bidItemsExpiringIn: 3600,           // 竞价物品过期时间（秒）
  }),

  // 出售设置
  sellSetting: Object.seal({
    sellPrice: [0, 0],                  // 出售价格范围
    clearSoldItemThreshold: 10,         // 清理已售物品阈值
    ratingThreshold: 100,               // 评分阈值
    sellPricePercentage: 100,           // 出售价格百分比
    sellPriceSteps: 0,                  // 出售价格步长
    listDuration: 3600,                 // 上架持续时间（秒）
    checkBuyPrice: false,               // 检查购买价格
    findSellPrice: false,               // 查找出售价格
    relistUnSoldItems: false,           // 重新上架未售出物品
    quickSell: false,                   // 快速出售
    dontMoveWonItems: false,            // 不移动获胜物品
    moveToTransferList: false,          // 移动到转会列表
    clearSoldItems: false,              // 清理已售物品
  }),

  // 搜索设置
  searchSetting: Object.seal({
    randomMinBuy: 300,                  // 随机最低购买价
    randomMinBid: 300,                  // 随机最低竞价
    searchResultPageLimit: 1,           // 搜索结果页面限制
    useRandomMinBuy: true,              // 使用随机最低购买价
    useRandomMinBid: false,             // 使用随机最低竞价
    runForeGround: false,               // 前台运行
    ratingRange: [10, 99],              // 评分范围
    filterRating: 0,                    // 过滤评分
  }),

  // 通用设置
  commonSetting: Object.seal({
    autoClearLog: true,                 // 自动清理日志
    autoClearExpired: true,             // 自动清理过期项
    showSearchLog: true,                // 显示搜索日志
    showMilliSecond: true,              // 显示毫秒
    logTypes: [TraderLogType.ALL],      // 日志类型
    sellPriceRange: false,              // 出售价格范围
  }),

  // 验证码设置
  captchaSetting: Object.seal({
    antiCaptchaKey: "",                 // 反验证码密钥
    proxyAddress: "",                   // 代理地址
    proxyPort: "",                      // 代理端口
    proxyUsername: "",                  // 代理用户名
    proxyPassword: "",                  // 代理密码
    closeWebAppOnCaptcha: false,        // 遇到验证码时关闭Web应用
    autoSolveCaptcha: false,            // 自动解决验证码
  }),

  // 通知设置
  notificationSetting: Object.seal({
    telegramBotToken: "",               // Telegram机器人令牌
    telegramChatId: "",                 // Telegram聊天ID
    discordBotToken: "",                // Discord机器人令牌
    discordChannelId: "",               // Discord频道ID
    discordWebHookUrl: "",              // Discord Webhook URL
    futMarketAlertToken: "",            // FUT市场警报令牌
    notificationType: [ExternalNotificationType.ALL], // 通知类型
    sendDesktopNotification: false,     // 发送桌面通知
    sendListingNotification: false,     // 发送上架通知
    sendNotification: false,            // 发送通知
    soundNotification: false,           // 声音通知
    customDiscordWHName: false,         // 自定义Discord Webhook名称
  }),

  // 安全设置
  safeSetting: Object.seal({
    waitTime: [7, 15],                  // 等待时间范围（秒）
    maxPurchasesPerSearchRequest: 1,    // 每次搜索请求最大购买数
    pauseCycle: [10, 15],               // 暂停周期（次）
    pauseFor: [5, 8],                   // 暂停时长（分钟）
    stopAfter: [60, 120],               // 停止时间（分钟）
    showSearchExceedWarning: false,     // 显示搜索超限警告
    disableSafetyLimits: false,         // 禁用安全限制
    delayAfterBidFor: [0, 0],          // 竞价后延迟时间（秒）
    errorCount: 1,                      // 错误计数
    errorTypes: [],                     // 错误类型
  }),
});

/**
 * 交易员默认数据
 * 用于存储交易员运行时的状态和统计数据
 */
export const defaultTraderData = Object.seal({
  refreshFilterList: false,             // 刷新过滤器列表

  // 缓存数据
  cache: Object.seal({
    sellQueue: [],                      // 出售队列
    cachedBids: new Set(),              // 缓存的竞价
    bidsByFilter: new Map(),            // 按过滤器分组的竞价
    itemToFilter: new Map(),            // 物品到过滤器的映射
    listedItems: new Map(),             // 已上架物品
    profitByFilter: new Map(),          // 按过滤器分组的利润
    minPriceByFilter: new Map(),        // 按过滤器分组的最低价格
    isGuideTourInProgress: false,       // 引导教程是否进行中

    // 过滤器设置
    filter: Object.seal({
      changesMade: false,               // 是否有更改
      selectedFilters: [],              // 选中的过滤器
      currentFilter: "default",         // 当前过滤器
      runSequentially: true,            // 顺序运行
      noOfTimesToRun: 0,               // 运行次数
      noOfTimesRange: [1, 5],          // 运行次数范围
      currentFilterRunCount: 0,         // 当前过滤器运行计数
    }),

    nextPageNumber: 1,                  // 下一页页码
    autoLoadFilterName: "",             // 自动加载过滤器名称
  }),

  // 统计数据
  stats: Object.seal({
    soldItems: 0,                       // 已售物品数
    unsoldItems: 0,                     // 未售物品数
    activeTransfers: 0,                 // 活跃转会数
    availableItems: 0,                  // 可用物品数
    coinsNumber: 0,                     // 金币数量
    searchCount: 0,                     // 搜索次数
    profit: 0,                          // 利润
    listedProfit: 0,                    // 上架利润
    searchPerMinuteCount: 0,            // 每分钟搜索次数
    purchasedCardCount: 0,              // 购买卡片数量
    botStartTime: 0,                    // 机器人启动时间
    wonCount: 0,                        // 获胜次数
    bidCount: 0,                        // 竞价次数
    lossCount: 0,                       // 失败次数
    listedCount: 0,                     // 上架次数
    firstStartTime: 0,                  // 首次启动时间
  }),
});
