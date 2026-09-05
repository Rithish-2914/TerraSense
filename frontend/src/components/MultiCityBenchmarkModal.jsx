import React from 'react';

const CITIES_DATA = [
  {
    id: 'trichy',
    name: 'Trichy Pilot Ward',
    state: 'Tamil Nadu',
    basin: 'Cauvery River Catchment',
    fileName: 'trichy_area.geojson',
    areaHa: 100,
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
      background: 'rgba(7, 23, 63, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '1000px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.2)'
      }}>
        {/* Modal Header */}
        <div style={{
          background: 'linear-gradient(135deg, #07173F 0%, #0042A6 100%)',
          color: '#FFFFFF',
          padding: '20px 28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#00E5FF',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '4px'
            }}>
              WEHACK 2026 • NATIONAL SMART CITIES BENCHMARK
            </div>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '0.5px' }}>
              Multi-City Climate Vulnerability & Infrastructure Matrix
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              color: '#FFFFFF',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              fontSize: '18px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', overflowY: 'auto' }}>
          <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
            Comparative spatial benchmarking across 6 pre-calibrated Indian municipal study areas. Click <strong>"Simulate in Twin"</strong> to instantaneously switch the active digital twin location.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #CBD5E1' }}>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800' }}>City / Study Ward</th>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800' }}>Catchment Basin</th>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800' }}>Impervious %</th>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800' }}>Cloudburst Surge</th>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800' }}>Exposed Pop.</th>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800' }}>Required Budget</th>
                <th style={{ padding: '12px 10px', color: '#07173F', fontWeight: '800', textAlign: 'center' }}>Action</th>
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
                      transition: 'background 0.2s'
                    }}
                  >
                    <td style={{ padding: '12px 10px' }}>
                      <div style={{ fontWeight: '800', color: '#0042A6' }}>{city.name}</div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{city.state} ({city.areaHa} Ha)</div>
                    </td>
                    <td style={{ padding: '12px 10px', color: '#334155' }}>{city.basin}</td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{ fontWeight: '700', color: city.imperviousPct > 80 ? '#E43700' : '#07173F' }}>
                        {city.imperviousPct}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px' }}>
                      <span style={{
                        background: city.riskLevel === 'Critical' ? '#FEF2F2' : '#FFFBEB',
                        color: city.riskLevel === 'Critical' ? '#DC2626' : '#D97706',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: '800',
                        fontSize: '11px'
                      }}>
                        {city.cloudburstRisk}
                      </span>
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: '700', color: '#E43700' }}>
                      {city.peopleAtRisk.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 10px', fontWeight: '800', color: '#059669' }}>
                      {city.recommendedBudgetCr}
                    </td>
                    <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                      {isActive ? (
                        <span style={{
                          background: '#DBEAFE',
                          color: '#1D4ED8',
                          padding: '6px 12px',
                          borderRadius: '8px',
                          fontWeight: '800',
                          fontSize: '11px'
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
                            background: '#0042A6',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            fontWeight: '700',
                            fontSize: '11px',
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(0, 66, 166, 0.25)'
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

export default MultiCityBenchmarkModal;
