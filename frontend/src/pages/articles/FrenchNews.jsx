import React from 'react'
import { useScrapeFranceQuery } from '../../redux/api/franceapi'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/francenews.css"


const francenews = () => {
    const { data: response, error, isLoading } = useScrapeFranceQuery()
    

    const articles = response?.data || []
    if (articles) {
        console.log(articles)
    }

    if (isLoading) return <p>Loading...</p>
    if (error) return <p>Error loading articles!</p>
    if (!articles.length) return <p>No articles available</p>

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

    return (
        <>
            <section className='france'>
                <header className='header'>English News</header>
                <hr />
                <h2 className='top-stories'>Top Stories</h2>
                <div className='articles-container'>
                    {articles.length > 0 && (
                        <>
                            <div className='large-article'>
                                <a href={articles[0].link} target='_blank' rel='noopener noreferrer'>
                                    <h2 className='article-title-large'>{articles[0].title}</h2>
                                    <img src={articles[0].image} alt={articles[0].title} className='article-image-large' />
                                </a>
                            </div>
                            <div className='small-articles'>
                                <Slider {...settings}>
                                    {articles.slice(1, 6).map((article, index) => (
                                        <div key={article.id || index} className='small-article-wrapper'>
                                            <a href={article.link} target='_blank' rel='noopener noreferrer'>
                                                <div className='small-article'>
                                                    <p className='article-title-small'>{article.title}</p>
                                                    <img src={article.image} alt={article.title} className='article-image-small' />
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
        </>
    )
}

export default francenews