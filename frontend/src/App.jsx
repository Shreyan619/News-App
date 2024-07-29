import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from './pages/Home/Header'
import Login from './pages/User profile/Login'
import Footer from './pages/Home/Footer'
import './index.css'


const App = () => {
  return (
    <>
      <Router>
        <div id='root'>
        <div className='main-content'>
          <Routes>
            <Route path='/home' element={<Header />} />

            <Route path='/login' element={<Login />} />
          </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App

