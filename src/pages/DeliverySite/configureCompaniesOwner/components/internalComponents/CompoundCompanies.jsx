import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, transparentCavasOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import supervisorLogo from '../../../../../assets/supervisorLogo.png';
import managerLogo from '../../../../../assets/managerLogo.png';
import waiterLogo from '../../../../../assets/waiterLogo.png';
import avatar from '../../../../../assets/noProfilePhoto.png';
import ModalExample from "./modals/ModalExample";
import CreateCompanyModal from "./modals/CreateCompanyModal";


export default function CompoundCompanies({ compoundSelectedData, fetchUserInfos }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);
    const [createCompanyModalOpen, setCreateCompanyModalOpen] = useState(false);

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px',
                minWidth: '300px', maxWidth: '100%', flexGrow: 1, overflowX: "hidden", overflowY: 'hidden',
            }} >
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '10px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '22px' : '17px', fontWeight: 'bold' }}>{"Employees"} </span>
                    {/* <span style={{ color: fontColorOne(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold', marginLeft: '15px' }}>{"- "}{companyData?.companyName ?? 'N/A'} </span> */}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1, overflowY: 'auto', }}>
                    <div style={{ marginBottom: '15px', marginRight: '10px' }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }}
                            onClick={() => setCreateCompanyModalOpen(compoundSelectedData?.id)}>

                            <div style={{ borderRadius: '50%', backgroundColor: transparentCavasOne(theme), marginRight: 10, padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: "space-between" }} >
                                <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: '500' }}>{`New Company`}</span>
                            </div>
                        </div>
                    </div>
                    {compoundSelectedData?.companies?.map((company, index) => {
                        return (
                            <div key={index} style={{ marginBottom: '15px', marginRight: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }}
                                    onClick={() => setIsOpen(!isOpen)}>

                                    <img src={restaurantLogo} alt="Logo" style={{
                                        width: isDesktopView ? 40 : 30, height: isDesktopView ? 40 : 30, border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`,
                                        borderRadius: '50%', marginRight: 10, backgroundColor: "black", padding: '3px',
                                    }} />
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: 'bold' }}>{company?.companyName ?? "N/A"} </span>
                                        <FontAwesomeIcon icon={faGear} style={{ fontSize: isDesktopView ? '22px' : '18px', marginRight: isDesktopView ? '20px' : '5px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {seeImageBig && <div onClick={() => setSeeImageBig(false)} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
                <img src={seeImageBig} alt="Logo" style={{
                    maxWidth: "90%", maxHeight: "90%", borderRadius: '10px', objectFit: "contain", boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.5)"
                }} />
            </div>}

            {createCompanyModalOpen && <div className="myModal underDeliveryLayout" style={{ zIndex: 100000 }} >
                <CreateCompanyModal close={() => setCreateCompanyModalOpen(false)} compoundID={createCompanyModalOpen} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}