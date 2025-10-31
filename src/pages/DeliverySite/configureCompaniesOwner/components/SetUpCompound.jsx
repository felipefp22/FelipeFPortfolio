import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, redOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";


export default function SetUpCompound({ compoundSelectedID }) {
    const navigate = useNavigate();
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);



    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', padding: '10px 5px', borderRadius: '6px', }}>
                <div style={{ display: 'flex', flexDirection: 'row' }} >
                    <button className='floatingButton' style={{ backgroundColor: redOne(theme), height: '40px', marginRight: '10px' }} onClick={() => navigate('/FelipeFPortfolio/delivery/ManageCompaniesOwner/')} >
                        <FontAwesomeIcon icon={faRightFromBracket} flip="horizontal" style={{ color: "white" }} />
                    </button>
                    <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', marginBottom: '25px' }}>Settings - Your Compound</span>
                </div>


                {<div style={{ display: 'flex', flexDirection: 'column', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '6px', minWidth: '300px', maxWidth: '100%' }} >
                    {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}
                    <span>Still not Implemented - It's Skill demonstration APP, I am working on it when I have free time ;)</span>
                </div>}
            </div >
        </>
    );
}