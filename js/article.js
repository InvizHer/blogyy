import DataService from './data.js';

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
