// 还原后的俱乐部球员管理模块代码
import { observableToPromise, getLocalization } from './observable-utils'; // 对应 n(27988)
import { wait, applyFilter } from './utils'; // 对应 n(82125)
import { bulkMoveToTransferList, move } from './transfer-utils'; // 对应 n(75212)
import { formatRarity } from './format-utils'; // 对应 n(30383)
import { getTransferListItemsByGroupSync, getUnAssignedItems, getTransferListItemsByGroup } from './transfer-list-utils'; // 对应 n(72598)

/**
 * 搜索俱乐部
 * @param {Object} criteria - 搜索条件
 * @returns {Promise} 搜索结果的Promise
 */
export const searchClub = (criteria) =>
  observableToPromise(services.Club.search(criteria));

/**
 * 检查是否为已使用的租借物品
 * @param {Object} item - 物品对象
 * @returns {boolean} 是否为已使用的租借物品
 */
export const isUsedLoanItem = (item) =>
  item.isLimitedUse() &&
  (!item.loans || (item.endTime && item.endTime < Date.now() / 1000));

/**
 * 递归获取所有俱乐部球员（内部函数）
 * @param {Object} criteria - 搜索条件
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @param {boolean} onlyFemales - 是否只包含女性球员
 * @param {boolean} skipWait - 是否跳过等待
 * @returns {Promise<Array>} 球员数组
 */
const getAllClubPlayersRecursive = async (criteria, excludeLoans = false, onlyFemales = false, skipWait = false) => {
  const { data } = await searchClub(criteria);
  const filteredItems = data.items.filter(
    (item) => !((excludeLoans && item.isLimitedUse()) || (onlyFemales && item.gender !== 1))
  );

  if (data?.retrievedAll) {
    return filteredItems;
  }

  criteria.offset += criteria.count;
  if (!skipWait) {
    await wait(0.5);
  }
  return getAllClubPlayersRecursive(criteria, excludeLoans, onlyFemales, skipWait);
};

/**
 * 格式化价格限制
 * @param {Object} priceLimits - 价格限制对象
 * @param {Object} localization - 本地化对象
 * @returns {string} 格式化后的价格限制字符串
 */
const formatPriceLimits = (priceLimits, localization) =>
  priceLimits
    ? `${localization.localize("abbr.minimum")}${priceLimits.minimum} ${localization.localize("abbr.maximum")}${priceLimits.maximum}`
    : "--NA--";

/**
 * 同步获取存储球员
 * @returns {Array} 存储球员数组
 */
export const getStoragePlayersSync = () =>
  repositories.Item.getStorageItems() ?? [];

/**
 * 同步获取重复的定义ID
 * @param {boolean} includeTransferList - 是否包含转会市场物品
 * @returns {Set} 重复定义ID的Set
 */
export const getDuplicatedDefIdsSync = (includeTransferList) => {
  const unassignedItems = repositories.Item.getUnassignedItems() ?? [];
  const { unSoldItems, availableItems } = includeTransferList
    ? getTransferListItemsByGroupSync()
    : { unSoldItems: [], availableItems: [] };

  const allItems = unassignedItems.concat(unSoldItems ?? [], availableItems ?? []);

  return new Set(
    unassignedItems
      .concat(allItems)
      .filter((item) => item.isDuplicate())
      .map((item) => item.definitionId)
  );
};

/**
 * 异步获取重复的定义ID
 * @param {boolean} includeTransferList - 是否包含转会市场物品
 * @returns {Promise<Set>} 重复定义ID的Set
 */
export const getDuplicatedDefIds = async (includeTransferList) => {
  const { data } = await getUnAssignedItems(false);
  const { unSoldItems, availableItems } = includeTransferList
    ? await getTransferListItemsByGroup(true)
    : { unSoldItems: [], availableItems: [] };

  const allItems = (data?.items ?? []).concat(unSoldItems ?? [], availableItems ?? []);

  return new Set(
    allItems?.filter((item) => item.isDuplicate()).map((item) => item.definitionId)
  );
};

/**
 * 获取活跃阵容ID
 * @returns {Promise} 活跃阵容ID的Promise
 */
export const getActiveSquadIds = () => {
  const viewModel = new UTBucketedItemSearchViewModel();
  return observableToPromise(viewModel.requestActiveSquadDefIds());
};

/**
 * 获取所有俱乐部球员
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @param {Object} options - 选项对象
 * @returns {Promise<Array>} 球员数组
 */
export const getAllClubPlayers = async (excludeLoans, options = {}) => {
  const {
    playerId,
    onlyUntradables,
    excludeActiveSquad,
    onlyTradables,
  } = options;

  // 重置统计缓存并获取统计信息
  services.Club.clubDao.resetStatsCache();
  services.Club.getStats();

  const { searchCriteria } = new UTBucketedItemSearchViewModel();

  if (playerId) {
    searchCriteria.defId = [playerId];
  }

  if (onlyUntradables || onlyTradables) {
    searchCriteria.untradeables = onlyUntradables ? "true" : "false";
  }

  if (excludeActiveSquad) {
    const activeSquadData = await getActiveSquadIds();
    searchCriteria.excludeDefIds = activeSquadData.data?.defIds ?? [];
  }

  searchCriteria.count = 90;

  return getAllClubPlayersRecursive(searchCriteria, excludeLoans, options.onlyFemales);
};

/**
 * 获取活跃阵容场上球员
 * @returns {Promise<Array>} 场上球员定义ID数组
 */
export const getActiveSquadFieldPlayers = async () => {
  const activeSquadData = await getActiveSquadIds();
  return (activeSquadData.data?.defIds ?? []).slice(0, UTSquadEntity.FIELD_PLAYERS);
};

/**
 * 获取存储球员
 * @param {Object} criteria - 搜索条件
 * @returns {Promise} 存储球员的Promise
 */
export const getStoragePlayers = (criteria) =>
  observableToPromise(services.Item.searchStorageItems(criteria));

/**
 * 创建默认搜索条件
 * @returns {Object} 默认搜索条件对象
 */
const createDefaultSearchCriteria = () => {
  const criteria = new UTSearchCriteriaDTO();
  criteria.type = SearchType.PLAYER;
  criteria.defId = [];
  criteria.category = SearchCategory.ANY;
  return criteria;
};

/**
 * 获取所有存储球员
 * @param {Object} criteria - 搜索条件
 * @returns {Promise<Array>} 存储球员数组
 */
export const getAllStoragePlayers = async (criteria = createDefaultSearchCriteria()) => {
  const { data } = await getStoragePlayers(criteria);

  if (data?.endOfList) {
    return data.items;
  }

  criteria.offset += criteria.count;
  await wait(0.25);
  return getAllStoragePlayers(criteria);
};

/**
 * 获取存储球员查找表
 * @returns {Promise<Map>} 存储球员查找表
 */
export const getStoragePlayersLookup = async () => {
  const players = await getAllStoragePlayers(createDefaultSearchCriteria());
  const lookup = new Map();

  for (const player of players) {
    lookup.set(player.definitionId, player);
  }

  return lookup;
};

/**
 * 获取去重的存储球员
 * @returns {Promise<Array>} 去重的存储球员数组
 */
export const getDeDupedStoragePlayers = async () => {
  const lookup = await getStoragePlayersLookup();
  return Array.from(lookup.values());
};

/**
 * 获取用于下载的阵容球员数据
 * @returns {Promise<Array>} 格式化的球员数据数组
 */
export const getSquadPlayersForDownload = async () => {
  const localization = getLocalization();
  const allPlayers = (await getAllClubPlayers(false)).sort(
    (a, b) => b.rating - a.rating
  );
  const activeSquadPlayers = await getActiveSquadFieldPlayers();
  const duplicatedDefIds = await getDuplicatedDefIds(false);
  const activeSquadSet = new Set(activeSquadPlayers);

  return allPlayers.map((player) => ({
    Name: player.getStaticData().name,
    Rating: player.rating,
    Rarity: formatRarity(player.rareflag, player.isSpecial(), localization),
    "Preferred Position": UTLocalizationUtil.positionIdToName(
      player.preferredPosition,
      localization
    ),
    Nation: UTLocalizationUtil.nationIdToName(player.nationId, localization),
    League: UTLocalizationUtil.leagueIdToName(player.leagueId, localization),
    Team: UTLocalizationUtil.teamIdToAbbr15(player.teamId, localization),
    "Price Limits": formatPriceLimits(player._itemPriceLimits, localization),
    "Last Sale Price": player.lastSalePrice,
    "Discard Value": player.discardValue,
    Untradeable: player.untradeable,
    Loans: player.isLimitedUse(),
    DefinitionId: player.definitionId,
    IsDuplicate: duplicatedDefIds.has(player.definitionId),
    IsInActive11: activeSquadSet.has(player.definitionId),
    "Alternate Positions": (
      player.possiblePositions?.map((pos) =>
        UTLocalizationUtil.positionIdToName(pos, localization)
      ) ?? []
    ).join(","),
  }));
};

/**
 * 获取球员统计信息
 * @returns {Promise<Object>} 球员统计信息对象
 */
export const getPlayersStats = async () => {
  const playersData = await getSquadPlayersForDownload();

  return playersData
    .filter((player) => !player.Loans)
    .reduce(
      (stats, player) => {
        // 按稀有度统计
        const rarityCount = stats.playersByRarity.stats.get(player.Rarity) ?? 0;
        stats.playersByRarity.stats.set(player.Rarity, rarityCount + 1);

        // 按品质统计
        const quality = player.Rating < 65 ? "Bronze" : player.Rating < 75 ? "Silver" : "Gold";
        const qualityCount = stats.playersByQuality.stats.get(quality) ?? 0;
        stats.playersByQuality.stats.set(quality, qualityCount + 1);

        // 按国籍统计
        const nationCount = stats.playersByNation.stats.get(player.Nation) ?? 0;
        stats.playersByNation.stats.set(player.Nation, nationCount + 1);

        // 按联赛统计
        const leagueCount = stats.playersByLeague.stats.get(player.League) ?? 0;
        stats.playersByLeague.stats.set(player.League, leagueCount + 1);

        // 按俱乐部统计
        const clubCount = stats.playersByClub.stats.get(player.Team) ?? 0;
        stats.playersByClub.stats.set(player.Team, clubCount + 1);

        // 按位置统计
        const positionCount = stats.playersByPosition.stats.get(player["Preferred Position"]) ?? 0;
        stats.playersByPosition.stats.set(player["Preferred Position"], positionCount + 1);

        // 按状态统计
        const status = player.Loans
          ? "Loaned"
          : player.Untradeable
          ? "Untradeable"
          : player.IsDuplicate
          ? "Duplicate"
          : "Tradeable";
        const statusCount = stats.playersByStatus.stats.get(status) ?? 0;
        stats.playersByStatus.stats.set(status, statusCount + 1);

        // 按评分统计
        const ratingCount = stats.playersByRating.stats.get(`${player.Rating}`) ?? 0;
        stats.playersByRating.stats.set(`${player.Rating}`, ratingCount + 1);

        return stats;
      },
      {
        playersByRarity: { header: "Rarity", stats: new Map() },
        playersByQuality: { header: "Quality", stats: new Map() },
        playersByNation: { header: "Nation", stats: new Map() },
        playersByLeague: { header: "League", stats: new Map() },
        playersByClub: { header: "Club", stats: new Map() },
        playersByPosition: { header: "Position", stats: new Map() },
        playersByStatus: { header: "Trade Status", stats: new Map() },
        playersByRating: { header: "Rating", stats: new Map() },
      }
    );
};

/**
 * 获取阵容球员查找表
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Promise<Map>} 阵容球员查找表
 */
export const getSquadPlayerLookup = async (excludeLoans = true) => {
  const players = await getAllClubPlayers(excludeLoans);
  const lookup = new Map();

  for (const player of players
    .filter((p) => !p.isEnrolledInAcademy())
    .sort((a, b) => +!a.academy - +!b.academy)) {
    lookup.set(player.definitionId, player);
  }

  return lookup;
};

/**
 * 获取SBC用的阵容查找表
 * @returns {Promise<Map>} SBC阵容查找表
 */
export const getSquadLookupForSbc = async () => {
  const squadLookup = await getSquadPlayerLookup();
  await wait(0.5);

  const storageLookup = await getStoragePlayersLookup();

  for (const [defId, player] of storageLookup.entries()) {
    squadLookup.set(defId, player);
  }

  return squadLookup;
};

/**
 * 获取快速添加用的阵容球员
 * @param {Object} options - 选项对象
 * @returns {Promise<Array>} 格式化的球员数据数组
 */
export const getSquadPlayersForQuickAdd = async (options) => {
  const players = await getAllClubPlayers(true, options);
  await wait(0.5);

  return players
    .filter(
      (player) =>
        !(
          player.isEnrolledInAcademy() ||
          (options.ignoreEvolutionPlayers && player.academy) ||
          applyFilter(options.ignoredLeagues, player.leagueId) ||
          applyFilter(options.ignoredClubs, player.teamId) ||
          applyFilter(options.ignoredNations, player.nationId) ||
          applyFilter(options.ignoredRarities, player.rareflag) ||
          applyFilter(options.ignoredPlayers, player.definitionId) ||
          applyFilter(
            options.ignoredPlayers,
            player._metaData?.id ?? player.databaseId
          )
        )
    )
    .map((player) => ({
      definitionId: player.definitionId,
      rating: player.rating,
      rareflag: player.rareflag,
      nationId: player.nationId,
      teamId: player.teamId,
      leagueId: player.leagueId,
      groups: player.groups,
      quality: player.getTier(),
    }));
};

/**
 * 获取SBC用的球员
 * @param {boolean} excludeActiveSquad - 是否排除活跃阵容
 * @param {boolean} excludeEvolutionPlayers - 是否排除进化球员
 * @returns {Promise<Object>} 包含球员和排除ID的对象
 */
export const getPlayersForSbc = async (excludeActiveSquad, excludeEvolutionPlayers) => {
  const clubPlayers = await getAllClubPlayers(true);
  const excludedIds = [];

  if (excludeActiveSquad) {
    const activeSquadData = await getActiveSquadIds();
    const activeSquadDefIds = activeSquadData.data?.defIds ?? [];
    excludedIds.push(...activeSquadDefIds);
  }

  await wait(0.5);
  const storagePlayers = await getDeDupedStoragePlayers();
  await wait(0.5);
  const duplicatedDefIds = await getDuplicatedDefIds(true);
  await wait(0.5);

  // 获取学院球员ID
  const academyPlayerIds = clubPlayers
    .filter((player) => player.isEnrolledInAcademy())
    .map(({ definitionId }) => definitionId);

  if (academyPlayerIds.length) {
    excludedIds.push(...academyPlayerIds);
  }

  if (excludeEvolutionPlayers) {
    const evolutionPlayerIds = clubPlayers
      .filter((player) => !!player.academy)
      .map(({ definitionId }) => definitionId);
    excludedIds.push(...evolutionPlayerIds);
  }

  return {
    players: clubPlayers.concat(storagePlayers).map((player) => ({
      id: player.definitionId,
      playStyle: player.playStyle,
      isUntradeable: player.untradeable,
      isStorage: player.pile === ItemPile.STORAGE,
      isEvolutionPlayer: !!player.academy,
      owners: player.owners,
      isDuplicate: duplicatedDefIds.has(player.definitionId),
    })),
    excludedIds,
  };
};

/**
 * 获取目标用的球员
 * @returns {Promise<Array>} 球员ID数组
 */
export const getPlayersForObjective = async () =>
  (await getAllClubPlayers(false))
    .filter((player) => !player.isLimitedUse() || player.loans > 0)
    .map(({ definitionId }) => ({ id: definitionId }));

/**
 * 获取阵容球员ID
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Promise<Set>} 球员ID的Set
 */
export const getSquadPlayerIds = async (excludeLoans = true) => {
  const lookup = await getSquadPlayerLookup(excludeLoans);
  return new Set(lookup.keys());
};

/**
 * 获取阵容球员资产ID
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Promise<Set>} 球员资产ID的Set
 */
export const getSquadPlayerAssetIds = async (excludeLoans = true) => {
  const players = await getAllClubPlayers(excludeLoans);
  return new Set(players.map(({ databaseId }) => databaseId));
};

/**
 * 获取符合条件的非活跃可交易球员
 * @param {Object} criteria - 搜索条件
 * @returns {Promise} 搜索结果的Promise
 */
export const getNonActiveTradablePlayersMatchingCriteria = async (criteria) => {
  const viewModel = new UTBucketedItemSearchViewModel();
  const { data: activeSquadData } = await getActiveSquadIds();

  if (criteria) {
    viewModel.updateSearchCriteria(criteria);
  }

  const { searchCriteria } = viewModel;
  searchCriteria.excludeDefIds = activeSquadData.defIds;
  searchCriteria._untradeables = "false";
  searchCriteria.count = 90;

  return searchClub(searchCriteria);
};

/**
 * 获取所有俱乐部球员（快速版本）
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Promise<Array>} 球员数组
 */
export const getAllClubPlayersFast = async (excludeLoans) => {
  const { searchCriteria } = new UTBucketedItemSearchViewModel();
  searchCriteria.count = 90;
  return getAllClubPlayersRecursive(searchCriteria, excludeLoans, false, true);
};

/**
 * 发送球员到转会市场
 * @param {Object} criteria - 搜索条件
 * @returns {Promise<number>} 发送的球员数量
 */
export const sendPlayersToTradePile = async function (criteria) {
  if (repositories.Item.isPileFull(ItemPile.TRANSFER)) {
    return -1;
  }

  const searchResult = await getNonActiveTradablePlayersMatchingCriteria(criteria);

  return searchResult.data?.items
    ? bulkMoveToTransferList(searchResult.data?.items)
    : 0;
};

/**
 * 获取俱乐部统计信息
 * @returns {Promise<Array>} 统计信息数组
 */
export const getClubStats = async () => {
  const { data } = await observableToPromise(services.Club.getStats());
  return data?.stats ?? [];
};

/**
 * 获取所有已使用的租借球员
 * @returns {Promise<Array>} 已使用的租借球员数组
 */
export const getAllUsedLoanPlayers = async () =>
  (await getAllClubPlayers(false)).filter(isUsedLoanItem) ?? [];

/**
 * 同步获取阵容球员
 * @param {Object} criteria - 搜索条件
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Array} 球员数组
 */
export const getSquadPlayersSync = (criteria, excludeLoans = true) =>
  (repositories.Item.club.items.search(criteria) ?? []).filter(
    (player) => !excludeLoans || !player.isLimitedUse()
  );

/**
 * 将存储球员移动到俱乐部
 * @returns {Promise<number>} 移动的球员数量
 */
export const moveStorageToClub = async () => {
  const storagePlayers = await getAllStoragePlayers(createDefaultSearchCriteria());
  await wait(0.5);

  const squadLookup = await getSquadPlayerLookup();
  const playersToMove = storagePlayers.filter(
    ({ definitionId }) => !squadLookup.has(definitionId)
  );

  if (!playersToMove.length) {
    return 0;
  }

  await wait(0.5);
  await move(playersToMove, ItemPile.CLUB);
  return playersToMove.length;
};
