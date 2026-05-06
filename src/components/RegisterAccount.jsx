import { useState } from 'react';

const RegisterAccount = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Front-end only for now
    console.log('Registering account with:', formData);
  };

  return (
    <div className="register-container">
      <div className="register-header">
        <img
          src="/assets/granby logo.jpg"
          alt="Granby Colleges of Science and Technology Logo"
          className="register-logo"
        />
        <h2 className="register-title">Create Super Admin Account</h2>
        <p className="register-subtitle">Lead and manage Granby’s navigation operations.</p>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        {/* Full Name */}
        <div className="form-group">
          <label htmlFor="fullName" className="form-label">Full Name</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input icon-padded"
              placeholder="Jane Doe"
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Admin Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Admin Email</label>
          <div className="input-with-icon">
            <span className="input-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </span>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input icon-padded"
              placeholder="name@granbycolleges.edu"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Password Row */}
        <div className="form-row">
          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <input
                type="password"
                id="password"
                name="password"
                className="form-input icon-padded"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <div className="input-with-icon">
              <span className="input-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 12 15 16 10" />
                </svg>
              </span>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-input icon-padded"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="terms-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="agreeTerms"
              className="custom-checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
            />
            <span className="terms-text">
              I agree to the <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a> and <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="register-submit-btn">
          Register Account
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>

      {/* Footer Link */}
      <div className="register-footer">
        <span className="footer-text">Already have an account?</span>
        <button type="button" className="login-link-btn" onClick={onLogin}>
          Log In
        </button>
      </div>
    </div>
  );
};

export default RegisterAccount;
