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

        googleMapsUrl += `&dir_action=navigate&travelmode=driving`;
        window.open(googleMapsUrl, '_blank');
    }

    function openMaps() {
        // const url = `geo:${lat},${lng}?q=${lat},${lng}`;
        let url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;

        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

        if (isSafari) {
            url = `http://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
        }

        window.open(url, '_blank'); // open in new tab
        setGoToOutsideModalVisible(false)
    };


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