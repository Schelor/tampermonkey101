// 还原后的评分范围需求模块代码

/**
 * 根据需求类型获取评分范围要求
 * @param {Object} requirement - 需求对象
 * @param {string} requirement.requirementType - 需求类型
 * @param {Array} requirement.values - 需求值数组
 * @returns {Array} 评分范围 [最低评分, 最高评分]
 */
export const getRatingRangeRequirement = ({ requirementType, values }) => {
  // 默认评分范围 [0, 99]
  const ratingRange = [0, 99];

  if (requirementType === "PlayerMaximumRating") {
    // 球员最高评分需求：设置最高评分限制
    [ratingRange[1]] = values;
    return ratingRange;
  } else if (requirementType === "PlayerMinimumRating") {
    // 球员最低评分需求：设置最低评分限制
    [ratingRange[0]] = values;
    return ratingRange;
  } else if (requirementType === "PlayerExactRating") {
    // 球员精确评分需求：设置精确评分（最低和最高都是同一个值）
    [ratingRange[0]] = values;
    [ratingRange[1]] = values;
  }

  return ratingRange;
};
