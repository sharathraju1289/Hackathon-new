import React, { useState, useEffect } from 'react';
import { generateProperties } from '../utils/dummyData';
import PropertyCard from './PropertyCard';
import Header from './Header';
import styles from './Home.module.css';
import { motion } from 'framer-motion';

const Home = () => {
  const [properties, setProperties] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setProperties(generateProperties(100));
  }, []);

  const filteredProperties = properties.filter(p => {
    const matchType = activeFilter === 'All' || p.type === activeFilter;
    const matchSearch = p.location.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <div className={styles.container}>
      <Header 
        showSearch={true} 
        activeFilter={activeFilter} 
        setActiveFilter={setActiveFilter}
        onSearch={setSearchQuery} 
      />

      <main className={styles.main}>
        <header className={styles.header}>
          <h2>Explore Properties</h2>
          <p>Showing {filteredProperties.length} results</p>
        </header>

        <div className={styles.grid}>
          {filteredProperties.map((prop, idx) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 10) * 0.05, duration: 0.4 }}
            >
              <PropertyCard property={prop} />
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
