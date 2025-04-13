import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import Toast from 'react-native-toast-message';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const { signIn, signUp, signOut, session, loading } = useAuth();

  const validateRegistration = () => {
    if (!username.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Username is required',
      });
      return false;
    }
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Email is required',
      });
      return false;
    }
    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: 'Password is required',
      });
      return false;
    }
    return true;
  };

  const validateLogin = () => {
    if (!email.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Email is required',
      });
      return false;
    }
    if (!password.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: 'Password is required',
      });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateRegistration()) return;
    
    try {
      await signUp(email, password, username);
      Toast.show({
        type: 'success',
        text1: 'Registration successful',
        text2: 'Please check your email to confirm your account',
      });
      // Navigate directly to tabs after registration
      router.replace('/(tabs)');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Registration Error',
        text2: error.message || 'Failed to register',
      });
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    
    try {
      await signIn(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: error.message || 'Failed to login',
      });
    }
  };

  const handleSubmit = async () => {
    if (isRegistering) {
      await handleRegister();
    } else {
      await handleLogin();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Toast.show({
        type: 'success',
        text1: 'Signed out successfully',
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Sign Out Error',
        text2: error.message || 'Failed to sign out',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (session && !isRegistering) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome, {session.user.email}</Text>
        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Create Account' : 'Welcome Back'}</Text>
      {isRegistering && (
        <TextInput
          style={styles.input}
          placeholder="Username *"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          autoCorrect={false}
        />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email *"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password *"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{isRegistering ? 'Register' : 'Sign In'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.switchButton}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text style={styles.switchButtonText}>
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 10,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#000',
    fontSize: 14,
  },
}); 