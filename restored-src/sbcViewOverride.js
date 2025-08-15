// SBC View Override Module
// This module enhances the SBC (Squad Building Challenge) interface in FIFA Ultimate Team

import { UINotificationTypeEnum } from './enums';
import {
  createTextInput,
  createButton,
  createDropDown,
  getLocalization
} from './ui-components';
import { constructNavigationLink, openUrl } from './navigation';
import { InMemoryStore } from './store';
import { translate } from './localization';
import {
  sendUINotification,
  showLoader,
  hideLoader
} from './notifications';
import { config } from './config';
import { positionPlayers } from './player-positioning';
import { getConceptPlayers } from './squad-utils';
import { dismissSquadMenu } from './menu-utils';
import { validateAndAutobuyConceptPlayers } from './auto-buy';
import { nextFetchSolutions } from './solutions';
import { showGenerateSolutionPopup } from './solution-generator';
import { canMultiSolve } from './multi-solve';
import { canOptimizeChemistry } from './chemistry';
import { showChemistryOptimizerPopup } from './chemistry-optimizer';

export const sbcViewOverride = () => {
  // Store original methods
  const originalRender = UTSBCSquadDetailPanelView.prototype.render;
  const originalDestroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;

  // Get settings and data from store
  const enhancerSettings = InMemoryStore.instance.get("enhancerSettings");
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  /**
   * Apply solution from URL or clipboard data
   * @param {Object} sbcChallenge - The SBC challenge object
   * @param {string} solutionUrl - URL containing solution data
   */
  const applySolution = async (sbcChallenge, solutionUrl) => {
    const urlParams = new URLSearchParams(new URL(solutionUrl).search);
    const sbcId = urlParams.get("sbcId");
    const playersParam = urlParams.get("players");

    if (!sbcId || !playersParam) {
      sendUINotification(
        translate("noValidSolutionInClipboard"),
        UINotificationTypeEnum.NEGATIVE
      );
      return;
    }

    if (+sbcId !== sbcChallenge.id) {
      sendUINotification(
        translate("inCorrectSolution"),
        UINotificationTypeEnum.NEGATIVE
      );
      return;
    }

    showLoader();

    // Parse players from URL parameter
    const players = playersParam.split(",").map((playerId, index) => ({
      definitionId: +playerId,
      position: `${index}`,
      price: 0
    }));

    try {
      await positionPlayers(Promise.resolve({ players }), sbcChallenge);
      dismissSquadMenu();
    } finally {
      hideLoader();
    }
  };

  /**
   * Initialize custom UI elements for SBC enhancement
   * @param {Object} sbcChallenge - The SBC challenge object
   */
  const initializeCustomElements = async function(sbcChallenge) {
    // Create input field for FUTNext ID
    this.custom_sbcIdInput = createTextInput({
      label: "FUTNext Id",
      customClass: "futbin-fill-id",
      isSeparatelabel: false
    });

    // Create auto-fill button
    this.custom_fillSBCBtn = createButton({
      label: "Auto fill",
      onClick: async () => {
        // https://futnext.com?sbcId=3916&players=227310,247679,233084,270409,227421,237673,244302,199503,212622,239837,134481740
        const solutionUrl = this.custom_sbcIdInput?.getValue();
        if (solutionUrl) {
          await applySolution(sbcChallenge, solutionUrl);
        }
      },
      customClass: "call-to-action",
      id: "sbc_auto_fill"
    });

    // Create buy missing players button
    this.custom_buyMissingPlayersBtn = createButton({
      label: translate("buyMissingPlayer"),
      onClick: () => {
        const conceptPlayers = getConceptPlayers(sbcChallenge.squad);
        validateAndAutobuyConceptPlayers(this, conceptPlayers);
      },
      customClass: "call-to-action",
      id: "sbc_buy_missing_players"
    });

    // Create club players solutions dropdown
    this.custom_clubPlayersSolutions = createDropDown({
      label: translate("clubPlayersSolutions"),
      options: [],
      useLabelAsOption: true,
      onChange: (solutionUrl) => {
        applySolution(sbcChallenge, solutionUrl);
      },
      dynamicOptionCallBack: () => nextFetchSolutions(sbcChallenge, false),
      customClass: "sbc-solutions",
      id: "sbc_club_players_solution_list"
    });

    // Create cheap solutions dropdown
    this.custom_cheapSolutions = createDropDown({
      label: translate("cheapSolutions"),
      options: [],
      useLabelAsOption: true,
      onChange: (solutionUrl) => {
        applySolution(sbcChallenge, solutionUrl);
      },
      dynamicOptionCallBack: () => nextFetchSolutions(sbcChallenge, true),
      customClass: "sbc-solutions",
      id: "sbc_cheap_solution_list"
    });

    // Create solutions wrapper
    this.custom_sbcSolutionsWrapper = document.createElement("div");
    this.custom_sbcSolutionsWrapper.classList.add("sbc-solutions-wrapper");
    this.custom_sbcSolutionsWrapper.append(this.custom_clubPlayersSolutions.element);
    this.custom_sbcSolutionsWrapper.append(this.custom_cheapSolutions.element);

    // Create and append fill section
    const fillSection = document.createElement("div");
    fillSection.classList.add("futbin-fill");
    fillSection.append(this.custom_sbcIdInput.element);
    fillSection.append(this.custom_fillSBCBtn.element);
    this.__content.append(this.custom_sbcSolutionsWrapper, fillSection);

    // Create action buttons wrapper
    const actionButtonsWrapper = document.createElement("div");
    actionButtonsWrapper.classList.add("sbc-action-button-wrapper");

    // Check capabilities
    const [canMultiSolveChallenge, canOptimizeChemistryChallenge] = await Promise.all([
      canMultiSolve(sbcChallenge),
      canOptimizeChemistry(sbcChallenge)
    ]);

    // Create generate solution button
    this.custom_generateSlnBtn = createButton({
      label: translate("generateSolution"),
      onClick: () => {
        showGenerateSolutionPopup(this, sbcChallenge, enhancerSettings);
      },
      customClass: "call-to-action btn-standard generate-btn btn-gradient-secondary",
      id: "sbc_generate_solution"
    });
    actionButtonsWrapper.append(this.custom_generateSlnBtn.element);

    // Create multi-solve button if supported
    if (canMultiSolveChallenge) {
      this.custom_solveMultipleBtn = createButton({
        label: translate("solveMultiTimes"),
        onClick: () => {
          showGenerateSolutionPopup(this, sbcChallenge, enhancerSettings, {
            isMultiSolveEnabled: true
          });
        },
        customClass: "call-to-action btn-standard",
        id: "sbc_multi_solve"
      });
      actionButtonsWrapper.append(this.custom_solveMultipleBtn.element);
    }

    // Create optimize chemistry button if supported
    if (canOptimizeChemistryChallenge) {
      this.custom_optimizeChemistryBtn = createButton({
        label: translate("optimizeChemistry"),
        onClick: () => {
          if (sbcChallenge.squad) {
            showChemistryOptimizerPopup(sbcChallenge.squad, false);
          } else {
            sendUINotification(
              getLocalization().localize("popup.error.activesquad.SaveFailed"),
              UINotificationTypeEnum.NEGATIVE
            );
          }
        },
        customClass: "call-to-action btn-standard",
        id: "sbc_optimize_chemistry"
      });
      actionButtonsWrapper.append(this.custom_optimizeChemistryBtn.element);
    }

    // Create fill remaining slots button
    this.custom_fillRemainingBtn = createButton({
      label: translate("fillRemainingSlots"),
      onClick: () => {
        const existingPlayers = sbcChallenge.squad
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

        const requiredPlayersCount = sbcChallenge.squad?.getNumOfRequiredPlayers() ?? -1;

        if (existingPlayers.length !== requiredPlayersCount) {
          showGenerateSolutionPopup(this, sbcChallenge, enhancerSettings, {
            isFillRemainingSlots: true
          });
        } else {
          sendUINotification(
            translate("noEmptySlot"),
            UINotificationTypeEnum.NEGATIVE
          );
        }
      },
      customClass: "call-to-action btn-standard fill-slot-btn",
      id: "sbc_fill_remaining_slots"
    });
    actionButtonsWrapper.append(this.custom_fillRemainingBtn.element);

    // Create view more solutions button
    this.custom_viewMoreOnFutNextBtn = createButton({
      label: translate("copySolutions"),
      onClick: () => {
        const { name, setId, id } = sbcChallenge;
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
      id: "sbc_view_more_on"
    });
    actionButtonsWrapper.append(this.custom_viewMoreOnFutNextBtn.element);
    actionButtonsWrapper.append(this.custom_buyMissingPlayersBtn.element);

    this.__content.append(actionButtonsWrapper);
  };

  /**
   * Handle paste events for solution URLs
   * @param {ClipboardEvent} event - The paste event
   */
  const handlePasteEvent = async function(event) {
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

  // Override the render method
  UTSBCSquadDetailPanelView.prototype.render = function(sbcChallenge, ...args) {
    const { lastOpenedSBC } = InMemoryStore.instance.get("enhancerData");

    // Update last opened SBC data
    lastOpenedSBC.challengeId = sbcChallenge.id;
    lastOpenedSBC.setId = sbcChallenge.setId;

    // Initialize custom elements if not already done
    if (!this.custom_sbcIdInput) {
      initializeCustomElements.call(this, sbcChallenge);
      originalRender.call(this, sbcChallenge, ...args);

      // Add paste event listener
      this.custom_pasteEventHandler = handlePasteEvent.bind(sbcChallenge);
      document.addEventListener("paste", this.custom_pasteEventHandler);
    }

    // Update enhancer data
    enhancerData.autoBuyCheapest = false;
    enhancerData.isInSBCSquadPage = true;
  };

  // Override the destroy method
  UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function(...args) {
    // Call original destroy method
    originalDestroyGeneratedElements.call(this, ...args);

    // Remove paste event listener
    if (this.custom_pasteEventHandler) {
      document.removeEventListener("paste", this.custom_pasteEventHandler);
      this.custom_pasteEventHandler = undefined;
    }

    // Update enhancer data
    enhancerData.isInSBCSquadPage = false;

    // Destroy custom elements
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

    // Clear references
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
