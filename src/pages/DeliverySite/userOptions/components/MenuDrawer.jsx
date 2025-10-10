import { useRef, useState } from "react";
import avatar from '../../../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { logOutAction } from "../../../../services/deliveryServices/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setIsAdmAuthenticated } from "../../../../redux/admAuthSlice";

export default function MenuDrawer({ drawerOpen, setDrawerOpen }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();

    const dropdownProfileRef = useRef(null);

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('userLoggedProfilePhoto') || null);



    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s", whiteSpace: "nowrap", position: "absolute", background: "linear-gradient(135deg, #484848ff, #26265aff)",
                height: '100%', width: '75%', maxWidth: '300px', zIndex: 2, boxShadow: "2px 0 5px rgba(0,0,0,0.3)", top: -5, left: -10, padding: '10px'
            }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                    <Dropdown ref={dropdownProfileRef} className="nav-item header-profile" show={showProfileDropdown} >
                        <Dropdown.Toggle className="nav-link i-false p-0" as="div" onClick={() => setShowProfileDropdown(!showProfileDropdown)} >
                            <img src={profilePhoto ?? avatar} alt="" width="45" height="45" style={{ borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = avatar; }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" style={{ borderRadius: "6px" }}>
                            {/* <div style={{ paddingLeft: "10px", textAlign: "left", cursor: "pointer" }} onClick={() => navigate("/uadm")}>
                                <FontAwesomeIcon icon={faUser} style={{ color: 'black' }} />
                                <span className="ms-2">Perfil</span>
                            </div> */}
                            <div style={{ paddingLeft: "10px", textAlign: "left", cursor: "pointer" }} onClick={() => { dispatch(setIsAdmAuthenticated(false)); logOutAction(); }}>
                                <FontAwesomeIcon icon={faRightFromBracket} style={{ color: "red" }} />
                                <span className="ms-2">LogOut</span>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    <button style={{ top: 0, left: 5, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)", borderRadius: 6 }}
                        onClick={() => { setDrawerOpen(false); localStorage.removeItem('companyOperatingID'); }}>☰</button>
                </div>

                <hr style={{ margin: "20px 0", border: "none", borderTop: "5px solid rgba(238, 238, 238, 0.98)", }} />

                <ul style={{ listStyle: "none", padding: 0 }}>

                    {/* <li><a href="#" style={linkStyle} onClick={() => navigate("/admusers")}>Usuários</a></li>

                    <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid rgba(238, 238, 238, 0.98)", }} />

                    <li><a href="#" style={linkStyle} onClick={() => navigate("/advertisesnoowner")}>Anúncios noOwner</a></li>
                    <li><a href="#" style={linkStyle} onClick={() => navigate("/advertisesnoownerdeactivated")}>Anúncios noOwner Desativados</a></li>

                    <hr style={{ margin: "20px 0", border: "none", borderTop: "1px solid rgba(238, 238, 238, 0.98)", }} /> */}
                    {/* 
                        {isAdmMasterAuthenticated &&
                            <li><a href="#" style={linkStyle} onClick={() => navigate("/manageadmins")}>Gerenciar Admins</a></li>
                        } */}

                </ul>
            </div>
        </>
    );
}

const buttonStyle = {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "20px",
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "block",
    padding: "10px 0",
};
