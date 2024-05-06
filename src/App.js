import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import {} from 'react-router-dom'  
import { Login } from "./components/Login";
import { Resigter } from "./components/Resigter";
function App() {
  return (
    <div>
      <Login></Login>
      {/* <Resigter></Resigter> */}
    </div>
  );
}

export default App
