import { faCheck, faPeace, faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { borderColorTwo, fontColorOne, greenOne, greenTwo, purpleOne } from '../../../../../../../theme/Colors';
import { getImageFoodService } from '../../../../../../../services/deliveryServices/auxServices/FoodsImagesService';
import noFoodImg from '../../../../../../../assets/noFood.jpg';


export default function CustomItemModal({ close, category, inputSearchItem, setInputSearchItem, productsFiltered, customRules, setSelectedCustomItems }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [itemsSelectedToCreateCustom, setItemsSelectedToCreateCustom] = useState([]);
    const [addonsSelectedToCreateCustom, setAddonsSelectedToCreateCustom] = useState([]);
    const [notesForCustomItem, setNotesForCustomItem] = useState("");

    const [tasteOrAddons, setTasteOrAddons] = useState('taste');
    const [itemsOrNotes, setItemsOrNotes] = useState('items');

    const [inputSearchAddons, setInputSearchAddons] = useState("");
    const [addonsFiltered, setAddonsFiltered] = useState([]);

    useEffect(() => {
        if (category?.productOptions?.length > 0) {
            setAddonsFiltered(category?.productOptions?.filter(item =>
                item.name.toUpperCase().includes(inputSearchAddons.toUpperCase())
            ));
        } else {
            setAddonsFiltered([]);
        }
    }, [inputSearchAddons, category?.productOptions]);

    useEffect(() => {
        if (customRules?.preSelectedProducts?.length > 0) {
            customRules.preSelectedProducts.forEach(productID => {
                const productToStart = productsFiltered?.productOptions.find(item => item.id === productID);
                setItemsSelectedToCreateCustom(prev => [...prev, productToStart]);
            });
        }
        if (customRules?.preSelectedAddons?.length > 0) {
            customRules.preSelectedAddons.forEach(addonID => {
                const addonToStart = category?.productOptions.find(item => item.id === addonID);
                setAddonsSelectedToCreateCustom(prev => [...prev, addonToStart]);
            });
        }
        if (customRules?.preSettedNotes) {
            setNotesForCustomItem(customRules.preSettedNotes);
        }
    }, []);

    async function passToSelectedCustomItems(customItem) {
        setSelectedCustomItems(prev => [...prev, customItem]);
    }

    async function handleCreateCustomItem() {
        const customName = itemsSelectedToCreateCustom.map(item => item.name).sort().join("/");
        const itensIDs = itemsSelectedToCreateCustom.map(item => item.id).sort();
        const productOptsNames = addonsSelectedToCreateCustom.length > 0 ? '+' + addonsSelectedToCreateCustom.map(addon => addon.name).sort().join(", +") : '';
        const productOptsIDs = addonsSelectedToCreateCustom.map(addon => addon.id).sort();
        const price = await calculatePriceAsync();

        passToSelectedCustomItems({ name: customName, ids: itensIDs, productOptsNames: productOptsNames, productOptsIDs: productOptsIDs, price: price, notes: notesForCustomItem, customSize: customRules?.customSize });
        setNotesForCustomItem("");
        setAddonsSelectedToCreateCustom([]);
        setItemsSelectedToCreateCustom([]);
        setInputSearchItem("");
        setInputSearchAddons("");
        close();
    }

    async function calculatePriceAsync() {
        return category.customOrderPriceRule === 'BIGGESTPRICE' ?
            Math.max(...itemsSelectedToCreateCustom.map(item => item.price)) + addonsSelectedToCreateCustom.map(addon => addon.price).reduce((a, b) => a + b, 0)
            :
            (itemsSelectedToCreateCustom.map(p => p.price).reduce((a, b) => a + b, 0) / itemsSelectedToCreateCustom.length) + addonsSelectedToCreateCustom.map(addon => addon.price).reduce((a, b) => a + b, 0);
    }

    function calculatePrice() {
        return category.customOrderPriceRule === 'BIGGESTPRICE' ?
            Math.max(...itemsSelectedToCreateCustom.map(item => item.price)) + addonsSelectedToCreateCustom.map(addon => addon.price).reduce((a, b) => a + b, 0)
            :
            (itemsSelectedToCreateCustom.map(p => p.price).reduce((a, b) => a + b, 0) / itemsSelectedToCreateCustom.length) + addonsSelectedToCreateCustom.map(addon => addon.price).reduce((a, b) => a + b, 0);
    }

    function removeItemFromSelection(item) {
        setItemsSelectedToCreateCustom(prev => {
            const index = prev.findIndex(p => p.id === item.id);

            // If not found → add
            if (index === -1) {
                return [...prev, item];
            }

            // If found → remove only ONE
            const newArr = [...prev];
            newArr.splice(index, 1);
            return newArr;
        });
    }

    function removeAddonsFromSelection(item) {
        setAddonsSelectedToCreateCustom(prev => {
            const index = prev.findIndex(p => p.id === item.id);

            // If not found → add
            if (index === -1) {
                return [...prev, item];
            }

            // If found → remove only ONE
            const newArr = [...prev];
            newArr.splice(index, 1);
            return newArr;
        });
    }

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "98%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>
                <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '26px' : '20px', fontWeight: 'bold' }}>{category.categoryName + " - " + customRules.customSize + " Sabores"} </span>

                {category?.productOptions?.length > 0 && <div className='flexRow spaceBetweenJC' style={{ marginBottom: 0 }} >
                    <div className='flexRow fullCenter' style={{ width: '100%' }} >
                        <span style={{ color: fontColorOne(theme), fontSize: 15, fontWeight: 'bold', cursor: 'pointer', opacity: tasteOrAddons === 'taste' ? 1 : 0.5, textDecoration: tasteOrAddons === 'taste' ? 'underline' : 'none' }}
                            onClick={() => setTasteOrAddons('taste')}>{'Tastes'} </span>
                    </div>

                    <div className='flexRow fullCenter' style={{ width: '100%' }} >
                        <span style={{ color: fontColorOne(theme), fontSize: 15, fontWeight: 'bold', cursor: 'pointer', opacity: tasteOrAddons === 'addons' ? 1 : 0.5, textDecoration: tasteOrAddons === 'addons' ? 'underline' : 'none' }}
                            onClick={() => setTasteOrAddons('addons')}>{'Add-ons'} </span>
                    </div>
                </div>}

                {tasteOrAddons === 'taste' && <div className='flexColumn' style={{ width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', border: `2px solid ${borderColorTwo(theme)}` }}>
                    <input type="text" className='inputStandart' value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                        style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                    <div className='flexRow' style={{ justifyContent: 'center', width: '100%', flexWrap: 'wrap', overflowY: 'auto', }}>
                        {productsFiltered?.productOptions && productsFiltered?.productOptions.map((product, idx) => (
                            <div key={idx} className='flexColumn' style={{ width: '80px', margin: 5, cursor: 'pointer', position: 'relative', }}
                                onClick={() => { if (itemsSelectedToCreateCustom.length < customRules.customSize) setItemsSelectedToCreateCustom([...itemsSelectedToCreateCustom, product]); }}>

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
                </div>}
                {tasteOrAddons === 'addons' && <div className='flexColumn' style={{ width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', border: `2px solid ${borderColorTwo(theme)}` }}>
                    <input type="text" className='inputStandart' value={inputSearchAddons} onChange={(e) => setInputSearchAddons(e.target.value.toUpperCase())} placeholder="Filter Item"
                        style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                    <div className='flexRow' style={{ justifyContent: 'center', width: '100%', flexWrap: 'wrap', overflowY: 'auto', }}>
                        {addonsFiltered && addonsFiltered?.map((addon, idx) => (
                            <div key={idx} className='flexColumn' style={{ width: '80px', margin: 5, cursor: 'pointer', position: 'relative', }}
                                onClick={() => { if (!addonsSelectedToCreateCustom?.includes(addon)) setAddonsSelectedToCreateCustom([...addonsSelectedToCreateCustom, addon]); }}>

                                <img src={addon?.imagePath ? getImageFoodService(addon?.imagePath) : noFoodImg} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px' }} />
                                <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{addon?.name}</span>
                                {addonsSelectedToCreateCustom?.includes(addon) && <div className='flexRow fullCenter'
                                    style={{
                                        position: 'absolute', top: -5, left: -5, width: 25, height: 25, borderRadius: '50%', backgroundColor: purpleOne(theme),
                                        border: '1px solid white', fontSize: 17, fontWeight: 'bold', color: 'white', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.52)'
                                    }}>
                                    <FontAwesomeIcon icon={faCheck} /></div>}
                            </div>
                        ))}
                    </div>
                </div>}

                <div className='flexRow spaceBetweenJC' style={{ marginTop: 2 }} >
                    <div className='flexRow fullCenter' style={{ width: '100%' }} >
                        <span style={{ color: fontColorOne(theme), fontSize: 15, fontWeight: 'bold', cursor: 'pointer', opacity: itemsOrNotes === 'items' ? 1 : 0.5, textDecoration: itemsOrNotes === 'items' ? 'underline' : 'none' }}
                            onClick={() => setItemsOrNotes('items')}>{'Items'} </span>
                    </div>

                    <div className='flexRow fullCenter' style={{ width: '100%' }} >
                        <span style={{ color: fontColorOne(theme), fontSize: 15, fontWeight: 'bold', cursor: 'pointer', opacity: itemsOrNotes === 'notes' ? 1 : 0.5, textDecoration: itemsOrNotes === 'notes' ? 'underline' : 'none' }}
                            onClick={() => setItemsOrNotes('notes')}><FontAwesomeIcon icon={faPen} /> {'Notes'} </span>
                    </div>
                </div>

                {itemsOrNotes === 'items' && <div className='flexRow' style={{ border: `1px solid ${borderColorTwo(theme)}`, borderRadius: 5, minHeight: 100 }}>
                    <div className='flexRow' style={{ width: '100%', }}>
                        {itemsSelectedToCreateCustom && itemsSelectedToCreateCustom?.map((product, idx) => (
                            <div key={idx} className='flexColumn fullCenter' style={{ width: '80px', margin: 5, cursor: 'pointer', backgroundColor: 'rgba(240, 240, 240, 1)', borderRadius: 6, border: `2px solid ${borderColorTwo(theme)}`, position: 'relative' }}
                                onClick={() => { removeItemFromSelection(product); }}>
                                <img src={product?.imagePath ? getImageFoodService(product?.imagePath) : noFoodImg} alt={""} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '5px' }} />
                                <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                {/* <div className='flexRow fullCenter'
                                    style={{
                                        position: 'absolute', top: -10, left: -10, width: 25, height: 25, borderRadius: '50%', backgroundColor: purpleOne(theme),
                                        border: '1px solid white', fontSize: 17, fontWeight: 'bold', color: 'white', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.52)'
                                    }}>
                                    {idx + 1}</div> */}
                                <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenOne(theme) }}>{`$${product?.price.toFixed(2)}`}</span>
                            </div>
                        ))}
                    </div>

                    <div className='flexRow' style={{ width: '100%', }}>
                        {addonsSelectedToCreateCustom && addonsSelectedToCreateCustom?.map((product, idx) => (
                            <div key={idx} className='flexColumn fullCenter' style={{ width: '80px', margin: 5, cursor: 'pointer', backgroundColor: 'rgba(240, 240, 240, 1)', borderRadius: 6, border: `2px solid ${borderColorTwo(theme)}`, position: 'relative' }}
                                onClick={() => { removeAddonsFromSelection(product); }}>
                                <img src={product?.imagePath ? getImageFoodService(product?.imagePath) : noFoodImg} alt={""} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: '5px' }} />
                                <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{product?.name}</span>
                                {/* <div className='flexRow fullCenter'
                                    style={{
                                        position: 'absolute', top: -10, left: -10, width: 25, height: 25, borderRadius: '50%', backgroundColor: purpleOne(theme),
                                        border: '1px solid white', fontSize: 17, fontWeight: 'bold', color: 'white', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.52)'
                                    }}>
                                    {idx + 1}</div> */}
                                <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenOne(theme) }}>{`$${product?.price.toFixed(2)}`}</span>
                            </div>
                        ))}
                    </div>
                </div>}

                {itemsOrNotes === 'notes' && <div className='flexColumn' style={{ width: '100%', }}>
                    <textarea className='textAreaStandart' rows={4} style={{ width: '100%' }} value={notesForCustomItem} onChange={(e) => setNotesForCustomItem(e.target.value)} />
                </div>}

                <div className='flexRow spaceBetweenJC' style={{ marginTop: '10px', width: '100%', alignItems: 'center' }} >
                    {customRules?.editting && <span style={{ opacity: 0.3, fontStyle: 'italic' }}> Editing... </span>}
                    {!customRules?.editting && <button className='buttonNoBgNoBorder' onClick={() => { close() }} > Cancel </button>}

                    <button className='buttonStandart fontGreenTwo' type="submit" style={{ opacity: (itemsSelectedToCreateCustom?.length === customRules.customSize) ? 1 : 0.2, cursor: (itemsSelectedToCreateCustom?.length === customRules.customSize) ? 'pointer' : 'not-allowed', }}
                        disabled={itemsSelectedToCreateCustom?.length !== customRules.customSize} onClick={() => { handleCreateCustomItem(); }} >
                        {itemsSelectedToCreateCustom?.length === customRules.customSize && <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenTwo(theme) }}>{`$${calculatePrice().toFixed(2)} `}</span>}
                        {itemsSelectedToCreateCustom?.length === customRules.customSize && <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenTwo(theme), margin: '0px 1px' }}>{' | '}</span>}Add</button>
                </div>
            </div>
        </>
    );
}