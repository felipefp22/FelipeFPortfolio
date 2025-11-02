import { useSelector } from "react-redux";
import { borderColorTwo, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { use, useEffect, useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { updateCompanyService } from "../../../../../services/deliveryServices/CompanySevice";
import { Spinner } from "react-bootstrap";
import ModalExample from "./modals/ModalExample";
import EditCompanyAddress from "./modals/EditCompanyAddress";


export default function CompanyProfile({ companyData, fetchCompanyData }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);

    const [companyID, setCompanyID] = useState(null);
    const [compoundPhoto, setCompoundPhoto] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [companyEmail, setCompanyEmail] = useState(null);
    const [companyPhone, setCompanyPhone] = useState(null);
    const [companyAddress, setCompanyAddress] = useState(null);
    const [companyLat, setCompanyLat] = useState(null);
    const [companyLng, setCompanyLng] = useState(null);
    const [numberOfTables, setNumberOfTables] = useState(null);

    const [disable, setDisable] = useState(false);
    const [editing, setEditing] = useState(false);

    const [editAddressModalOpen, setEditAddressModalOpen] = useState(false);

    useEffect(() => {
        if (companyData) {
            getDatasFromCompanyData();
        }
    }, [companyData]);

    async function getDatasFromCompanyData() {
        setCompanyID(companyData?.id || null);
        setCompoundPhoto(companyData?.urlCompanyLogo || null);
        setCompanyName(companyData?.companyName || null);
        setCompanyEmail(companyData?.companyEmail || null);
        setCompanyPhone(companyData?.companyPhone || null);
        setCompanyAddress(companyData?.companyAddress || null);
        setCompanyLat(companyData?.companyLat || null);
        setCompanyLng(companyData?.companyLng || null);
        setNumberOfTables(companyData?.numberOfTables || null);
    }

    async function handleUpdateCompany() {
        if (companyData?.companyName !== companyName || companyData?.companyEmail !== companyEmail ||
            companyData?.companyPhone !== companyPhone || companyData?.companyAddress !== companyAddress ||
            companyData?.companyLat !== companyLat || companyData?.companyLng !== companyLng ||
            companyData?.numberOfTables !== numberOfTables) {

            setDisable(true);
            const response = await updateCompanyService(companyID, companyName, companyEmail, companyPhone, companyAddress, companyLat, companyLng, numberOfTables);

            if (response?.status === 200) {
                fetchCompanyData();
            } else {
                alert("Error updating company data on server");
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
                        <img src={compoundPhoto ?? restaurantLogo} alt="Logo" onClick={() => setSeeImageBig(compoundPhoto)} style={{
                            width: isDesktopView ? '200px' : '120px', height: isDesktopView ? '200px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                            boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: compoundPhoto ? '0px' : (isDesktopView ? '50px' : '20px'),
                        }} />

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', position: 'relative' }} >
                            <div style={{
                                display: 'flex', borderRadius: '50%', backgroundColor: editing ? (disable ? 'transparent' : greenOne(theme)) : transparentCavasOne(theme), opacity: editing ? 1 : 1, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 5, top: 0,
                            }} onClick={() => { editing ? handleUpdateCompany() : setEditing(true) }} >
                                {!disable && <FontAwesomeIcon icon={editing ? faCheck : faPen} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                                {disable && <Spinner animation="border" role="status" style={{ width: isDesktopView ? '25px' : '20px', height: isDesktopView ? '25px' : '20px', color: 'white', }} />}
                            </div>
                            {editing && !disable && <div style={{
                                display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: isDesktopView ? 65 : 50, top: 0,
                            }} onClick={() => { getDatasFromCompanyData(); setEditing(false); }} >
                                <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                            </div>}

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }} >
                                {!editing && <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold' }}>{companyData?.companyName ?? 'N/A'}</span>}
                                {editing && <input className="inputOne" type="text" value={companyName || ""} onChange={(e) => setCompanyName(e.target.value)} style={{ fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold', textAlign: 'center', height: isDesktopView ? '50px' : '35px' }} />}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isDesktopView ? '30px 40px' : '30px 20px', }} >
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Email: </span>
                            {!editing && <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{companyEmail ?? "N/A"}</span>}
                            {editing && <input className="inputOne" type="text" value={companyEmail || ""} onChange={(e) => setCompanyEmail(e.target.value)} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Phone: </span>
                            {!editing && <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{companyPhone ?? "N/A"}</span>}
                            {editing && <input className="inputOne" type="text" value={companyPhone || ""} onChange={(e) => setCompanyPhone(e.target.value)} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Tables Qty: </span>
                            {!editing && <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{numberOfTables ?? "N/A"}</span>}
                            {editing && <select className="inputOne" value={numberOfTables || 0} onChange={(e) => setNumberOfTables(Number(e.target.value))} style={{ maxWidth: '120px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                {Array.from({ length: 301 }, (_, i) => (
                                    <option key={i} value={i}>{i}</option>
                                ))}
                            </select>}
                        </div>

                        <br />
                        {/* <div style={{ display: 'flex', flexDirection: 'column', borderTop: `2px solid ${borderColorTwo(theme)}`, paddingTop: '10px', width: '100%' }} /> */}
                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Address: </span>
                            <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{companyAddress ?? "N/A"}</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', }}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: '10px' }} >
                                <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Latitude: </span>
                                <span style={{ fontSize: isDesktopView ? '22px' : '16px', }}>{companyLat ?? "N/A"}</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: '10px' }} >
                                <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Longitude: </span>
                                <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{companyLng ?? 'N/A'}</span>
                            </div>
                        </div>

                        {editing && <button className="buttomDarkGray" style={{
                            padding: '8px', borderRadius: '6px', margin: '10px 0px', width: '250px', marginBottom: '0px',
                            opacity: 1, cursor: 'pointer',
                        }}
                            onClick={() => { setEditAddressModalOpen(true) }} >Edit Address</button>}

                    </div>
                </div>
            </div>

            {seeImageBig && <div onClick={() => setSeeImageBig(false)} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
                <img src={seeImageBig} alt="Logo" style={{
                    maxWidth: "90%", maxHeight: "90%", borderRadius: '10px', objectFit: "contain", boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.5)"
                }} />
            </div>}


            {editAddressModalOpen && <div className="myModalInsideDeliveryLayout" style={{ zIndex: 10000 }} >
                <EditCompanyAddress close={() => setEditAddressModalOpen(false)} companyLat={companyLat} setCompanyLat={setCompanyLat} companyLng={companyLng} setCompanyLng={setCompanyLng} companyAddress={companyAddress} setCompanyAddress={setCompanyAddress} />
            </div>}
        </>
    );
}