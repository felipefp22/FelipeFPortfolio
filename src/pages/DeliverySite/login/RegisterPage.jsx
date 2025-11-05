import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login, signUp, updateLocalStorage } from '../../../services/deliveryServices/AuthService.js';
import GoogleLogin from './SocialLogins/GoogleLogin.jsx';
import { Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux';
import { blueOne, borderColorTwo, fontColorOne, greenOne, orangeOne } from '../../../theme/Colors.js';

export default function RegisterPage({ setActualPage, email, setEmail, password, setPassword }) {
  const theme = useSelector((state) => state.view.theme);
  const navigate = useNavigate();
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [disableEnter, setDisableEnter] = useState(false);
  const [showLoginErrorsMessage, setShowLoginErrorsMessage] = useState(false);
  const [isPasswordShown, setIsPasswordShown] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  async function onLogin(e) {
    setDisableEnter(true);
    e.preventDefault();
    let error = false;
    const errorObj = { ...errorsObj };

    if (name === '') {
      errorObj.name = 'Name is Required';
      error = true;
      setDisableEnter(false);
    }
    if (email === '') {
      errorObj.email = 'Email is Required';
      error = true;
      setDisableEnter(false);
    }
    if (password === '') {
      error = true;
      setDisableEnter(false);
    }
    if (confirmPassword === '') {
      error = true;
      setDisableEnter(false);
    }

    if (password !== confirmPassword) {
      errorObj.password = 'Passwords do not match';
      error = true;
      setDisableEnter(false);
    }
    setErrors(errorObj);
    if (error) {
      setDisableEnter(false);
      return;
    }

    const response = await signUp(name, email, password)
    if (response && response.data.access_token) {
      await updateLocalStorage(response.data);
      // await GetOwnProfileDatas()

    } else {
      console.log("Error on sign up", response.data);
      if (response?.data === 'EmailAlreadyOnUse') {
        setShowLoginErrorsMessage('Email already in use');
      } else {
        setShowLoginErrorsMessage('Error creating account, try again later');
      }
      setDisableEnter(false);

      setTimeout(() => {
        setShowLoginErrorsMessage(false);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  }

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', padding: 5, flexGrow: 1, }}>
        <div className='modalInside' style={{ minWidth: "350px", width: "auto", maxHeight: '90%', overflowY: "auto", overflowX: 'hidden', alignContent: 'center', alignItems: 'center', justifyContent: 'center', justifyItems: 'center', }}>

          <div style={{ maxWidth: '450px', width: '96%' }}>
            <h2 style={{ color: blueOne(theme) }}>Sign Up With</h2>
            <GoogleLogin />
            <p style={{ color: fontColorOne(theme), marginTop: '10px', }}><span>or</span></p>

            {/* {props.errorMessage && (
              <div >
                {props.errorMessage}
              </div>
            )}
            {props.successMessage && (
              <div >
                {props.successMessage}
              </div>
            )} */}

            <form onSubmit={onLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'left', textAlign: 'left' }}>
                  <label>Name</label>
                  {/* <span style={{ color: 'red' }}> *</span> */}
                </div>
                <input className='inputStandart' style={{ width: '90%', height: '35px' }} type="text" value={name} onChange={(e) => { setName(e.target.value); e.target.setCustomValidity(''); }} minLength={3} required

                  onInvalid={(e) => {
                    if (e.target.validity.valueMissing) { e.target.setCustomValidity('Name is required.'); }
                    else if (e.target.validity.tooShort) { e.target.setCustomValidity('Name must be at least 3 characters.'); } else { e.target.setCustomValidity('Enter a valid name.'); }
                  }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'left', textAlign: 'left' }}>
                  <label>Email</label>
                  {/* <span style={{ color: 'red' }}> *</span> */}
                </div>
                <input className='inputStandart' style={{ width: '90%', height: '35px' }} type="email" value={email} onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(''); }} required
                  onInvalid={(e) => e.target.setCustomValidity('Tipe a valid email.')}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                  <label>Password</label>
                  {/* <span style={{ color: 'red' }}> *</span> */}
                </div>
                <div style={{ position: 'relative', width: '100%' }} >
                  <input className='inputStandart' style={{ width: '90%', height: '35px' }} type={showPassword ? 'text' : 'password'} value={password} minLength={6} required
                    onChange={(e) => { setPassword(e.target.value); e.target.setCustomValidity(''); }}
                    onInvalid={(e) => {
                      if (e.target.validity.valueMissing) { e.target.setCustomValidity('Password is required.'); }
                      else if (e.target.validity.tooShort) { e.target.setCustomValidity('Password must be at least 6 characters.'); } else { e.target.setCustomValidity('Enter a valid password.'); }
                    }} />
                  <span style={{ position: 'absolute', right: '25px', top: 5, cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: fontColorOne(theme) }} /> </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                  <label>Confirm Password</label>
                  {/* <span style={{ color: 'red' }}> *</span> */}
                </div>
                <div style={{ position: 'relative', width: '100%' }} >
                  <input className='inputStandart' style={{ width: '90%', height: '35px' }} type={showPassword ? 'text' : 'password'} value={confirmPassword} minLength={6} required
                    onChange={(e) => { setConfirmPassword(e.target.value); e.target.setCustomValidity(''); }}
                    onInvalid={(e) => {
                      if (e.target.validity.valueMissing) { e.target.setCustomValidity('Password is required.'); }
                      else if (e.target.validity.tooShort) { e.target.setCustomValidity('Password must be at least 6 characters.'); } else { e.target.setCustomValidity('Enter a valid password.'); }
                    }} />
                  <span style={{ position: 'absolute', right: '25px', top: 5, cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} style={{ color: fontColorOne(theme) }} /> </span>
                </div>
                {errors.password && <div >{errors.password}</div>}
              </div>

              <div style={{  display: 'flex', alignItems: 'center', justifyContent: 'center',}}>
                <button className='buttomStandart' type="submit" disabled={disableEnter} style={{  display: 'flex', alignItems: 'center', justifyContent: 'center', width: '150px', height: '40px',}}> 
                  {disableEnter ? <Spinner animation="border" role="status" style={{ width: '25px', height: '25px', color: borderColorTwo(theme), }} /> : "Register"} </button>
              </div>


            </form>
            <div style={{ marginTop: '10px' }}>
              <p>Already have account? <Link onClick={() => setActualPage('login')} style={{ color: fontColorOne(theme), }}>Login</Link></p>
            </div>
            <div style={{ visibility: showLoginErrorsMessage ? 'visible' : 'hidden', }}>
              <strong style={{ color: 'red' }}>Error! </strong> {showLoginErrorsMessage + '.'}
            </div>

          </div>
        </div>
      </div >
    </>
  );
}
