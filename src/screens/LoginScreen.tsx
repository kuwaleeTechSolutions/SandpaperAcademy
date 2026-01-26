import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, verifyOtp } from '../api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  // Total achievers data
  const totalAchievers = [
    { year: '2023-24', count: 104 },
    { year: '2024-25', count: 140 },
  ];

  const handleSendOtp = async () => {
    if (!phone) return Alert.alert('Error', 'Please enter phone number');
    try {
      setLoading(true);
      await sendOtp(phone);
      setStep('OTP');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      return Alert.alert('Error', 'Please enter OTP');
    }
  
    try {
      setLoading(true);
  
      // Optional: clean phone number
      const cleanedPhone = phone.replace(/\D/g, '');
  
      const res = await verifyOtp(cleanedPhone, otp);
  
      await AsyncStorage.setItem('token', res.data.token);
  
      // Go to profile if name or email is missing
      if (!res.data.user?.name || !res.data.user?.email) {
        navigation.replace('CompleteProfile', undefined);
      } else {
        console.log("Login success – replacing to Main now");
        navigation.replace('Main');
        console.log("replace called – should have navigated");
      }
    } catch (err: any) {
      Alert.alert(
        'Error',
        err.response?.data?.message || 'Invalid OTP. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <Text style={styles.header}>Welcome to Sandpaper Academy</Text>

      {/* Achievers Section */}
      <View style={styles.achieversContainer}>
        {totalAchievers.map((a) => (
          <View key={a.year} style={styles.achieverCard}>
            <Text style={styles.achieverCount}>{a.count}</Text>
            <Text style={styles.achieverYear}>{a.year}</Text>
          </View>
        ))}
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        {step === 'PHONE' ? (
          <>
            <TextInput
              placeholder="Phone Number"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Send OTP</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              placeholder="Enter OTP"
              keyboardType="number-pad"
              value={otp}
              onChangeText={setOtp}
              style={styles.input}
            />
            <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f8fa',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  achieversContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  achieverCard: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  achieverCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  achieverYear: {
    fontSize: 14,
    color: '#555',
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
