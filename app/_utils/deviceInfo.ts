import * as Device from 'expo-device';

/**
 * Get the device name to use as default user name
 * Returns device name or "User" as fallback
 */
export const getDeviceName = async (): Promise<string> => {
  try {
    const deviceName = await Device.deviceName;
    return deviceName || 'User';
  } catch (error) {
    console.error('Error getting device name:', error);
    return 'User';
  }
};

/**
 * Get default first and last name from device name
 * Examples: 
 * - "John's iPhone" -> { firstName: "John's", lastName: "iPhone" }
 * - "My Device" -> { firstName: "My", lastName: "Device" }
 * - "Phone" -> { firstName: "Phone", lastName: "User" }
 */
export const getDefaultNamesFromDevice = async (): Promise<{ firstName: string; lastName: string }> => {
  const deviceName = await getDeviceName();
  const parts = deviceName.split(' ');
  
  if (parts.length >= 2) {
    return {
      firstName: parts[0],
      lastName: parts.slice(1).join(' '),
    };
  } else {
    return {
      firstName: deviceName,
      lastName: 'User',
    };
  }
};
