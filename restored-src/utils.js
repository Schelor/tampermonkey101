import CryptoJS from 'crypto-js'; // 假设从36023模块导入
import { secureRandom } from './secureRandom'; // 假设从45890模块导入

/**
 * 等待指定时间（带随机延迟）
 * @param {number} seconds - 基础等待时间（秒）
 * @returns {Promise<void>}
 */
export const wait = async (seconds = 1) => {
  const randomDelay = Math.floor(secureRandom());
  await new Promise((resolve) => {
    setTimeout(resolve, 1000 * (randomDelay + seconds));
  });
};

/**
 * 格式化数字为两位数字符串
 * @param {number} num - 要格式化的数字
 * @returns {string} 格式化后的字符串
 */
const padZero = (num) => (num < 10 ? "0" : "") + num;

/**
 * 格式化时间差为HH:MM:SS格式
 * @param {number} timestamp - 目标时间戳
 * @param {number} currentTime - 当前时间戳，默认为当前时间
 * @returns {string} 格式化的时间差字符串
 */
export const formatDiffTimeString = (timestamp, currentTime = Date.now()) => {
  const diffSeconds = Math.abs(currentTime - timestamp) / 1000;
  const hours = Math.floor((diffSeconds / 60 / 60) % 24);
  const minutes = Math.floor((diffSeconds / 60) % 60);
  const seconds = Math.floor(diffSeconds % 60);

  return `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
};

/**
 * 将数组分割成指定大小的批次
 * @param {Array} array - 要分割的数组
 * @param {number} batchSize - 每批的大小
 * @returns {Array<Array>} 分割后的批次数组
 */
export const createBatches = (array, batchSize) => {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize);
    batches.push(batch);
  }
  return batches;
};

/**
 * 首字母大写
 * @param {string} str - 要处理的字符串
 * @returns {string} 首字母大写的字符串
 */
export const capitalizeFirstLetter = (str) =>
  str.charAt(0).toUpperCase() + str.slice(1);

/**
 * 生成指定长度的随机ID
 * @param {number} length - ID长度
 * @returns {string} 随机ID字符串
 */
export const generateId = (length) => {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i += 1) {
    result += characters.charAt(
      Math.floor(62 * secureRandom())
    );
  }
  return result;
};

/**
 * 深度克隆对象
 * @param {*} obj - 要克隆的对象
 * @returns {*} 克隆后的对象
 */
export const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * 随机打乱数组（Fisher-Yates洗牌算法）
 * @param {Array} array - 要打乱的数组
 * @returns {Array} 打乱后的数组
 */
export const shuffle = (array) => {
  let currentIndex = array.length;

  while (currentIndex) {
    const randomIndex = Math.floor(secureRandom() * currentIndex);
    currentIndex -= 1;

    // 交换元素
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

/**
 * 从数组中随机选择一个元素
 * @param {Array} array - 源数组
 * @returns {*} 随机选择的元素，如果数组为空则返回null
 */
export const randomItem = (array) =>
  array[Math.floor(secureRandom() * array.length)] ?? null;

/**
 * 检查两个数组是否相同
 * @param {Array} arr1 - 第一个数组
 * @param {Array} arr2 - 第二个数组
 * @returns {boolean} 如果数组相同返回true
 */
export const isSameArray = (arr1, arr2) =>
  arr1.length === arr2.length && arr1.every((item, index) => item === arr2[index]);

/**
 * 检查是否在市场警报环境中
 * @returns {boolean} 如果在市场警报环境中返回true
 */
export const isMarketAlert = () => !!window.ReactNativeWebView;

/**
 * 检查是否在伴侣应用中
 * @returns {boolean} 如果在伴侣应用中返回true
 */
export const isCompanionApp = () => isAndroid() || isIOS();

/**
 * 检查是否在移动模式中
 * @returns {boolean} 如果在移动模式中返回true
 */
export const isMobileMode = () => isMarketAlert() || isCompanionApp();

/**
 * 将值数组转换为Set
 * @param {Set} set - 目标Set对象
 * @param {Array} values - 值数组
 * @returns {Set} 更新后的Set对象
 */
export const valuesToSet = (set, values) => {
  set.clear();
  if (values) {
    for (const value of values) {
      set.add(+value); // 转换为数字
    }
  }
  return set;
};

/**
 * 应用过滤器
 * @param {Set} filterSet - 过滤器Set
 * @param {*} value - 要检查的值
 * @returns {boolean} 如果值通过过滤器返回true
 */
export const applyFilter = (filterSet, value) => filterSet.size && filterSet.has(value);

/**
 * 应用范围过滤器
 * @param {Array} range - 范围数组 [min, max]
 * @param {number} value - 要检查的值
 * @returns {boolean} 如果值在范围内返回true
 */
export const applyRangeFilter = (range, value) =>
  !range?.length || (!!value && value >= range[0] && value <= range[1]);

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} 防抖后的函数
 */
export const debounce = (func, delay) => {
  let timeoutId;

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

/**
 * 节流函数（使用SHA256哈希）
 * @param {string} input - 输入字符串
 * @returns {string} SHA256哈希值
 */
export const throttleFunction = (input) => CryptoJS.SHA256(input).toString();

/**
 * 原地过滤数组
 * @param {Array} array - 要过滤的数组
 * @param {Function} predicate - 过滤条件函数
 * @returns {Array} 过滤后的数组
 */
export const filterInPlace = (array, predicate) =>
  array.splice(0, array.length, ...array.filter(predicate));

/**
 * 打开URL
 * @param {string} url - 要打开的URL
 * @param {string} target - 目标窗口
 * @param {string} options - 窗口选项
 */
export const openUrl = (url, target, options) => {
  if (isCompanionApp()) {
    cordova.InAppBrowser.open(url, "_system", options);
  } else {
    window.open(url, target, options);
  }
};

/**
 * 掩码邮箱地址
 * @param {string} email - 邮箱地址
 * @returns {string|null} 掩码后的邮箱地址
 */
export const maskEmail = (email) => {
  if (!email) return null;

  const parts = email.split("@");
  const username = parts[0];
  const domain = parts[1];

  return `${username.slice(0, 2)}********${username.slice(-2)}@${domain}`;
};
