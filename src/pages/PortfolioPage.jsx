import myPhoto from '../assets/myPhoto.png';
import myNerdPhoto from '../assets/myNerdPhoto.jpg';
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

export default function PortfolioPage() {
    const [flipped, setFlipped] = useState(false);
    const [myImage, setMyImage] = useState(myPhoto);
    const [secondsFlipAnimation, setSecondsFlipAnimation] = useState(1);
    const [seeImageBig, setSeeImageBig] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFlipped(prev => prev + 180);

            setTimeout(() => {
                setMyImage(prev => (prev === myPhoto ? myNerdPhoto : myPhoto));
                // setFlipped(false);
            }, (secondsFlipAnimation * 1000) / 3);
        }, 6000); // Change image every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);


    return (
        <div>
            <style>
                {`
                    @keyframes spinPulse {
                        0%   { transform: rotate(0deg) }
                        25%  { transform: rotate(90deg) scale(1.05); }
                        50%  { transform: rotate(180deg) scale(1.1); }
                        75%  { transform: rotate(270deg) scale(1.05); }
                        100% { transform: rotate(360deg) scale(1); }
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    @keyframes spin-reverse {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(-360deg); }
                    }

                    @keyframes flip {
                        from { transform: rotateY(0deg); }
                        to { transform: rotateY(180deg); }
                    }
                    .spin-pulse {
                        animation: spinPulse 3s linear infinite;
                    }
                `}
            </style>

            <div style={{
                background: "linear-gradient(135deg, #509001ff, #0d0d6eff)", color: "white", height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflowX: "hidden",
                display: "flex", flexDirection: "column", padding: '0px 0px', alignItems: 'center',
                // alignItems: "center",
            }}>

                <div style={{ display: 'flex', flexDirection: 'column', padding: '10px', width: '1200px', marginTop: '50px', }} >
                    <div style={{ width: '100%', height: '400px' }} >
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%' }} >
                            <div style={{
                                borderRadius: '50%', border: "5px solid white", backgroundColor: "transparent", width: "360px", height: "360px", display: 'flex', alignItems: 'center',
                                justifyContent: 'center', boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.3)"
                            }} >
                                <img src={myImage} alt="Logo" onClick={() => setSeeImageBig(myImage)} style={{
                                    width: "350px", height: "350px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer',
                                    transform: `rotateY(${flipped}deg)`, transition: `transform ${secondsFlipAnimation}s`
                                }} />
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', marginLeft: '100px', width: '100%', alignItems: 'center', height: '100%', justifyContent: 'space-between', padding: '80px 0px' }} >
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '40px' }} >
                                    <h1 style={{ marginBottom: '30px' }}>Felipe Ferreira de Paula</h1>
                                    <h1>{"< Dev BackEND | FullStack />"}</h1>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'right', alignItems: 'flex-end', }} >
                                    <div style={{ display: 'flex', flexDirection: 'row', cursor: 'pointer', alignItems: 'center', }} onClick={() => window.open("https://github.com/FelipeFP22", "_blank")} >
                                        <img src={gitHubLogo2} alt="Logo" style={{ width: 50, height: 50, borderRadius: '50%', backgroundColor: "white", border: "2px solid white" }} />
                                        <h4 style={{ marginLeft: '10px', textDecoration: 'underline' }}>{"GitHub"}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                <h3 style={{ marginBottom: '20px', textDecoration: 'underline' }}>Sobre mim</h3>
                            
                            </div>
                        </div>
                    </div>
                </div>

            </div >
            {seeImageBig && <div onClick={() => setSeeImageBig(false)} style={{ position: 'fixed', top: 0, left: 0, height: '100vh', width: '100vw', backgroundColor: 'rgba(0, 19, 0, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} >
                <img src={seeImageBig} alt="Logo" style={{
                    maxWidth: "90%", maxHeight: "90%", borderRadius: '10px', objectFit: "contain", boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.5)"
                }} />
            </div>}
        </div>
    );
}