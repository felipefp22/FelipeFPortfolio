import { use, useEffect, useState } from "react";
import { cancelOrder } from "../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";


export default function CancelOrder({ close, selectedOrderToCancel, getShiftOperationData }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    async function handleCancelOrder() {
        setProcessing(true);

        const response = await cancelOrder(selectedOrderToCancel?.id, localStorage.getItem('userLoggedEmail'), adminPassword, "User Don't want the order anymore");

        if (response.status === 200) {
            getShiftOperationData();
            close();
        }

        setProcessing(false);
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '20px',  maxWidth: !isDesktopView ? "95%" : "80%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, fontSize: !isDesktopView ? '20px' : '26px', }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '10px' }}>
                            <span>Cancel Order?</span>

                            <span style={{ color: 'rgba(45, 234, 28, 0.7)' }}>{selectedOrderToCancel?.tableNumberOrDeliveryOrPickup.charAt(0).toUpperCase() + selectedOrderToCancel?.tableNumberOrDeliveryOrPickup.slice(1)}</span>
                            <span>{selectedOrderToCancel ? `${selectedOrderToCancel?.orderNumberOnShift}` + (selectedOrderToCancel?.customer ? (" - " + selectedOrderToCancel?.customer.customerName) : (" - " + selectedOrderToCancel?.pickupName ?? "")) : ""} </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                        <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '38px' }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                            placeholder="Enter Admin Password" />
                            <span style={{ fontSize: '14px', color: 'rgba(200,200,200,0.7)' }}>* If never Setted, default password "1234"</span>
                        </div>

                        {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                                onClick={() => { close(); }} disabled={processing}>Return</button>

                            <button style={{ backgroundColor: 'rgba(167, 35, 12, 0)', border: "none", color: "rgba(249, 140, 24, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                                onClick={() => { handleCancelOrder() }} disabled={processing}>Cancel Order</button>
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