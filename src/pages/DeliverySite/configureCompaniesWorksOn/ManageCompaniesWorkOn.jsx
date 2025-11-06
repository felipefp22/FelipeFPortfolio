import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import SelectYourComapanieYouWorkOnToManage from "./components/SelectYourComapanieYouWorkOnToManage";
import SetUpCompanyYouWorkOn from "./components/SetUpCompanyYouWorkOn";


export default function ManageCompaniesWorkOn({ }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const location = useLocation();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const [companiesYouWorkOn, setCompaniesYouWorkOn] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem('userLoggedEmail') || "");

    useEffect(() => {
        fetchUserInfos();
    }, []);

    async function fetchUserInfos() {
        const response = await getUserInfos();

        if (response?.status === 200) {
            const userData = response?.data;
            console.log("User data fetched:", userData);
            // setIsEmailConfirmed(userData?.emailConfirmed || false);

            setName(userData?.name || "");
            setCompaniesYouWorkOn(userData?.worksAtCompanies || []);
        }
        // setFirstLoadingUserInfos(true);
    }

    const [companySelected, setCompanySelected] = useState(null);

    useEffect(() => {

        if (location.pathname.includes("/company")) {
            setCompanySelected('company');

        } else {
            setCompanySelected(null);
        }

    }, [location.pathname, search, queryParams]);

    return (
        <>
            <div className='flexColumn' style={{ height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: isPcV ? 5 : 3, }} >
                {!companySelected && <SelectYourComapanieYouWorkOnToManage companiesYouWorkOn={companiesYouWorkOn} fetchUserInfos={() => fetchUserInfos()} />}
                {companySelected && <SetUpCompanyYouWorkOn companiesYouWorkOn={companiesYouWorkOn} fetchUserInfos={() => fetchUserInfos()} />}
            </div >
        </>
    );
}