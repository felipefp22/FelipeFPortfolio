import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LayoutDelivery from './pages/DeliverySite/LayoutDelivery';
import CompanyOperation from './pages/DeliverySite/companyOperation/CompanyOperation';
import { verifyIfIsAdmin } from './services/deliveryServices/AuthService';
import LoginOrRegisterPage from './pages/DeliverySite/LoginOrRegisterPage';
import { useDispatch, useSelector } from 'react-redux';
import PortfolioPage from './pages/PortfolioPage';
import LayoutPortifolio from './pages/LayoutPortifolio';
import OAuthRedirectPage from './pages/DeliverySite/login/OAuthRedirectPage';
import MyPhoto from './pages/MyPhoto';
import { setTheme } from './redux/viewSlice';
import SelectCompanyOperation from './pages/DeliverySite/selectCompanyOperation/SelectCompanyOperation';
import { changeCompanyOperationID } from './redux/companyOperationSlice';

export default function Index() {
  const dispatch = useDispatch();
  const companyOperationID = useSelector((state) => state.companyOperation.companyOperationID);

  const [isLoading, setIsLoading] = useState(true);

  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('access_token') ? true : false);
  const [isAdmAuthenticated, setIsAdmAuthenticated] = useState(localStorage.getItem('isAdmMasterAuthenticated') ? true : false);
  const [isAdmMasterAuthenticated, setIsAdmMasterAuthenticated] = useState(localStorage.getItem('isAdmMasterAuthenticated') === 'true' ? true : false);

  useEffect(() => {
    if (localStorage.getItem('companyOperatingID')) dispatch(changeCompanyOperationID(localStorage.getItem('companyOperatingID')));
  }, []);

  const verifyAuthentication = async () => {
    setIsLoading(true);

    if (localStorage.getItem('access_token')) {
      setIsAuthenticated(true);
      setIsAdmAuthenticated(localStorage.getItem('isAdmAuthenticated') === 'true' ? true : false);
      setIsAdmMasterAuthenticated(localStorage.getItem('isAdmMasterAuthenticated') === 'true' ? true : false);
      dispatch(setTheme(localStorage.getItem('theme')));
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
        <Route path="/FelipeFPortfolio/myphoto" element={<MyPhoto />} />

        <Route path="/" element={<LayoutPortifolio />}>
          <Route path="/*" element={<PortfolioPage />} />

        </Route>
        {!isAuthenticated &&
          <Route path="/" >
            <Route path="/FelipeFPortfolio/delivery/*" element={<LoginOrRegisterPage />} />
            <Route path="/FelipeFPortfolio/delivery/register" element={<LoginOrRegisterPage />} />
            <Route path="/FelipeFPortfolio/delivery/oauthredirect" element={<OAuthRedirectPage />} />

          </Route>}

        {isAuthenticated && companyOperationID &&
          <Route path="/">
            <Route path="/FelipeFPortfolio/delivery/*" element={<CompanyOperation />} />
          </Route>}

        {isAuthenticated && !companyOperationID &&
          <Route path="/" element={<LayoutDelivery />}>
            <Route path="/FelipeFPortfolio/delivery/*" element={<SelectCompanyOperation />} />
          </Route>}

      </Routes>
    </Router>
  );
}