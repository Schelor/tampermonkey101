// 还原后的需求映射表模块代码

/**
 * 范围类型映射表
 * 将数字范围代码转换为可读的字符串
 */
export const scopeMap = {
  0: "GreaterOrEqual",  // 大于等于
  1: "LessOrEqual",     // 小于等于
  2: "Exact"            // 精确匹配
};

/**
 * 需求类型映射表
 * 将数字需求代码转换为可读的需求类型字符串
 */
export const requirementTypeMap = {
  3: "PlayerQuality",        // 球员品质
  10: "PlayerNation",        // 球员国籍
  11: "PlayerLeague",        // 球员联赛
  12: "PlayerClub",          // 球员俱乐部
  17: "QualityCount",        // 品质数量
  18: "RarityCount",         // 稀有度数量
  25: "PlayerGroup",         // 球员组
  26: "PlayerMinimumRating", // 球员最低评分
  27: "PlayerExactRating",   // 球员精确评分
  28: "PlayerMaximumRating"  // 球员最高评分
};
