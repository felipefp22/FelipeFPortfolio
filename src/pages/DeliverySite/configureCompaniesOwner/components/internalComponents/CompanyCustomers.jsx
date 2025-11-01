import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';


export default function CompanyCustomers({ companyData,}) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%' }} >
                {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}
                {/* <span>Still not Implemented - It's Skill demonstration APP, I am working on it when I have free time ;)</span> */}

                <div style={{ display: 'flex', flexDirection: 'column', width: isDesktopView? '80%' : '100%', maxWidth: '1000px', justifyContent: 'center', alignItems: 'center', padding: '10px 20px', backgroundColor: "rgba(255, 255, 255, 0.0)" }} >
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }} >
                        <img src={restaurantLogo} alt="Logo" onClick={() => setSeeImageBig(restaurantLogo)} style={{
                            width: isDesktopView ? '200px' : '120px', height: isDesktopView ? '200px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                            boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`,
                        }} />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }} >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '40px' }} >
                                <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold' }}>{'Customers'}</span>
                            </div>
                        </div>
                    </div>
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