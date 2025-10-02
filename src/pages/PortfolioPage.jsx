import { useState } from 'react';
import AboutMe from './Portifolio/AboutMe';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function PortfolioPage() {
    const isDesktopView = useSelector((state) => state.view.isDesktopView);
    const { t, i18n } = useTranslation();

    const menus = isDesktopView ? [t("aboutMe.title"), t("projects.title"), t("contacts.title")] : [t("skills.title"), t("aboutMe.title"), t("projects.title"), t("contacts.title")];
    const [active, setActive] = useState(0);

    return (
        <div>
            <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '6px' }} >

                <div style={{ width: '80%', paddingTop: '3px', margin: "0px auto", textAlign: 'center', }}>
                    <div style={{ color: 'white', marginTop: '10px', }}>
                        <h2 style={{ textDecoration: 'none' }}>{menus[active]}</h2>
                    </div>
                    <div style={{ position: 'relative', height: '4px', background: '#ffffff68', margin: '20px 0', borderRadius: '10px' }}>
                        <div
                            className="timeline-indicator"
                            style={{ left: `${(active / (menus.length - 1)) * 100}%` }}
                        />
                        {menus.map((menu, i) => (
                            <div
                                key={i}
                                className={`timeline-ball ${active === i ? "active" : ""}`}
                                style={{ left: `${(i / (menus.length - 1)) * 100}%` }}
                                onClick={() => setActive(i)}
                            />
                        ))}
                    </div>
                </div>
                {/* <div style={{ width: '90%', height: '3px', backgroundColor: 'rgba(255, 255, 255, 0.2)', margin: '0px auto', marginBottom: '20px' }} /> */}

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'left', padding: '20px', minHeight: '500px' }} >
                    {isDesktopView && menus[active] === t("aboutMe.title") && <AboutMe />}
                    {!isDesktopView && (menus[active] === t("aboutMe.title") || menus[active] === t("skills.title")) && <AboutMe activeMenu={menus[active]} />}
                </div>
            </div>

            <style>
                {`     
                    .timeline-line {
                        position: relative;
                        height: 4px;
                        background: #fff;
                        margin: 40px 0;
                    }

                    .timeline-ball {
                        position: absolute;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        background: #ffffff76;
                        cursor: pointer;
                        transition: background 0.3s ease;
                    }

                    .timeline-ball.active {
                        background: #fffffffa;
                        box-shadow: 0 0 15px #00f2a987;
                    }

                    .timeline-indicator {
                        position: absolute;
                        top: 50%;
                        transform: translate(-50%, -50%);
                        width: 18px;
                        height: 18px;
                        border-radius: 50%;
                        background: #7ef7d39d;
                        box-shadow: rgba(30, 230, 183, 0.68);
                        transition: left 0.8s ease;
                    }
                `}
            </style>

        </div>
    );
}