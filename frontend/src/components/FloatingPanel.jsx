import React, { useState } from 'react';
import './FloatingPanel.css';
import MetricsCard from './MetricsCard';
import EnvironmentalCard from './EnvironmentalCard';
import PlanImpactCard from './PlanImpactCard';
import InterventionsSection from './InterventionsSection';
import ProcessingOverlay from './ProcessingOverlay';
import StormHydrographCard from './StormHydrographCard';
import { playVoiceBriefing, stopVoiceBriefing } from '../utils/voiceBriefing';
import { generateMunicipalDPR } from '../utils/dprReportGenerator';
import { fetchLiveWeatherData } from '../utils/liveWeatherService';

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
  isVisible,
  onToggle,
  onMinimize,
  onMitigationChange,
  planData,
  stormIntensity = 180,
  onStormIntensityChange,
  onOpenBenchmark,
  onOpenHotline,
  mitigationReductionPct = 0
}) => {
  const [activeTab, setActiveTab] = useState('simulation');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [liveWeather, setLiveWeather] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  if (!isVisible) return null;

  const handleVoiceToggle = () => {
    if (isPlayingAudio) {
      stopVoiceBriefing();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      const started = playVoiceBriefing(simulationData, scenario, uploadedFileName, () => {
        setIsPlayingAudio(false);
      });
      if (!started) {
        setIsPlayingAudio(false);
      }
    }
  };

  const handleExportDPR = () => {
    generateMunicipalDPR(simulationData, scenario, uploadedFileName, planData);
  };

  const handleSyncWeather = async () => {
    setLoadingWeather(true);
    let lat = 10.7905;
    let lon = 78.7047;
    if (planData && planData.features && planData.features[0] && planData.features[0].geometry) {
      const coords = planData.features[0].geometry.coordinates[0];
      if (coords && coords.length > 0) {
        lat = coords.reduce((sum, c) => sum + c[1], 0) / coords.length;
        lon = coords.reduce((sum, c) => sum + c[0], 0) / coords.length;
      }
    }
    const weather = await fetchLiveWeatherData(lat, lon);
    setLiveWeather(weather);
    setLoadingWeather(false);
  };

  const getStormTag = (val) => {
    if (val < 100) return { label: 'Standard Monsoon Shower', color: '#27AE60' };
    if (val < 190) return { label: 'Heavy Storm Surge (+10%)', color: '#FF8C00' };
    if (val < 280) return { label: 'Severe Cloudburst Event', color: '#E43700' };
    return { label: '100-Year Flash Flood Catastrophe', color: '#900C3F' };
  };

  const stormTag = getStormTag(stormIntensity);

  return (
    <div className="floating-panel-overlay">
      <div className="floating-panel">
        <div className="panel-header">
          <div className="panel-header-left">
            <img src="/nasa-logo.svg" alt="WEHACK 2026" className="panel-logo" />
            <div className="panel-title">
              <h1>TerraSense</h1>
              <span>Climate-Adaptive Digital Twin</span>
            </div>
          </div>
          
          <div className="panel-header-controls">
            {/* Citizen Emergency Helpline Registry */}
            <button 
              className="panel-action-btn"
              onClick={onOpenHotline}
              title="Open Municipal Disaster Control Room & Helpline Log"
              style={{
                background: '#DC2626',
                color: '#FFFFFF',
                border: 'none',
                padding: '8px 12px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <span>🚨 Emergency Helpline</span>
            </button>

            {/* National Benchmark Modal Button */}
            <button 
              className="panel-action-btn"
              onClick={onOpenBenchmark}
              title="National Smart City Comparative Benchmark"
              style={{
                background: 'rgba(0, 229, 255, 0.1)',
                color: '#0042A6',
                border: '1px solid rgba(0, 229, 255, 0.4)',
                padding: '8px 12px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer'
              }}
            >
              <span>🏙️ Benchmark</span>
            </button>

            {simulationData && (
              <>
                {/* Voice Briefing Button */}
                <button 
                  className={`panel-action-btn ${isPlayingAudio ? 'active-audio' : ''}`}
                  onClick={handleVoiceToggle}
                  title={isPlayingAudio ? 'Stop Audio Briefing' : 'Play AI Voice Briefing'}
                  style={{
                    background: isPlayingAudio ? 'rgba(228, 55, 0, 0.12)' : 'rgba(0, 66, 166, 0.08)',
                    color: isPlayingAudio ? '#E43700' : '#0042A6',
                    border: isPlayingAudio ? '1px solid #E43700' : '1px solid rgba(0, 66, 166, 0.2)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer'
                  }}
                >
                  <span>{isPlayingAudio ? '⏹️ Stop' : '🎙️ Voice Copilot'}</span>
                  {isPlayingAudio && <span className="audio-wave">●</span>}
                </button>

                {/* Export DPR PDF Button */}
                <button 
                  className="panel-action-btn"
                  onClick={handleExportDPR}
                  title="Generate Print-Ready Detailed Project Report (PDF)"
                  style={{
                    background: 'linear-gradient(135deg, #07173F 0%, #0042A6 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    fontWeight: '700',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(7, 23, 63, 0.2)'
                  }}
                >
                  <span>📄 DPR (PDF)</span>
                </button>
              </>
            )}

            <button className="panel-control minimize" onClick={onMinimize} title="Minimize">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
            </button>
            <button className="panel-control close" onClick={onToggle} title="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="panel-tabs">
          <button 
            className={`panel-tab ${activeTab === 'simulation' ? 'active' : ''}`}
            onClick={() => setActiveTab('simulation')}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                <line x1="12" y1="22.08" x2="12" y2="12"></line>
              </svg>
            </span>
            Simulation & Stress-Test
          </button>
          <button 
            className={`panel-tab ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => setActiveTab('analysis')}
            disabled={!simulationData}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 3v18h18"></path>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
              </svg>
            </span>
            Hydrology & Thermal Analysis
          </button>
          <button 
            className={`panel-tab ${activeTab === 'solutions' ? 'active' : ''}`}
            onClick={() => setActiveTab('solutions')}
            disabled={!simulationData}
          >
            <span className="tab-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </span>
            Policy Sandbox & ROI
          </button>
        </div>

        <div className="panel-content">
          {activeTab === 'simulation' && (
            <div className="tab-content">
              <div className="section">
                <h3>System Status</h3>
                <div className="status-grid">
                  <div className={`status-item ${backendStatus === 'connected' ? 'connected' : 'error'}`}>
                    <span className="status-label">Backend API</span>
                    <span className="status-value">
                      {backendStatus === 'connected' ? 'Connected' : 
                       backendStatus === 'checking' ? 'Checking...' : 'Offline'}
                    </span>
                  </div>
                  <div className={`status-item ${earthEngineStatus === 'connected' ? 'connected' : 'warning'}`}>
                    <span className="status-label">Earth Engine</span>
                    <span className="status-value">
                      {earthEngineStatus === 'connected' ? 'Authenticated' : 
                       earthEngineStatus === 'needs_auth' ? 'Calibrated Model Active' : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="section">
                <h3>Area Selection</h3>
                <div className="plan-upload">
                  <div className="current-plan">
                    <span className="plan-label">Current Area:</span>
                    <span className="plan-name">{uploadedFileName.replace('.geojson', '').replace('_area', '')}</span>
                  </div>
                  <button className="btn-primary" onClick={onLoadPlan}>
                    Upload New Area
                  </button>
                </div>
              </div>
              
              <div className="section">
                <h3>NASA Satellite Processing</h3>
                {loading ? (
                  <div className="processing-steps">
                    <div className={`processing-step ${simulationStep === 'processing' ? 'active' : simulationStep && simulationStep !== 'processing' ? 'completed' : 'pending'}`}>
                      <div className="step-indicator">
                        {simulationStep === 'processing' ? (
                          <div className="spinner-small"></div>
                        ) : simulationStep && simulationStep !== 'processing' ? '✓' : '1'}
                      </div>
                      <div className="step-content">
                        <span className="step-title">Area Geometry</span>
                        <span className="step-desc">Shoelace geodesic bounds & area</span>
                      </div>
                    </div>
                    
                    <div className={`processing-step ${simulationStep === 'climate' ? 'active' : (simulationStep === 'ai' || (simulationStep && simulationStep !== 'processing' && simulationStep !== 'climate')) ? 'completed' : 'pending'}`}>
                      <div className="step-indicator">
                        {simulationStep === 'climate' ? (
                          <div className="spinner-small"></div>
                        ) : (simulationStep === 'ai' || (simulationStep && simulationStep !== 'processing' && simulationStep !== 'climate')) ? '✓' : '2'}
                      </div>
                      <div className="step-content">
                        <span className="step-title">NASA Satellite Data</span>
                        <span className="step-desc">GPM, MODIS LST, SRTM, WorldPop</span>
                      </div>
                    </div>
                    
                    <div className={`processing-step ${simulationStep === 'ai' ? 'active' : 'pending'}`}>
                      <div className="step-indicator">
                        {simulationStep === 'ai' ? (
                          <div className="spinner-small"></div>
                        ) : '3'}
                      </div>
                      <div className="step-content">
                        <span className="step-title">AI Municipal Engine</span>
                        <span className="step-desc">Generating ROI & action plans</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    className="btn-analysis"
                    onClick={onRunSimulation}
                    disabled={backendStatus !== 'connected'}
                  >
                    Run NASA Analysis
                  </button>
                )}
              </div>

              {/* Live Real-Time Weather Radar Sync */}
              <div className="section" style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '12px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '13px', color: '#0369A1' }}>🌦️ Real-Time Live Weather Sync</h3>
                  <button
                    onClick={handleSyncWeather}
                    disabled={loadingWeather}
                    style={{
                      background: '#0284C7',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                  >
                    {loadingWeather ? 'Syncing...' : '📡 Sync Live Weather'}
                  </button>
                </div>

                {liveWeather ? (
                  <div style={{ fontSize: '11px', color: '#0C4A6E' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center', margin: '8px 0' }}>
                      <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E0F2FE' }}>
                        <div style={{ color: '#64748B', fontSize: '9px' }}>CURRENT TEMP</div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#0369A1' }}>{liveWeather.temperatureC}°C</div>
                      </div>
                      <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E0F2FE' }}>
                        <div style={{ color: '#64748B', fontSize: '9px' }}>HUMIDITY</div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#0369A1' }}>{liveWeather.humidityPct}%</div>
                      </div>
                      <div style={{ background: '#FFFFFF', padding: '6px', borderRadius: '6px', border: '1px solid #E0F2FE' }}>
                        <div style={{ color: '#64748B', fontSize: '9px' }}>24H FORECAST</div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: '#E43700' }}>{liveWeather.forecastRain24hMm} mm</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>Synced at {liveWeather.fetchedAt} via Open-Meteo</span>
                      <button
                        onClick={() => onStormIntensityChange(Math.max(50, Math.round(liveWeather.forecastRain24hMm * 3.5)))}
                        style={{
                          background: '#07173F',
                          color: '#00E5FF',
                          border: 'none',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: '800',
                          cursor: 'pointer'
                        }}
                      >
                        ⚡ Simulate Today's Rain
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>
                    Click "Sync Live Weather" to fetch real-time temperature, wind, and next 24h rainfall radar for this ward.
                  </p>
                )}
              </div>

              {/* Interactive Storm Severity / Cloudburst Slider */}
              {simulationData && (
                <div className="section" style={{ background: '#F7FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px' }}>⛈️ Cloudburst & Storm Stress-Test</h3>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: stormTag.color, background: 'rgba(0,0,0,0.05)', padding: '3px 8px', borderRadius: '4px' }}>
                      {stormTag.label}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#555', marginBottom: '4px' }}>
                    <span>Rainfall Volume:</span>
                    <strong style={{ color: '#07173F' }}>{stormIntensity} mm / event</strong>
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
                      accentColor: stormTag.color,
                      cursor: 'pointer',
                      height: '6px',
                      marginBottom: '8px'
                    }}
                  />

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#888' }}>
                    <span>50mm (Light Rain)</span>
                    <span>180mm (Design Storm)</span>
                    <span>350mm (Cloudburst)</span>
                  </div>
                </div>
              )}

                <div className="section">
                  <h3>Climate Scenarios</h3>
                  <div className="scenario-controls" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                    <button 
                      className={`scenario-btn ${scenario === 'baseline' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('baseline')}
                      disabled={loading}
                    >
                      🌱 Current Climate
                    </button>
                    <button 
                      className={`scenario-btn ${scenario === 'rcp45' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('rcp45')}
                      disabled={loading}
                    >
                      🌡️ +2°C Scenario
                    </button>
                    <button 
                      className={`scenario-btn ${scenario === 'rcp45_rain_plus10' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('rcp45_rain_plus10')}
                      disabled={loading}
                    >
                      🌧️ +10% Rainfall
                    </button>
                    <button 
                      className={`scenario-btn ${scenario === 'rcp85' ? 'active' : ''}`}
                      onClick={() => onScenarioChange('rcp85')}
                      disabled={loading}
                      style={{
                        borderColor: scenario === 'rcp85' ? '#900C3F' : undefined,
                        background: scenario === 'rcp85' ? '#900C3F' : undefined,
                        color: scenario === 'rcp85' ? '#FFFFFF' : undefined
                      }}
                    >
                      ⛈️ RCP 8.5 (+20% Surge)
                    </button>
                  </div>
                </div>
            </div>
          )}

          {activeTab === 'analysis' && simulationData && (
            <div className="tab-content analysis-grid">
              <div className="analysis-row">
                <MetricsCard 
                  metrics={simulationData.metrics}
                  scenario={scenario}
                  loading={loading}
                />
                <EnvironmentalCard 
                  metrics={simulationData.metrics}
                  loading={loading}
                />
              </div>

              <PlanImpactCard 
                simulationData={simulationData}
                scenario={scenario}
                loading={loading}
              />

              {/* 24-Hour Storm Hydrograph Card */}
              <StormHydrographCard 
                rainIntensity={stormIntensity} 
                mitigationPct={mitigationReductionPct} 
              />
            </div>
          )}

          {activeTab === 'solutions' && simulationData && (
            <div className="tab-content">
              <div className="solutions-full-width">
                <InterventionsSection 
                  interventions={simulationData.interventions}
                  loading={loading}
                  simulationData={simulationData}
                  onMitigationChange={onMitigationChange}
                />
              </div>
              <div className="impact-section">
                <PlanImpactCard 
                  simulationData={simulationData} 
                  scenario={scenario} 
                  loading={loading} 
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FloatingPanel;