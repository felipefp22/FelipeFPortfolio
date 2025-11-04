import { use, useEffect, useRef, useState } from "react";
import { Form, Spinner, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal.jsx";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faCircleDown, faCircleUp, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import CancelOrder from "./components/CancelOrderModal.jsx";
import CompleteOrdersModal from "./components/CompleteOrdersModal.jsx";
import ChangeOrderStatusModal from "./components/ChangeOrderStatusModal.jsx";
import { blueOne, borderColorTwo, fontColorOne, redOne, secondColor, secondColorInverse } from "../../../../theme/Colors.js";
import { isOwnerOrManagerOrSupervisor } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import { isOwnerOrManager } from "../../../../services/deliveryServices/auxServices/IsOwnerOrManegerService,js";
import tableGreen from "../../../../assets/tableGreen.png";
import tableYellow from "../../../../assets/tableYellow.png";
import tableRed from "../../../../assets/tableRed.png";
import tableBlue from "../../../../assets/tableBlue.png";

export default function SystemPageHall({ screenOnFocus, setHaveModalOpen, getShiftOperationData }) {
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


    const [inputSearchTable, setInputSearchTable] = useState("")

    const [selectedTable, setSelectedTable] = useState(null);

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

    // useEffect(() => {
    //     console.log("selectedTable", selectedTable);
    // }, [selectedTable]);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, paddingTop: '8px', paddingLeft: '3px', overflowY: 'auto', }}>
                {screenOnFocus !== "map" && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', }}>
                    <button className="buttomDarkGray" style={{ marginBottom: '20px', marginLeft: '0px', }}
                        onClick={() => { setNewOrderModal(true); setHaveModalOpen(true); }}>New Order</button>
                </div>}

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '300px', maxHeight: '80%', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', padding: 3, overflowY: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <input type="number" className="inputOne" value={inputSearchTable} onChange={(e) => setInputSearchTable(e.target.value)} placeholder=""
                            style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)', overflow: 'hidden', textAlign: 'center' }} />

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', width: '100%', overflowY: 'auto', flexWrap: 'wrap', }}>
                            {Array.from({ length: companyOperation?.numberOfTables }).map((_, idx) => {
                                const tableNumber = idx + 1; // tables start from 1
                                const matchesSearch =
                                    !inputSearchTable || String(tableNumber).includes(String(inputSearchTable));

                                if (!matchesSearch) return null;

                                let tableColorImage = tableGreen;
                                if (companyOperation?.orders?.some(order => String(order.tableNumberOrDeliveryOrPickup) === String(tableNumber) && (order.status === "OPEN"))) tableColorImage = tableYellow;
                                if (companyOperation?.orders?.some(order => String(order.tableNumberOrDeliveryOrPickup) === String(tableNumber) && (order.status === "CLOSEDWAITINGPAYMENT"))) tableColorImage = tableRed;

                                return (
                                    <div key={idx} style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', width: isDesktopView ? '90px' : '65px', height: isDesktopView ? "104px" : "84px", margin: 5, cursor: 'pointer',
                                        borderRadius: '5px', backgroundColor: (tableNumber === selectedTable) ? 'lightblue' : 'transparent'
                                    }} onClick={() => { setSelectedTable(tableNumber); }}>
                                        <img src={tableColorImage} alt={""} style={{ width: isDesktopView ? '80px' : '60px', height: isDesktopView ? '80px' : '60px', objectFit: 'cover', borderRadius: '5px', }} />
                                        <span style={{ color: 'black', fontWeight: 'bold', fontSize: "16px", textAlign: 'center' }}>{`${tableNumber}`}</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <br />
                    <span style={{ color: blueOne(theme), fontWeight: 'bold', fontSize: "20px", textAlign: 'center' }}>{`*** Still on Development ***`}</span>

                </div >
            </div>

            {newOrderModal && <div ref={newOrderModalRef} className="myModal" style={{}} >
                <NewOrderModal close={() => { setNewOrderModal(false); }} companyOperation={companyOperation} getShiftOperationData={getShiftOperationData} tableNumberSelectedBeforeModal={selectedTable} />
            </div>}
        </>
    );
}