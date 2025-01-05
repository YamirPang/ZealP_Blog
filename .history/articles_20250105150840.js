// 分页功能实现
document.addEventListener('DOMContentLoaded', function() {
    const pageSizeSelect = document.querySelector('.page-size-select');
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.page-btn:first-child');
    const nextBtn = document.querySelector('.page-btn:last-child');
    
    let currentPage = 1;
    let pageSize = parseInt(pageSizeSelect.value);
    const totalItems = document.querySelectorAll('.article-card').length;
    
    function updatePagination() {
        const totalPages = Math.ceil(totalItems / pageSize);
        const articles = document.querySelectorAll('.article-card');
        
        // 显示/隐藏文章
        articles.forEach((article, index) => {
            if (index >= (currentPage - 1) * pageSize && index < currentPage * pageSize) {
                article.style.display = '';
            } else {
                article.style.display = 'none';
            }
        });
        
        // 更新页码按钮
        let pageNumbersHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbersHTML += `<button class="page-number ${i === currentPage ? 'active' : ''}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pageNumbersHTML += `<span class="page-ellipsis">...</span>`;
            }
        }
        pageNumbers.innerHTML = pageNumbersHTML;
        
        // 更新上一页/下一页按钮状态
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
        pageSize = parseInt(this.value);
        currentPage = 1;
        updatePagination();
    });
    
    // 上一页/下一页按钮点击事件
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
        }
    });
    
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalItems / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
        }
    });
    
    // 初始化分页
    updatePagination();
}); 