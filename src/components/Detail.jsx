import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify';

function Detail({className}) {

  const { logout }=useAuth();

  const handlelogout = async()=>{
    try{
      await logout();
      toast("Logging out");
    }catch(error){
      console.log(error);
      toast.error("Failed logout");
    }
    
  }

  return (
    <div className={`${className} p-7 justify-center items-center`}>
      
      <div className='mt-5 flex flex-col justify-center items-center '>
        <img src="https://www.perfocal.com/blog/content/images/2021/01/Perfocal_17-11-2019_TYWFAQ_100_standard-3.jpg" alt="" className=' rounded-full w-32 h-32 object-cover'/>
        <h2 className="text-xl font-bold">Jane Doe</h2>
        <p className="text-sm text-gray-400">Lorem ipsum dolor sit amet.</p>
      </div>

      <div>


        
      </div>

      <button className='bg-red-700 w-full text-white p-2.5 rounded mt-2 cursor-pointer'>Block User</button>
      <button className='bg-blue-800 w-full text-white p-2.5 rounded mt-2 cursor-pointer' onClick={handlelogout}>Log Out</button>
      
      
    </div>
  )
}

export default Detail