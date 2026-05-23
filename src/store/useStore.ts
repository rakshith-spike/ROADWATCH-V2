import { create } from 'zustand';

export type UserRole = 'citizen' | 'contractor' | 'government' | 'superadmin' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  district?: string;
  state?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: 'pothole' | 'crack' | 'flooding' | 'debris' | 'streetlight' | 'drainage' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'verified' | 'assigned' | 'in_progress' | 'resolved' | 'rejected';
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
    state: string;
  };
  images: string[];
  reportedBy: string;
  reportedAt: string;
  assignedTo?: string;
  resolvedAt?: string;
  aiAnalysis?: {
    category: string;
    severity: string;
    estimatedCost: number;
    priority: number;
    duplicateOf?: string;
  };
  votes: number;
  comments: number;
}

export interface Contractor {
  id: string;
  name: string;
  company: string;
  license: string;
  rating: number;
  completedProjects: number;
  activeProjects: number;
  totalBudget: number;
  regions: string[];
  specialization: string[];
  performanceScore: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  contractor: string;
  budget: number;
  spent: number;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'delayed' | 'on_hold';
  progress: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
  };
  complaints: string[];
  milestones: {
    title: string;
    completed: boolean;
    date: string;
  }[];
}

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  
  // Data
  complaints: Complaint[];
  contractors: Contractor[];
  projects: Project[];
  
  // UI
  sidebarOpen: boolean;
  currentView: string;
  notifications: { id: string; title: string; message: string; type: string; read: boolean }[];
  
  // Actions
  setUser: (user: User | null) => void;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentView: (view: string) => void;
  addComplaint: (complaint: Complaint) => void;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  markNotificationRead: (id: string) => void;
}

// Mock data
const mockComplaints: Complaint[] = [
  {
    id: 'C001',
    title: 'Large Pothole on MG Road',
    description: 'Dangerous pothole causing accidents near the junction',
    category: 'pothole',
    severity: 'critical',
    status: 'in_progress',
    location: { lat: 12.9716, lng: 77.5946, address: 'MG Road, Bangalore', district: 'Bangalore Urban', state: 'Karnataka' },
    images: [],
    reportedBy: 'user1',
    reportedAt: '2024-01-15T10:30:00Z',
    assignedTo: 'contractor1',
    aiAnalysis: { category: 'pothole', severity: 'critical', estimatedCost: 50000, priority: 95 },
    votes: 234,
    comments: 45
  },
  {
    id: 'C002',
    title: 'Street Light Not Working',
    description: 'Multiple street lights not functioning for 2 weeks',
    category: 'streetlight',
    severity: 'medium',
    status: 'assigned',
    location: { lat: 12.9352, lng: 77.6245, address: 'Koramangala 5th Block', district: 'Bangalore Urban', state: 'Karnataka' },
    images: [],
    reportedBy: 'user2',
    reportedAt: '2024-01-14T14:20:00Z',
    assignedTo: 'contractor2',
    aiAnalysis: { category: 'streetlight', severity: 'medium', estimatedCost: 15000, priority: 60 },
    votes: 89,
    comments: 12
  },
  {
    id: 'C003',
    title: 'Road Crack Spreading Fast',
    description: 'Major crack in road surface extending over 50 meters',
    category: 'crack',
    severity: 'high',
    status: 'verified',
    location: { lat: 12.9081, lng: 77.6476, address: 'HSR Layout Sector 2', district: 'Bangalore Urban', state: 'Karnataka' },
    images: [],
    reportedBy: 'user3',
    reportedAt: '2024-01-13T09:15:00Z',
    aiAnalysis: { category: 'crack', severity: 'high', estimatedCost: 120000, priority: 82 },
    votes: 156,
    comments: 28
  },
  {
    id: 'C004',
    title: 'Drainage Overflow Issue',
    description: 'Storm drain overflowing during rains causing flooding',
    category: 'drainage',
    severity: 'high',
    status: 'pending',
    location: { lat: 12.9698, lng: 77.7500, address: 'Whitefield Main Road', district: 'Bangalore Urban', state: 'Karnataka' },
    images: [],
    reportedBy: 'user4',
    reportedAt: '2024-01-12T16:45:00Z',
    aiAnalysis: { category: 'drainage', severity: 'high', estimatedCost: 200000, priority: 78 },
    votes: 312,
    comments: 67
  },
  {
    id: 'C005',
    title: 'Road Construction Debris',
    description: 'Construction debris blocking half the road',
    category: 'debris',
    severity: 'medium',
    status: 'resolved',
    location: { lat: 12.9279, lng: 77.6271, address: 'Indiranagar 100ft Road', district: 'Bangalore Urban', state: 'Karnataka' },
    images: [],
    reportedBy: 'user5',
    reportedAt: '2024-01-10T11:00:00Z',
    resolvedAt: '2024-01-11T15:30:00Z',
    aiAnalysis: { category: 'debris', severity: 'medium', estimatedCost: 25000, priority: 55 },
    votes: 78,
    comments: 15
  }
];

const mockContractors: Contractor[] = [
  {
    id: 'contractor1',
    name: 'Rajesh Kumar',
    company: 'Kumar Infrastructure Pvt Ltd',
    license: 'KA-INFRA-2021-001',
    rating: 4.5,
    completedProjects: 45,
    activeProjects: 3,
    totalBudget: 25000000,
    regions: ['Bangalore Urban', 'Bangalore Rural'],
    specialization: ['Road Repair', 'Drainage Systems'],
    performanceScore: 87
  },
  {
    id: 'contractor2',
    name: 'Priya Sharma',
    company: 'Sharma Constructions',
    license: 'KA-INFRA-2020-042',
    rating: 4.8,
    completedProjects: 62,
    activeProjects: 5,
    totalBudget: 45000000,
    regions: ['Bangalore Urban', 'Mysore'],
    specialization: ['Street Lighting', 'Road Construction'],
    performanceScore: 92
  },
  {
    id: 'contractor3',
    name: 'Mohammed Ali',
    company: 'Ali Roads & Bridges',
    license: 'KA-INFRA-2019-087',
    rating: 4.2,
    completedProjects: 38,
    activeProjects: 2,
    totalBudget: 18000000,
    regions: ['Bangalore Urban'],
    specialization: ['Bridge Repair', 'Road Repair'],
    performanceScore: 78
  }
];

const mockProjects: Project[] = [
  {
    id: 'P001',
    title: 'MG Road Pothole Repair',
    description: 'Emergency repair of critical potholes on MG Road stretch',
    contractor: 'contractor1',
    budget: 500000,
    spent: 320000,
    startDate: '2024-01-16',
    endDate: '2024-01-25',
    status: 'in_progress',
    progress: 65,
    location: { lat: 12.9716, lng: 77.5946, address: 'MG Road', district: 'Bangalore Urban' },
    complaints: ['C001'],
    milestones: [
      { title: 'Site Inspection', completed: true, date: '2024-01-16' },
      { title: 'Material Procurement', completed: true, date: '2024-01-17' },
      { title: 'Repair Work', completed: false, date: '2024-01-20' },
      { title: 'Quality Check', completed: false, date: '2024-01-24' }
    ]
  },
  {
    id: 'P002',
    title: 'Koramangala Street Light Restoration',
    description: 'Restoration of non-functional street lights in 5th Block',
    contractor: 'contractor2',
    budget: 150000,
    spent: 45000,
    startDate: '2024-01-18',
    endDate: '2024-01-22',
    status: 'in_progress',
    progress: 30,
    location: { lat: 12.9352, lng: 77.6245, address: 'Koramangala 5th Block', district: 'Bangalore Urban' },
    complaints: ['C002'],
    milestones: [
      { title: 'Assessment', completed: true, date: '2024-01-18' },
      { title: 'Equipment Setup', completed: false, date: '2024-01-19' },
      { title: 'Installation', completed: false, date: '2024-01-21' }
    ]
  }
];

export const useStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  complaints: mockComplaints,
  contractors: mockContractors,
  projects: mockProjects,
  sidebarOpen: true,
  currentView: 'dashboard',
  notifications: [
    { id: '1', title: 'New Complaint Assigned', message: 'Pothole repair on MG Road assigned to you', type: 'info', read: false },
    { id: '2', title: 'SLA Warning', message: 'Complaint C003 approaching deadline', type: 'warning', read: false },
    { id: '3', title: 'Project Completed', message: 'Indiranagar debris clearance completed', type: 'success', read: true }
  ],

  // Actions
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  
  login: async (_email, _password, role) => {
    // For demo mode, use predefined credentials based on role
    const demoCredentials: Record<string, { email: string; password: string }> = {
      citizen: { email: 'citizen@demo.com', password: 'demo123' },
      contractor: { email: 'contractor@demo.com', password: 'demo123' },
      government: { email: 'admin@demo.com', password: 'demo123' },
      superadmin: { email: 'superadmin@demo.com', password: 'demo123' }
    };
    
    const creds = demoCredentials[role || 'citizen'];
    
    try {
      // Try to login via API
      const { api } = await import('../services/api');
      const response = await api.login(creds.email, creds.password);
      
      set({ 
        user: {
          id: response.user._id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role as UserRole,
          district: response.user.district,
          state: response.user.state
        }, 
        isAuthenticated: true 
      });
    } catch (error) {
      // Fallback to mock data if API is not available
      console.log('API not available, using mock data');
      const mockUsers: Record<string, User> = {
        citizen: { id: 'u1', name: 'Amit Patel', email: 'amit@example.com', role: 'citizen', district: 'Bangalore Urban', state: 'Karnataka' },
        contractor: { id: 'u2', name: 'Rajesh Kumar', email: 'rajesh@kumar-infra.com', role: 'contractor', district: 'Bangalore Urban', state: 'Karnataka' },
        government: { id: 'u3', name: 'Dr. Ananya Reddy', email: 'ananya@gov.kar.in', role: 'government', district: 'Bangalore Urban', state: 'Karnataka' },
        superadmin: { id: 'u4', name: 'System Admin', email: 'admin@roadwatch.gov.in', role: 'superadmin', state: 'National' }
      };
      
      set({ user: mockUsers[role || 'citizen'], isAuthenticated: true });
    }
  },
  
  logout: async () => {
    try {
      const { api } = await import('../services/api');
      api.logout();
    } catch (e) {
      // ignore
    }
    set({ user: null, isAuthenticated: false });
  },
  
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  setCurrentView: (view) => set({ currentView: view }),
  
  addComplaint: (complaint) => set((state) => ({ 
    complaints: [complaint, ...state.complaints] 
  })),
  
  updateComplaint: (id, updates) => set((state) => ({
    complaints: state.complaints.map((c) => 
      c.id === id ? { ...c, ...updates } : c
    )
  })),
  
  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    )
  }))
}));
