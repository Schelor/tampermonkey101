// Multi-Solve Capability Check Module
// This module provides utilities to check if an SBC can be solved multiple times

"use strict";

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Initialize exports
exports.canMultiSolve = void 0;

// Import dependencies
const sbcLookupUtils = require('./sbc-lookup-utils'); // module 19749

/**
 * Check if an SBC challenge can be solved multiple times
 * @param {Object} sbcChallenge - The SBC challenge object to check
 * @param {number} sbcChallenge.id - Challenge ID
 * @param {number} sbcChallenge.setId - Set ID that contains this challenge
 * @param {boolean} sbcChallenge.repeatable - Whether the challenge is marked as repeatable
 * @returns {Promise<boolean>} True if the challenge can be multi-solved, false otherwise
 */
exports.canMultiSolve = async (sbcChallenge) => {
  const { id: challengeId, setId, repeatable } = sbcChallenge;

  // Get the SBC set from the repository
  const sbcSet = services.SBC.repository.sets._collection[setId];

  // If set doesn't exist, cannot multi-solve
  if (!sbcSet) {
    return false;
  }

  // If challenge is not repeatable or set has multiple challenges, cannot multi-solve
  if (!repeatable || sbcSet.challengesCount > 1) {
    return false;
  }

  // Check repeatability limits
  if (sbcSet.repeatabilityMode !== "UNLIMITED" &&
      sbcSet.repeats - sbcSet.timesCompleted <= 0) {
    return false;
  }

  // Fetch SBC lookup data to check if this specific challenge supports multi-solve
  const { multiSolvableSbcs } = await sbcLookupUtils.fetchSbcLookupData();

  // Return whether this challenge ID is in the multi-solvable set
  return multiSolvableSbcs.has(challengeId) ?? false;
};
