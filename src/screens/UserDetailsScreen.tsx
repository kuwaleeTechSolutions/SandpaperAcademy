import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';

import api from '../api';

const UserDetailsScreen: React.FC<any> = ({ route, navigation }) => {
  const { id } = route.params;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  /* ---------------- Fetch User Details ---------------- */

  const fetchUserDetails = async () => {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (error) {
      Alert.alert('Error', 'Unable to load user details');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  /* ---------------- UI ---------------- */

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading details…</Text>
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>User Details</Text>

        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => navigation.navigate('EditUser', { id })}
        >
          <Text style={styles.editText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Basic Info */}
      <View style={styles.card}>
        <Text style={styles.section}>Basic Information</Text>

        <Info label="Name" value={user.name} />
        <Info label="Email" value={user.email} />
        <Info label="Phone" value={user.phone} />
        <Info
          label="Status"
          value={user.is_active ? 'Active' : 'Inactive'}
          valueStyle={{
            color: user.is_active ? '#198754' : '#dc3545',
            fontWeight: '600',
          }}
        />
      </View>

      {/* Profile Info */}
      {user.user_detail && (
        <View style={styles.card}>
          <Text style={styles.section}>Profile Details</Text>

          <Info label="Registration No" value={user.user_detail.reg_no} />
          <Info label="Gender" value={user.user_detail.gender} />
          <Info label="Date of Birth" value={user.user_detail.dob} />
          <Info label="Qualification" value={user.user_detail.qualification} />
          <Info label="Pincode" value={user.user_detail.pincode} />
          <Info
            label="Address"
            value={user.user_detail.address}
            multiline
          />
        </View>
      )}
    </ScrollView>
  );
};

export default UserDetailsScreen;

/* ---------------- Reusable Row ---------------- */

const Info = ({
  label,
  value,
  multiline = false,
  valueStyle = {},
}: any) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}</Text>
    <Text
      style={[
        styles.value,
        multiline && { lineHeight: 20 },
        valueStyle,
      ]}
    >
      {value || '-'}
    </Text>
  </View>
);

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
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

  editBtn: {
    borderWidth: 1,
    borderColor: '#0d6efd',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },

  editText: {
    color: '#0d6efd',
    fontWeight: '600',
  },

  card: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },

  section: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
    paddingBottom: 6,
  },

  row: {
    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: '#777',
    marginBottom: 2,
  },

  value: {
    fontSize: 15,
    color: '#222',
  },
});
