import { InMemoryStore } from './InMemoryStore'; // 假设从32024模块导入
import { FutBinDataSource } from './FutBinDataSource'; // 假设从27425模块导入
import { FutNextDataSource } from './FutNextDataSource'; // 假设从1727模块导入
import { NoneDataSource } from './NoneDataSource'; // 假设从53800模块导入
import { FutWizDataSource } from './FutWizDataSource'; // 假设从77224模块导入

/**
 * 数据源编排器
 * 使用单例模式管理多个数据源实例
 */
export class DataSourceOrchestrator {
  static _instance;
  instanceLookUp;
  setting;

  constructor() {
    // 获取增强器设置
    this.setting = InMemoryStore.instance.get("enhancerSettings");

    // 初始化数据源查找映射
    this.instanceLookUp = new Map();

    // 创建FutBin数据源实例
    const futBinDataSource = new FutBinDataSource();

    // 注册所有可用的数据源
    this.instanceLookUp.set("futbin", futBinDataSource);
    this.instanceLookUp.set("futnext", new FutNextDataSource());
    this.instanceLookUp.set("futwiz", new FutWizDataSource(futBinDataSource));
    this.instanceLookUp.set("none", new NoneDataSource());
  }

  /**
   * 获取单例实例
   * @returns {DataSourceOrchestrator} 单例实例
   */
  static get instance() {
    if (!this._instance) {
      this._instance = new DataSourceOrchestrator();
    }
    return this._instance;
  }

  /**
   * 获取当前配置的数据源
   * @returns {Object} 当前数据源实例
   */
  getDataSource() {
    return this.instanceLookUp.get(this.setting.dataSource);
  }

  /**
   * 根据名称获取指定的数据源
   * @param {string} name - 数据源名称
   * @returns {Object} 指定的数据源实例
   */
  getDataSourceByName(name) {
    return this.instanceLookUp.get(name);
  }
}
