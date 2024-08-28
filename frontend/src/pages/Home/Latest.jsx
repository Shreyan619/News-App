import React from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/latest.css"
import { useScrapLatestQuery } from '../../redux/api/latestapi';


const formatTime = () => {
    const date = new Date('2024-08-22T10:00:00');
    return date.toLocaleTimeString(); // Customize the format as needed
}

const LatestNews = () => {
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



    return (
        <>
            <div className="popular-articles">
                <h1 className="title">The Most Popular</h1>
                <div className="articles-grid">
                    {articles.slice(0,3).map((article, index) => (
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
                    <button className="see-all-btn">SEE ALL <span>→</span></button>
                </div>
                <div className="articles-grid last-news-grid">
                    {articles.slice(3, 6).map((article, index) => (
                        <div key={index || article.id} className="article">
                        <a href={article.link} target='_blank' rel='noopener noreferrer'>
                            <img src={article.image} alt={article.title} className="article-image" />
                            <div className="article-content">
                                <h3 className="article-title">{article.title}</h3>
                                {/* <h5 className="article-description">{article.description}</h5> */}
                            </div>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
            </div>
        </>
    )
}

export default LatestNews

