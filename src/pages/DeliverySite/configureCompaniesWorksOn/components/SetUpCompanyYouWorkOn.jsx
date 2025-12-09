import { useSelector } from "react-redux";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../../theme/Colors";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCompanyOperation } from "../../../../services/deliveryServices/CompanySevice";
import CompanyProfile from "../../configureCompaniesOwner/components/internalComponents/CompanyProfile";
import { useTranslation } from 'react-i18next';


export default function SetUpCompanyYouWorkOn({ fetchUserInfos }) {
    const navigate = useNavigate();
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const { t } = useTranslation();

    const location = useLocation();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const menuOptions = ["Company Profile"];

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
            alert(t('rSys.error_fetching_company_data'));
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
            <div className='flexRow' style={{ alignItems: 'center', marginBottom: '5px', visibility: companyData?.companyName ? 'visible' : 'hidden' }} >
                <button className='floatingButton green fullCenter' style={{ height: '29px', width: '29px', marginRight: '10px' }} onClick={() => navigate('/FelipeFPortfolio/delivery/ManageCompaniesOwner/')} >
                    <FontAwesomeIcon icon={faArrowLeft} style={{ color: "white", margin: 'auto', fontSize: '12px' }} />
                </button>
                <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: '24px', fontWeight: 'bold', }}>{companyData?.companyName}</span>
            </div>

            <div className='flexRow' style={{ flexWrap: 'wrap' }} >
                {menuOptions?.map((option, index) => (
                    <div key={index} className='flexRow' >
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

            {menuSelected === "Company Profile" && <CompanyProfile companyData={companyData} fetchCompanyData={() => fetchCompanyData()} fetchUserInfos={() => fetchUserInfos()} />}
        </>
    );
}