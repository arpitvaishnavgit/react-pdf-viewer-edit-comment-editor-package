import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './Pdf.js';

const App = () => {
  return (
    <Router>
        <Routes>
          
          <Route exact path='/:type/:id' element={<Home />} />
        </Routes>
    </Router>
  );
};


export default App;