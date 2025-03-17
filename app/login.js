import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-root-toast';

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const showToast = (message, isError = false) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: isError ? '#FF3B30' : '#7A288A',
      paddingTop: 40,
    });
  };

  const handleLogin = async () => {
    if (isLoading) return;

    // Basic validation
    if (!formData.email.trim() || !formData.password) {
      showToast('Please fill in all fields', true);
      return;
    }

    setIsLoading(true);
    try {
      // Set a short timeout for the login attempt
      const loginPromise = signInWithEmailAndPassword(auth, formData.email.trim(), formData.password)
        .catch(error => {
          // Handle Firebase errors silently and throw a custom error
          let errorMessage;
          let shouldRedirect = false;

          switch (error.code) {
            case 'auth/invalid-email':
              errorMessage = 'Please enter a valid email address.';
              break;
            case 'auth/user-not-found':
              errorMessage = 'Account does not exist. Would you like to create one?';
              shouldRedirect = true;
              break;
            case 'auth/wrong-password':
              errorMessage = 'Wrong password entered. Please try again.';
              break;
            case 'auth/too-many-requests':
              errorMessage = 'Too many failed attempts. Please try again later.';
              break;
            case 'auth/network-request-failed':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            default:
              errorMessage = 'Failed to login. Please try again.';
          }

          // Create a custom error object with additional metadata
          const customError = new Error(errorMessage);
          customError.shouldRedirect = shouldRedirect;
          throw customError;
        });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login is taking too long. Please check your internet connection and try again.')), 5000)
      );

      // Race between login and timeout
      const userCredential = await Promise.race([loginPromise, timeoutPromise]);
      
      // Show success message and redirect
      showToast('Login successful!');
      router.replace('/teacher-dashboard');

    } catch (error) {
      showToast(error.message, true);
      
      // If account doesn't exist, redirect to signup after a short delay
      if (error.shouldRedirect) {
        setTimeout(() => {
          router.push('/signup');
        }, 2000); // Wait 2 seconds before redirecting to let user read the message
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
        disabled={isLoading}
      >
        <Ionicons name="chevron-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <Ionicons name="school-outline" size={40} color="#7A288A" />
      </View>

      <Text style={styles.title}>Welcome Back!</Text>
      <Text style={styles.subtitle}>Login to continue your journey</Text>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            editable={!isLoading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            editable={!isLoading}
          />
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)} 
            style={styles.eyeIcon}
            disabled={isLoading}
          >
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} 
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/signup')} disabled={isLoading}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    width: 24,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111',
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#7A288A',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#666',
    fontSize: 15,
  },
  signupLink: {
    color: '#7A288A',
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 40,
  },
});
