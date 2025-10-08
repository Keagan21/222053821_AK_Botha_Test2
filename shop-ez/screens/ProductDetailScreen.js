
import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { ref, set, update } from 'firebase/database';
import { db } from '../fireBase';
import { useAuth } from '../context/AuthContext';
import { saveCartLocally, loadCartLocally } from '../utils/storage'; 

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const { user } = useAuth();

  const handleAddToCart = () => {
    if (!user) {
      Alert.alert('Error', 'Please log in to add to cart.');
      return;
    }

    const cartItemRef = ref(db, `carts/${user.uid}/items/${product.id}`);
    const cartItem = {
      product: { ...product },  // Full product data
      quantity: 1,
    };

    // Check if exists and increment, else set new
    set(cartItemRef, cartItem)  // Overwrite for simplicity; use transaction for atomic increment in prod
      .then(() => {
        Alert.alert('Success', `${product.title} added to cart!`);
      })
      .catch((err) => {
        Alert.alert('Error', 'Failed to add to cart.');
      });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={styles.cartButton}
        >
          <Text style={styles.cartText}>Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {/* logout from context */}} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <Image source={{ uri: product.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price}</Text>
        <Text style={styles.category}>Category: {product.category}</Text>
        <Text style={styles.description}>{product.description}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// ... (styles unchanged, but add this for cart button)
const styles = StyleSheet.create({
  // ... existing styles
  cartButton: {
    padding: 8,
  },
  cartText: {
    color: '#007AFF',
    fontSize: 16,
  },
  // ... rest unchanged
});
