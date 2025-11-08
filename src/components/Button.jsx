function Button({children , onClick , type, className = ''}) {
  return (
    <button 
      className={`${className}  bg-indigo-600 text-white font-semibold 
        py-2.5 px-6 rounded-full cursor-pointer transition-all duration-200 ease-in-out shadow-md hover:shadow-lg 
      
        hover:bg-indigo-700 
        focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50 
        `}
      onClick={onClick} 
      type={type}>
        {children}
    </button>
  )
}

export default Button