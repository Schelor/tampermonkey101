// Pack Hub Override Module
// This module enhances the pack store interface with additional functionality

"use strict";

// Import dependencies (assuming these are available from the context)
// const { createButton, createDropDown, getLocalization } = require('./ui-components');
// const { translate } = require('./localization');
// const { openUrl, notNullorUndefined } = require('./utils');
// const { config } = require('./config');
// const { InMemoryStore } = require('./store');
// const { quickGoToLastChallenge } = require('./navigation');

/**
 * Filter pack elements based on criteria
 * @param {string} packName - Name of pack to filter by
 * @param {Array} packElements - Array of pack DOM elements
 * @param {string} [tradeabilityClass] - CSS class for tradeability filter
 */
const filterPacks = (packName, packElements, tradeabilityClass) => {
  packElements.forEach(element => {
    let shouldShow = true;

    if (packName) {
      // Filter by pack name
      const elementPackName = element.querySelector('.pack-name')?.textContent || '';
      shouldShow = elementPackName.includes(packName);
    }

    if (tradeabilityClass) {
      // Filter by tradeability
      shouldShow = shouldShow && element.classList.contains(tradeabilityClass);
    }

    element.style.display = shouldShow ? '' : 'none';
  });
};

/**
 * Auto-open packs functionality
 * @param {Array} packs - Array of pack objects to open
 */
const autoOpenPacks = function(packs) {
  // Implementation for automatically opening packs
  // This would trigger the pack opening sequence
  console.log('Auto-opening packs:', packs);
};

/**
 * Clean up custom elements from the view
 * @param {Object} viewInstance - The view instance to clean up
 */
const cleanupCustomElements = (viewInstance) => {
  // Destroy custom buttons
  viewInstance.custom_quickGoToSBC?.destroy();
  viewInstance.custom_viewPackHistory?.destroy();
  viewInstance.custom_viewPackTracker?.destroy();
  viewInstance.custom_openMyPackAutomatically?.destroy();
  viewInstance.custom_filterPacksDropDown?.destroy();

  // Clear references
  viewInstance.custom_quickGoToSBC = undefined;
  viewInstance.custom_viewPackHistory = undefined;
  viewInstance.custom_viewPackTracker = undefined;
  viewInstance.custom_openMyPackAutomatically = undefined;
  viewInstance.custom_filterPacksDropDown = undefined;
};

/**
 * Override the pack hub functionality
 */
exports.packHubOverride = () => {
  // Store original methods
  const originalSetPacks = UTStoreView.prototype.setPacks;
  const originalClearPacks = UTStoreView.prototype.clearPacks;
  const originalDestroyGeneratedElements = UTStoreView.prototype.destroyGeneratedElements;

  // Get enhancer data and settings
  const enhancerData = InMemoryStore.instance.get("enhancerData");
  const enhancerSettings = InMemoryStore.instance.get("enhancerSettings");

  // Override setPacks method
  UTStoreView.prototype.setPacks = function(packs, ...args) {
    enhancerData.fastPackOpen = false;

    // Call original method
    const result = originalSetPacks.call(this, packs, ...args);

    // Only add enhancements for "mypacks" display group
    if (packs.length > 0 && packs[0].displayGroup === "mypacks") {
      // Create actions wrapper
      const actionsWrapper = document.createElement("div");
      actionsWrapper.classList.add("actions-wrapper");

      // Get last opened SBC info
      const { lastOpenedSBC: { challengeId, setId } } = enhancerData;

      // Add Quick Go to SBC button if conditions are met
      if (challengeId !== -1 &&
          setId !== -1 &&
          !services.SBC.repository.getSetById(setId)?.isComplete() &&
          enhancerSettings.enableQuickGoToSBC) {

        const sbcSetName = services.SBC.repository.getSetById(setId)?.name ?? "";

        this.custom_quickGoToSBC = createButton({
          label: translate("quickGoToSBCShort", {
            sbcName: ` ${sbcSetName} `,
            interpolation: { escapeValue: false }
          }),
          onClick: () => {
            quickGoToLastChallenge();
          },
          id: "quick-go-sbc",
          customClass: "my-pack-open"
        });

        actionsWrapper.append(this.custom_quickGoToSBC.element);
      }

      // Add Pack History button (unless hidden)
      if (!enhancerSettings.hidePackHistory) {
        this.custom_viewPackHistory = createButton({
          label: translate("viewPackHistory"),
          onClick: () => {
            openUrl(`${config.nextDomain}/account/pack`, "viewPackHistory");
          },
          id: "view-my-pack-history",
          customClass: "my-pack-open"
        });

        actionsWrapper.append(this.custom_viewPackHistory.element);
      }

      // Add Pack Tracker button (unless hidden)
      if (!enhancerSettings.hidePackTracker) {
        this.custom_viewPackTracker = createButton({
          label: translate("viewPackInTracker"),
          onClick: () => {
            // Create pack count object
            const packCounts = packs.reduce((acc, pack) => {
              acc[pack.id] = (acc[pack.id] ?? 0) + 1;
              return acc;
            }, {});

            openUrl(
              `${config.nextDomain}/pack-tracker?packs=${JSON.stringify(packCounts)}`,
              "viewPackInTracker"
            );
          },
          id: "view-my-pack-history",
          customClass: "my-pack-open"
        });

        actionsWrapper.append(this.custom_viewPackTracker.element);
      }

      // Add Auto Open Packs button
      this.custom_openMyPackAutomatically = createButton({
        label: translate("autoOpenPacks"),
        onClick: () => {
          autoOpenPacks.call(this, packs);
        },
        id: "auto_open_my_packs",
        customClass: "my-pack-open"
      });

      actionsWrapper.append(this.custom_openMyPackAutomatically.element);

      // Add pack filter dropdown if there are multiple packs
      if (packs.length >= 2) {
        const localization = getLocalization();

        // Count packs by name
        const packNameCounts = packs
          .map(({ packName }) => packName)
          .reduce((map, name) => {
            map.set(name, (map.get(name) ?? 0) + 1);
            return map;
          }, new Map());

        const uniquePackNames = Array.from(packNameCounts.keys());
        const tradeableCount = packs.filter(({ tradable }) => tradable).length;
        const untradeableCount = packs.filter(({ tradable }) => !tradable).length;

        const hasTradeablePacks = tradeableCount > 0;
        const hasUntradeablePacks = untradeableCount > 0;

        // Create dropdown options
        const packOptions = uniquePackNames.map(packName => {
          const localizedName = localization.localize(packName);
          return new UTDataProviderEntryDTO(
            packName,
            localizedName,
            `${localizedName} (${packNameCounts.get(packName) ?? 0}x)`
          );
        });

        // Add filter options
        const allPacksLabel = translate("allPacks");
        const tradeablePacksLabel = translate("tradeablePacks");
        const untradeablePacksLabel = translate("untradeablePacks");

        // Validate last pack filter
        if (!enhancerData.lastPackFilter ||
            (!packOptions.some(option => option.value === enhancerData.lastPackFilter) &&
             !(enhancerData.lastPackFilter === tradeablePacksLabel && hasTradeablePacks) &&
             !(enhancerData.lastPackFilter === untradeablePacksLabel && hasUntradeablePacks))) {
          enhancerData.lastPackFilter = "";
        }

        // Add tradeable/untradeable options
        if (hasUntradeablePacks) {
          packOptions.unshift(new UTDataProviderEntryDTO(
            untradeablePacksLabel,
            untradeablePacksLabel,
            `${untradeablePacksLabel} (${untradeableCount}x)`
          ));
        }

        if (hasTradeablePacks) {
          packOptions.unshift(new UTDataProviderEntryDTO(
            tradeablePacksLabel,
            tradeablePacksLabel,
            `${tradeablePacksLabel} (${tradeableCount}x)`
          ));
        }

        // Add "All Packs" option
        packOptions.unshift(new UTDataProviderEntryDTO(
          allPacksLabel,
          allPacksLabel,
          `${allPacksLabel} (${tradeableCount + untradeableCount}x)`
        ));

        // Get pack elements for filtering
        const packElements = this.storePacks
          .map(pack => pack.getRootElement())
          .filter(notNullorUndefined);

        // Create filter dropdown
        this.custom_filterPacksDropDown = createDropDown({
          label: localization.localize("navbar.label.packs"),
          onChange: (selectedValue) => {
            if (selectedValue === allPacksLabel) {
              enhancerData.lastPackFilter = "";
              filterPacks("", packElements);
              return;
            }

            enhancerData.lastPackFilter = selectedValue;

            if (selectedValue === tradeablePacksLabel || selectedValue === untradeablePacksLabel) {
              const tradeabilityClass = selectedValue === tradeablePacksLabel
                ? "is-tradeable"
                : "is-untradeable";
              filterPacks("", packElements, tradeabilityClass);
            } else {
              filterPacks(selectedValue, packElements);
            }
          },
          defaultValue: enhancerData.lastPackFilter,
          options: packOptions,
          useLabelAsOption: true,
          id: "filter-packs-drp",
          customClass: "filter-pack"
        });

        // Add dropdown to item list
        this.__itemList?.prepend(this.custom_filterPacksDropDown.element);

        // Apply initial filter if one is set
        if (enhancerData.lastPackFilter) {
          if (enhancerData.lastPackFilter === tradeablePacksLabel ||
              enhancerData.lastPackFilter === untradeablePacksLabel) {
            const tradeabilityClass = enhancerData.lastPackFilter === tradeablePacksLabel
              ? "is-tradeable"
              : "is-untradeable";
            filterPacks("", packElements, tradeabilityClass);
          } else {
            filterPacks(enhancerData.lastPackFilter, packElements);
          }
        }
      }

      // Add actions wrapper to the item list
      this.__itemList?.prepend(actionsWrapper);
    }

    return result;
  };

  // Override destroyGeneratedElements method
  UTStoreView.prototype.destroyGeneratedElements = function() {
    const result = originalDestroyGeneratedElements.call(this);
    cleanupCustomElements(this);
    return result;
  };

  // Override clearPacks method
  UTStoreView.prototype.clearPacks = function() {
    const result = originalClearPacks.call(this);
    cleanupCustomElements(this);
    return result;
  };
};
