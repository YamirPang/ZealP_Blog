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

// 在加载文章内容的部分修改渲染逻辑
async function loadArticleContent(articleId) {
    try {
        const contentResponse = await fetch(`/article/files/${articleId}.md`);
        if (!contentResponse.ok) {
            throw new Error('文章内容加载失败');
        }
        const markdown = await contentResponse.text();
        
        // 使用 marked 渲染 Markdown
        const contentHtml = marked(markdown);
        document.getElementById('article-content').innerHTML = contentHtml;

        // 如果使用了 Prism，需要重新调用语法高亮
        if (typeof Prism !== 'undefined') {
            Prism.highlightAll();
        }

    } catch (error) {
        console.error('加载文章失败:', error);
        showError('加载文章失败，请稍后重试');
    }
}

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