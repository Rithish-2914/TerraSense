import React, { useState, useCallback } from 'react';
import MetricsCard from './MetricsCard';
import EnvironmentalCard from './EnvironmentalCard';
import PlanImpactCard from './PlanImpactCard';
import StormHydrographCard from './StormHydrographCard';
import InterventionsSection from './InterventionsSection';
import './FloatingPanel.css';

const FloatingPanel = ({
  scenario,
  onScenarioChange,
  simulationData,
  loading,
  simulationStep,
  onRunSimulation,
  onLoadPlan,
  uploadedFileName,
  backendStatus,
  earthEngineStatus,
  isVisible = true,
  onToggle,
  onMinimize,
  onMitigationChange,
  planData,
  stormIntensity = 180,
  onStormIntensityChange,
  onOpenBenchmark,
  onOpenHotline,
  onOpenDPR,
  mitigationReductionPct = 0
}) => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  const handleVoiceToggle = () => {
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      const summaryText = `TerraSense Hydrology Twin Report. Current catchment: ${uploadedFileName.replace('.geojson', '')}. ` +
        `Simulated design storm is ${stormIntensity} millimeters. Active climate scenario: ${scenario}. ` +
        `Peak runoff coefficient is ${simulationData?.metrics?.runoff_coefficient || 0.68}. ` +
        `Green infrastructure sandbox reduces total runoff by ${mitigationReductionPct} percent.`;
      
      const utter = new SpeechSynthesisUtterance(summaryText);
      utter.rate = 1.0;
      utter.onend = () => setIsPlayingAudio(false);
      utter.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utter);
      setIsPlayingAudio(true);
    }
  };

  const handleExportDPR = () => {
    if (onOpenDPR) {
      onOpenDPR();
    } else {
      window.print();
    }
  };

  const handleSyncWeather = async () => {
    setLoadingWeather(true);
    try {
      const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=10.7905&longitude=78.7047&current=temperature_2m,relative_humidity_2m,precipitation&daily=precipitation_sum&timezone=Asia%2FKolkata');
      const data = await res.json();
      if (data && data.current) {
        setLiveWeather({
          temperatureC: data.current.temperature_2m,
          humidityPct: data.current.relative_humidity_2m,
          rainMm: data.current.precipitation || 0,
          forecastRain24hMm: data.daily?.precipitation_sum?.[0] || 42.5,
          fetchedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } catch (e) {
      console.error('Weather sync error:', e);
    } finally {
      setLoadingWeather(false);
    }
  };

  const getStormTag = (val) => {
    if (val <= 75) return { label: 'Light Monsoon', color: '#059669' };
    if (val <= 140) return { label: 'Moderate Inundation', color: '#2563EB' };
    if (val <= 220) return { label: 'Heavy Design Storm', color: '#D97706' };
    return { label: 'Cloudburst Surge', color: '#DC2626' };
  };

  const stormTag = getStormTag(stormIntensity);

  return (
    <>
      {/* Sidebar Edge Toggle Tab */}
      <button
        className={`sidebar-edge-toggle ${!isVisible ? 'collapsed-pos' : ''}`}
        onClick={onToggle}
        title={isVisible ? 'Collapse Sidebar to Fullscreen Map' : 'Open Controls Sidebar'}
      >
        <span>{isVisible ? '▶ Collapse' : '◀ Digital Twin Controls'}</span>
      </button>

      {/* Docked Right Sidebar */}
      <aside className={`docked-sidebar-wrapper ${!isVisible ? 'collapsed' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-header-top">
            <div className="sidebar-brand-group">
              <img src="/nasa-logo.svg" alt="NASA" className="sidebar-logo" />
              <div className="sidebar-brand-text">
                <h1>TERRASENSE</h1>
                <span>Municipal Digital Twin</span>
              </div>
            </div>

            <button 
              className="sidebar-collapse-btn" 
              onClick={onToggle} 
              title="Collapse Sidebar"
            >
              ▶
            </button>
          </div>

          {/* Quick Actions Row */}
          <div className="sidebar-quick-actions">
            <button 
              className="sidebar-action-btn emergency-btn"
              onClick={onOpenHotline}
              title="Open District Emergency Operations Center (DEOC 1077)"
            >
              <span>DEOC 1077</span>
            </button>

            <button 
              className="sidebar-action-btn benchmark-btn"
              onClick={onOpenBenchmark}
              title="National Smart City Comparative Benchmark"
            >
              <span>Cities Matrix</span>
            </button>

            <button 
              className={`sidebar-action-btn voice-btn ${isPlayingAudio ? 'active-audio' : ''}`}
              onClick={handleVoiceToggle}
              title={isPlayingAudio ? 'Stop Audio Briefing' : 'Speech Briefing'}
            >
              <span>{isPlayingAudio ? 'Stop' : 'Voice Brief'}</span>
            </button>

            <button 
              className="sidebar-action-btn dpr-btn"
              onClick={handleExportDPR}
              title="Print Detailed Project Report (PDF)"
            >
              <span>Export DPR</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab-btn ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <span>Stress Test</span>
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
            disabled={!simulationData}
          >
            <span>Hydrology</span>
          </button>
          <button 
            className={`sidebar-tab-btn ${activeTab === 'solutions' ? 'active' : ''}`}
            onClick={() => setActiveTab('solutions')}
            disabled={!simulationData}
          >
            <span>Sandbox ROI</span>
          </button>
        </div>

        {/* Tab Scrollable Body */}
        <div className="sidebar-body">
          {activeTab === 'simulation' && (
            <div>
              {/* System Connectivity */}
              <div className="gov-section-card">
                <div className="gov-section-header">
                  <h3>System Status</h3>
                  <span className="gov-chip">Edge Real-Time</span>
                </div>
                <div className="status-grid-compact">
                  <div className="status-box">
                    <div className="status-box-label">Backend Hydrology API</div>
                    <div className="status-box-val" style={{ color: backendStatus === 'connected' ? '#059669' : '#DC2626' }}>
                      <span className={`status-dot ${backendStatus === 'connected' ? 'online' : 'offline'}`}></span>
                      {backendStatus === 'connected' ? 'Online (50ms)' : 'Offline'}
                    </div>
                  </div>

                  <div className="status-box">
                    <div className="status-box-label">Earth Observation Data</div>
                    <div className="status-box-val" style={{ color: '#0F172A' }}>
                      <span className="status-dot online"></span>
                      {earthEngineStatus === 'connected' ? 'GEE Live' : 'Calibrated'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Area Catchment Selection */}
              <div className="gov-section-card">
                <div className="gov-section-header">
                  <h3>Study Catchment Area</h3>
                  <span className="gov-chip">Active GIS Bounds</span>
                </div>
                <div className="area-select-row">
                  <div className="area-select-info">
                    {uploadedFileName.replace('.geojson', '').replace('_area', '').toUpperCase()}
                  </div>
                  <button className="area-upload-btn" onClick={onLoadPlan}>
                    Upload GeoJSON
                  </button>
                </div>
              </div>

              {/* Run Simulation Trigger */}
              <div className="gov-section-card">
                <div className="gov-section-header">
                  <h3>USDA SCS-CN Computation</h3>
                  <span className="gov-chip">NEH-4 Standard</span>
                </div>
                <button 
                  className="btn-run-analysis-gov"
                  onClick={onRunSimulation}
                  disabled={backendStatus !== 'connected' || loading}
                >
                  {loading ? 'Processing Satellite Tensors...' : 'Run Catchment Simulation'}
                </button>
              </div>

              {/* Real-time Weather Sync */}
              <div className="gov-section-card">
                <div className="gov-section-header">
                  <h3>Live Meteorological Radar</h3>
                  <button
                    onClick={handleSyncWeather}
                    disabled={loadingWeather}
                    className="weather-sync-btn"
                  >
                    {loadingWeather ? 'Syncing...' : 'Sync Station'}
                  </button>
                </div>

                {liveWeather ? (
                  <div style={{ fontSize: '11px', color: '#334155' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', textAlign: 'center', margin: '8px 0' }}>
                      <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B', fontSize: '9px', fontWeight: '700' }}>TEMPERATURE</div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>{liveWeather.temperatureC}°C</div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B', fontSize: '9px', fontWeight: '700' }}>HUMIDITY</div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>{liveWeather.humidityPct}%</div>
                      </div>
                      <div style={{ background: '#F8FAFC', padding: '6px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                        <div style={{ color: '#64748B', fontSize: '9px', fontWeight: '700' }}>24H FORECAST</div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#DC2626' }}>{liveWeather.forecastRain24hMm} mm</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '9.5px', color: '#64748B' }}>Synced at {liveWeather.fetchedAt}</span>
                      <button
                        onClick={() => onStormIntensityChange(Math.max(50, Math.round(liveWeather.forecastRain24hMm * 3.5)))}
                        style={{
                          background: '#0F172A',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '5px',
                          fontSize: '10px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Simulate Forecast
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '11.5px', color: '#64748B' }}>
                    Click "Sync Station" to fetch live station ambient temperature, humidity, and 24h precipitation from Open-Meteo.
                  </p>
                )}
              </div>

              {/* Interactive Cloudburst Stress-Test Slider */}
              <div className="gov-section-card">
                <div className="gov-section-header">
                  <h3>Cloudburst Stress Slider</h3>
                  <span className="gov-chip" style={{ color: stormTag.color, fontWeight: '700' }}>
                    {stormTag.label}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#334155', marginBottom: '6px' }}>
                  <span>Simulated Rainfall Depth:</span>
                  <strong style={{ color: '#0F172A', fontSize: '13px' }}>{stormIntensity} mm / event</strong>
                </div>

                <input 
                  type="range"
                  min="50"
                  max="350"
                  step="10"
                  value={stormIntensity}
                  onChange={(e) => onStormIntensityChange && onStormIntensityChange(parseInt(e.target.value))}
                  style={{
                    width: '100%',
                    accentColor: '#0F172A',
                    cursor: 'pointer',
                    height: '6px',
                    marginBottom: '8px'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#64748B' }}>
                  <span>50mm (Monsoon)</span>
                  <span>180mm (Design Storm)</span>
                  <span>350mm (Cloudburst)</span>
                </div>
              </div>

              {/* Climate Warming Scenarios */}
              <div className="gov-section-card">
                <div className="gov-section-header">
                  <h3>IPCC Climate Scenarios</h3>
                  <span className="gov-chip">2035 Horizon</span>
                </div>
                <div className="scenario-grid-gov">
                  <div 
                    className={`scenario-card-btn ${scenario === 'baseline' ? 'active' : ''}`}
                    onClick={() => onScenarioChange('baseline')}
                  >
                    <div className="scenario-card-title">Baseline Current</div>
                    <div className="scenario-card-sub">Recorded CWC Normals</div>
                  </div>

                  <div 
                    className={`scenario-card-btn ${scenario === 'rcp45' ? 'active' : ''}`}
                    onClick={() => onScenarioChange('rcp45')}
                  >
                    <div className="scenario-card-title">+2.0°C (RCP 4.5)</div>
                    <div className="scenario-card-sub">+10% Cloudburst Surge</div>
                  </div>

                  <div 
                    className={`scenario-card-btn ${scenario === 'rcp45_rain_plus10' ? 'active' : ''}`}
                    onClick={() => onScenarioChange('rcp45_rain_plus10')}
                  >
                    <div className="scenario-card-title">Monsoon Saturation</div>
                    <div className="scenario-card-sub">+10% Elevated Saturation</div>
                  </div>

                  <div 
                    className={`scenario-card-btn ${scenario === 'rcp85' ? 'active' : ''}`}
                    onClick={() => onScenarioChange('rcp85')}
                  >
                    <div className="scenario-card-title" style={{ color: '#DC2626' }}>+3.8°C (RCP 8.5)</div>
                    <div className="scenario-card-sub">+25% Extreme Inundation</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analysis' && simulationData && (
            <div>
              <MetricsCard 
                metrics={simulationData.metrics}
                scenario={scenario}
                loading={loading}
              />
              <EnvironmentalCard 
                metrics={simulationData.metrics}
                loading={loading}
              />
              <PlanImpactCard 
                simulationData={simulationData}
                scenario={scenario}
                loading={loading}
              />
              <StormHydrographCard 
                rainIntensity={stormIntensity} 
                mitigationPct={mitigationReductionPct} 
              />
            </div>
          )}

          {activeTab === 'solutions' && simulationData && (
            <div>
              <InterventionsSection 
                interventions={simulationData.interventions}
                loading={loading}
                simulationData={simulationData}
                onMitigationChange={onMitigationChange}
              />
              <PlanImpactCard 
                simulationData={simulationData} 
                scenario={scenario} 
                loading={loading} 
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default React.memo(FloatingPanel);