import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/deliveryServices/AuthService.js';
import GoogleLogin from './SocialLogins/GoogleLogin.jsx';
import { Spinner } from 'react-bootstrap';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { blueOne, borderColorTwo, fontColorOne, orangeOne } from '../../../theme/Colors.js';
import { useSelector } from 'react-redux';

export default function LoginPage({ setActualPage, email, setEmail, password, setPassword }) {
  const theme = useSelector((state) => state.view.theme);
  const navigate = useNavigate();
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [disableEnter, setDisableEnter] = useState(false);
  const [showLoginErrorsMessage, setShowLoginErrorsMessage] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function onLogin(e) {
    setDisableEnter(true);
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };
    if (email === '') {
      errorObj.email = 'Email is Required';
      error = true;
      setDisableEnter(false);

    }
    if (password === '') {
      errorObj.password = 'Password is Required';
      error = true;
      setDisableEnter(false);

    }
    setErrors(errorObj);
    if (error) {
      setDisableEnter(false);
      return;
    }

    const response = await login(email, password)
    if (response.status === 200) {
      const companiesCoumpound = response.data.compoundsYouAreOwner || [];

      window.dispatchEvent(new CustomEvent("profileUpdated"));
    } else {
      if (response?.data === 'LoginDataWrong') {
        setShowLoginErrorsMessage('Email or Password incorrect');
      } else {
        setShowLoginErrorsMessage('Error during login, try again later');
      }

      setDisableEnter(false);

      setTimeout(() => {
        setShowLoginErrorsMessage(false);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  }

document.querySelectorAll('.inputStandart').forEach(input => {
    if(input.value) {
        input.classList.add('prefilled');
    }

    // Optional: remove class if user clears the input
    input.addEventListener('input', () => {
        if(input.value) {
            input.classList.add('prefilled');
        } else {
            input.classList.remove('prefilled');
        }
    });
});

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', padding: 5, flexGrow: 1, }}>
        <div className='modalInside' style={{ minWidth: "350px", width: "auto", maxHeight: '90%', overflowY: "auto", overflowX: 'hidden', alignContent: 'center', alignItems: 'center', justifyContent: 'center', justifyItems: 'center', }}>
          <div style={{ maxWidth: '450px', width: '96%' }}>
            <h2 style={{ color: orangeOne(theme) }}>Sign in with</h2>
            <GoogleLogin />
            <p style={{ color: 'white', marginTop: '10px', marginBottom: '10px', color: fontColorOne(theme) }}><span>or</span></p>

            {/* {props.errorMessage && (
              <div >
                {props.errorMessage}
              </div>
            )}
            {props.successMessage && (
              <div>
                {props.successMessage}
              </div>
            )} */}

            <form onSubmit={onLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'left', textAlign: 'left' }}>
                  <label>Email</label>
                  {/* <span style={{ color: 'red' }}> *</span> */}
                </div>
                <input className='inputStandart' style={{ width: '90%', height: '35px',}} type="email" value={email} onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(''); }}
                  onInvalid={(e) => e.target.setCustomValidity('Enter a valid email address.')} required
                />
                {/* {errors.email && <div>{errors.email}</div>} */}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                  <label>Password</label>
                  {/* <span style={{ color: 'red' }}> *</span> */}
                </div>
                <div style={{ position: 'relative', width: '100%' }} >
                  <input className='inputStandart' style={{ width: '90%', height: '35px',}} type={showPassword ? 'text' : 'password'} value={password} minLength={6} required
                    onChange={(e) => { setPassword(e.target.value); e.target.setCustomValidity(''); }}
                    onInvalid={(e) => {
                      if (e.target.validity.valueMissing) { e.target.setCustomValidity('Password is required.'); }
                      else if (e.target.validity.tooShort) { e.target.setCustomValidity('Password must be at least 6 characters.'); } else { e.target.setCustomValidity('Enter a valid password.'); }
                    }} />
                  <span style={{ position: 'absolute', right: '25px', top: 5, cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} /> </span>
                </div>
                {errors.password && <div >{errors.password}</div>}
                <p> <Link onClick={() => setActualPage('fpassword')} style={{ color: fontColorOne(theme) }}>Forgot Password?</Link></p>
              </div>

              <div style={{  display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                <button className='buttomStandart' type="submit" disabled={disableEnter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px',}}> 
                  {disableEnter ? <Spinner animation="border" role="status" style={{ width: '25px', height: '25px', color: borderColorTwo(theme), }} /> : "Sign In"} </button>
              </div>

            </form>
            <div style={{ marginTop: '10px' }}>
              <p>Don't have an account? <Link onClick={() => setActualPage('register')} style={{ color: fontColorOne(theme) }}>Register</Link></p>
            </div>
            <div style={{ visibility: showLoginErrorsMessage ? 'visible' : 'hidden', transition: 'visibility 0.5s ease-in-out', }}>
              <strong style={{ color: 'red' }}>Error! </strong> {showLoginErrorsMessage + '.'}
            </div>

          </div>
        </div >
      </div >
    </>
  );
}
