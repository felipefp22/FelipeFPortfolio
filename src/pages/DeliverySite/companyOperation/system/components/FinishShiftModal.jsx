import { use, useEffect, useState } from "react";
import { cancelOrder } from "../../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, greenOne, orangeOne, redOne } from "../../../../../theme/Colors";
import { endShift, openNewShift } from "../../../../../services/deliveryServices/ShiftService";


export default function FinishShiftModal({ close, finishShift, companySelected, requesterAreOwnerOrManager }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const currentShiftData = useSelector((state) => state.companyOperation.currentShift);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    async function handleFinishShift() {
        setProcessing(true);

        const response = await endShift(companySelected, currentShiftData?.id, adminPassword);

        if (response.status === 200) {
            finishShift();
        } else {
            if (response.data === "invalidAdminPassword") {
                alert("Invalid Admin Password.");
            } else {
                alert("Server error close shift, try again.");
            }
        }

        setProcessing(false);
    }


    function formatDateToDayMonth(date) {
        const d = new Date(date);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

        const day = String(local.getDate()).padStart(2, '0');
        const month = String(local.getMonth() + 1).padStart(2, '0');
        const hours = String(local.getHours()).padStart(2, '0');
        const minutes = String(local.getMinutes()).padStart(2, '0');
        return `${day}/${month} - ${hours}:${minutes}`;
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '10px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", fontSize: !isPcV ? '20px' : '26px', fontWeight: 'bold' }}>
                {requesterAreOwnerOrManager && <div className='flexColumn fullCenter'>
                    <div className='flexColumn fullCenter' style={{ marginBottom: '20px', lineHeight: 1.8 }}>
                        <span >Finish Shift?</span>

                        <span style={{ fontSize: '15px' }}> {"From - "} <span style={{ color: blueOne(theme) }}>{formatDateToDayMonth(currentShiftData?.startTimeUTC)}</span></span>
                        <span style={{ fontSize: '15px' }}> {"To - "} <span style={{ color: blueOne(theme) }}>{formatDateToDayMonth(new Date(Date.now() + new Date().getTimezoneOffset() * 60000))}</span></span>
                    </div>

                    <div className='flexColumn fullCenter'>
                        <input className='inputStandart' style={{ textAlign: "center" }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                            placeholder="Enter Admin Password" />
                        <span style={{ fontSize: '14px', color: 'rgba(200,200,200,0.7)' }}>* If never Setted, default password "1234"</span>
                    </div>

                    {!processing && <div className='flexRow' style={{ justifyContent: 'space-between', width: '100%', marginTop: '10px' }}>
                        <button className='buttomStandart' style={{ background: 'none', border: "none", color: redOne(theme), fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Return</button>

                        <button className='buttomStandart' style={{ background: 'none', border: "none", color: greenOne(theme), fontSize: '16px' }}
                            onClick={() => { handleFinishShift() }} disabled={processing}>Finish Shift</button>
                    </div>}

                    {processing && <div className='flexRow'>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>}

                {!requesterAreOwnerOrManager && <div>
                    <div className='flexColumn fullCenter'>
                        <span style={{ fontSize: '18px' }}>Only Manager can Finish Shift</span>

                        <button className='buttomStandart' style={{ background: 'none', border: "none", color: greenOne(theme), fontSize: '16px', marginTop: '30px' }}
                            onClick={() => { close(); }} disabled={processing}>Ok</button>
                    </div>
                </div>}
            </div>
        </>
    );
}