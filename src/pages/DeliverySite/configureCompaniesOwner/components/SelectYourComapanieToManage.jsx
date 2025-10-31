import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import companiesGroupLogo from '../../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGear, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";

export default function SelectYourComapanieToManage({ companiesCoumpound }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);
    const navigate = useNavigate();

    const [createCompanyModal, setCreateCompanyModal] = useState(false);


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', padding: '10px 0px',  borderRadius: '6px', }}>

                {<div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.0)", color: "white", padding: '0px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }} >
                    {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}

                    <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Manage Your Companies</span>
                    <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%' }}>

                        {companiesCoumpound?.map((compound, index) => (
                            <div key={index}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }}
                                    onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/compound/${compound?.id}`); }}>

                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                        <img src={companiesGroupLogo} alt="Logo" style={{
                                            width: isDesktopView ? 50 : !isDesktopView ? 40 : 35, height: isDesktopView ? 50 : !isDesktopView ? 40 : 35,
                                            borderRadius: '6px', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isDesktopView ? '24px' : '16px', fontWeight: 'bold' }}>{compound.compoundName} </span>
                                            <FontAwesomeIcon icon={faGear} style={{ fontSize: '25px', marginRight: isDesktopView ? '20px' : '5px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '0px 5px', padding: '10px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme) }}>
                                    {compound?.companies?.map((comp, idx) => (
                                        <div key={idx} style={{
                                            display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: 5, cursor: 'pointer', minWidth: '160px', maxWidth: '200px', width: '100%', 
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '10px', borderRadius: '6px',
                                        }}
                                            onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/company/${comp?.id}`); }}>
                                            <div style={{ position: 'relative', width: '100%' }} >
                                                <img src={restaurantLogo} alt="Logo" style={{
                                                    width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, marginBottom: 10,
                                                    borderRadius: '6px', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                                }} />
                                                <div style={{ display: 'flex', position: 'absolute', top: -10, right: -12, }}>
                                                    <FontAwesomeIcon icon={faGear} style={{ fontSize: isDesktopView ? '20px' : '15px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: isDesktopView ? '18px' : '14px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 
                        {companiesUserWorksOn?.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%', marginTop: '20px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '24px' : '16px' }}>Companies You Work:</span>

                            {companiesUserWorksOn?.map((comp, idx) => (
                                <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 0px', padding: '15px 10px', borderRadius: '6px', backgroundColor: transparentCavasTwo(theme) }}>

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
                        </div>} */}
                </div>}
            </div>

            {/* {createCompanyModal && <div className="myModal" style={{ zIndex: 100 }} >
                    <CreateGroupAndCompanyModal close={() => setCreateCompanyModal(false)} getShiftOperationData={() => fetchUserInfos()} />
                </div>} */}
        </>
    );
}