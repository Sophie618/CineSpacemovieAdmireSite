# 电影详情页面使用说明

## 功能概述

为每部电影创建了详细的介绍页面，包含以下功能：

### 1. 页面结构
- **电影详情页面**: `movie-detail.html`
- **样式文件**: `styles/movie-detail.css`
- **JavaScript功能**: `js/movie-detail.js`
- **数据文件**: `data/movies.json`

### 2. 页面内容
- **电影基本信息**: 标题、年份、评分、类型
- **详细资料**: 导演、主演、类型、片长、上映时间、制片国家
- **剧情介绍**: 详细的电影情节描述
- **电影海报展示**: 多张电影海报的展示和查看功能
- **相关推荐**: 同类型电影的推荐

### 3. 海报展示功能
- **主海报展示**: 大尺寸海报展示，支持悬停效果
- **缩略图导航**: 多张海报的缩略图预览
- **模态框查看**: 点击可在大图模式下查看海报
- **键盘导航**: 支持方向键切换图片，ESC键关闭
- **响应式设计**: 在不同设备上都能正常显示

## 使用方法

### 1. 访问电影详情页面
从分类页面点击"查看详情"按钮，会自动跳转到对应的电影详情页面：
```
movie-detail.html?id=1  // 速度与激情10
movie-detail.html?id=2  // 碟中谍7
movie-detail.html?id=3  // 疾速追杀4
...
```

### 2. 添加海报图片
在 `public/images/posters/` 目录下添加对应的海报图片：
```
public/images/posters/
├── action1.jpg
├── action1_2.jpg
├── action1_3.jpg
├── action2.jpg
├── action2_2.jpg
├── action2_3.jpg
├── action3.jpg
├── action3_2.jpg
├── action3_3.jpg
├── action4.jpg
├── action4_2.jpg
├── action4_3.jpg
├── action5.jpg
├── action5_2.jpg
├── action5_3.jpg
├── drama1.jpg
├── drama1_2.jpg
├── drama1_3.jpg
├── drama2.jpg
├── drama2_2.jpg
├── drama2_3.jpg
├── drama3.jpg
├── drama3_2.jpg
├── drama3_3.jpg
├── comedy1.jpg
├── comedy1_2.jpg
├── comedy1_3.jpg
├── comedy2.jpg
├── comedy2_2.jpg
├── comedy2_3.jpg
├── comedy3.jpg
├── comedy3_2.jpg
├── comedy3_3.jpg
├── scifi1.jpg
├── scifi1_2.jpg
├── scifi1_3.jpg
├── scifi2.jpg
├── scifi2_2.jpg
├── scifi2_3.jpg
├── scifi3.jpg
├── scifi3_2.jpg
├── scifi3_3.jpg
├── animation1.jpg
├── animation1_2.jpg
├── animation1_3.jpg
├── animation2.jpg
├── animation2_2.jpg
├── animation2_3.jpg
├── animation3.jpg
├── animation3_2.jpg
├── animation3_3.jpg
├── romance1.jpg
├── romance1_2.jpg
├── romance1_3.jpg
├── romance2.jpg
├── romance2_2.jpg
├── romance2_3.jpg
├── romance3.jpg
├── romance3_2.jpg
└── romance3_3.jpg
```

### 3. 数据管理
所有电影数据现在存储在 `data/movies.json` 文件中，包括：
- 基本信息（标题、年份、评分、类型）
- 详细信息（导演、主演、类型、片长等）
- 剧情介绍
- 海报图片列表
- 相关推荐数据

## 电影数据

### 已包含的电影 (20部)
1. **动作片** (5部)
   - 速度与激情10 (ID: 1)
   - 碟中谍7 (ID: 2)
   - 疾速追杀4 (ID: 3)
   - 变形金刚：超能勇士崛起 (ID: 4)
   - 银河护卫队3 (ID: 5)

2. **剧情片** (3部)
   - 奥本海默 (ID: 6)
   - 花月杀手 (ID: 7)
   - 芭比 (ID: 8)

3. **喜剧片** (3部)
   - 超级马里奥兄弟大电影 (ID: 9)
   - 小黄人大眼萌：神偷奶爸前传 (ID: 10)
   - 疯狂元素城 (ID: 11)

4. **科幻片** (3部)
   - 阿凡达：水之道 (ID: 12)
   - 沙丘 (ID: 13)
   - 银河护卫队3 (ID: 14)

5. **动画片** (3部)
   - 蜘蛛侠：纵横宇宙 (ID: 15)
   - 元素大都会 (ID: 16)
   - 超级马里奥兄弟大电影 (ID: 17)

6. **爱情片** (3部)
   - 你的名字 (ID: 18)
   - 天气之子 (ID: 19)
   - 铃芽之旅 (ID: 20)

## 技术特性

### 1. 响应式设计
- 支持桌面、平板、手机等不同设备
- 自适应布局，确保在各种屏幕尺寸下都能正常显示

### 2. 交互功能
- 电影卡片悬停效果
- 海报展示和查看功能
- 模态框图片查看
- 键盘导航支持
- 收藏和分享功能
- 面包屑导航

### 3. 性能优化
- 图片懒加载
- JSON数据异步加载
- 相关推荐动态生成
- 模态框按需显示

## 扩展说明

### 添加新电影
1. 在 `data/movies.json` 文件中添加新电影数据
2. 添加对应的海报图片到 `public/images/posters/`
3. 更新 `gallery` 数组，包含所有海报图片文件名
4. 确保电影ID唯一且连续

### 自定义样式
- 修改 `styles/movie-detail.css` 来自定义页面样式
- 支持主题色彩、字体、布局等自定义

### 功能扩展
- 可以添加评论系统
- 可以添加评分功能
- 可以添加更多海报图片
- 可以添加演员详情页面
- 可以添加预告片播放功能

## 注意事项

1. **图片格式**: 建议使用 JPG 或 PNG 格式，确保浏览器兼容性
2. **图片优化**: 建议压缩图片文件，提高加载速度
3. **JSON数据**: 确保 `data/movies.json` 文件格式正确，避免语法错误
4. **SEO优化**: 每个页面都有独立的标题和描述
5. **无障碍访问**: 所有图片都有alt属性，支持屏幕阅读器
6. **本地服务器**: 由于使用fetch加载JSON文件，需要通过HTTP服务器访问

## 主要改进

1. **数据分离**: 将电影数据从JavaScript代码中分离到JSON文件，提高可维护性
2. **海报展示**: 将视频区域改为海报展示，支持多张图片查看
3. **模态框功能**: 添加了图片查看模态框，支持键盘导航
4. **代码简化**: JavaScript代码更加简洁，专注于功能实现
5. **异步加载**: 使用fetch API异步加载数据，提高页面性能

现在你的电影网站已经具备了完整的电影详情页面功能，并且代码结构更加清晰和易于维护！
