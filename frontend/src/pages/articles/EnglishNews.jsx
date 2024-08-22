import React from 'react'
import { useScrapeEnglishQuery } from '../../redux/api/englishapi'
import "../../styles/englishnews.css"

const englishNews = () => {
  const { data: response, error, isLoading } = useScrapeEnglishQuery()

  const articles = response?.data || []
  if (articles) {
    console.log(articles)
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles!</p>;
  if (!articles.length) return <p>No articles available</p>

  return (
    <section className='english'>
      <header className='header'>English News</header>
      <hr/>
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
              {articles.slice(1, 6).map((article, index) => (
                <div className='small-article' key={index}>
                  <a href={article.link} target='_blank' rel='noopener noreferrer'>
                    <p className='article-title-small'>{article.title}</p>
                  </a>
                    <img src={article.image} alt={article.title} className='article-image-small' />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default englishNews
