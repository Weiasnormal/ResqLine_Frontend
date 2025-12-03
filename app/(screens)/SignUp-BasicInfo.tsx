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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSlideIn } from '../../src/transitions/slideIn';
import { useRouter } from 'expo-router';
import InlineTextField from '../../src/components/inputs/InlineTextField';

const SignUpBasicInfo: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);

  const slideAnimation = useSlideIn({
    direction: 'right',
    distance: 300,
    duration: 300,
  });

  const router = useRouter();

  useEffect(() => {
    slideAnimation.slideIn();
  }, []);

  const isPhoneValid = phoneNumber.replace(/\D/g, '').length === 11;

  const handleContinue = () => {
    setPhoneTouched(true);
    if (!isPhoneValid || !firstName || !lastName) return;
    const formatted = `+63${phoneNumber}`;
    const path = `(screens)/SignUp-Verification?firstName=${encodeURIComponent(firstName)}&lastName=${encodeURIComponent(lastName)}&phoneNumber=${encodeURIComponent(
      formatted
    )}`;
    router.push(path);
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
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="chevron-back" size={24} color="#191716" />
            </TouchableOpacity>           
            <View style={styles.headerSpacer} />
          </View>

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
                onChangeText={text => setPhoneNumber(text.replace(/\D/g, ''))}
                containerStyle={styles.phoneInputWrapper}
                keyboardType="phone-pad"
                maxLength={11}
                focusColor="#FF9427"
                baseLabelColor="#999"
                onBlur={() => setPhoneTouched(true)}
                assistiveText={phoneTouched && !isPhoneValid ? 'Phone number must be 11 digits' : ''}
              />
            </View>

            

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

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.continueButton, (!isPhoneValid || !firstName || !lastName) ? styles.continueButtonDisabled : null]}
              onPress={handleContinue}
              disabled={!isPhoneValid || !firstName || !lastName}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    
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
  headerTitle: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'OpenSans_400Regular',
  },
  headerSpacer: { width: 32},
  title: {
    fontSize: 30,
    fontFamily: 'OpenSans_700Bold',
    color: '#191716',
  },
  subtitle: {
    fontSize: 16,
    color: '#191716',
    marginBottom: 30,
  },
  phoneContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 6,
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
    fontFamily: 'OpenSans_600SemiBold',
    color: '#333',
  },
  phoneInputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  phoneInput: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 6,
  },
  phoneError: {
    color: '#FF3E48',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 12,
    textAlign: 'left',
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 30,
    marginTop: 20,
  },
  inputWrapper: {
    flex: 1,
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
    fontFamily: 'OpenSans_600SemiBold',
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
    fontFamily: 'OpenSans_600SemiBold',
  },
  footer: { paddingHorizontal: 20, paddingBottom: 24 },
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
});

export default SignUpBasicInfo;