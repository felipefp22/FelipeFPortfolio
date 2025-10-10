import { useEffect, useRef, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useSelector } from "react-redux";
import { closeOrder, reopenOrder } from "../../../../services/deliveryServices/OrderService";

export default function ChangeOrderStatusModal({ closeNewOrderModal, selectedCookingOrderID, setSelectedCookingOrderID, selectedOnDeliveryOrderID, setSelectedOnDeliveryOrderID, getShiftOperationData, }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [processing, setProcessing] = useState(false);

    
    async function dispatchOrders() {
        setProcessing(true);
        await Promise.all(
            selectedCookingOrderID.map(orderID =>
                closeOrder(orderID, false, 0)
            )
        );

        await getShiftOperationData();
        closeNewOrderModal();
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
        closeNewOrderModal();
        setProcessing(false);
    }

    return (
        <>
            <div className="modalInside" style={{ width: 'auto', padding: '20px', maxWidth: !isDesktopView ? "95%" : "45%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                {selectedCookingOrderID.length > 0 && <div>
                    <span>Dispach to delivery?</span>
                </div>}

                {selectedOnDeliveryOrderID.length > 0 && <div>
                    <span>Reopen Orders?</span>
                </div>}
                <br />

                {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                    <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                        onClick={() => { closeNewOrderModal(); }} disabled={processing}>Cancel</button>

                    <button style={{ backgroundColor: 'rgba(15, 107, 56, 0)', border: "none", color: "rgba(38, 233, 35, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                        onClick={() => { if (selectedCookingOrderID.length > 0) dispatchOrders(); if (selectedOnDeliveryOrderID.length > 0) openOrdersAgain(); }} disabled={processing}>Yes</button>
                </div>}

                {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}