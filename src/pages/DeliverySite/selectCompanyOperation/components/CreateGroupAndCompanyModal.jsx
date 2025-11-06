import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { createDefaultApiDemonstration } from "../../../../services/deliveryServices/AUserService";


export default function CreateGroupAndCompanyModal({ close, getShiftOperationData }) {
    const isPcV = useSelector((state) => state.view.isPcV);

    const [processing, setProcessing] = useState(false);

    async function handleCompleteOrders() {
        setProcessing(true);
        const response = await createDefaultApiDemonstration();

        console.log(response);
        if (response?.status === 204) {
            await getShiftOperationData();
            close();
        }

        setProcessing(false);
    }

    return (
        <>
            <div className='myModal' style={{ zIndex: 100 }} >
                <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "60%", maxHeight: "90%", zIndex: 10, fontSize: !isPcV ? '20px' : '26px', }}>

                    <span>Create Group and Company</span>
                    <span style={{ marginBottom: '20px', fontSize: !isPcV ? '14px' : '18px', color: 'rgba(255, 255, 255, 0.8)' }}>How its just a skills demonstration APP, click "Create", and we will create a defaults group and company for you.</span>

                    {!processing && <div className='flexRow' style={{ justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Cancel</button>

                        <button style={{ backgroundColor: 'rgba(167, 35, 12, 0)', border: "none", color: "#3d8602ff", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { handleCompleteOrders() }} disabled={processing}>Create</button>
                    </div>}

                    {processing && <div className='flexRow fullCenter ' style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}