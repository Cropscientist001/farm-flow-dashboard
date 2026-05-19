import { getWeatherIcon } from '../../utils/weatherApi';
import styles from './HourlyForecast.module.css';

interface HourlyForecastProps {
  hourly: any;
}

export default function HourlyForecast({ hourly }: HourlyForecastProps) {
  if (!hourly) return null;

  // Find current hour index to show next 24 hours
  const now = new Date();
  const currentHourString = now.toISOString().slice(0, 14) + '00';
  let startIndex = hourly.time.findIndex((t: string) => t >= currentHourString);
  if (startIndex === -1) startIndex = 0;
  
  const next24Hours = hourly.time.slice(startIndex, startIndex + 24).map((time: string, i: number) => ({
    time,
    temp: hourly.temperature[startIndex + i],
    condition: hourly.condition[startIndex + i]
  }));

  const formatTime = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`glass-panel animate-fade-in ${styles.container}`} style={{ animationDelay: '0.1s' }}>
      <h3 className={styles.title}>Hourly Forecast</h3>
      <div className={styles.scrollArea}>
        {next24Hours.map((hour: any, idx: number) => (
          <div key={idx} className={styles.hourCard}>
            <span className={styles.time}>{idx === 0 ? 'Now' : formatTime(hour.time)}</span>
            <span className={styles.icon}>{getWeatherIcon(hour.condition, 1)}</span>
            <span className={styles.temp}>{Math.round(hour.temp)}&deg;F</span>
          </div>
        ))}
      </div>
    </div>
  );
}
