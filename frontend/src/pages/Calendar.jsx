import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Calendar = () => {
    const navigate = useNavigate();
    const [view, setView] = useState('month'); // 'daily', 'week', 'month'
    const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 4)); // Default to March 4, 2026 based on your Figma
    const [lectures, setLectures] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:5057/api/Lectures";

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

    // --- Date Helper Functions ---
    const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    
    // Adjusting so Monday is the first day of the week (like the Figma design)
    const getStartDayOfMonth = (year, month) => {
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; 
    };

    const getStartOfWeek = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const addDays = (date, days) => {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    };

    const formatMonthYear = (date) => {
        return date.toLocaleString('default', { month: 'long', year: 'numeric' });
    };

    const isSameDay = (date1, date2) => {
        if (!date1 || !date2) return false;
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    // Parse "09:00" to minutes from midnight for Week View positioning
    const parseTimeToMinutes = (timeStr) => {
        if (!timeStr) return 0;
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // --- Navigation Controls ---
    const handlePrev = () => {
        if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
        if (view === 'week') setCurrentDate(addDays(currentDate, -7));
        if (view === 'daily') setCurrentDate(addDays(currentDate, -1));
    };

    const handleNext = () => {
        if (view === 'month') setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
        if (view === 'week') setCurrentDate(addDays(currentDate, 7));
        if (view === 'daily') setCurrentDate(addDays(currentDate, 1));
    };

    // --- View Renderers ---

    const renderMonthView = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);
        const startDay = getStartDayOfMonth(year, month);
        
        const days = [];
        const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} style={styles.monthCellEmpty}></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const currentCellDate = new Date(year, month, d);
            const isToday = isSameDay(currentCellDate, new Date()); 
            const dayLectures = lectures.filter(l => isSameDay(l.date, currentCellDate));

            days.push(
                <div key={`day-${d}`} style={{...styles.monthCell, ...(isToday ? styles.monthCellToday : {})}}>
                    <div style={styles.monthCellHeader}>
                        <span style={{...styles.monthCellDate, ...(isToday ? styles.monthCellDateActive : {})}}>{d}</span>
                    </div>
                    
                    {/* Upgraded Month View: Showing actual text chips instead of dots */}
                    <div style={styles.monthEventList}>
                        {dayLectures.slice(0, 3).map((l, idx) => {
                            const isCanceled = l.status === 'Canceled';
                            return (
                                <div key={idx} style={{
                                    ...styles.monthEventChip,
                                    backgroundColor: isCanceled ? '#FEE2E2' : '#EFF6FF',
                                    color: isCanceled ? '#991B1B' : '#1E40AF',
                                    borderLeft: `3px solid ${isCanceled ? '#EF4444' : '#3B82F6'}`
                                }}>
                                    <strong>{l.startTime}</strong> {l.name}
                                </div>
                            );
                        })}
                        {dayLectures.length > 3 && (
                            <div style={styles.moreEventsText}>+{dayLectures.length - 3} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return (
            <div style={styles.monthGridContainer}>
                <div style={styles.monthHeaderRow}>
                    {daysOfWeek.map(day => <div key={day} style={styles.monthHeaderCell}>{day}</div>)}
                </div>
                <div style={styles.monthGrid}>
                    {days}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const startOfWeek = getStartOfWeek(currentDate);
        const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startOfWeek, i));
        
        // Upgraded Week View: Start at 08:00 AM, span down to 06:00 PM
        const START_MINUTES = 480; 
        const PIXELS_PER_MINUTE = 1.5; 
        
        const hours = [
            '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', 
            '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'
        ];

        return (
            <div style={styles.weekContainer}>
                <div style={styles.weekHeaderRow}>
                    <div style={styles.timeAxisLabel}>GMT+5</div>
                    {weekDays.map((day, i) => {
                        const isToday = isSameDay(day, new Date());
                        return (
                            <div key={i} style={{...styles.weekHeaderDay, color: isToday ? '#2563EB' : '#64748B'}}>
                                <div style={styles.weekDayName}>{day.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</div>
                                <div style={{...styles.weekDayNumber, ...(isToday ? styles.weekDayNumberActive : {})}}>{day.getDate()}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Removed fixed height so it scrolls naturally with the page */}
                <div style={styles.weekGridBody}>
                    <div style={styles.timeAxis}>
                        {hours.map(h => <div key={h} style={styles.timeLabel}>{h}</div>)}
                    </div>
                    
                    <div style={styles.daysAxis}>
                        {weekDays.map((day, dayIndex) => {
                            const dayLectures = lectures.filter(l => isSameDay(l.date, day));
                            
                            return (
                                <div key={dayIndex} style={styles.weekDayColumn}>
                                    {hours.map((_, i) => <div key={i} style={styles.gridHorizontalLine}></div>)}
                                    
                                    {dayLectures.map(lecture => {
                                        const startMins = parseTimeToMinutes(lecture.startTime);
                                        const endMins = parseTimeToMinutes(lecture.endTime);
                                        const duration = endMins - startMins;
                                        
                                        // Prevents math breaking if data is bad
                                        if (isNaN(startMins) || isNaN(endMins)) return null; 

                                        const top = (startMins - START_MINUTES) * PIXELS_PER_MINUTE;
                                        const height = duration * PIXELS_PER_MINUTE;

                                        const isCanceled = lecture.status === 'Canceled';
                                        const isBlue = !isCanceled && dayIndex % 2 === 0;

                                        return (
                                            <div key={lecture.id} onClick={() => navigate(`/lectures/${lecture.id}`)} style={{
                                                ...styles.weekEventBlock,
                                                top: `${top}px`,
                                                height: `${Math.max(height, 30)}px`, // Ensures block is at least 30px high so text isn't squished
                                                backgroundColor: isCanceled ? '#FEE2E2' : (isBlue ? '#EFF6FF' : '#F5F3FF'),
                                                borderLeft: `4px solid ${isCanceled ? '#EF4444' : (isBlue ? '#3B82F6' : '#C084FC')}`
                                            }}>
                                                <div style={{...styles.weekEventTitle, color: isCanceled ? '#991B1B' : '#1E3A8A'}}>
                                                    {lecture.name}
                                                </div>
                                                <div style={styles.weekEventTime}>{lecture.startTime} - {lecture.endTime}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderDailyView = () => {
        const dayLectures = lectures.filter(l => isSameDay(l.date, currentDate));
        
        const morningSessions = dayLectures.filter(l => parseTimeToMinutes(l.startTime) < 720); // Before 12:00
        const afternoonSessions = dayLectures.filter(l => parseTimeToMinutes(l.startTime) >= 720); // After 12:00

        const renderSessionCard = (lecture) => {
            const isCanceled = lecture.status === 'Canceled';
            
            return (
                <div key={lecture.id} style={{...styles.dailyCard, backgroundColor: isCanceled ? '#FDF2F8' : 'white'}}>
                    <div style={styles.dailyTimeCol}>
                        <div style={{...styles.dailyStartTime, color: isCanceled ? '#94A3B8' : '#0F172A'}}>{lecture.startTime}</div>
                        <div style={styles.dailyEndTime}>{lecture.endTime}</div>
                    </div>
                    <div style={styles.dailyInfoCol}>
                        <div style={{...styles.dailyLectureName, textDecoration: isCanceled ? 'line-through' : 'none', color: isCanceled ? '#64748B' : '#002855'}}>
                            {lecture.name}
                        </div>
                        <div style={styles.dailyLocation}>
                            📍 {lecture.hall?.name || `Hall B • North Wing`}
                        </div>
                    </div>
                    <div style={styles.dailyStatusCol}>
                        {isCanceled && <div style={styles.dailyCanceledBadge}>! CANCELLED</div>}
                    </div>
                </div>
            );
        };

        return (
            <div style={styles.dailyContainer}>
                <div style={styles.dailySectionTitle}>MORNING SESSIONS</div>
                {morningSessions.length > 0 ? morningSessions.map(renderSessionCard) : <p style={styles.noEventsText}>No morning sessions.</p>}
                
                <div style={styles.dailySectionTitle}>AFTERNOON SESSIONS</div>
                {afternoonSessions.length > 0 ? afternoonSessions.map(renderSessionCard) : <p style={styles.noEventsText}>No afternoon sessions.</p>}

                <div style={styles.dailyFooterActions}>
                    <button style={styles.exportBtn}><Download size={16} /> Export PDF</button>
                    <button style={styles.fullMonthBtn} onClick={() => setView('month')}>View Full Month</button>
                </div>
            </div>
        );
    };

    return (
        <div style={styles.pageContainer}>
            {/* Standard Global Nav header can go here */}

            {/* Content Area */}
            <div style={styles.contentArea}>
                <p style={styles.overline}>DEPARTMENT OF INFORMATION & COMMUNICATION TECHNOLOGY</p>
                <h1 style={styles.title}>Calendar</h1>
                
                <div style={styles.calendarHeaderRow}>
                    <div>
                        <h2 style={styles.monthYearTitle}>{formatMonthYear(currentDate)}</h2>
                        <p style={styles.subtitle}>Managing {lectures.length} lectures and 3 seminars this month.</p>
                    </div>

                    <div style={styles.tabGroup}>
                        <button style={{...styles.tabBtn, ...(view === 'daily' ? styles.activeTab : {})}} onClick={() => setView('daily')}>Daily</button>
                        <button style={{...styles.tabBtn, ...(view === 'week' ? styles.activeTab : {})}} onClick={() => setView('week')}>Week</button>
                        <button style={{...styles.tabBtn, ...(view === 'month' ? styles.activeTab : {})}} onClick={() => setView('month')}>Month</button>
                    </div>
                </div>

                <div style={styles.controlsRow}>
                    <button style={styles.iconBtn} onClick={handlePrev}><ChevronLeft size={16} /></button>
                    <span style={styles.currentDateLabel}>
                        {view === 'month' && formatMonthYear(currentDate)}
                        {view === 'week' && `${getStartOfWeek(currentDate).toLocaleDateString('en-US', {month: 'short', day: 'numeric'})} - ${addDays(getStartOfWeek(currentDate), 6).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}`}
                        {view === 'daily' && currentDate.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}
                    </span>
                    <button style={styles.iconBtn} onClick={handleNext}><ChevronRight size={16} /></button>
                </div>

                {/* Render the selected view */}
                <div style={styles.viewContainer}>
                    {loading ? <p>Loading calendar data...</p> : (
                        <>
                            {view === 'month' && renderMonthView()}
                            {view === 'week' && renderWeekView()}
                            {view === 'daily' && renderDailyView()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageContainer: {
        backgroundColor: '#F8FAFC',
        padding: '40px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        width: '100%',
        boxSizing: 'border-box'
    },
    contentArea: {
        maxWidth: '1200px',
        margin: '0 auto',
    },
    overline: {
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748B',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        marginBottom: '8px'
    },
    title: {
        margin: 0,
        color: '#002855',
        fontSize: '36px',
        fontWeight: '800',
        marginBottom: '24px'
    },
    calendarHeaderRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '24px'
    },
    monthYearTitle: {
        margin: 0,
        fontSize: '28px',
        color: '#0F172A',
        fontWeight: '700'
    },
    subtitle: {
        margin: '8px 0 0 0',
        color: '#64748B',
        fontSize: '15px'
    },
    tabGroup: {
        display: 'flex',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '4px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        border: '1px solid #E2E8F0'
    },
    tabBtn: {
        padding: '8px 24px',
        border: 'none',
        backgroundColor: 'transparent',
        fontSize: '14px',
        fontWeight: '600',
        color: '#64748B',
        cursor: 'pointer',
        borderRadius: '6px'
    },
    activeTab: {
        backgroundColor: '#F1F5F9',
        color: '#0F172A',
    },
    controlsRow: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
        paddingRight: '16px'
    },
    iconBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: '#475569',
        display: 'flex',
        alignItems: 'center'
    },
    currentDateLabel: {
        fontSize: '15px',
        fontWeight: '600',
        color: '#0F172A',
        minWidth: '150px',
        textAlign: 'center'
    },
    viewContainer: {
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        border: '1px solid #E2E8F0'
    },
    
    // --- Month View Styles ---
    monthGridContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    monthHeaderRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0'
    },
    monthHeaderCell: {
        padding: '16px',
        textAlign: 'center',
        fontSize: '12px',
        fontWeight: '700',
        color: '#64748B',
        letterSpacing: '1px'
    },
    monthGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gridAutoRows: '140px' // Increased height to fit text chips
    },
    monthCell: {
        borderRight: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
        padding: '12px',
        position: 'relative'
    },
    monthCellEmpty: {
        backgroundColor: '#F8FAFC',
        borderRight: '1px solid #E2E8F0',
        borderBottom: '1px solid #E2E8F0',
    },
    monthCellToday: {
        backgroundColor: '#F1F5F9'
    },
    monthCellHeader: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '4px'
    },
    monthCellDate: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#334155'
    },
    monthCellDateActive: {
        backgroundColor: '#002855',
        color: 'white',
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        marginTop: '-4px'
    },
    monthEventList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        overflow: 'hidden'
    },
    monthEventChip: {
        fontSize: '11px',
        padding: '4px 6px',
        borderRadius: '4px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        cursor: 'pointer'
    },
    moreEventsText: {
        fontSize: '11px',
        color: '#64748B',
        fontWeight: '600',
        paddingLeft: '4px',
        marginTop: '2px'
    },

    // --- Week View Styles ---
    weekContainer: {
        display: 'flex',
        flexDirection: 'column'
    },
    weekHeaderRow: {
        display: 'flex',
        borderBottom: '1px solid #E2E8F0',
        backgroundColor: 'white'
    },
    timeAxisLabel: {
        width: '80px',
        padding: '16px',
        fontSize: '12px',
        color: '#94A3B8',
        fontWeight: '600',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    weekHeaderDay: {
        flex: 1,
        textAlign: 'center',
        padding: '16px',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
    },
    weekDayName: {
        fontSize: '12px',
        fontWeight: '700'
    },
    weekDayNumber: {
        fontSize: '20px',
        fontWeight: '700'
    },
    weekDayNumberActive: {
        backgroundColor: '#2563EB',
        color: 'white',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        marginTop: '4px'
    },
    weekGridBody: {
        display: 'flex',
        overflowY: 'auto' // Removed fixed height so it scrolls down the page naturally
    },
    timeAxis: {
        width: '80px',
        borderRight: '1px solid #E2E8F0',
        backgroundColor: 'white',
        flexShrink: 0
    },
    timeLabel: {
        height: '90px', // 60 mins * 1.5 pixels = 90px
        padding: '8px',
        fontSize: '11px',
        color: '#94A3B8',
        fontWeight: '500',
        textAlign: 'center',
        borderBottom: '1px solid transparent'
    },
    daysAxis: {
        display: 'flex',
        flex: 1,
        position: 'relative'
    },
    weekDayColumn: {
        flex: 1,
        borderRight: '1px solid #E2E8F0',
        position: 'relative',
        minWidth: '120px'
    },
    gridHorizontalLine: {
        height: '90px',
        borderBottom: '1px solid #F1F5F9'
    },
    weekEventBlock: {
        position: 'absolute',
        left: '4px',
        right: '4px',
        borderRadius: '4px',
        padding: '6px 8px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        zIndex: 10,
        cursor: 'pointer',
        transition: 'transform 0.1s ease'
    },
    weekEventTitle: {
        fontSize: '12px',
        fontWeight: '700',
        marginBottom: '2px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    weekEventTime: {
        fontSize: '10px',
        color: '#64748B'
    },
    conflictBadge: {
        position: 'absolute',
        top: '4px',
        right: '4px',
        backgroundColor: '#EF4444',
        color: 'white',
        fontSize: '9px',
        fontWeight: '800',
        padding: '2px 4px',
        borderRadius: '2px'
    },

    // --- Daily View Styles ---
    dailyContainer: {
        padding: '32px',
        backgroundColor: '#F8FAFC'
    },
    dailySectionTitle: {
        fontSize: '12px',
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: '1px',
        marginBottom: '16px',
        marginTop: '24px'
    },
    dailyCard: {
        display: 'flex',
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '16px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        alignItems: 'center'
    },
    dailyTimeCol: {
        width: '120px',
        flexShrink: 0,
        borderRight: '2px solid #F1F5F9',
        paddingRight: '24px'
    },
    dailyStartTime: {
        fontSize: '24px',
        fontWeight: '800'
    },
    dailyEndTime: {
        fontSize: '13px',
        color: '#64748B',
        fontWeight: '500',
        marginTop: '4px'
    },
    dailyInfoCol: {
        flex: 1,
        paddingLeft: '24px'
    },
    dailyLectureName: {
        fontSize: '18px',
        fontWeight: '700',
        marginBottom: '8px'
    },
    dailyLocation: {
        fontSize: '14px',
        color: '#64748B'
    },
    dailyStatusCol: {
        width: '150px',
        display: 'flex',
        justifyContent: 'flex-end'
    },
    dailyCanceledBadge: {
        backgroundColor: '#FECDD3',
        color: '#BE123C',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '0.5px'
    },
    noEventsText: {
        color: '#94A3B8',
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '32px'
    },
    dailyFooterActions: {
        display: 'flex',
        gap: '16px',
        marginTop: '40px'
    },
    exportBtn: {
        backgroundColor: '#002855',
        color: 'white',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer'
    },
    fullMonthBtn: {
        backgroundColor: '#DBEAFE',
        color: '#1E3A8A',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '6px',
        fontWeight: '600',
        cursor: 'pointer'
    }
};

export default Calendar;