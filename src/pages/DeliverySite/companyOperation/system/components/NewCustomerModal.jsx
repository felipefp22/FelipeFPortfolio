import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { createCustomer } from "../../../../../services/deliveryServices/CustomerSevice";
import { useSelector } from "react-redux";
import SelectCustumerAddressMap from "./auxComponents/SelectCustumerAddressMap";
import { searchAddress } from "../../../../../services/deliveryServices/auxServices/mapService";
import { borderColorTwo } from "../../../../../theme/Colors";

export default function NewCustomerModal({ close, companyOperationID, fetchCustomers }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [disabled, setDisabled] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [complement, setComplement] = useState("");

    const customerSelectorDropdownRef = useRef(null);
    const [showAddressSelectorDropdown, setShowAddressSelectorDropdown] = useState(false);
    const [searchAddressInput, setSearchAddressInput] = useState("");
    const typingTimeoutRef = useRef(null);
    const [addressFoundOptions, setAddressFoundOptions] = useState(false);
    const [addressFoundSelected, setAddressFoundSelected] = useState(null);
    const [addressSearchLoading, setAddressSearchLoading] = useState(false);

    const [showBoxCreateFakesCustomers, setShowBoxCreateFakesCustomers] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (customerSelectorDropdownRef.current && !customerSelectorDropdownRef.current.contains(event.target)) {
                setShowAddressSelectorDropdown(false);
                setAddressFoundOptions(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    async function saveCustomer() {
        if (!name || !phone || !address || !addressNumber || !city || !state || !zipCode || !lat || !lng) {
            alert("Please fill in all fields");
            return;
        }

        const response = await createCustomer(companyOperationID, name, phone, email, address, addressNumber, city, state, zipCode, lat, lng, complement);
        if (response?.status === 200) {
            fetchCustomers(response?.data?.id);
            close();
        } else {
            alert("Error creating customer: ", response?.data);
        }
    }

    async function findAddress() {
        const response = await searchAddress(searchAddressInput);
        setAddressFoundOptions(response?.data?.length > 0 ? response?.data : []);
        setAddressSearchLoading(false);
    }

    useEffect(() => {
        // Clear previous debounce timer
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);


        if (searchAddressInput?.length > 3) {
            setShowAddressSelectorDropdown(true);

            // Start a new debounce timer (2 seconds)
            typingTimeoutRef.current = setTimeout(() => {
                setAddressSearchLoading(true);
                findAddress();
            }, 700);
        } else {
            setShowAddressSelectorDropdown(false);
            setAddressSearchLoading(false);
        }

    }, [searchAddressInput]);


    useEffect(() => {
        setLat(addressFoundSelected?.lat);
        setLng(addressFoundSelected?.lon);
        setAddress(addressFoundSelected?.display_name);
        setCity(addressFoundSelected?.display_name)
        setState(addressFoundSelected?.display_name)
        setZipCode(addressFoundSelected?.display_name)
        setShowAddressSelectorDropdown(false);
    }, [addressFoundSelected]);

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "97%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', zIndex: 10, }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', fontSize: isPcV ? '14px' : '12px', }}>
                    {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => setShowBoxCreateFakesCustomers(true)}>Create FAKES Customers To Test</button>
                    </div> */}

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '60%', }}>
                            <span style={{ fontWeight: "600", fontSize: isPcV ? '16px' : '14px', }}>Customer Name</span>
                            <input className='inputStandart' type="text" value={name} onChange={(e) => setName(e.target.value)}
                                style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: 'white', color: 'black' }} />
                        </div>
                        <div style={{ width: '3%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '32%', }}>
                            <span style={{ fontWeight: "600", fontSize: isPcV ? '16px' : '14px', }}>Phone</span>
                            <input className='inputStandart' type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                                style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: 'white', color: 'black', textAlign: 'left' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', fontSize: isPcV ? '14px' : '12px', }}>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '72%', }}>
                            <span style={{ fontWeight: "600", marginBottom: '5px', fontSize: isPcV ? '16px' : '14px', }}>Customer Address</span>
                            <input className='inputStandart' type="text" value={address ?? ""} onChange={(e) => setAddress(e.target.value)} disabled={true}
                                style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: 'lightgray', color: 'black' }} />
                        </div>
                        <div style={{ width: '3%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
                            <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px', fontSize: isPcV ? '16px' : '14px', }}>Number</span>
                            <input className='inputStandart' type="text" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} disabled={!lat || !lng || !address}
                                style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: (!lat || !lng || !address) ? 'lightgray' : 'white', color: 'black', textAlign: 'right' }} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                        <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px', fontSize: isPcV ? '16px' : '14px', }}>Complement</span>
                        <input className='inputStandart' type="text" value={complement} onChange={(e) => setComplement(e.target.value)} disabled={!lat || !lng || !address}
                            style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: (!lat || !lng || !address) ? 'lightgray' : 'white', color: 'black' }} />
                    </div>
                </div>


                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '290px', }}>
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
                        />
                        {showAddressSelectorDropdown && (
                            <ul style={{ position: 'absolute', left: 9, top: 40, backgroundColor: 'white', color: 'black', width: '89%', minHeight: '200px', maxHeight: '468px', overflowY: 'auto', zIndex: 10000, borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black' }}>
                                {addressFoundOptions?.length > 0 ? (
                                    addressFoundOptions.map((addressOpt, index) =>
                                    (addressSearchLoading ? (
                                        <Spinner animation="border" role="status" style={{ width: '25px', height: '25px', color: 'gray', marginTop: '10px' }} />
                                    ) : (
                                        <li
                                            key={index}
                                            onMouseDown={() => { setAddressFoundSelected(addressOpt); setAddressFoundOptions(null); setShowAddressSelectorDropdown(false); }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {addressOpt?.display_name}
                                        </li>
                                    )))
                                ) : (addressSearchLoading ? (
                                    <Spinner animation="border" role="status" style={{ width: '25px', height: '25px', color: 'gray', marginTop: '10px' }} />
                                ) : (
                                    <li style={{ fontWeight: "600" }} >{"No matches found"}</li>
                                ))
                                }
                            </ul>
                        )}
                    </div>
                    <SelectCustumerAddressMap lat={lat} setLat={setLat} lng={lng} setLng={setLng} address={address} setAddress={setAddress} setSearchAddressInput={setSearchAddressInput} showAddressSelectorDropdown={showAddressSelectorDropdown} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '0px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className='buttomStandart red' style={{ marginLeft: '0px' }} onClick={() => close()}>Cancel</button>
                            <button className='buttomStandart green' style={{ marginLeft: '0px' }} onClick={() => saveCustomer()}>Save Customer</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}