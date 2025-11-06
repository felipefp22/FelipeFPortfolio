import { useEffect, useRef, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, greenTwo, redOne } from "../../../../../../theme/Colors";
import restaurantLogo from "../../../../../../assets/restaurantLogo.png";
import { searchAddress } from "../../../../../../services/deliveryServices/auxServices/mapService";

const restaurantIcon = L.icon({
    iconUrl: restaurantLogo,
    iconSize: [35, 35],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
});

export default function EditCompanyAddressModal({ close, companyLat, setCompanyLat, companyLng, setCompanyLng, companyAddress, setCompanyAddress }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [disabled, setDisabled] = useState(false);
    const [loading, setLoading] = useState(false);

    const companyOperation = useSelector((state) => state.companyOperation);
    const [zoom, setZoom] = useState((companyLat && companyLng) ? 15 : 8);

    const mapRef = useRef(null); // Referência para o mapa
    const markersRef = useRef(null); // Reference to manage markers
    const mapContainerRef = useRef(null);

    const customerSelectorDropdownRef = useRef(null);
    const [showAddressSelectorDropdown, setShowAddressSelectorDropdown] = useState(false);
    const [searchAddressInput, setSearchAddressInput] = useState("");
    const typingTimeoutRef = useRef(null);
    const [addressFoundOptions, setAddressFoundOptions] = useState(false);
    const [addressFoundSelected, setAddressFoundSelected] = useState(null);

    const [candidateNewLat, setCandidateNewLat] = useState("33.715831");
    const [candidateNewLng, setCandidateNewLng] = useState("-117.989569");
    const [candidateNewAddress, setCandidateNewAddress] = useState(null);
    const [candidateNewCity, setCandidateNewCity] = useState(null);
    const [candidateNewState, setCandidateNewState] = useState(null);
    const [candidateNewZipCode, setCandidateNewZipCode] = useState(null);

    useEffect(() => {
        if (companyLat && companyLng && companyAddress) {
            setCandidateNewLat(companyLat);
            setCandidateNewLng(companyLng);
            setCandidateNewAddress(companyAddress);
        }
    }, [companyLat, companyLng, companyAddress]);

    useEffect(() => {
        if (mapRef.current || !mapContainerRef.current) return;

        const checkContainerReady = setInterval(() => {
            const rect = mapContainerRef.current.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                clearInterval(checkContainerReady);

                mapRef.current = L.map("mapa", {
                    center: [candidateNewLat, candidateNewLng],
                    zoom,
                });

                L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
                    minZoom: 8,
                    maxZoom: 19,
                    attribution: "&copy; OpenStreetMap contributors",
                }).addTo(mapRef.current);

                markersRef.current = L.layerGroup().addTo(mapRef.current);

                mapRef.current.on("click", function (e) {
                    const { lat, lng } = e.latlng;

                    if (!showAddressSelectorDropdown) setSearchAddressInput(`${lat}, ${lng}`);
                    // if (!showAddressSelectorDropdown) findAddressDirectlyByLatAndLngClick(`${lat}, ${lng}`);
                });

                // Add initial marker
                L.marker([candidateNewLat, candidateNewLng], { icon: restaurantIcon })
                    .addTo(markersRef.current)
                    .bindPopup(candidateNewAddress ?? "SELECT ADDRESS")
                    .openPopup();

                // Ensure proper render
                setTimeout(() => {
                    mapRef.current.invalidateSize();
                    mapRef.current.setView([candidateNewLat, candidateNewLng]);
                }, 150);
            }
        }, 100);

        return () => clearInterval(checkContainerReady);
    }, []);

    useEffect(() => {
        if (!mapRef.current || !markersRef.current) return;

        markersRef.current.clearLayers();
        L.marker([candidateNewLat, candidateNewLng], { icon: restaurantIcon })
            .addTo(markersRef.current)
            .bindPopup(candidateNewAddress ?? "SELECT ADDRESS")
            .openPopup();

        mapRef.current.setView([candidateNewLat, candidateNewLng], 17);
    }, [candidateNewLat, candidateNewLng, candidateNewAddress]);

    async function findAddress() {

        const response = await searchAddress(searchAddressInput);
        setAddressFoundOptions(response?.data?.length > 0 ? response?.data : []);
        setLoading(false);
    }

    // async function findAddressDirectlyByLatAndLngClick(searchLatAndLng) {

    //     const response = await searchAddress(searchLatAndLng);
    //     if (response?.data?.length > 0) setAddressFoundSelected(response?.data[0]);
    // }

    useEffect(() => {
        if (searchAddressInput === "") return;
        // Clear previous debounce timer
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Start a new debounce timer (2 seconds)
        if (searchAddressInput?.length > 3) {
            setShowAddressSelectorDropdown(true);
            setLoading(true);
            typingTimeoutRef.current = setTimeout(() => {
                findAddress();
            }, 700);
        } else {
            setShowAddressSelectorDropdown(false);
        }
    }, [searchAddressInput]);

    useEffect(() => {
        setCandidateNewLat(addressFoundSelected?.lat);
        setCandidateNewLng(addressFoundSelected?.lon);
        setCandidateNewAddress(addressFoundSelected?.display_name);
        setCandidateNewCity(addressFoundSelected?.display_name);
        setCandidateNewState(addressFoundSelected?.display_name);
        setCandidateNewZipCode(addressFoundSelected?.display_name);
        setShowAddressSelectorDropdown(false);
    }, [addressFoundSelected]);

    async function saveNewAddress() {
        setCompanyLat(candidateNewLat);
        setCompanyLng(candidateNewLng);
        setCompanyAddress(candidateNewAddress);
        close();
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '10px', width: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", }}>
                <div className='flexColumn' style={{ height: '490px', }}>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginBottom: '10px', color: borderColorTwo(theme) }}>Search or "Click on Map Location"</span>

                    <div ref={customerSelectorDropdownRef} style={{ position: 'relative', width: '100%', margin: '3px 0px' }}>
                        <input className='inputStandart'
                            type="text"
                            value={searchAddressInput}
                            onChange={e => setSearchAddressInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); findAddress(); } }}
                            // onFocus={() => setShowAddressSelectorDropdown(true)}
                            onBlur={() => { setSearchAddressInput(""); setShowAddressSelectorDropdown(false); }}
                            placeholder="Search address"
                            disabled={disabled}
                            style={{ width: '100%', paddingLeft: '10px', }}
                            autoComplete="chrome-off"
                            name="noautocomplete"
                        />

                        {showAddressSelectorDropdown && (
                            <ul style={{ position: 'absolute', left: 2, top: 37, width: '99%', backgroundColor: 'white', color: 'black', minHeight: '200px', maxHeight: '468px', overflowY: 'auto',borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black' }}>
                                {addressFoundOptions?.length > 0 ? (
                                    addressFoundOptions.map((addressOpt, index) => (
                                        <li
                                            key={index}
                                            onMouseDown={() => { setAddressFoundSelected(addressOpt); setShowAddressSelectorDropdown(false); }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {addressOpt?.display_name}
                                        </li>
                                    ))
                                ) :
                                    (loading ? (
                                        <Spinner animation="border" role="status" style={{ width: '25px', height: '25px', color: 'gray', marginTop: '10px' }} />
                                    ) : (
                                        <li style={{ fontWeight: "600" }} >{"No matches found"}</li>
                                    ))
                                }
                            </ul>
                        )}
                    </div>
                    <div className='flexColumn' style={{ height: '100%', width: '100%', overflow: 'hidden', borderRadius: '0px 0px 6px 6px' }} ref={mapContainerRef}>
                        <div id="mapa" style={{ width: '100%', height: '100%', minHeight: 0, cursor: 'pointer' }} />
                    </div>

                    <div className='flexRow' style={{ justifyContent: 'space-between', width: '100%', marginTop: '20px' }}>
                        <button className='buttonStandart' style={{ background: 'none', color: 'gray', border: 'none' }} onClick={() => { close() }} >Cancel</button>

                        <button className='buttonStandart' style={{ background: 'none', color: greenTwo(theme), border: 'none' }} onClick={() => { saveNewAddress() }} >Save</button>
                    </div>
                </div>
            </div>
        </>
    );
}