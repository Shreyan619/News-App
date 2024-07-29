import React from 'react'
import { IoLogoFacebook } from "react-icons/io5";
import { BsInstagram } from "react-icons/bs";
import { FaYoutube } from "react-icons/fa";
import { BsTwitterX } from "react-icons/bs";
import "../../styles/footer.css"

const Footer = () => {
    return (
        <footer id='footer'>
            <div className='left-panel'>
                <div className='logos'>
                    <IoLogoFacebook className='icons' />
                    <BsInstagram className='icons' />
                    <FaYoutube className='icons' />
                    <BsTwitterX className='icons' />
                </div>
                <p>SK NEW&</p>
                <p>© 2016-2023 Ginkgo Agency (Pty) Ltd</p>
            </div>
            <div className='right-panel'>
                <ul>
                    <li>About</li>
                    <li>Privacy Policy</li>
                    <li>Submit a story</li>
                    <li>Become a contributor</li>
                    <li>Contact</li>
                    <li>Cookie Policy</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
