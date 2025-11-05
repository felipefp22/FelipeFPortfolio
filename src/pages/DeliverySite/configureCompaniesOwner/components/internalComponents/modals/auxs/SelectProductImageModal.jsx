import { use, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { useSelector } from "react-redux";
import { blueOne, greenOne, orangeOne, redOne } from "../../../../../../../theme/Colors";
import { borderColorTwo, transparentCavasOne, transparentCavasTwo } from "../../../../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faXmark } from "@fortawesome/free-solid-svg-icons";
import { getAllDefaultsImagesFoodService, getImageFoodService } from "../../../../../../../services/deliveryServices/auxServices/FoodsImagesService";

export default function SelectProductImageModal({ close, imagePath, setImagePath }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disable, setDisable] = useState(false);

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

    // useEffect(() => {
    //     console.log("allDefaultImages", allDefaultImages);
    // }, [allDefaultImages]);

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
            <div className="myModal" style={{ zIndex: 100 }} >
                <div className="modalInside" style={{ width: 'auto', padding: '10px', width: !isDesktopView ? "95%" : "90%", maxHeight: !isDesktopView ? "95%" : "90%", zIndex: 10, }}>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>

                            <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '5px' }} >
                                    <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '22px' : '17px', fontWeight: 'bold' }}>{"Default System Photos"} </span>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left', marginBottom: '10px', flexWrap: 'wrap' }}>
                                    <button className="buttomStandart blue" style={{ marginLeft: '0px', border: buttonFilter === "All" ? "1px solid white" : "none" }}
                                        onClick={() => setButtonFilter("All")}>All</button>

                                    {allDefaultImages?.map((category, idx) => (
                                        <button key={idx} className="buttomStandart blue" style={{ marginLeft: '0px', border: buttonFilter === category ? "1px solid white" : "none" }}
                                            onClick={() => setButtonFilter(category?.name)}>{category?.name}</button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', position: 'relative' }} >
                                <img src={getImageFoodService(imagePath)} alt={""} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '5px', backgroundColor: 'white', border: `2px solid ${borderColorTwo(theme)}` }} />
                                {imagePath && <div style={{
                                    borderRadius: '50%', backgroundColor: blueOne(theme), padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    position: 'absolute', width: '28px', height: '28px', left: -15, top: -10, cursor: 'pointer'
                                }} onClick={() => setImagePath(null)} >
                                    <FontAwesomeIcon icon={faXmark} style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(226, 226, 226, 1)' }} />
                                </div>}
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '300px', backgroundColor: 'rgba(255, 255, 255, 1)', borderRadius: '5px', padding: 3, overflowY: 'auto', border: `2px solid ${borderColorTwo(theme)}` }}>
                            <input type="text" className="inputStandart" value={inputSearchItem} onChange={(e) => setInputSearchItem(e.target.value.toUpperCase())} placeholder="Filter Item"
                                style={{ width: '100%', backgroundColor: 'white', color: 'black', boxShadow: '1px 2px 6px rgba(0, 0, 0, 0.1)' }} />

                            <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                                {defaultImagesFiltered?.map((item, idx) => (
                                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', width: '80px', height: "96px", margin: 5, cursor: 'pointer' }} onClick={() => { setImagePath(item?.name); }}>
                                        <img src={item?.path} alt={""} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '5px', backgroundColor: (item?.name === imagePath) ? 'lightblue' : 'transparent' }} />
                                        <span style={{ fontWeight: 'bold', fontSize: "16px", textAlign: 'center', color: 'black' }}>{item?.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '0px', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', height: '50px', marginTop: '10px', }}>
                                <button className="buttomStandart green" style={{ marginLeft: '0px', backgroundColor: 'transparent', }} onClick={() => close()}>Save</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}