import { useSelector } from "react-redux";
import { borderColorTwo, transparentCavasTwo } from "../../../../../theme/Colors";
import { useEffect, useState } from "react";
import { faPlus, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cutleryLogo from '../../../../../assets/cutleryLogo.png';
import CreateProductModal from "./modals/CreateProductModal";
import { getImageFoodService } from "../../../../../services/deliveryServices/auxServices/FoodsImagesService";
import EditProductModal from "./modals/EditProductModal";
import CreateProductCategoryModal from "./modals/CreateProductCategoryModal";


export default function CompanyProducts({ companyData, fetchCompanyData }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);

    const [openStates, setOpenStates] = useState({});

    const [createProductCategoryModal, setCreateProductCategoryModal] = useState(false);
    const [createProductModal, setCreateProductModalOpen] = useState(false);
    const [editProductModal, setEditProductModal] = useState(false);

    const toggleOpen = (index) => {
        setOpenStates((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };


    return (
        <>
            <div className='flexColumn fullCenter' style={{ backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px', minWidth: '300px', maxWidth: '100%', maxHeight: '640px' }} >

                <div className='flexRow' style={{ width: '100%', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '5px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{"Products"} </span>
                </div>

                <div className='flexColumn' style={{ width: '100%', flexGrow: 1, overflowY: 'auto', }}>
                    <div className='transparentCanvas' style={{ marginBottom: '15px', }} onClick={() => { setCreateProductCategoryModal(true); }}>
                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }} >
                            <div className='transparentCanvas fullCenter' style={{ borderRadius: '50%', marginRight: 10, }} >
                                <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                            </div>
                            <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: '500' }}>{`Create Category`}</span>
                            </div>
                        </div>
                    </div>

                    {companyData?.productsCategories?.map((category, index) => {
                        const isOpen = openStates[index];
                        return (
                            <div key={index} style={{ marginBottom: '15px', }}>
                                <div className='transparentCanvas' style={{ width: '100%', borderRadius: '6px', }} onClick={() => toggleOpen(index)}>

                                    <img src={cutleryLogo} alt="Logo" style={{
                                        width: isPcV ? 40 : 30, height: isPcV ? 40 : 30,
                                        borderRadius: '50%', marginRight: 10, backgroundColor: 'rgba(0, 0, 32, 0.79)', padding: '6px',
                                    }} />
                                    <div className='flexRow spaceBetweenJC' style={{ width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold' }}>{category?.categoryName} </span>
                                        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown}
                                            style={{ fontSize: isPcV ? '20px' : '16px', marginRight: isPcV ? '20px' : '5px', borderRadius: '4px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                                {!isOpen && <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 6px', padding: '3px 5px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>

                                    <div className='transparentCanvas fullCenter' style={{ padding: '6px 10px', margin: '3px 5px', marginBottom: '5px' }}
                                        onClick={() => { setCreateProductModalOpen(category) }}>

                                        <div className='transparentCanvas fullCenter' style={{ borderRadius: '50%', marginRight: 10, height: '28px', width: '28px' }} >
                                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                                        </div>
                                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: '500' }}>{`Add New Product`}</span>
                                        </div>
                                    </div>
                                    {category?.products && category?.products?.length > 0 ? (
                                        category?.products?.map((product, idx) => (
                                            <div key={idx} className='transparentCanvas fullCenter' style={{ padding: '6px 10px', margin: '3px 5px', }} onClick={() => { setEditProductModal(product) }}>

                                                <img src={getImageFoodService(product?.imagePath)} alt="Logo" style={{
                                                    width: isPcV ? 36 : 28, boxShadow: `1px 2px 10px ${borderColorTwo(theme, 0.2)}`,
                                                    borderRadius: '50%', backgroundColor: 'white', marginRight: 10, padding: '2px',
                                                }} />
                                                <div className='flexRow spaceBetweenJC' style={{ width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: '500' }}>{`${product?.name}`}</span>
                                                    <span style={{ fontSize: isPcV ? '16px' : '13px', fontWeight: '400', color: borderColorTwo(theme) }}>{`$ ${product?.price}`}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                            {/* <span style={{ fontSize: isPcV ? '18px' : '15px', fontWeight: 'bold' }}>{`No Products Found`} </span> */}
                                        </div>
                                    )}
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {createProductCategoryModal && <div className='myModal underDeliveryLayout' >
                <CreateProductCategoryModal close={() => setCreateProductCategoryModal(false)} companyData={companyData} fetchCompanyData={() => fetchCompanyData()} />
            </div>}

            {createProductModal && <div className='myModal underDeliveryLayout' >
                <CreateProductModal close={() => setCreateProductModalOpen(false)} companyData={companyData} category={createProductModal} fetchCompanyData={() => fetchCompanyData()} />
            </div>}

            {editProductModal && <div className='myModal underDeliveryLayout' >
                <EditProductModal close={() => setEditProductModal(false)} companyData={companyData} productSelected={editProductModal} fetchCompanyData={() => fetchCompanyData()} />
            </div>}
        </>
    );
}