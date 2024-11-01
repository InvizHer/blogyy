import DataService from './data.js';

// Pagination state
let currentPage = 1;
const articlesPerPage = 6;
let currentArticles = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await initializePage();
});

async function initializePage() {
    await loadFeaturedArticle();
    await loadAllArticles();
    await initializeTags();
}

async function loadFeaturedArticle() {
    const featuredArticle = await DataService.getFeaturedArticle();
    if (featuredArticle) {
        const featuredSection = document.getElementById('featuredArticle');
        featuredSection.innerHTML = `
            <article class="featured-card">
                <img src="${featuredArticle.image}" alt="${featuredArticle.title}" class="featured-image">
                <div class="featured-content">
                    <span class="featured-label">Featured</span>
                    <h2>${featuredArticle.title}</h2>
                    <p>${featuredArticle.excerpt}</p>
                    <div class="article-meta">
                        <span class="author">By ${featuredArticle.author}</span>
                        <span class="date">${DataService.formatDate(featuredArticle.date)}</span>
                        <span class="read-time">${featuredArticle.readTime} read</span>
                    </div>
                    <a href="article.html?id=${featuredArticle.id}" class="read-more">Read More</a>
                </div>
            </article>
        `;
    }
}

async function loadAllArticles(articles = null) {
    try {
        currentArticles = articles || await DataService.getArticles();
        displayPaginatedArticles();
    } catch (error) {
        console.error('Error loading articles:', error);
        document.getElementById('articles').innerHTML = '<p>Error loading articles. Please try again later.</p>';
    }
}

function displayPaginatedArticles() {
    const startIndex = (currentPage - 1) * articlesPerPage;
    const endIndex = startIndex + articlesPerPage;
    const paginatedArticles = currentArticles.slice(startIndex, endIndex);
    
    const articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = paginatedArticles.map(article => createArticleCard(article)).join('');
    
    updatePaginationControls();
}

function createArticleCard(article) {
    return `
        <div class="article-card">
            <img src="${article.image}" alt="${article.title}" class="article-image">
            <div class="article-content">
                <div class="article-category">${article.category}</div>
                <h3>${article.title}</h3>
                <p>${article.excerpt}</p>
                <div class="article-meta">
                    <span class="author">By ${article.author}</span>
                    <span class="date">${DataService.formatDate(article.date)}</span>
                    <span class="read-time">${article.readTime} read</span>
                </div>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="article.html?id=${article.id}" class="read-more">Read More</a>
            </div>
        </div>
    `;
}

async function initializeTags() {
    const tags = await DataService.getAllTags();
    const tagsContainer = document.getElementById('tagsFilter');
    tagsContainer.innerHTML = tags.map(tag => 
        `<span class="tag" onclick="filterByTag('${tag}')">${tag}</span>`
    ).join('');
}

async function searchArticles() {
    const query = document.getElementById('searchInput').value;
    if (query.trim()) {
        const results = await DataService.searchArticles(query);
        currentPage = 1;
        await loadAllArticles(results);
    }
}

async function filterByCategory() {
    const category = document.getElementById('categoryFilter').value;
    const filteredArticles = await DataService.getArticlesByCategory(category);
    currentPage = 1;
    await loadAllArticles(filteredArticles);
}

async function filterByTag(tag) {
    const filteredArticles = await DataService.getArticlesByTag(tag);
    currentPage = 1;
    await loadAllArticles(filteredArticles);
    
    // Update active tag visual
    document.querySelectorAll('.tag').forEach(tagElement => {
        tagElement.classList.toggle('active', tagElement.textContent === tag);
    });
}

function updatePaginationControls() {
    const totalPages = Math.ceil(currentArticles.length / articlesPerPage);
    document.getElementById('currentPage').textContent = `Page ${currentPage} of ${totalPages}`;
    
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        displayPaginatedArticles();
    }
}

function nextPage() {
    const totalPages = Math.ceil(currentArticles.length / articlesPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPaginatedArticles();
    }
}

// Export functions for global use
window.searchArticles = searchArticles;
window.filterByCategory = filterByCategory;
window.filterByTag = filterByTag;
window.previousPage = previousPage;
window.nextPage = nextPage;
