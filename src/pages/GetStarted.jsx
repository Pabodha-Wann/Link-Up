import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'




function GetStarted() {

  return (
    <div className='bg-stone-900 text-white h-screen flex flex-col items-center justify-center space-y-8'>
        
        <h1 className='text-3xl text-blue-600 tracking-tighter'>Welcome to LinkUp!</h1>
        <p>Connect with your team and friends in real-time. Sign up or log in to start chatting instantly.</p>

        <Link to="./login">
            <Button>Get Started</Button>
        </Link>


        
        
    </div>
  )
}

export default GetStarted