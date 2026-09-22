export interface Landmark {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  tags?: Record<string, string>;
}

export interface AreaOverview {
  areaName: string;
  countyOrRegion?: string;
  country?: string;
  description?: string;
  famousFor?: string;
  famousLandmarks?: Landmark[];
  historicalSignificance?: string;
}

// Array of public Overpass API mirrors to handle failover
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

export async function fetchNearbyLandmarks(
  latitude: number,
  longitude: number,
  radiusMeters: number = 25000,
  category: 'all' | 'tourism' | 'historic' | 'natural' | 'lodging' = 'all'
): Promise<Landmark[]> {
  let filterQuery = '';
  if (category === 'natural') {
    filterQuery = `node["natural"](around:${radiusMeters},${latitude},${longitude});`;
  } else if (category === 'tourism') {
    filterQuery = `node["tourism"](around:${radiusMeters},${latitude},${longitude});`;
  } else if (category === 'historic') {
    filterQuery = `node["historic"](around:${radiusMeters},${latitude},${longitude});`;
  } else if (category === 'lodging') {
  filterQuery = `node["tourism"~"hotel|hostel|motel|guest_house"](around:${radiusMeters},${latitude},${longitude});`;
  }
   else {
    filterQuery = `
      node["natural"](around:${radiusMeters},${latitude},${longitude});
      node["waterway"="waterfall"](around:${radiusMeters},${latitude},${longitude});
      node["tourism"~"attraction|museum|viewpoint|artwork|theme_park"](around:${radiusMeters},${latitude},${longitude});
      node["historic"](around:${radiusMeters},${latitude},${longitude});
    `;
  }

  const query = `[out:json][timeout:15];(${filterQuery});out body 30;`;

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const url = `${endpoint}?data=${encodeURIComponent(query)}`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'WhatsAroundApp/1.0 (Mobile App)',
        },
      });

      if (!response.ok) {
        console.warn(`Overpass endpoint ${endpoint} returned status ${response.status}`);
        continue;
      }

      const rawText = await response.text();

      if (rawText.trim().startsWith('<')) {
        console.warn(`Overpass endpoint ${endpoint} returned HTML error response.`);
        continue;
      }

      const data = JSON.parse(rawText);

      if (!data || !data.elements) return [];

      return data.elements
        .filter((item: any) => item.tags && item.tags.name)
        .map((item: any) => ({
          id: String(item.id),
          name: item.tags.name,
          type: item.tags.waterway === 'waterfall'
            ? 'Waterfall'
            : item.tags.natural || item.tags.tourism || item.tags.historic || 'Feature',
          latitude: item.lat,
          longitude: item.lon,
          tags: item.tags,
        }));
    } catch (error) {
      console.warn(`Failed fetching from ${endpoint}:`, error);
    }
  }

  console.error('All Overpass endpoints failed or timed out.');
  return [];
}

export async function fetchAreaOverview(latitude: number, longitude: number): Promise<AreaOverview | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          'User-Agent': 'WhatsAroundApp/1.0',
        },
      }
    );

    if (!response.ok) return null;

    const rawText = await response.text();
    if (rawText.trim().startsWith('<')) return null;

    const data = JSON.parse(rawText);

    if (!data || !data.address) return null;

    const town =
      data.address.town ||
      data.address.city ||
      data.address.village ||
      data.address.suburb ||
      'Current Area';

    const state = data.address.state || data.address.county || data.address.region || '';
    const country = data.address.country || '';

    return {
      areaName: town,
      countyOrRegion: state,
      country: country,
      description: data.display_name || '',
      famousFor: 'Local cultural heritage, historical landmarks, and scenic locations.',
      famousLandmarks: [],
      historicalSignificance: `Located in ${state || country}, this region is integrated into local history and transport corridors.`,
    };
  } catch (error) {
    console.error('Error fetching area overview from Nominatim:', error);
    return null;
  }
}