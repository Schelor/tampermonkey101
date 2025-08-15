// 还原后的加载器工具模块代码

/**
 * 显示加载器
 * @param {string} shieldType - 遮罩类型，默认为LOADING
 */
export const showLoader = (shieldType = EAClickShieldView.Shield.LOADING) => {
  gClickShield.showShield(shieldType);
};

/**
 * 隐藏加载器
 * @param {string} shieldType - 遮罩类型，默认为LOADING
 */
export const hideLoader = (shieldType = EAClickShieldView.Shield.LOADING) => {
  gClickShield.hideShield(shieldType);
};
