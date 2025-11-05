import { use, useEffect, useState } from "react";
import { cancelOrder } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { orangeOne, redOne } from "../../../../../theme/Colors";


export default function CancelOrder({ close, companyOperationID, selectedOrderToCancel, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    async function handleCancelOrder() {
        setProcessing(true);

        const response = await cancelOrder(companyOperationID, selectedOrderToCancel?.id, localStorage.getItem('userLoggedEmail'), adminPassword, "User Don't want the order anymore");

        if (response.status === 200) {
            getShiftOperationData();
            close();
        } else {
            alert(`Error cancelling order ${response?.data ?? ''}`);
        }

        setProcessing(false);
    }

    return (
        <>
            <div className="modalInside" style={{ width: 'auto', padding: '20px', maxWidth: !isDesktopView ? "95%" : "80%", maxHeight: !isDesktopView ? "95%" : "90%", fontSize: !isDesktopView ? '20px' : '26px', fontWeight: 'bold' }}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '10px' }}>
                        <span>Cancel Order?</span>

                        <span style={{ color: 'rgba(45, 234, 28, 0.7)', fontSize: !isDesktopView ? '16px' : '22px', fontWeight: '500'}}>{selectedOrderToCancel?.tableNumberOrDeliveryOrPickup.charAt(0).toUpperCase() + selectedOrderToCancel?.tableNumberOrDeliveryOrPickup.slice(1)}</span>
                        <span style={{ fontSize: !isDesktopView ? '16px' : '22px', fontWeight: '500'}}>{selectedOrderToCancel ? `${selectedOrderToCancel?.orderNumberOnShift}` + (selectedOrderToCancel?.customer ? (" - " + selectedOrderToCancel?.customer.customerName) : (" - " + selectedOrderToCancel?.pickupName ?? "")) : ""} </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                        <input className="inputStandart" style={{ width: '90%', textAlign: "center" }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                            placeholder="Enter Admin Password" />
                        <span style={{ fontSize: '14px', color: 'rgba(200,200,200, 1)' }}>* If never Setted, default password "1234"</span>
                    </div>

                    {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                        <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: 'gray', fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Return</button>

                        <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                            onClick={() => { handleCancelOrder() }} disabled={processing}>Cancel Order</button>
                    </div>}

                    {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}