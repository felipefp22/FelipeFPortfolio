import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import companiesGroupLogo from '../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faGear, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import { borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../theme/Colors";
import SelectYourComapanieToManage from "./components/SelectYourComapanieToManage";
import { useLocation, useParams } from "react-router-dom";
import SetUpCompound from "./components/SetUpCompound";
import SetUpCompany from "./components/SetUpCompany";

export default function ManageCompaniesOwner({ }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
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
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', alignContent: 'left', flexGrow: 1, padding: isDesktopView ? 5 : 3, }} >
                {/* <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%', height: '50px' }}>
                    <button style={{ backgroundColor: 'rgba(22, 111, 163, 1)', border: "2px solid white", color: "white",  marginBottom: '20px', height: '40px', marginLeft: '0px', borderRadius: '5px' }} onClick={() => setNewOrderModal(true)}>New Order</button>
                </div> */}

                {!compoundOrCompanySelected && <SelectYourComapanieToManage companiesCoumpound={companiesCoumpound} fetchUserInfos={() => fetchUserInfos()} />}
                {compoundOrCompanySelected === 'compound' && <SetUpCompound companiesCoumpound={companiesCoumpound} fetchUserInfos={() => fetchUserInfos()} />}
                {compoundOrCompanySelected === 'company' && <SetUpCompany />}

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