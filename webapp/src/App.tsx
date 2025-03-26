import React from 'react';
import './styles.css';
import ChatMain from './container/chat_main';
import {
  BrowserRouter,
  Routes, // instead of "Switch"
  Route,
} from "react-router-dom";
import Header from './header/header';

function App() {
  return (
    <BrowserRouter>
     <div className="app">
     <Header/>
    <Routes>
      <Route path="/" element={<ChatMain />} />
    </Routes>
    </div>
  </BrowserRouter>
  );
}

export default App;
