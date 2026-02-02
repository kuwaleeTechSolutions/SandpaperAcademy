import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';

import api from '../api';

type Gender = 'Male' | 'Female' | 'Others' | '';

const CompleteProfileScreen: React.FC<any> = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(true);

  const [form, setForm] = useState({
    phone: '',
    name: '',
    email: '',
    gender: '' as Gender,
    address: '',
    pincode: '',
    qualification: '',
    dob: '',
  });

  useEffect(() => {
    fetchLoggedInUser();
  }, []);

  const fetchLoggedInUser = async () => {
    try {
      const res = await api.get('/me');
      setForm(prev => ({ ...prev, phone: res.data.phone }));
    } catch {
      Alert.alert('Session Expired', 'Please login again');
      navigation.replace('Login');
    } finally {
      setFetchingUser(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateDOB = (dob: string) =>
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dob);

  const formatDOB = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 8);
    if (cleaned.length >= 5)
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
    if (cleaned.length >= 3)
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  };

  const submitProfile = async () => {
    if (!form.name.trim())
      return Alert.alert('Validation Error', 'Name is required');
    if (!validateEmail(form.email))
      return Alert.alert('Validation Error', 'Valid email is required');
    if (!form.gender)
      return Alert.alert('Validation Error', 'Gender is required');
    if (!form.address.trim())
      return Alert.alert('Validation Error', 'Address is required');
    if (form.pincode.length !== 6)
      return Alert.alert('Validation Error', 'Pincode must be 6 digits');
    if (!form.qualification.trim())
      return Alert.alert('Validation Error', 'Qualification is required');
    if (!validateDOB(form.dob))
      return Alert.alert('Validation Error', 'DOB must be dd/mm/yyyy');

    setLoading(true);
    try {
      await api.post('/complete-profile', form);
      Alert.alert('Success', 'Profile completed successfully', [
        { text: 'Continue', onPress: () => navigation.replace('Home') },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to save profile'
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetchingUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Fetching your details…</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide the required details to continue
        </Text>

        {/* Phone badge */}
        <View style={styles.phoneBox}>
          <Text style={styles.phoneLabel}>Registered Mobile Number</Text>
          <Text style={styles.phoneText}>{form.phone}</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>

          <Text style={styles.sectionTitle}>Personal Information</Text>

          <Text style={styles.fieldLabel}>Full Name *</Text>
          <TextInput
            style={styles.input}
            value={form.name}
            onChangeText={v => handleChange('name', v)}
          />

          <Text style={styles.fieldLabel}>Email Address *</Text>
          <TextInput
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={v => handleChange('email', v)}
          />

          <Text style={styles.fieldLabel}>Gender *</Text>
          <View style={styles.radioGroup}>
            {['Male', 'Female', 'Others'].map(g => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderBtn,
                  form.gender === g && styles.genderActive,
                ]}
                onPress={() => handleChange('gender', g)}
              >
                <Text
                  style={[
                    styles.genderText,
                    form.gender === g && styles.genderTextActive,
                  ]}
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Address & Education</Text>

          <Text style={styles.fieldLabel}>Address *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            multiline
            value={form.address}
            onChangeText={v => handleChange('address', v)}
          />

          <Text style={styles.fieldLabel}>Pincode *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={6}
            value={form.pincode}
            onChangeText={v => handleChange('pincode', v.replace(/\D/g, ''))}
          />

          <Text style={styles.fieldLabel}>Highest Qualification *</Text>
          <TextInput
            style={styles.input}
            value={form.qualification}
            onChangeText={v => handleChange('qualification', v)}
          />

          <Text style={styles.fieldLabel}>Date of Birth *</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            maxLength={10}
            value={form.dob}
            onChangeText={v => handleChange('dob', formatDOB(v))}
          />

          <View style={{ marginTop: 24 }}>
            {loading ? (
              <ActivityIndicator size="large" />
            ) : (
              <Button title="Save & Continue" onPress={submitProfile} />
            )}
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CompleteProfileScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f6f8',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 10,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 20,
  },
  phoneBox: {
    backgroundColor: '#e9f2ff',
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  phoneLabel: {
    fontSize: 12,
    color: '#555',
  },
  phoneText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
    color: '#333',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#555',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 15,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  genderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  genderActive: {
    backgroundColor: '#1e88e5',
    borderColor: '#1e88e5',
  },
  genderText: {
    color: '#333',
  },
  genderTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});
