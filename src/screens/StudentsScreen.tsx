import React, { useState } from 'react';
import api from '../api';
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
} from 'react-native';

type Gender = 'Male' | 'Female' | 'Others' | '';

interface StudentForm {
  gender: Gender;
  alt_mobile: string;
  alt_email: string;
  address: string;
  pincode: string;
  qualification: string;
  dob: string; // dd/mm/yyyy
}

const StudentsScreen: React.FC = () => {
  const [form, setForm] = useState<StudentForm>({
    gender: '',
    alt_mobile: '',
    alt_email: '',
    address: '',
    pincode: '',
    qualification: '',
    dob: '',
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof StudentForm, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

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

  const submitForm = async () => {
    if (!form.gender) {
      Alert.alert('Validation Error', 'Gender is required');
      return;
    }

    if (!form.alt_email || !validateEmail(form.alt_email)) {
      Alert.alert('Validation Error', 'Valid email is required');
      return;
    }

    if (form.alt_mobile && !/^\d{10}$/.test(form.alt_mobile)) {
      Alert.alert(
        'Validation Error',
        'Alternate mobile must be 10 digits only'
      );
      return;
    }

    if (!form.address.trim()) {
      Alert.alert('Validation Error', 'Address is required');
      return;
    }

    if (!form.pincode || form.pincode.length !== 6) {
      Alert.alert('Validation Error', 'Valid pincode is required');
      return;
    }

    if (!form.qualification.trim()) {
      Alert.alert('Validation Error', 'Qualification is required');
      return;
    }

    if (!form.dob || !validateDOB(form.dob)) {
      Alert.alert('Validation Error', 'DOB must be in dd/mm/yyyy format');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/user-details', {
        user_id: 1, // replace after auth
        gender: form.gender,
        alt_mobile: form.alt_mobile || null,
        alt_email: form.alt_email,
        address: form.address,
        pincode: form.pincode,
        qualification: form.qualification,
        dob: form.dob,
        additional_field: {
          source: 'android_app',
        },
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Student details saved successfully');
        setForm({
          gender: '',
          alt_mobile: '',
          alt_email: '',
          address: '',
          pincode: '',
          qualification: '',
          dob: '',
        });
      }
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Student Details</Text>

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
          style={styles.input}
          placeholder="Alternate Mobile (optional)"
          keyboardType="numeric"
          maxLength={10}
          value={form.alt_mobile}
          onChangeText={(v) =>
            handleChange('alt_mobile', v.replace(/[^0-9]/g, ''))
          }
        />

        <TextInput
          style={styles.input}
          placeholder="Email *"
          keyboardType="email-address"
          value={form.alt_email}
          onChangeText={(v) => handleChange('alt_email', v)}
        />

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

        <View style={styles.button}>
          <Button
            title={loading ? 'Saving...' : 'Save Student'}
            onPress={submitForm}
            disabled={loading}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default StudentsScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 10,
  },
});
