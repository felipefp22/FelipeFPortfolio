import { useEffect, useState } from 'react';
import { blueOne, fontColorOne, orangeOne, purpleOne } from '../../../../theme/Colors';
import { useSelector } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import googleMapsLogo from '../../../../assets/googleMapsLogo.png';
import wazeLogo from '../../../../assets/wazeLogo2.png';



export default function DeliveryManPage({ companyOperation, getShiftOperationData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const [ordersGroups, setOrdersGroups] = useState([]);
    const [sequenceOpen, setSequenceOpen] = useState(null);

    useEffect(() => {
        separateOrdersOnGorups();
    }, [companyOperation]);

    async function separateOrdersOnGorups() {
        const userOrders = companyOperation?.orders?.filter(order => order?.deliveryManID === localStorage.getItem('userLoggedEmail') && order?.status === 'CLOSEDWAITINGPAYMENT');

        console.log('userOrders: ', userOrders);

        const uniqueDeliveryOrdersSequence = [
            ...new Set(userOrders?.map(o => JSON.stringify(o.deliveryOrdersSequence)))
        ].map(s => JSON.parse(s));

        console.log('uniqueDeliveryOrdersSequence: ', uniqueDeliveryOrdersSequence);

        let ordersGroupsTemp = [];
        uniqueDeliveryOrdersSequence.forEach(sequenceArray => {

            // ❗ NÃO ALTERAR sequenceArray, usar cópia!
            const seqString = JSON.stringify([...sequenceArray].sort());

            const ordersFiltered = userOrders.filter(order => {
                if (!Array.isArray(order.deliveryOrdersSequence)) return false;

                const orderSequenceString = JSON.stringify(
                    [...new Set(order.deliveryOrdersSequence)].sort()
                );

                return orderSequenceString === seqString;
            });

            const ordersSorted = sequenceArray.map(seqId =>
                ordersFiltered.find(order => order.id === seqId)
            ).filter(Boolean);

            ordersGroupsTemp.push({
                deliveryOrdersSequence: sequenceArray, // ORDEM ORIGINAL preservada
                orders: ordersSorted
            });
        });

        setOrdersGroups(ordersGroupsTemp);
        console.log('ordersGroupsTemp: ', ordersGroupsTemp);
    }

    async function goMapsAutoStart(orders) {
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

        // googleMapsUrl += `&dir_action=navigate&travelmode=driving`;
        googleMapsUrl += `&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
    }

    // async function goMapsAutoStart(orders) {
    //     if (!orders || orders.length === 0) {
    //         console.error("Orders list cannot be empty for routing.");
    //         return;
    //     }
    //     const getCoords = (order) => `${order?.customer?.lat},${order?.customer?.lng}`;

    //     const waypoints = orders
    //         .slice(0, -1)
    //         .map(getCoords)
    //         .join('|');
    //     const destination = getCoords(orders[orders.length - 1]);

    //     let googleMapsUrl = 'https://www.google.com/maps/dir/?api=1' +
    //         `&destination=${destination}`;
    //     if (waypoints.length > 0) {
    //         googleMapsUrl += `&waypoints=${waypoints}`;
    //     }

    //     // googleMapsUrl += `&dir_action=navigate&travelmode=driving`;
    //     googleMapsUrl += `&travelmode=driving`;
    //     window.open(googleMapsUrl, '_blank');
    // }

    async function goWaze(orders) {
        console.log('ordersGroups: ', ordersGroups);
        if (!orders || orders.length === 0) {
            console.error("Orders list cannot be empty for routing.");
            return;
        }

        const getCoords = (order) => `${order?.customer?.lat},${order?.customer?.lng}`;

        const origin = getCoords(orders[0]);
        const destination = getCoords(orders[orders.length - 1]);

        // Waze URL format
        const wazeUrl = `https://waze.com/ul?ll=${destination}&from=${origin}&navigate=yes`;

        window.open(wazeUrl, '_blank');
    }

    // function openMaps() {
    //     // const url = `geo:${lat},${lng}?q=${lat},${lng}`;
    //     let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

    //     const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    //     if (isSafari) {
    //         url = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
    //     }

    //     window.open(url, '_blank'); // open in new tab
    //     setGoToOutsideModalVisible(false)
    // };


    return (
        <>
            <div className='flexColumn' style={{ height: '100%', overflowY: 'auto', }}>
                {ordersGroups?.map((group, index) => (
                    <div key={index} className='transparentCanvas fullCenter' style={{ flexDirection: 'column', marginBottom: 10}} onClick={() => { setSequenceOpen(index) }} >
                        <div className='flexRow' style={{ marginBottom: 5 }} >
                            {group?.orders?.map((order) => (
                                <div key={order.id} className='flexRow fullCenter'>
                                    <div key={order.id} className='flexRow fullCenter' style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: orangeOne(theme), margin: '0px 5px' }} >
                                        <span style={{ fontSize: 22, fontWeight: 'bold', color: fontColorOne(theme) }}>{order.orderNumberOnShift}</span>
                                    </div>
                                    <FontAwesomeIcon icon={faArrowRight} style={{ color: fontColorOne(theme), fontSize: 15 }} />
                                </div>))}
                        </div>
                        {sequenceOpen === index && <div className='flexRow spaceBetweenJC' style={{ gap: 50, marginTop: 10 }} >
                            <img src={googleMapsLogo} alt="Google Maps" style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: "white", border: "2px solid white" }}
                                onClick={(e) => { e.stopPropagation(); goMapsAutoStart(group?.orders); }} />

                            <img src={wazeLogo} alt="Waze" style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: blueOne(theme), border: "2px solid white" }}
                                onClick={(e) => { e.stopPropagation(); goWaze(group?.orders); }} />
                        </div>}
                    </div>))}
            </div>
        </>
    );
}