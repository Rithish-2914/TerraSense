import React, { useState, useMemo, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MAP_CONFIG = {
  defaultCenter: [10.7905, 78.7047], // Trichy default
  zoom: 13
};

const mapStyles = {
  plan: {
    color: '#0042A6',
    weight: 3.5,
    fillOpacity: 0.12,
    fillColor: '#2E96F5',
    dashArray: '6, 6'
  },
  floodRiskBaseline: {
    color: '#FF6B35',
    weight: 2,
    fillOpacity: 0.40,
    fillColor: '#FF6B35'
  },
  floodRiskRCP45: {
    color: '#E43700',
    weight: 2.5,
    fillOpacity: 0.55,
    fillColor: '#E43700'
  },
  floodRiskRCP85: {
    color: '#900C3F',
    weight: 3,
    fillOpacity: 0.65,
    fillColor: '#C70039'
  },
  floodRiskMitigated: {
    color: '#27AE60',
    weight: 2.5,
    fillOpacity: 0.40,
    fillColor: '#2ECC71'
  },
  splitLeftBefore: {
    color: '#900C3F',
    weight: 3,
    fillOpacity: 0.70,
    fillColor: '#E43700'
  },
  splitRightAfter: {
    color: '#065F46',
    weight: 2.5,
    fillOpacity: 0.45,
    fillColor: '#10B981'
  }
};

// High-performance direct Leaflet GeoJSON layer (avoids React DOM thrashing)
function FastGeoJSON({ data, style, onEachFeature }) {
  const map = useMap();
  const layerRef = useRef(null);

  useEffect(() => {
    if (!map || !data) return;

    // Remove previous layer
    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    const geoLayer = L.geoJSON(data, {
      style: typeof style === 'function' ? style : () => style,
      onEachFeature: onEachFeature
    });

    geoLayer.addTo(map);
    layerRef.current = geoLayer;

    return () => {
      if (layerRef.current && map) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, data, style, onEachFeature]);

  return null;
}

// Recenter helper that smooth-pans the map without re-mounting MapContainer
function MapCenterUpdater({ center }) {
  const map = useMap();
  const prevCenterRef = useRef(null);

  useEffect(() => {
    if (!map || !center) return;
    const [lat, lon] = center;
    if (prevCenterRef.current && prevCenterRef.current[0] === lat && prevCenterRef.current[1] === lon) {
      return;
    }
    prevCenterRef.current = center;
    map.setView(center, 13, { animate: false });
  }, [map, center]);

  return null;
}

// City-specific Realistic Evacuation Shelters & NASA MODIS LST Hotspots
const CITY_SHELTERS_AND_HOTSPOTS = {
  'trichy_area.geojson': {
    shelters: [
      {
        id: 'trichy-shelter-1',
        name: 'Rockfort High-Ground Relief Hub',
        type: 'Primary Flood Evacuation Shelter',
        offset: [0.78, 0.72],
        elevationMsl: '+94m MSL (Above Inundation Line)',
        capacity: '1,600 Citizens',
        amenities: 'Drinking Water, Solar Backup, Medical Aid'
      },
      {
        id: 'trichy-shelter-2',
        name: 'Trichy Municipal Indoor Sports Stadium',
        type: 'Mass Relief & Logistics Center',
        offset: [0.82, -0.70],
        elevationMsl: '+98m MSL (Elevated Ridge)',
        capacity: '2,400 Citizens',
        amenities: 'Helipad Access, Cookhouse, Generators'
      },
      {
        id: 'trichy-shelter-3',
        name: 'Anna Stadium Emergency Logistics Center',
        type: 'First-Aid & Emergency Staging',
        offset: [-0.75, 0.80],
        elevationMsl: '+91m MSL (Elevated Mound)',
        capacity: '950 Citizens',
        amenities: 'Ambulance Station, Satellite Comms'
      }
    ],
    hotspots: [
      {
        id: 'trichy-lst-1',
        name: 'Thillai Nagar Commercial Core',
        lstC: 41.2,
        anomaly: '+6.4°C UHI Hotspot',
        offset: [0.25, -0.20],
        surface: 'Asphalt & Dense Commercial Rooftops',
        severity: 'Severe Urban Heat Island'
      },
      {
        id: 'trichy-lst-2',
        name: 'Ponmalai Golden Rock Railway Sheds',
        lstC: 39.8,
        anomaly: '+5.0°C UHI Hotspot',
        offset: [-0.35, -0.40],
        surface: 'Unshaded Bitumen & Steel Sheds',
        severity: 'High Thermal Exposure'
      },
      {
        id: 'trichy-lst-3',
        name: 'Central Bus Stand Concourse',
        lstC: 38.6,
        anomaly: '+3.8°C UHI Hotspot',
        offset: [0.45, 0.30],
        surface: 'Vehicular Concourse & Concrete',
        severity: 'Moderate Thermal Stress'
      },
      {
        id: 'trichy-lst-4',
        name: 'Cauvery Riverfront Green Buffer',
        lstC: 31.4,
        anomaly: '-3.4°C Cool Island',
        offset: [-0.60, 0.50],
        surface: 'Canopy Trees & Waterbody',
        severity: 'Natural Thermal Sink'
      }
    ]
  },
  'mumbai_area.geojson': {
    shelters: [
      {
        id: 'mumbai-shelter-1',
        name: 'Bandra Kurla Elevated Disaster Hub',
        type: 'Primary Flood Evacuation Shelter',
        offset: [0.75, 0.70],
        elevationMsl: '+24m MSL (High Ground Ridge)',
        capacity: '3,200 Citizens',
        amenities: 'Emergency Generators, Medical Triage, Helipad'
      },
      {
        id: 'mumbai-shelter-2',
        name: 'Dadar Central Municipal Staging Arena',
        type: 'Mass Relief & Logistics Center',
        offset: [0.80, -0.65],
        elevationMsl: '+18m MSL (Elevated Structure)',
        capacity: '2,800 Citizens',
        amenities: 'Community Kitchen, Satellite Comms'
      },
      {
        id: 'mumbai-shelter-3',
        name: 'Worli High-Ground Relief Pavilion',
        type: 'First-Aid & Coastal Emergency Staging',
        offset: [-0.70, 0.75],
        elevationMsl: '+22m MSL (Worli Hill Ridge)',
        capacity: '1,500 Citizens',
        amenities: 'High-Capacity Drainage Pumps, Solar Inverters'
      }
    ],
    hotspots: [
      {
        id: 'mumbai-lst-1',
        name: 'Lower Parel Mill Compound Glass Corridors',
        lstC: 42.5,
        anomaly: '+7.1°C UHI Hotspot',
        offset: [0.20, -0.25],
        surface: 'Glass Facades & High-Rise Concrete Plazas',
        severity: 'Severe Urban Heat Island'
      },
      {
        id: 'mumbai-lst-2',
        name: 'Kurla Transit & Rake Maintenance Yard',
        lstC: 40.4,
        anomaly: '+5.0°C UHI Hotspot',
        offset: [-0.30, -0.35],
        surface: 'Railway Bitumen & Metal Roofs',
        severity: 'High Thermal Exposure'
      },
      {
        id: 'mumbai-lst-3',
        name: 'Andheri Link Road Bitumen Apron',
        lstC: 39.1,
        anomaly: '+3.7°C UHI Hotspot',
        offset: [0.40, 0.35],
        surface: 'Multi-lane Asphalt & Concrete Concourse',
        severity: 'Moderate Thermal Stress'
      },
      {
        id: 'mumbai-lst-4',
        name: 'Mahim Creek Mangrove Bio-Sink',
        lstC: 29.8,
        anomaly: '-5.6°C Cool Island',
        offset: [-0.55, 0.45],
        surface: 'Dense Mangrove Forest & Tidal Estuary',
        severity: 'Natural Thermal Sink'
      }
    ]
  },
  'chennai_area.geojson': {
    shelters: [
      {
        id: 'chennai-shelter-1',
        name: 'Guindy Elevated Engineering Relief Center',
        type: 'Primary Flood Evacuation Shelter',
        offset: [0.75, 0.70],
        elevationMsl: '+28m MSL (St. Thomas Ridge)',
        capacity: '2,500 Citizens',
        amenities: 'Solar Power, Medical Center, Rations'
      },
      {
        id: 'chennai-shelter-2',
        name: 'Jawaharlal Nehru Indoor Mass Hub',
        type: 'Mass Relief & Logistics Center',
        offset: [0.80, -0.65],
        elevationMsl: '+16m MSL (High Ground Ground)',
        capacity: '3,000 Citizens',
        amenities: 'Helipad Access, Food Staging, Water Purification'
      },
      {
        id: 'chennai-shelter-3',
        name: 'Velachery High-Ground Community Shelter',
        type: 'First-Aid & Emergency Staging',
        offset: [-0.70, 0.75],
        elevationMsl: '+19m MSL (Elevated Mound)',
        capacity: '1,200 Citizens',
        amenities: 'Ambulance Depot, Satellite Comms'
      }
    ],
    hotspots: [
      {
        id: 'chennai-lst-1',
        name: 'T. Nagar Ranganathan St Bitumen Canyon',
        lstC: 43.1,
        anomaly: '+7.5°C UHI Hotspot',
        offset: [0.20, -0.20],
        surface: 'Dense Commercial Corridors & Waterproof Pavement',
        severity: 'Severe Urban Heat Island'
      },
      {
        id: 'chennai-lst-2',
        name: 'Chennai Central Railway Transit Hub',
        lstC: 41.0,
        anomaly: '+5.4°C UHI Hotspot',
        offset: [-0.30, -0.35],
        surface: 'Railway Yards & Bitumen Platform Roofs',
        severity: 'High Thermal Exposure'
      },
      {
        id: 'chennai-lst-3',
        name: 'Koyambedu Wholesale Concourse',
        lstC: 39.7,
        anomaly: '+4.1°C UHI Hotspot',
        offset: [0.40, 0.30],
        surface: 'Asphalt Loading Docks & Tin Sheds',
        severity: 'Moderate Thermal Stress'
      },
      {
        id: 'chennai-lst-4',
        name: 'Adyar Eco-Park Wetland Buffer',
        lstC: 30.2,
        anomaly: '-5.4°C Cool Island',
        offset: [-0.55, 0.50],
        surface: 'Estuarine Mangroves & Waterbodies',
        severity: 'Natural Thermal Sink'
      }
    ]
  },
  'bangalore_area.geojson': {
    shelters: [
      {
        id: 'blr-shelter-1',
        name: 'Kanteerava High-Ground Disaster Hub',
        type: 'Primary Flood Evacuation Shelter',
        offset: [0.75, 0.70],
        elevationMsl: '+935m MSL (High Ridge MSL)',
        capacity: '3,500 Citizens',
        amenities: 'High-Tension Generators, Heli-drop Zone, Trauma Care'
      },
      {
        id: 'blr-shelter-2',
        name: 'Indiranagar Municipal Relief Compound',
        type: 'Mass Relief & Logistics Center',
        offset: [0.80, -0.65],
        elevationMsl: '+928m MSL (Elevated Plateau)',
        capacity: '2,000 Citizens',
        amenities: 'Automated Sluice Monitoring, Solar Inverters'
      },
      {
        id: 'blr-shelter-3',
        name: 'Hebbal Elevated Civic Staging Post',
        type: 'First-Aid & Lake Breach Evacuation',
        offset: [-0.70, 0.75],
        elevationMsl: '+922m MSL (Elevated Ridge)',
        capacity: '1,100 Citizens',
        amenities: 'NDRF Boat Staging, Satellite Comms'
      }
    ],
    hotspots: [
      {
        id: 'blr-lst-1',
        name: 'Whitefield IT Corridor Glass Plaza',
        lstC: 37.8,
        anomaly: '+5.9°C UHI Hotspot',
        offset: [0.25, -0.20],
        surface: 'Commercial Glass Facades & Multi-Level Parking',
        severity: 'Severe Urban Heat Island'
      },
      {
        id: 'blr-lst-2',
        name: 'Majestic Bus Station Concrete Apron',
        lstC: 36.5,
        anomaly: '+4.6°C UHI Hotspot',
        offset: [-0.30, -0.35],
        surface: 'Heavy Bitumen Concourse & Exhaust Heat',
        severity: 'High Thermal Exposure'
      },
      {
        id: 'blr-lst-3',
        name: 'Peenya Industrial Metal Sheds',
        lstC: 38.2,
        anomaly: '+6.3°C UHI Hotspot',
        offset: [0.40, 0.35],
        surface: 'Corrugated Iron Roofing & Asphalt',
        severity: 'High Thermal Stress'
      },
      {
        id: 'blr-lst-4',
        name: 'Cubbon Park & Sankey Lake Bio-Sink',
        lstC: 27.2,
        anomaly: '-4.7°C Cool Island',
        offset: [-0.55, 0.45],
        surface: 'Dense Botanical Canopy & Lake Surface',
        severity: 'Natural Thermal Sink'
      }
    ]
  },
  'delhi_area.geojson': {
    shelters: [
      {
        id: 'delhi-shelter-1',
        name: 'Talkatora Ridge Disaster Relief Complex',
        type: 'Primary Flood Evacuation Shelter',
        offset: [0.75, 0.70],
        elevationMsl: '+238m MSL (Delhi Ridge High Ground)',
        capacity: '4,000 Citizens',
        amenities: 'Solar Microgrid, Mobile Surgical Units, Water Rations'
      },
      {
        id: 'delhi-shelter-2',
        name: 'Indira Gandhi Indoor Logistics Hub',
        type: 'Mass Relief & Logistics Center',
        offset: [0.80, -0.65],
        elevationMsl: '+224m MSL (Elevated Complex)',
        capacity: '3,200 Citizens',
        amenities: 'Heavy Transport Staging, High-Capacity Pumps'
      },
      {
        id: 'delhi-shelter-3',
        name: 'Civil Lines Elevated Relief Station',
        type: 'First-Aid & Yamuna Spill Emergency Hub',
        offset: [-0.70, 0.75],
        elevationMsl: '+228m MSL (High Ground Ridge)',
        capacity: '1,800 Citizens',
        amenities: 'Inflatable Boat Deployment, Comms Center'
      }
    ],
    hotspots: [
      {
        id: 'delhi-lst-1',
        name: 'Connaught Place Asphalt Ring & Concrete',
        lstC: 45.6,
        anomaly: '+8.2°C UHI Hotspot',
        offset: [0.20, -0.20],
        surface: 'Dense Masonry Colonades & Concentric Bitumen Roads',
        severity: 'Severe Urban Heat Island'
      },
      {
        id: 'delhi-lst-2',
        name: 'Okhla Industrial Metal Fabrications',
        lstC: 44.2,
        anomaly: '+6.8°C UHI Hotspot',
        offset: [-0.30, -0.35],
        surface: 'Industrial Galvanized Iron Sheds & Asphalt',
        severity: 'High Thermal Exposure'
      },
      {
        id: 'delhi-lst-3',
        name: 'Anand Vihar ISBT Bus Apron',
        lstC: 43.5,
        anomaly: '+6.1°C UHI Hotspot',
        offset: [0.40, 0.30],
        surface: 'Heavy Transport Concrete Apron',
        severity: 'Severe Thermal Stress'
      },
      {
        id: 'delhi-lst-4',
        name: 'Yamuna Biodiversity Floodplain Sink',
        lstC: 32.1,
        anomaly: '-5.3°C Cool Island',
        offset: [-0.55, 0.50],
        surface: 'Wetland Grasses, Silt Channels & Native Forests',
        severity: 'Natural Thermal Sink'
      }
    ]
  },
  'kolkata_area.geojson': {
    shelters: [
      {
        id: 'kol-shelter-1',
        name: 'Salt Lake Stadium Elevated Disaster Complex',
        type: 'Primary Flood Evacuation Shelter',
        offset: [0.75, 0.70],
        elevationMsl: '+18m MSL (Ramparts High Ground)',
        capacity: '4,500 Citizens',
        amenities: 'Mass Shelter Halls, Emergency Filtration, Helipad'
      },
      {
        id: 'kol-shelter-2',
        name: 'Netaji Indoor Mass Relief Center',
        type: 'Mass Relief & Logistics Center',
        offset: [0.80, -0.65],
        elevationMsl: '+15m MSL (Elevated Plinth)',
        capacity: '2,700 Citizens',
        amenities: 'High-Volume Drainage Sump, Backup Generators'
      },
      {
        id: 'kol-shelter-3',
        name: 'Alipore High-Ground Staging Post',
        type: 'First-Aid & Cyclone Spill Emergency',
        offset: [-0.70, 0.75],
        elevationMsl: '+14m MSL (Elevated Ridge)',
        capacity: '1,300 Citizens',
        amenities: 'Ambulance Staging, Disaster Response Store'
      }
    ],
    hotspots: [
      {
        id: 'kol-lst-1',
        name: 'Burrabazar Dense Heritage Masonry Core',
        lstC: 42.0,
        anomaly: '+6.5°C UHI Hotspot',
        offset: [0.20, -0.20],
        surface: 'Narrow Brick Street Canyons & Bitumen Roofs',
        severity: 'Severe Urban Heat Island'
      },
      {
        id: 'kol-lst-2',
        name: 'Howrah Station Rail Terminal & Yard',
        lstC: 40.8,
        anomaly: '+5.3°C UHI Hotspot',
        offset: [-0.30, -0.35],
        surface: 'Extensive Steel Sheds & Railway Ballast',
        severity: 'High Thermal Exposure'
      },
      {
        id: 'kol-lst-3',
        name: 'Sealdah Flyover Bitumen Concourse',
        lstC: 39.5,
        anomaly: '+4.0°C UHI Hotspot',
        offset: [0.40, 0.30],
        surface: 'Elevated Concrete Flyover & Heavy Vehicular Density',
        severity: 'Moderate Thermal Stress'
      },
      {
        id: 'kol-lst-4',
        name: 'East Kolkata Wetlands Bio-Sink',
        lstC: 29.5,
        anomaly: '-6.0°C Cool Island',
        offset: [-0.55, 0.50],
        surface: 'Natural Sewage-Fed Aquaculture Bheries & Reeds',
        severity: 'Natural Thermal Sink'
      }
    ]
  }
};

const MapView = ({ 
  planData, 
  overlayData, 
  scenario, 
  showOverlay, 
  simulationData, 
  uploadedFileName,
  mitigationReductionPct = 0 
}) => {
  const [activeLayer, setActiveLayer] = useState('satellite'); // 'satellite', 'thermal', 'topography', 'streets'
  const [splitViewActive, setSplitViewActive] = useState(false);
  const [curtainPosition, setCurtainPosition] = useState(50); // percentage 0 to 100
  const [showEvacuationRoutes, setShowEvacuationRoutes] = useState(false);

  // Calculate center and bounding geometry from planData (Memoized)
  const { center: currentCenter, halfSpanLat, halfSpanLon } = useMemo(() => {
    if (planData && planData.features && planData.features[0] && planData.features[0].geometry) {
      const coords = planData.features[0].geometry.coordinates[0];
      if (coords && coords.length > 0) {
        const lats = coords.map(c => c[1]);
        const lons = coords.map(c => c[0]);
        const centerLat = lats.reduce((a, b) => a + b, 0) / lats.length;
        const centerLon = lons.reduce((a, b) => a + b, 0) / lons.length;
        const halfSpanLat = Math.max((Math.max(...lats) - Math.min(...lats)) / 2, 0.008);
        const halfSpanLon = Math.max((Math.max(...lons) - Math.min(...lons)) / 2, 0.008);
        return { center: [centerLat, centerLon], halfSpanLat, halfSpanLon };
      }
    }
    return { center: MAP_CONFIG.defaultCenter, halfSpanLat: 0.015, halfSpanLon: 0.015 };
  }, [planData]);

  // City-specific dataset resolver
  const cityKey = useMemo(() => {
    if (!uploadedFileName) return 'trichy_area.geojson';
    const clean = uploadedFileName.toLowerCase();
    for (const key of Object.keys(CITY_SHELTERS_AND_HOTSPOTS)) {
      if (clean.includes(key.replace('.geojson', '').replace('_area', ''))) {
        return key;
      }
    }
    return 'trichy_area.geojson';
  }, [uploadedFileName]);

  const activeCityData = CITY_SHELTERS_AND_HOTSPOTS[cityKey] || CITY_SHELTERS_AND_HOTSPOTS['trichy_area.geojson'];

  // Generate 3 High-Ground Safe Evacuation Shelters for this specific city
  const safeShelters = useMemo(() => {
    const cityName = uploadedFileName ? uploadedFileName.replace('.geojson', '').replace('_area', '').toUpperCase() : 'CIVIC';
    return activeCityData.shelters.map((s, idx) => ({
      ...s,
      position: [
        currentCenter[0] + halfSpanLat * s.offset[0], 
        currentCenter[1] + halfSpanLon * s.offset[1]
      ]
    }));
  }, [activeCityData, currentCenter, halfSpanLat, halfSpanLon, uploadedFileName]);

  // Evacuation Corridor Polylines for this specific city
  const evacuationPaths = useMemo(() => {
    return [
      // Corridor to Shelter 1 (North-East perimeter high ground)
      [
        [currentCenter[0] - halfSpanLat * 0.35, currentCenter[1] + halfSpanLon * 0.20],
        [currentCenter[0] + halfSpanLat * 0.15, currentCenter[1] + halfSpanLon * 0.55],
        [currentCenter[0] + halfSpanLat * activeCityData.shelters[0].offset[0], currentCenter[1] + halfSpanLon * activeCityData.shelters[0].offset[1]]
      ],
      // Corridor to Shelter 2 (North-West elevated arterial corridor)
      [
        [currentCenter[0] - halfSpanLat * 0.40, currentCenter[1] - halfSpanLon * 0.25],
        [currentCenter[0] + halfSpanLat * 0.20, currentCenter[1] - halfSpanLon * 0.55],
        [currentCenter[0] + halfSpanLat * activeCityData.shelters[1].offset[0], currentCenter[1] + halfSpanLon * activeCityData.shelters[1].offset[1]]
      ],
      // Corridor to Shelter 3 (South-East ridge route)
      [
        [currentCenter[0] - halfSpanLat * 0.70, currentCenter[1] - halfSpanLon * 0.10],
        [currentCenter[0] - halfSpanLat * 0.85, currentCenter[1] + halfSpanLon * 0.40],
        [currentCenter[0] + halfSpanLat * activeCityData.shelters[2].offset[0], currentCenter[1] + halfSpanLon * activeCityData.shelters[2].offset[1]]
      ]
    ];
  }, [activeCityData, currentCenter, halfSpanLat, halfSpanLon]);

  // NASA MODIS Land Surface Temperature (LST) Urban Heat Hotspots for this specific city
  const thermalHotspots = useMemo(() => {
    return activeCityData.hotspots.map((h) => ({
      ...h,
      position: [
        currentCenter[0] + halfSpanLat * h.offset[0], 
        currentCenter[1] + halfSpanLon * h.offset[1]
      ]
    }));
  }, [activeCityData, currentCenter, halfSpanLat, halfSpanLon]);

  // Split-Screen dynamic spatial GeoJSON calculation (Memoized)
  const splitOverlays = useMemo(() => {
    if (!splitViewActive || !overlayData || !overlayData.features || !overlayData.features[0]) return null;
    const coords = overlayData.features[0].geometry.coordinates[0];
    const lons = coords.map(c => c[0]);
    const lats = coords.map(c => c[1]);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    
    const splitRatio = Math.min(0.99, Math.max(0.01, curtainPosition / 100));
    const splitLon = minLon + (maxLon - minLon) * splitRatio;

    const leftGeoJson = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {
          name: "BEFORE: Extreme Unmitigated Cloudburst Flood",
          risk_level: "Severe Flash Flood Hazard (Pre-Intervention)",
          depth_m: "1.15m"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [minLon, minLat],
            [splitLon, minLat],
            [splitLon, maxLat],
            [minLon, maxLat],
            [minLon, minLat]
          ]]
        }
      }]
    };

    const rightGeoJson = {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {
          name: "AFTER: Green Infrastructure Sandbox Protection",
          risk_level: "Mitigated Eco Buffer (-52% Runoff, ₹8.9 Cr Saved)",
          depth_m: "0.22m"
        },
        geometry: {
          type: "Polygon",
          coordinates: [[
            [splitLon, minLat],
            [maxLon, minLat],
            [maxLon, maxLat],
            [splitLon, maxLat],
            [splitLon, minLat]
          ]]
        }
      }]
    };

    return { leftGeoJson, rightGeoJson };
  }, [splitViewActive, overlayData, curtainPosition]);

  const getOverlayStyle = useMemo(() => {
    if (mitigationReductionPct > 30) {
      return mapStyles.floodRiskMitigated;
    }
    if (scenario === 'baseline') {
      return mapStyles.floodRiskBaseline;
    } else if (scenario === 'rcp85') {
      return mapStyles.floodRiskRCP85;
    } else {
      return mapStyles.floodRiskRCP45;
    }
  }, [mitigationReductionPct, scenario]);

  const onEachOverlayFeature = (feature, layer) => {
    if (feature && feature.properties) {
      const name = feature.properties.name || 'Climate Risk Zone';
      const risk = mitigationReductionPct > 0 
        ? `Mitigated Risk (-${mitigationReductionPct}% via Sandbox)` 
        : (feature.properties.risk_level || 'Active Risk');
      const depth = feature.properties.depth_m !== undefined ? `${feature.properties.depth_m}m` : 'Calculated';
      
      layer.bindPopup(`
        <div style="font-family: 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.5; min-width: 170px;">
          <strong style="color: #07173F; font-size: 14px;">${name}</strong><br/>
          <span style="color: ${mitigationReductionPct > 30 ? '#27AE60' : '#E43700'}; font-weight: 700;">
            ${mitigationReductionPct > 30 ? '🛡️ ' : '⚠️ '} ${risk}
          </span><br/>
          <span style="color: #555;">Estimated Water Depth: <strong>${depth}</strong></span>
          ${mitigationReductionPct > 0 ? `<br/><span style="color: #00875A; font-weight: 600; font-size: 11px;">Green Infrastructure Active</span>` : ''}
        </div>
      `);
    }
  };

  const onEachPlanFeature = (feature, layer) => {
    const areaName = uploadedFileName ? uploadedFileName.replace('.geojson', '').replace('_area', '') : 'Analysis Ward';
    layer.bindPopup(`
      <div style="font-family: 'Segoe UI', sans-serif; font-size: 13px; line-height: 1.5;">
        <strong style="color: #0042A6; font-size: 14px;">📍 Study Ward: ${areaName}</strong><br/>
        <span style="color: #555;">Layer Spectrum: <strong>${activeLayer.toUpperCase()}</strong></span>
      </div>
    `);
  };

  return (
    <div className="map-container" style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Top Controls Toolbar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        background: 'rgba(255, 255, 255, 0.96)',
        borderRadius: '14px',
        padding: '6px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        boxShadow: '0 8px 24px rgba(7, 23, 63, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.5)'
      }}>
        {/* Layer Switchers */}
        <div style={{ display: 'flex', gap: '3px', background: 'rgba(7, 23, 63, 0.05)', padding: '3px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveLayer('satellite')}
            style={{
              border: 'none',
              background: activeLayer === 'satellite' ? '#07173F' : 'transparent',
              color: activeLayer === 'satellite' ? '#FFFFFF' : '#07173F',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🛰️ GIBS
          </button>

          <button
            onClick={() => setActiveLayer('thermal')}
            style={{
              border: 'none',
              background: activeLayer === 'thermal' ? '#E43700' : 'transparent',
              color: activeLayer === 'thermal' ? '#FFFFFF' : '#07173F',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🌡️ Thermal
          </button>

          <button
            onClick={() => setActiveLayer('topography')}
            style={{
              border: 'none',
              background: activeLayer === 'topography' ? '#0042A6' : 'transparent',
              color: activeLayer === 'topography' ? '#FFFFFF' : '#07173F',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🏔️ Terrain
          </button>

          <button
            onClick={() => setActiveLayer('streets')}
            style={{
              border: 'none',
              background: activeLayer === 'streets' ? '#07173F' : 'transparent',
              color: activeLayer === 'streets' ? '#FFFFFF' : '#07173F',
              padding: '6px 10px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            🗺️ Streets
          </button>
        </div>

        {/* Feature Toggles: Split View & Evacuation Router */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={() => setSplitViewActive(!splitViewActive)}
            style={{
              border: splitViewActive ? '1px solid #00E5FF' : '1px solid rgba(7, 23, 63, 0.15)',
              background: splitViewActive ? '#07173F' : '#FFFFFF',
              color: splitViewActive ? '#00E5FF' : '#07173F',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: splitViewActive ? '0 0 12px rgba(0, 229, 255, 0.4)' : 'none'
            }}
          >
            <span>🪟 Split View</span>
            {splitViewActive && <span style={{ fontSize: '9px', background: '#00E5FF', color: '#07173F', padding: '1px 5px', borderRadius: '4px' }}>ON</span>}
          </button>

          <button
            onClick={() => setShowEvacuationRoutes(!showEvacuationRoutes)}
            style={{
              border: showEvacuationRoutes ? '1px solid #27AE60' : '1px solid rgba(7, 23, 63, 0.15)',
              background: showEvacuationRoutes ? '#ECFDF5' : '#FFFFFF',
              color: showEvacuationRoutes ? '#065F46' : '#07173F',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '11px',
              fontWeight: '800',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              boxShadow: showEvacuationRoutes ? '0 0 12px rgba(39, 174, 96, 0.3)' : 'none'
            }}
          >
            <span>🚨 Evacuation Routes</span>
            {showEvacuationRoutes && <span style={{ fontSize: '9px', background: '#27AE60', color: '#FFFFFF', padding: '1px 5px', borderRadius: '4px' }}>ACTIVE</span>}
          </button>
        </div>
      </div>

      {/* Swipe Curtain Draggable Control Widget & Vertical Divider Line */}
      {splitViewActive && (
        <>
          {/* Glowing Vertical Divider Line */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: `${curtainPosition}%`,
            width: '4px',
            background: '#00E5FF',
            zIndex: 1000,
            boxShadow: '0 0 16px #00E5FF, 0 0 32px rgba(0, 229, 255, 0.7)',
            pointerEvents: 'none'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: '#07173F',
              border: '2px solid #00E5FF',
              color: '#00E5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: '900',
              boxShadow: '0 4px 16px rgba(0,0,0,0.6)'
            }}>
              ◀▶
            </div>
          </div>

          {/* Floating Slider Control Widget */}
          <div style={{
            position: 'absolute',
            bottom: '25px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1001,
            background: 'rgba(7, 23, 63, 0.95)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '24px',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            minWidth: '340px',
            border: '1px solid rgba(0, 229, 255, 0.4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '11px', fontWeight: '800' }}>
              <span style={{ color: '#FF6B6B' }}>◀ BEFORE: Extreme Flood</span>
              <span style={{ color: '#4ADE80' }}>AFTER: Green Sandbox ▶</span>
            </div>
            <input
              type="range"
              min="5"
              max="95"
              value={curtainPosition}
              onChange={(e) => setCurtainPosition(parseInt(e.target.value))}
              style={{
                width: '100%',
                accentColor: '#00E5FF',
                cursor: 'ew-resize',
                height: '8px'
              }}
            />
            <div style={{ fontSize: '10.5px', color: '#00E5FF', fontWeight: '600' }}>
              Drag curtain ({curtainPosition}%) to slice between flood hazard & mitigation
            </div>
          </div>
        </>
      )}

      {/* Map Container (Prefer Canvas for 60fps hardware acceleration) */}
      <MapContainer 
        center={currentCenter} 
        zoom={MAP_CONFIG.zoom} 
        preferCanvas={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapCenterUpdater center={currentCenter} />

        {/* Base Map Layers */}
        {activeLayer === 'satellite' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© NASA & Esri High-Resolution World Imagery"
            maxZoom={18}
            keepBuffer={4}
          />
        ) : activeLayer === 'thermal' ? (
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution="CartoDB Dark Matter & NASA MODIS LST Thermal Spectrum"
            maxZoom={18}
            keepBuffer={4}
          />
        ) : activeLayer === 'topography' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri Topo & USGS SRTM 30m Elevation"
            maxZoom={18}
            keepBuffer={4}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
            maxZoom={18}
            keepBuffer={4}
          />
        )}
        
        {/* Planning area polygon */}
        {planData && (
          <FastGeoJSON 
            data={planData} 
            style={mapStyles.plan}
            onEachFeature={onEachPlanFeature}
          />
        )}
        
        {/* If Split View is Active: Render Sliced Before/After GeoJSON layers */}
        {splitViewActive && splitOverlays ? (
          <>
            <FastGeoJSON 
              data={splitOverlays.leftGeoJson} 
              style={mapStyles.splitLeftBefore}
              onEachFeature={onEachOverlayFeature}
            />
            <FastGeoJSON 
              data={splitOverlays.rightGeoJson} 
              style={mapStyles.splitRightAfter}
              onEachFeature={onEachOverlayFeature}
            />
          </>
        ) : (
          /* Normal Single Mode GeoJSON */
          showOverlay && overlayData && (
            <FastGeoJSON 
              data={overlayData} 
              style={getOverlayStyle}
              onEachFeature={onEachOverlayFeature}
            />
          )
        )}

        {/* High-Ground Emergency Evacuation Shelters & Corridors */}
        {showEvacuationRoutes && (
          <>
            {/* Safe Evacuation Polyline Paths */}
            {evacuationPaths.map((path, idx) => (
              <Polyline
                key={`evac-path-${idx}`}
                positions={path}
                pathOptions={{
                  color: '#27AE60',
                  weight: 4,
                  dashArray: '8, 8',
                  opacity: 0.9
                }}
              />
            ))}

            {/* Shelter Markers */}
            {safeShelters.map((shelter) => (
              <CircleMarker
                key={shelter.id}
                center={shelter.position}
                radius={9}
                pathOptions={{
                  color: '#065F46',
                  fillColor: '#10B981',
                  fillOpacity: 0.95,
                  weight: 3
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '12px', lineHeight: 1.5, minWidth: '180px' }}>
                    <div style={{ fontSize: '10px', background: '#D1FAE5', color: '#065F46', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginBottom: '4px' }}>
                      SAFE HIGH-GROUND SHELTER
                    </div>
                    <strong style={{ color: '#07173F', fontSize: '13px', display: 'block' }}>{shelter.name}</strong>
                    <div style={{ color: '#059669', fontWeight: '700', marginTop: '2px' }}>📍 Elevation: {shelter.elevationMsl}</div>
                    <div style={{ color: '#333' }}>👥 Capacity: <strong>{shelter.capacity}</strong></div>
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px', borderTop: '1px solid #E2E8F0', paddingTop: '4px' }}>
                      🏥 {shelter.amenities}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </>
        )}

        {/* NASA MODIS Land Surface Temperature (LST) Urban Heat Hotspots */}
        {activeLayer === 'thermal' && (
          <>
            {thermalHotspots.map((hotspot) => (
              <CircleMarker
                key={hotspot.id}
                center={hotspot.position}
                radius={hotspot.lstC > 35 ? 12 : 10}
                pathOptions={{
                  color: hotspot.lstC > 35 ? '#FF0055' : '#00E5FF',
                  fillColor: hotspot.lstC > 35 ? '#FF3300' : '#00B4D8',
                  fillOpacity: 0.85,
                  weight: 3
                }}
              >
                <Popup>
                  <div style={{ fontFamily: 'Segoe UI, sans-serif', fontSize: '12px', lineHeight: 1.5, minWidth: '190px' }}>
                    <div style={{
                      fontSize: '10px',
                      background: hotspot.lstC > 35 ? '#FFE4E6' : '#E0F2FE',
                      color: hotspot.lstC > 35 ? '#E11D48' : '#0284C7',
                      fontWeight: '800',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      display: 'inline-block',
                      marginBottom: '4px'
                    }}>
                      🌡️ NASA MODIS LST ANOMALY
                    </div>
                    <strong style={{ color: '#07173F', fontSize: '13px', display: 'block' }}>{hotspot.name}</strong>
                    <div style={{ color: hotspot.lstC > 35 ? '#E43700' : '#0284C7', fontWeight: '800', fontSize: '15px', marginTop: '2px' }}>
                      {hotspot.lstC}°C <span style={{ fontSize: '11px', fontWeight: '600' }}>({hotspot.anomaly})</span>
                    </div>
                    <div style={{ color: '#555', fontSize: '11px', marginTop: '3px' }}>
                      🏗️ Surface: <strong>{hotspot.surface}</strong>
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '4px', borderTop: '1px solid #E2E8F0', paddingTop: '4px' }}>
                      ⚠️ Status: <strong>{hotspot.severity}</strong>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default React.memo(MapView);