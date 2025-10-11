import { useEffect, useRef, useState } from "react";
import avatar from '../../../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { logOutAction } from "../../../../services/deliveryServices/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setIsAdmAuthenticated } from "../../../../redux/admAuthSlice";
import { borderColorTwo, fontColorOne, mainColor, secondColor, secondColorInverse } from "../../../../theme/Colors";
import { setProfileTheme } from "../../../../services/deliveryServices/AUserService";
import { setTheme } from '../../../../redux/viewSlice.js';
import LogoutMessage from "./auxs/LogoutMessage.jsx";

export default function MenuDrawer({ drawerOpen, setDrawerOpen }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.view.theme);

    const [showLogOutMessage, setShowLogOutMessage] = useState(false);
    const dropdownProfileRef = useRef(null);

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('userLoggedProfilePhoto') || null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownProfileRef.current && !dropdownProfileRef.current.contains(event.target)) {
                setShowProfileDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleThemeChange = (theme) => {
        setProfileTheme(theme);
        dispatch(setTheme(theme));
    };

    const buttonStyle = {
        background: "transparent",
        border: "1px solid white",
        color: fontColorOne(theme),
        padding: "8px 16px",
        cursor: "pointer",
        fontSize: "16px",
        marginLeft: "20px",
    };

    const linkStyle = {
        color: fontColorOne(theme),
        textDecoration: "none",
        display: "block",
        padding: "10px 0",
    };
    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s", whiteSpace: "nowrap", position: "absolute", background: mainColor(theme),
                height: '100%', width: '75%', maxWidth: '300px', zIndex: 2, boxShadow: "2px 0 5px rgba(0,0,0,0.3)", top: -5, left: -10, padding: '10px', zIndex: 10000,
            }}>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", }}>
                    <Dropdown ref={dropdownProfileRef} className="nav-item header-profile" show={showProfileDropdown} >
                        <Dropdown.Toggle className="nav-link i-false p-0" as="div" onClick={() => setShowProfileDropdown(!showProfileDropdown)} >
                            <img src={profilePhoto ?? avatar} alt="" width="45" height="45" style={{ borderRadius: '50%', objectFit: 'cover', boxShadow: `-1px 1px 5px ${borderColorTwo(theme, 0.1)}` }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = avatar; }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" style={{ borderRadius: "6px", }}>
                            {/* <div style={{ paddingLeft: "10px", textAlign: "left", cursor: "pointer" }} onClick={() => navigate("/uadm")}>
                                <FontAwesomeIcon icon={faUser} style={{ color: 'black' }} />
                                <span style={{fontSize: '16px', fontWeight: 'bold' }}>Perfil</span>
                            </div> */}
                            <div style={{ paddingLeft: "10px", textAlign: "left", cursor: "pointer" }} onClick={() => { setShowLogOutMessage(true); setShowProfileDropdown(false); }}>
                                <FontAwesomeIcon icon={faRightFromBracket} style={{ color: "red" }} />
                                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>LogOut</span>
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>

                    <button className="floatingButton" style={{ top: 0, left: 5 }}
                        onClick={() => { setDrawerOpen(false); localStorage.removeItem('companyOperatingID'); }}>☰</button>
                </div>

                <hr style={{ margin: "20px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />

                <ul style={{ listStyle: "none", padding: 0, color: fontColorOne(), }}>

                    <hr style={{ margin: "20px 0", border: "none", borderTop: `2px solid ${borderColorTwo(theme)}`, }} />
                    <span style={{ fontSize: '18px', fontWeight: 'bold', }}>Theme</span>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: '100%', marginTop: '10px' }} onClick={() => handleThemeChange(theme === "DARK" ? "LIGHT" : "DARK")}>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '41px' }}>Dark</span>
                        <div class="form-check form-switch" style={{ cursor: 'pointer' }}>
                            <input class="form-check-input" style={{ cursor: 'pointer' }} type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={theme === "LIGHT"} />
                        </div>
                        <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '20px' }}>Light</span>
                    </div>
                    <hr style={{ margin: "20px 0", border: "none", borderTop: `2px solid ${borderColorTwo(theme)}`, }} />

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
            {showLogOutMessage && <div className="myModal" style={{ zIndex: 10000 }} >
                <LogoutMessage close={() => setShowLogOutMessage(false)} />
            </div>}
        </>
    );
}