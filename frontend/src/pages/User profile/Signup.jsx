import React, { useState } from 'react'
import "../../styles/signup.css"
import { useCreateMutation } from '../../redux/api/userapi'
import toast from 'react-hot-toast'

const Signup = () => {
  const [create] = useCreateMutation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [picture, setPPicture] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault()

    try {
      const userData = {
        name: name,
        email,
        password,
        provider: 'local',
        // picture
      }
      const res = await create(userData)
      if ("data" in res) {
        toast.success("Account Created")
        setName('');
        setEmail('');
        setPassword('');
        // setProfilePicture(null)
      } else {
        const error = res.error;
        const message = error.data?.message;
        toast.error(message)
      }
    } catch (error) {
      toast.error(error.message || 'Unknown error')
    }
  }

  return (
    <>
      <div id='prof'>
        <form className='Signup' onSubmit={handleFormSubmit}>
          <h1>Create New Account</h1>
          <input type='text'
            placeholder='Full Name'
            name='fullName'
            value={name}
            onChange={handleInputChange}
          />
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
          <div className='file-input-container'>
            <span>Profile picture (optional)</span>
            <label htmlFor='profilePicture' className='file-input-label'>
              Choose file
            </label>
            <input
              type='file'
              id='profilePicture'
              name='profilePicture'
              className='file-input'
            />
          </div>
          <button>Signup</button>
        </form>
      </div>
    </>
  )
}

export default Signup
