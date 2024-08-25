import React from 'react'
import { useScrapeEnglishQuery, useScrapeEnglishTechQuery } from '../../redux/api/englishapi'
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/englishnews.css"


const formatTime = () => {
  const date = new Date('2024-08-22T10:00:00');
  return date.toLocaleTimeString(); // Customize the format as needed
}

const englishNews = () => {
  const { data: response, error, isLoading } = useScrapeEnglishQuery()
  const { data: techResponse, error: techError, isLoading: techLoading } = useScrapeEnglishTechQuery()

  const articles = response?.data || []
  const techArticles = techResponse?.data || [];
  if (articles) {
    console.log(articles)
  }
  if (techArticles) {
    console.log(techArticles)
  }

  if (isLoading || techLoading) return <p>Loading...</p>;
  if (error || techError) return <p>Error loading articles!</p>;
  if (!articles.length && !techArticles.length) return <p>No articles available</p>

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    vertical: true, // Enable vertical scrolling
    autoplay: true,
    autoplaySpeed: 3000,
    verticalSwiping: true
  }

  return (
    <section className='english'>
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
      <hr />
      <div className='Tech'>
        {techArticles.map((article, index) => (
          <div key={article.id || index} className='Tech-news'>
            <a href={article.link} target='_blank' rel='noopener noreferrer'>
              <h3 className='article-title-Tech'>{article.title}</h3>
              <h5 className='article-description-Tech'>{article.description}</h5>
              <img src={article.image} alt={article.title} className='article-image-Tech' />
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default englishNews
