import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import api from '../api';

export default function CompleteProfile({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const submitProfile = async () => {
    try {
      await api.post('/complete-profile', { name, email });
      navigation.replace('Home');
    } catch {
      Alert.alert('Error', 'Failed to save profile');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 10 }}>
        Complete Your Profile
      </Text>

      <TextInput placeholder="Name" value={name} onChangeText={setName} />
      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <Button title="Continue" onPress={submitProfile} />
    </View>
  );
}
