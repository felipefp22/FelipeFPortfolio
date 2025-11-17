import { use, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logOutAction } from "../../../../../services/deliveryServices/AuthService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";


export default function LeaveCompanyMessage({ close, leaveCompany }) {
    const navigate = useNavigate();
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);
    const dispatch = useDispatch();


    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '20px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", overflowY: "auto", fontSize: !isPcV ? '20px' : '26px', }}>
                <div>
                    <div className='flexColumn fullCenter' style={{ marginBottom: '15px' }}>
                        <span>Leave company?</span>
                    </div>

                    <div className='flexRow spaceBetweenJC' style={{ width: '100%', height: '50px', marginTop: '10px' }}>
                        <button className='buttonStandart' style={{ background: 'none', border: "none", fontSize: '16px', margin: '5px 30px' }}
                            onClick={() => { close(); }} >Return</button>

                        <button className='buttonStandart' style={{ background: 'none',  border: 'none', fontSize: '16px', margin: '5px 30px' }}
                            onClick={() => { leaveCompany(); navigate('/FelipeFPortfolio/delivery'); }}><FontAwesomeIcon icon={faRightFromBracket} flip="horizontal" style={{ color: "red", marginLeft: '3px' }} /> Leave</button>
                    </div>
                </div>
            </div>
        </>
    );
}