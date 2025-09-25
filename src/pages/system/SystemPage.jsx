import { useEffect, useRef, useState } from "react";
import { Form, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal";


export default function SystemPage() {
    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderModalRef = useRef(null);

    // useEffect(() => {
    //     const handleClickOutside = (event) => {
    //         if (newOrderModalRef.current && !newOrderModalRef.current.contains(event.target)) {
    //             setNewOrderModal(false);
    //         }
    //     };

    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // }, []);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: 5 }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white",  marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => setNewOrderModal(true)}>New Order</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>
                    <h3 style={{ color: "white", marginBottom: '10px' }}>Orders Cooking</h3>

                    {/* <div style={{ display: 'flex', flexDirection: 'row', margin: '20px', backgroundColor: "white", color: "black", padding: '5px', borderRadius: '10px' }}> */}
                    <Table responsive="sm" style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', padding: '10px', minWidth: '80%', height: '100%', minHeight: '200px', maxHeight: '400px', overflow: 'auto', }}>
                        <thead>
                            <tr>
                                <th style={{ width: "40px" }}>Num</th>
                                <th>Customer</th>
                                <th>Minutes</th>
                            </tr>
                        </thead>
                        <tbody style={{ textAlign: 'left', height: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                            <tr>
                                <td>1</td>
                                <td>Alexandro</td>
                                <td>5</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Thornton</td>
                                <td>10</td>
                            </tr>
                        </tbody>
                    </Table>
                    {/* </div> */}
                </div>


            </div >

            {newOrderModal && <div ref={newOrderModalRef} style={{ position: 'absolute', display: 'flex', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', zIndex: 9 }} >
                <NewOrderModal closeNewOrderModal={() => setNewOrderModal(false)} />
            </div>}
        </>
    );
}