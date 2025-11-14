import { blueOne, greenOne, greenTwo, redOne, transparentCavasTwo } from '../../../../../../theme/Colors';
import avatar from '../../../../../../assets/noProfilePhoto.png';
import unknownUSer from '../../../../../../assets/unknownUser.png';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { addNoUserDeliverymanService, removeNoUserDeliverymanService } from '../../../../../../services/deliveryServices/CompanySevice';


export default function NoUserDeliveryMan({ companyData, fetchCompanyData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    const [createNoRegisteredDeliveryManModal, setCreateNoRegisteredDeliveryManModal] = useState(false);
    const [deleteNoRegisteredDeliveryManModal, setDeleteNoRegisteredDeliveryManModal] = useState(false);

    const [disabled, setDisabled] = useState(false);

    const [nameInput, setNameInput] = useState(null);

    async function handleAddNoRegisteredDeliveryMan() {
        if (nameInput && nameInput.length < 3) {
            alert("Please enter a valid name with at least 3 characters.");
            return;
        }
        setDisabled(true);

        const response = await addNoUserDeliverymanService(companyData.id, nameInput);

        if (response.status === 200) {
            fetchCompanyData();
            setCreateNoRegisteredDeliveryManModal(false);
        } else {
            alert("Error adding No Registered Delivery man. Please try again.");
        }
        setDisabled(false);
    }


    async function handleRemoveNoRegisteredDeliveryMan() {
        if (nameInput && nameInput.length < 3) {
            alert("Please enter a valid name with at least 3 characters.");
            return;
        }

        if (nameInput.toLowerCase() !== deleteNoRegisteredDeliveryManModal.toLowerCase()) {
            alert("Name confirmation doesn't match, please type the exact name to confirm deletion.");
            return;
        }
        setDisabled(true);

        const response = await removeNoUserDeliverymanService(companyData.id, deleteNoRegisteredDeliveryManModal);

        if (response.status === 200) {
            fetchCompanyData();
            setDeleteNoRegisteredDeliveryManModal(false);
        } else {
            alert("Error adding No Registered Delivery man. Please try again.");
        }
        setDisabled(false);
    }

    return (
        <>
            <div style={{ marginBottom: '15px', marginRight: '10px' }}>
                <div className='transparentCanvas' style={{ width: '100%', borderRadius: '6px', }} >
                    <img src={unknownUSer} alt="Logo" style={{
                        width: isPcV ? 40 : 30, height: isPcV ? 40 : 30, backgroundColor: 'rgba(255, 255, 255, 1)',
                        borderRadius: '50%', marginRight: 10, padding: 6,
                    }} />
                    <div className='flexRow spaceBetweenJC' style={{ width: '100%', alignItems: 'center' }}>
                        <span style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold' }}>{'No Registered Delivery Man'} </span>
                        {/* <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown}
                            style={{ fontSize: isPcV ? '20px' : '16px', marginRight: isPcV ? '20px' : '5px', borderRadius: '4px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} /> */}
                    </div>
                </div>

                <div className='flexColumn' style={{ margin: '0px 10px', padding: '15px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>
                    <div className='transparentCanvas fullCenter' style={{ padding: '6px 10px', marginBottom: 5 }} onClick={() => { setCreateNoRegisteredDeliveryManModal(true); }}>

                        <div className='transparentCanvas fullCenter' style={{ borderRadius: '50%', marginRight: 10, height: '28px', width: '28px' }} >
                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                        </div>
                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                            <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: '500' }}>{`Add No Registered Delivery Man`}</span>
                        </div>
                    </div>

                    {companyData?.noUserDeliveryMans && companyData?.noUserDeliveryMans.length > 0 ? (
                        companyData?.noUserDeliveryMans.map((deliveryman, idx) => (
                            <div key={idx} className='flexRow' style={{ alignItems: 'center', marginBottom: 5, marginLeft: 20, cursor: 'pointer' }} onClick={() => { setDeleteNoRegisteredDeliveryManModal(deliveryman); }}>
                                <img src={avatar} alt="Logo" style={{
                                    width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, opacity: 0.4,
                                    borderRadius: '50%', backgroundColor: 'transparent', border: "0px solid white", marginRight: 10
                                }} />
                                <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                    <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold' }}>{`${deliveryman}`}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                            <span style={{ fontSize: isPcV ? 18 : 15, fontWeight: 'bold' }}>{`No No User Delivery Man Registered`}</span>
                        </div>
                    )}
                </div>
            </div>

            {createNoRegisteredDeliveryManModal && <div className='myModal underDeliveryLayout' >
                <div className='modalInside' style={{ padding: '10px', width: isPcV ? "70%" : "95%", maxHeight: !isPcV ? "95%" : "90%", }}>

                    <div className='flexColumn fullCenter' >
                        <input className='inputStandart' type="text" placeholder="Enter No Registered Delivery Man Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                            style={{ width: '80%', marginTop: '10px', textAlign: 'center' }} disabled={disabled} />
                    </div>

                    {!disabled && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '15px' }}>
                        <button className='buttonStandart' style={{ background: 'none', border: 'none' }} onClick={() => { setNameInput(null); setCreateNoRegisteredDeliveryManModal(false); }} disabled={disabled}>
                            {'Cancel'}</button>

                        {<button className='buttonStandart'
                            style={{ background: 'none', border: 'none', color: greenTwo(theme), opacity: (disabled || nameInput === null || nameInput?.length < 3) ? 0.5 : 1, cursor: (disabled || nameInput === null || nameInput?.length < 3) ? 'not-allowed' : 'pointer' }}
                            onClick={() => { handleAddNoRegisteredDeliveryMan() }} disabled={disabled || nameInput?.length < 3} > {'ADD'}</button>}
                    </div>}

                    {disabled && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: '15px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>}

            {deleteNoRegisteredDeliveryManModal && <div className='myModal underDeliveryLayout' >
                <div className='modalInside' style={{ padding: '10px', width: isPcV ? "70%" : "95%", maxHeight: !isPcV ? "95%" : "90%", }}>

                    <div className='flexColumn fullCenter' >
                        <span style={{ fontSize: isPcV ? 20 : 16, fontWeight: '500', marginBottom: 10 }}>{`Type the name "${deleteNoRegisteredDeliveryManModal}" to confirm deletion:`}</span>
                        <span style={{ fontSize: isPcV ? 18 : 15, fontWeight: 'bold', color: blueOne(theme) }}>{`${deleteNoRegisteredDeliveryManModal}`}</span>
                        <input className='inputStandart' type="text" placeholder="Enter No Registered Delivery Man Name" value={nameInput} onChange={(e) => setNameInput(e.target.value)}
                            style={{ width: '80%', marginTop: '10px', textAlign: 'center' }} disabled={disabled} />
                    </div>

                    {!disabled && <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '15px' }}>
                        <button className='buttonStandart' style={{ background: 'none', border: 'none' }} onClick={() => { setNameInput(null); setDeleteNoRegisteredDeliveryManModal(false); }}
                            disabled={disabled}>{'Cancel'}</button>

                        {<button className='buttonStandart' style={{ background: 'none', border: 'none', color: redOne(theme), opacity: (disabled || nameInput === null) ? 0.5 : 1, cursor: (disabled || nameInput === null) ? 'not-allowed' : 'pointer' }}
                            onClick={() => { handleRemoveNoRegisteredDeliveryMan() }} disabled={disabled || nameInput === null} >{'Delete'}</button>}
                    </div>}

                    {disabled && <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%', marginTop: '15px' }}>
                        <Spinner animation="border" role="status" variant="light" style={{ width: '25px', height: '25px' }} />
                    </div>}
                </div>
            </div>}
        </>
    );
}