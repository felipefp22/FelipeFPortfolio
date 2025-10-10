import { useEffect, useMemo, useState } from 'react'

import './App.css'
import './Custom.css'
import Index from './Index'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch, useSelector } from 'react-redux';
import { changeView } from './redux/viewSlice';
import { blueOne, borderColorOne, borderColorTwo, floatingBlackButton, fontColorOne, greenOne, mainColor, modalBackground, redOne, secondColor } from './theme/Colors';


function App() {
  const [count, setCount] = useState(0)
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.view.theme);

  useMemo(() => {
    document.documentElement.style.setProperty('--mainColor', mainColor(theme));
    document.documentElement.style.setProperty('--secondColor', secondColor(theme));
    document.documentElement.style.setProperty('--borderColorOne', borderColorOne(theme));
    document.documentElement.style.setProperty('--borderColorTwo', borderColorTwo(theme));
    document.documentElement.style.setProperty('--borderColorTwoTransparent', borderColorTwo(theme, 0.5));
    document.documentElement.style.setProperty('--fontColorOne', fontColorOne(theme));

    document.documentElement.style.setProperty('--modalBackground', modalBackground(theme));

    document.documentElement.style.setProperty('--greenOne', greenOne(theme));
    document.documentElement.style.setProperty('--redOne', redOne(theme));
    document.documentElement.style.setProperty('--blueOne', blueOne(theme));

    document.documentElement.style.setProperty('--floatingBlackButton', floatingBlackButton(theme));

  }, [theme]);

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
