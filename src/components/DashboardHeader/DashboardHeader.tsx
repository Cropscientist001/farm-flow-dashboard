import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './DashboardHeader.module.css';

interface DashboardHeaderProps {
  location: { city: string; country: string } | null;
}

export default function DashboardHeader({ location }: DashboardHeaderProps) {
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={`glass-panel ${styles.header}`}>
      <div className={styles.brand}>
        <Image src="/logo.png" alt="Farm Flow Logo" width={150} height={150} className={styles.logoImage} />
        <div className={styles.brandText}>
          <h1 className={styles.title}>FARM FLOW</h1>
          <span className={styles.subtitle}>PREDICTIVE AI PLATFORM</span>
          <span className={styles.tagline}>See What's Coming Next</span>
        </div>
      </div>
      <div className={styles.rightControls}>
        <div className={styles.clockInfo}>
          <span className={styles.clockIcon}>🕒</span>
          <div className={styles.clockText}>
            <span className={styles.timeString}>
              {time ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}
            </span>
            <span className={styles.dateString}>
              {time ? time.toLocaleDateString(undefined, { weekday: 'long', month: '2-digit', day: '2-digit', year: 'numeric' }) : '--/--/----'}
            </span>
          </div>
        </div>
        <div className={styles.locationInfo}>
          <span className={styles.locationIcon}>📍</span>
          <div className={styles.locationText}>
            <span className={styles.city}>{location?.city || 'Detecting Area...'}</span>
            <span className={styles.country}>{location?.country}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
