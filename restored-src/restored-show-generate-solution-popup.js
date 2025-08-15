// 还原后的显示生成解决方案弹窗模块代码
import {
  createDropDownMulti,
  convertToNumberArray,
  valuesToSet,
  wait
} from './utils'; // 对应 n(82125)
import {
  getFieldPlayers,
  getMatchingPlayers,
  formOptionsFromDefId,
  getLeagues,
  getNations,
  getClubs,
  getAllRarities,
  sendUINotification,
  showLoader,
  hideLoader,
  getPlayersForSbc
} from './sbc-module'; // 对应 n(13808)
import { UINotificationTypeEnum } from './enums'; // 对应 n(26735)
import {
  createRangeInput,
  createNumericInput,
  createToggleInput,
  createDropDown,
  showPopUp,
  getLocalization
} from './ui-utils'; // 对应 n(27988)
import { AuthManager } from './auth-manager'; // 对应 n(58250)
import { translate } from './translation-utils'; // 对应 n(44669)
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)
import { createLabelContainer } from './label-utils'; // 对应 n(66175)
import { generateSolution } from './solution-generator'; // 对应 n(54016)
import { getMultiSolveData } from './multi-solve-utils'; // 对应 n(88243)
import { destroyPopupElements } from './popup-utils'; // 对应 n(97447)
import { toggleConcept, untoggleConcept } from './concept-utils'; // 对应 n(87327)
import { fetchSbcLookupData } from './sbc-lookup'; // 对应 n(19749)
import { generateFilterToggle } from './filter-toggle'; // 对应 n(41182)
import { generateCommonToggles } from './common-toggles'; // 对应 n(61026)
import { generateIncludePlayersToggle } from './include-players-toggle'; // 对应 n(11228)
import { dismissSquadMenu } from './squad-menu'; // 对应 n(27358)
import { parsePlayerRarityGroup } from './rarity-parser'; // 对应 n(20575)
import { ConceptCheapest, ConceptClubPlayers } from './concept-constants'; // 对应 n(97897)
import { clearPreviousSBCEnhancerData } from './sbc-data-cleaner'; // 对应 n(57551)

/**
 * 显示生成解决方案弹窗
 * @param {Object} popupElements - 弹窗元素对象
 * @param {Object} challenge - 挑战对象
 * @param {Object} sbcSettings - SBC设置
 * @param {Object} options - 选项参数
 * @returns {Promise<void>}
 */
export const showGenerateSolutionPopup = async (popupElements, challenge, sbcSettings, options) => {
  // 检查用户权限
  if (!AuthManager.instance.hasEnhancerAccess(true)) {
    return;
  }

  // 清除之前的SBC增强器数据
  clearPreviousSBCEnhancerData();

  // 获取场上球员信息
  const fieldPlayers = getFieldPlayers(challenge.squad).map((player) => ({
    id: player.definitionId,
    isConcept: player.concept,
  }));

  // 创建弹窗内容
  const popupContent = await createPopupContent(popupElements, fieldPlayers, challenge, options);

  // 显示弹窗
  showPopUp({
    title: translate("generateSolution"),
    message: popupContent,
    onSelect: async (selectedOption) => {
      if (selectedOption === 2) { // 确认选择
        await handleGenerateSolution(popupElements, challenge, sbcSettings);
      }
      // 清理弹窗元素
      destroyPopupElements(popupElements);
    },
    id: "popup_generate_duplicate_players",
  });
};

/**
 * 创建弹窗内容
 * @param {Object} popupElements - 弹窗元素对象
 * @param {Array} fieldPlayers - 场上球员数组
 * @param {Object} challenge - 挑战对象
 * @param {Object} options - 选项参数
 * @returns {Promise<HTMLElement>} 弹窗内容元素
 */
async function createPopupContent(popupElements, fieldPlayers, challenge, options) {
  // 获取多解模式数据
  const { isMultiSolvable, solutionsAllowed } = await getMultiSolveData(challenge);

  const enhancerSettings = InMemoryStore.instance.get("enhancerSettings");
  const enhancerData = InMemoryStore.instance.get("enhancerData");
  const playerIds = fieldPlayers.map(({ id }) => id);

  const container = document.createElement("div");
  container.classList.add("pop-up-table");

  // 设置评分范围
  if (!enhancerSettings.preserveRatingRange) {
    enhancerData.lastUsedSBCRatingRange = [10, 99];
  }

  // 创建评分范围输入
  popupElements.custom_ratingFilter = createRangeInput({
    label: translate("ratingRange"),
    options: { min: 10, max: 99 },
    onChange: (range) => {
      if (enhancerSettings.preserveRatingRange) {
        enhancerData.lastUsedSBCRatingRange = range;
      }
    },
    defaultValue: enhancerData.lastUsedSBCRatingRange,
    id: "generate_solution_rating_range",
  });
  container.append(popupElements.custom_ratingFilter.element);

  // 创建球员价格限制输入
  popupElements.custom_maxPricePerPlayer = createNumericInput({
    label: translate("playerPriceLimit"),
    id: "generate_solution_max_price_per_player",
    customClass: "player-max-price",
  });
  container.append(popupElements.custom_maxPricePerPlayer.element);

  // 创建包含球员下拉框
  popupElements.custom_playersIncluded = createDropDownMulti({
    onSearch: (searchTerm) => {
      popupElements.custom_playersIncluded?.setDynamicOptions(
        getMatchingPlayers(searchTerm)
      );
    },
    options: playerIds.map(formOptionsFromDefId),
    label: translate("includePlayersSBC"),
    defaultValue: [],
    id: "generate_solution_included_players",
  });
  container.append(popupElements.custom_playersIncluded.element);

  // 添加包含球员切换开关（如果不是多解模式或填充剩余位置）
  if (!isMultiSolvable || options?.isFillRemainingSlots) {
    const includePlayersToggle = generateIncludePlayersToggle(
      popupElements,
      fieldPlayers,
      options?.isFillRemainingSlots ?? false
    );
    if (includePlayersToggle) {
      container.append(includePlayersToggle);
    }
  }

  // 创建忽略球员下拉框
  popupElements.custom_playersIgnored = createDropDownMulti({
    onSearch: (searchTerm) => {
      popupElements.custom_playersIgnored?.setDynamicOptions(
        getMatchingPlayers(searchTerm)
      );
    },
    options: [...enhancerSettings.ignoredSbcPlayers].map(formOptionsFromDefId),
    label: translate("removePlayers"),
    defaultValue: [...enhancerSettings.ignoredSbcPlayers].map((id) => id),
    id: "generate_solution_ignored_players",
  });
  container.append(popupElements.custom_playersIgnored.element);

  // 添加联赛过滤器
  const leagueFilter = generateFilterToggle(
    popupElements,
    "league",
    enhancerSettings.ignoredSbcLeagues,
    getLeagues()
  );
  container.append(leagueFilter);

  // 添加国籍过滤器
  const nationFilter = generateFilterToggle(
    popupElements,
    "nation",
    enhancerSettings.ignoredSbcNations,
    getNations()
  );
  container.append(nationFilter);

  // 添加俱乐部过滤器
  const clubFilter = generateFilterToggle(
    popupElements,
    "club",
    enhancerSettings.ignoredSbcClubs,
    getClubs()
  );
  container.append(clubFilter);

  // 添加稀有度过滤器
  const rarities = getAllRarities();
  const rarityFilter = generateFilterToggle(
    popupElements,
    "rarity",
    enhancerSettings.ignoredSbcRarities,
    rarities
  );
  container.append(rarityFilter);

  // 创建包含稀有度下拉框
  popupElements.custom_rarityFiltersToInclude = createDropDownMulti({
    options: rarities,
    label: translate("rarityToInclude"),
    defaultValue: [...enhancerData.generateSolutionSettings.onlyRaritiesToInclude].map((id) => `${id}`),
    onChange: (values) => {
      valuesToSet(enhancerData.generateSolutionSettings.onlyRaritiesToInclude, values);
    },
    id: "generate_solution_rarities_to_include",
  });
  container.append(popupElements.custom_rarityFiltersToInclude.element);

  // 添加通用切换开关
  container.append(generateCommonToggles(popupElements, enhancerSettings));

  // 添加更多设置（非多解模式）
  if (!isMultiSolvable) {
    container.append(createMoreSettingsSection(popupElements));
  }

  // 添加概念设置（非多解模式且非填充剩余位置）
  if (!isMultiSolvable && !options?.isFillRemainingSlots) {
    container.append(createConceptSettingsSection(popupElements));
  }

  // 添加多解设置（多解模式且非填充剩余位置）
  if (isMultiSolvable && !options?.isFillRemainingSlots) {
    container.append(createMultiSolveSettingsSection(
      popupElements,
      solutionsAllowed,
      options?.isMultiSolveEnabled ?? false,
      parsePlayerRarityGroup(challenge.eligibilityRequirements)
    ));
  }

  return container;
}

/**
 * 创建更多设置部分
 * @param {Object} popupElements - 弹窗元素对象
 * @returns {HTMLElement} 更多设置容器
 */
function createMoreSettingsSection(popupElements) {
  const localization = getLocalization();
  const container = document.createElement("div");
  container.classList.add("section-wrapper");

  const header = document.createElement("span");
  header.classList.add("section-wrapper-header");
  header.append(createLabelContainer(localization.localize("label.button.moreSettings")));
  container.append(header);

  // 模拟人类行为切换开关
  popupElements.custom_mimicHumanBehaviorToggle = createToggleInput({
    label: translate("mimicHuman"),
    defaultValue: false,
    onChange: (enabled) => {
      if (enabled) {
        untoggleConcept(popupElements);
      }
    },
    id: "generate_solution_mimic_human_behavior",
    customClass: "section-wrapper-elements",
  });
  container.append(popupElements.custom_mimicHumanBehaviorToggle.element);

  // 使用旧求解器切换开关
  popupElements.custom_useOldSolverToggle = createToggleInput({
    label: translate("useOldSolver"),
    defaultValue: false,
    onChange: (enabled) => {
      if (enabled) {
        sendUINotification(translate("incompatibleSolverWarning"));
      }
    },
    id: "generate_solution_old_solver",
    customClass: "section-wrapper-elements",
  });
  container.append(popupElements.custom_useOldSolverToggle.element);

  return container;
}

/**
 * 创建概念设置部分
 * @param {Object} popupElements - 弹窗元素对象
 * @returns {HTMLElement} 概念设置容器
 */
function createConceptSettingsSection(popupElements) {
  const container = document.createElement("div");
  container.classList.add("section-wrapper");

  const header = document.createElement("span");
  header.classList.add("section-wrapper-header");
  header.append(createLabelContainer(translate("conceptSettings")));
  container.append(header);

  // 使用概念球员切换开关
  popupElements.custom_useConceptToggle = createToggleInput({
    label: translate("useConceptPlayers"),
    onChange: (enabled) => {
      if (enabled) {
        toggleConcept(popupElements);
      } else {
        untoggleConcept(popupElements);
      }
    },
    defaultValue: false,
    id: "generate_solution_use_concept",
    customClass: "section-wrapper-elements",
  });
  container.append(popupElements.custom_useConceptToggle.element);

  // 概念优先级下拉框
  popupElements.custom_conceptPrioritization = createDropDown({
    label: "",
    onChange: () => {
      toggleConcept(popupElements);
    },
    defaultValue: ConceptCheapest,
    id: "generate_solution_concept_prioritization",
    customClass: "section-wrapper-elements",
    options: [
      new UTDataProviderEntryDTO(
        ConceptCheapest,
        ConceptCheapest,
        translate("conceptFindCheapest")
      ),
      new UTDataProviderEntryDTO(
        ConceptClubPlayers,
        ConceptClubPlayers,
        translate("conceptPrioritizeClubPlayers")
      ),
    ],
  });
  container.append(popupElements.custom_conceptPrioritization.element);

  return container;
}

/**
 * 创建多解设置部分
 * @param {Object} popupElements - 弹窗元素对象
 * @param {number} solutionsAllowed - 允许的解决方案数量
 * @param {boolean} isMultiSolveEnabled - 是否启用多解
 * @param {Object} rarityGroup - 稀有度组信息
 * @returns {HTMLElement} 多解设置容器
 */
function createMultiSolveSettingsSection(popupElements, solutionsAllowed, isMultiSolveEnabled, rarityGroup) {
  const container = document.createElement("div");
  container.classList.add("section-wrapper");

  const header = document.createElement("span");
  header.classList.add("section-wrapper-header");
  header.append(createLabelContainer(translate("multiSolveSettings")));
  container.append(header);

  // 多次求解切换开关
  popupElements.custom_multiSolveToggle = createToggleInput({
    label: translate("solveMultiTimes"),
    defaultValue: isMultiSolveEnabled,
    id: "generate_solution_multi_solve",
    customClass: "section-wrapper-elements",
  });
  container.append(popupElements.custom_multiSolveToggle.element);

  if (isMultiSolveEnabled) {
    popupElements.custom_multiSolveToggle.setInteractionState(false);
  }

  // 解决方案数量输入
  popupElements.custom_multiSolveNoOfSolutions = createNumericInput({
    label: translate("noOfSolutions"),
    isNumberInput: true,
    defaultValue: solutionsAllowed,
    id: "generate_solution_multi_solve_no_of_solutions",
    customClass: "section-wrapper-elements",
  });
  container.append(popupElements.custom_multiSolveNoOfSolutions.element);

  // 精确组数量切换开关（如果有稀有度组）
  if (rarityGroup) {
    popupElements.custom_multiSolveExactGroupCount = createToggleInput({
      label: translate("useExactGroupCount", {
        count: rarityGroup.count,
        group: rarityGroup.label,
      }),
      defaultValue: isMultiSolveEnabled,
      id: "generate_solution_multi_solve_eaxct_group",
      customClass: "section-wrapper-elements",
    });
    container.append(popupElements.custom_multiSolveExactGroupCount.element);
  }

  return container;
}

/**
 * 处理生成解决方案
 * @param {Object} popupElements - 弹窗元素对象
 * @param {Object} challenge - 挑战对象
 * @param {Object} sbcSettings - SBC设置
 * @returns {Promise<void>}
 */
async function handleGenerateSolution(popupElements, challenge, sbcSettings) {
  showLoader();

  try {
    // 并行获取球员数据和查找数据
    const [{ players, excludedIds }, { multiSolveLimit }] = await Promise.all([
      getPlayersForSbc(sbcSettings.excludeActiveSquad, sbcSettings.ignoreEvolutionPlayers),
      fetchSbcLookupData(),
    ]);

    // 获取过滤器设置
    const leagueFiltersIgnore = popupElements.custom_leagueFiltersIgnoreToggle?.getValue();
    const nationFiltersIgnore = popupElements.custom_nationFiltersIgnoreToggle?.getValue();
    const clubFiltersIgnore = popupElements.custom_clubFiltersIgnoreToggle?.getValue();
    const rarityFiltersIgnore = popupElements.custom_rarityFiltersIgnoreToggle?.getValue();

    const ignoredPlayers = convertToNumberArray(popupElements.custom_playersIgnored?.getValue());
    const includedPlayers = convertToNumberArray(popupElements.custom_playersIncluded?.getValue());

    // 检查包含球员数量限制
    const maxIncludePlayers = 11 - (challenge.squad?.getAllBrickIndices()?.length ?? 0);
    if (includedPlayers.length >= maxIncludePlayers) {
      sendUINotification(
        translate("cannotIncludePlayersCount", { count: maxIncludePlayers - 1 }),
        UINotificationTypeEnum.NEGATIVE
      );
      hideLoader();
      return;
    }

    // 获取过滤器值
    const excludedLeagues = leagueFiltersIgnore ? [] : convertToNumberArray(popupElements.custom_leagueFilters?.getValue());
    const excludedClubs = clubFiltersIgnore ? [] : convertToNumberArray(popupElements.custom_clubFilters?.getValue());
    const excludedNations = nationFiltersIgnore ? [] : convertToNumberArray(popupElements.custom_nationFilters?.getValue());
    const excludedRarities = rarityFiltersIgnore ? [] : convertToNumberArray(popupElements.custom_rarityFilters?.getValue());
    const onlyRarities = convertToNumberArray(popupElements.custom_rarityFiltersToInclude?.getValue());

    // 添加忽略的球员到排除列表
    if (ignoredPlayers.length) {
      excludedIds.push(...ignoredPlayers);
    }

    // 处理多解设置
    const multiSolveConfig = popupElements.custom_multiSolveToggle?.getValue()
      ? {
          numberOfSolutions: popupElements.custom_multiSolveNoOfSolutions?.getValue() ?? 1,
          exactGroupCount: popupElements.custom_multiSolveExactGroupCount?.getValue() ?? false,
        }
      : undefined;

    // 检查多解限制
    if (multiSolveConfig && multiSolveConfig.numberOfSolutions > multiSolveLimit) {
      sendUINotification(
        translate("multiSolveLimitExceedWarning", { maxSolutions: multiSolveLimit })
      );
      await wait(0.5);
      multiSolveConfig.numberOfSolutions = multiSolveLimit;
    }

    hideLoader();
    dismissSquadMenu();

    // 获取概念设置
    const useConcept = popupElements.custom_useConceptToggle?.getValue() ?? false;

    // 生成解决方案
    generateSolution(
      popupElements,
      challenge,
      {
        players: players,
        prioritize: {
          storage: popupElements.custom_prioritizeStorageToggle?.getValue() ?? true,
          untradeables: popupElements.custom_prioritizeUntradeablesToggle?.getValue() ?? true,
          duplicates: popupElements.custom_prioritizeDuplicatesToggle?.getValue() ?? true,
        },
        sbcId: challenge.id,
        concept: {
          useConcept: useConcept,
          findCheapest: useConcept && popupElements.custom_conceptPrioritization?.getValue() === ConceptCheapest,
          prioritizeClubPlayers: useConcept && popupElements.custom_conceptPrioritization?.getValue() === ConceptClubPlayers,
        },
        filters: {
          excludedIds: Array.from(new Set(excludedIds)),
          includedIds: Array.from(new Set(includedPlayers)),
          excludedLeagues: excludedLeagues,
          excludedClubs: excludedClubs,
          excludedNations: excludedNations,
          ratingRange: popupElements.custom_ratingFilter?.getValue() ?? [10, 99],
          excludedRarities: excludedRarities,
          onlyFemales: sbcSettings.onlyFemales,
          onlyStorage: popupElements.custom_onlyStorageToggle?.getValue() ?? false,
          onlyUntradeables: popupElements.custom_onlyUntradeablesToggle?.getValue() ?? false,
          onlyDuplicates: popupElements.custom_onlyDuplicatesToggle?.getValue() ?? false,
          maxPricePerPlayer: popupElements.custom_maxPricePerPlayer?.getValue(),
          onlyRarities: onlyRarities,
        },
        multiSolve: multiSolveConfig,
        settings: {
          useOldSolver: popupElements.custom_useOldSolverToggle?.getValue() ?? false,
        },
      },
      popupElements.custom_mimicHumanBehaviorToggle?.getValue() ?? false
    );
  } catch (error) {
    hideLoader();
    throw error;
  }
}
