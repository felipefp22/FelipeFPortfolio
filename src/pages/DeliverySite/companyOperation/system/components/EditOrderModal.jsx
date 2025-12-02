import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./auxComponents/SelectItemsModal";
import ChangeTableOrCustomerModal from "./auxComponents/ChangeTableOrCustomerModal";
import { blueOne, borderColorTwo, greenOne, greenTwo, redOne, transparentCanvasBgOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { getAllProductsCategories } from "../../../../../services/deliveryServices/ProductsCategoryService";
import { Spinner, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faTrash } from "@fortawesome/free-solid-svg-icons";
import { addItemsToOrderService, editOrderService, removeItemsFromOrderService, reopenOrder } from '../../../../../services/deliveryServices/OrderService';
import CloseOrFinishOrderModal from './auxComponents/CloseOrFinishOrderModal';
import ChangeOrderStatusModal from './ChangeOrderStatusModal';
import { DeleteItemModal } from './auxComponents/DeleteItemModal';
import Tooltip from '@mui/material/Tooltip';



export default function EditOrderModal({ close, companyOperation, orderToEdit, setOrderToEdit, getShiftOperationData, isTableAvailable }) {
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
    const [selectedCustomItemsToAdd, setSelectedCustomItemsToAdd] = useState([]);

    const [showCancelItemModal, setShowCancelItemModal] = useState(false);

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
        if (selectedProductsToAdd.length === 0 && selectedCustomItemsToAdd.length === 0) return;
        console.log("selectedToADD: ", selectedProductsToAdd);
        setDisabled(true);

        const itemsIds = [
            ...selectedProductsToAdd.map(item => ({ productsIDs: [item.id] })),
            ...selectedCustomItemsToAdd.map(item => ({ productsIDs: item.ids }))
        ];

        console.log("itemsIds:  ", itemsIds);

        const response = await addItemsToOrderService(companyOperation?.companyOperationID, orderToEdit.id, itemsIds);

        if (response?.status === 200) {
            await getShiftOperationData();
            setSelectedProductsToAdd([]);
            setSelectedCustomItemsToAdd([]);
        }

        setDisabled(false);
    }

    async function openOrderAgain() {
        setDisabled(true);
        const response = await reopenOrder(companyOperation?.companyOperationID, [orderToEdit.id]);
        if (response?.status === 200) {
            await getShiftOperationData();
        } else {
            alert(`Error reopening order: ${response?.data}`);
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

    async function removeCustomItems(idsToRemove) {
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

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "99%" : "97%", maxHeight: !isPcV ? '97%' : '97%', padding: !isPcV ? '10px' : '10px', }}>

                <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center', width: '100%', }}>
                    <div className='flexColumn' style={{ textAlign: 'left', justifyContent: 'space-between', }}>
                        <span style={{ fontWeight: "600", fontSize: isPcV ? '18px' : '16px', }}>{`Order [ ${orderToEdit?.orderNumberOnShift} ]`}</span>
                        <span style={{ fontWeight: "600", fontSize: isPcV ? '16px' : '14px', color: greenTwo(theme) }}>
                            {orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' ? 'Delivery' : (orderToEdit?.tableNumberOrDeliveryOrPickup === 'pickup' ? 'Pickup' : `Table - ${orderToEdit?.tableNumberOrDeliveryOrPickup}`)}</span>
                    </div>

                    <button className='buttonStandart green' style={{
                        fontSize: isPcV ? '17px' : '14px', padding: isPcV ? '0px 5px' : '0px 3px', cursor: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 'not-allowed' : 'pointer',
                        opacity: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 0.5 : 1
                    }}
                        onClick={() => { setShowChangeTableOrCustomerModal(true) }} disabled={disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT'}>Change Table/Customer</button>
                </div>

                {selectUseCustomerOrPickUpName === 'Name' && <div className='flexColumn' style={{ width: '100%', opacity: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 0.5 : 1, }}>
                    <span style={{ fontWeight: "600", fontSize: isPcV ? '18px' : '16px', }}>Name:</span>

                    <input className='inputStandart' type="text" value={pickupName} disabled={true}
                        style={{ height: '35px', fontSize: isPcV ? '17px' : '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', overflowX: 'auto', margin: '3px 0px', }} />
                </div>}

                {selectUseCustomerOrPickUpName === 'Customer' && <div className='flexColumn' style={{ width: '100%', opacity: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 0.5 : 1, }}>
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

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', flex: 1, position: 'relative' }}>

                    <div className='flexColumn' style={{ marginTop: '5px', }}>
                        {orderToEdit?.status === 'CLOSEDWAITINGPAYMENT' && <div className='flexRow fullCenter' style={{ height: '100%', width: '100%', position: 'absolute' }} >
                            <span style={{ fontSize: 24, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0, 1)', padding: '20px', borderRadius: '10px', color: redOne(theme) }}>Order Closed </span>
                        </div>}

                        <div className='flexRow spaceBetweenJC' style={{ width: '100%' }}>
                            <button className='buttonStandart'
                                style={{
                                    marginLeft: '0px', height: '30px', fontSize: isPcV ? '17px' : '14px', cursor: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 'not-allowed' : 'pointer',
                                    opacity: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 0.5 : 1
                                }} disabled={(disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT')} onClick={() => setShowSelectItemsModal(true)} > ADD Items</button>
                        </div>

                        <div style={{
                            backgroundColor: "white", color: "black", marginTop: '5px', borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}`, opacity: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 0.5 : 1,
                        }}>
                            <Table responsive="sm" >
                                <thead>
                                    <tr>
                                        <th th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Item</th>
                                        <th th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Price</th>
                                        <th th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}><FontAwesomeIcon icon={faTrash} /></th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {selectedCustomItemsToAdd?.map((custom, index) => (
                                        <tr key={index}>
                                            <Tooltip title={<>{`${custom.name}`} <br /> {`${custom?.productOptsNames ?? ''}`} <br /> {`${custom.notes ? 'Notes: ' + custom.notes : ''}`}</>} arrow
                                                slotProps={{ popper: { className: "neon-tooltip", modifiers: [{ name: 'offset', options: { offset: [0, -14] } }] } }}>
                                                <td style={{ width: "100%", padding: '5px 5px' }} >{custom.name + (custom?.productOptsIDs?.length > 0 ? ' +' + custom?.productOptsIDs?.length : '')}</td>
                                            </Tooltip>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{custom?.price?.toFixed(2)}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeCustomItems(custom.ids) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                        </tr>
                                    ))}
                                    {selectedProductsToAdd?.map((product, index) => (
                                        <tr key={index}>
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{product.name}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{product.price.toFixed(2)}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeProductToAdd(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', borderTop: '1px solid lightgray', margin: '5px 0', marginTop: '7px' }} />

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', opacity: (disabled || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') ? 0.5 : 1, }}>
                    <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center', width: '100%' }}>
                        <span style={{ fontWeight: "bold", color: borderColorTwo(theme), fontSize: isPcV ? '24px' : '18px' }}>Itens Already On Order</span>

                        <button className='floatingButton' style={{ backgroundColor: 'rgba(22, 111, 163, 1)', marginRight: '5px', visibility: (selectedProductsToAdd.length > 0 || selectedCustomItemsToAdd.length > 0) ? 'visible' : 'hidden' }} onClick={() => handleAddItemsToOrder()} >
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
                                {productsAlreadyOnOrder?.filter(x => x.status !== 'CANCELLED').flatMap((product, index) =>
                                    <tr key={index}>
                                        <Tooltip title={<>{`${product.name}`} <br /> {`${product?.productOptions?.length > 0 ? '+' + product.productOptions.map(addon => addon.split("|")[1]).sort().join(", +") : ''}`} <br /> {`${product.notes ? 'Notes: ' + product.notes : ''}`}</>} arrow
                                            slotProps={{ popper: { className: "neon-tooltip", modifiers: [{ name: 'offset', options: { offset: [0, -14] } }] } }}>
                                            <td style={{ width: "100%", padding: '5px 5px' }} >{product.name + (product?.productOptions?.length > 0 ? ' +' + product?.productOptions?.length : '')}</td>
                                        </Tooltip>
                                        <td style={{ width: "40px", padding: '5px 5px' }}>{product.price.toFixed(2)}</td>
                                        <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { }} >
                                            <FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} onClick={() => { setShowCancelItemModal(product) }} />
                                        </td>
                                    </tr>
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
                    orderToEdit={orderToEdit} pickupName={pickupName} customerSelected={customerSelected} isTableAvailable={isTableAvailable}
                    companyOperation={companyOperation} getShiftOperationData={() => getShiftOperationData()} />
            </div>}

            {showSelectItemsModal && <div ref={selectItemsModalRef} className='myModal' >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories}
                    selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} selectedCustomItemsToAdd={selectedCustomItemsToAdd} setSelectedCustomItemsToAdd={setSelectedCustomItemsToAdd} />
            </div>}

            {showCancelItemModal && <div ref={selectItemsModalRef} className='myModal' >
                <DeleteItemModal close={() => setShowCancelItemModal(false)} companyOperation={companyOperation} orderToEdit={orderToEdit} ordemItemToRemove={showCancelItemModal} getShiftOperationData={getShiftOperationData} />
            </div>}

            {showCloseOrFinishOrderModal && <div className='myModal' >
                {(orderToEdit?.tableNumberOrDeliveryOrPickup !== 'delivery' || (orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' && orderToEdit?.status !== 'OPEN')) &&
                    <CloseOrFinishOrderModal close={() => setShowCloseOrFinishOrderModal(false)} closeAll={() => close()} orderToEdit={orderToEdit} companyOperation={companyOperation} getShiftOperationData={() => getShiftOperationData()} />}

                {orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' && orderToEdit?.status === 'OPEN' &&
                    <ChangeOrderStatusModal close={() => { close() }} companyOperation={companyOperation} selectedCookingOrderID={[orderToEdit?.id]}
                        setSelectedCookingOrderID={() => { }} selectedOnDeliveryOrderID={[]} setSelectedOnDeliveryOrderID={() => { }} getShiftOperationData={getShiftOperationData} />}
            </div>}
        </>
    );
}