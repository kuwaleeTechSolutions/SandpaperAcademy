// src/navigation/AdminDrawer.tsx
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import DashboardScreen from '../screens/DashboardScreen';
import StudentsScreen from '../screens/StudentsScreen';
import TeachersScreen from '../screens/TeachersScreen';
import AttendanceScreen from '../screens/AttendanceScreen';
import ExamsScreen from '../screens/ExamsScreen';
import FeesScreen from '../screens/FeesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UserListScreen from '../screens/UserListScreen';

import Header from '../components/Header';
import { AdminDrawerParamList } from './types';

const Drawer = createDrawerNavigator<AdminDrawerParamList>();

export default function AdminDrawer() {
  return (
    <Drawer.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        header: (props) => <Header {...props} />,
        drawerStyle: { width: 280 },
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Students" component={StudentsScreen} options={{ title: 'Students' }} />
      <Drawer.Screen name="Teachers" component={TeachersScreen} options={{ title: 'Teachers' }} />
      <Drawer.Screen name="Attendance" component={AttendanceScreen} options={{ title: 'Attendance' }} />
      <Drawer.Screen name="Exams" component={ExamsScreen} options={{ title: 'Exams & Results' }} />
      <Drawer.Screen name="Fees" component={FeesScreen} options={{ title: 'Fees & Payments' }} />
      <Drawer.Screen name="UserList" component={UserListScreen} options={{ title: 'User List' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Drawer.Navigator>
  );
}