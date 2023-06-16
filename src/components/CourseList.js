import React, { useState } from 'react';

const CourseList = () => {
  const [selectedCourses, setSelectedCourses] = useState([]);

  const handleCourseSelection = (courseName) => {
    if (selectedCourses.includes(courseName)) {
      setSelectedCourses(
        selectedCourses.filter((course) => course !== courseName)
      );
    } else {
      setSelectedCourses([...selectedCourses, courseName]);
    }
    console.log(selectedCourses);
  };

  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 text-sm text-gray-700 ">
      <div className="sm:col-span-2">
        <ul className="space-y-2">
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => handleCourseSelection('Course 1')}
              />
              <span className="ml-2">SENG 499</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => handleCourseSelection('Course 2')}
              />
              <span className="ml-2">SENG 440</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => handleCourseSelection('Course 2')}
              />
              <span className="ml-2">SENG 474</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => handleCourseSelection('Course 2')}
              />
              <span className="ml-2">ECE 455</span>
            </label>
          </li>
          {/* Add more courses as needed */}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;
