import { use, useEffect, useRef, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCircleDown, faCircleUp, faPen, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import CancelOrder from "./components/CancelOrderModal.jsx";
import CompleteOrdersModal from "./components/CompleteOrdersModal.jsx";
import ChangeOrderStatusModal from "./components/ChangeOrderStatusModal.jsx";
import { borderColorTwo, fontColorOne, greenOne, greenTwo, redOne, secondColor, secondColorInverse } from "../../../../theme/Colors.js";
import { isOwnerOrManagerOrSupervisor } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import { isOwnerOrManager } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import EditOrderModal from "./components/EditOrderModal.jsx";
import OrderResumeModal from './components/auxComponents/OrderResumeModal.jsx';


export default function SystemPageDelivery({ onFocus, setHaveModalOpen, getShiftOperationData, selectedCookingOrderID, setSelectedCookingOrderID, toggleSelectedCookingOrderID }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const dispatch = useDispatch();
    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderModalRef = useRef(null);
    const [editOrderModal, setEditOrderModal] = useState(false);

    const [requesterIdOwnerOrManager, setRequesterIdOwnerOrManager] = useState(false);
    const [requesterIsOwnerOrManagerOrSupervisor, setRequesterIsOwnerOrManagerOrSupervisor] = useState(false);

    const companyOperation = useSelector((state) => state.companyOperation);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID] = useState([]);

    const [changeStatusOrderModal, setChangeStatusOrderModal] = useState(false);
    const [completeOrdersModal, setCompleteOrdersModal] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [seeCompletedOrders, setSeeCompletedOrders] = useState(false);
    const [seeCanceledOrders, setSeeCanceledOrders] = useState(false);

    const [seeCompletedOrCancelledOrders, setSeeCompletedOrCancelledOrders] = useState(false);
    const [seeOrderResumeModal, setSeeOrderResumeModal] = useState(false);


    useEffect(() => {
        if (companyOperation) setRequesterIdOwnerOrManager(isOwnerOrManager(localStorage.getItem("userLoggedEmail"), companyOperation));
        if (companyOperation) setRequesterIsOwnerOrManagerOrSupervisor(isOwnerOrManagerOrSupervisor(localStorage.getItem("userLoggedEmail"), companyOperation));
    }, [companyOperation]);

    async function findOrderToEdit() {
        let orderFound;
        if (selectedCookingOrderID.length > 0 && selectedOnDeliveryOrderID.length > 0) return;
        if (selectedCookingOrderID.length === 1) orderFound = orders.find(order => order.id === selectedCookingOrderID[0]);

        setEditOrderModal(orderFound);
    }

    async function closeOrderToCancel() {
        setSelectedCookingOrderID([]);
        setSelectedOnDeliveryOrderID([]);
        setSelectedOrderToCancel(null);
    }


    return (
        <>
            <div className='flexColumn' style={{ height: '100%', overflowY: 'auto', }}>
                {onFocus !== "map" && <div className='flexRow' style={{ width: '100%', margin: '3px 0px' }}>
                    <button className='buttonStandart' style={{ marginLeft: '0px', }}
                        onClick={() => { setNewOrderModal(true); setHaveModalOpen(true); }}>New Order</button>
                </div>}

                <div className='flexColumn' >
                    {onFocus !== "map" && <div className='flexColumn' style={{ textAlign: 'left', marginBottom: '5px', }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '8px', }}>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', }}>Orders Cooking</span>

                            {requesterIsOwnerOrManagerOrSupervisor && <button className='floatingButton greenTwo' style={{
                                marginRight: '5px',
                                visibility: ((selectedCookingOrderID.length === 1 && selectedOnDeliveryOrderID.length === 0)) ? 'visible' : 'hidden'
                            }}
                                onClick={() => findOrderToEdit()}>
                                <span><FontAwesomeIcon icon={faPen} /></span>
                            </button>}
                        </div>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead style={{ position: "sticky", zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Minutes</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "OPEN" && order.tableNumberOrDeliveryOrPickup === 'delivery').sort((a, b) => Date.parse(a.openOrderDateUtc + "Z") - Date.parse(b.openOrderDateUtc + "Z")).map((order, index) => (
                                        <tr key={order.id} className={selectedCookingOrderID?.includes(order.id) ? "table-active" : ""}
                                            onClick={() => { setSelectedOnDeliveryOrderID([]); toggleSelectedCookingOrderID( order.id); }} style={{ cursor: "pointer" }}>
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{order.orderNumberOnShift}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.customer?.customerName?.split(" ")[0] || "No Name"}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{Math.max(0, Math.floor((Date.now() - Date.parse(order.openOrderDateUtc + "Z")) / 60000))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>}

                    {onFocus !== "map" && <div className='flexColumn' style={{ textAlign: 'left', marginBottom: '5px', }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '8px', }}>
                            <span style={{ fontSize: '24px', fontWeight: 'bold', }}>Orders on Delivery</span>

                            <button className='floatingButton' style={{
                                backgroundColor: 'rgba(22, 111, 163, 1)', marginRight: '5px',
                                visibility: (selectedCookingOrderID?.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden'
                            }}
                                onClick={() => setChangeStatusOrderModal(true)}>
                                <FontAwesomeIcon icon={selectedCookingOrderID.length > 0 ? faArrowDown : faArrowUp} flip="horizontal" style={{ visibility: (selectedCookingOrderID.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden' }} />
                            </button>
                        </div>

                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead style={{ position: "sticky", top: 0, zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Minutes</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "CLOSEDWAITINGPAYMENT" && order.tableNumberOrDeliveryOrPickup === 'delivery').sort((a, b) => Date.parse(a.closedWaitingPaymentAtUtc + "Z") - Date.parse(b.closedWaitingPaymentAtUtc + "Z")).map((order, index) => (
                                        <tr key={order.id} className={selectedOnDeliveryOrderID?.includes(order.id) ? "table-active" : ""}
                                            onClick={() => { setSelectedCookingOrderID([]); setSelectedOnDeliveryOrderID(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]); console.log(selectedOnDeliveryOrderID) }} style={{ cursor: "pointer" }}>
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{order.orderNumberOnShift}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.customer?.customerName?.split(" ")[0] || "No Name"}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{Math.max(0, Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                    </div>}

                    <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '2px 0' }} />

                    {onFocus !== "map" && <div className='flexColumn' style={{ textAlign: 'left', marginBottom: '5px', }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '8px', }}>
                            <div className='flexRow' style={{ alignItems: 'center' }} onClick={() => setSeeCompletedOrders(!seeCompletedOrders)}>
                                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '20px', fontWeight: 'bold', }}>Completed Delivery Orders</span>

                                <FontAwesomeIcon style={{ marginLeft: '5px', fontSize: '22px', opacity: 0.8 }} icon={seeCompletedOrders ? faSquareCaretUp : faSquareCaretDown} />
                            </div>
                            <button className='floatingButton green' style={{
                                marginRight: '3px',
                                visibility: ((selectedCookingOrderID.length === 0 && selectedOnDeliveryOrderID.length > 0)) ? 'visible' : 'hidden'
                            }}
                                onClick={() => setCompleteOrdersModal(true)}>
                                <span>Finish</span>
                            </button>
                        </div>

                        {seeCompletedOrders && <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead style={{ position: "sticky", zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "PAID" && order.tableNumberOrDeliveryOrPickup === 'delivery').sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
                                        <tr key={order.id} className={seeCompletedOrCancelledOrders === order ? "table-active" : ""} onClick={() => { setSeeCompletedOrCancelledOrders(seeCompletedOrCancelledOrders === order ? null : order); }} style={{ cursor: "pointer" }} >
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{order.orderNumberOnShift}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.customer?.customerName?.split(" ")[0] || "No Name"}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.status}</td>
                                            {/* <td>{Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000)}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>}
                    </div>}

                    {onFocus !== "map" && <div className='flexColumn' style={{ textAlign: 'left', marginBottom: '5px', }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '8px', }}>
                            <div className='flexRow' style={{ alignItems: 'center' }} onClick={() => setSeeCanceledOrders(!seeCanceledOrders)}>
                                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '20px', fontWeight: 'bold', }}>Canceled Delivery Orders</span>

                                <FontAwesomeIcon style={{ marginLeft: '3px', fontSize: '22px', opacity: 0.8 }} icon={seeCanceledOrders ? faSquareCaretUp : faSquareCaretDown} />
                            </div>
                            <button className='floatingButton blue' style={{
                                marginRight: '5px',
                                visibility: (seeCompletedOrCancelledOrders ? 'visible' : 'hidden')
                            }} onClick={() => setSeeOrderResumeModal(seeCompletedOrCancelledOrders)}>
                                <span>☰</span>
                            </button>
                        </div>

                        {seeCanceledOrders && <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead style={{ position: "sticky", zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "CANCELLED" && order.tableNumberOrDeliveryOrPickup === 'delivery').sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
                                        <tr key={order.id} className={seeCompletedOrCancelledOrders === order ? "table-active" : ""} onClick={() => { setSeeCompletedOrCancelledOrders(seeCompletedOrCancelledOrders === order ? null : order); }} style={{ cursor: "pointer" }} >
                                            <td style={{ width: "100%", padding: '5px 5px' }}>{order.orderNumberOnShift}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.customer?.customerName || "No Name"}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.status}</td>
                                            {/* <td>{Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000)}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>}
                    </div>}
                </div >
            </div>

            {changeStatusOrderModal && <div className='myModal' >
                <ChangeOrderStatusModal close={() => { setSelectedCookingOrderID([]); setSelectedOnDeliveryOrderID([]); setChangeStatusOrderModal(false); }} companyOperation={companyOperation} selectedCookingOrderID={selectedCookingOrderID}
                    setSelectedCookingOrderID={setSelectedCookingOrderID} selectedOnDeliveryOrderID={selectedOnDeliveryOrderID} setSelectedOnDeliveryOrderID={setSelectedOnDeliveryOrderID} getShiftOperationData={getShiftOperationData} />
            </div>}

            {newOrderModal && <div ref={newOrderModalRef} className='myModal' >
                <NewOrderModal close={() => { setNewOrderModal(false); setHaveModalOpen(false); }} companyOperation={companyOperation} getShiftOperationData={getShiftOperationData} tableNumberSelectedBeforeModal={'delivery'} />
            </div>}

            {completeOrdersModal && <div className='myModal' >
                <CompleteOrdersModal close={() => { setSelectedOnDeliveryOrderID([]); setCompleteOrdersModal(false); }} companyOperationID={companyOperation?.companyOperationID} selectedOnDeliveryOrderID={selectedOnDeliveryOrderID} getShiftOperationData={async () => await getShiftOperationData()} />
            </div>}

            {editOrderModal && <div className='myModal' >
                <EditOrderModal close={() => { setEditOrderModal(false); }} companyOperation={companyOperation} orderToEdit={editOrderModal} setOrderToEdit={setEditOrderModal} getShiftOperationData={() => getShiftOperationData()} />
            </div>}

            {seeOrderResumeModal && <div className='myModal' >
                <OrderResumeModal close={() => { setSeeOrderResumeModal(false), setSeeCompletedOrCancelledOrders(null) }} orderToEdit={seeCompletedOrCancelledOrders} companyOperation={companyOperation} getShiftOperationData={() => getShiftOperationData()} />
            </div>}
        </>
    );
}