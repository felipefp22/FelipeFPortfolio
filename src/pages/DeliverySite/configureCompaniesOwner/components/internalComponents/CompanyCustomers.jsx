import { useSelector } from "react-redux";
import { blueOne, borderColorTwo, fontColorOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';


export default function CompanyCustomers({ companyData,}) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);


    return (
        <>
            <div className='menuTransparentCanvas'  >
                {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}
                <span style={{ color: blueOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>
                    Being Implemented - I work on it at my free time ;)</span>

            </div>

            {seeImageBig && <div onClick={() => setSeeImageBig(false)} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
                <img src={seeImageBig} alt="Logo" style={{
                    maxWidth: "90%", maxHeight: "90%", borderRadius: '10px', objectFit: "contain", boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.5)"
                }} />
            </div>}
        </>
    );
}