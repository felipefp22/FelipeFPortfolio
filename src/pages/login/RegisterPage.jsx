import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/AuthService.jsx';
import GoogleLogin from './SocialLogins/GoogleLogin.jsx';
import { Spinner } from 'react-bootstrap';

export default function RegisterPage({ setActualPage }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  let errorsObj = { email: '', password: '' };
  const [errors, setErrors] = useState(errorsObj);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    const loginData = await login(email, password)
    if (loginData && loginData.access_token) {
      await updateLocalStorage(loginData);
      // await GetOwnProfileDatas()

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
          <div className="login-container" style={{ maxWidth: '450px', width: '96%' }}>
            <h2 className="form-title">Entre com</h2>
            <GoogleLogin />
            <p className="separator" style={{ color: 'white' }}><span>ou</span></p>

            {/* {props.errorMessage && (
              <div className='bg-red-300 text-red-900 border border-red-900 p-1 my-2'>
                {props.errorMessage}
              </div>
            )}
            {props.successMessage && (
              <div className='bg-green-300 text-green-900 border border-green-900 p-1 my-2'>
                {props.successMessage}
              </div>
            )} */}

            <form onSubmit={onLogin}>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', width: '90%', flexDirection: 'row', justifyContent: 'left', textAlign: 'left' }}>
                  <label>Email</label>
                  <span style={{ color: 'red' }}> *</span>
                </div>
                <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '28px' }} type="email" value={email} onChange={(e) => { setEmail(e.target.value); e.target.setCustomValidity(''); }}
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
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'row', width: '90%' }}>
                  <label>Confirme Senha</label>
                  <span style={{ color: 'red' }}> *</span>
                </div>
                <div style={{ width: '100%' }} >
                  <input style={{ width: '90%', backgroundColor: 'white', color: 'black', borderRadius: 2, border: '1px solid white', height: '28px' }} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span style={{ cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}> <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} /> </span>
                </div>
                {errors.password && <div >{errors.password}</div>}
              </div>

              <div>
                <button type="submit" disabled={disableEnter} style={{ backgroundColor: 'white', color: 'black', width: '150px', height: '40px', borderRadius: '3px' }}> {disableEnter ? <Spinner animation="border" role="status" />	: "Cadastrar"} </button>
              </div>


            </form>
            <div>
              <p>Já possui uma conta? <Link to={"/login"} onClick={() => setActualPage('login')} style={{ color: 'white' }}>Entre</Link></p>
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
