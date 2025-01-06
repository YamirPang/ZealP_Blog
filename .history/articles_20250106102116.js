document.addEventListener('DOMContentLoaded', async function() {
    // 筛选区域展开/折叠功能
    const filterToggle = document.querySelector('.filter-toggle');
    const filterContent = document.querySelector('.filter-content');
    
    filterToggle.addEventListener('click', function() {
        filterContent.classList.toggle('active');
        this.classList.toggle('active');
    });

    // 加载文章数据
    try {
        const response = await fetch('../article/records.json');
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        const data = await response.json();
        renderArticles(data.articles);
    } catch (error) {
        console.error('Error loading articles:', error);
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

    const articlesHTML = articles.map(article => {
        const date = new Date(article.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, '-');

        const tagsHTML = article.tags
            .map(tag => `<span class="article-tag">${tag}</span>`)
            .join('');

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
            </article>
        `;
    }).join('');

    articlesGrid.innerHTML = articlesHTML;

    // 更新分页显示逻辑
    const pageSize = parseInt(document.querySelector('.page-size-select').value);
    const totalPages = Math.ceil(articles.length / pageSize);
    
    const paginationElement = document.querySelector('.pagination');
    if (totalPages > 1) {
        paginationElement.classList.add('show');
    } else {
        paginationElement.classList.remove('show');
    }
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