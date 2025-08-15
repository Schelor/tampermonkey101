import { TTLCache } from './TTLCache'; // 假设从32024模块导入
import DataLoader from 'dataloader'; // 假设从99798模块导入

/**
 * 数据源基类
 * 提供通用的数据获取、缓存和批处理功能
 */
export class DataSource {
  dataloader;
  requestPlayerMap;

  constructor() {
    // 初始化DataLoader，用于批处理和缓存
    this.dataloader = new DataLoader(this.batchFunction.bind(this), {
      cacheMap: new TTLCache(7), // 7分钟TTL缓存
      cacheKeyFn: (key) => key   // 缓存键函数
    });

    // 存储请求中的球员映射
    this.requestPlayerMap = new Map();
  }

  /**
   * DataLoader的批处理函数
   * @param {Array} keys - 要批处理的键数组
   * @returns {Promise<Array>} 批处理结果
   */
  async batchFunction(keys) {
    return this.fetchPrices(keys);
  }

  /**
   * 获取单个物品的价格
   * @param {Object} item - 物品对象
   * @returns {Promise<Object|undefined>} 价格数据
   */
  async fetchPrice(item) {
    if (!item.definitionId) return;

    const cacheKey = this.formatCacheKey(item.definitionId);

    // 如果是UT物品实体，存储到请求映射中
    if (this.isUTItemEntity(item)) {
      this.requestPlayerMap.set(item.definitionId, item);
    }

    // 通过DataLoader加载价格数据
    const priceData = await this.dataloader.load(cacheKey);

    // 清理请求映射
    this.requestPlayerMap.delete(item.definitionId);

    return priceData;
  }

  /**
   * 批量获取物品价格
   * @param {Array} items - 物品数组
   * @returns {Promise<Array>} 包含价格数据的物品数组
   */
  async fetchItemPrices(items) {
    return Promise.all(
      items.map(async (item) => {
        const priceData = await this.fetchPrice(item);

        // 将价格数据合并到物品对象中
        return Object.assign(item, {
          priceData: priceData,
          price: priceData?.prices?.[0].price
        });
      })
    );
  }

  /**
   * 获取饲料价格
   * 委托给子类的fetchAllRatingPrice方法
   * @returns {Promise<*>} 饲料价格数据
   */
  async fetchFodderPrices() {
    return this.fetchAllRatingPrice();
  }

  /**
   * 获取数据源名称
   * @returns {string} 大写的数据源类型名称
   */
  getDataSourceName() {
    return this.type.toLocaleUpperCase();
  }

  /**
   * 检查对象是否为UT物品实体
   * @param {*} obj - 要检查的对象
   * @returns {boolean} 如果是UT物品实体返回true
   */
  isUTItemEntity(obj) {
    return !!obj && typeof obj === "object" && "nationId" in obj;
  }

  /**
   * 格式化缓存键
   * @param {string|number} id - 物品ID
   * @returns {string} 格式化后的缓存键
   */
  formatCacheKey(id) {
    return `${id}_${this.type}`;
  }

  /**
   * 格式化阵型字符串
   * @param {string} formation - 阵型字符串（如"4-3-3"或"433"）
   * @returns {string} 格式化后的阵型字符串（如"f4(b)"）
   */
  formatFormation(formation) {
    if (!formation) return formation;

    const parts = formation.split("-");

    // 如果没有连字符，直接添加前缀
    if (parts.length === 1) {
      return `f${formation}`;
    }

    // 计算字母后缀：第二部分数字-2+a的ASCII码
    const letterCode = "a".charCodeAt(0) + parseInt(parts[1], 10) - 2;
    const letter = String.fromCharCode(letterCode);

    return `f${parts[0]}(${letter})`;
  }

  // 以下方法需要在子类中实现
  async fetchPrices(items) {
    throw new Error("fetchPrices must be implemented by subclass");
  }

  async fetchAllRatingPrice() {
    throw new Error("fetchAllRatingPrice must be implemented by subclass");
  }

  async getPlayersByRating(rating, param2) {
    throw new Error("getPlayersByRating must be implemented by subclass");
  }

  async getPlayerUrl(player) {
    throw new Error("getPlayerUrl must be implemented by subclass");
  }
}
