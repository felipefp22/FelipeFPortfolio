import { use, useEffect, useState } from 'react';
import MapaDelivery from './mapa/MapaDelivery.jsx';
import SystemPage from './system/SystemPage.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faArrowLeft, faArrowRight, faLeftRight, faMapLocationDot, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import UserOptions from './userOptions/UserOptions.jsx';
import { logOutAction } from '../../services/AuthService.js';
import { useSelector } from 'react-redux';
import './DeliveryCss.css'


export default function BasePage() {
  const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const [screenOnFocus, setScreenOnFocus] = useState("");
  const [companySelected, setCompanySelected] = useState(localStorage.getItem('companyOperatingID'));
  const [haveModalOpen, setHaveModalOpen] = useState(false);

  useEffect(() => {
    function verifyCompany() {
      if (localStorage.getItem('companyOperatingID') != companySelected) {
        setCompanySelected(localStorage.getItem('companyOperatingID'));
      }
    }

    window.addEventListener("profileUpdated", verifyCompany);

    return () => {
      window.removeEventListener("profileUpdated", verifyCompany);
    };
  }, []);

  useEffect(() => {
    if (!isDesktopView && screenOnFocus === "") {
      setScreenOnFocus("system");
    }
  }, [isDesktopView]);


  return (
    <>
      {!companySelected && <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 0, flexGrow: 1, }}>

        {<div style={{ display: 'flex', height: '100%', flexGrow: 1, width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative', }}>
          <button style={{ position: 'absolute', top: 0, left: 5, zIndex: 1000, backgroundColor: '#e43636ff', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 10px rgba(255, 255, 255, 0.55)", borderRadius: 50 }}
            onClick={() => logOutAction()}>{<FontAwesomeIcon icon={faPowerOff} />}</button>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: 35, }} >
            <UserOptions />
          </div>
        </div>}

      </div >}

      {companySelected && <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 0, flexGrow: 1, }}>

        {<div style={{ display: 'flex', height: '100%', flexGrow: 1, width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative', visibility: screenOnFocus !== "map" ? 'visible' : 'hidden' }}>
            {!haveModalOpen && <button style={{ position: 'absolute', top: 0, left: 5, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6 }}
              onClick={() => { setCompanySelected(null); localStorage.removeItem('companyOperatingID'); }}>{<FontAwesomeIcon icon={faArrowLeft} />} {"Quit"}</button>}

            {!haveModalOpen && <button style={{ position: 'absolute', top: 0, right: 5, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6 }}
              onClick={() => setScreenOnFocus(screenOnFocus === "system" ? (!isDesktopView ? "map" : "") : "system")}>
              {screenOnFocus === "system" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faArrowLeft} /><FontAwesomeIcon icon={faMapLocationDot} /></p> : <FontAwesomeIcon icon={faArrowRight} />}</button>}

          <div style={{ display: 'flex', flexDirection: 'column', width: '100%',flexGrow: 1, marginTop: 50, }} >
            <SystemPage screenOnFocus={screenOnFocus} setHaveModalOpen={setHaveModalOpen} />
          </div>
        </div>}

        {isDesktopView && <div style={{ display: 'flex', height: '100%', width: 5, backgroundColor: 'white', borderRadius: 50, margin: "0px 5px" }} />}

        {<div style={{ display: 'flex', height: '100%', width: screenOnFocus === "system" ? '0%' : screenOnFocus === "map" ? '100%' : '50%', position: 'relative' }}>
          {screenOnFocus !== "system" && <button style={{ position: 'absolute', top: 0, left: 5, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px", boxShadow: "3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6 }}
            onClick={() => setScreenOnFocus(screenOnFocus === "map" ? (!isDesktopView ? "system" : "") : "map")}>{screenOnFocus === "map" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faAlignJustify} /><FontAwesomeIcon icon={faArrowRight} /></p> : <FontAwesomeIcon icon={faArrowLeft} />}</button>}

          <MapaDelivery setHaveModalOpen={setHaveModalOpen} />
        </div>}
      </div >}
    </>
  );
}
