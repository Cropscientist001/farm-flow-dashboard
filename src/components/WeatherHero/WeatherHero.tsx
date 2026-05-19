import { getWeatherIcon, getWeatherDescription } from '../../utils/weatherApi';
import styles from './WeatherHero.module.css';

interface WeatherHeroProps {
  location?: { city: string; country: string } | null;
  current: any;
}

export default function WeatherHero({ current }: WeatherHeroProps) {
  if (!current) return null;

  const desc = getWeatherDescription(current.condition);
  const icon = getWeatherIcon(current.condition, current.isDay);

  return (
    <div className={`glass-panel animate-fade-in ${styles.heroContainer}`}>
      <div className={styles.mainInfo}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.temperature}>
          {Math.round(current.temperature)}&deg;F
        </div>
      </div>
      <div className={styles.details}>
        <p className={styles.description}>{desc}</p>
        <p>Feels like {Math.round(current.feelsLike)}&deg;F</p>
      </div>
    </div>
  );
}
