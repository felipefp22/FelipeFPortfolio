import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { borderColorTwo, fontColorOne, greenOne, greenTwo, redOne } from '../../../../../../theme/Colors';
import { closeOrder, completeOrders } from '../../../../../../services/deliveryServices/OrderService';
import { Spinner } from 'react-bootstrap';


export default function OrderResumeModal({ close, orderToEdit, companyOperation, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const [disabled, setDisabled] = useState(false);

    async function handleCompleteOrders() {
        setDisabled(true);

        const response = await completeOrders(companyOperation?.companyOperationID, orderToEdit?.id);

        if (response?.status === 200) {
            await getShiftOperationData();
            closeAll();
        } else {
            alert(`Error closing order: ${response?.data}`);
        }
        setDisabled(false);
    }

    // useEffect(() => {
    //     console.log('Order Resume: ', orderToEdit);
    // }, []);

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "85%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>

                <span style={{ fontSize: isPcV ? '27px' : '20px', fontWeight: '600', color: fontColorOne(theme) }}>{`Order - ${orderToEdit?.orderNumberOnShift}`}</span>
                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: '600', color: borderColorTwo(theme) }}>{`${orderToEdit?.customer ? orderToEdit?.customer?.customerName : orderToEdit?.pickupName ?? ''}`}</span>
                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: '600', color: greenTwo(theme) }}>
                    {`${orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' ? 'Delivery' : (orderToEdit?.tableNumberOrDeliveryOrPickup === 'pickup' ? 'PickUp' : 'Table - ' + orderToEdit?.tableNumberOrDeliveryOrPickup)}`}</span>

                <br />

                <div className='flexRow fullCenter'>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginRight: '10px', color: fontColorOne(theme) }}>{`Price: `}</span>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', color: greenTwo(theme) }}>{`$ ${Number(orderToEdit?.price ?? 0).toFixed(2)}`}</span>
                </div>
                {orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' && <div className='flexRow fullCenter'>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginRight: '10px', color: fontColorOne(theme) }}>{`Delivery Tax: `}</span>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', color: greenTwo(theme) }}>{`$ ${Number(orderToEdit?.deliveryTax ?? 0).toFixed(2)}`}</span>
                </div>}

                <div className='flexRow fullCenter'>
                    {((orderToEdit?.tableNumberOrDeliveryOrPickup !== 'delivery' && orderToEdit?.tableNumberOrDeliveryOrPickup !== 'pickup') ||
                        (orderToEdit?.tableNumberOrDeliveryOrPickup === 'delivery' && companyOperation?.deliveryHasServiceTax) || (orderToEdit?.tableNumberOrDeliveryOrPickup === 'pickup' && companyOperation?.pickupHasServiceTax)) &&
                        <div className='flexColumn' >
                            < div className='flexRow fullCenter'>
                                <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginRight: '10px', color: fontColorOne(theme) }}>{`Service Tax: `}</span>
                                <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', color: greenTwo(theme) }}>{`$ ${Number(orderToEdit?.serviceTax).toFixed(2)}`}</span>
                            </div>
                        </div>}
                </div>

                <br />

                {orderToEdit?.status !== 'CANCELLED' && <div className='flexRow fullCenter'>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginRight: '10px', color: fontColorOne(theme) }}>{`Total Price: `}</span>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', color: greenTwo(theme) }}>{`$ ${Number(orderToEdit?.totalPrice ?? 0).toFixed(2)}`}</span>
                </div>}


                {orderToEdit?.status === 'PAID' && <div className='flexColumn fullCenter'>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginRight: '10px', color: greenTwo(theme) }}>{`[ PAID ]`}</span>
                </div>}

                {orderToEdit?.status === 'CANCELLED' && <div className='flexColumn fullCenter'>
                    <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginRight: '10px', color: redOne(theme) }}>{`[ CANCELLED ]`}</span>
                </div>}

                {!disabled && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '15px' }}>
                    <button className='buttonStandart' style={{ background: 'none', border: 'none' }} onClick={() => close()} disabled={disabled}>
                        {'Done'}</button>

                    {(orderToEdit?.status === 'OPEN' || orderToEdit?.status === 'CLOSEDWAITINGPAYMENT') &&
                        <button className='buttonStandart' style={{ background: 'none', border: 'none', color: greenOne(theme) }} onClick={() => { if (orderToEdit?.status === 'OPEN') dispatchOrders(); orderToEdit?.status === 'CLOSEDWAITINGPAYMENT' && handleCompleteOrders(); }} disabled={disabled}>{orderToEdit?.status === 'OPEN' ? 'Close Order' : 'Finish Order'}</button>}
                </div>}

                {disabled && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: '15px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div >
        </>
    );
}