# 🌍 TerraSense - Climate-Adaptive Urban Digital Twin
### Complete Run Guide, Feature Testing Checklist & Architecture Deep Dive (WEHACK 2026)

---

## 📑 Table of Contents
1. [Project Overview](#-1-project-overview)
2. [How to Run the Project](#-2-how-to-run-the-project)
   - [Prerequisites](#prerequisites)
   - [Option A: One-Click Startup (Windows)](#option-a-one-click-startup-windows)
   - [Option B: Manual Step-by-Step Startup](#option-b-manual-step-by-step-startup)
   - [Optional: Connecting Local AI (LMStudio)](#optional-connecting-local-ai-lmstudio)
   - [Optional: Authenticating Google Earth Engine](#optional-authenticating-google-earth-engine)
3. [What You Can Check & Test (Feature Walkthrough)](#-3-what-you-can-check--test-feature-walkthrough)
   - [1. System Status & Header Indicators](#1-system-status--header-indicators)
   - [2. Interactive NASA Satellite Map](#2-interactive-nasa-satellite-map)
   - [3. Area Selection & GeoJSON Upload](#3-area-selection--geojson-upload)
   - [4. Running Climate & Satellite Analysis](#4-running-climate--satellite-analysis)
   - [5. Switching Climate Scenarios](#5-switching-climate-scenarios)
   - [6. Exploring the Analysis Tab](#6-exploring-the-analysis-tab)
   - [7. Exploring the Solutions Tab (AI Recommendations)](#7-exploring-the-solutions-tab-ai-recommendations)
   - [8. Automated System Tests & API Verification](#8-automated-system-tests--api-verification)
4. [How the Project Works (Architecture & Deep Dive)](#-4-how-the-project-works-architecture--deep-dive)
   - [System Architecture Diagram](#system-architecture-diagram)
   - [The Dual Feedback Loop Concept](#the-dual-feedback-loop-concept)
   - [NASA Earth Observation Data Pipeline](#nasa-earth-observation-data-pipeline)
   - [Hydrological Modeling (SCS Curve Number Method)](#hydrological-modeling-scs-curve-number-method)
   - [Urban Heat Stress Modeling (MODIS LST)](#urban-heat-stress-modeling-modis-lst)
   - [AI Engine (Local LLM & Municipal Context)](#ai-engine-local-llm--municipal-context)
   - [Frontend Architecture & UI Design System](#frontend-architecture--ui-design-system)
5. [Directory Structure](#-5-directory-structure)
6. [Troubleshooting & FAQs](#-6-troubleshooting--faqs)

---

## 🌟 1. Project Overview

**TerraSense** is a **Climate-Adaptive Urban Digital Twin** created for **WEHACK 2026**. It helps city planners, municipal engineers, policy makers, and researchers evaluate how urban development plans interact with climate risks.

### Core Capabilities:
- **🛰️ Satellite Data Integration:** Ingests live/calibrated NASA observations including **GPM IMERG** (precipitation), **MODIS LST** (land surface temperature), **SRTM** (elevation & topography), **WorldPop** (population density), and **VIIRS** (nighttime lights).
- **🌊 Hydrological & Climate Modeling:** Simulates stormwater runoff depth, peak flow rates, flood inundation zones, and heat stress exposure using standard hydrological equations (SCS Curve Number method) and WHO thermal criteria.
- **🤖 Context-Aware AI Interventions:** Generates prioritized municipal interventions (with budgets in Indian Rupees ₹, completion timelines in months, runoff reduction percentages, KPIs, and responsible departments) via local LLMs (LMStudio) with smart fallback logic.
- **🗺️ Interactive Digital Twin Interface:** Modern glassmorphism UI built on React 18 and Leaflet featuring interactive satellite layers, real-time overlays, and multi-scenario comparisons.

---

## 🚀 2. How to Run the Project

### Prerequisites
Before starting, ensure you have:
1. **Python 3.8+** (Tested on Python 3.9 - 3.12)
2. **Node.js 16+** and **npm**

---

### Option A: One-Click Startup (Windows)
Double-click the startup script in the project root:
```cmd
start.bat
```
This will automatically:
1. Validate environment dependencies.
2. Launch the Flask backend on `http://localhost:5000` in a new window.
3. Launch the React Vite frontend on `http://localhost:5173` in a second window.
4. Automatically open your default browser to `http://localhost:5173`.

---

### Option B: Manual Step-by-Step Startup

#### Step 1: Install Dependencies
Open a terminal in the project root:

```bash
# 1. Install Backend Dependencies
pip install -r backend/requirements.txt

# 2. Install Frontend Dependencies
cd frontend
npm install
cd ..
```

#### Step 2: Start the Backend Server
Open **Terminal 1**:
```bash
cd backend
python app.py
```
> **Backend URL:** `http://localhost:5000`  
> **Health Check:** `http://localhost:5000/api/health`

#### Step 3: Start the Frontend App
Open **Terminal 2**:
```bash
cd frontend
npm run dev
```
> **Frontend URL:** `http://localhost:5173`

#### Step 4: Open in Browser
Navigate to [http://localhost:5173](http://localhost:5173) in your web browser.

---

### Option C: Instant Review 1 Presentation Showcase (Zero Setup)
For **Review 1** evaluations or judge walkthroughs, simply open the standalone interactive presentation website directly in any browser with **zero terminal or server dependencies**:
- **Double-click:** `simulation/index.html`
- **Features Included:** Interactive Cloudburst Slider, Before/After Swipe Curtain, Live ROI Sandbox, Multi-City Benchmark, and AI Voice Pitch!

---

### Optional: Connecting Local AI (LMStudio)
To generate dynamic LLM recommendations locally with full privacy:
1. Download and open [LMStudio](https://lmstudio.ai/).
2. Search and load a model such as `qwen2.5-coder-7b-instruct` or any instruction-tuned LLM.
3. Start the Local Inference Server inside LMStudio on port `1234` (`http://localhost:1234`).
4. TerraSense backend will automatically route recommendation prompts through LMStudio.
*(Note: If LMStudio is not running, the system automatically uses built-in calibrated municipal interventions tailored to your chosen city and scenario!)*

---

### Optional: Authenticating Google Earth Engine
For real-time live satellite queries via Earth Engine:
- Run: `earthengine authenticate`
- Or place your GCP service account JSON key in the root directory as `service-account-key.json`.Datasets Targeted:
NASA GPM IMERG: Design storm precipitation (mm).
NASA MODIS Terra/Aqua (MOD11A2): Land Surface Temperature (LST, °C).
NASA SRTM 30m DEM: Mean elevation and terrain slope.
WorldPop / LandScan: Population density and exposed residents.
NASA SMAP: Antecedent soil moisture condition (AMC II).
*(Note: If Earth Engine credentials are not present, TerraSense automatically runs using the calibrated regional NASA baseline model, allowing full exploration without any setup hurdles!)*

---

## 🔍 3. What You Can Check & Test (Feature Walkthrough)

Here is a checklist of all features and components you can test in the application:

### 1. System Status & Header Indicators
- Look at the top-right floating status card.
- **Backend status pill**: Shows `Online` (green) when connected to Flask backend.
- **Earth Engine status pill**: Shows `Authenticated` or `Auth Required` (calibrated mode active).
- **Area display**: Displays the name of the currently active area (e.g. `Trichy Pilot Ward`).

### 2. Interactive NASA Satellite Map
- Pan and zoom around the map view.
- The map automatically fits to the bounds of the active GeoJSON boundary.
- Notice the NASA GIBS satellite basemap and subtle polygon border delineating the study region.
- Bottom-left **Map Legend** displays the active area and overlay status.

### 3. Area Selection & GeoJSON Upload
- In the Floating Control Panel under **Area Selection**, view the current area name.
- Click **"Upload New Area"** to select any custom `.geojson` file.
- Try loading any of the pre-configured Indian city GeoJSON files located in the `data/` folder:
  - `data/trichy_area.geojson` (Trichy Pilot Ward, Cauvery Basin)
  - `data/mumbai_area.geojson` (Mumbai Coastal Metropolis)
  - `data/chennai_area.geojson` (Chennai Coastal Plains)
  - `data/bangalore_area.geojson` (Bangalore Lake Cascade Plateau)
  - `data/delhi_area.geojson` (Delhi Yamuna Floodplain)
  - `data/kolkata_area.geojson` (Kolkata Delta Region)
- The map immediately repositions and focuses on the newly uploaded city boundary!

### 4. Running Climate & Satellite Analysis
- In the **Simulation** tab, click the **"Run NASA Analysis"** button.
- Observe the animated 3-step progress overlay:
  1. **Area Processing**: Analyzes geometry bounds and polygon area.
  2. **NASA Satellite Data**: Queries GPM IMERG rainfall, MODIS temperature, and SRTM elevation.
  3. **AI Recommendations**: Processes flood reduction strategies and municipal costing.
- A toast notification will pop up confirming successful completion.

### 5. Cloudburst & Storm Severity Slider (Live Stress-Testing)
- In the **Simulation & Stress-Test** tab, drag the **Cloudburst Slider** from `50mm` to `350mm`.
- Observe the **red flood inundation zone on the map expand or contract in real-time**!
- Watch the live calculated metrics update:
  - *Rainfall Volume*: 50mm (Light Rain) $\rightarrow$ 180mm (Design Storm) $\rightarrow$ 350mm (100-Year Cloudburst).
  - *Severity Badge*: `Standard Monsoon Shower` $\rightarrow$ `Severe Cloudburst Event` $\rightarrow$ `100-Year Catastrophe`.
  - *Peak Runoff Surge %* and *People at Flood Risk* recalculate on the fly via live SCS-CN equations.

### 6. NASA Multi-Spectrum Map Layer Switcher
- In the top-left corner of the map viewport, click the spectrum buttons:
  - 🛰️ **NASA GIBS**: True-color optical Earth imagery.
  - 🌡️ **MODIS Thermal**: Land Surface Temperature thermal infrared simulation overlay for Urban Heat Islands.
  - 🏔️ **SRTM Terrain**: Digital Elevation Model with topographic contours and slopes.
  - 🗺️ **Streets**: Urban road network basemap.

### 7. Exploring the Policy Sandbox & Live ROI Calculator
- Click the **"Policy Sandbox & ROI"** tab in the floating panel.
- Click any of the AI intervention cards (*Smart Retention Basin*, *Permeable Bioswales*, *Sponge Park*) to toggle them in/out of the sandbox.
- Watch the **Live Municipal ROI Card** calculate in real-time:
  - 🎯 **Total Runoff Cut %** (e.g. `-52%`)
  - 💰 **Total Investment** (e.g. `₹1.65 Cr`)
  - 🛡️ **Damages Averted** (e.g. `₹8.91 Cr`)
  - 📈 **Net Municipal ROI** (e.g. `+440%`)
  - 👥 **Citizens Protected Count**
- Notice the **map flood zone transforms into a green mitigated buffer**!

### 8. TerraSense AI Voice Briefing Copilot
- In the floating panel header, click the **"🎙️ AI Voice Briefing"** button.
- The AI Copilot narrates a concise, 20-second spoken audio briefing of the active ward's flood vulnerability, population risk, and top civil engineering interventions.
- Click **"⏹️ Stop Briefing"** anytime to cancel audio playback.

### 9. One-Click Municipal DPR (Detailed Project Report) PDF Generator
- In the header, click the blue **"📄 Export DPR (PDF)"** button.
- A print-ready, government-formatted **Detailed Project Report** opens in a new tab:
  - Includes **Direct Flood Inundation Area in Hectares & km²**
  - Catchment Fraction (% of ward inundated)
  - Estimated Inundation Depth (meters) & Surplus Stormwater Volume in **Million Liters (ML)**
  - Civil engineering budgets (in ₹ Lakhs), monitoring KPIs, and statutory sign-off fields.
- Click **"Print / Save as PDF"** to export immediately.

### 10. Automated System Tests & API Verification
You can verify the backend endpoints and full simulation pipeline from the command line:

```bash
python test_system.py
```

Expected Output:
```
🧪 TerraSense Digital Twin - System Test (WEHACK 2026)
==================================================
✅ Backend Health Check: OK
   Earth Engine: ⚠️ Auth Required (or Connected)
🔄 Testing Climate Simulation...
✅ Climate Simulation: SUCCESS
   Data Source: real_nasa_calibrated_baseline
   People Affected: 300
   Peak Runoff Change: +0.0%
   Interventions: 3 recommendations
🤖 Testing LMStudio AI Recommendations...
✅ LMStudio AI: SUCCESS
   Recommendations: 3 interventions
==================================================
🎯 System Test Complete!
```

---

## 🧠 4. How the Project Works (Architecture & Deep Dive)

### System Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                              USER INTERACTION (BROWSER)                           |
|  [React 18 + Vite]  <--->  [Leaflet Satellite Map]  <--->  [Glassmorphism UI]      |
+----------------------------------------+------------------------------------------+
                                         | HTTP REST API (JSON)
                                         v
+-----------------------------------------------------------------------------------+
|                             FLASK BACKEND ENGINE (:5000)                          |
|                                                                                   |
|  +---------------------+  +-----------------------+  +--------------------------+ |
|  | /api/simulate       |  | /api/recommend        |  | /api/health              | |
|  | Multi-scenario run  |  | AI Interventions      |  | Service diagnostics      | |
|  +----------+----------+  +-----------+-----------+  +--------------------------+ |
|             |                         |                                           |
|             v                         v                                           |
|  +---------------------+  +-----------------------+  +--------------------------+ |
|  | Hydrological Engine |  | AI Inference Service  |  | Multi-Level Cache        | |
|  | SCS-CN Runoff Model |  | LMStudio / Fallback   |  | Memory Geometry + Scen.  | |
|  +----------+----------+  +-----------+-----------+  +--------------------------+ |
+-------------|-------------------------|-------------------------------------------+
              |                         |
              v                         v
+-----------------------------+ +---------------------------------------------------+
|     NASA EARTH ENGINE       | |                 LOCAL / CLOUD AI                  |
| - GPM IMERG (Precipitation) | | - LMStudio (localhost:1234)                       |
| - MODIS LST (Surface Temp)  | | - Model: qwen2.5-coder-7b-instruct                |
| - SRTM (30m Elevation)      | | - Structured JSON schema enforcement              |
| - WorldPop & VIIRS DNB      | | - Location & Costing (INR ₹) Prompt Engine        |
+-----------------------------+ +---------------------------------------------------+
```

---

### The Dual Feedback Loop Concept
Urban climate planning requires analyzing two interrelated loops:
1. **Loop 1: Urban Plan $\rightarrow$ Environment:**  
   How the proposed master plan (e.g. converting permeable green areas into concrete roofs and asphalt roads) raises the SCS Curve Number ($CN$), reduces infiltration, and intensifies surface runoff and heat retention.
2. **Loop 2: Climate Scenarios $\rightarrow$ Plan Performance:**  
   How intensified climate events (e.g., RCP 4.5 with +10% rainfall or RCP 8.5 with +20% rainfall) overwhelm existing drainage capacities, expand flood inundation buffers, and threaten resident populations.

TerraSense simulates both loops simultaneously in real time.

---

### NASA Earth Observation Data Pipeline

| Satellite Dataset | Collection Identifier | Measured Metric | Urban Planning Application |
|---|---|---|---|
| **🛰️ GPM IMERG** | `NASA/GPM_L3/IMERG_V06` | Precipitation Calibrated (mm) | Baseline annual and storm event rainfall modeling |
| **🌡️ MODIS LST** | `MODIS/061/MOD11A1` | Land Surface Temperature (°C) | Urban Heat Island (UHI) mapping & thermal vulnerability |
| **🏔️ SRTM** | `USGS/SRTMGL1_003` | 30m Digital Elevation Model | Slope, catchment depression, and runoff velocity |
| **👥 WorldPop** | `WorldPop/GP/100m/pop` | Population Count (100m grid) | Quantifying people at direct flood & heat risk |
| **🌱 SMAP** | `NASA/USDA/SMAP_SM20` | Soil Moisture & Soil Infiltration | Soil retention and saturation capacity |
| **🌃 VIIRS DNB** | `NOAA/VIIRS/DNB/MONTHLY_V1` | Day/Night Band Nighttime Lights | Urban density and infrastructure density patterns |

---

### Hydrological Modeling (SCS Curve Number Method)
Runoff volume and peak discharge are calculated using the standard **USDA Natural Resources Conservation Service (NRCS) SCS-CN** model:

1. **Potential Maximum Soil Retention ($S$ in mm):**
   $$S = \frac{25400}{CN} - 254$$
   *(where $CN = 85$ for typical dense/moderate urban residential fabrics)*

2. **Initial Abstraction ($I_a$ in mm):**
   $$I_a = 0.2 \times S$$

3. **Direct Runoff Depth ($Q$ in mm):**
   $$Q = \begin{cases} 0, & \text{if } P \le I_a \\ \frac{(P - I_a)^2}{P - I_a + S}, & \text{if } P > I_a \end{cases}$$
   *(where $P$ is annual/scenario precipitation in mm)*

4. **Total Runoff Volume ($V$ in $\text{m}^3$):**
   $$V = \left(\frac{Q}{1000}\right) \times (\text{Area}_{\text{ha}} \times 10000)$$

5. **Peak Flow Rate ($q_p$ in $\text{m}^3/\text{s}$):**
   $$q_p = \frac{V}{3600}$$

---

### Urban Heat Stress Modeling (MODIS LST)
Thermal risk is modeled based on satellite Land Surface Temperature (LST) and WHO guidelines:
- **Low Heat Stress:** LST $< 32^\circ\text{C}$ (5% population exposed)
- **Medium Heat Stress:** $32^\circ\text{C} \le \text{LST} < 37^\circ\text{C}$ (15% population exposed)
- **High Heat Stress:** $\text{LST} \ge 37^\circ\text{C}$ (30% population exposed)

Under RCP 4.5, temperatures increase by $+1.2^\circ\text{C}$; under RCP 8.5, temperatures increase by $+2.1^\circ\text{C}$.

---

### AI Engine (Local LLM & Municipal Context)
The backend constructs dynamic prompts integrating real computed metrics:
- Coordinates & geographic region (e.g. Cauvery delta, Mumbai coast, Deccan plateau)
- Runoff surge percentage ($+\Delta\%$)
- Population at risk count
- Area in hectares & annual precipitation

The LLM is prompted to return strictly valid JSON specifying:
- 3 prioritized interventions
- Runoff reduction percentage
- Cost bracket in Indian Rupees (₹ lakhs)
- Implementation timeline (months)
- Measurable monitoring KPI
- Responsible municipal department

---

### Frontend Architecture & UI Design System
- **Framework:** React 18 + Vite for sub-second hot reloading and lightweight builds.
- **Mapping:** Leaflet.js with React-Leaflet integration and dynamic GeoJSON layer rendering.
- **Design Language:** NASA space-grade glassmorphism with backdrop blur (`blur(20px)`), curated HSL palette, Overpass/Fira typography, and micro-animations.
- **State Management:** Persistent state stored in `localStorage` across page reloads (active area, scenario, and simulation results).

---

## 📁 5. Directory Structure

```
urban-climate-digital-twin-main/
│
├── backend/
│   ├── app.py                      # Flask REST API, Earth Engine & LMStudio services
│   └── requirements.txt            # Python dependencies (Flask, CORS, EarthEngine, etc.)
│
├── frontend/
│   ├── index.html                  # HTML entry point with Google Fonts
│   ├── package.json                # React 18 & Vite configuration
│   ├── vite.config.js              # Vite build setup
│   └── src/
│       ├── App.jsx                 # Main application state & layout coordinator
│       ├── index.css               # Global NASA glassmorphic design system
│       ├── main.jsx                # React DOM root
│       └── components/
│           ├── MapView.jsx         # Leaflet interactive map & polygon renderer
│           ├── FloatingPanel.jsx   # Tabbed control panel (Simulation, Analysis, Solutions)
│           ├── FloatingButton.jsx  # Floating launcher button for panel
│           ├── MetricsCard.jsx     # Hydrological impact indicators
│           ├── EnvironmentalCard.jsx# Thermal and elevation indicators
│           ├── PlanImpactCard.jsx  # Plan vs Climate dual-loop card
│           ├── InterventionsSection.jsx # AI-generated municipal interventions
│           ├── ProcessingOverlay.jsx# Animated NASA pipeline step progress
│           ├── MapLegend.jsx       # Map overlay and risk depth legend
│           ├── IntroPopup.jsx      # Welcome & quick start modal
│           └── Toast.jsx           # Notification toast component
│
├── data/
│   ├── trichy_area.geojson         # Sample boundary: Trichy
│   ├── mumbai_area.geojson         # Sample boundary: Mumbai
│   ├── chennai_area.geojson        # Guide boundary: Chennai
│   ├── bangalore_area.geojson      # Sample boundary: Bangalore
│   ├── delhi_area.geojson          # Sample boundary: Delhi
│   └── kolkata_area.geojson        # Sample boundary: Kolkata
│
├── notebooks/
│   ├── earth_engine_processing.ipynb # CoLab Earth Engine data extraction notebook
│   └── UrbanAI_Earth_Engine_Processing.ipynb
│
├── start.bat                       # One-click Windows startup script
├── test_system.py                  # Automated backend & pipeline test script
├── COMPLETE_PROJECT_DOCUMENTATION.md # Master A-Z technical & conceptual guide
├── RUN_AND_EXPLORE_GUIDE.md        # Comprehensive exploration & feature guide
├── PRESENTATION_DECK_AND_PITCH_GUIDE.md # 12-slide pitch deck & speech script
├── PROJECT_TASKS_BREAKDOWN.md      # Chronological task roadmap
└── README.md                       # Project overview & quickstart README
```

---

## ❓ 6. Troubleshooting & FAQs

### Q: What if LMStudio is not running on port 1234?
**A:** TerraSense includes an intelligent fallback mechanism. If LMStudio is offline, the backend automatically generates calibrated, domain-expert interventions tailored to your chosen city, coordinates, and scenario without crashing.

### Q: What if Google Earth Engine is not authenticated?
**A:** TerraSense operates in calibrated baseline model mode. It calculates exact polygon geometries and uses calibrated NASA historical averages for precipitation, temperature, and elevation across all Indian regions.

### Q: Port 5000 or Port 5173 is already in use.
**A:** 
- If port 5000 is occupied, you can change the port in `backend/app.py` (`port=5001`) and update the API URLs in `frontend/src/App.jsx`.
- If port 5173 is occupied, Vite will automatically select the next available port (e.g. 5174).

### Q: Can I test my own city or neighborhood?
**A:** Yes! You can draw any polygon on [geojson.io](https://geojson.io), export the `.geojson` file, and upload it via the **"Upload New Area"** button in the TerraSense control panel.

---

*Enjoy exploring TerraSense - Climate-Adaptive Urban Digital Twin! 🚀🌍*
