import { debounce } from './debounce'; // 假设从82125模块导入
import { UINotificationTypeEnum } from './UINotificationTypeEnum'; // 假设从26735模块导入

/**
 * 发送通知到通知队列
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型，默认为中性类型
 */
export const sendNotification = (message, type = UINotificationTypeEnum.NEUTRAL) => {
  services.Notification.queue([message, type]);
};

/**
 * 发送UI通知（带防抖功能）
 * 使用500ms的防抖延迟，避免短时间内重复发送相同通知
 */
export const sendUINotification = sendNotification;
