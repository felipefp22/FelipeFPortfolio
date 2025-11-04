import { useSelector } from "react-redux";
import NewCustomerModal from "../NewCustomerModal";
import { useEffect, useState } from "react";
import { getAllCompanyCustomers } from "../../../../../../services/deliveryServices/CustomerSevice";



export default function ChangeTableOrCustomerModal({ close, companyOperation, setPickupNameInput }) {
    const theme = useSelector((state) => state.view.theme);
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const [disabled, setDisabled] = useState(false);
    const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
    const [allCompanyCustomers, setAllCompanyCustomers] = useState([]);

    const [customerInputToSearch, setCustomerInputToSearch] = useState("");
    const [customersMatched, setCustomersMatched] = useState([]);


    async function fetchCustomers(customerIDToSelectAfterFetch) {
        try {
            const response = await getAllCompanyCustomers(companyOperation?.companyOperationID);
            if (response?.status === 200) {
                setAllCompanyCustomers(response?.data || []);

                if (customerIDToSelectAfterFetch) {
                    const customerFound = response?.data.find(customer => customer.id === customerIDToSelectAfterFetch);
                    setCustomerSelectedToNewOrder(customerFound);
                }
            }
        } catch (error) {
            console.log(error);
        }
    }


    useEffect(() => {
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


    return (
        <>
            <div className="modalInside" style={{ width: !isDesktopView ? "100%" : "97%", maxHeight: !isDesktopView ? '90%' : '80%', padding: !isDesktopView ? '10px' : '10px', }}>

                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'left', textAlign: 'left', flex: 1, width: "100%", marginBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', marginBottom: '10px' }}>
                        <button className="buttomDarkGray" style={{ fontSize: isDesktopView ? '14px' : '12px', marginLeft: '0px', padding: isDesktopView ? '0px 5px' : '0px 2px', }}
                            onClick={() => setShowNewCustomerModal(true)} disabled={disabled}>New customer</button>

                        <button className="buttomDarkBlue" style={{ fontSize: isDesktopView ? '14px' : '12px', marginLeft: '0px', padding: isDesktopView ? '0px 5px' : '0px 2px', }}
                            onClick={() => { setChangeTableOrCustomerModal(true) }} disabled={disabled}>Change Table</button>
                    </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', flex: 1, width: "100%", marginBottom: '0px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', flexWrap: 'wrap', margin: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px', margin: 0, fontSize: isDesktopView ? '14px' : '12px' }}>
                            <button className="buttomDarkGray" style={{ marginLeft: '0px' }} onClick={() => close()} disabled={disabled}>Cancel</button>

                            <button className="buttomDarkGreen" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}
                                onClick={() => close} disabled={disabled}>{disabled ? <Spinner animation="border" role="status" variant="light" style={{ width: '22px', height: '22px', margin: '0 0px', }} /> : 'Save'}</button>
                        </div>
                    </div>
                </div>
            </div>

            {showNewCustomerModal && <div className="myModal" style={{ zIndex: 100000 }} >
                <NewCustomerModal close={() => setShowNewCustomerModal(false)} companyOperationID={companyOperation?.companyOperationID} fetchCustomers={(e) => fetchCustomers(e)} />
            </div>}

        </>
    );
}