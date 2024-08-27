import React from 'react'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/spainnews.css"
import { useScrapeSpainQuery, useScrapeSpainSportQuery } from '../../redux/api/spainapi';


const spanishnews = () => {
    const { data: response, error, isLoading } = useScrapeSpainQuery()
    const { data: techResponse, error: techError, isLoading: techLoading } = useScrapeSpainSportQuery()

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
            <section className='spain'>
                <header className='header-spain'>Spain News</header>
                <hr />
                <h2 className='top'>NEWSROOM</h2>
                <div className='articles-container-sp'>
                    {articles.length > 0 && (
                        <>
                            <div className='large-article-sp'>
                                <a href={articles[0].link} target='_blank' rel='noopener noreferrer'>
                                    <h2 className='article-title-large-sp'>{articles[0].title}</h2>
                                    <img src={articles[0].image} alt={articles[0].title} className='article-image-large-sp' />
                                    <h5 className='article-large-description-Tech-sp'>{articles[0].description}</h5>
                                </a>
                            </div>
                            <div className='small-articles-sp'>
                                <Slider {...settings}>
                                    {articles.slice(1, 6).map((article, index) => (
                                        <div key={article.id || index} className='small-article-wrapper'>
                                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                                <div className='small-article-sp'>
                                                    <div className='small-article-content'>
                                                        <p className='article-title-small-sp'>{article.title}</p>
                                                        <h5 className='article-small-description-Tech-sp'>{article.description}</h5>
                                                    </div>
                                                    <img src={article.image} alt={article.title} className='article-image-small-sp' />
                                                </div>
                                            </a>
                                        </div>
                                    ))}
                                </Slider>
                            </div>
                        </>
                    )}
                </div>
            </section>
            <hr className='low-Tech-sp' />
            <section className='Tech-sp'>
                <header className='header-tech-sp'>Leben</header>
                <Slider {...techSettings}>
                    {techArticles.map((article, index) => (
                        <div key={article.id || index} className='Tech-news-sp'>
                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                <h3 className='article-title-Tech-sp'>{article.title}</h3>
                                <img src={article.image} alt={article.title} className='article-image-Tech-sp' />
                                <h5 className='article-description-Tech-sp'>{article.description}</h5>
                            </a>
                        </div>
                    ))}
                </Slider>
            </section>
        </>
    )
}

export default spanishnews
