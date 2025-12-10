import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSlideIn } from '../_transitions/slideIn';
import { useRouter } from 'expo-router';
import InlineTextField from '../components/inputs/InlineTextField';

// Import API hooks and utilities
import { useRegister, useGenerateOtp } from '../_hooks/useApi';
import { formatApiError, formatPhoneForApi } from '../_utils/apiHelpers';
import { notificationManager, DomainEventType } from '../_utils/notificationManager';
import { redirectIfAuthenticated } from '../_utils/authGuard';

const SignUpBasicInfo: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  // API hooks
  const registerMutation = useRegister();
  const generateOtpMutation = useGenerateOtp();

  // validate like ChangeNumberScreen: require exactly 10 digits (local number without country code)
  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length !== 10) return 'Phone number must be 10 digits';
    return '';
  };

  // compute current phone error string once
  const phoneError = validatePhoneNumber(phoneNumber);

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/\D/g, '');
    setPhoneNumber(numericText);
  };

  const slideAnimation = useSlideIn({
    direction: 'right',
    distance: 300,
    duration: 300,
  });

  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already authenticated
    redirectIfAuthenticated();
    slideAnimation.slideIn();
  }, []);

  const isPhoneValid = validatePhoneNumber(phoneNumber) === '';
  const isLoading = registerMutation.isPending || generateOtpMutation.isPending;

  const handleContinue = async () => {
    setPhoneTouched(true);
    if (!isPhoneValid || !firstName || !lastName) return;
    
    try {
      const formattedPhone = formatPhoneForApi(`+63${phoneNumber}`);
      
      // Step 1: Register user
      const registerResult = await registerMutation.mutateAsync({
        mobileNumber: formattedPhone,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      if (registerResult.success) {
        // Trigger UserRegistered domain event notification
        const userId = registerResult.data || '';
        await notificationManager.handleDomainEvent({
          eventId: Date.now().toString(),
          eventType: DomainEventType.UserRegistered,
          aggregateId: userId,
          aggregateType: 'User',
          timestamp: new Date().toISOString(),
          data: {
            firstName,
            lastName,
            mobileNumber: formattedPhone,
          },
          correlationId: '',
        });

        // Step 2: Generate OTP for verification
        const otpResult = await generateOtpMutation.mutateAsync({
          mobileNumber: formattedPhone,
        });

        if (otpResult.success) {
          // Navigate to verification screen with user data
          const path = `(screens)/SignUp-Verification?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&phoneNumber=${encodeURIComponent(formattedPhone)}`;
          router.push(path);
        }
      }
    } catch (error: any) {
      const errorMessage = formatApiError(error.message || 'Registration failed');
      Alert.alert('Registration Error', errorMessage);
    }
  };

  const handleBack = () => {
    if (isAnimatingOut) return;
    setIsAnimatingOut(true);
    Animated.timing(slideAnimation.translateX, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => router.back());
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View style={[styles.keyboardAvoidingView, { transform: [{ translateX: slideAnimation.translateX }] }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="chevron-back" size={24} color="#191716" />
          </TouchableOpacity>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Create Your ResqLine Account</Text>
            <Text style={styles.subtitle}>First, let's enter your basic information</Text>

            <View style={styles.phoneContainer}>
              <View style={styles.countryCodeBox}>
                <Text style={styles.flag}>🇵🇭</Text>
                <Text style={styles.countryCode}>+ 63</Text>
              </View>

              <InlineTextField
                label="Phone number"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                containerStyle={styles.phoneInputWrapper}
                keyboardType="phone-pad"
                maxLength={10}
                focusColor="#FF9427"
                baseLabelColor="#999"
                onBlur={() => setPhoneTouched(true)}
              />
              {/* assistive/error text is rendered outside the InlineTextField so it can sit under the country code box */}
            </View>

            {phoneTouched && phoneError ? (
              <Text style={styles.phoneError}>{phoneError}</Text>
            ) : null}

            <View style={styles.nameRow}>
              <InlineTextField
                label="First name"
                value={firstName}
                onChangeText={setFirstName}
                containerStyle={styles.inputWrapper}
                autoCapitalize="words"
                focusColor="#FF9427"
                baseLabelColor="#999"
              />

              <InlineTextField
                label="Last name"
                value={lastName}
                onChangeText={setLastName}
                containerStyle={styles.inputWrapper}
                autoCapitalize="words"
                focusColor="#FF9427"
                baseLabelColor="#999"
              />
            </View>

            <Text style={styles.termsText}>
              By entering an account, you agree to the{' '}
              <Text style={styles.termsLink}>Terms and Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
        </KeyboardAvoidingView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton, 
              (!isPhoneValid || !firstName || !lastName || isLoading) ? styles.continueButtonDisabled : null
            ]}
            onPress={handleContinue}
            disabled={!isPhoneValid || !firstName || !lastName || isLoading}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={[styles.continueButtonText, { marginLeft: 8 }]}>
                  {registerMutation.isPending ? 'Registering...' : 'Sending code...'}
                </Text>
              </View>
            ) : (
              <Text style={styles.continueButtonText}>Continue</Text>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
  },
  keyboardAvoidingView: { flex: 1 },
  flex: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: { padding: 4 },
  headerSpacer: { width: 32 },
  title: {
    fontSize: 30,
    fontFamily: 'OpenSans_700Bold',
    color: '#191716',
  },
  subtitle: {
    fontSize: 16,
    color: '#191716',
    marginBottom: 18,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  countryCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5ff',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#cce5ff',
  },
  flag: {
    fontSize: 20,
  },
  countryCode: {
    fontSize: 14,
    fontFamily: 'OpenSans_600SemiBold',
    color: '#333',
  },
  phoneInputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    marginBottom: 22,
    marginTop: 20,
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  termsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 18,
  },
  termsLink: {
    color: '#FF9427',
    fontFamily: 'OpenSans_600SemiBold',
  },
  footer: { paddingHorizontal: 20, paddingVertical: 16 },
  continueButton: {
    width: '100%',
    backgroundColor: '#FF9427',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  continueButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phoneError: {
    fontSize: 14,
    color: '#FF3D00',
    marginTop: 8,
    marginLeft: 10,
  },
});

export default SignUpBasicInfo;