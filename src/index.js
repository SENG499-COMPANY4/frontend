import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Professor from './Professor';
import Administrator from './Administrator';
import ProfPreferences from './ProfPreferences';
import Help from './pages/Help';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <body class="dark:bg-gray-800 dark:text-gray-500 min-h-screen ">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/preferences" element={<ProfPreferences />} />
        <Route path="/professor" element={<Professor />} />
        <Route path="/administrator" element={<Administrator />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
    </body>
  </React.StrictMode>
);

reportWebVitals();
