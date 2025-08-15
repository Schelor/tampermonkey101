/**
 * Observable工具模块
 * 提供Observable与Promise之间的转换功能
 */

/**
 * 将Observable转换为Promise
 * @param {Object} observable - 要转换的Observable对象
 * @returns {Promise} 返回一个Promise，包含success状态和相关数据
 */
export const observableToPromise = (observable) => {
  return new Promise((resolve) => {
    observable.observe(
      this,
      (observableInstance, { data, success, error, response }) => {
        // 取消观察，避免内存泄漏
        observableInstance.unobserve(this);

        // 根据成功状态返回不同的结果
        resolve(
          success
            ? {
                success: success,
                data: response ?? data
              }
            : {
                success: success,
                data: data,
                error: error?.code
              }
        );
      }
    );
  });
};
