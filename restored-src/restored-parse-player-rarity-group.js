// 还原后的解析球员稀有度组模块代码
import { EligibilityScopeEnum } from './enums'; // 对应 n(26735)
import { getLocalization } from './ui-utils'; // 对应 n(27988)
import { PlayerGroupRequirement } from './concept-constants'; // 对应 n(97897)

/**
 * 解析球员稀有度组需求
 * @param {Array} eligibilityRequirements - 资格需求数组
 * @returns {Object|undefined} 稀有度组信息对象，如果没有找到则返回undefined
 */
export const parsePlayerRarityGroup = (eligibilityRequirements) => {
  // 查找球员组需求
  const playerGroupRequirement = eligibilityRequirements.find((requirement) => {
    const { kvPairs } = requirement;

    // 获取键值对集合中的第一个条目的键
    const [requirementKey] = Object.entries(kvPairs._collection)[0];

    // 检查是否为球员组需求
    return +requirementKey === PlayerGroupRequirement;
  });

  // 如果没有找到球员组需求，或者范围类型不符合条件，则返回undefined
  if (
    !playerGroupRequirement ||
    playerGroupRequirement.scope === EligibilityScopeEnum.EXACT ||
    playerGroupRequirement.scope === EligibilityScopeEnum.LOWER
  ) {
    return undefined;
  }

  // 解构需求对象
  const { kvPairs, count } = playerGroupRequirement;

  // 获取键值对集合中的第一个条目
  const [requirementKey, groupValue] = Object.entries(kvPairs._collection)[0];

  // 返回稀有度组信息
  return {
    // 获取本地化的组标签
    label: getLocalization().localize(`Player_Group_${groupValue}`),
    // 需求数量
    count: count,
  };
};
