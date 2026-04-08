import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './FullScreenGallery.module.css';

const FullScreenGallery = ({ images, fallbackImages, initialIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <button className={styles.closeBtn} onClick={onClose} title="Close (Esc)">
          <X size={36} />
        </button>

        <div className={styles.counter}>
          {currentIndex + 1} / {images.length}
        </div>

        <button className={`${styles.navBtn} ${styles.leftBtn}`} onClick={(e) => { e.stopPropagation(); prevSlide(); }}>
          <ChevronLeft size={48} />
        </button>

        <div className={styles.imageContainer}>
          <motion.img 
            key={currentIndex}
            src={images[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className={styles.mainImage}
            loading="lazy"
            decoding="async"
            onError={(e) => {
              const fb = fallbackImages && fallbackImages[currentIndex];
              if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <button className={`${styles.navBtn} ${styles.rightBtn}`} onClick={(e) => { e.stopPropagation(); nextSlide(); }}>
          <ChevronRight size={48} />
        </button>
        
        <div className={styles.thumbnails}>
          {images.map((img, idx) => (
            <div 
              key={idx}
              className={`${styles.thumbWrapper} ${idx === currentIndex ? styles.thumbActive : ''}`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img src={img} alt={`thumb ${idx}`} className={styles.thumbImg} loading="lazy" decoding="async" onError={(e) => {
                const fb = fallbackImages && fallbackImages[idx];
                if (fb && e.currentTarget.src !== fb) e.currentTarget.src = fb;
              }} />
            </div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FullScreenGallery;
