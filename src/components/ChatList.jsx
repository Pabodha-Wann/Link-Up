import React, { use, useEffect, useState } from 'react'
import UserInfo from './UserInfo'
import SearchBar from './SearchBar'
import Contact from './Contact'
import AddUser from './AddUser'
import { useAuth } from '../contexts/AuthContext'
import { db } from '../lib/firebase'
import {doc, onSnapshot} from "firebase/firestore"
import Loading from './Loading'


function ChatList({className,setaddMode,addMode,activeChat,setActiveChat}) {
  const [chats,setChats]=useState([]);
  const {currentuser} = useAuth();
  const [loading,setLoading]=useState(true);



 useEffect(()=>{
    if (!currentuser?.uid) {
      setChats([]);
      setLoading(false);
      return;
    }

    

    const chatlistRef = doc(db,"UserChats",currentuser.uid)
    const unSub = onSnapshot(chatlistRef,(doc)=>{
      const data = doc.data();
      
      setChats(data?.chats||[]);
      setLoading(false);
      
    })

    return ()=>{
      unSub();
    }
  },[currentuser]);
  
  console.log(chats);

  
  
  
 return (

    
    <div className={` ${className} flex flex-col gap-4 p-4`}>
      
      
      <div className='flex justify-between items-center pb-2'>
        <h1 className='text-2xl font-extrabold text-gray-800'>Link<span className='text-indigo-600'>Up</span></h1>
        <button 
            onClick={() => setaddMode(prev=>!prev)}
            className='p-2 rounded-full hover:bg-gray-100 transition-colors'
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </button>
      </div>
      
      <div className='mb-2'>
          <SearchBar></SearchBar>
          {addMode && <AddUser setaddMode={setaddMode}/>}
      </div>
      
        
      <div className='flex flex-col gap-2 overflow-y-auto flex-1 pr-1' >

        {loading ? (<div className="flex justify-center items-center h-full text-gray-500">
            <Loading text="Loading chats..." />
          </div>):(
            chats.map((chat,index)=>{
              return <Contact 
              key={index} 
              chat={chat} 
              onClick={()=>setActiveChat(chat)} 
              active={activeChat?.id===chat.chatId}></Contact>
            })

          )}

        
      </div>
    </div>
  )
}

export default ChatList