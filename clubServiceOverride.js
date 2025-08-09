import { InMemoryStore } from './InMemoryStore'; // 假设这是从32024模块导入的

export const clubServiceOverride = () => {
  // 保存原始方法的引用
  const originalClubSearch = services.Club.search;
  const originalItemSearchStorageItems = services.Item.searchStorageItems;

  // 保存原型方法的引用
  const { updateItemList: originalUpdateItemList, dealloc: originalDealloc } =
    UTClubSearchResultsViewController.prototype;

  const { updateItemList: originalSelectItemUpdateItemList } =
    UTSelectItemFromClubViewController.prototype;

  // 获取增强器数据
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  // 覆盖 Club.search 方法
  services.Club.search = function(searchParams) {
    // 如果不是搜索存储球员且设置了特定球员ID，则设置defId
    if (!enhancerData.clubSearchStoragePlayers && enhancerData.clubSearchPlayerId) {
      searchParams.defId = [enhancerData.clubSearchPlayerId];
    }

    // 根据是否搜索存储球员选择不同的搜索方法
    const searchResult = enhancerData.clubSearchStoragePlayers
      ? originalItemSearchStorageItems.bind(services.Item)(searchParams)
      : originalClubSearch.bind(this)(searchParams);

    // 观察搜索结果
    searchResult.observe(this, (observer, { response }) => {
      observer.unobserve(this);

      // 如果有结果且设置了特定球员ID，过滤结果
      if (response?.items.length && enhancerData.clubSearchPlayerId) {
        response.items = response.items.filter(
          item => item.definitionId === enhancerData.clubSearchPlayerId
        );
      }

      // 重置球员ID
      enhancerData.clubSearchPlayerId = undefined;

      // 更新存储球员搜索状态
      enhancerData.clubSearchStoragePlayers =
        enhancerData.clubSearchStoragePlayers && !response?.retrievedAll;
    });

    return searchResult;
  };

  // 覆盖 UTClubSearchResultsViewController 的 dealloc 方法
  UTClubSearchResultsViewController.prototype.dealloc = function(...args) {
    const result = originalDealloc.call(this, ...args);

    // 清理搜索条件和状态
    enhancerData.lastSearchClubCriteria = undefined;
    enhancerData.clubSearchStoragePlayers = false;

    return result;
  };

  // 覆盖 UTClubSearchResultsViewController 的 updateItemList 方法
  UTClubSearchResultsViewController.prototype.updateItemList = function(items, param2) {
    // 保存最后的搜索条件
    enhancerData.lastSearchClubCriteria = this.searchCriteria;

    // 如果需要过滤租借球员，则过滤掉限制使用的物品
    if (enhancerData.clubSearchFilterLoans) {
      items = items.filter(item => !item.isLimitedUse());
    }

    // 重置过滤状态
    enhancerData.clubSearchFilterLoans = false;

    return originalUpdateItemList.call(this, items, param2);
  };

  // 覆盖 UTSelectItemFromClubViewController 的 updateItemList 方法
  UTSelectItemFromClubViewController.prototype.updateItemList = function(items) {
    // 如果需要过滤租借球员，则过滤掉限制使用的物品
    if (enhancerData.clubSearchFilterLoans) {
      items = items.filter(item => !item.isLimitedUse());
    }

    // 重置过滤状态
    enhancerData.clubSearchFilterLoans = false;

    return originalSelectItemUpdateItemList.call(this, items);
  };
};
