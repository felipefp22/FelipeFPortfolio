import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, transparentCavasOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import avatar from '../../../../../assets/noProfilePhoto.png';


export default function CompanyEmployees({ companyData, }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);

    const employeePositionsCategories = ["Manager", "Supervisor", "Waiter"];


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%' }} >
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'left', textAlign: 'left', margin: '20px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold' }}>{"Employees"} </span>
                    {/* <span style={{ color: fontColorOne(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold', marginLeft: '15px' }}>{"- "}{companyData?.companyName ?? 'N/A'} </span> */}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    {employeePositionsCategories.map((position, index) => {
                        const [isOpen, setIsOpen] = useState(true);

                        return (
                            <div key={index} style={{ marginBottom: '30px'}}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px',  }}
                                    onClick={() => setIsOpen(!isOpen)}>

                                    <img src={avatar} alt="Logo" style={{
                                        width: isDesktopView ? 50 : !isDesktopView ? 40 : 35, height: isDesktopView ? 50 : !isDesktopView ? 40 : 35,
                                        borderRadius: '50%', marginRight: 10
                                    }} />
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: isDesktopView ? '24px' : '16px', fontWeight: 'bold' }}>{position} </span>
                                        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown}
                                            style={{ fontSize: isDesktopView ? '25px' : '16px', marginRight: isDesktopView ? '20px' : '5px', borderRadius: '4px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                                {isOpen && <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 10px', padding: '15px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>
                                    {/* {compound?.companies?.map((comp, idx) => (
                                        <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }}
                                            onClick={() => { (comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? setOpenShiftModal(comp) : setCompanyToOperate(comp.id)) : setOpenShiftModal(comp)); }}>
                                            <img src={restaurantLogo} alt="Logo" style={{
                                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                                                borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                            }} />
                                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                                <span style={{ fontSize: isDesktopView ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                                <span style={{ fontSize: isDesktopView ? '15px' : '10px', fontWeight: 'bold', marginLeft: '15px', color: comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? redOne(theme) : greenOne(theme)) : redOne(theme) }}>
                                                    {comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? ' Shift closed' : ` Shift ${formatDateToDayMonth(comp?.lastOrOpenShift?.startTimeUTC)}`) : ' Shift closed'} </span>
                                            </div>
                                        </div>
                                    ))} */}
                                </div>}
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
        </>
    );
}