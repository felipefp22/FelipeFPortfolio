import { useSelector } from "react-redux";
import { borderColorTwo, greenOne, transparentCavasOne, transparentCavasTwo } from "../../../../../theme/Colors";
import { useEffect, useState } from "react";
import restaurantLogo from '../../../../../assets/restaurantLogo.png';
import { faPlug, faPlus, faSquareCaretDown, faSquareCaretUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import noFood from '../../../../../assets/noFood.jpg';
import cutleryLogo from '../../../../../assets/cutleryLogo.png';


export default function CompanyProducts({ companyData, }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);

    const [seeImageBig, setSeeImageBig] = useState(false);

    const [openStates, setOpenStates] = useState({}); // 👈 store open/close states by index or category

    const toggleOpen = (index) => {
        setOpenStates((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <>
            <div style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: transparentCavasTwo(theme), color: "white", padding: '10px', borderRadius: '0px 0px 6px 6px',
                minWidth: '300px', maxWidth: '100%', height: '72%', overflowX: "hidden", overflowY: 'hidden',
            }} >
                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'left', alignItems: 'left', textAlign: 'left', marginBottom: '5px' }} >
                    <span style={{ color: borderColorTwo(theme), fontSize: isDesktopView ? '22px' : '17px', fontWeight: 'bold' }}>{"Products"} </span>
                    {/* <span style={{ color: fontColorOne(theme), fontSize: isDesktopView ? '36px' : '18px', fontWeight: 'bold', marginLeft: '15px' }}>{"- "}{companyData?.companyName ?? 'N/A'} </span> */}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflowY: 'auto', }}>
                    {companyData?.productsCategories?.map((category, index) => {
                        const isOpen = openStates[index];
                        return (
                            <div key={index} style={{ marginBottom: '15px', marginRight: '10px' }}>
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: '0px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), padding: '10px', borderRadius: '6px', }}
                                    onClick={() => toggleOpen(index)}>
                                    
                                    <img src={cutleryLogo} alt="Logo" style={{
                                        width: isDesktopView ? 40 : 30, height: isDesktopView ? 40 : 30,
                                        borderRadius: '50%', marginRight: 10, backgroundColor: 'rgba(0, 0, 32, 0.79)', padding: '6px',
                                    }} />
                                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                        <span style={{ fontSize: isDesktopView ? '20px' : '16px', fontWeight: 'bold' }}>{category?.categoryName} </span>
                                        <FontAwesomeIcon icon={isOpen ? faSquareCaretUp : faSquareCaretDown}
                                            style={{ fontSize: isDesktopView ? '20px' : '16px', marginRight: isDesktopView ? '20px' : '5px', borderRadius: '4px', padding: isDesktopView ? '5px' : '4px', opacity: 0.8 }} />
                                    </div>
                                </div>
                                {!isOpen && <div style={{ display: 'flex', flexDirection: 'column', margin: '0px 6px', padding: '3px 5px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>

                                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyItems: 'center', padding: '6px 10px', margin: '3px 5px', marginBottom: '6px', cursor: 'pointer', backgroundColor: transparentCavasOne(theme), borderRadius: '6px', }}
                                        onClick={() => { console.log("Clicked product") }}>
                                            
                                        <div style={{ borderRadius: '50%',backgroundColor: transparentCavasOne(theme), marginRight: 10, padding: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
                                            <FontAwesomeIcon icon={faPlus} style={{ fontSize: '12px', fontWeight: '500', }} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: "space-between" }} >
                                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: '500' }}>{`Add New Product`}</span>
                                        </div>
                                    </div>
                                    {category?.products && category?.products?.length > 0 ? (
                                        category?.products?.map((product, idx) => (
                                            <div key={idx} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: '6px 10px', margin: '3px 5px', cursor: 'pointer', backgroundColor: transparentCavasTwo(theme), borderRadius: '6px', }}
                                                onClick={() => { console.log("Clicked product") }}>

                                                <img src={noFood} alt="Logo" style={{
                                                    width: isDesktopView ? 36 : 28, boxShadow: `1px 2px 10px ${borderColorTwo(theme, 0.2)}`,
                                                    borderRadius: '50%', backgroundColor: 'white', marginRight: 10, padding: '2px',
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: "space-between" }} >
                                                    <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: '500' }}>{`${product?.name}`}</span>
                                                    <span style={{ fontSize: isDesktopView ? '16px' : '13px', fontWeight: '400', color: borderColorTwo(theme) }}>{`$ ${product?.price}`}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isDesktopView ? '18px' : '15px', fontWeight: 'bold' }}>{`No Products Found`} </span>
                                        </div>
                                    )}
                                </div>}
                            </div>
                        )
                    })}
                </div>
            </div>

            {seeImageBig && <div onClick={() => setSeeImageBig(false)} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 0, 0, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
                <img src={seeImageBig} alt="Logo" style={{
                    maxWidth: "90%", maxHeight: "90%", borderRadius: '10px', objectFit: "contain", boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.5)"
                }} />
            </div>}
        </>
    );
}