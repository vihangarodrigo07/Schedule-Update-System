import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { 
    Calendar, MapPin, Users, Edit, XCircle,
    CheckCircle, PlusCircle, X, AlertCircle
} from 'lucide-react';

const LectureDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 

    // View State
    const [lecture, setLecture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [batches, setBatches] = useState([]);
    const [halls, setHalls] = useState([]);

    // Cancel Modal State
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('Lecturer unavailable');
    const [cancelNotes, setCancelNotes] = useState('');

    const fetchLectureDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:5057/api/Lectures/${id}`);
            setLecture(response.data);
            
            const formattedDate = response.data.date ? response.data.date.split('T')[0] : '';
            setFormData({ ...response.data, date: formattedDate });
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching lecture:", err);
            setError("Failed to load lecture details.");
            setLoading(false);
        }
    };

    const fetchDropdowns = async () => {
        try {
            const batchRes = await axios.get("http://localhost:5057/api/Batches");
            const hallRes = await axios.get("http://localhost:5057/api/Halls");
            setBatches(batchRes.data);
            setHalls(hallRes.data);
        } catch (error) {
            console.error("Error fetching dropdowns:", error);
        }
    };

    useEffect(() => {
        fetchLectureDetails();
        fetchDropdowns();
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (newStatus) => {
        try {
            const payload = {
                id: parseInt(id),
                name: formData.name,
                description: formData.description,
                lecturerName: formData.lecturerName,
                batchId: formData.batchId ? parseInt(formData.batchId) : 0,
                hallId: formData.hallId ? parseInt(formData.hallId) : 0,
                date: formData.date,
                startTime: formData.startTime,
                endTime: formData.endTime,
                status: newStatus || lecture.status 
            };

            await axios.put(`http://localhost:5057/api/Lectures/${id}`, payload);
            await fetchLectureDetails();
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating lecture:", error);
            alert("Failed to update lecture.");
        }
    };

    const handleCancelConfirm = async () => {
        try {
            // According to LecturesController.cs, DELETE sets Status to "Canceled"
            await axios.delete(`http://localhost:5057/api/Lectures/${id}`);
            setShowCancelModal(false);
            fetchLectureDetails();
        } catch (error) {
             console.error("Error canceling lecture:", error);
             alert("Failed to cancel lecture.");
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "TBD";
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <div style={{...styles.centerContainer}}>Loading...</div>;
    if (error) return <div style={{...styles.centerContainer, color: '#BE123C'}}>{error}</div>;
    if (!lecture) return <div style={{...styles.centerContainer}}>Lecture not found.</div>;

    // ==========================================
    // EDIT MODE UI
    // ==========================================
    if (isEditing) {
        return (
            <div style={styles.container}>
                <div style={styles.topBar}></div>
                <div style={styles.formContent}>
                    <div style={styles.sectionRow}>
                        <div style={styles.sectionText}>
                            <h3 style={styles.sectionTitle}>Course Information</h3>
                            <p style={styles.sectionSubtitle}>Specify the primary identifiers for this lecture session.</p>
                        </div>
                        <div style={styles.sectionFields}>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>LECTURE NAME</label>
                                <input 
                                    type="text" name="name" style={styles.input} 
                                    value={formData.name || ''} onChange={handleChange}
                                />
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>LECTURE DESCRIPTION</label>
                                <input 
                                    type="text" name="description" style={styles.input} 
                                    value={formData.description || ''} onChange={handleChange}
                                />
                                <span style={styles.helperText}>Use formal university course nomenclature.</span>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>LECTURER SELECTION</label>
                                <select 
                                    name="lecturerName" style={{...styles.input, ...styles.select}}
                                    value={formData.lecturerName || ''} onChange={handleChange}
                                >
                                    <option value="" disabled>Select Lecturer</option>
                                    <option value="Dr. Alistair Thorne">Dr. Alistair Thorne</option>
                                    <option value="Dr. Sarah Johnson">Dr. Sarah Johnson</option>
                                    <option value="Prof. Sarah Jenkins">Prof. Sarah Jenkins</option>
                                </select>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>STUDENT BATCH</label>
                                <div style={styles.inputWithCustomBtn}>
                                    <select 
                                        name="batchId" style={{...styles.input, ...styles.select, flex: 1}}
                                        value={formData.batchId || ''} onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Student Batch</option>
                                        {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    </select>
                                    <button type="button" style={styles.customBtn}>
                                        <PlusCircle size={16} /><span>CUSTOM</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                        type="date" name="date" style={styles.input} 
                                        value={formData.date || ''} onChange={handleChange}
                                    />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>START TIME</label>
                                    <input 
                                        type="time" name="startTime" style={styles.input} 
                                        value={formData.startTime || ''} onChange={handleChange}
                                    />
                                </div>
                                <div style={styles.fieldGroup}>
                                    <label style={styles.label}>END TIME</label>
                                    <input 
                                        type="time" name="endTime" style={styles.input} 
                                        value={formData.endTime || ''} onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div style={styles.fieldGroup}>
                                <label style={styles.label}>LECTURE HALL</label>
                                <div style={styles.inputWithCustomBtn}>
                                    <select 
                                        name="hallId" style={{...styles.input, ...styles.select, flex: 1}}
                                        value={formData.hallId || ''} onChange={handleChange}
                                    >
                                        <option value="" disabled>Select Lecture Hall</option>
                                        {halls.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                    </select>
                                    <button type="button" style={styles.customBtn}>
                                        <PlusCircle size={16} /><span>CUSTOM</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style={styles.editFooter}>
                    <button style={styles.cancelTextBtn} onClick={() => setIsEditing(false)}>Cancel</button>
                    <div style={styles.actionButtons}>
                        <button style={styles.draftBtn} onClick={() => handleUpdate('Draft')}>Save as Draft</button>
                        <button style={styles.primaryBtn} onClick={() => handleUpdate('Pending')}>
                            <CheckCircle size={16} /> Sent for Approvals
                        </button>
                        <button style={styles.primaryBtn} onClick={() => handleUpdate('Scheduled')}>
                            <CheckCircle size={16} /> Save
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ==========================================
    // VIEW MODE UI (New Layout)
    // ==========================================
    return (
        <div style={styles.viewWrapper}>
            {/* Left Dark Panel */}
            <div style={styles.viewLeft}>
                <div>
                    <div style={styles.viewBadge}>COURSE DETAIL</div>
                    <h1 style={styles.viewTitle}>{lecture.name}</h1>
                    <p style={styles.viewDesc}>
                        {lecture.description || "Comprehensive study and exploration of the assigned academic module."}
                    </p>
                    
                    <div style={styles.viewLecturerBlock}>
                        <div style={styles.viewLecturerLabel}>Lecturer</div>
                        <div style={styles.viewLecturerName}>{lecture.lecturerName || "TBA"}</div>
                    </div>
                </div>
                
                <div style={styles.viewStatus}>
                    <div style={{
                        ...styles.statusDot, 
                        backgroundColor: lecture.status === 'Canceled' ? '#EF4444' : '#34D399'
                    }}></div>
                    Status: {lecture.status}
                </div>
            </div>

            {/* Right Light Panel */}
            <div style={styles.viewRight}>
                <button style={styles.closeBtn} onClick={() => navigate('/lectures')}>
                    <X size={24} />
                </button>

                <div style={styles.rightHeader}>
                    <div style={styles.sessionId}>SESSION ID: ICT-2026-{lecture.id.toString().padStart(4, '0')}</div>
                    <h2 style={styles.rightTitle}>Lecture Specifics</h2>
                </div>

                <div style={styles.specsGrid}>
                    <div style={styles.specBox}>
                        <div style={styles.specLabel}><Calendar size={14} /> TIMELINE</div>
                        <div style={styles.specValueMain}>{formatDate(lecture.date)}</div>
                        <div style={styles.specValueSub}>{lecture.startTime || '--:--'} - {lecture.endTime || '--:--'}</div>
                    </div>
                    <div style={styles.specBox}>
                        <div style={styles.specLabel}><MapPin size={14} /> VENUE</div>
                        <div style={styles.specValueMain}>{lecture.hall?.name || `Hall ID: ${lecture.hallId}`}</div>
                    </div>
                </div>

                <div style={styles.targetBox}>
                    <div style={styles.targetIcon}><Users size={24} color="#002855" /></div>
                    <div style={styles.targetInfo}>
                        <div style={styles.specLabel}>TARGET AUDIENCE</div>
                        <div style={styles.specValueMain}>{lecture.batch?.name || `Batch ID: ${lecture.batchId}`}</div>
                    </div>
                    <div style={styles.capacityInfo}>
                        <div style={styles.specLabel}>CAPACITY</div>
                        <div style={styles.specValueMain}>120 Students</div>
                    </div>
                </div>

                <div style={styles.viewFooter}>
                    <button 
                        style={lecture.status === 'Canceled' ? styles.cancelLectureBtnDisabled : styles.cancelLectureBtn}
                        disabled={lecture.status === 'Canceled'}
                        onClick={() => setShowCancelModal(true)}
                    >
                        <XCircle size={16} /> Cancel Lecture
                    </button>
                    <button style={styles.primaryBtn} onClick={() => setIsEditing(true)}>
                        <Edit size={16} /> Edit Lecture
                    </button>
                </div>
            </div>

            {/* ==========================================
                CANCEL MODAL UI
            ========================================== */}
            {showCancelModal && (
                <div style={styles.modalOverlay}>
                    <div style={styles.cancelModalCard}>
                        <div style={styles.modalHeader}>
                            <h2 style={styles.modalTitle}>Cancel Lecture</h2>
                            <button style={styles.iconBtn} onClick={() => setShowCancelModal(false)}>
                                <X size={20} color="#475569" />
                            </button>
                        </div>

                        <div style={styles.modalBody}>
                            <div style={styles.modalInfoGrid}>
                                <div>
                                    <div style={styles.modalLabel}>COURSE</div>
                                    <div style={styles.modalValue}>{lecture.name}</div>
                                </div>
                                <div>
                                    <div style={styles.modalLabel}>LECTURER</div>
                                    <div style={styles.modalValue}>{lecture.lecturerName}</div>
                                </div>
                                <div>
                                    <div style={styles.modalLabel}>BATCH</div>
                                    <div style={styles.modalValue}>{lecture.batch?.name}</div>
                                </div>
                                <div>
                                    <div style={styles.modalLabel}>DATE</div>
                                    <div style={styles.modalValue}>
                                        {lecture.date ? new Date(lecture.date).toLocaleDateString('en-US', {month: 'long', day: '2-digit', year: 'numeric'}) : 'TBA'}
                                    </div>
                                </div>
                                <div>
                                    <div style={styles.modalLabel}>TIME</div>
                                    <div style={styles.modalValue}>{lecture.startTime} - {lecture.endTime}</div>
                                </div>
                            </div>

                            <div style={styles.alertBox}>
                                <AlertCircle size={18} color="#DC2626" />
                                <span style={styles.alertText}>Are you sure you want to cancel this lecture?</span>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.modalLabel}>Reason for Cancellation</label>
                                <select 
                                    style={{...styles.input, ...styles.select, backgroundColor: '#E2E8F0'}}
                                    value={cancelReason} onChange={(e) => setCancelReason(e.target.value)}
                                >
                                    <option value="Lecturer unavailable">Lecturer unavailable</option>
                                    <option value="Public Holiday">Public Holiday</option>
                                    <option value="Hall unavailable">Hall unavailable</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.modalLabel}>Other (Optional)</label>
                                <textarea 
                                    style={styles.modalTextarea} 
                                    placeholder="Provide additional details..."
                                    value={cancelNotes} onChange={(e) => setCancelNotes(e.target.value)}
                                />
                            </div>

                            <div style={styles.checkboxGroup}>
                                <label style={styles.checkboxLabel}>
                                    <input type="checkbox" defaultChecked style={styles.checkbox} /> Notify Students
                                </label>
                                <label style={styles.checkboxLabel}>
                                    <input type="checkbox" defaultChecked style={styles.checkbox} /> Notify Lecturer
                                </label>
                            </div>
                        </div>

                        <div style={styles.modalFooter}>
                            <button style={styles.keepBtn} onClick={() => setShowCancelModal(false)}>Keep Lecture</button>
                            <button style={styles.confirmCancelBtn} onClick={handleCancelConfirm}>Cancel Lecture Request</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    centerContainer: { padding: '50px', textAlign: 'center', fontFamily: 'system-ui, sans-serif' },
    
    // --- EDIT MODE STYLES ---
    container: { padding: '10px 0 40px 0', maxWidth: '1100px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' },
    topBar: { height: '6px', backgroundColor: '#002855', width: '100%', borderRadius: '12px 12px 0 0' },
    formContent: { padding: '40px', backgroundColor: 'white', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0' },
    sectionRow: { display: 'flex', gap: '40px', marginBottom: '50px' },
    sectionText: { flex: '0 0 250px' },
    sectionTitle: { margin: '0 0 8px 0', color: '#002855', fontSize: '20px', fontWeight: '500' },
    sectionSubtitle: { margin: 0, color: '#64748B', fontSize: '14px', lineHeight: '1.5' },
    sectionFields: { flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' },
    fieldGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { fontSize: '12px', fontWeight: '600', color: '#475569', letterSpacing: '0.5px', textTransform: 'uppercase' },
    input: { backgroundColor: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '14px 16px', fontSize: '15px', color: '#0F172A', outline: 'none', width: '100%', boxSizing: 'border-box' },
    select: { cursor: 'pointer', appearance: 'none', backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%2364748B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 16px top 50%', backgroundSize: '12px auto' },
    helperText: { fontSize: '12px', color: '#64748B' },
    inputWithCustomBtn: { display: 'flex', gap: '12px' },
    customBtn: { backgroundColor: '#F1F5F9', border: '1px dashed #94A3B8', borderRadius: '6px', padding: '0 20px', color: '#64748B', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer', fontSize: '10px', fontWeight: '700', minWidth: '90px' },
    multiColumnFields: { display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '16px' },
    editFooter: { borderTop: '1px solid #E2E8F0', padding: '24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC', borderRadius: '0 0 12px 12px', borderLeft: '1px solid #E2E8F0', borderRight: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0' },
    cancelTextBtn: { background: 'none', border: 'none', color: '#475569', fontSize: '15px', cursor: 'pointer', padding: '0' },
    draftBtn: { background: 'none', border: 'none', color: '#1E40AF', fontSize: '15px', fontWeight: '700', cursor: 'pointer', padding: '0 16px' },
    primaryBtn: { backgroundColor: '#002855', color: 'white', border: 'none', borderRadius: '6px', padding: '12px 24px', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },

    // --- NEW VIEW MODE STYLES ---
    viewWrapper: { display: 'flex', maxWidth: '1000px', margin: '40px auto', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', fontFamily: 'system-ui, sans-serif' },
    viewLeft: { width: '340px', backgroundColor: '#001E42', backgroundImage: 'linear-gradient(180deg, #002855 0%, #001229 100%)', padding: '40px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    viewBadge: { display: 'inline-block', backgroundColor: 'rgba(255,255,255,0.1)', padding: '6px 12px', borderRadius: '20px', fontSize: '10px', fontWeight: '700', letterSpacing: '1px', marginBottom: '24px' },
    viewTitle: { margin: '0 0 16px 0', fontSize: '32px', fontWeight: '400', lineHeight: '1.2' },
    viewDesc: { color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', marginBottom: '40px' },
    viewLecturerBlock: { marginTop: '20px' },
    viewLecturerLabel: { fontSize: '12px', color: '#94A3B8', marginBottom: '4px' },
    viewLecturerName: { fontSize: '16px', fontWeight: '500' },
    viewStatus: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#CBD5E1' },
    statusDot: { width: '8px', height: '8px', borderRadius: '50%' },
    viewRight: { flex: 1, backgroundColor: 'white', padding: '40px 50px', position: 'relative' },
    closeBtn: { position: 'absolute', top: '30px', right: '30px', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' },
    rightHeader: { marginBottom: '40px' },
    sessionId: { fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' },
    rightTitle: { margin: 0, fontSize: '24px', color: '#002855', fontWeight: '600' },
    specsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
    specBox: { backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px' },
    specLabel: { fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' },
    specValueMain: { fontSize: '18px', color: '#1E293B', fontWeight: '400', marginBottom: '4px' },
    specValueSub: { fontSize: '13px', color: '#64748B' },
    targetBox: { backgroundColor: '#F8FAFC', padding: '20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '20px' },
    targetIcon: { width: '48px', height: '48px', backgroundColor: '#DBEAFE', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    targetInfo: { flex: 1 },
    capacityInfo: { textAlign: 'right' },
    viewFooter: { marginTop: '60px', paddingTop: '24px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'flex-end', gap: '20px' },
    cancelLectureBtn: { background: 'none', border: 'none', color: '#BE123C', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' },
    cancelLectureBtnDisabled: { background: 'none', border: 'none', color: '#CBD5E1', fontWeight: '600', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'not-allowed' },

    // --- CANCEL MODAL STYLES ---
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    cancelModalCard: { backgroundColor: '#F8FAFC', borderRadius: '12px', width: '550px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    modalHeader: { backgroundColor: 'white', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    modalTitle: { margin: 0, fontSize: '20px', fontWeight: '700', color: '#0F172A' },
    iconBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' },
    modalBody: { padding: '32px', backgroundColor: 'white' },
    modalInfoGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', backgroundColor: '#F1F5F9', padding: '20px', borderRadius: '8px', marginBottom: '24px' },
    modalLabel: { fontSize: '11px', fontWeight: '700', color: '#64748B', letterSpacing: '0.5px', marginBottom: '6px', textTransform: 'uppercase' },
    modalValue: { fontSize: '14px', color: '#0F172A', fontWeight: '500' },
    alertBox: { backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '8px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' },
    alertText: { color: '#991B1B', fontSize: '14px', fontWeight: '600' },
    formGroup: { marginBottom: '20px' },
    modalTextarea: { width: '100%', backgroundColor: '#E2E8F0', border: 'none', borderRadius: '6px', padding: '12px', fontSize: '14px', outline: 'none', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' },
    checkboxGroup: { display: 'flex', flexDirection: 'column', gap: '12px' },
    checkboxLabel: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#334155', cursor: 'pointer' },
    checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
    modalFooter: { backgroundColor: '#F8FAFC', padding: '20px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0' },
    keepBtn: { background: 'none', border: 'none', color: '#475569', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
    confirmCancelBtn: { backgroundColor: 'white', color: '#BE123C', border: '1px solid #FECACA', padding: '10px 20px', borderRadius: '6px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }
};

export default LectureDetails;