// Global variables
let currentPage = 1;
const articlesPerPage = 9;
let filteredArticles = [];

// Initialize the blog
function initializeBlog() {
    const articles = loadArticles();
    filteredArticles = [...articles];
    displayArticles();
    setupPagination();
}

// Create simple article card element
function createArticleCard(article) {
    const card = document.createElement('div');
    card.className = 'article-card';
    
    // Create URL-friendly slug from title
    const articleSlug = generateSlug(article.title);
    
    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}">
        <div class="article-content">
            <h3>${article.title}</h3>
            <div class="article-meta">
                <span>${formatDate(article.date)}</span>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `article.html?title=${articleSlug}`;
    });
    
    return card;
}

// Display articles with pagination
function displayArticles() {
    const container = document.getElementById('articles');
    if (!container) return;
    
    container.innerHTML = '';
    
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
    
    paginatedArticles.forEach(article => {
        const articleElement = createArticleCard(article);
        container.appendChild(articleElement);
    });
}

// Setup pagination
function setupPagination() {
    const pagination = document.getElementById('pagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    pagination.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.className = i === currentPage ? 'active' : '';
        button.addEventListener('click', () => {
            currentPage = i;
            displayArticles();
            setupPagination();
        });
        pagination.appendChild(button);
    }
}

// Initialize blog when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeBlog);
