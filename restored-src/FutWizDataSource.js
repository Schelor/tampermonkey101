import { DataSource } from './DataSource'; // 假设从6488模块导入
import { getPlayerUrl } from './futWizPlayerUrl'; // 假设从89366模块导入
import { getPlayerPrices } from './futWizPlayerPrices'; // 假设从32996模块导入

/**
 * FutWiz数据源实现
 * 继承自基础DataSource类，提供FutWiz特定的数据获取功能
 * 使用FutBin作为某些功能的后备数据源
 */
export class FutWizDataSource extends DataSource {
  futBinDataSource;
  type = "futwiz";

  /**
   * 构造函数
   * @param {FutBinDataSource} futBinDataSource - FutBin数据源实例，用作后备
   */
  constructor(futBinDataSource) {
    super();
    this.futBinDataSource = futBinDataSource;
  }

  /**
   * 获取所有评分的价格（饲料价格）
   * FutWiz不提供饲料价格功能，返回空Map
   * @returns {Promise<Map>} 空的Map对象
   */
  async fetchAllRatingPrice() {
    return new Map();
  }

  /**
   * 获取物品价格
   * @param {Array<string>} items - 物品ID数组
   * @returns {Promise<Array>} 价格信息数组
   */
  async fetchPrices(items) {
    const playerIds = new Set();

    // 解析物品ID，提取球员ID
    for (const item of items) {
      const [id, param2, param3, type] = item.split("_");

      // 只处理球员类型的物品
      if (type === "pl") {
        playerIds.add(+id); // 转换为数字
      }
    }

    const priceMap = new Map();
    const promises = [];

    // 如果有球员ID，获取球员价格
    if (playerIds.size > 0) {
      promises.push(this.fetchPlayerPrices(playerIds, priceMap));
    }

    // 等待所有价格获取完成
    await Promise.all(promises);

    // 返回按原始顺序排列的价格信息
    return items.map(item => priceMap.get(item));
  }

  /**
   * 根据评分获取球员
   * 委托给FutBin数据源处理
   * @param {number} rating - 球员评分
   * @param {*} param2 - 第二个参数
   * @returns {Promise<Array>} 球员列表
   */
  async getPlayersByRating(rating, param2) {
    return this.futBinDataSource.getPlayersByRating(rating, param2);
  }

  /**
   * 获取球员URL
   * 使用FutWiz特定的URL生成逻辑
   * @param {*} player - 球员信息
   * @returns {Promise<string>} 球员URL
   */
  async getPlayerUrl(player) {
    return getPlayerUrl(player);
  }

  /**
   * 获取球员价格
   * @param {Set<number>} playerIds - 球员ID集合
   * @param {Map} priceMap - 价格映射表
   * @returns {Promise<void>}
   */
  async fetchPlayerPrices(playerIds, priceMap) {
    const playerPricesResponse = await getPlayerPrices(playerIds, this.requestPlayerMap);
    return this.processPlayerPriceResponse(playerPricesResponse, priceMap);
  }

  /**
   * 处理球员价格响应数据
   * @param {Object} response - 价格响应数据
   * @param {Map} priceMap - 价格映射表
   */
  processPlayerPriceResponse(response, priceMap) {
    for (const [playerId, price] of Object.entries(response)) {
      // 只有当价格存在时才存储
      if (price) {
        priceMap.set(this.formatCacheKey(playerId), {
          prices: [{ price }]
        });
      }
    }
  }
}
