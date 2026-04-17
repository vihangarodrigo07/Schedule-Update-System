import React, { useState } from 'react';
import { PlusCircle, CheckCircle } from 'lucide-react';
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

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // The function that sends data to your SQLite database via the .NET API
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevents default form submission behavior

        try {
            // Convert string IDs from the select dropdowns to integers for the C# backend
            const payload = {
                ...formData,
                batchId: formData.batchId ? parseInt(formData.batchId) : 0,
                hallId: formData.hallId ? parseInt(formData.hallId) : 0
            };

            // Replace with your actual Visual Studio Port
            const API_URL = "https://localhost:7057/api/Lectures"; 

            await axios.post(API_URL, payload);
            
            // If successful, navigate back to the lectures list where it will fetch the new data
            navigate('/lectures');
        } catch (error) {
            console.error("Error saving lecture:", error);
            alert("Failed to save the lecture. Check the console for details.");
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
                                type="text" 
                                name="name"
                                placeholder="e.g. Advanced Web Technologies" 
                                style={styles.input} 
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURE DESCRIPTION</label>
                            <input 
                                type="text" 
                                name="description"
                                placeholder="Lecture Description" 
                                style={styles.input} 
                                value={formData.description}
                                onChange={handleChange}
                            />
                            <span style={styles.helperText}>Use formal university course nomenclature.</span>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURER SELECTION</label>
                            <select 
                                name="lecturerName" 
                                style={{...styles.input, ...styles.select}}
                                value={formData.lecturerName}
                                onChange={handleChange}
                            >
                                <option value="" disabled>Select Lecturer</option>
                                <option value="Dr. Alistair Thorne">Dr. Alistair Thorne</option>
                                <option value="Dr. Elena Ross">Dr. Elena Ross</option>
                            </select>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>STUDENT BATCH</label>
                            <div style={styles.inputWithCustomBtn}>
                                <select 
                                    name="batchId" 
                                    style={{...styles.input, ...styles.select, flex: 1}}
                                    value={formData.batchId}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Student Batch</option>
                                    <option value="1">CS-402 • Undergraduate</option>
                                </select>
                                <button type="button" style={styles.customBtn}>
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
                                    type="date" 
                                    name="date"
                                    style={{...styles.input, color: formData.date ? '#002855' : '#64748B'}} 
                                    value={formData.date}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>START TIME</label>
                                <input 
                                    type="time" 
                                    name="startTime"
                                    style={{...styles.input, color: formData.startTime ? '#002855' : '#64748B'}} 
                                    value={formData.startTime}
                                    onChange={handleChange}
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>END TIME</label>
                                <input 
                                    type="time" 
                                    name="endTime"
                                    style={{...styles.input, color: formData.endTime ? '#002855' : '#64748B'}} 
                                    value={formData.endTime}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div style={styles.fieldGroup}>
                            <label style={styles.label}>LECTURE HALL</label>
                            <div style={styles.inputWithCustomBtn}>
                                <select 
                                    name="hallId" 
                                    style={{...styles.input, ...styles.select, flex: 1}}
                                    value={formData.hallId}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select Lecture Hall</option>
                                    <option value="1">Hall B2</option>
                                </select>
                                <button type="button" style={styles.customBtn}>
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
				<button 
                    style={styles.cancelBtn} 
                    onClick={() => navigate('/lectures')} // Navigates back without saving
                >
                    Cancel
                </button>
                <div style={styles.actionButtons}>
                    <button style={styles.primaryBtn} onClick={handleSubmit}>
                        <CheckCircle size={16} /> Sent for Approvals
                    </button>
                    {/* Both buttons trigger the same submit function for now */}
                    <button style={styles.primaryBtn} onClick={handleSubmit}>
                        <CheckCircle size={16} /> Add
                    </button>
                </div>
            </div>
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
        fontWeight: '600',
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
        color: '#002855',
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
    }
};

export default CreateLecture;