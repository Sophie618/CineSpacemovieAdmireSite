# CineSpace-movieAdmireSite

A movie appreciation and analysis platform dedicated to exploring the art of cinema. Discover in-depth film reviews, director spotlights, visual style breakdowns, and discussions on storytelling techniques. For cinephiles seeking to dive deeper into the magic of movies.

## 📁 项目结构

```
CineSpace_new/
├── index.html              # 主页面
├── index.js               # JavaScript交互功能
├── movie-detail.html      # 电影详情页面
├── [category].html        # 分类页面
├── styles/
│   ├── style.css          # 主样式文件
│   ├── category.css       # 分类页面样式
│   └── movie-detail.css   # 电影详情样式
├── js/
│   ├── category.js        # 分类页面逻辑
│   └── movie-detail.js    # 电影详情逻辑
├── public/
│   └── images/            # 图片资源目录
│       ├── banners/       # 分类横幅
│       └── posters/       # 电影海报
├── data/
│   └── movies.json        # 电影数据
└── README.md              # 项目说明
```

## 🚀 快速开始

1. **GitHub Pages**；点击[这里](https://sophie618.github.io/CineSpacemovieAdmireSite/)跳转
2. **本地服务器**：使用任何HTTP服务器运行项目
3. **Node.js服务器**：运行 `node start-server.js` 启动本地服务器

## ✨ 功能特性

### 🎨 界面功能
- 响应式设计，支持各种屏幕尺寸
- 现代化的渐变背景和卡片设计
- 平滑的动画过渡效果
- 动态背景图片切换

### 🔍 交互功能
- **搜索功能**：支持关键词搜索
- **分类导航**：6个电影分类卡片
- **电影详情**：点击电影查看详细信息
- **返回顶部**：滚动时自动显示/隐藏
- **通知系统**：用户操作反馈

### ⌨️ 快捷键
- `Ctrl/Cmd + K`：快速聚焦搜索框
- `Enter`：在搜索框中按回车键搜索
- `ESC`：关闭通知消息

### 📱 响应式支持
- 桌面端：完整功能展示
- 平板端：自适应布局
- 移动端：优化的移动体验

## 🎬 电影分类

1. **动作片** - 刺激的动作电影
2. **剧情片** - 深刻的剧情故事
3. **喜剧片** - 轻松幽默的喜剧
4. **科幻片** - 未来世界的想象
5. **动画片** - 精彩的动画世界
6. **爱情片** - 浪漫的爱情故事

## 🛠️ 技术栈

- **HTML5**：语义化标签，SEO友好
- **CSS3**：Flexbox、Grid、动画、响应式设计
- **JavaScript ES6+**：模块化函数、事件处理、DOM操作
- **JSON**：电影数据存储

## 📝 代码特点

- **无框架依赖**：纯原生技术实现
- **模块化设计**：功能分离，易于维护
- **注释完整**：代码可读性强
- **性能优化**：轻量级，加载快速
- **数据驱动**：JSON数据管理电影信息

## 🔧 自定义配置

### 修改电影分类
编辑 `index.html` 中的分类卡片部分，或修改 `index.js` 中的相关逻辑。

### 修改样式
所有样式都在 `styles/` 目录中，可以轻松自定义颜色、字体、布局等。

### 添加新功能
在相应的JS文件中添加新的函数，并在 `DOMContentLoaded` 事件中调用。

### 更新电影数据
编辑 `data/movies.json` 文件来添加或修改电影信息。

## 🌟 浏览器支持

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 许可证

MIT License - 可自由使用和修改
