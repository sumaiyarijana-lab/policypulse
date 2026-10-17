'use client';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { 
  Filter, 
  RefreshCw, 
  Layers, 
  Search, 
  Compass, 
  Activity, 
  ShieldAlert, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Locate, 
  Recycle, 
  Info,
  Maximize2,
  Minimize2,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import LiveMap with SSR disabled to prevent Leaflet window reference errors
const LiveMap = dynamic(() => import('@/components/map/LiveMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-slate-900/40 rounded-3xl border border-white/10 animate-pulse">
      <div className="flex flex-col items-center gap-4">
        <RefreshCw size={44} className="animate-spin text-teal-400" />
        <p className="text-teal-400/80 font-bold tracking-widest uppercase text-sm">
          Loading Geolocation Engine...
        </p>
      </div>
    </div>
  )
});

export default function MapPage() {
  // Filters and layers states
  const [filterType, setFilterType] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [mapMode, setMapMode] = useState('street'); // street, satellite, terrain
  
  // Layer toggles
  const [showAiRiskLayer, setShowAiRiskLayer] = useState(true);
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showClustering, setShowClustering] = useState(true);
  const [showRecyclers, setShowRecyclers] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  
  // Interactive states
  const [searchVal, setSearchVal] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isFeedCollapsed, setIsFeedCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [nearbyDistanceFilter, setNearbyDistanceFilter] = useState('All'); // 'All', '1', '5', '10' (km)

  // Data from map
  const [complaints, setComplaints] = useState([]);
  const [userLoc, setUserLoc] = useState(null);
  const [nearbyAlert, setNearbyAlert] = useState(null);

  // Toggle fullscreen mode on the map wrapper
  const toggleFullscreen = () => {
    const element = document.getElementById('map-container-wrapper');
    if (!isFullscreen) {
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchVal);
  };

  // Quick search preset handler
  const handleQuickSearch = (term) => {
    setSearchVal(term);
    setSearchQuery(term);
  };

  // Get severity style for badges
  const getSeverityBadgeClass = (severity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse';
      case 'High':
        return 'bg-rose-500/25 text-rose-300 border border-rose-500/20';
      case 'Medium':
        return 'bg-orange-500/20 text-orange-400 border border-orange-500/20';
      case 'Low':
        return 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border border-blue-500/10';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto py-6 px-4 sm:px-6 lg:px-8 min-h-screen text-slate-100 flex flex-col gap-6">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              Live Environmental Surveillance Hub
            </span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-white via-slate-100 to-teal-400 bg-clip-text text-transparent tracking-tight">
            PolicyPulse Interactive Violation Radar
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Real-time geospatial tracking, AI-powered dumping heatmap analysis, and proximity hazard alerts.
          </p>
        </div>
        
        {/* Quick Statistics Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl py-2.5 px-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black">Active Anomalies</p>
              <p className="text-base font-bold text-white leading-tight">
                {complaints.length}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl py-2.5 px-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <ShieldAlert size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black">Critical Zones</p>
              <p className="text-base font-bold text-white leading-tight">
                {complaints.filter(c => c.severity === 'Critical' || c.severity === 'High').length}
              </p>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-2xl py-2.5 px-4 flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black">AI Risk Areas</p>
              <p className="text-base font-bold text-white leading-tight">
                {complaints.filter(c => c.aiRiskScore >= 75).length} Predicted
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Radar Container */}
      <div 
        id="map-container-wrapper" 
        className={`relative flex flex-row w-full bg-slate-950 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-300 ${
          isFullscreen ? 'h-screen p-0 border-none rounded-none' : 'h-[720px]'
        }`}
      >
        {/* Left Sidebar: Collapsible Live Incident Feed */}
        <AnimatePresence initial={false}>
          {!isFeedCollapsed && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 360, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
              className="relative flex flex-col h-full bg-slate-900/80 backdrop-blur-2xl border-r border-white/15 z-20 shrink-0"
            >
              {/* Sidebar Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-teal-400 animate-pulse" />
                  <span className="font-bold text-sm tracking-wide uppercase text-slate-200">Incident Feed</span>
                </div>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-semibold">
                  {complaints.length} reports
                </span>
              </div>

              {/* Sidebar List */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                {complaints.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 text-slate-500">
                    <Info size={36} className="mb-2 opacity-55 text-slate-400" />
                    <p className="font-bold text-sm text-slate-400">No active incidents found</p>
                    <p className="text-xs mt-1">Adjust filters or register new violations to see updates.</p>
                  </div>
                ) : (
                  complaints.map((c) => (
                    <div
                      key={c._id}
                      onClick={() => {
                        setSelectedComplaintId(c._id);
                      }}
                      className={`p-3.5 rounded-2xl cursor-pointer border transition-all duration-200 ${
                        selectedComplaintId === c._id
                          ? 'bg-slate-800/80 border-teal-500/80 shadow-lg shadow-teal-500/5'
                          : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/40 hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono text-slate-500 font-bold">
                          {c.complaintId || 'CMP-MOCK'}
                        </span>
                        <div className="flex gap-1.5">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-extrabold ${getSeverityBadgeClass(c.severity)}`}>
                            {c.severity || 'Medium'}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-300 font-bold border border-white/5">
                            AI {c.aiRiskScore}%
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1 line-clamp-1 group-hover:text-teal-400 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-xs text-slate-400 mb-2 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 border-t border-white/5 pt-2">
                        <span className="flex items-center gap-1">
                          <MapPin size={10} className="text-teal-500" />
                          <span className="font-semibold text-slate-400">{c.area || 'Unknown'}, {c.district || 'All'}</span>
                        </span>
                        <span>
                          {new Date(c.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Sidebar Toggle Button */}
        <button
          onClick={() => setIsFeedCollapsed(!isFeedCollapsed)}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-slate-900/90 border border-y-white/10 border-r-white/10 text-slate-400 hover:text-white hover:bg-slate-800 p-2 rounded-r-xl transition-all shadow-xl z-20 hover:scale-105"
        >
          {isFeedCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Map Area */}
        <div className="relative flex-grow h-full w-full overflow-hidden">
          {/* Main Map Component */}
          <LiveMap 
            filterType={filterType}
            filterDistrict={filterDistrict}
            mapMode={mapMode}
            showAiRiskLayer={showAiRiskLayer}
            showHeatmap={showHeatmap}
            showClustering={showClustering}
            showRecyclers={showRecyclers}
            searchQuery={searchQuery}
            isTracking={isTracking}
            selectedComplaintId={selectedComplaintId}
            nearbyDistanceFilter={nearbyDistanceFilter}
            onSelectComplaint={(id) => setSelectedComplaintId(id)}
            onComplaintsLoaded={(data) => setComplaints(data)}
            onUserLocationUpdate={(coords) => setUserLoc(coords)}
            onLocationAlert={(alertData) => setNearbyAlert(alertData)}
          />

          {/* FLOAT OVERLAY: Top Dashboard Filters */}
          <div className="absolute top-4 left-4 right-4 z-10 flex flex-col md:flex-row gap-3 pointer-events-none">
            {/* Search Bar Panel */}
            <form 
              onSubmit={handleSearchSubmit} 
              className="flex bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl p-1 pointer-events-auto flex-grow md:max-w-md items-center"
            >
              <div className="flex items-center pl-3 pr-2 text-slate-400">
                <Search size={18} />
              </div>
              <input
                type="text"
                placeholder="Search area (e.g. OMR, Guindy, Velachery)..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-400 flex-grow py-2 focus:ring-0"
              />
              <button 
                type="submit" 
                className="bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-black px-4 py-2 transition-all mr-1 active:scale-95"
              >
                Go
              </button>
            </form>

            {/* Quick Filter Panel */}
            <div className="flex flex-wrap gap-2 pointer-events-auto">
              <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex items-center gap-1.5 shadow-xl">
                <Filter size={14} className="text-teal-400 ml-2" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-slate-200 cursor-pointer pr-4 focus:ring-0"
                >
                  <option className="bg-slate-900" value="All">All Categories</option>
                  <option className="bg-slate-900" value="Illegal Dumping">Illegal Dumping</option>
                  <option className="bg-slate-900" value="Unauthorized Recycling">Unauthorized Recycling</option>
                  <option className="bg-slate-900" value="Improper Disposal">Improper Disposal</option>
                  <option className="bg-slate-900" value="Hazardous Leakage">Hazardous Leakage</option>
                  <option className="bg-slate-950" value="Other">Other Category</option>
                </select>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex items-center gap-1.5 shadow-xl">
                <Grid size={14} className="text-teal-400 ml-2" />
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-slate-200 cursor-pointer pr-4 focus:ring-0"
                >
                  <option className="bg-slate-900" value="All">All Districts</option>
                  <option className="bg-slate-900" value="chennai">Chennai Region</option>
                  <option className="bg-slate-900" value="North">North District</option>
                  <option className="bg-slate-900" value="South">South District</option>
                  <option className="bg-slate-900" value="East">East District</option>
                  <option className="bg-slate-900" value="West">West District</option>
                  <option className="bg-slate-900" value="Central">Central District</option>
                </select>
              </div>

              <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-1.5 flex items-center gap-1.5 shadow-xl">
                <MapPin size={14} className="text-teal-400 ml-2" />
                <select
                  value={nearbyDistanceFilter}
                  onChange={(e) => setNearbyDistanceFilter(e.target.value)}
                  className="bg-transparent border-none outline-none text-xs font-bold text-slate-200 cursor-pointer pr-4 focus:ring-0 text-ellipsis max-w-[130px]"
                >
                  <option className="bg-slate-900" value="All">No Distance Filter</option>
                  <option className="bg-slate-900" value="1">Within 1 km</option>
                  <option className="bg-slate-900" value="5">Within 5 km</option>
                  <option className="bg-slate-900" value="10">Within 10 km</option>
                  <option className="bg-slate-900" value="25">Within 25 km</option>
                </select>
              </div>
            </div>
          </div>

          {/* FLOAT OVERLAY: Right Utility Layer Controls */}
          <div className="absolute right-4 top-20 z-10 flex flex-col gap-3 pointer-events-none">
            {/* Map Theme Toggle Panel */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-xl flex flex-col gap-1.5 pointer-events-auto">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-white/5 pb-1 select-none">
                Radar View
              </span>
              <button
                onClick={() => setMapMode('street')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all text-left ${
                  mapMode === 'street' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                Street Map
              </button>
              <button
                onClick={() => setMapMode('dark')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all text-left ${
                  mapMode === 'dark' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                Dark Radar
              </button>
              <button
                onClick={() => setMapMode('satellite')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all text-left ${
                  mapMode === 'satellite' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                Satellite
              </button>
              <button
                onClick={() => setMapMode('terrain')}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all text-left ${
                  mapMode === 'terrain' ? 'bg-teal-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                Terrain Map
              </button>
            </div>

            {/* Smart Layer Controls Panel */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-2 shadow-xl flex flex-col gap-2 pointer-events-auto min-w-[160px]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-white/5 pb-1 select-none">
                AI & Map Layers
              </span>
              
              <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer select-none py-0.5 hover:bg-white/5 px-2 rounded-lg">
                <span>AI Risk Prediction</span>
                <input
                  type="checkbox"
                  checked={showAiRiskLayer}
                  onChange={(e) => setShowAiRiskLayer(e.target.checked)}
                  className="rounded border-white/10 bg-slate-800 text-teal-500 focus:ring-teal-500 h-3.5 w-3.5"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer select-none py-0.5 hover:bg-white/5 px-2 rounded-lg">
                <span>Density Heatmap</span>
                <input
                  type="checkbox"
                  checked={showHeatmap}
                  onChange={(e) => setShowHeatmap(e.target.checked)}
                  className="rounded border-white/10 bg-slate-800 text-teal-500 focus:ring-teal-500 h-3.5 w-3.5"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer select-none py-0.5 hover:bg-white/5 px-2 rounded-lg">
                <span>Cluster Markers</span>
                <input
                  type="checkbox"
                  checked={showClustering}
                  onChange={(e) => setShowClustering(e.target.checked)}
                  className="rounded border-white/10 bg-slate-800 text-teal-500 focus:ring-teal-500 h-3.5 w-3.5"
                />
              </label>

              <label className="flex items-center justify-between text-xs font-bold text-slate-300 cursor-pointer select-none py-0.5 hover:bg-white/5 px-2 rounded-lg">
                <span>Recycle Safe Zones</span>
                <input
                  type="checkbox"
                  checked={showRecyclers}
                  onChange={(e) => setShowRecyclers(e.target.checked)}
                  className="rounded border-white/10 bg-slate-800 text-teal-500 focus:ring-teal-500 h-3.5 w-3.5"
                />
              </label>
            </div>

            {/* Locate Me controls */}
            <div className="flex flex-row gap-2 pointer-events-auto">
              <button
                onClick={() => setIsTracking(!isTracking)}
                title={isTracking ? "Disable live tracking" : "Track my live GPS"}
                className={`p-2.5 rounded-xl border transition-all hover:scale-105 active:scale-95 shadow-xl flex-grow flex items-center justify-center gap-1.5 text-xs font-extrabold ${
                  isTracking 
                    ? 'bg-blue-600 border-blue-400 text-white animate-pulse' 
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Locate size={16} />
                <span>{isTracking ? 'Tracking' : 'Track Me'}</span>
              </button>

              <button
                onClick={toggleFullscreen}
                title="Toggle Fullscreen"
                className="p-2.5 rounded-xl bg-slate-900/80 border border-white/10 text-slate-300 hover:text-white hover:scale-105 active:scale-95 shadow-xl"
              >
                {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
            </div>

            {/* Quick search presets */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 shadow-xl flex flex-col gap-1.5 pointer-events-auto max-w-[160px]">
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center border-b border-white/5 pb-1 select-none">
                Location Presets
              </span>
              <button 
                onClick={() => handleQuickSearch('omr')}
                className="text-[10px] font-bold text-slate-400 hover:text-teal-400 hover:bg-white/5 py-1 px-2 rounded-lg text-left"
              >
                OMR / Dumping Ground
              </button>
              <button 
                onClick={() => handleQuickSearch('guindy')}
                className="text-[10px] font-bold text-slate-400 hover:text-teal-400 hover:bg-white/5 py-1 px-2 rounded-lg text-left"
              >
                Guindy Industrial
              </button>
              <button 
                onClick={() => handleQuickSearch('tambaram')}
                className="text-[10px] font-bold text-slate-400 hover:text-teal-400 hover:bg-white/5 py-1 px-2 rounded-lg text-left"
              >
                Tambaram South
              </button>
            </div>
          </div>

          {/* FLOAT OVERLAY: Bottom Nearby Warning Alerts Panel */}
          <AnimatePresence>
            {nearbyAlert && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-[90%] max-w-xl pointer-events-auto"
              >
                <div className="bg-rose-950/95 border-2 border-red-500/85 text-white rounded-[24px] shadow-2xl p-4 flex flex-col sm:flex-row items-start gap-4 backdrop-blur-xl relative overflow-hidden">
                  {/* Glowing background animation */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/20 blur-[50px] pointer-events-none rounded-full animate-pulse"></div>

                  <div className="p-3 bg-red-500/20 text-red-400 rounded-xl shrink-0 mt-0.5 animate-bounce">
                    <ShieldAlert size={24} />
                  </div>
                  
                  <div className="flex-grow space-y-1">
                    <h3 className="text-sm font-black tracking-tight text-red-200">
                      ⚠️ High-Risk E-Waste Violation Area Nearby
                    </h3>
                    <p className="text-xs text-rose-300 font-medium">
                      You are approximately <span className="font-extrabold text-white text-sm bg-red-600/30 px-1.5 py-0.5 rounded">{nearbyAlert.distance.toFixed(0)} meters</span> from:
                    </p>
                    <p className="text-xs text-white font-bold italic line-clamp-1">
                      &quot;{nearbyAlert.violationTitle}&quot;
                    </p>
                    
                    {/* Nearest Recycler recommendation */}
                    {nearbyAlert.recycler && (
                      <div className="mt-2.5 pt-2.5 border-t border-red-500/20 flex flex-col gap-1 text-[11px] text-rose-200">
                        <div className="flex items-center gap-1.5">
                          <Recycle size={12} className="text-emerald-400" />
                          <span className="font-extrabold text-emerald-400">Nearest Recycler Center:</span>
                          <span className="font-bold text-white">{nearbyAlert.recycler.name}</span>
                        </div>
                        <p className="text-slate-300 font-medium ml-4">
                          Located {nearbyAlert.recyclerDistance.toFixed(1)} km away. Call: {nearbyAlert.recycler.phone}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Dismiss warning button */}
                  <button 
                    onClick={() => setNearbyAlert(null)}
                    className="absolute top-2 right-2 text-rose-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-all"
                  >
                    &times;
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Coordinates display floating at bottom right */}
          {userLoc && (
            <div className="absolute bottom-4 right-4 z-10 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-xl px-3 py-1.5 shadow-md flex items-center gap-2 select-none text-[10px] font-mono text-slate-400">
              <Compass size={12} className="text-blue-400 animate-spin" />
              <span>
                GPS: {userLoc.lat.toFixed(6)}, {userLoc.lng.toFixed(6)} (&plusmn;{userLoc.accuracy.toFixed(1)}m)
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
