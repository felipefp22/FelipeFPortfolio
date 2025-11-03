import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, greenOne, orangeOne, redOne } from "../../../../../../theme/Colors";
import { borderColorTwo, transparentCavasOne, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import companiesGroupLogo from '../../../../../../assets/companiesGroupLogo.png';
import { createeCompoundService } from "../../../../../../services/deliveryServices/CompoundService";


export default function CreateCompoundModal({ close, fetchUserInfos }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [compoundName, setCompoundName] = useState("");
    const [compoundDescription, setCompoundDescription] = useState("");

    const [disable, setDisable] = useState(false);


    async function handleCreateCompound() {
        if (compoundName?.length > 3 && compoundDescription?.length > 5) {
            setDisable(true);

            const response = await createeCompoundService(compoundName, compoundDescription);

            if (response.status === 200) {
                fetchUserInfos();
                close();
            } else {
                alert("Server error while creating compound. Please try again.");
            }
        } else {
            alert("Please fill all fields correctly.");
        }

        setDisable(false);
    }


    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '10px', width: !isDesktopView ? "95%" : "90%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: ' 6px', width: '100%' }} >

                        <div style={{ display: 'flex', flexDirection: 'column', width: isDesktopView ? '90%' : '100%', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)", }} >
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%', position: 'relative' }} >
                                <img src={companiesGroupLogo} alt="Logo" style={{
                                    width: isDesktopView ? '160px' : '120px', height: isDesktopView ? '160px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                                    boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isDesktopView ? '20px' : '20px',
                                }} />

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', width: '100%' }} >
                                    <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: (disable ? 'transparent' : greenOne(theme)), opacity: 1, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 5, top: 0,
                                    }} onClick={() => { if (!disable) handleCreateCompound(); }} >
                                        {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                                        {disable && <Spinner animation="border" role="status" style={{ width: isDesktopView ? '25px' : '20px', height: isDesktopView ? '25px' : '20px', color: 'white', }} />}
                                    </div>
                                    {!disable && <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: isDesktopView ? 65 : 50, top: 0,
                                    }} onClick={() => { close() }} >
                                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                                    </div>}

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', width: '100%' }} >
                                        <input className="inputOne" type="text" value={compoundName} placeholder="Chain Name"
                                            onChange={(e) => setCompoundName(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', height: isDesktopView ? '50px' : '35px' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isDesktopView ? '30px 20px' : '30px 20px', }} >
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px', width: '100%' }} >
                                    <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                                    <textarea className="textAreaOne" rows={7} style={{width: '100%'}} value={compoundDescription} onChange={(e) => setCompoundDescription(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}