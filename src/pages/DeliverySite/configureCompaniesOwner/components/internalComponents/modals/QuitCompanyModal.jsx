import {  useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne } from "../../../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
import { quitCompanyService } from "../../../../../../services/deliveryServices/EmployeeService";


export default function QuitCompanyModal({ close, companyData, fetchUserInfos }) {
    const navigate = useNavigate();
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [processing, setProcessing] = useState(false);
    const wordToMatch = 'quit';
    const [wordConfirmationToQuit, setWordConfirmationToQuit] = useState("");

    async function handleQuitCompany() {
        if (!wordConfirmationToQuit || wordConfirmationToQuit !== wordToMatch) {
            alert(`You need to type "${wordToMatch}" to confirm`);
            return;
        }

        console.log("Quitting company ID: ", companyData?.id);
        setProcessing(true);
        const response = await quitCompanyService(companyData?.id);
        if (response?.status === 204) {
            fetchUserInfos();
            navigate(`/FelipeFPortfolio/delivery/ManageCompaniesWorkOn`);
            close();
        } else {
            alert(`Error denying invitation: ${response?.data}`);
        }

        setProcessing(false);
    }


    return (
        <>
            <div className='modalInside fullCenter' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", }} >
                <span style={{ fontSize: isPcV ? '22px' : '16px', fontWeight: '600', marginBottom: '10px', color: borderColorTwo(theme) }}>{`${companyData?.companyName}`}</span>

                <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: '600', marginBottom: '10px', color: fontColorOne(theme) }}>{`Sure to quit?`}</span>
                {/* <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: '600', marginBottom: '10px', color: fontColorOne(theme) }}>{` ${companyData?.position}`}</span> */}

                {!processing && <div className='flexColumn' style={{ justifyContent: 'left', alignItems: 'center', marginBottom: '10px', maxWidth: '550px' }} >
                    <input className='inputStandart' style={{ flexGrow: 1, textAlign: 'center' }} type="email" autoCapitalize="none" value={wordConfirmationToQuit} onChange={(e) => { setWordConfirmationToQuit(e.target.value); e.target.setCustomValidity(''); }}
                        onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} />
                    <span style={{ color: fontColorOne(theme), opacity: 0.8, fontSize: '12px' }}>{`Type "${wordToMatch}" to confirm`}</span>

                    <div className='flexRow' style={{ justifyContent: 'space-between', height: '50px', marginTop: '10px', width: '100%' }}>
                        <button className='buttonStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: 'gray', fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Cancel</button>

                        <button className='buttonStandart red' type="submit" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px',
                            cursor: (wordConfirmationToQuit !== wordToMatch) ? 'not-allowed' : 'pointer', opacity: (wordConfirmationToQuit !== wordToMatch) ? 0.5 : 1,
                        }} onClick={() => { handleQuitCompany(); }}
                            disabled={processing || wordConfirmationToQuit !== wordToMatch}>Quit</button>
                    </div>
                </div>}

                {processing && <div className='flexRow fullCenter' style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}