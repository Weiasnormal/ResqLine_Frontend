import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSlideIn } from '../../src/transitions/slideIn';
import LogInVerification from './LogIn-Verification';
import { useRouter } from 'expo-router';

const LogInNumber: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [showVerifyScreen, setShowVerifyScreen] = useState(false);

  const slideAnimation = useSlideIn({
    direction: 'right',
    distance: 300,
    duration: 300,
  });

  const router = useRouter();

  useEffect(() => {
    slideAnimation.slideIn();
  }, []);

  const validatePhoneNumber = (number: string) => {
    const cleanNumber = number.replace(/\D/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 11) {
      return 'Phone number must be 10-11 digits';
    }
    return '';
  };

  const handlePhoneNumberChange = (text: string) => {
    const numericText = text.replace(/\D/g, '');
    setPhoneNumber(numericText);
    if (validationError) setValidationError('');
  };

  const handleContinue = () => {
    const error = validatePhoneNumber(phoneNumber);
    if (error) {
      setValidationError(error);
      return;
    }
    // Show verification overlay
    setShowVerifyScreen(true);
  };

  const handleBackFromVerify = () => {
    setShowVerifyScreen(false);
  };

  const handleBack = () => {
    if (isAnimatingOut) return;
    setIsAnimatingOut(true);
    Animated.timing(slideAnimation.translateX, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      router.back();
    });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffffff" />
        <Animated.View
          style={[
            styles.keyboardAvoidingView,
            { transform: [{ translateX: slideAnimation.translateX }] },
          ]}
        >
          <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="chevron-back" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Welcome Back to ResqLine!</Text>
              <View style={styles.headerSpacer} />
            </View>

            <View style={styles.headerDivider} />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
              <View style={styles.contentContainer}>
                <Text style={styles.subtitle}>
                  Quickly access your account to report emergencies and stay safe.
                </Text>

                <View style={styles.phoneInputContainer}>
                  <View style={styles.countrySelector}>
                    <Text style={styles.flagEmoji}>🇵🇭</Text>
                    <Text style={styles.countryCode}>+63</Text>
                  </View>

                  <View style={styles.phoneInputWrapper}>
                    <TextInput
                      style={[styles.phoneInput, validationError ? styles.phoneInputError : {}]}
                      placeholder="Phone number"
                      value={phoneNumber}
                      onChangeText={handlePhoneNumberChange}
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      maxLength={11}
                    />
                  </View>
                </View>

                {validationError ? <Text style={styles.errorText}>{validationError}</Text> : null}

                <Text style={styles.termsText}>
                  By entering an account, you agree to the Terms and Conditions and Privacy Policy
                </Text>
              </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={[styles.continueButton, !phoneNumber.trim() ? styles.continueButtonDisabled : {}]}
                onPress={handleContinue}
                disabled={!phoneNumber.trim()}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Animated.View>

        {showVerifyScreen && (
          <View style={styles.overlay}>
            <LogInVerification
              phoneNumber={phoneNumber}
              onBack={handleBackFromVerify}
              onSuccess={() => {
                setShowVerifyScreen(false);
                // On successful verification navigate into the app
                router.replace('(tabs)?tab=home');
              }}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffffff' },
  keyboardAvoidingView: { flex: 1 },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#000' },
  headerSpacer: { width: 32 },
  headerDivider: { height: 1, backgroundColor: '#E5E5E5' },
  scrollView: { flex: 1 },
  contentContainer: { flex: 1, paddingHorizontal: 16, paddingTop: 40 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 24, lineHeight: 22 },
  phoneInputContainer: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000000ff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    minWidth: 80,
    justifyContent: 'center',
  },
  flagEmoji: { fontSize: 16, marginRight: 6 },
  countryCode: { fontSize: 16, color: '#000', fontWeight: '500' },
  phoneInputWrapper: { flex: 1 },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#000000ff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  phoneInputError: { borderColor: '#FF4444', backgroundColor: '#FFF8F8' },
  errorText: { fontSize: 14, color: '#FF4444', marginTop: 8, marginLeft: 4 },
  termsText: { marginTop: 24, fontSize: 12, color: '#999', textAlign: 'center' },
  bottomContainer: { paddingHorizontal: 16, paddingBottom: 60, backgroundColor: '#fff' },
  continueButton: {
    backgroundColor: '#F57C00',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: { backgroundColor: '#E0E0E0' },
  continueText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
});

export default LogInNumber;