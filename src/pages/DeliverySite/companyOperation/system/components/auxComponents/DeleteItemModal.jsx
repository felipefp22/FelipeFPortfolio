import { useSelector } from 'react-redux';
import { removeItemsFromOrderService } from '../../../../../../services/deliveryServices/OrderService';
import { redOne } from '../../../../../../theme/Colors';
import { Spinner } from 'react-bootstrap';
import { useState } from 'react';



export function DeleteItemModal({ close, companyOperation, orderToEdit, ordemItemToRemove, getShiftOperationData, }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [disabled, setDisabled] = useState(false);

    async function handleRemoveItemsFromOrder() {
        setDisabled(true);

        const response = await removeItemsFromOrderService(companyOperation?.companyOperationID, orderToEdit?.id, [ordemItemToRemove?.id]);

        if (response?.status === 200) {
            await getShiftOperationData();
            close();
        }

        setDisabled(false);
    }


    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "85%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>
                <div className='flexColumn fullCenter' >
                    <span>Cancel Item?</span>

                    <span style={{ color: 'rgba(45, 234, 28, 0.7)', fontSize: !isPcV ? '16px' : '22px', fontWeight: '500' }}> {ordemItemToRemove?.name} </span>
                </div>

                {/* <div className='flexColumn fullCenter' >
                <input className='inputStandart' onFocus={(e) => e.target.setAttribute("autoComplete", "none")} style={{ width: '90%', textAlign: "center" }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                    placeholder="Enter Admin Password" />
                <span style={{ fontSize: '14px', color: 'rgba(200,200,200, 1)' }}>* If never Setted, default password "1234"</span>
            </div> */}

                {!disabled && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '20px' }}>
                    <button className='buttonNoBgNoBorder fontGray' onClick={() => { close(); }} disabled={disabled}>Return</button>

                    <button className='buttonNoBgNoBorder fontRed' onClick={() => { handleRemoveItemsFromOrder() }} disabled={disabled}>Cancel Item</button>
                </div>}

                {disabled && <div className='flexRow fullCenter' style={{ width: '100%', marginTop: '20px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}