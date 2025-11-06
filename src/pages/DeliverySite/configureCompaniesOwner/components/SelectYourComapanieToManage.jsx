import { use, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import companiesGroupLogo from '../../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGear, faPlus, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { alphaC, borderColorTwo, fontColorOne, greenOne, redOne, transparentCanvasBgOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
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
            <div className='flexColumn' style={{ padding: '10px 0px', borderRadius: '6px', }}>
                {<div className='flexColumn' style={{ padding: 0, minWidth: '300px', maxWidth: '100%' }} >

                    <span style={{ alignSelf: 'flex-start', color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Manage Your Companies</span>
                    <div className='flexColumn' style={{ minWidth: '300px', maxWidth: '100%' }}>

                        <div className='transparentCanvas' style={{ marginBottom: '15px', }} onClick={() => { setCreateCompoundModal(true); }}>
                            <div className='flexRow' style={{ width: '100%', alignItems: 'center' }} >
                                <div className='transparentCanvas fullCenter' style={{ borderRadius: '50%', marginRight: 10, width: '35px', height: '35px' }} >
                                    <FontAwesomeIcon icon={faPlus} style={{ fontSize: '18px', fontWeight: '500', }} />
                                </div>
                                <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                    <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: '500' }}>{`Create New Chain`} </span>
                                </div>
                            </div>
                        </div>

                        {companiesCoumpound?.map((compound, index) => (
                            <div key={index} style={{ marginBottom: "10px" }}>
                                <div className='transparentCanvas' onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/compound?id=${compound?.id}`); }}>

                                    <div className='flexRow' style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                        <img src={companiesGroupLogo} alt="Logo" style={{
                                            width: isPcV ? 50 : !isPcV ? 40 : 35, height: isPcV ? 50 : !isPcV ? 40 : 35,
                                            borderRadius: '50%', backgroundColor: 'black', border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, marginRight: 10, padding: '3px',
                                        }} />
                                        <div className='flexRow spaceBetweenJC fullCenter' style={{ width: '100%' }}>
                                            <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: 'bold' }}>{compound.compoundName} </span>
                                            <FontAwesomeIcon icon={faGear} style={{ fontSize: '25px', opacity: 0.8 }} />
                                        </div>
                                    </div>
                                </div>

                                <div className='flexRow' style={{ margin: '0px 5px', padding: '10px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), justifyContent: isPcV ? 'flex-start' : 'center', flexWrap: 'wrap', }}>

                                    {compound?.companies?.map((comp, idx) => (
                                        <div key={idx} className='transparentCanvas fullCenter' onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/company?id=${comp?.id}`); }}
                                            style={{ flexDirection: 'column', margin: '0px 0px 5px 10px', width: '160px', height: '150px', backgroundColor: alphaC(transparentCanvasBgOne(theme), 0.1), }} >

                                            <div className='flexRow' style={{ position: 'absolute', top: 5, right: 5, }}>
                                                <FontAwesomeIcon icon={faGear} style={{ fontSize: isPcV ? '20px' : '15px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                            </div>
                                            <div style={{ width: '100%' }} >
                                                <img src={restaurantLogo} alt="Logo" style={{
                                                    width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, marginBottom: 10, padding: '3px',
                                                    borderRadius: '50%', backgroundColor: 'black', border: "0px solid white", marginRight: 10
                                                }} />
                                            </div>

                                            <div className='flexRow fullCenter' style={{ width: '100%', }}>
                                                <span style={{ fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                            </div>
                                        </div>
                                    ))}

                                    <div className='transparentCanvas' onClick={() => { setCreateCompanyModalOpen(compound?.id); }}
                                        style={{ flexDirection: 'column', justifyContent: 'center', textAlign: 'center', margin: '0px 0px 5px 10px', cursor: 'pointer', width: '160px', height: '150px', backgroundColor: alphaC(transparentCanvasBgOne(theme), 0.1), }} >

                                        <div className='transparentCanvas fullCenter' style={{ borderRadius: '50%', width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, marginBottom: '10px' }} >
                                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '15px', fontWeight: '500', }} />
                                        </div>

                                        <div className='flexRow fullCenter' style={{ width: '100%', }}>
                                            <span style={{ fontSize: isPcV ? '18px' : '14px', fontWeight: 'bold' }}>{'New Company'} </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>}
            </div>

            {createCompoundModal && <div className='myModal underDeliveryLayout' >
                <CreateCompoundModal close={() => setCreateCompoundModal(false)} fetchUserInfos={() => fetchUserInfos()} />
            </div>}

            {createCompanyModalOpen && <div className='myModal underDeliveryLayout' >
                <CreateCompanyModal close={() => setCreateCompanyModalOpen(false)} compoundID={createCompanyModalOpen} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}