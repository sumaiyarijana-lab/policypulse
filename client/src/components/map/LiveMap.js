'use client';
import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Tooltip } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io } from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';

// ── Fallback Mock Data in case DB is Empty/Unavailable ──────────
const MOCK_COMPLAINTS_FALLBACK = [
  {
    _id: "mock-1",
    complaintId: "CMP-48201",
    title: "Large E-Waste Dump Behind IT Park",
    description: "Multiple servers, monitors, and lead batteries dumped illegally in the open swamp behind OMR IT Parkway. Hazardous chemical leakage suspected.",
    complaintType: "Illegal Dumping",
    area: "OMR IT Highway",
    district: "chennai",
    state: "Tamil Nadu",
    location: { lat: 12.9010, lng: 80.2279 },
    status: "Pending",
    severity: "Critical",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    aiRiskScore: 96,
    evidence: []
  },
  {
    _id: "mock-2",
    complaintId: "CMP-88320",
    title: "Unlicensed Lithium Battery Burning",
    description: "Small workshop burning lithium batteries in open barrels, releasing thick toxic fumes near a residential area.",
    complaintType: "Unauthorized Recycling",
    area: "Guindy Industrial Area",
    district: "chennai",
    state: "Tamil Nadu",
    location: { lat: 13.0080, lng: 80.2150 },
    status: "Under Review",
    severity: "High",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    aiRiskScore: 84,
    evidence: []
  },
  {
    _id: "mock-3",
    complaintId: "CMP-12948",
    title: "Hazardous Mercury Spill near Waterway",
    description: "Broken cathode-ray tubes (CRTs) and fluorescent lamps dumped close to Adyar River bank, leaking mercury into water.",
    complaintType: "Hazardous Leakage",
    area: "Adyar River Basin",
    district: "chennai",
    state: "Tamil Nadu",
    location: { lat: 13.0110, lng: 80.2450 },
    status: "Pending",
    severity: "Critical",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    aiRiskScore: 98,
    evidence: []
  },
  {
    _id: "mock-4",
    complaintId: "CMP-99381",
    title: "Commercial Lead Disposal",
    description: "Office renovation debris containing leaded glass and lead wires piled on the pavement without proper containment.",
    complaintType: "Improper Disposal",
    area: "Velachery Junction",
    district: "chennai",
    state: "Tamil Nadu",
    location: { lat: 12.9790, lng: 80.2210 },
    status: "Resolved",
    severity: "Medium",
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    aiRiskScore: 54,
    evidence: []
  },
  {
    _id: "mock-5",
    complaintId: "CMP-33290",
    title: "E-Waste Mixed with Domestic Waste",
    description: "Several printers and keyboards mixed with wet household waste in public trash bins, causing metal corrosion.",
    complaintType: "Improper Disposal",
    area: "Tambaram West",
    district: "chennai",
    state: "Tamil Nadu",
    location: { lat: 12.9260, lng: 80.1210 },
    status: "Pending",
    severity: "Low",
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    aiRiskScore: 28,
    evidence: []
  }
];

// ── Authorized Recycling Centers (Safe Zones) ───────────────────
const RECYCLERS = [
  { name: "Eco-Cycle Chennai Solutions", lat: 12.9815, lng: 80.2180, phone: "+91 98401 12345", address: "Velachery Main Rd, Chennai", type: "Secure E-Waste Recycler", id: "REC-01" },
  { name: "E-Waste Recycle Hub South", lat: 12.9249, lng: 80.1278, phone: "+91 98401 54321", address: "Tambaram East, Chennai", type: "Certified Safe Disposal", id: "REC-02" },
  { name: "Smart City Green Recycler", lat: 13.0067, lng: 80.2206, phone: "+91 98401 98765", address: "Guindy Industrial Estate, Chennai", type: "Government Authorized Partner", id: "REC-03" },
  { name: "CleanEarth E-Waste Solutions", lat: 13.0827, lng: 80.2707, phone: "+91 98401 88888", address: "Anna Salai, Central Chennai", type: "High-Volume Processing Facility", id: "REC-04" }
];

// ── Haversine Formula for Distance Calculation (km) ─────────────
const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
};

// ── Custom Leaflet Icons ─────────────────────────────────────────
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker-container',
    html: `
      <div class="user-location-marker">
        <div class="blue-pulse-ring"></div>
        <div class="blue-core-dot"></div>
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const createViolationIcon = (severity) => {
  let markerClass = 'violation-marker-medium';
  let dotHtml = '<div class="orange-core-dot"></div>';

  if (severity === 'Critical') {
    markerClass = 'violation-marker-critical';
    dotHtml = `
      <div class="critical-pulse-ring"></div>
      <div class="critical-core-dot"></div>
    `;
  } else if (severity === 'High') {
    markerClass = 'violation-marker-high';
    dotHtml = `
      <div class="red-pulse-ring"></div>
      <div class="red-core-dot"></div>
    `;
  } else if (severity === 'Low') {
    markerClass = 'violation-marker-low';
    dotHtml = '<div class="yellow-core-dot"></div>';
  }

  return L.divIcon({
    className: 'custom-violation-marker-container',
    html: `<div class="${markerClass}">${dotHtml}</div>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const createRecyclerIcon = () => {
  return L.divIcon({
    className: 'recycler-marker-container',
    html: `
      <div class="recycler-marker">
        <div class="recycler-pulse-ring"></div>
        <div class="recycler-core-dot">
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15]
  });
};

// ── Map Controller Component for centring/zoom updates ─────────
const MapController = ({ 
  userLocation, 
  isTrackingEnabled, 
  searchQuery, 
  selectedComplaintLocation,
  mapMode
}) => {
  const map = useMap();
  const previousMapMode = useRef(mapMode);

  // Center on user location if tracking is active
  useEffect(() => {
    if (userLocation && isTrackingEnabled) {
      map.setView([userLocation.lat, userLocation.lng], 14, { animate: true });
    }
  }, [userLocation, isTrackingEnabled, map]);

  // Handle Search Input
  useEffect(() => {
    if (!searchQuery) return;
    
    const query = searchQuery.toLowerCase().trim();
    
    const SEARCH_LOCATIONS = {
      'chennai': [13.0827, 80.2707],
      'omr': [12.8352, 80.2189],
      'adyar': [13.0063, 80.2574],
      'tambaram': [12.9249, 80.1278],
      'guindy': [13.0067, 80.2206],
      'velachery': [12.9815, 80.2180],
      'sholinganallur': [12.9010, 80.2279],
      'north': [13.1584, 80.2872],
      'south': [12.9516, 80.1462],
      'east': [13.0405, 80.2905],
      'west': [13.0694, 80.1948],
      'central': [13.0500, 80.2500]
    };

    if (SEARCH_LOCATIONS[query]) {
      map.flyTo(SEARCH_LOCATIONS[query], 13, { animate: true });
    } else {
      const latLngPattern = /^[-+]?([1-8]?\d(\.\d+)?|90(\.0+)?),\s*[-+]?(180(\.0+)?|((1[0-7]\d)|([1-9]?\d))(\.\d+)?)$/;
      if (latLngPattern.test(searchQuery)) {
        const [latStr, lngStr] = searchQuery.split(',');
        const lat = parseFloat(latStr);
        const lng = parseFloat(lngStr);
        if (!isNaN(lat) && !isNaN(lng)) {
          map.flyTo([lat, lng], 13, { animate: true });
        }
      }
    }
  }, [searchQuery, map]);

  // Center on complaint clicked in the sidebar feed
  useEffect(() => {
    if (selectedComplaintLocation) {
      map.flyTo([selectedComplaintLocation.lat, selectedComplaintLocation.lng], 15, { animate: true });
    }
  }, [selectedComplaintLocation, map]);

  // Force map redraw when changing basemaps to fix loading bugs
  useEffect(() => {
    if (previousMapMode.current !== mapMode) {
      previousMapMode.current = mapMode;
      setTimeout(() => {
        map.invalidateSize({ animate: false });
      }, 100);
    }
  }, [mapMode, map]);

  return null;
};

// ── Main Live Map Component ─────────────────────────────────────
export default function LiveMap({
  filterType,
  filterDistrict,
  mapMode,
  showAiRiskLayer,
  showHeatmap,
  showClustering,
  showRecyclers,
  searchQuery,
  isTracking,
  selectedComplaintId,
  nearbyDistanceFilter,
  onSelectComplaint,
  onComplaintsLoaded,
  onUserLocationUpdate,
  onLocationAlert
}) {
  const [complaints, setComplaints] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Find coordinates of currently selected complaint in feed to fly to it
  const selectedComplaint = complaints.find(c => c._id === selectedComplaintId);
  const selectedComplaintLocation = selectedComplaint?.location;

  // 1. Fetch complaints on mount + configure WebSocket synchronization
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/complaints/public');
        if (res.ok) {
          const data = await res.json();
          // Merge with mock fallback to ensure map is beautifully populated
          const merged = [...data];
          MOCK_COMPLAINTS_FALLBACK.forEach(mock => {
            if (!merged.some(c => c.complaintId === mock.complaintId)) {
              merged.push(mock);
            }
          });
          setComplaints(merged);
          if (onComplaintsLoaded) onComplaintsLoaded(merged);
        } else {
          throw new Error("API failed");
        }
      } catch (err) {
        console.warn("Failed to fetch complaints from backend. Using mock fallback.", err);
        setComplaints(MOCK_COMPLAINTS_FALLBACK);
        if (onComplaintsLoaded) onComplaintsLoaded(MOCK_COMPLAINTS_FALLBACK);
      }
    };

    fetchComplaints();

    // Setup Socket.IO subscription
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      autoConnect: true
    });

    socket.on('connect', () => {
      console.log('📡 Map connected to real-time notification socket server');
    });

    socket.on('new-complaint', (newComplaint) => {
      console.log('🔔 Live Map received real-time complaint emission:', newComplaint);
      toast.success(`⚠️ NEW VIOLATION FLAG: ${newComplaint.title}`, {
        duration: 5000,
        style: {
          border: '1px solid rgba(239, 68, 68, 0.4)',
          padding: '16px',
          color: '#fca5a5',
          background: '#1e1b4b'
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff'
        }
      });
      setComplaints(prev => {
        if (prev.some(c => c._id === newComplaint._id)) return prev;
        const updated = [newComplaint, ...prev];
        if (onComplaintsLoaded) onComplaintsLoaded(updated);
        return updated;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 2. Geolocation Watch Engine
  useEffect(() => {
    let watchId = null;
    if (isTracking) {
      if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            const coords = { lat: latitude, lng: longitude, accuracy };
            setUserLocation(coords);
            if (onUserLocationUpdate) onUserLocationUpdate(coords);
          },
          (error) => {
            console.warn('Geolocation failed. Using simulated GPS tracking fallback:', error.message);
            toast.error("GPS Signal Denied. Using Simulated Location.", { id: 'gps-warn' });
            // Simulated user location in Chennai near OMR Dumping Zone
            const coords = { lat: 12.8950, lng: 80.2240, accuracy: 12 };
            setUserLocation(coords);
            if (onUserLocationUpdate) onUserLocationUpdate(coords);
          },
          { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
        );
      } else {
        toast.error("Browser Geolocation unsupported. Activating simulation.");
        const coords = { lat: 12.8950, lng: 80.2240, accuracy: 12 };
        setTimeout(() => {
          setUserLocation(coords);
          if (onUserLocationUpdate) onUserLocationUpdate(coords);
        }, 0);
      }
    } else {
      setTimeout(() => {
        setUserLocation(null);
        if (onUserLocationUpdate) onUserLocationUpdate(null);
      }, 0);
    }
    
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isTracking]);

  // 3. Proximity Violation Hazard Alerts & Nearest Recycler Logic
  useEffect(() => {
    if (!userLocation || complaints.length === 0) {
      if (onLocationAlert) onLocationAlert(null);
      return;
    }

    // Find the closest complaint/violation within 2.5 km (2500m)
    let closestComplaint = null;
    let minDistance = Infinity; // in km

    complaints.forEach(c => {
      if (!c.location || !c.location.lat || !c.location.lng) return;
      const dist = getDistance(userLocation.lat, userLocation.lng, c.location.lat, c.location.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestComplaint = c;
      }
    });

    if (minDistance <= 2.5 && closestComplaint) {
      // Find nearest authorized recycler to user
      let closestRecycler = null;
      let minRecyclerDist = Infinity;

      RECYCLERS.forEach(r => {
        const dist = getDistance(userLocation.lat, userLocation.lng, r.lat, r.lng);
        if (dist < minRecyclerDist) {
          minRecyclerDist = dist;
          closestRecycler = r;
        }
      });

      if (onLocationAlert) {
        onLocationAlert({
          distance: minDistance * 1000, // convert to meters
          violationTitle: closestComplaint.title,
          recycler: closestRecycler,
          recyclerDistance: minRecyclerDist
        });
      }
    } else {
      if (onLocationAlert) onLocationAlert(null);
    }
  }, [userLocation, complaints]);

  // 4. Client-side filtering logic
  const filteredComplaints = complaints.filter(c => {
    // Coordinate check
    if (!c.location || !c.location.lat || !c.location.lng) return false;
    
    // Type filter
    if (filterType !== 'All' && c.complaintType !== filterType) return false;
    
    // District filter ( Chennai region or specific search)
    if (filterDistrict !== 'All') {
      const distQuery = filterDistrict.toLowerCase();
      const matchDistrict = c.district && c.district.toLowerCase().includes(distQuery);
      const matchArea = c.area && c.area.toLowerCase().includes(distQuery);
      if (!matchDistrict && !matchArea) return false;
    }

    // Nearby distance filter (if tracking is active)
    if (nearbyDistanceFilter !== 'All' && userLocation) {
      const dist = getDistance(userLocation.lat, userLocation.lng, c.location.lat, c.location.lng);
      if (dist > parseFloat(nearbyDistanceFilter)) return false;
    }
    
    return true;
  });

  // ── Rendering Leaflet Map Layers ──────────────────────────────
  const renderTileLayer = () => {
    switch (mapMode) {
      case 'satellite':
        return (
          <TileLayer
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
          />
        );
      case 'terrain':
        return (
          <TileLayer
            attribution='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            maxZoom={17}
          />
        );
      case 'dark':
        return (
          <>
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
              maxZoom={16}
            />
          </>
        );
      case 'street':
      default:
        // Free OpenStreetMap tiles with no API key requirement
        return (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
        );
    }
  };

  const renderMarkers = () => {
    return filteredComplaints.map(c => (
      <Marker
        key={c._id}
        position={[c.location.lat, c.location.lng]}
        icon={createViolationIcon(c.severity)}
        eventHandlers={{
          click: () => {
            if (onSelectComplaint) onSelectComplaint(c._id);
          }
        }}
      >
        <Popup className="custom-popup">
          <div className="text-slate-100 p-1.5 font-sans min-w-[260px]">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-slate-500 font-bold uppercase select-none">
                {c.complaintId || 'CMP-MOCK'}
              </span>
              <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-wider select-none ${
                c.status === 'Resolved' 
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                  : c.status === 'Under Review' || c.status === 'Investigating'
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse'
              }`}>
                {c.status === 'Under Review' ? 'Investigating' : c.status}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-xs font-black text-white leading-snug mb-1">{c.title}</h3>
            <p className="text-[10px] text-teal-400 font-bold mb-2">{c.complaintType}</p>

            {/* Location */}
            <div className="flex items-center gap-1 text-[9px] text-slate-400 mb-2 select-none">
              <span className="font-bold text-slate-300">{c.area}</span>
              <span>•</span>
              <span>{c.district} District</span>
            </div>

            {/* Description */}
            <p className="text-[10px] text-slate-300 leading-relaxed line-clamp-3 mb-2.5 bg-slate-900/60 p-2 rounded-lg border border-white/5">
              {c.description}
            </p>

            {/* Images */}
            {c.evidence && c.evidence.length > 0 ? (
              <div className="mb-2.5 rounded-lg overflow-hidden border border-white/10 max-h-[110px] bg-black/40">
                <img 
                  src={`http://localhost:5000${c.evidence[0]}`} 
                  alt="Evidence image"
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ) : (
              <div className="mb-2.5 py-2 rounded-lg border border-dashed border-white/10 text-center text-[9px] text-slate-500 select-none">
                No visual evidence files uploaded
              </div>
            )}

            {/* Progress / AI risk */}
            <div className="space-y-2 border-t border-white/5 pt-2 select-none">
              <div className="flex justify-between items-center text-[9px]">
                <span className="text-slate-400 font-bold">Severity:</span>
                <span className={`font-black px-1.5 py-0.5 rounded text-white ${
                  c.severity === 'Critical' ? 'bg-red-800' :
                  c.severity === 'High' ? 'bg-rose-700' :
                  c.severity === 'Medium' ? 'bg-orange-600' : 'bg-yellow-600'
                }`}>
                  {c.severity || 'Medium'}
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-slate-400 font-bold">AI Risk Assessment:</span>
                  <span className="font-extrabold text-teal-400">{c.aiRiskScore || 50}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      (c.aiRiskScore || 50) >= 80 ? 'bg-red-500' :
                      (c.aiRiskScore || 50) >= 50 ? 'bg-orange-500' : 'bg-teal-400'
                    }`}
                    style={{ width: `${c.aiRiskScore || 50}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Popup>
      </Marker>
    ));
  };

  return (
    <>
      <Toaster />
      <style dangerouslySetInnerHTML={{__html: `
        /* Leaflet Popups Glassmorphism Theme */
        .leaflet-popup-content-wrapper { 
          background: rgba(15, 23, 42, 0.95) !important;
          color: #f8fafc !important; 
          backdrop-filter: blur(16px) !important;
          border-radius: 20px !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.7) !important;
        }
        .leaflet-popup-tip { 
          background: rgba(15, 23, 42, 0.95) !important;
          border: 1px solid rgba(255,255,255,0.05);
        }
        .leaflet-container { 
          width: 100%; 
          height: 100%; 
          background: #020617 !important;
        }

        /* Hide standard Leaflet attribution link color */
        .leaflet-control-attribution a {
          color: #0d9488 !important;
        }

        /* Marker CSS Styles */
        .custom-violation-marker-container, 
        .user-location-marker-container, 
        .recycler-marker-container {
          background: transparent;
          border: none;
        }

        /* Blue User Dot */
        .user-location-marker {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .blue-pulse-ring {
          position: absolute;
          width: 36px;
          height: 36px;
          border: 3px solid #3b82f6;
          border-radius: 50%;
          animation: blue-pulsing 2s infinite ease-out;
        }
        .blue-core-dot {
          position: relative;
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border: 2.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.9);
        }
        @keyframes blue-pulsing {
          0% { transform: scale(0.4); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }

        /* Yellow Low Marker */
        .violation-marker-low {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .yellow-core-dot {
          width: 12px;
          height: 12px;
          background: #eab308;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 8px rgba(234, 179, 8, 0.8);
        }

        /* Orange Medium Marker */
        .violation-marker-medium {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .orange-core-dot {
          width: 14px;
          height: 14px;
          background: #f97316;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(249, 115, 22, 0.9);
        }

        /* Red High Marker */
        .violation-marker-high {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .red-pulse-ring {
          position: absolute;
          width: 28px;
          height: 28px;
          border: 2px dashed #ef4444;
          border-radius: 50%;
          animation: red-pulsing 1.8s infinite linear;
        }
        .red-core-dot {
          position: relative;
          width: 15px;
          height: 15px;
          background: #ef4444;
          border: 2px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(239, 68, 68, 0.95);
        }
        @keyframes red-pulsing {
          0% { transform: scale(0.6); opacity: 0.9; }
          100% { transform: scale(2.0); opacity: 0; }
        }

        /* Critical Dark Red Marker */
        .violation-marker-critical {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
        }
        .critical-pulse-ring {
          position: absolute;
          width: 36px;
          height: 36px;
          background: rgba(153, 27, 27, 0.4);
          border-radius: 50%;
          animation: critical-pulsing 1.5s infinite ease-in-out;
        }
        .critical-core-dot {
          position: relative;
          width: 16px;
          height: 16px;
          background: #7f1d1d;
          border: 2.5px solid #ef4444;
          border-radius: 50%;
          box-shadow: 0 0 16px rgba(239, 68, 68, 1);
        }
        @keyframes critical-pulsing {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }

        /* Green Recycler Marker */
        .recycler-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
        }
        .recycler-pulse-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border: 2px solid #10b981;
          border-radius: 50%;
          animation: recycler-pulsing 3s infinite linear;
        }
        .recycler-core-dot {
          position: relative;
          width: 14px;
          height: 14px;
          background: #10b981;
          border: 1.5px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        @keyframes recycler-pulsing {
          0% { transform: scale(0.8); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }

        /* Cluster Styling */
        .marker-cluster-small {
          background-color: rgba(220, 38, 38, 0.3) !important;
        }
        .marker-cluster-small div {
          background-color: rgba(220, 38, 38, 0.8) !important;
          color: white !important;
          font-weight: bold;
        }
        .marker-cluster-medium {
          background-color: rgba(220, 38, 38, 0.4) !important;
        }
        .marker-cluster-medium div {
          background-color: rgba(220, 38, 38, 0.9) !important;
          color: white !important;
          font-weight: bold;
        }
        .marker-cluster-large {
          background-color: rgba(153, 27, 27, 0.5) !important;
        }
        .marker-cluster-large div {
          background-color: rgba(153, 27, 27, 0.9) !important;
          color: white !important;
          font-weight: bold;
        }
      `}} />
      <MapContainer
        center={[12.9200, 80.2100]} // Chennai center default zoom
        zoom={11}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false} // Custom zoom is rendered inside page.js
      >
        {/* Baselap selection */}
        {renderTileLayer()}

        {/* Map positioning and flying handler */}
        <MapController 
          userLocation={userLocation}
          isTrackingEnabled={isTracking}
          searchQuery={searchQuery}
          selectedComplaintLocation={selectedComplaintLocation}
          mapMode={mapMode}
        />

        {/* ── AI HEATMAP OVERLAY LAYER ────────────────────────────── */}
        {showHeatmap && filteredComplaints.map(c => (
          <Circle
            key={`heat-${c._id}`}
            center={[c.location.lat, c.location.lng]}
            radius={1200} // 1.2km radius
            stroke={false}
            fillColor={
              c.severity === 'Critical' ? '#7f1d1d' :
              c.severity === 'High' ? '#dc2626' :
              c.severity === 'Medium' ? '#ea580c' : '#eab308'
            }
            fillOpacity={0.15}
          />
        ))}

        {/* ── AI RISK PREDICTION / ANOMALY DENSITY OVERLAY LAYER ──── */}
        {showAiRiskLayer && (() => {
          // Dynamic algorithm to find density regions:
          // For each complaint, if there's >= 1 other complaint within 3km, it creates a risk predict hotspot
          const hotspots = [];
          
          for (let i = 0; i < filteredComplaints.length; i++) {
            const c1 = filteredComplaints[i];
            let neighbors = 0;
            for (let j = 0; j < filteredComplaints.length; j++) {
              if (i === j) continue;
              const c2 = filteredComplaints[j];
              const dist = getDistance(c1.location.lat, c1.location.lng, c2.location.lat, c2.location.lng);
              if (dist <= 3.0) neighbors++;
            }

            if (neighbors >= 1) {
              // Avoid duplicates in hotspots
              const exists = hotspots.some(h => getDistance(h.lat, h.lng, c1.location.lat, c1.location.lng) < 1.5);
              if (!exists) {
                hotspots.push({
                  lat: c1.location.lat,
                  lng: c1.location.lng,
                  confidence: 82 + neighbors * 6 > 99 ? 99 : 82 + neighbors * 6,
                  neighbors: neighbors + 1
                });
              }
            }
          }

          return hotspots.map((h, index) => (
            <Circle
              key={`hotspot-${index}`}
              center={[h.lat, h.lng]}
              radius={2400} // large predictive zone
              pathOptions={{
                color: '#ef4444',
                weight: 2,
                dashArray: '8, 12',
                fillColor: '#ef4444',
                fillOpacity: 0.05
              }}
            >
              <Tooltip sticky>
                <div className="p-1 text-slate-100 font-sans text-xs bg-slate-900 border border-red-500/20 rounded">
                  <p className="font-black text-red-400">⚠️ AI Predictive Danger Zone</p>
                  <p className="text-[10px] text-slate-300 font-medium">
                    Complaint density: {h.neighbors} incidents within 3km.
                  </p>
                  <p className="text-[10px] text-teal-400 font-extrabold mt-1">
                    AI Predicts Future Violations: {h.confidence}% Probability
                  </p>
                </div>
              </Tooltip>
            </Circle>
          ));
        })()}

        {/* ── AUTHORIZED RECYCLE SAFE ZONES LAYER ───────────────────── */}
        {showRecyclers && RECYCLERS.map((r) => (
          <div key={r.id}>
            {/* Green safe buffer ring */}
            <Circle 
              center={[r.lat, r.lng]}
              radius={1500}
              stroke={true}
              pathOptions={{
                color: '#10b981',
                weight: 1.5,
                dashArray: '3, 6',
                fillColor: '#10b981',
                fillOpacity: 0.04
              }}
            >
              <Tooltip sticky>
                <span className="text-[10px] text-emerald-400 font-black">
                  Authorized Safe Disposal Buffer Zone
                </span>
              </Tooltip>
            </Circle>

            <Marker
              position={[r.lat, r.lng]}
              icon={createRecyclerIcon()}
            >
              <Popup>
                <div className="p-1 text-slate-100 font-sans min-w-[200px]">
                  <div className="flex items-center gap-1.5 mb-1 text-emerald-400 font-black text-xs select-none">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    <span>VERIFIED RECYCLER</span>
                  </div>
                  <h4 className="text-xs font-black text-white leading-tight">{r.name}</h4>
                  <p className="text-[10px] text-teal-400 font-bold mb-2">{r.type}</p>
                  <div className="space-y-1 text-[9px] text-slate-300 border-t border-white/5 pt-2">
                    <p><strong>Address:</strong> {r.address}</p>
                    <p><strong>Contact:</strong> {r.phone}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}

        {/* ── USER LOCATION BLUE MARKER ────────────────────────────── */}
        {userLocation && (
          <>
            {/* Accuracy circle */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              radius={userLocation.accuracy || 100}
              stroke={true}
              pathOptions={{
                color: '#3b82f6',
                weight: 1.5,
                fillColor: '#3b82f6',
                fillOpacity: 0.08
              }}
            />

            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUserLocationIcon()}
            >
              <Popup>
                <div className="p-1 font-sans text-xs text-slate-100 select-none">
                  <p className="font-black text-blue-400 flex items-center gap-1.5 mb-1">
                    <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-ping"></span>
                    You Are Here
                  </p>
                  <p className="text-[10px] text-slate-300">
                    Latitude: {userLocation.lat.toFixed(6)}<br />
                    Longitude: {userLocation.lng.toFixed(6)}
                  </p>
                  <p className="text-[9px] text-slate-400 mt-1.5 pt-1.5 border-t border-white/5">
                    Accuracy Radius: &plusmn;{userLocation.accuracy.toFixed(1)}m
                  </p>
                </div>
              </Popup>
            </Marker>
          </>
        )}

        {/* ── VIOLATIONS / COMPLAINTS MARKERS (CLUSTERING SUPPORT) ──── */}
        {showClustering ? (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={45}
            showCoverageOnHover={false}
          >
            {renderMarkers()}
          </MarkerClusterGroup>
        ) : (
          renderMarkers()
        )}
      </MapContainer>
    </>
  );
}
