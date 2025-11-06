import { useSelector } from "react-redux";
import { borderColorTwo, greenTwo, redOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import supervisorLogo from '../../../../../assets/supervisorLogo.png';
import managerLogo from '../../../../../assets/managerLogo.png';
import waiterLogo from '../../../../../assets/waiterLogo.png';
import avatar from '../../../../../assets/noProfilePhoto.png';
import AddEmployeeModal from "./modals/AddEmployeeModal";
import EditEmployeeModal from "./modals/EditEmployeeModal";


export default function CompanyEmployees({ companyData, fetchCompanyData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    const [addEmployeeModalOpen, setAddEmployeeModalOpen] = useState(false);
    const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState(false);

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
            <div className='flexColumn fullCenter' style={{ backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%', maxHeight: '640px' }} >

                <div className='flexRow' style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: '22px', fontWeight: 'bold' }}>{"Employees"} </span>
                    <button className='buttomStandart' onClick={() => { setAddEmployeeModalOpen(true) }} >Add Employee</button>
                </div>

                <div className='flexColumn' style={{ width: '100%', flexGrow: 1, overflowY: 'auto', }}>
                    {employeePositionsCategories.map((position, index) => {
                        const [isOpen, setIsOpen] = useState(true);

                        return (
                            <div key={index} style={{ marginBottom: '15px', marginRight: '10px' }}>
                                <div className='transparentCanvas' style={{ width: '100%', borderRadius: '6px', }} onClick={() => setIsOpen(!isOpen)}>

                                    <img src={getEmployeePositionLogo(position)} alt="Logo" style={{
                                        width: isPcV ? 40 : 30, height: isPcV ? 40 : 30,
                                        borderRadius: '50%', marginRight: 10
                                    }} />
                                    <div className='flexRow' style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold' }}>{position} </span>
                                        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown}
                                            style={{ fontSize: isPcV ? '20px' : '16px', marginRight: isPcV ? '20px' : '5px', borderRadius: '4px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                                {isOpen && <div className='flexColumn' style={{ margin: '0px 10px', padding: '15px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>
                                    {companyData?.employees && companyData.employees.length > 0 ? (
                                        companyData?.employees?.filter((emp) => emp.position?.toLowerCase() === position.toLowerCase()).map((employesFiltered, idx) => (
                                            <div key={idx} className='flexRow' style={{ alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }} onClick={() => { setEditEmployeeModalOpen(employesFiltered); }}>

                                                <img src={avatar} alt="Logo" style={{
                                                    width: isPcV ? 40 : 35, height: isPcV ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                                                }} />
                                                <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold' }}>{`${employesFiltered.employeeName} - ${employesFiltered.employeeEmail}`}</span>
                                                    <span style={{
                                                        fontSize: isPcV ? '14px' : '12px', marginLeft: '10px', fontWeight: 'bold',
                                                        color: employesFiltered.status === 'ACTIVE' ? greenTwo(theme) : redOne(theme)
                                                    }}>{`*${employesFiltered?.status?.split('_')[0]}`}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold' }}>{`No ${position} Found`} </span>
                                        </div>
                                    )}
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {addEmployeeModalOpen && <div className='myModal underDeliveryLayout' >
                <AddEmployeeModal close={() => setAddEmployeeModalOpen(false)} companyData={companyData} positionsOpts={employeePositionsCategories} fetchCompanyData={() => fetchCompanyData()} />
            </div>}

            {editEmployeeModalOpen && <div className='myModal underDeliveryLayout' >
                <EditEmployeeModal close={() => setEditEmployeeModalOpen(false)} companyData={companyData} employeeData={editEmployeeModalOpen} positionsOpts={employeePositionsCategories} fetchCompanyData={() => fetchCompanyData()} />
            </div>}
        </>
    );
}