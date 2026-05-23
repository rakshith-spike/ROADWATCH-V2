import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
  Droplets,
  Zap,
  Clock,
  MapPin,
  Settings,
  ChevronRight,
  Volume2,
  VolumeX
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  location?: string;
  time: string;
  read: boolean;
  actionable: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'critical',
    title: 'Flood Risk Alert',
    message: 'Heavy rainfall predicted in Whitefield area. 3 drainage complaints in critical zone. Immediate attention required.',
    location: 'Whitefield, Bangalore',
    time: '5 mins ago',
    read: false,
    actionable: true
  },
  {
    id: '2',
    type: 'warning',
    title: 'SLA Breach Warning',
    message: 'Complaint C003 is approaching SLA deadline. Only 6 hours remaining for resolution.',
    time: '15 mins ago',
    read: false,
    actionable: true
  },
  {
    id: '3',
    type: 'warning',
    title: 'Contractor Delay Detected',
    message: 'MG Road project is behind schedule by 2 days. AI recommends resource reallocation.',
    location: 'MG Road, Bangalore',
    time: '1 hour ago',
    read: false,
    actionable: true
  },
  {
    id: '4',
    type: 'info',
    title: 'New Hotspot Detected',
    message: 'AI identified Koramangala 4th Block as emerging hotspot with 12 new complaints in 24 hours.',
    location: 'Koramangala, Bangalore',
    time: '2 hours ago',
    read: true,
    actionable: true
  },
  {
    id: '5',
    type: 'success',
    title: 'Project Completed',
    message: 'HSR Layout road repair project completed successfully. Quality score: 94%',
    location: 'HSR Layout, Bangalore',
    time: '3 hours ago',
    read: true,
    actionable: false
  },
  {
    id: '6',
    type: 'info',
    title: 'Budget Update',
    message: 'Q2 budget allocation approved. ₹5Cr allocated for road infrastructure.',
    time: '5 hours ago',
    read: true,
    actionable: false
  },
  {
    id: '7',
    type: 'warning',
    title: 'High Accident Zone',
    message: 'Multiple accidents reported near Silk Board junction. Road quality assessment recommended.',
    location: 'Silk Board, Bangalore',
    time: '6 hours ago',
    read: true,
    actionable: true
  },
  {
    id: '8',
    type: 'critical',
    title: 'Emergency Road Closure',
    message: 'Ring Road section closed due to major crack. Diversion in effect. Urgent repair needed.',
    location: 'Ring Road, Bangalore',
    time: '8 hours ago',
    read: true,
    actionable: true
  }
];

const alertCategories = [
  { id: 'all', label: 'All Alerts', count: mockAlerts.length },
  { id: 'critical', label: 'Critical', count: mockAlerts.filter(a => a.type === 'critical').length },
  { id: 'warning', label: 'Warnings', count: mockAlerts.filter(a => a.type === 'warning').length },
  { id: 'info', label: 'Information', count: mockAlerts.filter(a => a.type === 'info').length },
  { id: 'success', label: 'Success', count: mockAlerts.filter(a => a.type === 'success').length }
];

export function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [, setSelectedAlert] = useState<Alert | null>(null);

  const filteredAlerts = alerts.filter(alert => 
    selectedCategory === 'all' || alert.type === selectedCategory
  );

  const unreadCount = alerts.filter(a => !a.read).length;

  const markAsRead = (id: string) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map(a => ({ ...a, read: true })));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical': return AlertTriangle;
      case 'warning': return AlertCircle;
      case 'info': return Info;
      case 'success': return CheckCircle;
      default: return Bell;
    }
  };

  const getAlertStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return 'bg-danger-500/10 border-danger-500/30 text-danger-400';
      case 'warning':
        return 'bg-warning-500/10 border-warning-500/30 text-warning-400';
      case 'info':
        return 'bg-primary-500/10 border-primary-500/30 text-primary-400';
      case 'success':
        return 'bg-accent-500/10 border-accent-500/30 text-accent-400';
      default:
        return 'bg-surface-800 border-surface-700 text-surface-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-warning-500 to-danger-500 flex items-center justify-center">
              <Bell className="w-6 h-6 text-white" />
            </div>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger-500 rounded-full text-xs text-white flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
            <p className="text-surface-400">{unreadCount} unread alerts</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={notificationsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          >
            {notificationsEnabled ? 'Mute' : 'Unmute'}
          </Button>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark All Read
          </Button>
          <Button variant="outline" icon={<Settings className="w-4 h-4" />}>
            Settings
          </Button>
        </div>
      </motion.div>

      {/* Category Tabs */}
      <Card variant="gradient" className="p-2">
        <div className="flex flex-wrap gap-2">
          {alertCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary-500 text-white'
                  : 'text-surface-400 hover:bg-surface-800 hover:text-white'
              }`}
            >
              {category.label}
              <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                selectedCategory === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-surface-700 text-surface-400'
              }`}>
                {category.count}
              </span>
            </button>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Alerts List */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {filteredAlerts.map((alert, index) => {
              const Icon = getAlertIcon(alert.type);
              
              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    variant="gradient"
                    hover
                    onClick={() => {
                      setSelectedAlert(alert);
                      markAsRead(alert.id);
                    }}
                    className={`relative overflow-hidden ${!alert.read ? 'border-l-4 border-l-primary-500' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getAlertStyles(alert.type)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h3 className={`font-semibold ${!alert.read ? 'text-white' : 'text-surface-300'}`}>
                            {alert.title}
                          </h3>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : alert.type === 'success' ? 'success' : 'info'}>
                              {alert.type}
                            </Badge>
                            {!alert.read && (
                              <span className="w-2 h-2 bg-primary-500 rounded-full" />
                            )}
                          </div>
                        </div>
                        
                        <p className="text-sm text-surface-400 line-clamp-2 mb-2">{alert.message}</p>
                        
                        <div className="flex items-center gap-4 text-xs text-surface-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {alert.time}
                          </span>
                          {alert.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5" />
                              {alert.location}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <ChevronRight className="w-5 h-5 text-surface-500 flex-shrink-0 self-center" />
                    </div>
                    
                    {alert.actionable && (
                      <div className="flex gap-2 mt-4 pt-4 border-t border-surface-700/50">
                        <Button size="sm" variant="outline">Dismiss</Button>
                        <Button size="sm">Take Action</Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {filteredAlerts.length === 0 && (
            <Card variant="bordered" className="text-center py-12">
              <Bell className="w-12 h-12 text-surface-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">No alerts</h3>
              <p className="text-surface-400">You're all caught up!</p>
            </Card>
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          {/* Alert Types Legend */}
          <Card variant="gradient">
            <h3 className="font-semibold text-white mb-4">Alert Types</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-danger-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-danger-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Critical</p>
                  <p className="text-xs text-surface-400">Requires immediate action</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-warning-500/20 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-warning-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Warning</p>
                  <p className="text-xs text-surface-400">Action needed soon</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <Info className="w-4 h-4 text-primary-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Information</p>
                  <p className="text-xs text-surface-400">General updates</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-accent-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Success</p>
                  <p className="text-xs text-surface-400">Completed actions</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card variant="gradient">
            <h3 className="font-semibold text-white mb-4">Alert Statistics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Today</span>
                <span className="text-white font-medium">12 alerts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-400">This Week</span>
                <span className="text-white font-medium">67 alerts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Response Rate</span>
                <span className="text-accent-400 font-medium">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-surface-400">Avg Response Time</span>
                <span className="text-white font-medium">15 mins</span>
              </div>
            </div>
          </Card>

          {/* Active Monitoring */}
          <Card variant="gradient">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-warning-400" />
              <h3 className="font-semibold text-white">Active Monitoring</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-surface-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-primary-400" />
                  <span className="text-sm text-surface-300">Flood Zones</span>
                </div>
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-2 bg-surface-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning-400" />
                  <span className="text-sm text-surface-300">High Risk Roads</span>
                </div>
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-2 bg-surface-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-danger-400" />
                  <span className="text-sm text-surface-300">SLA Deadlines</span>
                </div>
                <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
