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
