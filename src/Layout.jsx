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
        <div style={{ display: "flex", flexDirection: "column", height: "100%",  margin: "0 auto", width: "100%", }}>
          {/* <header style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 1000, background: "linear-gradient(135deg, #1b3a6f, #5f259f)" }}>

            <div style={{ maxWidth: "1200px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem 2rem", }} >
              <div style={{ display: "flex", flexDirection: "row", alignItems: "center", }}>
                <img src={AkitemTrampoLogo} onClick={() => navigate("")} alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", }} />
              </div>

              <Navbar expand="lg" variant="dark">
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", whiteSpace: "nowrap", }}>
                  <Nav.Link href="contact" style={{ color: "white", whiteSpace: "nowrap" }}>
                    Contato
                  </Nav.Link>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-light" id="dropdown-basic" style={{ whiteSpace: "nowrap" }}>
                      Suporte
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      <Dropdown.Item href="lgpd">LGPD</Dropdown.Item>
                      <Dropdown.Item href="delaccount">Deletar Conta</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Navbar>
            </div>
          </header> */}

          <Container style={{ flex: 1, overflow: "hidden", width: "100%", height: "100%", flexGrow: 1, boxSizing: "border-box", padding: 0 }}>
            <Outlet /> {/* This will render the page-specific body */}
          </Container>

        </div>
      </div>
    </>
  );
}