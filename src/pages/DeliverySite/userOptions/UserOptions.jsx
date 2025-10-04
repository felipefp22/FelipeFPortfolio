import { use, useEffect, useRef, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { confirmAccount, logOutAction, requestConfirmationCode, updateLocalStorage } from "../../../services/deliveryServices/AuthService";
import { getUserInfos } from "../../../services/deliveryServices/AUserService";
import { useSelector } from "react-redux";
import companiesGroupLogo from '../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";


export default function UserOptions() {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [errorGeneral, setErrorGeneral] = useState(true);
    const [wasSent, setWasSent] = useState(false);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [disabledText, setDisabledText] = useState(false);
    const [counter, setCounter] = useState(0);
    const [disabledCode, setDisabledCode] = useState(false);
    const [successShowCheck, setSuccessShowCheck] = useState(false);


    const [companiesCoumpound, setCompaniesCoumpound] = useState([]);
    const [selectedCompaniesCoumpound, setSelectedCompaniesCoumpound] = useState(null);

    const [companiesUserWorksOn, setCompaniesUserWorksOn] = useState([]);

    const [isEmailConfirmed, setIsEmailConfirmed] = useState(localStorage.getItem('isEmailConfirmed') === 'true' ? true : false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem('userLoggedEmail') || "");

    useEffect(() => {
        fetchUserInfos();
    }, []);

    async function fetchUserInfos() {
        const response = await getUserInfos();

        if (response?.status === 200) {
            const userData = response?.data;
            setIsEmailConfirmed(userData?.emailConfirmed || false);

            setName(userData?.name || "");
            setCompaniesCoumpound(userData?.companiesCompounds || []);
            setCompaniesUserWorksOn(userData?.worksAtCompanies || []);
        }
    }

    async function handleRequestConfirmationCode() {
        if (disabledText) return;
        setDisabledCode(true);
        setDisabledText(true);

        const response = await requestConfirmationCode();

        if (response.status === 200) {
            setWasSent(true);
            setDisabledText(false);
            setCounter(60);
        } else {
            setErrorGeneral('Erro ao solicitar côdigo.');
        }

        setDisabledCode(false);
    }

    async function confirmEmail(codeToSend) {
        setDisabledCode(true);

        const response = await confirmAccount(codeToSend);

        if (response.status === 200) {
            setSuccessShowCheck(true);            
            setTimeout(() => {
                updateLocalStorage(response.data);
                fetchUserInfos();
            }, 2000);

        } else {
            setErrorGeneral('Codigo de confirmação errado ou expirado.');
        }

        setDisabledCode(false);
    }

    useEffect(() => {
        let timer;
        if (counter > 0) {
            timer = setTimeout(() => setCounter(counter - 1), 1000);
        } else {
            setDisabledText(false); // Re-enable after countdown
        }
        return () => clearTimeout(timer); // Clean up
    }, [counter]);

    //code boxes logic BELLOW
    const inputs = useRef([]);

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === "Backspace" && index > 0 && !code[index]) {
            inputs.current[index - 1].focus();
        }
    };

    const handleChange = (text, index) => {
        if (!/^\d*$/.test(text)) return; // Allow only numbers

        const newCode = [...code];
        newCode[index] = text;

        for (let i = index + 1; i < newCode.length; i++) {
            newCode[i] = "";
        }

        setCode(newCode);

        // Move to the next input if a digit is entered
        if (text && index < 5) {
            inputs.current[index + 1].focus();
        }

        // Submit when all six digits are entered
        if (newCode.join("").length === 6) {
            confirmEmail(newCode.join(""));
        }
    };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: isDesktopView ? 5 : 3 }}>
                {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white",  marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => setNewOrderModal(true)}>New Order</button>
                </div> */}

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>
                    <h3 style={{ color: "white", marginBottom: '10px' }}>Welcome {name ? " - " + name : "Guest"}</h3>

                    {!isEmailConfirmed && <div style={{
                        display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", padding: '10px', borderRadius: '6px', maxWidth: '100%', justifyContent: 'center', alignItems: 'center',
                    }}>
                        {!wasSent && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }} >
                            <span style={{ fontWeight: 'bold', margin: '10px 0px' }}>Your email is not confirmed!</span>
                            <span style={{ fontSize: '14px', margin: '10px 0px' }}>To use platform features, please confirm your email.</span>
                            <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", padding: '8px', borderRadius: '6px', margin: '20px 0px' }} disabled={disabledText}
                                onClick={() => handleRequestConfirmationCode()}>Request Confirmation Email</button>
                        </div>}

                        {wasSent && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }} >
                            <span style={{ fontWeight: 'bold', margin: '10px 0px' }}>Confirmation Email Sent!</span>

                            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", }} >
                                {code.map((digit, index) => (
                                    <input key={index} disabled={disabledCode} type="text" inputMode="numeric" maxLength={1} value={digit} ref={(el) => (inputs.current[index] = el)} onKeyDown={(e) => handleKeyPress(e, index)} onChange={(e) => handleChange(e.target.value, index)}
                                        style={{ backgroundColor: "white", border: "2px solid black", fontWeight: "500", borderRadius: 6, color: "black", width: "35px", height: "45px", textAlign: "center", fontSize: "18px", margin: "15px 3px" }} />
                                ))}
                            </div>

                            <span style={{ fontSize: 18, color: "black", lineHeight: "20px", marginTop: 26, marginBottom: 20, textDecoration: "underline", cursor: disabledCode || disabledText ? "default" : "pointer", color: disabledText || disabledCode ? "gray" : "white", }}
                                onClick={() => { if (!disabledCode) handleRequestConfirmationCode() }}>{wasSent ? (disabledText ? `Você pode reenviar Codigo em (${counter})` : "Não recebeu codigo? Reenviar Codigo!") : " "}</span>
                        </div>}


                    </div>}

                    {isEmailConfirmed && <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.0)", color: "white", padding: '10px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }}>
                        <p style={{ fontWeight: 'bold', }}>Your Companies Groups:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%' }}>

                            {companiesCoumpound?.map((compound, index) => (
                                <div>
                                    <div key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '0px', cursor: 'pointer', backgroundColor: "rgba(255, 255, 255, 0.2)", padding: '10px', borderRadius: '6px', }}
                                        onClick={() => setSelectedCompaniesCoumpound(selectedCompaniesCoumpound === compound.id ? null : compound.id)}>

                                        <img src={companiesGroupLogo} alt="Logo" style={{
                                            width: isDesktopView ? 50 : !isDesktopView ? 40 : 35, height: isDesktopView ? 50 : !isDesktopView ? 40 : 35,
                                            borderRadius: '6px', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isDesktopView ? '24px' : '16px', fontWeight: 'bold' }}>{compound.compoundName} </span>
                                            <FontAwesomeIcon icon={selectedCompaniesCoumpound === compound.id ? faArrowUp : faArrowDown}
                                                style={{ fontSize: isDesktopView ? '20px' : '12px', marginRight: isDesktopView ? '20px' : '5px', border: "1px solid white", borderRadius: '4px', padding: isDesktopView ? '5px' : '4px' }} />
                                        </div>
                                    </div>
                                    {(selectedCompaniesCoumpound === compound.id) && <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 10px', padding: '15px 10px', borderRadius: '6px', backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                                        {compound?.companies?.map((comp, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }} onClick={() => { localStorage.setItem('companyOperatingID', comp.companyID); window.dispatchEvent(new CustomEvent("profileUpdated")); }}>
                                                <img src={restaurantLogo} alt="Logo" style={{
                                                    width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                            ))}
                        </div>
                    </div>}
                </div>
            </div >
        </>
    );
}