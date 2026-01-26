import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function Header({ navigation }: any) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon name="menu" size={28} color="#fff" />
      </TouchableOpacity>

      <Image
        source={require('../assets/splash_logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <View style={{ width: 28 }} />
    </View>
  );
} 

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#1e3a8a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  logo: {
    height: 30,
    width: 140,
  },
});
