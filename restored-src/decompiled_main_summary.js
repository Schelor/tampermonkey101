// FIFA Ultimate Team Enhancer - Decompiled Summary
// Original: enhanceer-demov2/js/main.js (35,810 lines)
// This is a structural summary of the decompiled code

(() => {
  "use strict";

  // ===== WEBPACK MODULE SYSTEM =====
  const webpackModules = {};
  const moduleCache = {};

  // Module loader function
  function requireModule(moduleId) {
    if (moduleCache[moduleId]) {
      return moduleCache[moduleId].exports;
    }

    const module = moduleCache[moduleId] = {
      id: moduleId,
      exports: {}
    };

    webpackModules[moduleId](module, module.exports, requireModule);
    return module.exports;
  }

  // ===== MAIN APPLICATION MODULES =====

  // CSS Modules (Styling)
  const cssModules = {
    82546: "Button and UI Styles",
    92439: "Shepherd Tour Styles",
    66053: "Choices.js Dropdown Styles",
    51444: "Squad Result Styles",
    90686: "Tabulator Table Styles",
    11433: "Player Item Styles",
    39153: "Price Data Styles",
    80501: "Search Results Animation",
    8287: "SBC (Squad Building Challenge) Styles"
  };

  // Core Application Modules
  const coreModules = {

    // ===== MARKET AUTOMATION =====
    autoBuyCheapest: {
      moduleId: 2311,
      description: "Automatically buy the cheapest items from search results",
      mainFunction: function(items, settings, data, timestamp) {
        // Find cheapest item
        const cheapestIndex = items.reduce((cheapest, item, index) => {
          const price = item._auction.buyNowPrice;
          return cheapest === -1 || price < items[cheapest]._auction.buyNowPrice
            ? index : cheapest;
        }, -1);

        if (cheapestIndex === -1) return;

        const cheapestItem = items[cheapestIndex];
        const startTime = new Date();

        // Execute purchase
        return bidItem(cheapestItem, cheapestItem._auction.buyNowPrice).then((result) => {
          if (result.success && data.deepLink.numberOfCardsToBuy !== undefined) {
            data.deepLink.numberOfCardsToBuy -= 1;
            if (data.deepLink.numberOfCardsToBuy <= 0) {
              data.autoBuyCheapest = false;
              settings.searchResultRefreshTime = [0, 0];
              sendUINotification("Required number of cards bought");
            }
          }

          // Analytics tracking
          Analytics.instance.fireEvent(
            result.success ? "autobuy_won" : "autobuy_lost",
            {
              bidTime: (+startTime - +timestamp) % 1000,
              price: cheapestItem._auction.buyNowPrice
            }
          );
        });
      }
    },

    autoBuyBargain: {
      moduleId: 34103,
      description: "Automatically buy bargain items based on price thresholds",
      mainFunction: function(item, timestamp) {
        const data = InMemoryStore.instance.get("enhancerData");
        if (!data.isInSearchPage || !data.autoBuyBargain) return;

        const timeTaken = (+Date.now() - +timestamp) % 1000;

        bidItem(item, item._auction.buyNowPrice).then((result) => {
          Analytics.instance.fireEvent(
            result.success ? "autobuy_bargain_won" : "autobuy_bargain_lost",
            { price: item._auction.buyNowPrice, timeTaken: timeTaken }
          );
        });

        NotificationOrchestrator.instance.notifyUI(
          translate("tryBuyingMs", {
            name: item.getStaticData().name,
            price: item._auction.buyNowPrice,
            time: timeTaken
          })
        );
      }
    },

    // ===== SBC SOLVER =====
    sbcSolver: {
      moduleId: 19219,
      description: "Generate optimal solutions for Squad Building Challenges",
      generateSolution: async function(view, squad, config, callback) {
        const requestId = generateRequestId();

        NotificationOrchestrator.instance.notifyUI(
          translate("optimalSquadFindWithRequestId", { requestId: requestId })
        );
        showLoader();

        try {
          const response = await sendRequest(
            `${config.api.nextRestBase}/sbc-solver/solve`,
            "POST",
            `${Math.floor(Date.now())}_generateSolution_${config.sbcId}`,
            JSON.stringify(config),
            {
              Authorization: `Bearer ${await AuthManager.instance.getAccessToken()}`,
              "Content-Type": "application/json",
              "X-Request-Id": requestId
            }
          );

          const { solutions, failingRequirements } = JSON.parse(response);
          const validSolutions = solutions.filter(solution => solution.length > 0);
          const hasMultipleSolutions = (config.multiSolve?.numberOfSolutions ?? 0) > 1 && validSolutions.length > 1;

          hideLoader();

          if (!failingRequirements.length || hasMultipleSolutions) {
            if (validSolutions.length) {
              if (hasMultipleSolutions) {
                showMultiSolvePopup(view, squad, validSolutions, config.concept.useConcept);
              } else if (callback && !config.concept.useConcept && view instanceof UTSBCSquadDetailPanelView) {
                selectSolutionMimic(view, squad, validSolutions[0]);
              } else {
                selectSolution(squad, validSolutions[0]);
              }
            } else {
              await wait(1);
              sendUINotification(
                translate("unableToGenerateSolution"),
                UINotificationTypeEnum.NEGATIVE
              );
            }
          } else {
            showGenerateSolutionFailedPopup(view, squad, config, failingRequirements, validSolutions, callback);
          }
        } catch (error) {
          if (error === 429) {
            showRateLimitPopup();
          }
          return { solutions: [], failingRequirements: [] };
        }
      }
    },

    // ===== PLAYER MANAGEMENT =====
    playerManager: {
      moduleId: 83781,
      description: "Manage club players and provide analysis",
      getClubPlayersTableData: async function() {
        const { scanClubSettings } = InMemoryStore.instance.get("enhancerData");
        const players = await getAllClubPlayers(true, {
          excludeActiveSquad: true,
          onlyTradables: true
        });

        const playersWithPrices = await CurrentDataSource.instance.fetchItemPrices(players);

        return playersWithPrices
          .filter(player =>
            applyRangeFilter(scanClubSettings.priceRange, player.price) &&
            applyRangeFilter(scanClubSettings.ratingRange, player.rating) &&
            !applyFilter(scanClubSettings.excludeRarities, player.rareflag)
          )
          .map(player => ({
            id: player.id,
            player: player._staticData.name,
            rarity: formatRarity(player.rareflag, player.isSpecial()),
            buyPrice: player.lastSalePrice || "--NA--",
            realTimePrice: player.price ?? 0,
            itemEntity: player,
            rating: player.rating,
            discardValue: player.discardValue
          }))
          .sort((a, b) => b.realTimePrice - a.realTimePrice)
          .slice(0, 150);
      }
    },

    // ===== TRANSFER LIST MANAGEMENT =====
    transferListManager: {
      moduleId: 23421,
      description: "Manage transfer list operations and middleware",
      runMiddlewares: async function() {
        const store = InMemoryStore.instance;
        const settings = store.get("traderSettings");
        const data = store.get("traderData");
        const items = await getTransferListItemsByGroup();

        const middlewares = [
          calculateProfitFromSoldItems,
          refreshUserCredits,
          updateTransferStats,
          clearSoldItemsFromTL,
          relistUnSoldItemsInTL
        ];

        return runMiddlewares({
          data: undefined,
          params: { settings, data, items },
          localizer: getLocalization(),
          filterName: data.cache.filter.currentFilter
        }, middlewares);
      },

      calculateProfit: function(soldItems) {
        const totalProfit = soldItems.reduce((total, item) => {
          const profit = item.sellPrice - (item.buyPrice || 0);
          return total + profit;
        }, 0);

        Analytics.instance.fireEvent("ab_profit", {
          profit: totalProfit,
          totalProfit: totalProfit
        });

        StatsFactory.instance.getProcessor().incrementStat("profit", totalProfit);
        return totalProfit;
      }
    },

    // ===== SEARCH ENHANCEMENTS =====
    searchEnhancer: {
      moduleId: 97655,
      description: "Enhanced search functionality with filters and automation",
      searchControllerOverride: function() {
        const originalInit = UTMarketSearchFiltersViewController.prototype.init;
        const originalSearchSelected = UTMarketSearchFiltersViewController.prototype._eSearchSelected;
        const originalViewDidAppear = UTMarketSearchFiltersViewController.prototype.viewDidAppear;

        const settings = InMemoryStore.instance.get("enhancerSettings");
        const data = InMemoryStore.instance.get("enhancerData");

        // Override init method
        UTMarketSearchFiltersViewController.prototype.init = function(config) {
          originalInit.call(this);
          appendElementsWrapper(this);
          appendRating(this, data);

          if (!config) {
            appendFilters(this);
            appendPageJumper(this, data, settings);

            const enablePageJumper = settings.enablePageJumper;
            appendAutoBuyCheapest(this, data, settings);
            appendAutoBuyBargain(this, data);
            appendFodderBuyButton(this, enablePageJumper);

            data.isInSearchPage = true;

            const searchContainer = this.getView().__searchContainer;
            const buttonContainer = find(".button-container", searchContainer);
            buttonContainer?.classList.add("flex-button-wrap");

            if (enablePageJumper) {
              append59thMinButton(this, data);
            }
          }
        };
      }
    },

    // ===== PRICE TRACKING =====
    priceTracker: {
      moduleId: 62144,
      description: "Track and display price data for items",
      appendPriceData: async function(itemView) {
        if (!itemView.data) return;

        const [priceData, externalData] = await Promise.all([
          fetchItemPrices([itemView.data]),
          fetchExternalPriceData(itemView.data)
        ]);

        if (priceData && priceData.length > 0) {
          const price = priceData[0];
          const externalPrice = externalData?.price || 0;

          // Create price display elements
          const priceWrapper = document.createElement("div");
          priceWrapper.className = "price-data-wrapper";

          const currentPrice = document.createElement("span");
          currentPrice.textContent = `Current: ${price.currentBid || price.startingBid}`;
          currentPrice.className = "current-price";

          const buyNowPrice = document.createElement("span");
          buyNowPrice.textContent = `BIN: ${price.buyNowPrice}`;
          buyNowPrice.className = "bin-price";

          if (externalPrice > 0) {
            const externalPriceElement = document.createElement("span");
            externalPriceElement.textContent = `Market: ${externalPrice}`;
            externalPriceElement.className = "external-price";
            priceWrapper.appendChild(externalPriceElement);
          }

          priceWrapper.appendChild(currentPrice);
          priceWrapper.appendChild(buyNowPrice);

          itemView.element.appendChild(priceWrapper);
        }
      }
    }
  };

  // ===== UTILITY FUNCTIONS =====
  const utilities = {

    // Localization
    getLocalization: function() {
      return services.Localization;
    },

    translate: function(key, params = {}) {
      const localization = getLocalization();
      let text = localization.localize(key);

      // Replace parameters
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
      });

      return text;
    },

    // UI Notifications
    sendUINotification: function(message, type = "NEUTRAL") {
      const notification = {
        message: message,
        messageType: UINotificationTypeEnum[type],
        notificationType: ExternalNotificationType.LISTED
      };

      NotificationOrchestrator.instance.notifyUI(notification);
    },

    // Async utilities
    wait: function(seconds) {
      return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    },

    observableToPromise: function(observable) {
      return new Promise((resolve, reject) => {
        observable.observe(null, (sender, data) => {
          sender.unobserve(null);
          if (data.success !== false) {
            resolve(data);
          } else {
            reject(data);
          }
        });
      });
    },

    // Random number generation
    getRandomNumberInRange: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    // DOM utilities
    find: function(selector, parent = document) {
      return parent.querySelector(selector);
    },

    findAll: function(selector, parent = document) {
      return Array.from(parent.querySelectorAll(selector));
    },

    append: function(parent, child) {
      parent.appendChild(child);
    },

    hide: function(element) {
      if (element) {
        element.style.display = "none";
      }
    },

    show: function(element) {
      if (element) {
        element.style.display = "";
      }
    }
  };

  // ===== INITIALIZATION =====

  // Store references to original EA functions for overriding
  const originalFunctions = {
    UTMarketSearchFiltersViewController: {
      init: UTMarketSearchFiltersViewController.prototype.init,
      dealloc: UTMarketSearchFiltersViewController.prototype.dealloc,
      _eSearchSelected: UTMarketSearchFiltersViewController.prototype._eSearchSelected,
      viewDidAppear: UTMarketSearchFiltersViewController.prototype.viewDidAppear
    },
    UTMarketSearchResultsViewController: {
      _requestItems: UTMarketSearchResultsViewController.prototype._requestItems,
      initWithSearchCriteria: UTMarketSearchResultsViewController.prototype.initWithSearchCriteria
    },
    services: {
      Club: {
        search: services.Club.search
      },
      Item: {
        move: services.Item.move,
        discard: services.Item.discard
      }
    }
  };

  // Apply all overrides and enhancements
  function initializeEnhancer() {
    // Initialize CSS
    Object.keys(cssModules).forEach(moduleId => {
      requireModule(parseInt(moduleId));
    });

    // Initialize core modules
    Object.values(coreModules).forEach(module => {
      if (module.init) {
        module.init();
      }
    });

    // Apply function overrides
    coreModules.searchEnhancer.searchControllerOverride();

    console.log("FIFA Ultimate Team Enhancer initialized successfully");
  }

  // Start the application
  initializeEnhancer();

})();

// ===== WEBPACK RUNTIME =====
// The original file contains Webpack's module loading system
// which handles chunk loading, module caching, and dependency resolution
