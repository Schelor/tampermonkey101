import { wait, notNullorUndefined } from './utils'; // 对应 n(82125)
import { InMemoryStore } from './store/InMemoryStore'; // 对应 n(32024)
import { sendUINotification, getPacks, sendPinEvents } from './api'; // 对应 n(13808)
import { UINotificationTypeEnum, PurchasePackTypeEnum } from './enums'; // 对应 n(26735)
import { getLocalization } from './localization'; // 对应 n(27988)
import { openMyPacks } from './packManager'; // 对应 n(48379)

/**
 * 自动打开奖励包功能
 * @param {Array} packIds - 要打开的包ID数组
 */
export const autoOpenRewardsPack = async (packIds) => {
  // 获取增强器数据
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  // 检查自动打开功能是否启用
  if (
    !enhancerData.sbcPackAutoOpen.isEnabled ||
    !enhancerData.sbcPackAutoOpen.autoOpenActions ||
    !packIds.length
  ) {
    return;
  }

  // 检查是否有未分配的物品
  if (repositories.Item.numItemsInCache(ItemPile.PURCHASED)) {
    // 发送错误通知
    sendUINotification(
      getLocalization().localize("popup.error.unassignedItemsEntitlementTitle"),
      UINotificationTypeEnum.NEGATIVE
    );

    // 等待1秒后返回
    await wait(1);
    return;
  }

  // 获取增强器设置
  const enhancerSettings = InMemoryStore.instance.get("enhancerSettings");
  const originalAutoPackOpenSummary = enhancerSettings.autoPackOpenSummary;

  // 临时禁用自动包打开摘要
  enhancerSettings.autoPackOpenSummary = false;
  repositories.Store.setDirty();

  try {
    // 获取所有包数据
    const allPacks = await getPacks(
      PurchasePackTypeEnum.ALL,
      true, // includeMyPacks
      true  // includeStorePacks
    ).catch(() => []);

    // 过滤并分组我的包
    const myPacksMap = (allPacks?.filter(({ isMyPack }) => isMyPack) ?? [])
      .reduce((map, pack) => {
        const existingPacks = map.get(pack.id) ?? [];
        existingPacks.push(pack);
        map.set(pack.id, existingPacks);
        return map;
      }, new Map());

    // 根据传入的包ID获取对应的包实例
    const packsToOpen = packIds
      .map((packId) => {
        const packsForId = myPacksMap.get(packId);
        return packsForId?.pop(); // 取最后一个包
      })
      .filter(notNullorUndefined);

    // 发送统计事件
    sendPinEvents("HUB - STORE - PACKS: MYPACKS");

    // 执行自动打开包操作
    await openMyPacks(
      enhancerData.sbcPackAutoOpen.autoOpenActions,
      packsToOpen
    );

  } finally {
    // 恢复原始的自动包打开摘要设置
    enhancerSettings.autoPackOpenSummary = originalAutoPackOpenSummary;
  }
};
