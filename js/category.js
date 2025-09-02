/**
 * 分类页面JavaScript功能
 * 处理电影列表、筛选、分页等功能
 */

// 全局变量
let movieData = {};
let currentPage = 1;
let currentFilter = 'all';
let currentCategory = '';
let moviesPerPage = 6;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function () {
    // 获取当前分类
    currentCategory = getCurrentCategory();

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
        showErrorState();
    }
}

/**
 * 获取当前分类
 */
function getCurrentCategory() {
    const path = window.location.pathname;
    const filename = path.split('/').pop().replace('.html', '');

    // 处理特殊文件名
    if (filename === 'sci-fi') return 'sci-fi';
    return filename;
}

/**
 * 获取电影海报图片
 */
function getPosterImage(movieId) {
    const posterMap = {
        1: 'action1.svg',
        2: 'action1.svg',
        3: 'action1.svg',
        4: 'action1.svg',
        5: 'action1.svg',
        6: 'drama1.svg',
        7: 'drama1.svg',
        8: 'drama1.svg',
        9: 'comedy1.svg',
        10: 'comedy1.svg',
        11: 'action1.svg',
        12: 'action1.svg',
        13: 'comedy1.svg',
        14: 'comedy1.svg',
        15: 'drama1.svg',
        16: 'drama1.svg'
    };

    return posterMap[movieId] || 'action1.svg';
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

    if (movies.length === 0) {
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

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" data-movie-id="${movie.id}">
            <div class="movie-poster" style="background-image: url('public/images/posters/${getPosterImage(movie.id)}'); background-size: cover; background-position: center;">
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
                    <button class="btn btn-primary" onclick="viewMovie(${movie.id})">查看详情</button>
                    <button class="btn btn-secondary" onclick="addToFavorites(${movie.id})">收藏</button>
                </div>
            </div>
        </div>
    `).join('');

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
    window.location.href = `movie-detail.html?id=${movieId}`;
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

    moviesGrid.innerHTML = movies.map(movie => `
        <div class="movie-card" data-movie-id="${movie.id}" onclick="handleMovieCardClick(${movie.id})">
            <div class="movie-poster">
                <span>${movie.title}</span>
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
                    <button class="btn btn-primary" onclick="event.stopPropagation(); viewMovie(${movie.id})">查看详情</button>
                    <button class="btn btn-secondary" onclick="event.stopPropagation(); addToFavorites(${movie.id})">收藏</button>
                </div>
            </div>
        </div>
    `).join('');

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

// 导出函数供其他脚本使用
window.CategoryPage = {
    viewMovie,
    addToFavorites,
    resetFilters,
    handleMovieCardClick,
    renderMoviesWithNavigation
};