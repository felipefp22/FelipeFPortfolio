import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { blueOne, } from "../../../../../../../theme/Colors";
import { borderColorTwo } from "../../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getAllDefaultsImagesFoodService, getImageFoodService } from "../../../../../../../services/deliveryServices/auxServices/FoodsImagesService";

export default function SelectProductImageModal({ close, imagePath, setImagePath }) {
    const theme = useSelector((state) => state.view.theme);
    const isPcV = useSelector((state) => state.view.isPcV);

    const [disabled, setDisable] = useState(false);

    const [allDefaultImages, setAllDefaultImages] = useState(null);
    const [defaultImagesFiltered, setDefaultImagesFiltered] = useState(null);

    const [buttonFilter, setButtonFilter] = useState("All");
    const [inputSearchItem, setInputSearchItem] = useState("")

    useEffect(() => {
        async function fetchDefaults() {
            setAllDefaultImages(await getAllDefaultsImagesFoodService());
        }
        fetchDefaults();
    }, []);

    useEffect(() => {
        if (buttonFilter === "All") {
            const filteredItems = allDefaultImages?.flatMap(cat => cat.items || []);
            setDefaultImagesFiltered(filteredItems?.filter(item => item?.name.toLowerCase().includes(inputSearchItem.toLowerCase())));
        } else {
            const category = allDefaultImages?.find(cat => cat.name === buttonFilter);
            const filteredItems = category?.items || [];
            setDefaultImagesFiltered(filteredItems?.filter(item => item?.name.toLowerCase().includes(inputSearchItem.toLowerCase())));
        }
    }, [allDefaultImages, buttonFilter, inputSearchItem]);


    return (
        <>
            <div className='modalInside' style={{ padding: '10px', width: !isPcV ? "95%" : "90%", maxHeight: !isPcV ? "95%" : "90%", }}>
                <div className='flexColumn'>

                    <div className='flexRow spaceBetweenJC' style={{ alignItems: 'center', width: '100%', }}>
                        <div className='flexColumn' style={{ flexWrap: 'wrap' }}>
                            <div className='flexRow' style={{ marginBottom: '5px' }} >
                                <span style={{ color: borderColorTwo(theme), fontSize: isPcV ? '22px' : '17px', fontWeight: 'bold' }}>{"Default System Photos"} </span>
                            </div>
                            <div className='flexRow' style={{ flexWrap: 'wrap' }}>
                                <button className='buttonStandart blue' style={{ marginLeft: '0px', border: buttonFilter === "All" ? "1px solid white" : "none" }}
                                    onClick={() => setButtonFilter("All")}>All</button>

                                {allDefaultImages?.map((category, idx) => (
                                    <button key={idx} className='buttonStandart blue' style={{ marginLeft: '0px', border: buttonFilter === category ? "1px solid white" : "none" }}
                                        onClick={() => setButtonFilter(category?.name)}>{category?.name}</button>
                                ))}
                            </div>
                        </div>

                        <div className='flexRow' style={{ alignItems: 'center', position: 'relative', height: '70px' }} >
                            <img src={getImageFoodService(imagePath)} alt={""} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px', backgroundColor: 'white', border: `2px solid ${borderColorTwo(theme)}` }} />
                            {imagePath && <div style={{
                                borderRadius: '50%', backgroundColor: blueOne(theme), padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                position: 'absolute', width: '28px', height: '28px', left: -15, top: -10, cursor: 'pointer'
                            }} onClick={() => setImagePath(null)} >
                                <FontAwesomeIcon icon={faXmark} style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                            </div>}
                        </div>
                    </div>

                    <div className='flexColumn' style={{ height: '300px', marginTop: '10px', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', border: `2px solid ${borderColorTwo(theme)}` }}>
                        <input type="text" className='inputStandart' value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                            style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                        <div className='flexRow' style={{ width: '100%', flexWrap: 'wrap', width: '100%', justifyContent: 'center', overflowY: 'auto', }}>
                            {defaultImagesFiltered?.map((item, idx) => (
                                <div key={idx} className='flexColumn' style={{ width: '80px', height: "96px", margin: 5, cursor: 'pointer' }} onClick={() => { setImagePath(item?.name); }}>
                                    <img src={item?.path} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', backgroundColor: (item?.name === imagePath) ? 'lightblue' : 'transparent' }} />
                                    <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{item?.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flexRow' style={{ justifyContent: 'flex-end', width: "100%", marginTop: '15px', }}>
                    <button className='buttonStandart'  onClick={() => close()}>Save</button>
                </div>
            </div>
        </>
    );
}