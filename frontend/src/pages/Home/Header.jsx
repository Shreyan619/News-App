import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import { LuSunSnow } from "react-icons/lu"
import "../../styles/header.css"

const Header = () => {
  const [scroll, setScroll] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

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

  const handleMouseEnter = () => {
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    setDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  }


  return (
    <>
      <header id='header' className={scroll ? 'scrolled' : ''}>
        <div className='main'>
          <div className="logo-nav">
            <LuSunSnow className='sun' />
            <h2>NEW&</h2>
            <ul className='news-group'>
              {/* <li><a href='#latest'>Latest</a></li>
              <li>Sports</li> */}
              <li><Link to="/article/english">English</Link></li>
              <li><Link to="/article/france">France</Link></li>
              <li><Link to="/article/spain">Spain</Link></li>
              <li><Link to="/article/hindi">Hindi</Link></li>
              <div
                className="dropdown-container"
                onMouseEnter={handleMouseEnter}
              >
                <IoMenu className='lines' style={{ cursor: 'pointer' }} />
                {dropdownOpen && (
                  <div
                    className="dropdown-content"
                    onMouseEnter={handleMouseEnter}  // Keep dropdown open when hovering over it
                    onMouseLeave={handleMouseLeave}  // Close dropdown when moving out
                  >
                    <Link to="/login">Login</Link>
                    <Link to="/signup">SignUp</Link>
                    <Link to="/article/english">English</Link>
                    <Link to="/article/france">France</Link>
                    <Link to="/article/spain">Spain</Link>
                    <Link to="/article/hindi">Hindi</Link>
                  </div>
                )}
              </div>
            </ul>
          </div>
          <div className='languages-search-container'>
            <div className='search-container'>
              <input type="text" placeholder="Search..." />
              <FaSearch className='search' style={{ cursor: 'pointer' }} />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
