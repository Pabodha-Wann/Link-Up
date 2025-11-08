import SearchBar from './SearchBar'
import ContactInfo from './ContactInfo'
import Button from './Button'
import { IoMdClose } from 'react-icons/io';
import { db } from '../lib/firebase';
import { collection,  doc,  getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { arrayUnion } from 'firebase/firestore';
import Loading from './Loading';


function AddUser({setaddMode}) {
  const [allUsers, setAllUsers] = useState([]);     // full list from Firestore (exclude current)
  const [filtered, setFiltered] = useState([]);     // list of filtered user from search
  const [loading, setLoading] = useState(false);

  const {currentuser} = useAuth();


  useEffect(()=>{

    const loadUsers= async()=>{
      setLoading(true)
      try{
      const userList=[]
      const usersRef = collection(db,"Users")
      const snap = await getDocs(usersRef)

      snap.forEach((doc)=>{
        //doc.id is the unique document ID assigned by Firestore.

        //Exclude myself from the list
        if(currentuser.uid !== doc.id){
          userList.push({uid:doc.id,...doc.data()})   // attach document ID as uid
        }

        
      })

      setAllUsers(userList)
      setFiltered(userList)

      }catch(err){
        console.error("Failed to load users:", err);
      }finally{
        setLoading(false)
      }

    }

    loadUsers();

  },[currentuser]);





  const handleSearch = async(e)=>{
    
    const username = e.target.value.trim().toLowerCase();

    if(!username){
      setFiltered(allUsers)
    }
    
    const filteredList = allUsers.filter((user)=>
      user.username.toLowerCase().includes(username)
    )

    setFiltered(filteredList)
  }


  const isChatExists = async(userid)=>{
    const myChatRef = doc(db,"UserChats",currentuser.uid)
    const snap = await getDoc(myChatRef)

    if(!snap.data()) return false;

    const chats = snap.data().chats;
    return chats.some((c)=> c.receiverId === userid)

  }

  const handleAdd= async(user)=>{
    
    try{

      // don't create duplicate chat
      const exists = await isChatExists(user.uid);
      if (exists) {
        console.log("Chat already exists with:", user.uid);
        //TODO: open that chat instead of creating
        return;
      }
      

      const chatRef = doc(collection(db,"Chats"));
      

      await updateDoc(doc(db,"UserChats",user.uid),{
        //adding a new object to the user’s chats array.
        chats:arrayUnion({
          chatId:chatRef.id,
          lastmessage:"",
          receiverId:currentuser.uid,
          updatedAt: Date.now(),
          unreadCount:0
        })
      })

      await updateDoc(doc(db,"UserChats",currentuser.uid),{
        chats:arrayUnion({
          chatId:chatRef.id,
          lastmessage:"",
          receiverId:user.uid,
          updatedAt: Date.now()
        })
      })


    }catch(err){
      console.log(err);
    }
    
  }

  return (
    
    
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
    
        <div className='bg-white p-6 rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-y-auto relative'>

        <button onClick={()=>setaddMode(false)} className='absolute cursor-pointer text-gray-500 right-4 top-4 hover:text-red-500 transition-colors'>
            <IoMdClose className='w-7 h-7'/>
        </button>

        <h2 className='text-2xl font-bold text-gray-800 mb-4'>Add New Contact</h2>
        <div className='flex flex-col gap-4'>

          <SearchBar onChange={handleSearch} placeholder="Search by username..."/>

          <div className='flex flex-col gap-3 pt-2'>
                
                
                {loading ? (
                    <Loading text="Loading users..." />
                ) : filtered.length > 0 ? (
                    filtered.map(user => (
                        <div key={user.uid} className='flex justify-between items-center p-2 border-b border-gray-100 last:border-b-0'>
                            <ContactInfo user={user}/>
                            <Button 
                                onClick={() => handleAdd(user)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm transition-colors">
                                  Add
                            </Button>
                        </div>
                    ))
                ) : (
                    <div className='text-gray-500 text-center py-4'>No users found. Try a different username.</div>
                )}
            </div>

        </div>

      </div>
      
    </div>
    
  )
}

export default AddUser