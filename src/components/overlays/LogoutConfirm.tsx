import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

interface Props {
  visible: boolean;
  onCancel: () => void;
  onLogout?: () => void;
}

const LogoutConfirm: React.FC<Props> = ({ visible, onCancel, onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    // call parent handler if provided
    if (onLogout) onLogout();
    // navigate to WelcomeScreen (replace stack)
    router.replace('(screens)/WelcomeScreen');
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.backdrop}>
        <View style={styles.box}>
          <Text style={styles.title}>Logout Confirmation</Text>
          <Text style={styles.message}>Are you sure you want to logout your account?</Text>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
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
  title: { fontSize: 20, fontWeight: '800', marginBottom: 8 },
  message: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 },
  logoutButton: {
    width: '100%',
    backgroundColor: '#FF9427',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButtonText: { color: '#fff', fontWeight: '700' },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    color: '#666',
    fontWeight: '600',
  },
});

export default LogoutConfirm;