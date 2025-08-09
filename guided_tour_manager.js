/**
 * FIFA Ultimate Team Enhancer - 引导教程管理类
 * 原始代码经过webpack打包和混淆，这里是还原后的清晰版本
 */

class GuidedTourManager {
  static _instance;
  _tour;

  constructor() {
    this._tour = undefined;
  }

  /**
   * 获取单例实例
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new GuidedTourManager();
    }
    return this._instance;
  }

  /**
   * 开始引导教程
   */
  startGuidedTour() {
    return this.runTour(this.tour);
  }

  /**
   * 移动到下一步
   */
  moveToNextStep() {
    setTimeout(() => {
      this._tour?.next();
    }, 250);
  }

  /**
   * 获取教程实例
   */
  get tour() {
    if (!this._tour) {
      // 创建新的Shepherd.js教程实例
      this._tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          scrollTo: true,
          cancelIcon: { enabled: true },
        },
      });

      // 生成交易者步骤
      generateTraderSteps(this._tour);
    }

    return this._tour;
  }

  /**
   * 运行教程
   * @param {Object} tour - Shepherd.js教程实例
   * @returns {Promise} 教程完成后的Promise
   */
  runTour(tour) {
    return new Promise((resolve) => {
      tour?.start();

      // 监听教程完成事件
      for (const event of tourEvents) {
        tour?.on(event, () => {
          resolve();
          // 清理所有事件监听器
          for (const eventName of tourEvents) {
            tour.off(eventName);
          }
        });
      }
    });
  }
}

// 教程事件列表（需要根据实际代码补充）
const tourEvents = ["complete", "cancel", "destroy"];

// 导出单例实例
export default GuidedTourManager;
