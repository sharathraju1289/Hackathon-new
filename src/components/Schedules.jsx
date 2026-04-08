import React, { useMemo } from 'react';
import { useUser } from '../context/UserContext';
import { generateProperties } from '../utils/dummyData';
import Header from './Header';
import { Calendar, MapPin, Clock, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Schedules = () => {
  const { schedules, removeSchedule } = useUser();

  const scheduledProperties = useMemo(() => {
    const allProps = generateProperties(100);
    return schedules.map(schedule => {
      const prop = allProps.find(p => p.id === schedule.propertyId);
      return { ...prop, scheduledDatetime: schedule.datetime };
    }).filter(p => p.id); // Filter out any broken links
  }, [schedules]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
      <Header showSearch={false} />
      
      <main style={{ padding: '2rem 5%', maxWidth: '1440px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', marginTop: '6rem' }}>
          <h2>Your Scheduled Visits</h2>
          <p style={{ color: 'var(--text-secondary)' }}>You have {scheduledProperties.length} upcoming property visits.</p>
        </header>

        {scheduledProperties.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {scheduledProperties.map((prop, idx) => {
              const dateObj = new Date(prop.scheduledDatetime);
              const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
              const formattedTime = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

              return (
                <motion.div
                  key={prop.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.4 }}
                  className="glass"
                  style={{ 
                    display: 'flex', 
                    gap: '1.5rem', 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}
                >
                  <img 
                    src={prop.localImage || prop.image} 
                    alt={prop.title} 
                    loading="lazy"
                    decoding="async"
                    onError={(e) => { if (prop.image && e.currentTarget.src !== prop.image) e.currentTarget.src = prop.image; }}
                    style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '12px' }} 
                  />
                  
                  <div style={{ flex: 1, minWidth: '250px' }}>
                    <span style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '0.8rem', 
                      color: 'var(--accent-color)' 
                    }}>
                      {prop.type}
                    </span>
                    <h3 style={{ margin: '0.5rem 0' }}>{prop.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 0 0.5rem 0' }}>
                      <MapPin size={16} /> {prop.location}
                    </p>
                    <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{prop.price}</div>
                  </div>

                  <div style={{ 
                    background: 'rgba(255,255,255,0.05)', 
                    padding: '1rem', 
                    borderRadius: '12px', 
                    minWidth: '250px' 
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Calendar size={18} color="var(--accent-color)" /> 
                      <strong>{formattedDate}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
                      <Clock size={18} /> 
                      <span>{formattedTime}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeSchedule(prop.id)}
                    style={{
                      background: 'rgba(255, 75, 75, 0.1)',
                      color: 'var(--danger)',
                      border: '1px solid rgba(255, 75, 75, 0.3)',
                      padding: '0.8rem',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                    title="Cancel Visit"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
            <p>You have no scheduled visits at the moment.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Schedules;
