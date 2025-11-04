import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./SelectItemsModal";
import ChangeTableOrCustomerModal from "./auxComponents/ChangeTableOrCustomerModal";



export default function EditOrderModal({ close, companyOperation }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disabled, setDisabled] = useState(false);

    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [showChangeTableOrCustomerModal, setShowChangeTableOrCustomerModal] = useState(false);
    const newCustomerModalRef = useRef(null);

    const [showSelectItemsModal, setShowSelectItemsModal] = useState(false);
    const selectItemsModalRef = useRef(null);

    const [selectUseCustomerOrPickUpName, setSelectUseCustomerOrPickUpName] = useState(null);
    const [pickupNameInput, setPickupNameInput] = useState("");
    const [customerSelectedToNewOrder, setCustomerSelectedToNewOrder] = useState(null);

    const [allCompanyCustomers, setAllCompanyCustomers] = useState([]);
    const [customerInputToSearch, setCustomerInputToSearch] = useState("");
    const [customersMatched, setCustomersMatched] = useState([]);

    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const customerSelectorDropdownRef = useRef(null);

    const [allCompanyProductsCategories, setAllCompanyProductsCategories] = useState([]);
    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState([]);

    const [tableNumberOrDeliveryOrPickup, setTableNumberOrDeliveryOrPickupSelected] = useState(null);

    return (
        <>
            <div className="modalInside" style={{ width: !isDesktopView ? "100%" : "97%", maxHeight: !isDesktopView ? '90%' : '80%', padding: !isDesktopView ? '10px' : '10px', }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '10px' }}>
                        <span style={{ fontWeight: "600", padding: '10px 0px', }}>{`Table - ${5}`}</span>


                        <button className="buttomDarkBlue" style={{ fontSize: isDesktopView ? '14px' : '12px', marginLeft: '0px', padding: isDesktopView ? '0px 5px' : '0px 2px', }}
                            onClick={() => { setShowChangeTableOrCustomerModal(true) }} disabled={disabled}>Change Table/Customer</button>
                    </div>
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

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '0px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', margin: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', height: '50px', margin: 0, fontSize: isDesktopView ? '14px' : '12px' }}>
                            {/* <button className="buttomDarkRed" style={{ marginLeft: '0px' }} onClick={() => close()} disabled={disabled}>Cancel Order</button> */}

                            <button className="buttomDarkGray" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}
                                onClick={() => close()} disabled={disabled}>{disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', margin: '0 0px', }} /> : 'Done'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {showChangeTableOrCustomerModal && <div className="myModal" style={{ zIndex: 100 }} >
                <ChangeTableOrCustomerModal close={() => setShowChangeTableOrCustomerModal(false)} companyOperationID={companyOperation?.companyOperationID} fetchCustomers={(e) => fetchCustomers(e)} />
            </div>}

            {showSelectItemsModal && <div ref={selectItemsModalRef} className="myModal" style={{ zIndex: 1000 }} >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories} selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} />
            </div>}
        </>
    );
}