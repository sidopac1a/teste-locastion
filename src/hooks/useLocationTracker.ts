"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { LocationData } from '@/types';
import { trackLocation, startLocationTracking, stopLocationTracking } from '@/lib/location';

interface UseLocationTrackerProps {
  userId: string;
  enabled: boolean;
}

export function useLocationTracker({ userId, enabled }: UseLocationTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isMounted = useRef(true);

  const startTracking = useCallback(() => {
    if (!userId || !enabled || typeof window === 'undefined') return;

    setIsTracking(true);
    setError(null);

    // Track immediately
    trackLocation(userId).then(location => {
      if (isMounted.current && location) {
        setCurrentLocation(location);
      }
    }).catch(err => {
      if (isMounted.current) {
        setError(err.message || 'فشل تحديد الموقع');
      }
    });

    // Then every 10 minutes
    intervalRef.current = startLocationTracking(userId, (location) => {
      if (isMounted.current) {
        setCurrentLocation(location);
      }
    });
  }, [userId, enabled]);

  const stopTracking = useCallback(() => {
    if (intervalRef.current !== null) {
      stopLocationTracking(intervalRef.current);
      intervalRef.current = null;
    }
    if (isMounted.current) {
      setIsTracking(false);
    }
  }, []);

  const updateLocation = useCallback(async () => {
    if (!userId || typeof window === 'undefined') return;

    try {
      setError(null);
      const location = await trackLocation(userId);
      if (isMounted.current) {
        if (location) {
          setCurrentLocation(location);
        } else {
          setError('تعذر الحصول على الموقع. تأكد من تفعيل خدمة الموقع في جهازك.');
        }
      }
    } catch (err: any) {
      if (isMounted.current) {
        setError(err.message || 'حدث خطأ أثناء تحديث الموقع');
      }
    }
  }, [userId]);

  useEffect(() => {
    isMounted.current = true;

    if (enabled && userId) {
      startTracking();
    } else {
      stopTracking();
    }

    return () => {
      isMounted.current = false;
      stopTracking();
    };
  }, [enabled, userId, startTracking, stopTracking]);

  return {
    currentLocation,
    isTracking,
    error,
    updateLocation,
    startTracking,
    stopTracking,
  };
}
