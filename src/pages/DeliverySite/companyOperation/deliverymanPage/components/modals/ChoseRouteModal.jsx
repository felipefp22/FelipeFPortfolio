import { useSelector } from 'react-redux';
import { blueOne, fontColorOne, orangeOne, redOne } from '../../../../../../theme/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import googleMapsLogo from '../../../../../../assets/googleMapsLogo.png';
import wazeLogo from '../../../../../../assets/wazeLogo2.png';


export default function ChoseRouteModal({ close, appToOpenAndGroup }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    async function goMaps(orders) {
        if (!orders || orders.length === 0) {
            console.error("Orders list cannot be empty for routing.");
            return;
        }
        const getCoords = (order) => `${order?.customer?.lat},${order?.customer?.lng}`;

        const waypoints = orders
            .slice(0, -1)
            .map(getCoords)
            .join('|');
        const destination = getCoords(orders[orders.length - 1]);

        let googleMapsUrl = 'https://www.google.com/maps/dir/?api=1' +
            `&destination=${destination}`;
        if (waypoints.length > 0) {
            googleMapsUrl += `&waypoints=${waypoints}`;
        }

        // googleMapsUrl += `&dir_action=navigate&travelmode=driving`; // That Starts navigation immediately
        googleMapsUrl += `&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
    }

    async function goWaze(orders) {
        if (!orders || orders.length === 0) {
            console.error("Orders list cannot be empty for routing.");
            return;
        }
        const getCoords = (order) => `${order?.customer?.lat},${order?.customer?.lng}`;

        const origin = getCoords(orders[0]);
        const destination = getCoords(orders[orders.length - 1]);

        const wazeUrl = `https://waze.com/ul?ll=${destination}&from=${origin}&navigate=yes`;
        window.open(wazeUrl, '_blank');
    }

    return (
        <>
            <div className='modalInside' style={{ maxWidth: isPcV ? "80%" : "95%", maxHeight: '90%', padding: '20px', }}>
                <div className='flexColumn fullCenter' style={{ height: '100%', overflowY: 'auto', }}>

                    {appToOpenAndGroup?.appToOpen === 'googleMaps' && <img src={googleMapsLogo} alt="Google Maps" style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: "white", border: "2px solid white" }}/>}
                    {appToOpenAndGroup?.appToOpen === 'waze' && <img src={wazeLogo} alt="Waze" style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: blueOne(theme), border: "2px solid white" }} />}
                    <br />

                    {appToOpenAndGroup?.appToOpen === 'googleMaps' && appToOpenAndGroup?.group?.orders.length > 1 && <div className='transparentCanvas fullCenter' style={{minWidth: '60%', flexDirection: 'column', marginBottom: 20 }} onClick={() => { goMaps(appToOpenAndGroup?.group?.orders) }} >
                        <div className='flexRow' style={{ marginBottom: 5 }} >
                            {appToOpenAndGroup?.group?.orders.map((order) => (
                                <div key={order.id} className='flexRow fullCenter'>
                                    <div key={order.id} className='flexRow fullCenter' style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: orangeOne(theme), margin: '0px 5px' }} >
                                        <span style={{ fontSize: 22, fontWeight: 'bold', color: fontColorOne(theme) }}>{order.orderNumberOnShift}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faArrowRight} style={{ color: fontColorOne(theme), fontSize: 15 }} />
                                </div>))}
                        </div>
                    </div>}

                    {appToOpenAndGroup?.group?.orders?.map((order, index) => (
                        <div key={index} className='transparentCanvas fullCenter' style={{ flexDirection: 'column', marginBottom: 10, cursor: 'pointer', minWidth: '40%' }}
                            onClick={() => { if (appToOpenAndGroup?.appToOpen === 'googleMaps') goMaps([order]); if (appToOpenAndGroup?.appToOpen === 'waze') goWaze([order]); }} >
                            <div key={order.id} className='flexRow fullCenter' style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: orangeOne(theme), margin: '0px 10px' }} >
                                <span style={{ fontSize: 22, fontWeight: 'bold', color: fontColorOne(theme) }}>{order.orderNumberOnShift}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '20px' }}>
                    <button className='buttonStandart' style={{ background: 'none', border: "none", color: redOne(theme), fontSize: '16px' }}
                        onClick={() => { close(); }} >Cancel</button>
                </div>
            </div>
        </>
    );
}