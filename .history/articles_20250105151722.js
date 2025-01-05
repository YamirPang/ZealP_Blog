// 分页功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 筛选区域折叠功能
    const filterToggle = document.querySelector('.filter-toggle');
    const filterContent = document.querySelector('.filter-content');
    
    filterToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        filterContent.classList.toggle('active');
    });

    // 分页功能
    const itemsPerPage = 10;
    const articles = document.querySelectorAll('.article-card');
    const totalPages = Math.ceil(articles.length / itemsPerPage);
    let currentPage = 1;

    const pageSizeSelect = document.querySelector('.page-size-select');
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    function updatePagination() {
        const pageSize = parseInt(pageSizeSelect.value);
        const totalPages = Math.ceil(articles.length / pageSize);
        
        // 显示/隐藏文章
        articles.forEach((article, index) => {
            article.style.display = 
                index >= (currentPage - 1) * pageSize && index < currentPage * pageSize
                    ? 'flex'
                    : 'none';
        });

        // 更新页码
        let pageNumbersHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbersHTML += `
                    <button class="page-number ${i === currentPage ? 'active' : ''}">${i}</button>
                `;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pageNumbersHTML += '<span class="page-ellipsis">...</span>';
            }
        }
        pageNumbers.innerHTML = pageNumbersHTML;

        // 更新按钮状态
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // 添加页码点击事件
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.textContent);
                updatePagination();
            });
        });
    }

    // 监听每页显示数量变化
    pageSizeSelect.addEventListener('change', function() {
        currentPage = 1;
        updatePagination();
    });

    // 上一页/下一页按钮事件
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });

    nextBtn.addEventListener('click', () => {
        const pageSize = parseInt(pageSizeSelect.value);
        const totalPages = Math.ceil(articles.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });

    // 初始化分页
    updatePagination();
}); 