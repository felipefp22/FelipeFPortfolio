import { faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { use, useEffect, useRef, useState } from "react";
import { Table } from "react-bootstrap";
import noFoodImg from "./../../../../../../assets/noFood.jpg";
import { useSelector } from "react-redux";
import { blueOne, borderColorTwo, fontColorOne, greenOne, greenTwo, purpleOne, redOne } from "../../../../../../theme/Colors";
import { getImageFoodService } from "../../../../../../services/deliveryServices/auxServices/FoodsImagesService";
import CustomItemModal from './2ndLevel/CustomItemModal';
import Tooltip from '@mui/material/Tooltip';

export default function SelectItemsModal({ close, allCompanyProductsCategories, setAllCompanyProductsCategories, selectedProductsToAdd, setSelectedProductsToAdd, selectedCustomItemsToAdd, setSelectedCustomItemsToAdd }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [buttonFilter, setButtonFilter] = useState("All");
    const [inputSearchItem, setInputSearchItem] = useState("")

    const [productsFiltered, setProductsFiltered] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCustomItems, setSelectedCustomItems] = useState([]);

    const [createCustomItemModal, setCreateCustomItemModal] = useState(false);


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
        const selectedProductstoPass = selectedProducts.map(prod => {
        });

        setSelectedProductsToAdd([...selectedProductsToAdd, ...selectedProducts]);
        setSelectedCustomItemsToAdd([...selectedCustomItemsToAdd, ...selectedCustomItems]);

        close();
    }

    async function removeItems(productID) {
        const index = selectedProducts.findIndex(p => p.id === productID);

        if (index !== -1) {
            const newSelectedProducts = [...selectedProducts];
            newSelectedProducts.splice(index, 1); // remove only the first occurrence
            setSelectedProducts(newSelectedProducts);
        }
    }

    async function removeCustomItems(idsToRemove) {
        console.log("idsToRemove: ", idsToRemove);
        const index = selectedCustomItems.findIndex(item =>
            arraysEqualIgnoreOrder(item.ids, idsToRemove)
        );

        if (index !== -1) {
            const newList = [...selectedCustomItems];
            newList.splice(index, 1); // remove just ONE
            setSelectedCustomItems(newList);
        }
    }

    function arraysEqualIgnoreOrder(a, b) {
        if (a.length !== b.length) return false;
        const setA = new Set(a);
        const setB = new Set(b);

        if (setA.size !== setB.size) return false;

        for (let val of setA) {
            if (!setB.has(val)) return false;
        }

        return true;
    }

    useEffect(() => {
        console.log("selectedCustomItems: ", selectedCustomItems);
    }, [selectedCustomItems]);

    useEffect(() => {
        console.log("selectedProducts: ", selectedProducts);
    }, [selectedProducts]);

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "98%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>

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
                                {selectedCustomItems?.map((custom, index) => (
                                    <tr key={index}>
                                        <Tooltip title={<>{`${custom.name}`} <br /> {`${custom?.productOptsNames ?? ''}`} <br /> {`${custom.notes ? 'Notes: ' + custom.notes : ''}`}</>}  arrow
                                        slotProps={{ popper: { className: "neon-tooltip", modifiers: [{ name: 'offset', options: { offset: [0, -14] } }] } }}>
                                            <td style={{ width: "100%", padding: '5px 5px' }} >{custom.name + (custom?.productOptsIDs?.length > 0 ? ' +' + custom?.productOptsIDs?.length : '')}</td>
                                        </Tooltip>
                                        <td style={{ width: "40px", padding: '5px 5px' }}>{custom.price.toFixed(2)}</td>
                                        <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeCustomItems(custom.ids) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
                                    </tr>
                                ))}
                                {selectedProducts?.map((product, index) => (
                                    <tr key={index}>
                                        <td style={{ width: "100%", padding: '5px 5px' }}>{product.name}</td>
                                        <td style={{ width: "40px", padding: '5px 5px' }}>{product.price}</td>
                                        <td style={{ width: "40px", padding: '5px 5px' }} onClick={() => { removeItems(product.id) }}><FontAwesomeIcon icon={faTrash} style={{ cursor: "pointer", color: "red" }} /></td>
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
            </div >

            {createCustomItemModal && <div className='myModal' >
                <CustomItemModal close={() => { setInputSearchItem(''); setCreateCustomItemModal(false); }} category={buttonFilter} inputSearchItem={inputSearchItem} setInputSearchItem={setInputSearchItem} productsFiltered={productsFiltered} customSize={createCustomItemModal} setSelectedCustomItems={setSelectedCustomItems} />
            </div>}
        </>
    );
}