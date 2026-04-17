import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Search, Calendar, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Lectures = () => {
    const navigate = useNavigate();
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    // Replace with your actual Visual Studio Port
    const API_URL = "https://localhost:7057/api/Lectures"; 

    useEffect(() => {
        fetchLectures();
    }, []);

    const fetchLectures = async () => {
        try {
            const response = await axios.get(API_URL);
            setLectures(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching lectures:", error);
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageContainer}>
            {/* Header Section */}
            <div style={styles.header}>
                <p style={styles.overline}>SYSTEM ADMINISTRATOR PORTAL</p>
                <h1 style={styles.title}>Lecture Management</h1>
                <p style={styles.subtitle}>
                    Overview of institutional academic scheduling, User Management and faculty requests for the current semester.
                </p>
            </div>

            {/* Toolbar Section (Search & Actions) */}
            <div style={styles.toolbar}>
                <div style={styles.searchBar}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search records..." style={styles.searchInput} />
                </div>

                <div style={styles.buttonGroup}>
                    <button style={styles.secondaryBtn}>
                        <Calendar size={16} /> View Calendar
                    </button>

                    {/* Add the onClick event here */}
                    <button style={styles.primaryBtn} onClick={() => navigate('/lectures/create')}>
                        <Plus size={16} /> Create Lecture
                    </button>
                </div>
            </div>

            {/* Table Section */}
            <div style={styles.tableContainer}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>LECTURE NAME</th>
                            <th style={styles.th}>LECTURER</th>
                            <th style={styles.th}>TIME</th>
                            <th style={styles.th}>HALL</th>
                            <th style={styles.th}>STATUS</th>
                            <th style={styles.th}>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lectures.map((lecture) => (
                            <tr key={lecture.id} style={styles.tr}>
                                <td style={styles.td}>
                                    <div style={styles.lectureNameText}>{lecture.name}</div>
                                    <div style={styles.lectureSubText}>{lecture.batch?.name || 'N/A'}</div>
                                </td>
                                <td style={styles.td}>{lecture.lecturerName}</td>
                                <td style={styles.td}>
                                    <div>{lecture.startTime} –</div>
                                    <div>{lecture.endTime}</div>
                                </td>
                                <td style={styles.td}>{lecture.hall?.name || 'Unassigned'}</td>
                                <td style={styles.td}>
                                    <span style={getStatusStyle(lecture.status)}>
                                        {lecture.status}
                                    </span>
                                </td>
                                <td style={styles.td}>
                                    <button style={styles.viewLink}>
                                        View <ChevronRight size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div style={styles.paginationContainer}>
                    <span style={styles.pageArrow}>&lt;</span>
                    <span style={styles.activePage}>1</span>
                    <span style={styles.pageNumber}>2</span>
                    <span style={styles.pageNumber}>3</span>
                    <span style={styles.pageDots}>...</span>
                    <span style={styles.pageNumber}>12</span>
                    <span style={styles.pageArrow}>&gt;</span>
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
    );
};

// Logic for Status Colors (Updated to match Figma plain text styling)
const getStatusStyle = (status) => ({
    fontWeight: '700',
    fontSize: '14px',
    color: status === 'Scheduled' ? '#1E293B' : '#9A3412', // Dark for Scheduled, Brown/Orange for Pending
});

const styles = {
    pageContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        paddingBottom: '20px'
    },
    header: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px' 
    },
    overline: { 
        margin: 0, 
        fontSize: '11px', 
        fontWeight: 'bold', 
        color: '#64748B', 
        letterSpacing: '1px',
        textTransform: 'uppercase'
    },
    title: { 
        margin: 0, 
        color: '#002855', 
        fontSize: '32px',
        fontWeight: '800'
    },
    subtitle: { 
        margin: 0, 
        color: '#64748B',
        fontSize: '14px'
    },
    toolbar: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
    },
    searchBar: { 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px', 
        backgroundColor: '#F1F5F9', 
        padding: '10px 16px', 
        borderRadius: '6px', 
        width: '280px' 
    },
    searchInput: { 
        border: 'none', 
        outline: 'none', 
        width: '100%', 
        backgroundColor: 'transparent',
        fontSize: '14px'
    },
    buttonGroup: {
        display: 'flex',
        gap: '12px'
    },
    secondaryBtn: { 
        backgroundColor: '#DBEAFE', 
        color: '#1E40AF', 
        padding: '10px 18px', 
        borderRadius: '6px', 
        border: 'none', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    },
    primaryBtn: { 
        backgroundColor: '#002855', 
        color: 'white', 
        padding: '10px 18px', 
        borderRadius: '6px', 
        border: 'none', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px', 
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '14px'
    },
    tableContainer: { 
        backgroundColor: 'white', 
        borderRadius: '8px', 
        padding: '0', 
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)' 
    },
    table: { 
        width: '100%', 
        borderCollapse: 'collapse' 
    },
    theadRow: { 
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0'
    },
    th: { 
        textAlign: 'left', 
        color: '#64748B', 
        fontSize: '12px', 
        fontWeight: '700',
        padding: '16px 24px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    tr: { 
        borderBottom: '1px solid #F1F5F9' 
    },
    td: {
        padding: '24px',
        fontSize: '14px',
        color: '#334155',
        verticalAlign: 'middle'
    },
    lectureNameText: {
        fontWeight: '700',
        color: '#1E293B',
        fontSize: '15px',
        marginBottom: '4px'
    },
    lectureSubText: {
        color: '#94A3B8',
        fontSize: '13px'
    },
    viewLink: { 
        background: 'none', 
        border: 'none', 
        color: '#002855', 
        cursor: 'pointer', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '2px', 
        fontWeight: '700',
        fontSize: '14px',
        padding: 0
    },
    paginationContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '20px 24px',
        gap: '12px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#64748B'
    },
    pageArrow: {
        cursor: 'pointer',
        padding: '4px 8px'
    },
    pageNumber: {
        cursor: 'pointer',
        padding: '4px 8px'
    },
    activePage: {
        backgroundColor: '#002855',
        color: 'white',
        padding: '6px 12px',
        borderRadius: '4px',
        cursor: 'default'
    },
    pageDots: {
        padding: '4px'
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '40px',
        padding: '20px 0',
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

export default Lectures;