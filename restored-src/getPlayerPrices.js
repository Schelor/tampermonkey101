import { sendRequest, createBatches, wait } from './utils'; // 假设从82125模块导入

/**
 * 从FutBin获取单批球员价格
 * @param {number} playerId - 主球员ID
 * @param {string} rids - 其他球员ID列表，逗号分隔
 * @returns {Promise<Object>} 球员价格数据
 */
const fetchPlayerPricesFromFutBin = async (playerId, rids) => {
  const response = await sendRequest(
    `https://www.futbin.com/24/playerPrices?player=${playerId}&rids=${rids}`,
    "GET",
    `futbin_${Math.floor(Date.now())}_fetchPlayerPrices`,
    undefined, // body
    undefined, // headers
    5 // timeout in seconds
  );

  return JSON.parse(response);
};

/**
 * 批量获取球员价格
 * @param {Set<number>} playerIds - 球员ID集合
 * @returns {Promise<Object>} 所有球员的价格数据
 */
export const getPlayerPrices = async (playerIds) => {
  // 将Set转换为数组
  const playerIdArray = [...playerIds];

  // 将球员ID分批处理，每批最多30个
  const batches = createBatches(playerIdArray, 30);

  let allPrices = {};

  // 逐批处理球员价格请求
  for (const batch of batches) {
    // 取出第一个球员ID作为主要参数
    const mainPlayerId = batch.shift();

    if (mainPlayerId) {
      // 将剩余的球员ID组合成逗号分隔的字符串
      const remainingPlayerIds = batch.join(",");

      try {
        // 获取这一批球员的价格数据
        const batchPrices = await fetchPlayerPricesFromFutBin(mainPlayerId, remainingPlayerIds);

        // 合并到总的价格数据中
        allPrices = { ...allPrices, ...batchPrices };
      } catch (error) {
        // 如果请求失败，返回null，使用空对象作为默认值
        const batchPrices = null ?? {};
        allPrices = { ...allPrices, ...batchPrices };
      }
    }

    // 在批次之间等待0.6秒，避免请求过于频繁
    await wait(0.6);
  }

  return allPrices;
};
