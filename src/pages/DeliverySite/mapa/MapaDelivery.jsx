import { use, useEffect, useRef, useState } from 'react';
// import './../../App.css';
import L from 'leaflet'; // Import Leaflet
import restaurantLogo from '../../../assets/restaurantLogo.png'; // Import the restaurant logo
import { PutDeliveryPlaces, selectMarkerColor } from './mapcomponentsandservices/DeliveryPlaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { filterLoccationsOverLaping, sanitizeLatLng } from './mapcomponentsandservices/ManageOverlapPoints';
import { useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";
import { fontColorOne, secondColor, secondColorInverse } from '../../../theme/Colors';


export default function MapaDelivery({ }) {
  const theme = useSelector((state) => state.view.theme);
  const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const companyOperation = useSelector((state) => state.companyOperation);
  const [companyLat, setCompanyLat] = useState(null);
  const [companyLng, setCompanyLng] = useState(null);
  const [orders, setOrders] = useState([]);
  const [zoom, setZoom] = useState(localStorage.getItem('mapZoomLevel') || 13);

  const mapRef = useRef(null); // Referência para o mapa
  const markersRef = useRef(null); // Reference to manage markers
  const mapContainerRef = useRef(null);
  const lastSize = useRef({ width: 0, height: 0 });


  useEffect(() => {
    if (companyOperation?.companyLat !== companyLat && companyOperation?.companyLng !== companyLng) {
      setCompanyLat(companyOperation?.companyLat);
      setCompanyLng(companyOperation?.companyLng);
    }
    if (companyOperation?.orders !== orders) {
      setOrders(companyOperation?.orders || []);
    }
  }, [companyOperation]);

  useEffect(() => {
    if (companyOperation && zoom && companyLat && companyLng) {
      console.log("Initializing map at:", companyLat, companyLng);
      // Inicializa o mapa
      mapRef.current = L.map('mapa').setView([companyLat, companyLng], zoom); // Define a centralização do mapa

      // Adiciona uma camada de tiles do OpenStreetMap
      // L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
      // L.tileLayer('https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png', {
      // L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      // L.tileLayer('https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png', {
      L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        minZoom: 13,
        maxZoom: 17,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Adicionando marcador principal
      const restaurantIcon = L.icon({
        iconUrl: restaurantLogo,
        iconSize: [70, 70],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
      L.marker([companyLat, companyLng], { icon: restaurantIcon })
        .addTo(mapRef.current)
        .bindPopup('RESTAURANTE');
      //------------------------------
      // Marcadores lugares de entrega

      markersRef.current = L.layerGroup().addTo(mapRef.current);

      setTimeout(() => {
        mapRef.current.invalidateSize();
      }, 0);
      //------------------------------
      return () => {
        mapRef.current.remove(); // Remove o mapa ao desmontar para evitar leaks de memória
      };
    }
  }, [companyLat, companyLng]);

  useEffect(() => {
    if (!mapContainerRef.current) return;


    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        const last = lastSize.current;

        // Trigger only when the container grows
        if (width > last.width || height > last.height) {
          lastSize.current = { width, height };

          // Wait a bit so CSS finishes resizing before invalidating
          setTimeout(() => {
            if (mapRef.current) mapRef.current.invalidateSize();
          }, 200);
        } else {
          // Still update stored size, but don’t invalidate
          lastSize.current = { width, height };
        }
      }
    });

    observer.observe(mapContainerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateMarkersPutDeliveryPlaces();
  }, [orders]);

  function updateMarkersPutDeliveryPlaces() {
    if (companyOperation && companyLat && companyLng && markersRef.current) {

      if (markersRef.current) {
        markersRef.current.clearLayers(); // Clear existing markers
      }

      const locations = orders.map(order => ({
        latitude: order?.customer?.lat,
        longitude: order?.customer?.lng,
        orderNum: order?.orderNumberOnShift,
        orderDate: new Date(order?.openOrderDateUtc),
        status: order?.status,
      }));

      const filteredLocations = filterLoccationsOverLaping(locations);
      const sanitizedLocations = filteredLocations.map(location => sanitizeLatLng(location));

      sanitizedLocations.forEach(location => {
        if (!location.entregador && location.flag_dely != "V") {
          PutDeliveryPlaces({
            map: mapRef.current,
            markersGroup: markersRef.current,
            lat: location.latitude,
            lng: location.longitude,
            label: location.orderNum,
            // minutes: Math.round((new Date() - location.orderDate) / 60000)
            minutes: Math.max(0, Math.floor((new Date() - new Date(location.orderDate + 'Z')) / 60000))

          });
        }
      });
    }
  };

  const recenterMap = () => {
    if (mapRef.current) {
      mapRef.current.setView([companyLat, companyLng], zoom);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '99%', width: '99%', paddingTop: 45, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden', borderRadius: '6px' }} ref={mapContainerRef}>
        <div id="mapa" style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{
        position: 'absolute', bottom: 200, right: 10, width: '45px', height: '45px', backgroundColor: secondColor(theme), display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        borderRadius: 50, boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.36)', cursor: 'pointer', border: '4px solid #eaa37a47',
      }} onClick={() => { recenterMap() }}>
        <FontAwesomeIcon icon={faCrosshairs} style={{ zIndex: 100, color: fontColorOne(theme), fontSize: '28px' }} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: secondColor(theme), boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.36)', borderRadius: '0px 0px 3px 3px', zIndex: 1000,
        position: 'absolute', bottom: 10, flexWrap: 'wrap', fontSize: isDesktopView ? '16px' : '15px', margin: '0px 5px', borderRadius: '6px', border: '4px solid #eaa37a47', color: fontColorOne(theme),
      }}>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>

          <div style={{
            padding: '3px', textAlign: 'center', position: 'absolute', left: -4, top: -34, backgroundColor: secondColor(theme), borderRadius: '3px', borderTop: '4px solid #eaa37a47', borderLeft: '4px solid #eaa37a47',
            borderRight: '4px solid #eaa37a47', color: fontColorOne(theme),
          }}>
            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>Waiting Time</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(3) }}></div> <span> 1-5  </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(8) }}></div> <span> 6-10 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(15) }}></div> <span> 11-20 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(25) }}></div> <span> 21-30 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(35) }}></div> <span> 31-40 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(45) }}></div> <span > 41-50 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}><div className='divMapaDeliveryPoint' style={{backgroundColor: selectMarkerColor(55) }}></div> <span> 51-60 </span></div>


          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div className='divMapaDeliveryPoint' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', alignContent: 'center', position: 'relative', backgroundColor: selectMarkerColor(68), }}>
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: isDesktopView ? '18px' : '14px', position: 'absolute', bottom: isDesktopView ? 25 : 20 }} />
            </div><span> 61-70 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '8px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div className='divMapaDeliveryPoint' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', backgroundColor: "#e40e0e", border: '4px solid #f36818', }}>
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: isDesktopView ? '25px' : '20px', position: 'absolute', bottom: isDesktopView ? 20 : 15, textShadow: '0px 2px 100px rgba(0,0,0,0.4)' }} />
            </div><span> 70+ </span></div>

        </div>
        {/* <span style={{ color: 'black' }}> Minutes </span> */}
      </div>

      <style>{`
        .divMapaDeliveryPoint {
          width: ${isDesktopView ? '35px' : '25px'};
          height: ${isDesktopView ? '35px' : '25px'};
          border-radius: 50%;
          margin-right: 2;
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.30);
        }
      `}
      </style>
    </div >
  );
}