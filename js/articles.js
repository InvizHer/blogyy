// Load article content
function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleTitle = urlParams.get('title');
    
    if (!articleTitle) {
        window.location.href = 'index.html';
        return;
    }
    
    const articles = loadArticles();
    const article = articles.find(a => generateSlug(a.title) === articleTitle);
    
    if (!article) {
        window.location.href = 'index.html';
        return;
    }
    
    displayArticle(article);
    loadComments(generateSlug(article.title));
    displayRelatedArticles(article, articles);
    updatePageTitle(article.title);
}

// Display article content
function displayArticle(article) {
    const container = document.getElementById('articleContent');
    if (!container) return;
    
    container.innerHTML = `
        <div class="article-header">
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span class="date">${formatDate(article.date)}</span>
                <span class="author">By ${article.author}</span>
                <span class="category">${article.category}</span>
            </div>
        </div>
        <img class="article-image" src="${article.image}" alt="${article.title}">
        <div class="article-content">
            ${article.content}
        </div>
        <div class="article-tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        <div class="article-actions">
            <button onclick="shareArticle('twitter')" class="share-btn twitter">
                <i class="fab fa-twitter"></i> Share on Twitter
            </button>
            <button onclick="shareArticle('facebook')" class="share-btn facebook">
                <i class="fab fa-facebook"></i> Share on Facebook
            </button>
            <button onclick="shareArticle('linkedin')" class="share-btn linkedin">
                <i class="fab fa-linkedin"></i> Share on LinkedIn
            </button>
        </div>
    `;
}

// Share article
function shareArticle(platform) {
    const url = window.location.href;
    const title = document.querySelector('h1').textContent;
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
}

// Load and display comments
function loadComments(articleSlug) {
    const comments = JSON.parse(localStorage.getItem(`comments_${articleSlug}`)) || [];
    displayComments(comments);
}

// Display comments
function displayComments(comments) {
    const container = document.getElementById('commentsList');
    if (!container) return;
    
    container.innerHTML = '';
    
    if (comments.length === 0) {
        container.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span class="comment-author">${comment.author}</span>
                <span class="comment-date">${formatDate(comment.date)}</span>
            </div>
            <div class="comment-content">
                ${comment.content}
            </div>
        `;
        container.appendChild(commentElement);
    });
}

// Submit new comment
function submitComment() {
    const commentText = document.getElementById('commentText').value;
    if (!commentText.trim()) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const articleTitle = urlParams.get('title');
    
    const comment = {
        author: 'Anonymous User',
        content: commentText,
        date: new Date().toISOString()
    };
    
    const comments = JSON.parse(localStorage.getItem(`comments_${articleTitle}`)) || [];
    comments.push(comment);
    localStorage.setItem(`comments_${articleTitle}`, JSON.stringify(comments));
    
    displayComments(comments);
    document.getElementById('commentText').value = '';
}

// Update page title
function updatePageTitle(articleTitle) {
    document.title = `${articleTitle} - My Blog`;
}

// Initialize article page
if (document.getElementById('articleContent')) {
    loadArticle();
}
