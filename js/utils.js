// Load articles from JSON data
function loadArticles() {
    // In-memory articles data to avoid 404 errors with static hosting
    return {
        "articles": [
            {
                "id": "1",
                "title": "Getting Started with Web Development",
                "excerpt": "A comprehensive guide for beginners starting their journey in web development.",
                "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat...",
                "image": "/api/placeholder/800/400",
                "date": "2024-03-15",
                "author": "John Doe",
                "category": "Web Development",
                "tags": ["HTML", "CSS", "JavaScript"],
                "featured": true
            },
            {
                "id": "2",
                "title": "Modern CSS Techniques",
                "excerpt": "Explore the latest CSS features and techniques for modern web design.",
                "content": "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident...",
                "image": "/api/placeholder/800/400",
                "date": "2024-03-14",
                "author": "Jane Smith",
                "category": "CSS",
                "tags": ["CSS", "Design", "Frontend"],
                "featured": false
            },
            {
                "id": "3",
                "title": "JavaScript Best Practices",
                "excerpt": "Learn the best practices for writing clean and efficient JavaScript code.",
                "content": "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis...",
                "image": "/api/placeholder/800/400",
                "date": "2024-03-13",
                "author": "Mike Johnson",
                "category": "JavaScript",
                "tags": ["JavaScript", "Programming", "Best Practices"],
                "featured": true
            }
        ]
    }.articles;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

// Truncate text
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
}

// Generate URL-friendly slug
function generateSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

// Debounce function for search
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
