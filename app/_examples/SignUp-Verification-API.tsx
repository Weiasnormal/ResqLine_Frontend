// Example: Updated SignUp-Verification screen with API integration
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSlideIn } from '../_transitions/slideIn';
import { useUserProfile } from '../_contexts/UserProfileContext';
import { useRouter, useLocalSearchParams } from 'expo-router';

// Import API hooks
import { useVerifyOtp, useGenerateOtp } from '../_hooks/useApi';
import { formatApiError, formatPhoneForApi } from '../_utils/apiHelpers';

interface Props {
  onBack?: () => void;
  onSuccess?: () => void;
}

const SignUpVerificationWithAPI: React.FC<Props> = ({ onBack, onSuccess }) => {
  const params = useLocalSearchParams();
  const phoneNumber = (params.phoneNumber as string) ?? '';
  const firstName = (params.firstName as string) ?? '';
  const lastName = (params.lastName as string) ?? '';

  const { updateProfile } = useUserProfile();
  const router = useRouter();

  const [digits, setDigits] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);
  const slideAnimation = useSlideIn({ direction: 'right', distance: 300, duration: 280 });

  // API hooks
  const verifyOtpMutation = useVerifyOtp();
  const generateOtpMutation = useGenerateOtp();

  useEffect(() => {
    slideAnimation.slideIn();
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    let t: NodeJS.Timeout;
    if (isTimerActive && timer > 0) {
      t = setTimeout(() => setTimer(timer - 1), 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(t);
  }, [timer, isTimerActive]);

  const handleDigitChange = (index: number, value: string) => {
    if (isLocked) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all digits are entered
    if (newDigits.every(digit => digit !== '') && newDigits.join('').length === 4) {
      handleVerify(newDigits.join(''));
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && digits[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (code?: string) => {
    const otpCode = code || digits.join('');
    
    if (otpCode.length !== 4) {
      Alert.alert('Invalid Code', 'Please enter a 4-digit verification code.');
      return;
    }

    try {
      const formattedPhone = formatPhoneForApi(phoneNumber);
      
      const result = await verifyOtpMutation.mutateAsync({
        mobileNumber: formattedPhone,
        otp: otpCode,
      });

      if (result.success) {
        // Update user profile with the data
        await updateProfile({ 
          phoneNumber: formattedPhone, 
          firstName, 
          lastName 
        });

        // Navigate to success screen or main app
        if (onSuccess) {
          onSuccess();
        } else {
          router.replace('(screens)/SignUp-AccountCreated');
        }
      }
    } catch (error: any) {
      setAttempts(prev => prev + 1);
      
      if (attempts >= 2) {
        setIsLocked(true);
        Alert.alert(
          'Too Many Attempts', 
          'Please wait 5 minutes before trying again.',
          [{ text: 'OK' }]
        );
      } else {
        const errorMessage = formatApiError(error.message || 'Verification failed');
        Alert.alert('Verification Failed', errorMessage);
      }
      
      // Clear the digits for retry
      setDigits(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    try {
      const formattedPhone = formatPhoneForApi(phoneNumber);
      
      const result = await generateOtpMutation.mutateAsync({
        mobileNumber: formattedPhone,
      });

      if (result.success) {
        setTimer(60);
        setIsTimerActive(true);
        setAttempts(0);
        setIsLocked(false);
        setDigits(['', '', '', '']);
        inputRefs.current[0]?.focus();
        
        Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
      }
    } catch (error: any) {
      const errorMessage = formatApiError(error.message || 'Failed to resend code');
      Alert.alert('Resend Failed', errorMessage);
    }
  };

  const handleBack = () => {
    if (isAnimatingOut) return;
    
    setIsAnimatingOut(true);
    Animated.timing(slideAnimation.translateX, {
      toValue: 300,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      if (onBack) {
        onBack();
      } else {
        router.back();
      }
    });
  };

  const isLoading = verifyOtpMutation.isPending || generateOtpMutation.isPending;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Animated.View style={[styles.container, { transform: [{ translateX: slideAnimation.translateX }] }]}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backWrap} onPress={handleBack}>
              <Ionicons name="chevron-back" size={22} color="#444" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Verify Number</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.title}>Enter Verification Code</Text>
            <Text style={styles.subtitle}>
              We sent a 4-digit code to {phoneNumber}
            </Text>

            {/* OTP Input */}
            <View style={styles.otpContainer}>
              {digits.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                    isLocked ? styles.otpInputDisabled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleDigitChange(index, value)}
                  onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
                  keyboardType="numeric"
                  maxLength={1}
                  editable={!isLocked && !isLoading}
                  selectTextOnFocus
                />
              ))}
            </View>

            {/* Loading indicator */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#FF9427" />
                <Text style={styles.loadingText}>
                  {verifyOtpMutation.isPending ? 'Verifying...' : 'Sending code...'}
                </Text>
              </View>
            )}

            {/* Resend section */}
            <View style={styles.resendContainer}>
              {isTimerActive ? (
                <Text style={styles.timerText}>
                  Resend code in {timer}s
                </Text>
              ) : (
                <TouchableOpacity 
                  onPress={handleResendOtp} 
                  disabled={isLoading}
                  style={styles.resendButton}
                >
                  <Text style={styles.resendText}>Resend Code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Manual verify button */}
            <TouchableOpacity
              style={[
                styles.verifyButton,
                (digits.join('').length !== 4 || isLocked || isLoading) && styles.verifyButtonDisabled,
              ]}
              onPress={() => handleVerify()}
              disabled={digits.join('').length !== 4 || isLocked || isLoading}
            >
              <Text style={styles.verifyButtonText}>
                {isLoading ? 'Verifying...' : 'Verify'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
};

// Styles remain the same as original
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1 },
  flex: { flex: 1, justifyContent: 'space-between' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  backWrap: { padding: 4 },
  headerTitle: { fontSize: 14, fontFamily: 'OpenSans_600SemiBold', color: '#444' },
  body: { paddingHorizontal: 20, paddingTop: 20, flex: 1 },
  title: { 
    fontSize: 30, 
    fontFamily: 'OpenSans_700Bold', 
    color: '#111', 
    marginBottom: 8, 
    textAlign: 'center' 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#191716', 
    textAlign: 'center', 
    marginBottom: 28, 
    lineHeight: 20 
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  otpInput: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    textAlign: 'center',
    fontSize: 24,
    fontFamily: 'OpenSans_600SemiBold',
    color: '#111',
  },
  otpInputFilled: {
    borderColor: '#FF9427',
    backgroundColor: '#FFF8F0',
  },
  otpInputDisabled: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    fontFamily: 'OpenSans_400Regular',
  },
  resendContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  timerText: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'OpenSans_400Regular',
  },
  resendButton: {
    padding: 8,
  },
  resendText: {
    fontSize: 16,
    color: '#FF9427',
    fontFamily: 'OpenSans_600SemiBold',
  },
  verifyButton: {
    backgroundColor: '#FF9427',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  verifyButtonDisabled: {
    backgroundColor: '#DDD',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
});

export default SignUpVerificationWithAPI;