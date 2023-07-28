import React, { useState, useEffect } from 'react';
import API from '../api';

const AllCourses = () => {
  const [schedule, setSchedule] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    API.get("/schedule", {
      headers: {
        year: "2024",
        semester: "1",
      }
    })
      .then(response => {
        setSchedule(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching schedule:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto max-w-screen-max-w-xl">
      {/* Table Section */}
      <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
        {/* Card */}
        <div className="flex flex-col">
          <div className="-m-1.5 overflow-x-auto">
            <div className="p-1.5 min-w-full inline-block align-middle">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                {/* Header */}
                <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                      All Courses
                    </h2>
                  </div>
                </div>
                {/* End Header */}

                {/* Table */}
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    {/* ... same as before ... */}
                  </thead>
                  {/* Insert loop here */}
                  <tbody className="bg-white divide-y divide-gray-200 dark:bg-slate-900 dark:divide-gray-700">
                    {schedule.map(item => {
                      const { building, coursename, day, end, id, professor, room, start, type } = item;

                      return (
                        <tr key={id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {coursename}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {professor}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {building}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {room}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {`${start} - ${end}`}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {day.join(', ')}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {/* End Table */}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Card */}
    </div>
  );
};

export default AllCourses;