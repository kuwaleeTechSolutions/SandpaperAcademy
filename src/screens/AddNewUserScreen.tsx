import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import api from '../api';

type Gender = 'Male' | 'Female' | 'Others' | '';

interface StudentForm {
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  address: string;
  pincode: string;
  qualification: string;
  dob: string; // dd/mm/yyyy
}

const AddUserScreen: React.FC<any> = ({ navigation }) => {
  const [form, setForm] = useState<StudentForm>({
    name: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
    pincode: '',
    qualification: '',
    dob: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };
  /* ---------------- Validation Helpers ---------------- */
 
  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) =>
  /^[6-9]\d{9}$/.test(phone);

  const validateDOB = (dob: string) =>
    /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/.test(dob);

  const formatDOB = (value: string) => {
    let cleaned = value.replace(/\D/g, '').substring(0, 8);

    if (cleaned.length >= 5) {
      return (
        cleaned.substring(0, 2) +
        '/' +
        cleaned.substring(2, 4) +
        '/' +
        cleaned.substring(4)
      );
    }

    if (cleaned.length >= 3) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    }

    return cleaned;
  };



  /* ---------------- Submit ---------------- */

  const handleSubmit = async () => {
    // Frontend validation
    if (!form.name || !form.email || !form.phone) {
      Alert.alert('Error', 'Name, Email and Phone are required');
      return;
    }

    if (!validateEmail(form.email)) {
      Alert.alert('Error', 'Invalid email format');
      return;
    }

   if (!validatePhone(form.phone)) {
      Alert.alert(
        'Error',
        'Enter a valid 10-digit mobile number'
      );
      return;
    }

    if (!form.gender) {
      Alert.alert('Error', 'Please select gender');
      return;
    }

    if (!validateDOB(form.dob)) {
      Alert.alert('Error', 'DOB must be in dd/mm/yyyy format');
      return;
    }
    setLoading(true);
    try {
      await api.post('/add-users', form);
      Alert.alert('Success', 'User Saved successfully', [
        { text: 'Continue', onPress: () => navigation.goBack()},
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

  /* ---------------- UI ---------------- */

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New User</Text>

      <TextInput
        style={styles.input}
        placeholder="Full name *"
        value={form.name}
        onChangeText={(text) => handleChange('name', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Email *"
        keyboardType="email-address"
        autoCapitalize="none"
        value={form.email}
        onChangeText={(text) => handleChange('email', text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number *"
        keyboardType="phone-pad"
        maxLength={10}
        value={form.phone}
        onChangeText={(text) =>
          handleChange('phone', text.replace(/[^0-9]/g, ''))
        }
      />

      <Text style={styles.label}>Gender *</Text>
      <View style={styles.radioGroup}>
        {['Male', 'Female', 'Others'].map((g) => (
          <TouchableOpacity
            key={g}
            style={styles.radioItem}
            onPress={() => handleChange('gender', g as Gender)}
          >
            <View style={styles.radioCircle}>
              {form.gender === g && <View style={styles.radioChecked} />}
            </View>
            <Text>{g}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Address *"
        multiline
        value={form.address}
        onChangeText={(v) => handleChange('address', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Pincode *"
        keyboardType="numeric"
        maxLength={6}
        value={form.pincode}
        onChangeText={(v) =>
          handleChange('pincode', v.replace(/[^0-9]/g, ''))
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Qualification *"
        value={form.qualification}
        onChangeText={(v) => handleChange('qualification', v)}
      />

      <TextInput
        style={styles.input}
        placeholder="Date of Birth (dd/mm/yyyy) *"
        keyboardType="numeric"
        maxLength={10}
        value={form.dob}
        onChangeText={(v) => handleChange('dob', formatDOB(v))}
      />

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelBtn]}
          onPress={() => navigation.goBack()}
          disabled={loading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.submitBtn,
            loading && { opacity: 0.6 },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? 'Saving...' : 'Save User'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddUserScreen;

/* ---------------- Styles ---------------- */

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#212529',
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#495057',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  radioGroup: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#555',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  radioChecked: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#555',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#dee2e6',
    marginRight: 10,
  },
  submitBtn: {
    backgroundColor: '#0d6efd',
    marginLeft: 10,
  },
  cancelText: {
    color: '#495057',
    fontWeight: '600',
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});
