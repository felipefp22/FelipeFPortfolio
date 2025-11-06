import { useState } from "react";
import { completeOrders } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { greenOne, redOne } from "../../../../../theme/Colors";


export default function CompleteOrdersModal({ close, companyOperationID, selectedOnDeliveryOrderID, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);

    async function handleCompleteOrders() {
        setProcessing(true);
        await Promise.all(
            selectedOnDeliveryOrderID.map(orderID =>
                completeOrders(companyOperationID, orderID)
            )
        );
        await getShiftOperationData();
        setProcessing(false);
        close();
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '10px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", overflowY: "auto", fontSize: !isPcV ? '20px' : '26px', fontWeight: 'bold' }}>
                <div>
                    <div className='flexColumn' >
                        <span>Complete Orders?</span>

                        <span style={{ fontSize: isPcV ? 22 : 16, fontWeight: '500', }}>{selectedOnDeliveryOrderID.map(orderID => {
                            const order = orders.find(o => o.id === orderID);
                            return order ? `${order.orderNumberOnShift} - ${order.customer?.customerName || order.pickupName || "No Name"}` : null;
                        }).filter(Boolean).join(", ")}</span>
                    </div>

                    {!processing && <div className='flexRow spaceBetween' style={{ width: '100%', marginTop: '20px' }}>
                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: redOne(theme), marginRight: '20px' }}
                            onClick={() => { close(); }} disabled={processing}>Cancel</button>

                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: greenOne(theme) }}
                            onClick={() => { handleCompleteOrders() }} disabled={processing}>Complete Orders</button>
                    </div>}

                    {processing && <div className='flexRow fullCenter' style={{ marginTop: '20px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}