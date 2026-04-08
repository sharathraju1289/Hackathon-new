import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize, Phone, Mail, CheckCircle2, Calendar, CreditCard } from 'lucide-react';
import { generateProperties } from '../utils/dummyData';
import { useUser } from '../context/UserContext';
import Header from './Header';
import FullScreenGallery from './FullScreenGallery';
import styles from './PropertyDetail.module.css';
import { motion } from 'framer-motion';

const PropertyDetail = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [initGalleryIndex, setInitGalleryIndex] = useState(0);
  const { addSchedule } = useUser();
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const handleSchedule = () => {
    if (scheduleDate) {
      addSchedule(property.id, scheduleDate);
      setScheduleSuccess(true);
      setTimeout(() => setScheduleSuccess(false), 3000);
      setScheduleDate('');
    }
  };

  useEffect(() => {
    const allProps = generateProperties(100);
    const found = allProps.find(p => p.id === id) || allProps[0];
    setProperty(found);
  }, [id]);

  if (!property) return <div className={styles.loading}>Loading...</div>;

  const amenities = [
    "High-speed WiFi", "Air Conditioning", "Swimming Pool", 
    "Gymnasium", "24/7 Security", "Balcony", "Smart Home", 
    "Modular Kitchen", "Parking Space"
  ];

  const handleImageClick = (idx) => {
    setInitGalleryIndex(idx);
    setGalleryOpen(true);
  };

  // Payment Logic Layer
  const isHighToken = property.type === 'Sale' || property.type === 'Lease';
  const tokenPercentage = isHighToken ? 2 : 5;
  const tokenAmount = property.basePriceValue * (tokenPercentage / 100);
  const formattedToken = `₹${tokenAmount.toLocaleString('en-IN')}`;

  return (
    <div className={styles.container}>
      {/* Global Header Injection */}
      <Header showSearch={false} />

      {/* 5-Image Grid Gallery */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.hero}
      >
        <div className={styles.imageGridHero}>
          <div className={`${styles.imgWrap} ${styles.imgMain}`} onClick={() => handleImageClick(0)}>
            <img
              src={(property.localImages && property.localImages[0]) || property.images[0]}
              alt="Main View"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (property.images[0] && e.currentTarget.src !== property.images[0]) e.currentTarget.src = property.images[0];
              }}
            />
          </div>
          <div className={`${styles.imgWrap} ${styles.imgSub1}`} onClick={() => handleImageClick(1)}>
            <img
              src={(property.localImages && property.localImages[1]) || property.images[1]}
              alt="View 2"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (property.images[1] && e.currentTarget.src !== property.images[1]) e.currentTarget.src = property.images[1];
              }}
            />
          </div>
          <div className={`${styles.imgWrap} ${styles.imgSub2}`} onClick={() => handleImageClick(2)}>
            <img
              src={(property.localImages && property.localImages[2]) || property.images[2]}
              alt="View 3"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (property.images[2] && e.currentTarget.src !== property.images[2]) e.currentTarget.src = property.images[2];
              }}
            />
          </div>
          <div className={`${styles.imgWrap} ${styles.imgSub3}`} onClick={() => handleImageClick(3)}>
            <img
              src={(property.localImages && property.localImages[3]) || property.images[3]}
              alt="View 4"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (property.images[3] && e.currentTarget.src !== property.images[3]) e.currentTarget.src = property.images[3];
              }}
            />
          </div>
          <div className={`${styles.imgWrap} ${styles.imgSub4}`} onClick={() => handleImageClick(4)}>
            <img
              src={(property.localImages && property.localImages[4]) || property.images[4]}
              alt="View 5"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                if (property.images[4] && e.currentTarget.src !== property.images[4]) e.currentTarget.src = property.images[4];
              }}
            />
            <div className={styles.viewMoreOverlay}>
              <span>+ View All Media</span>
            </div>
          </div>
        </div>
      </motion.div>

      <div className={styles.contentWrapper}>
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className={styles.mainInfo}
        >
          <div className={styles.header}>
            <span className={styles.typeBadge}>{property.type}</span>
            <h1 className={styles.title}>{property.title}</h1>
            <div className={styles.location}>
              <MapPin size={18} color="var(--text-secondary)" /> {property.location}
            </div>
            <div className={styles.price}>{property.price}</div>
          </div>

          <div className={`${styles.features} glass`}>
            <div className={styles.featureItem}>
              <Bed size={24} color="var(--accent-color)" />
              <div><strong>{property.beds}</strong> Beds</div>
            </div>
            <div className={styles.featureItem}>
              <Bath size={24} color="var(--accent-color)" />
              <div><strong>{property.baths}</strong> Baths</div>
            </div>
            <div className={styles.featureItem}>
              <Maximize size={24} color="var(--accent-color)" />
              <div><strong>{property.sqft}</strong> sqft</div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>About this Property</h3>
            <p className={styles.description}>
              Experience modern Indian living at its finest in this stunning {property.type}. Featuring superior architecture, expansive living spaces, and top-of-the-line interior finishes. The design seamlessly blends indoor and outdoor living, providing the perfect sanctuary in {property.location}.
            </p>
          </div>

          <div className={styles.section}>
            <h3>Amenities</h3>
            <div className={styles.amenitiesGrid}>
              {amenities.map((item, i) => (
                <div key={i} className={styles.amenityItem}>
                  <CheckCircle2 size={18} color="var(--success)" /> {item}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className={styles.sidebar}
        >
          <div className={`${styles.ownerCard} glass`}>
            <h3>Owner Information</h3>
            <div className={styles.ownerProfile}>
              <div className={styles.ownerAvatar}>SP</div>
              <div>
                <h4>Siddharth Patel</h4>
                <p>Verified Owner</p>
              </div>
            </div>
            <div className={styles.contactActions}>
              <button className={`${styles.contactBtn} ${styles.primaryBtn}`}>
                <Phone size={18} /> Call Owner
              </button>
              <button className={`${styles.contactBtn} ${styles.secondaryBtn}`}>
                <Mail size={18} /> Send Message
              </button>
            </div>
          </div>

          {/* New Scheduling Module */}
          <div className={`${styles.actionModule} glass`}>
            <h3><Calendar size={20} color="var(--accent-color)" /> Schedule a Free Visit</h3>
            <p className={styles.subtext}>Pick a date and time to physically inspect the property before committing.</p>
            <input 
              type="datetime-local" 
              className={styles.datePicker} 
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
            />
            <button 
              className={`${styles.contactBtn} ${styles.primaryBtn}`} 
              style={{marginTop: '1rem'}}
              onClick={handleSchedule}
              disabled={!scheduleDate}
            >
              {scheduleSuccess ? "Schedule Confirmed!" : "Confirm Schedule"}
            </button>
            {scheduleSuccess && <p style={{color: 'var(--success)', marginTop: '0.5rem', fontSize: '0.85rem'}}>Added to your schedules!</p>}
          </div>

          {/* New Checkout/Booking Module */}
          <div className={`${styles.actionModule} glass`}>
            <h3><CreditCard size={20} color="var(--success)" /> Reserve Property</h3>
            <p className={styles.subtext}>Pay a <strong>{tokenPercentage}%</strong> token amount to lock this property and prevent others from booking.</p>
            <div className={styles.tokenBox}>
              <span className={styles.tokenLabel}>Token Amount</span>
              <span className={styles.tokenValue}>{formattedToken}</span>
            </div>
            <button className={`${styles.contactBtn}`} style={{background: 'var(--success)', color: '#fff', border: 'none', marginTop: '1rem'}}>
              Pay Token Now
            </button>
          </div>
        </motion.div>
      </div>

      {galleryOpen && (
        <FullScreenGallery 
          images={property.localImages || property.images}
          fallbackImages={property.images}
          initialIndex={initGalleryIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default PropertyDetail;
