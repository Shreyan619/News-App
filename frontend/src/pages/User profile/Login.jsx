import React from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import { getRedirectResult, GoogleAuthProvider, signInWithPopup, signInWithRedirect } from "firebase/auth"
import "../../styles/login.css"
import { auth } from '../../firebase';
import { useLoginMutation } from '../../redux/api/userapi';

const Login = () => {
    const [login] = useLoginMutation()

    const loginHandler = async () => {
        try {

            const provider = new GoogleAuthProvider()
            const user = await signInWithPopup(auth, provider)


            const res = await login({
                name: user.user.displayName,
                email: user.user.email,
                _id: user.uid,
                provider: 'google'
            })

            console.log(res)
            if ("data" in res) {
                toast.success(res.data.message)
            } else {
                const error = res.error
                const message = error.data?.message;
                toast.error(message)
            }

            // console.log(user)
        } catch (error) {
            toast.error("Sign in fail" + (error.message || 'Unknown error'))
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
                    <button type='submit'>LOGIN</button>
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
