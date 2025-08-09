import { sendRequest } from './sendRequest'; // 假设从82125模块导入
import { config } from './config'; // 假设从30712模块导入
import { CurrentDataSource } from './CurrentDataSource'; // 假设从53403模块导入
import { getUserPlatform } from './getUserPlatform'; // 假设从13808模块导入
import { moveDuplicatesAfterSubmit } from './moveDuplicatesAfterSubmit'; // 假设从13640模块导入
import { updateSolvedCount, showSoftBanPopup } from './sbcUtils'; // 假设从49434模块导入

export const sbcSubmitChallengeOverride = () => {
  // 保存原始的submitChallenge方法
  const { submitChallenge: originalSubmitChallenge } = services.SBC;

  // 覆盖SBC的submitChallenge方法
  services.SBC.submitChallenge = function(challenge, param2, ...otherArgs) {
    // 获取阵容中的球员物品
    const squadPlayers = challenge.squad?.getFieldPlayers().map(player => player.item) ?? [];

    // 调用原始的submitChallenge方法
    const result = originalSubmitChallenge.call(this, challenge, param2, ...otherArgs);

    // 观察提交结果
    result.observe(this, (observer, { success, error, status, data }) => {
      observer.unobserve(this);

      if (success) {
        // 提交成功时的处理

        // 移动重复项
        moveDuplicatesAfterSubmit(squadPlayers);

        // 更新已解决计数
        updateSolvedCount();

        // 保存解决方案到追踪器
        saveSolutionToTracker(challenge, squadPlayers);

      } else {
        // 提交失败时的处理

        // 检查是否有物品违规
        const hasItemViolations = checkItemViolations(data);

        if (!hasItemViolations) {
          // 如果没有物品违规，显示软封禁弹窗
          showSoftBanPopup(error?.code ?? status);
        }
      }
    });

    return result;
  };

  // 保存解决方案到追踪器的函数
  const saveSolutionToTracker = (challenge, squadPlayers) => {
    // 检查是否有学院球员
    const hasAcademyPlayer = challenge.squad
      ?.getFieldPlayers()
      .some(player => !!player.item.academy);

    // 如果有学院球员或没有阵容球员，则不保存
    if (hasAcademyPlayer || !squadPlayers.length) {
      return;
    }

    // 获取球员定义ID
    const playerDefinitionIds = squadPlayers.map(({ definitionId }) => definitionId);

    // 构建资格要求
    const eligibilityRequirements = challenge.eligibilityRequirements.map(requirement => ({
      scope: requirement.scope,
      requirements: requirement.kvPairs._collection
    }));

    // 添加精确范围要求
    eligibilityRequirements.push({
      scope: SBCEligibilityScope.EXACT,
      requirements: {
        "-1": [challenge.squad?.getNumOfRequiredPlayers() ?? 0]
      }
    });

    // 异步保存解决方案
    saveSolutionAsync({
      sbcId: challenge.id,
      players: playerDefinitionIds,
      expiresOn: challenge.endTime,
      requirements: eligibilityRequirements
    });
  };

  // 异步保存解决方案的函数
  const saveSolutionAsync = async (solutionData) => {
    try {
      // 获取球员价格
      const playerPrices = await CurrentDataSource.instance.fetchItemPrices(
        solutionData.players
          .filter(playerId => !!playerId)
          .map(playerId => ({ definitionId: playerId }))
      );

      // 计算阵容总价格
      const squadPrice = playerPrices.reduce((total, { price, definitionId }) => {
        if (!definitionId) return total;
        return (total !== undefined && price !== undefined) ? total + price : undefined;
      }, 0);

      // 发送保存请求
      sendRequest(
        `${config.api.trackerBase}/sbc/save`,
        "POST",
        `${Math.floor(Date.now())}_saveSolution`,
        JSON.stringify({
          ...solutionData,
          squadPrice: squadPrice,
          platform: getUserPlatform()
        }),
        { "Content-Type": "application/json" }
      );
    } catch (error) {
      console.error('Failed to save SBC solution:', error);
    }
  };

  // 检查物品违规的函数
  const checkItemViolations = (data) => {
    if (!data || typeof data !== "object") {
      return false;
    }

    if (!("itemViolations" in data) || !Array.isArray(data.itemViolations)) {
      return false;
    }

    return data.itemViolations.length > 0;
  };
};
