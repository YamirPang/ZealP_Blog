// 分页功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 筛选区域展开/折叠功能
    const filterToggle = document.querySelector('.filter-toggle');
    const filterContent = document.querySelector('.filter-content');
    
    filterToggle.addEventListener('click', function(e) {
        e.preventDefault();
        filterToggle.classList.toggle('active');
        if (filterContent.classList.contains('active')) {
            filterContent.style.maxHeight = '0';
            filterContent.classList.remove('active');
        } else {
            filterContent.classList.add('active');
            filterContent.style.maxHeight = filterContent.scrollHeight + 'px';
        }
    });

    // 分页功能实现
    const articles = document.querySelectorAll('.article-card');
    const pageSizeSelect = document.querySelector('.page-size-select');
    const pageNumbers = document.querySelector('.page-numbers');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentPage = 1;
    let pageSize = parseInt(pageSizeSelect.value);

    function updatePagination() {
        const totalItems = articles.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        
        // 更新页码显示
        let pageNumbersHTML = '';
        for (let i = 1; i <= totalPages; i++) {
            if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
                pageNumbersHTML += `<button class="page-number ${i === currentPage ? 'active' : ''}">${i}</button>`;
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                pageNumbersHTML += '<span class="page-ellipsis">...</span>';
            }
        }
        pageNumbers.innerHTML = pageNumbersHTML;

        // 更新文章显示
        articles.forEach((article, index) => {
            if (index >= (currentPage - 1) * pageSize && index < currentPage * pageSize) {
                article.style.display = '';
            } else {
                article.style.display = 'none';
            }
        });

        // 更新按钮状态
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = currentPage === totalPages;

        // 重新绑定页码点击事件
        document.querySelectorAll('.page-number').forEach(btn => {
            btn.addEventListener('click', () => {
                currentPage = parseInt(btn.textContent);
                updatePagination();
                window.scrollTo({
                    top: document.querySelector('.articles-grid').offsetTop - 20,
                    behavior: 'smooth'
                });
            });
        });
    }

    // 监听每页显示数量变化
    pageSizeSelect.addEventListener('change', function() {
        pageSize = parseInt(this.value);
        currentPage = 1;
        updatePagination();
    });

    // 上一页按钮点击事件
    prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            updatePagination();
            window.scrollTo({
                top: document.querySelector('.articles-grid').offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });

    // 下一页按钮点击事件
    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(articles.length / pageSize);
        if (currentPage < totalPages) {
            currentPage++;
            updatePagination();
            window.scrollTo({
                top: document.querySelector('.articles-grid').offsetTop - 20,
                behavior: 'smooth'
            });
        }
    });

    // 初始化分页
    updatePagination();
}); 