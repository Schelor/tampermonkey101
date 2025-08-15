// 还原后的定位球员模块代码
import { showLoader, hideLoader, getSquadLookupForSbc } from './sbc-module'; // 对应 n(13808)
import { saveSolution } from './save-solution'; // 对应 n(7548)

/**
 * 定位球员到阵容中
 * @param {Promise} playersPromise - 球员数据的Promise
 * @param {Object} challenge - 挑战对象
 * @returns {Promise<void>}
 */
export const positionPlayers = async (playersPromise, challenge) => {
  // 显示加载器
  showLoader();

  // 并行执行两个异步操作
  const [squadLookup, { players }] = await Promise.all([
    // 获取SBC用的阵容查找表
    getSquadLookupForSbc(),
    // 等待球员数据Promise完成
    playersPromise,
  ]);

  // 提取球员定义ID并保存解决方案
  await saveSolution(
    players.map((player) => player?.definitionId ?? null),
    squadLookup,
    challenge,
    true // 强制重新加载
  );

  // 隐藏加载器
  hideLoader();
};
