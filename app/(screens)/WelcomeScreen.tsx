import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

const WelcomeScreen: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient colors={['#FF9427', '#F57C00']} style={styles.gradientArea}>
        <View style={styles.top}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/White-Logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logo}>ResqLine</Text>
          </View>
        </View>

        <View style={styles.center}>
          <View style={styles.illustrationContainer}>
            <Image
              source={require('../../assets/Welcome-Illustration.png')}
              style={styles.illustration}
              resizeMode="contain"
            />
            <Text style={styles.tagline}>
              Stay Alert. Stay Connected. Stay Safe.
            </Text>
          </View>
        </View>
      </LinearGradient>

      <SafeAreaView edges={['bottom']} style={[styles.whiteSection, { paddingBottom: 25 + insets.bottom }]}>
        <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => {
            router.push('(screens)/SignUp-BasicInfo');
          }}
        >
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logInButton}
          onPress={() => router.push('(screens)/LogIn-Number')}
        >
          <Text style={styles.logInText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.guestButton}
          onPress={() => router.push('(tabs)?tab=home')}
        >
          <Text style={styles.guestText}>Continue as Guest</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FF9427' },
  gradientArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  top: {
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  logoImage: {
    width: 34,
    height: 34,
  },
  logo: {
    fontSize: 30,
    color: '#fff',
    marginLeft: 10,
    fontFamily: 'OpenSans_700Bold',
  },
  illustrationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  whiteSection: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
    gap: 12,
  },
  tagline: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 30,
    paddingHorizontal: 20,
    fontFamily: 'OpenSans_400Regular',
  },
  signUpButton: {
    width: '100%',
    backgroundColor: '#FF9427',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  signUpText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  logInButton: {
    width: '100%',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#FF9427',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logInText: {
    color: '#FF9427',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
  guestButton: {
    width: '100%',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestText: {
    color: '#FF9427',
    fontSize: 16,
    fontFamily: 'OpenSans_600SemiBold',
  },
});

export default WelcomeScreen;

