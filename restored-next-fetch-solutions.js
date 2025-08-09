// 还原后的获取解决方案模块代码
import { AuthManager } from './auth-manager'; // 对应 n(58250)
import { generateRequestId, sendRequest } from './utils'; // 对应 n(82125)
import { InMemoryStore, TTLCache } from './in-memory-store'; // 对应 n(32024)
import { config } from './config'; // 对应 n(30712)
import { NotificationOrchestrator } from './notification-orchestrator'; // 对应 n(26774)
import { showLoader, hideLoader, getPlayersForSbc, sendUINotification } from './sbc-module'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { translate } from './translation-utils'; // 对应 n(44669)
import { showRateLimitPopup } from './rate-limit-popup'; // 对应 n(87074)

// 创建TTL缓存实例用于缓存解决方案
const solutionsCache = new TTLCache();

/**
 * 发送解决方案请求到服务器
 * @param {Object} requestData - 请求数据
 * @param {string} requestId - 请求ID
 * @returns {Promise<Object>} 服务器响应数据
 */
const fetchSolutionsFromServer = async (requestData, requestId) => {
  // 生成缓存键
  const cacheKey = `${requestData.sbcId}_${requestData.settings.findCheapest}_${requestData.players.join}`;

  // 检查缓存
  const cachedResult = solutionsCache.get(cacheKey);
  if (cachedResult) {
    return cachedResult;
  }

  try {
    // 发送HTTP请求
    const response = await sendRequest(
      `${config.api.nextRestBase}/sbc-solver/solutions`,
      "POST",
      `${Math.floor(Date.now())}_generateSolution_${requestData.sbcId}`,
      JSON.stringify(requestData),
      {
        Authorization: `Bearer ${await AuthManager.instance.getAccessToken()}`,
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
      }
    );

    const result = JSON.parse(response);

    // 缓存结果
    solutionsCache.set(cacheKey, result);

    return result;
  } catch (error) {
    // 处理限流错误
    if (error === 429) {
      showRateLimitPopup();
    }

    // 返回空结果
    return {
      solutions: [],
      failingRequirements: []
    };
  }
};

/**
 * 获取SBC解决方案
 * @param {Object} challenge - 挑战对象
 * @param {boolean} findCheapest - 是否查找最便宜的解决方案
 * @returns {Promise<Array>} 解决方案数组
 */
export const nextFetchSolutions = async (challenge, findCheapest) => {
  // 检查用户权限
  if (!AuthManager.instance.hasEnhancerAccess(true)) {
    return [];
  }

  // 生成请求ID
  const requestId = generateRequestId();

  // 显示通知
  NotificationOrchestrator.instance.notifyUI(
    translate("optimalSquadFindWithRequestId", { requestId })
  );

  // 显示加载器
  showLoader();

  // 获取增强器设置
  const { excludeActiveSquad, ignoreEvolutionPlayers } =
    InMemoryStore.instance.get("enhancerSettings");

  // 获取SBC用的球员数据
  const { players } = await getPlayersForSbc(excludeActiveSquad, ignoreEvolutionPlayers);

  // 获取挑战ID
  const challengeId = challenge.id;

  // 发送解决方案请求
  const responseData = await fetchSolutionsFromServer(
    {
      players,
      sbcId: challengeId,
      settings: { findCheapest }
    },
    requestId
  );

  // 解构响应数据
  const { solutions } = responseData;

  // 过滤有效解决方案
  const validSolutions = solutions.filter((solution) => solution.length > 0);

  // 隐藏加载器
  hideLoader();

  // 如果没有找到解决方案
  if (!validSolutions.length) {
    sendUINotification(
      translate("unableToGenerateSolution"),
      UINotificationTypeEnum.NEGATIVE
    );
    return [];
  }

  // 创建用户拥有球员的ID集合
  const ownedPlayerIds = new Set(players.map((player) => player.id));

  // 转换解决方案为数据提供者条目
  return validSolutions.map((solution) => {
    // 生成球员ID字符串
    const playersString = solution.map((player) => player?.definitionId ?? 0).join(",");

    // 计算需要购买的球员总价格
    const totalPrice = solution.reduce(
      (total, player) =>
        ownedPlayerIds.has(player?.definitionId ?? 0)
          ? total
          : total + (player?.price ?? 0),
      0
    );

    // 计算拥有的球员数量
    const availablePlayersCount = solution.filter(
      (player) => ownedPlayerIds.has(player?.definitionId ?? 0)
    ).length;

    // 生成解决方案链接
    const solutionUrl = `${config.nextDomain}?sbcId=${challengeId}&players=${playersString}`;

    // 生成解决方案类型标识
    const solutionType = findCheapest ? "C" : "P"; // C = Cheapest, P = Performance

    // 创建数据提供者条目
    return new UTDataProviderEntryDTO(
      playersString,
      solutionUrl,
      `${translate("solutionsList", {
        price: totalPrice,
        availablePlayers: availablePlayersCount,
      })} (${solutionType})`
    );
  });
};
