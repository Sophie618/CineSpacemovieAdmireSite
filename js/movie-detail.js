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
    loadMovieData();
});

// 从JSON文件加载电影数据
async function loadMovieData() {
    try {
        const response = await fetch('data/movies.json');
        const data = await response.json();
        movieData = data.movies;

        // 获取URL参数中的电影ID
        const urlParams = new URLSearchParams(window.location.search);
        const movieId = urlParams.get('id');

        if (movieId && movieData[movieId]) {
            currentMovie = movieData[movieId];
            loadMovieDetails(movieId);
            loadRelatedMovies(movieId);
        } else {
            // 如果没有找到电影ID，重定向到首页
            window.location.href = 'index.html';
        }
    } catch (error) {
        console.error('加载电影数据失败:', error);
        alert('加载电影数据失败，请刷新页面重试');
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

    // 加载海报展示
    loadMovieGallery(movie);
}

// 加载电影海报展示
function loadMovieGallery(movie) {
    currentGallery = movie.gallery || [movie.poster];
    currentImageIndex = 0;

    // 设置主图片
    const mainImage = document.getElementById('main-gallery-image');
    mainImage.src = `public/images/posters/${currentGallery[0]}`;
    mainImage.alt = movie.title;

    // 生成缩略图
    const thumbnailsContainer = document.getElementById('gallery-thumbnails');
    thumbnailsContainer.innerHTML = '';

    currentGallery.forEach((image, index) => {
        const thumbnail = document.createElement('div');
        thumbnail.className = 'gallery-thumbnail';
        if (index === 0) thumbnail.classList.add('active');

        thumbnail.innerHTML = `
            <img src="public/images/posters/${image}" alt="${movie.title} 海报 ${index + 1}" 
                 onclick="selectThumbnail(${index})">
        `;

        thumbnailsContainer.appendChild(thumbnail);
    });
}

// 选择缩略图
function selectThumbnail(index) {
    currentImageIndex = index;

    // 更新主图片
    const mainImage = document.getElementById('main-gallery-image');
    mainImage.src = `public/images/posters/${currentGallery[index]}`;

    // 更新缩略图激活状态
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
    });
}

// 打开图片查看模态框
function openGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');

    modalImage.src = `public/images/posters/${currentGallery[currentImageIndex]}`;
    modal.style.display = 'block';

    // 阻止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭图片查看模态框
function closeGalleryModal() {
    const modal = document.getElementById('gallery-modal');
    modal.style.display = 'none';

    // 恢复背景滚动
    document.body.style.overflow = 'auto';
}

// 上一张图片
function previousImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : currentGallery.length - 1;
    updateModalImage();
    updateThumbnailSelection();
}

// 下一张图片
function nextImage() {
    currentImageIndex = currentImageIndex < currentGallery.length - 1 ? currentImageIndex + 1 : 0;
    updateModalImage();
    updateThumbnailSelection();
}

// 更新模态框图片
function updateModalImage() {
    const modalImage = document.getElementById('modal-image');
    modalImage.src = `public/images/posters/${currentGallery[currentImageIndex]}`;
}

// 更新缩略图选择状态
function updateThumbnailSelection() {
    const thumbnails = document.querySelectorAll('.gallery-thumbnail');
    thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === currentImageIndex);
    });
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

document.addEventListener('keydown', function (e) {
    const modal = document.getElementById('gallery-modal');
    if (modal.style.display === 'block') {
        switch (e.key) {
            case 'Escape':
                closeGalleryModal();
                break;
            case 'ArrowLeft':
                previousImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
        }
    }
});

document.getElementById('gallery-modal').addEventListener('click', function (e) {
    if (e.target === this) {
        closeGalleryModal();
    }
});