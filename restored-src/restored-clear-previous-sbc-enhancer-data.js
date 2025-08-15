// 还原后的清除之前SBC增强器数据模块代码
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)

/**
 * 清除之前的SBC增强器数据
 * 重置SBC相关的临时数据和状态，确保新的SBC操作不会受到之前操作的影响
 */
export const clearPreviousSBCEnhancerData = () => {
  // 获取增强器数据存储
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  // 重置SBC包自动打开相关数据
  enhancerData.sbcPackAutoOpen.isEnabled = false;
  enhancerData.sbcPackAutoOpen.autoOpenActions = undefined;

  // 清除上次使用的多解SBC请求数据
  enhancerData.lastUsedMultiSolveSBCRequest = undefined;
};
