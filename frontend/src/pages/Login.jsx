import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GraduationCap, AlertCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(false);
        setLoading(true);

        try {
            // Pointing to a hypothetical Auth endpoint on your ASP.NET backend
            const response = await axios.post('http://localhost:5057/api/Auth/Login', {
                email: email,
                password: password
            });

            localStorage.setItem('user', JSON.stringify(response.data));
            // If successful, you might want to save a token here (e.g., localStorage.setItem('token', response.data.token))
            setLoading(false);
            navigate('/dashboard'); // Redirect to the dashboard/lectures page
            
        } catch (err) {
            console.error("Login failed:", err);
            // Show the specific error UI from the Figma design
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div style={styles.pageBackground}>
            <div style={styles.cardContainer}>
                {/* Top Border Accent */}
                <div style={styles.cardTopBorder}></div>
                
                <div style={styles.cardContent}>
                    {/* Logo & Header */}
                    <div style={styles.logoContainer}>
                        <div style={styles.logoBox}>
                            <GraduationCap size={24} color="white" />
                        </div>
                        <p style={styles.universityName}>ACADEMIC CENTRAL UNIVERSITY</p>
                        <h1 style={styles.title}>Institutional Login</h1>
                        <p style={styles.subtitle}>
                            Secure access to the archival editorial suite for students and faculty.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleLogin} style={styles.form}>
                        
                        {/* Email Input */}
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>UNIVERSITY EMAIL</label>
                            <input 
                                type="email" 
                                placeholder="e.g. name@university.edu" 
                                style={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div style={styles.inputGroup}>
                            <div style={styles.passwordHeader}>
                                <label style={styles.label}>PASSWORD</label>
                                <a href="#" style={styles.forgotPassword}>Forgot Password?</a>
                            </div>
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {/* Error State */}
                        {error && (
                            <div style={styles.errorBox}>
                                <AlertCircle size={16} color="#B91C1C" style={{ flexShrink: 0, marginTop: '2px' }} />
                                <p style={styles.errorText}>
                                    The credentials you entered are incorrect. Please try again or contact IT support if the problem persists.
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button type="submit" style={styles.loginButton} disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Disclaimer Text */}
            <p style={styles.disclaimerText}>
                By accessing this system, you agree to the University's Acceptable Use Policy.<br/>
                Unauthorized access is strictly prohibited and subject to institutional discipline.
            </p>

            {/* Global Footer */}
            <div style={styles.globalFooter}>
                <span style={styles.footerCopyright}>© 2024 Academic Editorial. All rights reserved.</span>
                <div style={styles.footerLinks}>
                    <span style={styles.footerLink}>Privacy Policy</span>
                    <span style={styles.footerLink}>Terms of Service</span>
                    <span style={styles.footerLink}>Accessibility</span>
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageBackground: {
        minHeight: '100vh',
        backgroundColor: '#F4F7F9',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, #F4F7F9 100%)' // Subtle background depth
    },
    cardContainer: {
        width: '420px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        marginBottom: '24px',
        zIndex: 10
    },
    cardTopBorder: {
        height: '4px',
        backgroundColor: '#002855',
        width: '100%'
    },
    cardContent: {
        padding: '40px'
    },
    logoContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '32px'
    },
    logoBox: {
        width: '48px',
        height: '48px',
        backgroundColor: '#002855',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '16px'
    },
    universityName: {
        fontSize: '10px',
        fontWeight: '700',
        color: '#92400E', // Bronze/Gold color from Figma
        letterSpacing: '1px',
        margin: '0 0 8px 0'
    },
    title: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#002855',
        margin: '0 0 12px 0'
    },
    subtitle: {
        fontSize: '13px',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: '1.5',
        margin: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '11px',
        fontWeight: '700',
        color: '#475569',
        letterSpacing: '0.5px'
    },
    passwordHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    forgotPassword: {
        fontSize: '12px',
        color: '#002855',
        textDecoration: 'none',
        fontWeight: '600'
    },
    input: {
        padding: '14px',
        backgroundColor: '#F1F5F9',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        color: '#1E293B',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    },
    errorBox: {
        backgroundColor: '#FEF2F2',
        border: '1px solid #FECACA',
        borderRadius: '6px',
        padding: '12px',
        display: 'flex',
        gap: '10px',
        alignItems: 'flex-start'
    },
    errorText: {
        margin: 0,
        fontSize: '12px',
        color: '#991B1B',
        lineHeight: '1.5',
        fontWeight: '500'
    },
    loginButton: {
        backgroundColor: '#002855',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '6px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
        transition: 'background-color 0.2s'
    },
    disclaimerText: {
        fontSize: '11px',
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: '1.6',
        maxWidth: '400px',
        marginBottom: '60px' // Space for the absolute footer
    },
    globalFooter: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '20px 40px',
        borderTop: '1px solid #E2E8F0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F4F7F9'
    },
    footerCopyright: {
        fontSize: '12px',
        color: '#64748B',
        fontWeight: '500'
    },
    footerLinks: {
        display: 'flex',
        gap: '24px'
    },
    footerLink: {
        fontSize: '12px',
        color: '#64748B',
        fontWeight: '500',
        cursor: 'pointer'
    }
};

export default Login;