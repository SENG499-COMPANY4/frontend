import React, { useState } from 'react';

const ClassSchedule = () => {
  const [selectedDays, setSelectedDays] = useState([]);

  const handleDaySelection = (day) => {
    if (selectedDays.includes(day)) {
        setSelectedDays(selectedDays.filter((days) => days !== day));
        } else {
        setSelectedDays([...selectedDays, day]);
        }
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
                onChange={() => handleDaySelection('Course 1')}
              />
              <span className="ml-2 dark:text-white">MTW</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => handleDaySelection('Course 2')}
              />
              <span className="ml-2 dark:text-white">TH</span>
            </label>
          </li>
          <li>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox"
                onChange={() => handleDaySelection('Course 2')}
              />
              <span className="ml-2 dark:text-white">MWF</span>
            </label>
          </li>

          {/* Add more courses as needed */}
        </ul>
      </div>
    </div>
  );
};

export default ClassSchedule;
