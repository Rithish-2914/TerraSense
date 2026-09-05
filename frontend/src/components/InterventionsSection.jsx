import React, { useState, useEffect, useRef } from 'react';

const extractCostLakhs = (costStr) => {
  if (!costStr) return 50;
  const match = costStr.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 50;
};

const InterventionCard = ({ intervention, index, isSelected, onToggle }) => {
  return (
    <div 
      onClick={() => onToggle(index)}
      style={{
        border: isSelected ? '2px solid #059669' : '1px solid #E2E8F0',
        background: isSelected ? '#F0FDF4' : '#FFFFFF',
        borderRadius: '10px',
        padding: '12px 14px',
        marginBottom: '10px',
        cursor: 'pointer',
        boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
        transition: 'all 0.18s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ fontWeight: '800', fontSize: '12.5px', color: isSelected ? '#065F46' : '#0F172A', margin: 0 }}>
          #{index + 1}. {intervention.title || intervention.name}
        </div>
        <span style={{
          fontSize: '10px',
          fontWeight: '800',
          padding: '2px 8px',
          borderRadius: '4px',
          background: isSelected ? '#DCFCE7' : '#F1F5F9',
          color: isSelected ? '#166534' : '#64748B',
          border: isSelected ? '1px solid #86EFAC' : '1px solid #CBD5E1'
        }}>
          {isSelected ? '✓ Sanctioned in DPR' : '+ Click to Tender'}
        </span>
      </div>

      <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, marginBottom: '8px' }}>
        {intervention.description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '10.5px', borderTop: '1px solid #E2E8F0', paddingTop: '6px' }}>
        <div>
          <span style={{ color: '#64748B' }}>Runoff Cut: </span>
          <strong style={{ color: '#059669' }}>-{intervention.runoff_reduction_pct}%</strong>
        </div>
        <div>
          <span style={{ color: '#64748B' }}>CPWD Cost: </span>
          <strong style={{ color: '#0F172A' }}>{intervention.cost_bracket || `₹${intervention.cost_estimate_inr_lakhs || 60}L`}</strong>
        </div>
        <div>
          <span style={{ color: '#64748B' }}>Timeline: </span>
          <strong style={{ color: '#334155' }}>{intervention.implementation_months || 8} Mos</strong>
        </div>
        <div>
          <span style={{ color: '#64748B' }}>Dept: </span>
          <strong style={{ color: '#334155' }}>{intervention.contact || 'Drainage Wing'}</strong>
        </div>
      </div>
    </div>
  );
};

const InterventionsSection = ({ interventions, loading, simulationData, onMitigationChange }) => {
  const [selectedIndices, setSelectedIndices] = useState([0, 1]);

  useEffect(() => {
    if (interventions && interventions.length > 0) {
      setSelectedIndices([0, 1]);
    }
  }, [interventions]);

  const handleToggle = (index) => {
    let updated;
    if (selectedIndices.includes(index)) {
      updated = selectedIndices.filter(i => i !== index);
    } else {
      updated = [...selectedIndices, index];
    }
    setSelectedIndices(updated);
  };

  const activeItems = (interventions || []).filter((_, idx) => selectedIndices.includes(idx));
  
  const totalReductionPct = Math.min(
    65, 
    activeItems.reduce((acc, item) => acc + (parseFloat(item.runoff_reduction_pct) || 15), 0)
  );

  const totalCostLakhs = activeItems.reduce((acc, item) => {
    const cost = item.cost_estimate_inr_lakhs 
      ? parseFloat(item.cost_estimate_inr_lakhs) 
      : extractCostLakhs(item.cost_bracket);
    return acc + cost;
  }, 0);

  const totalCostCr = (totalCostLakhs / 100).toFixed(2);
  const damagePreventedCr = (parseFloat(totalCostCr) * 5.4).toFixed(2);
  const netRoiPct = totalCostLakhs > 0 ? Math.round(((parseFloat(damagePreventedCr) - parseFloat(totalCostCr)) / parseFloat(totalCostCr)) * 100) : 0;
  const basePeopleAtRisk = simulationData?.metrics?.scenario_people || 1500;
  const peopleProtected = Math.round(basePeopleAtRisk * (totalReductionPct / 100));

  const prevReductionRef = useRef(-1);
  useEffect(() => {
    if (prevReductionRef.current !== totalReductionPct) {
      prevReductionRef.current = totalReductionPct;
      if (onMitigationChange) {
        onMitigationChange({
          totalReductionPct,
          activeCount: selectedIndices.length
        });
      }
    }
  }, [totalReductionPct, selectedIndices.length, onMitigationChange]);

  if (!interventions || interventions.length === 0) return null;

  return (
    <div style={{ marginBottom: '16px' }}>
      {/* Official Capital Budgeting Balance Sheet */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #CBD5E1',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '14px',
        boxShadow: '0 2px 6px rgba(15, 23, 42, 0.05)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #E2E8F0', paddingBottom: '8px', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              🏛️ Municipal Sponge Capital Budget
            </div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>
              CPWD Schedule of Rates &amp; Risk Offset Matrix
            </div>
          </div>
          <span style={{ fontSize: '10px', background: '#ECFDF5', color: '#047857', border: '1px solid #A7F3D0', padding: '2px 8px', borderRadius: '4px', fontWeight: '800' }}>
            {selectedIndices.length} of {interventions.length} Sanctioned
          </span>
        </div>

        {/* 4-Stat Financial Ledger */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Runoff Cut</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
              -{totalReductionPct}%
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>CAPEX Outlay</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
              ₹{totalCostCr} Cr
            </div>
          </div>

          <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '8px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#0369A1', fontWeight: '700', textTransform: 'uppercase' }}>Loss Prevented</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#0284C7', marginTop: '2px' }}>
              ₹{damagePreventedCr} Cr
            </div>
          </div>

          <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '8px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#047857', fontWeight: '700', textTransform: 'uppercase' }}>Net Benefit</div>
            <div style={{ fontSize: '15px', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
              +{netRoiPct}%
            </div>
          </div>
        </div>

        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', fontSize: '10.5px', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>👥 <strong>{peopleProtected.toLocaleString()}</strong> citizens protected</span>
          <span style={{ color: '#059669', fontWeight: '700' }}>✓ Map Live Adjusted</span>
        </div>
      </div>

      {/* Tender Interventions List */}
      <div style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.4px' }}>
        Sanctioned Civil Engineering Packages
      </div>
      <div>
        {interventions.map((intervention, index) => (
          <InterventionCard 
            key={index}
            intervention={intervention}
            index={index}
            isSelected={selectedIndices.includes(index)}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default React.memo(InterventionsSection);