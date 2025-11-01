import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import CompoundProfile from "./internalComponents/CompoundProfile";
import { useEffect, useState } from "react";


export default function SetUpCompound({ compoundSelectedID, companiesCoumpound, fetchUserInfos }) {
    const navigate = useNavigate();
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [compoundSelectedData, setCompoundSelectedData] = useState(null);
    const menuOptions = ["Chain Profile", "Companies"];

    const [menuSelected, setMenuSelected] = useState(menuOptions[0]);

    useEffect(() => {
        const compoundData = companiesCoumpound.find(compound => compound.id === compoundSelectedID);
        setCompoundSelectedData(compoundData);
    }, [compoundSelectedID, companiesCoumpound]);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', padding: '10px 5px', borderRadius: '6px', }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '25px'  }} >
                    <button className='floatingButton' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: greenOne(theme), height: '29px', width: '29px', marginRight: '10px' }} onClick={() => navigate('/FelipeFPortfolio/delivery/ManageCompaniesOwner/')} >
                        <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white", margin: 'auto', fontSize: '12px' }} />
                    </button>
                    <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold' }}>Settings - Your Chain</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', }} >
                    {menuOptions?.map((option, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} >
                            <div style={{ padding: '5px 10px', backgroundColor: menuSelected === option ? transparentCavasOne(theme) : 'transparent', borderRadius: '3px', cursor: 'pointer' }}
                                onClick={() => setMenuSelected(option)} >
                                <span style={{ color: fontColorOne(theme), fontWeight: 'bold', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>{option}</span>
                                {menuSelected === option && <div style={{ backgroundColor: fontColorOne(theme), opacity: '0.7', width: '100%', margin: 'auto 0px', height: '2px', borderRadius: '3px' }} />}
                            </div>
                            <div style={{ backgroundColor: fontColorOne(theme), opacity: '0.7', width: '2px', margin: 'auto 4px', height: '90%', borderRadius: '3px' }} />
                        </div>
                    ))}
                </div>

                <div style={{ backgroundColor: fontColorOne(theme), opacity: '0.7', width: '100%', marginTop: '10px', height: '6px', borderRadius: '1px 1px 0px 0px', marginBottom: '0px', }} />

                {menuSelected === 'Chain Profile' && <CompoundProfile compoundSelectedData={compoundSelectedData} />}

            </div >
        </>
    );
}