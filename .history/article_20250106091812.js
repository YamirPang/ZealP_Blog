document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        showError('未找到文章ID');
        return;
    }

    // 加载文章元数据
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/article/records.json', true);
    
    xhr.onload = function() {
        if (xhr.status === 200) {
            try {
                const articles = JSON.parse(xhr.responseText);
                const article = articles.find(a => a.id === articleId);

                if (!article) {
                    showError('未找到文章');
                    return;
                }

                // 更新页面信息
                document.title = `${article.title} - Yamir.Pang`;
                document.getElementById('article-title').textContent = article.title;
                document.getElementById('article-date').textContent = new Date(article.date)
                    .toLocaleDateString('zh-CN', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit'
                    }).replace(/\//g, '-');
                document.getElementById('article-tags').innerHTML = article.tags
                    .map(tag => `<span class="article-tag">${tag}</span>`)
                    .join('');

                // 加载文章内容
                loadArticleContent(articleId);
            } catch (error) {
                console.error('解析文章数据失败:', error);
                showError('加载文章失败，请稍后重试');
            }
        } else {
            showError('加载文章失败，请稍后重试');
        }
    };

    xhr.onerror = function() {
        showError('加载文章失败，请稍后重试');
    };

    xhr.send();
});

function loadArticleContent(articleId) {
    const contentXhr = new XMLHttpRequest();
    contentXhr.open('GET', `/article/files/${articleId}.md`, true);

    contentXhr.onload = function() {
        if (contentXhr.status === 200) {
            document.getElementById('article-content').innerHTML = marked(contentXhr.responseText);
        } else {
            showError('加载文章内容失败');
        }
    };

    contentXhr.onerror = function() {
        showError('加载文章内容失败');
    };

    contentXhr.send();
}

function showError(message) {
    document.getElementById('article-content').innerHTML = `
        <div class="error-message">${message}</div>
    `;
}

// 移动端菜单
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
    document.querySelector('.nav-overlay').classList.toggle('active');
    this.classList.toggle('active');
}); 