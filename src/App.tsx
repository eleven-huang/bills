import React from 'react';
import logo from './logo.svg';
import './App.css';
import Bills from './bills/bills'
import Header from './header/header'

function App() {
  return (
    <div className="App">
      <Header />
      <Bills />
    </div>
  );
}

export default App;
