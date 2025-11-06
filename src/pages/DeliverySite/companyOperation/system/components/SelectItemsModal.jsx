import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import noFoodImg from "./../../../../../assets/noFood.jpg";
import { useSelector } from "react-redux";
import { blueOne, borderColorTwo, greenOne, redOne } from "../../../../../theme/Colors";
import { getImageFoodService } from "../../../../../services/deliveryServices/auxServices/FoodsImagesService";

export default function SelectItemsModal({ close, allCompanyProductsCategories, setAllCompanyProductsCategories, selectedProductsToAdd, setSelectedProductsToAdd }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [buttonFilter, setButtonFilter] = useState("All");
    const [inputSearchItem, setInputSearchItem] = useState("")

    const [productsFiltered, setProductsFiltered] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);

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
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "85%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', zIndex: 10, }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', width: '100%', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <button className='buttomStandart blue' style={{marginLeft: '0px', border: buttonFilter === "All" ? "1px solid white" : "none" }}
                            onClick={() => setButtonFilter("All")}>All</button>

                        {allCompanyProductsCategories && allCompanyProductsCategories?.map((category) => (
                            <button key={category?.id} className='buttomStandart blue' style={{ marginLeft: '0px', border: buttonFilter === category ? "1px solid white" : "none" }}
                                onClick={() => setButtonFilter(category)}>{category?.categoryName}</button>
                        ))}

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', padding: 3, overflowY: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <input type="text" className='inputStandart' value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                            style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                            {productsFiltered && productsFiltered?.map((product, idx) => (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '80px', height: "96px", margin: 5, cursor: 'pointer' }} onClick={() => { setSelectedProducts([...selectedProducts, product]); }}>
                                    <img src={product?.imagePath ? getImageFoodService(product?.imagePath) : noFoodImg} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                    <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', textAlign: 'left' }}>
                    <span style={{ fontWeight: "bold", marginBottom: '5px' }}>Itens to Add</span>
                    <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', width: '98%', height: '200px', overflow: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <Table responsive="sm" >
                            <thead>
                                <tr>
                                    <th style={{width: "100%", backgroundColor: 'lightgray', padding: '3px 5px' }}>Item</th>
                                    <th style={{width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}>Price</th>
                                    <th style={{width: "40px", backgroundColor: 'lightgray', padding: '3px 5px' }}><FontAwesomeIcon icon={faTrash} /></th>
                                </tr>
                            </thead>
                            <tbody >
                                {selectedProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td style={{width: "100%", padding: '5px 5px' }}>{product.name}</td>
                                        <td style={{width: "40px", padding: '5px 5px' }}>{product.price}</td>
                                        <td style={{width: "40px", padding: '5px 5px' }} onClick={() => { removeProduct(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className='buttomStandart red' style={{ marginLeft: '0px' }} onClick={() => close()}>Cancel</button>
                            <button className='buttomStandart green' style={{ marginLeft: '0px' }} onClick={() => { addItemsToOrderAction(); }}>Add items</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}