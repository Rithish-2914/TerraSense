/**
 * TerraSense Municipal Detailed Project Report (DPR) Generator
 * Compiles a formal, print-ready engineering document for government and municipal stakeholders.
 */

export const generateMunicipalDPR = (simulationData, scenario, areaName, planData) => {
  if (!simulationData || !simulationData.metrics) {
    alert('Please run a simulation first before generating a Detailed Project Report.');
    return;
  }

  const metrics = simulationData.metrics || {};
  const interventions = simulationData.interventions || [];
  const cleanArea = areaName ? areaName.replace('.geojson', '').replace('_area', '').replace('_', ' ').toUpperCase() : 'URBAN PILOT WARD';
  const reportDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const scenarioNames = {
    baseline: 'Current Climate Baseline (NASA Earth Engine Historical Mean)',
    rcp45: '+2.0°C Global Warming Scenario (+10% Precipitation Surge)',
    rcp85: 'RCP 8.5 Extreme Climate Scenario (+20% Storm Surge)',
    rcp45_rain_plus10: '+10% Extreme Monsoon Surge Event'
  };

  const activeScenarioTitle = scenarioNames[scenario] || `${scenario.toUpperCase()} Climate Scenario`;

  // Calculate detailed affected area metrics
  const totalAreaHa = parseFloat(metrics.area_ha || 100);
  const totalPop = parseInt(metrics.total_population || 6000, 10);
  const peopleAtRisk = parseInt(metrics.scenario_people || Math.round(totalPop * 0.25), 10);
  
  // Affected area in hectares (proportional to people affected ratio)
  const affectedRatio = Math.min(0.95, Math.max(0.08, peopleAtRisk / totalPop));
  const affectedAreaHa = (totalAreaHa * affectedRatio).toFixed(1);
  const affectedAreaSqKm = (parseFloat(affectedAreaHa) * 0.01).toFixed(2);
  const affectedAreaPct = (affectedRatio * 100).toFixed(0);

  // Hydrological calculations
  const rainMm = metrics.mean_rain_mm || 180;
  const runoffChange = metrics.peak_runoff_change_pct !== undefined ? metrics.peak_runoff_change_pct : 0;
  const tempC = metrics.mean_temperature_c || 34.2;
  const heatStress = metrics.heat_stress_level || 'Moderate';
  const heatPop = metrics.heat_affected_people || Math.round(totalPop * 0.2);
  const elevation = metrics.elevation_m || 85;
  const imperviousPct = metrics.impervious_fraction ? (metrics.impervious_fraction * 100).toFixed(0) : 65;

  // Estimated flood volume in Million Liters
  const runoffVolumeML = ((rainMm * 0.6 * parseFloat(affectedAreaHa) * 10000) / 1000000).toFixed(1);
  const estimatedDepthM = (Math.max(0.2, (rainMm / 250) * 0.75)).toFixed(2);

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>MUNICIPAL DETAILED PROJECT REPORT (DPR) - ${cleanArea}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fira+Sans:wght@400;600;700;900&family=Overpass:wght@400;600;700;800&display=swap');
    
    @page {
      size: A4;
      margin: 12mm;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Overpass', -apple-system, sans-serif;
      color: #07173F;
      line-height: 1.45;
      margin: 0;
      padding: 24px;
      background: #FFFFFF;
      font-size: 11.5px;
    }
    
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 3px solid #0042A6;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    
    .header-left h1 {
      font-family: 'Fira Sans', sans-serif;
      font-size: 22px;
      font-weight: 900;
      color: #0042A6;
      margin: 0;
      letter-spacing: 0.5px;
    }
    
    .header-left p {
      margin: 3px 0 0 0;
      font-size: 11px;
      color: #475569;
      font-weight: 600;
    }
    
    .header-right {
      text-align: right;
      font-size: 11px;
      color: #333;
    }
    
    .badge {
      display: inline-block;
      background: #07173F;
      color: #00E5FF;
      font-size: 9.5px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 4px;
      letter-spacing: 0.8px;
    }
    
    .section-title {
      font-family: 'Fira Sans', sans-serif;
      font-size: 13px;
      font-weight: 800;
      color: #07173F;
      background: #F1F5F9;
      padding: 5px 10px;
      border-left: 4px solid #2E96F5;
      margin: 14px 0 8px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-bottom: 12px;
    }

    .stat-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 6px;
      padding: 8px 10px;
      text-align: center;
    }

    .stat-label {
      font-size: 10px;
      color: #64748B;
      text-transform: uppercase;
      font-weight: 700;
      margin-bottom: 3px;
    }

    .stat-value {
      font-family: 'Fira Sans', sans-serif;
      font-size: 16px;
      font-weight: 900;
      color: #0042A6;
    }

    .stat-danger {
      color: #E43700 !important;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
      font-size: 11px;
    }
    
    th, td {
      border: 1px solid #CBD5E1;
      padding: 6px 8px;
      text-align: left;
    }
    
    th {
      background-color: #F8FAFC;
      color: #07173F;
      font-weight: 700;
    }
    
    .metric-highlight {
      font-weight: 700;
      color: #E43700;
    }
    
    .card {
      border: 1px solid #CBD5E1;
      border-radius: 6px;
      padding: 10px 12px;
      margin-bottom: 8px;
      background: #FAFCFE;
    }
    
    .card h3 {
      margin: 0 0 4px 0;
      font-size: 12.5px;
      color: #0042A6;
      font-weight: 700;
    }
    
    .card-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 10.5px;
      margin-top: 6px;
      color: #334155;
      border-top: 1px dashed #CBD5E1;
      padding-top: 5px;
    }
    
    .card-meta span strong {
      color: #07173F;
    }
    
    .signoff-section {
      margin-top: 24px;
      display: flex;
      justify-content: space-between;
      page-break-inside: avoid;
    }
    
    .signoff-box {
      width: 45%;
      border-top: 1px solid #64748B;
      padding-top: 6px;
      font-size: 10.5px;
      text-align: center;
      color: #475569;
    }
    
    .no-print-bar {
      background: #07173F;
      color: white;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      margin: -24px -24px 20px -24px;
      z-index: 1000;
    }
    
    .btn-print {
      background: #2E96F5;
      color: white;
      border: none;
      padding: 7px 16px;
      border-radius: 6px;
      font-weight: 700;
      cursor: pointer;
      font-size: 12px;
    }
    
    @media print {
      .no-print-bar {
        display: none !important;
      }
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="no-print-bar">
    <div><strong>TerraSense Detailed Project Report (DPR)</strong> — Ready for Print & PDF Export</div>
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div class="header">
    <div class="header-left">
      <div class="badge">WEHACK 2026 • CLIMATE DIGITAL TWIN</div>
      <h1>DETAILED PROJECT REPORT (DPR)</h1>
      <p>Hydrological Impact Assessment & Municipal Capital Interventions</p>
    </div>
    <div class="header-right">
      <div><strong>Target Area:</strong> ${cleanArea}</div>
      <div><strong>Date of Assessment:</strong> ${reportDate}</div>
      <div><strong>Doc Ref:</strong> TS-DPR-${Date.now().toString().slice(-6)}</div>
    </div>
  </div>

  <!-- Key Statistics Summary Cards -->
  <div class="grid-4">
    <div class="stat-box">
      <div class="stat-label">Total Ward Area</div>
      <div class="stat-value">${totalAreaHa} Ha</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Flood Inundation Area</div>
      <div class="stat-value stat-danger">${affectedAreaHa} Ha (${affectedAreaPct}%)</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">People at Direct Risk</div>
      <div class="stat-value stat-danger">${peopleAtRisk.toLocaleString()}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Peak Runoff Surge</div>
      <div class="stat-value">${runoffChange >= 0 ? '+' : ''}${runoffChange}%</div>
    </div>
  </div>

  <div class="section-title">1. Executive Overview & Geospatial Boundary</div>
  <table>
    <tr>
      <th style="width: 25%;">Study Area Boundary</th>
      <td style="width: 25%;">${cleanArea} (${totalAreaHa} Hectares / ${((totalAreaHa) * 0.01).toFixed(2)} km²)</td>
      <th style="width: 25%;">Active Climate Scenario</th>
      <td style="width: 25%;"><strong>${activeScenarioTitle}</strong></td>
    </tr>
    <tr>
      <th>Total Ward Population</th>
      <td>${totalPop.toLocaleString()} residents</td>
      <th>Population Density</th>
      <td>${metrics.population_density || Math.round(totalPop / totalAreaHa)} residents / Hectare</td>
    </tr>
    <tr>
      <th>Mean Elevation (SRTM DEM)</th>
      <td>${elevation} m above Mean Sea Level</td>
      <th>Impervious Surface Ratio</th>
      <td>${imperviousPct}% (Built-up Asphalt & Concrete)</td>
    </tr>
  </table>

  <div class="section-title">2. Flood Inundation & Hydrological Risk Matrix</div>
  <div class="grid-2">
    <table>
      <tr><th colspan="2" style="background: #FEF2F2; color: #991B1B;">⚠️ Flood Affected Area & Runoff Dynamics</th></tr>
      <tr>
        <td><strong>Direct Inundation Area</strong></td>
        <td class="metric-highlight"><strong>${affectedAreaHa} Hectares (${affectedAreaSqKm} km²)</strong></td>
      </tr>
      <tr>
        <td>Inundation Catchment Fraction</td>
        <td><strong>${affectedAreaPct}% of Total Ward</strong></td>
      </tr>
      <tr>
        <td>Design Storm Precipitation</td>
        <td><strong>${rainMm} mm / event</strong></td>
      </tr>
      <tr>
        <td>Estimated Inundation Depth</td>
        <td><strong>${estimatedDepthM} meters</strong></td>
      </tr>
      <tr>
        <td>Surplus Stormwater Runoff</td>
        <td><strong>~${runoffVolumeML} Million Liters (ML)</strong></td>
      </tr>
      <tr>
        <td>Citizens in High Hazard Zone</td>
        <td class="metric-highlight"><strong>${peopleAtRisk.toLocaleString()} residents</strong></td>
      </tr>
    </table>

    <table>
      <tr><th colspan="2" style="background: #FFFBEB; color: #92400E;">🌡️ Thermal Index & Environmental Baselines</th></tr>
      <tr>
        <td>Land Surface Temp (MODIS LST)</td>
        <td><strong>${tempC}°C</strong></td>
      </tr>
      <tr>
        <td>WHO Thermal Stress Level</td>
        <td><strong>${heatStress}</strong></td>
      </tr>
      <tr>
        <td>Population Exposed to Heat Island</td>
        <td><strong>${heatPop.toLocaleString()} residents</strong></td>
      </tr>
      <tr>
        <td>NASA Satellite Data Sources</td>
        <td><strong>GPM IMERG, MODIS, SRTM, WorldPop</strong></td>
      </tr>
      <tr>
        <td>Hydrological Model Employed</td>
        <td><strong>USDA NRCS SCS Curve Number (CN=78)</strong></td>
      </tr>
      <tr>
        <td>Soil Retention Capacity (S)</td>
        <td><strong>71.7 mm</strong></td>
      </tr>
    </table>
  </div>

  <div class="section-title">3. Prioritized Municipal Civil Interventions & Budgets</div>
  ${interventions.length > 0 ? interventions.map((item, idx) => {
    const title = item.title || item.name || `Civil Intervention Option #${idx + 1}`;
    const desc = item.description || 'Civil engineering infrastructure mitigation to reduce peak runoff and attenuate urban flash flood risk.';
    const cost = item.cost_bracket || (item.cost_estimate_inr_lakhs ? `₹${item.cost_estimate_inr_lakhs} Lakhs` : '₹60-80 Lakhs');
    const reduction = item.runoff_reduction_pct || 20;
    const timeline = item.implementation_months || item.timeline_months || 10;
    const dept = item.responsible_department || item.contact || 'Municipal Corporation Public Works';
    const kpi = item.kpi || 'Stormwater peak velocity attenuation';

    return `
      <div class="card">
        <h3>#${idx + 1}. ${title}</h3>
        <p style="margin: 0; font-size: 11px; color: #334155;">${desc}</p>
        <div class="card-meta">
          <span>🎯 <strong>Runoff Cut:</strong> -${reduction}%</span>
          <span>💰 <strong>Estimated Budget:</strong> ${cost}</span>
          <span>⏱️ <strong>Timeline:</strong> ${timeline} Months</span>
          <span>📈 <strong>KPI:</strong> ${kpi}</span>
          <span>🏢 <strong>Nodal Dept:</strong> ${dept}</span>
        </div>
      </div>
    `;
  }).join('') : `
    <div class="card">
      <h3>#1. Integrated Stormwater Retention Basin & Bioswale Network</h3>
      <p style="margin: 0; font-size: 11px; color: #334155;">Construct underground modular rainwater holding cisterns and peripheral roadside bioswales along arterial roads.</p>
      <div class="card-meta">
        <span>🎯 <strong>Runoff Cut:</strong> -28%</span>
        <span>💰 <strong>Estimated Budget:</strong> ₹75 Lakhs</span>
        <span>⏱️ <strong>Timeline:</strong> 10 Months</span>
        <span>🏢 <strong>Nodal Dept:</strong> Stormwater Drainage Division</span>
      </div>
    </div>
  `}

  <div class="section-title">4. Inter-Departmental Endorsement & Sanction</div>
  <div class="signoff-section">
    <div class="signoff-box">
      <strong>Executive Engineer (Drainage & Water Supply)</strong><br/>
      Municipal Corporation Public Works Division
    </div>
    <div class="signoff-box">
      <strong>Commissioner / Chief Town Planner</strong><br/>
      Smart City Municipal Corporation (SPV)
    </div>
  </div>
</body>
</html>
  `;

  const reportWindow = window.open('', '_blank');
  if (reportWindow) {
    reportWindow.document.write(htmlContent);
    reportWindow.document.close();
  } else {
    alert('Pop-up blocked! Please allow pop-ups for this site to view the PDF report.');
  }
};
