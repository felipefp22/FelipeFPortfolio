import { useEffect, useRef, useState } from "react";
import { Form, Table } from "react-bootstrap";
import NewOrderModal from "./components/NewOrderModal";
import { getCompanyOperation } from "../../services/CompanySevice";
import { getOrderOperation } from "../../services/OrderService";
import { getShiftOperation, openNewShift } from "../../services/ShiftService";
import { useDispatch, useSelector } from "react-redux";
import {
    changeCompanyName, changeCompanyEmail, changeCompanyPhone, changeCompanyAddress, changeCompanyLat, changeCompanyLng,
    changeUrlCompanyLogo, changeProductsCategories, changeCustomers, changeCurrentShift, changeNumberOfTables, changeOrders
} from './../../redux/companyOperationSlice.js';


export default function SystemPage({ }) {
    const dispatch = useDispatch();
    const [newOrderModal, setNewOrderModal] = useState(false);
    const newOrderModalRef = useRef(null);

    const orders = useSelector((state) => state.companyOperation.orders);

    async function getCompanyOperationData(retryCount = 0) {
        const response = await getCompanyOperation();
        if (response?.status === 200) {
            const companyOperationData = response?.data;
            console.log("Company Operation Data: ", companyOperationData);
            dispatch(changeCompanyName(companyOperationData?.companyName));
            dispatch(changeCompanyEmail(companyOperationData?.companyEmail));
            dispatch(changeCompanyPhone(companyOperationData?.companyPhone));
            dispatch(changeCompanyAddress(companyOperationData?.companyAddress));
            dispatch(changeCompanyLat(companyOperationData?.companyLat));
            dispatch(changeCompanyLng(companyOperationData?.companyLng));
            dispatch(changeUrlCompanyLogo(companyOperationData?.urlCompanyLogo));
            dispatch(changeProductsCategories(companyOperationData?.productsCategories || []));
            dispatch(changeCustomers(companyOperationData?.customers || []));
            dispatch(changeCurrentShift(companyOperationData?.currentShift || null));
            dispatch(changeNumberOfTables(companyOperationData?.numberOfTables || 0));

        } else if (response?.status === 400 && response?.data === "noActiveShift") {
            //IfOneDayRealOperationRemoveThis all this second "else if" and just leave the "if" above and the "else" below
            if (retryCount < 2) {
                const res = await openNewShift();
                return getCompanyOperationData(retryCount + 1);
            } else {
                alert("Error fetching company operation data");
            }
        } else {
            // alert("Error fetching company operation data");
        }
    }

    async function getShiftOperationData() {
        const response = await getShiftOperation();
        if (response?.status === 200) {
            const shiftOperationData = response?.data;
            dispatch(changeCurrentShift(shiftOperationData?.currentShift || null));
            dispatch(changeOrders(shiftOperationData?.orders || []));
        } else {
            // alert("Error fetching orders operation data");
        }
    }

    useEffect(() => {
        getCompanyOperationData();
    }, []);

    useEffect(() => {
        // run immediately once
        getShiftOperationData();


        const interval = setInterval(() => {
            getShiftOperationData();
        }, 12000);

        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: 5 }}>
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white", marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => setNewOrderModal(true)}>New Order</button>
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
                            {orders && orders.length > 0 && orders.map((order, index) => (
                                <tr key={order.orderID} style={{ backgroundColor: order.status === "cooking" ? '#f0ad4e' : order.status === "ready" ? '#5cb85c' : 'white', color: order.status === "delivered" ? 'gray' : 'black' }}>
                                    <td>{order.orderNumberOnShift}</td>
                                    <td>{order.customer?.customerName || "No Name"}</td>
                                    <td>{Math.floor((Date.now() - Date.parse(order.openOrderDateUtc + "Z")) / 60000)}</td>
                                </tr>

                            ))}
                        </tbody>
                    </Table>
                    {/* </div> */}
                </div>


            </div >

            {!newOrderModal && <div ref={newOrderModalRef} style={{ position: 'absolute', display: 'flex', height: '100%', width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.6)', alignItems: 'center', justifyContent: 'center', borderRadius: '10px', zIndex: 9 }} >
                <NewOrderModal closeNewOrderModal={() => setNewOrderModal(false)} />
            </div>}
        </>
    );
}