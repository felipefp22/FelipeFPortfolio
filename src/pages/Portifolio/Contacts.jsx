import { use, useEffect, useState } from 'react';
import minhaSaudePhoto from '../../assets/minhaSaudePhoto.png';
import restaurantSystemPhoto from '../../assets/restaurantSystemPhoto.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import mailLogo from '../../assets/mailLogo.png';
import whatsAppLogo from '../../assets/whatsAppLogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';


export default function Contacts({ activeMenu }) {
    const isPcV = useSelector((state) => state.view.isPcV);
    const email = 'felipefp2@gmail.com';
    const phone = '+55 11 94731 - 5319';
    const [copiedEmailMsg, setCopiedEmailMsg] = useState(null);

    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (copiedEmailMsg) {
            const timer = setTimeout(() => {
                setCopiedEmailMsg(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [copiedEmailMsg]);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: isPcV ? 'row' : 'column', justifyContent: isPcV ? 'center' : 'flex-start', textAlign: 'center', fontSize: isPcV ? '20px' : '18px', fontWeight: '400', width: '100%' }} >

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isPcV ? '50%' : '100%' }} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', height: '100%', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: isPcV ? '26px' : '26px', textDecoration: 'none' }}>{"Felipe Ferreira"}</span>

                        <div onClick={() => { isPcV ? (navigator.clipboard.writeText(email), setCopiedEmailMsg(t("copiedMsg"))) : window.open(`mailto:${email}`, "_blank"); }}
                            style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', margin: '50px 0px', cursor: 'pointer' }} >

                            <img src={mailLogo} alt="Logo" style={{ width: 70, borderRadius: '6px', marginRight: '10px' }} />
                            <span style={{ fontWeight: 'bold', fontSize: isPcV ? '22px' : '19px', marginBottom: '5px' }}>{email}</span>
                            {/* <span>{t("port.projects.myHealth.description")}</span> */}

                            {copiedEmailMsg && <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 60, padding: 20, backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '6px', 
                                alignItems: 'center', animation: 'fadeInOut 20s' }}>

                                <span style={{ fontSize: isPcV ? '18px' : '16px', color: 'white', fontWeight: 'bold' }}>{copiedEmailMsg}</span> 
                                <FontAwesomeIcon icon={faCheck} style={{ color: 'rgba(30, 230, 183, 0.79)' }} />
                            </div>}
                        </div>

                        <div onClick={() => window.open(`https://wa.me/${phone.replaceAll(" ", "").replaceAll("-", "")}`, "_blank")}
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', margin: '50px 0px', cursor: 'pointer' }} >

                            <img src={whatsAppLogo} alt="Logo" style={{ width: 70, borderRadius: '6px', marginRight: '10px' }} />
                            <span style={{ fontWeight: 'bold', fontSize: isPcV ? '22px' : '19px', marginBottom: '5px' }}>{phone}</span>
                            {/* <span>{t("port.projects.myHealth.description")}</span> */}
                        </div>
                    </div>
                </div>

                {/* {isPcV && <div style={{ width: '3px', backgroundColor: 'white', margin: '0px 30px' }} />}
                {!isPcV && <div style={{ height: '3px', backgroundColor: 'white', margin: '20px 0px' }} />}

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isPcV ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isPcV ? '26px' : '21px', textDecoration: 'underline' }} >{t("port.projects.portfolioProjects")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isPcV ? '22px' : '19px', marginBottom: '5px' }}>{t("port.projects.restaurantDelivery.title")}</span>
                        <img src={restaurantSystemPhoto} alt="Logo" style={{ width: isPcV ? 300 : 80, marginBottom: '15px' }} />
                        <span>{t("port.projects.restaurantDelivery.description")}</span>
                    </div>
                </div> */}
            </div >
        </>
    );
}