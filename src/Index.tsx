import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutDelivery from './pages/DeliverySite/LayoutDelivery';
import BasePage from './pages/DeliverySite/BasePage';
import { verifyIfIsAdmin } from './services/deliveryServices/AuthService';
import LoginOrRegisterPage from './pages/DeliverySite/LoginOrRegisterPage';
import { useDispatch, useSelector } from 'react-redux';
import PortfolioPage from './pages/PortfolioPage';
import LayoutPortifolio from './pages/LayoutPortifolio';
import LayoutPortifolio2 from './pages/LayoutPortifolio2';

export default function Index() {
  const dispatch = useDispatch();

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
        <Route path="/" element={<LayoutPortifolio />}>
          <Route path="/*" element={<PortfolioPage />} />
        </Route>
        {!isAuthenticated &&
          <Route path="/" element={<LayoutDelivery />}>
            <Route path="/FelipeFPortfolio/delivery/*" element={<LoginOrRegisterPage />} />
            <Route path="/FelipeFPortfolio/delivery/register" element={<LoginOrRegisterPage />} />

          </Route>}

        {isAuthenticated &&
          <Route path="/" element={<LayoutDelivery />}>
            <Route path="/FelipeFPortfolio/delivery/*" element={<BasePage />} />

          </Route>}

      </Routes>
    </Router>
  );
}