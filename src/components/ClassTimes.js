import React, { useState } from 'react';

const ClassTimes = () => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleStartTimeChange = (event) => {
    setStartTime(event.target.value);
  };

  const handleEndTimeChange = (event) => {
    setEndTime(event.target.value);
  };

  return (
    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <div className="sm:col-span-2">
        <div className="flex space-x-4">
          <div>
            <label htmlFor="start-time" className="block text-sm font-medium text-gray-700">
              Start
            </label>
            <input
              id="start-time"
              type="text"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-grey-300 rounded-md "
              value={startTime}
              onChange={handleStartTimeChange}
            />
          </div>
          <div>
            <label htmlFor="end-time" className="block text-sm font-medium text-gray-700">
              End
            </label>
            <input
              id="end-time"
              type="text"
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-grey-300 rounded-md"
              value={endTime}
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassTimes;
