import { 
  LayoutDashboard, 
  AlertCircle, 
  MapPin, 
  BarChart3, 
  Settings, 
  HelpCircle,
  Users,
  Briefcase,
  FileText,
  Bell,
  Shield,
  Bot,
  Building,
  TrendingUp,
  Wallet,
  ClipboardList,
  Truck,
  Activity,
  Globe,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useStore, UserRole } from '../../store/useStore';
import { motion } from 'framer-motion';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  view: string;
  roles: UserRole[];
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard', roles: ['citizen', 'contractor', 'government', 'superadmin'] },
  { icon: AlertCircle, label: 'Complaints', view: 'complaints', roles: ['citizen', 'government', 'superadmin'] },
  { icon: ClipboardList, label: 'My Projects', view: 'projects', roles: ['contractor'] },
  { icon: MapPin, label: 'Map View', view: 'map', roles: ['citizen', 'contractor', 'government', 'superadmin'] },
  { icon: BarChart3, label: 'Analytics', view: 'analytics', roles: ['government', 'superadmin'] },
  { icon: Bot, label: 'AI Assistant', view: 'assistant', roles: ['citizen', 'contractor', 'government', 'superadmin'] },
  { icon: Bell, label: 'Alerts', view: 'alerts', roles: ['citizen', 'contractor', 'government', 'superadmin'], badge: 3 },
  { icon: Briefcase, label: 'Contractors', view: 'contractors', roles: ['government', 'superadmin'] },
  { icon: Truck, label: 'Work Progress', view: 'work-progress', roles: ['contractor'] },
  { icon: Wallet, label: 'Budget', view: 'budget', roles: ['contractor', 'government', 'superadmin'] },
  { icon: FileText, label: 'Reports', view: 'reports', roles: ['government', 'superadmin'] },
  { icon: Users, label: 'User Management', view: 'users', roles: ['superadmin'] },
  { icon: Building, label: 'Regions', view: 'regions', roles: ['superadmin'] },
  { icon: Globe, label: 'National View', view: 'national', roles: ['superadmin'] },
  { icon: TrendingUp, label: 'Transparency', view: 'transparency', roles: ['citizen', 'government', 'superadmin'] },
  { icon: Activity, label: 'System Health', view: 'system', roles: ['superadmin'] },
  { icon: Shield, label: 'Audit Logs', view: 'audit', roles: ['superadmin'] },
];

const bottomItems: NavItem[] = [
  { icon: Settings, label: 'Settings', view: 'settings', roles: ['citizen', 'contractor', 'government', 'superadmin'] },
  { icon: HelpCircle, label: 'Help Center', view: 'help', roles: ['citizen', 'contractor', 'government', 'superadmin'] },
];

export function Sidebar() {
  const { user, currentView, setCurrentView, sidebarOpen, setSidebarOpen } = useStore();
  
  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role || null)
  );
  
  const filteredBottomItems = bottomItems.filter(item => 
    item.roles.includes(user?.role || null)
  );

  const roleLabels: Record<string, string> = {
    citizen: 'Citizen Portal',
    contractor: 'Contractor Portal',
    government: 'Admin Portal',
    superadmin: 'Super Admin'
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 72 }}
      className="fixed left-0 top-0 h-full bg-surface-900 border-r border-surface-800 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-4 border-b border-surface-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="font-display font-bold text-white">ROAD-WATCH</h1>
              <p className="text-xs text-surface-500">{roleLabels[user?.role || ''] || 'Smart Governance'}</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto dark-scrollbar">
        {filteredNavItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              'hover:bg-surface-800 group relative',
              currentView === item.view 
                ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' 
                : 'text-surface-400'
            )}
          >
            <item.icon className={cn(
              'w-5 h-5 flex-shrink-0',
              currentView === item.view ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-300'
            )} />
            {sidebarOpen && (
              <>
                <span className="text-sm font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-danger-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-surface-800 rounded text-sm text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="p-3 border-t border-surface-800 space-y-1">
        {filteredBottomItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setCurrentView(item.view)}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
              'hover:bg-surface-800 group',
              currentView === item.view ? 'text-primary-400' : 'text-surface-400'
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="absolute -right-3 top-20 w-6 h-6 bg-surface-800 border border-surface-700 rounded-full flex items-center justify-center text-surface-400 hover:text-white hover:border-primary-500 transition-colors"
      >
        {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
}
