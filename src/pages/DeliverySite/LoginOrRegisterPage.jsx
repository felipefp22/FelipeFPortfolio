import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import RegisterPage from './login/RegisterPage';


export default function LoginOrRegisterPage() {
    const navigate = useNavigate();
    const [actualPage, setActualPage] = useState('login');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <>
            {actualPage === 'login' && <LoginPage setActualPage={setActualPage} email={email} setEmail={setEmail} password={password} setPassword={setPassword}/>}
            {actualPage === 'register' && <RegisterPage setActualPage={setActualPage} email={email} setEmail={setEmail} password={password} setPassword={setPassword} />}
        </>
    )
}