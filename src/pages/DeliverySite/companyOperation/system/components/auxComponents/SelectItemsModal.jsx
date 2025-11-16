import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import noFoodImg from "./../../../../../../assets/noFood.jpg";
import { useSelector } from "react-redux";
import { blueOne, borderColorTwo, greenOne, purpleOne, redOne } from "../../../../../../theme/Colors";
import { getImageFoodService } from "../../../../../../services/deliveryServices/auxServices/FoodsImagesService";

export default function SelectItemsModal({ close, allCompanyProductsCategories, setAllCompanyProductsCategories, selectedProductsToAdd, setSelectedProductsToAdd }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [buttonFilter, setButtonFilter] = useState("All");
    const [inputSearchItem, setInputSearchItem] = useState("")

    const [productsFiltered, setProductsFiltered] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [createCustomItemModal, setCreateCustomItemModal] = useState(false);
    const [itemsSelectedToCreateCustom, setItemsSelectedToCreateCustom] = useState([]);

    useEffect(() => {
        if (buttonFilter === "All") {
            const filteredProducts = allCompanyProductsCategories?.flatMap(category => category?.products || []);
            setProductsFiltered(filteredProducts?.filter(product => product?.name.toLowerCase().includes(inputSearchItem.toLowerCase())));
        } else {
            const category = allCompanyProductsCategories?.find(cat => cat === buttonFilter);
            const filteredProducts = category?.products || [];
            setProductsFiltered(filteredProducts?.filter(product => product?.name.toLowerCase().includes(inputSearchItem.toLowerCase())));
        }
    }, [allCompanyProductsCategories, buttonFilter, inputSearchItem]);

    async function addItemsToOrderAction() {
        setSelectedProductsToAdd([...selectedProductsToAdd, ...selectedProducts]);
        close();
    }

    async function removeProduct(productID) {
        const index = selectedProducts.findIndex(p => p.id === productID);

        if (index !== -1) {
            const newSelectedProducts = [...selectedProducts];
            newSelectedProducts.splice(index, 1); // remove only the first occurrence
            setSelectedProducts(newSelectedProducts);
        }
    }

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "85%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>

                <div className='flexColumn' style={{ justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', }}>
                    <div className='flexRow' style={{ justifyContent: 'left', width: '100%', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <button className='buttonStandart blue' style={{ marginLeft: '0px', border: buttonFilter === "All" ? "1px solid white" : "none" }}
                            onClick={() => setButtonFilter("All")}>All</button>

                        {allCompanyProductsCategories && allCompanyProductsCategories?.map((category) => (
                            <button key={category?.id} className='buttonStandart blue' style={{ marginLeft: '0px', border: buttonFilter === category ? "1px solid white" : "none" }}
                                onClick={() => setButtonFilter(category)}>{category?.categoryName}</button>
                        ))}
                    </div>

                    <div className='flexColumn' style={{ width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <input type="text" className='inputStandart' value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                            style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                        <div className='flexRow' style={{ justifyContent: 'center', width: '100%', flexWrap: 'wrap', overflowY: 'auto', }}>
                            {buttonFilter?.customOrderAllowed && buttonFilter?.customOrderAllowed > 1 && Array.from({ length: buttonFilter.customOrderAllowed - 1 }, (_, idx) => idx + 2).map((value) => (
                                <div key={value} className='flexColumn fullCenter' style={{ width: '80px', margin: 5, cursor: 'pointer', border: `1px solid ${borderColorTwo(theme)}`, borderRadius: 6 }} onClick={() => { setCreateCustomItemModal(value) }} >
                                    <div className='flexRow fullCenter' style={{ padding: 15, backgroundColor: 'rgba(222, 181, 32, 0.76)', borderRadius: 6 }} >
                                        <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black', whiteSpace: 'nowrap' }}>
                                            {'1 / ' + value}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {productsFiltered && productsFiltered?.map((product, idx) => (
                                <div key={idx} className='flexColumn' style={{ width: '80px', margin: 5, cursor: 'pointer' }} onClick={() => { setSelectedProducts([...selectedProducts, product]); }}>
                                    <img src={product?.imagePath ? getImageFoodService(product?.imagePath) : noFoodImg} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                    <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', borderTop: '1px solid lightgray', margin: '5px 0' }}></div>

                <div className='flexColumn' style={{ width: '100%', flexWrap: 'wrap', textAlign: 'left' }}>
                    <span style={{ fontWeight: "bold", marginBottom: '5px' }}>Itens to Add</span>
                    <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', width: '100%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <Table responsive="sm" >
                            <thead>
                                <tr>
                                    <th style={{ width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Item</th>
                                    <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Price</th>
                                    <th style={{ width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}><FontAwesomeIcon icon={faTrash} /></th>
                                </tr>
                            </thead>
                            <tbody >
                                {selectedProducts?.map((product, index) => (
                                    <tr key={index}>
                                        <td style={{ width: "100%", padding: '5px 5px' }}>{product.name}</td>
                                        <td style={{ width: "40px", padding: '5px 5px' }}>{product.price}</td>
                                        <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeProduct(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div className='flexRow spaceBetweenJC' style={{ width: '100%', marginTop: '15px' }}>
                    <button className='buttonStandart red' onClick={() => close()}>Cancel</button>
                    <button className='buttonStandart green' onClick={() => { addItemsToOrderAction(); }}>Add items</button>
                </div>

                {createCustomItemModal && <div className='myModal underDeliveryLayout' >
                    <div className='modalInside' style={{ width: !isPcV ? "100%" : "85%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>
                        <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '26px' : '20px', fontWeight: 'bold' }}>{buttonFilter.categoryName + " - " + createCustomItemModal + " Sabores"} </span>
                        <br />

                        <div className='flexColumn' style={{ width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <input type="text" className='inputStandart' value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                                style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                            <div className='flexRow' style={{ justifyContent: 'center', width: '100%', flexWrap: 'wrap', overflowY: 'auto', }}>
                                {productsFiltered && productsFiltered?.map((product, idx) => (
                                    <div key={idx} className='flexColumn' style={{ width: '80px', margin: 5, cursor: 'pointer', position: 'relative',}}
                                        onClick={() => { if (!itemsSelectedToCreateCustom.some(p => p.id === product.id) && itemsSelectedToCreateCustom.length < createCustomItemModal) setItemsSelectedToCreateCustom([...itemsSelectedToCreateCustom, product]); }}>
                                        <img src={product?.imagePath ? getImageFoodService(product?.imagePath) : noFoodImg} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                        <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                        {itemsSelectedToCreateCustom?.includes(product) && <div className='flexRow fullCenter'
                                            style={{
                                                position: 'absolute', top: -5, left: -5, width: 25, height: 25, borderRadius: '50%', backgroundColor: purpleOne(theme),
                                                border: '1px solid white', fontSize: 17, fontWeight: 'bold', color: 'white', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.52)'
                                            }}>
                                            <FontAwesomeIcon icon={faCheck} /></div>}
                                    </div>
                                ))}
                            </div>
                        </div>


                        <div className='flexRow' style={{ marginTop: '10px', width: '100%', }}>
                            {itemsSelectedToCreateCustom && itemsSelectedToCreateCustom?.map((product, idx) => (
                                <div key={idx} className='flexColumn fullCenter' style={{ width: '80px', margin: 5, cursor: 'pointer', backgroundColor: 'rgba(240, 240, 240, 1)', borderRadius: 6, border: `2px solid ${borderColorTwo(theme)}`, position: 'relative' }}
                                    onClick={() => { setItemsSelectedToCreateCustom(prev => { const exists = prev.some(p => p.id === product.id); if (exists) { return prev.filter(p => p.id !== product.id); } return [...prev, product]; }); }}>
                                    <img src={product?.imagePath ? getImageFoodService(product?.imagePath) : noFoodImg} alt={""} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '5px' }} />
                                    <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                    <div className='flexRow fullCenter'
                                        style={{
                                            position: 'absolute', top: -10, left: -10, width: 25, height: 25, borderRadius: '50%', backgroundColor: purpleOne(theme),
                                            border: '1px solid white', fontSize: 17, fontWeight: 'bold', color: 'white', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.52)'
                                        }}>
                                        {idx + 1}</div>
                                </div>
                            ))}
                        </div>

                        <div className='flexRow spaceBetweenJC' style={{ marginTop: '10px', width: '100%' }}>
                            <button className='buttonNoBgNoBorder' onClick={() => { setCreateCustomItemModal(false); }} > Cancel </button>

                            {/* <button className='buttonNoBgNoBorder green' type="submit" style={{ cursor: (wordConfirmationToQuit !== wordToMatch) ? 'not-allowed' : 'pointer', opacity: (wordConfirmationToQuit !== wordToMatch) ? 0.5 : 1, }} */}
                            <button className='buttonNoBgNoBorder fontGreen' type="submit" style={{ opacity: 1, }}
                                onClick={() => { }} >Add</button>
                        </div>
                    </div>
                </div>}
            </div >
        </>
    );
}