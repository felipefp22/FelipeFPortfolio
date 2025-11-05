import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useRef, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./SelectItemsModal";
import { getAllCompanyCustomers } from "../../../../../services/deliveryServices/CustomerSevice";
import { getAllProductsCategories } from "../../../../../services/deliveryServices/ProductsCategoryService";
import { createOrder } from "../../../../../services/deliveryServices/OrderService";
import { useSelector } from "react-redux";
import { borderColorOne, borderColorTwo, greenOne } from "../../../../../theme/Colors";

export default function NewOrderModal({ close, companyOperation, getShiftOperationData, tableNumberSelectedBeforeModal }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

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
        setDisabled(true);

        if (!tableNumberOrDeliveryOrPickupSelected) {
            alert("TableNumber/Delivery/Pickup option required");
            setDisabled(false);
            return;
        }

        if (tableNumberOrDeliveryOrPickupSelected === 'delivery' && !customerSelectedToNewOrder) {
            alert("Customer required to DELIVERY order");
            setDisabled(false);
            return;
        }
        if (tableNumberOrDeliveryOrPickupSelected === 'pickup' && !customerSelectedToNewOrder && !pickupNameInput) {
            alert("PickUp Name or Customer required to PICKUP order");
            setDisabled(false);
            return;
        }

        if (selectedProductsToAdd.length === 0) {
            alert("At least one item is required");
            setDisabled(false);
            return;
        }

        const itemsIdAndQuantity = Object.values(
            selectedProductsToAdd.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = { productID: item.id, quantity: 0, productName: item.name };
                }
                acc[item.id].quantity += item.quantity ?? 1; // add quantity if exists, otherwise +1
                return acc;
            }, {})
        );

        const response = await createOrder(
            companyOperation?.companyOperationID,
            tableNumberOrDeliveryOrPickupSelected,
            customerSelectedToNewOrder?.id,
            pickupNameInput ? pickupNameInput : customerSelectedToNewOrder?.customerName,
            itemsIdAndQuantity,
            " "
        );

        if (response?.status === 200) {
            await getShiftOperationData();
            setDisabled(false);
            close();
        }
    }

    async function removeProduct(productID) {
        const index = selectedProductsToAdd.findIndex(p => p.id === productID);

        if (index !== -1) {
            const newSelectedProducts = [...selectedProductsToAdd];
            newSelectedProducts.splice(index, 1); // remove only the first occurrence
            setSelectedProductsToAdd(newSelectedProducts);
        }
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

    return (
        <>
            <div className="modalInside" style={{ width: !isDesktopView ? "100%" : "97%", maxHeight: !isDesktopView ? '90%' : '80%', padding: !isDesktopView ? '10px' : '10px', }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: '10px', alignItems: 'center' }}>
                        <button className="buttomDarkGray" style={{ height: '35px', fontSize: isDesktopView ? '17px' : '14px', padding: isDesktopView ? '0px 10px' : '0px 6px', }}
                            onClick={() => setShowNewCustomerModal(true)} disabled={disabled}>New customer</button>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', }}>
                            <select className="inputOne" value={!isNaN(Number(tableNumberOrDeliveryOrPickupSelected)) ? tableNumberOrDeliveryOrPickupSelected : ""} placeholder="Table" onChange={(e) => setTableNumberOrDeliveryOrPickupSelected(Number(e.target.value))}
                                style={{
                                    minWidth: '60px', maxWidth: '120px', height: '35px', padding: '5px', borderRadius: '6px', fontSize: isDesktopView ? '17px' : '14px', textAlign: 'center', border: `1px solid ${borderColorOne(theme)}`,
                                    backgroundColor: (!isNaN(Number(tableNumberOrDeliveryOrPickupSelected)) && tableNumberOrDeliveryOrPickupSelected) ? greenOne(theme) : ''
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

                            <button className="buttomDarkGray" style={{
                                fontSize: isDesktopView ? '17px' : '14px', height: '35px', marginLeft: '2px', padding: isDesktopView ? '0px 10px' : '0px 6px',
                                backgroundColor: tableNumberOrDeliveryOrPickupSelected === 'pickup' ? greenOne(theme) : ''
                            }}
                                onClick={() => { setTableNumberOrDeliveryOrPickupSelected('pickup'); setSelectUseCustomerOrPickUpName(customerSelectedToNewOrder ? 'Customer' : 'Name') }} disabled={disabled}>PickUp</button>
                            <button className="buttomDarkGray" style={{
                                fontSize: isDesktopView ? '17px' : '14px', height: '35px', marginLeft: '2px', padding: isDesktopView ? '0px 10px' : '0px 6px',
                                backgroundColor: tableNumberOrDeliveryOrPickupSelected === 'delivery' ? greenOne(theme) : ''
                            }}
                                onClick={() => { setTableNumberOrDeliveryOrPickupSelected('delivery'); setSelectUseCustomerOrPickUpName('Customer') }} disabled={disabled}>Delivery</button>
                        </div>
                    </div>

                    <div style={{ marginBottom: '5px' }}>
                        {tableNumberOrDeliveryOrPickupSelected === 'delivery' && <span style={{ fontWeight: "600" }}>Customer</span>}
                        {tableNumberOrDeliveryOrPickupSelected !== 'delivery' && <select className="inputOne" value={selectUseCustomerOrPickUpName || ''} placeholder="Table" onChange={(e) => setSelectUseCustomerOrPickUpName(e.target.value)}
                            style={{ minWidth: '30px', maxWidth: '90px', height: '30px', padding: '0px', borderRadius: '6px', fontSize: isDesktopView ? '17px' : '14px', textAlign: 'left', }} >
                            <option value='' disabled hidden> Select </option>
                            <option value={'Customer'}> {'Customer'} </option>
                            <option value={'Name'}> {'Name'} </option>
                        </select>}
                    </div>

                    {selectUseCustomerOrPickUpName === 'Name' && <div>
                        <span style={{ fontWeight: "600", padding: '10px 0px', }}>Name:</span>

                        <input className="inputOne" type="text" value={pickupNameInput} onChange={(e) => setPickupNameInput(e.target.value)}
                            style={{ height: '35px', fontSize: isDesktopView ? '18px' : '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', margin: '10px 0px', }} />
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
                                style={{ height: '35px', backgroundColor: 'white', color: 'black', width: '95%', paddingLeft: '10px', margin: 0, borderRadius: '5px', marginTop: '5px', border: 'none', borderRadius: "3px", border: `1px solid ${borderColorTwo(theme)}` }}
                            />
                            {showCustomerSelectorDropdown && (
                                <ul style={{ position: 'absolute', top: 33, backgroundColor: 'white', color: 'black', width: '89%', minHeight: '200px', maxHeight: '468px', overflowY: 'auto', zIndex: 100, borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black' }}>
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
                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", }}>

                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '64%', }}>
                                    <span style={{ fontWeight: "600", marginBottom: '5px' }}>Customer Address</span>
                                    <input className="inputOne" type="text" value={customerSelectedToNewOrder ? customerSelectedToNewOrder.address + ", " + customerSelectedToNewOrder.addressNumber : ""} disabled={true}
                                        style={{ height: '25px', fontSize: isDesktopView ? '15px' : '12px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                                </div>
                                <div style={{ width: '3%' }}></div>
                                <div style={{ display: 'flex', flexDirection: 'column', width: '28%' }}>
                                    <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Phone</span>
                                    <input className="inputOne" value={customerSelectedToNewOrder ? customerSelectedToNewOrder?.phone : ""} disabled={true}
                                        style={{ height: '25px', fontSize: isDesktopView ? '15px' : '12px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>

                <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '5px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '3px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', marginTop: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%',  }}>
                            <button className="buttomDarkGray" style={{ marginLeft: '0px', height: '30px', fontSize: isDesktopView ? '17px' : '14px',  }} onClick={() => setShowSelectItemsModal(true)} disabled={disabled}>ADD Items</button>
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

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginTop: '10px', fontSize: isDesktopView ? '17px' : '14px', }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%',  }}>
                            <button className="buttomDarkGray" style={{ }} onClick={() => close()} disabled={disabled}>Cancel</button>

                            <button className="buttomDarkGreen" style={{  }}
                                onClick={() => saveOrder()} disabled={disabled}>{disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '30px',  }} /> : 'Save Order'}</button>
                        </div>
                    </div>
                </div>

            </div>

            {showNewCustomerModal && <div ref={newCustomerModalRef} className="myModal" style={{ zIndex: 10 }} >
                <NewCustomerModal close={() => setShowNewCustomerModal(false)} companyOperationID={companyOperation?.companyOperationID} fetchCustomers={(e) => fetchCustomers(e)} />
            </div>}

            {showSelectItemsModal && <div ref={selectItemsModalRef} className="myModal" style={{ zIndex: 10 }} >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories} selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} />
            </div>}
        </>
    );
}