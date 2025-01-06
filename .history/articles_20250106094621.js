const articlesData = [
    {
        "id": "20250105001",
        "title": "2025年AI行业三大机会点",
        "description": "百度这张AI成绩单，透出了2025年AI行业三大机会点",
        "date": "2025-01-06 16:02",
        "tags": ["AI应用", "智能体"],
        "type": "selected",
        "image": "/images/ai-future.jpg"
    }
];

let currentPage = 1;
let pageSize = 10;

document.addEventListener('DOMContentLoaded', function() {
    // 筛选区域展开/折叠功能
    const filterToggle = document.querySelector('.filter-toggle');
    const filterContent = document.querySelector('.filter-content');
    
    filterToggle.addEventListener('click', function() {
        filterContent.style.maxHeight = filterContent.style.maxHeight ? null : filterContent.scrollHeight + "px";
        filterContent.classList.toggle('active');
        this.classList.toggle('active');
    });

    try {
        // 初始化页面大小选择器的值
        const pageSizeSelect = document.querySelector('.page-size-select');
        pageSize = parseInt(pageSizeSelect.value);
        
        // 渲染文章列表
        renderArticles(articlesData);
        
        // 绑定分页事件
        bindPaginationEvents();
    } catch (error) {
        console.error('Error rendering articles:', error);
        document.querySelector('.articles-grid').innerHTML = 
            '<div class="error-message">加载文章列表失败，请稍后重试。</div>';
    }
});

function renderArticles(articles) {
    const articlesGrid = document.querySelector('.articles-grid');
    
    if (!articles || articles.length === 0) {
        articlesGrid.innerHTML = '<div class="empty-message">暂无文章</div>';
        return;
    }

    // 计算当前页的文章
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageArticles = articles.slice(start, end);

    const articlesHTML = pageArticles.map(article => {
        const date = new Date(article.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');

        const tagsHTML = article.tags
            .map(tag => `<span class="article-tag">${tag}</span>`)
            .join('');

        // 添加精选标签（现在放在标题前面）
        const selectedTag = article.type === 'selected' 
            ? '<span class="selected-tag"><i class="fas fa-crown"></i> 精选</span>' 
            : '';

        return `
            <article class="article-card">
                <div class="article-content">
                    <h2>${selectedTag}<a href="article.html?id=${article.id}&title=${encodeURIComponent(article.title)}&date=${encodeURIComponent(article.date)}">${article.title}</a></h2>
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
    updatePagination(articles.length);
}

function updatePagination(totalItems) {
    const totalPages = Math.ceil(totalItems / pageSize);
    const pageNumbers = document.querySelector('.page-numbers');
    let html = '';

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="page-number ${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span class="page-ellipsis">...</span>';
        }
    }

    pageNumbers.innerHTML = html;

    // 更新按钮状态
    document.querySelector('.prev-btn').disabled = currentPage === 1;
    document.querySelector('.next-btn').disabled = currentPage === totalPages;

    // 绑定页码点击事件
    document.querySelectorAll('.page-number').forEach(btn => {
        btn.addEventListener('click', () => {
            currentPage = parseInt(btn.textContent);
            renderArticles(articlesData);
        });
    });
}

function bindPaginationEvents() {
    // 绑定上一页/下一页按钮事件
    document.querySelector('.prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderArticles(articlesData);
        }
    });

    document.querySelector('.next-btn').addEventListener('click', () => {
        const totalPages = Math.ceil(articlesData.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            renderArticles(articlesData);
        }
    });

    // 绑定每页显示数量变化事件
    document.querySelector('.page-size-select').addEventListener('change', (e) => {
        pageSize = parseInt(e.target.value);
        currentPage = 1;
        renderArticles(articlesData);
    });
} 