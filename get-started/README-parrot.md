# 🦜 折衷鹦鹉颜色变换演示

这个项目展示了如何使用JavaScript和Canvas API将雄性折衷鹦鹉的绿色羽毛变换为雌性的红色羽毛。

## 📁 文件说明

### 1. `parrot-demo.html` - 基础演示
- **功能**: 简单的CSS动画演示，展示颜色变换的概念
- **特点**: 
  - 无需图片文件
  - 包含动画效果
  - 响应式设计
  - 键盘快捷键支持

### 2. `parrot-color-changer.html` - 基础图像处理
- **功能**: 使用Canvas API进行基本的图像颜色变换
- **特点**:
  - 加载真实的鹦鹉图片
  - RGB颜色空间处理
  - 简单的绿色到红色转换
  - 实时预览

### 3. `parrot-advanced-color-changer.html` - 高级图像处理
- **功能**: 使用HSV颜色空间进行精确的颜色变换
- **特点**:
  - HSV颜色空间转换
  - 可调节的参数滑块
  - 更精确的颜色检测
  - 专业的图像处理算法

## 🚀 使用方法

### 快速开始
1. 打开 `parrot-demo.html` 查看基础演示
2. 点击按钮体验颜色变换效果
3. 使用键盘快捷键：
   - `1` - 显示雄性（绿色）
   - `2` - 显示雌性（红色）
   - `3` - 动画变换

### 图像处理演示
1. 确保 `parrot.webp` 图片文件在同一目录下
2. 打开 `parrot-color-changer.html` 或 `parrot-advanced-color-changer.html`
3. 点击相应按钮进行颜色变换

## 🔧 技术原理

### 颜色空间转换
```javascript
// RGB转HSV
function rgbToHsv(r, g, b) {
    // 将RGB值归一化到0-1范围
    r /= 255; g /= 255; b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const diff = max - min;
    
    let h = 0, s = 0, v = max;
    
    if (diff !== 0) {
        s = diff / max;
        // 计算色相
        switch (max) {
            case r: h = ((g - b) / diff) % 6; break;
            case g: h = (b - r) / diff + 2; break;
            case b: h = (r - g) / diff + 4; break;
        }
        h *= 60;
        if (h < 0) h += 360;
    }
    
    return { h, s, v };
}
```

### 绿色检测算法
```javascript
// 检测绿色区域
const isGreen = hsv.h >= 90 && hsv.h <= 150 && hsv.s > 0.3 && hsv.v > 0.3;
```

### 颜色变换
```javascript
// 将绿色转换为红色
if (isGreen) {
    hsv.h = 0; // 红色色相
    hsv.s = Math.min(1.0, hsv.s * saturationBoost); // 提升饱和度
    hsv.v = Math.min(1.0, hsv.v * 1.1); // 提升亮度
}
```

## 🎨 颜色映射

| 雄性特征 | 雌性特征 | 变换方法 |
|---------|---------|---------|
| 绿色羽毛 | 红色羽毛 | HSV色相: 120° → 0° |
| 橙黄色喙 | 黑色喙 | 降低亮度和饱和度 |
| 中等饱和度 | 高饱和度 | 提升饱和度1.3倍 |

## 📱 浏览器兼容性

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+

## 🛠️ 自定义参数

在高级版本中，你可以调整以下参数：

- **绿色检测阈值**: 控制绿色检测的敏感度
- **红色强度**: 控制变换后红色的强度
- **饱和度提升**: 控制颜色饱和度的提升程度

## 🎯 应用场景

这个技术可以应用于：

1. **图像编辑软件**: 批量颜色替换功能
2. **游戏开发**: 角色皮肤颜色变换
3. **电商平台**: 商品颜色展示
4. **教育应用**: 生物多样性教学
5. **社交媒体**: 创意图像处理

## 📚 学习资源

- [Canvas API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [颜色空间转换](https://en.wikipedia.org/wiki/HSL_and_HSV)
- [图像处理算法](https://en.wikipedia.org/wiki/Image_processing)

## 🤝 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 📄 许可证

MIT License - 详见LICENSE文件 