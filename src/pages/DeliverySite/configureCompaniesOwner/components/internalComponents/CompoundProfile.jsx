import { useSelector } from "react-redux";
import { borderColorTwo, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useEffect, useState } from "react";
import companiesGroupLogo from '../../../../../assets/companiesGroupLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "react-bootstrap";
import { updateCompoundService } from "../../../../../services/deliveryServices/CompoundService";


export default function CompoundProfile({ compoundSelectedData, fetchUserInfos }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);

    const [compoundID, setCompoundID] = useState(null);
    const [compoundPhoto, setCompoundPhoto] = useState(null);
    const [compoundName, setCompoundName] = useState(null);
    const [compoundDescription, setCompoundDescription] = useState(null);

    const [editing, setEditing] = useState(false);
    const [disable, setDisable] = useState(false);

    useEffect(() => {
        if (compoundSelectedData) {
            getDatasFromCompoundData();
        } else {
            // fetchUserInfos();
        }
    }, [compoundSelectedData]);

    async function getDatasFromCompoundData() {
        setCompoundID(compoundSelectedData?.id || null);
        setCompoundPhoto(compoundSelectedData?.urlCompanyLogo || null);
        setCompoundName(compoundSelectedData?.compoundName || null);
        setCompoundDescription(compoundSelectedData?.compoundDescription || null);
    }

    async function handleUpdateCompound() {
        if (compoundSelectedData?.compoundName !== compoundName || compoundSelectedData?.compoundDescription !== compoundDescription) {

            setDisable(true);
            const response = await updateCompoundService(compoundID, compoundName, compoundDescription);

            if (response?.status === 200) {
                fetchUserInfos();
            } else {
                getDatasFromCompoundData();
                alert("Error updating compound data on server");
            }
            setDisable(false);
        }
        setEditing(false);
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%' }} >
                {/* <span style={{ color: fontColorOne(theme), fontSize: '26px', fontWeight: 'bold', marginBottom: '10px' }}>Manage Your Companies</span> */}
                {/* <span>Still not Implemented - It's Skill demonstration APP, I am working on it when I have free time ;)</span> */}

                <div style={{ display: 'flex', flexDirection: 'column', width: isDesktopView ? '80%' : '100%', maxWidth: '1000px', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)" }} >
                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%' }} >
                        <img src={compoundPhoto ?? companiesGroupLogo} alt="Logo" onClick={() => setSeeImageBig(compoundPhoto)} style={{
                            width: isDesktopView ? '200px' : '120px', height: isDesktopView ? '200px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                            boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: compoundPhoto ? '0px' : (isDesktopView ? '50px' : '20px'),
                        }} />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', position: 'relative' }} >
                            <div style={{
                                display: 'flex', borderRadius: '50%', backgroundColor: editing ? (disable ? 'transparent' : greenOne(theme)) : transparentCavasOne(theme), opacity: editing ? 1 : 1, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 5, top: 0,
                            }} onClick={() => { editing ? handleUpdateCompound() : setEditing(true) }} >
                                {!disable && <FontAwesomeIcon icon={editing ? faCheck : faPen} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                                {disable && <Spinner animation="border" role="status" style={{ width: isDesktopView ? '25px' : '20px', height: isDesktopView ? '25px' : '20px', color: 'white', }} />}
                            </div>
                            {editing && !disable && <div style={{
                                display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: isDesktopView ? 65 : 50, top: 0,
                            }} onClick={() => { getDatasFromCompoundData(); setEditing(false); }} >
                                <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                            </div>}

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }} >
                                {!editing && <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold' }}>{compoundSelectedData?.compoundName ?? 'N/A'}</span>}
                                {editing && <input className="inputOne" type="text" value={compoundName || ""} onChange={(e) => setCompoundName(e.target.value)} style={{ fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold', textAlign: 'center', height: isDesktopView ? '50px' : '35px' }} />}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isDesktopView ? '30px 40px' : '30px 20px', }} >
                        {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Email: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{compoundSelectedData?.email ?? 'N/A'}</span>
                        </div> */}
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                            {!editing && <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{compoundSelectedData?.compoundDescription ?? "N/A"}</span>}
                            {editing && <textarea className="textAreaOne" rows={7} value={compoundDescription || ""} onChange={(e) => setCompoundDescription(e.target.value)} />}
                        </div>

                        {/* <br /> */}
                        {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Address: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>123 Main St, City, Country</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Latitude: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>-24,55212524</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Longitude: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}></span>
                        </div> */}

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