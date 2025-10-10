import { use, useEffect, useRef, useState } from "react";
import { Dropdown, Form, Table } from "react-bootstrap";
import { confirmAccount, logOutAction, requestConfirmationCode, updateLocalStorage } from "../../../services/deliveryServices/AuthService";
import { getUserInfos } from "../../../services/deliveryServices/AUserService";
import { useSelector } from "react-redux";
import companiesGroupLogo from '../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import ConfirmEmail from "./components/ConfirmEmail";
import CreateGroupAndCompanyModal from "../system/components/CreateGroupAndCompanyModal";
import avatar from '../../../assets/noProfilePhoto.png';
import MenuDrawer from "./components/MenuDrawer";


export default function UserOptions({ setCompanySelected }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    
    const [firstLoadingUserInfos, setFirstLoadingUserInfos] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(true);


    const [companiesCoumpound, setCompaniesCoumpound] = useState([]);
    const [selectedCompaniesCoumpound, setSelectedCompaniesCoumpound] = useState(null);

    const [companiesUserWorksOn, setCompaniesUserWorksOn] = useState([]);

    const [isEmailConfirmed, setIsEmailConfirmed] = useState(localStorage.getItem('isEmailConfirmed') === 'true' ? true : false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem('userLoggedEmail') || "");

    const [createCompanyModal, setCreateCompanyModal] = useState(false);

    useEffect(() => {
        fetchUserInfos();
    }, []);

    async function fetchUserInfos() {
        const response = await getUserInfos();

        if (response?.status === 200) {
            const userData = response?.data;
            setIsEmailConfirmed(userData?.emailConfirmed || false);

            setName(userData?.name || "");
            setCompaniesCoumpound(userData?.companiesCompounds || []);
            setCompaniesUserWorksOn(userData?.worksAtCompanies || []);
        }
        setFirstLoadingUserInfos(true);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: isDesktopView ? 5 : 3, position: 'relative', }} >
                {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white",  marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => setNewOrderModal(true)}>New Order</button>
                </div> */}

                {drawerOpen && <MenuDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />}

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>
                    <button style={{
                        width: 'auto', alignSelf: "flex-start", top: 0, left: 5, zIndex: 1000, backgroundColor: '#333', border: "2px solid white", color: "white", padding: "5px 10px", boxShadow: "-3px 3px 4px rgba(255, 255, 255, 0.55)",
                        borderRadius: 6, visibility: drawerOpen ? 'hidden' : 'visible', marginBottom: '10px'
                    }}
                        onClick={() => { setDrawerOpen(true); }}>☰</button>

                    {!isEmailConfirmed && <ConfirmEmail fetchUserInfos={() => fetchUserInfos()} />}

                    {isEmailConfirmed && <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.0)", color: "white", padding: '10px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }} >
                        <h3 style={{ color: "white", marginBottom: '10px' }}>Welcome {name ? " - " + name : "Guest"}</h3>

                        <button style={{
                            backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", padding: '8px', borderRadius: '6px', margin: '10px 0px', width: '250px', marginBottom: '20px',
                            opacity: (companiesCoumpound?.length > 0 || !firstLoadingUserInfos) ? 0.5 : 1, cursor: (companiesCoumpound?.length > 0 || !firstLoadingUserInfos) ? 'not-allowed' : 'pointer',
                        }}
                            onClick={() => { setCreateCompanyModal(true); }} disabled={companiesCoumpound?.length > 0 || !firstLoadingUserInfos}>Create Group and Company</button>

                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '24px' : '16px' }}>Your Companies Groups:</span>
                        <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%' }}>

                            {companiesCoumpound?.map((compound, index) => (
                                <div key={index}>
                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '0px', cursor: 'pointer', backgroundColor: "rgba(255, 255, 255, 0.2)", padding: '10px', borderRadius: '6px', }}
                                        onClick={() => setSelectedCompaniesCoumpound(selectedCompaniesCoumpound === compound.id ? null : compound.id)}>

                                        <img src={companiesGroupLogo} alt="Logo" style={{
                                            width: isDesktopView ? 50 : !isDesktopView ? 40 : 35, height: isDesktopView ? 50 : !isDesktopView ? 40 : 35,
                                            borderRadius: '6px', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isDesktopView ? '24px' : '16px', fontWeight: 'bold' }}>{compound.compoundName} </span>
                                            <FontAwesomeIcon icon={selectedCompaniesCoumpound === compound.id ? faSquareCaretUp : faSquareCaretDown}
                                                style={{ fontSize: isDesktopView ? '25px' : '16px', marginRight: isDesktopView ? '20px' : '5px', borderRadius: '4px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                        </div>
                                    </div>
                                    {(selectedCompaniesCoumpound === compound.id) && <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 10px', padding: '15px 10px', borderRadius: '6px', backgroundColor: "rgba(255, 255, 255, 0.1)" }}>
                                        {compound?.companies?.map((comp, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }}
                                                onClick={() => { localStorage.setItem('companyOperatingID', comp.id); setCompanySelected(comp.id); }}>
                                                <img src={restaurantLogo} alt="Logo" style={{
                                                    width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                            ))}
                        </div>


                        {companiesUserWorksOn?.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%', marginTop: '20px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '24px' : '16px' }}>Companies You Work:</span>

                            {companiesUserWorksOn?.map((comp, idx) => (
                                <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 0px', padding: '15px 10px', borderRadius: '6px', backgroundColor: "rgba(255, 255, 255, 0.1)" }}>

                                    <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }}
                                        onClick={() => { localStorage.setItem('companyOperatingID', comp.id); setCompanySelected(comp.id); }}>
                                        <img src={restaurantLogo} alt="Logo" style={{
                                            width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                                            borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isDesktopView ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>}
                </div>

                {createCompanyModal && <div className="myModal" style={{ zIndex: 100 }} >
                    <CreateGroupAndCompanyModal close={() => setCreateCompanyModal(false)} getShiftOperationData={() => getShiftOperationData()} />
                </div>}
            </div >
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