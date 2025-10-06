import { useEffect, useRef, useState } from "react";
import { confirmAccount, requestConfirmationCode, updateLocalStorage } from "../../../../services/deliveryServices/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

export default function ConfirmEmail() {

    const [errorGeneral, setErrorGeneral] = useState(true);
    const [wasSent, setWasSent] = useState(false);
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [disabledText, setDisabledText] = useState(false);
    const [counter, setCounter] = useState(0);
    const [disabledCode, setDisabledCode] = useState(false);
    const [successShowCheck, setSuccessShowCheck] = useState(false);
    const [successShowCheckSeal, setSuccessShowCheckSeal] = useState(false);


    async function handleRequestConfirmationCode() {
        if (disabledText) return;
        setDisabledCode(true);
        setDisabledText(true);

        const response = await requestConfirmationCode();

        if (response.status === 200) {
            setWasSent(true);
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
                setact
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

    useEffect(() => {
        if (successShowCheck === true) {
            setTimeout(() => {
                setSuccessShowCheckSeal(true)
            }, 100);
        }
        else {
            setSuccessShowCheckSeal(false)
        }
    }, [successShowCheck]);

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.1)", color: "white", padding: '10px', borderRadius: '6px', maxWidth: '100%', justifyContent: 'center', alignItems: 'center',
            }}>
                {!wasSent && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }} >
                    <span style={{ fontWeight: 'bold', margin: '10px 0px' }}>Your email is not confirmed!</span>
                    <span style={{ fontSize: '14px', margin: '10px 0px' }}>To use platform features, please confirm your email.</span>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", padding: '8px', borderRadius: '6px', margin: '20px 0px' }} disabled={disabledText}
                        onClick={() => handleRequestConfirmationCode()}>Request Confirmation Email</button>
                </div>}

                {wasSent && !successShowCheck && <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center' }} >
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

                {wasSent && successShowCheck && <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
                    <p>Password updated successfully!</p>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 50, borderRadius: '50%', backgroundColor: 'green', width: '160px', height: '160px', opacity: !successShowCheckSeal ? 0 : 1, transition: 'opacity 0.6s ease-out', }} >
                        <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: '80px' }} />
                    </div>
                </div>}

            </div>
        </>
    );
}