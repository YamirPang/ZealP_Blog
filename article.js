document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const articleTitle = decodeURIComponent(urlParams.get('title') || '');
    const articleDate = decodeURIComponent(urlParams.get('date') || '');

    if (!articleId) {
        showError('未找到文章ID');
        return;
    }

    try {
        // 更新页面标题和文章标题
        document.title = `${articleTitle} - Yamir.Pang`;
        document.querySelector('.article-header h1').textContent = articleTitle;

        // 格式化并显示日期
        if (articleDate) {
            const formattedDate = new Date(articleDate).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-');
            document.querySelector('.article-date').textContent = formattedDate;
        }

        // 加载文章内容
        const mdResponse = await fetch(`./article/files/${articleId}.md`);
        if (!mdResponse.ok) {
            throw new Error('文章内容加载失败');
        }
        const markdown = await mdResponse.text();

        // 处理 Markdown 中的图片路径
        const processedMarkdown = markdown.replace(
            /!\[(.*?)\]\((.*?)\)/g,
            (match, alt, src) => {
                // 如果是相对路径，添加基础路径
                if (!src.startsWith('http') && !src.startsWith('/')) {
                    return `![${alt}](../article/files/${src})`;
                }
                return match;
            }
        );

        // 渲染处理后的 Markdown 内容
        document.getElementById('article-content').innerHTML = marked.parse(processedMarkdown);

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
