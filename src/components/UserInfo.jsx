import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';


function UserInfo({ className }) {
  
  const { currentuser, userData, logout } = useAuth(); 

   const handleLogout = async()=>{
      try{
        await logout();
        toast("Logging out");
      }catch(error){
        console.log(error);
        toast.error("Failed logout");
      }
      
  }

  return (
    
    <div className={`flex justify-between items-center w-full ${className}`}>
        
        
        <div className="flex items-center gap-3">
            
            
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
                <img 
                    src={userData?.imageURL} 
                    alt="User Avatar" 
                    className='h-full w-full object-cover' 
                />
            </div>

            
            <div className='font-semibold text-gray-800 text-base'>
                {userData?.username}
            </div>

        </div>

        
        <button 
            onClick={handleLogout}
            className='p-2 rounded-full hover:bg-red-100 transition-colors group'
            aria-label="Logout"
        >
            {/* Modern Logout Icon svg*/}
            <svg xmlns="http://www.w3.org/2000/svg" 
                 className="h-6 w-6 text-gray-500 group-hover:text-red-600 transition-colors" 
                 fill="none" 
                 viewBox="0 0 24 24" 
                 stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H5a3 3 0 01-3-3v-10a3 3 0 013-3h5c1.38 0 2.65.57 3.56 1.5M16 8h1m-1 4h1m-1 4h1" />
            </svg>
        </button>
    </div>
  );
}

export default UserInfo;