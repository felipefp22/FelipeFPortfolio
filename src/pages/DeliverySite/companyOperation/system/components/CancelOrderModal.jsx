import { use, useEffect, useState } from "react";
import { cancelOrder } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { orangeOne, redOne } from "../../../../../theme/Colors";


export default function CancelOrder({ close, closeFromCancel, companyOperationID, selectedOrderToCancel, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const orders = useSelector((state) => state.companyOperation.orders);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    async function handleCancelOrder() {
        setProcessing(true);

        const response = await cancelOrder(companyOperationID, selectedOrderToCancel?.id, localStorage.getItem('userLoggedEmail'), adminPassword, "User Don't want the order anymore");

        if (response.status === 200) {
            getShiftOperationData();
            closeFromCancel();
        } else {
            alert(`Error cancelling order ${response?.data ?? ''}`);
        }

        setProcessing(false);
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", fontSize: !isPcV ? '20px' : '26px', fontWeight: 'bold' }}>
                <div>
                    <div className='flexColumn fullCenter' >
                        <span>Cancel Order?</span>

                        <span style={{ color: 'rgba(45, 234, 28, 0.7)', fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>
                            {selectedOrderToCancel?.tableNumberOrDeliveryOrPickup.charAt(0).toUpperCase() + selectedOrderToCancel?.tableNumberOrDeliveryOrPickup.slice(1)}</span>

                        <span style={{ fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}>
                            {selectedOrderToCancel ? `${selectedOrderToCancel?.orderNumberOnShift}` + (selectedOrderToCancel?.customer ? (" - " + selectedOrderToCancel?.customer.customerName) : (" - " + selectedOrderToCancel?.pickupName ?? "")) : ""} </span>
                    </div>

                    <div className='flexColumn fullCenter' >
                        <input className='inputStandart' onFocus={(e) => e.target.setAttribute("autoComplete", "none")} style={{ width: '90%', textAlign: "center" }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                            placeholder="Enter Admin Password" />
                        <span style={{ fontSize: '14px', color: 'rgba(200,200,200, 1)' }}>* If never Setted, default password "1234"</span>
                    </div>

                    {!processing && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '20px' }}>
                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: 'gray', fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Return</button>

                        <button className='buttonStandart' style={{ background: 'none', border: "none", color: redOne(theme), fontSize: '16px' }}
                            onClick={() => { handleCancelOrder() }} disabled={processing}>Cancel Order</button>
                    </div>}

                    {processing && <div className='flexRow fullCenter' style={{ width: '100%', marginTop: '20px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}