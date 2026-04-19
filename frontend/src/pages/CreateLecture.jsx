import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateLecture = () => {
    const navigate = useNavigate();
    
    // Form state wired to match your backend Lecture model
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        lecturerName: '',
        batchId: '',
        hallId: '',
        date: '',
        startTime: '',
        endTime: ''
    });

    // Dynamic Lists from Database
    const [batches, setBatches] = useState([]);
    const [halls, setHalls] = useState([]);

    // Modal Visibility States
    const [showBatchModal, setShowBatchModal] = useState(false);
    const [showHallModal, setShowHallModal] = useState(false);

    // Modal Form States
    const [newBatch, setNewBatch] = useState({ name: '', program: '', students: '' });
    const [newHall, setNewHall] = useState({ name: '', capacity: '', building: '' });

    // Fetch Batches and Halls on component mount
    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const batchRes = await axios.get("http://localhost:5057/api/Batches");
            const hallRes = await axios.get("http://localhost:5057/api/Halls");
            setBatches(batchRes.data);
            setHalls(hallRes.data);
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                batchId: formData.batchId ? parseInt(formData.batchId) : 0,
                hallId: formData.hallId ? parseInt(formData.hallId) : 0
            };
            await axios.post("http://localhost:5057/api/Lectures", payload);
            navigate('/lectures');
        } catch (error) {
            console.error("Error saving lecture:", error);
            alert("Failed to save the lecture. Check the console for details.");
        }
    };

    // --- Modal Submit Handlers ---
    const handleRegisterBatch = async () => {
        try {
            // Sending only 'name' as per current Models.cs definition
            await axios.post("http://localhost:5057/api/Batches", { name: newBatch.name });
            setShowBatchModal(false);
            setNewBatch({ name: '', program: '', students: '' }); // Reset
            fetchDropdownData(); // Refresh the dropdown
        } catch (error) {
            console.error("Error adding batch:", error);
        }
    };

    const handleRegisterHall = async () => {
        try {
             // Sending only 'name' as per current Models.cs definition
            await axios.post("http://localhost:5057/api/Halls", { name: newHall.name });
            setShowHallModal(false);
            setNewHall({ name: '', capacity: '', building: '' }); // Reset
            fetchDropdownData(); // Refresh the dropdown
        } catch (error) {
            console.error("Error adding hall:", error);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.topBar}></div>
            
            <div style={styles.formContent}>
                {/* Section 1: Course Information */}
                <div style={styles.sectionRow}>
                    <div style={styles.sectionText}>
                        <h3 style={styles.sectionTitle}>Course Information</h3>
                        <p style={styles.sectionSubtitle}>Specify the primary identifiers for this lecture session.</p>
                    </div>
                    
                    <div style={styles.sectionFields}>
                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURE NAME</label>
                            <input 
                                type="text" name="name"
                                placeholder="e.g. Advanced Web Technologies" 
                                style={styles.input} 
                                value={formData.name} onChange={handleChange}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURE DESCRIPTION</label>
                            <input 
                                type="text" name="description"
                                placeholder="Lecture Description" 
                                style={styles.input} 
                                value={formData.description} onChange={handleChange}
                            />
                            <span style={styles.helperText}>Use formal university course nomenclature.</span>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURER SELECTION</label>
                            <select 
                                name="lecturerName" 
                                style={{...styles.input, ...styles.select}}
                                value={formData.lecturerName} onChange={handleChange}
                            >
                                <option value="" disabled>Select Lecturer</option>
                                <option value="Dr. Alistair Thorne">Dr. Alistair Thorne</option>
                                <option value="Dr. Elena Ross">Dr. Elena Ross</option>
                                <option value="Prof. Sarah Jenkins">Prof. Sarah Jenkins</option>
                            </select>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>STUDENT BATCH</label>
                            <div style={styles.inputWithCustomBtn}>
                                <select 
                                    name="batchId" 
                                    style={{...styles.input, ...styles.select, flex: 1}}
                                    value={formData.batchId} onChange={handleChange}
                                >
                                    <option value="" disabled>Select Student Batch</option>
                                    {batches.map(b => (
                                        <option key={b.id} value={b.id}>{b.name}</option>
                                    ))}
                                </select>
                                <button type="button" style={styles.customBtn} onClick={() => setShowBatchModal(true)}>
                                    <PlusCircle size={16} />
                                    <span>CUSTOM</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Timing & Venue */}
                <div style={styles.sectionRow}>
                    <div style={styles.sectionText}>
                        <h3 style={styles.sectionTitle}>Timing & Venue</h3>
                        <p style={styles.sectionSubtitle}>Define the temporal and spatial coordinates of the session.</p>
                    </div>
                    
                    <div style={styles.sectionFields}>
                        <div style={styles.multiColumnFields}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>DATE</label>
                                <input 
                                    type="date" name="date"
                                    style={{...styles.input, color: formData.date ? '#002855' : '#64748B'}} 
                                    value={formData.date} onChange={handleChange}
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>START TIME</label>
                                <input 
                                    type="time" name="startTime"
                                    style={{...styles.input, color: formData.startTime ? '#002855' : '#64748B'}} 
                                    value={formData.startTime} onChange={handleChange}
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>END TIME</label>
                                <input 
                                    type="time" name="endTime"
                                    style={{...styles.input, color: formData.endTime ? '#002855' : '#64748B'}} 
                                    value={formData.endTime} onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURE HALL</label>
                            <div style={styles.inputWithCustomBtn}>
                                <select 
                                    name="hallId" 
                                    style={{...styles.input, ...styles.select, flex: 1}}
                                    value={formData.hallId} onChange={handleChange}
                                >
                                    <option value="" disabled>Select Lecture Hall</option>
                                    {halls.map(h => (
                                        <option key={h.id} value={h.id}>{h.name}</option>
                                    ))}
                                </select>
                                <button type="button" style={styles.customBtn} onClick={() => setShowHallModal(true)}>
                                    <PlusCircle size={16} />
                                    <span>CUSTOM</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div style={styles.footer}>
                <button style={styles.cancelBtn} onClick={() => navigate('/lectures')}>
                    Cancel
                </button>
                <div style={styles.actionButtons}>
                    <button style={styles.primaryBtn} onClick={handleSubmit}>
                        <CheckCircle size={16} /> Sent for Approvals
                    </button>
                    <button style={styles.primaryBtn} onClick={handleSubmit}>
                        <CheckCircle size={16} /> Add
                    </button>
                </div>
            </div>

            {/* --- ADD NEW BATCH MODAL --- */}
            {showBatchModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.batchModalCard}>
                        <div style={styles.batchModalHeader}>
                            <h2 style={styles.batchModalTitle}>Add New Batch</h2>
                            <button style={styles.iconBtn} onClick={() => setShowBatchModal(false)}><X size={24} color="#002855" /></button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>BATCH NAME</label>
                                <input 
                                    type="text" placeholder="e.g. B.Tech Computer Science 2024" style={styles.input}
                                    value={newBatch.name} onChange={(e) => setNewBatch({...newBatch, name: e.target.value})}
                                />
                                <span style={styles.helperText}>Use the standard naming convention for archival records.</span>
                            </div>
                            
                            <div style={styles.modalTwoCol}>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>ACADEMIC PROGRAM</label>
                                    <select 
                                        style={{...styles.input, ...styles.select}}
                                        value={newBatch.program} onChange={(e) => setNewBatch({...newBatch, program: e.target.value})}
                                    >
                                        <option value="" disabled>Select Program</option>
                                        <option value="B.Tech">B.Tech</option>
                                        <option value="B.Sc">B.Sc</option>
                                    </select>
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>TOTAL STUDENTS</label>
                                    <input 
                                        type="number" placeholder="00" style={styles.input}
                                        value={newBatch.students} onChange={(e) => setNewBatch({...newBatch, students: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={styles.batchModalFooter}>
                            <button style={styles.modalCancelText} onClick={() => setShowBatchModal(false)}>Cancel</button>
                            <button style={styles.modalRegisterDarkBtn} onClick={handleRegisterBatch}>Register Batch</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- ADD NEW HALL MODAL --- */}
            {showHallModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.hallModalCard}>
                        <div style={styles.hallModalHeader}>
                            <h2 style={styles.hallModalTitle}>Add New Hall</h2>
                            <button style={styles.iconBtn} onClick={() => setShowHallModal(false)}><X size={24} color="white" /></button>
                        </div>
                        
                        <div style={styles.modalBody}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>HALL NAME</label>
                                <input 
                                    type="text" placeholder="e.g. Einstein Seminar Room" style={styles.inputWhite}
                                    value={newHall.name} onChange={(e) => setNewHall({...newHall, name: e.target.value})}
                                />
                            </div>
                            
                            <div style={styles.modalTwoCol}>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>CAPACITY (SEATS)</label>
                                    <input 
                                        type="number" placeholder="45" style={styles.inputWhite}
                                        value={newHall.capacity} onChange={(e) => setNewHall({...newHall, capacity: e.target.value})}
                                    />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>BUILDING/CAMPUS</label>
                                    <input 
                                        type="text" placeholder="West Wing" style={styles.inputWhite}
                                        value={newHall.building} onChange={(e) => setNewHall({...newHall, building: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={styles.hallModalFooter}>
                            <button style={styles.modalRegisterDarkBtn} onClick={handleRegisterHall}>Register Hall</button>
                            <button style={styles.modalCancelGrayBtn} onClick={() => setShowHallModal(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


const styles = {
    container: {
        backgroundColor: '#F8FAFC',
        borderRadius: '12px',
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    topBar: {
        height: '6px',
        backgroundColor: '#002855',
        width: '100%'
    },
    formContent: {
        padding: '40px'
    },
    sectionRow: {
        display: 'flex',
        gap: '40px',
        marginBottom: '50px'
    },
    sectionText: {
        flex: '0 0 250px'
    },
    sectionTitle: {
        margin: '0 0 8px 0',
        color: '#002855',
        fontSize: '20px',
        fontWeight: '500'
    },
    sectionSubtitle: {
        margin: 0,
        color: '#64748B',
        fontSize: '14px',
        lineHeight: '1.5'
    },
    sectionFields: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    fieldGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#475569',
        letterSpacing: '0.5px',
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: '#E2E8F0',
        border: 'none',
        borderRadius: '6px',
        padding: '14px 16px',
        fontSize: '15px',
        color: '#0F172A',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    },
    inputWhite: { // Used in Hall Modal
        backgroundColor: '#F8FAFC',
        border: 'none',
        borderRadius: '6px',
        padding: '14px 16px',
        fontSize: '15px',
        color: '#0F172A',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    },
    select: {
        cursor: 'pointer',
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 16px top 50%',
        backgroundSize: '12px auto'
    },
    helperText: {
        fontSize: '12px',
        color: '#64748B'
    },
    inputWithCustomBtn: {
        display: 'flex',
        gap: '12px'
    },
    customBtn: {
        backgroundColor: '#E2E8F0',
        border: '1px dashed #94A3B8',
        borderRadius: '6px',
        padding: '0 20px',
        color: '#64748B',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        cursor: 'pointer',
        fontSize: '10px',
        fontWeight: '700',
        minWidth: '90px'
    },
    multiColumnFields: {
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gap: '16px'
    },
    footer: {
        borderTop: '1px solid #E2E8F0',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cancelBtn: {
        background: 'none',
        border: 'none',
        color: '#475569',
        fontSize: '15px',
        cursor: 'pointer',
        padding: '0'
    },
    actionButtons: {
        display: 'flex',
        gap: '16px'
    },
    primaryBtn: {
        backgroundColor: '#002855',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        padding: '12px 24px',
        fontSize: '14px',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    
    // --- MODAL STYLES ---
    modalOverlay: {
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        padding: 0
    },
    modalBody: {
        padding: '32px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
    },
    modalTwoCol: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px'
    },
    modalRegisterDarkBtn: {
        backgroundColor: '#002855',
        color: 'white',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer'
    },

    // Specific Batch Modal Styles
    batchModalCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '500px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    batchModalHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 40px 0 40px'
    },
    batchModalTitle: {
        margin: 0,
        fontSize: '28px',
        fontWeight: '800',
        color: '#002855'
    },
    batchModalFooter: {
        backgroundColor: '#F1F5F9',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '24px'
    },
    modalCancelText: {
        background: 'none',
        border: 'none',
        color: '#475569',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer'
    },

    // Specific Hall Modal Styles
    hallModalCard: {
        backgroundColor: 'white',
        borderRadius: '12px',
        width: '500px',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    hallModalHeader: {
        backgroundColor: '#002855',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 40px'
    },
    hallModalTitle: {
        margin: 0,
        fontSize: '20px',
        fontWeight: '600',
        color: 'white'
    },
    hallModalFooter: {
        backgroundColor: 'white',
        padding: '24px 40px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '16px'
    },
    modalCancelGrayBtn: {
        backgroundColor: '#E2E8F0',
        color: '#475569',
        border: 'none',
        padding: '12px 32px',
        borderRadius: '6px',
        fontWeight: '600',
        fontSize: '15px',
        cursor: 'pointer'
    }
};

export default CreateLecture;