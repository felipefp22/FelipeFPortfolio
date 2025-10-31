import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';


export default function CompanyProfile() {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);

    const [compoundPhoto, setCompoundPhoto] = useState(null);


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }} >
                {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}
                {/* <span>Still not Implemented - It's Skill demonstration APP, I am working on it when I have free time ;)</span> */}

                <div style={{ display: 'flex', flexDirection: 'column', width: isDesktopView? '80%' : '100%', maxWidth: '1000px', justifyContent: 'center', alignItems: 'center', padding: '10px 20px', backgroundColor: "rgba(255, 255, 255, 0.0)" }} >
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }} >
                        <img src={compoundPhoto ?? restaurantLogo} alt="Logo" onClick={() => setSeeImageBig(compoundPhoto)} style={{
                            width: isDesktopView ? '200px' : '120px', height: isDesktopView ? '200px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                            boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: compoundPhoto ? '0px' : (isDesktopView ? '50px' : '20px'),
                        }} />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center' }} >
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginLeft: '40px' }} >
                                <h1 style={{ fontSize: isDesktopView ? '36px' : '18px' }}>Company Name</h1>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isDesktopView? '30px 40px' : '30px 20px', }} >
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Email: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>company@email.com</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Phone: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>(123) 456-7890</span>
                        </div>

                        <br/>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Address: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>123 Main St, City, Country</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Latitude: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>-24,55212524</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Longitude: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>-32,48423241</span>
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