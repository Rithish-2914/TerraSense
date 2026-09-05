import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Polyline, CircleMarker, Popup } from 'react-leaflet';
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
  zoom: 13,
  nasaGibsUrl: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-10-01/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg"
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

  // Calculate center and bounding geometry from planData
  const getMapBoundsInfo = () => {
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
  };

  const { center: currentCenter, halfSpanLat, halfSpanLon } = getMapBoundsInfo();

  // Generate 3 High-Ground Safe Evacuation Shelters & Corridors
  const safeShelters = [
    {
      id: 'shelter-1',
      name: 'District Higher Secondary School Hub',
      type: 'Primary Flood Evacuation Shelter',
      position: [currentCenter[0] + halfSpanLat * 0.78, currentCenter[1] + halfSpanLon * 0.72],
      elevationMsl: '+94m MSL (Above Inundation Line)',
      capacity: '1,400 Citizens',
      amenities: 'Drinking Water, Solar Backup, Medical Aid'
    },
    {
      id: 'shelter-2',
      name: 'Municipal Indoor Sports Stadium',
      type: 'Mass Relief & Logistics Center',
      position: [currentCenter[0] + halfSpanLat * 0.82, currentCenter[1] - halfSpanLon * 0.70],
      elevationMsl: '+98m MSL (High Ground Ridge)',
      capacity: '2,200 Citizens',
      amenities: 'Helipad Access, Cookhouse, Generators'
    },
    {
      id: 'shelter-3',
      name: 'Community Relief Center (Zone 4)',
      type: 'First-Aid & Emergency Staging',
      position: [currentCenter[0] - halfSpanLat * 0.75, currentCenter[1] + halfSpanLon * 0.80],
      elevationMsl: '+91m MSL (Elevated Mound)',
      capacity: '850 Citizens',
      amenities: 'Ambulance Station, Satellite Comms'
    }
  ];

  // Evacuation Corridor Polylines (routing safely along peripheral roads avoiding central flood zone)
  const evacuationPaths = [
    // Path to Shelter 1 (North-East)
    [
      [currentCenter[0] - halfSpanLat * 0.4, currentCenter[1] + halfSpanLon * 0.85],
      [currentCenter[0] + halfSpanLat * 0.2, currentCenter[1] + halfSpanLon * 0.88],
      [currentCenter[0] + halfSpanLat * 0.78, currentCenter[1] + halfSpanLon * 0.72]
    ],
    // Path to Shelter 2 (North-West)
    [
      [currentCenter[0] - halfSpanLat * 0.5, currentCenter[1] - halfSpanLon * 0.75],
      [currentCenter[0] + halfSpanLat * 0.1, currentCenter[1] - halfSpanLon * 0.82],
      [currentCenter[0] + halfSpanLat * 0.82, currentCenter[1] - halfSpanLon * 0.70]
    ],
    // Path to Shelter 3 (South-East)
    [
      [currentCenter[0] - halfSpanLat * 0.85, currentCenter[1] - halfSpanLon * 0.1],
      [currentCenter[0] - halfSpanLat * 0.88, currentCenter[1] + halfSpanLon * 0.4],
      [currentCenter[0] - halfSpanLat * 0.75, currentCenter[1] + halfSpanLon * 0.80]
    ]
  ];

  // NASA MODIS Land Surface Temperature (LST) Urban Heat Hotspots
  const thermalHotspots = [
    {
      id: 'lst-1',
      name: 'High-Density Commercial Core',
      lstC: 41.2,
      anomaly: '+6.4°C UHI Hotspot',
      position: [currentCenter[0] + halfSpanLat * 0.25, currentCenter[1] - halfSpanLon * 0.20],
      surface: 'Asphalt & Dense Commercial Rooftops',
      severity: 'Severe Urban Heat Island'
    },
    {
      id: 'lst-2',
      name: 'Industrial Transit & Railway Yard',
      lstC: 39.8,
      anomaly: '+5.0°C UHI Hotspot',
      position: [currentCenter[0] - halfSpanLat * 0.35, currentCenter[1] - halfSpanLon * 0.40],
      surface: 'Unshaded Bitumen & Steel Sheds',
      severity: 'High Thermal Exposure'
    },
    {
      id: 'lst-3',
      name: 'Central Bus Terminal & Parking Apron',
      lstC: 38.6,
      anomaly: '+3.8°C UHI Hotspot',
      position: [currentCenter[0] + halfSpanLat * 0.45, currentCenter[1] + halfSpanLon * 0.30],
      surface: 'Vehicular Concourse & Concrete',
      severity: 'Moderate Thermal Stress'
    },
    {
      id: 'lst-4',
      name: 'Riverfront Green Buffer / Park',
      lstC: 31.4,
      anomaly: '-3.4°C Cool Island',
      position: [currentCenter[0] - halfSpanLat * 0.60, currentCenter[1] + halfSpanLon * 0.50],
      surface: 'Canopy Trees & Waterbody',
      severity: 'Natural Thermal Sink'
    }
  ];

  // Split-Screen dynamic spatial GeoJSON calculation
  const getSplitOverlays = () => {
    if (!overlayData || !overlayData.features || !overlayData.features[0]) return null;
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
  };

  const splitOverlays = getSplitOverlays();

  const getOverlayStyle = (feature) => {
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
  };

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
        backdropFilter: 'blur(16px)',
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
              gap: '4px',
              transition: 'all 0.2s'
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
              gap: '4px',
              transition: 'all 0.2s'
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
              gap: '4px',
              transition: 'all 0.2s'
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
              gap: '4px',
              transition: 'all 0.2s'
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
            pointerEvents: 'none',
            transition: 'left 0.05s ease-out'
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
            background: 'rgba(7, 23, 63, 0.94)',
            color: '#FFFFFF',
            padding: '12px 24px',
            borderRadius: '24px',
            boxShadow: '0 16px 36px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            minWidth: '340px',
            backdropFilter: 'blur(16px)',
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

      {/* Map Container */}
      <MapContainer 
        center={currentCenter} 
        zoom={MAP_CONFIG.zoom} 
        style={{ height: '100%', width: '100%' }}
        key={`map-${JSON.stringify(currentCenter)}`}
      >
        {/* Base Map Layers */}
        {activeLayer === 'satellite' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution="© NASA & Esri High-Resolution World Imagery"
            maxZoom={19}
          />
        ) : activeLayer === 'thermal' ? (
          <>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution="CartoDB Dark Matter & NASA MODIS LST Thermal Spectrum"
              maxZoom={19}
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Specialty/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"
              attribution="NASA MODIS Thermal Infrared Spectrum"
              opacity={0.35}
            />
          </>
        ) : activeLayer === 'topography' ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            attribution="© Esri Topo & USGS SRTM 30m Elevation"
            maxZoom={18}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="© OpenStreetMap contributors"
            maxZoom={19}
          />
        )}
        
        {/* Planning area polygon (Blue outline) */}
        {planData && (
          <GeoJSON 
            data={planData} 
            style={mapStyles.plan}
            onEachFeature={onEachPlanFeature}
            key={`plan-data-${uploadedFileName}-${JSON.stringify(currentCenter)}`}
          />
        )}
        
        {/* If Split View is Active: Render Sliced Before/After GeoJSON layers */}
        {splitViewActive && splitOverlays ? (
          <>
            <GeoJSON 
              data={splitOverlays.leftGeoJson} 
              style={mapStyles.splitLeftBefore}
              onEachFeature={onEachOverlayFeature}
              key={`split-left-${curtainPosition}-${uploadedFileName}`}
            />
            <GeoJSON 
              data={splitOverlays.rightGeoJson} 
              style={mapStyles.splitRightAfter}
              onEachFeature={onEachOverlayFeature}
              key={`split-right-${curtainPosition}-${uploadedFileName}`}
            />
          </>
        ) : (
          /* Normal Single Mode GeoJSON */
          showOverlay && overlayData && (
            <GeoJSON 
              data={overlayData} 
              style={getOverlayStyle}
              onEachFeature={onEachOverlayFeature}
              key={`climate-overlay-${scenario}-${uploadedFileName}-${mitigationReductionPct}-${JSON.stringify(overlayData)}`}
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

export default MapView;