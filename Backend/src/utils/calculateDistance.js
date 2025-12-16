import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const mapboxKey = process.env.MAPBOX_API_KEY;

// Simple in-memory cache
const geocodeCache = {};

//  * Geocode an address to latitude & longitude

async function Geocode(address) {
    if (geocodeCache[address]) return geocodeCache[address];

    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxKey}`;
        const response = await axios.get(url);
        const data = response.data;

        if (data.features && data.features.length > 0) {
            const [longitude, latitude] = data.features[0].center;
            const result = { latitude, longitude };
            geocodeCache[address] = result;
            return result;
        } else {
            throw new Error('No results found');
        }
    } catch (error) {
        console.error(error.message);
        return null;
    }
}


//  * Calculate driving distance between two coordinates
async function RoadDistance(from, to) {
    try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.longitude},${from.latitude};${to.longitude},${to.latitude}?geometries=geojson&access_token=${mapboxKey}`;
    const response = await axios.get(url);
    const route = response.data.routes[0];

    return {
      distance: (route.distance * 0.000621371).toFixed(2), // in meters
      duration: route.duration  // in seconds
    };
    } catch (error) {
    console.error(error.message);
    return null;
    }
}

// Example usage
// (async () => {
//     const start = await Geocode('B30 1DY, Birmingham');
//     const end = await Geocode('Birmingham New Street Station');

//     console.log('Start:', start);
//     console.log('End:', end);

//     const roadInfo = await RoadDistance(start, end);
//     console.log('Road Distance & Duration:', roadInfo);
// })();

export {
    Geocode,
    RoadDistance
};