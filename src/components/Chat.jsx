import React, { useEffect, useState,useRef } from 'react'
import Input from './Input'
import Button from "./Button"
import EmojiPicker from "emoji-picker-react"
import Loading from './Loading';
import { useAuth } from '../contexts/AuthContext';
import {collection, query, orderBy, onSnapshot, addDoc, serverTimestamp,updateDoc, getDoc,doc} from "firebase/firestore"
import { db } from "../lib/firebase";
import Welcome from './Welcome';


function Chat({className,setOpenDetail,openDetail,activeChat}) {
  
  const [openEmoji,setOpenEmoji] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text,setText]=useState("");

  const {currentuser,fetchUserData}=useAuth();
  const endRef = useRef(null)
  const [peer,setPeer] = useState(null)
  

  useEffect(()=>{
    if(!activeChat?.chatId){
      setMessages([])
      setLoading(false)
      return;
    } 

    setLoading(true);

    // console.log("Active",activeChat.chatId)

      const messagesRef = collection(db,"Chats",activeChat.chatId,"messages")
      const q = query(messagesRef,orderBy("createdAt","asc"))

      const unsub = onSnapshot(q,(snapshot)=>{
        const message = snapshot.docs.map(doc => ({id:doc.id, ...doc.data()}))
        setMessages(message)
        console.log(message)
        setLoading(false)
        
      })

    console.log(messages);

    return ()=> unsub()
  },[activeChat])



  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth",block:"nearest"})

  },[messages])



  useEffect(()=>{

    if (!activeChat?.chatId || !currentuser?.uid) {
      setPeer(null);
      return;
    }

  let cancelled = false;

  const loadPeer = async () => {
    setLoading(true)
    try {
      const receiverId = activeChat.receiverId;
      if (!receiverId) {
        setPeer(null);
        return;
      }
      const data = await fetchUserData(receiverId);
      setLoading(false)
      if (!cancelled) setPeer(data ?? null);
    } catch (err) {
      console.error("loadPeer error:", err);
      if (!cancelled) setPeer(null);
    }
  };

  loadPeer();
  return () => { cancelled = true; };
    

},[activeChat,currentuser])



  function handleEmoji(e){
    setText(prev=>prev + e.emoji);
    setOpenEmoji(false)
  }

  const handleSend = async()=>{
    if(!text.trim() || !activeChat.chatId) return;

    try{

      const messagesRef = collection(db,"Chats",activeChat.chatId,"messages")

      await addDoc(messagesRef,{
        senderId:currentuser.uid,
        text:text.trim(),
        createdAt:serverTimestamp()
      })
     
      const updateData = {
        lastmessage: text.trim(),
        updatedAt: Date.now() 
      };
      
      const updateLastMessage=async(userId)=>{
        const userChatRef = doc(db, "UserChats", userId);
        const userChatSnap = await getDoc(userChatRef)

        if(userChatSnap.exists()){
          const chats = userChatSnap.data().chats || [];
          const chatIndex = chats.findIndex(chat=>chat.chatId === activeChat.chatId)

          //TODO: UPDATE THE UNREAD COUNT 
          
          
          const updatedChats = [...chats];
          updatedChats[chatIndex] = {
              ...updatedChats[chatIndex],
              ...updateData, // lastmessage, updatedAt
              
          };

             // Write the entire updated array back to Firestore
             await updateDoc(userChatRef, { chats: updatedChats });
          
        }

        

      }
      //For current user
      await updateLastMessage(currentuser.uid);

      // Update for the receiver (peer)
      if (activeChat.receiverId) {
          await updateLastMessage(activeChat.receiverId);
      }

      setText("");

      
    } catch (err) {
      console.error("send message error:", err);
    }
  }

    if (!activeChat?.chatId) {
    return (
      <div className={`${className} p-7 flex-col h-screen flex`}>
        <Welcome />
      </div>
    );
  }

  

  return (
      
    <div className={` ${className} p-7 flex-col h-full flex`}>
        {loading && <Loading text="Loading chats..." fullScreen={true}/>}

        {/* Header */}
       <div className="flex justify-between items-center p-4 bg-white sticky top-0">

            <div className="h-13 w-13 rounded-full overflow-hidden flex-shrink-0">
                <img src={peer?.imageURL ?? "/"} alt="" className='h-full w-full object-cover' />
            </div>

            <div className='font-semibold text-lg text-gray-800'>{peer?.username ?? "User"}</div>

            <button onClick={()=>setOpenDetail(prev=>!prev)}>
              <img src="https://img.icons8.com/?size=100&id=2800&format=png&color=000000" alt="" className='w-7 h-7 cursor-pointer'/>
            </button>

       </div>



      {/* Messages */}
      
      <div className="flex-1 w-full space-y-2 p-2 flex flex-col overflow-y-auto">

        {messages.map((msg)=>(
        <div 
          key={msg.id} 
          className={`flex mb-4 ${msg.senderId === currentuser.uid ? 'self-end' : 'self-start'}`}>

          <div className={`max-w-xs md:max-w-md lg:max-w-lg ${msg.senderId === currentuser.uid ? 'items-end' : 'items-start'}`}>

              <p className={`p-3 rounded-xl shodow-md ${msg.senderId === currentuser.uid ? "bg-indigo-600 text-white rounded-t-xl rounded-bl-xl rounded-br-sm": "bg-gray-200 text-gray-900 rounded-t-xl rounded-tr-sm rounded-bl-xl"}`}>
                {msg.text}
              </p>

              {/* Timestamp */}
              <span className={`text-xs text-gray-500 mt-1 ${msg.senderId === currentuser.uid ? 'text-right' : 'text-left'} block`}>
                
                {msg.createdAt && typeof msg.createdAt.toDate === "function"
                  ? (date => {
                        const datePart = date.toLocaleDateString([], { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                        });
                        const timePart = date.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                        });
                        return datePart + ', ' + timePart; 
                    })(msg.createdAt.toDate())
                  : msg.time ?? ""}
                
              </span>
          </div>
        </div>

        ))}
        <div ref={endRef} />

      </div>


      {/* Message Bar */}

      
     <div className="flex gap-2 items-center w-full p-4 border-t border-gray-200 bg-white">
          <div className='flex-1 relative'>
                
              <Input 
                  type="text"
                  placeholder="Type a message..."
                  
                  className="w-full pl-4 pr-12 py-3 bg-gray-50 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 rounded-full transition-colors" 
                  value={text}
                  onChange={e=> setText(e.target.value)}
                  
                  onKeyDown={(e) => {if (e.key === 'Enter' && text.trim()) handleSend()}}
              />

              {/* EMOJI BUTTON */}
              <button 
                  className='absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-200 transition-colors'
                  onClick={()=>setOpenEmoji(prev=>!prev)}
                  aria-label="Open emoji picker"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </button>
              
              {/* EMOJI PICKER */}
              <div className='absolute right-0 bottom-14 z-20'> 
                  <EmojiPicker open={openEmoji} onEmojiClick={e=>handleEmoji(e)} />
              </div>

          </div>

          {/* SEND BUTTON  */}
          
          <Button 
              onClick={handleSend} 
              className="p-3 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors shadow-lg flex-shrink-0"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white transform rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
          </Button>
          
      </div>
    </div>
      
    
  )
}

export default Chat