import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, greenOne, redOne } from "../../../../../../theme/Colors";
import { hireEmployeeService } from "../../../../../../services/deliveryServices/EmployeeService";


export default function AddEmployee({ close, companyData, companyID, positionsOpts }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    const [emailToInvite, setEmailToInvite] = useState("");
    const [position, setPosition] = useState("");

    useEffect(() => {
        console.log("CompanyID: ", companyID);
    }, []);

    async function handleAddEmployee() {
        const response = await hireEmployeeService(companyID, emailToInvite, position.toUpperCase());
        if (response?.status === 200) {

            close();
        } else {
            alert(`Error hiring employee: ${response?.data}`);
        }
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '20px', maxWidth: !isDesktopView ? "95%" : "80%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '30px', fontSize: !isDesktopView ? '20px' : '26px', }}>
                            <span>{`Hire`}</span>
                            <span style={{ color: borderColorTwo(theme) }}>{`${companyData?.companyName || "Company"}`}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', whiteSpace: 'nowrap' }}>Person Email: </span>
                            <input className="inputOne" type="text" value={emailToInvite || ""} onChange={(e) => setEmailToInvite(e.target.value)} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Position: </span>
                            <select className="inputOne" value={position || ""} onChange={(e) => setPosition(e.target.value)} style={{ maxWidth: '220px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                {positionsOpts.map((value, index) => (
                                    <option key={index} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className="buttomDarkGray" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: redOne(theme), fontSize: '16px' }}
                                onClick={() => { close(); }} disabled={processing}>Return</button>

                            <button className="buttomDarkGray" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px' }}
                                onClick={() => { handleAddEmployee() }} disabled={processing}>Hire</button>
                        </div>}

                        {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                            <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                        </div>}
                    </div>
                </div>
            </div>
        </>
    );
}