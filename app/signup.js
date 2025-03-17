import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from './firebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import Toast from 'react-native-root-toast';

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    school: ''
  });

  const showToast = (message, error = false) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: Toast.positions.TOP,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
      backgroundColor: error ? '#FF0000' : '#7A288A',
      paddingTop:40,
    });
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.3,
      });

      if (!result.canceled) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      showToast('Failed to pick image', true);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      showToast('Full name is required', true);
      return false;
    }
    if (!formData.email.trim()) {
      showToast('Email is required', true);
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      showToast('Password must be at least 6 characters', true);
      return false;
    }
    if (!formData.school.trim()) {
      showToast('School/Institution is required', true);
      return false;
    }
    return true;
  };

  const handleSignUp = async () => {
    if (isLoading) return;
    if (!validateForm()) return;

    setIsLoading(true);
    let userCredential;

    try {
      const signupPromise = createUserWithEmailAndPassword(auth, formData.email.trim(), formData.password)
        .catch(error => {
          let errorMessage;
          switch (error.code) {
            case 'auth/email-already-in-use':
              errorMessage = 'This email is already registered. Please login instead.';
              break;
            case 'auth/invalid-email':
              errorMessage = 'Invalid email format. Please check and try again.';
              break;
            case 'auth/weak-password':
              errorMessage = 'Password is too weak. Please use at least 6 characters.';
              break;
            case 'auth/network-request-failed':
              errorMessage = 'Network error. Please check your internet connection.';
              break;
            default:
              errorMessage = 'Failed to create account. Please try again.';
          }
          throw new Error(errorMessage);
        });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Network is slow. Please try again.')), 10000)
      );

      userCredential = await Promise.race([signupPromise, timeoutPromise]);

      showToast('Sign up successful! Welcome to our community!');
      router.replace('/teacher-dashboard');

      try {
        await Promise.all([
          updateProfile(userCredential.user, {
            displayName: formData.fullName.trim(),
            photoURL: photo
          }),
          setDoc(doc(db, 'users', userCredential.user.uid), {
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            school: formData.school.trim(),
            photoURL: photo,
            role: 'teacher',
            createdAt: new Date().toISOString()
          })
        ]);
      } catch (profileError) {
        console.error('Error updating profile:', profileError);
      }

    } catch (error) {
      showToast(error.message, true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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

      <Text style={styles.title}>Join Our Teaching Community</Text>
      <Text style={styles.subtitle}>Create your account and start your journey</Text>

      <TouchableOpacity 
        style={styles.photoUpload} 
        onPress={pickImage}
        disabled={isLoading}
      >
        <View style={styles.photoCircle}>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.photoImage} />
          ) : (
            <Ionicons name="camera" size={24} color="#7A288A" />
          )}
        </View>
        <Text style={styles.photoText}>Upload your photo</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            editable={!isLoading}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Ionicons name="business-outline" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="School/Institution"
            value={formData.school}
            onChangeText={(text) => setFormData({ ...formData, school: text })}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} 
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/login')} disabled={isLoading}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30,
  },
  contentContainer: {
    padding: 24,
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
  photoUpload: {
    alignItems: 'center',
    marginBottom: 32,
  },
  photoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    overflow: 'hidden',
  },
  photoImage: {
    width: '100%',
    height: '100%',
  },
  photoText: {
    color: '#7A288A',
    fontSize: 14,
    fontWeight: '500',
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
  signUpButton: {
    backgroundColor: '#7A288A',
    borderRadius: 16,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  signUpButtonDisabled: {
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
    fontSize: 15,
  },
  loginLink: {
    color: '#7A288A',
    fontSize: 15,
    fontWeight: '600',
  },
});
