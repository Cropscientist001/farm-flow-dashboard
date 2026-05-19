import dynamic from 'next/dynamic';

// Dynamically import the map to avoid SSR 'window is not defined' errors
const RadarMap = dynamic(() => import('./RadarMap'), {
  ssr: false,
  loading: () => (
    <div className="glass-panel" style={{ height: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <p style={{ color: 'var(--accent-color)' }}>Loading Radar Data...</p>
    </div>
  ),
});

export default function StormRadar(props: { lat: number; lon: number }) {
  return <RadarMap {...props} />;
}
