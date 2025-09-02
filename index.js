
document.addEventListener('DOMContentLoaded', function () {
    console.log('🎬 CineSpace已加载完成！');

    initCategoryCards();
    initSearchFunction();
    initBackToTop();
    initPageAnimations();
    initKeyboardShortcuts();
    initNavigation();
});

function initCategoryCards() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function (e) {
            // 如果点击的是链接本身，不阻止默认行为
            if (e.target.tagName === 'A') {
                return;
            }

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
                window.location.href = categoryLink; // 启用真实跳转
            }, 1000);
        });
    });
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
    }
}

function handleSearch() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim();

    if (searchTerm) {
        showNotification(`正在搜索: "${searchTerm}"`);
        console.log(`搜索关键词: ${searchTerm}`);

        // 模拟搜索延迟
        setTimeout(() => {
            showNotification(`找到 ${Math.floor(Math.random() * 50) + 10} 部相关电影`);
        }, 1500);
    } else {
        showNotification('请输入搜索关键词');
        searchInput.focus();
    }
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

            // 检查是否是有效的内部链接
            if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                // 检查文件是否存在（简单检查）
                if (href.includes('.html') && !isValidPage(href)) {
                    e.preventDefault();
                    showNotification('页面不存在或正在开发中', 'error');
                    console.warn(`页面不存在: ${href}`);
                } else {
                    // 如果是有效页面，显示跳转提示
                    const linkText = this.textContent.trim();
                    if (linkText && !linkText.includes('查看详情')) {
                        showNotification(`正在跳转到${linkText}...`, 'info');
                    }
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

window.MovieWebsite = {
    showNotification,
    closeAllNotifications,
    navigateToPage,
    validateNavigation
};
