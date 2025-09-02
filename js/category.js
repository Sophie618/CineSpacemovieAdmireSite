/**
 * 分类页面JavaScript功能
 * 处理电影列表、筛选、分页等功能
 */

// 立即执行的测试代码
console.log('category.js 文件已加载');

// 全局变量
let movieData = {};
let currentPage = 1;
let currentFilter = 'all';
let currentCategory = '';
let moviesPerPage = 6;

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

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM已加载完成');

    // 获取当前分类
    currentCategory = getCurrentCategory();
    console.log('当前分类:', currentCategory);
    console.log('当前URL:', window.location.href);

    // 检查必要的DOM元素
    const moviesGrid = document.getElementById('movies-grid');
    console.log('movies-grid元素:', moviesGrid);

    // 初始化面包屑导航
    initBreadcrumb();

    // 加载电影数据
    loadMovieData();
});

// 从JSON文件加载电影数据
async function loadMovieData() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        movieData = data.movies;

        // 初始化页面
        initCategoryPage();
        initFilters();
        initPagination();
        initSearch();
        initCategoryNavigation();
    } catch (error) {
        console.error('加载电影数据失败:', error);
        console.log('错误详情:', error);
        showErrorState();
    }
}

/**
 * 获取当前分类
 */
function getCurrentCategory() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');

    // 处理GitHub Pages路径
    if (filename === '' || filename === 'CineSpacemovieAdmireSite') {
        return 'action'; // 默认分类
    }

    // 处理特殊文件名
    if (filename === 'sci-fi') return 'sci-fi';
    return filename;
}

/**
 * 获取电影海报图片
 */
function getPosterImage(movieId) {
    const posterMap = {
        1: 'action1.jpg',
        2: 'action2.jpg',
        3: 'action3.jpg',
        4: 'action4.jpg',
        5: 'action5.jpg',
        6: 'drama1.jpg',
        7: 'drama2.jpg',
        8: 'drama3.jpg',
        9: 'comedy1.jpg',
        10: 'comedy2.jpg',
        11: 'comedy3.jpg',
        12: 'scifi1.jpg',
        13: 'scifi2.jpg',
        14: 'scifi3.jpg',
        15: 'animation1.jpg',
        16: 'animation2.jpg',
        17: 'animation3.jpg',
        18: 'romance1.jpg',
        19: 'romance2.jpg',
        20: 'romance3.jpg'
    };

    return posterMap[movieId] || 'action1.jpg';
}

/**
 * 初始化分类页面
 */
function initCategoryPage() {
    showLoading();

    setTimeout(() => {
        loadMovies();
        hideLoading();
    }, 500);
}

/**
 * 显示加载状态
 */
function showLoading() {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = '<div class="loading">正在加载电影...</div>';
}

/**
 * 显示错误状态
 */
function showErrorState() {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = `
        <div class="empty-state">
            <h3>加载失败</h3>
            <p>无法加载电影数据，请刷新页面重试。</p>
            <button class="btn btn-primary" onclick="location.reload()">刷新页面</button>
        </div>
    `;
}

/**
 * 隐藏加载状态
 */
function hideLoading() {
    // 加载状态会在loadMovies中被替换
}

/**
 * 加载电影列表
 */
function loadMovies() {
    const moviesGrid = document.getElementById('movies-grid');

    // 根据分类获取电影数据
    const movies = getMoviesByCategory(currentCategory);

    console.log('当前分类:', currentCategory);
    console.log('电影数量:', movies.length);

    if (movies.length === 0) {
        console.log('没有找到电影，显示空状态');
        showEmptyState();
        return;
    }

    let filteredMovies = applyFilter(movies);

    const paginatedMovies = applyPagination(filteredMovies);

    renderMovies(paginatedMovies);

    updatePagination(filteredMovies.length);
}

/**
 * 根据分类获取电影数据
 */
function getMoviesByCategory(category) {
    const categoryMap = {
        'action': '动作片',
        'drama': '剧情片',
        'comedy': '喜剧片',
        'sci-fi': '科幻片',
        'animation': '动画片',
        'romance': '爱情片'
    };

    const categoryName = categoryMap[category];
    if (!categoryName) return [];

    return Object.values(movieData).filter(movie => movie.category === categoryName);
}

/**
 * 应用筛选
 */
function applyFilter(movies) {
    switch (currentFilter) {
        case 'recent':
            return movies.filter(movie => movie.year >= 2023);
        case 'popular':
            return movies.filter(movie => movie.rating >= 8.5);
        case 'rating':
            return movies.sort((a, b) => b.rating - a.rating);
        default:
            return movies;
    }
}

/**
 * 应用分页
 */
function applyPagination(movies) {
    const startIndex = (currentPage - 1) * moviesPerPage;
    const endIndex = startIndex + moviesPerPage;
    return movies.slice(startIndex, endIndex);
}

/**
 * 渲染电影卡片
 */
function renderMovies(movies) {
    const moviesGrid = document.getElementById('movies-grid');

    if (movies.length === 0) {
        showEmptyState();
        return;
    }

    moviesGrid.innerHTML = movies.map((movie, index) => {
        // 从movieData中找到对应的ID
        const movieId = Object.keys(movieData).find(id => movieData[id] === movie);
        return `
        <div class="movie-card" data-movie-id="${movieId}">
            <div class="movie-poster" style="background-image: url('public/images/posters/${getPosterImage(movieId)}'); background-size: cover; background-position: center;">
                <div class="poster-overlay">
                    <span class="movie-title-overlay">${movie.title}</span>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year}</span>
                    <div class="movie-rating">
                        <span class="rating-stars">★★★★★</span>
                        <span>${movie.rating}</span>
                    </div>
                </div>
                <p class="movie-description">${movie.description}</p>
                <div class="movie-actions">
                    <button class="btn btn-primary" onclick="viewMovie('${movieId}')">查看详情</button>
                    <button class="btn btn-secondary" onclick="addToFavorites('${movieId}')">收藏</button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    animateMovieCards();
}

/**
 * 显示空状态
 */
function showEmptyState() {
    const moviesGrid = document.getElementById('movies-grid');
    moviesGrid.innerHTML = `
        <div class="empty-state">
            <h3>暂无电影</h3>
            <p>当前筛选条件下没有找到电影，请尝试其他筛选条件。</p>
            <button class="btn btn-primary" onclick="resetFilters()">重置筛选</button>
        </div>
    `;
}

/**
 * 显示电影卡片
 */
function animateMovieCards() {
    const cards = document.querySelectorAll('.movie-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

/**
 * 初始化筛选功能
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            filterButtons.forEach(btn => btn.classList.remove('active'));

            this.classList.add('active');

            currentFilter = this.dataset.filter;
            currentPage = 1;

            loadMovies();
        });
    });
}

/**
 * 初始化分页功能
 */
function initPagination() {
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            if (currentPage > 1) {
                currentPage--;
                loadMovies();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            const movies = getMoviesByCategory(currentCategory);
            const totalPages = Math.ceil(movies.length / moviesPerPage);

            if (currentPage < totalPages) {
                currentPage++;
                loadMovies();
            }
        });
    }
}

/**
 * 更新分页信息
 */
function updatePagination(totalMovies) {
    const totalPages = Math.ceil(totalMovies / moviesPerPage);
    const currentPageEl = document.getElementById('current-page');
    const totalPagesEl = document.getElementById('total-pages');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    if (currentPageEl) currentPageEl.textContent = currentPage;
    if (totalPagesEl) totalPagesEl.textContent = totalPages;

    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }

    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages;
    }
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                handleSearch();
            }
        });
    }
}

/**
 * 处理搜索
 */
function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();

    if (!searchTerm) {
        showNotification('请输入搜索关键词', 'info');
        return;
    }

    const movies = getMoviesByCategory(currentCategory);
    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm) ||
        movie.description.toLowerCase().includes(searchTerm)
    );

    if (filteredMovies.length === 0) {
        showNotification(`没有找到包含"${searchTerm}"的电影`, 'info');
        return;
    }

    renderMovies(filteredMovies);
    showNotification(`找到 ${filteredMovies.length} 部相关电影`, 'success');
}

/**
 * 查看电影详情
 */
function viewMovie(movieId) {
    console.log('viewMovie被调用，movieId:', movieId);
    console.log('movieId类型:', typeof movieId);
    console.log('即将跳转到:', `movie-detail.html?id=${movieId}`);
    showNotification(`正在跳转到电影详情页面...`, 'info');

    setTimeout(() => {
        console.log('开始跳转到电影详情页面');
        window.location.href = `movie-detail.html?id=${movieId}`;
    }, 1000);
}

/**
 * 添加到收藏
 */
function addToFavorites(movieId) {
    showNotification('已添加到收藏夹', 'success');
    console.log(`添加到收藏: ${movieId}`);
}

/**
 * 重置筛选
 */
function resetFilters() {
    currentFilter = 'all';
    currentPage = 1;

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');

    loadMovies();
}

/**
 * 初始化分类页面导航功能
 */
function initCategoryNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);

            const linkText = this.textContent.trim();
            if (window.MovieWebsite && window.MovieWebsite.showNotification) {
                window.MovieWebsite.showNotification(`正在跳转到${linkText}...`, 'info');
            }
        });
    });

    const logo = document.querySelector('.logo a');
    if (logo) {
        logo.addEventListener('click', function (e) {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            if (window.MovieWebsite && window.MovieWebsite.showNotification) {
                window.MovieWebsite.showNotification('返回首页...', 'info');
            }
        });
    }

    initMovieCardNavigation();

    initPageTransition();
}

/**
 * 初始化电影卡片导航
 */
function initMovieCardNavigation() {
    // 这个功能会在renderMovies函数中调用
    // 为每个电影卡片添加点击事件
}

/**
 * 初始化页面切换动画
 */
function initPageTransition() {
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';

    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
}

/**
 * 增强的电影卡片渲染（添加导航功能）
 * 
 */
function renderMoviesWithNavigation(movies) {
    const moviesGrid = document.getElementById('movies-grid');

    if (movies.length === 0) {
        showEmptyState();
        return;
    }

    moviesGrid.innerHTML = movies.map(movie => {
        // 从movieData中找到对应的ID
        const movieId = Object.keys(movieData).find(id => movieData[id] === movie);
        return `
        <div class="movie-card" data-movie-id="${movieId}" onclick="handleMovieCardClick('${movieId}')">
            <div class="movie-poster" style="background-image: url('public/images/posters/${getPosterImage(movieId)}'); background-size: cover; background-position: center;">
                <div class="poster-overlay">
                    <span class="movie-title-overlay">${movie.title}</span>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${movie.year}</span>
                    <div class="movie-rating">
                        <span class="rating-stars">★★★★★</span>
                        <span>${movie.rating}</span>
                    </div>
                </div>
                <p class="movie-description">${movie.description}</p>
                <div class="movie-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewMovie('${movieId}')">查看详情</button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); addToFavorites('${movieId}')">收藏</button>
                </div>
            </div>
        </div>
        `;
    }).join('');

    animateMovieCards();
}

/**
 * 处理电影卡片点击
 */
function handleMovieCardClick(movieId) {
    const movies = getMoviesByCategory(currentCategory);
    const movie = movies.find(m => m.id === movieId);

    if (movie) {
        if (window.MovieWebsite && window.MovieWebsite.showNotification) {
            window.MovieWebsite.showNotification(`正在查看《${movie.title}》详情...`, 'info');
        }

        setTimeout(() => {
            console.log(`跳转到电影详情页: ${movie.title}`);
        }, 1000);
    }
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
 * 初始化回到顶部功能
 */
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

/**
 * 初始化音乐播放器
 */
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

// 页面加载完成后初始化功能
document.addEventListener('DOMContentLoaded', function () {
    initBackToTop();
    initMusicPlayer();
});

// 导出函数供其他脚本使用
window.CategoryPage = {
    viewMovie,
    addToFavorites,
    resetFilters,
    handleMovieCardClick,
    renderMoviesWithNavigation,
    initBreadcrumb,
    addBreadcrumb,
    initBackToTop,
    initMusicPlayer
};