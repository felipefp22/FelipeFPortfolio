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
import { createProductService } from "../../../../../../services/deliveryServices/ProductService";
import cutleryLogo from '../../../../../../assets/cutleryLogo.png';
import { createProductsCategoriesService } from "../../../../../../services/deliveryServices/ProductsCategoryService";

export default function CreateProductCategoryModal({ close, companyData, fetchCompanyData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");

    const [disable, setDisable] = useState(false);

    const [selectImageModal, setSelectImageModal] = useState(false);


    async function handleCreateProductCategory() {
        setDisable(true);
        const response = await createProductsCategoriesService(companyData?.id, categoryName, categoryDescription);
        if (response?.status === 200) {
            fetchCompanyData();
            close();
        }

        setDisable(false);
    }


    return (
        <>
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '10px', width: !isDesktopView ? "95%" : "70%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>
                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: ' 6px', width: '100%' }} >
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '5px' }} >
                            <span style={{ color: fontColorOne(theme), fontSize: isDesktopView ? '22px' : '17px', fontWeight: 'bold' }}>{companyData?.companyName} </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: isDesktopView ? '90%' : '100%', justifyContent: 'center', alignItems: 'center', padding: '10px 0px', backgroundColor: "rgba(255, 255, 255, 0.0)", }} >
                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', height: '100%', position: 'relative' }} >
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
                                    <img src={cutleryLogo} alt="Logo" style={{
                                        width: isDesktopView ? '140px' : '120px', height: isDesktopView ? '140px' : "120px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: `3px solid ${borderColorTwo(theme)}`,
                                        boxShadow: `1px 2px 20px ${borderColorTwo(theme, 0.2)}`, padding: isDesktopView ? '15px' : '10px',
                                    }} />
                                    {/* <div style={{
                                        borderRadius: '50%', backgroundColor: 'rgba(39, 39, 39, 0.99)', padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'absolute', width: '38px', height: '38px', right: -2, bottom: -2, cursor: 'pointer'
                                    }} onClick={() => setSelectImageModal(true)} >
                                        <FontAwesomeIcon icon={faPen} style={{ fontSize: '18px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                                    </div> */}
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', height: '100%', justifyContent: 'center', width: '100%' }} >
                                    <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: (disable ? 'transparent' : greenOne(theme)), opacity: 1, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: 5, top: 0,
                                    }} onClick={() => { if (!disable) handleCreateProductCategory(); }} >
                                        {!disable && <FontAwesomeIcon icon={faCheck} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />}
                                        {disable && <Spinner animation="border" role="status" style={{ width: isDesktopView ? '25px' : '20px', height: isDesktopView ? '25px' : '20px', color: 'white', }} />}
                                    </div>
                                    {!disable && <div style={{
                                        display: 'flex', borderRadius: '50%', backgroundColor: redOne(theme), opacity: 0.7, marginLeft: 10, width: isDesktopView ? '42px' : '33px', height: isDesktopView ? '42px' : '33px',
                                        padding: '6px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'absolute', right: isDesktopView ? 65 : 50, top: 0,
                                    }} onClick={() => { close() }} >
                                        <FontAwesomeIcon icon={faXmark} style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: '500', }} />
                                    </div>}

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginLeft: '10px', width: '100%' }} >
                                        <input className="inputStandart" type="text" value={categoryName} placeholder="Product Category Name"
                                            onChange={(e) => setCategoryName(e.target.value)} style={{ width: '100%', fontWeight: 'bold', textAlign: 'center', height: '35px' }} />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', padding: isDesktopView ? '30px 10px 0px 10px' : '30px 10px 0px 10px', }} >
                                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', justifyContent: 'left', alignItems: 'flex-start', marginBottom: '0px', width: '100%' }} >
                                    <span style={{ fontSize: isDesktopView ? '24px' : '18px', fontWeight: 'bold', marginRight: '20px' }}>Description: </span>
                                    <textarea className="textAreaStandart" rows={4} style={{ width: '100%' }} value={categoryDescription} onChange={(e) => setCategoryDescription(e.target.value)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            {/* {selectImageModal && <div className="myModal underDeliveryLayout" style={{ zIndex: 10000 }} >
                <SelectProductImageModal close={() => setSelectImageModal(false)} imagePath={imagePath} setImagePath={setImagePath} />
            </div>} */}
        </>
    );
}