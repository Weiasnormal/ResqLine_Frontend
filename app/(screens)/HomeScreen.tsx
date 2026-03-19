import React, { useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import HomeBody from '../components/body/HomeBody';
import FooterNav from '../components/FooterNav';
import { requireAuthentication } from '../_utils/authGuard';

interface HomeScreenProps {
  onTabPress?: (tab: string) => void;
  onRecentReports?: () => void;
}

const HomeScreen = ({ onTabPress, onRecentReports }: HomeScreenProps) => {
  useEffect(() => {
    // Ensure unauthenticated users are redirected out of protected home content.
    requireAuthentication();
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffffff" />
        <View style={styles.wrapper}>
          <Header title="Home" />
          <View style={styles.body}>
            <HomeBody onTabPress={onTabPress} onRecentReports={onRecentReports} />
          </View>
          <FooterNav activeTab="home" onTabPress={onTabPress} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
  },
  body: {
    flex: 1,
  },
});

export default HomeScreen;

