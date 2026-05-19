import { getWeatherIcon } from '../../utils/weatherApi';
import styles from './DailyForecast.module.css';

interface DailyForecastProps {
  daily: any;
}

export default function DailyForecast({ daily }: DailyForecastProps) {
  if (!daily) return null;

  const formatDate = (dateStr: string) => {
    // Append T12:00:00 to ensure it parses to noon local time, avoiding timezone offset issues
    const date = new Date(`${dateStr}T12:00:00`);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className={`glass-panel animate-fade-in ${styles.container}`} style={{ animationDelay: '0.2s' }}>
      <h3 className={styles.title}>7-Day Forecast</h3>
      <div className={styles.list}>
        {daily.time.map((time: string, idx: number) => (
          <div key={idx} className={styles.dayRow}>
            <span className={styles.dayName}>{idx === 0 ? 'Today' : formatDate(time)}</span>
            <div className={styles.iconAndCondition}>
              <span className={styles.icon}>{getWeatherIcon(daily.condition[idx], 1)}</span>
            </div>
            <div className={styles.temps}>
              <span className={styles.minTemp}>{Math.round(daily.minTemp[idx])}&deg;F</span>
              <div className={styles.tempBar}>
                <div className={styles.tempBarFill} />
              </div>
              <span className={styles.maxTemp}>{Math.round(daily.maxTemp[idx])}&deg;F</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
