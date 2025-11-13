function calculateEstimatedKm(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km

    const toRad = (deg) => deg * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    let distance = R * c; // Haversine distance in km

    console.log("Raw distance (km): ", distance);
    // Apply correction factor
    distance *= 1.3;
    console.log("Corrected distance (km): ", distance);

    // Round up to the next integer
    distance = Math.ceil(distance);
    console.log("Rounded distance (km): ", distance);

    return distance;
}