import { useSelector } from "react-redux";
import NewCustomerModal from "../NewCustomerModal";
import { useEffect, useRef, useState } from "react";
import { getAllCompanyCustomers } from "../../../../../../services/deliveryServices/CustomerSevice";
import CancelOrder from "../CancelOrderModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { blueOne, borderColorOne, borderColorTwo, greenOne, greenTwo, redOne } from "../../../../../../theme/Colors";
import { Spinner } from "react-bootstrap";
import { editOrderService } from "../../../../../../services/deliveryServices/OrderService";



export default function ChangeTableOrCustomerModal({ close, tableNumberOrDeliveryOrPickup, orderToEdit, pickupName, customerSelected, companyOperation, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disabled, setDisabled] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);

    const [allCompanyCustomers, setAllCompanyCustomers] = useState([]);

    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const customerSelectorDropdownRef = useRef(null);

    const [customerInputToSearch, setCustomerInputToSearch] = useState("");
    const [customersMatched, setCustomersMatched] = useState([]);

    const [selectUseCustomerOrPickUpName, setSelectUseCustomerOrPickUpName] = useState(orderToEdit?.customer ? 'Customer' : 'Name');

    const [editNameCustomer, setEditNameCustomer] = useState(false);
    const [editTable, setEditTable] = useState(false);

    const [newPickupNameCandidate, setNewPickupNameCandidate] = useState(null);
    const [newCustomerCandidate, setNewCustomerCandidate] = useState(null);
    const [newTableCandidate, setNewTableCandidate] = useState(tableNumberOrDeliveryOrPickup);


    async function fetchCustomers(customerIDToSelectAfterFetch) {
        try {
            const response = await getAllCompanyCustomers(companyOperation?.companyOperationID);
            if (response?.status === 200) {
                setAllCompanyCustomers(response?.data || []);

                if (customerIDToSelectAfterFetch) {
                    const customerFound = response?.data.find(customer => customer.id === customerIDToSelectAfterFetch);
                    setCustomerSelectedToNewOrder(customerFound);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchCustomers();
    }, []);

    useEffect(() => {
        handleCustomerSearchInputChange();
    }, [allCompanyCustomers, customerInputToSearch]);

    async function handleCustomerSearchInputChange() {

        const filtered = allCompanyCustomers
            .filter(opt =>
                opt.customerName?.toLowerCase().includes(customerInputToSearch.toLowerCase()) ||
                opt.phone?.toLowerCase().replace(/\D/g, "").includes(customerInputToSearch.toLowerCase())
            );

        setCustomersMatched(filtered);
    };

    async function saveChangeNameOrCustomer() {
        if (newCustomerCandidate === null && newPickupNameCandidate === null) {
            setEditNameCustomer(false);
            return;
        }

        if (customerSelected === newCustomerCandidate && pickupName === newPickupNameCandidate) {
            setEditNameCustomer(false);
            return;
        }
        setDisabled(true);

        const response = await editOrderService(companyOperation?.companyOperationID, orderToEdit.id, tableNumberOrDeliveryOrPickup, newCustomerCandidate?.id, newPickupNameCandidate, null);

        if (response?.status === 200) {
            await getShiftOperationData();
            setNewCustomerCandidate(null);
            setNewPickupNameCandidate(null);
            setEditNameCustomer(false);
        }

        setDisabled(false);
    }

    async function saveChangeTable() {
        if (tableNumberOrDeliveryOrPickup === newTableCandidate || newTableCandidate === null) {
            setEditTable(false);
            return;
        }
        setDisabled(true);

        const response = await editOrderService(companyOperation?.companyOperationID, orderToEdit.id, newTableCandidate, customerSelected?.id, pickupName, null);

        if (response?.status === 200) {
            await getShiftOperationData();
            setNewTableCandidate(response.data.tableNumberOrDeliveryOrPickup);
            setEditTable(false);
        }

        setDisabled(false);
    }

    return (
        <>
            <div className="modalInside" style={{ width: !isDesktopView ? "100%" : "97%", maxHeight: !isDesktopView ? '90%' : '80%', padding: !isDesktopView ? '10px' : '10px', }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '8px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                        <button className="buttomStandart" style={{
                            fontSize: isDesktopView ? '17px' : '14px', padding: isDesktopView ? '0px 5px' : '0px 3px',
                            visibility: editNameCustomer ? (selectUseCustomerOrPickUpName === 'Customer' ? 'visible' : 'hidden') : 'hidden'
                        }}
                            onClick={() => setShowNewCustomerModal(true)} disabled={disabled}>New customer</button>

                        {!editNameCustomer && ! editTable && <button className="buttomStandart" style={{ fontSize: isDesktopView ? '17px' : '14px', padding: isDesktopView ? '0px 5px' : '0px 3px', }}
                            onClick={() => { setEditNameCustomer(true) }} disabled={disabled}>Change Name/Customer</button>}


                        {editNameCustomer && <div style={{ display: 'flex', flexDirection: 'row', }}>
                            {!disabled && <button style={{
                                display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }} onClick={() => { setNewCustomerCandidate(null); setNewPickupNameCandidate(null); setEditNameCustomer(false); setSelectUseCustomerOrPickUpName(orderToEdit?.customer ? 'Customer' : 'Name') }} >
                                <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                            </button>}

                            <button style={{
                                display: 'flex', borderRadius: '50%', backgroundColor: disabled ? 'lightgray' : greenOne(theme), marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                            }} onClick={() => { saveChangeNameOrCustomer(); }} >
                                {!disabled && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                                {disabled && <Spinner animation="border" role="status" variant="light" style={{ width: '18px', height: '18px', margin: '0', padding: 0 }} />}
                            </button>
                        </div>}
                    </div>
                </div>

                {editNameCustomer && <div style={{ marginBottom: '5px' }}>
                    {tableNumberOrDeliveryOrPickup === 'delivery' && <span style={{ fontWeight: "600" }}>Customer</span>}
                    {tableNumberOrDeliveryOrPickup !== 'delivery' && <select className="inputStandart" value={selectUseCustomerOrPickUpName || ''} placeholder="Table" onChange={(e) => setSelectUseCustomerOrPickUpName(e.target.value)}
                        style={{ minWidth: '30px', maxWidth: '90px', height: '30px', padding: '0px', borderRadius: '6px', fontSize: isDesktopView ? '17px' : '14px', textAlign: 'left', }} >
                        <option value='' disabled hidden> Select </option>
                        <option value={'Customer'}> {'Customer'} </option>
                        <option value={'Name'}> {'Name'} </option>
                    </select>}
                </div>}

                {selectUseCustomerOrPickUpName === 'Name' && <div>
                    {!editNameCustomer && <span style={{ fontWeight: "600", padding: '10px 0px', }}>Name:</span>}

                    {!editNameCustomer && <input className="inputStandart" type="text" value={pickupName} onChange={(e) => { }} disabled={true}
                        style={{ height: '35px', fontSize: isDesktopView ? '18px' : '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', textAlign: 'center', overflowX: 'auto', margin: '10px 0px', }} />}

                    {editNameCustomer && <input className="inputStandart" type="text" value={newPickupNameCandidate ?? pickupName} onChange={(e) => setNewPickupNameCandidate(e.target.value)} disabled={disabled}
                        style={{ height: '35px', fontSize: isDesktopView ? '18px' : '16px', backgroundColor: disabled ? 'lightgray' : 'white', color: 'black', width: '100%', textAlign: 'center', overflowX: 'auto', margin: '10px 0px', }} />}
                </div>}

                {selectUseCustomerOrPickUpName === 'Customer' && <div>
                    <div ref={customerSelectorDropdownRef} style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%' }}>
                        {!editNameCustomer && <span style={{ fontWeight: "600", padding: '0px 0px', }}>Customer:</span>}

                        <input
                            type="text"
                            value={!editNameCustomer ? (customerSelected?.customerName + " / " + customerSelected?.phone) : (showCustomerSelectorDropdown ? customerInputToSearch : (newCustomerCandidate ? newCustomerCandidate?.customerName + " / " + newCustomerCandidate?.phone : ""))}
                            onChange={e => setCustomerInputToSearch(e.target.value)}
                            onFocus={() => setShowCustomerSelectorDropdown(true)}
                            onBlur={() => { setCustomerInputToSearch(""); setShowCustomerSelectorDropdown(false); }}
                            placeholder={editNameCustomer ? "Search Customer by Name or Phone" : "Select Customer"}
                            disabled={disabled || !editNameCustomer}
                            style={{ height: '35px', backgroundColor: editNameCustomer ? 'white' : 'lightgray', color: 'black', width: '95%', paddingLeft: '10px', margin: 0, borderRadius: '5px', marginTop: '5px', border: 'none', borderRadius: "3px", border: `1px solid ${borderColorTwo(theme)}` }}
                        />
                        {showCustomerSelectorDropdown && (
                            <ul style={{ position: 'absolute', top: 33, backgroundColor: 'white', color: 'black', width: '89%', minHeight: '200px', maxHeight: '468px', overflowY: 'auto', zIndex: 100, borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black' }}>
                                {customersMatched?.length > 0 ? (
                                    customersMatched.map((customerOpt) => (
                                        <li
                                            key={customerOpt.id}
                                            onMouseDown={() => { setNewCustomerCandidate(customerOpt); }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {customerOpt?.customerName + " / " + customerOpt?.phone}
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ fontWeight: "600" }} >{customersMatched?.length > 0 ? "No matches found" : "Type Name or Phone to search"}</li>
                                )}
                            </ul>
                        )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", }}>

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '64%', }}>
                                <span style={{ fontWeight: "600", marginBottom: '5px' }}>Customer Address</span>
                                <input className="inputStandart" type="text" value={!editNameCustomer ? (customerSelected?.address) : (newCustomerCandidate ? newCustomerCandidate.address + ", " + newCustomerCandidate.addressNumber : "")} disabled={true}
                                    style={{ height: '25px', fontSize: isDesktopView ? '18px' : '15px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                            </div>
                            <div style={{ width: '3%' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '28%' }}>
                                <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Phone</span>
                                <input className="inputStandart" value={!editNameCustomer ? (customerSelected?.phone) : (newCustomerCandidate ? newCustomerCandidate?.phone : "")} disabled={true}
                                    style={{ height: '25px', fontSize: isDesktopView ? '18px' : '15px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                            </div>
                        </div>
                    </div>
                </div>}

                <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '10px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: '8px', }}>
                    <button className="buttomStandart" style={{ fontSize: isDesktopView ? '17px' : '14px', padding: isDesktopView ? '0px 5px' : '0px 3px', visibility: 'hidden' }}
                        onClick={() => { }} disabled={disabled}>New customer</button>

                    {!editTable && !editNameCustomer && <button className="buttomStandart" style={{ fontSize: isDesktopView ? '17px' : '14px', padding: isDesktopView ? '0px 5px' : '0px 3px', marginBottom: '20px', }}
                        onClick={() => { setEditTable(true) }} disabled={disabled}>Change Table/PickUp/Delivery</button>}


                    {editTable && <div style={{ display: 'flex', flexDirection: 'row', }}>
                        {!disabled && <button style={{
                            display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                            padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }} onClick={() => { setNewTableCandidate(tableNumberOrDeliveryOrPickup); setEditTable(false); }} >
                            <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                        </button>}

                        <button style={{
                            display: 'flex', borderRadius: '50%', backgroundColor: disabled ? 'lightgray' : greenOne(theme), marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                            padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                        }} onClick={() => { saveChangeTable(); }} >
                            {!disabled && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                            {disabled && <Spinner animation="border" role="status" variant="light" style={{ width: '18px', height: '18px', margin: '0', padding: 0 }} />}
                        </button>
                    </div>}
                </div>

                {!editTable && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: '10px', alignItems: 'center' }}>
                    <span style={{ fontWeight: "600", fontSize: isDesktopView ? '32px' : '26px', color: greenTwo(theme), }}>
                        {tableNumberOrDeliveryOrPickup === 'delivery' ? 'Delivery' : (tableNumberOrDeliveryOrPickup === 'pickup' ? 'Pickup' : `Table ${tableNumberOrDeliveryOrPickup}`)} </span>
                </div>}

                {editTable && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginBottom: '10px', alignItems: 'center' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', }}>
                        <select className="inputStandart" value={!isNaN(Number(newTableCandidate)) ? newTableCandidate : ""} placeholder="Table" onChange={(e) => setNewTableCandidate(Number(e.target.value))}
                            style={{
                                minWidth: '60px', maxWidth: '120px', height: '35px', padding: '5px', borderRadius: '6px', fontSize: isDesktopView ? '17px' : '14px', textAlign: 'center', border: `1px solid ${borderColorOne(theme)}`,
                                backgroundColor: (!isNaN(Number(newTableCandidate)) && newTableCandidate) ? greenOne(theme) : '', appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
                            }} >
                            <option value="" disabled hidden> Table </option>
                            {Array.from({ length: companyOperation?.numberOfTables || 0 }, (_, i) => {
                                const tableNumber = i + 1; // tables start from 1
                                const disableOpt = companyOperation?.orders.some(order => Number(order.tableNumberOrDeliveryOrPickup) === Number(tableNumber));
                                return (
                                    <option key={tableNumber} value={tableNumber} disabled={disableOpt} style={{ backgroundColor: disableOpt ? 'black' : undefined, color: disableOpt ? 'rgba(255, 255, 255, 0.35)' : undefined }}> {tableNumber} </option>
                                );
                            })}
                        </select>

                        <button className="buttomStandart" style={{
                            fontSize: isDesktopView ? '17px' : '14px', height: '35px', marginLeft: '2px', padding: isDesktopView ? '0px 10px' : '0px 6px',
                            backgroundColor: newTableCandidate === 'pickup' ? greenOne(theme) : ''
                        }}
                            onClick={() => { setNewTableCandidate('pickup'); }} disabled={disabled}>PickUp</button>
                        <button className="buttomStandart" style={{
                            fontSize: isDesktopView ? '17px' : '14px', height: '35px', marginLeft: '2px', padding: isDesktopView ? '0px 10px' : '0px 6px',
                            backgroundColor: newTableCandidate === 'delivery' ? greenOne(theme) : ''
                        }}
                            onClick={() => { setNewTableCandidate('delivery'); }} disabled={disabled}>Delivery</button>
                    </div>
                </div>}

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flex: 1, width: "100%", }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', fontSize: isDesktopView ? '17px' : '14px', }}>
                            <button className="buttomStandart" style={{ marginLeft: '0px', visibility: 'hidden' }} onClick={() => close()} disabled={disabled}>Done</button>

                            {!editNameCustomer && !editTable &&<button className="buttomStandart" style={{ marginLeft: '0px' }} onClick={() => close()} disabled={disabled}>Done</button>}

                            {/* <button className="buttomStandart green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isDesktopView ? '17px' : '14px', }}
                                onClick={() => close} disabled={disabled}>
                                {disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', margin: '0 0px', }} /> : 'Save'}</button> */}
                        </div>
                    </div>
                </div>
            </div>

            {showNewCustomerModal && <div className="myModal" style={{ zIndex: 100000 }} >
                <NewCustomerModal close={() => setShowNewCustomerModal(false)} companyOperationID={companyOperation?.companyOperationID} fetchCustomers={(e) => fetchCustomers(e)} />
            </div>}

            {showCancelOrderModal && <div className="myModal" style={{}} >
                <CancelOrder close={() => setShowCancelOrderModal(false)} companyOperationID={companyOperation?.companyOperationID} selectedOrderToCancel={orderToEdit} getShiftOperationData={() => getShiftOperationData()} />
            </div>}
        </>
    );
}