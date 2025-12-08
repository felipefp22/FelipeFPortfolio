
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

export default function AboutMe( { activeMenu } ) {
    const isPcV = useSelector((state) => state.view.isPcV);

    const { t, i18n } = useTranslation();
    const [secondsFlipAnimation, setSecondsFlipAnimation] = useState(1);

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'left', fontSize: isPcV ? '26px' : '18px', fontWeight: '600' }} >
                {/* <span style={{ marginBottom: '20px', textDecoration: 'underline', fontSize: isPcV ? '30px' : '20px', fontWeight: '700' }}>{t("port.skills.title")}</span> */}

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={javaLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"Java"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={springBootLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"SpringBoot"}</span>}
                </div>

                {/* <div style={{ height: '3px', backgroundColor: 'white', marginBottom: '20px' }} /> */}

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={cSharpLogo} alt="Logo" style={{  width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(18, 14, 14, 1)' }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"C#"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={sqlLogo} alt="Logo" style={{  width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'white' }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"SQL"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={mongoDbLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(164, 211, 159, 1)' }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"NoSQL"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={azureLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'white', }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"Azure"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={gitHubLogo} alt="Logo" style={{  width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'black' }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"GitHub Actions"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={reactLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", animation: "spin 10s linear infinite" }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"React"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={reactNativeLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'rgba(0, 0, 0, 1)', animation: "spin-reverse 10s linear infinite" }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"React Native"}</span>}
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', marginBottom: '20px' }} >
                    <img src={dockerLogo} alt="Logo" style={{ width: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35, height: isPcV ? 50 : (!isPcV && activeMenu === t("port.skills.title")) ? 40 : 35,
                         borderRadius: '50%', border: "2px solid white", backgroundColor: 'white', }} />
                    {(isPcV || (!isPcV && activeMenu === t("port.skills.title"))) && <span style={{ marginLeft: isPcV ? '20px' : '10px' }}>{"Docker"}</span>}
                </div>
            </div>
            {(isPcV || (!isPcV && activeMenu === t("port.aboutMe.title"))) &&  <div style={{ width: '3px', backgroundColor: 'white', margin: isPcV ? '0px 30px' : '0px 10px' }} />}

            {(isPcV || (!isPcV && activeMenu === t("port.aboutMe.title"))) && <div style={{ display: 'flex', flexDirection: 'column', alignContent: 'left', textAlign: 'left', fontSize: isPcV ? '26px' : '18px', fontWeight: '700' }} >
                <span style={{ marginBottom: '20px', textDecoration: 'underline', fontSize: isPcV ? '30px' : '20px' }}>{t("port.aboutMe.title")}</span>
                <p style={{ whiteSpace: 'pre-line', fontSize: '18px', fontWeight: '400', lineHeight: '1.5' }}>{t("port.aboutMe.content")}</p>
            </div>}
        </>
    );
}