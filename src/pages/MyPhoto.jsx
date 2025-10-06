import myPhoto from '../assets/myPhoto.png';
import myNerdPhoto from '../assets/myNerdPhoto.jpg';
import javaLogo from '../assets/javaLogo.png';
import springBootLogo from '../assets/springBootLogo.png';
import cSharpLogo from '../assets/cSharpLogo.png';
import gitHubLogo from '../assets/gitHubLogo.png';
import gitHubLogo2 from '../assets/gitHubLogo2.png';
import reactLogo from '../assets/reactLogo.png';
import azureLogo from '../assets/azureLogo.png';
import reactNativeLogo from '../assets/reactNativeLogo.png';
import sqlLogo from '../assets/sqlLogo.png';
import mongoDbLogo from '../assets/mongoDbLogo.png';
import dockerLogo from '../assets/dockerLogo.png';


export default function MyPhoto() {


  return (
    <>
      <div>
        <div style={{
          background: "linear-gradient(135deg, #509001ff, #0d0d6eff)", color: "white", height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden",
          alignItems: "center", justifyContent: "center", alignContent: "center", justifyItems: "center", display: "flex", flexDirection: "column",
        }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: "relative" }} >
            <img src={myPhoto} alt="Logo" onClick={() => setSeeImageBig(myImage)} style={{
              width: '500px', height: "500px", borderRadius: '50%', objectFit: "contain", backgroundColor: "black", cursor: 'pointer', border: "8px solid white", boxShadow: "1px 2px 20px rgba(0, 0, 0, 0.8)",
            }} />

            <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute', bottom: -40, width: '100%', backgroundColor: "rgba(255, 255, 255, 0.2)", padding: "10px 330px", borderRadius: "10px" }} >
              <div style={{ display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', }} >

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', margin: '0px 10px' }} >
                  <img src={azureLogo} alt="Logo" style={{ width: 120, borderRadius: '50%', border: "8px solid white", backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', margin: '0px 10px' }} >
                  <img src={javaLogo} alt="Logo" style={{ width: 150, borderRadius: '50%', border: "8px solid white", backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', margin: '0px 10px' }} >
                  <img src={springBootLogo} alt="Logo" style={{ width: 150, borderRadius: '50%', border: "8px solid white", }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', margin: '0px 10px' }} >
                  <img src={reactLogo} alt="Logo" style={{ width: 120, borderRadius: '50%', border: "8px solid white", backgroundColor: 'rgba(255, 255, 255, 1)' }} />
                </div>

              </div>
            </div>
          </div>
        </div>

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
      </div>
    </>
  );
}