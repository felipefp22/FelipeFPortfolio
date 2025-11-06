import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne } from "../../../../../../theme/Colors";
import { acceptCompanyInviteService, quitCompanyService } from "../../../../../../services/deliveryServices/EmployeeService";


export default function AcceptOrDenyWorksOnCompany({ close, companyData, fetchUserInfos }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    async function handleDenyInvitation() {
        console.log("Denying invitation to company ID: ", companyData?.companyID);
        const response = await quitCompanyService(companyData?.companyID);
        if (response?.status === 204) {
            fetchUserInfos();
            close();
        } else {
            alert(`Error denying invitation: ${response?.data}`);
        }
    }
    async function handleAcceptInvitation() {
        console.log("Accepting invitation to company ID: ", companyData?.companyID);
        const response = await acceptCompanyInviteService(companyData?.id);
        if (response?.status === 204) {
            fetchUserInfos();
            close();
        } else {
            alert(`Error accepting invitation: ${response?.data}`);
        }
    }

    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", fontSize: !isPcV ? '20px' : '26px', }}>
                <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginBottom: '10px', color: borderColorTwo(theme) }}>{`${companyData?.companyName}`}</span>

                <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: '600', marginBottom: '10px', color: fontColorOne(theme) }}>{`You received an invitation to work as:`}</span>
                <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: '600', marginBottom: '10px', color: fontColorOne(theme) }}>{` ${companyData?.position}`}</span>


                {/* <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}> */}
                {/* <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '38px' }} type="password" value={adminPassword} onChange={(e) => { setAdminPassword(e.target.value); }}
                            placeholder="Enter Admin Password" />
                            <span style={{ fontSize: '14px', color: 'rgba(200,200,200,0.7)' }}>* If never Setted, default password "1234"</span>
                        </div> */}

                {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                    <button className='buttomStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: fontColorOne(theme), fontSize: '16px' }}
                        onClick={() => { close(); }} disabled={processing}>Return</button>

                    <div>
                        <button className='buttomStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                            onClick={() => { handleDenyInvitation() }} disabled={processing}>Deny</button>
                        <button className='buttomStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px' }}
                            onClick={() => { handleAcceptInvitation() }} disabled={processing}>Accept</button>
                    </div>
                </div>}

                {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}