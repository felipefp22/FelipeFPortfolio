import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";

export default function NewOrderModal({ }) {

    const [disabled, setDisabled] = useState(false);

    const [customerSelectedToNewOrder, setCustomerSelectedToNewOrder] = useState("");

    const [customerInputToSearch, setCustomerInputToSearch] = useState("");
    const [customersFound, setCustomersFound] = useState([]);
    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const customerSelectorDropdownRef = useRef(null);


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

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', width: "85%", maxHeight: '90%', border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto"
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => ""}>Create new customer</button>
                    </div>

                    <span style={{ fontWeight: "600" }}>Customer</span>
                    <div ref={customerSelectorDropdownRef} style={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            className="form-control"
                            value={customerInputToSearch}
                            onChange={handleCustomerSearchInputChange}
                            onFocus={() => setShowCustomerSelectorDropdown(true)}
                            onBlur={() => { setCustomerInputToSearch(""); setShowCustomerSelectorDropdown(false); }}
                            placeholder="Search Customer by Name or Phone"
                            disabled={disabled}
                            style={{ height: '35px', backgroundColor: 'white', color: 'black', width: '95%', paddingLeft: '10px', margin: 0, borderRadius: '5px', marginTop: '5px', border: 'none', borderRadius: "0px" }}
                        />
                        {showCustomerSelectorDropdown && (
                            <ul style={{ position: 'absolute', top: 33, backgroundColor: 'white', color: 'black', width: '89%', minHeight: '200px', maxHeight: '468px', overflowY: 'auto', zIndex: 1000, borderRadius: "0px 0px 5px 5px" }}>
                                {customersFound?.length > 0 ? (
                                    customersFound.map((customerOpt) => (
                                        <li
                                            key={customerOpt.id}
                                            onClick={() => customerSelectedToNewOrder(customerOpt)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {customerOpt.name + " / " + customerOpt.phone}
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ fontWeight: "600" }} >No matches found</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '64%', }}>
                            <span style={{ fontWeight: "600", marginBottom: '5px' }}>Customer Address</span>
                            <input type="text" className="form-control" value={customerSelectedToNewOrder ? customerSelectedToNewOrder.address + ", " + customerInputToSearch.number : ""} disabled={true}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                            />
                        </div>
                        <div style={{ width: '3%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '28%' }}>
                            <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Customer Phone</span>
                            <input type="text" className="form-control" value={customerSelectedToNewOrder ? customerSelectedToNewOrder.phone : ""} disabled={true}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button style={{ backgroundColor: 'rgba(15, 107, 56, 1)', border: "2px solid white", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => ""}>ADD Item</button>
                        </div>
                        <span style={{ fontWeight: "600", marginBottom: '5px' }}>Itens on Order</span>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', padding: '10px', width: '98%', height: '200px', overflow: 'auto', }}>
                            <Table responsive="sm" >
                                <thead>
                                    <tr>
                                        <th style={{ width: "100%" }}>Item</th>
                                        <th style={{ width: "40px" }}>Price</th>
                                        <th style={{ width: "40px" }}><FontAwesomeIcon icon={faTrash} /></th>
                                    </tr>
                                </thead>
                                <tbody >
                                    <tr>
                                        <td>Peperoni</td>
                                        <td>25.99</td>
                                        <td><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                    </tr>

                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}