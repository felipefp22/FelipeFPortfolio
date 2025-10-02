
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
import { use, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function AboutMe() {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);

    const { t, i18n } = useTranslation();
    const [secondsFlipAnimation, setSecondsFlipAnimation] = useState(1);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'left', fontSize: isDesktopView ? '26px' : '18px', fontWeight: '600' }} >
                {/* <span style={{ marginBottom: '20px', textDecoration: 'underline', fontSize: isDesktopView ? '30px' : '20px', fontWeight: '700' }}>Skills</span> */}

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={javaLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                    <span style={{ marginLeft: '20px', textDecoration: 'none' }}>{"Java"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={springBootLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", }} />
                    <span style={{ marginLeft: '20px', textDecoration: 'none' }}>{"SpringBoot"}</span>
                </div>

                {/* <div style={{ height: '3px', backgroundColor: 'white', marginBottom: '20px' }} /> */}

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={cSharpLogo} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(18, 14, 14, 1)' }} />
                    <span style={{ marginLeft: '20px', textDecoration: 'none' }}>{"C#"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={sqlLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", backgroundColor: 'white' }} />
                    <span style={{ marginLeft: '20px' }}>{"SQL"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={mongoDbLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(164, 211, 159, 1)' }} />
                    <span style={{ marginLeft: '20px' }}>{"NoSQL"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={azureLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", backgroundColor: 'white', }} />
                    <span style={{ marginLeft: '20px' }}>{"Azure"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={gitHubLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", backgroundColor: 'black' }} />
                    <span style={{ marginLeft: '20px' }}>{"GitHub Actions"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={reactLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite" }} />
                    <span style={{ marginLeft: '20px' }}>{"React"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={reactNativeLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(0, 0, 0, 1)', animation: "spin-reverse 10s linear infinite" }} />
                    <span style={{ marginLeft: '20px' }}>{"React Native"}</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={dockerLogo} alt="Logo" style={{ width: isDesktopView ? 50 : 40, height: isDesktopView ? 50 : 40, borderRadius: '50%', border: "2px solid white", backgroundColor: 'white', }} />
                    <span style={{ marginLeft: '20px' }}>{"Docker"}</span>
                </div>
            </div>
            <div style={{ width: '3px', backgroundColor: 'white', margin: '0px 30px' }} />

            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'left', fontSize: isDesktopView ? '26px' : '18px', fontWeight: '700' }} >
                {/* <span style={{ marginBottom: '20px', textDecoration: 'underline', fontSize: isDesktopView ? '30px' : '20px' }}>{t("aboutMe.title")}</span> */}
                <p style={{ whiteSpace: 'pre-line', fontSize: '18px', fontWeight: '400', lineHeight: '1.5' }}>{t("aboutMe.content")}</p>
            </div>
        </>
    );
}