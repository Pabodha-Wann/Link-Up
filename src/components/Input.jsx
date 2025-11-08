import React from 'react'

function Input({type , placeholder ,className,onChange, ...props}) {
  return (
    <input 
            type={type} 
            placeholder={placeholder}
            className={`px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 w-full ${className}`}
            onChange={onChange}
            {...props}
    />
  )
}

export default Input