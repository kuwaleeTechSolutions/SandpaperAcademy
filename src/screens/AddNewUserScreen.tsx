import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert,
} from 'react-native';   

type Gender = 'Male' | 'Female' | 'Others' | '';

interface StudentForm {
    name:string,
    email: string,
    phone: string,
    gender: Gender; 
    address: string;
    pincode: string;
    qualification: string;
    dob: string; // dd/mm/yyyy
}
 
const AddUserScreen: React.FC<any> = ({ navigation }) =>  {
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
  const handleChange = (key: string, value: string | boolean) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = () => {
    

    // 🔗 API CALL HERE
    console.log('Add User Payload:', form);

    Alert.alert('Success', 'User added successfully', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New User</Text>

      {/* Name */}  
        <TextInput
          style={styles.input}
          placeholder="Full name *"
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        /> 

      {/* Email */}
   
        <TextInput
          style={styles.input}
          placeholder="Email *"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => handleChange('email', text)}
        />
   

      {/* Phone */}  
        <TextInput
          style={styles.input}
          placeholder="Phone Number *"
          keyboardType="phone-pad"
          value={form.phone}
          onChangeText={(text) => handleChange('phone', text)}
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
     

     
      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[styles.button, styles.cancelBtn]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.submitBtn]}
          onPress={handleSubmit}
        >
          <Text style={styles.submitText}>Save User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AddUserScreen;

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
  field: {
    marginBottom: 14,
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
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
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
  submitText: {
    color: '#fff',
    fontWeight: '600',
  },
});

