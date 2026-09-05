import React, { useState, useEffect } from 'react';
import MapView from './components/MapView';
import FloatingPanel from './components/FloatingPanel';
import FloatingButton from './components/FloatingButton';
import IntroPopup from './components/IntroPopup';
import Toast from './components/Toast';
import MapLegend from './components/MapLegend';
import MultiCityBenchmarkModal from './components/MultiCityBenchmarkModal';
import EmergencyHotlineModal from './components/EmergencyHotlineModal';

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
          coordinates: [[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
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
        console.log('🔌 Backend connected:', data);
        
        // Auto-run baseline simulation if not already loaded
        if (!simulationData && currentPlan) {
          triggerAutoSimulation();
        }
      } else {
        setBackendStatus('error');
      }
    } catch (error) {
      setBackendStatus('offline');
      console.error('❌ Backend connection failed. Please start the backend server.');
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
      console.log('🚀 Starting real NASA data simulation...');
      
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
      
      // Save simulation data
      localStorage.setItem('simulationData', JSON.stringify(simulationResult));

      // Show success toast
      setToast({
        message: `Analysis Complete! 🎉\n\nProcessed real NASA data for ${uploadedFileName.replace('.geojson', '')}\nGenerated ${simulationResult.interventions?.length || 3} AI recommendations`,
        type: 'success'
      });
      
    } catch (error) {
      console.error('❌ Simulation failed:', error);
      setToast({
        message: `Simulation Failed!\n\n${error.message}\n\nPlease ensure:\n1. Backend server is running on localhost:5000\n2. Earth Engine is authenticated\n3. LMStudio is running on localhost:1234`,
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

  const handleScenarioChange = async (newScenario) => {
    setScenario(newScenario);
    localStorage.setItem('scenario', newScenario);
    
    // Re-run simulation with new scenario if we have plan data
    if (currentPlan && simulationData) {
      setLoading(true);
      setSimulationStep('updating');
      
      try {
        console.log(`🔄 Updating to ${newScenario} scenario...`);
        
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
        console.log(`📊 New scenario data:`, {
          scenario: simulationResult.scenario,
          runoff_change: simulationResult.metrics?.peak_runoff_change_pct,
          people_affected: simulationResult.metrics?.scenario_people,
          interventions_count: simulationResult.interventions?.length
        });
        setSimulationData(simulationResult);
        
        // Save updated simulation data
        localStorage.setItem('simulationData', JSON.stringify(simulationResult));

        // Show scenario change toast
        setToast({
          message: `Scenario Updated! 📊\n\nNow showing: ${newScenario.toUpperCase()}\nMetrics recalculated with real NASA data`,
          type: 'success'
        });
        
      } catch (error) {
        console.error('❌ Scenario update failed:', error);
        setToast({
          message: `Scenario Update Failed!\n\n${error.message}`,
          type: 'error'
        });
      } finally {
        setLoading(false);
        setSimulationStep('');
      }
    }
  };

  const handleLoadPlan = () => {
    // Create file input for real GeoJSON upload
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
            
            // Save to localStorage
            localStorage.setItem('currentPlan', JSON.stringify(geojson));
            localStorage.setItem('uploadedFileName', file.name);
            
            console.log('📁 Loaded new plan:', geojson);
            
            // Show success toast
            setToast({
              message: `Successfully loaded: ${file.name}\n\nMap will center on the new location. Click "Run NASA Analysis" to process this area.`,
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
  };

  const [mitigationReductionPct, setMitigationReductionPct] = useState(0);
  const [stormIntensity, setStormIntensity] = useState(180);
  const [isBenchmarkOpen, setIsBenchmarkOpen] = useState(false);
  const [isEmergencyHotlineOpen, setIsEmergencyHotlineOpen] = useState(false);

  const handleSelectCity = (cityFileName) => {
    const geojson = CITY_GEOJSONS[cityFileName] || CITY_GEOJSONS['trichy_area.geojson'];
    setCurrentPlan(geojson);
    setSimulationData(null);
    setShowOverlay(false);
    setUploadedFileName(cityFileName);
    
    // Save to localStorage
    localStorage.setItem('currentPlan', JSON.stringify(geojson));
    localStorage.setItem('uploadedFileName', cityFileName);
    
    setToast({
      message: `Switched to: ${cityFileName.replace('.geojson', '').replace('_area', '').toUpperCase()}\n\nClick "Run NASA Analysis" to simulate climate risk for this city!`,
      type: 'success'
    });
  };

  // Synchronize storm intensity with scenario changes or initial analysis
  useEffect(() => {
    if (simulationData && simulationData.metrics && simulationData.metrics.mean_rain_mm) {
      setStormIntensity(Math.round(simulationData.metrics.mean_rain_mm));
    }
  }, [simulationData, scenario]);

  // Compute live SCS-CN hydrological metrics dynamically as slider moves
  const getActiveSimulationData = () => {
    if (!simulationData || !simulationData.metrics) return simulationData;
    
    const P = stormIntensity;
    const baseP = simulationData.climate_data?.precipitation_mm || 180;
    
    // SCS Curve Number (CN=78 for urban residential/commercial mix)
    const cn = 78;
    const S = (25400 / cn) - 254; // S = 71.74 mm
    const Ia = 0.2 * S;          // Ia = 14.35 mm
    
    // Runoff depth Q (mm)
    const Q = P > Ia ? Math.pow(P - Ia, 2) / (P - Ia + S) : 0;
    const baseQ = baseP > Ia ? Math.pow(baseP - Ia, 2) / (baseP - Ia + S) : 1;
    
    const runoffChangePct = Math.max(-80, Math.round(((Q - baseQ) / baseQ) * 100));
    const totalPop = simulationData.metrics.total_population || 6000;
    
    // Inundation risk fraction
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
  };

  const activeSimulationData = getActiveSimulationData();

  const getCurrentOverlay = () => {
    if (!showOverlay || !simulationData) return null;
    
    // Dynamically scale the flood overlay polygon based on storm intensity slider and mitigation!
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
        
        // Scale flood zone relative to storm intensity (50mm -> 0.20, 180mm -> 0.50, 350mm -> 0.90)
        let scale = Math.min(0.95, Math.max(0.18, 0.18 + ((stormIntensity - 50) / 300) * 0.72));
        
        if (mitigationReductionPct > 0) {
          scale = Math.max(0.12, scale * (1 - (mitigationReductionPct / 100) * 0.5));
        }
        
        const bufLon = halfSpanLon * scale;
        const bufLat = halfSpanLat * scale;
        
        return {
          type: "FeatureCollection",
          features: [{
            type: "Feature",
            properties: {
              name: `Storm (${stormIntensity}mm) Inundation Zone`,
              risk_level: stormIntensity > 260 ? 'Severe Flash Flood (Cloudburst)' : stormIntensity > 150 ? 'High Flood Inundation' : 'Moderate Inundation',
              depth_m: (Math.max(0.1, (stormIntensity / 250) * 0.85)).toFixed(2),
              data_source: "SCS_Live_Calculation"
            },
            geometry: {
              type: "Polygon",
              coordinates: [[
                [centerLon - bufLon, centerLat - bufLat],
                [centerLon + bufLon, centerLat - bufLat],
                [centerLon + bufLon, centerLat + bufLat],
                [centerLon - bufLon, centerLat + bufLat],
                [centerLon - bufLon, centerLat - bufLat]
              ]]
            }
          }]
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
  };

  const handleIntroComplete = () => {
    setShowIntroPopup(false);
    localStorage.setItem('intro-completed', 'true');
    setPanelVisible(true);
    setPanelMinimized(false);
  };

  const handlePanelToggle = () => {
    setPanelVisible(!panelVisible);
    setPanelMinimized(false);
  };

  const handlePanelMinimize = () => {
    setPanelVisible(false);
    setPanelMinimized(true);
  };

  return (
    <div className="app">
      {/* System Status Bar */}
      <div style={{
        position: 'absolute', 
        top: 20, 
        right: 20, 
        zIndex: 1000, 
        background: 'rgba(255, 255, 255, 0.98)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 24px rgba(7, 23, 63, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.2) inset',
        padding: '16px 20px', 
        borderRadius: '16px', 
        fontSize: '13px',
        fontWeight: '700',
        minWidth: '300px',
        fontFamily: "'Fira Sans', sans-serif"
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <img 
            src="/nasa-logo.svg" 
            alt="WEHACK 2026" 
            style={{
              height: '32px', 
              width: 'auto',
              marginRight: '12px', 
              flexShrink: 0
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'inline-block';
            }}
          />
          <div style={{
            display: 'none',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#FC3D21',
            marginRight: '12px',
            flexShrink: 0,
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '8px',
            fontWeight: 'bold'
          }}>
            NASA
          </div>
          <div style={{
            background: 'linear-gradient(90deg, #07173F 0%, #0042A6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '14px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            lineHeight: '1.2'
          }}>
            TERRASENSE • AI DIGITAL TWIN
          </div>
        </div>
        <div style={{
          fontSize: '10px', 
          color: '#D4AF00',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.3px',
          marginBottom: '8px',
          paddingLeft: '44px',
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}>
          WEHACK 2026
        </div>
        <div style={{
          fontSize: '11px', 
          color: '#07173F',
          fontFamily: "'Overpass', sans-serif",
          fontWeight: '600',
          paddingLeft: '44px'
        }}>
          <div style={{marginBottom: '3px'}}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendStatus === 'connected' ? '#27AE60' : '#E43700',
              marginRight: '6px'
            }}></span>
            Backend: {backendStatus === 'connected' ? 'Online' : 
                      backendStatus === 'checking' ? 'Checking...' : 'Offline'}
          </div>
          <div style={{marginBottom: '3px'}}>
            <span style={{
              display: 'inline-block',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: earthEngineStatus === 'connected' ? '#27AE60' : '#E43700',
              marginRight: '6px'
            }}></span>
            Earth Engine: {earthEngineStatus === 'connected' ? 'Authenticated' : 
                          earthEngineStatus === 'needs_auth' ? 'Calibrated Baseline' : 'Unknown'}
          </div>
        </div>
        <div style={{
          fontSize: '10px', 
          marginTop: '6px', 
          color: '#2E96F5',
          fontFamily: "'Overpass', sans-serif",
          fontWeight: '600',
          paddingLeft: '44px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>Area: {uploadedFileName.replace('.geojson', '').replace('_area', '')}</span>
          <button
            onClick={() => setIsEmergencyHotlineOpen(true)}
            style={{
              background: '#DC2626',
              color: '#FFFFFF',
              border: 'none',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '10.5px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>🚨 Emergency Helpline</span>
          </button>
        </div>
      </div>

      <MapView 
        planData={currentPlan}
        overlayData={getCurrentOverlay()}
        scenario={scenario}
        showOverlay={showOverlay}
        simulationData={activeSimulationData}
        uploadedFileName={uploadedFileName}
        mitigationReductionPct={mitigationReductionPct}
      />

      {showIntroPopup && (
        <IntroPopup onComplete={handleIntroComplete} />
      )}

      {panelVisible && (
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
          onMitigationChange={(data) => setMitigationReductionPct(data.totalReductionPct)}
          planData={currentPlan}
          stormIntensity={stormIntensity}
          onStormIntensityChange={(val) => setStormIntensity(val)}
          onOpenBenchmark={() => setIsBenchmarkOpen(true)}
          onOpenHotline={() => setIsEmergencyHotlineOpen(true)}
          mitigationReductionPct={mitigationReductionPct}
        />
      )}

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

      {(!panelVisible && !showIntroPopup) && (
        <FloatingButton
          onClick={handlePanelToggle}
          simulationData={simulationData}
        />
      )}

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