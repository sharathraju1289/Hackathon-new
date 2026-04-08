import React from 'react';
import { Home, Phone, Mail, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const navigate = useNavigate();
  return (
    <footer className={styles.footerContainer}>
      <div className={styles.footerWrapper}>
        
        <div className={styles.companySection}>
          <h1 className={styles.brandName}>
            <Home className={styles.brandIcon} size={28} />
            Luxe Real Estate
          </h1>
          <p className={styles.companyDesc}>
            A premium real estate platform delivering secure and trusted properties 
            across India. Whether it's rentals, PG accommodations, or buying luxury homes, 
            find your next sanctuary with us.
          </p>
        </div>

        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>Home</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/wishlist')}>Wishlist</li>
            <li style={{ cursor: 'pointer' }} onClick={() => navigate('/schedules')}>Schedules</li>
            <li>List your Property</li>
          </ul>
        </div>

        <div className={styles.linksSection}>
          <h3 className={styles.sectionTitle}>Legal & Privacy</h3>
          <ul className={styles.linkList}>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Cookie Policy</li>
            <li>Agent Disclaimer</li>
          </ul>
        </div>

        <div className={styles.contactSection}>
          <h3 className={styles.sectionTitle}>Contact Us</h3>
          <div className={styles.contactItem}>
            <MapPin size={18} />
            <p>12B Cyberjaya Towers, Hitech City<br/>Hyderabad, IN 500081</p>
          </div>
          <div className={styles.contactItem}>
            <Phone size={18} />
            <p>+91 (800) 123-4567</p>
          </div>
          <div className={styles.contactItem}>
            <Mail size={18} />
            <p>support@luxerealestate.in</p>
          </div>
        </div>
      </div>
      
      <div className={styles.bottomBar}>
        <p>&copy; {new Date().getFullYear()} Luxe Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
