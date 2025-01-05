// 分页功能实现
document.addEventListener('DOMContentLoaded', function() {
    // 筛选区域折叠功能优化
    const filterToggle = document.querySelector('.filter-toggle');
    const filterContent = document.querySelector('.filter-content');
    
    filterToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        filterContent.classList.toggle('active');
    });

    // 倒计时功能（从主页同步）
    const targetDate = new Date('2027-01-01T00:00:00');
    
    function updateCountdown() {
        const now = new Date();
        const difference = targetDate - now;
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        document.getElementById('days').textContent = days.toString().padStart(3, '0');
        document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
        document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // 初始化倒计时
    updateCountdown();
    setInterval(updateCountdown, 1000);

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