import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, greenOne, orangeOne, redOne } from "../../../../../../theme/Colors";
import { borderColorTwo, transparentCavasOne, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import EditCompanyAddress from "./EditCompanyAddress";
import restaurantLogo from "../../../../../../assets/restaurantLogo.png";
import { createCompanyService } from "../../../../../../services/deliveryServices/CompanySevice";


export default function CreateCompanyModal({ close, compoundID, fetchUserInfos }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [processing, setProcessing] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [numberOfTables, setNumberOfTables] = useState(null);

    const [disable, setDisable] = useState(false);

    const [editAddressModalOpen, setEditAddressModalOpen] = useState(false);

    // useEffect(() => {
    //     console.log('compid ', compoundID)
    // }, [compoundID]);

    async function handleCreateCompany() {
        if (name?.length > 3 && email?.length > 5 && phone?.length > 5 && lat && lng && address && numberOfTables > 0) {
            setProcessing(true);

            const response = await createCompanyService(compoundID, name, email, phone, address, lat, lng, numberOfTables);

            if (response.status === 200) {
                fetchUserInfos();
                close();
            } else {
                alert("Server error opening new shift, try again.");
            }
        } else {
            console.log("name: ", name, " email: ", email, " phone: ", phone, " lat: ", lat, " lng: ", lng, " address: ", address, " numberOfTables: ", numberOfTables);
            alert("Please fill all fields correctly.");
        }

        setProcessing(false);
    }


    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '10px', width: !isDesktopView ? "95%" : "70%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: ' 6px', width: '100%' }} >

                        <div style={{ display: 'flex', flexDirection: 'column', width: isDesktopView ? '90%' : '100%', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)", }} >
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%', position: 'relative' }} >
                                <img src={restaurantLogo} alt="Logo" style={{
                                    width: isDesktopView ? '160px' : '120px', height: isDesktopView ? '160px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                                    boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isDesktopView ? '20px' : '20px',
                                }} />

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', width: '100%' }} >
                                    <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: (disable ? 'transparent' : greenOne(theme)), opacity: 1, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 5, top: 0,
                                    }} onClick={() => { if (!disable) handleCreateCompany();}} >
                                        {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                                        {disable && <Spinner animation="border" role="status" style={{ width: isDesktopView ? '25px' : '20px', height: isDesktopView ? '25px' : '20px', color: 'white', }} />}
                                    </div>
                                    {!disable && <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: isDesktopView ? 65 : 50, top: 0,
                                    }} onClick={() => { close() }} >
                                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                                    </div>}

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '10px' }} >
                                        <input className="inputOne" type="text" value={name || ""} placeholder="Company Name"
                                            onChange={(e) => setName(e.target.value)} style={{ fontSize: isDesktopView ? '26px' : '18px', fontWeight: 'bold', textAlign: 'center', height: isDesktopView ? '50px' : '35px' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isDesktopView ? '30px 40px' : '30px 20px', }} >
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Email: </span>
                                    <input className="inputOne" type="text" value={email || ""} style={{ maxWidth: '300px' }} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Phone: </span>
                                    <input className="inputOne" type="text" value={phone || ""} style={{ maxWidth: '300px' }} onChange={(e) => setPhone(e.target.value)} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Tables Qty: </span>
                                    <select className="inputOne" value={numberOfTables || 0} onChange={(e) => setNumberOfTables(Number(e.target.value))} style={{ maxWidth: '120px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                        {Array.from({ length: 301 }, (_, i) => (
                                            <option key={i} value={i}>{i}</option>
                                        ))}
                                    </select>
                                </div>

                                <br />
                                {/* <div style={{ display: 'flex', flexDirection: 'column', borderTop: `2px solid ${borderColorTwo(theme)}`, paddingTop: '10px', width: '100%' }} /> */}
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Address: </span>
                                    <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{address ?? "N/A"}</span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', }}>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: '10px' }} >
                                        <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Latitude: </span>
                                        <span style={{ fontSize: isDesktopView ? '22px' : '16px', }}>{lat ?? "N/A"}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'flex-start', marginBottom: '10px' }} >
                                        <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Longitude: </span>
                                        <span style={{ fontSize: isDesktopView ? '22px' : '16px' }}>{lng ?? 'N/A'}</span>
                                    </div>
                                </div>

                                <button className="buttomDarkGray" style={{
                                    padding: '8px', borderRadius: '6px', margin: '10px 0px', width: '250px', marginBottom: '0px',
                                    opacity: 1, cursor: 'pointer',
                                }}
                                    onClick={() => { setEditAddressModalOpen(true) }} >Select Address</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {editAddressModalOpen && <div className="myModalInsideDeliveryLayout" style={{ zIndex: 10000 }} >
                <EditCompanyAddress close={() => setEditAddressModalOpen(false)} companyLat={lat} setCompanyLat={setLat} companyLng={lng} setCompanyLng={setLng} companyAddress={address} setCompanyAddress={setAddress} />
            </div>}
        </>
    );
}