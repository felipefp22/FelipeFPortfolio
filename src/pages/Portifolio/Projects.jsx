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
import { Link, useNavigate } from 'react-router-dom';

export default function Projects({ activeMenu }) {
    const navigate = useNavigate();
    const isPcV = useSelector((state) => state.view.isPcV);

    const { t, i18n } = useTranslation();

    return (
        <>
            <div style={{ display: 'flex', flexDirection: isPcV ? 'row' : 'column', alignContent: 'left', textAlign: 'left', fontSize: isPcV ? '20px' : '18px', fontWeight: '400' }} >

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isPcV ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isPcV ? '26px' : '21px', textDecoration: 'underline' }}>{t("port.projects.projectsIWorkedOn")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isPcV ? '22px' : '19px', marginBottom: '5px', cursor: 'pointer' }} onClick={() => window.open("https://minha-saude.com", "_blank")}>{t("port.projects.myHealth.title")}</span>
                        <img src={minhaSaudePhoto} alt="Logo" style={{ width: isPcV ? 300 : 250, marginBottom: '15px', cursor: 'pointer', borderRadius: '6px' }}
                            onClick={() => window.open("https://minha-saude.com", "_blank")} />

                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                            <img src={javaLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)'
                            }} />
                            <img src={springBootLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white",
                            }} />
                            <img src={reactLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite"
                            }} />
                            <img src={dockerLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                            <img src={sqlLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white'
                            }} />
                            <img src={azureLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'center', justifyContent: 'left', fontSize: isPcV ? '20px' : '16px' }} >

                            <span style={{ whiteSpace: "pre-line" }} >{t("port.projects.myHealth.description")}</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', justifyContent: 'left', marginTop: '15px' }} >
                            <span style={{ whiteSpace: "pre-line", }}> {t("port.projects.myHealth.description2")}
                                <a href={"https://minha-saude.com"} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(70, 181, 255, 1)' }}>Link</a></span>
                        </div>
                    </div>
                </div>

                {isPcV && <div style={{ width: '3px', backgroundColor: 'rgba(255, 255, 255, 0.6)', margin: '0px 30px' }} />}
                {!isPcV && <div style={{ height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.6)', margin: '20px 0px' }} />}

                <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'center', width: isPcV ? '50%' : '100%' }} >
                    <span style={{ fontWeight: 'bold', fontSize: isPcV ? '26px' : '21px', textDecoration: 'underline' }} >{t("port.projects.portfolioProjects")}</span>

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '10px' }} >
                        <span style={{ fontWeight: 'bold', fontSize: isPcV ? '22px' : '19px', marginBottom: '5px', cursor: 'pointer', }} onClick={() => window.open("https://felipefp22.github.io/FelipeFPortfolio/delivery/", "_blank")}>{t("port.projects.restaurantDelivery.title")}</span>
                        <img src={restaurantSystemPhoto} alt="Logo" style={{ width: isPcV ? 300 : 250, marginBottom: '15px', cursor: 'pointer', borderRadius: '6px' }}
                            onClick={() => { navigate(`/FelipeFPortfolio/delivery/`); }} />

                        <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '10px' }}>
                            <img src={javaLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)'
                            }} />
                            <img src={springBootLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white",
                            }} />
                            <img src={reactLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite"
                            }} />
                            <img src={dockerLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                            <img src={sqlLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white'
                            }} />
                            <img src={azureLogo} alt="Logo" style={{
                                width: isPcV ? 40 : 35, height: isPcV ? 40 : 35, margin: '0px 3px',
                                borderRadius: '50%', border: "2px solid white", backgroundColor: 'white',
                            }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'left', textAlign: 'center', justifyContent: 'left', fontSize: isPcV ? '20px' : '16px' }} >
                            <span style={{ whiteSpace: "pre-line", }}>{t("port.projects.restaurantDelivery.description1")}</span>

                            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left', justifyContent: 'left' }} >
                                <span style={{ whiteSpace: "pre-line", }}> - {t("port.projects.restaurantDelivery.description2")}
                                    {/* <a href={`${window.location.origin}/FelipeFPortfolio/delivery/`} target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(70, 181, 255, 1)' }}>Link</a></span> */}
                                    <a onClick={() => navigate(`/FelipeFPortfolio/delivery/`)} style={{ color: 'rgba(70, 181, 255, 1)' }}>Link</a></span>


                                <span style={{ whiteSpace: "pre-line", }}> - {t("port.projects.restaurantDelivery.description3")}
                                    <a href="https://github.com/felipefp22/RestaurantSystem" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(70, 181, 255, 1)' }}>Java Code</a></span>

                                <span style={{ whiteSpace: "pre-line", }}> - {t("port.projects.restaurantDelivery.description4")}
                                    <a href="https://github.com/felipefp22/FelipeFPortfolio" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(70, 181, 255, 1)', }}>React Code</a></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}