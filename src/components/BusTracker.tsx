import React, { useState } from 'react';
import { BusRouteInfo, Student, Role } from '../types';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Phone, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Radio, 
  Sparkles, 
  Send,
  Users,
  Info,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface BusTrackerProps {
  busRoutes: BusRouteInfo[];
  selectedStudent: Student;
  currentRole: Role;
  isHindi: boolean;
  onSendBusAlert: (routeNumber: string, message: string, priority: 'normal' | 'urgent') => void;
  onAdvanceBusStop?: (routeId: string) => void;
}

export const BusTracker: React.FC<BusTrackerProps> = ({
  busRoutes,
  selectedStudent,
  currentRole,
  isHindi,
  onSendBusAlert,
  onAdvanceBusStop,
}) => {
  // Find route assigned to currently selected student
  const studentRoute = busRoutes.find((r) => 
    selectedStudent.busRoute.includes(r.routeNumber) || r.routeId === 'route-14'
  ) || busRoutes[0];

  const [activeRouteId, setActiveRouteId] = useState<string>(studentRoute.routeId);
  const [isDelayModalOpen, setIsDelayModalOpen] = useState(false);
  const [delayMinutes, setDelayMinutes] = useState(10);
  const [delayReason, setDelayReason] = useState('Heavy traffic congestion near Sector 62 Underpass');
  const [tripView, setTripView] = useState<'morning' | 'evening'>('morning');

  const activeRoute = busRoutes.find((r) => r.routeId === activeRouteId) || studentRoute;

  const handleBroadcastDelay = (e: React.FormEvent) => {
    e.preventDefault();
    const alertMsg = `${activeRoute.routeNumber} (${activeRoute.busNumber}) is running ~${delayMinutes} mins behind schedule due to: ${delayReason}. Driver: ${activeRoute.driverName}.`;
    onSendBusAlert(activeRoute.routeNumber, alertMsg, 'urgent');
    setIsDelayModalOpen(false);
  };

  const getStatusBadge = (status: BusRouteInfo['status']) => {
    switch (status) {
      case 'on_route':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isHindi ? 'मार्ग पर गतिशील (Live GPS)' : 'Live On Route (In Transit)'}</span>
          </span>
        );
      case 'reached_school':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>{isHindi ? 'विद्यालय परिसर पहुँच चुकी है' : 'Safely Reached Campus'}</span>
          </span>
        );
      case 'delayed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>{isHindi ? 'विलंबित (Delayed)' : 'Running Delayed'}</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>{isHindi ? 'समय सारिणी अनुसार' : 'Scheduled'}</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Transport Control & Live Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <Bus className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {isHindi ? 'स्कूल बस एवं परिवहन ट्रैकिंग' : 'School Bus Live GPS & Fleet Tracker'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {isHindi 
                ? `${selectedStudent.name} (${selectedStudent.class}-${selectedStudent.section}) के लिए निर्धारित स्कूल बस का वास्तविक समय स्थान एवं स्टॉप विवरण`
                : `Real-time GPS coordinates, stop ETAs, driver contact and transit alerts for ${selectedStudent.name}`
              }
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Delay Alert Trigger button for Faculty/Admin or Testing */}
            <button
              id="btn-open-bus-delay-modal"
              onClick={() => setIsDelayModalOpen(true)}
              className="flex items-center gap-2 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>{isHindi ? 'बस देरी अलर्ट भेजें' : 'Send Bus Delay Alert'}</span>
            </button>

            {/* Helpline quick dial button */}
            <a
              href="tel:+919811100099"
              className="flex items-center gap-2 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-all"
              title="Central Transport Helpdesk"
            >
              <Phone className="w-3.5 h-3.5 text-slate-600" />
              <span>{isHindi ? 'परिवहन हेल्पडेस्क' : 'Transport Desk'}</span>
            </a>
          </div>

        </div>

        {/* Route Selector Tabs (All School Buses) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-2">
            {isHindi ? 'रूट चुनें:' : 'Select Route:'}
          </span>
          {busRoutes.map((route) => {
            const isAssignedToStudent = selectedStudent.busRoute.includes(route.routeNumber);
            const isSelected = route.routeId === activeRouteId;

            return (
              <button
                key={route.routeId}
                onClick={() => setActiveRouteId(route.routeId)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <Bus className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{route.routeNumber}</span>
                {isAssignedToStudent && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-900 font-extrabold">
                    {selectedStudent.name.split(' ')[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Bus Route Detail Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Live Telemetry & Visual Stops Timeline */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Route Telemetry Overview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {activeRoute.routeNumber} — {activeRoute.routeName}
                  </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span className="font-semibold text-slate-700">Bus No: {activeRoute.busNumber}</span>
                  <span>•</span>
                  <span>Capacity: {activeRoute.capacity} Seats (GPS Enabled)</span>
                  <span>•</span>
                  <span className="text-emerald-700 font-medium">{activeRoute.lastUpdated}</span>
                </div>
              </div>

              <div>{getStatusBadge(activeRoute.status)}</div>
            </div>

            {/* Live GPS Radar Bar */}
            <div className="bg-slate-900 text-white rounded-xl p-4 shadow-inner relative overflow-hidden">
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                      {isHindi ? 'वर्तमान स्थिति (Current GPS Ping)' : 'Live Vehicle Location'}
                    </span>
                    <p className="font-bold text-sm sm:text-base text-slate-100">
                      {isHindi && activeRoute.currentLocationHi ? activeRoute.currentLocationHi : activeRoute.currentLocation}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/60">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Speed</span>
                    <span className="text-sm font-black text-emerald-400">{activeRoute.speedKmh} km/h</span>
                  </div>
                  <div className="h-6 w-px bg-slate-700" />
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Next ETA</span>
                    <span className="text-sm font-black text-amber-300">{activeRoute.etaNextStop}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Stop Alert Bar */}
            <div className="flex items-center justify-between bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-600 animate-ping" />
                <span className="font-semibold">
                  {isHindi ? 'आगामी स्टॉप:' : 'Approaching Next Stop:'} <strong>{activeRoute.nextStop}</strong>
                </span>
              </div>
              <span className="font-bold text-amber-800">{activeRoute.etaNextStop}</span>
            </div>

            {/* Trip Selector (Morning Pickup vs Evening Drop) */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-700">
                {isHindi ? 'स्टॉप समय सारिणी एवं मार्ग अनुक्रम' : 'Route Stops Sequence & Schedule'}
              </span>

              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setTripView('morning')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    tripView === 'morning' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {isHindi ? 'प्रातः पिकअप (Morning)' : 'Morning Pickup'}
                </button>
                <button
                  onClick={() => setTripView('evening')}
                  className={`px-3 py-1 rounded-md font-semibold transition-all ${
                    tripView === 'evening' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  {isHindi ? 'दोपहर ड्रॉप (Evening)' : 'Evening Drop'}
                </button>
              </div>
            </div>

            {/* Route Stops Timeline */}
            <div className="space-y-3 pt-2 relative before:absolute before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
              {activeRoute.stops.map((stop, index) => {
                const isStudentStop = stop.isStudentStop || selectedStudent.address.includes(stop.name.slice(0, 10));
                const timeDisplay = tripView === 'morning' ? stop.pickupTime : stop.dropTime;

                return (
                  <div
                    key={stop.id}
                    className={`relative flex items-start gap-4 p-3.5 rounded-xl border transition-all ${
                      isStudentStop
                        ? 'bg-amber-50/60 border-amber-300 shadow-xs'
                        : stop.isPassed
                        ? 'bg-slate-50/70 border-slate-200/80 opacity-80'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    {/* Node Dot / Status Icon */}
                    <div className="relative z-10 flex-shrink-0">
                      {stop.isPassed ? (
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 border-2 border-emerald-500 flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                      ) : isStudentStop ? (
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-white border-2 border-amber-600 flex items-center justify-center font-bold text-xs shadow-md shadow-amber-200 animate-bounce">
                          ★
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-white text-slate-600 border-2 border-slate-300 flex items-center justify-center font-bold text-xs">
                          {index + 1}
                        </div>
                      )}
                    </div>

                    {/* Stop Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">
                            {isHindi && stop.nameHi ? stop.nameHi : stop.name}
                          </h4>
                          {isStudentStop && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-200 text-amber-900 border border-amber-300">
                              {selectedStudent.name}'s Stop
                            </span>
                          )}
                        </div>

                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          {timeDisplay}
                        </span>
                      </div>

                      {stop.landmark && (
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{stop.landmark}</span>
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1.5 text-[11px]">
                        {stop.isPassed ? (
                          <span className="text-emerald-700 font-semibold">
                            ✓ {isHindi ? 'बस गुजर चुकी है' : 'Bus has departed from this stop'}
                          </span>
                        ) : isStudentStop ? (
                          <span className="text-amber-800 font-bold animate-pulse">
                            ⏳ {isHindi ? 'आगामी स्टॉप • विद्यार्थी तैयार रहें' : 'Target Stop • Please ensure student is ready'}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-medium">
                            {isHindi ? 'आगामी पड़ाव' : 'Upcoming Stop'}
                          </span>
                        )}
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* Right 1 Col: Staff & Safety Contacts Card */}
        <div className="space-y-6">
          
          {/* Driver & Conductor Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'बस चालक व सहायक स्टाफ' : 'Assigned Crew & Staff'}</span>
            </h3>

            {/* Driver Profile */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src={activeRoute.driverPhoto}
                  alt={activeRoute.driverName}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-300"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Chief Driver
                  </span>
                  <h4 className="text-sm font-bold text-slate-900">{activeRoute.driverName}</h4>
                  <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Police Verified • 12 Yrs Exp
                  </span>
                </div>
              </div>

              <a
                href={`tel:${activeRoute.driverPhone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Driver ({activeRoute.driverPhone})</span>
              </a>
            </div>

            {/* Conductor Profile */}
            {activeRoute.conductorName && (
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/70 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Bus Conductor / Attendant
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{activeRoute.conductorName}</h4>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">RFID Assistant</span>
                </div>

                {activeRoute.conductorPhone && (
                  <a
                    href={`tel:${activeRoute.conductorPhone.replace(/\s+/g, '')}`}
                    className="flex items-center justify-center gap-2 w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call Attendant ({activeRoute.conductorPhone})</span>
                  </a>
                )}
              </div>
            )}

            {/* Bus Safety Specs */}
            <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Vehicle Registration:</span>
                <strong className="text-slate-900">{activeRoute.busNumber}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Speed Governor:</span>
                <strong className="text-emerald-700">Capped at 40 km/h</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>CCTV & RFID Attendance:</span>
                <strong className="text-emerald-700">Active (4 Cameras)</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>First Aid & Fire Safety:</span>
                <strong className="text-emerald-700">Inspected Aug 2026</strong>
              </div>
            </div>
          </div>

          {/* Emergency Protocols & Advice */}
          <div className="bg-indigo-50/70 rounded-2xl p-5 border border-indigo-200/70 space-y-3">
            <h4 className="font-bold text-indigo-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>{isHindi ? 'परिवहन नियम व सलाह' : 'Parent Guidelines'}</span>
            </h4>
            <ul className="text-xs text-indigo-900 space-y-1.5 leading-relaxed list-disc list-inside">
              <li>{isHindi ? 'कृपया निर्धारित समय से 5 मिनट पूर्व स्टॉप पर उपस्थित रहें।' : 'Please report to stop 5 mins prior to scheduled pickup time.'}</li>
              <li>{isHindi ? 'छात्र की बस में चढ़ते व उतरते समय आरएफआईडी कार्ड अनिवार्य है।' : 'RFID smart ID punch is mandatory while boarding and deboarding.'}</li>
              <li>{isHindi ? 'यदि छात्र किसी दिन बस से नहीं जाएगा तो पूर्व सूचना दें।' : 'Notify transport desk in advance if student is on self-pickup.'}</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Modal: Send Bus Delay Alert */}
      {isDelayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isHindi ? 'बस विलंब सूचना प्रसारित करें' : 'Dispatch Bus Delay Alert'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeRoute.routeNumber} ({activeRoute.busNumber})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDelayModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastDelay} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'अनुमानित देरी (मिनट)' : 'Estimated Delay (Minutes)'}
                </label>
                <select
                  value={delayMinutes}
                  onChange={(e) => setDelayMinutes(Number(e.target.value))}
                  className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                >
                  <option value={5}>5 Minutes Delay</option>
                  <option value={10}>10 Minutes Delay</option>
                  <option value={15}>15 Minutes Delay</option>
                  <option value={25}>25 Minutes Delay (Heavy Jam)</option>
                  <option value={40}>40 Minutes Delay (Mechanical Check)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'विलंब का कारण' : 'Reason for Delay'}
                </label>
                <textarea
                  rows={3}
                  value={delayReason}
                  onChange={(e) => setDelayReason(e.target.value)}
                  placeholder="e.g. Traffic bottleneck at Sector 62 Underpass or tyre puncture..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDelayModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-send-bus-delay"
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'सभी अभिभावकों को अलर्ट भेजें' : 'Broadcast to Parents'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
