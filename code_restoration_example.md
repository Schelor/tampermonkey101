# Webpack打包代码还原示例

## 原始混淆代码

```javascript
class g {
  static _instance;
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
    ((this._userAccessLevel = null),
      (this._computingAccessLevel = !1),
      (this._loggedInPersonaId = null),
      (this._loggedInUser = null),
      (this._isUserLoggedIn = !1),
      (this._client = (0, c.createClient)(
        "https://rtapi.futnext.com",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6bmJlc3JseWFlcnBjdm9kYWpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjE2NzM5NTgsImV4cCI6MjAzNzI0OTk1OH0.kLflOj69_IW4NnPUWtZG3bk4Fxi8dXazW4mbLTLjoQs",
      )));
  }
  static get instance() {
    return (
      this._instance || (this._instance = new g()),
      this._instance
    );
  }
  async initUser() {
    const e = services.User.getUser(),
      { id: t, name: n } = e.getSelectedPersona(),
      a = {
        personaId: t,
        personaName: n,
        language: services.Localization.locale.language,
        accountId: e.id,
      };
    ((this._loggedInPersonaId = t),
      (0, i.isMarketAlert)()
        ? (0, i.fireExternalEvent)(
            {
              identifier: `${Math.floor(Date.now())}_initEAUser`,
              ...a,
            },
            "initUser",
          )
        : (await this.getCurrentUser()) &&
          this._client.auth.updateUser({
            data: {
              webapp_persona_id: a.personaId,
              webapp_persona_name: a.personaName,
              webapp_id: a.accountId,
            },
          }));
  }
  getPersonaId() {
    return (
      this._loggedInPersonaId ||
        (this._loggedInPersonaId = (0, o.getUserPersonaId)()),
      this._loggedInPersonaId
    );
  }
  toggleAuth() {
    this._isUserLoggedIn ? this.signOut() : this.signIn();
  }
  async signInWithCredentials(e, t) {
    if (!e || !t) {
      const e = (0, l.getLocalization)();
      return void (0, o.sendUINotification)(
        e.localize("login.wrongpassword.wrongusername"),
        s.UINotificationTypeEnum.NEGATIVE,
      );
    }
    (0, o.showLoader)();
    const {
      data: { session: n },
      error: a,
    } = await this._client.auth.signInWithPassword({
      email: e,
      password: t,
    });
    ((0, o.hideLoader)(),
      !a?.message && n
        ? n?.access_token &&
          n?.refresh_token &&
          window.location.reload()
        : (0, o.sendUINotification)(
            a?.message ?? (0, r.translate)("loginFailed"),
            s.UINotificationTypeEnum.NEGATIVE,
          ));
  }
  async signInWithProvider(e) {
    const {
      data: { url: t },
    } = await this._client.auth.signInWithOAuth({
      provider: e,
      options: { redirectTo: `${this._redirectUrl}/` },
    });
    t
      ? (0, i.isCompanionApp)()
        ? this.urlOpener(t)
        : (0, i.openUrl)(t, "self")
      : (0, o.sendUINotification)(
          (0, r.translate)("loginFailed"),
          s.UINotificationTypeEnum.NEGATIVE,
        );
  }
  urlOpener = (e) => {
    const t = cordova.InAppBrowser.open(e);
    (t.addEventListener(
      "loadstart",
      ({ url: e }) => {
        if (e.startsWith(this._redirectUrl)) {
          const n = e.split("#")[1];
          (t.close(),
            setTimeout(() => {
              ((window.location.href = `${window.location.href}#${n}`),
                window.location.reload());
            }, 250));
        }
      },
      !1,
    ),
      t.addEventListener(
        "loadstop",
        ({ url: e }) => {
          e.startsWith(this._redirectUrl) && t.close();
        },
        !1,
      ));
  };
  signIn() {
    (0, d.showLoginPopup)();
  }
  isSignedIn() {
    return this._isUserLoggedIn;
  }
  async signOut() {
    (await this._client.auth.signOut(), window.location.reload());
  }
  async getCurrentUser() {
    if (this._loggedInUser) return this._loggedInUser;
    const {
      data: { user: e },
    } = await this._client.auth.getUser();
    return ((this._loggedInUser = e), this._loggedInUser);
  }
  async getUserName() {
    const e = await this.getCurrentUser();
    if (e) return e.user_metadata?.display_name ?? "App User";
  }
  async getAccessToken() {
    const {
      data: { session: e },
      error: t,
    } = await this._client.auth.getSession();
    return t?.message ? null : (e?.access_token ?? null);
  }
  async getNotificationToken() {
    const e = await this.getCurrentUser();
    return e?.user_metadata?.device_token
      ?.replace("ExponentPushToken[", "")
      .replace("]", "");
  }
  hasEnhancerAccess(e = !1) {
    const t = this.checkHasEnhancerAccess();
    return (e && !t && (0, u.showPurchasePopup)(), t);
  }
  checkHasEnhancerAccess() {
    return (
      "enhancerCompanion" === this._userAccessLevel ||
      ((0, i.isMarketAlert)()
        ? "enhancerGold" === this._userAccessLevel
        : "enhancerGold" === this._userAccessLevel ||
          "enhancerPc" === this._userAccessLevel)
    );
  }
  async fetchAccess() {
    const e = await this.getAccessToken();
    if (
      ((this._userAccessLevel = "enhancerFree"),
        !(0, i.isMarketAlert)() && !e)
    )
      return this._userAccessLevel;
    const t = await (0, i.sendRequest)(
      `${a.config.api.nextRestBase}/auth`,
      "GET",
      `${Math.floor(Date.now())}_accessLevel`,
      void 0,
      {
        Authorization: `Bearer ${e}`,
        "Content-Type": "application/json",
      },
    );
    this._isUserLoggedIn = !0;
    const {
      highestEntitlement: n,
      limits: {
        sbc: { requestLimit: r, accountLimit: s },
      },
    } = JSON.parse(t ?? '{"limits":{"sbc": {}}}');
    ((this._accountLimit = s), (this._requestLimit = r));
    const o = [
      {
        check: () => n === p.companionEntitlementId,
        value: "enhancerCompanion",
      },
      { check: () => n === p.goldEntitlementId, value: "enhancerGold" },
      { check: () => n === p.pcEntitlementId, value: "enhancerPc" },
    ].find((e) => e.check());
    return (
      (this._userAccessLevel = o?.value ?? "enhancerFree"),
      this._userAccessLevel
    );
  }
  async getAccessLevel() {
    const e = !this._computingAccessLevel;
    return (
      this._userAccessLevel ||
        ((this._computingAccessLevel = !0),
          await this.fetchAccess(),
          e &&
            (0, o.sendUINotification)(
              (0, r.translate)("userAccessLevel", {
                level: this.formatAccess(),
              }),
            )),
      this._userAccessLevel
    );
  }
  getLimits() {
    return {
      sbc: {
        requestLimit: this._requestLimit,
        accountLimit: this._accountLimit,
      },
    };
  }
  formatAccess() {
    return m[this._userAccessLevel ?? "enhancerFree"];
  }
}
```

## 还原步骤分析

### 1. 类名和变量名还原

**混淆代码**:
```javascript
class g {
  static _instance;
  _userAccessLevel;
  // ...
}
```

**还原后**:
```javascript
class AuthenticationManager {
  static _instance;
  _userAccessLevel = null;
  // ...
}
```

### 2. 布尔值还原

**混淆代码**:
```javascript
this._computingAccessLevel = !1;
this._isUserLoggedIn = !1;
```

**还原后**:
```javascript
this._computingAccessLevel = false;
this._isUserLoggedIn = false;
```

### 3. 函数调用还原

**混淆代码**:
```javascript
(0, c.createClient)(
  "https://rtapi.futnext.com",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);
```

**还原后**:
```javascript
createClient(
  "https://rtapi.futnext.com",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
);
```

### 4. 条件表达式还原

**混淆代码**:
```javascript
(0, i.isMarketAlert)()
  ? (0, i.fireExternalEvent)(...)
  : (await this.getCurrentUser()) &&
    this._client.auth.updateUser(...);
```

**还原后**:
```javascript
if (isMarketAlert()) {
  fireExternalEvent(...);
} else {
  const currentUser = await this.getCurrentUser();
  if (currentUser) {
    this._client.auth.updateUser(...);
  }
}
```

### 5. 三元运算符还原

**混淆代码**:
```javascript
this._isUserLoggedIn ? this.signOut() : this.signIn();
```

**还原后**:
```javascript
if (this._isUserLoggedIn) {
  this.signOut();
} else {
  this.signIn();
}
```

### 6. 变量名还原

**混淆代码**:
```javascript
const e = services.User.getUser(),
  { id: t, name: n } = e.getSelectedPersona(),
  a = {
    personaId: t,
    personaName: n,
    language: services.Localization.locale.language,
    accountId: e.id,
  };
```

**还原后**:
```javascript
const user = services.User.getUser();
const { id: personaId, name: personaName } = user.getSelectedPersona();
const userData = {
  personaId: personaId,
  personaName: personaName,
  language: services.Localization.locale.language,
  accountId: user.id,
};
```

### 7. 方法链还原

**混淆代码**:
```javascript
return e?.user_metadata?.device_token
  ?.replace("ExponentPushToken[", "")
  .replace("]", "");
```

**还原后**:
```javascript
if (user?.user_metadata?.device_token) {
  return user.user_metadata.device_token
    .replace("ExponentPushToken[", "")
    .replace("]", "");
}
```

## 还原后的完整代码

```javascript
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
    
    const { data: { session }, error } = await this._client.auth.signInWithPassword({
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
    const { data: { url } } = await this._client.auth.signInWithOAuth({
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
    
    const { data: { user } } = await this._client.auth.getUser();
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
    const { data: { session }, error } = await this._client.auth.getSession();
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
      return this._userAccessLevel === "enhancerGold" || 
             this._userAccessLevel === "enhancerPc";
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
    
    const matchedLevel = accessLevelMap.find(level => level.check());
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
```

## 还原技巧总结

### 1. 识别模式
- **单字母变量名**: 通常是混淆后的变量，需要根据上下文推断含义
- **数字常量**: `!1` = `false`, `!0` = `true`
- **函数调用**: `(0, c.createClient)` 表示调用模块 `c` 的 `createClient` 函数

### 2. 结构分析
- **类定义**: 识别类的属性和方法
- **单例模式**: 通过 `static _instance` 和 `get instance()` 识别
- **异步方法**: 通过 `async/await` 模式识别

### 3. 逻辑还原
- **条件语句**: 将三元运算符转换为 if-else 语句
- **方法链**: 将链式调用分解为多个步骤
- **错误处理**: 识别 try-catch 和错误处理逻辑

### 4. 命名规范
- **类名**: 使用描述性的类名（如 `AuthenticationManager`）
- **方法名**: 使用动词+名词的命名方式
- **变量名**: 使用有意义的变量名

### 5. 注释添加
- **功能说明**: 为每个方法添加功能说明
- **参数说明**: 为参数添加类型和用途说明
- **返回值说明**: 为返回值添加说明

通过以上步骤，可以将混淆的webpack打包代码还原为清晰可读的代码，便于理解和维护。 