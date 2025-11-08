import React from 'react';

function Welcome() {
  return (
    
      <div className="h-full w-full flex flex-col items-center justify-center text-center p-6">
      <img
        src="https://img.icons8.com/?size=100&id=ZlNFJHVb3H3N&format=png&color=000000" // replace with your asset or URL
        alt="Welcome"
        className="w-40 h-40 mb-6"
      />
      <h2 className="text-2xl font-semibold mb-2">Select a chat to start messaging</h2>
      <p className="text-gray-500">Or start a new conversation from the left panel.</p>
    </div>
    
  );
}

export default Welcome;




