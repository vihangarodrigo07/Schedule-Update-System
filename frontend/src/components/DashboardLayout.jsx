import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { LayoutDashboard, BookOpen, GitPullRequest, Calendar, Users, Settings, LogOut } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({ name: 'Loading...', role: '' });

  useEffect(() => {
    // Fetch the logged-in user's data from local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      // If no user is found in storage, send them back to login
      navigate('/');
    }
  }, [navigate]);

  // Helper function to generate initials (e.g., "Dr. Sarah Jenkins" -> "SJ")
  const getInitials = (name) => {
    if (!name || name === 'Loading...') return '??';
    
    // Remove titles before getting initials
    const cleanName = name.replace(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Prof\.)\s+/i, '');
    const nameParts = cleanName.split(' ');
    
    if (nameParts.length >= 2) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return cleanName.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    // Clear the session and redirect to login
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <div style={styles.logoSection}>
          <div style={styles.logoIcon}>🎓</div>
          <span style={styles.logoText}>Academic Central</span>
        </div>
        
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.link}><LayoutDashboard size={20} /> Dashboard</Link>
          <Link to="/lectures" style={styles.link}><BookOpen size={20} /> Lectures</Link>
          <Link to="/requests" style={styles.link}><GitPullRequest size={20} /> Requests</Link>
          <Link to="/calendar" style={styles.link}><Calendar size={20} /> Calendar</Link>
          <Link to="/users" style={styles.link}><Users size={20} /> Users</Link>
        </div>

        <div style={styles.bottomNav}>
          <Link to="/settings" style={styles.link}><Settings size={20} /> Settings</Link>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        <header style={styles.header}>
          <div>
            <span style={styles.breadcrumb}>SYSTEM ADMINISTRATOR PORTAL</span>
          </div>
          <div style={styles.adminProfile}>
            <div style={styles.profileText}>
                <span style={styles.profileName}>{currentUser.name}</span>
                <span style={styles.profileRole}>{currentUser.role || 'Administrator'}</span>
            </div>
            <div style={styles.avatar}>{getInitials(currentUser.name)}</div>
          </div>
        </header>
        <div style={styles.pageContent}>
          {/* Outlet is used to render nested child routes from App.js */}
          <Outlet /> 
        </div>
      </main>
    </div>
  );
};

const styles = {
  wrapper: { display: 'flex', height: '100vh', backgroundColor: '#F8FAFC' },
  sidebar: { width: '260px', backgroundColor: '#002855', color: 'white', display: 'flex', flexDirection: 'column', padding: '20px' },
  logoSection: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', fontWeight: 'bold' },
  logoIcon: { backgroundColor: 'white', borderRadius: '4px', padding: '5px', fontSize: '18px' },
  logoText: { fontSize: '18px', letterSpacing: '0.5px' },
  navLinks: { display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 },
  link: { color: '#CBD5E1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px', padding: '8px 12px', borderRadius: '6px', transition: 'background-color 0.2s' },
  bottomNav: { borderTop: '1px solid #1E293B', paddingTop: '20px' },
  logoutBtn: { background: 'none', border: 'none', color: '#CBD5E1', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', marginTop: '10px', fontSize: '15px', width: '100%', textAlign: 'left' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' },
  header: { height: '70px', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '1px solid #E2E8F0', flexShrink: 0 },
  breadcrumb: { fontSize: '12px', fontWeight: '700', color: '#64748B', letterSpacing: '1px' },
  adminProfile: { display: 'flex', alignItems: 'center', gap: '12px' },
  profileText: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end' },
  profileName: { fontSize: '14px', color: '#1E293B', fontWeight: '600' },
  profileRole: { fontSize: '11px', color: '#64748B', fontWeight: '500' },
  avatar: { width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#002855', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '14px', fontWeight: '700' },
  pageContent: { padding: '30px' }
};

export default DashboardLayout;