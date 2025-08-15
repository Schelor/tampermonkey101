// 还原后的品质过滤模块代码

/**
 * 根据品质需求过滤球员
 * @param {Object} player - 球员对象
 * @param {Object} qualityRequirement - 品质需求对象
 * @returns {boolean} 是否符合品质要求
 */
export const filterByQuality = (player, qualityRequirement) => {
  // 如果没有品质需求，直接通过
  if (!qualityRequirement) {
    return true;
  }

  // 解构品质需求
  const {
    values: [requiredQuality],
    scope: comparisonType,
  } = qualityRequirement;

  // 根据比较类型进行过滤
  if (comparisonType === "GreaterOrEqual") {
    // 大于等于指定品质
    return player.quality >= requiredQuality;
  } else if (comparisonType === "LessOrEqual") {
    // 小于等于指定品质
    return player.quality <= requiredQuality;
  } else {
    // 精确匹配品质
    return player.quality === requiredQuality;
  }
};
