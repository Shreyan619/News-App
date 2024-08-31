import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from './pages/Home/Header'
import { Toaster } from "react-hot-toast"
import Login from './pages/User profile/Login'
import Footer from './pages/Home/Footer'
import Signup from './pages/User profile/Signup'
import EnglishNews from './pages/articles/englishNews'
import Francenews from './pages/articles/FrenchNews'
import SpanishNews from "./pages/articles/SpanishNews"
import HindiNews from "./pages/articles/HindiNews"
import LatestNews from './pages/Home/Latest'
import ScrollText from './pages/Home/ScrollText'
import './index.css'


const Home = () => (
  <div>
    <div id="latest">
      <LatestNews />
    </div>

  </div>
)

const App = () => {
  return (
    <>
      <Router>
        <div id='root'>
          <Toaster position="top-center" />
          <Header />
          <ScrollText/>
          <div className='main-content'>
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/login' element={<Login />} />
              <Route path='/signup' element={<Signup />} />

              <Route path='/article/english' element={<EnglishNews />} />
              <Route path='/article/france' element={<Francenews />} />
              <Route path='/article/spain' element={<SpanishNews />} />
              <Route path='/article/hindi' element={<HindiNews />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </>
  )
}

export default App

