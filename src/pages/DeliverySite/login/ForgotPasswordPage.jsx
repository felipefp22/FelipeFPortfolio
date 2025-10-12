import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getTokenToResetPassword, login, requestPasswordReset, resetPassword } from '../../../services/deliveryServices/AuthService.js';
import GoogleLogin from './SocialLogins/GoogleLogin.jsx';
import { Spinner } from 'react-bootstrap';
import { faCheck, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { fontColorOne, redOne } from '../../../theme/Colors.js';

export default function ForgotPasswordPage({ setActualPage, email, setEmail }) {
  const theme = useSelector((state) => state.view.theme);
  const navigate = useNavigate();
  const [disabledCode, setDisabledCode] = useState(false);
  const [disabledText, setDisabledText] = useState(false);
  const [disableEnter, setDisableEnter] = useState(false);
  const [counter, setCounter] = useState(0);
  const [showLoginErrorsMessage, setShowLoginErrorsMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordResetedSuccess, setPasswordResetedSuccess] = useState(false);
  const [passwordResetedSuccesscheck, setPasswordResetedSuccesscheck] = useState(false);

  const [wasSent, setWasSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [tokenToReset, setTokenToReset] = useState(null);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    let timer;
    if (counter > 0) {
      timer = setTimeout(() => setCounter(counter - 1), 1000);
    } else {
      setDisabledText(false); // Re-enable after countdown
    }
    return () => clearTimeout(timer); // Clean up
  }, [counter]);

  async function handleRequestReset(e) {
    setDisableEnter(true);
    e.preventDefault();

    const response = await requestPasswordReset(email);
    if (response.status === 200) {
      setWasSent(true);
      setCounter(60);
      setDisabledText(true);
    } else {
      if (response?.data === 'EmailNotFound') {
        setShowLoginErrorsMessage('Email not found');
      } else {
        setShowLoginErrorsMessage('Error during request, try again later');
      }
    }
    setDisableEnter(false);
  }

  async function handleSetNewPassword(e) {
    setDisableEnter(true);
    e.preventDefault();

    if (password !== confirmPassword) {
      setShowLoginErrorsMessage('Passwords do not match');
      setDisableEnter(false);
      return;
    }

    const response = await resetPassword(password, confirmPassword, tokenToReset);
    if (response.status === 200) {
      setPasswordResetedSuccess(true);
      setTimeout(() => {
        setActualPage('login')
      }, 3000);

    } else {
      setShowLoginErrorsMessage('Error during request, try again later');
    }
    setDisableEnter(false);
  }

  const inputs = useRef([]);

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !code[index]) {
      inputs.current[index - 1].focus();
    }
  };
  const handleChange = async (text, index) => {
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
      getToken(newCode.join(""))
    };

    async function getToken(codeToSend) {
      setDisabledCode(true);

      const response = await getTokenToResetPassword(email, codeToSend);
      if (response.status === 200) {
        console.log(response.data);

        setTokenToReset(response.data.tokenToResetPassword);
      } else {
        console.log(response.data);
        if (response?.data === 'expiredToken') {
          setShowLoginErrorsMessage('Invalid or expired code');
        } else {
          setShowLoginErrorsMessage('Error during request, try again later');
        }
      }
      setShowLoginErrorsMessage('Wrong or expired code.');
    }

    setDisabledCode(false);
  }

  useEffect(() => {
    if (passwordResetedSuccess === true) {
      setTimeout(() => {
        setPasswordResetedSuccesscheck(true)
      }, 100);
    }
    else {
      setPasswordResetedSuccesscheck(false)
    }
  }, [passwordResetedSuccess]);

  useEffect(() => {
    setShowLoginErrorsMessage(false);

  }, [wasSent, tokenToReset, passwordResetedSuccess]);

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', padding: 5, flexGrow: 1, }}>
        <div className='modalInside' style={{ minWidth: "350px", width: "auto", maxHeight: '90%', overflowY: "auto", overflowX: 'hidden', alignContent: 'center', alignItems: 'center', justifyContent: 'center', justifyItems: 'center', }}>
          <div style={{ maxWidth: '450px', width: '96%' }}>
            <h2 style={{ color: redOne(theme), marginBottom: '30px' }}>Reset Password</h2>

            {!wasSent && <div>
              <form onSubmit={(e) => handleRequestReset(e)}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'left', textAlign: 'left' }}>
                    <label>Email</label>
                    <span style={{ color: 'red' }}> *</span>
                  </div>
                  <input className='inputOne' style={{ width: '90%', height: '35px' }} type="email" value={email} onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(''); }}
                    onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} required
                  />
                  <button type="submit" disabled={disableEnter} style={{ backgroundColor: 'white', color: 'black', width: '150px', height: '40px', borderRadius: '3px', marginTop: '15px', cursor: disableEnter ? 'not-allowed' : 'pointer', }}> {disableEnter ? <Spinner animation="border" role="status" variant="primary"
                    style={{ width: '25px', height: '25px' }} /> : "Reset"} </button>
                </div>
              </form>
            </div>}

            {wasSent && !tokenToReset && <div>
              <span style={{ fontWeight: 'bold', margin: '10px 0px' }}>Code sent to Email!</span>

              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", }} >
                {code.map((digit, index) => (
                  <input key={index} disabled={disabledCode} type="text" inputMode="numeric" maxLength={1} value={digit} ref={(el) => (inputs.current[index] = el)} onKeyDown={(e) => handleKeyPress(e, index)} onChange={(e) => handleChange(e.target.value, index)}
                    style={{ backgroundColor: "white", border: "2px solid black", fontWeight: "500", borderRadius: 6, color: "black", width: "35px", height: "45px", textAlign: "center", fontSize: "18px", margin: "15px 3px" }} />
                ))}
              </div>

              <span style={{ fontSize: 18, color: "black", lineHeight: "20px", marginTop: 26, marginBottom: 20, textDecoration: "underline", cursor: disabledCode || disabledText ? "default" : "pointer", color: disabledText || disabledCode ? "gray" : "white", }}
                onClick={(e) => { if (!disabledCode) handleRequestReset(e) }}>{wasSent ? (disabledText ? `You can resend in (${counter})` : "Didn't receive the code? Resend Code!") : " "}</span>
            </div>}

            {wasSent && tokenToReset && !passwordResetedSuccess && <div>
              <form onSubmit={handleSetNewPassword}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                    <label>Password</label>
                    {/* <span style={{ color: 'red' }}> *</span> */}
                  </div>
                  <div style={{ position: 'relative', width: '100%' }} >
                    <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '30px' }} type={showPassword ? 'text' : 'password'} value={password} minLength={6} required
                      onChange={(e) => { setPassword(e.target.value); e.target.setCustomValidity(''); }}
                      onInvalid={(e) => {
                        if (e.target.validity.valueMissing) { e.target.setCustomValidity('Password is required.'); }
                        else if (e.target.validity.tooShort) { e.target.setCustomValidity('Password must be at least 6 characters.'); } else { e.target.setCustomValidity('Enter a valid password.'); }
                      }} />
                    <span style={{ position: 'absolute', right: '25px', top: 3, cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: 'black' }} /> </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                    <label>Confirm Password</label>
                    {/* <span style={{ color: 'red' }}> *</span> */}
                  </div>
                  <div style={{ position: 'relative', width: '100%' }} >
                    <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '30px' }} type={showPassword ? 'text' : 'password'} value={confirmPassword} minLength={6} required
                      onChange={(e) => { setConfirmPassword(e.target.value); e.target.setCustomValidity(''); }}
                      onInvalid={(e) => {
                        if (e.target.validity.valueMissing) { e.target.setCustomValidity('Password is required.'); }
                        else if (e.target.validity.tooShort) { e.target.setCustomValidity('Password must be at least 6 characters.'); } else { e.target.setCustomValidity('Enter a valid password.'); }
                      }} />
                    <span style={{ position: 'absolute', right: '25px', top: 3, cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: 'black' }} /> </span>
                  </div>
                </div>
                <div>
                  <button className='buttomDarkGray' type="submit" disabled={disableEnter} style={{ width: '150px', height: '40px', cursor: disableEnter ? 'not-allowed' : 'pointer', }}> {disableEnter ? <Spinner animation="border" role="status" variant="primary"
                    style={{ width: '25px', height: '25px' }} /> : "Reset"} </button>
                </div>
              </form>
            </div>}

            {wasSent && tokenToReset && passwordResetedSuccess && <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
              <p>Password updated successfully!</p>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 50, borderRadius: '50%', backgroundColor: 'green', width: '160px', height: '160px', opacity: !passwordResetedSuccesscheck ? 0 : 1, transition: 'opacity 0.6s ease-out', }} >
                <FontAwesomeIcon icon={faCheck} style={{ color: 'white', fontSize: '80px' }} />
              </div>
            </div>}

            {/* <button onClick={() => { setPasswordResetedSuccess(!passwordResetedSuccess); }} style={{ marginTop: '10px', backgroundColor: 'white', color: 'black', width: '150px', height: '40px', borderRadius: '3px' }}>ooooo</button> */}

            {!passwordResetedSuccess && <div style={{ marginTop: '10px' }}>
              <p>Return to login? <Link onClick={() => setActualPage('login')} style={{ color: fontColorOne(theme), }}>Login</Link></p>
            </div>}
            <div style={{ visibility: showLoginErrorsMessage ? 'visible' : 'hidden' }}>
              <strong style={{ color: 'red' }}>Error! </strong> {showLoginErrorsMessage + '.'}
            </div>

          </div>
        </div >
      </div >
    </>
  );
}
