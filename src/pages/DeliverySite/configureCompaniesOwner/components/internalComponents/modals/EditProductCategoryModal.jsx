import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { fontColorOne, } from "../../../../../../theme/Colors";
import { borderColorTwo, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import cutleryLogo from '../../../../../../assets/cutleryLogo.png';
import { createProductsCategoriesService, updateProductsCategoriesService } from "../../../../../../services/deliveryServices/ProductsCategoryService";

export default function EditProductCategoryModal({ close, companyData, categoryToEdit, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [categoryNameCandidate, setCategoryNameCandidate] = useState(categoryToEdit?.categoryName);
    const [categoryDescriptionCandidate, setCategoryDescriptionCandidate] = useState(categoryToEdit?.description);
    const [customOrderAllowedCandidate, setCustomOrderAllowedCandidate] = useState(categoryToEdit?.customOrderAllowed);
    const [customOrderPriceRuleCandidate, setCustomOrderPriceRuleCandidate] = useState(categoryToEdit?.customOrderPriceRule);

    const [disable, setDisable] = useState(false);


    async function handleUpdateProductCategory() {
        if(categoryNameCandidate === '' || categoryNameCandidate === null){
            alert("Category name cannot be empty.");
            return;
        }
        
        if ((customOrderAllowedCandidate !== '' && customOrderAllowedCandidate !== null) && (customOrderPriceRuleCandidate === '' || customOrderPriceRuleCandidate === null)) {
            alert("Please select a price rule for custom orders.");
            return;
        }

        if (categoryNameCandidate !== categoryToEdit?.categoryName || categoryDescriptionCandidate !== categoryToEdit?.description ||
            customOrderAllowedCandidate !== categoryToEdit?.customOrderAllowed || customOrderPriceRuleCandidate !== categoryToEdit?.customOrderPriceRule) {

            setDisable(true);
            const response = await updateProductsCategoriesService(companyData?.id, categoryToEdit?.id, categoryNameCandidate, categoryDescriptionCandidate, customOrderAllowedCandidate, customOrderPriceRuleCandidate);
            if (response?.status === 200) {
                fetchCompanyData();
                close();
            }
        } else {
            close();
        }

        setDisable(false);
    }


    return (
        <>
            <div className='modalInside' style={{ padding: '10px', width: !isPcV ? "95%" : "70%", maxHeight: !isPcV ? "95%" : "90%", }}>
                <div className='transparentCanvas' style={{ flexDirection: 'column', backgroundColor: transparentCavasTwo(theme), padding: '10px', }} >
                    <div className='flexRow' style={{ marginBottom: '5px' }} >
                        <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{companyData?.companyName} </span>
                    </div>

                    <div className='flexColumn' style={{ width: '100%', padding: '10px 0px', }} >
                        <div className='flexRow' style={{ alignItems: 'center', height: '100%', position: 'relative' }} >
                            <div className='flexRow' style={{ position: 'relative' }} >
                                <img src={cutleryLogo} alt="Logo" style={{
                                    width: isPcV ? '140px' : '120px', height: isPcV ? '140px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", border: `3px solid ${borderColorTwo(theme)}`,
                                    boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isPcV ? '15px' : '10px',
                                }} />
                                {/* <div style={{
                                        borderRadius: '50%', backgroundColor: 'rgba(39, 39, 39, 0.99)', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'absolute', width: '38px', height: '38px', right: -2, bottom: -2, cursor: 'pointer'
                                    }} onClick={() => setSelectImageModal(true)} >
                                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                                    </div> */}
                            </div>

                            <div className='flexColumn fullCenter' style={{ width: '100%' }} >
                                <button className={`roundedButton ${!disable && 'green'} ${!isPcV && 'small'}`} style={{ position: 'absolute', right: 5, top: 0, }} onClick={() => { if (!disable) handleUpdateProductCategory(); }} >
                                    {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                    {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                </button>
                                {!disable && <button className={`roundedButton red ${!isPcV && 'small'}`} style={{ opacity: 0.7, position: 'absolute', right: isPcV ? 65 : 50, top: 0, }} onClick={() => { close() }} >
                                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                                </button>}

                                <div className='flexRow' style={{ marginLeft: '10px', width: '96%' }} >
                                    <input className='inputStandart' type="text" value={categoryNameCandidate} placeholder="Product Category Name"
                                        onChange={(e) => setCategoryNameCandidate(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', }} />
                                </div>
                            </div>
                        </div>
                        <br />

                        <div className='flexRow' style={{ alignItems: 'center', }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Custom Order Allowed: </span>
                            <select className='inputStandart' value={customOrderAllowedCandidate} onChange={(e) => setCustomOrderAllowedCandidate(e.target.value)} style={{ maxWidth: '120px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                <option value={''}> {'No'}</option>
                                <option value={2}> {'1/2'}</option>
                                <option value={3}> {'1/3'}</option>
                                <option value={4}> {'1/4'}</option>
                            </select>
                        </div>
                        <div className='flexRow' style={{ alignItems: 'center', marginTop: 10, visibility: (customOrderAllowedCandidate !== null && customOrderAllowedCandidate !== '') ? 'visible' : 'hidden' }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Custom Order Price Rule: </span>
                            <select className='inputStandart' value={customOrderPriceRuleCandidate} onChange={(e) => setCustomOrderPriceRuleCandidate(e.target.value)} style={{ maxWidth: '200px', padding: '5px', borderRadius: '6px', fontSize: '16px', textAlign: 'center' }} >
                                {(customOrderPriceRuleCandidate === null || customOrderPriceRuleCandidate === '') && <option value={''}> {'Select Price Rule'}</option>}
                                <option value={'AVERAGE'}> {'Average Price'}</option>
                                <option value={'BIGGESTPRICE'}> {'Biggest Price'}</option>
                            </select>
                        </div>
                        <br />

                        <div className='flexColumn' style={{ alignItems: 'flex-start', }} >
                            <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                            <textarea className='textAreaStandart' rows={4} style={{ width: '100%' }} value={categoryDescriptionCandidate ?? companyData?.description} onChange={(e) => setCategoryDescriptionCandidate(e.target.value)} />
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}