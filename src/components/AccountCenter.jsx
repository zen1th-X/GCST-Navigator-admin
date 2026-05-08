import { useState, useEffect } from 'react';
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

const AccountCenter = ({ onBack, onLogout, user }) => {
  // Profile form state — pre-filled with current user data
  const [profileData, setProfileData] = useState({
    fullName: user?.name || user?.fullName || '',
    email: user?.email || '',
  });

  useEffect(() => {
    // Debugging to see what user data actually arrived
    console.log('[AccountCenter] Received user prop:', user);
    
    if (user) {
      setProfileData({
        fullName: user.name || user.fullName || '',
        email: user.email || '',
      });
    } else {
      // Fallback in case user bypassed login during testing
      setProfileData({
        fullName: 'Test Admin (Not Logged In)',
        email: 'test@admin.com'
      });
    }
  }, [user]);

  // Admin list state — for future CRUD operations
  const [admins, setAdmins] = useState(MOCK_ADMIN_LIST);

  // ─── Invite Admin Flow State ────────────────────────────────────────────────
  const [showPinModal, setShowPinModal] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [pinValue, setPinValue] = useState(['', '', '', '', '', '']);
  const [pinError, setPinError] = useState('');
  const [newAdmin, setNewAdmin] = useState({ fullName: '', email: '', password: '' });
  const [registerSuccess, setRegisterSuccess] = useState(false);

  // Mock PIN for verification (replace with backend check)
  const CORRECT_PIN = '123456';

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

  // ─── PIN Verification Handlers ──────────────────────────────────────────────
  const handleInviteAdmin = () => {
    // Reset state and open PIN modal
    setPinValue(['', '', '', '', '', '']);
    setPinError('');
    setShowPinModal(true);
  };

  const handlePinChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    if (value && !/^\d$/.test(value)) return;
    const newPin = [...pinValue];
    newPin[index] = value;
    setPinValue(newPin);
    setPinError('');

    // Auto-focus next input
    if (value && index < 5) {
      const next = document.getElementById(`ac-pin-${index + 1}`);
      if (next) next.focus();
    }
  };

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pinValue[index] && index > 0) {
      const prev = document.getElementById(`ac-pin-${index - 1}`);
      if (prev) prev.focus();
    }
  };

  const handlePinSubmit = () => {
    const enteredPin = pinValue.join('');
    if (enteredPin.length < 6) {
      setPinError('Please enter all 6 digits');
      return;
    }
    if (enteredPin !== CORRECT_PIN) {
      setPinError('Incorrect PIN. Please try again.');
      setPinValue(['', '', '', '', '', '']);
      // Refocus first input
      setTimeout(() => {
        const first = document.getElementById('ac-pin-0');
        if (first) first.focus();
      }, 100);
      return;
    }
    // PIN verified — show register form
    setShowPinModal(false);
    setNewAdmin({ fullName: '', email: '', password: '' });
    setRegisterSuccess(false);
    setShowRegisterForm(true);
  };

  const handleClosePinModal = () => {
    setShowPinModal(false);
    setPinValue(['', '', '', '', '', '']);
    setPinError('');
  };

  // ─── Register Admin Handlers ───────────────────────────────────────────────
  const handleRegisterAdmin = (e) => {
    e.preventDefault();
    if (!newAdmin.fullName || !newAdmin.email || !newAdmin.password) return;

    // Generate initials from full name
    const initials = newAdmin.fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    const newEntry = {
      id: `usr_${Date.now()}`,
      fullName: newAdmin.fullName,
      role: 'Editor',
      initials,
      avatarColor: '#0d9488',
    };

    // TODO: Send newAdmin to backend API
    console.log('[AccountCenter] Register Admin:', newAdmin);
    setAdmins((prev) => [...prev, newEntry]);
    setRegisterSuccess(true);
  };

  const handleCloseRegisterForm = () => {
    setShowRegisterForm(false);
    setNewAdmin({ fullName: '', email: '', password: '' });
    setRegisterSuccess(false);
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
    <div className="ac-page" style={{ height: '100%', overflowY: 'auto' }}>
      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="ac-main" id="account-center-main" style={{ padding: '0', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Page Header */}
        <div className="ac-page-header">
          <div>
            <h1 className="ac-page-title">Account Center</h1>
            <p className="ac-page-subtitle">
              Manage your administrative profile and other system-wide permissions.
            </p>
          </div>
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
      </main>

      {/* ── PIN Verification Modal ──────────────────────────────────────────── */}
      {showPinModal && (
        <div className="ac-modal-overlay" onClick={handleClosePinModal}>
          <div className="ac-modal" onClick={(e) => e.stopPropagation()}>
            <button className="ac-modal-close" onClick={handleClosePinModal} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="ac-modal-icon-wrap">
              <img src="/assets/Change Pin Icon.png" alt="" className="ac-modal-icon" />
            </div>
            <h2 className="ac-modal-title">PIN Verification</h2>
            <p className="ac-modal-desc">
              Enter your 6-digit Super Admin PIN to authorize adding a new administrator.
            </p>

            <div className="ac-pin-inputs">
              {pinValue.map((digit, i) => (
                <input
                  key={i}
                  id={`ac-pin-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={`ac-pin-digit ${pinError ? 'ac-pin-error' : ''}`}
                  value={digit}
                  onChange={(e) => handlePinChange(i, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(i, e)}
                  autoFocus={i === 0}
                />
              ))}
            </div>

            {pinError && <p className="ac-pin-error-msg">{pinError}</p>}

            <button className="ac-modal-submit" onClick={handlePinSubmit}>
              Verify PIN
            </button>
          </div>
        </div>
      )}

      {/* ── Register New Admin Modal ────────────────────────────────────────── */}
      {showRegisterForm && (
        <div className="ac-modal-overlay" onClick={handleCloseRegisterForm}>
          <div className="ac-modal ac-modal-wide" onClick={(e) => e.stopPropagation()}>
            <button className="ac-modal-close" onClick={handleCloseRegisterForm} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            {!registerSuccess ? (
              <>
                <div className="ac-modal-icon-wrap ac-modal-icon-success">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                </div>
                <h2 className="ac-modal-title">Register New Admin</h2>
                <p className="ac-modal-desc">
                  Create an Admin Editor account. They will have editing permissions for locations and waypoints.
                </p>

                <form onSubmit={handleRegisterAdmin} className="ac-register-form">
                  <div className="ac-register-field">
                    <label className="ac-field-label">FULL NAME</label>
                    <input
                      type="text"
                      className="ac-field-input"
                      value={newAdmin.fullName}
                      onChange={(e) => setNewAdmin((p) => ({ ...p, fullName: e.target.value }))}
                      placeholder="e.g. Juan Dela Cruz"
                      required
                    />
                  </div>
                  <div className="ac-register-field">
                    <label className="ac-field-label">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      className="ac-field-input"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin((p) => ({ ...p, email: e.target.value }))}
                      placeholder="admin@granbycolleges.edu"
                      required
                    />
                  </div>
                  <div className="ac-register-field">
                    <label className="ac-field-label">TEMPORARY PASSWORD</label>
                    <input
                      type="password"
                      className="ac-field-input"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin((p) => ({ ...p, password: e.target.value }))}
                      placeholder="Minimum 8 characters"
                      minLength={8}
                      required
                    />
                  </div>
                  <button type="submit" className="ac-modal-submit">
                    Register Admin Editor
                  </button>
                </form>
              </>
            ) : (
              <div className="ac-register-success">
                <div className="ac-success-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h2 className="ac-modal-title">Admin Registered!</h2>
                <p className="ac-modal-desc">
                  <strong>{newAdmin.fullName}</strong> has been added as an <strong>Admin Editor</strong>. They can now sign in with their credentials.
                </p>
                <button className="ac-modal-submit" onClick={handleCloseRegisterForm}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountCenter;
