import { use, useEffect, useRef, useState } from "react";
import { getUserInfos } from "../../../services/deliveryServices/AUserService";
import { useDispatch, useSelector } from "react-redux";
import companiesGroupLogo from '../../../assets/companiesGroupLogo.png';
import restaurantLogo from '../../../assets/restaurantLogo.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faPowerOff, faRightFromBracket, faSquareCaretDown, faSquareCaretUp, faUser } from "@fortawesome/free-solid-svg-icons";
import CreateGroupAndCompanyModal from "./components/CreateGroupAndCompanyModal";
import { blueOne, borderColorTwo, fontColorOne, greenOne, redOne, transparentCavasOne, transparentCavasTwo } from "../../../theme/Colors";
import OpenShiftModal from "./components/OpenShiftModal";
import { changeCompanyOperationID } from "../../../redux/companyOperationSlice";
import { useNavigate } from "react-router-dom";


export default function SelectCompanyOperation({ }) {
    const navigate = useNavigate();
    const isPcV = useSelector((state) => state.view.isPcV);
    const theme = useSelector((state) => state.view.theme);
    const dispatch = useDispatch();

    const companyOperationID = useSelector((state) => state.companyOperation.companyOperationID);

    const [firstLoadingUserInfos, setFirstLoadingUserInfos] = useState(false);

    const [companiesCoumpound, setCompaniesCoumpound] = useState([]);
    const [selectedCompaniesCoumpound, setSelectedCompaniesCoumpound] = useState(null);

    const [companiesUserWorksOn, setCompaniesUserWorksOn] = useState([]);

    const [isEmailConfirmed, setIsEmailConfirmed] = useState(localStorage.getItem('isEmailConfirmed') === 'true' ? true : false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState(localStorage.getItem('userLoggedEmail') || "");

    const [createCompanyModal, setCreateCompanyModal] = useState(false);

    const [openShiftModal, setOpenShiftModal] = useState(false);

    useEffect(() => {
        fetchUserInfos();
    }, []);

    async function fetchUserInfos() {
        const response = await getUserInfos();

        if (response?.status === 200) {
            const userData = response?.data;
            console.log(`🔑 User data fetched:`, userData);
            setIsEmailConfirmed(userData?.emailConfirmed || false);

            setName(userData?.name || "");
            setCompaniesCoumpound(userData?.companiesCompounds || []);
            setCompaniesUserWorksOn(userData?.worksAtCompanies || []);
        }
        setFirstLoadingUserInfos(true);
    }

    function formatDateToDayMonth(date) {
        const d = new Date(date);
        const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);

        const day = String(local.getDate()).padStart(2, '0');
        const month = String(local.getMonth() + 1).padStart(2, '0');
        const hours = String(local.getHours()).padStart(2, '0');
        const minutes = String(local.getMinutes()).padStart(2, '0');
        return `${day}/${month} - ${hours}:${minutes}`;
    }

    async function setCompanyToOperate(compID) {
        localStorage.setItem('companyOperatingID', compID);
        dispatch(changeCompanyOperationID(compID));
    }

    return (
        <>
            <div className='flexColumn' style={{ height: '100%', width: '100%', alignContent: 'left', }} >
                <div className='flexColumn' style={{ textAlign: 'left', alignContent: 'left', justifyItems: 'left', }}>
                    <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '24px' : '20px', fontWeight: 'bold', position: 'absolute', top: isPcV ? 14 : 16, left: 60, whiteSpace: 'nowrap' }}>Welcome {name?.split(' ')[0] ?? ''}</span>

                    {<div className='flexColumn' >
                        <span style={{ color: theme === "LIGHT" ? fontColorOne(theme) : borderColorTwo(theme), fontSize: isPcV ? '24px' : '20px', fontWeight: 'bold', marginBottom: '10px' }}>Choose one to Work Now</span>

                        {(companiesCoumpound?.length === 0) && <button className='buttomStandart' style={{
                            borderRadius: '6px', margin: '10px 0px', width: '250px', marginBottom: '20px',
                            opacity: (companiesCoumpound?.length > 0 || !firstLoadingUserInfos) ? 0.5 : 1, cursor: (companiesCoumpound?.length > 0 || !firstLoadingUserInfos) ? 'not-allowed' : 'pointer',
                        }}
                            onClick={() => { setCreateCompanyModal(true); }} disabled={companiesCoumpound?.length > 0 || !firstLoadingUserInfos}>Create Group and Company</button>}


                        <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold', }}>Your Companies</span>
                        <div className='flexColumn' >

                            {companiesCoumpound?.map((compound, index) => (
                                <div key={index} style={{ marginTop: '10px' }}>
                                    <div className='transparentCanvas' onClick={() => setSelectedCompaniesCoumpound(selectedCompaniesCoumpound === compound.id ? null : compound.id)}>

                                        <img src={companiesGroupLogo} alt="Logo" style={{
                                            width: isPcV ? 50 : !isPcV ? 40 : 35, height: isPcV ? 50 : !isPcV ? 40 : 35,
                                            borderRadius: '6px', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        <div className='flexRow' style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '24px' : '16px', fontWeight: 'bold' }}>{compound.compoundName} </span>
                                            <FontAwesomeIcon icon={selectedCompaniesCoumpound === compound.id ? faSquareCaretUp : faSquareCaretDown}
                                                style={{ fontSize: isPcV ? '25px' : '16px', marginRight: isPcV ? '20px' : '5px', borderRadius: '4px', padding: isPcV ? '5px' : '4px', opacity: 0.8 }} />
                                        </div>
                                    </div>
                                    {(selectedCompaniesCoumpound === compound.id) && <div className='flexColumn' style={{ margin: '0px 10px', padding: '0px 10px 10px 10px', borderRadius: '0px 0px 6px 6px', backgroundColor: transparentCavasTwo(theme), minHeight: '50px' }}>
                                        {compound?.companies?.map((comp, idx) => (
                                            <div key={idx} className='flexRow' style={{ padding: '12px 10px', borderRadius: '6px', marginTop: '10px', justifyContent: 'center', backgroundColor: transparentCavasTwo(theme) }}

                                                onClick={() => { (comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? setOpenShiftModal(comp) : setCompanyToOperate(comp.id)) : setOpenShiftModal(comp)); }}>
                                                <img src={restaurantLogo} alt="Logo" style={{
                                                    width: isPcV ? 40 : 35, height: isPcV ? 40 : 35,
                                                    borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                                }} />
                                                <div style={{ display: 'flex', flexDirection: 'row', width: '100%', alignItems: 'center' }}>
                                                    <span style={{ fontSize: isPcV ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                                    <span style={{ fontSize: isPcV ? '15px' : '10px', fontWeight: 'bold', marginLeft: '15px', color: comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? redOne(theme) : greenOne(theme)) : redOne(theme) }}>
                                                        {comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? ' Shift closed' : ` Shift ${formatDateToDayMonth(comp?.lastOrOpenShift?.startTimeUTC)}`) : ' Shift closed'} </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>}
                                </div>
                            ))}
                        </div>

                        {companiesUserWorksOn?.length > 0 && <div className='flexColumn' style={{ color: "white", minWidth: '300px', maxWidth: '100%', marginTop: '20px' }}>
                            <span style={{ color: fontColorOne(theme), fontSize: isPcV ? '20px' : '16px', fontWeight: 'bold', }}>Your Work on</span>

                            {companiesUserWorksOn?.map((comp, idx) => (
                                <div key={idx} className='flexColumn' style={{ padding: '12px 10px', borderRadius: '6px', marginTop: '10px', justifyContent: 'center', backgroundColor: transparentCavasTwo(theme) }}>

                                    <div key={idx} className='flexRow fullCenter' style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            if (comp?.status === 'ACTIVE') {
                                                (comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? setOpenShiftModal(comp) : setCompanyToOperate(comp.id)) : setOpenShiftModal(comp));
                                            } else if (comp?.status === "WAITING_ACCEPTANCE") {
                                                navigate('/FelipeFPortfolio/delivery/ManageCompaniesWorkOn')
                                            }
                                        }}>
                                        <img src={restaurantLogo} alt="Logo" style={{
                                            width: isPcV ? 40 : 35, height: isPcV ? 40 : 35,
                                            borderRadius: '50%', backgroundColor: 'white', border: "2px solid white", marginRight: 10
                                        }} />
                                        {comp?.status === 'ACTIVE' && <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '20px' : '15px', fontWeight: 'bold' }}>{comp.companyName} </span>
                                            <span style={{ fontSize: isPcV ? '15px' : '10px', fontWeight: 'bold', marginLeft: '15px', color: comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? redOne(theme) : greenOne(theme)) : redOne(theme) }}>
                                                {comp?.lastOrOpenShift ? (comp?.lastOrOpenShift?.endTimeUTC ? ' Shift closed' : ` Shift ${formatDateToDayMonth(comp?.lastOrOpenShift?.startTimeUTC)}`) : ' Shift closed'} </span>
                                        </div>}

                                        {comp?.status === 'WAITING_ACCEPTANCE' && <div className='flexRow' style={{ width: '100%', alignItems: 'center' }}>
                                            <span style={{ fontSize: isPcV ? '20px' : '15px', fontWeight: 'bold' }}>{`${comp.companyName}`}</span>
                                            <span style={{ fontSize: isPcV ? '15px' : '12px', fontWeight: 'bold', marginLeft: '15px', color: blueOne(theme) }}>
                                                {`Accept Invite First`}</span>
                                        </div>}
                                    </div>
                                </div>
                            ))}
                        </div>}
                    </div>}
                </div>

                {createCompanyModal && <div className='myModal underDeliveryLayout' >
                    <CreateGroupAndCompanyModal close={() => setCreateCompanyModal(false)} getShiftOperationData={() => fetchUserInfos()} />
                </div>}

                {openShiftModal && <div className='myModal underDeliveryLayout' >
                    <OpenShiftModal close={() => setOpenShiftModal(false)} openShiftModal={openShiftModal} setCompanyToOperate={setCompanyToOperate} />
                </div>}
            </div >
        </>
    );
}