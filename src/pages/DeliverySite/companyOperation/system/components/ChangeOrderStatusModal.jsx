import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { closeOrder, reopenOrder } from "../../../../../services/deliveryServices/OrderService";
import { greenOne, redOne } from "../../../../../theme/Colors";

export default function ChangeOrderStatusModal({ close, companyOperationID, selectedCookingOrderID, setSelectedCookingOrderID, selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID, getShiftOperationData, }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);


    async function dispatchOrders() {
        setProcessing(true);
        await Promise.all(
            selectedCookingOrderID.map(orderID =>
                closeOrder(companyOperationID, orderID, false, 0)
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
                reopenOrder(companyOperationID, orderID)
            )
        );
        await getShiftOperationData();
        close();
        setProcessing(false);
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", fontSize: !isPcV ? '20px' : '26px', fontWeight: 'bold' }}>
                {selectedCookingOrderID.length > 0 && <div>
                    <span>Dispach to delivery?</span>

                    {orders?.filter(order => selectedCookingOrderID?.includes(order.id)).map((order, i) => (
                        <div key={i}>
                            {/* <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>{order} </span> */}
                            <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>{order ? `${order?.orderNumberOnShift}` + (order?.customer ? (" - " + order?.customer.customerName) : (" - " + order?.pickupName ?? "")) : ""} </span>
                        </div>
                    ))}

                </div>}

                {selectedOnDeliveryOrderID.length > 0 && <div>
                    <span>Reopen Orders?</span>

                    {orders?.filter(order => selectedOnDeliveryOrderID?.includes(order.id)).map((order, i) => (
                        <div key={i}>
                            {/* <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>{order} </span> */}
                            <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>{order ? `${order?.orderNumberOnShift}` + (order?.customer ? (" - " + order?.customer.customerName) : (" - " + order?.pickupName ?? "")) : ""} </span>
                        </div>
                    ))}
                </div>}
                
                <br />

                {!processing && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '20px' }}>
                    <button className='buttonNoBgNoBorder fontRed' style={{ marginRight: '100px', fontSize: '16px' }}
                        onClick={() => { close(); }} disabled={processing}>Cancel</button>

                    <button className='buttonNoBgNoBorder fontGreen' style={{ fontSize: '16px'}}
                        onClick={() => { if (selectedCookingOrderID.length > 0) dispatchOrders(); if (selectedOnDeliveryOrderID.length > 0) openOrdersAgain(); }} disabled={processing}>Yes</button>
                </div>}

                {processing && <div className='flexRow fullCenter' style={{ width: '100%',  marginTop: '20px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}