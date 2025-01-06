// Markdown 渲染配置
marked.setOptions({
    renderer: new marked.Renderer(),
    highlight: function(code, lang) {
        if (Prism && lang) {
            try {
                return Prism.highlight(code, Prism.languages[lang], lang);
            } catch (e) {
                return code;
            }
        }
        return code;
    },
    pedantic: false,
    gfm: true,
    breaks: false,
    sanitize: false,
    smartypants: false,
    xhtml: false
});

document.addEventListener('DOMContentLoaded', async function() {
    // 获取文章ID
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

        // 更新页面标题
        document.title = `${article.title} - Yamir.Pang`;

        // 更新文章头部信息
        document.getElementById('article-title').textContent = article.title;
        document.getElementById('article-date').textContent = new Date(article.date)
            .toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }).replace(/\//g, '-');

        // 更新标签
        document.getElementById('article-tags').innerHTML = article.tags
            .map(tag => `<span class="article-tag">${tag}</span>`)
            .join('');

        // 加载文章内容
        const contentResponse = await fetch(`/article/files/${articleId}.md`);
        if (!contentResponse.ok) {
            throw new Error('文章内容加载失败');
        }
        const markdown = await contentResponse.text();
        
        // 配置 marked 选项
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            highlight: function(code, lang) {
                return code;
            }
        });

        // 渲染 Markdown 内容
        document.getElementById('article-content').innerHTML = marked(markdown);

    } catch (error) {
        console.error('加载文章失败:', error);
        showError('加载文章失败，请稍后重试');
    }
});

// 显示错误信息
function showError(message) {
    document.getElementById('article-content').innerHTML = `
        <div class="error-message">${message}</div>
    `;
}

// 移动端菜单切换
document.querySelector('.menu-toggle').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.toggle('active');
    document.querySelector('.nav-overlay').classList.toggle('active');
    this.classList.toggle('active');
});

document.querySelector('.nav-overlay').addEventListener('click', function() {
    document.querySelector('.nav-links').classList.remove('active');
    document.querySelector('.nav-overlay').classList.remove('active');
    document.querySelector('.menu-toggle').classList.remove('active');
});

// 添加样式以优化 Markdown 内容显示
const style = document.createElement('style');
style.textContent = `
    .article-content {
        line-height: 1.8;
        color: #333;
    }

    .article-content h1,
    .article-content h2,
    .article-content h3,
    .article-content h4,
    .article-content h5,
    .article-content h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
    }

    .article-content p {
        margin-bottom: 1em;
    }

    .article-content code {
        background: #f5f5f5;
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: Consolas, Monaco, 'Andale Mono', monospace;
    }

    .article-content pre {
        background: #f5f5f5;
        padding: 1em;
        border-radius: 5px;
        overflow-x: auto;
        margin: 1em 0;
    }

    .article-content pre code {
        background: none;
        padding: 0;
    }

    .article-content blockquote {
        border-left: 4px solid #ddd;
        padding-left: 1em;
        margin: 1em 0;
        color: #666;
    }

    .article-content img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 1em auto;
    }

    .article-content ul,
    .article-content ol {
        padding-left: 2em;
        margin: 1em 0;
    }

    .article-content table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
    }

    .article-content th,
    .article-content td {
        border: 1px solid #ddd;
        padding: 0.5em;
    }

    .article-content th {
        background: #f5f5f5;
    }
`;
document.head.appendChild(style); 