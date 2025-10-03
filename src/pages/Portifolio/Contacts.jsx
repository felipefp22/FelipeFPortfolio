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
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
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
            <div style={{ display: 'flex', flexDirection: isDesktopView ? 'row' : 'column', justifyContent: isDesktopView ? 'center' : 'flex-start', textAlign: 'center', fontSize: isDesktopView ? '20px' : '18px', fontWeight: '400', width: '100%' }} >

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isDesktopView ? '50%' : '100%' }} >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '10px', height: '100%', justifyContent: 'center' }}>
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '26px' : '26px', textDecoration: 'none' }}>{"Felipe Ferreira"}</span>

                        <div onClick={() => { isDesktopView ? (navigator.clipboard.writeText(email), setCopiedEmailMsg(t("copiedMsg"))) : window.open(`mailto:${email}`, "_blank"); }}
                            style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', margin: '50px 0px', cursor: 'pointer' }} >

                            <img src={mailLogo} alt="Logo" style={{ width: 70, borderRadius: '6px', marginRight: '10px' }} />
                            <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px' }}>{email}</span>
                            {/* <span>{t("projects.myHealth.description")}</span> */}

                            {copiedEmailMsg && <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 60, padding: '20px 20px', backgroundColor: 'rgba(255, 255, 255, 0.3)', borderRadius: '6px', padding: '5px', 
                                alignItems: 'center', animation: 'fadeInOut 20s' }}>

                                <span style={{ margin: '5px 10px', fontSize: isDesktopView ? '18px' : '16px', color: 'white', fontWeight: 'bold' }}>{copiedEmailMsg}</span> 
                                <FontAwesomeIcon icon={faCheck} style={{ color: 'rgba(30, 230, 183, 0.79)' }} />
                            </div>}
                        </div>

                        <div onClick={() => window.open(`https://wa.me/${phone.replaceAll(" ", "").replaceAll("-", "")}`, "_blank")}
                            style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', margin: '50px 0px', cursor: 'pointer' }} >

                            <img src={whatsAppLogo} alt="Logo" style={{ width: 70, borderRadius: '6px', marginRight: '10px' }} />
                            <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px' }}>{phone}</span>
                            {/* <span>{t("projects.myHealth.description")}</span> */}
                        </div>
                    </div>
                </div>

                {/* {isDesktopView && <div style={{ width: '3px', backgroundColor: 'white', margin: '0px 30px' }} />}
                {!isDesktopView && <div style={{ height: '3px', backgroundColor: 'white', margin: '20px 0px' }} />}

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isDesktopView ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '26px' : '21px', textDecoration: 'underline' }} >{t("projects.portfolioProjects")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px' }}>{t("projects.restaurantDelivery.title")}</span>
                        <img src={restaurantSystemPhoto} alt="Logo" style={{ width: isDesktopView ? 300 : 80, marginBottom: '15px' }} />
                        <span>{t("projects.restaurantDelivery.description")}</span>
                    </div>
                </div> */}
            </div >
        </>
    );
}