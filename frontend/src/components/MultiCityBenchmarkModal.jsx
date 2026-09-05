import React from 'react';

const CITIES_DATA = [
  {
    id: 'trichy',
    name: 'Trichy Pilot Ward',
    state: 'Tamil Nadu',
    basin: 'Cauvery River Catchment',
    fileName: 'trichy_area.geojson',
    areaHa: 100,
    elevationMsl: '+85m MSL',
    imperviousPct: 65,
    cloudburstRisk: 'Severe (+74%)',
    peopleAtRisk: 1480,
    lstTemp: '34.2°C',
    recommendedBudgetCr: '₹1.65 Cr',
    primaryIntervention: 'Smart Retention Basins & Bioswales',
    riskLevel: 'High'
  },
  {
    id: 'mumbai',
    name: 'Mumbai Metropolis',
    state: 'Maharashtra',
    basin: 'Mithi River & Arabian Sea Coast',
    fileName: 'mumbai_area.geojson',
    areaHa: 280,
    elevationMsl: '+8m MSL',
    imperviousPct: 84,
    cloudburstRisk: 'Critical (+115%)',
    peopleAtRisk: 5200,
    lstTemp: '36.8°C',
    recommendedBudgetCr: '₹4.80 Cr',
    primaryIntervention: 'Underground Holding Vaults & Mangrove Sinks',
    riskLevel: 'Critical'
  },
  {
    id: 'chennai',
    name: 'Chennai Coastal Ward',
    state: 'Tamil Nadu',
    basin: 'Adyar / Cooum Delta',
    fileName: 'chennai_area.geojson',
    areaHa: 210,
    elevationMsl: '+7m MSL',
    imperviousPct: 78,
    cloudburstRisk: 'Severe (+92%)',
    peopleAtRisk: 4100,
    lstTemp: '37.5°C',
    recommendedBudgetCr: '₹3.40 Cr',
    primaryIntervention: 'Inter-Connected Micro-Ponds & Sluice Gates',
    riskLevel: 'Critical'
  },
  {
    id: 'bangalore',
    name: 'Bangalore Lake Cascade',
    state: 'Karnataka',
    basin: 'Vrishabhavathi / Bellandur Basin',
    fileName: 'bangalore_area.geojson',
    areaHa: 190,
    elevationMsl: '+920m MSL',
    imperviousPct: 72,
    cloudburstRisk: 'High (+65%)',
    peopleAtRisk: 2900,
    lstTemp: '31.4°C',
    recommendedBudgetCr: '₹2.90 Cr',
    primaryIntervention: 'Lake Inflow Silt Traps & Permeable Pavements',
    riskLevel: 'High'
  },
  {
    id: 'delhi',
    name: 'Delhi Yamuna Floodplain',
    state: 'NCR',
    basin: 'Yamuna River Corridor',
    fileName: 'delhi_area.geojson',
    areaHa: 240,
    elevationMsl: '+216m MSL',
    imperviousPct: 81,
    cloudburstRisk: 'Severe (+88%)',
    peopleAtRisk: 4800,
    lstTemp: '39.8°C',
    recommendedBudgetCr: '₹4.10 Cr',
    primaryIntervention: 'Floodplain Sponge Wetlands & Cool Pavements',
    riskLevel: 'Critical'
  },
  {
    id: 'kolkata',
    name: 'Kolkata Delta Ward',
    state: 'West Bengal',
    basin: 'Hooghly Estuary & East Wetlands',
    fileName: 'kolkata_area.geojson',
    areaHa: 175,
    elevationMsl: '+9m MSL',
    imperviousPct: 76,
    cloudburstRisk: 'High (+70%)',
    peopleAtRisk: 3400,
    lstTemp: '35.0°C',
    recommendedBudgetCr: '₹2.75 Cr',
    primaryIntervention: 'Tidal Sluice Automation & Wetland Retention',
    riskLevel: 'High'
  }
];

const MultiCityBenchmarkModal = ({ isOpen, onClose, onSelectCity, currentCityName }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      background: 'rgba(15, 23, 42, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '1050px',
        maxHeight: '88vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.35)',
        overflow: 'hidden',
        border: '1px solid #CBD5E1',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        {/* Modal Header */}
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '18px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #1E3A8A'
        }}>
          <div>
            <div style={{
              fontSize: '10.5px',
              fontWeight: '800',
              color: '#94A3B8',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '3px'
            }}>
              SMART CITIES MISSION • NATIONAL VULNERABILITY INDEX
            </div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '800', letterSpacing: '0.3px', color: '#FFFFFF' }}>
              Multi-City Climate Digital Twin Comparative Matrix
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#FFFFFF',
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', background: '#F8FAFC' }}>
          <p style={{ margin: '0 0 14px 0', fontSize: '12.5px', color: '#475569', lineHeight: 1.5 }}>
            Calibrated spatial hydrology baselines across 6 Indian major municipal catchments. Click <strong>"Simulate in Twin"</strong> to switch the active spatial bounding box.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left', background: '#FFFFFF', borderRadius: '10px', overflow: 'hidden', border: '1px solid #E2E8F0' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800' }}>City / Catchment</th>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800' }}>River Basin</th>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800' }}>Elevation</th>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800' }}>Impervious</th>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800' }}>Cloudburst Surge</th>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800' }}>DPR Budget</th>
                <th style={{ padding: '10px 12px', color: '#0F172A', fontWeight: '800', textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {CITIES_DATA.map((city, idx) => {
                const isActive = currentCityName && currentCityName.toLowerCase().includes(city.id);
                return (
                  <tr 
                    key={city.id} 
                    style={{ 
                      borderBottom: '1px solid #E2E8F0',
                      background: isActive ? '#EFF6FF' : idx % 2 === 0 ? '#FFFFFF' : '#FAFCFE',
                      transition: 'background 0.15s'
                    }}
                  >
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: '800', color: '#1E3A8A' }}>{city.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{city.state} • {city.areaHa} Ha</div>
                    </td>
                    <td style={{ padding: '10px 12px', color: '#334155' }}>{city.basin}</td>
                    <td style={{ padding: '10px 12px', fontWeight: '700', color: '#0F172A' }}>{city.elevationMsl}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontWeight: '700', color: city.imperviousPct > 80 ? '#DC2626' : '#0F172A' }}>
                        {city.imperviousPct}%
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        background: city.riskLevel === 'Critical' ? '#FEF2F2' : '#FFFBEB',
                        color: city.riskLevel === 'Critical' ? '#DC2626' : '#D97706',
                        padding: '2px 7px',
                        borderRadius: '4px',
                        fontWeight: '800',
                        fontSize: '11px',
                        border: city.riskLevel === 'Critical' ? '1px solid #FECACA' : '1px solid #FDE68A'
                      }}>
                        {city.cloudburstRisk}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: '800', color: '#047857' }}>
                      {city.recommendedBudgetCr}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {isActive ? (
                        <span style={{
                          background: '#DBEAFE',
                          color: '#1D4ED8',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontWeight: '800',
                          fontSize: '10.5px'
                        }}>
                          ✓ Active Now
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            onSelectCity(city.fileName);
                            onClose();
                          }}
                          style={{
                            background: '#1E3A8A',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontWeight: '700',
                            fontSize: '11px',
                            cursor: 'pointer'
                          }}
                        >
                          Simulate in Twin
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MultiCityBenchmarkModal);
