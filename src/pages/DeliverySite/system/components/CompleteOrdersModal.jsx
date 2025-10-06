import { use, useEffect, useState } from "react";
import { cancelOrder, completeOrders } from "../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";


export default function CompleteOrdersModal({ close, selectedOnDeliveryOrderID, getShiftOperationData }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);

    async function handleCompleteOrders() {
        setProcessing(true);
        await Promise.all(
            selectedOnDeliveryOrderID.map(orderID =>
                completeOrders(orderID)
            )
        );
        await getShiftOperationData();
        setProcessing(false);
        close();
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div style={{
                    display: 'flex', flexDirection: 'column', maxWidth: !isDesktopView ? "95%" : "80%", maxHeight: !isDesktopView ? "95%" : "90%", border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                    color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto", fontSize: !isDesktopView ? '20px' : '26px',
                }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '10px' }}>
                            <span>Complete Orders?</span>

                            <span style={{ color: 'rgba(255, 255, 255, 1)' }}>{selectedOnDeliveryOrderID.map(orderID => {
                                const order = orders.find(o => o.id === orderID);
                                return order ? `${order.orderNumberOnShift} - ${order.customer?.customerName || order.pickupName || "No Name"}` : null;
                            }).filter(Boolean).join(", ")}</span>
                        </div>

                        {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                                onClick={() => { close(); }} disabled={processing}>Cancel</button>

                            <button style={{ backgroundColor: 'rgba(167, 35, 12, 0)', border: "none", color: "#3d8602ff", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                                onClick={() => { handleCompleteOrders() }} disabled={processing}>Complete Orders</button>
                        </div>}

                        {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                            <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}