import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { createUser, getUserById, updateUser } from './firebase-admin';
import { EmployeeFormData, User } from '@/types';

export const registerUser = async (userData: EmployeeFormData): Promise<User> => {
  const { email, password, ...profileData } = userData;

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  await createUser(userData, firebaseUser.uid);

  const user = await getUserById(firebaseUser.uid);
  if (!user) throw new Error('Failed to create user profile');

  return user;
};

export const loginUser = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  const user = await getUserById(firebaseUser.uid);
  if (!user) throw new Error('User profile not found');
  if (!user.isActive) throw new Error('Account is deactivated. Please contact admin.');

  return user;
};

export const logoutUser = async (): Promise<void> => {
  await signOut(auth);
};

export const getCurrentUser = (): Promise<FirebaseUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export const toggleLocationSharing = async (uid: string, enabled: boolean): Promise<void> => {
  await updateUser(uid, { locationSharingEnabled: enabled });
};
