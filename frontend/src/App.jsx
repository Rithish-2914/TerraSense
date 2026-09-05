import React, { useState, useEffect, useMemo, useCallback } from 'react';
import MapView from './components/MapView';
import FloatingPanel from './components/FloatingPanel';
import FloatingButton from './components/FloatingButton';
import IntroPopup from './components/IntroPopup';
import Toast from './components/Toast';
import MapLegend from './components/MapLegend';
import MultiCityBenchmarkModal from './components/MultiCityBenchmarkModal';
import EmergencyHotlineModal from './components/EmergencyHotlineModal';
import DPRReportModal from './components/DPRReportModal';

const CITY_GEOJSONS = {
  'trichy_area.geojson': {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Trichy Pilot Ward" },
      geometry: {
        type: "Polygon",
        coordinates: [[[78.6800, 10.7800], [78.7200, 10.7800], [78.7200, 10.8200], [78.6800, 10.8200], [78.6800, 10.7800]]]
      }
    }]
  },
  'mumbai_area.geojson': {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Mumbai Metropolis Ward" },
      geometry: {
        type: "Polygon",
        coordinates: [[[72.8200, 18.9600], [72.8700, 18.9600], [72.8700, 19.0200], [72.8200, 19.0200], [72.8200, 18.9600]]]
      }
    }]
  },
  'chennai_area.geojson': {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Chennai Coastal Ward" },
      geometry: {
        type: "Polygon",
        coordinates: [[[80.2400, 13.0000], [80.2900, 13.0000], [80.2900, 13.0600], [80.2400, 13.0600], [80.2400, 13.0000]]]
      }
    }]
  },
  'bangalore_area.geojson': {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Bangalore Lake Cascade" },
      geometry: {
        type: "Polygon",
        coordinates: [[[77.5800, 12.9200], [77.6400, 12.9200], [77.6400, 12.9800], [77.5800, 12.9800], [77.5800, 12.9200]]]
      }
    }]
  },
  'delhi_area.geojson': {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Delhi Yamuna Corridor" },
      geometry: {
        type: "Polygon",
        coordinates: [[[77.2000, 28.6000], [77.2600, 28.6000], [77.2600, 28.6600], [77.2000, 28.6600], [77.2000, 28.6000]]]
      }
    }]
  },
  'kolkata_area.geojson': {
    type: "FeatureCollection",
    features: [{
      type: "Feature",
      properties: { name: "Kolkata Delta Basin" },
      geometry: {
        type: "Polygon",
        coordinates: [[[88.3300, 22.5400], [88.3900, 22.5400], [88.3900, 22.6000], [88.3300, 22.6000], [88.3300, 22.5400]]]
      }
    }]
  }
};

function App() {
  const [scenario, setScenario] = useState(() => {
    return localStorage.getItem('scenario') || 'baseline';
  });
  const [simulationData, setSimulationData] = useState(() => {
    const saved = localStorage.getItem('simulationData');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved simulation data:', e);
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [simulationStep, setSimulationStep] = useState('');
  const [showOverlay, setShowOverlay] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(() => {
    return localStorage.getItem('uploadedFileName') || 'Default: Trichy Pilot Ward';
  });
  const [currentPlan, setCurrentPlan] = useState(() => {
    const saved = localStorage.getItem('currentPlan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved plan:', e);
      }
    }
    return {
      type: "FeatureCollection",
      features: [{
        type: "Feature",
        properties: {name: "Trichy Pilot Ward"},
        geometry: {
          type: "Polygon",
          coordinates: [[[78.68,10.78],[78.72,10.78],[78.72,10.82],[78.68,10.82],[78.68,10.78]]]
        }
      }]
    };
  });
  const [backendStatus, setBackendStatus] = useState('checking');
  const [earthEngineStatus, setEarthEngineStatus] = useState('unknown');
  const [toast, setToast] = useState(null);
  const [showIntroPopup, setShowIntroPopup] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [panelMinimized, setPanelMinimized] = useState(false);
  const [mitigationReductionPct, setMitigationReductionPct] = useState(0);
  const [stormIntensity, setStormIntensity] = useState(180);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isEmergencyHotlineOpen, setIsEmergencyHotlineOpen] = useState(false);
  const [isDPROpen, setIsDPROpen] = useState(false);
  
  // Check backend and Earth Engine status
  useEffect(() => {
    checkBackendStatus();
    const interval = setInterval(checkBackendStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const checkBackendStatus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/health');
      if (response.ok) {
        const data = await response.json();
        setBackendStatus('connected');
        setEarthEngineStatus(data.services.earth_engine ? 'connected' : 'needs_auth');
        
        // Auto-run baseline simulation if not already loaded
        if (!simulationData && currentPlan) {
          triggerAutoSimulation();
        }
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('offline');
    }
  };

  const triggerAutoSimulation = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          geometry: currentPlan.features[0].geometry,
          scenario: scenario
        })
      });
      if (response.ok) {
        const data = await response.json();
        setSimulationData(data);
        setShowOverlay(true);
      }
    } catch (e) {
      console.log('Auto simulation fallback ready:', e);
    }
  };

  const handleRunSimulation = async () => {
    setLoading(true);
    setSimulationStep('processing');
    
    try {
      const response = await fetch('http://localhost:5000/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geometry: currentPlan.features[0].geometry,
          scenario: scenario
        })
      });

      setSimulationStep('climate');
      
      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      setSimulationStep('ai');
      const simulationResult = await response.json();
      
      setSimulationData(simulationResult);
      setShowOverlay(true);
      
      localStorage.setItem('simulationData', JSON.stringify(simulationResult));

      setToast({
        message: `Analysis Complete! 🎉\n\nProcessed real NASA data for ${uploadedFileName.replace('.geojson', '')}\nGenerated ${simulationResult.interventions?.length || 3} AI recommendations`,
        type: 'success'
      });
      
    } catch (error) {
      setToast({
        message: `Simulation Failed!\n\n${error.message}\n\nPlease ensure backend server is running on localhost:5000`,
        type: 'error'
      });
      setSimulationData({
        metrics: {
          error: true,
          message: "Please check backend services"
        },
        interventions: []
      });
      setShowOverlay(false);
    } finally {
      setLoading(false);
      setSimulationStep('');
    }
  };

  const handleScenarioChange = useCallback(async (newScenario) => {
    setScenario(newScenario);
    localStorage.setItem('scenario', newScenario);
    
    if (currentPlan) {
      setLoading(true);
      setSimulationStep('updating');
      
      try {
        const response = await fetch('http://localhost:5000/api/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            geometry: currentPlan.features[0].geometry,
            scenario: newScenario
          })
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const simulationResult = await response.json();
        setSimulationData(simulationResult);
        localStorage.setItem('simulationData', JSON.stringify(simulationResult));

        setToast({
          message: `Scenario Updated! 📊\n\nNow showing: ${newScenario.toUpperCase()}\nMetrics recalculated with real NASA data`,
          type: 'success'
        });
      } catch (error) {
        setToast({
          message: `Scenario Update Failed!\n\n${error.message}`,
          type: 'error'
        });
      } finally {
        setLoading(false);
        setSimulationStep('');
      }
    }
  }, [currentPlan]);

  const handleLoadPlan = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.geojson,.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const geojson = JSON.parse(event.target.result);
            setCurrentPlan(geojson);
            setSimulationData(null);
            setShowOverlay(false);
            setUploadedFileName(file.name);
            
            localStorage.setItem('currentPlan', JSON.stringify(geojson));
            localStorage.setItem('uploadedFileName', file.name);
            
            setToast({
              message: `Successfully loaded: ${file.name}\n\nMap centered on new location. Click "Run NASA Analysis" to process.`,
              type: 'success'
            });
          } catch (error) {
            setToast({
              message: 'Invalid GeoJSON file\n\nPlease select a valid .geojson file with proper coordinates.',
              type: 'error'
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleSelectCity = useCallback((cityFileName) => {
    const geojson = CITY_GEOJSONS[cityFileName] || CITY_GEOJSONS['trichy_area.geojson'];
    setCurrentPlan(geojson);
    setSimulationData(null);
    setShowOverlay(false);
    setUploadedFileName(cityFileName);
    
    localStorage.setItem('currentPlan', JSON.stringify(geojson));
    localStorage.setItem('uploadedFileName', cityFileName);
    
    setToast({
      message: `Switched to: ${cityFileName.replace('.geojson', '').replace('_area', '').toUpperCase()}\n\nClick "Run NASA Analysis" to simulate climate risk for this city!`,
      type: 'success'
    });
  }, []);

  // Synchronize storm intensity with scenario changes or initial analysis
  useEffect(() => {
    if (simulationData && simulationData.metrics && simulationData.metrics.mean_rain_mm) {
      setStormIntensity(Math.round(simulationData.metrics.mean_rain_mm));
    }
  }, [simulationData, scenario]);

  // Compute live SCS-CN hydrological metrics dynamically as slider moves (Memoized)
  const activeSimulationData = useMemo(() => {
    if (!simulationData || !simulationData.metrics) return simulationData;
    
    const P = stormIntensity;
    const baseP = simulationData.climate_data?.precipitation_mm || 180;
    
    const cn = 78;
    const S = (25400 / cn) - 254; // S = 71.74 mm
    const Ia = 0.2 * S;          // Ia = 14.35 mm
    
    const Q = P > Ia ? Math.pow(P - Ia, 2) / (P - Ia + S) : 0;
    const baseQ = baseP > Ia ? Math.pow(baseP - Ia, 2) / (baseP - Ia + S) : 1;
    
    const runoffChangePct = Math.max(-80, Math.round(((Q - baseQ) / baseQ) * 100));
    const totalPop = simulationData.metrics.total_population || 6000;
    
    const riskFraction = Math.min(0.92, Math.max(0.04, 0.04 + (Q / P) * 0.75));
    const peopleAffected = Math.round(totalPop * riskFraction);

    return {
      ...simulationData,
      metrics: {
        ...simulationData.metrics,
        mean_rain_mm: P,
        peak_runoff_change_pct: runoffChangePct,
        scenario_people: peopleAffected,
        impervious_fraction: Math.min(0.95, parseFloat((0.55 + (runoffChangePct / 300)).toFixed(2)))
      }
    };
  }, [simulationData, stormIntensity]);

  // Compute active GeoJSON overlay polygon with 3 Distinct Hazard Tiers (Memoized)
  const currentOverlay = useMemo(() => {
    if (!showOverlay || !simulationData) return null;
    
    if (currentPlan && currentPlan.features && currentPlan.features[0] && currentPlan.features[0].geometry) {
      const coords = currentPlan.features[0].geometry.coordinates[0];
      if (coords && coords.length > 0) {
        const minLon = Math.min(...coords.map(c => c[0]));
        const maxLon = Math.max(...coords.map(c => c[0]));
        const minLat = Math.min(...coords.map(c => c[1]));
        const maxLat = Math.max(...coords.map(c => c[1]));
        
        const centerLon = (minLon + maxLon) / 2;
        const centerLat = (minLat + maxLat) / 2;
        
        const halfSpanLon = Math.max((maxLon - minLon) / 2, 0.003);
        const halfSpanLat = Math.max((maxLat - minLat) / 2, 0.003);
        
        // Base scale expands with storm rainfall (50mm -> 0.20, 180mm -> 0.52, 350mm -> 0.90)
        let scale = Math.min(0.95, Math.max(0.18, 0.18 + ((stormIntensity - 50) / 300) * 0.72));
        let baseDepth = Math.max(0.2, (stormIntensity / 220) * 1.35);

        if (mitigationReductionPct > 0) {
          scale = Math.max(0.12, scale * (1 - (mitigationReductionPct / 100) * 0.5));
          baseDepth = baseDepth * (1 - (mitigationReductionPct / 100) * 0.65);
        }
        
        const isMitigated = mitigationReductionPct > 30;

        // Helper to generate rectangular / polygonal rings
        const makeBox = (s) => {
          const bLon = halfSpanLon * s;
          const bLat = halfSpanLat * s;
          return [[
            [centerLon - bLon, centerLat - bLat],
            [centerLon + bLon, centerLat - bLat],
            [centerLon + bLon, centerLat + bLat],
            [centerLon - bLon, centerLat + bLat],
            [centerLon - bLon, centerLat - bLat]
          ]];
        };

        const features = isMitigated ? [
          {
            type: "Feature",
            properties: {
              name: `Green Infrastructure Buffer (${stormIntensity}mm)`,
              risk_tier: `Mitigated Eco Buffer (-${mitigationReductionPct}% Runoff)`,
              depth_m: (baseDepth * 0.4).toFixed(2),
              fill_color: "#10B981",
              stroke_color: "#059669",
              fill_opacity: 0.35,
              tier: "mitigated"
            },
            geometry: {
              type: "Polygon",
              coordinates: makeBox(scale * 0.8)
            }
          },
          {
            type: "Feature",
            properties: {
              name: `Controlled Infiltration & Storage Core`,
              risk_tier: `Infiltration Swale (-${mitigationReductionPct}% Peak Flow)`,
              depth_m: (baseDepth * 0.2).toFixed(2),
              fill_color: "#059669",
              stroke_color: "#047857",
              fill_opacity: 0.50,
              tier: "mitigated_core"
            },
            geometry: {
              type: "Polygon",
              coordinates: makeBox(scale * 0.4)
            }
          }
        ] : [
          // Tier 1: Outer Band - Minor Waterlogging (<0.5m, Yellow)
          {
            type: "Feature",
            properties: {
              name: `Outer Inundation Fringe (${stormIntensity}mm)`,
              risk_tier: "Minor Waterlogging (<0.5m)",
              depth_m: (baseDepth * 0.35).toFixed(2),
              fill_color: "#EAB308",
              stroke_color: "#CA8A04",
              fill_opacity: 0.30,
              tier: "minor"
            },
            geometry: {
              type: "Polygon",
              coordinates: makeBox(scale * 1.0)
            }
          },
          // Tier 2: Middle Band - Moderate Inundation (0.5m - 1.2m, Orange)
          {
            type: "Feature",
            properties: {
              name: `Intermediate Floodplain (${stormIntensity}mm)`,
              risk_tier: "Moderate Inundation (0.5m - 1.2m)",
              depth_m: (baseDepth * 0.65).toFixed(2),
              fill_color: "#F97316",
              stroke_color: "#EA580C",
              fill_opacity: 0.48,
              tier: "moderate"
            },
            geometry: {
              type: "Polygon",
              coordinates: makeBox(scale * 0.65)
            }
          },
          // Tier 3: Core Depression - Critical Hazard (>1.2m, Red)
          {
            type: "Feature",
            properties: {
              name: `Catchment Depressional Sink (${stormIntensity}mm)`,
              risk_tier: "Critical Hazard (>1.2m)",
              depth_m: baseDepth.toFixed(2),
              fill_color: "#EF4444",
              stroke_color: "#DC2626",
              fill_opacity: 0.62,
              tier: "critical"
            },
            geometry: {
              type: "Polygon",
              coordinates: makeBox(scale * 0.35)
            }
          }
        ];

        return {
          type: "FeatureCollection",
          features: features
        };
      }
    }

    if (simulationData.overlays) {
      if (scenario === 'baseline') {
        return simulationData.overlays.baseline || null;
      }
      return simulationData.overlays[scenario] || 
             simulationData.overlays.scenarioB || 
             simulationData.overlays.rcp45 || 
             simulationData.overlays.baseline || 
             null;
    }
    
    return null;
  }, [showOverlay, simulationData, currentPlan, stormIntensity, mitigationReductionPct, scenario]);

  const handleIntroComplete = useCallback(() => {
    setShowIntroPopup(false);
    localStorage.setItem('intro-completed', 'true');
    setPanelVisible(true);
    setPanelMinimized(false);
  }, []);

  const handlePanelToggle = useCallback(() => {
    setPanelVisible(prev => !prev);
    setPanelMinimized(false);
  }, []);

  const handlePanelMinimize = useCallback(() => {
    setPanelVisible(false);
    setPanelMinimized(true);
  }, []);

  const handleMitigationChange = useCallback((data) => {
    setMitigationReductionPct(data.totalReductionPct);
  }, []);

  const handleStormIntensityChange = useCallback((val) => {
    setStormIntensity(val);
  }, []);

  return (
    <div className="app">
      {/* Top Command Bar (Gov-Tech Status HUD) */}
      <div style={{
        position: 'absolute', 
        top: 16, 
        left: 60, 
        zIndex: 999, 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        border: '1px solid #E2E8F0',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.08)',
        padding: '10px 16px', 
        borderRadius: '10px', 
        fontSize: '12px',
        fontWeight: '600',
        minWidth: '270px',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '6px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="/nasa-logo.svg" 
              alt="NASA" 
              style={{
                height: '20px', 
                width: 'auto',
                flexShrink: 0
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div>
              <div style={{
                color: '#0F172A',
                fontSize: '12.5px',
                fontWeight: '800',
                letterSpacing: '0.3px',
                lineHeight: '1.2'
              }}>
                TerraSense Digital Twin
              </div>
              <div style={{
                fontSize: '9.5px', 
                color: '#64748B',
                fontWeight: '600',
                letterSpacing: '0.2px'
              }}>
                Urban Hydro-Spatial Decision Support
              </div>
            </div>
          </div>
        </div>

        <div style={{
          fontSize: '11px', 
          color: '#475569',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: '1px solid #F1F5F9',
          paddingTop: '6px',
          marginTop: '6px'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: backendStatus === 'connected' ? '#059669' : '#DC2626'
              }}></span>
              Backend: {backendStatus === 'connected' ? 'Online' : 'Offline'}
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: earthEngineStatus === 'connected' ? '#059669' : '#2563EB'
              }}></span>
              Satellite: {earthEngineStatus === 'connected' ? 'GEE Live' : 'Calibrated'}
            </span>
          </div>

          <button
            onClick={() => setIsEmergencyHotlineOpen(true)}
            style={{
              background: '#0F172A',
              color: '#FFFFFF',
              border: '1px solid #1E293B',
              padding: '4px 9px',
              borderRadius: '6px',
              fontSize: '10.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'background 0.15s'
            }}
            onMouseOver={(e) => e.currentTarget.style.background = '#DC2626'}
            onMouseOut={(e) => e.currentTarget.style.background = '#0F172A'}
          >
            <span>DEOC 1077</span>
          </button>
        </div>
      </div>

      <MapView 
        planData={currentPlan}
        overlayData={currentOverlay}
        scenario={scenario}
        showOverlay={showOverlay}
        simulationData={activeSimulationData}
        uploadedFileName={uploadedFileName}
        mitigationReductionPct={mitigationReductionPct}
      />

      {showIntroPopup && (
        <IntroPopup onComplete={handleIntroComplete} />
      )}

      <FloatingPanel 
        scenario={scenario}
        onScenarioChange={handleScenarioChange}
        simulationData={activeSimulationData}
        loading={loading}
        simulationStep={simulationStep}
        onRunSimulation={handleRunSimulation}
        onLoadPlan={handleLoadPlan}
        uploadedFileName={uploadedFileName}
        backendStatus={backendStatus}
        earthEngineStatus={earthEngineStatus}
        isVisible={panelVisible}
        onToggle={handlePanelToggle}
        onMinimize={handlePanelMinimize}
        onMitigationChange={handleMitigationChange}
        planData={currentPlan}
        stormIntensity={stormIntensity}
        onStormIntensityChange={handleStormIntensityChange}
        onOpenBenchmark={() => setIsBenchmarkOpen(true)}
        onOpenHotline={() => setIsEmergencyHotlineOpen(true)}
        onOpenDPR={() => setIsDPROpen(true)}
        mitigationReductionPct={mitigationReductionPct}
      />

      <MultiCityBenchmarkModal 
        isOpen={isBenchmarkOpen}
        onClose={() => setIsBenchmarkOpen(false)}
        onSelectCity={handleSelectCity}
        currentCityName={uploadedFileName}
      />

      <EmergencyHotlineModal 
        isOpen={isEmergencyHotlineOpen}
        onClose={() => setIsEmergencyHotlineOpen(false)}
        onShowToast={setToast}
      />

      <DPRReportModal 
        isOpen={isDPROpen}
        onClose={() => setIsDPROpen(false)}
        simulationData={activeSimulationData}
        uploadedFileName={uploadedFileName}
        scenario={scenario}
        stormIntensity={stormIntensity}
        mitigationReductionPct={mitigationReductionPct}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <MapLegend 
        uploadedFileName={uploadedFileName}
        simulationData={simulationData}
      />
    </div>
  );
}

export default App;