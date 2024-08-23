import React, { useEffect, useState } from 'react'
import { IoMenu } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import "../../styles/header.css"

const Header = () => {
  const [scroll, setScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setScroll(scrollTop > 0);
    }
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header id='header' className={scroll ? 'scrolled' : ''}>
        <div className='main flex'>
          <div className='news-group'>
            <h3>Latest</h3>
            <h3>Local News</h3>
            <IoMenu className='lines' style={{ cursor: 'pointer' }} />
          </div>
          <h2>SK NEW&</h2>
          <div >
            <select className='dropdown-menu'>
              <option>Languages</option>
              <option>English</option>
              <option>Spanish</option>
              <option>Hindi</option>
              <option>French</option>
            </select>
          </div>
          <div className='search-container'>
            <input type="text" placeholder="Search..." />
            <FaSearch className='search' style={{ cursor: 'pointer' }} />
          </div>
        </div>
      </header>

      <div id='nav'>
        <div className='news-section flex'>
          {/* <div className=''> */}

          <h4>Crime</h4>
          <h4>Sports</h4>
          <h4>Politics</h4>
          <h4>Entertainment</h4>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default Header
