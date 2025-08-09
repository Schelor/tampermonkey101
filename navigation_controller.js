/**
 * FIFA Ultimate Team Enhancer - 导航控制器工具类
 * 原始代码经过webpack打包和混淆，这里是还原后的清晰版本
 */

/**
 * 获取当前视图控制器
 * @returns {Object} 当前视图控制器实例
 */
export function getCurrentViewController() {
  return getAppMain()
    .getRootViewController()
    .getPresentedViewController()
    .getCurrentViewController();
}

/**
 * 获取当前控制器
 * @returns {Object} 当前控制器实例
 */
export function getCurrentController() {
  return getCurrentViewController().getCurrentController();
}

/**
 * 获取导航控制器
 * @returns {Object} 导航控制器实例
 */
export function getNavigationController() {
  return getCurrentController().getNavigationController();
}

// 导出所有导航相关函数
export {
  getCurrentViewController,
  getCurrentController,
  getNavigationController,
};
