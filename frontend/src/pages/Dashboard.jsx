import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Calendar, Plus } from 'lucide-react';

const Dashboard = () => {
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for endpoints that don't exist yet in your backend
    const [stats, setStats] = useState({
        pendingRequests: 12,
        cancellationRequests: 4,
        totalUsers: 5000
    });

    const mockRequests = [
        { id: 1, type: 'creation', title: 'New Lecture Creation: Advanced Web Technologies', lecturer: 'Prof. Sarah Jenkins', date: 'March 12, 2026 (10:00 - 12:00)', requested: 'Requested 2h ago' },
        { id: 2, type: 'cancellation', title: 'Lecture Cancellation: Database Systems & Design', lecturer: 'Dr. Alan Turing', date: 'Scheduled Date: March 18, 2026', requested: 'Requested 5h ago' },
        { id: 3, type: 'creation', title: 'New Lecture Creation: Computer Networks', lecturer: 'Prof. Elena Rossi', date: 'March 20, 2026 (10:00 - 12:00)', requested: 'Requested Yesterday' },
    ];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get('http://localhost:5057/api/Lectures');
                setLectures(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching lectures:", error);
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // Filter lectures for "Upcoming Today"
    const getTodayLectures = () => {
        const today = new Date();
        return lectures.filter(lecture => {
            if (!lecture.date) return false;
            const lectureDate = new Date(lecture.date);
            return lectureDate.getDate() === today.getDate() &&
                   lectureDate.getMonth() === today.getMonth() &&
                   lectureDate.getFullYear() === today.getFullYear() &&
                   lecture.status !== 'Canceled';
        }).slice(0, 3); // Grab up to 3 for the sidebar
    };

    const todayLectures = getTodayLectures();

    if (loading) {
        return <div style={{...styles.pageContainer, textAlign: 'center', paddingTop: '100px'}}>Loading dashboard...</div>;
    }

    return (
        <div style={styles.pageContainer}>
            <div style={styles.contentArea}>
                
                {/* Header Section */}
                <div style={styles.header}>
                    <p style={styles.overline}>SYSTEM ADMINISTRATOR PORTAL</p>
                    <h1 style={styles.title}>Welcome back, Administrator</h1>
                    <p style={styles.subtitle}>
                        Overview of institutional academic scheduling, User Management and faculty requests for the current semester.
                    </p>
                </div>

                {/* Stats Row */}
                <div style={styles.statsGrid}>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Lectures</div>
                        <div style={styles.statValue}>{lectures.length.toLocaleString()}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Pending Requests</div>
                        <div style={styles.statValue}>{stats.pendingRequests}</div>
                    </div>
                    <div style={{...styles.statCard, ...styles.statCardRed}}>
                        <div style={styles.statLabel}>Cancellation Requests</div>
                        <div style={{...styles.statValue, color: '#DC2626'}}>{stats.cancellationRequests.toString().padStart(2, '0')}</div>
                    </div>
                    <div style={styles.statCard}>
                        <div style={styles.statLabel}>Total Users</div>
                        <div style={styles.statValue}>{stats.totalUsers.toLocaleString()}</div>
                    </div>
                </div>

                {/* Main Layout: Left Column & Right Sidebar */}
                <div style={styles.mainLayout}>
                    
                    {/* Left Column */}
                    <div style={styles.leftColumn}>
                        
                        {/* Quick Actions */}
                        <div style={styles.quickActionsGrid}>
                            <div style={styles.actionCardPrimary}>
                                <PlusCircle size={28} color="white" style={{marginBottom: '16px'}} />
                                <h2 style={styles.actionCardTitleWhite}>Create Lecture</h2>
                                <p style={styles.actionCardDescWhite}>
                                    Schedule new ICT lectures based on approved requests from lecturers.
                                </p>
                                <button style={styles.btnWhite} onClick={() => navigate('/lectures/create')}>
                                    Schedule Now
                                </button>
                            </div>
                            
                            <div style={styles.actionCardSecondary}>
                                <Calendar size={28} color="#002855" style={{marginBottom: '16px'}} />
                                <h2 style={styles.actionCardTitleDark}>Manage Lectures</h2>
                                <p style={styles.actionCardDescDark}>
                                    Review, modify, or cancel ICT lecture schedules including hall and batch assignments.
                                </p>
                                <button style={styles.btnDark} onClick={() => navigate('/lectures')}>
                                    View Schedule
                                </button>
                            </div>
                        </div>

                        {/* Requests Section */}
                        <div style={styles.requestsHeader}>
                            <h2 style={styles.sectionTitle}>Lecturer Requests & Confirmations</h2>
                            <button style={styles.viewAllBtn}>View all history</button>
                        </div>

                        <div style={styles.requestsList}>
                            {mockRequests.map(req => (
                                <div key={req.id} style={styles.requestItem}>
                                    <div style={{
                                        ...styles.requestIcon, 
                                        backgroundColor: req.type === 'creation' ? '#DBEAFE' : '#FEE2E2'
                                    }}></div>
                                    <div style={styles.requestDetails}>
                                        <div style={styles.requestTitle}>{req.title}</div>
                                        <div style={styles.requestMeta}>
                                            <span>{req.lecturer}</span> <span style={styles.metaDivider}>|</span> 
                                            <span>{req.date}</span> <span style={styles.metaDivider}>|</span> 
                                            <span>{req.requested}</span>
                                        </div>
                                    </div>
                                    <div style={styles.requestActions}>
                                        <button style={styles.rejectBtn}>Reject</button>
                                        <button style={styles.approveBtn}>Approve</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>

                    {/* Right Sidebar */}
                    <div style={styles.sidebar}>
                        
                        {/* Upcoming Today */}
                        <div style={styles.upcomingCard}>
                            <h2 style={styles.sectionTitle}>Upcoming Today</h2>
                            
                            <div style={styles.upcomingList}>
                                {todayLectures.length > 0 ? todayLectures.map(lecture => (
                                    <div key={lecture.id} style={styles.upcomingItem}>
                                        <div style={styles.upcomingHeader}>
                                            <span style={styles.timeBadge}>{lecture.startTime} - {lecture.endTime}</span>
                                            <span style={styles.hallBadge}>{lecture.hall?.name || 'TBA'}</span>
                                        </div>
                                        <div style={styles.upcomingTitle}>{lecture.name}</div>
                                        <div style={styles.upcomingLecturer}>
                                            <span style={styles.lecturerIcon}>👤</span> {lecture.lecturerName}
                                        </div>
                                    </div>
                                )) : (
                                    <p style={styles.noLecturesText}>No lectures scheduled for today.</p>
                                )}
                            </div>

                            <button style={styles.viewFullCalendarBtn} onClick={() => navigate('/calendar')}>
                                View Full Calendar
                            </button>
                        </div>

                        {/* Add User Card */}
                        <div style={styles.addUserCard}>
                            <h2 style={styles.addUserTitle}>Add New User</h2>
                            <button style={styles.addUserBtn}>
                                <Plus size={16} /> Add User
                            </button>
                        </div>

                    </div>
                </div>

                {/* Footer Section */}
                <div style={styles.footer}>
                    <div style={styles.copyright}>© 2024 Academic Central University. All Rights Reserved.</div>
                    <div style={styles.footerLinks}>
                        <span style={styles.footerLink}>Institutional Privacy</span>
                        <span style={styles.footerLink}>Accessibility Services</span>
                        <span style={styles.footerLink}>Faculty Handbook</span>
                        <span style={styles.footerLink}>Technical Support</span>
                    </div>
                </div>

            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: '#F8FAFC',
        minHeight: '100vh',
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    contentArea: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    header: {
        marginBottom: '32px'
    },
    overline: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        margin: '0 0 8px 0'
    },
    title: {
        margin: '0 0 12px 0',
        color: '#002855',
        fontSize: '36px',
        fontWeight: '800',
    },
    subtitle: {
        margin: 0,
        color: '#64748B',
        fontSize: '15px',
        maxWidth: '600px',
        lineHeight: '1.5'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '24px',
        marginBottom: '40px'
    },
    statCard: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    statCardRed: {
        borderLeft: '4px solid #EF4444'
    },
    statLabel: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748B',
        marginBottom: '8px'
    },
    statValue: {
        fontSize: '32px',
        fontWeight: '800',
        color: '#0F172A'
    },
    mainLayout: {
        display: 'flex',
        gap: '32px',
        alignItems: 'flex-start'
    },
    leftColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '40px'
    },
    quickActionsGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    actionCardPrimary: {
        backgroundColor: '#002855',
        borderRadius: '12px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    actionCardSecondary: {
        backgroundColor: '#E2E8F0',
        borderRadius: '12px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    actionCardTitleWhite: {
        color: 'white',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 12px 0'
    },
    actionCardDescWhite: {
        color: '#93C5FD',
        fontSize: '14px',
        lineHeight: '1.5',
        margin: '0 0 24px 0',
        flex: 1
    },
    btnWhite: {
        backgroundColor: 'white',
        color: '#002855',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer'
    },
    actionCardTitleDark: {
        color: '#002855',
        fontSize: '22px',
        fontWeight: '700',
        margin: '0 0 12px 0'
    },
    actionCardDescDark: {
        color: '#475569',
        fontSize: '14px',
        lineHeight: '1.5',
        margin: '0 0 24px 0',
        flex: 1
    },
    btnDark: {
        backgroundColor: '#002855',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer'
    },
    requestsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '16px'
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '800',
        color: '#002855',
        margin: 0
    },
    viewAllBtn: {
        background: 'none',
        border: 'none',
        color: '#002855',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        padding: 0
    },
    requestsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    requestItem: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    requestIcon: {
        width: '40px',
        height: '40px',
        borderRadius: '6px',
        flexShrink: 0
    },
    requestDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    },
    requestTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#1E293B'
    },
    requestMeta: {
        fontSize: '13px',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    metaDivider: {
        color: '#CBD5E1'
    },
    requestActions: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        flexShrink: 0
    },
    rejectBtn: {
        background: 'none',
        border: 'none',
        color: '#DC2626',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        padding: 0
    },
    approveBtn: {
        backgroundColor: '#002855',
        color: 'white',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '14px',
        cursor: 'pointer'
    },
    sidebar: {
        width: '380px',
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    upcomingCard: {
        backgroundColor: '#F1F5F9', // Matches Figma's slightly darker right column bg
        borderRadius: '12px',
        padding: '24px',
    },
    upcomingList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '20px',
        marginBottom: '20px'
    },
    upcomingItem: {
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    },
    upcomingHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px'
    },
    timeBadge: {
        backgroundColor: '#002855',
        color: 'white',
        fontSize: '10px',
        fontWeight: '700',
        padding: '4px 8px',
        borderRadius: '4px'
    },
    hallBadge: {
        backgroundColor: '#E2E8F0',
        color: '#475569',
        fontSize: '10px',
        fontWeight: '700',
        padding: '4px 8px',
        borderRadius: '4px'
    },
    upcomingTitle: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: '8px'
    },
    upcomingLecturer: {
        fontSize: '13px',
        color: '#64748B',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
    },
    lecturerIcon: {
        fontSize: '12px'
    },
    noLecturesText: {
        color: '#64748B',
        fontSize: '14px',
        fontStyle: 'italic'
    },
    viewFullCalendarBtn: {
        width: '100%',
        backgroundColor: '#E2E8F0',
        color: '#0F172A',
        border: 'none',
        padding: '14px',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer'
    },
    addUserCard: {
        backgroundColor: '#002855',
        borderRadius: '12px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    addUserTitle: {
        color: 'white',
        fontSize: '24px',
        fontWeight: '700',
        margin: '0 0 20px 0'
    },
    addUserBtn: {
        backgroundColor: 'white',
        color: '#002855',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '60px',
        padding: '30px 0',
        borderTop: '1px solid #E2E8F0',
        fontSize: '13px',
        color: '#94A3B8'
    },
    copyright: {
        fontWeight: '500'
    },
    footerLinks: {
        display: 'flex',
        gap: '24px'
    },
    footerLink: {
        cursor: 'pointer',
        fontWeight: '500'
    }
};

export default Dashboard;