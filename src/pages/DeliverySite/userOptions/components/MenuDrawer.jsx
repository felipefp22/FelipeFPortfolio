import { useEffect, useRef, useState } from "react";
import avatar from '../../../../assets/noProfilePhoto.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import { logOutAction } from "../../../../services/deliveryServices/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { setIsAdmAuthenticated } from "../../../../redux/admAuthSlice";
import { fontColorOne, mainColor, secondColor } from "../../../../theme/Colors";
import { setProfileTheme } from "../../../../services/deliveryServices/AUserService";
import { setTheme } from '../../../../redux/viewSlice.js';

export default function MenuDrawer({ drawerOpen, setDrawerOpen }) {
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
                            <img src={profilePhoto ?? avatar} alt="" width="45" height="45" style={{ borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = avatar; }} />
                        </Dropdown.Toggle>
                        <Dropdown.Menu align="end" style={{ borderRadius: "6px",  }}>
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

                    <button className="floatingButton" style={{top: 0, left: 5 }}
                        onClick={() => { setDrawerOpen(false); localStorage.removeItem('companyOperatingID'); }}>☰</button>
                </div>

                <hr style={{ margin: "20px 0", border: "none", borderTop: "5px solid rgba(255, 255, 255, 0.2)", }} />

                <ul style={{ listStyle: "none", padding: 0, color: fontColorOne(), }}>

                    <li><a href="#" style={linkStyle} onClick={() => handleThemeChange("LIGHT")}>LightTheme</a></li>
                    <li><a href="#" style={linkStyle} onClick={() => handleThemeChange("DARK")}>DarkTheme</a></li>

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