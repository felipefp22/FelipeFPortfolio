import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { closeOrder, reopenOrder } from "../../../../../services/deliveryServices/OrderService";
import { blueOne, fontColorOne, greenOne, redOne } from "../../../../../theme/Colors";

export default function ChangeOrderStatusModal({ close, companyOperation, selectedCookingOrderID, setSelectedCookingOrderID, selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID, getShiftOperationData, }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);
    const [deliverymanSelectedID, setDeliverymanSelectedID] = useState(null);


    async function dispatchOrders() {
        if (!deliverymanSelectedID) {
            alert("Please select a Delivery-Man");
            return;
        }

        setProcessing(true);
        await Promise.all(
            selectedCookingOrderID.map(orderID =>
                closeOrder(companyOperation?.companyOperationID, orderID, false, 0, deliverymanSelectedID)
            )
        );

        await getShiftOperationData();
        close();
        setProcessing(false);
    }

    async function openOrdersAgain() {
        setProcessing(true);
        await Promise.all(
            selectedOnDeliveryOrderID.map(orderID =>
                reopenOrder(companyOperation?.companyOperationID, orderID)
            )
        );
        await getShiftOperationData();
        close();
        setProcessing(false);
    }

    return (
        <>
            <div className='modalInside' style={{ maxWidth: isPcV ? "80%" : "85%", maxHeight: isPcV ? "90%" : "95%", fontSize: !isPcV ? '18px' : '22px', fontWeight: 'bold' }}>
                {selectedCookingOrderID.length > 0 && <div className='flexColumn fullCenter' style={{}}>
                    <span>Dispach to delivery?</span>

                    {orders?.filter(order => selectedCookingOrderID?.includes(order.id)).map((order, i) => (
                        <div key={i}>
                            {/* <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>{order} </span> */}
                            <span style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', color: blueOne(theme) }}>
                                {order ? `${order?.orderNumberOnShift}` + (order?.customer ? (" - " + order?.customer.customerName.split(" ")[0]) : (" - " + order?.pickupName?.split(" ")[0] ?? "")) : ""} </span>
                        </div>
                    ))}

                    <br />
                    <select className='inputStandart' value={deliverymanSelectedID || ""} onChange={(e) => setDeliverymanSelectedID(e.target.value)} style={{ fontSize: 16, flexGrow: 1, maxWidth: '520px', padding: '5px', borderRadius: '6px', textAlign: 'center' }} >
                        {!deliverymanSelectedID && <option value="">Select Delivery-Man</option>}
                        <optgroup label="Registered Users" style={{ color:blueOne(theme)}}>
                            {companyOperation?.employees?.filter(employee => employee.position === "DELIVERYMAN").map((value, index) => (
                                <option key={index} value={value.employeeEmail} style={{ color: fontColorOne(theme)}}>
                                    {value.employeeEmail}
                                </option>
                            ))}
                        </optgroup>
                        
                        <optgroup />

                        <optgroup label="Unregistered Users" style={{ color:blueOne(theme)}}>
                            {companyOperation?.noUserDeliveryMans?.map((value, index) => (
                                <option key={index} value={value} style={{ color: fontColorOne(theme)}}>
                                    {value}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                </div>}

                {selectedOnDeliveryOrderID.length > 0 && <div>
                    <span>Reopen Orders?</span>

                    {orders?.filter(order => selectedOnDeliveryOrderID?.includes(order.id)).map((order, i) => (
                        <div key={i}>
                            {/* <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>{order} </span> */}
                            <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500', color: blueOne(theme) }}>
                                {order ? `${order?.orderNumberOnShift}` + (order?.customer ? (" - " + order?.customer.customerName?.split(" ")[0]) : (" - " + order?.pickupName?.split(" ")[0] ?? "")) : ""} </span>
                        </div>
                    ))}
                </div>}

                {!processing && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: 15 }}>
                    <button className='buttonNoBgNoBorder fontRed' style={{ marginRight: '100px', fontSize: '16px' }}
                        onClick={() => { close(); }} disabled={processing}>Cancel</button>

                    <button className='buttonNoBgNoBorder fontGreen' style={{ fontSize: '16px' }}
                        onClick={() => { if (selectedCookingOrderID.length > 0) dispatchOrders(); if (selectedOnDeliveryOrderID.length > 0) openOrdersAgain(); }} disabled={processing}>Yes</button>
                </div>}

                {processing && <div className='flexRow fullCenter' style={{ width: '100%', marginTop: 15 }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}