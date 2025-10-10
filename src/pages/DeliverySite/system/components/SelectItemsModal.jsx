import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import noFoodImg from "./../../../../assets/noFood.jpg";
import { useSelector } from "react-redux";

export default function SelectItemsModal({ close, allCompanyProductsCategories, setAllCompanyProductsCategories, selectedProductsToAdd, setSelectedProductsToAdd }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

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
            <div className="modalInside" style={{ width: !isDesktopView ? "100%" : "85%", maxHeight: '90%', padding: !isDesktopView ? '10px' : '20px', zIndex: 10, }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', width: '100%', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <button className="buttomDarkBlue" style={{marginLeft: '0px', border: buttonFilter === "All" ? "1px solid white" : "none" }}
                            onClick={() => setButtonFilter("All")}>All</button>

                        {allCompanyProductsCategories && allCompanyProductsCategories?.map((category) => (
                            <button key={category?.id} className="buttomDarkBlue" style={{ marginLeft: '0px', border: buttonFilter === category ? "1px solid white" : "none" }}
                                onClick={() => setButtonFilter(category)}>{category?.categoryName}</button>
                        ))}

                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '5px', padding: 3, overflowY: 'auto' }}>
                        <input type="text" value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                            style={{
                                height: '25px', fontSize: '16px', backgroundColor: 'white', color: 'black', width: '100%', height: 40, paddingLeft: '10px', borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto',
                                border: '2px solid lightgray', borderRadius: '5px', margin: 0, boxSizing: 'border-box', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)', color: 'red'
                            }} />

                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                            {productsFiltered && productsFiltered?.map((product) => (
                                <div style={{ display: 'flex', flexDirection: 'column', width: '80px', height: "96px", margin: 5, cursor: 'pointer' }} onClick={() => { setSelectedProducts([...selectedProducts, product]); }}>
                                    <img src={noFoodImg} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                    <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                </div>
                            ))
                            }
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', textAlign: 'left' }}>
                    <span style={{ fontWeight: "600", marginBottom: '5px' }}>Itens to Add</span>
                    <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', padding: '10px', width: '98%', height: '200px', overflow: 'auto', border: '1px solid lightgray' }}>
                        <Table responsive="sm" >
                            <thead>
                                <tr>
                                    <th style={{ width: "100%" }}>Item</th>
                                    <th style={{ width: "40px" }}>Price</th>
                                    <th style={{ width: "40px" }}><FontAwesomeIcon icon={faTrash} /></th>
                                </tr>
                            </thead>
                            <tbody >
                                {selectedProducts.map((product, index) => (
                                    <tr key={index}>
                                        <td>{product.name}</td>
                                        <td>{product.price}</td>
                                        <td onClick={() => { removeProduct(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className="buttomDarkRed" style={{ marginLeft: '0px' }} onClick={() => close()}>Cancel</button>
                            <button className="buttomDarkGreen" style={{ marginLeft: '0px' }} onClick={() => { addItemsToOrderAction(); }}>Add items</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}