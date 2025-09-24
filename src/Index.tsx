import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import BasePage from './pages/BasePage';
import { verifyIfIsAdmin } from './services/AuthService';
import LoginOrRegisterPage from './pages/LoginOrRegisterPage';

export default function Index() {
  // const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('access_token') ? true : false);
  const [isAdmAuthenticated, setIsAdmAuthenticated] = useState(localStorage.getItem('isAdmMasterAuthenticated') ? true : false);
  const [isAdmMasterAuthenticated, setIsAdmMasterAuthenticated] = useState(localStorage.getItem('isAdmMasterAuthenticated') === 'true' ? true : false);

  const verifyAuthentication = async () => {
    setIsLoading(true);

    console.log('Verifying authentication...');
    if (localStorage.getItem('access_token')) {
      setIsAuthenticated(true);
      setIsAdmAuthenticated(localStorage.getItem('isAdmAuthenticated') === 'true' ? true : false);
      setIsAdmMasterAuthenticated(localStorage.getItem('isAdmMasterAuthenticated') === 'true' ? true : false);
    }

    if (!localStorage.getItem('access_token')) {
      setIsAuthenticated(false);
      setIsAdmAuthenticated(false);
      setIsAdmMasterAuthenticated(false);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    verifyAuthentication();

    window.addEventListener("profileUpdated", verifyAuthentication);

    return () => {
      window.removeEventListener("profileUpdated", verifyAuthentication);
    };
  }, []);


  return (
    <Router>
      <Routes>
        {!isAuthenticated &&
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<LoginOrRegisterPage />} />
            <Route path="/" element={<LoginOrRegisterPage />} />

          </Route>}

        {isAuthenticated &&
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<BasePage />} />
            <Route path="/" element={<BasePage />} />

          </Route>}

      </Routes>
    </Router>
  );
}