// 还原后的快速跳转最后挑战模块代码
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)
import { getChallengesBySetIds, sendUINotification, loadChallenge } from './sbc-module'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { getLocalization, getNavigationController } from './observable-utils'; // 对应 n(27988)

/**
 * 导航到特定的SBC挑战
 * @param {Object} set - SBC集合对象
 * @param {Object} challenge - 挑战对象
 * @returns {Promise<void>}
 */
const navigateToChallenge = async (set, challenge) => {
  // 加载挑战数据
  await loadChallenge(challenge);

  // 根据设备类型创建相应的视图控制器
  const viewController = isPhone()
    ? new UTSBCSquadOverviewViewController()
    : new UTSBCSquadSplitViewController();

  // 初始化视图控制器
  viewController.initWithSBCSet(set, challenge.id);

  // 获取导航控制器并导航
  const navigationController = getNavigationController();
  navigationController.pushViewController(viewController, true);
  navigationController.setNavigationTitle(challenge.name);
};

/**
 * 导航到SBC集合页面
 * @param {Object} set - SBC集合对象
 */
const navigateToSet = (set) => {
  // 根据设备类型创建相应的视图控制器
  const viewController = isPhone()
    ? new UTSBCChallengesViewController()
    : new UTSBCGroupChallengeSplitViewController();

  // 初始化视图控制器
  viewController.initWithSBCSet(set);

  // 获取导航控制器并导航
  const navigationController = getNavigationController();
  navigationController.pushViewController(viewController, true);
  navigationController.setNavigationTitle(set.name);
};

/**
 * 快速跳转到最后一个挑战
 * @returns {Promise<void>}
 */
export const quickGoToLastChallenge = async () => {
  // 从内存存储中获取最后打开的SBC信息
  const {
    lastOpenedSBC: { challengeId, setId },
  } = InMemoryStore.instance.get("enhancerData");

  // 如果没有有效的挑战ID或集合ID，直接返回
  if (challengeId === -1 || setId === -1) {
    return;
  }

  // 获取本地化对象
  const localization = getLocalization();

  // 根据集合ID获取挑战数据
  const sets = await getChallengesBySetIds(new Set([setId]));

  // 如果没有找到集合，显示错误通知
  if (!sets?.[0]) {
    sendUINotification(
      localization.localize("notification.sbcSets.failedToLoad"),
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }

  const set = sets[0];
  const { challengesCompletedCount, challengesCount } = set;

  // 如果所有挑战都已完成，显示错误通知
  if (challengesCompletedCount === challengesCount) {
    sendUINotification(
      localization.localize("notification.sbcChallenges.failedToStart"),
      UINotificationTypeEnum.NEGATIVE
    );
    return;
  }

  // 查找指定的未完成挑战
  const targetChallenge = set
    .getChallenges()
    .find(({ id, status }) => id === challengeId && status !== "COMPLETED");

  if (targetChallenge) {
    // 如果找到了目标挑战，导航到该挑战
    await navigateToChallenge(set, targetChallenge);
  } else {
    // 如果没有找到目标挑战，导航到集合页面
    navigateToSet(set);
  }
};
