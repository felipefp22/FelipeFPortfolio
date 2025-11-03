import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, greenOne, redOne, transparentCavasOne } from "../../../../../../theme/Colors";
import { hireEmployeeService, updateEmployeePositionService } from "../../../../../../services/deliveryServices/EmployeeService";
import avatar from '../../../../../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { findPersonByEmailService } from "../../../../../../services/deliveryServices/SocialService";


export default function EditEmployee({ close, companyData, employeeData, positionsOpts, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    const [position, setPosition] = useState(positionsOpts.find((opt) => opt.toLowerCase() === employeeData?.position?.toLowerCase()) || "");

    const [userFoundData, setUserFoundData] = useState(null);

    useEffect(() => {
        console.log("CompanyID: ", companyData?.id);
    }, []);

    async function handleFireEmployee() {
        setProcessing(true);
        const response = await findPersonByEmailrvice(emailToInvite);
        if (response?.status === 200) {
            setUserFoundData(response?.data);
        } else {
            alert(`Error finding person: ${response?.data}`);
        }
        setProcessing(false);
    }


    async function handleChangePosition() {
        if(position.toLowerCase() === employeeData?.position?.toLowerCase()) return;

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
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ padding: '20px', minWidth: '300px', maxWidth: !isDesktopView ? "95%" : "600px", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '30px', fontSize: !isDesktopView ? '20px' : '26px', }}>
                        <span style={{ color: borderColorTwo(theme) }}>{`${companyData?.companyName || "Company"}`}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 20, border: `1px solid ${borderColorTwo(theme)}`, borderRadius: '6px', padding: '20px', cursor: 'pointer' }}
                        onClick={() => { console.log("Clicked employee") }}>

                        <img src={employeeData?.urlProfilePhoto ?? avatar} alt="Logo" style={{
                            width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                            borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold' }}> {employeeData ? `${employeeData?.employeeName} - ${employeeData?.employeeEmail}` : `"Find a Person"`}</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }} >
                        <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', }}>Position: </span>
                        <select className="inputOne" value={position || ""} onChange={(e) => setPosition(e.target.value)} style={{ maxWidth: '220px', padding: '5px', borderRadius: '6px', textAlign: 'center' }} >
                            {!position && <option value="">Select position</option>}
                            {positionsOpts.map((value, index) => (
                                <option key={index} value={value}>
                                    {value}
                                </option>
                            ))}
                        </select>
                    </div>

                    {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: '50px', marginTop: '10px' }}>
                        <button className="buttomDarkGray" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Return</button>

                        <button className="buttomDarkGray" style={{
                            backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px',
                            cursor: (position.toLowerCase() === employeeData?.position?.toLowerCase()) ? 'not-allowed' : 'pointer', opacity: (position.toLowerCase() === employeeData?.position?.toLowerCase()) ? 0.5 : 1,
                        }}
                            onClick={() => { handleChangePosition() }} disabled={processing || (position.toLowerCase() === employeeData?.position?.toLowerCase())}>Update</button>
                    </div>}

                    {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}