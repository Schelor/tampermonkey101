import {
  showLoader,
  hideLoader,
  sendUINotification,
  openPack
} from './api'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { getLocalization } from './localization'; // 对应 n(27988)
import { Analytics } from './analytics'; // 对应 n(57439)
import { InMemoryStore } from './store/InMemoryStore'; // 对应 n(32024)
import { translate } from './translator'; // 对应 n(44669)
import { handlePackResponse } from './packResponseHandler'; // 对应 n(99367)
import { getPackOpeningErrorMessage } from './errorHandler'; // 对应 n(24728)
import { showPackOpenLogs } from './logsDisplay'; // 对应 n(36485)

/**
 * 自动打开我的包功能
 * @param {Array} autoOpenActions - 自动打开动作配置
 * @param {Array} packsToOpen - 要打开的包数组
 */
export const openMyPacks = async (autoOpenActions, packsToOpen) => {
  const localization = getLocalization();

  // 显示加载器并发送开始事件
  showLoader();
  Analytics.instance.fireEvent("auto_open_my_pack_start");

  let isSuccessful = true;
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  // 清空自动包打开日志
  enhancerData.autoPackOpenLogs.clear();

  let openedPacksCount = 0;

  // 遍历所有要打开的包
  for (const pack of packsToOpen) {
    // 如果之前有失败，停止处理
    if (!isSuccessful) break;

    // 显示正在打开包的通知
    sendUINotification(
      translate("openingPack", { packName: pack.packName })
    );

    // 检查是否有未分配的已购买物品
    if (repositories.Item.numItemsInCache(ItemPile.PURCHASED)) {
      sendUINotification(
        localization.localize("popup.error.unassignedItemsEntitlementTitle"),
        UINotificationTypeEnum.NEGATIVE
      );
      break;
    }

    try {
      // 执行打开包操作
      const packResponse = await openPack(pack);

      // 记录最后打开的包名称
      enhancerData.lastAutoOpenedPackName = localization.localize(pack.packName);

      // 检查打开是否成功
      if (!packResponse.success) {
        isSuccessful = false;
        break;
      }

      // 处理包响应
      await handlePackResponse(packResponse, autoOpenActions);

      // 增加已打开包计数
      openedPacksCount += 1;

      // 显示进度通知
      services.Notification.queue([
        translate("packOpenProgress", {
          currentCount: openedPacksCount,
          totalPacks: packsToOpen.length,
          packsLeft: packsToOpen.length - openedPacksCount,
        }),
        UINotificationTypeEnum.POSITIVE,
      ]);

    } catch (error) {
      // 处理打开包时的错误
      isSuccessful = false;
      sendUINotification(
        getPackOpeningErrorMessage(error),
        UINotificationTypeEnum.NEGATIVE
      );
    }
  }

  // 发送完成事件（成功或失败）
  Analytics.instance.fireEvent(
    isSuccessful ? "auto_open_my_pack_success" : "auto_open_my_pack_fail"
  );

  // 显示包打开日志
  showPackOpenLogs(enhancerData.autoPackOpenLogs);

  // 隐藏加载器
  hideLoader();
};
