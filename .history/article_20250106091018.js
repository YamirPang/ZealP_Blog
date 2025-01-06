document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        showError('未找到文章ID');
        return;
    }

    try {
        // 加载文章元数据
        const response = await fetch('/article/records.json');
        const articles = await response.json();
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
        const contentResponse = await fetch(`/article/files/${articleId}.md`);
        if (!contentResponse.ok) {
            throw new Error('文章内容加载失败');
        }
        const markdown = await contentResponse.text();
        document.getElementById('article-content').innerHTML = marked(markdown);

    } catch (error) {
        console.error('加载文章失败:', error);
        showError('加载文章失败，请稍后重试');
    }
});

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