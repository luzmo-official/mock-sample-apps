import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from "react-router-dom";
import Home from './home/Home';
import Portal from './portal/Portal';
import Investor from './investor/Investor';
import Login from './login/login';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/investor" element={<Investor />} />
        <Route path="/portal" element={<Portal />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
