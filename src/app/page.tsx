'use client';

import { useWeather } from '../hooks/useWeather';
import DashboardHeader from '../components/DashboardHeader/DashboardHeader';
import SearchBar from '../components/SearchBar/SearchBar';
import WeatherHero from '../components/WeatherHero/WeatherHero';
import HourlyForecast from '../components/HourlyForecast/HourlyForecast';
import DailyForecast from '../components/DailyForecast/DailyForecast';
import StormRadar from '../components/StormRadar/StormRadar';
import WeatherDetails from '../components/WeatherDetails/WeatherDetails';
import styles from './page.module.css';

export default function Home() {
  const { weather, location, loading, error, handleSearch } = useWeather();

  if (loading) {
    return (
      <main className={styles.main} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <div className={styles.spinner}></div>
          <h2 style={{ marginTop: '1rem' }}>Initializing AI Core...</h2>
        </div>
      </main>
    );
  }

  if (error && !weather) {
    return (
      <main className={styles.main} style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="glass-panel animate-fade-in" style={{ padding: '3rem', textAlign: 'center' }}>
          <h2>System Error</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <DashboardHeader location={location} />
      
      {error && (
        <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
          <p>{error}</p>
        </div>
      )}

      <div className={styles.dashboardGrid}>
        <div className={styles.columnLeft}>
          <SearchBar onSearch={handleSearch} loading={loading} />
          <WeatherHero current={weather?.current} />
          <WeatherDetails current={weather?.current} daily={weather?.daily} />
          <HourlyForecast hourly={weather?.hourly} />
          <DailyForecast daily={weather?.daily} />
        </div>
        <div className={styles.columnRight}>
          {location?.lat && location?.lon && (
            <StormRadar lat={location.lat} lon={location.lon} />
          )}
        </div>
      </div>
    </main>
  );
}
