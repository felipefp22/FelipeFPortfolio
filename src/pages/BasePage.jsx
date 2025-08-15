import { useState } from 'react';
import MapaDelivery from './mapa/MapaDelivery.jsx';
import SystemPage from './system/SystemPage.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAlignJustify, faArrowLeft, faArrowRight, faLeftRight, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';

export default function BasePage() {
  // const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const [screenOnFocus, setScreenOnFocus] = useState("");

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 5, flexGrow: 1, }}>

        {<div style={{ display: 'flex', height: '95%', flexGrow: 1, width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative', }}>
          <button style={{ position: 'absolute', top: 0, right: -25, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px", boxShadow: "-3px 3px 10px rgba(255, 255, 255, 0.55)" }}
            onClick={() => setScreenOnFocus(screenOnFocus === "system" ? "" : "system")}>{screenOnFocus === "system" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faArrowLeft} /><FontAwesomeIcon icon={faMapLocationDot} /></p> : <FontAwesomeIcon icon={faArrowRight} />}</button>

          <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, marginTop: 35, }} >
            <SystemPage />
          </div>
        </div>}

        <div style={{ display: 'flex', height: '100%', width: 5, backgroundColor: 'white', borderRadius: 50, margin: "0px 5px" }} />

        {<div style={{ display: 'flex', height: '95%', width: screenOnFocus === "system" ? '0%' : screenOnFocus === "map" ? '100%' : '50%', position: 'relative' }}>
          <button style={{ position: 'absolute', top: 0, left: -25, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px", boxShadow: "3px 3px 10px rgba(255, 255, 255, 0.55)"  }}
            onClick={() => setScreenOnFocus(screenOnFocus === "map" ? "" : "map")}>{screenOnFocus === "map" ? <p style={{ margin: 0 }}><FontAwesomeIcon icon={faAlignJustify} /><FontAwesomeIcon icon={faArrowRight} /></p> : <FontAwesomeIcon icon={faArrowLeft} />}</button>

          <MapaDelivery />
        </div>}
      </div >
    </>
  );
}
