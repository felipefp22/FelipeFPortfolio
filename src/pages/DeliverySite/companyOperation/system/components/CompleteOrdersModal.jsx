import { use, useEffect, useState } from "react";
import { cancelOrder, completeOrders } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { greenOne, redOne } from "../../../../../theme/Colors";


export default function CompleteOrdersModal({ close, companyOperationID, selectedOnDeliveryOrderID, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
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
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '20px', maxWidth: !isDesktopView ? "95%" : "80%", maxHeight: !isDesktopView ? "95%" : "90%", overflowY: "auto", fontSize: !isDesktopView ? '20px' : '26px', fontWeight: 'bold' }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '0px' }}>
                            <span>Complete Orders?</span>
                            {orders?.filter(order => selectedOnDeliveryOrderID?.includes(order.id)).map((order, i) => (
                                <div key={i}>
                                    {/* <span style={{ fontSize: !isDesktopView ? '16px' : '22px', fontWeight: '500' }}>{order} </span> */}
                                    <span style={{ fontSize: !isDesktopView ? '16px' : '22px', fontWeight: '500' }}>{order ? `${order?.orderNumberOnShift}` + (order?.customer ? (" - " + order?.customer.customerName) : (" - " + order?.pickupName ?? "")) : ""} </span>
                                </div>
                            ))}

                            <span style={{ color: 'rgba(255, 255, 255, 1)' }}>{selectedOnDeliveryOrderID.map(orderID => {
                                const order = orders.find(o => o.id === orderID);
                                return order ? `${order.orderNumberOnShift} - ${order.customer?.customerName || order.pickupName || "No Name"}` : null;
                            }).filter(Boolean).join(", ")}</span>
                        </div>

                        {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '0px' }}>
                            <button className="buttomDarkGray" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px', margin: '5px 30px' }}
                                onClick={() => { close(); }} disabled={processing}>Cancel</button>

                            <button className="buttomDarkGray" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px', margin: '5px 30px' }}
                                onClick={() => { handleCompleteOrders() }} disabled={processing}>Complete Orders</button>
                        </div>}

                        {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '0px' }}>
                            <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}