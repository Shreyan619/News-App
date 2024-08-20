import React from 'react'
import { useScrapeEnglishQuery } from '../../redux/api/englishapi'

const englishNews = () => {
  const { data: response, error, isLoading } = useScrapeEnglishQuery()

  const articles = response?.data || []
  if (articles) {
    console.log(articles) // This will only log when articles are defined
  }

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading articles!</p>;
  if (!articles.length) return <p>No articles available</p>

  return (
    <section className='english'>
      <header>English News</header>
      <h1 className='top-stories'>Top Stories</h1>
      <div className='articles-container'>
        {articles.map((article, index) => (
          <div className='article' key={index}>
            <a href={article.link} target='_blank' rel='noopener noreferrer' >
              <img src={article.image} alt={article.title} className='article-image' />
              <h2 className='article-title'>{article.title}</h2>
            </a>
          </div>
        ))}
      </div>
    </section>
  )
}

export default englishNews
