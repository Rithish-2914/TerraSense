import React from 'react';
import './MapLegend.css';

const MapLegend = ({ uploadedFileName, simulationData }) => {
  const getAreaName = () => {
    if (uploadedFileName) {
      return uploadedFileName.replace('.geojson', '').replace('_area', '').replace('_', ' ');
    }
    return 'Current Area';
  };

  return (
    <div className="map-legend">
      <div className="legend-title">
        {getAreaName()}
      </div>
      
      <div className="legend-item">
        <div className="color-square blue"></div>
        <span>Analysis Area</span>
      </div>
      
      {simulationData && (
        <div className="legend-item">
          <div className="color-square red"></div>
          <span>Climate Risk Zone</span>
        </div>
      )}
      
      <div className="legend-separator"></div>
      
      <div className="legend-sources">
        <div>NASA GIBS Satellite</div>
        {simulationData && <div>Real Earth Engine Data</div>}
      </div>
    </div>
  );
};

export default MapLegend;