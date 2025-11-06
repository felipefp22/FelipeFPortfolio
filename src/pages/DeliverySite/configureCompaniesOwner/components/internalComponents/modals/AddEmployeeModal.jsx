import { useEffect, useState } from "react";
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
    const isPcV = useSelector((state) => state.view.isPcV);

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
            <div className='modalInside full' style={{ width: 'auto', padding: '20px', width: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", }}>
                <div className='flexColumn fullCenter' style={{ marginBottom: '30px', fontSize: !isPcV ? '20px' : '26px', }}>
                    <span>{`Hire`}</span>
                    <span style={{ color: borderColorTwo(theme) }}>{`${companyData?.companyName || "Company"}`}</span>
                </div>

                <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                    <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', whiteSpace: 'nowrap' }}>Email: </span>

                    <form className='flexRow' style={{ width: '100%', position: 'relative', }} onSubmit={(e) => { e.preventDefault(); handleFindPerson(); }}>
                        <input className='inputStandart' style={{ width: '100%' }} type="email" autoCapitalize="none" value={emailToInvite || ""} onChange={(e) => { setEmailToInvite(e.target.value); e.target.setCustomValidity(''); }}
                            onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} />
                        <button className='roundedButton' style={{ backgroundColor: transparentCavasOne(theme), width: 27, height: 27, position: 'absolute', right: 8, top: 4 }} >
                            <FontAwesomeIcon icon={faMagnifyingGlass} style={{ fontSize: '12px', fontWeight: '500', }} />
                        </button>
                    </form>
                </div>

                <div className='flexRow' style={{ marginBottom: 20, marginTop: 20, border: `1px solid ${borderColorTwo(theme)}`, borderRadius: '6px', padding: '20px', }} >

                    <img src={userFoundData?.urlProfilePhoto ?? avatar} alt="Logo" style={{
                        width: isPcV ? 40 : 35, height: isPcV ? 40 : 35,
                        borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", 
                    }} />
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                        <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold' }}> {userFoundData ? `${userFoundData?.name} - ${userFoundData?.email}` : `"Find a Person"`}</span>
                    </div>
                </div>

                <div className='flexRow' style={{ alignItems: 'center'  }} >
                    <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold', marginRight: '20px', }}>Position: </span>
                    <select className='inputStandart' value={position || ""} onChange={(e) => setPosition(e.target.value)} style={{ maxWidth: '220px', textAlign: 'center' }} >
                        {!position && <option value="">Select position</option>}
                        {positionsOpts.map((value, index) => (
                            <option key={index} value={value}>
                                {value}
                            </option>
                        ))}
                    </select>
                </div>

                {!processing && <div className='flexRow' style={{ justifyContent: 'space-between', marginTop: '20px' }}>
                    <button className='buttonStandart' style={{ backgroundColor: 'none', border: "none", color: redOne(theme), }}
                        onClick={() => { close(); }} disabled={processing}>Return</button>

                    <button className='buttonStandart' style={{ backgroundColor: 'none', border: "none", color: greenOne(theme), cursor: userFoundData ? 'pointer' : 'not-allowed', opacity: userFoundData ? 1 : 0.5, }}
                        onClick={() => { handleAddEmployee() }} disabled={processing || !userFoundData}>Hire</button>
                </div>}

                {processing && <div className='flexRow' style={{ marginTop: '10px' }}>
                    <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                </div>}
            </div>
        </>
    );
}