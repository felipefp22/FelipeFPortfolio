import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { createCustomer, updateCustomerService } from "../../../../../services/deliveryServices/CustomerSevice";
import { useSelector } from "react-redux";
import SelectCustumerAddressMap from "./auxComponents/SelectCustumerAddressMap";
import { searchAddress } from "../../../../../services/deliveryServices/auxServices/mapService";
import { borderColorTwo } from "../../../../../theme/Colors";
import { calculateEstimatedKm, calculatePrice } from '../../../../../redux/calculateDeliveryDistancePrice';
import { useTranslation } from 'react-i18next';

export default function NewCustomerModal({ close, companyOperation, customerToEdit, fetchCustomers }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const { t, i18n } = useTranslation();

    const [disabled, setDisabled] = useState(false);

    const [customerToEditID, setCustomerToEditID] = useState(null);
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
        console.log("customerToEdit", customerToEdit);
    }, []);

    useEffect(() => {
        if (customerToEdit && customerToEdit?.id) {
            setCustomerToEditID(customerToEdit?.id);
            setName(customerToEdit?.customerName || "");
            setPhone(customerToEdit?.phone || "");
            setEmail(customerToEdit?.email || "");
            setAddress(customerToEdit?.address || "");
            setAddressNumber(customerToEdit?.addressNumber || "");
            setCity(customerToEdit?.city || "");
            setState(customerToEdit?.state || "");
            setZipCode(customerToEdit?.zipCode || "");
            setLat(customerToEdit?.lat || "");
            setLng(customerToEdit?.lng || "");
            setComplement(customerToEdit?.complement || "");
        }
    }, []);

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

        setDisabled(true);
        const response = await createCustomer(companyOperation?.companyOperationID, name, phone, email, address, addressNumber, city, state, zipCode, lat, lng, complement);
        if (response?.status === 200) {
            fetchCustomers(response?.data?.id);
            close();
        } else {
            alert("Error creating customer: ", response?.data);
        }
        setDisabled(false);
    }

    async function updateCustomer() {
        if (!name || !phone || !address || !addressNumber || !city || !state || !zipCode || !lat || !lng) {
            alert("Please fill in all fields");
            return;
        }

        if (customerToEdit?.customerName !== name || customerToEdit?.phone !== phone || customerToEdit?.email !== email || customerToEdit?.address !== address || customerToEdit?.addressNumber !== addressNumber ||
            customerToEdit?.city !== city || customerToEdit?.state !== state || customerToEdit?.zipCode !== zipCode || customerToEdit?.lat !== lat || customerToEdit?.lng !== lng || customerToEdit?.complement !== complement) {
            setDisabled(true);
            const response = await updateCustomerService(companyOperation?.companyOperationID, customerToEdit?.id, name, phone, email, address, addressNumber, city, state, zipCode, lat, lng, complement);
            if (response?.status === 200) {
                fetchCustomers(response?.data?.id);
                close();
            } else {
                alert("Error updating customer: ", response?.data);
            }
        }
        setDisabled(false);
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
        if (addressFoundSelected == null) return;
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
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "97%", maxHeight: '95%', padding: !isPcV ? '10px' : '20px', }}>

                <div className='flexRow' style={{ width: '100%', flexWrap: 'wrap', }}>
                    <div className='flexColumn' style={{ alignItems: 'flex-start', width: '62%', }}>
                        <span style={{ fontWeight: "600", fontSize: isPcV ? '16px' : '14px', }}>{t('rSys.customerDefaults.customerName')}</span>
                        <input className='inputStandart' type="text" value={name} onChange={(e) => setName(e.target.value)}
                            style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: 'white', color: 'black' }} />
                    </div>

                    <div style={{ width: '3%' }}></div>

                    <div className='flexColumn' style={{ alignItems: 'flex-start', width: '35%', }}>
                        <span style={{ fontWeight: "600", fontSize: isPcV ? '16px' : '14px', }}>{t('rSys.customerDefaults.customerPhone')}</span>
                        <input className='inputStandart' type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                            style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: 'white', color: 'black', textAlign: 'left' }} />
                    </div>
                </div>

                <div className='flexRow' style={{ width: '100%', flexWrap: 'wrap', }}>
                    <div className='flexColumn' style={{ alignItems: 'flex-start', width: '77%', }}>
                        <span style={{ fontWeight: "600", marginBottom: '5px', fontSize: isPcV ? '16px' : '14px', }}>{t('rSys.customerDefaults.customerAddress')}</span>
                        <input className='inputStandart' type="text" value={address ?? ""} onChange={(e) => setAddress(e.target.value)} disabled={true}
                            style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: 'lightgray', color: 'black' }} />
                    </div>
                    <div style={{ width: '3%' }}></div>
                    <div className='flexColumn' style={{ width: '20%' }}>
                        <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px', fontSize: isPcV ? '16px' : '14px', }}>{t('rSys.customerDefaults.customerAddressNumber')}</span>
                        <input className='inputStandart' type="text" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)} disabled={!lat || !lng || !address}
                            style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: (!lat || !lng || !address) ? 'lightgray' : 'white', color: 'black', textAlign: 'right' }} />
                    </div>
                </div>

                <div className='flexColumn' style={{ alignItems: 'flex-start', width: '100%', }}>
                    <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px', fontSize: isPcV ? '16px' : '14px', }}>{t('rSys.customerDefaults.customerAddressComplement')}</span>
                    <input className='inputStandart' type="text" value={complement} onChange={(e) => setComplement(e.target.value)} disabled={!lat || !lng || !address}
                        style={{ height: '30px', width: '100%', paddingLeft: '10px', backgroundColor: (!lat || !lng || !address) ? 'lightgray' : 'white', color: 'black' }} />
                </div>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0', marginTop: '5px' }}></div>

                <div className='flexColumn' style={{ width: '100%', }}>
                    <div ref={customerSelectorDropdownRef} style={{ position: 'relative', width: '100%', margin: '3px 0px', zIndex: 5 }}>
                        <input className='inputStandart'
                            type="text"
                            value={searchAddressInput}
                            onChange={e => setSearchAddressInput(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") { if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current); findAddress(); } }}
                            // onFocus={() => setShowAddressSelectorDropdown(true)}
                            onBlur={() => { setSearchAddressInput(""); setShowAddressSelectorDropdown(false); }}
                            placeholder={t('rSys.addressDefaults.searchAddressPlaceHolder')}
                            disabled={disabled}
                            style={{ width: '100%', paddingLeft: '10px', }}
                        />
                        {showAddressSelectorDropdown && (
                            <ul style={{ position: 'absolute', left: 2, top: 36, backgroundColor: 'white', color: 'black', width: '99%', minHeight: '200px', maxHeight: '468px', overflowY: 'auto', borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black', zIndex: 1000000 }}>
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

                    <div style={{ pointerEvents: disabled ? "none" : "auto", opacity: disabled ? 0.6 : 1, width: '100%', height: '100%' }} >
                        <SelectCustumerAddressMap lat={lat} setLat={setLat} lng={lng} setLng={setLng} address={address} setAddress={setAddress} companyOperation={companyOperation} setSearchAddressInput={setSearchAddressInput} showAddressSelectorDropdown={showAddressSelectorDropdown} />
                    </div>
                </div>

                <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: 10 }}>
                    <button className='buttonStandart red' style={{ marginLeft: '0px', visibility: disabled ? 'hidden' : 'visible' }} onClick={() => close()} disabled={disabled}>{t('buttons.cancel')}</button>
                    <button className='buttonStandart green' style={{ marginLeft: '0px' }} onClick={() => customerToEdit?.id ? updateCustomer() : saveCustomer()} disabled={disabled}>
                        {disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', }} /> : t('buttons.saveCustomer')}</button>
                </div>
            </div>

        </>
    );
}