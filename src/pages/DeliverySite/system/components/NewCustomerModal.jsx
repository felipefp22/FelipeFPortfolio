import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import { createCustomer } from "../../../../services/deliveryServices/CustomerSevice";
import { useSelector } from "react-redux";
import SelectCustumerAddressMap from "./auxComponents/SelectCustumerAddressMap";

export default function NewCustomerModal({ close }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disabled, setDisabled] = useState(false);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [addressNumber, setAddressNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [complement, setComplement] = useState("");

    const [showBoxCreateFakesCustomers, setShowBoxCreateFakesCustomers] = useState(false);

    async function handleCustomerSearchInputChange(e) {
        setCustomerInputToSearch(e.target.value);

        const lowerInput = e.target.value.toLowerCase();

        // const filtered = doctorSpecialitiesOpts
        //     .filter(opt =>
        //         opt.ptbrLabel.toLowerCase().includes(lowerInput) &&
        //         !doctorSpecialties.includes(opt.doctorSpecialty)
        //     )
        //     .map(opt => opt.doctorSpecialty);

        // setFilteredSpecialities(filtered);
    };

    async function saveCustomer() {
        if (!name || !phone || !email || !address || !addressNumber || !city || !state || !zipCode || !lat || !lng || !complement) {
            alert("Please fill in all fields");
            return;
        }

        const response = createCustomer(name, phone, email, address, addressNumber, city, state, zipCode, lat, lng, complement);
        if (response?.status === 200) {
            alert("Customer created successfully");
            close();
        } else {
            alert("Error creating customer");
        }
    }


    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', width: !isDesktopView ? "100%" : "85%", maxHeight: '90%', border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                color: 'white', padding: !isDesktopView ? '10px' : '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto"
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => setShowBoxCreateFakesCustomers(true)}>Create FAKES Customers To Test</button>
                    </div> */}

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '64%', }}>
                            <span style={{ fontWeight: "600" }}>Customer Name</span>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }} />
                        </div>
                        <div style={{ width: '3%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '28%', }}>
                            <span style={{ fontWeight: "600" }}>Phone</span>
                            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '72%', }}>
                            <span style={{ fontWeight: "600", marginBottom: '5px' }}>Customer Address</span>
                            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                            />
                        </div>
                        <div style={{ width: '3%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '20%' }}>
                            <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Number</span>
                            <input type="text" value={addressNumber} onChange={(e) => setAddressNumber(e.target.value)}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '95%' }}>
                        <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Complement</span>
                        <input type="text" value={complement} onChange={(e) => setComplement(e.target.value)}
                            style={{ height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                        />
                    </div>
                </div>


                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>

                <SelectCustumerAddressMap lat={lat} setLat={setLat} lng={lng} setLng={setLng} />

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button style={{ backgroundColor: 'rgba(189, 13, 0, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => close()}>Cancel</button>
                            <button style={{ backgroundColor: 'rgba(15, 107, 56, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => saveCustomer()}>Save Customer</button>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
}