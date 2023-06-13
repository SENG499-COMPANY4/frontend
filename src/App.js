import './App.css';
import { Link } from 'react-router-dom';
import logo from './logo.png'

import('preline')

function App() {

  return (

          <div class=" flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 mt-0 opacity-100 duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto sm:ml-auto smin-h-[calc(100%-3.5rem)] flex items-center">
            <div class="flex flex-col item-center bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
              <div class="p-20">
                <div class="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-10">
                  <div class="m-auto md:w-[80%] lg:w-[80%] xl:w-full">
                    <div class="rounded-xl bg-white shadow-xl p-12 sm:p-20 flex items-center">
                      <div class="p-6 sm:p-12">
                      <div class="flex flex-col items-center space-y-4">
                        <img src={logo} loading="lazy" class="w-55" alt="uvic logo" />
                        <h2 class="mb-10 text-2xl text-cyan-900 font-bold">Sign in</h2>
                        </div>

                        <div class="mt-6 grid space-y-4 flex items-center">
                          <input
                            type="text"
                            placeholder="Username"
                            class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                            hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                          />

                          <input
                            type="Password"
                            placeholder="Password"
                            class="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 
                            hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                          />
                        </div>

                        <div className="mt-2 flex justify-end items-end">
                            <Link
                              to="/administrator"
                              className="group h-10 px-4 border-2 border-gray-300 rounded-full transition duration-300 
                                        bg-blue-800 text-white hover:bg-blue-200 focus:bg-blue-50 active:bg-blue-100 mt-4 active:text-white mt-4 ml-auto"
                              name="submit"
                              id="form-submit"
                              accessKey="l"
                            >
                              <span class="mt-1 flex justify-end items-end" >Sign in</span>
                            </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

      );
}

export default App;
