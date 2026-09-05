import React, { useState } from 'react';
import './EmergencyHotlineModal.css';

const INITIAL_CALL_RECORDS = [
  {
    id: 'TR-1077-8921',
    callerName: 'Murugan K.',
    phone: '+91 98402 11928',
    ward: 'Palakkarai Main Bazaar (Ward 14)',
    timestamp: '16:48 PM (2 mins ago)',
    severity: 'critical',
    waterDepth: '1.25m (Waist-deep water)',
    reliefNeed: 'Inflatable Rescue Boat + Paramedic for 78yo bedridden mother',
    transcript: 'Water has entered ground floor living room up to 4 feet near temple street. Electricity is disconnected. Elderly mother cannot walk. Please send rescue team immediately.',
    status: 'pending',
    assignedUnit: null,
    audioDuration: '0:28'
  },
  {
    id: 'TR-1077-8919',
    callerName: 'Ananya Ramachandran',
    phone: '+91 94431 88201',
    ward: 'Cauvery Nagar 2nd Cross (Ward 9)',
    timestamp: '16:42 PM (8 mins ago)',
    severity: 'high',
    waterDepth: '0.85m (Knee-deep flood)',
    reliefNeed: 'Drinking water canisters & infant milk supply (2 infants)',
    transcript: 'Drinking water pipeline contaminated with silt. 4 adults and 2 infants stranded on 1st floor terrace. Requesting drinking water and milk powder packets.',
    status: 'dispatched',
    assignedUnit: 'NDRF Rescue Team 3 (Boat #B-04)',
    audioDuration: '0:34'
  },
  {
    id: 'TR-1077-8914',
    callerName: 'K. Sundaram (Ward Secretary)',
    phone: '+91 97890 44312',
    ward: 'Cantonment Bus Stand Sub-station',
    timestamp: '16:31 PM (19 mins ago)',
    severity: 'medium',
    waterDepth: '0.45m (Surface runoff)',
    reliefNeed: '2x High-capacity Submersible Dewatering Pumps (50 HP)',
    transcript: 'Sub-station perimeter wall waterlogged. If dewatering pumps not deployed within 30 minutes, 4 feeder lines will trip. Urgent civil assistance requested.',
    status: 'dispatched',
    assignedUnit: 'Corporation Dewatering Unit #2',
    audioDuration: '0:45'
  },
  {
    id: 'TR-1077-8902',
    callerName: 'Selvi Meenakshi',
    phone: '+91 99520 66734',
    ward: 'Thillai Nagar West (Ward 7)',
    timestamp: '16:08 PM (42 mins ago)',
    severity: 'resolved',
    waterDepth: '0.20m (Receding)',
    reliefNeed: 'Evacuation transit to High-Ground Relief Hub',
    transcript: 'Relief transit bus arrived. 14 residents safely relocated to Higher Secondary School Relief Shelter (+94m MSL). Drinking water and food packets distributed.',
    status: 'resolved',
    assignedUnit: 'District Relief Bus #TR-12',
    audioDuration: '0:22'
  }
];

const EmergencyHotlineModal = ({ isOpen, onClose, onShowToast }) => {
  const [calls, setCalls] = useState(INITIAL_CALL_RECORDS);
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggingCall, setIsLoggingCall] = useState(false);
  const [playingCallId, setPlayingCallId] = useState(null);

  if (!isOpen) return null;

  const handleSimulateCall = () => {
    setIsLoggingCall(true);
    
    setTimeout(() => {
      const newCall = {
        id: `TR-1077-${Math.floor(1000 + Math.random() * 9000)}`,
        callerName: 'Rajesh Kumar (Citizen)',
        phone: '+91 98410 77412',
        ward: 'Rockfort Bazaar / Teppakulam (Ward 11)',
        timestamp: 'Just now (16:53 PM)',
        severity: 'critical',
        waterDepth: '1.10m (Rising water)',
        reliefNeed: 'Emergency Rescue Boat (4 senior citizens trapped on terrace)',
        transcript: 'Water level crossed ground floor window sills 5 minutes ago. 4 senior citizens moved to terrace. Requesting NDRF inflatable boat for immediate evacuation.',
        status: 'pending',
        assignedUnit: null,
        audioDuration: '0:24'
      };

      setCalls(prev => [newCall, ...prev]);
      setIsLoggingCall(false);

      if (onShowToast) {
        onShowToast({
          message: `New Distress Call Logged: ${newCall.id}\nCaller: ${newCall.callerName} (${newCall.ward})\nNeed: ${newCall.reliefNeed}`,
          type: 'error'
        });
      }
    }, 1200);
  };

  const handleAssignUnit = async (call, unitName) => {
    setCalls(prev => prev.map(c => {
      if (c.id === call.id) {
        return {
          ...c,
          status: 'dispatched',
          assignedUnit: unitName
        };
      }
      return c;
    }));

    try {
      const resp = await fetch('http://localhost:5000/api/emergency/send-sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_phone: call.phone,
          incident_id: call.id,
          caller_name: call.callerName,
          ward: call.ward,
          water_depth: call.waterDepth,
          relief_need: call.reliefNeed,
          assigned_unit: unitName
        })
      });
      const result = await resp.json();
      
      if (onShowToast) {
        onShowToast({
          message: `Dispatched ${unitName} to ${call.id}\nTwilio Alert: ${result.mode === 'live_carrier_sent' ? 'Live Cellular SMS Sent!' : 'Simulator SMS Dispatched'} (${result.message_sid?.slice(0, 10)}...)`,
          type: 'success'
        });
      }
    } catch (e) {
      if (onShowToast) {
        onShowToast({
          message: `Dispatched ${unitName} to ${call.id}`,
          type: 'success'
        });
      }
    }
  };

  const handleTriggerTwilioVoiceCall = async (call) => {
    try {
      const resp = await fetch('http://localhost:5000/api/emergency/make-call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to_phone: call.phone,
          ward: call.ward,
          water_depth: call.waterDepth,
          assigned_unit: call.assignedUnit || 'NDRF Quick Response Team'
        })
      });
      const res = await resp.json();
      if (onShowToast) {
        onShowToast({
          message: `Twilio Automated Voice Call Placed!\nTo: ${call.phone}\nMode: ${res.mode === 'live_voice_call_initiated' ? 'Live Carrier Call In Progress' : 'Simulator Voice Call Synthesized'}`,
          type: 'success'
        });
      }
    } catch (err) {
      if (onShowToast) {
        onShowToast({
          message: `Automated Voice Broadcast initiated for ${call.phone}`,
          type: 'success'
        });
      }
    }
  };

  const handleResolveCall = (callId) => {
    setCalls(prev => prev.map(c => {
      if (c.id === callId) {
        return {
          ...c,
          status: 'resolved',
          severity: 'resolved',
          assignedUnit: c.assignedUnit || 'District Evacuation Unit'
        };
      }
      return c;
    }));

    if (onShowToast) {
      onShowToast({
        message: `Call #${callId} marked as Safely Evacuated & Resolved`,
        type: 'success'
      });
    }
  };

  const handleToggleAudio = (callId) => {
    if (playingCallId === callId) {
      setPlayingCallId(null);
    } else {
      setPlayingCallId(callId);
      setTimeout(() => setPlayingCallId(null), 3500);
    }
  };

  const filteredCalls = calls.filter(c => {
    if (filterSeverity !== 'all' && c.severity !== filterSeverity) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.callerName.toLowerCase().includes(q) ||
        c.ward.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.reliefNeed.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const criticalCount = calls.filter(c => c.severity === 'critical' && c.status !== 'resolved').length;
  const highCount = calls.filter(c => c.severity === 'high' && c.status !== 'resolved').length;
  const resolvedCount = calls.filter(c => c.status === 'resolved').length;

  return (
    <div className="hotline-backdrop" onClick={onClose}>
      <div className="hotline-modal" onClick={e => e.stopPropagation()}>
        
        {/* Government Header */}
        <div className="hotline-header">
          <div>
            <h2>District Emergency Operations Center (DEOC 1077)</h2>
            <p className="hotline-sub">
              Citizen Helpline & Tactical Disaster Dispatch Console • <strong>1077 / 1070 / 0431-2401000</strong>
            </p>
          </div>
          <div className="hotline-header-right">
            <button 
              className="simulate-incoming-btn"
              onClick={handleSimulateCall}
              disabled={isLoggingCall}
            >
              {isLoggingCall ? 'Logging Call...' : '+ Log Distress Call'}
            </button>
            <button className="hotline-close-btn" onClick={onClose} title="Close">✕</button>
          </div>
        </div>

        {/* Status Counters */}
        <div className="hotline-counters">
          <div className="counter-card">
            <span className="counter-title">Critical Rescues</span>
            <span className="counter-num" style={{ color: '#DC2626' }}>{criticalCount}</span>
            <span className="counter-desc">Water depth &gt; 1.0m</span>
          </div>
          <div className="counter-card">
            <span className="counter-title">High Priority Relief</span>
            <span className="counter-num" style={{ color: '#D97706' }}>{highCount}</span>
            <span className="counter-desc">Medical / Supplies / Infants</span>
          </div>
          <div className="counter-card">
            <span className="counter-title">Safely Evacuated</span>
            <span className="counter-num" style={{ color: '#059669' }}>{resolvedCount}</span>
            <span className="counter-desc">Relocated to High Ground</span>
          </div>
          <div className="counter-card">
            <span className="counter-title">Total Active Calls</span>
            <span className="counter-num" style={{ color: '#0F172A' }}>{calls.length}</span>
            <span className="counter-desc">Ward Operations</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="hotline-toolbar">
          <div className="tab-filters">
            <button 
              className={`tab-btn ${filterSeverity === 'all' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('all')}
            >
              All ({calls.length})
            </button>
            <button 
              className={`tab-btn ${filterSeverity === 'critical' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('critical')}
            >
              Critical ({criticalCount})
            </button>
            <button 
              className={`tab-btn ${filterSeverity === 'high' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('high')}
            >
              High Priority ({highCount})
            </button>
            <button 
              className={`tab-btn ${filterSeverity === 'resolved' ? 'active' : ''}`}
              onClick={() => setFilterSeverity('resolved')}
            >
              Evacuated ({resolvedCount})
            </button>
          </div>

          <div className="search-wrap">
            <input 
              type="text" 
              placeholder="Filter by caller, ward, phone, or need..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dispatch Log Table / Cards */}
        <div className="hotline-records-scroll">
          {filteredCalls.length === 0 ? (
            <div className="no-records">
              <span>No emergency records matching current filter.</span>
            </div>
          ) : (
            filteredCalls.map(item => (
              <div key={item.id} className="hotline-card">
                <div className="hotline-card-header">
                  <div className="caller-col">
                    <span className="call-ref">{item.id}</span>
                    <strong className="caller-title">{item.callerName}</strong>
                    <span className="phone-tag">{item.phone}</span>
                    <span className="time-tag">{item.timestamp}</span>
                  </div>

                  <div className="status-badges">
                    <span className="pill-badge" style={{
                      color: item.severity === 'critical' ? '#DC2626' : item.severity === 'high' ? '#D97706' : item.severity === 'resolved' ? '#059669' : '#475569',
                      background: '#F1F5F9'
                    }}>
                      {item.severity.toUpperCase()}
                    </span>
                    <span className="dispatch-pill" style={{
                      color: item.status === 'resolved' ? '#059669' : item.status === 'dispatched' ? '#0F172A' : '#DC2626',
                      background: '#F8FAFC'
                    }}>
                      {item.status === 'resolved' ? 'Evacuated' : item.status === 'dispatched' ? 'Unit Dispatched' : 'Pending Dispatch'}
                    </span>
                  </div>
                </div>

                <div className="hotline-card-grid">
                  <div className="grid-left">
                    <div className="row-item">
                      <span className="row-label">Ward / Location:</span>
                      <strong className="row-val">{item.ward}</strong>
                    </div>
                    <div className="row-item">
                      <span className="row-label">Water Depth:</span>
                      <span className="row-val depth">{item.waterDepth}</span>
                    </div>
                    <div className="row-item">
                      <span className="row-label">Relief Need:</span>
                      <span className="row-val need">{item.reliefNeed}</span>
                    </div>
                  </div>

                  <div className="grid-right">
                    <div className="recording-box">
                      <div className="recording-top">
                        <span className="rec-title">Call Audio Log ({item.audioDuration})</span>
                        <button 
                          className={`play-rec-btn ${playingCallId === item.id ? 'playing' : ''}`}
                          onClick={() => handleToggleAudio(item.id)}
                        >
                          {playingCallId === item.id ? 'Playing Audio...' : 'Play Audio'}
                        </button>
                      </div>
                      <p className="rec-text">"{item.transcript}"</p>
                    </div>
                  </div>
                </div>

                {item.assignedUnit && (
                  <div className="dispatched-unit-tag">
                    <span>Assigned Unit: <strong>{item.assignedUnit}</strong></span>
                  </div>
                )}

                <div className="hotline-card-footer">
                  <div className="action-buttons-group">
                    {item.status !== 'resolved' && (
                      <>
                        <button 
                          className="dispatch-action-btn"
                          onClick={() => handleAssignUnit(item, 'NDRF Rescue Boat Team #B-08')}
                          title="Dispatch rescue boat and trigger cellular Twilio SMS alert"
                        >
                          Dispatch NDRF Boat
                        </button>
                        <button 
                          className="dispatch-action-btn"
                          onClick={() => handleAssignUnit(item, 'Relief Evacuation Bus #TR-04')}
                          title="Dispatch transit bus and send SMS confirmation"
                        >
                          Evacuation Transit
                        </button>
                        <button 
                          className="dispatch-action-btn"
                          onClick={() => handleAssignUnit(item, 'Municipal Ration & Water Unit')}
                          title="Send emergency drinking water supply"
                        >
                          Send Ration & Water
                        </button>
                        <button 
                          className="dispatch-action-btn primary"
                          onClick={() => handleTriggerTwilioVoiceCall(item)}
                          title="Trigger automated Twilio TTS voice alert call to citizen"
                        >
                          Call Citizen (Twilio Voice)
                        </button>
                      </>
                    )}
                  </div>

                  <div className="resolve-group">
                    {item.status !== 'resolved' ? (
                      <button 
                        className="resolve-action-btn"
                        onClick={() => handleResolveCall(item.id)}
                      >
                        Mark Safely Evacuated
                      </button>
                    ) : (
                      <span className="evacuated-label">Resident safely evacuated to high-ground shelter</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default EmergencyHotlineModal;
