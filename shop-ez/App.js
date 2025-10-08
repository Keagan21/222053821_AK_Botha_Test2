import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import ProductListScreen from './screens/productListScreen';
import ProductDetailScreen from './screens/productDetailScreen';
import CartScreen from './screens/cartScreen';

const Stack = createStackNavigator();


function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.card,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          headerTintColor: theme.colors.primary,
          headerTitleStyle: { fontWeight: 'bold', fontSize: 18 },
        }}
      >
        {user ? (
          <>
            <Stack.Screen 
              name="ProductList" 
              component={ProductListScreen} 
              options={{ title: 'ShopEZ Products' }}
            />
            <Stack.Screen 
              name="ProductDetail" 
              component={ProductDetailScreen} 
              options={{ title: 'Product Details' }}
            />
            <Stack.Screen 
              name="Cart" 
              component={CartScreen} 
              options={{ title: 'Your Cart' }}
            />
          </>
        ) : (
      
          <>
            <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Register' }} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
