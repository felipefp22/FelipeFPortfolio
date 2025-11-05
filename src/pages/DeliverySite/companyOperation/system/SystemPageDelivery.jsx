import { use, useEffect, useRef, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCircleDown, faCircleUp, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import CancelOrder from "./components/CancelOrderModal.jsx";
import CompleteOrdersModal from "./components/CompleteOrdersModal.jsx";
import ChangeOrderStatusModal from "./components/ChangeOrderStatusModal.jsx";
import { borderColorTwo, fontColorOne, redOne, secondColor, secondColorInverse } from "../../../../theme/Colors.js";
import { isOwnerOrManagerOrSupervisor } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import { isOwnerOrManager } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";


export default function SystemPageDelivery({ screenOnFocus, setHaveModalOpen, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();
    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderModalRef = useRef(null);

    const [requesterIdOwnerOrManager, setRequesterIdOwnerOrManager] = useState(false);
    const [requesterIsOwnerOrManagerOrSupervisor, setRequesterIsOwnerOrManagerOrSupervisor] = useState(false);

    const companyOperation = useSelector((state) => state.companyOperation);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [selectedCookingOrderID, setSelectedCookingOrderID] = useState([]);
    const [selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID] = useState([]);

    const [changeStatusOrderModal, setChangeStatusOrderModal] = useState(false);
    const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);
    const [completeOrdersModal, setCompleteOrdersModal] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [seeCompletedOrders, setSeeCompletedOrders] = useState(false);
    const [seeCanceledOrders, setSeeCanceledOrders] = useState(false);

    useEffect(() => {
        if (companyOperation) setRequesterIdOwnerOrManager(isOwnerOrManager(localStorage.getItem("userLoggedEmail"), companyOperation));
        if (companyOperation) setRequesterIsOwnerOrManagerOrSupervisor(isOwnerOrManagerOrSupervisor(localStorage.getItem("userLoggedEmail"), companyOperation));
    }, [companyOperation]);

    async function findOrderToCancel() {
        let orderFound;
        if (selectedCookingOrderID.length > 0 && selectedOnDeliveryOrderID.length > 0) return;
        if (selectedCookingOrderID.length === 1) orderFound = orders.find(order => order.id === selectedCookingOrderID[0]);
        if (selectedOnDeliveryOrderID.length === 1) orderFound = orders.find(order => order.id === selectedOnDeliveryOrderID[0]);

        setSelectedOrderToCancel(orderFound);
    }

    async function closeOrderToCancel() {
        setSelectedCookingOrderID([]);
        setSelectedOnDeliveryOrderID([]);
        setSelectedOrderToCancel(null);
    }


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, paddingTop: '8px', paddingLeft: '3px', overflowY: 'auto', }}>
                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', }}>
                    <button className="buttomDarkGray" style={{ marginBottom: '20px', marginLeft: '0px', }}
                        onClick={() => { setNewOrderModal(true); setHaveModalOpen(true); }}>New Order</button>
                </div>}

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto',  }}>
                    {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', marginBottom: '5px', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: '8px', color: fontColorOne(theme) }}>
                            <span style={{ fontSize: '26px', fontWeight: 'bold', }}>Orders Cooking</span>
                            {requesterIsOwnerOrManagerOrSupervisor && <button className="floatingButton" style={{
                                backgroundColor: redOne(theme), marginRight: '5px',
                                visibility: ((selectedCookingOrderID.length === 1 && selectedOnDeliveryOrderID.length === 0) || (selectedCookingOrderID.length === 0 && selectedOnDeliveryOrderID.length === 1)) ? 'visible' : 'hidden'
                            }}
                                onClick={() => findOrderToCancel()}>
                                <span>Cancel</span>
                            </button>}
                        </div>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table hover responsive="sm" >
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
                                            onClick={() => { setSelectedOnDeliveryOrderID([]); setSelectedCookingOrderID(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]); }} style={{ cursor: "pointer" }}>
                                            <td>{order.orderNumberOnShift}</td>
                                            <td>{order.customer?.customerName || "No Name"}</td>
                                            <td>{Math.max(0, Math.floor((Date.now() - Date.parse(order.openOrderDateUtc + "Z")) / 60000))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>}

                    {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', marginBottom: '5px', }}>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: '8px',}}>
                            <span style={{ fontSize: '26px', fontWeight: 'bold', }}>Orders on Delivery</span>
                            <button className="floatingButton" style={{
                                backgroundColor: 'rgba(22, 111, 163, 1)', marginRight: '5px',
                                visibility: (selectedCookingOrderID?.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden'
                            }}
                                onClick={() => setChangeStatusOrderModal(true)}>
                                <FontAwesomeIcon icon={selectedCookingOrderID.length > 0 ? faArrowDown : faArrowUp} flip="horizontal" style={{ visibility: (selectedCookingOrderID.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden' }} />
                            </button>
                        </div>

                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table hover responsive="sm" >
                                <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Minutes</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "CLOSEDWAITINGPAYMENT" && order.tableNumberOrDeliveryOrPickup === 'delivery').sort((a, b) => Date.parse(a.closedWaitingPaymentAtUtc + "Z") - Date.parse(b.closedWaitingPaymentAtUtc + "Z")).map((order, index) => (
                                        <tr key={order.id} className={selectedOnDeliveryOrderID?.includes(order.id) ? "table-active" : ""}
                                            onClick={() => { setSelectedCookingOrderID([]); setSelectedOnDeliveryOrderID(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]); }} style={{ cursor: "pointer" }}>
                                            <td>{order.orderNumberOnShift}</td>
                                            <td>{order.customer?.customerName || "No Name"}</td>
                                            <td>{Math.max(0, Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000))}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>

                    </div>}

                    {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', marginBottom: '5px', }}>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: '8px', }}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSeeCompletedOrders(!seeCompletedOrders)}>
                                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '26px', fontWeight: 'bold', }}>Completed Orders</span>
                                <FontAwesomeIcon style={{ marginLeft: '5px', fontSize: '22px', opacity: 0.8 }} icon={seeCompletedOrders ? faSquareCaretUp : faSquareCaretDown} />
                            </div>
                            <button className="floatingButton" style={{
                                backgroundColor: '#3d8602ff', marginBottom: '10px', marginRight: '5px',
                                visibility: ((selectedCookingOrderID.length === 0 && selectedOnDeliveryOrderID.length > 0)) ? 'visible' : 'hidden'
                            }}
                                onClick={() => setCompleteOrdersModal(true)}>
                                <span>Finish</span>
                            </button>
                        </div>

                        {seeCompletedOrders && <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead style={{ position: "sticky",  zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "PAID" && order.tableNumberOrDeliveryOrPickup === 'delivery').sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
                                        <tr key={order.id} >
                                            <td>{order.orderNumberOnShift}</td>
                                            <td>{order.customer?.customerName || "No Name"}</td>
                                            <td>{order.status}</td>
                                            {/* <td>{Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000)}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>}
                    </div>}
                    {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', marginBottom: '5px', }}>


                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: '8px',}}>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSeeCanceledOrders(!seeCanceledOrders)}>
                                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '26px', fontWeight: 'bold', }}>Canceled Orders</span>
                                <FontAwesomeIcon style={{ marginLeft: '5px', fontSize: '22px', opacity: 0.8 }} icon={seeCanceledOrders ? faSquareCaretUp : faSquareCaretDown} />
                            </div>
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
                                        <tr key={order.id} >
                                            <td>{order.orderNumberOnShift}</td>
                                            <td>{order.customer?.customerName || "No Name"}</td>
                                            <td>{order.status}</td>
                                            {/* <td>{Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000)}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>}
                    </div>}
                </div >
            </div>

            {changeStatusOrderModal && <div className="myModal" style={{}} >
                <ChangeOrderStatusModal close={() => { setSelectedCookingOrderID([]); setSelectedOnDeliveryOrderID([]); setChangeStatusOrderModal(false); }} companyOperationID={companyOperation?.companyOperationID} selectedCookingOrderID={selectedCookingOrderID}
                    setSelectedCookingOrderID={setSelectedCookingOrderID} selectedOnDeliveryOrderID={selectedOnDeliveryOrderID} setSelectedOnDeliveryOrderID={setSelectedOnDeliveryOrderID} getShiftOperationData={getShiftOperationData} />
            </div>}

            {selectedOrderToCancel && <div className="myModal" style={{}} >
                <CancelOrder close={() => closeOrderToCancel()} companyOperationID={companyOperation?.companyOperationID} selectedOrderToCancel={selectedOrderToCancel} getShiftOperationData={getShiftOperationData} />
            </div>}

            {newOrderModal && <div ref={newOrderModalRef} className="myModal" style={{}} >
                <NewOrderModal close={() => { setNewOrderModal(false); setHaveModalOpen(false); }} companyOperation={companyOperation} getShiftOperationData={getShiftOperationData} tableNumberSelectedBeforeModal={'delivery'} />
            </div>}

            {completeOrdersModal && <div className="myModal" style={{}} >
                <CompleteOrdersModal close={() => { setSelectedOnDeliveryOrderID([]); setCompleteOrdersModal(false); }} companyOperationID={companyOperation?.companyOperationID} selectedOnDeliveryOrderID={selectedOnDeliveryOrderID} getShiftOperationData={async () => await getShiftOperationData()} />
            </div>}
        </>
    );
}