import React, { useState } from 'react';
import { Building2, Search, SlidersHorizontal, Heart, MessageCircle, User, ChevronDown, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useUi } from '../context/UiContext';
import styles from './Header.module.css';

const Header = ({ 
  showSearch = true, 
  activeFilter = 'All', 
  setActiveFilter, 
  onSearch 
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { wishlist } = useUser();
  const { toggleChat } = useUi();
  const FILTERS = ['All', 'Rent', 'Sale', 'PG', 'Lease'];

  return (
    <nav className={`${styles.navbar} glass`}>
      <div className={styles.brand} style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
        <Building2 color="var(--accent-color)" /> Luxe
      </div>
      
      {showSearch && (
        <>
          <div className={styles.searchBar}>
            <Search size={18} color="var(--text-secondary)" />
            <input 
              type="text" 
              placeholder="Search Indian cities, localities..." 
              className={styles.searchInput} 
              onChange={(e) => onSearch?.(e.target.value)} 
            />
          </div>

          <div className={styles.filtersWrapper}>
            <SlidersHorizontal size={18} color="var(--text-secondary)" className={styles.filterIcon} />
            <div className={styles.filters}>
              {FILTERS.map(f => (
                <button 
                  key={f} 
                  className={`${styles.filterBtn} ${activeFilter === f ? styles.filterBtnActive : ''}`}
                  onClick={() => setActiveFilter?.(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {!showSearch && <div style={{flex: 1}}></div>}

      <div className={styles.actions}>
        <button className={styles.iconBtn} title="Home" onClick={() => navigate('/home')}>
          <Home size={20} />
        </button>
        <button className={styles.iconBtn} title="Wishlist" onClick={() => navigate('/wishlist')} style={{ position: 'relative' }}>
          <Heart size={20} />
          {wishlist.length > 0 && (
            <span style={{
              position: 'absolute',
              top: '-5px',
              right: '-5px',
              background: 'var(--accent-color)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 'bold',
              width: '16px',
              height: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%'
            }}>
              {wishlist.length}
            </span>
          )}
        </button>
        <button className={styles.iconBtn} title="Communicated Messages" onClick={toggleChat}>
          <MessageCircle size={20} />
        </button>
        
        <div className={styles.profileContainer}>
          <button 
            className={styles.profileBtn} 
            onClick={() => setDropdownOpen(!dropdownOpen)}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
          >
            <User size={20} />
            <ChevronDown size={14} />
          </button>
          
          {dropdownOpen && (
            <div className={styles.dropdownMenu} onMouseDown={(e) => e.preventDefault()}>
              <button className={styles.dropdownItem} onClick={() => navigate('/signup')}>Sign Up</button>
              <button className={styles.dropdownItem} onClick={() => navigate('/wishlist')}>Your Wishlist</button>
              <button className={styles.dropdownItem}>Visited Properties</button>
              <button className={styles.dropdownItem} onClick={() => navigate('/schedules')}>Schedules</button>
              <button className={styles.dropdownItem}>Advertise</button>
              <div className={styles.dropdownDivider}></div>
              <button className={`${styles.dropdownItem} ${styles.highlightItem}`}>List Your Property</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
