// 还原后的查看进化阵容模块代码
import { wait, sendRequest } from './utils'; // 对应 n(82125)
import {
  getFinalBoostedPlayer,
  sendUINotification,
  showLoader,
  hideLoader,
  getEvolutionsForPreview
} from './sbc-module'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { translate } from './translation-utils'; // 对应 n(44669)
import { config } from './config'; // 对应 n(30712)
import { AuthManager } from './auth-manager'; // 对应 n(58250)
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)
import { showEvolveSquadResultPopup } from './evolve-squad-result-popup'; // 对应 n(88753)

/**
 * 获取进化后的球员数据
 * @param {Object} evolution - 进化对象
 * @param {Object} player - 球员对象
 * @returns {Promise<Object|null>} 进化后的球员数据或null
 */
const getEvolvedPlayer = async (evolution, player) => {
  // 检查球员是否满足进化要求
  if (!evolution.meetsRequirements(player)) {
    return null;
  }

  // 获取最终提升后的球员数据
  const boostedPlayer = await getFinalBoostedPlayer(evolution.id, player.id);

  if (boostedPlayer) {
    // 等待1秒避免请求过于频繁
    await wait(1);
    return boostedPlayer;
  }

  return null;
};

/**
 * 查看进化阵容
 * @param {Object} popupElements - 弹窗元素对象
 * @param {Object} squad - 阵容对象
 * @param {Object} sbcSettings - SBC设置
 * @returns {Promise<void>}
 */
export const viewEvolvedSquad = async (popupElements, squad, sbcSettings) => {
  // 获取场上有效球员
  const fieldPlayers = squad
    .getFieldPlayers()
    .filter((player) => player.isValid())
    .map(({ item }) => item);

  // 检查是否有球员在阵容中
  if (!fieldPlayers.length) {
    sendUINotification(
      translate("noPlayersInSquad"),
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }

  // 检查用户权限
  if (!AuthManager.instance.hasEnhancerAccess(true)) {
    return;
  }

  // 获取球员进化路径数据
  const playerEvolutionPaths = await getPlayerEvolutionPaths(fieldPlayers);
  const evolutionPathsMap = new Map(playerEvolutionPaths.map(({ id, paths }) => [id, paths]));

  showLoader();

  // 获取可用的进化选项
  const availableEvolutions = await getEvolutionsForPreview(sbcSettings);

  if (!availableEvolutions.length) {
    sendUINotification(
      translate("noMatchingEvolutions"),
      UINotificationTypeEnum.NEGATIVE
    );
    hideLoader();
    return;
  }

  // 设置进化阵容预览状态
  const enhancerData = InMemoryStore.instance.get("enhancerData");
  enhancerData.isInEvolvedSquadPreview = true;

  // 计算所有可能的进化组合
  const evolutionCombinations = await calculateEvolutionCombinations(availableEvolutions, fieldPlayers);

  // 重置预览状态
  enhancerData.isInEvolvedSquadPreview = false;

  // 处理进化结果
  const processedResults = processEvolutionResults(evolutionCombinations, evolutionPathsMap);

  hideLoader();

  // 显示结果
  if (processedResults.size) {
    showEvolveSquadResultPopup(popupElements, squad, processedResults);
  } else {
    sendUINotification(
      translate("noSquadPlayersEvolved"),
      UINotificationTypeEnum.NEGATIVE
    );
  }
};

/**
 * 获取球员进化路径数据
 * @param {Array} players - 球员数组
 * @returns {Promise<Array>} 球员进化路径数据
 */
async function getPlayerEvolutionPaths(players) {
  try {
    const response = await sendRequest(
      `${config.api.nextRestBase}/academy-solver/evolve-squads`,
      "POST",
      `${Math.floor(Date.now())}_generateEvolvedSquad`,
      JSON.stringify({
        players: players.map(({ id }) => ({ id })),
      }),
      {
        Authorization: `Bearer ${await AuthManager.instance.getAccessToken()}`,
        "Content-Type": "application/json",
      }
    );

    return JSON.parse(response);
  } catch (error) {
    // 如果请求失败，返回默认的进化路径
    return players.map(({ id }) => ({ id, paths: [201] }));
  }
}

/**
 * 计算所有可能的进化组合
 * @param {Array} evolutions - 进化选项数组
 * @param {Array} players - 球员数组
 * @returns {Promise<Array>} 进化组合数组
 */
async function calculateEvolutionCombinations(evolutions, players) {
  const combinations = [];

  // 遍历所有进化选项和球员组合
  for (const evolution of evolutions) {
    for (const player of players) {
      const boostedPlayer = await getEvolvedPlayer(evolution, player);

      if (boostedPlayer) {
        combinations.push({
          boostedPlayer: boostedPlayer,
          evolution: evolution,
          boost: boostedPlayer.rating - player.rating, // 计算评分提升
        });
      }
    }
  }

  // 按评分提升降序排序
  combinations.sort((a, b) => b.boost - a.boost);

  return combinations;
}

/**
 * 处理进化结果，去重并选择最佳选项
 * @param {Array} evolutionCombinations - 进化组合数组
 * @param {Map} evolutionPathsMap - 进化路径映射
 * @returns {Map} 处理后的结果映射
 */
function processEvolutionResults(evolutionCombinations, evolutionPathsMap) {
  const usedEvolutionIds = new Set();
  const resultMap = new Map();

  for (const { evolution, boostedPlayer, boost } of evolutionCombinations) {
    // 检查是否已经使用了这个球员或进化
    const hasPlayerResult = resultMap.has(boostedPlayer.id);
    const hasEvolutionUsed = usedEvolutionIds.has(evolution.id);
    const hasEvolutionPaths = evolutionPathsMap.get(boostedPlayer.id)?.length;

    // 如果球员已有结果、进化已被使用或没有进化路径，跳过
    if (hasPlayerResult || hasEvolutionUsed || !hasEvolutionPaths) {
      continue;
    }

    // 添加到结果映射
    resultMap.set(boostedPlayer.id, {
      boostedPlayer: boostedPlayer,
      slotName: evolution.slotName,
      currentRating: boostedPlayer.rating - boost, // 原始评分
      slotPrice: evolution.prices._collection.COINS?.amount ?? 0, // 进化价格
    });

    // 标记进化已被使用
    usedEvolutionIds.add(evolution.id);
  }

  return resultMap;
}
