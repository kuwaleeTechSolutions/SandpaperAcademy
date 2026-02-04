import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Alert,
  RefreshControl,
} from 'react-native';

import api from '../api';

const UserListScreen: React.FC<any> = ({ navigation }) => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* ---------------- Fetch Users ---------------- */

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data); // ✅ FIX
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    fetchUsers();
  }, []);

  /* ---------------- Toggle Status ---------------- */

  const toggleStatus = async (userId: number) => {
    try {
      await api.post(`/users/${userId}/toggle-status`);
      fetchUsers();
    } catch (error) {
      Alert.alert('Error', 'Unable to change status');
    }
  };

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading users…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => {
          setRefreshing(true);
          fetchUsers();
        }} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>User Management</Text>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('AddUser')}
        >
          <Text style={styles.addBtnText}>+ Add New</Text>
        </TouchableOpacity>
      </View>

      {/* User List */}
      {users.length === 0 ? (
        <Text style={styles.empty}>No users found</Text>
      ) : (
        users.map((user, index) => (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('UserDetails', { id: user.id })
            }
          >
            {/* Left */}
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.sub}>{user.email}</Text>
              <Text style={styles.sub}>{user.phone}</Text>
            </View>

            {/* Right */}
            <View style={styles.actions}>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Text>
                <Switch
                  value={!!user.is_active}
                  onValueChange={() => toggleStatus(user.id)}
                />
              </View>

            
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
};

export default UserListScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    minHeight: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },

  addBtn: {
    backgroundColor: '#0d6efd',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 6,
  },

  addBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },

  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },

  sub: {
    fontSize: 13,
    color: '#555',
  },

  actions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginLeft: 10,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusText: {
    fontSize: 12,
    marginRight: 6,
    color: '#333',
  },
 

  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 40,
  },
});
