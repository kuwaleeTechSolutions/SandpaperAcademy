// src/screens/DashboardScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import { useNavigation } from '@react-navigation/native';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { DrawerNavigationProp } from '@react-navigation/drawer';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList, AdminDrawerParamList } from '../navigation/types';

const { width } = Dimensions.get('window');

interface DashboardData {
  totalStudents: number;
  totalTeachers: number;
  todayAttendance: number;
  pendingFees: number;
  upcomingExams: number;
  recentAdmissions: number;
  name: string;
}

type NavigationProp = CompositeNavigationProp<
  DrawerNavigationProp<AdminDrawerParamList>,
  NativeStackNavigationProp<RootStackParamList>
>;

const DashboardScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

// In DashboardScreen.tsx

// Keep your current imports and composite type as-is

const fetchDashboard = useCallback(async () => {
  console.log('[Dashboard Retry] Starting new attempt at', new Date().toISOString());

  try {
    setError(null);
    console.log('[Dashboard] GET /dashboard - baseURL:', api.defaults.baseURL);
    console.log('[Dashboard] Sending request with token...');

    const res = await api.get('/dashboard', { timeout: 8000 });

    console.log('[Dashboard] SUCCESS! Status:', res.status);
    console.log('[Dashboard] Data:', JSON.stringify(res.data, null, 2));
    setData(res.data);
  } catch (err: any) {
    console.log('[Dashboard] ────────────────────────────────');
    console.log('[Dashboard] ERROR CAUGHT:');
    console.log('Message:', err.message);
    console.log('Code:', err.code);
    console.log('Status:', err.response?.status);
    console.log('Response data:', err.response?.data);
    console.log('Full error object:', JSON.stringify(err, null, 2));
    console.log('[Dashboard] ────────────────────────────────');

    if (err?.response?.status === 401 || err?.response?.status === 403) {
      console.log('[Dashboard] Auth error → logging out');
      await AsyncStorage.removeItem('token');
      const rootNav = navigation.getParent();
      rootNav?.reset({ index: 0, routes: [{ name: 'Login' }] });
    } else {
      setError('Could not load dashboard. Check connection or server.');
    }
  } finally {
    console.log('[Dashboard] Attempt finished');
    setLoading(false);
    setRefreshing(false);
  }
}, [navigation]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchDashboard}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {data?.name || 'Admin'}</Text>
        <Text style={styles.date}>{new Date().toDateString()}</Text>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.card}>
          <Text style={styles.cardValue}>{data?.totalStudents ?? 0}</Text>
          <Text style={styles.cardLabel}>Total Students</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>{data?.totalTeachers ?? 0}</Text>
          <Text style={styles.cardLabel}>Total Teachers</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>
            {data?.todayAttendance ? `${Math.round(data.todayAttendance)}%` : 'N/A'}
          </Text>
          <Text style={styles.cardLabel}>Today's Attendance</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardValue}>
            ₹{(data?.pendingFees ?? 0).toLocaleString('en-IN')}
          </Text>
          <Text style={styles.cardLabel}>Pending Fees</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('Exams')}
        >
          <Text style={styles.actionText}>
            Upcoming Exams ({data?.upcomingExams ?? 0})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionCard}
          // onPress={() => navigation.navigate('Students')} // uncomment when ready
        >
          <Text style={styles.actionText}>
            Recent Admissions ({data?.recentAdmissions ?? 0})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Placeholder for future features */}
      <View style={styles.section}>
        <Text style={{ color: '#888', textAlign: 'center', marginTop: 20 }}>
          More insights, charts & alerts coming soon...
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fc',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 24,
    backgroundColor: '#0066cc',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
  },
  date: {
    fontSize: 15,
    color: '#e0f0ff',
    marginTop: 6,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 48) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066cc',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  actionCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: '#0066cc',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default DashboardScreen;