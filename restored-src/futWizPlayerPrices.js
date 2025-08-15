import { sendRequest, createBatches, wait } from './utils'; // 假设从82125模块导入
import { getUserPlatform } from './getUserPlatform'; // 假设从13808模块导入
import { getMatchingPlayer } from './getMatchingPlayer'; // 假设从56369模块导入

/**
 * 获取单个球员的FutWiz价格
 * @param {number} playerId - 球员ID
 * @param {string} platform - 游戏平台
 * @param {Object} pricesResult - 价格结果对象
 * @param {Map} requestPlayerMap - 请求球员映射表
 */
const fetchSinglePlayerPrice = async (playerId, platform, pricesResult, requestPlayerMap) => {
  try {
    // 获取FutWiz价格数据
    const priceData = await getFutWizPriceData(playerId, requestPlayerMap);

    if (priceData) {
      // 获取指定平台的BIN价格
      let binPrice = priceData.prices[platform].bin;

      // 如果PS平台没有价格，尝试使用Xbox平台的价格
      if (platform === "ps" && !binPrice) {
        binPrice = priceData.prices.xb.bin;
      }

      // 转换价格为数字格式
      const numericPrice = typeof binPrice === "number"
        ? binPrice
        : parseInt(binPrice.replace(/[,.]/g, ""), 10);

      // 存储价格结果
      pricesResult[playerId] = numericPrice;
    }
  } catch (error) {
    // 忽略单个球员的价格获取错误
    console.warn(`Failed to fetch price for player ${playerId}:`, error);
  }
};

/**
 * 从FutWiz获取球员价格数据
 * @param {number} playerId - 球员ID
 * @param {Map} requestPlayerMap - 请求球员映射表
 * @returns {Promise<Object|null>} 价格数据或null
 */
const getFutWizPriceData = async (playerId, requestPlayerMap) => {
  try {
    // 从请求映射中获取球员信息
    const playerInfo = requestPlayerMap.get(playerId);

    if (!playerInfo) {
      return null;
    }

    // 获取匹配的球员信息
    const matchingPlayer = await getMatchingPlayer(playerInfo);

    if (!matchingPlayer) {
      return null;
    }

    // 向FutWiz API发送请求
    const response = await sendRequest(
      `https://www.futwiz.com/en/app/sold25/${matchingPlayer.lineid}/console`,
      "GET",
      `futwiz_${playerId}_${Math.floor(Date.now())}_fetchFutWizPlayerPrices`
    );

    return JSON.parse(response);
  } catch (error) {
    return null;
  }
};

/**
 * 批量获取球员价格
 * @param {Set<number>} playerIds - 球员ID集合
 * @param {Map} requestPlayerMap - 请求球员映射表
 * @returns {Promise<Object>} 球员价格映射对象
 */
export const getPlayerPrices = async (playerIds, requestPlayerMap) => {
  const platform = getUserPlatform();
  const pricesResult = {};

  // 将球员ID分批处理，每批10个
  const batches = createBatches(Array.from(playerIds), 10);

  for (const batch of batches) {
    const promises = [];

    // 为当前批次的每个球员创建价格获取Promise
    for (const playerId of batch) {
      promises.push(fetchSinglePlayerPrice(playerId, platform, pricesResult, requestPlayerMap));
    }

    // 等待当前批次的所有请求完成
    await Promise.all(promises);

    // 在批次之间等待0.5秒，避免请求过于频繁
    await wait(0.5);
  }

  return pricesResult;
};
