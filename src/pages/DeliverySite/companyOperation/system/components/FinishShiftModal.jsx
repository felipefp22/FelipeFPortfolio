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
            <div className='myModal' style={{ zIndex: 100 }} >
                <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", zIndex: 10, fontSize: !isPcV ? '20px' : '26px', fontWeight: 'bold' }}>
                    {requesterAreOwnerOrManager && <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '10px' }}>
                            <span style={{ marginBottom: "10px" }}>Finish Shift?</span>

                            <span style={{ margin: 10, fontSize: '15px' }}> {"From - "} <span style={{ color: blueOne(theme) }}>{formatDateToDayMonth(currentShiftData?.startTimeUTC)}</span></span>
                            <span style={{ marginBottom: 10, fontSize: '15px' }}> {"To - "} <span style={{ color: blueOne(theme) }}>{formatDateToDayMonth(new Date(Date.now() + new Date().getTimezoneOffset() * 60000))}</span></span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                            <input className='inputStandart' style={{ justifyContent: 'center', textAlign: "center" }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                                placeholder="Enter Admin Password" />
                            <span style={{ fontSize: '14px', color: 'rgba(200,200,200,0.7)' }}>* If never Setted, default password "1234"</span>
                        </div>

                        {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className='buttomStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                                onClick={() => { close(); }} disabled={processing}>Return</button>

                            <button className='buttomStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px' }}
                                onClick={() => { handleFinishShift() }} disabled={processing}>Finish Shift</button>
                        </div>}

                        {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                            <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                        </div>}
                    </div>}

                    {!requesterAreOwnerOrManager && <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '10px' }}>
                            <span style={{ marginBottom: "10px" }}>Only Manager can Finish Shift</span>
                            <button className='buttomStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px' }}
                                onClick={() => { close(); }} disabled={processing}>Ok</button>
                        </div>
                    </div>}
                </div>
            </div>
        </>
    );
}