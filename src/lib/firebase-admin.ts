import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  addDoc,
  onSnapshot
} from 'firebase/firestore';
import { User, LocationData, LocationHistory, EmployeeFormData } from '@/types';

// Collection references
const usersCollection = collection(db, 'users');
const locationsCollection = collection(db, 'locations');
const locationHistoryCollection = collection(db, 'locationHistory');

// Helper to convert Firestore timestamps
const convertTimestamp = (data: any): any => {
  if (!data) return data;
  const result = { ...data };
  if (data.createdAt && typeof data.createdAt.toDate === 'function') {
    result.createdAt = data.createdAt.toDate();
  }
  if (data.updatedAt && typeof data.updatedAt.toDate === 'function') {
    result.updatedAt = data.updatedAt.toDate();
  }
  if (data.timestamp && typeof data.timestamp.toDate === 'function') {
    result.timestamp = data.timestamp.toDate();
  }
  return result;
};

export const createUser = async (userData: EmployeeFormData, uid: string): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await setDoc(userRef, {
    ...userData,
    uid,
    isActive: true,
    locationSharingEnabled: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
};

export const getUserById = async (uid: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    return { uid: userDoc.id, ...convertTimestamp(userDoc.data()) } as User;
  }
  return null;
};

export const getAllUsers = async (): Promise<User[]> => {
  const querySnapshot = await getDocs(usersCollection);
  return querySnapshot.docs.map(doc => ({ 
    uid: doc.id, 
    ...convertTimestamp(doc.data()) 
  } as User));
};

export const getActiveEmployees = async (): Promise<User[]> => {
  const q = query(usersCollection, where('role', '==', 'employee'), where('isActive', '==', true));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    uid: doc.id, 
    ...convertTimestamp(doc.data()) 
  } as User));
};

export const updateUser = async (uid: string, data: Partial<User>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  });
};

export const deleteUser = async (uid: string): Promise<void> => {
  await deleteDoc(doc(db, 'users', uid));
  await deleteDoc(doc(db, 'locations', uid));
};

export const toggleUserStatus = async (uid: string, isActive: boolean): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { 
    isActive, 
    updatedAt: Timestamp.now() 
  });
};

// Location Functions
export const saveLocation = async (locationData: Omit<LocationData, 'id'>): Promise<void> => {
  const locationRef = doc(db, 'locations', locationData.userId);
  await setDoc(locationRef, {
    ...locationData,
    timestamp: Timestamp.fromDate(locationData.timestamp),
  });

  // Also save to history
  await addDoc(locationHistoryCollection, {
    ...locationData,
    timestamp: Timestamp.fromDate(locationData.timestamp),
  });
};

export const getUserLocation = async (userId: string): Promise<LocationData | null> => {
  const locationDoc = await getDoc(doc(db, 'locations', userId));
  if (locationDoc.exists()) {
    return convertTimestamp(locationDoc.data()) as LocationData;
  }
  return null;
};

export const getAllLocations = async (): Promise<LocationData[]> => {
  const querySnapshot = await getDocs(locationsCollection);
  return querySnapshot.docs.map(doc => convertTimestamp(doc.data()) as LocationData);
};

export const getLocationHistory = async (userId: string, limit_count: number = 50): Promise<LocationHistory[]> => {
  const q = query(
    locationHistoryCollection,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(limit_count)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...convertTimestamp(doc.data()),
  } as LocationHistory));
};

// Real-time listeners
export const subscribeToLocations = (callback: (locations: LocationData[]) => void) => {
  return onSnapshot(locationsCollection, (snapshot) => {
    const locations = snapshot.docs.map(doc => convertTimestamp(doc.data()) as LocationData);
    callback(locations);
  });
};

export const subscribeToUsers = (callback: (users: User[]) => void) => {
  return onSnapshot(usersCollection, (snapshot) => {
    const users = snapshot.docs.map(doc => ({ 
      uid: doc.id, 
      ...convertTimestamp(doc.data()) 
    } as User));
    callback(users);
  });
};
