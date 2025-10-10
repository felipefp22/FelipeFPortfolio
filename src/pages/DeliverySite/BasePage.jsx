import { use, useEffect, useState } from 'react';
import MapaDelivery from './mapa/MapaDelivery.jsx';
import SystemPage from './system/SystemPage.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faArrowLeft, faArrowRight, faLeftRight, faMapLocationDot, faPowerOff, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import UserOptions from './userOptions/UserOptions.jsx';
import { logOutAction } from '../../services/deliveryServices/AuthService.js';
import { useDispatch, useSelector } from 'react-redux';
import './DeliveryCss.css'
import { getCompanyOperation } from '../../services/deliveryServices/CompanySevice.js';
import { getShiftOperation, openNewShift } from '../../services/deliveryServices/ShiftService.js';
import {
  changeCompanyName, changeCompanyEmail, changeCompanyPhone, changeCompanyAddress, changeCompanyLat, changeCompanyLng,
  changeUrlCompanyLogo, changeProductsCategories, changeCustomers, changeCurrentShift, changeNumberOfTables, changeOrders
} from '../../redux/companyOperationSlice.js';
import { redOne, secondColor, secondColorInverse } from '../../theme/Colors.js';


export default function BasePage() {
  const theme = useSelector((state) => state.view.theme);
  const dispatch = useDispatch();
  const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const [screenOnFocus, setScreenOnFocus] = useState("");
  const [companySelected, setCompanySelected] = useState(localStorage.getItem('companyOperatingID'));
  const [haveModalOpen, setHaveModalOpen] = useState(false);

  useEffect(() => {
    function verifyCompany() {

      if (localStorage.getItem('companyOperatingID') != companySelected || (companySelected == null && localStorage.getItem('companyOperatingID'))) {
        console.log("Company changed, updating variable");
        setCompanySelected(localStorage.getItem('companyOperatingID'));
      }
    }

    window.addEventListener("settedCompany", verifyCompany);

    return () => {
      window.removeEventListener("settedCompany", verifyCompany);
    };
  }, []);

  useEffect(() => {

  }, [companySelected]);

  useEffect(() => {
    if (isDesktopView === false && screenOnFocus === "") {
      setScreenOnFocus("system");
    }
  }, [isDesktopView]);

  async function getCompanyOperationData(retryCount = 0) {
    if (!companySelected) return;

    const response = await getCompanyOperation();
    if (response?.status === 200) {
      const companyOperationData = response?.data;
      dispatch(changeCompanyName(companyOperationData?.companyName));
      dispatch(changeCompanyEmail(companyOperationData?.companyEmail));
      dispatch(changeCompanyPhone(companyOperationData?.companyPhone));
      dispatch(changeCompanyAddress(companyOperationData?.companyAddress));
      dispatch(changeCompanyLat(companyOperationData?.companyLat));
      dispatch(changeCompanyLng(companyOperationData?.companyLng));
      dispatch(changeUrlCompanyLogo(companyOperationData?.urlCompanyLogo));
      dispatch(changeProductsCategories(companyOperationData?.productsCategories || []));
      dispatch(changeCustomers(companyOperationData?.customers || []));
      dispatch(changeCurrentShift(companyOperationData?.currentShift || null));
      dispatch(changeNumberOfTables(companyOperationData?.numberOfTables || 0));

    } else if (response?.status === 400 && response?.data === "noActiveShift") {
      //IfOneDayRealOperationRemoveThis all this second "else if" and just leave the "if" above and the "else" below
      if (retryCount < 2) {
        const res = await openNewShift();
        return getCompanyOperationData(retryCount + 1);
      } else {
        alert("Error fetching company operation data");
      }
    } else {
      // alert("Error fetching company operation data");
    }
  }

  async function getShiftOperationData() {
    if (!companySelected) return;
    const response = await getShiftOperation();
    if (response?.status === 200) {
      const shiftOperationData = response?.data;
      dispatch(changeCurrentShift(shiftOperationData?.currentShift || null));
      dispatch(changeOrders(shiftOperationData?.orders || []));
    } else {
      // alert("Error fetching orders operation data");
    }
  }

  useEffect(() => {
    getCompanyOperationData();
    getShiftOperationData();
  }, [companySelected]);

  useEffect(() => {
    // run immediately once
    getShiftOperationData();

    const interval = setInterval(() => {
      getShiftOperationData();
    }, 12000);

    return () => clearInterval(interval);
  }, []);


  return (
    <>
      {!companySelected && <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 0, flexGrow: 1, }}>

        {<div style={{ display: 'flex', height: '100%', flexGrow: 1, width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative', }}>
          {/* <button style={{ position: 'absolute', top: 0, left: 5, zIndex: 1000, backgroundColor: '#e43636ff', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 5px rgba(255, 255, 255, 0.55)", borderRadius: 50 }}
            onClick={() => logOutAction()}>{<FontAwesomeIcon icon={faPowerOff} />}</button> */}

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, }} >
            <UserOptions companySelected={companySelected} setCompanySelected={setCompanySelected} />
          </div>
        </div>}

      </div >}

      {companySelected && <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 0, flexGrow: 1, }}>

        {<div style={{ display: 'flex', height: '100%', flexGrow: 1, width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative', visibility: screenOnFocus !== "map" ? 'visible' : 'hidden' }}>
          {!haveModalOpen && <button className='floatingButton' style={{ position: 'absolute', top: 0, left: 5, backgroundColor: redOne(theme), }}
            onClick={() => { setCompanySelected(null); localStorage.removeItem('companyOperatingID'); }}>{<FontAwesomeIcon icon={faRightFromBracket} flip="horizontal" />}</button>}

          {!haveModalOpen && <button className='floatingButton' style={{ position: 'absolute', top: 0, right: 5, }}
            onClick={() => setScreenOnFocus(screenOnFocus === "system" ? (!isDesktopView ? "map" : "") : "system")}>
            {screenOnFocus === "system" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faArrowLeft} /><FontAwesomeIcon icon={faMapLocationDot} /></p> : <FontAwesomeIcon icon={faArrowRight} />}</button>}

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1, marginTop: 50, }} >
            <SystemPage screenOnFocus={screenOnFocus} setHaveModalOpen={setHaveModalOpen} getShiftOperationData={async () => await getShiftOperationData()} />
          </div>
        </div>}

        {isDesktopView && <div style={{ display: 'flex', height: '100%', width: 5, backgroundColor: secondColorInverse(theme), borderRadius: 50, margin: "0px 5px" }} />}

        {<div style={{ display: 'flex', height: '100%', width: screenOnFocus === "system" ? '0%' : screenOnFocus === "map" ? '100%' : '50%', position: 'relative' }}>
          {screenOnFocus !== "system" && <button className='floatingButton' style={{ position: 'absolute', top: 0, left: 5, }}
            onClick={() => setScreenOnFocus(screenOnFocus === "map" ? (!isDesktopView ? "system" : "") : "map")}>{screenOnFocus === "map" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faAlignJustify} /><FontAwesomeIcon icon={faArrowRight} /></p> : <FontAwesomeIcon icon={faArrowLeft} />}</button>}

          <MapaDelivery setHaveModalOpen={setHaveModalOpen} />
        </div>}
      </div >}
    </>
  );
}
