// 还原后的俱乐部球员管理模块代码
import { observableToPromise, getLocalization } from './ui-utils'; // 对应 n(27988)
import { wait, applyFilter } from './utils'; // 对应 n(82125)
import { bulkMoveToTransferList, move } from './item-operations'; // 对应 n(75212)
import { formatRarity } from './rarity-formatter'; // 对应 n(30383)
import { getUnAssignedItems, getTransferListItemsByGroup, getTransferListItemsByGroupSync } from './transfer-list-utils'; // 对应 n(72598)

/**
 * 搜索俱乐部球员
 * @param {Object} searchCriteria - 搜索条件
 * @returns {Promise} 搜索结果
 */
export const searchClub = (searchCriteria) =>
  observableToPromise(services.Club.search(searchCriteria));

/**
 * 检查是否为已使用的租借物品
 * @param {Object} item - 物品对象
 * @returns {boolean} 是否为已使用的租借物品
 */
export const isUsedLoanItem = (item) =>
  item.isLimitedUse() &&
  (!item.loans || (item.endTime && item.endTime < Date.now() / 1000));

/**
 * 递归获取所有俱乐部球员
 * @param {Object} searchCriteria - 搜索条件
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @param {boolean} onlyFemales - 是否只包含女性球员
 * @param {boolean} skipWait - 是否跳过等待
 * @returns {Promise<Array>} 球员数组
 */
const getAllClubPlayersRecursive = async (searchCriteria, excludeLoans = false, onlyFemales = false, skipWait = false) => {
  const { data } = await searchClub(searchCriteria);

  const filteredItems = data.items.filter(
    (item) => !((excludeLoans && item.isLimitedUse()) || (onlyFemales && item.gender !== 1))
  );

  if (data?.retrievedAll) {
    return filteredItems;
  }

  // 更新偏移量继续搜索
  searchCriteria.offset += searchCriteria.count;

  if (!skipWait) {
    await wait(0.5);
  }

  return getAllClubPlayersRecursive(searchCriteria, excludeLoans, onlyFemales, skipWait);
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
 * 同步获取重复球员定义ID
 * @param {boolean} includeTransferList - 是否包含转会列表
 * @returns {Set} 重复球员定义ID集合
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
 * 异步获取重复球员定义ID
 * @param {boolean} includeTransferList - 是否包含转会列表
 * @returns {Promise<Set>} 重复球员定义ID集合
 */
export const getDuplicatedDefIds = async (includeTransferList) => {
  const { data: unassignedData } = await getUnAssignedItems(false);

  const { unSoldItems, availableItems } = includeTransferList
    ? await getTransferListItemsByGroup(true)
    : { unSoldItems: [], availableItems: [] };

  const allItems = (unassignedData?.items ?? []).concat(unSoldItems ?? [], availableItems ?? []);

  return new Set(
    allItems?.filter((item) => item.isDuplicate()).map((item) => item.definitionId)
  );
};

/**
 * 获取活跃阵容ID
 * @returns {Promise} 活跃阵容ID数据
 */
export const getActiveSquadIds = () => {
  const searchViewModel = new UTBucketedItemSearchViewModel();
  return observableToPromise(searchViewModel.requestActiveSquadDefIds());
};

/**
 * 获取所有俱乐部球员
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @param {Object} options - 选项参数
 * @returns {Promise<Array>} 球员数组
 */
export const getAllClubPlayers = async (excludeLoans, options = {}) => {
  const {
    playerId,
    onlyUntradables,
    excludeActiveSquad,
    onlyTradables,
  } = options;

  // 重置统计缓存
  services.Club.clubDao.resetStatsCache();
  services.Club.getStats();

  const { searchCriteria } = new UTBucketedItemSearchViewModel();

  // 设置搜索条件
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
 * 搜索存储球员
 * @param {Object} searchCriteria - 搜索条件
 * @returns {Promise} 搜索结果
 */
export const getStoragePlayers = (searchCriteria) =>
  observableToPromise(services.Item.searchStorageItems(searchCriteria));

/**
 * 创建默认存储搜索条件
 * @returns {Object} 搜索条件对象
 */
const createDefaultStorageSearchCriteria = () => {
  const criteria = new UTSearchCriteriaDTO();
  criteria.type = SearchType.PLAYER;
  criteria.defId = [];
  criteria.category = SearchCategory.ANY;
  return criteria;
};

/**
 * 获取所有存储球员
 * @param {Object} searchCriteria - 搜索条件
 * @returns {Promise<Array>} 存储球员数组
 */
export const getAllStoragePlayers = async (searchCriteria = createDefaultStorageSearchCriteria()) => {
  const { data } = await getStoragePlayers(searchCriteria);

  if (data?.endOfList) {
    return data.items;
  }

  searchCriteria.offset += searchCriteria.count;
  await wait(0.25);
  return getAllStoragePlayers(searchCriteria);
};

/**
 * 获取存储球员查找表
 * @returns {Promise<Map>} 存储球员查找表
 */
export const getStoragePlayersLookup = async () => {
  const storagePlayers = await getAllStoragePlayers(createDefaultStorageSearchCriteria());
  const lookup = new Map();

  for (const player of storagePlayers) {
    lookup.set(player.definitionId, player);
  }

  return lookup;
};

/**
 * 获取去重的存储球员
 * @returns {Promise<Array>} 去重的存储球员数组
 */
export const getDeDupedStoragePlayers = async () => {
  const storagePlayersLookup = await getStoragePlayersLookup();
  return Array.from(storagePlayersLookup.values());
};

/**
 * 获取用于下载的阵容球员数据
 * @returns {Promise<Array>} 格式化的球员数据数组
 */
export const getSquadPlayersForDownload = async () => {
  const localization = getLocalization();
  const allPlayers = (await getAllClubPlayers(false)).sort((a, b) => b.rating - a.rating);
  const activeSquadFieldPlayers = await getActiveSquadFieldPlayers();
  const duplicatedDefIds = await getDuplicatedDefIds(false);
  const activeSquadSet = new Set(activeSquadFieldPlayers);

  return allPlayers.map((player) => ({
    Name: player.getStaticData().name,
    Rating: player.rating,
    Rarity: formatRarity(player.rareflag, player.isSpecial(), localization),
    "Preferred Position": UTLocalizationUtil.positionIdToName(player.preferredPosition, localization),
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
 * 获取球员统计数据
 * @returns {Promise<Object>} 球员统计对象
 */
export const getPlayersStats = async () => {
  const playersData = await getSquadPlayersForDownload();

  return playersData
    .filter((player) => !player.Loans)
    .reduce(
      (stats, player) => {
        // 稀有度统计
        const rarityCount = stats.playersByRarity.stats.get(player.Rarity) ?? 0;
        stats.playersByRarity.stats.set(player.Rarity, rarityCount + 1);

        // 品质统计
        const quality = player.Rating < 65 ? "Bronze" : player.Rating < 75 ? "Silver" : "Gold";
        const qualityCount = stats.playersByQuality.stats.get(quality) ?? 0;
        stats.playersByQuality.stats.set(quality, qualityCount + 1);

        // 国籍统计
        const nationCount = stats.playersByNation.stats.get(player.Nation) ?? 0;
        stats.playersByNation.stats.set(player.Nation, nationCount + 1);

        // 联赛统计
        const leagueCount = stats.playersByLeague.stats.get(player.League) ?? 0;
        stats.playersByLeague.stats.set(player.League, leagueCount + 1);

        // 俱乐部统计
        const clubCount = stats.playersByClub.stats.get(player.Team) ?? 0;
        stats.playersByClub.stats.set(player.Team, clubCount + 1);

        // 位置统计
        const positionCount = stats.playersByPosition.stats.get(player["Preferred Position"]) ?? 0;
        stats.playersByPosition.stats.set(player["Preferred Position"], positionCount + 1);

        // 状态统计
        const status = player.Loans
          ? "Loaned"
          : player.Untradeable
            ? "Untradeable"
            : player.IsDuplicate
              ? "Duplicate"
              : "Tradeable";
        const statusCount = stats.playersByStatus.stats.get(status) ?? 0;
        stats.playersByStatus.stats.set(status, statusCount + 1);

        // 评分统计
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
 * @returns {Promise<Map>} 球员查找表
 */
export const getSquadPlayerLookup = async (excludeLoans = true) => {
  const allPlayers = await getAllClubPlayers(excludeLoans);
  const lookup = new Map();

  for (const player of allPlayers
    .filter((player) => !player.isEnrolledInAcademy())
    .sort((a, b) => +!a.academy - +!b.academy)) {
    lookup.set(player.definitionId, player);
  }

  return lookup;
};

/**
 * 获取SBC用的阵容查找表
 * @returns {Promise<Map>} 包含俱乐部和存储球员的查找表
 */
export const getSquadLookupForSbc = async () => {
  const squadLookup = await getSquadPlayerLookup();
  await wait(0.5);

  const storageLookup = await getStoragePlayersLookup();

  // 合并存储球员到查找表
  for (const [definitionId, player] of storageLookup.entries()) {
    squadLookup.set(definitionId, player);
  }

  return squadLookup;
};

/**
 * 获取用于快速添加的阵容球员
 * @param {Object} settings - 设置对象
 * @returns {Promise<Array>} 过滤后的球员数组
 */
export const getSquadPlayersForQuickAdd = async (settings) => {
  const allPlayers = await getAllClubPlayers(true, settings);
  await wait(0.5);

  return allPlayers
    .filter(
      (player) =>
        !(
          player.isEnrolledInAcademy() ||
          (settings.ignoreEvolutionPlayers && player.academy) ||
          applyFilter(settings.ignoredLeagues, player.leagueId) ||
          applyFilter(settings.ignoredClubs, player.teamId) ||
          applyFilter(settings.ignoredNations, player.nationId) ||
          applyFilter(settings.ignoredRarities, player.rareflag) ||
          applyFilter(settings.ignoredPlayers, player.definitionId) ||
          applyFilter(settings.ignoredPlayers, player._metaData?.id ?? player.databaseId)
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
 * 获取SBC用的球员数据
 * @param {boolean} excludeActiveSquad - 是否排除活跃阵容
 * @param {boolean} ignoreEvolutionPlayers - 是否忽略进化球员
 * @returns {Promise<Object>} 包含球员和排除ID的对象
 */
export const getPlayersForSbc = async (excludeActiveSquad, ignoreEvolutionPlayers) => {
  const allClubPlayers = await getAllClubPlayers(true);
  const excludedIds = [];

  // 排除活跃阵容球员
  if (excludeActiveSquad) {
    const activeSquadData = await getActiveSquadIds();
    const activeSquadIds = activeSquadData.data?.defIds ?? [];
    excludedIds.push(...activeSquadIds);
  }

  await wait(0.5);
  const storagePlayers = await getDeDupedStoragePlayers();
  await wait(0.5);
  const duplicatedDefIds = await getDuplicatedDefIds(true);
  await wait(0.5);

  // 排除学院球员
  const academyPlayerIds = allClubPlayers
    .filter((player) => player.isEnrolledInAcademy())
    .map(({ definitionId }) => definitionId);

  if (academyPlayerIds.length) {
    excludedIds.push(...academyPlayerIds);
  }

  // 排除进化球员
  if (ignoreEvolutionPlayers) {
    const evolutionPlayerIds = allClubPlayers
      .filter((player) => !!player.academy)
      .map(({ definitionId }) => definitionId);
    excludedIds.push(...evolutionPlayerIds);
  }

  const formatPlayer = (player, isDuplicate) => ({
    id: player.definitionId,
    playStyle: player.playStyle,
    isUntradeable: player.untradeable,
    isStorage: player.pile === ItemPile.STORAGE,
    isEvolutionPlayer: !!player.academy,
    owners: player.owners,
    isDuplicate: isDuplicate,
  });

  return {
    players: allClubPlayers.concat(storagePlayers).map((player) =>
      formatPlayer(player, duplicatedDefIds.has(player.definitionId))
    ),
    excludedIds: excludedIds,
  };
};

/**
 * 获取目标用的球员数据
 * @returns {Promise<Array>} 球员数组
 */
export const getPlayersForObjective = async () =>
  (await getAllClubPlayers(false))
    .filter((player) => !player.isLimitedUse() || player.loans > 0)
    .map(({ definitionId }) => ({ id: definitionId }));

/**
 * 获取阵容球员ID集合
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Promise<Set>} 球员ID集合
 */
export const getSquadPlayerIds = async (excludeLoans = true) => {
  const squadLookup = await getSquadPlayerLookup(excludeLoans);
  return new Set(squadLookup.keys());
};

/**
 * 获取阵容球员资产ID集合
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Promise<Set>} 球员资产ID集合
 */
export const getSquadPlayerAssetIds = async (excludeLoans = true) => {
  const allPlayers = await getAllClubPlayers(excludeLoans);
  return new Set(allPlayers.map(({ databaseId }) => databaseId));
};

/**
 * 获取符合条件的非活跃可交易球员
 * @param {Object} searchCriteria - 搜索条件
 * @returns {Promise} 搜索结果
 */
export const getNonActiveTradablePlayersMatchingCriteria = async (searchCriteria) => {
  const searchViewModel = new UTBucketedItemSearchViewModel();
  const { data: activeSquadData } = await getActiveSquadIds();

  if (searchCriteria) {
    searchViewModel.updateSearchCriteria(searchCriteria);
  }

  const { searchCriteria: criteria } = searchViewModel;
  criteria.excludeDefIds = activeSquadData.defIds;
  criteria._untradeables = "false";
  criteria.count = 90;

  return searchClub(criteria);
};

/**
 * 发送球员到交易堆
 * @param {Object} searchCriteria - 搜索条件
 * @returns {Promise<number>} 发送的球员数量
 */
export const sendPlayersToTradePile = async function (searchCriteria) {
  if (repositories.Item.isPileFull(ItemPile.TRANSFER)) {
    return -1;
  }

  const searchResult = await getNonActiveTradablePlayersMatchingCriteria(searchCriteria);

  return searchResult.data?.items
    ? bulkMoveToTransferList(searchResult.data?.items)
    : 0;
};

/**
 * 获取俱乐部统计数据
 * @returns {Promise<Array>} 统计数据数组
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
 * @param {Object} searchCriteria - 搜索条件
 * @param {boolean} excludeLoans - 是否排除租借球员
 * @returns {Array} 球员数组
 */
export const getSquadPlayersSync = (searchCriteria, excludeLoans = true) =>
  (repositories.Item.club.items.search(searchCriteria) ?? []).filter(
    (player) => !excludeLoans || !player.isLimitedUse()
  );

/**
 * 将存储球员移动到俱乐部
 * @returns {Promise<number>} 移动的球员数量
 */
export const moveStorageToClub = async () => {
  const storagePlayers = await getAllStoragePlayers(createDefaultStorageSearchCriteria());
  await wait(0.5);

  const squadLookup = await getSquadPlayerLookup();
  const playersToMove = storagePlayers.filter(({ definitionId }) => !squadLookup.has(definitionId));

  if (!playersToMove.length) {
    return 0;
  }

  await wait(0.5);
  await move(playersToMove, ItemPile.CLUB);
  return playersToMove.length;
};
