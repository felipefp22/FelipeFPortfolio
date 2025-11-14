import { useEffect, useState } from 'react';
import { blueOne, fontColorOne } from '../../../../theme/Colors';
import { useSelector } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';



export default function DeliveryManPage({ companyOperation, getShiftOperationData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const [ordersGroups, setOrdersGroups] = useState([]);

    useEffect(() => {
        separateOrdersOnGorups();
    }, [companyOperation]);

    async function separateOrdersOnGorups() {
        const userOrders = companyOperation?.orders?.filter(order => order?.deliveryManID === localStorage.getItem('userLoggedEmail') && order?.status === 'CLOSEDWAITINGPAYMENT');

        let uniqueDeliveryOrdersSequence = new Set();
        userOrders?.forEach(order => {
            const sequence = order?.deliveryOrdersSequence;
            if (Array.isArray(sequence)) {
                const sortedUniqueSequence = [...new Set(sequence)].sort();
                const sequenceString = JSON.stringify(sortedUniqueSequence);
                if (!uniqueDeliveryOrdersSequence.has(sequenceString)) {
                    uniqueDeliveryOrdersSequence.add(sequenceString);
                }
            }
        });

        let ordersGroupsTemp = [];
        uniqueDeliveryOrdersSequence.forEach(seqString => {
            const sequenceArray = JSON.parse(seqString);
            const ordersFiltered = userOrders?.filter(order => {
                const orderSequence = order?.deliveryOrdersSequence;

                if (!Array.isArray(orderSequence)) {
                    return false;
                }
                const orderSequenceString = JSON.stringify([...new Set(orderSequence)].sort());
                return orderSequenceString === seqString;
            });

            if (ordersFiltered) {
                ordersFiltered.sort((a, b) => {
                    const indexA = sequenceArray.indexOf(a.id);
                    const indexB = sequenceArray.indexOf(b.id);
                    return indexA - indexB;
                });
            }
            ordersGroupsTemp.push({
                deliveryOrdersSequence: sequenceArray,
                orders: ordersFiltered
            });
        });
        setOrdersGroups(ordersGroupsTemp);
    }

    async function goMaps(orders) {
        console.log("Orders for routing:", orders);
        // 1. Validate the list of orders
        if (!orders || orders.length === 0) {
            console.error("Orders list cannot be empty for routing.");
            return;
        }

        // Utility function to format coordinates as lat,lng
        const getCoords = (order) => `${order?.customer?.lat},${order?.customer?.lng}`;

        // 1. The first stop for the user is now the first order's location.
        // Waypoints will include all stops from the first order up to the second-to-last.
        // The user's device location will be the starting origin.
        const waypoints = orders
            .slice(0, -1) // Get all orders *except* the last one (which is the destination)
            .map(getCoords)
            .join('|');

        // 2. Define the Destination (Last Stop)
        const destination = getCoords(orders[orders.length - 1]);

        // 3. Construct the Google Maps URL
        // IMPORTANT: The 'origin' parameter is intentionally excluded so Maps defaults to 'MY_LOCATION'.
        let googleMapsUrl = 'https://www.google.com/maps/dir/' +
            `&destination=${destination}`;

        // Add waypoints (which contains all intermediate order locations)
        if (waypoints.length > 0) {
            googleMapsUrl += `&waypoints=${waypoints}`;
        }

        // Add a travel mode for drivers (optional, but helpful)
        googleMapsUrl += `&dir_action=navigate&travelmode=driving`;

        // 4. Open the map in a new tab
        window.open(googleMapsUrl, '_blank');
    }

    return (
        <>
            <div className='flexColumn' style={{ height: '100%', flexGrow: 1, overflowY: 'auto', }}>
                {ordersGroups?.map((group, index) => (
                    <div key={index} className='transparentCanvas fullCenter' style={{ marginBottom: 10 }} onClick={() => { goMaps(group?.orders) }} >
                        {group?.orders?.map((order) => (
                            <div key={order.id} className='flexRow fullCenter' style={{}} >
                                <div key={order.id} className='flexRow fullCenter' style={{ width: 40, height: 40, borderRadius: 50, backgroundColor: blueOne(theme), margin: '0px 5px' }} >
                                    <span style={{ fontSize: 22, fontWeight: 'bold', color: fontColorOne(theme) }}>{order.orderNumberOnShift}</span>
                                </div>
                                <FontAwesomeIcon icon={faArrowRight} style={{ color: fontColorOne(theme), fontSize: 15 }} />
                            </div>))}

                    </div>))}
            </div>
        </>
    );
}