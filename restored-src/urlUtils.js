/**
 * 构建导航链接
 * 将多个参数转换为URL友好的路径格式
 * @param {...string} segments - 路径段参数
 * @returns {string} 格式化后的导航链接
 */
export const constructNavigationLink = (...segments) =>
  segments
    .map((segment) =>
      segment
        .replaceAll("-", "_")    // 将连字符替换为下划线
        .replaceAll(" ", "_")    // 将空格替换为下划线
        .replaceAll("/", ",")    // 将斜杠替换为逗号
    )
    .join("/")                   // 用斜杠连接所有段
    .toLowerCase();              // 转换为小写

/**
 * 验证图片URL是否有效
 * 通过尝试加载图片来检测URL的有效性
 * @param {string} imageUrl - 要验证的图片URL
 * @returns {Promise<boolean>} 如果图片能成功加载返回true，否则返回false
 */
export const isValidImageUrl = (imageUrl) =>
  new Promise((resolve) => {
    const image = new Image();

    // 图片加载成功时的回调
    image.onload = () => resolve(true);

    // 图片加载失败时的回调
    image.onerror = () => resolve(false);

    // 开始加载图片
    image.src = imageUrl;
  });
