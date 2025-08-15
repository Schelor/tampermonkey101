// 还原后的生成解决方案模块代码
import { AuthManager } from './auth-manager'; // 对应 n(58250)
import { generateRequestId, sendRequest, wait } from './utils'; // 对应 n(82125)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import { NotificationOrchestrator } from './notification-orchestrator'; // 对应 n(26774)
import { translate } from './translation-utils'; // 对应 n(44669)
import { config } from './config'; // 对应 n(30712)
import { showLoader, hideLoader, sendUINotification } from './sbc-module'; // 对应 n(13808)
import { selectSolution } from './select-solution'; // 对应 n(46418)
import { showMultiSolvePopup } from './multi-solve-popup'; // 对应 n(50634)
import { showGenerateSolutionFailedPopup } from './solution-failed-popup'; // 对应 n(97154)
import { selectSolutionMimic } from './solution-mimic'; // 对应 n(16037)
import { showRateLimitPopup } from './rate-limit-popup'; // 对应 n(87074)

/**
 * 发送SBC求解请求到服务器
 * @param {string} requestId - 请求ID
 * @param {Object} requestData - 请求数据
 * @returns {Promise<Object>} 服务器响应数据
 */
const sendSolverRequest = async (requestId, requestData) => {
  try {
    // 发送POST请求到SBC求解器API
    const response = await sendRequest(
      `${config.api.nextRestBase}/sbc-solver/solve`,
      "POST",
      `${Math.floor(Date.now())}_generateSolution_${requestData.sbcId}`,
      JSON.stringify(requestData),
      {
        Authorization: `Bearer ${await AuthManager.instance.getAccessToken()}`,
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
      }
    );

    return JSON.parse(response);
  } catch (error) {
    // 如果是429错误（请求过于频繁），显示限流弹窗
    if (error === 429) {
      showRateLimitPopup();
    }

    // 返回空的解决方案和失败要求
    return {
      solutions: [],
      failingRequirements: []
    };
  }
};

/**
 * 生成SBC解决方案
 * @param {Object} view - 视图对象
 * @param {Object} set - 集合对象
 * @param {Object} requestData - 请求数据
 * @param {boolean} useMimic - 是否使用模拟选择
 * @returns {Promise<void>}
 */
export const generateSolution = async (view, set, requestData, useMimic) => {
  // 生成唯一的请求ID
  const requestId = generateRequestId();

  // 显示通知，告知用户正在查找最优阵容
  NotificationOrchestrator.instance.notifyUI(
    translate("optimalSquadFindWithRequestId", { requestId })
  );

  // 显示加载器
  showLoader();

  // 发送求解请求
  const responseData = await sendSolverRequest(requestId, requestData);

  // 解构响应数据
  const { solutions, failingRequirements } = responseData;

  // 过滤掉空的解决方案
  const validSolutions = solutions.filter((solution) => solution.length > 0);

  // 检查是否需要多解决方案模式
  const isMultiSolve = (requestData.multiSolve?.numberOfSolutions ?? 0) > 1 && validSolutions.length > 1;

  // 隐藏加载器
  hideLoader();

  // 如果没有失败要求或者是多解决方案模式
  if (!failingRequirements.length || isMultiSolve) {
    // 如果有有效的解决方案
    if (validSolutions.length) {
      if (isMultiSolve) {
        // 显示多解决方案弹窗
        showMultiSolvePopup(view, set, validSolutions, requestData.concept.useConcept);
      } else {
        // 单个解决方案处理
        if (useMimic &&
            !requestData.concept.useConcept &&
            view instanceof UTSBCSquadDetailPanelView) {
          // 使用模拟选择
          selectSolutionMimic(view, set, validSolutions[0]);
        } else {
          // 使用普通选择
          selectSolution(set, validSolutions[0]);
        }
      }
      return;
    } else {
      // 没有找到解决方案
      await wait(1);
      sendUINotification(
        translate("unableToGenerateSolution"),
        UINotificationTypeEnum.NEGATIVE
      );
      return;
    }
  }

  // 显示生成解决方案失败的弹窗
  showGenerateSolutionFailedPopup(view, set, requestData, failingRequirements, validSolutions, useMimic);
};
