import { load } from 'cheerio'; // 假设从62311模块导入
import { tapElement } from './tapElement'; // 假设从95160模块导入

/**
 * 等待元素出现的通用函数
 * @param {Function} checkFunction - 检查函数
 * @returns {Promise} 返回找到的元素或超时拒绝
 */
const waitForCondition = (checkFunction) =>
  new Promise((resolve, reject) => {
    let attempts = 10;

    const check = (interval) => {
      if (attempts <= 0) {
        reject();
        return;
      }

      const result = checkFunction();

      if (result) {
        resolve(result);
      } else {
        setTimeout(() => {
          attempts -= 1;
          check(interval);
        }, interval);
      }
    };

    check(200);
  });

/**
 * 批量启用/禁用元素
 * @param {Array} elements - 元素数组
 * @param {boolean} disabled - 是否禁用
 */
const toggleElementsDisabled = (elements, disabled) => {
  for (const element of elements) {
    const inputs = element.querySelectorAll("input, select, button, textarea");

    for (const input of inputs) {
      if ("disabled" in input) {
        input.disabled = disabled;
      }
    }
  }
};

// ==================== 元素查找 ====================

/**
 * 查找单个元素
 * @param {string} selector - CSS选择器
 * @param {Element} context - 查找上下文，默认为document
 * @returns {Element|null} 找到的元素
 */
export const find = (selector, context = document) => context.querySelector(selector);

/**
 * 查找所有匹配的元素
 * @param {string} selector - CSS选择器
 * @param {Element} context - 查找上下文，默认为document
 * @returns {Array} 元素数组
 */
export const findAll = (selector, context = document) => [
  ...context.querySelectorAll(selector).values()
];

/**
 * 为元素添加CSS类
 * @param {Element} element - 目标元素
 * @param {string} className - 要添加的类名
 */
export const addClassToElement = (element, className) => {
  element?.classList.add(className);
};

/**
 * 从元素移除CSS类
 * @param {Element} element - 目标元素
 * @param {string} className - 要移除的类名
 */
export const removeClassFromElement = (element, className) => {
  element?.classList.remove(className);
};

/**
 * 根据索引查找元素
 * @param {string} selector - CSS选择器
 * @param {number} index - 索引位置
 * @param {Element} context - 查找上下文，默认为document
 * @returns {Element|undefined} 指定索引的元素
 */
export const findElementAtIndex = (selector, index = 0, context = document) =>
  context.querySelectorAll(selector)[index];

/**
 * 根据文本内容查找元素
 * @param {string} selector - CSS选择器
 * @param {string} text - 要匹配的文本
 * @returns {Element|undefined} 匹配的元素
 */
export const findByText = (selector, text) => {
  const elements = document.querySelectorAll(selector);
  return Array.prototype.find.call(elements, (element) =>
    new RegExp(text, "i").test(element.textContent)
  );
};

// ==================== 元素操作 ====================

/**
 * 向元素末尾添加子元素
 * @param {Element} parent - 父元素
 * @param {Element} child - 子元素
 * @returns {Element} 父元素
 */
export const append = (parent, child) => (parent.appendChild(child), parent);

/**
 * 向元素开头添加子元素
 * @param {Element} parent - 父元素
 * @param {Element} child - 子元素
 * @returns {Element} 父元素
 */
export const prepend = (parent, child) => (parent.insertBefore(child, parent.firstChild), parent);

/**
 * 在指定元素后插入新元素
 * @param {Element} newElement - 要插入的新元素
 * @param {Element} targetElement - 目标元素
 */
export const insertAfter = (newElement, targetElement) => {
  const parentNode = targetElement.parentNode;
  const { nextSibling } = targetElement;

  if (nextSibling) {
    parentNode?.insertBefore(newElement, nextSibling);
  } else {
    parentNode?.append(newElement);
  }
};

/**
 * 在元素前添加兄弟元素
 * @param {Element} element - 目标元素
 * @param {Element} sibling - 兄弟元素
 * @returns {Element} 目标元素
 */
export const prependSibling = (element, sibling) => (element.before(sibling), element);

/**
 * 在元素后添加兄弟元素
 * @param {Element} element - 目标元素
 * @param {Element} sibling - 兄弟元素
 * @returns {Element} 目标元素
 */
export const appendSibling = (element, sibling) => (element.after(sibling), element);

/**
 * 将HTML字符串转换为DOM元素
 * @param {string} html - HTML字符串
 * @returns {Element} DOM元素
 */
export const htmlToElement = (html) => {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

// ==================== 元素状态 ====================

/**
 * 检查元素是否隐藏
 * @param {Element} element - 要检查的元素
 * @returns {boolean} 如果元素隐藏返回true
 */
export const isHidden = (element) => !element || (!element.offsetWidth && !element.offsetHeight);

/**
 * 检查元素是否可见
 * @param {Element} element - 要检查的元素
 * @returns {boolean} 如果元素可见返回true
 */
export const isVisible = (element) => !isHidden(element);

/**
 * 等待元素变为可见
 * @param {Element} element - 要等待的元素
 * @returns {Promise} 元素可见时解析
 */
export const waitForElementToDisplay = (element) => waitForCondition(() => isVisible(element));

/**
 * 等待元素出现在DOM中
 * @param {string} selector - CSS选择器
 * @returns {Promise} 元素出现时解析
 */
export const waitForElement = (selector) => waitForCondition(() => document.querySelector(selector));

// ==================== 元素控制 ====================

/**
 * 启用元素（移除disabled属性）
 * @param {Array} elements - 元素数组
 */
export const enableElements = (elements) => toggleElementsDisabled(elements, false);

/**
 * 禁用元素（添加disabled属性）
 * @param {Array} elements - 元素数组
 */
export const disableElements = (elements) => toggleElementsDisabled(elements, true);

/**
 * 设置元素的HTML内容
 * @param {string} selector - CSS选择器
 * @param {string} value - HTML内容
 */
export const setHTMLValue = (selector, value) => {
  const element = find(selector);
  if (element) {
    element.innerHTML = `${value}`;
  }
};

/**
 * 从父元素中移除子元素
 * @param {Element} parent - 父元素
 * @param {Array} children - 要移除的子元素数组
 */
export const removeElements = (parent, children) => {
  for (const child of children) {
    if (parent.contains(child)) {
      child.remove();
    }
  }
};

/**
 * 向父元素添加子元素
 * @param {Element} parent - 父元素
 * @param {Array} children - 要添加的子元素数组
 */
export const addElements = (parent, children) => {
  for (const child of children) {
    if (parent.contains(child)) {
      parent.append(child);
    }
  }
};

/**
 * 显示元素
 * @param {Element} element - 要显示的元素
 */
export const show = (element) => {
  if (element) {
    element.style.display = "";
  }
};

/**
 * 隐藏元素
 * @param {Element} element - 要隐藏的元素
 */
export const hide = (element) => {
  if (element) {
    element.style.display = "none";
  }
};

// ==================== 样式操作 ====================

/**
 * 添加或更新动态样式表
 * @param {string} id - 样式表ID
 * @param {string} css - CSS内容
 */
export const addDynamicStyleSheet = (id, css) => {
  let styleElement = find(`#${id}`);

  if (styleElement) {
    styleElement.textContent = css;
  } else {
    styleElement = document.createElement("style");
    styleElement.id = id;
    styleElement.textContent = css;
    document.body.append(styleElement);
  }
};

/**
 * 移除样式表
 * @param {string} id - 样式表ID
 */
export const removeStyleSheet = (id) => {
  const styleElement = find(`#${id}`);
  styleElement?.remove();
};

// ==================== 工具函数 ====================

/**
 * 创建包含文本的span元素
 * @param {string} text - 文本内容
 * @returns {Element} span元素
 */
export const createSpanWithText = (text) => {
  const span = document.createElement("span");
  span.textContent = text;
  return span;
};

/**
 * 点击元素并滚动到视图中
 * @param {Element} element - 目标元素
 */
export const tapAndscrollElementIntoView = (element) => {
  tapElement(element);
  element.scrollIntoView({ behavior: "smooth" });
};

/**
 * 解析DOM字符串
 * @param {string} html - HTML字符串
 * @returns {Object} 解析后的DOM对象
 */
export const parseDOM = (html) => load(html);
