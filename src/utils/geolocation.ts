import { Professional, UserLocation } from '../types.ts';

// Earth's radius in kilometers
const EARTH_RADIUS_KM = 6371;

/**
 * Calculates distance in kilometers between two coordinates using the Haversine formula
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const rLat1 = (lat1 * Math.PI) / 180;
  const rLat2 = (lat2 * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(rLat1) * Math.cos(rLat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

/**
 * Formats distance into a human-readable string (e.g., '650 m', '2.4 km')
 */
export function formatDistance(distanceKm: number | null | undefined): string {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) {
    return '-- km';
  }

  if (distanceKm < 0.05) {
    return 'Bem próximo (< 50 m)';
  }

  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000 / 50) * 50; // rounded to nearest 50m
    return `${meters} m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(1)} km`;
  }

  return `${Math.round(distanceKm)} km`;
}

/**
 * Reference coordinates for neighborhoods in Sorocaba and regional cities
 */
export const NEIGHBORHOOD_COORDINATES: Record<string, { lat: number; lng: number }> = {
  // Sorocaba
  'Centro': { lat: -23.5015, lng: -47.4587 },
  'Campolim': { lat: -23.5350, lng: -47.4660 },
  'Parque Campolim': { lat: -23.5380, lng: -47.4645 },
  'Mangal': { lat: -23.5120, lng: -47.4680 },
  'Trujillo': { lat: -23.4950, lng: -47.4720 },
  'Wanel Ville': { lat: -23.4900, lng: -47.5050 },
  'Além Ponte': { lat: -23.5070, lng: -47.4420 },
  'Vila Hortência': { lat: -23.5130, lng: -47.4450 },
  'Santa Rosália': { lat: -23.4920, lng: -47.4480 },
  'Jardim dos Estados': { lat: -23.5220, lng: -47.4650 },
  'Jardim Paulistano': { lat: -23.5250, lng: -47.4610 },
  'Vila Haro': { lat: -23.5180, lng: -47.4330 },
  'Vila Lucy': { lat: -23.5160, lng: -47.4750 },
  'Vila Progresso': { lat: -23.4830, lng: -47.4520 },
  'Parque São Bento': { lat: -23.4350, lng: -47.4750 },
  'Brigadeiro Tobias': { lat: -23.5120, lng: -47.3600 },
  'Éden': { lat: -23.4300, lng: -47.3800 },
  'Aparecidinha': { lat: -23.4700, lng: -47.3700 },
  'Jardim Gonçalves': { lat: -23.5050, lng: -47.4280 },
  'Jardim América': { lat: -23.5280, lng: -47.4690 },
  'Vila Carvalho': { lat: -23.4940, lng: -47.4620 },
  'Vila Fiori': { lat: -23.4870, lng: -47.4570 },
  'Jardim Simus': { lat: -23.4980, lng: -47.4910 },

  // Votorantim
  'Votorantim Centro': { lat: -23.5415, lng: -47.4378 },
  'Parque Bela Vista': { lat: -23.5360, lng: -47.4480 },
  'Vossoroca': { lat: -23.5530, lng: -47.4520 },
  'Rio Acima': { lat: -23.5510, lng: -47.4250 },

  // Itu
  'Itu Centro': { lat: -23.2642, lng: -47.2992 },
  'Cidade Nova': { lat: -23.2850, lng: -47.3200 },
  'Itu Novo Centro': { lat: -23.2720, lng: -47.2880 },

  // Salto
  'Salto Centro': { lat: -23.2008, lng: -47.2869 },
  'Jardim Saltense': { lat: -23.2100, lng: -47.2750 }
};

/**
 * City center default coordinates
 */
export const CITY_COORDINATES: Record<string, { lat: number; lng: number }> = {
  'cid-sorocaba': { lat: -23.5015, lng: -47.4587 },
  'cid-votorantim': { lat: -23.5415, lng: -47.4378 },
  'cid-itu': { lat: -23.2642, lng: -47.2992 },
  'cid-salto': { lat: -23.2008, lng: -47.2869 }
};

/**
 * Quick simulation landmarks for users to test proximity without physical GPS device
 */
export const POPULAR_LANDMARKS = [
  {
    id: 'campolim',
    nome: 'Parque Campolim (Zona Sul)',
    bairro: 'Campolim',
    lat: -23.5350,
    lng: -47.4660,
    descricao: 'Região da Av. Antônio Carlos Comitre e Shopping Iguatemi'
  },
  {
    id: 'centro',
    nome: 'Centro Histórico (Catedral / Praça)',
    bairro: 'Centro',
    lat: -23.5015,
    lng: -47.4587,
    descricao: 'Região central comercial de Sorocaba'
  },
  {
    id: 'wanel',
    nome: 'Wanel Ville (Zona Oeste)',
    bairro: 'Wanel Ville',
    lat: -23.4900,
    lng: -47.5050,
    descricao: 'Av. Elias Maluf e grande polo residencial'
  },
  {
    id: 'trujillo',
    nome: 'Trujillo / Hospital Modelo (Zona Norte)',
    bairro: 'Trujillo',
    lat: -23.4950,
    lng: -47.4720,
    descricao: 'Região hospitalar e residencial norte'
  },
  {
    id: 'santa_rosalia',
    nome: 'Santa Rosália (Zona Leste)',
    bairro: 'Santa Rosália',
    lat: -23.4920,
    lng: -47.4480,
    descricao: 'Próximo à Av. Pereira da Silva'
  },
  {
    id: 'mangal',
    nome: 'Mangal / Vergueiro',
    bairro: 'Mangal',
    lat: -23.5120,
    lng: -47.4680,
    descricao: 'Região tradicional e residencial'
  },
  {
    id: 'eden',
    nome: 'Éden / Zona Industrial',
    bairro: 'Éden',
    lat: -23.4300,
    lng: -47.3800,
    descricao: 'Polo industrial e residencial do Éden'
  }
];

/**
 * Returns latitude and longitude for a professional, using exact coordinates if available,
 * or resolving based on base neighborhood, attended neighborhoods, or city center.
 */
export function getProfessionalCoordinates(pro: Professional): { latitude: number; longitude: number } {
  if (pro.latitude !== undefined && pro.longitude !== undefined) {
    return { latitude: pro.latitude, longitude: pro.longitude };
  }

  // Check base neighborhood
  if (pro.bairroBase && NEIGHBORHOOD_COORDINATES[pro.bairroBase]) {
    const base = NEIGHBORHOOD_COORDINATES[pro.bairroBase];
    return { latitude: base.lat, longitude: base.lng };
  }

  // Check first attended neighborhood
  if (pro.bairrosAtendidos && pro.bairrosAtendidos.length > 0) {
    for (const b of pro.bairrosAtendidos) {
      if (NEIGHBORHOOD_COORDINATES[b]) {
        const coords = NEIGHBORHOOD_COORDINATES[b];
        return { latitude: coords.lat, longitude: coords.lng };
      }
    }
  }

  // Fallback to city coordinates with deterministic minor offset based on id
  const cityCoords = CITY_COORDINATES[pro.cidadeId] || CITY_COORDINATES['cid-sorocaba'];
  let hash = 0;
  for (let i = 0; i < pro.id.length; i++) {
    hash = (hash << 5) - hash + pro.id.charCodeAt(i);
    hash |= 0;
  }
  const offsetLat = ((hash % 100) / 10000) * 1.5;
  const offsetLng = (((hash >> 2) % 100) / 10000) * 1.5;

  return {
    latitude: cityCoords.lat + offsetLat,
    longitude: cityCoords.lng + offsetLng
  };
}

/**
 * Identifies the closest neighborhood label for given coordinates
 */
export function getNearestNeighborhood(lat: number, lng: number): string {
  let closestName = 'Sorocaba';
  let minDistance = Infinity;

  for (const [name, coords] of Object.entries(NEIGHBORHOOD_COORDINATES)) {
    const dist = calculateDistanceKm(lat, lng, coords.lat, coords.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestName = name;
    }
  }

  return closestName;
}
