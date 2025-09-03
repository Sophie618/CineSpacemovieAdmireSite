// 全局变量
let movieData = {};
let searchResults = [];
let isSearchMode = false;

document.addEventListener('DOMContentLoaded', function () {
    console.log('🎬 CineSpace已加载完成！');

    // 首先加载电影数据，然后初始化其他功能
    loadMovieData().then(() => {
        initCategoryCards();
        initSearchFunction();
        initBackToTop();
        initMusicPlayer();
        initPageAnimations();
        initKeyboardShortcuts();
        initNavigation();
    });
});

/**
 * 加载电影数据
 */
async function loadMovieData() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        movieData = data.movies;
        console.log('电影数据加载成功，共', Object.keys(movieData).length, '部电影');
    } catch (error) {
        console.error('加载电影数据失败:', error);
        showNotification('加载电影数据失败，搜索功能可能不可用', 'error');
    }
}

/**
 * 初始化搜索功能
 */
function initSearchFunction() {
    const searchButton = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');

    if (searchButton && searchInput) {
        // 点击搜索
        searchButton.addEventListener('click', handleSearch);

        // 回车键搜索
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });

        // 搜索框获得焦点时显示搜索提示
        searchInput.addEventListener('focus', function () {
            if (this.value.trim().length === 0) {
                showSearchSuggestions();
            }
        });
        
        // 清空搜索框时恢复分类展示
        searchInput.addEventListener('input', function (e) {
            const searchTerm = e.target.value.trim();
            if (searchTerm.length === 0) {
                clearSearch();
            }
        });
    }
}

/**
 * 处理搜索
 */
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        // 设置搜索按钮为加载状态
        if (searchButton) {
            searchButton.classList.add('loading');
            searchButton.textContent = '搜索中';
        }
        
        showNotification(`正在搜索: "${searchTerm}"`);
        console.log(`搜索关键词: ${searchTerm}`);
        
        // 执行搜索
        performSearch(searchTerm);
        
        // 搜索完成后恢复按钮状态
        setTimeout(() => {
            if (searchButton) {
                searchButton.classList.remove('loading');
                searchButton.textContent = '搜索';
            }
        }, 1000);
    } else {
        showNotification('请输入搜索关键词');
        searchInput.focus();
    }
}

/**
 * 执行搜索
 */
function performSearch(searchTerm) {
    if (Object.keys(movieData).length === 0) {
        showNotification('电影数据未加载，请刷新页面重试', 'error');
        return;
    }

    // 清空之前的结果
    searchResults = [];
    
    // 搜索算法：多字段匹配
    Object.entries(movieData).forEach(([movieId, movie]) => {
        let score = 0;
        const searchLower = searchTerm.toLowerCase();
        
        // 标题匹配（权重最高）
        if (movie.title.toLowerCase().includes(searchLower)) {
            score += 100;
        }
        
        // 导演匹配
        if (movie.director.toLowerCase().includes(searchLower)) {
            score += 50;
        }
        
        // 主演匹配
        if (movie.cast.toLowerCase().includes(searchLower)) {
            score += 40;
        }
        
        // 类型匹配
        if (movie.genres.toLowerCase().includes(searchLower)) {
            score += 30;
        }
        
        // 描述匹配
        if (movie.description.toLowerCase().includes(searchLower)) {
            score += 20;
        }
        
        // 分类匹配
        if (movie.category.toLowerCase().includes(searchLower)) {
            score += 25;
        }
        
        // 年份匹配
        if (movie.year.toString().includes(searchTerm)) {
            score += 15;
        }
        
        // 国家匹配
        if (movie.country.toLowerCase().includes(searchLower)) {
            score += 10;
        }
        
        // 如果找到匹配项，添加到结果中
        if (score > 0) {
            searchResults.push({
                id: movieId,
                movie: movie,
                score: score
            });
        }
    });
    
    // 按匹配度排序
    searchResults.sort((a, b) => b.score - a.score);
    
    // 显示搜索结果
    displaySearchResults(searchTerm);
}

/**
 * 显示搜索结果
 */
function displaySearchResults(searchTerm) {
    const main = document.querySelector('.main');
    const categoriesSection = document.querySelector('.categories');
    
    if (searchResults.length === 0) {
        showNotification(`没有找到包含"${searchTerm}"的电影`, 'info');
        return;
    }
    
    // 隐藏分类展示区域
    if (categoriesSection) {
        categoriesSection.style.display = 'none';
    }
    
    // 创建搜索结果容器
    let searchContainer = document.getElementById('search-results');
    if (!searchContainer) {
        searchContainer = document.createElement('section');
        searchContainer.id = 'search-results';
        searchContainer.className = 'search-results';
        main.appendChild(searchContainer);
    }
    
    // 清空之前的结果
    searchContainer.innerHTML = '';
    
    // 添加搜索结果标题
    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'search-results-header';
    resultsHeader.innerHTML = `
        <h2>搜索结果</h2>
        <p>找到 ${searchResults.length} 部包含"${searchTerm}"的电影</p>
        <button class="btn btn-secondary" onclick="clearSearch()">返回分类浏览</button>
    `;
    searchContainer.appendChild(resultsHeader);
    
    // 创建电影网格
    const moviesGrid = document.createElement('div');
    moviesGrid.className = 'movies-grid';
    
    // 渲染搜索结果
    searchResults.forEach((result, index) => {
        const movieCard = createMovieCard(result.movie, result.id, result.score);
        moviesGrid.appendChild(movieCard);
        
        // 添加动画效果
        setTimeout(() => {
            movieCard.style.opacity = '1';
            movieCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    searchContainer.appendChild(moviesGrid);
    
    // 显示成功通知
    showNotification(`找到 ${searchResults.length} 部相关电影`, 'success');
    
    // 设置搜索模式
    isSearchMode = true;
    
    // 自动滚动到搜索结果区域
    setTimeout(() => {
        scrollToSearchResults(searchContainer);
    }, 100); // 短暂延迟确保DOM完全渲染
}

/**
 * 创建电影卡片
 */
function createMovieCard(movie, movieId, score) {
    const card = document.createElement('div');
    card.className = 'movie-card search-result-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // 获取海报图片
    const posterImage = getPosterImage(movieId);
    
    card.innerHTML = `
        <div class="movie-poster" style="background-image: url('public/images/posters/${posterImage}');">
            <div class="poster-overlay">
                <span class="movie-title-overlay">${movie.title}</span>
                <div class="search-score">匹配度: ${score}</div>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${movie.year}</span>
                <span class="movie-category">${movie.category}</span>
                <div class="movie-rating">
                    <span class="rating-stars">★★★★★</span>
                    <span>${movie.rating}</span>
                </div>
            </div>
            <p class="movie-description">${movie.description}</p>
            <div class="movie-details">
                <p><strong>导演:</strong> ${movie.director}</p>
                <p><strong>主演:</strong> ${movie.cast}</p>
                <p><strong>类型:</strong> ${movie.genres}</p>
            </div>
            <div class="movie-actions">
                <button class="btn btn-primary" onclick="viewMovie('${movieId}')">查看详情</button>
                <button class="btn btn-secondary" onclick="addToFavorites('${movieId}')">收藏</button>
            </div>
        </div>
    `;
    
    return card;
}

/**
 * 获取电影海报图片
 */
function getPosterImage(movieId) {
    const posterMap = {
        1: 'action1.jpg', 2: 'action2.jpg', 3: 'action3.jpg', 4: 'action4.jpg', 5: 'action5.jpg',
        6: 'drama1.jpg', 7: 'drama2.jpg', 8: 'drama3.jpg',
        9: 'comedy1.jpg', 10: 'comedy2.jpg', 11: 'comedy3.jpg',
        12: 'scifi1.jpg', 13: 'scifi2.jpg', 14: 'scifi3.jpg',
        15: 'animation1.jpg', 16: 'animation2.jpg', 17: 'animation3.jpg',
        18: 'romance1.jpg', 19: 'romance2.jpg', 20: 'romance3.jpg'
    };
    
    return posterMap[movieId] || 'action1.jpg';
}

/**
 * 清空搜索
 */
function clearSearch() {
    const searchInput = document.getElementById('search-input');
    const searchContainer = document.getElementById('search-results');
    const categoriesSection = document.querySelector('.categories');
    
    // 清空搜索框
    if (searchInput) {
        searchInput.value = '';
    }
    
    // 移除搜索结果
    if (searchContainer) {
        searchContainer.remove();
    }
    
    // 显示分类展示区域
    if (categoriesSection) {
        categoriesSection.style.display = 'block';
    }
    
    // 重置搜索状态
    searchResults = [];
    isSearchMode = false;
    
    showNotification('已返回分类浏览', 'info');
}

/**
 * 显示搜索建议
 */
function showSearchSuggestions() {
    const suggestions = [
        '动作片', '剧情片', '喜剧片', '科幻片', '动画片', '爱情片',
        '汤姆·克鲁斯', '基里安·墨菲', '克里斯托弗·诺兰', '马丁·斯科塞斯',
        '2023', '美国', '动作', '惊悚', '冒险'
    ];
    
    // 这里可以显示搜索建议，比如下拉菜单
    console.log('搜索建议:', suggestions);
}

/**
 * 查看电影详情
 */
function viewMovie(movieId) {
    console.log('查看电影详情:', movieId);
    showNotification(`正在跳转到电影详情页面...`, 'info');
    
    setTimeout(() => {
        window.location.href = `movie-detail.html?id=${movieId}`;
    }, 1000);
}

/**
 * 添加到收藏
 */
function addToFavorites(movieId) {
    const movie = movieData[movieId];
    if (movie) {
        showNotification(`《${movie.title}》已添加到收藏夹`, 'success');
        console.log(`添加到收藏: ${movie.title}`);
        
        // 这里可以添加收藏逻辑，比如保存到localStorage
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (!favorites.includes(movieId)) {
            favorites.push(movieId);
            localStorage.setItem('favorites', JSON.stringify(favorites));
        }
    }
}

function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // 如果点击的是链接本身，让链接自然跳转
            if (e.target.tagName === 'A') {
                const categoryName = this.querySelector('h3').textContent;
                showNotification(`正在跳转到${categoryName}页面...`);
                return; // 让链接自然跳转
            }

            // 如果点击的是卡片其他区域，手动跳转
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            const categoryName = this.querySelector('h3').textContent;
            const categoryLink = this.querySelector('.category-link').href;

            console.log(`用户点击了分类: ${categoryName}`);
            showNotification(`正在跳转到${categoryName}页面...`);

            setTimeout(() => {
                console.log(`跳转到: ${categoryLink}`);
                window.location.href = categoryLink;
            }, 1000);
        });
    });
}

function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        // 监听滚动事件
        window.addEventListener('scroll', function () {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        // 点击返回顶部
        backToTopBtn.addEventListener('click', function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function initMusicPlayer() {
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const volumeSlider = document.getElementById('volume-slider');

    if (!musicToggle || !backgroundMusic) {
        console.log('音乐播放器元素未找到');
        return;
    }

    // 从本地存储获取音乐状态
    const isMusicEnabled = localStorage.getItem('musicEnabled') === 'true';
    const musicVolume = parseFloat(localStorage.getItem('musicVolume')) || 0.3;

    // 设置初始状态
    backgroundMusic.volume = musicVolume;
    if (volumeSlider) {
        volumeSlider.value = musicVolume;
    }

    if (isMusicEnabled) {
        backgroundMusic.play().catch(e => {
            console.log('自动播放被阻止:', e);
        });
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎵';
    } else {
        musicToggle.textContent = '🔇';
    }

    // 点击切换播放/暂停
    musicToggle.addEventListener('click', function () {
        if (backgroundMusic.paused) {
            backgroundMusic.play().then(() => {
                musicToggle.classList.add('playing');
                musicToggle.textContent = '🎵';
                localStorage.setItem('musicEnabled', 'true');
            }).catch(e => {
                console.log('播放失败:', e);
                showNotification('无法播放音乐，请检查浏览器设置', 'error');
            });
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.textContent = '🔇';
            localStorage.setItem('musicEnabled', 'false');
        }
    });

    // 音量控制
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function () {
            backgroundMusic.volume = this.value;
            localStorage.setItem('musicVolume', this.value);
        });
    }

    // 监听音乐播放状态
    backgroundMusic.addEventListener('play', function () {
        musicToggle.classList.add('playing');
        musicToggle.textContent = '🎵';
    });

    backgroundMusic.addEventListener('pause', function () {
        musicToggle.classList.remove('playing');
        musicToggle.textContent = '🔇';
    });

    // 监听音乐结束
    backgroundMusic.addEventListener('ended', function () {
        backgroundMusic.currentTime = 0;
        backgroundMusic.play();
    });

    // 音量变化监听
    backgroundMusic.addEventListener('volumechange', function () {
        localStorage.setItem('musicVolume', backgroundMusic.volume);
    });
}

function initPageAnimations() {
    // Hero区域动画
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';

        setTimeout(() => {
            hero.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }

    // 分类卡片动画
    const categoryGrid = document.querySelector('.category-grid');
    if (categoryGrid) {
        const cards = categoryGrid.querySelectorAll('.category-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 200 + (index * 100));
        });
    }
}

function initKeyboardShortcuts() {
    document.addEventListener('keydown', function (event) {
        // Ctrl/Cmd + K 打开搜索
        if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
            event.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
                showNotification('搜索框已激活');
            }
        }

        // ESC 键关闭通知
        if (event.key === 'Escape') {
            closeAllNotifications();
        }
    });
}

/**
 * 显示通知消息
 * @param {string} message - 通知消息内容
 * @param {string} type - 通知类型 (success, error, info)
 */
function showNotification(message, type = 'info') {
    // 关闭现有通知
    closeAllNotifications();

    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // 根据类型设置颜色
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        info: '#3498db'
    };
    notification.style.background = colors[type] || colors.info;

    // 添加到页面
    document.body.appendChild(notification);

    // 显示动画
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);

    // 自动消失
    setTimeout(() => {
        closeNotification(notification);
    }, 3000);
}

/**
 * 关闭单个通知
 * @param {HTMLElement} notification - 通知元素
 */
function closeNotification(notification) {
    if (notification && document.body.contains(notification)) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }
}

function closeAllNotifications() {
    const notifications = document.querySelectorAll('.notification');
    notifications.forEach(notification => {
        closeNotification(notification);
    });
}

/**
 * 初始化导航功能
 */
function initNavigation() {
    // 处理导航链接点击
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            // 如果是外部链接或特殊链接，不阻止默认行为
            if (this.href && !this.href.includes('#')) {
                // 添加点击动画
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 150);

                // 显示导航提示
                const linkText = this.textContent.trim();
                showNotification(`正在跳转到${linkText}...`, 'info');
            }
        });
    });

    // 处理Logo点击
    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('click', function (e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            showNotification('返回首页...', 'info');
        });
    }

    // 处理面包屑导航（如果存在）
    initBreadcrumb();

    // 处理页面间的前进后退
    initPageHistory();

    // 验证导航链接
    validateNavigation();
}

/**
 * 初始化面包屑导航
 */
function initBreadcrumb() {
    // 检查是否在分类页面
    const currentPage = getCurrentPageType();
    if (currentPage !== 'home') {
        addBreadcrumb(currentPage);
    }
}

/**
 * 获取当前页面类型
 */
function getCurrentPageType() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');

    if (filename === 'index' || filename === '') {
        return 'home';
    }

    return filename;
}

/**
 * 添加面包屑导航
 */
function addBreadcrumb(pageType) {
    const main = document.querySelector('.main');
    if (!main) return;

    const breadcrumb = document.createElement('nav');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.innerHTML = `
        <div class="breadcrumb-content">
            <a href="index.html" class="breadcrumb-link">首页</a>
            <span class="breadcrumb-separator">></span>
            <span class="breadcrumb-current">${getPageTitle(pageType)}</span>
        </div>
    `;

    // 在main的第一个子元素前插入面包屑
    main.insertBefore(breadcrumb, main.firstChild);

    // 添加面包屑样式
    addBreadcrumbStyles();
}

/**
 * 获取页面标题
 */
function getPageTitle(pageType) {
    const titles = {
        'action': '动作片',
        'drama': '剧情片',
        'comedy': '喜剧片',
        'sci-fi': '科幻片',
        'animation': '动画片',
        'romance': '爱情片'
    };

    return titles[pageType] || pageType;
}

/**
 * 添加面包屑样式
 */
function addBreadcrumbStyles() {
    if (document.getElementById('breadcrumb-styles')) return;

    const style = document.createElement('style');
    style.id = 'breadcrumb-styles';
    style.textContent = `
        .breadcrumb {
            background: #f8f9fa;
            padding: 1rem 0;
            margin-bottom: 2rem;
            border-radius: 5px;
        }
        
        .breadcrumb-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 0.9rem;
        }
        
        .breadcrumb-link {
            color: #3498db;
            text-decoration: none;
            transition: color 0.3s ease;
        }
        
        .breadcrumb-link:hover {
            color: #2980b9;
        }
        
        .breadcrumb-separator {
            color: #666;
        }
        
        .breadcrumb-current {
            color: #2c3e50;
            font-weight: 500;
        }
    `;

    document.head.appendChild(style);
}

/**
 * 初始化页面历史管理
 */
function initPageHistory() {
    // 监听浏览器前进后退
    window.addEventListener('popstate', function (e) {
        showNotification('页面已切换', 'info');
    });

    // 添加页面切换动画
    document.addEventListener('DOMContentLoaded', function () {
        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(20px)';

        setTimeout(() => {
            document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        }, 100);
    });
}

/**
 * 增强的页面跳转函数
 */
function navigateToPage(url, title = '') {
    // 添加页面切换动画
    document.body.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(-20px)';

    setTimeout(() => {
        window.location.href = url;
    }, 300);
}

/**
 * 检查链接有效性
 */
function validateNavigation() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // 只对导航栏链接显示跳转提示，不阻止任何跳转
            if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                const linkText = this.textContent.trim();
                if (linkText && !linkText.includes('查看详情') && this.closest('.nav-links')) {
                    showNotification(`正在跳转到${linkText}...`, 'info');
                }
            }
        });
    });
}

/**
 * 检查页面是否有效
 */
function isValidPage(href) {
    const validPages = [
        'index.html',
        'action.html',
        'drama.html',
        'comedy.html',
        'sci-fi.html',
        'animation.html',
        'romance.html'
    ];

    return validPages.includes(href);
}

/**
 * 自动滚动到搜索结果区域
 */
function scrollToSearchResults(searchContainer) {
    if (searchContainer) {
        // 计算搜索结果区域的位置
        const containerRect = searchContainer.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const targetPosition = scrollTop + containerRect.top - 120; // 减去120px的偏移，让标题更清晰可见
        
        // 显示滚动指示器
        showScrollIndicator();
        
        // 平滑滚动到搜索结果区域
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // 滚动完成后添加高亮效果
        setTimeout(() => {
            highlightSearchResults(searchContainer);
            hideScrollIndicator();
        }, 800); // 等待滚动完成
    }
}

/**
 * 显示滚动指示器
 */
function showScrollIndicator() {
    // 创建滚动指示器
    let indicator = document.getElementById('scroll-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'scroll-indicator';
        indicator.innerHTML = `
            <div class="scroll-indicator-content">
                <span class="scroll-icon">↓</span>
                <span class="scroll-text">正在跳转到搜索结果...</span>
            </div>
        `;
        document.body.appendChild(indicator);
    }
    
    // 显示指示器
    indicator.style.display = 'block';
    setTimeout(() => {
        indicator.style.opacity = '1';
        indicator.style.transform = 'translateY(0)';
    }, 100);
}

/**
 * 隐藏滚动指示器
 */
function hideScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (indicator) {
        indicator.style.opacity = '0';
        indicator.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            indicator.style.display = 'none';
        }, 300);
    }
}

/**
 * 高亮搜索结果区域
 */
function highlightSearchResults(searchContainer) {
    // 添加高亮类
    searchContainer.classList.add('highlighted');
    
    // 添加高亮动画效果
    searchContainer.style.animation = 'searchHighlight 2s ease';
    
    // 2秒后移除动画和高亮类
    setTimeout(() => {
        searchContainer.style.animation = '';
        searchContainer.classList.remove('highlighted');
    }, 2000);
}

window.MovieWebsite = {
    showNotification,
    closeAllNotifications,
    navigateToPage,
    validateNavigation
};
