import { constructNavigationLink } from './utils'; // 假设从82125模块导入
import { config } from './config'; // 假设从30712模块导入

/**
 * 生成FutNext球员详情页面URL
 * @param {Object} player - 球员对象
 * @returns {string} 球员详情页面URL
 */
export const getPlayerUrl = (player) => {
  // 获取球员全名并移除特殊字符
  const playerName = TextUtils.stripSpecialCharacters(
    player._staticData.getFullName()
  );

  // 构建FutNext球员页面URL
  return `${config.nextDomain}/${constructNavigationLink(
    "player",
    playerName,
    `${player.definitionId}`
  )}`;
};
