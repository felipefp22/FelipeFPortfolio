import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import restaurantLogo from "../../../../../assets/restaurantLogo.png";
import redPinMapBox from "../../../../../assets/redPinMapBox.png";
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.css';

const restaurantIcon = L.icon({
    iconUrl: restaurantLogo,
    iconSize: [35, 35],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});
const addressIcon = L.icon({
    iconUrl: redPinMapBox,
    iconSize: [20, 50],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

export default function SelectCustumerAddressMap({ lat, lng, address }) {

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
    const addressMarkerRef = useRef(null);


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
            mapRef.current = L.map('mapa').setView([companyLat, companyLng], zoom); //

            L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                minZoom: 12,
                maxZoom: 17,
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(mapRef.current);

            L.marker([companyLat, companyLng], { icon: restaurantIcon })
                .addTo(mapRef.current)
                .bindPopup('RESTAURANTE');
            //------------------------------

            markersRef.current = L.layerGroup().addTo(mapRef.current);

            //------------------------------
            return () => {
                mapRef.current.remove(); // Remove o mapa ao desmontar para evitar leaks de memória
            };
        }
    }, [companyLat, companyLng]);

    useEffect(() => {
        if (lat && lng && mapRef.current) {
            // Move map to the new lat/lng
            mapRef.current.setView([lat, lng], 12);

            if (addressMarkerRef.current) {
                mapRef.current.removeLayer(addressMarkerRef.current);
            }

            addressMarkerRef.current = L.marker([lat, lng], { icon: addressIcon })
                .addTo(mapRef.current)
                .bindPopup(address)
                .openPopup();
        }
    }, [lat, lng]);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minWidth: 0, overflow: 'hidden', borderRadius: '6px' }} ref={mapContainerRef}>
                <div id="mapa" style={{ width: '100%', height: '100%', minHeight: 0 }} />
            </div>
        </>
    )
}