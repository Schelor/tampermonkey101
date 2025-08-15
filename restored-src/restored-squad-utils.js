// 还原后的阵容工具模块代码

/**
 * 创建阵容球员实体
 * @param {Array} playerIds - 球员ID数组
 * @param {Map} playerLookup - 球员查找表
 * @returns {Array} 球员实体数组
 */
export const createSquadPlayers = (playerIds, playerLookup) =>
  playerIds.map((playerId) => {
    // 如果球员ID为空，返回null
    if (!playerId) {
      return null;
    }

    // 使用球员ID作为定义ID
    const definitionId = playerId;

    // 从查找表中获取球员数据
    const playerData = playerLookup.get(definitionId);

    // 创建新的物品实体
    const itemEntity = new UTItemEntity();

    // 设置实体属性
    itemEntity.id = playerData ? playerData.id : definitionId;
    itemEntity.definitionId = definitionId;
    itemEntity.concept = !playerData; // 如果没有实际球员数据，则为概念球员
    itemEntity.stackCount = 1;

    return itemEntity;
  });
