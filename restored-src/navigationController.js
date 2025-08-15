/**
 * 导航控制器工具模块
 * 提供获取当前视图控制器、控制器和导航控制器的功能
 */

/**
 * 获取当前视图控制器
 * @returns {Object} 当前的视图控制器实例
 */
export const getCurrentViewController = () => {
  return getAppMain()
    .getRootViewController()
    .getPresentedViewController()
    .getCurrentViewController();
};

/**
 * 获取当前控制器
 * @returns {Object} 当前的控制器实例
 */
export const getCurrentController = () => {
  return getCurrentViewController().getCurrentController();
};

/**
 * 获取导航控制器
 * @returns {Object} 导航控制器实例
 */
export const getNavigationController = () => {
  return getCurrentController().getNavigationController();
};
