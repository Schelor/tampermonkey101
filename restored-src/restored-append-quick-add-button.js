// 还原后的快速添加按钮模块代码
import { InMemoryStore } from './in-memory-store'; // 对应 n(32024)
import { supportedRequirements } from './supported-requirements'; // 对应 n(87371)
import { addMatchingPlayer } from './add-matching-player'; // 对应 n(35633)
import { parseRequirement } from './requirement-parser'; // 对应 n(69892)

/**
 * 为SBC需求添加快速添加按钮
 * @param {Object} view - 视图对象
 * @param {Object} challenge - 挑战对象
 */
export const appendQuickAddButton = (view, challenge) => {
  // 获取增强器数据
  const enhancerData = InMemoryStore.instance.get("enhancerData");

  // 清理之前创建的按钮
  view.custom_buttons?.forEach((button) => button.destroy());
  view.custom_buttons = undefined;

  // 如果不在SBC阵容页面，直接返回
  if (!enhancerData.isInSBCSquadPage) {
    return;
  }

  // 获取挑战的资格要求
  const eligibilityRequirements = challenge.eligibilityRequirements;

  // 获取需求显示元素的子元素列表
  const requirementChildren = view.__requirements.children;

  // 解析需求
  const parsedRequirements = parseRequirement(eligibilityRequirements);

  // 查找球员品质要求（用于后续匹配）
  const playerQualityRequirement = parsedRequirements.find(
    ({ requirementType }) => requirementType === "PlayerQuality"
  );

  // 遍历所有解析的需求
  for (const requirement of parsedRequirements) {
    // 检查是否为支持的需求类型且未满足
    if (
      supportedRequirements.has(requirement.requirementType) &&
      !challenge.isRequirementMet(requirement.rawRequirement)
    ) {
      // 获取对应的需求显示元素
      const requirementElement = requirementChildren[requirement.index];

      if (requirementElement) {
        // 为需求元素添加样式类
        requirementElement.classList.add("has-add-player");

        // 创建图像按钮控件
        const imageButton = new UTImageButtonControl();
        const buttonElement = imageButton.getRootElement();

        // 设置按钮样式
        buttonElement.classList.add("filter-btn", "custom-player-add");

        // 将按钮添加到需求元素中
        requirementElement.appendChild(buttonElement);

        // 初始化并显示按钮
        imageButton.init();
        imageButton.show();

        // 添加点击事件处理器
        imageButton.addTarget(
          imageButton,
          () => {
            // 调用添加匹配球员函数
            addMatchingPlayer(challenge, requirement, playerQualityRequirement);
          },
          "tap"
        );

        // 将按钮添加到视图的自定义按钮列表中
        view.custom_buttons = view.custom_buttons ?? [];
        view.custom_buttons.push(imageButton);
      }
    }
  }
};
