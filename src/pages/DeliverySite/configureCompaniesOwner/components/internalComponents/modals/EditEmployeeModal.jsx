import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne } from "../../../../../../theme/Colors";
import { fireEmployeeService, hireEmployeeService, updateEmployeePositionService } from "../../../../../../services/deliveryServices/EmployeeService";
import avatar from '../../../../../../assets/noProfilePhoto.png';


export default function EditEmployeeModal({ close, companyData, employeeData, positionsOpts, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [fireConfirmationShow, setFireConfirmationShow] = useState(false);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    const [position, setPosition] = useState(positionsOpts.find((opt) => opt.toLowerCase() === employeeData?.position?.toLowerCase()) || "");

    const [emailConfirmationToFire, setEmailConfirmationToFire] = useState("");

    useEffect(() => {
        console.log("CompanyID: ", companyData?.id);
    }, []);

    async function handleFireEmployee() {
        if (!emailConfirmationToFire || emailConfirmationToFire !== employeeData?.employeeEmail) {
            alert("Employee email needs to match to confirm");
            return;
        }

        setProcessing(true);
        const response = await fireEmployeeService(companyData?.id, employeeData?.employeeEmail);
        if (response?.status === 200) {
            fetchCompanyData();
            close();
        } else {
            alert(`Error finding person: ${response?.data}`);
        }
        setProcessing(false);
    }


    async function handleChangePosition() {
        if (position.toLowerCase() === employeeData?.position?.toLowerCase()) return;

        const response = await updateEmployeePositionService(companyData?.id, employeeData?.employeeEmail, position.toUpperCase());
        if (response?.status === 200) {
            fetchCompanyData();
            close();
        } else {
            alert(`Error updating employee position: ${response?.data}`);
        }
    }

    return (
        <>
            <div className='modalInside' style={{ padding: '20px', minWidth: '300px', maxWidth: !isPcV ? "95%" : "600px", maxHeight: !isPcV ? "95%" : "90%", }}>
                <div className='flexColumn fullCenter' style={{ fontSize: !isPcV ? '20px' : '26px', }}>
                    <span style={{ color: borderColorTwo(theme) }}>{`${companyData?.companyName || "Company"}`}</span>
                </div>

                <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center',  border: `1px solid ${borderColorTwo(theme)}`, borderRadius: '6px', padding: '20px', marginTop: '20px' }} >

                    <div className='flexRow' >
                        <img src={employeeData?.urlProfilePhoto ?? avatar} alt="Logo" style={{
                            width: isPcV ? 40 : 35, height: isPcV ? 40 : 35,
                            borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                        }} />
                        <div className='flexRow' style={{ alignItems: 'center' }}>
                            <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold' }}> {employeeData ? `${employeeData?.employeeName} - ${employeeData?.employeeEmail}` : `Error`}</span>
                        </div>
                    </div>

                    <div className='flexRow' style={{ cursor: 'pointer' }} onClick={() => { setFireConfirmationShow(true) }} >
                        <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold', color: redOne(theme) }}> {`Fire`}</span>
                    </div>
                </div>

                <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'center', marginTop: 20, marginBottom: '10px' }} >
                    <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', }}>Position: </span>
                    <select className='inputStandart' value={position || ""} onChange={(e) => setPosition(e.target.value)} style={{ maxWidth: '220px', padding: '5px', borderRadius: '6px', textAlign: 'center' }} >
                        {!position && <option value="">Select position</option>}
                        {positionsOpts.map((value, index) => (
                            <option key={index} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                {!processing && <div className='flexRow spaceBetweenJC' style={{ marginTop: '10px' }}>
                    <button className='buttonStandart' style={{ background: 'none', border: "none", color: redOne(theme) }} onClick={() => { close(); }} disabled={processing}>Return</button>

                    <button className='buttonStandart' style={{
                        background: 'none', border: "none", color: greenOne(theme),
                        cursor: (position.toLowerCase() === employeeData?.position?.toLowerCase()) ? 'not-allowed' : 'pointer', opacity: (position.toLowerCase() === employeeData?.position?.toLowerCase()) ? 0.5 : 1,
                    }}
                        onClick={() => { handleChangePosition() }} disabled={processing || (position.toLowerCase() === employeeData?.position?.toLowerCase())}>Update</button>
                </div>}

                {processing && <div className='flexRow fullCenter' style={{  marginTop: '10px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>

            {fireConfirmationShow && <div className='myModal underDeliveryLayout' >
                <div className='modalInside' style={{ padding: '20px', minWidth: '300px', maxWidth: !isPcV ? "80%" : "500px", maxHeight: !isPcV ? "95%" : "90%", }}>

                    <div className='flexColumn fullCenter' style={{ marginBottom: '10px', fontSize: !isPcV ? '20px' : '26px', }}>
                        <span style={{ color: fontColorOne(theme) }}>{`${employeeData?.employeeName} - ${employeeData?.employeeEmail}`}</span>
                        <span style={{ color: borderColorTwo(theme) }}>{`Sure to fire ${employeeData?.employeeName} ?`}</span>
                    </div>

                    <div className='flexColumn' style={{ justifyContent: 'left', alignItems: 'center', maxWidth: '550px' }} >
                        <input className='inputStandart' style={{ textAlign: 'center' }} type="email" autoCapitalize="none" value={emailConfirmationToFire} onChange={(e) => { setEmailConfirmationToFire(e.target.value); e.target.setCustomValidity(''); }}
                            onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} />
                        <span style={{ color: fontColorOne(theme), opacity: 0.8, fontSize: '12px' }}>{`*Type email to confirm`}</span>

                        <div className='flexRow spaceBetweenJC' style={{ marginTop: '10px', width: '100%' }}>
                            <button className='buttonStandart' style={{ background: 'none', border: "none", color: 'gray', }} onClick={() => { setFireConfirmationShow(false); }} disabled={processing}>Cancel</button>

                            <button className='buttonStandart' type="submit" style={{ background: 'none', border: 'none', color: redOne(theme), cursor: !emailConfirmationToFire ? 'not-allowed' : 'pointer', opacity: !emailConfirmationToFire ? 0.5 : 1, }}
                                disabled={processing || !emailConfirmationToFire} onClick={() => { handleFireEmployee(); }}>Fire</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}