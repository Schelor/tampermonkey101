// 还原后的球员过滤模块代码
import { getRatingRangeRequirement } from './get-rating-range-requirement'; // 对应 n(4316)
import { supportedRequirements } from './supported-requirements'; // 对应 n(87371)
import { filterByQuality } from './filter-by-quality'; // 对应 n(42860)

// 物品ID掩码常量（用于数据库ID匹配）
const ItemIdMask = {
  DATABASE: 0xFFFFFF // 24位掩码
};

/**
 * 根据SBC需求过滤球员列表
 * @param {Array} players - 球员列表
 * @param {Set} existingPlayerIds - 已存在的球员ID集合
 * @param {Object} requirement - 需求对象
 * @param {Object} playerQualityRequirement - 球员品质需求对象
 * @returns {Array} 过滤后的球员列表
 */
export const filterPlayers = (players, existingPlayerIds, requirement, playerQualityRequirement) => {
  // 获取评分范围要求
  const ratingRange = getRatingRangeRequirement(requirement);

  return players.filter((player) => {
    // 检查球员是否已存在（包括数据库ID匹配）
    const isPlayerAlreadyExists =
      existingPlayerIds.has(player.definitionId) ||
      existingPlayerIds.has(player.definitionId & ItemIdMask.DATABASE);

    // 检查球员评分是否在要求范围内
    const isRatingInRange = player.rating >= ratingRange[0] && player.rating <= ratingRange[1];

    // 检查球员品质是否符合要求
    const isQualityMatch = filterByQuality(player, playerQualityRequirement);

    // 如果球员已存在、评分不符合或品质不符合，则过滤掉
    if (isPlayerAlreadyExists || !isRatingInRange || !isQualityMatch) {
      return false;
    }

    // 如果需求没有具体值，则通过基本检查即可
    if (!requirement.values.length) {
      return true;
    }

    // 获取需求类型对应的球员属性名
    const playerPropertyName = supportedRequirements.get(requirement.requirementType);

    // 如果不支持该需求类型，则过滤掉
    if (!playerPropertyName) {
      return false;
    }

    // 获取球员的对应属性值
    const playerPropertyValue = player[playerPropertyName];

    // 如果属性值是数字，检查是否匹配需求值
    if (typeof playerPropertyValue === "number") {
      return requirement.values.some((requiredValue) => requiredValue === playerPropertyValue);
    }

    // 如果属性值是数组，检查是否有交集
    if (Array.isArray(playerPropertyValue)) {
      return playerPropertyValue.some((playerValue) =>
        requirement.values.some((requiredValue) => requiredValue === playerValue)
      );
    }

    // 其他情况返回false
    return false;
  });
};
