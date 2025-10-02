
import javaLogo from '../assets/javaLogo.png';
import springBootLogo from '../assets/springBootLogo.png';
import gitHubLogo from '../assets/gitHubLogo.png';
import gitHubLogo2 from '../assets/gitHubLogo2.png';
import reactLogo from '../assets/reactLogo.png';
import azureLogo from '../assets/azureLogo.png';
import reactNativeLogo from '../assets/reactNativeLogo.png';
import sqlLogo from '../assets/sqlLogo.png';
import mongoDbLogo from '../assets/mongoDbLogo.png';
import dockerLogo from '../assets/dockerLogo.png';
import { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function PortfolioPage() {
    const { t, i18n } = useTranslation();
    const [secondsFlipAnimation, setSecondsFlipAnimation] = useState(1);

    return (
        <div>
            <div style={{ width: '100%', marginTop: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: '20px', borderRadius: '6px' }} >
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'left' }} >

                    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'left' }} >
                        <h3 style={{ marginBottom: '20px', textDecoration: 'underline' }}>Skills</h3>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={javaLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                            <h4 style={{ marginLeft: '20px' }}>{"Java - SpringBoot"}</h4>
                            <img src={springBootLogo} alt="Logo" style={{ width: 50, height: 50, marginLeft: '20px', borderRadius: '50%', border: "2px solid white", }} />
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={sqlLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'white' }} />
                            <h4 style={{ marginLeft: '20px' }}>{"SQL"}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={mongoDbLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(164, 211, 159, 1)' }} />
                            <h4 style={{ marginLeft: '20px' }}>{"NoSQL"}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={azureLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'white', }} />
                            <h4 style={{ marginLeft: '20px' }}>{"Azure"}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={gitHubLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'black' }} />
                            <h4 style={{ marginLeft: '20px' }}>{"GitHub Actions"}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={reactLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite" }} />
                            <h4 style={{ marginLeft: '20px' }}>{"React"}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={reactNativeLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(0, 0, 0, 1)', animation: "spin-reverse 10s linear infinite" }} />
                            <h4 style={{ marginLeft: '20px' }}>{"React Native"}</h4>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                            <img src={dockerLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'white', }} />
                            <h4 style={{ marginLeft: '20px' }}>{"Docker"}</h4>
                        </div>
                    </div>
                    <div style={{ width: '3px', backgroundColor: 'white', marginLeft: '50px', marginRight: '50px' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'left' }} >
                        <h3 style={{ marginBottom: '20px', textDecoration: 'underline' }}>{t("portfolioPage.aboutMeTitle")}</h3>
                        <p style={{ whiteSpace: 'pre-line', fontSize: '18px', lineHeight: '1.5' }}>{t("portfolioPage.aboutMe")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}