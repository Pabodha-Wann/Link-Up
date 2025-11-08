import React, { useEffect, useState } from 'react'
import Chat from "../components/Chat"; 
import Detail from "../components/Detail";
import ChatList from "../components/ChatList"
import UserInfo from '../components/UserInfo';
import { useAuth } from '../contexts/AuthContext';



function ChatRoom() {
  
  const {currentuser,userData} = useAuth();
  const [openDetail,setOpenDetail] = useState(false);
  const [addMode,setaddMode] = useState(false);
  

  // activeChat: an object from UserChats array (must contain chatId, receiverId, otherUsername etc.)
  const [activeChat, setActiveChat] = useState(null);


  return (
    <div className='bg-white w-full h-screen backdrop-blur-2xl text-black flex overflow-hidden'>
      <div className='flex flex-col h-full w-80 border-r border-gray-200 bg-white'>

          <ChatList 
            className="flex-1" 
            setaddMode={setaddMode} 
            addMode={addMode} 
            activeChat={activeChat} 
            setActiveChat={setActiveChat}>

          </ChatList>
          
          <UserInfo className="p-4 border-t border-gray-200 bg-gray-50" ></UserInfo>

      </div>
      
      <Chat 
        className="flex-1 h-full" 
        setOpenDetail={setOpenDetail} 
        openDetail={openDetail} 
        activeChat={activeChat} 
        setActiveChat={setActiveChat} >

      </Chat>


      {openDetail && <Detail className="w-80 h-full border-l border-gray-200 bg-white" ></Detail>}
      
    </div>
  )
}

export default ChatRoom