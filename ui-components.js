// UI Components Module
// This module serves as the main entry point for UI-related utilities and components

"use strict";

// Import and re-export observableToPromise utility
import { observableToPromise } from './utils/observable';
export { observableToPromise };

// Import and re-export card name utility
import { getCardName } from './utils/card-utils';
export { getCardName };

// Import and re-export list duration options generator
import { generateListDurationOptions } from './utils/duration-options';
export { generateListDurationOptions };

// Import and re-export localization utility
import { getLocalization } from './utils/localization';
export { getLocalization };

// Import and re-export squad rating calculator
import { getDecimalSquadRating } from './utils/squad-rating';
export { getDecimalSquadRating };

// Re-export all components from various UI modules
export * from './components/buttons';
export * from './components/inputs';
export * from './components/dropdowns';
export * from './components/notifications';

// Import base UI enums and types (module 26735 - likely contains UI enums)
import './enums/ui-types';

/**
 * Utility function to convert Observable to Promise
 * @param {Observable} observable - The observable to convert
 * @returns {Promise} Promise that resolves with the observable value
 */
export { observableToPromise };

/**
 * Get the display name for a card
 * @param {Object} card - The card object
 * @returns {string} The formatted card name
 */
export { getCardName };

/**
 * Generate duration options for listing items
 * @param {Object} options - Configuration options
 * @returns {Array} Array of duration options
 */
export { generateListDurationOptions };

/**
 * Get the localization service instance
 * @returns {Object} Localization service
 */
export { getLocalization };

/**
 * Calculate decimal squad rating
 * @param {Object} squad - The squad object
 * @returns {number} Decimal squad rating
 */
export { getDecimalSquadRating };
