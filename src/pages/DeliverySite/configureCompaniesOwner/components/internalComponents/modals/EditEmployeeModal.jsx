import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne } from "../../../../../../theme/Colors";
import { fireEmployeeService, hireEmployeeService, updateEmployeePositionService } from "../../../../../../services/deliveryServices/EmployeeService";
import avatar from '../../../../../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { findPersonByEmailService } from "../../../../../../services/deliveryServices/SocialService";


export default function EditEmployeeModal({ close, companyData, employeeData, positionsOpts, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

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
            <div className="modalInside" style={{ padding: '20px', minWidth: '300px', maxWidth: !isDesktopView ? "95%" : "600px", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '30px', fontSize: !isDesktopView ? '20px' : '26px', }}>
                    <span style={{ color: borderColorTwo(theme) }}>{`${companyData?.companyName || "Company"}`}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: 20, border: `1px solid ${borderColorTwo(theme)}`, borderRadius: '6px', padding: '20px', }} >

                    <div style={{ display: 'flex', flexDirection: 'row', }}>
                        <img src={employeeData?.urlProfilePhoto ?? avatar} alt="Logo" style={{
                            width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                            borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold' }}> {employeeData ? `${employeeData?.employeeName} - ${employeeData?.employeeEmail}` : `Error`}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer' }} onClick={() => { setFireConfirmationShow(true) }} >
                        <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold', color: redOne(theme) }}> {`Fire`}</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }} >
                    <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', }}>Position: </span>
                    <select className="inputStandart" value={position || ""} onChange={(e) => setPosition(e.target.value)} style={{ maxWidth: '220px', padding: '5px', borderRadius: '6px', textAlign: 'center' }} >
                        {!position && <option value="">Select position</option>}
                        {positionsOpts.map((value, index) => (
                            <option key={index} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '50px', marginTop: '10px' }}>
                    <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                        onClick={() => { close(); }} disabled={processing}>Return</button>

                    <button className="buttomStandart" style={{
                        backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px',
                        cursor: (position.toLowerCase() === employeeData?.position?.toLowerCase()) ? 'not-allowed' : 'pointer', opacity: (position.toLowerCase() === employeeData?.position?.toLowerCase()) ? 0.5 : 1,
                    }}
                        onClick={() => { handleChangePosition() }} disabled={processing || (position.toLowerCase() === employeeData?.position?.toLowerCase())}>Update</button>
                </div>}

                {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '50px', marginTop: '10px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>

            {fireConfirmationShow && <div className="myModal underDeliveryLayout" style={{ zIndex: 10000 }} >
                <div className="modalInside" style={{ padding: '20px', minWidth: '300px', maxWidth: !isDesktopView ? "95%" : "600px", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '30px', fontSize: !isDesktopView ? '20px' : '26px', }}>
                        <span style={{ color: fontColorOne(theme) }}>{`${employeeData?.employeeName} - ${employeeData?.employeeEmail}`}</span>
                        <span style={{ color: borderColorTwo(theme) }}>{`Sure to fire ${employeeData?.employeeName} ?`}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', alignItems: 'center', marginBottom: '10px', maxWidth: '550px' }} >
                        <input className="inputStandart" style={{ flexGrow: 1, textAlign: 'center' }} type="email" autoCapitalize="none" value={emailConfirmationToFire} onChange={(e) => { setEmailConfirmationToFire(e.target.value); e.target.setCustomValidity(''); }}
                            onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} />
                        <span style={{ color: fontColorOne(theme), opacity: 0.8, fontSize: '12px' }}>{`*Type email to confirm`}</span>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '50px', marginTop: '10px', width: '100%' }}>
                            <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: 'gray', fontSize: '16px' }}
                                onClick={() => { setFireConfirmationShow(false); }} disabled={processing}>Cancel</button>

                            <button className="buttomStandart red" type="submit" style={{
                                backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px',
                                cursor: !emailConfirmationToFire ? 'not-allowed' : 'pointer', opacity: !emailConfirmationToFire ? 0.5 : 1,
                            }} onClick={() => { handleFireEmployee(); }}
                                disabled={processing || !emailConfirmationToFire}>Fire</button>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
}