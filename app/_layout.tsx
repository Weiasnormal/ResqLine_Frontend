import React from 'react';
import { Slot } from 'expo-router';
import { UserProfileProvider } from './contexts/UserProfileContext';

export default function RootLayout() {
  return (
    <UserProfileProvider>
      <Slot />
    </UserProfileProvider>
  );
}