import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import companiesGroupLogo from '../../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGear, faPlus, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { borderColorTwo, fontColorOne, greenOne, greenTwo, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
import AcceptOrDenyWorksOnCompany from "./internalComponents/modals/AcceptOrDenyWorksOnCompany";


export default function SelectYourComapanieYouWorkOnToManage({ companiesYouWorkOn, fetchUserInfos }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);
    const navigate = useNavigate();

    const [acceptOrDenyWorkInviteModal, setAcceptOrDenyWorkInviteModal] = useState(false);
    const [createCompanyModalOpen, setCreateCompanyModalOpen] = useState(false);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', padding: '10px 0px', borderRadius: '6px', }}>
                {<div style={{ display: 'flex', flexDirection: 'column', backgroundColor: "rgba(255, 255, 255, 0.0)", color: "white", padding: '0px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }} >
                    {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}

                    <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Manage Companies You Work On</span>

                    <div style={{
                        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px',
                        minWidth: '300px', maxWidth: '100%', flexGrow: 1, overflowX: "hidden", overflowY: 'hidden',
                    }} >
                        <div style={{ display: 'flex', flexDirection: 'column', color: "white", minWidth: '300px', width: '100%' }}>
                            <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : greenOne(theme), fontSize: isDesktopView ? '20px' : '16px', fontWeight: 'bold', marginBottom: '10px' }}>You Work On</span>

                            {companiesYouWorkOn?.filter(company => company.status === "ACTIVE").length > 0 ? (
                                companiesYouWorkOn?.filter(company => company.status === "ACTIVE").map((company, index) => (
                                    <div key={index}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }}
                                            onClick={() => { navigate(`/FelipeFPortfolio/delivery/ManageCompaniesWorkOn/company?id=${company?.companyID}`); }}>

                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                                <img src={companiesGroupLogo} alt="Logo" style={{
                                                    width: isDesktopView ? 50 : !isDesktopView ? 40 : 35, height: isDesktopView ? 50 : !isDesktopView ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'black', border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, marginRight: 10, padding: '3px',
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '24px' : '16px', fontWeight: 'bold' }}>{company.companyName} </span>
                                                    <FontAwesomeIcon icon={faGear} style={{ fontSize: '25px', marginRight: isDesktopView ? '20px' : '5px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>))
                            ) :
                                (
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }} >
                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '20px' : '14px', fontWeight: 'bold' }}> No Companies Found</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            <div style={{ borderTop: `2px solid ${fontColorOne(theme)}`, margin: '15px 0', opacity: 0.7, borderRadius: '6px' }} />
                            <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : fontColorOne(theme), fontSize: isDesktopView ? '20px' : '16px', fontWeight: 'bold', marginBottom: '10px', }}>Invited to Work</span>


                            {companiesYouWorkOn?.filter(company => company.status === "WAITING_ACCEPTANCE").length > 0 ? (
                                companiesYouWorkOn?.filter(company => company.status === "WAITING_ACCEPTANCE").map((company, index) => (
                                    <div key={index}>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }} >

                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                                <img src={companiesGroupLogo} alt="Logo" style={{
                                                    width: isDesktopView ? 50 : !isDesktopView ? 40 : 35, height: isDesktopView ? 50 : !isDesktopView ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'black', border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, marginRight: 10, padding: '3px',
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '24px' : '16px', fontWeight: 'bold' }}>{company.companyName} </span>

                                                    <div style={{ cursor: 'pointer', }} onClick={() => setAcceptOrDenyWorkInviteModal(company)}>
                                                        <span style={{ fontSize: isDesktopView ? '18px' : '13px', fontWeight: 'bold', color: redOne(theme) }}>{'Deny'} </span>
                                                        <span style={{ fontSize: isDesktopView ? '20px' : '14px', fontWeight: 'bold', color: greenTwo(theme) }}>{'/Accept'} </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) :
                                (
                                    <div>
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0px',  backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }} >
                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'flex-start' }} >
                                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '20px' : '14px', fontWeight: 'bold' }}> No Invites Found</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>}
            </div>

            {acceptOrDenyWorkInviteModal && <div className="myModalInsideDeliveryLayout" style={{ zIndex: 100 }} >
                <AcceptOrDenyWorksOnCompany close={() => setAcceptOrDenyWorkInviteModal(false)} companyData={acceptOrDenyWorkInviteModal} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}