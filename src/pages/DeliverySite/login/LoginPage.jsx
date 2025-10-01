import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../../services/AuthService.js';
import GoogleLogin from './SocialLogins/GoogleLogin.jsx';
import { Spinner } from 'react-bootstrap';

export default function LoginPage({ setActualPage, email, setEmail, password, setPassword }) {
  const navigate = useNavigate();
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [disableEnter, setDisableEnter] = useState(false);
  const [showLginErrosMessage, setShowLginErrosMessage] = useState(false);
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
      localStorage.setItem('companyOperatingID', companiesCoumpound[0]?.companies[0]?.companyID || null);
      window.dispatchEvent(new CustomEvent("profileUpdated"));
    } else {
      // alertIncorrectLoginDatas()
      setShowLginErrosMessage(true);
      setDisableEnter(false);

      setTimeout(() => {
        setShowLginErrosMessage(false);
      }, 2000); // 2000 milliseconds = 2 seconds
    }
  }



  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', padding: 5, flexGrow: 1, }}>
        <div style={{
          display: 'flex', flexDirection: 'column', minWidth: "350px", width: "auto", maxHeight: '90%', border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
          color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto", overflowX: 'hidden', alignContent: 'center', alignItems: 'center', justifyContent: 'center', justifyItems: 'center',
        }}>
          <div style={{ maxWidth: '450px', width: '96%' }}>
            <h2 >Entre com</h2>
            <GoogleLogin />
            <p style={{ color: 'white', marginTop: '10px', marginBottom: '10px' }}><span>ou</span></p>

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
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'left', textAlign: 'left' }}>
                  <label>Email</label>
                  <span style={{ color: 'red' }}> *</span>
                </div>
                <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '38px' }} type="email" value={email} onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(''); }}
                  onInvalid={(e) => e.target.setCustomValidity('Digite email Valido.')}
                />
                {errors.email && <div>{errors.email}</div>}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                  <label>Senha</label>
                  <span style={{ color: 'red' }}> *</span>
                </div>
                <div style={{ width: '100%' }} >
                  <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '28px' }} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /> </span>
                </div>
                {errors.password && <div >{errors.password}</div>}
                <p> <Link to={"/fpassword"} style={{ color: 'white' }}>Esqueceu a senha?</Link></p>
              </div>

              <div>
                <button type="submit" disabled={disableEnter} style={{ backgroundColor: 'white', color: 'black', width: '150px', height: '40px', borderRadius: '3px' }}> {disableEnter ? <Spinner animation="border" role="status" variant="primary"
                  style={{ width: '25px', height: '25px' }} /> : "Entrar"} </button>
              </div>

            </form>
            <div>
              <p>Ainda não é usuario? <Link to={"/register"} onClick={() => setActualPage('register')} style={{ color: 'white' }}>Registre-se</Link></p>
            </div>
            <div style={{ visibility: showLginErrosMessage ? 'visible' : 'hidden', transition: 'visibility 0.5s ease-in-out', }}>
              <strong style={{ color: 'red' }}>Erro! </strong> Dados de login invalidos.
            </div>

          </div>
        </div>
      </div >
    </>
  );
}
