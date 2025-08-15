import { getUserPlatform } from './getUserPlatform'; // 假设从13808模块导入
import { DataSource } from './DataSource'; // 假设从6488模块导入
import { getPlayerPrices } from './futNextPlayerPrices'; // 假设从26756模块导入
import { getPlayerUrl } from './futNextPlayerUrl'; // 假设从62732模块导入
import { getPlayersByRating } from './futNextPlayersByRating'; // 假设从97329模块导入

/**
 * FutNext数据源实现
 * 继承自基础DataSource类，提供FutNext特定的数据获取功能
 */
export class FutNextDataSource extends DataSource {
  type = "futnext";

  /**
   * 获取所有评分的价格（饲料价格）
   * FutNext不提供饲料价格功能，返回空Map
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
    const itemsToFetch = [];

    // 解析物品ID，提取球员定义ID
    for (const item of items) {
      const [definitionId] = item.split("_");
      itemsToFetch.push({ definitionId: +definitionId });
    }

    const promises = [];

    // 如果有物品需要获取价格，发起请求
    if (itemsToFetch.length) {
      promises.push(
        getPlayerPrices({
          items: itemsToFetch,
          platform: getUserPlatform()
        })
      );
    }

    // 等待所有价格请求完成
    const [pricesResponse] = await Promise.all(promises);

    // 处理价格响应数据，构建价格映射
    const priceMap = (pricesResponse ?? []).reduce((map, item) => {
      map.set(this.formatCacheKey(item.definitionId), {
        prices: item.prices,
        updatedOn: item.updatedOn
      });
      return map;
    }, new Map());

    // 返回按原始顺序排列的价格信息
    return items.map(item => priceMap.get(item));
  }

  /**
   * 获取球员URL
   * @param {*} player - 球员信息
   * @returns {Promise<string>} 球员URL
   */
  getPlayerUrl(player) {
    return Promise.resolve(getPlayerUrl(player));
  }

  /**
   * 根据评分获取球员
   * @param {Array} ratingArray - 评分数组，取第一个元素作为评分
   * @param {*} param2 - 第二个参数（未使用）
   * @returns {Promise<Array>} 球员列表
   */
  async getPlayersByRating([rating], param2) {
    return getPlayersByRating(rating);
  }
}
