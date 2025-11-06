import { useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { fontColorOne, greenTwo, borderColorTwo, transparentCavasTwo } from "../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import SelectProductImageModal from "./auxs/SelectProductImageModal";
import { getImageFoodService } from "../../../../../../services/deliveryServices/auxServices/FoodsImagesService";
import { updateProductService } from "../../../../../../services/deliveryServices/ProductService";


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
            <div className='modalInside fullCenter' style={{ padding: '10px', maxWidth: !isPcV ? "95%" : "80%", maxHeight: !isPcV ? "95%" : "90%", }} >
                <div className='flexColumn fullCenter' style={{ backgroundColor: transparentCavasTwo(theme), width: '100%', padding: '10px', borderRadius: '6px', }} >
                    <div className='flexRow' style={{ marginBottom: '5px' }} >
                        <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{companyData?.productsCategories?.find(cat => cat.products?.some(prod => prod.id === productSelected?.id))?.categoryName} </span>
                    </div>

                    <div className='flexColumn fullCenter' style={{ width: isPcV ? '90%' : '100%', padding: '0px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)", }} >
                        <div className='flexRow' style={{ width: '100%', alignItems: 'center', position: 'relative' }} >
                            <div className='flexRow' style={{ position: 'relative' }} >
                                <img src={getImageFoodService(imagePath)} alt="Logo" style={{
                                    width: isPcV ? '140px' : '120px', height: isPcV ? '140px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "white", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                                    boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isPcV ? '3px' : '3px',
                                }} />
                                {editing && <button className='roundedButton' style={{ backgroundColor: 'rgba(96, 96, 96, 0.92)', padding: '6px', position: 'absolute', right: -2, bottom: -2, }} onClick={() => setSelectImageModal(true)} >
                                    <FontAwesomeIcon icon={faPen} style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                                </button>}
                            </div>

                            <div className='flexColumn fullCenter' style={{ width: '100%' }} >
                                <button className={`roundedButton ${(editing && !disable && 'green')} ${(!isPcV && 'small')}`} style={{marginLeft: 10, position: 'absolute', right: 5, top: 0, }} onClick={() => { editing ? (!disable && handleEditProduct()) : setEditing(true) }} >
                                    {!disable && <FontAwesomeIcon icon={editing ? faCheck : faPen} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />}
                                    {disable && <Spinner animation="border" role="status" style={{ width: isPcV ? '25px' : '20px', height: isPcV ? '25px' : '20px', color: 'white', }} />}
                                </button>
                                {!disable && <button className={`roundedButton red ${(!isPcV && 'small')}`} style={{ opacity: 0.7, position: 'absolute', right: isPcV ? 65 : 50, top: 0,}} onClick={() => { close() }} >
                                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: '500', }} />
                                </button>}

                                <div className='flexRow fullCenter' style={{ marginLeft: '10px',}} >
                                    {!editing && <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '36px' : '18px', fontWeight: 'bold' }}>{productName ?? 'N/A'}</span>}
                                    {editing && <input className='inputStandart' type="text" value={productName} placeholder="Product Name"
                                        onChange={(e) => setProductName(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', height: '35px' }} />}

                                </div>
                            </div>
                        </div>

                        <div className="flexColumn" style={{ width: '100%', justifyContent: 'left', padding: '30px 10px 0px 10px' }} >
                            <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'center', marginBottom: '10px' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>Price: </span>

                                {editing && <input className='inputStandart' type="text" value={productPrice} style={{ maxWidth: '100px', textAlign: 'center' }} onChange={(e) => handleSetPrice(e.target.value)} />}
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginLeft: '5px', marginRight: '5px', color: greenTwo(theme) }}>$ </span>
                                {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{productPrice ?? "N/A"}</span>}
                            </div>
                            {/* <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '10px' }} >
                                    <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px', }}>xpto: </span>
                                    <input className='inputStandart' type="text" value={productPrice} style={{ maxWidth: '300px' }} onChange={(e) => setProductPrice(e.target.value)} />
                                </div> */}
                            <div className='flexColumn' style={{ width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '0px', width: '100%' }} >
                                <span style={{ fontSize: isPcV ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                                {!editing && <span style={{ fontSize: isPcV ? '22px' : '16px' }}>{productDescription ?? "N/A"}</span>}
                                {editing && <textarea className='textAreaStandart' rows={4} style={{ width: '100%' }} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {selectImageModal && <div className='myModal underDeliveryLayout' >
                <SelectProductImageModal close={() => setSelectImageModal(false)} imagePath={imagePath} setImagePath={setImagePath} />
            </div>}
        </>
    );
}