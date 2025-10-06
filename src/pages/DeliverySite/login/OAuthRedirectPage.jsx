import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import RestaurantDeliveryLogo from '../../../assets/RestaurantDeliveryLogo.jpeg'

export default function OAuthRedirectPage() {
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
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",  }}>
      <img src={RestaurantDeliveryLogo} alt="Restaurant Delivery Logo" style={{ maxWidth: "300px", marginBottom: "2rem", borderRadius: "50%", margin: 32 }} />

      <Spinner animation="grow" style={{ width: "5rem", height: "5rem", margin: 32 }} />
    </div>
  );
}