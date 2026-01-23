#!/bin/bash
# Use JDK 17 for this project
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH=$JAVA_HOME/bin:$PATH

# Start the React Native Android build
npx react-native run-android

