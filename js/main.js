class DataService {
    static async getArticles() {
        try {
            const response = await fetch('/data/articles.json');
            const data = await response.json();
            return data.articles;
        } catch (error) {
            console.error('Error loading articles:', error);
            return [];
        }
    }

    static async getArticleById(id) {
        try {
            const articles = await this.getArticles();
            return articles.find(article => article.id === parseInt(id));
        } catch (error) {
            console.error('Error loading article:', error);
            return null;
        }
    }

    static async getComments(articleId) {
        try {
            const response = await fetch('/data/comments.json');
            const data = await response.json();
            return data.comments[articleId] || [];
        } catch (error) {
            console.error('Error loading comments:', error);
            return [];
        }
    }

    static async searchArticles(query) {
        try {
            const articles = await this.getArticles();
            return articles.filter(article => 
                article.title.toLowerCase().includes(query.toLowerCase()) ||
                article.content.toLowerCase().includes(query.toLowerCase())
            );
        } catch (error) {
            console.error('Error searching articles:', error);
            return [];
        }
    }

    static async getArticlesByCategory(category) {
        try {
            const articles = await this.getArticles();
            return category ? articles.filter(article => article.category === category) : articles;
        } catch (error) {
            console.error('Error filtering articles by category:', error);
            return [];
        }
    }

    static async getArticlesByTag(tag) {
        try {
            const articles = await this.getArticles();
            return articles.filter(article => article.tags.includes(tag));
        } catch (error) {
            console.error('Error filtering articles by tag:', error);
            return [];
        }
    }

    static async getAllTags() {
        try {
            const articles = await this.getArticles();
            const tagsSet = new Set();
            articles.forEach(article => {
                article.tags.forEach(tag => tagsSet.add(tag));
            });
            return Array.from(tagsSet);
        } catch (error) {
            console.error('Error getting tags:', error);
            return [];
        }
    }

    static async getRelatedArticles(articleId, limit = 3) {
        try {
            const currentArticle = await this.getArticleById(articleId);
            if (!currentArticle) return [];

            const articles = await this.getArticles();
            return articles
                .filter(article => article.id !== parseInt(articleId))
                .filter(article => 
                    article.category === currentArticle.category ||
                    article.tags.some(tag => currentArticle.tags.includes(tag))
                )
                .sort((a, b) => {
                    const aCommonTags = a.tags.filter(tag => currentArticle.tags.includes(tag)).length;
                    const bCommonTags = b.tags.filter(tag => currentArticle.tags.includes(tag)).length;
                    return bCommonTags - aCommonTags;
                })
                .slice(0, limit);
        } catch (error) {
            console.error('Error getting related articles:', error);
            return [];
        }
    }

    static async getFeaturedArticle() {
        try {
            const articles = await this.getArticles();
            // Get the most recent article as featured
            return articles.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        } catch (error) {
            console.error('Error getting featured article:', error);
            return null;
        }
    }

    static formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }
}

// Export the DataService class
export default DataService;

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


document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        await loadArticle(parseInt(articleId));
        await loadComments(articleId);
        await loadRelatedArticles(articleId);
    } else {
        window.location.href = 'index.html';
    }
});

async function loadArticle(articleId) {
    try {
        const article = await DataService.getArticleById(articleId);
        if (!article) {
            window.location.href = 'index.html';
            return;
        }

        document.title = `${article.title} - My Blog`;
        
        const articleContent = document.getElementById('articleContent');
        articleContent.innerHTML = `
            <div class="article-header">
                <div class="article-meta">
                    <span class="category">${article.category}</span>
                    <span class="date">${DataService.formatDate(article.date)}</span>
                    <span class="read-time">${article.readTime} read</span>
                </div>
                <h1>${article.title}</h1>
                <div class="article-tags">
                    ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <img src="${article.image}" alt="${article.title}" class="article-main-image">
            <div class="article-body">
                ${article.content}
            </div>
        `;

        const authorInfo = document.getElementById('authorInfo');
        authorInfo.innerHTML = `
            <div class="author-bio">
                <h3>Written by ${article.author}</h3>
                <p class="publish-date">Published on ${DataService.formatDate(article.date)}</p>
            </div>
        `;
    } catch (error) {
        console.error('Error loading article:', error);
        articleContent.innerHTML = '<p>Error loading article. Please try again later.</p>';
    }
}

async function loadComments(articleId) {
    try {
        const comments = await DataService.getComments(articleId);
        const commentsList = document.getElementById('commentsList');
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment">
                <div class="comment-header">
                    <strong>${comment.author}</strong>
                    <span class="comment-date">${DataService.formatDate(comment.date)}</span>
                </div>
                <p>${comment.content}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

async function loadRelatedArticles(articleId) {
    try {
        const relatedArticles = await DataService.getRelatedArticles(articleId);
        const relatedGrid = document.querySelector('.related-grid');
        relatedGrid.innerHTML = relatedArticles.map(article => `
            <div class="related-card">
                <img src="${article.image}" alt="${article.title}">
                <div class="related-content">
                    <h4>${article.title}</h4>
                    <p>${article.excerpt.substring(0, 100)}...</p>
                    <a href="article.html?id=${article.id}" class="read-more">Read More</a>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading related articles:', error);
    }
}

function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

// Export functions for global use
window.shareOnFacebook = shareOnFacebook;
window.shareOnTwitter = shareOnTwitter;
window.shareOnLinkedIn = shareOnLinkedIn;
