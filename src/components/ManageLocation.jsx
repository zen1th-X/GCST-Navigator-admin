import { useState } from 'react';
import AccountCenter from './AccountCenter';
import '../styles/dashboard.css';

const DEFAULT_LOCATIONS = [
  { id: 'GA-101', name: 'Emergency Clinic', icon: '/assets/Location_Icon/Emergency Clinic Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-pink' },
  { id: 'GA-102', name: 'Cashier’s Office', icon: '/assets/Location_Icon/Cashier\'s Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-mint' },
  { id: 'GA-103', name: 'President’s Secretary', icon: '/assets/Location_Icon/President\'s Secretary Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-blue' },
  { id: 'GA-104', name: 'IT Department', icon: '/assets/Location_Icon/IT Department Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-blue' },
  { id: 'GA-105', name: 'Comfort Room (Gentlemen)', icon: '/assets/Location_Icon/Comfort Room (Gentlemen) Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-tan' },
  { id: 'GA-106', name: 'President Office', icon: '/assets/Location_Icon/President Office Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-tan' },
  { id: 'GA-107', name: 'Office of the Principal', icon: '/assets/Location_Icon/Office of the Principal Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-pink' },
  { id: 'GA-108', name: 'Registrar’s Office', icon: '/assets/Location_Icon/Registrar\'s Office Icon.png', building: 'Building A', floor: 'Floor 1', status: 'ACTIVE', colorClass: 'bg-tan' },
];

const ManageLocation = ({ onLogout }) => {
  const [locations, setLocations] = useState(DEFAULT_LOCATIONS);
  const [activeTab, setActiveTab] = useState('All Floors');
  const [showAccountCenter, setShowAccountCenter] = useState(false);

  const tabs = ['All Floors', 'Floor 1', 'Floor 2', 'Floor 3', 'Floor 4'];

  const filteredLocations = activeTab === 'All Floors'
    ? locations
    : locations.filter(loc => loc.floor === activeTab);

  // Show Account Center page
  if (showAccountCenter) {
    return (
      <AccountCenter
        onBack={() => setShowAccountCenter(false)}
        onLogout={onLogout}
      />
    );
  }

  return (
    <div className="dashboard-container">
      {/* Top Navbar */}
      <nav className="dashboard-navbar">
        <div className="navbar-brand">
          <img
            src="/assets/granby logo.jpg"
            alt="GCST Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">GCST Navigator</span>
        </div>
        <button className="profile-btn" onClick={() => setShowAccountCenter(true)} aria-label="Account Center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Header Section */}
        <div className="manage-header">
          <span className="admin-subtitle">ADMINISTRATION PORTAL</span>
          <h1 className="manage-title">Manage Locations</h1>
          <div className="search-bar-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search room or code..."
              className="search-input"
            />
          </div>
        </div>

        {/* Controls Section */}
        <div className="controls-section">
          <div className="floor-tabs">
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`floor-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="results-filter-row">
            <div className="results-info">
              <span className="results-count">{filteredLocations.length} Destinations</span>
              <span className="results-divider"> • </span>
              <span className="results-view">Current View</span>
            </div>
            <button className="filter-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        {/* Location Grid */}
        <div className="location-grid">
          {filteredLocations.map((loc) => (
            <div key={loc.id} className="location-card">
              <div className="card-left">
                <div className={`icon-wrapper ${loc.colorClass}`}>
                  <img src={loc.icon} alt={loc.name} className="loc-icon" />
                </div>
                
              </div>
              <div className="card-content">
                <h3 className="loc-name">{loc.name}</h3>
                <p className="loc-meta">
                  {loc.building} • {loc.floor} • {loc.id}
                </p>
                <div className="status-badge">{loc.status}</div>
              </div>
              <div className="card-actions">
                <button className="action-btn" aria-label="Edit Location">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
                <button className="action-btn" aria-label="Hide Location">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Campus Overview Banner */}
        <div className="campus-banner">
          <div className="banner-content">
            <h2 className="banner-title">Interactive Campus Overview</h2>
            <p className="banner-subtitle">Review 8 spatially mapped destinations</p>
          </div>
          <button className="expand-map-btn">Expand Map View</button>
        </div>
      </main>
    </div>
  );
};

export default ManageLocation;
