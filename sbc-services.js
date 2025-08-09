// SBC Services Module
// This module provides service functions for Squad Building Challenge operations

"use strict";

// Mark as ES module
Object.defineProperty(exports, "__esModule", { value: true });

// Initialize exports
exports.clearSbcSquad =
exports.refreshSbcSets =
exports.resetChallenge =
exports.loadChallenge =
exports.getChallengesBySetIds =
exports.getPackRewardIds =
exports.getAllSets =
exports.requestChallengesForSet =
exports.submitChallenge =
exports.saveChallenge = void 0;

// Import dependencies
const utils = require('./utils');                    // module 82125
const enums = require('./enums');                   // module 26735
const uiComponents = require('./ui-components');    // module 27988

/**
 * Save an SBC challenge
 * @param {Object} challenge - The SBC challenge to save
 * @returns {Promise} Promise that resolves when challenge is saved
 */
exports.saveChallenge = (challenge) => {
  return uiComponents.observableToPromise(services.SBC.saveChallenge(challenge));
};

/**
 * Submit an SBC challenge
 * @param {Object} challenge - The SBC challenge to submit
 * @param {Object} sbcSet - The SBC set containing the challenge
 * @param {boolean} skipValidation - Whether to skip validation
 * @param {boolean} useChemistry - Whether chemistry is enabled
 * @returns {Promise} Promise that resolves with submission result
 */
exports.submitChallenge = (challenge, sbcSet, skipValidation, useChemistry) => {
  return uiComponents.observableToPromise(
    services.SBC.submitChallenge(challenge, sbcSet, skipValidation, useChemistry)
  );
};

/**
 * Request challenges for a specific SBC set
 * @param {Object} sbcSet - The SBC set to request challenges for
 * @returns {Promise} Promise that resolves with challenges data
 */
exports.requestChallengesForSet = (sbcSet) => {
  return uiComponents.observableToPromise(
    services.SBC.requestChallengesForSet(sbcSet)
  );
};

/**
 * Get all SBC sets
 * @returns {Promise} Promise that resolves with all SBC sets
 */
exports.getAllSets = () => {
  return uiComponents.observableToPromise(services.SBC.requestSets());
};

/**
 * Extract pack reward IDs from challenge or set awards
 * @param {Object} challengeOrSet - Challenge or set object with awards
 * @returns {Array<number>} Array of pack reward IDs
 */
exports.getPackRewardIds = (challengeOrSet) => {
  return challengeOrSet.awards
    .filter(({ isPack, type }) => isPack && type === enums.RewardTypeEnum.PACK)
    .map(({ value }) => value);
};

/**
 * Get challenges for specific set IDs, loading them if necessary
 * @param {Set<number>} setIds - Set of SBC set IDs to get challenges for
 * @returns {Promise<Array>} Promise that resolves with array of sets containing incomplete challenges
 */
exports.getChallengesBySetIds = async (setIds) => {
  // Get all SBC sets
  const { data: setsData } = await exports.getAllSets();

  if (!setsData) {
    return [];
  }

  // Filter sets by the provided IDs and load challenges if needed
  const filteredSets = setsData.sets.filter(({ id }) => setIds.has(id));

  // Load challenges for sets that don't have them loaded
  for (const sbcSet of filteredSets) {
    if (!sbcSet.getChallenges().length) {
      await uiComponents.observableToPromise(
        services.SBC.requestChallengesForSet(sbcSet)
      );
      await utils.wait(2.5); // Wait between requests to avoid rate limiting
    }
  }

  // Return only sets that have incomplete challenges
  return filteredSets.filter(sbcSet =>
    sbcSet.getChallenges()
      .filter(({ status }) => status !== "COMPLETED").length > 0
  );
};

/**
 * Load a specific SBC challenge
 * @param {Object} challenge - The challenge to load
 * @param {boolean} [forceReload=false] - Whether to force reload from server
 * @returns {Promise} Promise that resolves when challenge is loaded
 */
exports.loadChallenge = (challenge, forceReload = false) => {
  if (forceReload) {
    return uiComponents.observableToPromise(
      services.SBC.sbcDAO.loadChallenge(challenge.id, challenge.isInProgress())
    );
  } else {
    return uiComponents.observableToPromise(services.SBC.loadChallenge(challenge));
  }
};

/**
 * Reset an SBC challenge by removing all players and saving
 * @param {Object} challenge - The challenge to reset
 * @returns {Promise} Promise that resolves when challenge is reset and saved
 */
exports.resetChallenge = async (challenge) => {
  // Remove all items from the squad
  challenge.squad?.removeAllItems();

  // Save the challenge
  await exports.saveChallenge(challenge);
};

/**
 * Refresh SBC sets by reloading their data and challenges
 * @param {Array} sbcSets - Array of SBC sets to refresh
 * @returns {Promise} Promise that resolves when all sets are refreshed
 */
exports.refreshSbcSets = async (sbcSets) => {
  // Refresh all sets data first
  await exports.getAllSets();
  await utils.wait(1.5);

  // Refresh challenges for each set
  for (let i = 0; i < sbcSets.length; i += 1) {
    await exports.requestChallengesForSet(sbcSets[i]);

    // Add delay between requests except for the last one
    if (i + 1 !== sbcSets.length) {
      await utils.wait(2.5);
    }
  }
};

/**
 * Clear an SBC squad by removing all items and saving
 * @param {Object} challenge - The challenge whose squad should be cleared
 * @returns {Promise} Promise that resolves when squad is cleared and saved
 */
exports.clearSbcSquad = (challenge) => {
  // Remove all items from the squad
  challenge.squad?.removeAllItems();

  // Save the challenge
  return uiComponents.observableToPromise(services.SBC.saveChallenge(challenge));
};
