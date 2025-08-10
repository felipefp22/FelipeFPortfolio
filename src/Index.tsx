import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import BasePage from './pages/BasePage';
import { useDispatch } from 'react-redux';



export default function Index() {
  // const dispatch = useDispatch();


  return (
    <Router>
      <Routes>

        <Route path="/" element={<Layout />}>
          <Route path="*" element={<BasePage />} />
          <Route path="/" element={<BasePage />} />


        </Route>

      </Routes>
    </Router>
  );
}