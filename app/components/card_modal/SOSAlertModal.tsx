import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
  Keyboard,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Photo, showPhotoPickerAlert } from '../../_utils/camera';

interface SOSAlertModalProps {
  visible: boolean;
  onClose: () => void;
}

const SOSAlertModal = ({ visible, onClose }: SOSAlertModalProps) => {
  const [details, setDetails] = useState('');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<Photo | null>(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  const handleAddPhoto = () => {
    showPhotoPickerAlert(
      (photo) => setPhotos([...photos, photo]),
      2,
      photos.length
    );
  };

  const handlePhotoLongPress = (photo: Photo) => {
    setPreviewPhoto(photo);
    setIsPreviewVisible(true);
  };

  const closePreview = () => {
    setIsPreviewVisible(false);
    setPreviewPhoto(null);
  };

  const deletePhotoFromPreview = () => {
    if (previewPhoto) {
      setPhotos(photos.filter(p => p.id !== previewPhoto.id));
      closePreview();
    }
  };

  const handleSendDetails = () => {
    const alertData = {
      details,
      photos: photos.map(photo => photo.uri),
      timestamp: new Date().toISOString(),
    };

    console.log('SOS Alert Details:', alertData);
    
    Alert.alert(
      'Details Sent',
      'Your additional details have been sent to emergency responders.',
      [{ 
        text: 'OK',
        onPress: () => {
          setDetails('');
          setPhotos([]);
          onClose();
        }
      }]
    );
  };

  const handleSkip = () => {
    setDetails('');
    setPhotos([]);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
          style={styles.container} 
          activeOpacity={1} 
          onPress={() => {
            if (isInputFocused) {
              Keyboard.dismiss();
              setIsInputFocused(false);
            }
          }}
        >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Help is on the way!</Text>
          <Text style={styles.headerSubtitle}>Responders have received your location.</Text>
        </View>

        {/* Content */}
        <TouchableOpacity activeOpacity={1} onPress={() => {}}>
        <View style={styles.content}>
          <Text style={styles.instructionText}>Add more information if you can.</Text>

          {/* Details Input */}
          <TextInput
            style={[styles.detailsInput, isInputFocused && styles.detailsInputFocused]}
            placeholder="Add Details (Optional)"
            placeholderTextColor="#999"
            value={details}
            onChangeText={setDetails}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            multiline
            numberOfLines={isInputFocused ? 3 : 4}
            textAlignVertical="top"
          />

          {/* Done Button - Shown when typing */}
          {isInputFocused && (
            <TouchableOpacity 
              style={styles.doneButton} 
              onPress={() => {
                Keyboard.dismiss();
                setIsInputFocused(false);
              }}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          )}

          {/* Photo Section - Hidden when typing */}
          {!isInputFocused && (
          <View style={styles.photoSection}>
            <Text style={styles.photoLabel}>Add Photo {photos.length}/2 (Optional)</Text>
            <View style={styles.photoRow}>
              {/* Square Add Photo Button */}
              <TouchableOpacity style={styles.photoButton} onPress={handleAddPhoto}>
                <Ionicons name="camera-outline" size={24} color="#FF4444" />
                <Text style={styles.photoButtonText}>Add Photo</Text>
              </TouchableOpacity>
              
              {/* Horizontal Photo List */}
              <View style={styles.photosList}>
                {photos.map((photo, index) => (
                  <TouchableOpacity 
                    key={photo.id} 
                    style={styles.photoItem}
                    onLongPress={() => handlePhotoLongPress(photo)}
                    delayLongPress={500}
                  >
                    <TouchableOpacity 
                      style={styles.closeButton}
                      onPress={() => setPhotos(photos.filter(p => p.id !== photo.id))}
                    >
                      <Ionicons name="close-circle" size={16} color="#FF4444" />
                    </TouchableOpacity>
                    <Image source={{ uri: photo.uri }} style={styles.photoThumbnail} />
                    <Text style={styles.photoName}>Photo {index + 1}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
          )}
        </View>
        </TouchableOpacity>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.sendButton} onPress={handleSendDetails}>
              <Text style={styles.sendButtonText}>Send Details</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>Skip for Now</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Photo Preview Modal */}
      {previewPhoto && (
        <Modal
          visible={isPreviewVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closePreview}
        >
          <View style={styles.modalOverlay}>
            <TouchableOpacity 
              style={styles.modalCloseArea} 
              activeOpacity={1} 
              onPress={closePreview}
            >
              <View style={styles.modalContent}>
                <TouchableOpacity 
                  style={styles.modalCloseButton} 
                  onPress={closePreview}
                >
                  <Ionicons name="close" size={30} color="#fff" />
                </TouchableOpacity>
                
                <Image 
                  source={{ uri: previewPhoto.uri }} 
                  style={styles.previewImage}
                  resizeMode="contain"
                />
                
                <View style={styles.previewFooter}>
                  <Text style={styles.previewText}>Long press photo to preview</Text>
                  <TouchableOpacity 
                    style={styles.deletePhotoButton}
                    onPress={deletePhotoFromPreview}
                  >
                    <Ionicons name="trash-outline" size={20} color="#fff" />
                    <Text style={styles.deletePhotoText}>Delete Photo</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '95%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    backgroundColor: '#FF4444',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'OpenSans_700Bold',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  content: {
    padding: 20,
    minHeight: 180,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
  },
  detailsInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 15,
    fontSize: 14,
    backgroundColor: '#fff',
    marginBottom: 10,
    height: 70,
    textAlignVertical: 'top',
  },
  detailsInputFocused: {
    height: 60,
    marginBottom: 8,
  },
  doneButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
  },
  photoSection: {
    marginBottom: 5,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  photoLabel: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    fontFamily: 'OpenSans_400Regular',
  },
  photoButton: {
    width: 85,
    height: 80,
    borderWidth: 2,
    borderColor: '#FF4444',
    borderStyle: 'dashed',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffffff',
  },
  photoButtonText: {
    color: '#FF4444',
    marginTop: 4,
    fontSize: 12,
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
  },
  photosList: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    alignItems: 'flex-start',
  },
  photoItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    minWidth: 80,
    minHeight: 80,
    position: 'relative',
  },
  photoName: {
    fontSize: 12,
    color: '#333',
    marginTop: 4,
    textAlign: 'center',
  },
  photoThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#fff',
    borderRadius: 8,
    zIndex: 1,
  },
  // Photo Preview Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  modalCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  previewImage: {
    width: '90%',
    height: '70%',
  },
  previewFooter: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  previewText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    opacity: 0.8,
  },
  deletePhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  deletePhotoText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  buttonContainer: {
    paddingTop: 0,
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#FF4444',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#FF4444',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans_700Bold',
    letterSpacing: 0.5,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 15,
  },
  skipButtonText: {
    color: '#888',
    fontSize: 15,
    fontFamily: 'OpenSans_600SemiBold',
    textDecorationLine: 'underline',
  },
});

export default SOSAlertModal;