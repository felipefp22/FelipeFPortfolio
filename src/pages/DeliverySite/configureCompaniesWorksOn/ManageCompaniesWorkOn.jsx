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
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: isPcV ? 5 : 3, }} >
                {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white",  marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => setNewOrderModal(true)}>New Order</button>
                </div> */}

                {!companySelected && <SelectYourComapanieYouWorkOnToManage companiesYouWorkOn={companiesYouWorkOn} fetchUserInfos={() => fetchUserInfos()} />}
                {companySelected && <SetUpCompanyYouWorkOn companiesYouWorkOn={companiesYouWorkOn} fetchUserInfos={() => fetchUserInfos()} />}


            </div >
        </>
    );
}

const buttonStyle = {
    background: "transparent",
    border: "1px solid white",
    color: "white",
    padding: "8px 16px",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "20px",
};

const linkStyle = {
    color: "white",
    textDecoration: "none",
    display: "block",
    padding: "10px 0",
};