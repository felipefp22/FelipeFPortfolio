import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Spinner, Table } from "react-bootstrap";
import NewCustomerModal from "./NewCustomerModal";
import SelectItemsModal from "./SelectItemsModal";
import { getAllCompanyCustomers } from "../../../../services/deliveryServices/CustomerSevice";
import { getAllProductsCategories } from "../../../../services/deliveryServices/ProductsCategoryService";
import { createOrder } from "../../../../services/deliveryServices/OrderService";
import { useSelector } from "react-redux";
import { borderColorTwo } from "../../../../theme/Colors";

export default function NewOrderModal({ close, getShiftOperationData }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disabled, setDisabled] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const newCustomerModalRef = useRef(null);

    const [showSelectItemsModal, setShowSelectItemsModal] = useState(false);
    const selectItemsModalRef = useRef(null);

    const [customerSelectedToNewOrder, setCustomerSelectedToNewOrder] = useState(null);

    const [allCompanyCustomers, setAllCompanyCustomers] = useState([]);
    const [customerInputToSearch, setCustomerInputToSearch] = useState("");
    const [customersMatched, setCustomersMatched] = useState([]);

    const [showCustomerSelectorDropdown, setShowCustomerSelectorDropdown] = useState(false);
    const customerSelectorDropdownRef = useRef(null);

    const [allCompanyProductsCategories, setAllCompanyProductsCategories] = useState([]);
    const [selectedProductsToAdd, setSelectedProductsToAdd] = useState([]);

    async function fetchCustomers() {
        try {
            const response = await getAllCompanyCustomers();
            if (response?.status === 200) {
                setAllCompanyCustomers(response?.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function fetchProductsCategories() {
        try {
            const response = await getAllProductsCategories();
            if (response?.status === 200) {
                setAllCompanyProductsCategories(response?.data || []);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchProductsCategories();
        fetchCustomers();
    }, []);

    useEffect(() => {
        handleCustomerSearchInputChange();
    }, [allCompanyCustomers, customerInputToSearch]);

    async function handleCustomerSearchInputChange() {

        const filtered = allCompanyCustomers
            .filter(opt =>
                opt.customerName?.toLowerCase().includes(customerInputToSearch.toLowerCase()) ||
                opt.phone?.toLowerCase().replace(/\D/g, "").includes(customerInputToSearch.toLowerCase())
            );

        setCustomersMatched(filtered);
    };

    async function saveOrder() {
        setDisabled(true);
        if (!customerSelectedToNewOrder) {
            alert("Select a customer to create the order");
            setDisabled(false);
            return;
        }
        if (selectedProductsToAdd.length === 0) {
            alert("Add at least one item to create the order");
            setDisabled(false);
            return;
        }

        const itemsIdAndQuantity = Object.values(
            selectedProductsToAdd.reduce((acc, item) => {
                if (!acc[item.id]) {
                    acc[item.id] = { productID: item.id, quantity: 0, productName: item.name };
                }
                acc[item.id].quantity += item.quantity ?? 1; // add quantity if exists, otherwise +1
                return acc;
            }, {})
        );

        const response = await createOrder(
            "delivery",
            customerSelectedToNewOrder?.id,
            customerSelectedToNewOrder?.customerName,
            itemsIdAndQuantity,
            " "
        );

        if (response?.status === 200) {
            await getShiftOperationData();
            setDisabled(false);
            close();
        }
    }

    async function removeProduct(productID) {
        const index = selectedProductsToAdd.findIndex(p => p.id === productID);

        if (index !== -1) {
            const newSelectedProducts = [...selectedProductsToAdd];
            newSelectedProducts.splice(index, 1); // remove only the first occurrence
            setSelectedProductsToAdd(newSelectedProducts);
        }
    }

    return (
        <>
            <div className="modalInside" style={{ width: !isDesktopView ? "100%" : "85%", maxHeight: !isDesktopView ? '90%' : '80%', padding: !isDesktopView ? '10px' : '20px',  zIndex: 10, }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '10px' }}>
                        <button className="buttomDarkGray" style={{ marginLeft: '0px' }} onClick={() => setShowNewCustomerModal(true)} disabled={disabled}>Create new customer</button>
                    </div>

                    <span style={{ fontWeight: "600" }}>Customer</span>
                    <div ref={customerSelectorDropdownRef} style={{ position: 'relative', width: '100%' }}>
                        <input
                            type="text"
                            value={showCustomerSelectorDropdown ? customerInputToSearch : (customerSelectedToNewOrder ? customerSelectedToNewOrder?.customerName + " / " + customerSelectedToNewOrder?.phone : "")}
                            onChange={e => setCustomerInputToSearch(e.target.value)}
                            onFocus={() => setShowCustomerSelectorDropdown(true)}
                            onBlur={() => { setCustomerInputToSearch(""); setShowCustomerSelectorDropdown(false); }}
                            placeholder="Search Customer by Name or Phone"
                            disabled={disabled}
                            style={{ height: '35px', backgroundColor: 'white', color: 'black', width: '95%', paddingLeft: '10px', margin: 0, borderRadius: '5px', marginTop: '5px', border: 'none', borderRadius: "0px", }}
                        />
                        {showCustomerSelectorDropdown && (
                            <ul style={{ position: 'absolute', top: 33, backgroundColor: 'white', color: 'black', width: '89%', minHeight: '200px', maxHeight: '468px', overflowY: 'auto', zIndex: 100, borderRadius: "0px 0px 5px 5px", borderBottom: '1px solid black' }}>
                                {customersMatched?.length > 0 ? (
                                    customersMatched.map((customerOpt) => (
                                        <li
                                            key={customerOpt.id}
                                            onMouseDown={() => { setCustomerSelectedToNewOrder(customerOpt); }}
                                            style={{ cursor: "pointer" }}
                                        >
                                            {customerOpt?.customerName + " / " + customerOpt?.phone}
                                        </li>
                                    ))
                                ) : (
                                    <li style={{ fontWeight: "600" }} >{customersMatched?.length > 0 ? "No matches found" : "Type Name or Phone to search"}</li>
                                )}
                            </ul>
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>

                    <div style={{ display: 'flex', flexDirection: 'row', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '64%', }}>
                            <span style={{ fontWeight: "600", marginBottom: '5px' }}>Customer Address</span>
                            <input type="text" value={customerSelectedToNewOrder ? customerSelectedToNewOrder.address + ", " + customerSelectedToNewOrder.addressNumber : ""} disabled={true}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                            />
                        </div>
                        <div style={{ width: '3%' }}></div>
                        <div style={{ display: 'flex', flexDirection: 'column', width: '28%' }}>
                            <span style={{ fontWeight: "600", whiteSpace: 'nowrap', marginBottom: '5px' }}>Phone</span>
                            <input type="text" value={customerSelectedToNewOrder ? customerSelectedToNewOrder?.phone : ""} disabled={true}
                                style={{ height: '25px', fontSize: '16px', backgroundColor: 'lightgray', color: 'black', width: '100%', paddingLeft: '10px', margin: 0, borderRadius: '5px', border: 'none', borderRadius: "0px", overflowX: 'auto', }}
                            />
                        </div>
                    </div>
                </div>

                <div style={{ width: '100%', height: '1px', backgroundColor: 'lightgray', margin: '5px 0' }}></div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>

                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className="buttomDarkGray" style={{ marginLeft: '0px' }} onClick={() => setShowSelectItemsModal(true)} disabled={disabled}>ADD Items</button>
                        </div>
                        <span style={{ fontWeight: "bold", marginBottom: '5px' }}>Itens on Order</span>
                        <div style={{ backgroundColor: "white", color: "black", borderRadius: '10px', marginBottom: '20px', padding: '10px', width: '98%', height: '200px', overflow: 'auto',border: `2px solid ${borderColorTwo(theme)}` }}>
                            <Table responsive="sm" >
                                <thead>
                                    <tr>
                                        <th style={{ width: "100%" }}>Item</th>
                                        <th style={{ width: "40px" }}>Price</th>
                                        <th style={{ width: "40px" }}><FontAwesomeIcon icon={faTrash} /></th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {selectedProductsToAdd.map((product, index) => (
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
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginTop: '10px' }}>
                            <button className="buttomDarkRed" style={{ marginLeft: '0px' }} onClick={() => close()} disabled={disabled}>Cancel Order</button>

                            <button className="buttomDarkGreen" style={{ marginLeft: '0px' }}
                                onClick={() => saveOrder()} disabled={disabled}>{disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', margin: '0 30px', }} /> : 'Save Order'}</button>
                        </div>
                    </div>
                </div>

            </div>

            {showNewCustomerModal && <div ref={newCustomerModalRef} className="myModal" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 10 }} >
                <NewCustomerModal close={() => setShowNewCustomerModal(false)} />
            </div>}

            {showSelectItemsModal && <div ref={selectItemsModalRef} className="myModal" style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', zIndex: 10 }} >
                <SelectItemsModal close={() => setShowSelectItemsModal(false)} allCompanyProductsCategories={allCompanyProductsCategories} setAllCompanyProductsCategories={setAllCompanyProductsCategories} selectedProductsToAdd={selectedProductsToAdd} setSelectedProductsToAdd={setSelectedProductsToAdd} />
            </div>}
        </>
    );
}