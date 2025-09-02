/**
 * 电影详情页面JavaScript功能
 */

// 全局变量
let movieData = {};
let currentMovie = null;
let currentImageIndex = 0;
let currentGallery = [];

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function () {
    console.log('movie-detail.js 已加载');
    console.log('当前URL:', window.location.href);
    loadMovieData();
});

// 从JSON文件加载电影数据
async function loadMovieData() {
    try {
        console.log('开始加载电影数据...');
        const response = await fetch('./data/movies.json');
        console.log('响应状态:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP错误: ${response.status}`);
        }

        const data = await response.json();
        console.log('原始数据:', data);
        movieData = data.movies;
        console.log('电影数据:', movieData);

        // 获取URL参数中的电影ID
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        console.log('URL参数:', window.location.search);
        console.log('电影ID:', movieId);
        console.log('可用的电影ID:', Object.keys(movieData));

        if (movieId && movieData[movieId]) {
            console.log('找到电影:', movieData[movieId]);
            currentMovie = movieData[movieId];
            loadMovieDetails(movieId);
            loadRelatedMovies(movieId);
        } else {
            console.log('未找到电影ID或电影数据，重定向到首页');
            console.log('movieId存在:', !!movieId);
            console.log('movieData存在:', !!movieData);
            console.log('movieData[movieId]存在:', !!(movieId && movieData[movieId]));
            // 如果没有找到电影ID，重定向到首页
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('加载电影数据失败:', error);
        // 静默处理错误，重定向到首页
        window.location.href = 'index.html';
    }
}

// 加载电影详情
function loadMovieDetails(movieId) {
    const movie = movieData[movieId];

    // 更新页面标题
    document.getElementById('page-title').textContent = `${movie.title} - CineSpace`;
    document.getElementById('movie-title').textContent = movie.title;
    document.getElementById('movie-title-breadcrumb').textContent = movie.title;

    // 更新电影信息
    document.getElementById('movie-year').textContent = movie.year;
    document.getElementById('movie-rating').textContent = movie.rating;
    document.getElementById('movie-category').textContent = movie.category;
    document.getElementById('movie-description').textContent = movie.description;

    // 更新详细信息
    document.getElementById('director').textContent = movie.director;
    document.getElementById('cast').textContent = movie.cast;
    document.getElementById('genres').textContent = movie.genres;
    document.getElementById('duration').textContent = movie.duration;
    document.getElementById('release-date').textContent = movie.releaseDate;
    document.getElementById('country').textContent = movie.country;
    document.getElementById('plot-content').textContent = movie.plot;

    // 更新主海报
    const mainPoster = document.getElementById('movie-poster');
    mainPoster.src = `public/images/posters/${movie.poster}`;
    mainPoster.alt = movie.title;

    // 更新分类链接
    const categoryMap = {
        '动作片': 'action.html',
        '剧情片': 'drama.html',
        '喜剧片': 'comedy.html',
        '科幻片': 'sci-fi.html',
        '动画片': 'animation.html',
        '爱情片': 'romance.html'
    };
    document.getElementById('category-link').href = categoryMap[movie.category] || 'index.html';
    document.getElementById('category-link').textContent = movie.category;

    // 海报展示已简化，只需要主海报
    // loadMovieGallery(movie); // 已移除多张海报功能
}

// 加载电影海报展示（已移除，现在用于视频区域）
function loadMovieGallery(movie) {
    // 海报画廊功能已移除，现在显示视频区域
    console.log('海报画廊功能已移除，电影:', movie.title);
    // 不再需要加载海报，因为我们已经改为视频区域
}

// 选择缩略图（已移除）
function selectThumbnail(index) {
    // 缩略图功能已移除
    console.log('缩略图功能已移除');
}

// 打开图片查看模态框（已移除）
function openGalleryModal() {
    // 图片模态框功能已移除
    console.log('图片模态框功能已移除');
}

// 关闭图片查看模态框（已移除）
function closeGalleryModal() {
    // 图片模态框功能已移除
    console.log('图片模态框功能已移除');
}

// 上一张图片（已移除）
function previousImage() {
    // 图片导航功能已移除
    console.log('图片导航功能已移除');
}

// 下一张图片（已移除）
function nextImage() {
    // 图片导航功能已移除
    console.log('图片导航功能已移除');
}

// 更新模态框图片（已移除）
function updateModalImage() {
    // 模态框图片功能已移除
    console.log('模态框图片功能已移除');
}

// 更新缩略图选择状态（已移除）
function updateThumbnailSelection() {
    // 缩略图选择功能已移除
    console.log('缩略图选择功能已移除');
}

// 加载相关电影
function loadRelatedMovies(movieId) {
    const currentMovie = movieData[movieId];
    const relatedMovies = [];

    // 找到同类型的其他电影
    Object.keys(movieData).forEach(id => {
        if (parseInt(id) !== parseInt(movieId) && movieData[id].category === currentMovie.category) {
            relatedMovies.push({ id: parseInt(id), ...movieData[id] });
        }
    });

    // 限制显示数量
    const displayMovies = relatedMovies.slice(0, 4);

    const relatedGrid = document.getElementById('related-movies');
    relatedGrid.innerHTML = '';

    displayMovies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'related-movie-card';
        movieCard.onclick = () => window.location.href = `movie-detail.html?id=${movie.id}`;

        movieCard.innerHTML = `
            <img src="public/images/posters/${movie.poster}" alt="${movie.title}" class="related-movie-poster">
            <div class="related-movie-info">
                <h3 class="related-movie-title">${movie.title}</h3>
                <div class="related-movie-meta">
                    <span class="year">${movie.year}</span>
                    <span class="rating">${movie.rating}</span>
                </div>
            </div>
        `;

        relatedGrid.appendChild(movieCard);
    });
}

// 添加到收藏
function addToFavorites() {
    const movieId = new URLSearchParams(window.location.search).get('id');
    const movie = movieData[movieId];

    alert(`已将《${movie.title}》添加到收藏夹`);
}

function shareMovie() {
    const movieId = new URLSearchParams(window.location.search).get('id');
    const movie = movieData[movieId];
    const shareUrl = window.location.href;

    if (navigator.share) {
        navigator.share({
            title: movie.title,
            text: movie.description,
            url: shareUrl
        });
    } else {
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('链接已复制到剪贴板');
        });
    }
}

// 图片模态框键盘事件已移除
// document.addEventListener('keydown', function (e) {
//     const modal = document.getElementById('gallery-modal');
//     if (modal && modal.style.display === 'block') {
//         switch (e.key) {
//             case 'Escape':
//                 closeGalleryModal();
//                 break;
//             case 'ArrowLeft':
//                 previousImage();
//                 break;
//             case 'ArrowRight':
//                 nextImage();
//                 break;
//         }
//     }
// });

// 图片模态框事件监听器已移除
// document.getElementById('gallery-modal').addEventListener('click', function (e) {
//     if (e.target === this) {
//         closeGalleryModal();
//     }
// });

// 视频相关函数
function openVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';

    // 停止视频播放
    const videoPlayer = modal.querySelector('video');
    if (videoPlayer) {
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
    }
}

// 键盘事件处理（视频模态框）
document.addEventListener('keydown', function (e) {
    const videoModal = document.getElementById('video-modal');
    if (videoModal.style.display === 'flex') {
        switch (e.key) {
            case 'Escape':
                closeVideoModal();
                break;
        }
    }
});

// 点击模态框外部关闭
document.addEventListener('DOMContentLoaded', function () {
    const videoModal = document.getElementById('video-modal');
    if (videoModal) {
        videoModal.addEventListener('click', function (e) {
            if (e.target === this) {
                closeVideoModal();
            }
        });
    }

    // 初始化回到顶部和音乐控制功能
    initBackToTop();
    initMusicPlayer();
});

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
                alert('无法播放音乐，请检查浏览器设置');
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