import { useEffect, useRef, useState } from "react";
import avatar from '../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, mainColor, secondColor, secondColorInverse } from "../../theme/Colors.js";
import { setProfileTheme } from "../../services/deliveryServices/AUserService.js";
import { setTheme } from '../../redux/viewSlice.js';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import brazilFlag from '../../assets/brazilFlag.png'
import usaFlag from '../../assets/usaFlag.png';


export default function MenuDrawer({ drawerOpen, setDrawerOpen, setShowLogOutMessage }) {
    const navigate = useNavigate();
    const isPcV = useSelector((state) => state.view.isPcV);
    const dispatch = useDispatch();
    const theme = useSelector((state) => state.view.theme);
    const { t, i18n } = useTranslation();

    const dropdownProfileRef = useRef(null);

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(localStorage.getItem('userLoggedProfilePhoto') || null);

    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };


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
        cursor: "pointer",
    };
    return (
        <>
            <div className='flexColumn' style={{
                opacity: drawerOpen ? 1 : 0, transition: "opacity 0.3s", whiteSpace: "nowrap", position: "absolute", background: mainColor(theme),
                height: '100%', width: '75%', maxWidth: '300px', boxShadow: "2px 0 5px rgba(0,0,0,0.3)", top: 0, padding: '10px', zIndex: 100,
            }}>

                <div className='flexRow spaceBetweenJC' style={{ alignItems: "center", }}>
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

                    <button className='floatingButton' style={{ top: 0, left: 5 }}
                        onClick={() => { setDrawerOpen(false); localStorage.removeItem('companyOperatingID'); }}>☰</button>
                </div>

                <div className='flexColumn' style={{ justifyContent: 'flex-start', textAlign: 'left', }}>
                    <hr style={{ margin: "20px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />

                    <ul style={{ listStyle: "none", padding: 0, color: fontColorOne(), }}>

                        <li><a style={linkStyle} onClick={() => { navigate("/FelipeFPortfolio/delivery/"); setDrawerOpen(false); }}>Work now!</a></li>

                        <hr style={{ margin: "20px 0", border: "none", borderTop: `2px solid ${borderColorTwo(theme)}`, }} />

                        <li><a style={linkStyle} onClick={() => { navigate("/FelipeFPortfolio/delivery/ManageCompaniesOwner"); setDrawerOpen(false); }}>Manage You Companies</a></li>
                        <li><a style={linkStyle} onClick={() => { navigate("/FelipeFPortfolio/delivery/ManageCompaniesWorkOn"); setDrawerOpen(false); }}>Companies You Work On</a></li>

                        {/* <li><a href="#" style={linkStyle} onClick={() => navigate("/advertisesnoownerdeactivated")}>Anúncios noOwner Desativados</a></li> */}

                        <div className='flexColumn' style={{ justifyContent: 'center', textAlign: 'center', marginTop: '20px' }}>
                            <hr style={{ margin: "3px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />
                            <span style={{ fontSize: '18px', fontWeight: 'bold', padding: '0px 10px' }}>Theme</span>
                            <div className='flexRow fullCenter' style={{ cursor: 'pointer', width: '100%', marginTop: '10px' }} onClick={() => handleThemeChange(theme === "DARK" ? "LIGHT" : "DARK")}>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '41px' }}>Dark</span>
                                <div className="form-check form-switch" style={{ cursor: 'pointer' }}>
                                    <input className="form-check-input" style={{ cursor: 'pointer' }} type="checkbox" role="switch" id="flexSwitchCheckChecked" checked={theme === "LIGHT"} onChange={() => { }} />
                                </div>
                                <span style={{ fontSize: '18px', fontWeight: 'bold', marginLeft: '20px' }}>Light</span>
                            </div>
                            <hr style={{ margin: "3px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />
                        </div>

                        <div className='flexColumn fullCenter' style={{ marginTop: '20px' }}>
                            <div className='flexRow' >
                                <div className='flexRow' style={{ cursor: 'pointer', alignItems: 'center', marginRight: '20px' }} onClick={() => changeLanguage('pt')} >
                                    <img src={brazilFlag} alt="Logo" style={{ width: isPcV ? 40 : 30, height: isPcV ? 40 : 30, borderRadius: '50%', border: i18n.language?.split("-")[0] === 'pt' ? "2px solid white" : "2px solid transparent" }} />
                                    <h4 style={{ marginLeft: '10px', textDecoration: i18n.language?.split("-")[0] === 'pt' ? 'underline' : 'none' }}>{"PT"}</h4>
                                </div>
                                <div className='flexRow' style={{ cursor: 'pointer', alignItems: 'center', }} onClick={() => changeLanguage('en')}>
                                    <img src={usaFlag} alt="Logo" style={{ width: isPcV ? 40 : 30, height: isPcV ? 40 : 30, borderRadius: '50%', border: i18n.language?.split("-")[0] === 'en' ? "2px solid white" : "2px solid transparent" }} />
                                    <h4 style={{ marginLeft: '10px', textDecoration: i18n.language?.split("-")[0] === 'en' ? 'underline' : 'none', }}>{"EN"}</h4>
                                </div>
                            </div>
                        </div>
                        <hr style={{ margin: "10px 0", border: "none", borderTop: `5px solid ${borderColorTwo(theme)}`, }} />

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