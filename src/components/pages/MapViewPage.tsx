import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  AlertCircle,
  Clock,
  MapPin,
  Activity,
  Eye,
  Thermometer,
  Droplets,
  Construction
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { SeverityBadge, StatusBadge } from '../ui/Badge';
import { useStore } from '../../store/useStore';
import { Complaint } from '../../store/useStore';

// Severity colours for Leaflet markers
const severityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return '#ef4444';
    case 'high':     return '#f59e0b';
    case 'medium':   return '#3b82f6';
    default:         return '#10b981';
  }
};

function LeafletMap({
  complaints,
  selectedComplaint,
  onSelectComplaint,
}: {
  complaints: Complaint[];
  selectedComplaint: string | null;
  onSelectComplaint: (id: string | null) => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Dynamically import Leaflet so it only runs in browser
    import('leaflet').then((L) => {
      // Fix default icon URLs broken by bundlers
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current!, {
        center: [12.9716, 77.5946], // Bangalore
        zoom: 12,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      // Custom zoom control position
      L.control.zoom({ position: 'topleft' }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers for each complaint
      complaints.forEach((complaint) => {
        const { lat, lng } = complaint.location;
        const color = severityColor(complaint.severity);

        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:16px;height:16px;border-radius:50%;
            background:${color};border:2px solid white;
            box-shadow:0 2px 6px rgba(0,0,0,0.4);
            cursor:pointer;
          "></div>`,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        });

        const marker = L.marker([lat, lng], { icon })
          .addTo(map)
          .on('click', () => {
            onSelectComplaint(selectedComplaint === complaint.id ? null : complaint.id);
          });

        marker.bindTooltip(complaint.title, { direction: 'top', offset: [0, -10] });
        markersRef.current[complaint.id] = marker;
      });

      // Fit map to markers if we have complaints
      if (complaints.length > 0) {
        const group = L.featureGroup(Object.values(markersRef.current));
        map.fitBounds(group.getBounds().pad(0.1));
      }
    });

    return () => {
      mapInstanceRef.current?.remove();
      mapInstanceRef.current = null;
      markersRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Highlight selected marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    import('leaflet').then((L) => {
      Object.entries(markersRef.current).forEach(([id, marker]) => {
        const complaint = complaints.find((c) => c.id === id);
        if (!complaint) return;
        const color = severityColor(complaint.severity);
        const isSelected = id === selectedComplaint;
        const icon = L.divIcon({
          className: '',
          html: `<div style="
            width:${isSelected ? 24 : 16}px;height:${isSelected ? 24 : 16}px;
            border-radius:50%;background:${color};
            border:${isSelected ? 3 : 2}px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.5);
            cursor:pointer;transition:all .2s;
          "></div>`,
          iconSize: [isSelected ? 24 : 16, isSelected ? 24 : 16],
          iconAnchor: [isSelected ? 12 : 8, isSelected ? 12 : 8],
        });
        marker.setIcon(icon);
        if (isSelected) {
          mapInstanceRef.current.setView(
            [complaint.location.lat, complaint.location.lng],
            14,
            { animate: true }
          );
        }
      });
    });
  }, [selectedComplaint, complaints]);

  return (
    <div ref={mapRef} className="w-full h-full rounded-xl overflow-hidden" style={{ zIndex: 0 }} />
  );
}

export function MapViewPage() {
  const { complaints, user } = useStore();
  const [selectedComplaint, setSelectedComplaint] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState('complaints');
  const [showLayers, setShowLayers] = useState(false);

  const selectedComplaintData = complaints.find((c) => c.id === selectedComplaint);

  const layers = [
    { id: 'complaints', label: 'Complaints', icon: AlertCircle, count: complaints.length },
    { id: 'heatmap',    label: 'Heatmap',    icon: Thermometer, count: null },
    { id: 'roads',      label: 'Road Quality', icon: Activity,  count: null },
    { id: 'projects',   label: 'Active Projects', icon: Construction, count: 5 },
    { id: 'flooding',   label: 'Flood Zones', icon: Droplets,  count: 12 },
  ];

  const stats = [
    { label: 'Total Issues', value: complaints.length, color: 'text-primary-400' },
    { label: 'Critical', value: complaints.filter((c) => c.severity === 'critical').length, color: 'text-danger-400' },
    { label: 'In Progress', value: complaints.filter((c) => c.status === 'in_progress').length, color: 'text-warning-400' },
    { label: 'Resolved', value: complaints.filter((c) => c.status === 'resolved').length, color: 'text-accent-400' },
  ];

  return (
    <div className="h-[calc(100vh-7rem)] flex gap-4">
      {/* Map Container */}
      <div className="flex-1 relative">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
          <LeafletMap
            complaints={complaints}
            selectedComplaint={selectedComplaint}
            onSelectComplaint={setSelectedComplaint}
          />
        </motion.div>

        {/* Layer Selector */}
        <div className="absolute top-4 right-4" style={{ zIndex: 1000 }}>
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="bg-surface-900/90"
              onClick={() => setShowLayers(!showLayers)}
              icon={<Layers className="w-4 h-4" />}
            >
              Layers
            </Button>
            {showLayers && (
              <Card variant="glass" className="absolute top-full mt-2 right-0 w-56 p-2">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => setActiveLayer(layer.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      activeLayer === layer.id
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'text-surface-300 hover:bg-surface-800'
                    }`}
                  >
                    <layer.icon className="w-4 h-4" />
                    <span className="text-sm flex-1 text-left">{layer.label}</span>
                    {layer.count !== null && (
                      <span className="text-xs bg-surface-700 px-2 py-0.5 rounded-full">
                        {layer.count}
                      </span>
                    )}
                  </button>
                ))}
              </Card>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2" style={{ zIndex: 1000 }}>
          <Card variant="glass" className="flex items-center gap-6 px-6 py-3">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-surface-400">{stat.label}</p>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Side Panel */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-80 flex-shrink-0 overflow-y-auto"
      >
        <Card variant="gradient" className="h-full">
          {selectedComplaintData ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-white">Issue Details</h3>
                <button onClick={() => setSelectedComplaint(null)} className="text-surface-400 hover:text-white text-xl leading-none">×</button>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-surface-500">{selectedComplaintData.id}</span>
                  <SeverityBadge severity={selectedComplaintData.severity} />
                  <StatusBadge status={selectedComplaintData.status} />
                </div>
                <h4 className="text-lg font-medium text-white">{selectedComplaintData.title}</h4>
                <p className="text-sm text-surface-400 mt-2">{selectedComplaintData.description}</p>
              </div>
              <div className="p-3 bg-surface-800/50 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-surface-400" />
                  <span className="text-white">{selectedComplaintData.location.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-surface-400" />
                  <span className="text-white">
                    Reported: {new Date(selectedComplaintData.reportedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              {selectedComplaintData.aiAnalysis && (
                <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <p className="text-xs text-primary-400 mb-2">AI Analysis</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-surface-400">Priority</p>
                      <p className="text-sm font-medium text-white">{selectedComplaintData.aiAnalysis.priority}/100</p>
                    </div>
                    <div>
                      <p className="text-xs text-surface-400">Est. Cost</p>
                      <p className="text-sm font-medium text-white">₹{selectedComplaintData.aiAnalysis.estimatedCost?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4" /> View Full
                </Button>
                {user?.role === 'government' && (
                  <Button size="sm" className="flex-1">Assign</Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h3 className="font-semibold text-white">Recent Issues</h3>
              <div className="space-y-3">
                {complaints.slice(0, 6).map((complaint) => (
                  <button
                    key={complaint.id}
                    onClick={() => setSelectedComplaint(complaint.id)}
                    className="w-full text-left p-3 bg-surface-800/50 rounded-lg hover:bg-surface-800 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: severityColor(complaint.severity) }}
                      />
                      <span className="text-sm font-medium text-white truncate">{complaint.title}</span>
                    </div>
                    <p className="text-xs text-surface-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {complaint.location.district}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
