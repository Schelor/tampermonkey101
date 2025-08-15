import { createSectionHeader } from './uiComponents'; // 对应 n(66175)
import {
  getSortOptions,
  getLeagues,
  getNations,
  getClubs,
  getAllRarities,
  getMatchingPlayers,
  formOptionsFromDefId
} from './api'; // 对应 n(13808)
import {
  getLocalization,
  createToggleInput,
  createDropDown
} from './localization'; // 对应 n(27988)
import { translate } from './translator'; // 对应 n(44669)
import {
  createDropDownMulti,
  valuesToSet
} from './utils'; // 对应 n(82125)

/**
 * 创建SBC解决方案设置视图
 * @param {Object} settings - SBC设置对象
 * @returns {HTMLElement} 返回创建的设置视图DOM元素
 */
export const SbcSolutionSettingView = (settings) => {
  const settingsRef = settings;
  const container = document.createElement("div");
  const localization = getLocalization();

  // 设置容器样式和属性
  container.classList.add(
    "tile",
    "col-1-1",
    "ut-tile-transfer-market",
    "enhancer-settings-wrapper"
  );
  container.dataset.tourTitle = translate("sbcSetting");

  // 添加节标题
  container.append(
    createSectionHeader(
      localization.localize("nav.label.sbc"),
      "enhancer-settings-header"
    )
  );

  // 创建设置区域容器
  const settingsSection = document.createElement("div");
  settingsSection.classList.add("enhancer-settings-section");

  // 1. 排除活跃阵容球员设置
  const excludeActiveSquadToggle = createToggleInput({
    label: localization.localize("search.sort.squadPlayers"),
    onChange: (value) => {
      settingsRef.excludeActiveSquad = value;
    },
    defaultValue: settings.excludeActiveSquad,
    customClass: "enhancer-settings-field",
    tourInfo: translate("filterActiveSquadInfo"),
    id: "sbc_exclude_active_squad",
  });

  // 2. 忽略位置设置
  const ignorePositionToggle = createToggleInput({
    label: localization.localize("search.sort.ignorePosition"),
    onChange: (value) => {
      settingsRef.ignorePosition = value;
    },
    defaultValue: settings.ignorePosition,
    customClass: "enhancer-settings-field",
    tourInfo: translate("ignorePositionInfo"),
    id: "sbc_ignore_position",
  });

  // 3. 仅不可交易球员设置
  const onlyUntradablesToggle = createToggleInput({
    label: localization.localize("search.sort.header"),
    onChange: (value) => {
      settingsRef.onlyUntradables = value;
    },
    defaultValue: settings.onlyUntradables,
    customClass: "enhancer-settings-field",
    tourInfo: translate("filterTradableInfo"),
    id: "sbc_only_untradables",
  });

  // 4. 仅女性球员设置
  const onlyFemalesToggle = createToggleInput({
    label: translate("sbcOnlyFemale"),
    onChange: (value) => {
      settingsRef.onlyFemales = value;
    },
    defaultValue: settings.onlyFemales,
    customClass: "enhancer-settings-field",
    tourInfo: translate("sbcOnlyFemaleInfo"),
    id: "sbc_only_females",
  });

  // 5. 排除进化球员设置
  const ignoreEvolutionPlayersToggle = createToggleInput({
    label: translate("sbcExcludeEvolutionPlayers"),
    onChange: (value) => {
      settingsRef.ignoreEvolutionPlayers = value;
    },
    defaultValue: settings.ignoreEvolutionPlayers,
    customClass: "enhancer-settings-field",
    tourInfo: translate("sbcExcludeEvolutionPlayersInfo"),
    id: "sbc_ignore_evolutions",
  });

  // 6. 包含转会列表重复球员设置
  const includeTLDuplicatesToggle = createToggleInput({
    label: translate("includeTLDuplicates"),
    onChange: (value) => {
      settingsRef.includeTLDuplicates = value;
    },
    defaultValue: settings.includeTLDuplicates,
    customClass: "enhancer-settings-field",
    tourInfo: translate("includeTLDuplicatesInfo"),
    id: "sbc_include_TL_Duplicates",
  });

  // 7. 忽略重复球员过滤器设置
  const ignoreFiltersForDuplicatesToggle = createToggleInput({
    label: translate("ignoreFiltersForDuplicates"),
    onChange: (value) => {
      settingsRef.ignoreFiltersForDuplicates = value;
    },
    defaultValue: settings.ignoreFiltersForDuplicates,
    customClass: "enhancer-settings-field",
    tourInfo: translate("ignoreFiltersForDuplicatesInfo"),
    id: "sbc_ignore_filters_duplicate_players",
  });

  // 8. 忽略特定联赛过滤器设置
  const ignoreSpecificLeagueFilterToggle = createToggleInput({
    label: translate("ignoreSpecificLeagueFilters"),
    onChange: (value) => {
      settingsRef.ignoreSpecificLeagueFilter = value;
    },
    defaultValue: settings.ignoreSpecificLeagueFilter,
    customClass: "enhancer-settings-field",
    tourInfo: translate("ignoreSpecificLeagueFiltersInfo"),
    id: "sbc_ignore_specific_league_filters",
  });

  // 9. 默认SBC排序设置
  const squadBuildSortDropdown = createDropDown({
    label: translate("defaultSBSort"),
    onChange: (value, id) => {
      settingsRef.squadBuildSortId = +id;
    },
    options: getSortOptions(),
    defaultId: settings.squadBuildSortId,
    customClass: "enhancer-settings-field",
    tourInfo: translate("defaultSBSortInfo"),
    id: "sbc_squad_build_sort",
  });

  // 10. 忽略联赛多选设置
  const ignoredLeaguesMultiSelect = createDropDownMulti({
    label: translate("removePlayersFromLeague"),
    tourInfo: translate("removePlayersFromLeague"),
    defaultValue: [...settings.ignoredSbcLeagues].map((league) => `${league}`),
    customClass: "enhancer-settings-field",
    options: getLeagues(),
    onChange: (values) => {
      valuesToSet(settings.ignoredSbcLeagues, values);
    },
    id: "sbc_leagues_ignore",
  });

  // 11. 忽略国家多选设置
  const ignoredNationsMultiSelect = createDropDownMulti({
    label: translate("removePlayersFromNation"),
    tourInfo: translate("removePlayersFromNation"),
    defaultValue: [...settings.ignoredSbcNations].map((nation) => `${nation}`),
    customClass: "enhancer-settings-field",
    options: getNations(),
    onChange: (values) => {
      valuesToSet(settings.ignoredSbcNations, values);
    },
    id: "sbc_nations_ignore",
  });

  // 12. 忽略俱乐部多选设置
  const ignoredClubsMultiSelect = createDropDownMulti({
    label: translate("removePlayersFromClub"),
    tourInfo: translate("removePlayersFromClub"),
    defaultValue: [...settings.ignoredSbcClubs].map((club) => `${club}`),
    customClass: "enhancer-settings-field",
    options: getClubs(),
    onChange: (values) => {
      valuesToSet(settings.ignoredSbcClubs, values);
    },
    id: "sbc_clubs_ignore",
  });

  // 13. 忽略稀有度多选设置
  const ignoredRaritiesMultiSelect = createDropDownMulti({
    onChange: (values) => {
      valuesToSet(settings.ignoredSbcRarities, values);
    },
    options: getAllRarities(),
    label: translate("removePlayersWithRarity"),
    defaultValue: [...settings.ignoredSbcRarities].map((rarity) => `${rarity}`),
    customClass: "enhancer-settings-field",
    tourInfo: translate("removePlayersWithRaritySBCInfo"),
    id: "sbc_rarities_ignore",
  });

  // 14. 忽略球员多选设置（带搜索功能）
  const ignoredPlayersMultiSelect = createDropDownMulti({
    onSearch: (searchTerm) => {
      ignoredPlayersMultiSelect.setDynamicOptions(getMatchingPlayers(searchTerm));
    },
    onChange: (values) => {
      valuesToSet(settingsRef.ignoredSbcPlayers, values);
    },
    options: [...settingsRef.ignoredSbcPlayers].map(formOptionsFromDefId),
    label: translate("removePlayers"),
    defaultValue: [...settingsRef.ignoredSbcPlayers].map((player) => player),
    customClass: "enhancer-settings-field",
    tourInfo: translate("removePlayersInfo"),
    id: "sbc_ignore_players",
  });

  // 15. 显示小数阵容评分设置
  const showSquadDecimalRatingToggle = createToggleInput({
    label: translate("showDecimalSquadRating"),
    onChange: (value) => {
      settingsRef.showSquadDecimalRating = value;
    },
    defaultValue: settingsRef.showSquadDecimalRating,
    customClass: "enhancer-settings-field",
    tourInfo: translate("showDecimalSquadRatingInfo"),
    id: "sbc_show_squad_decimal_rating",
  });

  // 16. 提交后移动重复球员到俱乐部设置
  const moveDuplicatesToClubToggle = createToggleInput({
    label: translate("moveDuplicatesToClubAfterSubmit"),
    onChange: (value) => {
      settingsRef.moveDuplicatesToClubAfterSubmit = value;
    },
    defaultValue: settingsRef.moveDuplicatesToClubAfterSubmit,
    customClass: "enhancer-settings-field",
    tourInfo: translate("moveDuplicatesToClubAfterSubmitInfo"),
    id: "sbc_move_duplicates_to_club_after_submit",
  });

  // 17. SBC快速添加排序选项
  const quickAddSortingOptions = [
    new UTDataProviderEntryDTO(0, "rating", localization.localize("squads.rating")),
    new UTDataProviderEntryDTO(1, "price", translate("price")),
  ];

  const sbcQuickAddSortingDropdown = createDropDown({
    label: translate("sbcQuickAddSorting"),
    onChange: (value) => {
      settingsRef.sbcQuickAddSorting = value;
    },
    options: quickAddSortingOptions,
    defaultValue: settingsRef.sbcQuickAddSorting,
    customClass: "enhancer-settings-field",
    tourInfo: translate("sbcQuickAddSortingInfo"),
    id: "sbc_quick_add_sorting",
  });

  // 18. 显示过滤球员数量设置
  const showFilteredPlayerCountToggle = createToggleInput({
    label: translate("showFilteredPlayerCount"),
    onChange: (value) => {
      settingsRef.showFilteredSBCSearchPlayerCount = value;
    },
    defaultValue: settingsRef.showFilteredSBCSearchPlayerCount,
    customClass: "enhancer-settings-field",
    tourInfo: translate("showFilteredPlayerCountInfo"),
    id: "sbc_filter_player_count",
  });

  // 19. 保持评分范围设置
  const preserveRatingRangeToggle = createToggleInput({
    label: translate("preserveRatingRange"),
    onChange: (value) => {
      settingsRef.preserveRatingRange = value;
    },
    defaultValue: settingsRef.preserveRatingRange,
    customClass: "enhancer-settings-field",
    tourInfo: translate("preserveRatingRangeInfo"),
    id: "sbc_preserve_rating_range_toggle",
  });

  // 20. 显示奖励概率设置
  const showRewardOddsToggle = createToggleInput({
    label: translate("showRewardOdds"),
    onChange: (value) => {
      settingsRef.showSBCRewardOdds = value;
    },
    defaultValue: settingsRef.showSBCRewardOdds,
    customClass: "enhancer-settings-field",
    tourInfo: translate("showRewardOddsInfo"),
    id: "sbc_show_rewards_odds",
  });

  // 按顺序添加所有设置元素到容器中
  settingsSection.append(showSquadDecimalRatingToggle.element);
  settingsSection.append(excludeActiveSquadToggle.element);
  settingsSection.append(ignorePositionToggle.element);
  settingsSection.append(onlyUntradablesToggle.element);
  settingsSection.append(onlyFemalesToggle.element);
  settingsSection.append(ignoreEvolutionPlayersToggle.element);
  settingsSection.append(includeTLDuplicatesToggle.element);
  settingsSection.append(ignoreFiltersForDuplicatesToggle.element);
  settingsSection.append(ignoreSpecificLeagueFilterToggle.element);
  settingsSection.append(squadBuildSortDropdown.element);
  settingsSection.append(ignoredLeaguesMultiSelect.element);
  settingsSection.append(ignoredNationsMultiSelect.element);
  settingsSection.append(ignoredClubsMultiSelect.element);
  settingsSection.append(ignoredRaritiesMultiSelect.element);
  settingsSection.append(ignoredPlayersMultiSelect.element);
  settingsSection.append(moveDuplicatesToClubToggle.element);
  settingsSection.append(sbcQuickAddSortingDropdown.element);
  settingsSection.append(showFilteredPlayerCountToggle.element);
  settingsSection.append(preserveRatingRangeToggle.element);
  settingsSection.append(showRewardOddsToggle.element);

  // 将设置区域添加到主容器
  container.append(settingsSection);

  return container;
};
