import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { borderColorTwo, greenOne, greenTwo, purpleOne } from '../../../../../../../theme/Colors';
import { getImageFoodService } from '../../../../../../../services/deliveryServices/auxServices/FoodsImagesService';


export default function CustomItemModal({ close, category, inputSearchItem, setInputSearchItem, productsFiltered, customSize, setSelectedCustomItems }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [itemsSelectedToCreateCustom, setItemsSelectedToCreateCustom] = useState([]);


    async function addCustomItemsToOrderAction(customItem) {
        setSelectedCustomItems(prev => [...prev, customItem]);
    }

    async function handleCreateCustomItem() {
        const customName = itemsSelectedToCreateCustom.map(item => item.name).join("/");
        const itensIDs = itemsSelectedToCreateCustom.map(item => item.id);
        const price = await calculatePriceAsync();

        addCustomItemsToOrderAction({ name: customName, ids: itensIDs, price: price })
        setItemsSelectedToCreateCustom([]);
        setInputSearchItem("");
        close();
    }

    async function calculatePriceAsync() {
        return category.customOrderPriceRule === 'BIGGESTPRICE' ?
            Math.max(...itemsSelectedToCreateCustom.map(item => item.price)) : itemsSelectedToCreateCustom.map(p => p.price).reduce((a, b) => a + b, 0) / itemsSelectedToCreateCustom.length;
    }

    function calculatePrice() {
        return category.customOrderPriceRule === 'BIGGESTPRICE' ?
            Math.max(...itemsSelectedToCreateCustom.map(item => item.price)) : itemsSelectedToCreateCustom.map(p => p.price).reduce((a, b) => a + b, 0) / itemsSelectedToCreateCustom.length;
    }

    return (
        <>
            <div className='modalInside' style={{ width: !isPcV ? "100%" : "98%", maxHeight: '90%', padding: !isPcV ? '10px' : '20px', }}>
                <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '26px' : '20px', fontWeight: 'bold' }}>{category.categoryName + " - " + customSize + " Sabores"} </span>
                <br />

                <div className='flexColumn' style={{ width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', border: `2px solid ${borderColorTwo(theme)}` }}>
                    <input type="text" className='inputStandart' value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                        style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                    <div className='flexRow' style={{ justifyContent: 'center', width: '100%', flexWrap: 'wrap', overflowY: 'auto', }}>
                        {productsFiltered && productsFiltered?.map((product, idx) => (
                            <div key={idx} className='flexColumn' style={{ width: '80px', margin: 5, cursor: 'pointer', position: 'relative', }}
                                onClick={() => { if (!itemsSelectedToCreateCustom.some(p => p.id === product.id) && itemsSelectedToCreateCustom.length < customSize) setItemsSelectedToCreateCustom([...itemsSelectedToCreateCustom, product]); }}>

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
                            <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenOne(theme) }}>{`$${product?.price.toFixed(2)}`}</span>
                        </div>
                    ))}
                </div>

                <div className='flexRow spaceBetweenJC' style={{ marginTop: '10px', width: '100%' }}>
                    <button className='buttonNoBgNoBorder' onClick={() => { close() }} > Cancel </button>

                    <button className='buttonStandart fontGreenTwo' type="submit" style={{ opacity: (itemsSelectedToCreateCustom?.length === customSize) ? 1 : 0.2, cursor: (itemsSelectedToCreateCustom?.length === customSize) ? 'pointer' : 'not-allowed', }}
                        disabled={itemsSelectedToCreateCustom?.length !== customSize} onClick={() => { handleCreateCustomItem(); }} >
                        {itemsSelectedToCreateCustom?.length === customSize && <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenTwo(theme) }}>{`$${calculatePrice().toFixed(2)} `}</span>}
                        {itemsSelectedToCreateCustom?.length === customSize && <span style={{ fontWeight: 'bold', fontSize: 15, textAlign: 'center', color: greenTwo(theme), margin: '0px 1px' }}>{' | '}</span>}Add</button>
                </div>
            </div>
        </>
    );
}