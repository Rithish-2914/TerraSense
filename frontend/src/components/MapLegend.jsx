import React from 'react';
import './MapLegend.css';

const MapLegend = ({ uploadedFileName, simulationData }) => {
  const getAreaName = () => {
    if (uploadedFileName) {
      return uploadedFileName.replace('.geojson', '').replace('_area', '').replace('_', ' ').toUpperCase();
    }
    return 'ANALYSIS WARD';
  };

  return (
    <div className="map-legend">
      <div className="legend-title">
        <span>📍 {getAreaName()}</span>
      </div>
      
      <div className="legend-item">
        <div className="color-square blue"></div>
        <span>Study Ward Boundary</span>
      </div>

      {simulationData && (
        <>
          <div className="legend-section-title">USDA SCS Inundation Tiers</div>
          
          <div className="legend-item">
            <div className="color-square red"></div>
            <span>Critical Hazard (&gt;1.2m)</span>
          </div>

          <div className="legend-item">
            <div className="color-square orange"></div>
            <span>Moderate Inundation (0.5–1.2m)</span>
          </div>

          <div className="legend-item">
            <div className="color-square yellow"></div>
            <span>Minor Waterlogging (&lt;0.5m)</span>
          </div>

          <div className="legend-item">
            <div className="color-square green"></div>
            <span>Green Sponge / Safe Shelter</span>
          </div>
        </>
      )}
      
      <div className="legend-separator"></div>
      
      <div className="legend-sources">
        <div>🛰️ NASA GPM & MODIS Satellites</div>
        <div>📐 USDA SCS-CN (NEH-4 Physics)</div>
      </div>
    </div>
  );
};

export default React.memo(MapLegend);