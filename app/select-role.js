import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image  } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Logo from '../assets/images/logo';

export default function SelectRole() {
  const router = useRouter();
  
  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.content}>
        {/* App Logo and Title */}
        <View style={styles.header}>
          <Image 
            source={require('../assets/images/appLogo.png')}  // Make sure this path is correct
            style={styles.logo} 
            resizeMode="contain"
          />
          <Text style={styles.title}>AttendEase</Text>
          <Text style={styles.subtitle}>Attendance Management System</Text>
        </View>

        <View style={styles.rolesContainer}>
          {/* Teacher Login */}
          <TouchableOpacity 
            style={styles.roleCard}
            onPress={() => router.push('/login')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#E8F2FF' }]}>
              <Ionicons name="school-outline" size={24} color="#2563EB" />
            </View>
            <Text style={styles.roleTitle}>Teacher</Text>
            <Text style={styles.roleDescription}>Login as a teacher</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          {/* Student Login */}
          <TouchableOpacity 
            style={styles.roleCard}
            onPress={() => router.push('/login')}
          >
            <View style={[styles.iconContainer, { backgroundColor: '#FCE7F3' }]}>
              <Ionicons name="people-outline" size={24} color="#DB2777" />
            </View>
            <Text style={styles.roleTitle}>Student</Text>
            <Text style={styles.roleDescription}>Login as a student</Text>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Help Link */}
        <TouchableOpacity style={styles.helpContainer}>
          <Ionicons name="help-circle-outline" size={20} color="#666" />
          <Text style={styles.helpText}>Need Help?</Text>
        </TouchableOpacity>
      </View>

      {/* Home Indicator */}
      <View style={styles.homeIndicator} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
  },
  rolesContainer: {
    gap: 16,
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  logo: {
    width: 320,  // Adjust width as needed
    height: 320, // Adjust height as needed
    marginBottom: 1, // Adds spacing between logo and text
    alignSelf: 'center', // Centers the logo
    marginTop: -60,
  },  
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    flex: 1,
  },
  roleDescription: {
    fontSize: 14,
    color: '#666',
    marginRight: 16,
  },
  helpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
    paddingVertical: 16,
    gap: 8,
  },
  helpText: {
    color: '#666',
    fontSize: 15,
  },
  homeIndicator: {
    width: 135,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 100,
    alignSelf: 'center',
    marginBottom: 8,
    opacity: 0.1,
  },
});
