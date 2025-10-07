import { use, useEffect, useRef, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal";
import { getCompanyOperation } from "../../../services/deliveryServices/CompanySevice";
import { closeOrder, getOrderOperation, reopenOrder } from "../../../services/deliveryServices/OrderService";
import { getShiftOperation, openNewShift } from "../../../services/deliveryServices/ShiftService";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCircleDown, faCircleUp, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import CancelOrder from "./components/CancelOrderModal.jsx";
import CompleteOrdersModal from "./components/CompleteOrdersModal.jsx";
import up from "../../../assets/up.png";
import down from "../../../assets/down.png";


export default function SystemPage({ screenOnFocus, setHaveModalOpen, getShiftOperationData }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();
    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderModalRef = useRef(null);

    const orders = useSelector((state) => state.companyOperation.orders);

    const [selectedCookingOrderID, setSelectedCookingOrderID] = useState([]);
    const [selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID] = useState([]);

    const [changeStatusOrderModal, setChangeStatusOrderModal] = useState(false);
    const [selectedOrderToCancel, setSelectedOrderToCancel] = useState(null);
    const [completeOrdersModal, setCompleteOrdersModal] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [seeCompletedOrders, setSeeCompletedOrders] = useState(false);
    const [seeCanceledOrders, setSeeCanceledOrders] = useState(false);


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

    async function dispatchOrders() {
        setProcessing(true);
        await Promise.all(
            selectedCookingOrderID.map(orderID =>
                closeOrder(orderID, false, 0)
            )
        );

        await getShiftOperationData();
        setSelectedCookingOrderID([]);
        setSelectedOnDeliveryOrderID([]);
        setChangeStatusOrderModal(false);
        setProcessing(false);
    }

    async function openOrdersAgain() {
        setProcessing(true);
        await Promise.all(
            selectedOnDeliveryOrderID.map(orderID =>
                reopenOrder(orderID)
            )
        );
        await getShiftOperationData();
        setSelectedCookingOrderID([]);
        setSelectedOnDeliveryOrderID([]);
        setChangeStatusOrderModal(false);
        setProcessing(false);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: 5, overflowY: 'auto' }}>
                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }}
                        onClick={() => { setNewOrderModal(true); setHaveModalOpen(true); }}>New Order</button>
                </div>}

                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>

                        <h3 style={{ color: "white", marginBottom: '10px' }}>Orders Cooking</h3>
                        <button style={{
                            backgroundColor: '#c90000ff', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6, marginBottom: '10px', marginRight: '5px',
                            visibility: ((selectedCookingOrderID.length === 1 && selectedOnDeliveryOrderID.length === 0) || (selectedCookingOrderID.length === 0 && selectedOnDeliveryOrderID.length === 1)) ? 'visible' : 'hidden'
                        }}
                            onClick={() => findOrderToCancel()}>
                            <span>Cancel</span>
                        </button>
                    </div>
                    <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', }}>
                        <Table hover responsive="sm" >
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 2, }}>
                                <tr>
                                    <th style={{ width: "40px" }}>Num</th>
                                    <th>Customer</th>
                                    <th>Minutes</th>
                                </tr>
                            </thead>
                            <tbody >
                                {orders && orders.length > 0 && orders.filter(order => order.status === "OPEN").sort((a, b) => Date.parse(a.openOrderDateUtc + "Z") - Date.parse(b.openOrderDateUtc + "Z")).map((order, index) => (
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

                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                        <h3 style={{ color: "white", marginBottom: '10px' }}>Orders on Delivery</h3>
                        <button style={{
                            backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6, marginBottom: '10px', marginRight: '5px',
                            visibility: (selectedCookingOrderID?.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden'
                        }}
                            onClick={() => setChangeStatusOrderModal(true)}>
                            <FontAwesomeIcon icon={selectedCookingOrderID.length > 0 ? faArrowDown : faArrowUp} flip="horizontal" style={{ visibility: (selectedCookingOrderID.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden' }} />
                        </button>
                    </div>

                    <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', }}>
                        <Table hover responsive="sm" >
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 2, }}>
                                <tr>
                                    <th style={{ width: "40px" }}>Num</th>
                                    <th>Customer</th>
                                    <th>Minutes</th>
                                </tr>
                            </thead>
                            <tbody >
                                {orders && orders.length > 0 && orders.filter(order => order.status === "CLOSEDWAITINGPAYMENT").sort((a, b) => Date.parse(a.closedWaitingPaymentAtUtc + "Z") - Date.parse(b.closedWaitingPaymentAtUtc + "Z")).map((order, index) => (
                                    <tr key={order.id} className={selectedOnDeliveryOrderID?.includes(order.id) ? "table-active" : ""}
                                        onClick={() => { setSelectedCookingOrderID([]); setSelectedOnDeliveryOrderID(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]); }} style={{ cursor: "pointer" }}>
                                        <td>{order.orderNumberOnShift}</td>
                                        <td>{order.customer?.customerName || "No Name"}</td>
                                        <td>{Math.max( 0, Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                </div>}

                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>


                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSeeCompletedOrders(!seeCompletedOrders)}>
                            <h3 style={{ color: "white", marginBottom: '10px' }}>Completed Orders</h3>
                            <FontAwesomeIcon style={{ marginLeft: '5px', fontSize: '22px', opacity: 0.8 }} icon={seeCompletedOrders ? faSquareCaretUp : faSquareCaretDown} />
                        </div>

                        <button style={{
                            backgroundColor: '#3d8602ff', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6, marginBottom: '10px', marginRight: '5px',
                            visibility: ((selectedCookingOrderID.length === 0 && selectedOnDeliveryOrderID.length > 0)) ? 'visible' : 'hidden'
                        }}
                            onClick={() => setCompleteOrdersModal(true)}>
                            <span>Finish</span>
                        </button>
                    </div>

                    {seeCompletedOrders && <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', }}>
                        <Table responsive="sm" >
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 2, }}>
                                <tr>
                                    <th style={{ width: "40px" }}>Num</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody >
                                {orders && orders.length > 0 && orders.filter(order => order.status === "PAID").sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
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
                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>


                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => setSeeCanceledOrders(!seeCanceledOrders)}>
                            <h3 style={{ color: "white", marginBottom: '10px' }}>Canceled Orders</h3>
                            <FontAwesomeIcon style={{ marginLeft: '5px', fontSize: '22px', opacity: 0.8 }} icon={seeCanceledOrders ? faSquareCaretUp : faSquareCaretDown} />
                        </div>
                    </div>

                    {seeCanceledOrders && <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', }}>
                        <Table responsive="sm" >
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "white", zIndex: 2, }}>
                                <tr>
                                    <th style={{ width: "40px" }}>Num</th>
                                    <th>Customer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody >
                                {orders && orders.length > 0 && orders.filter(order => order.status === "CANCELLED").sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
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

            {newOrderModal && <div ref={newOrderModalRef} className="myModal" style={{ zIndex: 9 }} >
                <NewOrderModal closeNewOrderModal={() => { setNewOrderModal(false); setHaveModalOpen(false); }} getShiftOperationData={getShiftOperationData} />
            </div>}

            {changeStatusOrderModal && <div className="myModal" style={{ zIndex: 100 }} >
                <div style={{
                    display: 'flex', flexDirection: 'column', maxWidth: !isDesktopView ? "95%" : "45%", maxHeight: !isDesktopView ? "95%" : "90%", border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                    color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto"
                }}>
                    {selectedCookingOrderID.length > 0 && <div>
                        <span>Dispach to delivery?</span>
                    </div>}

                    {selectedOnDeliveryOrderID.length > 0 && <div>
                        <span>Reopen Orders?</span>
                    </div>}
                    <br />

                    {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { setSelectedCookingOrderID([]); setChangeStatusOrderModal(false); }} disabled={processing}>Cancel</button>

                        <button style={{ backgroundColor: 'rgba(15, 107, 56, 0)', border: "none", color: "rgba(38, 233, 35, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { if (selectedCookingOrderID.length > 0) dispatchOrders(); if (selectedOnDeliveryOrderID.length > 0) openOrdersAgain(); }} disabled={processing}>Yes</button>
                    </div>}

                    {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>}

            {selectedOrderToCancel && <div className="myModal" style={{ zIndex: 100 }} >
                <CancelOrder close={() => closeOrderToCancel()} selectedOrderToCancel={selectedOrderToCancel} getShiftOperationData={getShiftOperationData} />
            </div>}

            {completeOrdersModal && <div className="myModal" style={{ zIndex: 100 }} >
                <CompleteOrdersModal close={() => { setSelectedOnDeliveryOrderID([]); setCompleteOrdersModal(false); }} selectedOnDeliveryOrderID={selectedOnDeliveryOrderID} getShiftOperationData={async () => await getShiftOperationData()} />
            </div>}
        </>
    );
}