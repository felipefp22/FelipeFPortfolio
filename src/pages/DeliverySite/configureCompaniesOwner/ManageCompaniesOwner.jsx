import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import SelectYourComapanieToManage from "./components/SelectYourComapanieToManage";
import { useLocation, useParams } from "react-router-dom";
import SetUpCompound from "./components/SetUpCompound";
import SetUpCompany from "./components/SetUpCompany";

export default function ManageCompaniesOwner({ }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const location = useLocation();
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);

    const [companiesCoumpound, setCompaniesCoumpound] = useState([]);

    const [name, setName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem('userLoggedEmail') || "");

    useEffect(() => {
        fetchUserInfos();
    }, []);

    async function fetchUserInfos() {
        const response = await getUserInfos();

        if (response?.status === 200) {
            const userData = response?.data;
            console.log(`🔑 User data fetched:`, userData);
            // setIsEmailConfirmed(userData?.emailConfirmed || false);

            setName(userData?.name || "");
            setCompaniesCoumpound(userData?.companiesCompounds || []);
            // setCompaniesUserWorksOn(userData?.worksAtCompanies || []);
        }
        // setFirstLoadingUserInfos(true);
    }

    const [compoundOrCompanySelected, setCompoundOrCompanySelected] = useState(null);

    useEffect(() => {

        if (location.pathname.includes("/compound")) {
            setCompoundOrCompanySelected('compound');

        } else if (location.pathname.includes("/company")) {
            setCompoundOrCompanySelected('company');

        } else {
            setCompoundOrCompanySelected(null);
        }

    }, [location.pathname, search, queryParams]);

    return (
        <>
            <div className='flexColumn' style={{ height: '100%', width: '100%', flexGrow: 1, padding: isPcV ? 5 : 3, }} >
                {!compoundOrCompanySelected && <SelectYourComapanieToManage companiesCoumpound={companiesCoumpound} fetchUserInfos={() => fetchUserInfos()} />}
                {compoundOrCompanySelected === 'compound' && <SetUpCompound companiesCoumpound={companiesCoumpound} fetchUserInfos={() => fetchUserInfos()} />}
                {compoundOrCompanySelected === 'company' && <SetUpCompany />}
            </div >
        </>
    );
}