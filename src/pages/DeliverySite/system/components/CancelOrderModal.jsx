import { useState } from "react";
import { cancelOrder } from "../../../../services/deliveryServices/OrderService";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";


export default function CancelOrder({ close, selectedCookingOrderID, getCompanyOperationData }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const [processing, setProcessing] = useState(false);

    async function handleCancelOrder() {
        setProcessing(true);
        if (selectedCookingOrderID.length !== 1) {
            close();
            setProcessing(false);
            return;
        }

        const response = await cancelOrder(selectedCookingOrderID[0], localStorage.getItem('userLoggedEmail'), adminPassword, "User Don't want the order anymore");

        if (response.status === 200) {
            close();
        }

        setProcessing(false);
    }

    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div style={{
                    display: 'flex', flexDirection: 'column', maxWidth: !isDesktopView ? "95%" : "45%", maxHeight: !isDesktopView ? "95%" : "90%", border: '2px solid white', background: "linear-gradient(135deg, #272727ff, #18183aff)",
                    color: 'white', padding: '20px', borderRadius: '10px', zIndex: 10, overflowY: "auto"
                }}>
                    <span>Cancel Order?</span>


                    {!processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                        <button style={{ backgroundColor: 'rgba(189, 13, 0, 0)', border: "none", color: "rgba(255, 69, 56, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { close(); }} disabled={processing}>Return</button>

                        <button style={{ backgroundColor: 'rgba(167, 35, 12, 0)', border: "none", color: "rgba(249, 140, 24, 1)", padding: "10px 20px", height: '40px', marginLeft: '0px', fontWeight: 'bold', fontSize: '16px' }}
                            onClick={() => { handleCancelOrder() }} disabled={processing}>Cancel Order</button>
                    </div>}

                    {processing && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', height: '50px', marginTop: '10px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>
        </>
    );
}