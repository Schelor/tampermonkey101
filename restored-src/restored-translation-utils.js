// 还原后的翻译工具模块代码
import { i18next } from './i18next-config'; // 对应 n(41472)

/**
 * 初始化翻译语言
 * @param {string} language - 语言代码
 * @returns {Promise} 语言切换的Promise
 */
export const initTranslation = (language) =>
  i18next.changeLanguage(
    // 语言代码映射函数
    ((lang) => (lang === "zh-CN" || lang === "zh-HK" ? "zh" : lang))(language)
  );

/**
 * 翻译函数
 * 直接使用i18next的翻译方法
 */
export const translate = i18next.t;
