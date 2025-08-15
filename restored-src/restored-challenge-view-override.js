// 还原后的挑战视图覆盖模块代码
import { createButton } from './ui-utils'; // 对应 n(27988)
import { append } from './utils'; // 对应 n(82125)
import { translate } from './translation-utils'; // 对应 n(44669)
import { canSolveSet } from './sbc-solver-checker'; // 对应 n(44474)
import { showPendingChallengesPopup } from './pending-challenges-popup'; // 对应 n(31786)

/**
 * 挑战视图覆盖
 * 扩展原生的SBC挑战视图，添加"解决整个集合"功能
 */
export const challengeViewOverride = () => {
  // 保存原始方法的引用
  const { setSBCSet: originalSetSBCSet, destroyGeneratedElements: originalDestroyGeneratedElements } =
    UTSBCChallengesView.prototype;

  /**
   * 覆盖setSBCSet方法
   * 在设置SBC集合时添加自定义的"解决整个集合"按钮
   */
  UTSBCChallengesView.prototype.setSBCSet = function (sbcSet, ...args) {
    // 调用原始方法
    const result = originalSetSBCSet.call(this, sbcSet, ...args);

    // 异步添加自定义功能
    (async (viewInstance, sbcSet) => {
      // 获取未完成的挑战
      const incompleteChallenges = sbcSet
        .getChallenges()
        .filter(({ status }) => status !== "COMPLETED");

      // 销毁之前的按钮（如果存在）
      viewInstance.custom_solveEntireSet?.destroy();

      // 检查是否可以解决整个集合
      const { canSolve, isBeta } = await canSolveSet(sbcSet.id);

      // 如果不能解决，直接返回
      if (!canSolve) {
        return;
      }

      // 创建"解决整个集合"按钮
      viewInstance.custom_solveEntireSet = createButton({
        label: translate(isBeta ? "solveEntireSetBeta" : "solveEntireSet"),
        onClick: () => {
          // 显示待处理挑战弹窗
          showPendingChallengesPopup(viewInstance, [sbcSet], incompleteChallenges);
        },
        id: "sbc_solve_entire_set",
        customClass: "solve-entire-set-btn",
      });

      // 将按钮添加到界面
      const setInfoRootElement = viewInstance._setInfo.getRootElement();
      if (setInfoRootElement) {
        append(setInfoRootElement, viewInstance.custom_solveEntireSet.element);
      }
    })(this, sbcSet);

    return result;
  };

  /**
   * 覆盖destroyGeneratedElements方法
   * 在销毁生成的元素时，同时清理自定义按钮
   */
  UTSBCChallengesView.prototype.destroyGeneratedElements = function (...args) {
    // 调用原始方法
    const result = originalDestroyGeneratedElements.call(this, ...args);

    // 清理自定义按钮
    this.custom_solveEntireSet?.destroy();
    this.custom_solveEntireSet = undefined;

    return result;
  };
};
