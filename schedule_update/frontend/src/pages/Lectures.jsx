import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Eye, Search } from 'lucide-react';

const Lectures = () => {
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
        <div>
            <div style={styles.header}>
                <div>
                    <h2 style={styles.title}>Lecture Management</h2>
                    <p style={styles.subtitle}>Overview of institutional academic scheduling...</p>
                </div>
                <button style={styles.createBtn}>
                    <Plus size={18} /> Create Lecture
                </button>
            </div>

            <div style={styles.tableContainer}>
                <div style={styles.searchBar}>
                    <Search size={18} color="#94A3B8" />
                    <input type="text" placeholder="Search records..." style={styles.searchInput} />
                </div>

                <table style={styles.table}>
                    <thead>
                        <tr style={styles.thead}>
                            <th>LECTURE NAME</th>
                            <th>LECTURER</th>
                            <th>TIME</th>
                            <th>HALL</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lectures.map((lecture) => (
                            <tr key={lecture.id} style={styles.tr}>
                                <td>
                                    <strong>{lecture.name}</strong><br/>
                                    <small style={{color: '#94A3B8'}}>{lecture.batch?.name || 'N/A'}</small>
                                </td>
                                <td>{lecture.lecturerName}</td>
                                <td>{lecture.startTime} - {lecture.endTime}</td>
                                <td>{lecture.hall?.name || 'Unassigned'}</td>
                                <td>
                                    <span style={getStatusStyle(lecture.status)}>
                                        {lecture.status}
                                    </span>
                                </td>
                                <td>
                                    <button style={styles.viewLink}>View <Eye size={14}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Logic for Status Colors
const getStatusStyle = (status) => ({
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    backgroundColor: status === 'Scheduled' ? '#ECFDF5' : '#FFF7ED',
    color: status === 'Scheduled' ? '#059669' : '#D97706',
});

const styles = {
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' },
    title: { margin: 0, color: '#002855' },
    subtitle: { margin: 0, color: '#64748B' },
    createBtn: { backgroundColor: '#002855', color: 'white', padding: '10px 20px', borderRadius: '6px', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    tableContainer: { backgroundColor: 'white', borderRadius: '8px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
    searchBar: { display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid #E2E8F0', padding: '8px 15px', borderRadius: '6px', width: '300px', marginBottom: '20px' },
    searchInput: { border: 'none', outline: 'none', width: '100%' },
    table: { width: '100%', borderCollapse: 'collapse' },
    thead: { textAlign: 'left', color: '#64748B', fontSize: '12px', borderBottom: '1px solid #E2E8F0' },
    tr: { borderBottom: '1px solid #F1F5F9' },
    viewLink: { background: 'none', border: 'none', color: '#002855', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }
};

export default Lectures;