import React, { useState } from 'react';
import { Heart, Bed, Bath, Maximize, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';
import styles from './PropertyCard.module.css';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useUser();
  const isWishlisted = wishlist.includes(property.id);

  const handleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(property.id);
  };

  const handleEnquiry = (e) => {
    e.stopPropagation();
    navigate(`/property/${property.id}`);
  };

  return (
    <motion.div 
      className={`${styles.card} glass`} 
      onClick={handleEnquiry}
      whileHover={{ scale: 1.03, rotateY: 3, rotateX: 3, elevation: 5 }}
      transition={{ type: "spring", stiffness: 300 }}
      style={{ perspective: 1000, transformStyle: "preserve-3d" }}
    >
      <div className={styles.imageWrapper}>
        <img
          src={property.localImage || property.image}
          alt={property.title}
          className={styles.image}
          loading="lazy"
          decoding="async"
          onError={(e) => {
            if (property.image && e.currentTarget.src !== property.image) e.currentTarget.src = property.image;
          }}
        />
        <button className={styles.wishlistBtn} onClick={handleWishlist}>
          <Heart size={18} fill={isWishlisted ? "var(--danger)" : "none"} color={isWishlisted ? "var(--danger)" : "#fff"} />
        </button>
      </div>

      <div className={styles.content}>
        <span className={styles.typeBadge}>{property.type}</span>
        <div className={styles.price}>{property.price}</div>
        <div className={styles.title}>{property.title}</div>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <Bed size={14} /> {property.beds}
          </div>
          <div className={styles.feature}>
            <Bath size={14} /> {property.baths}
          </div>
          <div className={styles.feature}>
            <Maximize size={14} /> {property.sqft} sqft
          </div>
        </div>

        <button className={styles.enquiryBtn} onClick={handleEnquiry}>
          <Info size={16} style={{ verticalAlign: 'middle', marginRight: 8 }} />
          Enquiry / View Details
        </button>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
