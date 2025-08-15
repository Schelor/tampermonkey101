/**
 * FIFA Ultimate Team Enhancer - 认证管理类
 * 原始代码经过webpack打包和混淆，这里是还原后的清晰版本
 */

class AuthenticationManager {
  static _instance;

  // 用户相关属性
  _userAccessLevel = null;
  _computingAccessLevel = false;
  _loggedInPersonaId = null;
  _isUserLoggedIn = false;
  _loggedInUser = null;

  // 客户端配置
  _client;
  _redirectUrl = "https://www.ea.com/ea-sports-fc/ultimate-team/web-app";

  // 限制配置
  _requestLimit = 5;
  _accountLimit = 1;

  constructor() {
    // 初始化用户相关属性
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
      this._instance = new AuthenticationManager();
    }
    return this._instance;
  }

  /**
   * 初始化用户
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
      // 发送外部事件
      fireExternalEvent(
        {
          identifier: `${Math.floor(Date.now())}_initEAUser`,
          ...userData,
        },
        "initUser"
      );
    } else {
      // 更新用户信息
      const currentUser = await this.getCurrentUser();
      if (currentUser) {
        this._client.auth.updateUser({
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
   * 获取用户Persona ID
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
   * 使用OAuth提供商登录
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
   * URL打开器（用于移动端应用）
   */
  urlOpener = (url) => {
    const browser = cordova.InAppBrowser.open(url);

    browser.addEventListener(
      "loadstart",
      ({ url }) => {
        if (url.startsWith(this._redirectUrl)) {
          const hash = url.split("#")[1];
          browser.close();
          setTimeout(() => {
            window.location.href = `${window.location.href}#${hash}`;
            window.location.reload();
          }, 250);
        }
      },
      false
    );

    browser.addEventListener(
      "loadstop",
      ({ url }) => {
        if (url.startsWith(this._redirectUrl)) {
          browser.close();
        }
      },
      false
    );
  };

  /**
   * 显示登录弹窗
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
    if (user?.user_metadata?.device_token) {
      return user.user_metadata.device_token
        .replace("ExponentPushToken[", "")
        .replace("]", "");
    }
  }

  /**
   * 检查是否有增强器访问权限
   */
  hasEnhancerAccess(showPurchasePopup = false) {
    const hasAccess = this.checkHasEnhancerAccess();
    if (showPurchasePopup && !hasAccess) {
      showPurchasePopup();
    }
    return hasAccess;
  }

  /**
   * 检查增强器访问权限
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

    // 默认设置为免费用户
    this._userAccessLevel = "enhancerFree";

    // 如果不是市场提醒且没有访问令牌，返回免费权限
    if (!isMarketAlert() && !accessToken) {
      return this._userAccessLevel;
    }

    // 发送请求获取用户权限
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

    this._accountLimit = accountLimit;
    this._requestLimit = requestLimit;

    // 根据权限ID确定用户级别
    const accessLevelMap = [
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

    const matchedLevel = accessLevelMap.find((level) => level.check());
    this._userAccessLevel = matchedLevel?.value ?? "enhancerFree";

    return this._userAccessLevel;
  }

  /**
   * 获取访问级别
   */
  async getAccessLevel() {
    const shouldNotify = !this._computingAccessLevel;

    if (!this._userAccessLevel) {
      this._computingAccessLevel = true;
      await this.fetchAccess();

      if (shouldNotify) {
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
    return accessLevelDisplayNames[this._userAccessLevel ?? "enhancerFree"];
  }
}

// 导出单例实例
export default AuthenticationManager;
