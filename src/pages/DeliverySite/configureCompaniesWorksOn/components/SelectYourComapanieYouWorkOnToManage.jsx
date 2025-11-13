import { use, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import companiesGroupLogo from '../../../../assets/companiesGroupLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGear, faPlus, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { borderColorTwo, fontColorOne, greenOne, greenTwo, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
import AcceptOrDenyWorksOnCompany from "./internalComponents/modals/AcceptOrDenyWorksOnCompany";


export default function SelectYourComapanieYouWorkOnToManage({ companiesYouWorkOn, fetchUserInfos }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const navigate = useNavigate();

    const [acceptOrDenyWorkInviteModal, setAcceptOrDenyWorkInviteModal] = useState(false);
    const [createCompanyModalOpen, setCreateCompanyModalOpen] = useState(false);

    return (
        <>
            <div className='flexColumn' style={{ textAlign: 'left', width: '100%', height: '100%', overflowY: 'auto', }}>

                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', marginBottom: 15 }}>Manage Companies You Work On</span>

                <div className='flexColumn' style={{ height: '100%', width: '100%', overflowY: 'auto', }} >

                    <div className='menuTransparentCanvas' style={{ textAlign: 'left', width: '100%', borderRadius: 6, alignItems: 'unset' }} >
                            <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : greenOne(theme), fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold', marginBottom: '10px' }}>You Work On</span>

                            {companiesYouWorkOn?.filter(company => company.status === "ACTIVE").length > 0 ? (
                                companiesYouWorkOn?.filter(company => company.status === "ACTIVE").map((company, index) => (
                                    <div key={index} className='transparentCanvas' style={{ padding: '10px', borderRadius: '6px', }} onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesWorkOn/company?id=${company?.id}`); }}>
                                        <div className='flexRow' style={{ width: '100%', justifyContent: 'flex-start' }} >
                                            <img src={companiesGroupLogo} alt="Logo" style={{
                                                width: isPcV ? 50 : !isPcV ? 40 : 35, height: isPcV ? 50 : !isPcV ? 40 : 35,
                                                borderRadius: '50%', backgroundColor: 'black', border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, marginRight: 10, padding: '3px',
                                            }} />
                                            <div className='flexRow spaceBetweenJC' style={{ width: '100%', alignItems: 'center' }}>
                                                <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: 'bold' }}>{company.companyName} </span>
                                                <FontAwesomeIcon icon={faGear} style={{ fontSize: '25px', marginRight: isPcV ? '20px' : '5px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                            </div>
                                        </div>
                                    </div>))
                            ) :
                                (
                                    <div className='transparentCanvas' style={{ marginBottom: '0px', padding: '10px', borderRadius: '6px', }} >
                                        <div className='flexRow' style={{ width: '100%', }} >
                                            <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: 'bold' }}> No Companies Found</span>
                                        </div>
                                    </div>
                                )
                            }

                            <div style={{ borderTop: `2px solid ${fontColorOne(theme)}`, margin: '15px 0', opacity: 0.7, borderRadius: '6px' }} />
                            <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : fontColorOne(theme), fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold', marginBottom: '10px', }}>Invited to Work</span>


                            {companiesYouWorkOn?.filter(company => company.status === "WAITING_ACCEPTANCE").length > 0 ? (
                                companiesYouWorkOn?.filter(company => company.status === "WAITING_ACCEPTANCE").map((company, index) => (
                                    <div key={index} className='transparentCanvas' style={{ padding: '10px', borderRadius: '6px', }} >

                                        <div className='flexRow' style={{ width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                            <img src={companiesGroupLogo} alt="Logo" style={{
                                                width: isPcV ? 50 : !isPcV ? 40 : 35, height: isPcV ? 50 : !isPcV ? 40 : 35,
                                                borderRadius: '50%', backgroundColor: 'black', border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, marginRight: 10, padding: '3px',
                                            }} />
                                            <div className='flexRow spaceBetweenJC' style={{ width: '100%', alignItems: 'center' }}>
                                                <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: 'bold' }}>{company.companyName} </span>

                                                <div style={{ cursor: 'pointer', }} onClick={() => setAcceptOrDenyWorkInviteModal(company)}>
                                                    <span style={{ fontSize: isPcV ? '18px' : '13px', fontWeight: 'bold', color: redOne(theme) }}>{'Deny'} </span>
                                                    <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: 'bold', color: greenTwo(theme) }}>{'/Accept'} </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) :
                                (
                                    <div className='transparentCanvas' style={{ marginBottom: '0px', padding: '10px', borderRadius: '6px', }} >
                                        <div className='flexRow' style={{ width: '100%', }} >
                                            <span style={{ fontSize: isPcV ? '20px' : '14px', fontWeight: 'bold' }}> No Invites Found</span>
                                        </div>
                                    </div>
                                )
                            }

                    </div>
                </div>
            </div>

            {acceptOrDenyWorkInviteModal && <div className='myModal underDeliveryLayout' >
                <AcceptOrDenyWorksOnCompany close={() => setAcceptOrDenyWorkInviteModal(false)} companyData={acceptOrDenyWorkInviteModal} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}