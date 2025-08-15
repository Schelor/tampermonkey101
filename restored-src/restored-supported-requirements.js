// 还原后的支持需求模块代码

/**
 * 支持的需求类型映射表
 * 将需求类型映射到球员对象的对应属性名
 */
export const supportedRequirements = new Map([
  ["PlayerGroup", "groups"],        // 球员组 → groups属性
  ["RarityCount", "rareflag"],      // 稀有度数量 → rareflag属性
  ["PlayerNation", "nationId"],     // 球员国籍 → nationId属性
  ["PlayerLeague", "leagueId"],     // 球员联赛 → leagueId属性
  ["PlayerClub", "teamId"],         // 球员俱乐部 → teamId属性
  ["QualityCount", "quality"],      // 品质数量 → quality属性
  ["PlayerMaximumRating", "rating"], // 球员最高评分 → rating属性
  ["PlayerMinimumRating", "rating"], // 球员最低评分 → rating属性
  ["PlayerExactRating", "rating"],   // 球员精确评分 → rating属性
]);
