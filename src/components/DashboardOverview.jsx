import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Inbox, 
  RotateCcw, 
  BookText, 
  Shapes, 
  Library, 
  LogOut, 
  User, 
  BookOpen, 
  Users, 
  UserMinus, 
  ClipboardList, 
  CalendarX2, 
  Ban, 
  Plus 
} from 'lucide-react';
import '../styles/dashboard.css';
import { database } from '../firebase';
import { ref, onValue } from 'firebase/database';
import AccountCenter from './AccountCenter';

const DashboardOverview = ({ onLogout, user }) => {
  const [showAccountCenter, setShowAccountCenter] = useState(false);
  const [stats, setStats] = useState({
    availableBooks: 0,
    categories: 0,
    members: 0,
    suspended: 0,
    pendingRequests: 0,
    overdueBooks: 0,
    unavailable: 0,
    nonReturn: 0,
    issuedBooks: 0
  });

  useEffect(() => {
    // Reference to the 'library_stats' node in Firebase
    // If your node is named differently, update 'library_stats' to match your database structure
    const statsRef = ref(database, 'library_stats');
    
    // Listen for real-time changes
    const unsubscribe = onValue(statsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setStats(prevStats => ({
          ...prevStats,
          ...data
        }));
      }
    }, (error) => {
      console.error("Error fetching real-time data: ", error);
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, active: true },
    { name: 'Requests', icon: <Inbox size={20} /> },
    { name: 'Non-returned', icon: <RotateCcw size={20} /> },
    { name: 'Issued Books', icon: <BookText size={20} /> },
    { name: 'Categories', icon: <Shapes size={20} /> },
    { name: 'Books', icon: <Library size={20} /> }
  ];

  const cards = [
    { title: 'Available\nBooks', value: stats.availableBooks, icon: <BookOpen size={24} />, theme: 'card-theme-blue' },
    { title: 'Categories', value: stats.categories, icon: <Shapes size={24} />, theme: 'card-theme-teal' },
    { title: 'Members', value: stats.members, icon: <Users size={24} />, theme: 'card-theme-orange' },
    { title: 'Suspended', value: stats.suspended, icon: <UserMinus size={24} />, theme: 'card-theme-red' },
    { title: 'Pending\nRequests', value: stats.pendingRequests, icon: <ClipboardList size={24} />, theme: 'card-theme-gray' },
    { title: 'Overdue\nBooks', value: stats.overdueBooks, icon: <CalendarX2 size={24} />, theme: 'card-theme-pink' },
    { title: 'Unavailable', value: stats.unavailable, icon: <Ban size={24} />, theme: 'card-theme-slate' },
    { title: 'Non-return', value: stats.nonReturn, icon: <RotateCcw size={24} />, theme: 'card-theme-peach' },
    { title: 'Issued\nBooks', value: stats.issuedBooks, icon: <BookText size={24} />, theme: 'card-theme-indigo' }
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="dash-sidebar">
        <div className="dash-sidebar-top">
          {/* Logo Section */}
          <div className="dash-logo-container">
            <img src="/assets/granby logo.jpg" alt="GCST Logo" className="dash-logo-img" />
            <div className="dash-logo-text">
              <span>Library of</span>
              <span>Granby Colleges</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="dash-nav">
            {menuItems.map((item, index) => (
              <a
                key={index}
                href="#"
                className={`dash-nav-item ${item.name === 'Dashboard' && !showAccountCenter ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (item.name === 'Dashboard') {
                    setShowAccountCenter(false);
                  }
                }}
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="dash-sidebar-bottom">
          <button onClick={onLogout} className="dash-logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          
          <div className="dash-account-center" onClick={() => setShowAccountCenter(true)} style={{ cursor: 'pointer', transition: 'background 0.2s' }} title="Open Account Center">
            <div className="dash-account-avatar">
              <User size={20} />
            </div>
            <div className="dash-account-info">
              <span className="dash-account-name">{user?.name || 'Account Center'}</span>
              <span className="dash-account-role" style={{ textTransform: 'capitalize' }}>
                {user?.role ? user.role.replace('_', ' ') : 'Super Admin'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dash-main">
        {showAccountCenter ? (
          <AccountCenter onBack={() => setShowAccountCenter(false)} onLogout={onLogout} user={user} />
        ) : (
          <>
            <header className="dash-header">
              <h1 className="dash-title">Dashboard Overview</h1>
              <p className="dash-subtitle">
                Welcome back, {user?.name ? user.name.split(' ')[0] : 'Administrator'}. Here is an editorial summary of your library's current circulation and catalog status.
              </p>
            </header>

            {/* Stats Grid */}
            <div className="dash-grid">
              {cards.map((card, index) => (
                <div key={index} className="dash-card">
                  <div className="dash-card-left">
                    <div className={`dash-card-icon ${card.theme}`}>
                      {card.icon}
                    </div>
                    <span className="dash-card-label" style={{ whiteSpace: 'pre-line' }}>{card.title}</span>
                  </div>
                  <span className="dash-card-value">{card.value}</span>
                </div>
              ))}
            </div>

            {/* Floating Action Button */}
            <button className="dash-fab">
              <Plus size={28} />
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default DashboardOverview;
