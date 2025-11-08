import React from 'react'
import Button from '../components/Button'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from "react"
import Input from '../components/Input'
import { toast } from 'react-toastify'
import { useAuth } from '../contexts/AuthContext'


function SignUp() {

  const navigate = useNavigate();

  const [email,setEmail]=useState("");
  const [username,setUsername]=useState("")
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword]=useState("");
  const [image,setImage] =useState(null);
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();

  

  const handleSignUp = async(e) =>{
    e.preventDefault(); 
    
    if(password !== confirmPassword){
      toast.error("Password do not match!");
      return;
    }
    setLoading(true);
    try{

      //THIS implemented inside the AuthContext
      await signUp({email,password,username,image});

      toast.success("Registration successfull");
      navigate('/login');
      
    }catch(error){
      console.log(error);
      toast.error("Registration failed");
      
    }finally{
      setLoading(false);
    }
  }

  return (
    <div className='bg-gray-100 w-full h-screen items-center flex justify-center'>
      <div className='p-8 bg-white flex flex-col rounded-xl items-center justify-center gap-8 shadow-lg w-full max-w-md max-h-md'>

        <h1 className='text-3xl font-bold text-gray-900'>Sign Up</h1>

        <form className='flex flex-col gap-5 w-full' action="" onSubmit={handleSignUp}>
          
          <Input 
            type="email" 
            placeholder="Email" 
            name="email"
            onChange={e=>setEmail(e.target.value)}
            required>
          </Input>

          <Input 
            type="text" 
            placeholder="Username" 
            name="username"
            onChange={e=>setUsername(e.target.value)}
            required>
          </Input>
          
          <Input 
            type="password" 
            placeholder="Password" 
            name="password"
            onChange={e=>setPassword(e.target.value)}
            required>
          </Input>

          <Input 
            type="password" 
            placeholder="Confirm Password" 
            name="confirmPassword"
            onChange={e=>setConfirmPassword(e.target.value)}
            required>
          </Input>

          <div className='flex'>
              <label htmlFor="">Upload an image</label>
          <Input
            type="file"
            placeholder="Upload an image"
            name="image"
            onChange={(e)=>setImage(e.target.files[0])}
            required
          ></Input>
          </div>

          <Button>
            <div className="flex items-center justify-center gap-2">
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>Sign Up</span>
            </div>
          </Button>
        </form>

        <p className='text-gray-600'>
          Already have an account? 
          <Link to="/login" className='text-blue-600 hover:underline ml-1'>Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default SignUp