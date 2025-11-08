import React, { useContext, useState } from 'react';
import Button from '../components/Button';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import { toast } from 'react-toastify';
import  { useAuth } from '../contexts/AuthContext';



function Login() {

  const navigate = useNavigate();


  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {login,currentuser} = useAuth();

  async function handleLogin(e){
    e.preventDefault();
    setLoading(true);
    try{
      await login({email,password})
      toast.success('Login successfull')
      {currentuser && navigate("/chatroom")}


    }catch(error){

      console.log(error);

      const message = 
      error.code === "auth/wrong-password" ? "Incorrect password. Try again." :
      error.code === "auth/user-not-found" ? "No account found with this email." :
      error.code === "auth/invalid-email" ? "Invalid email format." :
      error.code === "auth/invalid-credential" ? "Invalid email or password." :
      error.code === "auth/too-many-requests" ? "Too many attempts. Please try again later." :
      "Login failed. Please try again.";

      toast.error(message);

    }finally{
      setLoading(false)
    }
    
    
  }

  return (
    <div className='bg-gray-100 w-full h-screen items-center flex justify-center'>
      <div className='p-8 bg-white flex flex-col rounded-xl items-center justify-center gap-8 shadow-lg w-full max-w-md max-h-md'>
        <h1 className='text-3xl font-bold text-gray-900'>Sign in</h1>

        <form className='flex flex-col gap-5 w-full' onSubmit={handleLogin}>

          <Input 
            type="email" 
            placeholder="Email" 
            value={email}
            required
            onChange={(e)=>setEmail(e.target.value)}>
          </Input>

          <Input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required>
          </Input>

          
          
          <Button>
            <div className="flex items-center justify-center gap-2">
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>Sign In</span>
            </div>
          </Button>
        </form>

        <p className='text-gray-600'>
          Don't have an account? 
          <Link to="/signup" className='text-blue-600 hover:underline ml-1'>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;