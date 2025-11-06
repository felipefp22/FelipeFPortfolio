import { use, useEffect, useState } from "react";
import { cancelOrder } from "../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, greenOne, orangeOne, redOne } from "../../../../theme/Colors";
import { openNewShift } from "../../../../services/deliveryServices/ShiftService";


export default function OpenShiftModal({ close, openShiftModal, setCompanyToOperate }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const isOwnerOrManager = ((openShiftModal?.ownerID && openShiftModal?.ownerID === localStorage.getItem('userLoggedEmail') || (openShiftModal?.position && openShiftModal?.position === 'MANAGER')));

    async function handleOpenShift() {
        setProcessing(true);

        const response = await openNewShift(openShiftModal.id);

        if (response.status === 200) {
            setCompanyToOperate(openShiftModal.id);
            close();
        } else {
            alert(`Error opening new shift on server${response?.data ? `: ${response?.data}` : ''}`);
        }

        setProcessing(false);
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", zIndex: 10, fontSize: !isPcV ? '20px' : '26px', }}>
                    <div>
                        <div className="flexColumn fullCenter" style={{ lineHeight: 1.8, marginBottom: '10px' }}>
                            <span>Open new Shift?</span>

                            {isOwnerOrManager && <span style={{ margin: 10, fontSize: '15px' }}> {"Open to - "} <span style={{ color: blueOne(theme) }}>{openShiftModal?.companyName}</span></span>}
                            {isOwnerOrManager && <span style={{ marginBottom: 10, fontSize: '15px' }}> {"Will be - "} <span style={{ color: blueOne(theme) }}>{`Shift ${openShiftModal?.lastOrOpenShift ? Number(openShiftModal?.lastOrOpenShift.shiftNumber) + 1 : 1}`}</span></span>}
                            {!isOwnerOrManager && <span style={{ margin: 10, fontSize: '15px', color: blueOne(theme) }}>{`Just Owner or Manager can Open Shift`}</span>}

                        </div>

                        {/* <div className="flexColumn fullCenter">
                            <input className="inputStandart" style={{ width: '90%', height: '38px' }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                                placeholder="Enter Admin Password" />
                            <span style={{ fontSize: '14px', color: 'rgba(200,200,200,0.7)' }}>* If never Setted, default password "1234"</span>
                        </div> */}

                        {!processing && <div className="flexRow" style={{ justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                                onClick={() => { close(); }} disabled={processing}>Return</button>

                            {isOwnerOrManager && <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px' }}
                                onClick={() => { handleOpenShift() }} disabled={processing}>Open new Shift</button>}
                        </div>}

                        {processing && <div className="flexRow fullCenter" style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                            <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}