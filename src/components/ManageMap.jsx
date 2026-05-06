import { useState, useMemo } from 'react';
import '../styles/manage-map.css';

/**
 * ManageMap Component
 *
 * Interactive floor-plan map view opened when a location card is clicked.
 * - Displays the empty map image with clickable labeled regions
 * - Shows a single location pin on the active/selected location
 * - Right panel shows Selected Marker details (display name, status, floor)
 * - Floor level selector on far right
 * - Bottom toolbar: Edit Mode / View toggle, Cancel, Save
 *
 * Front-end only — structured for future database integration.
 */

// ─── Map location data with pin positions (% based for responsiveness) ───────
// Positions are approximate percentages on the map image.
// "Admin" maps to Registrar (same GA-108).
const MAP_LOCATIONS = [
  { id: 'GA-101', name: 'Emergency Clinic',         label: 'Emergency\nClinic',     floor: 1, status: 'Active', pinX: 40, pinY: 86, labelX: 28, labelY: 82, clickArea: { x1: 15, y1: 74, x2: 52, y2: 92 } },
  { id: 'GA-102', name: "Cashier's Office",          label: "Cashier's Office",       floor: 1, status: 'Active', pinX: 50, pinY: 64, labelX: 33, labelY: 58, clickArea: { x1: 12, y1: 56, x2: 42, y2: 70 } },
  { id: 'GA-103', name: "President's Secretary",     label: 'President\nSecretary',   floor: 1, status: 'Active', pinX: 48, pinY: 36, labelX: 37, labelY: 33.5, clickArea: { x1: 12, y1: 40, x2: 42, y2: 56 } },
  { id: 'GA-104', name: 'IT Department',             label: 'IT Department',          floor: 1, status: 'Active', pinX: 48, pinY: 25, labelX: 33, labelY: 22.5, clickArea: { x1: 12, y1: 24, x2: 42, y2: 40 } },
  { id: 'GA-105', name: 'Comfort Room',              label: 'Comfort Room',           floor: 1, status: 'Active', pinX: 63, pinY: 16, labelX: 77, labelY: 12, clickArea: { x1: 50, y1: 8, x2: 80, y2: 24 } },
  { id: 'GA-106', name: 'President Office',          label: 'President Office',       floor: 1, status: 'Active', pinX: 52, pinY: 32, labelX: 71, labelY: 29, clickArea: { x1: 48, y1: 28, x2: 78, y2: 44 } },
  { id: 'GA-107', name: 'Office of the Principal',   label: 'Principal Office',       floor: 1, status: 'Active', pinX: 53, pinY: 46, labelX: 71, labelY: 43.5, clickArea: { x1: 48, y1: 44, x2: 78, y2: 60 } },
  { id: 'GA-108', name: "Registrar's Office",        label: "Registrar's",            floor: 1, status: 'Active', pinX: 55.5, pinY: 74, labelX: 71, labelY: 57, clickArea: { x1: 48, y1: 56, x2: 78, y2: 70 } },
  { id: 'GA-108-admin', resolveId: 'GA-108', name: "Registrar's Office", label: 'Admin', floor: 1, status: 'Active', pinX: 56, pinY: 72, labelX: 70, labelY: 71 , clickArea: { x1: 48, y1: 70, x2: 72, y2: 80 } },
];

const FLOORS = [4, 3, 2, 1];

const ManageMap = ({ location, onBack, onAccountCenter }) => {
  // Find the initial location from the map data
  const initialLoc = MAP_LOCATIONS.find(
    (m) => m.id === location?.id || m.name === location?.name
  ) || MAP_LOCATIONS[0];

  const [selectedId, setSelectedId] = useState(initialLoc.resolveId || initialLoc.id);
  const [activeFloor, setActiveFloor] = useState(1);
  const [mode, setMode] = useState('edit'); // 'edit' | 'view'
  const [searchQuery, setSearchQuery] = useState('');

  // Editable marker state
  const selectedLoc = useMemo(
    () => MAP_LOCATIONS.find((m) => (m.resolveId || m.id) === selectedId && !m.resolveId) || MAP_LOCATIONS[0],
    [selectedId]
  );

  const [markerData, setMarkerData] = useState({
    displayName: selectedLoc.name,
    status: selectedLoc.status,
    floor: `Floor ${selectedLoc.floor}`,
  });

  // When a map region is clicked
  const handleMapClick = (loc) => {
    const resolvedId = loc.resolveId || loc.id;
    setSelectedId(resolvedId);
    const resolved = MAP_LOCATIONS.find((m) => m.id === resolvedId && !m.resolveId) || loc;
    setMarkerData({
      displayName: resolved.name,
      status: resolved.status,
      floor: `Floor ${resolved.floor}`,
    });
  };

  const handleClosePanel = () => {
    // Deselect — but keep showing the map
    setSelectedId(null);
  };

  const handleUpdateWaypoint = () => {
    // TODO: Send markerData to backend
    console.log('[ManageMap] Update Waypoint:', { id: selectedId, ...markerData });
  };

  const handleSave = () => {
    // TODO: Persist all changes
    console.log('[ManageMap] Save all changes');
  };

  const handleCancel = () => {
    onBack();
  };

  // Filter locations for current floor
  const visibleLocations = MAP_LOCATIONS.filter((loc) => loc.floor === activeFloor);

  return (
    <div className="dashboard-container mm-page">
      {/* ── Top Navbar ─────────────────────────────────────────────────── */}
      <nav className="dashboard-navbar" id="mm-navbar">
        <div className="navbar-brand">
          <img
            src="/assets/granby logo.jpg"
            alt="GCST Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">GCST Navigator</span>
        </div>
        <button
          className="profile-btn"
          onClick={onAccountCenter}
          aria-label="Account Center"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </nav>

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="mm-main">
        <div className="mm-content-card">
          {/* Search Bar + Back */}
          <div className="mm-top-bar">
            <div className="mm-search-wrapper">
              <svg className="mm-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search rooms, buildings, or faculty..."
                className="mm-search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="mm-filter-icon-btn" aria-label="Filter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </button>
            </div>
            <button className="mm-back-btn" onClick={onBack}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Back
            </button>
          </div>

          {/* Map + Panel + Floor Selector */}
          <div className="mm-body">
            {/* ── Map Area ────────────────────────────────────────────── */}
            <div className="mm-map-area">
              <div className="mm-map-container">
                <img
                  src="/assets/Empty Map Image.png"
                  alt="Floor Plan"
                  className="mm-map-image"
                  draggable="false"
                />

                {/* Clickable text labels + pins */}
                {visibleLocations.map((loc) => {
                  const resolvedId = loc.resolveId || loc.id;
                  const isActive = resolvedId === selectedId;

                  return (
                    <div key={loc.id}>
                      {/* Text label (clickable) */}
                      <button
                        className={`mm-map-label ${isActive ? 'mm-map-label-active' : ''}`}
                        style={{ left: `${loc.labelX}%`, top: `${loc.labelY}%` }}
                        onClick={() => handleMapClick(loc)}
                        aria-label={`Select ${loc.name}`}
                      >
                        {loc.label.split('\n').map((line, i) => (
                          <span key={i}>{line}</span>
                        ))}
                      </button>

                      {/* Location pin — only show on the primary entry, not aliases */}
                      {isActive && !loc.resolveId && (
                        <div
                          className="mm-pin"
                          style={{ left: `${loc.pinX}%`, top: `${loc.pinY}%` }}
                        >
                          <svg width="24" height="32" viewBox="0 0 24 32" fill="none">
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20s12-11 12-20c0-6.627-5.373-12-12-12z" fill="#e53e3e"/>
                            <circle cx="12" cy="12" r="5" fill="white"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Right Column (Panel + Mode Toggle) ────────────────── */}
            <div className="mm-right-col">
              {selectedId && (
                <div className="mm-panel" id="mm-marker-panel">
                  <div className="mm-panel-header">
                    <div>
                      <span className="mm-panel-label">SELECTED MARKER</span>
                      <h2 className="mm-panel-id">{selectedId}</h2>
                    </div>
                    <button className="mm-panel-close" onClick={handleClosePanel} aria-label="Close panel">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* Display Name */}
                  <div className="mm-panel-field">
                    <label className="mm-panel-field-label">DISPLAY NAME</label>
                    <input
                      type="text"
                      className="mm-panel-input"
                      value={markerData.displayName}
                      onChange={(e) => setMarkerData((p) => ({ ...p, displayName: e.target.value }))}
                      readOnly={mode === 'view'}
                    />
                  </div>

                  {/* Operational Status */}
                  <div className="mm-panel-field">
                    <label className="mm-panel-field-label">OPERATIONAL STATUS</label>
                    <div className="mm-status-toggle">
                      <button
                        className={`mm-status-btn ${markerData.status === 'Active' ? 'mm-status-active' : ''}`}
                        onClick={() => mode === 'edit' && setMarkerData((p) => ({ ...p, status: 'Active' }))}
                      >
                        Active
                      </button>
                      <button
                        className={`mm-status-btn ${markerData.status === 'Maintenance' ? 'mm-status-maintenance' : ''}`}
                        onClick={() => mode === 'edit' && setMarkerData((p) => ({ ...p, status: 'Maintenance' }))}
                      >
                        Maintenance
                      </button>
                    </div>
                  </div>

                  {/* Floor Level */}
                  <div className="mm-panel-field">
                    <label className="mm-panel-field-label">FLOOR LEVEL</label>
                    <div className="mm-floor-select-wrapper">
                      <select
                        className="mm-floor-select"
                        value={markerData.floor}
                        onChange={(e) => mode === 'edit' && setMarkerData((p) => ({ ...p, floor: e.target.value }))}
                        disabled={mode === 'view'}
                      >
                        <option value="Floor 1">1st Floor</option>
                        <option value="Floor 2">2nd Floor</option>
                        <option value="Floor 3">3rd Floor</option>
                        <option value="Floor 4">4th Floor</option>
                      </select>
                      <svg className="mm-select-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="7 10 12 15 17 10" />
                        <polyline points="7 14 12 9 17 14" transform="translate(0,-8)" />
                      </svg>
                    </div>
                  </div>

                  {/* Update Waypoint */}
                  <button
                    className="mm-update-btn"
                    onClick={handleUpdateWaypoint}
                    disabled={mode === 'view'}
                  >
                    <img src="/assets/Map icon.png" alt="" className="mm-update-btn-icon" />
                    Update Waypoint
                  </button>
                </div>
              )}

              {/* Mode Toggle — pushed to bottom */}
              <div className="mm-mode-toggle-wrapper">
                <div className="mm-toolbar-left">
                  <div className="mm-mode-toggle">
                    <button
                      className={`mm-mode-btn ${mode === 'edit' ? 'mm-mode-btn-active' : ''}`}
                      onClick={() => setMode('edit')}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                      Edit Mode
                    </button>
                    <button
                      className={`mm-mode-btn ${mode === 'view' ? 'mm-mode-btn-active' : ''}`}
                      onClick={() => setMode('view')}
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Floor Level Selector ────────────────────────────────── */}
            <div className="mm-floor-selector">
              {FLOORS.map((f) => (
                <button
                  key={f}
                  className={`mm-floor-btn ${activeFloor === f ? 'mm-floor-btn-active' : ''}`}
                  onClick={() => setActiveFloor(f)}
                >
                  {f}
                </button>
              ))}
              <button className="mm-layers-btn" aria-label="Toggle layers">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManageMap;
