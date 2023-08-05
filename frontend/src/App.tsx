import React from 'react';
import './App.css';
import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import HolidaysPage from './components/HolidaysPage/HolidaysPage';
import AdminPage from './components/AdminPage/AdminPage';
import AddVacation from './components/AdminPage/AddVacation';
import EditVacation from './components/AdminPage/EditVacation';
import ReportPage from './components/AdminPage/ReportPage';




function App() {
  return (
    <HashRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/holidays" element={<HolidaysPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/addvacation" element={<AddVacation />} />
          <Route path="/editvacation/:holidayId" element={<EditVacation />} />

        </Routes>
      </div>
    </HashRouter>
  );
}

export default App;
