import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { logOutAction } from "../../../services/deliveryServices/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


export default function LogoutMessage({ close }) {
    const navigate = useNavigate();
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    async function handleLogout() {
        logOutAction();
        navigate('/FelipeFPortfolio/delivery/'); 
        close();
    }

    return (
        <>
            <div className='myModal'  >
                <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", overflowY: "auto", fontSize: !isPcV ? '20px' : '26px', }}>
                    <div>
                        <div className='flexColumn fullCenter' style={{ lineHeight: 1.8, marginBottom: '10px' }}>
                            <span>Sure to LogOut?</span>
                        </div>

                        <div className='flexRow' style={{ justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className='buttonStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", fontSize: '16px', margin: '5px 30px' }}
                                onClick={() => { close(); }} >Return</button>

                            <button className='buttonStandart' style={{ backgroundColor: 'rgba(0, 0, 0, 0)', fontSize: '16px', margin: '5px 30px' }}
                                onClick={() => { handleLogout() }} >Log Out <FontAwesomeIcon icon={faRightFromBracket} style={{ color: "red", marginLeft: '3px' }} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}