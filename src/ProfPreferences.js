import ClassTimes from './components/ClassTimes';
import CourseList from './components/CourseList';
import ClassSchedule from './components/ClassSchedule';
import ProfNavbar from './components/ProfNavbar';
import { Routes, Route } from 'react-router-dom';

export default function Example() {
  return (
    <div class="container mx-auto px-10 max-w-screen-lg">
      <ProfNavbar></ProfNavbar>
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
                <dt class="text-sm font-medium leading-6 text-gray-900">Class Times</dt>
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
            <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 mb-20">
                <dt class="text-sm font-medium leading-6 text-gray-900">Other</dt>
                <input
                id="class-size"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-grey-300 rounded-md"
                />
            </div>
            </dl>
        </div>
        </div>

    </div>
  )
}
