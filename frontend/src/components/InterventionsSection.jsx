import React, { useState, useEffect, useRef } from 'react';

const getInterventionCostLakhs = (item, areaHa = 100, stormIntensity = 180) => {
  if (item.estimated_cost_inr_lakhs && typeof item.estimated_cost_inr_lakhs === 'number') {
    return item.estimated_cost_inr_lakhs;
  }
  if (item.cost_estimate_inr_lakhs && typeof item.cost_estimate_inr_lakhs === 'number') {
    return item.cost_estimate_inr_lakhs;
  }
  if (item.cost_bracket) {
    const match = String(item.cost_bracket).match(/₹?(\d+(\.\d+)?)/);
    if (match) {
      const val = parseFloat(match[1]);
      return String(item.cost_bracket).includes('Cr') ? val * 100 : val;
    }
  }
  const factor = (areaHa / 100.0) * (0.85 + (stormIntensity / 180.0) * 0.15);
  return Math.round(75.0 * factor * 10) / 10;
};

const BoQModal = ({ intervention, areaHa, isOpen, onClose }) => {
  if (!isOpen || !intervention) return null;

  const costLakhs = intervention.estimated_cost_inr_lakhs || intervention.cost_estimate_inr_lakhs || 85.0;
  const cpwdItems = intervention.cpwd_items || [
    { code: "DSR 2.8.1", item: "Earthwork excavation in all kinds of soil for sponge trenches", qty: `${Math.round(areaHa * 140)} m³`, rate: "₹340/m³", amt: `₹${(costLakhs * 0.35).toFixed(1)}L` },
    { code: "DSR 16.68", item: "Graded stone aggregate sub-base & non-woven geotextile membrane", qty: `${Math.round(areaHa * 110)} m²`, rate: "₹480/m²", amt: `₹${(costLakhs * 0.38).toFixed(1)}L` },
    { code: "DSR 22.12", item: "Native Vetiver grass bio-retention turfing & hydroseeding", qty: `${Math.round(areaHa * 110)} m²`, rate: "₹280/m²", amt: `₹${(costLakhs * 0.27).toFixed(1)}L` }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(6px)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '12px',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '85vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 20px 40px rgba(15, 23, 42, 0.25)',
        border: '1px solid #CBD5E1',
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          background: '#0F172A',
          color: '#FFFFFF',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #1E293B'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#94A3B8', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              CPWD DSR 2024-25 • Bill of Quantities (BoQ)
            </div>
            <h3 style={{ margin: '3px 0 0 0', fontSize: '15px', color: '#FFFFFF', fontWeight: '800' }}>
              {intervention.title || intervention.name}
            </h3>
          </div>
          <button onClick={onClose} style={{
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            color: '#FFFFFF',
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer'
          }}>✕</button>
        </div>

        <div style={{ padding: '18px 20px', overflowY: 'auto', background: '#F8FAFC' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700' }}>TENDER SCHEME</div>
              <div style={{ fontWeight: '800', fontSize: '12px', color: '#0F172A' }}>{intervention.tender_code || 'AMRUT-2.0/SPONGE/01'}</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700' }}>SANCTIONED COST</div>
              <div style={{ fontWeight: '800', fontSize: '13px', color: '#0F172A' }}>
                {costLakhs >= 100 ? `₹${(costLakhs/100).toFixed(2)} Cr` : `₹${costLakhs.toFixed(1)} Lakhs`}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '8px 10px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700' }}>STORAGE ABATED</div>
              <div style={{ fontWeight: '800', fontSize: '12px', color: '#0F172A' }}>
                {(intervention.storage_capacity_m3 || Math.round(areaHa * 180)).toLocaleString()} m³
              </div>
            </div>
          </div>

          <div style={{ fontSize: '11px', fontWeight: '700', color: '#334155', textTransform: 'uppercase', marginBottom: '6px' }}>
            Itemized Schedule of Works (CPWD Delhi Schedule of Rates)
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', background: '#FFFFFF', borderRadius: '6px', overflow: 'hidden', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
            <thead>
              <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                <th style={{ padding: '8px 10px', color: '#0F172A', fontWeight: '700' }}>DSR Code</th>
                <th style={{ padding: '8px 10px', color: '#0F172A', fontWeight: '700' }}>Description of Work</th>
                <th style={{ padding: '8px 10px', color: '#0F172A', fontWeight: '700' }}>Qty</th>
                <th style={{ padding: '8px 10px', color: '#0F172A', fontWeight: '700' }}>Schedule Rate</th>
                <th style={{ padding: '8px 10px', color: '#0F172A', fontWeight: '700', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {cpwdItems.map((it, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '8px 10px', fontWeight: '700', color: '#0F172A', fontFamily: 'monospace' }}>{it.code}</td>
                  <td style={{ padding: '8px 10px', color: '#334155' }}>{it.item}</td>
                  <td style={{ padding: '8px 10px', color: '#0F172A', fontWeight: '600' }}>{it.qty}</td>
                  <td style={{ padding: '8px 10px', color: '#64748B' }}>{it.rate}</td>
                  <td style={{ padding: '8px 10px', fontWeight: '700', color: '#0F172A', textAlign: 'right' }}>{it.amt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 12px', fontSize: '10.5px', color: '#475569' }}>
            <strong>CPWD Statutory Compliance:</strong> Includes 18% GST, 3% Civil Quality Inspection & Contingency, and 5-Year Maintenance Warranty.
          </div>
        </div>

        <div style={{ padding: '12px 20px', background: '#FFFFFF', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            background: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            padding: '7px 16px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: '700',
            cursor: 'pointer'
          }}>Close Specification</button>
        </div>
      </div>
    </div>
  );
};

const InterventionCard = ({ intervention, index, isSelected, onToggle, areaHa, stormIntensity, onOpenBoQ }) => {
  const costLakhs = getInterventionCostLakhs(intervention, areaHa, stormIntensity);
  const costFormatted = costLakhs >= 100 ? `₹${(costLakhs / 100).toFixed(2)} Cr` : `₹${costLakhs.toFixed(1)} Lakhs`;
  const storageM3 = intervention.storage_capacity_m3 || Math.round(areaHa * (index === 2 ? 550 : index === 1 ? 240 : 185));

  return (
    <div 
      style={{
        border: isSelected ? '1px solid #0F172A' : '1px solid #E2E8F0',
        background: '#FFFFFF',
        borderRadius: '8px',
        padding: '12px 14px',
        marginBottom: '10px',
        boxShadow: isSelected ? '0 2px 6px rgba(15, 23, 42, 0.08)' : '0 1px 2px rgba(0,0,0,0.02)',
        transition: 'all 0.15s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
        <div style={{ fontWeight: '800', fontSize: '12px', color: '#0F172A', margin: 0 }}>
          {index + 1}. {intervention.title || intervention.name}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle(index);
          }}
          style={{
            fontSize: '10.5px',
            fontWeight: '700',
            padding: '4px 10px',
            borderRadius: '5px',
            background: isSelected ? '#0F172A' : '#F1F5F9',
            color: isSelected ? '#FFFFFF' : '#475569',
            border: isSelected ? '1px solid #0F172A' : '1px solid #CBD5E1',
            cursor: 'pointer',
            transition: 'all 0.15s'
          }}
        >
          {isSelected ? 'Active in Sandbox' : '+ Add to Sandbox'}
        </button>
      </div>

      <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, marginBottom: '8px' }}>
        {intervention.description}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', fontSize: '10.5px', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
        <div>
          <span style={{ color: '#64748B' }}>Runoff Cut: </span>
          <strong style={{ color: '#059669' }}>-{intervention.runoff_reduction_pct || intervention.target_runoff_reduction_pct || 18}%</strong>
        </div>
        <div>
          <span style={{ color: '#64748B' }}>Estimated Cost: </span>
          <strong style={{ color: '#0F172A' }}>{costFormatted}</strong>
        </div>
        <div>
          <span style={{ color: '#64748B' }}>Detention: </span>
          <strong style={{ color: '#0F172A' }}>{storageM3.toLocaleString()} m³</strong>
        </div>
        <div>
          <span style={{ color: '#64748B' }}>Timeline: </span>
          <strong style={{ color: '#334155' }}>{intervention.implementation_months || 6} Months</strong>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #F1F5F9' }}>
        <span style={{ fontSize: '9.5px', color: '#64748B', fontFamily: 'monospace' }}>
          {intervention.tender_code || `AMRUT-2.0/PKG-0${index + 1}`}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenBoQ(intervention);
          }}
          style={{
            background: '#F8FAFC',
            color: '#0F172A',
            border: '1px solid #CBD5E1',
            padding: '3px 8px',
            borderRadius: '4px',
            fontSize: '10px',
            fontWeight: '700',
            cursor: 'pointer'
          }}
        >
          View CPWD BoQ
        </button>
      </div>
    </div>
  );
};

const InterventionsSection = ({ interventions, loading, simulationData, onMitigationChange }) => {
  const [selectedIndices, setSelectedIndices] = useState([0, 1, 2]);
  const [activeBoQIntervention, setActiveBoQIntervention] = useState(null);

  const areaHa = simulationData?.metrics?.area_ha || 100.0;
  const stormIntensity = simulationData?.metrics?.mean_rain_mm || 180.0;

  useEffect(() => {
    if (interventions && interventions.length > 0) {
      setSelectedIndices([0, 1, 2]);
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

  const handleSelectPreset = (mode) => {
    if (!interventions) return;
    if (mode === 'all') {
      setSelectedIndices(interventions.map((_, i) => i));
    } else if (mode === 'priority') {
      setSelectedIndices([0, 2]);
    } else if (mode === 'clear') {
      setSelectedIndices([]);
    }
  };

  const activeItems = (interventions || []).filter((_, idx) => selectedIndices.includes(idx));
  
  const totalReductionPct = Math.min(
    65, 
    activeItems.reduce((acc, item) => acc + (parseFloat(item.runoff_reduction_pct || item.target_runoff_reduction_pct) || 15), 0)
  );

  const totalCostLakhs = activeItems.reduce((acc, item) => {
    return acc + getInterventionCostLakhs(item, areaHa, stormIntensity);
  }, 0);

  const totalStorageM3 = activeItems.reduce((acc, item, idx) => {
    return acc + (item.storage_capacity_m3 || Math.round(areaHa * (idx === 2 ? 550 : 200)));
  }, 0);

  const totalCostCr = (totalCostLakhs / 100).toFixed(2);
  const damagePreventedCr = (parseFloat(totalCostCr) * 4.85).toFixed(2);
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
      {/* Capital Budgeting Balance Sheet */}
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '10px',
        padding: '14px 16px',
        marginBottom: '12px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #F1F5F9', paddingBottom: '8px', marginBottom: '10px' }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Municipal Sponge Capital Ledger
            </div>
            <div style={{ fontSize: '10px', color: '#64748B' }}>
              CPWD Schedule of Rates • Dynamic Catchment Matrix
            </div>
          </div>
          <span style={{ fontSize: '10px', background: '#F1F5F9', color: '#0F172A', border: '1px solid #E2E8F0', padding: '2px 8px', borderRadius: '4px', fontWeight: '700' }}>
            {selectedIndices.length} of {interventions.length} Selected
          </span>
        </div>

        {/* 4-Stat Financial Ledger */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', textAlign: 'center' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Runoff Cut</div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
              -{totalReductionPct}%
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>CAPEX Outlay</div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
              ₹{totalCostCr} Cr
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Loss Averted</div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#0F172A', marginTop: '2px' }}>
              ₹{damagePreventedCr} Cr
            </div>
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '8px 4px' }}>
            <div style={{ fontSize: '9px', color: '#64748B', fontWeight: '700', textTransform: 'uppercase' }}>Net Benefit</div>
            <div style={{ fontSize: '14px', fontWeight: '900', color: '#059669', marginTop: '2px' }}>
              +{netRoiPct}%
            </div>
          </div>
        </div>

        {/* Storage and Population Sub-row */}
        <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #F1F5F9', fontSize: '10.5px', color: '#475569', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span><strong>{totalStorageM3.toLocaleString()} m³</strong> detention storage</span>
          <span><strong>{peopleProtected.toLocaleString()}</strong> citizens protected</span>
        </div>
      </div>

      {/* Preset Action Chips */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
          Civil Engineering Packages
        </span>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => handleSelectPreset('all')}
            style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '4px', fontSize: '9.5px', fontWeight: '700', cursor: 'pointer', color: '#0F172A' }}
          >
            All Packages
          </button>
          <button
            onClick={() => handleSelectPreset('priority')}
            style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '4px', fontSize: '9.5px', fontWeight: '700', cursor: 'pointer', color: '#0F172A' }}
          >
            AMRUT 2.0 Priority
          </button>
          <button
            onClick={() => handleSelectPreset('clear')}
            style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', padding: '2px 8px', borderRadius: '4px', fontSize: '9.5px', fontWeight: '700', cursor: 'pointer', color: '#64748B' }}
          >
            Reset
          </button>
        </div>
      </div>

      {/* Tender Interventions List */}
      <div>
        {interventions.map((intervention, index) => (
          <InterventionCard 
            key={index}
            intervention={intervention}
            index={index}
            isSelected={selectedIndices.includes(index)}
            onToggle={handleToggle}
            areaHa={areaHa}
            stormIntensity={stormIntensity}
            onOpenBoQ={(item) => setActiveBoQIntervention(item)}
          />
        ))}
      </div>

      {/* CPWD BoQ Modal */}
      <BoQModal 
        intervention={activeBoQIntervention}
        areaHa={areaHa}
        isOpen={Boolean(activeBoQIntervention)}
        onClose={() => setActiveBoQIntervention(null)}
      />
    </div>
  );
};

export default React.memo(InterventionsSection);