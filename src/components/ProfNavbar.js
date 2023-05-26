import React from 'react';
import logo from './../logo.png';

// NavBar component
const ProfNavBar = () => {
  return (
    <header class="relative flex flex-wrap sm:justify-start sm:flex-nowrap z-50 w-full bg-white text-sm py-4 dark:bg-white-800">
      <nav class="max-w-[85rem] w-full mx-auto px-4 sm:flex sm:items-center sm:justify-between" aria-label="Global">
        <div class="flex items-center justify-between">
            <div class= "mt-5" >
                <img src={logo} className="App-logo" alt="logo" style={{ width: '150px', height: 'auto' }} />
            </div>

        </div>
        <div id="navbar-with-mega-menu" class="hs-collapse hidden overflow-hidden transition-all duration-300 basis-full grow sm:block">
            <div class="flex flex-col gap-5 mt-5 sm:flex-row sm:items-center sm:justify-end sm:mt-0 sm:pl-5">
                <a class="font-medium" href="/preferences" aria-current="page">Set Preferences</a>
                <a class="font-medium" href="/professor" aria-current="page">View Schedule</a>
            </div>
            
        </div>
        
      </nav>
    </header>

  );
}

export default ProfNavBar;