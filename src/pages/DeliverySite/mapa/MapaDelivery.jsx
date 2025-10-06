import { use, useEffect, useRef, useState } from 'react';
// import './../../App.css';
import L from 'leaflet'; // Import Leaflet
import restaurantLogo from '../../../assets/restaurantLogo.png'; // Import the restaurant logo
import importedVariables from '../../../assets/myVariables.json'; // Import the JSON file directly
import { PutDeliveryPlaces, selectMarkerColor } from './mapcomponentsandservices/DeliveryPlaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { filterLoccationsOverLaping, sanitizeLatLng } from './mapcomponentsandservices/ManageOverlapPoints';
import { useSelector } from 'react-redux';
import "leaflet/dist/leaflet.css";


export default function MapaDelivery({ }) {
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
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 19,
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

      console.log("Raw locations:", locations);

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

  // const centralizarMapa = () => {
  //   // Centraliza o mapa na posição especificada
  //   if (mapRef.current) {
  //     mapRef.current.setView([companyLat, companyLng], zoom);
  //   }
  // };

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '99%', width: '99%', paddingTop: 45, overflow: 'hidden', }}>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden', borderRadius: '6px' }}>
        <div id="mapa" style={{ width: '100%', height: '100%' }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255, 255, 255, 1)', height: '65px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.714)', borderRadius: '0px 0px 3px 3px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(3), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 1-5 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(8), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 6-10 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(15), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 11-20 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(25), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 21-30 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(35), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 31-40 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(45), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 41-50 min </h4>

          <div style={{ width: '35px', height: '35px', backgroundColor: selectMarkerColor(55), borderRadius: '50%', marginLeft: 10, marginRight: 2 }}></div> <h4 style={{ color: 'black' }}> 51-60 min </h4>


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '35px', height: '35px', backgroundColor: selectMarkerColor(68), borderRadius: '50%', marginLeft: 10, marginRight: 2, alignContent: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: '18=5px', position: 'absolute', bottom: 25 }} />
          </div> <h4 style={{ color: 'black' }}> 61-70 min </h4>


          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', width: '35px', height: '35px', backgroundColor: "#e40e0e", borderRadius: '50%', marginLeft: 10, marginRight: 2, border: '4px solid #f36818', }}>
            <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: '30px', position: 'absolute', bottom: 20, textShadow: '0px 2px 100px rgba(0,0,0,0.4)' }} />
          </div> <h4 style={{ color: 'black' }}> 70+ min </h4>

        </div>
      </div>
    </div>
  );
}