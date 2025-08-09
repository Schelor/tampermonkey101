// Multiple SBC Result Popup Module
// This module provides functionality to display results for multiple SBC solutions

"use strict";

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Initialize exports
exports.showGenerateMultipleSBCResultPopup = void 0;

// Import dependencies
const notifications = require('./notifications');           // module 13808
const uiEnums = require('./enums/ui-types');              // module 26735
const uiComponents = require('./ui-components');          // module 27988
const utils = require('./utils');                         // module 82125
const localization = require('./localization');           // module 44669
const solutionSelector = require('./solution-selector');  // module 46418
const solutionsTable = require('./solutions-table');      // module 97410
const failedRequirements = require('./failed-requirements'); // module 79386
const dailyChallenges = require('./daily-challenges');    // module 42409
const rewardsPack = require('./rewards-pack');            // module 38674

/**
 * Create the content for multiple SBC results popup
 * @param {Object} viewContext - The view context object
 * @param {Array} sbcSets - Array of SBC sets
 * @param {Array} challenges - Array of SBC challenges
 * @param {Object} resultData - Object containing solutions array
 * @returns {Promise<HTMLElement>} The popup content element
 */
const createMultipleSBCResultContent = async (viewContext, sbcSets, challenges, { solutions }) => {
  // Create main container
  const container = document.createElement("div");
  container.classList.add("pop-up-table");

  // Generate error messages for failed solutions
  const errorMessages = solutions.map(({ failingRequirements, solution }, index) => {
    // If solution has valid players, no error message needed
    if (solution.filter(utils.notNullorUndefined).length) {
      return "";
    }

    // Create error message for failed requirements or generic failure
    return failedRequirements.createFailedRequirementsMessage(challenges[index], failingRequirements) ||
           localization.translate("unableToGenerateSolution");
  });

  // Create solutions table
  viewContext.custom_solutionPlayersTable = await solutionsTable.createSolutionsTable(
    solutions.map(({ solution }) => solution.filter(utils.notNullorUndefined)),
    false, // isCompact
    challenges.map(({ name }) => name), // challenge names
    errorMessages
  );

  viewContext.custom_solutionPlayersTable.element.classList.add("sbc-set-solutions");

  // Create "Fill Solutions" button
  viewContext.custom_fillSolutionsBtn = uiComponents.createButton({
    label: localization.translate("fillSolutions"),
    onClick: async () => {
      notifications.showLoader();

      // Fill each solution sequentially
      for (let i = 0; i < challenges.length; i += 1) {
        const { solution } = solutions[i];
        const challenge = challenges[i];

        // Load challenge and apply solution if available
        await notifications.loadChallenge(challenge);
        await utils.wait(0.5);

        if (solution?.length) {
          solutionSelector.selectSolution(challenge, solution);
          await utils.wait(1.5);
        }
      }

      // Refresh and close popup
      await notifications.refreshSbcSets(sbcSets);
      gPopupClickShield.closeActivePopup();
      notifications.hideLoader();
    },
    id: "sbc_set_fill_solutions"
  });

  // Create "Submit Solutions" button
  viewContext.custom_submitSolutionsBtn = uiComponents.createButton({
    label: localization.translate("submitSolutions"),
    onClick: async () => {
      notifications.showLoader();

      let allSuccessful = true;
      const rewardPackIds = [];

      // Submit each solution sequentially
      for (let i = 0; i < challenges.length; i += 1) {
        const { solution } = solutions[i];
        const challenge = challenges[i];
        const sbcSet = sbcSets.find(({ id }) => id === challenge.setId) ??
                      services.SBC.repository.getSetById(challenge.setId);

        // Load challenge
        await notifications.loadChallenge(challenge);
        await utils.wait(0.5);

        if (solution?.length && sbcSet) {
          // Apply solution
          await solutionSelector.selectSolution(challenge, solution);
          await utils.wait(1.5);

          // Submit challenge
          const { success, data } = await notifications.submitChallenge(
            challenge,
            sbcSet,
            true, // skipValidation
            services.Chemistry.isFeatureEnabled()
          );

          if (!success) {
            // Show failure notification and stop
            notifications.sendUINotification(
              uiComponents.getLocalization().localize("notification.sbcChallenges.failedToSubmit"),
              uiEnums.UINotificationTypeEnum.NEGATIVE
            );
            allSuccessful = false;
            break;
          }

          // Collect reward pack IDs
          rewardPackIds.push(...notifications.getPackRewardIds(challenge));

          if (data?.setCompleted) {
            rewardPackIds.push(...notifications.getPackRewardIds(sbcSet));
          }

          // Show success notification
          notifications.sendUINotification(
            localization.translate("solutionSubmitted", {
              challengeName: challenge.name
            })
          );

          await utils.wait(2);
        }
      }

      // Final cleanup and navigation
      await notifications.refreshSbcSets(sbcSets);
      gPopupClickShield.closeActivePopup();
      uiComponents.getNavigationController().popViewController();
      await rewardsPack.autoOpenRewardsPack(rewardPackIds);
      notifications.hideLoader();

      // Show daily challenges popup if all successful and in SBC hub
      if (allSuccessful && viewContext instanceof UTSBCHubView) {
        dailyChallenges.showSolveDailyChallengesAgainPopup(viewContext);
      }
    },
    id: "sbc_set_submit_solutions"
  });

  // Assemble the container
  container.append(viewContext.custom_solutionPlayersTable.element);
  container.append(viewContext.custom_fillSolutionsBtn.element);
  container.append(viewContext.custom_submitSolutionsBtn.element);

  return container;
};

/**
 * Clean up custom elements from view context
 * @param {Object} viewContext - The view context object
 */
const cleanupCustomElements = (viewContext) => {
  viewContext.custom_solutionPlayersTable?.destroy();
  viewContext.custom_fillSolutionsBtn?.destroy();
  viewContext.custom_submitSolutionsBtn?.destroy();

  viewContext.custom_solutionPlayersTable = void 0;
  viewContext.custom_fillSolutionsBtn = void 0;
  viewContext.custom_submitSolutionsBtn = void 0;
};

/**
 * Show popup with multiple SBC solution results
 * @param {Object} viewContext - The view context object
 * @param {Array} sbcSets - Array of SBC sets
 * @param {Object} resultData - Object containing solutions
 * @param {Array} challenges - Array of SBC challenges
 */
exports.showGenerateMultipleSBCResultPopup = async (viewContext, sbcSets, resultData, challenges) => {
  uiComponents.showPopUp({
    title: localization.translate("setSolutionResults"),
    message: await createMultipleSBCResultContent(viewContext, sbcSets, challenges, resultData),
    id: "generate_multi_sbc_results",
    onSelect: () => {
      cleanupCustomElements(viewContext);
    },
    options: [{
      labelEnum: enums.UIDialogOptions.CANCEL
    }]
  });
};
