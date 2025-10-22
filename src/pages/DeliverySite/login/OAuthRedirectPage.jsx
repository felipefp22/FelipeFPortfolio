import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import RestaurantDeliveryLogo from '../../../assets/RestaurantDeliveryLogo.jpeg'
import { fontColorOne, mainColor } from "../../../theme/Colors";
import { useSelector } from "react-redux";

export default function OAuthRedirectPage() {
  const theme = useSelector((state) => state.view.theme);

  useEffect(() => {
    const url = new URL(window.location.href);
    const access_token = url.searchParams.get('access_token');
    const refresh_token = url.searchParams.get('refresh_token');
    const isEmailConfirmed = url.searchParams.get('isEmailConfirmed');
    const isPhoneConfirmed = url.searchParams.get('isPhoneConfirmed');

    if (window.opener) {
      window.opener.postMessage({
        type: 'oauth-success',
        access_token,
        refresh_token,
        isEmailConfirmed,
        isPhoneConfirmed
      }, window.origin);

      window.close();
    }
  }, []);

  return (
    <div style={{
      background: mainColor(theme), color: fontColorOne(theme), height: "100dvh", width: "100vw", fontFamily: "Segoe UI, sans-serif", overflow: "hidden",
      display: "flex", flexDirection: "column", justifyContent: "center", padding: '0px 0px'
      // alignItems: "center",
    }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", }}>
        <img src={RestaurantDeliveryLogo} alt="Restaurant Delivery Logo" style={{ maxWidth: "300px", marginBottom: "2rem", borderRadius: "50%", margin: 32 }} />

        <Spinner animation="grow" style={{ width: "5rem", height: "5rem", margin: 32 }} />
      </div>
    </div>
  );
}