import { useStore } from './store/useStore';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { HomePage } from './components/pages/HomePage';
import { CitizenDashboard } from './components/dashboards/CitizenDashboard';
import { ContractorDashboard } from './components/dashboards/ContractorDashboard';
import { GovernmentDashboard } from './components/dashboards/GovernmentDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';
import { ComplaintsPage } from './components/pages/ComplaintsPage';
import { MapViewPage } from './components/pages/MapViewPage';
import { AIAssistantPage } from './components/pages/AIAssistantPage';
import { AnalyticsPage } from './components/pages/AnalyticsPage';
import { AlertsPage } from './components/pages/AlertsPage';
import { motion, AnimatePresence } from 'framer-motion';

// Placeholder pages for other views
function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
          <span className="text-4xl">🚧</span>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        <p className="text-surface-400">This module is under development</p>
        <p className="text-sm text-surface-500 mt-4">Coming soon in the next release</p>
      </div>
    </div>
  );
}

function DashboardContent() {
  const { user, currentView } = useStore();

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        switch (user?.role) {
          case 'citizen':
            return <CitizenDashboard />;
          case 'contractor':
            return <ContractorDashboard />;
          case 'government':
            return <GovernmentDashboard />;
          case 'superadmin':
            return <SuperAdminDashboard />;
          default:
            return <CitizenDashboard />;
        }
      case 'complaints':
        return <ComplaintsPage />;
      case 'map':
        return <MapViewPage />;
      case 'assistant':
        return <AIAssistantPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'alerts':
        return <AlertsPage />;
      case 'projects':
        return <PlaceholderPage title="Project Management" />;
      case 'contractors':
        return <PlaceholderPage title="Contractor Management" />;
      case 'work-progress':
        return <PlaceholderPage title="Work Progress Tracking" />;
      case 'budget':
        return <PlaceholderPage title="Budget Management" />;
      case 'reports':
        return <PlaceholderPage title="Reports & Documents" />;
      case 'users':
        return <PlaceholderPage title="User Management" />;
      case 'regions':
        return <PlaceholderPage title="Region Configuration" />;
      case 'national':
        return <PlaceholderPage title="National Overview" />;
      case 'transparency':
        return <PlaceholderPage title="Transparency Portal" />;
      case 'system':
        return <PlaceholderPage title="System Health Monitor" />;
      case 'audit':
        return <PlaceholderPage title="Audit Logs" />;
      case 'settings':
        return <PlaceholderPage title="Settings" />;
      case 'help':
        return <PlaceholderPage title="Help Center" />;
      default:
        return <CitizenDashboard />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const { isAuthenticated } = useStore();

  if (!isAuthenticated) {
    return <HomePage />;
  }

  return (
    <DashboardLayout>
      <DashboardContent />
    </DashboardLayout>
  );
}
