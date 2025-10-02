import { use, useEffect, useState } from 'react';
import minhaSaudePhoto from '../../assets/minhaSaudePhoto.png';
import restaurantSystemPhoto from '../../assets/restaurantSystemPhoto.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function Projects({ activeMenu }) {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const { t, i18n } = useTranslation();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: isDesktopView ? 'row' : 'column', alignContent: 'left', textAlign: 'left', fontSize: isDesktopView ? '20px' : '18px', fontWeight: '400' }} >

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isDesktopView ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '26px' : '21px', textDecoration: 'underline' }}>{t("projects.projectsIWorkedOn")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px', cursor: 'pointer' }} onClick={() => window.open("https://minha-saude.com", "_blank")}>{t("projects.myHealth.title")}</span>
                        <img src={minhaSaudePhoto} alt="Logo" style={{ width: isDesktopView ? 300 : 250, marginBottom: '15px', cursor: 'pointer' }} onClick={() => window.open("https://minha-saude.com", "_blank")} />
                        <span>{t("projects.myHealth.description")}</span>
                    </div>
                </div>

                {isDesktopView && <div style={{ width: '3px', backgroundColor: 'white', margin: '0px 30px' }} />}
                {!isDesktopView && <div style={{ height: '3px', backgroundColor: 'white', margin: '20px 0px' }} />}

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isDesktopView ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '26px' : '21px', textDecoration: 'underline' }} >{t("projects.portfolioProjects")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px', cursor: 'pointer' }}>{t("projects.restaurantDelivery.title")}</span>
                        <img src={restaurantSystemPhoto} alt="Logo" style={{ width: isDesktopView ? 300 : 250, marginBottom: '15px', cursor: 'pointer' }} />
                        <span>{t("projects.restaurantDelivery.description")}</span>
                    </div>
                </div>
            </div>
        </>
    );
}