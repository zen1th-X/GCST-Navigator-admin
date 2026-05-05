import { useState, useRef, useEffect } from 'react';

const PinVerification = ({ onBack, onVerify }) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const isComplete = pin.every((digit) => digit !== '');

  const handleInputChange = (index, value) => {
    // Allow only numbers
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Auto-advance focus
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeypadPress = (key) => {
    if (key === 'backspace') {
      // Find the last filled index to delete
      const lastFilledIndex = pin.findLastIndex((digit) => digit !== '');
      if (lastFilledIndex !== -1) {
        const newPin = [...pin];
        newPin[lastFilledIndex] = '';
        setPin(newPin);
        inputRefs.current[lastFilledIndex]?.focus();
      }
    } else {
      // Find the first empty index to fill
      const firstEmptyIndex = pin.findIndex((digit) => digit === '');
      if (firstEmptyIndex !== -1) {
        const newPin = [...pin];
        newPin[firstEmptyIndex] = key;
        setPin(newPin);
        // Focus the next input if available, or stay on current
        if (firstEmptyIndex < 5) {
          inputRefs.current[firstEmptyIndex + 1]?.focus();
        } else {
          inputRefs.current[firstEmptyIndex]?.focus();
        }
      }
    }
  };

  // Focus the first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  return (
    <div className="pin-verification-container">
      <div className="pin-header-actions">
        <button className="back-btn" onClick={onBack} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Login
        </button>
      </div>

      <div className="pin-content">
        <div className="pin-icon-wrapper">
          <div className="pin-lock-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
        </div>

        <h2 className="pin-title">Admin Verification</h2>
        <p className="pin-subtitle">
          Please enter the 6-digit administrative PIN provided by the IT department to proceed.
        </p>

        <div className="pin-inputs">
          {pin.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              ref={(el) => (inputRefs.current[index] = el)}
              className={`pin-input-box ${digit ? 'filled' : ''}`}
              autoComplete="off"
            />
          ))}
        </div>

        <div className="keypad">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              className="keypad-btn"
              onClick={() => handleKeypadPress(num.toString())}
            >
              {num}
            </button>
          ))}
          <div className="keypad-spacer"></div>
          <button
            type="button"
            className="keypad-btn"
            onClick={() => handleKeypadPress('0')}
          >
            0
          </button>
          <button
            type="button"
            className="keypad-btn backspace-btn"
            onClick={() => handleKeypadPress('backspace')}
            aria-label="Backspace"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
              <line x1="18" y1="9" x2="12" y2="15" />
              <line x1="12" y1="9" x2="18" y2="15" />
            </svg>
          </button>
        </div>

        <button
          type="button"
          className={`verify-btn ${isComplete ? 'active' : ''}`}
          disabled={!isComplete}
          onClick={() => isComplete && onVerify()}
        >
          Verify & Continue
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <div className="secure-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <polyline points="9 12 12 15 16 10" />
          </svg>
          SECURE ENCRYPTED SESSION
        </div>
      </div>
    </div>
  );
};

export default PinVerification;
