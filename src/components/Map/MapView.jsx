import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useReports } from '../../contexts/ReportContext';
import ReportPopup from './ReportPopup';

// Mapbox token (optional - will use demo mode if not provided)
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN || 'pk.eyJ1IjoiZGVtbyIsImEiOiJjbGV2ZXJkZW1vIn0.demo';

// Bengaluru coordinates
const BENGALURU_CENTER = [77.5946, 12.9716];

const MapView = ({ onMapClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const { reports } = useReports();
  const [selectedReport, setSelectedReport] = useState(null);

  // Category colors
  const categoryColors = {
    pothole: '#ef4444',
    garbage: '#f59e0b',
    streetlight: '#3b82f6',
    water_leak: '#06b6d4',
    drainage: '#8b5cf6',
    road_damage: '#ec4899',
  };

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    // Set mapbox token
    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: BENGALURU_CENTER,
      zoom: 11,
      attributionControl: false,
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add geolocate control
    const geolocate = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    });
    map.current.addControl(geolocate, 'top-right');

    // Handle map clicks
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      if (onMapClick) {
        onMapClick({ lng, lat });
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'clusters', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'clusters', () => {
      map.current.getCanvas().style.cursor = '';
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onMapClick]);

  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markers.current.forEach((marker) => marker.remove());
    markers.current = [];

    // Add markers for each report
    reports.forEach((report) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = categoryColors[report.category] || '#6b7280';
      el.style.border = '3px solid white';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';

      // Pulse animation for pending reports
      if (report.status === 'pending') {
        el.style.animation = 'pulse 2s infinite';
      }

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      const marker = new mapboxgl.Marker(el)
        .setLngLat([report.location.lng, report.location.lat])
        .addTo(map.current);

      // Add click handler
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setSelectedReport(report);
      });

      markers.current.push(marker);
    });
  }, [reports]);

  return (
    <>
      <div ref={mapContainer} className="w-full h-full" />
      
      {/* Report Popup */}
      {selectedReport && (
        <ReportPopup
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 z-10">
        <h4 className="text-xs font-semibold text-gray-900 dark:text-white mb-2">
          Issue Types
        </h4>
        <div className="space-y-1">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 capitalize">
                {category.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default MapView;
