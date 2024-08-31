import React from 'react'
import { useScrapeFranceQuery, useScrapeFranceTechQuery } from '../../redux/api/franceapi';
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/francenews.css"


const francenews = () => {
    const { data: response, error, isLoading } = useScrapeFranceQuery() || {}
    const { data: techResponse, error: techError, isLoading: techLoading } = useScrapeFranceTechQuery() || {}

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
            <section className='france'>
                <header className='header-france'>France News</header>
                <hr />
                <h2 className='top'>POLITIQUE</h2>
                <div className='articles-container-fr'>
                    {articles.length > 0 && (
                        <>
                            <div className='large-article-fr'>
                                <a href={articles[0].link} target='_blank' rel='noopener noreferrer'>
                                    <h2 className='article-title-large-fr'>{articles[0].title}</h2>
                                    <img src={articles[0].image} alt={articles[0].title} className='article-image-large-fr' />
                                    <h5 className='article-large-description-Tech-fr'>{articles[0].description}</h5>
                                </a>
                            </div>
                            <div className='small-articles-fr'>
                                <Slider {...settings}>
                                    {articles.slice(1, 6).map((article, index) => (
                                        <div key={article._id || index} className='small-article-wrapper'>
                                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                                <div className='small-article-fr'>
                                                    <div className='small-article-content'>
                                                        <p className='article-title-small-fr'>{article.title}</p>
                                                        <h5 className='article-small-description-Tech-fr'>{article.description}</h5>
                                                    </div>
                                                    <img src={article.image} alt={article.title} className='article-image-small-fr' />
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
            <hr className='low-Tech-fr' />
            <section className='Tech-fr'>
                <header className='header-tech-fr'>Economie</header>
                <Slider {...techSettings}>
                    {techArticles.map((article, index) => (
                        <div key={article._id} className='Tech-news-fr'>
                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                <h3 className='article-title-Tech-fr'>{article.title}</h3>
                                <img src={article.image} alt={article.title} className='article-image-Tech-fr' />
                                <h5 className='article-description-Tech-fr'>{article.description}</h5>
                            </a>
                        </div>
                    ))}
                </Slider>
            </section>
        </>
    )
}

export default francenews