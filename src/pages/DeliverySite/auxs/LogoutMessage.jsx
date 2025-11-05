import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutAction } from "../../../services/deliveryServices/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";


export default function LogoutMessage({ close }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();

    async function handleLogout() {
        logOutAction();
        dispatch(setIsAdmAuthenticated(false));
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '20px', maxWidth: !isDesktopView ? "95%" : "80%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, overflowY: "auto", fontSize: !isDesktopView ? '20px' : '26px', }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', alignItems: 'center', justifyContent: 'center', alignContent: 'center', lineHeight: 1.8, marginBottom: '10px' }}>
                            <span>Sure to LogOut?</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', border: "none", fontSize: '16px', margin: '5px 30px' }}
                                onClick={() => { close(); }} >Return</button>

                            <button className="buttomStandart" style={{ backgroundColor: 'rgba(0, 0, 0, 0)', fontSize: '16px', margin: '5px 30px' }}
                                onClick={() => { logOutAction(), close(); }} >Log Out <FontAwesomeIcon icon={faRightFromBracket} style={{ color: "red", marginLeft: '3px' }} /></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}