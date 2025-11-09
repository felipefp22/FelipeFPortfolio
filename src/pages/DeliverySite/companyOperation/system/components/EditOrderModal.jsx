import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./auxComponents/SelectItemsModal";
import ChangeTableOrCustomerModal from "./auxComponents/ChangeTableOrCustomerModal";
import { blueOne, borderColorTwo, greenOne, greenTwo, transparentCanvasBgOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { getAllProductsCategories } from "../../../../../services/deliveryServices/ProductsCategoryService";
import { Spinner, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { addItemsToOrderService, editOrderService, reopenOrder } from '../../../../../services/deliveryServices/OrderService';
import CloseOrFinishOrderModal from './auxComponents/CloseOrFinishOrderModal';



export default function EditOrderModal({ close, companyOperation, orderToEdit, setOrderToEdit, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [disabled, setDisabled] = useState(false);

    const [showChangeTableOrCustomerModal, setShowChangeTableOrCustomerModal] = useState(false);
    const newCustomerModalRef = useRef(null);
    const [showSelectItemsModal, setShowSelectItemsModal] = useState(false);
    const selectItemsModalRef = useRef(null);
    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const [showCloseOrFinishOrderModal, setShowCloseOrFinishOrderModal] = useState(false);

    const [allCompanyProductsCategories, setAllCompanyProductsCategories] = useState([]);

    const [selectUseCustomerOrPickUpName, setSelectUseCustomerOrPickUpName] = useState(orderToEdit?.customer ? 'Customer' : 'Name');

    const [tableNumberOrDeliveryOrPickup, setTableNumberOrDeliveryOrPickup] = useState(null);
    const [productsAlreadyOnOrder, setProductsAlreadyOnOrder] = useState([]);
    const [customerSelected, setCustomerSelected] = useState(null);
    const [pickupName, setPickupName] = useState(null);

    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState([]);


    async function insertOrderToEditToLocalVars() {
        if (!orderToEdit) return;

        console.log("🔥 orderToEdit: ", orderToEdit);

        setSelectUseCustomerOrPickUpName(orderToEdit?.customer ? 'Customer' : 'Name');
        setTableNumberOrDeliveryOrPickup(orderToEdit?.tableNumberOrDeliveryOrPickup);
        setProductsAlreadyOnOrder(orderToEdit?.orderItems);
        setCustomerSelected(orderToEdit?.customer);
        setPickupName(orderToEdit?.pickupName);
    }

    useEffect(() => {
        insertOrderToEditToLocalVars();
    }, [orderToEdit]);

    useEffect(() => {
        const orderUpdated = companyOperation?.orders.find(order => order.id === orderToEdit?.id);
        if (orderUpdated) setOrderToEdit(orderUpdated);

    }, [companyOperation]);

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

    async function handleAddItemsToOrder() {
        if (selectedProductsToAdd.length === 0) return;
        console.log("selectedToADD: ", selectedProductsToAdd);
        setDisabled(true);
        const aggregated = Array.from(
            selectedProductsToAdd.reduce((map, item) => {
                if (map.has(item.id)) {
                    map.set(item.id, map.get(item.id) + 1); // count repetitions
                } else {
                    map.set(item.id, 1);
                }
                return map;
            }, new Map())
        ).map(([id, quantity]) => ({ productID: id, quantity }));

        console.log("Aggregated products to add:", aggregated);

        const response = await addItemsToOrderService(companyOperation?.companyOperationID, orderToEdit.id, aggregated);

        if (response?.status === 200) {
            await getShiftOperationData();
            setSelectedProductsToAdd([]);
        }

        setDisabled(false);
    }

    async function removeProductToAdd(productID) {
        const index = selectedProductsToAdd.findIndex(p => p.id === productID);

        if (index !== -1) {
            const newSelectedProducts = [...selectedProductsToAdd];
            newSelectedProducts.splice(index, 1); // remove only the first occurrence
            setSelectedProductsToAdd(newSelectedProducts);
        }
    }

    async function openOrderAgain() {
        setDisabled(true);
        const response = await reopenOrder(companyOperation?.companyOperationID, orderToEdit.id);
        if (response?.status === 200) {
            await getShiftOperationData();
        } else {
            alert(`Error reopening order: ${response?.data}`);
        }
        setDisabled(false);
    }

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "99%" : "97%", maxHeight: !isPcV ? '97%' : '97%', padding: !isPcV ? '10px' : '10px', }}>

                <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center', width: '100%', }}>
                    <div className='flexColumn' style={{ textAlign: 'left', justifyContent: 'space-between', }}>
                        <span style={{ fontWeight: "600", fontSize: isPcV ? '18px' : '16px', }}>{`Order [ ${orderToEdit?.orderNumberOnShift} ]`}</span>
                        <span style={{ fontWeight: "600", fontSize: isPcV ? '16px' : '14px', color: greenTwo(theme) }}>
                            {orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' ? 'Delivery' : (orderToEdit?.tableNumberOrDeliveryOrPickup === 'pickup' ? 'Pickup' : `Table - ${orderToEdit?.tableNumberOrDeliveryOrPickup}`)}</span>
                    </div>

                    <button className='buttonStandart green' style={{ fontSize: isPcV ? '17px' : '14px', padding: isPcV ? '0px 5px' : '0px 3px' }}
                        onClick={() => { setShowChangeTableOrCustomerModal(true) }} disabled={disabled}>Change Table/Customer</button>
                </div>

                {selectUseCustomerOrPickUpName === 'Name' && <div className='flexColumn' style={{ width: '100%', }}>
                    <span style={{ fontWeight: "600", fontSize: isPcV ? '18px' : '16px', }}>Name:</span>

                    <input className='inputStandart' type="text" value={pickupName} disabled={true}
                        style={{ height: '35px', fontSize: isPcV ? '17px' : '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', overflowX: 'auto', margin: '3px 0px', }} />
                </div>}

                {selectUseCustomerOrPickUpName === 'Customer' && <div className='flexColumn' style={{ width: '100%', }}>
                    <span style={{ fontWeight: "600", fontSize: isPcV ? '18px' : '16px', }}>Customer:</span>

                    <input className='inputStandart' type="text" value={customerSelected?.customerName + " / " + customerSelected?.phone} disabled={true}
                        style={{ fontSize: isPcV ? '17px' : '14px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', overflowX: 'auto', margin: '3px 0px', }} />
                </div>}

                {selectUseCustomerOrPickUpName === 'Customer' && <div>

                    {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", }}>

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '64%', }}>
                                <span style={{ fontWeight: "600", marginBottom: '5px' }}>Customer Address</span>
                                <input className='inputStandart' type="text" value={customerSelectedToNewOrder ? customerSelectedToNewOrder.address + ", " + customerSelectedToNewOrder.addressNumber : ""} disabled={true}
                                    style={{ height: '25px', fontSize: isPcV ? '15px' : '12px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                            </div>
                            <div style={{ width: '3%' }}></div>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '28%' }}>
                                <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Phone</span>
                                <input className='inputStandart' value={customerSelectedToNewOrder ? customerSelectedToNewOrder?.phone : ""} disabled={true}
                                    style={{ height: '25px', fontSize: isPcV ? '15px' : '12px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, overflowX: 'auto', }} />
                            </div>
                        </div>
                    </div> */}
                </div>}

                <div style={{ width: '100%', borderTop: '1px solid lightgray', margin: '5px 0' }} />

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', flex: 1, }}>

                    <div className='flexColumn' style={{ marginTop: '5px' }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%' }}>
                            <button className='buttonStandart' style={{ marginLeft: '0px', height: '30px', fontSize: isPcV ? '17px' : '14px', }} onClick={() => setShowSelectItemsModal(true)} disabled={disabled}>ADD Items</button>
                        </div>

                        <div style={{ backgroundColor: "white", color: "black", marginTop: '5px', borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead>
                                    <tr>
                                        <th th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Item</th>
                                        <th th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Price</th>
                                        <th th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}><FontAwesomeIcon icon={faTrash} /></th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {selectedProductsToAdd?.map((product, index) => (
                                        <tr key={index}>
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{product.name}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{product.price}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeProductToAdd(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', borderTop: '1px solid lightgray', margin: '5px 0', marginTop: '7px' }} />

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', }}>
                    <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center', width: '100%' }}>
                        <span style={{ fontWeight: "bold", color: borderColorTwo(theme), fontSize: isPcV ? '24px' : '18px' }}>Itens Already On Order</span>

                        <button className='floatingButton' style={{ backgroundColor: 'rgba(22, 111, 163, 1)', marginRight: '5px', visibility: selectedProductsToAdd.length > 0 ? 'visible' : 'hidden' }} onClick={() => handleAddItemsToOrder()} >
                            <FontAwesomeIcon icon={faArrowDown} flip="horizontal" />
                        </button>
                    </div>

                    <div style={{ backgroundColor: "white", color: "black", marginTop: 5, borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <Table responsive="sm" >
                            <thead>
                                <tr>
                                    <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Item</th>
                                    <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Price</th>
                                    <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}><FontAwesomeIcon icon={faTrash} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {productsAlreadyOnOrder?.flatMap((product, index) =>
                                    Array.from({ length: product.quantity }).map((_, i) => (
                                        <tr key={`${index}-${i}`}>
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{product.name}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{product.price}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => removeProductToAdd(product.id)}>
                                                <FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '15px' }}>
                    <button className='buttonStandart' onClick={() => close()} disabled={disabled}>{disabled ?
                        <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', }} /> : 'Done'}</button>

                    <div className='flexRow fullCenter' >
                        {(orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') &&
                            <button className='buttonStandart green' style={{ marginRight: 5 }} onClick={() => { openOrderAgain() }} disabled={disabled}>{'Reopen'}</button>}

                        {(orderToEdit?.status === 'OPEN' || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') &&
                            <button className='buttonStandart green' onClick={() => setShowCloseOrFinishOrderModal(true)} disabled={disabled}>{orderToEdit?.status === 'OPEN' ? 'Close Order' : 'Finish Order'}</button>}
                    </div>
                </div>
            </div>

            {showChangeTableOrCustomerModal && <div className='myModal' >
                <ChangeTableOrCustomerModal close={() => setShowChangeTableOrCustomerModal(false)} closeFromCancel={() => close()} tableNumberOrDeliveryOrPickup={tableNumberOrDeliveryOrPickup}
                    orderToEdit={orderToEdit} pickupName={pickupName} customerSelected={customerSelected}
                    companyOperation={companyOperation} getShiftOperationData={() => getShiftOperationData()} />
            </div>}

            {showSelectItemsModal && <div ref={selectItemsModalRef} className='myModal' >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories} selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} />
            </div>}

            {showCloseOrFinishOrderModal && <div className='myModal' >
                <CloseOrFinishOrderModal close={() => setShowCloseOrFinishOrderModal(false)} closeAll={() => close()} orderToEdit={orderToEdit} companyOperation={companyOperation} getShiftOperationData={() => getShiftOperationData()} />
            </div>}
        </>
    );
}