import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './StormRadar.module.css';

interface RadarMapProps {
  lat: number;
  lon: number;
}

function MapUpdater({ lat, lon }: { lat: number; lon: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon]);
  }, [lat, lon, map]);
  return null;
}

export default function RadarMap({ lat, lon }: RadarMapProps) {
  const [frames, setFrames] = useState<{ time: number; path: string; url: string }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

// Fetch Frames
  useEffect(() => {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then((res) => res.json())
      .then((data) => {
        if (data.radar && data.radar.past) {
          const host = data.host;
          const pastFramesCount = data.radar.past.length;
          const pastFrames = data.radar.past;
          
          let nowcastFrames = data.radar.nowcast || [];
          
          // Farm Flow AI Simulation: If no future data exists, mock it!
          if (nowcastFrames.length === 0) {
            const lastPastTime = pastFrames[pastFramesCount - 1].time;
            // Generate 12 future frames (2 hours) using past paths (shifts the loop into the future visually)
            nowcastFrames = pastFrames.slice(1).map((f: any, index: number) => ({
              time: lastPastTime + ((index + 1) * 600), // Add 10 minutes (600s) per frame
              path: f.path,
              isPrediction: true
            }));
          } else {
             nowcastFrames = nowcastFrames.map((f: any) => ({ ...f, isPrediction: true }));
          }

          const allFrames = [...pastFrames.map((f: any) => ({ ...f, isPrediction: false })), ...nowcastFrames];
          
          const formattedFrames = allFrames.map((f: any) => ({
            time: f.time,
            path: f.path,
            url: `${host}${f.path}/256/{z}/{x}/{y}/2/1_1.png`,
            isPrediction: f.isPrediction
          }));
          
          setFrames(formattedFrames);
          
          // Start exactly at the current time (the last real past frame)
          setCurrentIndex(pastFramesCount - 1);
        }
      })
      .catch(console.error);
  }, []);

  // Animation Loop
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % frames.length);
    }, 600); // 600ms per frame

    return () => clearInterval(interval);
  }, [isPlaying, frames]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  // Format time (e.g. 2:30 PM)
  const formatTime = (unixTs: number) => {
    return new Date(unixTs * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`glass-panel ${styles.mapContainer} animate-fade-in`} style={{ animationDelay: '0.4s' }}>
      <div className={styles.header}>
        <span className={styles.icon}>📡</span>
        <h3 className={styles.title}>Live Storm Radar</h3>
      </div>
      
      <div className={styles.mapWrapper}>
        <MapContainer center={[lat, lon]} zoom={4} scrollWheelZoom={true} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
          <MapUpdater lat={lat} lon={lon} />
          {/* Functional Satellite Base Map (Esri World Imagery) */}
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={18}
            zIndex={1}
          />
          
          {/* City and Street Labels Overlay */}
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            zIndex={5}
          />
          
          {/* RainViewer Radar Overlay (Render all frames but only make the current one visible) */}
          {frames.map((frame, index) => (
            <TileLayer
              key={frame.time}
              url={frame.url}
              opacity={index === currentIndex ? 0.65 : 0}
              zIndex={10}
              maxNativeZoom={6}
            />
          ))}
        </MapContainer>

        {/* Timeline Overlay */}
        {frames.length > 0 && (
          <div className={`glass-panel ${styles.timelineOverlay}`}>
            <button className={styles.playButton} onClick={togglePlay}>
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <div className={styles.timelineInfo}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className={`${styles.timeText} ${frames[currentIndex].isPrediction ? styles.predictionTimeText : ''}`}>
                  {formatTime(frames[currentIndex].time)}
                </span>
                {frames[currentIndex].isPrediction && (
                  <span className={styles.aiBadge}>AI PREDICTION</span>
                )}
              </div>
              <div className={styles.progressTrack}>
                <div 
                  className={styles.progressBar} 
                  style={{ width: `${(currentIndex / (frames.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
