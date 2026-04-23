import { LocationData } from '@/types';
import { saveLocation } from './firebase-admin';

const LOCATION_INTERVAL = 10 * 60 * 1000; // 10 minutes

export const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        let message = 'Unknown error';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'تم رفض إذن الوصول إلى الموقع. يرجى تفعيل خدمة الموقع.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'معلومات الموقع غير متوفرة حالياً.';
            break;
          case error.TIMEOUT:
            message = 'انتهت مهلة طلب الموقع.';
            break;
        }
        reject(new Error(message));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  });
};

export const trackLocation = async (userId: string): Promise<LocationData | null> => {
  try {
    const position = await getCurrentPosition();
    const { latitude, longitude, accuracy } = position.coords;

    const locationData: LocationData = {
      userId,
      latitude,
      longitude,
      accuracy: accuracy || undefined,
      timestamp: new Date(),
    };

    await saveLocation(locationData);
    return locationData;
  } catch (error) {
    console.error('Error tracking location:', error);
    return null;
  }
};

export const startLocationTracking = (userId: string, callback?: (location: LocationData) => void): number => {
  if (typeof window === 'undefined') return 0;

  // Track immediately
  trackLocation(userId).then(location => {
    if (location && callback) callback(location);
  });

  // Then every 10 minutes
  const intervalId = window.setInterval(async () => {
    const location = await trackLocation(userId);
    if (location && callback) callback(location);
  }, LOCATION_INTERVAL);

  return intervalId;
};

export const stopLocationTracking = (intervalId: number): void => {
  if (typeof window !== 'undefined') {
    clearInterval(intervalId);
  }
};

export const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || apiKey === 'YOUR_MAPS_API_KEY_HERE') {
      return 'عنوان غير متوفر (لا يوجد مفتاح API)';
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}&language=ar`
    );
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return 'عنوان غير معروف';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'تعذر الحصول على العنوان';
  }
};
