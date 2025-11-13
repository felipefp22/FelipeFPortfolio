import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenTwo, redOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";


export default function CompanyShifts({ companyData, fetchCompanyData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);

    function formatData(isoString) {
        if (isoString === '') return '';
        const date = new Date(isoString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} - ${hours}:${minutes}`;
    }

    return (
        <>
            <div className='menuTransparentCanvas' >

                <div className='flexColumn fullCenter' style={{ backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%', width: '100%' }} >
                    <div className='flexColumn' style={{ alignItems: 'flex-start', width: '100%', height: '100%', justifyContent: 'center' }} >
                        <div className='flexRow fullCenter' style={{ width: '100%' }} >
                            <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '22px' : '16px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>{`Shift - ${companyData?.currentShift?.shiftNumber ?? ""}`}</span>
                            {companyData && <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '22px' : '16px', fontWeight: '500', marginLeft: '5px' }}>{`| ${formatData(companyData?.currentShift?.startTimeUTC).split(" - ")[0]} `}</span>}
                            {/* {companyData?.currentShift?.endTimeUTC && <span style={{ color: redOne(theme), fontSize: isPcV ? '22px' : '18px', fontWeight: 'bold', marginLeft: '5px' }}>{` -- ${formatData(companyData?.currentShift?.endTimeUTC)} `}</span>} */}
                        </div>
                    </div>
                    <br />

                    <div className='flexColumn fullCenter' style={{ width: '100%', height: '100%' }} >
                        <div className='flexRow' style={{ alignItems: 'flex-start', marginLeft: '40px', width: '100%' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: 'bold' }}>{"Shift Number: "}</span>
                            <span style={{ color: greenTwo(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: '500', marginLeft: '15px' }}>{`${companyData?.currentShift?.shiftNumber ?? ""} `}</span>
                        </div>
                        <br />

                        <div className='flexRow' style={{ alignItems: 'flex-start', marginLeft: '40px', width: '100%' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: 'bold' }}>{"Openned: "}</span>
                            <span style={{ color: greenTwo(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: '500', marginLeft: '15px' }}>
                                {`${formatData(companyData?.currentShift?.startTimeUTC ?? '')} - ${companyData?.currentShift?.managerWhoseOpenedShift ?? ""}`}</span>
                        </div>
                        <div className='flexRow' style={{ alignItems: 'flex-start', marginLeft: '40px', width: '100%' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: 'bold' }}>{"Closed: "}</span>
                            <span style={{ color: redOne(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: '500', marginLeft: '15px' }}>
                                {`${companyData?.currentShift?.endTimeUTC ? formatData(companyData?.currentShift?.endTimeUTC) : 'Still Open'} - ${companyData?.currentShift?.employeeClosedShift ?? ""}`}</span>
                        </div>
                        <br />

                        <div className='flexRow' style={{ alignItems: 'flex-start', marginLeft: '40px', width: '100%' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: 'bold' }}>{"Orders on Shift: "}</span>
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '16px' : '13px', fontWeight: '500', marginLeft: '15px' }}>{`${companyData?.currentShift?.orders.length ?? 0} `}</span>
                        </div>
                        <br />

                    </div>
                </div>
            </div>
        </>
    );
}