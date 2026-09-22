// TO CALCULATE THE REAL-WORLD DISTANCE BETWEEN TWO COORDINATES (LATITUDE AND LONGITUDE) IN KILOMETERS - HAVERSINE FORMULA
export function getDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const RadiusOfEarthKm = 6371; // Radius of the Earth in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return RadiusOfEarthKm * c;
}

// TO CALCULATE THE COMPASS DIRECTION (N, NE, E, SE, S, SW, W, NW) FROM ONE COORDINATE TO ANOTHER
export function getCompassDirection(lat1: number, lon1: number, lat2: number, lon2: number): string {
    const startLat = (lat1 * Math.PI) / 180;
    const startLon = (lon1 * Math.PI) / 180;
    const destLat = (lat2 * Math.PI) / 180;
    const destLon = (lon2 * Math.PI) / 180;

    const y = Math.sin(destLon - startLon) * Math.cos(destLat);
    const x =
        Math.cos(startLat) * Math.sin(destLat) -
        Math.sin(startLat) * Math.cos(destLat) * Math.cos(destLon - startLon);
    let bearing = (Math.atan2(y, x) * 180) / Math.PI;
    bearing = (bearing + 360) % 360; // Normalize to 0-360 degrees

    const compassPints = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(bearing / 45) % 8;
    return compassPints[index];
}