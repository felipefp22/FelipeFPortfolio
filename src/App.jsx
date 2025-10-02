import { useEffect, useState } from 'react'

import './App.css'
import Index from './Index'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from 'react-redux';
import { changeView } from './redux/viewSlice';


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();

  useEffect(() => {
    const handleResize = () => {
      dispatch(changeView(window.innerWidth > 768));
    };

    handleResize(); // Initial check
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Index />
    </>
  )
}

export default App
