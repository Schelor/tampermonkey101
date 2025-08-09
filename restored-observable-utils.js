// 还原后的Observable工具模块代码

/**
 * 将Observable转换为Promise
 * @param {Object} observable - Observable对象
 * @returns {Promise} 转换后的Promise对象
 */
export const observableToPromise = (observable) =>
  new Promise((resolve) => {
    observable.observe(current,(observableInstance, { data, success, error, response }) => {
        // 取消观察
        observableInstance.unobserve(this);
        // 根据成功状态返回不同的结果
        resolve(
          success
            ? { success, data: response ?? data }
            : { success, data, error: error?.code }
        );
      }
    );
  });
