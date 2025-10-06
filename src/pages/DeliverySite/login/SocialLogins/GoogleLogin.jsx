import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { updateLocalStorage } from "../../../../services/deliveryServices/AuthService";

const API_URL = import.meta.env.VITE_API_URL;

export default function GoogleLogin({ setPage, setSocialLoginUrl }) {

    function handleGoogleLogin() {
        const width = 500;
        const height = 600;
        const left = (window.innerWidth - width) / 2;
        const top = (window.innerHeight - height) / 2;

        const oauthUrl = `${API_URL}/oauth2/authorization/google`;

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
            <div onClick={handleGoogleLogin} style={{ cursor: "pointer", marginTop: 30 }}>
                <FontAwesomeIcon icon={faGoogle} style={{ fontSize: 30, }} />
            </div>
        </>
    );
}