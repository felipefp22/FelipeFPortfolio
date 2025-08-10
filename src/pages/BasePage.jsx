import { useState } from 'react';
import MapaDelivery from './mapa/MapaDelivery.jsx';
import SystemPage from './system/SystemPage.jsx';

export default function BasePage() {
  // const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const [screenOnFocus, setScreenOnFocus] = useState("");

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', padding: 20 }}>

        {screenOnFocus !== "map" && <div style={{ display: 'flex', height: '100%', width: screenOnFocus === "map" ? '0%' : screenOnFocus === "system" ? '96%' : '50%', justifyContent: 'center', position: 'relative' }}>
          <button style={{ position: 'absolute', top: 0, right: -25, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px" }}
            onClick={() => setScreenOnFocus(screenOnFocus === "system" ? "" : "system")}>{screenOnFocus === "system" ? "<-" : "->"}</button>

          <div style={{ marginTop: 30, }} >
            <SystemPage />
          </div>
        </div>}

        <div style={{ display: 'flex', height: '100%', width: 5, backgroundColor: 'white', borderRadius: 50, margin: "0px 10px" }} />

        {screenOnFocus !== "system" && <div style={{ display: 'flex', height: '100%', width: screenOnFocus === "system" ? '0%' : screenOnFocus === "map" ? '100%' : '50%', position: 'relative' }}>
          <button style={{ position: 'absolute', top: 0, left: -25, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 20px" }}
            onClick={() => setScreenOnFocus(screenOnFocus === "map" ? "" : "map")}>{screenOnFocus === "map" ? "->" : "<-"}</button>

          <MapaDelivery />
        </div>}
      </div >
    </>
  );
}
