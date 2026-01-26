import React from 'react';
import { View, Text } from 'react-native';

export default function BlankScreen({ route }: any) {
  return (
    <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
      <Text style={{ fontSize:22 }}>{route.name} Module</Text>
      <Text style={{ marginTop:8, color:'#666' }}>Coming soon...</Text>
    </View>
  );
}
