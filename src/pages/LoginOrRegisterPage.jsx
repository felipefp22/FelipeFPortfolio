import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import LoginPage from "./login/LoginPage";
import RegisterPage from './login/RegisterPage';


export default function LoginOrRegisterPage() {
    const navigate = useNavigate();
    const [actualPage, setActualPage] = useState('login');

    return (
        <>
            {actualPage === 'login' && <LoginPage setActualPage={setActualPage} />}
            {actualPage === 'register' && <RegisterPage setActualPage={setActualPage} />}
        </>
    )
}