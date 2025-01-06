document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    if (!articleId) {
        showError('未找到文章ID');
        return;
    }

    try {
        // 加载文章内容
        const mdResponse = await fetch(`../article/files/${articleId}.md`);
        if (!mdResponse.ok) {
            throw new Error('文章内容加载失败');
        }
        const markdown = await mdResponse.text();
        
        // 提取第一个标题作为文章标题
        const titleMatch = markdown.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : '未命名文章';
        
        // 更新页面标题
        document.title = `${title} - Yamir.Pang`;
        
        // 渲染 Markdown 内容
        document.getElementById('article-content').innerHTML = marked.parse(markdown);

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