// 模拟文章数据
const articlesData = [
    {
        "id": "1",
        "title": "人工智能的未来展望",
        "description": "探讨AI技术发展趋势和未来可能性",
        "date": "2024-03-15",
        "tags": ["人工智能", "技术前沿"],
        "image": "/images/ai-future.jpg"
    },
    {
        "id": "2",
        "title": "深度学习框架对比",
        "description": "主流深度学习框架的优劣分析",
        "date": "2024-03-10",
        "tags": ["深度学习", "技术评测"],
        "image": "/images/deep-learning.jpg"
    },
    {
        "id": "3",
        "title": "机器学习入门指南",
        "description": "零基础入门机器学习的完整路线",
        "date": "2024-03-05",
        "tags": ["机器学习", "入门指南"],
        "image": "/images/ml-guide.jpg"
    }
];

document.addEventListener('DOMContentLoaded', function() {
    try {
        renderArticles(articlesData);
    } catch (error) {
        console.error('Error rendering articles:', error);
        document.querySelector('.articles-grid').innerHTML = 
            '<div class="error-message">加载文章列表失败，请稍后重试。</div>';
    }
});

function renderArticles(articles) {
    const articlesGrid = document.querySelector('.articles-grid');
    console.log('Rendering articles:', articles.length);
    
    if (!articles || articles.length === 0) {
        articlesGrid.innerHTML = '<div class="empty-message">暂无文章</div>';
        return;
    }

    const articlesHTML = articles.map(article => {
        // 格式化日期
        const date = new Date(article.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');

        // 生成标签HTML
        const tagsHTML = article.tags
            .map(tag => `<span class="article-tag">${tag}</span>`)
            .join('');

        return `
            <article class="article-card">
                <div class="article-content">
                    <h2><a href="article.html?id=${article.id}">${article.title}</a></h2>
                    <p class="article-description">${article.description}</p>
                    <div class="article-meta">
                        <span class="article-date">${date}</span>
                        ${tagsHTML}
                    </div>
                </div>
                <div class="article-image" ${article.image ? `style="background-image: url('${article.image}')"` : ''}></div>
            </article>
        `;
    }).join('');

    articlesGrid.innerHTML = articlesHTML;

    // 初始化分页
    const pageSize = parseInt(document.querySelector('.page-size-select').value);
    initializePagination(articles, pageSize);
}

// 保持其他函数不变... 