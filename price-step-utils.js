// Price Step Utilities Module
// This module provides utilities for calculating price steps and tiers in FIFA Ultimate Team

"use strict";

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Initialize exports
exports.getNextStepValue =
exports.getBeforeStepValue =
exports.getNStepValue =
exports.getNextNStepValue =
exports.getBeforeNStepValue =
exports.roundToNearestStep = void 0;

/**
 * Round a value to the nearest step within given bounds
 * @param {number} value - The value to round
 * @param {number} step - The step increment
 * @param {number} minValue - Minimum allowed value (default: 0)
 * @returns {number} Rounded value within bounds
 */
const roundToStep = (value, step, minValue = 0) => {
  const rounded = Math.round(value / step) * step;
  return Math.max(Math.min(rounded, 14999000), minValue); // Max price: 14,999,000
};

/**
 * Find the appropriate price tier for a given value
 * @param {Function} predicate - Function to test each tier
 * @returns {Object|undefined} The matching price tier
 */
const findPriceTier = (predicate) => {
  return JSUtils.find(UTCurrencyInputControl.PRICE_TIERS, (tier) => predicate(tier.min));
};

/**
 * Calculate price value after moving by specified steps
 * @param {number} currentValue - Current price value
 * @param {number} steps - Number of steps to move (positive or negative)
 * @returns {number} New price value after stepping
 */
const calculateStepValue = (currentValue, steps) => {
  if (steps === 0) return currentValue;

  const direction = steps > 0 ? 1 : -1;
  const currentTier = findPriceTier((tierMin) =>
    direction > 0 ? currentValue >= tierMin : currentValue > tierMin
  );

  if (!currentTier) return currentValue;

  let availableSteps;

  if (direction > 0) {
    // Moving up: calculate steps available in current tier
    const maxValueInTier = currentTier === UTCurrencyInputControl.PRICE_TIERS[0]
      ? 14999000  // Maximum price
      : UTCurrencyInputControl.PRICE_TIERS[
          UTCurrencyInputControl.PRICE_TIERS.indexOf(currentTier) - 1
        ].min - 1;

    availableSteps = Math.floor((maxValueInTier - currentValue) / currentTier.inc) + 1;
  } else {
    // Moving down: calculate steps available in current tier
    availableSteps = Math.floor((currentValue - currentTier.min) / currentTier.inc);
    if (currentValue % currentTier.inc !== 0) {
      availableSteps += 1;
    }
  }

  // If we can complete all steps within current tier
  if (Math.abs(steps) <= availableSteps) {
    return roundToStep(currentValue + steps * currentTier.inc, currentTier.inc, currentTier.min);
  }

  // Need to move across tiers
  const remainingSteps = steps - direction * availableSteps;
  const newValue = currentValue + direction * availableSteps * currentTier.inc;

  // Recursively handle remaining steps in next tier
  return calculateStepValue(newValue, remainingSteps);
};

/**
 * Calculate price value after moving N steps in specified direction
 * @param {number} currentValue - Current price value
 * @param {number} stepCount - Number of steps to move
 * @param {number} direction - Direction: 1 for forward, -1 for backward
 * @returns {number} New price value
 */
const calculateNStepValue = (currentValue, stepCount, direction) => {
  return calculateStepValue(currentValue, stepCount * direction);
};

/**
 * Round a value to the nearest valid price step
 * @param {number} value - Value to round
 * @param {number} minValue - Minimum allowed value (default: 0)
 * @returns {number} Rounded value
 */
exports.roundToNearestStep = (value, minValue = 0) => {
  const tier = findPriceTier((tierMin) => value >= tierMin);
  return tier ? roundToStep(value, tier.inc, minValue) : Math.max(value, minValue);
};

/**
 * Get price value N steps before current value
 * @param {number} currentValue - Current price value (default: 0)
 * @param {number} stepCount - Number of steps to go back (default: 1)
 * @returns {number} New price value
 */
exports.getBeforeNStepValue = (currentValue = 0, stepCount = 1) => {
  return calculateNStepValue(currentValue, stepCount, -1);
};

/**
 * Get price value N steps after current value
 * @param {number} currentValue - Current price value (default: 0)
 * @param {number} stepCount - Number of steps to go forward (default: 1)
 * @returns {number} New price value
 */
exports.getNextNStepValue = (currentValue = 0, stepCount = 1) => {
  return calculateNStepValue(currentValue, stepCount, 1);
};

/**
 * Get price value N steps in specified direction
 * @param {number} currentValue - Current price value (default: 0)
 * @param {number} steps - Number of steps (negative for backward, positive for forward)
 * @returns {number} New price value
 */
exports.getNStepValue = (currentValue = 0, steps = 1) => {
  return steps < 0
    ? exports.getBeforeNStepValue(currentValue, -1 * steps)
    : exports.getNextNStepValue(currentValue, steps);
};

/**
 * Get price value one step before current value
 * @param {number} currentValue - Current price value (default: 0)
 * @returns {number} New price value
 */
exports.getBeforeStepValue = (currentValue = 0) => {
  return calculateStepValue(currentValue, -1);
};

/**
 * Get price value one step after current value
 * @param {number} currentValue - Current price value (default: 0)
 * @returns {number} New price value
 */
exports.getNextStepValue = (currentValue = 0) => {
  return calculateStepValue(currentValue, 1);
};
