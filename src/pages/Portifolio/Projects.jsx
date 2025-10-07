import { use, useEffect, useState } from 'react';
import minhaSaudePhoto from '../../assets/minhaSaudePhoto.png';
import restaurantSystemPhoto from '../../assets/restaurantSystemPhoto.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import javaLogo from '../../assets/javaLogo.png';
import springBootLogo from '../../assets/springBootLogo.png';
import cSharpLogo from '../../assets/cSharpLogo.png';
import gitHubLogo from '../../assets/gitHubLogo.png';
import gitHubLogo2 from '../../assets/gitHubLogo2.png';
import reactLogo from '../../assets/reactLogo.png';
import azureLogo from '../../assets/azureLogo.png';
import reactNativeLogo from '../../assets/reactNativeLogo.png';
import sqlLogo from '../../assets/sqlLogo.png';
import mongoDbLogo from '../../assets/mongoDbLogo.png';
import dockerLogo from '../../assets/dockerLogo.png';
import { Link } from 'react-router-dom';

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
                        <img src={minhaSaudePhoto} alt="Logo" style={{ width: isDesktopView ? 300 : 250, marginBottom: '15px', cursor: 'pointer', borderRadius: '6px' }}
                            onClick={() => window.open("https://minha-saude.com", "_blank")} />

                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                            <img src={javaLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)'
                            }} />
                            <img src={springBootLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white",
                            }} />
                            <img src={reactLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite"
                            }} />
                            <img src={dockerLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                            <img src={sqlLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white'
                            }} />
                            <img src={azureLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'center', justifyContent: 'left', fontSize: isDesktopView ? '20px' : '16px' }} >

                            <span style={{ whiteSpace: "pre-line" }} >{t("projects.myHealth.description")}</span>
                        </div>
                    </div>
                </div>

                {isDesktopView && <div style={{ width: '3px', backgroundColor: 'rgba(255, 255, 255, 0.6)', margin: '0px 30px' }} />}
                {!isDesktopView && <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.6)', margin: '20px 0px' }} />}

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isDesktopView ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '26px' : '21px', textDecoration: 'underline' }} >{t("projects.portfolioProjects")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isDesktopView ? '22px' : '19px', marginBottom: '5px', cursor: 'pointer', }} onClick={() => window.open("https://felipefp22.github.io/FelipeFPortfolio/delivery/", "_blank")}>{t("projects.restaurantDelivery.title")}</span>
                        <img src={restaurantSystemPhoto} alt="Logo" style={{ width: isDesktopView ? 300 : 250, marginBottom: '15px', cursor: 'pointer', borderRadius: '6px' }}
                            onClick={() => { window.open(`${window.location.origin}/FelipeFPortfolio/delivery/`, "_blank"); }} />

                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                            <img src={javaLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)'
                            }} />
                            <img src={springBootLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white",
                            }} />
                            <img src={reactLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite"
                            }} />
                            <img src={dockerLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                            <img src={sqlLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white'
                            }} />
                            <img src={azureLogo} alt="Logo" style={{
                                width: isDesktopView ? 40 : 35, height: isDesktopView ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'center', justifyContent: 'left', fontSize: isDesktopView ? '20px' : '16px' }} >
                            <span style={{ whiteSpace: "pre-line", }}>{t("projects.restaurantDelivery.description1")}</span>

                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', justifyContent: 'left' }} >
                                <span style={{ whiteSpace: "pre-line", }}> - {t("projects.restaurantDelivery.description2")}
                                    <a href="https://github.com/felipefp22/RestaurantSystem" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(70, 181, 255, 1)' }}>Java Code</a></span>

                                <span style={{ whiteSpace: "pre-line", }}> - {t("projects.restaurantDelivery.description3")}
                                    <a href="https://github.com/felipefp22/FelipeFPortfolio" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(70, 181, 255, 1)', }}>React Code</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}