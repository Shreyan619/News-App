import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom'
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import "../../styles/login.css"
import { auth } from '../../firebase';
import { useLoginMutation, useCreateMutation } from '../../redux/api/userapi';

const Login = () => {
    const [login] = useLoginMutation()
    const [create] = useCreateMutation()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const loginHandler = async () => {
        try {

            const provider = new GoogleAuthProvider()
            const user = await signInWithPopup(auth, provider)
            console.log(user)


            const userData = {
                name: user.user.displayName,
                email: user.user.email,
                _id: user.uid,
                provider: 'google'
            }

            let res = await login(userData)

            if (res.error && res.error.data?.message === 'User not found') {
                res = await create(userData);
            }

            if ("data" in res) {
                toast.success(`Welcome ${res.data.name}`)
            } else {
                const error = res.error
                const message = error.data?.message;
                toast.error(message)
            }

        } catch (error) {
            toast.error(error.message || 'Unknown error')
        }
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        if (name === 'email') setEmail(value)
        if (name === 'password') setPassword(value)
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault()
        try {
            const userData = { email, password, provider: 'local' };
            const res = await login(userData)

            if ("data" in res) {
                toast.success(`Welcome ${res.data.name || 'User'}`)
                setEmail('')
                setPassword('')
            } else {
                const error = res.error;
                const message = error.data?.message;
                toast.error(message);
            }
        } catch (error) {
            toast.error(error.message || 'Unknown error');
        }
    }
    return (
        <div id='Profile'>
            <div style={{ display: "flex" }} >
                <form className='login' onSubmit={handleFormSubmit}>
                    <h1 className='heading'>Login</h1>
                    <input type='email'
                        placeholder='Email'
                        name='email'
                        value={email}
                        onChange={handleInputChange}
                    />
                    <input type='password'
                        placeholder='Password'
                        name='password'
                        value={password}
                        onChange={handleInputChange}
                    />
                    <Link className='forgot-pass'>Forgot password</Link>
                    <button type='submit'>LOGIN</button>
                    <span className='signup'>Don't have an account yet?</span>
                    <Link className='create' to="/signup">
                        <button>CREATE ACCOUNT</button>
                    </Link>

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
