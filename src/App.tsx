import React from 'react';
import './App.css';
import "./styles/tailwind.css"
import { BrowserRouter as Router } from 'react-router-dom';
import Pages from './pages';

function App() {
  return (
    <Router>
      <Pages />
    </Router>
  );
}

export default App;
