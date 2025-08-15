// 还原后的显示购买弹窗模块代码
import { isMarketAlert, fireExternalEvent, isCompanionApp, openUrl, maskEmail } from './utils'; // 对应 n(82125)
import { createButton, showPopUp } from './ui-utils'; // 对应 n(27988)
import { translate } from './translation-utils'; // 对应 n(44669)
import { createLabelContainer } from './label-utils'; // 对应 n(66175)
import { config } from './config'; // 对应 n(30712)
import { AuthManager } from './auth-manager'; // 对应 n(46639)

/**
 * 创建节标题
 * @param {string} text - 标题文本
 * @returns {HTMLElement} 标题元素
 */
const createSectionHeader = (text) => {
  const header = document.createElement("span");
  header.classList.add("section-wrapper-header");
  header.append(createLabelContainer(text));
  return header;
};

/**
 * 显示购买弹窗
 * 根据用户登录状态和平台类型显示相应的购买订阅界面
 */
export const showPurchasePopup = async () => {
  const isUserSignedIn = AuthManager.instance.isSignedIn();

  // 创建弹窗内容和按钮
  const [popupContent, subscriptionButton] = await createPopupContent();

  // 配置弹窗选项
  const dialogOptions = [
    { labelEnum: 116 }, // 联系支持
    { labelEnum: enums.UIDialogOptions.OK } // 确定
  ];

  // 如果用户未登录，添加登录选项
  if (!isUserSignedIn) {
    dialogOptions.unshift({ labelEnum: 118 }); // 登录
  }

  // 显示弹窗
  showPopUp({
    title: translate("premiumFeature"),
    message: popupContent,
    onSelect: async (selectedOption) => {
      if (selectedOption === 116) {
        // 联系支持 - 打开Discord
        openUrl(
          `https://discord.com/invite/${config.discordInvite}`,
          "discord"
        );
      } else if (selectedOption === 118) {
        // 登录/登出切换
        AuthManager.instance.toggleAuth();
      }

      // 清理资源
      subscriptionButton.destroy();
      popupContent.remove();
    },
    id: "popup_purchase_subscription",
    options: dialogOptions,
  });
};

/**
 * 创建弹窗内容
 * @returns {Promise<[HTMLElement, Object]>} 返回内容元素和订阅按钮
 */
async function createPopupContent() {
  const container = document.createElement("div");
  container.classList.add("pop-up-table");

  // 创建功能说明标题
  const featureInfoHeader = document.createElement("span");
  featureInfoHeader.classList.add("section-wrapper-header");

  // 根据平台显示不同的说明文本
  const infoText = isMarketAlert()
    ? translate("premiumFeatureMobileInfo")
    : isCompanionApp()
      ? translate("premiumFeatureCompanionInfo")
      : translate("premiumFeatureInfo");

  featureInfoHeader.append(createLabelContainer(infoText));
  container.append(featureInfoHeader);

  // 创建按钮容器
  const buttonWrapper = document.createElement("div");
  buttonWrapper.classList.add("button-wrapper");

  // 创建获取订阅按钮
  const subscriptionButton = createButton({
    label: translate("getSubscription"),
    id: "popup_get_subscription",
    onClick: () => {
      if (isMarketAlert()) {
        // 市场警报模式 - 触发外部事件
        fireExternalEvent(undefined, "goToStore");
      } else {
        // 普通模式 - 打开订阅页面
        openUrl(`${config.nextDomain}/subscription`, "subscription");
      }
    },
    customClass: "call-to-action btn-gradient-secondary purchase-button",
  });

  buttonWrapper.append(subscriptionButton.element);
  container.append(buttonWrapper);

  // 如果不是市场警报模式，添加额外信息
  if (!isMarketAlert()) {
    // 添加已购买信息提示
    const purchaseInfoHeader = createSectionHeader(
      translate("alreadyPurchasedInfo")
    );
    container.append(purchaseInfoHeader);

    // 如果用户已登录，显示当前登录账户
    const currentUser = await AuthManager.instance.getCurrentUser();
    if (currentUser?.email) {
      const userAccountHeader = createSectionHeader(
        translate("currentLoggedInAccount", {
          userEmail: maskEmail(currentUser.email),
        })
      );
      container.append(userAccountHeader);
    }
  }

  return [container, subscriptionButton];
}
