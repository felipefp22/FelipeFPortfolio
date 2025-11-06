import { useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { fontColorOne, greenTwo, } from "../../../../../../theme/Colors";
import { borderColorTwo, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import SelectProductImageModal from "./auxs/SelectProductImageModal";
import { getImageFoodService } from "../../../../../../services/deliveryServices/auxServices/FoodsImagesService";
import { createProductService } from "../../../../../../services/deliveryServices/ProductService";


export default function CreateProductModal({ close, category, companyData, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [imagePath, setImagePath] = useState("");

    const [disable, setDisable] = useState(false);

    const [selectImageModal, setSelectImageModal] = useState(false);

    async function handleSetPrice(value) {
        value = value.replace(',', '.'); // convert commas to dots
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        const [intPart, decPart] = value.split('.');
        if (decPart && decPart.length > 2) {
            value = `${intPart}.${decPart.slice(0, 2)}`;
        }
        setProductPrice(value);
    }

    async function handleCreateProduct() {
        setDisable(true);
        const response = await createProductService(companyData?.id, productName, productPrice, productDescription, imagePath, category?.id);
        if (response?.status === 200) {
            fetchCompanyData();
            close();
        }

        setDisable(false);
    }


    return (
        <>
                <div className='modalInside' style={{ padding: '10px', width: !isPcV ? "95%" : "70%", maxHeight: !isPcV ? "95%" : "90%",}}>
                    <div className='transparentCanvas' style={{ flexDirection: 'column', backgroundColor: transparentCavasTwo(theme), padding: '10px', }} >
                        <div className='flexRow' style={{ marginBottom: '5px' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{category?.categoryName} </span>
                        </div>

                        <div className='flexColumn' style={{ width: '100%', padding: '10px 0px', }} >
                            <div className='flexRow' style={{ alignItems: 'center', height: '100%', position: 'relative' }} >
                                <div className='flexRow' style={{ position: 'relative' }} >
                                    <img src={getImageFoodService(imagePath)} alt="Logo" style={{
                                        width: isPcV ? '140px' : '120px', height: isPcV ? '140px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "white", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                                        boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isPcV ? '3px' : '3px',
                                    }} />
                                    <button className='roundedButton' style={{ backgroundColor: 'rgba(39, 39, 39, 0.99)', position: 'absolute', right: -2, bottom: -2, }} onClick={() => setSelectImageModal(true)} >
                                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                                    </button>
                                </div>

                                <div className='flexColumn fullCenter' style={{ width: '100%' }} >
                                    <button className={`roundedButton ${!disable && 'green'} ${!isPcV && 'small'}`} style={{ position: 'absolute', right: 5, top: 0, }} onClick={() => { if (!disable) handleCreateProduct(); }} >
                                        {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                        {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                    </button>
                                    {!disable && <button className={`roundedButton red ${!isPcV && 'small'}`} style={{ opacity: 0.7, position: 'absolute', right: isPcV ? 65 : 50, top: 0, }} onClick={() => { close() }} >
                                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                                    </button>}

                                    <div className='flexRow' style={{ marginLeft: '10px', width: '96%' }} >
                                        <input className='inputStandart' type="text" value={productName} placeholder="Product Name"
                                            onChange={(e) => setProductName(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', }} />
                                    </div>
                                </div>
                            </div>

                            <div className='flexColumn' style={{ padding: isPcV ? '30px 10px 0px 10px' : '30px 10px 0px 10px', }} >
                                <div className='flexRow' style={{alignItems: 'center', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Price: </span>
                                    <input className='inputStandart' type="text" value={productPrice} style={{ maxWidth: '100px', textAlign: 'center' }} onChange={(e) => handleSetPrice(e.target.value)} />
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginLeft: '5px', color: greenTwo(theme) }}>$ </span>
                                </div>
                                <div className='flexColumn' style={{ alignItems: 'flex-start',  }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                                    <textarea className='textAreaStandart' rows={4} style={{ width: '100%' }} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            {selectImageModal && <div className='myModal underDeliveryLayout' style={{ zIndex: 10000 }} >
                <SelectProductImageModal close={() => setSelectImageModal(false)} imagePath={imagePath} setImagePath={setImagePath} />
            </div>}
        </>
    );
}