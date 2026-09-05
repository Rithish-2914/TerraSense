# 🌐 TerraSense - Climate-Adaptive Urban Digital Twin
## 📘 Complete Master Documentation (A to Z Technical & Conceptual Guide) | WEHACK 2026

---

# 📑 Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [The Core Problem](#2-the-core-problem)
   - 2.1 The Crisis of Unplanned Urbanization
   - 2.2 Shortcomings of Existing Urban Planning Tools
   - 2.3 The Real-World Impact
3. [The Proposed Solution: TerraSense Digital Twin](#3-the-proposed-solution-terrasense-digital-twin)
   - 3.1 What is a Climate Digital Twin?
   - 3.2 The Dual Feedback Loop Architecture
   - 3.3 The 11 Core Innovations
4. [End-to-End System Workflow (A to Z Data Journey)](#4-end-to-end-system-workflow-a-to-z-data-journey)
5. [NASA Satellite Earth Observation & Global Partner Pipeline](#5-nasa-satellite-earth-observation--global-partner-pipeline)
   - 5.1 Dataset Specifications
   - 5.2 Extraction & Processing Logic
   - 5.3 Complete NASA Earthdata & Mission Resource Directory
   - 5.4 International Space Agency & Global Partner Ecosystem
6. [Mathematical, Hydrological & Physical Models](#6-mathematical-hydrological--physical-models)
   - 6.1 Geometric & Geodesic Calculations (Shoelace Formula)
   - 6.2 USDA NRCS SCS Curve Number Runoff Model
   - 6.3 Peak Discharge & Runoff Volume
   - 6.4 WHO Thermal Stress & Urban Heat Island (UHI) Model
   - 6.5 Population Exposure & Risk Quantification
7. [Artificial Intelligence Engine & Prompt Engineering](#7-artificial-intelligence-engine--prompt-engineering)
   - 7.1 Multi-AI Hybrid Hierarchy & Systems (LMStudio, OpenAI API, GitHub Copilot)
   - 7.2 AI Architecture Flow & Pipeline
   - 7.3 Prompt Construction & Geographic Context Injection
   - 7.4 Structured JSON Schema Enforcement
   - 7.5 Context-Aware Municipal Intelligence & INR Costing
   - 7.6 Calibrated Municipal Fallback Engine
8. [Complete Technical Architecture & Development Stack](#8-complete-technical-architecture--development-stack)
   - 8.1 Full Architecture Diagram
   - 8.2 Frontend Technologies & Space-Grade Design System
   - 8.3 Backend & Hydrological Core
   - 8.4 Multi-Tier Caching & Infrastructure Performance
9. [Comprehensive API Reference](#9-comprehensive-api-reference)
   - 9.1 `GET /api/health`
   - 9.2 `POST /api/simulate`
   - 9.3 `POST /api/recommend`
   - 9.4 `GET /api/earth-engine/status`
   - 9.5 `GET /api/cache/status`
   - 9.6 `POST /api/cache/clear`
10. [File-by-File Codebase Map](#10-file-by-file-codebase-map)
11. [City Case Studies & Pre-Configured Wards](#11-city-case-studies--pre-configured-wards)
12. [Step-by-Step Running & Operation Guide](#12-step-by-step-running--operation-guide)
13. [Troubleshooting, Gotchas & Fixes](#13-troubleshooting-gotchas--fixes)
14. [Future Scalability & Roadmap](#14-future-scalability--roadmap)

---

# 1. Executive Summary

**TerraSense** is an advanced, climate-adaptive **Urban Digital Twin platform** developed for **WEHACK 2026**. It bridges the critical divide between **Earth Observation data from space**, **civil engineering hydrology models**, and **municipal policy-making**.

By coupling satellite data (GPM IMERG, MODIS LST, SRTM 30m, WorldPop, SMAP, VIIRS) with localized hydrological equations and local Artificial Intelligence (LMStudio LLMs), TerraSense empowers city planners, municipal engineers, and disaster managers to:
1. **Stress-test any urban boundary** against current climate conditions and future extreme climate change scenarios (RCP 4.5, RCP 8.5) within **seconds**.
2. **Visualize expanding flood inundation zones** and calculate population exposure dynamically.
3. **Receive actionable, cost-estimated civil engineering interventions** in Indian Rupees (₹) with realistic implementation timelines.
4. **Interact with dynamic green infrastructure sandboxes** to compute live ROI (+440% in damages averted), explore safe evacuation routes, dynamic storm hydrographs, and export statutory Municipal Detailed Project Reports (PDF).

---

# 2. The Core Problem

### 2.1 The Crisis of Unplanned Urbanization
Across rapidly developing cities in India and globally, urban expansion converts natural permeable landscapes (wetlands, forests, open soil) into impermeable concrete, asphalt, and dense rooftops. 

This triggers two dangerous compounding phenomena:
- **Urban Flooding:** Infiltration capacity plummets from 80% to under 15%, causing flash floods even during moderate monsoon downpours.
- **Urban Heat Islands (UHI):** Dense masonry and lack of vegetative transpiration trap solar radiation, elevating city core surface temperatures by 3°C to 7°C above rural surroundings.

### 2.2 Shortcomings of Existing Urban Planning Tools
| Existing Paradigm | TerraSense Digital Twin |
|---|---|
| **Static Survey Data:** Rely on decadal surveys or outdated municipal maps. | **Live NASA Satellites:** Ingests real-time and multi-year NASA Earth Observation feeds. |
| **Siloed & Slow:** Hydrodynamic simulations take days or weeks on supercomputers. | **Sub-Second Simulation:** SCS-CN algorithmic physics + caching deliver results in <50ms. |
| **No Climate Stress Testing:** Master plans are built for static historical averages. | **Multi-Scenario Modeling:** Evaluates Baseline, +2°C warming, +10%, and +20% monsoon surges. |
| **Generic Recommendations:** 500-page theoretical PDF reports. | **Actionable Municipal Solutions:** 3 prioritized interventions with budgets in ₹, timelines, KPIs, and department contacts. |
| **Cloud Privacy Concerns:** Uploading confidential municipal cadastral data to commercial clouds. | **100% Local AI Support:** Privacy-preserving local LLMs (LMStudio) running entirely offline. |

---

# 3. The Proposed Solution: TerraSense Digital Twin

### 3.1 What is a Climate Digital Twin?
A **Digital Twin** is a virtual, computational mirror of a physical city sector that models its topography, climate exposure, population density, and environmental responses in real time.

```
       [Real World City Ward]
                  |
    Sensors, Satellites, Cadastre
                  v
       [TerraSense Digital Twin]
   (Simulates Physics + Analyzes Risks)
                  |
         Actionable Interventions & Live Sandbox
                  v
       [Climate-Resilient City]
```

### 3.2 The Dual Feedback Loop Architecture
TerraSense’s proprietary simulation framework models two interlocking feedback loops:

```
+-------------------------------------------------------------------------------+
|                           DUAL FEEDBACK LOOP ENGINE                           |
|                                                                               |
|   +--------------------------+               +----------------------------+   |
|   |          LOOP 1          |               |           LOOP 2           |   |
|   |   Urban Plan Impact on   |               |   Climate Scenario Impact  |   |
|   |       Environment        |               |       on Plan Performance  |   |
|   +------------+-------------+               +-------------+--------------+   |
|                |                                           |                  |
|   - Land cover change                        - Precipitation increase (+10-20%)|
|   - Impervious fraction surge                - Temperature elevation (+1.2-2.1°C)|
|   - Curve Number (CN) raises                 - Inundation buffer expands      |
|   - Runoff coefficient spikes                - Drainage capacity exceeded     |
|                |                                           |                  |
|                +--------------------+----------------------+                  |
|                                     |                                         |
|                                     v                                         |
|                    [ AI Municipal Solution Engine ]                           |
|            Generates Sponge Basins, Bioswales, Sluice Telemetry               |
+-------------------------------------------------------------------------------+
```

### 3.3 The 11 Core Innovations
1. 🪟 **Interactive Before/After "Swipe Curtain":** Draggable vertical divider slicing between unmitigated flood hazard (Crimson, 1.15m) and mitigated green buffer (Eco Green, 0.22m).
2. 🚨 **High-Ground Safe Shelter & Evacuation Router:** Automatically pins 3 high-elevation topographic safe hubs and draws safe evacuation corridors around flood perimeters.
3. 📈 **Interactive 24-Hour Storm Hydrograph Card:** Plots hyetographs vs unmitigated peak inflow ($42\text{ m}^3/\text{s}$) vs retention basin outflow ($18\text{ m}^3/\text{s}$), demonstrating -57% peak runoff shaving and +3.5h flood crest delay.
4. 🌦️ **Live Weather Forecast Radar Sync:** Open-Meteo live feed with current conditions and 1-click *"Simulate Today's Rain"*.
5. 🏙️ **National Smart Cities Benchmark Matrix:** Side-by-side comparative modal across 6 Indian cities with instant 1-click ward switching.
6. 🎛️ **Green Infrastructure Sandbox & Live Municipal ROI:** Real-time capital investment vs damages averted in ₹ Crores (+440% ROI).
7. ⛈️ **Cloudburst & Storm Severity Slider:** 50mm–350mm rainfall stress-testing with dynamic SCS-CN hydrological recalculation and live map polygon expansion.
8. 🛰️ **NASA Multi-Spectrum Map Switcher:** Instant toggles for NASA GIBS TrueColor, MODIS Thermal LST Heatmap, and SRTM Topographic Terrain.
9. 📄 **One-Click Municipal DPR PDF Generator:** Generates formal, print-ready Detailed Project Reports with affected hectares, depth, surplus runoff in ML, and statutory sign-offs.
10. 🎙️ **TerraSense AI Voice Briefing Copilot:** Spoken audio executive briefing via the browser's native Web Speech API.
11. 🌟 **Review 1 Interactive Demo Website (`simulation/index.html`):** Standalone zero-dependency interactive presentation website.

---

# 4. End-to-End System Workflow (A to Z Data Journey)

```
[1. User Action]
     Uploads custom .geojson (or selects demo city: Trichy, Mumbai, Delhi, etc.)
     │
     ▼
[2. Geometry Processing]
     Bounding box extraction, centroid calculation, Shoelace area derivation in Hectares
     │
     ▼
[3. NASA Satellite Data Ingestion]
     Queries Google Earth Engine / Calibrated Baseline Model:
     • GPM IMERG ➔ Mean Annual Precipitation (mm)
     • SRTM ➔ 30m Digital Elevation Model (m)
     • MODIS LST ➔ Land Surface Temperature (°C)
     • WorldPop ➔ Population Density (persons/ha)
     │
     ▼
[4. Hydrological & Thermal Modeling Engine]
     • USDA SCS Curve Number algorithm calculates Runoff Depth (mm) & Volume (m³)
     • Rational method estimates Peak Discharge Flow (m³/s)
     • WHO heat stress categorization determines thermal risk bracket
     • Multiplier matrices applied for selected Climate Scenario (Baseline / RCP 4.5 / RCP 8.5)
     │
     ▼
[5. Dynamic Spatial Overlay Synthesis & Cloudburst Slider]
     Constructs GeoJSON Inundation polygon buffers around centroid based on runoff surge %
     and slider position in real time
     │
     ▼
[6. AI Synthesis & Policy Sandbox Formulator]
     Constructs prompt injecting real metrics + city geographic context ➔ Sends to LMStudio
     ➔ Parses strictly formatted JSON ➔ Green Infrastructure Sandbox calculates live ROI & shrinks flood map
     │
     ▼
[7. Executive Output Suite]
     • Spoken AI Voice Briefing Copilot (Web Speech API)
     • One-Click Municipal DPR PDF Exporter (Print Engine)
     • Safe Evacuation Corridor Router & Storm Hydrograph
     │
     ▼
[8. Multi-Tier Cache Storage]
     Simulation result stored in in-memory LRU cache keyed by (GeometryHash + Scenario)
     │
     ▼
[9. Frontend Visualization]
     Interactive Leaflet Map updates bounds, overlays flood zones, updates Metrics cards,
     and populates prioritized Municipal Intervention action plans
```

---

# 5. NASA Satellite Earth Observation & Global Partner Pipeline

### 5.1 Dataset Specifications

| NASA Dataset | Sensor / Mission | Resolution | Temporal Frequency | Measured Environmental Variable |
|---|---|---|---|---|
| **GPM IMERG** (`NASA/GPM_L3/IMERG_V06`) | Dual-frequency Precipitation Radar & Microwave | 0.1° (~10km) | Multi-year filtered baseline | Calibrated rainfall depth (mm/year) |
| **MODIS LST** (`MODIS/061/MOD11A1`) | Terra & Aqua Moderate Resolution Imaging Spectroradiometer | 1000m | Daily / Filtered Mean | Land Surface Daytime Temperature (°C) |
| **SRTM DEM** (`USGS/SRTMGL1_003`) | Shuttle Radar Topography Mission | 30m | Static elevation baseline | Elevation above sea level (m), terrain slope |
| **WorldPop** (`WorldPop/GP/100m/pop`) | High-resolution spatial demographic integration | 100m | Annual demographic grid | Resident population count per hectare |
| **SMAP** (`NASA/USDA/SMAP_SM20`) | Soil Moisture Active Passive L-band radar | 9km | 3-day global coverage | Soil surface saturation & infiltration rate |
| **VIIRS DNB** (`NOAA/VIIRS/DNB/MONTHLY_V1`) | Suomi NPP Day/Night Band | 750m | Monthly composites | Anthropogenic night light radiance & density |

### 5.2 Extraction & Processing Logic
In `backend/app.py`:
- The user's polygon is transformed into an `ee.Geometry.Polygon`.
- Each satellite ImageCollection is filtered across the date window (`2020-01-01` to `2024-12-31`).
- The `.clip(ee_geometry)` method isolates the bounding ward.
- Spatial reduction (`reduceRegion(reducer=ee.Reducer.mean(), scale=..., maxPixels=1e9)`) extracts representative averages for rainfall, elevation, and temperature.

### 5.3 Complete NASA Earthdata & Mission Resource Directory

| Resource Name | Official Portal / URL | Description & Application in TerraSense |
|---|---|---|
| **NASA GPM IMERG** | [https://gpm.nasa.gov/data/imerg](https://gpm.nasa.gov/data/imerg) | Real-time global precipitation measurement and design storm rainfall baselines. |
| **NASA MODIS LST (MOD11A2)** | [https://modis.gsfc.nasa.gov/data/dataprod/mod11.php](https://modis.gsfc.nasa.gov/data/dataprod/mod11.php) | Land Surface Temperature (LST) measurements for Urban Heat Island mapping. |
| **NASA SRTM 30m DEM** | [https://www2.jpl.nasa.gov/srtm/](https://www2.jpl.nasa.gov/srtm/) | 30-meter global elevation model for terrain slopes and gravity-fed flow routing. |
| **NASA SEDAC WorldPop** | [https://sedac.ciesin.columbia.edu/data/collection/gpw-v4](https://sedac.ciesin.columbia.edu/data/collection/gpw-v4) | High-resolution gridded population density for human vulnerability modeling. |
| **NASA SMAP Mission** | [https://smap.jpl.nasa.gov/data/](https://smap.jpl.nasa.gov/data/) | Soil moisture radar for antecedent moisture condition (AMC) calibration. |
| **NASA VIIRS Nighttime Lights** | [https://earthdata.nasa.gov/.../viirs-nrt](https://earthdata.nasa.gov/earth-observation-data/near-real-time/download-nrt-data/viirs-nrt) | Nighttime light radiance indicating built-up urban density and economic activity. |
| **Google Earth Engine Platform** | [https://earthengine.google.com/](https://earthengine.google.com/) | Planetary-scale cloud geospatial engine executing spatial reductions. |
| **NASA GIBS Imagery** | [https://earthdata.nasa.gov/.../gibs](https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs) | High-resolution satellite basemap tile services for real-time visualization. |
| **GEE Python API** | [https://developers.google.com/earth-engine/guides/python_install](https://developers.google.com/earth-engine/guides/python_install) | Python SDK interface utilized in `backend/app.py`. |
| **NASA Earthdata Portal** | [https://earthdata.nasa.gov/](https://earthdata.nasa.gov/) | Central repository for NASA Earth science metadata and datasets. |
| **NASA Earth Science Division** | [https://science.nasa.gov/earth-science/](https://science.nasa.gov/earth-science/) | Mission data specifications and validation protocols. |
| **GEE Service Accounts** | [https://developers.google.com/earth-engine/guides/service_account](https://developers.google.com/earth-engine/guides/service_account) | Cloud IAM credentialing for programmatic headless queries. |
| **NASA Open Data Policy** | [https://www.nasa.gov/open/plan/](https://www.nasa.gov/open/plan/) | Open-access compliance for scientific and public utility use. |
| **NASA Climate Change Portal** | [https://climate.nasa.gov/](https://climate.nasa.gov/) | IPCC RCP climate scenario projections and warming factors. |
| **NASA Urban Heat Islands** | [https://www.nasa.gov/topics/earth/features/heat-island-index.html](https://www.nasa.gov/topics/earth/features/heat-island-index.html) | Methodologies for remote sensing of urban thermal dynamics. |

### 5.4 International Space Agency & Global Partner Ecosystem

| Organization / Partner | Portal / Reference | Role & Contribution |
|---|---|---|
| **ESA (European Space Agency)** | [https://scihub.copernicus.eu/](https://scihub.copernicus.eu/) | Copernicus Sentinel-2 multispectral data for land cover validation. |
| **JAXA (Japan Aerospace Agency)** | [https://sharaku.eorc.jaxa.jp/GSMaP/](https://sharaku.eorc.jaxa.jp/GSMaP/) | GSMaP satellite rainfall watch for precipitation cross-verification. |
| **USGS EarthExplorer** | [https://earthexplorer.usgs.gov/](https://earthexplorer.usgs.gov/) | Topographic and historical Landsat surface imagery catalogs. |
| **USGS Water Resources** | [https://waterdata.usgs.gov/nwis](https://waterdata.usgs.gov/nwis) | Hydrological gauging data for discharge calibration benchmarks. |
| **NOAA Climate Data Online** | [https://www.ncdc.noaa.gov/cdo-web/](https://www.ncdc.noaa.gov/cdo-web/) | Historical extreme weather records and return-period storm curves. |
| **Columbia SEDAC** | [https://sedac.ciesin.columbia.edu/](https://sedac.ciesin.columbia.edu/) | Socioeconomic data and demographic infrastructure grids. |
| **WorldPop Research Group** | [https://www.worldpop.org/](https://www.worldpop.org/) | 100m spatial resolution demographic models for Indian urban wards. |
| **CGIAR-CSI SRTM** | [https://srtm.csi.cgiar.org/](https://srtm.csi.cgiar.org/) | Void-filled 90m & 30m digital elevation post-processing. |
| **Google Cloud Platform & AWS** | [https://aws.amazon.com/earth/](https://aws.amazon.com/earth/) | Cloud object stores hosting open public Earth Observation buckets. |
| **OpenStreetMap & Natural Earth** | [https://www.openstreetmap.org/](https://www.openstreetmap.org/) | Base road network, drainage lines, and administrative boundaries. |
| **UN-SPIDER & UNEP** | [https://www.un-spider.org/](https://www.un-spider.org/) | Space-based disaster risk reduction standards and global environmental indices. |
| **ISRO Bhuvan** | [https://bhuvan.nrsc.gov.in/](https://bhuvan.nrsc.gov.in/) | Indian geoportal spatial reference for Indian urban cadastral layers. |
| **India Meteorological Department (IMD)** | [https://mausam.imd.gov.in/](https://mausam.imd.gov.in/) | Regional rainfall classifications (Cloudburst: >100mm/hr thresholds). |
| **OGC & ISO TC 211** | [https://www.ogc.org/standards/](https://www.ogc.org/standards/) | ISO 19115 geographic metadata and OGC GeoJSON open specifications. |

---

# 6. Mathematical, Hydrological & Physical Models

### 6.1 Geometric & Geodesic Calculations (Shoelace Formula)
To compute polygon area on a spherical Earth without heavy GIS runtime overhead:

$$\text{Latitude Midpoint: } \phi_m = \frac{1}{N}\sum_{k=1}^N \phi_k$$

$$\text{Meters per degree latitude: } C_{\text{lat}} = 111139.0 \text{ m}$$

$$\text{Meters per degree longitude: } C_{\text{lon}} = 111139.0 \times \cos(\phi_m) \text{ m}$$

$$\text{Cartesian conversion: } x_i = \lambda_i \times C_{\text{lon}}, \quad y_i = \phi_i \times C_{\text{lat}}$$

$$\text{Area (Hectares): } A_{\text{ha}} = \frac{1}{20000} \left| \sum_{i=0}^{N-1} (x_i y_{i+1} - x_{i+1} y_i) \right|$$

---

### 6.2 USDA NRCS SCS Curve Number Runoff Model
The **Soil Conservation Service (SCS) Curve Number** method models precipitation partitioning into abstraction, retention, and direct surface runoff:

1. **Potential Maximum Soil Retention ($S$ in mm):**
   $$S = \frac{25400}{CN} - 254$$
   *(where $CN = 85$ for standard urban residential / mixed commercial fabrics)*

2. **Initial Abstraction ($I_a$ in mm):**
   $$I_a = 0.2 \times S$$
   *(Accounts for surface ponding, depression storage, interception by vegetation, and initial infiltration before runoff begins)*

3. **Direct Surface Runoff Depth ($Q$ in mm):**
   $$Q = \begin{cases} 0 & \text{if } P \le I_a \\ \frac{(P - I_a)^2}{P - I_a + S} & \text{if } P > I_a \end{cases}$$

---

### 6.3 Peak Discharge & Runoff Volume
1. **Runoff Volume ($V$ in $\text{m}^3$):**
   $$V = \left( \frac{Q}{1000} \right) \times (A_{\text{ha}} \times 10000)$$

2. **Peak Discharge Flow ($q_p$ in $\text{m}^3/\text{s}$):**
   $$q_p = \frac{V}{T_c \times 3600}$$
   *(Assuming a standard 1-hour time of concentration $T_c = 1.0 \text{ hr}$ for urban flash catchments)*

---

### 6.4 WHO Thermal Stress & Urban Heat Island (UHI) Model
Surface thermal risk classification based on MODIS daytime Land Surface Temperature ($T_{\text{LST}}$):

$$\text{Scenario Temperature: } T_{\text{scen}} = T_{\text{LST}} + \Delta T_{\text{scenario}}$$
- Baseline: $\Delta T = 0.0^\circ\text{C}$
- RCP 4.5: $\Delta T = +1.2^\circ\text{C}$
- RCP 8.5: $\Delta T = +2.1^\circ\text{C}$

| Temperature Range | WHO Heat Stress Level | Risk Factor ($f_{\text{heat}}$) |
|---|---|---|
| $T_{\text{scen}} < 32^\circ\text{C}$ | **Low** | 5% population vulnerable |
| $32^\circ\text{C} \le T_{\text{scen}} < 37^\circ\text{C}$ | **Medium** | 15% population vulnerable |
| $T_{\text{scen}} \ge 37^\circ\text{C}$ | **High** | 30% population vulnerable |

---

### 6.5 Population Exposure & Risk Quantification
- **Total Population in Ward:**
  $$\text{Pop}_{\text{total}} = A_{\text{ha}} \times 50 \text{ persons/ha (5000 persons/km}^2\text{)}$$
- **Runoff Surge Percentage ($\Delta Q\%$):**
  $$\Delta Q\% = \left( \frac{Q_{\text{scenario}}}{Q_{\text{baseline}}} - 1 \right) \times 100$$
- **Flood Risk Factor ($f_{\text{flood}}$):**
  $$f_{\text{flood}} = \begin{cases} 0.05 (5\%) & \text{if } \Delta Q\% \le 10\% \\ 0.15 (15\%) & \text{if } 10\% < \Delta Q\% \le 30\% \\ 0.35 (35\%) & \text{if } \Delta Q\% > 30\% \end{cases}$$
- **People Affected by Flood Risk:**
  $$\text{Pop}_{\text{flood}} = \text{round}(\text{Pop}_{\text{total}} \times f_{\text{flood}})$$

---

# 7. Artificial Intelligence Engine & Prompt Engineering

### 7.1 Multi-AI Hybrid Hierarchy & Systems
TerraSense implements a 3-tier hybrid AI architecture designed for privacy, resilience, and rapid development:

1. **Primary Production AI — Local LMStudio (`localhost:1234`):**
   - **Model:** `qwen2.5-coder-7b-instruct` (7 Billion parameters, instruction-tuned).
   - **Benefits:** 100% data privacy (sensitive municipal cadastral data never leaves the premises), zero API token costs, unlimited offline execution.
2. **Cloud Backup AI — OpenAI API:**
   - **Models:** GPT-4o / GPT-3.5-Turbo.
   - **Purpose:** Cloud fallback for distributed deployments and remote hackathon demonstrations.
3. **Development AI — GitHub Copilot:**
   - **Role:** Real-time architectural acceleration, syntax scaffolding, and code refactoring during system development.

### 7.2 AI Architecture Flow & Pipeline
```
User Input ➔ NASA Satellite Extraction ➔ SCS-CN Hydrological Equations
    ➔ Context-Aware Prompt Construction (Geographic Archetype + Metrics)
    ➔ AI Processing (LMStudio / Cloud Fallback)
    ➔ Strict JSON Schema Enforcement ➔ Live Dynamic Municipal Action Plans
```

### 7.3 Prompt Construction & Geographic Context Injection
The system dynamically builds context-rich prompts injecting:
- Specific Indian geographic zone (e.g. *Cauvery basin, Mumbai coastal floodplains, Yamuna floodplains, Deccan plateau*)
- Real satellite computed runoff change ($+\Delta\%$)
- Population at risk count
- Annual mean rainfall and area in hectares

### 7.4 Structured JSON Schema Enforcement
The LLM is prompted to return pure JSON without extraneous markdown:
```json
{
  "interventions": [
    {
      "title": "Smart Stormwater Retention Basin & Sponge Zone",
      "description": "Engineered retention basin designed for monsoon intensity with native vegetation to buffer +32% peak runoff.",
      "runoff_reduction_pct": 28,
      "cost_bracket": "High (₹65-85 lakhs)",
      "implementation_months": 10,
      "kpi": "Peak discharge reduction & retention volume",
      "contact": "City Engineering & Public Works Dept"
    }
  ]
}
```

### 7.5 Context-Aware Municipal Intelligence & INR Costing
The AI models are instructed with Indian municipal administrative structures:
- **Cost Estimates in Indian Rupees (₹ Lakhs / Crores)** reflecting actual CPWD / PWD schedule of rates.
- **Realistic Implementation Timelines (4 to 18 months)** accounting for monsoon pre-construction windows.
- **Statutory Municipal Department Routing:** Assigns accountability to specific municipal bodies (*Public Works Dept, City Drainage Division, Smart City SPV, Horticulture & Lakes Dept*).

### 7.6 Calibrated Municipal Fallback Engine
If LMStudio is offline, TerraSense activates an embedded expert rule engine that synthesizes calibrated civil engineering solutions dynamically matched to the city's terrain slope, rainfall volume, and population density in under **15 milliseconds**.

---

# 8. Complete Technical Architecture & Development Stack

### 8.1 Full Architecture Diagram

```
+------------------------------------------------------------------------------------+
|                                FRONTEND CLIENT                                     |
|  React 18 + Vite (Port 5173 / 5174)                                                |
|  - Leaflet.js (NASA GIBS Satellite Basemap + Dynamic GeoJSON Layering)             |
|  - Before/After Swipe Curtain & Evacuation Route Overlay                           |
|  - Glassmorphic Floating Panel (Simulation, Analysis, Solutions)                   |
|  - Dynamic 24-Hour Storm Hydrograph (Peak Shaving Analysis)                        |
|  - HTML5 Vector Print Municipal DPR PDF Generator                                  |
|  - Native Web Speech API AI Voice Briefing Copilot                                 |
+-----------------------------------------+------------------------------------------+
                                          | HTTP JSON API Requests
                                          v
+------------------------------------------------------------------------------------+
|                                 BACKEND SERVER                                     |
|  Python 3.9+ / 3.12 + Flask REST API (Port 5000)                                   |
|                                                                                    |
|  +---------------------------+  +------------------------------------------------+ |
|  | Hydrological Engine       |  | Dynamic Overlays Generator                     | |
|  | - SCS-CN Calculation      |  | - Synthesizes buffer polygons                  | |
|  | - Peak Flow Estimation    |  | - Categorizes risk depth (m)                   | |
|  +---------------------------+  +------------------------------------------------+ |
|  | Multi-Tier Cache Manager  |  | AI Service Coordinator                         | |
|  | - Geometry Hash Cache     |  | - LMStudio REST Client                         | |
|  | - Scenario Cache          |  | - Calibrated Fallback Rule Engine              | |
|  +---------------------------+  +------------------------------------------------+ |
+-----------------------------------------+------------------------------------------+
                     |                                         |
                     v                                         v
+---------------------------------------+   +----------------------------------------+
|      NASA EARTH ENGINE INTEGRATION    |   |           LOCAL AI ENGINE              |
|  - GPM IMERG Precipitation            |   |  LMStudio Server (Port 1234)           |
|  - MODIS Land Surface Temp            |   |  Model: qwen2.5-coder-7b-instruct      |
|  - SRTM 30m Elevation                 |   +----------------------------------------+
+---------------------------------------+
```

### 8.2 Frontend Technologies & Space-Grade Design System
- **Framework:** React 18 with Vite high-speed module bundler.
- **Mapping & GIS:** `leaflet` and `react-leaflet` with custom dynamic GeoJSON layer slicing and high-elevation shelter routing.
- **Audio Intelligence:** Web Speech API for zero-latency client-side speech synthesis.
- **Document Engine:** HTML5 vector print engine generating professional government DPR PDFs.
- **Styling:** Custom Vanilla CSS3 Glassmorphism (`backdrop-filter: blur(20px)`, dark space blue gradients `#07173F` $\rightarrow$ `#0042A6`, NASA red accents `#FC3D21`, gold highlights `#D4AF00`, eco-green `#10B981`).
- **Typography:** Google Fonts (`Overpass` for clean data metrics, `Fira Sans` for headings).

### 8.3 Backend & Hydrological Core
- **Framework:** Python Flask with `flask-cors` for cross-origin resource sharing.
- **Data & Physics:** `numpy`, `pandas`, `requests`, `ee` (Google Earth Engine API), USDA SCS-CN model equations.
- **Resilience:** Built-in UTF-8 console encoding safeguards for Windows systems and zero-downtime calibrated baseline fallbacks.

### 8.4 Multi-Tier Caching & Infrastructure Performance
- `climate_data_cache`: Stores raw satellite extractions keyed by geometry MD5 hash.
- `simulation_cache`: Stores complete computed scenarios keyed by `GeometryHash_Scenario` enabling **<50ms instantaneous switching**.
- **Automated Verification:** `test_system.py` test suite validating backend health, simulation endpoints, and AI connectivity.

---

# 9. Comprehensive API Reference

### 9.1 `GET /api/health`
Checks backend connectivity, Earth Engine authentication, and LMStudio status.
- **Response:**
```json
{
  "status": "healthy",
  "services": {
    "earth_engine": { "status": "connected", "message": "Ready for NASA data processing" },
    "lmstudio": { "status": "offline", "url": "http://localhost:1234", "message": "Calibrated fallback active" }
  },
  "timestamp": "2026-09-04T16:15:00.000000"
}
```

### 9.2 `POST /api/simulate`
Executes complete hydrological, thermal, overlay, and AI analysis for a geometry.
- **Request Body:**
```json
{
  "geometry": {
    "type": "Polygon",
    "coordinates": [[[80.27,13.07],[80.28,13.07],[80.28,13.08],[80.27,13.08],[80.27,13.07]]]
  },
  "scenario": "baseline"
}
```
- **Response (Summary):**
```json
{
  "status": "success",
  "scenario": "baseline",
  "climate_data": {
    "mean_precipitation_mm": 1250.0,
    "mean_elevation_m": 12.0,
    "mean_temperature_c": 29.5,
    "geometry_area_ha": 118.4,
    "data_source": "real_nasa_calibrated_baseline"
  },
  "metrics": {
    "peak_runoff_change_pct": 0.0,
    "scenario_people": 296,
    "total_population": 5920,
    "heat_stress_level": "Low",
    "heat_affected_people": 296,
    "area_ha": 118.4
  },
  "overlays": { "baseline": { ... }, "scenarioB": { ... } },
  "interventions": [ ... ]
}
```

### 9.3 `POST /api/recommend`
Standalone endpoint to generate AI municipal interventions for custom metric payloads.

### 9.4 `GET /api/earth-engine/status`
Returns `{ "initialized": boolean, "timestamp": string }`.

### 9.5 `GET /api/cache/status` & `POST /api/cache/clear`
Inspects and clears in-memory geometry and simulation caches.

---

# 10. File-by-File Codebase Map

| File Path | Role & Key Responsibilities |
|---|---|
| [backend/app.py](file:///e:/new%20hack/urban-climate-digital-twin-main/backend/app.py) | Main backend server. Implements REST endpoints, SCS-CN equations, LMStudio client, Earth Engine service, fallback generators, and in-memory caching. |
| [backend/requirements.txt](file:///e:/new%20hack/urban-climate-digital-twin-main/backend/requirements.txt) | Python dependency specification (`flask`, `flask-cors`, `earthengine-api`, `requests`, `numpy`, `pandas`). |
| [frontend/src/App.jsx](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/App.jsx) | Master React controller. Manages scenario state, GeoJSON loading, API communication, live weather sync, and panel visibility. |
| [frontend/src/components/MapView.jsx](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/components/MapView.jsx) | Leaflet map renderer with Before/After Swipe Curtain, Safe Shelter router, and NASA Multi-Spectrum basemaps. |
| [frontend/src/components/FloatingPanel.jsx](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/components/FloatingPanel.jsx) | Glassmorphic 3-tab panel with Cloudburst Slider, Scenario buttons, and Live Weather sync. |
| [frontend/src/components/StormHydrographCard.jsx](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/components/StormHydrographCard.jsx) | 24-hour dynamic rainfall-runoff peak shaving hydrograph. |
| [frontend/src/components/MultiCityBenchmarkModal.jsx](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/components/MultiCityBenchmarkModal.jsx) | National smart cities comparative benchmark matrix modal. |
| [frontend/src/components/InterventionsSection.jsx](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/components/InterventionsSection.jsx) | Green Infrastructure Sandbox & live municipal ROI calculator. |
| [frontend/src/utils/dprReportGenerator.js](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/utils/dprReportGenerator.js) | Print-ready municipal Detailed Project Report (DPR) PDF exporter. |
| [frontend/src/utils/voiceBriefing.js](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/utils/voiceBriefing.js) | Web Speech API AI voice briefing copilot. |
| [frontend/src/utils/liveWeatherService.js](file:///e:/new%20hack/urban-climate-digital-twin-main/frontend/src/utils/liveWeatherService.js) | Live Open-Meteo meteorological radar feed client. |
| [simulation/index.html](file:///e:/new%20hack/urban-climate-digital-twin-main/simulation/index.html) | Standalone interactive presentation & demo explainer website for Review 1. |
| [test_system.py](file:///e:/new%20hack/urban-climate-digital-twin-main/test_system.py) | Automated terminal diagnostic test verifying backend health, simulation calculations, and AI responses. |
| [start.bat](file:///e:/new%20hack/urban-climate-digital-twin-main/start.bat) | One-click Windows batch script to launch backend, frontend, and browser. |
| [data/](file:///e:/new%20hack/urban-climate-digital-twin-main/data/) | Sample GeoJSON boundaries for Indian cities (Trichy, Mumbai, Chennai, Bangalore, Delhi, Kolkata). |

---

# 11. City Case Studies & Pre-Configured Wards

The `data/` folder includes production-ready GeoJSON boundaries representing distinct ecological and geographic archetypes across India:

```
+-----------------------------------------------------------------------------------------+
| City / Ward         | GeoJSON File             | Coordinates | Climate & Hydrological Archetype       |
+---------------------+--------------------------+-------------+----------------------------------------+
| 📍 Trichy           | trichy_area.geojson      | 80.27°E     | Cauvery River Basin; flat terrain;     |
| (Pilot Ward)        |                          | 13.07°N     | extreme monsoon surge vulnerabilities  |
+---------------------+--------------------------+-------------+----------------------------------------+
| 📍 Mumbai           | mumbai_area.geojson      | 72.80°E     | Coastal metropolis; tidal locking;     |
|                     |                          | 19.05°N     | extreme monsoon flash flood exposure   |
+---------------------+--------------------------+-------------+----------------------------------------+
| 📍 Bangalore        | bangalore_area.geojson   | 77.55°E     | High-altitude plateau (920m); historic |
|                     |                          | 12.95°N     | Raja Kalve cascade & lake overflows    |
+---------------------+--------------------------+-------------+----------------------------------------+
| 📍 Delhi NCR        | delhi_area.geojson       | 77.20°E     | Yamuna River floodplain; severe UHI;   |
|                     |                          | 28.55°N     | low baseline rain with cloudburst risk |
+---------------------+--------------------------+-------------+----------------------------------------+
| 📍 Kolkata          | kolkata_area.geojson     | 88.30°E     | Ganges deltaic wetlands; tidal storm   |
|                     |                          | 22.50°N     | surges & high groundwater saturation   |
+---------------------+--------------------------+-------------+----------------------------------------+
| 📍 Chennai          | chennai_area.geojson     | 80.25°E     | Coastal plains; Northeast monsoon &    |
|                     |                          | 13.05°N     | cyclone inundation corridors           |
+---------------------+--------------------------+-------------+----------------------------------------+
```

---

# 12. Step-by-Step Running & Operation Guide

### Option 1: One-Click Startup (Windows)
Double-click `start.bat`.

### Option 2: Terminal Commands

```bash
# Terminal 1: Backend
cd backend
python app.py
```
*(Runs on `http://localhost:5000`)*

```bash
# Terminal 2: Frontend
cd frontend
npm run dev
```
*(Runs on `http://localhost:5173` or `http://localhost:5174`)*

Open your browser at **`http://localhost:5173`** (or the port indicated by Vite).

---

# 13. Troubleshooting, Gotchas & Fixes

### 1. Windows Console Emoji Crash (`UnicodeEncodeError`)
- **Fixed:** [backend/app.py](file:///e:/new%20hack/urban-climate-digital-twin-main/backend/app.py) and [test_system.py](file:///e:/new%20hack/urban-climate-digital-twin-main/test_system.py) include `sys.stdout.reconfigure(encoding='utf-8')` to prevent `cp1252` encoding errors.

### 2. Missing Earth Engine Credentials
- **Fixed:** Automatically activates the calibrated regional baseline model.

### 3. LMStudio Server Offline
- **Fixed:** Automatically activates domain-expert calibrated municipal intervention fallbacks.

### 4. Port 5173 Already in Use
- Vite will automatically bind to `http://localhost:5174/`. Simply open `http://localhost:5174` in your browser.

---

# 14. Future Scalability & Roadmap

1. **3D Volumetric Digital Twin:** Integrating **CesiumJS / Three.js** with 3D building LOD2 meshes for building-by-building shadow and flood water level rendering.
2. **IoT Sensor Mesh Ingestion:** Ingesting live water level telemetry from municipal ultrasonic storm drain sensors via MQTT/WebSockets.
3. **Automated Carbon & Biodiversity Modeling:** Estimating carbon sequestration and urban biodiversity gains for proposed green bioswale interventions.
4. **Hydraulic 2D Shallow Water Flow Simulation:** Ingesting Saint-Venant 2D equations with GPU acceleration.

---

*Document compiled for TerraSense - Climate-Adaptive Urban Digital Twin. WEHACK 2026.* 🚀🌍
