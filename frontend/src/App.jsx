import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from './pages/Home/Header'
import { Toaster } from "react-hot-toast"
import Login from './pages/User profile/Login'
import Footer from './pages/Home/Footer'
import Signup from './pages/User profile/Signup'
import './index.css'


const App = () => {
  return (
    <>
      <Router>
        <div id='root'>
          <Toaster position="top-center"/>
          <div className='main-content'>
            <Routes>
              <Route path='/home' element={<Header />} />

              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App

