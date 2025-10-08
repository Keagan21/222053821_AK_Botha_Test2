
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../fireBase';
import { theme, Button } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();  // For any auth checks

  const validateInputs = () => {
    if (!email || !password) {
      setError('Email and password are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email.');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    if (!validateInputs()) {
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Logged in!');
    } catch (firebaseError) {
      let message = 'Login failed.';
      switch (firebaseError.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          message = 'Invalid email or password.';
          break;
        case 'auth/invalid-email':
          message = 'Invalid email format.';
          break;
        case 'auth/too-many-requests':
          message = 'Too many failed attempts. Try again later.';
          break;
        default:
          message = firebaseError.message;
      }
      setError(message);
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to ShopEZ</Text>
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
      <Button
        title={loading ? 'Logging in...' : 'Login'}
        onPress={handleLogin}
        disabled={loading}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Register')} activeOpacity={0.7}>
        <Text style={styles.link}>Don't have an account? Register</Text>
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
    width: width - (theme.spacing.large * 2),  // Responsive width
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