import React from 'react'
import Input from "../components/Input"

function SearchBar({ onChange, placeholder = "Search chats" }) {
  return (
    <div className='relative'>
        
        
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
        >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        
        <Input 
            placeholder={placeholder} 
            onChange={onChange}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-lg focus:bg-white"
        />
    </div>
  )
}

export default SearchBar