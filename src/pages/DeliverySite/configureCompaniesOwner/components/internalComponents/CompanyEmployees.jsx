import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, transparentCavasOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import supervisorLogo from '../../../../../assets/supervisorLogo.png';
import managerLogo from '../../../../../assets/managerLogo.png';
import waiterLogo from '../../../../../assets/waiterLogo.png';
import avatar from '../../../../../assets/noProfilePhoto.png';
import ModalExample from "./modals/ModalExample";
import AddEmployee from "./modals/AddEmployee";


export default function CompanyEmployees({ companyData, }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);
    const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);

    const employeePositionsCategories = ["Manager", "Supervisor", "Waiter"];

    function getEmployeePositionLogo(position) {
        switch (position) {
            case "Manager":
                return managerLogo;
            case "Supervisor":
                return supervisorLogo;
            case "Waiter":
                return waiterLogo;
            default:
                return supervisorLogo;
        }
    }

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px',
                minWidth: '300px', maxWidth: '100%', flexGrow: 1, overflowX: "hidden", overflowY: 'hidden',
            }} >
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '10px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '22px' : '17px', fontWeight: 'bold' }}>{"Employees"} </span>
                    <button className="buttomDarkGray" style={{
                        padding: '8px', borderRadius: '6px', margin: '10px 0px', width: '250px', marginBottom: '0px',
                        opacity: 1, cursor: 'pointer',
                    }}
                        onClick={() => { setAddEmployeeModalOpen(companyData?.id) }} >Add Employee</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexGrow: 1, overflowY: 'auto', }}>
                    {employeePositionsCategories.map((position, index) => {
                        const [isOpen, setIsOpen] = useState(true);

                        return (
                            <div key={index} style={{ marginBottom: '15px', marginRight: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }}
                                    onClick={() => setIsOpen(!isOpen)}>

                                    <img src={getEmployeePositionLogo(position)} alt="Logo" style={{
                                        width: isDesktopView ? 40 : 30, height: isDesktopView ? 40 : 30,
                                        borderRadius: '50%', marginRight: 10
                                    }} />
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: 'bold' }}>{position} </span>
                                        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown}
                                            style={{ fontSize: isDesktopView ? '20px' : '16px', marginRight: isDesktopView ? '20px' : '5px', borderRadius: '4px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                                {isOpen && <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 10px', padding: '15px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>
                                    {companyData?.employees && companyData.employees.length > 0 ? (
                                        companyData?.employees?.filter((emp) => emp.position?.toLowerCase() === position.toLowerCase()).map((employesFiltered, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }}
                                                onClick={() => { console.log("Clicked employee") }}>

                                                <img src={avatar} alt="Logo" style={{
                                                    width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold' }}>{`${employesFiltered.employeeName} - ${employesFiltered.employeeEmail}`}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold' }}>{`No ${position} Found`} </span>
                                        </div>
                                    )}
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

            {addEmployeeModalOpen && <div className="myModalInsideDeliveryLayout" style={{ zIndex: 10000 }} >
                <AddEmployee close={() => setAddEmployeeModalOpen(false)} companyData={companyData} companyID={addEmployeeModalOpen} positionsOpts={employeePositionsCategories} />
            </div>}
        </>
    );
}