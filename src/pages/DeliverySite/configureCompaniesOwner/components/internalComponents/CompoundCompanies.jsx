import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus,} from "@fortawesome/free-solid-svg-icons";
import CreateCompanyModal from "./modals/CreateCompanyModal";


export default function CompoundCompanies({ compoundSelectedData, fetchUserInfos }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);
    const [createCompanyModalOpen, setCreateCompanyModalOpen] = useState(false);

    return (
        <>
            <div className='flexColumn fullCenter' style={{ backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%' }} >
                <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '10px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{"Employees"} </span>
                </div>

                <div className='flexColumn' style={{ width: '100%', flexGrow: 1, overflowY: 'auto', }}>
                    <div className='transparentCanvas' style={{ marginBottom: '15px', }} onClick={() => { setCreateCompoundModal(true); }}>
                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }} >
                            <div className='transparentCanvas fullCenter' style={{ borderRadius: '50%', marginRight: 10, }} >
                                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                            </div>
                            <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: '500' }}>{`New Company`}</span>
                            </div>
                        </div>
                    </div>
                    {compoundSelectedData?.companies?.map((company, index) => {
                        return (
                            <div key={index} style={{ marginBottom: '15px' }}>
                                <div className='transparentCanvas' onClick={() => setIsOpen(!isOpen)}>

                                    <img src={restaurantLogo} alt="Logo" style={{
                                        width: isPcV ? 40 : 30, height: isPcV ? 40 : 30, border: `0px solid ${borderColorTwo(theme)}`, boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`,
                                        borderRadius: '50%', marginRight: 10, backgroundColor: "black", padding: '3px',
                                    }} />
                                    <div className='flexRow' style={{ width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold' }}>{company?.companyName ?? "N/A"} </span>
                                        <FontAwesomeIcon icon={faGear} style={{ fontSize: isPcV ? '22px' : '18px', marginRight: isPcV ? '20px' : '5px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {createCompanyModalOpen && <div className='myModal underDeliveryLayout' >
                <CreateCompanyModal close={() => setCreateCompanyModalOpen(false)} compoundID={createCompanyModalOpen} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}