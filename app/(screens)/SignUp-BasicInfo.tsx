import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

const SignUpBasicInfo = ({ navigation }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleContinue = () => {
    // Validate and proceed
    if (phoneNumber && firstName && lastName) {
      navigation.navigate('SignUp-Verification', {
        phoneNumber: `+63${phoneNumber}`,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <MaterialIcons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Sign Up (Basic Info)</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Title */}
        <Text style={styles.title}>Create Your ResqLine Account</Text>
        <Text style={styles.subtitle}>
          First, let's enter your basic information
        </Text>

        {/* Phone Number Field */}
        <View style={styles.phoneContainer}>
          <View style={styles.countryCodeBox}>
            <Text style={styles.flag}>🇵🇭</Text>
            <Text style={styles.countryCode}>+ 63</Text>
          </View>
          <View
            style={[
              styles.phoneInputWrapper,
              focusedField === 'phone' && styles.focusedInput,
            ]}
          >
            {focusedField === 'phone' && (
              <Text style={styles.floatingLabel}>Phone number</Text>
            )}
            <TextInput
              style={styles.phoneInput}
              placeholder={focusedField !== 'phone' ? 'Phone number' : ''}
              placeholderTextColor="#999"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              onFocus={() => setFocusedField('phone')}
              onBlur={() => !phoneNumber && setFocusedField(null)}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* First Name and Last Name */}
        <View style={styles.nameRow}>
          <View
            style={[
              styles.inputWrapper,
              focusedField === 'firstName' && styles.focusedInput,
            ]}
          >
            {focusedField === 'firstName' && (
              <Text style={styles.floatingLabel}>First name</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={focusedField !== 'firstName' ? 'First name' : ''}
              placeholderTextColor="#999"
              value={firstName}
              onChangeText={setFirstName}
              onFocus={() => setFocusedField('firstName')}
              onBlur={() => !firstName && setFocusedField(null)}
            />
          </View>

          <View
            style={[
              styles.inputWrapper,
              focusedField === 'lastName' && styles.focusedInput,
            ]}
          >
            {focusedField === 'lastName' && (
              <Text style={styles.floatingLabel}>Last name</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder={focusedField !== 'lastName' ? 'Last name' : ''}
              placeholderTextColor="#999"
              value={lastName}
              onChangeText={setLastName}
              onFocus={() => setFocusedField('lastName')}
              onBlur={() => !lastName && setFocusedField(null)}
            />
          </View>
        </View>

        {/* Terms and Conditions */}
        <Text style={styles.termsText}>
          By entering an account, you agree to the{' '}
          <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
          <Text style={styles.termsLink}>Privacy Policy</Text>
        </Text>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          disabled={!phoneNumber || !firstName || !lastName}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: '#cce5ff',
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  phoneInputWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  phoneInput: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 6,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  input: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 6,
  },
  focusedInput: {
    borderColor: '#FF9427',
    backgroundColor: '#fff',
  },
  floatingLabel: {
    fontSize: 12,
    color: '#FF9427',
    fontWeight: '600',
    marginBottom: 4,
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  termsLink: {
    color: '#FF9427',
    fontWeight: '600',
  },
  continueButton: {
    width: '100%',
    backgroundColor: '#FF9427',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpBasicInfo;