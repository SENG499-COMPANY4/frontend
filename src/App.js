import './App.css';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './contexts/UserContext'; // adjust the path as needed
import logo from './logo.png';
import API from "./api";

import('preline');

function App() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const { setUser } = useContext(UserContext);
  const [password, setPassword] = useState('')

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    let result = await logIn(username, password);
  };

  const logIn = async (username, password) => {
    try {
      const result = await fetch("https://spring-sky-3750.fly.dev/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });
      const resultData = await result.json();
        
        if (resultData.accountType === "admin") {
            setUser({ role: 'admin', username: username });
            navigate('/administrator');            
        } 
        else if(resultData.accountType === "professor"){
            setUser({ role: 'professor', username: username });
            navigate('/professor');            
        }
        else {
            navigate('/');
        }
        
    } catch (err) {
        console.error(err);
        if (err.response && err.response.status === 401) {
          // The request returned a 401 Unauthorized error
          console.log("Unauthorized access. Please check your credentials.");
          alert("Unauthorized access. Please check your credentials.");
        }
    }
  };
  

  const handleUsernameChange = (event) => {
    setUsername(event.target.value); // Update username state when input changes
  };

  return (
    <html class="h-full">
      <body class="dark:bg-slate-900 bg-gray-100 flex h-full items-center py-16 min-h-screen">
        <main class="w-full max-w-md mx-auto p-6">
          <div class="mt-7 bg-white border border-gray-200 rounded-xl shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div class="p-4 sm:p-7">
              <div class="text-center">
                <img src={logo} loading="lazy" class="w-50 px-20 py-5" alt="uvic logo" />
                <h1 class="block text-2xl font-bold text-gray-800 dark:text-white">Sign in</h1>
              </div>
              <div class="mt-5">
                <div class="py-3 flex items-center text-xs text-gray-400 uppercase border-t border-gray-200 dark:text-gray-500 dark:border-gray-600"></div>

                {/* <!-- Form --> */}
                <form onSubmit={handleFormSubmit}>
                  <div class="grid gap-y-4">
                    <div>
                      <label for="username" class="block text-sm mb-2 dark:text-white">Username</label>
                      <div class="relative">
                        <input
                          type="text"
                          id="username"
                          name="username"
                          class="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
                          required
                          aria-describedby="username-error"
                          value={username}
                          onChange={handleUsernameChange}
                        />
                        <div class="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                          <svg
                            class="h-5 w-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p class="hidden text-xs text-red-600 mt-2" id="username-error">
                        Please include a valid username so we can get back to you
                      </p>
                    </div>
                    {/* <!-- End Form Group --> */}

                    {/* <!-- Form Group --> */}
                    <div>
                      <div class="flex justify-between items-center">
                        <label for="password" class="block text-sm mb-2 dark:text-white">Password</label>
                        <a
                          class="text-sm text-blue-600 decoration-2 hover:underline font-medium"
                          href="../examples/html/recover-account.html"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div class="relative">
                        <input
                          type="password"
                          id="password"
                          name="password"
                          class="py-3 px-4 block w-full border border-gray-200 rounded-md text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 "
                          required
                          aria-describedby="password-error"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <div class="hidden absolute inset-y-0 right-0 flex items-center pointer-events-none pr-3">
                          <svg
                            class="h-5 w-5 text-red-500"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            aria-hidden="true"
                          >
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
                          </svg>
                        </div>
                      </div>
                      <p class="hidden text-xs text-red-600 mt-2" id="password-error">8+ characters required</p>
                    </div>
                    {/* <!-- End Form Group --> */}

                    {/* <!-- Checkbox --> */}
                    <div class="flex items-center">
                      <div class="flex">
                        <input
                          id="remember-me"
                          name="remember-me"
                          type="checkbox"
                          class="shrink-0 mt-0.5 border-gray-200 rounded text-blue-600 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:focus:ring-offset-gray-800"
                        />

                      </div>
                      <div class="ml-3">
                        <label for="remember-me" class="text-sm dark:text-white">Remember me</label>
                      </div>
                    </div>
                    {/* <!-- End Checkbox --> */}

                    {/* <button
                      type="submit"
                      class="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800"
                    >
                      Sign in
                    </button> */}

                    {/* <Link
                      to="/administrator"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 w-full"
                      name="submit"
                      id="form-submit"
                      accessKey="l"
                    > */}

                    <button
                      type="submit"
                      className="py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md border border-transparent font-semibold bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all text-sm dark:focus:ring-offset-gray-800 w-full"
                      name="submit"
                      id="form-submit"
                      accessKey="l"
                    >
                      <span class="mt-1 flex justify-end items-end" >Sign in</span>
                    </button>
                  </div>
                </form>
                {/* <!-- End Form --> */}
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>

  );
}

export default App;