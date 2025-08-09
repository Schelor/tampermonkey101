// 还原后的选择解决方案模块代码
import { positionPlayers } from './position-players'; // 对应 n(55392)

/**
 * 选择并应用SBC解决方案
 * @param {Object} challenge - 挑战对象
 * @param {Array} solution - 解决方案数组
 * @returns {void}
 */
export const selectSolution = (challenge, solution) => {
  // 将解决方案转换为球员数据格式
  const players = solution.map((player, index) => {
    // 如果球员为空，返回null
    if (!player) {
      return null;
    }

    // 解构球员数据
    const { definitionId, price = 0 } = player;

    // 返回格式化的球员对象
    return {
      definitionId,
      position: `${index}`, // 将索引转换为字符串作为位置
      price
    };
  });

  // 调用定位球员函数，传入包装好的球员数据Promise
  positionPlayers(Promise.resolve({ players }), challenge);
};
