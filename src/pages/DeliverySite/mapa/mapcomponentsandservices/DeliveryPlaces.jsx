// Marker.js
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFireFlameCurved } from '@fortawesome/free-solid-svg-icons';

export const PutDeliveryPlaces = ({ map, markersGroup, lat, lng, label, minutes }) => {
    const markerColor = selectMarkerColor(minutes);

    const pizzaIcon = L.divIcon({
        html: ReactDOMServer.renderToStaticMarkup(
            <MarkerLabel label={label} markerColor={markerColor} minutes={minutes} />
        ),
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
        className: "custom-marker"
    });
    const marker = L.marker([lat, lng], { icon: pizzaIcon }).bindPopup(`${minutes}min`);

    markersGroup.addLayer(marker);
};

export function selectMarkerColor(minutes) {
    if (minutes <= 5) {
        return '#0c97e7';

    } else if (minutes > 5 && minutes <= 10) {
        return '#5715f1';

    } else if (minutes > 10 && minutes <= 20) {
        return '#a1ff0b';

    } else if (minutes > 20 && minutes <= 30) {
        return '#fffb0b';

    } else if (minutes > 30 && minutes <= 40) {
        return '#eb2778';

    } else if (minutes > 40 && minutes <= 50) {
        return '#ec5b06';

    } else if (minutes > 50 && minutes <= 60) {
        return '#e40e0e';

    } else if (minutes > 60 && minutes <= 70) {
        return '#e40e0e'
        // return '#e40e0e; border: 4px solid #f36818'
    } else if (minutes > 70) {
        // return '#e40e0e'
        return '#e40e0e; border: 4px solid #f36818'
    }
}

function MarkerLabel({ label, markerColor, minutes }) {
    return (
        <div style={{
            position: "relative",
            width: "40px",
            height: "40px",
            backgroundColor: markerColor,
            textAlign: "center",
            lineHeight: "40px",
            fontWeight: "800",
            color: "white",
            fontSize: "21px",
            borderRadius: "50%",
            WebkitTextStroke: "1.5px black",
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.30)'
        }}>
            {minutes > 60 && <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: '18px', position: 'absolute', bottom: 30, right: 0, textShadow: '0px 2px 100px rgba(0,0,0,0.4)', zIndex: 1000 }} />}
            {minutes > 70 && <FontAwesomeIcon icon={faFireFlameCurved} style={{ color: '#FFD43B', fontSize: '30px', position: 'absolute', bottom: 28, right: 0, textShadow: '0px 2px 100px rgba(0,0,0,0.4)', zIndex: 1000 }} />}
            {label}
        </div>
    );
}