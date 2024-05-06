import logo from './logo.svg';
import './App.css';
import Database from './database/db';
import firebase from 'firebase/compat/app';
import React, { useEffect, useState } from 'react';
import 'firebase/auth';
import { ref, set, child, getDatabase, onValue, get, remove, update } from 'firebase/database';
import 'firebase/firestore';
import 'firebase/functions';
import 'firebase/storage';
import { getStorage, deleteObject } from 'firebase/storage';
import { initializeApp } from 'firebase/app';

function App() {
  
  
}

export default App;
