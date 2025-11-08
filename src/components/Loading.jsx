

import React from "react";

export default function Loading({ fullScreen = false, text = "Loading..." }) {
  +9
  const fullScreenClass = "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white"; 
  const inlineClass = "flex items-center justify-center gap-3"; 

  return (
    <div className={`${fullScreen ? fullScreenClass : inlineClass} p-4`}>
      <div className={`flex flex-col items-center gap-4 ${fullScreen ? 'w-full max-w-sm' : ''}`}>
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">

          <div 
            className="h-full bg-indigo-600 animate-pulse" 
            style={{ 
              // Set the width to simulate movement. Using animate-pulse for a fading effect.
              // For a true progress bar, you'd use a custom keyframe animation 
              // but animate-pulse is a quick Tailwind way to show activity.
              width: '60%' 
            }}
          ></div>
        </div>

        
        <span className="text-md text-gray-700 font-medium">
          {text}
        </span>
      </div>

    </div>
  );
}