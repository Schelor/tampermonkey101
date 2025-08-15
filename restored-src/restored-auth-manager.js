// 还原后的认证管理器模块代码
import { config } from './config'; // 对应 n(30712)
import { isMarketAlert, fireExternalEvent, isCompanionApp, openUrl, sendRequest } from './utils'; // 对应 n(82125)
import { translate } from './translation-utils'; // 对应 n(44669)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { getUserPersonaId, sendUINotification, showLoader, hideLoader } from './sbc-module'; // 对应 n(13808)
import { getLocalization } from './ui-utils'; // 对应 n(27988)
import { createClient } from './supabase-client'; // 对应 n(23644)
import { showPurchasePopup } from './purchase-popup'; // 对应 n(1963)
import { showLoginPopup } from './login-popup'; // 对应 n(36852)
import { companionEntitlementId, goldEntitlementId, pcEntitlementId } from './entitlement-ids'; // 对应 n(15306)

// 访问级别映射
const accessLevelLabels = {
  enhancerGold: "Enhancer Gold",
  enhancerPc: "Enhancer PC",
  enhancerFree: "Enhancer Free",
  enhancerCompanion: "Enhancer Companion",
};

/**
 * 认证管理器类
 * 处理用户认证、权限管理和访问控制
 */
export class AuthManager {
  static _instance;

  // 私有属性
  _userAccessLevel;
  _computingAccessLevel;
  _loggedInPersonaId;
  _isUserLoggedIn;
  _loggedInUser;
  _client;
  _redirectUrl = "https://www.ea.com/ea-sports-fc/ultimate-team/web-app";
  _requestLimit = 5;
  _accountLimit = 1;

  constructor() {
    // 初始化属性
    this._userAccessLevel = null;
    this._computingAccessLevel = false;
    this._loggedInPersonaId = null;
    this._loggedInUser = null;
    this._isUserLoggedIn = false;

    // 创建Supabase客户端
    this._client = createClient(
      "https://rtapi.futnext.com",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bmJlc3JseWFlcnBjdm9kYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2NzM5NTgsImV4cCI6MjAzNzI0OTk1OH0.kLflOj69_IW4NnPUWtZG3bk4Fxi8dXazW4mbLTLjoQs"
    );
  }

  /**
   * 获取单例实例
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new AuthManager();
    }
    return this._instance;
  }

  /**
   * 初始化用户信息
   */
  async initUser() {
    const user = services.User.getUser();
    const { id: personaId, name: personaName } = user.getSelectedPersona();

    const userData = {
      personaId: personaId,
      personaName: personaName,
      language: services.Localization.locale.language,
      accountId: user.id,
    };

    this._loggedInPersonaId = personaId;

    if (isMarketAlert()) {
      // 市场警报模式
      fireExternalEvent(
        {
          identifier: `${Math.floor(Date.now())}_initEAUser`,
          ...userData,
        },
        "initUser"
      );
    } else {
      // 普通模式
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        await this._client.auth.updateUser({
          data: {
            webapp_persona_id: userData.personaId,
            webapp_persona_name: userData.personaName,
            webapp_id: userData.accountId,
          },
        });
      }
    }
  }

  /**
   * 获取角色ID
   */
  getPersonaId() {
    if (!this._loggedInPersonaId) {
      this._loggedInPersonaId = getUserPersonaId();
    }
    return this._loggedInPersonaId;
  }

  /**
   * 切换认证状态
   */
  toggleAuth() {
    if (this._isUserLoggedIn) {
      this.signOut();
    } else {
      this.signIn();
    }
  }

  /**
   * 使用凭据登录
   */
  async signInWithCredentials(email, password) {
    if (!email || !password) {
      const localization = getLocalization();
      sendUINotification(
        localization.localize("login.wrongpassword.wrongusername"),
        UINotificationTypeEnum.NEGATIVE
      );
      return;
    }

    showLoader();

    const {
      data: { session },
      error,
    } = await this._client.auth.signInWithPassword({
      email: email,
      password: password,
    });

    hideLoader();

    if (!error?.message && session) {
      if (session?.access_token && session?.refresh_token) {
        window.location.reload();
      }
    } else {
      sendUINotification(
        error?.message ?? translate("loginFailed"),
        UINotificationTypeEnum.NEGATIVE
      );
    }
  }

  /**
   * 使用第三方提供商登录
   */
  async signInWithProvider(provider) {
    const {
      data: { url },
    } = await this._client.auth.signInWithOAuth({
      provider: provider,
      options: { redirectTo: `${this._redirectUrl}/` },
    });

    if (url) {
      if (isCompanionApp()) {
        this.urlOpener(url);
      } else {
        openUrl(url, "self");
      }
    } else {
      sendUINotification(
        translate("loginFailed"),
        UINotificationTypeEnum.NEGATIVE
      );
    }
  }

  /**
   * URL打开器（用于Companion应用）
   */
  urlOpener = (url) => {
    const browser = cordova.InAppBrowser.open(url);

    browser.addEventListener(
      "loadstart",
      ({ url: currentUrl }) => {
        if (currentUrl.startsWith(this._redirectUrl)) {
          const fragment = currentUrl.split("#")[1];
          browser.close();
          setTimeout(() => {
            window.location.href = `${window.location.href}#${fragment}`;
            window.location.reload();
          }, 250);
        }
      },
      false
    );

    browser.addEventListener(
      "loadstop",
      ({ url: currentUrl }) => {
        if (currentUrl.startsWith(this._redirectUrl)) {
          browser.close();
        }
      },
      false
    );
  };

  /**
   * 显示登录界面
   */
  signIn() {
    showLoginPopup();
  }

  /**
   * 检查是否已登录
   */
  isSignedIn() {
    return this._isUserLoggedIn;
  }

  /**
   * 登出
   */
  async signOut() {
    await this._client.auth.signOut();
    window.location.reload();
  }

  /**
   * 获取当前用户
   */
  async getCurrentUser() {
    if (this._loggedInUser) {
      return this._loggedInUser;
    }

    const {
      data: { user },
    } = await this._client.auth.getUser();

    this._loggedInUser = user;
    return this._loggedInUser;
  }

  /**
   * 获取用户名
   */
  async getUserName() {
    const user = await this.getCurrentUser();
    if (user) {
      return user.user_metadata?.display_name ?? "App User";
    }
  }

  /**
   * 获取访问令牌
   */
  async getAccessToken() {
    const {
      data: { session },
      error,
    } = await this._client.auth.getSession();

    if (error?.message) {
      return null;
    }

    return session?.access_token ?? null;
  }

  /**
   * 获取通知令牌
   */
  async getNotificationToken() {
    const user = await this.getCurrentUser();
    return user?.user_metadata?.device_token
      ?.replace("ExponentPushToken[", "")
      .replace("]", "");
  }

  /**
   * 检查是否有增强器访问权限
   */
  hasEnhancerAccess(showPopup = false) {
    const hasAccess = this.checkHasEnhancerAccess();

    if (showPopup && !hasAccess) {
      showPurchasePopup();
    }

    return hasAccess;
  }

  /**
   * 检查增强器访问权限（内部方法）
   */
  checkHasEnhancerAccess() {
    if (this._userAccessLevel === "enhancerCompanion") {
      return true;
    }

    if (isMarketAlert()) {
      return this._userAccessLevel === "enhancerGold";
    } else {
      return (
        this._userAccessLevel === "enhancerGold" ||
        this._userAccessLevel === "enhancerPc"
      );
    }
  }

  /**
   * 获取访问权限
   */
  async fetchAccess() {
    const accessToken = await this.getAccessToken();

    // 默认设置为免费版
    this._userAccessLevel = "enhancerFree";

    // 如果不是市场警报模式且没有访问令牌，返回免费版
    if (!isMarketAlert() && !accessToken) {
      return this._userAccessLevel;
    }

    // 请求访问级别
    const response = await sendRequest(
      `${config.api.nextRestBase}/auth`,
      "GET",
      `${Math.floor(Date.now())}_accessLevel`,
      undefined,
      {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      }
    );

    this._isUserLoggedIn = true;

    const {
      highestEntitlement,
      limits: {
        sbc: { requestLimit, accountLimit },
      },
    } = JSON.parse(response ?? '{"limits":{"sbc": {}}}');

    // 设置限制
    this._accountLimit = accountLimit;
    this._requestLimit = requestLimit;

    // 确定访问级别
    const accessLevelMapping = [
      {
        check: () => highestEntitlement === companionEntitlementId,
        value: "enhancerCompanion",
      },
      {
        check: () => highestEntitlement === goldEntitlementId,
        value: "enhancerGold",
      },
      {
        check: () => highestEntitlement === pcEntitlementId,
        value: "enhancerPc",
      },
    ];

    const matchedLevel = accessLevelMapping.find((level) => level.check());
    this._userAccessLevel = matchedLevel?.value ?? "enhancerFree";

    return this._userAccessLevel;
  }

  /**
   * 获取访问级别
   */
  async getAccessLevel() {
    const shouldShowNotification = !this._computingAccessLevel;

    if (!this._userAccessLevel) {
      this._computingAccessLevel = true;
      await this.fetchAccess();

      if (shouldShowNotification) {
        sendUINotification(
          translate("userAccessLevel", {
            level: this.formatAccess(),
          })
        );
      }
    }

    return this._userAccessLevel;
  }

  /**
   * 获取限制信息
   */
  getLimits() {
    return {
      sbc: {
        requestLimit: this._requestLimit,
        accountLimit: this._accountLimit,
      },
    };
  }

  /**
   * 格式化访问级别显示
   */
  formatAccess() {
    return accessLevelLabels[this._userAccessLevel ?? "enhancerFree"];
  }
}
