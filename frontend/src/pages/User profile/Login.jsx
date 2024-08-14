import React from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import "../../styles/login.css"
import { auth } from '../../firebase';

const Login = () => {

    const loginHandler = async () => {
        try {

            const provider = new GoogleAuthProvider()
            const user = await signInWithPopup(auth, provider)
            console.log(user)
        } catch (error) {
            toast.error("Sign in fail")
        }
    }

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

            <button className='google'
                onClick={loginHandler}>
                <span>Sign in with Google</span>
                <FcGoogle />
            </button>

        </div>

    )
}

export default Login
