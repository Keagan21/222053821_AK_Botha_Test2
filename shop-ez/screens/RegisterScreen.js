// src/screens/RegisterScreen.js (Fully Verified - No Spaces or Comma Issues)
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';  
import { auth } from '../fireBase';  
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext.js';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateInputs = () => {
    if (!email || !password || !confirmPassword) {
      setError('Email, password, and confirmation are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created! Welcome to ShopEZ.');
      navigation.navigate('ProductList');
    } catch (firebaseError) {
      let message = 'Registration failed.';
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          message = 'Email already in use. Try logging in instead.';
          break;
        case 'auth/weak-password':
          message = 'Password is too weak. Use at least 6 characters.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email format.';
          break;
        default:
          message = firebaseError.message || 'An unexpected error occurred.';
      }
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register for ShopEZ</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor={theme.colors.textSecondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.textSecondary}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        placeholderTextColor={theme.colors.textSecondary}
      />
      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleRegister}
        disabled={loading}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Creating Account...' : 'Register'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Login')}
        activeOpacity={0.7}
      >
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: theme.spacing.large,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: 28,
    textAlign: 'center',
    marginBottom: theme.spacing.large,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.textSecondary,
    padding: theme.spacing.medium,
    marginBottom: theme.spacing.medium,
    borderRadius: theme.borderRadius,
    backgroundColor: theme.colors.card,
    fontSize: 16,
    width: width - theme.spacing.large * 2,
  },
  button: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.medium,
    paddingHorizontal: theme.spacing.large,
    borderRadius: theme.borderRadius,
    alignItems: 'center',
    marginBottom: theme.spacing.medium,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.textSecondary,
    elevation: 0,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  error: {
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: theme.spacing.medium,
    padding: theme.spacing.small,
    backgroundColor: '#ffe6e6',
    borderRadius: 5,
  },
  link: {
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.medium,
    fontSize: 16,
  },
});