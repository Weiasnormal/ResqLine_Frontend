import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert, Clipboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HotlineCardProps {
  department: {
    name: string;
    address: string;
    contacts: string[];
  };
}

const HotlineCard: React.FC<HotlineCardProps> = ({ department }) => {
  const handleCall = (phoneNumber: string) => {
    const cleanNumber = phoneNumber.replace(/[^\d+]/g, '');
    Linking.openURL(`tel:${cleanNumber}`);
  };

  const handleCopy = async (phoneNumber: string) => {
    try {
      await Clipboard.setString(phoneNumber);
      Alert.alert('Copied', 'Phone number copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDirection = () => {
    // Open maps app with department address
    const encodedAddress = encodeURIComponent(department.address);
    Linking.openURL(`maps:0,0?q=${encodedAddress}`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.departmentName}>{department.name}</Text>
      <Text style={styles.address}>{department.address}</Text>
      
      <View style={styles.contactsContainer}>
        {department.contacts.map((contact, index) => (
          <View key={index} style={styles.contactRow}>
            <Text style={styles.contactNumber}>{contact}</Text>
            <View style={styles.contactActions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.callButton]} 
                onPress={() => handleCall(contact)}
                activeOpacity={0.7}
              >
                <Ionicons name="call" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.copyButton]} 
                onPress={() => handleCopy(contact)}
                activeOpacity={0.7}
              >
                <Ionicons name="copy" size={20} color="#FF8C42" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.directionButton} 
        onPress={handleDirection}
        activeOpacity={0.7}
      >
        <Ionicons name="location-outline" size={18} color="#FF8C42" />
        <Text style={styles.directionText}>Direction</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#696969ff',
  },
  departmentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  directionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FF8C42',
    marginTop: 16,
  },
  directionText: {
    fontSize: 14,
    color: '#FF8C42',
    fontWeight: '500',
    marginLeft: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 8,
  },
  contactsContainer: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactNumber: {
    fontSize: 16,
    fontWeight: '400',
    color: '#1A1A1A',
    flex: 1,
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  callButton: {
    backgroundColor: '#FF8C42',
    borderColor: '#FF8C42',
  },
  copyButton: {
    backgroundColor: '#ffffff',
    borderColor: '#FF8C42',
  },
});

export default HotlineCard;