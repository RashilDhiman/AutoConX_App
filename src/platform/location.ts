import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type CurrentLocation =
  | { status: 'ready'; latitude: number; longitude: number; label: string }
  | { status: 'denied'; message: string }
  | { status: 'unavailable'; message: string };

const DENIED_MESSAGE =
  'Location permission is off. Enter the address manually.';
const UNAVAILABLE_MESSAGE =
  'Current location is unavailable. Enter the address manually.';

let permissionDenied = false;

export function resetLocationSession() {
  permissionDenied = false;
}

export function formatCoordinates(latitude: number, longitude: number) {
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

function positionDenied(code: number) {
  return code === 1;
}

async function requestAndroidPermission() {
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Location permission',
      message:
        'AutoConX uses your location to fill the inspection address. You can type an address instead.',
      buttonPositive: 'Allow',
      buttonNegative: 'Deny',
    },
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

function requestIosPermission() {
  Geolocation.setRNConfiguration({
    skipPermissionRequests: false,
    authorizationLevel: 'whenInUse',
    enableBackgroundLocationUpdates: false,
  });

  return new Promise<boolean>((resolve, reject) => {
    Geolocation.requestAuthorization(
      () => resolve(true),
      error => {
        if (positionDenied(error.code)) {
          resolve(false);
          return;
        }
        reject(error);
      },
    );
  });
}

function readCoordinates() {
  return new Promise<{ latitude: number; longitude: number }>(
    (resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        error => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    },
  );
}

/**
 * Foreground location only. Coordinates are not a street address.
 * This app does not call a reverse-geocoding service.
 */
export async function requestCurrentLocation(): Promise<CurrentLocation> {
  if (permissionDenied) {
    return { status: 'denied', message: DENIED_MESSAGE };
  }

  try {
    const granted =
      Platform.OS === 'android'
        ? await requestAndroidPermission()
        : await requestIosPermission();

    if (!granted) {
      permissionDenied = true;
      return { status: 'denied', message: DENIED_MESSAGE };
    }

    const coords = await readCoordinates();
    return {
      status: 'ready',
      latitude: coords.latitude,
      longitude: coords.longitude,
      label: formatCoordinates(coords.latitude, coords.longitude),
    };
  } catch (error) {
    const code =
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      typeof error.code === 'number'
        ? error.code
        : 2;

    if (positionDenied(code)) {
      permissionDenied = true;
      return { status: 'denied', message: DENIED_MESSAGE };
    }

    if (__DEV__) {
      console.warn('Location request failed', error);
    }

    return { status: 'unavailable', message: UNAVAILABLE_MESSAGE };
  }
}
