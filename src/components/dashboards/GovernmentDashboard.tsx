import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  Wallet,
  Shield,
  BarChart3,
  Target,
  AlertTriangle,
  Eye,
  Calendar,
  ArrowUpRight,
  Bot,
  Activity,
  Zap
} from 'lucide-react';
import { Card, StatCard } from '../ui/Card';
import { Button } from '../ui/Button';
import { StatusBadge, SeverityBadge } from '../ui/Badge';
import { CircularProgress } from '../ui/Progress';
import { BarChartComponent, LineChartComponent, DonutChartComponent } from '../charts/Charts';
import { useStore } from '../../store/useStore';

export function GovernmentDashboard() {
  const { complaints, contractors, projects, user, setCurrentView } = useStore();

  const pendingComplaints = complaints.filter(c => c.status === 'pending');
  const criticalComplaints = complaints.filter(c => c.severity === 'critical');
  const totalBudget = 45000000;
  const utilized = 32500000;

  const complaintsByCategory = [
    { name: 'Pothole', value: 234 },
    { name: 'Street Light', value: 156 },
    { name: 'Drainage', value: 89 },
    { name: 'Crack', value: 67 },
    { name: 'Other', value: 45 }
  ];

  const districtData = [
    { name: 'Bangalore Urban', complaints: 456, resolved: 380, budget: 12000000 },
    { name: 'Bangalore Rural', complaints: 234, resolved: 198, budget: 8000000 },
    { name: 'Mysore', complaints: 189, resolved: 156, budget: 7500000 },
    { name: 'Hubli', complaints: 145, resolved: 120, budget: 6000000 },
    { name: 'Mangalore', complaints: 167, resolved: 142, budget: 6500000 }
  ];

  const trendData = [
    { name: 'Mon', complaints: 45, resolved: 38 },
    { name: 'Tue', complaints: 52, resolved: 45 },
    { name: 'Wed', complaints: 48, resolved: 42 },
    { name: 'Thu', complaints: 61, resolved: 50 },
    { name: 'Fri', complaints: 55, resolved: 48 },
    { name: 'Sat', complaints: 32, resolved: 30 },
    { name: 'Sun', complaints: 28, resolved: 25 }
  ];

  const slaMetrics = [
    { label: 'Within SLA', value: 78, color: 'success' as const },
    { label: 'Approaching', value: 15, color: 'warning' as const },
    { label: 'Breached', value: 7, color: 'danger' as const }
  ];

  const topContractors = contractors.slice(0, 3).map((c, i) => ({
    ...c,
    rank: i + 1
  }));

  const hotspotZones = [
    { zone: 'MG Road Junction', issues: 45, severity: 'critical', trend: 'up' },
    { zone: 'Silk Board', issues: 38, severity: 'high', trend: 'stable' },
    { zone: 'Marathahalli', issues: 32, severity: 'high', trend: 'down' },
    { zone: 'Electronic City', issues: 28, severity: 'medium', trend: 'up' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white">Government Admin Dashboard</h1>
          <p className="text-surface-400">{user?.district} • {user?.state} • Last updated: 2 mins ago</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={<BarChart3 className="w-4 h-4" />} onClick={() => setCurrentView('reports')}>
            Reports
          </Button>
          <Button icon={<Eye className="w-4 h-4" />} onClick={() => setCurrentView('analytics')}>
            Advanced Analytics
          </Button>
        </div>
      </motion.div>

      {/* Critical Alert Banner */}
      {criticalComplaints.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger-500/10 border border-danger-500/30 rounded-xl p-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-danger-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger-400" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-danger-400">{criticalComplaints.length} Critical Issues Require Immediate Attention</p>
              <p className="text-sm text-surface-400">Average response time exceeded by 48 hours</p>
            </div>
            <Button variant="danger" size="sm">View All</Button>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <StatCard
            title="Total Complaints"
            value={complaints.length}
            change="+12% this week"
            changeType="negative"
            icon={<AlertCircle className="w-5 h-5 text-white" />}
            iconBg="from-primary-500 to-primary-600"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <StatCard
            title="Pending Verification"
            value={pendingComplaints.length}
            change="15 new today"
            changeType="neutral"
            icon={<Clock className="w-5 h-5 text-white" />}
            iconBg="from-warning-500 to-warning-600"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <StatCard
            title="Resolution Rate"
            value="82%"
            change="+5% improvement"
            changeType="positive"
            icon={<CheckCircle className="w-5 h-5 text-white" />}
            iconBg="from-accent-500 to-accent-600"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <StatCard
            title="Active Contractors"
            value={contractors.length}
            change={`${projects.filter(p => p.status === 'in_progress').length} ongoing`}
            changeType="neutral"
            icon={<Truck className="w-5 h-5 text-white" />}
            iconBg="from-purple-500 to-purple-600"
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <StatCard
            title="Budget Utilized"
            value={`${((utilized / totalBudget) * 100).toFixed(0)}%`}
            change={`₹${(utilized / 10000000).toFixed(1)}Cr spent`}
            changeType="neutral"
            icon={<Wallet className="w-5 h-5 text-white" />}
            iconBg="from-cyan-500 to-cyan-600"
          />
        </motion.div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Pending Complaints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card variant="gradient" padding="none">
            <div className="p-5 border-b border-surface-700/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="font-semibold text-white">Complaints Requiring Action</h2>
                <span className="px-2 py-0.5 bg-warning-500/20 text-warning-400 text-xs rounded-full">
                  {pendingComplaints.length} pending
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('complaints')}>
                View All
              </Button>
            </div>
            <div className="divide-y divide-surface-700/50 max-h-96 overflow-y-auto">
              {complaints.slice(0, 5).map((complaint) => (
                <div key={complaint.id} className="p-4 hover:bg-surface-800/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-surface-500">{complaint.id}</span>
                        <SeverityBadge severity={complaint.severity} />
                        <StatusBadge status={complaint.status} />
                      </div>
                      <h3 className="font-medium text-white">{complaint.title}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-surface-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {complaint.location.district}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(complaint.reportedAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" />
                          {complaint.votes} votes
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Verify</Button>
                      <Button size="sm">Assign</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* SLA Compliance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="gradient">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">SLA Compliance</h2>
              <Shield className="w-5 h-5 text-surface-400" />
            </div>
            <div className="flex justify-center mb-4">
              <CircularProgress value={78} size={120} strokeWidth={12} variant="success" />
            </div>
            <div className="space-y-3">
              {slaMetrics.map((metric) => (
                <div key={metric.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${
                      metric.color === 'success' ? 'bg-accent-400' :
                      metric.color === 'warning' ? 'bg-warning-400' : 'bg-danger-400'
                    }`} />
                    <span className="text-sm text-surface-300">{metric.label}</span>
                  </div>
                  <span className="font-medium text-white">{metric.value}%</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-surface-800/50 rounded-lg">
              <p className="text-xs text-surface-400">Average Resolution Time</p>
              <p className="text-lg font-bold text-white">4.2 days</p>
              <p className="text-xs text-accent-400">↓ 0.8 days from last month</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card variant="gradient">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Weekly Complaint Trend</h2>
              <Activity className="w-5 h-5 text-surface-400" />
            </div>
            <LineChartComponent
              data={trendData}
              lines={[
                { dataKey: 'complaints', color: '#f59e0b', name: 'Complaints' },
                { dataKey: 'resolved', color: '#10b981', name: 'Resolved' }
              ]}
              xAxisKey="name"
              height={220}
            />
          </Card>
        </motion.div>

        {/* Complaints by Category */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card variant="gradient">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Complaints by Category</h2>
              <Target className="w-5 h-5 text-surface-400" />
            </div>
            <DonutChartComponent
              data={complaintsByCategory}
              dataKey="value"
              nameKey="name"
              centerValue="591"
              centerLabel="Total"
              height={220}
            />
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* District Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="lg:col-span-2"
        >
          <Card variant="gradient">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">District Performance</h2>
              <Button variant="ghost" size="sm">
                <BarChart3 className="w-4 h-4" />
                Export
              </Button>
            </div>
            <BarChartComponent
              data={districtData}
              dataKey="complaints"
              xAxisKey="name"
              barColor="#3b82f6"
              height={200}
            />
          </Card>
        </motion.div>

        {/* Hotspot Zones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <Card variant="gradient">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-warning-400" />
              <h2 className="font-semibold text-white">Hotspot Zones</h2>
            </div>
            <div className="space-y-3">
              {hotspotZones.map((zone, i) => (
                <div key={i} className="p-3 bg-surface-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-white">{zone.zone}</p>
                    <SeverityBadge severity={zone.severity} />
                  </div>
                  <div className="flex items-center justify-between text-xs text-surface-400">
                    <span>{zone.issues} active issues</span>
                    <span className="flex items-center gap-1">
                      {zone.trend === 'up' ? (
                        <TrendingUp className="w-3 h-3 text-danger-400" />
                      ) : zone.trend === 'down' ? (
                        <TrendingDown className="w-3 h-3 text-accent-400" />
                      ) : (
                        <span className="w-3 h-0.5 bg-surface-500" />
                      )}
                      {zone.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => setCurrentView('map')}>
              View Heatmap
            </Button>
          </Card>
        </motion.div>
      </div>

      {/* Top Contractors & AI Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Contractors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <Card variant="gradient">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-white">Top Performing Contractors</h2>
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('contractors')}>
                View All
              </Button>
            </div>
            <div className="space-y-3">
              {topContractors.map((contractor) => (
                <div key={contractor.id} className="p-3 bg-surface-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                      contractor.rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                      contractor.rank === 2 ? 'bg-gradient-to-br from-surface-400 to-surface-500' :
                      'bg-gradient-to-br from-orange-600 to-orange-700'
                    }`}>
                      {contractor.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{contractor.company}</p>
                      <p className="text-xs text-surface-400">{contractor.completedProjects} projects completed</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-accent-400">{contractor.performanceScore}%</p>
                      <p className="text-xs text-surface-500">Score</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
        >
          <Card variant="gradient">
            <div className="flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-primary-400" />
              <h2 className="font-semibold text-white">AI Insights & Predictions</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                <p className="text-sm text-white font-medium">Predictive Alert</p>
                <p className="text-xs text-surface-400 mt-1">
                  Based on weather patterns and road usage, expect 15% increase in pothole complaints in HSR Layout next week.
                </p>
              </div>
              <div className="p-3 bg-warning-500/10 border border-warning-500/20 rounded-lg">
                <p className="text-sm text-white font-medium">Resource Optimization</p>
                <p className="text-xs text-surface-400 mt-1">
                  Consider reallocating 2 contractors from Mysore to Bangalore Urban for better SLA compliance.
                </p>
              </div>
              <div className="p-3 bg-accent-500/10 border border-accent-500/20 rounded-lg">
                <p className="text-sm text-white font-medium">Cost Savings Opportunity</p>
                <p className="text-xs text-surface-400 mt-1">
                  Bulk repair of 12 nearby potholes could save ₹2.3L compared to individual repairs.
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => setCurrentView('assistant')}>
              Ask AI Assistant
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
