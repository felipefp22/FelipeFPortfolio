import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import companiesGroupLogo from '../../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGear, faPlus, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { alphaC, borderColorTwo, fontColorOne, greenOne, redOne, transparentCanvasBgOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
import ModalExample from "./internalComponents/modals/ModalExample";
import CreateCompanyModal from "./internalComponents/modals/CreateCompanyModal";
import CreateCompoundModal from "./internalComponents/modals/CreateCompoundModal";

export default function SelectYourComapanieToManage({ companiesCoumpound, fetchUserInfos }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const navigate = useNavigate();

    const [createCompoundModal, setCreateCompoundModal] = useState(false);
    const [createCompanyModalOpen, setCreateCompanyModalOpen] = useState(false);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', padding: '10px 0px', borderRadius: '6px', }}>

                {<div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.0)", color: "white", padding: '0px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }} >
                    {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}

                    <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Manage Your Companies</span>
                    <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%' }}>

                        <div className="transparentCanvas" style={{ marginBottom: '15px', cursor: 'pointer', }}
                            onClick={() => { setCreateCompoundModal(true); }}>

                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                <div style={{ borderRadius: '50%', backgroundColor: transparentCavasOne(theme), marginRight: 10, padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '35px', height: '35px' }} >
                                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '18px', fontWeight: '500', }} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                    <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: '500' }}>{`Create New Chain`} </span>
                                </div>
                            </div>
                        </div>

                        {companiesCoumpound?.map((compound, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <div className="transparentCanvas" style={{ cursor: 'pointer', }}
                                    onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/compound?id=${compound?.id}`); }}>

                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                        <img src={companiesGroupLogo} alt="Logo" style={{
                                            width: isPcV ? 50 : !isPcV ? 40 : 35, height: isPcV ? 50 : !isPcV ? 40 : 35,
                                            borderRadius: '50%', backgroundColor: 'black', border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, marginRight: 10, padding: '3px',
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: 'bold' }}>{compound.compoundName} </span>
                                            <FontAwesomeIcon icon={faGear} style={{ fontSize: '25px', marginRight: isPcV ? '20px' : '5px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                        </div>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex', flexDirection: 'row', alignItems: 'center', margin: '0px 5px', padding: '10px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme),
                                    justifyContent: isPcV ? 'flex-start' : 'center', flexWrap: 'wrap',
                                }}>

                                    {compound?.companies?.map((comp, idx) => (
                                        <div key={idx} className="transparentCanvas" onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/company?id=${comp?.id}`); }}
                                            style={{ flexDirection: 'column', justifyContent: 'center', textAlign: 'center', margin: '0px 0px 5px 10px', cursor: 'pointer', width: '160px', height: '150px', backgroundColor: alphaC(transparentCanvasBgOne(theme), 0.1), }} >

                                            <div style={{ display: 'flex', position: 'absolute', top: 5, right: 5, }}>
                                                <FontAwesomeIcon icon={faGear} style={{ fontSize: isPcV ? '20px' : '15px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                            </div>
                                            <div style={{ width: '100%' }} >
                                                <img src={restaurantLogo} alt="Logo" style={{
                                                    width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, marginBottom: 10, padding: '3px',
                                                    borderRadius: '50%', backgroundColor: 'black', border: "0px solid white", marginRight: 10
                                                }} />
                                            </div>

                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                                <span style={{ fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className="transparentCanvas" onClick={() => { setCreateCompanyModalOpen(compound?.id); }}
                                        style={{ flexDirection: 'column', justifyContent: 'center', textAlign: 'center', margin: '0px 0px 5px 10px', cursor: 'pointer', width: '160px', height: '150px', backgroundColor: alphaC(transparentCanvasBgOne(theme), 0.1), }} >

                                        <div className="transparentCanvas" style={{
                                            borderRadius: '50%', alignItems: 'center', justifyContent: 'center',
                                            width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, marginBottom: '10px'
                                        }} >
                                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                                        </div>

                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold' }}>{'New Company'} </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 
                        {companiesUserWorksOn?.length > 0 && <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', maxWidth: '100%', marginTop: '20px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: isPcV ? '24px' : '16px' }}>Companies You Work:</span>

                            {companiesUserWorksOn?.map((comp, idx) => (
                                <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 0px', padding: '15px 10px', borderRadius: '6px', backgroundColor: transparentCavasTwo(theme) }}>

                                    <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }}
                                        onClick={() => { localStorage.setItem('companyOperatingID', comp.id); setCompanySelected(comp.id); }}>
                                        <img src={restaurantLogo} alt="Logo" style={{
                                            width: isPcV ? 40 : 35, height: isPcV ? 40 : 35,
                                            borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>} */}
                </div>}
            </div>

            {createCompoundModal && <div className="myModal underDeliveryLayout" style={{ zIndex: 100 }} >
                <CreateCompoundModal close={() => setCreateCompoundModal(false)} fetchUserInfos={() => fetchUserInfos()} />
            </div>}

            {createCompanyModalOpen && <div className="myModal underDeliveryLayout" style={{ zIndex: 100 }} >
                <CreateCompanyModal close={() => setCreateCompanyModalOpen(false)} compoundID={createCompanyModalOpen} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}