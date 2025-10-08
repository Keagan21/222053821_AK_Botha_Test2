 
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
     NetInfo,  
   } from 'react-native';
   import { ref, onValue, update, remove } from 'firebase/database';
   import { db } from '../fireBase'
   import { useAuth } from '../context/AuthContext';
   import { saveCartLocally, loadCartLocally } from '../utils/storage'; 

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

        
         const cartRef = ref(db, `carts/${user.uid}/items`);
         const unsubscribe = onValue(
           cartRef,
           (snapshot) => {
             const data = snapshot.val();
             const loadedCart = data || {};
             setCartItems(loadedCart);
             saveCartLocally(user.uid, loadedCart);  
             setLoading(false);
             setIsOffline(false);
             setError('');
           },
           (err) => {
    
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

     }, [user]);

     const updateQuantity = async (productId, newQuantity) => {
       if (newQuantity < 1) {
         removeItem(productId);
         return;
       }

       try {
         if (!isOffline) {
           await update(ref(db, `carts/${user.uid}/items/${productId}`), { quantity: newQuantity });
         }
         setCartItems(prev => {
           const updated = { ...prev, [productId]: { ...prev[productId], quantity: newQuantity } };
           saveCartLocally(user.uid, updated);  
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
                   await remove(ref(db, `carts/${user.uid}/items/${productId}`));
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

     return (
       <View style={styles.container}>
         {isOffline && <Text style={styles.offlineText}>Offline Mode - Using Local Data</Text>}
         {error ? <Text style={styles.error}>{error}</Text> : null}
         
       </View>
     );
   }

   
   const styles = StyleSheet.create({
     offlineText: {
       color: '#ff9500',
       textAlign: 'center',
       padding: 10,
       backgroundColor: '#fff3cd',
     },
   });
   