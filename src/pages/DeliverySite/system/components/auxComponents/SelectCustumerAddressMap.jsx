import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";


export default function SelectCustumerAddressMap() {

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
            mapRef.current = L.map('mapa').setView([companyLat, companyLng], zoom); //

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


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '300px', width: '100%', minHeight: 0, minWidth: 0, overflow: 'hidden', borderRadius: '6px' }} ref={mapContainerRef}>
                <div id="mapa" style={{ width: '100%', height: '100%' }} />
            </div>
        </>
    )
}