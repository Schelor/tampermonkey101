import { DataSourceOrchestrator } from './DataSourceOrchestrator'; // 假设从90335模块导入

/**
 * 当前数据源管理类
 * 使用单例模式管理数据源访问
 */
export class CurrentDataSource {
  static _instance;
  dataSourceOrchestrator;

  constructor() {
    this.dataSourceOrchestrator = DataSourceOrchestrator.instance;
  }

  /**
   * 获取单例实例
   * @returns {CurrentDataSource} 单例实例
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new CurrentDataSource();
    }
    return this._instance;
  }

  /**
   * 获取当前数据源名称
   * @returns {string} 数据源名称
   */
  get name() {
    return this.dataSourceOrchestrator
      .getDataSource()
      .getDataSourceName();
  }

  /**
   * 获取物品价格
   * @param {Array} items - 物品列表
   * @returns {Promise<Array>} 价格信息数组
   */
  async fetchItemPrices(items) {
    return this.dataSourceOrchestrator
      .getDataSource()
      .fetchItemPrices(items);
  }

  /**
   * 根据评分获取球员
   * @param {number} rating - 球员评分
   * @param {*} param2 - 第二个参数
   * @returns {Promise<Array>} 球员列表
   */
  async getPlayersByRating(rating, param2) {
    return this.dataSourceOrchestrator
      .getDataSource()
      .getPlayersByRating(rating, param2);
  }

  /**
   * 获取球员URL
   * @param {*} player - 球员信息
   * @returns {Promise<string>} 球员URL
   */
  async getPlayerUrl(player) {
    return this.dataSourceOrchestrator
      .getDataSource()
      .getPlayerUrl(player);
  }

  /**
   * 获取饲料价格（用于SBC的低评分球员）
   * @returns {Promise<Array>} 饲料价格列表
   */
  async fetchFodderPrices() {
    return this.dataSourceOrchestrator
      .getDataSource()
      .fetchFodderPrices();
  }
}
