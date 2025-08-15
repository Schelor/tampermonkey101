import { getUserPlatform } from './getUserPlatform'; // 假设从13808模块导入
import { TTLCache } from './TTLCache'; // 假设从32024模块导入
import { DataSource } from './DataSource'; // 假设从6488模块导入
import { getPlayersByRating } from './getPlayersByRating'; // 假设从96483模块导入
import { getPlayerUrl } from './getPlayerUrl'; // 假设从6390模块导入
import { getPlayerPrices } from './getPlayerPrices'; // 假设从11194模块导入
import { getFodderPrice } from './getFodderPrice'; // 假设从174模块导入

/**
 * FutBin数据源实现
 * 继承自基础DataSource类，提供FutBin特定的数据获取功能
 */
export class FutBinDataSource extends DataSource {
  type = "futbin";
  fodderCache;

  constructor() {
    super();
    // 初始化饲料价格缓存，TTL为15分钟
    this.fodderCache = new TTLCache(15);
  }

  /**
   * 获取所有评分的价格（饲料价格）
   * @returns {Promise<Object>} 饲料价格数据
   */
  async fetchAllRatingPrice() {
    // 从缓存获取或重新获取饲料价格
    const fodderPrice = this.fodderCache.get("fodderPrice") ?? getFodderPrice();

    // 更新缓存
    this.fodderCache.set("fodderPrice", fodderPrice);

    return fodderPrice;
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
   * @param {number} rating - 球员评分
   * @param {*} param2 - 第二个参数
   * @returns {Promise<Array>} 球员列表
   */
  async getPlayersByRating(rating, param2) {
    return getPlayersByRating(rating, param2);
  }

  /**
   * 获取球员URL
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
    const playerPricesResponse = await getPlayerPrices(playerIds);
    return this.processPlayerPriceResponse(playerPricesResponse, priceMap);
  }

  /**
   * 处理球员价格响应数据
   * @param {Object} response - 价格响应数据
   * @param {Map} priceMap - 价格映射表
   */
  processPlayerPriceResponse(response, priceMap) {
    for (const [playerId, playerData] of Object.entries(response)) {
      // 获取当前平台的最低价格
      const lcPrice = playerData.prices[getUserPlatform()].LCPrice;

      if (lcPrice) {
        // 格式化缓存键并存储价格信息
        priceMap.set(this.formatCacheKey(playerId), {
          prices: [
            {
              price: Number.parseInt(lcPrice.replaceAll(/[,.]/g, ""), 10)
            }
          ]
        });
      }
    }
  }
}
