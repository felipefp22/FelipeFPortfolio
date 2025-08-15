import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import noFoodImg from "./../../../assets/noFood.jpg";

export default function SelectItemsModal({ close }) {

    const [buttonFilter, setButtonFilter] = useState("All");
    const [filterSearchItem, setFilterSearchItem] = useState("")


    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', width: "85%", maxHeight: '90%', border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto", overflowX: 'hidden',
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', width: '100%', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px', border: buttonFilter === "All" ? "2px solid white" : "none" }}
                            onClick={() => setButtonFilter("All")}>All</button>

                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px', border: buttonFilter === "Pizzas" ? "2px solid white" : "none" }}
                            onClick={() => setButtonFilter("Pizzas")}>Pizzas</button>

                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px', border: buttonFilter === "Beverages" ? "2px solid white" : "none" }}
                            onClick={() => setButtonFilter("Beverages")}>Beverages</button>

                        <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px', border: buttonFilter === "Alcoholic Beverage" ? "2px solid white" : "none" }}
                            onClick={() => setButtonFilter("Alcoholic Beverage")}>Alcoholic Beverage</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '300px', backgroundColor: 'white', borderRadius: '5px', padding: 3, overflowY: 'auto' }}>
                        <input type="text" value={filterSearchItem} onChange={(e) => setFilterSearchItem(e.target.value)} placeholder="Filter Item"
                            style={{
                                height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', height: 40, paddingLeft: '10px', borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto',
                                border: '2px solid lightgray', borderRadius: '5px', margin: 0, boxSizing: 'border-box', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)'
                            }} />

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                            <div style={{ display: 'flex', flexDirection: 'column', width: '80px', height: "96px", margin: 5, cursor: 'pointer' }}>
                                <img src={noFoodImg} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>Peperoni</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', textAlign: 'left' }}>
                    <span style={{ fontWeight: "600", marginBottom: '5px' }}>Itens to Add</span>
                    <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', padding: '10px', width: '98%', height: '200px', overflow: 'auto', border: '1px solid lightgray' }}>
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
                
                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button style={{ backgroundColor: 'rgba(189, 13, 0, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => close()}>Cancel</button>
                            <button style={{ backgroundColor: 'rgba(15, 107, 56, 1)', border: "none", color: "white", padding: "10px 20px", height: '40px', marginLeft: '0px' }} onClick={() => ""}>Add items</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* {showBoxCreateFakesCustomers && <div style={{ position: 'absolute', display: 'flex', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.8)', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', zIndex: 100 }} >
                <div style={{
                    display: 'flex', flexDirection: 'column', maxWidth: "45%", maxHeight: '90%', border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                    color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto"
                }}>
                    <span>Will create a 10 fake custumers to you test system.</span>
                    <span>(This system is just to recruiters see skills)</span>
                    <br/>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }} 
                        onClick={() => setShowBoxCreateFakesCustomers(false)}>Cancel</button>

                        <button style={{ backgroundColor: 'rgba(15, 107, 56, 0)', border: "none", color: "rgba(38, 233, 35, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                         onClick={() => ""}>Yes Create</button>
                    </div>
                </div>
            </div>} */}
        </>
    );
}