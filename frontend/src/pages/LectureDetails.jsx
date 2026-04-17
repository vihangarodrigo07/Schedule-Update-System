import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
    ArrowLeft, FileText, Calendar, Clock, MapPin, 
    Users, User, CalendarDays, Edit, XCircle, Zap 
} from 'lucide-react';

const LectureDetails = () => {
    const navigate = useNavigate();
    // In the future, you will use this ID to fetch the specific lecture from your API
    const { id } = useParams(); 

    return (
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.headerLeft}>
                    <button style={styles.backButton} onClick={() => navigate('/lectures')}>
                        <ArrowLeft size={20} color="#1E293B" />
                    </button>
                    <h1 style={styles.title}>Advanced Web Technologies</h1>
                </div>
                <div style={styles.statusBadge}>SCHEDULED</div>
            </div>

            <div style={styles.contentGrid}>
                {/* Left Column (Main Info) */}
                <div style={styles.mainColumn}>
                    
                    {/* Overview Card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <FileText size={20} color="#64748B" />
                            <h2 style={styles.cardTitle}>Lecture Overview</h2>
                        </div>
                        <p style={styles.description}>
                            Introduces modern web technologies including REST APIs and frontend frameworks. 
                            This course deep dives into scalable architecture, state management in React, 
                            and the evolution of the modern web stack.
                        </p>
                        
                        <div style={styles.infoGrid}>
                            <div style={styles.infoBox}>
                                <div style={styles.iconWrapper}><Calendar size={18} color="#002855" /></div>
                                <div>
                                    <div style={styles.infoLabel}>DATE</div>
                                    <div style={styles.infoValue}>March 12, 2026</div>
                                </div>
                            </div>
                            <div style={styles.infoBox}>
                                <div style={styles.iconWrapper}><Clock size={18} color="#002855" /></div>
                                <div>
                                    <div style={styles.infoLabel}>TIME</div>
                                    <div style={styles.infoValue}>09:00 – 11:00</div>
                                </div>
                            </div>
                            <div style={styles.infoBox}>
                                <div style={styles.iconWrapper}><MapPin size={18} color="#002855" /></div>
                                <div>
                                    <div style={styles.infoLabel}>LOCATION</div>
                                    <div style={styles.infoValue}>Lecture Hall B2</div>
                                </div>
                            </div>
                            <div style={styles.infoBox}>
                                <div style={styles.iconWrapper}><Users size={18} color="#002855" /></div>
                                <div>
                                    <div style={styles.infoLabel}>CAPACITY</div>
                                    <div style={styles.infoValue}>120 Seats (Full)</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lead Faculty Card */}
                    <div style={styles.card}>
                        <div style={styles.cardHeader}>
                            <User size={20} color="#64748B" />
                            <h2 style={styles.cardTitle}>Lead Faculty</h2>
                        </div>
                        <div style={styles.facultyProfile}>
                            <div style={styles.avatarPlaceholder}></div>
                            <div style={styles.facultyInfo}>
                                <h3 style={styles.facultyName}>Dr. Alistair Thorne</h3>
                                <p style={styles.facultyTitle}>Senior Professor of Computer Science</p>
                                <div style={styles.facultyActions}>
                                    <button style={styles.profileBtn}>View Profile</button>
                                    <button style={styles.contactBtn}>Contact</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Right Column (Sidebar Actions) */}
                <div style={styles.sidebar}>
                    <div style={styles.actionCard}>
                        <div style={styles.actionHeader}>
                            <Zap size={20} color="#CBD5E1" />
                            <h3 style={styles.actionTitle}>Administrative Actions</h3>
                        </div>
                        
                        <div style={styles.actionButtons}>
                            <button style={styles.actionBtnWhite}>
                                <CalendarDays size={18} /> View in Calendar
                            </button>
                            <button style={styles.actionBtnBlue}>
                                <Edit size={18} /> Edit Lecture
                            </button>
                            <button style={styles.actionBtnRed}>
                                <XCircle size={18} /> Cancel Lecture
                            </button>
                        </div>

                        <button style={styles.closeDetailsBtn} onClick={() => navigate('/lectures')}>
                            Close Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '10px 0 40px 0',
        maxWidth: '1100px',
        margin: '0 auto',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
    },
    headerLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    backButton: {
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: '#F1F5F9',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
    },
    title: {
        margin: 0,
        fontSize: '28px',
        color: '#002855',
        fontWeight: '800'
    },
    statusBadge: {
        backgroundColor: 'white',
        border: '1px solid #E2E8F0',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: '0.5px'
    },
    contentGrid: {
        display: 'flex',
        gap: '24px',
        alignItems: 'flex-start'
    },
    mainColumn: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    card: {
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '20px'
    },
    cardTitle: {
        margin: 0,
        fontSize: '18px',
        color: '#002855',
        fontWeight: '700'
    },
    description: {
        color: '#475569',
        lineHeight: '1.6',
        fontSize: '15px',
        marginBottom: '30px'
    },
    infoGrid: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '16px'
    },
    infoBox: {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
    },
    iconWrapper: {
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    },
    infoLabel: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#842029', // Slight dark red/brown tint from figma
        marginBottom: '4px',
        letterSpacing: '0.5px'
    },
    infoValue: {
        fontSize: '15px',
        fontWeight: '700',
        color: '#002855'
    },
    facultyProfile: {
        display: 'flex',
        gap: '20px',
        alignItems: 'center'
    },
    avatarPlaceholder: {
        width: '80px',
        height: '80px',
        borderRadius: '16px',
        backgroundColor: '#1E293B', // Placeholder for the actual image
        backgroundImage: 'url("https://via.placeholder.com/80")', // Remove/Replace in production
        backgroundSize: 'cover'
    },
    facultyInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    facultyName: {
        margin: 0,
        fontSize: '18px',
        color: '#002855',
        fontWeight: '700'
    },
    facultyTitle: {
        margin: 0,
        color: '#64748B',
        fontSize: '14px',
        marginBottom: '8px'
    },
    facultyActions: {
        display: 'flex',
        gap: '10px'
    },
    profileBtn: {
        backgroundColor: '#DBEAFE',
        color: '#1E40AF',
        border: 'none',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer'
    },
    contactBtn: {
        backgroundColor: 'white',
        border: '1px solid #CBD5E1',
        color: '#475569',
        padding: '8px 16px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '13px',
        cursor: 'pointer'
    },
    sidebar: {
        width: '320px',
        flexShrink: 0
    },
    actionCard: {
        backgroundColor: '#071A2F', // Deep navy matching the figma
        borderRadius: '16px',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px'
    },
    actionHeader: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px'
    },
    actionTitle: {
        margin: 0,
        color: 'white',
        fontSize: '18px',
        fontWeight: '600',
        lineHeight: '1.3'
    },
    actionButtons: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    },
    actionBtnWhite: {
        backgroundColor: 'white',
        color: '#0F172A',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    actionBtnBlue: {
        backgroundColor: '#0E2E5A',
        color: '#93C5FD',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    actionBtnRed: {
        backgroundColor: '#FFE4E6',
        color: '#BE123C',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontWeight: '600',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    closeDetailsBtn: {
        background: 'none',
        border: 'none',
        color: '#94A3B8',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '10px 0',
        marginTop: '10px'
    }
};

export default LectureDetails;