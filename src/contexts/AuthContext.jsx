import React, {createContext, useContext, useEffect, useState } from 'react'
import { auth,db } from "../lib/firebase"
import {createUserWithEmailAndPassword , onAuthStateChanged, signInWithEmailAndPassword ,signOut} from "firebase/auth"
import { setDoc,doc, getDoc } from 'firebase/firestore'
import { uploadToCloudinary } from '../lib/cloudinary'

const AuthContext = createContext();


export function AuthProvider({children}){

const [currentuser,setCurrentUser] = useState(null);
const [userData,setUserData] = useState(null);

const [authLoading, setAuthLoading] = useState(true);
const [userDataLoading, setUserDataLoading] = useState(false);

useEffect(()=>{
    const unsubscribe = onAuthStateChanged(auth,(user)=>{
        //console.log(user);
        if(user){
            setCurrentUser(user);
            setAuthLoading(false);
             
        }else{
            setCurrentUser(null);
        }
    })

   

    // cleanup function runs when component unmounts
    return () => unsubscribe();

},[])

useEffect(()=>{

    if(!currentuser){
        return;
    }

    const getData = async()=>{
        setUserDataLoading(true);

        try{
            const data = await fetchUserData(currentuser.uid);
            if(data){
            setUserData(data);
            console.log("SUCCESS",data);

        }
        
        }catch(err){
            console.log("User Data not available",err);
        }finally{
            setUserDataLoading(false);
        }
    }

    getData();
    

  },[currentuser])


const signUp =async({email,password,username,image})=>{
    
          //Creating a user
          await createUserWithEmailAndPassword(auth,email,password);
          const user = auth.currentUser;
    
          let imageURL = "";
          if(image){
            imageURL= await uploadToCloudinary(image)
          }
    
          //Adding user details to firestore
          await setDoc(doc(db,"Users",user.uid),{
            email:user.email,
            username:username,
            createdAt:new Date(),
            imageURL:imageURL,
            
          });

          await setDoc(doc(db,"UserChats",user.uid),{
            chats:[]
          })
}

const login = async({email,password})=>{

    await signInWithEmailAndPassword(auth,email,password);

}

const logout = ()=>{
    signOut(auth);
    setCurrentUser(null);
    setUserData(null);
}


const fetchUserData = async(uid)=>{
    const docRef = doc(db,"Users",uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
        return docSnap.data()
    }
}

return (

    <AuthContext.Provider value={{currentuser,login,logout,signUp,userData,fetchUserData,authLoading,userDataLoading}}>
        {children}
    </AuthContext.Provider>

);

}



//so we don’t repeat useContext everywhere
export function useAuth(){
    return useContext(AuthContext);
}