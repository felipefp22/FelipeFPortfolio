import { useEffect, useState } from 'react';
import { blueOne, fontColorOne, orangeOne, purpleOne } from '../../../../theme/Colors';
import { useSelector } from 'react-redux';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import googleMapsLogo from '../../../../assets/googleMapsLogo.png';
import wazeLogo from '../../../../assets/wazeLogo2.png';
import ChoseRouteModal from './components/modals/ChoseRouteModal';



export default function DeliveryManPage({ companyOperation, getShiftOperationData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const [ordersGroups, setOrdersGroups] = useState([]);
    const [sequenceOpen, setSequenceOpen] = useState(null);
    const [showChoseRouteModal, setShowChoseRouteModal] = useState(false);

    useEffect(() => {
        separateOrdersOnGorups();
    }, [companyOperation]);

    async function separateOrdersOnGorups() {
        const userOrders = companyOperation?.orders?.filter(order => order?.deliveryManID === localStorage.getItem('userLoggedEmail') && order?.status === 'CLOSEDWAITINGPAYMENT');

        const uniqueDeliveryOrdersSequence = [
            ...new Set(userOrders?.map(o => JSON.stringify(o.deliveryOrdersSequence)))
        ].map(s => JSON.parse(s));

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
    }



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
                                onClick={(e) => { e.stopPropagation(); setShowChoseRouteModal({ appToOpen: 'googleMaps', group: group });}} />

                            <img src={wazeLogo} alt="Waze" style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: blueOne(theme), border: "2px solid white" }}
                                onClick={(e) => { e.stopPropagation(); setShowChoseRouteModal({ appToOpen: 'waze', group: group });}} />
                        </div>}
                    </div>))}
            </div>

            {showChoseRouteModal && <div className='myModal' >
                <ChoseRouteModal close={() => setShowChoseRouteModal(null)} appToOpenAndGroup={showChoseRouteModal} />
            </div>}
        </>
    );
}