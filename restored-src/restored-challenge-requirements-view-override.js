// 还原后的挑战需求视图覆盖模块代码
import { appendQuickAddButton } from './append-quick-add-button'; // 对应 n(43558)

/**
 * 挑战需求视图覆盖函数
 * 为SBC挑战需求视图添加快速添加按钮功能
 */
export const challengeRequirementsViewOverride = () => {
  // 保存原始方法的引用
  const {
    renderChallengeRequirements: originalRenderChallengeRequirements,
    destroyGeneratedElements: originalDestroyGeneratedElements,
  } = UTSBCChallengeRequirementsView.prototype;

  // 覆盖渲染挑战需求方法
  UTSBCChallengeRequirementsView.prototype.renderChallengeRequirements = function (challenge, param) {
    // 调用原始的渲染方法
    const result = originalRenderChallengeRequirements.call(this, challenge, param);

    // 延迟100毫秒后添加快速添加按钮
    // 使用setTimeout确保DOM元素已经完全渲染
    setTimeout(() => appendQuickAddButton(this, challenge), 100);

    return result;
  };

  // 覆盖销毁生成元素方法
  UTSBCChallengeRequirementsView.prototype.destroyGeneratedElements = function (...args) {
    // 调用原始的销毁方法
    const result = originalDestroyGeneratedElements.call(this, ...args);

    // 清理自定义按钮
    this.custom_buttons?.forEach((button) => button.destroy());
    this.custom_buttons = undefined;

    return result;
  };
};
