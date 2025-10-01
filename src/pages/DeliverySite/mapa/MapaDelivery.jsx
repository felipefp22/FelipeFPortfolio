import { useEffect, useRef, useState } from 'react';
// import './../../App.css';
import L from 'leaflet'; // Import Leaflet
import PizzaFav from '../../../assets/pizza.png'; // Import your pizza icon
import importedVariables from '../../../assets/myVariables.json'; // Import the JSON file directly
import { PutDeliveryPlaces, selectMarkerColor } from './mapcomponentsandservices/DeliveryPlaces';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';
import { filterLoccationsOverLaping, sanitizeLatLng } from './mapcomponentsandservices/ManageOverlapPoints';

export default function MapaDelivery({  }) {
  const [settings, setSettings] = useState({});

  const [myVariables, setMyVariables] = useState(null)
  const mapRef = useRef(null); // Referência para o mapa
  const [locations, setLocations] = useState([]); // State to hold locations
  const [zoom, setZoom] = useState(null); // State to hold the zoom level
  const markersRef = useRef(null); // Reference to manage markers

  useEffect(() => {
    if (myVariables && zoom && myVariables.mainLocationLatitude && myVariables.mainLocationLongitude) {
      // Inicializa o mapa
      mapRef.current = L.map('mapa').setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], zoom); // Define a centralização do mapa

      // Adiciona uma camada de tiles do OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 12,
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(mapRef.current);

      // Adicionando marcador principal
      const pizzaIcon = L.icon({
        iconUrl: PizzaFav,
        iconSize: [70, 70],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
      L.marker([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], { icon: pizzaIcon })
        .addTo(mapRef.current)
        .bindPopup('RESTAURANTE')
        .openPopup();
      //------------------------------
      // Marcadores lugares de entrega

      markersRef.current = L.layerGroup().addTo(mapRef.current);

      fetchDataToLocation();

    setTimeout(() => {
      mapRef.current.invalidateSize();
    }, 0);
      //------------------------------
      return () => {
        mapRef.current.remove(); // Remove o mapa ao desmontar para evitar leaks de memória
      };
    }
  }, [myVariables, zoom]);

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
    // Load settings when the component mounts
    if (window.electronAPI?.loadSettings) {
      window.electronAPI.loadSettings().then((loadedSettings) => {
        setSettings(loadedSettings);
        setMyVariables(loadedSettings);
        setZoom(loadedSettings.zoom);
      });
    } else {
      setSettings(importedVariables);
      setMyVariables(importedVariables);
      setZoom(importedVariables.zoom);
    }
  }, []);


  useEffect(() => {
    updateMarkersPutDeliveryPlaces();
  }, [locations]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchDataToLocation();
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  function updateMarkersPutDeliveryPlaces() {
    if (myVariables && zoom && myVariables.mainLocationLatitude && myVariables.mainLocationLongitude && markersRef.current) {

      if (markersRef.current) {
        markersRef.current.clearLayers(); // Clear existing markers
      }

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

  const centralizarMapa = () => {
    // Centraliza o mapa na posição especificada
    if (mapRef.current) {
      mapRef.current.setView([myVariables.mainLocationLatitude, myVariables.mainLocationLongitude], zoom);
    }
  };

  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value)); // Update the zoom value

    const updatedSettings = {
      ...settings,
      zoom: Number(e.target.value),
    };

    window.electronAPI.saveSettings(updatedSettings).then((response) => {
      setSettings(updatedSettings); // Update state with the new settings
    });

    // Save to local storage as a demonstration (to persist the updated values)
    // localStorage.setItem('myVariables', JSON.stringify(updatedVariables));
  };

  function fetchDataToLocation() {
    setLocations(
      [{ latitude: -23.652398, longitude: -46.708661, orderNum: '8', orderDate: new Date("2025-07-12T20:45:00Z") },
      { latitude: -23.652398, longitude: -46.7086, orderNum: '10', orderDate: new Date("2025-07-12T20:45:00Z") },
      { latitude: -23.652398, longitude: -46.7086, orderNum: '10', orderDate: new Date("2025-07-12T20:45:00Z") },
      { latitude: -23.652398, longitude: -46.7086, orderNum: '11', orderDate: new Date("2025-07-12T20:45:00Z") },
      { latitude: -23.652398, longitude: -46.7086, orderNum: '12', orderDate: new Date("2025-07-12T20:45:00Z") },
      { latitude: -23.652, longitude: -46.7089, orderNum: '52', orderDate: new Date("2025-07-12T20:45:00Z") }])
  };

  const [newLatRestaurant, setNewLatRestaurant] = useState("");
  const [newLngRestaurant, setNewLngRestaurant] = useState("");

  function saveNewRestaurantLocation() {
    // Save the new restaurant location
    if (newLatRestaurant && newLngRestaurant) {

      const updatedSettings = {
        ...settings,
        mainLocationLatitude: newLatRestaurant,
        mainLocationLongitude: newLngRestaurant,
      };

      // Save the updated settings
      window.electronAPI.saveSettings(updatedSettings).then((response) => {
        setSettings(updatedSettings); // Update state with the new settings
      });

      setNewLatRestaurant(null);
      setNewLngRestaurant(null);
      window.location.reload();
    }

  }

  const [isModalVisible, setModalVisible] = useState(false); // State to control the modal visibility
  const handleOpenModal = () => {
    const latPattern = /^-?(90(\.0{1,8})?|[0-8]?\d(\.\d{1,8})?)$/;

    const lngPattern = /^-?(180(\.0{1,8})?|1[0-7]\d(\.\d{1,8})?|[0-9]?\d(\.\d{1,8})?)$/;

    if (
      newLatRestaurant &&
      latPattern.test(newLatRestaurant) &&
      newLngRestaurant &&
      lngPattern.test(newLngRestaurant)
    ) {
      setModalVisible(true);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '99%', width: '99%', paddingTop: 45, overflow: 'hidden',  }}>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden' }}>
        <div id="mapa" style={{ width: '1000px', height: '1000px' }} />
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