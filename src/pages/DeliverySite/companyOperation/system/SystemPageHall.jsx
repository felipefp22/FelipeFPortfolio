import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal.jsx";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { blueOne, borderColorTwo, fontColorOne, greenTwo, } from "../../../../theme/Colors.js";
import { isOwnerOrManagerOrSupervisor } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import { isOwnerOrManager } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import tableGreen from "../../../../assets/tableGreen.png";
import tableYellow from "../../../../assets/tableYellow.png";
import tableRed from "../../../../assets/tableRed.png";
import EditOrderModal from "./components/EditOrderModal.jsx";
import OrderClosedOrPaidDetailsModal from './components/auxComponents/OrderResumeModal.jsx';
import OrderResumeModal from './components/auxComponents/OrderResumeModal.jsx';
import SignalRService from '../../../../services/deliveryServices/auxServices/SignalRService.jsx';

export default function SystemPageHall({ onFocus, setHaveModalOpen, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [newOrderModal, setNewOrderModal] = useState(false);
    const [editOrderModal, setEditOrderModal] = useState(false);
    const [seeOrderResumeModal, setSeeOrderResumeModal] = useState(false);

    const [seePickUpOrders, setSeePickUpOrders] = useState(true);
    const [seeCompletedOrders, setSeeCompletedOrders] = useState(false);
    const [seeCanceledOrders, setSeeCanceledOrders] = useState(false);

    const companyOperation = useSelector((state) => state.companyOperation);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [requesterIdOwnerOrManager, setRequesterIdOwnerOrManager] = useState(false);
    const [requesterIsOwnerOrManagerOrSupervisor, setRequesterIsOwnerOrManagerOrSupervisor] = useState(false);

    const [selectedPickUpOrCompletedOrCanceledOrderID, setSelectedPickUpOrCompletedOrCanceledOrderID] = useState(null);

    const [inputSearchTable, setInputSearchTable] = useState("")

    const [selectedTable, setSelectedTable] = useState(null);

    const [processing, setProcessing] = useState(false);


    useEffect(() => {
        if (companyOperation) setRequesterIdOwnerOrManager(isOwnerOrManager(localStorage.getItem("userLoggedEmail"), companyOperation));
        if (companyOperation) setRequesterIsOwnerOrManagerOrSupervisor(isOwnerOrManagerOrSupervisor(localStorage.getItem("userLoggedEmail"), companyOperation));
    }, [companyOperation]);

    useEffect(() => {
        const handler = (e) => e.preventDefault();
        document.addEventListener('contextmenu', handler);
        return () => document.removeEventListener('contextmenu', handler);
    }, []);

    return (
        <>
            <div className='flexColumn' style={{ height: '100%', flexGrow: 1, overflowY: 'auto', }}>
                {onFocus !== "map" && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '12px', marginBottom: '8px' }}>
                    <button className='buttonStandart' style={{ visibility: (!companyOperation?.orders?.some(order => String(order.tableNumberOrDeliveryOrPickup) === String(selectedTable)) ? 'visible' : 'hidden') }}
                        onClick={() => { setNewOrderModal(true); }}>
                        {"New Order"}</button>


                    <button className='buttonStandart' style={{ visibility: (companyOperation?.orders?.some(order => String(order.tableNumberOrDeliveryOrPickup) === String(selectedTable)) ? 'visible' : 'hidden') }}
                        onClick={() => { setEditOrderModal(companyOperation?.orders?.find(order => String(order.tableNumberOrDeliveryOrPickup) === String(selectedTable))); }}>
                        {"Edit Order"}</button>
                </div>}

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '300px', maxHeight: '80%', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', padding: 3, marginBottom: '6px', overflowY: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <input type="number" className='inputStandart' value={inputSearchTable} onChange={(e) => setInputSearchTable(e.target.value)} placeholder=""
                            style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', textAlign: 'center' }} />

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', width: '100%', overflowY: 'auto', flexWrap: 'wrap', }}>
                            {Array.from({ length: companyOperation?.numberOfTables }).map((_, idx) => {
                                const tableNumber = idx + 1; // tables start from 1
                                const matchesSearch =
                                    !inputSearchTable || String(tableNumber).includes(String(inputSearchTable));

                                if (!matchesSearch) return null;

                                let tableOnUse = false;
                                if (companyOperation?.orders?.some(order => String(order.tableNumberOrDeliveryOrPickup) === String(tableNumber) && (order?.status !== "CLOSED") && (order.status === "OPEN"))) tableOnUse = "OPEN";
                                if (companyOperation?.orders?.some(order => String(order.tableNumberOrDeliveryOrPickup) === String(tableNumber) && (order.status === "CLOSEDWAITINGPAYMENT"))) tableOnUse = "CLOSEDWAITINGPAYMENT";

                                let tableColorImage = tableGreen;
                                if (tableOnUse === "OPEN") tableColorImage = tableYellow;
                                if (tableOnUse === "CLOSEDWAITINGPAYMENT") tableColorImage = tableRed;

                                function openEditOrNewOrderModal() {
                                    if (tableOnUse) setEditOrderModal(companyOperation?.orders?.find(order => String(order.tableNumberOrDeliveryOrPickup) === String(tableNumber))); else setNewOrderModal(true);
                                }

                                return (
                                    <div key={idx} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', width: isPcV ? '90px' : '65px', height: isPcV ? "104px" : "84px", margin: 5, cursor: 'pointer',
                                        borderRadius: '5px', backgroundColor: (tableNumber === selectedTable) ? 'lightblue' : 'transparent'
                                    }} onClick={() => { setSelectedTable((selectedTable === tableNumber) ? null : tableNumber); setSelectedPickUpOrCompletedOrCanceledOrderID(null); }}
                                        onDoubleClick={() => { setSelectedTable(tableNumber); setSelectedPickUpOrCompletedOrCanceledOrderID(null); openEditOrNewOrderModal(); }}
                                        onTouchStart={(e) => {
                                            const now = Date.now();
                                            const lastTap = e.currentTarget.lastTap || 0;
                                            const DOUBLE_TAP_DELAY = 220;

                                            if (now - lastTap < DOUBLE_TAP_DELAY) {
                                                clearTimeout(e.currentTarget.singleTapTimer);
                                                setSelectedPickUpOrCompletedOrCanceledOrderID(null);
                                                setSelectedTable(tableNumber);
                                                openEditOrNewOrderModal();
                                            }

                                            e.currentTarget.lastTap = now;
                                            e.currentTarget.longPressTimer = setTimeout(() => {
                                                setSelectedPickUpOrCompletedOrCanceledOrderID(null);
                                                setSelectedTable(tableNumber);
                                                openEditOrNewOrderModal();
                                            }, 700);
                                        }}
                                        onTouchEnd={(e) => { clearTimeout(e.currentTarget.longPressTimer); }} onTouchMove={(e) => { clearTimeout(e.currentTarget.longPressTimer); }}>

                                        <img src={tableColorImage} alt={""} style={{ width: isPcV ? '80px' : '60px', height: isPcV ? '80px' : '60px', objectFit: 'cover', borderRadius: '5px', }} />
                                        <span style={{ color: 'black', fontWeight: 'bold', fontSize: "16px", textAlign: 'center' }}>{`${tableNumber}`}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {onFocus !== "map" && <div className='flexColumn' style={{ textAlign: 'left', marginBottom: '5px', }}>

                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '8px', }}>
                            <span style={{ color: fontColorOne(theme), fontSize: '24px', fontWeight: 'bold', }}>Waiting PickUp</span>

                            <button className='floatingButton greenTwo' style={{
                                marginRight: '5px',
                                visibility: (selectedPickUpOrCompletedOrCanceledOrderID && selectedPickUpOrCompletedOrCanceledOrderID.status !== 'PAID' && selectedPickUpOrCompletedOrCanceledOrderID.status !== 'CANCELLED') ? 'visible' : 'hidden'
                            }}
                                onClick={() => { if (selectedPickUpOrCompletedOrCanceledOrderID.status !== 'PAID' && selectedPickUpOrCompletedOrCanceledOrderID.status !== 'CANCELED') setEditOrderModal(selectedPickUpOrCompletedOrCanceledOrderID) }}>
                                <span><FontAwesomeIcon icon={faPen} /></span>
                            </button>
                        </div>

                        {seePickUpOrders && <div style={{ backgroundColor: "white", color: "black", borderRadius: '5px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '250px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead style={{ position: "sticky", zIndex: 2, }}>
                                    <tr>
                                        <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Num</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Customer</th>
                                        <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {orders && orders.length > 0 && orders.filter(order => (order.status === "OPEN" || order.status === "CLOSEDWAITINGPAYMENT") && order.tableNumberOrDeliveryOrPickup === 'pickup').sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
                                        <tr key={order.id} className={selectedPickUpOrCompletedOrCanceledOrderID?.id === order.id ? "table-active" : ""}
                                            onClick={() => { setSelectedTable(null); setSelectedPickUpOrCompletedOrCanceledOrderID(selectedPickUpOrCompletedOrCanceledOrderID === order ? null : order); }} style={{ cursor: "pointer" }}
                                            onDoubleClick={() => { setSelectedTable(null); setSelectedPickUpOrCompletedOrCanceledOrderID(order); setEditOrderModal(order); }}
                                            onTouchStart={(e) => {
                                                const now = Date.now();
                                                const lastTap = e.currentTarget.lastTap || 0;
                                                const DOUBLE_TAP_DELAY = 220;

                                                if (now - lastTap < DOUBLE_TAP_DELAY) {
                                                    clearTimeout(e.currentTarget.singleTapTimer);
                                                    setSelectedTable(null);
                                                    setSelectedPickUpOrCompletedOrCanceledOrderID(order);
                                                    setEditOrderModal(order);
                                                }

                                                e.currentTarget.lastTap = now;
                                                e.currentTarget.longPressTimer = setTimeout(() => {
                                                    setSelectedTable(null);
                                                    setSelectedPickUpOrCompletedOrCanceledOrderID(order);
                                                    setEditOrderModal(order);
                                                }, 700);
                                            }}
                                            onTouchEnd={(e) => { clearTimeout(e.currentTarget.longPressTimer); }} onTouchMove={(e) => { clearTimeout(e.currentTarget.longPressTimer); }}>

                                            <td style={{ width: "100%", padding: '5px 5px' }}>{order.orderNumberOnShift}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.customer?.customerName ?? (order.pickupName ?? "No Name")}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.status === "CLOSEDWAITINGPAYMENT" ? "CLOSE" : order?.status}</td>
                                            {/* <td>{Math.floor((Date.now() - Date.parse(order.closedWaitingPaymentAtUtc + "Z")) / 60000)}</td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>}
                    </div>}

                    <div style={{ width: '100%', borderTop: '1px solid lightgray', backgroundColor: 'lightgray', margin: '2px 0' }} />

                    {onFocus !== "map" && <div className='flexColumn' style={{ textAlign: 'left', marginBottom: '5px', }}>
                        <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginBottom: '8px', }}>
                            <div className='flexRow' style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => setSeeCompletedOrders(!seeCompletedOrders)}>
                                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '20px', fontWeight: 'bold', }}>Completed Orders</span>
                                <FontAwesomeIcon style={{ marginLeft: '3px', fontSize: '22px', opacity: 0.8 }} icon={seeCompletedOrders ? faSquareCaretUp : faSquareCaretDown} />
                            </div>
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
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "PAID").sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
                                        <tr key={order.id} className={selectedPickUpOrCompletedOrCanceledOrderID?.id === order.id ? "table-active" : ""}
                                            onClick={() => { setSelectedTable(null); setSelectedPickUpOrCompletedOrCanceledOrderID(selectedPickUpOrCompletedOrCanceledOrderID === order ? null : order); }} style={{ cursor: "pointer" }} >

                                            <td style={{ width: "100%", padding: '5px 5px' }}>{order.orderNumberOnShift}</td>
                                            <td style={{ width: "40px", padding: '5px 5px' }}>{order.customer?.customerName ?? (order.pickupName ?? "No Name")}</td>
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
                            <div className='flexRow' style={{ alignItems: 'center', cursor: 'pointer' }} onClick={() => setSeeCanceledOrders(!seeCanceledOrders)}>
                                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '20px', fontWeight: 'bold', }}>Canceled Orders</span>
                                <FontAwesomeIcon style={{ marginLeft: '3px', fontSize: '22px', opacity: 0.8 }} icon={seeCanceledOrders ? faSquareCaretUp : faSquareCaretDown} />
                            </div>
                            <button className='floatingButton blue' style={{
                                marginRight: '5px',
                                visibility: ((selectedPickUpOrCompletedOrCanceledOrderID && selectedPickUpOrCompletedOrCanceledOrderID?.status !== 'OPEN' && selectedPickUpOrCompletedOrCanceledOrderID?.status !== 'CLOSEDWAITINGPAYMENT') ? 'visible' : 'hidden')
                            }} onClick={() => setSeeOrderResumeModal(selectedPickUpOrCompletedOrCanceledOrderID)}>
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
                                    {orders && orders.length > 0 && orders.filter(order => order.status === "CANCELLED").sort((a, b) => a.orderNumberOnShift - b.orderNumberOnShift).map((order, index) => (
                                        <tr key={order.id} className={selectedPickUpOrCompletedOrCanceledOrderID?.id === order.id ? "table-active" : ""}
                                            onClick={() => { setSelectedTable(null); setSelectedPickUpOrCompletedOrCanceledOrderID(selectedPickUpOrCompletedOrCanceledOrderID === order ? null : order); }} style={{ cursor: "pointer" }} >

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

            {newOrderModal && <div className='myModal' >
                <NewOrderModal close={() => { setNewOrderModal(false); }} companyOperation={companyOperation} getShiftOperationData={getShiftOperationData} tableNumberSelectedBeforeModal={selectedTable} />
            </div>}

            {editOrderModal && <div className='myModal' >
                <EditOrderModal close={() => { setEditOrderModal(false); setSelectedPickUpOrCompletedOrCanceledOrderID(false); }} companyOperation={companyOperation} orderToEdit={editOrderModal} setOrderToEdit={setEditOrderModal} getShiftOperationData={() => getShiftOperationData()} />
            </div>}

            {seeOrderResumeModal && <div className='myModal' >
                <OrderResumeModal close={() => setSeeOrderResumeModal(false)} orderToEdit={seeOrderResumeModal} companyOperation={companyOperation} getShiftOperationData={() => getShiftOperationData()} />
            </div>}
        </>
    );
}