// 还原后的需求解析模块代码
import { scopeMap, requirementTypeMap } from './requirement-maps'; // 对应 n(41500)

/**
 * 解析SBC需求数组
 * @param {Array} requirements - 原始需求数组
 * @returns {Array} 解析后的需求对象数组
 */
export const parseRequirement = (requirements) =>
  requirements.map((requirement, index) => {
    // 解构需求对象的基本属性
    const { scope, count, kvPairs } = requirement;

    // 获取键值对集合中的第一个条目
    const [requirementKey, requirementValues] = Object.entries(kvPairs._collection)[0];

    // 返回格式化的需求对象
    return {
      // 映射范围类型
      scope: scopeMap[scope],

      // 需求数量
      count: count,

      // 需求值
      values: requirementValues,

      // 映射需求类型
      requirementType: requirementTypeMap[requirementKey],

      // 在原数组中的索引
      index: index,

      // 保留原始需求对象的引用
      rawRequirement: requirement,
    };
  });
