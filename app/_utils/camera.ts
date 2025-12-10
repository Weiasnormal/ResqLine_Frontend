import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export interface Photo {
  uri: string;
  id: string;
}

/**
 * Request camera permissions and launch camera to take a photo
 * @returns Photo object or null if cancelled/failed
 */
export const takePhoto = async (): Promise<Photo | null> => {
  try {
    // Request camera permissions
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera permissions to take photos.');
      return null;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      return {
        uri: result.assets[0].uri,
        id: Date.now().toString(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert('Error', 'Failed to take photo. Please try again.');
    return null;
  }
};

/**
 * Request media library permissions and pick an image from gallery
 * @returns Photo object or null if cancelled/failed
 */
export const pickImageFromLibrary = async (): Promise<Photo | null> => {
  try {
    // Request media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'We need camera roll permissions to select photos.');
      return null;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      return {
        uri: result.assets[0].uri,
        id: Date.now().toString(),
      };
    }

    return null;
  } catch (error) {
    console.error('Error picking image:', error);
    Alert.alert('Error', 'Failed to select image. Please try again.');
    return null;
  }
};

/**
 * Show alert to choose between taking a photo or picking from library
 * @param onPhotoSelected Callback function when photo is selected
 * @param maxPhotos Maximum number of photos allowed (optional)
 * @param currentPhotoCount Current number of photos (optional)
 */
export const showPhotoPickerAlert = (
  onPhotoSelected: (photo: Photo) => void,
  maxPhotos?: number,
  currentPhotoCount?: number
) => {
  // Check if photo limit reached
  if (maxPhotos && currentPhotoCount !== undefined && currentPhotoCount >= maxPhotos) {
    Alert.alert('Photo Limit', `You can only add up to ${maxPhotos} photos.`);
    return;
  }

  Alert.alert(
    'Add Photo',
    'Choose an option',
    [
      {
        text: 'Take Photo',
        onPress: async () => {
          const photo = await takePhoto();
          if (photo) {
            onPhotoSelected(photo);
          }
        },
      },
      {
        text: 'Choose from Library',
        onPress: async () => {
          const photo = await pickImageFromLibrary();
          if (photo) {
            onPhotoSelected(photo);
          }
        },
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    { cancelable: true }
  );
};

/**
 * Take a single photo directly without showing picker alert
 * Useful for quick capture scenarios
 * @returns Photo object or null if cancelled/failed
 */
export const quickTakePhoto = async (): Promise<Photo | null> => {
  return await takePhoto();
};

/**
 * Pick a single image from library without showing alert
 * @returns Photo object or null if cancelled/failed
 */
export const quickPickImage = async (): Promise<Photo | null> => {
  return await pickImageFromLibrary();
};
