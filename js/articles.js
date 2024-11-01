// Load article content
async function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (!articleId) {
        window.location.href = 'index.html';
        return;
    }
    
    const articles = await loadArticles();
    const article = articles.find(a => a.id === articleId);
    
    if (!article) {
        window.location.href = 'index.html';
        return;
    }
    
    displayArticle(article);
    loadComments(articleId);
    displayRelatedArticles(article, articles);
}

// Display article content
function displayArticle(article) {
    const container = document.getElementById('articleContent');
    
    container.innerHTML = `
        <div class="article-header">
            <h1>${article.title}</h1>
            <div class="article-meta">
                <span>${formatDate(article.date)}</span>
                <span>${article.category}</span>
                <span>${article.author}</span>
            </div>
        </div>
        <img class="article-image" src="${article.image}" alt="${article.title}">
        <div class="article-content">
            ${article.content}
        </div>
        <div class="article-tags">
            ${article.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
    `;
}

// Load and display comments
function loadComments(articleId) {
    const comments = JSON.parse(localStorage.getItem(`comments_${articleId}`)) || [];
    displayComments(comments);
}

// Display comments
function displayComments(comments) {
    const container = document.getElementById('commentsList');
    container.innerHTML = '';
    
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'comment';
        commentElement.innerHTML = `
            <div class="comment-header">
                <span>${comment.author}</span>
                <span>${formatDate(comment.date)}</span>
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
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    const commentText = document.getElementById('commentText').value;
    
    if (!commentText.trim()) return;
    
    const comment = {
        author: 'Anonymous User', // Could be enhanced with user authentication
        content: commentText,
        date: new Date().toISOString()
    };
    
    const comments = JSON.parse(localStorage.getItem(`comments_${articleId}`)) || [];
    comments.push(comment);
    localStorage.setItem(`comments_${articleId}`, JSON.stringify(comments));
    
    displayComments(comments);
    document.getElementById('commentText').value = '';
}

// Display related articles
function displayRelatedArticles(currentArticle, articles) {
    const related = articles
        .filter(article => 
            article.id !== currentArticle.id &&
            (article.category === currentArticle.category ||
             article.tags.some(tag => currentArticle.tags.includes(tag)))
        )
        .slice(0, 3);
    
    const container = document.getElementById('relatedArticles');
    
    related.forEach(article => {
        const articleElement = createArticleCard(article);
        container.appendChild(articleElement);
    });
}

// Social sharing functionality
function share(platform) {
    const url = window.location.href;
    const title = document.querySelector('h1').textContent;
    
    const shareUrls = {
        twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };
    
    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
}

// Initialize article page if we're on an article page
if (document.getElementById('articleContent')) {
    loadArticle();
}
