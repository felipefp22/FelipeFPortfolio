import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, fontColorOne, greenOne, greenTwo, orangeOne, redOne } from "../../../../../../theme/Colors";
import { borderColorTwo, transparentCavasOne, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera, faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import companiesGroupLogo from '../../../../../../assets/companiesGroupLogo.png';
import noFood from '../../../../../../assets/noFood.jpg';
import SelectProductImageModal from "./auxs/SelectProductImageModal";
import { getImageFoodService } from "../../../../../../services/deliveryServices/auxServices/FoodsImagesService";
import { createProductService, updateProductService } from "../../../../../../services/deliveryServices/ProductService";


export default function EditProductModal({ close, companyData, productSelected, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [productID, setProductID] = useState("");
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [imagePath, setImagePath] = useState("");

    const [disable, setDisable] = useState(false);
    const [editing, setEditing] = useState(false);

    const [selectImageModal, setSelectImageModal] = useState(false);

    useEffect(() => {
        if (productSelected) {
            setProductID(productSelected?.id);
            setProductName(productSelected?.name);
            setProductPrice(productSelected?.price);
            setProductDescription(productSelected?.description);
            setImagePath(productSelected?.imagePath);
        }
    }, [productSelected]);

    async function handleSetPrice(value) {
        value = value.replace(',', '.'); // convert commas to dots
        value = value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        const [intPart, decPart] = value.split('.');
        if (decPart && decPart.length > 2) {
            value = `${intPart}.${decPart.slice(0, 2)}`;
        }
        setProductPrice(value);
    }

    async function handleEditProduct() {
        setDisable(true);

        if (productSelected?.name !== productName || productSelected?.price !== productPrice || productSelected?.description !== productDescription || productSelected?.imagePath !== imagePath) {
            const categoryID = companyData?.productsCategories?.find(cat => cat.products?.some(prod => prod.id === productSelected?.id))?.id;

            const response = await updateProductService(companyData?.id, productID, productName, productPrice, productDescription, imagePath, categoryID);
            if (response?.status === 200) {
                fetchCompanyData();
                close();
            }
        } else {
            setEditing(false);
        }
        setDisable(false);
    }


    return (
        <>
            <div className='myModal' style={{ zIndex: 100 }} >
                <div className='modalInside' style={{ width: 'auto', padding: '10px', width: !isPcV ? "95%" : "70%", maxHeight: !isPcV ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: ' 6px', width: '100%' }} >
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '5px' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{companyData?.productsCategories?.find(cat => cat.products?.some(prod => prod.id === productSelected?.id))?.categoryName} </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: isPcV ? '90%' : '100%', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)", }} >
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%', position: 'relative' }} >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
                                    <img src={getImageFoodService(imagePath)} alt="Logo" style={{
                                        width: isPcV ? '140px' : '120px', height: isPcV ? '140px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "white", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                                        boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isPcV ? '3px' : '3px',
                                    }} />
                                    {editing && <div style={{
                                        borderRadius: '50%', backgroundColor: 'rgba(39, 39, 39, 0.99)', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'absolute', width: '38px', height: '38px', right: -2, bottom: -2, cursor: 'pointer'
                                    }} onClick={() => setSelectImageModal(true)} >
                                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                                    </div>}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', width: '100%' }} >
                                    <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: editing ? (disable ? 'transparent' : greenOne(theme)) : transparentCavasOne(theme), opacity: editing ? 1 : 1, marginLeft: 10, width: isPcV ? '42px' : '33px', height: isPcV ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 5, top: 0,
                                    }} onClick={() => { editing ? (!disable && handleEditProduct()) : setEditing(true) }} >
                                        {!disable && <FontAwesomeIcon icon={editing ? faCheck : faPen} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                        {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                    </div>
                                    {!disable && <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isPcV ? '42px' : '33px', height: isPcV ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: isPcV ? 65 : 50, top: 0,
                                    }} onClick={() => { close() }} >
                                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                                    </div>}

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', width: '100%' }} >
                                        {!editing && <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '36px' : '18px', fontWeight: 'bold' }}>{productName ?? 'N/A'}</span>}
                                        {editing && <input className='inputStandart' type="text" value={productName} placeholder="Product Name"
                                            onChange={(e) => setProductName(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', height: '35px' }} />}

                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isPcV ? '30px 10px 0px 10px' : '30px 10px 0px 10px', }} >
                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Price: </span>

                                    {editing && <input className='inputStandart' type="text" value={productPrice} style={{ maxWidth: '100px', textAlign: 'center' }} onChange={(e) => handleSetPrice(e.target.value)} />}
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginLeft: '5px', marginRight: '5px', color: greenTwo(theme) }}>$ </span>
                                    {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{productPrice ?? "N/A"}</span>}
                                </div>
                                {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>xpto: </span>
                                    <input className='inputStandart' type="text" value={productPrice} style={{ maxWidth: '300px' }} onChange={(e) => setProductPrice(e.target.value)} />
                                </div> */}
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '0px', width: '100%' }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                                    {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{productDescription ?? "N/A"}</span>}
                                    {editing && <textarea className='textAreaStandart' rows={4} style={{ width: '100%' }} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {selectImageModal && <div className='myModal underDeliveryLayout' style={{ zIndex: 10000 }} >
                <SelectProductImageModal close={() => setSelectImageModal(false)} imagePath={imagePath} setImagePath={setImagePath} />
            </div>}
        </>
    );
}