import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onDelete?: () => void;
}

const DeleteConfirm: React.FC<Props> = ({ visible, onCancel, onDelete }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Deletion Confirmation</Text>
          <Text style={styles.message}>
            Deleting your account is permanent. Your reports, profile details, and history will be removed and cannot be recovered.
          </Text>

          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete?.()}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  box: {
    width: '100%',
    maxWidth: 520,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 12, textAlign: 'center' },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  deleteButton: {
    width: '100%',
    backgroundColor: '#FF4444',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButtonText: { color: '#fff', fontWeight: '700' },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
  },
});

export default DeleteConfirm;