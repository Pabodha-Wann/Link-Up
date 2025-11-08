import React from 'react'

function ContactInfo({user}) {
  return (
    <div className="flex justify-between items-center gap-5">

            <div className="h-12 w-12 rounded-full overflow-hidden">
                <img src={user?.imageURL} alt="" className='h-full w-full object-cover ' />
            </div>

            <div className='text-blue-800 font-semibold'>{user?.username}</div>

        </div>
  )
}

export default ContactInfo