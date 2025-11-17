import { faPen, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useRef, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./auxComponents/SelectItemsModal";
import { getAllCompanyCustomers } from "../../../../../services/deliveryServices/CustomerSevice";
import { getAllProductsCategories } from "../../../../../services/deliveryServices/ProductsCategoryService";
import { createOrder } from "../../../../../services/deliveryServices/OrderService";
import { useSelector } from "react-redux";
import { blueOne, borderColorOne, borderColorTwo, greenOne, greenTwo, orangeOne, redOne } from "../../../../../theme/Colors";
import { calculateEstimatedKm, calculatePrice } from '../../../../../redux/calculateDeliveryDistancePrice';

export default function NewOrderModal({ close, companyOperation, getShiftOperationData, tableNumberSelectedBeforeModal, isTableAvailable }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [disabled, setDisabled] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const newCustomerModalRef = useRef(null);

    const [showSelectItemsModal, setShowSelectItemsModal] = useState(false);
    const selectItemsModalRef = useRef(null);

    const [selectUseCustomerOrPickUpName, setSelectUseCustomerOrPickUpName] = useState(tableNumberSelectedBeforeModal === 'delivery' ? 'Customer' : 'Name');
    const [pickupNameInput, setPickupNameInput] = useState("");
    const [customerSelectedToNewOrder, setCustomerSelectedToNewOrder] = useState(null);

    const [allCompanyCustomers, setAllCompanyCustomers] = useState([]);
    const [customerInputToSearch, setCustomerInputToSearch] = useState("");
    const [customersMatched, setCustomersMatched] = useState([]);

    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const customerSelectorDropdownRef = useRef(null);

    const [allCompanyProductsCategories, setAllCompanyProductsCategories] = useState([]);
    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState([]);
    const [selectedCustomItemsToAdd, setSelectedCustomItemsToAdd] = useState([]);


    const [tableNumberOrDeliveryOrPickupSelected, setTableNumberOrDeliveryOrPickupSelected] = useState(tableNumberSelectedBeforeModal ?? "");


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

    async function fetchProductsCategories() {
        try {
            const response = await getAllProductsCategories(companyOperation?.companyOperationID);
            if (response?.status === 200) {
                setAllCompanyProductsCategories(response?.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProductsCategories();
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

    async function saveOrder() {
        if (!tableNumberOrDeliveryOrPickupSelected) {
            alert("TableNumber/Delivery/Pickup option required");
            return;
        }

        if (tableNumberOrDeliveryOrPickupSelected === 'delivery') {
            if (!customerSelectedToNewOrder) {
                alert("Customer required to DELIVERY order");
                return;
            }
            if (getCustomerEstimatedKm().km >= companyOperation?.maxDeliveryDistanceKM) {
                alert(`Can't Order to this customer, distance exceeds maximum(${companyOperation?.maxDeliveryDistanceKM}) delivery distance.`);
                return;
            }
        }

        if (tableNumberOrDeliveryOrPickupSelected === 'pickup' && !customerSelectedToNewOrder && !pickupNameInput) {
            alert("PickUp Name or Customer required to PICKUP order");
            return;
        }

        if (selectedProductsToAdd.length === 0 && selectedCustomItemsToAdd.length === 0) {
            alert("At least one item is required");
            return;
        }

        setDisabled(true);

        const itemsIdAndQuantity = Object.values(
            selectedProductsToAdd.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = { productID: item.id, quantity: 0, productName: item.name };
                }
                acc[item.id].quantity += item.quantity ?? 1; // add quantity if exists, otherwise +1
                return acc;
            }, {})
        );
        const customItemsIdAndQuantity = Object.values(
            selectedCustomItemsToAdd.reduce((acc, item) => {
                // key that ignores order of IDs
                const sortedKey = item.ids.slice().sort().join("|");

                if (!acc[sortedKey]) {
                    acc[sortedKey] = {
                        productID: item.ids,                // original ids array
                        quantity: 0,
                        name: item.name               // optional
                    };
                }

                acc[sortedKey].quantity += item.quantity ?? 1;
                return acc;
            }, {})
        );

        const response = await createOrder(
            companyOperation?.companyOperationID,
            tableNumberOrDeliveryOrPickupSelected,
            customerSelectedToNewOrder?.id,
            pickupNameInput ? pickupNameInput : customerSelectedToNewOrder?.customerName,
            itemsIdAndQuantity,
            customItemsIdAndQuantity,
            " ",
            getCustomerEstimatedKm().km
        );

        if (response?.status === 200) {
            await getShiftOperationData();
            close();
        } else {
            alert("Error creating order, try again later");
        }

        setDisabled(false);
    }

    async function removeProduct(productID) {
        const index = selectedProductsToAdd.findIndex(p => p.id === productID);

        if (index !== -1) {
            const newSelectedProducts = [...selectedProductsToAdd];
            newSelectedProducts.splice(index, 1); // remove only the first occurrence
            setSelectedProductsToAdd(newSelectedProducts);
        }
    }

    async function removeCustomItems(idsToRemove) {
        console.log("idsToRemove: ", idsToRemove);
        const index = selectedCustomItemsToAdd.findIndex(item =>
            arraysEqualIgnoreOrder(item.ids, idsToRemove)
        );

        if (index !== -1) {
            const newList = [...selectedCustomItemsToAdd];
            newList.splice(index, 1); // remove just ONE
            setSelectedCustomItemsToAdd(newList);
        }
    }

    function arraysEqualIgnoreOrder(a, b) {
        if (a.length !== b.length) return false;
        const setA = new Set(a);
        const setB = new Set(b);

        if (setA.size !== setB.size) return false;

        for (let val of setA) {
            if (!setB.has(val)) return false;
        }

        return true;
    }


    // useEffect(() => {
    //     console.log('companyop: ', companyOperation);
    // }, [companyOperation]);
    // useEffect(() => {
    //     console.log("tableNumberSelectedBeforeModal: ", tableNumberSelectedBeforeModal);
    // }, [tableNumberSelectedBeforeModal]);
    // useEffect(() => {
    //     console.log("tableNumberOrDeliveryOrPickupSelected: ", tableNumberOrDeliveryOrPickupSelected);
    // }, [tableNumberOrDeliveryOrPickupSelected]);

    function getCustomerEstimatedKm() {
        const distance = calculateEstimatedKm(customerSelectedToNewOrder?.lat, customerSelectedToNewOrder?.lng, companyOperation?.companyLat, companyOperation?.companyLng);
        const price = calculatePrice(distance, companyOperation);

        return { km: distance, price: price };
    }

    useEffect(() => {
        console.log("selectedCustomItemsToAdd------------: ", selectedCustomItemsToAdd);
    }, [selectedCustomItemsToAdd]);

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "97%", maxHeight: !isPcV ? '90%' : '80%', padding: !isPcV ? '10px' : '10px', }}>

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", }}>
                    <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '10px', alignItems: 'center' }}>
                        <button className='buttonStandart' style={{ height: '35px', fontSize: isPcV ? '17px' : '14px', padding: isPcV ? '0px 10px' : '0px 6px', }}
                            onClick={() => setShowNewCustomerModal(true)} disabled={disabled}>New customer</button>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', }}>
                            <select className={`buttonStandart ${((!isNaN(Number(tableNumberOrDeliveryOrPickupSelected)) && tableNumberOrDeliveryOrPickupSelected) && 'green')}`}
                                value={!isNaN(Number(tableNumberOrDeliveryOrPickupSelected)) ? tableNumberOrDeliveryOrPickupSelected : ""} placeholder="Table" onChange={(e) => setTableNumberOrDeliveryOrPickupSelected(Number(e.target.value))}
                                style={{ height: '35px', padding: '5px', borderRadius: '6px', fontSize: isPcV ? '17px' : '14px', textAlign: 'center', border: `1px solid ${borderColorOne(theme)}`, }} >
                                <option value="" disabled hidden> Table </option>
                                {Array.from({ length: companyOperation?.numberOfTables || 0 }, (_, i) => {
                                    const tableNumber = i + 1; // tables start from 1
                                    const disableOpt = !isTableAvailable(companyOperation?.orders, tableNumber);
                                    return (
                                        <option key={tableNumber} value={tableNumber} disabled={disableOpt} style={{ backgroundColor: disableOpt ? 'black' : undefined, color: disableOpt ? 'rgba(255, 255, 255, 0.35)' : undefined }}> {tableNumber} </option>
                                    );
                                })}
                            </select>

                            <button className={`buttonStandart ${tableNumberOrDeliveryOrPickupSelected === 'pickup' && 'green'}`}
                                style={{ fontSize: isPcV ? '17px' : '14px', height: '35px', marginLeft: '2px', padding: isPcV ? '0px 10px' : '0px 6px', }}
                                onClick={() => { setTableNumberOrDeliveryOrPickupSelected('pickup'); setSelectUseCustomerOrPickUpName(customerSelectedToNewOrder ? 'Customer' : 'Name') }} disabled={disabled}>PickUp</button>

                            <button className={`buttonStandart ${tableNumberOrDeliveryOrPickupSelected === 'delivery' && 'green'}`}
                                style={{ fontSize: isPcV ? '17px' : '14px', height: '35px', marginLeft: '2px', padding: isPcV ? '0px 10px' : '0px 6px', }}
                                onClick={() => { setTableNumberOrDeliveryOrPickupSelected('delivery'); setSelectUseCustomerOrPickUpName('Customer') }} disabled={disabled}>Delivery</button>
                        </div>
                    </div>

                    <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center', marginBottom: 2, marginTop: 2 }} >
                        {tableNumberOrDeliveryOrPickupSelected === 'delivery' && <span style={{ fontWeight: "600" }}>Customer</span>}
                        {tableNumberOrDeliveryOrPickupSelected !== 'delivery' && <select className='inputStandart' value={selectUseCustomerOrPickUpName || ''} placeholder="Table" onChange={(e) => setSelectUseCustomerOrPickUpName(e.target.value)}
                            style={{ minWidth: '30px', maxWidth: '90px', height: '30px', padding: '0px', borderRadius: '6px', fontSize: isPcV ? '17px' : '14px', textAlign: 'left', }} >
                            <option value='' disabled hidden> Select </option>
                            <option value={'Customer'}> {'Customer'} </option>
                            <option value={'Name'}> {'Name'} </option>
                        </select>}

                        {customerSelectedToNewOrder && selectUseCustomerOrPickUpName === 'Customer' && <button className={`buttonStandart`}
                            style={{ fontSize: isPcV ? '17px' : '14px', height: '28px', padding: isPcV ? '0px 10px' : '0px 6px', }}
                            onClick={() => { setShowNewCustomerModal(customerSelectedToNewOrder) }} disabled={disabled}><FontAwesomeIcon icon={faPen} /><span style={{ fontWeight: "600" }}> Edit Customer</span></button>}
                    </div>

                    {selectUseCustomerOrPickUpName === 'Name' && <div>
                        <span style={{ fontWeight: "600", padding: '10px 0px', }}>Name:</span>

                        <input className='inputStandart' type="text" value={pickupNameInput} onChange={(e) => setPickupNameInput(e.target.value)}
                            style={{ height: '35px', fontSize: isPcV ? '18px' : '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', margin: '10px 0px', }} />
                    </div>}

                    {selectUseCustomerOrPickUpName === 'Customer' && <div>
                        <div ref={customerSelectorDropdownRef} style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%' }}>
                            <input
                                type="text"
                                value={showCustomerSelectorDropdown ? customerInputToSearch : (customerSelectedToNewOrder ? customerSelectedToNewOrder?.customerName + " / " + customerSelectedToNewOrder?.phone : "")}
                                onChange={e => setCustomerInputToSearch(e.target.value)}
                                onFocus={() => setShowCustomerSelectorDropdown(true)}
                                onBlur={() => { setCustomerInputToSearch(""); setShowCustomerSelectorDropdown(false); }}
                                placeholder="Search Customer by Name or Phone"
                                disabled={disabled}
                                style={{ height: '35px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', borderRadius: '5px', marginTop: '5px', border: 'none', borderRadius: "3px", border: `1px solid ${borderColorTwo(theme)}` }}
                            />
                            {showCustomerSelectorDropdown && (
                                <ul style={{ position: 'absolute', top: 33, backgroundColor: 'white', color: 'black', width: '89%', minHeight: '100px', maxHeight: '268px', overflowY: 'auto', borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black' }}>
                                    {customersMatched?.length > 0 ? (
                                        customersMatched.map((customerOpt) => (
                                            <li
                                                key={customerOpt.id}
                                                onMouseDown={() => { setCustomerSelectedToNewOrder(customerOpt); }}
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
                        <div className='flexRow' style={{ width: '100%', flexWrap: 'wrap', }}>
                            <div className='flexColumn' style={{ width: '62%', }}>
                                <span style={{ fontWeight: "600" }}>Customer Address</span>
                                <input className='inputStandart' type="text" value={customerSelectedToNewOrder ? customerSelectedToNewOrder.address + ", " + customerSelectedToNewOrder.addressNumber : ""} disabled={true}
                                    style={{ height: '25px', fontSize: isPcV ? '15px' : '12px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', overflowX: 'auto', }} />
                            </div>

                            <div style={{ width: '3%' }}></div>

                            <div className='flexColumn' style={{ width: '35%' }}>
                                <span style={{ fontWeight: "600", whiteSpace: 'nowrap', }}>Phone</span>
                                <input className='inputStandart' value={customerSelectedToNewOrder ? customerSelectedToNewOrder?.phone : ""} disabled={true}
                                    style={{ height: '25px', fontSize: isPcV ? '15px' : '12px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                            </div>
                        </div>

                        {customerSelectedToNewOrder && <div className='flexRow fullCenter' style={{ margin: '3px 0px', }} >
                            <span style={{ fontWeight: "600", }}>Distance:</span>
                            <span style={{ fontWeight: "600", color: blueOne(theme), marginLeft: 5 }}>{getCustomerEstimatedKm().km + " Km"}</span>
                            {getCustomerEstimatedKm().km >= companyOperation?.maxRecommendedDistanceKM && getCustomerEstimatedKm().km < companyOperation?.maxDeliveryDistanceKM && <span style={{ fontWeight: "600", padding: '0px 0px', color: orangeOne(theme), marginLeft: 2 }}>
                                {'⚠️Above Ideal '}</span>}
                            {getCustomerEstimatedKm().km >= companyOperation?.maxDeliveryDistanceKM && <span style={{ fontWeight: "600", padding: '0px 0px', color: blueOne(theme), marginLeft: 2 }}>
                                {'🚫'}</span>}
                            {getCustomerEstimatedKm().km < companyOperation?.maxDeliveryDistanceKM && <span style={{ fontWeight: "600", color: greenTwo(theme), marginLeft: 5 }}>{'$' + getCustomerEstimatedKm().price}</span>}

                            <span style={{ fontWeight: "600", padding: '0px 8px', }}>{'|'}</span>

                            <span style={{ fontWeight: "600", }}> Max: </span>
                            <span style={{ fontWeight: "600", color: redOne(theme), marginLeft: 5 }}>{companyOperation?.maxDeliveryDistanceKM + 'Km'}</span>
                        </div>}
                    </div>}
                </div>

                <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '5px 0' }} />

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', marginTop: '5px', }}>
                    <div className='flexColumn' style={{ flexWrap: 'wrap', }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', }}>
                            <button className='buttonStandart' style={{ marginLeft: '0px', height: '30px', fontSize: isPcV ? '17px' : '14px', }} onClick={() => setShowSelectItemsModal(true)} disabled={disabled}>ADD Items</button>
                        </div>
                        <span style={{ fontWeight: "bold", marginBottom: '5px' }}>Items</span>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead >
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Item</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Price</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}><FontAwesomeIcon icon={faTrash} /></th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {selectedCustomItemsToAdd?.map((custom, index) => (
                                        <tr key={index}>
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{custom?.name}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{custom?.price?.toFixed(2)}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeCustomItems(custom.ids) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                        </tr>
                                    ))}
                                    {selectedProductsToAdd.map((product, index) => (
                                        <tr key={index}>
                                            <td>{product.name}</td>
                                            <td>{product.price}</td>
                                            <td onClick={() => { removeProduct(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>


                <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '15px' }}>
                    <button className='buttonStandart' style={{}} onClick={() => close()} disabled={disabled}>Cancel</button>

                    <button className='buttonStandart green' style={{}}
                        onClick={() => saveOrder()} disabled={disabled}>{disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', }} /> : 'Save Order'}</button>
                </div>
            </div >

            {showNewCustomerModal && <div ref={newCustomerModalRef} className='myModal' >
                <NewCustomerModal close={() => setShowNewCustomerModal(false)} companyOperation={companyOperation} customerToEdit={showNewCustomerModal} fetchCustomers={(e) => fetchCustomers(e)} />
            </div>
            }

            {showSelectItemsModal && <div ref={selectItemsModalRef} className='myModal' >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories}
                    selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} selectedCustomItemsToAdd={selectedCustomItemsToAdd} setSelectedCustomItemsToAdd={setSelectedCustomItemsToAdd} />
            </div>}
        </>
    );
}