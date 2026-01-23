import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sendOtp, verifyOtp } from '../api';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!phone) {
      Alert.alert('Error', 'Please enter phone number');
      return;
    }

    try {
      setLoading(true);
      await sendOtp(phone);
      setStep('OTP');
      Alert.alert('OTP Sent', 'Use 123456 for development');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOtp(phone, otp);
      await AsyncStorage.setItem('token', res.data.token);
      navigation.replace('Home');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sandpaper Academy</Text>

      {step === 'PHONE' ? (
        <>
          <TextInput
            placeholder="Enter Phone Number"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
          />
          <Button
            title={loading ? 'Sending...' : 'Send OTP'}
            onPress={handleSendOtp}
            disabled={loading}
          />
        </>
      ) : (
        <>
          <Text style={styles.info}>
            OTP sent to {phone}
          </Text>

          <TextInput
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={otp}
            onChangeText={setOtp}
            style={styles.input}
          />
          <Button
            title={loading ? 'Verifying...' : 'Verify OTP'}
            onPress={handleVerifyOtp}
            disabled={loading}
          />
        </>
      )}
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 15,
    padding: 12,
    borderRadius: 6,
  },
  info: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#555',
  },
});
