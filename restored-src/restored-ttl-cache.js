// 还原后的TTL缓存类代码

/**
 * TTL (Time To Live) 缓存类
 * 提供带有过期时间的缓存功能
 */
export class TTLCache {
  cache;
  ttl;

  /**
   * 构造函数
   * @param {number} ttlMinutes - 缓存过期时间（分钟），默认15分钟
   */
  constructor(ttlMinutes = 15) {
    // 将分钟转换为毫秒
    this.ttl = ttlMinutes * 60 * 1000;
    // 初始化内部缓存Map
    this.cache = new Map();
  }

  /**
   * 获取缓存值
   * @param {string} key - 缓存键
   * @returns {*} 缓存值，如果不存在或已过期则返回undefined
   */
  get(key) {
    const cacheEntry = this.cache.get(key);

    // 检查缓存项是否存在且未过期
    if (cacheEntry?.value && cacheEntry.expires > Date.now()) {
      return cacheEntry.value;
    }

    // 如果缓存项不存在或已过期，删除它
    this.delete(key);
    return undefined;
  }

  /**
   * 设置缓存值
   * @param {string} key - 缓存键
   * @param {*} value - 缓存值
   * @returns {TTLCache} 返回this以支持链式调用
   */
  set(key, value) {
    // 设置缓存项，包含值和过期时间
    this.cache.set(key, {
      value: value,
      expires: Date.now() + this.ttl
    });

    return this;
  }

  /**
   * 删除缓存项
   * @param {string} key - 缓存键
   * @returns {boolean} 总是返回true
   */
  delete(key) {
    this.cache.delete(key);
    return true;
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
  }
}
