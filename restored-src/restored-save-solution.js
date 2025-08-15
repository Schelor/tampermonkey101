// 还原后的保存解决方案模块代码
import { saveChallenge, loadChallenge } from './sbc-module'; // 对应 n(13808)
import { createSquadPlayers } from './squad-utils'; // 对应 n(40570)

/**
 * 保存SBC解决方案
 * @param {Array} playerIds - 球员ID数组
 * @param {Array} playerData - 球员数据数组
 * @param {Object} challenge - 挑战对象
 * @param {boolean} forceReload - 是否强制重新加载
 * @returns {Promise<Array>} 保存后的球员物品数组
 */
export const saveSolution = async (playerIds, playerData, challenge, forceReload) => {
  // 创建阵容球员
  const squadPlayers = createSquadPlayers(playerIds, playerData);

  // 获取挑战的阵容对象
  const { squad } = challenge;

  // 如果没有阵容对象，返回空数组
  if (!squad) {
    return [];
  }

  // 清空当前阵容并设置新球员
  squad.removeAllItems();
  squad.setPlayers(squadPlayers, true);

  // 保存挑战
  await saveChallenge(challenge);

  // 重新加载挑战数据
  const { data: loadedData } = await loadChallenge(challenge, forceReload);

  // 获取加载后的球员物品
  const playerItems = loadedData?.squad?.getPlayers().map((player) => player.item) ?? [];

  // 更新阵容并通知数据变化
  squad.setPlayers(playerItems, true);
  challenge.onDataChange.notify({ squad });

  return playerItems;
};
