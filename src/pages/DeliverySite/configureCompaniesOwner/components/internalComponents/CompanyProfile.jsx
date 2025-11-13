import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../theme/Colors";
import { use, useEffect, useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { updateCompanyService } from "../../../../../services/deliveryServices/CompanySevice";
import { Spinner } from "react-bootstrap";
import EditCompanyAddressModal from "./modals/EditCompanyAddressModal";
import QuitCompanyModal from "./modals/QuitCompanyModal";


export default function CompanyProfile({ companyData, fetchCompanyData, fetchUserInfos }) {
    const isPcV = useSelector((state) => state.view.isPcV);
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
    const [companyServiceTax, setCompanyServiceTax] = useState(null);
    const [numberOfTables, setNumberOfTables] = useState(null);

    const [maxDeliveryDistanceKM, setMaxDeliveryDistanceKM] = useState(null);
    const [maxRecommendedDistanceKM, setMaxRecommendedDistanceKM] = useState(null);
    const [baseDeliveryDistanceKM, setBaseDeliveryDistanceKM] = useState(null);
    const [baseDeliveryTax, setBaseDeliveryTax] = useState(null);
    const [taxPerExtraKM, setTaxPerExtraKM] = useState(null);

    const [disable, setDisable] = useState(false);
    const [editing, setEditing] = useState(false);

    const [editAddressModalOpen, setEditAddressModalOpen] = useState(false);
    const [quitModalOpen, setQuitModalOpen] = useState(false);

    useEffect(() => {
        if (companyData) {
            console.log('👾 company data: ', companyData)
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
        setCompanyServiceTax(companyData?.taxServicePercentage || null);
        setNumberOfTables(companyData?.numberOfTables || null);
        setMaxDeliveryDistanceKM(companyData?.maxDeliveryDistanceKM || null);
        setMaxRecommendedDistanceKM(companyData?.maxRecommendedDistanceKM || null);
        setBaseDeliveryDistanceKM(companyData?.baseDeliveryDistanceKM || null);
        setBaseDeliveryTax(companyData?.baseDeliveryTax || null);
        setTaxPerExtraKM(companyData?.taxPerExtraKM || null);
    }

    async function handleUpdateCompany() {
        if (companyData?.companyName !== companyName || companyData?.companyEmail !== companyEmail ||
            companyData?.companyPhone !== companyPhone || companyData?.companyAddress !== companyAddress ||
            companyData?.companyLat !== companyLat || companyData?.companyLng !== companyLng ||
            companyData?.numberOfTables !== numberOfTables || companyData?.taxServicePercentage !== companyServiceTax ||
            companyData?.maxDeliveryDistanceKM !== maxDeliveryDistanceKM || companyData?.maxRecommendedDistanceKM !== maxRecommendedDistanceKM ||
            companyData?.baseDeliveryDistanceKM !== baseDeliveryDistanceKM || companyData?.baseDeliveryTax !== baseDeliveryTax ||
            companyData?.taxPerExtraKM !== taxPerExtraKM) {

            setDisable(true);
            const response = await updateCompanyService(companyID, companyName, companyEmail, companyPhone, companyAddress, companyLat, companyLng, numberOfTables, companyServiceTax, 
                maxDeliveryDistanceKM, maxRecommendedDistanceKM, baseDeliveryDistanceKM, baseDeliveryTax, taxPerExtraKM);

            if (response?.status === 200) {
                fetchCompanyData();
            } else {
                alert(`Error updating company data on server ${response?.data}`);
            }
            setDisable(false);
        }
        setEditing(false);
    }

    return (
        <>
            <div className='flexColumn fullCenter' style={{ backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%', }} >
                <div className='flexColumn fullCenter' style={{ width: isPcV ? '80%' : '100%', maxWidth: '1000px', padding: '10px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)" }} >
                    <div className='flexRow' style={{ width: '100%', alignItems: 'center', height: '100%' }} >
                        <img src={compoundPhoto ?? restaurantLogo} alt="Logo" onClick={() => setSeeImageBig(compoundPhoto)} style={{
                            width: isPcV ? '200px' : '120px', height: isPcV ? '200px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                            boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: compoundPhoto ? '0px' : (isPcV ? '50px' : '20px'),
                        }} />

                        <div className='flexColumn' style={{ alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', position: 'relative' }} >
                            {localStorage.getItem('userLoggedEmail') === companyData?.ownerID &&
                                <button className={`roundedButton ${editing && !disable && 'green'} ${!isPcV && 'small'}`} style={{ marginLeft: 10, position: 'absolute', right: 5, top: 0, }}
                                    onClick={() => { editing ? handleUpdateCompany() : setEditing(true) }} >
                                    {!disable && <FontAwesomeIcon icon={editing ? faCheck : faPen} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                    {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                </button>}
                            {localStorage.getItem('userLoggedEmail') !== companyData?.ownerID && <button className='buttonStandart' style={{
                                padding: '8px', borderRadius: '6px', margin: '10px 0px', width: '80px', marginBottom: '0px', position: 'absolute', right: 5, top: 0,
                                opacity: 1, cursor: 'pointer',
                            }}
                                onClick={() => { setQuitModalOpen(true) }}>Quit</button>}

                            {editing && !disable && <button className={`roundedButton red ${!isPcV && 'small'}`} style={{ opacity: 0.7, position: 'absolute', right: isPcV ? 65 : 50, top: 0, }}
                                onClick={() => { getDatasFromCompanyData(); setEditing(false); }} >
                                <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                            </button>}

                            <div className='flexRow' style={{ alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }} >
                                {!editing && <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '36px' : '18px', fontWeight: 'bold' }}>{companyData?.companyName ?? 'N/A'}</span>}
                                {editing && <input className='inputStandart' type="text" value={companyName || ""} onChange={(e) => setCompanyName(e.target.value)} style={{ fontSize: isPcV ? '36px' : '18px', fontWeight: 'bold', textAlign: 'center', height: isPcV ? '50px' : '35px' }} />}
                            </div>
                        </div>
                    </div>

                    <div className='flexColumn' style={{ width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isPcV ? '30px 40px' : '30px 20px', }} >
                        <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Email: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{companyEmail ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="text" value={companyEmail || ""} onChange={(e) => setCompanyEmail(e.target.value)} />}
                        </div>
                        <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Phone: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{companyPhone ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="text" value={companyPhone || ""} onChange={(e) => setCompanyPhone(e.target.value)} />}
                        </div>
                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Service Tax: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{companyServiceTax ? companyServiceTax + " %" : ""}</span>}
                            {editing && <input className='inputStandart' type="number" min={0} max={100} style={{ width: 70, textAlign: 'center', }} value={companyServiceTax || ""}
                                onChange={(e) => { const value = e.target.value; if (!/^\d*$/.test(value)) return; if ((Number(value) >= 0 && Number(value) <= 99)) setCompanyServiceTax(Number(value)); }}
                                onKeyDown={(e) => { if (["-", "+", "e", "."].includes(e.key)) e.preventDefault(); }} />}
                        </div>
                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Tables Qty: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{numberOfTables ?? "N/A"}</span>}
                            {editing && <select className='inputStandart' value={numberOfTables || 0} onChange={(e) => setNumberOfTables(Number(e.target.value))} style={{ maxWidth: '120px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                {Array.from({ length: 301 }, (_, i) => (
                                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                                ))}
                            </select>}
                        </div>

                        <br />
                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Max Distance: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{maxDeliveryDistanceKM ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="number" min={0} max={100} style={{ width: 70, textAlign: 'center', }} value={maxDeliveryDistanceKM || ""}
                                onChange={(e) => { const value = e.target.value; if (!/^\d*$/.test(value)) return; if ((Number(value) >= 0 && Number(value) <= 99)) setMaxDeliveryDistanceKM(Number(value)); }}
                                onKeyDown={(e) => { if (["-", "+", "e", "."].includes(e.key)) e.preventDefault(); }} />}
                            <span style={{ fontSize: isPcV ? '22px' : '16px', marginLeft: 5 }}>KM </span>
                        </div>
                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Max Ideal Distance: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{maxRecommendedDistanceKM ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="number" min={0} max={100} style={{ width: 70, textAlign: 'center', }} value={maxRecommendedDistanceKM || ""}
                                onChange={(e) => { const value = e.target.value; if (!/^\d*$/.test(value)) return; if ((Number(value) >= 0 && Number(value) <= 99)) setMaxRecommendedDistanceKM(Number(value)); }}
                                onKeyDown={(e) => { if (["-", "+", "e", "."].includes(e.key)) e.preventDefault(); }} />}
                            <span style={{ fontSize: isPcV ? '22px' : '16px', marginLeft: 5 }}>KM </span>
                        </div>

                        <br />

                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Base Distance: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{baseDeliveryDistanceKM ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="number" min={0} max={100} style={{ width: 70, textAlign: 'center', }} value={baseDeliveryDistanceKM || ""}
                                onChange={(e) => { const value = e.target.value; if (!/^\d*$/.test(value)) return; if ((Number(value) >= 0 && Number(value) <= 99)) setBaseDeliveryDistanceKM(Number(value)); }}
                                onKeyDown={(e) => { if (["-", "+", "e", "."].includes(e.key)) e.preventDefault(); }} />}
                            <span style={{ fontSize: isPcV ? '22px' : '16px', marginLeft: 5 }}>KM </span>
                        </div>
                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Base Distance Tax: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{baseDeliveryTax?.toFixed(2) ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="number" min={0} max={100} style={{ width: 70, textAlign: 'center', }} value={baseDeliveryTax || ""}
                                onChange={(e) => {let value = e.target.value.replace(",", "."); if (!/^\d*\.?\d{0,2}$/.test(value)) return; const num = Number(value); if (!isNaN(num) && num >= 0) setBaseDeliveryTax(num); }}
                                onKeyDown={(e) => { if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); }} /> }
                            <span style={{ fontSize: isPcV ? '22px' : '16px', marginLeft: 5 }}>$</span>
                        </div>
                        <div className='flexRow fullCenter' style={{ width: '100%', justifyContent: 'left', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Extra KM Tax: </span>
                            {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{taxPerExtraKM?.toFixed(2) ?? "N/A"}</span>}
                            {editing && <input className='inputStandart' type="number" style={{ width: 70, textAlign: 'center', }} value={taxPerExtraKM || ""}
                                onChange={(e) => {let value = e.target.value.replace(",", "."); if (!/^\d*\.?\d{0,2}$/.test(value)) return; const num = Number(value); if (!isNaN(num) && num >= 0) setTaxPerExtraKM(num); }}
                                onKeyDown={(e) => { if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); }} /> }
                            <span style={{ fontSize: isPcV ? '22px' : '16px', marginLeft: 5 }}>$</span>
                        </div>

                        <br />
                        {/* <div style={{ display: 'flex', flexDirection: 'column', borderTop: `2px solid ${borderColorTwo(theme)}`, paddingTop: '10px', width: '100%' }} /> */}
                        <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Address: </span>
                            <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{companyAddress ?? "N/A"}</span>
                        </div>
                        <div className='flexColumn'>
                            <div className='flexRow' style={{ width: '100%', alignItems: 'flex-start', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Latitude: </span>
                                <span style={{ fontSize: isPcV ? '22px' : '16px', }}>{companyLat ?? "N/A"}</span>
                            </div>
                            <div className='flexRow' style={{ width: '100%', alignItems: 'flex-start', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Longitude: </span>
                                <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{companyLng ?? 'N/A'}</span>
                            </div>
                        </div>

                        {editing && <button className='buttonStandart' style={{
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


            {editAddressModalOpen && <div className='myModal underDeliveryLayout' >
                <EditCompanyAddressModal close={() => setEditAddressModalOpen(false)} companyLat={companyLat} setCompanyLat={setCompanyLat} companyLng={companyLng} setCompanyLng={setCompanyLng} companyAddress={companyAddress} setCompanyAddress={setCompanyAddress} />
            </div>}

            {quitModalOpen && <div className='myModal underDeliveryLayout' >
                <QuitCompanyModal close={() => setQuitModalOpen(false)} companyData={companyData} fetchUserInfos={() => fetchUserInfos()} />
            </div>}
        </>
    );
}