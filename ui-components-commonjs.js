// UI Components Module (CommonJS version)
// This module serves as the main entry point for UI-related utilities and components

"use strict";

// Helper function for creating bindings (equivalent to __createBinding)
const createBinding = (Object.create
  ? function(target, source, key, alias) {
      if (alias === undefined) alias = key;
      const descriptor = Object.getOwnPropertyDescriptor(source, key);

      if (!descriptor ||
          ("get" in descriptor
            ? !source.__esModule
            : descriptor.writable || descriptor.configurable)) {
        descriptor = {
          enumerable: true,
          get: function() {
            return source[key];
          }
        };
      }

      Object.defineProperty(target, alias, descriptor);
    }
  : function(target, source, key, alias) {
      if (alias === undefined) alias = key;
      target[alias] = source[key];
    });

// Helper function for re-exporting all exports (equivalent to __exportStar)
const exportStar = function(source, target) {
  for (const key in source) {
    if (key === "default" || Object.prototype.hasOwnProperty.call(target, key)) {
      continue;
    }
    createBinding(target, source, key);
  }
};

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Initialize exports
exports.getDecimalSquadRating =
exports.getLocalization =
exports.generateListDurationOptions =
exports.getCardName =
exports.observableToPromise = void 0;

// Import base UI enums (module 26735)
require('./enums/ui-types');

// Import and re-export observableToPromise (module 83195)
const observableUtils = require('./utils/observable');
Object.defineProperty(exports, "observableToPromise", {
  enumerable: true,
  get: function() {
    return observableUtils.observableToPromise;
  }
});

// Import and re-export getCardName (module 68082)
const cardUtils = require('./utils/card-utils');
Object.defineProperty(exports, "getCardName", {
  enumerable: true,
  get: function() {
    return cardUtils.getCardName;
  }
});

// Import and re-export generateListDurationOptions (module 40397)
const durationOptions = require('./utils/duration-options');
Object.defineProperty(exports, "generateListDurationOptions", {
  enumerable: true,
  get: function() {
    return durationOptions.generateListDurationOptions;
  }
});

// Import and re-export getLocalization (module 86233)
const localizationUtils = require('./utils/localization');
Object.defineProperty(exports, "getLocalization", {
  enumerable: true,
  get: function() {
    return localizationUtils.getLocalization;
  }
});

// Import and re-export getDecimalSquadRating (module 79497)
const squadRating = require('./utils/squad-rating');
Object.defineProperty(exports, "getDecimalSquadRating", {
  enumerable: true,
  get: function() {
    return squadRating.getDecimalSquadRating;
  }
});

// Re-export all from various UI component modules
exportStar(require('./components/buttons'), exports);      // module 15744
exportStar(require('./components/inputs'), exports);       // module 11458
exportStar(require('./components/dropdowns'), exports);    // module 49639
exportStar(require('./components/notifications'), exports); // module 53314
