import { useEffect, useRef, useState } from "react";
import avatar from '../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPowerOff, faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, mainColor, secondColor, secondColorInverse } from "../../theme/Colors.js";
import { setProfileTheme } from "../../services/deliveryServices/AUserService.js";
import { setTheme } from '../../redux/viewSlice.js';
import { useNavigate } from "react-router-dom";

export default function MenuDrawer({ drawerOpen, setDrawerOpen, setShowLogOutMessage }) {
    const navigate = useNavigate();
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.view.theme);

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
        padding: "10px 10px",
    };
    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s", whiteSpace: "nowrap", position: "absolute", background: mainColor(theme),
                height: '100%', width: '75%', maxWidth: '300px', zIndex: 2, boxShadow: "2px 0 5px rgba(0,0,0,0.3)", top: 0, padding: '10px', zIndex: 10000,
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

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', textAlign: 'left', }}>
                    <hr style={{ margin: "20px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />

                    <ul style={{ listStyle: "none", padding: 0, color: fontColorOne(), }}>

                        <li><a style={linkStyle} onClick={() => {navigate("/FelipeFPortfolio/delivery/"); setDrawerOpen(false); }}>Operation</a></li>

                        <hr style={{ margin: "20px 0", border: "none", borderTop: `2px solid ${borderColorTwo(theme)}`, }} />

                        <li><a  style={linkStyle} onClick={() => {navigate("/FelipeFPortfolio/delivery/ManageCompaniesOwner"); setDrawerOpen(false); }}>Manage Your Companies</a></li>
                        {/* <li><a href="#" style={linkStyle} onClick={() => navigate("/advertisesnoownerdeactivated")}>Anúncios noOwner Desativados</a></li> */}

                        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', marginTop: '20px' }}>
                            <hr style={{ margin: "3px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />
                            <span style={{ fontSize: '18px', fontWeight: 'bold', padding: '0px 10px' }}>Theme</span>
                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', width: '100%', marginTop: '10px' }} onClick={() => handleThemeChange(theme === "DARK" ? "LIGHT" : "DARK")}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '41px' }}>Dark</span>
                                <div class="form-check form-switch" style={{ cursor: 'pointer' }}>
                                    <input className="form-check-input" style={{ cursor: 'pointer' }} type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={theme === "LIGHT"} onChange={() => {}} />
                                </div>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '20px' }}>Light</span>
                            </div>
                            <hr style={{ margin: "3px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />
                        </div>

                        {/* 
                        {isAdmMasterAuthenticated &&
                            <li><a href="#" style={linkStyle} onClick={() => navigate("/manageadmins")}>Gerenciar Admins</a></li>
                        } */}

                    </ul>
                </div>
            </div>
        </>
    );
}