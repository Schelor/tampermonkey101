/**
 * FIFA Ultimate Team Enhancer - 俱乐部搜索头部覆盖
 * 原始代码经过webpack打包和混淆，这里是还原后的清晰版本
 */

import { AuthManager } from "./auth_manager.js";
import { wait } from "./utils/async.js";
import { InMemoryStore } from "./store/in_memory_store.js";
import { getUnAssignedItems } from "./services/item_service.js";
import { SearchTypeEnum } from "./enums/search_type.js";
import { clearAllActions, createButton, getLocalization } from "./utils/dom.js";
import { translate } from "./utils/localization.js";
import { showLoader, hideLoader, sendUINotification } from "./utils/ui.js";
import { trackClubPlayers } from "./services/analytics.js";
import { openUrl } from "./utils/browser.js";
import { config } from "./config.js";

/**
 * 俱乐部搜索头部覆盖函数
 * 增强UTClubItemSearchHeaderView的功能
 */
export function clubSearchHeaderOverride() {
  // 保存原始方法引用
  const originalGenerate = UTClubItemSearchHeaderView.prototype._generate;
  const originalDestroyGeneratedElements =
    UTClubItemSearchHeaderView.prototype.destroyGeneratedElements;
  const originalInit = UTClubItemSearchHeaderView.prototype.init;
  const originalToggleSearch =
    UTClubItemSearchHeaderView.prototype.toggleSearch;

  // 获取增强器数据存储
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  /**
   * 覆盖初始化方法
   */
  UTClubItemSearchHeaderView.prototype.init = function (...args) {
    const result = originalInit.call(this, ...args);

    // 初始化批量操作按钮
    this.custom_bulkActionButton?.init();
    this.custom_bulkActionButton?.show();

    // 清除所有点击事件
    clearAllActions(EventType.TAP, this.custom_bulkActionButton);

    // 添加批量操作按钮点击事件
    this.custom_bulkActionButton?.addTarget(
      this.custom_bulkActionButton,
      () => {
        // 创建批量操作弹窗
        const bulkActionPopup = new UTBulkActionPopupViewController();
        bulkActionPopup.init();

        const popupView = bulkActionPopup.getView();
        popupView.setTitle(
          getLocalization().localize("bulkAction.itemspopup.title")
        );

        // 设置自定义俱乐部操作按钮
        popupView.custom_setUpCustomClubActionButton();

        // 激活弹窗
        gPopupClickShield.setActivePopup(bulkActionPopup);
      },
      "tap"
    );

    return result;
  };

  /**
   * 覆盖搜索切换方法
   */
  UTClubItemSearchHeaderView.prototype.toggleSearch = function (...args) {
    const result = originalToggleSearch.call(this, ...args);

    // 根据搜索条件显示/隐藏按钮
    if (
      enhancerData.lastSearchClubCriteria?.type !== SearchTypeEnum.PLAYER ||
      enhancerData.clubSearchStoragePlayers
    ) {
      // 隐藏批量操作按钮和查看收藏按钮
      this.custom_bulkActionButton?.hide();
      hide(this.custom_viewCollectionBtn?.element);
    } else {
      // 显示批量操作按钮和查看收藏按钮
      this.custom_bulkActionButton?.show();
      show(this.custom_viewCollectionBtn?.element);
    }

    return result;
  };

  /**
   * 覆盖生成方法
   */
  UTClubItemSearchHeaderView.prototype._generate = function (...args) {
    if (!this._generated) {
      // 调用原始生成方法
      originalGenerate.call(this, ...args);

      // 创建查看收藏按钮
      this.custom_viewCollectionBtn = createButton({
        label: translate("viewYourCollections"),
        onClick: async () => {
          const { loggedInUserName } = enhancerData;

          if (loggedInUserName || isMarketAlert()) {
            // 显示加载器
            showLoader();
            sendUINotification(translate("syncCollections"));

            // 追踪俱乐部球员
            await trackClubPlayers();

            // 隐藏加载器
            hideLoader();

            // 打开收藏页面
            openUrl(
              `${config.nextDomain}/account/collection`,
              "_blank",
              "noopener"
            );
          } else {
            // 未登录，显示登录界面
            AuthManager.instance.signIn();
          }
        },
        customClass: "btn-standard mini view-collection",
        id: "view_club_collection",
      });

      // 创建按钮容器
      const buttonContainer = document.createElement("div");
      buttonContainer.append(this.custom_viewCollectionBtn.element);
      this.__searchContainer.append(buttonContainer);

      // 创建批量操作按钮
      this.custom_bulkActionButton = new UTImageButtonControl();
      const bulkButtonElement = this.custom_bulkActionButton.getRootElement();
      bulkButtonElement.classList.add("filter-btn", "custom-bulk-btn");

      // 添加到根元素
      this.getRootElement()?.append(bulkButtonElement);
    }
  };

  /**
   * 覆盖销毁生成元素方法
   */
  UTClubItemSearchHeaderView.prototype.destroyGeneratedElements = function (
    ...args
  ) {
    // 调用原始销毁方法
    originalDestroyGeneratedElements.call(this, ...args);

    // 销毁自定义按钮
    this.custom_bulkActionButton?.destroy();
    this.custom_viewCollectionBtn?.destroy();

    // 清理引用
    this.custom_bulkActionButton = undefined;
    this.custom_viewCollectionBtn = undefined;
  };
}

// 导出覆盖函数
export { clubSearchHeaderOverride };
