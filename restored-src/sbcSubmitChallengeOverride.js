/**
 * SBC提交挑战重写模块
 * 重写原生的submitChallenge方法，添加额外的处理逻辑
 */

import { sendRequest } from './utils'; // 假设从82125模块导入
import { config } from './config'; // 假设从30712模块导入
import { CurrentDataSource } from './currentDataSource'; // 假设从53403模块导入
import { getUserPlatform } from './userUtils'; // 假设从13808模块导入
import { moveDuplicatesAfterSubmit } from './duplicateUtils'; // 假设从13640模块导入
import { updateSolvedCount, showSoftBanPopup } from './sbcUtils'; // 假设从49434模块导入

/**
 * 检查响应数据是否包含物品违规信息
 * @param {*} data - 响应数据
 * @returns {boolean} 是否包含物品违规
 */
const hasItemViolations = (data) => {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (!("itemViolations" in data) || !Array.isArray(data.itemViolations)) {
    return false;
  }

  return data.itemViolations.length > 0;
};

/**
 * 保存解决方案到追踪器
 * @param {Object} challenge - 挑战对象
 * @param {Array} squadPlayers - 阵容球员数组
 */
const saveSolutionToTracker = (challenge, squadPlayers) => {
  // 检查是否包含学院球员
  const hasAcademyPlayer = challenge.squad
    ?.getFieldPlayers()
    .some((player) => !!player.item.academy);

  // 如果有学院球员或没有阵容球员，直接返回
  if (hasAcademyPlayer || !squadPlayers.length) {
    return;
  }

  // 提取球员定义ID
  const playerDefinitionIds = squadPlayers.map(({ definitionId }) => definitionId);

  // 构建需求数据
  const requirements = challenge.eligibilityRequirements.map((requirement) => ({
    scope: requirement.scope,
    requirements: requirement.kvPairs._collection,
  }));

  // 添加精确需求（球员数量）
  requirements.push({
    scope: SBCEligibilityScope.EXACT,
    requirements: {
      "-1": [challenge.squad?.getNumOfRequiredPlayers() ?? 0],
    },
  });

  // 异步保存解决方案
  (async (solutionData) => {
    try {
      // 获取球员价格
      const playersWithPrices = await CurrentDataSource.instance.fetchItemPrices(
        solutionData.players
          .filter((player) => !!player)
          .map((player) => ({ definitionId: player }))
      );

      // 计算阵容总价格
      const squadPrice = playersWithPrices.reduce(
        (total, { price, definitionId }) => {
          if (!definitionId) return total;
          return (total !== undefined && price) ? total + price : undefined;
        },
        0
      );

      // 发送保存请求
      sendRequest(
        `${config.api.trackerBase}/sbc/save`,
        "POST",
        `${Math.floor(Date.now())}_saveSolution`,
        JSON.stringify({
          ...solutionData,
          squadPrice: squadPrice,
          platform: getUserPlatform(),
        }),
        { "Content-Type": "application/json" }
      );
    } catch (error) {
      console.error("Failed to save solution to tracker:", error);
    }
  })({
    sbcId: challenge.id,
    players: playerDefinitionIds,
    expiresOn: challenge.endTime,
    requirements: requirements,
  });
};

/**
 * 重写SBC提交挑战方法
 * 添加成功后的处理逻辑和错误处理
 */
export const sbcSubmitChallengeOverride = () => {
  // 保存原始的submitChallenge方法
  const { submitChallenge: originalSubmitChallenge } = services.SBC;

  // 重写submitChallenge方法
  services.SBC.submitChallenge = function (challenge, param2, ...restParams) {
    // 获取当前阵容中的球员
    const squadPlayers = challenge.squad?.getFieldPlayers().map((player) => player.item) ?? [];

    // 调用原始方法
    const result = originalSubmitChallenge.call(this, challenge, param2, ...restParams);

    // 观察结果并添加处理逻辑
    result.observe(
      this,
      (observable, { success, error, status, data }) => {
        // 取消观察
        observable.unobserve(this);

        if (success) {
          // 成功时的处理
          // 1. 移动重复球员
          moveDuplicatesAfterSubmit(squadPlayers);

          // 2. 更新已解决数量
          updateSolvedCount();

          // 3. 保存解决方案到追踪器
          saveSolutionToTracker(challenge, squadPlayers);
        } else {
          // 失败时的处理
          // 如果不是物品违规错误，显示软封禁弹窗
          if (!hasItemViolations(data)) {
            showSoftBanPopup(error?.code ?? status);
          }
        }
      }
    );

    return result;
  };
};
