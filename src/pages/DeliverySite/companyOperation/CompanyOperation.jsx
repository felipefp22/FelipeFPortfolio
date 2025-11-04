import { use, useEffect, useRef, useState } from 'react';
import MapaDelivery from './mapa/MapaDelivery.jsx';
import SystemPageDelivery from './system/SystemPageDelivery.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faArrowLeft, faArrowRight, faChain, faChair, faDoorOpen, faLeftRight, faLock, faMapLocationDot, faMotorcycle, faPowerOff, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { logOutAction } from '../../../services/deliveryServices/AuthService.js';
import { useDispatch, useSelector } from 'react-redux';
import './../DeliveryCss.css'
import { getCompanyOperation } from '../../../services/deliveryServices/CompanySevice.js';
import { getShiftOperation, openNewShift } from '../../../services/deliveryServices/ShiftService.js';
import {
  changeCompanyName, changeCompanyEmail, changeCompanyPhone, changeCompanyAddress, changeCompanyLat, changeCompanyLng,
  changeUrlCompanyLogo, changeProductsCategories, changeCustomers, changeCurrentShift, changeNumberOfTables, changeOrders,
  changeEmployees,
  quitCompanyOperation,
  changeOwnerID
} from '../../../redux/companyOperationSlice.js';
import { blueOne, borderColorTwo, fontColorOne, mainColor, redOne, secondColor, secondColorInverse } from '../../../theme/Colors.js';
import { Dropdown } from 'react-bootstrap';
import LeaveCompanyMessage from './system/components/LeaveCompanyMessage.jsx';
import FinishShiftModal from './system/components/FinishShiftModal.jsx';
import { isOwnerOrManager } from '../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js';
import SelectCompanyOperation from '../selectCompanyOperation/SelectCompanyOperation.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import SystemPageHall from './system/SystemPageHall.jsx';


export default function CompanyOperation() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.view.theme);
  const dispatch = useDispatch();
  const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const companyOperationData = useSelector((state) => state.companyOperation);

  const location = useLocation();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [systemPageSelected, setSystemPageSelected] = useState("delivery");

  const [screenOnFocus, setScreenOnFocus] = useState("");
  const [haveModalOpen, setHaveModalOpen] = useState(false);

  const dropdownSystemOptionsRedRef = useRef(null);
  const [showDropdownSystemOptionsRed, setShowDropdownSystemOptionsRed] = useState(false);

  const [showLeaveCompanyMessage, setShowLeaveCompanyMessage] = useState(false);
  const [showFinishShiftMessage, setShowFinishShiftMessage] = useState(false);

  const [requesterAreOwnerOrManager, setRequesterAreOwnerOrManager] = useState(false);

  useEffect(() => {
    if (companyOperationData) setRequesterAreOwnerOrManager(isOwnerOrManager(localStorage.getItem("userLoggedEmail"), companyOperationData));
  }, [companyOperationData]);

  useEffect(() => {
    if (isDesktopView === false && screenOnFocus === "") {
      setScreenOnFocus("system");
    }
  }, [isDesktopView]);

  async function getCompanyOperationData(retryCount = 0) {
    if (!companyOperationData?.companyOperationID) return;

    const response = await getCompanyOperation(companyOperationData?.companyOperationID);
    if (response?.status === 200) {
      const companyOperationData = response?.data;

      if (companyOperationData?.currentShift !== null) {
        dispatch(changeOwnerID(companyOperationData?.ownerID));
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
        dispatch(changeEmployees(companyOperationData?.employees || null));

      } else {
        alert("You need to open a shift to operate on this company.");
      }
    } else {
      alert("Error fetching company operation data from server");
    }
  }

  async function getShiftOperationData() {
    if (!companyOperationData?.companyOperationID) return;

    const response = await getShiftOperation(companyOperationData?.companyOperationID);
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

    if (companyOperationData?.companyOperationID == null) dispatch(quitCompanyOperation());
  }, [companyOperationData?.companyOperationID]);

  useEffect(() => {
    getShiftOperationData();

    const interval = setInterval(() => {
      getShiftOperationData();
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownSystemOptionsRedRef.current && !dropdownSystemOptionsRedRef.current.contains(event.target)) {
        setShowDropdownSystemOptionsRed(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const menuTab = queryParams.get('tab');
    if (menuTab) setSystemPageSelected(menuTab.replace(/%20/g, ' '));

  }, [queryParams]);


  return (
    <>
      <div style={{
        background: mainColor(theme), color: fontColorOne(theme), height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: '0px 0px'
        // alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", margin: "0 auto", width: "100%", padding: '5px 5px' }}>

          <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 0, flexGrow: 1, }}>
            {<div style={{ display: 'flex', flexDirection: 'column', height: '100%', flexGrow: 1, width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative', visibility: screenOnFocus !== "map" ? 'visible' : 'hidden' }}>
              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: '0px 4px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', }} >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                    <Dropdown ref={dropdownSystemOptionsRedRef} className="nav-item header-profile" show={showDropdownSystemOptionsRed} >
                      <Dropdown.Toggle className="nav-link i-false p-0" as="div" onClick={() => setShowDropdownSystemOptionsRed(!showDropdownSystemOptionsRed)} >
                        <button className='floatingButton' style={{ backgroundColor: redOne(theme), }} >☰</button>
                      </Dropdown.Toggle>
                      <Dropdown.Menu align="end" style={{ borderRadius: "6px", }}>
                        {requesterAreOwnerOrManager && <div style={{ paddingLeft: "10px", textAlign: "left", cursor: "pointer", marginBottom: "8px" }} onClick={() => { setShowFinishShiftMessage(true); setShowDropdownSystemOptionsRed(false); }}>
                          <FontAwesomeIcon icon={faLock} flip='horizontal' style={{ color: blueOne(theme) }} />
                          <span style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '5px' }}>Finish Shift</span>
                        </div>}
                        <div style={{ paddingLeft: "10px", textAlign: "left", cursor: "pointer" }} onClick={() => { setShowLeaveCompanyMessage(true); setShowDropdownSystemOptionsRed(false); }}>
                          <FontAwesomeIcon icon={faRightFromBracket} flip='horizontal' style={{ color: "red" }} />
                          <span style={{ fontSize: '16px', fontWeight: 'bold', marginLeft: '5px' }}>Leave</span>
                        </div>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>

                  <button className='floatingButton' style={{ marginLeft: '10px' }}
                    onClick={() => { if (systemPageSelected === "delivery") navigate(`/FelipeFPortfolio/delivery?tab=hall`); else if (systemPageSelected === "hall") navigate(`/FelipeFPortfolio/delivery?tab=delivery`); }}>
                    <p style={{ margin: 0 }}><FontAwesomeIcon icon={(systemPageSelected === "delivery") ? faChair : faMotorcycle} /></p> </button>
                </div>

                <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '18px' : '14px', fontWeight: 'bold', margin: '3px 5px 0px 5px', whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', }}>
                  {companyOperationData?.companyName}</span>

                <button className='floatingButton' style={{ whiteSpace: 'nowrap' }}
                  onClick={() => setScreenOnFocus(screenOnFocus === "system" ? (!isDesktopView ? "map" : "") : "system")}>
                  {screenOnFocus === "system" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faArrowLeft} /><FontAwesomeIcon icon={faMapLocationDot} /></p> : <FontAwesomeIcon icon={faArrowRight} />}</button>
              </div>

              {systemPageSelected === "delivery" && <SystemPageDelivery screenOnFocus={screenOnFocus} setHaveModalOpen={setHaveModalOpen} getShiftOperationData={async () => await getShiftOperationData()} />}
              {systemPageSelected === "hall" && <SystemPageHall screenOnFocus={screenOnFocus} setHaveModalOpen={setHaveModalOpen} getShiftOperationData={async () => await getShiftOperationData()} />}
            </div>}

            {isDesktopView && <div style={{ display: 'flex', height: '100%', width: 5, backgroundColor: secondColorInverse(theme), borderRadius: 50, margin: "0px 5px" }} />}

            {<div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: screenOnFocus === "system" ? '0%' : screenOnFocus === "map" ? '100%' : '50%', }}>
              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', padding: '0px 4px', whiteSpace: 'nowrap',  }} >
                {screenOnFocus !== "system" && <button className='floatingButton' style={{}}
                  onClick={() => setScreenOnFocus(screenOnFocus === "map" ? (!isDesktopView ? "system" : "") : "map")}>{screenOnFocus === "map" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faAlignJustify} /><FontAwesomeIcon icon={faArrowRight} /></p> : <FontAwesomeIcon icon={faArrowLeft} />}</button>}

                {!isDesktopView && screenOnFocus === "map" && <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', }} >
                  <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '18px' : '14px', fontWeight: 'bold', margin: '3px 5px 0px 5px', whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', }}>
                    {companyOperationData?.companyName}</span>
                </div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', height: '100%', paddingTop: '8px' }} >
                <MapaDelivery setHaveModalOpen={setHaveModalOpen} />
              </div>
            </div>}
          </div >
        </div>

        {showLeaveCompanyMessage && <div className="myModal" style={{ zIndex: 10000 }} >
          <LeaveCompanyMessage close={() => setShowLeaveCompanyMessage(false)} leaveCompany={() => { dispatch(quitCompanyOperation()); setShowLeaveCompanyMessage(false); }} />
        </div>}

        {showFinishShiftMessage && <div className="myModal" style={{ zIndex: 10000 }} >
          <FinishShiftModal close={() => setShowFinishShiftMessage(false)} finishShift={() => { dispatch(quitCompanyOperation()); setShowFinishShiftMessage(false); }}
            companySelected={companyOperationData?.companyOperationID} requesterAreOwnerOrManager={requesterAreOwnerOrManager} />
        </div>}
      </div>
    </>
  );
}
