// 还原后的SBC视图覆盖模块代码
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import {
  createTextInput,
  createButton,
  createDropDown,
  getLocalization
} from './observable-utils'; // 对应 n(27988)
import { constructNavigationLink, openUrl } from './utils'; // 对应 n(82125)
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)
import { translate } from './translation-utils'; // 对应 n(44669)
import { sendUINotification, showLoader, hideLoader } from './sbc-module'; // 对应 n(13808)
import { config } from './config'; // 对应 n(30712)
import { positionPlayers } from './position-players'; // 对应 n(55392)
import { getConceptPlayers } from './concept-players'; // 对应 n(12335)
import { dismissSquadMenu } from './squad-menu'; // 对应 n(27358)
import { validateAndAutobuyConceptPlayers } from './autobuy-concept-players'; // 对应 n(9881)
import { showGenerateSolutionPopup } from './generate-solution-popup'; // 对应 n(46000)
import { nextFetchSolutions } from './next-fetch-solutions'; // 对应 n(90236)
import { canMultiSolve } from './multi-solve-checker'; // 对应 n(15925)
import { canOptimizeChemistry } from './chemistry-optimizer-checker'; // 对应 n(74477)
import { showChemistryOptimizerPopup } from './chemistry-optimizer-popup'; // 对应 n(64003)

/**
 * SBC视图覆盖函数
 * 为SBC界面添加增强功能和自定义UI元素
 */
export const sbcViewOverride = () => {
  // 保存原始方法的引用
  const originalRender = UTSBCSquadDetailPanelView.prototype.render;
  const originalDestroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;

  // 获取增强器设置和数据
  const enhancerSettings = InMemoryStore.instance.get("enhancerSettings");
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  /**
   * 应用解决方案到SBC挑战
   * @param {Object} challenge - 挑战对象
   * @param {string} solutionUrl - 解决方案URL
   */
  const applySolution = async (challenge, solutionUrl) => {
    const urlParams = new URLSearchParams(new URL(solutionUrl).search);
    const sbcId = urlParams.get("sbcId");
    const playersString = urlParams.get("players");

    // 验证URL参数
    if (!sbcId || !playersString) {
      sendUINotification(
        translate("noValidSolutionInClipboard"),
        UINotificationTypeEnum.NEGATIVE
      );
      return;
    }

    // 验证SBC ID是否匹配
    if (+sbcId !== challenge.id) {
      sendUINotification(
        translate("inCorrectSolution"),
        UINotificationTypeEnum.NEGATIVE
      );
      return;
    }

    showLoader();

    // 解析球员数据
    const players = playersString.split(",").map((definitionId, index) => ({
      definitionId: +definitionId,
      position: `${index}`,
      price: 0,
    }));

    // 应用解决方案
    await positionPlayers(Promise.resolve({ players }), challenge);
    dismissSquadMenu();
    hideLoader();
  };

  /**
   * 创建自定义UI元素
   * @param {Object} challenge - 挑战对象
   */
  const createCustomElements = async function (challenge) {
    // 创建FUTNext ID输入框
    this.custom_sbcIdInput = createTextInput({
      label: "FUTNext Id",
      customClass: "futbin-fill-id",
      isSeparatelabel: false,
    });

    // 创建自动填充按钮
    this.custom_fillSBCBtn = createButton({
      label: "Auto fill",
      onClick: async () => {
        const inputValue = this.custom_sbcIdInput?.getValue();
        if (inputValue) {
          await applySolution(challenge, inputValue);
        }
      },
      customClass: "call-to-action",
      id: "sbc_auto_fill",
    });

    // 创建购买缺失球员按钮
    this.custom_buyMissingPlayersBtn = createButton({
      label: translate("buyMissingPlayer"),
      onClick: () => {
        const conceptPlayers = getConceptPlayers(challenge.squad);
        validateAndAutobuyConceptPlayers(this, conceptPlayers);
      },
      customClass: "call-to-action",
      id: "sbc_buy_missing_players",
    });

    // 创建俱乐部球员解决方案下拉菜单
    this.custom_clubPlayersSolutions = createDropDown({
      label: translate("clubPlayersSolutions"),
      options: [],
      useLabelAsOption: true,
      onChange: (selectedUrl) => {
        applySolution(challenge, selectedUrl);
      },
      dynamicOptionCallBack: () => nextFetchSolutions(challenge, false),
      customClass: "sbc-solutions",
      id: "sbc_club_players_solution_list",
    });

    // 创建便宜解决方案下拉菜单
    this.custom_cheapSolutions = createDropDown({
      label: translate("cheapSolutions"),
      options: [],
      useLabelAsOption: true,
      onChange: (selectedUrl) => {
        applySolution(challenge, selectedUrl);
      },
      dynamicOptionCallBack: () => nextFetchSolutions(challenge, true),
      customClass: "sbc-solutions",
      id: "sbc_cheap_solution_list",
    });

    // 创建解决方案包装器
    this.custom_sbcSolutionsWrapper = document.createElement("div");
    this.custom_sbcSolutionsWrapper.classList.add("sbc-solutions-wrapper");
    this.custom_sbcSolutionsWrapper.append(this.custom_clubPlayersSolutions.element);
    this.custom_sbcSolutionsWrapper.append(this.custom_cheapSolutions.element);

    // 创建填充区域
    const fillDiv = document.createElement("div");
    fillDiv.classList.add("futbin-fill");
    fillDiv.append(this.custom_sbcIdInput.element);
    fillDiv.append(this.custom_fillSBCBtn.element);
    this.__content.append(this.custom_sbcSolutionsWrapper, fillDiv);

    // 创建动作按钮包装器
    const actionButtonWrapper = document.createElement("div");
    actionButtonWrapper.classList.add("sbc-action-button-wrapper");

    // 检查多解决方案和化学优化功能可用性
    const [canMultiSolveResult, canOptimizeChemistryResult] = await Promise.all([
      canMultiSolve(challenge),
      canOptimizeChemistry(challenge),
    ]);

    // 创建生成解决方案按钮
    this.custom_generateSlnBtn = createButton({
      label: translate("generateSolution"),
      onClick: () => {
        showGenerateSolutionPopup(this, challenge, enhancerSettings);
      },
      customClass: "call-to-action btn-standard generate-btn btn-gradient-secondary",
      id: "sbc_generate_solution",
    });
    actionButtonWrapper.append(this.custom_generateSlnBtn.element);

    // 如果支持多解决方案，创建多次求解按钮
    if (canMultiSolveResult) {
      this.custom_solveMultipleBtn = createButton({
        label: translate("solveMultiTimes"),
        onClick: () => {
          showGenerateSolutionPopup(this, challenge, enhancerSettings, {
            isMultiSolveEnabled: true,
          });
        },
        customClass: "call-to-action btn-standard",
        id: "sbc_multi_solve",
      });
      actionButtonWrapper.append(this.custom_solveMultipleBtn.element);
    }

    // 如果支持化学优化，创建优化化学按钮
    if (canOptimizeChemistryResult) {
      this.custom_optimizeChemistryBtn = createButton({
        label: translate("optimizeChemistry"),
        onClick: () => {
          if (challenge.squad) {
            showChemistryOptimizerPopup(challenge.squad, false);
          } else {
            sendUINotification(
              getLocalization().localize("popup.error.activesquad.SaveFailed"),
              UINotificationTypeEnum.NEGATIVE
            );
          }
        },
        customClass: "call-to-action btn-standard",
        id: "sbc_optimize_chemistry",
      });
      actionButtonWrapper.append(this.custom_optimizeChemistryBtn.element);
    }

    // 创建填充剩余位置按钮
    this.custom_fillRemainingBtn = createButton({
      label: translate("fillRemainingSlots"),
      onClick: () => {
        const existingPlayers = challenge.squad
          ?.getFieldPlayers()
          .filter(({ item }) => !!item.definitionId && !item.concept)
          .map(({ item }) => item.definitionId) ?? [];

        if (!existingPlayers.length) {
          sendUINotification(
            translate("noPlayersInSquad"),
            UINotificationTypeEnum.NEGATIVE
          );
          return;
        }

        const requiredPlayersCount = challenge.squad?.getNumOfRequiredPlayers() ?? -1;

        if (existingPlayers.length !== requiredPlayersCount) {
          showGenerateSolutionPopup(this, challenge, enhancerSettings, {
            isFillRemainingSlots: true,
          });
        } else {
          sendUINotification(
            translate("noEmptySlot"),
            UINotificationTypeEnum.NEGATIVE
          );
        }
      },
      customClass: "call-to-action btn-standard fill-slot-btn",
      id: "sbc_fill_remaining_slots",
    });
    actionButtonWrapper.append(this.custom_fillRemainingBtn.element);

    // 创建查看更多解决方案按钮
    this.custom_viewMoreOnFutNextBtn = createButton({
      label: translate("copySolutions"),
      onClick: () => {
        const { name, setId, id } = challenge;
        const navigationLink = constructNavigationLink(
          "sbc",
          name,
          `${setId}`,
          name,
          `${id}`,
          "solutions"
        );
        openUrl(`${config.nextDomain}/${navigationLink}`, "sbcsolutions");
      },
      customClass: "call-to-action view-more-solutions",
      id: "sbc_view_more_on",
    });
    actionButtonWrapper.append(this.custom_viewMoreOnFutNextBtn.element);
    actionButtonWrapper.append(this.custom_buyMissingPlayersBtn.element);

    this.__content.append(actionButtonWrapper);
  };

  /**
   * 粘贴事件处理器
   * @param {ClipboardEvent} event - 粘贴事件
   */
  const handlePasteEvent = async function (event) {
    const clipboardText = event.clipboardData?.getData("text");

    if (clipboardText) {
      applySolution(this, clipboardText);
    } else {
      sendUINotification(
        translate("noClipBoardData"),
        UINotificationTypeEnum.NEGATIVE
      );
    }
  };

  // 覆盖原始的render方法
  UTSBCSquadDetailPanelView.prototype.render = function (challenge, ...args) {
    // 更新最后打开的SBC信息
    const { lastOpenedSBC } = InMemoryStore.instance.get("enhancerData");
    lastOpenedSBC.challengeId = challenge.id;
    lastOpenedSBC.setId = challenge.setId;

    // 如果还没有创建自定义元素，则创建它们
    if (!this.custom_sbcIdInput) {
      createCustomElements.call(this, challenge);
      originalRender.call(this, challenge, ...args);

      // 添加粘贴事件监听器
      this.custom_pasteEventHandler = handlePasteEvent.bind(challenge);
      document.addEventListener("paste", this.custom_pasteEventHandler);
    }

    // 更新增强器数据状态
    enhancerData.autoBuyCheapest = false;
    enhancerData.isInSBCSquadPage = true;
  };

  // 覆盖原始的destroyGeneratedElements方法
  UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function (...args) {
    // 调用原始方法
    originalDestroyGeneratedElements.call(this, ...args);

    // 移除粘贴事件监听器
    document.removeEventListener("paste", this.custom_pasteEventHandler);
    this.custom_pasteEventHandler = undefined;

    // 更新状态
    enhancerData.isInSBCSquadPage = false;

    // 销毁自定义元素
    this.custom_buyMissingPlayersBtn?.destroy();
    this.custom_clubPlayersSolutions?.destroy();
    this.custom_cheapSolutions?.destroy();
    this.custom_fillSBCBtn?.destroy();
    this.custom_generateSlnBtn?.destroy();
    this.custom_optimizeChemistryBtn?.destroy();
    this.custom_fillRemainingBtn?.destroy();
    this.custom_solveMultipleBtn?.destroy();
    this.custom_viewMoreOnFutNextBtn?.destroy();
    this.custom_sbcIdInput?.destroy();
    this.custom_sbcSolutionsWrapper?.remove();

    // 清理引用
    this.custom_buyMissingPlayersBtn = undefined;
    this.custom_clubPlayersSolutions = undefined;
    this.custom_cheapSolutions = undefined;
    this.custom_fillSBCBtn = undefined;
    this.custom_generateSlnBtn = undefined;
    this.custom_optimizeChemistryBtn = undefined;
    this.custom_fillRemainingBtn = undefined;
    this.custom_solveMultipleBtn = undefined;
    this.custom_viewMoreOnFutNextBtn = undefined;
    this.custom_sbcIdInput = undefined;
    this.custom_sbcSolutionsWrapper = undefined;
  };
};
