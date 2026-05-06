import { useState } from 'react';
import '../styles/account-center.css';

/**
 * AccountCenter Component
 *
 * Responsive "Account Center" page accessible from the profile icon in the header.
 * Desktop: Two-column layout (Profile + Security left, Permissions right)
 * Mobile: Single column, stacked vertically
 *
 * Front-end only — structured for future database integration.
 * All user data is managed via state and can be swapped for API calls.
 */

// ─── Mock Data (replace with API/database calls later) ───────────────────────
const MOCK_CURRENT_USER = {
  id: 'usr_001',
  fullName: 'President Name',
  email: 'president_email@university.edu',
  role: 'Super Admin',       // 'Super Admin' | 'Editor'
  initials: 'PN',
};

const MOCK_ADMIN_LIST = [
  {
    id: 'usr_001',
    fullName: 'President Name',
    role: 'Super Admin',
    initials: 'PN',
    avatarColor: '#1a56db',   // blue for Super Admin
  },
  {
    id: 'usr_002',
    fullName: 'Admin Name',
    role: 'Editor',
    initials: 'AN',
    avatarColor: '#0d9488',   // teal for Editor
  },
];
// ─────────────────────────────────────────────────────────────────────────────

const AccountCenter = ({ onBack, onLogout }) => {
  // Profile form state — pre-filled with current user data
  const [profileData, setProfileData] = useState({
    fullName: MOCK_CURRENT_USER.fullName,
    email: MOCK_CURRENT_USER.email,
  });

  // Admin list state — for future CRUD operations
  const [admins] = useState(MOCK_ADMIN_LIST);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // TODO: Send profileData to backend
    console.log('[AccountCenter] Update profile:', profileData);
  };

  const handleChangePin = () => {
    // TODO: Open PIN change modal / flow
    console.log('[AccountCenter] Change PIN requested');
  };

  const handleChangePassword = () => {
    // TODO: Open password change modal / flow
    console.log('[AccountCenter] Change Password requested');
  };

  const handleInviteAdmin = () => {
    // TODO: Open invite admin modal / flow
    console.log('[AccountCenter] Invite New Admin requested');
  };

  const handleSignOut = () => {
    // TODO: Clear session / tokens
    console.log('[AccountCenter] Sign Out');
    if (onLogout) onLogout();
  };

  // ─── Role Icon Helper ─────────────────────────────────────────────────────
  const getRoleIcon = (role) => {
    if (role === 'Super Admin') {
      // Shield with star — authority / full access
      return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polygon points="12,8 13.12,10.82 16,11.24 14,13.4 14.47,16.32 12,14.97 9.53,16.32 10,13.4 8,11.24 10.88,10.82" fill="currentColor" stroke="none" />
        </svg>
      );
    }
    // Pencil/edit — editor permissions
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    );
  };

  return (
    <div className="dashboard-container ac-page">
      {/* ── Top Navbar ────────────────────────────────────────────────────── */}
      <nav className="dashboard-navbar" id="ac-navbar">
        <div className="navbar-brand">
          <img
            src="/assets/granby logo.jpg"
            alt="GCST Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">GCST Navigator</span>
        </div>
        <button
          className="profile-btn ac-profile-btn-active"
          onClick={onBack}
          aria-label="Back to Dashboard"
          id="ac-profile-btn"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </nav>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="ac-main" id="account-center-main">
        {/* Page Header */}
        <div className="ac-page-header">
          <h1 className="ac-page-title">Account Center</h1>
          <p className="ac-page-subtitle">
            Manage your administrative profile and other system-wide permissions.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="ac-grid">
          {/* ── Left Column ──────────────────────────────────────────────── */}
          <div className="ac-left-col">
            {/* Profile Information Card */}
            <div className="ac-card" id="ac-profile-card">
              <div className="ac-card-header">
                <img src="/assets/Profile Info Update.png" alt="" className="ac-card-icon-img" />
                <h2 className="ac-card-title">Profile Information</h2>
              </div>

              <form onSubmit={handleUpdateProfile} className="ac-profile-form">
                <div className="ac-profile-fields">
                  <div className="ac-field-group">
                    <label className="ac-field-label" htmlFor="ac-fullName">FULL NAME</label>
                    <input
                      type="text"
                      id="ac-fullName"
                      name="fullName"
                      className="ac-field-input"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="ac-field-group">
                    <label className="ac-field-label" htmlFor="ac-email">ADMINISTRATIVE EMAIL</label>
                    <input
                      type="email"
                      id="ac-email"
                      name="email"
                      className="ac-field-input"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      placeholder="admin@granbycolleges.edu"
                    />
                  </div>
                </div>
                <button type="submit" className="ac-update-btn" id="ac-update-profile-btn">
                  Update Profile
                </button>
              </form>
            </div>

            {/* Security & Privacy Card */}
            <div className="ac-card" id="ac-security-card">
              <div className="ac-card-header">
                <svg className="ac-card-icon ac-card-icon-shield" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 12 15 16 10" />
                </svg>
                <h2 className="ac-card-title">Security & Privacy</h2>
              </div>

              <div className="ac-security-list">
                {/* Register Access PIN */}
                <div className="ac-security-item">
                  <div className="ac-security-icon-wrap">
                    <img src="/assets/Change Pin Icon.png" alt="" className="ac-security-icon-img" />
                  </div>
                  <div className="ac-security-info">
                    <span className="ac-security-title">Register Access PIN</span>
                    <span className="ac-security-desc">Update your quick-access 6-digit code</span>
                  </div>
                  <button
                    className="ac-security-action"
                    onClick={handleChangePin}
                    id="ac-change-pin-btn"
                  >
                    CHANGE PIN
                  </button>
                </div>

                {/* Password */}
                <div className="ac-security-item">
                  <div className="ac-security-icon-wrap">
                    <img src="/assets/Change Password Icon.png" alt="" className="ac-security-icon-img" />
                  </div>
                  <div className="ac-security-info">
                    <span className="ac-security-title">Password</span>
                    <span className="ac-security-desc">Regularly update your credentials for security</span>
                  </div>
                  <button
                    className="ac-security-action"
                    onClick={handleChangePassword}
                    id="ac-change-password-btn"
                  >
                    CHANGE PASSWORD
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right Column ─────────────────────────────────────────────── */}
          <div className="ac-right-col">
            {/* Admin Permissions Card */}
            <div className="ac-card" id="ac-permissions-card">
              <div className="ac-card-header">
                <img src="/assets/Admin Permission Icon.png" alt="" className="ac-card-icon-img" />
                <h2 className="ac-card-title">Admin Permissions</h2>
              </div>

              <div className="ac-admin-list">
                {admins.map((admin) => (
                  <div className="ac-admin-item" key={admin.id}>
                    <div
                      className="ac-admin-avatar"
                      style={{ backgroundColor: admin.avatarColor }}
                    >
                      {admin.initials}
                    </div>
                    <div className="ac-admin-info">
                      <span className="ac-admin-name">{admin.fullName}</span>
                      <span
                        className={`ac-admin-role ${admin.role === 'Super Admin' ? 'ac-role-super' : 'ac-role-editor'}`}
                      >
                        {getRoleIcon(admin.role)}
                        {admin.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                className="ac-invite-btn"
                onClick={handleInviteAdmin}
                id="ac-invite-admin-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
                <span>Invite New Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Sign Out Button ──────────────────────────────────────────────── */}
        <div className="ac-signout-wrapper">
          <button
            className="ac-signout-btn"
            onClick={handleSignOut}
            id="ac-signout-btn"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </main>
    </div>
  );
};

export default AccountCenter;
