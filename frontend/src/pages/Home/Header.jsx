import React from 'react'
import { IoMenu } from "react-icons/io5";
import { FaSearch } from "react-icons/fa";
import "../../styles/header.css"

const Header = () => {

  return (
    <>
      <header id='header' >
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

      <div  id='nav'>
        <div className='news-section flex'>
          {/* <div className=''> */}

            <h3>Crime</h3>
            <h3>Sports</h3>
            <h3>Politics</h3>
            <h3>Entertainment</h3>
          {/* </div> */}
        </div>
      </div>
    </>
  )
}

export default Header
