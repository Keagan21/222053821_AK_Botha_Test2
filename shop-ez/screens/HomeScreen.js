   // src/screens/HomeScreen.js
   import React from 'react';
   import { View, Text, Button, StyleSheet } from 'react-native';
   import { useAuth } from '../context/AuthContext';

   export default function HomeScreen({ navigation }) {
     const { user, logout } = useAuth();

     return (
       <View style={styles.container}>
         <Text style={styles.title}>Welcome, {user?.email}!</Text>
         <Text>You are logged in.</Text>
         <Button title="Logout" onPress={logout} />
       </View>
     );
   }

   const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
       padding: 20,
     },
     title: {
       fontSize: 24,
       marginBottom: 20,
     },
   });
   