/**
 * 数学和统计工具函数模块
 * 提供随机数生成、百分比计算、中位数计算等功能
 */

/**
 * 生成安全的随机数（0-1之间）
 * 使用crypto.getRandomValues确保随机数的安全性
 * @returns {number} 0到1之间的随机数
 */
export const secureRandom = () => {
  const randomArray = new Uint32Array(1);
  crypto.getRandomValues(randomArray);
  return randomArray[0] / (2 ** 32);
};

/**
 * 在指定范围内生成随机整数
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} 范围内的随机整数
 */
export const getRandomNumberInRange = (min, max) =>
  Math.round(secureRandom() * (max - min) + min);

/**
 * 计算百分比差异
 * @param {number} newValue - 新值
 * @param {number} oldValue - 旧值
 * @returns {number} 百分比差异
 */
export const getPercentDiff = (newValue, oldValue) =>
  (newValue || oldValue) ? ((newValue - oldValue) / oldValue) * 100 : 0;

/**
 * 计算相对百分比差异
 * 使用两个值的平均值作为基准
 * @param {number} value1 - 第一个值
 * @param {number} value2 - 第二个值
 * @returns {number} 相对百分比差异
 */
export const getRelativePercentDiff = (value1, value2) =>
  (value1 || value2) ? ((value1 - value2) / ((value1 + value2) / 2)) * 100 : 0;

/**
 * 计算数组的中位数
 * @param {Array<number>} array - 数字数组
 * @returns {number} 中位数
 */
export const median = (array) => {
  if (array.length === 0) return 0;

  // 对数组进行排序
  array.sort((a, b) => a - b);

  const middleIndex = Math.floor(array.length / 2);

  // 如果数组长度为奇数，返回中间元素
  // 如果数组长度为偶数，返回中间两个元素的平均值
  return array.length % 2
    ? array[middleIndex]
    : (array[middleIndex - 1] + array[middleIndex]) / 2;
};
