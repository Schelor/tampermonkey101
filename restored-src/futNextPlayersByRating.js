import { sendRequest } from './utils'; // 假设从82125模块导入
import { getUserPlatform } from './getUserPlatform'; // 假设从13808模块导入
import { config } from './config'; // 假设从30712模块导入

/**
 * 根据评分从FutNext获取球员列表
 * @param {number} rating - 球员评分
 * @returns {Promise<Array<number>>} 球员ID数组
 */
export const getPlayersByRating = async (rating) => {
  // 向FutNext API发送请求获取指定评分的球员
  const response = await sendRequest(
    `${config.api.nextRestBase}/players/filter?rating=${rating}&platform=${getUserPlatform()}`,
    "GET",
    `${Math.floor(Date.now())}_getFUTNextPlayersByRating`
  );

  // 解析响应数据，提取球员ID数组
  const { ids: playerIds } = JSON.parse(response);

  return playerIds;
};
