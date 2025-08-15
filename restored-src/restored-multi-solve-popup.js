// 还原后的多解决方案弹窗模块代码
import { notNullorUndefined } from './utils'; // 对应 n(82125)
import { showPopUp, getNavigationController } from './observable-utils'; // 对应 n(27988)
import { AuthManager } from './auth-manager'; // 对应 n(58250)
import { translate } from './translation-utils'; // 对应 n(44669)
import { validateAndSubmit } from './validate-submit'; // 对应 n(54637)
import { createSolutionsTable } from './solutions-table'; // 对应 n(97410)

/**
 * 创建解决方案表格容器
 * @param {Object} challenge - 挑战对象
 * @param {Array} solutions - 解决方案数组
 * @param {Object} playerLookup - 球员查找表
 * @returns {HTMLElement} 表格容器元素
 */
const createSolutionTableContainer = (challenge, solutions, playerLookup) => {
  // 创建容器div
  const container = document.createElement("div");
  container.classList.add("pop-up-table");

  // 过滤掉null和undefined的球员，创建解决方案表格
  const filteredSolutions = solutions.map((solution) =>
    solution.filter(notNullorUndefined)
  );

  // 创建解决方案表格
  challenge.custom_solutionPlayersTable = createSolutionsTable(
    filteredSolutions,
    playerLookup
  );

  // 将表格添加到容器中
  container.appendChild(challenge.custom_solutionPlayersTable.element);

  return container;
};

/**
 * 清理解决方案表格
 * @param {Object} challenge - 挑战对象
 */
const cleanupSolutionTable = (challenge) => {
  // 销毁表格并清理引用
  challenge.custom_solutionPlayersTable?.destroy();
  challenge.custom_solutionPlayersTable = undefined;
};

/**
 * 显示多解决方案弹窗
 * @param {Object} challenge - 挑战对象
 * @param {Object} set - 集合对象
 * @param {Array} solutions - 解决方案数组
 * @param {Object} playerLookup - 球员查找表
 * @returns {Promise<void>}
 */
export const showMultiSolvePopup = async (challenge, set, solutions, playerLookup) => {
  // 检查用户是否有增强器访问权限
  if (!AuthManager.instance.hasEnhancerAccess(true)) {
    return;
  }

  // 创建解决方案表格容器
  const tableContainer = createSolutionTableContainer(challenge, solutions, playerLookup);

  // 显示弹窗
  showPopUp({
    // 弹窗标题
    title: translate("generateSolution"),

    // 弹窗内容（表格容器）
    message: tableContainer,

    // 选择回调函数
    onSelect: async (selectedOption) => {
      // 如果选择了确认选项（113）
      if (selectedOption === 113) {
        // 验证并提交解决方案
        await validateAndSubmit(set, solutions);

        // 返回上一个视图控制器
        getNavigationController().popViewController();
      }

      // 清理解决方案表格
      cleanupSolutionTable(challenge);
    },

    // 弹窗ID
    id: "popup_multi_solve",

    // 弹窗选项
    options: [
      { labelEnum: 113 }, // 确认选项
      { labelEnum: enums.UIDialogOptions.CANCEL }, // 取消选项
    ],
  });
};
