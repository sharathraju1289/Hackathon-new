import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Lock, Mail, Phone, User, Building2, ShieldCheck, KeyRound } from 'lucide-react';
import styles from './AuthGate.module.css';

const AuthGate = ({ onLogin, initialView = 'login' }) => {
  const [view, setView] = useState(initialView); // 'login', 'register', 'otp'
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '', otp: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (formData.email && formData.password) {
      setLoading(true);
      try {
        // Example logic for auth login API
        // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({...formData}) });
        
        // Simulate API network latency
        await new Promise(resolve => setTimeout(resolve, 1200));
        onLogin();
      } catch (err) {
        setErrorMsg("Failed to connect to the server.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg("Please enter both ID and Password");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.phone && formData.password) {
      if (formData.password.length < 8) {
        setErrorMsg("Password must be at least 8 characters long");
        return;
      }
      setErrorMsg('');
      setLoading(true);
      
      try {
        // PROPER API CALL INTEGRATION PLACEHOLDER:
        // const response = await fetch('https://api.luxerealestate.in/auth/send-otp', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ email: formData.email, name: formData.name, phone: formData.phone })
        // });
        // if (!response.ok) throw new Error("Failed to send OTP to email");

        // Simulating the API network call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`API Call to send OTP to ${formData.email} successful.`);
        
        setView('otp');
      } catch (err) {
        setErrorMsg(err.message || "Failed to send OTP. Please try again later.");
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMsg("Please fill out all registration fields");
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    try {
      // PROPER API CALL INTEGRATION PLACEHOLDER:
      // const response = await fetch('https://api.luxerealestate.in/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email, otp: formData.otp })
      // });
      // if (!response.ok) throw new Error("Invalid OTP");

      // Simulating the API network call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (formData.otp === '123456') {
        onLogin();
      } else {
        setErrorMsg("Invalid OTP. For demo purposes use: 123456");
      }
    } catch (err) {
      setErrorMsg(err.message || "Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const variants = {
    enter: { opacity: 0, x: 20 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  return (
    <div className={styles.container}>
      <div className={styles.bgElements}>
        <div className={styles.circle1} />
        <div className={styles.circle2} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${styles.formBox} glass`}
      >
        <div style={{display: 'flex', justifyContent: 'center', marginBottom: '1rem'}}>
          <Building2 size={48} color="var(--accent-color)" />
        </div>
        <h1 className={styles.title}>Luxe Real Estate</h1>
        <p className={styles.subtitle}>
          {view === 'login' ? "Welcome back! Enter your details to continue." : 
           view === 'register' ? "Create an account to browse properties." : 
           "Verify your identity to proceed."}
        </p>

        {errorMsg && <div className={styles.errorAlert}>{errorMsg}</div>}

        <AnimatePresence mode="wait">
          {view === 'login' && (
            <motion.div key="login" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <form onSubmit={handleLoginSubmit}>
                <div className={styles.formGroup}>
                  <label><User size={14} style={{ marginRight: 6 }} /> Email ID or Mobile No.</label>
                  <input required type="text" name="email" className={styles.input} placeholder="john@example.com or +123" value={formData.email} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label><Lock size={14} style={{ marginRight: 6 }} /> Password</label>
                  <input required type="password" name="password" className={styles.input} placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>
                
                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? 'Logging In...' : 'Log In'} {!loading && <ArrowRight size={16} style={{ marginLeft: 8 }} />}
                </button>
              </form>
              
              <div className={styles.footerText}>
                Don't have an account? 
                <button type="button" className={styles.linkBtn} onClick={() => { setView('register'); setErrorMsg(''); }}>Sign Up</button>
              </div>
            </motion.div>
          )}

          {view === 'register' && (
            <motion.div key="register" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <form onSubmit={handleRegisterSubmit}>
                <div className={styles.formGroup}>
                  <label><User size={14} style={{ marginRight: 6 }} /> Full Name</label>
                  <input required type="text" name="name" className={styles.input} placeholder="John Doe" value={formData.name} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label><Phone size={14} style={{ marginRight: 6 }} /> Mobile Number</label>
                  <input required type="tel" name="phone" className={styles.input} placeholder="+1 234 567 890" value={formData.phone} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label><Mail size={14} style={{ marginRight: 6 }} /> Email Address</label>
                  <input required type="email" name="email" className={styles.input} placeholder="john@example.com" value={formData.email} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label><Lock size={14} style={{ marginRight: 6 }} /> Create Password</label>
                  <input required type="password" name="password" className={styles.input} placeholder="••••••••" value={formData.password} onChange={handleChange} />
                </div>
                
                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? 'Sending OTP...' : 'Continue to OTP'} {!loading && <ArrowRight size={16} style={{ marginLeft: 8 }} />}
                </button>
              </form>

              <div className={styles.footerText}>
                Already registered? 
                <button type="button" className={styles.linkBtn} onClick={() => { setView('login'); setErrorMsg(''); }}>Log In</button>
              </div>
            </motion.div>
          )}

          {view === 'otp' && (
            <motion.div key="otp" variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.3 }}>
              <form onSubmit={handleOTPSubmit}>
                <div className={styles.formGroup}>
                  <label style={{justifyContent: 'center'}}><ShieldCheck size={18} style={{ marginRight: 6 }} /> Enter OTP Code</label>
                  <input 
                    required 
                    type="text" 
                    name="otp" 
                    className={styles.input} 
                    placeholder="123456" 
                    maxLength="6" 
                    value={formData.otp} 
                    onChange={handleChange} 
                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }} 
                  />
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textAlign: 'center', margin: '1rem 0' }}>
                  We've sent a code to <strong style={{color: '#fff'}}>{formData.email || 'your email'}</strong>
                  <br />(Hint: Use <strong>123456</strong> for testing)
                </p>

                <button type="submit" className={styles.button} disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Enter'} {!loading && <ArrowRight size={16} style={{ marginLeft: 8 }} />}
                </button>
              </form>

              <div className={styles.footerText} style={{ marginTop: '1.5rem' }}>
                <button type="button" className={styles.linkBtn} onClick={() => { setView('login'); setErrorMsg(''); }}>
                  <KeyRound size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} /> 
                  Login through password
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default AuthGate;
