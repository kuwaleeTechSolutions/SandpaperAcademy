// src/navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import CompleteProfileScreen from '../screens/CompleteProfileScreen';
import AdminDrawer from './AdminDrawer';

import UserListScreen from '../screens/UserListScreen';
import UserDetailsScreen from '../screens/UserDetailsScreen';

import Header from '../components/Header';
import { RootStackParamList } from './types';   // assuming types.ts exists in same folder

const Stack = createNativeStackNavigator<RootStackParamList>();

function AppNavigator() {
  return (
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: 'fade_from_bottom',     // smoother feel on most Android devices
          gestureEnabled: false,              // prevent swipe-back on auth screens (optional but common)
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
        />
        
        <Stack.Screen 
          name="CompleteProfile" 
          component={CompleteProfileScreen} 
          options={{
            // Optional: allow hardware back button to go back to login
            gestureEnabled: true,
          }}
        />

        <Stack.Screen 
          name="Main" 
          component={AdminDrawer} 
        />
    
      <Stack.Screen
          name="UserDetails"
          component={UserDetailsScreen}
          options={({ navigation, route }) => ({
            headerShown: true,
            header: () => (
              <Header
                title="User Details"
                onBackPress={() => navigation.goBack()}
              />
            ),
          })}
        />

      </Stack.Navigator>

      
  );
}

export default AppNavigator;