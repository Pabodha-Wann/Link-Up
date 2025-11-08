import React, { useEffect,useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

function Contact({chat,onClick,active}) {

  const {fetchUserData} = useAuth();
  const [data,setData] = useState(null);


  useEffect(()=>{
    const getData = async()=>{
      if(!chat?.receiverId) return; 
      const data = await fetchUserData(chat.receiverId);
      setData(data);
      
      
    }
    getData();
    
  },[chat,fetchUserData])

  return (
    <div>
        <div className={`
                flex items-center p-3 rounded-lg cursor-pointer w-full transition-colors 
                relative
                ${active 
                    //Active State 
                    ? "bg-indigo-50 border-l-4 border-indigo-600" 
                    //Hover State
                    : "hover:bg-gray-100"
                }
            `}  
        onClick={onClick}>

            <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                <img src={data?.imageURL} alt="" className='h-full w-full object-cover ' />
            </div>

            <div className='flex flex-col flex-1 min-w-0'>
                <div className='text-base font-semibold text-gray-800 truncate'>{data?.username}</div>
                <div className='text-sm text-gray-500 truncate'>{chat.lastmessage || "Start a Coversation"}</div>
            </div>

        </div>

        {/* Unread Badge (Right side)
        <div className='flex flex-col items-end text-xs ml-2 flex-shrink-0'>
                
                {/* Display Unread Badge only if count > 0 */}
                {/* {chat.unreadCount > 0 && (
                    <span className="
                        mt-1 px-2 py-0.5 text-xs font-bold text-white 
                        bg-indigo-600 rounded-full min-w-[24px] text-center
                    ">
                        {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </span>
                )} */}
        {/* </div> */}
    </div>
    
  )
}

export default Contact