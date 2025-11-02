import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { use, useEffect, useState } from "react";
import CompanyProfile from "./internalComponents/CompanyProfile";
import { getCompanyOperation } from "../../../../services/deliveryServices/CompanySevice";
import CompanyEmployees from "./internalComponents/CompanyEmployees";
import CompanyProducts from "./internalComponents/CompanyProducts";
import CompanyShifts from "./internalComponents/CompanyShifts";
import CompanyCustomers from "./internalComponents/CompanyCustomers";


export default function SetUpCompany({ }) {
    const navigate = useNavigate();
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const theme = useSelector((state) => state.view.theme);
    const location = useLocation();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const menuOptions = ["Company Profile", "Employees", "Products", "Shifts", "Customers"];

    const [menuSelected, setMenuSelected] = useState("Company Profile");

    const [companyData, setCompanyData] = useState(null);

    useEffect(() => {
        fetchCompanyData();
    }, []);

    async function fetchCompanyData() {

        const response = await getCompanyOperation(queryParams.get('id'));
        if (response?.status === 200) {
            const companyOperationData = response?.data;
            setCompanyData(response?.data);

            console.log("Company operation data fetched:", companyOperationData);
        } else {
            alert("Error fetching company operation data from server");
        }
    }

    useEffect(() => {
        const menuTab = queryParams.get('tab');

        if (menuTab && menuOptions.includes(menuTab.replace(/%20/g, ' '))) {
            setMenuSelected(menuTab.replace(/%20/g, ' '));
        }

    }, [queryParams]);


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', alignContent: 'left', justifyItems: 'left', padding: '10px 5px', borderRadius: '6px', }}>
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '10px' }} >
                    <button className='floatingButton' style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: greenOne(theme), height: '29px', width: '29px', marginRight: '10px' }} onClick={() => navigate('/FelipeFPortfolio/delivery/ManageCompaniesOwner/')} >
                        <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white", margin: 'auto', fontSize: '12px' }} />
                    </button>
                    <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', }}>Settings - Company</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }} >
                    {menuOptions?.map((option, index) => (
                        <div key={index} style={{ display: 'flex', flexDirection: 'row' }} >
                            <div style={{ padding: '5px 10px', backgroundColor: menuSelected === option ? transparentCavasOne(theme) : 'transparent', borderRadius: '3px', cursor: 'pointer', }}
                                onClick={() => navigate(`/FelipeFPortfolio/delivery/ManageCompaniesOwner/company?id=${queryParams.get('id')}&tab=${encodeURIComponent(option)}`)} >
                                <span style={{ color: fontColorOne(theme), fontWeight: 'bold', flexWrap: 'nowrap', whiteSpace: 'nowrap' }}>{option}</span>
                                {menuSelected === option && <div style={{ backgroundColor: fontColorOne(theme), opacity: '0.7', width: '100%', margin: 'auto 0px', height: '2px', borderRadius: '3px' }} />}
                            </div>
                            <div style={{ backgroundColor: fontColorOne(theme), opacity: '0.7', width: '2px', margin: 'auto 4px', height: '90%', borderRadius: '3px', }} />
                        </div>
                    ))}
                </div>

                <div style={{ backgroundColor: fontColorOne(theme), opacity: '0.7', width: '100%', marginTop: '10px', height: '6px', borderRadius: '1px 1px 0px 0px', marginBottom: '0px', }} />

                {menuSelected === "Company Profile" && <CompanyProfile companyData={companyData} fetchCompanyData={fetchCompanyData} />}
                {menuSelected === "Employees" && <CompanyEmployees companyData={companyData} fetchCompanyData={fetchCompanyData} />}
                {menuSelected === "Products" && <CompanyProducts companyData={companyData} fetchCompanyData={fetchCompanyData} />}
                {menuSelected === "Shifts" && <CompanyShifts companyData={companyData} fetchCompanyData={fetchCompanyData} />}
                {menuSelected === "Customers" && <CompanyCustomers companyData={companyData} fetchCompanyData={fetchCompanyData} />}
            </div >
        </>
    );
}