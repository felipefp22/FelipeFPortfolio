import { use, useEffect, useRef, useState } from 'react';
// import './../../App.css';
import L from 'leaflet'; // Import Leaflet
import restaurantLogo from '../../../assets/restaurantLogo.png'; // Import the restaurant logo
import importedVariables from '../../../assets/myVariables.json'; // Import the JSON file directly
import { PutDeliveryPlaces, selectMarkerColor } from './mapcomponentsandservices/DeliveryPlaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrosshairs, faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { filterLoccationsOverLaping, sanitizeLatLng } from './mapcomponentsandservices/ManageOverlapPoints';
import { useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";


export default function MapaDelivery({ }) {
  const isDesktopView = useSelector((state) => state.view.isDesktopView);
  const companyOperation = useSelector((state) => state.companyOperation);
  const [companyLat, setCompanyLat] = useState(null);
  const [companyLng, setCompanyLng] = useState(null);
  const [orders, setOrders] = useState([]);
  const [zoom, setZoom] = useState(localStorage.getItem('mapZoomLevel') || 15);

  const mapRef = useRef(null); // Referência para o mapa
  const markersRef = useRef(null); // Reference to manage markers

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
        .bindPopup('RESTAURANTE')
        .openPopup();
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
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    updateMarkersPutDeliveryPlaces();
  }, [orders]);

  function updateMarkersPutDeliveryPlaces() {
    if (companyOperation && zoom && companyLat && companyLng && markersRef.current) {

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
            minutes: Math.round((new Date() - location.orderDate) / 60000)
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

  // const handleZoomChange = (e) => {
  //   setZoom(Number(e.target.value)); // Update the zoom value

  //   localStorage.setItem('mapZoomLevel', e.target.value);
  //   if (mapRef.current) {
  //     mapRef.current.setZoom(Number(e.target.value));
  //   }
  // };

  // const [newLatRestaurant, setNewLatRestaurant] = useState("");
  // const [newLngRestaurant, setNewLngRestaurant] = useState("");

  // function saveNewRestaurantLocation() {
  //   if (newLatRestaurant && newLngRestaurant) {

  //   }
  // }

  // const [isModalVisible, setModalVisible] = useState(false); 
  // const handleOpenModal = () => {
  //   const latPattern = /^-?(90(\.0{1,8})?|[0-8]?\d(\.\d{1,8})?)$/;
  //   const lngPattern = /^-?(180(\.0{1,8})?|1[0-7]\d(\.\d{1,8})?|[0-9]?\d(\.\d{1,8})?)$/;

  //   if (
  //     newLatRestaurant &&
  //     latPattern.test(newLatRestaurant) &&
  //     newLngRestaurant &&
  //     lngPattern.test(newLngRestaurant)
  //   ) {
  //     setModalVisible(true);
  //   }
  // };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '99%', width: '99%', paddingTop: 45, overflow: 'hidden', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden', borderRadius: '6px' }}>
        <div id="mapa" style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{
        position: 'absolute', bottom: 200, right: 10, width: '45px', height: '45px', backgroundColor: 'rgba(254, 255, 227, 1)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        borderRadius: 50, boxShadow: '2px 4px 6px rgba(0, 0, 0, 0.36)', cursor: 'pointer', border: '4px solid #eaa37a47',
      }} onClick={() => { recenterMap() }}>
        <FontAwesomeIcon icon={faCrosshairs} style={{ zIndex: 100, color: 'rgba(0, 0, 0, 0.6)', fontSize: '32px' }} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(254, 255, 227, 1)', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.36)', borderRadius: '0px 0px 3px 3px', zIndex: 1000,
        position: 'absolute', bottom: 10, flexWrap: 'wrap', fontSize: isDesktopView ? '16px' : '15px', margin: '0px 5px', borderRadius: '6px', border: '4px solid #eaa37a47',
      }}>

        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>

          <div style={{ padding: '3px', textAlign: 'center', position: 'absolute', left: -4, top: -34, backgroundColor: 'rgba(254, 255, 227, 0.9)', borderRadius: '3px', borderTop: '4px solid #eaa37a47', borderLeft: '4px solid #eaa37a47', 
            borderRight: '4px solid #eaa37a47', }}>
            <span style={{ color: 'black', fontWeight: 'bold', fontSize: '16px' }}>Waiting Time</span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(3), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 1-5  </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(8), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 6-10 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(15), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 11-20 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(25), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 21-30 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(35), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 31-40 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(45), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 41-50 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(55), borderRadius: '50%', marginRight: 2, boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)' }}></div> <span style={{ color: 'black' }}> 51-60 </span></div>


          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '5px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: selectMarkerColor(68),
              borderRadius: '50%', marginRight: 2, alignContent: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)'
            }}>
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: isDesktopView ? '18px' : '14px', position: 'absolute', bottom: isDesktopView ? 25 : 20 }} />
            </div> <span style={{ color: 'black' }}> 61-70 </span></div>

          <div style={{ display: 'flex', flexWrap: 'nowrap', margin: '8px 5px', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: isDesktopView ? '35px' : '25px', height: isDesktopView ? '35px' : '25px', backgroundColor: "#e40e0e",
              borderRadius: '50%', marginRight: 2, border: '4px solid #f36818', boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)'
            }}>
              <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: isDesktopView ? '25px' : '20px', position: 'absolute', bottom: isDesktopView ? 20 : 15, textShadow: '0px 2px 100px rgba(0,0,0,0.4)' }} />
            </div> <span style={{ color: 'black' }}> 70+ </span></div>

        </div>
        {/* <span style={{ color: 'black' }}> Minutes </span> */}
      </div>
    </div >
  );
}