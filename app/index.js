import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView , Image} from 'react-native';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function Welcome() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      <View style={styles.content}>
        {/* Icon */}
        <View style={{ width: '100%', height: 300 }}>
          <Image 
            source={require('../assets/images/appLogo.png')}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"  // You can also try 'contain' or 'stretch'
          />
        </View>


        {/* Title */}
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>
          Attendance Management System
        </Text>

        {/* Button */}
        <TouchableOpacity style={styles.button}>
          <Link href="/select-role" style={styles.buttonText}>
            Get Started
          </Link>
        </TouchableOpacity>
      </View>

      {/* Home Indicator Area */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7A288A',
  },
  
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  iconContainer: {
    width: 56,
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 48,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#7A288A',
    fontSize: 16,
    fontWeight: '600',
  },
  homeIndicator: {
    width: 135,
    height: 5,
    backgroundColor: '#fff',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 8,
    opacity: 0.2,
  },
});
