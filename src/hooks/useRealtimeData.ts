"use client";

import { useState, useEffect } from 'react';
import { User, LocationData } from '@/types';
import { subscribeToUsers, subscribeToLocations } from '@/lib/firebase-admin';

export function useRealtimeUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToUsers((data) => {
        setUsers(data);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { users, loading, error };
}

export function useRealtimeLocations() {
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      const unsubscribe = subscribeToLocations((data) => {
        setLocations(data);
        setLoading(false);
      });

      return () => {
        unsubscribe();
      };
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  return { locations, loading, error };
}
