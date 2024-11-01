// Global variables
let currentPage = 1;
const articlesPerPage = 9;
let filteredArticles = [];
let currentFilters = {
    category: null,
    tags: [],
    search: ''
};

// Initialize the blog
function initializeBlog() {
    const articles = loadArticles(); // Now synchronous
    filteredArticles = [...articles];
    
    displayFeaturedArticles(articles);
    setupFilters(articles);
    displayArticles();
    setupPagination();
}

// Display featured articles
function displayFeaturedArticles(articles) {
    const featured = articles.filter(article => article.featured);
    const container = document.getElementById('featuredArticles');
    if (!container) return;
    
    container.innerHTML = ''; // Clear existing content
    
    featured.forEach(article => {
        const articleElement = createArticleCard(article, true);
        container.appendChild(articleElement);
    });
}

// Create article card element
function createArticleCard(article, isFeatured = false) {
    const card = document.createElement('div');
    card.className = `article-card ${isFeatured ? 'featured' : ''}`;
    
    card.innerHTML = `
        <img src="${article.image}" alt="${article.title}">
        <div class="article-content">
            <h3>${article.title}</h3>
            <div class="article-meta">
                <span>${formatDate(article.date)}</span>
                <span>${article.category}</span>
            </div>
            <p>${article.excerpt}</p>
            <div class="article-tags">
                ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        window.location.href = `article.html?id=${article.id}`;
    });
    
    return card;
}

// Apply filters
function applyFilters() {
    const articles = loadArticles();
    
    filteredArticles = articles.filter(article => {
        const categoryMatch = !currentFilters.category || article.category === currentFilters.category;
        const tagsMatch = currentFilters.tags.length === 0 || 
            currentFilters.tags.every(tag => article.tags.includes(tag));
        const searchMatch = !currentFilters.search || 
            article.title.toLowerCase().includes(currentFilters.search.toLowerCase()) ||
            article.content.toLowerCase().includes(currentFilters.search.toLowerCase());
        
        return categoryMatch && tagsMatch && searchMatch;
    });
    
    currentPage = 1;
    displayArticles();
    setupPagination();
}

// Search functionality
function searchArticles() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    currentFilters.search = searchInput.value;
    applyFilters();
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

// Setup filters
function setupFilters(articles) {
    const categories = [...new Set(articles.map(article => article.category))];
    const tags = [...new Set(articles.flatMap(article => article.tags))];
    
    const categoriesContainer = document.getElementById('categories');
    const tagsContainer = document.getElementById('tags');
    
    if (categoriesContainer) {
        categoriesContainer.innerHTML = ''; // Clear existing content
        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = 'filter-tag';
            button.textContent = category;
            button.addEventListener('click', () => {
                currentFilters.category = currentFilters.category === category ? null : category;
                applyFilters();
                button.classList.toggle('active');
            });
            categoriesContainer.appendChild(button);
        });
    }
    
    if (tagsContainer) {
        tagsContainer.innerHTML = ''; // Clear existing content
        tags.forEach(tag => {
            const button = document.createElement('button');
            button.className = 'filter-tag';
            button.textContent = tag;
            button.addEventListener('click', () => {
                if (currentFilters.tags.includes(tag)) {
                    currentFilters.tags = currentFilters.tags.filter(t => t !== tag);
                } else {
                    currentFilters.tags.push(tag);
                }
                applyFilters();
                button.classList.toggle('active');
            });
            tagsContainer.appendChild(button);
        });
    }
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
