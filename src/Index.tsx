import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import BasePage from './pages/BasePage';
import { verifyIfIsAdmin } from './services/AuthService';
import LoginOrRegisterPage from './pages/LoginOrRegisterPage';

export default function Index() {
  // const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);
  const isAdmAuthenticated = localStorage.getItem('access_token') ? true : false;
  const isAdmMasterAuthenticated = localStorage.getItem('isAdmMasterAuthenticated') === 'true' ? true : false;

  useEffect(() => {
    const verifyAuthentication = async () => {
      if (localStorage.getItem('access_token') && !isAdmAuthenticated) {
        const ifIsAdmin = await verifyIfIsAdmin();
        if (ifIsAdmin?.status === 200) {


          // dispatch(setIsAdmAuthenticated(ifIsAdmin.data.isAdmAuthenticated));
          // dispatch(setIsAdmMasterAuthenticated(ifIsAdmin.data.isAdmMasterAuthenticated));
        }
      }

      setIsLoading(false);
    }

    verifyAuthentication();
  }, []);


  return (
    <Router>
      <Routes>
        {!isAdmAuthenticated &&
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<LoginOrRegisterPage />} />
            <Route path="/" element={<LoginOrRegisterPage />} />

          </Route>}

        {isAdmAuthenticated &&
          <Route path="/" element={<Layout />}>
            <Route path="*" element={<BasePage />} />
            <Route path="/" element={<BasePage />} />

          </Route>}

      </Routes>
    </Router>
  );
}