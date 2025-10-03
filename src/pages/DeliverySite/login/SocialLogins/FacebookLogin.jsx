import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { updateLocalStorage } from "../../../../services/deliveryServices/AuthService";

const API_URL = import.meta.env.VITE_API_URL;

export default function FacebookLogin() {

    function handleFacebookLogin() {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const oauthUrl = `${API_URL}/oauth2/authorization/facebook`;

        const popup = window.open(
            oauthUrl,
            'Google Login',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        // Listen for message from popup
        window.addEventListener('message', (event) => {
            if (event.origin !== window.location.origin) return;

            if (event.data?.type === 'oauth-success') {
                updateLocalStorage(event.data);
            }
        });
    }

    return (
        <>
            <div onClick={handleFacebookLogin} style={{ cursor: "pointer", marginTop: 30 }}>
                <FontAwesomeIcon icon={faFacebook} style={{ fontSize: 30 }} />
            </div>
        </>
    );
}