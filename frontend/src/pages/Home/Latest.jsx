import React, { useState } from 'react'
import "../../styles/latest.css"
import { useScrapLatestQuery } from '../../redux/api/latestapi';
import { ChevronRight } from 'lucide-react'


const formatTime = () => {
    const date = new Date('2024-08-22T10:00:00');
    return date.toLocaleTimeString(); // Customize the format as needed
}

const LatestNews = () => {
    const [showAllArticles, setShowAllArticles] = useState(false)
    const { data: response, error, isLoading } = useScrapLatestQuery()
    //   const { data: techResponse, error: techError, isLoading: techLoading } = 

    const articles = response?.data || []
    //   const techArticles = techResponse?.data || [];
    if (articles) {
        console.log(articles)
    }
    //   if (techArticles) {
    //     console.log(techArticles)
    //   }

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>Error loading articles!</p>;
    if (!articles.length) return <p>No articles available</p>

    const handleSeeAllClick = () => {
        setShowAllArticles(!showAllArticles);
    }

    return (
        <>
            <div className="popular-articles">
                <h1 className="title">The Most Popular</h1>
                <div className="articles-grid">
                    {articles.slice(0, 3).map((article, index) => (
                        <div key={index || article.id} className="article">
                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                <img src={article.image} alt={article.title} className="article-image" />
                                <div className="article-content">
                                    <h2 className="article-title">{article.title}</h2>
                                    <h5 className="article-description">{article.description}</h5>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
                <div className="last-news">
                    <div className="section-header">
                        <h2 className="section-title">Latest News</h2>
                        <button className="see-all-btn" onClick={handleSeeAllClick}>
                            {showAllArticles ? 'SHOW LESS' : 'SEE ALL'}<ChevronRight size={20} /></button>
                    </div>
                    <div className="articles-grid last-news-grid">
                        {articles.slice(3, 7).map((article, index) => (
                            <div key={index || article.id} className="article">
                                <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                    <div className="latest-article-image-container">
                                        <img src={article.image} alt={article.title} className="latest-article-image" />
                                    </div>
                                    <div className="article-content">
                                        <h3 className="article-title">{article.title}</h3>
                                        {/* <h5 className="article-description">{article.description}</h5> */}
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                    {showAllArticles && (
                        <div className="additional-articles">
                            <div className="articles-grid last-news-grid">
                                {articles.slice(7,13).map((article, index) => (
                                    <div key={index || article.id} className="article">
                                        <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                            <div className="latest-article-image-container">
                                                <img src={article.image} alt={article.title} className="latest-article-image" />
                                            </div>
                                            <div className="article-content">
                                                <h3 className="article-title">{article.title}</h3>
                                            </div>
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default LatestNews

