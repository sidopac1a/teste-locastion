export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'employee';
  phone?: string;
  department?: string;
  isActive: boolean;
  locationSharingEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationData {
  id?: string;
  userId: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: Date;
  address?: string;
}

export interface LocationHistory {
  id: string;
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  address?: string;
}

export interface EmployeeFormData {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
  department?: string;
  role: 'admin' | 'employee';
}

export interface MapMarker {
  id: string;
  position: [number, number];
  name: string;
  status: 'active' | 'inactive';
  lastUpdate: Date;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}
