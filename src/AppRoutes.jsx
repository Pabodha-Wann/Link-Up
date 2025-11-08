import React from 'react'
import GetStarted from './pages/GetStarted'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import ChatRoom from './pages/ChatRoom'
import { BrowserRouter,Routes,Route, Navigate } from "react-router-dom"
import {useAuth} from "./contexts/AuthContext"
import Loading from './components/Loading'

export default function AppRoutes() {

  const {currentuser,authLoading,userDataLoading}=useAuth();

  if (authLoading || userDataLoading) return <Loading text="Please wait..." fullScreen={true}/>; //wait for Firebase auth to initialize
  
  return (

    <BrowserRouter>
        <Routes>
            <Route path='/' element={<GetStarted/>}/>
            <Route path='/login' element={!currentuser? <Login/> : <Navigate to='/chatroom'/>}/>
            <Route path='/signup' element={!currentuser ? <SignUp/> : <Navigate to='/login'/>}/>
            <Route 
              path='/chatroom' 
              element={currentuser ? <ChatRoom/>: <Navigate to='/login'/>}
            />
        </Routes>
    </BrowserRouter>
    
  )
}

