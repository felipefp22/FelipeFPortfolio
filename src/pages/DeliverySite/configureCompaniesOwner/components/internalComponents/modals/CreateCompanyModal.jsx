import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import EditCompanyAddressModal from "./EditCompanyAddressModal";
import restaurantLogo from "../../../../../../assets/restaurantLogo.png";
import { createCompanyService } from "../../../../../../services/deliveryServices/CompanySevice";


export default function CreateCompanyModal({ close, compoundID, fetchUserInfos }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [lat, setLat] = useState(null);
    const [lng, setLng] = useState(null);
    const [numberOfTables, setNumberOfTables] = useState(null);

    const [disable, setDisable] = useState(false);

    const [editAddressModalOpen, setEditAddressModalOpen] = useState(false);

    async function handleCreateCompany() {
        if (name?.length > 3 && email?.length > 5 && phone?.length > 5 && lat && lng && address && numberOfTables > 0) {
            setDisable(true);

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

        setDisable(false);
    }


    return (
        <>
            <div className='modalInside' style={{ padding: '10px', width: !isPcV ? "95%" : "70%", maxHeight: !isPcV ? "95%" : "90%", }}>
                <div className='transparentCanvas' style={{ flexDirection: 'column', backgroundColor: transparentCavasTwo(theme), padding: '10px', }} >

                    <div className='flexColumn' style={{ width: '100%', padding: '10px 0px', }} >
                        <div className='flexRow' style={{ alignItems: 'center', height: '100%', position: 'relative' }} >
                            <img src={restaurantLogo} alt="Logo" style={{
                                width: isPcV ? '160px' : '120px', height: isPcV ? '160px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", border: `3px solid ${borderColorTwo(theme)}`,
                                boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isPcV ? '20px' : '20px',
                            }} />

                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', width: '100%' }} >
                                <button className={`roundedButton ${!disable && 'green'} ${!isPcV && 'small'}`} style={{ position: 'absolute', right: 5, top: 0, }} onClick={() => { if (!disable) handleCreateCompany(); }} >
                                    {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                    {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                </button>
                                {!disable && <button className={`roundedButton red ${!isPcV && 'small'}`} style={{ opacity: 0.7, position: 'absolute', right: isPcV ? 65 : 50, top: 0, }} onClick={() => { close() }} >
                                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                                </button>}

                                <div className='flexRow' style={{ marginLeft: '10px', width: '96%' }} >
                                    <input className='inputStandart' type="text" value={name || ""} placeholder="Company Name"
                                        onChange={(e) => setName(e.target.value)} style={{ width: '100%', fontSize: isPcV ? '26px' : '18px', fontWeight: 'bold', textAlign: 'center', }} />
                                </div>
                            </div>
                        </div>

                        <div className='flexColumn' style={{ padding: isPcV ? '30px 10px 0px 10px' : '30px 10px 0px 10px', }} >
                            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Email: </span>
                                <input className='inputStandart' type="text" value={email || ""} style={{ maxWidth: '300px' }} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Phone: </span>
                                <input className='inputStandart' type="text" value={phone || ""} style={{ maxWidth: '300px' }} onChange={(e) => setPhone(e.target.value)} />
                            </div>

                            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Tables Qty: </span>
                                <select className='inputStandart' value={numberOfTables || 0} onChange={(e) => setNumberOfTables(Number(e.target.value))} style={{ maxWidth: '120px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                    {Array.from({ length: 301 }, (_, i) => (
                                        <option key={i} value={i}>{i}</option>
                                    ))}
                                </select>
                            </div>

                            <br />
                            {/* <div style={{ display: 'flex', flexDirection: 'column', borderTop: `2px solid ${borderColorTwo(theme)}`, paddingTop: '10px', width: '100%' }} /> */}
                            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Address: </span>
                                <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{address ?? "N/A"}</span>
                            </div>
                        <div className='flexColumn' style={{ padding: isPcV ? '30px 10px 0px 10px' : '30px 10px 0px 10px', }} >
                            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Latitude: </span>
                                <span style={{ fontSize: isPcV ? '22px' : '16px', }}>{lat ?? "N/A"}</span>
                            </div>
                            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Longitude: </span>
                                <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{lng ?? 'N/A'}</span>
                                </div>
                            </div>

                            <button className='buttomStandart' style={{ borderRadius: '6px', margin: '10px 0px', width: '250px', marginBottom: '0px', }} onClick={() => { setEditAddressModalOpen(true) }} >Select Address</button>
                        </div>
                    </div>
                </div>
            </div>

            {editAddressModalOpen && <div className='myModal underDeliveryLayout' style={{ zIndex: 10000 }} >
                <EditCompanyAddressModal close={() => setEditAddressModalOpen(false)} companyLat={lat} setCompanyLat={setLat} companyLng={lng} setCompanyLng={setLng} companyAddress={address} setCompanyAddress={setAddress} />
            </div>}
        </>
    );
}