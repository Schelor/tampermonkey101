// 还原后的初始化SBC覆盖模块代码
import { sbcHomeOverride } from './sbc-home-override'; // 对应 n(99401)
import { sbcSubmitChallengeOverride } from './sbc-submit-challenge-override'; // 对应 n(58806)
import { sbcTileOverride } from './sbc-tile-override'; // 对应 n(75955)
import { sbcViewOverride } from './sbc-view-override'; // 对应 n(79605)
// n(51637) - 这个导入没有赋值，可能是副作用导入
import './side-effects-module'; // 对应 n(51637)
import { rewardCellViewOverride } from './reward-cell-view-override'; // 对应 n(64369)
import { challengeRequirementsViewOverride } from './challenge-requirements-view-override'; // 对应 n(88669)
import { challengeViewOverride } from './challenge-view-override'; // 对应 n(72673)

/**
 * 初始化所有SBC相关的视图覆盖功能
 * 这个函数会依次调用所有SBC增强功能的初始化方法
 */
export const initSbcOverrides = () => {
  // 初始化SBC主页覆盖
  sbcHomeOverride();

  // 初始化SBC提交挑战覆盖
  sbcSubmitChallengeOverride();

  // 初始化SBC视图覆盖（主要的SBC界面增强）
  sbcViewOverride();

  // 初始化SBC瓦片覆盖
  sbcTileOverride();

  // 初始化奖励单元格视图覆盖
  rewardCellViewOverride();

  // 初始化挑战需求视图覆盖
  challengeRequirementsViewOverride();

  // 初始化挑战视图覆盖
  challengeViewOverride();
};
