import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import companiesGroupLogo from '../../../../../../assets/companiesGroupLogo.png';
import { createeCompoundService } from "../../../../../../services/deliveryServices/CompoundService";


export default function CreateCompoundModal({ close, fetchUserInfos }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [compoundName, setCompoundName] = useState("");
    const [compoundDescription, setCompoundDescription] = useState("");

    const [disable, setDisable] = useState(false);


    async function handleCreateCompound() {
        if (compoundName?.length > 3 && compoundDescription?.length > 5) {
            setDisable(true);

            const response = await createeCompoundService(compoundName, compoundDescription);

            if (response.status === 200) {
                fetchUserInfos();
                close();
            } else {
                alert("Server error while creating compound. Please try again.");
            }
        } else {
            alert("Please fill all fields correctly.");
        }

        setDisable(false);
    }


    return (
        <>
            <div className='modalInside' style={{ width: 'auto', padding: '10px', width: !isPcV ? "95%" : "90%", maxHeight: !isPcV ? "95%" : "90%",}}>
                <div className='transparentCanvas' style={{ flexDirection: 'column', backgroundColor: transparentCavasTwo(theme), padding: '10px', }} >

                    <div className='flexColumn' style={{ width: '100%', padding: '10px 0px', }} >
                        <div className='flexRow' style={{ alignItems: 'center', height: '100%', position: 'relative' }} >
                            <img src={companiesGroupLogo} alt="Logo" style={{
                                width: isPcV ? '160px' : '120px', height: isPcV ? '160px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", border: `3px solid ${borderColorTwo(theme)}`,
                                boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isPcV ? '20px' : '20px',
                            }} />

                            <div className='flexColumn fullCenter' style={{ width: '100%' }} >
                                <button className={`roundedButton ${!disable && 'green'} ${!isPcV && 'small'}`} style={{ position: 'absolute', right: 5, top: 0, }} onClick={() => { if (!disable) handleCreateCompound(); }} >
                                    {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                    {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                </button>
                                {!disable && <button className={`roundedButton red ${!isPcV && 'small'}`} style={{ opacity: 0.7, position: 'absolute', right: isPcV ? 65 : 50, top: 0, }} onClick={() => { close() }} >
                                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                                </button>}

                                <div className='flexRow' style={{ marginLeft: '10px', width: '96%' }} >
                                    <input className='inputStandart' type="text" value={compoundName} placeholder="Chain Name"
                                        onChange={(e) => setCompoundName(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', }} />
                                </div>
                            </div>
                        </div>
                        <div className='flexColumn' style={{ alignItems: 'flex-start', }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                            <textarea className='textAreaStandart' rows={7} style={{ width: '100%' }} value={compoundDescription} onChange={(e) => setCompoundDescription(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}