import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:8000/api' // Android emulator
    : 'http://127.0.0.1:8000/api'; // iOS simulator

const api = axios.create({
  baseURL: API_URL,
});

// Add token automatically to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
