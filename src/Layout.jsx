import { Outlet, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Dropdown, Container } from 'react-bootstrap';
import { useSelector } from 'react-redux';


export default function Layout() {
  const navigate = useNavigate();

  return (
    <>
      <div style={{
        background: "linear-gradient(135deg, #484848ff, #26265aff)", color: "white", height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "center",
        // alignItems: "center",
      }}>
        <div style={{ display: "flex", flexDirection: "column", height: "100dvh", margin: "0 auto", width: "100%", }}>

          <Container style={{ flexGrow: 1, overflow: "hidden", width: "100%", height: "100%", paddingBottom: 10 }}>
            <Outlet /> {/* This will render the page-specific body */}
          </Container>

          <footer style={{ backgroundColor: "#333", color: "white", height: "20px", padding: "5px 0", textAlign: "center", }}>
            <p style={{ margin: 0 }}>Developed by: <a href="https://github.com/felipefp22" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline", padding: 0, margin: 0 }}>felipefp22</a></p>
          </footer>
        </div>
      </div>
    </>
  );
}