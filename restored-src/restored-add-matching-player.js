// 还原后的添加匹配球员模块代码
import {
  sendUINotification,
  showLoader,
  hideLoader,
  getSquadPlayersForQuickAdd
} from './sbc-module'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { translate } from './translation-utils'; // 对应 n(44669)
import { CurrentDataSource } from './current-data-source'; // 对应 n(53403)
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)
import { filterPlayers } from './filter-players'; // 对应 n(54130)
import { selectSolution } from './select-solution'; // 对应 n(46418)

/**
 * 获取安全的价格值，如果价格为空则返回一个很大的数值
 * @param {number} price - 球员价格
 * @returns {number} 安全的价格值
 */
const getSafePrice = (price) => price || 10000000; // 1千万作为默认高价

/**
 * 为SBC挑战添加匹配的球员
 * @param {Object} challenge - 挑战对象
 * @param {Object} requirement - 需求对象
 * @param {Object} playerQualityRequirement - 球员品质需求对象
 * @returns {Promise<void>}
 */
export const addMatchingPlayer = async (challenge, requirement, playerQualityRequirement) => {
  // 获取当前阵容中的所有球员
  const squadPlayers = challenge.squad?.getPlayers() ?? [];

  // 获取场上的空位置（无效且非砖块的位置）
  const emptyPositions = (challenge.squad?.getFieldPlayers() ?? []).filter(
    (player) => !player.isBrick() && !player.isValid()
  );

  // 如果没有空位置，显示通知并返回
  if (!emptyPositions.length) {
    sendUINotification(
      translate("noEmptySlots"),
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }

  // 显示加载器
  showLoader();

  // 创建已有球员的定义ID集合
  const existingPlayerIds = new Set(
    squadPlayers
      .filter(({ item }) => item.isValid())
      .map(({ item }) => item.definitionId)
  );

  // 显示获取球员通知
  sendUINotification(translate("fetchSquadPlayers"));

  // 获取增强器设置
  const enhancerSettings = InMemoryStore.instance.get("enhancerSettings");

  // 获取可用于快速添加的球员
  const availablePlayers = await getSquadPlayersForQuickAdd(enhancerSettings);

  // 显示获取价格通知
  sendUINotification(translate("fetchLatestPrices"));

  // 过滤符合需求的球员
  const filteredPlayers = filterPlayers(availablePlayers, existingPlayerIds, requirement, playerQualityRequirement);

  // 获取球员价格信息
  const playersWithPrices = await CurrentDataSource.instance.fetchItemPrices(filteredPlayers);

  // 获取排序设置
  const { sbcQuickAddSorting } = InMemoryStore.instance.get("enhancerSettings");

  // 根据设置选择排序方式
  const sortFunction = sbcQuickAddSorting === "rating"
    ? ({ rating: a }, { rating: b }) => a - b  // 按评分升序排序
    : ({ price: a }, { price: b }) => getSafePrice(a) - getSafePrice(b); // 按价格升序排序

  // 排序并限制数量
  const sortedPlayers = playersWithPrices
    .sort(sortFunction)
    .slice(0, Math.min(requirement.count, emptyPositions.length));

  // 构建新的阵容配置
  const newSquadConfiguration = [];

  for (const squadPlayer of squadPlayers) {
    if (squadPlayer.item.isValid()) {
      // 如果是有效球员，保留原有球员信息
      const playerItem = squadPlayer.item;
      newSquadConfiguration.push({
        definitionId: playerItem.definitionId,
        rating: playerItem.rating,
        price: 0,
        leagueId: playerItem.leagueId,
        nationId: playerItem.nationId,
        teamId: playerItem.teamId,
        rareflag: playerItem.rareflag,
        groups: playerItem.groups,
        quality: playerItem.getTier(),
      });
    } else if (squadPlayer.isBrick()) {
      // 如果是砖块位置，保持为null
      newSquadConfiguration.push(null);
    } else {
      // 如果是空位置，尝试填入匹配的球员
      const matchingPlayer = sortedPlayers.shift();
      if (matchingPlayer) {
        newSquadConfiguration.push({
          ...matchingPlayer,
          price: 0 // 重置价格为0
        });
      } else {
        newSquadConfiguration.push(null);
      }
    }
  }

  // 应用新的阵容配置tran
  selectSolution(challenge, newSquadConfiguration);

  // 隐藏加载器
  hideLoader();
};
