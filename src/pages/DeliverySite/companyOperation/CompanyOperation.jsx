import { use, useEffect, useRef, useState } from 'react';
import MapaDelivery from './mapa/MapaDelivery.jsx';
import SystemPageDelivery from './system/SystemPageDelivery.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faArrowLeft, faArrowRight, faChain, faChair, faDoorOpen, faLeftRight, faLock, faMapLocationDot, faMotorcycle, faPowerOff, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import './../DeliveryCss.css'
import { getCompanyOperation } from '../../../services/deliveryServices/CompanySevice.js';
import { getShiftOperation } from '../../../services/deliveryServices/ShiftService.js';
import {
  changeCompanyName, changeCompanyEmail, changeCompanyPhone, changeCompanyAddress, changeCompanyLat, changeCompanyLng,
  changeUrlCompanyLogo, changeProductsCategories, changeCustomers, changeCurrentShift, changeNumberOfTables, changeOrders,
  changeEmployees,
  quitCompanyOperation,
  changeOwnerID,
  changeTaxServicePercentage,
  changeDeliveryHasServiceTax,
  changePickupHasServiceTax,
  changeMaxRecommendedDistanceKM,
  changeMaxDeliveryDistanceKM,
  changeBaseDeliveryDistanceKM,
  changeBaseDeliveryTax,
  changeTaxPerExtraKM,
  changeNoUserDeliveryMans
} from '../../../redux/companyOperationSlice.js';
import { blueOne, borderColorTwo, fontColorOne, mainColor, redOne, secondColor, secondColorInverse } from '../../../theme/Colors.js';
import { Dropdown } from 'react-bootstrap';
import LeaveCompanyMessage from './system/components/LeaveCompanyMessage.jsx';
import FinishShiftModal from './system/components/FinishShiftModal.jsx';
import { isOwnerOrManager } from '../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js';
import { useLocation, useNavigate } from 'react-router-dom';
import SystemPageHall from './system/SystemPageHall.jsx';
import { verifyNewOrderPrints } from '../../../services/deliveryServices/auxServices/PrintService.js';
import SignalRService from '../../../services/deliveryServices/auxServices/SignalRService.jsx';
import DeliveryManPage from './deliverymanPage/DeliveryManPage.jsx';

export default function CompanyOperation() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.view.theme);
  const dispatch = useDispatch();
  const isPcV = useSelector((state) => state.view.isPcV);
  const companyOperationData = useSelector((state) => state.companyOperation);
  const [signalRAlreadyCharged, setSignalRAlreadyCharged] = useState(false);
  const [lastShiftOperationUpdate, setLastShiftOperationUpdate] = useState(null);

  const location = useLocation();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  const [systemPageSelected, setSystemPageSelected] = useState("delivery");

  const [onFocus, setOnFocus] = useState("");
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
    if (isPcV === false && onFocus === "") {
      setOnFocus("system");
    }
  }, [isPcV]);

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
        dispatch(changeTaxServicePercentage(companyOperationData?.taxServicePercentage || 0));
        dispatch(changeDeliveryHasServiceTax(companyOperationData?.deliveryHasServiceTax || false));
        dispatch(changePickupHasServiceTax(companyOperationData?.pickupHasServiceTax || false));

        dispatch(changeMaxRecommendedDistanceKM(companyOperationData?.maxRecommendedDistanceKM || 0));
        dispatch(changeMaxDeliveryDistanceKM(companyOperationData?.maxDeliveryDistanceKM || 0));
        dispatch(changeBaseDeliveryDistanceKM(companyOperationData?.baseDeliveryDistanceKM || 0));
        dispatch(changeBaseDeliveryTax(companyOperationData?.baseDeliveryTax || 0));
        dispatch(changeTaxPerExtraKM(companyOperationData?.taxPerExtraKM || 0));
        dispatch(changeNoUserDeliveryMans(companyOperationData?.noUserDeliveryMans || []));

      } else {
        alert("You need to open a shift to operate on this company.");
      }
    } else {
      alert("Error fetching company operation data from server");
    }
  }

  async function getShiftOperationData() {
    if (!companyOperationData?.companyOperationID) return;

    // console.log("last update: ", lastShiftOperationUpdate ? (new Date().getTime() - lastShiftOperationUpdate) : "Never updated");
    // if (companyOperationData.currentShift && signalRAlreadyCharged && (new Date().getTime() - lastShiftOperationUpdate < 60_000)) return;

    const response = await getShiftOperation(companyOperationData?.companyOperationID);
    if (response?.status === 200) {
      const shiftOperationData = response?.data;

      updateShiftfData(shiftOperationData);
    } else {
      // alert("Error fetching orders operation data");
    }
  }

  async function updateShiftfData(shiftOperationData) {
    console.log("📟 Updating shift data...");
    setLastShiftOperationUpdate(new Date().getTime());

    dispatch(changeCurrentShift(shiftOperationData?.currentShift || null));
    dispatch(changeOrders(shiftOperationData?.orders || []));
    verifyNewOrderPrints(shiftOperationData?.orders);
  }

  useEffect(() => {
    getCompanyOperationData();
    getShiftOperationData();

    if (companyOperationData?.companyOperationID == null) dispatch(quitCompanyOperation());
  }, [companyOperationData?.companyOperationID]);

  useEffect(() => {

    const interval = setInterval(() => {
      getShiftOperationData();
    }, 12000);

    return () => clearInterval(interval);
  }, [companyOperationData.currentShift, signalRAlreadyCharged]);

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



  // <>--- Orders coockingLogic to map and delivery share ---<> //
  const [selectedCookingOrderID, setSelectedCookingOrderID] = useState([]);
  async function toggleSelectedCookingOrderID(id) {
    setSelectedCookingOrderID(prev => prev.includes(id) ? prev.filter(prevId => prevId !== id) : [...prev, id]);
  }
  // <> ------------------------------------------------------<> //

  function getkindOfUserScreen() {
    // if (localStorage.getItem("userLoggedEmail") === companyOperationData?.ownerID) return "owner";
    // if (companyOperationData?.employees?.some(emp => emp.employeeEmail === localStorage.getItem("userLoggedEmail") && emp.position === "SERVER")) return "SERVER";
    if (companyOperationData?.employees?.some(emp => emp.employeeEmail === localStorage.getItem("userLoggedEmail") && emp.position === "DELIVERYMAN")) return "DELIVERYMAN";

    return "ORDINARYUSER";
  }

  return (
    <>
      <div className='flexColumn' style={{ background: mainColor(theme), color: fontColorOne(theme), height: "100dvh", width: "100vw", overflow: "hidden", justifyContent: "center", padding: '0px 0px' }}>

        <div className='flexRow' style={{ height: '100%', width: '100%', flexGrow: 1, padding: '5px 5px' }}>

          {/* <>------------------------------ Ordinary Users Screeens ------------------------------<> */}
          {getkindOfUserScreen() === 'ORDINARYUSER' &&
            <div className='flexColumn' style={{ position: 'relative', height: '100%', flexGrow: 1, width: onFocus === "map" ? '0%' : onFocus === "system" ? '96%' : '50%', visibility: onFocus !== "map" ? 'visible' : 'hidden' }}>

              <div className='flexRow spaceBetweenJC' style={{ width: '100%', padding: '0px 4px', marginBottom: '8px' }} >

                <div className='flexRow' >
                  <div className='flexRow' style={{ alignItems: "center", }}>
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

                <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold', margin: '3px 5px 0px 5px', whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', }}>
                  {companyOperationData?.companyName}</span>

                <button className='floatingButton' style={{ whiteSpace: 'nowrap' }}
                  onClick={() => setOnFocus(onFocus === "system" ? (!isPcV ? "map" : "") : "system")}>
                  {onFocus === "system" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faArrowLeft} /><FontAwesomeIcon icon={faMapLocationDot} /></p> : <FontAwesomeIcon icon={faArrowRight} />}</button>
              </div>

              {systemPageSelected === "delivery" && <SystemPageDelivery onFocus={onFocus} setHaveModalOpen={setHaveModalOpen} getShiftOperationData={async () => await getShiftOperationData()}
                selectedCookingOrderID={selectedCookingOrderID} setSelectedCookingOrderID={setSelectedCookingOrderID} toggleSelectedCookingOrderID={toggleSelectedCookingOrderID} />}
              {systemPageSelected === "hall" && <SystemPageHall onFocus={onFocus} setHaveModalOpen={setHaveModalOpen} getShiftOperationData={async () => await getShiftOperationData()} />}
            </div>}

          {getkindOfUserScreen() === 'ORDINARYUSER' && isPcV && <div style={{ display: 'flex', height: '100%', width: 5, backgroundColor: secondColorInverse(theme), borderRadius: 50, margin: "0px 5px" }} />}

          {getkindOfUserScreen() === 'ORDINARYUSER' &&
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: onFocus === "system" ? '0%' : onFocus === "map" ? '100%' : '50%', }}>
              <div className='flexRow spaceBetweenJC' style={{ width: '100%', padding: '0px 4px', whiteSpace: 'nowrap', }} >
                {onFocus !== "system" && <button className='floatingButton' style={{}}
                  onClick={() => setOnFocus(onFocus === "map" ? (!isPcV ? "system" : "") : "map")}>{onFocus === "map" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faAlignJustify} /><FontAwesomeIcon icon={faArrowRight} /></p> : <FontAwesomeIcon icon={faArrowLeft} />}</button>}

                {!isPcV && onFocus === "map" && <div className='flexRow' style={{ width: '100%', justifyContent: 'center', }} >
                  <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold', margin: '3px 5px 0px 5px', whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', }}>
                    {companyOperationData?.companyName}</span>
                </div>}
              </div>

              <div className='flexRow' style={{ width: '100%', height: '100%', paddingTop: '8px' }} >
                <MapaDelivery companyOperation={companyOperationData} selectedCookingOrderID={selectedCookingOrderID} setSelectedCookingOrderID={setSelectedCookingOrderID} toggleSelectedCookingOrderID={toggleSelectedCookingOrderID} getShiftOperationData={async () => await getShiftOperationData()} />
              </div>
            </div>}
          {/* <>------------------------------ END || Ordinary Users Screeens || END ------------------------------<> */}


          {/* <>------------------------------ Delivery Man Screeens ------------------------------<> */}
          {getkindOfUserScreen() === 'DELIVERYMAN' &&
            <div className='flexColumn' style={{ position: 'relative', height: '100%', flexGrow: 1, width: onFocus === "map" ? '96%' : onFocus === "system" ? '96%' : '50%', visibility: onFocus !== "map" ? 'visible' : 'hidden' }}>

              <div className='flexRow spaceBetweenJC' style={{ width: '100%', padding: '0px 4px', marginBottom: '8px' }} >
                <button className='floatingButton red' onClick={() => { setShowLeaveCompanyMessage(true); }}>
                  <p style={{ margin: 0 }}><FontAwesomeIcon icon={faRightFromBracket} flip='horizontal' /></p> </button>

                <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold', margin: '3px 5px 0px 5px', whiteSpace: 'nowrap', overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', }}>
                  {companyOperationData?.companyName}</span>
              </div>

              <DeliveryManPage companyOperation={companyOperationData} getShiftOperationData={async () => await getShiftOperationData()} />
            </div>}
          {/* <>------------------------------ END || Delivery Man Screeens || END ------------------------------<> */}

        </div >

        {showLeaveCompanyMessage && <div className='myModal' >
          <LeaveCompanyMessage close={() => setShowLeaveCompanyMessage(false)} leaveCompany={() => { dispatch(quitCompanyOperation()); setShowLeaveCompanyMessage(false); }} />
        </div>}

        {showFinishShiftMessage && <div className='myModal'>
          <FinishShiftModal close={() => setShowFinishShiftMessage(false)} finishShift={() => { dispatch(quitCompanyOperation()); setShowFinishShiftMessage(false); }}
            companySelected={companyOperationData?.companyOperationID} requesterAreOwnerOrManager={requesterAreOwnerOrManager} />
        </div>}
      </div>
      {/* <SignalRService companyOperation={companyOperationData} setSignalRAlreadyCharged={setSignalRAlreadyCharged} updateShiftfData={updateShiftfData} /> */}
    </>
  );
}
