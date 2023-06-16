import React from 'react';
import logo from '../logo.png'
import { HiOutlineMail } from 'react-icons/hi'
import { BiHelpCircle, BiLogOut, BiEnvelope } from 'react-icons/bi';
import { AiOutlineSchedule, AiFillSchedule, AiOutlineMail, AiOutlineForm } from 'react-icons/ai';
import { BsCalendarRange, BsEnvelopeFill, BsSend } from 'react-icons/bs';

// NavBar component
const Navbar = ({ isLoggedIn, isAdmin, isProfessor }) => {
  return (
    <div>
      <header class="flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white border-b border-gray-200 text-sm py-3 sm:py-0 dark:bg-gray-800 dark:border-gray-700">
        <nav class="relative max-w-7xl w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between sm:px-6 lg:px-8" aria-label="Global">
          <div class="flex items-center justify-between">
            <a href='/administrator'>
              <img src={logo} class="flex-none h-auto w-24" alt="logo" />
            </a>
            {/* <img src={logo} className="App-logo" alt="logo" style={{ width: '150px', height: 'auto' }} /> */}
            <div class="sm:hidden">
              <button type="button" class="hs-collapse-toggle p-2 inline-flex justify-center items-center gap-2 rounded-md border font-medium bg-white text-gray-700 shadow-sm align-middle hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800" data-hs-collapse="#navbar-collapse-with-animation" aria-controls="navbar-collapse-with-animation" aria-label="Toggle navigation">
                <svg class="hs-collapse-open:hidden w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
                </svg>
                <svg class="hs-collapse-open:block hidden w-4 h-4" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </div>
          <div id="navbar-collapse-with-animation" class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">


            <div class="flex flex-col gap-y-4 gap-x-0 mt-5 sm:flex-row sm:items-center sm:justify-end sm:gap-y-0 sm:gap-x-7 sm:mt-0 sm:pl-7">
              {isAdmin && isLoggedIn && (
                <a class="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-gray-400 dark:hover:text-gray-500" href="/admininbox">
                  <div class="flex items-center">
                    <span class="mr-2">Inbox</span>
                    <BiEnvelope />
                  </div>
                </a>
              )}
              {isAdmin && isLoggedIn && (
                <a class="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-gray-400 dark:hover:text-gray-500" href="/administrator">
                  <div class="flex items-center">
                    <span class="mr-2">Schedule</span>
                    <BsCalendarRange />
                  </div>
                </a>
              )}
              {isProfessor && isLoggedIn && (
                <a class="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-gray-400 dark:hover:text-gray-500" href="/preferences">
                  <div class="flex items-center">
                    <span class="mr-2">Submit Preferences</span>
                    <BsSend />
                  </div>
                </a>
              )}
              {isProfessor && isLoggedIn && (
                <a class="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-gray-400 dark:hover:text-gray-500" href="/professor">
                  <div class="flex items-center">
                    <span class="mr-2">Schedule</span>
                    <BsCalendarRange />
                  </div>
                </a>
              )}
              {isAdmin && isLoggedIn && (
                <a class="font-medium text-gray-500 hover:text-gray-400 sm:py-6 dark:text-gray-400 dark:hover:text-gray-500" href="/help">
                  <div class="flex items-center">
                    <span class="mr-2">Help</span>
                    <BiHelpCircle />
                  </div>
                </a>
              )}


              {/* Log in button */}
              {isLoggedIn ? (
                // If logged in
                <a class="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-l sm:border-gray-300 sm:my-3 sm:pl-6 dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-500">

                  {/* Profile picture */}
                  <div class="hs-dropdown relative inline-flex">
                    <button id="hs-dropdown-unstyled" type="button" class="hs-dropdown-toggle inline-flex justify-center items-center gap-x-2">
                      <img class="inline-block h-[2.375rem] w-[2.375rem] rounded-full ring-2 ring-white dark:ring-gray-80" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Image Description"></img>
                    </button>
                    <div class="hs-dropdown-menu transition-[opacity,margin] duration-[0.1ms] sm:duration-[150ms] hs-dropdown-open:opacity-100 opacity-0 sm:w-30 hidden z-10 bg-white sm:shadow-md rounded-lg p-2 dark:bg-gray-800 sm:dark:border dark:border-gray-700 dark:divide-gray-700 before:absolute top-full sm:border before:-top-5 before:left-0 before:w-full before:h-5">
                      <a class="flex justify-between items-center gap-x-3.5 py-2 px-3 rounded-md text-sm text-gray-800 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300" href="#">
                        Log out <BiLogOut />
                      </a>
                    </div>
                  </div>

                </a>
              ) : (
                // If not logged in
                <a class="flex items-center gap-x-2 font-medium text-gray-500 hover:text-blue-600 sm:border-l sm:border-gray-300 sm:my-6 sm:pl-6 dark:border-gray-700 dark:text-gray-400 dark:hover:text-blue-500" href="#" data-hs-overlay="#login-modal">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                  </svg>
                  Log in
                </a>
              )}

            </div>
          </div>
        </nav>
      </header>

      <div id="login-modal" class="hs-overlay hidden w-full h-full fixed top-0 left-0 z-[60] overflow-x-hidden overflow-y-auto">
        <div class="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
          <div class="flex flex-col bg-white border shadow-sm rounded-xl dark:bg-gray-800 dark:border-gray-700 dark:shadow-slate-700/[.7]">
            <div class="p-20 overflow-y-auto">
              <div class="relative container m-auto px-6 text-gray-500 md:px-12 xl:px-10">
                <div class="m-auto md:w-[80%] lg:w-[80%] xl:w-full">
                  <div class="rounded-xl bg-white shadow-xl p-12 sm:p-20">
                    <div class="p-6 sm:p-12">
                      <div class="space-y-4">
                        <img src={logo} loading="lazy" className="w-55" alt="uvic logo" />
                        <h2 class="mb-8 text-2xl text-cyan-900 font-bold">Sign in <br /></h2>
                      </div>
                      <div class="mt-6 grid space-y-4">
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

                      <div class="mt-5 flex justify-end items-end">
                        <button class="group h-12 px-5 border-2 border-gray-300 rounded-full transition duration-300 
                                            bg-blue-800 text-white hover:bg-blue-200 focus:bg-blue-50 active:bg-blue-100 mt-4 active:text-white mt-4 ml-auto"
                          name="submit" id="form-submit" accesskey="l" type="submit">
                          <span>Sign in</span>
                        </button>
                      </div>
                    </div>
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

export default Navbar;