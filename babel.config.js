module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    // ... other plugins if any (e.g. module-resolver)
    'react-native-reanimated/plugin',   // ← MUST BE THE VERY LAST PLUGIN
  ],
};