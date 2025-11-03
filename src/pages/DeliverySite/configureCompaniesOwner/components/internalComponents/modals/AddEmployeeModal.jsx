import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, greenOne, redOne, transparentCavasOne } from "../../../../../../theme/Colors";
import { hireEmployeeService } from "../../../../../../services/deliveryServices/EmployeeService";
import avatar from '../../../../../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { findPersonByEmailService } from "../../../../../../services/deliveryServices/SocialService";


export default function AddEmployeeModal({ close, companyData, positionsOpts, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    const [emailToInvite, setEmailToInvite] = useState("");
    const [position, setPosition] = useState("");

    const [userFoundData, setUserFoundData] = useState(null);

    useEffect(() => {
        console.log("CompanyID: ", companyData?.id);
    }, []);

    async function handleFindPerson() {
        setProcessing(true);
        const response = await findPersonByEmailService(emailToInvite);
        if (response?.status === 200) {
            setUserFoundData(response?.data);
        } else {
            alert(`Error finding person: ${response?.data}`);
        }
        setProcessing(false);
    }


    async function handleAddEmployee() {
        if (!position) {
            alert("Select a position");
            return;
        }
        const response = await hireEmployeeService(companyData?.id, emailToInvite, position.toUpperCase());
        if (response?.status === 200) {
            fetchCompanyData();
            close();
        } else {
            alert(`Error hiring employee: ${response?.data}`);
        }
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ padding: '20px', minWidth: '300px', maxWidth: !isDesktopView ? "95%" : "600px", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '30px', fontSize: !isDesktopView ? '20px' : '26px', }}>
                        <span>{`Hire`}</span>
                        <span style={{ color: borderColorTwo(theme) }}>{`${companyData?.companyName || "Company"}`}</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'center', marginBottom: '10px', width: '100%' }} >
                        <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', whiteSpace: 'nowrap' }}>Email: </span>

                        <form style={{ display: 'flex', position: 'relative', flexGrow: 1, maxWidth: '550px' }} onSubmit={(e) => { e.preventDefault(); handleFindPerson(); }}>
                            <input className="inputOne" style={{ flexGrow: 1, }} type="email" autoCapitalize="none" value={emailToInvite || ""} onChange={(e) => { setEmailToInvite(e.target.value); e.target.setCustomValidity(''); }}
                                onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} />
                            <button style={{
                                borderRadius: '50%', backgroundColor: transparentCavasOne(theme), padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: 27, height: 27, cursor: 'pointer', position: 'absolute', right: 8, top: 4
                            }} >
                                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '12px', fontWeight: '500', }} />
                            </button>
                        </form>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 20, marginTop: 20, border: `1px solid ${borderColorTwo(theme)}`, borderRadius: '6px', padding: '20px', }} >

                        <img src={userFoundData?.urlProfilePhoto ?? avatar} alt="Logo" style={{
                            width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                            borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                        }} />
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold' }}> {userFoundData ? `${userFoundData?.name} - ${userFoundData?.email}` : `"Find a Person"`}</span>
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

                        <button className="buttomDarkGray" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", color: greenOne(theme), fontSize: '16px', cursor: userFoundData ? 'pointer' : 'not-allowed', opacity: userFoundData ? 1 : 0.5, }}
                            onClick={() => { handleAddEmployee() }} disabled={processing || !userFoundData}>Hire</button>
                    </div>}

                    {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}