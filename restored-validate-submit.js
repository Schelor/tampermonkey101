// 还原后的验证提交模块代码
import { wait } from './utils'; // 对应 n(82125)
import {
  requestChallengesForSet,
  sendUINotification,
  showLoader,
  hideLoader,
  getSquadLookupForSbc,
  submitChallenge,
  getPackRewardIds,
  clearUnAssignedCache,
  getUnAssignedItems
} from './sbc-module'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { getLocalization } from './observable-utils'; // 对应 n(27988)
import { translate } from './translation-utils'; // 对应 n(44669)
import { saveSolution } from './save-solution'; // 对应 n(7548)
import { autoOpenRewardsPack } from './rewards-utils'; // 对应 n(38674)
import { refreshChallengeCache } from './cache-utils'; // 对应 n(21819)

/**
 * 检查挑战是否可以继续处理
 * @param {Object} challenge - 挑战对象
 * @param {Object} set - 集合对象
 * @param {number} currentIndex - 当前索引
 * @param {number} totalCount - 总数量
 * @returns {Promise<boolean>} 是否可以继续
 */
const canContinueChallenge = async (challenge, set, currentIndex, totalCount) => {
  // 如果挑战已完成，不能继续
  if (challenge.status === "COMPLETED") {
    return false;
  }

  // 如果当前索引超过总数，不能继续
  if (currentIndex > totalCount) {
    return false;
  }

  // 请求集合的挑战数据
  await requestChallengesForSet(set);

  // 刷新挑战缓存
  await refreshChallengeCache(challenge);

  // 返回false表示不能继续（原逻辑中的取反）
  return false;
};

/**
 * 验证并提交SBC解决方案
 * @param {Object} challenge - 挑战对象
 * @param {Array} solutions - 解决方案数组
 * @returns {Promise<void>}
 */
export const validateAndSubmit = async (challenge, solutions) => {
  // 获取集合对象
  const set = services.SBC.repository.getSetById(challenge.setId);

  // 如果集合不存在，显示错误通知并返回
  if (!set) {
    sendUINotification(
      getLocalization().localize("notification.sbcChallenges.failedToLoad"),
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }

  // 显示加载器
  showLoader();

  /**
   * 处理多个解决方案的内部函数
   * @param {Object} challenge - 挑战对象
   * @param {Object} set - 集合对象
   * @param {Array} solutions - 解决方案数组
   * @returns {Promise<boolean>} 处理结果
   */
  const processSolutions = async (challenge, set, solutions) => {
    // 获取SBC用的阵容查找表
    const squadLookup = await getSquadLookupForSbc();
    const rewardPackIds = [];

    // 遍历所有解决方案
    for (const [index, solution] of solutions.entries()) {
      const currentCount = index + 1;

      // 提取球员定义ID
      const playerDefinitionIds = solution.map((player) => player?.definitionId ?? null);

      // 保存解决方案
      await saveSolution(playerDefinitionIds, squadLookup, challenge, true);
      await wait(1.5);

      // 提交挑战
      const { success, data } = await submitChallenge(
        challenge,
        set,
        true,
        services.Chemistry.isFeatureEnabled()
      );

      // 如果提交失败
      if (!success) {
        sendUINotification(
          getLocalization().localize("notification.sbcChallenges.failedToSubmit"),
          UINotificationTypeEnum.NEGATIVE
        );
        // 如果不是第一个解决方案，返回true表示部分成功
        return currentCount > 1;
      }

      // 等待2.5秒
      await wait(2.5);

      // 显示进度通知
      sendUINotification(
        translate("multiSolveProgress", {
          currentCount,
          totalSolution: solutions.length,
          solutionsLeft: solutions.length - currentCount,
        }),
        UINotificationTypeEnum.POSITIVE
      );

      // 收集奖励包ID
      rewardPackIds.push(...getPackRewardIds(challenge));

      // 如果集合完成，也收集集合的奖励包ID
      if (data?.setCompleted) {
        rewardPackIds.push(...getPackRewardIds(set));
      }

      // 检查是否可以继续处理下一个解决方案
      const canContinue = await canContinueChallenge(challenge, set, currentCount, solutions.length);
      if (!canContinue) {
        return currentCount >= 1;
      }
    }

    // 自动打开奖励包
    await autoOpenRewardsPack(rewardPackIds);
    return true;
  };

  // 处理解决方案
  const success = await processSolutions(challenge, set, solutions);

  // 如果成功，清理缓存并获取未分配物品
  if (success) {
    clearUnAssignedCache();
    await getUnAssignedItems();
  }

  // 隐藏加载器
  hideLoader();
};
