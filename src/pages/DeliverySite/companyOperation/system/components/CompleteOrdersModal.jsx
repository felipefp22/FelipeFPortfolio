import { useState } from "react";
import { completeOrders } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { greenOne, redOne } from "../../../../../theme/Colors";
import { useTranslation } from 'react-i18next';


export default function CompleteOrdersModal({ close, companyOperationID, selectedOnDeliveryOrderID, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const orders = useSelector((state) => state.companyOperation.orders);
    const { t } = useTranslation();

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
                        <span>{t('rSys.phrases.finishOrder')}?</span>

                        <span style={{ fontSize: isPcV ? 22 : 16, fontWeight: '500', }}>{selectedOnDeliveryOrderID.map(orderID => {
                            const order = orders.find(o => o.id === orderID);
                            return order ? `${order.orderNumberOnShift} - ${order.customer?.customerName || order.pickupName || "No Name"}` : null;
                        }).filter(Boolean).join(", ")}</span>
                    </div>

                    {!processing && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '20px' }}>
                        <button className='buttonNoBgNoBorder fontRed' style={{ marginRight: '20px' }} 
                            onClick={() => { close(); }} disabled={processing}>{t('buttons.cancel')}</button>

                        <button className='buttonNoBgNoBorder fontGreen' 
                            onClick={() => { handleCompleteOrders() }} disabled={processing}>{t('buttons.finishOrders')}</button>
                    </div>}

                    {processing && <div className='flexRow fullCenter' style={{ marginTop: '20px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}