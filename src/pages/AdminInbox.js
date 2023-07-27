//About React component
import { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import { BsPersonCircle } from 'react-icons/bs';
import API from '../api';

const handleDelete = (id) => {
    // The delete function does not currently work based on the current api
    console.log(`Delete item with Name: ${id}`);
}

const AdminInbox = () => {
    const [data, setData] = useState([]); // holds professors and their preferences

    useEffect(() => {
        API.get('/preferences').then(response => {
            // Only keep professors with non-empty preferences
            const filteredData = response.data.filter(item => item.preferences.trim() !== "");
            setData(filteredData);
            console.log(filteredData);
        }).catch(error => {
            console.error("Failed to fetch preferences:", error);
        });
    }, []);
    
    console.log(API.get('/preferences'));
    return (
        <div class="container mx-auto px-10 max-w-screen-lg">
            {/* <!-- Table Section --> */}
            <div class="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
                {/* <!-- Card --> */}
                <div class="flex flex-col">
                    <div class="-m-1.5 overflow-x-auto">
                        <div class="p-1.5 min-w-full inline-block align-middle">
                            <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden dark:bg-slate-900 dark:border-gray-700">
                                {/* <!-- Header --> */}
                                <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-gray-700">
                                    <div>
                                        <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                            Inbox
                                        </h2>
                                    </div>

                                    <div>
                                        <div class="inline-flex gap-x-2">

                                        </div>
                                    </div>
                                </div>
                                {/* <!-- End Header --> */}

                                {/* <!-- Table --> */}
                                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead>
                                        <tr>

                                            <th scope="col" class="px-6 py-3 text-left">
                                                <div class="flex items-center gap-x-2">
                                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                        Professor
                                                    </span>
                                                </div>
                                            </th>

                                            <th scope="col" class="px-6 py-3 text-left">
                                                <div class="flex items-center gap-x-2">
                                                    <span class="text-xs font-semibold uppercase tracking-wide text-gray-800 dark:text-gray-200">
                                                        Preferences
                                                    </span>
                                                </div>
                                            </th>

                                            <th scope="col" class="px-6 py-3 text-right"></th>
                                        </tr>
                                    </thead>


                                    {/* Insert loop here*/}
                                    
                                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                    {data.map((prof, index) => (
                                        <tr>
                                            <td class="h-px w-px whitespace-nowrap">
                                                <div class="px-6 py-3">
                                                    <div class="flex items-center gap-x-2">
                                                        {/* <img class="inline-block h-6 w-6 rounded-full" src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description" /> */}
                                                        <BsPersonCircle class="h-[1.5rem] w-[1.5rem] text-gray-600 inline-block"/>
                                                        <div class="grow">
                                                            <span class="text-sm text-gray-600 dark:text-gray-400">{prof.professor}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            <td class="h-px w-px whitespace-nowrap">
                                                <div class="px-6 py-3">
                                                <span class="text-sm text-gray-600 dark:text-gray-400">{prof.preferences}</span>
                                                </div>
                                            </td>
                                            
                                            <td class="flex justify-end items-center pt-4 pr-6">
                                                <button 
                                                    onClick={() => handleDelete(prof.professor)} 
                                                    className="focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                                                    aria-label="Delete">
                                                    <BiTrash />
                                                </button>
                                            </td>


                                        </tr>
))}
                                    </tbody>
                                </table>
                                {/* <!-- End Table --> */}

                                {/* <!-- Footer --> */}
                                <div class="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-t border-gray-200 dark:border-gray-700">
                                    <div>
                                        <p class="text-sm text-gray-600 dark:text-gray-400">
                                        <span class="font-semibold text-gray-800 dark:text-gray-200">{data.length}</span> {data.length === 1 ? 'result' : 'results'}
     
                                        </p>
                                    </div>

                                    <div>
                                        <div class="inline-flex gap-x-2">
                                            <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                                                </svg>
                                                Prev
                                            </button>

                                            <button type="button" class="py-2 px-3 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
                                                Next
                                                <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                                    <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- End Footer --> */}
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!-- End Card --> */}
            </div>
            {/* <!-- End Table Section --> */}

        </div>
    );
}

export default AdminInbox;
