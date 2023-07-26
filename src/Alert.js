import React from 'react';

const Alert = ({ type, message }) => {
    const alertClasses = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
      warning: 'bg-yellow-500',
    };
  
    return (
      <div className={`p-4 mb-4 text-white ${alertClasses[type]} rounded-lg`}>
        {message}
      </div>
    );
  };
  export default Alert; 
