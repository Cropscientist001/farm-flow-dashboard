import styles from './WeatherDetails.module.css';

interface WeatherDetailsProps {
  current: any;
  daily: any;
}

export default function WeatherDetails({ current, daily }: WeatherDetailsProps) {
  if (!current || !daily) return null;

  const uvIndex = daily.uvIndex && daily.uvIndex[0];
  const sunrise = daily.sunrise && new Date(daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const sunset = daily.sunset && new Date(daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={`animate-fade-in ${styles.grid}`} style={{ animationDelay: '0.3s' }}>
      <div className={`glass-panel ${styles.card}`}>
        <span className={styles.icon}>💧</span>
        <div className={styles.info}>
          <span className={styles.label}>Humidity</span>
          <span className={styles.value}>{current.humidity}%</span>
        </div>
      </div>
      <div className={`glass-panel ${styles.card}`}>
        <span className={styles.icon}>💨</span>
        <div className={styles.info}>
          <span className={styles.label}>Wind Speed</span>
          <span className={styles.value}>{current.windSpeed} mph</span>
        </div>
      </div>
      <div className={`glass-panel ${styles.card}`}>
        <span className={styles.icon}>☀️</span>
        <div className={styles.info}>
          <span className={styles.label}>UV Index</span>
          <span className={styles.value}>{uvIndex || 'N/A'}</span>
        </div>
      </div>
      <div className={`glass-panel ${styles.card}`}>
        <span className={styles.icon}>🌅</span>
        <div className={styles.info}>
          <span className={styles.label}>Sunrise / Sunset</span>
          <span className={styles.value} style={{ fontSize: '0.9rem' }}>{sunrise} / {sunset}</span>
        </div>
      </div>
    </div>
  );
}
