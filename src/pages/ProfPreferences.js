import { Routes } from 'react-router-dom';
import React, { useState } from 'react';
import API from '../api';

export default function Example() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    const formData = new FormData(event.target);
    const otherText = formData.get('other');

    const preferences = {
      name: 'Christina Bersh',
      other: otherText,
    };

    const jsonData = {
      preferences: [preferences],
    };

    console.log(jsonData); // You can remove this line or customize how you want to handle the generated JSON data
    API.post('/preferences', jsonData)
  };

  return (
    <div class="container mx-auto px-10 max-w-screen-lg">
      <Routes>
      </Routes>
      <div>
        
        <div class="px-4 sm:px-0 mt-5 ml-5">
            <h3 class="text-base font-semibold leading-7 text-gray-900">Preferences Form</h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Enter your preferences below and click save.</p>
        </div>

        <form onSubmit={handleSubmit}>
        <div class="mt-6 border-t border-gray-100 ml-5">
            
            <dl class="divide-y divide-gray-100">
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900">Full name</dt>
                <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Christina Bersh</dd>
            </div>

            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 mb-5">
                <dt class="text-sm font-medium leading-6 text-gray-900">Preferences</dt>
                <input
                name="other"
                id="preferences-string"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-grey-300 rounded-md"
                />
                
            </div>

            <input
              type="submit"
              value="Save"
              className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 mb-5"
              name="submit"
              id="form-submit"
              accessKey="l"
            />
            {isSubmitted && <p class="text-sm mt-2 text-green-500">Preferences successfully saved!</p>}



            
            </dl>
        </div>
        </form>

      </div>

    </div>
  )
}
