import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { generateProperties } from '../utils/dummyData';
import PropertyCard from './PropertyCard';
import Header from './Header';
import { motion } from 'framer-motion';
import { Trash2, Calendar } from 'lucide-react';

const Wishlist = () => {
  const { wishlist, toggleWishlist, addSchedule } = useUser();
  const navigate = useNavigate();
  const [schedulingId, setSchedulingId] = useState(null);
  const [scheduleDate, setScheduleDate] = useState('');

  const handleConfirmSchedule = (propId) => {
    if (!scheduleDate) return;
    addSchedule(propId, scheduleDate);
    setSchedulingId(null);
    setScheduleDate('');
  };

  const wishlistedProperties = useMemo(() => {
    // Generate the same dataset and filter based on wishlist
    const allProps = generateProperties(100);
    return allProps.filter(p => wishlist.includes(p.id));
  }, [wishlist]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      <Header showSearch={false} />
      
      <main style={{ padding: '2rem 5%', maxWidth: '1440px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', marginTop: '6rem' }}>
          <h2>Your Wishlist</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You have {wishlistedProperties.length} saved properties.</p>
        </header>

        {wishlistedProperties.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {wishlistedProperties.map((prop, idx) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (idx % 10) * 0.05, duration: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}
              >
                <PropertyCard property={prop} />
                
                {schedulingId === prop.id ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                    <input 
                      type="datetime-local" 
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      style={{ 
                        padding: '0.8rem', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255,255,255,0.2)', 
                        background: 'rgba(0,0,0,0.3)', 
                        color: '#fff', 
                        colorScheme: 'dark',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }} 
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => { setSchedulingId(null); setScheduleDate(''); }}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'transparent', border: '1px solid var(--text-secondary)', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleConfirmSchedule(prop.id)}
                        style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--success)', border: 'none', color: '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s' }}
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                    <button 
                      onClick={() => toggleWishlist(prop.id)}
                      style={{ 
                        flex: 1, 
                        padding: '0.8rem', 
                        background: 'rgba(239, 68, 68, 0.1)', 
                        border: '1px solid var(--danger)', 
                        color: 'var(--danger)', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--danger)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                    >
                      <Trash2 size={16} /> Remove
                    </button>

                    <button 
                      onClick={() => setSchedulingId(prop.id)}
                      style={{ 
                        flex: 1, 
                        padding: '0.8rem', 
                        background: 'var(--accent-color)', 
                        border: 'none', 
                        color: '#fff', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.4rem',
                        fontWeight: 600,
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent-hover)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'var(--accent-color)'}
                    >
                      <Calendar size={16} /> Schedule Visit
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <p>Your wishlist is currently empty. Start exploring properties to save them here!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Wishlist;
