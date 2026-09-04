import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MainNavigation from './navigation/mainNavigation';
import StartNavigation from './navigation/startNavigation';
export default function App() {
  return (
    
      <MainNavigation />
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
