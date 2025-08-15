/**
 * SBC（Squad Building Challenge）操作模块
 * 提供保存、提交、加载挑战等SBC相关功能
 */

import { wait } from './utils'; // 假设从82125模块导入
import { RewardTypeEnum } from './enums'; // 假设从26735模块导入
import { observableToPromise } from './observableUtils'; // 假设从27988模块导入

/**
 * 保存挑战
 * @param {Object} challenge - 挑战对象
 * @returns {Promise} 保存结果的Promise
 */
export const saveChallenge = (challenge) =>
  observableToPromise(services.SBC.saveChallenge(challenge));

/**
 * 提交挑战
 * @param {*} param1 - 第一个参数
 * @param {*} param2 - 第二个参数
 * @param {*} param3 - 第三个参数
 * @param {*} param4 - 第四个参数
 * @returns {Promise} 提交结果的Promise
 */
export const submitChallenge = (challenge, sbcSet, skipValidation, useChemistry) =>
  observableToPromise(
    services.SBC.submitChallenge(challenge, sbcSet, skipValidation, useChemistry)
  );

/**
 * 请求指定套装的挑战列表
 * @param {Object} set - 套装对象
 * @returns {Promise} 挑战列表的Promise
 */
export const requestChallengesForSet = (set) =>
  observableToPromise(
    services.SBC.requestChallengesForSet(set)
  );

/**
 * 获取所有套装
 * @returns {Promise} 所有套装的Promise
 */
export const getAllSets = () =>
  observableToPromise(services.SBC.requestSets());

/**
 * 从奖励中获取包装奖励ID列表
 * @param {Object} challenge - 挑战对象
 * @returns {Array<string>} 包装奖励ID数组
 */
export const getPackRewardIds = (challenge) =>
  challenge.awards
    .filter(
      ({ isPack, type }) => isPack && type === RewardTypeEnum.PACK
    )
    .map(({ value }) => value);

/**
 * 根据套装ID集合获取挑战列表
 * @param {Set<string>} setIds - 套装ID集合
 * @returns {Promise<Array>} 挑战列表
 */
export const getChallengesBySetIds = async (setIds) => {
  const { data } = await getAllSets();

  if (!data) {
    return [];
  }

  // 过滤出指定ID的套装
  const filteredSets = data.sets.filter(({ id }) => setIds.has(id));

  // 加载每个套装的挑战数据
  for (const set of filteredSets) {
    if (!set.getChallenges().length) {
      await observableToPromise(
        services.SBC.requestChallengesForSet(set)
      );
      await wait(2.5);
    }
  }

  // 返回包含未完成挑战的套装
  return filteredSets.filter((set) =>
    set
      .getChallenges()
      .filter(({ status }) => status !== "COMPLETED").length
  );
};

/**
 * 加载挑战
 * @param {Object} challenge - 挑战对象
 * @param {boolean} useDAO - 是否使用DAO方式加载，默认false
 * @returns {Promise} 加载结果的Promise
 */
export const loadChallenge = (challenge, useDAO = false) =>
  useDAO
    ? observableToPromise(
        services.SBC.sbcDAO.loadChallenge(challenge.id, challenge.isInProgress())
      )
    : observableToPromise(services.SBC.loadChallenge(challenge));

/**
 * 重置挑战
 * 清空阵容并保存挑战
 * @param {Object} challenge - 挑战对象
 * @returns {Promise<void>}
 */
export const resetChallenge = async (challenge) => {
  challenge.squad?.removeAllItems();
  await saveChallenge(challenge);
};

/**
 * 刷新SBC套装列表
 * 获取所有套装并请求指定套装的挑战数据
 * @param {Array} sets - 套装数组
 * @returns {Promise<void>}
 */
export const refreshSbcSets = async (sets) => {
  await getAllSets();
  await wait(1.5);

  for (let i = 0; i < sets.length; i += 1) {
    await requestChallengesForSet(sets[i]);

    // 如果不是最后一个套装，等待2.5秒
    if (i + 1 !== sets.length) {
      await wait(2.5);
    }
  }
};

/**
 * 清空SBC阵容
 * 移除阵容中的所有物品并保存挑战
 * @param {Object} challenge - 挑战对象
 * @returns {Promise} 保存结果的Promise
 */
export const clearSbcSquad = (challenge) => {
  challenge.squad?.removeAllItems();
  return observableToPromise(services.SBC.saveChallenge(challenge));
};
