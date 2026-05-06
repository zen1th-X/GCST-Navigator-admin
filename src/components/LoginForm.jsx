import { useState, useEffect } from 'react';
import useLoginForm from '../hooks/useLoginForm';
import PinVerification from './PinVerification';
import RegisterAccount from './RegisterAccount';
import ManageLocation from './ManageLocation';
import '../styles/login.css';

const LoginForm = () => {
  const {
    formData,
    errors,
    isLoading,
    submitResult,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useLoginForm();

  const [showPassword, setShowPassword] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login', 'pin', 'register', or 'dashboard'

  useEffect(() => {
    if (submitResult?.type === 'success') {
      setCurrentView('dashboard');
    }
  }, [submitResult]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  if (currentView === 'dashboard') {
    return <ManageLocation onLogout={() => setCurrentView('login')} />;
  }

  return (
    <div className="login-page" id="login-page">
      {/* Background gradient shapes */}
      <div className="bg-gradient-shape bg-shape-1"></div>
      <div className="bg-gradient-shape bg-shape-2"></div>

      {/* Top Navbar */}
      <nav className="top-navbar" id="top-navbar">
        <div className="navbar-brand">
          <img
            src="/assets/granby logo.jpg"
            alt="GCST Logo"
            className="navbar-logo"
          />
          <span className="navbar-title">GCST Navigator</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="login-main">
        {currentView === 'pin' ? (
          <PinVerification onBack={() => setCurrentView('login')} onVerify={() => setCurrentView('register')} />
        ) : currentView === 'register' ? (
          <RegisterAccount onLogin={() => setCurrentView('login')} />
        ) : (
          <div className="login-card" id="login-card">
            {/* Left Panel — Info Section (hidden on mobile) */}
            <div className="info-panel" id="info-panel">
              <div className="info-content">
                <span className="info-badge">ADMINISTRATIVE CONSOLE</span>
                <h1 className="info-heading">
                  Navigate the future of{' '}
                  <span className="info-heading-accent">Campus Accessibility</span>.
                </h1>
                <p className="info-description">
                  Manage campus locations and control their availability in a centralized wayfinding dashboard for new students and visitors.
                </p>
                <div className="info-image-wrapper">
                  <img
                    src="/assets/granby_background.png"
                    alt="GCST Campus - Granby Colleges of Science and Technology"
                    className="info-campus-image"
                  />
                </div>
              </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="form-panel" id="form-panel">
              <div className="form-content">
                {/* Logo + Title */}
                <div className="form-header">
                  <img
                    src="/assets/granby logo.jpg"
                    alt="Granby Colleges of Science and Technology Logo"
                    className="form-logo"
                    id="form-logo"
                  />
                  <h2 className="form-title">Admin Portal</h2>
                  <p className="form-subtitle">MANAGE CAMPUS NAVIGATION FOR VISITORS & STUDENTS</p>
                </div>


                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form" id="login-form" noValidate>
                  {/* CSRF Token Placeholder */}
                  <input type="hidden" name="_token" value="" />

                  {/* Username / Email Field */}
                  <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
                    <div className="form-label-row">
                      <label htmlFor="email" className="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        Admin Email
                      </label>
                    </div>
                    <input
                      type="text"
                      id="email"
                      name="email"
                      className="form-input"
                      value={formData.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={isLoading}
                      autoComplete="email"
                      placeholder="admin.name@granbycolleges.edu"
                    />
                    {errors.email && (
                      <span className="form-error" id="email-error">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {errors.email}
                      </span>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
                    <div className="form-label-row">
                      <label htmlFor="password" className="form-label">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        Password
                      </label>
                      <a href="#" className="forgot-password" id="forgot-password" onClick={(e) => e.preventDefault()}>
                        Forgot Password?
                      </a>
                    </div>
                    <div className="input-with-toggle">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={isLoading}
                        autoComplete="current-password"
                        placeholder="••••••••••••"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        id="password-toggle"
                        onClick={togglePasswordVisibility}
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                            <line x1="1" y1="1" x2="23" y2="23" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <span className="form-error" id="password-error">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {/* Remember this workstation */}
                  <label className="remember-me" id="remember-me">
                    <input
                      type="checkbox"
                      name="remember"
                      checked={formData.remember}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <span className="checkbox-custom">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="remember-text">Remember this workstation</span>
                  </label>

                  {/* Login Button */}
                  <button
                    type="submit"
                    className={`login-btn ${isLoading ? 'is-loading' : ''}`}
                    id="login-submit-btn"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="btn-loading">
                        <span className="spinner"></span>
                        <span>Authenticating...</span>
                      </span>
                    ) : (
                      <span className="btn-content">
                        <span>Login to Dashboard</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                          <polyline points="10 17 15 12 10 7" />
                          <line x1="15" y1="12" x2="3" y2="12" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="other-views-divider">
                  <span className="divider-line"></span>
                  <span className="divider-line"></span>
                </div>

                {/* Create Admin Account Button */}
                <button className="create-account-btn" id="create-account-btn" type="button" onClick={() => setCurrentView('pin')}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  <span>Create Super Admin Account</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="page-footer" id="page-footer">
        <p>&copy; {new Date().getFullYear()} Granby Colleges of Science and Technology. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoginForm;
