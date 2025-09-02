# 背景图片设置说明

## 概述
CineSpace已经配置好支持自定义背景图片。你需要提供两张背景图片：

1. **`background.jpg`** - 用于主页 (index.html)
2. **`bg2.jpg`** - 用于所有子页面 (action.html, drama.html, comedy.html, sci-fi.html, animation.html, romance.html)

## 图片要求

### 推荐规格
- **格式**: JPG, PNG, WebP 等常见图片格式
- **分辨率**: 1920x1080 或更高
- **文件大小**: 建议不超过 2MB，以保证加载速度
- **比例**: 16:9 或 4:3 横版图片效果最佳

### 图片内容建议
- **background.jpg**: 适合作为主页背景，可以是电影相关的场景、影院、或者抽象的电影主题图片
- **bg2.jpg**: 适合作为子页面背景，可以是更简洁的设计，不会干扰内容阅读

## 添加步骤

1. **准备图片文件**
   - 将你的背景图片重命名为 `background.jpg` 和 `bg2.jpg`
   - 确保图片质量良好，适合作为网页背景

2. **放置图片文件**
   ```
   public/images/
   ├── background.jpg  ← 主页背景图
   ├── bg2.jpg         ← 子页面背景图
   ├── logo.svg
   ├── banners/
   └── posters/
   ```

3. **验证效果**
   - 打开 `index.html` 查看主页背景效果
   - 打开任意子页面（如 `action.html`）查看子页面背景效果

## 样式特性

### 主页背景 (background.jpg)
- 全屏覆盖，固定背景
- 内容区域有半透明毛玻璃效果
- 背景图片会保持固定，滚动时不会移动

### 子页面背景 (bg2.jpg)
- 全屏覆盖，固定背景
- 内容区域有半透明毛玻璃效果
- 与主页相同的视觉效果

## 自定义调整

如果你想要调整背景效果，可以修改以下CSS文件：

### 主页背景调整
编辑 `styles/style.css` 中的 `body` 样式：
```css
body {
    background-image: url('../public/images/background.jpg');
    background-size: cover;        /* 覆盖整个屏幕 */
    background-position: center;   /* 居中显示 */
    background-attachment: fixed;  /* 固定背景 */
    background-repeat: no-repeat;  /* 不重复 */
}
```

### 子页面背景调整
编辑 `styles/category.css` 中的 `body` 样式：
```css
body {
    background-image: url('../public/images/bg2.jpg');
    /* 其他属性同上 */
}
```

### 透明度调整
如果需要调整内容区域的透明度，修改 `.container` 样式：
```css
.container {
    background: rgba(255, 255, 255, 0.95); /* 0.95 是透明度，0-1之间 */
    backdrop-filter: blur(10px);           /* 毛玻璃效果强度 */
}
```

## 故障排除

### 背景图片不显示
1. 检查图片文件是否放在正确位置：`public/images/`
2. 检查文件名是否正确：`background.jpg` 和 `bg2.jpg`
3. 检查图片格式是否被浏览器支持
4. 检查文件路径是否正确

### 背景图片显示异常
1. 尝试不同的 `background-size` 值：
   - `cover`: 覆盖整个容器
   - `contain`: 完整显示图片
   - `100% 100%`: 拉伸到容器大小

2. 调整 `background-position`：
   - `center`: 居中
   - `top`: 顶部对齐
   - `bottom`: 底部对齐

## 完成检查清单

- [ ] 将 `background.jpg` 放置在 `public/images/` 目录
- [ ] 将 `bg2.jpg` 放置在 `public/images/` 目录
- [ ] 打开主页验证背景效果
- [ ] 打开子页面验证背景效果
- [ ] 检查在不同设备上的显示效果
- [ ] 确认背景不影响文字可读性

完成这些步骤后，你的CineSpace就会拥有美观的自定义背景了！
