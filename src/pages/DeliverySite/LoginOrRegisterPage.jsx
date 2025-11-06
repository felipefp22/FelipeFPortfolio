import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import RegisterPage from './login/RegisterPage';
import ForgotPasswordPage from './login/ForgotPasswordPage';
import { fontColorOne, mainColor } from '../../theme/Colors';
import { useSelector } from 'react-redux';


export default function LoginOrRegisterPage() {
    const navigate = useNavigate();
    const theme = useSelector((state) => state.view.theme);
    const [actualPage, setActualPage] = useState('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            <div className='flexColumn' style={{ background: mainColor(theme), color: fontColorOne(theme), height: "100dvh", width: "100vw", overflow: "hidden", padding: 0 }}>

                {actualPage === 'login' && <LoginPage setActualPage={setActualPage} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
                {actualPage === 'fpassword' && <ForgotPasswordPage setActualPage={setActualPage} email={email} setEmail={setEmail} />}
                {actualPage === 'register' && <RegisterPage setActualPage={setActualPage} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
                
            </div>
        </>
    )
}