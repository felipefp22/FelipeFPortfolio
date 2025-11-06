import { Outlet, useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { fontColorOne, mainColor, secondColor } from '../../theme/Colors';
import { useEffect, useRef, useState } from 'react';
import MenuDrawer from './MenuDrawer';
import LogoutMessage from './auxs/LogoutMessage';


export default function LayoutDelivery() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.view.theme);

  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);

  const [showLogOutMessage, setShowLogOutMessage] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className='flexColumn fullCenter' style={{ background: mainColor(theme), color: fontColorOne(theme), height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden", justifyContent: "center", padding: '0' }}>
        <div className='flexColumn' style={{ height: "100%", margin: "0 auto", width: "100%", }}>

          <button className="floatingButton" style={{ alignSelf: "flex-start", visibility: drawerOpen ? 'hidden' : 'visible', marginBottom: '10px', margin: '13px 10px' }} onClick={() => { setDrawerOpen(true); }}>☰</button>

          {drawerOpen && <div ref={drawerRef}><MenuDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} setShowLogOutMessage={setShowLogOutMessage} /></div>}

          <Container fluid style={{ flex: 1, overflow: "hidden", width: "100%", paddingBottom: 1,  }}>
            <Outlet /> {/* This will render the page-specific body */}
          </Container>

          <footer style={{ backgroundColor: secondColor(theme), color: fontColorOne(theme), height: "35px", padding: "5px 0", textAlign: "center", borderTop: `1px solid rgba(0, 0, 0, 0.1)`, }}>
            <p style={{ margin: 0 }}>Developed by: <a href="https://felipefp22.github.io/FelipeFPortfolio" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", padding: 0, margin: 0 }}>felipefp22</a></p>
          </footer>
        </div>

        {showLogOutMessage && <div className="myModal" style={{ zIndex: 10000 }} >
          <LogoutMessage close={() => setShowLogOutMessage(false)} />
        </div>}
      </div>
    </>
  );
}