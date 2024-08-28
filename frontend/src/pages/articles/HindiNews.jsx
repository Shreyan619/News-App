import React from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/hindinews.css"
import { useScrapeHindiBusinessQuery, useScrapeHindiQuery } from '../../redux/api/hindiapi';


const hindinews = () => {
    const { data: response, error, isLoading } = useScrapeHindiQuery()
    const { data: techResponse, error: techError, isLoading: techLoading } = useScrapeHindiBusinessQuery()

    const articles = response?.data || []
    const techArticles = techResponse?.data || [];
    if (articles) {
        console.log(articles)
    }
    if (techArticles) {
        console.log(techArticles)
    }

    if (isLoading || techLoading) return <p>Loading...</p>
    if (error || techError) return <p>Error loading articles!</p>
    if (!articles.length && !techArticles.length) return <p>No articles available</p>

    const settings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        vertical: true,
        autoplay: true,
        autoplaySpeed: 3000,
        verticalSwiping: true
    }
    const techSettings = {
        // dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true
    }

    return (
        <>
            <section className='hindi'>
                <header className='header-hindi'>Hindi News</header>
                <hr />
                <h2 className='top'>BREAKING NEWS</h2>
                <div className='articles-container-hi'>
                    {articles.length > 0 && (
                        <>
                            <div className='large-article-hi'>
                                <a href={articles[0].link} target='_blank' rel='noopener noreferrer'>
                                    <h2 className='article-title-large-hi'>{articles[0].title}</h2>
                                    <img src={articles[0].image} alt={articles[0].title} className='article-image-large-hi' />
                                    <h5 className='article-large-description-Tech-hi'>{articles[0].description}</h5>
                                </a>
                            </div>
                            <div className='small-articles-hi'>
                                <Slider {...settings}>
                                    {articles.slice(1, 6).map((article, index) => (
                                        <div key={article.id || index} className='small-article-wrapper'>
                                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                                <div className='small-article-hi'>
                                                    <div className='small-article-content'>
                                                        <p className='article-title-small-hi'>{article.title}</p>
                                                        <h5 className='article-small-description-Tech-hi'>{article.description}</h5>
                                                    </div>
                                                    <img src={article.image} alt={article.title} className='article-image-small-hi' />
                                                </div>
                                            </a>
                                            {index < articles.length - 2 && <hr />}
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <hr className='low-Tech-hi' />
            <section className='Tech-hi'>
                <header className='header-tech-hi'>बिजनेस</header>
                <Slider {...techSettings}>
                    {techArticles.map((article, index) => (
                        <div key={article.id || index} className='Tech-news-hi'>
                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                <h3 className='article-title-Tech-hi'>{article.title}</h3>
                                <img src={article.image} alt={article.title} className='article-image-Tech-hi' />
                                <h5 className='article-description-Tech-hi'>{article.description}</h5>
                            </a>
                        </div>
                    ))}
                </Slider>
            </section>
        </>
    )
}

export default hindinews