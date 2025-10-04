import { use, useEffect, useRef, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal";
import { getCompanyOperation } from "../../../services/deliveryServices/CompanySevice";
import { closeOrder, getOrderOperation, reopenOrder } from "../../../services/deliveryServices/OrderService";
import { getShiftOperation, openNewShift } from "../../../services/deliveryServices/ShiftService";
import { useDispatch, useSelector } from "react-redux";
import {
    changeCompanyName, changeCompanyEmail, changeCompanyPhone, changeCompanyAddress, changeCompanyLat, changeCompanyLng,
    changeUrlCompanyLogo, changeProductsCategories, changeCustomers, changeCurrentShift, changeNumberOfTables, changeOrders
} from '../../../redux/companyOperationSlice.js';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import CancelOrder from "./components/CancelOrderModal.jsx";


export default function SystemPage({ screenOnFocus, setHaveModalOpen }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();
    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderModalRef = useRef(null);

    const orders = useSelector((state) => state.companyOperation.orders);

    const [selectedCookingOrderID, setSelectedCookingOrderID] = useState([]);
    const [selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID] = useState([]);

    const [changeStatusOrderModal, setChangeStatusOrderModal] = useState(false);
    const [cancelOrderModal, setCancelOrderModal] = useState(false);
    const [processing, setProcessing] = useState(false);

    async function getCompanyOperationData(retryCount = 0) {
        const response = await getCompanyOperation();
        if (response?.status === 200) {
            const companyOperationData = response?.data;
            dispatch(changeCompanyName(companyOperationData?.companyName));
            dispatch(changeCompanyEmail(companyOperationData?.companyEmail));
            dispatch(changeCompanyPhone(companyOperationData?.companyPhone));
            dispatch(changeCompanyAddress(companyOperationData?.companyAddress));
            dispatch(changeCompanyLat(companyOperationData?.companyLat));
            dispatch(changeCompanyLng(companyOperationData?.companyLng));
            dispatch(changeUrlCompanyLogo(companyOperationData?.urlCompanyLogo));
            dispatch(changeProductsCategories(companyOperationData?.productsCategories || []));
            dispatch(changeCustomers(companyOperationData?.customers || []));
            dispatch(changeCurrentShift(companyOperationData?.currentShift || null));
            dispatch(changeNumberOfTables(companyOperationData?.numberOfTables || 0));

        } else if (response?.status === 400 && response?.data === "noActiveShift") {
            //IfOneDayRealOperationRemoveThis all this second "else if" and just leave the "if" above and the "else" below
            if (retryCount < 2) {
                const res = await openNewShift();
                return getCompanyOperationData(retryCount + 1);
            } else {
                alert("Error fetching company operation data");
            }
        } else {
            // alert("Error fetching company operation data");
        }
    }

    async function getShiftOperationData() {
        const response = await getShiftOperation();
        if (response?.status === 200) {
            const shiftOperationData = response?.data;
            dispatch(changeCurrentShift(shiftOperationData?.currentShift || null));
            dispatch(changeOrders(shiftOperationData?.orders || []));
        } else {
            // alert("Error fetching orders operation data");
        }
    }

    useEffect(() => {
        getCompanyOperationData();
    }, []);

    useEffect(() => {
        // run immediately once
        getShiftOperationData();


        const interval = setInterval(() => {
            getShiftOperationData();
        }, 12000);

        return () => clearInterval(interval);
    }, []);

    async function dispatchOrders() {
        setProcessing(true);
        await Promise.all(
            selectedCookingOrderID.map(orderID =>
                closeOrder(orderID, false, 0)
            )
        );

        await getShiftOperationData();
        setChangeStatusOrderModal(false);
        setProcessing(false);
    }

    useEffect(() => {
        console.log("Selected on delivery Orders: ", selectedOnDeliveryOrderID);
    }, [selectedOnDeliveryOrderID]);

    async function openOrdersAgain() {
        setProcessing(true);
        await Promise.all(
            selectedOnDeliveryOrderID.map(orderID =>
                reopenOrder(orderID)
            )
        );
        await getShiftOperationData();
        setChangeStatusOrderModal(false);
        setProcessing(false);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: 5 }}>
                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => { setNewOrderModal(true); setHaveModalOpen(true); }}>New Order</button>
                </div>}

                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>

                        <h3 style={{ color: "white", marginBottom: '10px' }}>Orders Cooking</h3>
                        <button style={{
                            backgroundColor: '#c90000ff', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6, marginBottom: '10px', marginRight: '5px',
                            visibility: (selectedCookingOrderID.length === 1) ? 'visible' : 'hidden'
                        }}
                            onClick={() => setCancelOrderModal(true)}>
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
                                    <tr key={order.id} className={selectedCookingOrderID.includes(order.id) ? "table-active" : ""}
                                        onClick={() => { setSelectedOnDeliveryOrderID([]); setSelectedCookingOrderID(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]); }} style={{ cursor: "pointer" }}>
                                        <td>{order.orderNumberOnShift}</td>
                                        <td>{order.customer?.customerName || "No Name"}</td>
                                        <td>{Math.floor((Date.now() - Date.parse(order.openOrderDateUtc + "Z")) / 60000)}</td>
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
                            visibility: (selectedCookingOrderID.length > 0 || selectedOnDeliveryOrderID.length > 0) ? 'visible' : 'hidden'
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
                                    <tr key={order.id} className={selectedOnDeliveryOrderID.includes(order.id) ? "table-active" : ""}
                                        onClick={() => { setSelectedCookingOrderID([]); setSelectedOnDeliveryOrderID(prev => prev.includes(order.id) ? prev.filter(id => id !== order.id) : [...prev, order.id]); }} style={{ cursor: "pointer" }}>
                                        <td>{order.orderNumberOnShift}</td>
                                        <td>{order.customer?.customerName || "No Name"}</td>
                                        <td>{Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>}
            </div >

            {newOrderModal && <div ref={newOrderModalRef} className="myModal" style={{ zIndex: 9 }} >
                <NewOrderModal closeNewOrderModal={() => { setNewOrderModal(false); setHaveModalOpen(false); }} />
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
                            onClick={() => { setSelectedOnDeliveryOrderID(false); setSelectedCookingOrderID([]); setChangeStatusOrderModal(false); }} disabled={processing}>Cancel</button>

                        <button style={{ backgroundColor: 'rgba(15, 107, 56, 0)', border: "none", color: "rgba(38, 233, 35, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { if (selectedCookingOrderID.length > 0) dispatchOrders(); if (selectedOnDeliveryOrderID.length > 0) openOrdersAgain(); }} disabled={processing}>Yes</button>
                    </div>}

                    {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>}

            {cancelOrderModal && <div className="myModal" style={{ zIndex: 100 }} >
                <CancelOrder close={() => setCancelOrderModal(false)} selectedCookingOrderID={selectedCookingOrderID} getCompanyOperationData={getCompanyOperationData} />
            </div>}
        </>
    );
}