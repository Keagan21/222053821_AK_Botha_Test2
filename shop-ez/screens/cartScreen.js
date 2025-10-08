   // src/screens/CartScreen.js (updated)
   import React, { useState, useEffect } from 'react';
   import {
     View,
     Text,
     FlatList,
     Image,
     TouchableOpacity,
     StyleSheet,
     ActivityIndicator,
     Alert,
     NetInfo,  // For offline detection (optional; install expo-network if needed)
   } from 'react-native';
   import { ref, onValue, update, remove } from 'firebase/database';
   import { database } from '../firebase/config';
   import { useAuth } from '../context/AuthContext';
   import { saveCartLocally, loadCartLocally } from '../utils/storage';  // New imports

   export default function CartScreen({ navigation }) {
     const { user, logout } = useAuth();
     const [cartItems, setCartItems] = useState({});
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState('');
     const [isOffline, setIsOffline] = useState(false);

     useEffect(() => {
       if (!user) return;

       const loadCart = async () => {
         setLoading(true);
         setError('');

         // Try Firebase first (online sync)
         const cartRef = ref(database, `carts/${user.uid}/items`);
         const unsubscribe = onValue(
           cartRef,
           (snapshot) => {
             const data = snapshot.val();
             const loadedCart = data || {};
             setCartItems(loadedCart);
             saveCartLocally(user.uid, loadedCart);  // Always save locally after sync
             setLoading(false);
             setIsOffline(false);
             setError('');
           },
           (err) => {
             // Firebase error (e.g., offline or network issue)
             console.log('Firebase offline, loading local cart');
             setIsOffline(true);
             const localCart = loadCartLocally(user.uid);
             setCartItems(localCart);
             setLoading(false);
             if (Object.keys(localCart).length === 0) {
               setError('Cart unavailable offline. Add items when online.');
             }
           }
         );

         return unsubscribe;
       };

       loadCart();

       // Optional: Listen for network changes (requires expo-network)
       // const unsubscribeNet = NetInfo.addEventListener(state => setIsOffline(!state.isConnected));
       // return () => unsubscribeNet();

     }, [user]);

     // Update functions: Sync to Firebase and local
     const updateQuantity = async (productId, newQuantity) => {
       if (newQuantity < 1) {
         removeItem(productId);
         return;
       }

       try {
         if (!isOffline) {
           await update(ref(database, `carts/${user.uid}/items/${productId}`), { quantity: newQuantity });
         }
         // Update local state immediately (optimistic UI)
         setCartItems(prev => {
           const updated = { ...prev, [productId]: { ...prev[productId], quantity: newQuantity } };
           saveCartLocally(user.uid, updated);  // Save locally
           return updated;
         });
       } catch (err) {
         setError('Failed to update cart');
         Alert.alert('Error', 'Could not update quantity. Check connection.');
       }
     };

     const removeItem = (productId) => {
       Alert.alert(
         'Remove Item',
         'Are you sure?',
         [
           { text: 'Cancel', style: 'cancel' },
           {
             text: 'Remove',
             onPress: async () => {
               try {
                 if (!isOffline) {
                   await remove(ref(database, `carts/${user.uid}/items/${productId}`));
                 }
                 setCartItems(prev => {
                   const updated = { ...prev };
                   delete updated[productId];
                   saveCartLocally(user.uid, updated);
                   return updated;
                 });
               } catch (err) {
                 setError('Failed to remove item');
                 Alert.alert('Error', 'Could not remove item.');
               }
             },
           },
         ]
       );
     };

     // ... rest of renderCartItem, total calculation, and JSX unchanged (but update styles in Step 4)

     // In JSX, add offline indicator:
     return (
       <View style={styles.container}>
         {/* ... header */}
         {isOffline && <Text style={styles.offlineText}>Offline Mode - Using Local Data</Text>}
         {error ? <Text style={styles.error}>{error}</Text> : null}
         {/* ... rest unchanged */}
       </View>
     );
   }

   // Add to styles:
   const styles = StyleSheet.create({
     // ... existing
     offlineText: {
       color: '#ff9500',
       textAlign: 'center',
       padding: 10,
       backgroundColor: '#fff3cd',
     },
   });
   