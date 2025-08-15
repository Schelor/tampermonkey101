import { isMarketAlert, isCompanionApp } from './appDetection'; // 假设从42388模块导入
import { tapBackButton } from './navigationUtils'; // 假设从28984模块导入

/**
 * 向外部环境发送事件
 * @param {*} payload - 事件载荷数据
 * @param {string} type - 事件类型
 */
export const fireExternalEvent = (payload, type) => {
  const message = { type, ...(payload && { payload }) };

  if (isMarketAlert()) {
    // 如果是市场警报环境，使用ReactNativeWebView
    window.ReactNativeWebView?.postMessage(JSON.stringify(message));
  } else {
    // 否则使用标准的window.postMessage
    window.postMessage(message);
  }
};

/**
 * 解析消息数据
 * @param {MessageEvent} event - 消息事件
 * @returns {*} 解析后的响应数据
 */
const parseMessageData = (event) => {
  const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
  return data?.response;
};

/**
 * 监听导航事件
 */
export const listenToNavigationEvent = () => {
  window.addEventListener(
    "message",
    (event) => {
      const response = parseMessageData(event);

      // 如果收到返回方向的导航事件，触发返回按钮
      if (response?.direction === "back") {
        tapBackButton();
      }
    },
    true
  );
};

/**
 * 监听特定标识符的响应
 * @param {string} identifier - 请求标识符
 * @returns {Promise<*>} 响应数据的Promise
 */
export const listenForResponse = (identifier) =>
  new Promise((resolve) => {
    const messageHandler = (event) => {
      const response = parseMessageData(event);

      // 如果响应包含匹配的标识符，解析Promise并移除监听器
      if (response?.identifier && response.identifier === identifier) {
        window.removeEventListener("message", messageHandler, true);
        resolve(response);
      }
    };

    window.addEventListener("message", messageHandler, true);
  });

/**
 * 使用fetch API发送HTTP请求
 * @param {Object} options - 请求选项
 * @returns {Promise<{response: string, status: number}>} 请求结果
 */
const sendFetchRequest = async (options) => {
  try {
    const response = await fetch(options.url, {
      method: options.method,
      body: options.data,
      headers: options.headers
    });

    return {
      response: await response.text(),
      status: response.status
    };
  } catch (error) {
    return {
      response: "",
      status: 500
    };
  }
};

/**
 * 通过外部扩展发送请求
 * @param {Object} options - 请求选项
 * @returns {Promise<*>} 请求响应
 */
const sendExternalRequest = async (options) => {
  fireExternalEvent({ options }, "fetchFromExternal");
  return listenForResponse(options.identifier);
};

/**
 * 获取扩展Logo
 * @returns {Promise<*>} Logo数据
 */
export const getExtensionLogo = async () => {
  const identifier = `${Math.floor(Date.now())}_fetchExtensionLogo`;

  fireExternalEvent({ identifier }, "fetchExtensionLogo");
  return listenForResponse(identifier);
};

/**
 * 生成请求ID
 * @returns {string} 格式为FNXT+6位随机字符的请求ID
 */
export const generateRequestId = () => {
  let randomString = "";

  for (let i = 0; i < 6; i += 1) {
    randomString += "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"[
      Math.floor(36 * Math.random())
    ];
  }

  return `FNXT${randomString}`;
};

/**
 * 发送HTTP请求
 * @param {string} url - 请求URL
 * @param {string} method - HTTP方法
 * @param {string} identifier - 请求标识符
 * @param {*} data - 请求体数据
 * @param {Object} headers - 请求头
 * @param {number} timeOut - 超时时间（秒）
 * @returns {Promise<string>} 响应文本
 * @throws {number} HTTP状态码（如果请求失败）
 */
export const sendRequest = async (url, method, identifier, data, headers, timeOut) => {
  const requestOptions = {
    method,
    identifier,
    url,
    data,
    headers,
    timeOut
  };

  // 根据环境选择请求方式
  const requestPromises = [
    isCompanionApp() ? sendFetchRequest(requestOptions) : sendExternalRequest(requestOptions)
  ];

  // 如果设置了超时时间，添加超时Promise
  if (requestOptions.timeOut) {
    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({ response: "{}", status: 200 });
      }, 1000 * requestOptions.timeOut);
    });

    requestPromises.push(timeoutPromise);
  }

  // 使用Promise.race等待最先完成的请求
  const { response, status } = await Promise.race(requestPromises);

  // 检查HTTP状态码，如果不在200-299范围内则抛出异常
  if (!status || status < 200 || status > 299) {
    throw status;
  }

  return response;
};
