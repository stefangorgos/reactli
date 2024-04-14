const API_KEY = "e6c78aeae37b4c54bacb81dda09d47b2";

export function getMapPreview(lat, lng) {
    const imagePreviewUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-carto&width=500&height=300&center=lonlat:${lng},${lat}&zoom=15&marker=lonlat:${lng},${lat};color:%23ff0000;size:medium&apiKey=${API_KEY}
`;

    return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
    const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&apiKey=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch address");
    }

    const data = await response.json();

    if (!data.features || data.features.length === 0) {
        throw new Error("Failed to fetch address");
    }

    return data.features[0].properties.formatted;
}
