import { use, useEffect, useState } from 'react';
import minhaSaudePhoto from '../../assets/minhaSaudePhoto.png';
import restaurantSystemPhoto from '../../assets/restaurantSystemPhoto.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import mailLogo from '../../assets/mailLogo.png';
import whatsAppLogo from '../../assets/whatsAppLogo.png';

export default function Contacts({ activeMenu }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const { t, i18n } = useTranslation();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: isDesktopView ? 'row' : 'column', justifyContent: isDesktopView ? 'center' : 'flex-start', textAlign: 'center', fontSize: isDesktopView ? '20px' : '18px', fontWeight: '400', width: '100%' }} >

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isDesktopView ? '50%' : '100%' }} >
                    {/* <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '26px' : '21px', textDecoration: 'underline' }}>{t("contacts.title")}</span> */}

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', marginTop: '10px', width: '100%' }} >
                        <img src={mailLogo} alt="Logo" style={{ width: 70, borderRadius: '6px', marginRight: '10px' }} />
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px' }}>{t("felipefp2@gmail.com")}</span>
                        {/* <span>{t("projects.myHealth.description")}</span> */}
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', justifyItems: 'center', alignContent: 'center', alignItems: 'center', marginTop: '10px', width: '100%' }} >
                        <img src={whatsAppLogo} alt="Logo" style={{ width: 70, borderRadius: '6px', marginRight: '10px' }} />
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px' }}>{t("+55 11 94731 - 6319")}</span>
                        {/* <span>{t("projects.myHealth.description")}</span> */}
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
            </div>
        </>
    );
}