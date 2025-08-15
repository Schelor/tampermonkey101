// 还原后的创建按钮模块代码 (模块ID: 64905)
"use strict";

// 设置模块为ES模块
Object.defineProperty(exports, "__esModule", { value: true });
exports.createButton = void 0;

// 导入依赖模块
const panelUtils = require('./panel-utils'); // 对应 n(66175)
const analytics = require('./analytics'); // 对应 n(57439)

/**
 * 创建按钮的工具函数
 * @param {Object} options - 按钮配置选项
 * @param {string} options.label - 按钮文本标签
 * @param {Function} options.onClick - 点击事件处理函数
 * @param {string} [options.customClass] - 自定义CSS类名
 * @param {boolean} [options.createWrapper] - 是否创建包装容器
 * @param {boolean} [options.isSecondaryBtn] - 是否为次要按钮
 * @param {string} [options.id] - 按钮ID，用于分析追踪
 * @param {string} [options.subText] - 子文本（用于货币按钮）
 * @returns {Object} 返回包含按钮元素和控制方法的对象
 */
const createButton = function({
  label,
  onClick,
  customClass,
  createWrapper,
  isSecondaryBtn,
  id,
  subText
}) {
  // 根据是否有子文本决定使用哪种按钮控件
  const buttonControl = subText
    ? new UTCurrencyButtonControl()  // 货币按钮控件（带子文本）
    : new UTStandardButtonControl(); // 标准按钮控件

  // 初始化按钮控件
  buttonControl.init();

  // 添加点击事件监听器
  buttonControl.addTarget(
    buttonControl,
    () => {
      // 发送分析事件
      analytics.Analytics.instance.fireEvent("button_click", {
        event_category: "button_interaction",
        event_label: id
      });

      // 执行用户定义的点击回调
      onClick();
    },
    EventType.TAP
  );

  // 设置按钮文本
  buttonControl.setText(label);

  // 如果有子文本且是货币按钮控件，设置子文本
  if (subText && buttonControl instanceof UTCurrencyButtonControl) {
    buttonControl.setSubText(subText);
  }

  // 获取按钮的根DOM元素
  const buttonElement = buttonControl.getRootElement();

  // 处理按钮样式类
  if (!isSecondaryBtn && !customClass?.includes("accordion")) {
    // 如果不是次要按钮且不包含accordion类，添加primary类
    buttonElement.classList.add("primary");
  }

  // 添加自定义CSS类
  if (customClass) {
    const classNames = customClass.split(" ");
    for (const className of classNames) {
      buttonElement.classList.add(className);
    }
  }

  let finalElement;

  // 决定最终返回的元素
  if (createWrapper) {
    // 如果需要包装器，创建面板行并添加按钮
    finalElement = panelUtils.createPanelRow({ customClass });
    finalElement.append(buttonElement);
  } else {
    // 否则直接使用按钮元素
    finalElement = buttonElement;
  }

  // 返回按钮对象，包含元素和控制方法
  return {
    element: finalElement,
    destroy: buttonControl.destroy.bind(buttonControl),
    setInteractionState: (state) => buttonControl.setInteractionState(state),
    updateLabel: (newLabel) => buttonControl.setText(newLabel)
  };
};

// 导出createButton函数
exports.createButton = createButton;
