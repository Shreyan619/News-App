import React from 'react'
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import "../../styles/login.css"

const Login = () => {
    return (
        <div id='Profile'>
            <div >
                <form className='login'>
                    <h1 className='heading'>Login</h1>
                    <input type='text' placeholder='Email' />
                    <input type='text' placeholder='Password' />
                    <Link className='forgot-pass'>Forgot password</Link>
                    <button>LOGIN</button>
                    <span className='signup'>Don't have an account yet?</span>
                    <button>CREATE ACCOUNT</button>
                </form>
            </div>
            <div className='google'>
                <span>Sign in with Google</span>
                <FcGoogle />
            </div>
        </div>

    )
}

export default Login
