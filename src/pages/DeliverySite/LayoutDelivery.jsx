import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { fontColorOne, mainColor, secondColor } from '../../theme/Colors';


export default function LayoutDelivery() {
  const navigate = useNavigate();
  const theme = useSelector((state) => state.view.theme);


  return (
    <>
      <div style={{
        background: mainColor(theme), color: fontColorOne(theme), height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: '0px 0px'
        // alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", margin: "0 auto", width: "100%", }}>

          <Container fluid style={{ flex: 1, overflow: "hidden", width: "100%", paddingBottom: 1, marginTop: 10 }}>
            <Outlet /> {/* This will render the page-specific body */}
          </Container>

          <footer style={{ backgroundColor: secondColor(theme), color: fontColorOne(theme), height: "35px", padding: "5px 0", textAlign: "center", }}>
            <p style={{ margin: 0 }}>Developed by: <a href="https://felipefp22.github.io/FelipeFPortfolio" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", padding: 0, margin: 0 }}>felipefp22</a></p>
          </footer>
        </div>
      </div>
    </>
  );
}