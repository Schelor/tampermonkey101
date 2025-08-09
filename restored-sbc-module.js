// 还原后的SBC模块代码
import { wait } from './utils'; // 对应 n(82125)
import { RewardTypeEnum } from './enums'; // 对应 n(26735)
import { observableToPromise } from './observable-utils'; // 对应 n(27988)

/**
 * 保存挑战
 * @param {Object} challenge - 挑战对象
 * @returns {Promise} 保存结果的Promise
 */
export const saveChallenge = (challenge) =>
  observableToPromise(services.SBC.saveChallenge(challenge));

/**
 * 提交挑战
 * @param {*} param1 - 参数1
 * @param {*} param2 - 参数2
 * @param {*} param3 - 参数3
 * @param {*} param4 - 参数4
 * @returns {Promise} 提交结果的Promise
 */
export const submitChallenge = (param1, param2, param3, param4) =>
  observableToPromise(
    services.SBC.submitChallenge(param1, param2, param3, param4)
  );

/**
 * 请求指定集合的挑战
 * @param {Object} set - 集合对象
 * @returns {Promise} 挑战数据的Promise
 */
export const requestChallengesForSet = (set) =>
  observableToPromise(
    services.SBC.requestChallengesForSet(set)
  );

/**
 * 获取所有集合
 * @returns {Promise} 所有集合数据的Promise
 */
export const getAllSets = () =>
  observableToPromise(services.SBC.requestSets());

/**
 * 获取奖励包ID列表
 * @param {Object} challenge - 挑战对象
 * @returns {Array} 奖励包ID数组
 */
export const getPackRewardIds = (challenge) =>
  challenge.awards
    .filter(
      ({ isPack, type }) => isPack && type === RewardTypeEnum.PACK
    )
    .map(({ value }) => value);

/**
 * 根据集合ID获取挑战
 * @param {Set} setIds - 集合ID的Set对象
 * @returns {Promise<Array>} 挑战数组的Promise
 */
export const getChallengesBySetIds = async (setIds) => {
  const { data } = await getAllSets();

  if (!data) {
    return [];
  }

  // 内部异步函数，处理集合数据
  const processSets = async (sets) => {
    for (const set of sets) {
      // 如果集合没有挑战数据，则请求获取
      if (!set.getChallenges().length) {
        await observableToPromise(
          services.SBC.requestChallengesForSet(set)
        );
        await wait(2.5); // 等待2.5秒
      }
    }

    // 返回有未完成挑战的集合
    return sets.filter(
      (set) =>
        set
          .getChallenges()
          .filter(({ status }) => status !== "COMPLETED").length
    );
  };

  // 过滤出指定ID的集合并处理
  const filteredSets = data.sets.filter(({ id }) => setIds.has(id));
  return await processSets(filteredSets);
};

/**
 * 加载挑战
 * @param {Object} challenge - 挑战对象
 * @param {boolean} forceReload - 是否强制重新加载，默认false
 * @returns {Promise} 挑战数据的Promise
 */
export const loadChallenge = (challenge, forceReload = false) =>
  forceReload
    ? observableToPromise(
        services.SBC.sbcDAO.loadChallenge(challenge.id, challenge.isInProgress())
      )
    : observableToPromise(services.SBC.loadChallenge(challenge));

/**
 * 重置挑战
 * @param {Object} challenge - 挑战对象
 * @returns {Promise} 重置结果的Promise
 */
export const resetChallenge = async (challenge) => {
  // 移除队伍中的所有物品
  challenge.squad?.removeAllItems();
  // 保存挑战
  await saveChallenge(challenge);
};

/**
 * 刷新SBC集合
 * @param {Array} sets - 集合数组
 * @returns {Promise} 刷新结果的Promise
 */
export const refreshSbcSets = async (sets) => {
  // 获取所有集合
  await getAllSets();
  await wait(1.5); // 等待1.5秒

  // 遍历集合并请求挑战数据
  for (let i = 0; i < sets.length; i += 1) {
    await requestChallengesForSet(sets[i]);

    // 如果不是最后一个集合，等待2.5秒
    if (i + 1 !== sets.length) {
      await wait(2.5);
    }
  }
};

/**
 * 清空SBC队伍
 * @param {Object} challenge - 挑战对象
 * @returns {Promise} 清空结果的Promise
 */
export const clearSbcSquad = (challenge) => {
  // 移除队伍中的所有物品
  challenge.squad?.removeAllItems();
  // 保存挑战
  return observableToPromise(services.SBC.saveChallenge(challenge));
};
