import ClassTimes from './components/ClassTimes';
import CourseList from './components/CourseList';
import ClassSchedule from './components/ClassSchedule';
import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Example() {
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [selectedTimes, setSelectedTimes] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState([]);
    const [selectedSize, setSelectedSize] = useState([]);

    const handleSubmit = (event) => {
        // submit the form and display the results in the admin inbox
        event.preventDefault();
        const data = new FormData(event.target);
        const formJson = Object.fromEntries(data.entries());
    };

  return (
    <div class="container mx-auto px-10 max-w-screen-lg">
      <Routes>
      </Routes>
      <div>
        
        <div class="px-4 sm:px-0 mt-5 ml-5">
            <h3 class="text-base font-semibold leading-7 text-gray-900">Preferences Form</h3>
            <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Select your preferences below and click save.</p>
        </div>

        
        <div class="mt-6 border-t border-gray-100 ml-5">
            
            <dl class="divide-y divide-gray-100">
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900">Full name</dt>
                <dd class="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">Professor Name</dd>
            </div>
   

            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900">Courses</dt>
                <CourseList></CourseList>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900">Class Times
                <p class="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Use military format.</p>
                </dt>
                
                <ClassTimes>  </ClassTimes>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900">Class Schedule</dt>
                <ClassSchedule></ClassSchedule>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900">Class Size</dt>
                <input
                id="class-size"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-grey-300 rounded-md"
                />
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt class="text-sm font-medium leading-6 text-gray-900 mb-4">Technical Requirements</dt>
                <dd>    
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="form-checkbox"/>
                    <span className="ml-2">HDMI</span>
                </label>
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="form-checkbox"/>
                    <span className="ml-2">Projector</span>
                </label>
                <label className="flex items-center text-sm">
                    <input type="checkbox" className="form-checkbox"/>
                    <span className="ml-2">Whiteboard</span>
                </label>
                </dd>
            </div>
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 mb-5">
                <dt class="text-sm font-medium leading-6 text-gray-900">Other</dt>
                <input
                id="class-size"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-grey-300 rounded-md"
                />
                
            </div>

            <Link
                      
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 w-full"
                      name="submit"
                      id="form-submit"
                      accessKey="l"
                    >
                      <span class="mt-1 flex justify-end items-end" >Submit Preferences</span>
                    </Link>


            
            </dl>
            </div>

        </div>

    </div>
  )
}
