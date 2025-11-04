import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./SelectItemsModal";
import ChangeTableOrCustomerModal from "./auxComponents/ChangeTableOrCustomerModal";
import { blueOne, borderColorTwo } from "../../../../../theme/Colors";
import { getAllProductsCategories } from "../../../../../services/deliveryServices/ProductsCategoryService";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";



export default function EditOrderModal({ close, companyOperation, orderToEdit }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disabled, setDisabled] = useState(false);

    const [showChangeTableOrCustomerModal, setShowChangeTableOrCustomerModal] = useState(false);
    const newCustomerModalRef = useRef(null);
    const [showSelectItemsModal, setShowSelectItemsModal] = useState(false);
    const selectItemsModalRef = useRef(null);
    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const customerSelectorDropdownRef = useRef(null);

    const [allCompanyProductsCategories, setAllCompanyProductsCategories] = useState([]);

    const [selectUseCustomerOrPickUpName, setSelectUseCustomerOrPickUpName] = useState(orderToEdit?.customer ? 'Customer' : 'Name');

    const [tableNumberOrDeliveryOrPickup, setTableNumberOrDeliveryOrPickupSelected] = useState(null);
    const [productsAlreadyOnOrder, setProductsAlreadyOnOrder] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(null);
    const [pickupNameInput, setPickupNameInput] = useState("");

    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState([]);



    async function insertOrderToEditToLocalVars() {
        if (!orderToEdit) return;

        setTableNumberOrDeliveryOrPickupSelected(orderToEdit?.tableNumberOrDeliveryOrPickup);
        setProductsAlreadyOnOrder(orderToEdit?.orderItems);
        setCustomerSelected(orderToEdit?.customer);
        setPickupNameInput(orderToEdit?.pickupName);
    }

    useEffect(() => {
        insertOrderToEditToLocalVars();
    }, [orderToEdit]);

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
    }, []);


    return (
        <>
            <div className="modalInside" style={{ width: !isDesktopView ? "99%" : "97%", maxHeight: !isDesktopView ? '97%' : '97%', padding: !isDesktopView ? '10px' : '10px', }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%",  }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '0px' }}>
                        <span style={{ fontWeight: "600", padding: '2px 0px', }}>{`Table - ${orderToEdit?.tableNumberOrDeliveryOrPickup}`}</span>


                        <button className="buttomDarkBlue" style={{ fontSize: isDesktopView ? '14px' : '12px', height: '32px', padding: isDesktopView ? '0px 5px' : '0px 2px',marginBottom: '0px' }}
                            onClick={() => { setShowChangeTableOrCustomerModal(true) }} disabled={disabled}>Change Table/Customer</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'flex-start', alignContent: 'flex-start', textAlign: 'flex-start', }}>
                    {selectUseCustomerOrPickUpName === 'Name' && <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', }}>
                        <span style={{ fontWeight: "600", padding: '0px 0px', }}>Name:</span>

                        <input className="inputOne" type="text" value={pickupNameInput} disabled={true}
                            style={{ height: '35px', fontSize: isDesktopView ? '18px' : '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', overflowX: 'auto', margin: '3px 0px', }} />

                    </div>}

                    {selectUseCustomerOrPickUpName === 'Customer' && <div style={{ display: 'flex', flexDirection: 'column', position: 'relative', width: '100%', }}>
                        <span style={{ fontWeight: "600", padding: '0px 0px', }}>Customer:</span>

                        <input className="inputOne" type="text" value={customerSelected?.customerName + " / " + customerSelected?.phone} disabled={true}
                            style={{ height: '35px', fontSize: isDesktopView ? '18px' : '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', overflowX: 'auto', margin: '3px 0px', }} />
                    </div>}
                </div>

                {selectUseCustomerOrPickUpName === 'Customer' && <div>

                    {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", }}>

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
                    </div> */}
                </div>}

                <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '5px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '3px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', marginTop: '5px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: '5px' }}>
                            <button className="buttomDarkGray" style={{ marginLeft: '0px', height: '28px', }} onClick={() => setShowSelectItemsModal(true)} disabled={disabled}>ADD Items</button>
                        </div>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead>
                                    <tr>
                                        <th style={{ width: "100%" }}>Item</th>
                                        <th style={{ width: "40px" }}>Price</th>
                                        <th style={{ width: "40px" }}><FontAwesomeIcon icon={faTrash} /></th>
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

                <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '5px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '3px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', marginTop: '0px' }}>
                        <span style={{ fontWeight: "bold", marginBottom: '5px', color: blueOne(theme) }}>Itens Already On Order</span>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead>
                                    <tr>
                                        <th style={{ width: "100%" }}>Item</th>
                                        <th style={{ width: "40px" }}>Price</th>
                                        <th style={{ width: "40px" }}><FontAwesomeIcon icon={faTrash} /></th>
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
                <span style={{ color: blueOne(theme), fontWeight: 'bold', fontSize: "20px", textAlign: 'center' }}>{`*** Still on Development ***`}</span>


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
                <ChangeTableOrCustomerModal close={() => setShowChangeTableOrCustomerModal(false)} companyOperation={companyOperation} pickupNameInput={pickupNameInput} setPickupNameInput={setPickupNameInput} customerSelected={customerSelected} setCustomerSelected={setCustomerSelected} />
            </div>}

            {showSelectItemsModal && <div ref={selectItemsModalRef} className="myModal" style={{ zIndex: 1000 }} >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories} selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} />
            </div>}

        </>
    );
}