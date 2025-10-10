import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';


export default function LayoutDelivery() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{
        background: "#1C1C1C", color: "white", height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center", padding: '0px 0px'
        // alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100%", margin: "0 auto", width: "100%", }}>

          <Container fluid style={{ flex: 1, overflow: "hidden", width: "100%",  paddingBottom: 1, marginTop: 10 }}>
            <Outlet /> {/* This will render the page-specific body */}
          </Container>

          <footer style={{ backgroundColor: "#272725", color: "white", height: "35px", padding: "5px 0", textAlign: "center", }}>
            <p style={{ margin: 0 }}>Developed by: <a href="https://felipefp22.github.io/FelipeFPortfolio" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", padding: 0, margin: 0 }}>felipefp22</a></p>
          </footer>
        </div>
      </div>
    </>
  );
}