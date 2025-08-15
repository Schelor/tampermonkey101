/**
 * 默认设置和数据结构模块
 * 包含Squad Builder、Enhancer等功能的默认配置
 */

// 假设这些常量在其他地方定义
const AUCTION_MAX_BID = 15000000; // FIFA拍卖最大出价
const SearchSortID = {
  RATING_ASC: 'rating_asc'
};

/**
 * Squad Builder 默认设置
 * 用于配置阵容构建器的默认参数
 */
export const defaultSquadBuilderSetting = Object.seal({
  rating: [10, 99],                    // 评分范围
  leagues: [],                         // 包含的联赛
  ignoreLeagues: [],                   // 忽略的联赛
  clubs: [],                          // 包含的俱乐部
  ignoreClubs: [],                    // 忽略的俱乐部
  nations: [],                        // 包含的国家
  ignoreNations: [],                  // 忽略的国家
  noOfPlayers: null,                  // 球员数量
  ignorePosition: false,              // 忽略位置
  prioritizeDuplicates: false,        // 优先使用重复球员
  prioritizeStorage: true,            // 优先使用仓库球员
  onlyDuplicates: false,              // 仅使用重复球员
  useTLDuplicates: false,             // 使用转会列表重复球员
  onlyFemales: false,                 // 仅使用女球员
  doNotFillBench: false,              // 不填充替补席
});

/**
 * Enhancer 默认设置
 * 用于配置增强器功能的默认参数
 */
export const defaultEnhancerSetting = Object.seal({
  dataSource: "futnext",                           // 数据源
  barginThresholdPercent: 95,                      // 便宜货阈值百分比
  showOnlyBargain: false,                          // 仅显示便宜货
  showBidBargains: false,                          // 显示竞价便宜货
  showSquadPrice: true,                            // 显示阵容价格
  showSquadDecimalRating: true,                    // 显示阵容小数评分
  moveDuplicatesToClubAfterSubmit: true,           // 提交后将重复球员移至俱乐部
  showSBCRewardOdds: true,                         // 显示SBC奖励概率
  usePriceModifierPercentage: true,                // 使用价格修正百分比
  listDuration: 3600,                              // 上架持续时间（秒）
  showCalcMinBin: false,                           // 显示计算最低一口价
  showAlternatePosition: false,                    // 显示替代位置
  showEvolutionPaths: true,                        // 显示进化路径
  showSnipeWithTrader: true,                       // 显示交易员狙击
  preserveRatingRange: true,                       // 保持评分范围
  sbcQuickAddSorting: "rating",                    // SBC快速添加排序
  hideBinPopup: false,                             // 隐藏一口价弹窗
  autoConfirmPopup: false,                         // 自动确认弹窗
  autoConfirmRewardPopup: true,                    // 自动确认奖励弹窗
  increaseUnassignedItems: false,                  // 增加未分配物品
  autoBuyCheapest: false,                          // 自动购买最便宜
  autoSelectBargain: false,                        // 自动选择便宜货
  autoSelectCheapest: false,                       // 自动选择最便宜
  enableCompactView: false,                        // 启用紧凑视图
  enableFullWidthMode: false,                      // 启用全宽模式
  enableGridMode: false,                           // 启用网格模式
  enablePageJumper: false,                         // 启用页面跳转器
  increaseClubPlayersDisplayed: false,             // 增加俱乐部球员显示
  increaseSearchResult: false,                     // 增加搜索结果
  disablePackAnimation: false,                     // 禁用包装动画
  hidePackHistory: false,                          // 隐藏包装历史
  hidePackTracker: false,                          // 隐藏包装追踪器
  enableKeyboardShortCut: true,                    // 启用键盘快捷键
  prioritizeDuplicates: false,                     // 优先重复球员
  squadBuildSortId: SearchSortID.RATING_ASC,       // 阵容构建排序ID
  ignoredSbcLeagues: new Set(),                    // 忽略的SBC联赛
  ignoredSbcClubs: new Set(),                      // 忽略的SBC俱乐部
  ignoredSbcRarities: new Set(),                   // 忽略的SBC稀有度
  ignoredSbcNations: new Set(),                    // 忽略的SBC国家
  ignoredSbcPlayers: new Set(),                    // 忽略的SBC球员
  ignoreFiltersForDuplicates: true,                // 重复球员忽略过滤器
  ignoreSpecificLeagueFilter: false,               // 忽略特定联赛过滤器
  showFilteredSBCSearchPlayerCount: true,          // 显示过滤后SBC搜索球员数量
  ignoredLeagues: new Set(),                       // 忽略的联赛
  ignoredClubs: new Set(),                         // 忽略的俱乐部
  ignoredPositions: new Set(),                     // 忽略的位置
  ignoredPlayers: new Set(),                       // 忽略的球员
  includePlayers: new Set(),                       // 包含的球员
  ignoredRarities: new Set(),                      // 忽略的稀有度
  ignoredNations: new Set(),                       // 忽略的国家
  multiRarities: new Set(),                        // 多稀有度
  ignoredPlayStyles: new Set(),                    // 忽略的游戏风格
  excludeActiveSquad: true,                        // 排除活跃阵容
  onlyUntradables: true,                           // 仅不可交易
  onlyFemales: false,                              // 仅女性
  ignoreEvolutionPlayers: true,                    // 忽略进化球员
  includeTLDuplicates: false,                      // 包含转会列表重复球员
  ignorePosition: true,                            // 忽略位置
  searchSortField: "any",                          // 搜索排序字段
  searchSortDirection: false,                      // 搜索排序方向
  searchResultRefreshTime: [0, 0],                 // 搜索结果刷新时间
  activeTransferNotificationTime: 0,               // 活跃转会通知时间
  disablePreviewPackAlert: false,                  // 禁用预览包装警告
  fastWebAppLoad: true,                            // 快速Web应用加载
  autoGoBackEmptyUnassigned: true,                 // 自动返回空未分配
  autoSelectPlayerPick: true,                      // 自动选择球员选择
  autoSelectPlayerPickFactor: "rating",            // 自动选择球员选择因子
  enableTrader: true,                              // 启用交易员
  enableClubItemAnySearch: false,                  // 启用俱乐部物品任意搜索
  autoPackOpenSummary: false,                      // 自动包装开启摘要
  enablePackOdds: true,                            // 启用包装概率
  enableQuickGoToSBC: true,                        // 启用快速转到SBC
  enableTryYourLuck: true,                         // 启用试试运气
  isPreviousStoreDeleted: false,                   // 之前的存储是否已删除
  showFeedbackPopup: false,                        // 显示反馈弹窗
  showCopyDeepLink: true,                          // 显示复制深度链接
  showSnipeWithVps: true,                          // 显示VPS狙击
});

/**
 * Enhancer 默认数据
 * 用于存储运行时数据的默认结构
 */
export const defaultEnhancerData = Object.seal({
  loggedInUserName: undefined,                     // 登录用户名
  lastOpenedSBC: { setId: -1, challengeId: -1 },  // 最后打开的SBC
  lastUsedSBCRatingRange: [10, 99],               // 最后使用的SBC评分范围
  lastPlayerPickAvailablePicks: 1,                // 最后球员选择可用选择数
  pageNumber: 1,                                  // 页码
  rating: undefined,                              // 评分
  playersByRating: new Map(),                     // 按评分分组的球员
  autoBuyCheapest: false,                         // 自动购买最便宜
  autoBuyBargain: false,                          // 自动购买便宜货
  multiSolve: { removedPlayers: new Set() },      // 多重解决方案
  isInSearchPage: false,                          // 是否在搜索页面
  isInSBCSquadPage: false,                        // 是否在SBC阵容页面
  sbcPlayerSearchCriteria: undefined,             // SBC球员搜索条件
  clubSearchFilterLoans: false,                   // 俱乐部搜索过滤租借
  clubSearchStoragePlayers: false,                // 俱乐部搜索仓库球员
  unassignedCount: 0,                             // 未分配数量
  lastSearchResultCount: -1,                      // 最后搜索结果数量
  lastPackFilter: "",                             // 最后包装过滤器
  lastSearchClubCriteria: undefined,              // 最后搜索俱乐部条件
  clubSearchPlayerId: undefined,                  // 俱乐部搜索球员ID
  untradablePackAction: [                         // 不可交易包装动作
    "swapDuplicates",
    "moveTransfers",
    "moveStorage",
  ],
  scanClubSettings: {                             // 扫描俱乐部设置
    ratingRange: [0, 99],
    excludeRarities: new Set(),
    priceRange: [0, AUCTION_MAX_BID],
  },
  buyMissingPlayerPercentage: [95, 95],           // 购买缺失球员百分比
  buyMissingPlayerSteps: -1,                      // 购买缺失球员步骤
  fastPackOpen: false,                            // 快速包装开启
  lastPackRewardInstance: undefined,              // 最后包装奖励实例
  lastAutoOpenedPackName: "",                     // 最后自动开启包装名称
  autoPackOpenLogs: new Map(),                    // 自动包装开启日志
  isTraderRunning: false,                         // 交易员是否运行中
  isIdle: false,                                  // 是否空闲
  generateSolutionSettings: {                     // 生成解决方案设置
    prioritizeStorage: false,
    prioritizeDuplicates: false,
    prioritizeUntradeables: true,
    onlyRaritiesToInclude: new Set(),
  },
  setVotes: new Map(),                            // 套装投票
  packVotes: new Map(),                           // 包装投票
  userVotes: {                                    // 用户投票
    likedSetIds: new Set(),
    dislikedSetIds: new Set(),
    likedPackIds: new Set(),
    dislikedPackIds: new Set(),
  },
  deepLink: Object.seal({}),                      // 深度链接
  isInEvolvedSquadPreview: false,                 // 是否在进化阵容预览中
  sbcAutoRepeatChallenges: false,                 // SBC自动重复挑战
  sbcPackAutoOpen: {                              // SBC包装自动开启
    isEnabled: false,
    autoOpenActions: undefined
  },
  lastUsedMultiSolveSBCRequest: undefined,        // 最后使用的多重解决SBC请求
});
